// ─────────────────────────────────────────────────────────────────────────────
// Le programme serveur — la seconde porte.
//
// Le même déploiement Cloudflare sert deux choses : les pages fabriquées par
// `next build`, qui ne passent par aucun calcul et sont gratuites sans
// plafond, et ce programme, qui ne répond qu'aux adresses commençant par
// `/api/`. Rien ne migre : on ajoute à côté. Si ce fichier a un défaut, si la
// base est vide, si un plafond est atteint, le site continue de s'afficher —
// c'est la propriété la plus précieuse de cette architecture, et c'est pour
// elle qu'elle a été choisie (docs/DECISION-ARCHITECTURE-SERVEUR.md, §1).
//
// Le piège est dans le fichier de configuration, pas ici : sans
// `assets.run_worker_first`, une requête de navigation est servie par un
// fichier et n'atteint jamais ce programme. Le symptôme documenté est une page
// introuvable au retour d'une connexion Google, sans message d'erreur.
// ─────────────────────────────────────────────────────────────────────────────

import { Hono } from "hono";
import { getCookie, deleteCookie } from "hono/cookie";
import type { Environnement } from "./environnement";
import {
  googleEntree,
  googleRetour,
  githubEntree,
  githubRetour,
} from "./oauth";
import { lireSession, fermerSession, NOM_TEMOIN } from "./session";
import { mettreAJourMoi, reponseMoi } from "./profil";
import {
  ajouterMembre,
  deposer,
  listerMiens,
  listerPublies,
  lireParSlug,
  modifier,
  retirerImage,
  retirerMembre,
  servirImage,
  supprimer,
  televerserImage,
} from "./projets";

const app = new Hono<{ Bindings: Environnement }>();

// ── L'adresse de santé ──────────────────────────────────────────────────────
//
// Elle existe pour trois lecteurs : la personne qui vient de mettre en ligne et
// veut savoir si le programme est bien branché, la sonde extérieure qui vérifie
// toutes les trois minutes que le site répond, et le programme de mesure du
// temps de calcul. Elle ne lit rien, n'écrit rien, et ne dit rien qu'on ne
// puisse afficher publiquement.
app.get("/api/sante", (c) =>
  c.json({
    etat: "ok",
    ou: c.env.OU ?? "inconnu",
    // L'heure de Cloudflare, pas celle du visiteur. Sur Workers l'horloge
    // n'avance pas pendant un calcul — c'est une protection, pas une panne —
    // donc ce champ date la réponse, il ne mesure aucune durée.
    heure: new Date().toISOString(),
  }),
);

// ── Le temps de calcul, la seule inconnue budgétaire ────────────────────────
//
// L'offre gratuite donne 10 millisecondes de calcul par appel. Personne n'a
// jamais mesuré ce que coûte un appel de cette application, et c'est le seul
// risque de facture du projet. Cette adresse fait tourner le processeur un
// nombre de tours donné, pour que la mesure faite dans les journaux
// (`outils/mesurer-temps-api.sh`) compare des appels vides à des appels
// chargés et donne une pente.
//
// Elle est volontairement sans intérêt pour un visiteur, et sans effet : elle
// ne lit aucune donnée et n'en écrit aucune.
app.get("/api/mesure", (c) => {
  const tours = Math.min(Number(c.req.query("tours") ?? 0), 200000);
  let somme = 0;
  for (let i = 0; i < tours; i++) somme += Math.sqrt(i) % 7;
  return c.json({ tours, somme: Math.round(somme) });
});

// ── La connexion ────────────────────────────────────────────────────────────
//
// Quatre adresses par service, toujours les mêmes : on part, on revient. Le
// code est dans `oauth.ts`, avec les trois protections expliquées en tête de
// fichier. Ici on ne fait que nommer les portes.
//
// Ces adresses commencent par `/api/`, et c'est ce qui les fait fonctionner :
// le retour de Google est une navigation ordinaire du navigateur, et sans le
// réglage `run_worker_first` elle serait servie par un fichier. Le symptôme
// serait une page introuvable au retour du consentement, sans message.
app.get("/api/auth/google/entree", googleEntree);
app.get("/api/auth/google/retour", googleRetour);
app.get("/api/auth/github/entree", githubEntree);
app.get("/api/auth/github/retour", githubRetour);

