// La récolte : ce que les sources de la veille ont publié ces derniers jours,
// sans les encarts payés, en une liste à cocher. Rien ne part sur le site : la
// liste sert à choisir, `composer.mjs` fait le reste.
//
//   node outils/veille/recolter.mjs              les 7 derniers jours
//   node outils/veille/recolter.mjs --jours 14
//   node outils/veille/recolter.mjs --depuis 2026-09-15
//
// Écrit dans `recoltes/` (hors du dépôt, voir .gitignore) :
//   AAAA-MM-JJ.md    la liste à cocher, à ouvrir dans un éditeur
//   AAAA-MM-JJ.json  la même chose pour `composer.mjs`
//
// Politesse : une requête à la fois, une courte pause entre deux, un nom
// d'agent qui dit qui lit et comment nous joindre. Les numéros de TLDR déjà
// téléchargés sont gardés dans `recoltes/cache/` et ne se redemandent jamais.
// Une récolte par semaine suffit.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  A_LIRE_A_LA_MAIN,
  FILS,
  HF_MODELES,
  TLDR,
  cleDeLien,
  decouperFilTldr,
  decouperGitHub,
  decouperHN,
  decouperModelesHF,
  decouperPageTldr,
  decouperPapiersHF,
  editeur,
  githubNouveaux,
  hfPapiers,
  hnSemaine,
  sujetsDuFil,
  tldrFil,
  tldrPage,
  tonDuSujet,
} from "./sources.mjs";

const RACINE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SORTIE = join(RACINE, "recoltes");
const CACHE = join(SORTIE, "cache");
const AGENT = "toulouseia-veille/1 (+https://toulouseia.fr; contact@toulouseia.fr)";

