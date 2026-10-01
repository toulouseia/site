import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 6 · Le coût sur tout le jeu
//
// La page fait trois choses, et la troisième est celle qu'on oublie :
//
//   1. elle définit C_D comme une moyenne de pertes ;
//   2. elle distingue ell de C_D -- ils ne prennent pas les mêmes arguments,
//      et c'est l'erreur fréquente n°1 du chapitre ;
//   3. elle TRANCHE le statut du jeu : D est un paramètre de la définition,
//      pas une variable de la fonction. On ne dérive jamais par rapport à D.
//
// LES DEUX FIGURES SONT LE CŒUR DE LA PAGE, et elles sont jumelles à dessein :
// même montage, mêmes proportions, et tout ce qui y change est ce qui entre,
// ce qui sort, et ce qui est fixé. C'est la distinction visible côte à côte de
// la règle 20.
//
// Aucun nombre neuf ici : les comptes viennent du chapitre 2, et sont
// revérifiés par cours/lecon3/mesures.py.
// ─────────────────────────────────────────────────────────────────────────────

export const D06_COUT_DU_JEU: Bloc[] = [
  {
    id: "b-d6-0",
    type: "texte",
    texte:
      "La perte juge une réponse, et il y a soixante mille images. Sur laquelle règle-t-on les paramètres ?",
  },
  {
    id: "b-d6-fig11",
    type: "image",
    ancre: "le-reseau-est-une-fonction",
    src: "/cours/lecon3/l3-fig11-le-reseau-est-une-fonction.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Une boîte rectangulaire à l'encre porte en son centre f indice thêta. Une flèche y entre à gauche depuis la mention sept cent quatre-vingt-quatre nombres, et une flèche en sort à droite vers la mention dix nombres. Sous la boîte se lit fixé, puis thêta.",
    legende:
      "Ce qui varie est l'image ; $\\boldsymbol{\\theta}$ ne bouge pas.",
  },
  {
    id: "b-d6-fig12",
    type: "image",
    ancre: "le-cout-est-une-fonction",
    src: "/cours/lecon3/l3-fig12-le-cout-est-une-fonction.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Une boîte rectangulaire en brique, de même forme que la précédente, porte en son centre C indice D. Une flèche y entre à gauche depuis la mention cent un mille sept cent soixante-dix nombres, et une flèche en sort à droite vers la mention un nombre. Sous la boîte se lit fixé, puis le jeu.",
    legende:
      "Le même montage, et tout y est inversé : ce qui varie est $\\boldsymbol{\\theta}$, et c'est le jeu qui ne bouge pas.",
  },
  {
    id: "b-d6-1",
    type: "texte",
    texte:
      "On ne peut pas minimiser $\\ell$ en $\\boldsymbol{\\theta}$, pour une raison simple : $\\ell$ ne voit pas $\\boldsymbol{\\theta}$. Il faut donc une fonction d'une seule variable, $\\boldsymbol{\\theta}$, dont la minimisation soit exactement le problème posé page 3.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6.1 · La moyenne
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d6-2",
    type: "titre",
    niveau: 2,
    texte: "De la perte d'un exemple au coût d'un jeu",
  },
  {
    id: "b-d6-3",
    type: "formule",
    ancre: "cout-du-jeu",
    latex:
      "C_{\\mathcal{D}}:\\mathbb{R}^{p}\\rightarrow\\mathbb{R}_{\\geq 0},\\qquad C_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\ell\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)}),\\,c^{(n)}\\big)",
    alt: "Le coût C indicé par D va de l'espace à p dimensions vers les réels positifs ou nuls. Sa valeur en thêta vaut un sur N fois la somme, pour n allant de un à N, de la perte de la sortie du réseau de paramètre thêta sur la n-ième entrée, comparée à la n-ième étiquette.",
    numero: "6.1",
    legende:
      "Une **moyenne**, pas une somme : ainsi $C_{\\mathcal{D}}$ garde la même échelle qu'une perte individuelle, et un jeu deux fois plus grand ne double pas le coût.",
  },
  {
    id: "b-d6-4",
    type: "texte",
    texte:
      "La distinction entre $\\ell$ et $C_{\\mathcal{D}}$ n'est pas une nuance de notation : **ils ne prennent pas les mêmes arguments et ne vivent pas dans les mêmes espaces**. Les confondre rend tout ce qui suit incompréhensible, et c'est l'erreur la plus fréquente du chapitre.",
  },
  {
    id: "b-d6-5",
    type: "tableau",
    ancre: "ell-contre-C",
    titre: "Les deux fonctions, côte à côte",
    cleEnTete: true,
    entetes: ["", "$\\ell$", "$C_{\\mathcal{D}}$"],
    lignes: [
      [
        "Départ",
        "$\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]$",
        "$\\mathbb{R}^{p}$, avec $p=101\\,770$",
      ],
      ["Arrivée", "$\\mathbb{R}_{\\geq 0}$", "$\\mathbb{R}_{\\geq 0}$"],
      [
        "Ce qui varie",
        "Une sortie et une étiquette",
        "Les **paramètres** du réseau",
      ],
      [
        "Ce qui est fixé",
        "Rien : les deux arguments varient",
        "Le jeu $\\mathcal{D}$, et l'architecture",
      ],
      [
        "Ce qu'on en fait",
        "On l'évalue, une fois par exemple",
        "On la **minimise**",
      ],
      ["Combien d'arguments réels", "$K+1$, soit $11$", "$101\\,770$"],
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 6.2 · θ vu comme un vecteur
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d6-7",
    type: "titre",
    niveau: 2,
    texte: "Les $101\\,770$ nombres, rangés en un seul vecteur",
  },
  {
    id: "b-d6-8",
    type: "texte",
    texte:
      "$\\boldsymbol{\\theta}$ est un quadruplet d'objets de types différents, deux matrices et deux vecteurs, et pour écrire $C_{\\mathcal{D}}:\\mathbb{R}^{p}\\rightarrow\\mathbb{R}_{\\geq 0}$ il faut les voir comme **un** vecteur colonne. C'est l'identification du chapitre 2, appliquée bloc par bloc : $\\mathrm{vec}$ range chaque matrice ligne après ligne, et les quatre blocs se mettent bout à bout dans un ordre fixé une fois pour toutes.",
  },
  {
    id: "b-d6-9",
    type: "formule",
    ancre: "theta-plat",
    latex:
      "\\boldsymbol{\\theta}=\\begin{pmatrix}\\mathrm{vec}\\,W^{[1]}\\\\ \\mathbf{b}^{[1]}\\\\ \\mathrm{vec}\\,W^{[2]}\\\\ \\mathbf{b}^{[2]}\\end{pmatrix}\\in\\mathbb{R}^{p},\\qquad p=\\underbrace{100\\,352}_{128\\times 784}+\\underbrace{128}_{}+\\underbrace{1\\,280}_{10\\times 128}+\\underbrace{10}_{}=101\\,770",
    alt: "Thêta est le vecteur colonne obtenu en empilant l'aplatissement de W un, puis b un, puis l'aplatissement de W deux, puis b deux. Il vit dans l'espace à p dimensions, où p vaut cent mille trois cent cinquante-deux, plus cent vingt-huit, plus mille deux cent quatre-vingts, plus dix, soit cent un mille sept cent soixante-dix.",
    numero: "6.2",
    legende:
      "L'ordre des blocs est une **convention** : il faut en fixer une, et n'importe laquelle convient tant qu'elle ne change pas. Le programme de mesures range les blocs par ordre alphabétique de leur nom, et le fait à un seul endroit.",
  },
  {
    id: "b-d6-10",
    type: "texte",
    texte:
      "$C_{\\mathcal{D}}$ est donc une **couche de complexité au-dessus du réseau**. Le réseau prend $784$ nombres et en rend $10$ ; le coût prend $101\\,770$ nombres et en rend **un seul**. Ce ne sont pas les mêmes entrées, et ce qui est variable pour l'un est fixe pour l'autre.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6.3 · Le statut des données
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d6-11",
    type: "titre",
    niveau: 2,
    texte: "Le jeu n'est pas une variable",
  },
  {
    id: "b-d6-12",
    type: "texte",
    texte:
      "$C_{\\mathcal{D}}$ dépend manifestement de $\\mathcal{D}$, puisque changer le jeu change la fonction. Faut-il pour autant écrire $C(\\boldsymbol{\\theta},\\mathcal{D})$ ? **Non**, et la raison est nette : le jeu est fixé avant l'apprentissage et ne bouge plus. Il n'est pas une variable du problème, c'est un **paramètre de la définition**, ce que l'indice en bas note.",
  },
  {
    id: "b-d6-13",
    type: "texte",
    texte:
      "Le critère est celui-ci : **une variable est ce par rapport à quoi on dérive.** Tout ce chapitre dérive par rapport à $\\boldsymbol{\\theta}$ et jamais par rapport à $\\mathcal{D}$, et l'expression $\\partial C/\\partial\\mathcal{D}$ n'apparaît nulle part et n'aurait pas de sens, $\\mathcal{D}$ n'étant pas un élément d'un espace vectoriel sur lequel on sache dériver. Écrire $C(\\boldsymbol{\\theta},\\mathcal{D})$ serait correct mais suggérerait le contraire.",
  },
  {
    id: "b-d6-15",
    type: "verification",
    numero: 24,
    enonce:
      "Le statut de $\\mathcal{D}$ se tranche par un critère, pas par une préférence de notation.",
    questions: [
      "Le jeu $\\mathcal{D}$ est-il une variable de $C_{\\mathcal{D}}$ ?",
      "Justifier à partir de ce qu'on dérive et de ce qu'on ne dérive jamais.",
      "Si l'on ajoutait une image au jeu, obtiendrait-on la même fonction avec une valeur de plus, ou une autre fonction ? Que devient alors $\\arg\\min$ ?",
    ],
  },
  {
    id: "b-d6-16",
    type: "texte",
    texte:
      "Reste que dire au programme qu'il est mauvais ne suffit pas. $C_{\\mathcal{D}}(\\boldsymbol{\\theta})=2{,}42$ est un constat, pas une instruction : il ne dit **lequel** des $101\\,770$ nombres changer, ni dans quel sens, ni de combien. C'est la page suivante.",
  },
];
