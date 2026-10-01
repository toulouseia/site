import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 10 · Un exemple ne suffit pas
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig12-un-exemple`, qui donne la réponse avant qu'on l'explique : cent
// pour cent des images de test prédites « 2 ».
//
// ÉCART N°2 : la source écrit que la collection des moyennes est « en gros »
// le gradient négatif, « ou du moins quelque chose de proportionnel ». Ce cours
// LÈVE la réserve : la proposition 7 démontre qu'il n'y a ni facteur ni
// approximation.
//
// Les MINI-LOTS sont CITÉS, en trois lignes, avec renvoi au chapitre 3,
// propositions 4 et 5. Ils ne sont pas redémontrés.
// ─────────────────────────────────────────────────────────────────────────────

export const R10_UN_EXEMPLE: Bloc[] = [
  {
    id: "b-rp10-0",
    type: "texte",
    texte:
      "Tout ce qui précède n'a regardé qu'une seule image, et rien n'empêche de lui appliquer deux cents pas de descente pour voir ce que le réseau répond ensuite sur dix mille images qu'il n'a jamais vues. Que devient un réseau qui n'a écouté qu'un seul exemple ?",
  },
  {
    id: "b-rp10-4f",
    type: "image",
    ancre: "ecouter-un-seul-exemple",
    src: "/cours/lecon4/l4-fig12-un-exemple.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Une large barre de brique occupe toute la largeur de la figure et porte cent virgule zéro zéro pour cent, avec la mention dix mille sur dix mille prédites « deux ». Dessous, un relevé : la précision de test avant les deux cents pas valait zéro virgule un trois un quatre ; la perte sur l'image de travail après les deux cents pas est nulle à la précision de la machine ; la probabilité accordée à la classe deux vaut un ; la précision de test après les deux cents pas vaut zéro virgule un zéro trois deux ; et la fréquence de la classe deux dans le jeu de test vaut mille trente-deux sur dix mille, soit zéro virgule un zéro trois deux. En pied, la mention que les deux derniers nombres sont égaux.",
    legende:
      "La précision tombe exactement sur la fréquence de la classe : le réseau ne classe plus, il répète.",
  },
  {
    id: "b-rp10-4g",
    type: "texte",
    texte:
      "Le réseau a parfaitement appris l'image qu'on lui a donnée, et il répond $2$ à tout le reste, sans une seule exception sur dix mille images.\n\nLes deux derniers nombres du relevé sont égaux, et ce n'est pas une coïncidence.",
  },
  {
    id: "b-rp10-2",
    type: "titre",
    niveau: 2,
    texte: "Ce qui arrive si l'on n'écoute qu'un seul exemple",
  },
  {
    id: "b-rp10-4",
    type: "sortie",
    ancre: "mesure-4",
    titre:
      "Deux cents pas sur une seule image · cours/lecon4/mesures.py, mesure 4",
    texte:
      "  200 pas de descente sur la seule image de travail, eta = 0.5\n\n  précision de test AVANT les pas                0.1314\n  perte sur cette image avant les pas             1.408379\n  perte sur cette image après 200 pas             0.000000   (sous le seuil de représentation)\n  probabilité accordée à la classe 2 après       1.0000000000\n  images de test prédites « 2 »                  10000 sur 10000\n  part des images de test prédites « 2 »         100.00 %\n  précision de test                              0.1032\n  fréquence de la classe 2 dans le jeu de test    1032 / 10000 = 0.1032\n  écart entre la précision et cette fréquence     0.000e+00\n\n  la classe la plus fréquente du jeu de test     1, 1135 / 10000 = 0.1135\n  c'est le plafond de tout réseau qui répond toujours la même chose",
    lecture: [
      "**Le réseau a parfaitement appris l'image**, puisque sa perte tombe sous le seuil de représentation et qu'il accorde $1{,}0000000000$ à la classe $2$ à l'affichage, la proposition 1 interdisant d'atteindre exactement $1$.",
      "**Il répond $2$ à tout**, et non presque tout : $10\\,000$ images sur $10\\,000$, sans exception, parce que la descente n'a écouté qu'une demande et l'a exaucée jusqu'au bout.",
      "**Sa précision, $0{,}1032$, est exactement la fréquence de la classe $2$ dans le jeu de test**, $1\\,032/10\\,000$, à zéro près : un réseau qui répond toujours la même chose a pour précision la fréquence de cette classe, puisqu'il a raison sur les images de cette classe et sur aucune autre.",
      "Le plafond d'un tel réseau est $0{,}1135$, la fréquence de la classe la plus représentée, et aucune constante ne fait mieux.",
    ],
  },
  {
    id: "b-rp10-5",
    type: "animation",
    ancre: "necouter-quun-seul",
    animationId: "necouter-quun-seul",
    legende:
      "Le réseau entraîné $200$ pas sur la seule image n° 5 : les deux répartitions des dix mille images de test, à la même échelle.",
  },
  {
    id: "b-rp10-6",
    type: "titre",
    niveau: 2,
    texte: "La moyenne des corrections",
  },
  {
    id: "b-rp10-7",
    type: "texte",
    texte:
      "On refait donc pour chaque exemple le parcours qui précède, et l'on moyenne les corrections souhaitées. Reste à savoir ce que cette moyenne est.",
  },
  {
    id: "b-rp10-8",
    type: "derivation",
    ancre: "proposition-7",
    titre:
      "La moyenne des gradients d'exemples est le gradient du coût (proposition 7)",
    hypotheses: [
      "$C_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\ell_{n}(\\boldsymbol{\\theta})$, avec $\\ell_{n}:\\mathbb{R}^{p}\\rightarrow\\mathbb{R}_{\\geq 0}$.",
      "Chaque $\\ell_{n}$ admet des dérivées partielles en $\\boldsymbol{\\theta}$.",
      "$N$ est fixé et ne dépend pas de $\\boldsymbol{\\theta}$.",
    ],
    proprietes: [
      "Linéarité de la dérivation : $(f+g)'=f'+g'$ et $(\\lambda f)'=\\lambda f'$",
      "Définition du gradient comme vecteur des $p$ dérivées partielles",
    ],
    etapes: [
      {
        texte:
          "**On dérive composante par composante.** Pour $i\\in[\\![1,p]\\!]$ fixé, $\\partial C_{\\mathcal{D}}/\\partial\\theta_{i}$ est la dérivée d'une somme finie de $N$ fonctions, multipliée par la constante $1/N$.",
      },
      {
        latex:
          "\\frac{\\partial C_{\\mathcal{D}}}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\frac{\\partial\\ell_{n}}{\\partial\\theta_{i}}(\\boldsymbol{\\theta})",
        alt: "La dérivée partielle du coût sur le jeu par rapport à la i-ième composante vaut un sur N fois la somme, pour n allant de un à N, des dérivées partielles de la perte de l'exemple n par rapport à cette même composante.",
        justification:
          "Linéarité de la dérivation. Il n'y a aucune approximation à cette ligne : c'est une égalité.",
      },
      {
        texte:
          "**On rassemble les $p$ composantes.** Le vecteur dont la $i$-ième composante est $\\frac{1}{N}\\sum_{n}\\partial\\ell_{n}/\\partial\\theta_{i}$ est, par définition du gradient, $\\frac{1}{N}\\sum_{n}\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell_{n}$.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n=1}^{N}\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell_{n}(\\boldsymbol{\\theta})",
      alt: "Le gradient du coût sur le jeu par rapport à thêta vaut un sur N fois la somme des gradients des pertes de chaque exemple.",
    },
    interpretation:
      "La moyenne des corrections souhaitées **est** le gradient du coût : ni « en gros », ni « quelque chose de proportionnel », et sans facteur, sans approximation, sans hypothèse sur les données. C'est la linéarité de la dérivation, et rien d'autre. La descente du chapitre 3 réclame $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$ et l'algorithme donne $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell_{n}$ ; cette proposition ferme le passage entre les deux.",
    limites: [
      "L'égalité vaut pour **la moyenne sur tout le jeu**. Une moyenne sur un sous-ensemble n'est pas le gradient du coût, et le chapitre 3 a dit dans quel sens elle en approche.",
    ],
  },
  {
    id: "b-rp10-9",
    type: "encart",
    ton: "note",
    titre: "La réserve est levée",
    texte:
      "On lit souvent que la collection de ces moyennes donne « en gros » le gradient négatif, « ou du moins quelque chose de proportionnel », et la proposition 7 montre que la réserve n'a pas lieu d'être : **c'est le gradient, exactement**. La prudence viendrait d'une confusion avec les mini-lots, où l'approximation est réelle et mesurée, mais c'est une autre question.",
  },
  {
    id: "b-rp10-10",
    type: "titre",
    niveau: 2,
    texte: "Pourquoi la moyenne est nécessaire",
  },
  {
    id: "b-rp10-11",
    type: "sortie",
    ancre: "mesure-5",
    titre:
      "Deux exemples demandent-ils la même chose ? · cours/lecon4/mesures.py, mesure 5",
    texte:
      "  cosinus entre les gradients de deux exemples pris séparément\n  réseau non entraîné, 2000 paires de chaque sorte\n\n      paires                cosinus moyen     écart-type     paires\n      même classe            +0.4110          0.1438        2000\n      classes différentes    -0.0263          0.0494        2000",
    lecture: [
      "**Deux images de la même classe demandent des corrections qui vont grossièrement dans le même sens**, de cosinus moyen $+0{,}4110$, et grossièrement seulement, puisque l'écart-type $0{,}1438$ dit que la valeur va d'environ $+0{,}27$ à $+0{,}55$ d'une paire à l'autre.",
      "**Deux images de classes différentes demandent des corrections presque sans rapport**, $-0{,}0263$ en moyenne avec un écart-type de $0{,}0494$ : presque orthogonales, très légèrement opposées.",
      "C'est ce désaccord qui rend la moyenne nécessaire, parce qu'exaucer une demande à la fois revient à défaire ce que la précédente a fait, et la mesure 4 montre où cela mène quand on n'en écoute qu'une.",
    ],
  },
  {
    id: "b-rp10-13",
    type: "titre",
    niveau: 2,
    texte: "En pratique, on ne moyenne pas sur tout le jeu",
  },
  {
    id: "b-rp10-14",
    type: "texte",
    texte:
      "La proposition 7 porte sur les $N=60\\,000$ exemples, alors qu'un entraînement moyenne sur des **mini-lots** de $64$. Le chapitre 3, page 9, l'a établi : le gradient d'un mini-lot est un estimateur sans biais du gradient complet, proposition 4, et sa qualité croît comme la racine de la taille du lot, proposition 5. Ce chapitre ne redémontre ni l'un ni l'autre.",
  },
  {
    id: "b-rp10-15",
    type: "encart",
    ton: "attention",
    titre: "L'ivrogne et le calculateur",
    texte:
      "On compare parfois la descente sur mini-lots à un ivrogne qui dévale la pente en titubant, opposé à un calculateur méthodique qui descend lentement mais droit. L'image dit quelque chose de juste, puisque le trajet est irrégulier et qu'il va plus vite, et elle est trompeuse sur un point : **un ivrogne ne suit aucune direction, un mini-lot en suit une**. Le chapitre 3 l'a mesurée, un lot de $64$ pointant en moyenne à $41$ degrés du gradient complet, et quarante et un degrés ce n'est pas au hasard, c'est la même direction vue de travers.",
  },
  {
    id: "b-rp10-16",
    type: "verification",
    numero: 46,
    enonce:
      "Le réseau entraîné sur un seul exemple a une précision de test de $0{,}1032$, et le jeu de test compte $1\\,032$ images de classe $2$ sur $10\\,000$.",
    questions: [
      "D'où vient exactement ce nombre ? Répondre sans invoquer d'apprentissage.",
      "Quelle serait la précision d'un réseau qui répondrait toujours $1$ ? Et quel est le meilleur score atteignable par un réseau qui répond toujours la même chose ?",
    ],
  },
  {
    id: "b-rp10-17",
    type: "verification",
    numero: 47,
    enonce:
      "Deux exemples de classes différentes ont des gradients de cosinus moyen $-0{,}0263$.",
    questions: [
      "Qu'est-ce que cela dit de ce qui arriverait si on les traitait l'un après l'autre plutôt qu'en moyenne ?",
      "Le cosinus de deux exemples de même classe vaut $+0{,}4110$ en moyenne, et non $+1$. Que faudrait-il pour qu'il vaille $+1$ ?",
    ],
  },
];
