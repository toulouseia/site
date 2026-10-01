// ─────────────────────────────────────────────────────────────────────────────
// Le vocabulaire des trois autres écrans : les projets, la veille, les outils,
// et le fonds de ressources sur lequel l'Academy s'appuie.
//
// Ces types viennent de `donnees/types.ts`, déplacés ici sans être retouchés :
// le domaine est un seul endroit, pas deux.
// ─────────────────────────────────────────────────────────────────────────────

import type { DateISO, Id, Niveau } from "./commun";

export type IdProjet = Id<"projet">;
export type IdPersonne = Id<"personne">;
export type IdRessource = Id<"ressource">;
export type IdSeance = Id<"seance">;

export type Pole = "Agentic" | "ModIA" | "Embedded" | "Hackathon";

/** L'avancement d'un projet, en quatre crans. La jauge du signe s'en remplit. */
export type Etat = "idee" | "chantier" | "essai" | "service";

export type Categorie = "open" | "business";

export type Personne = {
  id: IdPersonne;
  /** Prénom + initiale : les porteurs de démonstration sont fictifs. */
  nom: string;
  promo: "1A" | "2A" | "3A";
  filiere: "SN" | "3EA" | "HMF" | "ModIA";
};

export type Place = {
  role: string;
  competences: string[];
  /** Ce qu'il y a à faire, en une ligne sans verbe conjugué. */
  tache: string;
};

export type Jalon = {
  date: DateISO;
  titre: string;
  fait: boolean;
};

export type Projet = {
  id: IdProjet;
  slug: string;
  nom: string;
  /** Une ligne, dans la liste. Groupe nominal, jamais une phrase. */
  resume: string;
  /** Deux phrases au plus, dans la fiche seulement. */
  presentation: string;
  etat: Etat;
  /** Un projet arrêté garde son état mais se signale. */
  enPause?: boolean;
  categorie: Categorie;
  pole: Pole;
  porteurId: IdPersonne;
  places: Place[];
  /** Open : le dépôt public, obligatoire. Business : absent. */
  depot?: string;
  /** Business : d'où viendrait l'argent. Open : absent. */
  modele?: string;
  outils: string[];
  jalons: Jalon[];
  debut: DateISO;
  maj: DateISO;
};

/** Un projet accompagné de son porteur, la forme que consomment les écrans. */
export type ProjetComplet = Projet & { porteur: Personne };

// ── Le fonds de ressources ──────────────────────────────────────────────────

export type FormatRessource =
  | "cours"
  | "notes"
  | "video"
  | "atelier"
  | "papier"
  | "jeu";

export type Ressource = {
  id: IdRessource;
  titre: string;
  /** Ce qu'on en retire, en une ligne. */
  gain: string;
  format: FormatRessource;
  niveau: Niveau;
  minutes: number;
  source: string;
  lien?: string;
  /** Fabriquée par le club. */
  maison?: boolean;
};

export type Seance = {
  id: IdSeance;
  titre: string;
  date: DateISO;
  minutes: number;
  format: "atelier" | "amphi" | "permanence";
  places: number;
  restant: number;
};

// ── La veille ───────────────────────────────────────────────────────────────

export type TypeEntree = "modele" | "outil" | "papier" | "usage" | "chiffre";

export type Entree = {
  id: string;
  type: TypeEntree;
  titre: string;
  /** La valeur brute : un chiffre, une capacité, un nom. */
  valeur: string;
  /** Pourquoi c'est dans le numéro. Une ligne. */
  pourquoi: string;
  source: string;
  lien?: string;
};

export type Numero = {
  id: string;
  numero: number;
  date: DateISO;
  /** L'entrée mise en une. */
  uneId: string;
  entrees: Entree[];
};

// ── La boîte à outils ───────────────────────────────────────────────────────

export type EtatOutil = "service" | "essai" | "envisage";

export type Outil = {
  id: string;
  nom: string;
  resume: string;
  etat: EtatOutil;
  /** Les faits de l'outil : étiquette + valeur, jamais un paragraphe. */
  fiches: { etiquette: string; valeur: string }[];
  /** Ce que fait le bouton principal. */
  commande: string;
  /** Le projet du club qui le fabrique, s'il existe. */
  projetSlug?: string;
};

export type ReponseAgent = {
  question: string;
  /** Réponse préenregistrée : l'application n'appelle rien. */
  reponse: string;
  sources: { titre: string; detail: string }[];
};

/** Les mesures du tableau : ce que le volet affiche quand rien n'est ouvert. */
export type MesuresProjets = {
  total: number;
  cherchent: number;
  places: number;
  parEtat: Record<string, number>;
  parPole: { pole: string; total: number; places: number }[];
  parCategorie: { open: number; business: number };
  dernierDepot: DateISO;
  recents: { slug: string; nom: string; maj: DateISO; places: number }[];
};

// Le niveau est commun a tout le domaine ; il se lit aussi depuis ici, ou
// les ecrans du club vont chercher leur vocabulaire.
export type { Niveau } from "./commun";
