"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjetComplet } from "@/donnees/api";
import { Icone } from "@/composants/base/Icone";
import { Categorie, Etq, LigneFiche } from "@/composants/base/Atomes";
import {
  CRAN_ETAT,
  NOM_ACCUEIL,
  NOM_ETAT,
  cx,
  dateLongue,
  ecart,
  moisAnnee,
} from "@/lib/format";
import { Contact } from "./Contact";
import { SigneGrand } from "./SigneGrand";
import { CartoucheSigne, ImageProjet } from "./Vignette";
import { AfficheAgrandissable } from "./AfficheAgrandissable";

// ─────────────────────────────────────────────────────────────────────────────
// La fiche. Elle a le droit d'être riche, pas d'être un article : deux phrases
// rédigées sur toute sa hauteur, celles de la présentation, et rien d'autre en
// prose. Tout le reste est étiquette, valeur ou commande.
//
// Le premier bloc est une légende autant qu'une mesure : les quatre crans du
// signe, dessinés, celui du projet en encre. C'est là qu'on apprend à lire le
// mur ; après ce coup d'œil, dix-sept remplissages veulent dire quelque chose.
// ─────────────────────────────────────────────────────────────────────────────

const CRANS = [0, 1, 2, 3] as const;
const ETATS = ["idee", "chantier", "essai", "service"] as const;

