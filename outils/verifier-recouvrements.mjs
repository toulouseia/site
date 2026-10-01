// ─────────────────────────────────────────────────────────────────────────────
// Deux objets ne se recouvrent jamais — le crible des figures fixes.
//
//   node outils/verifier-recouvrements.mjs              les cinq chapitres
//   node outils/verifier-recouvrements.mjs lecon2       un seul
//   node outils/verifier-recouvrements.mjs --detail     chaque cas
//   node outils/verifier-recouvrements.mjs --texte      texte contre texte seul
//
// C'est la règle 14 portée du côté des figures fixes. `animations/collisions.py`
// la tient déjà pour les scènes ; ici c'est le SVG servi qu'on lit, et rien
// d'autre. Le retour qui l'a demandé : « le gros problème c'est les
// superpositions, il y en a partout, image comme vidéo ».
//
// LE CAS. `l1-fig4-deux-carres.svg` posait « 56,25 + 56,25 = 112,5 » à y = 372
// et « les aires s'ajoutent » à y = 396 : vingt-quatre pixels d'écart pour des
// caractères de trente-trois, soit 27 % de leur hauteur l'un dans l'autre.
//
// LA CAUSE, et c'est pour cela qu'elle était partout : la passe du 10 septembre
// a remonté les textes des figures à 33 px — la règle 32 — sans toucher aux
// ordonnées, posées à la main quand les caractères en faisaient douze ou seize.
// L'interligne est désormais calculé : `INTERLIGNE = 1.35` dans cours/schema.py,
// et `pas(taille)` le rend.
//
// ── LA BOÎTE D'UN TEXTE ──────────────────────────────────────────────────────
//
// Le SVG ne porte pas la métrique de sa police, et cet outil ne rend rien : la
// largeur est ESTIMÉE à 0,55 × taille × nombre de caractères, la hauteur vaut la
// taille. 0,55 est la chasse moyenne d'une linéale sur un mélange de chiffres,
// de capitales et de bas-de-casse ; elle surestime un mot tout en bas-de-casse
// et sous-estime un nombre. La boîte est posée sur la ligne de base : elle monte
// de 0,8 × taille au-dessus et descend de 0,2 × taille dessous.
//
// CE QUE L'ESTIMATION IMPOSE. Un croisement n'est retenu qu'au-delà de
// TOLERANCE pixels sur CHACUN des deux axes. Sans ce seuil, deux étiquettes
// légitimement voisines se signaleraient sur une largeur devinée, et le crible
// ferait déplacer ce qui n'a jamais gêné personne.
//
// ── LES TROIS GENRES ─────────────────────────────────────────────────────────
//
// texte / texte   deux boîtes de texte qui se croisent.
//
// texte / plein   un texte à cheval sur le BORD d'un aplat. Un texte
//                 entièrement dans un aplat n'est pas une faute : c'est une
//                 étiquette dans sa case, et le cours en est plein. Ce qui est
//                 une faute, c'est le fond qui change au milieu du mot. Le
//                 rectangle de fond de page est écarté — il couvre tout, et
//                 tout le monde est dedans.
//
//                 UN APLAT N'EST PAS UN RECTANGLE. Une barre empilée est faite
//                 de trois rectangles accolés au trait invisible ; une échelle
//                 de couleur, de deux cent cinquante-six pastilles de six
//                 pixels. Pour le lecteur c'est une seule surface peinte. Les
//                 rectangles qui SE TOUCHENT sont donc fondus avant la
//                 comparaison, sur leur géométrie seule. Sans cette fusion, le
//                 crible signalait les trois termes de
//                 `l1-fig13-le-calcul-a-la-main`, que l'œil lit sans rien
//                 remarquer, et comptait vingt-huit fautes là où une étiquette
//                 mordait une échelle de quatre pixels.
//
//                 ET C'EST L'ENCRE QU'ON MESURE, pas la boîte de la ligne. Un
//                 texte centré dans une bande l'est sur sa hauteur de
//                 capitale ; la boîte de sa ligne, elle, monte plus haut que
//                 toute lettre et dépassait la bande de deux pixels que
//                 personne ne voit. Hauteur de capitale 0,72, jambage 0,21 et
//                 seulement si le mot en porte un.
//
// hors cadre      une boîte qui sort du viewBox.
//
// CE QUE LE CRIBLE NE VOIT PAS. Il ne rend rien. Un texte posé sur un trait, sur
// un rond ou sur une flèche lui échappe, et la métrique exacte d'une police lui
// échappe aussi. Il ne remplace pas de regarder la figure — c'est pourquoi la
// passe qui l'a produit s'est terminée sur dix figures ouvertes à l'œil.
//
// LECON 3 N'A PAS DE SVG : ses quatre figures sont des courbes échantillonnées,
// rendues en PNG par matplotlib dans cours/figures/. Un crible qui lit du XML
// n'a rien à y voir ; il le dit plutôt que de rester muet.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));

