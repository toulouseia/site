import { spawnSync } from "node:child_process";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { A_ECRIRE } from "./composer.mjs";

const RACINE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const MARQUE_TRAITEE = "<!-- veille:traitee -->";
const PREFIXE_BRANCHE = "veille/vague-";
const LIMITE_TEXTE = 60000;
export const COMMANDES = ["/publier", "/tout", "/abandon"];

export function moment(maintenant, { jours, heure }) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", hour: "numeric", hourCycle: "h23" })
      .formatToParts(maintenant)
      .map((x) => [x.type, x.value]),
  );
  return { jour: maintenant.toISOString().slice(0, 10), prevu: jours.includes(p.weekday) && Number(p.hour) >= Math.max(2, heure) };
}

export function sectionsDe(md) {
  const sections = [];
  let courante = null;
  let dansCode = false;
  for (const ligne of md.split("\n")) {
    if (ligne.startsWith("```")) dansCode = !dansCode;
    if (dansCode) continue;
    if (ligne.startsWith("## ")) {
      courante = { titre: ligne.slice(3).trim(), blocs: [], liste: [] };
      sections.push(courante);
    } else if (!courante) continue;
    else if (/^- \[[ xX]\] s\d{3} /.test(ligne)) courante.blocs.push([ligne]);
    else if (/^\s{2}\S/.test(ligne) && courante.blocs.length) courante.blocs.at(-1).push(ligne);
    else if (ligne.startsWith("- ")) courante.liste.push(ligne);
  }
  return sections.map((s) => ({ ...s, blocs: s.blocs.map((b) => b.join("\n")) }));
}

function enTexte(sections) {
  const lignes = [];
  for (const s of sections) {
    if (!s.blocs.length && !s.liste.length) continue;
    lignes.push(`## ${s.titre}`, "");
    for (const b of s.blocs) lignes.push(b, "");
    for (const l of s.liste) lignes.push(l);
    if (s.liste.length) lignes.push("");
  }
  return lignes.join("\n");
}

export function corpsDuTicket(md, { date, max }) {
  const sections = sectionsDe(md);
  const gardees = [];
  const restantes = [];
  let n = 0;
  for (const s of sections) {
    const ici = s.blocs.slice(0, Math.max(0, max - n));
    n += ici.length;
    gardees.push({ ...s, blocs: ici });
    if (s.blocs.length > ici.length) restantes.push({ ...s, blocs: s.blocs.slice(ici.length), liste: [] });
  }
  const reste = restantes.reduce((t, s) => t + s.blocs.length, 0);
  const intro = [
    `Récolte du ${date}. Cochez les sujets à garder. Le premier sujet coché fait la une.`,
    "",
    "Un sujet lu ailleurs, par exemple dans AlphaSignal, s'ajoute dans un commentaire, une ligne par sujet, avec l'adresse de l'article d'origine :",
    "",
    "```",
    "- [x] https://adresse-de-l-article",
    "```",
    "",
    "Ensuite, écrivez en commentaire une de ces commandes, seule sur sa ligne :",
    "",
    "- `/publier` : le serveur rédige un premier jet et ouvre une demande de fusion à relire ;",
    "- `/tout` : il ajoute en commentaire les sujets qui ne tiennent pas ici ;",
    "- `/abandon` : il ferme ce ticket sans rien produire.",
    "",
    "Le serveur passe toutes les cinq minutes. Il n'écoute que les curateurs de `outils/veille/reglages.json`.",
    "",
    reste ? `${reste} autres sujets attendent : commentez \`/tout\` pour les voir.` : "",
    "",
  ];
  let corps = intro.join("\n") + enTexte(gardees);
  if (corps.length > LIMITE_TEXTE) corps = corps.split("\n").filter((l) => !l.startsWith("  > ")).join("\n");
  return { corps, restantes };
}

export function suiteDuTicket(restantes, limite = LIMITE_TEXTE) {
  const morceaux = [];
  let courant = [];
  let taille = 0;
  for (const s of restantes) {
    for (const b of s.blocs) {
      if (taille + b.length > limite && courant.length) {
        morceaux.push(courant);
        courant = [];
        taille = 0;
      }
      const derniere = courant.at(-1);
      if (derniere?.titre === s.titre) derniere.blocs.push(b);
      else courant.push({ titre: s.titre, blocs: [b], liste: [] });
      taille += b.length + 2;
    }
  }
  if (courant.length) morceaux.push(courant);
  return morceaux.map((m, i) => `Suite de la récolte, ${i + 1} sur ${morceaux.length}. Les cases se cochent ici aussi.\n\n${enTexte(m)}`);
}

