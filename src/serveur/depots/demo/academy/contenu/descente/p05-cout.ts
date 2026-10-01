import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 5 · Dire au programme qu'il est mauvais
//
// ÉCART N°1 avec la source, et il est signalé au lecteur. La source pose le
// coût quadratique -- la somme des carrés des écarts entre la sortie obtenue et
// la sortie voulue. Le chapitre 2 a posé l'entropie croisée. Cette page présente
// LES DEUX, avec leurs ensembles, et tranche par une mesure : le rapport des
// deux sensibilités sur une sortie confiante et fausse.
//
// La mesure ne dit pas que la source a tort. Elle dit ce que chaque choix coûte
// là où le réseau se trompe le plus, et le texte écrit que la source retient
// l'autre.
//
// OUVERTURE : la question, puis les deux coûts sur quatre sorties, puis le
// cadre. Règle 26.
//
// Tous les nombres sortent de cours/lecon3/mesures.py, mesure 2.
// ─────────────────────────────────────────────────────────────────────────────

export const D05_COUT: Bloc[] = [
  {
    id: "b-d5-0",
    type: "texte",
    texte:
      "Le réseau vient de répondre, et il faut lui dire de combien il s'est trompé. Deux fonctions font l'affaire, et il va falloir choisir : voici ce qu'elles donnent sur quatre réponses.",
  },
  {
    id: "b-d5-fig09",
    type: "image",
    ancre: "deux-couts-quatre-sorties",
    src: "/cours/lecon3/l3-fig09-deux-couts.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "Quatre paires de barres verticales, une paire par sortie. Sous chaque paire se lit la valeur accordée à la vraie classe : zéro virgule neuf cent soixante-dix, zéro virgule trois cent dix, zéro virgule cent vingt, zéro virgule zéro zéro quatre. Dans chaque paire, la barre de gauche est à l'encre et porte l'entropie croisée, celle de droite est en ardoise et porte le coût quadratique. Les deux barres montent de la première paire à la dernière, mais celle de l'entropie croisée monte beaucoup plus haut.",
    legende:
      "Les deux coûts classent les quatre sorties dans le même ordre. Ce sont leurs échelles qui diffèrent.",
  },
  {
    id: "b-d5-1",
    type: "texte",
    texte:
      "La sortie du réseau est $\\mathbf{a}\\in\\Delta^{\\circ}_{9}$, une loi sur dix classes, et la vérité est $c\\in[\\![0,9]\\!]$, un code. Ce qu'on cherche est une fonction qui reçoive les deux et rende un nombre positif, d'autant plus grand que le réseau se trompe.",
  },
  {
    id: "b-d5-2",
    type: "texte",
    texte:
      "Sans cette fonction, l'énoncé de la page 3 est une phrase vide : $\\arg\\min C_{\\mathcal{D}}$ est écrit, et $C_{\\mathcal{D}}$ n'existe pas encore.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5.1 · Les deux candidates
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d5-3",
    type: "titre",
    niveau: 2,
    texte: "Deux candidates",
  },
  {
    id: "b-d5-4",
    type: "formule",
    ancre: "cout-quadratique",
    latex:
      "\\ell_{\\text{quad}}:\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]\\rightarrow\\mathbb{R}_{\\geq 0},\\qquad \\ell_{\\text{quad}}(\\mathbf{a},c)=\\sum_{k=1}^{K}\\big(a_{k}-y_{k}\\big)^{2},\\quad \\mathbf{y}=\\mathrm{onehot}(c)",
    alt: "La perte quadratique va du produit du simplexe ouvert par l'ensemble des entiers de zéro à K moins un, vers les réels positifs ou nuls. Elle vaut la somme, pour k de un à K, des carrés des écarts entre a k et y k, où y est l'encodage one-hot de c.",
    numero: "5.1",
    legende:
      "La somme des carrés des écarts entre la sortie obtenue et la sortie voulue. C'est le choix de la source.",
  },
  {
    id: "b-d5-5",
    type: "formule",
    ancre: "cout-entropie",
    latex:
      "\\ell:\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]\\rightarrow\\mathbb{R}_{\\geq 0},\\qquad \\ell(\\mathbf{a},c)=-\\ln a_{c+1}",
    alt: "L'entropie croisée va du même ensemble de départ vers les réels positifs ou nuls, et vaut moins le logarithme népérien de la coordonnée numéro c plus un de a.",
    numero: "5.2",
    legende:
      "L'entropie croisée, posée au chapitre 2. Elle ne regarde qu'**une** coordonnée de $\\mathbf{a}$ : celle de la vraie classe.",
  },
  {
    id: "b-d5-6",
    type: "texte",
    texte:
      "Les deux ont le même ensemble de départ et le même ensemble d'arrivée, et les deux valent $0$ si et seulement si $\\mathbf{a}=\\mathbf{y}$, ce qui n'arrive jamais exactement sur $\\Delta^{\\circ}_{K-1}$, dont les coordonnées sont strictement positives. Rien ne les départage encore.",
  },
  {
    id: "b-d5-7",
    type: "sortie",
    ancre: "quatre-sorties",
    titre:
      "Les deux coûts sur quatre sorties, vraie classe $4$ · cours/lecon3/mesures.py, mesure 2",
    texte:
      "      sortie                    a_4      entropie croisée   quadratique\n      confiante et juste       0.970          0.030459       0.001000\n      hésitante et juste       0.310          1.171183       0.529000\n      hésitante et fausse      0.120          2.120264       0.860444\n      confiante et fausse      0.004          5.521461       1.102240",
    lecture: [
      "**La colonne notée `a_4` par le programme est $a_{5}$ au sens de $(5.2)$** : le programme numérote les classes à partir de zéro, la formule à partir de un. C'est la même coordonnée, celle de la vraie classe.",
      "De la première à la dernière ligne, l'entropie croisée est multipliée par $181$ et la quadratique par $1\\,102$, et surtout la quadratique **sature** : elle ne peut pas dépasser $2$, puisque $\\mathbf{a}$ et $\\mathbf{y}$ vivent tous deux dans $[0,1]^{K}$.",
      "Le classement ne suffit donc pas à choisir, et ce qui compte pour faire descendre un coût n'est pas sa valeur mais **sa pente**.",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 5.2 · La mesure qui tranche
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d5-9",
    type: "titre",
    niveau: 2,
    texte: "Ce qui les départage : la pente, pas la valeur",
  },
  {
    id: "b-d5-10",
    type: "texte",
    texte:
      "Trois mots sont à poser avant de lire la table qui suit. Chaque neurone de la couche de sortie calcule d'abord un score $z_{k}$, sa **préactivation**, et c'est $\\mathrm{softmax}$ qui transforme ensuite les dix scores en les dix valeurs $a_{k}$ : c'est le $z$ du chapitre 2, ici porté par la dernière couche. La **sensibilité** du coût à ce score est le nombre qui dit de combien le coût change quand le score change d'un peu, et on la note $\\partial C/\\partial z_{c+1}$, où $C$ désigne la perte sur l'exemple regardé.",
  },
  {
    id: "b-d5-10b",
    type: "texte",
    texte:
      "Pourquoi juger un coût sur cette quantité-là plutôt que sur la correction d'un poids ? Parce que tous les poids de la dernière couche reçoivent leur correction **à travers** ce score : changer un poids change $z_{c+1}$, et $z_{c+1}$ seul porte l'effet du coût jusqu'à lui. Le chapitre 4 écrira ce passage ; ici, il suffit de comparer les deux candidates au même endroit de la chaîne. On les mesure en faisant varier $a_{c+1}$ et en répartissant uniformément la masse restante sur les neuf autres classes.",
  },
  {
    id: "b-d5-fig10",
    type: "image",
    ancre: "pente-des-deux-couts",
    src: "/cours/lecon3/l3-fig10-pente-des-deux-couts.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "Un graphe dont l'axe horizontal est gradué logarithmiquement et porte les valeurs zéro virgule zéro zéro un, zéro virgule zéro dix, zéro virgule cent et zéro virgule neuf cents. Deux courbes y sont tracées. Celle de l'entropie croisée, à l'encre et en trait plein, part très haut à gauche et descend régulièrement vers la droite. Celle du coût quadratique, en ardoise et en tirets, reste basse sur toute la largeur. À gauche, une accolade en brique mesure l'écart entre les deux et porte la mention multiplié par quatre cent cinquante virgule cinq.",
    legende:
      "L'axe horizontal est gradué logarithmiquement, pour que les trois décades entre un millième et un dixième tiennent à intervalles égaux. Les deux courbes joignent les cinq valeurs de la table ci-dessous.",
  },
  {
    id: "b-d5-11",
    type: "sortie",
    ancre: "sensibilite",
    titre: "La sensibilité des deux coûts · cours/lecon3/mesures.py, mesure 2",
    texte:
      "         a_c      |dC/dz_c| entropie   |dC/dz_c| quadratique   rapport\n         0.001            0.999000              0.002218   x   450.5\n         0.010            0.990000              0.021780   x    45.5\n         0.100            0.900000              0.180000   x     5.0\n         0.500            0.500000              0.277778   x     1.8\n         0.900            0.100000              0.020000   x     5.0",
    lecture: [
      "**La ligne du haut est celle qui tranche**, puisque le réseau y accorde un millième à la bonne classe et se trompe donc autant qu'il est possible de se tromper : l'entropie croisée produit alors une sensibilité de $0{,}999$, la quadratique de $0{,}0022$, soit **$450$ fois plus faible**.",
      "Le coût quadratique cesse donc de corriger exactement quand il faudrait corriger le plus. Ce n'est pas une question d'échelle qu'un réglage global rattraperait : le rapport ne vaut pas la même chose d'une ligne à l'autre, $450{,}5$ en haut et $1{,}8$ au milieu, et aucun facteur constant ne compense un rapport qui varie d'un facteur $250$ selon l'endroit où l'on se trouve.",
      "La colonne de l'entropie croisée se lit d'ailleurs en une ligne, puisqu'elle vaut exactement $1-a_{c+1}$ : la correction est proportionnelle à ce qui manque à la bonne classe pour valoir $1$.",
      "Sur la dernière ligne, $a_{c+1}=0{,}9$, les deux sensibilités redeviennent faibles parce que le réseau a raison et qu'il n'y a plus grand-chose à corriger. Les deux coûts sont d'accord là où ça n'a pas d'importance.",
    ],
  },
  {
    id: "b-d5-14",
    type: "encart",
    ton: "attention",
    titre: "La source retient l'autre choix, et le cours le dit",
    texte:
      "L'exposé dont ce chapitre suit l'ordre pose le coût quadratique, la somme des carrés des écarts, et c'est un choix parfaitement défendable : il est plus simple à écrire, il ne demande pas de logarithme, et il donne le même classement des sorties. Ce cours retient l'entropie croisée parce que le chapitre 2 l'a déjà posée, et parce que la table ci-dessus dit ce que l'autre coûte là où le réseau se trompe le plus. **La mesure ne dit pas que la source a tort ; elle dit à quoi on renonce.**",
  },
  {
    id: "b-d5-15",
    type: "verification",
    numero: 23,
    enonce:
      "Quatre sorties sont données pour une image de la classe $4$, avec $a_{5}$ valant respectivement $0{,}970$, $0{,}310$, $0{,}120$ et $0{,}004$.",
    questions: [
      "Les classer par coût **croissant** avec l'entropie croisée, puis avec le coût quadratique.",
      "Le classement est-il le même ? Et les rapports entre coûts successifs le sont-ils ?",
      "Pour la sortie la plus fausse, dire lequel des deux coûts corrigera le plus, et de combien.",
    ],
  },
];
