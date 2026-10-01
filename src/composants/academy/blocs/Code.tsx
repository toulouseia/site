"use client";

import { useState } from "react";
import type { BlocCode, BlocVideo } from "@/serveur/domaine/blocs";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { Legende, Ligne } from "./prose";

const NOM_LANGAGE: Record<BlocCode["langage"], string> = {
  python: "Python",
  bash: "Terminal",
  json: "JSON",
  text: "Texte",
  typescript: "TypeScript",
};

/**
 * Le code. Pas de coloration syntaxique : elle demanderait une bibliothèque
 * lourde et un jeu de couleurs, or ce système en a trois. Ce qui manque
 * vraiment dans un extrait de cours, ce n'est pas la couleur : c'est de savoir
 * QUELLES lignes comptent. Les lignes mises en avant portent un serif de
 * brique, le reste s'atténue.
 */
export function BCode({ bloc }: { bloc: BlocCode }) {
  const [copie, setCopie] = useState(false);
  const lignes = bloc.code.replace(/\n+$/, "").split("\n");
  const surligne = new Set(bloc.surlignees ?? []);
  const aDesReperes = surligne.size > 0;

  async function copier() {
    try {
      await navigator.clipboard.writeText(bloc.code);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 1600);
    } catch {
      /* presse-papiers refusé : le texte reste sélectionnable. */
    }
  }

  return (
    <div id={bloc.ancre} className="mt-6 border border-filet-fort">
      <div className="flex h-9 items-center gap-2.5 border-b border-filet bg-gris-04 px-3">
        <span className="t-etq text-gris-58">{NOM_LANGAGE[bloc.langage]}</span>
        {bloc.titre ? (
          <span className="t-corps-f truncate text-[0.8125rem]">
            <Ligne texte={bloc.titre} />
          </span>
        ) : null}
        <span className="flex-1" />
        <button
          type="button"
          onClick={copier}
          className="cmd cmd-nu cmd-s h-7 px-1.5"
        >
          <Icone
            nom={copie ? "coche" : "copie"}
            className="h-3.5 w-3.5"
          />
          {copie ? "Copié" : "Copier"}
        </button>
      </div>

      <pre className="overflow-x-auto py-2.5 text-[0.8125rem] leading-[1.6]">
        <code className="t-tech block">
          {lignes.map((ligne, i) => {
            const marque = surligne.has(i + 1);
            return (
              <span
                key={i}
                className={cx(
                  "grid grid-cols-[2.25rem_minmax(0,1fr)] px-0",
                  marque && "bg-gris-08",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "select-none pr-2 text-right text-[0.6875rem] leading-[1.6]",
                    marque
                      ? "border-r-2 border-r-brique text-brique"
                      : "border-r-2 border-r-transparent text-gris-24",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cx(
                    "pr-3 pl-3 whitespace-pre",
                    aDesReperes && !marque ? "text-gris-72" : "text-encre",
                  )}
                >
                  {ligne || " "}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

/** Une vidéo ordinaire : enregistrement de séance, extrait. */
export function BVideo({ bloc }: { bloc: BlocVideo }) {
  return (
    <figure id={bloc.ancre} className="mt-6">
      <video
        controls
        preload="metadata"
        playsInline
        poster={bloc.poster}
        aria-label={bloc.alt}
        className="block w-full border border-filet-fort bg-sombre"
      >
        <source src={bloc.src} type="video/mp4" />
        {bloc.soustitres ? (
          <track
            kind="subtitles"
            srcLang="fr"
            label="Français"
            src={bloc.soustitres}
            default
          />
        ) : null}
      </video>
      <Legende texte={bloc.legende} />
    </figure>
  );
}
