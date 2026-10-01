"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Ce qui est coché reste coché — sur cet appareil seulement. Aucun compte,
 * aucun serveur : c'est la mémoire du navigateur, et c'est dit à l'écran.
 *
 * La mémoire du navigateur est un système extérieur à React : on s'y abonne
 * plutôt que de la recopier dans un état. Le rendu du serveur voit toujours
 * une liste vide, donc l'hydratation n'a rien à réconcilier.
 */

const VIDE: string[] = [];
const cache = new Map<string, string[]>();
const abonnes = new Set<() => void>();

function lire(cle: string): string[] {
  const connu = cache.get(cle);
  if (connu) return connu;
  let valeur: string[] = VIDE;
  try {
    const brut = window.localStorage.getItem(cle);
    if (brut) {
      const lu: unknown = JSON.parse(brut);
      if (Array.isArray(lu)) {
        valeur = lu.filter((x): x is string => typeof x === "string");
      }
    }
  } catch {
    /* mémoire indisponible : on continue sans. */
  }
  cache.set(cle, valeur);
  return valeur;
}

function ecrire(cle: string, valeur: string[]) {
  cache.set(cle, valeur);
  try {
    if (valeur.length === 0) window.localStorage.removeItem(cle);
    else window.localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    /* rien à faire */
  }
  for (const prevenir of abonnes) prevenir();
}

function sabonner(prevenir: () => void) {
  abonnes.add(prevenir);
  return () => {
    abonnes.delete(prevenir);
  };
}

export function useMarques(cle: string) {
  const marques = useSyncExternalStore(
    sabonner,
    () => lire(cle),
    () => VIDE,
  );

  const basculer = useCallback(
    (id: string) => {
      const actuel = lire(cle);
      ecrire(
        cle,
        actuel.includes(id)
          ? actuel.filter((x) => x !== id)
          : [...actuel, id],
      );
    },
    [cle],
  );

  const vider = useCallback(() => ecrire(cle, VIDE), [cle]);

  return { marques, basculer, vider };
}
