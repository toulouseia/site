// ─────────────────────────────────────────────────────────────────────────────
// L'accès aux données. C'est la seule porte.
//
// Aucun composant n'importe PROJETS, RESSOURCES ou NUMEROS directement : tout
// passe par ces fonctions, qui sont asynchrones alors qu'elles n'en ont pas
// besoin. C'est délibéré — le jour où un serveur existe, on remplace le corps
// de chaque fonction par un `fetch` et pas une ligne d'interface ne bouge.
// ─────────────────────────────────────────────────────────────────────────────

import { PERSONNES } from "./personnes";
import { PROJETS } from "./projets";
import { RESSOURCES, SEANCES } from "./ressources";
import { NUMEROS } from "./veille";
import { ANNALES, OUTILS, REPONSES_AGENT } from "./outils";
import type {
  Annale,
  Membre,
  Numero,
  Outil,
  Personne,
  Projet,
  ReponseAgent,
  Ressource,
  Seance,
} from "./types";

/** Un projet accompagné de son porteur — la forme que consomment les écrans. */
export type ProjetComplet = Projet & {
  porteur: Personne;
  /**
   * Les membres participants, en plus du porteur. Chargés par le serveur sur la
   * fiche d'un projet seulement (`worker/projets.ts`, `lireParSlug`), jamais sur
   * le mur : c'est le nombre de lignes lues qui sature en premier. Absent ou vide
   * pour la plupart des projets — et pour tous les projets « en dur ».
   */
  membres?: Membre[];
  /**
   * Vrai pour un projet venu de la base, après la fusion faite dans le
   * navigateur (`distant.ts`) : il n'a pas de page fabriquée d'avance, et son
   * adresse est celle de la fiche commune (`lib/format.ts`, `adresseProjet`).
   */
  distant?: boolean;
};

function joindre(projet: Projet): ProjetComplet {
  const porteur =
    PERSONNES.find((p) => p.id === projet.porteurId) ?? PERSONNES[0];
  return { ...projet, porteur };
}

const parMajDecroissante = (a: Projet, b: Projet) => b.maj.localeCompare(a.maj);

export async function listerProjets(): Promise<ProjetComplet[]> {
  return [...PROJETS].sort(parMajDecroissante).map(joindre);
}

export async function obtenirProjet(
  slug: string,
): Promise<ProjetComplet | null> {
  const projet = PROJETS.find((p) => p.slug === slug);
  return projet ? joindre(projet) : null;
}

export async function listerSlugsProjets(): Promise<string[]> {
  return PROJETS.map((p) => p.slug);
}

/** Les mesures du tableau : ce que le volet affiche quand rien n'est ouvert. */
export type MesuresProjets = {
  total: number;
  /** Ceux dont le porteur se dit prêt à échanger. Jamais un nombre de places. */
  ouverts: number;
  parEtat: Record<string, number>;
  parPole: { pole: string; total: number; ouverts: number }[];
  parCategorie: { open: number; business: number };
  dernierDepot: string;
  recents: { slug: string; nom: string; maj: string; ouvert: boolean }[];
};

export async function mesurerProjets(): Promise<MesuresProjets> {
  return mesurer(PROJETS);
}

/**
 * Les mesures d'une liste de projets, quelle qu'elle soit : celle du code à
 * la construction, ou la liste fusionnée avec la base dans le navigateur. Pure,
 * sans lecture de PROJETS — c'est ce qui la rend vraie pour les deux.
 */
export function mesurer(projets: readonly Projet[]): MesuresProjets {
  if (projets.length === 0) {
    return {
      total: 0,
      ouverts: 0,
      parEtat: { idee: 0, chantier: 0, essai: 0, service: 0 },
      parPole: ["Agentic", "ModIA", "Embedded", "Hackathon"].map((pole) => ({
        pole,
        total: 0,
        ouverts: 0,
      })),
      parCategorie: { open: 0, business: 0 },
      dernierDepot: "",
      recents: [],
    };
  }
  const actifs = projets.filter((p) => !p.enPause);
  const ouvert = (p: Projet) => !p.enPause && p.accueil === "ouvert";
  const parEtat: Record<string, number> = {
    idee: 0,
    chantier: 0,
    essai: 0,
    service: 0,
  };
  for (const p of projets) parEtat[p.etat] += 1;

  const poles = ["Agentic", "ModIA", "Embedded", "Hackathon"];
  const parPole = poles.map((pole) => ({
    pole,
    total: projets.filter((p) => p.pole === pole).length,
    ouverts: projets.filter((p) => p.pole === pole && ouvert(p)).length,
  }));

  return {
    total: projets.length,
    ouverts: actifs.filter(ouvert).length,
    parEtat,
    parPole,
    parCategorie: {
      open: projets.filter((p) => p.categorie === "open").length,
      business: projets.filter((p) => p.categorie === "business").length,
    },
    dernierDepot: [...projets].sort((a, b) => b.debut.localeCompare(a.debut))[0]
      .debut,
    recents: [...projets]
      .sort(parMajDecroissante)
      .slice(0, 4)
      .map((p) => ({
        slug: p.slug,
        nom: p.nom,
        maj: p.maj,
        ouvert: ouvert(p),
      })),
  };
}

export async function listerRessources(): Promise<Ressource[]> {
  return RESSOURCES;
}

export async function listerSeances(): Promise<Seance[]> {
  return [...SEANCES].sort((a, b) => a.date.localeCompare(b.date));
}

export async function listerNumeros(): Promise<Numero[]> {
  // Un brouillon ne part jamais en ligne : `next build` tourne toujours en
  // production, `next dev` jamais. Cette fonction ne s'exécute qu'à la
  // construction / côté serveur (le composant serveur `veille/page.tsx`), donc
  // `globalThis.process` existe toujours. On y accède par `globalThis` plutôt
  // que par le global `process` nu : le worker importe ce module (pour
  // `listerSlugsProjets`) et le vérifie sous un tsconfig sans les types Node
  // (`worker/tsconfig.json`, `types: []`), où `process` n'est pas déclaré. La
  // valeur lue est identique — c'est le même `process.env.NODE_ENV` du build.
  const enProduction =
    (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV === "production";
  const visibles = enProduction ? NUMEROS.filter((n) => !n.brouillon) : NUMEROS;
  return [...visibles].sort((a, b) => b.numero - a.numero);
}

export async function listerOutils(): Promise<Outil[]> {
  return OUTILS;
}

export async function listerReponsesAgent(): Promise<ReponseAgent[]> {
  return REPONSES_AGENT;
}

export async function listerAnnales(): Promise<Annale[]> {
  return [...ANNALES].sort(
    (a, b) => b.annee - a.annee || a.matiere.localeCompare(b.matiere),
  );
}

/** Les compteurs du rail de navigation. */
export async function compterTout(): Promise<Record<string, number>> {
  return {
    projets: PROJETS.length,
    ressources: RESSOURCES.length,
    veille: (await listerNumeros()).length,
    outils: OUTILS.length,
  };
}
