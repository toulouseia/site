import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 9 · Pourquoi on n'utilise pas tout le jeu
//
// ÉCART N°5 : la source ne traite pas les mini-lots. Le chapitre 2 les emploie
// déjà, sans les justifier. Cette page les justifie par deux propositions, et
// vérifie la seconde par une mesure dont la dernière colonne est celle que la
// théorie prédit constante.
//
// DEUX SECTIONS S'OUVRAIENT SUR « PROPOSITION 4 » ET « PROPOSITION 5 », sans
// titre : le lecteur tombait sur un énoncé numéroté avant de savoir ce qu'on
// cherchait. Chacune porte désormais un titre qui dit ce qu'on va apprendre,
// et une phrase qui pose la question à laquelle la proposition répond.
//
// L'espérance, la variance et le cosinus sont posés au STRICT nécessaire, avec
// dette explicite vers le chapitre de probabilités : ce chapitre a besoin de la
// linéarité de l'espérance et de rien d'autre.
//
// La dette « mini-lots de 64 » du chapitre 2 est réglée ici.
// Tous les nombres sortent de cours/lecon3/mesures.py, mesure 5.
// ─────────────────────────────────────────────────────────────────────────────

export const D09_MINI_LOTS: Bloc[] = [
  {
    id: "b-d9-0",
    type: "texte",
    texte:
      "Faire un pas demande le gradient, et le gradient demande les soixante mille images. Faut-il vraiment les regarder toutes pour avancer une fois ?",
  },
  {
    id: "b-d9-fig20",
    type: "image",
    ancre: "le-nuage-des-lots",
    src: "/cours/lecon3/l3-fig20-le-nuage-des-lots.svg",
    largeur: 1380,
    hauteur: 680,
    alt: "Cinq éventails côte à côte, un par taille de lot, portant dessous les mentions B égale un, huit, soixante-quatre, cinq cent douze et quatre mille quatre-vingt-seize. Dans chacun, un trait gris vertical donne la direction du gradient complet, et trente ronds gris marquent chacun la direction d'un tirage, placés à l'angle mesuré. Un trait brique donne l'angle moyen. L'éventail est très ouvert à gauche et se referme progressivement jusqu'à n'être presque plus qu'un trait à droite, et l'angle moyen est porté sous chaque éventail.",
    legende:
      "Trente tirages par taille, tous au même point de l'espace des paramètres. Seule la direction compte ici, jamais la longueur.",
  },
  {
    id: "b-d9-1",
    type: "texte",
    texte:
      "La règle $(8.4)$ demande $\\mathrm{grad}\\,C_{\\mathcal{D}}$, donc une passe sur le jeu entier à chaque pas, et un entraînement de $28\\,140$ pas en demanderait $28\\,140$.",
  },
  {
    id: "b-d9-2",
    type: "texte",
    texte:
      "Un pas de la règle $(8.4)$ demande $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$, et $C_{\\mathcal{D}}$ est une moyenne sur $60\\,000$ exemples : chaque pas coûte donc **une passe complète sur le jeu**. Trente époques de descente à jeu complet feraient trente pas. Le chapitre 2 en a fait $28\\,140$ dans le même temps, en évaluant à chaque fois sur $64$ images seulement, et il ne l'a jamais justifié.",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 9.1 · Le lot
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d9-4",
    type: "titre",
    niveau: 2,
    texte: "Le lot, et ce qu'on en attend",
  },
  {
    id: "b-d9-5",
    type: "definition",
    terme: "Mini-lot",
    anglais: "mini-batch",
    texte:
      "Une partie $\\mathcal{B}\\subseteq[\\![1,N]\\!]$ de cardinal $B$, tirée uniformément au hasard **sans remise**. Le coût sur ce lot est $C_{\\mathcal{B}}(\\boldsymbol{\\theta})=\\frac{1}{B}\\sum_{n\\in\\mathcal{B}}\\ell\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)}),c^{(n)}\\big)$, de $\\mathbb{R}^{p}$ dans $\\mathbb{R}_{\\geq 0}$, la même forme que $C_{\\mathcal{D}}$ sur moins d'exemples.",
  },
  {
    id: "b-d9-6",
    type: "texte",
    texte:
      "Quatre notions de probabilité suffisent ici, et elles sont posées au strict nécessaire. La **probabilité** $\\mathbb{P}(A)$ d'un événement est la part des tirages où il se produit. L'**espérance** $\\mathbb{E}[\\cdot]$ d'un vecteur aléatoire est le vecteur des espérances de ses coordonnées, et elle est **linéaire**. La **variance** d'un vecteur aléatoire $V$ autour de sa moyenne est $\\mathbb{E}\\|V-\\mathbb{E}V\\|^{2}$, un scalaire positif ; un vecteur aléatoire est dit **centré** quand son espérance est nulle. Le cadre général, espace probabilisé, indépendance, existence des moments, appartient au **chapitre de probabilités**, et la proposition 5 emprunte à ce cadre une propriété que ce chapitre ne démontre pas : la variance d'une moyenne de $B$ vecteurs indépendants de même variance $\\sigma^{2}$ vaut $\\sigma^{2}/B$.",
  },
  {
    id: "b-d9-7",
    type: "formule",
    ancre: "cosinus",
    latex:
      "\\cos(\\mathbf{u},\\mathbf{v})=\\frac{\\langle\\mathbf{u},\\mathbf{v}\\rangle}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|}\\ \\in[-1,1],\\qquad \\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^{p}\\setminus\\{\\mathbf{0}\\}",
    alt: "Le cosinus de u et v vaut le produit scalaire de u et v divisé par le produit de leurs normes, et cette quantité appartient à l'intervalle de moins un à un. Les vecteurs u et v sont pris dans l'espace à p dimensions privé du vecteur nul.",
    numero: "9.1",
    legende:
      "Il vaut $1$ pour deux vecteurs de même direction et de même sens, $0$ pour deux vecteurs orthogonaux. Il ne dépend **pas** des longueurs, et c'est ce qui en fait la bonne mesure ici, puisque seule la direction du pas nous intéresse.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.2 · Proposition 4
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d9-8",
    type: "titre",
    niveau: 2,
    texte: "Un lot se trompe, mais il ne triche pas",
  },
  {
    id: "b-d9-9",
    type: "texte",
    texte:
      "Soixante-quatre images ne donnent évidemment pas le gradient des soixante mille. La question n'est pas de savoir si le lot se trompe, c'est de savoir **s'il se trompe toujours du même côté**. Un écart qui se répète s'accumule sur des milliers de pas ; un écart qui change de sens à chaque tirage se compense.",
  },
  {
    id: "b-d9-8b",
    type: "texte",
    texte:
      "Une quantité tirée au hasard est dite **sans biais** pour une cible quand sa moyenne sur tous les tirages possibles vaut exactement cette cible. Le mot n'a rien à voir avec les biais $\\mathbf{b}^{[l]}$ du réseau : il dit seulement qu'un tirage se trompe sans pencher.",
  },
  {
    id: "b-d9-10",
    type: "derivation",
    ancre: "proposition-4",
    titre: "Proposition 4 · Le gradient d'un lot est sans biais",
    hypotheses: [
      "$\\mathcal{B}$ est de cardinal $B$, tiré uniformément sans remise dans $[\\![1,N]\\!]$.",
      "$\\mathbf{g}_{n}=\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)}),c^{(n)}\\big)\\in\\mathbb{R}^{p}$ est le gradient de la perte du seul exemple $n$.",
      "$\\boldsymbol{\\theta}$ est **fixé** : l'aléa ne porte que sur le tirage du lot.",
    ],
    proprietes: [
      "Linéarité de l'espérance",
      "Symétrie du tirage uniforme : chaque indice a la même probabilité $B/N$ d'appartenir à $\\mathcal{B}$",
    ],
    etapes: [
      {
        texte:
          "Le gradient est linéaire en la fonction qu'il dérive, et $C_{\\mathcal{B}}$ est une moyenne. Donc :",
      },
      {
        latex:
          "\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{B}}(\\boldsymbol{\\theta})=\\frac{1}{B}\\sum_{n\\in\\mathcal{B}}\\mathbf{g}_{n}=\\frac{1}{B}\\sum_{n=1}^{N}\\mathbb{1}\\{n\\in\\mathcal{B}\\}\\,\\mathbf{g}_{n}",
        alt: "Le gradient du coût sur le lot vaut un sur B fois la somme des g n pour n dans le lot, ce qui s'écrit aussi un sur B fois la somme, pour n allant de un à N, de l'indicatrice de l'appartenance de n au lot, multipliée par g n.",
        justification:
          "La seconde écriture fait porter tout l'aléa sur les indicatrices, et les $\\mathbf{g}_{n}$ deviennent des constantes.",
      },
      {
        latex:
          "\\mathbb{E}\\big[\\mathbb{1}\\{n\\in\\mathcal{B}\\}\\big]=\\mathbb{P}(n\\in\\mathcal{B})=\\frac{B}{N}\\qquad\\text{pour tout } n\\in[\\![1,N]\\!]",
        alt: "L'espérance de l'indicatrice de l'appartenance de n au lot vaut la probabilité que n appartienne au lot, c'est-à-dire B sur N, et ceci pour tout n entre un et N.",
        justification:
          "Le tirage est uniforme sans remise : les $\\binom{N}{B}$ parties de cardinal $B$ sont équiprobables, et $\\binom{N-1}{B-1}/\\binom{N}{B}=B/N$ d'entre elles contiennent un indice donné.",
      },
      {
        latex:
          "\\mathbb{E}\\big[\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{B}}\\big]=\\frac{1}{B}\\sum_{n=1}^{N}\\frac{B}{N}\\,\\mathbf{g}_{n}=\\frac{1}{N}\\sum_{n=1}^{N}\\mathbf{g}_{n}=\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})",
        alt: "L'espérance du gradient du coût sur le lot vaut un sur B fois la somme des B sur N fois g n, c'est-à-dire un sur N fois la somme des g n, c'est-à-dire le gradient du coût sur le jeu entier.",
        justification:
          "Linéarité de l'espérance, puis simplification de $B$, puis reconnaissance de la moyenne des $\\mathbf{g}_{n}$.",
      },
    ],
    resultat: {
      latex:
        "\\mathbb{E}\\big[\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{B}}(\\boldsymbol{\\theta})\\big]=\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})",
      alt: "L'espérance du gradient du coût sur un lot tiré au hasard est égale au gradient du coût sur le jeu entier.",
    },
    interpretation:
      "Un lot ne donne **pas** le bon gradient, il en donne un autre, et la page le mesure. Mais il ne se trompe pas **systématiquement** : en moyenne sur les tirages, il vise juste. C'est cela qui autorise à l'employer, puisque les erreurs de direction se compensent d'un pas au suivant au lieu de s'accumuler.",
    limites: [
      "La proposition ne dit rien de l'écart d'**un** tirage au gradient complet. C'est l'objet de la proposition 5.",
      "Elle suppose $\\boldsymbol{\\theta}$ fixé. Au cours d'un entraînement, $\\boldsymbol{\\theta}$ change à chaque pas et dépend des lots précédents : l'énoncé s'applique à chaque pas pris isolément, pas à la trajectoire entière.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9.3 · Proposition 5
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d9-11",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'un lot deux fois plus grand achète",
  },
  {
    id: "b-d9-12",
    type: "texte",
    texte:
      "Viser juste en moyenne ne dit pas de combien on se trompe à chaque tirage, et c'est pourtant ce qui décide de la taille du lot. Il reste donc à relier l'écart typique à $B$.",
  },
  {
    id: "b-d9-13",
    type: "derivation",
    ancre: "proposition-5",
    titre:
      "Proposition 5 · La qualité d'un lot croît comme la racine de sa taille",
    hypotheses: [
      "$\\mathbf{g}=\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})$, et $\\mathbf{g}_{\\mathcal{B}}$ le gradient d'un lot de taille $B$.",
      "**Hypothèse de travail** : les $\\mathbf{g}_{n}$ du lot sont tirés indépendamment, de variance finie $\\sigma^{2}=\\mathbb{E}\\|\\mathbf{g}_{n}-\\mathbf{g}\\|^{2}$.",
      "$\\kappa=\\sigma^{2}/\\|\\mathbf{g}\\|^{2}$, un nombre sans dimension qui ne dépend que du point $\\boldsymbol{\\theta}$ et du jeu.",
    ],
    proprietes: [
      "La variance d'une moyenne de $B$ variables indépendantes de même variance $\\sigma^{2}$ vaut $\\sigma^{2}/B$",
      "Décomposition orthogonale : $\\mathbf{g}_{\\mathcal{B}}=\\mathbf{g}+(\\mathbf{g}_{\\mathcal{B}}-\\mathbf{g})$, dont le second terme est centré",
    ],
    etapes: [
      {
        latex:
          "\\mathbb{E}\\big\\|\\mathbf{g}_{\\mathcal{B}}-\\mathbf{g}\\big\\|^{2}=\\frac{\\sigma^{2}}{B}",
        alt: "L'espérance du carré de la norme de l'écart entre le gradient du lot et le gradient complet vaut sigma carré divisé par B.",
        justification:
          "$\\mathbf{g}_{\\mathcal{B}}$ est la moyenne de $B$ termes indépendants d'espérance $\\mathbf{g}$, par la proposition 4.",
      },
      {
        texte:
          "Écrivons $\\mathbf{g}_{\\mathcal{B}}=\\mathbf{g}+\\mathbf{r}$, où $\\mathbf{r}=\\mathbf{g}_{\\mathcal{B}}-\\mathbf{g}$ est le bruit du tirage. Par la proposition 4 il est centré, donc $\\mathbb{E}\\langle\\mathbf{g},\\mathbf{r}\\rangle=\\langle\\mathbf{g},\\mathbb{E}\\mathbf{r}\\rangle=0$ : **en moyenne** le bruit est orthogonal au signal. Il vient alors deux identités en espérance :",
      },
      {
        latex:
          "\\mathbb{E}\\langle\\mathbf{g}_{\\mathcal{B}},\\mathbf{g}\\rangle=\\|\\mathbf{g}\\|^{2},\\qquad \\mathbb{E}\\|\\mathbf{g}_{\\mathcal{B}}\\|^{2}=\\|\\mathbf{g}\\|^{2}+\\mathbb{E}\\|\\mathbf{r}\\|^{2}=\\|\\mathbf{g}\\|^{2}+\\frac{\\sigma^{2}}{B}",
        alt: "L'espérance du produit scalaire du gradient du lot par le gradient complet vaut la norme au carré de g. L'espérance de la norme au carré du gradient du lot vaut la norme au carré de g plus l'espérance de la norme au carré du bruit, c'est-à-dire la norme au carré de g plus sigma carré sur B.",
        justification:
          "La première vient de la linéarité et de $\\mathbb{E}\\mathbf{r}=\\mathbf{0}$ ; la seconde développe $\\|\\mathbf{g}+\\mathbf{r}\\|^{2}=\\|\\mathbf{g}\\|^{2}+2\\langle\\mathbf{g},\\mathbf{r}\\rangle+\\|\\mathbf{r}\\|^{2}$ et prend l'espérance, le terme croisé s'annulant.",
      },
      {
        latex:
          "\\mathbb{E}\\big[\\cos^{2}(\\mathbf{g}_{\\mathcal{B}},\\mathbf{g})\\big]\\ \\approx\\ \\frac{\\|\\mathbf{g}\\|^{2}}{\\|\\mathbf{g}\\|^{2}+\\sigma^{2}/B}=\\frac{1}{1+\\kappa/B}",
        alt: "L'espérance du carré du cosinus entre le gradient du lot et le gradient complet vaut approximativement la norme au carré de g divisée par la somme de cette norme au carré et de sigma carré sur B, ce qui vaut un divisé par un plus kappa sur B.",
        justification:
          "**C'est ici qu'est l'approximation, et c'est la seule.** $\\cos^{2}$ est le quotient $\\langle\\mathbf{g}_{\\mathcal{B}},\\mathbf{g}\\rangle^{2}/(\\|\\mathbf{g}_{\\mathcal{B}}\\|^{2}\\|\\mathbf{g}\\|^{2})$, et l'on remplace l'espérance de ce quotient par le quotient des espérances calculées ci-dessus. Les deux ne sont égales que si la dispersion est petite, et la mesure de $B=1$ montrera ce qu'il advient quand elle ne l'est pas.",
      },
      {
        latex:
          "\\frac{1}{\\mathbb{E}[\\cos^{2}]}-1=\\frac{\\kappa}{B}\\qquad\\Longleftrightarrow\\qquad B\\left(\\frac{1}{\\mathbb{E}[\\cos^{2}]}-1\\right)=\\kappa",
        alt: "Un divisé par l'espérance du carré du cosinus, moins un, vaut kappa sur B ; de façon équivalente, B multiplié par cette quantité est égal à kappa.",
        justification:
          "Inversion de la relation précédente. Le membre de gauche porte $\\mathbb{E}[\\cos^{2}]$ et non $\\cos^{2}$ : la table de mesure substituera le carré du cosinus **moyen**, et dira ce que cette substitution coûte.",
      },
    ],
    resultat: {
      latex:
        "B\\left(\\frac{1}{\\cos^{2}(\\mathbf{g}_{\\mathcal{B}},\\mathbf{g})}-1\\right)\\ \\text{ ne dépend pas de }B",
      alt: "La quantité B multipliée par un sur le carré du cosinus moins un ne dépend pas de B.",
    },
    interpretation:
      "Pour $B$ grand, $\\cos\\approx 1-\\kappa/(2B)$ : **l'écart au bon gradient décroît comme $1/B$, donc l'angle comme $1/\\sqrt{B}$.** Multiplier la taille du lot par quatre divise l'angle par deux, et c'est un rendement décroissant, puisque le passage de $8$ à $64$ gagne bien plus que celui de $512$ à $4\\,096$. C'est cet arbitrage qui décide de la taille employée.",
    limites: [
      "L'hypothèse d'indépendance est fausse pour un tirage **sans remise** ; elle est acceptable ici parce que $B\\ll N$.",
      "L'approximation de l'espérance du quotient est nommée et non justifiée : elle appartient au chapitre de probabilités.",
      "La proposition parle du cosinus **moyen**. Elle ne dit rien de sa dispersion, et la mesure ci-dessous montre que cette dispersion décide de la validité de la lecture.",
    ],
  },
  {
    id: "b-d9-fig21",
    type: "image",
    ancre: "langle-par-taille",
    src: "/cours/lecon3/l3-fig21-langle-par-taille.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Une courbe décroissante joint cinq ronds, un par taille de lot. L'axe horizontal porte les tailles un, huit, soixante-quatre, cinq cent douze et quatre mille quatre-vingt-seize, espacées régulièrement, sous la mention images par pas. Au-dessus de chaque rond est inscrit l'angle mesuré en degrés, du plus grand à gauche au plus petit à droite. La courbe tombe vite entre les deux premières tailles puis s'aplatit.",
    legende:
      "Chaque cran de l'axe horizontal multiplie le calcul par huit. Le gain, lui, ne suit pas.",
  },
  {
    id: "b-d9-14",
    type: "sortie",
    ancre: "taille-du-lot",
    titre:
      "Cinq tailles de lot, 30 tirages chacune · cours/lecon3/mesures.py, mesure 5",
    texte:
      "    gradient complet sur les 60000 exemples, norme 1.355255\n\n         B    cos moyen   écart-type   B(1/cos²-1)\n         1      0.0898       0.1992          123.1\n         8      0.3699       0.1434           50.5\n        64      0.7587       0.0594           47.2\n       512      0.9580       0.0067           45.9\n      4096      0.9949       0.0012           42.0\n\n         B    angle (degrés)\n         1       84.9\n         8       68.3\n        64       40.6\n       512       16.7\n      4096        5.8",
    lecture: [
      "**La dernière colonne est celle que la proposition 5 prédit constante, à une substitution près qu'il faut dire.** La proposition porte sur $\\mathbb{E}[\\cos^{2}]$ ; le programme, lui, calcule $B\\big(1/\\overline{\\cos}^{2}-1\\big)$ à partir du cosinus **moyen**. Les deux coïncident quand la dispersion est petite devant la moyenne, et se séparent sinon.",
      "De $B=8$ à $B=4\\,096$ la colonne vaut entre $42{,}0$ et $50{,}5$, soit une variation de $20\\,\\%$ pendant que $B$ est multiplié par $512$ : la loi tient là où la substitution est légitime.",
      "**À $B=1$ elle vaut $123{,}1$, et c'est la substitution qui casse, pas la loi.** L'écart-type, $0{,}1992$, dépasse le **double** de la moyenne, $0{,}0898$ ; or $\\mathbb{E}[\\cos^{2}]$ vaut la moyenne au carré **plus** la variance, soit $0{,}0898^{2}+0{,}1992^{2}=0{,}0477$, et la colonne recalculée sur cette valeur donne $19{,}9$ au lieu de $123{,}1$. À $B=1$, la direction d'un tirage n'a plus de valeur typique, et aucune des deux quantités ne renseigne.",
      "**Un lot de $64$ pointe à $\\cos=0{,}7587$ du bon gradient, soit un angle de $40{,}6$ degrés.** Chaque pas de l'entraînement du chapitre 2 partait donc franchement de travers, et le réseau a atteint $98{,}14\\,\\%$. C'est le fait à retenir de cette page.",
      "Le rendement décroît vite : passer de $8$ à $64$ fait tomber l'angle de $68$ à $41$ degrés pour huit fois plus de calcul, et passer de $512$ à $4\\,096$ le fait tomber de $17$ à $6$ degrés pour huit fois plus encore. La règle « quatre fois plus d'images, deux fois moins d'angle » ne se lit d'ailleurs proprement qu'en bas de table, là où les angles sont petits : de $512$ à $4\\,096$ l'angle est divisé par $2{,}9$ pour un facteur $8$, ce qu'annonce $1/\\sqrt{B}$, alors que de $8$ à $64$ il ne l'est que par $1{,}7$.",
    ],
  },
  {
    id: "b-d9-16",
    type: "animation",
    ancre: "le-lot-vise-a-cote-du-gradient",
    animationId: "le-lot-vise-a-cote-du-gradient",
    legende:
      "Le gradient complet, et autour de lui l'éventail des gradients de lot : chacun vise à côté, et l'éventail se resserre à mesure que le lot grandit.",
  },
  {
    id: "b-d9-17",
    type: "encart",
    ton: "rappel",
    titre: "Dette du chapitre 2 réglée : les mini-lots de 64",
    texte:
      "Le chapitre 2 tirait des lots de $64$ sans dire pourquoi $64$, ni pourquoi des lots. Les deux réponses sont ici. **Pourquoi des lots** : la proposition 4, puisque en moyenne un lot vise juste et que les erreurs de direction se compensent au lieu de s'accumuler. **Pourquoi $64$** : la proposition 5 et la table, puisque c'est le palier où l'angle est déjà tombé sous $45$ degrés, et au-delà duquel chaque division de l'angle par deux coûte quatre fois plus de calcul. Ce n'est pas une valeur optimale, c'est un arbitrage, et il se lit dans la table.",
  },
  {
    id: "b-d9-18",
    type: "verification",
    numero: 29,
    enonce: "Un lot de $64$ pointe à $\\cos=0{,}7587$ du gradient complet.",
    questions: [
      "À quel angle cela correspond-il ?",
      "Pourquoi la descente fonctionne-t-elle malgré un écart pareil à chaque pas ?",
      "Que se passerait-il si l'écart était systématiquement du même côté au lieu d'être tiré au hasard ? Répondre en citant la proposition 4.",
    ],
  },
  {
    id: "b-d9-19",
    type: "verification",
    numero: 30,
    enonce:
      "La proposition 5 se vérifie en interpolant une valeur qui n'a pas été mesurée.",
    questions: [
      "D'après la proposition 5 et la valeur de $\\kappa$ lue dans la table, quel cosinus attendrait-on pour un lot de $256$ ?",
      "Comparer à la valeur mesurée pour $512$ et dire si l'ordre de grandeur est cohérent.",
      "À quelle taille de lot faudrait-il aller pour descendre sous $1$ degré ? Le calcul est-il raisonnable ?",
    ],
  },
];