function lireOptions(argv) {
  const o = { jours: 7, depuis: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--jours") o.jours = Number(argv[++i]);
    else if (argv[i] === "--depuis") o.depuis = argv[++i];
    else if (argv[i] === "--aide" || argv[i] === "-h") {
      console.log("node outils/veille/recolter.mjs [--jours N | --depuis AAAA-MM-JJ]");
      process.exit(0);
    } else {
      console.error(`Option inconnue : ${argv[i]}`);
      process.exit(2);
    }
  }
  if (o.depuis && !/^\d{4}-\d{2}-\d{2}$/.test(o.depuis)) {
    console.error("--depuis attend une date AAAA-MM-JJ");
    process.exit(2);
  }
  if (!o.depuis) {
    if (!Number.isInteger(o.jours) || o.jours < 1) {
      console.error("--jours attend un entier positif");
      process.exit(2);
    }
    o.depuis = new Date(Date.now() - o.jours * 86400000).toISOString().slice(0, 10);
  }
  return o;
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Télécharge une adresse. `garder` : la réponse ne change plus (un numéro
 * paru), on la lit depuis le disque si on l'a déjà. Rend `null` quand la page
 * n'existe pas : TLDR renvoie vers la page de la lettre un jour sans numéro.
 */
async function telecharger(url, { garder = false, json = false } = {}) {
  const fichier = join(CACHE, createHash("sha1").update(url).digest("hex").slice(0, 16));
  if (garder) {
    try {
      const corps = await readFile(fichier, "utf8");
      return json ? JSON.parse(corps) : corps;
    } catch {
      /* pas encore en cache */
    }
  }
  await pause(500);
  const r = await fetch(url, {
    headers: { "user-agent": AGENT, accept: json ? "application/json" : "*/*" },
    redirect: /^https:\/\/tldr\.tech\/[a-z]+\/\d/.test(url) ? "manual" : "follow",
    signal: AbortSignal.timeout(30000),
  });
  if (r.status >= 300 && r.status < 400) return null;
  if (!r.ok) throw new Error(`${new URL(url).hostname} a répondu ${r.status}`);
  const corps = await r.text();
  if (garder) await writeFile(fichier, corps);
  return json ? JSON.parse(corps) : corps;
}

/** Les jours de `depuis` à aujourd'hui, du plus récent au plus ancien. */
function joursDepuis(depuis, aujourdhui) {
  const jours = [];
  for (let d = new Date(`${aujourdhui}T00:00:00Z`); d >= new Date(`${depuis}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 1)) {
    jours.push(d.toISOString().slice(0, 10));
  }
  return jours;
}

/**
 * Les sources, dans l'ordre où on les lit. Chacune rend ses sujets ; une
 * source en panne n'empêche pas de lire les autres.
 */
function lecteurs(depuis, aujourdhui) {
  return [
    ...FILS.map((fil) => ({
      nom: fil.nom,
      famille: fil.famille,
      lire: async () => sujetsDuFil(fil, await telecharger(fil.url), depuis, aujourdhui),
    })),
    {
      nom: "Hugging Face Papers",
      famille: "recherche",
      lire: async () => {
        const sujets = [];
        for (const j of joursDepuis(depuis, aujourdhui)) {
          sujets.push(...decouperPapiersHF(await telecharger(hfPapiers(j), { json: true })));
        }
        return sujets;
      },
    },
    {
      nom: "Hugging Face",
      famille: "communaute",
      lire: async () => decouperModelesHF(await telecharger(HF_MODELES, { json: true }), depuis),
    },
    {
      nom: "Hacker News",
      famille: "communaute",
      lire: async () => {
        const secondes = Math.floor(new Date(`${depuis}T00:00:00Z`).getTime() / 1000);
        return decouperHN(await telecharger(hnSemaine(secondes), { json: true }));
      },
    },
    {
      nom: "GitHub",
      famille: "communaute",
      lire: async () => decouperGitHub(await telecharger(githubNouveaux(depuis), { json: true })),
    },
    ...TLDR.map((lettre) => ({
      nom: lettre.nom,
      famille: "lettres",
      lire: async () => {
        const jours = decouperFilTldr(await telecharger(tldrFil(lettre.cle)), lettre.cle).filter((j) => j >= depuis);
        const sujets = [];
        for (const j of jours) {
          const page = await telecharger(tldrPage(lettre.cle, j), { garder: true });
          if (!page) continue;
          if (!/<article class="mt-3">/.test(page)) console.warn(`  ${lettre.nom} ${j} : aucun sujet reconnu, le gabarit a peut-être changé`);
          sujets.push(...decouperPageTldr(page, j, lettre));
        }
        return sujets;
      },
    })),
  ];
}

/**
 * Un même lien repris plusieurs fois, par deux sources ou deux jours de suite,
 * devient un seul sujet, qui garde la trace de chaque reprise. Être repris est
 * un indice d'importance, pas une preuve.
 */
function fusionner(sujets) {
  const parCle = new Map();
  for (const s of sujets) {
    if (!s.lien) continue;
    const cle = cleDeLien(s.lien);
    const deja = parCle.get(cle);
    const reprise = {
      source: s.source,
      famille: s.famille,
      parution: s.parution,
      rubrique: s.rubrique,
      indice: s.indice,
      origine: s.origine,
    };
    if (!deja) {
      parCle.set(cle, { ...s, reprises: [reprise] });
      continue;
    }
    if (deja.reprises.some((r) => r.source === s.source && r.parution === s.parution)) continue;
    deja.reprises.push(reprise);
    // Le premier venu garde son titre ; on prend le résumé le plus long et la
    // date la plus ancienne, celle où le sujet est sorti.
    if (s.resume.length > deja.resume.length) deja.resume = s.resume;
    if (s.parution < deja.parution) deja.parution = s.parution;
  }
  return [...parCle.values()];
}

// Les lettres TLDR sont une seule maison : un sujet repris par TLDR AI et
// TLDR DevOps n'a été choisi que par une rédaction.
const maison = (source) => (source.startsWith("TLDR") ? "TLDR" : source);
const nbSources = (s) => new Set(s.reprises.map((r) => maison(r.source))).size;

const FAMILLES = [
  { cle: "labos", titre: "Les labos, à la source" },
  { cle: "recherche", titre: "Recherche : les papiers les plus votés" },
  { cle: "communaute", titre: "Ce que la communauté fait monter" },
  { cle: "ici", titre: "France, Europe, Toulouse" },
  { cle: "lettres", titre: "Les lettres TLDR, IA seulement" },
];

/**
 * L'ordre de la liste : d'abord ce que plusieurs sources ont repris, puis une
 * section par famille de sources. Dans chaque section, les faits concrets
 * passent avant le reste, les avis et les vitrines commerciales en dernier, puis du plus
 * récent au plus ancien. Les numéros
 * `s001`, `s002`… suivent cet ordre.
 */
function ordonner(sujets) {
  const rang = { concret: 0, "": 1, avis: 2, vitrine: 2 };
  for (const s of sujets) s.ton = tonDuSujet(s.titre, s.lien);
  const recent = (a, b) => rang[a.ton] - rang[b.ton] || b.parution.localeCompare(a.parution);
  const plusieurs = sujets
    .filter((s) => nbSources(s) > 1)
    .sort((a, b) => rang[a.ton] - rang[b.ton] || nbSources(b) - nbSources(a) || b.parution.localeCompare(a.parution));
  const groupes = plusieurs.length ? [{ titre: "Repris par plusieurs sources", sujets: plusieurs }] : [];
  for (const f of FAMILLES) {
    const de = sujets.filter((s) => s.famille === f.cle && !plusieurs.includes(s)).sort(recent);
    if (de.length) groupes.push({ titre: f.titre, sujets: de });
  }
  let n = 0;
  for (const g of groupes) for (const s of g.sujets) s.id = `s${String(++n).padStart(3, "0")}`;
  return groupes;
}

function enMarkdown(groupes, { depuis, aujourdhui, bilan }) {
  const lignes = [
    `# Récolte de la veille · ${aujourdhui}`,
    "",
    `Ce que les sources ont publié depuis le ${depuis}.`,
    "",
    ...bilan.map((b) => `- ${b}`),
    "",
    "Cochez `[x]` les sujets à garder, puis :",
    "",
    "```",
    `node outils/veille/composer.mjs recoltes/${aujourdhui}.md`,
    "```",
    "",
    "Le premier sujet coché fait la une du numéro. Un sujet lu ailleurs s'ajoute dans la dernière section, avec son adresse.",
    "",
  ];
  const bloc = (s) => {
    const indices = [...new Set(s.reprises.map((r) => r.indice).filter(Boolean))];
    const tete = [editeur(s.lien), ...indices, { avis: "avis ou spéculation ?", vitrine: "vitrine commerciale ?" }[s.ton] ?? ""].filter(Boolean).join(" · ");
    const reprises = s.reprises
      .map((r) => `${r.source} ${r.parution.slice(8, 10)}/${r.parution.slice(5, 7)}${r.rubrique ? ` (${r.rubrique})` : ""}`)
      .join(", ");
    const out = [`- [ ] ${s.id} · **${s.titre.replace(/\*/g, "")}** · ${tete}`, `  ${reprises}`, `  ${s.lien}`];
    if (s.resume) out.push(`  > ${s.resume.length > 420 ? `${s.resume.slice(0, 420).trimEnd()}…` : s.resume}`);
    return out.join("\n");
  };
  for (const g of groupes) {
    lignes.push(`## ${g.titre}`, "");
    for (const s of g.sujets) lignes.push(bloc(s), "");
  }
  lignes.push(
    "## À lire à la main",
    "",
    "Ces sources interdisent la lecture par un programme. Un sujet lu là s'ajoute ici, une ligne par sujet, cochée, avec l'adresse de la source d'origine et pas celle de la lettre :",
    "",
    "```",
    "- [x] https://adresse-de-l-article",
    "```",
    "",
    ...A_LIRE_A_LA_MAIN.map((m) => `- ${m.nom} : ${m.url} (${m.pourquoi})`),
    "",
  );
  return lignes.join("\n");
}

async function main() {
  const { depuis } = lireOptions(process.argv.slice(2));
  const aujourdhui = new Date().toISOString().slice(0, 10);
  await mkdir(CACHE, { recursive: true });

  console.log(`Récolte depuis le ${depuis}`);
  const tous = [];
  const bilan = [];
  for (const l of lecteurs(depuis, aujourdhui)) {
    try {
      const sujets = await l.lire();
      const payes = sujets.filter((s) => s.sponsor).length;
      const gardes = sujets.filter((s) => !s.sponsor);
      console.log(`  ${l.nom.padEnd(22)} ${String(gardes.length).padStart(3)} sujets${payes ? `, ${payes} encarts payés écartés` : ""}`);
      bilan.push(`${l.nom} : ${gardes.length} sujets${payes ? `, ${payes} encarts payés écartés` : ""}`);
      tous.push(...gardes.map((s) => ({ ...s, famille: l.famille })));
    } catch (e) {
      console.error(`  ${l.nom.padEnd(22)} échec, ${e.message}`);
      bilan.push(`${l.nom} : échec de la lecture (${e.message})`);
    }
  }
  if (!tous.length) {
    console.error("Rien récolté.");
    process.exit(1);
  }

  const groupes = ordonner(fusionner(tous));
  const sujets = groupes.flatMap((g) => g.sujets);

  const base = join(SORTIE, aujourdhui);
  await writeFile(`${base}.json`, `${JSON.stringify({ depuis, aujourdhui, sujets }, null, 2)}\n`);
  await writeFile(`${base}.md`, enMarkdown(groupes, { depuis, aujourdhui, bilan }));
  console.log(`${sujets.length} sujets → recoltes/${aujourdhui}.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
