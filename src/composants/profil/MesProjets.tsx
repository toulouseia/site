"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chargerMesProjets, type ProjetMien } from "@/donnees/distant";
import { Etq, Vide } from "@/composants/base/Atomes";
import { Jauge } from "@/composants/base/Jauge";
import { SqueletteLignes } from "@/composants/base/Squelette";
import { CRAN_ETAT, NOM_ETAT, adresseProjet, cx } from "@/lib/format";

/** L'état de publication, en clair. Le mot du schéma ne se montre pas. */
const NOM_PUBLICATION: Record<ProjetMien["publication"], string> = {
  publie: "publié",
  attente: "en attente de relecture",
  refuse: "retiré par le bureau",
};

type Etat =
  | { etat: "attente" }
  | { etat: "erreur"; message: string }
  | { etat: "lu"; projets: ProjetMien[] };

/**
 * Mes projets : ceux que j'ai déposés, quelle que soit leur publication, avec
 * le chemin pour les modifier. La liste vient de `GET /api/projets/miens`,
 * demandée une fois quand le profil s'affiche connecté.
 */
export function MesProjets() {
  const [e, setE] = useState<Etat>({ etat: "attente" });

  useEffect(() => {
    const controle = new AbortController();
    chargerMesProjets(controle.signal).then((r) => {
      if (controle.signal.aborted) return;
      setE(
        r.ok
          ? { etat: "lu", projets: r.valeur.projets }
          : { etat: "erreur", message: r.refus.erreur },
      );
    });
    return () => controle.abort();
  }, []);

  return (
    <section className="flex flex-col lg:h-full">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-filet px-4">
        <Etq ton="encre">Mes projets</Etq>
        {e.etat === "lu" ? (
          <span className="t-cote text-[0.75rem] text-brique">{e.projets.length}</span>
        ) : null}
        <span className="flex-1" />
        <Link href="/deposer" className="cmd cmd-trait cmd-s">
          Déposer
        </Link>
      </div>
      <div className="min-h-0 flex-1 lg:overflow-y-auto">
        {e.etat === "attente" ? (
          <div className="px-4 py-4">
            <SqueletteLignes lignes={4} />
          </div>
        ) : e.etat === "erreur" ? (
          <Vide titre="La liste n'a pas pu être lue" mesure={e.message} compact />
        ) : e.projets.length === 0 ? (
          <Vide titre="Aucun projet déposé" mesure="Le mur a de la place" compact>
            <Link href="/deposer" className="cmd cmd-plein cmd-s">
              Déposer un projet
            </Link>
          </Vide>
        ) : (
          <ul>
            {e.projets.map((p) => (
              <li key={p.id} className="border-b border-filet">
                <Link
                  href={`/deposer?projet=${encodeURIComponent(p.id)}`}
                  className="bande flex items-start gap-3 px-4 py-3 hover:bg-gris-04"
                >
                  <Jauge
                    cran={CRAN_ETAT[p.etat]}
                    pause={p.enPause}
                    className="mt-[3px] h-[0.95rem] shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="t-corps-f block truncate text-[0.875rem]">{p.nom}</span>
                    <span className="t-tech mt-0.5 block text-[0.6875rem] text-gris-58">
                      {NOM_ETAT[p.etat]}
                      {p.enPause ? " · en pause" : ""}
                      {" · "}
                      <span
                        className={cx(
                          p.publication === "publie" ? "text-gris-58" : "text-brique",
                        )}
                      >
                        {NOM_PUBLICATION[p.publication]}
                      </span>
                    </span>
                  </span>
                  <span className="t-etq shrink-0 pt-1 text-gris-40">Modifier</span>
                </Link>
                {p.publication === "publie" ? (
                  <div className="px-4 pb-2.5 -mt-1">
                    <Link
                      href={adresseProjet({ slug: p.slug, distant: true })}
                      className="t-tech text-[0.6875rem] text-gris-58 underline decoration-filet-fort underline-offset-2 hover:text-encre"
                    >
                      voir la fiche
                    </Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
