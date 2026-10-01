import type {
  Accueil,
  Canal,
  Etat,
  FormatRessource,
  Niveau,
  TypeEntree,
} from "@/donnees/types";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const MOIS = [
  "janv.",
  "févr.",
  "mars",
  "avril",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

const MOIS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/**
 * Les trois nombres d'une date ISO. Les dates du code sont des jours
 * (`2026-08-13`) ; celles de la base portent l'heure (`2026-09-15T12:00:00Z`).
 * Les dix premiers caractères sont les mêmes dans les deux cas.
 */
function jourDe(iso: string): [number, number, number] {
  const [a, m, j] = iso.slice(0, 10).split("-").map(Number);
  return [a, m, j];
}

/** « 13 août » — sans année quand c'est l'année courante. */
export function dateCourte(iso: string) {
  const [a, m, j] = jourDe(iso);
  return a === 2026
    ? `${j} ${MOIS[m - 1]}`
    : `${j} ${MOIS[m - 1]} ${String(a).slice(2)}`;
}

export function dateLongue(iso: string) {
  const [a, m, j] = jourDe(iso);
  return `${j} ${MOIS_LONG[m - 1]} ${a}`;
}

export function moisAnnee(iso: string) {
  const [a, m] = jourDe(iso);
  return `${MOIS_LONG[m - 1]} ${a}`;
}

/**
 * Le présent : la date de fabrication du site. Les pages sont produites une
 * fois, à la mise en ligne, donc « il y a trois jours » vieillit jusqu'au
 * déploiement suivant. C'est accepté — le site est redéployé à chaque
 * changement de contenu, et le contenu est ce qui date.
 */
export const AUJOURDHUI = new Date().toISOString().slice(0, 10);

export function joursDepuis(iso: string) {
  const ms = Date.parse(AUJOURDHUI) - Date.parse(iso.slice(0, 10));
  return Math.round(ms / 86_400_000);
}

/** « 2 j », « 3 sem. », « 4 mois » — court, pour une colonne étroite. */
export function ecart(iso: string) {
  const j = joursDepuis(iso);
  if (j <= 0) return "auj.";
  if (j === 1) return "hier";
  if (j < 14) return `${j} j`;
  if (j < 61) return `${Math.round(j / 7)} sem.`;
  return `${Math.round(j / 30)} mois`;
}

export function dans(iso: string) {
  const j = -joursDepuis(iso);
  if (j <= 0) return "passée";
  if (j === 1) return "demain";
  if (j < 14) return `dans ${j} j`;
  return `dans ${Math.round(j / 7)} sem.`;
}

export function duree(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 24) return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  return `~${Math.round(h)} h`;
}

export const NOM_ETAT: Record<Etat, string> = {
  idee: "Idée",
  chantier: "En chantier",
  essai: "En essai",
  service: "En service",
};

/** Le cran de la jauge, de 0 à 3. */
export const CRAN_ETAT: Record<Etat, 0 | 1 | 2 | 3> = {
  idee: 0,
  chantier: 1,
  essai: 2,
  service: 3,
};

/**
 * Les deux seuls mots de l'accueil, et ils sont écrits au présent du porteur,
 * pas au futur du lecteur : « ouvert aux échanges » n'engage à rien d'autre
 * qu'à répondre, et « au complet » se dit sans avoir à refuser quelqu'un.
 */
export const NOM_ACCUEIL: Record<Accueil, string> = {
  ouvert: "Ouvert aux échanges",
  complet: "Au complet pour le moment",
};

/** La même chose en deux mots, pour une carte ou une ligne de liste. */
export const NOM_ACCUEIL_COURT: Record<Accueil, string> = {
  ouvert: "Ouvert",
  complet: "Au complet",
};

export const NOM_CANAL: Record<Canal, string> = {
  discord: "Discord",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  instagram: "Instagram",
  github: "GitHub",
  mail: "Courriel",
};

export const NOM_FORMAT: Record<FormatRessource, string> = {
  cours: "Cours",
  notes: "Notes",
  video: "Vidéo",
  atelier: "Atelier",
  papier: "Papier",
  jeu: "Jeu de données",
};

export const NOM_NIVEAU: Record<Niveau, string> = {
  depart: "Débutant",
  milieu: "Confirmé",
  fond: "Avancé",
};

export const NOM_TYPE_ENTREE: Record<TypeEntree, string> = {
  modele: "Modèle",
  outil: "Outil",
  papier: "Papier",
  usage: "Usage",
  chiffre: "Chiffre",
};

