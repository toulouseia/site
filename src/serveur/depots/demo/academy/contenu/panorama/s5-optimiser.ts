import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 6, « Le paysage des scores, et ce que la
// note ne dit pas ».
//
// RESSERRÉE le 8 septembre 2026 : 3 428 mots, dont tout l'appareil du gradient.
// La page porte deux idées : chaque réglage a une note, et une note parfaite ne
// prouve rien.
//
// PARTIS, PARCE QU'ILS SONT DÉJÀ AU CHAPITRE 3 :
//
//   argmin et min, et leur encart de confusion
//   les deux voies, et leur tableau
//   la dérivée partielle et le gradient, leurs définitions et leurs formules
//   la règle de mise à jour et ses quatre puces
//   le lot et l'époque
//
// PARTIS AU CHAPITRE ÉVALUATION :
//
//   population et échantillon
//   les trois sous-ensembles, et le tableau des trois rôles
//
// L'ANIMATION le-mot-nouvel VIENT DE LA PAGE 3. Elle montre le fichier qui ne
// répond pas, puis la courbe qui répond : c'est cette page-ci son sujet, et une
// animation n'appartient qu'à une page.
// ─────────────────────────────────────────────────────────────────────────────

export const S5_OPTIMISER: Bloc[] = [
  {
    id: "b-p5-1",
    type: "texte",
    texte:
      "$\\boldsymbol{\\theta}_B$ obtient 56,25 : existe-t-il mieux ? Changeons un seul réglage, le biais $b$, et regardons la note que prend chaque valeur.",
  },
  {
    id: "b-p5-1f",
    type: "image",
    ancre: "le-paysage-des-scores",
    src: "/cours/lecon1/l1-fig19-le-paysage-des-scores.svg",
    largeur: 1380,
    hauteur: 540,
    alt: "Une courbe en cuvette. L'axe horizontal porte le biais b, de cinq à quarante ; l'axe vertical porte la note du réglage. La courbe descend d'une altitude élevée à gauche jusqu'à un fond, puis remonte à la même altitude à droite. Un pointillé gris court à hauteur du fond sur toute la largeur et porte l'étiquette « le fond de la cuvette ». À mi-pente, un point à l'encre marque thêta A ; au fond, un point de brique marque thêta B. À droite, un panneau donne les trois notes : au départ du balayage, b égale cinq, trois cent soixante-deux virgule cinq ; thêta A, b égale vingt, soixante-deux virgule cinq ; thêta B, b égale vingt-deux virgule cinq, cinquante-six virgule vingt-cinq. Sous un filet, deux lignes : apprendre, c'est chercher le fond de cette cuvette, et comment on descend est le chapitre 3.",
    legende:
      "Chaque réglage a sa note ; il y en a une par point de cette courbe.",
  },
  {
    id: "b-p5-13",
    type: "texte",
    texte:
      "Apprendre, c'est chercher le fond de cette cuvette. Comment on y descend quand on ne voit pas la courbe est le sujet du chapitre 3.",
  },
  {
    id: "b-p5-36",
    type: "titre",
    niveau: 2,
    texte: "Une note parfaite qui ne sert à rien",
  },
  {
    id: "b-p5-38",
    type: "texte",
    texte:
      "Voici un modèle qui obtient 0. Il range les mille ventes dans une table, et pour chaque appartement du fichier il ressort le prix écrit à côté. Sur le jeu, il ne se trompe jamais.",
  },
  {
    id: "b-p5-39",
    type: "formule",
    ancre: "perte-nulle",
    latex:
      "\\frac{1}{N}\\sum_{n=1}^{N}\\big(T(\\mathbf{x}^{(n)}) - y^{(n)}\\big)^{2} = \\frac{1}{N}\\sum_{n=1}^{N} 0^{2} = 0",
    alt: "La moyenne, pour n allant de un à N, du carré de l'écart entre ce que la table répond et ce qui a été observé, est une moyenne de N termes tous nuls, et vaut donc zéro.",
    legende:
      "Zéro, exactement, sans arrondi et sans le moindre calcul. La table atteint du premier coup l'objectif qu'on venait de poser.",
  },
  {
    id: "b-p5-40",
    type: "texte",
    texte:
      "Maintenant, un appartement qui n'est pas dans la table : elle n'a pas de ligne pour lui, et elle n'a rien à répondre.\n\nOr c'est exactement ce qu'on lui demande, car on ne cherche pas à retrouver des prix déjà connus, on cherche à estimer un bien **jamais vu**.",
  },
  {
    id: "b-p5-41",
    type: "animation",
    ancre: "nouvel",
    animationId: "le-mot-nouvel",
    legende:
      "Le fichier répond juste sur les mille ventes passées, puis n'a rien à dire pour une vente qu'il n'a jamais vue.",
  },
  {
    id: "b-p5-42",
    type: "encart",
    ton: "attention",
    titre: "Ce que la table prouve, et ce qu'elle ne prouve pas",
    texte:
      "Elle ne prouve pas que la note soit une mauvaise mesure ; elle prouve qu'une note **mesurée sur les exemples déjà vus** ne dit rien de ce qui arrivera sur les autres, et qu'il faut donc juger un modèle sur d'autres exemples que ceux qu'on lui a montrés.\n\nEt avant même de savoir sur quoi le juger, il reste à savoir de quoi on parle : estimer un prix, ranger des annonces et décider d'une baisse ne demandent pas la même chose du fichier. C'est la page suivante.",
  },
];
