import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 5 · La deuxième voie : les poids
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig07-proportion`, où la colonne du quotient est constante sur les
// quatre lignes. Le fait est posé avant d'être expliqué.
//
// Le point le plus important de la page, et le texte le dit : la
// proportionnalité à l'activation n'est PAS une heuristique, c'est une
// identité, et le rapport de deux coefficients d'une même ligne vaut
// exactement le rapport des activations. La mesure 3 le vérifie sur quatre
// lignes, quotient constant à la sixième décimale.
//
// Le produit extérieur est défini ici, avec sa dimension vérifiée, parce que
// la proposition 4 s'écrit avec lui.
//
// La notion de RENDEMENT est renvoyée au chapitre 3, non redéveloppée.
// ─────────────────────────────────────────────────────────────────────────────

export const R05_POIDS: Bloc[] = [
  {
    id: "b-rp5-0",
    type: "texte",
    texte:
      "Un neurone de sortie reçoit cent vingt-huit traits, et chacun porte un nombre à corriger. Deux de ces traits partent de deux neurones cachés dont l'un est très actif et l'autre presque éteint : leurs deux poids reçoivent-ils la même correction ?",
  },
  {
    id: "b-rp5-9f",
    type: "image",
    ancre: "quotient-constant",
    src: "/cours/lecon4/l4-fig07-proportion.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Un tableau de quatre lignes, une par neurone caché retenu, avec pour chacune son indice, son activation, la dérivée de la perte par rapport au poids qui en part, et le quotient des deux. Le neurone quatre-vingt-douze a une activation de un virgule cinq neuf zéro trois et une dérivée de moins un virgule deux cent un mille quatre cent neuf ; le treize, un virgule quatre neuf huit un et moins un virgule cent trente et un mille sept cent soixante ; le soixante et un, un virgule trois neuf cinq zéro et moins un virgule zéro cinquante-trois mille huit cent trente-sept ; le soixante-deux, zéro virgule zéro zéro sept zéro et moins zéro virgule zéro zéro cinq mille deux cent cinquante-cinq. Le quotient vaut moins zéro virgule sept cent cinquante-cinq mille quatre cent soixante et un sur les quatre lignes. Deux barres accompagnent chaque ligne, l'une pour la dérivée, l'autre pour l'activation, et les deux profils sont identiques. En pied, la valeur du signal d'erreur de la classe deux et l'identité qui donne la dérivée.",
    legende:
      "Le quotient de la correction par l'activation ne dépend pas du neurone.",
  },
  {
    id: "b-rp5-9g",
    type: "texte",
    texte:
      "Les quatre neurones sont désignés par un critère, les trois plus actifs et le moins actif parmi ceux qui sont allumés, et non choisis à la main. La colonne de droite est la même sur les quatre lignes, jusqu'à la sixième décimale.\n\nCette constance n'est pas un hasard de mesure : elle est forcée, et le calcul le montre.",
  },
  {
    id: "b-rp5-2",
    type: "titre",
    niveau: 2,
    texte: "Le produit extérieur",
  },
  {
    id: "b-rp5-3",
    type: "definition",
    terme: "Produit extérieur",
    anglais: "outer product",
    texte:
      "Pour $\\mathbf{u}\\in\\mathbb{R}^{m}$ et $\\mathbf{v}\\in\\mathbb{R}^{n}$, la matrice $\\mathbf{u}\\mathbf{v}^{\\mathsf{T}}\\in\\mathcal{M}_{m,n}(\\mathbb{R})$ de coefficient général $(\\mathbf{u}\\mathbf{v}^{\\mathsf{T}})_{ij}=u_{i}v_{j}$. C'est le produit matriciel ordinaire d'une colonne par une ligne : $(m\\times 1)(1\\times n)\\rightarrow m\\times n$.",
  },
  {
    id: "b-rp5-4",
    type: "formule",
    ancre: "produit-exterieur",
    latex:
      "\\mathbf{u}\\mathbf{v}^{\\mathsf{T}}=\\begin{pmatrix}u_{1}v_{1}&\\cdots&u_{1}v_{n}\\\\ \\vdots&&\\vdots\\\\ u_{m}v_{1}&\\cdots&u_{m}v_{n}\\end{pmatrix}\\in\\mathcal{M}_{m,n}(\\mathbb{R}),\\qquad (\\mathbf{u}\\mathbf{v}^{\\mathsf{T}})_{ij}=u_{i}v_{j}",
    alt: "Le produit extérieur de u par v transposé est la matrice à m lignes et n colonnes dont le coefficient de la ligne i et de la colonne j vaut u indice i multiplié par v indice j.",
    numero: "4.6",
    legende:
      "**À ne pas confondre avec $\\mathbf{u}^{\\mathsf{T}}\\mathbf{v}$**, qui est un scalaire quand $m=n$ : l'ordre des facteurs décide de la nature du résultat.",
  },
  {
    id: "b-rp5-5",
    type: "titre",
    niveau: 2,
    texte: "La dérivée par rapport à un poids de sortie",
  },
  {
    id: "b-rp5-6",
    type: "derivation",
    ancre: "proposition-4",
    titre:
      "La dérivée par rapport à un poids est le signal d'erreur multiplié par l'activation d'entrée (proposition 4)",
    hypotheses: [
      "$z_{m}^{[2]}=\\sum_{j}W_{mj}^{[2]}a_{j}^{[1]}+b_{m}^{[2]}$.",
      "$\\mathbf{a}^{[1]}$ est fixé : il ne dépend pas de $W^{[2]}$, puisqu'il est produit avant.",
      "$\\boldsymbol{\\delta}^{[2]}=\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell$.",
    ],
    chaine: "W_{kj}^{[2]} → z_k^{[2]} → a^{[2]} → ℓ",
    proprietes: [
      "Règle de la chaîne à plusieurs chemins, formule (4.4)",
      "Le poids $W_{kj}^{[2]}$ n'apparaît que dans la ligne $k$ de la somme pondérée",
    ],
    etapes: [
      {
        latex:
          "\\frac{\\partial z_{k}^{[2]}}{\\partial W_{kj}^{[2]}}=a_{j}^{[1]},\\qquad \\frac{\\partial z_{m}^{[2]}}{\\partial W_{kj}^{[2]}}=0\\ \\ \\text{pour}\\ m\\neq k",
        alt: "La dérivée partielle de z k de la couche deux par rapport au poids W k j vaut l'activation a j de la couche un, et cette dérivée est nulle pour toute autre composante z m.",
        justification:
          "Dans la somme $\\sum_{j'}W_{kj'}a_{j'}$, un seul terme contient $W_{kj}$, et son facteur est $a_{j}$.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial W_{kj}^{[2]}}=\\sum_{m=0}^{9}\\frac{\\partial\\ell}{\\partial z_{m}^{[2]}}\\,\\frac{\\partial z_{m}^{[2]}}{\\partial W_{kj}^{[2]}}=\\delta_{k}^{[2]}\\,a_{j}^{[1]}",
        alt: "La dérivée partielle de la perte par rapport au poids W k j de la couche deux vaut la somme sur m des produits des deux dérivées partielles, dont un seul terme survit, et elle vaut donc delta k de la couche deux multiplié par a j de la couche un.",
      },
      {
        texte:
          "**On rassemble les $10\\times 128$ égalités en une seule.** Le coefficient $(k,j)$ de la matrice recherchée est le produit de la $k$-ième composante de $\\boldsymbol{\\delta}^{[2]}$ par la $j$-ième composante de $\\mathbf{a}^{[1]}$, ce qui est la définition du produit extérieur.",
      },
      {
        latex:
          "\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}\\big(\\mathbf{a}^{[1]}\\big)^{\\mathsf{T}},\\qquad (10\\times 1)(1\\times 128)=10\\times 128",
        alt: "Le gradient de la perte par rapport à la matrice W de la couche deux est le produit extérieur du signal d'erreur de la couche deux par le transposé du vecteur des activations de la couche un. Les dimensions sont dix par un multiplié par un par cent vingt-huit, ce qui donne dix par cent vingt-huit.",
        justification:
          "Vérification des dimensions : le résultat a exactement la forme de $W^{[2]}$, ce qui est nécessaire pour que $W^{[2]}-\\eta\\,\\mathrm{grad}_{W^{[2]}}\\,\\ell$ ait un sens.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}\\big(\\mathbf{a}^{[1]}\\big)^{\\mathsf{T}}\\ \\in\\mathcal{M}_{10,128}(\\mathbb{R})",
      alt: "Le gradient de la perte par rapport à W de la couche deux est le produit extérieur de delta de la couche deux par a de la couche un transposé, une matrice à dix lignes et cent vingt-huit colonnes.",
    },
    interpretation:
      "**À ligne $k$ fixée, $\\partial\\ell/\\partial W_{kj}$ est exactement proportionnel à $a_{j}$, de coefficient $\\delta_{k}$**, et le rapport entre deux coefficients d'une même ligne vaut donc exactement le rapport des deux activations correspondantes. « Ajuster les poids proportionnellement aux activations » n'est pas une heuristique qu'on adopterait par analogie : c'est ce que dit l'identité, et la mesure 3 le vérifie à la sixième décimale.",
    limites: [
      "La proportionnalité vaut **à ligne fixée** : entre deux lignes différentes le coefficient $\\delta_{k}$ change, et les tailles ne se comparent plus par les seules activations.",
      "L'identité ne dit rien du **meilleur rendement** d'un ajustement, c'est-à-dire de la baisse de perte obtenue par unité de déplacement, une notion du chapitre 3, page 10, qui n'est pas redéveloppée ici.",
    ],
  },
  {
    id: "b-rp5-8",
    type: "titre",
    niveau: 2,
    texte: "La proportionnalité, sur les nombres",
  },
  {
    id: "b-rp5-9",
    type: "sortie",
    ancre: "mesure-3-proportionnalite",
    titre:
      "Quatre poids d'une même ligne · cours/lecon4/mesures.py, mesure 3",
    texte:
      "  -- Proportionnalité à l'activation, ligne k = 2 (delta_k < 0) ------------\n      j       a_j        d l / d W_kj      quotient\n      92      1.5903     -1.201409       -0.755461\n      13      1.4981     -1.131760       -0.755461\n      61      1.3950     -1.053837       -0.755461\n      62      0.0070     -0.005255       -0.755461\n\n  delta_2                                      -0.755461\n  rapport de la plus grande à la plus petite    228.6",
    lecture: [
      "Le quotient $\\big(\\partial\\ell/\\partial W_{2j}\\big)/a_{j}$ vaut $-0{,}755461$ pour les quatre neurones, à la sixième décimale : c'est $\\delta_{2}$, et c'est la proposition 4 lue de droite à gauche.",
      "Le poids qui part du neurone le plus actif reçoit une correction **$228{,}6$ fois** plus grande que celui du neurone le moins actif, et ce rapport est celui de leurs deux activations, et rien d'autre.",
    ],
  },
  {
    id: "b-rp5-10",
    type: "animation",
    ancre: "proportionnel-a-lactivation",
    animationId: "proportionnel-a-lactivation",
    legende:
      "Les traits qui arrivent sur le neurone de sortie $2$ s'épaississent en proportion de l'activation d'où ils partent.",
  },
  {
    id: "b-rp5-11",
    type: "sortie",
    ancre: "mesure-3-ligne-positive",
    titre:
      "La même ligne, pour un neurone qui n'est pas celui de la classe · mesure 3",
    texte:
      "  -- Le même tableau pour une ligne k = 0 (delta_k > 0) --------------------\n      j       a_j        d l / d W_kj      quotient\n      92      1.5903     +0.217237       +0.136601\n      13      1.4981     +0.204643       +0.136601\n      61      1.3950     +0.190553       +0.136601\n      62      0.0070     +0.000950       +0.136601\n\n  delta_0                                      +0.136601",
    lecture: [
      "Tous les signes sont inversés, et une seule quantité a changé : $\\delta_{0}=+0{,}1366$ au lieu de $\\delta_{2}=-0{,}7555$.",
      "Le quotient reste constant sur les quatre lignes et vaut $\\delta_{0}$, donc la structure de la proposition 4 ne dépend pas du signe.",
      "Les corrections de cette ligne sont **cinq fois et demie plus petites** que celles de la ligne $2$, dans le rapport $0{,}1366/0{,}7555$ : ce sont les mêmes activations, avec un autre signal d'erreur.",
    ],
  },
  {
    id: "b-rp5-12",
    type: "encart",
    ton: "note",
    titre: "Un neurone caché éteint ne fait rien bouger",
    texte:
      "Corollaire immédiat de la proposition 4 : si $a_{j}^{[1]}=0$, alors $\\partial\\ell/\\partial W_{kj}^{[2]}=\\delta_{k}\\cdot 0=0$ pour les **dix** valeurs de $k$. Un neurone caché éteint ne fait bouger aucun des dix poids qui partent de lui, quel que soit le signal d'erreur, et sur l'exemple de travail $71$ neurones sont dans ce cas, ce qui annule $710$ des $1\\,280$ coefficients de $\\mathrm{grad}_{W^{[2]}}\\,\\ell$.",
  },
  {
    id: "b-rp5-13",
    type: "verification",
    numero: 38,
    enonce:
      "Deux neurones cachés ont pour activations $2{,}0$ et $0{,}25$, et sont reliés au même neurone de sortie $k$.",
    questions: [
      "Quel est le rapport des corrections apportées aux deux poids ? Justifier par la proposition 4, sans calculer les dérivées.",
      "Ce rapport change-t-il si l'on remplace le neurone de sortie $k$ par un autre ?",
    ],
  },
  {
    id: "b-rp5-14",
    type: "verification",
    numero: 39,
    enonce:
      "Un neurone caché $j$ est éteint pour l'exemple courant : $z_{j}^{[1]}\\leq 0$, donc $a_{j}^{[1]}=0$.",
    questions: [
      "Que valent les dix dérivées $\\partial\\ell/\\partial W_{kj}^{[2]}$, $k\\in[\\![0,9]\\!]$, et pourquoi ?",
      "Le corollaire dit que $710$ coefficients de $\\mathrm{grad}_{W^{[2]}}\\,\\ell$ sont nuls sur l'exemple de travail. Retrouver ce nombre à partir de la mesure 1.",
    ],
  },
];
