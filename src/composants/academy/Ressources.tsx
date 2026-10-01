"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  FormatRessource,
  Niveau,
  Ressource,
  Seance,
} from "@/serveur/domaine/club";
import { Icone, type NomIcone } from "@/composants/base/Icone";
import { Case, DeuxZones } from "@/composants/base/DeuxZones";
import { Etq, Vide } from "@/composants/base/Atomes";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { useMarques } from "@/lib/marques";
import {
  NOM_FORMAT,
  NOM_NIVEAU,
  aplatir,
  cx,
  dateCourte,
  dans,
  duree,
} from "@/lib/format";

const ICONE_FORMAT: Record<FormatRessource, NomIcone> = {
  cours: "cours",
  notes: "notes",
  video: "video",
  atelier: "atelier",
  papier: "papier",
  jeu: "jeu",
};

const NIVEAUX: Niveau[] = ["depart", "milieu", "fond"];
const FORMATS: FormatRessource[] = [
  "cours",
  "notes",
  "video",
  "atelier",
  "papier",
  "jeu",
];

export function Ressources({
  ressources,
  seances,
}: {
  ressources: Ressource[];
  seances: Seance[];
}) {
  const [vue, setVue] = useState<"ressources" | "seances">("ressources");
  const [q, setQ] = useState("");
  const [niveau, setNiveau] = useState<Niveau | null>(null);
  const [format, setFormat] = useState<FormatRessource | null>(null);

  const { marques: faits, basculer, vider } = useMarques("n7ia.apprendre");
  const { marques: inscrit, basculer: sinscrire } = useMarques("n7ia.seances");

  const liste = useMemo(() => {
    const mots = aplatir(q.trim());
    return ressources.filter((r) => {
      if (niveau && r.niveau !== niveau) return false;
      if (format && r.format !== format) return false;
      if (mots) {
        const foin = aplatir(`${r.titre} ${r.gain} ${r.source}`);
        if (!foin.includes(mots)) return false;
      }
      return true;
    });
  }, [ressources, q, niveau, format]);

  const filtres = (niveau ? 1 : 0) + (format ? 1 : 0) + (q ? 1 : 0);

  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection
          titre="Le fonds"
          action={
            <Link href="/apprendre" className="cmd cmd-nu cmd-s px-1">
              <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
              Academy
            </Link>
          }
        />

        <div className="hidden h-12 items-center gap-2.5 border-b border-filet px-4 lg:flex">
          <Link href="/apprendre" className="cmd cmd-nu cmd-s px-1">
            <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
            Academy
          </Link>
          <span aria-hidden className="h-4 w-px bg-filet-fort" />
          <Etq ton="encre">Le fonds</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {liste.length}
            {filtres > 0 ? ` / ${ressources.length}` : ""}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            ressources recommandées
          </span>
          <span className="flex-1" />
          {faits.length > 0 ? (
            <button type="button" onClick={vider} className="cmd cmd-nu cmd-s">
              Décocher tout
            </button>
          ) : null}
        </div>

        <div className="flex h-10 items-center gap-2 border-b border-filet px-3 lg:h-11 lg:px-4">
          <div className="relative min-w-0 flex-1">
            <Icone
              nom="recherche"
              className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-gris-40"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Titre, source, notion…"
              aria-label="Rechercher une ressource"
              className="t-corps h-8 w-full border-0 bg-transparent pl-6 text-[0.875rem] outline-none placeholder:text-gris-40"
            />
          </div>
          <span className="t-cote shrink-0 text-[0.75rem] text-brique lg:hidden">
            {liste.length}
          </span>
        </div>

        {/* Les deux vues, sur téléphone : le volet de droite n'existe pas
            là-bas, les séances ont donc besoin d'une entrée à elles. */}
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-filet px-3 py-1.5 lg:hidden">
          <button
            type="button"
            aria-pressed={vue === "ressources"}
            onClick={() => setVue("ressources")}
            className="puce"
          >
            Ressources
            <span className="t-cote text-[0.6875rem]">{ressources.length}</span>
          </button>
          <button
            type="button"
            aria-pressed={vue === "seances"}
            onClick={() => setVue("seances")}
            className="puce"
          >
            Séances
            <span className="t-cote text-[0.6875rem]">{seances.length}</span>
          </button>
        </div>

        {vue === "ressources" ? (
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-filet px-3 py-1.5 lg:px-4 lg:py-2">
            {NIVEAUX.map((n) => (
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
            <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-filet-fort" />
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={format === f}
                onClick={() => setFormat(format === f ? null : f)}
                className="puce"
              >
                <Icone nom={ICONE_FORMAT[f]} className="h-3.5 w-3.5" />
                {NOM_FORMAT[f]}
              </button>
            ))}
            {filtres > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setNiveau(null);
                  setFormat(null);
                }}
                className="cmd cmd-nu cmd-s shrink-0"
              >
                <Icone nom="croix" className="h-3 w-3" />
                Effacer
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {vue === "seances" ? (
          <ListeSeances
            seances={seances}
            inscrit={inscrit}
            sinscrire={sinscrire}
          />
        ) : liste.length === 0 ? (
          <Vide
            titre="Rien sous ces filtres"
            mesure={`0 sur ${ressources.length} · ${filtres} réglage${filtres > 1 ? "s" : ""}`}
          >
            <button
              type="button"
              onClick={() => {
                setQ("");
                setNiveau(null);
                setFormat(null);
              }}
              className="cmd cmd-trait cmd-s"
            >
              Tout remettre
            </button>
          </Vide>
        ) : (
          <ul>
            {liste.map((r) => (
              <LigneRessource
                key={r.id}
                ressource={r}
                fait={faits.includes(r.id)}
                onBasculer={() => basculer(r.id)}
              />
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
        <Etq ton="encre">Séances à venir</Etq>
        <span className="t-cote text-[0.75rem] text-brique">
          {seances.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-4 py-3.5">
          <ul className="border-t border-filet">
            {seances.map((s) => (
              <li key={s.id} className="border-b border-filet py-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="t-tech w-[3.6rem] shrink-0 text-[0.6875rem] text-gris-40">
                    {dateCourte(s.date)}
                  </span>
                  <span className="t-corps-f min-w-0 flex-1 text-[0.8125rem] leading-[1.35]">
                    {s.titre}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 pl-[4.1rem]">
                  <span className="t-tech text-[0.6875rem] text-gris-58">
                    {duree(s.minutes)} · {s.restant} places · {dans(s.date)}
                  </span>
                  <span className="flex-1" />
                  <button
                    type="button"
                    onClick={() => sinscrire(s.id)}
                    className={cx(
                      "cmd cmd-s",
                      inscrit.includes(s.id) ? "cmd-plein" : "cmd-trait",
                    )}
                  >
                    {inscrit.includes(s.id) ? (
                      <>
                        <Icone nom="coche" className="h-3.5 w-3.5" />
                        Inscrit
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="t-corps mt-3 text-[0.75rem] leading-[1.5] text-gris-58">
            Ce qui est coché et ce à quoi vous êtes inscrit restent sur cet
            appareil.
          </p>
        </section>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} />;
}

function LigneRessource({
  ressource: r,
  fait,
  onBasculer,
}: {
  ressource: Ressource;
  fait: boolean;
  onBasculer: () => void;
}) {
  const meta = `${NOM_FORMAT[r.format]} · ${NOM_NIVEAU[r.niveau]} · ${duree(r.minutes)} · ${r.source}`;

  return (
    <li
      className={cx(
        "flex gap-3 border-b border-filet px-3 py-2.5 transition-colors lg:px-4",
        fait ? "bg-gris-04" : "hover:bg-gris-04",
      )}
    >
      <Case
        cochee={fait}
        onChange={onBasculer}
        label={`Marquer « ${r.titre} » comme fait`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Icone
            nom={ICONE_FORMAT[r.format]}
            className={cx(
              "mt-[2px] h-4 w-4 shrink-0 self-start",
              fait ? "text-gris-40" : "text-gris-58",
            )}
          />
          {r.lien ? (
            <a
              href={r.lien}
              target="_blank"
              rel="noreferrer noopener"
              className={cx(
                "t-titre group min-w-0 flex-1 text-[0.9375rem] leading-[1.3]",
                fait ? "text-gris-58 line-through decoration-1" : "text-encre",
              )}
            >
              {r.titre}
              <Icone
                nom="sortie"
                className="ml-1.5 inline h-3 w-3 shrink-0 -translate-y-[1px] text-gris-40 group-hover:text-encre"
              />
            </a>
          ) : (
            <span
              className={cx(
                "t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]",
                fait ? "text-gris-58 line-through decoration-1" : "text-encre",
              )}
            >
              {r.titre}
              <span className="t-etq ml-2 inline-block border border-filet-fort px-1 py-[2px] align-middle text-gris-58">
                Club
              </span>
            </span>
          )}
        </div>
        <p
          className={cx(
            "t-corps mt-0.5 text-[0.8125rem] leading-[1.35]",
            fait ? "text-gris-40" : "text-gris-72",
          )}
        >
          {r.gain}
        </p>
        <p className="t-tech mt-1 truncate text-[0.6875rem] text-gris-40">
          {meta}
        </p>
      </div>
    </li>
  );
}

function ListeSeances({
  seances,
  inscrit,
  sinscrire,
}: {
  seances: Seance[];
  inscrit: string[];
  sinscrire: (id: string) => void;
}) {
  return (
    <ul>
      {seances.map((s) => (
        <li key={s.id} className="border-b border-filet px-3 py-3">
          <div className="flex items-baseline gap-2.5">
            <span className="t-chiffre w-[3.4rem] shrink-0 text-[0.9375rem] text-encre">
              {dateCourte(s.date)}
            </span>
            <span className="t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]">
              {s.titre}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 pl-[3.9rem]">
            <span className="t-tech text-[0.6875rem] text-gris-58">
              {duree(s.minutes)} · {s.restant} places · {dans(s.date)}
            </span>
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => sinscrire(s.id)}
              className={cx(
                "cmd cmd-s",
                inscrit.includes(s.id) ? "cmd-plein" : "cmd-trait",
              )}
            >
              {inscrit.includes(s.id) ? (
                <>
                  <Icone nom="coche" className="h-3.5 w-3.5" />
                  Inscrit
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
