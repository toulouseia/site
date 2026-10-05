// Le numéro : les sujets cochés dans une récolte deviennent un fichier
// `src/donnees/numeros/numero-NN.ts`, marqué brouillon. Un brouillon se voit
// avec `npm run dev` et ne part jamais en ligne.
//
//   node outils/veille/composer.mjs recoltes/2026-09-23.md
//   node outils/veille/composer.mjs recoltes/2026-09-23.md --rediger
//   node outils/veille/composer.mjs --index
//
// Sans option, les champs à écrire en français portent « À ÉCRIRE ». Au-dessus
// de chaque entrée, un commentaire rappelle le titre d'origine, les sources et
// le numéro du sujet dans la récolte, où se trouve le résumé. Le résumé n'est
// pas recopié dans le dépôt : c'est le texte de la source, pas le nôtre.
//
// `--rediger` demande un premier jet à Claude (`claude -p`, l'outil en ligne de
// commande de Claude Code, avec l'abonnement de la personne qui le lance). Ce
// n'est qu'un premier jet : il ne sait que ce que dit le résumé, et la ligne
// « pourquoi » est celle du club, pas la sienne. Le numéro reste brouillon.
// Inria et ANITI n'accordent aucune licence de réutilisation : pour eux, seul
// le titre part chez Claude, pas le résumé.
//
// `--index` réécrit seulement `src/donnees/veille.ts` à partir des fichiers
// présents, par exemple après avoir supprimé un brouillon.
//
// Après : relire, écrire, retirer `brouillon: true`, puis
//   npm run veille:verifier

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { editeur, nettoyerLien } from "./sources.mjs";

const RACINE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const DOSSIER_NUMEROS = join(RACINE, "src/donnees/numeros");
const INDEX = join(RACINE, "src/donnees/veille.ts");
export const A_ECRIRE = "À ÉCRIRE";
export const TYPES = ["modele", "outil", "papier", "usage", "chiffre"];

const deux = (n) => String(n).padStart(2, "0");

/** Les numéros déjà écrits : [{ numero, fichier, nom }] dans l'ordre. */
export async function numerosPresents() {
  let fichiers = [];
  try {
    fichiers = await readdir(DOSSIER_NUMEROS);
  } catch {
    /* pas encore de dossier */
  }
  return fichiers
    .map((f) => f.match(/^numero-(\d+)\.ts$/))
    .filter(Boolean)
    .map((m) => ({ numero: Number(m[1]), fichier: m[0], nom: `NUMERO_${deux(m[1])}` }))
    .sort((a, b) => a.numero - b.numero);
}

export async function ecrireIndex() {
  const presents = await numerosPresents();
  const imports = presents.map((p) => `import { ${p.nom} } from "./numeros/${p.fichier.replace(/\.ts$/, "")}";`);
  const contenu = `import type { Numero } from "./types";
${imports.join("\n")}${imports.length ? "\n" : ""}
// Ce fichier s'écrit tout seul : \`node outils/veille/composer.mjs\` le refait à
// partir de \`numeros/\`. Pour ajouter un numéro, voir \`outils/veille/LISEZ-MOI.md\`.
//
// Les cinq numéros de la maquette ont été retirés le 14 septembre 2026 : ils
// étaient inventés. Un numéro marqué \`brouillon\` ne paraît qu'en développement.
export const NUMEROS: Numero[] = [${presents.map((p) => p.nom).join(", ")}];
`;
  await writeFile(INDEX, contenu);
  return presents;
}

/** Le type d'entrée le plus probable, d'après l'adresse et la rubrique. */
export function devinerType(sujet) {
  const ou = `${sujet.lien} ${sujet.reprises?.map((r) => r.rubrique).join(" ") ?? sujet.rubrique}`;
  if (/arxiv\.org|alphaxiv\.org|openreview\.net|Top Paper|papers?\b/i.test(ou)) return "papier";
  if (/huggingface\.co/i.test(ou)) return "modele";
  if (/github\.com|Top Repo|GitHub Repo/i.test(ou)) return "outil";
  return "usage";
}