export function pluriel(n: number, un: string, plusieurs: string) {
  return n <= 1 ? un : plusieurs;
}

/**
 * Le projet ouvert, lu dans l'adresse. Renvoie son nom court, ou rien du tout
 * quand on est sur le tableau.
 *
 * La barre finale est retirée avant tout : `/projets/` et `/projets` désignent
 * le même écran, et l'hébergeur comme le voisin qui recopie un lien ajoutent
 * cette barre sans prévenir. Sans ce nettoyage, `/projets/` donnait un nom
 * vide — ni un projet, ni rien — et la fiche restait blanche en ligne alors
 * qu'elle s'affichait sur la machine du développeur.
 */
export function projetOuvert(pathname: string) {
  const chemin = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (!chemin.startsWith("/projets/")) return null;
  const slug = chemin.slice("/projets/".length);
  return slug || null;
}

/** L'adresse `/projets/fiche` : un projet de la base, dont le nom court est dans `?p=`. */
export const CHEMIN_FICHE = "/projets/fiche";

export function estFicheDistante(pathname: string) {
  return pathname.replace(/\/+$/, "") === CHEMIN_FICHE;
}

/**
 * L'adresse d'un projet, et c'est la seule fonction qui la décide.
 *
 * Un projet écrit dans le code a sa page fabriquée d'avance : `/projets/terra`.
 * Un projet venu de la base n'en a pas — les pages sont fabriquées une fois,
 * à la mise en ligne — et il se lit sur la page commune, `/projets/fiche?p=`.
 * La marque `distant` est posée par la fusion (`donnees/distant.ts`).
 */
export function adresseProjet(p: { slug: string; distant?: boolean }) {
  return p.distant
    ? `${CHEMIN_FICHE}?p=${encodeURIComponent(p.slug)}`
    : `/projets/${p.slug}`;
}

/** Retire accents et casse : la recherche ne doit pas punir la frappe rapide. */
export function aplatir(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Où mène un moyen de contact, quand il mène quelque part.
 *
 * Renvoie une adresse à ouvrir, ou `null` quand le service n'en a pas : dans ce
 * dernier cas il ne reste qu'à recopier la valeur, et l'application affiche le
 * bouton « Copier » sans bouton d'ouverture.
 *
 * Trois choses sont décidées ici, et il vaut mieux les écrire :
 *
 *   · **Discord n'a pas d'adresse pour un pseudonyme.** Un compte ne s'ouvre
 *     que par son numéro interne, que personne ne donne. Seule une invitation
 *     (`discord.gg/…`) est une adresse. Un pseudonyme se recopie, donc, et
 *     c'est tout.
 *   · **Un numéro français écrit à la française devient international.** Dix
 *     chiffres commençant par zéro — la façon dont tout le monde écrit son
 *     numéro ici — donnent `33` suivi des neuf chiffres restants, parce que
 *     WhatsApp n'ouvre une conversation que sur un numéro international. Un
 *     numéro déjà écrit avec `+` est repris tel quel. C'est une supposition
 *     assumée : l'association est à Toulouse.
 *   · **Une valeur déjà écrite comme une adresse est reprise telle quelle.**
 *     Quelqu'un qui colle `https://…` sait ce qu'il fait ; on ne va pas coller
 *     un nom de service devant.
 */
export function lienDuCanal(canal: Canal, valeurBrute: string): string | null {
  const valeur = valeurBrute.trim();
  if (!valeur) return null;

  if (/^https?:\/\//i.test(valeur)) return valeur;

  const pseudo = valeur.replace(/^@/, "");

  switch (canal) {
    case "mail":
      return valeur.includes("@") ? `mailto:${valeur}` : null;

    case "github":
      return pseudo ? `https://github.com/${pseudo}` : null;

    case "instagram":
      return pseudo ? `https://instagram.com/${pseudo}` : null;

    case "telegram":
      return pseudo ? `https://t.me/${pseudo}` : null;

    case "whatsapp": {
      const chiffres = valeur.replace(/[^\d+]/g, "");
      if (chiffres.startsWith("+")) return `https://wa.me/${chiffres.slice(1)}`;
      const nus = chiffres.replace(/\D/g, "");
      if (nus.length === 10 && nus.startsWith("0")) {
        return `https://wa.me/33${nus.slice(1)}`;
      }
      return nus.length >= 11 ? `https://wa.me/${nus}` : null;
    }

    case "discord":
      // Un pseudonyme Discord ne s'ouvre pas : il se recopie.
      return null;
  }
}
