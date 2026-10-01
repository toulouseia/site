"use client";

import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";

/**
 * La personne, en une case : sa photo si le service en a donné une, sinon
 * l'icône du compte. Carrée comme tout le reste, jamais ronde.
 */
export function Portrait({
  photo,
  nom,
  className,
}: {
  photo: string | null | undefined;
  nom?: string;
  className?: string;
}) {
  if (photo) {
    // La photo vient de Google ou de GitHub, à sa taille : rien à optimiser,
    // et un site en pages fabriquées d'avance n'a pas de service d'images.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={nom ? `Photo de ${nom}` : ""}
        referrerPolicy="no-referrer"
        className={cx("shrink-0 object-cover", className)}
      />
    );
  }
  return <Icone nom="compte" className={cx("shrink-0", className)} />;
}
