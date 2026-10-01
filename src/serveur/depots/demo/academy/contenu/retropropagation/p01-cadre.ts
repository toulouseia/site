import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 1 · Le cadre du cours
//
// La seule page du chapitre où le cadre a droit de cité : prérequis, objectifs,
// plan, dettes. La règle 1 de REGLES.md vise le corps du cours, pas son cadre.
//
// LA PAGE OUVRE SUR UNE QUESTION ET SUR LE RÉSEAU ENTIER, règle 26 : une
// question sans un seul symbole, puis `l4-fig13-reseau-entier`, puis le cadre.
// Le lecteur arrive du chapitre 3, où il n'a vu que des surfaces et des pas ;
// il faut qu'il revoie l'objet avant qu'on lui parle de le corriger.
//
// AUCUN TERME N'EST EMPLOYÉ ICI AVANT SA DÉFINITION. Les objectifs et le plan
// sont écrits avec les seuls mots que le lecteur possède en arrivant : image,
// pixel, réseau, couche, poids, biais, activation, perte, gradient, dérivée,
// matrice, transposée. Les mots du chapitre — signal d'erreur, produit
// extérieur, produit de Hadamard — n'apparaissent qu'à la page qui les pose.
//
// Deux tableaux : la dette que ce chapitre RÈGLE, et les deux qu'il CONTRACTE.
//
// L'ordre des notions suit celui du chapitre sur la rétropropagation de la
// série de Grant Sanderson. Mention ici et page 12, nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

