// ─────────────────────────────────────────────────────────────────────────────
// Se connecter par Google ou par GitHub, écrit à la main.
//
// OAuth 2.0 est le procédé par lequel un site délègue la vérification d'identité
// à un service que la personne utilise déjà, sans jamais voir son mot de passe.
// Il se déroule toujours en deux temps, et les deux adresses ci-dessous portent
// ces deux temps : `entree` envoie la personne chez Google ou GitHub avec une
// question, `retour` reçoit sa réponse et l'échange contre une identité.
//
// Ces 200 lignes remplacent une bibliothèque, et c'est une décision documentée
// (docs/DECISION-ARCHITECTURE-SERVEUR.md, §1). La raison tient en une phrase :
// OAuth 2.0 n'a pas bougé depuis 2012, alors que les bibliothèques
// d'authentification de 2024 sont mortes ou ont imposé des reprises de données.
// Ce fichier, lui, se relira tel quel en 2031.
//
// Trois protections, et aucune n'est décorative :
//
//   · **L'état** — une valeur tirée au hasard, posée dans un témoin de connexion
//     avant le départ et exigée au retour. Sans elle, n'importe quel site peut
//     fabriquer un lien de retour et connecter un visiteur sous une identité
//     qui n'est pas la sienne.
//   · **Le vérificateur** (procédé PKCE, côté Google) — un secret tiré au
//     hasard dont seule l'empreinte part chez Google ; il faut présenter
//     l'original pour échanger le code. Un code intercepté en route ne sert
//     donc à rien.
//   · **L'adresse de retour est construite ici**, à partir d'un réglage, jamais
//     à partir de ce que le visiteur demande. C'est ce qui empêche de faire
//     rebondir une connexion vers un site étranger.
//
// Aucune permission n'est demandée à GitHub : l'écran de consentement est vide,
// et l'accès obtenu se limite aux informations publiques du profil. Chez Google,
// trois permissions et pas une de plus — le nom, l'adresse, la photo — parce
// qu'une seule de plus déclencherait une procédure de validation longue.
// ─────────────────────────────────────────────────────────────────────────────

import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Environnement } from "./environnement";
import { lireSession, ouvrirSession, trouverOuCreer, NOM_TEMOIN } from "./session";

/** Dix minutes : le temps de lire un écran de consentement, pas davantage. */
const VIE_ETAT = 600;

type Ctx = Context<{ Bindings: Environnement }>;

// ── Les briques communes ────────────────────────────────────────────────────

function origine(c: Ctx): string {
  // Le réglage d'abord : l'adresse de retour doit être celle qui est déclarée
  // chez Google et chez GitHub, pas celle que le visiteur a tapée.
  return c.env.SITE ?? new URL(c.req.url).origin;
}

function alea(octets = 32): string {
  const t = new Uint8Array(octets);
  crypto.getRandomValues(t);
  return b64url(t);
}

function b64url(octets: Uint8Array): string {
  let s = "";
  for (const o of octets) s += String.fromCharCode(o);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function empreinteS256(valeur: string): Promise<string> {
  const brut = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(valeur),
  );
  return b64url(new Uint8Array(brut));
}

/**
 * Où renvoyer la personne une fois connectée.
 *
 * Seul un chemin du site est accepté : il doit commencer par une barre unique.
 * Une adresse complète, ou une adresse commençant par deux barres — qui désigne
 * un autre site — est refusée et remplacée par l'accueil. Sans ce filtre,
 * l'adresse de connexion devient un tremplin vers n'importe quel site, signé
 * par notre nom de domaine.
 */
function suiteSure(valeur: string | undefined): string {
  if (!valeur) return "/";
  if (!valeur.startsWith("/") || valeur.startsWith("//")) return "/";
  return valeur;
}

