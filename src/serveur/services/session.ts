import "server-only";

import { ANONYME, type Visiteur } from "@/serveur/domaine/visiteur";

// ─────────────────────────────────────────────────────────────────────────────
// LA SESSION, le fichier que l'authentification remplacera, et le seul.
//
// Aujourd'hui : tout le monde est anonyme. Ce n'est pas un bouchon posé en
// attendant ; c'est la vérité de l'application telle qu'elle est, exprimée
// dans la forme définitive.
//
// LE JOUR OÙ LES COMPTES ARRIVENT, voici ce que ce fichier devient, et rien
// d'autre dans l'application ne change :
//
//     import { auth } from "@/serveur/auth";
//
//     export async function visiteurCourant(): Promise<Visiteur> {
//       const session = await auth();
//       if (!session?.user) return ANONYME;
//       return {
//         id: session.user.id,
//         role: session.user.role,
//         nom: session.user.name ?? undefined,
//         personneId: session.user.personneId ?? undefined,
//         authentifie: true,
//       };
//     }
//
// La condition pour que ce soit vrai : aucun écran, aucun service ne doit
// jamais tester « est-ce qu'il y a une session ». Ils appellent
// `visiteurCourant()` et posent leurs questions à `peut()`.
// ─────────────────────────────────────────────────────────────────────────────

export async function visiteurCourant(): Promise<Visiteur> {
  return ANONYME;
}

/**
 * L'identifiant du visiteur, pour la progression. Côté navigateur, le magasin
 * local utilise la même chaîne : c'est ce qui fera que la progression anonyme
 * pourra être reprise et rattachée à un compte au moment de la connexion,
 * plutôt que perdue.
 */
export async function idVisiteurCourant(): Promise<string> {
  return (await visiteurCourant()).id;
}
