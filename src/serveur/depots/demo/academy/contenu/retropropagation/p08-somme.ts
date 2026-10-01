import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 8 · Dix demandes, une somme
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig10-demandes`, les dix demandes mesurées et leur somme. Le conflit se
// voit avant qu'on en parle.
//
// Proposition 6, et son INTERPRÉTATION EN TOUTES LETTRES : à l'aller, la ligne
// k de W collecte les 128 activations vers le neurone k ; au retour, la colonne
// j — la ligne j de la transposée — redistribue les dix corrections vers
// l'activation j. Le même tableau de nombres, lu dans l'autre sens.
//
// Le texte dit pourquoi on SOMME et non pourquoi on CHOISIT : la règle de la
// chaîne à plusieurs chemins l'impose. Ce n'est pas un arbitrage entre demandes
// concurrentes, et la mesure le montre.
// ─────────────────────────────────────────────────────────────────────────────

export const R08_SOMME: Bloc[] = [
  {
    id: "b-rp8-0",
    type: "texte",
    texte:
      "Une activation cachée alimente les dix neurones de sortie à la fois, et les dix n'ont pas le même avis sur le sens dans lequel elle doit bouger. Que fait-on de dix demandes qui se contredisent ?",
  },
  {
    id: "b-rp8-3f",
    type: "image",
    ancre: "dix-demandes-mesurees",
    src: "/cours/lecon4/l4-fig10-demandes.svg",
    largeur: 1380,
    hauteur: 1070,
    alt: "Un tableau de dix lignes, une par neurone de sortie. Chacune donne le signal d'erreur de ce neurone, le poids qui le relie au quatre-vingt-douzième neurone caché, le produit des deux, et le sens que ce produit demande. Une barre horizontale accompagne chaque ligne, tracée à droite d'un axe vertical pour les produits positifs, à gauche pour les négatifs. Six lignes demandent de monter, quatre de descendre, et les magnitudes sont comparables : la plus forte, plus zéro virgule zéro vingt-deux mille trois cent soixante-douze, vient du neurone de sortie un. En pied, la somme des dix demandes vaut plus zéro virgule zéro zéro six mille quatre cent deux, elle est la quatre-vingt-douzième composante du produit de la transposée de la seconde matrice de poids par le signal d'erreur de sortie, et elle est plus petite que la plus forte des dix.",
    legende:
      "Dix demandes contradictoires, et une seule somme les départage.",
  },
  {
    id: "b-rp8-3g",
    type: "texte",
    texte:
      "Six neurones de sortie demandent que $a_{92}$ monte, quatre qu'elle descende, et aucune des dix demandes n'est nulle. La plus forte ne vient pas du neurone de la vraie classe mais du neurone $1$, parce que le poids qui relie la vraie classe à $a_{92}$ est faible.\n\nLa somme, $+0{,}006402$, est plus petite que la plus grande des dix, et c'est pourtant elle, et elle seule, qui est la dérivée.",
  },
  {
    id: "b-rp8-2",
    type: "titre",
    niveau: 2,
    texte: "Dix demandes sur une même activation",
  },
  {
    id: "b-rp8-3",
    type: "sortie",
    ancre: "mesure-3-dix-demandes",
    titre:
      "Les dix demandes portées sur $a_{92}^{[1]}$ · cours/lecon4/mesures.py, mesure 3",
    texte:
      "  -- La troisième voie : les dix demandes sur l'activation a^[1]_92 --------\n  a^[1]_92 = 1.5903, neurone ALLUMÉ (z^[1]_92 = +1.5903)\n\n      k     delta_k       W^[2]_kj      delta_k W_kj    sens demandé\n      0     +0.1366       +0.0609       +0.008315      descendre\n      1     +0.1098       +0.2038       +0.022372      descendre\n      2     -0.7555       +0.0116       -0.008780      monter\n      3     +0.0911       -0.1292       -0.011776      monter\n      4     +0.0796       -0.0107       -0.000851      monter\n      5     +0.1308       +0.0918       +0.012011      descendre\n      6     +0.0478       -0.1832       -0.008751      monter\n      7     +0.0574       -0.0884       -0.005073      monter\n      8     +0.0563       +0.1288       +0.007246      descendre\n      9     +0.0462       -0.1800       -0.008311      monter\n\n  somme des dix contributions                   +0.006402\n  composante 92 de (W^[2])^T delta^[2]            +0.006402\n  écart entre les deux                          1.735e-18",
    lecture: [
      "Le neurone $2$, dont le signal d'erreur est pourtant sept fois plus grand que les autres, ne pèse que $-0{,}008780$, parce que le poids qui le relie à $a_{92}$ vaut $W_{2,92}=+0{,}0116$.",
      "**La somme est plus petite que la plus grande des dix** parce que les demandes s'annulent en partie, ce qui est normal : ce ne sont pas des votes, ce sont des contributions signées.",
    ],
  },
  {
    id: "b-rp8-4",
    type: "animation",
    ancre: "dix-demandes-sur-un-meme-neurone",
    animationId: "dix-demandes-sur-un-meme-neurone",
    legende:
      "La transposée à l'œuvre : dix demandes convergent sur le neurone caché $92$ et s'y additionnent.",
  },
  {
    id: "b-rp8-5",
    type: "titre",
    niveau: 2,
    texte: "La demande totale",
  },
  {
    id: "b-rp8-6",
    type: "derivation",
    ancre: "proposition-6",
    titre:
      "La demande totale portée sur les activations cachées vaut $(W^{[2]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}$ (proposition 6)",
    hypotheses: [
      "$z_{k}^{[2]}=\\sum_{j}W_{kj}^{[2]}a_{j}^{[1]}+b_{k}^{[2]}$ pour $k\\in[\\![0,9]\\!]$.",
      "$a_{j}^{[1]}$ influence $\\ell$ à travers les **dix** composantes de $\\mathbf{z}^{[2]}$, et seulement à travers elles.",
      "$\\boldsymbol{\\delta}^{[2]}=\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell\\in\\mathbb{R}^{10}$.",
    ],
    chaine: "a_j^{[1]} → (z_0^{[2]}, …, z_9^{[2]}) → a^{[2]} → ℓ",
    proprietes: [
      "Règle de la chaîne à plusieurs chemins, formule (4.4), avec $m=10$ chemins",
      "Proposition 5 pour chacun des dix termes",
      "$(A^{\\mathsf{T}})_{jk}=A_{kj}$",
    ],
    etapes: [
      {
        texte:
          "**On somme sur les dix chemins.** Contrairement aux propositions 3 et 4, aucun terme ne s'annule, puisque $a_{j}$ apparaît dans les dix lignes de la somme pondérée.",
      },
      {
        latex:
          "\\frac{\\partial\\ell}{\\partial a_{j}^{[1]}}=\\sum_{k=0}^{9}\\frac{\\partial\\ell}{\\partial z_{k}^{[2]}}\\,\\frac{\\partial z_{k}^{[2]}}{\\partial a_{j}^{[1]}}=\\sum_{k=0}^{9}\\delta_{k}^{[2]}\\,W_{kj}^{[2]}",
        alt: "La dérivée partielle de la perte par rapport à l'activation a j de la couche un vaut la somme, pour k allant de zéro à neuf, du produit de delta k de la couche deux par le poids W k j de la couche deux.",
        justification: "Proposition 5, appliquée aux dix valeurs de $k$.",
      },
      {
        texte:
          "**On reconnaît un produit matriciel.** Cette somme porte sur l'indice de **ligne** $k$, à colonne $j$ fixée, donc ce n'est pas la $j$-ième composante de $W^{[2]}\\boldsymbol{\\delta}^{[2]}$, un produit qui n'a d'ailleurs pas de sens puisque $(10\\times 128)(10\\times 1)$ ne se compose pas. En écrivant $W_{kj}=(W^{\\mathsf{T}})_{jk}$, la somme devient $\\sum_{k}(W^{\\mathsf{T}})_{jk}\\delta_{k}$, qui est la $j$-ième composante de $(W^{[2]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}$.",
      },
      {
        latex:
          "\\mathrm{grad}_{\\mathbf{a}^{[1]}}\\,\\ell=\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]},\\qquad (128\\times 10)(10\\times 1)=128\\times 1",
        alt: "Le gradient de la perte par rapport aux activations de la couche un est le produit de la transposée de W de la couche deux par le signal d'erreur de la couche deux. Les dimensions sont cent vingt-huit par dix multiplié par dix par un, ce qui donne cent vingt-huit par un.",
        justification:
          "Les dimensions s'accordent, et le résultat a bien la forme de $\\mathbf{a}^{[1]}$.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{grad}_{\\mathbf{a}^{[1]}}\\,\\ell=\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\ \\in\\mathbb{R}^{128}",
      alt: "Le gradient de la perte par rapport au vecteur des activations de la couche un est la transposée de la matrice de la couche deux appliquée au signal d'erreur de cette couche, un vecteur de cent vingt-huit composantes.",
    },
    interpretation:
      "**À l'aller, la ligne $k$ de $W^{[2]}$ collecte** les $128$ activations et les rassemble en un seul nombre, $z_{k}$, et **au retour la colonne $j$, c'est-à-dire la ligne $j$ de la transposée, redistribue** les dix corrections vers l'activation $j$. C'est le même tableau de nombres, lu dans l'autre sens, et la transposée n'est donc ni une astuce de notation ni un ajustement de dimensions : c'est ce que « additionner les demandes » veut dire, une fois écrit.",
    limites: [
      "Le résultat porte sur $\\mathbf{a}^{[1]}$ et non sur $\\mathbf{z}^{[1]}$, et le passage de l'un à l'autre traverse la fonction d'activation.",
      "L'écriture vaut pour deux couches, et sa forme générale à $L$ couches est renvoyée au chapitre 5.",
    ],
  },
  {
    id: "b-rp8-8",
    type: "titre",
    niveau: 2,
    texte: "Pourquoi on somme, et non pourquoi on choisit",
  },
  {
    id: "b-rp8-9",
    type: "texte",
    texte:
      "Dix demandes contradictoires portent sur la même activation, et il serait tentant d'y voir un conflit à arbitrer en retenant la plus forte, ou celle du neurone de la vraie classe. **Il n'y a pas de conflit et rien à arbitrer** : la règle de la chaîne à plusieurs chemins, formule (4.4), donne la somme, et la somme est la dérivée. Un arbitrage donnerait un autre nombre, qui ne serait la dérivée de rien.",
  },
  {
    id: "b-rp8-10",
    type: "tableau",
    ancre: "somme-contre-arbitrage",
    cleEnTete: true,
    entetes: ["Procédé", "Sur $a_{92}^{[1]}$", "Est-ce $\\partial\\ell/\\partial a_{92}$ ?"],
    lignes: [
      ["Retenir la plus grande demande", "$+0{,}022372$", "Non"],
      ["Retenir celle de la vraie classe", "$-0{,}008780$", "Non"],
      ["Additionner les dix", "$+0{,}006402$", "**Oui**, et la mesure 2 le confirme"],
    ],
  },
  {
    id: "b-rp8-12",
    type: "encart",
    ton: "note",
    titre: "Un contrôle qui vaut d'être fait",
    texte:
      "La mesure 3 additionne les dix contributions à la main et compare le résultat à la composante $92$ de $(W^{[2]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}$ calculée par le produit matriciel : $+0{,}006402$ des deux côtés, pour un écart de $1{,}7\\cdot 10^{-18}$. C'est le contrôle que le passage à l'écriture matricielle n'a rien changé, ni transposé de travers, ni sommé sur le mauvais indice.",
  },
  {
    id: "b-rp8-13",
    type: "verification",
    numero: 43,
    enonce:
      "Les dix demandes portées sur $a_{92}^{[1]}$ figurent dans la mesure 3 ; leur somme vaut $+0{,}006402$, et la plus grande $+0{,}022372$.",
    questions: [
      "Pourquoi additionne-t-on les dix demandes plutôt que de retenir la plus forte ? Répondre par la formule (4.4), non par le bon sens.",
      "Que vaudrait $\\partial\\ell/\\partial a_{92}$ si les dix poids $W_{k,92}$ étaient tous nuls ? Et si les dix étaient égaux à $1$ ?",
    ],
  },
  {
    id: "b-rp8-14",
    type: "verification",
    numero: 44,
    enonce:
      "$W^{[2]}\\in\\mathcal{M}_{10,128}(\\mathbb{R})$ et $\\boldsymbol{\\delta}^{[2]}\\in\\mathbb{R}^{10}$.",
    questions: [
      "Écrire les dimensions de $(W^{[2]})^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}$ et vérifier qu'elles sont celles de $\\mathbf{a}^{[1]}$.",
      "Que donnerait $W^{[2]}\\boldsymbol{\\delta}^{[2]}$, sans transposition ? Répondre par la règle de composition des dimensions.",
    ],
  },
];
