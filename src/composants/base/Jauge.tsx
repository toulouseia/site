import { cx } from "@/lib/format";
import { SIGNE_CONTRE, SIGNE_PLEIN } from "@/lib/traces";

// ─────────────────────────────────────────────────────────────────────────────
// La jauge d'avancement, c'est le signe lui-même.
//
// Le signe se remplit par l'intérieur, de la pointe vers le haut, en quatre
// crans. Le tracé du signe n'est jamais touché : c'est son contre-poinçon qui
// se remplit, comme un récipient. Le remplissage est proportionnel à la
// hauteur et non à l'aire : c'est la position de la ligne de remplissage qu'on
// lit d'un coup d'œil, pas la surface noire. À l'aire, les crans 1 et 2
// tombaient à 58 % et 82 % de la hauteur — indiscernables à quinze pixels.
//
// C'est la version pleine du kit qui sert de contenant : la jauge s'affiche
// entre 13 et 40 px, et en dessous de 32 px le tracé fin devient un fantôme.
// ─────────────────────────────────────────────────────────────────────────────

const ANNEAU = SIGNE_PLEIN;

/** Le contre-poinçon entier — le cran 3, exactement. */
const PLEIN_3 = SIGNE_CONTRE;

/** Crans intermédiaires : sommets interpolés depuis la pointe (255.0378, −232.0619). */
const PLEIN_1 = "M210.4028 -355.5309L299.6728 -355.5309L255.0378 -232.0619Z";
const PLEIN_2 = "M165.7678 -479.0L344.3078 -479.0L255.0378 -232.0619Z";

const REMPLISSAGES = [null, PLEIN_1, PLEIN_2, PLEIN_3];

export type PropsJauge = {
  /** 0 idée · 1 en chantier · 2 en essai · 3 en service */
  cran: 0 | 1 | 2 | 3;
  /** Un projet arrêté : tout s'atténue, rien ne disparaît. */
  pause?: boolean;
  className?: string;
  titre?: string;
};

export function Jauge({ cran, pause, className, titre }: PropsJauge) {
  const remplissage = REMPLISSAGES[cran];
  return (
    <svg
      viewBox="-117.8484 -785.7942 745.7726 1000.0001"
      className={cx("shrink-0", className)}
      fill="currentColor"
      role="img"
      aria-label={titre ?? `avancement ${cran} sur 3`}
    >
      <path d={ANNEAU} opacity={pause ? 0.28 : cran === 0 ? 0.32 : 1} />
      {remplissage ? (
        <path d={remplissage} opacity={pause ? 0.3 : 1} />
      ) : null}
    </svg>
  );
}
