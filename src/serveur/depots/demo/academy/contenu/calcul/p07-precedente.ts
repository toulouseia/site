import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 7 · La couche précédente
//
// L'activation de la couche précédente : sa dérivée s'obtient par la chaîne, et
// elle ne se lit pas comme une consigne de réglage. RENVOI au chapitre 4,
// page 7, sans redéveloppement.
//
// Ouverture, règle 26 : la question, puis l5-fig05-prolonge (1380 × 860), puis
// le cadre. La figure porte le même motif de calcul une couche plus bas.
//
// Mesure 1, la suite des valeurs. Aucune 🧪 sur cette page.
// ─────────────────────────────────────────────────────────────────────────────

export const C07_PRECEDENTE: Bloc[] = [
  {
    id: "b-cr7-0",
    type: "texte",
    texte:
      "Peut-on demander à une couche de changer ce qu'elle reçoit de celle d'avant ?",
  },
  {
    id: "b-cr7-0f",
    type: "image",
    ancre: "le-motif-se-refait",
    src: "/cours/lecon5/l5-fig05-prolonge.svg",
    largeur: 1380,
    hauteur: 860,
    alt: "Deux schémas de même forme, côte à côte, reliés par une flèche. Celui de gauche porte la couche trois : l'activation a exposant trois en haut, la somme pondérée z exposant trois en dessous, et sous elle ses trois entrées, le poids w exposant trois, l'activation a exposant deux et le biais b exposant trois. Celui de droite porte la couche deux et reprend la même disposition, avec a exposant deux, z exposant deux, w exposant deux, a exposant un et b exposant deux. Sous chaque schéma est écrit le signal d'erreur de sa couche, delta exposant trois à gauche et delta exposant deux à droite.",
    legende:
      "Le motif ne dépend pas de la couche : le calcul de la couche 3 se réécrit pour la couche 2 en changeant le seul exposant.",
  },
  {
    id: "b-cr7-0c",
    type: "texte",
    texte:
      "La dernière couche a livré la dérivée de la perte par rapport à son poids et à son biais, et il reste dans sa somme pondérée une troisième quantité dont la perte dépend, l'activation qu'elle reçoit de la couche d'avant. Cette dérivée-là s'obtient par le même produit de rapports, mais elle ne se lit pas comme les deux autres.",
  },
  {
    id: "b-cr7-1",
    type: "titre",
    niveau: 2,
    texte: "Dériver par rapport à une activation",
  },
  {
    id: "b-cr7-2",
    type: "derivation",
    ancre: "activation-precedente",
    titre: "L'activation de la couche précédente",
    hypotheses: [
      "Réseau à un neurone par couche, équations (5.4).",
      "$a^{[L-1]}$ n'influence $\\ell$ qu'à travers $z^{[L]}$ : la chaîne est sans embranchement.",
      "$\\partial\\ell/\\partial z^{[L]}=a^{[L]}-y$, page 5.",
    ],
    chaine: "a^{[L-1]} → z^{[L]} → a^{[L]} → ℓ",
    proprietes: [
      "Règle de la chaîne, forme simple, formule (5.2)",
      "Dérivation d'une fonction affine",
    ],
    etapes: [
      {
        texte:
          "**On dérive la somme pondérée par rapport à l'activation.** Dans $z^{[L]}=w^{[L]}a^{[L-1]}+b^{[L]}$, le coefficient de $a^{[L-1]}$ est $w^{[L]}$.",
      },
      {
        latex: "\\frac{\\partial z^{[L]}}{\\partial a^{[L-1]}}=w^{[L]}",
        alt: "La dérivée de la somme pondérée par rapport à l'activation de la couche précédente vaut le poids de la couche.",
      },
      {
        texte: "**On applique la forme simple de la règle de la chaîne.**",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial a^{[L-1]}}=\\frac{\\partial\\ell}{\\partial z^{[L]}}\\cdot\\frac{\\partial z^{[L]}}{\\partial a^{[L-1]}}=\\big(a^{[L]}-y\\big)\\,w^{[L]}",
        alt: "La dérivée de la perte par rapport à l'activation précédente est le produit de l'écart entre sortie et cible par le poids de la dernière couche.",
      },
    ],
    resultat: {
      latex:
        "\\frac{\\partial\\ell}{\\partial a^{[L-1]}}=\\big(a^{[L]}-y\\big)\\,w^{[L]}",
      alt: "La dérivée de la perte par rapport à l'activation de l'avant-dernière couche vaut l'écart entre sortie et cible multiplié par le poids de la dernière couche.",
    },
    interpretation:
      "L'effet d'une variation de l'activation précédente sur la perte est proportionnel au poids qui les relie : un poids nul coupe la transmission, un poids négatif l'inverse.",
    limites: [
      "$a^{[L-1]}$ n'est **pas** un paramètre : cette dérivée ne se lit pas comme une consigne de réglage.",
    ],
  },
  {
    id: "b-cr7-4",
    type: "titre",
    niveau: 2,
    texte: "Une activation n'est pas un paramètre",
  },
  {
    id: "b-cr7-5",
    type: "tableau",
    ancre: "parametre-ou-non",
    cleEnTete: true,
    entetes: ["Quantité", "Modifiable directement", "Déterminée par"],
    lignes: [
      ["$w^{[l]}$, $b^{[l]}$", "Oui, ce sont les paramètres", "Rien : on les choisit"],
      ["$a^{[l]}$", "Non", "$z^{[l]}$ seule, par $a^{[l]}=\\varphi(z^{[l]})$"],
      ["$z^{[l]}$", "Non", "$w^{[l]}$, $b^{[l]}$, $a^{[l-1]}$"],
    ],
  },
  {
    id: "b-cr7-6",
    type: "texte",
    texte:
      "On ne règle pas une activation, et ce que devient une demande portée sur une quantité qu'on ne contrôle pas est traité au chapitre 4, page 7. Ce qu'elle devient ici se lit dans les deux équations qui définissent cette activation : $a^{[L-1]}=\\varphi(z^{[L-1]})$ et $z^{[L-1]}=w^{[L-1]}a^{[L-2]}+b^{[L-1]}$, si bien que la demande adressée à $a^{[L-1]}$ retombe sur les **propres** poids et biais de la couche $L-1$.",
  },
  {
    id: "b-cr7-8",
    type: "titre",
    niveau: 2,
    texte: "La passe arrière descend à la couche 2",
  },
  {
    id: "b-cr7-9",
    type: "sortie",
    ancre: "mesure-1-couche-precedente",
    titre: "Mesure 1 · la suite de la passe arrière",
    texte: `  dl/da2 = delta3 . w3       = -0.308931
  delta2 = dl/da2 . phi'(z2) = -0.308931
  dl/dw2 = delta2 . a1       = -0.308931
  dl/db2 = delta2            = -0.308931`,
    lecture: [
      "$\\partial\\ell/\\partial a^{[2]}=-0{,}154465\\times 2{,}0=-0{,}308931$ : le poids $w^{[3]}=2{,}0$ double l'effet.",
      "$z^{[2]}=1{,}1>0$, donc $\\mathrm{ReLU}'(z^{[2]})=1$ et la valeur traverse sans changer.",
      "$a^{[1]}=1{,}0$, donc $\\partial\\ell/\\partial w^{[2]}$ vaut la même chose que $\\partial\\ell/\\partial b^{[2]}$ sur cet exemple.",
    ],
  },
  {
    id: "b-cr7-10",
    type: "titre",
    niveau: 2,
    texte: "Le même calcul, un rang plus bas",
  },
  {
    id: "b-cr7-11",
    type: "tableau",
    ancre: "le-calcul-se-refait",
    cleEnTete: true,
    entetes: ["Pour la couche $3$", "Pour la couche $2$"],
    lignes: [
      [
        "$\\partial\\ell/\\partial z^{[3]}$ est connu",
        "$\\partial\\ell/\\partial z^{[2]}$ vient d'être obtenu",
      ],
      [
        "$\\partial\\ell/\\partial w^{[3]}=\\partial\\ell/\\partial z^{[3]}\\cdot a^{[2]}$",
        "$\\partial\\ell/\\partial w^{[2]}=\\partial\\ell/\\partial z^{[2]}\\cdot a^{[1]}$",
      ],
      [
        "$\\partial\\ell/\\partial b^{[3]}=\\partial\\ell/\\partial z^{[3]}$",
        "$\\partial\\ell/\\partial b^{[2]}=\\partial\\ell/\\partial z^{[2]}$",
      ],
      [
        "$\\partial\\ell/\\partial a^{[2]}=\\partial\\ell/\\partial z^{[3]}\\cdot w^{[3]}$",
        "$\\partial\\ell/\\partial a^{[1]}=\\partial\\ell/\\partial z^{[2]}\\cdot w^{[2]}$",
      ],
    ],
    legende:
      "Rien, dans la colonne de droite, ne tient au rang de la couche.",
  },
  {
    id: "b-cr7-12",
    type: "texte",
    texte:
      "Le calcul se transmet d'un rang au rang inférieur et son rang de départ est connu au sommet : c'est la forme d'une propriété qui se démontre par récurrence, et il reste à l'écrire pour obtenir une formule valable à toute profondeur.",
  },
];
