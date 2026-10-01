import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 8 · Descendre, en dimension quelconque
//
// La page la plus dense, et celle qui porte le plus de figures : quatre. Elle
// définit dérivée partielle, gradient et dérivée directionnelle, ÉNONCE la
// proposition 3 sans la démontrer -- la dette est posée avec le nom des deux
// outils manquants -- et la VÉRIFIE numériquement sur le réseau réel.
//
// ÉCART N°2 : la source écrit le gradient avec un nabla. Ce cours écrit
// grad_theta C, sans exception, et le symbole nabla n'apparaît nulle part.
//
// ÉCART N°3 : la source dit qu'il existe un moyen de calculer ce vecteur, et
// passe. Ce cours en donne un -- les différences finies centrées -- l'emploie
// réellement pour toutes ses mesures, PUIS chiffre pourquoi il est
// inutilisable. C'est ce chiffre qui ouvre le chapitre 4.
//
// La dette « eta » du chapitre 2 est réglée ici.
// Tous les nombres sortent de cours/lecon3/mesures.py, mesures 3, 7, 8 et 9.
// ─────────────────────────────────────────────────────────────────────────────

export const D08_GRADIENT: Bloc[] = [
  {
    id: "b-d8-0",
    type: "texte",
    texte:
      "Sur une courbe, il n'y a que deux sens : la gauche et la droite. Dans un espace à cent mille dimensions, par où descend-on ?",
  },
  {
    id: "b-d8-fig16",
    type: "image",
    ancre: "cent-directions",
    src: "/cours/lecon3/l3-fig16-cent-directions.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Une barre horizontale en brique traverse presque toute la largeur ; elle porte à gauche la mention le gradient et à droite sa valeur. Sous elle, une seconde barre grise, si courte qu'elle n'est qu'un trait, porte la mention la meilleure des cent et sa valeur. Dessous se lisent trois lignes : ce qu'elle en atteint avec un pourcentage, la moyenne des cent, et combien dépassent avec le compte zéro sur cent.",
    legende:
      "Chaque barre est la vitesse à laquelle le coût monte quand on part dans une direction. Cent directions ont été tirées au hasard, et la meilleure des cent est la seconde barre.",
  },
  {
    id: "b-d8-1",
    type: "texte",
    texte:
      "En dimension $1$, « la pente » est un nombre. En dimension $p$, un point a autant de directions de départ qu'on veut, et un seul nombre ne peut pas les décrire toutes : il faut l'objet qui remplace la dérivée quand $\\boldsymbol{\\theta}$ a $101\\,770$ coordonnées.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.1 · Les trois définitions
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d8-2",
    type: "titre",
    niveau: 2,
    texte: "Trois objets, définis avant d'être employés",
  },
  {
    id: "b-d8-3",
    type: "definition",
    terme: "Dérivée partielle",
    anglais: "partial derivative",
    texte:
      "Pour $C:\\mathbb{R}^{p}\\rightarrow\\mathbb{R}$ et $i\\in[\\![1,p]\\!]$, la dérivée en $0$ de la fonction d'**une** variable $s\\mapsto C(\\boldsymbol{\\theta}+s\\,\\mathbf{e}_{i})$, obtenue en gelant les $p-1$ autres coordonnées. C'est un **scalaire**, et il y en a $p$.",
  },
  {
    id: "b-d8-4",
    type: "formule",
    ancre: "derivee-partielle",
    latex:
      "\\frac{\\partial C}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})=\\lim_{s\\to 0}\\frac{C(\\boldsymbol{\\theta}+s\\,\\mathbf{e}_{i})-C(\\boldsymbol{\\theta})}{s}\\ \\in\\mathbb{R}",
    alt: "La dérivée partielle de C par rapport à la i-ième composante, évaluée en thêta, vaut la limite quand s tend vers zéro du quotient de la différence entre C en thêta plus s fois le i-ième vecteur de base et C en thêta, par s. C'est un réel.",
    numero: "8.1",
    legende:
      "$\\mathbf{e}_{i}\\in\\mathbb{R}^{p}$ est le $i$-ième vecteur de la base canonique. **$i$ désigne une composante**, jamais une itération.",
  },
  {
    id: "b-d8-5",
    type: "definition",
    terme: "Gradient",
    anglais: "gradient",
    texte:
      "Le vecteur **colonne** des $p$ dérivées partielles, de même dimension que $\\boldsymbol{\\theta}$. Il est défini quand $C$ est de classe $\\mathcal{C}^{1}$ sur un ouvert, c'est-à-dire quand ses $p$ dérivées partielles existent et sont continues.",
  },
  {
    id: "b-d8-6",
    type: "formule",
    ancre: "gradient",
    latex:
      "\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C(\\boldsymbol{\\theta})=\\left(\\frac{\\partial C}{\\partial\\theta_{1}}(\\boldsymbol{\\theta}),\\ \\ldots,\\ \\frac{\\partial C}{\\partial\\theta_{p}}(\\boldsymbol{\\theta})\\right)^{\\mathsf{T}}\\in\\mathbb{R}^{p}",
    alt: "Le gradient de C par rapport à thêta, évalué en thêta, est le vecteur colonne dont les p coordonnées sont les dérivées partielles de C par rapport à chacune des p composantes. Il vit dans l'espace à p dimensions.",
    numero: "8.2",
    legende:
      "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$ est donc une **fonction** de $\\mathbb{R}^{p}$ dans $\\mathbb{R}^{p}$ : à chaque point de l'espace des paramètres, elle associe un vecteur de la même taille. Pour le réseau $784\\rightarrow 128\\rightarrow 10$, c'est un vecteur de $101\\,770$ nombres.",
  },
  {
    id: "b-d8-7",
    type: "definition",
    terme: "Dérivée directionnelle",
    anglais: "directional derivative",
    texte:
      "Pour $\\mathbf{u}\\in\\mathbb{R}^{p}$ avec $\\|\\mathbf{u}\\|=1$, la vitesse de variation de $C$ quand on part de $\\boldsymbol{\\theta}$ dans la direction $\\mathbf{u}$ : $D_{\\mathbf{u}}C(\\boldsymbol{\\theta})=\\lim_{t\\to 0}\\big[C(\\boldsymbol{\\theta}+t\\mathbf{u})-C(\\boldsymbol{\\theta})\\big]/t$. La dérivée partielle en est le cas $\\mathbf{u}=\\mathbf{e}_{i}$.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.2 · Proposition 3, énoncée
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d8-8",
    type: "titre",
    niveau: 2,
    texte: "Ce que le gradient a de particulier",
  },
  {
    id: "b-d8-9",
    type: "texte",
    texte:
      "Parmi toutes les directions unitaires de $\\mathbb{R}^{p}$, et il y en a une infinité, une seule fait monter $C$ le plus vite, et c'est celle du gradient. Son opposée fait descendre le plus vite. C'est l'énoncé qui justifie tout le procédé, et **ce chapitre ne le démontre pas**.",
  },
  {
    id: "b-d8-10",
    type: "formule",
    ancre: "proposition-3",
    latex:
      "\\textbf{Proposition 3.}\\quad C\\in\\mathcal{C}^{1},\\ \\|\\mathbf{u}\\|=1\\ \\Longrightarrow\\ D_{\\mathbf{u}}C(\\boldsymbol{\\theta})=\\big\\langle\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C(\\boldsymbol{\\theta}),\\ \\mathbf{u}\\,\\big\\rangle\\ \\leq\\ \\big\\|\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C(\\boldsymbol{\\theta})\\big\\|",
    alt: "Proposition trois. Si C est continûment dérivable et si u est de norme un, alors la dérivée directionnelle de C selon u en thêta vaut le produit scalaire du gradient de C en thêta par u, et cette quantité est majorée par la norme du gradient.",
    numero: "8.3",
    legende:
      "L'énoncé suppose $\\mathrm{grad}\\,C(\\boldsymbol{\\theta})\\neq\\mathbf{0}$, sans quoi toutes les directions se valent. L'égalité est atteinte quand $\\mathbf{u}$ est colinéaire au gradient et de même sens, donc **la direction de plus forte croissance est celle du gradient**. Appliquée à $-\\mathbf{u}$, la même majoration donne $D_{\\mathbf{u}}C\\geq-\\|\\mathrm{grad}\\|$, avec égalité pour $\\mathbf{u}$ colinéaire au gradient et de sens **opposé** : c'est ce second pas, et lui seul, qui justifie le signe moins de l'algorithme.",
  },
  {
    id: "b-d8-11",
    type: "encart",
    ton: "attention",
    titre:
      "Cette proposition est admise, et voici ce qui manque pour la démontrer",
    texte:
      "Deux outils, et aucun n'est disponible ici. **L'approximation au premier ordre en plusieurs variables**, qui donne $C(\\boldsymbol{\\theta}+t\\mathbf{u})=C(\\boldsymbol{\\theta})+t\\langle\\mathrm{grad}\\,C,\\mathbf{u}\\rangle+o(t)$ et établit la première égalité. Et **l'inégalité de Cauchy-Schwarz**, $\\langle\\mathbf{v},\\mathbf{u}\\rangle\\leq\\|\\mathbf{v}\\|\\,\\|\\mathbf{u}\\|$ avec égalité si et seulement si $\\mathbf{u}$ et $\\mathbf{v}$ sont colinéaires de même sens, qui donne la majoration et le cas d'égalité. Les deux appartiennent au **cours d'optimisation**. Ce chapitre les emprunte et le dit, plutôt que d'écrire une preuve qui s'appuierait sur ce qui n'a pas été posé.",
  },
  {
    id: "b-d8-12",
    type: "texte",
    texte:
      "Admettre n'oblige pas à croire sur parole, car l'énoncé se **vérifie** : on tire cent directions au hasard, on ramène chacune à la longueur $1$, ce qu'on appelle la **normaliser** et qui revient à diviser un vecteur par sa norme, puis on mesure $D_{\\mathbf{u}}C$ pour chacune et on compare à celle du gradient lui-même normalisé. Si la proposition est vraie, aucune ne doit la dépasser.",
  },
  {
    id: "b-d8-12b",
    type: "texte",
    texte:
      "La mesure se fait **au point de départ de la graine 0**, celui de la page 4, et sur un échantillon de $2\\,048$ images plutôt que sur les $60\\,000$ : chacune des cent une dérivées demande deux évaluations du coût, et le faire sur le jeu entier coûterait cent fois plus pour un résultat de même forme. La page 9 dira ce qu'un échantillon coûte en exactitude ; ici, il ne sert qu'à comparer cent une directions entre elles, toutes sur le même échantillon.",
  },
  {
    id: "b-d8-13",
    type: "sortie",
    ancre: "cent-directions-mesure",
    titre: "Cent directions au hasard · cours/lecon3/mesures.py, mesure 8",
    texte:
      "    C est le coût sur les 2048 exemples de la mesure 4.\n    différence finie CENTRÉE, epsilon = 1e-05\n\n    direction du gradient normalisé   D_u C = +1.39887154\n    cent directions unitaires tirées au hasard :\n      maximum                         +0.02064745\n      minimum                         -0.01105809\n      moyenne                         -0.00058565\n      combien dépassent le gradient   0 sur 100\n      rapport max/gradient            0.0148",
    lecture: [
      "**Aucune des cent ne dépasse le gradient**, et ce n'est pas juste : la meilleure des cent atteint $1{,}5\\,\\%$ de sa valeur.",
      "La moyenne des cent est quasiment nulle, et les valeurs se répartissent de part et d'autre de zéro : une direction tirée au hasard dans $\\mathbb{R}^{101\\,770}$ est presque orthogonale au gradient, donc elle ne fait ni monter ni descendre.",
      "C'est un effet de la dimension, et il se retrouvera page 11 : dans un espace à cent mille dimensions, deux directions tirées indépendamment sont presque toujours presque orthogonales.",
    ],
  },
  {
    id: "b-d8-15",
    type: "texte",
    texte:
      "La **longueur** du gradient dit autre chose que sa direction : elle dit la raideur de la pente. Là où cette longueur est grande, une petite modification de $\\boldsymbol{\\theta}$ change beaucoup le coût ; là où elle est petite, le coût est plat. Comme la mise à jour est proportionnelle au gradient, **les pas rétrécissent d'eux-mêmes** quand la pente s'aplatit, à $\\eta$ constant. La table ci-dessous la suit sur trente époques, sur le jeu entier et sur un réseau qui apprend, et ses valeurs n'ont donc rien à voir avec le $1{,}3989$ mesuré plus haut au point de départ sur $2\\,048$ images.",
  },
  {
    id: "b-d8-fig17",
    type: "image",
    ancre: "la-norme-du-gradient",
    src: "/cours/lecon3/l3-fig17-la-norme-du-gradient.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "Une courbe descendante sur un axe horizontal gradué de zéro à vingt-neuf, sous la mention époque. L'axe vertical est logarithmique. La courbe part d'une valeur portée en haut à gauche et descend, avec un léger ressaut au milieu, jusqu'à une valeur bien plus basse portée en bas à droite. En haut à droite se lit le rapport entre les deux, précédé d'un signe de division.",
    legende:
      "Le pas effectif vaut $\\eta$ fois cette longueur, et $\\eta$ n'a pas bougé de tout l'entraînement.",
  },
  {
    id: "b-d8-16",
    type: "sortie",
    ancre: "norme-gradient",
    titre:
      "La norme du gradient pendant l'entraînement · cours/lecon3/mesures.py, mesure 7",
    texte:
      "    époque   L_train   acc_train    L_test   acc_test    ||grad||\n         0    0.1055     0.9694    0.1195     0.9641    0.087878\n         4    0.0329     0.9895    0.0743     0.9777    0.058533\n         9    0.0130     0.9963    0.0743     0.9779    0.065720\n        19    0.0011     1.0000    0.0729     0.9816    0.002535\n        29    0.0006     1.0000    0.0761     0.9814    0.000833",
    lecture: [
      "**La norme du gradient est divisée par $105$** entre la première et la dernière époque mesurée. Le pas effectif, $\\eta\\,\\|\\mathrm{grad}\\|$, rétrécit dans le même rapport alors que $\\eta$ n'a pas bougé : c'est le mécanisme annoncé, mesuré.",
      "La précision d'entraînement atteint $1{,}0000$ à l'époque $19$, donc le réseau ne se trompe plus sur **aucune** des $60\\,000$ images qu'il a vues. Le coût d'entraînement continue pourtant de baisser, parce qu'il reste de la confiance à gagner.",
      "**Le coût de test, lui, atteint son plus bas à l'époque $19$, $0{,}0729$, puis remonte à $0{,}0761$.** Le réseau continue de s'améliorer sur ce qu'il a vu et commence à se dégrader sur ce qu'il n'a pas vu. Ce chapitre le constate et n'en fait rien : c'est le sujet du **chapitre d'évaluation**.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.3 · L'algorithme
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d8-17",
    type: "titre",
    niveau: 2,
    texte: "L'algorithme, en entier",
  },
  {
    id: "b-d8-18",
    type: "formule",
    ancre: "regle-maj",
    latex:
      "\\boldsymbol{\\theta}_{t+1}=\\boldsymbol{\\theta}_{t}-\\eta\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta}_{t}),\\qquad \\eta\\in\\mathbb{R}_{>0}",
    alt: "Thêta à l'itération t plus un vaut thêta à l'itération t moins êta fois le gradient du coût évalué en thêta à l'itération t. Le taux êta est un réel strictement positif.",
    numero: "8.4",
    legende:
      "**$t$ est une itération, pas une composante.** Les deux membres sont des vecteurs de $\\mathbb{R}^{p}$, et la soustraction se fait coordonnée par coordonnée : les $101\\,770$ paramètres sont modifiés **en même temps**, chacun de sa propre quantité.",
  },
  {
    id: "b-d8-19",
    type: "code",
    langage: "text",
    titre: "La descente de gradient",
    code: [
      "ENTREE   D          le jeu, fixe",
      "         eta        le taux d'apprentissage, dans R_{>0}",
      "         T          le nombre d'iterations",
      "SORTIE   theta      un vecteur de R^p",
      "",
      "1.  theta <- tirage au hasard dans R^p",
      "2.  pour t de 0 a T-1 :",
      "3.        g <- grad_theta C_D(theta)        un vecteur de R^p",
      "4.        theta <- theta - eta * g          p soustractions",
      "5.  rendre theta",
    ].join("\n"),
    surlignees: [3, 4],
  },
  {
    id: "b-d8-20",
    type: "texte",
    texte:
      "Cinq lignes. La ligne $3$ est celle que ce chapitre ne sait pas exécuter efficacement, et la ligne $4$ est celle dont $\\eta$ décide.",
  },
  {
    id: "b-d8-21",
    type: "verification",
    numero: 27,
    enonce: "Le gradient a la dimension de ce qu'il dérive.",
    questions: [
      "Quelle est la dimension de $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})$ pour le réseau $784\\rightarrow 128\\rightarrow 10$ ?",
      "Et pour $784\\rightarrow 32\\rightarrow 32\\rightarrow 10$ ?",
      "La dimension du gradient dépend-elle du nombre d'images du jeu ? Justifier à partir de $(6.1)$.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.4 · Le taux d'apprentissage
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d8-22",
    type: "titre",
    niveau: 2,
    texte: "Le taux d'apprentissage",
  },
  {
    id: "b-d8-23",
    type: "texte",
    texte:
      "$\\eta$ est le **taux d'apprentissage** : la longueur dont on recule à chaque pas, une fois la direction choisie. C'est le $\\eta$ que le chapitre 1 appelait le pas d'apprentissage, et le seul nombre de tout le procédé qu'un humain fixe encore à la main.",
  },
  {
    id: "b-d8-23b",
    type: "texte",
    texte:
      "La proposition 2 de la page 7 garantit que le coût baisse **pour $\\eta$ assez petit**, sans dire ce que « assez petit » veut dire. Elle a été écrite en dimension un, et elle vaut mot pour mot en dimension $p$ : il suffit de remplacer $C'(\\theta_{t})^{2}$ par $\\|\\mathrm{grad}\\|^{2}$, et le développement au premier ordre d'une variable par celui de plusieurs, c'est-à-dire par le premier des deux outils que la proposition 3 emprunte au cours d'optimisation. On ne peut donc pas davantage prédire le bon réglage en dimension $p$ : on le cherche, sur sept valeurs, cinq époques chacune, à graine égale.",
  },
  {
    id: "b-d8-fig18",
    type: "image",
    ancre: "trois-taux",
    src: "/cours/lecon3/l3-fig18-trois-taux.svg",
    largeur: 1380,
    hauteur: 680,
    alt: "Trois graphes côte à côte montrent la même parabole grise, et les trois partent du même point. Sur le premier, intitulé il remonte, les points brique sautent d'une paroi à l'autre en s'écartant du fond un peu plus à chaque fois ; il porte êta égale un virgule zéro huit. Sur le deuxième, intitulé il descend, les points atteignent le fond en quelques pas ; il porte êta égale zéro virgule trente-cinq. Sur le troisième, intitulé il n'a pas fini, les points restent groupés près du point de départ, très loin du fond ; il porte êta égale zéro virgule zéro deux.",
    legende:
      "Tracé sur $C(\\theta)=\\theta^{2}$, une fonction posée par le cours et non mesurée, parce que c'est celle où le seuil se calcule à la main : la suite y est multipliée par $1-2\\eta$ à chaque pas, et elle diverge exactement quand $\\eta$ dépasse $1$.",
  },
  {
    id: "b-d8-24",
    type: "sortie",
    ancre: "balayage-eta",
    titre:
      "Sept taux d'apprentissage, 5 époques · cours/lecon3/mesures.py, mesure 3",
    texte:
      "         eta      L_test    acc_test\n       10.000      2.4654    0.0892\n        3.000      2.3246    0.1009\n        1.000      0.1128    0.9709\n        0.500      0.0743    0.9777\n        0.100      0.1094    0.9677\n        0.010      0.2731    0.9217\n        0.001      0.6331    0.8523",
    lecture: [
      "**Trois régimes.** Au-dessus de $3$, le réseau reste au niveau du hasard, $0{,}0892$ et $0{,}1009$, à comparer au seuil de $11{,}35\\,\\%$ du chapitre 2. Les pas sont si grands qu'ils ne descendent rien : chacun traverse la vallée et remonte plus haut de l'autre côté.",
      "Entre $1$ et $0{,}1$, le réseau apprend vite, et le meilleur réglage est $\\eta=0{,}5$ avec $0{,}9777$ en cinq époques.",
      "En dessous de $0{,}01$, il apprend mais n'a pas fini : $0{,}8523$ à $\\eta=0{,}001$, ce qui n'est pas une divergence, c'est une lenteur.",
      "**$\\eta=10$ et $\\eta=0{,}001$ sont tous deux mauvais pour des raisons opposées.** Le premier ne converge pas, le second n'a pas eu le temps. Confondre les deux échecs conduirait à corriger dans le mauvais sens.",
    ],
  },
  {
    id: "b-d8-25",
    type: "animation",
    ancre: "le-pas-sarrete-au-premier-creux",
    animationId: "le-pas-sarrete-au-premier-creux",
    legende:
      "La même coupe, et cette fois le point de la règle de mise à jour : sans inertie, il s'arrête au premier creux que la bille passait.",
  },
  {
    id: "b-d8-26",
    type: "encart",
    ton: "rappel",
    titre: "Dette du chapitre 2 réglée : $\\eta=0{,}05$ contre $\\eta=0{,}5$",
    texte:
      "Le chapitre 2 employait $\\eta=0{,}5$ pour son réseau à $\\mathrm{ReLU}$ et $\\eta=0{,}05$ pour son réseau sans activation, qui **divergeait** à $0{,}5$, sans dire pourquoi. La réponse est dans la table ci-dessus, et elle tient en une phrase : le bon $\\eta$ dépend de la fonction qu'on descend, il n'y a pas de valeur universelle, et **on le cherche par balayage**. Le seuil exact au-delà duquel une descente diverge se calcule, mais il demande la courbure de $C$ au point courant : c'est une dette vers le **chapitre d'optimisation**.",
  },
  {
    id: "b-d8-27",
    type: "verification",
    numero: 28,
    enonce:
      "Le taux $10$ et le taux $0{,}001$ donnent tous deux un mauvais résultat.",
    questions: [
      "Les deux échecs sont-ils de même nature ? Répondre à partir des deux colonnes de la table.",
      "Que se passerait-il si l'on entraînait dix fois plus longtemps avec $\\eta=0{,}001$ ? Et avec $\\eta=10$ ?",
      "Le seuil de bascule est entre $1$ et $3$. Ce seuil est-il une propriété de la descente de gradient, ou de cette fonction-là ?",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.5 · Les différences finies
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d8-28",
    type: "titre",
    niveau: 2,
    texte: "Comment on obtient ce vecteur, et pourquoi ce n'est pas comme ça",
  },
  {
    id: "b-d8-29",
    type: "texte",
    texte:
      "La ligne $3$ de l'algorithme demande $101\\,770$ dérivées partielles. Il existe un procédé qui les donne toutes, qui ne demande **que des propagations avant**, et qui ne suppose rien sur la forme de $C$ : remplacer la limite de $(8.1)$ par un quotient à $\\varepsilon$ fini.",
  },
  {
    id: "b-d8-30",
    type: "definition",
    terme: "Différence finie centrée",
    anglais: "central finite difference",
    texte:
      "L'approximation $\\dfrac{\\partial C}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})\\approx\\dfrac{C(\\boldsymbol{\\theta}+\\varepsilon\\mathbf{e}_{i})-C(\\boldsymbol{\\theta}-\\varepsilon\\mathbf{e}_{i})}{2\\varepsilon}$, pour $\\varepsilon>0$ petit. **Centrée** parce qu'elle évalue de part et d'autre du point ; l'erreur y est en $\\varepsilon^{2}$ au lieu de $\\varepsilon$ pour la version décentrée.",
  },
  {
    id: "b-d8-fig19",
    type: "image",
    ancre: "la-difference-finie",
    src: "/cours/lecon3/l3-fig19-la-difference-finie.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "Une courbe en cuvette. Deux ronds brique y sont posés de part et d'autre d'un même point, sous les mentions thêta moins epsilon et thêta plus epsilon, et un trait brique joint les deux ronds. À droite du graphe, une colonne donne le compte : par composante, deux fois cent un mille sept cent soixante-dix, soit deux cent trois mille cinq cent quarante propagations ; puis, sous la mention au chapitre 4, une propagation.",
    legende:
      "Le tracé est posé par le cours ; les deux comptes de propagations, eux, sont ceux du réseau.",
  },
  {
    id: "b-d8-31",
    type: "formule",
    ancre: "difference-finie",
    latex:
      "\\frac{\\partial C}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})\\ \\approx\\ \\frac{C(\\boldsymbol{\\theta}+\\varepsilon\\mathbf{e}_{i})-C(\\boldsymbol{\\theta}-\\varepsilon\\mathbf{e}_{i})}{2\\varepsilon},\\qquad \\varepsilon=10^{-5}",
    alt: "La dérivée partielle de C par rapport à la i-ième composante en thêta est approchée par le quotient de la différence entre C évalué en thêta plus epsilon fois le i-ième vecteur de base et C évalué en thêta moins epsilon fois ce même vecteur, par deux epsilon, avec epsilon valant dix puissance moins cinq.",
    numero: "8.5",
    legende:
      "**Toutes les mesures de ce chapitre emploient ce procédé**, et il est exact à la précision voulue : la mesure 8 ci-dessus l'a utilisé pour les cent une dérivées directionnelles.",
  },
  {
    id: "b-d8-33",
    type: "sortie",
    ancre: "cout-differences-finies",
    titre:
      "Ce que coûte un gradient par différences finies · cours/lecon3/mesures.py, mesure 9",
    texte:
      "    une propagation avant sur 2048 exemples     26.3 ms\n    UNE composante par différence centrée      50.2 ms   (2 propagations)\n    p                                          101770 composantes\n    propagations avant pour UN gradient        203540\n    temps estimé pour UN gradient             5113 s, soit 1.42 h\n    l'algorithme du chapitre 4 en demande      1 propagation avant\n    rapport                                    203 540\n\n    Un entraînement de 30 époques compte 28 140 mises à jour.\n    Par différences finies, il demanderait     5 années de calcul.",
    lecture: [
      "**Un seul gradient demande $203\\,540$ propagations avant**, soit une heure et demie sur ce poste, pour **un** pas parmi $28\\,140$. Ces $28\\,140$ pas ne sont pas ceux de l'algorithme écrit plus haut, qui n'en ferait que trente en trente époques : ce sont ceux de l'entraînement réel, qui découpe chaque époque en lots de $64$ images et fait donc $938$ pas par époque. La page 9 dit pourquoi.",
      "L'entraînement complet demanderait environ **cinq années** de calcul, quand le même entraînement avec l'algorithme du chapitre 4 prend une minute.",
      "Le procédé n'est pas faux, puisque c'est celui qui a produit toutes les vérifications de ce chapitre. Il est **correct et inutilisable**, et c'est une distinction qu'il faut savoir faire.",
    ],
  },
  {
    id: "b-d8-34",
    type: "encart",
    ton: "attention",
    titre: "Ce chiffre est le sujet du chapitre suivant",
    texte:
      "$203\\,540$ contre $1$. Il existe un algorithme qui obtient les $101\\,770$ composantes en une seule propagation avant et une seule passe en sens inverse, exactement et non approximativement. Tout ce chapitre l'a **utilisé** sans le nommer : c'est lui qui a entraîné les réseaux dont les mesures sortent. Le chapitre 4 dit ce qu'il fait, et le chapitre 5 le calcule.",
  },
];
