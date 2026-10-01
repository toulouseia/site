// ─────────────────────────────────────────────────────────────────────────────
// Export d'un chapitre de l'Academy en texte.
//
//   node outils/exporter-chapitre.mjs <contenu> <scènes> [sortie]
//
// depuis app/application. Par exemple :
//
//   node outils/exporter-chapitre.mjs \
//     src/serveur/depots/demo/academy/contenu/reseau animations/scenes/reseau
//
// Sans troisième argument, le fichier est écrit à la racine du dépôt sous le
// nom cours-lecon<rang>-texte.txt, le rang étant celui du chapitre dans le
// cours.
//
// RIEN N'EST RECOPIÉ À LA MAIN. Les blocs sont lus dans les fichiers de contenu
// eux-mêmes : une page est un `export const X: Bloc[] = [...]`, c'est-à-dire un
// littéral JavaScript une fois l'import de type retiré. L'ordre des pages et
// leurs identifiants de leçon sont lus dans l'index du chapitre — `index.ts`
// dans le répertoire, ou le fichier de même nom à côté, comme panorama.ts. Le
// sommaire, le cours et le parcours viennent de sommaires.ts, cours.ts et
// parcours.ts. Les scènes sont lues par `ast`, parce que ces modules importent
// manim et ne s'importent pas ici. Les durées viennent du manifeste.
//
// Cet outil remplace cours/lecon2/exporter-texte.mjs, dont il reprend le moteur
// de rendu — LaTeX vers Unicode, mise en page, blocs — à un cas près : le bloc
// « exercice », que le chapitre 2 ne porte pas et que trois autres portent, et
// que l'ancien moteur laissait sortir « non rendu ».
//
// Réexécuter après toute modification d'un chapitre : le fichier exporté n'est
// pas une source, c'est une vue.
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, '..');
const DEPOT = resolve(RACINE, '..', '..');
const ACADEMY = join(RACINE, 'src/serveur/depots/demo/academy');
const LARGEUR = 80;

if (process.argv.length < 4) {
  console.error(
    'usage : node outils/exporter-chapitre.mjs <contenu> <scènes> [sortie]\n'
    + '   ex. : node outils/exporter-chapitre.mjs \\\n'
    + '           src/serveur/depots/demo/academy/contenu/reseau animations/scenes/reseau',
  );
  process.exit(2);
}
const CONTENU = resolve(process.cwd(), process.argv[2]);
const SCENES = resolve(process.cwd(), process.argv[3]);
for (const [quoi, ou] of [['contenu', CONTENU], ['scènes', SCENES]]) {
  if (!existsSync(ou)) {
    console.error(`répertoire de ${quoi} introuvable : ${ou}`);
    process.exit(2);
  }
}
const SCENES_REL = relative(RACINE, SCENES).replace(/\\/g, '/');

const bac = await mkdtemp(join(tmpdir(), 'export-chapitre-'));

// ── Un module TypeScript, lu comme le littéral qu'il est ────────────────────
//
// L'import de type disparaît, la déclaration de type aussi, l'annotation de la
// constante exportée aussi, et ce qui reste s'importe. Aucun transpileur : ces
// fichiers sont des données.
//
// LA DÉCLARATION DE TYPE EXPORTÉE. Le fichier réécrit porte l'extension .mjs,
// et Node ne retire aucun type d'un .mjs : c'est du JavaScript, où
// `export type X = …` est une erreur de syntaxe. `sommaires.ts` en porte une
// depuis que la durée d'une leçon se calcule au lieu de s'écrire —
// `export type LeconEcrite = Omit<Lecon, "minutes">` — et l'export de
// n'importe quel chapitre échouait dessus.

async function importerTs(chemin) {
  const js = (await readFile(chemin, 'utf8'))
    .replace(/^import type .*$/gm, '')
    .replace(/^export type [^=\n]+=[^;]*;$/gm, '')
    .replace(/^export const ([A-Za-z0-9_]+): [^=\n]+=/gm, 'export const $1 =');
  const cible = join(bac, `${basename(chemin, '.ts')}.mjs`);
  await writeFile(cible, js, 'utf8');
  return import(pathToFileURL(cible).href);
}

/** Une page : le tableau de blocs qu'elle exporte, et rien d'autre. */
async function charger(chemin) {
  const brut = await readFile(chemin, 'utf8');
  const js = brut
    .replace(/^import type .*$/m, '')
    .replace(/export const [A-Z0-9_]+: Bloc\[\] =/, 'export default');
  const cible = join(bac, `page-${basename(chemin, '.ts')}.mjs`);
  await writeFile(cible, js, 'utf8');
  return (await import(pathToFileURL(cible).href)).default;
}

// ── L'index du chapitre : l'ordre des pages, et à quelle leçon chacune va ────

const INDEX = existsSync(join(CONTENU, 'index.ts'))
  ? join(CONTENU, 'index.ts')
  : `${CONTENU}.ts`;
if (!existsSync(INDEX)) {
  console.error(
    `index introuvable : ni ${join(CONTENU, 'index.ts')} ni ${CONTENU}.ts.\n`
    + "L'index est le seul endroit qui donne l'ordre des pages et leurs leçons.",
  );
  process.exit(2);
}
const brutIndex = await readFile(INDEX, 'utf8');

const IMPORTS = new Map(
  [...brutIndex.matchAll(/^import \{ ([A-Za-z0-9_]+) \} from "([^"]+)";$/gm)]
    .map((m) => [m[1], m[2]]),
);
const debutRecord = brutIndex.indexOf('export const CONTENU_');
if (debutRecord < 0) {
  console.error(`${INDEX} : aucun « export const CONTENU_… » à lire.`);
  process.exit(2);
}
const corpsRecord = brutIndex.slice(debutRecord, brutIndex.indexOf('\n};', debutRecord));
const PAGES = [...corpsRecord.matchAll(/^ {2}"([a-z0-9-]+)": ([A-Za-z0-9_]+),$/gm)]
  .map(([, lecon, symbole]) => {
    const chemin = IMPORTS.get(symbole);
    if (!chemin) {
      console.error(`${INDEX} : « ${symbole} » est dans le record mais n'est pas importé.`);
      process.exit(2);
    }
    return { lecon, fichier: resolve(dirname(INDEX), `${chemin}.ts`) };
  });
if (PAGES.length === 0) {
  console.error(`${INDEX} : le record est vide, ou son écriture a changé.`);
  process.exit(2);
}

/** L'en-tête de commentaires de l'index, tel qu'il est écrit. */
function enTeteIndex(source) {
  const lignes = source.split('\n');
  const debut = lignes.findIndex((l) => /^\/\/ ─{10,}/.test(l));
  if (debut < 0) return [];
  const fin = lignes.findIndex((l, i) => i > debut && /^\/\/ ─{10,}/.test(l));
  if (fin < 0) return [];
  return lignes.slice(debut + 1, fin).map((l) => l.replace(/^\/\/ ?/, '').trimEnd());
}

// ── Le manifeste : les durées, et ce qui est rendu ──────────────────────────

const manifeste = JSON.parse(
  await readFile(join(RACINE, 'public/animations/manifeste.json'), 'utf8'),
);
const DUREES = new Map();
const RENDUES = new Set();
for (const a of manifeste.animations ?? []) {
  DUREES.set(a.id, a.duree ?? null);
  RENDUES.add(a.id);
}
for (const a of manifeste.prevues ?? []) DUREES.set(a.id, a.duree ?? null);

// ── Les scènes, lues par `ast` : ces modules importent manim ────────────────

