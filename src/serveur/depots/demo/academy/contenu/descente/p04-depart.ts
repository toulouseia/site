import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 4 · Au départ, le réseau est mauvais
//
// La page qui règle la première dette du chapitre 2 : d'où viennent les poids.
// Elle ne répond pas encore -- elle montre le point de départ, et ce point de
// départ est un CONTRÔLE. Si le coût initial ne valait pas environ 2,30 et la
// précision environ 0,10, il y aurait un défaut avant la première mise à jour.
//
// Le fait contre-intuitif de la page est mesuré : les cinq coûts dépassent
// -ln(1/10). Un réseau initialisé au hasard fait légèrement PIRE que de
// répondre au hasard, et la raison tient en une ligne.
//
// OUVERTURE : la question, puis la figure des cinq coûts avec le repère du
// hasard, puis le cadre. Règle 26.
//
// Tous les nombres sortent de cours/lecon3/mesures.py, mesure 1.
// ─────────────────────────────────────────────────────────────────────────────

export const D04_DEPART: Bloc[] = [
  {
    id: "b-d4-0",
    type: "texte",
    texte:
      "Un réseau dont les cent mille nombres sortent d'un tirage au sort n'a rien appris, et rien appris de faux non plus. Fait-il aussi bien que de répondre au hasard ?",
  },
  {
    id: "b-d4-fig07",
    type: "image",
    ancre: "cinq-graines",
    src: "/cours/lecon3/l3-fig07-cinq-graines.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Un axe horizontal gradué de deux virgule trente à deux virgule quarante-cinq. Un trait vertical en brique le coupe un peu après la première graduation, sous la mention répondre au hasard, et porte sa valeur. Cinq ronds à l'encre sont posés sur l'axe, un par graine de zéro à quatre, et les cinq sont à droite du trait brique. Chaque rond porte à gauche le nom de sa graine et à droite sa valeur.",
    legende:
      "Le trait en brique est ce que paierait un réseau qui répondrait un dixième pour chacune des dix classes. Les cinq mesures sont toutes du mauvais côté.",
  },
  {
    id: "b-d4-1",
    type: "texte",
    texte:
      "Une procédure qui améliore quelque chose doit partir d'un état connu, sans quoi une amélioration ne se distingue pas d'une erreur de mesure.",
  },
  {
    id: "b-d4-1b",
    type: "texte",
    texte:
      "Le nombre porté par cet axe est la moyenne, sur les $10\\,000$ images de test, de la perte $\\ell$ que le chapitre 2 a posée. Les pages 5 et 6 diront pourquoi cette moyenne-là plutôt qu'une autre, et lui donneront son nom ; pour l'instant, elle sert seulement d'étalon.",
  },
  {
    id: "b-d4-2",
    type: "titre",
    niveau: 2,
    texte: "Le point de départ",
  },
  {
    id: "b-d4-3",
    type: "texte",
    texte:
      "Les $101\\,770$ nombres sont tirés au hasard, chaque coefficient de $W^{[l]}$ selon une loi normale centrée dont la dispersion $\\sqrt{2/d_{l-1}}$ dépend du nombre d'entrées de la couche, et les biais partent à zéro. Le tirage est reproductible : la **graine** est le nombre qui le fixe, et deux exécutions de même graine donnent les mêmes $101\\,770$ valeurs. **Pourquoi pas tout à zéro** est une bonne question, elle a une réponse, et elle relève du chapitre d'initialisation.",
  },
  {
    id: "b-d4-4",
    type: "texte",
    texte:
      "Un réseau qui répondrait **au hasard** accorderait la même valeur à chacune des dix classes, c'est-à-dire $a_{k}=1/10$ pour tout $k$, et il paierait alors $-\\ln(1/10)=\\ln 10=2{,}302585$ sur chaque image : c'est la barre à laquelle on compare tout ce qui suit.",
  },
  {
    id: "b-d4-5",
    type: "sortie",
    ancre: "cinq-graines-mesure",
    titre:
      "Cinq initialisations, avant toute mise à jour · cours/lecon3/mesures.py, mesure 1",
    texte:
      "    répondre au hasard : -ln(1/10) = 2.302585\n\n      graine     coût        précision\n           0     2.417832    0.1314\n           1     2.407812    0.0602\n           2     2.379976    0.1323\n           3     2.382167    0.1520\n           4     2.389514    0.1466",
    lecture: [
      "Les précisions vont de $0{,}0602$ à $0{,}1520$, c'est-à-dire autour du dixième qu'on obtiendrait en tirant la réponse au sort : le réseau ne sait rien, et c'est attendu. L'écart entre les deux extrêmes dit seulement que cinq tirages ne suffisent pas à cerner une moyenne.",
      "**Les cinq coûts dépassent $2{,}302585$**, donc le réseau initialisé fait légèrement **pire** que de répondre au hasard, et ce n'est pas une anomalie.",
      "C'est le contrôle qu'on voulait : si cette ligne avait donné $0{,}5$ ou $12$, il y aurait un défaut dans le code avant la première mise à jour, et rien de ce qui suit n'aurait de sens.",
    ],
  },
  {
    id: "b-d4-7",
    type: "titre",
    niveau: 3,
    texte: "Comment fait-on pire que le hasard ?",
  },
  {
    id: "b-d4-fig08",
    type: "image",
    ancre: "sortie-non-entrainee-figure",
    src: "/cours/lecon3/l3-fig08-sortie-non-entrainee.svg",
    largeur: 1380,
    hauteur: 620,
    alt: "Dix barres verticales, numérotées de zéro à neuf, de hauteurs inégales. Une ligne horizontale en pointillé ardoise marque la hauteur un dixième : cinq barres la dépassent, cinq restent en dessous. La barre numéro sept est en brique et compte parmi les plus basses ; sa valeur est portée à droite sous la mention la vraie classe.",
    legende:
      "Répondre au hasard, c'est produire dix barres de même hauteur. Celles-ci ne le sont pas, et c'est là toute la différence.",
  },
  {
    id: "b-d4-8",
    type: "sortie",
    ancre: "sortie-non-entrainee",
    titre: "Une sortie de réseau non entraîné, en entier · graine 0",
    texte:
      "      classe :         0         1         2         3         4         5         6         7         8         9\n      a_k    :    0.1221    0.0885    0.2106    0.1094    0.1149    0.1021    0.0825    0.0650    0.0493    0.0555\n      somme   1.0000000000\n      écart max entre deux coordonnées   0.161240\n      une loi uniforme donnerait          0.000000\n      étiquette vraie 7, coordonnée correspondante 0.065024\n      perte sur cet exemple : -ln(0.065024) = 2.733006",
    lecture: [
      "**Répondre au hasard, c'est sortir dix valeurs égales.** Ce réseau en sort d'inégales : $0{,}2106$ pour la classe $2$, $0{,}0493$ pour la classe $8$, un écart de $0{,}1612$ entre les deux extrêmes.",
      "Ses préférences ne veulent rien dire puisqu'elles viennent d'un tirage, mais elles existent, et sur cette image, un $7$, il accorde $0{,}0650$ à la bonne classe, moins que $1/10$, et paie $-\\ln(0{,}0650)=2{,}733$.",
      "**Le mécanisme se voit sur cette seule sortie, en faisant tourner la vraie classe.** Si l'étiquette avait été le $2$, le réseau aurait payé $-\\ln(0{,}2106)=1{,}558$ ; si elle avait été le $8$, $-\\ln(0{,}0493)=3{,}010$. La moyenne des dix pertes possibles vaut $2{,}387$, au-dessus de $\\ln 10=2{,}302585$, alors que dix valeurs toutes égales à $1/10$ donneraient exactement $\\ln 10$ dans les dix cas.",
      "C'est que $-\\ln$ monte sans borne quand la coordonnée tend vers zéro et ne descend que lentement quand elle tend vers un : rendre dix valeurs inégales coûte donc plus qu'il ne rapporte, et c'est vrai de n'importe quel jeu de dix valeurs inégales. Un réseau tiré au sort en produit à chaque image, et c'est tout ce qui le sépare du hasard.",
    ],
  },
  {
    id: "b-d4-9",
    type: "animation",
    ancre: "dix-valeurs-inegales",
    animationId: "dix-valeurs-inegales",
    legende:
      "Les dix sorties mesurées se posent contre le repère d'une loi uniforme, et la vraie classe se signale : avant tout apprentissage, elles sont déjà inégales.",
  },
  {
    id: "b-d4-10",
    type: "verification",
    numero: 22,
    enonce:
      "Un réseau initialisé au hasard obtient un coût de $2{,}4178$ alors que répondre au hasard donne $2{,}302585$.",
    questions: [
      "Comment un réseau peut-il faire **pire** que le hasard alors qu'il n'a rien appris de faux ?",
      "Quelle sortie faudrait-il produire pour obtenir exactement $2{,}302585$ ?",
      "Un réseau accorde $0{,}99$ à une classe fixe, la même pour toutes les images, et répartit également le centième restant sur les neuf autres. Les dix chiffres étant à peu près équirépartis dans le jeu, estimer son coût moyen et le comparer à $\\ln 10$.",
    ],
  },
  {
    id: "b-d4-11",
    type: "encart",
    ton: "note",
    titre: "Dette du chapitre 2 réglée : d'où viennent les poids",
    texte:
      "Le chapitre 2 citait un gabarit dont le minimum tombait en $(16,15)$, et disait à chaque fois que ces valeurs venaient d'un réseau **déjà entraîné**. Le voici, ce réseau, avant l'entraînement : $101\\,770$ nombres tirés au hasard, une précision de $0{,}13$, un coût de $2{,}42$. Les pages 5 à 9 construisent la procédure qui, sans qu'aucun humain ne décide d'un seul de ces nombres, les amène à ce que le chapitre 2 a lu.",
  },
];