/**
 * Ce qui est coché : un numéro de sujet de la récolte (`- [x] s012 · …`), ou
 * une adresse ajoutée à la main (`- [x] https://…`), pour un sujet lu dans
 * une source qu'on ne récolte pas. Dans l'ordre du fichier.
 */
export function cochesDe(markdown) {
  // Les exemples entre ``` ne comptent pas.
  const sansExemples = markdown.replace(/^```[\s\S]*?^```/gm, "");
  return [...sansExemples.matchAll(/^\s*- \[[xX]\] (s\d{3}\b|https?:\/\/\S+)/gm)].map((m) => m[1]);
}

/** Les sources dont le texte ne part pas chez Claude, faute de licence. */
const SANS_RESUME_POUR_CLAUDE = new Set(["Inria", "ANITI"]);

/** Les sources qui renvoient vers d'autres : on les crédite par « via ». */
const RELAIS = new Set(["Hacker News", "Hugging Face Papers"]);
const estRelais = (source) => RELAIS.has(source) || source.startsWith("TLDR");

/**
 * La ligne « source » de l'entrée : l'éditeur, et le relais qui nous l'a fait
 * voir si on ne l'a pas lu à la source. `openai.com` lu dans le fil d'OpenAI
 * n'a pas de « via » ; lu dans TLDR AI, il en a un.
 */
export function ligneSource(sujet) {
  const sources = [...new Set(sujet.reprises.map((r) => r.source))];
  // Les lettres TLDR sont une seule rédaction : on les crédite une fois.
  const relais = [...new Set(sources.filter(estRelais).map((x) => (x.startsWith("TLDR") ? "TLDR" : x)))];
  const direct = sources.some((x) => !estRelais(x) && x !== "à la main");
  return direct || !relais.length ? editeur(sujet.lien) : `${editeur(sujet.lien)} · via ${relais.join(" et ")}`;
}

