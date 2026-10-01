// ─────────────────────────────────────────────────────────────────────────────
// L'AI Academy, la hiérarchie du savoir.
//
//   Parcours  →  Cours  →  Chapitre  →  Leçon  →  Bloc de contenu
//
// Un parcours est une intention pédagogique : « savoir faire du machine
// learning ». Un cours est une unité qu'on termine. Un chapitre regroupe les
// leçons qui vont ensemble. Une leçon est ce qu'on ouvre, ce qu'on lit, ce
// qu'on marque comme terminé : c'est l'unité de progression, et la seule.
//
// Deux formes coexistent pour chaque objet : la forme LÉGÈRE, qui suffit aux
// listes et aux sommaires, et la forme COMPLÈTE, qui porte les enfants ou les
// blocs. Un catalogue qui trimballerait le contenu de toutes ses leçons ne
// tiendrait pas à cinquante cours ; la séparation est là dès le premier jour
// pour qu'on n'ait pas à la découvrir à cinquante.
// ─────────────────────────────────────────────────────────────────────────────

import type { Bloc } from "./blocs";
import type { DateISO, Id, Niveau, Statut } from "./commun";

export type IdParcours = Id<"parcours">;
export type IdCours = Id<"cours">;
export type IdChapitre = Id<"chapitre">;
export type IdLecon = Id<"lecon">;
export type IdPersonne = Id<"personne">;

/**
 * Le genre d'une leçon. Il décide de l'icône, du verbe du bouton et de la
 * façon dont la leçon compte dans l'avancement, pas de sa mise en page, qui
 * est déterminée par ses blocs.
 */
export type GenreLecon =
  | "lecture" // du texte et des figures : on lit
  | "demo" // une animation ou une démonstration : on regarde
  | "exercice" // on fait, puis on vérifie
  | "quiz" // on répond, la réponse est corrigée
  | "carnet"; // un notebook à exécuter ailleurs

/** Ce qu'il faut savoir avant d'ouvrir un cours. */
export type Prerequis = {
  /** La phrase telle qu'elle se lit : « Dérivées et gradient ». */
  texte: string;
  /** Le cours de l'Academy qui l'enseigne, quand il existe. */
  coursSlug?: string;
};

// ── Parcours ────────────────────────────────────────────────────────────────

export type Parcours = {
  id: IdParcours;
  slug: string;
  nom: string;
  /** Une ligne, dans la liste. Groupe nominal, jamais une phrase. */
  resume: string;
  /** Deux ou trois phrases, sur la page du parcours seulement. */
  presentation: string;
  niveau: Niveau;
  statut: Statut;
  /** L'ordre d'affichage dans le catalogue. Petit d'abord. */
  rang: number;
  /** Les cours du parcours, dans l'ordre où on les suit. */
  coursIds: IdCours[];
};

/** Un parcours et ses cours résolus, la forme que consomment les écrans. */
export type ParcoursComplet = Parcours & {
  cours: Cours[];
  /** Somme des minutes des cours publiés. */
  minutes: number;
  nbLecons: number;
};

// ── Cours ───────────────────────────────────────────────────────────────────

export type Cours = {
  id: IdCours;
  slug: string;
  /** L'intitulé complet, tel qu'il se lit : « Statistiques pour le ML ». */
  nom: string;
  resume: string;
  presentation: string;
  parcoursId: IdParcours;
  niveau: Niveau;
  statut: Statut;
  rang: number;
  /** Ce qu'on saura faire à la fin. Trois à six lignes, verbe à l'infinitif. */
  objectifs: string[];
  prerequis: Prerequis[];
  auteurIds: IdPersonne[];
  /** Somme des minutes des leçons publiées. Calculée, jamais saisie. */
  minutes: number;
  /** Nombre de leçons publiées. Calculé. */
  nbLecons: number;
  /** Nombre de chapitres portant au moins une leçon publiée. Calculé. */
  nbChapitres: number;
  maj: DateISO;
};

/** Un cours et son sommaire. Ce que sert la page d'un cours. */
export type CoursComplet = Cours & {
  parcours: Pick<Parcours, "id" | "slug" | "nom">;
  sommaire: ChapitreComplet[];
  auteurs: Auteur[];
};

export type Auteur = {
  id: IdPersonne;
  nom: string;
  /**
   * « 2A · ModIA », ou « Enseignant invité ». Une ligne, jamais plus. Vide tant
   * que l'intéressé ne l'a pas donnée : l'écran n'affiche alors que le nom.
   */
  qualite: string;
};

// ── Chapitre ────────────────────────────────────────────────────────────────

export type Chapitre = {
  id: IdChapitre;
  slug: string;
  titre: string;
  /** Facultatif : un chapitre n'a pas toujours besoin d'être présenté. */
  resume?: string;
  coursId: IdCours;
  rang: number;
};

export type ChapitreComplet = Chapitre & {
  lecons: Lecon[];
  minutes: number;
};

// ── Leçon ───────────────────────────────────────────────────────────────────

/**
 * La leçon sans son contenu. C'est ce qui circule dans les sommaires et dans
 * les compteurs de progression, jamais ses blocs.
 */
export type Lecon = {
  id: IdLecon;
  slug: string;
  titre: string;
  resume: string;
  chapitreId: IdChapitre;
  coursId: IdCours;
  rang: number;
  genre: GenreLecon;
  minutes: number;
  statut: Statut;
  /** Une leçon libre se lit sans être inscrit au cours. */
  libre?: boolean;
};

/** La leçon et ses blocs. Chargée seulement quand on l'ouvre. */
export type LeconComplete = Lecon & {
  blocs: Bloc[];
  cours: Pick<Cours, "id" | "slug" | "nom">;
  chapitre: Pick<Chapitre, "id" | "slug" | "titre" | "rang">;
  /** Les deux voisines dans l'ordre du cours, pour naviguer sans revenir. */
  precedente: Pick<Lecon, "slug" | "titre"> | null;
  suivante: Pick<Lecon, "slug" | "titre"> | null;
  /** Le rang de la leçon dans le cours entier, et le total. « 4 sur 12 ». */
  position: { rang: number; total: number };
};

/**
 * Un cours et la liste plate de ses leçons. C'est la forme que le serveur
 * envoie au navigateur pour qu'il calcule l'avancement lui-même : sans compte,
 * la progression vit là-bas, donc le calcul aussi. Une leçon pèse onze petits
 * champs ; trente leçons tiennent dans quelques kilo-octets.
 */
export type CoursAvecLecons = Cours & { lecons: Lecon[] };

/** Le catalogue entier, prêt pour le calcul d'avancement côté navigateur. */
export type ParcoursAvecLecons = Omit<ParcoursComplet, "cours"> & {
  cours: CoursAvecLecons[];
};

// ── Ce qui traverse la hiérarchie ───────────────────────────────────────────

/** Le résultat d'une recherche dans l'Academy, tous niveaux confondus. */
export type Trouvaille =
  | { genre: "parcours"; parcours: Parcours }
  | { genre: "cours"; cours: Cours }
  | { genre: "lecon"; lecon: Lecon; coursSlug: string; coursNom: string };
