import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 2 · Ce qu'il reste à établir
//
// Ouverture en trois blocs, règle 26 : la question, puis les deux réseaux côte
// à côte (l5-fig02-du-cas-au-general.svg, 1380 sur 700), puis le cadre.
//
// Les trois titres qui commentaient le programme sont partis, règle 1 : « Ce
// qui est acquis », « Ce qui manque », « Par où commencer ». Les deux tableaux
// qu'ils portaient restent, réécrits pour parler des objets et non des pages :
// ce dont le résultat dépend, et combien d'indices porte une dérivée selon la
// forme du réseau. Le repère de progression est devenu la phrase finale,
// règle 8.
//
// Le nombre 101 770 est celui du réseau du chapitre 2 ; il est reproduit par
// cours/lecon5/mesures.py, mesure 5.
//
// FAUTE D'INDICE CORRIGÉE dans le tableau des trois écritures : la deuxième
// ligne portait a^[l]_j ; la formule (5.9) de la page 9 impose a^[l−1]_j, car
// j numérote un neurone de la couche PRÉCÉDENTE. La légende le dit maintenant.
//
// Trois symboles étaient employés sans être posés au point d'emploi : δ^[l],
// p et 𝒟. Les deux premiers viennent du chapitre 4 et du chapitre 3, le
// troisième du chapitre 3 ; ils sont glosés en quelques mots, dans la légende
// de (5.1) et dans celle du tableau.
// ─────────────────────────────────────────────────────────────────────────────

