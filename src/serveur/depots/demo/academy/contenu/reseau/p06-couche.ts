import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 6 · Dix neurones
//
// La page introduit W, le simplexe ouvert, softmax, la perte, one-hot, la
// prédiction et la précision, puis démontre la PROPOSITION 5. Elle est
// démontrée ici, et non page 9, parce que c'est ici que softmax est introduit :
// une proposition sur un objet se démontre là où l'objet est posé.
//
// La page 9 n'en reprend que la conséquence dont elle a besoin.
//
// Tous les chiffres sortent de cours/lecon2/mesures.py, section 4.
// ─────────────────────────────────────────────────────────────────────────────

export const P06_COUCHE: Bloc[] = [
  {
    id: "b-r6-1",
    type: "texte",
    texte:
      "Une pièce de calcul ne rend qu'un seul nombre, quand la tâche en réclame dix, un par chiffre possible, puis une réponse unique. Dix nombres sans échelle commune ne se comparent pourtant à rien, et il faudra les ramener sur une échelle où la somme des dix vaut un. Comment passe-t-on d'une brique isolée à un modèle qui tranche entre dix chiffres ?",
  },
  {
    id: "b-r6-17f",
    type: "image",
    ancre: "couche-de-sortie-mesuree",
    src: "/cours/lecon2/l2-fig07-sortie.svg",
    largeur: 1380,
    hauteur: 470,
    alt: "Dix ronds alignés, étiquetés de zéro à neuf. Au-dessus de chacun, sa préactivation, sous le nom z : moins zéro virgule sept zéro trois huit pour le zéro, moins quinze virgule sept six trois zéro pour le un, plus zéro virgule six deux zéro huit pour le deux, plus huit virgule six un trois sept pour le trois, moins deux virgule quatre huit cinq huit pour le quatre, plus un virgule six six six huit pour le cinq, moins douze virgule quatre zéro huit quatre pour le six, plus quatorze virgule quatre un neuf huit pour le sept, plus un virgule six six zéro cinq pour le huit, et plus quatre virgule trois sept neuf quatre pour le neuf. Neuf ronds sont blancs ; celui du sept est noir et cerclé de brique. Sous chacun, son activation, sous le nom a : zéro virgule zéro zéro trois zéro zéro zéro sous le trois, zéro virgule neuf neuf six neuf cinq zéro sous le sept, et sous les huit autres des valeurs inférieures à un dix-millième. En pied, la somme des dix coordonnées vaut un, le second choix est le trois avec zéro virgule zéro zéro trois zéro zéro zéro, et la classe prédite est sept.",
    legende:
      "Les écarts entre les $z$ sont larges ; après le softmax il ne reste qu'un seul neurone qui parle.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6.1 · Dix neurones
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r6-2",
    type: "titre",
    niveau: 2,
    texte: "Dix neurones au lieu d'un",
  },
  {
    id: "b-r6-3",
    type: "texte",
    texte:
      "Dix neurones qui lisent tous la même chose et rendent chacun leur nombre forment ce qu'on appelle une **couche**, et c'est l'objet de cette page.\n\nOn prend donc dix neurones indépendants, un par chiffre, et le neurone $k$ a son propre vecteur de poids $\\mathbf{w}_{k}\\in\\mathbb{R}^{784}$ ainsi que son propre biais $b_{k}$. Empiler les dix $\\mathbf{w}_{k}^{\\mathsf{T}}$ en lignes donne une matrice, et les dix $b_{k}$ un vecteur.",
  },
  {
    id: "b-r6-3b",
    type: "titre",
    niveau: 3,
    texte: "Ce que l'indice bas désigne ici",
  },
  {
    id: "b-r6-3c",
    type: "texte",
    texte:
      "Deux emplois de l'indice bas se croisent ici, et c'est la graisse qui les sépare. En maigre, $w_{k}$ désigne comme à la page 4 le poids du pixel de rang $k$, donc un nombre. En gras, $\\mathbf{w}_{k}$ désigne le vecteur des $784$ poids du neurone qui note le chiffre $k-1$, donc une ligne entière de $W$. Là où la graisse ne se voit pas, c'est la phrase qui dit lequel des deux est en jeu. Le $b_{k}$ reste, lui, la $k$-ième coordonnée de $\\mathbf{b}$, un nombre.\n\nDe la même façon, $z$ était un nombre à la page 4 et $\\mathbf{z}$ est ici le vecteur des dix.",
  },
  {
    id: "b-r6-4",
    type: "formule",
    ancre: "couche-lineaire",
    latex:
      "K=10,\\quad W\\in\\mathcal{M}_{10,784}(\\mathbb{R}),\\quad \\mathbf{b}\\in\\mathbb{R}^{10},\\qquad \\mathbf{z}=W\\mathbf{x}+\\mathbf{b}\\in\\mathbb{R}^{10}",
    alt: "K vaut dix. W est une matrice réelle à dix lignes et sept cent quatre-vingt-quatre colonnes, b est un vecteur de l'espace à dix dimensions. Le vecteur de préactivations z vaut W x plus b, et vit dans l'espace à dix dimensions.",
    numero: "6.1",
  },
  {
    id: "b-r6-5",
    type: "texte",
    texte:
      "Vérification des dimensions : $(10\\times 784)(784\\times 1)=10\\times 1$, auquel $\\mathbf{b}$ de dimension $10\\times 1$ s'ajoute. La ligne $k$ de $W$ étant $\\mathbf{w}_{k}^{\\mathsf{T}}$, la coordonnée $z_{k}=\\mathbf{w}_{k}^{\\mathsf{T}}\\mathbf{x}+b_{k}$ est exactement la préactivation $(4.1)$ du $k$-ième neurone, si bien que rien de neuf n'a été introduit et que dix copies du même objet ont seulement été rangées.",
  },
  {
    id: "b-r6-5-melange",
    type: "animation",
    ancre: "reseau-melange",
    animationId: "le-reseau-melange",
    legende:
      "Les $784$ pixels et les $784$ colonnes de $W$ se réordonnent ensemble. Les dix scores ne changent pas d'un chiffre : ce modèle n'a jamais su que deux pixels étaient voisins. C'est la proposition 1 de la page 3, sur la matrice qu'on vient de poser.",
  },
  {
    id: "b-r6-6",
    type: "tableau",
    ancre: "types-couche",
    titre: "Les objets de la couche, typés",
    cleEnTete: true,
    entetes: ["Symbole", "Type", "Ensemble", "Dimension", "Rôle"],
    lignes: [
      ["$W$", "Matrice", "$\\mathcal{M}_{10,784}(\\mathbb{R})$", "$10\\times 784$", "**Paramètre appris**"],
      ["$\\mathbf{b}$", "Vecteur", "$\\mathbb{R}^{10}$", "$10\\times 1$", "**Paramètre appris**"],
      ["$\\mathbf{z}$", "Vecteur", "$\\mathbb{R}^{10}$", "$10\\times 1$", "Calculé"],
      ["$\\mathbf{a}$", "Vecteur", "$\\Delta^{\\circ}_{9}$, défini en $(6.2)$", "$10\\times 1$", "Calculé, de somme $1$"],
      ["$\\mathbf{y}$", "Vecteur", "$\\{0,1\\}^{10}$", "$10\\times 1$", "Donnée, tirée de $c$ par $(6.4)$"],
      ["$c$", "Scalaire entier", "$[\\![0,9]\\!]$", "$1\\times 1$", "Donnée. Un **code**, pas une quantité"],
      ["$\\boldsymbol{\\theta}$", "Couple", "$\\mathcal{M}_{10,784}(\\mathbb{R})\\times\\mathbb{R}^{10}$", "$p=7\\,850$", "L'ensemble des paramètres"],
    ],
  },
  {
    id: "b-r6-7",
    type: "texte",
    texte:
      "$\\boldsymbol{\\theta}=(W,\\mathbf{b})$ est un couple d'objets de types différents, et on l'identifie à un vecteur de $\\mathbb{R}^{p}$ en rangeant chaque bloc bout à bout, avec $p=10\\times 784+10=7\\,850$. C'est le procédé de la page 3, où $\\mathrm{vec}$ rangeait une grille $28\\times 28$ en colonne, employé ici sur des blocs de taille quelconque et sur des paramètres au lieu d'une image.",
  },
  {
    id: "b-r6-fig14",
    type: "image",
    ancre: "dix-gabarits-fixe",
    src: "/cours/lecon2/l2-fig14-dix-gabarits.svg",
    largeur: 1380,
    hauteur: 820,
    alt: "Dix grilles de vingt-huit sur vingt-huit, rangées en deux rangées de cinq et étiquetées de zéro à neuf. Chaque grille colore les sept cent quatre-vingt-quatre poids de la ligne correspondante de W : le rouge brique marque les poids positifs, le bleu ardoise les négatifs, le blanc le zéro. Les dix partagent une seule échelle, graduée en bas, symétrique autour d'un zéro central. Certains gabarits laissent deviner la forme du chiffre qu'ils notent, d'autres pas du tout.",
    legende:
      "Les dix gabarits côte à côte, sur une seule échelle : leurs amplitudes se comparent d'un coup d'œil.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6.2 · Le simplexe
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r6-9",
    type: "titre",
    niveau: 2,
    texte: "De dix scores à une loi de probabilité",
  },
  {
    id: "b-r6-10",
    type: "texte",
    texte:
      "$\\mathbf{z}$ est un vecteur de dix réels quelconques : rien n'y est positif, rien n'y somme à $1$, et deux valeurs de $\\boldsymbol{\\theta}$ donnent des échelles incomparables. On veut une réponse **et** une confiance, donc un objet d'un ensemble plus petit.",
  },
  {
    id: "b-r6-11",
    type: "definition",
    terme: "Simplexe ouvert",
    anglais: "open probability simplex",
    texte:
      "L'ensemble $\\Delta^{\\circ}_{K-1}$ des vecteurs de $\\mathbb{R}^{K}$ à coordonnées **strictement** positives et de somme $1$. Ses éléments sont exactement les lois de probabilité sur $K$ classes qui n'excluent aucune classe.\n\nLe petit rond en exposant note cette exclusion du bord : une coordonnée peut s'approcher de $0$ autant qu'on veut sans jamais l'atteindre, et c'est ce que veut dire **ouvert**.",
  },
  {
    id: "b-r6-12",
    type: "formule",
    ancre: "simplexe",
    latex:
      "\\Delta^{\\circ}_{K-1}=\\Big\\{\\mathbf{a}\\in\\mathbb{R}^{K}\\ :\\ a_{k}>0\\ \\ \\forall k\\in[\\![1,K]\\!],\\ \\ \\textstyle\\sum_{k=1}^{K}a_{k}=1\\Big\\}",
    alt: "Le simplexe ouvert de dimension K moins un est l'ensemble des vecteurs a de l'espace à K dimensions dont toutes les coordonnées a k sont strictement positives pour k entre un et K, et dont la somme des K coordonnées vaut un.",
    numero: "6.2",
  },
  {
    id: "b-r6-13",
    type: "texte",
    texte:
      "L'indice $K-1$ est la **dimension** de cet ensemble, pas son nombre de coordonnées. Un élément a bien $K$ coordonnées, mais la contrainte $\\sum_{k}a_{k}=1$ en retire une : dès que $a_{1},\\ldots,a_{K-1}$ sont donnés, $a_{K}=1-\\sum_{k<K}a_{k}$ est forcé. Il reste $K-1$ degrés de liberté. Pour $K=10$, on écrit donc $\\Delta^{\\circ}_{9}$.",
  },
  {
    id: "b-r6-14",
    type: "definition",
    terme: "Softmax",
    texte:
      "L'application $\\mathrm{softmax}:\\mathbb{R}^{K}\\rightarrow\\Delta^{\\circ}_{K-1}$ qui exponentie chaque coordonnée puis divise par la somme. L'exponentielle rend tout strictement positif, la division normalise.",
  },
  {
    id: "b-r6-15",
    type: "formule",
    ancre: "softmax",
    latex:
      "\\mathrm{softmax}:\\mathbb{R}^{K}\\rightarrow\\Delta^{\\circ}_{K-1},\\qquad \\big(\\mathrm{softmax}(\\mathbf{z})\\big)_{k}=\\frac{e^{z_{k}}}{\\sum_{j=1}^{K} e^{z_{j}}}",
    alt: "Softmax va de l'espace à K dimensions vers le simplexe ouvert de dimension K moins un. Sa coordonnée numéro k vaut l'exponentielle de z k, divisée par la somme pour j allant de un à K des exponentielles de z j.",
    numero: "6.3",
    legende:
      "L'ensemble d'arrivée se vérifie : le numérateur est strictement positif, le dénominateur est une somme de termes strictement positifs, et la somme des $K$ quotients vaut $\\sum_{k}e^{z_{k}}/\\sum_{j}e^{z_{j}}=1$.",
  },
  {
    id: "b-r6-15b",
    type: "texte",
    texte:
      "Les deux morceaux se recollent, et le modèle de cette page s'écrit d'un trait : $\\mathbf{a}=f_{\\boldsymbol{\\theta}}(\\mathbf{x})=\\mathrm{softmax}(W\\mathbf{x}+\\mathbf{b})$. C'est la boîte de la page 1 dans sa première version, celle qui ne fait qu'un calcul entre l'image et la réponse.",
  },
  {
    id: "b-r6-16",
    type: "derivation",
    ancre: "proposition-5",
    titre:
      "Le softmax n'agit pas coordonnée par coordonnée, et il se réduit à deux classes en une fonction d'une variable (proposition 5)",
    hypotheses: [
      "$\\mathrm{softmax}$ est défini par $(6.3)$, avec $K\\geq 2$.",
      "$\\mathbf{1}_{K}=(1,\\ldots,1)^{\\mathsf{T}}\\in\\mathbb{R}^{K}$ est le vecteur de uns.",
      "$\\sigma:\\mathbb{R}\\rightarrow(0,1)$, $\\sigma(u)=1/(1+e^{-u})$. Cette fonction ne sert ici qu'à nommer le résultat du cas $K=2$ ; la page 9 l'étudie pour elle-même.",
    ],
    proprietes: [
      "$e^{u+v}=e^{u}e^{v}$",
      "$e^{u}>0$ pour tout réel $u$, donc toute division par une somme d'exponentielles est licite",
    ],
    etapes: [
      {
        texte:
          "**(i) Invariance par translation.** Pour tout $t\\in\\mathbb{R}$ et tout $k$ :",
      },
      {
        latex:
          "\\big(\\mathrm{softmax}(\\mathbf{z}+t\\mathbf{1}_{K})\\big)_{k}=\\frac{e^{z_{k}+t}}{\\sum_{j} e^{z_{j}+t}}=\\frac{e^{t}\\,e^{z_{k}}}{e^{t}\\sum_{j} e^{z_{j}}}=\\frac{e^{z_{k}}}{\\sum_{j} e^{z_{j}}}=\\big(\\mathrm{softmax}(\\mathbf{z})\\big)_{k}",
        alt: "La coordonnée k de softmax de z plus t fois le vecteur de uns vaut exponentielle de z k plus t, divisée par la somme des exponentielles de z j plus t. En factorisant exponentielle de t au numérateur et au dénominateur, ce facteur se simplifie, et il reste la coordonnée k de softmax de z.",
        justification:
          "$e^{z+t}=e^{t}e^{z}$, et $e^{t}\\neq 0$ autorise la simplification.",
      },
      {
        texte:
          "$\\mathrm{softmax}$ n'est donc **pas injective** : toute la droite $\\mathbf{z}+\\mathbb{R}\\mathbf{1}_{K}$ a la même image.",
      },
      {
        texte:
          "**Conséquence : ce n'est pas une application composante par composante.** Si elle l'était, il existerait $\\varphi:\\mathbb{R}\\rightarrow\\mathbb{R}$ telle que la coordonnée $k$ de l'image ne dépende que de $z_{k}$. Ajoutons alors $t$ à la seule coordonnée $j\\neq k$ : la coordonnée $k$ de l'image serait inchangée, puisque $z_{k}$ ne bouge pas. Or elle change, car le dénominateur augmente de $e^{z_{j}}(e^{t}-1)\\neq 0$ pour $t\\neq 0$. Contradiction.",
        justification:
          "L'argument porte sur une modification d'**une seule** coordonnée, alors que (i) en modifiait toutes : les deux ne se contredisent pas.",
      },
      {
        texte: "**(ii) Le cas $K=2$.** On calcule la première coordonnée :",
      },
      {
        latex:
          "\\big(\\mathrm{softmax}(\\mathbf{z})\\big)_{1}=\\frac{e^{z_{1}}}{e^{z_{1}}+e^{z_{2}}}=\\frac{1}{1+e^{z_{2}-z_{1}}}=\\frac{1}{1+e^{-(z_{1}-z_{2})}}=\\sigma(z_{1}-z_{2})",
        alt: "La première coordonnée de softmax de z vaut exponentielle de z un sur la somme des exponentielles de z un et de z deux. En divisant numérateur et dénominateur par exponentielle de z un, on obtient un sur un plus exponentielle de z deux moins z un, c'est-à-dire un sur un plus exponentielle de moins la différence z un moins z deux, qui est sigma de cette différence.",
        justification:
          "Division du numérateur et du dénominateur par $e^{z_{1}}$, strictement positif.",
      },
    ],
    resultat: {
      latex:
        "\\mathrm{softmax}(\\mathbf{z}+t\\mathbf{1}_{K})=\\mathrm{softmax}(\\mathbf{z})\\quad\\text{et}\\quad \\big(\\mathrm{softmax}(z_{1},z_{2})\\big)_{1}=\\sigma(z_{1}-z_{2})",
      alt: "Softmax de z plus t fois le vecteur de uns égale softmax de z ; et pour deux classes, la première coordonnée de softmax vaut sigma de la différence z un moins z deux.",
    },
    interpretation:
      "Chaque coordonnée de la sortie dépend de **toutes** les coordonnées de $\\mathbf{z}$, par le dénominateur. Un score n'a donc aucun sens seul : seuls les **écarts** entre scores en ont un. Et ce que le cas binaire appelle « le » score est en réalité l'écart entre deux scores, dont l'un est implicitement fixé à zéro. La sigmoïde n'est pas une fonction différente du softmax : c'en est le cas particulier à deux classes.",
    limites: [
      "L'invariance par translation a une conséquence pratique immédiate : on peut retrancher $\\max_{j} z_{j}$ à toutes les coordonnées sans changer le résultat, et c'est exactement ce que fait le programme de mesures pour que $e^{z_{k}}$ ne déborde jamais.",
      "Elle a aussi une conséquence sur les paramètres : ajouter une même constante aux dix biais ne change rien à la sortie. Le modèle a donc un degré de liberté inutile.",
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 6.3 · Étiquette, perte, prédiction
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r6-18",
    type: "titre",
    niveau: 2,
    texte: "Comparer la sortie à la vérité",
  },
  {
    id: "b-r6-19",
    type: "formule",
    ancre: "onehot",
    latex:
      "\\mathrm{onehot}:[\\![0,K-1]\\!]\\rightarrow\\{0,1\\}^{K},\\qquad \\mathrm{onehot}(c)=\\mathbf{e}_{c+1}",
    alt: "L'encodage one-hot va de l'ensemble des entiers de zéro à K moins un vers l'ensemble des vecteurs à K coordonnées valant zéro ou un. L'image de c est le vecteur e indice c plus un.",
    numero: "6.4",
    legende:
      "$\\mathbf{e}_{k}\\in\\mathbb{R}^{K}$ est le $k$-ième vecteur de la base canonique : sa $k$-ième coordonnée vaut $1$, les autres $0$. Le décalage $c+1$ vient de ce que les classes sont numérotées à partir de $0$ et les coordonnées à partir de $1$ ; il est écrit à chaque fois plutôt que sous-entendu.",
  },
  {
    id: "b-r6-20",
    type: "formule",
    ancre: "perte-entropie",
    latex:
      "\\ell:\\Delta^{\\circ}_{K-1}\\times[\\![0,K-1]\\!]\\rightarrow\\mathbb{R}_{\\geq 0},\\qquad \\ell(\\mathbf{a},c)=-\\ln a_{c+1}",
    alt: "La perte ell va du produit du simplexe ouvert de dimension K moins un par l'ensemble des entiers de zéro à K moins un, vers l'ensemble des réels positifs ou nuls. La perte du couple a et c vaut moins le logarithme népérien de la coordonnée numéro c plus un de a.",
    numero: "6.5",
    legende:
      "La perte ne regarde qu'une coordonnée, celle de la bonne classe, et le logarithme la fait croître sans borne quand cette coordonnée tend vers $0$ : se tromper avec assurance coûte arbitrairement cher, ce qu'un écart comme $1-a_{c+1}$ ne ferait pas.\n\nSélectionner la coordonnée $c+1$ revient à prendre $-\\mathbf{y}^{\\mathsf{T}}\\,\\ln \\mathbf{a}$ avec $\\mathbf{y}=\\mathrm{onehot}(c)$, écrit autrement. L'ensemble d'arrivée est bien $\\mathbb{R}_{\\geq 0}$, puisque $a_{c+1}\\leq 1$ donne $\\ln a_{c+1}\\leq 0$, et la perte ne s'annule que si $a_{c+1}=1$, ce qui n'arrive jamais sur $\\Delta^{\\circ}_{K-1}$, où toutes les coordonnées sont strictement positives.",
  },
  {
    id: "b-r6-21",
    type: "definition",
    terme: "Prédiction, et le cas des ex æquo",
    texte:
      "La classe prédite est $\\widehat{c}(\\mathbf{a})=\\big(\\arg\\max_{k\\in[\\![1,K]\\!]} a_{k}\\big)-1$. **$\\arg\\max$ n'est pas défini sur $\\Delta^{\\circ}_{K-1}$ tout entier** : sur l'ensemble $E$ des $\\mathbf{a}$ dont le maximum est atteint par au moins deux coordonnées, il ne désigne aucun indice unique. $\\widehat{c}$ est donc définie sur $\\Delta^{\\circ}_{K-1}\\setminus E$. Cet ensemble $E$ est réuni par les égalités $a_{k}=a_{j}$, chacune retirant un degré de liberté : il est donc d'épaisseur nulle dans $\\Delta^{\\circ}_{K-1}$, et deux coordonnées calculées en virgule flottante n'y tombent pas. La convention retenue par le programme, en cas d'égalité, est de prendre le **plus petit** indice.",
  },
  {
    id: "b-r6-22",
    type: "formule",
    ancre: "precision",
    latex:
      "\\text{précision}=\\frac{1}{N}\\sum_{n=1}^{N}\\mathbb{1}\\big\\{\\widehat{c}(\\mathbf{a}^{(n)})=c^{(n)}\\big\\}\\ \\in[0,1]",
    alt: "La précision vaut un sur N fois la somme, pour n allant de un à N, de l'indicatrice de l'égalité entre la classe prédite à partir de a exposant n et l'étiquette c exposant n. Elle est comprise entre zéro et un.",
    numero: "6.6",
    legende:
      "C'est une **définition**, pas une notion supposée connue : la part des exemples sur lesquels la classe prédite tombe juste. Elle ignore complètement la confiance.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6.4 · Le compte, et la mesure
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r6-23",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce modèle compte, et ce qu'il vaut",
  },
  {
    id: "b-r6-24",
    type: "formule",
    ancre: "p-7850",
    latex:
      "p=\\underbrace{10\\times 784}_{W}\\ +\\ \\underbrace{10}_{\\mathbf{b}}\\ =\\ 7\\,840+10=7\\,850",
    alt: "Le nombre de paramètres p vaut dix fois sept cent quatre-vingt-quatre pour la matrice W, plus dix pour le vecteur b, soit sept mille huit cent quarante plus dix, égale sept mille huit cent cinquante.",
    numero: "6.7",
  },
  {
    id: "b-r6-24b",
    type: "texte",
    texte:
      "Parmi ces $7\\,850$ nombres, $10\\times 67=670$ sont attachés aux pixels que la page 2 a trouvés blancs sur les $60\\,000$ images à la fois. Quelle que soit leur valeur, ils ne déplacent aucun score, puisqu'ils sont toujours multipliés par zéro.",
  },
  {
    id: "b-r6-24c",
    type: "texte",
    texte:
      "Trois réglages apparaissent dans la sortie qui suit, et le chapitre 3 seul dira comment on les choisit. Une **époque** est un passage complet sur les $60\\,000$ images d'entraînement. Le **pas** $\\eta$ règle l'ampleur de chaque correction apportée aux paramètres. L'**initialisation** dit de quelles valeurs on part, ici de zéro partout, ce qui donne dix scores nuls et dix probabilités égales sur la première image. Les corrections, elles, ne sont pas nulles pour autant, et le chapitre 3 dira pourquoi.",
  },
  {
    id: "b-r6-25",
    type: "sortie",
    ancre: "modele1-resultat",
    titre:
      "Le modèle $784\\rightarrow 10$ entraîné · cours/lecon2/mesures.py, section 4",
    texte:
      "    p                                       7850 parametres\n    initialisation                          zero\n    eta                                     0.5\n    epoques                                 30\n\n    PRECISION DE TEST                       0.9193\n    ERREURS                                 807 sur 10 000\n    perte de test                           0.2931\n\n      epoque   acc_test\n           1     0.9172\n           2     0.9066\n           3     0.9211\n           5     0.9176\n          10     0.9193\n          15     0.9251\n          20     0.9235\n          25     0.9221\n          30     0.9193",
    lecture: [
      "$0{,}9193$ contre un seuil de $11{,}35\\,\\%$ : le modèle a appris quelque chose, et beaucoup.",
      "**L'essentiel du score est acquis dès la première époque**, à $0{,}9172$, et les vingt-neuf suivantes ne font plus que le faire osciller : entre les époques $5$ et $30$ il va et vient entre $0{,}9176$ et $0{,}9251$, sans jamais s'écarter d'un point. Le chiffre retenu, $0{,}9193$, est celui de la dernière époque et non le meilleur des neuf, parce que choisir le meilleur reviendrait à régler le modèle sur le jeu de test.",
      "La perte de test, $0{,}2931$, est la moyenne de $(6.5)$ sur les $10\\,000$ images, et non la perte d'une image particulière.",
      "$807$ erreurs sur $10\\,000$, et la page 7 démontre que ce plafond n'est pas un défaut de réglage.",
    ],
  },
  {
    id: "b-r6-26",
    type: "sortie",
    ancre: "sortie-image-zero-lineaire",
    titre: "Une sortie complète, sur l'image de test n°0",
    texte:
      "      classe :         0         1         2         3         4         5         6         7         8         9\n      a_k    :    0.0000    0.0000    0.0000    0.0030    0.0000    0.0000    0.0000    0.9969    0.0000    0.0000\n      predit 7 avec 0.996950   second choix 3 avec 0.003000\n      somme des dix coordonnees : 1.0000000000",
    lecture: [
      "Les dix coordonnées somment à $1$ à la précision d'affichage : $\\mathbf{a}$ est bien dans $\\Delta^{\\circ}_{9}$.",
      "Aucune coordonnée n'est **exactement** nulle : les zéros affichés sont des arrondis. C'est le sens du mot « ouvert » dans $(6.2)$.",
      "$\\widehat{c}(\\mathbf{a})=7$, et l'étiquette vraie est $7$.",
    ],
  },
  {
    id: "b-r6-27",
    type: "verification",
    numero: 12,
    enonce: "La sortie ci-dessus se lit sans le programme qui l'a produite.",
    questions: [
      "Quelle classe le réseau prédit-il, et quelle confiance accorde-t-il à son **second** choix ?",
      "Que vaut $\\ell(\\mathbf{a},7)$ pour cette sortie, à trois décimales ?",
      "Si l'on ajoutait $100$ à chacune des dix préactivations $z_{k}$, que deviendrait $\\mathbf{a}$ ? Justifier par la proposition 5.",
    ],
  },
  {
    id: "b-r6-28",
    type: "verification",
    numero: 13,
    enonce: "Le compte des paramètres se fait sans instancier d'abord.",
    questions: [
      "Pour $K$ classes et $d$ entrées, donner l'ensemble d'appartenance de $W$, celui de $\\mathbf{b}$, et l'expression de $p$.",
      "Instancier pour $K=10$ et $d=784$.",
      "Quelle part de $p$ est occupée par les biais ? Cette part grandit-elle ou diminue-t-elle quand $d$ augmente ?",
    ],
  },
];
