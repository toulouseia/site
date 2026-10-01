import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 12 · Synthèse, formulaire et erreurs fréquentes
//
// LE TRAJET ÉTAIT UN SEUL PAVÉ DE VINGT LIGNES RENDUES, qui enchaînait sept
// idées. C'est la règle 22, et le remède est celui de la règle 23, cas 1 : le
// bloc porte plusieurs idées, donc on le découpe. Un paragraphe par idée, un
// intertitre par paragraphe. Pas un mot n'a été ajouté ni retiré du fond ; le
// texte est celui d'avant, coupé aux sept jointures qu'il portait déjà.
//
// Le tableau des objets est EXHAUSTIF sur le chapitre : tout symbole employé
// une seule fois y figure avec son ensemble d'appartenance et sa dimension, et
// sa colonne « page » est ce qui montre qu'aucun terme n'arrive avant sa
// définition.
//
// Le mot « rétropropagation » apparaît ICI, et nulle part ailleurs dans le
// chapitre. Il nomme l'algorithme du chapitre 4, et rien de plus.
//
// Mention de source, comme à la page 1.
// ─────────────────────────────────────────────────────────────────────────────

export const D12_SYNTHESE: Bloc[] = [
  {
    id: "b-d12-0",
    type: "texte",
    texte:
      "Le coût partait à deux virgule quatre, au-dessus de ce que paierait une réponse tirée au sort. Où est-il arrivé ?",
  },
  {
    id: "b-d12-fig27",
    type: "image",
    ancre: "le-trajet",
    src: "/cours/lecon3/l3-fig27-le-trajet.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "Une courbe descendante sur un axe horizontal dont les deux extrémités portent les mentions départ et époque vingt-neuf. L'axe vertical est logarithmique. Un rond brique marque le point de départ en haut à gauche et porte sa valeur, deux virgule quatre mille cent soixante-dix-huit ; un second rond brique marque l'arrivée en bas à droite et porte la sienne, zéro virgule zéro zéro zéro six. Sous l'axe se lit échelle logarithmique.",
    legende:
      "Le coût d'entraînement, du tirage au sort à l'époque $29$, la trentième. L'échelle est logarithmique, sans quoi la fin du trajet serait écrasée contre l'axe.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.1 · Le trajet, une idée par paragraphe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-1",
    type: "titre",
    niveau: 2,
    texte: "Le trajet",
  },
  {
    id: "b-d12-2",
    type: "titre",
    niveau: 3,
    texte: "Ce qu'on écrit",
  },
  {
    id: "b-d12-3",
    type: "texte",
    texte:
      "Apprendre, c'est écrire non pas l'algorithme qui reconnaît un chiffre, mais celui qui règle ses $101\\,770$ nombres.",
  },
  {
    id: "b-d12-4",
    type: "titre",
    niveau: 3,
    texte: "Le point de départ",
  },
  {
    id: "b-d12-5",
    type: "texte",
    texte:
      "Au départ ces nombres sont tirés au hasard, et le réseau fait légèrement pire que le hasard, $2{,}42$ contre $\\ln 10=2{,}3026$, parce qu'il a des préférences arbitraires et se trompe donc parfois avec confiance.",
  },
  {
    id: "b-d12-6",
    type: "titre",
    niveau: 3,
    texte: "Le coût",
  },
  {
    id: "b-d12-7",
    type: "texte",
    texte:
      "On lui donne un coût, l'entropie croisée plutôt que la somme des carrés, parce que sur une sortie confiante et fausse la seconde produit une correction $450$ fois plus faible. Moyenné sur le jeu, ce coût devient $C_{\\mathcal{D}}:\\mathbb{R}^{101\\,770}\\rightarrow\\mathbb{R}_{\\geq 0}$, dont les entrées sont les paramètres et non les images.",
  },
  {
    id: "b-d12-8",
    type: "titre",
    niveau: 3,
    texte: "Ce qu'on ne peut pas minimiser",
  },
  {
    id: "b-d12-9",
    type: "texte",
    texte:
      "On ne peut pas minimiser le taux d'erreur, dont la dérivée est nulle partout où elle existe, et c'est pour que le coût soit lisse, et pour aucune autre raison, que les activations d'un neurone varient continûment.",
  },
  {
    id: "b-d12-10",
    type: "titre",
    niveau: 3,
    texte: "La descente, et le pas",
  },
  {
    id: "b-d12-11",
    type: "texte",
    texte:
      "On descend donc $C_{\\mathcal{D}}$ : le gradient donne la direction de plus forte croissance, son opposé celle de plus forte descente, et $\\eta$ décide de la longueur du pas. À $\\eta=10$ la descente ne descend rien, à $\\eta=0{,}001$ elle n'a pas fini en cinq époques, et $\\eta=0{,}5$ est le meilleur des sept réglages mesurés.",
  },
  {
    id: "b-d12-12",
    type: "titre",
    niveau: 3,
    texte: "Les lots",
  },
  {
    id: "b-d12-13",
    type: "texte",
    texte:
      "On n'évalue pas le coût sur les $60\\,000$ images pour faire un pas : un lot de $64$ pointe à $40{,}6$ degrés du bon gradient, mais il vise juste **en moyenne**, et cela suffit.",
  },
  {
    id: "b-d12-14",
    type: "titre",
    niveau: 3,
    texte: "Ce que le gradient encode",
  },
  {
    id: "b-d12-15",
    type: "texte",
    texte:
      "Le vecteur obtenu est très inégal d'une composante à l'autre, la plus grande valant $404$ fois la médiane, si bien que le même $\\eta$ déplace beaucoup certains paramètres et presque pas les autres. Sa longueur, elle, rétrécit d'un facteur $105$ au fil des époques, et les pas se raccourcissent donc tout seuls.",
  },
  {
    id: "b-d12-16",
    type: "titre",
    niveau: 3,
    texte: "Et il n'y a pas une bonne réponse",
  },
  {
    id: "b-d12-17",
    type: "texte",
    texte:
      "Enfin $128!$ jeux de paramètres donnent exactement le même coût, et trois graines suffisent à obtenir trois solutions quasiment orthogonales, à $0{,}9814$, $0{,}9823$ et $0{,}9816$ de précision.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.2 · Formulaire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-18",
    type: "titre",
    niveau: 2,
    texte: "Formulaire",
  },
  {
    id: "b-d12-19",
    type: "tableau",
    ancre: "formulaire",
    cleEnTete: true,
    entetes: ["Objet", "Formule", "Page"],
    lignes: [
      [
        "Le problème",
        "trouver $\\boldsymbol{\\theta}\\in\\arg\\min_{\\boldsymbol{\\theta}\\in\\mathbb{R}^{p}}C_{\\mathcal{D}}(\\boldsymbol{\\theta})$",
        "3",
      ],
      [
        "Perte quadratique",
        "$\\ell_{\\text{quad}}(\\mathbf{a},c)=\\sum_{k}(a_{k}-y_{k})^{2}$",
        "5",
      ],
      ["Entropie croisée", "$\\ell(\\mathbf{a},c)=-\\ln a_{c+1}$", "5"],
      [
        "Sensibilité de l'entropie croisée",
        "$|\\partial C/\\partial z_{c+1}|=1-a_{c+1}$",
        "5",
      ],
      [
        "Coût sur le jeu",
        "$C_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n}\\ell\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)}),c^{(n)}\\big)$",
        "6",
      ],
      [
        "Taux d'erreur",
        "$E(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n}\\mathbb{1}\\{\\widehat{c}\\neq c^{(n)}\\}$, à valeurs dans $\\{k/N\\}$",
        "7",
      ],
      [
        "Fonction convexe",
        "$C((1-t)\\boldsymbol{\\theta}_{1}+t\\boldsymbol{\\theta}_{2})\\leq(1-t)C(\\boldsymbol{\\theta}_{1})+tC(\\boldsymbol{\\theta}_{2})$",
        "7",
      ],
      [
        "Décroissance à l'ordre 1",
        "$C(\\theta_{t+1})-C(\\theta_{t})=-\\eta\\,C'(\\theta_{t})^{2}+o(\\eta)$",
        "7",
      ],
      [
        "Dérivée partielle",
        "$\\frac{\\partial C}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})=\\lim_{s\\to 0}\\frac{C(\\boldsymbol{\\theta}+s\\mathbf{e}_{i})-C(\\boldsymbol{\\theta})}{s}$",
        "8",
      ],
      [
        "Gradient",
        "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C=\\big(\\partial C/\\partial\\theta_{1},\\ldots,\\partial C/\\partial\\theta_{p}\\big)^{\\mathsf{T}}$",
        "8",
      ],
      [
        "Dérivée directionnelle",
        "$D_{\\mathbf{u}}C(\\boldsymbol{\\theta})=\\lim_{t\\to 0}\\frac{C(\\boldsymbol{\\theta}+t\\mathbf{u})-C(\\boldsymbol{\\theta})}{t}$",
        "8",
      ],
      [
        "Proposition 3, admise",
        "$D_{\\mathbf{u}}C=\\langle\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C,\\mathbf{u}\\rangle\\leq\\|\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C\\|$ pour $\\|\\mathbf{u}\\|=1$",
        "8",
      ],
      [
        "Mise à jour",
        "$\\boldsymbol{\\theta}_{t+1}=\\boldsymbol{\\theta}_{t}-\\eta\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta}_{t})$",
        "8",
      ],
      [
        "Différence finie centrée",
        "$\\frac{\\partial C}{\\partial\\theta_{i}}\\approx\\frac{C(\\boldsymbol{\\theta}+\\varepsilon\\mathbf{e}_{i})-C(\\boldsymbol{\\theta}-\\varepsilon\\mathbf{e}_{i})}{2\\varepsilon}$",
        "8",
      ],
      [
        "Coût sur un lot",
        "$C_{\\mathcal{B}}(\\boldsymbol{\\theta})=\\frac{1}{B}\\sum_{n\\in\\mathcal{B}}\\ell\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)}),c^{(n)}\\big)$",
        "9",
      ],
      [
        "Cosinus",
        "$\\cos(\\mathbf{u},\\mathbf{v})=\\langle\\mathbf{u},\\mathbf{v}\\rangle/(\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|)$",
        "9",
      ],
      [
        "Proposition 4",
        "$\\mathbb{E}[\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{B}}]=\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$",
        "9",
      ],
      ["Proposition 5", "$B\\big(1/\\cos^{2}-1\\big)=\\kappa$, indépendant de $B$", "9"],
      [
        "Proposition 6",
        "$W^{[1]\\prime}=P_{\\pi}W^{[1]}$, $W^{[2]\\prime}=W^{[2]}P_{\\pi}^{\\mathsf{T}}$ $\\Rightarrow$ même coût",
        "11",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.3 · Le tableau des objets
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-20",
    type: "titre",
    niveau: 2,
    texte: "Tous les objets du chapitre",
  },
  {
    id: "b-d12-21",
    type: "texte",
    texte:
      "La colonne de droite donne la page où l'objet est **défini**, c'est-à-dire la page qui dit ce qu'il est. La page 1 en **nomme** plusieurs avant cela, dans ses objectifs et ses tableaux de dettes, mais aucun n'y est employé dans un calcul : c'est le propre d'une page de cadre que d'annoncer ce qu'elle ne fait pas encore.",
  },
  {
    id: "b-d12-22",
    type: "tableau",
    ancre: "objets-fonctions",
    titre: "Fonctions, avec départ et arrivée",
    cleEnTete: true,
    entetes: ["Fonction", "Départ", "Arrivée", "Définie page"],
    lignes: [
      [
        "$f_{\\boldsymbol{\\theta}}$",
        "$\\mathbb{R}^{784}$",
        "$\\Delta^{\\circ}_{9}$",
        "2, du chapitre 2",
      ],
      [
        "$\\ell$",
        "$\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]$",
        "$\\mathbb{R}_{\\geq 0}$",
        "5",
      ],
      [
        "$\\ell_{\\text{quad}}$",
        "$\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]$",
        "$\\mathbb{R}_{\\geq 0}$",
        "5",
      ],
      ["$C_{\\mathcal{D}}$", "$\\mathbb{R}^{p}$", "$\\mathbb{R}_{\\geq 0}$", "6"],
      ["$C_{\\mathcal{B}}$", "$\\mathbb{R}^{p}$", "$\\mathbb{R}_{\\geq 0}$", "9"],
      [
        "$E$, taux d'erreur",
        "$\\mathbb{R}^{p}$",
        "$\\{k/N:k\\in[\\![0,N]\\!]\\}$",
        "7",
      ],
      [
        "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$",
        "$\\mathbb{R}^{p}$",
        "$\\mathbb{R}^{p}$",
        "8",
      ],
      ["$D_{\\mathbf{u}}C$", "$\\mathbb{R}^{p}$", "$\\mathbb{R}$", "8"],
      [
        "$\\cos(\\cdot,\\cdot)$",
        "$(\\mathbb{R}^{p}\\setminus\\{\\mathbf{0}\\})^{2}$",
        "$[-1,1]$",
        "9",
      ],
      [
        "$\\mathbb{E}[\\cdot]$",
        "vecteurs aléatoires de $\\mathbb{R}^{p}$",
        "$\\mathbb{R}^{p}$",
        "9",
      ],
      [
        "$\\mathrm{Var}(\\cdot)$",
        "vecteurs aléatoires de $\\mathbb{R}^{p}$",
        "$\\mathbb{R}_{\\geq 0}$",
        "9",
      ],
      ["$\\mathbb{P}(\\cdot)$", "événements", "$[0,1]$", "9"],
      [
        "$\\arg\\min$",
        "fonctions $\\Theta\\rightarrow\\mathbb{R}$",
        "parties de $\\Theta$",
        "3",
      ],
    ],
  },
  {
    id: "b-d12-23",
    type: "tableau",
    ancre: "objets-symboles",
    titre: "Symboles, ensembles et dimensions",
    cleEnTete: true,
    entetes: ["Symbole", "Signification", "Ensemble", "Dimension", "Nature"],
    lignes: [
      [
        "$\\boldsymbol{\\theta}$",
        "Tous les paramètres, rangés",
        "$\\mathbb{R}^{p}$",
        "$p\\times 1$",
        "**Paramètre appris**",
      ],
      [
        "$\\boldsymbol{\\theta}_{t}$",
        "Sa valeur à l'itération $t$",
        "$\\mathbb{R}^{p}$",
        "$p\\times 1$",
        "Calculé",
      ],
      [
        "$\\theta_{i}$",
        "Sa $i$-ième composante",
        "$\\mathbb{R}$",
        "$1\\times 1$",
        "**Paramètre appris**",
      ],
      [
        "$p$",
        "Nombre de paramètres",
        "$\\mathbb{N}^{*}$",
        "$1\\times 1$",
        "Constante : $101\\,770$",
      ],
      ["$t$", "Indice d'itération", "$\\mathbb{N}$", "–", "Indice"],
      ["$i$", "Indice de composante", "$[\\![1,p]\\!]$", "–", "Indice"],
      ["$n$", "Indice d'exemple", "$[\\![1,N]\\!]$", "–", "Indice"],
      [
        "$N$",
        "Taille du jeu d'entraînement",
        "$\\mathbb{N}^{*}$",
        "$1\\times 1$",
        "Constante : $60\\,000$",
      ],
      [
        "$\\mathcal{D}_{\\text{train}}$, $\\mathcal{D}_{\\text{test}}$",
        "Les deux jeux",
        "$\\subseteq\\mathcal{X}\\times\\mathcal{Y}$",
        "–",
        "**Paramètre de la définition**, jamais variable",
      ],
      [
        "$\\mathcal{B}$",
        "Un mini-lot",
        "$\\subseteq[\\![1,N]\\!]$, $\\#\\mathcal{B}=B$",
        "–",
        "Tiré au hasard",
      ],
      [
        "$B$",
        "Taille du lot",
        "$\\mathbb{N}^{*}$",
        "$1\\times 1$",
        "Réglage : $64$",
      ],
      [
        "$\\eta$",
        "Taux d'apprentissage",
        "$\\mathbb{R}_{>0}$",
        "$1\\times 1$",
        "Réglage : $0{,}5$",
      ],
      [
        "$\\mathbf{g}$, $\\mathbf{g}_{\\mathcal{B}}$",
        "Gradient complet, gradient d'un lot",
        "$\\mathbb{R}^{p}$",
        "$p\\times 1$",
        "Calculés",
      ],
      [
        "$g_{i}$",
        "Composante $i$ du gradient",
        "$\\mathbb{R}$",
        "$1\\times 1$",
        "Calculée",
      ],
      [
        "$\\mathbf{g}_{n}$",
        "Gradient de la perte du seul exemple $n$",
        "$\\mathbb{R}^{p}$",
        "$p\\times 1$",
        "Calculé",
      ],
      [
        "$\\sigma^{2}$",
        "Variance des $\\mathbf{g}_{n}$ autour de $\\mathbf{g}$",
        "$\\mathbb{R}_{\\geq 0}$",
        "$1\\times 1$",
        "Mesurée",
      ],
      [
        "$\\kappa$",
        "$\\sigma^{2}/\\|\\mathbf{g}\\|^{2}$, sans dimension",
        "$\\mathbb{R}_{\\geq 0}$",
        "$1\\times 1$",
        "Mesuré : entre $42{,}0$ et $50{,}5$",
      ],
      [
        "$\\varepsilon$",
        "Pas de la différence finie",
        "$\\mathbb{R}_{>0}$",
        "$1\\times 1$",
        "Réglage : $10^{-5}$",
      ],
      [
        "$\\mathbf{u}$",
        "Direction unitaire",
        "$\\{\\mathbf{u}\\in\\mathbb{R}^{p}:\\|\\mathbf{u}\\|=1\\}$",
        "$p\\times 1$",
        "Choisie",
      ],
      [
        "$\\mathbf{e}_{i}$",
        "$i$-ième vecteur de la base canonique",
        "$\\mathbb{R}^{p}$",
        "$p\\times 1$",
        "Constante",
      ],
      [
        "$h$",
        "Largeur de la couche cachée",
        "$\\mathbb{N}^{*}$",
        "$1\\times 1$",
        "Réglage : $128$",
      ],
      [
        "$P_{\\pi}$",
        "Matrice de permutation des neurones",
        "$\\mathcal{M}_{h}(\\mathbb{R})$",
        "$h\\times h$",
        "Construite",
      ],
      [
        "$\\mathcal{C}^{1}(U)$",
        "Fonctions dérivables sur $U$, de dérivée continue",
        "ensembles de fonctions",
        "–",
        "Ensembles",
      ],
      [
        "$\\boldsymbol{\\theta}^{\\star}$",
        "Un minimiseur",
        "$\\arg\\min C_{\\mathcal{D}}$",
        "$p\\times 1$",
        "Cherché",
      ],
    ],
    legende:
      "Les ensembles $\\mathbb{R}$, $\\mathbb{R}_{\\geq 0}$, $\\mathbb{R}_{>0}$, $\\mathbb{N}$, $\\mathbb{N}^{*}$, $[\\![1,m]\\!]$, $\\mathcal{M}_{m,n}(\\mathbb{R})$, $\\mathcal{M}_{n}(\\mathbb{R})$, $I_{n}$, $\\Delta^{\\circ}_{K-1}$, $\\mathbb{1}\\{\\cdot\\}$, $\\mathbf{1}_{m}$, $\\langle\\cdot,\\cdot\\rangle$, $\\|\\cdot\\|$ et les fonctions $\\mathrm{vec}$, $\\mathrm{onehot}$, $\\widehat{c}$ sont ceux du chapitre 2, rappelés sans être redéfinis.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.4 · L'algorithme
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-24",
    type: "titre",
    niveau: 2,
    texte: "L'algorithme complet",
  },
  {
    id: "b-d12-25",
    type: "code",
    langage: "text",
    titre: "La descente de gradient par mini-lots",
    code: [
      "ENTREE   D_train    N couples (x, c), fixes",
      "         eta        dans R_{>0}",
      "         B          taille de lot, dans N*",
      "         T          nombre d'epoques",
      "SORTIE   theta      un vecteur de R^p",
      "",
      "1.  theta <- tirage au hasard dans R^p",
      "2.  pour t de 1 a T :",
      "3.        ordre <- une permutation de [1, N]",
      "4.        pour chaque tranche B_k de B indices consecutifs de ordre :",
      "5.              g <- grad_theta C_{B_k}(theta)      un vecteur de R^p",
      "6.              theta <- theta - eta * g            p soustractions",
      "7.  rendre theta",
      "",
      "COUT   ligne 5, par differences finies    2p propagations avant",
      "       ligne 5, par l'algorithme du ch. 4  1 propagation avant",
    ].join("\n"),
    surlignees: [5, 6],
  },
  {
    id: "b-d12-26",
    type: "animation",
    ancre: "la-norme-du-gradient-decroit",
    animationId: "la-norme-du-gradient-decroit",
    legende:
      "Le vecteur gradient relevé à cinq époques, à sa norme mesurée : il raccourcit d'une époque à l'autre sans jamais s'annuler.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.5 · Erreurs fréquentes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-27",
    type: "titre",
    niveau: 2,
    texte: "Erreurs fréquentes",
  },
  {
    id: "b-d12-28",
    type: "tableau",
    ancre: "erreurs-frequentes",
    cleEnTete: true,
    entetes: ["L'erreur", "Ce qui est vrai"],
    lignes: [
      [
        "**Confondre $\\ell$ et $C_{\\mathcal{D}}$**",
        "$\\ell$ prend une **sortie** et une étiquette, $C_{\\mathcal{D}}$ prend des **paramètres**. Ils ne vivent pas dans le même espace, et on ne minimise que le second",
      ],
      [
        "Écrire $C(\\boldsymbol{\\theta},\\mathcal{D})$",
        "$\\mathcal{D}$ est fixé et n'est jamais dérivé : c'est un paramètre de la définition, que l'indice en bas note",
      ],
      [
        "Confondre $\\boldsymbol{\\theta}_{t}$ et $\\theta_{i}$",
        "$t$ est une **itération**, $i$ une **composante**. Dans ce chapitre les deux lettres sont réservées, sans exception",
      ],
      [
        "Croire qu'on minimise le taux d'erreur",
        "Son gradient est nul partout où il existe : on minimise $C_{\\mathcal{D}}$ en espérant que $E$ suive, et rien ne le garantit",
      ],
      [
        "Croire que le signe moins est une convention",
        "C'est le seul signe qui rende le terme dominant $-\\eta\\,C'(\\theta_{t})^{2}$ négatif dans les deux cas de figure",
      ],
      [
        "Croire que la proposition 2 donne un seuil sur $\\eta$",
        "Elle dit « pour $\\eta$ assez petit » sans quantifier. Le seuil se cherche par balayage, et son calcul est ailleurs",
      ],
      [
        "Croire qu'un $\\eta$ trop grand fait juste converger plus lentement",
        "$\\eta=10$ et $\\eta=0{,}001$ échouent pour des raisons **opposées** : le premier ne descend rien, le second n'a pas fini",
      ],
      [
        "Croire qu'un mini-lot donne le bon gradient",
        "Il donne un gradient à $40{,}6$ degrés du bon, à $B=64$. Il est seulement **sans biais** : juste en moyenne, jamais sur un tirage",
      ],
      [
        "Croire que doubler $B$ divise l'erreur par deux",
        "L'écart décroît comme $1/B$ et l'angle comme $1/\\sqrt{B}$ : quadrupler $B$ divise l'angle par deux",
      ],
      [
        "Croire que le gradient est une pente, donc un nombre",
        "C'est un **vecteur** de $\\mathbb{R}^{p}$, de même dimension que $\\boldsymbol{\\theta}$. C'est sa **norme** qui est un nombre, et elle mesure la raideur",
      ],
      [
        "Croire qu'un même $\\eta$ déplace tous les paramètres d'autant",
        "Le pas effectif est $\\eta\\,|g_{i}|$, et $|g_{i}|$ varie d'un facteur $404$ entre la plus grande composante et la médiane",
      ],
      [
        "Chercher « le » minimum",
        "$\\arg\\min$ contient au moins $128!$ points, et trois graines donnent trois solutions quasiment orthogonales, toutes bonnes",
      ],
      [
        "Croire que la descente peut sortir d'un creux",
        "Arrivée en un point critique, elle est immobile pour toujours : la mise à jour y devient l'identité. C'est là que l'image de la bille trompe",
      ],
      [
        "Croire que les différences finies sont fausses",
        "Elles sont **correctes**, puisqu'elles ont produit toutes les vérifications de ce chapitre, et inutilisables pour entraîner : $203\\,540$ propagations avant par gradient",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.6 · Récapitulatif des vérifications
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-29",
    type: "titre",
    niveau: 2,
    texte: "Les quatorze vérifications de ce chapitre",
  },
  {
    id: "b-d12-30",
    type: "texte",
    texte:
      "La numérotation est continue sur tout le parcours : les numéros $8$ à $20$ sont au chapitre 2, et ceux-ci vont de $21$ à $34$.",
  },
  {
    id: "b-d12-31",
    type: "tableau",
    ancre: "recapitulatif-verifications",
    cleEnTete: true,
    entetes: ["N°", "Page", "Section", "Ce qu'elle demande"],
    lignes: [
      [
        "21",
        "3",
        "Le problème, écrit",
        "Les ensembles de $f_{\\boldsymbol{\\theta}}$ et de $C_{\\mathcal{D}}$, et pourquoi ils diffèrent",
      ],
      [
        "22",
        "4",
        "Comment fait-on pire que le hasard",
        "Comment un réseau non entraîné dépasse $\\ln 10$",
      ],
      [
        "23",
        "5",
        "Deux candidates",
        "Classer quatre sorties par coût, avec chacune des deux pertes",
      ],
      [
        "24",
        "6",
        "Le jeu n'est pas une variable",
        "Le statut de $\\mathcal{D}$, justifié par ce qu'on dérive",
      ],
      [
        "25",
        "7",
        "Proposition 1",
        "Les $60\\,001$ valeurs du taux d'erreur, et le gradient nul qui s'en déduit",
      ],
      [
        "26",
        "7",
        "Proposition 2",
        "La suite $\\theta_{t+1}=\\lambda\\theta_{t}$ pour $\\eta=0{,}25$ et $\\eta=1{,}1$",
      ],
      [
        "27",
        "8",
        "Le gradient",
        "Sa dimension pour deux architectures, et si elle dépend de $N$",
      ],
      [
        "28",
        "8",
        "Le taux d'apprentissage",
        "Si les échecs à $\\eta=10$ et $\\eta=0{,}001$ sont de même nature",
      ],
      [
        "29",
        "9",
        "Proposition 5",
        "L'angle correspondant à $\\cos=0{,}7587$, et pourquoi ça marche",
      ],
      [
        "30",
        "9",
        "Proposition 5",
        "Le cosinus attendu pour $B=256$, par interpolation",
      ],
      [
        "31",
        "10",
        "La distribution",
        "Ce que le rapport $404$ dit d'un même pas appliqué à tous les poids",
      ],
      [
        "32",
        "11",
        "Proposition 6",
        "Le compte des minimiseurs pour $h=16$ puis $h=128$",
      ],
      [
        "33",
        "11",
        "Trois graines",
        "Le cosinus déduit d'une distance relative de $1{,}3991$",
      ],
      [
        "34",
        "11",
        "La ligne de partage",
        "Quelles quantités deux implémentations indépendantes doivent trouver identiques",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.7 · La suite
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d12-32",
    type: "titre",
    niveau: 2,
    texte: "La suite du parcours",
  },
  {
    id: "b-d12-fig28",
    type: "image",
    ancre: "deux-cent-mille-contre-un",
    src: "/cours/lecon3/l3-fig28-deux-cent-mille-contre-un.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Deux barres horizontales. Celle du haut, en brique, traverse toute la largeur de la figure sous la mention différences finies, et porte à droite le nombre deux cent trois mille cinq cent quarante. Celle du bas, à l'encre, est un trait à peine visible sous la mention au chapitre 4, et porte à droite le nombre un. Dessous se lit rapport, suivi du même nombre que la première barre.",
    legende:
      "Le nombre de propagations avant que demande un seul gradient, par les deux procédés.",
  },
  {
    id: "b-d12-33",
    type: "texte",
    texte:
      "Tout ce chapitre repose sur la ligne $5$ de l'algorithme, et c'est par différences finies qu'il l'a vérifiée : $2p=203\\,540$ propagations avant par gradient, une heure et demie par pas sur ce poste, et environ **cinq années** pour un entraînement de $28\\,140$ mises à jour, quand le même entraînement mené autrement prend une minute.",
  },
  {
    id: "b-d12-34",
    type: "texte",
    texte:
      "C'est précisément cet écart qui rend la suite nécessaire. Il existe un algorithme qui obtient les $101\\,770$ composantes en **une** propagation avant et une passe en sens inverse, exactement et non approximativement, et il porte un nom : la **rétropropagation**. Ce chapitre l'a utilisé sans le nommer, puisque c'est lui qui a entraîné tous les réseaux dont les mesures sortent, et les différences finies n'ont servi qu'à le contrôler. Le chapitre 4 dit ce qu'il fait, avant tout calcul ; le chapitre 5 le calcule.",
  },
  {
    id: "b-d12-36",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du **deuxième chapitre de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les six propositions, les onze mesures et les animations sont propres à ce cours. Cinq écarts délibérés y ont été pris : l'entropie croisée retenue au lieu du coût quadratique et tranchée par une mesure, le gradient écrit $\\mathrm{grad}_{\\boldsymbol{\\theta}}$ et non avec un nabla, les différences finies données puis chiffrées comme inutilisables, onze mesures là où la source n'en fait aucune, et une page entière consacrée aux mini-lots que la source ne traite pas.",
  },
];
