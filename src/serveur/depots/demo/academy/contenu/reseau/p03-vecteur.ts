import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 3 · De la grille au vecteur
//
// La page pose vec, l'identification des deux espaces, le tenseur d'un lot, et
// démontre la PROPOSITION 1 : l'aplatissement ne perd rien, mais la famille de
// modèles ne voit pas l'ordre des coordonnées.
//
// Les valeurs citées (x_231, x_259, les octets 222 et 67) sortent de
// cours/lecon2/mesures.py, section 2.
// ─────────────────────────────────────────────────────────────────────────────

export const P03_VECTEUR: Bloc[] = [
  {
    id: "b-r3-1",
    type: "texte",
    texte:
      "Une image est un carré de pixels, quand le modèle qu'on va écrire attend une simple liste de nombres alignés, et il faut donc mettre l'image à plat avant de la lui donner. On peut le faire sans rien perdre, ce qui règle la question la plus évidente et en laisse une autre, beaucoup moins évidente. Qu'est-ce que le modèle cesse de voir, une fois l'image mise à plat ?",
  },
  {
    id: "b-r3-8f",
    type: "image",
    ancre: "grille-vers-colonne",
    src: "/cours/lecon2/l2-fig03-colonne.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "À gauche, l'image de test numéro zéro, un sept, dessinée en cases pleines dans une grille de vingt-huit sur vingt-huit, cotée X appartenant à l'ensemble des tableaux vingt-huit sur vingt-huit à coefficients entre zéro et un. Une flèche horizontale part de la grille vers la droite ; elle porte le mot vec au-dessus et la formule k égale vingt-huit fois i moins un, plus j, au-dessous. À droite, une colonne de ronds : x un, x deux et x trois, blancs et nuls ; trois points de suspension ; x deux cent trente et un, gris foncé, de valeur zéro virgule huit sept zéro cinq huit huit, et x deux cent trente-deux, presque noir, de valeur zéro virgule neuf neuf six zéro sept huit, tous deux cerclés de brique ; trois points encore ; enfin x sept cent quatre-vingt-trois et x sept cent quatre-vingt-quatre, blancs et nuls. Une accolade embrasse la colonne entière et porte la cote sept cent quatre-vingt-quatre. Sous elle, x appartient à l'ensemble des vecteurs à sept cent quatre-vingt-quatre coordonnées comprises entre zéro et un.",
    legende:
      "Le rang $k$ ne se lit pas sur l'image. Il se calcule.",
  },
  {
    id: "b-r3-8f-lecture",
    type: "texte",
    texte:
      "À gauche, la grille est l'image de test n°0, la même qu'à la page 2, et la flèche du milieu porte le nom de l'opération, $\\mathrm{vec}$, avec au-dessous la règle qui donne le rang, $k=28(i-1)+j$.\n\nLa colonne de droite a 784 cases, ce que rappelle l'accolade, et la figure n'en dessine que quelques-unes, parce que 784 ronds empilés ne tiendraient pas sur la page.\n\nLes deux ronds cerclés de brique sont $x_{231}$ et $x_{232}$, qui viennent des pixels de la ligne 9, colonnes 7 et 8. La règle se vérifie en prenant $i=9$ et $j=7$, ce qui donne $28\\times(9-1)+7=231$, puis $232$ pour le pixel voisin de la colonne 8. Deux pixels voisins sur une même ligne ont donc des rangs qui se suivent, et c'est le seul voisinage que la colonne conserve.\n\nLes ronds du haut et du bas, enfin, sont blancs : $x_{1}$, $x_{2}$ et $x_{3}$ valent 0, comme $x_{783}$ et $x_{784}$, puisque ce sont les pixels vides du pourtour de l'image.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.1 · La normalisation
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r3-2",
    type: "titre",
    niveau: 2,
    texte: "Des octets aux réels",
  },
  {
    id: "b-r3-3",
    type: "texte",
    texte:
      "L'octet d'un pixel est un entier de $[\\![0,255]\\!]$, où $0$ est le blanc du papier et $255$ le noir plein de l'encre, et voici la division annoncée page 2, écrite une fois pour toutes.",
  },
  {
    id: "b-r3-4",
    type: "formule",
    ancre: "normalisation",
    latex:
      "X_{\\text{brut}}\\in\\mathcal{M}_{28,28}\\big([\\![0,255]\\!]\\big),\\qquad X=\\frac{1}{255}\\,X_{\\text{brut}}\\in[0,1]^{28\\times 28}",
    alt: "X brut est une matrice à vingt-huit lignes et vingt-huit colonnes dont les coefficients sont des entiers de zéro à deux cent cinquante-cinq. X est le quotient de X brut par deux cent cinquante-cinq, et ses coefficients sont des réels de l'intervalle de zéro à un.",
    legende:
      "La division est faite coefficient par coefficient, et le diviseur est $255$ parce que c'est la valeur du noir plein, celle qui doit tomber sur $1$.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.2 · vec
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r3-5",
    type: "titre",
    niveau: 2,
    texte: "L'aplatissement",
  },
  {
    id: "b-r3-6",
    type: "definition",
    terme: "Aplatissement",
    anglais: "flattening",
    texte:
      "L'application $\\mathrm{vec}:\\mathcal{M}_{28,28}(\\mathbb{R})\\rightarrow\\mathbb{R}^{784}$ qui range les coefficients d'une matrice bout à bout, ligne après ligne. Sa réciproque $\\mathrm{vec}^{-1}:\\mathbb{R}^{784}\\rightarrow\\mathcal{M}_{28,28}(\\mathbb{R})$ replie un vecteur en grille.",
  },
  {
    id: "b-r3-7",
    type: "formule",
    ancre: "vec",
    latex:
      "\\mathbf{x}=\\mathrm{vec}(X)\\in[0,1]^{784},\\qquad x_{k}=X_{ij}\\ \\text{ avec }\\ k=28\\,(i-1)+j,\\quad (i,j)\\in[\\![1,28]\\!]^{2}",
    alt: "Le vecteur x est l'aplatissement de la matrice X, et vit dans l'ensemble des vecteurs à sept cent quatre-vingt-quatre coordonnées comprises entre zéro et un. Sa coordonnée numéro k vaut le coefficient de X à la ligne i et à la colonne j, où k vaut vingt-huit fois la quantité i moins un, le tout plus j, pour i et j entiers entre un et vingt-huit.",
    numero: "3.1",
    legende:
      "$\\mathbf{x}$ est un vecteur **colonne**, de dimension $784\\times 1$. La formule est bijective : à chaque $k$ de $[\\![1,784]\\!]$ correspond exactement un couple $(i,j)$.",
  },
  {
    id: "b-r3-8",
    type: "tableau",
    ancre: "quatre-coins",
    titre: "La formule vérifiée aux quatre coins",
    cleEnTete: true,
    entetes: ["Pixel $(i,j)$", "$28\\,(i-1)+j$", "Rang $k$"],
    lignes: [
      ["$(1,1)$, coin haut gauche", "$28\\times 0+1$", "$1$"],
      ["$(1,28)$, coin haut droit", "$28\\times 0+28$", "$28$"],
      ["$(28,1)$, coin bas gauche", "$28\\times 27+1$", "$757$"],
      ["$(28,28)$, coin bas droit", "$28\\times 27+28$", "$784$"],
    ],
    legende:
      "Les quatre coins donnent bien les rangs extrêmes, et aucun rang n'est atteint deux fois.",
  },
  {
    id: "b-r3-9",
    type: "animation",
    ancre: "sept-devient-784-nombres",
    animationId: "le-7-devient-784-nombres",
    legende:
      "Les quatre pixels dont le tableau vient de donner les rangs partent s'y ranger. Ce que le modèle recevra n'est plus une grille : c'est cette colonne, et l'ordre y est tout ce qui reste de la géométrie.",
  },
  {
    id: "b-r3-10",
    type: "texte",
    texte:
      "$\\mathrm{vec}$ est **linéaire**, puisqu'elle se contente de ranger les nombres sans en calculer aucun, et elle est **bijective**, puisque la correspondance $k\\leftrightarrow(i,j)$ l'est. Une application linéaire et bijective entre deux espaces vectoriels s'appelle un **isomorphisme**.\n\nC'est cet isomorphisme qui réalise l'identification notée $\\mathcal{M}_{28,28}(\\mathbb{R})\\cong\\mathbb{R}^{784}$, où le signe $\\cong$ se lit « s'identifie à », et dont le chapitre se sert partout ensuite. On le nomme plutôt que de l'omettre parce qu'une matrice n'**est** pas un vecteur : ce sont deux objets distincts, et $\\mathrm{vec}$ est l'application qui va de l'un à l'autre.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.3 · Ce que l'aplatissement coûte
  //
  // Le lot d'images et le tableau des ordres sont partis page 10 : la question
  // « et si on en traitait plusieurs à la fois » ne se pose pas encore ici.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r3-14",
    type: "titre",
    niveau: 2,
    texte: "Ce que l'aplatissement coûte",
  },
  {
    id: "b-r3-15",
    type: "definition",
    terme: "Matrice de permutation",
    anglais: "permutation matrix",
    texte:
      "Une matrice $P\\in\\mathcal{M}_{n}(\\mathbb{R})$, c'est-à-dire carrée à $n$ lignes et $n$ colonnes, dont chaque ligne et chaque colonne comporte exactement un coefficient égal à $1$, tous les autres étant nuls, et $P\\mathbf{x}$ est le vecteur $\\mathbf{x}$ dont les coordonnées ont été permutées.\n\nElle vérifie $P^{\\mathsf{T}}P=I_{n}$, et cela se voit sur les coefficients. Le coefficient $(i,j)$ de $P^{\\mathsf{T}}P$ s'obtient en multipliant terme à terme les colonnes $i$ et $j$ de $P$ puis en sommant, et chaque colonne ne porte qu'un seul $1$ : la somme vaut $1$ quand les deux colonnes portent leur $1$ sur la même ligne, ce qui n'arrive que pour $i=j$, et $0$ partout ailleurs.",
  },
  {
    id: "b-r3-15b",
    type: "texte",
    texte:
      "Un aplatissement ne coûte rien par lui-même : il ne coûte que dès lors qu'un modèle lit son résultat, et il faut donc en poser un. On prend la boîte à une seule étape annoncée page 1, celle qui range un tableau $W$ de dix lignes et $784$ colonnes avec dix nombres $\\mathbf{b}$, et qui répond $W\\mathbf{x}+\\mathbf{b}$, soit dix nombres, un par chiffre possible.\n\nSes nombres à elle sont le couple $\\boldsymbol{\\theta}=(W,\\mathbf{b})$, et ils sont bien moins nombreux que les 101 770 de la page 1, qui comptait la boîte à deux étapes. La page 6 construit celle-ci pièce par pièce et dit ce que chacun de ses nombres fait ; ce qui suit n'a besoin que de sa forme.",
  },
  {
    id: "b-r3-16",
    type: "derivation",
    ancre: "proposition-1",
    titre:
      "L'aplatissement ne perd aucune information, et le modèle ne voit pas l'ordre des coordonnées (proposition 1)",
    hypotheses: [
      "$\\mathrm{vec}:\\mathcal{M}_{28,28}(\\mathbb{R})\\rightarrow\\mathbb{R}^{784}$ est l'application définie en $(3.1)$.",
      "$P\\in\\mathcal{M}_{784}(\\mathbb{R})$ est une matrice de permutation **fixe**, la même pour toutes les images.",
      "Le modèle est $\\mathbf{x}\\mapsto W\\mathbf{x}+\\mathbf{b}$ avec $W\\in\\mathcal{M}_{10,784}(\\mathbb{R})$ et $\\mathbf{b}\\in\\mathbb{R}^{10}$.",
    ],
    chaine: "X \\rightarrow \\mathbf{x} \\rightarrow P\\mathbf{x} \\rightarrow W'(P\\mathbf{x})+\\mathbf{b}'",
    proprietes: [
      "Linéarité et bijectivité de $\\mathrm{vec}$",
      "$P^{\\mathsf{T}}P=I_{784}$ pour toute matrice de permutation",
      "Associativité du produit matriciel",
    ],
    etapes: [
      {
        texte:
          "**Premier point : rien n'est perdu.** $\\mathrm{vec}$ est linéaire et bijective, donc c'est un isomorphisme d'espaces vectoriels. Sa réciproque $\\mathrm{vec}^{-1}$ reconstruit $X$ à partir de $\\mathbf{x}$ exactement.",
        justification:
          "Un isomorphisme est inversible : aucune information ne peut disparaître.",
      },
      {
        texte:
          "**Second point : l'ordre des coordonnées n'est pas visible.** On pose $W'=WP^{\\mathsf{T}}$ et $\\mathbf{b}'=\\mathbf{b}$, et on calcule ce que le modèle de paramètre $\\boldsymbol{\\theta}'=(W',\\mathbf{b}')$ répond à l'entrée permutée $P\\mathbf{x}$.",
      },
      {
        latex:
          "W'(P\\mathbf{x})+\\mathbf{b}'=(WP^{\\mathsf{T}})(P\\mathbf{x})+\\mathbf{b}=W(P^{\\mathsf{T}}P)\\mathbf{x}+\\mathbf{b}",
        alt: "W prime fois P x, plus b prime, égale W P transposée fois P x, plus b, égale W multiplié par le produit de P transposée et de P, fois x, plus b.",
        justification: "Substitution de $W'$ et $\\mathbf{b}'$, puis associativité.",
      },
      {
        latex: "=W\\,I_{784}\\,\\mathbf{x}+\\mathbf{b}=W\\mathbf{x}+\\mathbf{b}",
        alt: "Égale W fois la matrice identité d'ordre sept cent quatre-vingt-quatre fois x, plus b, c'est-à-dire W x plus b.",
        justification: "$P^{\\mathsf{T}}P=I_{784}$.",
      },
      {
        texte:
          "Les dimensions se vérifient : $W\\in\\mathcal{M}_{10,784}$ et $P^{\\mathsf{T}}\\in\\mathcal{M}_{784,784}$ donnent $W'\\in\\mathcal{M}_{10,784}$, donc $W'$ est bien un paramètre admissible de la même famille.",
      },
    ],
    resultat: {
      latex:
        "\\forall\\,\\mathbf{x}\\in\\mathbb{R}^{784},\\quad (WP^{\\mathsf{T}})(P\\mathbf{x})+\\mathbf{b}=W\\mathbf{x}+\\mathbf{b}",
      alt: "Pour tout vecteur x de l'espace à sept cent quatre-vingt-quatre dimensions, le produit de W par P transposée, appliqué à P x, plus b, égale W x plus b.",
    },
    interpretation:
      "Une permutation **fixe** des 784 pixels, la même pour toutes les images, ne change rien à ce que cette famille peut apprendre : pour tout modèle qui marche sur les images d'origine, il existe un modèle de la même famille qui rend exactement les mêmes sorties sur les images permutées, donc qui obtient le même score, quelle que soit la façon dont on mesure ce score.\n\nOr un modèle qui *verrait* le voisinage serait dérangé par une permutation, puisqu'elle sépare des pixels qui se touchaient. Celui-ci ne l'est pas du tout, et le voisinage lui est donc invisible : il ne sait pas que deux pixels côte à côte le sont. C'est cela, et rien d'autre, que « l'aplatissement détruit la géométrie » veut dire.",
    limites: [
      "L'argument vaut pour une permutation **fixe**. Une permutation tirée au hasard **pour chaque image** détruirait bel et bien de l'information, et la proposition ne dit rien de ce cas.",
      "Il ne se limite pas non plus au modèle ci-dessus : il vaut aussi pour le réseau complet de la page 10, où seule la première matrice change et où toutes les étapes suivantes restent intactes.",
      "Il ne dit pas que l'aplatissement est une erreur : il dit ce qu'il rend invisible.",
    ],
  },
  {
    id: "b-r3-18",
    type: "encart",
    ton: "note",
    titre: "Ce que ce constat prépare",
    texte:
      "Rendre la grille de nouveau visible demande de **partager** un même nombre entre des pixels voisins, au lieu d'en attacher un à chaque pixel séparément. C'est ce que fait une convolution, et elle a son chapitre. Ici, on note simplement ce que cette famille de modèles ne voit pas.",
  },
  {
    id: "b-r3-19",
    type: "texte",
    texte:
      "Sur l'image de test numéro $0$, un $7$, les pixels $(9,7)$ et $(10,7)$ sont l'un au-dessus de l'autre dans la grille, et leurs rangs valent $k=28\\times 8+7=231$ et $k=28\\times 9+7=259$, soit **28 rangs d'écart** dans le vecteur. Ils portent tous deux de l'encre, les octets $222$ et $67$, et rien dans $\\mathbf{x}$ ne signale qu'ils sont voisins.\n\nDeux pixels voisins sur une même ligne, eux, gardent des rangs consécutifs, mais cela ne rattrape rien : le modèle ne lit pas davantage la proximité des rangs que celle des cases.",
  },
  {
    id: "b-r3-20",
    type: "verification",
    numero: 9,
    enonce:
      "L'aplatissement se manipule à la main avant d'être utilisé cent fois.",
    questions: [
      "Donner le rang $k$ de la coordonnée $x_k$ correspondant au pixel $(i,j)=(17,4)$.",
      "Donner le rang du pixel immédiatement **au-dessus** de celui-là dans la grille, puis l'écart entre les deux rangs.",
      "Justifier cet écart directement par la formule $k=28\\,(i-1)+j$, sans énumérer.",
    ],
  },
];
