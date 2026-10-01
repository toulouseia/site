"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  EtatLecon,
  Progression,
} from "@/serveur/domaine/progression";
import { PROGRESSION_VIDE } from "@/serveur/domaine/progression";

// ─────────────────────────────────────────────────────────────────────────────
// LA PROGRESSION, CÔTÉ NAVIGATEUR.
//
// Sans compte, il n'y a qu'un endroit où ranger ce qu'un étudiant a fait : son
// navigateur. Ce magasin implémente EXACTEMENT la même forme que le port
// serveur (`DepotProgression`) et produit le même objet `Progression`. Les
// calculs, avancement, reprise, série, sont ceux du domaine, partagés.
//
// LA BASCULE. Le jour où les comptes existent, ce fichier garde son interface
// et change de corps : `lire()` appelle une route, `ecrire()` en appelle une
// autre, et la première connexion pousse la progression locale au serveur au
// lieu de la jeter. Aucun écran n'est touché, ils appellent `useProgression()`.
//
// LE RENDU SERVEUR voit toujours la progression vide : c'est ce que
// `getServerSnapshot` renvoie. Il n'y a donc rien à réconcilier à
// l'hydratation, et aucun écran ne doit afficher un pourcentage tant que le
// navigateur n'a pas parlé, d'où `pret`, que les composants utilisent pour
// réserver la place sans mentir.
// ─────────────────────────────────────────────────────────────────────────────

const CLE = "n7ia.academy.progression.v1";

let cache: Progression | null = null;
const abonnes = new Set<() => void>();

function maintenant() {
  return new Date().toISOString();
}

function lire(): Progression {
  if (cache) return cache;
  let valeur = PROGRESSION_VIDE;
  try {
    const brut = window.localStorage.getItem(CLE);
    if (brut) {
      const lu: unknown = JSON.parse(brut);
      if (typeof lu === "object" && lu !== null) {
        const p = lu as Partial<Progression>;
        valeur = {
          visiteurId: typeof p.visiteurId === "string" ? p.visiteurId : "anonyme",
          inscriptions: Array.isArray(p.inscriptions) ? p.inscriptions : [],
          lecons:
            typeof p.lecons === "object" && p.lecons !== null ? p.lecons : {},
          maj: typeof p.maj === "string" ? p.maj : "",
        };
      }
    }
  } catch {
    /* mémoire indisponible ou contenu illisible : on repart de vide. */
  }
  cache = valeur;
  return valeur;
}

function ecrire(suivant: Progression) {
  cache = { ...suivant, maj: maintenant() };
  try {
    window.localStorage.setItem(CLE, JSON.stringify(cache));
  } catch {
    /* quota plein ou navigation privée : on garde en mémoire pour la session. */
  }
  for (const prevenir of abonnes) prevenir();
}

function sabonner(prevenir: () => void) {
  abonnes.add(prevenir);
  return () => {
    abonnes.delete(prevenir);
  };
}

// ── Le contexte ─────────────────────────────────────────────────────────────

export type Magasin = {
  progression: Progression;
  /** Faux pendant le rendu serveur et la première image. */
  pret: boolean;
  marquer: (leconId: string, etat: EtatLecon) => void;
  ouvrir: (coursId: string, leconId: string) => void;
  commencer: (coursId: string) => void;
  oublierCours: (coursId: string) => void;
  toutOublier: () => void;
};

const Contexte = createContext<Magasin | null>(null);

export function FournisseurProgression({ children }: { children: ReactNode }) {
  const progression = useSyncExternalStore(
    sabonner,
    lire,
    () => PROGRESSION_VIDE,
  );
  const pret = useSyncExternalStore(
    sabonner,
    () => true,
    () => false,
  );

  const marquer = useCallback((leconId: string, etat: EtatLecon) => {
    const actuel = lire();
    const lecons = { ...actuel.lecons };
    if (etat === "neuve") delete lecons[leconId];
    else lecons[leconId] = { leconId, etat, vue: maintenant() };
    ecrire({ ...actuel, lecons });
  }, []);

  /**
   * Ouvrir une leçon : on note la position de reprise, et on ne dégrade
   * jamais une leçon déjà terminée. Rouvrir ce qu'on a fini est normal ; le
   * compter comme non fait ne l'est pas.
   */
  const ouvrir = useCallback((coursId: string, leconId: string) => {
    const actuel = lire();
    const connue = actuel.lecons[leconId];
    const lecons = { ...actuel.lecons };
    lecons[leconId] = {
      leconId,
      etat: connue?.etat === "terminee" ? "terminee" : "ouverte",
      vue: maintenant(),
    };

    const inscriptions = actuel.inscriptions.some((i) => i.coursId === coursId)
      ? actuel.inscriptions.map((i) =>
          i.coursId === coursId ? { ...i, dernierePosition: leconId } : i,
        )
      : [
          ...actuel.inscriptions,
          { coursId, debut: maintenant(), dernierePosition: leconId },
        ];

    ecrire({ ...actuel, lecons, inscriptions });
  }, []);

  const commencer = useCallback((coursId: string) => {
    const actuel = lire();
    if (actuel.inscriptions.some((i) => i.coursId === coursId)) return;
    ecrire({
      ...actuel,
      inscriptions: [
        ...actuel.inscriptions,
        { coursId, debut: maintenant() },
      ],
    });
  }, []);

  const oublierCours = useCallback((coursId: string) => {
    const actuel = lire();
    ecrire({
      ...actuel,
      inscriptions: actuel.inscriptions.filter((i) => i.coursId !== coursId),
    });
  }, []);

  const toutOublier = useCallback(() => {
    try {
      window.localStorage.removeItem(CLE);
    } catch {
      /* rien à faire */
    }
    cache = null;
    ecrire(PROGRESSION_VIDE);
  }, []);

  const valeur = useMemo<Magasin>(
    () => ({
      progression,
      pret,
      marquer,
      ouvrir,
      commencer,
      oublierCours,
      toutOublier,
    }),
    [progression, pret, marquer, ouvrir, commencer, oublierCours, toutOublier],
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useProgression(): Magasin {
  const magasin = useContext(Contexte);
  if (!magasin) {
    throw new Error(
      "useProgression doit être appelé sous <FournisseurProgression>.",
    );
  }
  return magasin;
}
