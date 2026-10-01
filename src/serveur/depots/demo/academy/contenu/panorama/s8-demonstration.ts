import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Section 8 · La démonstration numérique complète.
//
// Les sections 3 et 4 ont CITÉ les chiffres du fil conducteur ; celle-ci les
// OBTIENT, sans sauter une étape, puis les fait recalculer par un programme.
// Deux appartements, deux jeux de paramètres posés à la main, et une note pour
// chacun. Rien d'autre : ni gradient, ni mise à jour, ni apprentissage.
//
// Tous les nombres cités ici sortent d'un programme exécuté, dont le code est
// versionné dans cours/ à la racine de l'application :
//
//   cours/lecon1/prix.py     le modèle, la perte, la perte moyenne, et le jeu
//
// La sortie reproduite dans le bloc « sortie » est celle de
// `python cours/lecon1/prix.py`, telle quelle, sans une retouche.
// ─────────────────────────────────────────────────────────────────────────────

export const S8_DEMONSTRATION: Bloc[] = [
  {
    id: "b-p8-1",
    type: "texte",
    texte:
      "Les pages 4 et 5 ont donné les résultats, 190, 62,5 et 56,25, en sautant des lignes.\n\nCelle-ci n'en saute aucune : c'est le seul endroit du parcours où tout se vérifie de tête, du premier produit à la dernière moyenne, et à la fin on regarde à quoi ressemblent ces mêmes lignes écrites en Python.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.1 · le calcul entièrement à la main
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p8-2",
    type: "titre",
    niveau: 2,
    texte: "Le calcul entièrement à la main",
  },
  {
    id: "b-p8-3",
    type: "texte",
    texte:
      "Deux appartements, décrits par leur surface et leur nombre de pièces, ont été vendus à un prix connu, et on calcule tout, du premier produit à la dernière moyenne, avec des prix comptés en **milliers d'euros**.",
  },
  {
    id: "b-p8-4",
    type: "tableau",
    cleEnTete: true,
    titre: "Le jeu de données $\\mathcal{D}$",
    entetes: [
      "Exemple",
      "Surface $x_1$ (m²)",
      "Pièces $x_2$",
      "Prix observé $y$ (milliers d'euros)",
    ],
    lignes: [
      ["$n = 1$", "$50$", "$2$", "$200$"],
      ["$n = 2$", "$30$", "$1$", "$115$"],
    ],
    legende:
      "Les deux ventes du fil conducteur. Un jeu de cette taille ne sert à rien pour apprendre ; il sert exactement à ce qu'on va en faire, vérifier un calcul jusqu'au dernier chiffre.",
  },
  {
    id: "b-p8-5",
    type: "formule",
    ancre: "donnees-figees",
    latex:
      "\\mathbf{x}^{(1)}=\\begin{pmatrix}50\\\\2\\end{pmatrix},\\ \\ y^{(1)}=200 \\qquad\\qquad \\mathbf{x}^{(2)}=\\begin{pmatrix}30\\\\1\\end{pmatrix},\\ \\ y^{(2)}=115",
    alt: "Le premier exemple a pour entrée le vecteur colonne cinquante, deux, et pour prix observé deux cents. Le second a pour entrée le vecteur colonne trente, un, et pour prix observé cent quinze.",
    legende:
      "Chaque entrée est un **vecteur colonne** de $\\mathbb{R}^{2}$, la vérité terrain un simple réel. Chaque entrée porte ses deux nombres dans l'ordre convenu page 4 : la surface, puis les pièces.",
  },
  {
    id: "b-p8-6",
    type: "titre",
    niveau: 3,
    texte: "Un premier jeu de paramètres, posé à la main",
  },
  {
    id: "b-p8-7",
    type: "texte",
    texte:
      "Il faut un $\\boldsymbol{\\theta}$ à noter, et c'est celui que la page 4 a posé au jugé, et que la page 5 a nommé $\\boldsymbol{\\theta}_A$ : trois nombres écrits sans être calculés et sans être justifiés, car **aucun apprentissage n'a eu lieu**. C'est délibéré, et c'est même nécessaire : pour voir ce que la perte mesure, il faut d'abord quelque chose à mesurer, et n'importe quoi fait l'affaire.",
  },
  {
    id: "b-p8-8",
    type: "formule",
    ancre: "theta-a",
    latex:
      "\\boldsymbol{\\theta}_A=(\\mathbf{w},\\,b) \\qquad\\text{avec}\\qquad \\mathbf{w}=(w_1, w_2) = (3,\\ 10),\\qquad b=20",
    alt: "Thêta A est formé du vecteur de poids et du biais : les deux poids valent trois et dix, et b vaut vingt.",
    legende: "Trois nombres, et trois seulement : c'est tout ce qu'on peut régler.",
  },
  {
    id: "b-p8-11",
    type: "texte",
    texte:
      "**Premier appartement.** On applique la formule 4.1, terme à terme, sans rien regrouper d'avance.",
  },
  {
    id: "b-p8-12",
    type: "formule",
    latex:
      "\\widehat{y}^{(1)} \\;=\\; w_1x^{(1)}_1+w_2x^{(1)}_2+b \\;=\\; 3\\times 50+10\\times 2+20 \\;=\\; 150+20+20 \\;=\\; 190",
    alt: "L'estimation du premier appartement vaut w un fois x un plus w deux fois x deux plus b, c'est-à-dire trois fois cinquante plus dix fois deux plus vingt, soit cent cinquante plus vingt plus vingt, soit cent quatre-vingt-dix.",
  },
  {
    id: "b-p8-13",
    type: "formule",
    latex:
      "\\ell\\big(\\widehat{y}^{(1)},\\,y^{(1)}\\big)=(190-200)^{2}=(-10)^{2}=100",
    alt: "La perte du premier appartement vaut cent quatre-vingt-dix moins deux cents, le tout au carré, c'est-à-dire moins dix au carré, soit cent.",
    legende:
      "L'estimation manque le prix observé de 10 milliers d'euros, et le carré transforme cet écart en $100$.",
  },
  {
    id: "b-p8-14",
    type: "texte",
    texte: "**Second appartement.** Mêmes paramètres, mêmes gestes.",
  },
  {
    id: "b-p8-15",
    type: "formule",
    latex: "\\widehat{y}^{(2)} \\;=\\; 3\\times 30+10\\times 1+20 \\;=\\; 90+10+20 \\;=\\; 120",
    alt: "L'estimation du second appartement vaut trois fois trente plus dix fois un plus vingt, soit quatre-vingt-dix plus dix plus vingt, soit cent vingt.",
  },
  {
    id: "b-p8-16",
    type: "formule",
    latex:
      "\\ell\\big(\\widehat{y}^{(2)},\\,y^{(2)}\\big)=(120-115)^{2}=5^{2}=25",
    alt: "La perte du second appartement vaut cent vingt moins cent quinze, le tout au carré, c'est-à-dire cinq au carré, soit vingt-cinq.",
    legende:
      "Ici l'estimation passe **au-dessus** du prix observé, de 5 milliers d'euros. Le carré ne s'en soucie pas : il rend $25$, sans signe.",
  },
  {
    id: "b-p8-17",
    type: "texte",
    texte:
      "Il reste à moyenner les deux pertes, et avec $N = 2$ la moyenne est une demi-somme.",
  },
  {
    id: "b-p8-18",
    type: "formule",
    ancre: "note-theta-a",
    latex:
      "\\mathcal{L}_{\\mathcal{D}}(\\boldsymbol{\\theta}_A)=\\frac{1}{N}\\sum_{n=1}^{N}\\ell^{(n)}=\\tfrac{1}{2}\\big(100+25\\big)=\\frac{125}{2}=62{,}5",
    alt: "La perte moyenne en thêta A est un sur N fois la somme des pertes, c'est-à-dire un demi de cent plus vingt-cinq, soit cent vingt-cinq sur deux, soit soixante-deux virgule cinq.",
  },
  {
    id: "b-p8-20",
    type: "titre",
    niveau: 3,
    texte: "On change un seul paramètre",
  },
  {
    id: "b-p8-21",
    type: "texte",
    texte:
      "Gardons $\\mathbf{w}=(w_1, w_2) = (3,\\ 10)$ intact et déplaçons le biais de $20$ à $22{,}5$, si bien qu'un seul des trois nombres bouge. Les deux appartements, eux, ne bougent pas : $\\mathcal{D}$ est fixe, et c'est bien pour cela que la perte est une fonction de $\\boldsymbol{\\theta}$ seul. Appelons ce nouveau point $\\boldsymbol{\\theta}_B$.",
  },
  {
    id: "b-p8-22",
    type: "formule",
    latex:
      "\\widehat{y}^{(1)}=3\\times 50+10\\times 2+22{,}5=192{,}5 \\qquad \\ell=(192{,}5-200)^{2}=(-7{,}5)^{2}=56{,}25",
    alt: "Pour le premier appartement, l'estimation vaut trois fois cinquante plus dix fois deux plus vingt-deux virgule cinq, soit cent quatre-vingt-douze virgule cinq. Sa perte vaut moins sept virgule cinq au carré, soit cinquante-six virgule vingt-cinq.",
  },
  {
    id: "b-p8-23",
    type: "formule",
    latex:
      "\\widehat{y}^{(2)}=3\\times 30+10\\times 1+22{,}5=122{,}5 \\qquad \\ell=(122{,}5-115)^{2}=(7{,}5)^{2}=56{,}25",
    alt: "Pour le second appartement, l'estimation vaut trois fois trente plus dix fois un plus vingt-deux virgule cinq, soit cent vingt-deux virgule cinq. Sa perte vaut sept virgule cinq au carré, soit cinquante-six virgule vingt-cinq.",
    legende:
      "Les deux écarts sont devenus égaux en valeur absolue, $7{,}5$ chacun, l'un par défaut et l'autre par excès. Le carré efface la différence de signe et rend deux fois la même perte.",
  },
  {
    id: "b-p8-24",
    type: "formule",
    ancre: "note-theta-b",
    latex:
      "\\mathcal{L}_{\\mathcal{D}}(\\boldsymbol{\\theta}_B)=\\tfrac{1}{2}\\big(56{,}25+56{,}25\\big)=56{,}25",
    alt: "La perte moyenne en thêta B est un demi de cinquante-six virgule vingt-cinq plus cinquante-six virgule vingt-cinq, soit cinquante-six virgule vingt-cinq.",
  },
  {
    id: "b-p8-25",
    type: "tableau",
    cleEnTete: true,
    titre: "Les deux notes, côte à côte",
    entetes: [
      "",
      "$\\widehat{y}^{(1)}$",
      "$\\ell^{(1)}$",
      "$\\widehat{y}^{(2)}$",
      "$\\ell^{(2)}$",
      "$\\mathcal{L}_{\\mathcal{D}}$",
    ],
    lignes: [
      [
        "$\\boldsymbol{\\theta}_A$, $b=20$",
        "$190$",
        "$100$",
        "$120$",
        "$25$",
        "$62{,}5$",
      ],
      [
        "$\\boldsymbol{\\theta}_B$, $b=22{,}5$",
        "$192{,}5$",
        "$56{,}25$",
        "$122{,}5$",
        "$56{,}25$",
        "**$56{,}25$**",
      ],
    ],
    legende:
      "Un seul nombre a changé, de $20$ à $22{,}5$, et les cinq colonnes ont bougé avec lui. L'écart de note est de $6{,}25$.",
  },
  {
    id: "b-p8-26",
    type: "texte",
    texte:
      "La conclusion mérite d'être écrite en toutes lettres. $\\boldsymbol{\\theta}_B$ est un **meilleur point** pour cette note-là et ces deux exemples-là, puisque $56{,}25 < 62{,}5$. Pas un meilleur modèle du marché immobilier, pas une meilleure théorie du prix.\n\nEt le déplacement de $20$ à $22{,}5$, personne ne l'a calculé : il a été essayé. Trouver la bonne direction sans essayer est le sujet du chapitre 3.",
  },
  {
    id: "b-p8-28",
    type: "image",
    ancre: "calcul-a-la-main",
    src: "/cours/lecon1/l1-fig13-le-calcul-a-la-main.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "Deux règles graduées de zéro à deux cents, l'une sous l'autre. Sur la première, pour la vente de cinquante mètres carrés et deux pièces, une barre faite de trois segments accolés porte trois fois cinquante, dix fois deux, et b égale vingt ; elle s'arrête à cent quatre-vingt-dix, et un trait de brique en pointillé marque le prix observé, deux cents : entre les deux, un segment de brique coté écart dix. Sur la seconde, pour la vente de trente mètres carrés et une pièce, les trois segments portent trois fois trente, dix fois un, et b égale vingt ; la barre atteint cent vingt et dépasse le prix observé, cent quinze, et l'écart vaut cinq. Sous un filet, deux carrés de brique côte à côte portent leurs aires, cent et vingt-cinq, le second quatre fois plus petit que le premier ; à droite, la ligne parenthèse cent plus vingt-cinq fermante divisé par deux égale soixante-deux virgule cinq.",
    legende:
      "Chaque écart devient une aire, et la note est leur moyenne.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8.2 · de l'algorithme au code
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-p8-29",
    type: "titre",
    niveau: 2,
    texte: "De l'algorithme au code",
  },
  {
    id: "b-p8-30",
    type: "texte",
    texte:
      "Le calcul qu'on vient de faire deux fois est une **procédure** : la même suite de gestes, appliquée à des nombres différents. Elle tient en quatre gestes : lire un exemple, calculer l'estimation, la comparer au prix payé, et moyenner sur les exemples.",
  },
  {
    id: "b-p8-34",
    type: "image",
    ancre: "formalisme-vers-code",
    src: "/cours/lecon1/l1-fig10-du-formalisme-au-code.svg",
    largeur: 1380,
    hauteur: 830,
    alt: "Deux colonnes séparées par un filet vertical, « le formalisme » à gauche et « le code » à droite, sur quatre rangées. Première rangée : z égale la somme des w indice i fois x indice i, plus b, en face des trois lignes z égale b, for i in range parenthèse d, et z plus égale w crochet i crochet fois x crochet i crochet. Deuxième : y chapeau égale z, en face de y_hat égale z. Troisième : la perte ell égale parenthèse y chapeau moins y fermante au carré, en face de loss égale parenthèse y_hat moins y fermante étoile étoile deux. Quatrième : la perte moyenne grand L égale un sur N fois la somme des ell, en face des quatre lignes total égale zéro virgule zéro, for x, y in D, total plus égale perte parenthèse x virgule y, et total divisé par N.",
    legende:
      "Chaque symbole a un nom dans le programme, et un seul.",
  },
];
