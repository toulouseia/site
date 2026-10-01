import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type {
  EtatAnimation,
  Manifeste,
} from "@/serveur/domaine/animations";
import {
  verifierAnimation,
  verifierPrevue,
} from "@/serveur/domaine/animations";
import type { DepotAnimations } from "@/serveur/ports";

// ─────────────────────────────────────────────────────────────────────────────
// Le dépôt d'animations : il lit le manifeste écrit par le pipeline Manim.
//
// Le fichier est lu depuis le disque, pas importé, un `import` de JSON le
// figerait dans le paquet au moment de la construction, et il faudrait
// reconstruire l'application pour publier une animation. Ici, déposer un
// manifeste à jour suffit.
//
// L'ABSENCE DE MANIFESTE N'EST PAS UNE PANNE. C'est l'état normal d'un
// développement où personne n'a lancé de rendu : le dépôt renvoie un manifeste
// vide, les leçons affichent leurs animations comme « à rendre », et rien ne
// casse. C'est la propriété qui permet de travailler sur les écrans sans avoir
// Python et LaTeX installés.
// ─────────────────────────────────────────────────────────────────────────────

const CHEMIN = path.join(process.cwd(), "public", "animations", "manifeste.json");

const VIDE: Manifeste = {
  version: 1,
  genere: "",
  animations: [],
  prevues: [],
};

/**
 * Le manifeste est lu une fois, jamais à chaque requête.
 *
 * EN PRODUCTION le cache vit aussi longtemps que le serveur : un manifeste
 * neuf demande un redémarrage, et c'est la bonne granularité pour un fichier
 * qu'on dépose après un rendu.
 *
 * EN DÉVELOPPEMENT, non. Le fichier est lu par `readFile` et non importé, donc
 * Turbopack ne le surveille pas et ne recharge pas ce module quand il change :
 * un rendu terminé pendant que le serveur tourne restait invisible, et la page
 * affichait « animation à rendre » pour une vidéo présente sur le disque.
 * Le défaut coûte cher parce qu'il ressemble à un rendu raté. On relit donc
 * quand la date de modification a bougé.
 */
const SURVEILLER = process.env.NODE_ENV !== "production";

let cache: Promise<Manifeste> | null = null;
let empreinte = "";

async function aChange(): Promise<boolean> {
  try {
    const { mtimeMs, size } = await stat(CHEMIN);
    const vue = `${mtimeMs}:${size}`;
    if (vue === empreinte) return false;
    empreinte = vue;
    return true;
  } catch {
    // Manifeste absent : l'état normal d'un poste sans rendu. On garde le
    // cache vide déjà construit plutôt que de relire à chaque requête.
    const vue = "absent";
    if (vue === empreinte) return false;
    empreinte = vue;
    return true;
  }
}

async function charger(): Promise<Manifeste> {
  let brut: unknown;
  try {
    brut = JSON.parse(await readFile(CHEMIN, "utf8"));
  } catch (erreur) {
    const code = (erreur as NodeJS.ErrnoException)?.code;
    if (code !== "ENOENT") {
      console.warn(`[animations] manifeste illisible (${CHEMIN}) :`, erreur);
    }
    return VIDE;
  }

  if (typeof brut !== "object" || brut === null) return VIDE;
  const m = brut as Record<string, unknown>;

  const animations = Array.isArray(m.animations)
    ? m.animations.map(verifierAnimation).filter((a) => a !== null)
    : [];
  const prevues = Array.isArray(m.prevues)
    ? m.prevues.map(verifierPrevue).filter((p) => p !== null)
    : [];

  const rejetees =
    (Array.isArray(m.animations) ? m.animations.length : 0) - animations.length;
  if (rejetees > 0) {
    console.warn(
      `[animations] ${rejetees} entrée(s) du manifeste rejetée(s) : champ obligatoire manquant.`,
    );
  }

  return {
    version: 1,
    genere: typeof m.genere === "string" ? m.genere : "",
    animations,
    prevues,
  };
}

async function manifeste(): Promise<Manifeste> {
  if (SURVEILLER && (await aChange())) cache = charger();
  cache ??= charger();
  return cache;
}

export const animationsDemo: DepotAnimations = {
  async obtenir(id) {
    const m = await manifeste();
    const rendue = m.animations.find((a) => a.id === id);
    if (rendue) return { rendue: true, animation: rendue };
    const prevue = m.prevues.find((p) => p.id === id);
    if (prevue) return { rendue: false, prevue };
    return null;
  },

  async lister(): Promise<EtatAnimation[]> {
    const m = await manifeste();
    return [
      ...m.animations.map((animation) => ({ rendue: true as const, animation })),
      ...m.prevues.map((prevue) => ({ rendue: false as const, prevue })),
    ];
  },
};
