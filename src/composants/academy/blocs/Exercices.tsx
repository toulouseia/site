"use client";

import { useMemo, useState } from "react";
import type { BlocExercice, BlocQuiz } from "@/serveur/domaine/blocs";
import { Icone } from "@/composants/base/Icone";
import { cx, duree } from "@/lib/format";
import { Ligne, Prose } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// Ce qu'on fait, plutôt que ce qu'on lit.
//
// Deux principes de pédagogie tenus par le code :
//
//   1. UNE RÉPONSE FAUSSE N'EST JAMAIS PUNIE. Pas de rouge sur l'option
//      choisie, pas de score qui tombe : on montre la bonne réponse et on
//      explique. Le quiz sert à apprendre, pas à noter.
//   2. LES INDICES SE RÉVÈLENT UN PAR UN. Donner les trois d'un coup revient à
//      donner la correction ; les donner à la demande laisse l'étudiant
//      décider de la quantité d'aide qu'il prend.
// ─────────────────────────────────────────────────────────────────────────────

export function BQuiz({ bloc }: { bloc: BlocQuiz }) {
  const [reponses, setReponses] = useState<Record<string, string>>({});

  const repondu = Object.keys(reponses).length;
  const justes = useMemo(
    () =>
      bloc.questions.filter((q) => reponses[q.id] === q.bonneOptionId).length,
    [bloc.questions, reponses],
  );
  const fini = repondu === bloc.questions.length;

  return (
    <section id={bloc.ancre} className="mt-8 border border-filet-fort">
      <header className="flex h-10 items-center gap-2.5 border-b border-filet bg-gris-04 px-3">
        <span className="t-etq text-encre">{bloc.titre ?? "Quiz"}</span>
        <span className="t-cote text-[0.75rem] text-brique">
          {repondu} / {bloc.questions.length}
        </span>
        <span className="flex-1" />
        {repondu > 0 ? (
          <button
            type="button"
            onClick={() => setReponses({})}
            className="cmd cmd-nu cmd-s h-7"
          >
            Recommencer
          </button>
        ) : null}
      </header>

      <ol>
        {bloc.questions.map((q, i) => {
          const choix = reponses[q.id];
          const traite = choix !== undefined;
          return (
            <li key={q.id} className="border-b border-filet px-3 py-4 last:border-b-0">
              <div className="flex items-baseline gap-2.5">
                <span className="t-cote w-6 shrink-0 text-[0.75rem] text-gris-40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="t-corps-f min-w-0 flex-1 text-[0.9375rem] leading-[1.45]">
                  <Ligne texte={q.enonce} />
                </p>
              </div>

              <ul className="mt-3 ml-[2.1rem] flex flex-col gap-1.5">
                {q.options.map((o) => {
                  const choisie = choix === o.id;
                  const bonne = o.id === q.bonneOptionId;
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        disabled={traite}
                        onClick={() =>
                          setReponses((r) => ({ ...r, [q.id]: o.id }))
                        }
                        aria-pressed={choisie}
                        className={cx(
                          "flex w-full items-start gap-2.5 border px-2.5 py-2 text-left transition-colors duration-100",
                          !traite &&
                            "border-filet-fort hover:border-encre hover:bg-gris-04",
                          traite && bonne && "border-encre bg-sombre text-papier",
                          traite &&
                            !bonne &&
                            choisie &&
                            "border-brique text-gris-72",
                          traite && !bonne && !choisie && "border-filet text-gris-40",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx(
                            "mt-[2px] flex h-[15px] w-[15px] shrink-0 items-center justify-center border",
                            traite && bonne
                              ? "border-papier text-papier"
                              : traite && choisie
                                ? "border-brique text-brique"
                                : "border-gris-40",
                          )}
                        >
                          {traite && bonne ? (
                            <Icone nom="coche" className="h-[10px] w-[10px]" />
                          ) : traite && choisie ? (
                            <Icone nom="croix" className="h-[9px] w-[9px]" />
                          ) : null}
                        </span>
                        <span className="t-corps min-w-0 flex-1 text-[0.875rem] leading-[1.4]">
                          {o.texte}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {traite ? (
                <div className="an-monte mt-3 ml-[2.1rem] border-l-2 border-l-gris-40 bg-gris-04 py-2.5 pr-3 pl-3">
                  <p className="t-etq text-gris-58">
                    {choix === q.bonneOptionId ? "Juste" : "La bonne réponse"}
                  </p>
                  <div className="mt-1.5">
                    <Prose texte={q.explication} className="text-[0.8125rem]" />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {fini ? (
        <footer className="an-monte flex items-center gap-2.5 border-t border-filet bg-gris-04 px-3 py-3">
          <span className="t-chiffre text-[1.25rem]">
            {justes}/{bloc.questions.length}
          </span>
          <p className="t-corps text-[0.8125rem] leading-[1.4] text-gris-72">
            {justes === bloc.questions.length
              ? "Tout est en place. La suite du cours peut commencer."
              : "Les explications au-dessus valent mieux que le score : relisez celles des questions manquées."}
          </p>
        </footer>
      ) : null}
    </section>
  );
}

// ── Exercice ────────────────────────────────────────────────────────────────

export function BExercice({ bloc }: { bloc: BlocExercice }) {
  const [indices, setIndices] = useState(0);
  const [correction, setCorrection] = useState(false);
  const total = bloc.indices?.length ?? 0;

  return (
    <section id={bloc.ancre} className="mt-8 border-2 border-encre">
      <header className="flex h-10 items-center gap-2.5 border-b border-filet bg-sombre px-3 text-papier">
        <span className="t-etq">Exercice</span>
        <span className="t-corps-f min-w-0 flex-1 truncate text-[0.875rem]">
          <Ligne texte={bloc.titre} />
        </span>
        {bloc.minutes ? (
          <span className="t-cote shrink-0 text-[0.75rem] text-brique-nuit">
            {duree(bloc.minutes)}
          </span>
        ) : null}
      </header>

      <div className="px-3 py-3.5">
        <Prose texte={bloc.enonce} />

        {bloc.attendu ? (
          <p className="t-tech mt-3 border-t border-filet pt-2.5 text-[0.75rem] text-gris-58">
            Attendu · {bloc.attendu}
          </p>
        ) : null}

        {total > 0 ? (
          <div className="mt-4">
            <ol>
              {bloc.indices!.slice(0, indices).map((indice, i) => (
                <li
                  key={i}
                  className="an-monte mt-2 flex gap-2.5 border-l-2 border-l-brique bg-gris-04 py-2 pr-3 pl-3 first:mt-0"
                >
                  <span className="t-cote shrink-0 text-[0.75rem] text-brique">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Prose texte={indice} className="text-[0.8125rem]" />
                  </div>
                </li>
              ))}
            </ol>
            {indices < total ? (
              <button
                type="button"
                onClick={() => setIndices((n) => n + 1)}
                className="cmd cmd-trait cmd-s mt-3"
              >
                <Icone nom="plus" className="h-3.5 w-3.5" />
                {indices === 0
                  ? `Un indice (${total} disponibles)`
                  : `Indice suivant (${total - indices} restants)`}
              </button>
            ) : null}
          </div>
        ) : null}

        {bloc.correction ? (
          <div className="mt-4 border-t border-filet pt-3.5">
            {correction ? (
              <div className="an-monte">
                <p className="t-etq text-gris-58">Correction</p>
                <div className="mt-2">
                  <Prose texte={bloc.correction} className="text-[0.875rem]" />
                </div>
                <button
                  type="button"
                  onClick={() => setCorrection(false)}
                  className="cmd cmd-nu cmd-s mt-2 px-0"
                >
                  Replier
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCorrection(true)}
                className="cmd cmd-plein cmd-s"
              >
                <Icone nom="chevron-bas" className="h-3.5 w-3.5" />
                Voir la correction
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
