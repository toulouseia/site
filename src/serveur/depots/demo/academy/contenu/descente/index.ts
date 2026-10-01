import type { Bloc } from "@/serveur/domaine/blocs";
import { D01_CADRE } from "./p01-cadre";
import { D02_ACQUIS } from "./p02-acquis";
import { D03_APPRENDRE } from "./p03-apprendre";
import { D04_DEPART } from "./p04-depart";
import { D05_COUT } from "./p05-cout";
import { D06_COUT_DU_JEU } from "./p06-cout-du-jeu";
import { D07_DIMENSION_UN } from "./p07-dimension-un";
import { D08_GRADIENT } from "./p08-gradient";
import { D09_MINI_LOTS } from "./p09-mini-lots";
import { D10_ENCODE } from "./p10-encode";
import { D11_MINIMA } from "./p11-minima";
import { D12_SYNTHESE } from "./p12-synthese";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 : « La descente de gradient, comment un réseau apprend ».
//
// Une page par fichier. Ce n'est pas un découpage esthétique : une page est
// l'unité qu'un auteur relit d'une traite, et c'est aussi l'unité que
// l'étudiant coche.
//
// CE FICHIER EST L'AGRÉGATEUR DU CHAPITRE, et il est PROPRE au chapitre 3 :
// aucun autre agent ne l'ouvre. L'enregistrement dans le CONTENU global se
// fait dans academy/index.ts, qui est PARTAGÉ — l'import à y ajouter est écrit
// dans À-FUSIONNER.md, il n'est pas fait ici.
//
// Le chapitre construit un réseau déjà donné : tous ses nombres sortent de
// cours/lecon3/mesures.py, et le protocole y est identique à celui du
// chapitre 2 pour que les deux séries soient comparables.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_DESCENTE: Record<string, Bloc[]> = {
  "l-desc-1": D01_CADRE,
  "l-desc-2": D02_ACQUIS,
  "l-desc-3": D03_APPRENDRE,
  "l-desc-4": D04_DEPART,
  "l-desc-5": D05_COUT,
  "l-desc-6": D06_COUT_DU_JEU,
  "l-desc-7": D07_DIMENSION_UN,
  "l-desc-8": D08_GRADIENT,
  "l-desc-9": D09_MINI_LOTS,
  "l-desc-10": D10_ENCODE,
  "l-desc-11": D11_MINIMA,
  "l-desc-12": D12_SYNTHESE,
};
