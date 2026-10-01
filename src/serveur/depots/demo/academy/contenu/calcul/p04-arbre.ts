import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 4 · L'arbre des dépendances
//
// Ouverture règle 26 : la question du chemin, puis l5-fig04-arbre.svg
// (1380 × 1240, la figure centrale du chapitre), puis le cadre.
//
// L'arbre construit, puis prolongé vers le haut : c'est ce prolongement qui
// produira la récurrence, et le texte le dit sans nommer la récurrence avant
// la page 8.
//
// La petite poussée est employée, PUIS corrigée : ∂ℓ/∂w n'est pas un quotient
// de deux nombres, c'est une limite. Renvoi au chapitre 3.
//
// DEUX FIGURES FIXES, ET DEUX SEULEMENT, règle 17. l5-fig02-propagation part
// en page 2, l5-fig03-perte en page 3, l5-fig07-trois-rapports en page 6 : ces
// trois pages les servent, celle-ci ne les reprend pas.
//
// La décomposition en trois rapports. Mesure 1, propagation avant.
// 🧪 n°50 et n°51.
//
// La dérivation s'écrit en L alors que le réseau de la page a trois couches :
// une phrase, avant elle, dit que L vaut 3 ici.
//
// Le bloc RESULTAT recopiait mot pour mot la dernière étape, règle 12. L'étape
// dit maintenant comment on remonte la chaîne, et la formule ne paraît qu'une
// fois, dans le résultat.
// ─────────────────────────────────────────────────────────────────────────────

