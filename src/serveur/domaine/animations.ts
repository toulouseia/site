// ─────────────────────────────────────────────────────────────────────────────
// LE MANIFESTE D'ANIMATIONS, la frontière avec Manim
//
// Manim est une bibliothèque Python. Depuis ManimCE 0.21.0 elle s'installe
// entièrement par pip, PyAV embarque ffmpeg, pycairo et manimpango publient
// des roues binaires, mais elle reste hors de portée d'une requête web : nos
// scènes utilisent MathTex, donc une distribution LaTeX ; un rendu prend des
// dizaines de secondes à plusieurs minutes de processeur ; et le pic mémoire
// se compte en gigaoctets. Rien de tout cela n'a à vivre dans cette
// application.
//
// La frontière est un FICHIER : un manifeste JSON produit hors ligne par le
// pipeline de rendu, et lu ici comme n'importe quelle autre donnée.
//
//   scenes/*.py  →  manim  →  mp4 + poster + vtt  →  manifeste.json  →  webapp
//
// La webapp ne sait pas ce qu'est Manim. Elle sait lire ce type. Le jour où
// une animation est refaite autrement (une démonstration interactive,
// une vidéo filmée), seul le producteur du manifeste change.
//
// Ce fichier est le CONTRAT. Il est dupliqué à l'identique côté pipeline (voir
// animations/README.md) ; les deux doivent rester d'accord, et `verifierAnimation`
// est là pour le prouver au chargement plutôt qu'à l'affichage.
// ─────────────────────────────────────────────────────────────────────────────

import type { IdAnimation } from "./blocs";

/** Un rendu, dans un format donné. Une animation en a au moins un. */
export type Rendu = {
  /** mp4/H.264 est le socle : il se lit partout. webm/VP9 est un bonus. */
  format: "mp4" | "webm";
  /**
   * Chemin servi, portant l'empreinte : /animations/<id>/<empreinte>.mp4
   *
   * NE JAMAIS RECONSTRUIRE CETTE URL PAR CONVENTION dans un composant. Elle
   * est lue du manifeste, telle quelle. C'est ce qui permettra de déplacer les
   * fichiers sur un stockage objet en ne changeant que le pipeline.
   */
  src: string;
  /** Taille du fichier, en octets. Sert à décider quoi précharger. */
  octets: number;
  /**
   * L'attribut « type » COMPLET de la balise source, calculé par le pipeline,
   * pas le nom du codec. Un navigateur qui ne reconnaît pas une chaîne de
   * codecs ignore la source entière EN SILENCE : écrire « h264 » au lieu de
   * « avc1.640028 » casse la lecture pour tout le monde sans rien afficher.
   * En cas de doute, le pipeline omet le paramètre et écrit « video/mp4 ».
   */
  mime: string;
};

/** Un repère nommé dans la durée de l'animation. */
export type Chapitre = {
  /** En secondes depuis le début. */
  t: number;
  titre: string;
};

/**
 * Une animation rendue. Tout est obligatoire sauf ce qui est marqué : une
 * animation sans description alternative n'entre pas dans le manifeste, et le
 * pipeline la refuse.
 */
