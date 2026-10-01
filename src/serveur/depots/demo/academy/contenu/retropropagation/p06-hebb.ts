import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 6 · Ce que Hebb dit, et ce qu'il ne dit pas
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig08-hebb`, le classement mesuré. Le rapprochement se fait ensuite, sur
// la forme de la mise à jour, et la mesure 6 le contrôle : les dix poids qui
// augmentent le plus relient bien les dix neurones cachés les plus actifs au
// neurone de la vraie classe, et c'est vérifié, pas supposé.
//
// Puis les DEUX limites, détaillées : le réseau non entraîné ne « pense » pas
// à un 2, et la correction dépend d'un signal venu de la sortie, non d'une
// coïncidence locale entre deux neurones.
// ─────────────────────────────────────────────────────────────────────────────

export const R06_HEBB: Bloc[] = [
  {
    id: "b-rp6-0",
    type: "texte",
    texte:
      "Un énoncé de 1949 dit que deux neurones qui s'activent ensemble renforcent la liaison qui les unit, et la correction qu'on vient de calculer y ressemble beaucoup. Jusqu'où va la ressemblance ?",
  },
  {
    id: "b-rp6-9f",
    type: "image",
    ancre: "les-dix-montees",
    src: "/cours/lecon4/l4-fig08-hebb.svg",
    largeur: 1380,
    hauteur: 990,
    alt: "Un tableau de dix lignes, classées par ordre de hausse décroissante. Chaque ligne donne le neurone caché d'où part le poids, l'activation de ce neurone, la hausse que le poids reçoit au facteur $\\eta$ près, et le rang de cette activation parmi les cent vingt-huit. Les hausses vont de plus un virgule deux cent un mille quatre cent neuf pour le neurone quatre-vingt-douze à plus zéro virgule cinq cent dix-huit mille vingt-quatre pour le neurone soixante-seize, et une barre de brique accompagne chaque ligne. Les rangs d'activation vont de un à dix, dans l'ordre exact. En pied, deux mentions : les dix vont au neurone de sortie deux, et ce sont les dix plus actifs.",
    legende:
      "Ce ne sont pas dix couples pris au hasard : ce sont les dix neurones les plus actifs, tous reliés à la classe vraie.",
  },
  {
    id: "b-rp6-9g",
    type: "texte",
    texte:
      "Le programme a classé les $1\\,280$ poids de la couche de sortie par la hausse qu'ils reçoivent, au facteur $\\eta$ près, et n'a gardé que les dix premiers. Deux régularités sautent aux yeux : un seul neurone de sortie apparaît, et la colonne des rangs d'activation donne $1$ à $10$ sans un trou.\n\nAucune des deux n'est une coïncidence, et les deux se démontrent avec ce qui précède.",
  },
  {
    id: "b-rp6-2",
    type: "titre",
    niveau: 2,
    texte: "La théorie de Hebb",
  },
  {
    id: "b-rp6-3",
    type: "definition",
    terme: "Règle de Hebb",
    anglais: "Hebbian learning",
    texte:
      "Énoncé formulé par Donald Hebb en 1949 : quand deux neurones s'activent ensemble de façon répétée, la liaison qui les unit se renforce. Résumé en une formule mnémonique, *neurons that fire together wire together*.",
  },
  {
    id: "b-rp6-4",
    type: "titre",
    niveau: 2,
    texte: "Le rapprochement, écrit précisément",
  },
  {
    id: "b-rp6-5",
    type: "formule",
    ancre: "correction-dun-poids",
    latex:
      "W_{kj}^{[2]}\\ \\longleftarrow\\ W_{kj}^{[2]}-\\eta\\,\\delta_{k}^{[2]}a_{j}^{[1]},\\qquad \\eta>0,\\ a_{j}^{[1]}\\geq 0",
    alt: "Le poids W k j de la couche deux est remplacé par lui-même moins êta multiplié par delta k de la couche deux multiplié par a j de la couche un, avec êta strictement positif et l'activation positive ou nulle.",
    numero: "4.7",
    legende:
      "La correction vaut $-\\eta\\,\\delta_{k}a_{j}$, son **signe** est celui de $-\\delta_{k}$ puisque $\\eta>0$ et $a_{j}\\geq 0$, et sa **taille** est proportionnelle à $a_{j}$.",
  },
  {
    id: "b-rp6-6",
    type: "liste",
    ordonnee: true,
    elements: [
      "**Le poids augmente si et seulement si $\\delta_{k}<0$ et $a_{j}>0$**, et la proposition 1 dit que le premier ne vaut que pour un seul $k$, celui de la vraie classe.",
      "**L'augmentation est d'autant plus grande que $a_{j}$ est grand** : la proposition 4 donne $\\delta_{c}a_{j}$, la proposition 1 permet de l'écrire $-|\\delta_{c}|a_{j}$, et la mise à jour la multiplie par $-\\eta$, ce qui fait $\\eta\\,|\\delta_{c}|\\,a_{j}$.",
      "**Les liaisons qui se renforcent le plus relient donc les neurones cachés les plus actifs au neurone de sortie de la vraie classe**, ce qui est la moitié de l'énoncé de Hebb, obtenue par un calcul de dérivée. L'autre moitié manque : l'activité du neurone de sortie n'entre nulle part dans (4.7).",
    ],
  },
  {
    id: "b-rp6-7",
    type: "titre",
    niveau: 2,
    texte: "Le contrôle",
  },
  {
    id: "b-rp6-9",
    type: "sortie",
    ancre: "mesure-6",
    titre: "Le contrôle de Hebb · cours/lecon4/mesures.py, mesure 6",
    texte:
      "      rang    k     j       a_j        -d l / d W_kj    rang de a_j\n      1       2     92      1.5903     +1.201409        1\n      2       2     13      1.4981     +1.131760        2\n      3       2     61      1.3950     +1.053837        3\n      4       2     35      1.3867     +1.047632        4\n      5       2     82      1.0722     +0.810017        5\n      6       2     123     0.8527     +0.644145        6\n      7       2     20      0.8343     +0.630293        7\n      8       2     112     0.7385     +0.557937        8\n      9       2     67      0.7021     +0.530430        9\n      10      2     76      0.6857     +0.518024        10\n\n  neurones de sortie concernés                   [2]\n  la vraie classe est                            2\n  rangs d'activation des dix neurones cachés     [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n  activation la plus faible des dix              0.6857\n  activation la plus forte des 128               1.5903",
    lecture: [
      "**Les dix couples portent tous $k=2$**, la vraie classe, et aucun autre neurone de sortie n'apparaît, ce qui est la proposition 1 : une seule composante de $\\boldsymbol{\\delta}^{[2]}$ est négative, donc un seul neurone de sortie voit ses poids augmenter.",
      "**Les rangs d'activation sont $1$ à $10$, dans l'ordre et sans trou**, donc le classement par correction reçue et le classement par activation coïncident exactement, ce qui est la proposition 4 : à ligne fixée, l'un est l'autre multiplié par $|\\delta_{2}|$.",
      "Le contrôle ne pouvait donc pas échouer si les propositions 1 et 4 sont justes, et c'est précisément pour cela qu'il est intéressant : il montre que l'énoncé de Hebb, sur ce réseau et cet exemple, **est** une conséquence des deux propositions, et non une observation indépendante.",
    ],
  },
  {
    id: "b-rp6-11",
    type: "titre",
    niveau: 2,
    texte: "Où l'analogie casse",
  },
  {
    id: "b-rp6-12",
    type: "texte",
    texte:
      "Deux choses distinguent la mise à jour (4.7) de la règle de Hebb, et aucune des deux n'est un détail.",
  },
  {
    id: "b-rp6-13",
    type: "encart",
    ton: "attention",
    titre: "Première limite : le réseau ne « pense » pas à un 2",
    texte:
      "La mesure 1 montre un réseau non entraîné dont la sortie est $0{,}1366$, $0{,}1098$, $0{,}2445$, et ainsi de suite : des valeurs inégales issues d'un tirage, dont la plus grande se trouve être celle de la classe $2$, par accident. Ce qui la désigne, c'est $\\mathbf{y}=\\mathrm{onehot}(2)$, **l'étiquette**, qui vient du jeu de données et non du réseau, et dire que « le neurone du 2 veut être plus actif » revient à dire que l'étiquette impose qu'il le soit. Le réseau ne pense à rien ; il est corrigé.",
  },
  {
    id: "b-rp6-14",
    type: "encart",
    ton: "attention",
    titre: "Seconde limite : le signal ne vient pas d'une coïncidence locale",
    texte:
      "Chez Hebb le renforcement est **local**, puisqu'il ne dépend que des deux neurones reliés et de leur activité simultanée. Ici la correction vaut $-\\eta\\,\\delta_{k}a_{j}$, et $\\delta_{k}$ **n'est pas une quantité locale** : c'est $a_{k}^{[2]}-y_{k}$, qui dépend de la sortie entière du réseau et de l'étiquette. Deux neurones peuvent donc s'activer fortement ensemble et voir leur liaison **descendre**, ce que Hebb n'autorise pas : il suffit que $\\delta_{k}$ soit positif, ce qui est le cas des neuf classes sur dix. L'analogie porte sur la **forme** de la mise à jour, $-\\eta\\times(\\text{signal})\\times(\\text{activité})$, et non sur l'origine du signal.",
  },
  {
    id: "b-rp6-16",
    type: "verification",
    numero: 40,
    enonce:
      "La correction d'un poids de sortie vaut $-\\eta\\,\\delta_{k}^{[2]}a_{j}^{[1]}$, avec $\\eta>0$ et $a_{j}^{[1]}\\geq 0$.",
    questions: [
      "Pour quel signe de $\\delta_{k}$ le poids augmente-t-il, et quelle classe cela désigne-t-il ?",
      "Combien de lignes de $W^{[2]}$ voient leurs poids augmenter sur un exemple donné ? Justifier par la proposition 1.",
    ],
  },
  {
    id: "b-rp6-17",
    type: "verification",
    numero: 41,
    enonce:
      "Le texte donne deux raisons pour lesquelles l'analogie avec la règle de Hebb est inexacte.",
    questions: [
      "Énoncer ces deux raisons, et dire pour chacune quelle quantité de la formule (4.7) est en cause.",
      "Construire un cas où deux neurones s'activent fortement ensemble et où pourtant leur liaison descend.",
    ],
  },
];
