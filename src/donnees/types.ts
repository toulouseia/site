// Le vocabulaire de l'application. Rien ici ne connaît React : ce sont les
// formes que le serveur renverra un jour, à l'identique.

export type Pole = "Agentic" | "ModIA" | "Embedded" | "Hackathon";

/** L'avancement, en quatre crans. La jauge du signe se remplit d'autant. */
export type Etat = "idee" | "chantier" | "essai" | "service";

export type Categorie = "open" | "business";

/**
 * Les moyens de se parler, et ils sont tous en dehors de l'application.
 * Chacun donne ceux qui l'arrangent : l'application affiche, elle ne
 * transporte aucun message et n'en garde aucune copie.
 */
export type Canal =
  | "discord"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "github"
  | "mail";

export type Contact = { canal: Canal; valeur: string };

export type Personne = {
  id: string;
  /** Le nom sous lequel la personne a accepté de paraître. */
  nom: string;
  /**
   * D'où elle vient, en texte libre et facultatif : « N7 · SN », « INSA »,
   * « en poste ». La communauté n'est plus celle d'une seule école, et un
   * champ à choix fermé ne saurait plus qui admettre.
   */
  origine?: string;
  /** Où l'on peut lui écrire. Deux ou trois, jamais une liste à rallonge. */
  contacts: Contact[];
};

/**
 * Un membre participant d'un projet, tel que la fiche le montre. Une personne
 * qui apparaît, sans aucun droit d'édition — l'écriture reste au porteur et au
 * bureau. Volontairement plus maigre que `Personne` : ni contacts ni adresse,
 * seulement de quoi nommer et situer. `github` est le pseudo public, jamais
 * l'identifiant de compte.
 */
export type Membre = {
  id: string;
  nom: string;
  /** D'où vient le membre, en texte libre et facultatif — comme `Personne`. */
  origine?: string;
  /** Le pseudo GitHub public, s'il en a un. Ni `github_id`, ni adresse. */
  github?: string;
};

/**
 * Ce que le porteur dit de l'accueil — et c'est tout ce qu'il en dit.
 *
 * Pas de nombre de places, pas de postes à pourvoir, pas de compétences
 * exigées : un club n'est pas un employeur, et une place annoncée puis
 * refusée à celui qui se présente crée exactement la situation qu'on veut
 * éviter. Deux mots suffisent : « ouvert » veut dire prêt à échanger sur le
 * projet — ce qui peut aller jusqu'à accueillir quelqu'un, sans le promettre
 * — et « complet » veut dire que le porteur ne cherche personne en ce
 * moment. Ne rien dire reste possible : le champ est facultatif.
 */
export type Accueil = "ouvert" | "complet";

export type Projet = {
  id: string;
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
  porteurId: string;
  accueil?: Accueil;
  /** Open : le dépôt public, obligatoire. Business : absent. */
  depot?: string;
  /** Business : d'où viendrait l'argent. Open : absent. */
  modele?: string;
  outils: string[];
  /**
   * L'URL de l'image d'illustration, servie par le Worker — jamais la clé R2
   * brute. Facultative : la plupart des projets retombent sur le signe.
   */
  image?: string;
  /** Le texte de rechange de l'image, pour qui ne la voit pas. Défaut : le nom. */
  imageAlt?: string;
  /**
   * Le point de l'image à garder quand elle est recadrée pour emplir sa case,
   * en `object-position` CSS (« 52% 32% »). Défaut : le centre.
   */
  imageCadre?: string;
  debut: string; // ISO
  maj: string; // ISO
};

export type FormatRessource =
  | "cours"
  | "notes"
  | "video"
  | "atelier"
  | "papier"
  | "jeu";

export type Niveau = "depart" | "milieu" | "fond";

export type Ressource = {
  id: string;
  titre: string;
  /** Ce qu'on en retire, en une ligne. */
  gain: string;
  format: FormatRessource;
  niveau: Niveau;
  minutes: number;
  source: string;
  lien?: string;
  /** Fabriqué par le club. */
  maison?: boolean;
};

export type Seance = {
  id: string;
  titre: string;
  date: string; // ISO
  minutes: number;
  format: "atelier" | "amphi" | "permanence";
  places: number;
  restant: number;
};

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
  date: string; // ISO
  /** L'entrée mise en une. */
  uneId: string;
  entrees: Entree[];
  /**
   * Un numéro en cours d'écriture. Il se voit avec `npm run dev`, jamais sur
   * le site en ligne : `listerNumeros` l'écarte de la construction. On retire
   * la ligne quand le numéro est relu.
   */
  brouillon?: boolean;
};

/** Le dessin de la grande case. Un outil, une marque, pas de liste ouverte. */
export type MarqueOutil = "moodle" | "annales";

export type Outil = {
  id: string;
  nom: string;
  resume: string;
  marque: MarqueOutil;
  /** Les faits de l'outil : étiquette + valeur, jamais un paragraphe. */
  fiches: { etiquette: string; valeur: string }[];
  /** Ce que fait le bouton principal. */
  commande: string;
  /** Le projet du club qui le fabrique, s'il existe. */
  projetSlug?: string;
};

/** Un sujet d'examen passé, avec ou sans son corrigé. */
export type Annale = {
  id: string;
  matiere: string;
  annee: number;
  /** L'épreuve : examen, rattrapage, partiel. */
  epreuve: string;
  /** Les notions qu'on y travaille — c'est par là qu'on cherche. */
  notions: string[];
  corrige: boolean;
  pages: number;
};

export type ReponseAgent = {
  question: string;
  /** Réponse préenregistrée : l'application n'appelle rien. */
  reponse: string;
  sources: { titre: string; detail: string }[];
};
