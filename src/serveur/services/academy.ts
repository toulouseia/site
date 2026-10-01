import "server-only";

import type {
  ChapitreComplet,
  Cours,
  CoursComplet,
  Lecon,
  LeconComplete,
  ParcoursAvecLecons,
  ParcoursComplet,
  Trouvaille,
} from "@/serveur/domaine/academy";
import type { EtatAnimation } from "@/serveur/domaine/animations";
import type { Ressource } from "@/serveur/domaine/club";
import type { Statut } from "@/serveur/domaine/commun";
import { STATUTS_VISIBLES, echec, reussite } from "@/serveur/domaine/commun";
import type { Resultat } from "@/serveur/domaine/commun";
import { leconsAPlat } from "@/serveur/domaine/progression";
import { peut, type Visiteur } from "@/serveur/domaine/visiteur";
import { obtenirDepots } from "@/serveur/contexte";
import { aplatir } from "@/lib/format";
import { visiteurCourant } from "./session";

// ─────────────────────────────────────────────────────────────────────────────
// LES CAS D'USAGE DE L'ACADEMY.
//
// C'est la seule surface que les écrans appellent. Elle a trois responsabilités
// que les dépôts n'ont pas :
//
//   1. LES DROITS. Le dépôt rend tout ; le service ne rend que ce que ce
//      visiteur a le droit de voir. Un dépôt qui filtre selon les droits est
//      un dépôt qu'on ne peut plus réutiliser ni tester.
//   2. L'ASSEMBLAGE. Un cours plus son sommaire plus ses auteurs, en une seule
//      forme, obtenue en parallèle plutôt qu'en cascade.
//   3. LES REFUS. Un service ne lance pas d'exception pour un refus attendu :
//      il renvoie un `Resultat`, et l'appelant décide s'il affiche une page 404
//      ou un encart.
// ─────────────────────────────────────────────────────────────────────────────

/** Les statuts visibles par ce visiteur. Un rédacteur voit ses brouillons. */
function statutsVisibles(visiteur: Visiteur): readonly Statut[] {
  return peut(visiteur, "voir:brouillon")
    ? (["brouillon", "annonce", "publie", "archive"] as const)
    : STATUTS_VISIBLES;
}

// ── Le catalogue ────────────────────────────────────────────────────────────

/**
 * Le catalogue entier : les parcours, chacun avec ses cours résolus. C'est ce
 * qui nourrit l'accueil de l'Academy. Une seule fonction plutôt qu'une par
 * niveau, parce qu'un catalogue se lit d'un bloc, et parce que la cascade
 * « lister les parcours, puis pour chacun lister les cours » est exactement la
 * requête N+1 qu'on ne veut pas apprendre à écrire.
 */
export async function catalogue(): Promise<ParcoursComplet[]> {
  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();
  const statuts = statutsVisibles(visiteur);

  const [parcours, cours] = await Promise.all([
    depot.listerParcours({ statuts }),
    depot.listerCours({ statuts }),
  ]);

  return parcours.map((p) => {
    const siens = cours
      .filter((c) => c.parcoursId === p.id)
      .sort((a, b) => a.rang - b.rang);
    return {
      ...p,
      cours: siens,
      minutes: siens.reduce((n, c) => n + c.minutes, 0),
      nbLecons: siens.reduce((n, c) => n + c.nbLecons, 0),
    };
  });
}

/**
 * Le catalogue, chaque cours accompagné de ses leçons. C'est ce que l'accueil
 * de l'Academy envoie au navigateur : il lui faut les leçons pour calculer
 * l'avancement et savoir où reprendre, et il ne peut pas les demander cours
 * par cours sans faire douze allers-retours.
 */
export async function catalogueComplet(): Promise<ParcoursAvecLecons[]> {
  const { catalogue: depot } = obtenirDepots();
  const parcours = await catalogue();

  const avecLecons = await Promise.all(
    parcours.flatMap((p) => p.cours).map(
      async (c) => [c.id, await depot.listerLecons(c.id)] as const,
    ),
  );
  const table = new Map(avecLecons);

  return parcours.map((p) => ({
    ...p,
    cours: p.cours.map((c) => ({ ...c, lecons: table.get(c.id) ?? [] })),
  }));
}

export async function obtenirParcours(
  slug: string,
): Promise<Resultat<ParcoursComplet>> {
  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();
  const parcours = await depot.obtenirParcours(slug);

  if (!parcours) return echec("introuvable", "Ce parcours n'existe pas.");
  if (!statutsVisibles(visiteur).includes(parcours.statut)) {
    return echec("introuvable", "Ce parcours n'existe pas.");
  }

  const cours = await depot.listerCours({
    parcoursId: parcours.id,
    statuts: statutsVisibles(visiteur),
  });

  return reussite({
    ...parcours,
    cours,
    minutes: cours.reduce((n, c) => n + c.minutes, 0),
    nbLecons: cours.reduce((n, c) => n + c.nbLecons, 0),
  });
}

