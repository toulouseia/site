import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 · page 1 · Le cadre du cours
//
// La seule page du chapitre où le cadre a droit de cité : prérequis, objectifs,
// plan, dettes. Tout le reste est coupé.
//
// AUCUN TERME N'EST EMPLOYÉ ICI AVANT SA DÉFINITION. Les objectifs, le plan et
// la table des dettes sont écrits avec les seuls mots que le lecteur possède en
// arrivant : image, pixel, nombre, trait, colonne, calcul, modèle. Les mots du
// chapitre (poids, biais, couche, activation, ReLU, softmax, sigmoïde, région
// de décision) n'apparaissent qu'à la page qui les pose. La table de contrôle
// est dans À-FUSIONNER.md.
//
// L'ordre des notions du chapitre est celui de la série de Grant Sanderson sur
// les réseaux de neurones. La mention tient ici en une phrase ; le détail des
// cinq écarts est à la page 12, et nulle part ailleurs.
// ─────────────────────────────────────────────────────────────────────────────

export const P01_CADRE: Bloc[] = [
  {
    id: "b-r1-0",
    type: "texte",
    texte:
      "Tu reconnais le chiffre ci-dessous sans y penser, et tu serais bien en peine d'expliquer à quelqu'un comment tu t'y es pris. Une machine, elle, ne fait que ce qu'on lui a écrit. Peut-on lui écrire de quoi lire un chiffre tracé à la main, et savoir ensuite pourquoi elle y arrive ?",
  },
  {
    id: "b-r1-fig0",
    type: "image",
    ancre: "lecture",
    src: "/cours/lecon2/l2-fig00-lecture.svg",
    largeur: 1380,
    hauteur: 470,
    alt: "À gauche, une image carrée de vingt-huit sur vingt-huit pixels : un sept manuscrit en encre sombre sur fond papier. Une flèche part vers la droite jusqu'à une boîte rectangulaire vide, portant en son seul centre f indice thêta. Une seconde flèche en sort et mène à un grand chiffre sept en brique, sous lequel se lit « le chiffre lu ».",
    legende:
      "Une image entre, un chiffre sort. Tout le chapitre construit et mesure la boîte du milieu.",
  },
  {
    id: "b-r1-fig0-lecture",
    type: "texte",
    texte:
      "L'image de gauche est un carré de 28 pixels sur 28, où quelqu'un a tracé un 7 à la main, et le 7 de droite est la réponse que la boîte donne pour cette image. La boîte du milieu, elle, porte un nom, $f_{\\boldsymbol{\\theta}}$, et c'est tout ce qu'on en sait pour l'instant.\n\nCe qu'il y a dedans tient en une image, et rien n'y est à retenir.",
  },
  {
    id: "b-r1-fig20",
    type: "image",
    ancre: "le-reseau-entier",
    src: "/cours/lecon2/l2-fig20-le-reseau-entier.svg",
    largeur: 1380,
    hauteur: 700,
    alt: "À gauche, une grille carrée de vingt-huit sur vingt-huit pixels portant un sept manuscrit en encre sombre. Une flèche mène à trois colonnes de ronds vides, alignées de gauche à droite. La première montre quatre ronds séparés par trois points de suspension, et porte dessous le nombre sept cent quatre-vingt-quatre et la mention une par pixel. La deuxième est bâtie de même et porte dessous cent vingt-huit. La troisième montre ses dix ronds, et porte dessous le nombre dix et la mention une par chiffre. Chaque rond d'une colonne est relié par un filet gris pâle à tous les ronds de la colonne suivante. Le huitième rond de la dernière colonne est plein, en brique ; une flèche en part et mène à un grand chiffre sept en brique, sous lequel se lit le chiffre lu.",
    legende:
      "La boîte de la figure précédente, ouverte.",
  },
  {
    id: "b-r1-fig20-lecture",
    type: "texte",
    texte:
      "La première des trois colonnes porte un rond par pixel de l'image, soit 784, et la dernière en porte dix, un par chiffre possible, rangés de 0 à 9 : le rond allumé est le huitième, et c'est le 7. La colonne du milieu en porte 128, et ce nombre ne se déduit ni de l'image ni des dix chiffres, puisque quelqu'un l'a choisi.\n\nChaque rond d'une colonne rejoint tous les ronds de la suivante, et chaque trait porte un nombre. Cet assemblage de colonnes et de traits est ce qu'on appelle un **réseau**.",
  },
  {
    id: "b-r1-0b",
    type: "titre",
    niveau: 2,
    texte: "La tâche, et le chemin",
  },
  {
    id: "b-r1-1",
    type: "texte",
    texte:
      "La boîte reçoit un chiffre manuscrit tracé dans un carré de 28 pixels sur 28, et doit dire quel chiffre c'est.\n\nLa plus simple qu'on puisse écrire ne franchit qu'une étape entre l'image et la réponse, c'est-à-dire un seul passage d'une colonne de ronds à la suivante. Il y a une chose qu'elle ne pourra jamais faire, quels que soient les nombres qu'on met dedans, et une étape de plus n'y changera rien. Ce qui change tout est une pièce qui tient en une ligne.",
  },
  {
    id: "b-r1-1c",
    type: "titre",
    niveau: 3,
    texte: "Ce que la boîte est à l'arrivée",
  },
  {
    id: "b-r1-1b",
    type: "texte",
    texte:
      "À l'arrivée, la boîte est une fonction : elle prend les 784 valeurs de pixels d'une image et rend dix nombres positifs de somme 1, un par chiffre possible. Le chiffre lu est celui dont le nombre est le plus grand, et c'est ce rond-là que la figure montre allumé.\n\nElle contient 101 770 nombres en tout. Les traits en portent la plus grande part, et chaque rond des deux dernières colonnes en porte un de plus, que la page 4 nomme.",
  },
  {
    id: "b-r1-2",
    type: "texte",
    texte:
      "D'où viennent ces 101 770 nombres ? La question n'aura pas de réponse ici. Chaque valeur citée sort d'un modèle que le programme `cours/lecon2/mesures.py` a déjà **entraîné**, c'est-à-dire dont il a choisi les nombres tout seul, par le procédé qu'expose le chapitre 3, et la citation le dit à chaque fois.",
  },
  {
    id: "b-r1-3",
    type: "titre",
    niveau: 2,
    texte: "Prérequis",
  },
  {
    id: "b-r1-4",
    type: "liste",
    ordonnee: true,
    elements: [
      "Le **produit matriciel** et la règle des dimensions : $A\\in\\mathcal{M}_{m,n}(\\mathbb{R})$ et $B\\in\\mathcal{M}_{n,p}(\\mathbb{R})$ donnent $AB\\in\\mathcal{M}_{m,p}(\\mathbb{R})$, le produit n'existant pas si les deux $n$ diffèrent. La **transposée** et le **rang** d'une matrice servent aussi.",
      "Les objets du chapitre 1 : l'entrée $\\mathbf{x}$, la vérité terrain, le jeu de données $\\mathcal{D}$, la famille $f_{\\boldsymbol{\\theta}}$, la perte $\\ell$.",
      "L'**exponentielle** et le **logarithme népérien** : $\\exp(u+v)=\\exp(u)\\exp(v)$, $\\exp$ strictement croissante et à valeurs dans $\\mathbb{R}_{>0}$, $\\ln$ sa réciproque sur $\\mathbb{R}_{>0}$.",
      "La notion de **partie convexe** de $\\mathbb{R}^{d}$ : une partie $C$ telle que pour tous $u,v\\in C$ et tout $t\\in[0,1]$, $(1-t)u+tv\\in C$, autrement dit une partie dont le segment joignant deux points reste entier. Et celle de **fonction convexe**, dont le graphe reste au-dessous de chacune de ses cordes.",
    ],
  },
  {
    id: "b-r1-5",
    type: "titre",
    niveau: 2,
    texte: "Objectifs",
  },
  {
    id: "b-r1-6",
    type: "liste",
    ordonnee: true,
    elements: [
      "**Mettre une image carrée à plat** en une colonne de nombres, et démontrer que rien ne s'y perd, sauf de savoir quels pixels se touchaient.",
      "**Écrire la plus petite pièce de calcul** qui regarde l'image entière, et la regarder elle-même comme une image.",
      "**Fabriquer cette pièce à la main**, sans rien entraîner, la mettre en défaut sur une image faite exprès, puis la réparer.",
      "**Transformer dix nombres quelconques en dix probabilités**, et démontrer que chacune dépend des neuf autres.",
      "**Démontrer** qu'un modèle qui ne fait qu'un calcul ne peut pas séparer certaines images, et que ni l'entraînement ni le réglage n'y changent rien.",
      "**Démontrer** que deux calculs de suite, sans rien entre eux, refont exactement le même modèle qu'un seul.",
      "**Démontrer** que la pièce manquante donne au modèle une forme neuve, et compter en combien de morceaux elle le découpe.",
      "**Compter les nombres** d'un réseau de taille quelconque, par une formule puis sur un cas.",
      "**Vérifier** ce que la colonne du milieu a réellement appris, au lieu de le supposer.",
    ],
  },
  {
    id: "b-r1-7",
    type: "titre",
    niveau: 2,
    texte: "Plan, de la page 2 à la page 12",
  },
  {
    id: "b-r1-8",
    type: "liste",
    ancre: "plan",
    ordonnee: true,
    elements: [
      "Compter ce que contient le jeu d'images, et fixer le seuil sous lequel un résultat ne veut rien dire",
      "Mettre une grille de pixels à plat, et mesurer ce que cela coûte",
      "Écrire la plus petite pièce de calcul qui regarde toute l'image, et la lire comme une image",
      "Fabriquer cette pièce à la main, la tromper, puis la réparer",
      "Passer d'une pièce à dix, et lire dix nombres comme une loi de probabilité",
      "Démontrer la limite de ce premier modèle, et la voir sur une image",
      "Mettre deux calculs bout à bout, et démontrer que rien n'a changé",
      "Casser la ligne droite, et compter ce qu'on y gagne",
      "Écrire le réseau complet, et compter ses nombres",
      "Regarder ce que la colonne du milieu a appris, et trancher",
      "Synthèse, formulaire, tableau des objets, erreurs fréquentes",
    ],
  },
  {
    id: "b-r1-10",
    type: "titre",
    niveau: 2,
    texte: "Ce que ce chapitre laisse au suivant",
  },
  {
    id: "b-r1-11",
    type: "texte",
    texte:
      "La question des 101 770 nombres se posera dès la page 4, et elle reviendra ensuite à chaque page. Voici où chacune des cinq questions laissées ouvertes trouve sa réponse.",
  },
  {
    id: "b-r1-12",
    type: "tableau",
    ancre: "dettes",
    cleEnTete: true,
    entetes: ["Question laissée ouverte", "Où elle se pose", "Où elle est traitée"],
    lignes: [
      [
        "D'où viennent les nombres que portent les traits",
        "Page 4 : les nombres d'une pièce de calcul sont lus, jamais construits",
        "Chapitre 3 · La descente de gradient, comment un réseau apprend",
      ],
      [
        "Comment on choisit le nombre de colonnes intermédiaires, et leur hauteur",
        "Page 10 : la valeur 128 est posée, et rien ne la justifie",
        "Chapitre 3",
      ],
      [
        "Ce qu'on paie quand la fonction à minimiser cesse d'être convexe",
        "Page 9 : la pièce qui casse la ligne droite casse aussi cette convexité",
        "Chapitre 3",
      ],
      [
        "D'où sort la forme précise de la fonction qui écrase un nombre quelconque entre $0$ et $1$",
        "Page 9 : ses propriétés sont vérifiées, sa forme est posée",
        "Fondements probabilistes · Le score et la cote",
      ],
      [
        "Comment rendre au modèle la géométrie de la grille, qu'il ne voit pas",
        "Page 3 : mettre l'image à plat rend invisible quels pixels se touchaient",
        "Réseaux convolutifs",
      ],
    ],
  },
  {
    id: "b-r1-17",
    type: "encart",
    ton: "note",
    titre: "D'où vient l'ordre de ce chapitre",
    texte:
      "L'ordre des notions suit celui du premier chapitre de la **série de Grant Sanderson sur les réseaux de neurones**, publiée sous le nom 3Blue1Brown, et la page 12 dit sur quels points le cours s'en écarte.",
  },
];
