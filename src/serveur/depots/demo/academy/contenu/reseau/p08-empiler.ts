import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 8 · Empiler ne suffit pas
//
// La PROPOSITION 3, avec ses DEUX inclusions. La seconde est celle qu'on oublie
// et c'est elle qui donne l'égalité : sans elle on n'aurait qu'une inclusion, et
// « la famille ne grandit pas » resterait à moitié démontré.
//
// L'ARGUMENT DU RANG EST FAUX et le texte le dit. Il est tentant parce qu'il
// produit le nombre 10, qui est effectivement le rang du produit ; mais toute
// matrice de M_10,784(R) est de rang au plus 10, donc l'argument ne restreint
// rien du tout.
//
// Le balayage et les précisions sortent de cours/lecon2/mesures.py, section 6.
// ─────────────────────────────────────────────────────────────────────────────

export const P08_EMPILER: Bloc[] = [
  {
    id: "b-r8-1",
    type: "texte",
    texte:
      "Le plafond du modèle précédent tient à sa famille de fonctions, pas à son réglage. Le réflexe naturel est donc d'agrandir cette famille, et le premier moyen qui vient à l'esprit est d'empiler une couche de calcul de plus. Reste à savoir si ce réflexe achète quoi que ce soit.",
  },
  {
    id: "b-r8-1f",
    type: "image",
    ancre: "pas-balaye",
    src: "/cours/lecon2/l2-fig17-le-pas-balaye.svg",
    largeur: 1380,
    hauteur: 560,
    alt: "Un graphique. En abscisse, six pas d'apprentissage, de zéro virgule cinquante à gauche à zéro virgule zéro un à droite. En ordonnée, la précision de test après quinze époques. Cinq points ronds sont posés, tous à peu près à la même hauteur ; celui du pas zéro virgule dix est en brique, plus gros, porte la valeur la plus haute et l'étiquette retenu. Le pas de gauche n'a pas de point : une croix en brique le surmonte, légendée divergence entre parenthèses NaN. Un trait tireté horizontal traverse toute la figure un peu au-dessous des cinq points ; il porte à son extrémité droite le nombre de paramètres du modèle de la page précédente et sa précision. Sous un filet, une ligne chiffre ce que la couche supplémentaire achète, en points de précision et en erreurs.",
    legende:
      "Cinq pas convergent au même endroit, un diverge : le réglage n'est pas ce qui manque.",
  },
  {
    id: "b-r8-2",
    type: "texte",
    texte:
      "On intercale une couche de $h=128$ neurones entre l'entrée et la sortie, $h$ étant un entier qu'on choisit. Une telle couche est dite **cachée**, parce que rien n'entre ni ne sort du réseau chez elle.\n\nLe calcul se fait alors en deux temps : on pose $\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}$, puis on donne ce résultat au second temps, $\\mathbf{z}^{[2]}=W^{[2]}\\mathbf{z}^{[1]}+\\mathbf{b}^{[2]}$, et rien n'est posé entre les deux. Le crochet en exposant numérote l'étape de calcul, comme la page 2 l'avait annoncé.",
  },
  {
    id: "b-r8-3",
    type: "formule",
    ancre: "deux-familles",
    latex:
      "\\begin{aligned}\\mathcal{H}_{1}&=\\big\\{\\ \\mathbf{x}\\mapsto W\\mathbf{x}+\\mathbf{b}\\ :\\ W\\in\\mathcal{M}_{10,784}(\\mathbb{R}),\\ \\mathbf{b}\\in\\mathbb{R}^{10}\\ \\big\\}\\\\[2mm] \\mathcal{H}_{2}&=\\big\\{\\ \\mathbf{x}\\mapsto W^{[2]}\\big(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}\\ :\\ W^{[1]}\\in\\mathcal{M}_{h,784}(\\mathbb{R}),\\ \\mathbf{b}^{[1]}\\in\\mathbb{R}^{h},\\ W^{[2]}\\in\\mathcal{M}_{10,h}(\\mathbb{R}),\\ \\mathbf{b}^{[2]}\\in\\mathbb{R}^{10}\\ \\big\\}\\end{aligned}",
    alt: "H un est l'ensemble des applications qui à x associent W x plus b, où W parcourt les matrices dix par sept cent quatre-vingt-quatre et b l'espace à dix dimensions. H deux est l'ensemble des applications qui à x associent W deux appliqué à W un x plus b un, plus b deux.",
    numero: "8.1",
    legende:
      "$\\mathcal{H}$ désigne une **famille de fonctions**, et son indice compte les étapes de calcul, non des coordonnées : $\\mathcal{H}_{1}$ est la famille de la page 6, $\\mathcal{H}_{2}$ celle qu'on vient de poser.\n\nDans $\\mathcal{H}_{2}$, ce qui parcourt tout son ensemble est le quadruplet $W^{[1]}\\in\\mathcal{M}_{128,784}(\\mathbb{R})$, $\\mathbf{b}^{[1]}\\in\\mathbb{R}^{128}$, $W^{[2]}\\in\\mathcal{M}_{10,128}(\\mathbb{R})$, $\\mathbf{b}^{[2]}\\in\\mathbb{R}^{10}$, soit $128\\times 784+128+10\\times 128+10=101\\,770$ paramètres contre $7\\,850$.\n\nLes deux familles rendent dix scores, et le $\\mathrm{softmax}$ de la page 6 se pose après, identique dans les deux cas : le comparer ne changerait rien, et il est laissé de côté ici comme il l'était page 7.",
  },
  {
    id: "b-r8-4",
    type: "derivation",
    ancre: "proposition-3",
    titre:
      "Deux couches sans rien entre elles forment exactement la même famille de fonctions qu'une seule (proposition 3)",
    hypotheses: [
      "$\\mathcal{H}_{1}$ et $\\mathcal{H}_{2}$ sont définies par $(8.1)$.",
      "$I_{10}\\in\\mathcal{M}_{10}(\\mathbb{R})$ est la matrice identité.",
    ],
    proprietes: [
      "Associativité du produit matriciel",
      "Distributivité du produit sur la somme",
      "Règle des dimensions : $\\mathcal{M}_{10,128}\\times\\mathcal{M}_{128,784}\\rightarrow\\mathcal{M}_{10,784}$",
    ],
    etapes: [
      {
        texte:
          "**Première inclusion, $\\mathcal{H}_{2}\\subseteq\\mathcal{H}_{1}$.** On développe l'expression de $\\mathcal{H}_{2}$ :",
      },
      {
        latex:
          "W^{[2]}\\big(W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}\\big)+\\mathbf{b}^{[2]}=\\underbrace{\\big(W^{[2]}W^{[1]}\\big)}_{W}\\mathbf{x}+\\underbrace{\\big(W^{[2]}\\mathbf{b}^{[1]}+\\mathbf{b}^{[2]}\\big)}_{\\mathbf{b}}",
        alt: "W deux appliqué à W un x plus b un, plus b deux, égale le produit de W deux par W un, appliqué à x, plus le vecteur W deux b un plus b deux.",
        justification: "Distributivité, puis associativité.",
      },
      {
        texte:
          "Les dimensions donnent $(10\\times 128)(128\\times 784)=10\\times 784$, donc $W^{[2]}W^{[1]}\\in\\mathcal{M}_{10,784}(\\mathbb{R})$ ; et $(10\\times 128)(128\\times 1)+(10\\times 1)=10\\times 1$, donc $W^{[2]}\\mathbf{b}^{[1]}+\\mathbf{b}^{[2]}\\in\\mathbb{R}^{10}$. La fonction obtenue est donc bien un élément de $\\mathcal{H}_{1}$.",
      },
      {
        texte:
          "**Seconde inclusion, $\\mathcal{H}_{1}\\subseteq\\mathcal{H}_{2}$.** C'est celle qui donne l'égalité, et elle demande une construction. Soient $W\\in\\mathcal{M}_{10,784}(\\mathbb{R})$ et $\\mathbf{b}\\in\\mathbb{R}^{10}$ quelconques. On pose :",
      },
      {
        latex:
          "W^{[1]}=\\begin{pmatrix}W\\\\ 0\\end{pmatrix}\\in\\mathcal{M}_{128,784}(\\mathbb{R}),\\qquad \\mathbf{b}^{[1]}=\\mathbf{0}\\in\\mathbb{R}^{128},\\qquad W^{[2]}=\\big(\\,I_{10}\\ \\big|\\ 0\\,\\big)\\in\\mathcal{M}_{10,128}(\\mathbb{R}),\\qquad \\mathbf{b}^{[2]}=\\mathbf{b}",
        alt: "W un est la matrice à cent vingt-huit lignes et sept cent quatre-vingt-quatre colonnes dont les dix premières lignes sont celles de W et les cent dix-huit suivantes sont nulles. b un est le vecteur nul de l'espace à cent vingt-huit dimensions. W deux est la matrice à dix lignes et cent vingt-huit colonnes formée de la matrice identité d'ordre dix suivie de zéros. b deux vaut b.",
        justification:
          "$W^{[1]}$ empile $W$ et $118$ lignes nulles ; $W^{[2]}$ sélectionne les dix premières coordonnées et jette les $118$ autres.",
      },
      {
        latex:
          "W^{[2]}W^{[1]}=\\big(\\,I_{10}\\ \\big|\\ 0\\,\\big)\\begin{pmatrix}W\\\\ 0\\end{pmatrix}=I_{10}W+0\\cdot 0=W,\\qquad W^{[2]}\\mathbf{b}^{[1]}+\\mathbf{b}^{[2]}=W^{[2]}\\mathbf{0}+\\mathbf{b}=\\mathbf{b}",
        alt: "Le produit de W deux par W un vaut identité fois W plus zéro fois zéro, c'est-à-dire W. Et W deux fois b un plus b deux vaut W deux fois le vecteur nul plus b, c'est-à-dire b.",
        justification: "Produit par blocs.",
      },
      {
        texte:
          "La fonction de $\\mathcal{H}_{1}$ de paramètres $(W,\\mathbf{b})$ est donc atteinte dans $\\mathcal{H}_{2}$. Les deux inclusions donnent l'égalité.",
      },
    ],
    resultat: {
      latex: "\\mathcal{H}_{2}=\\mathcal{H}_{1}",
      alt: "La famille H deux est égale à la famille H un.",
    },
    interpretation:
      "Les $101\\,770$ paramètres ne décrivent pas une famille plus large : ils décrivent **exactement la même**, avec un paramétrage redondant. Chaque fonction de $\\mathcal{H}_{2}$ y est atteinte par une infinité de valeurs de $(W^{[1]},\\mathbf{b}^{[1]},W^{[2]},\\mathbf{b}^{[2]})$. La proposition 2 s'applique donc encore, mot pour mot, et le plafond de la page 7 tient : les régions de décision restent convexes, et le corollaire reste vrai.",
    limites: [
      "L'égalité vaut pour toute taille de couche intermédiaire $h\\geq 10$, y compris $h=10\\,000$ : la démonstration ne s'est servie de la valeur $128$ nulle part, seulement de $128\\geq 10$. En dessous de $10$, la construction de la seconde inclusion ne se fait plus.",
      "Elle vaut aussi pour trois couches, et pour $L$ couches, par la même récurrence.",
      "Elle cesse de valoir dès qu'une fonction non affine s'insère entre deux couches : c'est le sujet de la page 9.",
    ],
  },
  {
    id: "b-r8-5",
    type: "encart",
    ton: "attention",
    titre: "Un argument tentant, et faux",
    texte:
      "On lit parfois que $W^{[2]}W^{[1]}$ serait « de rang au plus $10$ », et que ce serait là la restriction. **C'est faux comme argument**, et la mesure le confirme : le rang du produit vaut bien $10$, mais toute matrice de $\\mathcal{M}_{10,784}(\\mathbb{R})$ est de rang au plus $10$, y compris celles de $\\mathcal{H}_{1}$.\n\nLe rang ne restreint donc rien par rapport à la famille de départ, et au mieux il donnerait l'inclusion facile, celle de $\\mathcal{H}_{2}$ dans $\\mathcal{H}_{1}$. C'est la seconde inclusion, la construction explicite ci-dessus, qui fait la démonstration.",
  },
  {
    id: "b-r8-6",
    type: "animation",
    ancre: "empiler-ne-change-rien",
    animationId: "empiler-ne-change-rien",
    legende:
      "Les dix scores ne bougent pas quand la couche du milieu disparaît. C'est la proposition 3, sur une image : tant que rien ne s'interpose entre les deux étapes, $128$ neurones de plus ne calculent rien qu'une seule matrice ne calculait déjà.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.2 · La mesure
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r8-7",
    type: "titre",
    niveau: 2,
    texte: "Ce que $93\\,920$ paramètres de plus achètent",
  },
  {
    id: "b-r8-8",
    type: "texte",
    texte:
      "La démonstration ne dit pas qu'un modèle à deux couches fera moins bien : elle dit qu'il ne pourra rien calculer qu'une seule couche ne calculait déjà. Reste à voir ce que l'entraînement en tire, et cela demande de lui donner sa meilleure chance, puisque le juger avec le pas d'un autre modèle ne prouverait rien. On balaie donc six valeurs du pas $\\eta$ sur $15$ époques, et on retient la meilleure.\n\nUn pas trop grand fait **diverger** l'entraînement : les paramètres grandissent d'une correction à l'autre au lieu de se stabiliser, jusqu'à dépasser ce qu'un nombre flottant peut représenter, et le calcul rend alors $\\mathrm{NaN}$, la marque d'un résultat qui n'est plus un nombre.",
  },
  {
    id: "b-r8-9",
    type: "sortie",
    ancre: "balayage-eta",
    titre:
      "Le balayage du pas, puis le résultat · cours/lecon2/mesures.py, section 6",
    texte:
      "         eta    acc_test   remarque\n        0.50       ---     divergence (NaN)\n        0.20    0.9237     converge\n        0.10    0.9256     converge\n        0.05    0.9244     converge\n        0.02    0.9240     converge\n        0.01    0.9212     converge\n\n    RETENU : eta = 0.1\n\n    p                                       101770 parametres\n    PRECISION DE TEST                       0.9256\n    ERREURS                                 744 sur 10 000\n\n    rang de W2 @ W1                         10",
    lecture: [
      "À $\\eta=0{,}5$, le modèle **diverge** dès la première époque, alors que ce même pas conviendra au réseau de la page 10. Un pas ne se transporte donc pas d'un modèle à l'autre, et c'est bien pourquoi on le balaie.",
      "Au meilleur réglage : $0{,}9256$ et $744$ erreurs, contre $0{,}9193$ et $807$ pour $7\\,850$ paramètres. **$93\\,920$ paramètres de plus achètent $0{,}63$ point**, soit $63$ erreurs sur $10\\,000$.",
      "Les deux chiffres ne sortent pas du même protocole, celui de la page 6 étant pris à sa dernière époque et celui-ci au meilleur de six pas : l'écart est donc un majorant de ce que la couche achète, et il est déjà minuscule.",
      "Cet écart ne réfute pas la proposition 3, qui dit ce que la famille peut atteindre et non ce qu'un entraînement atteint. Les deux modèles partent d'un point différent et se corrigent sur des nombres différents, si bien qu'ils ne s'arrêtent pas au même endroit de la même famille.",
      "La dernière ligne note $\\mathrm{W2}\\ @\\ \\mathrm{W1}$ le produit $W^{[2]}W^{[1]}$, et son rang vaut $10$ : le nombre annoncé par l'argument fautif est bien là, et il ne démontre toujours rien.",
    ],
  },
  {
    id: "b-r8-11",
    type: "verification",
    numero: 16,
    enonce: "La proposition 3 se généralise, et l'argument fautif se réfute.",
    questions: [
      "Écrire ce que devient la proposition 3 pour **trois** couches sans rien entre elles, $784\\rightarrow h_{1}\\rightarrow h_{2}\\rightarrow 10$, et donner les deux inclusions.",
      "Dire précisément pourquoi l'argument du rang ne prouve rien.",
      "La construction de la seconde inclusion demande-t-elle $h\\geq 10$ ? Que se passerait-il pour $h=5$ ?",
    ],
  },
];