const chaine = (s) => JSON.stringify(s);
const commentaire = (s) => s.replace(/\*\//g, "* /");

/** Coupe un texte long en lignes de commentaire de 76 signes au plus. */
function enCommentaire(texte, retrait) {
  const mots = commentaire(texte).split(/\s+/);
  const lignes = [];
  let l = "";
  for (const m of mots) {
    if ((l + " " + m).trim().length > 76) {
      lignes.push(l);
      l = m;
    } else l = (l + " " + m).trim();
  }
  if (l) lignes.push(l);
  return lignes.map((x) => `${retrait}// ${x}`).join("\n");
}

function rediger(sujets) {
  const consigne = `Tu prépares un premier jet pour la veille de Toulouse IA, une association étudiante d'intelligence artificielle à Toulouse. Chaque entrée de la veille a quatre champs, en français :

- "type" : un de ${TYPES.map((t) => `"${t}"`).join(", ")}. modele = un modèle sorti ou mis à jour ; outil = un logiciel, une bibliothèque, un dépôt ; papier = un article de recherche ; chiffre = un résultat mesuré qui fait la nouvelle ; usage = une pratique, une étude sur la façon dont on se sert de l'IA, ou le reste.
- "titre" : le nom de la chose, court, 50 signes au plus. Pas de phrase.
- "valeur" : la valeur brute, un chiffre, une capacité ou un nom. 70 signes au plus. Exemples de ton : « −40 % sur le prix, même qualité annoncée », « Un contexte de 500 000 jetons ».
- "pourquoi" : une ligne, 120 signes au plus, qui dit pourquoi un étudiant en IA à Toulouse y prêterait attention.

Ce que la veille garde : des faits. Un outil ou un dépôt qu'on peut utiliser, un modèle sorti, un billet qui explique comment une chose marche, le récit d'une équipe qui raconte comment elle a construit un projet, un papier dont l'apport se dit en mots simples. Ce qu'elle évite : les annonces vides, la peur, les avis qui ne mènent nulle part, la spéculation sur l'avenir.

Règles :
- "pourquoi" dit ce qu'on peut en faire ou ce qu'on y apprend, concrètement. Pas de jugement sur l'avenir de l'IA, pas de dramatisation.
- Pour le récit d'un projet, "valeur" dit ce qui a été construit et avec quoi, et "pourquoi" dit ce qu'on y apprend pour lancer le sien.
- Pour un papier, "valeur" et "pourquoi" disent son apport en mots simples, compréhensibles sans être spécialiste du domaine.
- Si un sujet n'est qu'un avis, une prédiction ou un texte alarmiste, tu écris "${A_ECRIRE}" dans "valeur" et "pourquoi" : un humain décidera.
- Tu n'écris que ce que dit le résumé fourni. Tu n'ajoutes aucun fait, aucun chiffre, aucune date. Si le résumé ne permet pas d'écrire un champ, tu écris "${A_ECRIRE}".
- Un chiffre annoncé par l'éditeur reste « annoncé » : tu ne le présentes pas comme vérifié.
- Français simple, phrases courtes, pas de tiret long (—) ni de tiret moyen (–), pas d'emoji, pas de point d'exclamation.

Réponds uniquement par un tableau JSON, un objet par sujet, dans l'ordre, de la forme {"id": "...", "type": "...", "titre": "...", "valeur": "...", "pourquoi": "..."}. Aucun autre texte.

Les sujets :
${JSON.stringify(
  sujets.map((s) => {
    const libre = s.reprises.some((r) => !SANS_RESUME_POUR_CLAUDE.has(r.source));
    return { id: s.id, titre: s.titre, lien: s.lien, resume: (libre && s.resume) || "(pas de résumé, seulement le titre)" };
  }),
  null,
  2,
)}`;
  console.log(`Premier jet demandé à Claude pour ${sujets.length} sujets…`);
  const r = spawnSync("claude", ["-p", "--model", "sonnet", "--tools", ""], {
    cwd: tmpdir(),
    input: consigne,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    timeout: 300000,
  });
  if (r.error || r.status !== 0) {
    console.error(`  claude n'a pas répondu (${r.error?.message ?? r.stderr?.trim() ?? r.status}). Le numéro est écrit sans premier jet.`);
    return new Map();
  }
  const brut = r.stdout.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  let jet;
  try {
    jet = JSON.parse(brut.slice(brut.indexOf("["), brut.lastIndexOf("]") + 1));
  } catch {
    console.error("  La réponse de claude n'est pas du JSON lisible. Le numéro est écrit sans premier jet.");
    return new Map();
  }
  const propre = (x, max) => {
    if (typeof x !== "string" || !x.trim()) return A_ECRIRE;
    const t = x.replace(/\s*[—–]\s*/g, ", ").trim();
    return t.length > max * 1.5 ? A_ECRIRE : t;
  };
  return new Map(
    jet.map((j) => [
      j.id,
      {
        type: TYPES.includes(j.type) ? j.type : null,
        titre: propre(j.titre, 50),
        valeur: propre(j.valeur, 70),
        pourquoi: propre(j.pourquoi, 120),
      },
    ]),
  );
}

function fichierNumero({ numero, date, recolte, sujets, jets }) {
  const n = deux(numero);
  const entrees = sujets.map((s, i) => {
    const jet = jets.get(s.id);
    const lues = [...new Set(s.reprises.map((r) => r.source))].join(", ");
    const origine = [s.id, lues, ...new Set(s.reprises.map((r) => r.origine).filter(Boolean))].join(" · ");
    const lignes = [`    // ${commentaire(origine)}`, enCommentaire(`« ${s.titre} »`, "    ")];
    lignes.push(
      "    {",
      `      id: ${chaine(`e-${n}${deux(i + 1)}`)},`,
      `      type: ${chaine(jet?.type ?? devinerType(s))},`,
      `      titre: ${chaine(jet?.titre ?? A_ECRIRE)},`,
      `      valeur: ${chaine(jet?.valeur ?? A_ECRIRE)},`,
      `      pourquoi: ${chaine(jet?.pourquoi ?? A_ECRIRE)},`,
      `      source: ${chaine(ligneSource(s))},`,
      `      lien: ${chaine(s.lien)},`,
      "    },",
    );
    return lignes.join("\n");
  });
  return `import type { Numero } from "../types";

// Veille nº ${n}, composé le ${date} à partir de la récolte ${recolte}.
// ${jets.size ? "Les champs en français sont un premier jet de Claude : à relire un par un." : `Les champs « ${A_ECRIRE} » sont à écrire.`}
// Les résumés des sources restent dans la récolte, hors du dépôt : on ne
// recopie pas leur texte ici. Chaque entrée rappelle son numéro de sujet.
// Les commentaires au-dessus de chaque entrée peuvent rester : ils ne
// s'affichent nulle part et gardent la trace de la source.
//
// Quand tout est relu : retirer \`brouillon: true\`, puis \`npm run veille:verifier\`.
export const NUMERO_${n}: Numero = {
  id: ${chaine(`n-${n}`)},
  numero: ${numero},
  date: ${chaine(date)},
  uneId: ${chaine(`e-${n}01`)},
  brouillon: true,
  entrees: [
${entrees.join("\n")}
  ],
};
`;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--index")) {
    const presents = await ecrireIndex();
    console.log(`src/donnees/veille.ts : ${presents.length} numéro(s)`);
    return;
  }
  const chemin = args.find((a) => !a.startsWith("--"));
  if (!chemin || !chemin.endsWith(".md")) {
    console.error("node outils/veille/composer.mjs recoltes/AAAA-MM-JJ.md [--rediger]\nnode outils/veille/composer.mjs --index");
    process.exit(2);
  }
  const md = await readFile(resolve(chemin), "utf8");
  const { sujets: tous } = JSON.parse(await readFile(resolve(chemin).replace(/\.md$/, ".json"), "utf8"));
  const coches = cochesDe(md);
  if (!coches.length) {
    console.error("Aucun sujet coché. Remplacer `- [ ]` par `- [x]` devant les sujets à garder.");
    process.exit(1);
  }
  const parId = new Map(tous.map((s) => [s.id, s]));
  // Une adresse ajoutée à la main devient un sujet sans titre ni résumé.
  coches
    .filter((c) => c.startsWith("http"))
    .forEach((c, i) => {
      const lien = nettoyerLien(c);
      parId.set(c, { id: `m${i + 1}`, titre: lien, resume: "", lien, reprises: [{ source: "à la main" }] });
    });
  const inconnus = coches.filter((id) => !parId.has(id));
  if (inconnus.length) {
    console.error(`Sujets absents du .json voisin : ${inconnus.join(", ")}. Le .md et le .json viennent-ils de la même récolte ?`);
    process.exit(1);
  }
  const sujets = coches.map((id) => parId.get(id));

  const presents = await numerosPresents();
  const numero = (presents.at(-1)?.numero ?? 0) + 1;
  const date = new Date().toISOString().slice(0, 10);
  const jets = args.includes("--rediger") ? rediger(sujets) : new Map();

  await mkdir(DOSSIER_NUMEROS, { recursive: true });
  const fichier = join(DOSSIER_NUMEROS, `numero-${deux(numero)}.ts`);
  await writeFile(fichier, fichierNumero({ numero, date, recolte: basename(chemin), sujets, jets }));
  await ecrireIndex();
  console.log(`Veille nº ${deux(numero)} : ${sujets.length} entrées, en brouillon`);
  console.log(`  ${fichier.slice(RACINE.length + 1)}`);
  console.log("  à voir avec `npm run dev`, sur /veille");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