function poserTemoin(c: Ctx, nom: string, valeur: string, secondes: number) {
  setCookie(c, nom, valeur, {
    path: "/",
    httpOnly: true,
    // En place partout sauf sur la machine de développement, qui parle en clair.
    secure: origine(c).startsWith("https://"),
    // « Lax » laisse passer le témoin au retour de Google, qui est une
    // navigation venue d'un autre site. « Strict » le bloquerait, et la
    // connexion échouerait sans message.
    sameSite: "Lax",
    maxAge: secondes,
  });
}

/** Une panne de connexion se raconte à la personne, pas au journal seul. */
function echec(c: Ctx, motif: string) {
  return c.redirect(`/?connexion=echec&motif=${encodeURIComponent(motif)}`, 302);
}

// ── Google ──────────────────────────────────────────────────────────────────

export async function googleEntree(c: Ctx) {
  if (!c.env.GOOGLE_ID || !c.env.GOOGLE_SECRET) {
    return c.json({ erreur: "connexion Google non configurée" }, 503);
  }
  const etat = alea();
  const verificateur = alea();
  poserTemoin(c, "etat_google", etat, VIE_ETAT);
  poserTemoin(c, "verif_google", verificateur, VIE_ETAT);
  poserTemoin(c, "suite", suiteSure(c.req.query("suite")), VIE_ETAT);

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", c.env.GOOGLE_ID);
  url.searchParams.set("redirect_uri", `${origine(c)}/api/auth/google/retour`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", etat);
  url.searchParams.set("code_challenge", await empreinteS256(verificateur));
  url.searchParams.set("code_challenge_method", "S256");
  // Sans cela, quelqu'un qui a plusieurs comptes Google est reconnecté
  // silencieusement avec le dernier utilisé, souvent le mauvais.
  url.searchParams.set("prompt", "select_account");
  return c.redirect(url.toString(), 302);
}

export async function googleRetour(c: Ctx) {
  const code = c.req.query("code");
  const etat = c.req.query("state");
  const attendu = getCookie(c, "etat_google");
  const verificateur = getCookie(c, "verif_google");
  const suite = suiteSure(getCookie(c, "suite"));
  deleteCookie(c, "etat_google", { path: "/" });
  deleteCookie(c, "verif_google", { path: "/" });
  deleteCookie(c, "suite", { path: "/" });

  if (c.req.query("error")) return echec(c, "refus");
  if (!code || !etat || !attendu || etat !== attendu || !verificateur) {
    return echec(c, "etat");
  }

  const reponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_ID!,
      client_secret: c.env.GOOGLE_SECRET!,
      redirect_uri: `${origine(c)}/api/auth/google/retour`,
      grant_type: "authorization_code",
      code_verifier: verificateur,
    }),
  });
  if (!reponse.ok) return echec(c, "echange");
  const jetons = (await reponse.json()) as { id_token?: string };
  if (!jetons.id_token) return echec(c, "jeton");

  const profil = lireJetonIdentite(jetons.id_token);
  if (!profil?.sub) return echec(c, "profil");

  // Qui est déjà là ? Si quelqu'un est connecté, c'est lui qui ajoute Google à
  // son compte — pas une nouvelle personne (session.ts, cas 2).
  const courante = await lireSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
  const personne = await trouverOuCreer(
    c.env.BASE,
    {
      service: "google",
      idExterieur: profil.sub,
      nom: profil.name || profil.email || "Sans nom",
      courriel: profil.email ?? null,
      photo: profil.picture ?? null,
    },
    courante?.id ?? null,
  );
  return await connecter(c, personne.id, suite);
}

/**
 * Lit le contenu du jeton d'identité sans en vérifier la signature.
 *
 * Ce n'est pas un raccourci : le jeton vient d'être reçu de Google par un appel
 * direct et chiffré, entre deux serveurs, en réponse à un code que nous venons
 * d'émettre. La documentation de Google autorise explicitement à sauter la
 * vérification dans ce cas précis — elle n'est indispensable que pour un jeton
 * reçu d'un tiers, ce qui n'arrive jamais ici. Vérifier la signature
 * demanderait d'aller chercher et de tenir à jour les clés publiques de Google
 * à chaque connexion, donc un appel réseau de plus et du temps de calcul, pour
 * une garantie déjà donnée par le chiffrement de la liaison.
 */
