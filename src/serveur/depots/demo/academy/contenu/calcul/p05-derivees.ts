import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 5 · Les trois dérivées constitutives
//
// OUVERTURE, règle 26 : la question sans symbole, puis l5-fig08-derivees en
// 1380 x 900, puis le cadre. La figure était en pied de page ; elle ouvre.
//
// La question porte sur la PERTE, et non sur la sortie : les trois dérivées
// établies ici, dont ∂ℓ/∂a, donnent ∂ℓ/∂w et rien d'autre.
//
// LE COURT-CIRCUIT EST DÉMONTRÉ ICI, en une ligne, parce que ses deux facteurs
// sont tous les deux sur cette page : ∂ℓ/∂a = (a−y)/a(1−a) d'un côté, et
// σ′(z) = a(1−a) du tableau des activations de l'autre. Le chapitre 2 ne porte
// nulle part ∂ℓ/∂z = a − y ; il porte σ′ = σ(1−σ) ≤ 1/4, page 9.
//
// L'activation générale φ est posée ICI, avant tout usage, avec sa convention
// d'application composante par composante et sa convention aux points de non
// dérivabilité.
//
// Les trois dérivées, chacune établie à partir de l'équation dont elle sort.
// L'interprétation de la première est RENVOYÉE au chapitre 4, page 5, et non
// redéveloppée. 🧪 n°52.
//
// L'ÉCART N°1 avec la source (coût quadratique contre entropie croisée) ne
// figure plus dans l'image : il tient en une ligne, dans la légende. Sa forme
// développée, avec les deux expressions, reste en page 6.
//
// Les blocs animation n'ont pas bougé, identifiants compris.
// ─────────────────────────────────────────────────────────────────────────────

