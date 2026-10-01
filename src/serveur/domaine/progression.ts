// ─────────────────────────────────────────────────────────────────────────────
// LA PROGRESSION
//
// L'unité de progression est la LEÇON, et rien d'autre. Un cours n'a pas
// d'avancement propre : le sien se calcule depuis ses leçons, à chaque fois.
// Rien n'est dénormalisé tant qu'on n'a pas mesuré que c'est trop lent, un
// pourcentage stocké qui dérive de sa source est la première dette d'une
// plateforme d'apprentissage, et elle ne se rembourse jamais.
//
// Ce fichier ne dit pas OÙ la progression est rangée. Aujourd'hui elle vit
// dans le navigateur ; demain dans Postgres, rattachée à un compte. Les deux
// implémentent le même port (`serveur/ports.ts`) et produisent le même objet
// `Progression`. Les calculs ci-dessous ne changeront pas.
// ─────────────────────────────────────────────────────────────────────────────

import type { Chapitre, Cours, IdCours, IdLecon, Lecon } from "./academy";
import type { Id } from "./commun";

export type IdVisiteur = Id<"visiteur">;

/**
 * Trois états, et le troisième est le seul qui compte. « En cours » n'est pas
 * déclaré par l'étudiant : c'est ce qu'on déduit d'une leçon ouverte et non
 * terminée.
 */
export type EtatLecon = "neuve" | "ouverte" | "terminee";

export type MarqueLecon = {
  leconId: IdLecon;
  etat: EtatLecon;
  /** Quand elle a été touchée pour la dernière fois. ISO complet. */
  vue: string;
  /** Secondes passées dessus, si un jour on les mesure. */
  secondes?: number;
};

/** Ce qu'on retient d'un cours commencé. */
export type Inscription = {
  coursId: IdCours;
  debut: string;
  /** La dernière leçon ouverte : c'est là que « Reprendre » emmène. */
  dernierePosition?: IdLecon;
  /** Renseigné le jour où toutes les leçons publiées sont terminées. */
  fin?: string;
};

/**
 * Tout ce qu'on sait d'un visiteur. Un seul objet : il se charge d'un coup,
 * se sérialise tel quel, et se remplace entièrement quand il change, pas de
 * fusion partielle, pas de conflit à arbitrer.
 */
export type Progression = {
  visiteurId: IdVisiteur;
  inscriptions: Inscription[];
  /** Indexée par leçon : c'est la lecture la plus fréquente, de loin. */
  lecons: Record<string, MarqueLecon>;
  /** Dernière écriture, pour départager deux appareils un jour. */
  maj: string;
};

export const PROGRESSION_VIDE: Progression = {
  visiteurId: "anonyme",
  inscriptions: [],
  lecons: {},
  maj: "",
};

// ── Ce qu'on calcule ────────────────────────────────────────────────────────

/** L'avancement d'un cours, tel qu'il s'affiche partout. */
export type Avancement = {
  coursId: IdCours;
  /** Leçons publiées terminées. */
  faites: number;
  /** Leçons publiées, en tout. Zéro quand le cours n'a rien de publié. */
  total: number;
  /** De 0 à 1. Vaut 0 quand `total` vaut 0, jamais NaN. */
  part: number;
  /** Le cran de la jauge du signe : 0, 1, 2 ou 3. */
  cran: 0 | 1 | 2 | 3;
  /** Minutes restantes, estimées depuis les leçons non terminées. */
  minutesRestantes: number;
  commence: boolean;
  termine: boolean;
};

export function etatDe(
  progression: Progression,
  leconId: IdLecon,
): EtatLecon {
  return progression.lecons[leconId]?.etat ?? "neuve";
}

/**
 * Le cran de la jauge. Quatre paliers, choisis pour que le signe raconte
 * quelque chose de vrai : rien de commencé, entamé, à mi-course, fini.
 */
export function cranDe(part: number, commence: boolean): 0 | 1 | 2 | 3 {
  if (part >= 1) return 3;
  if (part >= 0.5) return 2;
  if (part > 0 || commence) return 1;
  return 0;
}

