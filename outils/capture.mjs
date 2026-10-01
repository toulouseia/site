// Capture d'écran de l'application, en format téléphone et en format ordinateur.
// Démarre le serveur de développement lui-même sur un port libre, prend les images,
// puis arrête tout. Zéro dépendance npm.
//
//   node outils/capture.mjs /
//   node outils/capture.mjs / /projets /projets/1
//
// Écrit dans captures/ quatre images par chemin :
//   <nom>-telephone-arrivee.png   ce qu'on voit sans faire défiler, sur un téléphone
//   <nom>-telephone-plein.png     la page entière, sur un téléphone
//   <nom>-ordinateur-arrivee.png  ce qu'on voit sans faire défiler, sur un ordinateur
//   <nom>-ordinateur-plein.png    la page entière, sur un ordinateur
//
// Ne pas modifier.

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';

// Dans les dossiers d'atelier, le projet Next.js était un sous-dossier `app/`.
// Ici le projet est à la racine : l'outil est le même, ces deux lignes près.
const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));
const APP = RACINE;
const SORTIE = join(RACINE, 'captures');

const FORMATS = [
  { nom: 'telephone', w: 390, h: 844, echelle: 2 },
  { nom: 'ordinateur', w: 1440, h: 900, echelle: 1 },
];

function portLibre() {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

async function attendre(url, msMax = 120000) {
  const fin = Date.now() + msMax;
  while (Date.now() < fin) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (r.status < 500) return;
    } catch { /* pas encore prêt */ }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Le serveur n'a pas répondu sur ${url} en ${msMax / 1000} s`);
}

function nomDeFichier(chemin) {
  const n = chemin.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
  return n || 'accueil';
}

const chemins = process.argv.slice(2);
if (chemins.length === 0) {
  console.error('Usage : node outils/capture.mjs /chemin [/autre-chemin ...]');
  process.exit(1);
}

const port = await portLibre();
const base = `http://127.0.0.1:${port}`;

console.log(`Démarrage du serveur sur le port ${port}…`);
const serveur = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
  cwd: APP,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, BROWSER: 'none' },
});
let journal = '';
serveur.stdout.on('data', (d) => { journal += d; });
serveur.stderr.on('data', (d) => { journal += d; });
serveur.on('exit', (code) => {
  if (code !== null && code !== 0) console.error(`Le serveur s'est arrêté (code ${code})\n${journal}`);
});

const arret = () => { try { process.kill(-serveur.pid, 'SIGKILL'); } catch { /* rien */ } serveur.kill('SIGKILL'); };
process.on('exit', arret);
process.on('SIGINT', () => { arret(); process.exit(130); });

let nav;
try {
  await attendre(base);
  await mkdir(SORTIE, { recursive: true });
  nav = await launch({ width: 1440, height: 900 });
  const { page } = nav;

  for (const chemin of chemins) {
    const url = base + (chemin.startsWith('/') ? chemin : '/' + chemin);
    const nom = nomDeFichier(chemin);

    // première visite : Next compile la page à la demande, on ne photographie pas ça
    await page.goto(url);
    await new Promise((r) => setTimeout(r, 1500));

    for (const f of FORMATS) {
      await page.viewport(f.w, f.h, f.echelle);
      await page.goto(url);
      // laisse les fontes et les animations d'entrée se poser
      await page.eval('document.fonts ? document.fonts.ready.then(() => true) : true');
      await new Promise((r) => setTimeout(r, 900));

      const arrivee = await page.shot({
        clip: { x: 0, y: 0, width: f.w, height: f.h, scale: f.echelle },
      });
      await writeFile(join(SORTIE, `${nom}-${f.nom}-arrivee.png`), arrivee);

      const hauteur = await page.eval(
        'Math.min(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), 12000)'
      );
      const plein = await page.shot({
        clip: { x: 0, y: 0, width: f.w, height: hauteur, scale: f.echelle },
      });
      await writeFile(join(SORTIE, `${nom}-${f.nom}-plein.png`), plein);

      console.log(`  ${nom} · ${f.nom} · ${f.w}×${hauteur}`);
    }
  }
  console.log(`\nImages écrites dans captures/. Ouvre-les réellement.`);
} catch (e) {
  console.error('Échec : ' + e.message);
  if (journal) console.error('--- journal du serveur ---\n' + journal.slice(-3000));
  process.exitCode = 1;
} finally {
  if (nav) await nav.close();
  arret();
}
