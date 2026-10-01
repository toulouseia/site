// ─────────────────────────────────────────────────────────────────────────────
// LES BLOCS DE CONTENU
//
// Une leçon n'est pas un gros bloc de HTML. C'est une suite de blocs typés,
// chacun avec sa forme propre. Trois raisons, et elles se vérifient toutes
// dans les six mois :
//
//   1. On ajoute un type de bloc sans toucher aux leçons existantes.
//   2. On peut chercher, compter, exporter, traduire, vérifier l'accessibilité
//      - toutes choses impossibles sur une chaîne de HTML.
//   3. Un bloc qui n'a pas de composant pour le rendre se voit tout de suite,
//      au lieu de rendre une balise inconnue en silence.
//
// L'union est discriminée par son champ de type. Le rendu passe par un registre
// exhaustif (composants/academy/blocs/registre.tsx) : ajouter un membre à cette
// union sans ajouter son composant est une erreur de compilation, pas une
// surprise en production.
//
// RÈGLE : aucun bloc ne porte de HTML brut. Le texte est du markdown restreint
// - gras, italique, code, lien, formule en ligne, rendu par notre propre
// lecteur, jamais par dangerouslySetInnerHTML.
// ─────────────────────────────────────────────────────────────────────────────

import type { Id } from "./commun";

export type IdBloc = Id<"bloc">;
export type IdAnimation = Id<"animation">;
export type IdRessource = Id<"ressource">;

/** Ce que tout bloc porte, quel que soit son type. */
type Socle = {
  id: IdBloc;
  /**
   * Une ancre stable pour lier vers ce bloc depuis ailleurs : #gradient-2d.
   * Facultative, seuls les blocs qu'on veut citer en ont une.
   */
  ancre?: string;
};

// ── Texte et structure ──────────────────────────────────────────────────────

/** Un intertitre dans la leçon. Deux niveaux, pas trois. */
export type BlocTitre = Socle & {
  type: "titre";
  niveau: 2 | 3;
  texte: string;
};

/** Un paragraphe, ou plusieurs. Markdown restreint. */
export type BlocTexte = Socle & {
  type: "texte";
  texte: string;
};

/** Une liste. Puces ou nombres, jamais imbriquée, c'est illisible. */
export type BlocListe = Socle & {
  type: "liste";
  ordonnee?: boolean;
  elements: string[];
};

/**
 * Un encart : ce qui sort du fil de lecture sans le rompre. Le ton décide de
 * l'étiquette et du filet, jamais d'une couleur de fond.
 */
export type BlocEncart = Socle & {
  type: "encart";
  ton: "note" | "attention" | "astuce" | "rappel";
  titre?: string;
  texte: string;
};

/** Une définition. L'objet le plus demandé d'un cours de maths. */
export type BlocDefinition = Socle & {
  type: "definition";
  terme: string;
  texte: string;
  /** La forme anglaise, quand elle est celle qu'on lira dans les papiers. */
  anglais?: string;
};

// ── Mathématiques ───────────────────────────────────────────────────────────

/**
 * Une formule. Le champ latex est la source, alt sa lecture à voix haute, un
 * lecteur d'écran ne lit pas du LaTeX, et une formule sans alt est une formule
 * inaccessible.
 */
export type BlocFormule = Socle & {
  type: "formule";
  latex: string;
  alt: string;
  /** Un numéro d'équation, quand la leçon y renvoie plus loin. */
  numero?: string;
  legende?: string;
};

// ── Images, vidéos, animations ──────────────────────────────────────────────

export type BlocImage = Socle & {
  type: "image";
  src: string;
  alt: string;
  largeur: number;
  hauteur: number;
  legende?: string;
};

/** Une vidéo quelconque : un enregistrement de séance, un extrait. */
export type BlocVideo = Socle & {
  type: "video";
  src: string;
  poster?: string;
  /** En secondes. */
  duree: number;
  alt: string;
  legende?: string;
  /** Piste WebVTT. */
  soustitres?: string;
};

/**
 * UNE ANIMATION MANIM.
 *
 * Le bloc ne porte PAS le fichier : il porte l'identifiant d'une entrée du
 * manifeste d'animations (domaine/animations.ts). Le manifeste est produit hors
 * ligne par le pipeline de rendu ; la webapp ne connaît ni Python, ni LaTeX, ni
 * ffmpeg. C'est la frontière, et elle ne bouge pas.
 */
export type BlocAnimation = Socle & {
  type: "animation";
  animationId: IdAnimation;
  legende?: string;
  /** Démarrer quand le bloc entre dans l'écran. Ignoré si mouvement réduit. */
  auto?: boolean;
  /** Repartir au début à la fin. Pour les boucles courtes, pas les longues. */
  boucle?: boolean;
};

// ── Code ────────────────────────────────────────────────────────────────────

