import type { Projet } from "./types";

// Les projets vivent désormais tous dans la base, déposés par le formulaire : ils
// y sont modifiables et portent leurs membres. Ce fichier ne garde plus aucun
// projet en dur.
//
// « site » lui-même est passé en base le 1er octobre 2026, une fois son dépôt
// public ouvert (toulouseia/site) : un projet « ouvert » exige un dépôt public,
// et il en a enfin un. Cette liste reste, vide, comme point de secours : si un
// jour un projet ne peut pas entrer en base, on l'écrit ici et le mur le
// fusionne par slug (la base l'emporte), ce qui garantit qu'il s'affiche quoi
// qu'il arrive au serveur.

export const PROJETS: Projet[] = [];
