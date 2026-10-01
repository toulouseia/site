"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  CoursAvecLecons,
  ParcoursAvecLecons,
} from "@/serveur/domaine/academy";
import type { Seance } from "@/serveur/domaine/club";
import {
  avancementCours,
  ouReprendre,
  serieDeJours,
} from "@/serveur/domaine/progression";
import { DeuxZones } from "@/composants/base/DeuxZones";
import { Etq, Vide } from "@/composants/base/Atomes";
import { Icone } from "@/composants/base/Icone";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { AUJOURDHUI, NOM_NIVEAU, cx, dateCourte, dans, duree } from "@/lib/format";
import { Jauge } from "@/composants/base/Jauge";
import { MesureCours, Regle } from "./Avancement";
import { useProgression } from "./progression";

// ─────────────────────────────────────────────────────────────────────────────
// L'ACCUEIL DE L'AI ACADEMY.
//
// L'écran doit répondre à quatre questions, dans cet ordre et sans qu'on ait à
// chercher :
//
//   1. OÙ EN SUIS-JE ? La reprise, tout en haut, dès qu'il y a quelque chose
//      à reprendre. C'est la seule chose qui bouge d'une visite à l'autre.
//   2. QU'EST-CE QU'ON APPREND ICI ? Les parcours, avec leurs cours dedans.
//      Pas une grille de cartes détachées : la hiérarchie est l'information.
//   3. QU'EST-CE QUI EST PRÊT ? Chaque cours dit s'il est ouvert ou annoncé.
//      On ne cache pas le programme, on ne ment pas sur son état.
//   4. QUAND EST-CE QUE JE VOIS QUELQU'UN ? Les séances, dans le volet.
//
// Le volet de droite porte la progression et les séances : c'est ce qui est
// personnel et daté. La planche porte le savoir : c'est ce qui est stable.
// ─────────────────────────────────────────────────────────────────────────────

