"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProjetComplet } from "@/donnees/api";
import { Monument } from "@/composants/base/Monument";
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
import { CartoucheSigne, ImageProjet } from "./Vignette";
import { AfficheAgrandissable } from "./AfficheAgrandissable";

// ─────────────────────────────────────────────────────────────────────────────
// La fiche. Riche, mais pas un article.
//
// Deux phrases rédigées — la présentation, et rien d'autre. Tout le reste est
// fait d'étiquettes, de valeurs, de dates et de commandes : le pôle, le
// porteur, la catégorie, le dépôt, les outils, et le mot d'accueil.
//
// Elle s'ouvre en dépliant ses mesures : le signe monte son niveau jusqu'à son
// cran et la cote de brique le suit. Rien de tout cela n'ajoute une ligne à
// l'écran.
//
// Sur ordinateur elle occupe toute la place sous la bande, en trois colonnes
// qui tiennent sans défiler : la mesure à gauche, ce qu'on peut faire au
// milieu, les faits à droite. La carte choisie est juste au-dessus : la fiche
// n'a pas à répéter le nom en grand, elle le rappelle dans sa barre.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Le dépliement marque le passage de la carte à la fiche. Une adresse ouverte
 * directement n'a rien à marquer : la fiche est déjà là, elle s'affiche posée.
 * Ce drapeau vit au module et n'est lu que dans le navigateur — le serveur
 * rend toujours l'état final.
 */
let dejaOuverte = false;

export function FicheProjet({ projet }: { projet: ProjetComplet }) {
  const [contact, setContact] = useState(false);
  const [copie, setCopie] = useState<string | null>(null);
  const [deplie] = useState(() => typeof window !== "undefined" && dejaOuverte);

  useEffect(() => {
    dejaOuverte = true;
  }, []);

  function copier(texte: string, quoi: string) {
    navigator.clipboard?.writeText(texte).then(
      () => {
        setCopie(quoi);
        window.setTimeout(() => setCopie(null), 1600);
      },
      () => undefined,
    );
  }

  const cran = CRAN_ETAT[projet.etat];
  const accueil = projet.enPause ? undefined : projet.accueil;
  const commande = projet.enPause
    ? "Écrire au porteur"
    : `Écrire à ${projet.porteur.nom}`;

  if (contact) {
    return <Contact projet={projet} onFermer={() => setContact(false)} />;
  }

  const boutonLien = (
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
  );

  /* ── Les blocs, montés deux fois : empilés sur téléphone, en colonnes sur
        ordinateur. C'est la disposition qui change, jamais le contenu. ── */

  const avancement = (
    <div className="fiche-avancement">
      {projet.image ? (
        <AfficheAgrandissable
          src={projet.image}
          alt={projet.imageAlt}
          nom={projet.nom}
          className="fiche-image fiche-image-grande"
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
        <Monument
          cran={cran}
          pause={projet.enPause}
          construit
          entree={deplie}
          className="fiche-monument"
          titre={NOM_ETAT[projet.etat]}
        />
      )}
      {/* L'état ne porte pas de couleur fixe : le même bloc est monté sur le
          fond sombre de l'en-tête du téléphone et sur le fond papier de la
          colonne d'ordinateur. */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="t-etq-l">{NOM_ETAT[projet.etat]}</span>
        {projet.enPause ? (
          <span className="t-etq border border-current px-1.5 py-1 opacity-65">
            En pause
          </span>
        ) : null}
      </div>
    </div>
  );

  const presentation = (
    <p className="fiche-prose">{projet.presentation}</p>
  );

  // Le porteur qui ne cherche personne le dit à la même place que les autres,
  // avec la même étiquette : c'est une valeur, pas une absence de bloc.
  const blocAccueil = (
    <section>
      <Etq ton="encre">Accueil</Etq>
      <div className="mt-2 flex items-center gap-2 border-t border-filet pt-2.5">
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
  );

  const faits = (
    <section>
      <Etq>Fiche</Etq>
      <div className="mt-1.5">
        <LigneFiche etiquette="Pôle" filet={false}>
          {projet.pole}
        </LigneFiche>
        <LigneFiche etiquette="Porteur">
          {projet.porteur.nom}
          <span className="t-tech ml-2 text-[0.6875rem] text-gris-40">
            {projet.porteur.origine}
          </span>
        </LigneFiche>
        {/* Les participants, après le porteur. Rien s'il n'y en a pas : pas de
            ligne fantôme. Ils apparaissent, sans aucun droit d'édition. */}
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
        <LigneFiche etiquette="Catégorie">
          <span className="flex items-center gap-2">
            <Categorie categorie={projet.categorie} className="text-gris-72" />
            <span className="t-tech text-[0.75rem] text-gris-58">
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
        <LigneFiche etiquette="Ouvert en">{moisAnnee(projet.debut)}</LigneFiche>
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
  );

  const bouton = (classe: string) => (
    <button
      type="button"
      onClick={() => setContact(true)}
      className={cx("cmd cmd-plein", classe)}
    >
      <Icone nom="enveloppe" className="h-4 w-4" />
      {commande}
    </button>
  );

  return (
    <article className="fiche">
      {/* Téléphone : la barre de retour. */}
      <div className="fiche-barre lg:hidden">
        <Link href="/projets" className="cmd cmd-nu cmd-s gap-1.5">
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Projets
        </Link>
        <span className="flex-1" />
        {boutonLien}
      </div>

      {/* Ordinateur : le nom, l'état, et les commandes. La carte choisie est
          juste au-dessus, elle porte déjà le grand titre. */}
      <div className="fiche-barre hidden lg:flex">
        <h1 className="t-titre truncate text-[1.0625rem]">{projet.nom}</h1>
        <span aria-hidden className="h-4 w-px shrink-0 bg-filet-fort" />
        <span className="t-etq shrink-0 text-gris-58">
          {projet.enPause ? "En pause" : NOM_ETAT[projet.etat]}
        </span>
        <span className="flex-1" />
        {boutonLien}
        {bouton("cmd-s")}
      </div>

      <div className="fiche-corps">
        {/* ── Téléphone : la fiche s'empile. ── */}
        <div className="lg:hidden">
          <header className="fiche-tete">
            <span className="fiche-tete-trame" aria-hidden />
            {avancement}
            <h1 className="fiche-nom">{projet.nom}</h1>
            <p className="fiche-resume">{projet.resume}</p>
          </header>
          <div className="fiche-bloc">{presentation}</div>
          <div className="fiche-bloc">{blocAccueil}</div>
          <div className="fiche-bloc">{faits}</div>
          <div className="h-3" />
        </div>

        {/* ── Ordinateur : trois colonnes, aucune ne défile. ── */}
        <div className="fiche-colonnes hidden lg:grid">
          <div className="fiche-col">{avancement}</div>
          <div className="fiche-col fiche-col-milieu">
            {presentation}
            <div className="mt-5">{blocAccueil}</div>
          </div>
          <div className="fiche-col">{faits}</div>
        </div>
      </div>

      {/* Téléphone : la commande ne quitte jamais l'écran. */}
      <div className="fiche-pied lg:hidden">{bouton("w-full")}</div>
    </article>
  );
}
