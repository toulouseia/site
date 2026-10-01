import "server-only";

import type {
  MesuresProjets,
  Numero,
  Outil,
  Personne,
  Projet,
  ProjetComplet,
  ReponseAgent,
  Ressource,
  Seance,
} from "@/serveur/domaine/club";
import { obtenirDepots } from "@/serveur/contexte";
import { compterAcademy } from "./academy";

// ─────────────────────────────────────────────────────────────────────────────
// Les cas d'usage des trois autres écrans. C'est l'ancien `donnees/api.ts`,
// déplacé sous la même architecture que l'Academy : il passe par les dépôts au
// lieu d'importer les tableaux, et rien d'autre n'a changé.
// ─────────────────────────────────────────────────────────────────────────────

const parMajDecroissante = (a: Projet, b: Projet) => b.maj.localeCompare(a.maj);

function joindre(projet: Projet, personnes: Personne[]): ProjetComplet {
  const porteur =
    personnes.find((p) => p.id === projet.porteurId) ?? personnes[0];
  return { ...projet, porteur };
}

export async function listerProjets(): Promise<ProjetComplet[]> {
  const { projets } = obtenirDepots();
  const [liste, personnes] = await Promise.all([
    projets.lister(),
    projets.listerPersonnes(),
  ]);
  return [...liste]
    .sort(parMajDecroissante)
    .map((p) => joindre(p, personnes));
}

export async function obtenirProjet(
  slug: string,
): Promise<ProjetComplet | null> {
  const { projets } = obtenirDepots();
  const [projet, personnes] = await Promise.all([
    projets.obtenir(slug),
    projets.listerPersonnes(),
  ]);
  return projet ? joindre(projet, personnes) : null;
}

export async function listerSlugsProjets(): Promise<string[]> {
  return obtenirDepots().projets.listerSlugs();
}

export async function mesurerProjets(): Promise<MesuresProjets> {
  const tous = await obtenirDepots().projets.lister();
  const actifs = tous.filter((p) => !p.enPause);
  const places = tous.reduce((n, p) => n + (p.enPause ? 0 : p.places.length), 0);

  const parEtat: Record<string, number> = {
    idee: 0,
    chantier: 0,
    essai: 0,
    service: 0,
  };
  for (const p of tous) parEtat[p.etat] += 1;

  const poles = ["Agentic", "ModIA", "Embedded", "Hackathon"];
  const parPole = poles.map((pole) => ({
    pole,
    total: tous.filter((p) => p.pole === pole).length,
    places: tous
      .filter((p) => p.pole === pole && !p.enPause)
      .reduce((n, p) => n + p.places.length, 0),
  }));

  return {
    total: tous.length,
    cherchent: actifs.filter((p) => p.places.length > 0).length,
    places,
    parEtat,
    parPole,
    parCategorie: {
      open: tous.filter((p) => p.categorie === "open").length,
      business: tous.filter((p) => p.categorie === "business").length,
    },
    dernierDepot: [...tous].sort((a, b) => b.debut.localeCompare(a.debut))[0]
      .debut,
    recents: [...tous]
      .sort(parMajDecroissante)
      .slice(0, 4)
      .map((p) => ({
        slug: p.slug,
        nom: p.nom,
        maj: p.maj,
        places: p.enPause ? 0 : p.places.length,
      })),
  };
}

export async function listerRessources(): Promise<Ressource[]> {
  return obtenirDepots().ressources.lister();
}

export async function listerSeances(): Promise<Seance[]> {
  const seances = await obtenirDepots().ressources.listerSeances();
  return [...seances].sort((a, b) => a.date.localeCompare(b.date));
}

export async function listerNumeros(): Promise<Numero[]> {
  const numeros = await obtenirDepots().veille.lister();
  return [...numeros].sort((a, b) => b.numero - a.numero);
}

export async function listerOutils(): Promise<Outil[]> {
  return obtenirDepots().outils.lister();
}

export async function listerReponsesAgent(): Promise<ReponseAgent[]> {
  return obtenirDepots().outils.listerReponsesAgent();
}

/**
 * Les compteurs du rail de navigation. L'Academy y compte ses COURS, pas ses
 * ressources : c'est ce que le mot « Academy » promet, et c'est le nombre qui
 * change quand le club travaille.
 */
export async function compterTout(): Promise<Record<string, number>> {
  const { projets, veille, outils } = obtenirDepots();
  const [listeProjets, numeros, listeOutils, academy] = await Promise.all([
    projets.lister(),
    veille.lister(),
    outils.lister(),
    compterAcademy(),
  ]);
  return {
    projets: listeProjets.length,
    academy: academy.cours,
    veille: numeros.length,
    outils: listeOutils.length,
  };
}
