import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 8, « Régression ou classification ».
//
// RESSERRÉE le 8 septembre 2026 : 3 718 mots, la page la plus lourde du
// chapitre. Il en reste l'axe qui glisse ou qui saute, une phrase par cas, et
// le piège en trois lignes.
//
//   la dérivation de 904 mots sur les     retirée. La figure des deux codages
//   deux modèles qui se trompent          porte le même verdict, et se voit
//   les trois définitions en encadré      retirées : le cas les porte
//   la sortie dans l'intervalle, le       retirées : produire un nombre entre 0
//   seuil, l'argmax et leurs formules     et 1 est le sujet du chapitre 2
//   l'encart sur l'étiquette              retiré : le piège vaut pour un ordre
//   énergétique                           comme pour un désordre
//   le récapitulatif et sa vérification   retirés : le formulaire les porte
// ─────────────────────────────────────────────────────────────────────────────

export const S7_REGRESSION: Bloc[] = [
  {
    id: "b-p7-1",
    type: "texte",
    texte:
      "Le prix qu'on demande au modèle peut valoir 200, ou 200,4, ou n'importe quelle valeur entre les deux. Mais si on lui demande plutôt « ce bien partira-t-il en moins de trente jours ? », il n'y a que deux réponses possibles, et rien entre elles.\n\nCe que le modèle doit rendre n'a donc pas toujours la même nature, et c'est ce qui coupe le supervisé en deux.",
  },
  {
    id: "b-p7-4",
    type: "animation",
    ancre: "nature-de-la-sortie",
    animationId: "la-nature-de-la-sortie",
    legende:
      "Le curseur glisse, puis il saute d'un bout à l'autre, puis il s'arrête de barreau en barreau : c'est tout ce qui sépare les trois tâches.",
  },
  {
    id: "b-p7-5",
    type: "titre",
    niveau: 2,
    texte: "L'axe glisse : c'est une régression",
  },
  {
    id: "b-p7-7",
    type: "texte",
    texte:
      "La sortie est un nombre, et toutes les valeurs intermédiaires existent. Estimer un prix est une régression, et l'écart au carré de la page 5 la mesure.",
  },
  {
    id: "b-p7-13",
    type: "titre",
    niveau: 2,
    texte: "L'axe saute : c'est une classification",
  },
  {
    id: "b-p7-15",
    type: "texte",
    texte:
      "La sortie est un choix dans une liste finie. « Ce bien partira-t-il en moins de trente jours ? » n'a que deux réponses, et rien entre elles.\n\nAvec dix réponses au lieu de deux — lire un chiffre manuscrit, par exemple — c'est la même famille : dix arrêts, et toujours rien entre eux.",
  },
  {
    id: "b-p7-30",
    type: "titre",
    niveau: 2,
    texte: "Le piège : ce sont des codes, pas des quantités",
  },
  {
    id: "b-p7-31",
    type: "texte",
    texte:
      "Les dix chiffres se codent $0, 1, \\ldots, 9$, et ces entiers ressemblent à des quantités sans en être.\n\nAvec l'écart au carré, répondre 4 quand la réponse est 3 coûte 1, et répondre 5 coûte 4 : le cours vient de décider que se tromper de 3 en 4 est quatre fois moins grave que de 3 en 5. C'est faux, et c'est tout : les deux réponses sont fausses. Un modèle qui minimise l'écart au carré sur ces codes apprend que 3 est proche de 4, ce qui n'a aucun sens pour des chiffres manuscrits.",
  },
  {
    id: "b-p7-34",
    type: "image",
    ancre: "codage-arbitraire",
    src: "/cours/lecon1/l1-fig7-deux-codages.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Deux panneaux portent les mêmes dix classes, chacune dans une case marquée de son chiffre, alignées et numérotées de 0 à 9 ; sous chaque case, son code et le nom de la classe. Dans le panneau A, les cases sont rangées par la valeur du chiffre : 3 reçoit le code 3, 8 le code 8, 5 le code 5. Dans le panneau B, elles sont rangées par l'ordre alphabétique des noms : cinq, deux, huit, neuf, quatre, sept, six, trois, un, zéro, si bien que 3 reçoit le code 7, 8 le code 2 et 5 le code 0. Dans les deux panneaux, la case du 3 est encadrée de brique et surmontée du mot « présentée ». Sous chaque bande, deux cotes de brique mesurent l'écart des codes : dans le panneau A, répondre 8 coûte 25 et répondre 5 coûte 4 ; dans le panneau B, répondre 8 coûte 25 et répondre 5 coûte 49.",
    legende:
      "Le classement des deux erreurs suit la colonne des codes. Cette colonne, personne ne l'a mesurée : elle a été écrite.",
  },
];
