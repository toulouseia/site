import type { Bloc } from "@/serveur/domaine/blocs";
import { R01_CADRE } from "./p01-cadre";
import { R02_CHERCHE } from "./p02-cherche";
import { R03_RECLAME } from "./p03-reclame";
import { R04_BIAIS } from "./p04-biais";
import { R05_POIDS } from "./p05-poids";
import { R06_HEBB } from "./p06-hebb";
import { R07_ACTIVATIONS } from "./p07-activations";
import { R08_SOMME } from "./p08-somme";
import { R09_REMONTER } from "./p09-remonter";
import { R10_UN_EXEMPLE } from "./p10-un-exemple";
import { R11_ALGORITHME } from "./p11-algorithme";
import { R12_SYNTHESE } from "./p12-synthese";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 4 : « Ce que fait la rétropropagation ».
//
// Une page par fichier. Une page est l'unité qu'un auteur relit d'une traite,
// et c'est aussi l'unité que l'étudiant coche.
//
// CE FICHIER EST L'AGRÉGATEUR DU CHAPITRE, et il est PROPRE au chapitre 4 :
// aucun autre agent ne l'ouvre. L'enregistrement dans le CONTENU global se
// fait dans academy/index.ts, qui est PARTAGÉ — l'import à y ajouter est écrit
// dans À-FUSIONNER.md, il n'est pas fait ici.
//
// Ce chapitre établit CE QUE FAIT l'algorithme sur le réseau 784 -> 128 -> 10,
// et le vérifie. Il ne donne pas sa forme générale à L couches : c'est le
// chapitre 5, et chaque page qui s'arrête le dit.
//
// Tous les nombres cités sortent de cours/lecon4/mesures.py, dont le protocole
// est identique à celui des chapitres 2 et 3 pour que les séries soient
// comparables. Les animations sortent de animations/scenes/retropropagation/.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_RETROPROPAGATION: Record<string, Bloc[]> = {
  "l-retro-1": R01_CADRE,
  "l-retro-2": R02_CHERCHE,
  "l-retro-3": R03_RECLAME,
  "l-retro-4": R04_BIAIS,
  "l-retro-5": R05_POIDS,
  "l-retro-6": R06_HEBB,
  "l-retro-7": R07_ACTIVATIONS,
  "l-retro-8": R08_SOMME,
  "l-retro-9": R09_REMONTER,
  "l-retro-10": R10_UN_EXEMPLE,
  "l-retro-11": R11_ALGORITHME,
  "l-retro-12": R12_SYNTHESE,
};
