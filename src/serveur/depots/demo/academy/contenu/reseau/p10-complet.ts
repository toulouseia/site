import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 10 · Le réseau complet, et son compte
//
// L'architecture générale à L couches, l'écriture matricielle construite en
// cinq temps, la formule générale du compte donnée AVANT toute instanciation,
// puis instanciée quatre fois.
//
// L'ÉCART N°1 est signalé ici : h = 128 n'est pas justifié, et le cours le dit
// au lieu de fournir une raison après coup.
//
// Les comptes sortent de cours/lecon2/mesures.py, section 9, qui les recalcule
// au lieu de les recopier.
// ─────────────────────────────────────────────────────────────────────────────

export const P10_COMPLET: Bloc[] = [
  {
    id: "b-r10-1",
    type: "texte",
    texte:
      "Le réseau à ReLU de la page 9 lit les chiffres bien mieux que tout ce qui précède, et il reste à l'écrire en entier une bonne fois. Jusqu'ici chaque modèle a été posé à la main, un cas à la fois, avec ses dimensions écrites en clair. Peut-on écrire une seule fois la formule d'un réseau quelconque, puis compter d'un coup combien de nombres il faudrait régler ?",
  },
  {
    id: "b-r10-0f",
    type: "image",
    ancre: "le-reseau-entier",
    src: "/cours/lecon2/l2-fig20-le-reseau-entier.svg",
    largeur: 1380,
    hauteur: 700,
    alt: "À gauche, une grille carrée de vingt-huit sur vingt-huit pixels portant un sept manuscrit en encre sombre. Une flèche mène à trois colonnes de ronds vides, alignées de gauche à droite. La première montre quatre ronds séparés par trois points de suspension, et porte dessous le nombre sept cent quatre-vingt-quatre et la mention une par pixel. La deuxième est bâtie de même et porte dessous cent vingt-huit. La troisième montre ses dix ronds, et porte dessous le nombre dix et la mention une par chiffre. Chaque rond d'une colonne est relié par un filet gris pâle à tous les ronds de la colonne suivante. Le huitième rond de la dernière colonne est plein, en brique ; une flèche en part et mène à un grand chiffre sept en brique, sous lequel se lit le chiffre lu.",
    legende:
      "La même image qu'à la page 1. Cette page-ci nomme chacun de ses traits.",
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 10.1 · L'architecture générale
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r10-2",
    type: "titre",
    niveau: 2,
    texte: "L'architecture générale",
  },
  {
    id: "b-r10-3",
    type: "formule",
    ancre: "architecture",
    latex:
      "L\\in\\mathbb{N}^{*},\\ L\\geq 2,\\qquad d_{0}=784,\\quad d_{L}=10,\\quad d_{l}\\in\\mathbb{N}^{*}\\ \\text{ pour } l\\in[\\![1,L-1]\\!]",
    alt: "L est un entier naturel non nul supérieur ou égal à deux. La dimension d indice zéro vaut sept cent quatre-vingt-quatre, la dimension d indice L vaut dix, et les dimensions intermédiaires d indice l sont des entiers naturels non nuls pour l entre un et L moins un.",
    numero: "10.1",
    legende:
      "$L$ est le nombre d'**étapes de calcul**, l'entrée non comptée, et $d_{l}$ le nombre de neurones de l'étape $l$. Les étapes $1$ à $L-1$ s'appellent les **couches cachées**, parce que rien n'entre ni ne sort du réseau chez elles.\n\n$d_{0}$ et $d_{L}$ sont imposés par la tâche, $784$ pixels en entrée et $10$ classes en sortie, quand les $d_{l}$ intermédiaires sont **choisis**. Le réseau de la page 9 est le cas $L=2$ avec $d_{1}=h=128$.\n\nOn demande $L\\geq 2$ parce qu'il faut deux étapes pour qu'une activation ait un entre-deux où se glisser. Le modèle de la page 6 est le cas $L=1$, que $(10.1)$ écarte pour cette raison. $(10.2)$ le décrirait sans peine, la ligne $\\mathrm{ReLU}$ y devenant vide, et le compte $(10.3)$ s'y applique tel quel : le tableau plus bas l'instancie.",
  },
  {
    id: "b-r10-4",
    type: "formule",
    ancre: "propagation",
    latex:
      "\\begin{aligned}\\mathbf{a}^{[0]}&=\\mathbf{x}\\in[0,1]^{784}\\\\ \\mathbf{z}^{[l]}&=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}\\in\\mathbb{R}^{d_{l}} && l\\in[\\![1,L]\\!]\\\\ \\mathbf{a}^{[l]}&=\\mathrm{ReLU}\\big(\\mathbf{z}^{[l]}\\big)\\in\\mathbb{R}_{\\geq 0}^{d_{l}} && l\\in[\\![1,L-1]\\!]\\\\ \\mathbf{a}^{[L]}&=\\mathrm{softmax}\\big(\\mathbf{z}^{[L]}\\big)\\in\\Delta^{\\circ}_{d_{L}-1}\\end{aligned}",
    alt: "L'activation de la couche zéro est x, dans l'espace à sept cent quatre-vingt-quatre dimensions. Pour l entre un et L, la préactivation de la couche l vaut W exposant l entre crochets appliqué à l'activation de la couche précédente, plus le biais de la couche l ; elle vit dans l'espace à d l dimensions. Pour l entre un et L moins un, l'activation de la couche l est ReLU de sa préactivation, et vit dans l'ensemble des vecteurs à d l coordonnées positives ou nulles. L'activation de la dernière couche est le softmax de sa préactivation, et vit dans le simplexe ouvert de dimension d L moins un.",
    numero: "10.2",
    legende:
      "$W^{[l]}\\in\\mathcal{M}_{d_{l},d_{l-1}}(\\mathbb{R})$ et $\\mathbf{b}^{[l]}\\in\\mathbb{R}^{d_{l}}$. L'exposant entre crochets désigne une **couche** : ce n'est ni une puissance, ni un numéro d'exemple.",
  },
  {
    id: "b-r10-5f",
    type: "image",
    ancre: "notre-architecture",
    src: "/cours/lecon2/l2-fig10-architecture.svg",
    largeur: 1380,
    hauteur: 700,
    alt: "Trois colonnes de ronds, reliées par des faisceaux de filets gris très pâles où chaque rond d'une colonne rejoint tous les ronds de la suivante. La première colonne montre quatre ronds et trois points de suspension, sous une accolade cotée sept cent quatre-vingt-quatre, et porte le nom x. La deuxième est bâtie de même, cotée cent vingt-huit, et porte le nom a exposant un. La troisième montre ses dix ronds, étiquetés de zéro à neuf, sous une accolade cotée dix, et porte le nom a exposant deux. Au-dessus du premier faisceau : W exposant un appartient à l'ensemble des matrices à cent vingt-huit lignes et sept cent quatre-vingt-quatre colonnes, b exposant un est un vecteur de cent vingt-huit réels, et l'activation est ReLU. Au-dessus du second : W exposant deux appartient à l'ensemble des matrices à dix lignes et cent vingt-huit colonnes, b exposant deux est un vecteur de dix réels, et l'activation est le softmax. En pied, cent un mille sept cent soixante-dix paramètres, une précision de test de zéro virgule neuf huit un quatre, et cent quatre-vingt-six erreurs sur dix mille.",
    legende:
      "Les deux couches ne diffèrent que par leurs dimensions et leur fonction d'activation.",
  },

  {
    id: "b-r10-4b",
    type: "texte",
    texte:
      "Instancié en $784\\rightarrow 128\\rightarrow 10$ avec $\\mathrm{ReLU}$, c'est le réseau de la page 9. Entraîné avec le même protocole que les précédents et un pas $\\eta=0{,}5$, il atteint $0{,}9814$ de précision de test, soit $186$ erreurs sur $10\\,000$, et c'est le chiffre qui manquait depuis la page 7 : le plafond de $0{,}9193$ n'était pas celui de la tâche, mais celui d'une famille de fonctions.",
  },
  {
    id: "b-r10-5",
    type: "tableau",
    ancre: "dimensions-l2",
    titre: "Les dimensions vérifiées, ligne à ligne, pour $784\\rightarrow 128\\rightarrow 10$",
    cleEnTete: true,
    entetes: ["Ligne", "Produit", "Résultat"],
    lignes: [
      ["$\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{a}^{[0]}+\\mathbf{b}^{[1]}$", "$(128\\times 784)(784\\times 1)+(128\\times 1)$", "$128\\times 1$"],
      ["$\\mathbf{a}^{[1]}=\\mathrm{ReLU}(\\mathbf{z}^{[1]})$", "composante par composante, $(9.2)$", "$128\\times 1$"],
      ["$\\mathbf{z}^{[2]}=W^{[2]}\\mathbf{a}^{[1]}+\\mathbf{b}^{[2]}$", "$(10\\times 128)(128\\times 1)+(10\\times 1)$", "$10\\times 1$"],
      ["$\\mathbf{a}^{[2]}=\\mathrm{softmax}(\\mathbf{z}^{[2]})$", "$\\mathbb{R}^{10}\\rightarrow\\Delta^{\\circ}_{9}$, $(6.3)$", "$10\\times 1$"],
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 10.2 · L'écriture matricielle, construite
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r10-6",
    type: "titre",
    niveau: 2,
    texte: "D'où vient l'écriture matricielle",
  },
  {
    id: "b-r10-7",
    type: "texte",
    texte:
      "$(10.2)$ tient en quatre lignes, mais elle n'est pas tombée d'un coup. Elle se construit en cinq temps à partir de $(4.1)$, la préactivation d'**un** neurone, et chaque temps est un rangement, pas un calcul nouveau.",
  },
  {
    id: "b-r10-8",
    type: "tableau",
    ancre: "cinq-temps",
    titre: "Les cinq temps",
    cleEnTete: true,
    entetes: ["Temps", "Ce qu'on range", "Ce qu'on obtient"],
    lignes: [
      [
        "1",
        "Les $d_{l-1}$ activations de la couche précédente, empilées",
        "$\\mathbf{a}^{[l-1]}\\in\\mathbb{R}^{d_{l-1}}$, vecteur colonne",
      ],
      [
        "2",
        "Les $d_{l-1}$ poids du neurone $j$, mis en **ligne**",
        "$\\big(\\mathbf{w}^{[l]}_{j}\\big)^{\\mathsf{T}}$, de dimension $1\\times d_{l-1}$",
      ],
      [
        "3",
        "Les $d_{l}$ lignes empilées les unes sous les autres",
        "$W^{[l]}\\in\\mathcal{M}_{d_{l},d_{l-1}}(\\mathbb{R})$",
      ],
      [
        "4",
        "Le produit $W^{[l]}\\mathbf{a}^{[l-1]}$",
        "$(d_{l}\\times d_{l-1})(d_{l-1}\\times 1)=d_{l}\\times 1$ : les $d_{l}$ sommes pondérées, toutes ensemble",
      ],
      [
        "5",
        "Les $d_{l}$ biais, puis l'activation",
        "$\\mathbf{z}^{[l]}=W^{[l]}\\mathbf{a}^{[l-1]}+\\mathbf{b}^{[l]}$, puis $\\mathbf{a}^{[l]}=\\mathrm{ReLU}(\\mathbf{z}^{[l]})$",
      ],
    ],
    legende:
      "Le temps 4 est le seul qui mérite un regard : la coordonnée $j$ du produit est $\\sum_{k} W^{[l]}_{jk}a^{[l-1]}_{k}$, c'est-à-dire exactement $(4.1)$ écrite pour le neurone $j$.",
  },
  {
    id: "b-r10-8f",
    type: "image",
    ancre: "cinq-temps-dessines",
    src: "/cours/lecon2/l2-fig11-matricielle.svg",
    largeur: 1380,
    hauteur: 500,
    alt: "Cinq panneaux, de gauche à droite, reliés par de petites flèches. Le premier, un neurone, montre un rectangle plat coté un sur sept cent quatre-vingt-quatre pour w transposée, un rectangle haut et étroit coté sept cent quatre-vingt-quatre sur un pour x, un carré pour b, et un carré de brique pour z. Le deuxième, cent vingt-huit neurones, empile quatre rectangles plats, chacun portant w indice j transposée x plus b indice j, avec des points de suspension avant le dernier, sous une accolade cotée cent vingt-huit. Le troisième montre un bloc rectangulaire unique, W exposant un, coté cent vingt-huit sur sept cent quatre-vingt-quatre, barré de quelques traits horizontaux pâles qui rappellent les lignes empilées. Le quatrième écrit z exposant un égale W exposant un fois x plus b exposant un, chaque facteur dessiné à sa forme et coté, et note dessous que a exposant un est le ReLU de z exposant un. Le cinquième écrit de même z exposant deux égale W exposant deux fois a exposant un plus b exposant deux, avec les dimensions dix sur cent vingt-huit puis cent vingt-huit sur un, et note que a exposant deux est le softmax de z exposant deux.",
    legende:
      "Le produit final est exactement $128$ fois la ligne $(4.1)$, écrite une seule fois. L'exemple est écrit en colonne ; le calcul par lots les empile en lignes, et $W$ passe à droite, transposée.",
  },
  {
    id: "b-r10-9b",
    type: "encart",
    ton: "note",
    ancre: "tenseur",
    titre: "Ce que devient cette ligne sur plusieurs images",
    texte:
      "En pratique on ne donne pas les images une par une, mais par paquets de $B$, qu'on appelle des **lots**. Les $B$ vecteurs s'empilent alors en lignes dans une matrice $A^{[l-1]}$ à $B$ lignes et $d_{l-1}$ colonnes, et $(10.2)$ se transpose en bloc : $Z^{[l]}=A^{[l-1]}\\big(W^{[l]}\\big)^{\\mathsf{T}}+\\mathbf{1}_{B}\\big(\\mathbf{b}^{[l]}\\big)^{\\mathsf{T}}$, où $\\mathbf{1}_{B}$ est la colonne de $B$ uns qui recopie le même biais sur toutes les lignes.\n\nLes dimensions se vérifient : $(B\\times d_{l-1})(d_{l-1}\\times d_{l})=B\\times d_{l}$, et $Z^{[l]}$ a bien une ligne par exemple. C'est la seule transposition mentale du chapitre, le formalisme écrivant $\\mathbf{x}$ en colonne quand le calcul par lots empile les exemples en lignes, et rien du calcul lui-même n'a changé.",
  },
  {
    id: "b-r10-10",
    type: "texte",
    texte:
      "Cette écriture n'est pas seulement plus courte que $128$ sommes écrites l'une après l'autre. Les bibliothèques de calcul et le matériel spécialisé sont optimisés pour **une** opération, le produit de matrices : une part de ce qu'on appelle une nouvelle architecture matérielle pour l'IA est un produit matriciel plus rapide. Écrire le réseau sous cette forme n'est donc pas un choix de notation, c'est le choix de l'opération qui sera effectivement exécutée.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10.3 · Le compte
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r10-11",
    type: "titre",
    niveau: 2,
    texte: "Le compte des paramètres",
  },
  {
    id: "b-r10-12",
    type: "formule",
    ancre: "compte-general",
    latex:
      "p=\\sum_{l=1}^{L}\\Big(\\underbrace{d_{l}\\,d_{l-1}}_{W^{[l]}}+\\underbrace{d_{l}}_{\\mathbf{b}^{[l]}}\\Big)",
    alt: "Le nombre total de paramètres p vaut la somme, pour l allant de un à L, de d l fois d l moins un, qui compte les coefficients de la matrice de la couche l, plus d l, qui compte les coefficients de son vecteur de biais.",
    numero: "10.3",
    legende:
      "La formule vient de $(10.1)$ et $(10.2)$ seules : une matrice $d_{l}\\times d_{l-1}$ a $d_{l}d_{l-1}$ coefficients, un vecteur de $\\mathbb{R}^{d_{l}}$ en a $d_{l}$.",
  },
  {
    id: "b-r10-13",
    type: "sortie",
    ancre: "comptes",
    titre:
      "La formule instanciée quatre fois · cours/lecon2/mesures.py, section 9",
    texte:
      "    p = somme sur l de ( d_l * d_{l-1} + d_l )\n\n    architecture                 detail                          p\n    784 -> 10                    10x784+10                        7850\n    784 -> 128 -> 10             128x784+128 + 10x128+10        101770\n                                 part dans la premiere matrice    98.6 %\n    784 -> 16 -> 16 -> 10        16x784+16 + 16x16+16 + 10x16+10    13002\n                                 part dans la premiere matrice    96.5 %\n    784 -> 32 -> 32 -> 32 -> 10  32x784+32 + 32x32+32 + 32x32+32 + 10x32+10    27562\n                                 part dans la premiere matrice    91.0 %",
    lecture: [
      "$101\\,770=100\\,352+128+1\\,280+10$. Le programme recalcule ce total en parcourant $\\boldsymbol{\\theta}$, et le compare au compte écrit à la main : les deux concordent.",
      "**$98{,}6\\,\\%$ des paramètres sont dans $W^{[1]}$**, la matrice qui touche les pixels. La couche de sortie, celle qui décide, en porte $1{,}3\\,\\%$.",
      "$784\\rightarrow 16\\rightarrow 16\\rightarrow 10$ donne $13\\,002$ : c'est l'architecture dont la page 11 mesure la précision.",
      "La part de la première matrice descend le long du tableau, de $98{,}6\\,\\%$ à $96{,}5\\,\\%$ puis $91{,}0\\,\\%$ : plus les couches suivantes portent de coefficients, moins celle qui touche les pixels pèse dans le total.",
    ],
  },
  {
    id: "b-r10-13f",
    type: "image",
    ancre: "ou-sont-les-parametres",
    src: "/cours/lecon2/l2-fig12-parametres.svg",
    largeur: 1380,
    hauteur: 580,
    alt: "Une longue barre horizontale partagée en quatre segments, presque entièrement occupée par un segment noir qui porte la mention quatre-vingt-dix-huit virgule six pour cent ; les trois autres segments se réduisent à un liseré à son extrémité droite. Une seconde barre, dessous, reprend ce liseré seul et l'étale sur toute la largeur : les mille quatre cent dix-huit coefficients restants s'y partagent en un segment gris pour b exposant un, un long segment de brique pour W exposant deux, et un mince segment pour b exposant deux. Un trait en pointillé relie les deux barres. Sous elles, une table donne pour chaque bloc ses dimensions, son nombre de coefficients et sa part : W exposant un, cent vingt-huit sur sept cent quatre-vingt-quatre, cent mille trois cent cinquante-deux coefficients, quatre-vingt-dix-huit virgule six pour cent ; b exposant un, cent vingt-huit coefficients, zéro virgule un pour cent ; W exposant deux, dix sur cent vingt-huit, mille deux cent quatre-vingts coefficients, un virgule trois pour cent ; b exposant deux, dix coefficients, zéro virgule zéro pour cent. La dernière ligne totalise cent mille trois cent cinquante-deux plus cent vingt-huit plus mille deux cent quatre-vingts plus dix, soit cent un mille sept cent soixante-dix.",
    legende:
      "Un réseau se compte par ses matrices : les deux vecteurs de biais n'en font que $138$.",
  },
  {
    id: "b-r10-14",
    type: "encart",
    ton: "attention",
    titre: "$h=128$ n'est justifié par rien",
    texte:
      "Ni le nombre de couches cachées, ni leur taille ne sont dérivés dans ce chapitre. $h=128$ a été **posé**, et $L=2$ aussi. Ce ne sont pas des valeurs optimales, et rien ici ne dit comment on les choisirait : la page 11 mesure d'ailleurs une architecture à deux couches cachées de $16$ neurones, qui fait moins bien, sans que cette page puisse dire pourquoi. **Dette, chapitre 3.**",
  },
  {
    id: "b-r10-15",
    type: "verification",
    numero: 19,
    enonce: "La formule générale s'applique sans énumérer les couches.",
    questions: [
      "Donner $p$ pour l'architecture $784\\rightarrow 32\\rightarrow 32\\rightarrow 32\\rightarrow 10$, en appliquant $(10.3)$.",
      "Quelle part de ce total est dans la première matrice ?",
      "Pour une architecture $784\\rightarrow d_{1}\\rightarrow 10$, montrer que la première matrice porte plus de la moitié des paramètres quel que soit $d_{1}$, et dire vers quelle part elle tend quand $d_{1}$ grandit.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10.4 · Régler à la main, et la boîte noire
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-r10-16",
    type: "titre",
    niveau: 2,
    texte: "Régler ces nombres à la main",
  },
  {
    id: "b-r10-17",
    type: "texte",
    texte:
      "La page 5 a construit un neurone entièrement à la main, avec ses $171$ coefficients non nuls posés en trois lignes, quand le réseau complet en compte $101\\,770$. En décidant d'un nombre par seconde et sans jamais s'arrêter, il faudrait **$28{,}3$ heures** pour tous les poser.\n\nEncore faudrait-il savoir quelle valeur donner à chacun, ce que personne ne sait faire au-delà de quelques neurones dont on a dessiné le motif soi-même.",
  },
  {
    id: "b-r10-18",
    type: "texte",
    texte:
      "Que personne ne les ait écrits est aussi la raison de ne pas traiter le réseau comme une boîte noire : personne ne sait ce que ces $101\\,770$ nombres contiennent, et la seule façon de le savoir est de les **regarder**, comme la page 4 a regardé un gabarit. La page 11 le fait sur la couche cachée, et ce qu'elle trouve n'est pas ce qu'on attendait.",
  },
  {
    id: "b-r10-20",
    type: "formule",
    ancre: "f-theta",
    latex:
      "f_{\\boldsymbol{\\theta}}:\\mathbb{R}^{784}\\rightarrow\\Delta^{\\circ}_{9},\\qquad \\boldsymbol{\\theta}\\in\\mathbb{R}^{101\\,770}",
    alt: "La fonction f indicée par thêta va de l'espace à sept cent quatre-vingt-quatre dimensions vers le simplexe ouvert de dimension neuf. Le paramètre thêta vit dans l'espace à cent un mille sept cent soixante-dix dimensions.",
    numero: "10.4",
    legende:
      "Tout ce chapitre n'a fait que **décrire** cette fonction : ses ensembles, sa forme, ses paramètres, et ce qu'elle peut ou ne peut pas séparer. Il n'a rien dit de la façon dont $\\boldsymbol{\\theta}$ est choisi.",
  },
];
