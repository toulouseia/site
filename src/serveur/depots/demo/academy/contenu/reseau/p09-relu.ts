import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 9 · Casser la ligne droite
//
// La page la plus dense du chapitre. Elle porte le cahier des charges d'une
// activation, ReLU, la PROPOSITION 4, la sigmoïde avec sa dérivée et son
// majorant, l'écart n°5 avec la source, et la dérivation du biais depuis le
// besoin de seuil.
//
// LA PROPOSITION 5 est démontrée à la page 6, où softmax est introduit. Cette
// page-ci n'en reprend que la conséquence dont elle a besoin : la convention
// « composante par composante », et le fait que softmax n'y obéit pas.
//
// Les 35 composantes non nulles et les préactivations extrêmes sortent de
// cours/lecon2/mesures.py, section 7.
// ─────────────────────────────────────────────────────────────────────────────

export const P09_RELU: Bloc[] = [
  {
    id: "b-r9-1",
    type: "texte",
    texte:
      "Empiler deux couches n'a rien changé, puisque mises bout à bout elles refont exactement ce qu'une seule faisait déjà, et il manque donc une pièce entre les deux. Cette pièce ne doit rien coûter en paramètres, sans quoi on ne saurait pas à quoi attribuer le gain. Que faut-il glisser là, de plus simple possible, pour que l'empilement se mette enfin à compter ?",
  },
  {
    id: "b-r9-22f",
    type: "image",
    ancre: "courbe-sigmoide",
    src: "/cours/lecon2/l2-fig08-sigmoide.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Un repère où u va de moins huit à plus huit et où l'ordonnée va de zéro à un. La courbe de sigma monte de gauche à droite en forme de S : elle colle à la ligne zéro à gauche, traverse la hauteur zéro virgule cinq en u égal zéro, et colle à la ligne un à droite. Les deux lignes zéro et un sont tracées en pointillé et ne sont jamais touchées. Une droite de brique en tirets touche la courbe en son centre, de pente un quart, et trois points de brique marquent la courbe en u égal moins un, zéro et un. À droite, une table donne les cinq valeurs mesurées : sigma de moins dix vaut quatre virgule cinq trois neuf huit fois dix puissance moins cinq, sigma de moins un vaut zéro virgule deux six huit neuf quatre un quatre deux un trois sept, sigma de zéro vaut zéro virgule cinq, sigma de un vaut zéro virgule sept trois un zéro cinq huit cinq sept huit six trois, et sigma de dix vaut zéro virgule neuf neuf neuf neuf cinq quatre six zéro deux un trois. Sous la table, la dérivée de sigma en u vaut sigma de u fois un moins sigma de u, et ne dépasse jamais un quart, avec égalité en zéro.",
    legende:
      "$\\sigma$ ne touche jamais ses deux bornes : elle s'en approche.",
  },
  {
    id: "b-r9-2",
    type: "texte",
    texte:
      "La substitution de la page 8 tenait à un point précis : le vecteur $\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}$ entrait **linéairement** dans la couche suivante, ce qui permettait au produit $W^{[2]}W^{[1]}$ de remplacer les deux matrices. Il suffit qu'une fonction non affine s'interpose pour que ce produit ne se forme plus.\n\nUne **fonction d'activation** est cette fonction-là : une fonction d'une seule variable réelle, appliquée séparément à chacune des coordonnées d'une préactivation, et posée entre deux étapes de calcul. Le $\\mathrm{softmax}$ de la page 6 n'en est pas une, puisqu'il mêle les dix coordonnées ; il se pose tout au bout, et non entre deux étapes.\n\nOn note $\\mathbf{a}^{[1]}$ ce que la première couche rend une fois l'activation appliquée, et $d_{1}=128$ le nombre de ses neurones.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.1 · Le cahier des charges
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-3",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'on demande à une activation",
  },
  {
    id: "b-r9-4",
    type: "liste",
    ancre: "cahier-activation",
    ordonnee: true,
    elements: [
      "**Définie sur $\\mathbb{R}$ tout entier.** Aucun intervalle ne contient toutes les préactivations que la famille peut produire : sur une image donnée, $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b$ prend n'importe quelle valeur réelle selon les poids et le biais qu'on y met.",
      "**Non affine.** Si $\\varphi(u)=\\alpha u+\\beta$, la démonstration de la page 8 se refait mot pour mot et la famille ne grandit pas.",
      "**Dérivable sauf en un nombre fini de points.** Le chapitre 3 se servira de sa dérivée, et il lui suffit qu'elle existe partout sauf en quelques points isolés.",
      "**Calculable.** Elle est évaluée une fois par neurone caché et par image, soit $128\\times 60\\,000$ fois par époque ici, et son coût entre donc dans le temps d'entraînement.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.2 · ReLU
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-5",
    type: "titre",
    niveau: 2,
    texte: "ReLU",
  },
  {
    id: "b-r9-6",
    type: "definition",
    terme: "Unité de rectification linéaire",
    anglais: "rectified linear unit, ReLU",
    texte:
      "La fonction $\\mathrm{ReLU}:\\mathbb{R}\\rightarrow\\mathbb{R}_{\\geq 0}$, $u\\mapsto\\max(u,0)$. Elle laisse passer les valeurs positives inchangées et renvoie zéro pour les négatives.",
  },
  {
    id: "b-r9-7",
    type: "formule",
    ancre: "relu",
    latex:
      "\\mathrm{ReLU}:\\mathbb{R}\\rightarrow\\mathbb{R}_{\\geq 0},\\qquad \\mathrm{ReLU}(u)=\\max(u,0)=\\begin{cases}u & \\text{si } u>0\\\\ 0 & \\text{si } u\\leq 0\\end{cases}",
    alt: "ReLU va de l'ensemble des réels vers l'ensemble des réels positifs ou nuls. ReLU de u vaut le maximum de u et de zéro, c'est-à-dire u si u est strictement positif, et zéro si u est négatif ou nul.",
    numero: "9.1",
  },
  {
    id: "b-r9-8",
    type: "formule",
    latex:
      "\\mathrm{ReLU}'(u)=\\mathbb{1}\\{u>0\\}\\quad\\text{pour } u\\neq 0",
    alt: "La dérivée de ReLU en u vaut l'indicatrice de la condition u strictement positif, pour tout u différent de zéro.",
    legende:
      "En $u=0$ la fonction n'est **pas** dérivable : la pente à gauche vaut $0$, celle à droite vaut $1$. On pose par convention $\\mathrm{ReLU}'(0)=0$. Le choix est libre et sans conséquence mesurable, parce qu'une préactivation exactement nulle ne s'obtient pas en virgule flottante.",
  },
  {
    id: "b-r9-8-coupe",
    type: "animation",
    ancre: "relu-coupe",
    animationId: "relu-coupe",
    legende:
      "Sur cette image, $93$ des $128$ neurones cachés renvoient exactement zéro, si bien que $35$ colonnes seulement de $W^{[2]}$ servent encore à quelque chose. Une autre image en laisserait d'autres.",
  },
  {
    id: "b-r9-9",
    type: "tableau",
    ancre: "relu-conditions",
    titre: "Les quatre conditions, vérifiées pour ReLU",
    cleEnTete: true,
    entetes: ["Condition", "Vérification"],
    lignes: [
      [
        "Définie sur $\\mathbb{R}$",
        "$\\max(u,0)$ existe pour tout réel $u$. Ensemble d'arrivée $\\mathbb{R}_{\\geq 0}$.",
      ],
      [
        "Non affine",
        "$\\mathrm{ReLU}(-1)=0$, $\\mathrm{ReLU}(0)=0$, $\\mathrm{ReLU}(1)=1$. Une fonction affine passant par $(-1,0)$ et $(0,0)$ est nulle, et vaudrait $0$ en $1$.",
      ],
      [
        "Dérivable sauf en un nombre fini de points",
        "Dérivable sur $\\mathbb{R}^{*}$, non dérivable au seul point $u=0$.",
      ],
      [
        "Calculable",
        "Une comparaison et une sélection, sans exponentielle ni division.",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.3 · Composante par composante
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-10",
    type: "titre",
    niveau: 3,
    texte: "Comment une fonction d'une variable s'applique à un vecteur",
  },
  {
    id: "b-r9-11",
    type: "formule",
    ancre: "composante-par-composante",
    latex:
      "\\varphi:\\mathbb{R}\\rightarrow\\mathbb{R},\\ \\mathbf{u}\\in\\mathbb{R}^{m}\\ \\Longrightarrow\\ \\varphi(\\mathbf{u})=\\big(\\varphi(u_{1}),\\ \\ldots,\\ \\varphi(u_{m})\\big)^{\\mathsf{T}}\\in\\mathbb{R}^{m}",
    alt: "Pour une fonction phi allant des réels vers les réels et un vecteur u de l'espace à m dimensions, phi de u désigne le vecteur colonne dont les coordonnées sont phi de u un, jusqu'à phi de u m, et il vit dans le même espace à m dimensions.",
    numero: "9.2",
    legende:
      "Convention posée ici, à sa première occurrence. La coordonnée $k$ du résultat ne dépend que de la coordonnée $k$ de l'antécédent.",
  },
  {
    id: "b-r9-12",
    type: "texte",
    texte:
      "$\\mathrm{softmax}$ **n'obéit pas** à cette convention, et cela se lit sur son écriture : sa coordonnée $k$ vaut $e^{z_{k}}/\\sum_{j}e^{z_{j}}$, et le dénominateur porte **toutes** les coordonnées de $\\mathbf{z}$. Modifier $z_{3}$ seul change donc les dix coordonnées de $\\mathrm{softmax}(\\mathbf{z})$. C'est le point (i) de la proposition 5, démontré à la page 6.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.4 · Proposition 4
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-13",
    type: "titre",
    niveau: 2,
    texte: "Ce que ReLU achète",
  },
  {
    id: "b-r9-14",
    type: "derivation",
    ancre: "proposition-4",
    titre:
      "Avec ReLU, le réseau est affine par morceaux, et le nombre de morceaux est majoré (proposition 4)",
    hypotheses: [
      "Le réseau est $\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}$, $\\mathbf{a}^{[1]}=\\mathrm{ReLU}(\\mathbf{z}^{[1]})$, $\\mathbf{z}^{[2]}=W^{[2]}\\mathbf{a}^{[1]}+\\mathbf{b}^{[2]}$.",
      "$W^{[1]}\\in\\mathcal{M}_{128,784}(\\mathbb{R})$, $W^{[2]}\\in\\mathcal{M}_{10,128}(\\mathbb{R})$.",
      "$\\mathrm{ReLU}$ est appliquée composante par composante, au sens de $(9.2)$.",
    ],
    chaine:
      "\\mathbf{x} \\rightarrow \\mathbf{z}^{[1]} \\rightarrow \\text{signe de chaque } z^{[1]}_{j} \\rightarrow \\text{une matrice diagonale} \\rightarrow \\mathbf{z}^{[2]} \\text{ affine}",
    proprietes: [
      "Un demi-espace $\\{\\mathbf{x}:\\boldsymbol{\\alpha}^{\\mathsf{T}}\\mathbf{x}+\\beta>0\\}$ est convexe",
      "Une intersection quelconque de parties convexes est convexe",
      "Une partie de $[\\![1,128]\\!]$ se choisit de $2^{128}$ façons",
    ],
    etapes: [
      {
        texte:
          "Pour une partie $S\\subseteq[\\![1,128]\\!]$, on note $R_{S}$ l'ensemble des entrées pour lesquelles ce sont exactement les neurones de $S$ qui sont allumés. Malgré la lettre commune, ces régions n'ont rien à voir avec les $R_{k}$ de la page 7 : celles-ci découpaient l'entrée par la classe prédite, celles-là la découpent par les neurones cachés qui s'allument.",
      },
      {
        latex:
          "R_{S}=\\big\\{\\mathbf{x}\\in\\mathbb{R}^{784}\\ :\\ z^{[1]}_{j}(\\mathbf{x})>0 \\text{ pour } j\\in S,\\ \\text{ et } z^{[1]}_{j}(\\mathbf{x})\\leq 0 \\text{ sinon}\\big\\}",
        alt: "R indice S est l'ensemble des x de l'espace à sept cent quatre-vingt-quatre dimensions tels que la j-ième préactivation de la première couche est strictement positive pour tout j dans S, et négative ou nulle pour tout autre j.",
        justification:
          "Chaque $z^{[1]}_{j}$ est une forme affine de $\\mathbf{x}$ : chaque condition est un demi-espace.",
      },
      {
        texte:
          "$R_{S}$ est donc une intersection de $128$ demi-espaces : c'est un **polyèdre convexe**. Les $2^{128}$ parties $S$ possibles donnent des $R_{S}$ deux à deux disjoints dont la réunion est $\\mathbb{R}^{784}$ tout entier : les $R_{S}$ non vides forment une partition.",
        justification:
          "Chaque $\\mathbf{x}$ détermine sans ambiguïté l'ensemble des $j$ tels que $z^{[1]}_{j}(\\mathbf{x})>0$.",
      },
      {
        texte:
          "Sur $R_{S}$, l'action de $\\mathrm{ReLU}$ se réduit à une multiplication par une matrice **constante** : $\\mathrm{ReLU}(\\mathbf{z}^{[1]})=D_{S}\\,\\mathbf{z}^{[1]}$, où $D_{S}\\in\\mathcal{M}_{128}(\\mathbb{R})$ est diagonale, de coefficient $(D_{S})_{jj}=1$ si $j\\in S$ et $0$ sinon.",
      },
      {
        latex:
          "\\forall\\,\\mathbf{x}\\in R_{S},\\quad \\mathbf{z}^{[2]}(\\mathbf{x})=W^{[2]}D_{S}\\big(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}=\\underbrace{\\big(W^{[2]}D_{S}W^{[1]}\\big)}_{\\in\\,\\mathcal{M}_{10,784}(\\mathbb{R})}\\mathbf{x}+\\underbrace{\\big(W^{[2]}D_{S}\\mathbf{b}^{[1]}+\\mathbf{b}^{[2]}\\big)}_{\\in\\,\\mathbb{R}^{10}}",
        alt: "Pour tout x dans R indice S, la préactivation de sortie vaut W deux fois D indice S appliqué à W un x plus b un, plus b deux. En développant, c'est le produit de la matrice W deux D S W un, qui appartient à l'ensemble des matrices dix par sept cent quatre-vingt-quatre, par x, plus le vecteur W deux D S b un plus b deux, qui appartient à l'espace à dix dimensions.",
        justification:
          "Vérification des dimensions : $(10\\times 128)(128\\times 128)(128\\times 784)=10\\times 784$.",
      },
      {
        texte:
          "L'expression est **affine en $\\mathbf{x}$ sur chaque $R_{S}$**, et ses coefficients dépendent de $S$ : deux régions voisines n'ont pas la même matrice. Le réseau est affine par morceaux.",
      },
    ],
    resultat: {
      latex:
        "\\#\\{\\text{morceaux}\\}\\ \\leq\\ \\#\\,\\mathcal{P}\\big([\\![1,128]\\!]\\big)=2^{128}\\approx 3{,}4\\cdot 10^{38}",
      alt: "Le nombre de morceaux est majoré par le nombre de parties de l'ensemble des entiers de un à cent vingt-huit, c'est-à-dire deux puissance cent vingt-huit, soit environ trois virgule quatre fois dix puissance trente-huit.",
    },
    interpretation:
      "Le majorant est immédiat : chaque morceau est repéré par la partie $S$ des neurones allumés, et il y a $2^{128}$ parties possibles. C'est de là que vient la puissance d'expression du réseau, et **non** du nombre de paramètres, puisque la proposition 3 vient de montrer que $101\\,770$ paramètres sans rien entre les deux couches n'en achètent aucune.\n\nCe sont les mêmes $101\\,770$ nombres, avec une fonction qui n'en coûte pas un seul, et la famille atteignable cesse d'être affine pour devenir affine par morceaux.",
    limites: [
      "C'est un **majorant**, pas un compte. Le nombre de régions effectivement non vides est bien plus petit, et il dépend de $W^{[1]}$.",
      "La proposition 2 ne s'applique plus : les régions de décision du réseau à ReLU ne sont plus convexes. La mesure de la page 7 le vérifie sur les deux modèles.",
      "Il ne dit pas non plus que $\\mathrm{ReLU}$ soit gratuite : la perte n'est plus une fonction convexe de $\\boldsymbol{\\theta}$, et le rappel en fin de page dit à qui cette perte-là est imputable.",
    ],
  },
  {
    id: "b-r9-16",
    type: "sortie",
    ancre: "relu-image-zero",
    titre:
      "Combien de neurones s'allument sur une image · modèle 3, image de test n°0",
    texte:
      "      composantes de a^[1] non nulles         35 sur 128\n      composantes nulles                      93\n      part moyenne sur les 10 000 images      35,07 %\n      neurones éteints sur TOUTES les images  0 sur 128",
    lecture: [
      "Sur cette image, 93 des 128 neurones cachés renvoient exactement zéro, leur préactivation étant négative et $\\mathrm{ReLU}$ les coupant, si bien qu'ils ne contribuent en rien au calcul de $\\mathbf{z}^{[2]}$. Les 35 qui restent font $27\\,\\%$ des 128, ce qui place cette image au-dessous de la ligne suivante, où $35{,}07\\,\\%$ est la part moyenne d'allumés sur les 10 000 images. Les deux nombres commencent par les mêmes chiffres sans mesurer la même chose.",
      "La partie $S$ de la proposition 4 est donc, pour cette image précise, un ensemble de 35 indices. Une autre image donne une autre partie, et donc une autre matrice affine.",
      "Aucun neurone n'est éteint sur les 10 000 images à la fois : la couche n'a pas de neurone mort, et ses 128 lignes servent toutes à quelque chose.",
    ],
  },
  {
    id: "b-r9-17",
    type: "verification",
    numero: 17,
    enonce:
      "Un neurone caché a une préactivation strictement négative sur une image donnée.",
    questions: [
      "Que vaut la dérivée de $\\mathrm{ReLU}$ en ce point ?",
      "Qu'en déduit-on sur la contribution de ce neurone à $\\mathbf{z}^{[2]}$ pour cette image ?",
      "Ce neurone est-il pour autant inutile ? Justifier avec les deux dernières lignes de la mesure ci-dessus.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.5 · L'écart n°5 : les ensembles ne sont plus les mêmes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-18",
    type: "encart",
    ton: "attention",
    titre: "Un neurone ne porte plus un nombre de $[0,1]$",
    texte:
      "Quatre notations servent ici et à la page 10, qui les construit : $L$ est le nombre d'étapes de calcul, $d_{l}$ le nombre de neurones de l'étape $l$, $\\mathbf{z}^{[l]}$ ses préactivations et $\\mathbf{a}^{[l]}$ ce qu'elle rend une fois l'activation appliquée. Pour le réseau de cette page, $L=2$, $d_{1}=128$ et $d_{2}=10$.\n\nL'exposé dont ce chapitre suit l'ordre décrit un neurone comme portant un nombre entre $0$ et $1$, **partout** dans le réseau, et avec $\\mathrm{ReLU}$ ce n'est plus vrai, puisque $\\mathbf{a}^{[l]}$ vit dans $\\mathbb{R}_{\\geq 0}^{d_{l}}$ pour $l<L$, un ensemble **non borné**. Sur le modèle mesuré par `cours/lecon2/mesures.py`, section 7, la plus grande activation cachée observée sur les $10\\,000$ images vaut $12{,}1261$ et la moyenne des activations non nulles vaut $1{,}6438$, donc les deux dépassent $1$.\n\nSeule la couche de sortie reste dans un ensemble borné, $\\mathbf{a}^{[L]}\\in\\Delta^{\\circ}_{K-1}\\subset[0,1]^{K}$, et elle le reste parce que c'est $\\mathrm{softmax}$ qui la produit, non l'activation cachée.",
  },
  {
    id: "b-r9-19",
    type: "tableau",
    ancre: "ensembles-exacts",
    titre: "Les ensembles exacts, couche par couche",
    cleEnTete: true,
    entetes: ["Objet", "Ensemble", "Borné ?"],
    lignes: [
      ["$\\mathbf{a}^{[0]}=\\mathbf{x}$", "$[0,1]^{784}$", "oui, par la normalisation"],
      ["$\\mathbf{z}^{[l]}$, $1\\leq l\\leq L$", "$\\mathbb{R}^{d_{l}}$", "non"],
      ["$\\mathbf{a}^{[l]}$ avec ReLU, $l<L$", "$\\mathbb{R}_{\\geq 0}^{d_{l}}$", "non"],
      ["$\\mathbf{a}^{[l]}$ avec $\\sigma$, $l<L$", "$(0,1)^{d_{l}}$", "oui"],
      ["$\\mathbf{a}^{[L]}$", "$\\Delta^{\\circ}_{K-1}$", "oui, et de somme $1$"],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.6 · La sigmoïde
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-20",
    type: "titre",
    niveau: 2,
    texte: "La sigmoïde",
  },
  {
    id: "b-r9-21",
    type: "texte",
    texte:
      "L'autre choix courant écrase $\\mathbb{R}$ dans l'intervalle ouvert $(0,1)$. On lui demande les quatre conditions déjà posées, plus une cinquième propre à cet usage : que son ensemble d'arrivée soit $(0,1)$, de sorte que ce qu'un neurone rend se lise comme un degré d'activation compris entre rien du tout et tout à fait.",
  },
  {
    id: "b-r9-22",
    type: "formule",
    ancre: "sigmoide",
    latex:
      "\\sigma:\\mathbb{R}\\rightarrow(0,1),\\qquad \\sigma(u)=\\frac{1}{1+e^{-u}}",
    alt: "Sigma va de l'ensemble des réels vers l'intervalle ouvert de zéro à un. Sigma de u vaut un divisé par un plus l'exponentielle de moins u.",
    numero: "9.3",
  },
  {
    id: "b-r9-23",
    type: "tableau",
    ancre: "sigma-conditions",
    titre: "Les conditions, vérifiées pour la sigmoïde",
    cleEnTete: true,
    entetes: ["Condition", "Vérification"],
    lignes: [
      [
        "Définie sur $\\mathbb{R}$",
        "$e^{-u}>0$ pour tout $u$, donc $1+e^{-u}>1>0$ : le quotient existe partout.",
      ],
      [
        "À valeurs dans $(0,1)$",
        "$1+e^{-u}>1$ donne $\\sigma(u)<1$ ; $1+e^{-u}<+\\infty$ donne $\\sigma(u)>0$. Les deux bornes sont **exclues** : $\\sigma$ ne vaut jamais ni $0$ ni $1$.",
      ],
      [
        "Non affine",
        "$\\sigma$ est bornée et non constante ; une fonction affine non constante ne l'est pas.",
      ],
      [
        "Dérivable",
        "Composée de fonctions dérivables à dénominateur ne s'annulant pas : dérivable sur $\\mathbb{R}$ tout entier, sans exception.",
      ],
      [
        "Calculable",
        "Une exponentielle et une division. Plus cher que $\\mathrm{ReLU}$, et c'est mesurable sur le temps d'entraînement.",
      ],
    ],
  },
  {
    id: "b-r9-24",
    type: "derivation",
    ancre: "derivee-sigmoide",
    titre: "La dérivée de la sigmoïde, et son majorant",
    hypotheses: ["$\\sigma$ est définie par $(9.3)$, et $u\\in\\mathbb{R}$."],
    depart: {
      latex: "\\sigma(u)=\\big(1+e^{-u}\\big)^{-1}",
      alt: "Sigma de u vaut un plus exponentielle de moins u, le tout à la puissance moins un.",
    },
    proprietes: [
      "Dérivée d'une puissance composée : $(v^{-1})'=-v'v^{-2}$",
      "$(e^{-u})'=-e^{-u}$",
    ],
    etapes: [
      {
        latex:
          "\\sigma'(u)=-\\big(-e^{-u}\\big)\\big(1+e^{-u}\\big)^{-2}=\\frac{e^{-u}}{\\big(1+e^{-u}\\big)^{2}}",
        alt: "La dérivée de sigma en u vaut l'opposé de moins exponentielle de moins u, multiplié par un plus exponentielle de moins u à la puissance moins deux, c'est-à-dire exponentielle de moins u divisée par le carré de un plus exponentielle de moins u.",
        justification: "Dérivation de la composée.",
      },
      {
        latex:
          "\\frac{e^{-u}}{\\big(1+e^{-u}\\big)^{2}}=\\frac{1}{1+e^{-u}}\\cdot\\frac{e^{-u}}{1+e^{-u}}=\\frac{1}{1+e^{-u}}\\cdot\\left(1-\\frac{1}{1+e^{-u}}\\right)",
        alt: "Ce quotient se sépare en le produit de un sur un plus exponentielle de moins u, par exponentielle de moins u sur un plus exponentielle de moins u. Le second facteur s'écrit un moins un sur un plus exponentielle de moins u.",
        justification:
          "Le numérateur $e^{-u}$ s'écrit $(1+e^{-u})-1$, ce qui fait apparaître $\\sigma(u)$ dans les deux facteurs.",
      },
      {
        latex: "\\sigma'(u)=\\sigma(u)\\big(1-\\sigma(u)\\big)",
        alt: "La dérivée de sigma en u vaut sigma de u multiplié par un moins sigma de u.",
      },
      {
        texte:
          "Posons $t=\\sigma(u)\\in(0,1)$. Le majorant de $\\sigma'$ est celui de $t\\mapsto t(1-t)$ sur $(0,1)$ : ce trinôme atteint son maximum en $t=1/2$, où il vaut $1/4$.",
        justification:
          "$t(1-t)=1/4-(t-1/2)^{2}$, écriture canonique qui donne directement le maximum et le point où il est atteint.",
      },
    ],
    resultat: {
      latex:
        "\\sigma'(u)=\\sigma(u)\\big(1-\\sigma(u)\\big)\\ \\leq\\ \\tfrac{1}{4},\\qquad \\text{avec égalité en } u=0",
      alt: "La dérivée de sigma en u vaut sigma de u fois un moins sigma de u, et cette quantité est toujours inférieure ou égale à un quart, avec égalité en u égal zéro.",
    },
    interpretation:
      "La dérivée s'exprime à partir de la **valeur** de $\\sigma$, pas de son argument : une fois $\\sigma(u)$ calculé, sa dérivée ne coûte rien de plus. Et elle ne dépasse jamais $1/4$ : ce majorant d'un quart pèsera sur l'entraînement des réseaux profonds.",
    limites: [
      "Ce majorant est la source d'une difficulté d'entraînement que ce chapitre ne traite pas. **Dette, chapitre 3.**",
      "La **forme** de $\\sigma$ n'est pas dérivée ici : les cinq conditions sont vérifiées, elles ne la déterminent pas. **Dette, Fondements probabilistes.**",
    ],
  },
  {
    id: "b-r9-26",
    type: "verification",
    numero: 15,
    enonce: "La sigmoïde se calcule aussi là où l'exponentielle déborde.",
    questions: [
      "Que vaut $\\sigma(-1000)$ à la précision d'un flottant de 64 bits, et cette valeur est-elle la valeur exacte ?",
      "Pourquoi le calcul direct de $e^{1000}$ déborde-t-il, alors que $\\sigma(1000)$ est parfaitement défini ?",
      "Proposer une écriture de $\\sigma$ qui ne déborde jamais, quel que soit le signe de $u$.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.7 · Le biais
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r9-27",
    type: "titre",
    niveau: 2,
    texte: "Le biais est l'opposé d'un seuil",
  },
  {
    id: "b-r9-28",
    type: "texte",
    texte:
      "La figure qui clôt cette section pose son seuil à $23{,}4$, la valeur du $7$ lui-même : ce point tombe donc exactement sur la barre, et l'inégalité stricte le laisse éteint. Le seuil sépare ce qui est au-dessus, pas ce qui l'atteint.\n\nDans toute cette section, et dans cette figure, $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}$ désigne la somme pondérée **seule**, sans le biais : c'est elle qu'on compare à un seuil, et le biais est précisément ce qu'on va mettre à la place de ce seuil.\n\nLe biais a été posé page 4 comme un paramètre de plus, sans raison donnée. La raison arrive ici, et elle se calcule. On veut qu'un neurone reste **muet** tant que la somme pondérée n'a pas franchi un seuil $s$, et qu'il parle au-delà.",
  },
  {
    id: "b-r9-29",
    type: "derivation",
    ancre: "biais-seuil",
    titre: "Le biais dérivé du besoin de seuil",
    hypotheses: [
      "On dispose de $\\mathbf{w}\\in\\mathbb{R}^{784}$ et d'un seuil $s\\in\\mathbb{R}$.",
      "On veut que le neurone s'active si et seulement si $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}>s$.",
    ],
    depart: {
      latex: "\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}>s",
      alt: "w transposée x est strictement supérieur à s.",
    },
    etapes: [
      {
        latex: "\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}-s>0",
        alt: "w transposée x moins s est strictement positif.",
        justification: "On retranche $s$ aux deux membres.",
      },
      {
        latex: "\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b>0\\quad\\text{en posant}\\quad b=-s",
        alt: "w transposée x plus b est strictement positif, en posant b égal à moins s.",
        justification:
          "La condition retrouve exactement la forme $z>0$ déjà employée, sans qu'aucun objet nouveau soit introduit.",
      },
      {
        texte:
          "Le neurone s'active donc si et seulement si $\\mathrm{ReLU}(z)>0$, c'est-à-dire si $z>0$. Le seuil n'a pas disparu : il a changé de place et de signe.",
      },
    ],
    resultat: {
      latex: "b=-s",
      alt: "Le biais b est égal à l'opposé du seuil s.",
    },
    interpretation:
      "Un biais **négatif** correspond à un seuil positif : le neurone exige de l'encre avant de parler. Un biais **positif** correspond à un seuil négatif : le neurone parle par défaut, et il faut des poids négatifs pour le faire taire. Le biais n'est pas un réglage de confort, c'est le seuil du neurone, écrit du côté où il se calcule.",
  },
  {
    id: "b-r9-29f",
    type: "image",
    ancre: "axe-gradue-deux-fois",
    src: "/cours/lecon2/l2-fig09-biais-seuil.svg",
    largeur: 1380,
    hauteur: 530,
    alt: "Deux axes horizontaux superposés, gradués à la même échelle. Sur celui du haut, coté z égale w transposée x, quatre points portent les scores mesurés du détecteur au premier temps : l'image de test numéro deux à plus cinq virgule zéro zéro trois neuf, l'image de test numéro zéro à plus vingt-trois virgule quatre, l'image de test numéro trois à plus vingt-cinq virgule huit cinq quatre neuf, et la tache large à plus trente-neuf. Une barre verticale de brique, cotée s égale vingt-trois virgule quatre, tombe exactement sur le point de l'image numéro zéro ; les deux points situés à sa droite sont pleins, celui de gauche est grisé. Sur l'axe du bas, coté z plus b avec b égal à moins s, les quatre points occupent exactement les mêmes places, mais leurs valeurs sont devenues moins dix-huit virgule trois neuf six un, zéro, plus deux virgule quatre cinq quatre neuf et plus quinze virgule six ; la barre de brique n'a pas bougé et vaut maintenant zéro. Entre les deux axes, la mention translation de b égale moins vingt-trois virgule quatre. En pied : w transposée x plus grand que s équivaut à w transposée x plus b plus grand que zéro, avec b égal à moins s.",
    legende:
      "Ce n'est pas le neurone qui change, c'est l'origine de son axe.",
  },
  {
    id: "b-r9-31",
    type: "verification",
    numero: 18,
    enonce:
      "Un neurone doit rester muet tant que sa somme pondérée ne dépasse pas $7$.",
    questions: [
      "Quelle valeur donner à son biais ?",
      "Pourquoi ce signe, et non l'autre ? Justifier par le calcul, pas par la mémoire.",
      "Que devient ce neurone si l'on remplace $\\mathrm{ReLU}$ par $\\sigma$ : à partir de quelle valeur de $z$ son activation dépasse-t-elle $1/2$ ?",
    ],
  },
  {
    id: "b-r9-32",
    type: "encart",
    ton: "rappel",
    titre: "Ce que ReLU coûte, et qui le paiera",
    texte:
      "Pour le modèle à une seule couche de la page 6, celui de paramètre $\\boldsymbol{\\theta}=(W,\\mathbf{b})$, la perte moyenne est une fonction **convexe** de $\\boldsymbol{\\theta}$, ce qui garantit qu'aucun minimum local n'est plus haut qu'un autre et fait de sa minimisation un problème résolu.\n\nDès qu'on empile, cette garantie tombe, et $\\mathrm{ReLU}$ n'y est pour rien : deux matrices qui se multiplient suffisent à la faire tomber. Cette page ne le démontre pas, elle le pose comme une dette, et le **chapitre 3** dira comment on minimise sans cette garantie.",
  },
];
