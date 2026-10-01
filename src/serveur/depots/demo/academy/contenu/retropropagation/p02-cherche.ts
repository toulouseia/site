import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 2 · Ce qu'on cherche, et ce qu'on ne sait pas calculer
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig01-cadre`, qui montre la chaîne complète et le seul maillon absent.
// Le cadre vient après.
//
// Trois RENVOIS et aucune redite. Les mini-lots, la taille relative des
// composantes et le coût des différences finies ont été traités au chapitre 3 :
// cette page les cite avec leur page et leur numéro, elle ne les réexpose pas.
//
// ÉCART N°1 : la source emploie le coût quadratique. Ce cours emploie
// l'entropie croisée depuis le chapitre 2, et le chapitre 3 a mesuré pourquoi.
//
// ÉCART N°3 : la source illustre la sensibilité par 3,2 contre 0,1, deux
// nombres inventés. Ce cours renvoie au rapport 404 mesuré au chapitre 3.
// ─────────────────────────────────────────────────────────────────────────────

export const R02_CHERCHE: Bloc[] = [
  {
    id: "b-rp2-0",
    type: "texte",
    texte:
      "Le chapitre 3 sait quoi faire d'un gradient, et il ne sait pas en fabriquer un. Le procédé qui lui servait à mesurer coûte deux cent mille traversées du réseau pour une seule image, et un entraînement en fait des dizaines de milliers. Que manque-t-il exactement à la chaîne, et combien coûte le seul moyen connu de le fabriquer ?",
  },
  {
    id: "b-rp2-3f",
    type: "image",
    ancre: "ce-qui-est-pose",
    src: "/cours/lecon4/l4-fig01-cadre.svg",
    largeur: 1380,
    hauteur: 720,
    alt: "Quatre lignes, chacune portant à gauche une écriture mathématique et à droite ce qu'elle désigne. La première donne l'entrée, un vecteur de sept cent quatre-vingt-quatre valeurs entre zéro et un, et la mention l'image, aplatie. La deuxième donne le réseau appliqué à l'image, qui rend les activations de la couche deux, avec la mention le réseau, sept cent quatre-vingt-quatre vers cent vingt-huit vers dix. La troisième donne la perte, moins le logarithme de l'activation de la classe vraie, avec la mention la perte d'un exemple. La quatrième donne la règle de mise à jour, thêta reçoit thêta moins êta fois le gradient de la perte, avec la mention la descente de gradient. Sous un trait, un cadre de brique porte le gradient de la perte et ses cent un mille sept cent soixante-dix nombres ; une flèche de brique remonte de ce cadre vers la ligne de la descente, et le mot manque est écrit à côté.",
    legende:
      "La descente sait quoi faire d'un gradient ; elle ne sait pas le calculer.",
  },
  {
    id: "b-rp2-3g",
    type: "texte",
    texte:
      "Les quatre premières lignes sont acquises et rien n'y sera repris : l'image, le réseau et la perte viennent du chapitre 2, la règle de mise à jour du chapitre 3. Le cadre du bas, lui, n'a encore aucun moyen d'être rempli, et la flèche dit qui en a besoin.",
  },
  {
    id: "b-rp2-2",
    type: "titre",
    niveau: 2,
    texte: "Ce qui est déjà posé",
  },
  {
    id: "b-rp2-3",
    type: "liste",
    elements: [
      "**L'architecture.** $\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]}$, $\\mathbf{a}^{[1]}=\\mathrm{ReLU}(\\mathbf{z}^{[1]})$, $\\mathbf{z}^{[2]}=W^{[2]}\\mathbf{a}^{[1]}+\\mathbf{b}^{[2]}$, $\\mathbf{a}^{[2]}=\\mathrm{softmax}(\\mathbf{z}^{[2]})$. Chapitre 2, pages 6 et 10.",
      "**Le coût.** $C_{\\mathcal{D}}(\\boldsymbol{\\theta})=\\frac{1}{N}\\sum_{n}\\ell_{n}(\\boldsymbol{\\theta})$, moyenne des pertes d'entropie croisée. Chapitre 3, page 6.",
      "**Le procédé.** $\\boldsymbol{\\theta}_{t+1}=\\boldsymbol{\\theta}_{t}-\\eta\\,\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,C_{\\mathcal{D}}(\\boldsymbol{\\theta}_{t})$. Chapitre 3, page 8.",
    ],
  },
  {
    id: "b-rp2-4",
    type: "encart",
    ton: "rappel",
    titre: "Le coût n'est pas celui de la source",
    texte:
      "La source expose la rétropropagation sur une somme de carrés, alors que ce cours emploie l'entropie croisée depuis le chapitre 2, et que le chapitre 3 a départagé les deux candidates par une mesure : un rapport de $450$ entre les deux gradients de départ, page 5. Le changement se voit en un seul endroit, le point de départ du calcul, $\\boldsymbol{\\delta}^{[2]}=\\mathbf{a}^{[2]}-\\mathbf{y}$, qui est plus simple avec l'entropie croisée qu'avec le carré. Tout ce qui suit ce point de départ est identique.",
  },
  {
    id: "b-rp2-5",
    type: "titre",
    niveau: 2,
    texte: "Ce qui manque, et ce que ça coûte",
  },
  {
    id: "b-rp2-6",
    type: "texte",
    texte:
      "Les $101\\,770$ dérivées partielles existent et se calculent, puisque le chapitre 3 les a obtenues par différences finies centrées et s'en est servi pour toutes ses mesures. Le procédé est exact au terme d'erreur près et n'emploie que des propagations avant, et il est pourtant **inutilisable pour entraîner**.",
  },
  {
    id: "b-rp2-7",
    type: "formule",
    ancre: "cout-des-differences-finies",
    latex:
      "\\frac{\\partial \\ell}{\\partial\\theta_{i}}\\approx\\frac{\\ell(\\boldsymbol{\\theta}+\\varepsilon\\mathbf{e}_{i})-\\ell(\\boldsymbol{\\theta}-\\varepsilon\\mathbf{e}_{i})}{2\\varepsilon}\\quad\\Longrightarrow\\quad 2p=2\\times 101\\,770=203\\,540\\ \\text{propagations avant}",
    alt: "La dérivée partielle de la perte par rapport à la i-ième composante est approchée par la différence entre la perte en thêta plus epsilon fois le i-ième vecteur de base et la perte en thêta moins epsilon fois ce même vecteur, divisée par deux epsilon. Il faut donc deux fois p, soit deux cent trois mille cinq cent quarante propagations avant.",
    numero: "4.1",
    legende:
      "Deux propagations par coefficient, $101\\,770$ coefficients, pour **un seul** exemple. Chapitre 3, page 8, mesure 9.",
  },
  {
    id: "b-rp2-9",
    type: "texte",
    texte:
      "Le chapitre 3 a mesuré ce que cela donne à l'échelle d'un entraînement, sur $60\\,000$ exemples et des dizaines de milliers de mises à jour : le procédé ne tient pas, et ce n'est pas une question de machine plus rapide. Il faut un algorithme dont le coût soit celui d'**une** propagation, et non de $203\\,540$.",
  },
  {
    id: "b-rp2-10",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce vecteur contient, et pourquoi on ne le voit pas",
  },
  {
    id: "b-rp2-11",
    type: "texte",
    texte:
      "$\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell$ vit dans $\\mathbb{R}^{101\\,770}$, et se le représenter comme une flèche pointant dans une direction ne mène nulle part, puisque personne ne voit une direction dans un espace de cent mille dimensions. Ce qu'on lit d'un gradient, ce sont ses composantes, une par une.",
  },
  {
    id: "b-rp2-12",
    type: "tableau",
    ancre: "ce-que-dit-une-composante",
    cleEnTete: true,
    entetes: ["Ce qu'on lit sur $\\partial\\ell/\\partial\\theta_{i}$", "Ce que ça dit"],
    lignes: [
      [
        "Son signe",
        "Le sens dans lequel pousser $\\theta_{i}$ pour faire baisser la perte, qui est l'opposé de ce signe",
      ],
      [
        "Sa taille, comparée aux autres",
        "Combien la perte est sensible à ce coefficient-là, relativement au reste du réseau",
      ],
    ],
  },
  {
    id: "b-rp2-13",
    type: "encart",
    ton: "note",
    titre: "La sensibilité a déjà été mesurée",
    texte:
      "Le chapitre 3, page 10, mesure 4, donne le rapport entre la plus grande composante du gradient et sa médiane sur ce réseau : **$404$**. Ce cours emploie ce nombre plutôt qu'un exemple inventé, et ne refait pas la mesure ici.",
  },
  {
    id: "b-rp2-13f",
    type: "image",
    ancre: "deux-poids-inegaux",
    src: "/cours/lecon4/l4-fig02-importance.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Deux barres horizontales d'ardoise, de longueurs très inégales, partant d'un même axe vertical. La première porte le poids reliant le quatre-vingt-douzième neurone caché au neurone de sortie de la classe deux, dont l'activation vaut un virgule cinq neuf zéro trois ; sa dérivée vaut moins un virgule deux cent un mille quatre cent neuf. La seconde porte le poids venant du soixante-deuxième neurone, d'activation zéro virgule zéro zéro sept zéro ; sa dérivée vaut moins zéro virgule zéro zéro cinq mille deux cent cinquante-cinq, et sa barre se réduit à un trait. Une accolade de brique embrasse les deux et porte la cote deux cent vingt-huit virgule six fois d'écart. En pied, le rapport des deux activations, un virgule cinq neuf zéro trois divisé par zéro virgule zéro zéro sept zéro, vaut deux cent vingt-huit virgule six.",
    legende:
      "Un gradient n'est pas une liste de nombres du même ordre.",
  },
  {
    id: "b-rp2-15",
    type: "titre",
    niveau: 2,
    texte: "Ce que la rétropropagation est",
  },
  {
    id: "b-rp2-16",
    type: "definition",
    terme: "Rétropropagation",
    anglais: "backpropagation",
    texte:
      "L'algorithme qui calcule $\\mathrm{grad}_{\\boldsymbol{\\theta}}\\,\\ell$ en une propagation avant et une propagation arrière, quel que soit le nombre de coefficients. Ce n'est ni une approximation ni une heuristique : c'est la règle de la chaîne, organisée de façon à ne calculer chaque quantité qu'une fois.",
  },
];
