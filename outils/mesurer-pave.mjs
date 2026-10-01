// ─────────────────────────────────────────────────────────────────────────────
// Relève les pavés de prose qui dépassent dix lignes RENDUES (règle 9).
//
//   node outils/mesurer-pave.mjs                tous les chapitres
//   node outils/mesurer-pave.mjs panorama       un seul
//   node outils/mesurer-pave.mjs --seuil 8      un autre seuil
//
// IL MESURE DES LIGNES, PAS DES CARACTÈRES. Compter les caractères et diviser
// par une moyenne se trompe de plusieurs lignes sur un paragraphe qui porte des
// mots longs ou des nombres : « rétropropagation » et « et » n'occupent pas la
// même place, et c'est justement la place qui fatigue le lecteur.
//
// La mesure se fait donc dans un navigateur, à la largeur réelle de la colonne
// de prose et avec la fonte réelle de l'application, en comptant les boîtes de
// ligne que le moteur de rendu produit :
//
//   article  mx-auto max-w-[44rem] px-5 lg:px-8   ->  44rem - 2 x 2rem = 640 px
//   p        t-corps text-[0.9375rem] leading-[1.62]
//
// CE QUE LA MESURE APPROCHE. Les maths en ligne sont rendues par KaTeX dans
// l'application ; ici elles sont translittérées en Unicode, comme dans l'export
// du chapitre. Les largeurs diffèrent de quelques pour cent sur un paragraphe
// qui en porte beaucoup. Le relevé le signale plutôt que de le taire.
//
// CE QUI COMPTE COMME RESPIRATION : tout bloc qui n'est pas du type « texte ».
// Une figure, une formule en display, un tableau, une liste, un encadré, un
// intertitre. PAS un changement de paragraphe : deux blocs « texte » qui se
// suivent forment un seul pavé, et leurs lignes s'additionnent.
// ─────────────────────────────────────────────────────────────────────────────

import { execFile } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const executer = promisify(execFile);
const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));
const CONTENU = resolve(RACINE, "src/serveur/depots/demo/academy/contenu");
const POLICE = resolve(RACINE, "src/fonts/Archivo.ttf");

const LARGEUR = 640; // px, la colonne de prose sur grand écran
const SEUIL_DEFAUT = 10;

const CHAPITRES = {
  panorama: "chapitre 1 · Panorama du machine learning",
  reseau: "chapitre 2 · Qu'est-ce qu'un réseau de neurones",
  descente: "chapitre 3 · La descente de gradient",
  retropropagation: "chapitre 4 · Ce que fait la rétropropagation",
  calcul: "chapitre 5 · Le calcul de la rétropropagation",
};

const NAVIGATEURS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

// ── Le texte tel qu'il s'affiche ────────────────────────────────────────────

/** Le markdown restreint, réduit à ce qui occupe de la place. */
function enClair(texte) {
  return String(texte)
    .replace(/\$([^$]+)\$/g, (_, m) => maths(m))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1");
}

/** Une translittération grossière du LaTeX en ligne : on ne cherche pas la
 *  beauté, on cherche la largeur. */
