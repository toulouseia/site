import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 11 · Il n'y a pas une bonne réponse
//
// La page porte la mesure la plus forte du chapitre : trois entraînements
// identiques à la graine près donnent trois theta finaux QUASIMENT ORTHOGONAUX,
// tous les trois à 98,2 %. La proposition 6 en construit 128! d'un coup.
//
// LA SECTION 11.4 A ÉTÉ RESSERRÉE. Elle portait dix blocs sur le contrôle
// croisé avec le chapitre 2 et sur ce que deux implémentations indépendantes
// devraient trouver identique. L'idée est juste et elle découle de la
// proposition 6, mais elle n'avance pas vers le fil du chapitre : elle est
// désormais un encart, un tableau et la vérification 34. Un onzième bloc,
// « Ce que cette règle interdit d'écrire », a été RETIRÉ : il parlait de la
// façon dont les chapitres du cours sont rédigés, et c'est la règle 1.
//
// La dette « h = 128 non justifié » du chapitre 2 est réglée ici, par la
// mesure 11, et le texte ne dit que ce que la mesure montre.
//
// Tous les nombres sortent de cours/lecon3/mesures.py, mesures 6 et 11.
// ─────────────────────────────────────────────────────────────────────────────

export const D11_MINIMA: Bloc[] = [
  {
    id: "b-d11-0",
    type: "texte",
    texte:
      "Deux entraînements qui ne diffèrent que par leur tirage de départ arrivent-ils au même endroit ?",
  },
  {
    id: "b-d11-fig24",
    type: "image",
    ancre: "quatre-points",
    src: "/cours/lecon3/l3-fig24-quatre-points.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Quatre petits graphes côte à côte, chacun portant un rond brique là où la pente s'annule, et chacun légendé pente nulle. Le premier, minimum global, montre une cuvette dont le rond occupe le fond. Le deuxième, minimum local, montre une courbe à deux creux dont le rond occupe le moins profond. Le troisième, ni l'un ni l'autre, montre une courbe qui monte partout et qui s'aplatit un instant là où se trouve le rond. Le quatrième, point selle, montre deux courbes qui se croisent au rond, l'une en cuvette à l'encre et l'autre en cloche en ardoise.",
    legende:
      "Les quatre ont une pente nulle. La descente s'arrête sur n'importe lequel des quatre, et rien dans son fonctionnement ne lui dit lequel.",
  },
  {
    id: "b-d11-1",
    type: "texte",
    texte:
      "L'énoncé de la page 3 demande un élément de $\\arg\\min C_{\\mathcal{D}}$, et il faut donc savoir ce que cet ensemble contient avant de savoir ce que la descente y attrape. Les quatre noms que porte la figure se définissent dans l'ordre, et la page s'en sert ensuite sans y revenir.",
  },
  {
    id: "b-d11-1b",
    type: "texte",
    texte:
      "Un mot de mesure, aussi, parce que toute la page en vivra. Comparer deux jeux de paramètres $\\mathbf{a}$ et $\\mathbf{b}$ par $\\|\\mathbf{a}-\\mathbf{b}\\|$ ne dirait rien, faute d'échelle : on rapporte donc l'écart à la taille de ce qu'on compare, et la **distance relative** est $\\|\\mathbf{a}-\\mathbf{b}\\|/\\|\\mathbf{a}\\|$. Pour deux vecteurs de **même norme**, elle vaut $\\sqrt{2}=1{,}4142$ exactement quand ils sont orthogonaux, plus quand l'angle dépasse l'angle droit, moins quand il reste en deçà.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.1 · Les quatre objets
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d11-2",
    type: "titre",
    niveau: 2,
    texte: "Quatre points remarquables, distingués",
  },
  {
    id: "b-d11-3",
    type: "definition",
    terme: "Minimum local",
    anglais: "local minimum",
    texte:
      "Un point $\\boldsymbol{\\theta}^{\\star}$ tel qu'il existe un voisinage $V$ de $\\boldsymbol{\\theta}^{\\star}$ sur lequel $C(\\boldsymbol{\\theta}^{\\star})\\leq C(\\boldsymbol{\\theta})$ pour tout $\\boldsymbol{\\theta}\\in V$. La comparaison ne porte que sur le voisinage : ailleurs, $C$ peut être bien plus basse.",
  },
  {
    id: "b-d11-4",
    type: "definition",
    terme: "Minimum global",
    anglais: "global minimum",
    texte:
      "Un point $\\boldsymbol{\\theta}^{\\star}$ tel que $C(\\boldsymbol{\\theta}^{\\star})\\leq C(\\boldsymbol{\\theta})$ pour **tout** $\\boldsymbol{\\theta}$ de l'espace. $\\arg\\min C$ est exactement l'ensemble des minima globaux.",
  },
  {
    id: "b-d11-5",
    type: "definition",
    terme: "Point critique",
    anglais: "critical point, stationary point",
    texte:
      "Un point où $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C(\\boldsymbol{\\theta})=\\mathbf{0}$. **C'est exactement l'ensemble des points où la descente s'arrête**, puisque la mise à jour $(8.4)$ y devient l'identité.",
  },
  {
    id: "b-d11-6",
    type: "definition",
    terme: "Point selle",
    anglais: "saddle point",
    texte:
      "Un point critique qui n'est ni un minimum local ni un maximum local : $C$ y croît dans certaines directions et y décroît dans d'autres. En dimension $2$, c'est la forme d'un col de montagne, ou d'une selle de cheval.",
  },
  {
    id: "b-d11-7",
    type: "tableau",
    ancre: "quatre-points-table",
    titre: "Un exemple de chacun",
    cleEnTete: true,
    entetes: ["Point", "Exemple", "$\\mathrm{grad}=\\mathbf{0}$ ?"],
    lignes: [
      [
        "Minimum global",
        "$C(\\theta)=\\theta^{2}$ sur $\\mathbb{R}$ : le point $0$, et lui seul",
        "oui",
      ],
      [
        "Minimum local non global",
        "$C(\\theta)=\\theta^{4}-4\\theta^{2}+\\theta$ : le creux de gauche est local, celui de droite est plus bas",
        "oui",
      ],
      [
        "Point critique qui n'est pas un minimum",
        "$C(\\theta)=\\theta^{3}$ en $0$ : la dérivée s'annule, mais $C$ décroît de part et d'autre",
        "oui",
      ],
      [
        "Point selle",
        "$C(\\theta_{1},\\theta_{2})=\\theta_{1}^{2}-\\theta_{2}^{2}$ en $(0,0)$ : minimum le long de $\\theta_{1}$, maximum le long de $\\theta_{2}$",
        "oui",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.2 · Proposition 6
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d11-8",
    type: "titre",
    niveau: 2,
    texte: "Le coût prend la même valeur en un nombre gigantesque de points",
  },
  {
    id: "b-d11-fig25",
    type: "image",
    ancre: "permuter",
    src: "/cours/lecon3/l3-fig25-permuter.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "Deux montages côte à côte. Dans chacun, un rond d'entrée à gauche et un rond de sortie à droite sont reliés par des filets à quatre ronds numérotés empilés au centre. À gauche, sous le titre l'ordre des neurones cachés, les quatre ronds portent dans l'ordre un, deux, trois, quatre. À droite, sous le titre le même, permuté, ils portent trois, un, quatre, deux, en brique. Sous chaque montage est porté le coût, et les deux coûts sont identiques sur toutes leurs décimales. À droite se lit la distance entre les deux thêta.",
    legende:
      "Les mêmes neurones, dans un autre ordre. La sortie ne change pas d'un chiffre, et pourtant les deux $\\boldsymbol{\\theta}$ sont presque orthogonaux.",
  },
  {
    id: "b-d11-9",
    type: "derivation",
    ancre: "proposition-6",
    titre:
      "Proposition 6 · Permuter les neurones cachés ne change pas la fonction calculée",
    hypotheses: [
      "$\\boldsymbol{\\theta}=(W^{[1]},\\mathbf{b}^{[1]},W^{[2]},\\mathbf{b}^{[2]})$ avec $W^{[1]}\\in\\mathcal{M}_{h,784}(\\mathbb{R})$ et $W^{[2]}\\in\\mathcal{M}_{10,h}(\\mathbb{R})$.",
      "$\\pi$ est une permutation de $[\\![1,h]\\!]$, c'est-à-dire une façon de réordonner les $h$ neurones cachés. Sa matrice $P_{\\pi}\\in\\mathcal{M}_{h}(\\mathbb{R})$ est définie par $(P_{\\pi}\\mathbf{u})_{i}=u_{\\pi(i)}$ : elle range en $i$-ième position la coordonnée que $\\pi$ y envoie.",
      "$\\mathrm{ReLU}$ s'applique composante par composante, au sens de la convention du chapitre 2.",
    ],
    proprietes: [
      "$P_{\\pi}^{\\mathsf{T}}P_{\\pi}=I_{h}$ pour toute matrice de permutation",
      "$\\mathrm{ReLU}(P_{\\pi}\\mathbf{u})=P_{\\pi}\\,\\mathrm{ReLU}(\\mathbf{u})$ : une fonction appliquée coordonnée par coordonnée **commute** avec une permutation des coordonnées",
    ],
    etapes: [
      { texte: "On pose le paramètre permuté :" },
      {
        latex:
          "W^{[1]\\prime}=P_{\\pi}W^{[1]},\\quad \\mathbf{b}^{[1]\\prime}=P_{\\pi}\\mathbf{b}^{[1]},\\quad W^{[2]\\prime}=W^{[2]}P_{\\pi}^{\\mathsf{T}},\\quad \\mathbf{b}^{[2]\\prime}=\\mathbf{b}^{[2]}",
        alt: "W un prime vaut P pi fois W un ; b un prime vaut P pi fois b un ; W deux prime vaut W deux fois P pi transposée ; b deux prime vaut b deux.",
        justification:
          "**Pourquoi $P_{\\pi}$ à gauche d'un côté et $P_{\\pi}^{\\mathsf{T}}$ à droite de l'autre.** Multiplier $W^{[1]}$ à gauche par $P_{\\pi}$ permute ses **lignes**, donc les neurones cachés, ce qui est bien ce qu'on veut faire. Il faut alors que la couche de sortie aille rechercher chaque neurone à sa nouvelle place, c'est-à-dire défaire la permutation : c'est $P_{\\pi}^{\\mathsf{T}}=P_{\\pi}^{-1}$, et c'est le seul facteur qui se simplifie à l'étape suivante. $\\mathbf{b}^{[2]}$ ne bouge pas, puisqu'il porte les dix classes et non les $h$ neurones. Les dimensions suivent : $(h\\times h)(h\\times 784)=h\\times 784$ et $(10\\times h)(h\\times h)=10\\times h$.",
      },
      {
        latex:
          "\\mathbf{z}^{[2]\\prime}(\\mathbf{x})=W^{[2]}P_{\\pi}^{\\mathsf{T}}\\ \\mathrm{ReLU}\\big(P_{\\pi}W^{[1]}\\mathbf{x}+P_{\\pi}\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}",
        alt: "La préactivation de sortie du réseau permuté vaut W deux fois P pi transposée, appliqué à ReLU de P pi W un x plus P pi b un, le tout plus b deux.",
        justification: "Substitution directe des quatre blocs permutés.",
      },
      {
        latex:
          "=W^{[2]}P_{\\pi}^{\\mathsf{T}}\\,P_{\\pi}\\ \\mathrm{ReLU}\\big(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}",
        alt: "Cela vaut W deux fois P pi transposée fois P pi, appliqué à ReLU de W un x plus b un, plus b deux.",
        justification:
          "$P_{\\pi}W^{[1]}\\mathbf{x}+P_{\\pi}\\mathbf{b}^{[1]}=P_{\\pi}(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]})$ par linéarité, puis $\\mathrm{ReLU}$ commute avec $P_{\\pi}$ : permuter les coordonnées puis appliquer $\\mathrm{ReLU}$ à chacune, ou l'appliquer puis permuter, donne le même vecteur.",
      },
      {
        latex:
          "=W^{[2]}\\ \\mathrm{ReLU}\\big(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}=\\mathbf{z}^{[2]}(\\mathbf{x})",
        alt: "En utilisant que P pi transposée fois P pi vaut l'identité, cela vaut W deux appliqué à ReLU de W un x plus b un, plus b deux, c'est-à-dire la préactivation de sortie du réseau d'origine.",
        justification: "$P_{\\pi}^{\\mathsf{T}}P_{\\pi}=I_{h}$.",
      },
      {
        texte:
          "L'égalité vaut pour **tout** $\\mathbf{x}$, donc $f_{\\boldsymbol{\\theta}'}=f_{\\boldsymbol{\\theta}}$ comme fonctions, donc $C_{\\mathcal{D}}(\\boldsymbol{\\theta}')=C_{\\mathcal{D}}(\\boldsymbol{\\theta})$ quel que soit le jeu.",
      },
    ],
    resultat: {
      latex:
        "\\text{pour toute permutation }\\pi\\text{ de }[\\![1,h]\\!],\\quad C_{\\mathcal{D}}(\\boldsymbol{\\theta}')=C_{\\mathcal{D}}(\\boldsymbol{\\theta}),\\qquad 128!\\approx 3{,}86\\cdot 10^{215}",
      alt: "Pour toute permutation pi des entiers de un à h, le coût du paramètre permuté est égal au coût du paramètre d'origine. Le nombre de permutations de cent vingt-huit éléments vaut cent vingt-huit factorielle, environ trois virgule quatre-vingt-six fois dix puissance deux cent quinze.",
    },
    interpretation:
      "À partir d'**un** point, la famille des $\\boldsymbol{\\theta}'$ a autant de membres qu'il y a de façons d'ordonner $128$ neurones, soit $128!$, et tous ont un coût rigoureusement identique, sans qu'on ait rien calculé. Si $\\boldsymbol{\\theta}$ est un minimiseur, tous le sont : l'ensemble $\\arg\\min C_{\\mathcal{D}}$, **s'il n'est pas vide**, n'est donc jamais réduit à un point. Et $128!$ dépasse de très loin le nombre d'atomes de l'univers observable. **Chercher « le » minimum n'a pas de sens.**",
    limites: [
      "La proposition ne dit pas que ces points sont les **seuls** : elle en construit une famille, elle n'en fait pas l'inventaire.",
      "Elle ne dit pas non plus qu'ils sont tous **distincts**. Deux permutations donnent le même $\\boldsymbol{\\theta}'$ dès que deux neurones cachés portent exactement les mêmes poids et le même biais, ce qui n'arrive pas sur un réseau tiré au hasard mais reste une possibilité. Le compte $128!$ est donc un majorant du nombre de permutations, et le nombre de points distincts lui est au plus égal.",
      "Elle vaut pour toute largeur $h$ et pour toute activation appliquée composante par composante, $\\sigma$ aussi bien que $\\mathrm{ReLU}$.",
      "Elle ne dit rien de la **qualité** de ces points : ils ont tous exactement le même coût, quel qu'il soit.",
    ],
  },
  {
    id: "b-d11-10",
    type: "sortie",
    ancre: "proposition-6-verifiee",
    titre:
      "La proposition 6, vérifiée numériquement · cours/lecon3/mesures.py, mesure 6",
    texte:
      "      coût de theta                          0.076069643927\n      coût de theta permuté (une permutation) 0.076069643927\n      écart                                  1.388e-17\n      distance relative entre les deux theta  1.4148\n      nombre de permutations de 128 elements  128! ~ 3,86e215",
    lecture: [
      "Les deux coûts coïncident sur les douze décimales affichées, et l'écart mesuré, $1{,}4\\cdot 10^{-17}$, est de l'ordre de la précision d'un flottant de 64 bits. Ce n'est pas « presque égal » : c'est égal, à l'arrondi de la machine près.",
      "**Et pourtant les deux $\\boldsymbol{\\theta}$ sont à distance relative $1{,}4148$**, c'est-à-dire presque orthogonaux. Deux points sans aucun rapport dans $\\mathbb{R}^{101\\,770}$, et exactement le même coût.",
      "Une seule permutation suffit à le montrer, et il y en a $128!$.",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 11.3 · Trois graines
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d11-12",
    type: "titre",
    niveau: 2,
    texte: "Trois entraînements, trois solutions sans rapport",
  },
  {
    id: "b-d11-13",
    type: "texte",
    texte:
      "La proposition 6 construit des minimiseurs par symétrie, et il reste à savoir ce que la descente atteint **en pratique** quand on ne change que le point de départ. Trois entraînements, même protocole, seule la graine diffère.",
  },
  {
    id: "b-d11-fig26",
    type: "image",
    ancre: "trois-graines-figure",
    src: "/cours/lecon3/l3-fig26-trois-graines.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "À gauche, trois petits schémas, un par couple de graines. Chacun montre deux segments partant d'un même point et terminés par un rond brique, ouverts à l'angle mesuré, c'est-à-dire presque l'angle droit. Sous chaque schéma se lisent le couple concerné et son angle. À droite, un tableau donne pour chaque graine sa précision et son nombre d'erreurs, puis les normes des trois thêta.",
    legende:
      "Chaque couple est dessiné seul, à son angle mesuré. Trois directions mutuellement perpendiculaires n'entrent pas dans un plan : les tracer d'un seul tenant ferait passer deux des trois solutions pour opposées.",
  },
  {
    id: "b-d11-14",
    type: "sortie",
    ancre: "trois-graines",
    titre: "Trois graines, 30 époques · cours/lecon3/mesures.py, mesure 6",
    texte:
      "    graine 0 : précision test 0.9814   186 erreurs\n    graine 1 : précision test 0.9823   177 erreurs\n    graine 2 : précision test 0.9816   184 erreurs\n\n      norme de chaque theta : 36.3214   36.5051   36.4907\n\n      couple      ||a - b|| / ||a||     cos(a, b)\n      0 et 1          1.4036             +0.0199\n      0 et 2          1.4010             +0.0232\n      1 et 2          1.3991             +0.0209\n\n      pour reference : deux vecteurs de meme norme et orthogonaux\n      sont a distance relative racine de 2 = 1.4142",
    lecture: [
      "**Les trois précisions sont pratiquement identiques**, $0{,}9814$, $0{,}9823$ et $0{,}9816$, soit un écart de $9$ erreurs sur $10\\,000$. Les trois solutions sont aussi bonnes l'une que l'autre.",
      "**Les trois distances relatives valent entre $1{,}3991$ et $1{,}4036$, et $\\sqrt{2}=1{,}4142$.** Deux vecteurs de même norme et orthogonaux sont exactement à distance relative $\\sqrt{2}$, donc les trois solutions sont **quasiment orthogonales** deux à deux.",
      "La colonne des cosinus le dit directement, $+0{,}0199$, $+0{,}0232$ et $+0{,}0209$, soit environ $2\\,\\%$ : trois points essentiellement sans rapport dans $\\mathbb{R}^{101\\,770}$.",
      "Les trois normes sont voisines, $36{,}32$, $36{,}51$ et $36{,}49$, donc ce ne sont pas trois solutions de tailles différentes, ce sont trois directions différentes.",
    ],
  },
  {
    id: "b-d11-15",
    type: "texte",
    texte:
      "Il n'y a donc pas **une** bonne réponse que la descente chercherait et qu'elle trouverait plus ou moins bien. Il y en a une infinité, la proposition 6 en construit $128!$ d'un coup, et la mesure montre que trois points de départ suffisent à en atteindre trois sans rapport entre eux. **Le point de départ décide seul de celle qu'on obtient**, et la question utile n'est pas laquelle on atteint, mais si elle est bonne.",
  },
  {
    id: "b-d11-16",
    type: "animation",
    ancre: "trois-graines-trois-creux",
    animationId: "trois-graines-trois-creux",
    legende:
      "Trois départs sur la même coupe, et trois arrivées distinctes : la graine seule décide du creux où la descente s'arrête.",
  },
  {
    id: "b-d11-17",
    type: "verification",
    numero: 32,
    enonce: "La proposition 6 se compte, et le compte dépend de la largeur.",
    questions: [
      "Combien de jeux de paramètres distincts donnent exactement le même coût qu'un $\\boldsymbol{\\theta}$ donné, pour $h=16$ ?",
      "Et pour $h=128$ ?",
      "Ces deux nombres sont-ils du même ordre ? Que vaut le rapport, en ordre de grandeur ?",
    ],
  },
  {
    id: "b-d11-18",
    type: "verification",
    numero: 33,
    enonce:
      "Deux entraînements donnent des $\\boldsymbol{\\theta}$ finaux à distance relative $1{,}3991$, pour des normes presque égales.",
    questions: [
      "Que vaut le cosinus de l'angle entre eux ? Retrouver l'ordre de grandeur à partir de la distance seule.",
      "Qu'en conclure sur la relation entre les deux solutions ?",
      "Si les deux entraînements avaient convergé vers le même minimum, qu'aurait-on mesuré à la place ?",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.4 · Ce qui dépend de la trajectoire, et ce qui n'en dépend pas
  //
  // RESSERRÉE. Dix blocs sont devenus un encart, un tableau et une
  // vérification. L'idée découle de la proposition 6 ; son développement, lui,
  // n'avançait pas vers le fil du chapitre.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d11-19",
    type: "titre",
    niveau: 2,
    texte: "Ce qui se lit avant le trajet, et ce qui n’existe qu’après",
  },
  {
    id: "b-d11-20",
    type: "texte",
    texte:
      "Si le point atteint dépend du seul tirage de départ, alors une partie des nombres de ce chapitre n'est pas reproductible, et une autre l'est. La ligne de partage est nette, et elle se lit à la nature de la quantité.",
  },
  {
    id: "b-d11-21",
    type: "tableau",
    ancre: "ligne-de-partage",
    titre: "La ligne de partage",
    cleEnTete: true,
    entetes: ["Ce qui ne dépend pas de la trajectoire", "Ce qui en dépend"],
    lignes: [
      [
        "Le rapport de la plus grande composante du gradient à la médiane : $404$",
        "Le coût du réseau au départ : $2{,}417832$ pour la graine $0$",
      ],
      [
        "Les $23\\,882$ composantes exactement nulles, soit $23{,}5\\,\\%$",
        "La décroissance de la norme du gradient : divisée par $105$ en trente époques",
      ],
      [
        "Les percentiles de la somme des $|g_{i}|$ : $14{,}55$, $60{,}39$ et $98{,}90\\,\\%$",
        "Les précisions des trois graines : $0{,}9814$, $0{,}9823$, $0{,}9816$",
      ],
      [
        "Les cosinus par taille de lot, de $0{,}0898$ à $0{,}9949$",
        "Les $186$, $177$ et $184$ erreurs correspondantes",
      ],
      [
        "La colonne $B(1/\\cos^{2}-1)$, entre $42{,}0$ et $50{,}5$",
        "Le point $\\boldsymbol{\\theta}$ atteint, et donc tout ce qui s'en déduit",
      ],
    ],
    legende:
      "Les quantités de gauche se lisent **avant** que le trajet commence, au point initial, et ne dépendent que de l'architecture et des données : $784$ pixels dont $67$ ne portent jamais d'encre donnent le même compte de zéros quel que soit l'ordre des lots. Celles de droite décrivent un point atteint au terme d'un trajet que la proposition 6 vient de montrer indéterminé.",
  },
  {
    id: "b-d11-22",
    type: "encart",
    ton: "note",
    titre: "Deux programmes, un même nombre",
    texte:
      "Le chapitre 2 a entraîné le réseau $784\\rightarrow 128\\rightarrow 10$ avec exactement ce protocole et un programme écrit séparément, dans un autre répertoire, et il obtient $0{,}9814$ et $186$ erreurs, comme la graine $0$ de la mesure 6. **Ce n'est pas un quatrième tirage** : les deux partagent la graine, donc la même initialisation et les mêmes permutations de lots, et c'est la même trajectoire parcourue deux fois. L'accord établit que le nombre ne dépend pas de l'implémentation et que les deux chapitres parlent du même réseau. Il n'établit **rien** sur la variation entre graines, que seules les trois graines mesurent, et qui vaut $12$ erreurs sur $10\\,000$.",
  },
  {
    id: "b-d11-23",
    type: "verification",
    numero: 34,
    enonce:
      "Deux équipes implémentent séparément le protocole de ce chapitre, sans se concerter sur autre chose que l'architecture, les données, la perte, $\\eta$, $B$ et le nombre d'époques. Elles ne partagent ni la graine ni l'ordre d'accumulation des sommes.",
    questions: [
      "Parmi ces cinq quantités, dire lesquelles les deux équipes devraient trouver identiques : le nombre de composantes nulles du gradient au point initial ; la précision de test finale ; la colonne $B(1/\\cos^{2}-1)$ ; la norme de $\\boldsymbol{\\theta}$ après trente époques ; le seuil de $11{,}35\\,\\%$ du chapitre 2.",
      "Justifier chaque réponse par la **nature** de la quantité, d'où elle est calculée et à quel moment, et non par la table ci-dessus.",
      "Une sixième quantité, le cosinus moyen d'un lot de $64$, est mesurée au point initial dans ce chapitre. Que deviendrait la réponse si on la mesurait après vingt époques ?",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11.5 · La dette h = 128
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d11-24",
    type: "titre",
    niveau: 2,
    texte: "Ce que la largeur achète",
  },
  {
    id: "b-d11-25",
    type: "texte",
    texte:
      "Le chapitre 2 a posé $h=128$ en annonçant que rien ne le justifiait. On ne le justifiera pas davantage ici par un raisonnement : on le mesure. Cinq largeurs, même protocole, même graine.",
  },
  {
    id: "b-d11-26",
    type: "sortie",
    ancre: "largeur",
    titre:
      "Cinq largeurs de couche cachée · cours/lecon3/mesures.py, mesure 11",
    texte:
      "    même protocole pour les cinq : graine 0, eta 0,5, 30 époques\n\n         h          p    acc_test   erreurs    secondes\n        32      25450     0.9622       378          21\n        64      50890     0.9774       226          27\n       128     101770     0.9814       186          33\n       256     203530     0.9829       171         101\n       512     407050     0.9842       158         177",
    lecture: [
      "**La précision monte avec $h$, sur toute la plage mesurée**, et $h=512$ fait mieux que $h=128$ avec $158$ erreurs contre $186$. Rien dans cette table ne désigne $128$ comme un optimum.",
      "Le rendement décroît nettement. De $32$ à $64$ les erreurs tombent de $378$ à $226$, soit $152$ de gagnées pour $25\\,440$ paramètres ; de $256$ à $512$ elles tombent de $171$ à $158$, soit $13$ de gagnées pour $203\\,520$ paramètres, autrement dit **huit fois plus de paramètres pour douze fois moins de gain**.",
      "La durée, elle, suit la taille : $21$ secondes pour $h=32$, $177$ pour $h=512$, soit un facteur $8$ pour un facteur $16$ sur $h$. C'est ce coût-là qu'on paie pour les $28$ erreurs gagnées entre $128$ et $512$.",
      "**Ce que la mesure ne dit pas**, et le texte s'arrête là : elle ne dit pas où s'arrêter, et elle ne mesure ni le sur-apprentissage, qui relève du chapitre d'évaluation, ni le coût mémoire, ni ce que donnerait $h=2\\,048$.",
      "$h=128$ est donc un **choix**, situé dans la zone où le rendement commence à décroître. C'est tout ce que la mesure permet d'en dire, et c'est déjà plus que ce que le chapitre 2 en disait.",
    ],
  },
  {
    id: "b-d11-27",
    type: "encart",
    ton: "rappel",
    titre: "Dette du chapitre 2 réglée : $h=128$",
    texte:
      "Le chapitre 2 annonçait $h=128$ comme non justifié. Il l'est maintenant, mais pas au sens où on l'attendrait : la mesure ne produit **aucune valeur optimale**. Elle montre une précision qui monte encore à $h=512$, et un rendement qui s'effondre. Choisir $128$ est un arbitrage entre précision et coût, pas la solution d'un problème, et une dette réglée peut l'être par un « il n'y a pas de réponse unique », à condition de le montrer.",
  },
];