export const CHASSE = 0.55; // largeur d'un caractère, en fraction de la taille
export const HAMPE = 0.8; // au-dessus de la ligne de base
export const JAMBAGE = 0.2; // dessous
export const CAPITALE = 0.72; // l'encre, au-dessus de la ligne de base
export const QUEUE = 0.21; // l'encre d'un jambage, dessous
export const TOLERANCE = 1.0; // px, sur chacun des deux axes

// Les lettres qui descendent sous la ligne de base. « écart » n'en porte
// aucune, « prix observé » en porte une.
const DESCENDANTES = /[gjpqy]/;

// UN INDICE NE S'ÉCRIT PAS AVEC UNE ESPACE. « θ A », « w 1 », « x 2 » : une
// lettre grecque ou latine, une espace, puis une lettre seule ou un chiffre
// seul. C'est un indice composé à la main — par deux éléments <text> voisins,
// ou par une chaîne plate — là où `txt_indice` et `txt_riche` le composent en
// vrai, à 0,68 fois la base. Voir la règle 24 : le vrai caractère, toujours.
// Le second caractere est une CAPITALE ou un CHIFFRE, jamais une minuscule :
// « W x » est un produit et « y a » du francais, tandis que « θ A » et « w 1 »
// ne peuvent etre qu'un indice qu'on a ecrit avec une espace.
const INDICE_A_LA_MAIN =
  /(?:^|\s)[A-Za-zΑ-Ωα-ω]\s(?:[A-Z0-9]|[⁰¹²³⁴⁵⁶⁷⁸⁹])(?:\s|$)/u;

const CHAPITRES = ['lecon1', 'lecon2', 'lecon3', 'lecon4', 'lecon5'];
const SANS_SVG = { lecon3: 'figures PNG (matplotlib), cours/figures/' };

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

function attr(balise, nom) {
  const m = new RegExp(`${nom}="([^"]*)"`).exec(balise);
  return m ? m[1] : null;
}

function nombre(balise, nom, defaut = 0) {
  const v = attr(balise, nom);
  return v === null ? defaut : Number(v);
}

// Le décalage d'un `transform="translate(dx dy)"`. Le corpus n'en porte aucun
// aujourd'hui — les figures sont écrites en coordonnées absolues — mais un
// crible qui lit un attribut qu'il ne comprend pas mesure au mauvais endroit
// sans rien dire. Il le comprend donc, et refuse ce qu'il ne sait pas lire.
function deplacement(balise) {
  const t = attr(balise, 'transform');
  if (!t) return { dx: 0, dy: 0 };
  const m = /^\s*translate\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)\s*$/.exec(t);
  if (m) return { dx: Number(m[1]), dy: Number(m[2]) };
  throw new Error(`transform non compris : « ${t} » — le crible mesurerait faux`);
}

