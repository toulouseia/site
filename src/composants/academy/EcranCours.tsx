"use client";

import Link from "next/link";
import type { CoursComplet, GenreLecon, Lecon } from "@/serveur/domaine/academy";
import { avancementCours, ouReprendre } from "@/serveur/domaine/progression";
import { DeuxZones } from "@/composants/base/DeuxZones";
import { Case } from "@/composants/base/DeuxZones";
import { Etq, Vide } from "@/composants/base/Atomes";
import { Icone, type NomIcone } from "@/composants/base/Icone";
import { Monument } from "@/composants/base/Monument";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { NOM_NIVEAU, cx, dateCourte, duree } from "@/lib/format";
import { LigneAvancement, Regle } from "./Avancement";
import { useProgression } from "./progression";

// ─────────────────────────────────────────────────────────────────────────────
// LA PAGE D'UN COURS.
//
// Elle répond à six questions, et l'ordre est celui dans lequel on se les pose :
//
//   ce que c'est · ce que je saurai faire · ce qu'il faut savoir avant ·
//   combien ça dure · où j'en suis · par où je commence
//
// Le sommaire porte tout le plan, y compris ce qui n'est pas écrit. Une leçon
// à paraître est grisée et ne se clique pas, mais elle est là, parce qu'un
// programme amputé de ce qui reste à faire donne une fausse idée du cours.
// ─────────────────────────────────────────────────────────────────────────────

const ICONE_GENRE: Record<GenreLecon, NomIcone> = {
  lecture: "notes",
  demo: "video",
  exercice: "atelier",
  quiz: "coche",
  carnet: "jeu",
};

const NOM_GENRE: Record<GenreLecon, string> = {
  lecture: "Lecture",
  demo: "Démonstration",
  exercice: "Exercice",
  quiz: "Quiz",
  carnet: "Carnet",
};

