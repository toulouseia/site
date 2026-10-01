import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 12 · Synthèse de la série
//
// CE N'EST PAS LA SYNTHÈSE DU SEUL CHAPITRE 5. Elle reprend les cinq
// chapitres : ce qu'un réseau est, ce qu'apprendre veut dire, comment on
// descend, ce que fait la rétropropagation, comment elle se calcule.
//
// Ouverture, règle 26 : la question, la figure l5-fig12-synthese, le cadre.
//
// Puis le formulaire et les résultats qu'il rassemble, énoncé par énoncé ; le
// tableau des objets ; l'algorithme complet ; les erreurs fréquentes ; une
// question de vérification, portée par un bloc `exercice` pour ne pas ouvrir
// un quinzième numéro de 🧪 ; les ressources avec leurs auteurs.
//
// LA MENTION DE LA SOURCE EST ICI, ET NULLE PART AILLEURS. Elle tient en trois
// points : l'ordre des notions, ce qui est propre à ce cours, et le fait que
// chaque écart est signalé à la page où il se produit.
// ─────────────────────────────────────────────────────────────────────────────

export const C12_SYNTHESE: Bloc[] = [
  {
    id: "b-cr12-0",
    type: "texte",
    texte:
      "Qu'est-ce qu'un réseau, au juste, une fois les cinq chapitres derrière soi ?",
  },
  {
    id: "b-cr12-6f",
    type: "image",
    ancre: "aller-et-retour",
    src: "/cours/lecon5/l5-fig12-synthese.svg",
    largeur: 1380,
    hauteur: 960,
    alt: "Une couche, vue deux fois. En haut, l'aller se lit de gauche à droite, en encre : l'activation de la couche précédente, puis la somme pondérée z exposant l, puis l'activation a exposant l. En bas, le retour se lit de droite à gauche, en brique : le signal d'erreur de la couche suivante, puis le signal d'erreur delta exposant l, puis le gradient par rapport à l'activation précédente. Deux traits descendent de la rangée du haut vers celle du bas : l'un part de la somme pondérée, l'autre part de l'activation de la couche précédente. En pied, trois formules : le signal d'erreur d'une couche, le gradient par rapport à la matrice de poids, et le gradient par rapport au biais.",
    legende:
      "L'aller garde exactement ce que le retour consomme : la somme pondérée pour traverser l'activation, et l'activation de la couche précédente pour le gradient du poids.",
  },
  {
    id: "b-cr12-2",
    type: "texte",
    texte:
      "Un modèle est une fonction à paramètres, et apprendre consiste à choisir ces paramètres à partir d'exemples. Un réseau de neurones enchaîne des couches dont chacune applique une matrice puis une fonction composante par composante : c'est la multiplication matricielle qui porte la propagation. Le coût transforme « le réseau se trompe » en un nombre dérivable, et minimiser ce nombre, c'est descendre la direction $-\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$. La rétropropagation est ce qui rend ce gradient calculable : elle décompose un réseau d'influences en une chaîne de dépendances, et la règle de la chaîne en donne chaque terme.",
  },
  {
    id: "b-cr12-1",
    type: "titre",
    niveau: 2,
    texte: "Ce que chaque chapitre ajoute",
  },
  {
    id: "b-cr12-3",
    type: "tableau",
    ancre: "les-cinq-chapitres",
    cleEnTete: true,
    entetes: ["Chapitre", "Ce qu'il établit", "L'objet qu'il ajoute"],
    lignes: [
      [
        "1 · Panorama",
        "Ce qu'est un modèle, une perte, un jeu de données",
        "$\\boldsymbol{\\theta}$, $\\ell$, $\\mathcal{D}$",
      ],
      [
        "2 · Le réseau",
        "Ce qu'un réseau calcule, et ce que ses poids valent",
        "$W^{[l]}$, $\\mathbf{b}^{[l]}$, $\\mathrm{softmax}$",
      ],
      [
        "3 · L'optimisation",
        "Pourquoi cette direction, ce pas, cette initialisation",
        "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$, $\\eta$, la différence finie",
      ],
      [
        "4 · La rétropropagation",
        "Ce que fait l'algorithme, sur deux couches",
        "$\\boldsymbol{\\delta}^{[l]}$, $\\odot$, le produit extérieur",
      ],
      [
        "5 · Le calcul",
        "Sa forme générale, démontrée par récurrence",
        "$\\varphi$ quelconque, $J_{f}$, $\\mathrm{diag}$",
      ],
    ],
  },
  {
    id: "b-cr12-5",
    type: "titre",
    niveau: 2,
    texte: "Formulaire",
  },
  {
    id: "b-cr12-6",
    type: "formule",
    ancre: "formulaire-final",
    latex:
      "\\begin{aligned}\\mathbf{z}^{[l]}&=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}, & \\mathbf{a}^{[l]}&=\\varphi\\big(\\mathbf{z}^{[l]}\\big)\\\\ \\boldsymbol{\\delta}^{[L]}&=\\mathbf{a}^{[L]}-\\mathbf{y}, & \\boldsymbol{\\delta}^{[l]}&=\\big[\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}\\big]\\odot\\varphi'\\big(\\mathbf{z}^{[l]}\\big)\\\\ \\mathrm{grad}_{W^{[l]}}\\,\\ell&=\\boldsymbol{\\delta}^{[l]}\\big(\\mathbf{a}^{[l-1]}\\big)^{\\mathsf{T}}, & \\mathrm{grad}_{\\mathbf{b}^{[l]}}\\,\\ell&=\\boldsymbol{\\delta}^{[l]}\\\\ \\frac{\\partial\\ell}{\\partial a^{[l-1]}_{j}}&=\\sum_{i=1}^{d_{l}}\\delta^{[l]}_{i}W^{[l]}_{ij}, & J_{\\mathbf{a}^{[l]}}\\big(\\mathbf{z}^{[l]}\\big)&=\\mathrm{diag}\\big(\\varphi'(\\mathbf{z}^{[l]})\\big)\\end{aligned}",
    alt: "Huit formules. La somme pondérée et l'activation d'une couche. Le signal d'erreur de sortie et sa récurrence. Le gradient par rapport à la matrice de poids et par rapport au biais. La dérivée par rapport à une activation comme somme sur les chemins, et la jacobienne diagonale de l'activation.",
    numero: "5.13",
  },
  {
    id: "b-cr12-6r",
    type: "tableau",
    ancre: "les-resultats",
    cleEnTete: true,
    entetes: ["Ce qui est établi", "Démontré page"],
    lignes: [
      ["Ce dont dépend la perte, décomposé en trois rapports", "4"],
      ["Les trois dérivées constitutives, chacune sous son équation", "5"],
      ["Le poids et le biais de la dernière couche", "6"],
      ["L'activation de la couche précédente", "7"],
      ["Le signal d'erreur se transporte d'une couche à la précédente", "8"],
      ["Le poids, quand la couche a plusieurs neurones", "9"],
      ["L'activation, quand plusieurs chemins y mènent", "9"],
      ["Le retour, écrit sans indices", "10"],
      ["Ce que coûtent une passe avant et une passe retour", "11"],
    ],
  },
  {
    id: "b-cr12-7",
    type: "titre",
    niveau: 2,
    texte: "Le tableau des objets",
  },
  {
    id: "b-cr12-8",
    type: "tableau",
    ancre: "tableau-des-objets",
    cleEnTete: true,
    entetes: ["Objet", "Type", "Défini où"],
    lignes: [
      ["$L$, $d_{0},\\dots,d_{L}$", "Entiers", "Page 9"],
      ["$W^{[l]}$", "$\\mathcal{M}_{d_{l},d_{l-1}}(\\mathbb{R})$", "Page 9"],
      ["$\\mathbf{b}^{[l]}$, $\\mathbf{z}^{[l]}$, $\\mathbf{a}^{[l]}$, $\\boldsymbol{\\delta}^{[l]}$", "$\\mathbb{R}^{d_{l}}$", "Pages 9 et 8"],
      ["$\\varphi$, $\\varphi'$", "$\\mathbb{R}\\rightarrow\\mathbb{R}$, appliquées composante par composante", "Page 5"],
      ["$J_{f}(\\mathbf{u})$", "$\\mathcal{M}_{m,n}(\\mathbb{R})$", "Page 10"],
      ["$\\mathrm{diag}(\\mathbf{u})$", "$\\mathcal{M}_{n,n}(\\mathbb{R})$, nulle hors diagonale", "Page 10"],
      ["$\\odot$", "Produit composante par composante", "Chapitre 4"],
      ["$p$", "Entier, formule (5.8)", "Page 9"],
    ],
  },
  {
    id: "b-cr12-9",
    type: "titre",
    niveau: 2,
    texte: "L'algorithme complet",
  },
  {
    id: "b-cr12-10",
    type: "code",
    ancre: "algorithme-complet",
    langage: "text",
    titre: "Gradient de la perte d'un exemple, réseau à L couches",
    code: `entree   theta = (W[1], b[1], ..., W[L], b[L]),  x,  y
sortie   grad W[1], grad b[1], ..., grad W[L], grad b[L]

  a[0] <- x
  pour l de 1 a L :                     # passe avant
      z[l] <- W[l] a[l-1] + b[l]
      si l < L : a[l] <- phi(z[l])
      sinon    : a[l] <- softmax(z[l])

  delta <- a[L] - y                     # passe arriere
  pour l de L a 1 :
      grad W[l] <- delta (a[l-1])^T
      grad b[l] <- delta
      si l > 1 :
          delta <- ((W[l])^T delta) ⊙ phi'(z[l-1])`,
    surlignees: [10, 15],
  },
  {
    id: "b-cr12-12",
    type: "titre",
    niveau: 2,
    texte: "Erreurs fréquentes",
  },
  {
    id: "b-cr12-13",
    type: "liste",
    ancre: "erreurs-frequentes",
    ordonnee: true,
    elements: [
      "**Appliquer la forme simple de la règle de la chaîne là où il y a un embranchement.** Dès que la couche a plusieurs neurones, $\\partial\\ell/\\partial a^{[l-1]}_{j}$ est une somme, pas un produit.",
      "**Lire $\\partial\\ell/\\partial w$ comme un quotient.** C'est une limite ; le quotient dépend de $h$, sa limite non.",
      "**Oublier que $\\varphi'$ s'évalue en $\\mathbf{z}^{[l]}$**, et non en $\\mathbf{a}^{[l]}$ ni en $\\mathbf{z}^{[l+1]}$.",
      "**Garder le facteur $\\varphi'$ à la dernière couche.** Avec une perte appariée à l'activation de sortie, définie page 6, il a déjà disparu dans $\\boldsymbol{\\delta}^{[L]}=\\mathbf{a}^{[L]}-\\mathbf{y}$ ; le remettre le compte deux fois.",
      "**Traîner un facteur $2$.** Il vient du coût quadratique, que ce parcours n'emploie pas.",
      "**Oublier la transposée dans la remontée.** $W^{[l+1]}\\boldsymbol{\\delta}^{[l+1]}$ n'a même pas les bonnes dimensions ; le contrôle est immédiat.",
      "**Confondre jacobienne et gradient.** Le gradient d'une fonction à valeurs réelles est la transposée de sa jacobienne, qui a alors une seule ligne.",
      "**Croire que le produit de Hadamard est une commodité d'écriture.** Il vient de ce que $J_{\\mathbf{a}^{[l]}}(\\mathbf{z}^{[l]})$ est diagonale, et elle l'est parce que $\\varphi$ agit composante par composante.",
      "**Traverser le softmax composante par composante.** Sa jacobienne n'est pas diagonale : $90$ coefficients hors diagonale non nuls, mesure 7.",
      "**Écrire $W^{[l]}_{ij}$ pour le poids allant du neurone $i$ vers le neurone $j$.** L'ordre est l'inverse, et il est celui de la matrice.",
      "**Conclure d'une vérification numérique qu'une identité est démontrée.** Une différence finie contrôle un cas, pas un énoncé.",
      "**Lire un écart relatif là où la dérivée est plus petite que le plancher d'arrondi.** Il ne mesure alors plus rien, mesure 4.",
    ],
  },
  {
    id: "b-cr12-14",
    type: "exercice",
    ancre: "question-de-verification",
    titre: "Question de vérification du chapitre",
    enonce:
      "Sur un réseau $\\;3\\rightarrow 4\\rightarrow 4\\rightarrow 2\\;$ avec $\\varphi=\\mathrm{ReLU}$ sur les couches cachées et $\\mathrm{softmax}$ en sortie, écrire les dimensions de $W^{[1]},W^{[2]},W^{[3]}$, de $\\boldsymbol{\\delta}^{[1]},\\boldsymbol{\\delta}^{[2]},\\boldsymbol{\\delta}^{[3]}$ et de $\\mathrm{grad}_{W^{[2]}}\\,\\ell$ ; puis compter $p$ par la formule (5.8), et majorer le coût du gradient en propagations avant.",
    attendu:
      "Sept dimensions, la valeur de $p$, et un majorant du coût.",
    indices: [
      "$W^{[l]}$ a $d_{l}$ lignes et $d_{l-1}$ colonnes, page 9.",
      "$\\boldsymbol{\\delta}^{[l]}$ a la dimension de $\\mathbf{z}^{[l]}$.",
      "Le gradient par rapport à une matrice a la forme de cette matrice.",
      "Le coût du gradient est majoré par $3$ propagations avant, page 11.",
    ],
    correction:
      "$W^{[1]}$ est $4\\times 3$, $W^{[2]}$ est $4\\times 4$, $W^{[3]}$ est $2\\times 4$. $\\boldsymbol{\\delta}^{[1]}$ et $\\boldsymbol{\\delta}^{[2]}$ sont dans $\\mathbb{R}^{4}$, $\\boldsymbol{\\delta}^{[3]}$ dans $\\mathbb{R}^{2}$. $\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}(\\mathbf{a}^{[1]})^{\\mathsf{T}}$ est $4\\times 4$. $p=(4\\cdot 3+4)+(4\\cdot 4+4)+(2\\cdot 4+2)=16+20+10=46$. Le coût du gradient est majoré par $3$ propagations avant, contre $2p=92$ pour les différences finies.",
    minutes: 12,
  },
  {
    id: "b-cr12-15",
    type: "titre",
    niveau: 2,
    texte: "Pour aller plus loin",
  },
  {
    id: "b-cr12-16",
    type: "tableau",
    ancre: "ressources-externes",
    cleEnTete: true,
    entetes: ["Ressource", "Auteur", "Ce qu'on y trouve"],
    lignes: [
      [
        "*Neural Networks and Deep Learning*",
        "Michael Nielsen",
        "Un livre en ligne qui démontre les quatre équations de la rétropropagation et les met en œuvre en Python.",
      ],
      [
        "*Calculus on Computational Graphs: Backpropagation*",
        "Christopher Olah",
        "Un billet qui traite la rétropropagation comme un parcours de graphe, et la rapproche de la différentiation en mode direct.",
      ],
      [
        "*Distill*",
        "Revue collective",
        "Des articles d'apprentissage automatique dont les figures sont interactives.",
      ],
      [
        "*Deep Learning*",
        "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        "Un ouvrage de référence dont le chapitre 6 couvre la différentiation automatique sur des graphes quelconques.",
      ],
    ],
  },
  {
    id: "b-cr12-18",
    type: "texte",
    texte:
      "La règle de la chaîne, dont chaque dérivation se sert, se démontre dans le bloc de mathématiques du parcours.",
  },
  {
    id: "b-cr12-19",
    type: "texte",
    texte:
      "L'ordre des notions suit celui du **dernier chapitre de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les démonstrations, les sept mesures et les vingt-huit animations sont propres à ce cours, et les écarts pris à la source sont signalés à la page où ils se produisent.",
  },
];
