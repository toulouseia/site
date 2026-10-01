import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 6 · L'assemblage, et le biais
//
// OUVERTURE, règle 26 : la question sans symbole, puis l5-fig07-trois-rapports
// en 1380 x 780, puis le cadre. CETTE FIGURE ÉTAIT SERVIE EN PAGE 4 ; elle est
// désormais à cette page, et la page 4 ne la sert plus (règle 17).
//
// Le poids et le biais de la dernière couche. L'ÉCART N°1 à la source est
// écrit ici : avec le coût quadratique il resterait un facteur 2 et un φ′ ;
// l'appariement de σ et de l'entropie croisée binaire les fait disparaître.
// Les deux formes sont données côte à côte.
//
// L'APPARIEMENT EST DÉFINI ICI, à son premier emploi, juste avant l'hypothèse
// qui s'en sert : le mot et sa raison au même endroit. Sa raison est le calcul
// de deux facteurs fait en page 5, et non un renvoi au chapitre 2, qui ne porte
// nulle part ∂ℓ/∂z = a − y.
//
// UNE SEULE NUMÉROTATION dans la dérivation : celle que la liste ordonnée des
// étapes produit au rendu. Les repères (i), (ii), (iii) sont retirés, et les
// deux renvois qui les citaient disent maintenant ce qu'ils désignent.
//
// Le coût total est RENVOYÉ au chapitre 4, proposition 7, en trois lignes.
// Mesure 1, passe arrière de la dernière couche. 🧪 n°53 et n°54.
//
// Les blocs animation n'ont pas bougé, identifiants compris.
// ─────────────────────────────────────────────────────────────────────────────

