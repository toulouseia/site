import type { ProjetComplet } from "@/donnees/api";
import type { Pole } from "@/donnees/types";
import { CRAN_ETAT, aplatir } from "./format";

export type Reglages = {
  q: string;
  categorie: "tout" | "open" | "business";
  /** Ne garder que les porteurs qui se disent prêts à échanger. */
  ouverts: boolean;
  poles: Pole[];
  tri: "maj" | "avancement" | "alpha";
};

// L'ordre par défaut est celui de l'avancement, et ce n'est pas un détail :
// c'est lui qui rend le mur lisible. Dix-sept signes rangés du plus rempli au
// plus vide dessinent une pente ; rangés par date, ils font un semis.
export const REGLAGES_VIDES: Reglages = {
  q: "",
  categorie: "tout",
  ouverts: false,
  poles: [],
  tri: "avancement",
};

export function reglagesActifs(r: Reglages) {
  return (
    (r.q ? 1 : 0) +
    (r.categorie !== "tout" ? 1 : 0) +
    (r.ouverts ? 1 : 0) +
    r.poles.length
  );
}

/** Le filtrage, pur : mêmes entrées, même sortie, aucun état caché. */
export function filtrer(
  projets: ProjetComplet[],
  r: Reglages,
): ProjetComplet[] {
  const q = aplatir(r.q.trim());
  const mots = q ? q.split(/\s+/) : [];

  const gardes = projets.filter((p) => {
    if (r.categorie !== "tout" && p.categorie !== r.categorie) return false;
    if (r.ouverts && (p.accueil !== "ouvert" || p.enPause)) return false;
    if (r.poles.length > 0 && !r.poles.includes(p.pole)) return false;
    if (mots.length > 0) {
      const foin = aplatir(
        [
          p.nom,
          p.resume,
          p.presentation,
          p.pole,
          p.porteur.nom,
          p.outils.join(" "),
        ].join(" "),
      );
      if (!mots.every((m) => foin.includes(m))) return false;
    }
    return true;
  });

  const ordonne = [...gardes];
  switch (r.tri) {
    case "avancement":
      ordonne.sort(
        (a, b) =>
          CRAN_ETAT[b.etat] - CRAN_ETAT[a.etat] || b.maj.localeCompare(a.maj),
      );
      break;
    case "alpha":
      ordonne.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
      break;
    default:
      ordonne.sort((a, b) => b.maj.localeCompare(a.maj));
  }
  // Les projets en pause descendent toujours : ils existent, ils n'attendent
  // personne.
  ordonne.sort((a, b) => Number(!!a.enPause) - Number(!!b.enPause));
  return ordonne;
}

export const NOM_TRI: Record<Reglages["tri"], string> = {
  maj: "Activité",
  avancement: "Avancement",
  alpha: "Nom",
};