/**
 * L'avancement d'un cours. Les leçons non publiées ne comptent ni au
 * numérateur ni au dénominateur : un cours dont la moitié reste à écrire ne
 * doit pas afficher 50 % à quelqu'un qui l'a terminé.
 */
export function avancementCours(
  cours: Pick<Cours, "id">,
  lecons: readonly Lecon[],
  progression: Progression,
): Avancement {
  const publiees = lecons.filter((l) => l.statut === "publie");
  const faites = publiees.filter(
    (l) => etatDe(progression, l.id) === "terminee",
  );
  const total = publiees.length;
  const part = total === 0 ? 0 : faites.length / total;

  const inscrit = progression.inscriptions.some((i) => i.coursId === cours.id);
  const touche = publiees.some((l) => etatDe(progression, l.id) !== "neuve");
  const commence = inscrit || touche;

  return {
    coursId: cours.id,
    faites: faites.length,
    total,
    part,
    cran: cranDe(part, commence),
    minutesRestantes: publiees
      .filter((l) => etatDe(progression, l.id) !== "terminee")
      .reduce((n, l) => n + l.minutes, 0),
    commence,
    termine: total > 0 && faites.length === total,
  };
}

/**
 * Où reprendre. Dans l'ordre : la dernière leçon ouverte si elle n'est pas
 * finie, sinon la première leçon publiée non terminée, sinon rien, le cours
 * est fini.
 */
export function ouReprendre(
  coursId: IdCours,
  lecons: readonly Lecon[],
  progression: Progression,
): Lecon | null {
  const publiees = lecons.filter((l) => l.statut === "publie");
  if (publiees.length === 0) return null;

  const inscription = progression.inscriptions.find(
    (i) => i.coursId === coursId,
  );
  if (inscription?.dernierePosition) {
    const derniere = publiees.find((l) => l.id === inscription.dernierePosition);
    if (derniere && etatDe(progression, derniere.id) !== "terminee") {
      return derniere;
    }
  }

  return publiees.find((l) => etatDe(progression, l.id) !== "terminee") ?? null;
}

/** Les leçons d'un cours, à plat, dans l'ordre de lecture. */
export function leconsAPlat(
  sommaire: readonly (Chapitre & { lecons: Lecon[] })[],
): Lecon[] {
  return [...sommaire]
    .sort((a, b) => a.rang - b.rang)
    .flatMap((c) => [...c.lecons].sort((a, b) => a.rang - b.rang));
}

// ── Le tableau de bord ──────────────────────────────────────────────────────

/** Ce qu'on montre en tête de l'Academy : ce qu'on a commencé, et où. */
export type Reprise = {
  cours: Cours;
  lecon: Lecon;
  avancement: Avancement;
  /** ISO, sert à trier du plus récent au plus ancien. */
  vue: string;
};

/** Les chiffres d'un visiteur. Tous dérivés, aucun stocké. */
export type Bilan = {
  coursCommences: number;
  coursTermines: number;
  leconsFaites: number;
  minutesFaites: number;
  /** Le nombre de jours d'affilée avec au moins une leçon terminée. */
  serie: number;
};

/**
 * La série : des jours consécutifs, en remontant depuis aujourd'hui. Un jour
 * manqué la remet à zéro. On compte les jours, pas les leçons, dix leçons
 * dans la même soirée valent une journée.
 */
export function serieDeJours(
  progression: Progression,
  aujourdhui: string,
): number {
  const jours = new Set(
    Object.values(progression.lecons)
      .filter((m) => m.etat === "terminee" && m.vue)
      .map((m) => m.vue.slice(0, 10)),
  );
  if (jours.size === 0) return 0;

  const JOUR = 86_400_000;
  const depart = Date.parse(aujourdhui + "T00:00:00Z");
  if (Number.isNaN(depart)) return 0;

  // Si rien aujourd'hui, la série peut encore courir depuis hier.
  let curseur = jours.has(aujourdhui) ? depart : depart - JOUR;
  let n = 0;
  while (jours.has(new Date(curseur).toISOString().slice(0, 10))) {
    n += 1;
    curseur -= JOUR;
  }
  return n;
}
