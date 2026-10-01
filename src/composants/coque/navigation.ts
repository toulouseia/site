import type { NomIcone } from "@/composants/base/Icone";

/**
 * Quatre destinations, plus une commande. Le vocabulaire est banal exprès :
 * une navigation qu'il faut deviner est un échec, quelle que soit sa beauté.
 */
export const DESTINATIONS: {
  href: string;
  nom: string;
  icone: NomIcone;
  cle: keyof typeof COMPTEURS_VIDES;
}[] = [
  { href: "/projets", nom: "Projets", icone: "planche", cle: "projets" },
  { href: "/apprendre", nom: "AI Academy", icone: "cours", cle: "ressources" },
  { href: "/veille", nom: "Veille", icone: "veille", cle: "veille" },
  { href: "/outils", nom: "Outils", icone: "outil", cle: "outils" },
];

export const COMPTEURS_VIDES = {
  projets: 0,
  ressources: 0,
  veille: 0,
  outils: 0,
};

export function estActif(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
