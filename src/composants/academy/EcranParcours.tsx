"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ParcoursAvecLecons } from "@/serveur/domaine/academy";
import { avancementCours } from "@/serveur/domaine/progression";
import { DeuxZones } from "@/composants/base/DeuxZones";
import { Etq, Vide } from "@/composants/base/Atomes";
import { Icone } from "@/composants/base/Icone";
import { Monument } from "@/composants/base/Monument";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { NOM_NIVEAU, cx, duree } from "@/lib/format";
import { Regle } from "./Avancement";
import { LigneCours } from "./Accueil";
import { useProgression } from "./progression";

/**
 * La page d'un parcours : ses cours, dans l'ordre où on les suit, et l'état
 * d'ensemble. C'est l'écran qui montre le mieux ce que l'Academy promet, et
 * ce qui n'est pas encore tenu.
 */
export function EcranParcours({ parcours }: { parcours: ParcoursAvecLecons }) {
  const { progression, pret } = useProgression();

  const total = useMemo(() => {
    const publiees = parcours.cours.flatMap((c) =>
      c.lecons.filter((l) => l.statut === "publie"),
    );
    const faites = publiees.filter(
      (l) => progression.lecons[l.id]?.etat === "terminee",
    );
    const coursTermines = parcours.cours.filter(
      (c) =>
        c.statut === "publie" &&
        avancementCours(c, c.lecons, progression).termine,
    ).length;
    return {
      faites: faites.length,
      lecons: publiees.length,
      part: publiees.length === 0 ? 0 : faites.length / publiees.length,
      coursTermines,
      coursOuverts: parcours.cours.filter((c) => c.statut === "publie").length,
      minutesRestantes: publiees
        .filter((l) => progression.lecons[l.id]?.etat !== "terminee")
        .reduce((n, l) => n + l.minutes, 0),
    };
  }, [parcours.cours, progression]);

  const cran =
    !pret || total.part === 0
      ? 0
      : total.part >= 1
        ? 3
        : total.part >= 0.5
          ? 2
          : 1;

  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection titre={parcours.nom} />

        <div className="hidden h-12 items-center gap-2.5 border-b border-filet px-4 lg:flex">
          <Link href="/apprendre" className="cmd cmd-nu cmd-s px-1">
            <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
            Academy
          </Link>
          <span aria-hidden className="h-4 w-px bg-filet-fort" />
          <Etq ton="encre">Parcours</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {total.coursOuverts} / {parcours.cours.length}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            cours ouverts
          </span>
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <header className="an-monte border-b border-filet px-3 py-4 lg:px-4">
          <h1 className="t-titre-xl text-[clamp(1.375rem,4vw,1.875rem)]">
            {parcours.nom}
          </h1>
          <p className="t-corps mt-2.5 max-w-[52ch] text-[0.9375rem] leading-[1.55] text-gris-72">
            {parcours.presentation}
          </p>
          <p className="t-tech mt-3 text-[0.6875rem] text-gris-40">
            {NOM_NIVEAU[parcours.niveau]} · {parcours.cours.length} cours ·{" "}
            {parcours.nbLecons} leçons ouvertes · {duree(parcours.minutes)}
          </p>
          <div className="mt-3 lg:hidden">
            <Regle part={pret ? total.part : 0} />
          </div>
        </header>

        {parcours.cours.length === 0 ? (
          // Un parcours sans cours n'est pas une erreur : c'est un axe annoncé
          // dont rien n'est encore écrit. Sans cet état, la page se terminait
          // sur un blanc de plein écran, qui se lit comme une panne.
          <Vide
            titre="Aucun cours n'est encore écrit"
            mesure="L'axe est arrêté, le programme reste à poser"
          >
            <Link href="/apprendre" className="cmd cmd-trait cmd-s">
              Les cours ouverts
            </Link>
          </Vide>
        ) : (
          <ul>
            {parcours.cours.map((cours, i) => (
              <li
                key={cours.id}
                className="an-monte"
                style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
              >
                <ul>
                  <LigneCours cours={cours} />
                </ul>
              </li>
            ))}
          </ul>
        )}

        <div className="h-6" />
      </div>
    </div>
  );

  const volet = (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-4">
        <Etq ton="encre">Le parcours</Etq>
        <span className="t-cote text-[0.75rem] text-brique">
          {NOM_NIVEAU[parcours.niveau]}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-filet px-4 py-4">
          <Monument
            cran={cran}
            construit={pret && total.faites > 0}
            className="mx-auto h-[5.25rem] text-encre"
            titre={`${total.faites} leçon sur ${total.lecons} terminée`}
          />
          <Regle part={pret ? total.part : 0} className="mt-4" />
          <p className="t-tech mt-2 text-center text-[0.6875rem] text-gris-58">
            {!pret
              ? " "
              : total.lecons === 0
                ? "Aucune leçon ouverte pour l'instant"
                : total.faites === total.lecons
                  ? "Parcours terminé"
                  : `${total.faites} sur ${total.lecons} · ${duree(total.minutesRestantes)} restantes`}
          </p>
          {pret && total.coursTermines > 0 ? (
            <p className="t-etq mt-1.5 text-center text-brique">
              {total.coursTermines} cours terminé
              {total.coursTermines > 1 ? "s" : ""}
            </p>
          ) : null}
        </div>

        <section className="px-4 py-3.5">
          <Etq ton="encre">Dans ce parcours</Etq>
          {parcours.cours.length === 0 ? (
            <p className="t-corps mt-2 border-t border-filet pt-2.5 text-[0.8125rem] leading-[1.45] text-gris-72">
              Rien pour l&apos;instant. Ce parcours existe comme intention, et
              son sommaire s&apos;écrira cours par cours.
            </p>
          ) : (
            <ul className="mt-2 border-t border-filet">
              {parcours.cours.map((cours, i) => (
                <li
                  key={cours.id}
                  className="flex items-baseline gap-2.5 border-b border-filet py-2"
                >
                  <span className="t-cote w-5 shrink-0 text-[0.6875rem] text-gris-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cx(
                      "t-corps min-w-0 flex-1 text-[0.8125rem] leading-[1.35]",
                      cours.statut === "annonce"
                        ? "text-gris-40"
                        : "text-encre",
                    )}
                  >
                    {cours.nom}
                  </span>
                  <span className="t-tech shrink-0 text-[0.6875rem] text-gris-40">
                    {cours.statut === "annonce" ? "·" : duree(cours.minutes)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {/* La légende ne s'affiche que s'il y a quelque chose à légender. */}
          {parcours.cours.some((c) => c.statut === "annonce") ? (
            <p className="t-etq mt-3 leading-[1.5] text-gris-40">
              Les cours marqués « à paraître » ont leur programme arrêté ; leurs
              leçons restent à écrire.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} />;
}