export function Accueil({
  parcours,
  seances,
}: {
  parcours: ParcoursAvecLecons[];
  seances: Seance[];
}) {
  const { progression, pret, toutOublier } = useProgression();
  const [niveau, setNiveau] = useState<string | null>(null);
  // Sur telephone le volet n'est pas a cote : c'est un second ecran. La
  // progression et les seances y vivent, il faut donc une porte pour y aller.
  const [vue, setVue] = useState<"parcours" | "progression">("parcours");

  const tousCours = useMemo(
    () => parcours.flatMap((p) => p.cours),
    [parcours],
  );

  /** Ce qu'on a commencé et pas fini, du plus récemment touché au plus ancien. */
  const reprises = useMemo(() => {
    if (!pret) return [];
    return tousCours
      .map((cours) => {
        const avancement = avancementCours(cours, cours.lecons, progression);
        if (!avancement.commence || avancement.termine) return null;
        const lecon = ouReprendre(cours.id, cours.lecons, progression);
        if (!lecon) return null;
        const vue =
          progression.lecons[lecon.id]?.vue ??
          progression.inscriptions.find((i) => i.coursId === cours.id)?.debut ??
          "";
        return { cours, lecon, avancement, vue };
      })
      .filter((x) => x !== null)
      .sort((a, b) => b.vue.localeCompare(a.vue));
  }, [tousCours, progression, pret]);

  const bilan = useMemo(() => {
    const commences = tousCours.filter(
      (c) => avancementCours(c, c.lecons, progression).commence,
    );
    const termines = commences.filter(
      (c) => avancementCours(c, c.lecons, progression).termine,
    );
    const faites = Object.values(progression.lecons).filter(
      (m) => m.etat === "terminee",
    ).length;
    const minutes = tousCours
      .flatMap((c) => c.lecons)
      .filter((l) => progression.lecons[l.id]?.etat === "terminee")
      .reduce((n, l) => n + l.minutes, 0);
    return {
      coursCommences: commences.length,
      coursTermines: termines.length,
      leconsFaites: faites,
      minutesFaites: minutes,
      serie: serieDeJours(progression, AUJOURDHUI),
    };
  }, [tousCours, progression]);

  const visibles = niveau
    ? parcours.filter((p) => p.niveau === niveau)
    : parcours;

  const ouverts = tousCours.filter((c) => c.statut === "publie").length;

  // ── La planche ────────────────────────────────────────────────────────────
  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection titre="AI Academy" />

        <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">AI Academy</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {ouverts} / {tousCours.length}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            cours ouverts sur annoncés
          </span>
          <span className="flex-1" />
          <Link href="/apprendre/ressources" className="cmd cmd-nu cmd-s">
            <Icone nom="notes" className="h-3.5 w-3.5" />
            Le fonds de ressources
          </Link>
        </div>

        {/* Les deux ecrans du telephone. Sur ordinateur, les deux sont
            visibles en meme temps : ces pastilles n'y ont rien a faire. */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-filet px-3 py-1.5 lg:hidden">
          <button
            type="button"
            aria-pressed={vue === "parcours"}
            onClick={() => setVue("parcours")}
            className="puce"
          >
            Parcours
            <span className="t-cote text-[0.6875rem]">{parcours.length}</span>
          </button>
          <button
            type="button"
            aria-pressed={vue === "progression"}
            onClick={() => setVue("progression")}
            className="puce"
          >
            Ma progression
          </button>
          <Link href="/apprendre/ressources" className="puce">
            <Icone nom="notes" className="h-3.5 w-3.5" />
            Le fonds
          </Link>
        </div>

        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-filet px-3 py-1.5 lg:px-4 lg:py-2">
          {(["depart", "milieu", "fond"] as const).map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={niveau === n}
              onClick={() => setNiveau(niveau === n ? null : n)}
              className="puce"
            >
              {NOM_NIVEAU[n]}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* La reprise : d'abord, et seulement quand elle existe. */}
        {reprises.length > 0 ? (
          <section className="an-monte border-b-2 border-b-encre bg-gris-04 px-3 py-3.5 lg:px-4">
            <Etq ton="encre">Reprendre</Etq>
            <ul className="mt-2.5">
              {reprises.slice(0, 2).map(({ cours, lecon, avancement }) => (
                <li key={cours.id} className="mt-2 first:mt-0">
                  <Link
                    href={`/apprendre/cours/${cours.slug}/${lecon.slug}`}
                    className="group block border border-filet-fort bg-papier px-3 py-2.5 transition-colors hover:border-encre"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="t-etq truncate text-gris-58">
                        {cours.nom}
                      </span>
                      <span className="flex-1" />
                      <span className="t-cote shrink-0 text-[0.6875rem] text-brique">
                        {avancement.faites}/{avancement.total}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]">
                        {lecon.titre}
                      </span>
                      <Icone
                        nom="fleche-droite"
                        className="h-4 w-4 shrink-0 text-gris-40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
                      />
                    </div>
                    <Regle part={avancement.part} className="mt-2.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {visibles.length === 0 ? (
          <Vide
            titre="Aucun parcours à ce niveau"
            mesure={`0 sur ${parcours.length}`}
          >
            <button
              type="button"
              onClick={() => setNiveau(null)}
              className="cmd cmd-trait cmd-s"
            >
              Tout remettre
            </button>
          </Vide>
        ) : (
          visibles.map((p, i) => (
            <BlocParcours key={p.id} parcours={p} rang={i} />
          ))
        )}

        <div className="h-6" />
      </div>
    </div>
  );

  // ── Le volet ──────────────────────────────────────────────────────────────
  const volet = (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-4">
        <button
          type="button"
          onClick={() => setVue("parcours")}
          className="cmd cmd-nu cmd-s px-1 lg:hidden"
        >
          <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
          Parcours
        </button>
        <span aria-hidden className="h-4 w-px bg-filet-fort lg:hidden" />
        <Etq ton="encre">Ma progression</Etq>
        {pret && bilan.serie > 1 ? (
          <span className="t-cote text-[0.75rem] text-brique">
            {bilan.serie} j d&apos;affilée
          </span>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-4 py-3.5">
          <dl className="grid grid-cols-2 gap-px bg-filet">
            <Chiffre
              etiquette="Leçons faites"
              valeur={pret ? String(bilan.leconsFaites) : "·"}
            />
            <Chiffre
              etiquette="Temps de lecture"
              valeur={pret && bilan.minutesFaites ? duree(bilan.minutesFaites) : "·"}
            />
            <Chiffre
              etiquette="Cours commencés"
              valeur={pret ? String(bilan.coursCommences) : "·"}
            />
            <Chiffre
              etiquette="Cours terminés"
              valeur={pret ? String(bilan.coursTermines) : "·"}
            />
          </dl>

          <p className="t-corps mt-3 text-[0.75rem] leading-[1.5] text-gris-58">
            Cette progression reste sur cet appareil. Les comptes arrivent :
            elle sera reprise, pas perdue.
          </p>
          {pret && bilan.leconsFaites > 0 ? (
            <button
              type="button"
              onClick={toutOublier}
              className="cmd cmd-nu cmd-s mt-1.5 px-0"
            >
              Tout effacer
            </button>
          ) : null}
        </section>

        <section className="border-t border-filet px-4 py-3.5">
          <div className="flex items-baseline gap-2">
            <Etq ton="encre">Séances à venir</Etq>
            <span className="t-cote text-[0.75rem] text-brique">
              {seances.length}
            </span>
          </div>
          <ul className="mt-2.5 border-t border-filet">
            {seances.slice(0, 4).map((s) => (
              <li key={s.id} className="border-b border-filet py-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="t-tech w-[3.6rem] shrink-0 text-[0.6875rem] text-gris-40">
                    {dateCourte(s.date)}
                  </span>
                  <span className="t-corps-f min-w-0 flex-1 text-[0.8125rem] leading-[1.35]">
                    {s.titre}
                  </span>
                </div>
                <p className="t-tech mt-1 pl-[4.1rem] text-[0.6875rem] text-gris-58">
                  {duree(s.minutes)} · {s.restant} places · {dans(s.date)}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/apprendre/ressources" className="cmd cmd-trait cmd-s mt-3">
            Toutes les séances
          </Link>
        </section>
      </div>
    </div>
  );

  return (
    <DeuxZones
      planche={planche}
      volet={volet}
      ouvertMobile={vue === "progression"}
    />
  );
}

function Chiffre({ etiquette, valeur }: { etiquette: string; valeur: string }) {
  return (
    <div className="bg-papier px-3 py-2.5">
      <dt className="t-etq text-gris-58">{etiquette}</dt>
      <dd className="t-chiffre mt-1 text-[1.25rem] text-encre">{valeur}</dd>
    </div>
  );
}

// ── Un parcours et ses cours ────────────────────────────────────────────────

function BlocParcours({
  parcours,
  rang,
}: {
  parcours: ParcoursAvecLecons;
  rang: number;
}) {
  return (
    <section
      className="an-monte border-b border-filet"
      style={{ animationDelay: `${Math.min(rang, 5) * 45}ms` }}
    >
      <header className="flex items-start gap-3 border-b border-filet bg-gris-04 px-3 py-3 lg:px-4">
        <span className="t-cote w-6 shrink-0 pt-[3px] text-[0.75rem] text-brique">
          {String(rang + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/apprendre/parcours/${parcours.slug}`}
            className="group flex items-baseline gap-2"
          >
            <h2 className="t-titre-l min-w-0 text-[1.0625rem] leading-[1.22] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[3px]">
              {parcours.nom}
            </h2>
            <Icone
              nom="chevron-droite"
              className="h-3.5 w-3.5 shrink-0 -translate-y-[1px] text-gris-40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
            />
          </Link>
          <p className="t-corps mt-1 text-[0.8125rem] leading-[1.4] text-gris-72">
            {parcours.resume}
          </p>
          <p className="t-tech mt-1.5 text-[0.6875rem] text-gris-40">
            {NOM_NIVEAU[parcours.niveau]} · {parcours.cours.length} cours ·{" "}
            {parcours.nbLecons} leçons ouvertes
          </p>
        </div>
      </header>

      <ul>
        {parcours.cours.map((cours) => (
          <LigneCours key={cours.id} cours={cours} />
        ))}
      </ul>
    </section>
  );
}

export function LigneCours({ cours }: { cours: CoursAvecLecons }) {
  const { progression, pret } = useProgression();
  const avancement = avancementCours(cours, cours.lecons, progression);
  const annonce = cours.statut === "annonce";

  const corps = (
    <>
      <div className="flex items-baseline gap-2">
        <h3
          className={cx(
            "t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]",
            annonce ? "text-gris-58" : "text-encre",
          )}
        >
          {cours.nom}
        </h3>
        {annonce ? (
          <span className="t-etq shrink-0 border border-filet-fort px-1.5 py-[3px] text-gris-58">
            À paraître
          </span>
        ) : (
          <Icone
            nom="fleche-droite"
            className="h-4 w-4 shrink-0 text-gris-40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
          />
        )}
      </div>
      <p
        className={cx(
          "t-corps mt-0.5 text-[0.8125rem] leading-[1.35]",
          annonce ? "text-gris-40" : "text-gris-72",
        )}
      >
        {cours.resume}
      </p>
      <div className="mt-1.5 flex items-center gap-3">
        <MesureCours cours={cours} avancement={avancement} pret={pret} />
        {!annonce && pret && avancement.commence ? (
          <div className="hidden max-w-[9rem] flex-1 sm:block">
            <Regle part={avancement.part} />
          </div>
        ) : null}
      </div>
    </>
  );

  if (annonce) {
    return (
      <li className="border-b border-filet px-3 py-3 last:border-b-0 lg:px-4">
        <div className="flex gap-3">
          <span className="mt-[3px] h-4 w-4 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">{corps}</div>
        </div>
      </li>
    );
  }

  return (
    <li className="border-b border-filet last:border-b-0">
      <Link
        href={`/apprendre/cours/${cours.slug}`}
        className="group flex gap-3 px-3 py-3 transition-colors hover:bg-gris-04 lg:px-4"
      >
        <Jauge
          cran={pret ? avancement.cran : 0}
          className={cx(
            "mt-[3px] h-4 shrink-0 text-encre transition-opacity duration-300",
            pret ? "opacity-100" : "opacity-25",
          )}
          titre={`${avancement.faites} leçon sur ${avancement.total} terminée`}
        />
        <div className="min-w-0 flex-1">{corps}</div>
      </Link>
    </li>
  );
}
