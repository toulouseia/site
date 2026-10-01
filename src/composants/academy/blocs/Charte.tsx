import katex from "katex";
import type {
  BlocDerivation,
  BlocRepere,
  BlocSortie,
  BlocTableau,
  BlocVerification,
} from "@/serveur/domaine/blocs";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { Legende, Ligne, Prose } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// Les cinq blocs de la charte pédagogique.
//
// Ils partagent une règle de dessin : la structure du bloc se voit. Une
// dérivation dont on aurait sauté une étape doit se remarquer à l'œil, un
// repère amputé d'un de ses quatre champs aussi. C'est la raison d'être de ces
// types : ce que le texte libre laisse tomber, la forme le réclame.
// ─────────────────────────────────────────────────────────────────────────────

function formule(latex: string, bloc = true): string {
  return katex.renderToString(latex, {
    displayMode: bloc,
    throwOnError: false,
    output: "htmlAndMathml",
    strict: "ignore",
  });
}

// ── Le tableau ──────────────────────────────────────────────────────────────

export function BTableau({ bloc }: { bloc: BlocTableau }) {
  return (
    <figure id={bloc.ancre} className="mt-6">
      <div className="border border-filet-fort">
        {bloc.titre ? (
          <p className="t-etq border-b border-filet bg-gris-04 px-3 py-2 text-gris-58">
            <Ligne texte={bloc.titre} />
          </p>
        ) : null}
        {/* Un tableau large défile chez lui : la page, jamais. */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-b-encre">
                {/* Les en-têtes passent par la même grammaire que les
                    cellules. Sans cela, un en-tête qui nomme un ensemble
                    affichait « $\mathcal{Y}$ » en toutes lettres. */}
                {bloc.entetes.map((entete, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="t-etq px-3 py-2 align-bottom whitespace-nowrap text-gris-58"
                  >
                    <Ligne texte={entete} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloc.lignes.map((ligne, i) => (
                <tr key={i} className="border-b border-filet last:border-b-0">
                  {ligne.map((cellule, j) => (
                    <td
                      key={j}
                      className={cx(
                        "px-3 py-2 align-top text-[0.8125rem] leading-[1.4]",
                        j === 0 && bloc.cleEnTete
                          ? "t-corps-f text-encre"
                          : "t-corps text-gris-72",
                        /^[\d−+.,%×/ -]+$/.test(cellule) &&
                          "t-cote text-encre tabular-nums",
                      )}
                    >
                      {cellule === "✓" ? (
                        <span className="text-encre">✓</span>
                      ) : cellule === "✗" ? (
                        <span className="text-brique">✗</span>
                      ) : (
                        <Prose texte={cellule} className="text-[0.8125rem]" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Legende texte={bloc.legende} />
    </figure>
  );
}

// ── La dérivation, en sept temps ────────────────────────────────────────────

function Temps({
  numero,
  nom,
  children,
}: {
  numero: number;
  nom: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-x-2 border-t border-filet py-2.5 first:border-t-0">
      <span className="t-cote pt-[3px] text-[0.6875rem] text-brique tabular-nums">
        {numero}
      </span>
      <div className="min-w-0">
        <p className="t-etq text-gris-58">{nom}</p>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}

export function BDerivation({ bloc }: { bloc: BlocDerivation }) {
  let n = 0;
  return (
    <section id={bloc.ancre} className="mt-8 border-2 border-encre">
      <header className="flex h-10 items-center gap-2.5 border-b border-filet bg-sombre px-3 text-papier">
        <span className="t-etq">Dérivation</span>
        <span className="t-corps-f min-w-0 flex-1 truncate text-[0.875rem]">
          <Ligne texte={bloc.titre} />
        </span>
      </header>

      <div className="px-3 py-2">
        {bloc.hypotheses?.length ? (
          <Temps numero={++n} nom="Hypothèses">
            <ul>
              {bloc.hypotheses.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-gris-40">
                    ·
                  </span>
                  <div className="min-w-0 flex-1">
                    <Prose texte={h} className="text-[0.875rem]" />
                  </div>
                </li>
              ))}
            </ul>
          </Temps>
        ) : null}

        {bloc.depart ? (
          <Temps numero={++n} nom="Point de départ">
            <div
              className="katex-bloc overflow-x-auto"
              role="math"
              aria-label={bloc.depart.alt}
              dangerouslySetInnerHTML={{ __html: formule(bloc.depart.latex) }}
            />
          </Temps>
        ) : null}

        {bloc.chaine ? (
          <Temps numero={++n} nom="Chaîne de dépendances">
            <p className="t-tech text-[0.875rem] text-encre">
              <Ligne texte={bloc.chaine} />
            </p>
          </Temps>
        ) : null}

        {bloc.proprietes?.length ? (
          <Temps numero={++n} nom="Propriétés utilisées">
            <ul>
              {bloc.proprietes.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-gris-40">
                    ·
                  </span>
                  <div className="min-w-0 flex-1">
                    <Prose texte={p} className="text-[0.875rem]" />
                  </div>
                </li>
              ))}
            </ul>
          </Temps>
        ) : null}

        <Temps numero={++n} nom="Étapes">
          <ol>
            {bloc.etapes.map((etape, i) => (
              <li
                key={i}
                className="mt-3 border-l-2 border-l-filet-fort pl-3 first:mt-0"
              >
                {etape.texte ? (
                  <Prose texte={etape.texte} className="text-[0.875rem]" />
                ) : null}
                {etape.latex ? (
                  <div
                    className="katex-bloc mt-1.5 overflow-x-auto"
                    role="math"
                    aria-label={etape.alt ?? ""}
                    dangerouslySetInnerHTML={{ __html: formule(etape.latex) }}
                  />
                ) : null}
                {etape.justification ? (
                  <p className="t-tech mt-1 text-[0.6875rem] text-gris-58">
                    <Ligne texte={etape.justification} />
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </Temps>

        <Temps numero={++n} nom="Résultat">
          <div className="border-y-2 border-y-encre bg-gris-04 px-3 py-3">
            <div
              className="katex-bloc overflow-x-auto"
              role="math"
              aria-label={bloc.resultat.alt}
              dangerouslySetInnerHTML={{ __html: formule(bloc.resultat.latex) }}
            />
          </div>
        </Temps>

        <Temps numero={++n} nom="Interprétation">
          <Prose texte={bloc.interpretation} className="text-[0.875rem]" />
          {bloc.limites?.length ? (
            <div className="mt-2.5 border-l-2 border-l-brique bg-gris-04 py-2 pr-3 pl-3">
              <p className="t-etq text-brique">Ce que ce résultat ne dit pas</p>
              <ul className="mt-1.5">
                {bloc.limites.map((l, i) => (
                  <li key={i} className="mt-1 flex gap-2 first:mt-0">
                    <span aria-hidden className="text-brique">
                      ·
                    </span>
                    <div className="min-w-0 flex-1">
                      <Prose texte={l} className="text-[0.8125rem]" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Temps>
      </div>
    </section>
  );
}

// ── Le repère de progression ────────────────────────────────────────────────

export function BRepere({ bloc }: { bloc: BlocRepere }) {
  const lignes: [string, string][] = [
    ["Ce que nous cherchons", bloc.cherche],
    ["Pourquoi", bloc.pourquoi],
    ["Où nous en sommes", bloc.ou],
    ["L'étape suivante", bloc.suite],
  ];
  return (
    <aside
      id={bloc.ancre}
      className="trame trame-bord mt-8 border-y-2 border-y-encre py-3.5"
      style={{ ["--trame-op" as string]: "0.07" }}
    >
      <p className="t-etq flex items-center gap-1.5 px-3 text-brique">
        <Icone nom="jalon" className="h-3.5 w-3.5 shrink-0" />
        Où en sommes-nous
      </p>
      <dl className="mt-2 px-3">
        {lignes.map(([cle, valeur]) => (
          <div
            key={cle}
            className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-baseline gap-3 border-t border-filet py-1.5"
          >
            <dt className="t-etq text-gris-58">{cle}</dt>
            {/* Les quatre champs sont de la prose : ils citent des symboles
                et mettent des mots en gras. Rendus bruts, ils affichaient
                « $\boldsymbol{\theta}$ » et « **différente** » en toutes
                lettres, et le repère est sur chaque page du cours. */}
            <dd className="t-corps text-[0.8125rem] leading-[1.45]">
              <Ligne texte={valeur} />
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

// ── La vérification de compréhension ────────────────────────────────────────

export function BVerification({ bloc }: { bloc: BlocVerification }) {
  const lettres = ["a", "b", "c", "d"];
  return (
    <section
      id={bloc.ancre}
      className="mt-8 border border-filet-fort border-l-2 border-l-brique"
    >
      <header className="flex h-9 items-center gap-2.5 border-b border-filet bg-gris-04 px-3">
        <Icone nom="eprouvette" className="h-3.5 w-3.5 shrink-0 text-brique" />
        <span className="t-etq text-brique">
          Vérification rapide n° {bloc.numero}
        </span>
      </header>
      <div className="px-3 py-3">
        <Prose texte={bloc.enonce} className="text-[0.875rem]" />
        <ol className="mt-3 border-t border-filet">
          {bloc.questions.map((q, i) => (
            <li
              key={i}
              className="grid grid-cols-[1.4rem_minmax(0,1fr)] gap-x-2 border-b border-filet py-2 last:border-b-0"
            >
              <span className="t-cote pt-[2px] text-[0.75rem] text-brique">
                {lettres[i] ?? String(i + 1)}
              </span>
              <div className="min-w-0">
                <Prose texte={q} className="text-[0.875rem]" />
              </div>
            </li>
          ))}
        </ol>
        <p className="t-etq mt-3 text-gris-40">
          Aucune réponse à cliquer : il y a un calcul à faire.
        </p>
      </div>
    </section>
  );
}

// ── La sortie de programme ──────────────────────────────────────────────────

export function BSortie({ bloc }: { bloc: BlocSortie }) {
  return (
    <div id={bloc.ancre} className="mt-6">
      <div className="border border-filet-fort">
        <p className="t-etq border-b border-filet bg-gris-04 px-3 py-2 text-gris-58">
          {bloc.titre ?? "Sortie du programme"}
        </p>
        <pre className="overflow-x-auto px-3 py-2.5 text-[0.75rem] leading-[1.55]">
          <code className="t-tech block whitespace-pre text-encre">
            {bloc.texte.replace(/^\n+|\n+$/g, "")}
          </code>
        </pre>
      </div>
      {bloc.lecture?.length ? (
        <div className="mt-2 border-l-2 border-l-gris-40 bg-gris-04 py-2.5 pr-3 pl-3">
          <p className="t-etq text-gris-58">Lecture</p>
          <ul className="mt-1.5">
            {bloc.lecture.map((l, i) => (
              <li key={i} className="mt-1.5 flex gap-2 first:mt-0">
                <span aria-hidden className="text-gris-40">
                  ·
                </span>
                <div className="min-w-0 flex-1">
                  <Prose texte={l} className="text-[0.8125rem]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
