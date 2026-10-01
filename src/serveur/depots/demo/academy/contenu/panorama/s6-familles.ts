import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 7, « Les trois familles ».
//
// RESSERRÉE le 8 septembre 2026 : 2 826 mots. Une figure, trois familles, un
// exemple chacune, trois lignes chacune.
//
//   l'étymologie de « superviser »        retirée
//   les cinq définitions en encadré       retirées : l'exemple les porte
//   la réduction de dimension             retirée
//   les deux pertes sans vérité           retirées : elles étaient nommées et
//   et leurs deux encarts                 jamais construites
//   l'encart « ce que ça coûte »          retiré
//   le tableau des trois familles         retiré : la figure le montre déjà,
//                                         et la règle 19 l'interdit
//   la vérification n° 5                  retirée : elle rejouait la figure
// ─────────────────────────────────────────────────────────────────────────────

export const S6_FAMILLES: Bloc[] = [
  {
    id: "b-p6-1",
    type: "texte",
    texte:
      "L'agence revient avec trois demandes : estimer un prix, ranger ses annonces en groupes qui se ressemblent sans dire lesquels, et décider chaque semaine s'il faut baisser le prix d'un bien qui ne part pas.\n\nCe sont trois familles différentes, et ce qui les sépare tient dans le fichier qu'on ouvre.",
  },
  {
    id: "b-p6-3",
    type: "image",
    ancre: "trois-jeux",
    src: "/cours/lecon1/l1-fig6-trois-jeux.svg",
    largeur: 1380,
    hauteur: 600,
    alt: "Trois panneaux portent chacun le début d'un fichier. Dans le premier, deux lignes de deux cases : à gauche 50 m², 2 pièces, et à droite 200 k€ ; à gauche 30 m², 1 pièce, et à droite 115 k€ ; une troisième ligne, grise, porte deux points de suspension verticaux. Dans le deuxième, les mêmes lignes et les mêmes cases de gauche, mais toutes les cases de droite sont vides et leur contour est gris pâle. Dans le troisième, trois lignes de trois cases portent chacune une situation, la décision prise, et ce qu'elle a rapporté ; la récompense d'une ligne porte le numéro de la ligne suivante, parce qu'elle n'arrive qu'après ; une quatrième ligne, grise et vide, attend en dessous, et un trait de brique part de la case d'action de la troisième ligne et vient entrer dans la première case de cette ligne vide.",
    legende:
      "Ce qui sépare les trois n'est pas la méthode employée : c'est ce que le fichier contient, et le troisième n'en a pas.",
  },
  {
    id: "b-p6-4",
    type: "titre",
    niveau: 2,
    texte: "Supervisé : la réponse est dans le fichier",
  },
  {
    id: "b-p6-5",
    type: "texte",
    texte:
      "Le fichier porte deux colonnes, ce qu'était le bien et ce qu'il a coûté, si bien qu'on connaît la réponse pour chaque ligne.\n\nOn cherche une fonction qui la retrouve, puis qui la donne pour une ligne nouvelle, et c'est le cadre du fil conducteur depuis le début.",
  },
  {
    id: "b-p6-10",
    type: "titre",
    niveau: 2,
    texte: "Non supervisé : la colonne des réponses a disparu",
  },
  {
    id: "b-p6-11",
    type: "texte",
    texte:
      "L'agence donne ses mille annonces sans aucun prix, et demande qu'on les range en trois groupes sans dire lesquels.\n\nIl n'y a plus rien à soustraire : sans réponse, la note de la page 5 ne s'écrit même pas. Ce qu'on cherche n'est plus une réponse, c'est une **structure**.",
  },
  {
    id: "b-p6-19",
    type: "image",
    ancre: "partitionnement",
    src: "/cours/lecon1/l1-fig18-le-partitionnement.svg",
    largeur: 1380,
    hauteur: 540,
    alt: "Deux cadres côte à côte portent les mêmes cinquante-quatre points. À gauche, tous les points sont gris et sans étiquette, et trois carrés, deux à l'encre et un blanc cerclé d'encre, sont posés en bas à gauche, loin d'eux. À droite, après quatre tours d'un procédé qui rattache chaque point au carré le plus proche puis replace chaque carré au milieu de ses points, chaque point a pris l'apparence du sien, points d'encre, points de brique ou petits anneaux, et les trois carrés sont au milieu de leur groupe. Sous les cadres, une ligne dit qu'à gauche il n'y a aucune étiquette, rien que des positions, et qu'à droite trois groupes de dix-huit points se sont formés sans que personne ne leur ait dit lesquels.",
    legende:
      "Personne n'a donné d'étiquette ; les groupes sortent des positions.",
  },
  {
    id: "b-p6-28",
    type: "titre",
    niveau: 2,
    texte: "Par renforcement : il n'y a plus de fichier",
  },
  {
    id: "b-p6-29",
    type: "texte",
    texte:
      "Chaque semaine, l'agence baisse le prix d'un bien invendu, ou ne le baisse pas. Des semaines plus tard, le bien se vend, ou non, et personne ne dira jamais quelle décision était la bonne.\n\nCe qu'on observe ensuite dépend de ce qu'on a décidé avant : il n'y a plus de fichier figé, il y a quelqu'un qui décide et un monde qui répond.",
  },
];