export type BlocCode = Socle & {
  type: "code";
  langage: "python" | "bash" | "json" | "text" | "typescript";
  code: string;
  titre?: string;
  /** Les lignes à mettre en avant, numérotées à partir de 1. */
  surlignees?: number[];
};

/** Un carnet Jupyter : on ne l'exécute pas ici, on y envoie. */
export type BlocCarnet = Socle & {
  type: "carnet";
  titre: string;
  /** Le lien d'ouverture : Colab, nbviewer, un dépôt. */
  lien: string;
  hebergeur: string;
  resume?: string;
};

// ── Graphiques ──────────────────────────────────────────────────────────────

/**
 * Un graphique dessiné à partir de données, pas une image. Il reste net à
 * toute taille et sa description est obligatoire. Volontairement pauvre :
 * trois formes suffisent au programme, et un graphique qu'on peut tout dessiner
 * est un graphique qu'on dessine mal.
 */
export type BlocGraphique = Socle & {
  type: "graphique";
  forme: "courbe" | "nuage" | "barres";
  titre?: string;
  alt: string;
  legende?: string;
  axes: { x: string; y: string };
  series: {
    nom: string;
    points: { x: number; y: number }[];
    /** En pointillé : une série de référence, une prédiction. */
    tirets?: boolean;
  }[];
};

// ── Ce qu'on fait, pas ce qu'on lit ─────────────────────────────────────────

export type Question = {
  id: string;
  enonce: string;
  /** Une seule bonne réponse. Les réponses multiples viendront après. */
  options: { id: string; texte: string }[];
  bonneOptionId: string;
  /** Pourquoi c'est celle-là. S'affiche après la réponse, toujours. */
  explication: string;
};

export type BlocQuiz = Socle & {
  type: "quiz";
  titre?: string;
  questions: Question[];
};

export type BlocExercice = Socle & {
  type: "exercice";
  titre: string;
  enonce: string;
  /** Ce qu'on doit rendre ou obtenir. */
  attendu?: string;
  /** Des indices, révélés un par un. */
  indices?: string[];
  /** La correction, repliée. */
  correction?: string;
  minutes?: number;
};

/**
 * Une démonstration interactive : un composant enregistré côté client, choisi
 * par son nom. Le contenu ne connaît pas le code du composant, il le nomme,
 * comme le bloc animation nomme une entrée du manifeste.
 */
export type BlocDemo = Socle & {
  type: "demo";
  demo: string;
  titre: string;
  alt: string;
  legende?: string;
  /** Les réglages initiaux. Le composant les valide lui-même. */
  parametres?: Record<string, number | string | boolean>;
};

/** Un renvoi vers le fonds de ressources du club. */
export type BlocRessource = Socle & {
  type: "ressource";
  ressourceId: IdRessource;
  /** Pourquoi on l'envoie lire ça, ici et maintenant. */
  pourquoi?: string;
};

// ── Ce que la charte pedagogique reclame ────────────────────────────────────
//
// Ces cinq types viennent de la charte du parcours. Ils ne sont pas du confort
// de mise en page : chacun porte une exigence que le texte libre laisserait
// tomber au premier oubli.

/**
 * Un tableau. Le seul bloc generique du modele, et il le reste : la charte en
 * decrit quatre usages (dimensions, valeurs, verdict, objets) qui ne different
 * que par leurs en-tetes. Fabriquer quatre types serait quatre composants a
 * maintenir pour un seul dessin.
 */
export type BlocTableau = Socle & {
  type: "tableau";
  titre?: string;
  entetes: string[];
  lignes: string[][];
  legende?: string;
  /** La premiere colonne porte souvent une cle : elle se lit mieux en gras. */
  cleEnTete?: boolean;
};

/**
 * Une derivation, dans les sept temps de la charte. La structure EST la
 * discipline : un champ `etapes` vide ou un `resultat` absent se voient, alors
 * qu'une etape sautee dans un paragraphe ne se voit pas.
 */
export type BlocDerivation = Socle & {
  type: "derivation";
  titre: string;
  /** 1. Ce qu'on suppose, explicitement. */
  hypotheses?: string[];
  /** 2. L'expression exacte qu'on derive. */
  depart?: { latex: string; alt: string };
  /** 3. La chaine de dependances, en texte : « x -> z -> a -> l ». */
  chaine?: string;
  /** 4. Les proprietes utilisees, nommees. */
  proprietes?: string[];
  /** 5. Les etapes, aucune sautee, chacune avec sa justification. */
  etapes: {
    latex?: string;
    alt?: string;
    texte?: string;
    justification?: string;
  }[];
  /** 6. Le resultat, encadre. */
  resultat: { latex: string; alt: string };
  /** 7. Ce qu'il veut dire, puis ce qu'il ne dit pas. */
  interpretation: string;
  limites?: string[];
};

/**
 * Le repere de progression. Quatre champs obligatoires : sans eux, ce marqueur
 * redevient une transition decorative, ce que la charte interdit.
 */
