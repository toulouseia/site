import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 · Le fil conducteur : estimer le prix d'un logement.
//
// Réécrite en entier le 22 août 2026. La première version tenait en un seul
// pavé de quatre paragraphes, sans une formule ni une figure, et redisait trois
// fois que la structure du problème vaut au-delà de l'immobilier.
// Voir contenu/REGLES.md.
// ─────────────────────────────────────────────────────────────────────────────

export const S2_FIL: Bloc[] = [
  {
    id: "b-p2-1",
    type: "encart",
    ton: "note",
    titre: "Problème",
    texte:
      "Une agence immobilière a enregistré $N$ ventes passées. Pour chacune elle connaît la surface en mètres carrés, le nombre de pièces, et le prix auquel le bien s'est vendu. Elle veut une fonction qui, pour un **nouvel** appartement jamais vu, **estime** son prix.",
  },
  {
    id: "b-p2-3",
    type: "tableau",
    ancre: "structure",
    cleEnTete: true,
    entetes: ["Dans l'énoncé", "Ce que ça deviendra"],
    lignes: [
      ["la surface et le nombre de pièces", "l'entrée"],
      ["le prix auquel le bien s'est vendu", "le prix payé, celui qu'on cherche à retrouver"],
      ["les mille ventes déjà conclues", "le jeu de données"],
      ["la fonction qu'elle veut", "le modèle"],
      ["ce que vaut un mètre carré", "**rien** : la règle n'est fournie nulle part"],
    ],
  },
  {
    id: "b-p2-4",
    type: "image",
    ancre: "migration",
    src: "/cours/lecon1/l1-fig9-des-mots-aux-objets.svg",
    largeur: 1380,
    hauteur: 480,
    alt: "Un tableau de trois lignes. Chaque ligne part d'un morceau de la phrase de l'agence, écrit en brique, suivi d'une flèche, puis de l'objet mathématique et d'une glose. Première ligne : la surface et le nombre de pièces devient l'entrée x, couple de x indice un et x indice deux dans R deux, soit deux nombres par logement. Deuxième ligne : le prix de vente devient y dans R, un seul nombre à prédire. Troisième ligne : N ventes passées devient le jeu de données, l'ensemble des couples x exposant n, y exposant n, pour n allant de un à N, soit les N exemples du fichier. Sous un filet de brique, une dernière ligne : apprendre, c'est trouver f indice thêta telle que f indice thêta de x exposant n soit à peu près égal à y exposant n.",
    legende:
      "Trois morceaux de la phrase, trois objets, et rien de plus. Apprendre, c'est trouver $f_\theta$ telle que $f_\theta(x^{(i)}) \approx y^{(i)}$.",
  },
  {
    id: "b-p2-5",
    type: "titre",
    niveau: 2,
    texte: "Le mot qui commande tout",
  },
  {
    id: "b-p2-6",
    type: "texte",
    texte:
      "C'est le mot **« nouvel »**, et c'est celui qu'on lit le plus vite. On ne demande pas de retrouver le prix des $N$ ventes enregistrées : ces prix sont connus, un fichier les rendrait, et il les rendrait exactement justes.",
  },

  {
    id: "b-p2-8",
    type: "encart",
    ton: "attention",
    titre: "L'écart où travaille tout le chapitre",
    texte:
      "La seule quantité que nous saurons **mesurer** est l'erreur sur les ventes passées, et ce n'est pas la quantité qui nous **intéresse**. Garder cet écart en tête dès maintenant évite de croire, plus loin, qu'une erreur nulle sur les exemples est une bonne nouvelle.",
  },
  {
    id: "b-p2-9",
    type: "texte",
    texte:
      "Remplacez la surface et le nombre de pièces par les pixels d'une photographie et le prix par le nom de l'animal photographié : les entrées et les sorties changent de nature, la structure ne bouge pas.",
  },
];
