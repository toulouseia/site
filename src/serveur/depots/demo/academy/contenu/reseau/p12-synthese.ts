import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 12 · Synthèse, formulaire et erreurs fréquentes
//
// Le tableau des objets est EXHAUSTIF sur le chapitre : tout symbole employé
// une seule fois y figure avec son ensemble d'appartenance et sa dimension.
// C'est la page qu'on garde ouverte à côté du chapitre 3.
//
// Le récapitulatif des treize 🧪 donne pour chacune sa page et sa section : la
// numérotation est continue sur le parcours, et les numéros 1 à 7 sont au
// chapitre 1.
//
// Mention de source, comme à la page 1.
// ─────────────────────────────────────────────────────────────────────────────

export const P12_SYNTHESE: Bloc[] = [
  {
    id: "b-r12-0",
    type: "texte",
    texte:
      "Une image de vingt-huit sur vingt-huit entre d'un côté, un chiffre sort de l'autre, et tout ce qui a été construit tient entre les deux. Saurais-tu redire la chaîne complète sans regarder ? Entre l'image et le chiffre, cinq quantités se succèdent et six opérations les relient, et chacune de ces cinq quantités se mesure sur une image réelle.",
  },
  {
    id: "b-r12-0f",
    type: "image",
    ancre: "trajet-complet",
    src: "/cours/lecon2/l2-fig18-le-trajet-complet.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Une chaîne horizontale. À gauche, l'image de test numéro zéro, un sept manuscrit, dans une grille de vingt-huit sur vingt-huit cotée vingt-huit fois vingt-huit. Une flèche portant le mot vec mène à un premier rectangle nommé x, coté sept cent quatre-vingt-quatre par un. Suivent, chacun relié au précédent par une flèche qui porte l'opération : W exposant un point plus b exposant un vers le rectangle z exposant un, coté cent vingt-huit par un ; ReLU vers le rectangle a exposant un, même cote ; W exposant deux point plus b exposant deux vers le rectangle z exposant deux, coté dix par un ; softmax vers le rectangle a exposant deux, même cote. Une dernière flèche porte le mot argmax et mène à un grand chiffre sept en brique, légendé le chiffre lu. Sous chaque rectangle, une ligne grise donne la valeur mesurée à cette étape sur cette image : le nombre de pixels non nuls, la plus haute préactivation, le nombre d'activations non nulles sur cent vingt-huit, le plus haut score, la plus haute probabilité. Un filet en bas porte le nombre de paramètres du réseau et sa précision sur les dix mille images de test.",
    legende:
      "Chaque objet du formulaire, à l'endroit de la chaîne où il agit. Le trajet complet porte $101\\,770$ paramètres, et $0{,}9814$ de précision sur les $10\\,000$ images de test.",
  },
  {
    id: "b-r12-1",
    type: "titre",
    niveau: 2,
    texte: "Le trajet",
  },
  {
    id: "b-r12-2",
    type: "texte",
    texte:
      "Une image $28\\times 28$ devient un vecteur de $\\mathbb{R}^{784}$ par $\\mathrm{vec}$, sans rien perdre, mais la géométrie de la grille y devient invisible au modèle.\n\nUn neurone calcule ensuite $z=\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b$, où ses poids positifs disent où il cherche de l'encre et ses poids négatifs où il n'en veut pas, et $\\mathrm{vec}^{-1}(\\mathbf{w})$ en fait une image qu'on regarde. Dix neurones suivis d'un $\\mathrm{softmax}$ donnent une loi sur dix classes, et $7\\,850$ paramètres suffisent à atteindre $91{,}93\\,\\%$.",
  },
  {
    id: "b-r12-2a",
    type: "titre",
    niveau: 3,
    texte: "Pourquoi ce premier modèle plafonne",
  },
  {
    id: "b-r12-2aa",
    type: "texte",
    texte:
      "Ce chiffre ne bouge plus que de quelques dixièmes de point, et la forme de la famille dit pourquoi il ne peut pas monter beaucoup : ses régions de décision sont convexes, quelle que soit la façon dont on l'entraîne, ce qui lui interdit certaines séparations. La proposition 2 dit cette forme et non un nombre d'erreurs ; la mesure, elle, la rend visible : sur $4\\,250$ paires dont les deux extrémités reçoivent la même classe, le milieu est classé ailleurs $0$ fois.",
  },
  {
    id: "b-r12-2b",
    type: "titre",
    niveau: 3,
    texte: "Ce que la non-linéarité change",
  },
  {
    id: "b-r12-2c",
    type: "texte",
    texte:
      "Ajouter une couche sans rien entre les deux ne change rien : la famille obtenue est **la même**, ce que la double inclusion démontre, et les $101\\,770$ paramètres n'achètent que $0{,}63$ point.\n\nInsérer $\\mathrm{ReLU}$, qui ne coûte aucun paramètre, rend le réseau affine par morceaux sur au plus $2^{128}$ régions. Le même compte de milieux mal classés, nul sur les $4\\,250$ paires du modèle sans activation, vaut $69$ sur les $4\\,816$ du réseau à ReLU, et les erreurs tombent de $744$ à $186$.\n\nLe réseau complet est la fonction $f_{\\boldsymbol{\\theta}}:\\mathbb{R}^{784}\\rightarrow\\Delta^{\\circ}_{9}$, et regarder ce que sa couche cachée a appris montre que ce n'est pas ce qu'on espérait.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.1 · Formulaire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-3",
    type: "titre",
    niveau: 2,
    texte: "Formulaire",
  },
  {
    id: "b-r12-4",
    type: "tableau",
    ancre: "formulaire",
    cleEnTete: true,
    entetes: ["Objet", "Formule", "Page"],
    lignes: [
      ["Normalisation", "$X=X_{\\text{brut}}/255\\in[0,1]^{28\\times 28}$", "3"],
      ["Aplatissement", "$x_{k}=X_{ij}$, $k=28(i-1)+j$", "3"],
      ["Un neurone", "$z=\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}+b=\\sum_{k}w_{k}x_{k}+b$", "4"],
      ["Décomposition par signe", "$z=\\sum_{w_{k}>0}w_{k}x_{k}+\\sum_{w_{k}<0}w_{k}x_{k}+b$", "4"],
      ["Gabarit", "$G=\\mathrm{vec}^{-1}(\\mathbf{w})\\in\\mathcal{M}_{28,28}(\\mathbb{R})$", "4"],
      ["Une couche", "$\\mathbf{z}=W\\mathbf{x}+\\mathbf{b}$", "6"],
      ["Simplexe ouvert", "$\\Delta^{\\circ}_{K-1}=\\{\\mathbf{a}\\in\\mathbb{R}^{K}:a_{k}>0,\\ \\sum_{k}a_{k}=1\\}$", "6"],
      ["Softmax", "$(\\mathrm{softmax}\\,\\mathbf{z})_{k}=e^{z_{k}}/\\sum_{j}e^{z_{j}}$", "6"],
      ["Invariance par translation", "$\\mathrm{softmax}(\\mathbf{z}+t\\mathbf{1}_{K})=\\mathrm{softmax}(\\mathbf{z})$", "6"],
      ["Cas binaire", "$(\\mathrm{softmax}(z_{1},z_{2}))_{1}=\\sigma(z_{1}-z_{2})$", "6"],
      ["One-hot", "$\\mathrm{onehot}(c)=\\mathbf{e}_{c+1}$", "6"],
      ["Perte", "$\\ell(\\mathbf{a},c)=-\\ln a_{c+1}$", "6"],
      ["Prédiction", "$\\widehat{c}(\\mathbf{a})=\\big(\\arg\\max_{k}a_{k}\\big)-1$, hors ex æquo", "6"],
      ["Précision", "$\\frac{1}{N}\\sum_{n}\\mathbb{1}\\{\\widehat{c}(\\mathbf{a}^{(n)})=c^{(n)}\\}$", "6"],
      ["Région de décision", "$R_{k}=\\bigcap_{j\\neq k}\\{(\\mathbf{w}_{k}-\\mathbf{w}_{j})^{\\mathsf{T}}\\mathbf{x}+b_{k}-b_{j}\\geq 0\\}$", "7"],
      ["ReLU", "$\\mathrm{ReLU}(u)=\\max(u,0)$, $\\mathrm{ReLU}'(u)=\\mathbb{1}\\{u>0\\}$ pour $u\\neq 0$, et $0$ par convention en $u=0$", "9"],
      ["Sigmoïde", "$\\sigma(u)=1/(1+e^{-u})$, $\\sigma'=\\sigma(1-\\sigma)\\leq 1/4$", "9"],
      ["Biais et seuil", "$b=-s$", "9"],
      ["Propagation avant", "$\\mathbf{z}^{[l]}=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}$ ; $\\mathbf{a}^{[l]}=\\mathrm{ReLU}(\\mathbf{z}^{[l]})$ pour $l<L$, et $\\mathbf{a}^{[L]}=\\mathrm{softmax}(\\mathbf{z}^{[L]})$", "10"],
      ["Compte des paramètres", "$p=\\sum_{l=1}^{L}(d_{l}d_{l-1}+d_{l})$", "10"],
      ["Corrélation", "$\\rho(\\mathbf{u},\\mathbf{v})=\\langle\\mathbf{u}-\\bar{u}\\mathbf{1}_{m},\\mathbf{v}-\\bar{v}\\mathbf{1}_{m}\\rangle/(\\|\\mathbf{u}-\\bar{u}\\mathbf{1}_{m}\\|\\,\\|\\mathbf{v}-\\bar{v}\\mathbf{1}_{m}\\|)$", "11"],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.2 · Le tableau des objets
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-5",
    type: "titre",
    niveau: 2,
    texte: "Tous les objets du chapitre",
  },
  {
    id: "b-r12-6",
    type: "tableau",
    ancre: "objets-notations",
    titre: "Notations d'ensembles et symboles généraux",
    cleEnTete: true,
    entetes: ["Symbole", "Signification", "Ensemble ou type", "Dimension"],
    lignes: [
      ["$\\mathbb{R}$, $\\mathbb{R}_{\\geq 0}$, $\\mathbb{R}_{>0}$", "Réels, réels positifs ou nuls, réels strictement positifs", "Ensembles", "·"],
      ["$\\mathbb{N}$, $\\mathbb{N}^{*}$", "Entiers naturels, entiers naturels non nuls", "Ensembles", "·"],
      ["$[\\![a,b]\\!]$", "Intervalle d'entiers $\\{a,a+1,\\ldots,b\\}$", "Ensemble fini", "$b-a+1$ éléments"],
      ["$\\mathcal{M}_{m,n}(\\mathbb{R})$", "Matrices réelles à $m$ lignes et $n$ colonnes", "Espace vectoriel", "$mn$"],
      ["$\\mathcal{M}_{n}(\\mathbb{R})$", "Matrices carrées, $=\\mathcal{M}_{n,n}(\\mathbb{R})$", "Espace vectoriel", "$n^{2}$"],
      ["$I_{n}$", "Matrice identité", "$\\mathcal{M}_{n}(\\mathbb{R})$", "$n\\times n$"],
      ["$\\Delta^{\\circ}_{K-1}$", "Simplexe ouvert, lois de probabilité sur $K$ classes", "$\\subset\\mathbb{R}^{K}$", "$K$ coordonnées, $K-1$ degrés de liberté"],
      ["$\\mathbb{1}\\{\\cdot\\}$", "Indicatrice d'une condition", "$\\rightarrow\\{0,1\\}$", "Scalaire"],
      ["$\\mathbf{1}_{m}$", "Vecteur de uns", "$\\mathbb{R}^{m}$", "$m\\times 1$"],
      ["$\\mathbf{e}_{k}$", "$k$-ième vecteur de la base canonique", "$\\mathbb{R}^{m}$", "$m\\times 1$"],
      ["$\\langle\\mathbf{u},\\mathbf{v}\\rangle$", "Produit scalaire canonique $\\sum_{i}u_{i}v_{i}$", "$\\mathbb{R}^{m}\\times\\mathbb{R}^{m}\\rightarrow\\mathbb{R}$", "Scalaire"],
      ["$\\|\\mathbf{u}\\|$", "Norme euclidienne $\\sqrt{\\langle\\mathbf{u},\\mathbf{u}\\rangle}$", "$\\mathbb{R}^{m}\\rightarrow\\mathbb{R}_{\\geq 0}$", "Scalaire"],
      ["$P$", "Matrice de permutation, $P^{\\mathsf{T}}P=I_{n}$", "$\\mathcal{M}_{n}(\\mathbb{R})$", "$n\\times n$"],
      ["$C$", "Partie convexe de $\\mathbb{R}^{d}$", "$\\subseteq\\mathbb{R}^{d}$", "·"],
    ],
  },
  {
    id: "b-r12-7",
    type: "tableau",
    ancre: "objets-fonctions",
    titre: "Fonctions, avec départ et arrivée",
    cleEnTete: true,
    entetes: ["Fonction", "Départ", "Arrivée", "Page"],
    lignes: [
      ["$\\mathrm{vec}$", "$\\mathcal{M}_{28,28}(\\mathbb{R})$", "$\\mathbb{R}^{784}$", "3"],
      ["$\\mathrm{vec}^{-1}$", "$\\mathbb{R}^{784}$", "$\\mathcal{M}_{28,28}(\\mathbb{R})$", "3"],
      ["$\\mathrm{onehot}$", "$[\\![0,K-1]\\!]$", "$\\{0,1\\}^{K}$", "6"],
      ["$\\mathrm{softmax}$", "$\\mathbb{R}^{K}$", "$\\Delta^{\\circ}_{K-1}$", "6"],
      ["$\\ell$", "$\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]$", "$\\mathbb{R}_{\\geq 0}$", "6"],
      ["$\\widehat{c}$", "$\\Delta^{\\circ}_{K-1}\\setminus E$, où $E$ est l'ensemble des $\\mathbf{a}$ dont le maximum est atteint par au moins deux coordonnées", "$[\\![0,K-1]\\!]$", "6"],
      ["$\\mathrm{ReLU}$", "$\\mathbb{R}$", "$\\mathbb{R}_{\\geq 0}$", "9"],
      ["$\\sigma$", "$\\mathbb{R}$", "$(0,1)$", "9"],
      ["$\\varphi$ appliquée composante par composante, où $\\varphi$ est une activation quelconque", "$\\mathbb{R}^{m}$", "$\\mathbb{R}^{m}$", "9"],
      ["$f_{\\boldsymbol{\\theta}}$", "$\\mathbb{R}^{784}$", "$\\Delta^{\\circ}_{9}$", "10"],
      ["$\\rho$", "$(\\mathbb{R}^{m}\\setminus\\mathbb{R}\\mathbf{1}_{m})^{2}$", "$[-1,1]$", "11"],
    ],
  },
  {
    id: "b-r12-8",
    type: "tableau",
    ancre: "objets-donnees",
    titre: "Données, paramètres et quantités calculées",
    cleEnTete: true,
    entetes: ["Symbole", "Signification", "Ensemble", "Dimension", "Nature"],
    lignes: [
      ["$\\mathcal{X}$", "Espace des entrées", "$[0,1]^{28\\times 28}$", "·", "Ensemble"],
      ["$\\mathcal{Y}$", "Espace des étiquettes", "$[\\![0,9]\\!]$", "·", "Ensemble fini"],
      ["$N_{\\text{train}}$, $N_{\\text{test}}$", "Tailles des jeux", "$\\mathbb{N}^{*}$", "$1\\times 1$", "Constantes : $60\\,000$, $10\\,000$"],
      ["$n$", "Indice d'exemple", "$[\\![1,N]\\!]$", "·", "Indice"],
      ["$X^{(n)}$", "Image du $n$-ième exemple", "$\\mathcal{X}$", "$28\\times 28$", "Donnée"],
      ["$c^{(n)}$", "Étiquette, un **code**", "$\\mathcal{Y}$", "$1\\times 1$", "Donnée"],
      ["$A^{[l-1]}$, $B$", "Un lot de $B$ exemples, empilés en lignes", "$\\mathcal{M}_{B,d_{l-1}}(\\mathbb{R})$, $\\mathbb{N}^{*}$", "$B\\times d_{l-1}$", "Donnée, page 10"],
      ["$\\mathbf{x}$", "Image aplatie", "$[0,1]^{784}$", "$784\\times 1$", "Donnée"],
      ["$x_{k}$", "Coordonnée $k$", "$[0,1]$", "$1\\times 1$", "Donnée"],
      ["$\\mathbf{y}$", "Étiquette encodée", "$\\{0,1\\}^{10}$", "$10\\times 1$", "Donnée dérivée"],
      ["$\\mathbf{w}$, $b$", "Poids et biais d'un neurone", "$\\mathbb{R}^{784}$, $\\mathbb{R}$", "$784\\times 1$, $1\\times 1$", "**Paramètres appris**"],
      ["$W$, $\\mathbf{b}$", "Poids et biais d'une couche", "$\\mathcal{M}_{10,784}(\\mathbb{R})$, $\\mathbb{R}^{10}$", "$10\\times 784$, $10\\times 1$", "**Paramètres appris**"],
      ["$W^{[l]}$, $\\mathbf{b}^{[l]}$", "Poids et biais de la couche $l$", "$\\mathcal{M}_{d_{l},d_{l-1}}(\\mathbb{R})$, $\\mathbb{R}^{d_{l}}$", "$d_{l}\\times d_{l-1}$, $d_{l}\\times 1$", "**Paramètres appris**"],
      ["$\\boldsymbol{\\theta}$", "Tous les paramètres", "$\\mathbb{R}^{p}$", "$p\\times 1$", "**Paramètres appris**"],
      ["$p$", "Nombre de paramètres", "$\\mathbb{N}^{*}$", "$1\\times 1$", "Calculé"],
      ["$z$, $\\mathbf{z}$, $\\mathbf{z}^{[l]}$", "Préactivations", "$\\mathbb{R}$, $\\mathbb{R}^{10}$, $\\mathbb{R}^{d_{l}}$", "·", "Calculées"],
      ["$\\mathbf{a}^{[l]}$, $l<L$", "Activation cachée", "$\\mathbb{R}_{\\geq 0}^{d_{l}}$, **non borné**", "$d_{l}\\times 1$", "Calculée"],
      ["$\\mathbf{a}^{[L]}$", "Sortie", "$\\Delta^{\\circ}_{d_{L}-1}$", "$d_{L}\\times 1$", "Calculée"],
      ["$G$, $G_{k}$", "Gabarit d'un neurone, d'une classe", "$\\mathcal{M}_{28,28}(\\mathbb{R})$", "$28\\times 28$", "Lecture d'un paramètre"],
      ["$L$", "Nombre de couches", "$\\mathbb{N}^{*}$, $L\\geq 2$", "$1\\times 1$", "Choisi"],
      ["$d_{l}$", "Largeur de la couche $l$", "$\\mathbb{N}^{*}$", "$1\\times 1$", "Choisi, sauf $d_{0}$ et $d_{L}$"],
      ["$K$", "Nombre de classes", "$\\mathbb{N}^{*}$", "$1\\times 1$", "Imposé : $10$"],
      ["$h$", "Largeur de la couche cachée", "$\\mathbb{N}^{*}$", "$1\\times 1$", "Choisi : $128$, non justifié"],
      ["$s$", "Seuil d'un neurone", "$\\mathbb{R}$", "$1\\times 1$", "$b=-s$"],
      ["$R_{k}$", "Région de décision", "$\\subseteq\\mathbb{R}^{784}$", "·", "Convexe **sans** activation, page 7 ; plus du tout avec ReLU, page 9"],
      ["$R_{S}$", "Région d'activation, une par partie $S$ des neurones allumés", "$\\subseteq\\mathbb{R}^{784}$", "·", "Convexe, page 9"],
      ["$D_{S}$", "Matrice diagonale de $0$ et de $1$", "$\\mathcal{M}_{128}(\\mathbb{R})$", "$128\\times 128$", "Calculée par région"],
      ["$\\mathcal{H}_{1}$, $\\mathcal{H}_{2}$", "Familles de fonctions", "·", "·", "Ensembles de fonctions"],
      ["$\\eta$, $B$", "Pas d'entraînement, posé page 6 ; taille d'un lot, posée page 10", "$\\mathbb{R}_{>0}$, $\\mathbb{N}^{*}$", "$1\\times 1$", "Réglages, **traités au chapitre 3**"],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.3 · La propagation avant, en pseudo-code
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-9",
    type: "titre",
    niveau: 2,
    texte: "La propagation avant, c'est-à-dire le trajet de l'image vers la réponse",
  },
  {
    id: "b-r12-10",
    type: "code",
    langage: "text",
    titre: "Ce que le réseau fait, du pixel à la loi de probabilité",
    code: [
      "ENTREE   X        matrice 28 x 28, coefficients entiers de 0 a 255",
      "         theta    { W[1..L], b[1..L] }",
      "SORTIE   a[L]     vecteur du simplexe ouvert de dimension d_L - 1",
      "",
      "1.  X      <- X / 255                    coefficients dans [0, 1]",
      "2.  a[0]   <- vec(X)                     vecteur 784 x 1",
      "3.  pour l de 1 a L :",
      "4.        z[l] <- W[l] . a[l-1] + b[l]   (d_l x d_{l-1})(d_{l-1} x 1) = d_l x 1",
      "5.        si l < L :  a[l] <- ReLU(z[l])      composante par composante",
      "6.        sinon    :  a[l] <- softmax(z[l])   somme des coordonnees = 1",
      "7.  rendre a[L]",
      "",
      "    Les a[l] sont gardes : le chapitre 3 en aura besoin couche par couche.",
      "",
      "PREDICTION       c_chapeau <- (argmax_k a[L]_k) - 1   (indefinie si ex aequo)",
      "PLUS HAUT SCORE  a[L]_{c_chapeau + 1}                 ce n'est pas une confiance,",
      "                                                      voir page 11",
    ].join("\n"),
    surlignees: [5, 6],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.4 · Erreurs fréquentes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-12",
    type: "titre",
    niveau: 2,
    texte: "Erreurs fréquentes",
  },
  {
    id: "b-r12-13",
    type: "tableau",
    ancre: "erreurs-frequentes",
    cleEnTete: true,
    entetes: ["L'erreur", "Ce qui est vrai"],
    lignes: [
      [
        "Écrire $W\\mathbf{x}$ sans vérifier les dimensions",
        "$(d_{l}\\times d_{l-1})(d_{l-1}\\times 1)$. Si les deux $d_{l-1}$ ne coïncident pas, le produit **n'existe pas** : ce n'est pas une convention, c'est une absence de définition",
      ],
      [
        "Croire qu'un neurone porte toujours un nombre de $[0,1]$",
        "Avec $\\mathrm{ReLU}$, $\\mathbf{a}^{[l]}\\in\\mathbb{R}_{\\geq 0}^{d_{l}}$, ensemble **non borné**. Seule la sortie est dans $\\Delta^{\\circ}_{K-1}$",
      ],
      [
        "Appliquer $\\mathrm{softmax}$ composante par composante",
        "Chaque coordonnée dépend de **toutes** les autres par le dénominateur. Proposition 5",
      ],
      [
        "Confondre $x^{(n)}$, $W^{[l]}$ et $x_{k}$",
        "Exemple, couche, composante. Aucun des trois n'est une puissance",
      ],
      [
        "Prouver la proposition 3 par le rang de $W^{[2]}W^{[1]}$",
        "Toute matrice de $\\mathcal{M}_{10,784}(\\mathbb{R})$ est de rang $\\leq 10$. L'argument ne restreint rien ; c'est la double inclusion qui démontre",
      ],
      [
        "Croire que le plafond du modèle linéaire vient d'un mauvais entraînement",
        "Il vient de la **famille** : les régions sont convexes pour tout $(W,\\mathbf{b})$. Proposition 2",
      ],
      [
        "Faire de l'arithmétique sur les étiquettes",
        "$c^{(n)}$ est un code. $7-3$ ne veut rien dire, et c'est pourquoi $\\mathrm{onehot}$ existe",
      ],
      [
        "Annoncer $2^{128}$ régions",
        "C'est un **majorant** du nombre de morceaux, pas un compte. Le nombre de régions non vides dépend de $W^{[1]}$ et est bien plus petit",
      ],
      [
        "Calculer $e^{z_{k}}$ directement",
        "$e^{1000}$ déborde. On retranche $\\max_{j}z_{j}$ d'abord, ce qui ne change rien au résultat par l'invariance de la proposition 5",
      ],
      [
        "Prendre le biais pour le seuil",
        "$b=-s$. Un neurone qui exige $\\mathbf{w}^{\\mathsf{T}}\\mathbf{x}>7$ a un biais de $-7$",
      ],
      [
        "Croire qu'ajouter des paramètres agrandit la famille",
        "$\\mathcal{H}_{2}=\\mathcal{H}_{1}$ avec $93\\,920$ paramètres de plus. C'est la non-linéarité qui agrandit, pas le compte",
      ],
      [
        "Croire que $\\Delta^{\\circ}_{K-1}$ a $K-1$ coordonnées",
        "Il en a $K$. L'indice $K-1$ est sa **dimension** : la contrainte de somme retire un degré de liberté",
      ],
      [
        "Utiliser $\\arg\\max$ comme s'il était partout défini",
        "Il ne l'est pas en cas d'ex æquo. L'ensemble des ex æquo est d'épaisseur nulle dans le simplexe, ce qui justifie de l'ignorer, pas de l'oublier",
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.5 · Récapitulatif des vérifications
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-14",
    type: "titre",
    niveau: 2,
    texte: "Les treize vérifications de ce chapitre",
  },
  {
    id: "b-r12-15",
    type: "texte",
    texte:
      "Les vérifications sont numérotées en continu sur tout le parcours, de $1$ à $7$ au chapitre 1 et de $8$ à $20$ ici. Les numéros ne suivent pas l'ordre des pages, et ils ne sont jamais réattribués.",
  },
  {
    id: "b-r12-16",
    type: "tableau",
    ancre: "recapitulatif-verifications",
    cleEnTete: true,
    entetes: ["N°", "Page", "Section", "Ce qu'elle demande"],
    lignes: [
      ["8", "2", "Ce que le jeu contient", "Le compte des $5$, et pourquoi le seuil est celui du $1$"],
      ["9", "3", "L'aplatissement", "Le rang de $(17,4)$, celui du pixel au-dessus, et l'écart justifié par la formule"],
      ["10", "5", "Le détecteur de bord", "Classer quatre entrées par score, en justifiant par la décomposition par signe"],
      ["11", "4", "Le gabarit", "Ce que vaut $z$ si l'encre tombe sur les poids négatifs, et pourquoi le minimum du $0$ est au centre"],
      ["12", "6", "Une sortie complète", "La classe prédite, la confiance du second choix, et l'effet d'une translation des scores"],
      ["13", "6", "Le compte", "$W$, $\\mathbf{b}$ et $p$ pour $K$ classes et $d$ entrées, puis instanciés"],
      ["14", "7", "Le corollaire", "Ce qu'on conclut de deux images et d'un milieu classés différemment"],
      ["15", "9", "La sigmoïde", "$\\sigma(-1000)$, le débordement de $e^{1000}$, et l'écriture qui l'évite"],
      ["16", "8", "La proposition 3", "Sa généralisation à trois couches, et la réfutation de l'argument du rang"],
      ["17", "9", "ReLU", "La dérivée en préactivation négative, et ce qu'on en déduit"],
      ["18", "9", "Le biais", "Le biais d'un neurone de seuil $7$, et le signe justifié par le calcul"],
      ["19", "10", "Le compte général", "$p$ pour $784\\rightarrow 32\\rightarrow 32\\rightarrow 32\\rightarrow 10$, et la part de la première matrice"],
      ["20", "11", "Les quatre modèles", "Lequel des deux changements produit l'écart, en citant les deux nombres"],
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12.6 · La suite
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r12-16b",
    type: "titre",
    niveau: 2,
    texte: "Ce réseau, et les autres",
  },
  {
    id: "b-r12-16c",
    type: "texte",
    texte:
      "Le réseau construit ici porte un nom : on l'appelle **entièrement connecté**, parce que chaque étape de calcul relie tous les nombres qui entrent à tous les nombres qui sortent, sans que rien d'autre s'y ajoute.\n\nCe n'est pas le meilleur outil pour lire des chiffres manuscrits, et le chapitre l'a mesuré, puisqu'un modèle bien plus simple atteint déjà $91{,}93\\,\\%$. Des réseaux faits exprès pour les images dépassent $99{,}5\\,\\%$, chiffre qui vient de la littérature et que ce cours n'a pas mesuré lui-même.\n\nIl a ici deux qualités qui comptent davantage : il est assez petit pour se comprendre **entièrement**, jusqu'au dernier coefficient, et il s'entraîne en quelques minutes sur une machine ordinaire.",
  },
  {
    id: "b-r12-16d",
    type: "tableau",
    entetes: ["Variante", "Ce qu'elle ajoute", "Où elle est traitée"],
    lignes: [
      [
        "Réseaux convolutifs",
        "Des poids partagés sur des voisinages de pixels, ce qui rend de nouveau visible la géométrie que la page 3 avait rendue invisible",
        "Chapitre dédié, après les chapitres 2 à 5",
      ],
      [
        "Réseaux récurrents",
        "Un état qui persiste d'une entrée à la suivante, pour des séquences de longueur variable",
        "Parcours Séries temporelles",
      ],
      [
        "Transformeurs",
        "Un mécanisme qui pondère les positions les unes par les autres, sans récurrence",
        "Parcours Focus avancé",
      ],
    ],
  },
  {
    id: "b-r12-17",
    type: "titre",
    niveau: 2,
    texte: "La suite du parcours",
  },
  {
    id: "b-r12-18",
    type: "texte",
    texte:
      "Chaque mesure de ce chapitre a été faite sur un modèle **déjà entraîné**, et d'où venaient ses $101\\,770$ nombres n'a jamais été dit. Les régler à la main demanderait $28{,}3$ heures à raison d'un par seconde, et il faudrait encore savoir quelle valeur donner à chacun.\n\nLa page 11 vient de montrer que personne ne le sait : même en les regardant après coup, on n'y reconnaît rien.",
  },
  {
    id: "b-r12-19",
    type: "texte",
    ancre: "suite",
    texte:
      "C'est l'objet du chapitre 3 : choisir ces nombres par la **descente de gradient**, sans qu'aucun humain n'en fixe un seul. Il y faudra le pas, l'initialisation, et la perte non convexe laissée en dette à la page 9.",
  },
  {
    id: "b-r12-21",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du premier chapitre de la **série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown. Le texte, les définitions, les cinq propositions démontrées, les mesures et les animations sont propres à ce cours, et cinq écarts délibérés y ont été pris : la largeur $h=128$ annoncée comme non justifiée, la sigmoïde posée par cahier des charges au lieu d'être présentée, l'espoir des bords bâti puis tranché par une mesure, les quatre modèles comparés là où la source ne mesure rien, et les ensembles d'activation corrigés là où $\\mathrm{ReLU}$ les rend non bornés.",
  },
];
