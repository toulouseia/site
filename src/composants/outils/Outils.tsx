"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Annale, Outil, ReponseAgent } from "@/donnees/types";
import { Icone } from "@/composants/base/Icone";
import { MarqueDeLOutil } from "@/composants/base/MarquesOutils";
import { Case, DeuxZones } from "@/composants/base/DeuxZones";
import { Etq, LigneFiche } from "@/composants/base/Atomes";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { aplatir, cx } from "@/lib/format";

/**
 * La boîte à outils. Une grille de grandes cases, une case par outil, et
 * rien d'autre : pas d'état, pas de compteur, pas de liste d'attente. Ce qui
 * est ici est fini et ouvert ; ce qui ne l'est pas est un projet, et les
 * projets ont déjà leur écran.
 */
export function Outils({
  outils,
  reponses,
  annales,
}: {
  outils: Outil[];
  reponses: ReponseAgent[];
  annales: Annale[];
}) {
  const [id, setId] = useState(outils[0].id);
  const [ouvert, setOuvert] = useState(false);
  const outil = outils.find((o) => o.id === id) ?? outils[0];

  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection titre="Outils" />
        <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">Boîte à outils</Etq>
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {/* Les grandes cases. Le filet d'un pixel entre elles vient du fond :
            chaque case reste pleine, et l'inversion au survol ne mange pas
            la grille. */}
        <div className="grid grid-cols-1 gap-px border-b border-filet bg-filet sm:grid-cols-2">
          {outils.map((o) => {
            // Sur ordinateur, la case choisie s'inverse parce que son outil est
            // ouvert à droite, en permanence. Sur téléphone il n'y a rien
            // d'ouvert tant qu'on n'a pas touché : une case noire d'entrée
            // ferait croire à un choix qu'on n'a pas fait.
            const actif = o.id === outil.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setId(o.id);
                  setOuvert(true);
                }}
                aria-current={actif ? "true" : undefined}
                className={cx(
                  "bande group flex h-[14rem] flex-col items-start bg-papier p-4 text-left hover:bg-sombre hover:text-papier sm:h-[16rem] lg:h-[20rem] lg:p-5",
                  actif && "lg:bg-sombre lg:text-papier",
                )}
              >
                {/* La marque s'aligne sur le titre tant que la case est plus
                    large que haute — un dessin centré à 200 pixels du texte
                    qu'il désigne ne le désigne plus. Dès deux colonnes, la
                    case redevient carrée et le centre reprend ses droits. */}
                <span className="flex w-full flex-1 items-center justify-start sm:justify-center">
                  <MarqueDeLOutil marque={o.marque} className="h-16 lg:h-24" />
                </span>
                <span className="t-titre text-[1rem] leading-[1.25] lg:text-[1.125rem]">
                  {o.nom}
                </span>
                <span
                  className={cx(
                    "t-corps mt-1.5 text-[0.8125rem] leading-[1.35] text-gris-72 group-hover:text-nuit-72",
                    actif && "lg:text-nuit-72",
                  )}
                >
                  {o.resume}
                </span>
              </button>
            );
          })}
        </div>

        <section className="px-3 py-4 lg:px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="min-w-0 flex-1">
              <Etq ton="encre">Un outil manque</Etq>
            </span>
            <Link href="/deposer" className="cmd cmd-trait cmd-s">
              <Icone nom="plus" className="h-3.5 w-3.5" />
              Déposer un projet
            </Link>
          </div>
        </section>
        <div className="h-6" />
      </div>
    </div>
  );

  const volet = (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-2 lg:px-4">
        <button
          type="button"
          onClick={() => setOuvert(false)}
          className="cmd cmd-nu cmd-s gap-1.5 lg:hidden"
        >
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Outils
        </button>
        <Etq ton="encre" className="hidden lg:block">
          {outil.nom}
        </Etq>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {outil.marque === "moodle" ? (
          <AgentMoodle outil={outil} reponses={reponses} />
        ) : (
          <BanqueAnnales outil={outil} annales={annales} />
        )}
      </div>

      <div className="shrink-0 border-t border-filet px-3 py-2.5">
        <Link href="/deposer" className="cmd cmd-trait w-full">
          <Icone nom="plus" className="h-4 w-4" />
          Proposer un outil
        </Link>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} ouvertMobile={ouvert} />;
}

function EnTeteOutil({ outil }: { outil: Outil }) {
  return (
    <div className="border-b border-filet px-4 pt-4 pb-4">
      <h2 className="t-titre-xl text-[1.75rem]">{outil.nom}</h2>
      <p className="t-corps mt-2 text-[0.9375rem] leading-[1.4] text-gris-72">
        {outil.resume}
      </p>
    </div>
  );
}

