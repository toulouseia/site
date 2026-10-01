// ─────────────────────────────────────────────────────────────────────────────
// Le journal : ce qui a été fait, par qui, et quand.
//
// Une ligne par geste qui change la base — dépôt, modification, suppression.
// Il existe pour la personne qui reprendra le bureau l'an prochain et devra
// répondre à « pourquoi ce projet a-t-il disparu ? » sans demander à celle
// qui est partie (migrations/0001_socle.sql, table `journal`).
// ─────────────────────────────────────────────────────────────────────────────

/** Les gestes connus. Le schéma n'en fait pas une liste fermée, exprès. */
export type Geste = "depot" | "modification" | "suppression";

export async function journaliser(
  base: D1Database,
  geste: Geste,
  personneId: string,
  cible: string,
  detail: Record<string, unknown> | null = null,
): Promise<void> {
  await base
    .prepare(
      "INSERT INTO journal (quand, geste, personne_id, cible, detail) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      new Date().toISOString(),
      geste,
      personneId,
      cible,
      detail ? JSON.stringify(detail) : null,
    )
    .run();
}
