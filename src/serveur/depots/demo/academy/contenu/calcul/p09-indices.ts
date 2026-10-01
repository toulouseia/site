import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 9 · Plusieurs neurones par couche
//
// Ouverture règle 26 : la question, l5-fig09-indices (1380 × 940), le cadre.
//
// Le réseau général posé, avec sa convention d'indices VÉRIFIÉE sur les
// dimensions de la matrice. Écart n°2 signalé ici : exposant entre crochets et
// indices à partir de 1, contre exposant entre parenthèses et indices à partir
// de zéro dans la source.
//
// Les deux dérivations du temps : « Le poids, quand la couche a plusieurs
// neurones » et « L'activation, quand plusieurs chemins y mènent ». Écart n°3
// écrit ici : passer à plusieurs neurones ne fait pas qu'ajouter des indices,
// un terme passe d'un produit à une somme, et c'est de cette somme que vient
// la transposée. l5-fig11-somme (1380 × 880) la montre, matrice et transposée
// en tableaux de coefficients.
//
// l5-fig10-chemins est retirée : son sujet est celui de l5-fig03-perte et de
// la somme sur les chemins, et son nom sert désormais à la jacobienne page 10.
//
// 🧪 n°58 et n°59.
// ─────────────────────────────────────────────────────────────────────────────