export const C06_ASSEMBLAGE: Bloc[] = [
  {
    id: "b-cr6-0",
    type: "texte",
    texte: "Que vaut le produit de ces trois rapports, sur des nombres ?",
  },
  {
    id: "b-cr6-0f",
    type: "image",
    ancre: "trois-rapports",
    src: "/cours/lecon5/l5-fig07-trois-rapports.svg",
    largeur: 1380,
    hauteur: 780,
    alt: "Quatre ronds alignés, marqués w exposant trois, z exposant trois, a exposant trois et la perte ell, reliés par trois flèches. Chaque flèche porte au-dessus la dérivée qu'elle représente et au-dessous sa valeur. La dérivée de z exposant trois par rapport à w exposant trois vaut un virgule cent mille, celle de a exposant trois par rapport à z exposant trois vaut zéro virgule cent trente mille six cent six, et celle de la perte ell par rapport à a exposant trois vaut moins un virgule cent quatre-vingt-deux mille six cent quatre-vingt-quatre. En pied, le produit des trois vaut moins zéro virgule cent soixante-neuf mille neuf cent douze.",
    legende:
      "Le dénominateur du dernier facteur est exactement le facteur qui le précède : leur produit vaut l'écart $a^{[3]}-y$, et c'est cet écart qui remplace les deux.",
  },
  {
    id: "b-cr6-0c",
    type: "texte",
    texte:
      "Deux des trois rapports se simplifient donc l'un l'autre, et ce qui reste est l'écart entre la sortie et la cible, multiplié par l'activation qui entre. Le biais suit la même chaîne, avec un coefficient qui vaut $1$.",
  },
  {
    id: "b-cr6-1",
    type: "titre",
    niveau: 2,
    texte: "Les deux premiers facteurs se fondent en l'écart à la cible",
  },
  {
    id: "b-cr6-1b",
    type: "definition",
    terme: "Perte appariée à une activation de sortie",
    anglais: "matched loss and output activation",
    texte:
      "Une perte et une activation de sortie sont appariées quand le produit $\\big(\\partial\\ell/\\partial a^{[L]}\\big)\\big(\\partial a^{[L]}/\\partial z^{[L]}\\big)$ se réduit à $a^{[L]}-y$, c'est-à-dire quand la dérivée de l'activation disparaît du produit au lieu d'y rester. L'entropie croisée binaire et $\\sigma$ forment un tel couple, et c'est le calcul de la page 5 qui l'établit ; le coût quadratique et $\\sigma$ n'en forment pas un.",
  },
  {
    id: "b-cr6-2",
    type: "derivation",
    ancre: "poids-et-biais-derniere-couche",
    titre: "Le poids et le biais de la dernière couche",
    hypotheses: [
      "Réseau à un neurone par couche, équations (5.4).",
      "Perte appariée à l'activation de sortie : entropie croisée binaire sur $\\sigma$.",
      "La chaîne $w^{[L]}\\rightarrow z^{[L]}\\rightarrow a^{[L]}\\rightarrow\\ell$ est sans embranchement.",
    ],
    chaine: "w^{[L]} → z^{[L]} → a^{[L]} → ℓ",
    proprietes: [
      "La décomposition en trois rapports, page 4",
      "Les trois dérivées de la page 5",
      "Le court-circuit de $\\partial\\ell/\\partial a^{[L]}$ et de $\\partial a^{[L]}/\\partial z^{[L]}$, page 5",
    ],
    etapes: [
      {
        texte:
          "**La somme pondérée donne deux dérivées.** $z^{[L]}=w^{[L]}a^{[L-1]}+b^{[L]}$ est affine en $w^{[L]}$ comme en $b^{[L]}$.",
      },
      {
        latex:
          "\\frac{\\partial z^{[L]}}{\\partial w^{[L]}}=a^{[L-1]},\\qquad\\frac{\\partial z^{[L]}}{\\partial b^{[L]}}=1",
        alt: "La dérivée de la somme pondérée par rapport au poids vaut l'activation précédente, et sa dérivée par rapport au biais vaut un.",
      },
      {
        texte:
          "**L'activation donne $\\varphi'$.** $a^{[L]}=\\varphi(z^{[L]})$, donc $\\partial a^{[L]}/\\partial z^{[L]}=\\varphi'(z^{[L]})$.",
      },
      {
        texte:
          "**La perte est appariée à l'activation de sortie.** Le facteur $\\varphi'(z^{[L]})$ qu'on vient d'écrire est effacé par $\\partial\\ell/\\partial a^{[L]}$, et il ne reste de leur produit que l'écart à la cible.",
        latex: "\\frac{\\partial\\ell}{\\partial z^{[L]}}=a^{[L]}-y",
        alt: "La dérivée de la perte par rapport à la somme pondérée de la dernière couche vaut l'activation moins la cible.",
        justification:
          "Page 5 : $\\sigma'(z^{[L]})=a^{[L]}(1-a^{[L]})$ est exactement le dénominateur de $\\partial\\ell/\\partial a^{[L]}$, et les deux facteurs s'annulent.",
      },
      {
        texte:
          "**On assemble.** La décomposition en trois rapports donne le produit des trois facteurs ; les deux premiers viennent d'être remplacés par leur produit simplifié.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial w^{[L]}}=\\underbrace{\\big(a^{[L]}-y\\big)}_{\\partial\\ell/\\partial z^{[L]}}\\cdot\\underbrace{a^{[L-1]}}_{\\partial z^{[L]}/\\partial w^{[L]}},\\qquad\\frac{\\partial\\ell}{\\partial b^{[L]}}=\\big(a^{[L]}-y\\big)\\cdot 1",
        alt: "La dérivée de la perte par rapport au dernier poids est le produit de l'écart entre l'activation et la cible par l'activation précédente ; sa dérivée par rapport au dernier biais est cet écart multiplié par un.",
      },
    ],
    resultat: {
      latex:
        "\\frac{\\partial\\ell}{\\partial w^{[L]}}=\\big(a^{[L]}-y\\big)\\,a^{[L-1]},\\qquad\\frac{\\partial\\ell}{\\partial b^{[L]}}=a^{[L]}-y",
      alt: "La dérivée de la perte par rapport au dernier poids vaut l'écart entre sortie et cible multiplié par l'activation précédente, et sa dérivée par rapport au dernier biais vaut cet écart seul.",
    },
    interpretation:
      "Le biais est le cas le plus simple : le facteur qui le multiplie dans la somme pondérée vaut $1$, donc sa dérivée est l'écart lui-même, et elle ne dépend d'aucune activation.",
    limites: [
      "Le court-circuit tient à l'appariement de la perte et de l'activation de sortie ; avec un autre couple, $\\varphi'$ ne disparaît pas.",
      "Ces deux identités ne concernent que la **dernière** couche.",
    ],
  },
  {
    id: "b-cr6-4",
    type: "titre",
    niveau: 2,
    texte: "Avec le coût quadratique, la pente de l'activation reste au produit",
  },
  {
    id: "b-cr6-5",
    type: "texte",
    texte:
      "Si la perte était $\\ell=(a^{[L]}-y)^{2}$, sa dérivée par rapport à l'activation vaudrait $2(a^{[L]}-y)$, aucun dénominateur ne viendrait effacer $\\varphi'$, et ce facteur resterait au produit.",
  },
  {
    id: "b-cr6-6",
    type: "tableau",
    ancre: "les-deux-couts",
    cleEnTete: true,
    entetes: ["Perte", "$\\partial\\ell/\\partial a^{[L]}$", "$\\partial\\ell/\\partial w^{[L]}$"],
    lignes: [
      [
        "Quadratique",
        "$2\\big(a^{[L]}-y\\big)$",
        "$2\\big(a^{[L]}-y\\big)\\,\\varphi'(z^{[L]})\\,a^{[L-1]}$",
      ],
      [
        "Entropie croisée, appariée à $\\sigma$",
        "$\\dfrac{a^{[L]}-y}{a^{[L]}(1-a^{[L]})}$",
        "$\\big(a^{[L]}-y\\big)\\,a^{[L-1]}$",
      ],
    ],
    legende:
      "L'appariement fait disparaître $\\varphi'$ de la dernière couche, et le facteur $2$ avec lui.",
  },
  {
    id: "b-cr6-7",
    type: "encart",
    ton: "note",
    titre: "Écart n°1",
    texte:
      "La source emploie le coût quadratique, d'où sa dérivée $2(a-y)$. Le cours emploie l'entropie croisée depuis le chapitre 2, d'où l'écart $a^{[L]}-y$ seul, sans facteur $2$ et sans $\\varphi'$. Les deux formes figurent ci-dessus, et la différence vient de la perte, pas du procédé.",
  },
  {
    id: "b-cr6-8",
    type: "titre",
    niveau: 2,
    texte: "En nombres : le poids porte une activation, le biais porte l'écart seul",
  },
  {
    id: "b-cr6-9",
    type: "sortie",
    ancre: "mesure-1-derniere-couche",
    titre: "Mesure 1 · la passe arrière, dernière couche",
    texte: `  delta3 = a3 - y            = -0.154465
  dl/dw3 = delta3 . a2       = -0.169912
  dl/db3 = delta3            = -0.154465`,
    lecture: [
      "$\\delta^{[3]}=0{,}845535-1=-0{,}154465$ : la sortie est en dessous de la cible, l'écart est négatif.",
      "$\\partial\\ell/\\partial w^{[3]}=-0{,}154465\\times 1{,}100000=-0{,}169912$, la valeur déjà obtenue page 5 par le produit des trois.",
      "$\\partial\\ell/\\partial b^{[3]}=-0{,}154465$ : aucune activation n'y figure.",
    ],
  },
  {
    id: "b-cr6-10",
    type: "titre",
    niveau: 2,
    texte: "Le gradient du coût est la moyenne des gradients des exemples",
  },
  {
    id: "b-cr6-11",
    type: "texte",
    texte:
      "Le coût sur un jeu de données est la moyenne des pertes de ses exemples, et la dérivée d'une moyenne est la moyenne des dérivées : $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$ est la moyenne des $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell^{(n)}$, sans facteur ni approximation. C'est démontré au chapitre 4, proposition 7.",
  },
  {
    id: "b-cr6-12",
    type: "titre",
    niveau: 2,
    texte: "Deux composantes du gradient sur six",
  },
  {
    id: "b-cr6-13",
    type: "texte",
    texte:
      "Le réseau minuscule a six paramètres, donc son gradient a six composantes. Les deux identités ci-dessus en donnent **deux**, celle du poids et celle du biais de la dernière couche, et les quatre autres portent sur $w^{[2]},b^{[2]},w^{[1]},b^{[1]}$, qu'aucune des deux ne touche.",
  },
  {
    id: "b-cr6-15",
    type: "verification",
    numero: 53,
    enonce:
      "Le tableau des deux coûts donne deux expressions de $\\partial\\ell/\\partial w^{[L]}$.",
    questions: [
      "Avec le coût quadratique, la dérivée par rapport au dernier poids comporte un facteur que notre perte fait disparaître. Lequel ?",
      "Pourquoi disparaît-il ?",
    ],
  },
  {
    id: "b-cr6-16",
    type: "verification",
    numero: 54,
    enonce:
      "Le gradient compte une composante par paramètre, formule (5.1).",
    questions: [
      "Combien de composantes le gradient du réseau $784\\rightarrow 128\\rightarrow 10$ compte-t-il ?",
      "Combien les deux identités de la dernière couche en donnent-elles sur le réseau minuscule, et combien en reste-t-il ?",
    ],
  },
  {
    id: "b-cr6-17",
    type: "texte",
    texte:
      "Aucun de ces quatre paramètres n'apparaît dans $z^{[L]}$, et sur l'arbre de la page 4 ils atteignent tous la perte par le même nœud, l'activation $a^{[L-1]}$.",
  },
];
