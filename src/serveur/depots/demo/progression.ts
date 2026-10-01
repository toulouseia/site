import type { Progression } from "@/serveur/domaine/progression";
import { PROGRESSION_VIDE } from "@/serveur/domaine/progression";
import type { DepotComptes, DepotProgression } from "@/serveur/ports";

// ─────────────────────────────────────────────────────────────────────────────
// Progression et comptes, côté serveur.
//
// AUJOURD'HUI CE DÉPÔT EST VIDE, ET C'EST EXACT : sans compte, le serveur ne
// connaît la progression de personne. Elle vit dans le navigateur, gérée par
// `composants/academy/progression.tsx`, qui implémente la MÊME forme
// (`Progression`) et les mêmes calculs.
//
// Ce que ce fichier apporte malgré tout :
//   - le port est implémenté, donc le code serveur qui en dépend compile ;
//   - le rendu serveur d'un écran de progression ne plante pas, il affiche
//     l'état vide, et le navigateur le remplace après hydratation ;
//   - le jour de la bascule, on remplace `progressionDemo` par
//     `progressionPrisma` dans `contexte.ts`, et rien d'autre.
//
// Ce n'est PAS un cache en mémoire du serveur : un tel cache serait faux dès
// qu'il y a deux instances, et donnerait l'illusion de marcher en local.
// ─────────────────────────────────────────────────────────────────────────────

export const progressionDemo: DepotProgression = {
  async obtenir(visiteurId): Promise<Progression> {
    return { ...PROGRESSION_VIDE, visiteurId };
  },

  async remplacer() {
    // Sans compte, le serveur n'a nulle part où écrire. Le navigateur a déjà
    // enregistré ; ignorer ici est la bonne réponse, pas un oubli.
  },
};

export const comptesDemo: DepotComptes = {
  async obtenir() {
    return null;
  },
  async obtenirPersonne() {
    return null;
  },
};