export const C05_DERIVEES: Bloc[] = [
  {
    id: "b-cr5-0",
    type: "texte",
    texte:
      "De combien la perte bouge-t-elle quand on pousse un poids d'un cheveu ?",
  },
  {
    id: "b-cr5-0f",
    type: "image",
    ancre: "trois-derivees-sous-leurs-equations",
    src: "/cours/lecon5/l5-fig08-derivees.svg",
    largeur: 1380,
    hauteur: 900,
    alt: "Trois bandes empilées, chacune portant une équation du réseau et, juste dessous, la dérivée qui en sort. En haut, la somme pondérée, z exposant trois égale w exposant trois fois a exposant deux plus b exposant trois, et sous elle la dérivée de z exposant trois par rapport à w exposant trois, qui vaut a exposant deux. Au milieu, l'activation, a exposant trois égale sigma de z exposant trois, et sous elle la dérivée de a exposant trois par rapport à z exposant trois, qui vaut sigma prime de z exposant trois. En bas, la perte ell, égale à moins le logarithme de a exposant trois, et sous elle la dérivée de la perte ell par rapport à a exposant trois, qui vaut a exposant trois moins y divisé par a exposant trois fois un moins a exposant trois.",
    legende:
      "Seul le premier des trois facteurs dépend de la perte, et c'est par elle que ce cours s'écarte de la série de Grant Sanderson, publiée sous le nom 3Blue1Brown, qui emploie le coût quadratique.",
  },
  {
    id: "b-cr5-0c",
    type: "texte",
    texte:
      "Chacun des trois facteurs sort d'une équation différente du réseau, et se calcule sans les deux autres. Le deuxième est la dérivée de l'activation, et il réclame donc une activation écrite en général, avant tout choix de ReLU ou de sigmoïde.",
  },
  {
    id: "b-cr5-1",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'on suppose d'une activation pour pouvoir la dériver",
  },
  {
    id: "b-cr5-2",
    type: "definition",
    terme: "Activation $\\varphi$",
    anglais: "activation function",
    texte:
      "Une fonction $\\varphi:\\mathbb{R}\\rightarrow\\mathbb{R}$, dérivable sauf en un nombre fini de points. Appliquée à un vecteur, elle agit **composante par composante** : $\\varphi(\\mathbf{u})_{i}=\\varphi(u_{i})$, convention du chapitre 2. Sa dérivée est notée $\\varphi'$, prolongée aux points de non-dérivabilité par la convention du chapitre 2 : $\\mathrm{ReLU}'(0)=0$.",
  },
  {
    id: "b-cr5-3",
    type: "tableau",
    ancre: "deux-activations",
    cleEnTete: true,
    entetes: ["$\\varphi$", "$\\varphi(z)$", "$\\varphi'(z)$", "Majorant de $\\varphi'$"],
    lignes: [
      ["$\\mathrm{ReLU}$", "$\\max(0,z)$", "$1$ si $z>0$, $0$ sinon", "$1$"],
      [
        "$\\sigma$",
        "$1/(1+e^{-z})$",
        "$\\sigma(z)\\big(1-\\sigma(z)\\big)$",
        "$1/4$, chapitre 2, page 9",
      ],
    ],
    legende:
      "Une dérivée écrite avec $\\varphi'$ vaut pour ces deux lignes par simple substitution, et la dernière colonne dit de combien $\\varphi'$ peut au plus multiplier.",
  },
  {
    id: "b-cr5-4",
    type: "titre",
    niveau: 2,
    texte:
      "L'activation qui entre est la sensibilité de la somme pondérée à son poids",
  },
  {
    id: "b-cr5-5",
    type: "derivation",
    ancre: "derivee-1",
    titre: "$\\partial z^{[L]}/\\partial w^{[L]}=a^{[L-1]}$",
    hypotheses: [
      "$z^{[L]}=w^{[L]}a^{[L-1]}+b^{[L]}$.",
      "$a^{[L-1]}$ et $b^{[L]}$ sont gelés pendant la dérivation : ils ne dépendent pas de $w^{[L]}$.",
    ],
    etapes: [
      {
        texte:
          "**On dérive une fonction affine de $w^{[L]}$.** Le terme $b^{[L]}$ est constant, et $a^{[L-1]}$ est le coefficient.",
      },
      {
        latex:
          "\\frac{\\partial}{\\partial w^{[L]}}\\big(w^{[L]}a^{[L-1]}+b^{[L]}\\big)=a^{[L-1]}",
        alt: "La dérivée par rapport au poids de la somme du produit du poids par l'activation précédente et du biais vaut l'activation précédente.",
      },
    ],
    resultat: {
      latex: "\\frac{\\partial z^{[L]}}{\\partial w^{[L]}}=a^{[L-1]}",
      alt: "La dérivée partielle de la somme pondérée par rapport au poids vaut l'activation de la couche précédente.",
    },
    interpretation:
      "L'effet d'une variation du poids sur la somme pondérée est d'autant plus fort que le neurone précédent est actif. Cette lecture, et la limite de son rapprochement avec la règle de Hebb, sont établies au chapitre 4, page 5.",
    limites: [
      "$a^{[L-1]}$ dépend de l'exemple : cette dérivée n'est pas une constante du réseau.",
    ],
  },
  {
    id: "b-cr5-6",
    type: "titre",
    niveau: 2,
    texte:
      "La pente de l'activation, prise au point que la somme pondérée atteint",
  },
  {
    id: "b-cr5-7",
    type: "formule",
    ancre: "derivee-2",
    latex:
      "a^{[L]}=\\varphi(z^{[L]})\\quad\\Longrightarrow\\quad\\frac{\\partial a^{[L]}}{\\partial z^{[L]}}=\\varphi'(z^{[L]})",
    alt: "Si l'activation de la dernière couche est phi appliquée à la somme pondérée, alors la dérivée de l'activation par rapport à la somme pondérée est phi prime évaluée en cette somme pondérée.",
    numero: "5.5",
    legende:
      "C'est la définition de $\\varphi'$, évaluée au point $z^{[L]}$ et non ailleurs.",
  },
  {
    id: "b-cr5-9",
    type: "titre",
    niveau: 2,
    texte: "L'écart entre la sortie et la cible gouverne la dérivée de la perte",
  },
  {
    id: "b-cr5-10",
    type: "derivation",
    ancre: "derivee-3",
    titre:
      "$\\partial\\ell/\\partial a^{[L]}$ croît avec l'écart entre la sortie et la cible",
    hypotheses: [
      "$\\ell=-\\big[y\\ln a^{[L]}+(1-y)\\ln(1-a^{[L]})\\big]$, entropie croisée binaire.",
      "$a^{[L]}\\in\\,]0,1[$.",
    ],
    etapes: [
      {
        texte:
          "**On dérive terme à terme.** $\\ln$ a pour dérivée l'inverse, et le second terme porte un signe.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial a^{[L]}}=-\\frac{y}{a^{[L]}}+\\frac{1-y}{1-a^{[L]}}",
        alt: "La dérivée de la perte par rapport à l'activation vaut moins y sur a plus un moins y sur un moins a.",
      },
      {
        texte: "**On réduit au même dénominateur.**",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial a^{[L]}}=\\frac{a^{[L]}-y}{a^{[L]}\\big(1-a^{[L]}\\big)}",
        alt: "La dérivée de la perte par rapport à l'activation vaut a moins y divisé par a fois un moins a.",
        justification: "Mise au même dénominateur, puis simplification.",
      },
    ],
    resultat: {
      latex:
        "\\frac{\\partial\\ell}{\\partial a^{[L]}}=\\frac{a^{[L]}-y}{a^{[L]}\\big(1-a^{[L]}\\big)}",
      alt: "La dérivée de la perte par rapport à l'activation de sortie est l'écart entre l'activation et la cible, divisé par le produit de l'activation et de son complément à un.",
    },
    interpretation:
      "Le numérateur est exactement l'écart $a^{[L]}-y$ entre la sortie et la cible : la dérivée est nulle quand la sortie atteint la cible, et d'autant plus grande en valeur absolue que la sortie en est loin.",
    limites: [
      "Le dénominateur $a^{[L]}(1-a^{[L]})$ tend vers $0$ aux deux bords : cette expression seule n'est pas exploitable numériquement quand la sortie sature.",
    ],
  },
  {
    id: "b-cr5-12",
    type: "titre",
    niveau: 2,
    texte:
      "Les trois dérivées en nombres, et le court-circuit qui efface le dénominateur",
  },
  {
    id: "b-cr5-12b",
    type: "formule",
    ancre: "court-circuit-des-deux-facteurs",
    latex:
      "\\frac{\\partial\\ell}{\\partial a^{[L]}}\\cdot\\frac{\\partial a^{[L]}}{\\partial z^{[L]}}=\\frac{a^{[L]}-y}{a^{[L]}\\big(1-a^{[L]}\\big)}\\cdot a^{[L]}\\big(1-a^{[L]}\\big)=a^{[L]}-y",
    alt: "Le produit de la dérivée de la perte par rapport à l'activation par la dérivée de l'activation par rapport à la somme pondérée vaut a moins y divisé par a fois un moins a, multiplié par a fois un moins a, c'est-à-dire a moins y.",
    legende:
      "Le dénominateur de la troisième dérivée est exactement la deuxième, puisque $a^{[L]}=\\sigma(z^{[L]})$ donne $\\sigma'(z^{[L]})=a^{[L]}\\big(1-a^{[L]}\\big)$, démontré au chapitre 2, page 9. Court-circuiter, c'est lire $\\partial\\ell/\\partial z^{[L]}=a^{[L]}-y$ d'un coup au lieu de calculer les deux facteurs puis de les multiplier.",
  },
  {
    id: "b-cr5-13",
    type: "sortie",
    ancre: "mesure-1-trois-derivees",
    titre: "Mesure 1 · les trois dérivées constitutives, dernière couche",
    texte: `  -- les trois dérivées constitutives, dernière couche ---------------------
  dz3/dw3 = a2                = 1.100000
  da3/dz3 = a3 (1 - a3)       = 0.130606
  dl/da3  = (a3 - y)/a3(1-a3) = -1.182684
  produit des trois           = -0.169912
  court-circuit : dl/dz3      = -0.154465`,
    lecture: [
      "La première vaut $a^{[2]}=1{,}100000$, l'activation de la couche précédente.",
      "La deuxième vaut $\\sigma'(1{,}7)=0{,}845535\\times 0{,}154465=0{,}130606$.",
      "La troisième vaut $-0{,}154465/0{,}130606=-1{,}182684$ : son numérateur est l'écart à la cible.",
      "Le produit des trois vaut $-0{,}169912$, et c'est $\\partial\\ell/\\partial w^{[3]}$.",
      "La dernière ligne est le produit des deux dernières seules : $-1{,}182684\\times 0{,}130606=-0{,}154465$, où le dénominateur de l'une a effacé le facteur de l'autre.",
    ],
  },
  {
    id: "b-cr5-13b",
    type: "encart",
    ton: "attention",
    titre: "Le même nombre pour deux quantités différentes",
    texte:
      "$1-a^{[3]}=0{,}154465$ dans la deuxième dérivée, et $a^{[3]}-y=-0{,}154465$ dans la troisième : les deux valeurs ne coïncident que parce que la cible vaut $1$, qui fait de $a^{[3]}-y$ l'opposé de $1-a^{[3]}$. Avec $y=0$ elles n'auraient plus rien de commun.",
  },
  {
    id: "b-cr5-15",
    type: "verification",
    numero: 52,
    enonce:
      "La première dérivée constitutive sort de l'équation $z^{[3]}=w^{[3]}a^{[2]}+b^{[3]}$.",
    questions: [
      "Établir $\\partial z^{[3]}/\\partial w^{[3]}$ à partir de cette équation.",
      "Dire quelles quantités sont gelées pendant la dérivation, et pourquoi ce gel est licite.",
    ],
  },
];
