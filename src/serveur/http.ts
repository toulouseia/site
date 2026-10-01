import "server-only";

import { CODE_HTTP, type Resultat } from "./domaine/commun";

// ─────────────────────────────────────────────────────────────────────────────
// LA FRONTIÈRE HTTP.
//
// Les écrans de cette application n'appellent PAS ces routes : ce sont des
// composants serveur, ils appellent les services directement. Faire un
// aller-retour HTTP vers soi-même pour afficher une page est un coût pur.
//
// Alors pourquoi ces routes existent ? Parce que la même donnée servira
// bientôt à autre chose que ces écrans : une application mobile, un tableau de
// bord d'administration, un export, une intégration. Les poser maintenant, sur
// les mêmes services, garantit qu'elles ne divergeront pas, et prouve dès
// aujourd'hui que les services ne dépendent ni de React ni du rendu.
//
// Le contrat : un objet JSON, jamais un tableau nu à la racine (un tableau nu
// interdit d'ajouter un champ plus tard), et une erreur toujours de la même
// forme.
// ─────────────────────────────────────────────────────────────────────────────

/** Une réponse en succès. Les données sont sous `donnees`, toujours. */
export function json<T>(donnees: T, entetes?: HeadersInit): Response {
  return Response.json(
    { donnees },
    {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        ...entetes,
      },
    },
  );
}

/** Une erreur. Même forme partout : un motif lisible et un message français. */
export function erreur(
  motif: keyof typeof CODE_HTTP,
  message: string,
): Response {
  return Response.json(
    { erreur: { motif, message } },
    { status: CODE_HTTP[motif] },
  );
}

/** Le pont entre un `Resultat` de service et une réponse HTTP. */
export function depuisResultat<T>(resultat: Resultat<T>): Response {
  return resultat.ok
    ? json(resultat.valeur)
    : erreur(resultat.motif, resultat.message);
}
