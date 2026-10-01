import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 11 · Ce que la profondeur coûte, ce que l'algorithme économise
//
// Ouverture, règle 26 : la question porte les DEUX sujets de la page, ce qui
// reste du signal au premier rang et le coût ; puis l5-fig15-cout, puis le
// cadre.
//
// Mesure 3, les normes par couche pour ReLU et pour la sigmoïde, sur quatre
// puis sur huit couches cachées. Le majorant 1/4 ne borne que le facteur phi'
// d'une traversée, jamais le poids qui l'accompagne : l'atténuation se MESURE.
//
// Mesure 4, la vérification sur cinq couches, lue à travers le plancher des
// différences finies. Puis la majoration par trois passes avant, et la
// mesure 5 : LE COÛT EST COMPTÉ EN MULTIPLICATIONS, pas en secondes.
//
// 🧪 n°61 et n°62.
// ─────────────────────────────────────────────────────────────────────────────

export const C11_PROFONDEUR: Bloc[] = [
  {
    id: "b-cr11-0",
    type: "texte",
    texte:
      "Un réseau s'évalue en une traversée, et se corrige en reprenant chacun de ses poids, que le signal d'erreur atteint en remontant les couches une à une. Que reste-t-il de ce signal arrivé au premier rang, et un réseau profond coûte-t-il plus cher à corriger qu'à évaluer ?",
  },
  {
    id: "b-cr11-0f",
    type: "image",
    ancre: "le-cout-compte",
    src: "/cours/lecon5/l5-fig15-cout.svg",
    largeur: 1380,
    hauteur: 780,
    alt: "Trois barres horizontales à la même échelle, comptées en multiplications. La première porte la passe avant, 63 104, et la deuxième la passe arrière, 76 032, lue en deux morceaux : les remontées, 12 928, et les produits extérieurs, 63 104. La troisième porte le total de l'aller et du retour, 139 136. Un trait vertical en pointillé marque trois fois la passe avant, et la troisième barre s'arrête avant lui.",
    legende:
      "Corriger ne coûte jamais beaucoup plus qu'évaluer : le total reste sous le trait, sur ce réseau comme sur n'importe quel autre.",
  },
  {
    id: "b-cr11-0c",
    type: "texte",
    texte:
      "La norme du signal d'erreur se relève couche par couche sur un réseau à quatre couches cachées, puis sur le même à huit, et le gradient entier se compte en multiplications.",
  },
  {
    id: "b-cr11-1",
    type: "titre",
    niveau: 2,
    texte: "Ce que la profondeur fait au signal d'erreur",
  },
  {
    id: "b-cr11-2",
    type: "texte",
    texte:
      "Le relevé porte sur un réseau $784\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 64\\rightarrow 10$ non entraîné, initialisé par la méthode He avec la graine $0$, sur un seul exemple, et **les deux activations y partagent les mêmes poids** : d'un relevé à l'autre, seule $\\varphi$ change. La norme relevée est la norme euclidienne, et les cinq vecteurs ne vivent pas dans le même espace, $\\boldsymbol{\\delta}^{[1]}$ à $\\boldsymbol{\\delta}^{[4]}$ étant dans $\\mathbb{R}^{64}$ et $\\boldsymbol{\\delta}^{[5]}$ dans $\\mathbb{R}^{10}$ : le rapport de la dernière couche à la première divise deux normes prises en dimensions différentes.",
  },
  {
    id: "b-cr11-3",
    type: "sortie",
    ancre: "mesure-3",
    titre: "Mesure 3 · norme de $\\boldsymbol{\\delta}^{[l]}$, couche par couche",
    texte: `  -- quatre couches cachees · 784 -> 64 -> 64 -> 64 -> 64 -> 10 ------------
    relu      perte 1.8785
      l=1 : 0.734  l=2 : 0.8847  l=3 : 1.025  l=4 : 0.924  l=5 : 0.8997
      rapport sortie / premiere couche : 1.2   sur 4 traversees
      attenuation moyenne par traversee : 1.05   (pire cas annonce par phi' <= 1/4 : 4)
    sigmoide  perte 1.7828
      l=1 : 0.006729  l=2 : 0.0236  l=3 : 0.09483  l=4 : 0.3029  l=5 : 0.8975
      rapport sortie / premiere couche : 133.4   sur 4 traversees
      attenuation moyenne par traversee : 3.40   (pire cas annonce par phi' <= 1/4 : 4)`,
    lecture: [
      "Avec $\\mathrm{ReLU}$, la norme du signal reste du même ordre sur les cinq couches : le rapport de la sortie à la première couche vaut $1{,}2$.",
      "Avec la sigmoïde, elle est divisée par $133{,}4$ entre la sortie et la première couche, en quatre traversées.",
      "Chaque traversée divise en moyenne par $3{,}40$, et une traversée multiplie par deux choses, un poids et une dérivée d'activation. Le majorant $\\sigma'\\leq 1/4$, démontré au chapitre 2, page 9, ne borne que la seconde, et le $4$ que la sortie rappelle en regard de chaque relevé ne concerne donc que $\\varphi'$.",
      "Le rapport mesuré $133{,}4$ est **en deçà** de $4^{4}=256$ : si les poids n'avaient fait qu'atténuer, quatre traversées auraient divisé par $256$ au moins, et c'est donc le produit des poids qui compense. L'atténuation d'un réseau profond se mesure, elle ne se déduit pas d'un majorant qui ne porte que sur $\\varphi'$.",
      "Toute la mesure 3 porte sur **un seul exemple** : la première image de classe $2$ du jeu d'entraînement, désignée par ce critère et non tirée au sort. Les rapports $1{,}2$ et $133{,}4$, et donc l'atténuation moyenne $3{,}40$, en dépendent, et une autre image donne d'autres valeurs, dont l'ordre de grandeur ne change pas.",
    ],
  },
  {
    id: "b-cr11-4",
    type: "animation",
    ancre: "le-signal-sattenue",
    animationId: "le-signal-sattenue",
    legende:
      "La norme du signal d'erreur relevée aux cinq couches, ReLU puis sigmoïde, à la même échelle : un rapport de $1{,}2$ contre $133{,}4$.",
  },
  {
    id: "b-cr11-5",
    type: "titre",
    niveau: 2,
    texte: "La même loi, sur huit couches cachées",
  },
  {
    id: "b-cr11-6",
    type: "sortie",
    ancre: "mesure-3-huit-couches",
    titre: "Mesure 3 · le même relevé, $784\\rightarrow 64^{8}\\rightarrow 10$",
    texte: `  -- huit couches cachees · 784 -> 64 -> 64 -> 64 -> 64 -> 64 -> 64 -> 64 -> 64 -> 10
    relu      perte 1.8190
      l=1 : 0.6566  l=2 : 0.7867  l=3 : 0.8058  l=4 : 0.7567  l=5 : 0.8349  l=6 : 0.6962  l=7 : 0.8289  l=8 : 0.8559  l=9 : 0.8841
      rapport sortie / premiere couche : 1.3   sur 8 traversees
      attenuation moyenne par traversee : 1.04   (pire cas annonce par phi' <= 1/4 : 4)
    sigmoide  perte 2.1890
      l=1 : 8.218e-05  l=2 : 0.0002599  l=3 : 0.0007214  l=4 : 0.00255  l=5 : 0.009286  l=6 : 0.02677  l=7 : 0.08792  l=8 : 0.2824  l=9 : 0.9481
      rapport sortie / premiere couche : 11536.2   sur 8 traversees
      attenuation moyenne par traversee : 3.22   (pire cas annonce par phi' <= 1/4 : 4)`,
    lecture: [
      "Quatre traversées de plus font passer le rapport de $133{,}4$ à $11\\,536{,}2$, soit un facteur $86$.",
      "L'atténuation par traversée passe de $3{,}40$ à $3{,}22$ quand la profondeur double : le facteur ne dépend presque pas du nombre de couches, ce qu'une décroissance géométrique donnerait.",
      "Ce facteur est une moyenne géométrique, $3{,}22^{8}=11\\,536$ par construction, et les rapports d'une couche à la suivante ne sont pas tous égaux.",
      "Avec $\\mathrm{ReLU}$, le rapport passe de $1{,}2$ à $1{,}3$ sur deux fois plus de traversées : il n'y a pas de décroissance géométrique à constater.",
    ],
  },
  {
    id: "b-cr11-7",
    type: "titre",
    niveau: 2,
    texte: "La récurrence, vérifiée sur cinq couches",
  },
  {
    id: "b-cr11-8",
    type: "encart",
    ton: "attention",
    titre: "Deux colonnes d'écart, et la seconde est restreinte",
    texte:
      "L'écart **absolu** se lit sur tous les coefficients, à l'échelle du plancher $\\varepsilon_{\\text{machine}}\\,|\\ell|/(2h)$, page 8. L'écart **relatif** n'est lu que sur les coefficients dont la dérivée analytique dépasse $100$ fois ce plancher : ailleurs il divise par un nombre plus petit que l'erreur d'arrondi et ne mesure plus rien.",
  },
  {
    id: "b-cr11-9",
    type: "sortie",
    ancre: "mesure-4",
    titre: "Mesure 4 · gradient entier par différences finies, $63\\,370$ coefficients",
    texte: `  -- relu · gradient entier par differences finies en 10.06 s --------------
    perte 1.8785   plancher absolu 2.09e-10   seuil de lecture 2.09e-08
    bloc      coeff.   ecart absolu med.  max.      retenus  ecart relatif med.  max.
    W^[1]      50176      0.00e+00  4.12e-10      4700        1.27e-09  1.04e-06
    b^[1]         64      0.00e+00  2.36e-10        25        7.11e-10  1.40e-08
    W^[2]       4096      0.00e+00  3.28e-10       700        1.97e-09  3.84e-06
    b^[2]         64      0.00e+00  2.17e-10        28        7.73e-10  1.59e-08
    W^[3]       4096      0.00e+00  3.06e-10       896        1.28e-09  9.25e-07
    b^[3]         64      3.79e-13  1.85e-10        32        4.07e-10  1.41e-08
    W^[4]       4096      0.00e+00  2.85e-10      1248        1.94e-09  2.55e-05
    b^[4]         64      1.85e-11  2.16e-10        39        5.73e-10  3.86e-07
    W^[5]        640      1.48e-11  2.73e-10       390        1.08e-09  2.26e-07
    b^[5]         10      2.94e-11  1.73e-10        10        3.74e-10  2.44e-09
    sur les 63370 coefficients : ecart absolu maximal 4.12e-10  (2.0 fois le plancher)
    ecart relatif maximal sur les coefficients retenus : 2.55e-05

  -- sigmoide · gradient entier par differences finies en 13.17 s ----------
    perte 1.7828   plancher absolu 1.98e-10   seuil de lecture 1.98e-08
    bloc      coeff.   ecart absolu med.  max.      retenus  ecart relatif med.  max.
    W^[1]      50176      0.00e+00  4.64e-10     12032        2.58e-07  2.43e-04
    b^[1]         64      9.08e-11  3.78e-10        64        1.56e-07  8.67e-06
    W^[2]       4096      7.73e-11  4.06e-10      4096        7.35e-08  5.40e-04
    b^[2]         64      8.57e-11  4.21e-10        64        3.56e-08  7.23e-05
    W^[3]       4096      7.07e-11  4.55e-10      4096        1.97e-08  2.86e-06
    b^[3]         64      8.32e-11  3.03e-10        64        9.43e-09  3.43e-07
    W^[4]       4096      5.41e-11  2.52e-10      4096        4.15e-09  1.06e-05
    b^[4]         64      5.59e-11  1.76e-10        64        1.95e-09  1.17e-06
    W^[5]        640      4.67e-11  1.89e-10       640        1.08e-09  1.72e-08
    b^[5]         10      2.22e-11  8.56e-11        10        2.78e-10  1.87e-09
    sur les 63370 coefficients : ecart absolu maximal 4.64e-10  (2.3 fois le plancher)
    ecart relatif maximal sur les coefficients retenus : 5.40e-04`,
    lecture: [
      "Tous les coefficients de tous les blocs sont contrôlés, et non un échantillon : c'est le retour écrit sans indices, vérifié sur un cas où la récurrence tourne quatre fois.",
      "L'écart absolu maximal vaut $4{,}12\\cdot 10^{-10}$ avec $\\mathrm{ReLU}$ et $4{,}64\\cdot 10^{-10}$ avec la sigmoïde : deux fois le plancher, pas davantage.",
      "Le nombre de coefficients retenus est très différent d'une activation à l'autre : $4\\,700$ sur $50\\,176$ dans $W^{[1]}$ avec $\\mathrm{ReLU}$, contre $12\\,032$ avec la sigmoïde. Les autres ont une dérivée exactement ou presque nulle, puisqu'un pixel de bord vaut $0$ et que $\\delta_{i}a^{[0]}_{j}=0$.",
      "Sur les coefficients retenus, l'écart relatif médian reste sous $3\\cdot 10^{-7}$ dans tous les blocs, et son maximum sous $5{,}4\\cdot 10^{-4}$.",
    ],
  },
  {
    id: "b-cr11-10",
    type: "titre",
    niveau: 2,
    texte: "Ce que l'algorithme coûte",
  },
  {
    id: "b-cr11-11",
    type: "derivation",
    ancre: "proposition-7",
    titre: "Ce que coûtent une passe avant et une passe retour",
    hypotheses: [
      "Réseau général (5.7), et formulaire (5.12) pour la passe arrière.",
      "Le coût est compté en **multiplications** ; les additions et les évaluations de $\\varphi$ sont d'ordre inférieur.",
    ],
    proprietes: [
      "Un produit $(m\\times n)$ par $(n\\times 1)$ coûte $mn$ multiplications",
      "Un produit extérieur $(m\\times 1)$ par $(1\\times n)$ coûte $mn$ multiplications",
    ],
    etapes: [
      {
        texte:
          "**La passe avant.** Elle calcule $L$ produits matrice-vecteur $W^{[l]}\\mathbf{a}^{[l-1]}$.",
        latex: "A=\\sum_{l=1}^{L}d_{l}\\,d_{l-1}",
        alt: "Le coût de la passe avant est la somme, pour l de un à L, du produit de d l par d l moins un.",
      },
      {
        texte:
          "**La passe arrière, premier terme.** Pour chaque $l\\leq L-1$, elle calcule $\\big(W^{[l+1]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[l+1]}$, de coût $d_{l+1}d_{l}$.",
        latex:
          "\\sum_{l=1}^{L-1}d_{l+1}\\,d_{l}=\\sum_{l=2}^{L}d_{l}\\,d_{l-1}\\ \\leq\\ A",
        alt: "La somme des coûts des remontées est la somme, pour l de deux à L, de d l fois d l moins un, qui est inférieure ou égale à A.",
        justification:
          "C'est la somme $A$ privée de son terme $l=1$, donc strictement plus petite dès que $d_{1}d_{0}>0$.",
      },
      {
        texte:
          "**La passe arrière, second terme.** Pour chaque $l$, elle calcule le produit extérieur $\\boldsymbol{\\delta}^{[l]}\\big(\\mathbf{a}^{[l-1]}\\big)^{\\mathsf{T}}$, de coût $d_{l}d_{l-1}$ : au total exactement $A$.",
      },
      {
        latex: "B\\ \\leq\\ 2A,\\qquad A+B\\ \\leq\\ 3A",
        alt: "Le coût de la passe arrière est au plus deux fois celui de la passe avant, donc le coût total est au plus trois fois celui de la passe avant.",
      },
    ],
    resultat: {
      latex: "\\frac{A+B}{A}\\ \\leq\\ 3\\quad\\text{indépendamment de }p",
      alt: "Le rapport du coût total au coût de la passe avant est majoré par trois, quel que soit le nombre de paramètres.",
    },
    interpretation:
      "Le gradient entier coûte moins de trois propagations avant, quel que soit le nombre de paramètres. Les différences finies en demandent $2p$ : le rapport entre les deux procédés croît proportionnellement à $p$.",
    limites: [
      "La majoration compte des multiplications. Une durée d'horloge mesure en plus les allocations et l'interprète, et n'est pas majorée par $3$.",
      "L'inégalité $B\\leq 2A$ est stricte : le terme $d_{1}d_{0}$ manque au premier terme, et c'est le plus gros de la somme.",
    ],
  },
  {
    id: "b-cr11-12",
    type: "sortie",
    ancre: "mesure-5",
    titre: "Mesure 5 · le coût, compté en multiplications",
    texte: `  -- le compte des multiplications -----------------------------------------
    passe avant                            63104
    remontees (W^T delta)                  12928
    produits exterieurs                    63104
    passe arriere                          76032
    total avant + arriere                 139136
    rapport a la passe avant seule          2.20
    majorant de la proposition 7            3,00

  -- les differences finies, comptees de la meme facon ---------------------
    63370 coefficients a deux propagations avant chacun
    soit                                  126740 propagations avant
    multiplications                   7997800960
    rapport a la retropropagation          57482

    le meme rapport sur le reseau du chapitre 2, 101770 parametres :
    rapport                               101133
    il croit proportionnellement au nombre de parametres`,
    lecture: [
      "Le rapport vaut $2{,}20$, en deçà des trois passes avant qui le majorent.",
      "« La proposition 7 » y numérote un résultat du chapitre 5, la majoration du coût par trois passes avant, et non la proposition 7 du chapitre 4 citée page 6, qui porte sur la moyenne des gradients.",
      "L'écart à la majoration est exactement le terme manquant $d_{1}d_{0}=50\\,176$, rapporté à $A=63\\,104$ : $3-2{,}20=0{,}80=50\\,176/63\\,104$.",
      "Les différences finies demandent $126\\,740$ propagations avant, soit près de huit milliards de multiplications : $57\\,482$ fois le coût de la rétropropagation.",
      "Sur le réseau du chapitre 2, à $101\\,770$ paramètres, le même rapport vaut $101\\,133$.",
    ],
  },
  {
    id: "b-cr11-13",
    type: "encart",
    ton: "note",
    titre: "Pourquoi un compte, et pas un chronomètre",
    texte:
      "Une durée d'horloge varie d'un facteur dix selon ce que la machine fait par ailleurs ; sur ce réseau, une propagation avant a été mesurée à $43{,}8$, à $65{,}5$ puis à $289{,}7$ microsecondes selon l'exécution. Un compte d'opérations ne dépend d'aucune machine, et c'est lui qui est majoré ; le programme imprime aussi les durées, en prévenant qu'elles bougent.",
  },
  {
    id: "b-cr11-15",
    type: "texte",
    texte:
      "Le chapitre 3 se terminait sur une question : un gradient obtenu par différences finies demande deux propagations avant par coefficient, ce qui est hors de portée dès que $p$ dépasse quelques milliers. Le rapport $57\\,482$ mesuré ici, et le rapport $101\\,133$ sur le réseau du chapitre 2, la referment.",
  },
  {
    id: "b-cr11-16",
    type: "verification",
    numero: 61,
    enonce:
      "Le rapport des normes vaut $1{,}2$ avec $\\mathrm{ReLU}$ et $133{,}4$ avec la sigmoïde, sur quatre traversées.",
    questions: [
      "Le majorant $\\sigma'\\leq 1/4$ du chapitre 2, page 9, suffit-il à prédire ces deux nombres ? Dire quel facteur d'une traversée il laisse libre.",
      "Que vaudrait le rapport si les poids n'atténuaient ni n'amplifiaient, et que conclure de l'écart avec $133{,}4$ ?",
    ],
  },
  {
    id: "b-cr11-17",
    type: "verification",
    numero: 62,
    enonce:
      "La majoration porte le coût du gradient à trois passes avant au plus, et la mesure en donne $2{,}20$.",
    questions: [
      "Pourquoi la majoration n'est-elle pas atteinte ?",
      "Quel terme manque à la somme des remontées, et combien vaut-il sur ce réseau ?",
    ],
  },
];
