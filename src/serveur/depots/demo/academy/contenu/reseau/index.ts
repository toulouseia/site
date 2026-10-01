import type { Bloc } from "@/serveur/domaine/blocs";
import { P01_CADRE } from "./p01-cadre";
import { P02_JEU } from "./p02-jeu";
import { P03_VECTEUR } from "./p03-vecteur";
import { P04_NEURONE } from "./p04-neurone";
import { P05_DETECTEUR } from "./p05-detecteur";
import { P06_COUCHE } from "./p06-couche";
import { P07_PLAFOND } from "./p07-plafond";
import { P08_EMPILER } from "./p08-empiler";
import { P09_RELU } from "./p09-relu";
import { P10_COMPLET } from "./p10-complet";
import { P11_CACHE } from "./p11-cache";
import { P12_SYNTHESE } from "./p12-synthese";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 2 : « Qu'est-ce qu'un réseau de neurones ».
//
// Une page par fichier, comme au chapitre 1 : une page est l'unité qu'un auteur
// relit d'une traite, et c'est aussi l'unité que l'étudiant coche.
//
// LE CHAPITRE CONSTRUIT UNE STRUCTURE ET MESURE CE QU'ELLE VAUT. Il ne dit pas
// comment on l'entraîne. Le mot « rétropropagation » n'y figure pas, le symbole
// nabla non plus, et aucun gradient n'y est dérivé : chaque fois que la question
// « d'où viennent ces poids » se pose, elle est nommée et renvoyée au chapitre 3.
//
// Tous les nombres du chapitre sortent de cours/lecon2/mesures.py, exécuté. Le
// programme entraîne quatre modèles avec le même protocole — graine 0, mini-lots
// de 64, entropie croisée — et produit les mesures que les blocs SORTIE citent
// verbatim.
//
// LES CLÉS DE CE RECORD SONT LES IDENTIFIANTS DE LEÇON. Elles doivent
// correspondre aux entrées de LECONS dans sommaires.ts, et rien ne le vérifie :
// une clé sans entrée donne une page sans adresse, une entrée sans clé une page
// vide. Les entrées à ajouter sont listées dans À-FUSIONNER.md.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_RESEAU: Record<string, Bloc[]> = {
  "l-res-1": P01_CADRE,
  "l-res-2": P02_JEU,
  "l-res-3": P03_VECTEUR,
  "l-res-4": P04_NEURONE,
  "l-res-5": P05_DETECTEUR,
  "l-res-6": P06_COUCHE,
  "l-res-7": P07_PLAFOND,
  "l-res-8": P08_EMPILER,
  "l-res-9": P09_RELU,
  "l-res-10": P10_COMPLET,
  "l-res-11": P11_CACHE,
  "l-res-12": P12_SYNTHESE,
};
