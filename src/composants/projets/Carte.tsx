"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { Monument } from "@/composants/base/Monument";
import type { Carte } from "@/lib/carrousel";
import { adresseProjet } from "@/lib/format";
import { CartoucheSigne, ImageProjet } from "./Vignette";

// ─────────────────────────────────────────────────────────────────────────────
// La carte. Quatre informations, et beaucoup d'air autour.
//
//   1. le signe, rempli à son cran — l'avancement, sans un mot ;
//   2. le nom ;
//   3. le résumé, une ligne ;
//   4. l'appel : le porteur prêt à échanger, ou l'arrêt, ou rien.
//
// Ni pôle, ni catégorie, ni date, ni état en toutes lettres : tout cela est
// dans la fiche, à un geste. Une carte qui n'appelle personne garde son
// quatrième emplacement vide plutôt que de le remplir — le silence est une
// information, et un porteur au complet ne demande rien au lecteur.
//
// Deux états, et c'est le passage de l'un à l'autre qui est le mouvement de
// l'écran : le plan (fond papier, signe au trait) et la carte construite (fond
// sombre, masse pleine, niveau monté, cote posée). Sur téléphone la carte
// construite est celle qui est au centre ; sur ordinateur c'est celle qu'on a
// choisie, et dont la fiche est ouverte en dessous.
// ─────────────────────────────────────────────────────────────────────────────

/** Ce que le signe dit, pour qui ne le voit pas. */
const ETATS = ["Idée", "En chantier", "En essai", "En service"] as const;

export function CarteProjet({
  carte,
  actif,
  centre,
  position,
  total,
  onDevant,
}: {
  carte: Carte;
  /** La carte choisie — celle dont la fiche est ouverte. */
  actif: boolean;
  /** La carte au centre de la piste. */
  centre: boolean;
  position: number;
  total: number;
  /** Sur téléphone, une carte qui dépasse du bord vient d'abord au centre. */
  onDevant?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const etat = carte.enPause
    ? `${ETATS[carte.cran]}, en pause`
    : ETATS[carte.cran];

  // Les deux états sont posés sur la carte ; c'est la feuille de style qui
  // décide lequel construit la carte, parce que lui seul connaît le format.
  // Rien ne se met donc à jour à l'hydratation : le serveur rend déjà l'écran
  // juste, sur téléphone comme sur ordinateur.
  return (
    <Link
      href={adresseProjet(carte)}
      data-carte
      data-actif={actif ? "true" : "false"}
      data-centre={centre ? "true" : "false"}
      aria-current={actif ? "true" : undefined}
      onClick={onDevant}
      className="carte"
    >
      <span className="carte-trame" aria-hidden />

      <span className="carte-champ">
        {carte.image ? (
          // L'illustration prend le champ ; le cartouche garde l'avancement
          // lisible dans un coin, à la place que le signe tenait.
          <span className="carte-image">
            <ImageProjet src={carte.image} nom={carte.nom} />
            <CartoucheSigne cran={carte.cran} pause={carte.enPause} />
          </span>
        ) : (
          <Monument cran={carte.cran} pause={carte.enPause} titre={etat} />
        )}
      </span>

      <span className="carte-pied">
        <span className="carte-nom">{carte.nom}</span>
        <span className="carte-resume">{carte.resume}</span>
        <span className="carte-appel">
          {carte.accueil === "ouvert" ? (
            <>
              <span className="carte-point" aria-hidden />
              <span className="carte-mot">Ouvert aux échanges</span>
            </>
          ) : carte.enPause ? (
            <>
              <span className="carte-hachure hachure" aria-hidden />
              <span className="carte-mot">En pause</span>
            </>
          ) : null}
        </span>
      </span>

      <span className="sr-only">{`Projet ${position} sur ${total}.`}</span>
    </Link>
  );
}
