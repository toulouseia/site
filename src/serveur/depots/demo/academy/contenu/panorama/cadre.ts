import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 1, « Le cadre du cours ».
//
// RÉÉCRITE EN ENTIER le 8 septembre 2026. Elle faisait 910 mots et ouvrait sur
// son propre programme ; elle en fait 180 et ouvre sur une question que
// l'élève se pose déjà. Ce qui a sauté, et où c'est parti :
//
//   la liste des prérequis          retirée. Un élève de terminale a ce qu'il
//   la figure l1-fig1-prerequis     faut ; le dire d'avance l'inquiète pour rien
//
//   la liste des sept objectifs     retirée. Elle annonçait le chapitre au lieu
//                                   de le commencer
//
//   le plan en dix lignes           trois lignes, les cinq idées du chapitre
//   la figure l1-fig2-carte         retirée de cette page
//
//   le tableau des cinq dettes      retiré. Chaque dette est désormais nommée
//                                   là où elle se contracte, en une phrase
//
//   l'encart sur l'ordre de l'arc   retiré : la page 1 du chapitre 2 le porte
//                                   déjà, mot pour mot, là où il s'applique
//
// L'IMAGE EST CELLE DE LA PAGE 1 DU CHAPITRE 2. C'est voulu : l'élève voit
// tout de suite l'objet que le parcours démonte, et il le reverra à l'ouverture
// du chapitre suivant, identique.
// ─────────────────────────────────────────────────────────────────────────────

export const CADRE: Bloc[] = [
  {
    id: "b-p0-1",
    type: "texte",
    texte:
      "Un agent immobilier annonce le prix d'un appartement en quelques secondes, et si vous lui demandez sa formule, il n'en a pas : il a vu mille ventes, et il sait.\n\nUne machine peut-elle en faire autant, et si elle y arrive, qu'a-t-elle appris exactement ?",
  },
  {
    id: "b-p0-2",
    type: "image",
    ancre: "le-reseau-entier",
    src: "/cours/lecon2/l2-fig20-le-reseau-entier.svg",
    largeur: 1380,
    hauteur: 700,
    alt: "À gauche, une grille carrée de vingt-huit sur vingt-huit pixels portant un sept manuscrit en encre sombre. Une flèche mène à trois colonnes de ronds vides, alignées de gauche à droite. La première montre quatre ronds séparés par trois points de suspension, et porte dessous le nombre sept cent quatre-vingt-quatre et la mention une par pixel. La deuxième est bâtie de même et porte dessous cent vingt-huit, sans autre mention. La troisième montre ses dix ronds, un par chiffre possible, de zéro en haut à neuf en bas, et porte dessous le nombre dix. Chaque rond d'une colonne est relié par un filet gris pâle à tous les ronds de la colonne suivante. Le huitième rond de la dernière colonne est plein, en brique ; une flèche en part et mène à un grand chiffre sept en brique, sous lequel se lit le chiffre lu.",
    legende: "L'intérieur de la machine : une image entre à gauche, un chiffre sort à droite.",
  },
  {
    id: "b-p0-3",
    type: "texte",
    texte:
      "Ce dessin ne s'explique pas tout seul, et c'est normal : il n'y a rien à y comprendre aujourd'hui. Ce chapitre donne les mots pour le lire ; le suivant le démonte, trait par trait.",
  },
  {
    id: "b-p0-4",
    type: "liste",
    ancre: "plan",
    ordonnee: true,
    elements: [
      "Personne ne sait écrire la règle. On la fait apprendre à partir d'exemples.",
      "On chiffre ce qu'une mauvaise réponse coûte, puis on cherche la machine qui se trompe le moins.",
      "On compte les nombres qu'il a fallu choisir, et on range les problèmes en familles.",
    ],
  },
];
