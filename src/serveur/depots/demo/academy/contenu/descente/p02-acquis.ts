import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 2 · Ce qu'on a construit, et ce qui manque
//
// Une page de rappel, et rien d'autre. Elle ne redémontre rien : elle remet en
// main les objets du chapitre 2, y compris l'espoir des bords ET son démenti,
// pour que le lecteur n'ait pas à choisir entre deux souvenirs.
//
// OUVERTURE : une question sur les deux réseaux du chapitre 2, puis la figure
// qui les met côte à côte, puis le rappel. Règle 26.
//
// Les quatre notations d'indice sont rappelées ici parce que ce chapitre en
// ajoute deux qui se ressemblent, theta_t et theta_i, et que les confondre rend
// tout le chapitre illisible.
// ─────────────────────────────────────────────────────────────────────────────

export const D02_ACQUIS: Bloc[] = [
  {
    id: "b-d2-0",
    type: "texte",
    texte:
      "Le chapitre précédent a construit deux réseaux pour la même tâche, un petit et un grand. Qu'est-ce que le grand achète de plus, et à quel prix ?",
  },
  {
    id: "b-d2-fig03",
    type: "image",
    ancre: "deux-architectures",
    src: "/cours/lecon3/l3-fig03-deux-architectures.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Deux rangées de rectangles. La rangée du haut porte quatre rectangles nommés 784, 16, 16 et 10, et se termine par le nombre treize mille deux. La rangée du bas porte trois rectangles nommés 784, 128 et 10, et se termine par le nombre cent un mille sept cent soixante-dix. La largeur de chaque rectangle suit le nombre de neurones de sa couche.",
    legende:
      "La seconde est celle que ce chapitre entraîne, avec le même protocole qu'au chapitre 2.",
  },
  {
    id: "b-d2-1",
    type: "titre",
    niveau: 2,
    texte: "Ce que le chapitre 2 a construit",
  },
  {
    id: "b-d2-2",
    type: "texte",
    texte:
      "Une image de $28\\times 28$ pixels devient un vecteur $\\mathbf{x}$ de $784$ nombres compris entre $0$ et $1$, sur lequel chaque neurone d'une couche calcule une somme pondérée des activations qui le précèdent, plus un biais, avant qu'une fonction non affine ne s'applique au résultat. La dernière couche compte dix neurones, un par chiffre, et $\\mathrm{softmax}$ transforme leurs dix scores en une loi de probabilité sur les dix classes : **le plus actif des dix est la réponse du réseau**. Sa valeur n'est pas une confiance, et le chapitre 2 l'a montré page 11.",
  },
  {
    id: "b-d2-3",
    type: "tableau",
    ancre: "comptes-des-architectures",
    titre: "Les deux architectures du chapitre 2, et leurs comptes",
    cleEnTete: true,
    entetes: ["Architecture", "Détail du compte", "$p$", "Précision de test"],
    lignes: [
      [
        "$784\\rightarrow 16\\rightarrow 16\\rightarrow 10$",
        "$16{\\cdot}784+16+16{\\cdot}16+16+10{\\cdot}16+10$",
        "$13\\,002$",
        "$0{,}9437$",
      ],
      [
        "$784\\rightarrow 128\\rightarrow 10$",
        "$128{\\cdot}784+128+10{\\cdot}128+10$",
        "$101\\,770$",
        "$0{,}9814$",
      ],
    ],
    legende:
      "Chaque produit s'écrit **sortie fois entrée**, dans l'ordre des dimensions de la matrice : $W^{[1]}$ du second réseau a $128$ lignes et $784$ colonnes. Les $88\\,768$ paramètres de plus achètent $3{,}77$ points de précision, et la page 11 mesure ce que coûterait le point suivant.",
  },
  {
    id: "b-d2-4",
    type: "texte",
    texte:
      "On appelle $\\boldsymbol{\\theta}$ l'ensemble de ces $101\\,770$ nombres, et il se range en quatre blocs : les deux matrices $W^{[1]}$ et $W^{[2]}$, les deux vecteurs de biais $\\mathbf{b}^{[1]}$ et $\\mathbf{b}^{[2]}$. Les quatre ne pèsent pas le même poids, et la conséquence occupera la page 10 : corriger $W^{[1]}$ et corriger $\\mathbf{b}^{[2]}$ ne sont pas deux gestes comparables.",
  },
  {
    id: "b-d2-fig04",
    type: "image",
    ancre: "deux-matrices",
    src: "/cours/lecon3/l3-fig04-deux-matrices.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Deux rectangles gris dessinés à la même échelle, un coefficient par unité de longueur. Le premier, nommé W exposant un, est large et haut : cent vingt-huit sur sept cent quatre-vingt-quatre, soit cent mille trois cent cinquante-deux coefficients, et il porte la mention quatre-vingt-dix-huit virgule six pour cent. Le second, nommé W exposant deux, est une bande étroite de dix sur cent vingt-huit, soit mille deux cent quatre-vingts coefficients, et il porte la mention un virgule trois pour cent.",
    legende:
      "Les deux matrices sont dessinées à la même échelle : une unité de longueur pour un coefficient.",
  },
  {
    id: "b-d2-5",
    type: "animation",
    ancre: "le-reseau-au-hasard",
    animationId: "le-reseau-au-hasard",
    legende:
      "Le réseau, ses poids tirés à la graine $0$, propage une image : la colonne des dix sorties s'allume, et aucune n'a encore de raison de l'emporter.",
  },
  {
    id: "b-d2-6",
    type: "encart",
    ton: "rappel",
    titre: "L'espoir des bords, et son démenti",
    texte:
      "Le chapitre 2 a bâti l'idée qu'un neurone caché pourrait détecter une boucle ou un trait, et que la hiérarchie pixels, bords, motifs, chiffres se lirait dans les poids. **La mesure l'a écartée** : la corrélation maximale entre un gabarit caché et un gabarit de classe vaut $0{,}4894$, la moyenne $0{,}0853$, et aucun couple ne dépasse $0{,}5$. Le réseau atteint donc $98{,}14\\,\\%$ sans que ce qu'il a trouvé ressemble à ce qu'on espérait qu'il trouve.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.2 · Ce qui manque
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d2-7",
    type: "titre",
    niveau: 2,
    texte: "Ce qui manque",
  },
  {
    id: "b-d2-8",
    type: "texte",
    texte:
      "Chaque nombre cité au chapitre 2 sortait d'un réseau **déjà entraîné** : le gabarit du $0$ dont le minimum tombe en $(16,15)$, les $35$ neurones allumés sur l'image de test n°0, la précision de $0{,}9814$, les $186$ erreurs. Le chapitre l'a dit à chaque fois, et il n'a jamais dit comment ces $101\\,770$ nombres avaient été obtenus.",
  },
  {
    id: "b-d2-9",
    type: "texte",
    texte:
      "Il n'a pas non plus dit d'où venaient la largeur $h=128$, le taux $\\eta=0{,}5$ et les lots de $64$, ni ce que $\\mathrm{ReLU}$ fait perdre à la perte, ni ce que coûte le fait que $\\sigma'$ ne dépasse jamais $1/4$. Six questions en tout, et le tableau de la page 1 dit où chacune se règle.",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 2.3 · Les notations
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d2-11",
    type: "titre",
    niveau: 2,
    texte: "Quatre notations d'indice, dont deux qui se ressemblent",
  },
  {
    id: "b-d2-12",
    type: "tableau",
    ancre: "quatre-indices",
    cleEnTete: true,
    entetes: ["Écriture", "Ce qu'elle désigne", "Ce qu'elle n'est pas"],
    lignes: [
      ["$x^{(n)}$", "Le $n$-ième **exemple** du jeu", "Une puissance"],
      [
        "$W^{[l]}$",
        "La **couche** $l$ du réseau",
        "Ni une puissance, ni un exemple",
      ],
      [
        "$\\boldsymbol{\\theta}_{t}$",
        "La valeur de $\\boldsymbol{\\theta}$ à l'**itération** $t$",
        "Une composante de $\\boldsymbol{\\theta}$",
      ],
      [
        "$\\theta_{i}$",
        "La $i$-ième **composante** de $\\boldsymbol{\\theta}$",
        "Une itération",
      ],
    ],
    legende:
      "Les deux derniers ne diffèrent que par la lettre mise en indice, et ils ne désignent pas la même chose. Dans tout ce chapitre, **$t$ est réservé aux itérations et $i$ aux composantes**, sans exception, et le gras distingue le vecteur $\\boldsymbol{\\theta}_{t}$ du scalaire $\\theta_{i}$.",
  },
  {
    id: "b-d2-13",
    type: "texte",
    texte:
      "Les objets du chapitre 2 sont donc en main, et le procédé qui choisit $\\boldsymbol{\\theta}$ manque toujours. Avant de le construire, il faut dire ce qu'on lui demande.",
  },
];
