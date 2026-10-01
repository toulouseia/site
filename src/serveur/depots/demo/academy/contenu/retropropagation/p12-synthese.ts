import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 12 · Synthèse, formulaire et erreurs fréquentes
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig15-le-trajet`. Aucune page n'avait montré le retour ENTIER : chacune
// en démontrait une étape, et le formulaire les alignait sans dire dans quel
// ordre elles s'exécutent ni ce qu'on récolte au passage.
//
// Synthèse · formulaire · tableau des objets (symbole, signification, ensemble
// d'appartenance, dimension, rôle) · algorithme complet en pseudo-code · dix
// erreurs fréquentes · question de vérification · suite du parcours.
//
// LE BLOC ANIMATION `les-erreurs-frequentes-se-rayent` EST RETIRE. Sa scene a
// ete supprimee par le chantier des animations --
// `animations/scenes/retropropagation/IDS.md` : « Ce sont des phrases : la
// regle du chapitre n'en admet aucune dans une animation ». Le tableau des
// erreurs frequentes, juste au-dessus, disait deja ce que la scene montrait.
//
// Il a ete le premier des vingt jetes a partir, parce qu'il etait deja tombe
// du manifeste et faisait echouer `verifier-contenu`. La fusion a retire les
// dix-neuf autres et regenere le manifeste ensuite, dans cet ordre.
//
// Mention de source, comme en page 1.
// ─────────────────────────────────────────────────────────────────────────────

export const R12_SYNTHESE: Bloc[] = [
  {
    id: "b-rp12-0",
    type: "texte",
    texte:
      "Le retour est passé par six étapes, chacune établie sur sa page, et le formulaire les alignera sans dire ce qu'on récolte à chaque pas. Dans quel ordre s'exécutent-elles, et que récolte-t-on au passage ?",
  },
  {
    id: "b-rp12-0f",
    type: "image",
    ancre: "le-trajet",
    src: "/cours/lecon4/l4-fig15-le-trajet.svg",
    largeur: 1380,
    hauteur: 920,
    alt: "Trois cadres empilés, reliés de haut en bas par des flèches. Le premier porte l'opération a de la couche deux moins y, et sous elle le nom de ce qu'elle produit, le signal d'erreur de la couche deux ; deux flèches de brique en partent vers la droite et mènent au gradient des biais de la couche deux et au gradient de la matrice de la couche deux. Le deuxième porte la transposée de la seconde matrice appliquée à ce signal, et produit la demande sur les activations de la couche un. Le troisième porte le produit terme à terme par la dérivée de ReLU, et produit le signal d'erreur de la couche un ; deux flèches de brique en partent vers le gradient des biais et le gradient de la matrice de la couche un. À gauche, trois notes : l'étiquette entre au premier cadre, la matrice est lue en colonnes au deuxième, la porte est décidée à l'aller au troisième. En pied, la mention que sur tout le jeu on en fait la moyenne.",
    legende:
      "La colonne du milieu porte ce qui se transmet ; les deux flèches de droite portent ce qui se récolte et ne repart pas.",
  },
  {
    id: "b-rp12-0g",
    type: "texte",
    texte:
      "Chaque cadre transforme ce qu'il reçoit en un objet neuf, et les quatre gradients tombent en chemin, sans qu'il faille repasser par le réseau.\n\nLes trois notes de gauche disent d'où vient ce qui entre dans chaque cadre : l'étiquette au premier, la matrice de la couche de sortie au deuxième, et au troisième la porte, dont l'ouverture a été décidée à l'aller par le signe de $\\mathbf{z}^{[1]}$.",
  },
  {
    id: "b-rp12-1",
    type: "titre",
    niveau: 2,
    texte: "Le trajet, d'un bout à l'autre",
  },
  {
    id: "b-rp12-2",
    type: "texte",
    texte:
      "Une image traverse le réseau et donne dix activations, l'étiquette dit ce qu'elles devraient être, et la différence $\\mathbf{a}^{[2]}-\\mathbf{y}$ est le signal d'erreur, dont une seule composante est négative, celle de la vraie classe, qui pèse autant que les neuf autres réunies.\n\nCe signal se transforme sans autre calcul en gradient des biais de sortie, et en produit extérieur avec les activations cachées pour le gradient des poids, d'où la proportionnalité exacte à l'activation.\n\nReporté sur la couche cachée par la transposée de la matrice, qui redistribue au retour ce qu'elle avait collecté à l'aller, il traverse $\\mathrm{ReLU}$, qui coupe ce qui arrive à un neurone éteint, et redevient un signal d'erreur. S'il y avait une couche de plus, la même mécanique recommencerait un cran plus bas. Sur tout le jeu, la moyenne de ces corrections est le gradient du coût, exactement.",
  },
  {
    id: "b-rp12-3",
    type: "animation",
    ancre: "londe-revient-de-la-sortie",
    animationId: "londe-revient-de-la-sortie",
    legende:
      "La vague remonte de la sortie vers l'entrée, couche après couche.",
  },
  {
    id: "b-rp12-4",
    type: "titre",
    niveau: 2,
    texte: "Formulaire",
  },
  {
    id: "b-rp12-5",
    type: "formule",
    ancre: "formulaire",
    latex:
      "\\begin{aligned}\\boldsymbol{\\delta}^{[2]}&=\\mathbf{a}^{[2]}-\\mathbf{y}\\\\ \\mathrm{grad}_{\\mathbf{b}^{[2]}}\\,\\ell&=\\boldsymbol{\\delta}^{[2]}\\\\ \\mathrm{grad}_{W^{[2]}}\\,\\ell&=\\boldsymbol{\\delta}^{[2]}\\big(\\mathbf{a}^{[1]}\\big)^{\\mathsf{T}}\\\\ \\mathrm{grad}_{\\mathbf{a}^{[1]}}\\,\\ell&=\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\\\ \\boldsymbol{\\delta}^{[1]}&=\\Big[\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\Big]\\odot\\mathrm{ReLU}'\\big(\\mathbf{z}^{[1]}\\big)\\\\ \\mathrm{grad}_{\\mathbf{b}^{[1]}}\\,\\ell&=\\boldsymbol{\\delta}^{[1]}\\\\ \\mathrm{grad}_{W^{[1]}}\\,\\ell&=\\boldsymbol{\\delta}^{[1]}\\mathbf{x}^{\\mathsf{T}}\\\\ \\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}&=\\tfrac{1}{N}\\textstyle\\sum_{n}\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell_{n}\\end{aligned}",
    alt: "Le formulaire du chapitre en huit lignes : delta de la couche deux vaut a moins y ; le gradient des biais de sortie est delta ; celui des poids de sortie est le produit extérieur de delta par a de la couche un transposé ; le gradient des activations cachées est la transposée de W appliquée à delta ; delta de la couche un est ce vecteur multiplié terme à terme par la dérivée de ReLU ; le gradient des biais cachés est delta de la couche un ; celui des poids de la première couche est le produit extérieur de delta de la couche un par x transposé ; et le gradient du coût est la moyenne des gradients des exemples.",
    numero: "4.14",
  },
  {
    id: "b-rp12-6",
    type: "titre",
    niveau: 2,
    texte: "Les objets du chapitre",
  },
  {
    id: "b-rp12-7",
    type: "tableau",
    ancre: "tableau-des-objets",
    cleEnTete: true,
    entetes: [
      "Symbole",
      "Signification",
      "Ensemble",
      "Dimension",
      "Rôle",
    ],
    lignes: [
      [
        "$\\boldsymbol{\\delta}^{[l]}$",
        "Signal d'erreur de la couche $l$",
        "$\\mathbb{R}^{d_{l}}$",
        "$d_{l}\\times 1$",
        "Tout ce qu'il faut savoir de l'aval pour dériver la couche $l$",
      ],
      [
        "$\\mathbf{u}\\odot\\mathbf{v}$",
        "Produit de Hadamard",
        "$\\mathbb{R}^{m}$",
        "$m\\times 1$",
        "Appliquer la porte d'activation, sans mélanger les indices",
      ],
      [
        "$\\mathbf{u}\\mathbf{v}^{\\mathsf{T}}$",
        "Produit extérieur",
        "$\\mathcal{M}_{m,n}(\\mathbb{R})$",
        "$m\\times n$",
        "Écrire d'un coup les $mn$ dérivées d'une matrice de poids",
      ],
      [
        "$\\mathrm{ReLU}'(u)$",
        "$\\mathbb{1}\\{u>0\\}$, convention $\\mathrm{ReLU}'(0)=0$",
        "$\\{0,1\\}$",
        "scalaire, appliqué composante par composante",
        "Décider si un neurone laisse passer le signal de retour",
      ],
      [
        "$\\ell_{n}$",
        "Perte de l'exemple $n$, vue comme fonction des paramètres",
        "$\\mathbb{R}^{p}\\rightarrow\\mathbb{R}_{\\geq 0}$",
        "$p=101\\,770$ en entrée",
        "Ce qu'on dérive. **À ne pas confondre** avec le $\\ell$ du chapitre 2, qui prend une sortie et une étiquette",
      ],
      [
        "$C_{\\mathcal{D}}$",
        "Coût sur le jeu",
        "$\\mathbb{R}^{p}\\rightarrow\\mathbb{R}_{\\geq 0}$",
        "$p$ en entrée",
        "Ce que la descente minimise",
      ],
      [
        "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell_{n}$",
        "Gradient de la perte d'un exemple",
        "$\\mathbb{R}^{p}\\rightarrow\\mathbb{R}^{p}$",
        "$p\\times 1$ en sortie",
        "Ce que l'algorithme calcule",
      ],
    ],
  },
  {
    id: "b-rp12-8",
    type: "encart",
    ton: "rappel",
    titre: "Les indices, tenus dans tout le chapitre",
    texte:
      "$k$ indexe la couche de **sortie**, $j$ la couche **cachée**, $i$ les **pixels** d'entrée ; $W^{[l]}$ désigne la couche $l$ et $\\theta_{t}$ l'itération $t$. La lettre $i$ change de rôle en un seul endroit, la formule (4.1), où $\\theta_{i}$ est la $i$-ième composante de $\\boldsymbol{\\theta}$. Partout ailleurs la convention n'a pas varié, et $W_{kj}^{[2]}$ se lit toujours « le poids qui va du neurone caché $j$ vers le neurone de sortie $k$ ».",
  },
  {
    id: "b-rp12-9",
    type: "titre",
    niveau: 2,
    texte: "L'algorithme, en pseudo-code",
  },
  {
    id: "b-rp12-10",
    type: "code",
    langage: "text",
    titre: "Un gradient d'exemple, de bout en bout",
    code:
      "ENTRÉE   x (784), c la classe, theta = {W1, b1, W2, b2}\nSORTIE   grad_W1, grad_b1, grad_W2, grad_b2\n\nALLER\n  x reçu                                   garder x\n  z1 <- W1 x + b1                          garder z1\n  a1 <- ReLU(z1)                           garder a1\n  z2 <- W2 a1 + b2\n  a2 <- softmax(z2)                        garder a2\n\nRETOUR\n  d2      <- a2 - onehot(c)                (10)\n  grad_b2 <- d2                            (10)\n  grad_W2 <- d2 a1^T                       (10, 128)\n  d1      <- (W2^T d2) ⊙ ReLU'(z1)         (128)\n  grad_b1 <- d1                            (128)\n  grad_W1 <- d1 x^T                        (128, 784)\n\nCOÛT     1 propagation avant, 1 propagation arrière\n         1 050 nombres gardés entre les deux",
  },
  {
    id: "b-rp12-11",
    type: "titre",
    niveau: 2,
    texte: "Erreurs fréquentes",
  },
  {
    id: "b-rp12-12",
    type: "tableau",
    ancre: "erreurs-frequentes",
    cleEnTete: true,
    entetes: ["Ce qu'on écrit", "Ce qu'il faut écrire", "Page"],
    lignes: [
      [
        "La rétropropagation approche le gradient",
        "Elle le calcule **exactement**, puisque c'est la règle de la chaîne organisée et non une méthode numérique. Ce sont les différences finies qui approchent",
        "2",
      ],
      [
        "On retient la demande la plus forte parmi les dix",
        "On les **additionne**, parce que la règle de la chaîne à plusieurs chemins l'impose ; retenir la plus forte donnerait $+0{,}022372$ au lieu de $+0{,}006402$",
        "8",
      ],
      [
        "$\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\mathbf{a}^{[1]}(\\boldsymbol{\\delta}^{[2]})^{\\mathsf{T}}$",
        "$\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}(\\mathbf{a}^{[1]})^{\\mathsf{T}}$, car les deux produits existent et donnent $128\\times 10$ contre $10\\times 128$, et seul le second a la forme de $W^{[2]}$",
        "5",
      ],
      [
        "Une dérivée nulle veut dire un poids nul",
        "Elle veut dire que **la perte ne dépend pas** de ce poids sur cet exemple, parce que l'activation ou le pixel est nul. Le poids, lui, vaut ce qu'il vaut",
        "9",
      ],
      [
        "La dérivée par rapport au biais dépend des activations",
        "Elle vaut $\\delta_{k}$ et rien d'autre, ce qui distingue la voie du biais des deux autres",
        "4",
      ],
      [
        "La transposée est là pour que les dimensions tombent juste",
        "Elle **est** la redistribution : la colonne $j$ de $W^{[2]}$ rend à l'activation $j$ ce que la ligne $k$ lui avait pris à l'aller",
        "8",
      ],
      [
        "Le réseau « pense » que l'image est un 2",
        "Il ne pense rien : l'étiquette impose la réponse attendue, et c'est elle qui rend $\\delta_{2}$ négatif",
        "6",
      ],
      [
        "Un neurone éteint reçoit une petite correction",
        "Il n'en reçoit **aucune**, puisque la porte annule sa composante et que les dix poids qui partent de lui ont une dérivée exactement nulle",
        "5 et 9",
      ],
      [
        "La moyenne des corrections est proportionnelle au gradient",
        "Elle **est** le gradient, sans facteur ni approximation : c'est la linéarité de la dérivation",
        "10",
      ],
      [
        "$\\boldsymbol{\\delta}$ est le gradient par rapport aux activations",
        "$\\boldsymbol{\\delta}^{[l]}=\\mathrm{grad}_{\\mathbf{z}^{[l]}}\\,\\ell$, par rapport aux **sommes pondérées**. Les deux diffèrent d'un facteur $\\mathrm{ReLU}'$, et le neurone $0$ de la mesure 3 les sépare : $-0{,}009335$ contre $0$",
        "3 et 9",
      ],
    ],
  },
  {
    id: "b-rp12-14",
    type: "titre",
    niveau: 2,
    texte: "Les 🧪 de ce chapitre",
  },
  {
    id: "b-rp12-15",
    type: "tableau",
    ancre: "recapitulatif-verifications",
    cleEnTete: true,
    entetes: ["n°", "Page", "Ce qu'elle contrôle"],
    lignes: [
      ["35", "3", "La somme nulle et l'égalité $|\\delta_{c}|=\\sum_{k\\neq c}|\\delta_{k}|$, sur les nombres"],
      ["36", "4", "Le sens de la poussée d'un biais, lu sur le signe de la dérivée"],
      ["37", "4", "Pourquoi la dérivée d'un biais ne dépend d'aucune activation"],
      ["38", "5", "Le rapport de deux corrections de poids d'une même ligne"],
      ["39", "5", "Ce que devient un poids qui part d'un neurone éteint"],
      ["40", "6", "Le signe qui décide qu'un poids augmente, et la classe qu'il désigne"],
      ["41", "6", "Les deux raisons pour lesquelles l'analogie de Hebb est inexacte"],
      ["42", "7", "Le sens demandé à une activation reliée par un poids négatif"],
      ["43", "8", "Pourquoi on somme les dix demandes plutôt que d'en choisir une"],
      ["44", "8", "Les dimensions de $(W^{[2]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}$, et celles du produit sans transposition"],
      ["45", "9", "Le compte des lignes et des colonnes nulles de $\\mathrm{grad}_{W^{[1]}}\\,\\ell$"],
      ["46", "10", "D'où vient la précision $0{,}1032$ d'un réseau qui répond toujours $2$"],
      ["47", "10", "Ce que dit un cosinus de $-0{,}03$ entre deux gradients d'exemples"],
      ["48", "11", "Pourquoi l'écart relatif et l'écart absolu ne classent pas les blocs pareil"],
    ],
  },
  {
    id: "b-rp12-16",
    type: "exercice",
    titre: "Contrôle final",
    minutes: 15,
    enonce:
      "Un réseau $784\\rightarrow 32\\rightarrow 10$, même structure, même perte. Une image dont $200$ pixels sont non nuls, et pour laquelle $12$ neurones cachés sont allumés. Répondre sans écrire une seule ligne de code.",
    attendu:
      "Les quatre dimensions, le compte total de coefficients, les deux comptes de zéros, et le nombre de propagations avant des différences finies centrées.",
    indices: [
      "Les dimensions se lisent sur la formule (4.13), en remplaçant $128$ par $32$.",
      "Un coefficient de $\\mathrm{grad}_{W^{[1]}}\\,\\ell$ vaut $\\delta_{j}^{[1]}x_{i}$ : il est nul dès que l'un des deux facteurs l'est.",
      "Un coefficient de $\\mathrm{grad}_{W^{[2]}}\\,\\ell$ vaut $\\delta_{k}^{[2]}a_{j}^{[1]}$, et $\\delta_{k}^{[2]}$ n'est jamais nul, par la proposition 1.",
    ],
    correction:
      "Dimensions : $\\mathrm{grad}_{W^{[1]}}\\,\\ell$ est $32\\times 784$, $\\mathrm{grad}_{\\mathbf{b}^{[1]}}\\,\\ell$ est $32\\times 1$, $\\mathrm{grad}_{W^{[2]}}\\,\\ell$ est $10\\times 32$, $\\mathrm{grad}_{\\mathbf{b}^{[2]}}\\,\\ell$ est $10\\times 1$. Total $p=32\\times 784+32+10\\times 32+10=25\\,450$. Zéros de la première couche : $32\\times 784-12\\times 200=25\\,088-2\\,400=22\\,688$. Zéros de la seconde : les $32-12=20$ colonnes des neurones éteints, soit $10\\times 20=200$ sur $320$. Différences finies centrées : $2p=50\\,900$ propagations avant, contre une seule pour l'algorithme.",
  },
  {
    id: "b-rp12-17",
    type: "titre",
    niveau: 2,
    texte: "La suite du parcours",
  },
  {
    id: "b-rp12-18",
    type: "texte",
    ancre: "suite",
    texte:
      "Tout ce qui précède porte sur deux couches et sur $\\mathrm{ReLU}$, et les identités ne changeront pas de nature, mais leur écriture doit cesser de nommer $W^{[2]}$ et $\\mathrm{ReLU}'$ pour valoir en général.\n\nC'est l'objet du chapitre 5 : la règle de la chaîne multivariée sous forme jacobienne, la récursion qui donne $\\boldsymbol{\\delta}^{[l]}$ à partir de $\\boldsymbol{\\delta}^{[l+1]}$, et le traitement d'une fonction d'activation quelconque.",
  },
  {
    id: "b-rp12-19",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du **chapitre sur la rétropropagation de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les sept propositions, les huit mesures et les animations sont propres à ce cours. Quatre écarts y sont pris et signalés : l'entropie croisée au lieu du coût quadratique, page 2 ; la réserve « en gros le gradient » levée, page 10 ; la sensibilité chiffrée par la mesure du chapitre 3 plutôt que par un exemple inventé, page 2 ; et la vérification numérique de chaque identité, page 11.",
  },
];