/** Tous les cours visibles, à plat. Sert au catalogue filtrable. */
export async function listerCours(options?: {
  recherche?: string;
  parcoursSlug?: string;
}): Promise<Cours[]> {
  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();

  let parcoursId: string | undefined;
  if (options?.parcoursSlug) {
    const p = await depot.obtenirParcours(options.parcoursSlug);
    if (!p) return [];
    parcoursId = p.id;
  }

  return depot.listerCours({
    statuts: statutsVisibles(visiteur),
    recherche: options?.recherche,
    parcoursId,
  });
}

// ── Un cours ────────────────────────────────────────────────────────────────

/**
 * Un cours et tout ce qu'il faut pour l'afficher : son parcours, son sommaire
 * complet, ses auteurs. Les quatre lectures partent ensemble.
 */
export async function obtenirCours(
  slug: string,
): Promise<Resultat<CoursComplet>> {
  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();

  const cours = await depot.obtenirCours(slug);
  if (!cours) return echec("introuvable", "Ce cours n'existe pas.");
  if (!statutsVisibles(visiteur).includes(cours.statut)) {
    return echec("introuvable", "Ce cours n'existe pas.");
  }

  const [parcours, chapitres, lecons, auteurs] = await Promise.all([
    depot.obtenirParcoursParId(cours.parcoursId),
    depot.listerChapitres(cours.id),
    depot.listerLecons(cours.id),
    depot.listerAuteurs(cours.auteurIds),
  ]);

  const sommaire: ChapitreComplet[] = chapitres.map((chapitre) => {
    const siennes = lecons
      .filter((l) => l.chapitreId === chapitre.id)
      .sort((a, b) => a.rang - b.rang);
    return {
      ...chapitre,
      lecons: siennes,
      minutes: siennes
        .filter((l) => l.statut === "publie")
        .reduce((n, l) => n + l.minutes, 0),
    };
  });

  return reussite({
    ...cours,
    parcours: parcours
      ? { id: parcours.id, slug: parcours.slug, nom: parcours.nom }
      : { id: cours.parcoursId, slug: "", nom: "" },
    sommaire,
    auteurs,
  });
}

/** Les leçons d'un cours, à plat, dans l'ordre. Sert aux calculs d'avancement. */
export async function listerLeconsDuCours(coursId: string): Promise<Lecon[]> {
  const { catalogue: depot } = obtenirDepots();
  const [chapitres, lecons] = await Promise.all([
    depot.listerChapitres(coursId),
    depot.listerLecons(coursId),
  ]);
  return leconsAPlat(
    chapitres.map((c) => ({
      ...c,
      lecons: lecons.filter((l) => l.chapitreId === c.id),
    })),
  );
}

// ── Une leçon ───────────────────────────────────────────────────────────────

/**
 * Une leçon, ses blocs, et ses deux voisines. Le refus d'une leçon non publiée
 * est un `interdit`, pas un `introuvable` : la leçon existe, elle figure au
 * sommaire, elle n'est simplement pas encore ouvrable. Confondre les deux
 * ferait afficher « adresse inconnue » sur un lien qu'on vient de montrer.
 */
export async function obtenirLecon(
  coursSlug: string,
  leconSlug: string,
): Promise<Resultat<LeconComplete>> {
  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();

  const cours = await depot.obtenirCours(coursSlug);
  if (!cours) return echec("introuvable", "Ce cours n'existe pas.");

  const lecon = await depot.obtenirLecon(coursSlug, leconSlug);
  if (!lecon) return echec("introuvable", "Cette leçon n'existe pas.");

  if (!peut(visiteur, "voir:lecon", { statut: lecon.statut })) {
    return echec(
      "interdit",
      lecon.statut === "annonce"
        ? "Cette leçon est annoncée mais pas encore écrite."
        : "Cette leçon n'est pas ouverte.",
    );
  }

  const [chapitres, toutes, blocs] = await Promise.all([
    depot.listerChapitres(cours.id),
    depot.listerLecons(cours.id),
    depot.obtenirBlocs(lecon.id),
  ]);

  const chapitre = chapitres.find((c) => c.id === lecon.chapitreId);
  const ordre = leconsAPlat(
    chapitres.map((c) => ({
      ...c,
      lecons: toutes.filter((l) => l.chapitreId === c.id),
    })),
  );

  // La navigation saute ce qui n'est pas ouvrable : « suivante » doit mener
  // quelque part.
  const ouvrables = ordre.filter((l) => l.statut === "publie");
  const i = ouvrables.findIndex((l) => l.id === lecon.id);

  const voisine = (l: Lecon | undefined) =>
    l ? { slug: l.slug, titre: l.titre } : null;

  return reussite({
    ...lecon,
    blocs,
    cours: { id: cours.id, slug: cours.slug, nom: cours.nom },
    chapitre: chapitre
      ? {
          id: chapitre.id,
          slug: chapitre.slug,
          titre: chapitre.titre,
          rang: chapitre.rang,
        }
      : { id: lecon.chapitreId, slug: "", titre: "", rang: 0 },
    precedente: voisine(i > 0 ? ouvrables[i - 1] : undefined),
    suivante: voisine(i >= 0 ? ouvrables[i + 1] : undefined),
    position: { rang: i + 1, total: ouvrables.length },
  });
}

