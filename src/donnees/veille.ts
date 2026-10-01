import type { Numero } from "./types";
import { NUMERO_01 } from "./numeros/numero-01";

// Ce fichier s'écrit tout seul : `node outils/veille/composer.mjs` le refait à
// partir de `numeros/`. Pour ajouter un numéro, voir `outils/veille/LISEZ-MOI.md`.
//
// Les cinq numéros de la maquette ont été retirés le 14 septembre 2026 : ils
// étaient inventés. Un numéro marqué `brouillon` ne paraît qu'en développement.
export const NUMEROS: Numero[] = [NUMERO_01];
