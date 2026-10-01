import { cx } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// Le signe en grand, et ses mesures.
//
// La jauge du kit se remplit sur la version en masse pleine, parce qu'elle
// s'affiche entre treize et quarante pixels et qu'en dessous de trente-deux le
// tracé fin devient un fantôme. Au-delà, c'est l'inverse : le contre-poinçon
// de la version pleine est si petit qu'un projet en service et un projet en
// chantier font la même tache noire. À cette échelle la jauge se remplit donc
// sur la version au trait, dont le contre-poinçon occupe les quatre cinquièmes
// de la hauteur. Aucun tracé n'est retouché : ce sont les deux dessins du kit,
// chacun à la taille pour laquelle il est fait.
//
// Le remplissage n'est pas un triangle approché : c'est un rectangle découpé
// par le contre-poinçon lui-même. La ligne de remplissage tombe donc exactement
// sur le tracé, sans jour ni débord.
//
// Trois pièces, jamais mélangées : le signe, ses échos — des copies du même
// tracé mises à l'échelle autour du même centre, les courbes de niveau du film
// — et sa cote, une règle en brique portant les quatre crans.
// ─────────────────────────────────────────────────────────────────────────────

/** Le signe au trait, tel quel : `symbole.svg`. */
const TRAIT =
  "M-38.7744 -915.1765C60.5704 -577.9178 183.6996 -248.1264 329.6873 71.7178C475.675 -248.1264 598.8042 -577.9178 698.149 -915.1765C452.8186 -932.6507 206.5559 -932.6507 -38.7744 -915.1765ZM39.0435 -861.0539C232.6501 -872.0466 426.7244 -872.0466 620.3311 -861.0539C538.4828 -593.1219 441.4445 -330.0679 329.6873 -73.1691C217.9301 -330.0679 120.8917 -593.1219 39.0435 -861.0539Z";

/** Son contre-poinçon seul : le récipient. */
const CONTRE =
  "M39.0435 -861.0539C232.6501 -872.0466 426.7244 -872.0466 620.3311 -861.0539C538.4828 -593.1219 441.4445 -330.0679 329.6873 -73.1691C217.9301 -330.0679 120.8917 -593.1219 39.0435 -861.0539Z";

const BOITE = "-38.7744 -928.2821 736.9234 1000";

/**
 * Les trois remplissages. Ce ne sont pas des triangles approchés : chaque
 * tracé est le contre-poinçon lui-même, coupé à la hauteur voulue — les deux
 * courbes de ses flancs sont découpées à leur paramètre exact. La ligne de
 * remplissage tombe donc pile sur le tracé, sans jour ni débord.
 */
const PLEIN_1 =
  "M221.4 -335.7974L437.9746 -335.7974C403.5734 -247.5839 367.4716 -160.0247 329.6873 -73.1691C291.903 -160.0247 255.8012 -247.5839 221.4 -335.7974Z";
const PLEIN_2 =
  "M124.6772 -598.4256L534.6974 -598.4256C473.0875 -420.8243 404.7033 -245.6101 329.6873 -73.1691C254.6713 -245.6101 186.2871 -420.8243 124.6772 -598.4256Z";

const REMPLISSAGES = [null, PLEIN_1, PLEIN_2, CONTRE];

/**
 * Où tombe la ligne de remplissage, en fraction de la hauteur de la boîte.
 * Cran 0 : la pointe, le récipient est vide. Lu dans les tracés, pas estimé.
 */
export const NIVEAUX = [0.8551, 0.5925, 0.3299, 0.0672] as const;

const CX = 329.6873;
const CY = -428.2821;

/** Une boîte agrandie de 70 %, même centre : la place des échos. */
const BOITE_ECHOS = "-296.7527 -1278.2821 1252.7698 1700";
const ECHELLES = [1.12, 1.27, 1.43, 1.6];

export function Echos({
  pause,
  className,
}: {
  pause?: boolean;
  className?: string;
}) {
  // Les échos restent toujours plus clairs que le signe qu'ils entourent :
  // un projet arrêté est pâle, ses courbes de niveau le sont davantage.
  const base = pause ? 0.19 : 0.4;
  return (
    <svg
      viewBox={BOITE_ECHOS}
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {ECHELLES.map((k, i) => (
        <path
          key={k}
          d={TRAIT}
          strokeWidth={4.2}
          opacity={base - i * base * 0.21}
          transform={`translate(${CX} ${CY}) scale(${k}) translate(${-CX} ${-CY})`}
        />
      ))}
    </svg>
  );
}

export function SigneGrand({
  cran,
  pause,
  className,
}: {
  cran: 0 | 1 | 2 | 3;
  pause?: boolean;
  className?: string;
}) {
  const remplissage = REMPLISSAGES[cran];
  return (
    <svg
      viewBox={BOITE}
      className={cx("shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRAIT} opacity={pause ? 0.32 : 1} />
      {remplissage ? (
        <path d={remplissage} opacity={pause ? 0.32 : 1} />
      ) : null}
    </svg>
  );
}

/**
 * La cote du remplissage : quatre crans posés sur une règle, un seul marqué.
 * Elle se pose à gauche du signe, à la hauteur exacte de sa boîte — les quatre
 * traits tombent sur les quatre lignes de remplissage possibles.
 */
export function CoteCran({
  cran,
  pause,
  className,
}: {
  cran: 0 | 1 | 2 | 3;
  pause?: boolean;
  className?: string;
}) {
  const haut = NIVEAUX[3] * 100;
  const bas = NIVEAUX[0] * 100;
  return (
    <span
      aria-hidden
      className={cx("relative block w-4 shrink-0", className)}
    >
      <span
        className="absolute right-0 w-px bg-filet-fort"
        style={{ top: `${haut}%`, height: `${bas - haut}%` }}
      />
      {NIVEAUX.map((n, i) => {
        const marque = i === cran;
        return (
          <span
            key={n}
            className={cx(
              "absolute right-0 block h-px",
              marque
                ? pause
                  ? "w-4 bg-gris-58"
                  : "w-4 bg-brique"
                : "w-1.5 bg-filet-fort",
            )}
            style={{ top: `${n * 100}%` }}
          />
        );
      })}
    </span>
  );
}
