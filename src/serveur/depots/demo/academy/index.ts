// ─────────────────────────────────────────────────────────────────────────────
// Le dépôt de catalogue de démonstration.
//
// Il lit des tableaux en mémoire. Son intérêt n'est pas là : il est dans le
// fait qu'il implémente `DepotCatalogue` en entier, y compris ce qu'aucun
// écran n'utilise encore. Le jour où `depots/prisma/catalogue.ts` existera,
// il aura exactement la même surface, et ce fichier restera, pour les tests
// et pour le développement hors ligne.
//
// Les champs dérivés sont calculés ici, une fois, au premier accès. C'est ce
// que ferait une vue SQL ; c'est ce que fera une requête d'agrégation. Les
// données source ne les portent pas — et depuis le 13 septembre 2026 elles ne
// PEUVENT plus les porter : `sommaires.ts` n'a plus de champ `minutes`.
//
//   la durée d'une leçon    ←  ses blocs, par `minutesDeLaLecon`
//   la durée d'un chapitre  ←  la somme de ses leçons publiées, dans le service
//   la durée d'un cours     ←  la somme de ses leçons publiées
//
// POURQUOI LA DÉRIVATION EST DEVENUE ASYNCHRONE. Le compte d'une leçon inclut
// la durée des animations qu'elle sert, et cette durée vit dans le manifeste,
// donc sur le disque, donc derrière une lecture. Le résultat est mémorisé pour
// la vie du processus : un manifeste neuf demande un redémarrage, la même
// granularité que le dépôt d'animations qui le sert.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Auteur,
  Chapitre,
  Cours,
  IdCours,
  IdLecon,
  IdParcours,
  Lecon,
  Parcours,
} from "@/serveur/domaine/academy";
import type { Bloc } from "@/serveur/domaine/blocs";
import type { Niveau, Statut } from "@/serveur/domaine/commun";
import { STATUTS_VISIBLES } from "@/serveur/domaine/commun";
import { minutesDeLaLecon } from "@/serveur/domaine/duree";
import type { DepotCatalogue, FiltreCatalogue } from "@/serveur/ports";
import { aplatir } from "@/lib/format";
import { animationsDemo } from "../animations";
import { AUTEURS } from "./auteurs";
import { CONTENU_CALCUL } from "./contenu/calcul";
import { CONTENU_DESCENTE } from "./contenu/descente";
import { CONTENU_OPTIMISATION } from "./contenu/optimisation";
import { CONTENU_PANORAMA } from "./contenu/panorama";
import { CONTENU_OPTIMISATION_SUITE } from "./contenu/optimisation-suite";
import { CONTENU_RESEAU } from "./contenu/reseau";
import { CONTENU_RETROPROPAGATION } from "./contenu/retropropagation";
import { COURS } from "./cours";
import { PARCOURS } from "./parcours";
import { CHAPITRES, LECONS } from "./sommaires";

// Dans l'ordre d'écriture : les six chapitres existants. Les espaces
// d'identifiants sont disjoints (l-pano-*, l-res-*, l-desc-*, l-retro-*,
// l-calc-*, l-optim-*), aucun étalement n'en écrase donc un autre.
const CONTENU: Record<string, Bloc[]> = {
  ...CONTENU_PANORAMA,
  ...CONTENU_RESEAU,
  ...CONTENU_DESCENTE,
  ...CONTENU_RETROPROPAGATION,
  ...CONTENU_CALCUL,
  ...CONTENU_OPTIMISATION,
  ...CONTENU_OPTIMISATION_SUITE,
};

// ── Les champs dérivés ──────────────────────────────────────────────────────

type Derive = {
  lecons: Lecon[];
  cours: Cours[];
  parId: Map<string, Cours>;
  parSlug: Map<string, Cours>;
};

/**
 * Les secondes de chaque animation RENDUE. Une animation seulement déclarée
 * n'y figure pas : la page n'en montre pas la vidéo, elle montre le cadre qui
 * dit qu'elle manque, et ce cadre ne coûte pas de temps à l'étudiant.
 */
async function secondesDesAnimations(): Promise<Map<string, number>> {
  const table = new Map<string, number>();
  for (const etat of await animationsDemo.lister()) {
    if (etat.rendue) table.set(etat.animation.id, etat.animation.duree);
  }
  return table;
}

/**
 * Une leçon ne compte dans les totaux d'un cours que si elle est publiée. Un
 * cours qui annoncerait « 8 leçons · 2 h » alors que trois seulement sont
 * ouvrables ferait une promesse qu'il ne tient pas ; il annonce donc ce qui est
 * prêt, et le sommaire montre le reste comme à paraître.
 */