export const C04_ARBRE: Bloc[] = [
  {
    id: "b-cr4-0",
    type: "texte",
    texte:
      "Le réseau à un neurone par couche tient en six paramètres, et la perte finit par dépendre des six, mais ni de la même manière ni par le même trajet. De quoi la perte dépend-elle, exactement, et par quel chemin ?",
  },
  {
    id: "b-cr4-0f",
    type: "image",
    ancre: "arbre-dessine",
    src: "/cours/lecon5/l5-fig04-arbre.svg",
    largeur: 1380,
    hauteur: 1240,
    alt: "Un arbre lu de haut en bas. Au sommet, la perte ell, qu'une branche latérale relie à la cible y. Sous elle vient l'activation a exposant trois, puis la somme pondérée z exposant trois. De z exposant trois partent trois branches : à gauche le poids w exposant trois, au centre l'activation précédente a exposant deux, à droite le biais b exposant trois. Le même motif se répète sous a exposant deux, avec z exposant deux, puis w exposant deux, a exposant un et b exposant deux ; il se répète une dernière fois sous a exposant un, avec z exposant un, puis w exposant un, l'entrée x et b exposant un. Les paramètres sont encadrés de brique, les données de gris, les quantités calculées d'encre. Un trait de brique épais remonte de w exposant trois jusqu'à la perte en passant par z exposant trois puis a exposant trois, et c'est le seul trajet qui relie ces deux quantités.",
    legende:
      "Une dérivée partielle se lit sur cet arbre en le remontant à l'envers, du paramètre vers la perte. Un paramètre qu'un seul trajet relie à la perte donne un produit ; il en faudrait une somme s'il y en avait deux.",
  },
  {
    id: "b-cr4-0c",
    type: "texte",
    texte:
      "Chacun des six paramètres atteint la perte par un trajet, et ce trajet traverse une somme pondérée puis une activation avant d'arriver. Écrire ce trajet, puis le parcourir à l'envers avec la règle de la chaîne, suffit pour obtenir la dérivée de la perte par rapport à n'importe lequel d'entre eux.",
  },
  {
    id: "b-cr4-1",
    type: "titre",
    niveau: 2,
    texte: "Ce dont la perte dépend",
  },
  {
    id: "b-cr4-2",
    type: "texte",
    texte:
      "On remonte de chaque quantité vers celles qui la déterminent directement, et l'on s'arrête dès qu'on tombe sur un paramètre ou sur une donnée. Ce qu'on obtient est un arbre et non un graphe quelconque, parce qu'aucune quantité de ce réseau n'est employée deux fois : avec un seul neurone par couche, chaque activation n'alimente qu'une somme pondérée.",
  },
  {
    id: "b-cr4-3",
    type: "tableau",
    ancre: "arbre-en-tableau",
    cleEnTete: true,
    entetes: ["Quantité", "Déterminée directement par"],
    lignes: [
      ["$\\ell$", "$a^{[3]}$, $y$"],
      ["$a^{[3]}$", "$z^{[3]}$"],
      ["$z^{[3]}$", "$w^{[3]}$, $a^{[2]}$, $b^{[3]}$"],
      ["$a^{[2]}$", "$z^{[2]}$"],
      ["$z^{[2]}$", "$w^{[2]}$, $a^{[1]}$, $b^{[2]}$"],
      ["$a^{[1]}$", "$z^{[1]}$"],
      ["$z^{[1]}$", "$w^{[1]}$, $x$, $b^{[1]}$"],
    ],
  },
  {
    id: "b-cr4-4",
    type: "animation",
    ancre: "arbre-des-dependances",
    animationId: "larbre-des-dependances",
    legende:
      "L'arbre de ce dont la perte dépend, poussé depuis la perte une génération à la fois, jusqu'à ses sept feuilles.",
  },
  {
    id: "b-cr4-5",
    type: "texte",
    texte:
      "Les trois dernières lignes du tableau reprennent les trois précédentes avec l'exposant diminué de un, si bien que tout ce qu'on établira sur la couche $3$ vaudra à l'identique sur la couche $2$, puis sur la couche $1$.",
  },
  {
    id: "b-cr4-6",
    type: "titre",
    niveau: 2,
    texte: "Les valeurs, sur un exemple",
  },
  {
    id: "b-cr4-7",
    type: "texte",
    texte:
      "Sept valeurs figées, aucun tirage : $x=1{,}0$, $w^{[1]}=0{,}8$, $b^{[1]}=0{,}2$, $w^{[2]}=1{,}5$, $b^{[2]}=-0{,}4$, $w^{[3]}=2{,}0$, $b^{[3]}=-0{,}5$, et la cible $y=1$.",
  },
  {
    id: "b-cr4-8",
    type: "sortie",
    ancre: "mesure-1-avant",
    titre: "Mesure 1 · la propagation avant",
    texte: `  -- les valeurs figées ----------------------------------------------------
  x  = 1.000000   y  = 1
  w1 = 0.800000   b1 = 0.200000
  w2 = 1.500000   b2 = -0.400000
  w3 = 2.000000   b3 = -0.500000

  -- la propagation avant --------------------------------------------------
  z1 = 1.000000   a1 = 1.000000
  z2 = 1.100000   a2 = 1.100000
  z3 = 1.700000   a3 = 0.845535
  perte = 0.167786`,
    lecture: [
      "$z^{[1]}=0{,}8\\times 1+0{,}2=1{,}0$, et $\\mathrm{ReLU}$ le laisse passer : $a^{[1]}=1{,}0$.",
      "$z^{[2]}=1{,}5\\times 1{,}0-0{,}4=1{,}1$, positif lui aussi : $a^{[2]}=1{,}1$.",
      "$z^{[3]}=2{,}0\\times 1{,}1-0{,}5=1{,}7$, et $\\sigma(1{,}7)=0{,}845535$.",
      "La cible vaut $1$ ; la perte $-\\ln(0{,}845535)=0{,}167786$.",
    ],
  },
  {
    id: "b-cr4-8a",
    type: "animation",
    ancre: "le-reseau-minuscule",
    animationId: "le-reseau-minuscule",
    legende:
      "Le réseau $1 \to 1 \to 1 \to 1$ et ses sept valeurs figées : il se remplit poste par poste, de l'entrée jusqu'à la perte $0{,}167786$.",
  },
  {
    id: "b-cr4-9",
    type: "titre",
    niveau: 2,
    texte: "Ce que mesure une dérivée partielle",
  },
  {
    id: "b-cr4-10",
    type: "texte",
    texte:
      "Pousser $w^{[3]}$ d'une petite quantité déplace $z^{[3]}$, donc $a^{[3]}$, donc $\\ell$. Le rapport de la variation de $\\ell$ à celle de $w^{[3]}$ mesure la sensibilité de la perte à ce poids.",
  },
  {
    id: "b-cr4-10f",
    type: "image",
    ancre: "trois-axes-gradues",
    src: "/cours/lecon5/l5-fig06-droites.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Trois axes horizontaux gradués, l'un sous l'autre. Le premier porte w exposant trois, le deuxième z exposant trois, le troisième la perte. Sur chacun, un point d'encre marque la valeur courante : 2 sur le premier, 1,7 sur le deuxième, 0,167786 sur le troisième. Au-dessus de chaque axe, une flèche de brique part de ce point et mesure le déplacement produit par une même poussée. Sur le premier axe elle est notée h et donne l'échelle. Sur le deuxième elle va dans le même sens et vaut 1,1 fois h. Sur le troisième elle est plus courte, elle pointe vers la gauche, et elle vaut moins 0,169912 fois h.",
    legende:
      "Les deux déplacements sortent de la mesure 1 : $\\partial z^{[3]}/\\partial w^{[3]}=1{,}1$ et $\\partial\\ell/\\partial w^{[3]}=-0{,}169912$. Un rapport compare deux déplacements portés par deux axes différents, et n'a donc pas d'unité commune ; son signe, lui, se lit sans convention : la perte baisse quand ce poids monte.",
  },
  {
    id: "b-cr4-11",
    type: "animation",
    ancre: "trois-droites",
    animationId: "trois-droites-graduees",
    legende:
      "Une poussée sur le poids de la troisième couche arrive sur sa somme pondérée, puis sur la perte ; divisée par dix, elle laisse les deux rapports inchangés.",
  },
  {
    id: "b-cr4-12",
    type: "encart",
    ton: "attention",
    titre: "Ce n'est pas un quotient",
    texte:
      "« Le rapport d'une petite variation du coût à une petite variation du poids » est une image. $\\partial\\ell/\\partial w$ n'est pas le quotient de deux nombres : c'est la **limite** du quotient $\\big[\\ell(w+h)-\\ell(w)\\big]/h$ quand $h$ tend vers $0$, définition du chapitre 3, page 8. Le rapport dépend de $h$ ; sa limite, non.",
  },
  {
    id: "b-cr4-14",
    type: "titre",
    niveau: 2,
    texte: "La première décomposition",
  },
  {
    id: "b-cr4-14b",
    type: "texte",
    texte:
      "Le calcul s'écrit pour la dernière couche, notée $L$, et sur ce réseau à trois couches $L$ vaut $3$.",
  },
  {
    id: "b-cr4-15",
    type: "derivation",
    ancre: "decomposition-en-trois-rapports",
    titre: "Ce dont dépend la perte, décomposé en trois rapports",
    hypotheses: [
      "Le réseau a un neurone par couche : $z^{[L]}=w^{[L]}a^{[L-1]}+b^{[L]}$ est un scalaire.",
      "$\\varphi$ et $\\ell$ sont dérivables aux points considérés.",
      "$w^{[L]}$ n'influence $\\ell$ **qu'à travers** $z^{[L]}$ : la dépendance est une chaîne sans embranchement.",
    ],
    depart: {
      latex: "\\ell=\\ell\\big(a^{[L]}(z^{[L]}(w^{[L]}))\\big)",
      alt: "La perte s'écrit comme la composée de trois fonctions d'une variable, la perte de l'activation, l'activation de la somme pondérée, et la somme pondérée du poids.",
    },
    chaine: "w^{[L]} → z^{[L]} → a^{[L]} → ℓ",
    proprietes: [
      "Règle de la chaîne, forme simple, formule (5.2)",
      "Un neurone par couche : chaque flèche de la chaîne porte une fonction d'une seule variable",
    ],
    etapes: [
      {
        texte:
          "**On lit la chaîne sur l'arbre.** Depuis $w^{[L]}$, il n'existe qu'un seul trajet vers $\\ell$, et il passe par $z^{[L]}$ puis par $a^{[L]}$. Aucune autre quantité ne dépend de $w^{[L]}$.",
      },
      {
        texte:
          "**L'hypothèse d'absence d'embranchement est vérifiée**, et elle vient de ce que la couche $L$ n'a qu'un neurone : $w^{[L]}$ n'entre que dans une seule somme pondérée.",
        justification:
          "Dès que la couche compte plusieurs neurones, $w^{[L]}$ entre dans plusieurs sommes pondérées et cette lecture change.",
      },
      {
        texte:
          "**On remonte la chaîne maillon par maillon.** La forme simple s'applique d'abord à $\\ell$ vue comme fonction de $a^{[L]}$, puis à $a^{[L]}$ vue comme fonction de $z^{[L]}$, et les facteurs obtenus se multiplient.",
        justification:
          "Formule (5.2) appliquée deux fois à la composée de trois fonctions.",
      },
    ],
    resultat: {
      latex:
        "\\frac{\\partial\\ell}{\\partial w^{[L]}}=\\frac{\\partial\\ell}{\\partial a^{[L]}}\\cdot\\frac{\\partial a^{[L]}}{\\partial z^{[L]}}\\cdot\\frac{\\partial z^{[L]}}{\\partial w^{[L]}}",
      alt: "La dérivée de la perte par rapport au dernier poids est le produit des trois dérivées élémentaires prises le long de la chaîne.",
    },
    interpretation:
      "Trois facteurs, et chacun sort d'une équation différente du réseau : le troisième de la somme pondérée, le deuxième de l'activation, le premier de la perte.",
    limites: [
      "L'égalité repose sur l'absence d'embranchement, donc sur le fait qu'il n'y a qu'un neurone par couche.",
      "Elle ne dit rien des couches antérieures : le même produit ne donne pas $\\partial\\ell/\\partial w^{[1]}$.",
    ],
  },
  {
    id: "b-cr4-16",
    type: "verification",
    numero: 50,
    enonce:
      "L'arbre des dépendances du réseau minuscule est celui du tableau ci-dessus.",
    questions: [
      "Énumérer tout ce dont $z^{[3]}$ dépend directement.",
      "Énumérer tout ce dont $z^{[3]}$ dépend indirectement.",
    ],
  },
  {
    id: "b-cr4-17",
    type: "verification",
    numero: 51,
    enonce:
      "La sensibilité de la perte à un poids se décrit par l'image d'une petite poussée.",
    questions: [
      "Pourquoi $\\partial\\ell/\\partial w$ n'est-il pas le quotient de deux nombres ?",
      "Que devient le quotient $\\big[\\ell(w+h)-\\ell(w)\\big]/h$ quand on divise $h$ par dix, et pourquoi cela justifie-t-il l'image ?",
    ],
  },
  {
    id: "b-cr4-18",
    type: "texte",
    texte:
      "La décomposition en trois rapports ne devient un nombre qu'une fois ses trois facteurs évalués aux valeurs que la propagation avant a produites, et c'est pour cela qu'une passe avant précède toujours le calcul du gradient.",
  },
];
