"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ProjetComplet } from "@/donnees/api";
import type { Pole } from "@/donnees/types";
import { Icone } from "@/composants/base/Icone";
import { Jauge } from "@/composants/base/Jauge";
import { Etq, Vide } from "@/composants/base/Atomes";
import { ordreCarrousel } from "@/lib/carrousel";
import { CRAN_ETAT, NOM_ETAT, adresseProjet, cx, pluriel } from "@/lib/format";
import {
  REGLAGES_VIDES,
  filtrer,
  reglagesActifs,
  type Reglages,
} from "@/lib/tri-projets";

// ─────────────────────────────────────────────────────────────────────────────
// L'index : tout ce que l'écran d'arrivée ne montre plus.
//
// La recherche, les sept filtres, le compte : ils n'ont pas disparu, ils sont
// derrière la seule commande de l'écran. Ici on cherche, on réduit, on saute
// n'importe où dans les dix-sept. Une ligne y porte de nouveau quatre choses
// — c'est un index, il est fait pour être balayé, pas pour être regardé.
// ─────────────────────────────────────────────────────────────────────────────

const POLES: Pole[] = ["Agentic", "ModIA", "Embedded", "Hackathon"];

export function IndexProjets({
  projets,
  onFermer,
  onChoisir,
}: {
  /** Dans l'ordre du carrousel : l'index et la piste racontent la même suite. */
  projets: ProjetComplet[];
  onFermer: () => void;
  onChoisir: (i: number) => void;
}) {
  const [r, setR] = useState<Reglages>(REGLAGES_VIDES);
  const champ = useRef<HTMLInputElement>(null);

  const resultats = useMemo(
    () => ordreCarrousel(filtrer(projets, r)),
    [projets, r],
  );
  const actifs = reglagesActifs(r);
  const ouverts = projets.filter(
    (p) => !p.enPause && p.accueil === "ouvert",
  ).length;

  useEffect(() => {
    function onTouche(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }
    document.addEventListener("keydown", onTouche);
    // Le curseur va dans la recherche sur ordinateur seulement : sur téléphone
    // il ferait monter le clavier par-dessus la liste qu'on vient d'ouvrir.
    if (window.matchMedia("(min-width: 1024px)").matches) champ.current?.focus();
    return () => document.removeEventListener("keydown", onTouche);
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
    <div className="index-panneau an-monte" role="dialog" aria-modal="true" aria-label="Index des projets">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-filet px-4">
        <Etq ton="encre">Index</Etq>
        <span className="t-cote text-[0.75rem] text-brique">
          {actifs > 0
            ? `${resultats.length}/${projets.length}`
            : String(projets.length).padStart(2, "0")}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onFermer}
          className="cmd cmd-nu cmd-s -mr-1.5"
          aria-label="Fermer l'index"
        >
          <Icone nom="croix" className="h-4 w-4" />
        </button>
      </div>

      <div className="shrink-0 border-b border-filet px-4 py-3">
        <div className="relative">
          <Icone
            nom="recherche"
            className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gris-40"
          />
          <input
            ref={champ}
            type="search"
            value={r.q}
            onChange={(e) => setR((v) => ({ ...v, q: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Escape" && r.q) {
                e.stopPropagation();
                setR((v) => ({ ...v, q: "" }));
              }
            }}
            placeholder="Nom, outil, porteur…"
            aria-label="Rechercher un projet"
            className="champ pl-9"
          />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            aria-pressed={r.ouverts}
            onClick={() => setR((v) => ({ ...v, ouverts: !v.ouverts }))}
            className="puce"
          >
            Ouverts
            <span
              className={cx(
                "t-cote text-[0.6875rem]",
                r.ouverts ? "text-brique-nuit" : "text-brique",
              )}
            >
              {ouverts}
            </span>
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
          <span aria-hidden className="mx-0.5 h-4 w-px shrink-0 bg-filet-fort" />
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
              onClick={() => setR(REGLAGES_VIDES)}
              className="cmd cmd-nu cmd-s shrink-0"
            >
              <Icone nom="croix" className="h-3 w-3" />
              Effacer
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {resultats.length === 0 ? (
          <Vide
            titre="Aucun projet ne répond"
            mesure={`0 sur ${projets.length} · ${actifs} ${pluriel(
              actifs,
              "réglage actif",
              "réglages actifs",
            )}`}
          >
            <button
              type="button"
              onClick={() => setR(REGLAGES_VIDES)}
              className="cmd cmd-trait cmd-s"
            >
              Tout remettre
            </button>
          </Vide>
        ) : (
          <ul className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
            {resultats.map((p) => {
              const ouvert = !p.enPause && p.accueil === "ouvert";
              return (
                <li key={p.id}>
                  <Link
                    href={adresseProjet(p)}
                    onClick={() => onChoisir(projets.indexOf(p))}
                    className="index-ligne"
                  >
                    <Jauge
                      cran={CRAN_ETAT[p.etat]}
                      pause={p.enPause}
                      className="mt-[3px] h-[0.95rem] shrink-0"
                      titre={NOM_ETAT[p.etat]}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="t-titre block truncate text-[0.9375rem] leading-[1.3]">
                        {p.nom}
                      </span>
                      <span className="t-corps mt-[2px] block truncate text-[0.8125rem] text-gris-72">
                        {p.resume}
                      </span>
                    </span>
                    {ouvert ? (
                      <span className="t-etq shrink-0 text-brique">Ouvert</span>
                    ) : p.enPause ? (
                      <span className="t-etq shrink-0 text-gris-40">Pause</span>
                    ) : null}
                    <Icone
                      nom="chevron-droite"
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-gris-24"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
