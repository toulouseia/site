// ─────────────────────────────────────────────────────────────────────────────
// LA DURÉE D'UNE LEÇON, CALCULÉE.
//
// Elle ne s'écrit pas. Elle se déduit de ce que la page contient, par une règle
// qui tient en trois termes :
//
//     les mots de la page, à 200 mots par minute
//   + la durée des animations RENDUES qu'elle sert
//   + une minute par vérification de compréhension
//
// Une durée saisie à la main est vraie le jour où on l'écrit et fausse ensuite.
// Le sommaire du cours d'introduction annonçait 2 h 51 pour un chapitre 1 que sa
// réécriture avait ramené aux trois quarts d'heure : personne n'avait menti,
// personne n'avait rouvert le nombre. Calculée, la durée suit la page sans que
// quiconque y pense.
//
// LES TROIS TERMES, ET RIEN D'AUTRE.
//   · 200 mots par minute est une lecture attentive de français technique. Ce
//     n'est pas une mesure, c'est une convention — mais elle est la MÊME pour
//     toutes les pages, donc les durées sont comparables entre elles, ce qui
//     est ce qu'un sommaire sert à faire.
//   · Une animation qui n'est pas rendue ne dure rien : la page ne la montre
//     pas, elle montre le cadre qui dit qu'elle manque. Compter son estimation
//     ferait payer à l'étudiant un temps qu'il ne passe pas.
//   · Une vérification demande de poser le calcul. Une minute est un plancher
//     honnête, et le seul terme du compte qui ne soit pas de la lecture.
//
// Le champ `minutes` d'un bloc exercice n'entre PAS dans ce compte : c'est un
// nombre écrit à la main, donc exactement ce que ce module remplace.
// ─────────────────────────────────────────────────────────────────────────────

import type { Bloc, IdAnimation } from "./blocs";
import { texteDuBloc } from "./blocs";

/** Une lecture attentive de français technique, figures et formules comprises. */
export const MOTS_PAR_MINUTE = 200;

/** Ce que coûte une vérification : poser le calcul, pas le lire. */
export const MINUTES_PAR_VERIFICATION = 1;

/** Les mots d'un texte. Tout groupe de caractères non blancs en est un. */
export function compterMots(texte: string): number {
  return texte.match(/\S+/g)?.length ?? 0;
}

/**
 * La durée d'une animation, en secondes, ou zéro si elle n'est pas rendue.
 * C'est un paramètre plutôt qu'une lecture du manifeste : ce module ne connaît
 * ni fichier ni dépôt, et il se teste avec une table de trois entrées.
 */
export type DureeAnimation = (id: IdAnimation) => number;

/**
 * Les minutes d'une leçon, arrondies. Une leçon sans contenu vaut zéro — c'est
 * ce que les écrans affichent comme « à écrire » — et toute leçon qui porte
 * quelque chose vaut au moins une minute.
 */
export function minutesDeLaLecon(
  blocs: readonly Bloc[],
  dureeAnimation: DureeAnimation,
): number {
  if (blocs.length === 0) return 0;

  let mots = 0;
  let secondes = 0;
  let verifications = 0;

  for (const bloc of blocs) {
    mots += compterMots(texteDuBloc(bloc));
    if (bloc.type === "animation") secondes += dureeAnimation(bloc.animationId);
    if (bloc.type === "verification") verifications += 1;
  }

  const minutes =
    mots / MOTS_PAR_MINUTE +
    secondes / 60 +
    verifications * MINUTES_PAR_VERIFICATION;

  return Math.max(1, Math.round(minutes));
}
