"use client";

import { useId } from "react";
import { cx } from "@/lib/format";
import {
  BOITE,
  NIVEAUX,
  RECENTRE_TRAIT,
  SIGNE_CONTRE,
  SIGNE_PLEIN,
  SIGNE_TRAIT,
} from "@/lib/traces";

// ─────────────────────────────────────────────────────────────────────────────
// Le signe, en grand — et il travaille.
//
// Il mesure. Son contre-poinçon se remplit par l'intérieur, en quatre crans,
// de la pointe vers le haut. Le niveau atteint est coté : un trait de brique
// traverse le champ à la hauteur exacte du remplissage, avec ses deux serifs
// aux extrémités, comme les cotes du film. La brique ne remplit rien, elle
// mesure — c'est son seul emploi dans l'identité.
//
// Il occupe. À cette échelle il tient une carte entière sans image, et il n'y
// a aucune image : le modèle de données n'a pas de champ pour en accueillir.
//
// Il bouge. Une carte qui n'est pas choisie n'affiche que le tracé au trait :
// le plan. Quand elle vient au centre, la masse pleine prend la place du plan
// et le niveau monte jusqu'à son cran. C'est le film qui fait ça pendant seize
// secondes : une forme produite par une règle, qui affiche ses cotes.
//
// Aucun tracé n'est déformé, jamais.
// ─────────────────────────────────────────────────────────────────────────────

/** La boîte s'élargit pour laisser passer la cote de part et d'autre. */
const ETALEMENT = 1.36;

export type PropsMonument = {
  /** 0 idée · 1 en chantier · 2 en essai · 3 en service. */
  cran: 0 | 1 | 2 | 3;
  /** Un projet arrêté : tout s'atténue, rien ne disparaît. */
  pause?: boolean;
  /** Construit : masse pleine, niveau monté, cote posée. Sinon : le plan. */
  construit?: boolean;
  /** L'ouverture d'une fiche : tout se déplie au lieu d'être déjà là. */
  entree?: boolean;
  className?: string;
  titre?: string;
};

export function Monument({
  cran,
  pause,
  construit = false,
  entree,
  className,
  titre,
}: PropsMonument) {
  // React fabrique des identifiants à deux-points ; ils ne passent pas dans
  // un url(#…) de toutes les gravures.
  const cle = "n" + useId().replace(/:/g, "");

  const largeur = BOITE.w * ETALEMENT;
  const hauteur = BOITE.h;
  const x = BOITE.cx - largeur / 2;
  const y = BOITE.cy - hauteur / 2;

  const niveau = NIVEAUX[cran];
  // Ce qu'il reste à monter depuis la pointe : c'est la course de l'animation.
  const chute = `${NIVEAUX[0] - niveau}px`;
  const g = 14; // la garde de la cote, en unités de dessin

  return (
    <svg
      viewBox={`${x} ${y} ${largeur} ${hauteur}`}
      data-construit={construit ? "true" : "false"}
      className={cx("m-signe", entree && "m-entree", className)}
      // L'atténuation d'un projet arrêté passe par une variable : la carte,
      // qui décide en CSS de l'état construit, doit pouvoir la reprendre.
      style={
        pause
          ? ({
              ["--op-masse" as string]: 0.44,
              ["--op-plan" as string]: 0.42,
            } as React.CSSProperties)
          : undefined
      }
      role="img"
      aria-label={titre ?? `avancement ${cran} sur 3`}
    >
      <defs>
        <clipPath id={cle} clipPathUnits="userSpaceOnUse">
          {/* Le récipient se remplit par le bas : c'est la position de cette
              arête haute qu'on lit, et elle est à la hauteur du cran. */}
          <rect
            className="m-niveau"
            x={BOITE.cx - 300}
            y={niveau}
            width={600}
            height={1400}
            style={{ ["--chute" as string]: chute }}
          />
        </clipPath>
      </defs>

      {/* La cote : un trait de brique à la hauteur du remplissage, deux serifs
          aux bouts. Elle passe derrière la masse, jamais devant. */}
      <g
        className="m-cote"
        style={{ ["--chute" as string]: chute }}
        strokeWidth={1}
        fill="none"
      >
        <path
          d={`M${x + g} ${niveau}H${x + largeur - g}`}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M${x + g} ${niveau - 30}V${niveau + 30}`}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M${x + largeur - g} ${niveau - 30}V${niveau + 30}`}
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Le plan : le signe au trait, tel qu'il est dans le kit, recentré sur
          la boîte de la version pleine. */}
      <path
        className="m-plan"
        d={SIGNE_TRAIT}
        transform={RECENTRE_TRAIT}
        fill="currentColor"
      />

      {/* La masse, et ce qu'elle contient. */}
      <g className="m-masse">
        <path d={SIGNE_PLEIN} fill="currentColor" />
        {/* Le remplissage est bordé de son propre trait : sans lui, son arête
            et celle du contre-poinçon se superposent au pixel près et laissent
            un cheveu de fond entre les deux. */}
        <path
          d={SIGNE_CONTRE}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#${cle})`}
        />
      </g>
    </svg>
  );
}
