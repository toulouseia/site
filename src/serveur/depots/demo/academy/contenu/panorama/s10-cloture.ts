import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Section 10 · la clôture du panorama.
//
// Rien de neuf n'entre ici : cette section ne fait que reprendre, ranger et
// vérifier ce que les neuf précédentes ont établi. Les seuls nombres cités
// viennent de programmes exécutés :
//
//   cours/lecon1/prix.py           les deux appartements, 62,5 puis 56,25
//   cours/lecon1/chiffres.py       les 101 770 réglages du chapitre 2
//   animations/scenes/panorama/    la descente à une variable, eta = 0,25 et
//                                  la divergence à eta = 1,1
//
// La seule ligne de l'algorithme final qui ne soit pas justifiée par ce
// chapitre est le calcul du gradient : elle porte sa dette en commentaire,
// plutôt que de se faire oublier.
// ─────────────────────────────────────────────────────────────────────────────

export const S10_CLOTURE: Bloc[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // A · la synthèse, en un paragraphe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-1",
    type: "texte",
    texte:
      "Onze pages plus tôt, une machine lisait un chiffre manuscrit sans que personne sache dire comment.\n\nVoici tout ce qu'il a fallu pour écrire ce qu'elle fait, et le trajet qui les relie.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // B · le formulaire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-3",
    type: "image",
    ancre: "chemin-du-chapitre",
    src: "/cours/lecon1/l1-fig14-le-chemin-du-chapitre.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Un chemin légèrement ondulé traverse l'image, portant les bornes d'encre du chapitre. Au-dessus de chacune, le symbole défini à ce jalon : x, y, le jeu de données D, f indice thêta, la perte ell, la perte moyenne grand L indice D, et p. Sous un filet, les jalons sont repris en deux rangées, numérotés, chacun avec son symbole et ce qu'il désigne : l'entrée, la vérité terrain, le jeu de données, le modèle, la perte sur un exemple, la perte moyenne, le nombre de réglages. Sous un filet de brique, une dernière ligne : un seul chemin, et le chapitre tient là.",
    legende:
      "Un seul chemin, et chaque borne porte ce qu'on y a appris.",
  },
  {
    id: "b-p10-4",
    type: "titre",
    niveau: 2,
    ancre: "formulaire",
    texte: "Formulaire",
  },
  {
    id: "b-p10-5",
    type: "formule",
    latex: "\\mathcal{D}=\\big\\{(\\mathbf{x}^{(n)},\\,y^{(n)})\\big\\}_{n=1}^{N}",
    alt: "Le jeu de données D est l'ensemble des couples x exposant n, y exposant n, pour n allant de 1 à grand N.",
    numero: "1",
    legende:
      "Le jeu de données : $N$ couples, chacun une entrée et la vérité observée qui va avec.",
  },
  {
    id: "b-p10-6",
    type: "formule",
    latex: "\\widehat{y}=f_{\\boldsymbol{\\theta}}(\\mathbf{x})",
    alt: "y chapeau égale f indice thêta, appliqué à x.",
    numero: "2",
    legende:
      "Le modèle : une fonction indexée par ses paramètres. Changer $\\boldsymbol{\\theta}$ ne change pas la **forme** du modèle, cela change la fonction qu'il réalise.",
  },
  {
    id: "b-p10-7",
    type: "formule",
    latex:
      "z=\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b=\\sum_{i=1}^{d}w_i x_i+b, \\qquad \\widehat{y}=z",
    alt: "z égale w transposé x plus b, c'est-à-dire la somme, pour i allant de 1 à d, des w indice i fois x indice i, le tout plus b ; et y chapeau égale z.",
    numero: "3",
    legende:
      "Le modèle linéaire, le plus simple qui ne soit pas trivial. En régression, rien ne s'intercale entre la somme pondérée et la prédiction : $\\widehat{y}$ **est** $z$.",
  },
  {
    id: "b-p10-8",
    type: "formule",
    latex: "\\ell(\\widehat{y},y)=(\\widehat{y}-y)^{2}",
    alt: "La perte l, de y chapeau et de y, égale le carré de la différence entre y chapeau et y.",
    numero: "4",
    legende:
      "La perte sur **un** exemple. Le carré est positif quel que soit le sens de l'erreur, et il pénalise davantage les grands écarts que les petits.",
  },
  {
    id: "b-p10-9",
    type: "formule",
    latex:
      "\\mathcal{L}_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\Big(f_{\\boldsymbol{\\theta}}\\big(\\mathbf{x}^{(n)}\\big)-y^{(n)}\\Big)^{2}",
    alt: "La perte sur le jeu de données, fonction de thêta, égale un sur grand N fois la somme, pour n allant de 1 à grand N, du carré de la différence entre la prédiction du modèle sur l'exemple n et la vérité terrain de l'exemple n.",
    numero: "5",
    legende:
      "La moyenne des $N$ pertes individuelles, et à gauche du signe égal une seule variable : $\\boldsymbol{\\theta}$.",
  },
  {
    id: "b-p10-11a",
    type: "titre",
    niveau: 3,
    texte: "Les conventions d'écriture",
  },
  {
    id: "b-p10-11b",
    type: "encart",
    ton: "note",
    titre: "Le vecteur colonne, et la transposée",
    texte:
      "Un vecteur de $\\mathbb{R}^{d}$ est **toujours** une colonne de $d$ réels. Une colonne prend de la place au fil d'une phrase : on l'y couche en écrivant $\\mathbf{x} = (x_1, x_2)^{\\mathsf{T}}$, et le $\\mathsf{T}$ dit qu'il faut la relever. C'est la même convention qui fait écrire le produit $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}$ : une ligne multipliée par une colonne donne un nombre.",
  },
  {
    id: "b-p10-11c",
    type: "definition",
    terme: "Préactivation",
    anglais: "pre-activation",
    texte:
      "Le nombre $z = \\mathbf{w}^{\\mathsf{T}}\\mathbf{x} + b$, pris **avant** toute transformation ultérieure. Dans ce chapitre, l'estimation vaut $\\widehat{y} = z$ ; le préfixe n'a donc pas encore d'utilité. Il en prend une au chapitre 2, où une fonction s'insère entre $z$ et ce que le modèle rend vraiment.",
  },
  {
    id: "b-p10-11d",
    type: "formule",
    ancre: "verification-dimensions",
    latex:
      "\\underbrace{\\mathbf{w}^{\\mathsf{T}}}_{1\\times d}\\ \\underbrace{\\mathbf{x}}_{d\\times 1} \\;=\\; \\underbrace{z}_{1\\times 1}, \\qquad (1\\times d)\\cdot(d\\times 1) = 1\\times 1",
    alt: "Le produit du vecteur de poids transposé, de dimension un par d, par le vecteur d'entrée, de dimension d par un, donne le nombre z, de dimension un par un. Les deux d intérieurs se répondent et s'annulent ; les deux un extérieurs restent.",
    legende:
      "Les deux dimensions intérieures doivent coïncider, sinon le produit n'existe pas. $(1\\times 4)\\cdot(3\\times 1)$ ne s'écrit pas : $4 \\neq 3$.",
  },
  {
    id: "b-p10-11e",
    type: "image",
    ancre: "verifier-les-dimensions",
    src: "/cours/lecon1/l1-fig11-verifier-les-dimensions.svg",
    largeur: 1380,
    hauteur: 520,
    alt: "En haut, une ligne de quatre cases représente le vecteur de poids transposé, une colonne de quatre cases représente le vecteur d'entrée, et une case unique, en brique, représente le résultat. Sous elles, l'égalité des dimensions : un fois quatre, point, quatre fois un, égale un fois un ; les deux quatre intérieurs sont en brique et reliés par un trait. En bas, le cas qui échoue : un fois quatre, point, trois fois un ; le quatre et le trois sont en brique, le trait de liaison se tend entre eux sans se refermer, et dessous s'inscrit quatre différent de trois.",
    legende:
      "On vérifie les dimensions avant de multiplier, pas après.",
  },
  {
    id: "b-p10-11f",
    type: "encart",
    ton: "note",
    titre: "$\\mathcal{Y}$ et $\\widehat{\\mathcal{Y}}$ ne sont pas le même ensemble",
    texte:
      "$\\mathcal{Y}$ est l'ensemble où vivent les **vérités terrain** ; $\\widehat{\\mathcal{Y}}$ est celui où vivent les **estimations du modèle**. En régression, les deux valent $\\mathbb{R}$ et la distinction ne se voit pas. En classification, $\\mathcal{Y}$ est fini — dix chiffres, deux réponses — tandis que le modèle rend un nombre entre $0$ et $1$ : les deux ensembles diffèrent, et confondre leurs éléments est l'erreur la plus coûteuse du domaine.",
  },
  {
    id: "b-p10-11g",
    type: "tableau",
    ancre: "trois-indices",
    titre: "Trois notations qui se ressemblent et ne disent pas la même chose",
    cleEnTete: true,
    entetes: ["Écriture", "Ce qu'elle désigne", "Ce qu'elle n'est pas"],
    lignes: [
      [
        "$x^{(n)}$",
        "Le $n$-ième **exemple** du jeu de données",
        "Une puissance",
      ],
      [
        "$x_{i}$",
        "La $i$-ième **composante** d'un vecteur",
        "Un exemple",
      ],
      [
        "$W^{[l]}$",
        "La **couche** $l$ d'un réseau, à partir du chapitre 2",
        "Ni une puissance, ni un numéro d'exemple",
      ],
    ],
    legende:
      "Les trois cohabitent dans une même formule dès le chapitre 2. Parenthèses, indice bas et crochets sont trois marques distinctes, jamais interchangeables.",
  },
  {
    id: "b-p10-11h",
    type: "definition",
    terme: "Représentation",
    anglais: "representation, feature vector",
    texte:
      "Le vecteur $\\mathbf{x}$ par lequel on remplace l'objet réel. Choisir une représentation, c'est décider ce que le modèle aura le droit de voir : l'agence qui retient la surface et le nombre de pièces, et rien d'autre, a déjà décidé que l'étage ne compte pas.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // C · le tableau des objets
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-12",
    type: "titre",
    niveau: 2,
    ancre: "tableau-des-objets",
    texte: "Le tableau des objets",
  },
  {
    id: "b-p10-13",
    type: "tableau",
    cleEnTete: true,
    titre: "Les seize symboles de ce chapitre",
    entetes: ["Symbole", "Signification", "Ensemble", "Dimension"],
    lignes: [
      [
        "$\\mathbf{x}$",
        "l'entrée : un exemple, décrit par ses caractéristiques",
        "$\\mathcal{X}\\subseteq\\mathbb{R}^{d}$",
        "$d\\times1$, soit $d=2$ dans le fil conducteur",
      ],
      [
        "$x_i$",
        "la $i$-ème caractéristique de cette entrée",
        "$\\mathbb{R}$",
        "scalaire, $i$ allant de $1$ à $d$",
      ],
      [
        "$y$",
        "la vérité terrain : ce qui a été **observé** dans le monde",
        "$\\mathcal{Y}$",
        "un nombre en régression, une étiquette en classification",
      ],
      [
        "$\\widehat{y}$",
        "la prédiction : ce que le modèle **croit**",
        "$\\mathcal{Y}$, ou $\\mathbb{R}$ avant décision",
        "même forme que $y$, et jamais confondue avec lui",
      ],
      [
        "$\\mathcal{D}$",
        "le jeu de données : les couples entrée / vérité",
        "partie de $\\mathcal{X}\\times\\mathcal{Y}$",
        "$N$ couples",
      ],
      [
        "$N$",
        "le nombre d'exemples du jeu",
        "$\\mathbb{N}^{*}$",
        "scalaire, $N=2$ dans le fil conducteur",
      ],
      [
        "$n$",
        "l'indice d'un exemple, écrit en exposant entre parenthèses",
        "$\\{1,\\dots,N\\}$",
        "scalaire ; $\\mathbf{x}^{(n)}$ n'est pas une puissance",
      ],
      [
        "$\\mathbf{w}$",
        "les poids : un par caractéristique d'entrée",
        "$\\mathbb{R}^{d}$",
        "$d\\times1$",
      ],
      [
        "$b$",
        "le biais : le décalage, sans lequel le modèle passe par l'origine",
        "$\\mathbb{R}$",
        "scalaire",
      ],
      [
        "$z$",
        "la préactivation : la somme pondérée $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b$",
        "$\\mathbb{R}$",
        "scalaire",
      ],
      [
        "$\\boldsymbol{\\theta}$",
        "les paramètres, tous réunis : ici le couple $(\\mathbf{w},b)$",
        "$\\mathbb{R}^{p}$",
        "$p=d+1$, soit $3$ dans le fil conducteur",
      ],
      [
        "$\\ell$",
        "la perte sur **un** exemple",
        "$\\mathbb{R}_{\\ge0}$",
        "scalaire",
      ],
      [
        "$\\mathcal{L}_{\\mathcal{D}}$",
        "la moyenne des $\\ell$ sur $\\mathcal{D}$ : la fonction qu'on minimise",
        "$\\mathbb{R}_{\\ge0}$",
        "scalaire, fonction de $\\boldsymbol{\\theta}$ seul",
      ],
      [
        "$\\eta$",
        "le pas d'apprentissage : la longueur d'un déplacement",
        "$\\mathbb{R}_{>0}$",
        "scalaire, réglage et non paramètre appris",
      ],
      [
        "$t$",
        "le numéro d'itération de la descente",
        "$\\mathbb{N}$",
        "scalaire, un compteur",
      ],
      [
        "$f_{\\boldsymbol{\\theta}}$",
        "le modèle : la fonction que $\\boldsymbol{\\theta}$ choisit",
        "applications de $\\mathcal{X}$ dans $\\mathcal{Y}$",
        "une fonction, pas un nombre",
      ],
    ],
    legende:
      "Le tableau à garder ouvert pendant le chapitre suivant : chacune de ces seize lignes y sera instanciée sur un cas réel.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // D · l'algorithme final
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // E · les erreurs fréquentes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-19",
    type: "titre",
    niveau: 2,
    ancre: "erreurs-frequentes",
    texte: "Erreurs fréquentes",
  },
  {
    id: "b-p10-20",
    type: "tableau",
    cleEnTete: true,
    entetes: ["Ce qu'on croit", "Ce qui est vrai"],
    lignes: [
      [
        "$y$ et $\\widehat{y}$, c'est la même chose à un chapeau près",
        "$y$ est la vérité **observée** dans le monde, $\\widehat{y}$ la **croyance** du modèle. À l'inférence, on calcule $\\widehat{y}$ précisément parce que $y$ n'existe pas encore : l'appartement dont on estime le prix n'a pas été vendu.",
      ],
      [
        "$\\mathcal{L}_{\\mathcal{D}}$ dépend de $\\mathbf{x}$",
        "$\\mathcal{D}$ est fixé une fois pour toutes : les $\\mathbf{x}^{(n)}$ et les $y^{(n)}$ sont des **constantes**. La seule variable de $\\mathcal{L}_{\\mathcal{D}}$ est $\\boldsymbol{\\theta}$, et c'est exactement ce qui permet de la minimiser en $\\boldsymbol{\\theta}$.",
      ],
      [
        "$\\ell$ et $\\mathcal{L}$, c'est la même perte",
        "$\\ell$ porte sur **un** exemple, $\\mathcal{L}_{\\mathcal{D}}$ est la moyenne des $N$ valeurs de $\\ell$. Avec $\\boldsymbol{\\theta}_B$, les deux appartements donnent $\\ell=56{,}25$ chacun, donc $\\mathcal{L}_{\\mathcal{D}}=56{,}25$ : ici les deux nombres coïncident par accident, jamais par principe.",
      ],
      [
        "$\\mathbf{x}^{(n)}$, c'est $\\mathbf{x}$ à la puissance $n$",
        "L'exposant entre parenthèses est un **numéro d'exemple**. $\\mathbf{x}^{(2)}$ est le deuxième appartement du jeu ; la puissance, elle, s'écrirait sans parenthèses, et l'**indice** désigne encore autre chose : $x_2$ est la deuxième caractéristique d'une entrée.",
      ],
      [
        "une note très basse sur les exemples du fichier, donc un bon modèle",
        "C'est la **mémorisation** qui est mesurée, pas l'apprentissage. Le but est de bien répondre sur des exemples jamais vus ; le seul verdict est la note obtenue sur des exemples que le modèle n'a jamais vus.",
      ],
      [
        "les classes sont codées $0$, $1$, $2$, donc ce sont des nombres",
        "La perte quadratique n'utilise de deux étiquettes que la **différence de leurs codes**, et ce que cette différence mesure n'est pas la question posée. Sur les dix chiffres manuscrits, confondre un 3 avec un 8 coûte $25$ et le confondre avec un 5 coûte $4$ ; renumérotées dans l'ordre alphabétique de leurs noms, les mêmes classes donnent $25$ et $49$, et les deux erreurs ont échangé leur rang.",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // F · la question de vérification
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-21",
    type: "image",
    ancre: "y-et-y-chapeau",
    src: "/cours/lecon1/l1-fig16-y-et-y-chapeau.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Un plan surface contre prix, traversé par une droite à l'encre. Deux traits gris en pointillé marquent la surface de cinquante mètres carrés et le prix de deux cents ; à leur croisement, un gros point à l'encre. Sous ce point, sur la même verticale, un point de brique marque ce que la droite prédit, et un segment de brique épais joint les deux, coté y moins y chapeau égale seize. À droite, un panneau donne le modèle, y chapeau égale trois virgule quatre x plus quatorze, la surface, cinquante mètres carrés, le prix relevé chez le notaire, deux cents milliers d'euros, ce que le modèle dit, cent quatre-vingt-quatre milliers d'euros, puis l'écart, seize, et une dernière ligne : y est un fait, y chapeau un avis.",
    legende:
      "Le point est relevé ; la droite n'est qu'un avis.",
  },
  {
    id: "b-p10-22",
    type: "exercice",
    ancre: "question-de-verification",
    titre: "Question de vérification",
    minutes: 15,
    enonce:
      "**1. Un calcul.** On donne $\\mathbf{x}=(2,\\,-1)^{\\mathsf{T}}$, $\\mathbf{w}=(0{,}5,\\,1)^{\\mathsf{T}}$, $b=0{,}2$, et la vérité terrain $y=1{,}2$. Calcule $z$, puis $\\widehat{y}$, puis $\\ell$. Écris les trois lignes de calcul, pas seulement les trois résultats.\n\n**2. Une typologie.** Pour chacun des quatre scénarios, donne la famille d'apprentissage, le type de tâche, et l'ensemble $\\mathcal{Y}$ lorsqu'il existe. (a) Prédire la température qu'il fera demain. (b) Décider si un courriel est indésirable ou non. (c) Reconnaître un vin parmi rouge, blanc et rosé. (d) Regrouper des clients qui se ressemblent, sans aucune étiquette.\n\n**3. Le compte des réglages.** Un modèle linéaire reçoit $d$ caractéristiques et rend un nombre. Combien de réglages contient-il ? Donne le compte pour $d=2$, puis pour une image de $28\\times 28$ pixels.",
    correction:
      "**1.** $z = 0{,}5\\times 2 + 1\\times(-1) + 0{,}2 = 1 - 1 + 0{,}2 = 0{,}2$. En régression, $\\widehat{y} = z = 0{,}2$. Enfin $\\ell = (0{,}2 - 1{,}2)^{2} = (-1)^{2} = 1$.\n\n**2.** (a) supervisé, régression, $\\mathcal{Y} = \\mathbb{R}$. (b) supervisé, classification binaire, $\\mathcal{Y} = \\{0, 1\\}$. (c) supervisé, classification à trois classes, $\\mathcal{Y} = \\{0, 1, 2\\}$ — des codes, pas des quantités. (d) non supervisé, partitionnement, il n'y a pas de $\\mathcal{Y}$.\n\n**3.** $p = d + 1$ : un poids par caractéristique, plus le biais. Pour $d = 2$, $p = 3$. Pour une image de $28\\times 28 = 784$ pixels, $p = 785$.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // G · la suite du parcours
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p10-23",
    type: "titre",
    niveau: 2,
    ancre: "suite-du-parcours",
    texte: "Suite du parcours",
  },
  {
    id: "b-p10-24",
    type: "texte",
    texte:
      "Quatre chapitres suivent celui-ci, et ils forment un arc. Aucun ne change de vocabulaire : ils emploient celui du tableau ci-dessus. Le fil conducteur, lui, change : les appartements ont fait leur travail, et c'est la reconnaissance des chiffres manuscrits qui prend la suite, pour la raison établie en section 2.4 — c'est le problème où l'on peut écarter des règles par la mesure au lieu d'en supposer l'absence.",
  },
  {
    id: "b-p10-25",
    type: "tableau",
    ancre: "arc-du-parcours",
    cleEnTete: true,
    entetes: ["Chapitre", "Ce qu'il construit", "La dette qu'il rembourse"],
    lignes: [
      [
        "2 · Qu'est-ce qu'un réseau de neurones",
        "L'objet qui capte l'arrangement des pixels, et les 101 770 réglages comptés en section 10.2",
        "Les fonctions d'activation $\\sigma$, et ce qu'un poids veut dire quand il y en a cent mille",
      ],
      [
        "3 · La descente de gradient, comment un réseau apprend",
        "La dérivation pas à pas du gradient de $\\mathcal{L}_{\\mathcal{D}}$, et la descente qui s'en sert",
        "Comment on trouve les réglages sans les essayer un par un",
      ],
      [
        "4 · Ce que fait la rétropropagation",
        "Ce que l'algorithme calcule, et pourquoi, avant toute formule",
        "La vérification par la mesure, quand relire le calcul n'est plus possible",
      ],
      [
        "5 · Le calcul de la rétropropagation",
        "La règle de dérivation en chaîne, appliquée couche par couche",
        "Le calcul effectif, terme à terme",
      ],
    ],
    legende:
      "Deux questions restent ouvertes après ces quatre chapitres — d'où viennent vraiment les données, et pourquoi un modèle qui réussit sur son fichier peut échouer ailleurs. Elles gardent leur échéance, et elle n'est pas encore fixée.",
  },
  {
    id: "b-p10-26b",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de cet arc",
    texte:
      "Le parcours des chapitres 2 à 5 est **inspiré de la série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown : c'est son ordre et ce sont ses notions. Le contenu, les démonstrations, les mesures et les animations de ce cours lui sont propres, et chaque nombre cité y sort d'un programme versionné avec le cours.",
  },
];