export const C09_INDICES: Bloc[] = [
  {
    id: "b-cr9-0a",
    type: "texte",
    texte:
      "Qu'est-ce qui change quand une couche compte cent neurones au lieu d'un ?",
  },
  {
    id: "b-cr9-0b",
    type: "image",
    ancre: "lordre-des-indices",
    src: "/cours/lecon5/l5-fig09-indices.svg",
    largeur: 1380,
    hauteur: 940,
    alt: "Deux objets côte à côte. À gauche, un réseau de cinq ronds pour la couche l moins un et de quatre ronds pour la couche l, avec tous les traits qui relient les uns aux autres. Le trait qui joint le troisième rond de gauche au deuxième rond de droite est tracé en brique, et les deux ronds qu'il touche sont cerclés de la même couleur. À droite, la matrice de poids de la couche l, écrite entre crochets comme une grille de quatre lignes et de cinq colonnes, où chaque case porte son coefficient. La case de la ligne deux et de la colonne trois est en brique elle aussi. Les numéros de ligne courent de un à quatre le long du bord gauche de la grille, et les numéros de colonne de un à cinq au-dessus.",
    legende:
      "Un trait du réseau et un coefficient de la matrice sont le même objet, regardé de deux façons.",
  },
  {
    id: "b-cr9-0c",
    type: "texte",
    texte:
      "Un réseau à un neurone par couche fait circuler une valeur par couche, alors qu'une couche de cent neurones en porte cent, et chacun des traits qui l'atteignent porte son propre poids : nommer ce poids demande donc deux indices, celui du neurone d'arrivée et celui du neurone de départ. Des deux dérivées que réclame une couche, l'une garde exactement la forme qu'elle avait, et l'autre devient une somme.",
  },
  {
    id: "b-cr9-1",
    type: "titre",
    niveau: 2,
    texte: "Le réseau général",
  },
  {
    id: "b-cr9-2",
    type: "formule",
    ancre: "reseau-general",
    latex:
      "\\begin{aligned}&L\\in\\mathbb{N}^{*},\\ L\\geq 2,\\qquad d_{0},d_{1},\\dots,d_{L}\\in\\mathbb{N}^{*}\\\\ &W^{[l]}\\in\\mathcal{M}_{d_{l},d_{l-1}}(\\mathbb{R}),\\qquad \\mathbf{b}^{[l]}\\in\\mathbb{R}^{d_{l}}\\\\ &\\mathbf{a}^{[0]}=\\mathbf{x}\\in\\mathbb{R}^{d_{0}},\\qquad \\mathbf{z}^{[l]}=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}\\\\ &\\mathbf{a}^{[l]}=\\varphi\\big(\\mathbf{z}^{[l]}\\big)\\ \\ (l<L),\\qquad \\mathbf{a}^{[L]}=\\mathrm{softmax}\\big(\\mathbf{z}^{[L]}\\big)\\end{aligned}",
    alt: "Le nombre de couches L est au moins deux, les largeurs d zéro à d L sont des entiers strictement positifs. La matrice de poids de la couche l a d l lignes et d l moins un colonnes, le biais est un vecteur de dimension d l. L'activation de la couche zéro est l'entrée. La somme pondérée de la couche l est la matrice de poids multipliée par l'activation précédente plus le biais. L'activation est phi appliquée à la somme pondérée pour les couches internes, et softmax à la dernière.",
    numero: "5.7",
    legende:
      "La cible passe du scalaire au vecteur : $\\mathbf{y}$ est l'encodage one-hot du chapitre 2 et la perte est l'entropie croisée $-\\mathbf{y}^{\\mathsf{T}}\\ln\\mathbf{a}^{[L]}$. Le réseau des pages précédentes en est le cas à deux classes, où $\\sigma$ est le softmax pour $K=2$, démontré au chapitre 2, et la perte appariée à l'activation de sortie, page 6, donne $\\boldsymbol{\\delta}^{[L]}=\\mathbf{a}^{[L]}-\\mathbf{y}$ des deux côtés.",
  },
  {
    id: "b-cr9-3",
    type: "formule",
    ancre: "compte-des-parametres",
    latex:
      "\\boldsymbol{\\theta}\\in\\mathbb{R}^{p},\\qquad p=\\sum_{l=1}^{L}\\big(d_{l}\\,d_{l-1}+d_{l}\\big)",
    alt: "Thêta vit dans R puissance p, où p est la somme, pour l allant de un à L, du produit de d l par d l moins un, plus d l.",
    numero: "5.8",
    legende:
      "Pour $784\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 10$ : $p=63\\,370$.",
  },
  {
    id: "b-cr9-4",
    type: "titre",
    niveau: 2,
    texte: "La convention d'indices",
  },
  {
    id: "b-cr9-5",
    type: "definition",
    terme: "$W^{[l]}_{ij}$",
    texte:
      "Le poids qui relie le $j$-ième neurone de la couche $l-1$ au $i$-ième neurone de la couche $l$. L'indice $i$ court sur $[\\![1,d_{l}]\\!]$, l'indice $j$ sur $[\\![1,d_{l-1}]\\!]$.",
  },
  {
    id: "b-cr9-6",
    type: "texte",
    texte:
      "L'ordre paraît inversé, puisqu'on écrit d'abord l'arrivée et ensuite le départ, mais c'est celui de la matrice, et la vérification tient en une ligne de dimensions.",
  },
  {
    id: "b-cr9-7",
    type: "tableau",
    ancre: "verification-des-indices",
    cleEnTete: true,
    entetes: ["Objet", "Dimensions", "Indice de ligne", "Indice de colonne"],
    lignes: [
      ["$W^{[l]}$", "$d_{l}\\times d_{l-1}$", "$i$, la couche $l$", "$j$, la couche $l-1$"],
      ["$\\mathbf{a}^{[l-1]}$", "$d_{l-1}\\times 1$", "$j$", "$1$"],
      ["$\\mathbf{z}^{[l]}$", "$d_{l}\\times 1$", "$i$", "$1$"],
    ],
    legende:
      "$(d_{l}\\times d_{l-1})(d_{l-1}\\times 1)\\rightarrow d_{l}\\times 1$ : $W^{[l]}_{ij}$ est bien le coefficient de la ligne $i$ et de la colonne $j$.",
  },
  {
    id: "b-cr9-8",
    type: "formule",
    ancre: "somme-ponderee-indices",
    latex:
      "z^{[l]}_{i}=\\sum_{j=1}^{d_{l-1}}W^{[l]}_{ij}\\,a^{[l-1]}_{j}+b^{[l]}_{i}",
    alt: "La composante i de la somme pondérée de la couche l est la somme, pour j allant de un à d l moins un, du produit du poids d'indices i et j par la composante j de l'activation précédente, plus la composante i du biais.",
    numero: "5.9",
  },
  {
    id: "b-cr9-10",
    type: "encart",
    ton: "note",
    titre: "Écart n°2",
    texte:
      "La source numérote les couches en exposant entre parenthèses et démarre ses indices à zéro. Les conventions du chapitre 2 sont gardées ici : exposant entre **crochets**, indices à partir de **1**.",
  },
  {
    id: "b-cr9-11",
    type: "titre",
    niveau: 2,
    texte: "Ce qui ne change pas",
  },
  {
    id: "b-cr9-11d",
    type: "definition",
    terme: "Signal d'erreur d'une couche à plusieurs neurones",
    texte:
      "Le vecteur $\\boldsymbol{\\delta}^{[l]}\\in\\mathbb{R}^{d_{l}}$ dont la $i$-ième composante est $\\delta^{[l]}_{i}=\\partial\\ell/\\partial z^{[l]}_{i}$, la dérivée de la perte par rapport à la somme pondérée du $i$-ième neurone de la couche $l$. Le scalaire de la page 8 en est le cas $d_{l}=1$.",
  },
  {
    id: "b-cr9-12",
    type: "derivation",
    ancre: "le-poids-a-plusieurs-neurones",
    titre: "Le poids, quand la couche a plusieurs neurones",
    hypotheses: [
      "Réseau général (5.7).",
      "$W^{[l]}_{ij}$ n'apparaît que dans $z^{[l]}_{i}$, et dans aucune autre composante.",
    ],
    chaine: "W^{[l]}_{ij} → z^{[l]}_i → ℓ",
    proprietes: [
      "Formule (5.9)",
      "Règle de la chaîne, forme simple, formule (5.2)",
    ],
    etapes: [
      {
        texte:
          "**On cherche les composantes de $\\mathbf{z}^{[l]}$ où $W^{[l]}_{ij}$ figure.** Dans (5.9), $W^{[l]}_{ij}$ n'apparaît que pour l'indice de ligne $i$ : la composante $z^{[l]}_{m}$ avec $m\\neq i$ ne le contient pas.",
      },
      {
        latex:
          "\\frac{\\partial z^{[l]}_{i}}{\\partial W^{[l]}_{ij}}=a^{[l-1]}_{j},\\qquad \\frac{\\partial z^{[l]}_{m}}{\\partial W^{[l]}_{ij}}=0\\ \\ (m\\neq i)",
        alt: "La dérivée de la composante i de la somme pondérée par rapport au poids d'indices i et j vaut la composante j de l'activation précédente ; celle de toute autre composante est nulle.",
      },
      {
        texte:
          "**Un seul trajet subsiste**, de sorte que la dépendance est une chaîne sans embranchement et que la forme simple de la règle de la chaîne s'applique telle quelle.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial W^{[l]}_{ij}}=\\frac{\\partial\\ell}{\\partial z^{[l]}_{i}}\\cdot\\frac{\\partial z^{[l]}_{i}}{\\partial W^{[l]}_{ij}}=\\delta^{[l]}_{i}\\,a^{[l-1]}_{j}",
        alt: "La dérivée de la perte par rapport au poids d'indices i et j est le produit de la composante i du signal d'erreur par la composante j de l'activation précédente.",
      },
      {
        texte:
          "**Le biais se traite de même**, avec $\\partial z^{[l]}_{i}/\\partial b^{[l]}_{i}=1$.",
      },
    ],
    resultat: {
      latex:
        "\\frac{\\partial\\ell}{\\partial W^{[l]}_{ij}}=\\delta^{[l]}_{i}\\,a^{[l-1]}_{j},\\qquad\\frac{\\partial\\ell}{\\partial b^{[l]}_{i}}=\\delta^{[l]}_{i}",
      alt: "La dérivée par rapport à un poids est le produit de la composante i du signal d'erreur par la composante j de l'activation précédente, et la dérivée par rapport à un biais est la composante i du signal d'erreur.",
    },
    interpretation:
      "Ces deux formules ont exactement la forme du cas à un neurone par couche, avec deux indices ajoutés. Pour elles, l'affirmation « ce ne sont que quelques indices de plus » est exacte.",
  },
  {
    id: "b-cr9-14",
    type: "titre",
    niveau: 2,
    texte: "Ce qui change",
  },
  {
    id: "b-cr9-15",
    type: "derivation",
    ancre: "lactivation-a-plusieurs-chemins",
    titre: "L'activation, quand plusieurs chemins y mènent",
    hypotheses: [
      "Réseau général (5.7).",
      "$a^{[l-1]}_{j}$ figure dans **toutes** les composantes $z^{[l]}_{1},\\dots,z^{[l]}_{d_{l}}$.",
    ],
    chaine: "a^{[l-1]}_j → z^{[l]}_1, …, z^{[l]}_{d_l} → ℓ",
    proprietes: [
      "Formule (5.9)",
      "Règle de la chaîne, forme à plusieurs chemins, formule (5.3)",
    ],
    etapes: [
      {
        texte:
          "**On compte les trajets.** Dans (5.9), $a^{[l-1]}_{j}$ apparaît pour **chaque** valeur de $i$ : il y a $d_{l}$ chemins de $a^{[l-1]}_{j}$ vers $\\ell$, un par neurone de la couche $l$. Un embranchement existe, donc c'est l'autre forme qui s'applique.",
      },
      {
        latex: "\\frac{\\partial z^{[l]}_{i}}{\\partial a^{[l-1]}_{j}}=W^{[l]}_{ij}",
        alt: "La dérivée de la composante i de la somme pondérée par rapport à la composante j de l'activation précédente vaut le poids d'indices i et j.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial a^{[l-1]}_{j}}=\\sum_{i=1}^{d_{l}}\\frac{\\partial\\ell}{\\partial z^{[l]}_{i}}\\,\\frac{\\partial z^{[l]}_{i}}{\\partial a^{[l-1]}_{j}}=\\sum_{i=1}^{d_{l}}\\delta^{[l]}_{i}\\,W^{[l]}_{ij}",
        alt: "La dérivée de la perte par rapport à la composante j de l'activation précédente est la somme, sur i, du produit de la composante i du signal d'erreur par le poids d'indices i et j.",
        justification: "Formule (5.3), avec $m=d_{l}$ chemins.",
      },
      {
        texte:
          "**On reconnaît cette somme.** À colonne $j$ fixée, sommer sur l'indice de **ligne** $i$ le produit $\\delta^{[l]}_{i}W^{[l]}_{ij}$, c'est calculer la $j$-ième composante de $\\big(W^{[l]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l]}$.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{grad}_{\\mathbf{a}^{[l-1]}}\\,\\ell=\\big(W^{[l]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l]}\\ \\in\\mathbb{R}^{d_{l-1}}",
      alt: "Le gradient de la perte par rapport à l'activation de la couche précédente est la transposée de la matrice de poids multipliée par le signal d'erreur de la couche.",
    },
    interpretation:
      "La transposée du chapitre 4 n'est pas une commodité d'écriture : elle vient de cet embranchement, puisqu'une activation nourrit tous les neurones de la couche suivante et que l'indice sur lequel on somme est donc celui des lignes, non celui des colonnes.",
    limites: [
      "L'égalité vaut composante par composante, et le passage à l'écriture matricielle demande encore de vérifier les dimensions.",
    ],
  },
  {
    id: "b-cr9-15f",
    type: "image",
    ancre: "la-somme-donne-la-transposee",
    src: "/cours/lecon5/l5-fig11-somme.svg",
    largeur: 1380,
    hauteur: 880,
    alt: "Deux grilles de coefficients, chacune entre crochets. La première est la matrice de poids de la couche l, quatre lignes et cinq colonnes, où chaque case porte son coefficient ; sa troisième colonne est en brique, et ses quatre cases portent W un trois, W deux trois, W trois trois et W quatre trois. La seconde est la transposée de la même matrice, cinq lignes et quatre colonnes ; sa troisième ligne est en brique et porte les quatre mêmes coefficients, dans le même ordre, mais couchés au lieu d'être empilés. Un trait joint la colonne en brique de la première grille à la ligne en brique de la seconde.",
    legende:
      "Les quatre coefficients sont les mêmes des deux côtés, et seule leur lecture change : la somme sur $i$ devient un produit matriciel sans qu'aucun nombre ne bouge.",
  },
  {
    id: "b-cr9-17",
    type: "encart",
    ton: "attention",
    titre: "Écart n°3",
    texte:
      "La source affirme que passer à plusieurs neurones par couche n'ajoute que quelques indices. Ce n'est vrai que du poids et du biais. Un terme **change de nature** : $\\partial\\ell/\\partial a^{[l-1]}_{j}$ passe d'un produit à une somme, parce qu'un embranchement apparaît.",
  },
  {
    id: "b-cr9-18",
    type: "titre",
    niveau: 2,
    texte: "La récurrence générale",
  },
  {
    id: "b-cr9-19",
    type: "texte",
    texte:
      "Le procédé se répète : de $\\mathrm{grad}_{\\mathbf{a}^{[l-1]}}\\,\\ell$ on obtient $\\boldsymbol{\\delta}^{[l-1]}$ en multipliant composante par composante par $\\varphi'(z^{[l-1]}_{j})$, puis les deux identités du poids et du biais donnent les dérivées des paramètres de la couche $l-1$.",
  },
  {
    id: "b-cr9-20",
    type: "formule",
    ancre: "recurrence-en-indices",
    latex:
      "\\delta^{[l-1]}_{j}=\\Big(\\sum_{i=1}^{d_{l}}\\delta^{[l]}_{i}\\,W^{[l]}_{ij}\\Big)\\,\\varphi'\\big(z^{[l-1]}_{j}\\big)",
    alt: "La composante j du signal d'erreur de la couche l moins un est le produit de la somme sur i des delta i multipliés par les poids d'indices i et j, par phi prime évaluée en la composante j de la somme pondérée de la couche l moins un.",
    numero: "5.10",
    legende:
      "L'initialisation reste $\\boldsymbol{\\delta}^{[L]}=\\mathbf{a}^{[L]}-\\mathbf{y}$ : seule l'hérédité change de forme quand la couche compte plusieurs neurones.",
  },
  {
    id: "b-cr9-21",
    type: "verification",
    numero: 58,
    enonce:
      "Deux dérivées d'une même couche ne se traitent pas de la même façon.",
    questions: [
      "Pourquoi $\\partial\\ell/\\partial W^{[l]}_{ij}$ reste-t-il un produit alors que $\\partial\\ell/\\partial a^{[l-1]}_{j}$ devient une somme ?",
      "Répondre par la structure des dépendances, non par la forme des formules.",
    ],
  },
  {
    id: "b-cr9-22",
    type: "verification",
    numero: 59,
    enonce:
      "La convention d'indices est celle de la matrice.",
    questions: [
      "$W^{[l]}_{ij}$ relie quel neurone à quel neurone ?",
      "Vérifier sur les dimensions que l'ordre des indices est celui de la matrice.",
    ],
  },
  {
    id: "b-cr9-23",
    type: "texte",
    texte:
      "Le même transport du signal d'erreur s'écrit avec deux indices et une somme dans (5.10), et avec le seul symbole $\\odot$ au chapitre 4.",
  },
];
