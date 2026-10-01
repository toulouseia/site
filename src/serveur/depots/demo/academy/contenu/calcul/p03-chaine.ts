import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 · page 3 · La règle de la chaîne, dans ses deux formes
//
// Ouverture règle 26 : la question des plusieurs chemins, puis
// l5-fig03-deux-chaines.svg (1380 × 760, une chaîne sans embranchement à côté d'une
// chaîne à plusieurs chemins), puis le cadre.
//
// Les deux énoncés, l'encadré de dette, et le critère qui dit laquelle
// s'applique. Puis le réseau minuscule, posé avec ses trois poids et ses trois
// biais comptés. Le dessin de ce réseau, l5-fig01-reseau.svg, est servi par la
// page 1 : règle 17, aucune figure ne paraît deux fois.
//
// La dette est traitée pour ce qu'elle est : l'EMPLOI de la règle est réglé
// ici, pas sa preuve. 🧪 n°49.
//
// L'entropie croisée binaire est un objet neuf, que les quatre chapitres
// précédents ne portent pas : elle a donc un bloc DEFINITION, sous (5.4), et
// non une légende de formule. Les pages 5 et 6 en dépendent entièrement.
// ─────────────────────────────────────────────────────────────────────────────

export const C03_CHAINE: Bloc[] = [
  {
    id: "b-cr3-0",
    type: "texte",
    texte:
      "Un poids de la première couche agit sur la perte en traversant tout le réseau, et rien ne dit d'avance qu'il n'y parvienne que par une seule route. Quand une quantité en influence une autre par plusieurs chemins à la fois, comment additionne-t-on leurs effets ?",
  },
  {
    id: "b-cr3-0f",
    type: "image",
    ancre: "les-deux-structures",
    src: "/cours/lecon5/l5-fig03-deux-chaines.svg",
    largeur: 1380,
    hauteur: 760,
    alt: "Deux schémas côte à côte, qui relient tous deux la même quantité de départ u au coût C. À gauche, une chaîne sans embranchement : trois ronds, u, puis v, puis C, reliés par deux flèches, et une seule route mène de l'un à l'autre. À droite, quatre flèches partent de u vers quatre ronds rangés en colonne, v indice un, v indice deux, v indice trois et v indice quatre, et de chacun de ces quatre ronds repart une flèche vers C, si bien que quatre routes distinctes vont de u à C et s'y rejoignent. Un trait de brique repasse sur les routes comptées, une seule à gauche, les quatre à droite.",
    legende:
      "La forme à plusieurs chemins couvre les deux dessins ; la forme simple ne couvre que celui de gauche, où la somme n'a qu'un terme.",
  },
  {
    id: "b-cr3-0c",
    type: "texte",
    texte:
      "La règle de la chaîne répond aux deux cas sous deux formes : un produit de dérivées quand la route est unique, une somme de tels produits quand il y en a plusieurs. Savoir laquelle employer ne demande pas de regarder les fonctions posées le long des routes, mais seulement la structure des dépendances, et celle du réseau à un neurone par couche se pose ici avec ses six paramètres.",
  },
  {
    id: "b-cr3-1",
    type: "titre",
    niveau: 2,
    texte: "La forme simple",
  },
  {
    id: "b-cr3-2",
    type: "definition",
    terme: "Règle de la chaîne, forme simple",
    anglais: "chain rule",
    texte:
      "Si $t\\mapsto u(t)$ et $u\\mapsto v(u)$ sont dérivables, alors $v\\circ u$ est dérivable et sa dérivée est le produit des deux dérivées, chacune évaluée au bon point.",
  },
  {
    id: "b-cr3-3",
    type: "formule",
    ancre: "chaine-simple",
    latex:
      "\\frac{\\mathrm{d}(v\\circ u)}{\\mathrm{d}t}(t)=\\frac{\\mathrm{d}v}{\\mathrm{d}u}\\big(u(t)\\big)\\cdot\\frac{\\mathrm{d}u}{\\mathrm{d}t}(t)",
    alt: "La dérivée de v rond u en t est le produit de la dérivée de v prise en u de t par la dérivée de u prise en t.",
    numero: "5.2",
  },
  {
    id: "b-cr3-5",
    type: "titre",
    niveau: 2,
    texte: "La forme à plusieurs chemins",
  },
  {
    id: "b-cr3-6",
    type: "definition",
    terme: "Règle de la chaîne, forme à plusieurs chemins",
    anglais: "multivariable chain rule",
    texte:
      "Si $u$ influence $C$ à travers $m$ quantités intermédiaires $v_{1},\\dots,v_{m}$, la dérivée de $C$ par rapport à $u$ est la somme, sur les $m$ chemins, du produit des dérivées le long du chemin.",
  },
  {
    id: "b-cr3-7",
    type: "formule",
    ancre: "chaine-plusieurs-chemins",
    latex:
      "\\frac{\\partial C}{\\partial u}=\\sum_{k=1}^{m}\\frac{\\partial C}{\\partial v_{k}}\\,\\frac{\\partial v_{k}}{\\partial u}",
    alt: "La dérivée partielle de C par rapport à u est la somme, pour k allant de un à m, du produit de la dérivée partielle de C par rapport à v k par la dérivée partielle de v k par rapport à u.",
    numero: "5.3",
  },
  {
    id: "b-cr3-9",
    type: "titre",
    niveau: 2,
    texte: "Laquelle s'applique",
  },
  {
    id: "b-cr3-10",
    type: "texte",
    texte:
      "Le critère porte sur la structure des dépendances et non sur la difficulté du calcul : la forme simple vaut tant que la quantité dérivée n'atteint sa cible que par une route, et la forme à plusieurs chemins dès qu'il en existe une seconde.",
  },
  {
    id: "b-cr3-11",
    type: "tableau",
    ancre: "critere-des-deux-formes",
    cleEnTete: true,
    entetes: [
      "Structure",
      "Forme applicable",
      "Ce qui la produit dans un réseau",
    ],
    lignes: [
      [
        "$u\\rightarrow v\\rightarrow C$, un seul trajet",
        "Simple, formule (5.2)",
        "Une couche qui n'a qu'un seul neurone",
      ],
      [
        "$u$ atteint $C$ par $m$ trajets",
        "Plusieurs chemins, formule (5.3)",
        "Une couche qui en compte plusieurs, un trajet par neurone",
      ],
    ],
  },
  {
    id: "b-cr3-12",
    type: "encart",
    ton: "rappel",
    titre: "Démontré ailleurs",
    texte:
      "Les deux énoncés sont **admis** ici. Leur preuve demande l'approximation au premier ordre et appartient au bloc de mathématiques du parcours. Les contrôles numériques qui les accompagnent (mesure 2, page 8, pour la forme simple ; mesure 4, page 11, pour la forme à plusieurs chemins) ne la remplacent pas : une identité fausse dans un cas non testé passerait ces contrôles sans rien déclencher.",
  },
  {
    id: "b-cr3-13",
    type: "titre",
    niveau: 2,
    texte: "Le réseau du calcul à la main",
  },
  {
    id: "b-cr3-14",
    type: "texte",
    texte:
      "Trois couches, **un neurone par couche**, une entrée $x$ et une cible $y$ : chaque couche calcule d'abord une somme pondérée, puis lui applique une activation.",
  },
  {
    id: "b-cr3-15",
    type: "formule",
    ancre: "reseau-minuscule",
    latex:
      "\\begin{aligned}z^{[1]}&=w^{[1]}x+b^{[1]}, & a^{[1]}&=\\varphi(z^{[1]})\\\\ z^{[2]}&=w^{[2]}a^{[1]}+b^{[2]}, & a^{[2]}&=\\varphi(z^{[2]})\\\\ z^{[3]}&=w^{[3]}a^{[2]}+b^{[3]}, & a^{[3]}&=\\sigma(z^{[3]})\\end{aligned}",
    alt: "Trois lignes. Sur chacune, z de la couche vaut le poids de la couche multiplié par l'activation précédente, plus le biais ; puis l'activation de la couche est phi appliquée à z, sauf à la troisième où c'est la sigmoïde.",
    numero: "5.4",
    legende:
      "$\\varphi=\\mathrm{ReLU}$ sur les deux couches cachées, et $\\sigma$ en sortie.",
  },
  {
    id: "b-cr3-15b",
    type: "definition",
    terme: "Entropie croisée binaire",
    anglais: "binary cross-entropy",
    texte:
      "Pour une sortie $a\\in\\,]0,1[$ et une cible $y\\in\\{0,1\\}$, $\\ell=-\\big[y\\ln a+(1-y)\\ln(1-a)\\big]$. Un seul des deux termes survit selon la cible, $-\\ln a$ quand $y=1$ et $-\\ln(1-a)$ quand $y=0$, si bien que la perte croît sans borne à mesure que la sortie s'éloigne de la cible. La cible est ici un nombre et non un vecteur, parce que le réseau n'a qu'une sortie ; la forme à $K$ classes, avec sa cible encodée en one-hot, est celle du chapitre 2, page 6, et elle revient avec le réseau général.",
  },
  {
    id: "b-cr3-16",
    type: "tableau",
    ancre: "compte-du-reseau-minuscule",
    cleEnTete: true,
    entetes: ["Quantité", "Combien", "Statut"],
    lignes: [
      ["$w^{[1]},w^{[2]},w^{[3]}$", "$3$", "Paramètres"],
      ["$b^{[1]},b^{[2]},b^{[3]}$", "$3$", "Paramètres"],
      ["$z^{[1]},z^{[2]},z^{[3]}$", "$3$", "Calculées"],
      ["$a^{[1]},a^{[2]},a^{[3]}$", "$3$", "Calculées"],
      ["$x$, $y$", "$2$", "Données"],
    ],
    legende: "Six paramètres : le gradient de ce réseau a six composantes.",
  },
  {
    id: "b-cr3-17",
    type: "encart",
    ton: "attention",
    titre: "L'exposant entre crochets",
    texte:
      "$w^{[2]}$ se lit « le poids de la couche $2$ », pas « $w$ au carré ». Les crochets distinguent l'indice de couche d'une puissance, et c'est la convention de tout le parcours.",
  },
  {
    id: "b-cr3-18",
    type: "verification",
    numero: 49,
    enonce:
      "Le critère qui sépare les deux formes de la règle de la chaîne porte sur la structure des dépendances.",
    questions: [
      "Dans quel cas la forme simple s'applique-t-elle, et dans quel cas faut-il l'autre ? Donner le critère, non un exemple.",
      "La forme (5.3) redonne-t-elle la forme (5.2) dans un cas particulier ? Lequel ?",
    ],
  },
  {
    id: "b-cr3-19",
    type: "texte",
    texte:
      "Décomposer une dérivée de ce réseau demande donc de connaître d'abord la structure de ses dépendances, et cette structure se lit sur un arbre où chaque quantité est reliée à celles qui la déterminent directement.",
  },
];
