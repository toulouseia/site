// ─────────────────────────────────────────────────────────────────────────────
// Le vocabulaire commun. Rien ici ne connaît React, ni Next, ni une base de
// données : ce sont des formes, et elles ne changeront pas quand les données
// cesseront d'être inventées.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Un identifiant marqué. `IdCours` et `IdLecon` sont tous deux des chaînes,
 * mais le compilateur refuse de les confondre : c'est gratuit à l'exécution et
 * ça arrête la moitié des erreurs de câblage avant qu'elles n'arrivent.
 */
export type Id<Sujet extends string> = string & { readonly __sujet?: Sujet };

/**
 * Le cycle de vie d'un contenu rédigé par un membre. Quatre états, et le
 * troisième mérite son existence :
 *
 *   brouillon  en cours de rédaction, son auteur seul le voit
 *   annonce    le plan est arrêté, le contenu reste à écrire, tout le monde
 *              le voit dans le catalogue, personne ne peut l'ouvrir
 *   publie     ouvrable, et compte dans l'avancement
 *   archive    retiré du catalogue, conservé pour ceux qui l'avaient commencé
 *
 * « Annoncé » est ce qui permet d'afficher un programme entier sans mentir sur
 * ce qui est prêt. Sans lui, il ne reste que deux mauvaises options : cacher le
 * programme, ou publier des pages vides.
 */
export type Statut = "brouillon" | "annonce" | "publie" | "archive";

/** Les statuts qu'un visiteur quelconque a le droit de voir dans une liste. */
export const STATUTS_VISIBLES: readonly Statut[] = ["annonce", "publie"];

/** Trois niveaux, les mêmes partout dans l'application. */
export type Niveau = "depart" | "milieu" | "fond";

/** Une date ISO 8601, jour seul : `2026-09-17`. */
export type DateISO = string;

/**
 * Ce que renvoie une liste paginée. Aucune liste n'est paginée aujourd'hui,
 * la forme existe pour que le jour où l'une le devient, la signature du dépôt
 * ne change pas et les écrans non plus.
 */
export type Page<T> = {
  elements: T[];
  total: number;
  /** Curseur opaque. `null` quand il n'y a plus rien après. */
  suite: string | null;
};

export function pageEntiere<T>(elements: T[]): Page<T> {
  return { elements, total: elements.length, suite: null };
}

/**
 * Le résultat d'une écriture. Les services ne lancent pas d'exception pour un
 * refus attendu, un refus de droits ou une validation ratée sont des réponses,
 * pas des pannes.
 */
export type Resultat<T> =
  | { ok: true; valeur: T }
  | { ok: false; motif: MotifEchec; message: string };

export type MotifEchec =
  | "introuvable"
  | "interdit"
  | "invalide"
  | "conflit"
  | "indisponible";

export function reussite<T>(valeur: T): Resultat<T> {
  return { ok: true, valeur };
}

export function echec<T = never>(
  motif: MotifEchec,
  message: string,
): Resultat<T> {
  return { ok: false, motif, message };
}

/** Le code HTTP qui correspond à un refus. Sert aux routes, à un seul endroit. */
export const CODE_HTTP: Record<MotifEchec, number> = {
  introuvable: 404,
  interdit: 403,
  invalide: 422,
  conflit: 409,
  indisponible: 503,
};
