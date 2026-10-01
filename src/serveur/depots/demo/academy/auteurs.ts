import type { Auteur } from "@/serveur/domaine/academy";

// Qui signe les cours. Des personnes réelles, et c'est ce qui les sépare des
// porteurs de `club/personnes.ts`, tous fictifs : un cours publié sous un nom
// inventé attribuerait à quelqu'un un travail qu'il n'a pas fait.
//
// La qualité reste vide tant qu'elle n'est pas donnée par l'intéressé : l'écran
// n'affiche alors que le nom, plutôt qu'une promo ou une filière supposée.
export const AUTEURS: Auteur[] = [
  { id: "a-daniel-mbouyou", nom: "Daniel M'Bouyou", qualite: "" },
];