export function commandeDe(texte) {
  const lignes = (texte ?? "").split("\n").map((l) => l.trim().toLowerCase());
  return lignes.find((l) => COMMANDES.includes(l)) ?? null;
}

export const masquer = (texte) => texte.replaceAll(RACINE, "…").replaceAll(homedir(), "~").replaceAll(tmpdir(), "…");

export const dateDuTicket = (titre) => /^Vague du (\d{4}-\d{2}-\d{2})$/.exec(titre)?.[1] ?? null;
export const ticketDeLaFusion = (corps) => Number(/Vague #(\d+)/.exec(corps ?? "")?.[1]) || null;
export const titresDuNumero = (ts) => [...ts.matchAll(/^ {6}titre: (".*"),$/gm)].map((m) => JSON.parse(m[1]));

function client({ jeton, depot, aBlanc }) {
  const appel = async (methode, chemin, corps) => {
    const r = await fetch(`https://api.github.com${chemin.replace("{depot}", depot)}`, {
      method: methode,
      headers: {
        authorization: `Bearer ${jeton}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "toulouseia-veille",
      },
      body: corps ? JSON.stringify(corps) : undefined,
    });
    if (!r.ok) throw new Error(`GitHub ${methode} ${chemin.replace("{depot}", depot)} : ${r.status} ${(await r.text()).slice(0, 300)}`);
    return r.status === 204 ? null : r.json();
  };
  const lire = (chemin) => appel("GET", chemin);
  const tout = async (chemin) => {
    const res = [];
    for (let page = 1; ; page++) {
      const lot = await lire(`${chemin}${chemin.includes("?") ? "&" : "?"}per_page=100&page=${page}`);
      res.push(...lot);
      if (lot.length < 100) return res;
    }
  };
  const ecrire = async (methode, chemin, corps) => {
    if (aBlanc) {
      console.log(`  [à blanc] ${methode} ${chemin.replace("{depot}", depot)}${corps ? `\n${JSON.stringify(corps, null, 2).slice(0, 1500)}` : ""}`);
      return { number: 0, html_url: "(à blanc)", id: 0 };
    }
    return appel(methode, chemin, corps);
  };
  return { lire, tout, ecrire };
}

function executer(commande, args, { env, accepter = [0] } = {}) {
  const r = spawnSync(commande, args, {
    cwd: RACINE,
    encoding: "utf8",
    env: { ...process.env, ...env },
    maxBuffer: 64 * 1024 * 1024,
    timeout: 20 * 60 * 1000,
  });
  if (r.error) throw r.error;
  if (!accepter.includes(r.status)) {
    const sortie = `${r.stdout ?? ""}\n${r.stderr ?? ""}`.trim().split("\n").slice(-12).join("\n");
    throw new Error(`${commande} ${args.join(" ")} a échoué :\n${sortie}`);
  }
  return r;
}

const git = (...args) => executer("git", args, { env: authGit() }).stdout.trim();

function authGit() {
  const jeton = process.env.GITHUB_TOKEN;
  if (!jeton) return {};
  const base = Buffer.from(`x-access-token:${jeton}`).toString("base64");
  return {
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${base}`,
  };
}

function remettreAZero() {
  git("fetch", "-q", "origin");
  git("reset", "-q", "--hard");
  git("clean", "-fdq", "src");
  git("checkout", "-q", "--detach", "origin/main");
}

function dependances() {
  const empreinte = executer("sh", ["-c", "cat package.json package-lock.json | sha1sum"]).stdout.split(" ")[0];
  const fichier = join(homedir(), ".cache", "vagues.deps");
  const avant = existsSync(fichier) ? spawnSync("cat", [fichier], { encoding: "utf8" }).stdout.trim() : "";
  if (avant === empreinte && existsSync(join(RACINE, "node_modules"))) return;
  executer("npm", ["install", "--no-audit", "--no-fund"]);
  git("checkout", "-q", "package-lock.json");
  spawnSync("sh", ["-c", `mkdir -p "$(dirname '${fichier}')" && echo ${empreinte} > '${fichier}'`]);
}

async function ouvrir(ctx, { force }) {
  const { reglages, gh } = ctx;
  const v = reglages.vagues_manuelles;
  if (!v.actif) return console.log("Les vagues manuelles sont coupées dans reglages.json.");
  const { jour, prevu } = moment(new Date(), v);
  if (!prevu && !force) return console.log(`Pas de vague prévue maintenant (${jour}).`);
  const titre = `Vague du ${jour}`;
  const recents = await gh.lire(`/repos/{depot}/issues?labels=${reglages.etiquette}&state=all&per_page=30`);
  if (recents.some((i) => i.title === titre)) return console.log(`${titre} : le ticket existe déjà.`);

  console.log("Récolte…");
  executer("node", ["outils/veille/recolter.mjs"]);
  const md = await readFile(join(RACINE, "recoltes", `${jour}.md`), "utf8");
  const { corps } = corpsDuTicket(md, { date: jour, max: v.sujets_dans_le_ticket });

  try {
    await gh.ecrire("POST", "/repos/{depot}/labels", { name: reglages.etiquette, color: "b5482f", description: "Une vague de la veille" });
  } catch (e) {
    if (!/ 422 /.test(e.message)) throw e;
  }
  const t = await gh.ecrire("POST", "/repos/{depot}/issues", { title: titre, body: corps, labels: [reglages.etiquette] });
  console.log(`${titre} : ${t.html_url}`);
}

const ACTIONS = {
  async "/abandon"(ctx, ticket) {
    await ctx.gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, { body: "Vague abandonnée. Le ticket est fermé." });
    await ctx.gh.ecrire("PATCH", `/repos/{depot}/issues/${ticket.number}`, { state: "closed", state_reason: "not_planned" });
  },

  async "/tout"(ctx, ticket) {
    const date = dateDuTicket(ticket.title);
    const md = await readFile(join(RACINE, "recoltes", `${date}.md`), "utf8");
    const { restantes } = corpsDuTicket(md, { date, max: ctx.reglages.vagues_manuelles.sujets_dans_le_ticket });
    const suites = suiteDuTicket(restantes);
    if (!suites.length) {
      await ctx.gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, { body: "Tous les sujets de la récolte sont déjà dans le ticket." });
    }
    for (const body of suites) await ctx.gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, { body });
  },

  async "/publier"(ctx, ticket, commentaires) {
    const { reglages, gh, moi } = ctx;
    const date = dateDuTicket(ticket.title);
    const branche = `${PREFIXE_BRANCHE}${date}`;
    const ouvertes = (await gh.tout("/repos/{depot}/pulls?state=open")).filter(
      (p) => p.head.ref.startsWith(PREFIXE_BRANCHE) && p.head.repo?.full_name === reglages.depot,
    );
    if (ouvertes.length) {
      const meme = ouvertes.find((p) => p.head.ref === branche);
      await gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, {
        body: meme
          ? `Une demande de fusion existe déjà pour cette vague : #${meme.number}. Pour recommencer, fermez-la sans fusionner, puis commentez à nouveau \`/publier\`.`
          : `Une autre vague attend encore sa fusion : #${ouvertes[0].number}. Deux numéros en même temps se marcheraient dessus. Fusionnez-la ou fermez-la, puis commentez à nouveau \`/publier\`.`,
      });
      return;
    }
    const json = join(RACINE, "recoltes", `${date}.json`);
    if (!existsSync(json)) throw new Error(`la récolte du ${date} n'est plus sur le serveur`);

    const ecoutes = commentaires.filter((c) => c.user.login === moi || reglages.curateurs.includes(c.user.login));
    const texte = [ticket.body ?? "", ...ecoutes.map((c) => c.body ?? "")].join("\n\n");
    const base = join(RACINE, "recoltes", `${date}-vague`);
    await writeFile(`${base}.md`, texte);
    await copyFile(json, `${base}.json`);

    remettreAZero();
    git("checkout", "-q", "-B", branche, "origin/main");
    executer("node", ["outils/veille/composer.mjs", `recoltes/${date}-vague.md`, "--rediger"]);
    const nouveau = git("status", "--porcelain", "--", "src/donnees/numeros")
      .split("\n")
      .map((l) => l.slice(3).trim())
      .find((f) => f.endsWith(".ts"));
    if (!nouveau) throw new Error("le composeur n'a écrit aucun numéro");
    const chemin = join(RACINE, nouveau);
    const ts = (await readFile(chemin, "utf8")).replace(/^ {2}brouillon: true,\n/m, "");
    await writeFile(chemin, ts);
    const numero = /numero-(\d+)\.ts$/.exec(nouveau)[1];
    const verif = executer("node", ["outils/veille/verifier.mjs"], { accepter: [0, 1] });
    const verifTexte = `${verif.stdout}${verif.stderr}`.trim();

    git("add", "src/donnees");
    git("commit", "-q", "-m", `Veille nº ${numero} : la vague du ${date}`);
    if (ctx.aBlanc) console.log(`  [à blanc] push ${branche}`);
    else git("push", "-q", "-f", "origin", branche);

    let apercu = "";
    if (reglages.apercu && !ctx.aBlanc) {
      try {
        dependances();
        const r = executer("npm", ["run", "deploy:apercu"]);
        const url = /Version Preview URL:\s*(\S+)/.exec(r.stdout)?.[1];
        apercu = url ? `${url.replace(/\/$/, "")}/veille/` : "";
      } catch (e) {
        console.error(`Aperçu impossible : ${e.message}`);
      }
    }

    const titres = titresDuNumero(ts);
    const aEcrire = ts.split(A_ECRIRE).length - 1;
    const mise = reglages.deployer_apres_fusion
      ? "Une fois la demande fusionnée, le serveur met le site en ligne et ferme la vague."
      : "Une fois la demande fusionnée, la mise en ligne se fait à la main.";
    const corps = [
      `Vague #${ticket.number}, ${titres.length} entrées, nº ${numero}.`,
      "",
      ...titres.map((t, i) => `${i + 1}. ${t}${i === 0 ? " (la une)" : ""}`),
      "",
      aEcrire >= titres.length * 3
        ? `Claude n'a pas pu rédiger : les ${aEcrire} champs « ${A_ECRIRE} » sont à écrire à la main. Pour écrire : onglet « Files changed », les trois points en haut du fichier, puis « Edit file ».`
        : `Les lignes en français sont un premier jet de Claude, écrit à partir des seuls résumés des sources. Relisez chacune, surtout « pourquoi », et vérifiez les chiffres dans l'article.${aEcrire ? ` ${aEcrire} champs restent « ${A_ECRIRE} ».` : ""} Pour corriger : onglet « Files changed », les trois points en haut du fichier, puis « Edit file ».`,
      "",
      "Pour changer l'ordre, déplacez les entrées. Pour changer la une, modifiez `uneId`.",
      "",
      apercu ? `Aperçu, à une adresse non listée que seuls ceux qui ont le lien connaissent : ${apercu}` : "Pas d'aperçu pour cette vague.",
      "",
      "Vérification :",
      "",
      "```",
      masquer(verifTexte),
      "```",
      "",
      verif.status === 0 ? mise : "La vérification refuse ce numéro tel quel : corrigez ce qu'elle signale avant de fusionner. " + mise,
    ].join("\n");
    const pr = await gh.ecrire("POST", "/repos/{depot}/pulls", { title: `Veille nº ${numero} : la vague du ${date}`, head: branche, base: "main", body: corps });
    await gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, { body: `Premier jet prêt à relire : ${pr.html_url}` });
  },
};

