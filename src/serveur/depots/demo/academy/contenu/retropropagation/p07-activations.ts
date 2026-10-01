import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 7 · La troisième voie : les activations
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig09-signes`, où le sens demandé s'inverse avec le signe du poids alors
// que le signal d'erreur ne bouge pas.
//
// Proposition 5, démontrée. Le sens demandé se lit sur le SIGNE du poids, et
// la mesure 3 donne quatre lignes où on le lit.
//
// Puis LE POINT QUI PRODUIT TOUT LE RESTE : on ne peut pas changer une
// activation, elle n'est pas un paramètre. On ne peut que noter la correction
// souhaitée et la reporter sur ce qui la détermine. C'est de là que vient le
// mot « propagation », et le texte le dit ici.
// ─────────────────────────────────────────────────────────────────────────────

export const R07_ACTIVATIONS: Bloc[] = [
  {
    id: "b-rp7-0",
    type: "texte",
    texte:
      "Il reste les cent mille coefficients de la première couche, et rien de ce qui précède ne les atteint. La troisième prise, l'activation d'avant, n'est pas un réglage : que peut-on en tirer tout de même ?",
  },
  {
    id: "b-rp7-4f",
    type: "image",
    ancre: "le-signe-du-poids",
    src: "/cours/lecon4/l4-fig09-signes.svg",
    largeur: 1380,
    hauteur: 790,
    alt: "Un tableau de quatre lignes, une par neurone caché. Chacune donne le poids qui relie ce neurone au neurone de sortie de la classe deux, le produit de ce poids par le signal d'erreur, et le sens demandé. Les deux poids positifs, plus zéro virgule deux trois six trois et plus zéro virgule zéro six quatre zéro, donnent des produits négatifs et demandent à l'activation de monter ; les deux poids négatifs, moins zéro virgule zéro quatre deux zéro et moins zéro virgule zéro deux trois deux, donnent des produits positifs et demandent à l'activation de descendre. Une flèche verticale indique le sens sur chaque ligne. En pied, le signal d'erreur vaut moins zéro virgule sept cent cinquante-cinq mille quatre cent soixante et un sur les quatre lignes, et deux mentions disent qu'il est le même partout et que seul le poids change.",
    legende:
      "Un poids positif transmet la demande telle quelle ; un poids négatif la retourne.",
  },
  {
    id: "b-rp7-4g",
    type: "texte",
    texte:
      "Une seule quantité varie d'une ligne à l'autre, le poids, et c'est elle qui décide du sens : le signal d'erreur, lui, est le même sur les quatre lignes puisqu'il s'agit du même neurone de sortie.\n\nLa proposition qui suit dit d'où vient ce signe, et pourquoi les tailles suivent le même rapport que les poids. Ce qu'elle ouvre, ce sont les $100\\,480$ coefficients de la première couche, que rien n'a encore atteints.",
  },
  {
    id: "b-rp7-2",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'un seul neurone de sortie demande à une activation",
  },
  {
    id: "b-rp7-3",
    type: "derivation",
    ancre: "proposition-5",
    titre:
      "Un neurone de sortie contribue à $\\partial\\ell/\\partial a_{j}^{[1]}$ par $\\delta_{k}^{[2]}W_{kj}^{[2]}$ (proposition 5)",
    hypotheses: [
      "$z_{k}^{[2]}=\\sum_{j}W_{kj}^{[2]}a_{j}^{[1]}+b_{k}^{[2]}$.",
      "$W^{[2]}$ est fixé : les poids ne dépendent pas des activations.",
      "$\\boldsymbol{\\delta}^{[2]}=\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell$.",
    ],
    chaine: "a_j^{[1]} → z_k^{[2]} → a^{[2]} → ℓ",
    proprietes: [
      "Dérivation d'une somme dont un seul terme contient $a_{j}$",
      "Règle de la chaîne, forme simple, sur le chemin qui passe par $z_{k}$",
    ],
    etapes: [
      {
        latex: "\\frac{\\partial z_{k}^{[2]}}{\\partial a_{j}^{[1]}}=W_{kj}^{[2]}",
        alt: "La dérivée partielle de z k de la couche deux par rapport à l'activation a j de la couche un vaut le poids W k j de la couche deux.",
        justification:
          "Dans $\\sum_{j'}W_{kj'}a_{j'}$, un seul terme contient $a_{j}$, et son facteur est $W_{kj}$.",
      },
      {
        latex:
          "\\underbrace{\\frac{\\partial\\ell}{\\partial z_{k}^{[2]}}\\,\\frac{\\partial z_{k}^{[2]}}{\\partial a_{j}^{[1]}}}_{\\text{le chemin par }z_{k}}=\\delta_{k}^{[2]}\\,W_{kj}^{[2]}",
        alt: "Le produit de la dérivée partielle de la perte par rapport à z k par la dérivée partielle de z k par rapport à a j, qui est la contribution du chemin passant par z k, vaut delta k de la couche deux multiplié par le poids W k j.",
      },
    ],
    resultat: {
      latex:
        "\\text{contribution de }k\\ \\text{à}\\ \\frac{\\partial\\ell}{\\partial a_{j}^{[1]}}\\ =\\ \\delta_{k}^{[2]}\\,W_{kj}^{[2]}",
      alt: "La contribution du neurone de sortie k à la dérivée partielle de la perte par rapport à l'activation a j de la couche un vaut delta k de la couche deux multiplié par W k j de la couche deux.",
    },
    interpretation:
      "À $k$ fixé cette contribution est **proportionnelle à $W_{kj}$**, et si $\\delta_{k}<0$, ce qui est le cas du neurone de la vraie classe, elle est du signe opposé à $W_{kj}$ : les activations reliées par un poids **positif** doivent monter, celles reliées par un poids **négatif** doivent descendre. Le sens demandé se lit sur un signe, sans aucun calcul.",
    limites: [
      "C'est la contribution d'**un seul** neurone de sortie, et il y en a dix.",
      "La contribution est une dérivée, pas une action : $a_{j}^{[1]}$ n'est pas un paramètre, et la section suivante en tire la conséquence.",
    ],
  },
  {
    id: "b-rp7-4",
    type: "sortie",
    ancre: "mesure-3-signes",
    titre:
      "Le sens demandé, lu sur le signe du poids · cours/lecon4/mesures.py, mesure 3",
    texte:
      "  -- Le signe se lit sur le poids, ligne k = 2 (delta_2 < 0) ---------------\n      j       W^[2]_2j      delta_2 W_2j     l'activation doit\n      1       +0.2363       -0.178491       monter\n      4       +0.0640       -0.048331       monter\n      2       -0.0420       +0.031698       descendre\n      7       -0.0232       +0.017562       descendre",
    lecture: [
      "$\\delta_{2}=-0{,}7555$ est **le même** pour les quatre lignes, seul le signe de $W_{2j}$ change, et il décide seul du sens.",
      "Un poids positif donne une contribution négative, donc la perte baisse quand $a_{j}$ monte ; un poids négatif donne l'inverse.",
      "Les tailles suivent aussi, puisque $0{,}178491/0{,}048331=3{,}69$ et $0{,}2363/0{,}0640=3{,}69$ : le rapport des contributions est celui des poids, à l'arrondi des valeurs affichées près, et c'est la proportionnalité de la proposition 5.",
    ],
  },
  {
    id: "b-rp7-6",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'on ne peut pas faire",
  },
  {
    id: "b-rp7-7",
    type: "texte",
    texte:
      "La proposition 5 dit dans quel sens $a_{j}^{[1]}$ devrait varier, et cette information est inutilisable telle quelle parce que **$a_{j}^{[1]}$ n'est pas un paramètre** : c'est une valeur produite par le réseau, $a_{j}^{[1]}=\\mathrm{ReLU}\\big(\\sum_{i}W_{ji}^{[1]}x_{i}+b_{j}^{[1]}\\big)$, et l'exemple $\\mathbf{x}$ ne se modifie pas davantage.",
  },
  {
    id: "b-rp7-8",
    type: "tableau",
    ancre: "ce-qui-se-touche",
    cleEnTete: true,
    entetes: ["Quantité", "Modifiable ?", "Ce qu'on en fait"],
    lignes: [
      ["$W^{[2]}$, $\\mathbf{b}^{[2]}$", "Oui", "On applique la correction, propositions 3 et 4"],
      ["$\\mathbf{a}^{[1]}$", "**Non**", "On note la correction souhaitée, et on la reporte en arrière"],
      ["$W^{[1]}$, $\\mathbf{b}^{[1]}$", "Oui", "Ils déterminent $\\mathbf{a}^{[1]}$ : c'est sur eux que le report arrive"],
      ["$\\mathbf{x}$", "**Non**", "C'est la donnée, et rien ne la modifie"],
    ],
  },
  {
    id: "b-rp7-10",
    type: "titre",
    niveau: 2,
    texte: "D'où vient le mot",
  },
  {
    id: "b-rp7-11",
    type: "texte",
    texte:
      "La correction souhaitée sur $\\mathbf{a}^{[1]}$ ne peut être ni appliquée ni oubliée, et elle est donc **reportée** sur les quantités qui déterminent $\\mathbf{a}^{[1]}$, c'est-à-dire sur $W^{[1]}$ et $\\mathbf{b}^{[1]}$, et si le réseau avait une couche de plus sur les activations d'encore avant, qui à leur tour reporteraient. Une demande formulée à la sortie remonte ainsi de couche en couche, à contre-courant du calcul qui l'a produite, et c'est de là que vient le mot « rétropropagation ».",
  },
  {
    id: "b-rp7-13",
    type: "verification",
    numero: 42,
    enonce:
      "Un neurone caché $j$ est relié au neurone de la vraie classe par un poids **négatif** : $W_{cj}^{[2]}<0$, et $\\delta_{c}^{[2]}<0$.",
    questions: [
      "Son activation doit-elle monter ou descendre ? Donner le signe de $\\delta_{c}W_{cj}$ avant de répondre.",
      "La réponse change-t-elle si l'on remplace le neurone de la vraie classe par un neurone $k\\neq c$, à poids négatif lui aussi ?",
    ],
  },
];
