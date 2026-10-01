"use client";

import type { Cours, Lecon } from "@/serveur/domaine/academy";
import type { Avancement } from "@/serveur/domaine/progression";
import { avancementCours } from "@/serveur/domaine/progression";
import { Jauge } from "@/composants/base/Jauge";
import { cx, duree } from "@/lib/format";
import { useProgression } from "./progression";

// ─────────────────────────────────────────────────────────────────────────────
// L'AVANCEMENT, MONTRÉ.
//
// Le signe du club est déjà une jauge : il se remplit par l'intérieur, de la
// pointe vers le haut, en quatre crans. Il mesure l'avancement d'un projet sur
// l'écran des projets ; il mesure ici l'avancement d'un cours. C'est la même
// idée, le même dessin, et l'application n'a pas deux vocabulaires pour dire
// la même chose.
//
// La règle : elle porte la mesure exacte, que les quatre crans du signe ne
// donnent pas. Un filet de 2 px, rempli à l'encre. Aucune couleur, aucune
// animation gratuite, seulement une transition de largeur, pour que
// l'avancement se voie bouger quand on coche une leçon.
// ─────────────────────────────────────────────────────────────────────────────

/** L'avancement d'un cours, calculé depuis la progression du navigateur. */
export function useAvancement(
  cours: Pick<Cours, "id">,
  lecons: readonly Lecon[],
): { avancement: Avancement; pret: boolean } {
  const { progression, pret } = useProgression();
  return { avancement: avancementCours(cours, lecons, progression), pret };
}

export function Regle({
  part,
  className,
  ton = "encre",
}: {
  part: number;
  className?: string;
  ton?: "encre" | "clair";
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "relative block h-[2px] overflow-hidden",
        ton === "encre" ? "bg-gris-14" : "bg-nuit-28",
        className,
      )}
    >
      {/* scaleX, pas width : une largeur animée relaie la mise en page à
          chaque image, une transformation reste au compositeur. */}
      <span
        className={cx(
          "absolute top-0 left-0 h-full w-full origin-left transition-transform duration-500 ease-out motion-reduce:transition-none",
          ton === "encre" ? "bg-encre" : "bg-papier",
        )}
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, part))})` }}
      />
    </span>
  );
}

/**
 * La ligne d'avancement complète : le signe, la mesure, la règle. Tant que le
 * navigateur n'a pas répondu, on réserve la place et on n'affiche pas de
 * chiffre, un « 0 / 12 » qui saute à « 5 / 12 » à l'hydratation se lit comme
 * une perte de données.
 */
export function LigneAvancement({
  avancement,
  pret,
  taille = "normal",
  className,
}: {
  avancement: Avancement;
  pret: boolean;
  taille?: "normal" | "compact";
  className?: string;
}) {
  const vide = avancement.total === 0;

  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <Jauge
        cran={pret ? avancement.cran : 0}
        className={cx(
          "text-encre transition-opacity duration-300",
          taille === "compact" ? "h-[13px]" : "h-4",
          pret ? "opacity-100" : "opacity-30",
        )}
        titre={
          pret
            ? `${avancement.faites} leçon(s) terminée(s) sur ${avancement.total}`
            : "avancement en cours de lecture"
        }
      />
      <div className="min-w-0 flex-1">
        <Regle part={pret ? avancement.part : 0} />
      </div>
      <span
        className={cx(
          "t-cote shrink-0 tabular-nums transition-opacity duration-300",
          taille === "compact" ? "text-[0.6875rem]" : "text-[0.75rem]",
          avancement.termine ? "text-encre" : "text-brique",
          pret ? "opacity-100" : "opacity-0",
        )}
      >
        {vide ? "·" : `${avancement.faites}/${avancement.total}`}
      </span>
    </div>
  );
}

/** Le sous-titre chiffré d'un cours : ce qu'il contient, ou ce qu'il en reste. */
export function MesureCours({
  cours,
  avancement,
  pret,
}: {
  cours: Cours;
  avancement: Avancement;
  pret: boolean;
}) {
  if (cours.statut === "annonce") {
    return (
      <span className="t-tech text-[0.6875rem] text-gris-40">
        Programme arrêté · leçons à écrire
      </span>
    );
  }

  const total = `${cours.nbLecons} leçon${cours.nbLecons > 1 ? "s" : ""} · ${duree(cours.minutes)}`;

  if (!pret || !avancement.commence) {
    return (
      <span className="t-tech text-[0.6875rem] text-gris-58">{total}</span>
    );
  }
  if (avancement.termine) {
    return (
      <span className="t-tech text-[0.6875rem] text-encre">
        Terminé · {total}
      </span>
    );
  }
  return (
    <span className="t-tech text-[0.6875rem] text-gris-58">
      {duree(avancement.minutesRestantes)} restantes · {total}
    </span>
  );
}