export type Animation = {
  id: IdAnimation;
  titre: string;

  /**
   * L'EMPREINTE. Hash du source de la scène, de la version de Manim et des
   * réglages de qualité. C'est elle qui apparaît dans l'URL du rendu, ce qui
   * permet de servir les fichiers en cache immuable : une animation refaite
   * change d'empreinte, donc d'URL, et aucun cache n'a à être purgé.
   */
  empreinte: string;

  /** En secondes. Sert à réserver la place avant que la vidéo ne charge. */
  duree: number;
  largeur: number;
  hauteur: number;
  /** Images par seconde du rendu. */
  cadence: number;

  /** Au moins un rendu. Le premier mp4 est celui qu'on sert par défaut. */
  rendus: Rendu[];

  /** L'image de couverture. Toujours présente : elle est ce qu'on voit d'abord. */
  poster: string;

  /**
   * La description pour qui n'a pas l'image : lecteur d'écran, connexion
   * coupée, mouvement réduit. Ce n'est pas une légende : c'est ce que
   * l'animation montre, dit en phrases.
   */
  alt: string;

  /** Sous-titres WebVTT, quand l'animation est commentée. */
  soustitres?: string;
  /** La transcription complète, quand elle existe. Markdown restreint. */
  transcription?: string;
  chapitres?: Chapitre[];

  /** D'où ça vient, pour qu'on puisse le refaire. */
  source: {
    /** Le fichier Python, relatif à animations/scenes/. */
    fichier: string;
    /** La classe de scène Manim. */
    scene: string;
    /** La version de Manim qui a produit ce rendu. */
    manim: string;
    /** Date de rendu, ISO. */
    rendu: string;
  };

  /**
   * Ce qui a produit ce rendu. Sert au diagnostic : sans ce champ, un
   * changement de recette d'encodage produit une empreinte différente que
   * personne ne sait expliquer six mois plus tard.
   */
  profil: {
    /** Résolution de rendu Manim, avant réduction. « 3840x2160 ». */
    rendu: string;
    /** La recette d'encodage, versionnée. « x264-crf18-tune-animation-v1 ». */
    encodage: string;
  };

  /** Sous quelle licence l'animation circule. */
  licence: string;

  /** Les notions que l'animation illustre, sert à la retrouver. */
  notions?: string[];
};

/**
 * Une animation DÉCLARÉE mais pas encore rendue. Le pipeline la connaît, la
 * classe de scène existe dans un fichier Python, mais aucun mp4 n'en est
 * sorti, parce que personne n'a encore lancé le rendu ou qu'il a échoué.
 *
 * Ce type existe pour que la leçon ait quelque chose de vrai à montrer en
 * attendant : le titre, la description, et l'aveu que le rendu manque. Une
 * balise vidéo cassée serait pire qu'un cadre qui dit ce qu'il attend.
 */
export type AnimationPrevue = {
  id: IdAnimation;
  titre: string;
  alt: string;
  /** Estimation, en secondes. Sert à réserver la place. */
  duree?: number;
  source: { fichier: string; scene: string };
  notions?: string[];
};

/**
 * Ce qu'un dépôt d'animations renvoie : soit un rendu utilisable, soit la
 * déclaration de ce qui viendra. L'union force le composant à traiter les deux
 * cas : c'est exactement ce qu'on veut.
 */
export type EtatAnimation =
  | { rendue: true; animation: Animation }
  | { rendue: false; prevue: AnimationPrevue };

/** Le manifeste entier, tel qu'il est écrit sur le disque. */
export type Manifeste = {
  /** Version du format du manifeste, pas des animations. */
  version: 1;
  genere: string;
  /** Ce qui est rendu et servable. */
  animations: Animation[];
  /** Ce qui est écrit en Python mais pas encore rendu. */
  prevues: AnimationPrevue[];
};

// ── Vérification ────────────────────────────────────────────────────────────

/**
 * Le manifeste vient d'un pipeline Python : on ne lui fait pas confiance. Cette
 * fonction est délibérément écrite à la main plutôt qu'avec un validateur,
 * c'est la seule donnée extérieure de l'application, elle ne justifie pas une
 * dépendance de plus, et une erreur ici doit être lisible sans documentation.
 */
