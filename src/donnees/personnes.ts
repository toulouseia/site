import type { Personne } from "./types";

// Les porteurs, réels depuis le 14 septembre 2026. Chacun paraît sous le nom
// qu'il a accepté ; un prénom et une initiale tant que la personne n'a pas
// dit qu'elle voulait son nom entier.
//
// Les contacts sont ceux que chacun a choisi de donner, et ils sont tous à
// l'extérieur : l'application les affiche, elle ne fait passer aucun message.
// C'est un parti pris et non un manque — une messagerie de plus, que personne
// ne relève, enterre les demandes ; le fil où l'on est déjà, non.
//
// Tant qu'un porteur n'a pas donné d'adresse à lui, on écrit à l'association,
// qui transmet.
export const PERSONNES: Personne[] = [
  {
    id: "p-alexis",
    nom: "Alexis Briend",
    origine: "N7 · président de Toulouse IA",
    contacts: [
      { canal: "github", valeur: "Alexry375" },
      { canal: "mail", valeur: "contact@toulouseia.fr" },
    ],
  },
  {
    id: "p-sami",
    nom: "Sami E.",
    origine: "N7",
    contacts: [{ canal: "mail", valeur: "contact@toulouseia.fr" }],
  },
];
