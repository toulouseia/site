import "server-only";

import type { Depots } from "./ports";
import { catalogueDemo } from "./depots/demo/academy";
import { animationsDemo } from "./depots/demo/animations";
import {
  outilsDemo,
  projetsDemo,
  ressourcesDemo,
  veilleDemo,
} from "./depots/demo/club";
import { comptesDemo, progressionDemo } from "./depots/demo/progression";

// ─────────────────────────────────────────────────────────────────────────────
// LA RACINE DE COMPOSITION.
//
// Le seul endroit de l'application qui sache quelle implémentation de chaque
// port est utilisée. Un seul fichier à changer pour brancher une base :
//
//     import { cataloguePrisma } from "./depots/prisma/catalogue";
//     ...
//     catalogue: process.env.DATABASE_URL ? cataloguePrisma : catalogueDemo,
//
// Pourquoi une fonction et pas une constante exportée : sur un hébergement qui
// démarre et arrête des instances, un objet construit au chargement du module
// capture des connexions qui ne survivent pas toujours au gel de l'instance.
// La fonction, elle, se rappelle à chaque requête ; le `??=` évite de tout
// reconstruire tant que le processus vit.
//
// `import "server-only"` en tête : si un composant client importe ce fichier,
// même indirectement, la construction échoue avec un message clair au lieu de
// livrer le catalogue entier dans le paquet du navigateur.
// ─────────────────────────────────────────────────────────────────────────────

let depots: Depots | null = null;

export function obtenirDepots(): Depots {
  depots ??= {
    catalogue: catalogueDemo,
    progression: progressionDemo,
    comptes: comptesDemo,
    animations: animationsDemo,
    projets: projetsDemo,
    ressources: ressourcesDemo,
    veille: veilleDemo,
    outils: outilsDemo,
  };
  return depots;
}

/**
 * Remplace les dépôts. Réservé aux tests : un test qui doit passer par la
 * racine de composition pour injecter un faux est un test qui documente
 * l'architecture au lieu de la contourner.
 */
export function remplacerDepots(remplacement: Partial<Depots>): void {
  depots = { ...obtenirDepots(), ...remplacement };
}
