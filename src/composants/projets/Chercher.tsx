"use client";

import { useEffect, useRef } from "react";
import type { ProjetComplet } from "@/donnees/api";
import type { Pole } from "@/donnees/types";
import { Icone } from "@/composants/base/Icone";
import { Etq } from "@/composants/base/Atomes";
import { NOM_ETAT, cx } from "@/lib/format";
import { NOM_TRI, reglagesActifs, type Reglages } from "@/lib/tri-projets";
import { useReglages } from "./contexte";

const POLES: Pole[] = ["Agentic", "ModIA", "Embedded", "Hackathon"];

/**
 * Tout ce qui a quitté l'écran d'arrivée : la recherche, le tri, les sept
 * filtres, le compte. Ils n'ont pas disparu, ils sont derrière la seule
 * commande de l'écran — et ils y tiennent tous ensemble, ce qui n'était pas
 * le cas quand ils occupaient deux barres devant les projets.
 */
export function Chercher({
  projets,
  resultats,
  onChoisir,
  onFermer,
}: {
  projets: ProjetComplet[];
  resultats: ProjetComplet[];
  onChoisir: (slug: string) => void;
  onFermer: () => void;
}) {
  const { reglages: r, regler: setR, remettre } = useReglages();
  const champ = useRef<HTMLInputElement>(null);
  const actifs = reglagesActifs(r);

  useEffect(() => {
    champ.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFermer]);

  function basculerPole(p: Pole) {
    setR((v) => ({
      ...v,
      poles: v.poles.includes(p)
        ? v.poles.filter((x) => x !== p)
        : [...v.poles, p],
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col lg:items-center lg:justify-center lg:p-8">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onFermer}
        className="absolute inset-0 hidden bg-encre/35 lg:block"
      />

      <div className="an-monte relative flex h-full w-full flex-col border-filet-fort bg-papier lg:h-auto lg:max-h-full lg:w-[42rem] lg:border">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-3">
          <Icone nom="recherche" className="h-4 w-4 shrink-0 text-gris-58" />
          <input
            ref={champ}
            type="search"
            value={r.q}
            onChange={(e) => setR((v) => ({ ...v, q: e.target.value }))}
            placeholder="Nom, outil, porteur…"
            aria-label="Rechercher un projet"
            className="t-corps h-full min-w-0 flex-1 border-0 bg-transparent text-[0.9375rem] outline-none placeholder:text-gris-40"
          />
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="cmd cmd-nu cmd-s -mr-1 px-2"
          >
            <Icone nom="croix" className="h-4 w-4" />
          </button>
        </div>

        <div className="shrink-0 border-b border-filet px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Etq>Trier</Etq>
            <label className="relative">
              <span className="sr-only">Trier par</span>
              <select
                value={r.tri}
                onChange={(e) =>
                  setR((v) => ({ ...v, tri: e.target.value as Reglages["tri"] }))
                }
                className="t-etq h-7 cursor-pointer appearance-none border border-filet-fort bg-papier py-0 pr-6 pl-2 text-encre hover:border-gris-58 focus:border-encre focus:outline-none"
              >
                {(Object.keys(NOM_TRI) as Reglages["tri"][]).map((t) => (
                  <option key={t} value={t}>
                    {NOM_TRI[t]}
                  </option>
                ))}
              </select>
              <Icone
                nom="chevron-bas"
                className="pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2 text-gris-58"
              />
            </label>
            <span className="flex-1" />
            <span className="t-cote text-[0.8125rem] text-brique">
              {resultats.length}
            </span>
            <span className="t-etq text-gris-58">/ {projets.length}</span>
          </div>

          <div className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              aria-pressed={r.ouverts}
              onClick={() => setR((v) => ({ ...v, ouverts: !v.ouverts }))}
              className="puce"
            >
              Ouverts
            </button>
            <button
              type="button"
              aria-pressed={r.categorie === "open"}
              onClick={() =>
                setR((v) => ({
                  ...v,
                  categorie: v.categorie === "open" ? "tout" : "open",
                }))
              }
              className="puce"
            >
              Open
            </button>
            <button
              type="button"
              aria-pressed={r.categorie === "business"}
              onClick={() =>
                setR((v) => ({
                  ...v,
                  categorie: v.categorie === "business" ? "tout" : "business",
                }))
              }
              className="puce"
            >
              Business
            </button>
            <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-filet-fort" />
            {POLES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={r.poles.includes(p)}
                onClick={() => basculerPole(p)}
                className="puce"
              >
                {p}
              </button>
            ))}
            {actifs > 0 ? (
              <button
                type="button"
                onClick={remettre}
                className="cmd cmd-nu cmd-s shrink-0"
              >
                <Icone nom="croix" className="h-3 w-3" />
                Effacer
              </button>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)] lg:max-h-[26rem] lg:pb-0">
          {resultats.length === 0 ? (
            <div
              className="trame trame-bord flex min-h-[14rem] flex-col items-center justify-center gap-4 px-6 text-center"
              style={{ ["--trame-op" as string]: "0.16" }}
            >
              <p className="t-etq-l border border-filet-fort bg-papier px-4 py-3 text-encre">
                Aucun projet ne répond
              </p>
              <button
                type="button"
                onClick={remettre}
                className="cmd cmd-trait cmd-s"
              >
                Tout remettre
              </button>
            </div>
          ) : (
            <ul>
              {resultats.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onChoisir(p.slug)}
                    className="flex w-full items-center gap-3 border-b border-filet px-3 py-2.5 text-left transition-colors duration-100 hover:bg-gris-04"
                  >
                    <span className="t-corps-f min-w-0 flex-1 truncate text-[0.875rem]">
                      {p.nom}
                    </span>
                    {/* Pas de jauge ici : à dix-sept pixels, quatre crans font
                        quatre fois la même tache. Le mot, lui, se lit. */}
                    <span className="t-tech w-[4.6rem] shrink-0 text-right text-[0.6875rem] text-gris-58">
                      {p.enPause ? "En pause" : NOM_ETAT[p.etat]}
                    </span>
                    {/* Un carré de brique pour « ouvert aux échanges » : à
                        cette largeur, le mot ne tiendrait pas. */}
                    {!p.enPause && p.accueil === "ouvert" ? (
                      <span
                        aria-label="ouvert aux échanges"
                        className="h-[7px] w-[7px] shrink-0 bg-brique"
                      />
                    ) : (
                      <span className="w-[7px] shrink-0" />
                    )}
                    <Icone
                      nom="chevron-droite"
                      className={cx("h-3.5 w-3.5 shrink-0 text-gris-40")}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