function textes(svg) {
  const trouves = [];
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const contenu = decoder(m[2].replace(/<[^>]+>/g, '')).trim();
    if (!contenu) continue;
    const { dx, dy } = deplacement(m[1]);
    trouves.push({
      // La boîte se calcule sur la taille du texte lui-même, jamais sur celle
      // de son indice : c'est la ligne de base commune qui occupe la place.
      taille: nombre(m[1], 'font-size', 0),
      x: nombre(m[1], 'x') + dx,
      y: nombre(m[1], 'y') + dy,
      ancre: attr(m[1], 'text-anchor') ?? 'start',
      contenu,
    });
  }
  return trouves;
}

// ── LE REGROUPEMENT, et c'est la faute que ce crible a laissé passer ────────
//
// `l1-fig19` composait son θ_A en DEUX éléments <text> : un « θ » cadré à
// droite de 401,7 et un « A » calé à gauche de 419,7, même ligne de base. Le
// crible voyait deux étiquettes d'un caractère séparées de dix-huit pixels de
// vide, là où le lecteur voit un seul mot large de cinquante-quatre. Il
// mesurait donc deux boîtes étroites, croyait libre le trou entre elles, et ne
// pouvait pas davantage reconnaître la chaîne « θ A » que la règle des indices
// interdit — elle n'existait dans aucun élément du fichier.
//
// Deux textes de MÊME taille, sur la MÊME ligne de base, dont les boîtes se
// suivent à moins d'une chasse, sont donc fondus en une étiquette : sa boîte
// est leur enveloppe, et son contenu leur suite séparée d'une espace.
function regrouper(lus) {
  const ordre = [...lus].sort((a, b) => a.y - b.y || boite(a).x0 - boite(b).x0);
  const sortie = [];
  for (const t of ordre) {
    const b = boite(t);
    const voisin = sortie.find((s) =>
      s.taille === t.taille && Math.abs(s.y - t.y) < 0.5 &&
      b.x0 - s.b.x1 > -TOLERANCE && b.x0 - s.b.x1 < CHASSE * t.taille);
    if (voisin) {
      voisin.contenu += ` ${t.contenu}`;
      voisin.b = { ...voisin.b, x1: b.x1 };
      voisin.morceaux += 1;
    } else {
      sortie.push({ ...t, b, morceaux: 1 });
    }
  }
  return sortie;
}

function pleins(svg, largeur, hauteur) {
  const trouves = [];
  for (const m of svg.matchAll(/<rect\b([^>]*)\/>/g)) {
    const fond = attr(m[1], 'fill');
    if (!fond || fond === 'none') continue;
    const r = {
      x: nombre(m[1], 'x'),
      y: nombre(m[1], 'y'),
      w: nombre(m[1], 'width'),
      h: nombre(m[1], 'height'),
      fond,
    };
    if (r.x <= 0 && r.y <= 0 && r.w >= largeur && r.h >= hauteur) continue;
    trouves.push(r);
  }
  return trouves;
}

// ── LES TRAITS ─────────────────────────────────────────────────────────────
//
// Un trait n'est pas un aplat, et c'est par là que le crible laissait passer
// `l1-fig19` : « le plus bas de cette coupe » posé sur le pointillé du fond de
// cuvette, « θ B » posé sur l'axe des abscisses. Une ligne, un axe, une courbe,
// un cadre sans remplissage : un texte dessus ne se lit pas.
//
// CE QU'ON RAMASSE. `<line>`, les segments d'un `<polyline>` et d'un
// `<polygon>`, les segments droits d'un `<path>`, et les quatre côtés d'un
// `<rect>` sans remplissage. Une courbe du cours est déjà une polyligne de
// segments courts — les figures ne portent ni arc ni Bézier.
//
// ON NE L'ÉCHANTILLONNE PAS. Un segment contre un rectangle se croise
// exactement, en quatre comparaisons ; échantillonner tous les cinq pixels
// laisserait passer un trait qui entre et sort de la boîte entre deux points.
// L'exact est plus simple ET plus sûr.
//
// LA GARDE. Le trait est comparé à la boîte du texte ÉLARGIE de GARDE sur ses
// quatre côtés : un trait qui frôle un texte est aussi illisible qu'un trait
// qui le traverse. Un quart du corps est le moins de blanc qu'une ligne de
// type puisse garder contre un filet ; en dessous, le filet se lit comme un
// soulignement. C'est exactement ce que valaient les deux fautes de fig19 :
// cinq pixels sous « le plus bas de cette coupe », sept sous « θ B ».
//
// CE QUI EN EST EXEMPT. Un filet — la règle sous un titre, le trait qui sépare
// deux sections, le soulignement d'une colonne — est fait pour toucher le
// texte. Il se DÉCLARE dans figures.py, `ligne(..., filet=True)`, et sort du
// SVG avec `data-role="filet"`. Rien n'est deviné à la teinte ni à l'épaisseur.
export const GARDE = 0.25;