async function traiterLesFusions(ctx) {
  const { reglages, gh, moi } = ctx;
  const semaine = Date.now() - 7 * 24 * 3600 * 1000;
  const fermees = [];
  for (let page = 1; page <= 10; page++) {
    const lot = await gh.lire(`/repos/{depot}/pulls?state=closed&sort=updated&direction=desc&per_page=50&page=${page}`);
    fermees.push(...lot);
    if (lot.length < 50 || Date.parse(lot.at(-1).updated_at) < semaine) break;
  }
  for (const pr of fermees) {
    if (!pr.merged_at || !pr.head.ref.startsWith(PREFIXE_BRANCHE) || Date.parse(pr.merged_at) < semaine) continue;
    const commentaires = await gh.tout(`/repos/{depot}/issues/${pr.number}/comments`);
    if (commentaires.some((c) => c.user.login === moi && c.body?.includes(MARQUE_TRAITEE))) continue;

    remettreAZero();
    const verif = executer("node", ["outils/veille/verifier.mjs"], { accepter: [0, 1] });
    let message;
    if (verif.status !== 0) {
      message = `Fusionnée, mais la vérification refuse la veille telle qu'elle est sur main. Rien n'est mis en ligne. Corrigez sur main, puis mettez en ligne à la main.\n\n\`\`\`\n${masquer(`${verif.stdout}${verif.stderr}`.trim())}\n\`\`\``;
    } else if (!reglages.deployer_apres_fusion) {
      message = "Fusionnée. La mise en ligne automatique est coupée dans reglages.json : elle se fait à la main.";
    } else if (ctx.aBlanc) {
      console.log(`  [à blanc] mise en ligne pour #${pr.number}`);
      continue;
    } else {
      const deployeur = process.env.DEPLOYER ?? join(homedir(), "bin", "deployer");
      const r = spawnSync(deployeur, [], { encoding: "utf8", timeout: 30 * 60 * 1000 });
      console.log(r.stdout);
      message =
        r.status === 0
          ? "En ligne : https://toulouseia.fr/veille/"
          : r.status === 3
            ? "Pas mis en ligne. D'autres pages du site changent aussi : quelqu'un a poussé sur main sans mettre en ligne. Il faut une mise en ligne à la main, avec l'accord de la personne concernée."
            : "La mise en ligne a échoué. Le journal est sur le serveur, dans `~/journal/`.";
    }
    await gh.ecrire("POST", `/repos/{depot}/issues/${pr.number}/comments`, { body: `${message}\n\n${MARQUE_TRAITEE}` });
    const ticket = ticketDeLaFusion(pr.body);
    if (ticket) await gh.ecrire("PATCH", `/repos/{depot}/issues/${ticket}`, { state: "closed", state_reason: "completed" });
  }
}

