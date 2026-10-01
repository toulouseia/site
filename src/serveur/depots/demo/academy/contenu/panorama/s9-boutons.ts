import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · section 9
// Un modèle est une fonction à boutons.
//
// Écrite le 30 août 2026. C'est la charnière du chapitre : la page 9 vient de
// calculer θ_A et θ_B à la main, et le chapitre 2 va manipuler 101 770 nombres
// que personne n'écrira. Entre les deux, il manquait la page qui dit ce qui
// change, et elle ne dit QUE cela.
//
// Trois sections, et rien d'autre : ce que θ contient ici, ce qu'il contient
// sur des images, ce que le passage de l'un à l'autre coûte. Les trois
// conséquences de 10.3 sont NOMMÉES et renvoyées à leur chapitre ; aucune n'est
// traitée. La page ne construit pas le réseau, elle établit qu'il en faudra un.
//
// Les trois nombres — 3, 7 850, 101 770 — sont comptés par
// cours/lecon1/chiffres.py, section 4, et non écrits ici à la main.
// ─────────────────────────────────────────────────────────────────────────────

export const S9_BOUTONS: Bloc[] = [
  {
    id: "b-p9-1",
    type: "texte",
    texte:
      "Trois réglages se relisent à la main, mais combien de temps cela dure-t-il ?\n\nRemplacez les deux caractéristiques de l'appartement par les 784 pixels d'une image, et comptez de nouveau.",
  },
  {
    id: "b-p9-2",
    type: "titre",
    niveau: 2,
    ancre: "ce-que-theta-contient",
    texte: "Ce que $\\boldsymbol{\\theta}$ contient, et combien il en contient",
  },
  {
    id: "b-p9-3",
    type: "texte",
    texte:
      "Le modèle de la page 9 est $\\widehat{y} = w_1 x_1 + w_2 x_2 + b$, et trois nombres le règlent entièrement : deux poids et un biais. Une fois ces trois nombres fixés, la fonction est fixée ; les changer, c'est obtenir une autre fonction sans rien changer à la forme du calcul.",
  },
  {
    id: "b-p9-4",
    type: "formule",
    ancre: "theta-boutons",
    latex:
      "\\boldsymbol{\\theta} = (w_1,\\, w_2,\\, b) \\in \\mathbb{R}^{p}, \\qquad p = d + 1",
    alt: "Thêta est le triplet w un, w deux, b, dans R puissance p, avec p égal d plus un.",
    legende:
      "Le nombre de composantes de $\\boldsymbol{\\theta}$ porte un nom, $p$, et il se compte : une par caractéristique d'entrée, plus une pour le biais.",
  },
  {
    id: "b-p9-5",
    type: "texte",
    texte:
      "Sur le fil conducteur, $d = 2$, une surface et un nombre de pièces, donc $p = 3$ : trois boutons. C'est peu au point qu'on peut faire ce que la page 9 a fait : écrire deux réglages à la main, calculer la perte de chacun, et lire lequel est le meilleur. Chacun des trois nombres a un sens qui se dit en français : $w_1$ est le prix du mètre carré, $w_2$ ce que vaut une pièce de plus, $b$ ce que vaudrait un logement dont toutes les caractéristiques sont nulles.",
  },
  {
    id: "b-p9-6",
    type: "image",
    ancre: "les-trois-boutons",
    src: "/cours/lecon1/l1-fig17-les-trois-boutons.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Trois panneaux côte à côte portent chacun le même plan surface contre prix, les deux mêmes ventes en points d'encre, et la même droite à l'encre. Dans chaque panneau, deux droites de brique en tiret encadrent la droite pleine : ce sont les deux bouts de course d'un bouton. Sous le premier panneau, le poids w indice un, de un virgule huit à quatre virgule deux, posé à trois ; sous le deuxième, le poids w indice deux, de deux à dix-huit, posé à dix ; sous le troisième, le biais b, de moins huit à quarante-huit, posé à vingt. Une ligne en pied rappelle que le trait plein est le modèle posé, et les deux tiretés les bouts de course du bouton.",
    legende:
      "Trois boutons, trois façons de bouger, et on sait dire laquelle. Le trait plein est le modèle posé ; les deux tiretés sont les bouts de course du bouton.",
  },
  {
    id: "b-p9-7",
    type: "encart",
    ton: "note",
    titre: "Trois choses tiennent parce que $p = 3$",
    texte:
      "On peut **écrire** un réglage à la main, on peut **relire** le calcul qu'il produit, et on peut **dire ce que fait** chacun des trois nombres. Les trois tiennent au même fait, et c'est un fait de taille, pas de nature.",
  },
  {
    id: "b-p9-8",
    type: "titre",
    niveau: 2,
    ancre: "p-sur-des-images",
    texte: "Ce que $p$ devient sur des images",
  },
  {
    id: "b-p9-9",
    type: "texte",
    texte:
      "La page 2 a posé l'autre entrée du parcours : une image de 28 × 28 pixels, soit $d = 784$, et dix réponses possibles au lieu d'une. Le modèle le plus simple qu'on puisse écrire dans ce cadre pose un gabarit par chiffre : chaque gabarit donne un poids à chacun des 784 pixels, et un biais ; comptons.",
  },
  {
    id: "b-p9-10",
    type: "tableau",
    ancre: "trois-tailles",
    cleEnTete: true,
    titre: "Le nombre de réglages, selon ce qu'on met en entrée",
    entetes: ["Le modèle", "Le compte", "$p$"],
    lignes: [
      ["Deux appartements, $d = 2$", "$d + 1$", "3"],
      [
        "Dix gabarits sur 784 pixels",
        "$784 \\times 10 + 10$",
        "7 850",
      ],
      [
        "Le réseau du chapitre 2",
        "$784 \\times 128 + 128 + 128 \\times 10 + 10$",
        "101 770",
      ],
    ],
    legende:
      "Les trois comptes sont produits par `cours/lecon1/chiffres.py`, section 4. Ce sont des additions, pas des mesures : elles se refont sur un coin de table.",
  },
  {
    id: "b-p9-11",
    type: "texte",
    texte:
      "De 3 à 7 850, il y a un facteur d'environ 2 600 ; de 3 à 101 770, un facteur d'environ 33 900. L'objet n'a pas changé de nature : c'est toujours un $\\boldsymbol{\\theta}$, toujours un point de $\\mathbb{R}^{p}$, toujours noté par la même perte $\\mathcal{L}_{\\mathcal{D}}$. Seul $p$ a changé.",
  },
  {
    id: "b-p9-12",
    type: "image",
    ancre: "de-trois-boutons-a-cent-mille",
    src: "/cours/lecon1/l1-fig12-trois-reglages-cent-mille.svg",
    largeur: 1380,
    hauteur: 600,
    alt: "Trois pavés hachurés alignés sur une même ligne de sol, dont les surfaces sont proportionnelles à ce qu'ils comptent. Le premier, minuscule, porte : appartements, trois. Le deuxième, très grand à côté, porte : dix gabarits sur sept cent quatre-vingt-quatre pixels, sept mille huit cent cinquante. Le troisième, de même taille apparente que le deuxième, porte : le réseau du chapitre 2, cent un mille sept cent soixante-dix, et la mention pavé réduit trois virgule six fois, car à l'échelle des deux autres il sortirait du cadre ; un tracé de brique en pointillé part de son coin et quitte l'image. Sous un filet de brique : aucun de ces cent un mille sept cent soixante-dix nombres ne sera écrit à la main.",
    legende:
      "La surface dit ce qu'aucune phrase ne fait sentir.",
  },
  {
    id: "b-p9-13",
    type: "encart",
    ton: "attention",
    titre: "Aucun de ces 101 770 nombres ne sera écrit à la main",
    texte:
      "Ni par un ingénieur, ni par un expert du domaine, ni par personne. C'est le seul point que cette page demande de retenir. La page 2 a écarté par la mesure toute règle portant sur un pixel isolé ; ce qui resterait à écrire à la main, ce sont ces 101 770 nombres, et personne ne les écrit.",
  },
  {
    id: "b-p9-14",
    type: "titre",
    niveau: 2,
    ancre: "ce-qui-change",
    texte: "Ce qui change quand on ne peut plus les lire",
  },
  {
    id: "b-p9-15",
    type: "texte",
    texte:
      "Trois choses tenaient parce que $p$ valait 3, et les trois tombent ensemble. On ne peut plus **écrire** les réglages un par un : il faudrait 28 heures à raison d'un par seconde. On ne peut plus les **relire** pour comprendre ce que fait le modèle. Et on ne peut plus les **choisir** au jugé, comme on vient de le faire en passant de 20 à 22,5.",
  },
  {
    id: "b-p9-19",
    type: "texte",
    texte:
      "Le nombre de réglages est compté sur les trois modèles du parcours ; reste à reprendre le chapitre en un paragraphe avant d'ouvrir le chapitre 2.",
  },
];
