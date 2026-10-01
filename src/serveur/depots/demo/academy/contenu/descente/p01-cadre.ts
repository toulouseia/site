import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 1 · Le cadre du cours
//
// La seule page du chapitre où le cours parle de lui-même : la règle 1 de
// REGLES.md vise le corps du cours, pas son cadre.
//
// LA PAGE OUVRE SUR UNE QUESTION, PUIS SUR DEUX FIGURES, PUIS SUR LE CADRE.
// C'est la règle 26. La première figure porte le réseau entier avec ses quatre
// blocs de paramètres, chacun marqué d'un point d'interrogation ; la seconde
// porte la flèche qui manque, celle qui fabriquerait ces nombres. Le cadre ne
// vient qu'après.
//
// Deux tableaux et deux seulement : les six dettes que ce chapitre RÈGLE, et
// les quatre qu'il CONTRACTE. Un chapitre qui ne dirait que les premières
// laisserait croire qu'il ne doit plus rien.
//
// L'ordre des notions suit celui du chapitre 2 de la série de Grant Sanderson.
// Mention ici et page 12, nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

export const D01_CADRE: Bloc[] = [
  {
    id: "b-d1-0",
    type: "texte",
    texte:
      "Un réseau qui lit un chiffre manuscrit contient plus de cent mille nombres. Qui les a choisis ?",
  },
  {
    id: "b-d1-fig01",
    type: "image",
    ancre: "le-reseau-sans-ses-nombres",
    src: "/cours/lecon3/l3-fig01-le-reseau-sans-ses-nombres.svg",
    largeur: 1380,
    hauteur: 700,
    alt: "À gauche, trois colonnes de ronds vides reliées par des filets pâles, la première portant le nombre 784 et la mention une par pixel, la deuxième 128, la troisième 10 et la mention une par chiffre. À droite, quatre lignes nomment les quatre blocs de paramètres : W exposant un avec cent mille trois cent cinquante-deux, b exposant un avec cent vingt-huit, W exposant deux avec mille deux cent quatre-vingts, b exposant deux avec dix. Chaque ligne se termine par un point d'interrogation en brique. Sous un filet, le total de cent un mille sept cent soixante-dix.",
    legende:
      "Le chapitre 2 a construit cette structure et a cité ces nombres. Il n'a jamais dit d'où ils venaient.",
  },
  {
    id: "b-d1-fig02",
    type: "image",
    ancre: "la-fleche-qui-manque",
    src: "/cours/lecon3/l3-fig02-la-fleche-qui-manque.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "À gauche, une boîte rectangulaire à l'encre porte f indice thêta ; une flèche venue de la gauche y entre sous la mention une image, une flèche en sort vers la droite sous la mention un chiffre, et une flèche montante y amène thêta par le bas. À droite, une boîte rectangulaire en brique ne porte qu'un point d'interrogation ; une flèche venue de la gauche y entre sous la mention le jeu, et une flèche en sort vers le bas, portant thêta.",
    legende:
      "La boîte de gauche est le chapitre 2. Celle de droite est ce chapitre, et elle est encore vide.",
  },
  {
    id: "b-d1-1",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre établit",
  },
  {
    id: "b-d1-2",
    type: "texte",
    texte:
      "Le chapitre 2 a construit une fonction $f_{\\boldsymbol{\\theta}}:\\mathbb{R}^{784}\\rightarrow\\Delta^{\\circ}_{9}$ et a cité les valeurs de ses $101\\,770$ paramètres sans dire d'où elles venaient ; ce chapitre le dit, en établissant **ce qu'on cherche**, une valeur de $\\boldsymbol{\\theta}$ qui minimise une fonction de coût, puis **par quel procédé** on la cherche, la descente de gradient.",
  },
  {
    id: "b-d1-3",
    type: "texte",
    texte:
      "Une chose reste dehors, et il vaut mieux le savoir en entrant : le **calcul efficace** du gradient. Ce chapitre obtient le sien par un procédé qui ne demande que des propagations avant, s'en sert pour toutes ses mesures, puis chiffre pourquoi ce procédé serait impraticable pour entraîner, et c'est ce chiffre qui ouvre le chapitre 4.",
  },
  {
    id: "b-d1-4",
    type: "titre",
    niveau: 2,
    texte: "Prérequis",
  },
  {
    id: "b-d1-5",
    type: "liste",
    ordonnee: true,
    elements: [
      "Les objets du **chapitre 2** : l'entrée $\\mathbf{x}\\in\\mathbb{R}^{784}$, les matrices $W^{[l]}$, les biais $\\mathbf{b}^{[l]}$, le quadruplet $\\boldsymbol{\\theta}$ qu'ils forment, $\\mathrm{ReLU}$, $\\mathrm{softmax}$, le simplexe $\\Delta^{\\circ}_{K-1}$, la perte $\\ell$ et le compte $p=\\sum_{l}(d_{l}d_{l-1}+d_{l})$.",
      "Les objets du **chapitre 1** : la perte $\\ell$ sur un exemple, la fonction $\\mathcal{L}_{\\mathcal{D}}$ qu'on y annonce comme celle à minimiser, le pas $\\eta$ et le compteur d'itérations $t$.",
      "La **dérivée** d'une fonction d'une variable, et sa lecture comme pente locale : $f'(a)>0$ signifie que $f$ croît au voisinage de $a$.",
      "Le **développement au premier ordre** d'une fonction dérivable, $f(a+s)=f(a)+s\\,f'(a)+o(s)$, où $o(s)$ désigne une quantité dont le rapport à $s$ tend vers $0$.",
      "L'**exponentielle** et le **logarithme népérien**, et le fait que $\\ln$ est strictement croissant sur $\\mathbb{R}_{>0}$.",
      "La notion de **partie convexe** de $\\mathbb{R}^{d}$, rappelée au chapitre 2 page 7.",
    ],
  },
  {
    id: "b-d1-6",
    type: "titre",
    niveau: 2,
    texte: "Objectifs",
  },
  {
    id: "b-d1-7",
    type: "liste",
    ordonnee: true,
    elements: [
      "**Écrire** le problème d'apprentissage comme la recherche d'un élément de $\\arg\\min_{\\boldsymbol{\\theta}} C_{\\mathcal{D}}$, en disant précisément ce que cet ensemble contient.",
      "**Distinguer** la perte d'un exemple du coût sur un jeu, et dire pourquoi ils ne prennent pas les mêmes arguments.",
      "**Démontrer** que le taux d'erreur ne peut pas servir de coût, et en déduire la raison des activations continues.",
      "**Démontrer** que le signe moins fait décroître le coût, et dire ce que cette démonstration ne donne pas.",
      "**Définir** dérivée partielle, gradient et dérivée directionnelle, et typer chacun.",
      "**Démontrer** que le gradient d'un mini-lot est sans biais, et que sa qualité croît comme la racine de la taille du lot.",
      "**Lire** un gradient : le signe d'une composante, et sa taille relative.",
      "**Démontrer** qu'un réseau à couche cachée a autant de jeux de paramètres de même coût qu'il y a de façons d'ordonner ses $h$ neurones cachés, et les construire explicitement.",
      "**Chiffrer** le coût d'un gradient par différences finies, et dire pourquoi il faut autre chose.",
    ],
  },
  {
    id: "b-d1-8",
    type: "titre",
    niveau: 2,
    texte: "Plan",
  },
  {
    id: "b-d1-9",
    type: "liste",
    ancre: "plan",
    ordonnee: true,
    elements: [
      "Rappeler ce que le chapitre 2 a construit, et ce qui y manquait",
      "Dire ce qu'apprendre veut dire : écrire l'algorithme qui règle, pas celui qui reconnaît",
      "Mesurer ce que vaut un réseau au départ",
      "Choisir la fonction qui juge une réponse, et trancher entre deux candidates par une mesure",
      "Passer de la perte d'un exemple au coût sur tout le jeu",
      "Descendre, en dimension un, et démontrer qu'on ne peut pas minimiser ce qu'on veut vraiment",
      "Descendre en dimension quelconque : le gradient, le taux d'apprentissage, et ce qu'il coûte",
      "Comprendre pourquoi on n'utilise jamais tout le jeu d'un coup",
      "Lire ce qu'un gradient encode : le signe, et la taille relative",
      "Constater qu'il n'y a pas une bonne réponse, mais un nombre gigantesque",
      "Synthèse, formulaire, tableau des objets, erreurs fréquentes",
    ],
  },
  {
    id: "b-d1-11",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre règle",
  },
  {
    id: "b-d1-12",
    type: "texte",
    texte:
      "Le chapitre 2 a nommé **trois** dettes envers celui-ci, et il a en outre employé **trois** réglages sans les justifier. Les six se règlent ici, à l'endroit que le tableau indique. Ses deux autres dettes, la forme de la sigmoïde et la géométrie de la grille, vont à d'autres cours, et ce chapitre ne les touche pas.",
  },
  {
    id: "b-d1-13",
    type: "tableau",
    ancre: "dettes-reglees",
    cleEnTete: true,
    entetes: ["Ce que le chapitre 2 a laissé", "Réglé page", "Comment"],
    lignes: [
      [
        "**Dette nommée** : d'où viennent les paramètres cités page 4",
        "4",
        "Par le procédé que ce chapitre construit ; la mesure du réseau au départ ouvre la démonstration",
      ],
      [
        "**Dette nommée** : $h=128$ annoncé comme non justifié",
        "11",
        "Par une mesure : cinq largeurs, même protocole, précision et durée",
      ],
      [
        "**Dette nommée** : la perte cesse d'être convexe en $\\boldsymbol{\\theta}$",
        "7 et 11",
        "Par la définition de la convexité page 7, puis la proposition 6 page 11",
      ],
      [
        "**Réglage non justifié** : $\\sigma'\\leq 1/4$, et sa conséquence",
        "10",
        "Par la lecture des composantes du gradient couche par couche",
      ],
      [
        "**Réglage non justifié** : les mini-lots de $64$",
        "9",
        "Par les propositions 4 et 5, et la mesure du cosinus pour cinq tailles",
      ],
      [
        "**Réglage non justifié** : $\\eta=0{,}05$ contre $\\eta=0{,}5$",
        "8",
        "Par un balayage de sept valeurs, et l'aveu que rien ici ne permet de prédire le bon réglage",
      ],
    ],
  },
  {
    id: "b-d1-15",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre laisse ouvert",
  },
  {
    id: "b-d1-16",
    type: "tableau",
    ancre: "dettes-contractees",
    cleEnTete: true,
    entetes: ["Dette", "D'où elle vient", "Chapitre qui la rembourse"],
    lignes: [
      [
        "La preuve que le gradient est la direction de plus forte croissance",
        "Page 8 : la proposition 3 est énoncée et vérifiée numériquement, non démontrée",
        "Optimisation · l'approximation au premier ordre et Cauchy-Schwarz",
      ],
      [
        "Le seuil exact sur $\\eta$ au-delà duquel la descente diverge",
        "Page 7 : la proposition 2 dit « pour $\\eta$ assez petit » sans quantifier",
        "Optimisation",
      ],
      [
        "Le cadre probabiliste de $\\mathbb{E}$, $\\mathrm{Var}$ et de l'indépendance",
        "Page 9 : les trois sont posés au strict nécessaire pour les propositions 4 et 5",
        "Fondements probabilistes",
      ],
      [
        "Le coût de test qui remonte alors que le coût d'entraînement descend",
        "Page 8 : la mesure de la norme du gradient le fait apparaître sans le traiter",
        "Évaluation · sur-apprentissage",
      ],
    ],
  },
  {
    id: "b-d1-17",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du **deuxième chapitre de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les six propositions, les onze mesures et les animations sont propres à ce cours. Cinq écarts délibérés y sont pris, et chacun est signalé au lecteur à l'endroit où il se produit.",
  },
];
