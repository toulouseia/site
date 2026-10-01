import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 5 · Construire un détecteur de bord
//
// La seule page du chapitre où les poids sont POSÉS à la main, coefficient par
// coefficient, sans aucun entraînement. Elle sert deux fois : elle montre qu'un
// détecteur de bord est constructible, ce qui rend l'espoir de la page 11
// raisonnable ; et elle donne la lecture par signe une matière concrète.
//
// Les trois temps sont mesurés sur des images réelles du jeu de test. Tous les
// scores sortent de cours/lecon2/mesures.py, section 3.
// ─────────────────────────────────────────────────────────────────────────────

export const P05_DETECTEUR: Bloc[] = [
  {
    id: "b-r5-1",
    type: "texte",
    texte:
      "On appelle bord, dans une image de chiffre, un trait d'encre bordé de papier des deux côtés, comme la barre horizontale qui ouvre un sept. Ce n'est pas le pourtour vide de la grille, dont la page 2 a compté les pixels morts. Peut-on fabriquer à la main, sans le moindre entraînement, une pièce de calcul qui rende un grand score quand un tel trait passe à un endroit donné, et un petit score sinon ? Et si elle y arrive, tient-elle devant une image faite exprès pour la tromper ?",
  },
  {
    id: "b-r5-15f",
    type: "image",
    ancre: "detecteur-en-trois-temps",
    src: "/cours/lecon2/l2-fig06-detecteur.svg",
    largeur: 1380,
    hauteur: 800,
    alt: "Deux grilles de vingt-huit sur vingt-huit, côte à côte. Celle de gauche, titrée temps un, ne porte qu'un rectangle de brique large et bas, trois lignes sur treize colonnes, trente-neuf pixels à plus un ; tout le reste est blanc. Celle de droite, titrée temps trois, porte le même rectangle de brique, entouré cette fois d'un large cadre d'ardoise de trois pixels de marge, cent trente-deux pixels à moins un. Entre les deux grilles, quatre vignettes montrent les quatre entrées : un sept, un un, un zéro, et une tache rectangulaire noire et pleine. En bas, deux diagrammes à barres horizontales portent les mêmes quatre entrées dans le même ordre. À gauche, au temps deux, toutes les barres pointent à droite : le sept obtient plus vingt-trois virgule quatre, le un plus cinq virgule zéro zéro trois neuf, le zéro plus vingt-cinq virgule huit cinq quatre neuf, et la tache plus trente-neuf, en tête. À droite, au temps trois, seul le sept reste positif à plus dix virgule six six deux sept ; le un tombe à moins cinq virgule six quatre trois un, le zéro à moins neuf virgule huit zéro sept huit, et la tache à moins quatre-vingt-treize, dont la barre sort du cadre et porte deux traits de coupure.",
    legende:
      "Un seul changement de signe suffit à renverser le classement.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5.1 · Temps 1
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r5-2",
    type: "titre",
    niveau: 2,
    texte: "Premier temps : compter l'encre d'une zone",
  },
  {
    id: "b-r5-3",
    type: "texte",
    texte:
      "On veut un neurone dont le score monte quand une zone précise de l'image est encrée, et on choisit une bande horizontale de trois lignes, les lignes $8$ à $10$ sur les colonnes $9$ à $21$, soit $39$ pixels dont on note $Z$ l'ensemble des rangs. Cette bande est posée là où passe la barre d'un sept du jeu, ce qui est un choix et non un résultat.\n\nOn pose alors $w_{k}=1$ pour ces $39$ pixels, $w_{k}=0$ pour les $745$ autres, et $b=0$.",
  },
  {
    id: "b-r5-4",
    type: "formule",
    ancre: "detecteur-temps1",
    latex:
      "w_{k}=\\mathbb{1}\\{k\\in Z\\},\\quad b=0\\qquad\\Longrightarrow\\qquad z=\\sum_{k\\in Z} x_{k}",
    alt: "Le poids de rang k vaut l'indicatrice de l'appartenance de k à la zone Z, et le biais est nul. La préactivation z vaut alors la somme des x k pour k parcourant la zone Z.",
    numero: "5.1",
    legende:
      "$\\mathbb{1}\\{\\cdot\\}$ vaut $1$ quand la condition entre accolades est vraie et $0$ sinon, et $Z\\subset[\\![1,784]\\!]$ est l'ensemble des $39$ rangs de la bande. La somme de $(4.2)$ n'a donc plus qu'un terme, faute du moindre poids négatif.",
  },
  {
    id: "b-r5-5",
    type: "texte",
    texte:
      "Ce neurone ne fait donc **qu'une chose**, additionner l'encre présente dans la bande, et comme chaque pixel vaut au plus $1$ sur les $39$ de la bande, son score reste entre $0$ et $39$. Il n'atteint $39$ que si les $39$ pixels sont noirs pleins.",
  },
  {
    id: "b-r5-6",
    type: "animation",
    ancre: "un-neurone-lit-un-bord",
    animationId: "un-neurone-lit-un-bord",
    legende:
      "Le détecteur se construit en trois temps, et les quatre scores se recalculent à chacun. Le troisième seul le rend sélectif : tant que le pourtour ne pénalise rien, la tache large gagne.",
  },
  {
    id: "b-r5-7",
    type: "sortie",
    ancre: "scores-temps1",
    titre: "Le score de la bande seule, sur quatre entrées",
    texte:
      "    zone positive    lignes 8 à 10, colonnes 9 à 21   (39 pixels à +1)\n\n      entrée                                 z = somme de l'encre\n      image de test n°0 (un 7)                  23.4000\n      image de test n°2 (un 1)                   5.0039\n      image de test n°3 (un 0)                  25.8549\n      tache large construite                    39.0000",
    lecture: [
      "L'image du $7$ marque $23{,}40$ : sa barre supérieure traverse la bande de part en part.",
      "L'image du $1$ marque $5{,}00$ : un $1$ est un trait vertical étroit, qui ne croise la bande que sur quelques cases, la plupart à peine grises.",
      "**Mais l'image du $0$ marque $25{,}85$, davantage que le $7$**, et la tache marque $39$, le maximum possible.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5.2 · Temps 2
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r5-8",
    type: "titre",
    niveau: 2,
    texte: "Deuxième temps : ce que ce neurone ne distingue pas",
  },
  {
    id: "b-r5-9",
    type: "texte",
    texte:
      "La tache large n'est pas une image du jeu : c'est un contre-exemple construit exprès, un rectangle d'encre pleine qui couvre exactement les lignes $5$ à $13$ et les colonnes $6$ à $24$, c'est-à-dire la bande et tout son pourtour. Elle obtient le score maximal, $39$, parce que ses $39$ pixels de bande sont tous noirs. Le neurone ne mesure pas la présence d'un **trait**, il mesure une quantité d'encre : n'importe quelle surface encrée qui contient la bande le satisfait mieux qu'un trait fin.",
  },
  {
    id: "b-r5-10",
    type: "texte",
    texte:
      "Du plus grand au plus petit score, le classement obtenu place donc la tache, puis le $0$, puis le $7$, puis le $1$, et il est **faux** pour ce qu'on voulait : une surface pleine y passe devant la barre qu'on cherchait à repérer.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5.3 · Temps 3
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r5-12",
    type: "titre",
    niveau: 2,
    texte: "Troisième temps : refuser ce qui déborde",
  },
  {
    id: "b-r5-13",
    type: "texte",
    texte:
      "Ce qui manque au neurone est de pouvoir **refuser**, et la décomposition $(4.2)$ dit comment, puisqu'un poids négatif fait descendre $z$ quand son pixel porte de l'encre.\n\nOn garde donc $+1$ sur la bande, et on pose $-1$ sur son pourtour $P$, une marge de trois cases tout autour. Ce pourtour est le rectangle des lignes $5$ à $13$ et des colonnes $6$ à $24$ privé de la bande elle-même, soit $9\\times 19-39=132$ pixels.",
  },
  {
    id: "b-r5-14",
    type: "formule",
    ancre: "detecteur-temps3",
    latex:
      "w_{k}=\\mathbb{1}\\{k\\in Z\\}-\\mathbb{1}\\{k\\in P\\},\\quad b=0\\qquad\\Longrightarrow\\qquad z=\\sum_{k\\in Z} x_{k}\\ -\\ \\sum_{k\\in P} x_{k}",
    alt: "Le poids de rang k vaut l'indicatrice de l'appartenance de k à la zone Z, moins l'indicatrice de l'appartenance de k au pourtour P, et le biais reste nul. La préactivation z vaut alors la somme des x k sur la zone, moins la somme des x k sur le pourtour.",
    numero: "5.2",
    legende:
      "$Z$ et $P$ sont disjoints : $39$ rangs à $+1$, $132$ rangs à $-1$, et les $613$ autres restent à $0$. Le neurone regarde $171$ pixels sur $784$, et ignore les autres.",
  },
  {
    id: "b-r5-15",
    type: "sortie",
    ancre: "scores-temps3",
    titre: "Le même calcul, avec le pourtour négatif",
    texte:
      "    zone positive    lignes 8 à 10, colonnes 9 à 21   (39 pixels à +1)\n    pourtour négatif marge de 3 pixels autour   (132 pixels à -1)\n    tous les autres poids sont nuls  (613 pixels à 0)\n\n      entrée                                  temps 1     temps 3\n      image de test n°0 (un 7)                23.4000     10.6627\n      image de test n°2 (un 1)                 5.0039     -5.6431\n      image de test n°3 (un 0)                25.8549     -9.8078\n      tache large construite                  39.0000    -93.0000",
    lecture: [
      "**Le classement s'inverse**, et le $7$ reste seul positif : sa barre dépose dans la bande sensiblement plus d'encre que dans le pourtour, et la soustraction lui laisse donc un score positif. Le tableau n'a que deux colonnes parce que le deuxième temps ne pose aucun poids : il lit les scores du premier et constate qu'ils sont faux.",
      "Le $0$ passe de $+25{,}85$ à $-9{,}81$ : son arc traversait la bande, mais il traverse aussi le pourtour, et le second terme l'emporte.",
      "La tache passe de $+39$ à $-93$ : elle remplit le pourtour entier, $132$ pixels à $-1$, et c'est très exactement ce qu'on lui demandait de payer.",
      "Le $1$ reste faible dans les deux cas, mais il passe sous zéro : sa hampe traverse le pourtour bien plus qu'elle ne touche la bande, ce qui fait passer son score de $+5{,}00$ à $-5{,}64$.",
    ],
  },
  {
    id: "b-r5-17",
    type: "texte",
    texte:
      "Un neurone est donc entièrement décrit par deux choses, toutes deux inscrites dans $\\mathbf{w}$ : les endroits **où il veut de l'encre**, marqués par des poids positifs, et ceux **où il n'en veut pas**, marqués par des poids négatifs. Le second n'est pas un raffinement du premier, puisque sans lui le neurone ne distingue pas un trait d'une tache, et la mesure ci-dessus le montre en quatre nombres.",
  },
  {
    id: "b-r5-18",
    type: "verification",
    numero: 10,
    enonce:
      "Les quatre entrées de la mesure ci-dessus sont reprises ici, sans leurs scores.",
    questions: [
      "Classer les quatre entrées par score **décroissant** du détecteur de $(5.2)$.",
      "Justifier chaque position par la décomposition $(4.2)$ : quelle part du score vient de la zone, quelle part du pourtour.",
      "Quelle forme devrait avoir une image pour obtenir le score le plus bas possible avec les poids de $(5.2)$, et que vaudrait alors ce score ?",
    ],
  },
  {
    id: "b-r5-19",
    type: "encart",
    ton: "note",
    titre: "Ce neurone-là a été posé, pas appris",
    texte:
      "Ses $171$ coefficients non nuls ont été écrits à la main, en trois lignes de code, et aucun entraînement n'y est intervenu.\n\nCe détecteur-là ne reconnaît pourtant aucun chiffre : il repère un trait, à un endroit et à un seul. Il en faudrait beaucoup, et la page 6 commence par en poser dix.\n\nQu'une machine qui choisit ses poids toute seule fabrique elle aussi des pièces de ce genre est un espoir raisonnable, puisqu'un humain vient d'en construire une. La page 11 mesure si elle le fait.",
  },
];