function maths(src) {
  return src
    .replace(/\\(?:mathbb|mathcal|mathbf|boldsymbol|mathrm|mathsf|text|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\(?:widehat|hat)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\\(?:theta|eta|sigma|ell|mu|lambda|delta)\b/g, "x")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}\\^_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Les pavés : des suites de blocs « texte » ───────────────────────────────

function paves(blocs) {
  const trouves = [];
  let courant = null;
  blocs.forEach((bloc, i) => {
    if (bloc.type === "texte") {
      if (!courant) courant = { debut: i, ids: [], paragraphes: [] };
      courant.ids.push(bloc.id);
      // Prose scinde sur les lignes vides : ce sont des paragraphes, pas des
      // respirations. Ils sont mesurés séparément mais comptés ensemble.
      for (const p of String(bloc.texte).split(/\n\s*\n/)) {
        if (p.trim()) courant.paragraphes.push(enClair(p.trim()));
      }
    } else if (courant) {
      courant.apres = bloc.type;
      trouves.push(courant);
      courant = null;
    }
  });
  if (courant) {
    courant.apres = "(fin de page)";
    trouves.push(courant);
  }
  return trouves;
}

// ── La mesure, dans un navigateur ───────────────────────────────────────────

async function mesurer(lots) {
  const police = await readFile(POLICE);
  const html = `<!doctype html><meta charset="utf-8">
<style>
@font-face{font-family:Archivo;src:url(data:font/ttf;base64,${police.toString("base64")});}
body{margin:0;background:#fff}
#colonne{width:${LARGEUR}px}
p{font-family:Archivo,system-ui,sans-serif;font-size:0.9375rem;line-height:1.62;
  font-variation-settings:"wght" 400,"wdth" 100;letter-spacing:0.001em;margin:0}
p+p{margin-top:0.85em}
</style>
<div id="colonne"></div><pre id="resultat"></pre>
<script>
const lots = ${JSON.stringify(lots)};
const colonne = document.getElementById("colonne");
const sortie = [];
for (const lot of lots) {
  colonne.textContent = "";
  let lignes = 0;
  for (const texte of lot.paragraphes) {
    const p = document.createElement("p");
    p.textContent = texte;
    colonne.appendChild(p);
    const r = document.createRange();
    r.selectNodeContents(p);
    // Les rectangles d'un Range sont les boîtes de ligne : on les compte par
    // leur ordonnée, deux fragments d'une même ligne partageant la leur.
    const y = new Set();
    for (const rect of r.getClientRects()) y.add(Math.round(rect.top));
    lignes += y.size || 1;
  }
  sortie.push({ clef: lot.clef, lignes });
}
document.getElementById("resultat").textContent = JSON.stringify(sortie);
</script>`;

  const dossier = await mkdtemp(join(tmpdir(), "pave-"));
  const page = join(dossier, "mesure.html");
  await writeFile(page, html, "utf8");
  try {
    let dom = null;
    for (const navigateur of NAVIGATEURS) {
      try {
        const { stdout } = await executer(
          navigateur,
          [
            "--headless",
            "--disable-gpu",
            "--virtual-time-budget=4000",
            "--dump-dom",
            pathToFileURL(page).href,
          ],
          { maxBuffer: 1 << 28 },
        );
        dom = stdout;
        break;
      } catch {
        /* on essaie le suivant */
      }
    }
    if (dom === null) {
      throw new Error(
        "aucun navigateur sans interface trouvé — voir NAVIGATEURS en tête",
      );
    }
    const m = dom.match(/<pre id="resultat">([\s\S]*?)<\/pre>/);
    if (!m) throw new Error("la page de mesure n'a rien rendu");
    const brut = m[1]
      .replaceAll("&quot;", '"')
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
    return new Map(JSON.parse(brut).map((r) => [r.clef, r.lignes]));
  } finally {
    await rm(dossier, { recursive: true, force: true });
  }
}

// ── Le relevé ───────────────────────────────────────────────────────────────

async function pagesDuChapitre(dossier) {
  const fichiers = (await readdir(join(CONTENU, dossier)))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();
  const pages = [];
  for (const f of fichiers) {
    const charge = await import(
      pathToFileURL(join(CONTENU, dossier, f)).href
    );
    pages.push({ nom: f.replace(/\.ts$/, ""), blocs: Object.values(charge)[0] });
  }
  return pages;
}

async function main() {
  const args = process.argv.slice(2);
  const iSeuil = args.indexOf("--seuil");
  const seuil = iSeuil === -1 ? SEUIL_DEFAUT : Number(args[iSeuil + 1]);
  const demandes = args.filter((a) => a in CHAPITRES);
  const chapitres = demandes.length ? demandes : Object.keys(CHAPITRES);

  const lots = [];
  const contexte = new Map();
  for (const chapitre of chapitres) {
    for (const { nom, blocs } of await pagesDuChapitre(chapitre)) {
      for (const pave of paves(blocs)) {
        const clef = `${chapitre}/${nom}/${pave.ids[0]}`;
        lots.push({ clef, paragraphes: pave.paragraphes });
        contexte.set(clef, { chapitre, page: nom, ...pave });
      }
    }
  }

  const lignes = await mesurer(lots);

  let totalPaves = 0;
  let totalFautes = 0;
  for (const chapitre of chapitres) {
    const fautes = [];
    let paves = 0;
    for (const [clef, n] of lignes) {
      const c = contexte.get(clef);
      if (c.chapitre !== chapitre) continue;
      paves += 1;
      if (n > seuil) fautes.push({ clef, n, c });
    }
    totalPaves += paves;
    totalFautes += fautes.length;
    console.log(
      `\n${"═".repeat(78)}\n${CHAPITRES[chapitre]}\n` +
        `${paves} pavés de prose, ${fautes.length} au-dessus de ${seuil} lignes\n` +
        "═".repeat(78),
    );
    fautes
      .sort((a, b) => b.n - a.n)
      .forEach(({ n, c }) => {
        const ids = c.ids.length > 1 ? `${c.ids[0]}…${c.ids.at(-1)}` : c.ids[0];
        console.log(
          `  ${String(n).padStart(3)} lignes   ${c.page.padEnd(20)} ${ids.padEnd(20)}` +
            `  ${c.ids.length} bloc(s), ${c.paragraphes.length} paragraphe(s)` +
            `  → ${c.apres}`,
        );
      });
  }
  console.log(
    `\n${totalFautes} pavé(s) au-dessus de ${seuil} lignes, sur ${totalPaves} mesurés.`,
  );
  process.exitCode = 0;
}

await main();
