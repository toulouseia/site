import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 2, « Programmer des règles, ou apprendre
// à partir d'exemples ».
//
// RESSERRÉE le 8 septembre 2026 : 2 262 mots, sept fois la même idée. Le
// renversement est maintenant raconté UNE fois, comme une histoire.
//
//   la table des trois conditions      retirées. Toutes les quatre disaient la
//   la liste des trois apports         même chose que les deux figures qui
//   la note « ajuster automatiquement » restent : les deux flèches, et le
//   le tableau à quatre lignes         schéma des trois apports
//
//   la section « ce que la mesure      1 400 mots → 80. Le relevé complet reste
//   écarte », deux relevés console,    dans cours/lecon1/chiffres.py, qui le
//   un encart, une vérification        recalcule ; la page en garde le verdict
//
// LES DEUX FORMULES « règles + données → réponses » sont retirées : la figure
// des deux flèches les montre, et la règle 19 interdit de redire ce qu'une
// figure voisine donne à voir.
//
// LA FIGURE DES TROIS 3 MANQUE. La tâche CHIFFRES doit la produire ; elle
// n'existe pas encore, et cette page ne cite pas un fichier absent.
// ─────────────────────────────────────────────────────────────────────────────

export const S1_INTUITION: Bloc[] = [
  {
    id: "b-p1-1",
    type: "texte",
    texte:
      "Un développeur qui calcule une taxe lit la règle dans le code des impôts, il l'écrit, la machine l'applique, et la réponse tombe. Programmer, c'est cela : on donne les règles et les données, la machine rend les réponses.\n\nMaintenant, demandez à ce développeur le prix d'un appartement : il n'a plus de code des impôts, et le prix dépend de la surface, du quartier, de l'étage, de l'état du bâtiment, de ce qui s'est vendu dans la rue le mois dernier. Personne n'a écrit cette règle-là, et personne ne l'écrira.\n\nL'agence, elle, a mille ventes dans ses fichiers, et pour chacune ce qu'était le bien et ce qu'il a coûté.",
  },
  {
    id: "b-p1-10",
    type: "titre",
    niveau: 2,
    texte: "Le renversement",
  },
  {
    id: "b-p1-11",
    type: "texte",
    texte:
      "Dessinons trois boîtes : les règles, les données, les réponses. En programmant, les deux premières entrent et la troisième sort.\n\nMaintenant échangeons-les : les données et les réponses entrent, et ce qui sort, c'est la règle.",
  },
  {
    id: "b-p1-13",
    type: "image",
    ancre: "le-renversement",
    src: "/cours/lecon1/l1-fig15-le-renversement.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Deux schémas superposés. En haut, sous la mention « on programme », deux cadres nommés RÈGLES et DONNÉES ; une flèche part d'eux vers un troisième cadre, RÉPONSES. En bas, sous la mention « on apprend », les deux cadres d'entrée sont DONNÉES et RÉPONSES, et la flèche mène à un cadre de brique nommé RÈGLES APPRISES.",
    legende:
      "Les mêmes trois boîtes ; ce qui change, c'est laquelle on cherche.",
  },
  {
    id: "b-p1-14",
    type: "titre",
    niveau: 2,
    texte: "Ce que l'humain fournit encore",
  },
  {
    id: "b-p1-15",
    type: "texte",
    texte:
      "La machine ne devine pas ce qu'on cherche. Quelqu'un doit lui donner trois choses avant qu'elle commence : **la forme** des règles qu'elle a le droit d'essayer, **les exemples** sur lesquels travailler, et **la façon de compter** ce qu'une mauvaise réponse coûte.",
  },
  {
    id: "b-p1-17",
    type: "image",
    ancre: "apports",
    src: "/cours/lecon1/l1-fig3-apports.svg",
    largeur: 1380,
    hauteur: 430,
    alt: "Trois cadres alignés au-dessus d'un quatrième, plus large, marqué « la machine ». Le premier cadre porte cinq droites pâles de pentes différentes et une droite noire parmi elles : la famille de fonctions candidates. Le deuxième porte neuf points rangés en un nuage légèrement montant : les données. Le troisième porte une droite, un point au-dessus d'elle, un segment de brique qui les relie et une règle graduée posée le long de ce segment : la mesure d'erreur. Une flèche descend de chaque cadre vers la machine.",
    legende: "L'humain fournit les trois cadres du haut, et la machine ne fait que le bas.",
  },
  {
    id: "b-p1-20",
    type: "titre",
    niveau: 2,
    texte: "Deux 3 ne se ressemblent pas",
  },
  {
    id: "b-p1-21",
    type: "texte",
    texte:
      "« Personne ne sait écrire la règle » se mesure. Prenons les 6 131 images du chiffre 3 d'un fichier public de chiffres manuscrits, chacune en 28 sur 28 pixels, soit 784 pixels par image. Un pixel est **encré** quand il porte de l'encre, et blanc sinon.\n\nCherchons un pixel encré sur **toutes** ces images à la fois : il n'y en a **aucun**. Cherchons ceux qui ne sont encrés sur **aucune** : il y en a 242, et ce sont les bords, toujours vides.\n\nEntre les deux, rien de commun : deux 3 ne se ressemblent pas pixel à pixel.\n\nCe qui fait qu'un 3 est un 3 tient dans l'**arrangement** de l'encre, pas dans les pixels pris un à un.",
  },
];