export const R01_CADRE: Bloc[] = [
  {
    id: "b-rp1-0",
    type: "texte",
    texte:
      "Une image traverse le réseau, dix nombres en sortent, et l'étiquette dit lequel des dix aurait dû l'emporter. Il faut maintenant corriger les coefficients du réseau pour que ce soit le cas la prochaine fois, et il y en a plus de cent mille. Par où commence-t-on ?",
  },
  {
    id: "b-rp1-fig13",
    type: "image",
    ancre: "le-reseau-entier",
    src: "/cours/lecon4/l4-fig13-reseau-entier.svg",
    largeur: 1380,
    hauteur: 900,
    alt: "À gauche, une grille carrée de vingt-huit sur vingt-huit pixels portant un deux manuscrit en encre sombre. Une flèche mène à trois colonnes de ronds vides, alignées de gauche à droite. La première montre trois ronds, trois points de suspension et un quatrième rond, et porte dessous le nombre sept cent quatre-vingt-quatre et la mention un par pixel. La deuxième est bâtie de même et porte dessous cent vingt-huit et la mention un choix. La troisième montre ses dix ronds, et porte dessous le nombre dix et la mention un par chiffre. Chaque rond d'une colonne est relié par un filet gris pâle à tous les ronds de la colonne suivante. Au-dessus des colonnes, une flèche grise va de gauche à droite et porte la mention l'aller, chapitre deux. En dessous, une flèche de brique va de droite à gauche et porte la mention le retour, ce chapitre.",
    legende:
      "Le calcul va de l'image vers la réponse ; la correction fait le chemin inverse.",
  },
  {
    id: "b-rp1-fig13-lecture",
    type: "texte",
    texte:
      "La colonne de gauche porte un rond par pixel de l'image, soit $784$, celle de droite en porte dix, un par chiffre possible, et celle du milieu en porte $128$, la largeur que le chapitre 3 a justifiée par la mesure.\n\nLa flèche grise est le calcul du chapitre 2, qui part de l'image et rend dix nombres. La flèche de brique va dans l'autre sens.",
  },
  {
    id: "b-rp1-1",
    type: "texte",
    texte:
      "Le chapitre 3 a établi ce qu'on cherche, une valeur de $\\boldsymbol{\\theta}$ qui minimise $C_{\\mathcal{D}}$, et par quel procédé on la cherche : faire un pas dans la direction $-\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$, puis recommencer. Il n'a obtenu ce vecteur que par différences finies centrées, à un coût qui interdit d'entraîner.",
  },
  {
    id: "b-rp1-3",
    type: "titre",
    niveau: 2,
    texte: "Prérequis",
  },
  {
    id: "b-rp1-4",
    type: "liste",
    ordonnee: true,
    elements: [
      "Le **softmax** et la **perte** d'un exemple, définis au chapitre 2, page 6, avec l'encodage $\\mathbf{y}=\\mathrm{onehot}(c)$ ; le nom d'**entropie croisée** est posé au chapitre 3, page 5.",
      "La **dérivée partielle** et le **gradient**, définis au chapitre 3, page 8, avec leurs types : un scalaire pour la première, un vecteur colonne de $\\mathbb{R}^{p}$ pour le second.",
      "Les **différences finies centrées** $\\big[C(\\theta+\\varepsilon)-C(\\theta-\\varepsilon)\\big]/(2\\varepsilon)$, employées au chapitre 3 comme procédé de contrôle, et leur coût.",
      "Le **produit matriciel** et sa règle de dimensions : $(m\\times n)(n\\times q)\\rightarrow m\\times q$, le nombre de colonnes du premier facteur devant égaler le nombre de lignes du second.",
      "L'architecture $784\\rightarrow 128\\rightarrow 10$ du chapitre 2 : $\\mathbf{z}^{[l]}=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}$, $\\mathrm{ReLU}$ sur la couche cachée, $\\mathrm{softmax}$ en sortie.",
    ],
  },
  {
    id: "b-rp1-5",
    type: "titre",
    niveau: 2,
    texte: "Objectifs",
  },
  {
    id: "b-rp1-6",
    type: "liste",
    ordonnee: true,
    elements: [
      "**Lire** sur les dix nombres que le réseau vient de rendre dans quel sens chacun doit bouger, et sur quelle quantité cette lecture porte.",
      "**Démontrer** qu'un seul des dix doit monter, et que sa correction pèse autant que celles des neuf autres réunies.",
      "**Démontrer** que la dérivée de la perte par rapport à un biais de la dernière couche ne dépend d'aucune activation.",
      "**Démontrer** que la dérivée par rapport à un poids est exactement proportionnelle à l'activation d'où ce poids part, et écrire les $1\\,280$ dérivées d'un coup.",
      "**Lire** sur le signe d'un poids le sens dans lequel l'activation d'avant doit varier.",
      "**Démontrer** que les dix termes portés sur une même activation cachée s'additionnent, et que cette somme s'écrit avec la matrice transposée.",
      "**Écrire** le passage d'une couche à l'autre, et dire ce que $\\mathrm{ReLU}$ laisse passer au retour.",
      "**Démontrer** que la moyenne des corrections d'exemples est le gradient du coût, sans facteur ni approximation.",
      "**Vérifier** l'algorithme entier par différences finies, et chiffrer ce qu'il économise.",
    ],
  },
  {
    id: "b-rp1-7",
    type: "titre",
    niveau: 2,
    texte: "Plan",
  },
  {
    id: "b-rp1-8",
    type: "liste",
    ancre: "plan-de-la-retropropagation",
    ordonnee: true,
    elements: [
      "Poser ce qu'on cherche, et le chiffre qui interdit de l'obtenir par différences finies",
      "Lire, sur un seul exemple, dans quel sens chacune des dix sorties doit bouger",
      "Suivre la première voie : le biais",
      "Suivre la deuxième voie : les poids",
      "Rapprocher la mise à jour de la théorie de Hebb, et dire où l'analogie casse",
      "Suivre la troisième voie : les activations de la couche d'avant",
      "Additionner les dix termes portés sur une même activation cachée",
      "Descendre d'une couche, et traverser $\\mathrm{ReLU}$",
      "Passer d'un exemple à tous les exemples",
      "Écrire l'algorithme, et le vérifier",
      "Synthèse, formulaire, tableau des objets, erreurs fréquentes",
    ],
  },
  {
    id: "b-rp1-10",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre règle",
  },
  {
    id: "b-rp1-11",
    type: "texte",
    texte:
      "Le chapitre 3 se termine sur un chiffre, et c'est la question qu'il laisse à celui-ci.",
  },
  {
    id: "b-rp1-12",
    type: "tableau",
    ancre: "dette-reglee",
    cleEnTete: true,
    entetes: ["Dette ouverte au chapitre 3", "Réglée page", "Comment"],
    lignes: [
      [
        "Un gradient par différences finies centrées coûte $203\\,540$ propagations avant, et il en faut un à chaque pas",
        "3 à 11",
        "Par l'algorithme construit aux pages 3 à 9, puis chronométré page 11 : $2\\,384$ µs contre $42{,}9$ s sur la même machine",
      ],
    ],
  },
  {
    id: "b-rp1-14",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre laisse ouvert",
  },
  {
    id: "b-rp1-15",
    type: "tableau",
    ancre: "dettes-contractees",
    cleEnTete: true,
    entetes: ["Dette", "D'où elle vient", "Chapitre qui la rembourse"],
    lignes: [
      [
        "La preuve de la règle de la chaîne, dans ses deux formes",
        "Page 3 : les deux énoncés sont admis et vérifiés numériquement, non démontrés",
        "Bloc de mathématiques : l'approximation au premier ordre",
      ],
      [
        "La dérivée de la perte d'entropie croisée composée avec le softmax, $\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell=\\mathbf{a}^{[2]}-\\mathbf{y}$",
        "Page 3 : le chapitre 2 pose le softmax et la perte, mais n'y dérive aucun gradient",
        "Bloc de mathématiques, avec la règle de la chaîne dont elle est un cas",
      ],
      [
        "La forme générale à $L$ couches, et le traitement d'une fonction d'activation quelconque",
        "Page 9 : le passage d'une couche à l'autre est écrit une fois, pour $\\mathrm{ReLU}$ et pour deux couches",
        "Chapitre 5 : la règle de la chaîne multivariée sous forme jacobienne",
      ],
    ],
  },
  {
    id: "b-rp1-16",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du **chapitre sur la rétropropagation de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les sept propositions, les huit mesures et les animations sont propres à ce cours. Quatre écarts délibérés y sont pris, et chacun est signalé au lecteur à l'endroit où il se produit.",
  },
  {
    id: "b-rp1-17",
    type: "encart",
    ton: "rappel",
    titre: "Le protocole des mesures",
    texte:
      "Réseau $784\\rightarrow 128\\rightarrow 10$, $\\mathrm{ReLU}$, $\\mathrm{softmax}$, entropie croisée, poids tirés selon une loi normale centrée d'écart-type $\\sqrt{2/d_{l-1}}$, biais nuls, graine $0$, soit le protocole des chapitres 2 et 3. Le réseau est **non entraîné**, sauf à la mesure 4. Tous les nombres cités sortent de `cours/lecon4/mesures.py`.",
  },
];
