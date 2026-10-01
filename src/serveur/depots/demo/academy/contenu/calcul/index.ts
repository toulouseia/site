import type { Bloc } from "@/serveur/domaine/blocs";
import { C01_CADRE } from "./p01-cadre";
import { C02_MANQUE } from "./p02-manque";
import { C03_CHAINE } from "./p03-chaine";
import { C04_ARBRE } from "./p04-arbre";
import { C05_DERIVEES } from "./p05-derivees";
import { C06_ASSEMBLAGE } from "./p06-assemblage";
import { C07_PRECEDENTE } from "./p07-precedente";
import { C08_RECURRENCE } from "./p08-recurrence";
import { C09_INDICES } from "./p09-indices";
import { C10_VECTORIELLE } from "./p10-vectorielle";
import { C11_PROFONDEUR } from "./p11-profondeur";
import { C12_SYNTHESE } from "./p12-synthese";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 5 : « Le calcul de la rétropropagation ».
//
// Une page par fichier, comme aux chapitres précédents.
//
// LE CHAPITRE ÉTABLIT LA FORME GÉNÉRALE. Le chapitre 4 a montré ce que fait
// l'algorithme, sur deux couches et une activation particulière ; celui-ci le
// démontre pour L couches et φ quelconque, par récurrence. Trois notions y sont
// CITÉES et jamais réexposées : δ de sortie égale a moins y (chapitre 2), les
// trois voies et la transposée (chapitre 4), les mini-lots et le coût des
// différences finies (chapitre 3).
//
// Tous les nombres du chapitre sortent de cours/lecon5/mesures.py, exécuté.
// Deux réseaux : un réseau à un neurone par couche, aux valeurs figées, que le
// texte calcule à la main ; et un réseau 784 -> 64 -> 64 -> 64 -> 64 -> 10 sur
// lequel la récurrence tourne quatre fois. Les blocs SORTIE citent le programme
// verbatim.
//
// LE COÛT EST COMPTÉ EN MULTIPLICATIONS, pas en secondes : une durée d'horloge
// varie d'un facteur dix selon la charge de la machine, un compte d'opérations
// non, et c'est lui que la proposition 7 majore.
//
// LES CLÉS DE CE RECORD SONT LES IDENTIFIANTS DE LEÇON. Elles doivent
// correspondre aux entrées de LECONS dans sommaires.ts, et rien ne le vérifie :
// une clé sans entrée donne une page sans adresse, une entrée sans clé une page
// vide. Les entrées à ajouter sont listées dans À-FUSIONNER.md.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_CALCUL: Record<string, Bloc[]> = {
  "l-calc-1": C01_CADRE,
  "l-calc-2": C02_MANQUE,
  "l-calc-3": C03_CHAINE,
  "l-calc-4": C04_ARBRE,
  "l-calc-5": C05_DERIVEES,
  "l-calc-6": C06_ASSEMBLAGE,
  "l-calc-7": C07_PRECEDENTE,
  "l-calc-8": C08_RECURRENCE,
  "l-calc-9": C09_INDICES,
  "l-calc-10": C10_VECTORIELLE,
  "l-calc-11": C11_PROFONDEUR,
  "l-calc-12": C12_SYNTHESE,
};
