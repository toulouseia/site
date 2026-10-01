// Les dessins du kit, repris tels quels. Aucun tracé n'est retouché : ni
// inclinaison, ni étirement, ni rotation. Seule la couleur change, et
// seulement vers l'encre, le blanc ou la brique. Les tracés eux-mêmes sont
// dans `lib/traces.ts`, recopiés une seule fois pour toute l'application.

import {
  LOCKUP_BOITE,
  LOCKUP_PLEIN_BOITE,
  MOT,
  MOT_LOCKUP_PLEIN,
  SIGNE_LOCKUP,
  SIGNE_LOCKUP_PLEIN,
  SIGNE_PLEIN,
  SIGNE_TRAIT,
} from "@/lib/traces";

type PropsSigne = {
  /** En dessous de 32 px, la version pleine — c'est la règle du kit. */
  plein?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Signe({ plein, className, style }: PropsSigne) {
  return (
    <svg
      viewBox={
        plein
          ? "-117.8484 -785.7942 745.7726 1000.0001"
          : "-38.7744 -928.2821 736.9234 1000"
      }
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={plein ? SIGNE_PLEIN : SIGNE_TRAIT} />
    </svg>
  );
}

/**
 * Le logo principal : le signe et le nom, à l'écart calculé du kit.
 *
 * Deux versions, et le choix n'est pas une question de goût. Le signe au trait
 * est fin : en dessous de 32 pixels de haut il devient un gris fantôme, et le
 * kit impose alors la masse pleine (règle des petites tailles, vérifiée à
 * l'œil dans `logos-png/*@32px-zoom8.png`). L'en-tête du téléphone, le bandeau
 * de section et le rail affichent le logo entre 15 et 20 pixels : ils passent
 * tous `plein`. Au-dessus — une affiche, une page d'erreur — le trait reprend
 * la main, c'est là qu'il se voit.
 *
 * Les deux dessins n'ont pas la même boîte, l'écart entre le signe et le nom
 * faisant partie du dessin : on prend celle du fichier, on ne la recalcule pas.
 */
export function Lockup({
  plein,
  className,
  style,
}: {
  plein?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox={plein ? LOCKUP_PLEIN_BOITE : LOCKUP_BOITE}
      className={className}
      style={style}
      fill="currentColor"
      role="img"
      aria-label="Toulouse IA"
    >
      <path d={plein ? SIGNE_LOCKUP_PLEIN : SIGNE_LOCKUP} />
      <path d={plein ? MOT_LOCKUP_PLEIN : MOT} />
    </svg>
  );
}
