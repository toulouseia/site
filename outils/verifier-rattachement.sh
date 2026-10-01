#!/usr/bin/env bash
# Vérifie les quatre cas de `trouverOuCreer` (worker/session.ts) sans serveur
# et sans secrets : le retour d'une connexion Google ou GitHub ne se rejoue pas
# hors ligne, mais la règle qui décide « même personne ou nouvelle fiche »
# s'exécute ici telle quelle, contre un vrai SQLite auquel on a appliqué les
# migrations — le même moteur que D1.
#
#   ./outils/verifier-rattachement.sh
#
# Le cas qui a motivé cet essai est réel (15 septembre 2026) : un compte GitHub
# sans adresse, puis une connexion Google, et deux fiches pour une personne.
set -euo pipefail
export LC_ALL=C
cd "$(dirname "$0")/.."

node --no-warnings --input-type=module - <<'JS'
import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const { trouverOuCreer, lireSession, ouvrirSession } = await import(
  pathToFileURL(process.cwd() + "/worker/session.ts").href
);

// Le strict nécessaire de l'interface D1 (prepare / bind / first / run / all),
// posé sur node:sqlite. Rien d'autre n'est appelé par session.ts.
function baseD1() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON");
  for (const f of readdirSync("migrations").filter((f) => /^\d+.*\.sql$/.test(f)).sort()) {
    db.exec(readFileSync(`migrations/${f}`, "utf8"));
  }
  return {
    brut: db,
    prepare(sql) {
      const st = db.prepare(sql);
      let args = [];
      const enonce = {
        bind(...a) { args = a; return enonce; },
        async first() { return st.get(...args) ?? null; },
        async run() { st.run(...args); return { success: true }; },
        async all() { return { results: st.all(...args) }; },
      };
      return enonce;
    },
  };
}

let total = 0, reussis = 0;
function essai(nom, attendu, obtenu) {
  total++;
  const a = JSON.stringify(attendu), o = JSON.stringify(obtenu);
  if (a === o) { reussis++; console.log(`  ✅ ${nom}`); }
  else console.log(`  ❌ ${nom}\n     attendu : ${a}\n     obtenu  : ${o}`);
}
const fiches = (b) => b.brut.prepare("SELECT id, courriel, google_id, github_id FROM personnes ORDER BY cree_le").all();

console.log("── cas 1 : identité déjà connue → même fiche");
{
  const b = baseD1();
  const p1 = await trouverOuCreer(b, { service: "google", idExterieur: "g1", nom: "Ana", courriel: "ana@x.org", photo: null });
  const p2 = await trouverOuCreer(b, { service: "google", idExterieur: "g1", nom: "Ana bis", courriel: "ana@x.org", photo: "photo" });
  essai("même identifiant", p1.id, p2.id);
  essai("une seule fiche", fiches(b).length, 1);
  essai("la nouvelle fiche part avec des contacts vides", p1.contacts, "[]");
}

console.log("── cas 2 : connecté par GitHub sans adresse, puis Google → une seule fiche");
{
  const b = baseD1();
  const bob = await trouverOuCreer(b, { service: "github", idExterieur: "gh-bob", nom: "bob", courriel: null, photo: null, pseudo: "bob" });
  const { jeton } = await ouvrirSession(b, bob.id, null);
  const courante = await lireSession(b, jeton);
  essai("la session relit bob, sans adresse", [courante.id, courante.courriel], [bob.id, null]);
  const p = await trouverOuCreer(
    b,
    { service: "google", idExterieur: "g-bob", nom: "Bob Google", courriel: "bob@x.org", photo: "p" },
    courante.id,
  );
  essai("Google est rattaché à la fiche de bob", p.id, bob.id);
  essai("toujours une seule fiche", fiches(b).length, 1);
  essai("la fiche porte les deux services et l'adresse", fiches(b)[0], { id: bob.id, courriel: "bob@x.org", google_id: "g-bob", github_id: "gh-bob" });
  essai("le retour porte l'adresse et la photo recopiées", [p.courriel, p.photo], ["bob@x.org", "p"]);
  essai("le nom de bob n'a pas été écrasé", p.nom, "bob");
}

console.log("── cas 2, garde-fous");
{
  const b = baseD1();
  const ana = await trouverOuCreer(b, { service: "google", idExterieur: "g-ana", nom: "Ana", courriel: "ana@x.org", photo: null });
  const p = await trouverOuCreer(
    b,
    { service: "google", idExterieur: "g-autre", nom: "Autre", courriel: "autre@x.org", photo: null },
    ana.id,
  );
  essai("un second compte Google, alors qu'on en a déjà un : nouvelle fiche, pas d'écrasement", p.id === ana.id, false);
  essai("…et la fiche d'ana garde son Google", fiches(b)[0].google_id, "g-ana");

  const b2 = baseD1();
  await trouverOuCreer(b2, { service: "google", idExterieur: "g-x", nom: "X", courriel: "prise@x.org", photo: null });
  const bob = await trouverOuCreer(b2, { service: "github", idExterieur: "gh-bob", nom: "bob", courriel: null, photo: null, pseudo: "bob" });
  const p2 = await trouverOuCreer(
    b2,
    { service: "google", idExterieur: "g-bob", nom: "Bob", courriel: "prise@x.org", photo: null },
    bob.id,
  );
  essai("adresse déjà prise par une autre fiche : le rattachement passe quand même", p2.id, bob.id);
  essai("…sans recopier l'adresse (UNIQUE respecté)", fiches(b2).find((f) => f.id === bob.id).courriel, null);
  essai("…mais avec le compte Google", fiches(b2).find((f) => f.id === bob.id).google_id, "g-bob");
}

console.log("── cas 3 : pas connecté, adresse connue → rattachement par l'adresse");
{
  const b = baseD1();
  const ana = await trouverOuCreer(b, { service: "google", idExterieur: "g-ana", nom: "Ana", courriel: "ana@x.org", photo: null });
  const p = await trouverOuCreer(b, { service: "github", idExterieur: "gh-ana", nom: "ana-gh", courriel: "ana@x.org", photo: null, pseudo: "ana-gh" });
  essai("même fiche", p.id, ana.id);
  essai("GitHub rattaché", fiches(b)[0].github_id, "gh-ana");
}

console.log("── cas 4 : rien de connu → nouvelle fiche");
{
  const b = baseD1();
  await trouverOuCreer(b, { service: "google", idExterieur: "g-ana", nom: "Ana", courriel: "ana@x.org", photo: null });
  const p = await trouverOuCreer(b, { service: "github", idExterieur: "gh-bob", nom: "bob", courriel: null, photo: null, pseudo: "bob" });
  essai("deux fiches", fiches(b).length, 2);
  essai("la seconde est celle de bob, sans adresse", [fiches(b)[1].id, fiches(b)[1].courriel], [p.id, null]);
}

console.log(`\n${reussis} vérifications sur ${total}`);
process.exit(reussis === total ? 0 : 1);
JS
