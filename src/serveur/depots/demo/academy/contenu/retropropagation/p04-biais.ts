import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 4 · La première voie : le biais
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig06-trois-voies`, qui pose les trois prises d'un coup. Le texte dit
// ensuite dans quel ordre il les traite et pourquoi : le biais est la seule
// dont l'effet ne passe par rien.
//
// Proposition 3, démontrée par la règle de la chaîne à plusieurs chemins, dont
// un seul subsiste. Mesure 3, première ligne. 🧪 n°36 et n°37.
// ─────────────────────────────────────────────────────────────────────────────

export const R04_BIAIS: Bloc[] = [
  {
    id: "b-rp4-0",
    type: "texte",
    texte:
      "La sortie dit dans quel sens chacune de ses dix sommes pondérées doit bouger, et aucune de ces dix sommes ne se règle, puisque ce sont des résultats. Sur quoi pose-t-on la main pour les faire bouger tout de même ?",
  },
  {
    id: "b-rp4-3f",
    type: "image",
    ancre: "les-trois-voies",
    src: "/cours/lecon4/l4-fig06-trois-voies.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Trois cadres empilés à gauche, chacun relié par une flèche à un même rond posé à droite, qui porte la somme pondérée du neurone de sortie de la classe deux. Le premier cadre, en brique, porte le biais de ce neurone et la valeur de la dérivée de la perte par rapport à lui, moins zéro virgule sept cent cinquante-cinq mille quatre cent soixante et un. Le deuxième, en brique aussi, porte le poids venant du quatre-vingt-douzième neurone caché et la valeur de sa dérivée, moins un virgule deux cent un mille quatre cent neuf. Le troisième, en gris, porte l'activation précédente et la valeur de sa dérivée, plus zéro virgule zéro zéro six mille quatre cent deux. En pied, deux mentions : les deux premières se règlent, la troisième ne se règle pas.",
    legende:
      "Deux des trois prises sont des paramètres ; la troisième est un résultat.",
  },
  {
    id: "b-rp4-3g",
    type: "texte",
    texte:
      "Trois sortes de quantités entrent dans la somme pondérée d'un neurone de sortie, et le cadre en montre une de chaque, avec la valeur mesurée de sa dérivée.\n\nChacune des trois se démontre à son tour. Les deux premières s'appliquent ; la troisième se lit, mais on n'a rien à quoi l'appliquer, et c'est d'elle que naît tout le reste du chapitre.",
  },
  {
    id: "b-rp4-2",
    type: "titre",
    niveau: 2,
    texte: "Trois voies vers une somme pondérée",
  },
  {
    id: "b-rp4-3",
    type: "formule",
    ancre: "somme-ponderee",
    latex:
      "z_{k}^{[2]}=\\sum_{j=1}^{128}W_{kj}^{[2]}\\,a_{j}^{[1]}+b_{k}^{[2]}",
    alt: "z indice k de la couche deux vaut la somme, pour j allant de un à cent vingt-huit, du produit du poids W k j de la couche deux par l'activation a j de la couche un, plus le biais b k de la couche deux.",
    numero: "4.5",
    legende:
      "Trois sortes de quantités y figurent : un biais, cent vingt-huit poids, cent vingt-huit activations.",
  },
  {
    id: "b-rp4-4",
    type: "tableau",
    ancre: "les-trois-voies",
    cleEnTete: true,
    entetes: ["Voie", "Statut", "Effet sur $z_{k}$ d'une variation de $1$"],
    lignes: [
      ["$b_{k}^{[2]}$", "Paramètre", "$1$, quelles que soient les activations"],
      ["$W_{kj}^{[2]}$", "Paramètre", "$a_{j}^{[1]}$, qui dépend de l'exemple"],
      [
        "$a_{j}^{[1]}$",
        "**Pas un paramètre**",
        "$W_{kj}^{[2]}$, mais rien ne permet de la faire varier directement",
      ],
    ],
  },
  {
    id: "b-rp4-5",
    type: "texte",
    texte:
      "Le biais vient en premier parce que son effet **ne passe par rien** : il s'ajoute à la somme, et le facteur qui le multiplie vaut $1$. Les poids viennent ensuite parce que leur effet passe par une activation, et les activations en dernier parce qu'elles ne sont pas des paramètres.",
  },
  {
    id: "b-rp4-7",
    type: "titre",
    niveau: 2,
    texte: "La dérivée par rapport à un biais de sortie",
  },
  {
    id: "b-rp4-8",
    type: "derivation",
    ancre: "proposition-3",
    titre:
      "La dérivée par rapport à un biais de sortie est le signal d'erreur lui-même (proposition 3)",
    hypotheses: [
      "$z_{m}^{[2]}=\\sum_{j}W_{mj}^{[2]}a_{j}^{[1]}+b_{m}^{[2]}$ pour tout $m\\in[\\![0,9]\\!]$.",
      "$\\boldsymbol{\\delta}^{[2]}=\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell$, définition page 3.",
      "$\\ell$ ne dépend de $b_{k}^{[2]}$ qu'à travers $\\mathbf{z}^{[2]}$.",
    ],
    chaine: "b_k^{[2]} → z^{[2]} → a^{[2]} → ℓ",
    proprietes: [
      "Règle de la chaîne à plusieurs chemins, formule (4.4)",
      "Dérivation d'une somme dont un seul terme dépend de la variable",
    ],
    etapes: [
      {
        texte:
          "**On dérive la somme pondérée.** Dans $z_{m}^{[2]}$, le biais $b_{k}^{[2]}$ n'apparaît que si $m=k$, et il y apparaît avec le coefficient $1$.",
      },
      {
        latex:
          "\\frac{\\partial z_{k}^{[2]}}{\\partial b_{k}^{[2]}}=1,\\qquad \\frac{\\partial z_{m}^{[2]}}{\\partial b_{k}^{[2]}}=0\\ \\ \\text{pour}\\ m\\neq k",
        alt: "La dérivée partielle de z k de la couche deux par rapport à b k de la couche deux vaut un, et la dérivée partielle de z m par rapport à b k vaut zéro dès que m est différent de k.",
      },
      {
        texte:
          "**On applique la règle de la chaîne à plusieurs chemins.** $b_{k}^{[2]}$ pourrait a priori influencer $\\ell$ à travers les dix composantes de $\\mathbf{z}^{[2]}$, et la ligne précédente montre que neuf de ces dix chemins ont une dérivée nulle.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial b_{k}^{[2]}}=\\sum_{m=0}^{9}\\frac{\\partial\\ell}{\\partial z_{m}^{[2]}}\\,\\frac{\\partial z_{m}^{[2]}}{\\partial b_{k}^{[2]}}=\\frac{\\partial\\ell}{\\partial z_{k}^{[2]}}\\cdot 1=\\delta_{k}^{[2]}",
        alt: "La dérivée partielle de la perte par rapport à b k de la couche deux est la somme sur m des produits de la dérivée partielle de la perte par rapport à z m par la dérivée partielle de z m par rapport à b k. Un seul terme survit, et il vaut delta k de la couche deux.",
        justification:
          "Neuf des dix chemins portent un facteur nul ; il ne reste que le chemin $m=k$, de facteur $1$.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{grad}_{\\mathbf{b}^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}\\ \\in\\mathbb{R}^{10}",
      alt: "Le gradient de la perte par rapport au vecteur des biais de la couche deux est exactement le signal d'erreur de cette couche, un vecteur de dix composantes.",
    },
    interpretation:
      "Cette dérivée **ne dépend d'aucune activation**, et c'est en ce sens précis que le biais est la voie la plus simple : son effet sur la somme pondérée est constant, il ne passe par rien, et il est le même pour tous les exemples à signal d'erreur égal. Le gradient des biais de sortie n'est pas seulement calculable à partir de $\\boldsymbol{\\delta}^{[2]}$, il **est** $\\boldsymbol{\\delta}^{[2]}$.",
    limites: [
      "La proposition porte sur les biais de la **couche de sortie**. Pour $\\mathbf{b}^{[1]}$ le même argument s'applique, mais avec $\\boldsymbol{\\delta}^{[1]}$, qu'on ne sait pas encore calculer.",
    ],
  },
  {
    id: "b-rp4-9",
    type: "sortie",
    ancre: "mesure-3-biais",
    titre:
      "La dérivée par rapport au biais, mesurée · cours/lecon4/mesures.py, mesure 3",
    texte:
      "  -- Le biais, et un poids -------------------------------------------------\n  dérivée par rapport au biais b^[2]_2          -0.755461\n  dérivée par rapport au poids W^[2]_(2,92)       -1.201409\n  activation a^[1]_92                          1.5903\n  contrôle de l'identité delta_2 x a_92         -1.201409\n  écart entre la dérivée et le produit          0.000e+00",
    lecture: [
      "$\\partial\\ell/\\partial b_{2}^{[2]}=-0{,}755461$, c'est-à-dire exactement le $\\delta_{2}^{[2]}$ lu à la mesure 1, et la proposition 3 se lit ainsi sur une seule ligne.",
      "Le nombre est **négatif**, donc augmenter le biais du neurone de la classe $2$ fait baisser la perte, et le pas de descente $-\\eta\\,\\partial\\ell/\\partial b_{2}$ est positif, ce qui fait monter le biais.",
      "Pour les neuf autres neurones $\\delta_{k}>0$, la dérivée est positive, le pas est négatif et le biais descend. Aucune intuition n'est nécessaire : le signe suffit.",
    ],
  },
  {
    id: "b-rp4-10",
    type: "animation",
    ancre: "le-biais-ne-passe-par-rien",
    animationId: "le-biais-ne-passe-par-rien",
    legende:
      "Le biais du neurone de sortie $2$ est poussé, et la sortie suit — de la même quantité, sans facteur.",
  },
  {
    id: "b-rp4-11",
    type: "verification",
    numero: 36,
    enonce:
      "La mesure 1 donne $\\delta_{2}=-0{,}7555$ et $\\delta_{k}>0$ pour les neuf autres classes. Le pas de descente s'écrit $b_{k}\\leftarrow b_{k}-\\eta\\,\\partial\\ell/\\partial b_{k}$ avec $\\eta>0$.",
    questions: [
      "Dans quel sens le biais du neurone de la vraie classe est-il poussé, et dans quel sens ceux des neuf autres ? Justifier par le signe de la dérivée, non par l'intuition.",
      "De combien le biais $b_{2}^{[2]}$ bouge-t-il pour $\\eta=0{,}5$ ?",
    ],
  },
  {
    id: "b-rp4-12",
    type: "verification",
    numero: 37,
    enonce:
      "La proposition 3 donne $\\partial\\ell/\\partial b_{k}^{[2]}=\\delta_{k}^{[2]}$, sans qu'aucune activation n'apparaisse.",
    questions: [
      "Pourquoi la dérivée par rapport à un biais ne dépend-elle d'aucune activation, alors que celle par rapport à un poids en dépend ? Répondre en dérivant la formule (4.5).",
      "Deux exemples différents donnent-ils la même dérivée par rapport à $b_{2}^{[2]}$ ? Et par rapport à $W_{2,92}^{[2]}$ ?",
    ],
  },
];
