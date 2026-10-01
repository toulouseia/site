import type { Outil, ReponseAgent } from "@/serveur/domaine/club";

export const OUTILS: Outil[] = [
  {
    id: "o-moodle",
    nom: "Le Moodle qui répond",
    resume: "Question en langage courant, réponse avec la page exacte.",
    etat: "essai",
    fiches: [
      { etiquette: "Fonds indexé", valeur: "Supports déposés par les enseignants" },
      { etiquette: "Réponse", valeur: "Extrait, document, page" },
      { etiquette: "Limite connue", valeur: "Les schémas ne sont pas encore lus" },
    ],
    commande: "Poser une question",
    projetSlug: "moodle-qui-repond",
  },
  {
    id: "o-gabarit",
    nom: "Gabarit de projet",
    resume: "Squelette de dépôt : données, entraînement, évaluation, carte modèle.",
    etat: "envisage",
    fiches: [
      { etiquette: "Contient", valeur: "Arborescence, carnets, carte modèle vide" },
      { etiquette: "Manque", valeur: "Quelqu'un pour l'écrire" },
    ],
    commande: "Se proposer",
  },
  {
    id: "o-relecture",
    nom: "Relecture de rapport",
    resume: "Charpente, figures, longueur des phrases, avant le rendu.",
    etat: "envisage",
    fiches: [
      { etiquette: "Source", valeur: "Projet Relecture, en essai" },
      { etiquette: "Manque", valeur: "Les règles de style, écrites" },
    ],
    commande: "Se proposer",
    projetSlug: "relecture",
  },
  {
    id: "o-annales",
    nom: "Banque d'annales",
    resume: "Sujets et corrigés cherchables par notion.",
    etat: "envisage",
    fiches: [
      { etiquette: "Source", valeur: "Projet Base ouverte des annales" },
      { etiquette: "Manque", valeur: "Le cadre juridique, puis tout le reste" },
    ],
    commande: "Se proposer",
    projetSlug: "annales",
  },
];

// Réponses préenregistrées : l'application n'appelle aucun service.
export const REPONSES_AGENT: ReponseAgent[] = [
  {
    question: "Où sont les TP de traitement du signal ?",
    reponse:
      "Quatre sujets de travaux pratiques et leurs corrigés, déposés sur l'espace du cours. Le sujet 3 porte sur le filtrage adaptatif, c'est celui qui revient le plus souvent aux examens.",
    sources: [
      { titre: "TP-signal-2026.pdf", detail: "pages 1 à 14 · déposé le 12 mars" },
      { titre: "Corrigés-TP-signal.pdf", detail: "pages 3 à 9 · déposé le 2 avril" },
    ],
  },
  {
    question: "Quelle différence entre validation croisée et jeu de validation ?",
    reponse:
      "Le jeu de validation met de côté une part fixe des données. La validation croisée fait tourner ce découpage, ce qui donne une estimation plus stable quand les données sont peu nombreuses, au prix d'autant d'entraînements que de découpages.",
    sources: [
      { titre: "Apprentissage statistique, chapitre 4", detail: "pages 51 à 58" },
      { titre: "Fiche de révision ModIA", detail: "page 2" },
    ],
  },
  {
    question: "Un exemple de rapport de projet bien noté ?",
    reponse:
      "Trois rapports sont donnés en exemple sur l'espace de la matière. Le point commun des trois : une page de méthode avant les résultats, et des figures légendées qui se lisent sans le texte.",
    sources: [
      { titre: "Exemples-rapports.zip", detail: "3 fichiers · déposé le 18 janvier" },
      { titre: "Grille d'évaluation", detail: "page 1" },
    ],
  },
  {
    question: "Comment installer l'environnement du cours de vision ?",
    reponse:
      "Le fichier d'environnement est fourni avec le premier TP. Sur les machines de l'école, la carte graphique n'est pas accessible depuis les sessions étudiantes : le TP est prévu pour tourner sur processeur.",
    sources: [
      { titre: "TP1-vision · README", detail: "section « Installation »" },
      { titre: "Environnement.yml", detail: "déposé le 5 février" },
    ],
  },
];