const LECTEUR_DE_SCENES = `
import ast, json, sys
from pathlib import Path
scenes = []
for chemin in sorted(Path(sys.argv[1]).glob("*.py")):
    if chemin.name == "__init__.py":
        continue
    for noeud in ast.parse(chemin.read_text(encoding="utf-8")).body:
        if not isinstance(noeud, ast.Assign):
            continue
        if "ANIMATIONS" not in [c.id for c in noeud.targets if isinstance(c, ast.Name)]:
            continue
        for entree in ast.literal_eval(noeud.value):
            entree["fichier"] = chemin.name
            scenes.append(entree)
sys.stdout.reconfigure(encoding="utf-8")
print(json.dumps(scenes, ensure_ascii=False))
`;

const bacScenes = join(bac, 'scenes.py');
await writeFile(bacScenes, LECTEUR_DE_SCENES, 'utf8');
const SCENE = new Map(
  JSON.parse(
    execFileSync('python', [bacScenes, SCENES], {
      encoding: 'utf8',
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      maxBuffer: 64 * 1024 * 1024,
    }),
  ).map((s) => [s.id, s]),
);

// ── Les nombres, en toutes lettres ──────────────────────────────────────────

const UNITES = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
  'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
];
const DIZAINES = {
  2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante',
  8: 'quatre-vingt',
};

