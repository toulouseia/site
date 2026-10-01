// ─────────────────────────────────────────────────────────────────────────────
// Les sessions : reconnaître quelqu'un d'un appel au suivant.
//
// Une session est un jeton tiré au hasard, sans aucune donnée à l'intérieur.
// C'est un choix contre les jetons signés qui portent leur contenu : ceux-là ne
// se révoquent pas, puisque le serveur ne les a jamais gardés. Ici, couper une
// session est une suppression de ligne — et vider la table déconnecte tout le
// monde, ce qui est exactement ce qu'on veut le jour où quelque chose fuit.
//
// Le jeton n'est pas écrit tel quel dans la base : c'est son empreinte qui y va.
// Une empreinte est le résultat d'un calcul à sens unique — on peut vérifier
// qu'un jeton donne bien cette empreinte, on ne peut pas remonter de l'empreinte
// au jeton. Conséquence concrète : quelqu'un qui obtiendrait une copie de la
// base ne pourrait se faire passer pour personne. C'est le même raisonnement que
// pour un mot de passe, et il coûte trois lignes.
// ─────────────────────────────────────────────────────────────────────────────

/** Trente jours. Au-delà, il faut se reconnecter — c'est une minute. */
const DUREE_JOURS = 30;

/** Le nom du petit fichier que le navigateur renvoie à chaque appel. */
export const NOM_TEMOIN = "session";

/**
 * Un jeton neuf : 32 octets tirés par le générateur du système, écrits dans un
 * alphabet qui passe sans encodage dans une adresse ou un témoin de connexion.
 */
export function tirerJeton(): string {
  const octets = new Uint8Array(32);
  crypto.getRandomValues(octets);
  return base64url(octets);
}

/** L'empreinte d'un jeton — ce qui est écrit dans la base, jamais le jeton. */
export async function empreinte(jeton: string): Promise<string> {
  const brut = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(jeton),
  );
  return base64url(new Uint8Array(brut));
}

