// ─────────────────────────────────────────────────────────────────────────────
// Le profil : ce qu'une personne dit d'elle, et ce qu'elle peut en changer.
//
// Trois champs, tous facultatifs dans la requête : le nom, l'origine et les
// moyens de contact. Rien d'autre ne se laisse écrire par ici — ni `bureau`,
// ni `id`, ni les identifiants des services — quel que soit le contenu du
// corps : c'est une liste blanche, pas une liste noire.
//
// L'adresse électronique ne se saisit pas non plus. Elle vient du service de
// connexion, qui l'a vérifiée, et c'est elle qui réunit deux comptes d'une
// même personne (session.ts, cas 3) : une adresse écrite à la main, jamais
// vérifiée, permettrait à n'importe qui de réclamer celle d'un autre et de
// capter son compte le jour où il se connecte. Pour réunir deux comptes, un
// seul chemin : connecté par l'un, on se connecte par l'autre (cas 2).
//
// Les moyens de contact sont publics par construction : c'est leur raison
// d'être, ils s'affichent sur la fiche de chaque projet porté. L'adresse
// électronique, elle, ne s'affiche jamais.
// ─────────────────────────────────────────────────────────────────────────────

import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { Canal, Contact } from "../src/donnees/types";
import type { Environnement } from "./environnement";
import { viderLeMur } from "./cache";
import { journaliser } from "./journal";
import { COLONNES_PERSONNE, lireSession, NOM_TEMOIN, type Personne } from "./session";

type Ctx = Context<{ Bindings: Environnement }>;

/** Les six canaux, les mêmes que `types.ts` — et pas un de plus. */
export const CANAUX: readonly Canal[] = [
  "discord",
  "whatsapp",
  "telegram",
  "instagram",
  "github",
  "mail",
];

/** « Deux ou trois, jamais une liste à rallonge » (types.ts). */
export const CONTACTS_MAX = 3;

/** Un refus qui nomme le champ : l'écran l'affiche à côté de lui. */
export type Refus = { erreur: string; champ: string };

/** Ce que `GET /api/moi` répond. `PUT` répond exactement la même chose. */
export function reponseMoi(personne: Personne) {
  return {
    connecte: true as const,
    personne: {
      id: personne.id,
      nom: personne.nom,
      courriel: personne.courriel,
      photo: personne.photo,
      origine: personne.origine,
      pseudoGithub: personne.github_pseudo,
      bureau: personne.bureau === 1,
      // Vrai quand GitHub a masqué l'adresse : l'écran de profil propose alors
      // de relier Google, sans quoi la personne se retrouvera avec deux comptes
      // le jour où elle se connectera par Google sans être connectée.
      adresseAdemander: personne.courriel === null,
      // Les services déjà reliés : l'écran propose l'autre.
      services: { google: personne.google_id !== null, github: personne.github_id !== null },
      contacts: lireContacts(personne.contacts),
    },
  };
}

/** Le JSON de la base, relu. Une colonne abîmée rend une liste vide. */
export function lireContacts(json: string | null): Contact[] {
  if (!json) return [];
  try {
    const valeur = JSON.parse(json);
    return Array.isArray(valeur) ? (valeur as Contact[]) : [];
  } catch {
    return [];
  }
}

// ── La validation ───────────────────────────────────────────────────────────

/** Ce qui peut changer, une fois vérifié. Absent = « ne touche pas ». */
export type Modifications = {
  nom?: string;
  origine?: string | null;
  contacts?: Contact[];
};

function texte(v: unknown): string | null {
  return typeof v === "string" ? v.trim() : null;
}

/**
 * Vérifie le corps d'un `PUT /api/moi`. Rend les valeurs nettoyées, ou le
 * premier refus rencontré — un seul à la fois, le champ nommé, pour que
 * l'écran sache où le montrer.
 */