async function traiterLeTicket(ctx, ticket) {
  const { reglages, gh, moi } = ctx;
  const commentaires = await gh.tout(`/repos/{depot}/issues/${ticket.number}/comments`);
  for (const c of commentaires) {
    const commande = commandeDe(c.body);
    if (!commande || !reglages.curateurs.includes(c.user.login)) continue;
    const reactions = await gh.tout(`/repos/{depot}/issues/comments/${c.id}/reactions`);
    if (reactions.some((r) => r.user.login === moi && ["eyes", "rocket", "confused"].includes(r.content))) continue;
    console.log(`#${ticket.number} ${commande} de ${c.user.login}`);
    await gh.ecrire("POST", `/repos/{depot}/issues/comments/${c.id}/reactions`, { content: "eyes" });
    try {
      await ACTIONS[commande](ctx, ticket, commentaires);
      await gh.ecrire("POST", `/repos/{depot}/issues/comments/${c.id}/reactions`, { content: "rocket" });
    } catch (e) {
      console.error(e.stack ?? e.message);
      try {
        remettreAZero();
      } catch (e2) {
        console.error(e2.message);
      }
      try {
        await gh.ecrire("POST", `/repos/{depot}/issues/${ticket.number}/comments`, {
          body: `La commande \`${commande}\` a échoué :\n\n\`\`\`\n${masquer(e.message).slice(0, 3000)}\n\`\`\`\n\nLe détail est dans le journal du serveur. Pour réessayer, écrivez la commande dans un nouveau commentaire.`,
        });
        await gh.ecrire("POST", `/repos/{depot}/issues/comments/${c.id}/reactions`, { content: "confused" });
      } catch (e3) {
        console.error(e3.message);
      }
    }
    if (commande === "/abandon") break;
  }
}