function enLettres(n) {
  if (n < 17) return UNITES[n];
  if (n < 20) return `dix-${UNITES[n - 10]}`;
  if (n >= 100) return String(n);
  const d = Math.floor(n / 10);
  const u = n % 10;
  if (d === 7 || d === 9) {
    const base = d === 7 ? 'soixante' : 'quatre-vingt';
    return `${base}-${enLettres(n - (d === 7 ? 60 : 80))}`;
  }
  if (u === 0) return d === 8 ? 'quatre-vingts' : DIZAINES[d];
  if (u === 1 && d !== 8) return `${DIZAINES[d]} et un`;
  return `${DIZAINES[d]}-${UNITES[u]}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CE QUI N'EST PAS DÉDUCTIBLE DU DÉPÔT
//
// La table est VIDE, et c'est son état normal. Elle n'existe que pour un
// passage qu'AUCUNE lecture du dépôt ne peut produire — ni le contenu, ni
// l'en-tête de l'index, ni les scènes, ni les programmes de mesures.
//
// TOUTE ENTRÉE PORTE SON CHAMP `pourquoi`, qui dit ce qui empêche de la
// dériver. C'est la seule chose qui empêche cette table de devenir le
// dépotoir de ce qu'on n'a pas pris la peine de déduire : une entrée sans
// raison écrite est une entrée à supprimer, pas à conserver.
//
// L'exportateur du chapitre 2, que celui-ci remplace, en portait deux, écrites
// à la main — ce que le chapitre ne fait pas, et ce que son programme de
// mesures calcule. Les deux sont retirées, parce que les deux se dérivent :
//
//   · la section « C. CE QUE L'INDEX DU CHAPITRE DIT » cite l'en-tête de
//     reseau/index.ts, qui dit l'un et l'autre, pour les cinq chapitres ;
//   · la section « LES PROGRAMMES, ET LES MESURES QU'ILS PRODUISENT »
//     reconstruit la seconde depuis les blocs SORTIE et les docstrings.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @type {Record<string, { pourquoi: string, neFaitPas?: string }>}
 * Chaque entrée DOIT porter `pourquoi`. Voir le commentaire ci-dessus.
 */
const PARTICULARITES = {};
const PARTICULARITE = PARTICULARITES[basename(CONTENU)] ?? {};

// ─────────────────────────────────────────────────────────────────────────────
// LaTeX → Unicode
// ─────────────────────────────────────────────────────────────────────────────

const GREC = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', eta: 'η',
  theta: 'θ', lambda: 'λ', mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ',
  tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Delta: 'Δ', Gamma: 'Γ', Lambda: 'Λ', Omega: 'Ω', Sigma: 'Σ', Theta: 'Θ',
};

const SYMBOLES = {
  times: '×', in: '∈', notin: '∉', rightarrow: '→', longrightarrow: '⟶',
  Longrightarrow: '⟹', Rightarrow: '⇒', leftrightarrow: '↔', mapsto: '↦',
  geq: '≥', leq: '≤', neq: '≠', approx: '≈', cong: '≅', equiv: '≡',
  forall: '∀', exists: '∃', subseteq: '⊆', subset: '⊂', supseteq: '⊇',
  setminus: '∖', cup: '∪', cap: '∩', bigcup: '⋃', bigcap: '⋂',
  circ: '∘', cdot: '·', cdots: '⋯', ldots: '…', dots: '…', infty: '∞',
  sum: 'Σ', prod: 'Π', partial: '∂', nabla: '∇', ell: 'ℓ', prime: '′',
  langle: '⟨', rangle: '⟩', mid: '|', pm: '±', to: '→', star: '⋆',
  emptyset: '∅', land: '∧', lor: '∨', neg: '¬', perp: '⊥', angle: '∠',
};

const AJOURE = {
  R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', E: '𝔼', P: 'ℙ', 1: '𝟙',
};
const RONDE = {
  M: 'ℳ', L: 'ℒ', D: '𝒟', X: '𝒳', Y: '𝒴', F: 'ℱ', N: '𝒩', P: '𝒫',
  A: '𝒜', B: 'ℬ', C: '𝒞', E: 'ℰ', H: 'ℋ', S: '𝒮', T: '𝒯',
};
const EXPOSANTS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '+': '⁺', '(': '⁽', ')': '⁾' };

/** Le contenu de la première accolade à partir de `i` (qui doit valoir '{'). */
function accolade(s, i) {
  let profondeur = 0;
  for (let k = i; k < s.length; k += 1) {
    if (s[k] === '{') profondeur += 1;
    else if (s[k] === '}') {
      profondeur -= 1;
      if (profondeur === 0) return [s.slice(i + 1, k), k + 1];
    }
  }
  return [s.slice(i + 1), s.length];
}

/** Remplace `\nom{...}` par f(contenu), en respectant l'imbrication. */
function commande(s, nom, f) {
  const marque = `\\${nom}{`;
  let out = '';
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf(marque, i);
    if (j === -1) return out + s.slice(i);
    out += s.slice(i, j);
    const [dedans, fin] = accolade(s, j + marque.length - 1);
    out += f(dedans);
    i = fin;
  }
  return out;
}

/** Remplace `\nom{a}{b}`. */
function commande2(s, nom, f) {
  const marque = `\\${nom}{`;
  let out = '';
  let i = 0;
  while (i < s.length) {
    const j = s.indexOf(marque, i);
    if (j === -1) return out + s.slice(i);
    out += s.slice(i, j);
    const [a, apresA] = accolade(s, j + marque.length - 1);
    let k = apresA;
    while (s[k] === ' ') k += 1;
    if (s[k] !== '{') { out += f(a, ''); i = apresA; continue; }
    const [b, apresB] = accolade(s, k);
    out += f(a, b);
    i = apresB;
  }
  return out;
}

function estAtome(x) {
  return /^[A-Za-zΑ-Ωα-ω0-9ℝℕℤℚℂ]$/.test(x) || /^\(.*\)$/.test(x);
}

export function tex(source) {
  if (!source) return '';
  let s = source;

  // Le separateur decimal francais du contenu.
  s = s.replace(/\{,\}/g, ',');

  // Les environnements d'alignement deviennent des sauts de ligne.
  s = s.replace(/\\begin\{[a-z*]+\}/g, '').replace(/\\end\{[a-z*]+\}/g, '');
  s = s.replace(/\\\\/g, '\n');

  // Les polices.
  s = commande(s, 'mathbb', (c) => AJOURE[c] ?? c);
  s = commande(s, 'mathcal', (c) => RONDE[c] ?? c);
  s = commande(s, 'mathbf', (c) => c);
  s = commande(s, 'boldsymbol', (c) => c);
  s = commande(s, 'mathsf', (c) => c);
  s = commande(s, 'mathrm', (c) => c);
  s = commande(s, 'operatorname', (c) => c);
  s = commande(s, 'text', (c) => c);
  s = commande(s, 'textstyle', (c) => c);
  s = commande(s, 'widehat', (c) => (c.length === 1 ? chapeau(c) : `${c}̂`));
  s = commande(s, 'hat', (c) => (c.length === 1 ? chapeau(c) : `${c}̂`));
  s = commande(s, 'bar', (c) => `${c}̄`);
  s = commande(s, 'widetilde', (c) => `${c}̃`);
  s = commande(s, 'tilde', (c) => `${c}̃`);
  s = commande(s, 'sqrt', (c) => `√(${c})`);
  s = commande2(s, 'frac', (a, b) => fraction(a, b));
  s = commande2(s, 'tfrac', (a, b) => fraction(a, b));
  s = commande2(s, 'dfrac', (a, b) => fraction(a, b));
  s = commande2(s, 'binom', (a, b) => `C(${a}, ${b})`);
  s = commande2(s, 'underbrace', (a, b) => (b ? `${a} [${b}]` : a));
  s = s.replace(/\\underbrace/g, '');
  s = commande(s, 'xrightarrow', (c) => ` --${c}--> `);

  // Les intervalles d'entiers.
  s = s.replace(/\[\\!\[/g, '⟦').replace(/\]\\!\]/g, '⟧');

  // Les tailles de délimiteurs, puis les délimiteurs échappés.
  s = s.replace(/\\(bigg|Bigg|big|Big|left|right)\b/g, '');
  s = s.replace(/\\([{}|%&#$_])/g, '$1');

  // Les espaces typographiques.
  s = s.replace(/\\qquad/g, '       ').replace(/\\quad/g, '    ');
  s = s.replace(/\\[,;:!]/g, ' ').replace(/\\ /g, ' ');

  // Les commandes de style sans argument disparaissent.
  s = s.replace(/\\(textstyle|displaystyle|limits|nolimits)(?![A-Za-z])/g, '');

  // Les opérateurs nommés, les lettres grecques, les symboles.
  s = s.replace(/\\arg\s*\\(max|min)/g, 'arg$1');
  s = s.replace(
    /\\(argmax|argmin|max|min|exp|log|ln|sin|cos|tan|det|dim|ker|lim|sup|inf|deg)(?![A-Za-z])/g,
    '$1',
  );

  // Un mot de contrôle LaTeX mange le blanc qui le suit : « 10\times 784 »
  // s'écrit 10×784. On prend le plus long nom CONNU, car un remplacement de
  // police a pu coller une lettre derrière : \mapsto\mathbf{w} est devenu
  // \mapstow au moment où \mathbf a été traité.
  s = s.replace(/\\([A-Za-z]+)( ?)/g, (m, nom, blanc) => {
    for (let n = nom.length; n > 0; n -= 1) {
      const r = GREC[nom.slice(0, n)] ?? SYMBOLES[nom.slice(0, n)];
      if (r !== undefined) return r + nom.slice(n) + blanc;
    }
    return m;
  });

  // Une relation binaire respire, un opérateur reste collé.
  s = s.replace(/ ?([∈∉⊆⊂⊇≥≤≠≈≅≡↦⟹⇒↔→]) ?/g, ' $1 ');
  s = s.replace(/([∀∃]) ?/g, '$1 ');
  s = s.replace(/ {2,}(?=\S)/g, ' ');
  s = s.replace(/([{(⟦⟨]) /g, '$1').replace(/ ([})⟧⟩,;])/g, '$1');

  // Les exposants et les indices.
  s = exposants(s);
  s = s.replace(/_\{([^{}]*)\}(.?)/g, (m, c, apres) =>
    (estAtome(c) && !/[A-Za-z0-9]/.test(apres) ? `_${c}${apres}` : `_{${c}}${apres}`));
  s = s.replace(/\^\{([^{}]*)\}(.?)/g, (m, c, apres) =>
    (estAtome(c) && !/[A-Za-z0-9]/.test(apres) ? `^${c}${apres}` : `^{${c}}${apres}`));

  return s.replace(/[ \t]{2,}(?=[^ \t])/g, (m) => m).replace(/\s+$/gm, '');
}

function chapeau(c) {
  const table = { y: 'ŷ', x: 'x̂', a: 'â', c: 'ĉ', z: 'ẑ', w: 'ŵ', u: 'û', p: 'p̂', Y: 'Ŷ', X: 'X̂', C: 'Ĉ' };
  return table[c] ?? `${c}̂`;
}

function fraction(a, b) {
  const g = estAtome(a) || /^[A-Za-z0-9]+$/.test(a) ? a : `(${a})`;
  const d = estAtome(b) || /^[A-Za-z0-9]+$/.test(b) ? b : `(${b})`;
  return `${g}/${d}`;
}

/** ^{T} et ^{-1} et ^{2} deviennent de vrais exposants. */
function exposants(s) {
  s = s.replace(/\^\{?T\}?/g, 'ᵀ');
  s = s.replace(/\^\{-1\}/g, '⁻¹');
  s = s.replace(/\^\{?([0-9])\}?(?![0-9A-Za-z])/g, (m, d) => EXPOSANTS[d]);
  s = s.replace(/\^\{∘\}/g, '°');
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown restreint → texte
// ─────────────────────────────────────────────────────────────────────────────

function md(source) {
  if (!source) return '';
  let s = source;
  // Les formules en ligne d'abord : le $ protège son contenu du markdown.
  s = s.replace(/\$([^$]+)\$/g, (m, c) => tex(c));
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1$2');
  s = s.replace(/`([^`]+)`/g, '$1');
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mise en page
// ─────────────────────────────────────────────────────────────────────────────

const INSECABLE = ' ';
const ESPACE3 = INSECABLE.repeat(3);

/**
 * La typographie française ne coupe pas devant « ; : ? ! % ni derrière « , et
 * ne coupe pas un nombre à quatre chiffres. Un blanc insécable tient le coup
 * pendant le repli, puis redevient un blanc ordinaire.
 */
function coller(texte) {
  return String(texte)
    .replace(/«\s+/g, `«${INSECABLE}`)
    .replace(/\s+»/g, `${INSECABLE}»`)
    .replace(/\s+([;:?!%])/g, `${INSECABLE}$1`)
    .replace(/(\d)\s+(?=\d{3}(\D|$))/g, `$1${INSECABLE}`)
    .replace(/\bn°\s+/g, `n°${INSECABLE}`);
}

function couper(texte, largeur) {
  const lignes = [];
  for (const paragraphe of coller(texte).split('\n')) {
    if (paragraphe.trim() === '') { lignes.push(''); continue; }
    let courante = '';
    for (const mot of paragraphe.split(/[ \t]+/).filter(Boolean)) {
      if (courante === '') courante = mot;
      else if (courante.length + 1 + mot.length <= largeur) courante += ` ${mot}`;
      else { lignes.push(courante); courante = mot; }
    }
    if (courante !== '') lignes.push(courante);
  }
  return lignes.map((l) => l.replaceAll(INSECABLE, ' '));
}

/** L'en-tête d'un bloc : deux espaces, puis quatre si elle déborde. */
function titreBloc(texte) {
  return couper(texte, LARGEUR - 4).map((l, i) => (i === 0 ? `  ${l}` : `    ${l}`));
}

function bloc(texte, retrait = 0, premier = null) {
  const largeur = LARGEUR - retrait;
  const lignes = couper(texte, largeur);
  const marge = ' '.repeat(retrait);
  return lignes.map((l, i) => {
    if (l === '') return '';
    if (i === 0 && premier !== null) return premier + l;
    return marge + l;
  });
}

/** Une liste à puces ou numérotée, dont la suite s'aligne sous le texte. */
function puces(elements, marque) {
  const out = [];
  elements.forEach((el, i) => {
    const tete = typeof marque === 'function' ? marque(i) : marque;
    const retrait = tete.length;
    const lignes = couper(md(el), LARGEUR - retrait);
    lignes.forEach((l, k) => out.push(k === 0 ? tete + l : ' '.repeat(retrait) + l));
  });
  return out;
}

/**
 * Un tableau à colonnes fixes, chaque cellule repliée dans sa colonne.
 *
 * `minima` donne, par colonne, une largeur au-dessous de laquelle la réduction
 * ne descend pas. Il sert aux colonnes dont les cellules sont des mots
 * insécables — un nom de fichier ne se replie pas, il déborde. Sans lui, le
 * comportement est celui d'avant, au caractère près.
 */
function tableau(entetes, lignes, retrait = 2, minima = null) {
  const n = entetes.length;
  const dispo = LARGEUR - retrait - 3 * (n - 1);
  const brut = [entetes, ...lignes].map((r) => r.map((c) => md(c ?? '')));
  const besoins = [];
  for (let j = 0; j < n; j += 1) {
    besoins.push(Math.max(...brut.map((r) => Math.max(...couper(r[j] ?? '', 999).map((l) => l.length), 0)), 1));
  }
  const total = besoins.reduce((a, b) => a + b, 0);
  let cols;
  if (total <= dispo) cols = besoins;
  else {
    // Réduction proportionnelle, avec un plancher.
    const plancher = Math.max(8, Math.floor(dispo / (n * 2)));
    // Sans `minima`, planchers[j] vaut plancher partout : le calcul est alors
    // exactement celui d'avant.
    const planchers = besoins.map((b, j) => Math.max(plancher, Math.min(minima?.[j] ?? 0, b)));
    cols = besoins.map((b, j) => Math.max(planchers[j], Math.floor((b / total) * dispo)));
    let excedent = cols.reduce((a, b) => a + b, 0) - dispo;
    for (let tour = 0; excedent > 0 && tour < 400; tour += 1) {
      const j = cols.indexOf(Math.max(...cols));
      if (cols[j] <= planchers[j]) break;
      cols[j] -= 1; excedent -= 1;
    }
  }

  const out = [];
  const marge = ' '.repeat(retrait);
  const rangee = (cellules) => {
    const plies = cellules.map((c, j) => couper(c, cols[j]));
    const hauteur = Math.max(...plies.map((p) => p.length), 1);
    for (let k = 0; k < hauteur; k += 1) {
      const morceaux = plies.map((p, j) => (p[k] ?? '').padEnd(cols[j]));
      out.push((marge + morceaux.join('   ')).replace(/\s+$/, ''));
    }
  };
  rangee(brut[0]);
  out.push((marge + cols.map((c) => '─'.repeat(c)).join('   ')).replace(/\s+$/, ''));
  // Un tableau dont chaque rangée tient sur une ligne se lit serré ; dès qu'une
  // cellule se replie, les rangées ont besoin d'être séparées.
  const aere = brut.slice(1).some((r) => r.some((c, j) => couper(c, cols[j]).length > 1));
  brut.slice(1).forEach((r, i) => { if (aere && i > 0) out.push(''); rangee(r); });
  return out;
}

function verbatim(texte, retrait = 4) {
  return String(texte).split('\n').map((l) => (l.trim() === '' ? '' : ' '.repeat(retrait) + l.replace(/\s+$/, '')));
}

// ─────────────────────────────────────────────────────────────────────────────
// Les blocs, un par un
// ─────────────────────────────────────────────────────────────────────────────

const TON = { note: 'NOTE', attention: 'ATTENTION', astuce: 'ASTUCE', rappel: 'RAPPEL' };

let compteurAnimation = 0;
let compteurSchema = 0;
const animationsVues = [];
const verificationsVues = [];

function rendre(b, contexte) {
  const out = [];
  const pousser = (...l) => out.push(...l);

  switch (b.type) {
    case 'titre': {
      if (b.niveau === 2) {
        contexte.section += 1;
        contexte.sousSection = 0;
        contexte.dernierTitre = `${contexte.page}.${contexte.section} ${md(b.texte)}`;
        pousser('', '-'.repeat(LARGEUR), contexte.dernierTitre, '-'.repeat(LARGEUR), '');
      } else {
        contexte.sousSection += 1;
        pousser('', `  ${md(b.texte).toUpperCase()}`, '');
      }
      break;
    }
    case 'texte':
      pousser(...bloc(md(b.texte)), '');
      break;
    case 'liste':
      pousser(
        ...puces(b.elements, b.ordonnee ? (i) => `${String(i + 1).padStart(2)}. ` : '  · '),
        '',
      );
      break;
    case 'encart':
      pousser(...titreBloc(`${TON[b.ton]}${b.titre ? ` — ${md(b.titre)}` : ''}`));
      pousser(...bloc(md(b.texte), 2), '');
      break;
    case 'definition':
      pousser(...titreBloc(`DÉFINITION — ${md(b.terme)}${b.anglais ? `${ESPACE3}(en anglais${INSECABLE}: ${b.anglais})` : ''}`));
      pousser(...bloc(md(b.texte), 2), '');
      break;
    case 'formule':
      pousser(...bloc(tex(b.latex), 4));
      if (b.numero) pousser(`      (${b.numero})`);
      pousser(...bloc(`lecture : ${b.alt}`, 6));
      if (b.legende) pousser(...bloc(`légende : ${md(b.legende)}`, 6));
      pousser('');
      break;
    case 'animation': {
      compteurAnimation += 1;
      const s = SCENE.get(b.animationId);
      const duree = DUREES.get(b.animationId);
      const cote = duree ? `${duree.toFixed(2).replace('.', ',')} s` : 'à rendre';
      animationsVues.push({ n: compteurAnimation, page: contexte.page, id: b.animationId, cote, scene: s });
      pousser(...titreBloc(`▸ ANIMATION n°${compteurAnimation} · ${b.animationId}${ESPACE3}${cote}`));
      pousser(...bloc(md(b.legende ?? s?.legende ?? ''), 4), '');
      break;
    }
    case 'image': {
      // AJOUTÉ LE 31 AOÛT 2026, pour la même raison que le cas « exercice » plus
      // bas : le chapitre 1 porte huit schémas fixes, et tous les huit sortaient
      // « [bloc « image » non rendu] ». Un relecteur qui lit l'export concluait
      // que ces pages n'ont pas de figure — reproche porté, et fondé sur ce
      // trou-ci autant que sur les pages.
      //
      // ON SORT LE `alt`, ENTIER. C'est le seul rendu honnête d'une image en
      // texte : il dit ce qu'il y a à voir, et il est écrit pour être lu à voix
      // haute. La légende suit, comme partout ailleurs.
      compteurSchema += 1;
      const nom = basename(String(b.src));
      pousser(...titreBloc(`▣ SCHÉMA n°${compteurSchema} · ${nom}`));
      pousser(...bloc(String(b.alt), 4), '');
      if (b.legende) pousser(...bloc(`légende : ${md(b.legende)}`, 4), '');
      break;
    }
    case 'tableau':
      if (b.titre) pousser(...titreBloc(md(b.titre).toUpperCase()));
      pousser(...tableau(b.entetes, b.lignes));
      if (b.legende) pousser('', ...bloc(`légende : ${md(b.legende)}`, 2));
      pousser('');
      break;
    case 'sortie':
      pousser(...titreBloc(`SORTIE${b.titre ? ` — ${md(b.titre)}` : ''}`));
      pousser('', ...verbatim(b.texte), '');
      if (b.lecture?.length) pousser(...puces(b.lecture, '  · '), '');
      break;
    case 'code':
      pousser(...titreBloc(`CODE${b.titre ? ` — ${md(b.titre)}` : ''}   (${b.langage})`));
      pousser('', ...verbatim(b.code), '');
      break;
    case 'derivation': {
      pousser(...titreBloc(`DÉRIVATION — ${md(b.titre)}`), '');
      if (b.hypotheses?.length) {
        pousser('    Hypothèses');
        pousser(...puces(b.hypotheses, '      · '));
      }
      if (b.depart) {
        pousser('    Point de départ');
        pousser(...bloc(tex(b.depart.latex), 6));
        pousser(...bloc(`lecture : ${b.depart.alt}`, 8));
      }
      // La chaîne de dépendances est du LaTeX écrit sans dollars.
      if (b.chaine) pousser('', ...bloc(`Chaîne : ${tex(md(b.chaine))}`, 4));
      if (b.proprietes?.length) {
        pousser('', '    Propriétés utilisées');
        pousser(...puces(b.proprietes, '      · '));
      }
      pousser('', '    Étapes');
      b.etapes.forEach((e, i) => {
        pousser(`      (${i + 1})`);
        if (e.texte) pousser(...bloc(md(e.texte), 8));
        if (e.latex) pousser(...bloc(tex(e.latex), 10));
        if (e.alt) pousser(...bloc(`lecture : ${e.alt}`, 12));
        if (e.justification) pousser(...bloc(`justification : ${md(e.justification)}`, 10));
        pousser('');
      });
      pousser('    Résultat');
      pousser(...bloc(tex(b.resultat.latex), 6));
      pousser(...bloc(`lecture : ${b.resultat.alt}`, 8), '');
      pousser('    Interprétation');
      pousser(...bloc(md(b.interpretation), 6));
      if (b.limites?.length) {
        pousser('', '    Ce que le résultat ne dit pas');
        pousser(...puces(b.limites, '      · '));
      }
      pousser('');
      break;
    }
    case 'repere':
      pousser('📍 OÙ EN SOMMES-NOUS ?');
      pousser(...bloc(`Ce que nous cherchons : ${md(b.cherche)}`, 3));
      pousser(...bloc(`Pourquoi : ${md(b.pourquoi)}`, 3));
      pousser(...bloc(`Où nous en sommes : ${md(b.ou)}`, 3));
      pousser(...bloc(`L'étape suivante : ${md(b.suite)}`, 3));
      pousser('');
      break;
    case 'verification':
      verificationsVues.push({
        numero: b.numero,
        page: contexte.page,
        section: contexte.dernierTitre ?? '—',
        enonce: md(b.enonce),
        questions: b.questions.length,
      });
      pousser(`🧪 VÉRIFICATION RAPIDE N°${b.numero}`);
      pousser(...bloc(md(b.enonce), 3));
      pousser(...puces(b.questions, (i) => `   (${'abcdefg'[i]}) `));
      pousser('');
      break;
    case 'exercice':
      // AJOUTÉ À L'ANCIEN MOTEUR. Le chapitre 2 n'en porte aucun ; les
      // chapitres 1, 4 et 5 en portent un chacun, et sans ce cas ils
      // sortaient « [bloc « exercice » non rendu] ».
      pousser(...titreBloc(
        `EXERCICE — ${md(b.titre)}${b.minutes ? `${ESPACE3}${b.minutes} min` : ''}`,
      ));
      pousser(...bloc(md(b.enonce), 2), '');
      if (b.attendu) pousser(...bloc(`attendu : ${md(b.attendu)}`, 4), '');
      if (b.indices?.length) {
        pousser('    Indices');
        pousser(...puces(b.indices, (i) => `      ${i + 1}. `), '');
      }
      if (b.correction) {
        pousser('    Correction');
        pousser(...bloc(md(b.correction), 6), '');
      }
      break;
    default:
      pousser(`  [bloc « ${b.type} » non rendu]`, '');
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Le document
// ─────────────────────────────────────────────────────────────────────────────

const doc = [];
const trait = '='.repeat(LARGEUR);
const T = (t) => doc.push('', '', trait, t, trait, '');

const { CHAPITRES, LECONS } = await importerTs(join(ACADEMY, 'sommaires.ts'));
const { COURS } = await importerTs(join(ACADEMY, 'cours.ts'));
const { PARCOURS } = await importerTs(join(ACADEMY, 'parcours.ts'));

const pagesChargees = [];
for (const p of PAGES) {
  const lecon = LECONS.find((l) => l.id === p.lecon);
  if (!lecon) {
    console.error(
      `sommaires.ts : aucune leçon « ${p.lecon} », que l'index du chapitre déclare.`,
    );
    process.exit(2);
  }
  pagesChargees.push({
    fichier: basename(p.fichier),
    id: p.lecon,
    blocs: await charger(p.fichier),
    lecon,
  });
}

const CHAPITRE = CHAPITRES.find((c) => c.id === pagesChargees[0].lecon.chapitreId);
if (!CHAPITRE) {
  console.error(`sommaires.ts : aucun chapitre « ${pagesChargees[0].lecon.chapitreId} ».`);
  process.exit(2);
}
const LE_COURS = COURS.find((c) => c.id === CHAPITRE.coursId);
const LE_PARCOURS = PARCOURS.find((p) => p.id === LE_COURS?.parcoursId);

const SORTIE = process.argv[4]
  ? resolve(process.cwd(), process.argv[4])
  : resolve(DEPOT, `cours-lecon${CHAPITRE.rang}-texte.txt`);

const totalMinutes = pagesChargees.reduce((a, p) => a + p.lecon.minutes, 0);
const totalBlocs = pagesChargees.reduce((a, p) => a + p.blocs.length, 0);
const CONTENU_REL = relative(RACINE, dirname(PAGES[0].fichier)).replace(/\\/g, '/');

// ── Les pages sont rendues d'abord : l'en-tête compte ce qu'elles portent ────

const corpsPages = [];
pagesChargees.forEach((p, i) => {
  const numero = i + 1;
  const contexte = { page: numero, section: 0, sousSection: 0, dernierTitre: null };
  corpsPages.push('', '', trait, `PAGE ${numero} — ${p.lecon.titre.toUpperCase()}`,
    `Slug : ${p.lecon.slug}   ·   ${p.lecon.minutes} min   ·   genre : ${p.lecon.genre}`
    + `   ·   ${p.blocs.length} blocs`,
    trait, '');
  corpsPages.push(...bloc(md(p.lecon.resume)), '');
  for (const b of p.blocs) corpsPages.push(...rendre(b, contexte));
});

const declarees = SCENE.size;
const rendues = [...SCENE.keys()].filter((id) => RENDUES.has(id)).length;
const nonCitees = [...SCENE.keys()].filter((id) => !animationsVues.some((a) => a.id === id));

/** « nom                 valeur », la suite alignée sous la valeur. */
function enTete(nom, valeur) {
  // Un emoji occupe deux colonnes et un seul point de code : sans cela, la
  // ligne des 🧪 se décale d'un cran.
  const large = [...nom].reduce((n, c) => n + (c.codePointAt(0) > 0xffff ? 2 : 1), 0);
  const tete = `  ${nom}${' '.repeat(Math.max(1, 21 - large))}`;
  return couper(String(valeur), LARGEUR - tete.length)
    .map((l, i) => (i === 0 ? tete + l : ' '.repeat(tete.length) + l));
}

doc.push(
  trait,
  `LEÇON ${CHAPITRE.rang} — ${CHAPITRE.titre.toUpperCase()}`,
  `Chapitre ${CHAPITRE.rang} du cours « ${LE_COURS?.nom ?? CHAPITRE.coursId} »`,
  trait,
  '',
  ...enTete('Rang', `${CHAPITRE.rang} dans le cours`),
  ...enTete('Titre', CHAPITRE.titre),
  ...enTete('Pages', pagesChargees.length),
  ...enTete('Blocs', totalBlocs),
  ...enTete('Scènes déclarées', declarees),
  ...enTete('Scènes rendues', `${rendues} sur ${declarees}`),
  ...enTete(
    'Vérifications 🧪',
    verificationsVues.length === 0
      ? 'aucune'
      : `${verificationsVues.length} : `
        + verificationsVues.map((v) => v.numero).sort((a, b) => a - b)
          .map((n) => `n°${n}`).join(', '),
  ),
  '',
  ...bloc('Ce document contient DEUX choses :'),
  '',
  `  · le TEXTE de la leçon, découpé selon les ${enLettres(pagesChargees.length)} pages du sommaire ;`,
  `  · la description PRÉCISE des ${enLettres(declarees)} scènes, à la fin, une par une.`,
  '',
  ...bloc(
    "C'est un EXPORT du chapitre tel qu'il est servi, pas une synthèse. Les "
    + 'titres, les numéros de section, les listes, les formules, les tableaux, '
    + 'les définitions, les encarts, les dérivations, les vérifications, les '
    + 'repères de progression et les sorties de programme sont ceux des blocs '
    + 'du dépôt, dans leur ordre :',
  ),
  '',
  `    ${CONTENU_REL}/`,
  ...pagesChargees.map((p, i) => `        ${p.fichier.padEnd(25)}page ${i + 1}`),
  '',
  ...bloc(
    'Le LaTeX des formules est translittéré en Unicode. Les vecteurs, gras '
    + "dans le rendu de l'application, sont ici en romain : x est le vecteur, "
    + 'x_k sa k-ième composante. La ligne « lecture » qui suit chaque formule '
    + "est son alternative textuelle, celle qui est servie aux lecteurs "
    + "d'écran : elle n'est pas un commentaire ajouté ici.",
  ),
  '',
);
doc.push(
  ...bloc(
    `Les ${declarees} animations sont rendues par Manim depuis `
    + `${SCENES_REL}/. Leur définition, leur texte alternatif et `
    + 'leur mouvement viennent de ces fichiers ; les durées viennent de '
    + 'public/animations/manifeste.json, produit par le pipeline de rendu.',
  ),
);

T('CADRE DU COURS');
doc.push(
  '-'.repeat(LARGEUR),
  'A. LE COURS, ET SA PLACE',
  '-'.repeat(LARGEUR),
  '',
  `${'Parcours'.padEnd(11)}${LE_PARCOURS?.nom ?? '—'}`,
  `${'Cours'.padEnd(11)}${LE_COURS?.nom ?? '—'}   ·   ${LE_COURS?.slug ?? '—'}`,
  `${'Chapitre'.padEnd(11)}${CHAPITRE.titre}   ·   ${CHAPITRE.slug}`,
  `${'Rang'.padEnd(11)}${CHAPITRE.rang} dans le cours   ·   ${pagesChargees.length} pages`
  + `   ·   ${totalBlocs} blocs`,
  '',
  ...bloc(`RÉSUMÉ DU CHAPITRE. ${CHAPITRE.resume}`),
  '',
);
if (PARTICULARITE.neFaitPas) doc.push(...bloc(PARTICULARITE.neFaitPas), '');
doc.push(
  '-'.repeat(LARGEUR),
  'B. LE SOMMAIRE SERVI',
  '-'.repeat(LARGEUR),
  '',
  ...tableau(
    ['page', 'titre', 'durée', 'genre', 'statut'],
    pagesChargees.map((p, i) => [
      String(i + 1), p.lecon.titre, `${p.lecon.minutes} min`, p.lecon.genre, p.lecon.statut,
    ]),
  ),
  '',
  `  ${pagesChargees.length} pages, ${totalMinutes} minutes annoncées, toutes publiées.`,
  '',
);
pagesChargees.forEach((p, i) => {
  doc.push(...bloc(`Page ${i + 1} · ${p.lecon.titre} — ${md(p.lecon.resume)}`, 2, '  '));
});

const enTeteDeLIndex = enTeteIndex(brutIndex);
if (enTeteDeLIndex.length) {
  doc.push(
    '',
    '-'.repeat(LARGEUR),
    "C. CE QUE L'INDEX DU CHAPITRE DIT",
    '-'.repeat(LARGEUR),
    '',
    ...bloc(
      `Cité tel quel depuis ${relative(RACINE, INDEX).replace(/\\/g, '/')}. C'est la note `
      + 'que les auteurs du chapitre se sont laissée en tête de son index.',
    ),
    '',
    ...enTeteDeLIndex.map((l) => (l ? `  ${l}` : '')),
    '',
  );
}

// ── Les pages ───────────────────────────────────────────────────────────────

doc.push(...corpsPages);

// ── Les programmes, et les mesures qu'ils produisent ────────────────────────
//
// RIEN N'EST RECOPIÉ DU SOURCE. Les programmes sont versionnés et lisibles ;
// ce qui manquait, c'est la correspondance entre eux et les pages. La colonne
// « pages qui la citent » ne se remplit QUE lorsque le bloc SORTIE nomme
// lui-même son programme dans son titre — c'est une déclaration de l'auteur,
// pas une déduction. Rapprocher un bloc d'un programme par ressemblance de sa
// sortie a été essayé et donne un résultat faux : voir le rapport de la passe.
// Une sortie qui ne nomme rien est listée à part, jamais devinée.

const COURS_DU_CHAPITRE = join(RACINE, 'cours', `lecon${CHAPITRE.rang}`);
const PROGRAMMES = existsSync(COURS_DU_CHAPITRE)
  ? (await readdir(COURS_DU_CHAPITRE)).filter((f) => f.endsWith('.py')).sort()
  : [];

/** Le premier paragraphe du docstring d'un module : ce qu'il annonce produire. */
function resumeDeProgramme(source) {
  const m = /^\s*(?:"""|''')([\s\S]*?)(?:"""|''')/.exec(source);
  if (!m) return '—';
  const para = m[1].trim().split(/\n\s*\n/)[0] ?? '';
  return para.split('\n').map((l) => l.trim()).filter(Boolean).join(' ') || '—';
}

const SORTIES = [];
pagesChargees.forEach((p, i) => {
  for (const b of p.blocs) {
    if (b.type === 'sortie') SORTIES.push({ page: i + 1, titre: String(b.titre ?? '') });
  }
});
const NOMME = /cours[/]lecon\d+[/]([A-Za-z0-9_]+[.]py)/;

if (PROGRAMMES.length || SORTIES.length) {
  T("LES PROGRAMMES, ET LES MESURES QU'ILS PRODUISENT");
  const relCours = relative(RACINE, COURS_DU_CHAPITRE).replace(/\\/g, '/');
  const lignes = [];
  for (const prog of PROGRAMMES) {
    const source = await readFile(join(COURS_DU_CHAPITRE, prog), 'utf8');
    const pages = [...new Set(
      SORTIES.filter((s) => NOMME.exec(s.titre)?.[1] === prog).map((s) => s.page),
    )].sort((a, b) => a - b);
    // Le répertoire est déjà dit juste au-dessus : le répéter dans chaque
    // cellule vole à la colonne « mesure produite » la largeur qu'il lui faut.
    lignes.push([prog, resumeDeProgramme(source), pages.join(', ')]);
  }
  doc.push(
    ...bloc(
      PROGRAMMES.length === 0
        ? `Aucun programme dans ${relCours}/.`
        : `Les ${enLettres(PROGRAMMES.length)} programmes de ${relCours}/. La colonne `
          + '« mesure produite » est le premier paragraphe du docstring du programme, '
          + 'cité tel quel. La colonne des pages ne porte que les blocs SORTIE qui '
          + 'nomment eux-mêmes leur programme : une colonne vide dit que rien ne '
          + "l'a déclaré, et non que le programme ne sert à rien.",
    ),
    '',
    ...tableau(
      ['programme', 'mesure produite', 'pages qui la citent'], lignes, 2,
      // Un nom de fichier ne se replie pas : la colonne prend la largeur du
      // plus long, et la colonne du milieu se replie à sa place.
      [Math.max(...lignes.map((l) => l[0].length), 'programme'.length), 0, 0],
    ),
    '',
  );
  const orphelines = SORTIES.filter((s) => !NOMME.test(s.titre));
  doc.push(
    ...bloc(
      `${SORTIES.length} blocs SORTIE dans le chapitre, dont `
      + `${SORTIES.length - orphelines.length} nomment leur programme.`,
      2, '  ',
    ),
  );
  if (orphelines.length) {
    doc.push(
      '',
      ...bloc(
        'Les suivants ne nomment aucun programme. Ils ne sont rattachés à rien '
        + 'ici : le titre est la seule déclaration qui fasse foi, et la deviner '
        + 'donnerait une table qui a l\'air juste sans l\'être.',
        2, '  ',
      ),
      '',
      ...tableau(['page', 'titre du bloc SORTIE'],
        orphelines.map((s) => [String(s.page), s.titre]), 4),
    );
  }
  doc.push('');
}

// ── La palette, et les conventions graphiques ───────────────────────────────
//
// Les trois morceaux sont DÉRIVÉS : les constantes viennent de n7ia.py, les
// gestes du champ `notions` des scènes, les contraintes de ce que les scènes
// écrivent elles-mêmes. Aucun n'est rédigé ici.

const N7IA = join(dirname(SCENES), 'n7ia.py');

/** Les constantes de tête de n7ia.py, groupées par leurs titres « ── … ── ». */
function palette(source) {
  const groupes = [];
  let courant = null;
  for (const ligne of source.split('\n')) {
    if (/^\s*(?:def|class)\s/.test(ligne)) break;
    const titre = /^#\s*─+\s*(.+?)\s*─+\s*$/.exec(ligne);
    if (titre) { courant = { titre: titre[1], constantes: [] }; groupes.push(courant); continue; }
    const cst = /^([A-Z][A-Z0-9_]*)\s*(?::\s*[A-Za-z[\]| ]+)?\s*=\s*(.+?)\s*$/.exec(ligne);
    // La chaîne vide est une valeur, pas un échec de lecture : FONTE = "" est
    // ce qui demande à Manim la fonte du système. On la montre telle quelle.
    if (cst && courant) {
      const nu = cst[2].replace(/^["']|["']$/g, '');
      courant.constantes.push([cst[1], nu === '' ? '""' : nu]);
    }
  }
  return groupes.filter((g) => g.constantes.length);
}

/** Le docstring d'une classe : ce que toute scène hérite. */
function docstringDeClasse(source, nom) {
  const i = source.indexOf(`class ${nom}(`);
  if (i < 0) return '';
  const m = /(?:"""|''')([\s\S]*?)(?:"""|''')/.exec(source.slice(i));
  return m ? m[1].trim().split('\n').map((l) => l.trim()).filter(Boolean).join(' ') : '';
}

// Ce qu'une scène énonce comme contrainte de dessin. La liste des marques est
// FERMÉE et écrite ici : c'est ce qui rend la section vérifiable — on peut la
// relire et dire ce qu'elle attrape, au lieu de faire confiance à un tri.
const MARQUES_DE_CONTRAINTE = new RegExp(
  '(m[êe]me [ée]chelle|[ée]chelle commune|[ée]chelle sym[ée]trique|sym[ée]trique autour'
  + '|jamais tronqu|non tronqu|ne doit pas|ne doivent pas'
  + '|jamais (?:toucher|traverser|d[ée]passer|recouvrir|chevaucher|sortir|se croiser))',
  'i',
);

const gestesDeclares = [];
const contraintes = new Map();
for (const a of animationsVues) {
  const s = a.scene;
  if (!s) continue;
  for (const n of s.notions ?? []) {
    const g = /^geste\s*:\s*(.+)$/i.exec(n);
    if (g) gestesDeclares.push([g[1], s.scene, String(a.page)]);
  }
  const champs = [...(s.notions ?? []), s.legende, s.alt, ...(s.mouvement ?? []), ...(s.ecran ?? [])];
  for (const champ of champs) {
    if (!champ) continue;
    for (const phrase of String(champ).split(/(?<=[.;:])\s+/)) {
      const p = phrase.trim();
      if (p && MARQUES_DE_CONTRAINTE.test(p) && !contraintes.has(p)) contraintes.set(p, s.scene);
    }
  }
}

T('LA PALETTE, ET LES CONVENTIONS GRAPHIQUES DES SCÈNES');
doc.push(
  ...bloc(
    'Ces conventions ne sont pas décoratives. Une échelle de couleur décalée '
    + 'ferait mentir un gabarit, une échelle tronquée dirait le contraire de ce '
    + 'que la scène démontre : les scènes qui en prescrivent une le disent, et '
    + 'elles sont rassemblées plus bas. Tout ce qui suit est lu dans le dépôt — '
    + `${relative(RACINE, N7IA).replace(/\\/g, '/')} pour les constantes, les `
    + 'déclarations des scènes pour le reste.',
  ),
  '',
);

if (existsSync(N7IA)) {
  const sourceN7 = await readFile(N7IA, 'utf8');
  for (const g of palette(sourceN7)) {
    doc.push(`  ${g.titre.toUpperCase()}`, '');
    for (const [nom, valeur] of g.constantes) doc.push(`    ${nom.padEnd(16)}${valeur}`);
    doc.push('');
  }
  const heritage = docstringDeClasse(sourceN7, 'SceneN7');
  if (heritage) doc.push('  CE QUE TOUTE SCÈNE HÉRITE', '', ...bloc(heritage, 4), '');
} else {
  doc.push(`  (${relative(RACINE, N7IA).replace(/\\/g, '/')} introuvable)`, '');
}

doc.push('  LES GESTES DÉCLARÉS PAR LES SCÈNES DU CHAPITRE', '');
if (gestesDeclares.length === 0) {
  doc.push(
    ...bloc(
      "Aucun. Les scènes de ce chapitre sont antérieures au registre de gestes : "
      + "leurs déclarations ne portent pas de champ « geste », et leur champ "
      + '« notions » n\'en annonce aucun.',
      4,
    ),
    '',
  );
} else {
  const distincts = new Set(gestesDeclares.map((g) => g[0])).size;
  doc.push(
    ...bloc(
      `Le geste est le mouvement visuel sur lequel une scène est bâtie. Il est `
      + `lu dans le champ « notions » de chaque déclaration, où il est annoncé `
      + `« geste : … ». Ce chapitre en déclare ${gestesDeclares.length}, dont `
      + `${distincts} distincts.`,
      4,
    ),
    '',
    // Un nom de classe ne se replie pas non plus.
    ...tableau(['geste', 'scène', 'page'], gestesDeclares, 4,
      [0, Math.max(...gestesDeclares.map((g) => g[1].length)), 0]),
    '',
  );
}

doc.push('  LES CONTRAINTES QUE LES SCÈNES ÉNONCENT', '');
doc.push(
  ...bloc(
    "Relevées dans ce que les scènes écrivent elles-mêmes — notions, légende, "
    + "texte alternatif, mouvement, texte à l'écran — sur une liste fermée de "
    + 'marques : même échelle, échelle commune, échelle symétrique, symétrique '
    + 'autour de, jamais tronqué, non tronqué, ne doit pas, ne doivent pas, et '
    + 'jamais suivi de toucher, traverser, dépasser, recouvrir, chevaucher, '
    + 'sortir ou se croiser. Ce qui ne porte aucune de ces marques ne figure pas '
    + "ici : la section montre ce que les scènes ont pris la peine d'écrire, pas "
    + 'ce qu\'un lecteur pourrait leur prêter.',
    4,
  ),
  '',
);
if (contraintes.size === 0) {
  doc.push('    Aucune scène du chapitre n\'en énonce.', '');
} else {
  doc.push(
    ...bloc(`${contraintes.size} relevées.`, 4),
    '',
    ...tableau(['scène', 'ce que la scène prescrit'],
      [...contraintes.entries()].map(([p, sc]) => [sc, p]), 4,
      [Math.max(...[...contraintes.values()].map((sc) => sc.length)), 0]),
    '',
  );
}

// ── Les scènes ──────────────────────────────────────────────────────────────

T(`LES ${declarees} SCÈNES, UNE PAR UNE`);
doc.push(
  ...bloc(
    "Dans l'ordre où le chapitre les appelle. Chaque scène est déclarée dans "
    + `${SCENES_REL}/, et les champs ci-dessous sont les siens : `
    + "c'est ce que le pipeline de rendu lit, et ce que le manifeste sert à "
    + "l'application.",
  ),
);

/** « titre      valeur », la suite alignée sous la valeur. */
function champ(nom, valeur) {
  const tete = `  ${nom.padEnd(9)}  `;
  return couper(valeur ?? '', LARGEUR - tete.length)
    .map((l, i) => (i === 0 ? tete + l : ' '.repeat(tete.length) + l));
}

/** Les temps d'un mouvement : « 1. » sort du texte et devient la puce. */
function etapesScene(etapes) {
  const out = [];
  for (const etape of etapes) {
    const m = /^\s*(\d+)\.\s*/.exec(etape);
    const tete = m ? `    ${m[1]}. ` : '    · ';
    const corps = m ? etape.slice(m[0].length) : etape;
    couper(corps, LARGEUR - tete.length)
      .forEach((l, i) => out.push((i === 0 ? tete : ' '.repeat(tete.length)) + l));
  }
  return out;
}

for (const a of animationsVues) {
  const s = a.scene;
  doc.push('', '-'.repeat(LARGEUR), `ANIMATION n°${a.n} · ${a.id}`, '-'.repeat(LARGEUR), '');
  if (!s) { doc.push(`  (scène absente de ${SCENES_REL}/)`, ''); continue; }
  doc.push(
    `  page       ${a.page}`,
    `  fichier    ${SCENES_REL}/${s.fichier}`,
    `  classe     ${s.scene}`,
    `  durée      ${a.cote}`,
    '',
    ...champ('titre', s.titre),
  );
  // Les scènes du chapitre 1 sont antérieures au registre de gestes : elles ne
  // portent ni bandeau, ni section, ni geste, ni légende, ni mouvement.
  if (s.bandeau !== undefined) doc.push(...champ('bandeau', s.bandeau));
  if (s.section !== undefined) doc.push(...champ('section', s.section));
  if (s.geste !== undefined) doc.push(...champ('geste', s.geste));
  doc.push('');
  if (s.notions?.length) doc.push('  NOTIONS', ...puces(s.notions, '    · '), '');
  if (s.legende) doc.push('  LÉGENDE SERVIE SOUS LA VIDÉO', ...bloc(s.legende, 4), '');
  if (s.mouvement?.length) doc.push('  MOUVEMENT', ...etapesScene(s.mouvement), '');
  if (s.ecran?.length) {
    doc.push('  CE QUI EST ÉCRIT À L\'ÉCRAN', ...puces(s.ecran.map((e) => `« ${e} »`), '    · '), '');
  }
  if (s.nombres && Object.keys(s.nombres).length) {
    doc.push('  LES NOMBRES DE LA SCÈNE');
    for (const [cle, valeur] of Object.entries(s.nombres)) {
      doc.push(...bloc(`${cle} : ${JSON.stringify(valeur)}`, 4, '    '));
    }
    doc.push('');
  }
  doc.push('  TEXTE ALTERNATIF, POUR LES LECTEURS D\'ÉCRAN', ...bloc(s.alt, 4), '');
}

// ── Récapitulatif des vérifications ─────────────────────────────────────────

T('RÉCAPITULATIF DES VÉRIFICATIONS 🧪');
const numeros = verificationsVues.map((v) => v.numero);
doc.push(
  ...bloc(
    numeros.length === 0
      ? "Ce chapitre n'en porte aucune."
      : "Dans l'ordre où elles apparaissent dans le chapitre. Le numéro est celui "
        + 'que porte le bloc ; la numérotation est continue sur tout le parcours, '
        + `et ce chapitre en porte ${numeros.length}, de ${Math.min(...numeros)} à `
        + `${Math.max(...numeros)}.`,
  ),
  '',
  ...tableau(
    ['page', 'n°', 'section', 'porte sur', 'questions'],
    verificationsVues.map((v) => [
      String(v.page), `n°${v.numero}`, v.section, v.enonce, String(v.questions),
    ]),
  ),
);

// ── Récapitulatif des animations ────────────────────────────────────────────

T('RÉCAPITULATIF DES ANIMATIONS');
doc.push(
  ...tableau(
    ['page', 'n°', 'identifiant', 'durée', 'scène Manim'],
    animationsVues.map((a) => [
      String(a.page), `n°${a.n}`, a.id, a.cote, a.scene?.fichier ?? '—',
    ]),
  ),
  '',
);
const citeesRendues = animationsVues.filter((a) => a.cote !== 'à rendre');
const parPage = pagesChargees.map((p, i) => animationsVues.filter((a) => a.page === i + 1).length);
const distincts = new Set(animationsVues.map((a) => a.id)).size;
doc.push(
  ...bloc(
    `Total : ${animationsVues.length} scènes. ${citeesRendues.length === 0
      ? "Aucune n'est encore rendue : elles sont écrites et déclarées, et leur durée sera mesurée au rendu — elle n'est pas annoncée ici."
      : `${citeesRendues.length} sont rendues.`}`,
    2, '  ',
  ),
  ...bloc(`Par page : ${parPage.join(' · ')}.`, 2, '  '),
  ...bloc(
    `Minimum ${Math.min(...parPage)}, moyenne `
    + `${(animationsVues.length / parPage.length).toFixed(1).replace('.', ',')}, `
    + `${distincts} identifiants distincts pour ${animationsVues.length} emplacements.`,
    2, '  ',
  ),
  ...bloc(
    nonCitees.length === 0
      ? `Les ${declarees} scènes déclarées dans ${SCENES_REL}/ sont toutes citées par le chapitre.`
      : `Déclarées dans ${SCENES_REL}/ mais citées par aucun bloc : ${nonCitees.join(', ')}.`,
    2, '  ',
  ),
  '',
);

await writeFile(SORTIE, `${doc.join('\n').replace(/\n{4,}/g, '\n\n\n')}\n`, 'utf8');
console.log(
  `écrit : ${SORTIE}  (${doc.length} lignes, ${animationsVues.length} animations, `
  + `${verificationsVues.length} vérifications)`,
);
