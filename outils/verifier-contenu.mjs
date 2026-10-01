// ─────────────────────────────────────────────────────────────────────────────
// Vérifie que tout ce que le contenu NOMME existe.
//
//   node outils/verifier-contenu.mjs
//
// Les blocs de leçon ne pointent pas vers des objets : ils nomment des
// identifiants, une animation du manifeste, une ressource du fonds, une
// démonstration du registre. C'est ce qui permet au contenu d'être des données
// plutôt que du code. Le prix de cette indirection est qu'une faute de frappe
// ne se voit pas à la compilation : elle produit un cadre « indisponible »
// devant un étudiant.
//
// Ce script est ce prix, payé une fois. Il transforme la faute de frappe en
// échec de construction.
//
// Zéro dépendance : il lit les fichiers et cherche les identifiants. Un
// analyseur syntaxique TypeScript serait plus exact, mais son mode d'échec
// serait de rater un identifiant, le même que celui du texte, pour cent fois
// le poids.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));
const CONTENU = join(RACINE, 'src', 'serveur', 'depots', 'demo', 'academy', 'contenu');
const MANIFESTE = join(RACINE, 'public', 'animations', 'manifeste.json');
const RESSOURCES = join(RACINE, 'src', 'serveur', 'depots', 'demo', 'club', 'ressources.ts');
const REGISTRE_DEMOS = join(RACINE, 'src', 'composants', 'academy', 'blocs', 'Demo.tsx');

const problemes = [];

function citer(texte, motif) {
  return [...texte.matchAll(motif)].map((m) => m[1]);
}

// ── Ce que le manifeste connaît ─────────────────────────────────────────────
let animationsConnues = new Set();
if (existsSync(MANIFESTE)) {
  const manifeste = JSON.parse(await readFile(MANIFESTE, 'utf8'));
  animationsConnues = new Set([
    ...(manifeste.animations ?? []).map((a) => a.id),
    ...(manifeste.prevues ?? []).map((a) => a.id),
  ]);
} else {
  problemes.push(
    `manifeste absent : ${MANIFESTE}\n` +
      `    Lancer : python animations/manifeste.py`,
  );
}

// ── Ce que le fonds contient ────────────────────────────────────────────────
const ressourcesConnues = new Set(
  citer(await readFile(RESSOURCES, 'utf8'), /^\s*id:\s*"([^"]+)"/gm),
);

// ── Ce que le registre de démonstrations enregistre ─────────────────────────
const registre = await readFile(REGISTRE_DEMOS, 'utf8');
const bloc = registre.slice(
  registre.indexOf('const REGISTRE'),
  registre.indexOf('};', registre.indexOf('const REGISTRE')),
);
const demosConnues = new Set(citer(bloc, /"([^"]+)":/g));

// ── Ce que le contenu nomme ─────────────────────────────────────────────────
// La lecture DESCEND dans les sous-dossiers. Un chapitre range ses sections
// dans un dossier a lui, et une lecture a plat les manquait toutes en silence :
// le compte annonce restait juste pour les fichiers vus, ce qui est la pire
// facon de rater quelque chose.
async function fichiersDeContenu(dossier) {
  const trouves = [];
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) trouves.push(...(await fichiersDeContenu(chemin)));
    else if (entree.name.endsWith('.ts')) trouves.push(chemin);
  }
  return trouves;
}

const fichiers = await fichiersDeContenu(CONTENU);
if (fichiers.length === 0) problemes.push(`aucun fichier de contenu dans ${CONTENU}`);

let cites = 0;
const ancres = new Map();
// Une animation appartient à une page et à une seule. Servir deux fois la même
// vidéo dit à l'étudiant qu'on n'avait rien à ajouter. Voir la règle 17 de
// src/serveur/depots/demo/academy/contenu/REGLES.md.
const animationsPosees = new Map();

for (const chemin of fichiers) {
  // Le chemin affiche reste relatif au dossier de contenu : c'est ce qu'on
  // tape pour ouvrir le fichier, pas un chemin de machine.
  const fichier = relative(CONTENU, chemin).replaceAll('\\', '/');
  const texte = await readFile(chemin, 'utf8');

  for (const id of citer(texte, /animationId:\s*"([^"]+)"/g)) {
    cites += 1;
    if (!animationsConnues.has(id)) {
      problemes.push(
        `${fichier} : animation « ${id} » absente du manifeste.\n` +
          `    Déclarer la scène dans animations/scenes/, puis relancer ` +
          `python animations/manifeste.py`,
      );
    }
    if (animationsPosees.has(id)) {
      problemes.push(
        `animation servie deux fois : « ${id} »\n` +
          `    déjà posée dans ${animationsPosees.get(id)}, reprise dans ${fichier}.\n` +
          `    Une page a ses propres scènes : en écrire une neuve, sous un ` +
          `autre angle, ou retirer la reprise.`,
      );
    }
    animationsPosees.set(id, fichier);
  }

  for (const id of citer(texte, /ressourceId:\s*"([^"]+)"/g)) {
    cites += 1;
    if (!ressourcesConnues.has(id)) {
      problemes.push(`${fichier} : ressource « ${id} » absente du fonds.`);
    }
  }

  for (const nom of citer(texte, /^\s*demo:\s*"([^"]+)"/gm)) {
    cites += 1;
    if (!demosConnues.has(nom)) {
      problemes.push(
        `${fichier} : démonstration « ${nom} » absente du registre ` +
          `(composants/academy/blocs/Demo.tsx).`,
      );
    }
  }

  // Les identifiants de blocs doivent être uniques : React s'en sert comme clé,
  // et une ancre en double rend un lien ambigu.
  for (const id of citer(texte, /^\s*id:\s*"(b-[^"]+)"/gm)) {
    if (ancres.has(id)) {
      problemes.push(
        `identifiant de bloc en double : « ${id} » ` +
          `(${ancres.get(id)} et ${fichier})`,
      );
    }
    ancres.set(id, fichier);
  }
}

// ── Le verdict ──────────────────────────────────────────────────────────────
if (problemes.length > 0) {
  console.error('\n  Contenu incohérent :\n');
  for (const probleme of problemes) console.error(`  ✗ ${probleme}\n`);
  process.exit(1);
}

console.log(
  `  ✓ ${cites} référence(s) vérifiée(s) dans ${fichiers.length} fichier(s) · ` +
    `${ancres.size} blocs · ${animationsConnues.size} animation(s) au manifeste`,
);
