// Les captures d'écran de la surface du 15 septembre, sur le site construit.
//
// Ce programme ne démarre aucun serveur : `capturer-surface.sh` le fait — un
// `wrangler dev` qui sert `out/` avec une base jetable où une personne et sa
// session ont été posées à la main, et un serveur de fichiers nu, sans `/api/`,
// pour photographier le repli quand le serveur manque.
//
//   node outils/capturer-surface.mjs http://localhost:8792 http://localhost:8793 dossier/
//
// Tout ce qui est photographié a été fait par le chemin réel : le projet est
// déposé par le formulaire, dans le navigateur, avec la session posée.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { launch } from './cdp.mjs';

const [SERVEUR, SANS_API, SORTIE] = process.argv.slice(2);
if (!SERVEUR || !SANS_API || !SORTIE) {
  console.error('Usage : node outils/capturer-surface.mjs <serveur> <serveur-sans-api> <dossier>');
  process.exit(1);
}
const JETON = process.env.JETON ?? 'jeton-capture';

const FORMATS = {
  telephone: { w: 390, h: 844, echelle: 2, mobile: true },
  etroit: { w: 360, h: 780, echelle: 2, mobile: true },
  ordinateur: { w: 1440, h: 900, echelle: 1, mobile: false },
};

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(SORTIE, { recursive: true });
const nav = await launch({ width: 1440, height: 900 });
const { page } = nav;
await page.send('Network.enable');
const ecrites = [];

async function format(nom) {
  const f = FORMATS[nom];
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: f.w, height: f.h, deviceScaleFactor: f.echelle, mobile: f.mobile,
  });
  return f;
}

/** Attend que le fournisseur ait répondu : l'écran ne dit plus « inconnu ». */
async function attendrePret(ms = 6000) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    const pret = await page.eval(`document.fonts.status === 'loaded' && !document.querySelector('[data-moi="inconnu"]')`);
    if (pret) break;
    await dormir(100);
  }
  await dormir(500);
}

/**
 * Sans découpe, la photo est celle de la fenêtre telle qu'on la voit — après
 * un défilement aussi. Photographier au-delà de la fenêtre agrandirait celle-ci
 * à la hauteur du document, et les barres fixées en bas se retrouveraient au
 * milieu de l'image.
 */
async function capturer(nom, formatNom, { clip } = {}) {
  const f = await format(formatNom);
  await attendrePret();
  const png = await page.shot(
    clip ? { clip: { ...clip, scale: f.echelle } } : { beyondViewport: false },
  );
  const fichier = `${nom}-${formatNom}.png`;
  await writeFile(join(SORTIE, fichier), png);
  ecrites.push(fichier);
  console.log(`  ${fichier}`);
}

async function aller(base, chemin, formatNom) {
  await format(formatNom);
  await page.goto(base + chemin);
  await attendrePret();
}

async function connecter(base, oui) {
  if (oui) {
    await page.send('Network.setCookie', { name: 'session', value: JETON, url: base, path: '/' });
  } else {
    await page.send('Network.clearBrowserCookies');
  }
}

/** Écrit dans un champ contrôlé par React : le setter natif, puis l'événement. */
const ECRIRE = `(sel, valeur) => {
  const el = document.querySelector(sel);
  if (!el) throw new Error('champ absent : ' + sel);
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, valeur);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}`;
const CLIQUER = `(texte, racine) => {
  const visibles = [...document.querySelectorAll((racine ?? '') + ' button, ' + (racine ?? '') + ' a')]
    .filter((b) => b.offsetParent !== null);
  const t = (b) => b.textContent.replace(/\\s+/g, ' ').trim();
  const cible = visibles.find((b) => t(b) === texte)
    ?? visibles.find((b) => t(b).startsWith(texte))
    ?? visibles.find((b) => t(b).includes(texte));
  if (!cible) throw new Error('commande absente : ' + texte);
  cible.click();
}`;