export function validerProfil(corps: unknown): Modifications | Refus {
  if (!corps || typeof corps !== "object" || Array.isArray(corps)) {
    return { erreur: "le corps doit être un objet JSON", champ: "corps" };
  }
  const c = corps as Record<string, unknown>;
  const m: Modifications = {};

  if ("nom" in c) {
    const nom = texte(c.nom);
    if (!nom) return { erreur: "le nom est vide", champ: "nom" };
    if (nom.length > 60) return { erreur: "le nom dépasse 60 caractères", champ: "nom" };
    m.nom = nom;
  }

  if ("origine" in c) {
    if (c.origine === null || c.origine === "") m.origine = null;
    else {
      const origine = texte(c.origine);
      if (origine === null) return { erreur: "l'origine doit être un texte", champ: "origine" };
      if (origine.length > 60) return { erreur: "l'origine dépasse 60 caractères", champ: "origine" };
      m.origine = origine || null;
    }
  }

  if ("courriel" in c) {
    return {
      erreur:
        "l'adresse ne se modifie pas ici : elle vient du service de connexion. Pour réunir deux comptes, reliez l'autre service depuis le profil",
      champ: "courriel",
    };
  }

  if ("contacts" in c) {
    const refus = validerContacts(c.contacts);
    if ("erreur" in refus) return refus;
    m.contacts = refus.contacts;
  }

  return m;
}

export function validerContacts(valeur: unknown): { contacts: Contact[] } | Refus {
  if (!Array.isArray(valeur)) {
    return { erreur: "les contacts doivent être une liste", champ: "contacts" };
  }
  if (valeur.length > CONTACTS_MAX) {
    return { erreur: `au plus ${CONTACTS_MAX} moyens de contact`, champ: "contacts" };
  }
  const contacts: Contact[] = [];
  for (const entree of valeur) {
    const e = (entree ?? {}) as Record<string, unknown>;
    const canal = e.canal;
    if (typeof canal !== "string" || !CANAUX.includes(canal as Canal)) {
      return { erreur: "canal inconnu", champ: "contacts" };
    }
    const v = texte(e.valeur);
    if (!v) return { erreur: `${canal} : la valeur est vide`, champ: "contacts" };
    if (v.length > 120) return { erreur: `${canal} : la valeur dépasse 120 caractères`, champ: "contacts" };
    contacts.push({ canal: canal as Canal, valeur: v });
  }
  return { contacts };
}

// ── L'écriture ──────────────────────────────────────────────────────────────

/** Applique des modifications vérifiées à une personne. Rend la fiche relue. */
export async function modifierPersonne(
  base: D1Database,
  personne: Personne,
  m: Modifications,
): Promise<Personne> {
  const colonnes: string[] = [];
  const valeurs: unknown[] = [];
  const detail: Record<string, unknown> = {};
  if (m.nom !== undefined) { colonnes.push("nom = ?"); valeurs.push(m.nom); detail.nom = true; }
  if (m.origine !== undefined) { colonnes.push("origine = ?"); valeurs.push(m.origine); detail.origine = true; }
  if (m.contacts !== undefined) {
    colonnes.push("contacts = ?");
    valeurs.push(JSON.stringify(m.contacts));
    detail.contacts = m.contacts.length;
  }

  if (colonnes.length > 0) {
    await base
      .prepare(`UPDATE personnes SET ${colonnes.join(", ")} WHERE id = ?`)
      .bind(...valeurs, personne.id)
      .run();
    await journaliser(base, "modification", personne.id, personne.id, detail);
  }

  const relue = await base
    .prepare(`SELECT ${COLONNES_PERSONNE} FROM personnes WHERE id = ?`)
    .bind(personne.id)
    .first<Personne>();
  return relue ?? personne;
}

/** `PUT /api/moi`. */
export async function mettreAJourMoi(c: Ctx) {
  const personne = await lireSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
  if (!personne) return c.json({ erreur: "il faut être connecté" }, 401);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ erreur: "le corps n'est pas du JSON", champ: "corps" }, 400);
  }
  const verifie = validerProfil(corps);
  if ("erreur" in verifie) return c.json(verifie, 400);

  const resultat = await modifierPersonne(c.env.BASE, personne, verifie);
  // Le mur public embarque le nom, l'origine et les contacts de chaque porteur.
  await viderLeMur(c);
  return c.json(reponseMoi(resultat));
}