// ── Qui est connecté, et son profil ─────────────────────────────────────────
//
// La seule adresse que les pages du site interrogent pour savoir s'il faut
// afficher « se connecter » ou le nom de la personne. Elle répond toujours 200,
// avec ou sans personne : une absence de session n'est pas une erreur. La
// forme de la réponse est dans `profil.ts`, parce que `PUT` la rend aussi.
app.get("/api/moi", async (c) => {
  const personne = await lireSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
  if (!personne) return c.json({ connecte: false });
  return c.json(reponseMoi(personne));
});

// Ce qu'une personne peut changer d'elle-même : nom, origine, adresse, moyens
// de contact. Le code est dans `profil.ts`, avec la liste blanche.
app.put("/api/moi", mettreAJourMoi);

// ── Les projets ─────────────────────────────────────────────────────────────
//
// Six adresses, dans `projets.ts` avec leur liste blanche, le calcul du nom
// court et le cache du mur. « Les miens » est déclarée avant « :slug », sinon
// `miens` serait pris pour le nom court d'un projet.
app.get("/api/projets", listerPublies);
app.get("/api/projets/miens", listerMiens);
app.get("/api/projets/:slug", lireParSlug);
app.post("/api/projets", deposer);
app.put("/api/projets/:id", modifier);
app.delete("/api/projets/:id", supprimer);

// L'image d'un projet : trois adresses sur le segment `/image`, montées avant le
// filet 404 de `/api/`. Le service (`GET`) est public — une image sur le mur se
// voit sans être connecté ; le téléversement et le retrait sont authentifiés,
// comme toutes les écritures. Le segment supplémentaire les distingue des routes
// `/api/projets/:slug` : aucune collision d'ordre.
app.get("/api/projets/:id/image", servirImage);
app.put("/api/projets/:id/image", televerserImage);
app.delete("/api/projets/:id/image", retirerImage);

// Les membres participants d'un projet : deux adresses sur le segment `/membres`,
// montées avant le filet 404. Ajout et retrait sont réservés au porteur ou au
// bureau (`peutToucher`), comme les autres écritures ; le membre n'obtient aucun
// droit. La lecture se fait sur la fiche (`GET /api/projets/:slug`), jamais ici.
// Le segment `/membres` les distingue de `/api/projets/:slug` : pas de collision.
app.post("/api/projets/:id/membres", ajouterMembre);
app.delete("/api/projets/:id/membres/:personneId", retirerMembre);

// ── La déconnexion ──────────────────────────────────────────────────────────
//
// Elle supprime la ligne de session, ce qu'aucun jeton signé ne permettrait, et
// efface le témoin. En POST, pas en GET : une adresse de déconnexion ouverte en
// GET se déclenche à la première image chargée par un site tiers.
app.post("/api/deconnexion", async (c) => {
  await fermerSession(c.env.BASE, getCookie(c, NOM_TEMOIN));
  deleteCookie(c, NOM_TEMOIN, { path: "/" });
  return c.json({ connecte: false });
});

// ── Tout le reste de `/api/` ────────────────────────────────────────────────
//
// Une adresse inconnue sous `/api/` répond en JSON, jamais par la page 404 du
// site : ce qui appelle ici est un programme, pas un lecteur.
app.all("/api/*", (c) => c.json({ erreur: "adresse inconnue" }, 404));

// Une erreur que rien n'a attrapée (la base qui refuse, une exception) répond
// elle aussi en JSON, avec un `erreur` : la promesse « toutes en JSON » vaut
// aussi quand ça casse. Le détail va dans le journal de la plateforme, pas au
// client.
app.onError((e, c) => {
  console.error("erreur non attrapée", c.req.method, new URL(c.req.url).pathname, e);
  return c.json({ erreur: "erreur interne du serveur" }, 500);
});

export default {
  fetch(requete: Request, env: Environnement, contexte: ExecutionContext) {
    const chemin = new URL(requete.url).pathname;
    // Hors de `/api/`, on rend la main aux pages. Ce cas ne devrait pas se
    // produire — la configuration ne lance ce programme en premier que sur
    // `/api/*` — mais s'y fier serait faire reposer l'affichage du site sur un
    // réglage, et c'est justement ce qu'on a refusé.
    if (!chemin.startsWith("/api/")) return env.PAGES.fetch(requete);
    return app.fetch(requete, env, contexte);
  },
} satisfies ExportedHandler<Environnement>;