/** Les adresses à prérendre. */
export async function listerCheminsLecons() {
  return obtenirDepots().catalogue.listerChemins();
}

export async function listerSlugsCours(): Promise<string[]> {
  const cours = await obtenirDepots().catalogue.listerCours({
    statuts: STATUTS_VISIBLES,
  });
  return cours.map((c) => c.slug);
}

export async function listerSlugsParcours(): Promise<string[]> {
  const parcours = await obtenirDepots().catalogue.listerParcours({
    statuts: STATUTS_VISIBLES,
  });
  return parcours.map((p) => p.slug);
}

// ── Les animations ──────────────────────────────────────────────────────────

/**
 * Résout les animations dont une leçon a besoin, en une seule fois. La page
 * les passe ensuite aux blocs : un bloc ne va jamais chercher sa donnée
 * lui-même, sinon une leçon à six animations fait six lectures en cascade.
 */
export async function animationsDeLaLecon(
  lecon: LeconComplete,
): Promise<Record<string, EtatAnimation>> {
  const ids = lecon.blocs
    .filter((b) => b.type === "animation")
    .map((b) => b.animationId);
  if (ids.length === 0) return {};

  const { animations } = obtenirDepots();
  const trouvees = await Promise.all(
    [...new Set(ids)].map(async (id) => [id, await animations.obtenir(id)] as const),
  );

  const table: Record<string, EtatAnimation> = {};
  for (const [id, etat] of trouvees) if (etat) table[id] = etat;
  return table;
}

/**
 * Résout les ressources du fonds citées par une leçon, en une seule lecture.
 * Même règle que pour les animations : c'est la page qui résout, pas le bloc.
 */
export async function ressourcesDeLaLecon(
  lecon: LeconComplete,
): Promise<Record<string, Ressource>> {
  const ids = lecon.blocs
    .filter((b) => b.type === "ressource")
    .map((b) => b.ressourceId);
  if (ids.length === 0) return {};

  const toutes = await obtenirDepots().ressources.lister();
  const table: Record<string, Ressource> = {};
  for (const r of toutes) if (ids.includes(r.id)) table[r.id] = r;
  return table;
}

// ── La recherche ────────────────────────────────────────────────────────────

/**
 * Une recherche qui traverse les trois niveaux. Volontairement simple : un
 * `includes` sur du texte aplati. Le jour où le catalogue dépassera quelques
 * centaines d'entrées, cette fonction deviendra une requête plein texte, et
 * sa signature ne bougera pas.
 */
export async function chercher(question: string): Promise<Trouvaille[]> {
  const mots = aplatir(question.trim());
  if (mots.length < 2) return [];

  const { catalogue: depot } = obtenirDepots();
  const visiteur = await visiteurCourant();
  const statuts = statutsVisibles(visiteur);

  const [parcours, cours] = await Promise.all([
    depot.listerParcours({ statuts }),
    depot.listerCours({ statuts }),
  ]);

  const trouvailles: Trouvaille[] = [];

  for (const p of parcours) {
    if (aplatir(`${p.nom} ${p.resume}`).includes(mots)) {
      trouvailles.push({ genre: "parcours", parcours: p });
    }
  }
  for (const c of cours) {
    if (aplatir(`${c.nom} ${c.resume} ${c.presentation}`).includes(mots)) {
      trouvailles.push({ genre: "cours", cours: c });
    }
  }

  const parCours = await Promise.all(
    cours.map(async (c) => [c, await depot.listerLecons(c.id)] as const),
  );
  for (const [c, lecons] of parCours) {
    for (const l of lecons) {
      if (l.statut !== "publie") continue;
      if (aplatir(`${l.titre} ${l.resume}`).includes(mots)) {
        trouvailles.push({
          genre: "lecon",
          lecon: l,
          coursSlug: c.slug,
          coursNom: c.nom,
        });
      }
    }
  }

  return trouvailles;
}

/** Le compteur du rail : ce que l'Academy contient d'ouvrable. */
export async function compterAcademy(): Promise<{
  parcours: number;
  cours: number;
  coursOuverts: number;
  lecons: number;
  minutes: number;
}> {
  const parcours = await catalogue();
  const cours = parcours.flatMap((p) => p.cours);
  return {
    parcours: parcours.length,
    cours: cours.length,
    coursOuverts: cours.filter((c) => c.statut === "publie").length,
    lecons: cours.reduce((n, c) => n + c.nbLecons, 0),
    minutes: cours.reduce((n, c) => n + c.minutes, 0),
  };
}
