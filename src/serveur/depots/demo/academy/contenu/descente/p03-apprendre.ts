import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 3 · Ce que veut dire apprendre
//
// La page qui transforme un mot en énoncé. Elle pose la différence entre les
// deux algorithmes, définit le jeu et sa provenance, renvoie la généralisation
// au chapitre d'évaluation, et écrit le problème :
//
//     trouver theta dans argmin C_D
//
// avec C_D encore à définir. argmin est défini comme un ENSEMBLE, et la figure
// 6 en montre les trois cas -- vide, ponctuel, infini -- sur trois fonctions
// d'une variable POSEES par le cours. La page 11 tient la promesse du cas
// infini sur le réseau lui-même.
//
// OUVERTURE : la question, puis les deux algorithmes côte à côte, puis le
// cadre. Règle 26.
// ─────────────────────────────────────────────────────────────────────────────

export const D03_APPRENDRE: Bloc[] = [
  {
    id: "b-d3-0",
    type: "texte",
    texte:
      "Une machine qui apprend exécute deux programmes, et un seul des deux est écrit par un humain. Lequel ?",
  },
  {
    id: "b-d3-fig05",
    type: "image",
    ancre: "deux-algorithmes",
    src: "/cours/lecon3/l3-fig05-deux-algorithmes.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Deux montages symétriques. À gauche, sous le titre celui qui reconnaît, une flèche portant la mention une image entre dans une boîte à l'encre nommée dix lignes, et une flèche en sort vers la mention dix nombres ; dessous se lit écrit au chapitre 2, puis son comportement vient de thêta. À droite, sous le titre celui qu'on écrit, une flèche portant la mention un thêta, le jeu entre dans une boîte en brique nommée cinq lignes, et une flèche en sort vers la mention un autre thêta ; dessous se lit écrit ici, puis il fabrique thêta.",
    legende:
      "Les deux boîtes ne reçoivent pas la même chose et ne rendent pas la même chose. C'est celle de droite que ce chapitre écrit.",
  },
  {
    id: "b-d3-1",
    type: "texte",
    texte:
      "Le mot « apprendre » ne désigne encore aucune opération mathématique, et tant qu'il n'est pas remplacé par un problème écrit en objets déjà définis, aucune procédure ne peut être évaluée.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.1 · Deux algorithmes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d3-2",
    type: "titre",
    niveau: 2,
    texte: "Deux algorithmes, et un seul est écrit à la main",
  },
  {
    id: "b-d3-3",
    type: "texte",
    texte:
      "Ce qui distingue l'apprentissage automatique de la programmation classique tient en une phrase : **on n'écrit pas l'algorithme qui reconnaît un chiffre, on écrit l'algorithme qui règle les $101\\,770$ nombres** dont le premier est fait. Le premier existe, c'est $f_{\\boldsymbol{\\theta}}$ et il tient en dix lignes de pseudo-code au chapitre 2, mais son comportement ne dépend pas de ces dix lignes : il dépend de $\\boldsymbol{\\theta}$.",
  },
  {
    id: "b-d3-4",
    type: "tableau",
    ancre: "les-deux-algorithmes",
    cleEnTete: true,
    entetes: ["", "Celui qui reconnaît", "Celui qu'on écrit"],
    lignes: [
      [
        "Ce qu'il prend",
        "Une image $\\mathbf{x}\\in\\mathbb{R}^{784}$",
        "Le jeu $\\mathcal{D}$ et un $\\boldsymbol{\\theta}$ de départ",
      ],
      [
        "Ce qu'il rend",
        "Une loi sur dix classes, $\\mathbf{a}\\in\\Delta^{\\circ}_{9}$",
        "Un autre $\\boldsymbol{\\theta}$, meilleur",
      ],
      [
        "Qui l'a écrit",
        "Un humain, au chapitre 2, et il tient en dix lignes",
        "Un humain, ici, et il tient en cinq",
      ],
      [
        "D'où vient son comportement",
        "De $\\boldsymbol{\\theta}$, pas des dix lignes",
        "Des cinq lignes, et de rien d'autre",
      ],
      [
        "Ce qu'il est capable de faire",
        "Ce que $\\boldsymbol{\\theta}$ lui permet",
        "Rendre $C_{\\mathcal{D}}(\\boldsymbol{\\theta})$ plus petit",
      ],
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 3.2 · Les données
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d3-6",
    type: "titre",
    niveau: 2,
    texte: "Ce sur quoi on règle",
  },
  {
    id: "b-d3-7",
    type: "formule",
    ancre: "jeux",
    latex:
      "\\mathcal{D}_{\\text{train}}=\\big\\{(\\mathbf{x}^{(n)},c^{(n)})\\big\\}_{n=1}^{N},\\quad N=60\\,000,\\qquad \\mathcal{D}_{\\text{test}}=\\big\\{(\\mathbf{x}^{(n)},c^{(n)})\\big\\}_{n=1}^{10\\,000}",
    alt: "Le jeu d'entraînement est l'ensemble des couples formés du n-ième vecteur d'entrée et de la n-ième étiquette, pour n allant de un à N, avec N égal à soixante mille. Le jeu de test est l'ensemble analogue, de taille dix mille.",
    numero: "3.1",
    legende:
      "$\\mathbf{x}^{(n)}\\in[0,1]^{784}$ et $c^{(n)}\\in[\\![0,9]\\!]$, tous deux définis au chapitre 2. Les deux jeux sont **disjoints**.",
  },
  {
    id: "b-d3-8",
    type: "texte",
    texte:
      "Ces images viennent de MNIST, un jeu de dizaines de milliers de chiffres manuscrits étiquetés à la main, distribué librement, et devenu le point de comparaison usuel pour cette tâche. Le chapitre 2 en a compté la répartition, mesuré la part de pixels nuls et vérifié que les images étaient déjà centrées.",
  },
  {
    id: "b-d3-9",
    type: "texte",
    texte:
      "Régler $\\boldsymbol{\\theta}$ sur $\\mathcal{D}_{\\text{train}}$ ne dit rien de ce que le réseau fera sur une image qu'il n'a jamais vue, et c'est pourquoi $\\mathcal{D}_{\\text{test}}$ existe et qu'aucune de ses images n'entre jamais dans un calcul de mise à jour. **Ce chapitre s'arrête là sur cette question** : il mesure sur des données jamais vues, et rien de plus. Ce qu'il faudrait faire quand l'écart entre les deux se creuse est le sujet du chapitre d'évaluation.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.3 · L'énoncé
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d3-10",
    type: "titre",
    niveau: 2,
    texte: "Le problème, écrit",
  },
  {
    id: "b-d3-11",
    type: "definition",
    terme: "Ensemble des minimiseurs",
    anglais: "argmin",
    texte:
      "Pour une fonction $C:\\Theta\\rightarrow\\mathbb{R}$, l'ensemble $\\arg\\min_{\\boldsymbol{\\theta}\\in\\Theta} C(\\boldsymbol{\\theta})=\\{\\boldsymbol{\\theta}^{\\star}\\in\\Theta\\ :\\ C(\\boldsymbol{\\theta}^{\\star})\\leq C(\\boldsymbol{\\theta})\\ \\ \\forall\\boldsymbol{\\theta}\\in\\Theta\\}$. C'est un **ensemble**, pas un élément : il peut être vide, réduit à un point, ou infini.",
  },
  {
    id: "b-d3-fig06",
    type: "image",
    ancre: "argmin-trois-cas",
    src: "/cours/lecon3/l3-fig06-argmin-trois-cas.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Trois graphes de fonctions d'une variable, côte à côte. Le premier, intitulé vide, montre une courbe qui décroît sans jamais toucher l'axe, et il est légendé exponentielle de moins t. Le deuxième, intitulé un point, montre une parabole dont le creux unique porte un rond brique, et il est légendé t au carré. Le troisième, intitulé une infinité, montre une courbe dont le fond est un segment horizontal portant trois ronds brique, et il est légendé un plateau.",
    legende:
      "Les trois fonctions sont posées par le cours, et non mesurées : elles servent à voir les trois cas que la définition autorise.",
  },
  {
    id: "b-d3-12",
    type: "texte",
    texte:
      "Les trois cas se rencontrent, et ce chapitre en donne un de chaque. L'ensemble est vide pour $C(\\theta)=e^{-\\theta}$ sur $\\mathbb{R}$, qui décroît sans jamais atteindre sa borne inférieure $0$ ; il est réduit à un point pour $C(\\theta)=\\theta^{2}$, dont l'unique minimiseur est $0$ ; il est infini pour le coût du réseau à couche cachée, et la page 11 en construit $128!$ d'un seul coup.",
  },
  {
    id: "b-d3-13",
    type: "formule",
    ancre: "probleme",
    latex:
      "\\text{trouver}\\quad \\boldsymbol{\\theta}\\ \\in\\ \\arg\\min_{\\boldsymbol{\\theta}\\in\\mathbb{R}^{p}}\\ C_{\\mathcal{D}}(\\boldsymbol{\\theta}),\\qquad p=101\\,770",
    alt: "Trouver un thêta appartenant à l'ensemble des minimiseurs, sur l'espace à p dimensions, de la fonction de coût C indicée par le jeu D, avec p égal à cent un mille sept cent soixante-dix.",
    numero: "3.2",
    legende:
      "$C_{\\mathcal{D}}$ n'est pas encore définie : c'est le travail des pages 5 et 6. L'énoncé, lui, ne changera plus.",
  },
  {
    id: "b-d3-14",
    type: "texte",
    texte:
      "Écrit ainsi, « apprendre » ressemble moins à de la science-fiction qu'à un exercice de calcul : **trouver le minimum d'une fonction**. Tout ce chapitre consiste à rendre cette phrase exacte, en disant quelle fonction, en disant ce que « trouver » veut dire quand l'ensemble des minimiseurs est infini, et en disant par quel procédé on s'en approche.",
  },
  {
    id: "b-d3-16",
    type: "verification",
    numero: 21,
    enonce:
      "Deux fonctions du chapitre vivent dans des espaces différents, et les confondre est l'erreur la plus fréquente.",
    questions: [
      "Écrire l'ensemble de départ et l'ensemble d'arrivée de $f_{\\boldsymbol{\\theta}}$.",
      "Écrire ceux de $C_{\\mathcal{D}}$.",
      "Pourquoi ne sont-ils pas les mêmes ? Dire, pour chacune des deux, ce qui est fixé et ce qui varie.",
    ],
  },
];