export type BlocRepere = Socle & {
  type: "repere";
  cherche: string;
  pourquoi: string;
  ou: string;
  suite: string;
};

/**
 * Une verification de comprehension. Ce n'est pas un quiz : il n'y a pas de
 * bonne reponse a cliquer, il y a un calcul a faire. Le numero est CONTINU sur
 * tout le parcours, d'ou le champ explicite plutot qu'un compteur local.
 */
export type BlocVerification = Socle & {
  type: "verification";
  numero: number;
  enonce: string;
  /** Deux ou trois sous-questions au plus. */
  questions: string[];
};

/**
 * Une sortie de programme, telle quelle. Distincte du bloc code : celui-ci
 * montre ce qu'on ecrit, celui-la ce que la machine repond. La charte impose
 * de LIRE cette sortie ligne par ligne, d'ou le champ `lecture`.
 */
export type BlocSortie = Socle & {
  type: "sortie";
  titre?: string;
  texte: string;
  /** La lecture guidee, en puces. Vide = la sortie parle d'elle-meme. */
  lecture?: string[];
};

// ── L'union ─────────────────────────────────────────────────────────────────

export type Bloc =
  | BlocTitre
  | BlocTexte
  | BlocListe
  | BlocEncart
  | BlocDefinition
  | BlocFormule
  | BlocImage
  | BlocVideo
  | BlocAnimation
  | BlocCode
  | BlocCarnet
  | BlocGraphique
  | BlocQuiz
  | BlocExercice
  | BlocDemo
  | BlocRessource
  | BlocTableau
  | BlocDerivation
  | BlocRepere
  | BlocVerification
  | BlocSortie;

export type TypeBloc = Bloc["type"];

/** Le bloc d'un type donné, retrouvé depuis l'union. */
export type BlocDe<T extends TypeBloc> = Extract<Bloc, { type: T }>;

/**
 * Les types de blocs qui demandent une action de l'étudiant. Ils décident du
 * genre affiché d'une leçon quand celui-ci n'est pas déclaré, et serviront au
 * calcul de progression fine le jour où on la voudra bloc par bloc.
 */
export const BLOCS_A_FAIRE: readonly TypeBloc[] = [
  "quiz",
  "exercice",
  "verification",
];

export function estBlocAFaire(bloc: Bloc): boolean {
  return BLOCS_A_FAIRE.includes(bloc.type);
}

/**
 * Le texte brut d'un bloc, pour la recherche et le compte de mots. Un bloc
 * dont on ne sait pas extraire le texte ne se trouve pas : chaque nouveau type
 * doit passer ici.
 */
export function texteDuBloc(bloc: Bloc): string {
  switch (bloc.type) {
    case "titre":
    case "texte":
      return bloc.texte;
    case "liste":
      return bloc.elements.join(" ");
    case "encart":
      return [bloc.titre, bloc.texte].filter(Boolean).join(" ");
    case "definition":
      return [bloc.terme, bloc.anglais, bloc.texte].filter(Boolean).join(" ");
    case "formule":
      return [bloc.alt, bloc.legende].filter(Boolean).join(" ");
    case "image":
    case "video":
      return [bloc.alt, bloc.legende].filter(Boolean).join(" ");
    case "animation":
      return bloc.legende ?? "";
    case "code":
      return [bloc.titre, bloc.code].filter(Boolean).join(" ");
    case "carnet":
      return [bloc.titre, bloc.resume].filter(Boolean).join(" ");
    case "graphique":
      return [bloc.titre, bloc.alt, bloc.legende].filter(Boolean).join(" ");
    case "quiz":
      return [bloc.titre, ...bloc.questions.map((q) => q.enonce)]
        .filter(Boolean)
        .join(" ");
    case "exercice":
      return [bloc.titre, bloc.enonce, bloc.attendu].filter(Boolean).join(" ");
    case "demo":
      return [bloc.titre, bloc.alt, bloc.legende].filter(Boolean).join(" ");
    case "ressource":
      return bloc.pourquoi ?? "";
    case "tableau":
      return [bloc.titre, ...bloc.entetes, ...bloc.lignes.flat(), bloc.legende]
        .filter(Boolean)
        .join(" ");
    case "derivation":
      return [
        bloc.titre,
        ...(bloc.hypotheses ?? []),
        ...(bloc.proprietes ?? []),
        ...bloc.etapes.map((e) => [e.texte, e.justification].filter(Boolean).join(" ")),
        bloc.resultat.alt,
        bloc.interpretation,
        ...(bloc.limites ?? []),
      ]
        .filter(Boolean)
        .join(" ");
    case "repere":
      return [bloc.cherche, bloc.pourquoi, bloc.ou, bloc.suite].join(" ");
    case "verification":
      return [bloc.enonce, ...bloc.questions].join(" ");
    case "sortie":
      return [bloc.titre, ...(bloc.lecture ?? [])].filter(Boolean).join(" ");
  }
}
