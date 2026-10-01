import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 3 · Un seul exemple, et ce que sa sortie réclame
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig03-exemple`, l'image sur laquelle tout le reste se joue.
//
// « SOUHAITE » EST TRADUIT AVANT SON PREMIER EMPLOI, et non trois sections plus
// bas. Aucun des quatre verbes de la famille — souhaite, demande, réclame,
// veut — n'est employé dans le corps du cours avant l'encart qui les traduit,
// et les pages 1 et 2 n'en portent aucun.
//
// C'est ici que se posent les trois choses dont tout le reste dépend :
//   · le signal d'erreur delta, et POURQUOI on dérive par rapport à z ;
//   · les deux formes de la règle de la chaîne, ADMISES, avec leur encadré de
//     dette et le nom de l'outil manquant ;
//   · la traduction du mot « souhaite », une fois pour tout le chapitre.
//
// Propositions 1 et 2, démontrées. Mesure 1, reproduite verbatim.
// La nuance sur le classement correct par accident n'est pas escamotée.
// ─────────────────────────────────────────────────────────────────────────────

export const R03_RECLAME: Bloc[] = [
  {
    id: "b-rp3-0",
    type: "texte",
    texte:
      "Tout ce qui suit se joue sur une seule image, et il faut la choisir sans tricher. Le réseau ne l'a jamais vue et il n'a rien appris de personne, mais il va tout de même rendre ses dix nombres. Que lit-on sur ces dix nombres, et sur lesquels peut-on agir ?",
  },
  {
    id: "b-rp3-3f",
    type: "image",
    ancre: "limage-de-travail",
    src: "/cours/lecon4/l4-fig03-exemple.svg",
    largeur: 1380,
    hauteur: 880,
    alt: "À gauche, l'image d'entraînement numéro cinq, un deux manuscrit noir et gris sur fond blanc, dessinée en cases pleines dans une grille de vingt-huit sur vingt-huit dont les bords sont cotés un et vingt-huit. À droite, un relevé : l'indice de l'exemple vaut cinq, l'étiquette deux, les pixels non nuls cent quatre-vingt-huit sur sept cent quatre-vingt-quatre, les neurones cachés allumés cinquante-sept sur cent vingt-huit et les éteints soixante et onze. Plus bas, le nombre de coefficients du gradient de la première matrice exactement nuls sur cette image : quatre-vingt-neuf mille six cent trente-six sur cent mille trois cent cinquante-deux, soit quatre-vingt-neuf virgule trente-deux pour cent. En pied, la mention réseau non entraîné, graine zéro.",
    legende:
      "L'exemple est désigné par un critère, jamais tiré au sort.",
  },
  {
    id: "b-rp3-3",
    type: "texte",
    texte:
      "C'est la **première image de classe $2$** du jeu d'entraînement, celle d'indice $n=5$, et le réseau qui la reçoit porte les poids de son initialisation, graine $0$.\n\nLe dernier chiffre du relevé se laisse déjà lire comme un indice : près de neuf dixièmes du gradient de la première matrice sont exactement nuls sur cette image.",
  },
  {
    id: "b-rp3-17",
    type: "encart",
    ton: "attention",
    titre: "« Souhaite », traduit une fois pour toutes",
    texte:
      "Ce chapitre dira qu'un neurone « souhaite monter », et la phrase est une **façon de parler d'une dérivée partielle strictement négative**, rien de plus. Un neurone ne souhaite rien : $\\partial\\ell/\\partial z<0$ signifie que la perte décroît quand $z$ croît, et c'est tout ce que le mot recouvre. La même traduction vaut pour « demande », « réclame » et « veut », et le mot ne recouvre jamais rien d'autre.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.1 · Un seul exemple, mesuré
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-rp3-25",
    type: "encart",
    ton: "rappel",
    titre: "Ce que les sorties de programme affichent",
    texte:
      "Les blocs de sortie donnent des valeurs **arrondies**, quatre ou six décimales selon la colonne, alors que les produits, les quotients et les sommes cités dans le texte sont calculés sur les valeurs non arrondies. Reposer une division avec les chiffres affichés ne redonne donc pas toujours le dernier chiffre annoncé, et l'écart vient de l'affichage, jamais du calcul.",
  },
  {
    id: "b-rp3-2",
    type: "titre",
    niveau: 2,
    texte: "Ce que le réseau répond",
  },
  {
    id: "b-rp3-4",
    type: "sortie",
    ancre: "mesure-1",
    titre: "L'exemple de travail · cours/lecon4/mesures.py, mesure 1",
    texte:
      "  critère            première image de classe 2 du jeu d'entraînement\n  indice retenu      n = 5\n  étiquette          c = 2\n\n  -- La sortie du réseau non entraîné --------------------------------------\n      k    a_k         delta_k\n      0    0.1366      +0.1366\n      1    0.1098      +0.1098\n      2    0.2445      -0.7555\n      3    0.0911      +0.0911\n      4    0.0796      +0.0796\n      5    0.1308      +0.1308\n      6    0.0478      +0.0478\n      7    0.0574      +0.0574\n      8    0.0563      +0.0563\n      9    0.0462      +0.0462\n\n  perte de cet exemple            1.408379\n  perte du hasard, ln 10          2.302585\n  classe prédite                  2\n  la plus grande activation       0.2445   (classe 2)\n\n  -- La couche cachée ------------------------------------------------------\n  neurones cachés allumés         57 sur 128\n  neurones cachés éteints         71 sur 128\n  pixels non nuls de l'image      188 sur 784",
    lecture: [
      "Les dix activations **viennent d'un tirage**, et l'ordre dans lequel elles tombent n'apprend rien sur l'image : c'est exactement ce qu'on attend d'un réseau non entraîné.",
      "**La plus grande est pourtant celle de la classe $2$**, à $0{,}2445$ : ce réseau, qui ne sait rien, classe cette image correctement, par accident, et sa perte de $1{,}408$ est même meilleure que celle du hasard, $\\ln 10=2{,}303$.",
      "Un réseau non entraîné ne se trompe pas systématiquement ; il répond n'importe quoi, et n'importe quoi tombe juste environ une fois sur dix. La mesure 4 donne la précision de ce réseau sur le jeu de test avant ses deux cents pas : $0{,}1314$.",
      "$57$ neurones cachés sur $128$ sont allumés, et ce nombre n'est pas anodin : les $71$ autres sont éteints, et un neurone éteint ne fait rien passer, ni à l'aller ni au retour.",
    ],
  },
  {
    id: "b-rp3-4f",
    type: "image",
    ancre: "sortie-a-jeter",
    src: "/cours/lecon4/l4-fig04-sortie.svg",
    largeur: 1380,
    hauteur: 800,
    alt: "Dix barres verticales, une par classe, numérotées de zéro à neuf et toutes de hauteurs voisines. La plus haute, celle de la classe deux, est en brique et porte sa valeur, zéro virgule deux quatre quatre cinq ; les neuf autres sont grises et ne portent pas de valeur. Une ligne en pointillé marque la hauteur zéro virgule un, celle de dix classes équiprobables. En pied, la perte de cet exemple, un virgule quatre cent huit mille trois cent soixante-dix-neuf, est comparée à celle du hasard, deux virgule trois cent deux mille cinq cent quatre-vingt-cinq, et deux mentions disent que la plus haute est la classe deux et que c'est la bonne, par accident.",
    legende:
      "Un réseau non entraîné ne se trompe pas systématiquement : il répond n'importe quoi, et n'importe quoi tombe juste une fois sur dix.",
  },
  {
    id: "b-rp3-5",
    type: "animation",
    ancre: "image-cinq-traverse",
    animationId: "limage-cinq-traverse-le-reseau",
    legende:
      "L'image n° 5, de classe $2$, traverse le réseau non entraîné : les dix sorties s'allument à leur valeur mesurée.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.2 · Le signal d'erreur
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-rp3-6",
    type: "titre",
    niveau: 2,
    texte: "Le signal d'erreur, et pourquoi il dérive par rapport à $\\mathbf{z}$",
  },
  {
    id: "b-rp3-7",
    type: "definition",
    terme: "Signal d'erreur d'une couche",
    anglais: "error signal, delta",
    texte:
      "$\\boldsymbol{\\delta}^{[l]}:=\\mathrm{grad}_{\\mathbf{z}^{[l]}}\\,\\ell\\in\\mathbb{R}^{d_{l}}$, vecteur **colonne** de même dimension que $\\mathbf{z}^{[l]}$. Sa $k$-ième composante est $\\partial\\ell/\\partial z_{k}^{[l]}$, un scalaire. Il y a un signal d'erreur par couche : $\\boldsymbol{\\delta}^{[2]}\\in\\mathbb{R}^{10}$, $\\boldsymbol{\\delta}^{[1]}\\in\\mathbb{R}^{128}$.",
  },
  {
    id: "b-rp3-8",
    type: "texte",
    texte:
      "On dérive par rapport à $\\mathbf{z}^{[l]}$ et non par rapport à $\\mathbf{a}^{[l]}$ parce que $\\mathbf{z}^{[l]}$ est **l'endroit où les paramètres entrent** : $\\mathbf{z}^{[l]}=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}$. Une fois $\\boldsymbol{\\delta}^{[l]}$ connu, les gradients de $W^{[l]}$ et de $\\mathbf{b}^{[l]}$ s'en déduisent sans autre calcul.",
  },
  {
    id: "b-rp3-24",
    type: "texte",
    texte:
      "Ce que $\\boldsymbol{\\delta}^{[2]}$ demande porte sur $\\mathbf{z}^{[2]}$, et $\\mathbf{z}^{[2]}$ n'est pas modifiable, puisque c'est une valeur calculée. **Les seules quantités qu'on puisse modifier sont les poids et les biais** : l'image est une donnée, et les activations sont des résultats.",
  },
  {
    id: "b-rp3-9",
    type: "formule",
    ancre: "delta-de-sortie",
    latex:
      "\\boldsymbol{\\delta}^{[2]}=\\mathrm{grad}_{\\mathbf{z}^{[2]}}\\,\\ell=\\mathbf{a}^{[2]}-\\mathbf{y}\\ \\in\\mathbb{R}^{10},\\qquad \\mathbf{y}=\\mathrm{onehot}(c)",
    alt: "Delta exposant deux entre crochets est le gradient de la perte par rapport à z de la couche deux, et il vaut a de la couche deux moins y, un vecteur de dix composantes, où y est le vecteur indicateur de la classe c.",
    numero: "4.2",
    legende:
      "Le chapitre 2, page 6, pose le softmax et la perte d'entropie croisée, et n'en dérive aucun gradient. Cette identité est donc **admise**, comme la règle de la chaîne, et la mesure 2 confronte l'algorithme entier aux différences finies.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.3 · La règle de la chaîne, admise
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-rp3-10",
    type: "titre",
    niveau: 2,
    texte: "Les deux formes de la règle de la chaîne",
  },
  {
    id: "b-rp3-11",
    type: "formule",
    ancre: "chaine-simple",
    latex:
      "g:\\mathbb{R}\\rightarrow\\mathbb{R},\\ f:\\mathbb{R}\\rightarrow\\mathbb{R}\\ \\text{dérivables}\\quad\\Longrightarrow\\quad (f\\circ g)'(t)=f'\\big(g(t)\\big)\\cdot g'(t)",
    alt: "Si g de R dans R et f de R dans R sont dérivables, alors la dérivée de f rond g en t vaut f prime de g de t multiplié par g prime de t.",
    numero: "4.3",
  },
  {
    id: "b-rp3-12",
    type: "formule",
    ancre: "chaine-plusieurs-chemins",
    latex:
      "u\\ \\text{influence}\\ C\\ \\text{à travers}\\ v_{1},\\ldots,v_{m}\\quad\\Longrightarrow\\quad \\frac{\\partial C}{\\partial u}=\\sum_{k=1}^{m}\\frac{\\partial C}{\\partial v_{k}}\\,\\frac{\\partial v_{k}}{\\partial u}",
    alt: "Si une quantité u influence C à travers v un jusqu'à v m, alors la dérivée partielle de C par rapport à u est la somme, pour k allant de un à m, du produit de la dérivée partielle de C par rapport à v k par la dérivée partielle de v k par rapport à u.",
    numero: "4.4",
    legende:
      "Un biais influence la perte par un seul chemin, une activation cachée par dix.",
  },
  {
    id: "b-rp3-13",
    type: "texte",
    texte:
      "On **somme** dans la seconde forme parce que chaque chemin d'influence apporte sa contribution au premier ordre, et que des contributions au premier ordre s'ajoutent. Ce n'est pas une commodité de calcul.",
  },
  {
    id: "b-rp3-14",
    type: "encart",
    ton: "attention",
    titre: "Ces deux énoncés sont admis",
    texte:
      "Leur preuve demande le contrôle du terme $o(s)$ de l'approximation au premier ordre $f(t+s)=f(t)+sf'(t)+o(s)$ dans une composition, et c'est cet outil-là, et non l'approximation elle-même, que le parcours pose dans son **bloc de mathématiques**. Il **vérifie** en revanche numériquement toutes les identités qu'il en tire, et la mesure 2 confronte $160$ dérivées aux différences finies centrées pour un écart relatif maximal de $7{,}0\\cdot 10^{-9}$. Une vérification n'est pas une preuve, et le chapitre dit exactement ce qu'elle établit et ce qu'elle n'établit pas.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.4 · Proposition 1
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-rp3-15",
    type: "titre",
    niveau: 2,
    texte: "Une seule composante est négative",
  },
  {
    id: "b-rp3-16",
    type: "derivation",
    ancre: "proposition-1",
    titre:
      "Seule la composante de la vraie classe est strictement négative (proposition 1)",
    hypotheses: [
      "$\\mathbf{a}^{[2]}=\\mathrm{softmax}(\\mathbf{z}^{[2]})\\in\\Delta^{\\circ}_{9}$, l'intérieur du simplexe : $0<a_{k}<1$ pour tout $k$, et $\\sum_{k}a_{k}=1$.",
      "$\\mathbf{y}=\\mathrm{onehot}(c)$ : $y_{c}=1$ et $y_{k}=0$ pour $k\\neq c$.",
      "$\\boldsymbol{\\delta}^{[2]}=\\mathbf{a}^{[2]}-\\mathbf{y}$, formule (4.2), admise.",
    ],
    proprietes: [
      "L'image de $\\mathrm{softmax}$ est incluse dans l'intérieur du simplexe : aucune coordonnée n'atteint $0$ ni $1$",
      "Soustraction composante par composante",
    ],
    etapes: [
      {
        texte:
          "**La composante de la vraie classe.** $\\delta_{c}=a_{c}-y_{c}=a_{c}-1$, et $a_{c}<1$ strictement, donc $\\delta_{c}<0$.",
      },
      {
        texte:
          "**Les neuf autres.** Pour $k\\neq c$, $\\delta_{k}=a_{k}-0=a_{k}$, et $a_{k}>0$ strictement, donc $\\delta_{k}>0$.",
      },
      {
        latex:
          "\\delta_{c}=a_{c}-1<0\\qquad\\text{et}\\qquad \\delta_{k}=a_{k}>0\\quad\\text{pour tout }k\\neq c",
        alt: "Delta indice c vaut a indice c moins un, qui est strictement négatif, et delta indice k vaut a indice k, strictement positif, pour tout k différent de c.",
        justification:
          "Les deux inégalités sont strictes parce que le softmax n'atteint jamais les bords du simplexe.",
      },
    ],
    resultat: {
      latex:
        "\\#\\{k\\ :\\ \\delta_{k}<0\\}=1,\\qquad \\#\\{k\\ :\\ \\delta_{k}>0\\}=9",
      alt: "Le nombre d'indices k pour lesquels delta k est négatif vaut exactement un, et le nombre d'indices pour lesquels delta k est positif vaut exactement neuf.",
    },
    interpretation:
      "$\\delta_{c}=\\partial\\ell/\\partial z_{c}<0$ signifie qu'**augmenter $z_{c}$ fait baisser la perte**, et pour les neuf autres $\\partial\\ell/\\partial z_{k}>0$ signifie que les baisser la fait baisser aussi. C'est cela, et rien d'autre, que veut dire « le neurone de la bonne classe doit monter et les neuf autres descendre ».",
    limites: [
      "L'énoncé porte sur les **signes** et non sur les tailles : il ne dit pas de combien pousser, et il ne dit rien de ce qui arrive après un pas.",
      "Il vaut pour la sortie d'un softmax avec entropie croisée, et avec un autre coût le point de départ change, la proposition avec lui.",
    ],
  },
  {
    id: "b-rp3-16f",
    type: "image",
    ancre: "delta-en-barres",
    src: "/cours/lecon4/l4-fig05-delta.svg",
    largeur: 1380,
    hauteur: 800,
    alt: "Dix barres verticales de part et d'autre d'un axe horizontal marqué zéro, une par classe, numérotées de zéro à neuf sous le cadre. Neuf montent au-dessus de l'axe, en brique. Une seule descend sous l'axe, en ardoise, bien plus longue que les autres : celle de la classe deux. À droite du cadre, deux mentions : un delta positif fait descendre l'activation, un delta négatif la fait monter. En pied, la valeur de la composante négative, moins zéro virgule sept cent cinquante-cinq mille quatre cent soixante et un, et la mention que sa valeur absolue égale la somme des neuf autres.",
    legende:
      "La vraie classe pèse exactement autant que les neuf autres réunies.",
  },
  {
    id: "b-rp3-18",
    type: "animation",
    ancre: "ce-que-la-sortie-reclame",
    animationId: "ce-que-la-sortie-reclame",
    legende:
      "Le signal d'erreur de sortie en dix barres signées, neuf vers le haut et une vers le bas, à l'échelle mesurée.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3.5 · Proposition 2
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-rp3-19",
    type: "titre",
    niveau: 2,
    texte: "La somme est nulle, et la vraie classe pèse autant que les neuf autres",
  },
  {
    id: "b-rp3-20",
    type: "derivation",
    ancre: "proposition-2",
    titre:
      "La somme des dix composantes est nulle, et $|\\delta_{c}|=\\sum_{k\\neq c}|\\delta_{k}|$ (proposition 2)",
    hypotheses: [
      "Les hypothèses de la proposition 1.",
      "$\\sum_{k}a_{k}=1$ et $\\sum_{k}y_{k}=1$.",
    ],
    proprietes: [
      "Linéarité de la somme",
      "Proposition 1 : $\\delta_{k}>0$ pour $k\\neq c$, donc $|\\delta_{k}|=\\delta_{k}$",
    ],
    etapes: [
      {
        latex:
          "\\sum_{k=0}^{9}\\delta_{k}=\\sum_{k=0}^{9}a_{k}-\\sum_{k=0}^{9}y_{k}=1-1=0",
        alt: "La somme des delta k pour k allant de zéro à neuf vaut la somme des a k moins la somme des y k, soit un moins un, soit zéro.",
        justification:
          "Les deux vecteurs sont des lois de probabilité sur dix classes : leurs coordonnées somment à un.",
      },
      {
        texte:
          "**On isole la composante de la vraie classe.** De $\\delta_{c}+\\sum_{k\\neq c}\\delta_{k}=0$ on tire $-\\delta_{c}=\\sum_{k\\neq c}\\delta_{k}$.",
      },
      {
        texte:
          "Par la proposition 1, $\\delta_{c}<0$ donc $-\\delta_{c}=|\\delta_{c}|$, et $\\delta_{k}>0$ donc $\\delta_{k}=|\\delta_{k}|$ pour $k\\neq c$.",
      },
      {
        latex:
          "|\\delta_{c}|=1-a_{c}=\\sum_{k\\neq c}a_{k}=\\sum_{k\\neq c}|\\delta_{k}|",
        alt: "La valeur absolue de delta indice c vaut un moins a indice c, qui vaut la somme des a k pour k différent de c, qui vaut la somme des valeurs absolues des delta k pour k différent de c.",
      },
    ],
    resultat: {
      latex:
        "\\sum_{k}\\delta_{k}=0\\qquad\\text{et}\\qquad |\\delta_{c}|=1-a_{c}=\\sum_{k\\neq c}|\\delta_{k}|",
      alt: "La somme des delta k vaut zéro, et la valeur absolue de delta c vaut un moins a c, qui égale la somme des valeurs absolues des neuf autres composantes.",
    },
    interpretation:
      "La correction portée sur le neurone de la vraie classe pèse **exactement autant** que les neuf autres réunies, et $|\\delta_{c}|=1-a_{c}$ : plus le réseau se trompe, plus $a_{c}$ est petit, plus cette correction est grande. C'est le sens précis qu'il faut donner à l'idée que les corrections sont proportionnelles à l'écart, où la proportionnalité porte sur $1-a_{c}$ et non sur une notion vague de distance.",
    limites: [
      "L'égalité porte sur les **valeurs absolues**, donc sur des tailles. Elle ne dit pas que la correction du neurone $c$ produit sur la perte autant d'effet que celle des neuf autres.",
    ],
  },
  {
    id: "b-rp3-21",
    type: "sortie",
    ancre: "controle-proposition-2",
    titre:
      "La proposition 2 sur les nombres mesurés · cours/lecon4/mesures.py, mesure 1",
    texte:
      "  -- Contrôle de la proposition 2 sur ces nombres --------------------------\n  somme des dix composantes       +8.327e-17\n  |delta_2|                       0.755461\n  somme des neuf autres           0.755461\n  écart entre les deux            1.110e-16",
    lecture: [
      "La somme des dix composantes vaut $8{,}3\\cdot 10^{-17}$, c'est-à-dire zéro à la précision machine, l'erreur d'arrondi d'une somme de dix flottants.",
      "$|\\delta_{2}|=0{,}755461$ et la somme des neuf autres vaut $0{,}755461$ à $1{,}1\\cdot 10^{-16}$ près, donc l'égalité de la proposition 2 est vérifiée jusqu'au dernier chiffre représentable.",
      "$|\\delta_{2}|=1-a_{2}=1-0{,}2445=0{,}7555$, qui est la lecture directe de la formule.",
    ],
  },
  {
    id: "b-rp3-23",
    type: "verification",
    numero: 35,
    enonce:
      "Les dix composantes de $\\boldsymbol{\\delta}^{[2]}$ sont données par la mesure 1 : $+0{,}1366$, $+0{,}1098$, $-0{,}7555$, $+0{,}0911$, $+0{,}0796$, $+0{,}1308$, $+0{,}0478$, $+0{,}0574$, $+0{,}0563$, $+0{,}0462$.",
    questions: [
      "Vérifier à la main que leur somme est nulle, et que $|\\delta_{2}|$ égale la somme des neuf autres, à l'arrondi de l'affichage près.",
      "Que vaudrait $|\\delta_{2}|$ si le réseau accordait $0{,}9$ à la classe $2$ ?",
      "Vers quelle valeur $|\\delta_{2}|$ tend-il quand $a_{2}$ s'approche de $1$, et la proposition 1 permet-elle de l'atteindre ?",
    ],
  },
];