async function sonder(ctx) {
  const { reglages, gh } = ctx;
  const tickets = await gh.lire(`/repos/{depot}/issues?labels=${reglages.etiquette}&state=open&per_page=50`);
  for (const ticket of tickets.filter((t) => !t.pull_request && dateDuTicket(t.title))) {
    try {
      await traiterLeTicket(ctx, ticket);
    } catch (e) {
      console.error(`#${ticket.number} : ${e.message}`);
    }
  }
  await traiterLesFusions(ctx);
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];
  if (!["ouvrir", "sonder"].includes(action)) {
    console.error("node outils/veille/vagues.mjs ouvrir [--maintenant] [--a-blanc]\nnode outils/veille/vagues.mjs sonder [--a-blanc]");
    process.exit(2);
  }
  if (process.env.VEILLE_CLONE_JETABLE !== "1") {
    console.error("Ce programme remet son dépôt à zéro : il ne tourne que dans le clone du serveur, avec VEILLE_CLONE_JETABLE=1.");
    process.exit(2);
  }
  const aBlanc = args.includes("--a-blanc");
  const jeton = process.env.GITHUB_TOKEN;
  if (!jeton) {
    console.error("GITHUB_TOKEN manque.");
    process.exit(1);
  }
  remettreAZero();
  const reglages = JSON.parse(await readFile(join(RACINE, "outils/veille/reglages.json"), "utf8"));
  const gh = client({ jeton, depot: reglages.depot, aBlanc });
  const moi = (await gh.lire("/user")).login;
  const ctx = { reglages, gh, moi, aBlanc };
  if (action === "ouvrir") await ouvrir(ctx, { force: args.includes("--maintenant") });
  else await sonder(ctx);
  if (aBlanc) remettreAZero();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  });
}
