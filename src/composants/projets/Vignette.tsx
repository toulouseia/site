import { cx } from "@/lib/format";
import { SigneGrand } from "./SigneGrand";

// ─────────────────────────────────────────────────────────────────────────────
// L'image d'illustration d'un projet, et le signe rappelé en petit.
//
// Quand un projet porte une image, elle prend la place que le signe occupait :
// sur le mur, sur la carte, sur la fiche. Mais l'avancement, que le signe
// portait sans un mot, ne doit pas disparaître pour autant — alors on le rappelle
// en petit, dans un cartouche à filet de brique posé sur un coin de l'image.
//
// Rien d'arrondi, aucune ombre, aucun dégradé : l'image est cadrée net
// (`object-fit: cover`), comme un tirage collé dans la planche.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * L'image elle-même : une balise `<img>` ordinaire, cadrée en `cover`. L'`alt`
 * par défaut est le nom du projet — l'image illustre, elle ne remplace pas le
 * texte qui, lui, reste lisible partout.
 */
export function ImageProjet({
  src,
  alt,
  nom,
  cadre,
  className,
}: {
  src: string;
  /** Un texte de remplacement explicite ; à défaut, le nom du projet sert d'`alt`. */
  alt?: string;
  nom: string;
  /**
   * Le point de l'image à garder quand elle est recadrée en `cover` pour emplir
   * son champ, passé tel quel à `object-position`. À défaut, le centre.
   */
  cadre?: string;
  className?: string;
}) {
  return (
    // Une image ordinaire, pas `next/image` : le site est exporté en statique et
    // servi par Cloudflare, sans le serveur d'optimisation d'images de Next.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? nom}
      loading="lazy"
      decoding="async"
      className={cx("projet-image", className)}
      style={cadre ? { objectPosition: cadre } : undefined}
    />
  );
}

/**
 * Le signe rappelé en petit, dans un cartouche à filet de brique. Il se pose sur
 * un coin de l'image pour que l'avancement reste lisible même quand le signe a
 * cédé sa place au tirage.
 */
export function CartoucheSigne({
  cran,
  pause,
  className,
}: {
  cran: 0 | 1 | 2 | 3;
  pause?: boolean;
  className?: string;
}) {
  return (
    <span className={cx("cartouche-signe", className)} aria-hidden>
      <SigneGrand cran={cran} pause={pause} className="cartouche-signe-svg" />
    </span>
  );
}
