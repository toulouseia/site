"use client";

import { useState } from "react";
import type { Entree, Numero } from "@/donnees/types";
import { Icone } from "@/composants/base/Icone";
import { DeuxZones } from "@/composants/base/DeuxZones";
import { Etq } from "@/composants/base/Atomes";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { NOM_TYPE_ENTREE, cx, dateCourte, dateLongue } from "@/lib/format";
import { Affiche, type Mise } from "./Affiche";

const MISES: { cle: Mise; nom: string }[] = [
  { cle: "une", nom: "Une" },
  { cle: "chiffre", nom: "Chiffre" },
  { cle: "liste", nom: "Sommaire" },
];

export function Veille({ numeros }: { numeros: Numero[] }) {
  const fil = numeros.flatMap((n) =>
    n.entrees.map((e) => ({ numero: n, entree: e, cle: `${n.id}/${e.id}` })),
  );
  const [cle, setCle] = useState(fil[0].cle);
  const choix = fil.find((x) => x.cle === cle) ?? fil[0];
  const { numero, entree } = choix;

  const [mise, setMise] = useState<Mise>("une");
  const [sombre, setSombre] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [copie, setCopie] = useState(false);

  function texte(e: Entree) {
    return `${e.titre}\n${e.valeur}\n\n${e.pourquoi}\nSource : ${e.source}${e.lien ? `\n${e.lien}` : ""}\n\nToulouse IA · veille · ${dateLongue(numero.date)}`;
  }

  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier lg:static lg:shrink-0">
        <EnTeteSection titre="Veille" />

        <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">Veille</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {String(fil.length).padStart(2, "0")}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            entrées · la dernière le {dateLongue(numeros[0].date)}
          </span>
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <ul>
          {fil.map(({ numero: n, entree: e, cle: c }) => {
            const actif = c === choix.cle;
            return (
              <li
                key={c}
                className={cx(
                  "bande group relative border-b border-filet",
                  actif ? "bg-sombre text-papier" : "bg-papier hover:bg-gris-04",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "absolute top-0 left-0 h-full w-[2px] transition-opacity duration-100",
                    actif
                      ? "bg-papier opacity-100"
                      : "bg-brique opacity-0 group-hover:opacity-100",
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCle(c);
                    setOuvert(true);
                  }}
                  aria-current={actif ? "true" : undefined}
                  className="block w-full px-3 pt-2 text-left lg:px-4 lg:pt-2.5"
                >
                  <span className="flex items-baseline gap-2">
                    <span
                      className={cx(
                        "t-etq shrink-0 border px-1.5 py-1 leading-none",
                        actif ? "border-nuit-28" : "border-filet-fort",
                        actif ? "text-nuit-72" : "text-gris-58",
                      )}
                    >
                      {NOM_TYPE_ENTREE[e.type]}
                    </span>
                    <span className="t-titre min-w-0 flex-1 text-[0.9375rem] leading-[1.3]">
                      {e.titre}
                    </span>
                    {n.id === numeros[0].id && e.id === n.uneId ? (
                      <span
                        className={cx(
                          "t-etq shrink-0",
                          actif ? "text-brique-nuit" : "text-brique",
                        )}
                      >
                        Une
                      </span>
                    ) : null}
                    <Icone
                      nom="chevron-droite"
                      className={cx(
                        "h-3.5 w-3.5 shrink-0 lg:hidden",
                        actif ? "text-nuit-72" : "text-gris-40",
                      )}
                    />
                  </span>
                  <span className="t-corps-f mt-1 block text-[0.8125rem] leading-[1.35] lg:text-[0.875rem]">
                    {e.valeur}
                  </span>
                  <span
                    className={cx(
                      "t-corps mt-0.5 block text-[0.75rem] leading-[1.4] lg:mt-1 lg:text-[0.8125rem]",
                      actif ? "text-nuit-72" : "text-gris-72",
                    )}
                  >
                    {e.pourquoi}
                  </span>
                </button>
                <div className="px-3 pb-1 lg:px-4 lg:pb-1.5">
                  {e.lien ? (
                    <a
                      href={e.lien}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cx(
                        "t-tech inline-flex min-h-6 items-center gap-1 py-1 text-[0.6875rem] underline decoration-1 underline-offset-2 hover:no-underline",
                        actif ? "text-nuit-72" : "text-gris-72 hover:text-encre",
                      )}
                    >
                      Lire l&apos;article · {e.source}
                      <Icone nom="sortie" className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span
                      className={cx(
                        "t-tech inline-block py-1 text-[0.6875rem]",
                        actif ? "text-nuit-72" : "text-gris-72",
                      )}
                    >
                      {e.source}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
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
          Veille
        </button>
        <Etq ton="encre" className="hidden lg:block">
          Affiche
        </Etq>
        <span className="t-tech hidden text-[0.6875rem] text-gris-58 lg:block">
          1080 × 1920
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(texte(entree)).then(
              () => {
                setCopie(true);
                window.setTimeout(() => setCopie(false), 1600);
              },
              () => undefined,
            );
          }}
          className="cmd cmd-nu cmd-s"
        >
          <Icone nom={copie ? "coche" : "copie"} className="h-4 w-4" />
          {copie ? "Copié" : "Copier le texte"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex justify-center px-4 pt-4 pb-3">
          <Affiche
            numero={numero}
            entree={entree}
            mise={mise}
            sombre={sombre}
            largeur={288}
          />
        </div>

        <div className="border-t border-filet px-4 py-3">
          <Etq>Mise</Etq>
          <div className="mt-2 flex gap-1.5">
            {MISES.map((m) => (
              <button
                key={m.cle}
                type="button"
                aria-pressed={mise === m.cle}
                onClick={() => setMise(m.cle)}
                className="puce flex-1 justify-center"
              >
                {m.nom}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <Etq>Fond</Etq>
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                aria-pressed={!sombre}
                onClick={() => setSombre(false)}
                className="puce flex-1 justify-center"
              >
                Papier
              </button>
              <button
                type="button"
                aria-pressed={sombre}
                onClick={() => setSombre(true)}
                className="puce flex-1 justify-center"
              >
                Sombre
              </button>
            </div>
          </div>
        </div>

        {/* Sur téléphone, la barre du bas passe sous le dernier bouton : un peu d'air. */}
        <div className="border-t border-filet px-4 pt-3 pb-8 lg:pb-3">
          <Etq>Entrée</Etq>
          <p className="t-corps-f mt-1.5 text-[0.875rem] leading-[1.35]">
            {entree.titre}
          </p>
          <p className="t-tech mt-1 text-[0.6875rem] text-gris-58">
            {NOM_TYPE_ENTREE[entree.type]} · {dateCourte(numero.date)} ·{" "}
            {entree.source}
          </p>
          {entree.lien ? (
            <a
              href={entree.lien}
              target="_blank"
              rel="noreferrer noopener"
              className="cmd cmd-trait cmd-s mt-3"
            >
              Lire l&apos;article
              <Icone nom="sortie" className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} ouvertMobile={ouvert} />;
}
