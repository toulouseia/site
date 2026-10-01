// ─────────────────────────────────────────────────────────────────────────────
// QUI REGARDE, et ce qu'il a le droit de faire.
//
// Les comptes n'existent pas encore. Ce fichier n'attend pas qu'ils existent :
// il définit dès maintenant la forme de celui qui regarde, et tout le reste de
// l'application passe par elle. Aujourd'hui elle ne renvoie qu'un anonyme ;
// le jour où une session existe, un seul fichier change, `services/session.ts`.
//
// La règle qui rend ça possible : AUCUN écran, AUCUN service ne teste
// « est-ce que l'utilisateur est connecté ». Ils demandent « ce visiteur
// peut-il faire ceci », `peut(visiteur, "editer:cours", cours)`. La question
// reste juste quand les rôles se compliquent ; l'autre non.
// ─────────────────────────────────────────────────────────────────────────────

import type { Id } from "./commun";

export type IdVisiteur = Id<"visiteur">;

/**
 * Quatre rôles, dans l'ordre croissant de pouvoir. Un rôle supérieur peut tout
 * ce que peut le rôle inférieur : la hiérarchie est un ordre total, exprès,
 * une grille de droits croisés est ingérable pour un club.
 */
export type Role = "anonyme" | "membre" | "formateur" | "administrateur";

const RANG: Record<Role, number> = {
  anonyme: 0,
  membre: 1,
  formateur: 2,
  administrateur: 3,
};

export type Visiteur = {
  id: IdVisiteur;
  role: Role;
  /** Absent pour l'anonyme. */
  nom?: string;
  /** L'identifiant du membre du club, quand le compte est rattaché. */
  personneId?: string;
  /**
   * Vrai quand la session vient d'un vrai compte. Aujourd'hui toujours faux :
   * c'est ce drapeau que l'authentification retournera, et c'est le seul
   * endroit de l'application où la différence se lit.
   */
  authentifie: boolean;
};

/** Le visiteur par défaut : personne, avec les droits de personne. */
export const ANONYME: Visiteur = {
  id: "anonyme",
  role: "anonyme",
  authentifie: false,
};

export function auMoins(visiteur: Visiteur, role: Role): boolean {
  return RANG[visiteur.role] >= RANG[role];
}

// ── Les droits ──────────────────────────────────────────────────────────────

/**
 * Ce qu'on peut vouloir faire. La liste est fermée : une action qui n'est pas
 * ici ne peut pas être demandée, et le compilateur le dit.
 */
export type Action =
  // Lecture
  | "voir:catalogue"
  | "voir:lecon"
  | "voir:brouillon"
  // Progression, écrire la sienne, lire celle des autres
  | "suivre:cours"
  | "ecrire:progression"
  | "voir:progression-autrui"
  // Rédaction
  | "creer:cours"
  | "editer:cours"
  | "publier:cours"
  | "supprimer:cours"
  // Administration
  | "voir:statistiques"
  | "gerer:membres"
  | "gerer:seances";

/**
 * Le sujet d'une action, quand il y en a un. Volontairement minimal : on ne
 * passe que ce dont la décision a besoin, pas l'objet entier, sinon le jour
 * où l'objet grossit, la fonction de droits devient impossible à appeler.
 */
export type Sujet = {
  /** Le propriétaire de la ressource, s'il en a un. */
  auteurIds?: readonly string[];
  /** Brouillon, annoncé, publié, archivé. */
  statut?: "brouillon" | "annonce" | "publie" | "archive";
  /** Le visiteur concerné, pour tout ce qui touche à la progression. */
  visiteurId?: string;
};

/**
 * La seule question que pose l'application. Pure, synchrone, sans effet : elle
 * se teste en trois lignes et se lit d'un bloc.
 */
export function peut(
  visiteur: Visiteur,
  action: Action,
  sujet?: Sujet,
): boolean {
  const estAuteur =
    !!sujet?.auteurIds &&
    !!visiteur.personneId &&
    sujet.auteurIds.includes(visiteur.personneId);

  switch (action) {
    // ── Lecture ────────────────────────────────────────────────────────────
    case "voir:catalogue":
      return true;

    case "voir:lecon":
      // Publié : tout le monde. Annoncé : rien à ouvrir, la page l'explique.
      // Brouillon : son auteur, ou l'administration. Archivé : le club.
      if (sujet?.statut === "publie" || sujet?.statut === undefined) return true;
      if (sujet.statut === "archive") return auMoins(visiteur, "formateur");
      return estAuteur || auMoins(visiteur, "administrateur");

    case "voir:brouillon":
      return estAuteur || auMoins(visiteur, "administrateur");

    // ── Progression ────────────────────────────────────────────────────────
    // Un anonyme progresse : sa progression vit dans son navigateur. C'est un
    // choix de produit, pas un trou, on ne demande pas de créer un compte
    // pour cocher une leçon.
    case "suivre:cours":
    case "ecrire:progression":
      return sujet?.visiteurId === undefined || sujet.visiteurId === visiteur.id;

    case "voir:progression-autrui":
      return auMoins(visiteur, "formateur");

    // ── Rédaction ──────────────────────────────────────────────────────────
    case "creer:cours":
      return auMoins(visiteur, "formateur");

    case "editer:cours":
      return estAuteur || auMoins(visiteur, "administrateur");

    case "publier:cours":
    case "supprimer:cours":
      return auMoins(visiteur, "administrateur");

    // ── Administration ─────────────────────────────────────────────────────
    case "voir:statistiques":
      return auMoins(visiteur, "formateur");

    case "gerer:membres":
    case "gerer:seances":
      return auMoins(visiteur, "administrateur");
  }
}

/** Le nom du rôle tel qu'il s'affiche. */
export const NOM_ROLE: Record<Role, string> = {
  anonyme: "Visiteur",
  membre: "Membre",
  formateur: "Formateur",
  administrateur: "Administrateur",
};
