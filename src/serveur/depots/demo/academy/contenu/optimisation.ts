import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// L'optimisation de l'entraînement : le cadre, la direction, les données.
//
// Tous les nombres cités dans ces blocs sortent de programmes exécutés, dont le
// code est versionné dans cours/ à la racine de l'application :
//
//   cours/donnees.py             MNIST, mis en forme
//   cours/reseau.py              le MLP 784-128-10, à la main
//   cours/lecon3/experiences.py  E1 à E4
//   cours/lecon3/figures.py      les quatre figures
//
// Rien ici n'est affirmé sans que la mesure correspondante existe. Quand une
// mesure contredit ce qu'on attendait, c'est la mesure qui est écrite.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_OPTIMISATION: Record<string, Bloc[]> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // Le cadre du cours
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-0": [
    {
      id: "b-o0-1",
      type: "texte",
      texte:
        "Nous savons calculer $\\operatorname{grad}_{\\theta}\\mathcal{L}$ exactement. Nous n'avons jamais prouvé **pourquoi cette direction**, ni **pourquoi ce signe**, ni **quelle longueur de pas**, ni **d'où partir**, et nous avons entraîné sur des mini-lots sans jamais dire pourquoi le lot complet ne convient pas. Ce cours rembourse ces cinq dettes.",
    },
    {
      id: "b-o0-2",
      type: "encart",
      ton: "note",
      titre: "Une règle tenue de bout en bout",
      texte:
        "Aucun outil n'est introduit avant que l'échec de ce qui précède soit **prouvé par une mesure**. Chaque affirmation chiffrée provient d'un programme exécuté, dont le code est dans le dépôt. Quand la mesure contredit ce que la théorie laissait attendre, c'est la mesure qui est écrite, et l'écart est expliqué.",
    },
    {
      id: "b-o0-3",
      type: "titre",
      niveau: 2,
      texte: "Le fil conducteur",
    },
    {
      id: "b-o0-4",
      type: "texte",
      texte:
        "Un seul, tenu du début à la fin : le réseau $784\\to 128\\to 10$ sur les chiffres manuscrits, celui du cours précédent. Aucun changement de sujet en cours de route. Tous les chiffres portent sur ce réseau, sur les 60 000 exemples d'entraînement et les 10 000 de test, graine fixée à 0.",
    },
    {
      id: "b-o0-5",
      type: "encart",
      ton: "attention",
      titre: "Avant toute mesure : le gradient est-il juste ?",
      texte:
        "Le gradient analytique a été confronté aux différences finies centrées sur douze coordonnées tirées au hasard. Écart relatif maximal : $1{,}10\\cdot 10^{-6}$. Le compte de paramètres est de $101\\,770$, conforme au cours précédent. **Sans cette vérification, aucune des huit expériences qui suivent ne prouverait quoi que ce soit.**",
    },
    {
      id: "b-o0-6",
      type: "titre",
      niveau: 2,
      texte: "Ce que ce cours utilise, et ce qu'il prépare",
    },
    {
      id: "b-o0-7",
      type: "tableau",
      cleEnTete: true,
      entetes: ["", "Quoi"],
      lignes: [
        [
          "Il utilise",
          "La règle de mise à jour et la descente à une variable ; le risque empirique, l'entropie croisée, le résultat $\\operatorname{grad}_{z}\\ell = a - y$, la rétropropagation, et l'architecture à $101\\,770$ paramètres.",
        ],
        [
          "Il prépare",
          "Le cours sur le sur-apprentissage, qui a besoin de séparer *ce qui ne converge pas* de *ce qui converge vers le mauvais endroit* : la page 3 fabrique les deux situations. Les optimiseurs à moment se dériveront des défauts établis à la page 4.",
        ],
      ],
    },
    {
      id: "b-o0-8",
      type: "titre",
      niveau: 2,
      texte: "Les dettes annoncées",
    },
    {
      id: "b-o0-9",
      type: "texte",
      texte:
        "Trois notions sont utilisées ici sans être démontrées. Les annoncer n'est pas une précaution de style : c'est ce qui distingue un cours d'un exposé.",
    },
    {
      id: "b-o0-10",
      type: "encart",
      ton: "rappel",
      titre: "La règle de la chaîne multivariée",
      texte:
        "Utilisée à la page 7 sans être démontrée. Elle le sera dans le cours consacré au calcul différentiel. En attendant, sa conséquence est vérifiée numériquement : écart relatif de $1{,}10\\cdot10^{-6}$ entre gradient analytique et différences finies.",
    },
    {
      id: "b-o0-11",
      type: "encart",
      ton: "rappel",
      titre: "La convergence de la descente stochastique",
      texte:
        "Au sens : $\\theta_t$ converge vers un point critique sous les conditions $\\sum\\eta_t=\\infty$ et $\\sum\\eta_t^2<\\infty$. Utilisée à la page 3, démontrée dans un cours ultérieur sur l'optimisation stochastique.",
    },
    {
      id: "b-o0-12",
      type: "encart",
      ton: "rappel",
      titre: "Le lien entre courbure et vitesse en dimension p",
      texte:
        "Démontré ici pour une fonction **quadratique** seulement. Le réseau ne l'est pas : pour lui, nous mesurons. La théorie non convexe est renvoyée à un cours ultérieur.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 2 · la direction, et le signe
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-1": [
    {
      id: "b-o1-1",
      type: "texte",
      texte:
        "Depuis deux cours nous écrivons la règle de mise à jour, et nous n'avons **jamais prouvé** ni pourquoi c'est *cette* direction, ni pourquoi c'est *moins*. Nous avons dit « on descend la pente », une formulation qui ne dit rien de vérifiable. Réglons cela.",
    },
    {
      id: "b-o1-2",
      type: "formule",
      ancre: "regle",
      latex:
        "\\theta_{t+1} = \\theta_{t} - \\eta\\,\\operatorname{grad}_{\\theta}\\mathcal{L}(\\theta_{t})",
      alt: "Thêta à l'instant t plus un égale thêta à l'instant t moins êta fois le gradient de la perte évalué en thêta t.",
      numero: "1",
      legende:
        "La question précise : parmi toutes les directions possibles, laquelle fait baisser la perte le plus vite ?",
    },
    {
      id: "b-o1-3",
      type: "texte",
      texte:
        "Il faut d'abord définir « direction » et « le plus vite ». Une direction est un vecteur $u$ de norme $1$. La contrainte $\\|u\\|=1$ est **indispensable** : sans elle, il suffirait d'allonger $u$ pour faire baisser la perte davantage, et la question n'aurait pas de réponse.",
    },
    {
      id: "b-o1-4",
      type: "titre",
      niveau: 2,
      texte: "Le signe, en une variable : les trois cas",
    },
    {
      id: "b-o1-5",
      type: "texte",
      texte:
        "Commençons par une seule variable, où tout se voit. Soit $f$ dérivable en $\\theta$, et le pas $\\theta_{t+1}=\\theta_t-\\eta f'(\\theta_t)$ avec $\\eta>0$. Trois cas, et trois seulement.",
    },
    {
      id: "b-o1-6",
      type: "tableau",
      cleEnTete: true,
      entetes: ["Cas", "Où faut-il aller", "Signe du pas", "Verdict"],
      lignes: [
        ["$f'(\\theta_t) > 0$", "la fonction croît : vers la **gauche**", "négatif", "✓"],
        ["$f'(\\theta_t) < 0$", "la fonction décroît : vers la **droite**", "positif", "✓"],
        ["$f'(\\theta_t) = 0$", "nulle part", "nul, l'algorithme s'arrête", "✓"],
      ],
      legende:
        "Le signe moins n'est pas une convention : il est imposé par l'exigence « aller là où f décroît », dans chacun des trois cas. Le troisième cas est aussi ce qui fait s'arrêter l'algorithme à un maximum ou à un point selle, ce qu'on ne veut pas.",
    },
    {
      id: "b-o1-7",
      type: "titre",
      niveau: 2,
      texte: "La direction, en p variables",
    },
    {
      id: "b-o1-8",
      type: "derivation",
      ancre: "cauchy-schwarz",
      titre: "L'opposé du gradient est la direction de plus forte décroissance",
      hypotheses: [
        "$f$ de $\\mathbb{R}^p$ dans $\\mathbb{R}$ est **différentiable** en $\\theta$",
        "$g=\\operatorname{grad}f(\\theta)$ est non nul",
        "$u$ parcourt la sphère unité, c'est-à-dire $\\|u\\|=1$",
      ],
      depart: {
        latex:
          "D_{u}f(\\theta) \\;=\\; \\lim_{h\\to 0^{+}}\\frac{f(\\theta+hu)-f(\\theta)}{h}",
        alt: "La dérivée directionnelle de f en thêta selon u est la limite, quand h tend vers zéro par valeurs positives, du quotient f de thêta plus h u moins f de thêta, sur h.",
      },
      chaine: "u  →  θ + h u  →  f(θ + h u)",
      proprietes: [
        "La **définition de la différentiabilité** : $f(\\theta+h)=f(\\theta)+\\langle g,h\\rangle+o(\\|h\\|)$",
        "L'**inégalité de Cauchy-Schwarz** et son cas d'égalité",
      ],
      etapes: [
        {
          texte:
            "On applique la différentiabilité avec l'accroissement $h\\,u$, dont la norme vaut $h$ puisque $u$ est unitaire.",
          latex: "f(\\theta+hu)=f(\\theta)+h\\,\\langle g,u\\rangle+o(h)",
          alt: "f de thêta plus h u égale f de thêta plus h fois le produit scalaire de g et u, plus un petit o de h.",
          justification: "définition de la différentiabilité",
        },
        {
          texte:
            "On soustrait $f(\\theta)$, on divise par $h>0$, et on fait tendre $h$ vers zéro. Le terme en $o(h)/h$ disparaît.",
          latex: "D_{u}f(\\theta)=\\langle g,u\\rangle",
          alt: "La dérivée directionnelle de f selon u égale le produit scalaire de g et de u.",
          justification: "passage à la limite",
        },
        {
          texte: "Cauchy-Schwarz encadre ce produit scalaire, pour tout $u$ de norme $1$.",
          latex:
            "-\\|g\\| \\;=\\; -\\|g\\|\\,\\|u\\| \\;\\le\\; \\langle g,u\\rangle \\;\\le\\; \\|g\\|\\,\\|u\\| \\;=\\; \\|g\\|",
          alt: "Moins la norme de g est inférieure ou égale au produit scalaire de g et u, lui-même inférieur ou égal à la norme de g.",
          justification: "Cauchy-Schwarz, avec la norme de u égale à 1",
        },
        {
          texte:
            "Le cas d'égalité exige $u$ colinéaire à $g$ ; comme $\\|u\\|=1$, les deux seuls candidats sont $\\pm g/\\|g\\|$. On vérifie directement que la borne est atteinte.",
          latex:
            "\\left\\langle g,\\ \\frac{g}{\\|g\\|}\\right\\rangle=\\frac{\\langle g,g\\rangle}{\\|g\\|}=\\frac{\\|g\\|^{2}}{\\|g\\|}=\\|g\\|",
          alt: "Le produit scalaire de g avec g sur norme de g égale norme de g au carré sur norme de g, égale norme de g.",
          justification: "cas d'égalité de Cauchy-Schwarz, puis calcul direct",
        },
      ],
      resultat: {
        latex:
          "\\arg\\min_{\\|u\\|=1} D_{u}f(\\theta) \\;=\\; -\\frac{\\operatorname{grad}f(\\theta)}{\\|\\operatorname{grad}f(\\theta)\\|}, \\qquad D_{u}f=-\\|\\operatorname{grad}f(\\theta)\\|",
        alt: "La direction unitaire qui minimise la dérivée directionnelle est l'opposé du gradient normalisé, et la valeur atteinte est moins la norme du gradient.",
      },
      interpretation:
        "La direction opposée au gradient n'est pas *une* bonne direction : c'est **la meilleure**, et la borne qu'elle atteint vaut exactement $\\|\\operatorname{grad}f\\|$. Ce nombre est donc à la fois la pente maximale et la mesure de « à quel point on n'est pas à un point critique ».",
      limites: [
        "La preuve est **locale** : elle ne dit rien au-delà d'un déplacement infinitésimal. Rien ne garantit qu'un pas fini fasse baisser la perte. C'est l'objet de la page 4.",
        "Elle suppose $f$ **différentiable**. La ReLU ne l'est pas en zéro (page 7).",
        "« Plus forte décroissance » est relatif à la **norme euclidienne**. Changer de norme change la direction optimale : c'est l'idée qui donnera plus tard le gradient naturel.",
      ],
    },
    {
      id: "b-o1-9",
      type: "titre",
      niveau: 2,
      texte: "La borne est-elle serrée ?",
    },
    {
      id: "b-o1-10",
      type: "texte",
      texte:
        "La preuve dit que $\\langle g,u\\rangle\\le\\|g\\|$. Une borne peut être vraie et molle. Mesurons : réseau $784\\to128\\to10$, initialisation Xavier, graine 0, 512 exemples ; on calcule $g$ dans $\\mathbb{R}^{101\\,770}$, puis on tire 2000 directions unitaires au hasard.",
    },
    {
      id: "b-o1-11",
      type: "sortie",
      titre: "python cours/lecon3/experiences.py E1",
      texte: `  p = 101770          ||grad|| = 0.940183

  Derivee directionnelle <grad, u> pour 2000 directions unitaires tirees au hasard :
    maximum observe        0.012205
    minimum observe        -0.008903
    ecart-type             0.002975
    borne theorique +||g||  0.940183
    meilleure direction tiree / borne = 0.0130

  Direction u = grad/||grad||    <grad, u> = 0.940183   (= ||grad||)
  Direction u = -grad/||grad||   <grad, u> = -0.940183   (= -||grad||)

  Effet reel d'un pas de 0.0001 (perte de depart 2.414597) :
    direction           L(theta + eps u)     variation   prevue eps<g,u>
    +grad/||grad||            2.41469140      9.40e-05          9.40e-05
    -grad/||grad||            2.41450336     -9.40e-05         -9.40e-05
    aleatoire 1               2.41459749      1.28e-07          1.28e-07
    aleatoire 2               2.41459712     -2.49e-07         -2.49e-07
    aleatoire 3               2.41459727     -9.86e-08         -9.86e-08`,
      lecture: [
        "La **meilleure** des 2000 directions tirées atteint $0{,}012205$, soit **1,30 %** de la borne. Tirer au hasard dans $\\mathbb{R}^{101\\,770}$ ne trouve rien : c'est la concentration de la mesure en grande dimension, où deux vecteurs tirés indépendamment sont presque orthogonaux.",
        "La direction du gradient atteint $0{,}940183$, c'est-à-dire **exactement** $\\|g\\|$, au chiffre près. La borne n'est pas molle : elle est atteinte.",
        "Les deux dernières colonnes valident le développement limité : la variation mesurée et la variation prévue coïncident sur trois chiffres significatifs, pour les cinq directions.",
      ],
    },
    {
      id: "b-o1-12",
      type: "image",
      ancre: "figure-direction",
      src: "/cours/lecon3/l3-fig1-direction.png",
      largeur: 1380,
      hauteur: 509,
      alt: "Deux panneaux. À gauche, l'histogramme des produits scalaires de 4000 directions tirées au hasard avec le gradient : toutes tiennent entre moins 0,009 et plus 0,012, et une flèche indique que la direction du gradient, à 0,940, se trouve 77 fois plus loin, hors du cadre. À droite, la variation de la perte en fonction de la longueur du pas dans cinq directions : la droite montante est le gradient, la droite descendante son opposé, et les trois directions tirées au hasard sont plates à cette échelle.",
      legende:
        "La figure prolonge le même tirage jusqu'à 4000 directions, les 2000 premières étant celles du tableau ; la meilleure y vaut toujours $0{,}0122$, soit 77 fois moins que la borne. (a) L'histogramme est à son échelle : le placer dans le même cadre que la borne l'écraserait à un pixel, et c'est justement l'information. (b) Seule la direction opposée au gradient fait baisser la perte ; les directions au hasard ont un effet plus de mille fois plus petit.",
    },
    {
      id: "b-o1-13",
      type: "animation",
      ancre: "gradient-2d",
      animationId: "descente-gradient-2d",
      legende:
        "La même chose en deux dimensions, où le gradient se dessine : perpendiculaire à la ligne de niveau qu'il traverse, et d'autant plus long que les lignes sont serrées.",
    },
    {
      id: "b-o1-14",
      type: "verification",
      numero: 9,
      enonce:
        "Dans la sortie ci-dessus, le produit scalaire $\\langle g,u\\rangle$ pour la direction aléatoire n° 2 vaut $-2{,}49\\cdot10^{-3}$, puisque la variation à $\\varepsilon=10^{-4}$ vaut $-2{,}49\\cdot10^{-7}$.",
      questions: [
        "Quelle est la valeur du cosinus de l'angle entre cette direction et le gradient ? Donne le calcul.",
        "À quel angle en degrés cela correspond-il ? Que dis-tu de cet angle ?",
      ],
    },
    {
      id: "b-o1-15",
      type: "repere",
      cherche: "De combien avancer, et dans quelle direction, à chaque itération.",
      pourquoi:
        "C'est la seule opération que l'entraînement répète, des centaines de milliers de fois.",
      ou: "La direction est réglée et prouvée. Le signe aussi.",
      suite:
        "Sur quelles données calculer ce gradient. Nous avons utilisé des mini-lots sans le justifier.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 3 · sur quelles données
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-2": [
    {
      id: "b-o2-1",
      type: "texte",
      texte:
        "Le risque empirique est une moyenne sur **tout** le jeu, et son gradient aussi. La descente honnête calcule cette somme entière à chaque pas. Mesurons ce qu'elle coûte, et ce qu'elle rapporte.",
    },
    {
      id: "b-o2-2",
      type: "formule",
      latex:
        "\\mathcal{L}_{\\mathcal{D}}(\\theta)=\\frac{1}{N}\\sum_{n=1}^{N}\\ell\\big(\\theta;x^{(n)},y^{(n)}\\big), \\qquad \\operatorname{grad}_{\\theta}\\mathcal{L}_{\\mathcal{D}}=\\frac{1}{N}\\sum_{n=1}^{N}\\operatorname{grad}_{\\theta}\\ell^{(n)}",
      alt: "La perte sur le jeu de données est la moyenne des pertes individuelles, et son gradient est la moyenne des gradients individuels.",
    },
    {
      id: "b-o2-3",
      type: "titre",
      niveau: 2,
      texte: "L'obstacle, prouvé",
    },
    {
      id: "b-o2-4",
      type: "sortie",
      titre: "python cours/lecon3/experiences.py E2",
      texte: `  N = 60000   B = 64   p = 101770

  Cout d'UNE mise a jour (mediane, apres passe a blanc) :
    lot COMPLET     6049.4 ms   soit  100.82 us par exemple
    MINI-LOT          45.2 ms   soit  705.48 us par exemple

    Par exemple, le lot complet est 7.0 x PLUS efficace :
    une grande multiplication de matrices exploite mieux le cache.
    Et pourtant il ne produit qu'UNE mise a jour, contre 937.

  Ce que chacun obtient pour UN passage sur les 60000 exemples, eta = 0.5 :
    methode             mises a jour    duree   perte test   precision
    lot complet                    1    7.32s       2.3103      0.1258
    mini-lots B=64               937   29.92s       0.2546      0.9273`,
      lecture: [
        "Le lot complet est **plus efficace par exemple** : $100{,}82\\ \\mu s$ contre $705{,}48\\ \\mu s$, un facteur $7{,}0$ en sa faveur. Une grande multiplication de matrices amortit mieux les accès mémoire. **Le grief contre lui n'est donc pas le coût arithmétique.**",
        "Le grief est ailleurs : pour le même parcours des données, il produit **une** mise à jour au lieu de 937.",
        "Le résultat est sans appel : $0{,}1258$ de précision de test, contre $0{,}1000$ pour un tirage au hasard entre dix classes. Après avoir vu les 60 000 exemples, le réseau **n'a rien appris**.",
      ],
    },
    {
      id: "b-o2-5",
      type: "encart",
      ton: "attention",
      titre: "La nature exacte de l'obstacle",
      texte:
        "Ce n'est pas que le lot complet calcule un mauvais gradient : il calcule le gradient **exact**. C'est qu'il n'en calcule pas **assez**. La distinction décide de tout ce qui suit.",
    },
    {
      id: "b-o2-6",
      type: "titre",
      niveau: 2,
      texte: "Le cahier des charges",
    },
    {
      id: "b-o2-7",
      type: "tableau",
      cleEnTete: true,
      titre: "Ce que la solution devra satisfaire",
      entetes: ["", "Critère", "Pourquoi"],
      lignes: [
        [
          "(C1)",
          "Le coût d'**une** mise à jour ne doit pas dépendre de $N$",
          "sinon le nombre de mises à jour par heure s'effondre quand le jeu grandit",
        ],
        [
          "(C2)",
          "La direction utilisée doit être **en moyenne** le gradient complet",
          "sinon on optimise autre chose, et on ne sait plus quoi",
        ],
        [
          "(C3)",
          "L'erreur commise doit être **contrôlable** par un réglage",
          "sinon on ne peut pas arbitrer entre vitesse et précision",
        ],
        [
          "(C4)",
          "Le coût mémoire ne doit pas dépendre de $N$",
          "$60\\,000\\times784$ en flottants 64 bits fait déjà 376 Mo",
        ],
      ],
    },
    {
      id: "b-o2-8",
      type: "titre",
      niveau: 2,
      texte: "Le candidat naïf, mis en échec",
    },
    {
      id: "b-o2-9",
      type: "texte",
      texte:
        "Le candidat le plus simple répond à (C1) et (C4) sans effort : **puisque le lot complet coûte cher, tirons une fois pour toutes un petit sous-échantillon, et travaillons dessus.** C'est le premier réflexe, et il faut le tuer avec une mesure, pas avec un argument.",
    },
    {
      id: "b-o2-10",
      type: "sortie",
      titre: "python cours/lecon3/experiences.py E3 · 937 mises à jour, coût identique",
      texte: `  sous-echantillon fige : 937 mises a jour, meme cout de calcul
    sur les 64 exemples figes : perte 0.0036   precision 1.0000
    sur le jeu de test        : perte 1.3899   precision 0.5990

  mini-lots frais : 937 mises a jour, meme cout de calcul
    sur les 64 exemples figes : perte 0.3925   precision 0.9062
    sur le jeu de test        : perte 0.2664   precision 0.9208

  Ecart de precision de test : 0.9208 - 0.5990 = +0.3218`,
      lecture: [
        "Le candidat figé atteint **$1{,}0000$** sur ses propres 64 exemples, perte $0{,}0036$ : il les a appris par cœur. Et **$0{,}5990$** sur le test.",
        "Le détail qui tranche : les mini-lots frais font **moins bien** que le figé sur ces 64 exemples précis ($0{,}9062$ contre $1{,}0000$) et **beaucoup mieux** partout ailleurs.",
        "Le candidat naïf viole **(C2)** : la direction qu'il suit est le gradient exact d'une **autre** fonction, celle qui ne porte que sur ses 64 exemples.",
      ],
    },
    {
      id: "b-o2-11",
      type: "image",
      ancre: "figure-lots",
      src: "/cours/lecon3/l3-fig2-lots.png",
      largeur: 1380,
      hauteur: 509,
      alt: "Deux panneaux. À gauche, la précision de test du lot complet sur six passages : elle part de 0,1258, reste sous 0,25 pendant trois passages, et atteint 0,6132 au sixième. À droite, deux courbes à nombre de mises à jour égal : les mini-lots frais montent à 0,92, le sous-échantillon figé plafonne à 0,60 dès la deux-centième mise à jour.",
      legende:
        "(a) Le lot complet finit par apprendre : il lui faut simplement 937 fois plus de passages. (b) Figer le lot coûte 0,3218 de précision, et la courbe est plate dès le début : ce n'est pas de la lenteur, c'est un plafond.",
    },
    {
      id: "b-o2-12",
      type: "titre",
      niveau: 2,
      texte: "La solution, dérivée du cahier des charges",
    },
    {
      id: "b-o2-13",
      type: "texte",
      texte:
        "(C1) et (C4) imposent un lot de taille $B$ fixe, indépendante de $N$. (C2) impose que ce lot soit **retiré à chaque pas**, et de façon **uniforme**. Cela suffit à tout démontrer.",
    },
    {
      id: "b-o2-14",
      type: "derivation",
      ancre: "sans-biais",
      titre: "Le gradient de mini-lot est sans biais",
      hypotheses: [
        "$\\mathcal{B}$ est tiré **uniformément** parmi les parties de taille $B$ de $\\{1,\\dots,N\\}$",
        "$g_{\\mathcal{B}}$ est la moyenne des gradients individuels sur $\\mathcal{B}$",
      ],
      depart: {
        latex:
          "g_{\\mathcal{B}}=\\frac{1}{B}\\sum_{n=1}^{N}\\mathbb{1}\\{n\\in\\mathcal{B}\\}\\ \\operatorname{grad}\\ell^{(n)}",
        alt: "Le gradient de lot égale un sur B fois la somme, sur tous les n, de l'indicatrice que n appartient au lot, multipliée par le gradient de la perte de l'exemple n.",
      },
      proprietes: [
        "La **linéarité de l'espérance**",
        "La **symétrie** du tirage uniforme : tous les indices jouent le même rôle",
      ],
      etapes: [
        {
          texte:
            "Le tirage étant uniforme, la probabilité d'appartenance ne dépend pas de $n$. Comme la somme de ces probabilités vaut l'espérance du cardinal, c'est-à-dire $B$ :",
          latex:
            "\\sum_{n=1}^{N}\\mathbb{P}(n\\in\\mathcal{B})=B \\quad\\Longrightarrow\\quad \\mathbb{P}(n\\in\\mathcal{B})=\\frac{B}{N}",
          alt: "La somme des probabilités d'appartenance vaut B, donc chaque probabilité vaut B sur N.",
          justification: "symétrie, puis comptage",
        },
        {
          texte: "Par linéarité de l'espérance, appliquée à la somme finie :",
          latex:
            "\\mathbb{E}[g_{\\mathcal{B}}]=\\frac{1}{B}\\sum_{n=1}^{N}\\frac{B}{N}\\operatorname{grad}\\ell^{(n)}=\\frac{1}{N}\\sum_{n=1}^{N}\\operatorname{grad}\\ell^{(n)}",
          alt: "L'espérance du gradient de lot égale un sur B fois la somme de B sur N fois les gradients, ce qui égale un sur N fois la somme des gradients.",
          justification: "linéarité de l'espérance ; les facteurs B se simplifient",
        },
      ],
      resultat: {
        latex:
          "\\mathbb{E}\\big[g_{\\mathcal{B}}(\\theta)\\big]=\\operatorname{grad}_{\\theta}\\mathcal{L}_{\\mathcal{D}}(\\theta) \\quad \\text{pour tout } \\theta",
        alt: "L'espérance du gradient de mini-lot égale exactement le gradient de la perte complète, pour tout thêta.",
      },
      interpretation:
        "Le critère (C2) est satisfait **exactement**, pas approximativement, et pour **toute** taille de lot, y compris $B=1$. Le mini-lot ne donne pas « à peu près » la bonne direction : il donne une direction dont la moyenne est la bonne. C'est ce qui autorise à faire beaucoup de pas médiocres plutôt qu'un pas parfait.",
    },
    {
      id: "b-o2-15",
      type: "derivation",
      ancre: "variance",
      titre: "Son écart quadratique décroît en un sur B",
      hypotheses: [
        "Tirage **avec remise** : les $B$ tirages sont indépendants et de même loi",
        "$s^{2}$ est la moyenne des carrés des écarts entre gradients individuels et gradient complet",
      ],
      depart: {
        latex:
          "g_{\\mathcal{B}}-\\operatorname{grad}\\mathcal{L}_{\\mathcal{D}}=\\frac{1}{B}\\sum_{i=1}^{B}v_i, \\qquad v_i=\\operatorname{grad}\\ell^{(n_i)}-\\operatorname{grad}\\mathcal{L}_{\\mathcal{D}}",
        alt: "L'écart entre le gradient de lot et le gradient complet est la moyenne de B vecteurs v i, chacun étant l'écart d'un gradient individuel au gradient complet.",
      },
      proprietes: [
        "Les $v_i$ sont de **moyenne nulle**, par la dérivation précédente",
        "L'**indépendance** des tirages annule les termes croisés",
      ],
      etapes: [
        {
          texte: "On développe le carré de la norme de la moyenne :",
          latex:
            "\\mathbb{E}\\Big\\|\\frac{1}{B}\\sum_{i=1}^{B}v_i\\Big\\|^{2}=\\frac{1}{B^{2}}\\sum_{i=1}^{B}\\sum_{j=1}^{B}\\mathbb{E}\\langle v_i,v_j\\rangle",
          alt: "L'espérance du carré de la norme de la moyenne des v i égale un sur B au carré fois la double somme des espérances des produits scalaires.",
          justification: "bilinéarité du produit scalaire",
        },
        {
          texte:
            "Pour $i\\neq j$, l'indépendance et la moyenne nulle annulent le terme. Il ne reste que les $B$ termes diagonaux, chacun égal à $s^2$.",
          latex:
            "=\\frac{1}{B^{2}}\\sum_{i=1}^{B}\\mathbb{E}\\|v_i\\|^{2}=\\frac{B\\,s^{2}}{B^{2}}=\\frac{s^{2}}{B}",
          alt: "Il reste un sur B au carré fois B fois s au carré, ce qui égale s au carré sur B.",
          justification: "indépendance et moyenne nulle",
        },
      ],
      resultat: {
        latex:
          "\\big\\|g_{\\mathcal{B}}-\\operatorname{grad}\\mathcal{L}_{\\mathcal{D}}\\big\\|_{\\text{RMS}}=\\frac{s}{\\sqrt{B}}",
        alt: "L'écart quadratique moyen entre le gradient de lot et le gradient complet vaut s divisé par la racine carrée de B.",
      },
      interpretation:
        "Le critère (C3) est satisfait, et le réglage est $B$. Mais le rendement est **décroissant** : quadrupler $B$ ne divise l'erreur que par deux, alors qu'il quadruple le coût. C'est l'argument quantitatif en faveur des **petits** lots.",
      limites: [
        "La preuve suppose un tirage **avec remise**. Sans remise, s'ajoute le facteur de population finie $\\frac{N-B}{N-1}$, compris entre $0{,}983$ et $1$ pour $N=60\\,000$ et $B\\le1024$ : indétectable dans nos mesures, mais il existe.",
      ],
    },
    {
      id: "b-o2-16",
      type: "sortie",
      titre: "python cours/lecon3/experiences.py E4 · 200 tirages par taille de lot",
      texte: `  ||grad complet|| = 0.863256   (reference)

       B   ||moyenne - complet||   ecart quadratique moyen   x sqrt(B)
       1                0.334587                  5.876873      5.8769
       4                0.303096                  2.923644      5.8473
      16                0.122570                  1.455154      5.8206
      64                0.062213                  0.725300      5.8024
     256                0.024452                  0.363179      5.8109
    1024                0.014276                  0.186764      5.9764`,
      lecture: [
        "**Colonne 2, à ne pas surinterpréter.** Elle tend vers zéro, mais ce n'est pas un biais : la proposition dit que le biais est *exactement* nul. C'est l'erreur résiduelle de Monte-Carlo sur une moyenne de 200 tirages, qui vaut environ l'écart divisé par $\\sqrt{200}$. Pour $B=64$ : $0{,}7253/\\sqrt{200}=0{,}0513$, et l'on mesure $0{,}0622$. Même ordre.",
        "**Colonne 4** : l'écart multiplié par $\\sqrt{B}$ vaut $5{,}88$, $5{,}85$, $5{,}82$, $5{,}80$, $5{,}81$, $5{,}98$ sur trois ordres de grandeur de $B$. La loi en $1/\\sqrt{B}$ est vérifiée, et la constante $s\\approx5{,}8$ est mesurée.",
        "La remontée à $B=1024$ est du bruit : avec 200 répétitions, l'erreur type relative est d'environ $5\\,\\%$, et l'écart observé est de $3\\,\\%$.",
        "**Le chiffre à retenir** : $s\\approx5{,}8$ pour un gradient complet de norme $0{,}863$. Le bruit d'un gradient à un seul exemple est près de **sept fois plus grand que le signal**, et pourtant cela fonctionne, parce que ce bruit est de moyenne nulle et que les pas sont nombreux.",
      ],
    },
    {
      id: "b-o2-17",
      type: "tableau",
      titre: "Verdict",
      cleEnTete: true,
      entetes: ["Candidat", "(C1)", "(C2)", "(C3)", "(C4)", "Verdict"],
      lignes: [
        ["Lot complet", "✗", "✓", "✗", "✗", "**rejeté** : $0{,}1258$ après un passage"],
        [
          "Sous-échantillon figé",
          "✓",
          "✗",
          "✗",
          "✓",
          "**rejeté** : $0{,}5990$ contre $0{,}9208$",
        ],
        ["**Mini-lot retiré à chaque pas**", "✓", "✓", "✓", "✓", "**retenu**"],
      ],
      legende:
        "(C1) coût borné, mesuré plus haut · (C2) sans biais, prouvé · (C3) erreur réglable en s sur racine de B, mesurée · (C4) mémoire bornée, par construction.",
    },
    {
      id: "b-o2-18",
      type: "formule",
      ancre: "sgd",
      latex:
        "\\theta_{t+1}=\\theta_{t}-\\eta\\,\\frac{1}{B}\\sum_{n\\in\\mathcal{B}_t}\\operatorname{grad}_{\\theta}\\ell^{(n)}(\\theta_t), \\qquad \\mathcal{B}_t \\text{ tiré uniformément}, \\ |\\mathcal{B}_t|=B",
      alt: "Thêta t plus un égale thêta t moins êta fois la moyenne, sur les indices du lot t, des gradients individuels, le lot étant tiré uniformément et de taille B.",
      numero: "2",
      legende:
        "La descente de gradient stochastique par mini-lots. Le mot « stochastique » ne désigne pas une approximation grossière : il désigne un estimateur sans biais dont on contrôle la variance.",
    },
    {
      id: "b-o2-19",
      type: "verification",
      numero: 10,
      enonce:
        "On mesure $s\\approx5{,}80$ et un gradient complet de norme $0{,}863$.",
      questions: [
        "Quelle taille de lot faudrait-il pour que l'écart quadratique moyen tombe à $10\\,\\%$ de la norme du gradient complet ? Donne le calcul.",
        "Sachant qu'un exemple coûte environ $100\\ \\mu s$ en lot complet, combien de temps coûterait alors **une** mise à jour ? Compare aux 45 ms du mini-lot à $B=64$, et conclus.",
      ],
    },
    {
      id: "b-o2-20",
      type: "repere",
      cherche: "La direction et la longueur du pas.",
      pourquoi: "Ce sont les deux seuls degrés de liberté de la règle de mise à jour.",
      ou: "La direction est prouvée, les données sur lesquelles la calculer sont dérivées.",
      suite: "Le pas. C'est le seul réglage restant, et celui qu'on rate le plus souvent.",
    },
  ],
};
