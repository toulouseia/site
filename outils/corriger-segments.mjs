// Lancé par `npm run build`, après `next build`.
//
// SOUS WINDOWS, L'EXPORT DE NEXT 16 RANGE MAL SES FICHIERS DE PRÉCHARGEMENT.
// Pour chaque page, Next écrit un fichier par segment, que le navigateur
// demande avant qu'on clique sur un lien :
//
//   /projets/__next.!KGF0ZWxpZXIp.projets.__PAGE__.txt
//
// Le nom est fabriqué en remplaçant les « / » du chemin du segment par des
// points (`convertSegmentPathToStaticExportFilename`). Mais le chemin vient de
// `path.relative`, qui rend des « \ » sous Windows : aucun n'est remplacé, et
// `path.join` en fait des dossiers.
//
//   /projets/__next.!KGF0ZWxpZXIp/projets/__PAGE__.txt
//
// Le navigateur demande alors un fichier qui n'existe pas : un 404 par lien de
// la page, sur toutes les pages. Constaté le 25 septembre 2026 sur une version
// construite sous Windows, alors que la production, construite ailleurs, a les
// bons noms.
//
// Ce script remet chaque fichier au nom que le navigateur demande. Hors de
// Windows, il ne trouve aucun dossier de cette forme et ne fait rien.

import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");

async function fichiers(dossier, prefixe = "") {
  const liste = [];
  for (const e of await readdir(dossier, { withFileTypes: true })) {
    const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
    if (e.isDirectory()) liste.push(...(await fichiers(path.join(dossier, e.name), rel)));
    else liste.push(rel);
  }
  return liste;
}

let deplaces = 0;
let dossiers = 0;

async function parcourir(dossier) {
  for (const e of await readdir(dossier, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const ici = path.join(dossier, e.name);
    if (!e.name.startsWith("__next.")) {
      await parcourir(ici);
      continue;
    }
    for (const rel of await fichiers(ici)) {
      const nom = `${e.name}.${rel.replaceAll("/", ".")}`;
      const cible = path.join(dossier, nom);
      const deja = await stat(cible).catch(() => null);
      if (deja) throw new Error(`${cible} existe déjà : rien n'est écrasé.`);
      await rename(path.join(ici, ...rel.split("/")), cible);
      deplaces++;
    }
    await rm(ici, { recursive: true });
    dossiers++;
  }
}

await parcourir(OUT);
if (deplaces) {
  console.log(`corriger-segments : ${deplaces} fichier(s) renommé(s), ${dossiers} dossier(s) retiré(s).`);
}
