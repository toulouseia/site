import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 9 · Remonter d'une couche
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig11-arriere`, les quatre temps du retour et les deux neurones comparés.
//
// Le produit de Hadamard est défini ici, parce que c'est ici qu'il sert.
// La porte ReLU est interprétée : un neurone éteint ne reçoit rien, parce
// qu'il n'a rien envoyé.
//
// La mesure 8 est faite dans l'ordre : PRÉDICTION d'abord, à partir des 57
// neurones allumés et des 188 pixels non nuls, MESURE ensuite.
//
// La page se termine sur un encadré de dette : le même geste se répéterait
// pour une couche de plus, et sa forme générale est le chapitre 5.
// ─────────────────────────────────────────────────────────────────────────────

export const R09_REMONTER: Bloc[] = [
  {
    id: "b-rp9-0",
    type: "texte",
    texte:
      "La demande est arrivée sur les activations cachées, et ce ne sont toujours pas des réglages. Sur cette image, soixante et onze des cent vingt-huit neurones cachés sont éteints : que devient la part de demande qui leur revient ?",
  },
  {
    id: "b-rp9-10f",
    type: "image",
    ancre: "la-porte-relu",
    src: "/cours/lecon4/l4-fig11-arriere.svg",
    largeur: 1380,
    hauteur: 900,
    alt: "Quatre cadres en file, reliés par des flèches : le signal d'erreur de sortie et ses dix composantes ; la demande reçue, transposée de la seconde matrice appliquée à ce signal, et ses cent vingt-huit composantes ; la porte ReLU, en brique, qui en annule soixante et onze ; et le signal d'erreur caché, dont cinquante-sept composantes restent non nulles. Dessous, un tableau de deux lignes compare un neurone allumé et un neurone éteint : le quatre-vingt-douzième, de préactivation plus un virgule cinq neuf zéro trois, reçoit plus zéro virgule zéro zéro six mille quatre cent deux et transmet la même valeur ; le neurone zéro, de préactivation moins zéro virgule deux quatre cinq cinq, reçoit moins zéro virgule zéro zéro neuf mille trois cent trente-cinq et transmet zéro. En pied, deux mentions : un neurone éteint ne transmet rien, et la porte se ferme dans les deux sens.",
    legende:
      "La porte se ferme dans les deux sens, et c'est la même qu'à l'aller.",
  },
  {
    id: "b-rp9-10g",
    type: "texte",
    texte:
      "Les deux lignes du bas comparent un neurone allumé et un neurone éteint qui reçoivent tous les deux une demande non nulle. Le premier la transmet sans qu'un seul chiffre change, le second ne transmet rien.\n\nLa page démontre cette différence, et en tire le compte des zéros de la première matrice.",
  },
  {
    id: "b-rp9-2",
    type: "titre",
    niveau: 2,
    texte: "De l'activation à la somme pondérée",
  },
  {
    id: "b-rp9-3",
    type: "texte",
    texte:
      "Il reste à passer de $\\mathrm{grad}_{\\mathbf{a}^{[1]}}\\,\\ell$ à $\\mathrm{grad}_{\\mathbf{z}^{[1]}}\\,\\ell$, et ce pas est le plus simple de tous parce que $a_{j}^{[1]}=\\mathrm{ReLU}(z_{j}^{[1]})$ ne dépend **que** de $z_{j}^{[1]}$ : il n'y a qu'un seul chemin, et la règle de la chaîne à plusieurs chemins se réduit à sa forme simple.",
  },
  {
    id: "b-rp9-4",
    type: "formule",
    ancre: "un-seul-chemin",
    latex:
      "\\delta_{j}^{[1]}=\\frac{\\partial\\ell}{\\partial z_{j}^{[1]}}=\\frac{\\partial\\ell}{\\partial a_{j}^{[1]}}\\cdot\\frac{\\partial a_{j}^{[1]}}{\\partial z_{j}^{[1]}}=\\Big[\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\Big]_{j}\\cdot\\mathrm{ReLU}'\\big(z_{j}^{[1]}\\big)",
    alt: "Delta j de la couche un est la dérivée partielle de la perte par rapport à z j de la couche un, qui vaut le produit de la dérivée partielle de la perte par rapport à a j par la dérivée de a j par rapport à z j. Cela donne la j-ième composante de la transposée de W de la couche deux appliquée à delta de la couche deux, multipliée par la dérivée de ReLU en z j.",
    numero: "4.8",
    legende:
      "Un produit **composante par composante** : la $j$-ième composante de l'un multipliée par la $j$-ième de l'autre, sans aucune somme et sans mélange entre indices.",
  },
  {
    id: "b-rp9-5",
    type: "definition",
    terme: "Produit de Hadamard",
    anglais: "Hadamard product, element-wise product",
    texte:
      "Pour $\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^{m}$, le vecteur $\\mathbf{u}\\odot\\mathbf{v}=(u_{1}v_{1},\\ldots,u_{m}v_{m})^{\\mathsf{T}}\\in\\mathbb{R}^{m}$. Il ne change pas la dimension et ne fait aucune somme : c'est le produit ordinaire de $\\mathbb{R}$, appliqué $m$ fois en parallèle.",
  },
  {
    id: "b-rp9-6",
    type: "formule",
    ancre: "delta-couche-cachee",
    latex:
      "\\boxed{\\ \\boldsymbol{\\delta}^{[1]}=\\Big[\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\Big]\\odot\\mathrm{ReLU}'\\big(\\mathbf{z}^{[1]}\\big)\\ }\\qquad\\in\\mathbb{R}^{128}",
    alt: "Delta de la couche un est le produit de Hadamard entre la transposée de W de la couche deux appliquée à delta de la couche deux, et la dérivée de ReLU évaluée en z de la couche un. C'est un vecteur de cent vingt-huit composantes.",
    numero: "4.9",
    legende:
      "Dimensions : $(128\\times 10)(10\\times 1)=128\\times 1$, puis un produit de Hadamard avec un vecteur de $\\mathbb{R}^{128}$, qui rend un vecteur de $\\mathbb{R}^{128}$.",
  },
  {
    id: "b-rp9-7",
    type: "encart",
    ton: "rappel",
    titre: "La dérivée de ReLU, et sa convention en zéro",
    texte:
      "$\\mathrm{ReLU}'(u)=\\mathbb{1}\\{u>0\\}$ vaut $1$ où la somme pondérée est strictement positive et $0$ ailleurs. En $u=0$ la fonction n'est pas dérivable, le chapitre 2 a posé la convention $\\mathrm{ReLU}'(0)=0$, et ce chapitre la garde. Le choix est libre et sans conséquence pratique, puisque l'événement $z_{j}=0$ exactement est de mesure nulle sur des flottants.",
  },
  {
    id: "b-rp9-8",
    type: "titre",
    niveau: 2,
    texte: "Ce que la porte fait",
  },
  {
    id: "b-rp9-9",
    type: "texte",
    texte:
      "$\\mathrm{ReLU}'(\\mathbf{z}^{[1]})$ est un vecteur de $0$ et de $1$, et c'est ce vecteur qu'on appellera la **porte** : le produit de Hadamard laisse passer certaines composantes **sans les modifier** et annule les autres. Sur l'exemple de travail, $57$ passent et $71$ sont annulées.",
  },
  {
    id: "b-rp9-10",
    type: "sortie",
    ancre: "porte-relu-mesuree",
    titre:
      "Un neurone allumé, un neurone éteint · cours/lecon4/mesures.py, mesure 3",
    texte:
      "  a^[1]_92 = 1.5903, neurone ALLUMÉ (z^[1]_92 = +1.5903)\n  composante 92 de (W^[2])^T delta^[2]            +0.006402\n  composante 92 de delta^[1], après la porte ReLU  +0.006402\n\n  pour comparaison, le neurone ÉTEINT j = 0 (z^[1]_0 = -0.2455)\n      demande reçue,  (W^[2])^T delta^[2] en 0    -0.009335\n      composante 0 de delta^[1]                  -0.000000",
    lecture: [
      "Le neurone $92$ est allumé, sa demande traverse la porte **sans changer d'un chiffre**, et la porte ne rééchelonne donc rien : elle laisse passer, ou elle coupe.",
      "Le neurone $0$ est éteint et reçoit pourtant une demande non nulle, $-0{,}009335$, que la porte annule : les dix neurones de sortie lui adressent bien quelque chose.",
      "**Un neurone éteint ne transmet rien parce qu'il n'a rien envoyé.** Son activation valait $0$ à l'aller, il n'a donc contribué à aucune des dix sommes pondérées, et changer un peu sa somme pondérée ne changerait toujours rien puisqu'elle resterait négative. La perte n'en dépend pas, et sa dérivée est nulle.",
    ],
  },
  {
    id: "b-rp9-11",
    type: "animation",
    ancre: "la-porte-relu",
    animationId: "la-porte-relu-ne-laisse-rien-passer",
    legende:
      "La porte ReLU sur les $128$ composantes : elle en laisse passer $57$ et en coupe $71$.",
  },
  {
    id: "b-rp9-12",
    type: "titre",
    niveau: 2,
    texte: "Les gradients de la première couche",
  },
  {
    id: "b-rp9-13",
    type: "texte",
    texte:
      "Les propositions 3 et 4 n'ont rien de particulier à la couche de sortie, puisqu'elles dérivent $z_{k}=\\sum_{j}W_{kj}a_{j}+b_{k}$, ce qui est vrai de toute couche. On les applique donc telles quelles une couche plus bas, avec $\\mathbf{x}$ à la place de $\\mathbf{a}^{[1]}$, l'entrée jouant le rôle d'activation de la couche précédente.",
  },
  {
    id: "b-rp9-14",
    type: "formule",
    ancre: "gradients-couche-un",
    latex:
      "\\mathrm{grad}_{\\mathbf{b}^{[1]}}\\,\\ell=\\boldsymbol{\\delta}^{[1]}\\in\\mathbb{R}^{128},\\qquad \\mathrm{grad}_{W^{[1]}}\\,\\ell=\\boldsymbol{\\delta}^{[1]}\\mathbf{x}^{\\mathsf{T}}\\in\\mathcal{M}_{128,784}(\\mathbb{R})",
    alt: "Le gradient de la perte par rapport aux biais de la couche un est delta de la couche un, un vecteur de cent vingt-huit composantes. Le gradient par rapport à la matrice de la couche un est le produit extérieur de delta de la couche un par x transposé, une matrice à cent vingt-huit lignes et sept cent quatre-vingt-quatre colonnes.",
    numero: "4.10",
    legende:
      "Dimensions : $(128\\times 1)(1\\times 784)=128\\times 784$, la forme de $W^{[1]}$. Les quatre blocs du gradient sont maintenant écrits.",
  },
  {
    id: "b-rp9-15",
    type: "titre",
    niveau: 2,
    texte: "Combien des $128\\times 784=100\\,352$ coefficients sont nuls ?",
  },
  {
    id: "b-rp9-16",
    type: "texte",
    texte:
      "La formule (4.10) permet de **prédire** ce compte avant de le faire, car le coefficient $(j,i)$ de $\\mathrm{grad}_{W^{[1]}}\\,\\ell$ vaut $\\delta_{j}^{[1]}x_{i}$ et il est nul dès que l'un des deux facteurs l'est. Or $\\delta_{j}^{[1]}=0$ pour les $71$ neurones éteints, et $x_{i}=0$ pour les pixels du fond, ceux que l'encre n'a pas touchés, dont la mesure 1 dit qu'il y en a $784-188=596$.\n\nLe compte des non nuls demande en outre qu'aucun des $57\\times 188$ produits restants ne s'annule par accident, ce que la prédiction suppose et que la mesure constate.",
  },
  {
    id: "b-rp9-17",
    type: "formule",
    ancre: "prediction-des-zeros",
    latex:
      "\\#\\{\\text{non nuls}\\}=57\\times 188=10\\,716,\\qquad \\#\\{\\text{nuls}\\}=100\\,352-10\\,716=89\\,636",
    alt: "Le nombre de coefficients non nuls vaut cinquante-sept multiplié par cent quatre-vingt-huit, soit dix mille sept cent seize. Le nombre de coefficients nuls vaut cent mille trois cent cinquante-deux moins dix mille sept cent seize, soit quatre-vingt-neuf mille six cent trente-six.",
    numero: "4.11",
    legende:
      "Prédiction faite **avant** le comptage, à partir des seuls nombres de la mesure 1.",
  },
  {
    id: "b-rp9-18",
    type: "sortie",
    ancre: "mesure-8",
    titre:
      "Les zéros de $\\mathrm{grad}_{W^{[1]}}\\,\\ell$ · cours/lecon4/mesures.py, mesure 8",
    texte:
      "  -- La mesure -------------------------------------------------------------\n  coefficients exactement nuls                   89636\n  écart à la prédiction                          0\n\n  nuls parce que le pixel d'entrée est nul       596 x 128 = 76288\n  nuls parce que le neurone caché est éteint     71 x 188 = 13348\n  somme des deux causes                          89636\n  lignes de grad_W1 entièrement nulles           71 sur 128\n  colonnes de grad_W1 entièrement nulles         596 sur 784\n  part de coefficients nuls                      89.32 %",
    lecture: [
      "**La prédiction tombe juste, écart zéro**, et c'est le contrôle le plus économique du chapitre puisqu'il ne demande aucun calcul de dérivée, seulement la structure de la formule (4.10).",
      "Les deux causes se **partagent** les $89\\,636$, et ce partage est un choix : $596\\times 128$ compte les coefficients des colonnes entièrement nulles, puis $71\\times 188$ ceux des lignes nulles **parmi les colonnes qui restent**. Compté dans l'autre ordre, $71\\times 784$ puis $596\\times 57$, le total est le même.",
      "$89{,}32\\,\\%$ du gradient de la première couche est exactement nul sur cet exemple, et le procédé par différences finies aurait dépensé deux propagations avant pour chacun de ces $89\\,636$ zéros.",
    ],
  },
  {
    id: "b-rp9-20",
    type: "encart",
    ton: "attention",
    titre: "Une couche de plus, et la forme générale",
    texte:
      "S'il y avait une troisième couche, le même geste se répéterait : la transposée de la matrice de la couche suivante prendrait la place de celle de $W^{[2]}$, et la dérivée de l'activation de cette couche celle de $\\mathrm{ReLU}'$. **Ce chapitre n'écrit pas cette formule.** La forme générale à $L$ couches, la règle de la chaîne multivariée sous forme jacobienne et le traitement d'une fonction d'activation quelconque sont le **chapitre 5**. Ce qui est établi ici, c'est ce que l'algorithme fait sur un réseau à deux couches, et qu'il le fait juste.",
  },
  {
    id: "b-rp9-21",
    type: "verification",
    numero: 45,
    enonce:
      "Pour l'image de travail, $57$ neurones cachés sur $128$ sont allumés, et l'image compte $188$ pixels non nuls sur $784$.",
    questions: [
      "Combien de lignes de $\\mathrm{grad}_{W^{[1]}}\\,\\ell$ sont entièrement nulles, et combien de colonnes ? Justifier par la formule (4.10).",
      "Le même compte pour $\\mathrm{grad}_{W^{[2]}}\\,\\ell$ : combien de ses $1\\,280$ coefficients sont nuls, et pour quelle raison ?",
    ],
  },
];
