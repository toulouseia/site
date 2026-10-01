import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 1 · Le cadre du cours
//
// Ouverture en trois blocs, règle 26 : la question, puis le réseau à un neurone
// par couche avec ses valeurs figées, puis le cadre. La figure est
// l5-fig01-reseau.svg, large de 1380 et haute de 720.
//
// Les prérequis et les objectifs restent, et eux seuls : c'est le cadre d'un
// cours, pas un commentaire sur sa méthode. Sont partis, par la règle 1, le
// « Plan », « Ce que ce chapitre règle », « Ce que ce chapitre laisse ouvert »,
// « Place dans le parcours » et le repère de progression.
//
// La mention de l'ordre des notions et de sa source est page 12, et nulle part
// ailleurs.
//
// PRÉREQUIS 2 : il attribuait au chapitre 2, page 6, le résultat ∂ℓ/∂z = a − y.
// Cette page s'appelle « Dix neurones » et ne dérive aucune perte ; le résultat
// ne figure nulle part au chapitre 2. Le prérequis porte désormais ce que le
// chapitre 2 porte vraiment : σ′ = σ(1−σ) ≤ 1/4, page 9, et l'entropie croisée,
// page 6. Le résultat lui-même se démontre en page 5 de ce chapitre.
//
// PRÉREQUIS 3 : la différence finie centrée s'écrit avec e_i, comme au
// chapitre 3, page 8. Sans lui, la formule ne dit pas de quelle composante on
// dérive.
//
// Les valeurs portées par la figure sortent de cours/lecon5/mesures.py, réseau
// minuscule. Aucune n'est écrite ici sans en sortir.
// ─────────────────────────────────────────────────────────────────────────────

export const C01_CADRE: Bloc[] = [
  {
    id: "b-cr1-1",
    type: "texte",
    texte:
      "Un réseau qui apprend déplace ses poids d'un rien, dans le sens qui fait baisser son erreur, et il lui faut pour chacun d'eux un nombre qui dise de combien et dans quel sens. Que faut-il connaître d'un réseau pour savoir de combien bouger chacun de ses poids ?",
  },
  {
    id: "b-cr1-2",
    type: "image",
    src: "/cours/lecon5/l5-fig01-reseau.svg",
    alt: "Une chaîne horizontale. À gauche, un carré gris marqué x, de valeur un. Suivent trois ronds cerclés d'encre, étiquetés a exposant un, a exposant deux et a exposant trois, avec ReLU écrit sous les deux premiers et sigma sous le troisième. Une flèche relie chaque objet au suivant et porte au-dessus le poids de sa couche, w exposant un vaut zéro virgule huit, w exposant deux un virgule cinq, w exposant trois deux, et au-dessous son biais, b exposant un vaut zéro virgule deux, b exposant deux moins zéro virgule quatre, b exposant trois moins zéro virgule cinq. À droite, un carré marqué la perte ell reçoit la dernière flèche, et un carré gris marqué y, de valeur un, pointe vers lui par en dessous.",
    largeur: 1380,
    hauteur: 720,
    legende:
      "Chaque quantité de ce réseau est un nombre, et non un vecteur. Les valeurs sont figées, et sortent de `cours/lecon5/mesures.py`, réseau minuscule.",
  },
  {
    id: "b-cr1-3",
    type: "texte",
    texte:
      "Ce réseau porte six paramètres, et chacun a son nombre : de combien la perte varie quand ce paramètre seul bouge d'un cheveu. Ces six nombres se calculent exactement, sans réévaluer le réseau une fois par paramètre, et le procédé qui les donne ne dépend ni du nombre de couches ni de l'activation choisie.",
  },
  {
    id: "b-cr1-3b",
    type: "titre",
    niveau: 2,
    texte: "Prérequis",
  },
  {
    id: "b-cr1-4",
    type: "liste",
    ordonnee: true,
    elements: [
      "Le **chapitre 4 en entier** : le signal d'erreur $\\boldsymbol{\\delta}^{[l]}$, les trois voies, le produit de Hadamard, la transposée au retour.",
      "La **sigmoïde** $\\sigma$ et sa dérivée $\\sigma'=\\sigma(1-\\sigma)\\leq 1/4$, démontrée au **chapitre 2**, page 9, ainsi que l'**entropie croisée**, posée à la page 6 du même chapitre.",
      "La **dérivée partielle** et la **différence finie centrée** $\\big[C(\\boldsymbol{\\theta}+\\varepsilon\\mathbf{e}_{i})-C(\\boldsymbol{\\theta}-\\varepsilon\\mathbf{e}_{i})\\big]/(2\\varepsilon)$, où $\\mathbf{e}_{i}$ dit de quelle composante de $\\boldsymbol{\\theta}$ on parle, définies au **chapitre 3**, page 8.",
      "Le **produit matriciel** et sa règle de dimensions : $(m\\times n)(n\\times q)\\rightarrow m\\times q$.",
    ],
  },
  {
    id: "b-cr1-6",
    type: "titre",
    niveau: 2,
    texte: "Objectifs",
  },
  {
    id: "b-cr1-7",
    type: "liste",
    ordonnee: true,
    elements: [
      "**Énoncer** la règle de la chaîne dans ses deux formes, et donner le critère qui dit laquelle s'applique.",
      "**Construire** l'arbre des dépendances d'un réseau à un neurone par couche, et y lire la décomposition d'une dérivée.",
      "**Établir** les trois dérivées constitutives $\\partial z/\\partial w$, $\\partial a/\\partial z$ et $\\partial\\ell/\\partial a$, chacune à partir de l'équation dont elle sort.",
      "**Démontrer par récurrence** que $\\delta^{[l]}=\\delta^{[l+1]}\\,w^{[l+1]}\\,\\varphi'(z^{[l]})$, avec son initialisation et son hérédité séparées.",
      "**Écrire** $\\partial\\ell/\\partial w^{[1]}$ comme un produit de poids et de dérivées d'activation, et en tirer la décroissance géométrique du gradient avec la profondeur.",
      "**Démontrer** qu'avec plusieurs neurones par couche un seul terme change de nature, et que c'est de lui que vient la transposée.",
      "**Définir** la jacobienne, la distinguer du gradient, et démontrer que celle de $\\mathbf{a}^{[l]}$ par rapport à $\\mathbf{z}^{[l]}$ est diagonale.",
      "**Majorer** le coût de l'algorithme par trois propagations avant, et confronter cette majoration à une mesure.",
      "**Vérifier** chaque identité par différences finies, sur le réseau minuscule puis sur un réseau à cinq couches.",
    ],
  },
];
