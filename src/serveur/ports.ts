// ─────────────────────────────────────────────────────────────────────────────
// LES PORTS, ce que l'application demande à ses données, sans dire à qui.
//
// Un port est une interface. Rien d'autre. Chaque port a aujourd'hui une seule
// implémentation, en mémoire (`depots/demo/`), et en aura une seconde le jour
// où une base existera (`depots/prisma/`). Les services ne connaissent que les
// ports ; les écrans ne connaissent que les services.
//
//        écrans  →  services  →  PORTS  →  dépôts  →  données
//                                  ↑
//                        la seule chose qui change
//
// Trois règles tenues ici :
//
//   1. TOUT EST ASYNCHRONE, même ce qui n'en a pas besoin. Le jour où le corps
//      d'une méthode devient une requête SQL, aucune signature ne bouge.
//   2. AUCUN PORT NE RENVOIE DE HTML, DE JSX, NI DE PROMESSE DE REACT. Ce sont
//      des données, elles doivent pouvoir être servies par une route HTTP telles
//      quelles.
//   3. LES FILTRES SONT DES OBJETS, pas des listes d'arguments. Ajouter un
//      critère n'est alors jamais une rupture.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Auteur,
  Chapitre,
  Cours,
  IdCours,
  IdLecon,
  IdParcours,
  Lecon,
  Parcours,
} from "./domaine/academy";
import type { EtatAnimation } from "./domaine/animations";
import type { Bloc } from "./domaine/blocs";
import type {
  Numero,
  Outil,
  Personne,
  Projet,
  ReponseAgent,
  Ressource,
  Seance,
} from "./domaine/club";
import type { Niveau, Statut } from "./domaine/commun";
import type { Progression } from "./domaine/progression";
import type { IdVisiteur, Visiteur } from "./domaine/visiteur";

// ── Le catalogue de l'Academy ───────────────────────────────────────────────

export type FiltreCatalogue = {
  /** Ne renvoyer que ces statuts. Par défaut : les publiés seulement. */
  statuts?: readonly Statut[];
  parcoursId?: IdParcours;
  niveau?: Niveau;
  /** Texte libre, déjà normalisé par le service. */
  recherche?: string;
};

/**
 * Le catalogue. Il ne connaît ni le visiteur, ni ses droits, ni sa
 * progression : c'est le service qui filtre selon les droits, pas le dépôt.
 * Un dépôt qui décide des droits est un dépôt qu'on ne peut plus tester.
 */
export interface DepotCatalogue {
  listerParcours(filtre?: FiltreCatalogue): Promise<Parcours[]>;
  obtenirParcours(slug: string): Promise<Parcours | null>;
  obtenirParcoursParId(id: IdParcours): Promise<Parcours | null>;

  listerCours(filtre?: FiltreCatalogue): Promise<Cours[]>;
  obtenirCours(slug: string): Promise<Cours | null>;
  obtenirCoursParId(id: IdCours): Promise<Cours | null>;

  /** Les chapitres d'un cours, dans l'ordre. */
  listerChapitres(coursId: IdCours): Promise<Chapitre[]>;

  /**
   * Les leçons d'un cours, dans l'ordre, SANS leurs blocs. C'est la requête la
   * plus fréquente de l'application, sommaire, avancement, navigation.
   */
  listerLecons(coursId: IdCours): Promise<Lecon[]>;

  obtenirLecon(coursSlug: string, leconSlug: string): Promise<Lecon | null>;

  /** Les blocs d'une leçon. Séparés exprès : ils ne circulent qu'à l'ouverture. */
  obtenirBlocs(leconId: IdLecon): Promise<Bloc[]>;

  /**
   * Pour les adresses statiques : toutes les paires cours/leçon dont
   * l'adresse doit exister, donc aussi celles qui sont seulement annoncées.
   */
  listerChemins(): Promise<{ coursSlug: string; leconSlug: string }[]>;

  listerAuteurs(ids: readonly string[]): Promise<Auteur[]>;
}

// ── La progression ──────────────────────────────────────────────────────────

/**
 * Le dépôt de progression. Aujourd'hui : le navigateur, via `depots/demo`.
 * Demain : une table Postgres indexée sur (visiteurId, leconId).
 *
 * `remplacer` prend l'objet entier plutôt qu'un delta. C'est volontaire :
 * l'objet est petit, la fusion partielle est une source de bugs, et une
 * écriture complète est idempotente, on peut la rejouer sans dommage.
 */
export interface DepotProgression {
  obtenir(visiteurId: IdVisiteur): Promise<Progression>;
  remplacer(progression: Progression): Promise<void>;
}

// ── Les comptes ─────────────────────────────────────────────────────────────

/**
 * Les comptes. Vide en pratique aujourd'hui : le port existe pour que
 * l'authentification, quand elle arrivera, ait déjà sa place, et pour que
 * personne n'aille câbler NextAuth directement dans un écran.
 */
export interface DepotComptes {
  obtenir(id: IdVisiteur): Promise<Visiteur | null>;
  /** Le membre du club derrière le compte, quand il est rattaché. */
  obtenirPersonne(id: IdVisiteur): Promise<Personne | null>;
}

// ── Les animations ──────────────────────────────────────────────────────────

/**
 * Le manifeste d'animations produit par le pipeline Manim. Un port à lui seul
 * parce qu'il changera de source : fichier local aujourd'hui, bucket demain,
 * sans que la leçon qui affiche l'animation en sache rien.
 */
export interface DepotAnimations {
  obtenir(id: string): Promise<EtatAnimation | null>;
  lister(): Promise<EtatAnimation[]>;
}

// ── Le reste du club ────────────────────────────────────────────────────────

export interface DepotProjets {
  lister(): Promise<Projet[]>;
  obtenir(slug: string): Promise<Projet | null>;
  listerSlugs(): Promise<string[]>;
  listerPersonnes(): Promise<Personne[]>;
}

export interface DepotRessources {
  lister(): Promise<Ressource[]>;
  obtenir(id: string): Promise<Ressource | null>;
  listerSeances(): Promise<Seance[]>;
}

export interface DepotVeille {
  lister(): Promise<Numero[]>;
}

export interface DepotOutils {
  lister(): Promise<Outil[]>;
  listerReponsesAgent(): Promise<ReponseAgent[]>;
}

// ── L'assemblage ────────────────────────────────────────────────────────────

/**
 * Tous les dépôts d'un coup. C'est ce que la racine de composition fabrique et
 * ce que les services reçoivent, jamais un dépôt isolé importé au hasard.
 */
export type Depots = {
  catalogue: DepotCatalogue;
  progression: DepotProgression;
  comptes: DepotComptes;
  animations: DepotAnimations;
  projets: DepotProjets;
  ressources: DepotRessources;
  veille: DepotVeille;
  outils: DepotOutils;
};