try {
  // ── 1. Non connecté : rail, barre du bas, /profil ─────────────────────────
  console.log('non connecté');
  await connecter(SERVEUR, false);
  await aller(SERVEUR, '/projets/', 'ordinateur');
  await capturer('01-rail-non-connecte', 'ordinateur');
  await capturer('01-rail-non-connecte-detail', 'ordinateur', { clip: { x: 0, y: 900 - 200, width: 260, height: 200 } });
  await aller(SERVEUR, '/projets/', 'telephone');
  await capturer('02-barre-non-connecte', 'telephone');
  await aller(SERVEUR, '/projets/', 'etroit');
  await capturer('02-barre-non-connecte', 'etroit');
  await aller(SERVEUR, '/profil/', 'ordinateur');
  await capturer('03-profil-non-connecte', 'ordinateur');
  await aller(SERVEUR, '/profil/', 'telephone');
  await capturer('03-profil-non-connecte', 'telephone');
  await aller(SERVEUR, '/deposer/', 'ordinateur');
  await capturer('04-deposer-non-connecte', 'ordinateur');

  // ── 2. Connecté : la session posée à la main, le témoin dans le navigateur ─
  console.log('connecté');
  await connecter(SERVEUR, true);
  await aller(SERVEUR, '/projets/', 'ordinateur');
  await capturer('05-rail-connecte', 'ordinateur');
  await capturer('05-rail-connecte-detail', 'ordinateur', { clip: { x: 0, y: 900 - 200, width: 260, height: 200 } });
  await aller(SERVEUR, '/projets/', 'telephone');
  await capturer('06-barre-connecte', 'telephone');
  await aller(SERVEUR, '/profil/', 'ordinateur');
  await capturer('07-profil-connecte', 'ordinateur');
  await aller(SERVEUR, '/profil/', 'telephone');
  await capturer('07-profil-connecte', 'telephone');

  // ── 3. Le formulaire de création, puis le dépôt réel ──────────────────────
  await aller(SERVEUR, '/deposer/', 'ordinateur');
  await capturer('08-deposer-creation-vide', 'ordinateur');
  const ecrire = async (sel, valeur) => page.eval(`(${ECRIRE})(${JSON.stringify(sel)}, ${JSON.stringify(valeur)})`);
  const cliquer = async (texte, racine) => page.eval(`(${CLIQUER})(${JSON.stringify(texte)}, ${JSON.stringify(racine ?? null)})`);
  await ecrire('input[placeholder="Sillage"]', 'Sillage');
  await ecrire('input[placeholder^="Perte de liaison"]', "Perte de liaison vidéo d'un drone, détectée avant la coupure.");
  await ecrire('textarea', "Un modèle embarqué qui lit le flux vidéo et prédit la coupure quelques secondes avant. Premier essai sur un quadricoptère de l'association.");
  await ecrire('input[placeholder="toulouseia/sillage"]', 'toulouseia/sillage');
  await cliquer('Embedded');
  await cliquer('En chantier');
  await cliquer('Ouvert aux échanges');
  await ecrire('input[aria-label="Identifiant du moyen 1"]', 'ana.essai');
  await dormir(300);
  await capturer('09-deposer-creation-rempli', 'ordinateur');
  await aller(SERVEUR, '/deposer/', 'telephone');
  await capturer('09-deposer-creation-rempli', 'telephone');
  // (le téléphone recharge la page : le brouillon n'est pas gardé sans partir
  // se connecter — on retape sur ordinateur avant d'envoyer)
  await aller(SERVEUR, '/deposer/', 'ordinateur');
  await ecrire('input[placeholder="Sillage"]', 'Sillage');
  await ecrire('input[placeholder^="Perte de liaison"]', "Perte de liaison vidéo d'un drone, détectée avant la coupure.");
  await ecrire('textarea', "Un modèle embarqué qui lit le flux vidéo et prédit la coupure quelques secondes avant. Premier essai sur un quadricoptère de l'association.");
  await ecrire('input[placeholder="toulouseia/sillage"]', 'toulouseia/sillage');
  await cliquer('Embedded');
  await cliquer('En chantier');
  await cliquer('Ouvert aux échanges');
  await ecrire('input[aria-label="Identifiant du moyen 1"]', 'ana.essai');
  await dormir(300);
  await cliquer('Déposer le projet');
  for (let i = 0; i < 60 && !(await page.eval('location.pathname')).startsWith('/projets/fiche'); i++) await dormir(200);
  const adresse = await page.eval('location.pathname + location.search');
  console.log('  déposé → ' + adresse);
  if (!adresse.startsWith('/projets/fiche')) throw new Error('le dépôt n’a pas mené à la fiche : ' + adresse);
  await dormir(800);
  await capturer('10-fiche-du-projet-depose', 'ordinateur');
  await aller(SERVEUR, adresse, 'telephone');
  await capturer('10-fiche-du-projet-depose', 'telephone');

  // ── 4. Le projet déposé, sur le mur et dans le carrousel ──────────────────
  await aller(SERVEUR, '/projets/', 'ordinateur');
  await dormir(1200);
  // Le survol, par la souris elle-même : React synthétise `onMouseEnter` à
  // partir de `mouseover`, un `mouseenter` fabriqué ne l'atteint pas.
  const centre = await page.eval(`(() => { const c = [...document.querySelectorAll('[data-case]')].find((e) => e.textContent.includes('Sillage')); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (centre) await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: centre.x, y: centre.y });
  await dormir(400);
  await capturer('11-mur-avec-le-projet-depose', 'ordinateur');
  await aller(SERVEUR, '/projets/', 'telephone');
  await dormir(1200);
  // Quand la base ajoute une carte en tête, Chrome garde sous le pouce celle
  // qui y était (l'accrochage suit l'élément, pas la position) : on ramène la
  // piste au début, comme le ferait un geste vers la droite.
  await page.eval(`document.getElementById('piste-projets').scrollTo({ left: 0, behavior: 'auto' })`);
  await dormir(400);
  await capturer('12-carrousel-avec-le-projet-depose', 'telephone');
  await aller(SERVEUR, '/projets/fiche/?p=nexiste-pas', 'ordinateur');
  await dormir(800);
  await capturer('13-fiche-inconnue', 'ordinateur');

  // ── 5. Mes projets, et le formulaire de modification ──────────────────────
  await aller(SERVEUR, '/profil/', 'ordinateur');
  await dormir(800);
  await capturer('14-profil-mes-projets', 'ordinateur');
  await cliquer('Modifier');
  for (let i = 0; i < 40 && !(await page.eval('location.search')).includes('projet='); i++) await dormir(200);
  await dormir(1200);
  await capturer('15-deposer-modification', 'ordinateur');
  const modif = await page.eval('location.pathname + location.search');
  await aller(SERVEUR, modif, 'telephone');
  await dormir(1200);
  // Tout en bas : les commandes du projet lui-même (pause, suppression) doivent
  // se lire au-dessus des barres fixées.
  await page.eval(`window.scrollTo(0, document.documentElement.scrollHeight)`);
  await dormir(300);
  await capturer('15-deposer-modification-bas', 'telephone');
  await aller(SERVEUR, modif, 'ordinateur');
  await dormir(1200);
  await cliquer('Supprimer');
  await dormir(300);
  // La confirmation est au pied du formulaire : on y descend, comme on le
  // ferait après avoir cliqué.
  await page.eval(`(() => { const b = [...document.querySelectorAll('button')].find((e) => e.textContent.includes('Confirmer la suppression')); if (b) b.scrollIntoView({ block: 'end' }); })()`);
  await dormir(300);
  await capturer('16-suppression-a-confirmer', 'ordinateur');

  // ── 6. Le repli : les pages sans le serveur ───────────────────────────────
  console.log('sans serveur');
  await aller(SANS_API, '/projets/', 'ordinateur');
  await dormir(2500);
  await capturer('17-repli-sans-serveur-mur', 'ordinateur');
  await aller(SANS_API, '/projets/', 'telephone');
  await dormir(2500);
  await capturer('17-repli-sans-serveur-carrousel', 'telephone');
  await aller(SANS_API, '/profil/', 'ordinateur');
  await dormir(1500);
  await capturer('18-repli-sans-serveur-profil', 'ordinateur');

  console.log(`\n${ecrites.length} images dans ${SORTIE}`);
} finally {
  await nav.close();
}