function segmentsDe(svg) {
  const out = [];
  const pousser = (x1, y1, x2, y2, quoi, region = null) => {
    if (Number.isFinite(x1) && Number.isFinite(y1) &&
        Number.isFinite(x2) && Number.isFinite(y2)) {
      out.push({ x1, y1, x2, y2, quoi, region });
    }
  };
  const filet = (b) => attr(b, 'data-role') === 'filet';

  for (const m of svg.matchAll(/<line\b([^>]*)\/>/g)) {
    if (filet(m[1])) continue;
    const { dx, dy } = deplacement(m[1]);
    pousser(nombre(m[1], 'x1') + dx, nombre(m[1], 'y1') + dy,
            nombre(m[1], 'x2') + dx, nombre(m[1], 'y2') + dy,
            attr(m[1], 'stroke-dasharray') ? 'pointillé' : 'trait');
  }
  for (const m of svg.matchAll(/<(polyline|polygon)\b([^>]*)\/>/g)) {
    if (filet(m[2])) continue;
    const { dx, dy } = deplacement(m[2]);
    const pts = (attr(m[2], 'points') ?? '').trim().split(/\s+/)
      .map((p) => p.split(',').map(Number))
      .filter((p) => p.length === 2);
    const ferme = m[1] === 'polygon';
    const suite = ferme && pts.length > 2 ? [...pts, pts[0]] : pts;
    for (let k = 0; k + 1 < suite.length; k += 1) {
      pousser(suite[k][0] + dx, suite[k][1] + dy,
              suite[k + 1][0] + dx, suite[k + 1][1] + dy, m[1]);
    }
  }
  for (const m of svg.matchAll(/<path\b([^>]*)\/>/g)) {
    if (filet(m[1])) continue;
    const d = attr(m[1], 'd') ?? '';
    if (/[CcSsQqTtAa]/.test(d)) {
      throw new Error(`path courbe non compris : « ${d.slice(0, 40)}… »`);
    }
    const { dx, dy } = deplacement(m[1]);
    const nombres = d.match(/-?[\d.]+/g)?.map(Number) ?? [];
    for (let k = 0; k + 3 < nombres.length; k += 2) {
      pousser(nombres[k] + dx, nombres[k + 1] + dy,
              nombres[k + 2] + dx, nombres[k + 3] + dy, 'path');
    }
  }
  // Un rectangle sans remplissage est un CADRE : ce sont ses quatre côtés.
  for (const m of svg.matchAll(/<rect\b([^>]*)\/>/g)) {
    if (filet(m[1])) continue;
    const fond = attr(m[1], 'fill');
    if (fond && fond !== 'none') continue;
    if (!attr(m[1], 'stroke')) continue;
    const { dx, dy } = deplacement(m[1]);
    const x = nombre(m[1], 'x') + dx, y = nombre(m[1], 'y') + dy;
    const w = nombre(m[1], 'width'), h = nombre(m[1], 'height');
    // Le cadre porte sa region : une etiquette POSEE DEDANS n'est pas a
    // cheval sur lui, c'est une etiquette dans sa case, et le cours en est
    // plein. C'est la meme regle que pour l'aplat, et elle vaut ici aussi.
    const dedans = { x0: x, x1: x + w, y0: y, y1: y + h };
    pousser(x, y, x + w, y, 'cadre', dedans);
    pousser(x + w, y, x + w, y + h, 'cadre', dedans);
    pousser(x + w, y + h, x, y + h, 'cadre', dedans);
    pousser(x, y + h, x, y, 'cadre', dedans);
  }
  return out;
}