function base64url(octets: Uint8Array): string {
  let binaire = "";
  for (const o of octets) binaire += String.fromCharCode(o);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Un identifiant interne : ni celui de Google, ni celui de GitHub. */
export function tirerIdentifiant(): string {
  const octets = new Uint8Array(16);
  crypto.getRandomValues(octets);
  return Array.from(octets, (o) => o.toString(16).padStart(2, "0")).join("");
}

export type Personne = {
  id: string;
  nom: string;
  courriel: string | null;
  github_pseudo: string | null;
  photo: string | null;
  origine: string | null;
  bureau: number;
  /** Les moyens de contact, tels que la base les garde : du JSON, jamais nul. */
  contacts: string;
  /** Les identifiants chez les deux services ; nul tant que le service n'est pas relié. */
  google_id: string | null;
  github_id: string | null;
};

/** Les colonnes d'une personne, dans l'ordre du type — une seule liste à tenir. */
export const COLONNES_PERSONNE =
  "id, nom, courriel, github_pseudo, photo, origine, bureau, contacts, google_id, github_id";

/**
 * Ouvre une session et rend le jeton à poser dans le témoin de connexion.
 * L'agent du navigateur est gardé pour reconnaître une session volée ; il n'est
 * jamais affiché.
 */
export async function ouvrirSession(
  base: D1Database,
  personneId: string,
  agent: string | null,
): Promise<{ jeton: string; expire: Date }> {
  const jeton = tirerJeton();
  const maintenant = new Date();
  const expire = new Date(maintenant.getTime() + DUREE_JOURS * 86_400_000);
  await base
    .prepare(
      "INSERT INTO sessions (jeton, personne_id, cree_le, expire_le, agent) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      await empreinte(jeton),
      personneId,
      maintenant.toISOString(),
      expire.toISOString(),
      agent?.slice(0, 200) ?? null,
    )
    .run();
  return { jeton, expire };
}

/**
 * Qui est là ? Rend la personne, ou `null` si le jeton est absent, inconnu ou
 * périmé. La comparaison de la date se fait en SQL sur du texte ISO, qui se
 * trie exactement comme une date — c'est pour cela que le schéma les stocke
 * ainsi.
 */
export async function lireSession(
  base: D1Database,
  jeton: string | undefined,
): Promise<Personne | null> {
  if (!jeton) return null;
  const ligne = await base
    .prepare(
      `SELECT p.id, p.nom, p.courriel, p.github_pseudo, p.photo, p.origine, p.bureau, p.contacts,
              p.google_id, p.github_id
         FROM sessions s JOIN personnes p ON p.id = s.personne_id
        WHERE s.jeton = ? AND s.expire_le > ?`,
    )
    .bind(await empreinte(jeton), new Date().toISOString())
    .first<Personne>();
  return ligne ?? null;
}

/** Ferme une session. Sans effet si le jeton est déjà inconnu. */
export async function fermerSession(
  base: D1Database,
  jeton: string | undefined,
): Promise<void> {
  if (!jeton) return;
  await base
    .prepare("DELETE FROM sessions WHERE jeton = ?")
    .bind(await empreinte(jeton))
    .run();
}

/**
 * Retrouve la personne derrière une identité extérieure, ou la crée.
 *
 * Quatre cas, dans cet ordre :
 *
 *   1. On connaît déjà cette identité chez ce service : on met à jour la date
 *      de dernière visite et c'est tout.
 *   2. On ne la connaît pas, mais quelqu'un est **déjà connecté** dans ce
 *      navigateur : c'est cette personne qui ajoute un second service à son
 *      compte. On rattache l'identité à sa ligne — et on y recopie l'adresse
 *      et la photo si elles manquaient. C'est le cas réel du 15 septembre
 *      2026 : un compte GitHub sans adresse, puis une connexion Google, et
 *      deux fiches pour une seule personne. Le rapprochement par adresse ne
 *      pouvait pas marcher ; celui-ci, si.
 *   3. On ne la connaît pas, mais le service donne une adresse électronique
 *      déjà vue : c'est la même personne qui se connecte autrement, on rattache
 *      l'identité à sa ligne.
 *   4. Sinon : nouvelle personne.
 *
 * Le cas 3 est la raison pour laquelle GitHub mérite un écran de secours :
 * beaucoup d'étudiants masquent leur adresse, le rattachement échoue alors et
 * la personne se retrouve avec deux comptes. C'est un écran qui doit le lui
 * dire, pas une règle silencieuse — et le cas 2 est ce que cet écran propose.
 */
export async function trouverOuCreer(
  base: D1Database,
  identite: {
    service: "google" | "github";
    idExterieur: string;
    nom: string;
    courriel: string | null;
    photo: string | null;
    pseudo?: string | null;
  },
  /** La personne déjà connectée dans ce navigateur, s'il y en a une. */
  connecteeId: string | null = null,
): Promise<Personne> {
  const colonne = identite.service === "google" ? "google_id" : "github_id";
  const maintenant = new Date().toISOString();

  const connue = await base
    .prepare(`SELECT ${COLONNES_PERSONNE} FROM personnes WHERE ${colonne} = ?`)
    .bind(identite.idExterieur)
    .first<Personne>();
  if (connue) {
    await base
      .prepare("UPDATE personnes SET vu_le = ?, photo = COALESCE(?, photo) WHERE id = ?")
      .bind(maintenant, identite.photo, connue.id)
      .run();
    return connue;
  }

  if (connecteeId) {
    // Seulement si la personne connectée n'a pas déjà un compte chez ce
    // service : on ajoute un service, on n'en remplace pas un. Sinon on
    // retombe sur les cas suivants, comme si personne n'était connecté.
    const connectee = await base
      .prepare(
        `SELECT ${COLONNES_PERSONNE} FROM personnes WHERE id = ? AND ${colonne} IS NULL`,
      )
      .bind(connecteeId)
      .first<Personne>();
    if (connectee) {
      // L'adresse ne se recopie que si elle est libre : `courriel` est UNIQUE,
      // et une adresse déjà portée par une autre fiche ferait échouer tout le
      // rattachement pour un détail qui se règle depuis l'écran de profil.
      const courrielLibre =
        identite.courriel && !connectee.courriel
          ? ((await base
              .prepare("SELECT count(*) AS n FROM personnes WHERE courriel = ?")
              .bind(identite.courriel)
              .first<{ n: number }>())?.n ?? 0) === 0
          : false;
      const courriel = courrielLibre ? identite.courriel : connectee.courriel;
      await base
        .prepare(
          `UPDATE personnes
              SET ${colonne} = ?, vu_le = ?, courriel = ?,
                  photo = COALESCE(photo, ?),
                  github_pseudo = COALESCE(?, github_pseudo)
            WHERE id = ?`,
        )
        .bind(
          identite.idExterieur,
          maintenant,
          courriel,
          identite.photo,
          identite.pseudo ?? null,
          connectee.id,
        )
        .run();
      return {
        ...connectee,
        [colonne]: identite.idExterieur,
        courriel,
        photo: connectee.photo ?? identite.photo,
        github_pseudo: identite.pseudo ?? connectee.github_pseudo,
      };
    }
  }

  if (identite.courriel) {
    const parCourriel = await base
      .prepare(`SELECT ${COLONNES_PERSONNE} FROM personnes WHERE courriel = ?`)
      .bind(identite.courriel)
      .first<Personne>();
    if (parCourriel) {
      await base
        .prepare(
          `UPDATE personnes
              SET ${colonne} = ?, vu_le = ?, photo = COALESCE(photo, ?),
                  github_pseudo = COALESCE(?, github_pseudo)
            WHERE id = ?`,
        )
        .bind(
          identite.idExterieur,
          maintenant,
          identite.photo,
          identite.pseudo ?? null,
          parCourriel.id,
        )
        .run();
      return { ...parCourriel, [colonne]: identite.idExterieur };
    }
  }

  const id = tirerIdentifiant();
  await base
    .prepare(
      `INSERT INTO personnes (id, nom, courriel, ${colonne}, github_pseudo, photo, cree_le, vu_le)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      identite.nom,
      identite.courriel,
      identite.idExterieur,
      identite.pseudo ?? null,
      identite.photo,
      maintenant,
      maintenant,
    )
    .run();
  return {
    id,
    nom: identite.nom,
    courriel: identite.courriel,
    github_pseudo: identite.pseudo ?? null,
    photo: identite.photo,
    origine: null,
    bureau: 0,
    contacts: "[]",
    google_id: identite.service === "google" ? identite.idExterieur : null,
    github_id: identite.service === "github" ? identite.idExterieur : null,
  };
}
