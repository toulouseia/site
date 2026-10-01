import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 4 · Un neurone, et ce qu'il regarde
//
// L'analogie biologique d'abord, avec ce qu'elle ne dit pas ; puis l'objet
// mathématique, typé ; puis la somme décomposée par signe ; puis vec^-1 appliqué
// à w, qui fait du vecteur de poids une image qu'on regarde.
//
// Les extrema des gabarits sortent de cours/lecon2/mesures.py, section 4. Ce
// sont des MESURES faites sur un modèle déjà entraîné : cette page ne construit
// aucun de ces nombres, elle les lit.
// ─────────────────────────────────────────────────────────────────────────────

export const P04_NEURONE: Bloc[] = [
  {
    id: "b-r4-1",
    type: "texte",
    texte:
      "Une image compte 784 pixels, et il faut bien une pièce de calcul qui les regarde tous et n'en rende qu'un seul nombre. La plus petite qu'on puisse écrire multiplie chaque pixel par un nombre à lui, additionne les 784 produits, et s'arrête là. Reste à savoir ce qu'un tel nombre peut dire de l'image, et à quoi ressemblent les 784 nombres qui le calculent.",
  },
  {
    id: "b-r4-10f",
    type: "image",
    ancre: "un-neurone-et-son-nombre",
    src: "/cours/lecon2/l2-fig04-neurone.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "À gauche, une grille de vingt-huit sur vingt-huit pixels portant l'image de test numéro zéro, un sept manuscrit en encre sombre ; sous elle, la mention l'image de test numéro zéro. Un pixel de la ligne neuf est cerclé de brique, et un trait tireté monte de lui vers l'étiquette x indice deux cent trente et un. Une flèche mène de la grille à une colonne de trois ronds séparés par deux groupes de trois points de suspension, réunis par une accolade cotée sept cent quatre-vingt-quatre ; le rond du milieu est cerclé de brique. De chaque rond part un trait vers un grand cercle d'encre, au centre de la figure, qui porte en son milieu le signe somme. Le trait qui part du rond de brique est lui-même en brique et porte l'étiquette w indice deux cent trente et un. Au-dessus du faisceau se lit w transposée x plus b. Une flèche monte vers le grand cercle depuis le bas, et sous elle se lit b égale moins un virgule trois zéro six quatre. Une flèche sort du grand cercle vers la droite et mène à z égale moins zéro virgule sept zéro trois huit, écrit en brique.",
    legende:
      "Sept cent quatre-vingt-quatre poids, un par trait ; sept cent quatre-vingt-quatre produits, une somme, et **un** nombre qui sort. Ces poids et ce biais sont ceux du neurone qui note le $0$, mesurés par `cours/lecon2/mesures.py`, section 4 ; le gabarit, plus bas, replie ces mêmes $784$ poids en grille. Sur ce $7$, le neurone rend un nombre négatif.",
  },
  {
    id: "b-r4-10f-lecture",
    type: "texte",
    texte:
      "Le pixel de la ligne 9, colonne 7, porte l'octet 222, soit $x_{231}=0{,}870588$, et le trait qui en part porte le poids $w_{231}$, si bien que le produit $w_{231}\\,x_{231}$ entre dans la somme avec 783 autres.\n\nCe qui monte par en dessous est $b$, qui ne vient d'aucun pixel et s'ajoute une fois pour toutes, et ce qui sort à droite est un seul nombre, $z$, tout ce que la pièce rend.\n\nLes 784 poids dessinés ici sont ceux d'une pièce mesurée qui note le chiffre 0, appliquée à une image qui montre un 7. Elle rend $z=-0{,}7038$, un nombre négatif, mais sa somme pondérée est positive : c'est le biais, $-1{,}3064$, qui fait passer le total sous zéro.\n\nUn $z$ seul ne veut donc encore rien dire, faute d'avoir quoi que ce soit à quoi le comparer, et la page 6 lui donnera neuf concurrents.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4.1 · Le mot
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r4-2",
    type: "titre",
    niveau: 2,
    texte: "Le mot vient de la biologie",
  },
  {
    id: "b-r4-3",
    type: "texte",
    texte:
      "Un neurone biologique reçoit des signaux par ses dendrites, et émet ou n'émet pas selon ce qu'il a reçu. C'est de là que le nom vient, et c'est là que l'emprunt s'arrête.",
  },
  {
    id: "b-r4-4",
    type: "tableau",
    ancre: "analogie",
    titre: "L'analogie, et sa limite",
    cleEnTete: true,
    entetes: ["Ce que l'analogie apporte", "Ce qu'elle ne dit pas"],
    lignes: [
      [
        "Une unité qui reçoit **plusieurs** entrées et n'en rend qu'**une**",
        "Le neurone artificiel rend un réel, pas une impulsion. Il n'y a ni temps, ni fréquence de décharge, ni potentiel d'action",
      ],
      [
        "L'idée que l'unité s'active **plus ou moins**",
        "Les entrées d'un neurone artificiel sont pondérées par des réels de signe quelconque, et une entrée peut **éteindre** le neurone. Une synapse ne se retourne pas ainsi",
      ],
      [
        "L'idée qu'un grand nombre d'unités simples fait quelque chose de complexe",
        "L'organisation en paquets où chaque unité voit **toutes** celles du paquet précédent, celle-là même que montre la figure de la page 1, ne correspond à aucune structure biologique connue",
      ],
    ],
    legende:
      "Un avion vole, un oiseau vole, et la ressemblance s'arrête au fait de voler. Elle a suffi à donner le nom, elle ne fournit aucun argument.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4.2 · L'objet mathématique
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r4-5",
    type: "titre",
    niveau: 2,
    texte: "L'objet mathématique",
  },
  {
    id: "b-r4-6",
    type: "definition",
    terme: "Neurone",
    anglais: "neuron, unit",
    texte:
      "Une fonction $\\mathbb{R}^{784}\\rightarrow\\mathbb{R}$ de la forme $\\mathbf{x}\\mapsto\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b$, entièrement déterminée par un vecteur $\\mathbf{w}$ et un scalaire $b$. Ce sont ses **paramètres** : ils ne dépendent pas de l'entrée, et ce sont eux qu'un entraînement choisit.",
  },
  {
    id: "b-r4-7",
    type: "formule",
    ancre: "preactivation",
    latex:
      "\\mathbf{w}\\in\\mathbb{R}^{784},\\quad b\\in\\mathbb{R},\\qquad z=\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b=\\sum_{k=1}^{784}w_{k}\\,x_{k}+b\\ \\in\\mathbb{R}",
    alt: "Le vecteur de poids w vit dans l'espace à sept cent quatre-vingt-quatre dimensions, le biais b est un réel. La préactivation z vaut w transposée x plus b, c'est-à-dire la somme pour k allant de un à sept cent quatre-vingt-quatre des produits w indice k fois x indice k, plus b. C'est un réel.",
    numero: "4.1",
  },
  {
    id: "b-r4-7b",
    type: "texte",
    texte:
      "Reprends la formule $(4.1)$ terme par terme.\n\n$\\mathbf{x}$ est l'image, mise à plat en 784 nombres à la page 3, et elle arrive du jeu sans qu'on la choisisse.\n\n$\\mathbf{w}$ est un vecteur de 784 nombres, un par pixel, et le nombre $w_{k}$ s'appelle le **poids** du pixel de rang $k$ : il dit combien ce pixel compte dans le résultat, et dans quel sens.\n\n$w_{k}\\,x_{k}$ multiplie l'encre du pixel $k$ par son poids, si bien qu'un pixel blanc, pour qui $x_{k}=0$, n'apporte rien quel que soit son poids.",
  },
  {
    id: "b-r4-7c",
    type: "titre",
    niveau: 3,
    texte: "Ce qui sort",
  },
  {
    id: "b-r4-7d",
    type: "texte",
    texte:
      "La somme $\\sum_{k}w_{k}x_{k}$ additionne ces 784 produits et rend un seul nombre, auquel $b$ s'ajoute à la fin sans dépendre d'aucun pixel. La page 9 dira à quoi sert ce $b$.\n\n$z$ est le résultat, le seul nombre que le neurone rend, et c'est ce que le chapitre appellera son **score** sur cette image.",
  },
  {
    id: "b-r4-8",
    type: "definition",
    terme: "Préactivation",
    anglais: "pre-activation",
    texte:
      "Le scalaire $z$ que produit $(4.1)$. Le préfixe **pré** dit qu'une étape viendra ensuite : à partir de la page 6, une fonction s'insère entre $z$ et ce que le modèle rend vraiment, et les deux quantités cessent alors d'être égales. Ici elles le sont encore, et le préfixe ne coûte rien.",
  },
  {
    id: "b-r4-9",
    type: "tableau",
    ancre: "types-neurone",
    titre: "Les quatre objets de cette page, typés",
    cleEnTete: true,
    entetes: ["Symbole", "Type", "Ensemble", "Dimension", "Rôle"],
    lignes: [
      ["$\\mathbf{x}$", "Vecteur", "$[0,1]^{784}$", "$784\\times 1$", "Donnée. Fournie, jamais choisie"],
      ["$\\mathbf{w}$", "Vecteur", "$\\mathbb{R}^{784}$", "$784\\times 1$", "**Paramètre appris**"],
      ["$b$", "Scalaire", "$\\mathbb{R}$", "$1\\times 1$", "**Paramètre appris**"],
      ["$z$", "Scalaire", "$\\mathbb{R}$", "$1\\times 1$", "Calculé. Ni donné, ni appris"],
    ],
  },
  {
    id: "b-r4-10",
    type: "texte",
    texte:
      "On vérifie les dimensions à chaque fois, même quand le résultat saute aux yeux : $\\mathbf{w}^{\\mathsf{T}}$ est $1\\times 784$ et $\\mathbf{x}$ est $784\\times 1$, donc leur produit est $1\\times 1$, un scalaire auquel $b$ peut s'ajouter. C'est bien pourquoi la transposée est là, le produit $(784\\times 1)(784\\times 1)$ n'existant pas.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4.2 bis · Les poids ne savent pas où sont leurs pixels
  //
  // L'ARGUMENT VIENT DE LA PAGE 2, où il arrivait avant que w existe. Des
  // élèves y ont lu « un 7 de cinq colonnes ». Il attend maintenant que w soit
  // défini, et il a ses deux grilles.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r4-10a",
    type: "titre",
    niveau: 2,
    texte: "Déplacer le chiffre change tout le calcul",
  },
  {
    id: "b-r4-10b",
    type: "image",
    ancre: "sept-decale",
    src: "/cours/lecon2/l2-fig19-sept-decale.svg",
    largeur: 1380,
    hauteur: 760,
    alt: "Deux grilles de vingt-huit lignes sur vingt-huit colonnes, côte à côte, graduées en lignes et en colonnes de un à vingt-huit. La grille de gauche porte l'image de test numéro zéro, un sept manuscrit en encre sombre. La grille de droite porte exactement la même image, mais déplacée de cinq colonnes vers la droite. Dans chaque grille, un pixel de la ligne neuf est cerclé de brique, et un trait tireté monte de ce pixel jusqu'à une étiquette au-dessus de la grille. À gauche, le pixel cerclé est celui de la colonne sept, et son étiquette porte w indice deux cent trente et un. À droite, le pixel cerclé est celui de la colonne douze, et son étiquette porte w indice deux cent trente-six. Sous chaque grille, une ligne dit à quelle colonne l'encre de la ligne neuf commence.",
    legende:
      "Le même trait, deux rangs différents dans le vecteur.",
  },
  {
    id: "b-r4-10c",
    type: "texte",
    texte:
      "Les deux images montrent le même 7, la seconde décalée de cinq colonnes vers la droite, et pour le modèle ce sont deux images sans rapport.\n\nChaque pixel a son poids à lui : celui de la ligne 9, colonne 7, a le poids $w_{231}$, celui de la ligne 9, colonne 12, a le poids $w_{236}$, et rien ne relie ces deux nombres. Quand le 7 se décale, son encre quitte les pixels de gauche pour ceux de droite, rencontre donc d'autres poids, et le score change sans que le modèle sache qu'il s'agit du même chiffre.\n\nC'est pour cela que les chiffres du jeu sont tous recadrés au même endroit, ce que les auteurs du jeu ont fait avant de le publier et ce que la page 2 a mesuré.",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 4.3 · La somme, décomposée par signe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r4-11",
    type: "titre",
    niveau: 2,
    texte: "Ce que la somme pondérée mesure",
  },
  {
    id: "b-r4-12",
    type: "formule",
    ancre: "somme-par-signe",
    latex:
      "z=\\underbrace{\\sum_{k\\,:\\,w_{k}>0} w_{k}x_{k}}_{\\text{ce que le neurone cherche}}\\ +\\ \\underbrace{\\sum_{k\\,:\\,w_{k}<0} w_{k}x_{k}}_{\\text{ce qu'il refuse}}\\ +\\ b",
    alt: "La préactivation z se sépare en trois termes : la somme des produits w k fois x k sur les indices où w k est strictement positif, qui est ce que le neurone cherche ; plus la somme des mêmes produits sur les indices où w k est strictement négatif, qui est ce qu'il refuse ; plus le biais b.",
    numero: "4.2",
    legende:
      "Les indices où $w_{k}=0$ n'apparaissent dans aucune des deux sommes : ces pixels ne comptent pas, quelle que soit leur valeur.",
  },
  {
    id: "b-r4-13",
    type: "liste",
    elements: [
      "$w_{k}>0$ : le pixel $k$ **fait monter** $z$ quand il porte de l'encre, donc le neurone veut en trouver là.",
      "$w_{k}<0$ : le pixel $k$ **fait descendre** $z$ quand il porte de l'encre, donc le neurone veut l'y trouver blanc.",
      "$w_{k}=0$ : le pixel $k$ n'a aucun effet sur $z$, quelle que soit sa valeur, et le neurone ne le regarde pas.",
    ],
  },
  {
    id: "b-r4-14",
    type: "texte",
    texte:
      "Sous le signe somme, $k:w_{k}>0$ se lit « pour les $k$ tels que $w_{k}$ est strictement positif », et la somme ne parcourt donc que ces indices-là.\n\nComme $x_{k}\\in[0,1]$, chaque terme $w_{k}x_{k}$ a le signe de $w_{k}$ et une amplitude d'autant plus grande que le pixel est encré, et un pixel blanc, pour qui $x_{k}=0$, n'apporte rien, dans aucun des deux sens. C'est pourquoi le fond de l'image, 80,88 % de valeurs nulles, ne pèse sur aucun score.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4.4 · Le gabarit
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r4-16",
    type: "titre",
    niveau: 2,
    texte: "Un vecteur de poids est une image",
  },
  {
    id: "b-r4-17",
    type: "texte",
    texte:
      "$\\mathbf{w}$ a exactement 784 coordonnées, et $\\mathrm{vec}^{-1}$ replie n'importe quel vecteur de $\\mathbb{R}^{784}$ en grille $28\\times 28$. Rien n'oblige à ne l'appliquer qu'aux images : appliquée à $\\mathbf{w}$, elle donne une matrice de même forme qu'une image, et qu'on peut donc regarder.",
  },
  {
    id: "b-r4-18",
    type: "definition",
    terme: "Gabarit",
    anglais: "template",
    texte:
      "La matrice $G=\\mathrm{vec}^{-1}(\\mathbf{w})\\in\\mathcal{M}_{28,28}(\\mathbb{R})$. Ses coefficients ne sont pas des intensités : ils sont de signe quelconque, et ils ne sont pas bornés. $G_{ij}$ dit ce que le neurone attend du pixel $(i,j)$.",
  },
  {
    id: "b-r4-19",
    type: "formule",
    latex:
      "G=\\mathrm{vec}^{-1}(\\mathbf{w})\\in\\mathcal{M}_{28,28}(\\mathbb{R}),\\qquad G_{ij}=w_{28(i-1)+j}",
    alt: "G est l'image de w par vec inverse, et c'est une matrice réelle à vingt-huit lignes et vingt-huit colonnes. Son coefficient à la ligne i et à la colonne j vaut la coordonnée de w de rang vingt-huit fois i moins un, plus j.",
  },
  {
    id: "b-r4-20",
    type: "animation",
    ancre: "gabarit-du-zero-anime",
    animationId: "le-gabarit-du-0",
    legende:
      "Les $784$ poids du neurone qui note le $0$, repliés par $\\mathrm{vec}^{-1}$. Ce qu'il récompense et ce qu'il pénalise se lisent alors comme une image, et le score suit l'encre : un vrai $0$ évite le creux central, un vrai $8$ tombe dedans.",
  },
  {
    id: "b-r4-21",
    type: "sortie",
    ancre: "gabarits-extrema",
    titre:
      "Quatre des dix gabarits d'un modèle entraîné · cours/lecon2/mesures.py, section 4",
    texte:
      "      chiffre    max        position       min        position\n            0    +1.0395   (13, 25)      -1.4457   (16, 15)\n            1    +1.5359   (23,  6)      -1.3252   (17, 18)\n            4    +1.1218   (13, 13)      -1.5851   ( 4, 14)\n            7    +1.0642   (15, 20)      -1.3773   (15, 13)",
    lecture: [
      "Les positions sont données en (ligne, colonne), numérotées à partir de $1$, et le centre géométrique de la grille est $(14{,}5\\ ;\\ 14{,}5)$. Le modèle mesuré est celui à une seule étape de calcul, que la page 6 construit, et non le réseau complet de la page 1.",
      "**Le gabarit du $0$ a son minimum en $(16,15)$**, soit une ligne et demie sous le centre et une demi-colonne à sa droite. Ce neurone paie le plus cher l'encre trouvée au milieu de l'image, puisqu'il y cherche un **trou**, ce qui est exactement ce qui distingue un $0$ d'un $8$ ou d'un $9$, et personne ne le lui a dit.",
      "Le gabarit du $1$ a son maximum en $(23,6)$ et son minimum en $(17,18)$, donc il récompense l'encre en bas à gauche et pénalise celle du milieu à droite, ce qui ne ressemble pas à un $1$. Un gabarit marque d'abord les endroits qui séparent le mieux son chiffre des neuf autres : il arrive que ces endroits dessinent le chiffre, comme pour le $0$, et il arrive que non.",
      "Aucun de ces nombres n'est construit ici, et les dix gabarits d'un même modèle sont posés page 6, une pièce par chiffre. Ce sont des **mesures** faites sur un modèle déjà entraîné, dont le chapitre 3 seul dira d'où elles viennent.",
    ],
  },
  {
    id: "b-r4-21f",
    type: "image",
    ancre: "gabarit-du-zero",
    src: "/cours/lecon2/l2-fig05-gabarit-zero.svg",
    largeur: 1380,
    hauteur: 960,
    alt: "Une grille de vingt-huit sur vingt-huit cases pleines. Les cases tirent vers la brique là où le poids est positif, vers l'ardoise là où il est négatif, et restent blanches près de zéro. Les cases de brique forment une couronne large qui suit le contour d'un zéro manuscrit ; au milieu de cette couronne, un cœur de cases d'ardoise occupe le centre de la grille. Deux cases sont encadrées d'encre : celle de la ligne treize colonne vingt-cinq, la plus rouge, et celle de la ligne seize colonne quinze, la plus bleue. Une croix en pointillé marque le centre géométrique de la grille, à quatorze virgule cinq en ligne comme en colonne. À droite, le maximum vaut plus un virgule zéro trois neuf cinq en ligne treize colonne vingt-cinq, le minimum moins un virgule quatre quatre cinq sept en ligne seize colonne quinze. Une bande dégradée passe de l'ardoise au blanc puis à la brique, symétrique autour de zéro, et porte un repère sur chacune des deux valeurs atteintes. Deux carrés de légende disent qu'un poids positif marque un endroit où le neurone veut de l'encre, un poids négatif un endroit où il n'en veut pas. En dessous, l'image de test numéro trois, un zéro manuscrit, est dessinée à côté du gabarit.",
    legende:
      "Un gabarit est une image de la même forme que l'entrée, et il se regarde comme telle.",
  },
  {
    id: "b-r4-22",
    type: "texte",
    texte:
      "Un gabarit ressemble à un chiffre moyen, et la page 2 écartait pourtant la comparaison des pixels un par un à un chiffre modèle. Les deux tiennent ensemble, parce que $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}$ ne compare pas deux images : il pondère des pixels, et un pixel dont le poids est nul reste sans effet au lieu de compter pour une différence. Ce que cette façon de faire ne pourra jamais obtenir est démontré page 7.",
  },
  {
    id: "b-r4-23",
    type: "verification",
    numero: 11,
    enonce:
      "Un gabarit se lit comme une consigne : où le neurone veut de l'encre, et où il n'en veut pas.",
    questions: [
      "Que vaut $z$ si tous les pixels encrés d'une image tombent exactement là où le gabarit est négatif, et que $b=0$ ?",
      "Pourquoi le minimum du gabarit du $0$ est-il près du centre plutôt que sur le pourtour de la grille ?",
      "Deux neurones ont des gabarits opposés, $\\mathbf{w}'=-\\mathbf{w}$, et des biais opposés. Que peut-on dire de leurs préactivations sur une même image ?",
    ],
  },
  {
    id: "b-r4-24",
    type: "encart",
    ton: "attention",
    titre: "D'où viennent ces poids ?",
    texte:
      "Ce gabarit a été lu, pas construit. Personne n'a posé à la main les nombres du modèle mesuré, dont la page 6 dira qu'il en compte $7\\,850$ : une procédure les a **choisis**, et ce chapitre ne décrit pas cette procédure.\n\nLa page 5 construira un neurone entièrement à la main pour montrer que c'est possible, et la page 10 comptera le temps qu'il faudrait pour faire de même sur le réseau complet. C'est la première des questions laissées ouvertes page 1, et **le chapitre 3 y répond**.",
  },
];