export function Fiche({
  projet,
  ouverture,
  onComposeur,
}: {
  projet: ProjetComplet;
  /** Sur téléphone, la fiche s'ouvre en dépliant ses mesures. */
  ouverture?: boolean;
  /** Le survol du mur ne doit pas changer la fiche pendant qu'on lit l'adresse
      d'un porteur. */
  onComposeur?: (ouvert: boolean) => void;
}) {
  const [contact, setContact] = useState(false);
  const [copie, setCopie] = useState<string | null>(null);
  const cran = CRAN_ETAT[projet.etat];
  const accueil = projet.enPause ? undefined : projet.accueil;

  function ouvrirContact() {
    setContact(true);
    onComposeur?.(true);
  }
  function fermerContact() {
    setContact(false);
    onComposeur?.(false);
  }

  function copier(texte: string, quoi: string) {
    navigator.clipboard?.writeText(texte).then(
      () => {
        setCopie(quoi);
        window.setTimeout(() => setCopie(null), 1600);
      },
      () => undefined,
    );
  }

  const commande = projet.enPause
    ? "Écrire au porteur"
    : `Écrire à ${projet.porteur.nom}`;

  if (contact) {
    return <Contact projet={projet} onFermer={fermerContact} />;
  }

  /** Le décalage de chaque bloc quand la fiche se déplie. */
  const an = (i: number) =>
    ouverture ? { style: { animationDelay: `${i * 55}ms` } } : {};

  return (
    <article className="flex h-full flex-col bg-papier">
      {/* Revenir au mur, et emporter l'adresse. */}
      <div className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-1 border-b border-filet bg-papier px-2 lg:static">
        <Link href="/projets" className="cmd cmd-nu cmd-s gap-1.5 lg:hidden">
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Le mur
        </Link>
        <span className="hidden pl-2 lg:block">
          <Etq ton="encre">Fiche</Etq>
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() =>
            copier(
              typeof window === "undefined" ? projet.slug : window.location.href,
              "lien",
            )
          }
          className="cmd cmd-nu cmd-s"
        >
          <Icone nom={copie === "lien" ? "coche" : "copie"} className="h-4 w-4" />
          {copie === "lien" ? "Copié" : "Lien"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* ── Le signe à sa mesure, le nom, ce que c'est ──────────────── */}
        <header
          className="trame trame-haut border-b border-filet px-4 pt-5 pb-4"
          style={{ ["--trame-op" as string]: "0.09" }}
        >
          <div
            className={cx(
              "flex items-stretch gap-4",
              ouverture && "an-deplie-signe",
            )}
          >
            {projet.image ? (
              <AfficheAgrandissable
                src={projet.image}
                alt={projet.imageAlt}
                nom={projet.nom}
                className="fiche-image"
              >
                <ImageProjet
                  src={projet.image}
                  alt={projet.imageAlt ?? projet.nom}
                  nom={projet.nom}
                  cadre={projet.imageCadre}
                />
                <CartoucheSigne cran={cran} pause={projet.enPause} />
              </AfficheAgrandissable>
            ) : (
              <SigneGrand
                cran={cran}
                pause={projet.enPause}
                className="h-[5.5rem] w-auto text-encre"
              />
            )}
            <span className="flex min-w-0 flex-1 flex-col justify-end pb-1">
              <span className="t-etq-l text-encre">
                {projet.enPause ? "En pause" : NOM_ETAT[projet.etat]}
              </span>
            </span>
          </div>

          <h1 {...an(1)} className={cx("t-titre-xl mt-5 text-[1.9rem] text-balance", ouverture && "an-deplie")}>
            {projet.nom}
          </h1>
          {/* Les deux seules phrases rédigées de toute la fiche, et elles sont
              là où on les lit : sous le nom. Le résumé n'y est pas — il dit la
              même chose en plus court, et il a déjà été lu sur le mur. */}
          <p
            {...an(2)}
            className={cx(
              "t-corps mt-3 text-[0.9375rem] leading-[1.5] text-gris-86",
              ouverture && "an-deplie",
            )}
          >
            {projet.presentation}
          </p>
        </header>

        {/* ── L'échelle des crans : la légende du mur ─────────────────── */}
        <section
          {...an(3)}
          className={cx(
            "border-b border-filet px-4 pt-3.5 pb-4",
            ouverture && "an-deplie",
          )}
        >
          <Etq>Avancement</Etq>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {CRANS.map((c) => {
              const ici = c === cran;
              return (
                <span key={c} className="flex flex-col items-center gap-2">
                  <SigneGrand
                    cran={c}
                    className={cx(
                      "h-10 w-auto",
                      ici ? "text-encre" : "text-gris-40",
                    )}
                  />
                  <span
                    className={cx(
                      "t-etq text-center",
                      ici ? "text-encre" : "text-gris-40",
                    )}
                  >
                    {NOM_ETAT[ETATS[c]]}
                  </span>
                  <span
                    aria-hidden
                    className={cx(
                      "h-px w-full",
                      ici ? "bg-brique" : "bg-transparent",
                    )}
                  />
                </span>
              );
            })}
          </div>
        </section>

        {/* ── L'accueil : un mot du porteur, et rien de plus ────────── */}
        <section
          {...an(4)}
          className={cx(
            "border-b border-filet px-4 pt-3.5 pb-4",
            ouverture && "an-deplie",
          )}
        >
          <Etq ton="encre">Accueil</Etq>
          <div className="mt-2.5 flex items-center gap-2 border-t border-filet pt-3">
            <span
              aria-hidden
              className={cx(
                "h-[7px] w-[7px] shrink-0",
                accueil === "ouvert"
                  ? "bg-brique"
                  : "border border-gris-40 bg-papier",
              )}
            />
            <span className="t-corps-f text-[0.875rem]">
              {projet.enPause
                ? "Projet arrêté"
                : accueil
                  ? NOM_ACCUEIL[accueil]
                  : "Rien d'annoncé"}
            </span>
          </div>
        </section>

        {/* ── Les faits ──────────────────────────────────────────────── */}
        <section
          {...an(5)}
          className={cx("px-4 pt-3.5 pb-4", ouverture && "an-deplie")}
        >
          <Etq>Fiche</Etq>
          <div className="mt-2">
            <LigneFiche etiquette="Pôle" filet={false}>
              {projet.pole}
            </LigneFiche>
            <LigneFiche etiquette="Nature">
              <span className="flex items-center gap-2">
                <Categorie categorie={projet.categorie} />
                <span className="t-tech text-[0.6875rem] text-gris-58">
                  {projet.categorie === "open" ? "dépôt public" : "revenus visés"}
                </span>
              </span>
            </LigneFiche>
            {projet.depot ? (
              <LigneFiche etiquette="Dépôt">
                <span className="flex items-center gap-2">
                  <a
                    href={`https://github.com/${projet.depot}`}
                    target="_blank"
                    rel="noreferrer"
                    className="t-tech truncate text-[0.8125rem] underline decoration-filet-fort underline-offset-4 hover:decoration-encre"
                  >
                    {projet.depot}
                  </a>
                  <button
                    type="button"
                    onClick={() => copier(projet.depot!, "depot")}
                    className="cmd cmd-nu cmd-s -my-1 shrink-0 px-1.5"
                    aria-label="Copier l'adresse du dépôt"
                  >
                    <Icone
                      nom={copie === "depot" ? "coche" : "copie"}
                      className="h-3.5 w-3.5"
                    />
                  </button>
                </span>
              </LigneFiche>
            ) : null}
            {projet.modele ? (
              <LigneFiche etiquette="Modèle">{projet.modele}</LigneFiche>
            ) : null}
            <LigneFiche etiquette="Porteur">
              {projet.porteur.nom}
              <span className="t-tech ml-2 text-[0.6875rem] text-gris-40">
                {projet.porteur.origine}
              </span>
            </LigneFiche>
            {/* Les participants, après le porteur. Rien s'il n'y en a pas : pas
                de ligne fantôme. Ils apparaissent, sans aucun droit d'édition. */}
            {projet.membres?.length ? (
              <LigneFiche etiquette="Membres">
                <span className="flex flex-col gap-0.5">
                  {projet.membres.map((m) => (
                    <span key={m.id}>
                      {m.nom}
                      {m.origine ? (
                        <span className="t-tech ml-2 text-[0.6875rem] text-gris-40">
                          {m.origine}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </span>
              </LigneFiche>
            ) : null}
            <LigneFiche etiquette="Ouvert en">
              {moisAnnee(projet.debut)}
            </LigneFiche>
            <LigneFiche etiquette="Activité">
              {dateLongue(projet.maj)}
              <span className="t-tech ml-2 text-[0.6875rem] text-gris-40">
                il y a {ecart(projet.maj)}
              </span>
            </LigneFiche>
            {/* Un projet déposé peut n'annoncer aucun outil : pas de ligne vide. */}
            {projet.outils.length ? (
              <LigneFiche etiquette="Outils">
                <span className="flex flex-wrap gap-1">
                  {projet.outils.map((o) => (
                    <span
                      key={o}
                      className="t-tech border border-filet-fort px-1.5 py-[3px] text-[0.6875rem] text-gris-58"
                    >
                      {o}
                    </span>
                  ))}
                </span>
              </LigneFiche>
            ) : null}
          </div>
        </section>

      </div>

      {/* La commande principale ne quitte jamais l'écran. */}
      <div className="shrink-0 border-t border-filet bg-papier px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:pb-2.5">
        <button
          type="button"
          onClick={ouvrirContact}
          className="cmd cmd-plein w-full"
        >
          <Icone nom="enveloppe" className="h-4 w-4" />
          {commande}
        </button>
      </div>
    </article>
  );
}
