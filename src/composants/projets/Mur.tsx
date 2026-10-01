"use client";

import { useRef } from "react";
import Link from "next/link";
import type { ProjetComplet } from "@/donnees/api";
import { Icone } from "@/composants/base/Icone";
import { Touche } from "@/composants/base/Atomes";
import { CRAN_ETAT, NOM_ETAT, adresseProjet, cx } from "@/lib/format";
import { SigneGrand } from "./SigneGrand";
import { CartoucheSigne, ImageProjet } from "./Vignette";

// ─────────────────────────────────────────────────────────────────────────────
// Le mur. Dix-sept fois le même dessin, dix-sept remplissages différents : une
// image du club, et un plan que l'œil lit d'un coup.
//
// Le seul ordre qui rende le mur lisible est celui de l'avancement : la
// planche se vide de gauche à droite et de haut en bas. Sans lui, dix-sept
// triangles identiques ne sont qu'un semis.
//
// La planche fait toujours vingt cases, quel que soit le nombre de projets
// affichés. Les cases restantes portent la trame : le club a de la place, et
// ça se voit.
// ─────────────────────────────────────────────────────────────────────────────

const CASES = 20;

export function Mur({
  projets,
  courant,
  selection,
  onSurvol,
  onChercher,
}: {
  projets: ProjetComplet[];
  /** Le projet dont la fiche est affichée — choisi, ou survolé si rien n'est choisi. */
  courant: string | null;
  /** Le projet ouvert par l'adresse : il garde une marque quand on survole ailleurs. */
  selection: string | null;
  onSurvol: (slug: string | null) => void;
  onChercher: () => void;
}) {
  const grille = useRef<HTMLDivElement>(null);
  const vides = Math.max(0, CASES - projets.length - 1);

  /** Les flèches parcourent la grille comme une grille, pas comme une liste. */
  function naviguer(e: React.KeyboardEvent) {
    const pas =
      e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowLeft"
          ? -1
          : e.key === "ArrowDown"
            ? 5
            : e.key === "ArrowUp"
              ? -5
              : 0;
    if (pas === 0) return;
    const cases = Array.from(
      grille.current?.querySelectorAll<HTMLElement>("[data-case]") ?? [],
    );
    const i = cases.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    cases[Math.max(0, Math.min(cases.length - 1, i + pas))]?.focus();
  }

  return (
    <div className="h-full overflow-hidden bg-papier">
      <div
        ref={grille}
        onKeyDown={naviguer}
        onMouseLeave={() => onSurvol(null)}
        className={cx(
          // Le décalage d'un pixel mange les filets du pourtour : il ne reste
          // que les lignes intérieures, et la planche touche ses bords.
          "-mt-px -ml-px grid h-[calc(100%+1px)] w-[calc(100%+1px)]",
          "grid-cols-4 grid-rows-5 xl:grid-cols-5 xl:grid-rows-4",
          "[&>*]:border-t [&>*]:border-l [&>*]:border-filet",
        )}
      >
      {projets.map((p) => {
        const actif = p.slug === courant;
        const choisi = p.slug === selection;
        return (
          <Link
            key={p.id}
            data-case
            href={adresseProjet(p)}
            aria-current={choisi ? "page" : undefined}
            onMouseEnter={() => onSurvol(p.slug)}
            onFocus={() => onSurvol(p.slug)}
            className={cx(
              "bande relative flex min-w-0 flex-col items-center justify-center gap-3.5 overflow-hidden px-2 outline-offset-[-3px]",
              actif ? "bg-sombre text-papier" : "bg-papier text-encre",
            )}
          >
            {choisi ? (
              <span
                aria-hidden
                className={cx(
                  "absolute top-2 left-2 z-[2] h-[5px] w-[5px]",
                  actif ? "bg-brique-nuit" : "bg-brique",
                )}
              />
            ) : null}
            {p.image ? (
              // La case illustrée : l'affiche emplit le cadre, le nom passe sur
              // un bandeau plein en bas, la cote se pose en haut à droite.
              <span className="mur-image">
                <ImageProjet
                  src={p.image}
                  alt={p.imageAlt ?? p.nom}
                  nom={p.nom}
                  cadre={p.imageCadre}
                />
                <CartoucheSigne
                  cran={CRAN_ETAT[p.etat]}
                  pause={p.enPause}
                  className="mur-cartouche"
                />
                <span className="mur-bandeau">
                  <span className="t-tech line-clamp-2 text-[0.75rem] leading-[1.2] text-encre">
                    {p.nom}
                  </span>
                </span>
              </span>
            ) : (
              <>
                <SigneGrand
                  cran={CRAN_ETAT[p.etat]}
                  pause={p.enPause}
                  // La largeur commande, la hauteur plafonne : le signe garde
                  // partout la marge d'air que le kit lui réserve, 0,18 fois sa
                  // hauteur, quelle que soit la taille de la case.
                  className="h-auto max-h-[60%] w-[66%]"
                />
                <span
                  className={cx(
                    "t-tech line-clamp-2 max-w-full text-center text-[0.75rem] leading-[1.25]",
                    actif ? "text-papier" : "text-encre",
                  )}
                >
                  {p.nom}
                </span>
              </>
            )}
            <span className="sr-only">
              , {p.enPause ? "en pause" : NOM_ETAT[p.etat]}
            </span>
          </Link>
        );
      })}

        {/* La seule commande de l'écran d'arrivée. Elle vient après les projets. */}
        <button
          type="button"
          data-case
          onClick={onChercher}
          onMouseEnter={() => onSurvol(null)}
          className="group flex flex-col items-center justify-center gap-3.5 bg-papier px-2 text-gris-58 outline-offset-[-3px] transition-colors duration-100 hover:text-encre"
        >
          <span className="flex h-[60%] items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center border border-filet-fort transition-colors duration-100 group-hover:border-encre">
              <Icone nom="recherche" className="h-[18px] w-[18px]" />
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="t-etq">Chercher</span>
            <Touche>/</Touche>
          </span>
        </button>

        {Array.from({ length: vides }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="trame bg-papier"
            style={{ ["--trame-op" as string]: "0.05" }}
          />
        ))}
      </div>
    </div>
  );
}