async function construire(): Promise<Derive> {
  const secondes = await secondesDesAnimations();
  const dureeAnimation = (id: string) => secondes.get(id) ?? 0;

  const lecons: Lecon[] = LECONS.map((lecon) => ({
    ...lecon,
    minutes: minutesDeLaLecon(CONTENU[lecon.id] ?? [], dureeAnimation),
  }));

  const cours: Cours[] = COURS.map((c) => {
    const siennes = lecons.filter(
      (l) => l.coursId === c.id && l.statut === "publie",
    );
    return {
      ...c,
      minutes: siennes.reduce((n, l) => n + l.minutes, 0),
      nbLecons: siennes.length,
      nbChapitres: new Set(siennes.map((l) => l.chapitreId)).size,
    };
  });

  return {
    lecons,
    cours,
    parId: new Map(cours.map((c) => [c.id, c])),
    parSlug: new Map(cours.map((c) => [c.slug, c])),
  };
}

let memoire: Promise<Derive> | null = null;

function derive(): Promise<Derive> {
  memoire ??= construire();
  return memoire;
}

// ── Les filtres ─────────────────────────────────────────────────────────────

function passeFiltre(
  objet: { statut: Statut; niveau: Niveau },
  filtre: FiltreCatalogue | undefined,
  foin: string,
) {
  const statuts = filtre?.statuts ?? STATUTS_VISIBLES;
  if (!statuts.includes(objet.statut)) return false;
  if (filtre?.niveau && objet.niveau !== filtre.niveau) return false;
  if (filtre?.recherche && !aplatir(foin).includes(aplatir(filtre.recherche))) {
    return false;
  }
  return true;
}

// ── Le dépôt ────────────────────────────────────────────────────────────────

export const catalogueDemo: DepotCatalogue = {
  async listerParcours(filtre) {
    return PARCOURS.filter((p) =>
      passeFiltre(p, filtre, `${p.nom} ${p.resume} ${p.presentation}`),
    ).sort((a, b) => a.rang - b.rang);
  },

  async obtenirParcours(slug: string): Promise<Parcours | null> {
    return PARCOURS.find((p) => p.slug === slug) ?? null;
  },

  async obtenirParcoursParId(id: IdParcours): Promise<Parcours | null> {
    return PARCOURS.find((p) => p.id === id) ?? null;
  },

  async listerCours(filtre) {
    const { cours } = await derive();
    return cours
      .filter((c) => {
        if (filtre?.parcoursId && c.parcoursId !== filtre.parcoursId) {
          return false;
        }
        return passeFiltre(c, filtre, `${c.nom} ${c.resume} ${c.presentation}`);
      })
      .sort((a, b) => a.rang - b.rang);
  },

  async obtenirCours(slug: string) {
    return (await derive()).parSlug.get(slug) ?? null;
  },

  async obtenirCoursParId(id: IdCours) {
    return (await derive()).parId.get(id) ?? null;
  },

  async listerChapitres(coursId: IdCours): Promise<Chapitre[]> {
    return CHAPITRES.filter((c) => c.coursId === coursId).sort(
      (a, b) => a.rang - b.rang,
    );
  },

  async listerLecons(coursId: IdCours): Promise<Lecon[]> {
    // Toutes les leçons, y compris celles à paraître : le sommaire montre le
    // plan entier. C'est le service qui décide de ce qui s'ouvre.
    const { lecons } = await derive();
    return lecons
      .filter((l) => l.coursId === coursId)
      .sort((a, b) => a.rang - b.rang);
  },

  async obtenirLecon(coursSlug: string, leconSlug: string) {
    const { lecons, parSlug } = await derive();
    const cours = parSlug.get(coursSlug);
    if (!cours) return null;
    return (
      lecons.find((l) => l.coursId === cours.id && l.slug === leconSlug) ?? null
    );
  },

  async obtenirBlocs(leconId: IdLecon): Promise<Bloc[]> {
    return CONTENU[leconId] ?? [];
  },

  async listerChemins() {
    // Toutes les leçons qui FIGURENT à un sommaire, y compris celles qui ne
    // sont qu'annoncées : leur adresse existe, elle mène à une page qui
    // explique qu'elle reste à écrire. Les exclure d'ici ferait répondre
    // « adresse inconnue » à un lien qu'on vient de montrer.
    const { lecons, parId } = await derive();
    const chemins: { coursSlug: string; leconSlug: string }[] = [];
    for (const lecon of lecons) {
      if (lecon.statut === "brouillon" || lecon.statut === "archive") continue;
      const cours = parId.get(lecon.coursId);
      if (!cours || cours.statut === "brouillon") continue;
      chemins.push({ coursSlug: cours.slug, leconSlug: lecon.slug });
    }
    return chemins;
  },

  async listerAuteurs(ids: readonly string[]): Promise<Auteur[]> {
    return AUTEURS.filter((a) => ids.includes(a.id));
  },
};
