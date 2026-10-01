// ─────────────────────────────────────────────────────────────────────────────
// Les projets : déposer pour de vrai.
//
// Six adresses. Trois se lisent sans être connecté — le mur public, un projet
// par son nom court — ou avec (« les miens ») ; trois écrivent, et il faut
// être connecté : déposer, modifier, supprimer. Le porteur touche à ses
// projets ; le bureau touche à tous.
//
// Ce qui entre est filtré par une liste blanche : le vocabulaire de `Projet`
// (`src/donnees/types.ts`), et rien d'autre. L'identifiant, le nom court, le
// porteur, la publication, la relecture ne s'écrivent jamais depuis un corps
// de requête — ils sont calculés ici ou posés par le bureau, ailleurs.
//
// Un projet est public dès son dépôt (`publication = 'publie'`), décision du
// 15 septembre 2026 (migrations/0002_contacts.sql). La colonne reste : le
// bureau peut retirer un projet, et la ligne garde sa trace.
//
// Le mur public est mis en cache soixante secondes, dans le cache de
// Cloudflare (`caches.default`), et ce cache est vidé à chaque écriture : un
// dépôt paraît tout de suite, et cent visiteurs dans la minute ne coûtent
// qu'une lecture de base.
// ─────────────────────────────────────────────────────────────────────────────

import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { Accueil, Categorie, Contact, Etat, Membre, Pole, Projet } from "../src/donnees/types";
import { listerSlugsProjets } from "../src/donnees/api";
import type { Environnement } from "./environnement";
import { cleDuMur, viderLeMur } from "./cache";
import { journaliser } from "./journal";
import { lireContacts, type Refus } from "./profil";
import { lireSession, NOM_TEMOIN, tirerIdentifiant, type Personne } from "./session";

type Ctx = Context<{ Bindings: Environnement }>;

// ── Le vocabulaire ──────────────────────────────────────────────────────────

const CATEGORIES: readonly Categorie[] = ["open", "business"];
const POLES: readonly Pole[] = ["Agentic", "ModIA", "Embedded", "Hackathon"];
const ETATS: readonly Etat[] = ["idee", "chantier", "essai", "service"];
const ACCUEILS: readonly Accueil[] = ["ouvert", "complet"];

/** `proprietaire/nom`, tel que GitHub l'écrit. Rien d'autre n'entre en base. */
const FORME_DEPOT = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

const NOM_MAX = 60;
const RESUME_MAX = 90;
const PRESENTATION_MAX = 400;
const MODELE_MAX = 400;
const OUTILS_MAX = 10;
const OUTIL_MAX = 30;
const SLUG_MAX = 40;

// ── La ligne de la base, et sa traduction ───────────────────────────────────

type Ligne = {
  id: string;
  slug: string;
  nom: string;
  resume: string;
  presentation: string;
  etat: Etat;
  en_pause: number;
  categorie: Categorie;
  pole: Pole;
  porteur_id: string;
  accueil: Accueil | null;
  depot: string | null;
  modele: string | null;
  outils: string;
  // La clé de l'objet R2, ou null. Jamais les octets : la base ne range qu'une
  // adresse, et c'est `versProjet` qui la traduit en URL servie.
  image: string | null;
  debut: string;
  maj: string;
  publication: "attente" | "publie" | "refuse";
  porteur_nom: string;
  porteur_origine: string | null;
  porteur_contacts: string | null;
};

/** La lecture, toujours la même : le projet avec son porteur, en une requête. */
const SELECTION = `
  SELECT pr.id, pr.slug, pr.nom, pr.resume, pr.presentation, pr.etat, pr.en_pause,
         pr.categorie, pr.pole, pr.porteur_id, pr.accueil, pr.depot, pr.modele,
         pr.outils, pr.image, pr.debut, pr.maj, pr.publication,
         pe.nom AS porteur_nom, pe.origine AS porteur_origine, pe.contacts AS porteur_contacts
    FROM projets pr JOIN personnes pe ON pe.id = pr.porteur_id`;

/** Ce que l'écran consomme : `Projet` et son porteur, les mêmes mots que le code. */
export type ProjetServi = Projet & {
  porteur: { id: string; nom: string; origine?: string; contacts: Contact[] };
  /**
   * Les membres participants. `versProjet` ne les pose pas — ce serait une
   * requête de plus à chaque ligne du mur, la route la plus lue. Ils sont
   * chargés à part, sur la fiche seulement (`lireParSlug`), et joints là.
   */
  membres?: Membre[];
};