export const C02_MANQUE: Bloc[] = [
  {
    id: "b-cr2-1",
    type: "texte",
    texte:
      "Deux couches ou dix, une image entre par un bout et une réponse sort par l'autre, et le trajet aller se déroule de la même façon à chaque couche. Rien ne garantit que le trajet du retour, celui qui distribue la correction, ait la même régularité. Un calcul qui marche sur deux couches marche-t-il sur dix ?",
  },
  {
    id: "b-cr2-1f",
    type: "image",
    ancre: "deux-couches-et-l-couches",
    src: "/cours/lecon5/l5-fig02-du-cas-au-general.svg",
    alt: "Deux réseaux côte à côte, tracés de la même façon, en ronds reliés de gauche à droite par des flèches. À gauche, un réseau de deux couches, dont la couche cachée porte ReLU. À droite, un réseau de L couches, dont les couches du milieu sont remplacées par trois points de suspension et dont chaque couche cachée porte phi.",
    largeur: 1380,
    hauteur: 700,
    legende:
      "Le trajet est le même des deux côtés. Seuls changent le nombre de couches et le nom de l'activation.",
  },
  {
    id: "b-cr2-1c",
    type: "texte",
    texte:
      "Passer de deux couches à $L$ ne consiste pas à recopier le même calcul plus souvent : il y faut une écriture qui ne suppose rien du nombre de couches, et un argument qui vaille pour toutes à la fois. Le même écart sépare $\\mathrm{ReLU}$ d'une activation $\\varphi$ quelconque.",
  },
  {
    id: "b-cr2-2",
    type: "texte",
    texte:
      "Le gradient d'un coût est le vecteur de ses dérivées partielles par rapport à **tous** les poids et biais, défini au chapitre 3, page 8 ; sur le réseau $784\\rightarrow 128\\rightarrow 10$, il compte $101\\,770$ composantes. La rétropropagation est l'algorithme qui les produit toutes.",
  },
  {
    id: "b-cr2-3",
    type: "formule",
    ancre: "le-gradient-rappele",
    latex:
      "\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}=\\Big(\\frac{\\partial C_{\\mathcal{D}}}{\\partial\\theta_{1}},\\ \\dots,\\ \\frac{\\partial C_{\\mathcal{D}}}{\\partial\\theta_{p}}\\Big)^{\\mathsf{T}}\\in\\mathbb{R}^{p}",
    alt: "Le gradient du coût par rapport à thêta est le vecteur colonne des dérivées partielles du coût par rapport à chacune des p composantes de thêta.",
    numero: "5.1",
    legende:
      "Chapitre 3, page 8. $C_{\\mathcal{D}}$ est le coût moyen sur le jeu de données $\\mathcal{D}$ et $p$ le nombre de paramètres du réseau : une composante par paramètre, sans exception.",
  },
  {
    id: "b-cr2-4",
    type: "titre",
    niveau: 2,
    texte: "Quand la profondeur et l'activation ne sont plus fixées",
  },
  {
    id: "b-cr2-5",
    type: "tableau",
    ancre: "acquis-et-manquant",
    cleEnTete: true,
    entetes: [
      "Ce dont le résultat dépend",
      "Deux couches et ReLU",
      "Profondeur et activation quelconques",
    ],
    lignes: [
      ["Nombre de couches", "$2$", "$L$ quelconque, $L\\geq 2$"],
      [
        "Activation cachée",
        "$\\mathrm{ReLU}$",
        "$\\varphi$ quelconque, dérivable sauf en un nombre fini de points",
      ],
      [
        "Statut des identités",
        "Vérifiées sur ce cas",
        "Démontrées, par récurrence sur $l$",
      ],
      ["Coût de l'algorithme", "Chronométré", "Compté en multiplications"],
    ],
    legende:
      "Vérifier une identité sur un cas ne la démontre pas, et une durée d'horloge n'est pas un compte d'opérations.",
  },
  {
    id: "b-cr2-7",
    type: "titre",
    niveau: 2,
    texte: "Combien d'indices porte une dérivée",
  },
  {
    id: "b-cr2-8",
    type: "texte",
    texte:
      "Une dérivée $\\partial\\ell/\\partial W^{[l]}_{ij}$ porte trois indices : la couche, la ligne et la colonne. Sur un réseau qui n'a qu'un neurone par couche il n'en reste qu'un, celui de la couche, parce que chaque quantité y est un nombre et non une matrice, et que la règle de la chaîne s'y réduit à un produit de nombres.",
  },
  {
    id: "b-cr2-9",
    type: "tableau",
    ancre: "la-descente-et-la-remontee",
    titre: "Le même calcul, dans trois écritures",
    cleEnTete: true,
    entetes: ["Réseau", "Ce qui s'écrit", "Indices de neurone"],
    lignes: [
      [
        "$1\\rightarrow 1\\rightarrow 1\\rightarrow 1$",
        "$w^{[l]}$, $z^{[l]}$, $a^{[l]}$",
        "Aucun",
      ],
      [
        "$d_{0}\\rightarrow\\dots\\rightarrow d_{L}$",
        "$W^{[l]}_{ij}$, $z^{[l]}_{i}$, $a^{[l-1]}_{j}$",
        "Deux",
      ],
      [
        "$d_{0}\\rightarrow\\dots\\rightarrow d_{L}$",
        "$W^{[l]}$, $\\mathbf{z}^{[l]}$, $\\boldsymbol{\\delta}^{[l]}$",
        "Aucun",
      ],
    ],
    legende:
      "$i$ numérote le neurone de la couche $l$ et $j$ celui de la couche $l-1$, qui fournit l'activation. Les deux dernières lignes portent sur le même réseau : ranger les composantes dans des vecteurs et des matrices fait disparaître les indices, sans rien changer au calcul. $\\boldsymbol{\\delta}^{[l]}$ est le signal d'erreur de la couche $l$, posé au chapitre 4.",
  },
  {
    id: "b-cr2-11",
    type: "encart",
    ton: "note",
    titre: "Le réseau des mesures",
    texte:
      "Les nombres mesurés du chapitre sortent d'un réseau $784\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 10$, soit $L=5$ et $63\\,370$ paramètres. Ses quatre couches cachées font tourner la récurrence quatre fois, là où deux couches ne la font tourner qu'une.",
  },
  {
    id: "b-cr2-12",
    type: "texte",
    texte:
      "Les chapitres 3 et 4 emploient la règle de la chaîne sans l'énoncer, et sous deux formes différentes qu'il faut savoir distinguer.",
  },
];
