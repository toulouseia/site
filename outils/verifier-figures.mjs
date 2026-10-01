// ─────────────────────────────────────────────────────────────────────────────
// Le plus petit texte d'une figure se lit comme le corps de la page.
//
//   node outils/verifier-figures.mjs                 les deux chapitres
//   node outils/verifier-figures.mjs lecon2          un seul
//   node outils/verifier-figures.mjs --detail        chaque texte fautif
//
// LA MESURE, et elle est refaisable. Le corps d'une leçon est composé à
// `text-[0.9375rem]`, soit 15 px — voir `t-corps` dans src/composants/academy/
// blocs/prose.tsx. L'article est en `max-w-[44rem]` avec `lg:px-8`, donc une
// colonne de 44 × 16 − 2 × 32 = 640 px : c'est la même largeur que celle que
// `outils/mesurer-pave.mjs` emploie pour compter les lignes rendues. Une figure
// est servie en `w-full` dans cette colonne ; un SVG large de 1380 s'y affiche
// donc réduit de 1380 / 640 = 2,156.
//
//     taille minimale = 15 × 1380 / 640 = 32,3  →  33
//
// Un texte de figure sous 33 s'affiche donc SOUS le corps de la page, et le
// lecteur passe d'un texte lisible à un texte qui ne l'est pas sans que rien ne
// le prévienne. C'est la règle 32 de REGLES.md.
//
// QUARANTE CARACTÈRES. Une figure porte des étiquettes, pas des phrases : un
// symbole, une valeur, un mot ou deux. Au-delà de quarante caractères, ce n'est
// plus une étiquette, et le texte a sa place dans la légende du bloc ou dans la
// lecture guidée — là où il est composé au corps de la page, et où un lecteur
// d'écran le trouve.
//
// CE QUE LE CONTRÔLE NE VOIT PAS. Il lit les attributs `font-size` du SVG ; il
// ne rend rien. Une figure dont le texte est à la bonne taille mais qui déborde
// de son cadre lui échappe — c'est le crible de recouvrement qui le voit.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));

export const CORPS_PX = 15; // src/composants/academy/blocs/prose.tsx
export const COLONNE_PX = 640; // max-w-[44rem] moins lg:px-8
export const LARGEUR_SVG = 1380; // toutes les figures du cours
export const TAILLE_MIN = Math.ceil((CORPS_PX * LARGEUR_SVG) / COLONNE_PX);
export const CARACTERES_MAX = 40;

const CHAPITRES = ['lecon1', 'lecon2'];

// LES ENTITES SE DECODENT AVANT DE COMPTER. Une ligne de programme s'ecrit
// dans le SVG avec ses espaces en `&#160;`, sans quoi le rendu les mange :
// « z += w[i] * x[i] » y occupe vingt caracteres et en compterait soixante.
// C'est le texte QUE LE LECTEUR VOIT qu'on mesure, pas sa transcription.
function decoder(t) {
  return t
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function textes(svg) {
  const trouves = [];
  const motif = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  for (const m of svg.matchAll(motif)) {
    const taille = /font-size="([\d.]+)"/.exec(m[1]);
    // Les tspan d'un indice portent leur propre taille ; on garde la plus
    // petite, c'est elle que le lecteur doit pouvoir lire.
    const tailles = [
      ...(taille ? [Number(taille[1])] : []),
      ...[...m[2].matchAll(/font-size="([\d.]+)"/g)].map((t) => Number(t[1])),
    ];
    trouves.push({
      taille: tailles.length ? Math.min(...tailles) : null,
      contenu: decoder(m[2].replace(/<[^>]+>/g, '')).trim(),
    });
  }
  return trouves;
}

const demandes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const detail = process.argv.includes('--detail');
const chapitres = demandes.length ? demandes : CHAPITRES;

const fautes = [];
let figures = 0;
let textesLus = 0;

for (const chapitre of chapitres) {
  const dossier = join(RACINE, 'public', 'cours', chapitre);
  let noms;
  try {
    noms = (await readdir(dossier)).filter((n) => n.endsWith('.svg')).sort();
  } catch {
    fautes.push({ figure: chapitre, motif: `dossier absent : ${dossier}` });
    continue;
  }
  for (const nom of noms) {
    figures += 1;
    const svg = await readFile(join(dossier, nom), 'utf8');
    for (const { taille, contenu } of textes(svg)) {
      if (!contenu) continue;
      textesLus += 1;
      if (taille !== null && taille < TAILLE_MIN) {
        fautes.push({
          figure: `${chapitre}/${nom}`,
          motif: `taille ${taille} < ${TAILLE_MIN}`,
          contenu,
        });
      }
      if ([...contenu].length > CARACTERES_MAX) {
        fautes.push({
          figure: `${chapitre}/${nom}`,
          motif: `${[...contenu].length} caractères > ${CARACTERES_MAX}`,
          contenu,
        });
      }
    }
  }
}

if (fautes.length === 0) {
  console.log(
    `  ✓ ${figures} figure(s), ${textesLus} texte(s) · ` +
      `taille minimale ${TAILLE_MIN}, ${CARACTERES_MAX} caractères au plus`,
  );
  process.exit(0);
}

const parFigure = new Map();
for (const f of fautes) {
  if (!parFigure.has(f.figure)) parFigure.set(f.figure, []);
  parFigure.get(f.figure).push(f);
}

console.error(
  `\n  ${fautes.length} faute(s) sur ${parFigure.size} figure(s), ` +
    `${figures} examinée(s). Taille minimale ${TAILLE_MIN}, ` +
    `${CARACTERES_MAX} caractères au plus.\n`,
);
for (const [figure, liste] of [...parFigure].sort()) {
  const petites = liste.filter((f) => f.motif.startsWith('taille'));
  const longs = liste.filter((f) => !f.motif.startsWith('taille'));
  const min = petites.length
    ? Math.min(...petites.map((f) => Number(/taille ([\d.]+)/.exec(f.motif)[1])))
    : null;
  console.error(
    `  ✗ ${figure.padEnd(44)} ` +
      `${petites.length} sous ${TAILLE_MIN}${min !== null ? ` (min ${min})` : ''}` +
      `${longs.length ? ` · ${longs.length} trop long(s)` : ''}`,
  );
  if (detail) {
    for (const f of liste) console.error(`      ${f.motif.padEnd(26)} « ${f.contenu} »`);
  }
}
if (!detail) console.error('\n  Relancer avec --detail pour voir chaque texte.');
process.exit(1);
