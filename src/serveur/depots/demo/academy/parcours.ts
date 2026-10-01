import type { Parcours } from "@/serveur/domaine/academy";

// ─────────────────────────────────────────────────────────────────────────────
// Les cinq parcours de l'AI Academy.
//
// Un parcours est une intention, pas un dossier : « comprendre le machine
// learning », « avoir les maths qu'il faut ». Ce qu'on met dedans se discute ;
// l'ordre, lui, se suit.
//
// Ces cinq-là sont le programme réel visé par le club pour l'année 2026-2027.
// Trois d'entre eux n'ont AUCUN cours, et leur page le dit. C'est voulu : un
// parcours vide est une intention annoncée, un parcours rempli de cours que
// personne n'a écrits est un mensonge. Le second se remarque plus tard, et
// coûte plus cher.
//
// LES NOMS ARRÊTÉS LE 13 SEPTEMBRE 2026. « Machine Learning : parcours
// fondamental » devient « Comprendre le Machine Learning » et « Hackathon
// Academy » devient « Réussir son Hackathon » : l'étudiant lit ce qu'il va
// savoir faire, pas la place de la brique dans le programme. « Séries
// temporelles » n'était pas un parcours mais une spécialité parmi d'autres :
// il devient « Spécialités », et les séries temporelles y rentrent. Les
// identifiants et les adresses des deux parcours renommés ne bougent pas ;
// seul celui qui change de nature change de slug.
// ─────────────────────────────────────────────────────────────────────────────

export const PARCOURS: Parcours[] = [
  {
    id: "p-ml",
    slug: "machine-learning",
    nom: "Comprendre le Machine Learning",
    resume: "Des données à un modèle qui tient debout.",
    presentation:
      "Le parcours d'entrée. On part de zéro : ce qu'apprendre veut dire pour une machine, comment on entraîne un premier modèle, et comment on sait qu'il ne raconte pas n'importe quoi. Aucune connaissance préalable en IA n'est demandée : il suffit de savoir écrire une boucle en Python.",
    niveau: "depart",
    statut: "publie",
    rang: 1,
    coursIds: ["c-intro-ml"],
  },
  {
    id: "p-maths",
    slug: "maths-du-machine-learning",
    nom: "Les maths du Machine Learning",
    resume: "Les quatre outils sans lesquels le reste est de la magie.",
    presentation:
      "Statistiques, probabilités, algèbre linéaire, optimisation. Pas un cours de maths : les quatre morceaux dont le machine learning se sert vraiment, pris dans l'ordre où ils servent, avec les figures qui manquent aux polycopiés.",
    niveau: "milieu",
    statut: "publie",
    rang: 2,
    coursIds: ["c-optim"],
  },
  {
    id: "p-specialites",
    slug: "specialites",
    nom: "Spécialités",
    resume: "Les domaines où le machine learning change de forme.",
    presentation:
      "Un domaine à la fois, avec ce qu'il a de particulier : ce qui vaut sur un tableau de données ordinaire n'y vaut plus forcément, et chaque cours commence par établir ce qui change. Les séries temporelles, où l'ordre porte l'information, sont la première spécialité prévue.",
    niveau: "milieu",
    statut: "publie",
    rang: 3,
    coursIds: [],
  },
  {
    id: "p-focus",
    slug: "focus-avance",
    nom: "Focus avancé",
    resume: "Un sujet de recherche, traité en profondeur.",
    presentation:
      "Des cours courts et pointus sur un travail précis, souvent un papier, souvent récent. On y va après les fondamentaux, jamais avant.",
    niveau: "fond",
    statut: "publie",
    rang: 4,
    coursIds: [],
  },
  {
    id: "p-hackathon",
    slug: "hackathon-academy",
    nom: "Réussir son Hackathon",
    resume: "Quarante-huit heures, une équipe, un truc qui marche.",
    presentation:
      "Ce qui décide du résultat d'un hackathon IA une fois que l'idée est trouvée : la méthode, le rythme, le partage du travail, et les pièges dans lesquels on tombe la première fois. Ni algorithmes ni théorie — ceux-là s'apprennent dans les autres parcours.",
    niveau: "depart",
    statut: "publie",
    rang: 5,
    coursIds: [],
  },
];
