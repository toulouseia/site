import type { Cours } from "@/serveur/domaine/academy";

// ─────────────────────────────────────────────────────────────────────────────
// Les cours du programme.
//
// IL Y EN A DEUX, et c'est la règle du dépôt qui le dit : un cours n'entre ici
// que lorsque son contenu existe pour de vrai. Les onze fiches qui occupaient
// ce fichier décrivaient des cours que personne n'avait écrits, et un catalogue
// qui annonce ce qui n'existe pas ne vaut pas mieux qu'une page vide, il ment
// en plus.
//
// Les parcours, eux, restent tous les cinq : ce sont les axes du club, et un
// parcours sans cours affiche son état vide, ce qui est exact.
//
// CETTE PAGE EST UNE VITRINE, pas un journal de fabrication. Ce qui s'y écrit
// s'adresse à quelqu'un qui hésite à cliquer : ce qu'on apprend, à qui ça
// s'adresse, ce qu'on saura faire à la fin. Le vocabulaire de l'atelier —
// mesure, programme versionné, dette réglée, théorie contredite — reste dans
// `contenu/REGLES.md`, qui est fait pour lui.
//
// Les champs `minutes`, `nbLecons` et `nbChapitres` sont DÉRIVÉS : recalculés
// par le dépôt depuis les blocs de chaque leçon, jamais lus d'ici. Les zéros
// écrits ci-dessous ne sont pas des valeurs, ce sont des places tenues.
// ─────────────────────────────────────────────────────────────────────────────

const VIDE = { minutes: 0, nbLecons: 0, nbChapitres: 0 };

export const COURS: Cours[] = [
  // ── Comprendre le Machine Learning ────────────────────────────────────────
  {
    ...VIDE,
    id: "c-intro-ml",
    slug: "introduction-au-machine-learning",
    nom: "Introduction au Machine Learning",
    resume: "Des exemples à une machine qui lit un chiffre manuscrit.",
    presentation:
      "On part d'un problème que personne ne sait écrire sous forme de règles — reconnaître un chiffre écrit à la main — et on construit pas à pas la machine qui l'apprend à partir d'exemples, jusqu'à savoir d'où vient chacun de ses réglages. Aucune connaissance en intelligence artificielle n'est demandée : il faut savoir écrire une boucle en Python, et avoir déjà dérivé une fonction.",
    parcoursId: "p-ml",
    niveau: "depart",
    statut: "publie",
    rang: 1,
    objectifs: [
      // Écrites pour quelqu'un qui ne sait encore rien, et sans LaTeX : cette
      // liste s'affiche dans une colonne étroite qui ne rend pas les formules.
      // Aucune ne nomme un objet absent des cinq chapitres — la ligne sur la
      // variance d'initialisation est partie avec le chapitre d'optimisation,
      // le 13 septembre 2026.
      "Expliquer ce qu'une machine apprend, et sur quoi elle s'appuie pour le faire",
      "Reconnaître si un problème demande de prédire une quantité ou de choisir une catégorie",
      "Lire un réseau de neurones : ses couches, ses poids, et le compte de ses réglages",
      "Calculer à la main l'erreur d'un modèle sur un exemple, et la corriger d'un pas",
      "Expliquer comment un réseau règle lui-même ses paramètres, du gradient à la rétropropagation",
    ],
    prerequis: [
      { texte: "Écrire une boucle et une fonction en Python" },
      { texte: "Vecteurs et matrices : produit scalaire, produit matriciel" },
      { texte: "Dériver une fonction d'une variable" },
    ],
    auteurIds: ["a-daniel-mbouyou"],
    maj: "2026-09-13",
  },

  // ── Les maths du Machine Learning ─────────────────────────────────────────
  //
  // Ces huit pages étaient le sixième chapitre du cours d'introduction. Elles
  // en sont sorties le 13 septembre 2026 : elles demandent Cauchy-Schwarz, un
  // développement limité et la diagonalisation d'une matrice symétrique, et un
  // cours d'entrée marqué « Débutant » ne peut pas réclamer cela. Leur contenu
  // n'a pas bougé ; seul le sommaire a changé.
  {
    ...VIDE,
    id: "c-optim",
    slug: "loptimisation-de-lentrainement",
    nom: "L'optimisation de l'entraînement",
    resume: "Ce qui décide qu'un entraînement aboutisse, ou pas.",
    presentation:
      "Direction du pas, longueur du pas, point de départ, échelle des entrées : ce cours reprend un par un les réglages qu'on applique en entraînant un réseau, et dit ce qui fixe chacun d'eux. Il se lit après le cours d'introduction, dont il suppose la descente de gradient et la rétropropagation déjà comprises.",
    parcoursId: "p-maths",
    niveau: "milieu",
    statut: "publie",
    rang: 1,
    objectifs: [
      "Expliquer pourquoi on avance dans la direction opposée au gradient, et pas dans une autre",
      "Dire jusqu'où on peut allonger le pas avant que la descente cesse de descendre",
      "Expliquer pourquoi un réseau initialisé à zéro n'apprend jamais rien",
      "Reconnaître un gradient qui s'évanouit en profondeur, et dire d'où ça vient",
    ],
    prerequis: [
      {
        texte: "Le cours d'introduction au Machine Learning",
        coursSlug: "introduction-au-machine-learning",
      },
      { texte: "Produit scalaire, norme euclidienne, inégalité de Cauchy-Schwarz" },
      { texte: "Développement limité d'ordre 1 et définition de la différentiabilité" },
      { texte: "Suites géométriques, et diagonalisation d'une matrice symétrique réelle" },
      {
        texte:
          "Espérance, variance, et additivité de la variance pour des variables indépendantes",
      },
    ],
    auteurIds: ["a-daniel-mbouyou"],
    maj: "2026-09-13",
  },
];
