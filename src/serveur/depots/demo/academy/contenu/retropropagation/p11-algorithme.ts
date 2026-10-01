import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 · page 11 · L'algorithme, et sa vérification
//
// OUVERTURE, règle 26 : une question sans un seul symbole, puis
// `l4-fig14-cout`, le peigne des différences finies contre les deux flèches de
// la rétropropagation. Le chiffre qui ouvre la page est celui qui la ferme.
//
// La notation revient ici : toutes les équations, dans l'ordre où on les
// exécute, avec leurs dimensions.
//
// ÉCART N°4 : la source ne vérifie rien. Ce chapitre confronte 160 dérivées aux
// différences finies centrées, et donne l'écart. Il dit aussi ce que cette
// vérification établit — les identités sont justes — et ce qu'elle n'établit
// pas : elle ne prouve pas la règle de la chaîne.
//
// Les durées de la mesure 7 sont celles de l'exécution reproduite ici, sur une
// machine chargée. Le texte le dit, et s'appuie sur le compte de propagations,
// qui ne dépend d'aucune machine.
// ─────────────────────────────────────────────────────────────────────────────

export const R11_ALGORITHME: Bloc[] = [
  {
    id: "b-rp11-0",
    type: "texte",
    texte:
      "Six égalités ont été posées sur une seule image, et rassemblées dans l'ordre elles forment un algorithme. Combien de fois faut-il alors traverser le réseau pour obtenir ses cent mille dérivées, et comment sait-on qu'elles sont justes ?",
  },
  {
    id: "b-rp11-0f",
    type: "image",
    ancre: "un-seul-passage",
    src: "/cours/lecon4/l4-fig14-cout.svg",
    largeur: 1380,
    hauteur: 780,
    alt: "En haut, sous la mention par différences finies centrées, une rangée serrée de quatre-vingts traits verticaux suivie de trois points de suspension, puis le compte : deux cent trois mille cinq cent quarante propagations avant, pour un seul exemple. Sous un trait, la mention par rétropropagation, une flèche grise qui va vers la droite étiquetée un aller, une flèche de brique qui revient vers la gauche étiquetée un retour, et à droite la mention un au lieu de deux cent trois mille cinq cent quarante. En pied, la mention que le rapport ne dépend d'aucune machine.",
    legende:
      "Le peigne n'est pas dessiné en entier : quatre-vingts traits pour deux cent mille passages, et c'est déjà illisible.",
  },
  {
    id: "b-rp11-0g",
    type: "texte",
    texte:
      "Le compte du haut est celui de la formule (4.1), deux propagations par coefficient ; celui du bas est ce que l'algorithme des pages 3 à 9 demande.\n\nCe rapport ne dépend ni de la machine, ni du langage, ni de la charge : les durées de la fin de page, elles, en dépendent toutes.",
  },
  {
    id: "b-rp11-2",
    type: "titre",
    niveau: 2,
    texte: "L'aller",
  },
  {
    id: "b-rp11-3",
    type: "formule",
    ancre: "passe-avant",
    latex:
      "\\mathbf{z}^{[1]}=W^{[1]}\\mathbf{x}+\\mathbf{b}^{[1]},\\quad \\mathbf{a}^{[1]}=\\mathrm{ReLU}\\big(\\mathbf{z}^{[1]}\\big),\\quad \\mathbf{z}^{[2]}=W^{[2]}\\mathbf{a}^{[1]}+\\mathbf{b}^{[2]},\\quad \\mathbf{a}^{[2]}=\\mathrm{softmax}\\big(\\mathbf{z}^{[2]}\\big)",
    alt: "z de la couche un vaut W de la couche un appliqué à x plus b de la couche un. a de la couche un vaut ReLU de z de la couche un. z de la couche deux vaut W de la couche deux appliqué à a de la couche un plus b de la couche deux. a de la couche deux vaut softmax de z de la couche deux.",
    numero: "4.12",
    legende:
      "Rien de neuf : c'est le réseau du chapitre 2. Ce qui est neuf, c'est qu'on **garde** $\\mathbf{x}$, $\\mathbf{z}^{[1]}$, $\\mathbf{a}^{[1]}$ et $\\mathbf{a}^{[2]}$.",
  },
  {
    id: "b-rp11-4",
    type: "titre",
    niveau: 2,
    texte: "Le retour",
  },
  {
    id: "b-rp11-5",
    type: "formule",
    ancre: "passe-arriere",
    latex:
      "\\begin{aligned}\\boldsymbol{\\delta}^{[2]}&=\\mathbf{a}^{[2]}-\\mathbf{y} &&(10\\times 1)\\\\ \\mathrm{grad}_{\\mathbf{b}^{[2]}}\\,\\ell&=\\boldsymbol{\\delta}^{[2]} &&(10\\times 1)\\\\ \\mathrm{grad}_{W^{[2]}}\\,\\ell&=\\boldsymbol{\\delta}^{[2]}\\big(\\mathbf{a}^{[1]}\\big)^{\\mathsf{T}} &&(10\\times 128)\\\\ \\boldsymbol{\\delta}^{[1]}&=\\Big[\\big(W^{[2]}\\big)^{\\mathsf{T}}\\boldsymbol{\\delta}^{[2]}\\Big]\\odot\\mathrm{ReLU}'\\big(\\mathbf{z}^{[1]}\\big) &&(128\\times 1)\\\\ \\mathrm{grad}_{\\mathbf{b}^{[1]}}\\,\\ell&=\\boldsymbol{\\delta}^{[1]} &&(128\\times 1)\\\\ \\mathrm{grad}_{W^{[1]}}\\,\\ell&=\\boldsymbol{\\delta}^{[1]}\\mathbf{x}^{\\mathsf{T}} &&(128\\times 784)\\end{aligned}",
    alt: "Delta de la couche deux vaut a de la couche deux moins y, de dimension dix par un. Le gradient des biais de la couche deux est delta de la couche deux, dix par un. Le gradient de la matrice de la couche deux est le produit extérieur de delta de la couche deux par a de la couche un transposé, dix par cent vingt-huit. Delta de la couche un est le produit de Hadamard de la transposée de W de la couche deux appliquée à delta de la couche deux avec la dérivée de ReLU en z de la couche un, cent vingt-huit par un. Le gradient des biais de la couche un est delta de la couche un, cent vingt-huit par un. Le gradient de la matrice de la couche un est le produit extérieur de delta de la couche un par x transposé, cent vingt-huit par sept cent quatre-vingt-quatre.",
    numero: "4.13",
    legende:
      "Six lignes, dans l'ordre où elles s'enchaînent : la formule (4.2), admise, pour la première, la proposition 3 pour la deuxième, la proposition 4 pour la troisième, la formule (4.9) pour la quatrième, et pour les deux dernières les mêmes propositions 3 et 4, portées une couche plus bas par la formule (4.10).",
  },
  {
    id: "b-rp11-7",
    type: "code",
    langage: "python",
    titre: "L'algorithme, tel qu'il tourne dans cours/lecon4/mesures.py",
    surlignees: [8, 9, 10, 11, 12, 13],
    code:
      "def avant(theta, x):                     # x : (784,)\n    z1 = theta[\"W1\"] @ x + theta[\"b1\"]   # (128, 784)(784,) -> (128,)\n    a1 = np.maximum(z1, 0.0)             # (128,)\n    z2 = theta[\"W2\"] @ a1 + theta[\"b2\"]  # (10, 128)(128,)  -> (10,)\n    a2 = softmax(z2)                     # (10,)\n    return {\"x\": x, \"z1\": z1, \"a1\": a1, \"z2\": z2, \"a2\": a2}\n\ndef arriere(theta, cache, c):\n    d2   = cache[\"a2\"] - onehot(c)              # (10,)     proposition 1\n    g_W2 = np.outer(d2, cache[\"a1\"])            # (10, 128) proposition 4\n    g_b2 = d2                                   # (10,)     proposition 3\n    g_a1 = theta[\"W2\"].T @ d2                   # (128,)    proposition 6\n    d1   = g_a1 * (cache[\"z1\"] > 0.0)           # (128,)    formule 4.9\n    g_W1 = np.outer(d1, cache[\"x\"])             # (128, 784) proposition 4\n    g_b1 = d1                                   # (128,)     proposition 3\n    return {\"W1\": g_W1, \"b1\": g_b1, \"W2\": g_W2, \"b2\": g_b2}",
  },
  {
    id: "b-rp11-8",
    type: "texte",
    texte:
      "Le commentaire de droite nomme, pour chaque ligne du retour, la proposition qui l'établit, sauf la première, qui est la formule (4.2) admise page 3. Le programme calcule $\\mathrm{grad}_{W^{[2]}}$ avant $\\mathrm{grad}_{\\mathbf{b}^{[2]}}$, ce que rien n'interdit puisque les deux ne dépendent que de $\\boldsymbol{\\delta}^{[2]}$.",
  },
  {
    id: "b-rp11-9",
    type: "titre",
    niveau: 2,
    texte: "Ce qu'il faut garder entre l'aller et le retour",
  },
  {
    id: "b-rp11-10",
    type: "tableau",
    ancre: "ce-quon-garde",
    cleEnTete: true,
    entetes: ["Quantité gardée", "Taille", "Employée par"],
    lignes: [
      ["$\\mathbf{x}$", "$784$", "$\\mathrm{grad}_{W^{[1]}}\\,\\ell=\\boldsymbol{\\delta}^{[1]}\\mathbf{x}^{\\mathsf{T}}$"],
      ["$\\mathbf{z}^{[1]}$", "$128$", "$\\mathrm{ReLU}'(\\mathbf{z}^{[1]})$, la porte"],
      ["$\\mathbf{a}^{[1]}$", "$128$", "$\\mathrm{grad}_{W^{[2]}}\\,\\ell=\\boldsymbol{\\delta}^{[2]}(\\mathbf{a}^{[1]})^{\\mathsf{T}}$"],
      ["$\\mathbf{a}^{[2]}$", "$10$", "$\\boldsymbol{\\delta}^{[2]}=\\mathbf{a}^{[2]}-\\mathbf{y}$"],
    ],
  },
  {
    id: "b-rp11-11",
    type: "texte",
    texte:
      "Soit $1\\,050$ nombres à retenir, contre $101\\,770$ coefficients dans le réseau, et **c'est tout ce qu'il met en mémoire** : il ne recalcule rien, il se souvient. Le programme garde en outre $\\mathbf{z}^{[2]}$, dont le retour ne se sert pas. Un procédé qui ne garderait rien devrait refaire la propagation avant à chaque dérivée, et l'on retomberait sur les différences finies.",
  },
  {
    id: "b-rp11-12",
    type: "titre",
    niveau: 2,
    texte: "La vérification",
  },
  {
    id: "b-rp11-13",
    type: "sortie",
    ancre: "mesure-2",
    titre:
      "160 dérivées confrontées aux différences finies · cours/lecon4/mesures.py, mesure 2",
    texte:
      "  epsilon = 1e-05\n  50 coefficients tirés dans chaque bloc PARMI CEUX DE DÉRIVÉE NON NULLE.\n\n      bloc    non nuls / total    contrôlés   écart rel. médian   écart rel. max   écart abs. max\n      W1         10716 / 100352            50          9.87e-11         6.62e-09         1.10e-11\n      b1            57 / 128               50          9.44e-11         4.57e-09         2.35e-11\n      W2           570 / 1280              50          2.13e-10         7.01e-09         2.02e-11\n      b2            10 / 10                10          3.70e-11         1.52e-10         9.41e-12\n\n  coefficients contrôlés                       160\n  ÉCART RELATIF MAXIMAL SUR LES 160            7.013e-09\n  écart relatif médian sur les 160             1.192e-10\n  écart ABSOLU maximal sur les 160             2.354e-11\n\n  -- Les dérivées nulles le sont aussi par différences finies --------------\n  coefficients de dérivée analytique nulle contrôlés   150\n  dont la différence finie vaut exactement zéro        150",
    lecture: [
      "**L'écart relatif maximal vaut $7{,}0\\cdot 10^{-9}$ sur $160$ coefficients**, et c'est le juge que le chapitre 3 a posé : les identités donnent, à huit chiffres significatifs près, ce que donne la définition même de la dérivée.",
      "**Le tirage est restreint aux dérivées non nulles, et c'est délibéré** : la mesure 8 montre que $89{,}32\\,\\%$ des coefficients de $W^{[1]}$ ont une dérivée exactement nulle, et les tirer au hasard dans ce bloc ferait passer le contrôle neuf fois sur dix sans rien contrôler.",
      "**Les dérivées nulles sont contrôlées à part, et elles le sont aussi numériquement**, puisque $150$ coefficients sur $150$ donnent une différence finie exactement nulle. Ce n'est pas une coïncidence : perturber un poids qui part d'un neurone éteint ne change pas la sortie du réseau, donc pas la perte.",
      "$b^{[2]}$ est le seul bloc **exhaustif**, ses dix coefficients étant tous contrôlés sans qu'aucun soit tiré, et son écart maximal de $1{,}5\\cdot 10^{-10}$ est aussi le plus petit des quatre.",
    ],
  },
  {
    id: "b-rp11-14",
    type: "titre",
    niveau: 3,
    texte: "D'où vient le peu qui reste",
  },
  {
    id: "b-rp11-15",
    type: "sortie",
    ancre: "mesure-2-plancher",
    titre: "L'écart absolu ne dépend pas de la dérivée · mesure 2, suite",
    texte:
      "  |dérivée| médiane des 160 coefficients contrôlés   0.0448\n  |dérivée| du coefficient d'écart relatif maximal    2.35e-03\n  écart ABSOLU médian, dérivées sous la médiane       4.63e-12\n  écart ABSOLU médian, dérivées au-dessus             5.68e-12\n  écart RELATIF médian, dérivées sous la médiane      3.19e-10\n  écart RELATIF médian, dérivées au-dessus            4.91e-11\n  plancher d'annulation, eps_machine x l / (2 eps)    1.56e-11",
    lecture: [
      "**L'écart absolu médian est le même de part et d'autre**, $4{,}6\\cdot 10^{-12}$ pour les petites dérivées et $5{,}7\\cdot 10^{-12}$ pour les grandes : il ne dépend pas de la dérivée qu'on mesure.",
      "**L'écart relatif, lui, varie d'un facteur $6{,}5$**, $3{,}2\\cdot 10^{-10}$ pour les petites dérivées contre $4{,}9\\cdot 10^{-11}$ pour les grandes, parce que c'est le même écart absolu divisé par un dénominateur plus petit.",
      "La cause est nommée et chiffrée : $\\ell\\approx 1{,}41$ est calculée à $\\varepsilon_{\\text{machine}}\\approx 2{,}2\\cdot 10^{-16}$ près, et la soustraction de deux valeurs voisines divisée par $2\\varepsilon=2\\cdot 10^{-5}$ amplifie cette incertitude d'un facteur $5\\cdot 10^{4}$. Le plancher vaut $1{,}56\\cdot 10^{-11}$ : les écarts absolus médians sont en dessous d'un facteur trois, et les maximaux du même ordre que lui.",
      "**Ce n'est donc pas un défaut de l'algorithme mais une propriété de la mesure**, et le coefficient qui affiche le plus grand écart relatif a une dérivée de $2{,}35\\cdot 10^{-3}$, dix-neuf fois plus petite que la médiane $0{,}0448$.",
    ],
  },
  {
    id: "b-rp11-17",
    type: "encart",
    ton: "attention",
    titre: "Ce que cette vérification établit, et ce qu'elle n'établit pas",
    texte:
      "**Elle établit** que les identités des pages 4 à 9 sont justes, et que leur mise en code ne s'est trompée ni d'indice, ni de transposée, ni de signe ; c'est un contrôle sévère, puisqu'une somme sur le mauvais indice produirait des écarts sans commune mesure avec $10^{-9}$, et qu'une transposition inversée empêcherait le plus souvent le produit de se composer. **Elle n'établit pas** la règle de la chaîne, qui reste admise : elle constate son résultat sur ce réseau, cet exemple et ces $160$ coefficients, et ne dit rien des autres ni d'un autre réseau. Une vérification numérique n'est pas une preuve, et la dette contractée page 1 reste entière.",
  },
  {
    id: "b-rp11-18",
    type: "titre",
    niveau: 2,
    texte: "Ce que l'algorithme économise",
  },
  {
    id: "b-rp11-19",
    type: "sortie",
    ancre: "mesure-7",
    titre: "Le coût comparé · cours/lecon4/mesures.py, mesure 7",
    texte:
      "  -- Le compte des propagations, qui ne dépend d'aucune machine ------------\n  coefficients du réseau                              101770\n  différences finies centrées, propagations avant     203540\n  rétropropagation, propagations avant                1\n  rétropropagation, propagations arrière              1\n  rapport des propagations avant                      203540\n\n  -- Le temps unitaire, meilleur de trois séries de 2 000 appels -----------\n  une propagation avant seule                    226.4 us\n  un gradient complet par rétropropagation       2384.1 us\n\n  -- Le même gradient par différences finies -------------------------------\n  estimation, 203540 x le temps d'une propagation   46.1 s\n  mesure réelle de la boucle complète            42.9 s\n  écart entre l'estimation et la mesure          8 %\n\n  -- Le rapport ------------------------------------------------------------\n  différences finies / rétropropagation, estimé  19329\n  différences finies / rétropropagation, mesuré  17975",
    lecture: [
      "**Le nombre qui compte est le premier, $203\\,540$ propagations avant contre une seule**, et il ne dépend ni de la machine, ni du langage, ni de la charge : c'est $2p$ contre $1$, et il vaudrait $2\\,000$ sur un réseau de mille coefficients comme il vaut $203\\,540$ sur celui-ci.",
      "Les durées dépendent en revanche de la machine et de sa charge, et celles reproduites ici viennent d'une exécution sur une machine **chargée** : elles ne valent pas comme mesure de performance, seulement comme ordre de grandeur.",
      "L'estimation $2p\\times t_{\\text{avant}}$ et la mesure réelle de la boucle s'accordent à $8\\,\\%$, ce qui confirme que la boucle de différences finies ne fait rien d'autre que $203\\,540$ propagations avant.",
      "Le rapport mesuré, $\\approx 1{,}8\\cdot 10^{4}$, est plus petit que $203\\,540$ parce qu'une passe arrière n'est pas gratuite : elle refait de l'algèbre, dont deux produits extérieurs. C'est un facteur constant, et non un facteur qui croît avec $p$.",
    ],
  },
  {
    id: "b-rp11-21",
    type: "verification",
    numero: 48,
    enonce:
      "Sur les $160$ coefficients contrôlés, l'écart **absolu** médian vaut $4{,}63\\cdot 10^{-12}$ pour les dérivées sous la médiane et $5{,}68\\cdot 10^{-12}$ pour celles au-dessus. L'écart **relatif** médian, lui, vaut $3{,}19\\cdot 10^{-10}$ contre $4{,}91\\cdot 10^{-11}$.",
    questions: [
      "Pourquoi le rapport s'inverse-t-il d'une ligne à l'autre ? Répondre en écrivant la définition de l'écart relatif.",
      "Le plancher d'annulation vaut $\\varepsilon_{\\text{machine}}\\,\\ell/(2\\varepsilon)=1{,}56\\cdot 10^{-11}$. Que deviendrait-il si l'on prenait $\\varepsilon=10^{-8}$ au lieu de $10^{-5}$, et est-ce une bonne idée ?",
    ],
  },
];