// Un segment coupe-t-il un rectangle ? Découpage de Liang-Barsky : on rogne le
// segment sur les quatre bords, et il reste quelque chose ou non.
function coupe(seg, r) {
  let t0 = 0, t1 = 1;
  const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
  const bornes = [[-dx, seg.x1 - r.x0], [dx, r.x1 - seg.x1],
                  [-dy, seg.y1 - r.y0], [dy, r.y1 - seg.y1]];
  for (const [p, q] of bornes) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) {
      if (t > t1) return false;
      if (t > t0) t0 = t;
    } else {
      if (t < t0) return false;
      if (t < t1) t1 = t;
    }
  }
  return t1 > t0;
}

function dansUnCadre(i, cadres) {
  return cadres.some((c) =>
    i.x0 >= c.x0 - TOLERANCE && i.x1 <= c.x1 + TOLERANCE &&
    i.y0 >= c.y0 - TOLERANCE && i.y1 <= c.y1 + TOLERANCE);
}

function gauche(t, l) {
  return t.ancre === 'middle' ? t.x - l / 2 : t.ancre === 'end' ? t.x - l : t.x;
}

// La boîte de la LIGNE : la place qu'un texte occupe, hampe et jambage
// compris. C'est elle qui décide si deux textes se gênent.
export function boite(t) {
  const l = CHASSE * t.taille * [...t.contenu].length;
  const x = gauche(t, l);
  return { x0: x, x1: x + l, y0: t.y - HAMPE * t.taille, y1: t.y + JAMBAGE * t.taille };
}

// La boîte de l'ENCRE : là où le noir tombe vraiment. C'est elle qui décide si
// un texte traverse le bord d'un aplat.
export function encre(t) {
  const l = CHASSE * t.taille * [...t.contenu].length;
  const x = gauche(t, l);
  const bas = DESCENDANTES.test(t.contenu) ? QUEUE : 0.05;
  return {
    x0: x, x1: x + l,
    y0: t.y - CAPITALE * t.taille,
    y1: t.y + bas * t.taille,
  };
}

// LES RECTANGLES QUI SE TOUCHENT N'EN FONT QU'UN. Une barre empilée est une
// bande, pas trois cases ; une bande d'échelle de couleur est une bande, pas
// deux cent cinquante-six pastilles de six pixels. On les fond sur leur
// GÉOMÉTRIE seule, sans regarder la teinte : c'est ce que l'œil voit, une
// surface peinte d'un tenant. Sans cette fusion, une étiquette posée quatre
// pixels trop bas sur une échelle se signalait vingt-huit fois — une fois par
// pastille — pour une seule faute.
function fondre(rects) {
  const colle = (a, b) =>
    a.x0 <= b.x1 + TOLERANCE && b.x0 <= a.x1 + TOLERANCE &&
    a.y0 <= b.y1 + TOLERANCE && b.y0 <= a.y1 + TOLERANCE;
  let zones = rects.map((r) => ({
    x0: r.x, x1: r.x + r.w, y0: r.y, y1: r.y + r.h, fond: r.fond, n: 1,
  }));
  for (let encore = true; encore; ) {
    encore = false;
    const sortie = [];
    for (const z of zones) {
      const voisin = sortie.find((s) => colle(s, z));
      if (voisin) {
        voisin.x0 = Math.min(voisin.x0, z.x0);
        voisin.x1 = Math.max(voisin.x1, z.x1);
        voisin.y0 = Math.min(voisin.y0, z.y0);
        voisin.y1 = Math.max(voisin.y1, z.y1);
        voisin.n += z.n;
        encore = true;
      } else {
        sortie.push({ ...z });
      }
    }
    zones = sortie;
  }
  return zones;
}

function croisement(a, b) {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  return w > TOLERANCE && h > TOLERANCE ? { w, h } : null;
}