function Fiches({ outil }: { outil: Outil }) {
  return (
    <section className="px-4 pt-3 pb-5">
      <Etq>Fiche</Etq>
      <div className="mt-2">
        {outil.fiches.map((f, i) => (
          <LigneFiche key={f.etiquette} etiquette={f.etiquette} filet={i > 0}>
            {f.valeur}
          </LigneFiche>
        ))}
      </div>
    </section>
  );
}

function AgentMoodle({
  outil,
  reponses,
}: {
  outil: Outil;
  reponses: ReponseAgent[];
}) {
  const [q, setQ] = useState("");
  const [etat, etatSet] = useState<"repos" | "cherche" | "repondu">("repos");
  const [reponse, reponseSet] = useState<ReponseAgent | null>(null);

  function demander(texte: string) {
    const t = texte.trim();
    if (!t) return;
    setQ(t);
    etatSet("cherche");
    window.setTimeout(() => {
      const mots = aplatir(t)
        .split(/\s+/)
        .filter((m) => m.length > 3);
      const trouve =
        reponses.find((r) => aplatir(r.question) === aplatir(t)) ??
        reponses.find((r) => {
          const foin = aplatir(r.question);
          return mots.filter((m) => foin.includes(m)).length >= 2;
        }) ??
        null;
      reponseSet(trouve);
      etatSet("repondu");
    }, 850);
  }

  return (
    <div>
      <EnTeteOutil outil={outil} />

      <div className="border-b border-filet px-4 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            demander(q);
          }}
          className="flex gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Votre question sur un cours…"
            aria-label="Question"
            className="champ"
          />
          <button
            type="submit"
            disabled={!q.trim() || etat === "cherche"}
            className="cmd cmd-plein shrink-0 px-3"
            aria-label="Chercher"
          >
            <Icone nom="fleche-droite" className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-3">
          <Etq>Exemples</Etq>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {reponses.map((r) => (
              <button
                key={r.question}
                type="button"
                onClick={() => demander(r.question)}
                className="puce max-w-full"
              >
                <span className="truncate">{r.question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {etat === "repos" ? (
          <div
            className="trame trame-bord flex flex-col items-center justify-center py-10"
            style={{ ["--trame-op" as string]: "0.14" }}
          >
            <span className="border border-filet-fort bg-papier px-4 py-3">
              <span className="t-etq block text-encre">Rien demandé</span>
              <span className="t-tech mt-1.5 block text-[0.6875rem] text-gris-58">
                4 questions préenregistrées
              </span>
            </span>
          </div>
        ) : etat === "cherche" ? (
          <div>
            <div className="relative h-[3px] overflow-hidden bg-gris-14">
              <span className="an-balaie absolute top-0 left-0 h-full w-1/4 bg-encre" />
            </div>
            <p className="t-tech mt-2.5 text-[0.75rem] text-gris-58">
              Lecture des supports indexés…
            </p>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-11/12 bg-gris-08" />
              <div className="h-3 w-full bg-gris-08" />
              <div className="h-3 w-8/12 bg-gris-08" />
            </div>
          </div>
        ) : reponse ? (
          <div>
            <Etq>Réponse</Etq>
            <p className="t-corps mt-2 text-[0.875rem] leading-[1.55] text-gris-86">
              {reponse.reponse}
            </p>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <Etq>Sources</Etq>
                <span className="t-cote text-[0.6875rem] text-brique">
                  {reponse.sources.length}
                </span>
              </div>
              <ul className="mt-2 border-t border-filet">
                {reponse.sources.map((s) => (
                  <li
                    key={s.titre}
                    className="flex items-start gap-2 border-b border-filet py-2"
                  >
                    <Icone
                      nom="papier"
                      className="mt-[2px] h-4 w-4 shrink-0 text-gris-58"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="t-corps-f block text-[0.8125rem]">
                        {s.titre}
                      </span>
                      <span className="t-tech mt-0.5 block text-[0.6875rem] text-gris-58">
                        {s.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="t-etq mt-4 text-gris-40">
              Maquette · réponse préenregistrée, rien n&apos;est appelé
            </p>
          </div>
        ) : (
          <div
            className="trame trame-bord flex flex-col items-center gap-3 py-10 text-center"
            style={{ ["--trame-op" as string]: "0.14" }}
          >
            <span className="border border-filet-fort bg-papier px-5 py-4">
              <span className="t-etq block text-encre">Hors démonstration</span>
              <span className="t-tech mt-1.5 block text-[0.6875rem] text-gris-58">
                Seules 4 questions sont préenregistrées
              </span>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  etatSet("repos");
                }}
                className="cmd cmd-trait cmd-s mt-3"
              >
                Reprendre
              </button>
            </span>
          </div>
        )}
      </div>

      <Fiches outil={outil} />
    </div>
  );
}

function BanqueAnnales({
  outil,
  annales,
}: {
  outil: Outil;
  annales: Annale[];
}) {
  const [q, setQ] = useState("");
  const [corrigeSeul, setCorrigeSeul] = useState(false);

  // Les notions qui reviennent le plus : c'est par la notion qu'on cherche un
  // sujet quand on révise, pas par le nom de l'épreuve.
  const notions = useMemo(() => {
    const compte = new Map<string, number>();
    for (const a of annales)
      for (const n of a.notions) compte.set(n, (compte.get(n) ?? 0) + 1);
    return [...compte.entries()]
      .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
      .slice(0, 6)
      .map(([n]) => n);
  }, [annales]);

  const liste = useMemo(() => {
    const mots = aplatir(q.trim());
    return annales.filter((a) => {
      if (corrigeSeul && !a.corrige) return false;
      if (!mots) return true;
      const foin = aplatir(
        `${a.matiere} ${a.epreuve} ${a.annee} ${a.notions.join(" ")}`,
      );
      return foin.includes(mots);
    });
  }, [annales, q, corrigeSeul]);

  return (
    <div>
      <EnTeteOutil outil={outil} />

      <div className="border-b border-filet px-4 py-4">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Une notion, une matière, une année…"
            aria-label="Chercher un sujet"
            className="champ"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="cmd cmd-trait shrink-0 px-3"
              aria-label="Effacer"
            >
              <Icone nom="croix" className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-3">
          <Etq>Notions les plus cherchées</Etq>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {notions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQ(n === q ? "" : n)}
                aria-pressed={n === q}
                className="puce max-w-full"
              >
                <span className="truncate">{n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* La case et son texte sont deux boutons côte à côte, jamais l'un
            dans l'autre : un bouton imbriqué dans un bouton n'est pas du HTML
            valide, et React s'en plaint au chargement. */}
        <div className="mt-3.5 flex items-center gap-2">
          <Case
            cochee={corrigeSeul}
            onChange={() => setCorrigeSeul((v) => !v)}
            label="Seulement les sujets corrigés"
          />
          <button
            type="button"
            onClick={() => setCorrigeSeul((v) => !v)}
            className="t-corps text-left text-[0.8125rem] text-gris-72"
          >
            Seulement les sujets corrigés
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-baseline gap-2">
          <Etq>Sujets</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {liste.length}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            sur {annales.length}
          </span>
        </div>

        {liste.length === 0 ? (
          <div
            className="trame trame-bord mt-3 flex flex-col items-center py-10 text-center"
            style={{ ["--trame-op" as string]: "0.14" }}
          >
            <span className="border border-filet-fort bg-papier px-5 py-4">
              <span className="t-etq block text-encre">Aucun sujet</span>
              <span className="t-tech mt-1.5 block text-[0.6875rem] text-gris-58">
                Rien de déposé sur cette notion
              </span>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCorrigeSeul(false);
                }}
                className="cmd cmd-trait cmd-s mt-3"
              >
                Tout revoir
              </button>
            </span>
          </div>
        ) : (
          <ul className="mt-2 border-t border-filet">
            {liste.map((a) => (
              <li
                key={a.id}
                className="border-b border-filet py-2.5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="t-corps-f min-w-0 flex-1 text-[0.875rem]">
                    {a.matiere}
                  </span>
                  <span className="t-cote shrink-0 text-[0.75rem] text-brique">
                    {a.annee}
                  </span>
                </div>
                <p className="t-tech mt-1 text-[0.6875rem] text-gris-58">
                  {a.epreuve} · {a.pages} pages ·{" "}
                  {a.corrige ? "corrigé fourni" : "sans corrigé"}
                </p>
                <p className="t-corps mt-1 text-[0.75rem] text-gris-72">
                  {a.notions.join("  ·  ")}
                </p>
              </li>
            ))}
          </ul>
        )}

        <p className="t-etq mt-4 text-gris-40">
          Maquette · sujets fictifs, aucun fichier n&apos;est servi
        </p>
      </div>

      <Fiches outil={outil} />
    </div>
  );
}