function lireOutils(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Une empreinte courte et stable de la clé R2, pour le paramètre `?v=` de l'URL
 * d'image. Elle ne sert qu'à casser le cache du navigateur : au remplacement,
 * la clé change (sa part aléatoire), donc l'empreinte change, donc l'URL change
 * et l'ancienne image n'est plus resservie. Un simple hachage suffit — on ne
 * publie pas la clé brute, qui reste un détail interne au bucket.
 */
function empreinte(cle: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < cle.length; i++) {
    h ^= cle.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/**
 * L'URL par laquelle l'image d'un projet est servie : une route du Worker, pas
 * la clé brute et pas un fichier statique. C'est le Worker qui va chercher les
 * octets dans R2 (`servirImage`) à partir de l'identifiant du projet.
 */
function urlImage(id: string, cle: string): string {
  return `/api/projets/${id}/image?v=${empreinte(cle)}`;
}

function versProjet(l: Ligne): ProjetServi {
  return {
    id: l.id,
    slug: l.slug,
    nom: l.nom,
    resume: l.resume,
    presentation: l.presentation,
    etat: l.etat,
    enPause: l.en_pause === 1,
    categorie: l.categorie,
    pole: l.pole,
    porteurId: l.porteur_id,
    accueil: l.accueil ?? undefined,
    depot: l.depot ?? undefined,
    modele: l.modele ?? undefined,
    outils: lireOutils(l.outils),
    // Jamais la clé brute : l'écran reçoit une URL servie par le Worker, ou rien.
    image: l.image ? urlImage(l.id, l.image) : undefined,
    debut: l.debut,
    maj: l.maj,
    porteur: {
      id: l.porteur_id,
      nom: l.porteur_nom,
      origine: l.porteur_origine ?? undefined,
      // Les contacts du porteur sont publics — c'est leur raison d'être. Son
      // adresse de compte, elle, n'est pas dans la sélection, et n'y sera jamais.
      contacts: lireContacts(l.porteur_contacts),
    },
  };
}

/** Pour « les miens » : la même chose, avec l'état de publication. */
function versProjetMien(l: Ligne) {
  return { ...versProjet(l), publication: l.publication };
}

/**
 * Les membres participants d'un projet, joints à leur fiche de personne. On ne
 * lit que le public : le nom, l'origine, et le pseudo GitHub. Jamais `courriel`,
 * `google_id`, ni `github_id` (l'identifiant de compte) — c'est la même
 * discipline que `SELECTION` pour le porteur : les identifiants de compte ne
 * sont pas dans la requête, et ils n'y seront jamais. Rangés par ordre de
 * rattachement (les premiers membres d'abord).
 *
 * Une requête à part, appelée sur la fiche seulement (`lireParSlug`), jamais sur
 * le mur : c'est le nombre de lignes lues qui sature en premier chez Cloudflare.
 */
async function lireMembres(base: D1Database, projetId: string): Promise<Membre[]> {
  const { results } = await base
    .prepare(
      `SELECT pe.id, pe.nom, pe.origine, pe.github_pseudo
         FROM membres m JOIN personnes pe ON pe.id = m.personne_id
        WHERE m.projet_id = ?
        ORDER BY m.ajoute_le`,
    )
    .bind(projetId)
    .all<{ id: string; nom: string; origine: string | null; github_pseudo: string | null }>();
  return results.map((r) => ({
    id: r.id,
    nom: r.nom,
    origine: r.origine ?? undefined,
    github: r.github_pseudo ?? undefined,
  }));
}

// ── La validation ───────────────────────────────────────────────────────────

/** Un projet vérifié, prêt à écrire. `depot`/`modele` sont `null` quand ils n'ont pas cours. */
export type ProjetVerifie = {
  nom: string;
  resume: string;
  presentation: string;
  categorie: Categorie;
  pole: Pole;
  etat: Etat;
  enPause: boolean;
  accueil: Accueil | null;
  depot: string | null;
  modele: string | null;
  outils: string[];
};

/** Les seules clés lues dans un corps. Tout le reste est ignoré sans bruit. */
const CLES = [
  "nom",
  "resume",
  "presentation",
  "categorie",
  "pole",
  "etat",
  "enPause",
  "accueil",
  "depot",
  "modele",
  "outils",
] as const;
type Cle = (typeof CLES)[number];

function texte(v: unknown): string | null {
  return typeof v === "string" ? v.trim() : null;
}

/**
 * Vérifie un projet entier. À la création, `existant` est absent et tout doit
 * être là ; à la modification, le corps se pose sur l'existant et c'est
 * l'ensemble qui est vérifié — passer un projet à but lucratif en projet
 * ouvert sans lui donner de dépôt est refusé, comme le schéma le refuserait.
 *
 * Un seul refus à la fois, le champ nommé. Le vocabulaire fermé (catégorie,
 * pôle, avancement, accueil) se vérifie avant les textes : c'est le premier
 * chemin qui mène à une case qui n'existe pas.
 */
export function validerProjet(corps: unknown, existant?: ProjetVerifie): ProjetVerifie | Refus {
  if (!corps || typeof corps !== "object" || Array.isArray(corps)) {
    return { erreur: "le corps doit être un objet JSON", champ: "corps" };
  }
  const fourni = corps as Record<string, unknown>;
  const v: Partial<Record<Cle, unknown>> = existant ? { ...existant } : {};
  for (const cle of CLES) if (cle in fourni) v[cle] = fourni[cle];

  if (!CATEGORIES.includes(v.categorie as Categorie)) {
    return { erreur: "la catégorie est « open » ou « business »", champ: "categorie" };
  }
  const categorie = v.categorie as Categorie;
  if (!POLES.includes(v.pole as Pole)) {
    return { erreur: `le pôle est l'un de : ${POLES.join(", ")}`, champ: "pole" };
  }
  if (!ETATS.includes(v.etat as Etat)) {
    return { erreur: `l'avancement est l'un de : ${ETATS.join(", ")}`, champ: "etat" };
  }
  let accueil: Accueil | null = null;
  if (v.accueil !== undefined && v.accueil !== null && v.accueil !== "") {
    if (!ACCUEILS.includes(v.accueil as Accueil)) {
      return { erreur: "l'accueil est « ouvert », « complet », ou rien", champ: "accueil" };
    }
    accueil = v.accueil as Accueil;
  }
  if (v.enPause !== undefined && typeof v.enPause !== "boolean") {
    return { erreur: "enPause est vrai ou faux", champ: "enPause" };
  }

  const nom = texte(v.nom);
  if (nom === null || nom.length < 2) return { erreur: "le nom fait au moins 2 caractères", champ: "nom" };
  if (nom.length > NOM_MAX) return { erreur: `le nom dépasse ${NOM_MAX} caractères`, champ: "nom" };
  const resume = texte(v.resume);
  if (!resume) return { erreur: "le résumé est vide", champ: "resume" };
  if (resume.length > RESUME_MAX) return { erreur: `le résumé dépasse ${RESUME_MAX} caractères`, champ: "resume" };
  const presentation = texte(v.presentation);
  if (!presentation) return { erreur: "la présentation est vide", champ: "presentation" };
  if (presentation.length > PRESENTATION_MAX) {
    return { erreur: `la présentation dépasse ${PRESENTATION_MAX} caractères`, champ: "presentation" };
  }

  // Open : le dépôt, obligatoire, sous la forme `proprietaire/nom`. Business :
  // le dépôt est ignoré, et c'est le modèle de revenus qui a cours.
  let depot: string | null = null;
  let modele: string | null = null;
  if (categorie === "open") {
    const d = texte(v.depot);
    if (!d) return { erreur: "un projet ouvert a un dépôt public", champ: "depot" };
    if (!FORME_DEPOT.test(d)) {
      return { erreur: "le dépôt s'écrit proprietaire/nom, comme sur GitHub", champ: "depot" };
    }
    depot = d;
  } else {
    const m = v.modele === undefined || v.modele === null ? "" : texte(v.modele);
    if (m === null) return { erreur: "le modèle de revenus est un texte", champ: "modele" };
    if (m.length > MODELE_MAX) {
      return { erreur: `le modèle de revenus dépasse ${MODELE_MAX} caractères`, champ: "modele" };
    }
    modele = m || null;
  }

  const outils: string[] = [];
  if (v.outils !== undefined && v.outils !== null) {
    if (!Array.isArray(v.outils)) return { erreur: "les outils sont une liste de mots", champ: "outils" };
    if (v.outils.length > OUTILS_MAX) {
      return { erreur: `au plus ${OUTILS_MAX} outils`, champ: "outils" };
    }
    for (const o of v.outils) {
      const t = texte(o);
      if (!t) return { erreur: "un outil est un mot, pas un vide", champ: "outils" };
      if (t.length > OUTIL_MAX) return { erreur: `un outil dépasse ${OUTIL_MAX} caractères`, champ: "outils" };
      outils.push(t);
    }
  }

  return {
    nom,
    resume,
    presentation,
    categorie,
    pole: v.pole as Pole,
    etat: v.etat as Etat,
    enPause: v.enPause === true,
    accueil,
    depot,
    modele,
    outils,
  };
}

// ── Le nom court ────────────────────────────────────────────────────────────

/**
 * Le nom court dérivé du nom : minuscules, sans accents, des tirets entre les
 * mots, quarante caractères au plus. « Mon Projet d’Essai » → `mon-projet-d-essai`.
 */
export function slugDe(nom: string): string {
  const brut = nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    // Les ligatures que la décomposition ne sépare pas : « cœur » → `coeur`.
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return brut.slice(0, SLUG_MAX).replace(/-+$/g, "") || "projet";
}

/**
 * Un nom court qui n'existe encore nulle part : ni dans la base, ni parmi les
 * projets écrits dans le code, qui ont déjà leur page. En cas de collision on
 * ajoute `-2`, `-3`… et le suffixe tient dans la limite.
 */
export async function slugLibre(base: D1Database, nom: string): Promise<string> {
  const souche = slugDe(nom);
  // « miens » est une adresse du serveur (`GET /api/projets/miens`), enregistrée
  // avant `:slug` : un projet qui porterait ce nom court serait injoignable.
  const pris = new Set([...(await listerSlugsProjets()), "miens"]);
  for (let n = 1; n < 1000; n++) {
    const suffixe = n === 1 ? "" : `-${n}`;
    const candidat = souche.slice(0, SLUG_MAX - suffixe.length).replace(/-+$/g, "") + suffixe;
    if (pris.has(candidat)) continue;
    const existe = await base
      .prepare("SELECT 1 AS un FROM projets WHERE slug = ?")
      .bind(candidat)
      .first<{ un: number }>();
    if (!existe) return candidat;
  }
  return `${souche.slice(0, SLUG_MAX - 9)}-${tirerIdentifiant().slice(0, 8)}`;
}

// ── Qui peut écrire ─────────────────────────────────────────────────────────

async function personneConnectee(c: Ctx): Promise<Personne | null> {
  return lireSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
}

function peutToucher(personne: Personne, ligne: Ligne): boolean {
  return ligne.porteur_id === personne.id || personne.bureau === 1;
}

async function lireLigneParId(base: D1Database, id: string): Promise<Ligne | null> {
  return (await base.prepare(`${SELECTION} WHERE pr.id = ?`).bind(id).first<Ligne>()) ?? null;
}

async function lireCorps(c: Ctx): Promise<unknown | typeof CORPS_ILLISIBLE> {
  try {
    return await c.req.json();
  } catch {
    return CORPS_ILLISIBLE;
  }
}
const CORPS_ILLISIBLE = Symbol("corps illisible");

// ── Les six adresses ────────────────────────────────────────────────────────

/** `GET /api/projets` — le mur public : les projets publiés, les derniers mis à jour d'abord. */
export async function listerPublies(c: Ctx) {
  const cle = cleDuMur(c);
  let cache: Cache | null = null;
  try {
    cache = caches.default;
    const servi = await cache.match(cle);
    if (servi) {
      const r = new Response(servi.body, servi);
      r.headers.set("X-Source", "cache");
      return r;
    }
  } catch {
    cache = null;
  }
  const { results } = await c.env.BASE.prepare(
    `${SELECTION} WHERE pr.publication = 'publie' ORDER BY pr.maj DESC`,
  ).all<Ligne>();
  const reponse = c.json(
    { projets: results.map(versProjet) },
    200,
    { "Cache-Control": "public, max-age=60", "X-Source": "base" },
  );
  if (cache) await cache.put(cle, reponse.clone());
  return reponse;
}

/** `GET /api/projets/miens` — tous les miens, quelle que soit leur publication. */
export async function listerMiens(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté" }, 401);
  const { results } = await c.env.BASE.prepare(
    `${SELECTION} WHERE pr.porteur_id = ? ORDER BY pr.maj DESC`,
  )
    .bind(personne.id)
    .all<Ligne>();
  return c.json({ projets: results.map(versProjetMien) });
}

/** `GET /api/projets/:slug` — un projet publié, ou le mien même retiré. */
export async function lireParSlug(c: Ctx) {
  const ligne = await c.env.BASE.prepare(`${SELECTION} WHERE pr.slug = ?`)
    .bind(c.req.param("slug") ?? "")
    .first<Ligne>();
  if (!ligne) return c.json({ erreur: "projet inconnu" }, 404);
  // La fiche, et elle seule, porte les membres : une requête secondaire, sur
  // cette lecture-ci seulement. Le mur et « les miens » n'y touchent pas.
  const membres = await lireMembres(c.env.BASE, ligne.id);
  if (ligne.publication !== "publie") {
    const personne = await personneConnectee(c);
    if (!personne || !peutToucher(personne, ligne)) {
      return c.json({ erreur: "projet inconnu" }, 404);
    }
    return c.json({ projet: { ...versProjetMien(ligne), membres } });
  }
  return c.json({ projet: { ...versProjet(ligne), membres } });
}

/** `POST /api/projets` — déposer. Public dès l'enregistrement. */
export async function deposer(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté" }, 401);
  const corps = await lireCorps(c);
  if (corps === CORPS_ILLISIBLE) {
    return c.json({ erreur: "le corps n'est pas du JSON", champ: "corps" }, 400);
  }
  const p = validerProjet(corps);
  if ("erreur" in p) return c.json(p, 400);

  const id = tirerIdentifiant();
  const slug = await slugLibre(c.env.BASE, p.nom);
  const maintenant = new Date().toISOString();
  await c.env.BASE.prepare(
    `INSERT INTO projets (id, slug, nom, resume, presentation, etat, en_pause, categorie, pole,
                          porteur_id, accueil, depot, modele, outils, debut, maj, publication)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'publie')`,
  )
    .bind(
      id,
      slug,
      p.nom,
      p.resume,
      p.presentation,
      p.etat,
      p.enPause ? 1 : 0,
      p.categorie,
      p.pole,
      personne.id,
      p.accueil,
      p.depot,
      p.modele,
      JSON.stringify(p.outils),
      maintenant,
      maintenant,
    )
    .run();
  await journaliser(c.env.BASE, "depot", personne.id, id, { slug });
  await viderLeMur(c);
  const ligne = await lireLigneParId(c.env.BASE, id);
  return c.json({ projet: versProjetMien(ligne as Ligne) }, 201);
}

/** `PUT /api/projets/:id` — modifier, par le porteur ou le bureau. Le nom court ne bouge pas. */
export async function modifier(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu" }, 404);
  if (!peutToucher(personne, ligne)) return c.json({ erreur: "ce projet n'est pas le vôtre" }, 403);
  const corps = await lireCorps(c);
  if (corps === CORPS_ILLISIBLE) {
    return c.json({ erreur: "le corps n'est pas du JSON", champ: "corps" }, 400);
  }
  const avant: ProjetVerifie = {
    nom: ligne.nom,
    resume: ligne.resume,
    presentation: ligne.presentation,
    categorie: ligne.categorie,
    pole: ligne.pole,
    etat: ligne.etat,
    enPause: ligne.en_pause === 1,
    accueil: ligne.accueil,
    depot: ligne.depot,
    modele: ligne.modele,
    outils: lireOutils(ligne.outils),
  };
  const p = validerProjet(corps, avant);
  if ("erreur" in p) return c.json(p, 400);

  const maintenant = new Date().toISOString();
  await c.env.BASE.prepare(
    `UPDATE projets SET nom = ?, resume = ?, presentation = ?, etat = ?, en_pause = ?, categorie = ?,
                        pole = ?, accueil = ?, depot = ?, modele = ?, outils = ?, maj = ?
      WHERE id = ?`,
  )
    .bind(
      p.nom,
      p.resume,
      p.presentation,
      p.etat,
      p.enPause ? 1 : 0,
      p.categorie,
      p.pole,
      p.accueil,
      p.depot,
      p.modele,
      JSON.stringify(p.outils),
      maintenant,
      ligne.id,
    )
    .run();
  const champs = CLES.filter((cle) => JSON.stringify(avant[cle]) !== JSON.stringify(p[cle]));
  await journaliser(c.env.BASE, "modification", personne.id, ligne.id, { champs });
  await viderLeMur(c);
  const relue = await lireLigneParId(c.env.BASE, ligne.id);
  return c.json({ projet: versProjetMien(relue as Ligne) });
}

/** `DELETE /api/projets/:id` — supprimer, par le porteur ou le bureau. */
export async function supprimer(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu" }, 404);
  if (!peutToucher(personne, ligne)) return c.json({ erreur: "ce projet n'est pas le vôtre" }, 403);
  await c.env.BASE.prepare("DELETE FROM projets WHERE id = ?").bind(ligne.id).run();
  // Supprimer le projet emporte son image : sans ça, l'objet R2 resterait
  // orphelin, sans plus aucune ligne pour le désigner. La cascade de la base ne
  // touche pas le bucket, c'est au programme de le faire. Best-effort : la ligne
  // est déjà partie, un hoquet de R2 ne doit pas renvoyer une erreur pour une
  // suppression pourtant réussie — au pire un orphelin de quelques octets.
  if (ligne.image) {
    try {
      await c.env.IMAGES.delete(ligne.image);
    } catch {
      // Orphelin toléré : le projet est bien supprimé, c'est l'essentiel.
    }
  }
  await journaliser(c.env.BASE, "suppression", personne.id, ligne.id, {
    slug: ligne.slug,
    nom: ligne.nom,
  });
  await viderLeMur(c);
  return c.body(null, 204);
}

// ── L'image d'illustration ────────────────────────────────────────────────────
//
// Trois adresses de plus, greffées sur un projet. Le service est public — une
// image sur le mur se voit sans être connecté ; le téléversement et le retrait
// sont réservés au porteur ou au bureau, comme le reste des écritures.
//
// La base ne garde qu'une clé (`projets/<id>/<aléatoire>.<ext>`) ; les octets
// vivent dans le bucket R2 `IMAGES`. La part aléatoire de la clé sert de
// casse-cache : au remplacement, la nouvelle image a une nouvelle clé, donc une
// nouvelle URL, et l'ancienne n'est jamais resservie. L'ancien objet est
// détruit à chaque écriture — remplacement comme retrait — pour ne pas laisser
// d'orphelin dans le bucket.

/** Cinq mébioctets : au-delà, ce n'est plus une vignette de projet. */
const IMAGE_MAX = 5 * 1024 * 1024;

/**
 * Le vrai type d'un fichier, lu dans ses premiers octets — le nombre magique —
 * et pas dans l'en-tête `Content-Type`, qu'un client pose comme il veut. On
 * n'accepte que les trois formats de l'écran : PNG, JPEG, WebP. Renvoie le type
 * MIME et l'extension à ranger dans la clé, ou `null` si rien ne correspond.
 */
function reconnaitreImage(o: Uint8Array): { mime: string; ext: string } | null {
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    o.length >= 8 &&
    o[0] === 0x89 && o[1] === 0x50 && o[2] === 0x4e && o[3] === 0x47 &&
    o[4] === 0x0d && o[5] === 0x0a && o[6] === 0x1a && o[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }
  // JPEG : FF D8 FF
  if (o.length >= 3 && o[0] === 0xff && o[1] === 0xd8 && o[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  // WebP : "RIFF" …… "WEBP" (octets 0-3 et 8-11)
  if (
    o.length >= 12 &&
    o[0] === 0x52 && o[1] === 0x49 && o[2] === 0x46 && o[3] === 0x46 &&
    o[8] === 0x57 && o[9] === 0x45 && o[10] === 0x42 && o[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

/** `GET /api/projets/:id/image` — l'image d'un projet, servie depuis R2. Public. */
export async function servirImage(c: Ctx) {
  const id = c.req.param("id") ?? "";
  // Une lecture légère : on ne veut que la clé, pas la jointure complète du mur.
  const ligne = await c.env.BASE.prepare("SELECT image FROM projets WHERE id = ?")
    .bind(id)
    .first<{ image: string | null }>();
  if (!ligne || !ligne.image) return c.json({ erreur: "pas d'image", champ: "image" }, 404);
  const objet = await c.env.IMAGES.get(ligne.image);
  if (!objet) return c.json({ erreur: "pas d'image", champ: "image" }, 404);
  const entetes = new Headers();
  entetes.set("Content-Type", objet.httpMetadata?.contentType ?? "application/octet-stream");
  // L'URL porte l'empreinte de la clé (`?v=`) : elle change dès que l'image
  // change, donc on peut laisser le navigateur garder longtemps ce contenu-ci.
  entetes.set("Cache-Control", "public, max-age=31536000, immutable");
  entetes.set("ETag", objet.httpEtag);
  return new Response(objet.body, { headers: entetes });
}

/** `PUT /api/projets/:id/image` — téléverser ou remplacer l'image. Porteur ou bureau. */
export async function televerserImage(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté", champ: "image" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu", champ: "image" }, 404);
  if (!peutToucher(personne, ligne)) {
    return c.json({ erreur: "ce projet n'est pas le vôtre", champ: "image" }, 403);
  }

  const octets = new Uint8Array(await c.req.arrayBuffer());
  if (octets.byteLength === 0) {
    return c.json({ erreur: "aucun fichier reçu", champ: "image" }, 400);
  }
  if (octets.byteLength > IMAGE_MAX) {
    return c.json({ erreur: "l'image dépasse 5 Mio", champ: "image" }, 413);
  }
  const type = reconnaitreImage(octets);
  if (!type) {
    return c.json({ erreur: "l'image doit être un PNG, un JPEG ou un WebP", champ: "image" }, 400);
  }

  // La part aléatoire casse le cache : une nouvelle image a une nouvelle clé,
  // donc une nouvelle URL, et l'ancienne n'est jamais resservie.
  const cle = `projets/${ligne.id}/${tirerIdentifiant()}.${type.ext}`;
  await c.env.IMAGES.put(cle, octets, { httpMetadata: { contentType: type.mime } });
  await c.env.BASE.prepare("UPDATE projets SET image = ?, maj = ? WHERE id = ?")
    .bind(cle, new Date().toISOString(), ligne.id)
    .run();
  // L'ancien objet ne sert plus : le détruire évite l'orphelin dans le bucket.
  // Best-effort : la nouvelle image est déjà posée et référencée ; si R2 hoquette
  // sur l'effacement de l'ancienne, on ne renvoie pas une erreur pour un
  // remplacement pourtant réussi — au pire un orphelin, jamais une image absente.
  if (ligne.image) {
    try {
      await c.env.IMAGES.delete(ligne.image);
    } catch {
      // Orphelin toléré : la nouvelle image est en place, c'est l'essentiel.
    }
  }
  await journaliser(c.env.BASE, "modification", personne.id, ligne.id, { champs: ["image"] });
  await viderLeMur(c);
  const relue = await lireLigneParId(c.env.BASE, ligne.id);
  return c.json({ projet: versProjetMien(relue as Ligne) });
}

/** `DELETE /api/projets/:id/image` — retirer l'image. Porteur ou bureau. */
export async function retirerImage(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté", champ: "image" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu", champ: "image" }, 404);
  if (!peutToucher(personne, ligne)) {
    return c.json({ erreur: "ce projet n'est pas le vôtre", champ: "image" }, 403);
  }
  // Pas d'image : le retrait n'a rien à faire, et c'est un succès, pas une erreur.
  if (ligne.image) {
    await c.env.IMAGES.delete(ligne.image);
    await c.env.BASE.prepare("UPDATE projets SET image = NULL, maj = ? WHERE id = ?")
      .bind(new Date().toISOString(), ligne.id)
      .run();
    await journaliser(c.env.BASE, "modification", personne.id, ligne.id, { champs: ["image"] });
    await viderLeMur(c);
  }
  return c.body(null, 204);
}

// ── Les membres participants ──────────────────────────────────────────────────
//
// Deux adresses de plus, greffées sur un projet comme les routes image, avec la
// même autorisation `peutToucher` : seuls le porteur et le bureau ajoutent ou
// retirent un membre. Le membre, lui, n'obtient aucun droit — il apparaît sur la
// fiche, et c'est tout. `peutToucher` reste porteur-ou-bureau, inchangé.
//
// Un membre est une vraie fiche de `personnes`. Ajouter par pseudo GitHub crée
// un « pré-compte » au bon `github_id` : à la première connexion GitHub de cette
// personne, `trouverOuCreer` (session.ts, cas 1) la reconnaît par ce `github_id`
// et promeut sa fiche. Ajouter par nom crée un pré-compte sans identité de
// service — un nom qui paraît, rien de plus.
//
// Ces routes n'écrivent pas sur le mur (les membres ne s'y lisent pas), et la
// fiche (`lireParSlug`) n'est pas mise en cache : aucune purge à faire.

/**
 * Ce que l'API publique de GitHub dit d'un compte : l'identifiant numérique
 * (`github_id`), le login (`github_pseudo`) et le nom affiché. `"introuvable"`
 * pour un login qui n'existe pas (404), `"reseau"` pour tout le reste — GitHub
 * muet, quota épuisé, réponse illisible : dans ce cas on n'invente aucun
 * identifiant, on refuse et on laisse réessayer.
 */
type IdentiteGithub = { id: string; login: string; nom: string };

async function chercherGithub(login: string): Promise<IdentiteGithub | "introuvable" | "reseau"> {
  let reponse: Response;
  try {
    reponse = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: {
        // GitHub refuse une requête sans agent ; le sien identifie l'appelant.
        "user-agent": "toulouseia",
        accept: "application/vnd.github+json",
      },
    });
  } catch {
    return "reseau";
  }
  if (reponse.status === 404) return "introuvable";
  if (!reponse.ok) return "reseau";
  const j = (await reponse.json().catch(() => null)) as
    | { id?: number; login?: string; name?: string | null }
    | null;
  // L'identifiant numérique est ce qui compte : sans lui, pas de pré-compte
  // récupérable. Un corps sans `id` exploitable se traite comme une panne réseau.
  if (!j || typeof j.id !== "number" || typeof j.login !== "string" || !j.login) {
    return "reseau";
  }
  const nom = typeof j.name === "string" && j.name.trim() ? j.name.trim() : j.login;
  return { id: String(j.id), login: j.login, nom };
}

/**
 * Retrouve la personne derrière un pseudo GitHub, ou lui crée un pré-compte au
 * bon `github_id`. On cherche d'abord par `github_id` : une personne déjà connue
 * (déjà connectée, ou déjà membre ailleurs) n'est jamais dupliquée.
 */
async function personnePourGithub(
  base: D1Database,
  identite: IdentiteGithub,
): Promise<string> {
  const connue = await base
    .prepare("SELECT id FROM personnes WHERE github_id = ?")
    .bind(identite.id)
    .first<{ id: string }>();
  if (connue) return connue.id;
  const id = tirerIdentifiant();
  const maintenant = new Date().toISOString();
  await base
    .prepare(
      `INSERT INTO personnes (id, nom, github_id, github_pseudo, cree_le, vu_le)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, identite.nom, identite.id, identite.login, maintenant, maintenant)
    .run();
  return id;
}

/** Crée un pré-compte au seul nom donné, sans identité de service, et rend son id. */
async function personnePourNom(base: D1Database, nom: string): Promise<string> {
  const id = tirerIdentifiant();
  const maintenant = new Date().toISOString();
  await base
    .prepare("INSERT INTO personnes (id, nom, cree_le, vu_le) VALUES (?, ?, ?, ?)")
    .bind(id, nom, maintenant, maintenant)
    .run();
  return id;
}

/**
 * `POST /api/projets/:id/membres` — ajouter un membre. Porteur ou bureau.
 *
 * Corps `{ github?, nom? }`. Avec `github`, on résout le pseudo via l'API
 * publique GitHub et on crée (ou retrouve) un pré-compte au bon `github_id` ;
 * sinon `nom` crée un pré-compte au nom donné. Le porteur ne peut pas être
 * ajouté comme membre (il est déjà là, séparément). Un membre déjà présent ne
 * se duplique pas : la clé primaire double le garantit, l'ajout est idempotent.
 */
export async function ajouterMembre(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté", champ: "membres" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu", champ: "membres" }, 404);
  if (!peutToucher(personne, ligne)) {
    return c.json({ erreur: "ce projet n'est pas le vôtre", champ: "membres" }, 403);
  }

  const corps = await lireCorps(c);
  if (corps === CORPS_ILLISIBLE || !corps || typeof corps !== "object" || Array.isArray(corps)) {
    return c.json({ erreur: "le corps n'est pas du JSON", champ: "membres" }, 400);
  }
  const fourni = corps as Record<string, unknown>;
  const github = texte(fourni.github);
  const nom = texte(fourni.nom);

  // Résoudre — ou créer — la personne du membre. Le pseudo GitHub prime sur le
  // nom : c'est lui qui rend le pré-compte récupérable à la connexion.
  let personneId: string;
  if (github) {
    const trouve = await chercherGithub(github);
    if (trouve === "reseau") {
      return c.json({ erreur: "GitHub ne répond pas, réessayez", champ: "membres" }, 502);
    }
    if (trouve === "introuvable") {
      return c.json({ erreur: `aucun compte GitHub « ${github} »`, champ: "membres" }, 404);
    }
    personneId = await personnePourGithub(c.env.BASE, trouve);
  } else if (nom) {
    personneId = await personnePourNom(c.env.BASE, nom);
  } else {
    return c.json({ erreur: "donnez un pseudo GitHub ou un nom", champ: "membres" }, 400);
  }

  // Le porteur n'est pas un membre : il figure déjà sur la fiche, séparément.
  if (personneId === ligne.porteur_id) {
    return c.json({ erreur: "cette personne est déjà le porteur du projet", champ: "membres" }, 409);
  }

  // Idempotent : la clé primaire (projet_id, personne_id) empêche le doublon, et
  // `OR IGNORE` fait qu'un second ajout de la même personne ne casse pas — il ne
  // crée simplement rien de plus.
  await c.env.BASE.prepare(
    "INSERT OR IGNORE INTO membres (projet_id, personne_id, ajoute_le) VALUES (?, ?, ?)",
  )
    .bind(ligne.id, personneId, new Date().toISOString())
    .run();
  await journaliser(c.env.BASE, "modification", personne.id, ligne.id, {
    membre: "ajout",
    personne_id: personneId,
  });
  const membres = await lireMembres(c.env.BASE, ligne.id);
  return c.json({ membres }, 201);
}

/**
 * `DELETE /api/projets/:id/membres/:personneId` — retirer un membre. Porteur ou
 * bureau. On retire le lien, jamais la personne : sa fiche (et son pré-compte,
 * s'il attend une première connexion) reste. Retirer un membre absent est un
 * succès sans effet.
 */
export async function retirerMembre(c: Ctx) {
  const personne = await personneConnectee(c);
  if (!personne) return c.json({ erreur: "il faut être connecté", champ: "membres" }, 401);
  const ligne = await lireLigneParId(c.env.BASE, c.req.param("id") ?? "");
  if (!ligne) return c.json({ erreur: "projet inconnu", champ: "membres" }, 404);
  if (!peutToucher(personne, ligne)) {
    return c.json({ erreur: "ce projet n'est pas le vôtre", champ: "membres" }, 403);
  }
  const personneId = c.req.param("personneId") ?? "";
  const { meta } = await c.env.BASE.prepare(
    "DELETE FROM membres WHERE projet_id = ? AND personne_id = ?",
  )
    .bind(ligne.id, personneId)
    .run();
  if (meta.changes) {
    await journaliser(c.env.BASE, "modification", personne.id, ligne.id, {
      membre: "retrait",
      personne_id: personneId,
    });
  }
  return c.body(null, 204);
}
