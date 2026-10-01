// ─────────────────────────────────────────────────────────────────────────────
// Ce que le navigateur demande au serveur. C'est l'autre porte.
//
// `api.ts` est lue à la construction : elle nourrit les pages fabriquées
// d'avance, et elle ne connaît que le code. Ce fichier-ci ne s'exécute que
// dans le navigateur, une fois la page affichée : il parle au programme
// serveur (`worker/`) par les adresses `/api/…`, et rien d'autre ne le fait.
//
// Chaque fonction rend un résultat, jamais une exception : un serveur absent,
// une session expirée ou un champ refusé sont des cas ordinaires que l'écran
// doit montrer, pas des pannes. La forme des refus est celle du serveur —
// `{ erreur, champ? }` — et le champ nommé est celui à côté duquel l'écran
// affiche le message.
// ─────────────────────────────────────────────────────────────────────────────

import type { Contact, Membre, Projet } from "./types";
import type { ProjetComplet } from "./api";

/** Ce que `GET /api/moi` dit d'une personne connectée. */
export type Moi = {
  id: string;
  nom: string;
  /** Jamais affichée publiquement ; sert à réunir deux comptes, et c'est tout. */
  courriel: string | null;
  photo: string | null;
  origine: string | null;
  pseudoGithub: string | null;
  bureau: boolean;
  /** Vrai quand GitHub a masqué l'adresse : l'écran de profil propose de relier Google. */
  adresseAdemander: boolean;
  /** Les services déjà reliés à cette fiche ; l'écran propose l'autre. */
  services: { google: boolean; github: boolean };
  contacts: Contact[];
};

export type Refus = { erreur: string; champ?: string };

export type Resultat<T> =
  | { ok: true; valeur: T }
  | { ok: false; statut: number; refus: Refus };

/** Un projet de la base, tel que `/api/projets/miens` le rend : avec sa publication. */
export type ProjetMien = ProjetComplet & {
  publication: "attente" | "publie" | "refuse";
};

/**
 * Le corps d'un dépôt ou d'une modification : le vocabulaire de `Projet`, tel
 * quel. Un champ absent ne bouge pas ; l'accueil se retire en envoyant `null`.
 */
export type CorpsProjet = Partial<
  Pick<
    Projet,
    | "nom"
    | "resume"
    | "presentation"
    | "categorie"
    | "pole"
    | "etat"
    | "enPause"
    | "depot"
    | "modele"
    | "outils"
  > & { accueil: Projet["accueil"] | null }
>;

/**
 * La lecture d'une réponse, la même pour tous les appels : un 204 est un succès
 * sans corps, un statut d'échec porte un refus `{ erreur, champ? }`, et un corps
 * illisible se replie sur un message tiré du statut. Sortie ici parce que le
 * téléversement d'image ne passe pas par `appeler` — son corps est binaire — et
 * doit pourtant rendre exactement la même forme de résultat.
 */
async function analyserReponse<T>(reponse: Response): Promise<Resultat<T>> {
  if (reponse.status === 204) return { ok: true, valeur: undefined as T };
  const json = (await reponse.json().catch(() => null)) as T | Refus | null;
  if (reponse.ok) return { ok: true, valeur: json as T };
  const refus =
    json && typeof json === "object" && "erreur" in json
      ? (json as Refus)
      : { erreur: `le serveur a répondu ${reponse.status}` };
  return { ok: false, statut: reponse.status, refus };
}

async function appeler<T>(
  methode: "GET" | "POST" | "PUT" | "DELETE",
  chemin: string,
  corps?: unknown,
  signal?: AbortSignal,
): Promise<Resultat<T>> {
  try {
    const reponse = await fetch(chemin, {
      method: methode,
      headers: corps !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: corps !== undefined ? JSON.stringify(corps) : undefined,
      // Le témoin de session part avec l'appel : même site, même origine.
      credentials: "same-origin",
      // Le mur porte `Cache-Control: max-age=60` pour le cache de la
      // plateforme ; celui du navigateur, lui, ne doit pas cacher pendant une
      // minute ce qu'on vient soi-même de changer. On revalide à chaque lecture.
      cache: methode === "GET" ? "no-cache" : "default",
      signal,
    });
    return analyserReponse<T>(reponse);
  } catch {
    return { ok: false, statut: 0, refus: { erreur: "le serveur ne répond pas" } };
  }
}

// ── Moi ─────────────────────────────────────────────────────────────────────

export async function lireMoi(
  signal?: AbortSignal,
): Promise<Resultat<{ connecte: false } | { connecte: true; personne: Moi }>> {
  return appeler("GET", "/api/moi", undefined, signal);
}

export async function enregistrerMoi(m: {
  nom?: string;
  origine?: string | null;
  contacts?: Contact[];
}): Promise<Resultat<{ connecte: true; personne: Moi }>> {
  return appeler("PUT", "/api/moi", m);
}

export async function seDeconnecter(): Promise<Resultat<{ connecte: false }>> {
  return appeler("POST", "/api/deconnexion");
}

