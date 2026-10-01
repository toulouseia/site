import type { Projet } from "./types";

// Les projets vivent désormais dans la base, déposés par le formulaire : ils y
// sont modifiables et portent leurs membres. Ce fichier ne garde que les projets
// qui ne peuvent pas encore entrer en base — écrits ici, dans le code, ce qui
// garantit qu'ils s'affichent quoi qu'il arrive au serveur. Le mur fusionne les
// deux sources par slug (la base l'emporte).
//
// Il n'en reste qu'un : « site ». Le modèle interdit un projet ouvert sans dépôt
// public, or le dépôt du site n'est pas encore ouvert (son historique doit être
// relu et extrait dans un dépôt à part). Le jour où ce dépôt existe, « site »
// rejoint la base comme les autres, et disparaît d'ici.
//
// Le mur est dessiné pour dix-sept cases. Il en a cinq : les cases vides portent
// la trame, et disent que la place existe.

export const PROJETS: Projet[] = [
  {
    id: "pr-site",
    slug: "site",
    nom: "Le site de l'association",
    resume: "Ce site : le mur des projets, la veille, les outils. Fabriqué avec des agents, à deux efforts.",
    presentation:
      "Chaque écran est commandé à deux agents en parallèle, avec la même consigne et deux niveaux d'effort, puis jugé à l'écran. L'identité visuelle est construite par programme : aucun tracé du signe n'est dessiné à la main. Le dépôt s'ouvrira une fois son historique relu.",
    etat: "service",
    categorie: "open",
    pole: "Agentic",
    porteurId: "p-alexis",
    accueil: "ouvert",
    outils: ["Next.js", "TypeScript", "Cloudflare Workers", "Claude Code"],
    debut: "2026-08-04",
    maj: "2026-09-14",
    image: "/projets/site.png",
    imageAlt: "Le logo de Toulouse IA.",
  },
];
