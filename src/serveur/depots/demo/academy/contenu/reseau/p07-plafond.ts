import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 7 · Le plafond, et d'où il vient
//
// LA PAGE MONTRE L'ÉCHEC AVANT DE LE DÉMONTRER. Un élève qui reçoit la
// convexité avant la question reçoit un outil sans savoir à quoi il sert.
// L'ordre est donc : deux images de 4 et leur milieu, la question, la mesure,
// puis seulement la définition, la proposition 2 et le corollaire qui explique
// le zéro mesuré. Le réseau à ReLU passe en dernier, sur la même paire.
//
// La preuve est inchangée ; seule sa place l'est.
//
// Tous les nombres sortent de cours/lecon2/mesures.py, section 5. La paire
// n°115 / n°668 y est cherchée exhaustivement, sans tirage.
// ─────────────────────────────────────────────────────────────────────────────

export const P07_PLAFOND: Bloc[] = [
  {
    id: "b-r7-1",
    type: "texte",
    texte:
      "Le premier modèle se trompe huit cent sept fois sur dix mille, et il cesse de progresser très tôt. Ou bien il est mal réglé, et mieux l'entraîner suffirait, ou bien sa forme même lui interdit de faire mieux, et il faudrait alors en changer. Les deux se soignent si différemment qu'il vaut mieux savoir laquelle est vraie avant de dépenser un paramètre de plus. Laquelle est-ce ?",
  },
  {
    id: "b-r7-1f",
    type: "image",
    ancre: "milieu-de-deux-quatre",
    src: "/cours/lecon2/l2-fig16-milieu-de-deux-quatre.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Trois grilles carrées de vingt-huit sur vingt-huit, côte à côte, en encre sombre sur fond blanc. La première porte l'image de test numéro cent quinze, un quatre manuscrit ; la deuxième l'image numéro six cent soixante-huit, un autre quatre. Un grand signe plus les sépare. De la deuxième part une flèche horizontale, légendée divisé par deux, qui mène à la troisième : la moyenne des deux images pixel par pixel, où les traits des deux quatre se superposent en gris et où aucun n'est franc. Sous chacune des trois grilles, la même ligne en brique dit que le modèle linéaire lit quatre. Un filet en bas rappelle combien d'images de quatre le jeu de test contient, et combien sont lues quatre par le modèle linéaire comme par le modèle à deux couches de la page 10.",
    legende:
      "Le milieu est une entrée comme les autres, et le modèle la classe comme les autres. La paire est prise parmi les $982$ images de $4$ du jeu de test, dont $921$ que les deux modèles lisent $4$, dans l'ordre des indices.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.1 · L'échec, montré puis démontré
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r7-2",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'un modèle linéaire ne peut pas répondre",
  },
  {
    id: "b-r7-2b",
    type: "texte",
    texte:
      "Ses dix scores $\\mathbf{z}=W\\mathbf{x}+\\mathbf{b}$ dépendent de l'image par un produit matriciel et une addition, et pas davantage. L'usage appelle un tel modèle **linéaire**, bien que l'ajout de $\\mathbf{b}$ le rende à proprement parler affine, et le cours garde ce nom d'usage.\n\nLe $\\mathrm{softmax}$ qui suit ne déplace pas la plus grande des dix coordonnées, donc il ne change pas la classe prédite : tout ce qui suit se lit sur $\\mathbf{z}$ seul. Cela se voit sur $(6.3)$, où les dix coordonnées se divisent par le **même** dénominateur, si bien que les comparer revient à comparer leurs numérateurs, et l'exponentielle étant croissante, à comparer les $z_{k}$.\n\nOn note enfin $R_{c}$ l'ensemble des images que ce modèle range dans la classe $c$. Les mesures qui suivent comptent les paires dont les deux images tombent dans la même région, et la démonstration les écrira $R_{k}$, avec $k=c+1$, pour indexer les coordonnées à partir de $1$.",
  },
  {
    id: "b-r7-3",
    type: "sortie",
    ancre: "paire-de-quatre",
    titre:
      "Deux $4$, leur milieu, et ce que le modèle linéaire en dit · cours/lecon2/mesures.py, section 5",
    texte:
      "      image de test n°115, classe 4\n      image de test n°668, classe 4\n      leur milieu ( x_115 + x_668 ) / 2\n\n                            image 115   image 668   milieu\n      MODELE 1, lineaire           4          4         4",
    lecture: [
      "Le milieu est l'image moyenne des deux, pixel par pixel : $\\tfrac{1}{2}(\\mathbf{x}_{115}+\\mathbf{x}_{668})\\in[0,1]^{784}$. C'est une entrée comme les autres, et le modèle la classe comme les autres.",
    ],
  },
  {
    id: "b-r7-4",
    type: "texte",
    texte:
      "Ce modèle peut-il réussir les trois, ou sa troisième réponse est-elle déjà fixée par les deux premières ?\n\nLa mesure ci-dessous le compare à un autre, appelé **modèle 3** parce qu'il vient en troisième dans une série de quatre que la page 11 récapitule. Celui-là porte entre ses deux étapes de calcul une fonction que la page 9 construit et nomme $\\mathrm{ReLU}$ ; ici, il ne sert qu'à montrer que le compte obtenu n'est pas nul par nature.",
  },
  {
    id: "b-r7-4-milieu",
    type: "animation",
    ancre: "deux-quatre-et-leur-milieu",
    animationId: "deux-4-et-leur-milieu",
    legende:
      "Entre deux images de la même classe, le modèle linéaire ne peut pas changer d'avis en chemin. Le réseau à ReLU, lui, le peut : c'est toute la différence entre les deux familles, et la page la démontre ensuite.",
  },
  {
    id: "b-r7-5",
    type: "sortie",
    ancre: "mesure-convexite",
    titre:
      "La question, mesurée sur $5\\,000$ paires · cours/lecon2/mesures.py, section 5",
    texte:
      "    5000 paires d'images de MEME classe, 500 par classe,\n    tirees dans les 10 000 images de test, graine 0.\n\n  -- MODELE 1, lineaire ----------------------------------------------------\n      paires dont les DEUX extremites sont dans R_c   4250 sur 5000\n      parmi elles, milieu classe AILLEURS              0   (0.00 %)\n      sur TOUTES les paires, milieu classe ailleurs    121   (2.42 %)",
    lecture: [
      "**Zéro sur $4\\,250$** : chaque fois que les deux extrémités reçoivent la même classe, le milieu la reçoit aussi, sans une seule exception.",
      "La dernière ligne quitte les $4\\,250$ et compte sur les $5\\,000$ paires de départ : $121$ fois, soit $2{,}42\\,\\%$, le milieu reçoit une classe autre que celle des deux images qui l'encadrent. Ce n'est pas la même question que la ligne au-dessus, et ce compte ne contredit rien.",
      "La graine $0$ fixe le tirage des paires, de sorte que deux exécutions comparent les mêmes images.",
      "La troisième réponse est donc fixée par les deux premières, et un compte nul sur $4\\,250$ tirages n'est pas un bon résultat mais la marque d'une contrainte. Il reste à dire laquelle.",
    ],
  },
  {
    id: "b-r7-6",
    type: "titre",
    niveau: 3,
    texte: "D'où vient le zéro",
  },
  {
    id: "b-r7-7",
    type: "definition",
    terme: "Partie convexe",
    anglais: "convex set",
    texte:
      "Une partie $C\\subseteq\\mathbb{R}^{d}$ telle que pour tous $u,v\\in C$ et tout $t\\in[0,1]$, $(1-t)u+tv\\in C$. Le segment joignant deux points de $C$ reste entièrement dans $C$.",
  },
  {
    id: "b-r7-8",
    type: "definition",
    terme: "Région de décision",
    anglais: "decision region",
    texte:
      "Pour $k\\in[\\![1,K]\\!]$, l'ensemble $R_{k}$ des entrées dont le score $z_{k}$ est au moins aussi grand que les neuf autres. Les inégalités y sont larges, si bien que deux régions se touchent sur les ex æquo écartés page 6 ; hors de ces frontières, $R_{k}$ est exactement l'ensemble des entrées classées $k-1$. Comme le dénominateur de $(6.3)$ est le même pour les dix coordonnées et que l'exponentielle est croissante, $\\arg\\max_{k}a_{k}=\\arg\\max_{k}z_{k}$ : les régions se lisent aussi bien sur $\\mathbf{a}$ que sur $\\mathbf{z}$, et il est plus simple de les lire sur $\\mathbf{z}$.",
  },
  {
    id: "b-r7-9",
    type: "derivation",
    ancre: "proposition-2",
    titre:
      "Les régions de décision de la famille $\\mathbf{x}\\mapsto W\\mathbf{x}+\\mathbf{b}$ sont convexes (proposition 2)",
    hypotheses: [
      "Le modèle est $\\mathbf{z}(\\mathbf{x})=W\\mathbf{x}+\\mathbf{b}$, avec $\\mathbf{w}_{k}^{\\mathsf{T}}$ la ligne $k$ de $W$.",
      "$R_{k}=\\{\\mathbf{x}\\in\\mathbb{R}^{784}\\ :\\ z_{k}(\\mathbf{x})\\geq z_{j}(\\mathbf{x})\\ \\ \\forall j\\in[\\![1,K]\\!]\\}$.",
    ],
    proprietes: [
      "Pour $\\boldsymbol{\\alpha}\\in\\mathbb{R}^{784}$ et $\\beta\\in\\mathbb{R}$, le **demi-espace fermé** $\\{\\mathbf{x}:\\boldsymbol{\\alpha}^{\\mathsf{T}}\\mathbf{x}+\\beta\\geq 0\\}$, c'est-à-dire l'un des deux côtés d'un plan, est convexe",
      "Une intersection quelconque de parties convexes est convexe",
    ],
    etapes: [
      {
        texte:
          "On écrit la différence de deux scores. Chaque $z_{k}$ est une **forme affine** de $\\mathbf{x}$, c'est-à-dire un produit scalaire suivi de l'ajout d'une constante, et une différence de deux formes affines en est une aussi :",
      },
      {
        latex:
          "z_{k}(\\mathbf{x})-z_{j}(\\mathbf{x})=(\\mathbf{w}_{k}-\\mathbf{w}_{j})^{\\mathsf{T}}\\mathbf{x}+(b_{k}-b_{j})",
        alt: "La différence entre le score k et le score j en x vaut le produit scalaire de w k moins w j par x, plus b k moins b j.",
        justification:
          "Linéarité : $\\mathbf{w}_{k}^{\\mathsf{T}}\\mathbf{x}-\\mathbf{w}_{j}^{\\mathsf{T}}\\mathbf{x}=(\\mathbf{w}_{k}-\\mathbf{w}_{j})^{\\mathsf{T}}\\mathbf{x}$.",
      },
      {
        latex:
          "R_{k}=\\bigcap_{j\\neq k}\\ \\big\\{\\mathbf{x}\\in\\mathbb{R}^{784}\\ :\\ (\\mathbf{w}_{k}-\\mathbf{w}_{j})^{\\mathsf{T}}\\mathbf{x}+(b_{k}-b_{j})\\geq 0\\big\\}",
        alt: "R indice k est l'intersection, pour j différent de k, des ensembles des x tels que le produit scalaire de w k moins w j par x, plus b k moins b j, soit positif ou nul.",
        justification:
          "La condition $z_{k}\\geq z_{j}$ pour tout $j$ se réécrit comme la conjonction de $K-1$ inégalités affines.",
      },
      {
        texte:
          "Chacun de ces $K-1$ ensembles est un demi-espace fermé, donc convexe. $R_{k}$ en est l'intersection, donc $R_{k}$ est convexe. C'est même un **polyèdre convexe** : une intersection finie de demi-espaces.",
        justification:
          "Vérification directe de la convexité d'un demi-espace : si $\\boldsymbol{\\alpha}^{\\mathsf{T}}u+\\beta\\geq 0$ et $\\boldsymbol{\\alpha}^{\\mathsf{T}}v+\\beta\\geq 0$, alors pour $t\\in[0,1]$, $\\boldsymbol{\\alpha}^{\\mathsf{T}}\\big((1-t)u+tv\\big)+\\beta=(1-t)(\\boldsymbol{\\alpha}^{\\mathsf{T}}u+\\beta)+t(\\boldsymbol{\\alpha}^{\\mathsf{T}}v+\\beta)\\geq 0$ comme somme de deux termes positifs.",
      },
    ],
    resultat: {
      latex:
        "\\forall k\\in[\\![1,K]\\!],\\ \\ R_{k}\\ \\text{est un polyèdre convexe de }\\mathbb{R}^{784}",
      alt: "Pour tout k entre un et K, la région de décision R indice k est un polyèdre convexe de l'espace à sept cent quatre-vingt-quatre dimensions.",
    },
    interpretation:
      "La propriété ne dépend ni de $W$, ni de $\\mathbf{b}$, ni de la façon dont ils ont été choisis. Elle est vraie pour **tous** les modèles de la famille, y compris le meilleur d'entre eux. Ce n'est donc pas une observation sur le modèle mesuré : c'est une contrainte sur ce que cette famille peut faire.",
    limites: [
      "La proposition ne dit pas que la famille est mauvaise, ni combien d'erreurs elle fera : elle dit une forme.",
      "Elle cesse d'être vraie dès qu'une fonction non affine s'insère entre deux étapes de calcul. La page 9 le démontre, et la mesure ci-dessous le vérifie.",
    ],
  },
  {
    id: "b-r7-10",
    type: "texte",
    ancre: "corollaire",
    texte:
      "**Corollaire.** Soient $\\mathbf{u}$ et $\\mathbf{v}$ deux images que le modèle classe toutes deux dans la classe $k-1$, c'est-à-dire $\\mathbf{u},\\mathbf{v}\\in R_{k}$. Leur milieu $\\tfrac{1}{2}(\\mathbf{u}+\\mathbf{v})$ appartient alors à $R_{k}$ et se trouve donc classé dans la même classe, puisque c'est le cas $t=1/2$ de la définition de la convexité.\n\nLe compte de $4\\,250$ paires devait par conséquent valoir zéro, et une seule exception aurait invalidé la proposition 2 : aucun modèle de cette famille, quel que soit son entraînement, ne peut classer deux images en $k-1$ et leur milieu ailleurs.",
  },
  {
    id: "b-r7-11",
    type: "titre",
    niveau: 3,
    texte: "Le même essai, avec le réseau à ReLU",
  },
  {
    id: "b-r7-12",
    type: "sortie",
    ancre: "mesure-convexite-relu",
    titre:
      "Le même protocole, et la même paire · cours/lecon2/mesures.py, section 5",
    texte:
      "  -- MODELE 3, avec ReLU ---------------------------------------------------\n      paires dont les DEUX extremites sont dans R_c   4816 sur 5000\n      parmi elles, milieu classe AILLEURS              69   (1.43 %)\n      sur TOUTES les paires, milieu classe ailleurs    89   (1.78 %)\n\n                            image 115   image 668   milieu\n      MODELE 1, lineaire           4          4         4\n      MODELE 3, avec ReLU          4          4         9",
    lecture: [
      "Le modèle 3 est celui que la page 9 construira, en glissant entre les deux couches une fonction qui n'est pas affine ; il est mesuré ici pour montrer que le compte précédent n'était pas nul par accident.",
      "**$69$ sur $4\\,816$**, là où le modèle linéaire donnait $0$ sur $4\\,250$. Les deux comptes sortent du même protocole, sur les mêmes paires : ce qui les sépare est la famille de fonctions, pas le tirage.",
      "La dernière ligne des deux tableaux compte autre chose et va dans l'autre sens, $89$ contre $121$, simplement parce que le modèle 3 classe mieux : il laisse moins de paires avec une extrémité fautive. Seules les deuxièmes lignes se comparent.",
      "Sur la paire de cette page, le réseau à ReLU lit un $9$ entre les deux $4$. Aucun modèle linéaire ne donne ce triplet de réponses, quel que soit son entraînement, et le corollaire dit pourquoi.",
      "**Ses régions ne sont donc pas convexes.** La proposition 4, page 9, dira d'où vient cette liberté ; elle est mesurée ici, elle n'est pas encore expliquée.",
    ],
  },
  {
    id: "b-r7-14",
    type: "encart",
    ton: "attention",
    titre: "Une limite de famille, pas d'entraînement",
    texte:
      "Rien de ce qui précède ne parle de la façon dont $W$ a été choisi. Entraîner plus longtemps, changer le pas, changer l'initialisation, prendre dix fois plus d'images : les régions resteront convexes, et le corollaire restera vrai. Passer ce plafond demande de changer la **famille** de fonctions, ce à quoi les pages 8 à 10 s'emploient, et la première tentative échouera.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.2 · Ce que cela veut dire sur une image
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r7-15",
    type: "titre",
    niveau: 2,
    texte: "Un seul gabarit par classe",
  },
  {
    id: "b-r7-16",
    type: "texte",
    texte:
      "La même limite se lit sans géométrie, directement sur $(4.2)$. Le score de la classe $k-1$ vaut $\\mathbf{w}_{k}^{\\mathsf{T}}\\mathbf{x}+b_{k}$, c'est-à-dire une mesure de ressemblance entre l'image et **un** motif fixé, le gabarit $G_{k}=\\mathrm{vec}^{-1}(\\mathbf{w}_{k})$ de la ligne $k$. La classe entière est donc résumée par une seule image de référence.",
  },
  {
    id: "b-r7-16b",
    type: "titre",
    niveau: 3,
    texte: "Un chiffre ne se résume pas à un motif",
  },
  {
    id: "b-r7-17",
    type: "texte",
    texte:
      "Un $4$ fermé, dont les deux traits obliques se rejoignent, et un $4$ ouvert, dont ils ne se rejoignent pas, sont tous deux des $4$ sans porter d'encre aux mêmes endroits, et il en va de même d'un $7$ barré et d'un $7$ qui ne l'est pas.\n\nIl faudrait donc un gabarit unique qui marque bien sur les deux variantes, et un gabarit unique dépense ses valeurs extrêmes là où il sépare le mieux sa classe des neuf autres : celui du $4$ mesuré page 4 place son minimum en $(4,14)$, tout en haut de la grille, et n'a plus rien à dire sur la fermeture de la boucle, qui est pourtant ce qui distingue les deux variantes.",
  },
  {
    id: "b-r7-19",
    type: "verification",
    numero: 14,
    enonce:
      "Sur un modèle, les images de test n°9025 et n°3231, toutes deux de classe $1$, sont toutes deux prédites $1$. Leur milieu est prédit $8$.",
    questions: [
      "Que peut-on conclure sur ce modèle, et par quel énoncé exactement ?",
      "Cette observation dit-elle quelque chose sur la **qualité** du modèle ?",
      "Si les deux extrémités avaient été prédites $1$ et $7$, la même conclusion tiendrait-elle ?",
    ],
  },
  {
    id: "b-r7-20",
    type: "texte",
    texte:
      "Reste une question que cette page ne tranche pas. Si une famille plus riche fait mieux, **que trouve-t-elle** que celle-ci ne trouvait pas ? La page 11 y répond, avec une mesure et non avec une intuition.",
  },
];