function part(a, b, c) {
  const aire = (r) => Math.max(0, r.x1 - r.x0) * Math.max(0, r.y1 - r.y0);
  const petite = Math.min(aire(a), aire(b));
  return petite > 0 ? (c.w * c.h) / petite : 1;
}

const demandes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const detail = process.argv.includes('--detail');
const texteSeul = process.argv.includes('--texte');
const chapitres = demandes.length ? demandes : CHAPITRES;

const cas = [];
const ignores = [];
let figures = 0;
let boites = 0;

for (const chapitre of chapitres) {
  const dossier = join(RACINE, 'public', 'cours', chapitre);
  let noms = [];
  try {
    noms = (await readdir(dossier)).filter((n) => n.endsWith('.svg')).sort();
  } catch {
    noms = [];
  }
  if (noms.length === 0) {
    ignores.push(`${chapitre} : ${SANS_SVG[chapitre] ?? 'aucun SVG'}`);
    continue;
  }
  for (const nom of noms) {
    figures += 1;
    const figure = `${chapitre}/${nom}`;
    const svg = await readFile(join(dossier, nom), 'utf8');
    const racine = /<svg\b([^>]*)>/.exec(svg)?.[1] ?? '';
    const largeur = nombre(racine, 'width', 0);
    const hauteur = nombre(racine, 'height', 0);
    const lus = regrouper(textes(svg)).map((t) => ({ t, b: t.b }));
    boites += lus.length;

    // La règle des indices : une lettre, une espace, une lettre ou un chiffre
    // seul. C'est un indice composé à la main par deux éléments voisins, ou par
    // une chaîne plate, là où le cours a `txt_indice` et `txt_riche`.
    for (const { t } of lus) {
      if (INDICE_A_LA_MAIN.test(t.contenu)) {
        cas.push({
          figure,
          genre: 'indice plat',
          part: 1,
          quoi: `« ${t.contenu} » compose son indice à la main`,
          ou: t.morceaux > 1
            ? `${t.morceaux} éléments <text> voisins, y ${t.y}`
            : `une seule chaîne, y ${t.y}`,
        });
      }
    }

    for (let i = 0; i < lus.length; i += 1) {
      for (let j = i + 1; j < lus.length; j += 1) {
        const c = croisement(lus[i].b, lus[j].b);
        if (!c) continue;
        cas.push({
          figure,
          genre: 'texte / texte',
          part: part(lus[i].b, lus[j].b, c),
          quoi: `« ${lus[i].t.contenu} » et « ${lus[j].t.contenu} »`,
          ou: `y ${lus[i].t.y} et ${lus[j].t.y}, taille ${lus[i].t.taille}`,
        });
      }
    }

    if (texteSeul) continue;

    const aplats = fondre(pleins(svg, largeur, hauteur));
    for (const { t } of lus) {
      const i = encre(t);
      for (const a of aplats) {
        const c = croisement(i, a);
        if (!c) continue;
        const dedans =
          i.x0 >= a.x0 - TOLERANCE && i.x1 <= a.x1 + TOLERANCE &&
          i.y0 >= a.y0 - TOLERANCE && i.y1 <= a.y1 + TOLERANCE;
        if (dedans) continue;
        cas.push({
          figure,
          genre: 'texte / plein',
          part: part(i, a, c),
          quoi: `« ${t.contenu} » à cheval sur un aplat ${a.fond}` +
                (a.n > 1 ? ` (${a.n} rectangles fondus)` : ''),
          ou: `encre ${i.x0.toFixed(0)}…${i.x1.toFixed(0)} × ` +
              `${i.y0.toFixed(0)}…${i.y1.toFixed(0)}, aplat ` +
              `${a.x0.toFixed(0)}…${a.x1.toFixed(0)} × ` +
              `${a.y0.toFixed(0)}…${a.y1.toFixed(0)}`,
        });
      }
    }

    // texte sur trait
    const segments = segmentsDe(svg);
    // Les cadres qui se touchent font une table : un rang de cases accolees
    // est UNE region pour l'oeil, et une etiquette posee dans l'une d'elles
    // n'est pas a cheval sur la cloison de sa voisine.
    const cadres = fondre(
      segments.filter((s) => s.region).map((s) => ({
        x: s.region.x0, y: s.region.y0,
        w: s.region.x1 - s.region.x0, h: s.region.y1 - s.region.y0,
        fond: 'cadre',
      })),
    );
    for (const { t, b } of lus) {
      const garde = {
        x0: b.x0 - GARDE * t.taille, x1: b.x1 + GARDE * t.taille,
        y0: b.y0 - GARDE * t.taille, y1: b.y1 + GARDE * t.taille,
      };
      const touches = segments.filter((seg) => {
        if (!coupe(seg, garde)) return false;
        // Une étiquette entièrement dans le cadre est dans sa case. C'est
        // son ENCRE qu'on compare au cadre, comme pour un aplat : une case de
        // trente-huit pixels porte un texte de trente-trois centré sur sa
        // hauteur de capitale, et la boîte de sa ligne en dépasse d'un pixel
        // que personne ne voit.
        if (seg.region && dansUnCadre(encre(t), cadres)) return false;
        return true;
      });
      if (!touches.length) continue;
      const s0 = touches[0];
      cas.push({
        figure,
        genre: 'texte / trait',
        part: 1,
        quoi: `« ${t.contenu} » posé sur ${touches.length > 1
          ? `${touches.length} traits` : `un ${s0.quoi}`}`,
        ou: `texte y ${t.y}, ${s0.quoi} ` +
            `${s0.x1.toFixed(0)},${s0.y1.toFixed(0)} → ` +
            `${s0.x2.toFixed(0)},${s0.y2.toFixed(0)}`,
      });
    }

    for (const { t, b } of lus) {
      if (b.x0 < -TOLERANCE || b.y0 < -TOLERANCE ||
          b.x1 > largeur + TOLERANCE || b.y1 > hauteur + TOLERANCE) {
        cas.push({
          figure,
          genre: 'hors cadre',
          part: 1,
          quoi: `« ${t.contenu} » sort du cadre ${largeur}×${hauteur}`,
          ou: `boîte ${b.x0.toFixed(0)}…${b.x1.toFixed(0)} × ` +
              `${b.y0.toFixed(0)}…${b.y1.toFixed(0)}`,
        });
      }
    }
  }
}

