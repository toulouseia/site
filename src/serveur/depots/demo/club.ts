// Les dépôts de démonstration des trois écrans hors Academy. Ils lisent des
// tableaux en mémoire ; le jour où une base existe, seul ce fichier est doublé.

import type {
  DepotOutils,
  DepotProjets,
  DepotRessources,
  DepotVeille,
} from "@/serveur/ports";
import { PERSONNES } from "./club/personnes";
import { PROJETS } from "./club/projets";
import { RESSOURCES, SEANCES } from "./club/ressources";
import { NUMEROS } from "./club/veille";
import { OUTILS, REPONSES_AGENT } from "./club/outils";

export const projetsDemo: DepotProjets = {
  async lister() {
    return PROJETS;
  },
  async obtenir(slug) {
    return PROJETS.find((p) => p.slug === slug) ?? null;
  },
  async listerSlugs() {
    return PROJETS.map((p) => p.slug);
  },
  async listerPersonnes() {
    return PERSONNES;
  },
};

export const ressourcesDemo: DepotRessources = {
  async lister() {
    return RESSOURCES;
  },
  async obtenir(id) {
    return RESSOURCES.find((r) => r.id === id) ?? null;
  },
  async listerSeances() {
    return SEANCES;
  },
};

export const veilleDemo: DepotVeille = {
  async lister() {
    return NUMEROS;
  },
};

export const outilsDemo: DepotOutils = {
  async lister() {
    return OUTILS;
  },
  async listerReponsesAgent() {
    return REPONSES_AGENT;
  },
};
