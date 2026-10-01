import type { ProjetComplet } from "@/donnees/api";
import type { Accueil } from "@/donnees/types";
import { CRAN_ETAT } from "./format";

// ─────────────────────────────────────────────────────────────────────────────
// Ce que le premier niveau retient d'un projet.
//
// Le modèle en porte quinze champs. La carte en montre quatre, et c'est ici
// que la soustraction est écrite noir sur blanc plutôt que dispersée dans le
// dessin : un nom, un résumé, un cran d'avancement, un mot d'accueil. Le
// pôle, la catégorie, l'état en toutes lettres, la date de dernière activité
// et le porteur existent toujours — dans la fiche.
// ─────────────────────────────────────────────────────────────────────────────

export type Carte = {
  slug: string;
  /** 1 — le nom. */
  nom: string;
  /** 2 — le résumé, groupe nominal, une ligne. */
  resume: string;
  /** 3 — l'avancement, porté par le remplissage du signe. Aucun mot. */
  cran: 0 | 1 | 2 | 3;
  /** 4 — l'accueil, ou l'arrêt. Rien quand le porteur n'a rien dit. */
  accueil?: Accueil;
  enPause: boolean;
  /** L'URL de l'illustration, si le projet en a une : elle remplace le signe. */
  image?: string;
  /** Venu de la base : son adresse est celle de la fiche commune. */
  distant?: boolean;
};

export function enCarte(p: ProjetComplet): Carte {
  return {
    slug: p.slug,
    distant: p.distant,
    nom: p.nom,
    resume: p.resume,
    cran: CRAN_ETAT[p.etat],
    accueil: p.enPause ? undefined : p.accueil,
    enPause: !!p.enPause,
    image: p.image,
  };
}

/**
 * L'ordre du carrousel, et c'est un parti pris.
 *
 * Un carrousel montre une carte à la fois : la première décide de tout. Ce
 * sont donc les projets dont le porteur se dit prêt à échanger qui passent
 * devant — écrire à quelqu'un est la seule chose que le lecteur peut faire de
 * cet écran — puis les autres, du plus récemment actif au plus ancien. Les
 * projets arrêtés ferment la marche : ils existent, ils n'attendent personne.
 *
 * Rien n'est retiré. Les dix-sept sont dans la piste, et la règle graduée du
 * bas en montre la fin dès la première seconde.
 */
export function ordreCarrousel(projets: ProjetComplet[]): ProjetComplet[] {
  const rang = (p: ProjetComplet) =>
    p.enPause ? 2 : p.accueil === "ouvert" ? 0 : 1;
  return [...projets].sort(
    (a, b) => rang(a) - rang(b) || b.maj.localeCompare(a.maj),
  );
}
