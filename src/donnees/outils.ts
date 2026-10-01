import type { Annale, Outil, ReponseAgent } from "./types";

// La boîte ne montre que ce qui est fini et ouvert : un outil qu'on ne peut
// pas utiliser n'est pas un outil, c'est un projet, et les projets ont déjà
// leur écran. Les deux outils de la maquette — un Moodle qui répond, une
// banque d'annales — ont été retirés le 14 septembre 2026 : ils n'existaient
// pas. Le premier outil réel s'écrit ici.
export const OUTILS: Outil[] = [];

// Réponses préenregistrées de la maquette : plus rien tant qu'il n'y a pas
// d'outil qui réponde.
export const REPONSES_AGENT: ReponseAgent[] = [];

export const ANNALES: Annale[] = [];
