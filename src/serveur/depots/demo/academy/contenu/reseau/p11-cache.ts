import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 11 · Ce que la couche cachée a appris
//
// LA PAGE DE L'ÉCART N°3. L'exposé dont ce chapitre suit l'ordre présente
// l'hypothèse que les neurones cachés détectent des boucles et des traits, et
// ne la tranche pas. Cette page bâtit le même espoir, complètement et sans
// ironie : il est raisonnable, et la page 5 a montré qu'un détecteur de bord
// est constructible. La page le TRANCHE ensuite par une mesure.
//
// AUCUNE PHRASE DE CETTE PAGE NE DIT POURQUOI LA SOURCE FAIT CE QU'ELLE FAIT.
// Ce que le dépôt ne peut pas établir n'est pas écrit, et n'est pas conjecturé.
//
// La mesure est faite des deux côtés, et elle est CALIBRÉE : on mesure aussi
// combien deux vrais détecteurs de bord se ressemblent entre eux, pour savoir
// ce que « ressembler » vaut sur cette échelle. Sans cette référence, un rho de
// 0,43 ne voudrait rien dire.
//
// Tous les nombres sortent de cours/lecon2/mesures.py, sections 7 et 10.
// ─────────────────────────────────────────────────────────────────────────────

export const P11_CACHE: Bloc[] = [
  {
    id: "b-r11-1",
    type: "texte",
    texte:
      "On aime croire qu'un réseau qui a appris découpe le problème comme nous le ferions : d'abord des bords, puis des boucles, puis des chiffres. L'espoir est séduisant, et il est répandu. La seule façon de savoir s'il est vrai est d'aller regarder ce que les neurones cachés font réellement, et de le mesurer plutôt que de l'imaginer.",
  },
  {
    id: "b-r11-14f",
    type: "image",
    ancre: "espoir-et-mesure",
    src: "/cours/lecon2/l2-fig13-espoir.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "À gauche, l'arbre de la hiérarchie espérée : une case unique en haut, un chiffre ; trois cases au niveau suivant, une boucle, un trait droit, une jonction ; six cases en bas, toutes marquées bord. Chaque case est reliée à toutes celles de l'étage inférieur par des filets gris pâles, et la légende porte un neurone caché par morceau. À droite, une règle horizontale graduée de zéro à un mesure la valeur absolue de la corrélation entre un gabarit caché et un gabarit de classe. Un trait en pointillé marque zéro virgule cinquante. Deux repères sont posés sur la règle : la moyenne des mille deux cent quatre-vingts couples, à zéro virgule zéro huit cinq trois, et le maximum, à zéro virgule quatre huit neuf quatre, atteint entre le gabarit caché numéro cinquante-quatre et le gabarit de la classe sept ; ce maximum tombe juste en deçà du trait de zéro virgule cinquante. Sous la règle, une table redonne les mille deux cent quatre-vingts couples examinés, zéro couple au-dessus de zéro virgule cinquante, et la moyenne zéro virgule zéro huit cinq trois. Une dernière ligne, en brique, dit qu'aucun gabarit caché ne ressemble à un chiffre.",
    legende:
      "L'espoir était assez précis pour être mesuré, et c'est ce qui permet de le réfuter.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.1 · L'espoir
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r11-2",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'on peut espérer",
  },
  {
    id: "b-r11-3",
    type: "texte",
    texte:
      "Un chiffre manuscrit se décompose. Un $8$ est fait de deux boucles superposées ; un $9$ d'une boucle en haut et d'un trait vertical ; un $4$ de deux obliques et d'une barre. Ces morceaux reviennent d'un chiffre à l'autre : la même boucle sert au $8$, au $9$, au $6$ et au $0$.",
  },
  {
    id: "b-r11-4",
    type: "texte",
    texte:
      "On peut donc espérer ceci, et c'est précis : que la couche cachée détecte ces morceaux. Qu'un neurone caché s'active sur une boucle en haut de l'image, un autre sur un trait vertical à droite, un autre sur une barre horizontale. La couche de sortie n'aurait alors qu'à combiner : un $9$ est une boucle en haut **et** un trait à droite, ce qui est exactement une somme pondérée de deux activations.",
  },
  {
    id: "b-r11-4b",
    type: "titre",
    niveau: 3,
    texte: "L'espoir, prolongé d'un cran",
  },
  {
    id: "b-r11-5",
    type: "texte",
    texte:
      "Une boucle n'est pas non plus un objet élémentaire : elle se décompose en petits bords orientés, et un trait long est un bord long. Une première couche détecterait donc des **bords**, une seconde des **motifs** faits de bords, et la sortie des chiffres faits de motifs. C'est la hiérarchie $\\text{pixels}\\rightarrow\\text{bords}\\rightarrow\\text{motifs}\\rightarrow\\text{chiffres}$.",
  },
  {
    id: "b-r11-6",
    type: "tableau",
    ancre: "hierarchie",
    titre: "La hiérarchie espérée",
    cleEnTete: true,
    entetes: ["Niveau", "Ce qui y serait détecté", "Où"],
    lignes: [
      ["Entrée", "Des intensités, une par pixel", "$\\mathbf{a}^{[0]}=\\mathbf{x}$, $784$ coordonnées"],
      ["Premier niveau", "Des bords orientés, courts et locaux", "$\\mathbf{a}^{[1]}$, $128$ coordonnées"],
      ["Deuxième niveau", "Des motifs : boucles, barres, obliques", "Une seconde couche cachée"],
      ["Sortie", "Des chiffres, combinaisons de motifs", "$\\mathbf{a}^{[L]}$, $10$ coordonnées"],
    ],
    legende:
      "L'espoir n'est pas gratuit : la page 5 a **construit** un détecteur de bord à la main, en trois lignes, et ce qu'il suppose est donc possible. Reste à savoir si c'est ce qui a été trouvé.\n\nLe réseau mesuré n'a qu'une couche cachée, si bien que la mesure ne peut trancher que la ligne « Premier niveau » : c'est elle qui porte la détection de bords, et c'est elle qu'on va regarder.",
  },
  {
    id: "b-r11-7",
    type: "texte",
    texte:
      "Deux raisons de plus rendent cet espoir raisonnable. D'abord, détecter des bords sert à **d'autres** tâches d'image que la lecture de chiffres, si bien qu'une couche qui les détecterait serait réutilisable, ce qui est le propre d'une bonne représentation.\n\nEnsuite, le même découpage en niveaux s'observe ailleurs, la parole se décomposant en sons, puis en syllabes, puis en mots, et l'idée qu'un système d'apprentissage retrouve spontanément une telle hiérarchie a de quoi séduire.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.2 · La mesure
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r11-8",
    type: "titre",
    niveau: 2,
    texte: "Ce que la mesure dit",
  },
  {
    id: "b-r11-9",
    type: "texte",
    texte:
      "$W^{[1]}$ a $128$ lignes de $784$ coefficients. Chacune se replie en gabarit par $\\mathrm{vec}^{-1}$, exactement comme à la page 4 : on peut donc **regarder** ce que chaque neurone caché cherche, au lieu de le supposer.",
  },
  {
    id: "b-r11-10",
    type: "sortie",
    ancre: "gabarits-caches",
    titre:
      "Quatre gabarits cachés · cours/lecon2/mesures.py, section 7",
    texte:
      "      j       max        position       min        position\n      66       +0.5306   (10, 18)      -0.5128   ( 7, 17)\n      5        +0.3662   (16, 12)      -0.4551   (20, 11)\n      114      +0.3251   (12, 21)      -0.3449   (17, 15)\n      81       +0.2671   (17, 14)      -0.5621   (19, 16)",
    lecture: [
      "Les amplitudes sont **nettement plus faibles** que celles des gabarits de classe de la page 4, qui allaient de $-1{,}59$ à $+1{,}54$ : les quatre lignes affichées ne vont que de $-0{,}5621$ à $+0{,}5306$, soit à peu près le tiers. Un neurone caché ne tranche pas, il pousse un peu.",
      "Ces quatre lignes sont les quatre premières que le programme affiche, et non celles dont la mesure parlera plus bas.",
      "Le maximum et le minimum sont souvent proches l'un de l'autre, trois lignes d'écart pour $j=66$, ce qui ressemble localement à un contraste. C'est ce qui rend la question intéressante, et c'est pourquoi elle demande une mesure et non un coup d'œil.",
    ],
  },
  {
    id: "b-r11-11",
    type: "titre",
    niveau: 3,
    texte: "Ressembler, mesuré",
  },
  {
    id: "b-r11-12",
    type: "formule",
    ancre: "correlation",
    latex:
      "\\langle\\mathbf{u},\\mathbf{v}\\rangle=\\sum_{i=1}^{m}u_{i}v_{i},\\qquad \\|\\mathbf{u}\\|=\\sqrt{\\langle\\mathbf{u},\\mathbf{u}\\rangle},\\qquad \\rho(\\mathbf{u},\\mathbf{v})=\\frac{\\langle\\mathbf{u}-\\bar{u}\\mathbf{1}_{m},\\ \\mathbf{v}-\\bar{v}\\mathbf{1}_{m}\\rangle}{\\|\\mathbf{u}-\\bar{u}\\mathbf{1}_{m}\\|\\ \\|\\mathbf{v}-\\bar{v}\\mathbf{1}_{m}\\|}",
    alt: "Le produit scalaire canonique de u et v est la somme pour i de un à m des produits u i par v i. La norme euclidienne de u est la racine carrée du produit scalaire de u par lui-même. Le coefficient de corrélation rho de u et v est le produit scalaire de u moins sa moyenne fois le vecteur de uns, par v moins sa moyenne fois le vecteur de uns, divisé par le produit des normes de ces deux mêmes vecteurs centrés.",
    numero: "11.1",
    legende:
      "$\\rho:(\\mathbb{R}^{m}\\setminus\\mathbb{R}\\mathbf{1}_{m})^{2}\\rightarrow[-1,1]$, où $\\mathbf{1}_{m}$ est le vecteur dont les $m$ coordonnées valent $1$ et où $\\mathbb{R}\\mathbf{1}_{m}$ désigne tous ses multiples, c'est-à-dire les vecteurs constants. Le domaine les **exclut**, leur écart-type étant nul et le quotient n'étant alors pas défini, et le programme vérifie qu'aucun gabarit du modèle n'est constant au lieu de le supposer.\n\nIci $\\bar{u}$ est la moyenne des $m$ coordonnées de $\\mathbf{u}$, et $\\langle\\cdot,\\cdot\\rangle$ le produit scalaire usuel. Retrancher la moyenne puis diviser par la norme est exactement ce qui rend $\\rho$ insensible à l'échelle et au décalage : deux images de mêmes formes mais de contrastes différents obtiennent $1$.",
  },
  {
    id: "b-r11-13",
    type: "texte",
    texte:
      "$\\rho$ vaut $1$ pour deux images identiques à une échelle et un décalage près, et $0$ pour deux images sans rapport, mais une valeur intermédiaire comme $0{,}43$ ne veut rien dire tant qu'on n'a rien à quoi la comparer. Le programme fabrique donc la **référence** qui manque, en mesurant combien deux détecteurs de bord authentiques de la même famille se ressemblent entre eux.",
  },
  {
    id: "b-r11-14",
    type: "sortie",
    ancre: "correlations",
    titre:
      "L'espoir, tranché des deux côtés · cours/lecon2/mesures.py, section 7",
    texte:
      "      correlation maximale en valeur absolue   0.4894\n      atteinte entre le gabarit cache j = 54 et le gabarit de classe 7\n      moyenne des |rho| sur les 1 280 couples  0.0853\n      couples au-dessus de 0,5                 0 sur 1 280\n\n      famille de detecteurs de bord construits a la main   168\n      correlation maximale gabarit cache / detecteur   0.4275\n      atteinte par le gabarit cache j = 101\n      moyenne des |rho| sur les 21504 couples        0.0593\n      gabarits caches ayant un |rho| > 0,5 avec un detecteur   0 sur 128\n      Pour reference, la correlation d'un detecteur de bord avec un\n      detecteur voisin de la meme famille vaut :\n        maximum entre deux detecteurs distincts       0.7864",
    lecture: [
      "**Contre les gabarits de chiffres.** Le meilleur des $1\\,280$ couples atteint $0{,}4894$ pour une moyenne de $0{,}0853$, et le programme compte combien dépassent $0{,}5$, une demi-corrélation prise comme repère commode : il n'y en a aucun.",
      "**Contre les détecteurs de bord.** Le programme construit $168$ détecteurs à la main sur le modèle de la page 5, à diverses positions de la grille et dans les deux orientations. Le meilleur des $21\\,504$ couples atteint $0{,}4275$ pour une moyenne de $0{,}0593$, et **aucun** gabarit caché ne dépasse $0{,}5$ avec aucun détecteur.",
      "**La référence.** Deux détecteurs **distincts** de cette même famille se corrèlent jusqu'à $0{,}7864$ entre eux. C'est l'échelle : sur ce barème, un vrai détecteur de bord reconnaît ses voisins à $0{,}79$, et le meilleur gabarit caché n'en reconnaît aucun au-delà de $0{,}43$.",
      "**La réponse est non.** Les neurones cachés ne détectent ni des chiffres, ni des bords au sens où la page 5 en a construit un.",
    ],
  },
  {
    id: "b-r11-16",
    type: "encart",
    ton: "attention",
    titre: "Ce que cette mesure ne dit pas",
    texte:
      "Elle ne dit pas que le réseau ne marche pas : il marche, $0{,}9814$, quatre fois moins d'erreurs que le meilleur modèle sans $\\mathrm{ReLU}$. Elle ne dit pas non plus que la couche cachée ne sert à rien : elle sert, et beaucoup. Elle dit que **ce qu'elle a trouvé n'est pas ce qu'on avait espéré**, et qu'aucune inspection ne l'aurait deviné. C'est précisément la raison de regarder plutôt que de supposer, invoquée à la page 10 contre le traitement en boîte noire.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.3 · Les quatre modèles
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r11-17",
    type: "titre",
    niveau: 2,
    texte: "Les quatre modèles",
  },
  {
    id: "b-r11-18",
    type: "sortie",
    ancre: "quatre-modeles",
    titre:
      "Le tableau complet · cours/lecon2/mesures.py, section 10",
    texte:
      "    modele                                 activation  parametres   acc_test   erreurs\n    1  784 -> 10                           aucune           7850     0.9193       807\n    2  784 -> 128 -> 10                    aucune         101770     0.9256       744\n    3  784 -> 128 -> 10                    ReLU           101770     0.9814       186\n    4  784 -> 16 -> 16 -> 10               ReLU            13002     0.9437       563\n\n    de 1 a 2 : 807 -> 744 erreurs, pour 93920 parametres de plus\n              soit +0.63 point\n    de 2 a 3 : 744 -> 186 erreurs, a nombre de parametres IDENTIQUE\n              soit +5.58 points, erreurs divisees par 4.0",
    lecture: [
      "**De 1 à 2** : $93\\,920$ paramètres de plus achètent $63$ erreurs de moins. La proposition 3 dit pourquoi : la famille est la même.",
      "**De 2 à 3** : à nombre de paramètres **identique**, une fonction qui n'en coûte aucun fait tomber les erreurs de $744$ à $186$. Ce ne sont pas les paramètres qui achètent la performance, c'est la non-linéarité.",
      "**Le modèle 4**, $784\\rightarrow 16\\rightarrow 16\\rightarrow 10$, atteint $0{,}9437$ et fait $563$ erreurs avec $13\\,002$ paramètres, en regard de $0{,}9814$ et $186$ erreurs pour les $101\\,770$ du modèle 3.",
    ],
  },
  {
    id: "b-r11-fig15",
    type: "image",
    ancre: "quatre-modeles-figure",
    src: "/cours/lecon2/l2-fig15-quatre-modeles.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Quatre barres horizontales, une par modèle, de longueur proportionnelle au nombre d'erreurs de test sur dix mille. Modèle 1, sept cent quatre-vingt-quatre vers dix, sans activation, sept mille huit cent cinquante paramètres : huit cent sept erreurs. Modèle 2, sept cent quatre-vingt-quatre vers cent vingt-huit vers dix, sans activation, cent un mille sept cent soixante-dix paramètres : sept cent quarante-quatre erreurs. Modèle 3, même architecture avec ReLU, mêmes cent un mille sept cent soixante-dix paramètres, barre en brique bien plus courte : cent quatre-vingt-six erreurs. Modèle 4, sept cent quatre-vingt-quatre vers seize vers seize vers dix avec ReLU, treize mille deux paramètres : cinq cent soixante-trois erreurs. Une bande grise groupe les modèles 2 et 3, qui ont le même nombre de paramètres.",
    legende:
      "À nombre de paramètres identique, du modèle 2 au modèle 3, c'est la non-linéarité qui divise les erreurs par quatre, et non les paramètres.",
  },
  {
    id: "b-r11-19",
    type: "texte",
    texte:
      "Le tableau constate la chute de $744$ à $186$ sans l'expliquer, et c'est la mesure de la page 7 qui l'éclaire. Sur $4\\,250$ paires dont les deux extrémités sont classées dans la même classe, le modèle sans activation classe le milieu ailleurs **$0$ fois**, quand le réseau à ReLU le fait **$69$ fois sur $4\\,816$**.\n\nLe premier n'a donc aucune liberté de décision entre deux images d'une même classe, et le second en a une. C'est cette liberté, et non les paramètres qui sont en nombre identique, qui sépare les deux modèles ; combien des $558$ erreurs évitées viennent d'elle, la mesure ne le dit pas.",
  },
  {
    id: "b-r11-20",
    type: "encart",
    ton: "attention",
    titre: "Ce que le modèle 4 ne prouve pas",
    texte:
      "Les deux comptes sont au tableau, et rien ne s'en déduit sur l'architecture $784\\rightarrow 16\\rightarrow 16\\rightarrow 10$, qui est celle de la série dont ce chapitre suit l'ordre. On ne dispose ici d'aucun élément permettant de dire pourquoi elle a été retenue, et on n'en conjecture aucun : elle est mesurée parce qu'elle est répandue, non parce qu'elle serait justifiée.\n\nMettre $13\\,002$ paramètres en regard de $101\\,770$ ne fait pas une comparaison valable, puisque à nombre de paramètres inégal l'écart de $563$ à $186$ erreurs ne départage ni la largeur, ni la profondeur, ni l'entraînement. **Dette, chapitre 3.**",
  },
  {
    id: "b-r11-21",
    type: "verification",
    numero: 20,
    enonce: "Le tableau des quatre modèles se lit sans commentaire.",
    questions: [
      "Deux changements séparent le modèle 1 du modèle 3 : plus de paramètres, et une non-linéarité. Lequel des deux produit l'écart ?",
      "Citer les deux nombres qui le prouvent, et dire pourquoi ce sont ceux-là et pas d'autres.",
      "Le modèle 4 a moins de paramètres que le modèle 2 et fait moins d'erreurs. Cela contredit-il la lecture précédente ?",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.4 · Les erreurs, une par une
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r11-22",
    type: "titre",
    niveau: 2,
    texte: "Les $186$ erreurs, regardées",
  },
  {
    id: "b-r11-23",
    type: "sortie",
    ancre: "erreurs",
    titre: "Ce que le réseau rate · cours/lecon2/mesures.py, section 7",
    texte:
      "      erreurs                                  186 sur 10 000\n      erreurs avec probabilite > 0,99          30\n      erreurs avec probabilite > 0,90          87\n      probabilite mediane des erreurs          0.8755\n\n      LES SIX ERREURS LES PLUS CONFIANTES\n        indice   verite   predit   probabilite\n          3520        6        4        1.0000\n          1112        4        6        1.0000\n           247        4        2        1.0000\n          1226        7        2        0.9999\n           445        6        0        0.9999\n          4497        8        7        0.9999\n\n      LES SIX CONFUSIONS LES PLUS FREQUENTES\n        vrai 5 lu 3 : 8 fois\n        vrai 7 lu 2 : 8 fois\n        vrai 4 lu 9 : 8 fois\n        vrai 7 lu 9 : 8 fois\n        vrai 2 lu 8 : 7 fois\n        vrai 3 lu 9 : 7 fois",
    lecture: [
      "**$30$ erreurs sur $186$ sont commises avec une probabilité supérieure à $0{,}99$**, la probabilité médiane d'une erreur valant $0{,}8755$ : le réseau ne dit pas qu'il hésite, il se trompe en étant certain. La probabilité dont il s'agit est celle de la classe qu'il a prédite, la plus grande coordonnée de $\\mathbf{a}$.",
      "La sortie $\\mathbf{a}\\in\\Delta^{\\circ}_{9}$ ressemble à une confiance et n'en est pas une. Rien dans ce chapitre n'a demandé qu'elle en soit une : $\\mathrm{softmax}$ ramène des scores à une somme de un sans rien promettre sur leur valeur, et rien n'oblige une sortie de $0{,}99$ à se tromper une fois sur cent.",
      "Les confusions les plus fréquentes sont celles qu'un œil humain comprend : $4$ lu $9$, $5$ lu $3$, $7$ lu $9$. Ce sont des chiffres dont les tracés se ressemblent, et non des erreurs arbitraires.",
    ],
  },
];