// ── Les projets ─────────────────────────────────────────────────────────────

/**
 * Le mur, après la base : les projets écrits dans le code, ceux de la base
 * par-dessus. Sur un nom court commun, la base gagne — c'est elle qu'on
 * modifie. Le tout rangé du plus récemment mis à jour au plus ancien, comme
 * `listerProjets()` le fait pour le code seul. Les projets de la base sont
 * marqués `distant` : c'est ce qui décide de leur adresse.
 */
export function fusionner(
  code: readonly ProjetComplet[],
  base: readonly ProjetComplet[],
): ProjetComplet[] {
  const parSlug = new Map<string, ProjetComplet>(code.map((p) => [p.slug, p]));
  for (const p of base) parSlug.set(p.slug, { ...p, distant: true });
  return [...parSlug.values()].sort((a, b) => b.maj.localeCompare(a.maj));
}

/** Les projets publiés, les plus récemment mis à jour d'abord. */
export async function chargerProjets(
  signal?: AbortSignal,
): Promise<Resultat<{ projets: ProjetComplet[] }>> {
  return appeler("GET", "/api/projets", undefined, signal);
}

export async function chargerProjet(
  slug: string,
  signal?: AbortSignal,
): Promise<Resultat<{ projet: ProjetComplet }>> {
  return appeler("GET", `/api/projets/${encodeURIComponent(slug)}`, undefined, signal);
}

export async function chargerMesProjets(
  signal?: AbortSignal,
): Promise<Resultat<{ projets: ProjetMien[] }>> {
  return appeler("GET", "/api/projets/miens", undefined, signal);
}

export async function deposerProjet(
  corps: CorpsProjet,
): Promise<Resultat<{ projet: ProjetMien }>> {
  return appeler("POST", "/api/projets", corps);
}

export async function modifierProjet(
  id: string,
  corps: CorpsProjet,
): Promise<Resultat<{ projet: ProjetMien }>> {
  return appeler("PUT", `/api/projets/${encodeURIComponent(id)}`, corps);
}

export async function supprimerProjet(id: string): Promise<Resultat<void>> {
  return appeler("DELETE", `/api/projets/${encodeURIComponent(id)}`);
}

// ── L'image d'un projet ───────────────────────────────────────────────────────
//
// L'image ne passe pas par `appeler` : son corps est le fichier lui-même, pas du
// JSON, et elle ne peut donc pas voyager dans le corps de `PUT /api/projets/:id`
// (ce corps a une liste blanche stricte, et une URL arbitraire n'a rien à y
// faire). D'où une route dédiée, et un `fetch` séparé — mais la même forme de
// résultat que le reste, analysée par `analyserReponse`.

/**
 * Téléverser ou remplacer l'image d'un projet. Le corps est le fichier brut ;
 * le serveur en vérifie le vrai type et la taille. Le projet renvoyé porte
 * l'URL de service de l'image (`projet.image`).
 */
export async function televerserImageProjet(
  id: string,
  fichier: File,
): Promise<Resultat<{ projet: ProjetMien }>> {
  try {
    const reponse = await fetch(`/api/projets/${encodeURIComponent(id)}/image`, {
      method: "PUT",
      headers: { "Content-Type": fichier.type },
      body: fichier,
      credentials: "same-origin",
    });
    return analyserReponse<{ projet: ProjetMien }>(reponse);
  } catch {
    return { ok: false, statut: 0, refus: { erreur: "le serveur ne répond pas" } };
  }
}

/** Retirer l'image d'un projet. L'objet R2 est détruit côté serveur. */
export async function retirerImageProjet(id: string): Promise<Resultat<void>> {
  return appeler("DELETE", `/api/projets/${encodeURIComponent(id)}/image`);
}

// ── Les membres d'un projet ────────────────────────────────────────────────────
//
// Une route dédiée par opération, sur le modèle des appels image : l'ajout et le
// retrait sont réservés au porteur ou au bureau (`peutToucher` côté serveur). La
// lecture des membres, elle, ne passe pas par ici — ils viennent avec la fiche
// (`chargerProjet`). L'ajout renvoie la liste à jour, pour rafraîchir l'écran.

/**
 * Ajouter un membre à un projet, par son pseudo GitHub (résolu via l'API
 * publique côté serveur, avec création d'un pré-compte au bon identifiant) ou,
 * à défaut, par un nom. Rend la liste des membres à jour.
 */
export async function ajouterMembre(
  id: string,
  membre: { github?: string; nom?: string },
): Promise<Resultat<{ membres: Membre[] }>> {
  return appeler("POST", `/api/projets/${encodeURIComponent(id)}/membres`, membre);
}

/** Retirer un membre d'un projet. Le lien part, jamais la fiche de la personne. */
export async function retirerMembre(
  id: string,
  personneId: string,
): Promise<Resultat<void>> {
  return appeler(
    "DELETE",
    `/api/projets/${encodeURIComponent(id)}/membres/${encodeURIComponent(personneId)}`,
  );
}
