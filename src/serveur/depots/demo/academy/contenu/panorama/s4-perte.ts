import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 5, « Mesurer l'erreur ».
//
// RESSERRÉE le 8 septembre 2026 : 1 856 mots. Le piège de la compensation
// d'abord, le carré ensuite, et les quatre propriétés dans une seule table.
//
//   les trois annonces de la même dette   une phrase, en fin de page
//   l'encart sur la quatrième raison      retiré : la table la porte
//   les quatre puces qui relisent la      retirées : la formule se lit, et sa
//   formule de la perte moyenne           légende dit le seul point à voir
//   l'encart « la perte n'est pas un      retiré
//   prix »
//   la dépendance en thêta seul, sa       retirées : le paysage des scores est
//   formule et son commentaire            le sujet de la page 6
//   la vérification n° 3                  retirée : le calcul est dans le texte
// ─────────────────────────────────────────────────────────────────────────────

export const S4_PERTE: Bloc[] = [
  {
    id: "b-p4-1",
    type: "texte",
    texte:
      "Prenons une seconde vente dans le fichier : 30 m², 1 pièce, vendue 115. Et un second jeu de réglages, où l'on garde $w_1 = 3$ et $w_2 = 10$ mais où l'on ajoute $22{,}5$ au lieu de $20$.\n\nAppelons le premier $\\boldsymbol{\\theta}_A$ et le second $\\boldsymbol{\\theta}_B$ : lequel des deux est le meilleur ? Tant qu'on ne sait pas répondre par un nombre, on ne peut rien améliorer.\n\nEssayons le plus simple : l'écart entre ce que le modèle annonce et ce qui a été payé, moyenné sur les deux ventes.",
  },
  {
    id: "b-p4-5",
    type: "tableau",
    titre: "L'écart brut, sur les deux ventes",
    cleEnTete: true,
    entetes: [
      "Candidat",
      "Vente de 50 m²",
      "Vente de 30 m²",
      "Moyenne des écarts bruts",
    ],
    lignes: [
      [
        "$\\boldsymbol{\\theta}_A$, avec $b=20$",
        "$190-200=-10$",
        "$120-115=+5$",
        "$-2{,}5$",
      ],
      [
        "$\\boldsymbol{\\theta}_B$, avec $b=22{,}5$",
        "$192{,}5-200=-7{,}5$",
        "$122{,}5-115=+7{,}5$",
        "**$0$**",
      ],
    ],
    legende:
      "Les prix sont en milliers d'euros. Les prédictions se relisent à la main : pour la vente de 50 m² et deux pièces, $3\\times 50+10\\times 2+20=190$.",
  },
  {
    id: "b-p4-6",
    type: "animation",
    ancre: "ecart-brut-se-compense",
    animationId: "lecart-brut-se-compense",
    legende:
      "La barre de la moyenne traverse le zéro pendant que les deux écarts valent encore sept et demi chacun.",
  },
  {
    id: "b-p4-7",
    type: "texte",
    texte:
      "Regardez la dernière colonne : $\\boldsymbol{\\theta}_B$ obtient 0, la note parfaite, alors qu'il se trompe de 7 500 euros sur chacune des deux ventes.\n\nSes deux erreurs sont de signes contraires, et la moyenne les efface : un modèle qui surestime autant qu'il sous-estime passe pour parfait.",
  },
  {
    id: "b-p4-8",
    type: "titre",
    niveau: 2,
    texte: "Le carré empêche la compensation",
  },
  {
    id: "b-p4-9",
    type: "formule",
    ancre: "perte-exemple",
    latex: "\\ell(\\widehat{y}, y) = (\\widehat{y}-y)^{2}",
    alt: "La perte, notée ell, d'une prédiction y chapeau face à la valeur vraie y, est le carré de la différence y chapeau moins y.",
    numero: "5.1",
    legende:
      "Un carré est positif ou nul, et deux erreurs de signes contraires ne peuvent donc plus s'annuler.",
  },
  {
    id: "b-p4-10",
    type: "definition",
    terme: "Fonction de perte",
    anglais: "loss function",
    texte:
      "Une fonction qui reçoit une prédiction et la valeur vraie correspondante, et rend un nombre positif ou nul, d'autant plus grand que la prédiction est mauvaise. Elle est **choisie**, pas déduite.",
  },
  {
    id: "b-p4-13",
    type: "image",
    ancre: "le-carre-empeche-la-compensation",
    src: "/cours/lecon1/l1-fig4-deux-carres.svg",
    largeur: 1380,
    hauteur: 430,
    alt: "À gauche, une ligne pointillée grise marque l'écart nul ; un segment de brique descend sous elle, coté moins 7,5, pour la vente de 50 m², et un autre monte au-dessus, coté plus 7,5, pour la vente de 30 m². À droite, les deux carrés que ces segments engendrent sont rangés côte à côte, de même taille, portant chacun leur aire, 56,25, et la ligne 56,25 plus 56,25 égale 112,5 est écrite dessous.",
    legende: "Les aires s'ajoutent là où les écarts s'annulaient.",
  },
  {
    id: "b-p4-13b",
    type: "image",
    ancre: "doubler-lecart",
    src: "/cours/lecon1/l1-fig5-quadrillage.svg",
    largeur: 1380,
    hauteur: 470,
    alt: "Un carré de côté 20 est partagé par une croix en quatre parts égales, chacune marquée 100. La part du bas à gauche est cerclée de brique : c'est le carré de côté 10, resté en place. Sous la base, deux lignes de mesure donnent 10 puis 20. À droite, 20 au carré égale 400, égale 4 fois 10 au carré.",
    legende: "Doubler l'écart quadruple l'aire.",
  },
  {
    id: "b-p4-12",
    type: "tableau",
    ancre: "quatre-raisons",
    titre: "Ce que le carré apporte",
    cleEnTete: true,
    entetes: ["Propriété", "Vérification"],
    lignes: [
      [
        "**Positivité.** Le carré est nul si et seulement si l'estimation tombe juste.",
        "Sur $\\boldsymbol{\\theta}_B$, $-7{,}5$ et $+7{,}5$ s'annulent ; $56{,}25$ et $56{,}25$ ne s'annulent pas.",
      ],
      [
        "**Le signe ne compte pas.** Seule la taille de l'écart compte.",
        "Surestimer de 10 ou sous-estimer de 10 coûte 100 dans les deux cas.",
      ],
      [
        "**Les grosses erreurs pèsent plus.** Doubler l'écart quadruple la perte.",
        "Un écart de 5 coûte 25 ; un écart de 10 coûte 100, soit quatre fois plus.",
      ],
      [
        "**Elle se dérive partout.** La valeur absolue, elle, a un coin en zéro.",
        "C'est ce qui rendra la recherche du minimum possible, au chapitre 3.",
      ],
    ],
  },
  {
    id: "b-p4-15",
    type: "titre",
    niveau: 2,
    texte: "La note d'un jeu de réglages",
  },
  {
    id: "b-p4-16",
    type: "texte",
    texte:
      "Un modèle qui vise juste sur une vente et faux sur toutes les autres n'est pas bon. On prend donc la moyenne des pertes sur les $N$ exemples du jeu.",
  },
  {
    id: "b-p4-17",
    type: "formule",
    ancre: "perte-jeu",
    latex:
      "\\mathcal{L}_{\\mathcal{D}}(\\boldsymbol{\\theta}) = \\frac{1}{N} \\sum_{n=1}^{N} \\ell\\!\\left( f_{\\boldsymbol{\\theta}}\\!\\left(\\mathbf{x}^{(n)}\\right), y^{(n)} \\right)",
    alt: "La perte sur le jeu de données, évaluée en thêta, vaut un sur N fois la somme, pour n allant de un à N, de la perte entre la prédiction f indice thêta appliquée à l'entrée x exposant n, et la valeur vraie y exposant n.",
    numero: "5.2",
    legende:
      "Le facteur $\\frac{1}{N}$ en fait une **moyenne** : la note ne dépend plus du nombre de ventes.",
  },
  {
    id: "b-p4-19",
    type: "texte",
    texte:
      "Reprenons les écarts du tableau et élevons-les au carré. Pour $\\boldsymbol{\\theta}_A$ : $(-10)^{2} = 100$ et $(+5)^{2} = 25$, donc une note de $(100+25)/2 = 62{,}5$. Pour $\\boldsymbol{\\theta}_B$ : $(-7{,}5)^{2} = 56{,}25$ deux fois, donc une note de $56{,}25$.\n\nC'est donc $\\boldsymbol{\\theta}_B$ le meilleur des deux, et la note le dit sans qu'on ait à en discuter.",
  },
  {
    id: "b-p4-21",
    type: "animation",
    ancre: "perte-note-theta",
    animationId: "la-perte-note-theta",
    legende:
      "Le compteur $\\mathcal{L}$ descend puis remonte pendant que $b$ balaie son intervalle : il existe un minimum, et on vient de le dépasser.",
  },
  {
    id: "b-p4-26",
    type: "texte",
    texte:
      "Reste à trouver les réglages qui donnent la plus petite note. Comment on les cherche est le sujet du chapitre 3.",
  },
];
