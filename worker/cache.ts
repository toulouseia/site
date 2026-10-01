// ─────────────────────────────────────────────────────────────────────────────
// Le cache du mur : `GET /api/projets` vit soixante secondes dans le cache de
// la plateforme (`caches.default`), et chaque écriture qui change ce que le mur
// montre le vide — un projet déposé, modifié ou supprimé, mais aussi un porteur
// qui change son nom, son origine ou ses moyens de contact, puisque le mur les
// embarque avec chaque projet.
// ─────────────────────────────────────────────────────────────────────────────

import type { Context } from "hono";
import type { Environnement } from "./environnement";

type Ctx = Context<{ Bindings: Environnement }>;

/**
 * La clé du cache ne dépend pas de l'hôte demandé : `www.` et le domaine nu
 * arrivent au même programme, et il n'y a qu'un mur.
 */
export function cleDuMur(c: Ctx): Request {
  const site = c.env.SITE ?? new URL(c.req.url).origin;
  return new Request(`${site}/api/projets`, { method: "GET" });
}

export async function viderLeMur(c: Ctx): Promise<void> {
  try {
    await caches.default.delete(cleDuMur(c));
  } catch {
    // Pas de cache ici (un environnement d'essai sans `caches`) : rien à vider.
  }
}
