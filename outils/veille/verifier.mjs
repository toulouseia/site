// Vérifie les numéros de la veille avant la mise en ligne.
//
//   npm run veille:verifier
//
// Ce qui bloque (sortie en erreur) :
//   · un numéro publié, c'est-à-dire sans `brouillon: true`, qui contient
//     encore « À ÉCRIRE » ;
//   · un identifiant en double, une une qui n'est pas dans le numéro, un type
//     inconnu, un champ vide, un lien qui n'est pas en https ou qui garde les
//     marqueurs de suivi des lettres ;
//   · un fichier de `numeros/` absent de `veille.ts`, ou le contraire.
// Ce qui prévient seulement : une ligne plus longue que ce que l'affiche
// tient, un tiret long, la liste des brouillons.
//
// Node 22 lit les fichiers `.ts` des numéros directement : ils n'importent
// qu'un type, que Node efface.

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { A_ECRIRE, DOSSIER_NUMEROS, TYPES, numerosPresents } from "./composer.mjs";

const RACINE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

// Au-delà, l'affiche 1080 × 1920 déborde ou passe sur trop de lignes.
const LONGUEURS = { titre: 60, valeur: 80, pourquoi: 140 };

const erreurs = [];
const avis = [];

const presents = await numerosPresents();
const index = await readFile(join(RACINE, "src/donnees/veille.ts"), "utf8");
for (const p of presents) {
  if (!index.includes(`./numeros/${p.fichier.replace(/\.ts$/, "")}"`) || !new RegExp(`\\b${p.nom}\\b[^;]*\\]`).test(index.split("NUMEROS")[1] ?? "")) {
    erreurs.push(`${p.fichier} n'est pas dans src/donnees/veille.ts : node outils/veille/composer.mjs --index`);
  }
}
for (const m of index.matchAll(/from "\.\/numeros\/(numero-\d+)"/g)) {
  if (!presents.some((p) => p.fichier === `${m[1]}.ts`)) erreurs.push(`veille.ts importe ${m[1]}, qui n'existe plus : node outils/veille/composer.mjs --index`);
}

const ids = new Map();
const numeros = new Set();
for (const p of presents) {
  const mod = await import(pathToFileURL(join(DOSSIER_NUMEROS, p.fichier)).href);
  const n = mod[p.nom];
  const ou = p.fichier;
  if (!n) {
    erreurs.push(`${ou} n'exporte pas ${p.nom}`);
    continue;
  }
  if (n.numero !== p.numero) erreurs.push(`${ou} : numero vaut ${n.numero}, le nom du fichier dit ${p.numero}`);
  if (numeros.has(n.numero)) erreurs.push(`${ou} : le numéro ${n.numero} existe deux fois`);
  numeros.add(n.numero);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) erreurs.push(`${ou} : date « ${n.date} » n'est pas AAAA-MM-JJ`);
  if (!Array.isArray(n.entrees) || n.entrees.length === 0) erreurs.push(`${ou} : aucune entrée`);
  if (!n.entrees?.some((e) => e.id === n.uneId)) erreurs.push(`${ou} : la une « ${n.uneId} » n'est pas une entrée du numéro`);
  if (n.brouillon) avis.push(`${ou} est en brouillon : il ne partira pas en ligne`);

  for (const id of [n.id, ...(n.entrees ?? []).map((e) => e.id)]) {
    if (ids.has(id)) erreurs.push(`${ou} : l'identifiant « ${id} » est déjà pris dans ${ids.get(id)}`);
    ids.set(id, ou);
  }

  for (const e of n.entrees ?? []) {
    const ici = `${ou} ${e.id}`;
    if (!TYPES.includes(e.type)) erreurs.push(`${ici} : type « ${e.type} » inconnu (${TYPES.join(", ")})`);
    for (const champ of ["titre", "valeur", "pourquoi", "source"]) {
      const v = e[champ];
      if (typeof v !== "string" || !v.trim()) {
        erreurs.push(`${ici} : ${champ} est vide`);
        continue;
      }
      if (v.includes(A_ECRIRE) && !n.brouillon) erreurs.push(`${ici} : ${champ} est encore « ${A_ECRIRE} »`);
      if (LONGUEURS[champ] && v.length > LONGUEURS[champ]) avis.push(`${ici} : ${champ} fait ${v.length} signes, l'affiche en tient ${LONGUEURS[champ]} à l'aise`);
      if (/[—–]/.test(v)) avis.push(`${ici} : ${champ} contient un tiret long`);
    }
    if (e.lien !== undefined) {
      let u = null;
      try {
        u = new URL(e.lien);
      } catch {
        erreurs.push(`${ici} : le lien « ${e.lien} » n'est pas une adresse`);
      }
      if (u && u.protocol !== "https:") erreurs.push(`${ici} : le lien n'est pas en https`);
      if (u && [...u.searchParams.keys()].some((k) => /^utm_/i.test(k) || k === "lid")) {
        erreurs.push(`${ici} : le lien garde un marqueur de suivi (utm_…, lid)`);
      }
    }
  }
}

for (const a of avis) console.log(`  avis    ${a}`);
for (const e of erreurs) console.log(`  ERREUR  ${e}`);
const publies = presents.length - avis.filter((a) => a.includes("brouillon")).length;
console.log(`${presents.length} numéro(s), ${publies} publié(s) · ${erreurs.length} erreur(s), ${avis.length} avis`);
process.exit(erreurs.length ? 1 : 0);