function lireJetonIdentite(jeton: string): {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
} | null {
  const parts = jeton.split(".");
  if (parts.length !== 3) return null;
  try {
    const corps = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(corps)));
  } catch {
    return null;
  }
}

// ── GitHub ──────────────────────────────────────────────────────────────────

export async function githubEntree(c: Ctx) {
  if (!c.env.GITHUB_ID || !c.env.GITHUB_SECRET) {
    return c.json({ erreur: "connexion GitHub non configurée" }, 503);
  }
  const etat = alea();
  poserTemoin(c, "etat_github", etat, VIE_ETAT);
  poserTemoin(c, "suite", suiteSure(c.req.query("suite")), VIE_ETAT);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", c.env.GITHUB_ID);
  url.searchParams.set("redirect_uri", `${origine(c)}/api/auth/github/retour`);
  url.searchParams.set("state", etat);
  // Aucune permission demandée : l'écran de consentement reste vide et l'accès
  // se limite aux informations publiques du profil.
  url.searchParams.set("scope", "");
  return c.redirect(url.toString(), 302);
}

export async function githubRetour(c: Ctx) {
  const code = c.req.query("code");
  const etat = c.req.query("state");
  const attendu = getCookie(c, "etat_github");
  const suite = suiteSure(getCookie(c, "suite"));
  deleteCookie(c, "etat_github", { path: "/" });
  deleteCookie(c, "suite", { path: "/" });

  if (c.req.query("error")) return echec(c, "refus");
  if (!code || !etat || !attendu || etat !== attendu) return echec(c, "etat");

  const reponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: c.env.GITHUB_ID!,
      client_secret: c.env.GITHUB_SECRET!,
      redirect_uri: `${origine(c)}/api/auth/github/retour`,
    }),
  });
  if (!reponse.ok) return echec(c, "echange");
  const jetons = (await reponse.json()) as { access_token?: string };
  if (!jetons.access_token) return echec(c, "jeton");

  const profilReponse = await fetch("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${jetons.access_token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      // GitHub refuse tout appel sans nom d'agent. Le nôtre dit qui appelle.
      "user-agent": "toulouseia.fr",
    },
  });
  if (!profilReponse.ok) return echec(c, "profil");
  const profil = (await profilReponse.json()) as {
    id?: number;
    login?: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
  if (!profil.id || !profil.login) return echec(c, "profil");

  // L'adresse peut manquer, et ce n'est pas une anomalie : beaucoup de gens la
  // masquent sur GitHub. La personne est créée sans adresse ; c'est l'écran de
  // profil qui la lui demandera, en lui disant pourquoi.
  //
  // Et si quelqu'un est déjà connecté, c'est lui qui ajoute GitHub à son
  // compte (session.ts, cas 2).
  const courante = await lireSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
  const personne = await trouverOuCreer(
    c.env.BASE,
    {
      service: "github",
      idExterieur: String(profil.id),
      nom: profil.name || profil.login,
      courriel: profil.email ?? null,
      photo: profil.avatar_url ?? null,
      pseudo: profil.login,
    },
    courante?.id ?? null,
  );
  return await connecter(c, personne.id, suite);
}

// ── La fin commune des deux chemins ─────────────────────────────────────────

async function connecter(c: Ctx, personneId: string, suite: string) {
  const { jeton, expire } = await ouvrirSession(
    c.env.BASE,
    personneId,
    c.req.header("user-agent") ?? null,
  );
  setCookie(c, NOM_TEMOIN, jeton, {
    path: "/",
    httpOnly: true,
    secure: origine(c).startsWith("https://"),
    sameSite: "Lax",
    expires: expire,
  });
  return c.redirect(suite, 302);
}
