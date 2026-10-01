import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 10 · Ce que le gradient encode
//
// La page lit le gradient au lieu de le calculer. Deux informations par
// composante, et le texte les sépare : le SIGNE, qui dit le sens, et la TAILLE
// RELATIVE, qui dit ce qui compte.
//
// Les 23 882 zéros sont décomposés en trois termes, dont un que le programme a
// dû mesurer parce qu'il ne se devine pas : les pixels rarement encrés. La
// figure 23 montre OU sont les pixels muets -- au bord -- ce qu'aucun compte ne
// dit.
//
// La dette « sigma' <= 1/4 » du chapitre 2 est réglée ici.
// Tous les nombres sortent de cours/lecon3/mesures.py, mesures 4 et 10.
// ─────────────────────────────────────────────────────────────────────────────

export const D10_ENCODE: Bloc[] = [
  {
    id: "b-d10-0",
    type: "texte",
    texte:
      "Le même pas s'applique aux cent mille paramètres à la fois. Reçoivent-ils tous la même correction ?",
  },
  {
    id: "b-d10-fig22",
    type: "image",
    ancre: "composantes-rangees",
    src: "/cours/lecon3/l3-fig22-composantes-rangees.svg",
    largeur: 1380,
    hauteur: 660,
    alt: "Une courbe montante et très creusée. Elle part du coin bas gauche, s'élève presque à la verticale sur le premier dixième de la largeur, puis s'aplatit et n'avance plus que lentement jusqu'au coin haut droit. L'axe horizontal porte les repères un pour cent, dix pour cent et cinquante pour cent, sous la mention des composantes. Trois ronds brique marquent la courbe à ces trois abscisses, et leurs trois valeurs sont portées à droite sous la mention de la somme.",
    legende:
      "Les composantes sont rangées de la plus grande à la plus petite, puis cumulées. Une courbe qui monterait en diagonale dirait qu'elles se valent toutes.",
  },
  {
    id: "b-d10-1",
    type: "texte",
    texte:
      "La règle $(8.4)$ se contente de soustraire le gradient et ne dit jamais ce qu'il **dit**. Il y a pourtant trois choses à lire dans une composante, et la troisième est celle qui décide de la suite.",
  },
  {
    id: "b-d10-2",
    type: "texte",
    texte:
      "$\\boldsymbol{\\theta}$ et $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta})$ vivent dans le même espace et ont la même taille : à chaque paramètre $\\theta_{i}$ correspond exactement une composante $g_{i}$ du gradient. La mise à jour se lit alors coordonnée par coordonnée, $\\theta_{i}\\leftarrow\\theta_{i}-\\eta\\,g_{i}$, et chaque $g_{i}$ ne concerne que son propre paramètre.",
  },
  {
    id: "b-d10-3",
    type: "tableau",
    ancre: "deux-informations",
    titre: "Ce que porte une composante",
    cleEnTete: true,
    entetes: ["Ce qu'on lit", "Ce que cela dit", "Ce que cela ne dit pas"],
    lignes: [
      [
        "Le **signe** de $g_{i}$",
        "Dans quel sens pousser $\\theta_{i}$ : $g_{i}>0$ fait diminuer $\\theta_{i}$, $g_{i}<0$ le fait augmenter",
        "De combien : le signe ne porte aucune amplitude",
      ],
      [
        "La **valeur absolue** de $g_{i}$",
        "De combien $C_{\\mathcal{D}}$ change quand $\\theta_{i}$ bouge d'un peu, donc l'importance de ce paramètre **ici et maintenant**",
        "Si ce paramètre est important en général : la valeur change à chaque pas",
      ],
      [
        "$g_{i}=0$ exactement",
        "Que $C_{\\mathcal{D}}$ ne dépend pas de $\\theta_{i}$ au premier ordre : ce paramètre n'est pas modifié à ce pas",
        "Que $\\theta_{i}$ soit inutile : il peut redevenir non nul au pas suivant",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10.1 · La distribution
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d10-4",
    type: "titre",
    niveau: 2,
    texte: "Les $101\\,770$ composantes, mesurées",
  },
  {
    id: "b-d10-5",
    type: "sortie",
    ancre: "distribution-gradient",
    titre: "La distribution des composantes · cours/lecon3/mesures.py, mesure 4",
    texte:
      "    graine 0, AVANT tout apprentissage, sur 2048 exemples\n    p                                       101770 composantes\n    plus grande valeur absolue              1.0084e-01\n    médiane des valeurs absolues            2.4935e-04\n    rapport de la plus grande à la médiane  404\n    norme du gradient                       1.398869\n\n    les     1 % plus grandes portent  14.55 % de la somme des |g_i|\n    les    10 % plus grandes portent  60.39 % de la somme des |g_i|\n    les    50 % plus grandes portent  98.90 % de la somme des |g_i|\n\n    composantes exactement nulles           23882, soit 23.5 %",
    lecture: [
      "**La composante la plus importante pèse $404$ fois la composante médiane.** Ce n'est pas une queue de distribution un peu longue : deux ordres de grandeur et demi séparent deux composantes d'un même vecteur, prises au même instant.",
      "**La moitié la plus faible des cent mille paramètres ne porte que $1{,}1\\,\\%$ du total**, et un dixième des composantes en porte $60\\,\\%$. Le gradient encode donc bien une importance **relative** : il dit où le rendement d'une correction est le meilleur.",
      "Une conséquence immédiate pour la règle $(8.4)$ : $\\eta$ est le **même** pour toutes les composantes, mais le pas effectif $\\eta\\,|g_{i}|$ ne l'est pas. Un même $\\eta$ déplace beaucoup les paramètres importants et presque pas les autres, si bien que c'est le gradient, et non le réglage, qui répartit l'effort.",
      "Près d'un quart des $101\\,770$ composantes sont **exactement** nulles, et elles sont toutes dans $W^{[1]}$, dont elles occupent $23{,}8\\,\\%$ des $100\\,352$ coefficients. Ce n'est pas un arrondi, et la mesure suivante dit d'où elles viennent.",
    ],
  },
  {
    id: "b-d10-6",
    type: "animation",
    ancre: "le-gradient-par-ses-composantes",
    animationId: "le-gradient-par-ses-composantes",
    legende:
      "Les composantes du gradient se rangent par valeur absolue, et le rapport $404$ entre la plus grande et la plus petite se lit sur la hauteur des barres.",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 10.2 · Les zéros
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d10-8",
    type: "titre",
    niveau: 2,
    texte: "D'où viennent les $23\\,882$ zéros",
  },
  {
    id: "b-d10-9",
    type: "texte",
    texte:
      "Le coefficient qui relie le pixel $j$ au neurone caché $i$ ne compte, pour une image donnée, que par le **produit** de deux quantités : l'encre du pixel $j$ sur cette image, et ce que le neurone $i$ renvoie vers l'arrière. Un pixel blanc annule le premier facteur ; un neurone éteint, c'est-à-dire un neurone que $\\mathrm{ReLU}$ a coupé parce que sa préactivation était négative, annule le second. La composante du gradient étant la somme de ces produits sur les $2\\,048$ images de l'échantillon, **elle est nulle quand, pour chaque image, l'un des deux facteurs l'est**. Le chapitre 4 écrira ce produit ; ici il suffit de savoir qu'il en est un.\n\nDeux cas extrêmes s'en déduisent, pixel blanc sur toutes les images et neurone éteint sur toutes les images, et il en reste un troisième, entre les deux, qu'il a fallu mesurer.",
  },
  {
    id: "b-d10-fig23",
    type: "image",
    ancre: "dou-viennent-les-zeros",
    src: "/cours/lecon3/l3-fig23-dou-viennent-les-zeros.svg",
    largeur: 1380,
    hauteur: 780,
    alt: "Deux grilles carrées de vingt-huit sur vingt-huit cases, côte à côte. Sur celle de gauche, intitulée sur l'échantillon, les cases en brique forment un large cadre le long des quatre bords, et le centre est vide. Sur celle de droite, intitulée sur le jeu entier, les cases en brique sont bien moins nombreuses et se cantonnent aux quatre coins et aux tout premiers rangs. Sous chaque grille est porté le compte de pixels muets sur sept cent quatre-vingt-quatre.",
    legende:
      "Un pixel muet est un pixel dont l'octet vaut zéro sur toutes les images considérées. Aucun chiffre manuscrit n'atteint les bords.",
  },
  {
    id: "b-d10-10",
    type: "sortie",
    ancre: "zeros-decomposes",
    titre: "La décomposition des zéros · cours/lecon3/mesures.py, mesure 10",
    texte:
      "    pixels jamais encrés sur les 2048 exemples      144 sur 784\n    pixels jamais encrés sur les 60000 images    67 sur 784\n      terme intrinsèque au jeu dans W^[1]   67 x 128 = 8576\n    neurones cachés éteints sur les 2048       0 sur 128\n\n    zéros dans W^[1]                        23882\n      dont colonnes de pixels muets         18432   (144 x 128)\n      dont lignes de neurones éteints       0   (0 x 784)\n      comptés deux fois (intersection)      -0\n      total expliqué                        18432\n      reste inexpliqué par les deux causes  5450\n        ces zeros portent sur des pixels encres par\n        mediane 3 image(s) sur 2048,   maximum 663\n        pixels concernes                    295 sur 784\n    zéros dans b^[1]                        0   (les neurones éteints)\n    zéros dans W^[2]                        0\n    zéros dans b^[2]                        0",
    lecture: [
      "**Premier terme, $18\\,432$ zéros.** Sur l'échantillon de $2\\,048$ images, $144$ pixels ne portent jamais d'encre, et leur colonne dans $W^{[1]}$ est nulle en entier, soit $144\\times 128$ coefficients.",
      "**Les deux comptes de pixels muets ne disent pas la même chose.** Sur les $60\\,000$ images du jeu entier, seuls $67$ pixels sont muets, et c'est le terme **intrinsèque** au jeu, $67\\times 128=8\\,576$, celui qui subsisterait quel que soit l'échantillon. Les $144$ de l'échantillon comprennent ces $67$ plus $77$ pixels qui sont encrés quelque part dans le jeu, mais pas dans ces $2\\,048$ images-là.",
      "**Le deuxième terme est nul.** Aucun neurone caché n'est éteint sur les $2\\,048$ images à la fois : la couche n'a pas de neurone mort au départ, et $\\mathbf{b}^{[1]}$ n'a donc aucune composante nulle.",
      "**Troisième terme, $5\\,450$ zéros, et il ne se devinait pas.** Ils portent sur $295$ pixels encrés par une **poignée** d'images, la médiane étant de $3$ images sur $2\\,048$. Il suffit que ces trois images-là aient ce neurone-là éteint pour que le produit soit nul sur toute la somme. Ce n'est ni un pixel mort ni un neurone mort : c'est une rencontre entre les deux.",
      "$W^{[2]}$ et $\\mathbf{b}^{[2]}$ n'ont aucun zéro : la couche de sortie voit toujours quelque chose.",
    ],
  },
  {
    id: "b-d10-11",
    type: "verification",
    numero: 31,
    enonce:
      "La composante la plus grande du gradient vaut $404$ fois la médiane.",
    questions: [
      "Qu'est-ce que cela dit sur l'effet d'un même pas $\\eta$ appliqué à tous les poids ?",
      "Si l'on voulait que tous les paramètres bougent **autant les uns que les autres**, que faudrait-il changer dans la règle $(8.4)$ ? Et que perdrait-on en le faisant ?",
      "Un paramètre dont la composante est nulle à ce pas est-il inutile ? Répondre en citant la décomposition des zéros.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10.3 · L'empilement
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d10-12",
    type: "titre",
    niveau: 2,
    texte: "Trois étages, et aucun ne vit où vit le précédent",
  },
  {
    id: "b-d10-13",
    type: "tableau",
    ancre: "empilement",
    cleEnTete: true,
    entetes: ["Objet", "Départ", "Arrivée", "Ce qui y varie"],
    lignes: [
      [
        "Le réseau $f_{\\boldsymbol{\\theta}}$",
        "$\\mathbb{R}^{784}$",
        "$\\Delta^{\\circ}_{9}$",
        "Une image ; $\\boldsymbol{\\theta}$ est fixé",
      ],
      [
        "Le coût $C_{\\mathcal{D}}$",
        "$\\mathbb{R}^{101\\,770}$",
        "$\\mathbb{R}_{\\geq 0}$",
        "Les paramètres ; $\\mathcal{D}$ est fixé",
      ],
      [
        "Le gradient $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}$",
        "$\\mathbb{R}^{101\\,770}$",
        "$\\mathbb{R}^{101\\,770}$",
        "Les paramètres ; il rend un vecteur, pas un nombre",
      ],
    ],
    legende:
      "Le coût est une fonction **du réseau**, et le gradient une fonction **du coût** : chaque étage prend le précédent comme objet. Les deux derniers partent du même espace, celui des paramètres, et c'est leur **arrivée** qui les sépare : un nombre pour le coût, un vecteur de même taille que $\\boldsymbol{\\theta}$ pour le gradient. Le réseau, lui, ne part pas du tout de là.",
  },
  {
    id: "b-d10-14",
    type: "encart",
    ton: "rappel",
    titre: "Dette du chapitre 2 réglée : $\\sigma'\\leq 1/4$",
    texte:
      "Le chapitre 2 a démontré que $\\sigma'=\\sigma(1-\\sigma)\\leq 1/4$, et a renvoyé sa conséquence ici. La voici : les composantes du gradient d'une couche s'obtiennent à partir de celles de la couche suivante, en les multipliant par la dérivée de l'activation traversée. Avec la sigmoïde, ce facteur ne dépasse jamais $1/4$. Le réseau de ce chapitre n'a qu'une couche cachée, et n'en souffre donc guère ; mais dans un réseau à quatre couches, les paramètres de la première recevraient un gradient multiplié par au plus $(1/4)^{4}=1/256$, soit deux cent cinquante-six fois plus petit que ceux de la dernière. C'est un effet d'**empilement**, et il n'a rien à voir avec le rapport $404$ mesuré plus haut, qui vaut à l'intérieur d'une même couche. Avec $\\mathrm{ReLU}$, dont la dérivée vaut $0$ ou $1$, cette atténuation systématique disparaît, et c'est l'une des raisons du choix du chapitre 2. **Le mécanisme exact par lequel les composantes d'une couche se déduisent de la suivante est le sujet du chapitre 4** ; ce chapitre en constate l'effet sans l'écrire.",
  },
];
