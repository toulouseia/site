import type { Bloc } from "@/serveur/domaine/blocs";
import { CADRE } from "./panorama/cadre";
import { S1_INTUITION } from "./panorama/s1-intuition";
import { S2_FIL } from "./panorama/s2-fil";
import { S3_OBJETS } from "./panorama/s3-objets";
import { S4_PERTE } from "./panorama/s4-perte";
import { S5_OPTIMISER } from "./panorama/s5-optimiser";
import { S6_FAMILLES } from "./panorama/s6-familles";
import { S7_REGRESSION } from "./panorama/s7-regression";
import { S8_DEMONSTRATION } from "./panorama/s8-demonstration";
import { S9_BOUTONS } from "./panorama/s9-boutons";
import { S10_CLOTURE } from "./panorama/s10-cloture";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 1 : « Panorama du machine learning ».
//
// Une section de la spécification par fichier. Ce n'est pas un découpage
// esthétique : une section est l'unité qu'un auteur relit d'une traite, et
// c'est aussi l'unité que l'étudiant coche. Un seul fichier de trois mille
// lignes se relirait mal, se fusionnerait mal, et personne ne saurait dire
// où commence la responsabilité de qui.
//
// Le fil conducteur des sections 2 à 9 est unique : estimer le prix d'un
// logement. Une seconde matière le croise deux fois, et deux fois pour la même
// raison — c'est le seul problème du chapitre où l'on calcule au lieu
// d'affirmer : les chiffres manuscrits, en 2.4 pour écarter par la mesure les
// règles portant sur un pixel isolé, en 7.4 pour montrer que le classement des
// erreurs suit le codage des classes.
//
// Les nombres cités sortent de deux programmes exécutés : cours/lecon1/prix.py
// pour les sections 8 et 9, cours/lecon1/chiffres.py pour les sections 1 et 9.
// Les animations sortent de animations/scenes/panorama/.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_PANORAMA: Record<string, Bloc[]> = {
  "l-pano-0": CADRE,
  "l-pano-1": S1_INTUITION,
  "l-pano-2": S2_FIL,
  "l-pano-3": S3_OBJETS,
  "l-pano-4": S4_PERTE,
  "l-pano-5": S5_OPTIMISER,
  "l-pano-6": S6_FAMILLES,
  "l-pano-7": S7_REGRESSION,
  "l-pano-8": S8_DEMONSTRATION,
  "l-pano-9": S9_BOUTONS,
  "l-pano-10": S10_CLOTURE,
};
