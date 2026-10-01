import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 2 · Le problème, et le jeu
//
// Aucune notion de modèle n'apparaît sur cette page. Elle pose les objets du
// jeu, rappelle les trois notations d'indice, compte ce que le jeu contient,
// fixe le seuil sous lequel un résultat ne veut rien dire, et vérifie par la
// mesure que le prétraitement annoncé a bien été fait.
//
// Tous les chiffres sortent de cours/lecon2/mesures.py, sections 1 et 2.
// ─────────────────────────────────────────────────────────────────────────────

export const P02_JEU: Bloc[] = [
  {
    id: "b-r2-1",
    type: "texte",
    texte:
      "Ton œil lit un chiffre manuscrit sans effort, et personne ne sait écrire la règle qu'il applique. Lister les cas un par un ne la remplace pas, parce qu'il y a trop de façons d'écrire un sept, et c'est pourquoi on va chercher cette règle dans des exemples. Reste à savoir combien il y en a, à quoi ils ressemblent, et à partir de quel score une machine aura vraiment appris plutôt que deviné.",
  },
  {
    id: "b-r2-10f",
    type: "image",
    ancre: "planche-du-jeu",
    src: "/cours/lecon2/l2-fig01-planche.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Douze images du jeu de test, rangées en deux lignes de six et prises dans l'ordre du fichier. Chacune est un chiffre manuscrit gris et noir sur fond blanc, dans une vignette carrée, et porte sous elle son indice à gauche et le chiffre écrit à droite : l'image numéro zéro est un sept, la numéro un un deux, la deux un un, la trois un zéro, la quatre un quatre, la cinq un un, la six un quatre, la sept un neuf, la huit un cinq, la neuf un neuf, la dix un zéro, la onze un six. Les traits sont épais, noirs en leur milieu et gris sur leurs bords, et deux images d'un même chiffre n'ont ni la même inclinaison ni la même épaisseur.",
    legende:
      "Le programme les prend dans l'ordre du fichier, sans en choisir aucune.",
  },
  {
    id: "b-r2-1f-lecture",
    type: "texte",
    texte:
      "Sous chaque vignette se lisent son numéro dans le fichier, à gauche, et le chiffre qu'elle montre, à droite : la première est l'image numéro 0, et c'est un 7.\n\nLes deux 1, en troisième et sixième position de la première rangée, n'ont ni la même inclinaison ni la même épaisseur, et aucun programme ne les reconnaîtra en comparant les pixels un par un à un 1 modèle.\n\nDans chaque carré, enfin, le chiffre est posé à peu près au milieu, et ce « à peu près » se mesure exactement.",
  },

  {
    id: "b-r2-1-lumiere",
    type: "animation",
    ancre: "lumiere-traverse",
    animationId: "la-lumiere-traverse",
    legende:
      "Trois images, trois réponses. Rien n'est expliqué ici, et c'est voulu : le chapitre commence par constater que la machine répond, puis passe onze pages à dire pourquoi.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.1 · Le problème
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r2-4",
    type: "titre",
    niveau: 2,
    texte: "Les objets",
  },
  {
    id: "b-r2-5",
    type: "formule",
    ancre: "espaces",
    latex:
      "\\mathcal{X}=[0,1]^{28\\times 28},\\qquad \\mathcal{Y}=[\\![0,9]\\!]",
    alt: "L'espace des entrées grand X calligraphique est l'ensemble des matrices vingt-huit par vingt-huit à coefficients dans l'intervalle de zéro à un. L'espace des étiquettes grand Y calligraphique est l'ensemble des entiers de zéro à neuf.",
    numero: "2.1",
    legende:
      "$\\mathcal{X}$ est un ensemble de **matrices**, pas de vecteurs, puisque la mise en forme n'a pas encore eu lieu, et $\\mathcal{Y}$ est un ensemble **fini**. Le fichier, lui, donne un octet par pixel, entre $0$ et $255$, et les coefficients d'une image en sont le quotient par $255$.",
  },
  {
    id: "b-r2-6",
    type: "tableau",
    ancre: "objets-jeu",
    titre: "Les objets du jeu, typés",
    cleEnTete: true,
    entetes: ["Symbole", "Type", "Ensemble", "Rôle"],
    lignes: [
      ["$N_{\\text{train}}$", "Scalaire entier", "$\\mathbb{N}^{*}$", "$60\\,000$, la taille du jeu d'entraînement"],
      ["$N_{\\text{test}}$", "Scalaire entier", "$\\mathbb{N}^{*}$", "$10\\,000$, la taille du jeu de test"],
      ["$n$", "Indice", "$[\\![1,N_{\\text{train}}]\\!]$ ou $[\\![1,N_{\\text{test}}]\\!]$ selon le jeu", "Désigne un exemple. Ce n'est pas une quantité"],
      ["$X^{(n)}$", "Matrice", "$\\mathcal{X}$", "L'image du $n$-ième exemple, $28\\times 28$"],
      ["$c^{(n)}$", "Scalaire entier", "$\\mathcal{Y}$", "L'étiquette du $n$-ième exemple"],
      ["$\\mathcal{D}_{\\text{train}}$", "Ensemble de couples", "$\\subseteq\\mathcal{X}\\times\\mathcal{Y}$", "$\\{(X^{(n)},c^{(n)})\\}_{n=1}^{60\\,000}$"],
      ["$\\mathcal{D}_{\\text{test}}$", "Ensemble de couples", "$\\subseteq\\mathcal{X}\\times\\mathcal{Y}$", "$\\{(X^{(n)},c^{(n)})\\}_{n=1}^{10\\,000}$, jamais vues à l'entraînement"],
    ],
    legende:
      "Le fichier numérote ses images à partir de $0$ et le cours indexe ses exemples à partir de $1$ : ce que le programme appelle l'image n°$0$ est l'exemple $n=1$.",
  },
  {
    id: "b-r2-7",
    type: "encart",
    ton: "rappel",
    titre: "$c^{(n)}$ est un code",
    texte:
      "Les étiquettes sont des entiers, mais aucune opération arithmétique n'a de sens sur elles : $7-3=4$ ne dit rien, et « la classe moyenne » n'existe pas. Elles nomment sans mesurer, ce que le chapitre 1 a établi, et c'est pour cela que la page 6 mettra un autre codage à leur place.",
  },
  {
    id: "b-r2-8",
    type: "titre",
    niveau: 3,
    texte: "Les trois notations d'indice",
  },
  {
    id: "b-r2-9",
    type: "tableau",
    ancre: "trois-indices",
    cleEnTete: true,
    entetes: ["Écriture", "Ce qu'elle désigne", "Ce qu'elle n'est pas"],
    lignes: [
      ["$X^{(n)}$, $\\mathbf{x}^{(n)}$", "Le $n$-ième **exemple** du jeu, en grille puis en colonne", "Une puissance"],
      ["$W^{[l]}$", "L'**étape de calcul** numéro $l$, à partir de la page 8", "Ni une puissance, ni un numéro d'exemple"],
      ["$x_{k}$", "La $k$-ième **composante** d'un vecteur", "Un exemple ni une étape de calcul"],
    ],
    legende:
      "Les trois cohabitent dans une même formule à partir de la page 10, et les parenthèses, les crochets et l'indice bas y sont trois marques distinctes, jamais interchangeables. Sur une matrice, l'indice bas double $X_{ij}$ désigne la ligne et la colonne.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.2 · Ce que le jeu contient
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r2-10",
    type: "titre",
    niveau: 2,
    texte: "Ce que le jeu contient",
  },
  {
    id: "b-r2-10b",
    type: "texte",
    texte:
      "Le plus paresseux des systèmes ne regarde pas l'image et répond toujours le chiffre le plus fréquent du jeu. Ce qu'il obtient est le seuil sous lequel un score ne veut rien dire, et il se calcule en comptant les classes. Le programme l'appelle le seuil du hasard **instruit**, instruit parce que ce système sait au moins quel chiffre revient le plus souvent.",
  },
  {
    id: "b-r2-11",
    type: "sortie",
    ancre: "repartition",
    titre: "La répartition des classes · cours/lecon2/mesures.py, section 1",
    texte:
      "    repartition    chiffre :      0      1      2      3      4      5      6      7      8      9\n                   train   :   5923   6742   5958   6131   5842   5421   5918   6265   5851   5949   total 60000\n                   test    :    980   1135   1032   1010    982    892    958   1028    974   1009   total 10000\n\n    classe la plus frequente au test        1  (1135 images)\n    SEUIL DU HASARD INSTRUIT                11.35 %",
    lecture: [
      "Les classes ne sont pas équilibrées : le $1$ est le chiffre le plus fréquent et le $5$ le moins fréquent, et l'écart entre les deux vaut à l'entraînement $24\\,\\%$ du plus petit des deux comptes.",
      "Un modèle qui répondrait **toujours $1$**, sans regarder l'image, tomberait juste $1\\,135$ fois sur $10\\,000$, soit $11{,}35\\,\\%$ de bonnes réponses.",
      "C'est donc le **seuil** : sous $11{,}35\\,\\%$, un résultat ne signifie rien, et à peine au-dessus il ne signifie presque rien. Tout score de ce chapitre se lit contre cette barre.",
    ],
  },
  {
    id: "b-r2-13",
    type: "sortie",
    ancre: "statistiques-pixels",
    titre: "Ce que valent les pixels",
    texte:
      "    part des valeurs nulles (train)         80.88 %\n    valeur moyenne d'un pixel (train)       0.130660\n    pixels nuls sur les 60 000 images       67 sur 784",
    lecture: [
      "Quatre pixels sur cinq sont **exactement** nuls, une image de chiffre étant surtout du blanc, et la page 4 montrera que ce blanc ne pèse sur aucun score. Ce compte porte sur tous les pixels de toutes les images pris ensemble.",
      "La ligne suivante compte autre chose : $67$ pixels sur $784$ sont nuls **sur les $60\\,000$ images à la fois**, et ce sont les pixels du pourtour de la grille, où aucune encre n'apparaît jamais. Les nombres qu'un modèle leur attachera ne pourront donc rien apprendre, et il y en aura $10\\times 67=670$ à la page 6, un par pixel mort et par chiffre possible.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.3 · Le prétraitement
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r2-14",
    type: "titre",
    niveau: 2,
    texte: "Vérifier que les images sont centrées, et sur quoi",
  },
  {
    id: "b-r2-15",
    type: "texte",
    texte:
      "Ce « à peu près au milieu » relevé sur la planche des douze images n'est pas un hasard, puisque les auteurs du jeu ont recadré les 70 000 images avant de les publier.\n\nDeux questions se posent alors, et elles se mesurent l'une comme l'autre. Ont-ils recadré les 60 000 images d'entraînement, ou seulement quelques-unes ? Et « au milieu », c'est au milieu de quoi exactement ?\n\nLes lignes et les colonnes se comptent de 1 à 28 dans tout le chapitre, la ligne 1 en haut et la colonne 1 à gauche.",
  },
  {
    id: "b-r2-15b",
    type: "titre",
    niveau: 3,
    texte: "Ce qu'on appelle le milieu d'une image",
  },
  {
    id: "b-r2-16",
    type: "texte",
    texte:
      "Ce qu'on appelle le milieu d'une image est son **centre de masse**, c'est-à-dire l'endroit où son encre se concentre, et il se calcule en deux fois, puisqu'une position dans la grille demande deux nombres.\n\nD'abord la ligne. Chaque pixel se trouve sur une ligne $i$ et porte une quantité d'encre $X_{ij}$ comprise entre 0 et 1, et l'on fait la moyenne des numéros de ligne en comptant chaque pixel autant qu'il porte d'encre. Un pixel blanc ne compte donc pas du tout, quand un pixel noir compte pour un.\n\nLa colonne se traite de la même façon, et le centre de masse est le couple formé par les deux moyennes.",
  },
  {
    id: "b-r2-16d",
    type: "formule",
    ancre: "centre-de-masse-formule",
    latex:
      "\\Big(\\ \\frac{\\sum_{ij} X_{ij}\\,i}{\\sum_{ij} X_{ij}}\\ ,\\ \\frac{\\sum_{ij} X_{ij}\\,j}{\\sum_{ij} X_{ij}}\\ \\Big)",
    alt: "Le couple formé, d'une part, de la somme sur i et j des X i j fois i, divisée par la somme des X i j, et d'autre part de la somme sur i et j des X i j fois j, divisée par la même somme des X i j.",
    numero: "2.2",
    legende:
      "Les deux composantes se calculent séparément, avec le même dénominateur. Ce dénominateur est la quantité totale d'encre de l'image.",
  },
  {
    id: "b-r2-16b",
    type: "titre",
    niveau: 3,
    texte: "Où tombe le milieu géométrique",
  },
  {
    id: "b-r2-16c",
    type: "texte",
    texte:
      "Le milieu géométrique de la grille vaut $(14{,}5\\ ;\\ 14{,}5)$, et il ne tombe sur aucun pixel, parce que 28 est un nombre pair. C'est de lui que la mesure va écarter le jeu.",
  },
  {
    id: "b-r2-17",
    type: "sortie",
    ancre: "centre-de-masse",
    titre:
      "Le centre de masse moyen des $60\\,000$ images · cours/lecon2/mesures.py, section 1",
    texte:
      "    CENTRE DE MASSE DES 60 000 IMAGES, en indices 1 a 28\n                                              ligne     colonne\n      centre de masse moyen                  14.9959     15.0068\n      ecart-type entre images                 0.2892      0.2909\n\n      ecart au milieu geometrique, 14,5      +0.4959     +0.5068\n      distance                                0.7091 pixel\n\n      ecart a l'indice 15                    -0.0041     +0.0068\n      distance                                0.0080 pixel\n\n      rapport des deux ecarts                   89.1",
    lecture: [
      "**Le jeu est centré sur l'indice $15$, et pas sur le milieu de la grille.** L'écart au milieu géométrique vaut $0{,}7091$ pixel quand l'écart à l'indice $15$ n'en vaut que $0{,}0080$, soit un rapport de $89$ calculé avant tout arrondi d'affichage : l'indice $15$ n'est pas un peu meilleur, il l'est de deux ordres de grandeur.",
      "Cet écart au milieu géométrique n'est pas du bruit, puisqu'il vaut un demi-pixel sur chaque axe et qu'il va toujours vers le bas et vers la droite, alors que l'écart-type entre images ne vaut que $0{,}29$ pixel.",
      "Une grille de côté pair n'a pas de pixel central, si bien que les auteurs du jeu ont dû en choisir un, et ils ont choisi le $15$. **« Centré » ne veut rien dire tant qu'on n'a pas dit « centré sur quoi ».**",
      "Un écart-type de $0{,}29$ pixel signifie que les images s'écartent très peu de cette moyenne, et non que des images très décentrées se compensent entre elles : elles sont donc recadrées **une par une**, et ce chapitre n'a rien à recadrer.",
      "Cela comptera page 4, où l'on verra qu'un même chiffre décalé de quelques colonnes change tout le calcul d'un modèle.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2.4 · Une image, en entier
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r2-19",
    type: "titre",
    niveau: 2,
    texte: "Une image, en entier",
  },
  {
    id: "b-r2-20",
    type: "texte",
    texte:
      "Voici la première image du jeu de test, telle qu'elle est dans le fichier : $784$ octets, un par pixel, rangés en $28$ lignes de $28$. Le point remplace le zéro pour que la forme se voie.",
  },
  {
    id: "b-r2-21",
    type: "sortie",
    ancre: "image-zero",
    titre: "L'image de test n°0, en octets · cours/lecon2/mesures.py, section 2",
    texte:
      "           1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28\n       1   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       2   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       3   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       4   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       5   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       6   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       7   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       8   .   .   .   .   .   .  84 185 159 151  60  36   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n       9   .   .   .   .   .   . 222 254 254 254 254 241 198 198 198 198 198 198 198 198 170  52   .   .   .   .   .   .\n      10   .   .   .   .   .   .  67 114  72 114 163 227 254 225 254 254 254 250 229 254 254 140   .   .   .   .   .   .\n      11   .   .   .   .   .   .   .   .   .   .   .  17  66  14  67  67  67  59  21 236 254 106   .   .   .   .   .   .\n      12   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .  83 253 209  18   .   .   .   .   .   .\n      13   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .  22 233 255  83   .   .   .   .   .   .   .\n      14   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   . 129 254 238  44   .   .   .   .   .   .   .\n      15   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .  59 249 254  62   .   .   .   .   .   .   .   .\n      16   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   . 133 254 187   5   .   .   .   .   .   .   .   .\n      17   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   9 205 248  58   .   .   .   .   .   .   .   .   .\n      18   .   .   .   .   .   .   .   .   .   .   .   .   .   .   . 126 254 182   .   .   .   .   .   .   .   .   .   .\n      19   .   .   .   .   .   .   .   .   .   .   .   .   .   .  75 251 240  57   .   .   .   .   .   .   .   .   .   .\n      20   .   .   .   .   .   .   .   .   .   .   .   .   .  19 221 254 166   .   .   .   .   .   .   .   .   .   .   .\n      21   .   .   .   .   .   .   .   .   .   .   .   .   3 203 254 219  35   .   .   .   .   .   .   .   .   .   .   .\n      22   .   .   .   .   .   .   .   .   .   .   .   .  38 254 254  77   .   .   .   .   .   .   .   .   .   .   .   .\n      23   .   .   .   .   .   .   .   .   .   .   .  31 224 254 115   1   .   .   .   .   .   .   .   .   .   .   .   .\n      24   .   .   .   .   .   .   .   .   .   .   . 133 254 254  52   .   .   .   .   .   .   .   .   .   .   .   .   .\n      25   .   .   .   .   .   .   .   .   .   .  61 242 254 254  52   .   .   .   .   .   .   .   .   .   .   .   .   .\n      26   .   .   .   .   .   .   .   .   .   . 121 254 254 219  40   .   .   .   .   .   .   .   .   .   .   .   .   .\n      27   .   .   .   .   .   .   .   .   .   . 121 254 207  18   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n      28   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .\n\n    etiquette                               7\n    pixels non nuls                         116 sur 784\n    somme des octets                        18454\n    lignes encrees                          8 a 27\n    octet maximal                           255  en (13, 20),  1 pixel a cette valeur",
    lecture: [
      "La barre horizontale du $7$ occupe les lignes $8$ à $11$, colonnes $7$ à $22$. La hampe oblique descend ensuite de la ligne $11$ à la ligne $27$.",
      "$116$ pixels non nuls sur $784$ : $14{,}8\\,\\%$ de l'image porte de l'encre, sensiblement moins que la moyenne du jeu, où c'est à peu près un pixel sur cinq.",
      "Un seul pixel atteint $255$, en $(13,20)$. L'écriture manuscrite numérisée est **grise** presque partout : $84$, $185$, $159$, $151$, $60$, $36$ à la ligne $8$.",
    ],
  },
  {
    id: "b-r2-21f",
    type: "image",
    ancre: "grille-des-784-ronds",
    src: "/cours/lecon2/l2-fig02-grille.svg",
    largeur: 1380,
    hauteur: 1024,
    alt: "Une grille de vingt-huit lignes sur vingt-huit colonnes, sept cent quatre-vingt-quatre ronds en tout, un par pixel. Chaque rond est rempli d'un gris d'autant plus sombre que l'octet du pixel est grand : le papier reste blanc, l'encre pleine est presque noire. Les ronds sombres dessinent un sept, dont la barre horizontale occupe les lignes huit à onze et dont la hampe oblique descend vers la gauche jusqu'à la ligne vingt-sept ; tout le pourtour de la grille reste vide. Trois ronds sont cerclés de brique : ligne neuf colonne sept, ligne neuf colonne huit, et ligne treize colonne vingt. Un panneau à droite donne l'étiquette sept, cent seize pixels non nuls sur sept cent quatre-vingt-quatre, une somme des octets de dix-huit mille quatre cent cinquante-quatre, et des lignes encrées de huit à vingt-sept ; sous lui, une bande dégradée va du blanc au noir, cotée zéro d'un côté et deux cent cinquante-cinq de l'autre, papier puis encre. Sous la grille, les trois ronds cerclés sont repris par leur ligne et leur colonne : ligne neuf colonne sept, d'octet deux cent vingt-deux et de valeur zéro virgule huit sept zéro cinq huit huit ; ligne neuf colonne huit, d'octet deux cent cinquante-quatre et de valeur zéro virgule neuf neuf six zéro sept huit ; ligne treize colonne vingt, d'octet deux cent cinquante-cinq et de valeur un.",
    legende:
      "La figure dessine les sept cent quatre-vingt-quatre ronds, sans en omettre un. Un pixel blanc est une donnée au même titre qu'un pixel noir.",
  },
  {
    id: "b-r2-21f-lecture",
    type: "texte",
    texte:
      "Un rond par pixel, et aucun ne manque, pas même les blancs : un pixel blanc est une donnée au même titre qu'un pixel noir, et c'est pour cela que la figure les dessine tous.\n\nSous les trois ronds cerclés de brique se lit le passage de l'octet à la valeur : $222$ donne $0{,}870588$, et $255$ donne $1$. C'est la division par $255$ annoncée plus haut, faite sur trois pixels de cette image.\n\nLe pourtour de la grille, enfin, reste vide sur ses sept premières lignes comme sur ses six premières colonnes, et l'encre tient dans un rectangle au milieu. Ce rectangle est propre à cette image : les 67 pixels comptés plus haut sont, eux, ceux qu'aucune des 60 000 images n'encre jamais.",
  },
  {
    id: "b-r2-22",
    type: "verification",
    numero: 8,
    enonce:
      "Le contenu du jeu se lit dans le tableau de répartition ci-dessus. Les vérifications portent un numéro propre sur tout le parcours, les sept premières étant au chapitre 1. Ces numéros ne suivent pas l'ordre des pages, et il est normal d'en rencontrer un plus grand avant un plus petit.",
    questions: [
      "Combien d'images du chiffre $5$ le jeu d'entraînement contient-il, et quelle part du total cela représente-t-il ?",
      "Pourquoi le seuil de $11{,}35\\,\\%$ est-il celui du chiffre $1$, et non celui d'un autre chiffre ?",
      "Ce seuil serait-il le même si on le calculait sur le jeu d'entraînement ? Le vérifier avec les nombres du tableau.",
    ],
  },
];
