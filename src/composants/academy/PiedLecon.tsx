"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LeconComplete } from "@/serveur/domaine/academy";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { useProgression } from "./progression";

// ─────────────────────────────────────────────────────────────────────────────
// LA FIN D'UNE LEÇON, et la seule chose qui compte pour la progression.
//
// « Terminer » est un geste explicite. On aurait pu marquer une leçon comme
// faite au défilement, comme le font beaucoup de plateformes : c'est
// désagréable et c'est faux. Avoir fait défiler n'est pas avoir compris, et
// une progression qu'on n'a pas décidée ne veut rien dire.
//
// En revanche, OUVRIR une leçon est enregistré tout seul : c'est ce qui permet
// à « Reprendre » de savoir où revenir, et ça n'affirme rien sur ce qu'on a
// compris.
// ─────────────────────────────────────────────────────────────────────────────

export function PiedLecon({ lecon }: { lecon: LeconComplete }) {
  const { progression, pret, marquer, ouvrir } = useProgression();
  const terminee = progression.lecons[lecon.id]?.etat === "terminee";

  useEffect(() => {
    ouvrir(lecon.coursId, lecon.id);
  }, [ouvrir, lecon.coursId, lecon.id]);

  const suivante = lecon.suivante;

  return (
    <footer className="mt-10 border-t-2 border-t-encre pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => marquer(lecon.id, terminee ? "neuve" : "terminee")}
          className={cx("cmd", terminee ? "cmd-trait" : "cmd-plein")}
          aria-pressed={terminee}
        >
          <Icone
            nom={terminee ? "coche" : "plus"}
            className="h-4 w-4"
          />
          {!pret
            ? "Marquer comme terminée"
            : terminee
              ? "Terminée"
              : "Marquer comme terminée"}
        </button>

        {suivante ? (
          <Link
            href={`/apprendre/cours/${lecon.cours.slug}/${suivante.slug}`}
            className={cx("cmd", terminee ? "cmd-plein" : "cmd-trait")}
          >
            Leçon suivante
            <Icone nom="fleche-droite" className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/apprendre/cours/${lecon.cours.slug}`}
            className="cmd cmd-trait"
          >
            Retour au sommaire
            <Icone nom="fleche-droite" className="h-4 w-4" />
          </Link>
        )}
      </div>

      <nav className="mt-5 grid gap-px border-t border-filet bg-filet sm:grid-cols-2">
        {lecon.precedente ? (
          <Link
            href={`/apprendre/cours/${lecon.cours.slug}/${lecon.precedente.slug}`}
            className="group flex items-start gap-2.5 bg-papier px-3 py-3 transition-colors hover:bg-gris-04"
          >
            <Icone
              nom="fleche-gauche"
              className="mt-[3px] h-4 w-4 shrink-0 text-gris-40 transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
            />
            <span className="min-w-0">
              <span className="t-etq block text-gris-58">Précédente</span>
              <span className="t-corps-f mt-1 block text-[0.875rem] leading-[1.3]">
                {lecon.precedente.titre}
              </span>
            </span>
          </Link>
        ) : (
          <span className="bg-papier px-3 py-3">
            <span className="t-etq block text-gris-24">Début du cours</span>
          </span>
        )}

        {suivante ? (
          <Link
            href={`/apprendre/cours/${lecon.cours.slug}/${suivante.slug}`}
            className="group flex items-start justify-end gap-2.5 bg-papier px-3 py-3 text-right transition-colors hover:bg-gris-04"
          >
            <span className="min-w-0">
              <span className="t-etq block text-gris-58">Suivante</span>
              <span className="t-corps-f mt-1 block text-[0.875rem] leading-[1.3]">
                {suivante.titre}
              </span>
            </span>
            <Icone
              nom="fleche-droite"
              className="mt-[3px] h-4 w-4 shrink-0 text-gris-40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
            />
          </Link>
        ) : (
          <span className="bg-papier px-3 py-3 text-right">
            <span className="t-etq block text-gris-24">Fin du cours</span>
          </span>
        )}
      </nav>
    </footer>
  );
}