for (const l of ignores) console.log(`  · ${l}`);

if (cas.length === 0) {
  console.log(`  ✓ ${figures} figure(s), ${boites} texte(s) · aucun recouvrement`);
  process.exit(0);
}

const parFigure = new Map();
for (const c of cas) {
  if (!parFigure.has(c.figure)) parFigure.set(c.figure, []);
  parFigure.get(c.figure).push(c);
}
const parGenre = new Map();
for (const c of cas) parGenre.set(c.genre, (parGenre.get(c.genre) ?? 0) + 1);

console.error(
  `\n  ${cas.length} recouvrement(s) sur ${parFigure.size} figure(s), ` +
    `${figures} examinée(s) — ` +
    [...parGenre].map(([g, n]) => `${n} ${g}`).join(', ') + '.\n',
);
for (const [figure, liste] of [...parFigure].sort()) {
  const pire = Math.max(...liste.map((c) => c.part));
  console.error(
    `  ✗ ${figure.padEnd(46)} ${String(liste.length).padStart(3)} ` +
      `· pire ${(pire * 100).toFixed(0)} %`,
  );
  if (detail) {
    for (const c of [...liste].sort((a, b) => b.part - a.part)) {
      console.error(
        `      ${c.genre.padEnd(14)} ${(c.part * 100).toFixed(0).padStart(3)} % ` +
          `${c.quoi}\n${' '.repeat(22)}${c.ou}`,
      );
    }
  }
}
if (!detail) console.error('\n  Relancer avec --detail pour voir chaque cas.');
process.exit(1);