export function EcranCours({ cours }: { cours: CoursComplet }) {
  const { progression, pret, marquer, commencer } = useProgression();
  const lecons = cours.sommaire.flatMap((c) => c.lecons);
  const avancement = avancementCours(cours, lecons, progression);
  const reprise = ouReprendre(cours.id, lecons, progression);

  const premiere = lecons.find((l) => l.statut === "publie") ?? null;
  const cible = reprise ?? premiere;

  const objectifsArretes =
    cours.objectifs.length +
    " objectif" +
    (cours.objectifs.length > 1 ? "s" : "") +
    " arrêté" +
    (cours.objectifs.length > 1 ? "s" : "") +
    " · 0 leçon";

  const verbe = !pret
    ? "Commencer"
    : avancement.termine
      ? "Revoir le cours"
      : avancement.commence
        ? "Reprendre"
        : "Commencer le cours";

  const commande = cible ? (
    <Link
      href={`/apprendre/cours/${cours.slug}/${cible.slug}`}
      onClick={() => commencer(cours.id)}
      className="cmd cmd-plein w-full"
    >
      <Icone nom="fleche-droite" className="h-4 w-4" />
      {verbe}
    </Link>
  ) : (
    <span className="cmd cmd-trait w-full cursor-not-allowed text-gris-40">
      Aucune leçon ouverte
    </span>
  );

  // ── La planche : le sommaire ──────────────────────────────────────────────
  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection titre={cours.nom} />

        <div className="hidden h-12 items-center gap-2.5 border-b border-filet px-4 lg:flex">
          <Link href="/apprendre" className="cmd cmd-nu cmd-s px-1">
            <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
            Academy
          </Link>
          <span aria-hidden className="h-4 w-px bg-filet-fort" />
          <Link
            href={`/apprendre/parcours/${cours.parcours.slug}`}
            className="t-etq truncate text-gris-58 hover:text-encre"
          >
            {cours.parcours.nom}
          </Link>
          <span className="flex-1" />
          <span className="t-tech shrink-0 text-[0.6875rem] text-gris-40">
            mis à jour le {dateCourte(cours.maj)}
          </span>
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* Sur téléphone la fiche vit ici : le volet n'existe pas là-bas. */}
        <div className="border-b border-filet px-3 py-3.5 lg:hidden">
          <Fiche cours={cours} commande={commande}>
            <LigneAvancement
              avancement={avancement}
              pret={pret}
              className="mt-3"
            />
          </Fiche>
        </div>

        <div className="hidden h-10 items-center gap-2.5 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">Sommaire</Etq>
          {cours.nbLecons === 0 ? (
            <span className="t-tech text-[0.6875rem] text-gris-58">
              Programme arrêté · leçons à écrire
            </span>
          ) : (
            <span className="t-tech text-[0.6875rem] text-gris-58">
              <span className="t-cote text-[0.75rem] text-brique">
                {cours.nbChapitres}
              </span>{" "}
              chapitre{cours.nbChapitres > 1 ? "s" : ""} ·{" "}
              <span className="t-cote text-[0.75rem] text-brique">
                {cours.nbLecons}
              </span>{" "}
              leçon{cours.nbLecons > 1 ? "s" : ""} ouverte
              {cours.nbLecons > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {cours.sommaire.length === 0 ? (
          <Vide
            titre="Le plan est en cours d'écriture"
            mesure={objectifsArretes}
          >
            <Link
              href={"/apprendre/parcours/" + cours.parcours.slug}
              className="cmd cmd-trait cmd-s"
            >
              Voir le parcours
            </Link>
            <Link href="/apprendre" className="cmd cmd-nu cmd-s">
              Les cours ouverts
            </Link>
          </Vide>
        ) : (
          cours.sommaire.map((chapitre, i) => (
            <section
              key={chapitre.id}
              className="an-monte border-b border-filet last:border-b-0"
              style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}
            >
              <header className="flex items-start gap-3 bg-gris-04 px-3 py-2.5 lg:px-4">
                <span className="t-cote w-6 shrink-0 pt-[2px] text-[0.75rem] text-brique">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="t-titre text-[0.9375rem] leading-[1.25]">
                    {chapitre.titre}
                  </h2>
                  {chapitre.resume ? (
                    <p className="t-corps mt-0.5 text-[0.8125rem] leading-[1.35] text-gris-72">
                      {chapitre.resume}
                    </p>
                  ) : null}
                </div>
                <span className="t-tech shrink-0 pt-[3px] text-[0.6875rem] text-gris-40">
                  {chapitre.minutes > 0 ? duree(chapitre.minutes) : "à écrire"}
                </span>
              </header>

              <ul>
                {chapitre.lecons.map((lecon) => (
                  <LigneLecon
                    key={lecon.id}
                    lecon={lecon}
                    coursSlug={cours.slug}
                    terminee={
                      pret && progression.lecons[lecon.id]?.etat === "terminee"
                    }
                    ouverte={
                      pret && progression.lecons[lecon.id]?.etat === "ouverte"
                    }
                    onBasculer={() =>
                      marquer(
                        lecon.id,
                        progression.lecons[lecon.id]?.etat === "terminee"
                          ? "neuve"
                          : "terminee",
                      )
                    }
                  />
                ))}
              </ul>
            </section>
          ))
        )}

        <div className="h-6" />
      </div>
    </div>
  );

  // ── Le volet : la fiche ───────────────────────────────────────────────────
  const volet = (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-4">
        <Etq ton="encre">Le cours</Etq>
        <span className="t-cote text-[0.75rem] text-brique">
          {NOM_NIVEAU[cours.niveau]}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-filet px-4 py-4">
          {avancement.total === 0 ? (
            // Un cours annoncé n'a rien à mesurer. Le signe s'y afficherait
            // vide, ce qui se lit comme « rien de fait » plutôt que comme
            // « rien à faire encore ». On dit l'état à la place.
            <div
              className="trame trame-bord border border-filet-fort px-4 py-5 text-center"
              style={{ ["--trame-op" as string]: "0.14" }}
            >
              <p className="t-etq text-brique">À paraître</p>
              <p className="t-corps mt-2 text-[0.8125rem] leading-[1.5] text-gris-72">
                Ce cours fait partie du programme. Ses leçons restent à écrire.
              </p>
            </div>
          ) : (
            <>
              <Monument
                cran={pret ? avancement.cran : 0}
                construit={pret && avancement.commence}
                className="mx-auto h-[5.25rem] text-encre"
                titre={`${avancement.faites} leçon sur ${avancement.total} terminée`}
              />
              <LigneAvancement
                avancement={avancement}
                pret={pret}
                className="mt-4"
              />
              <p className="t-tech mt-2 text-center text-[0.6875rem] text-gris-58">
                {!pret
                  ? " "
                  : avancement.termine
                    ? "Cours terminé"
                    : avancement.commence
                      ? `${duree(avancement.minutesRestantes)} restantes`
                      : `${duree(cours.minutes)} en tout`}
              </p>
              <div className="mt-3.5">{commande}</div>
            </>
          )}
        </div>

        <div className="px-4 py-3.5">
          <Fiche cours={cours} />
        </div>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} />;
}

// ── La fiche, partagée par les deux formats ─────────────────────────────────

function Fiche({
  cours,
  commande,
  children,
}: {
  cours: CoursComplet;
  commande?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="t-corps text-[0.875rem] leading-[1.55] text-gris-72">
        {cours.presentation}
      </p>

      {children}
      {commande ? <div className="mt-3.5">{commande}</div> : null}

      <section className="mt-5">
        <Etq ton="encre">À la fin, vous saurez</Etq>
        <ul className="mt-2 border-t border-filet">
          {cours.objectifs.map((objectif) => (
            <li
              key={objectif}
              className="flex items-baseline gap-2.5 border-b border-filet py-2"
            >
              <Icone
                nom="coche"
                className="mt-[2px] h-3.5 w-3.5 shrink-0 self-start text-brique"
              />
              <span className="t-corps text-[0.8125rem] leading-[1.4]">
                {objectif}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <Etq ton="encre">À savoir avant</Etq>
        <ul className="mt-2 border-t border-filet">
          {cours.prerequis.map((p) => (
            <li key={p.texte} className="border-b border-filet py-2">
              {p.coursSlug ? (
                <Link
                  href={`/apprendre/cours/${p.coursSlug}`}
                  className="group flex items-baseline gap-2"
                >
                  <span className="t-corps text-[0.8125rem] leading-[1.4] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[3px]">
                    {p.texte}
                  </span>
                  <Icone
                    nom="chevron-droite"
                    className="h-3 w-3 shrink-0 -translate-y-[1px] text-gris-40 group-hover:text-encre"
                  />
                </Link>
              ) : (
                <span className="t-corps text-[0.8125rem] leading-[1.4] text-gris-72">
                  {p.texte}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <Etq ton="encre">Écrit par</Etq>
        <ul className="mt-2 border-t border-filet">
          {cours.auteurs.map((auteur) => (
            <li
              key={auteur.id}
              className="flex items-baseline justify-between gap-2 border-b border-filet py-2"
            >
              <span className="t-corps-f text-[0.8125rem]">{auteur.nom}</span>
              {auteur.qualite && (
                <span className="t-tech text-[0.6875rem] text-gris-58">
                  {auteur.qualite}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ── Une ligne du sommaire ───────────────────────────────────────────────────

function LigneLecon({
  lecon,
  coursSlug,
  terminee,
  ouverte,
  onBasculer,
}: {
  lecon: Lecon;
  coursSlug: string;
  terminee: boolean;
  ouverte: boolean;
  onBasculer: () => void;
}) {
  const annonce = lecon.statut !== "publie";

  const corps = (
    <>
      <Icone
        nom={ICONE_GENRE[lecon.genre]}
        className={cx(
          "mt-[3px] h-4 w-4 shrink-0 self-start",
          annonce ? "text-gris-24" : terminee ? "text-gris-40" : "text-gris-58",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cx(
              "t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]",
              annonce
                ? "text-gris-40"
                : terminee
                  ? "text-gris-58 line-through decoration-1"
                  : "text-encre",
            )}
          >
            {lecon.titre}
          </span>
          {annonce ? (
            <span className="t-etq shrink-0 border border-filet px-1.5 py-[3px] text-gris-40">
              À paraître
            </span>
          ) : ouverte && !terminee ? (
            <span className="t-etq shrink-0 text-brique">Commencée</span>
          ) : null}
        </div>
        <p
          className={cx(
            "t-corps mt-0.5 text-[0.8125rem] leading-[1.35]",
            annonce ? "text-gris-24" : "text-gris-72",
          )}
        >
          {lecon.resume}
        </p>
        <p className="t-tech mt-1 text-[0.6875rem] text-gris-40">
          {NOM_GENRE[lecon.genre]} · {duree(lecon.minutes)}
          {lecon.libre ? " · en accès libre" : ""}
        </p>
      </div>
    </>
  );

  if (annonce) {
    return (
      <li className="flex gap-3 border-b border-filet px-3 py-2.5 last:border-b-0 lg:px-4">
        <span aria-hidden className="mt-[2px] h-[15px] w-[15px] shrink-0 border border-gris-24 bg-gris-04" />
        {corps}
      </li>
    );
  }

  return (
    <li
      className={cx(
        "flex gap-3 border-b border-filet px-3 py-2.5 transition-colors last:border-b-0 lg:px-4",
        terminee ? "bg-gris-04" : "hover:bg-gris-04",
      )}
    >
      <Case
        cochee={terminee}
        onChange={onBasculer}
        label={`Marquer « ${lecon.titre} » comme terminée`}
      />
      <Link
        href={`/apprendre/cours/${coursSlug}/${lecon.slug}`}
        className="group flex min-w-0 flex-1 gap-3"
      >
        {corps}
        <Icone
          nom="fleche-droite"
          className="mt-[3px] h-4 w-4 shrink-0 self-start text-gris-24 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-encre motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

/** La règle d'avancement d'un chapitre. Sert au volet de la page d'une leçon. */
export function RegleChapitre({ part }: { part: number }) {
  return <Regle part={part} />;
}
