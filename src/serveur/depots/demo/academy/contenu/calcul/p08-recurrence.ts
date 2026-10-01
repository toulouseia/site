import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 8 · La récurrence, sur un neurone par couche
//
// Le transport du signal d'erreur, avec son initialisation et son hérédité
// écrites SÉPARÉMENT. Le corollaire, le produit déroulé, et son contrôle par
// la mesure 1 : la récurrence et le produit donnent −0,463396 tous les deux.
//
// Ouverture, règle 26 : la question, puis l5-fig13-recurrence (1380 × 820),
// puis le cadre. La figure déroule la récurrence en produit, de la dernière
// couche jusqu'à la couche l.
//
// Mesure 2, les six coefficients vérifiés, avec le plancher d'erreur des
// différences finies. 🧪 n°55, n°56 et n°57.
// ─────────────────────────────────────────────────────────────────────────────

export const C08_RECURRENCE: Bloc[] = [
  {
    id: "b-cr8-0",
    type: "texte",
    texte:
      "Ce qu'on vient de faire pour une couche, peut-on le refaire pour toutes ?",
  },
  {
    id: "b-cr8-0f",
    type: "image",
    ancre: "la-recurrence-deroulee",
    src: "/cours/lecon5/l5-fig13-recurrence.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Une colonne de couches, de la dernière tout en haut jusqu'à la couche l tout en bas, chacune reliée à la suivante par un barreau. Sur chaque barreau sont écrits les deux facteurs du pas, le poids de la couche du dessus et phi prime évaluée en la somme pondérée de la couche du dessous. À gauche de la colonne se lit le signal d'erreur de chaque couche, delta exposant grand L en haut, puis delta exposant grand L moins un, jusqu'à delta exposant l en bas. À droite, une seule ligne reprend bout à bout tous les facteurs de la colonne, delta exposant grand L d'abord, puis chaque poids et chaque phi prime du haut jusqu'à la couche l.",
    legende:
      "Descendre d'une couche coûte deux facteurs ; les accumuler de la sortie jusqu'à la couche $l$ donne un produit, et c'est la taille de ce produit qui décide de ce qui parvient encore aux premières couches.",
  },
  {
    id: "b-cr8-0c",
    type: "texte",
    texte:
      "Le calcul de la couche précédente ne tenait à rien de particulier à cette couche, et il va donc se répéter jusqu'au premier rang. Écrire cette répétition comme une récurrence donne une formule unique pour toutes les couches, puis, une fois déroulée, un produit dont la taille dit ce qu'il reste du signal quand le réseau est profond.",
  },
  {
    id: "b-cr8-0t",
    type: "titre",
    niveau: 2,
    texte: "Le signal d'erreur d'une couche",
  },
  {
    id: "b-cr8-1",
    type: "definition",
    terme: "Signal d'erreur d'une couche",
    texte:
      "Sur un réseau à un neurone par couche, $\\delta^{[l]}=\\partial\\ell/\\partial z^{[l]}$, la dérivée de la perte par rapport à la somme pondérée de la couche $l$. C'est le scalaire dont le chapitre 4 a fait un vecteur.",
  },
  {
    id: "b-cr8-2",
    type: "derivation",
    ancre: "transport-du-signal",
    titre: "Le signal d'erreur se transporte d'une couche à la précédente",
    hypotheses: [
      "Réseau à un neurone par couche, équations (5.4) prolongées à $L$ couches.",
      "$\\varphi$ dérivable en $z^{[l]}$ pour tout $l$.",
      "Perte appariée à l'activation de sortie, définie page 6 et établie par le calcul de la page 5.",
      "Le rang $l$ parcourt $[\\![1,L-1]\\!]$, les entiers de $1$ à $L-1$ ; le rang $L$ est celui de l'initialisation.",
    ],
    chaine: "z^{[l]} → a^{[l]} → z^{[l+1]} → ℓ",
    proprietes: [
      "Récurrence descendante sur $l$, de $L$ vers $1$",
      "Règle de la chaîne, forme simple, formule (5.2)",
      "$\\delta^{[L]}=a^{[L]}-y$, page 5",
    ],
    etapes: [
      {
        texte:
          "**Initialisation, au rang $L$.** La page 5 a établi $\\partial\\ell/\\partial z^{[L]}=a^{[L]}-y$ en court-circuitant les deux derniers facteurs, ce que l'appariement de l'entropie croisée et de $\\sigma$ autorise. Le rang $L$ est donc acquis sans rien démontrer de plus.",
        latex: "\\delta^{[L]}=a^{[L]}-y",
        alt: "Delta de la couche L vaut l'activation de sortie moins la cible.",
      },
      {
        texte:
          "**Hérédité, la chaîne.** Soit $l\\leq L-1$, et supposons $\\delta^{[l+1]}$ connu. La quantité $z^{[l]}$ n'influence $\\ell$ qu'à travers $a^{[l]}$, qui n'influence $\\ell$ qu'à travers $z^{[l+1]}$ : la couche $l+1$ n'ayant qu'un neurone, il n'y a **aucun embranchement**.",
      },
      {
        texte:
          "**Hérédité, les deux facteurs.** $z^{[l+1]}=w^{[l+1]}a^{[l]}+b^{[l+1]}$ donne $\\partial z^{[l+1]}/\\partial a^{[l]}=w^{[l+1]}$, et $a^{[l]}=\\varphi(z^{[l]})$ donne $\\partial a^{[l]}/\\partial z^{[l]}=\\varphi'(z^{[l]})$.",
      },
      {
        latex:
          "\\delta^{[l]}=\\frac{\\partial\\ell}{\\partial z^{[l+1]}}\\cdot\\frac{\\partial z^{[l+1]}}{\\partial a^{[l]}}\\cdot\\frac{\\partial a^{[l]}}{\\partial z^{[l]}}=\\delta^{[l+1]}\\,w^{[l+1]}\\,\\varphi'(z^{[l]})",
        alt: "Delta de la couche l est le produit de delta de la couche l plus un, du poids de la couche l plus un, et de phi prime évaluée en z de la couche l.",
        justification:
          "Formule (5.2) sur la chaîne sans embranchement, puis substitution des deux dérivées.",
      },
      {
        texte:
          "**Conclusion.** Le signal du rang $L$ est connu, et celui du rang $l$ se déduit de celui du rang $l+1$ : de proche en proche, $\\delta^{[l]}$ est déterminé pour tout $l$ de $L$ jusqu'à $1$.",
      },
    ],
    resultat: {
      latex:
        "\\delta^{[l]}=\\delta^{[l+1]}\\,w^{[l+1]}\\,\\varphi'(z^{[l]}),\\qquad\\frac{\\partial\\ell}{\\partial w^{[l]}}=\\delta^{[l]}a^{[l-1]},\\qquad\\frac{\\partial\\ell}{\\partial b^{[l]}}=\\delta^{[l]}",
      alt: "Delta de la couche l est le produit de delta de la couche suivante, du poids de la couche suivante et de phi prime en z ; la dérivée par rapport au poids est delta multiplié par l'activation précédente, et la dérivée par rapport au biais est delta.",
    },
    interpretation:
      "Un seul passage de la sortie vers l'entrée suffit : à chaque couche, deux multiplications produisent le signal de la couche inférieure, et deux identités en tirent les deux dérivées de paramètres.",
    limites: [
      "Le raisonnement suppose un neurone par couche : c'est là qu'il n'y a pas d'embranchement.",
      "Aux points où $\\varphi$ n'est pas dérivable, $\\varphi'$ est la valeur donnée par la convention du chapitre 2, et l'égalité y est une convention, pas un théorème.",
    ],
  },
  {
    id: "b-cr8-3",
    type: "animation",
    ancre: "echelle-de-la-recurrence",
    animationId: "la-recurrence-se-deroule",
    legende:
      "Les trois signaux d'erreur descendent les trois couches l'un après l'autre, puis le produit déroulé donne le même nombre, à écart nul.",
  },
  {
    id: "b-cr8-4",
    type: "titre",
    niveau: 2,
    texte: "Le corollaire : la récurrence déroulée",
  },
  {
    id: "b-cr8-5",
    type: "formule",
    ancre: "corollaire-produit-deroule",
    latex:
      "\\frac{\\partial\\ell}{\\partial w^{[1]}}=\\big(a^{[L]}-y\\big)\\cdot\\prod_{l=2}^{L}w^{[l]}\\cdot\\prod_{l=1}^{L-1}\\varphi'(z^{[l]})\\cdot x",
    alt: "La dérivée de la perte par rapport au premier poids est le produit de l'écart entre sortie et cible, du produit des poids des couches deux à L, du produit des dérivées d'activation des couches un à L moins un, et de l'entrée.",
    numero: "5.6",
    legende:
      "Obtenu en déroulant la récurrence de $l=L$ jusqu'à $l=1$ : $L-1$ poids et $L-1$ dérivées d'activation.",
  },
  {
    id: "b-cr8-6",
    type: "texte",
    texte:
      "Ce membre de droite porte **deux** produits, celui des poids $\\prod w^{[l]}$ et celui des dérivées d'activation $\\prod\\varphi'(z^{[l]})$. Majorer chaque $\\varphi'$ par une constante $c<1$ borne le second par $c^{L-1}$, qui décroît géométriquement avec le nombre de couches, et le chapitre 2, page 9, a établi $c=1/4$ pour la sigmoïde ; mais ce majorant ne dit rien du premier produit, où chaque poids peut amplifier autant que l'activation atténue. Ce qui parvient aux premières couches dépend des deux produits à la fois, et un relevé couche par couche est le seul moyen d'en connaître la taille.",
  },
  {
    id: "b-cr8-8",
    type: "titre",
    niveau: 2,
    texte: "Le produit et la récurrence donnent le même nombre",
  },
  {
    id: "b-cr8-9",
    type: "sortie",
    ancre: "mesure-1-corollaire",
    titre: "Mesure 1 · la récurrence contre le produit déroulé",
    texte: `  dl/da1 = delta2 . w2       = -0.463396
  delta1 = dl/da1 . phi'(z1) = -0.463396
  dl/dw1 = delta1 . x        = -0.463396
  dl/db1 = delta1            = -0.463396

  -- le corollaire : la récurrence contre le produit déroulé ---------------
  (a3 - y) . w3 . phi'(z2) . w2 . phi'(z1) . x
  produit deroule   -0.463396
  recurrence        -0.463396
  ecart             0.000e+00`,
    lecture: [
      "La récurrence descend couche par couche et arrive à $-0{,}463396$.",
      "Le produit déroulé $(-0{,}154465)\\times 2{,}0\\times 1\\times 1{,}5\\times 1\\times 1{,}0$ vaut le même nombre.",
      "L'écart est nul au bit près : ce sont les mêmes multiplications, dans un autre ordre.",
    ],
  },
  {
    id: "b-cr8-11",
    type: "titre",
    niveau: 2,
    texte: "Les six coefficients, vérifiés",
  },
  {
    id: "b-cr8-12",
    type: "encart",
    ton: "attention",
    titre: "Le plancher des différences finies",
    texte:
      "La perte est calculée à la précision de la machine près. La différence finie centrée divise l'écart de deux telles valeurs par $2h$ : l'erreur d'arrondi est donc **amplifiée** par $1/(2h)$, et le résultat porte une erreur absolue de l'ordre de $\\varepsilon_{\\text{machine}}\\,|\\ell|/(2h)$, le plancher. C'est un ordre de grandeur et non un minimum garanti, puisque les deux arrondis se compensent parfois en partie et qu'un coefficient peut alors tomber sous cette valeur. Le plancher ne dépend ni du coefficient ni du bloc, et ce qu'on lit ci-dessous est l'écart **absolu**, avec son rapport à ce plancher.",
  },
  {
    id: "b-cr8-13",
    type: "sortie",
    ancre: "mesure-2",
    titre: "Mesure 2 · différences finies centrées, $h=10^{-6}$",
    texte: `  plancher d'erreur ABSOLUE  eps_machine x |perte| / 2h  =  1.86e-11
  il ne depend ni du coefficient ni du bloc

  coefficient   analytique        finies            ecart absolu   ecart / plancher
  w1            -0.463395795      -0.463395795      2.85e-11          1.53
  b1            -0.463395795      -0.463395795      2.85e-11          1.53
  w2            -0.308930530      -0.308930530      6.52e-11          3.50
  b2            -0.308930530      -0.308930530      6.52e-11          3.50
  w3            -0.169911792      -0.169911792      1.69e-11          0.90
  b3            -0.154465265      -0.154465265      3.68e-11          1.97`,
    lecture: [
      "Les six coefficients du réseau, donc le gradient entier : sur ce réseau, la vérification est exhaustive.",
      "Les deux colonnes de valeurs coïncident sur neuf décimales.",
      "Le plancher vaut $1{,}86\\cdot 10^{-11}$, et les six écarts en font de $0{,}90$ à $3{,}50$ fois : $w^{[3]}$ passe en dessous, ce que l'ordre de grandeur autorise, et aucun n'est en dehors du bruit d'arrondi.",
      "$w^{[1]}$ et $b^{[1]}$ ont la même dérivée parce que $x=1$ ; $w^{[2]}$ et $b^{[2]}$ aussi parce que $a^{[1]}=1$.",
    ],
  },
  {
    id: "b-cr8-14",
    type: "verification",
    numero: 55,
    enonce:
      "L'arbre de la page 4 porte tous les trajets du réseau minuscule.",
    questions: [
      "Décomposer $\\partial\\ell/\\partial w^{[2]}$ en produit de dérivées élémentaires, en suivant l'arbre.",
      "Combien de facteurs ce produit compte-t-il ?",
    ],
  },
  {
    id: "b-cr8-15",
    type: "verification",
    numero: 56,
    enonce:
      "La récurrence et le produit déroulé sont deux organisations du même calcul.",
    questions: [
      "Vérifier sur les valeurs de la mesure 1 que les deux donnent le même nombre pour $\\partial\\ell/\\partial w^{[1]}$.",
      "Combien de multiplications chacune demande-t-elle pour ce seul coefficient ?",
    ],
  },
  {
    id: "b-cr8-16",
    type: "verification",
    numero: 57,
    enonce:
      "Le corollaire (5.6) écrit $\\partial\\ell/\\partial w^{[1]}$ comme un produit.",
    questions: [
      "Si chaque $\\varphi'$ vaut au plus $1/4$, majorer $|\\partial\\ell/\\partial w^{[1]}|$ pour un réseau à six couches, en fonction de $|\\delta^{[L]}|$, des $|w^{[l]}|$ et de $|x|$.",
      "Combien de facteurs $\\varphi'$ ce majorant fait-il intervenir ?",
    ],
  },
  {
    id: "b-cr8-17",
    type: "texte",
    texte:
      "La récurrence est acquise pour un neurone par couche, et elle tient tout entière à l'absence d'embranchement, qui vient de ce qu'une couche ne compte qu'un seul neurone ; reste à savoir ce qu'elle devient quand une couche en compte cent.",
  },
];
