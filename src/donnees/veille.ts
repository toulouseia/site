import type { Numero } from "./types";
import { NUMERO_01 } from "./numeros/numero-01";
import { NUMERO_02 } from "./numeros/numero-02";
import { NUMERO_03 } from "./numeros/numero-03";
import { NUMERO_04 } from "./numeros/numero-04";

// Ce fichier s'écrit tout seul : `node outils/veille/composer.mjs` le refait à
// partir de `numeros/`. Pour ajouter un numéro, voir `outils/veille/LISEZ-MOI.md`.
//
// Les cinq numéros de la maquette ont été retirés le 14 septembre 2026 : ils
// étaient inventés. Un numéro marqué `brouillon` ne paraît qu'en développement.
export const NUMEROS: Numero[] = [NUMERO_01, NUMERO_02, NUMERO_03, NUMERO_04];
