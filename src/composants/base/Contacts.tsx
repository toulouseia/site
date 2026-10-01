"use client";

import type { Canal, Contact } from "@/donnees/types";
import { Icone } from "./Icone";
import { MarqueDuCanal } from "./MarquesCanaux";
import { NOM_CANAL } from "@/lib/format";

/** Les six canaux, dans l'ordre où la liste les propose. */
export const CANAUX: Canal[] = [
  "discord",
  "whatsapp",
  "telegram",
  "instagram",
  "github",
  "mail",
];

/** Ce que le service lui-même met devant le pseudonyme, quand il le fait. */
const PREFIXE: Partial<Record<Canal, string>> = {
  instagram: "@",
  telegram: "@",
  discord: "@",
};

/** Le texte en creux du champ vide, par service : on ne demande pas la même chose. */
const INDICATION: Record<Canal, string> = {
  discord: "pseudo",
  whatsapp: "numéro",
  telegram: "pseudo",
  instagram: "pseudo",
  github: "pseudo",
  mail: "adresse",
};

/** « Deux ou trois, jamais une liste à rallonge » — et le serveur refuse au-delà. */
export const CONTACTS_MAX = 3;

/** Un contact de plus, sur un canal pas encore pris. */
export function contactSuivant(contacts: Contact[]): Contact {
  return {
    canal: CANAUX.find((c) => !contacts.some((x) => x.canal === c)) ?? "mail",
    valeur: "",
  };
}

/**
 * Où vous joindre. La même liste dans le dépôt et dans le profil : un canal
 * choisi parmi les six, sa marque à gauche, l'identifiant à droite. Ce qu'on
 * écrit ici est public — c'est fait pour être lu par qui veut écrire.
 */
export function EditeurContacts({
  contacts,
  onChange,
}: {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}) {
  function modifier(i: number, p: Partial<Contact>) {
    const suivants = [...contacts];
    suivants[i] = { ...suivants[i], ...p };
    onChange(suivants);
  }

  return (
    <div>
      <ul className="space-y-2">
        {contacts.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {/* La marque du service choisi, à gauche de la liste déroulante :
                une liste déroulante ne sait afficher que du texte, et on veut
                voir tout de suite de quel service on parle. Elle est recopiée,
                jamais redessinée. */}
            <MarqueDuCanal
              canal={c.canal}
              className="h-[1.125rem] w-[1.125rem] shrink-0"
            />
            <div className="relative shrink-0">
              <select
                value={c.canal}
                onChange={(e) => modifier(i, { canal: e.target.value as Canal })}
                aria-label={`Service du moyen ${i + 1}`}
                className="champ w-[8rem] cursor-pointer pr-7"
              >
                {CANAUX.map((canal) => (
                  <option key={canal} value={canal}>
                    {NOM_CANAL[canal]}
                  </option>
                ))}
              </select>
              <Icone
                nom="chevron-bas"
                className="pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2 text-gris-58"
              />
            </div>
            <div className="relative min-w-0 flex-1">
              {/* Les services à pseudonyme l'affichent précédé d'un « @ » :
                  on le pose devant le champ, une fois pour toutes, pour que
                  personne ne se demande s'il faut le taper. S'il est tapé
                  quand même, il est retiré. */}
              {PREFIXE[c.canal] ? (
                <span
                  aria-hidden
                  className="t-tech pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-[0.8125rem] text-gris-58"
                >
                  {PREFIXE[c.canal]}
                </span>
              ) : null}
              <input
                value={c.valeur}
                maxLength={120}
                onChange={(e) =>
                  modifier(i, {
                    valeur: PREFIXE[c.canal]
                      ? e.target.value.replace(/^@+/, "")
                      : e.target.value,
                  })
                }
                placeholder={INDICATION[c.canal]}
                aria-label={`Identifiant du moyen ${i + 1}`}
                className={`champ t-tech text-[0.8125rem] ${PREFIXE[c.canal] ? "pl-6" : ""}`}
              />
            </div>
            {contacts.length > 1 ? (
              <button
                type="button"
                onClick={() => onChange(contacts.filter((_, j) => j !== i))}
                className="cmd cmd-nu cmd-s shrink-0 px-2"
                aria-label={`Retirer le moyen ${i + 1}`}
              >
                <Icone nom="croix" className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {contacts.length < CONTACTS_MAX ? (
        <button
          type="button"
          onClick={() => onChange([...contacts, contactSuivant(contacts)])}
          className="cmd cmd-trait cmd-s mt-2"
        >
          <Icone nom="plus" className="h-3.5 w-3.5" />
          Ajouter un moyen
        </button>
      ) : (
        <p className="t-tech mt-2 text-[0.625rem] text-gris-40">
          Trois au plus : ceux qu&apos;on relève vraiment.
        </p>
      )}
    </div>
  );
}
