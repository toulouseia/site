// Ce que la plateforme passe au programme à chaque appel.
//
// Deux natures, et la différence compte :
//
//   · Les **réglages** sont dans `wrangler.jsonc`, versionnés, lisibles par
//     tout le monde. Un identifiant de client OAuth en fait partie : il est
//     public par construction, il part dans l'adresse du navigateur à chaque
//     connexion.
//   · Les **secrets** ne sont nulle part dans le dépôt. Ils se posent une fois
//     avec `npx wrangler secret put NOM`, qui les demande sans les afficher, et
//     ne se relisent jamais — même pas depuis le tableau de bord.

export type Environnement = {
  /** Les pages fabriquées à l'avance, pour leur rendre la main. */
  PAGES: Fetcher;
  /** La base de l'association. */
  BASE: D1Database;
  /**
   * Le bucket des images d'illustration des projets. Il ne garde que des
   * octets ; la base ne garde que la clé de l'objet, jamais l'image elle-même.
   */
  IMAGES: R2Bucket;
  /** Où l'on tourne : `production` ou `local`. */
  OU?: string;
  /** L'adresse du site, celle qui est déclarée chez Google et chez GitHub. */
  SITE?: string;
  /** Identifiants publics des deux applications de connexion. */
  GOOGLE_ID?: string;
  GITHUB_ID?: string;
  /** Secrets, posés par `wrangler secret put`. Jamais dans le dépôt. */
  GOOGLE_SECRET?: string;
  GITHUB_SECRET?: string;
};
