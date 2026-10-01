"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Contact } from "@/donnees/types";
import { enregistrerMoi, seDeconnecter, type Moi, type Refus } from "@/donnees/distant";
import { useMoi } from "@/composants/coque/moi";
import { Portrait } from "@/composants/coque/Portrait";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { Etq } from "@/composants/base/Atomes";
import { Bloc, Ligne, Refus as MessageRefus } from "@/composants/base/Formulaire";
import { EditeurContacts } from "@/composants/base/Contacts";
import { MesProjets } from "./MesProjets";

// ─────────────────────────────────────────────────────────────────────────────
// Le profil. Deux écrans selon qu'on est connecté ou non, et un troisième,
// muet, tant qu'on ne sait pas.
//
// Qui est là vient du fournisseur de la coque (`useMoi`), qui a déjà demandé
// `GET /api/moi` : cette page ne refait pas l'appel pour son compte. Ce qu'elle
// écrit part par `PUT /api/moi`, et ce que le serveur renvoie remplace ce que
// la coque savait — le nom dans le rail change au même instant.
// ─────────────────────────────────────────────────────────────────────────────

export function Profil() {
  const { moi, poser } = useMoi();

  return (
    <div className="flex flex-col bg-papier lg:h-full">
      <EnTeteSection titre="Profil" />
      <div className="hidden h-12 shrink-0 items-center gap-3 border-b border-filet px-4 lg:flex">
        <Etq ton="encre">Profil</Etq>
        {moi.etat === "connecte" ? (
          <span className="t-tech text-[0.6875rem] text-gris-58">
            ce que le site sait de vous
          </span>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:overflow-hidden lg:pb-0">
        {moi.etat === "connecte" ? (
          // La fiche à gauche, mes projets à droite : la même grille que les
          // autres écrans. Sur téléphone, l'un sous l'autre.
          <div className="lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_var(--volet)] lg:overflow-hidden">
            <div className="min-w-0 lg:h-full lg:overflow-y-auto">
              <Fiche key={moi.personne.id} personne={moi.personne} poser={poser} />
            </div>
            <div className="min-w-0 border-t border-filet lg:h-full lg:overflow-hidden lg:border-t-0 lg:border-l">
              <MesProjets key={moi.personne.id} />
            </div>
          </div>
        ) : moi.etat === "personne" ? (
          <Entree />
        ) : (
          // On ne sait pas encore : la trame occupe l'écran, sans un mot qui
          // pourrait être démenti une seconde plus tard.
          <div
            aria-busy
            className="trame trame-bord min-h-[22rem] lg:h-full"
            style={{ ["--trame-op" as string]: "0.16" }}
          />
        )}
      </div>
    </div>
  );
}

/** Non connecté : deux portes, une phrase. Ni inscription, ni mot de passe. */
function Entree() {
  return (
    <div
      className="trame trame-bord flex min-h-[22rem] flex-col items-center justify-center px-6 py-16 text-center lg:h-full"
      style={{ ["--trame-op" as string]: "0.16" }}
    >
      <div className="w-full max-w-[22rem] border border-filet-fort bg-papier px-6 py-5">
        <p className="t-etq-l text-encre">Se connecter</p>
        <p className="t-corps mt-3 text-[0.875rem] text-gris-72">
          Ce que la connexion permet : gérer ses projets sur le site, et rien
          d&apos;autre.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {/* Des liens ordinaires, pas des liens de l'application : ces deux
              adresses sont celles du serveur, qui renvoie chez Google ou
              GitHub et ramène ici. */}
          <a href="/api/auth/google/entree?suite=/profil" className="cmd cmd-plein">
            Continuer avec Google
          </a>
          <a href="/api/auth/github/entree?suite=/profil" className="cmd cmd-trait">
            Continuer avec GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

type Champs = {
  nom: string;
  origine: string;
  contacts: Contact[];
};

function depuis(p: Moi): Champs {
  return {
    nom: p.nom,
    origine: p.origine ?? "",
    contacts: p.contacts.length ? p.contacts : [{ canal: "discord", valeur: "" }],
  };
}

/** Connecté : la fiche, modifiable, et la porte de sortie. */
function Fiche({
  personne,
  poser,
}: {
  personne: Moi;
  poser: (p: Moi | null) => void;
}) {
  const router = useRouter();
  const [c, setC] = useState<Champs>(() => depuis(personne));
  const [refus, setRefus] = useState<Refus | null>(null);
  const [etat, setEtat] = useState<"repos" | "envoi" | "enregistre" | "sortie">("repos");
  const maj = (p: Partial<Champs>) => {
    setC((v) => ({ ...v, ...p }));
    if (etat === "enregistre") setEtat("repos");
  };
  const erreur = (champ: string) => (refus?.champ === champ ? refus.erreur : null);

  async function enregistrer() {
    setEtat("envoi");
    setRefus(null);
    const r = await enregistrerMoi({
      nom: c.nom.trim(),
      origine: c.origine.trim() || null,
      // Une ligne laissée vide n'est pas un contact : elle ne part pas.
      contacts: c.contacts.filter((x) => x.valeur.trim()),
    });
    if (r.ok) {
      poser(r.valeur.personne);
      setC(depuis(r.valeur.personne));
      setEtat("enregistre");
    } else {
      // Une session tombée entre-temps : la coque repasse à « personne ».
      if (r.statut === 401) poser(null);
      setRefus(r.refus);
      setEtat("repos");
    }
  }

  async function sortir() {
    setEtat("sortie");
    await seDeconnecter();
    poser(null);
    router.push("/projets");
  }

  // Les services qu'on peut encore relier. Le lien mène chez le service et
  // revient ici : connecté, c'est un rattachement à cette fiche, pas une
  // nouvelle personne (le serveur, session.ts cas 2). C'est le seul chemin
  // pour réunir deux comptes : l'adresse ne se saisit jamais à la main.
  const aRelier = [
    !personne.services.google ? { nom: "Google", href: "/api/auth/google/entree?suite=/profil" } : null,
    !personne.services.github ? { nom: "GitHub", href: "/api/auth/github/entree?suite=/profil" } : null,
  ].filter((x): x is { nom: string; href: string } => x !== null);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void enregistrer();
      }}
    >
      {/* Qui l'on est pour le serveur : la photo si le service en a donné une,
          le pseudo GitHub s'il y en a un. Ce bloc ne se modifie pas ici. */}
      <div className="flex items-center gap-3 border-b border-filet px-3 py-3.5 lg:px-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-filet-fort text-gris-58">
          <Portrait
            photo={personne.photo}
            nom={personne.nom}
            className={personne.photo ? "h-full w-full" : "h-5 w-5"}
          />
        </span>
        <div className="min-w-0">
          <p className="t-titre truncate text-[1rem]">{personne.nom}</p>
          <p className="t-tech mt-0.5 text-[0.6875rem] text-gris-58">
            {[
              personne.pseudoGithub ? `GitHub · ${personne.pseudoGithub}` : null,
              personne.bureau ? "bureau" : null,
            ]
              .filter(Boolean)
              .join(" · ") || "connecté"}
          </p>
        </div>
      </div>

      {aRelier.length ? (
        <div className="border-b border-filet bg-gris-04 px-3 py-3 lg:px-4">
          {personne.adresseAdemander ? (
            // GitHub peut cacher l'adresse : sans elle, une connexion Google
            // faite plus tard, hors de ce compte, créerait une seconde fiche.
            <>
              <p className="t-corps-f text-[0.875rem]">GitHub n&apos;a pas donné votre adresse.</p>
              <p className="t-corps mt-1 text-[0.8125rem] text-gris-72">
                Reliez Google maintenant, et vous garderez un seul compte quel
                que soit le service avec lequel vous reviendrez.
              </p>
            </>
          ) : (
            <p className="t-corps text-[0.8125rem] text-gris-72">
              Un seul compte, quel que soit le service avec lequel vous vous
              connectez : reliez l&apos;autre dès maintenant.
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {aRelier.map((s) => (
              <a key={s.nom} href={s.href} className="cmd cmd-trait cmd-s">
                Relier {s.nom}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <Bloc titre="Vous" cote="1">
        <Ligne etiquette="Nom" erreur={erreur("nom")}>
          <input
            name="nom"
            value={c.nom}
            maxLength={60}
            onChange={(e) => maj({ nom: e.target.value })}
            aria-invalid={erreur("nom") ? "true" : undefined}
            className="champ"
          />
        </Ligne>
        <Ligne etiquette="D'où" aide="facultatif" erreur={erreur("origine")}>
          <input
            name="origine"
            value={c.origine}
            maxLength={60}
            onChange={(e) => maj({ origine: e.target.value })}
            placeholder="N7, 2A · INSA · en poste"
            aria-invalid={erreur("origine") ? "true" : undefined}
            className="champ"
          />
        </Ligne>
        <Ligne etiquette="Adresse" aide="jamais affichée">
          {/* Elle vient du service de connexion, qui l'a vérifiée ; elle ne
              se modifie pas ici. */}
          <span className="t-corps block py-2 text-[0.875rem] text-gris-72">
            {personne.courriel ?? "aucune — GitHub l'a masquée"}
          </span>
        </Ligne>
      </Bloc>

      <Bloc titre="Où vous joindre" cote="2" dernier>
        <p className="t-tech mb-2 text-[0.625rem] text-gris-40">
          public, sur chacun de vos projets — l&apos;échange se fera là-bas
        </p>
        <EditeurContacts
          contacts={c.contacts}
          onChange={(contacts) => maj({ contacts })}
        />
        {erreur("contacts") ? <MessageRefus>{erreur("contacts")}</MessageRefus> : null}
      </Bloc>

      <div className="border-t border-filet px-3 py-3 lg:px-4">
        {refus && !["nom", "origine", "contacts"].includes(refus.champ ?? "") ? (
          <MessageRefus>{refus.erreur}</MessageRefus>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={etat === "envoi" || etat === "sortie"}
            className="cmd cmd-plein cmd-s"
          >
            {etat === "envoi" ? "Enregistrement…" : "Enregistrer"}
          </button>
          {etat === "enregistre" ? (
            <span role="status" className="t-tech text-[0.6875rem] text-gris-58">
              enregistré
            </span>
          ) : null}
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => void sortir()}
            disabled={etat === "sortie"}
            className="cmd cmd-trait cmd-s"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </form>
  );
}