export function verifierAnimation(brut: unknown): Animation | null {
  if (typeof brut !== "object" || brut === null) return null;
  const a = brut as Record<string, unknown>;

  const chaine = (v: unknown) => typeof v === "string" && v.length > 0;
  const nombre = (v: unknown) => typeof v === "number" && Number.isFinite(v);

  if (!chaine(a.id) || !chaine(a.titre) || !chaine(a.empreinte)) return null;
  if (!chaine(a.alt) || !chaine(a.poster) || !chaine(a.licence)) return null;
  if (!nombre(a.duree) || !nombre(a.largeur) || !nombre(a.hauteur)) return null;
  if (!nombre(a.cadence)) return null;
  if (!Array.isArray(a.rendus) || a.rendus.length === 0) return null;

  const rendus: Rendu[] = [];
  for (const r of a.rendus) {
    if (typeof r !== "object" || r === null) return null;
    const x = r as Record<string, unknown>;
    if (x.format !== "mp4" && x.format !== "webm") return null;
    if (!chaine(x.src) || !chaine(x.mime) || !nombre(x.octets)) return null;
    rendus.push({
      format: x.format,
      src: x.src as string,
      octets: x.octets as number,
      mime: x.mime as string,
    });
  }
  if (!rendus.some((r) => r.format === "mp4")) return null;

  const s = a.source as Record<string, unknown> | undefined;
  if (
    !s ||
    !chaine(s.fichier) ||
    !chaine(s.scene) ||
    !chaine(s.manim) ||
    !chaine(s.rendu)
  ) {
    return null;
  }

  const pr = a.profil as Record<string, unknown> | undefined;
  if (!pr || !chaine(pr.rendu) || !chaine(pr.encodage)) return null;

  return {
    id: a.id as string,
    titre: a.titre as string,
    empreinte: a.empreinte as string,
    duree: a.duree as number,
    largeur: a.largeur as number,
    hauteur: a.hauteur as number,
    cadence: a.cadence as number,
    rendus,
    poster: a.poster as string,
    alt: a.alt as string,
    soustitres: chaine(a.soustitres) ? (a.soustitres as string) : undefined,
    transcription: chaine(a.transcription)
      ? (a.transcription as string)
      : undefined,
    chapitres: Array.isArray(a.chapitres)
      ? (a.chapitres as unknown[])
          .filter(
            (c): c is Chapitre =>
              typeof c === "object" &&
              c !== null &&
              nombre((c as Record<string, unknown>).t) &&
              chaine((c as Record<string, unknown>).titre),
          )
          .map((c) => ({ t: c.t, titre: c.titre }))
      : undefined,
    source: {
      fichier: s.fichier as string,
      scene: s.scene as string,
      manim: s.manim as string,
      rendu: s.rendu as string,
    },
    profil: {
      rendu: pr.rendu as string,
      encodage: pr.encodage as string,
    },
    licence: a.licence as string,
    notions: Array.isArray(a.notions)
      ? (a.notions as unknown[]).filter((n): n is string => typeof n === "string")
      : undefined,
  };
}

/** Le rendu à servir en premier : mp4 d'abord, c'est celui qui se lit partout. */
export function renduPrincipal(a: Animation): Rendu {
  return a.rendus.find((r) => r.format === "mp4") ?? a.rendus[0];
}

/** « 1:24 », la durée telle qu'elle s'écrit sur un lecteur. */
export function horloge(secondes: number): string {
  const s = Math.max(0, Math.round(secondes));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Comme `verifierAnimation`, pour une scène déclarée mais pas rendue. */
export function verifierPrevue(brut: unknown): AnimationPrevue | null {
  if (typeof brut !== "object" || brut === null) return null;
  const a = brut as Record<string, unknown>;
  const chaine = (v: unknown) => typeof v === "string" && v.length > 0;
  if (!chaine(a.id) || !chaine(a.titre) || !chaine(a.alt)) return null;
  const s = a.source as Record<string, unknown> | undefined;
  if (!s || !chaine(s.fichier) || !chaine(s.scene)) return null;
  return {
    id: a.id as string,
    titre: a.titre as string,
    alt: a.alt as string,
    duree:
      typeof a.duree === "number" && Number.isFinite(a.duree)
        ? a.duree
        : undefined,
    source: { fichier: s.fichier as string, scene: s.scene as string },
    notions: Array.isArray(a.notions)
      ? (a.notions as unknown[]).filter((n): n is string => typeof n === "string")
      : undefined,
  };
}
