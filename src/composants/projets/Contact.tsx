"use client";

import { useEffect, useState } from "react";
import type { ProjetComplet } from "@/donnees/api";
import { Icone } from "@/composants/base/Icone";
import { Etq } from "@/composants/base/Atomes";
import { MarqueDuCanal } from "@/composants/base/MarquesCanaux";
import { NOM_ACCUEIL, NOM_CANAL, lienDuCanal } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// Écrire au porteur — et l'application s'arrête là.
//
// Elle ne transporte aucun message : elle donne les endroits où le porteur a
// dit qu'on pouvait le joindre, et c'est là-bas que la conversation a lieu.
// C'est une décision, pas une étape en attendant mieux. Une messagerie de plus
// veut dire une boîte de plus à relever, que personne ne relève ; le fil où
// l'on est déjà tous les jours, si.
//
// Chaque moyen porte la marque de son service, recopiée telle qu'il la publie
// et jamais redessinée (voir MarquesCanaux) : on reconnaît Discord ou WhatsApp
// d'un coup d'œil, avant même d'avoir lu. Le nom du service reste écrit en
// toutes lettres à côté — une marque seule se devine, elle ne se lit pas.
//
// Deux gestes par ligne, et seulement deux : ouvrir quand le service a une
// adresse — WhatsApp ouvre la conversation, GitHub le profil, le courriel le
// logiciel de courrier — et recopier, qui marche toujours. Un pseudonyme
// Discord n'ouvre rien : il n'a pas d'adresse sur la toile, donc sa ligne n'a
// que le bouton pour le recopier.
// ─────────────────────────────────────────────────────────────────────────────

export function Contact({
  projet,
  onFermer,
}: {
  projet: ProjetComplet;
  onFermer: () => void;
}) {
  const [copie, setCopie] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFermer]);

  function copier(valeur: string) {
    navigator.clipboard?.writeText(valeur).then(
      () => {
        setCopie(valeur);
        window.setTimeout(() => setCopie(null), 1600);
      },
      () => undefined,
    );
  }

  const contacts = projet.porteur.contacts;

  return (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-3">
        <button
          type="button"
          onClick={onFermer}
          className="cmd cmd-nu cmd-s -ml-1 px-2"
          aria-label="Fermer"
        >
          <Icone nom="fleche-gauche" className="h-4 w-4" />
        </button>
        <span className="t-etq-l text-encre">Écrire au porteur</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="border border-filet-fort px-3 py-2">
          <Etq>Qui</Etq>
          <p className="t-corps-f mt-1.5 text-[0.875rem]">
            {projet.porteur.nom}
            <span className="t-tech ml-2 text-[0.6875rem] text-gris-58">
              {projet.porteur.origine}
            </span>
          </p>
          <p className="t-tech mt-0.5 text-[0.75rem] text-gris-58">
            {projet.nom}
          </p>
        </div>

        {/* Ce que le porteur dit de son accueil se relit ici, au moment où l'on
            va lui écrire : « au complet » n'interdit pas d'envoyer un mot, il
            annonce seulement à quoi s'attendre. */}
        {projet.accueil ? (
          <p className="t-corps mt-3 text-[0.8125rem] leading-[1.45] text-gris-72">
            {projet.accueil === "ouvert"
              ? `${NOM_ACCUEIL.ouvert} — écrivez, on vous répondra.`
              : `${NOM_ACCUEIL.complet} — un message reste possible, ne serait-ce que pour parler du projet.`}
          </p>
        ) : null}

        <div className="mt-5">
          <Etq ton="encre">Où le joindre</Etq>
          {contacts.length === 0 ? (
            <p className="t-tech mt-2 border-t border-filet pt-2.5 text-[0.75rem] text-gris-58">
              Aucun moyen renseigné pour l&apos;instant.
            </p>
          ) : (
            <ul className="mt-2 border-t border-filet">
              {contacts.map((c, i) => {
                const lien = lienDuCanal(c.canal, c.valeur);
                return (
                  <li
                    key={`${c.canal}-${i}`}
                    className="flex items-center gap-3 border-b border-filet py-2.5"
                  >
                    <MarqueDuCanal
                      canal={c.canal}
                      className="h-[1.125rem] w-[1.125rem] shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="t-etq block text-gris-58">
                        {NOM_CANAL[c.canal]}
                      </span>
                      <span className="t-tech mt-1 block truncate text-[0.8125rem]">
                        {c.valeur}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {lien ? (
                        <a
                          href={lien}
                          target={lien.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noreferrer"
                          className="cmd cmd-trait cmd-s"
                        >
                          <Icone nom="sortie" className="h-3.5 w-3.5" />
                          Ouvrir
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => copier(c.valeur)}
                        className="cmd cmd-nu cmd-s"
                        aria-label={`Copier ${NOM_CANAL[c.canal]}`}
                      >
                        <Icone
                          nom={copie === c.valeur ? "coche" : "copie"}
                          className="h-3.5 w-3.5"
                        />
                        {copie === c.valeur ? "Copié" : "Copier"}
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>

      <div className="shrink-0 border-t border-filet px-4 py-3">
        <button type="button" onClick={onFermer} className="cmd cmd-trait w-full">
          Revenir au projet
        </button>
      </div>
    </div>
  );
}
