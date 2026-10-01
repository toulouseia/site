import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 10 · La forme vectorielle
//
// Ouverture règle 26 : la question, l5-fig10-jacobienne (1380 × 820), le cadre.
// Le nom de fichier l5-fig10 est celui que l5-fig10-chemins libère page 9.
//
// La jacobienne définie AVANT usage, et distinguée du gradient et de la
// dérivée partielle. Les deux jacobiennes du chapitre, calculées.
//
// La dérivation du temps : « Le retour, écrit sans indices », avec le passage
// de la matrice diagonale au produit de Hadamard. Mesures 6 et 7 : le contrôle
// de la diagonalité, et le contre-exemple du softmax, que l5-fig14-softmax
// (1380 × 820, figure neuve) met en regard de la jacobienne diagonale. Le
// contraste entre les deux figures porte l'idée de la page. 🧪 n°60.
// ─────────────────────────────────────────────────────────────────────────────

export const C10_VECTORIELLE: Bloc[] = [
  {
    id: "b-cr10-0a",
    type: "texte",
    texte: "Peut-on écrire tout cela sans un seul indice ?",
  },
  {
    id: "b-cr10-0b",
    type: "image",
    ancre: "la-jacobienne-diagonale",
    src: "/cours/lecon5/l5-fig10-jacobienne.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Une grille carrée de cases, entre crochets, autant de lignes que de colonnes. Chaque case de la diagonale porte phi prime évaluée en la composante de même rang de la somme pondérée de la couche l. Toutes les autres cases portent un zéro, écrit case par case. Les numéros de ligne courent le long du bord gauche de la grille, et les numéros de colonne au-dessus.",
    legende:
      "Là où la case porte un zéro, pousser une composante de la somme pondérée ne bouge pas l'activation d'en face.",
  },
  {
    id: "b-cr10-0c",
    type: "texte",
    texte:
      "Les identités du retour se sont écrites jusqu'ici avec deux indices et une somme sur les chemins, et elles s'écrivent aussi bien avec des matrices et des vecteurs seuls. Le passage réclame un objet de plus, la jacobienne, et une propriété à démontrer : celle de l'activation par la somme pondérée ne porte que des zéros hors de sa diagonale.",
  },
  {
    id: "b-cr10-1",
    type: "titre",
    niveau: 2,
    texte: "La jacobienne",
  },
  {
    id: "b-cr10-2",
    type: "definition",
    terme: "Jacobienne",
    anglais: "Jacobian matrix",
    texte:
      "Pour $f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}^{m}$ différentiable en $\\mathbf{u}$, la matrice $J_{f}(\\mathbf{u})\\in\\mathcal{M}_{m,n}(\\mathbb{R})$ dont le coefficient de la ligne $i$ et de la colonne $j$ est $\\partial f_{i}/\\partial u_{j}$, évaluée en $\\mathbf{u}$.",
  },
  {
    id: "b-cr10-3",
    type: "tableau",
    ancre: "trois-objets-distincts",
    cleEnTete: true,
    entetes: ["Objet", "Pour quelle fonction", "Type"],
    lignes: [
      [
        "Dérivée partielle $\\partial f_{i}/\\partial u_{j}$",
        "Une composante, une variable",
        "Un scalaire",
      ],
      [
        "Gradient $\\mathrm{grad}_{\\mathbf{u}}\\,f$",
        "$f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}$",
        "Un vecteur colonne de $\\mathbb{R}^{n}$",
      ],
      [
        "Jacobienne $J_{f}(\\mathbf{u})$",
        "$f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}^{m}$",
        "Une matrice $m\\times n$",
      ],
    ],
    legende:
      "Quand $m=1$, la jacobienne est une matrice à une ligne, et le gradient en est la transposée.",
  },
  {
    id: "b-cr10-3b",
    type: "texte",
    texte:
      "Le retour ne demande que deux jacobiennes, et la seconde s'écrit avec la notation $\\mathrm{diag}(\\mathbf{u})$ : la matrice carrée dont la diagonale porte les composantes de $\\mathbf{u}$ et dont tous les autres coefficients sont nuls.",
  },
  {
    id: "b-cr10-4",
    type: "formule",
    ancre: "deux-jacobiennes",
    latex:
      "J_{\\mathbf{z}^{[l]}}\\big(\\mathbf{a}^{[l-1]}\\big)=W^{[l]},\\qquad J_{\\mathbf{a}^{[l]}}\\big(\\mathbf{z}^{[l]}\\big)=\\mathrm{diag}\\big(\\varphi'(\\mathbf{z}^{[l]})\\big)",
    alt: "La jacobienne de la somme pondérée de la couche l par rapport à l'activation précédente est la matrice de poids. La jacobienne de l'activation de la couche l par rapport à sa somme pondérée est la matrice diagonale dont la diagonale porte phi prime évaluée composante par composante.",
    numero: "5.11",
  },
  {
    id: "b-cr10-5",
    type: "titre",
    niveau: 2,
    texte: "Pourquoi la seconde est diagonale",
  },
  {
    id: "b-cr10-6",
    type: "derivation",
    ancre: "le-retour-sans-indices",
    titre: "Le retour, écrit sans indices",
    hypotheses: [
      "$\\varphi$ s'applique composante par composante : $a^{[l]}_{i}=\\varphi(z^{[l]}_{i})$, définition page 5.",
      "$\\mathrm{grad}_{\\mathbf{a}^{[l]}}\\,\\ell=\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}$, la somme sur les chemins de la page 9 écrite au rang $l+1$ plutôt qu'au rang $l$.",
    ],
    proprietes: [
      "Définition de la jacobienne",
      "$D\\mathbf{v}=\\mathbf{u}\\odot\\mathbf{v}$ pour $D=\\mathrm{diag}(\\mathbf{u})$",
    ],
    etapes: [
      {
        texte:
          "**La jacobienne de l'activation est diagonale.** $a^{[l]}_{i}=\\varphi(z^{[l]}_{i})$ ne dépend que de $z^{[l]}_{i}$ : sa dérivée par rapport à $z^{[l]}_{j}$ est nulle dès que $j\\neq i$.",
      },
      {
        latex:
          "\\big(J_{\\mathbf{a}^{[l]}}\\big)_{ij}=\\frac{\\partial a^{[l]}_{i}}{\\partial z^{[l]}_{j}}=\\begin{cases}\\varphi'\\big(z^{[l]}_{i}\\big) & j=i\\\\[2pt] 0 & j\\neq i\\end{cases}",
        alt: "Le coefficient de ligne i et de colonne j de la jacobienne de l'activation vaut phi prime en z i si j égale i, et zéro sinon.",
      },
      {
        texte:
          "**Une matrice diagonale multiplie composante par composante.** Pour $D=\\mathrm{diag}(\\mathbf{u})$, la $i$-ième composante de $D\\mathbf{v}$ vaut $u_{i}v_{i}$ : c'est la définition du produit de Hadamard.",
        latex: "\\mathrm{diag}(\\mathbf{u})\\,\\mathbf{v}=\\mathbf{u}\\odot\\mathbf{v}",
        alt: "La matrice diagonale de vecteur u multipliée par un vecteur v est le produit de Hadamard de u et de v.",
      },
      {
        texte:
          "**On compose.** La somme sur les chemins a donné $\\mathrm{grad}_{\\mathbf{a}^{[l]}}\\,\\ell=(W^{[l+1]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}$, et il reste à traverser l'activation.",
      },
      {
        latex:
          "\\boldsymbol{\\delta}^{[l]}=\\mathrm{diag}\\big(\\varphi'(\\mathbf{z}^{[l]})\\big)\\,\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}=\\big[\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}\\big]\\odot\\varphi'\\big(\\mathbf{z}^{[l]}\\big)",
        alt: "Le signal d'erreur de la couche l est la matrice diagonale de phi prime multipliée par la transposée des poids de la couche suivante appliquée au signal d'erreur suivant, ce qui s'écrit aussi comme le produit de Hadamard de ce vecteur et de phi prime.",
        justification:
          "Dimensions : $(d_{l}\\times d_{l})\\,(d_{l}\\times d_{l+1})\\,(d_{l+1}\\times 1)\\rightarrow d_{l}\\times 1$.",
      },
    ],
    resultat: {
      latex:
        "\\boldsymbol{\\delta}^{[l]}=\\big[\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}\\big]\\odot\\varphi'\\big(\\mathbf{z}^{[l]}\\big),\\qquad \\mathrm{grad}_{W^{[l]}}\\,\\ell=\\boldsymbol{\\delta}^{[l]}\\big(\\mathbf{a}^{[l-1]}\\big)^{\\mathsf{T}},\\qquad \\mathrm{grad}_{\\mathbf{b}^{[l]}}\\,\\ell=\\boldsymbol{\\delta}^{[l]}",
      alt: "Le signal d'erreur de la couche l est le produit de Hadamard de la transposée des poids appliquée au signal suivant et de phi prime ; le gradient par rapport à la matrice de poids est le produit extérieur du signal d'erreur par l'activation précédente ; le gradient par rapport au biais est le signal d'erreur.",
    },
    interpretation:
      "Le produit de Hadamard du chapitre 4 n'était pas une commodité d'écriture : c'est ce que devient un produit matriciel quand la matrice est diagonale, et elle est diagonale parce que l'activation s'applique composante par composante.",
    limites: [
      "Le softmax, lui, n'a pas une jacobienne diagonale : chacune de ses composantes dépend de toutes les composantes de $\\mathbf{z}^{[L]}$.",
    ],
  },
  {
    id: "b-cr10-7",
    type: "titre",
    niveau: 2,
    texte: "Le contrôle, et son contre-exemple",
  },
  {
    id: "b-cr10-8",
    type: "sortie",
    ancre: "mesure-6",
    titre:
      "Mesure 6 · la jacobienne d'une couche cachée, par différences finies, 20 indices",
    texte: `  -- relu · couche cachee 3, indices 1 a 20 --------------------------------
    coefficients hors diagonale       380
    hors diagonale non nuls           0
    module maximal hors diagonale     0.000e+00
    module minimal sur la diagonale   0.000e+00

  -- sigmoide · couche cachee 3, indices 1 a 20 ----------------------------
    coefficients hors diagonale       380
    hors diagonale non nuls           0
    module maximal hors diagonale     0.000e+00
    module minimal sur la diagonale   1.465e-01`,
    lecture: [
      "$20\\times 20=400$ coefficients, dont $380$ hors diagonale.",
      "Aucun coefficient hors diagonale n'est non nul, pour les deux activations, et c'est bien ce que la diagonalité annonçait.",
      "Le module minimal sur la diagonale vaut $0$ pour $\\mathrm{ReLU}$, dont la porte est fermée dès que la préactivation est négative, et $0{,}1465$ pour la sigmoïde, dont la dérivée ne s'annule jamais.",
    ],
  },
  {
    id: "b-cr10-9",
    type: "sortie",
    ancre: "mesure-7",
    titre: "Mesure 7 · la même jacobienne pour le softmax de sortie",
    texte: `    couche de sortie, les 10 indices
    coefficients hors diagonale       90
    hors diagonale non nuls           90
    module maximal hors diagonale     2.597e-02
    somme de chaque colonne           4.857e-11`,
    lecture: [
      "$10\\times 10=100$ coefficients, dont $90$ hors diagonale, et les $90$ sont non nuls.",
      "Le plus grand d'entre eux vaut $2{,}597\\cdot 10^{-2}$ : ce n'est pas du bruit d'arrondi.",
      "Chaque colonne somme à zéro, à $4{,}857\\cdot 10^{-11}$ près : pousser une préactivation redistribue de la probabilité entre les classes sans en créer.",
    ],
  },
  {
    id: "b-cr10-9f",
    type: "image",
    ancre: "la-jacobienne-du-softmax",
    src: "/cours/lecon5/l5-fig14-softmax.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "La même grille carrée de cases entre crochets, cette fois pour le softmax de la couche de sortie. Chaque case de la diagonale porte la dérivée d'une composante de la sortie par sa propre somme pondérée, et chaque case hors de la diagonale porte la dérivée d'une composante de la sortie par la somme pondérée d'une autre composante. Aucune case ne porte de zéro.",
    legende:
      "C'est pourquoi la dernière couche est appariée à l'entropie croisée, qui donne $\\boldsymbol{\\delta}^{[L]}=\\mathbf{a}^{[L]}-\\mathbf{y}$ sans traverser cette matrice.",
  },
  {
    id: "b-cr10-10",
    type: "animation",
    ancre: "matrice-diagonale",
    animationId: "la-jacobienne-est-diagonale",
    legende:
      "Un tableau de $400$ coefficients se vide de ses $380$ cases hors diagonale, qui sont toutes nulles.",
  },
  {
    id: "b-cr10-11",
    type: "animation",
    ancre: "matrice-softmax",
    animationId: "le-softmax-ne-se-vide-pas",
    legende:
      "Le même contrôle sur le softmax : $90$ coefficients hors diagonale, $90$ non nuls, et des colonnes qui somment à zéro.",
  },
  {
    id: "b-cr10-12",
    type: "titre",
    niveau: 2,
    texte: "Les équations, sans indices",
  },
  {
    id: "b-cr10-13",
    type: "formule",
    ancre: "formulaire-vectoriel",
    latex:
      "\\begin{aligned}\\boldsymbol{\\delta}^{[L]}&=\\mathbf{a}^{[L]}-\\mathbf{y}\\\\ \\boldsymbol{\\delta}^{[l]}&=\\big[\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}\\big]\\odot\\varphi'\\big(\\mathbf{z}^{[l]}\\big)\\\\ \\mathrm{grad}_{W^{[l]}}\\,\\ell&=\\boldsymbol{\\delta}^{[l]}\\big(\\mathbf{a}^{[l-1]}\\big)^{\\mathsf{T}}\\\\ \\mathrm{grad}_{\\mathbf{b}^{[l]}}\\,\\ell&=\\boldsymbol{\\delta}^{[l]}\\end{aligned}",
    alt: "Quatre lignes. Le signal d'erreur de sortie est l'activation moins la cible. Le signal d'une couche interne est le produit de Hadamard de la transposée des poids suivants appliquée au signal suivant et de phi prime. Le gradient par rapport à la matrice de poids est le produit extérieur du signal par l'activation précédente. Le gradient par rapport au biais est le signal.",
    numero: "5.12",
    legende: "Quatre lignes, aucun indice de neurone.",
  },
  {
    id: "b-cr10-13a",
    type: "animation",
    ancre: "le-gradient-est-un-produit-exterieur",
    animationId: "le-gradient-est-un-produit-exterieur",
    legende:
      "Une colonne et une ligne se croisent, et leur croisement remplit case par case le tableau du gradient de la matrice de poids.",
  },
  {
    id: "b-cr10-14",
    type: "tableau",
    ancre: "dimensions-du-formulaire",
    cleEnTete: true,
    entetes: ["Expression", "Dimensions des facteurs", "Résultat"],
    lignes: [
      [
        "$\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}$",
        "$(d_{l}\\times d_{l+1})(d_{l+1}\\times 1)$",
        "$d_{l}\\times 1$",
      ],
      [
        "$\\big[\\cdot\\big]\\odot\\varphi'(\\mathbf{z}^{[l]})$",
        "$(d_{l}\\times 1)\\odot(d_{l}\\times 1)$",
        "$d_{l}\\times 1$",
      ],
      [
        "$\\boldsymbol{\\delta}^{[l]}\\big(\\mathbf{a}^{[l-1]}\\big)^{\\mathsf{T}}$",
        "$(d_{l}\\times 1)(1\\times d_{l-1})$",
        "$d_{l}\\times d_{l-1}$",
      ],
    ],
    legende:
      "La troisième ligne a bien la forme de $W^{[l]}$, ce que le gradient doit avoir.",
  },
  {
    id: "b-cr10-15",
    type: "texte",
    texte:
      "Une bibliothèque d'apprentissage écrit ces quatre lignes une fois pour toutes, et ce qui reste à savoir faire est de lire une chaîne de dépendances et de dire, à chaque nœud, si elle se ramifie.",
  },
  {
    id: "b-cr10-16",
    type: "verification",
    numero: 60,
    enonce:
      "La jacobienne $J_{\\mathbf{a}^{[l]}}(\\mathbf{z}^{[l]})$ est diagonale, mesures 6 et 7.",
    questions: [
      "Pourquoi cette jacobienne est-elle diagonale ?",
      "Qu'est-ce qui cesserait d'être vrai dans la récurrence du signal d'erreur si l'activation mélangeait les composantes ?",
    ],
  },
];
