"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlocAnimation } from "@/serveur/domaine/blocs";
import type { EtatAnimation } from "@/serveur/domaine/animations";
import { horloge } from "@/serveur/domaine/animations";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { Ligne } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// LE LECTEUR D'ANIMATIONS.
//
// Il lit un mp4 rendu par Manim. Ce n'est pas une vidéo de divertissement :
// c'est une figure de cours, et une figure de cours se manipule.
//
//   - On revient en arrière image par image. Une animation mathématique se
//     comprend souvent sur trois images, pas sur trente secondes.
//   - On ralentit. Un gradient qui tourne trop vite ne s'observe pas.
//   - On peut ne pas la lire du tout : la description alternative est un
//     paragraphe, pas une étiquette, et elle est accessible en un bouton.
//   - Le mouvement réduit est respecté : rien ne démarre tout seul, et la
//     vignette reste une image fixe tant qu'on ne demande pas.
//
// SOUS LE LECTEUR, RIEN. C'est le retour du 16 septembre 2026 : « trop
// d'écritures ». Le bloc portait une légende en figcaption SOUS le cadre, plus
// une ligne de raccourcis clavier, et la légende du chapitre 1 recopiait mot
// pour mot le texte alternatif de la scène. Une figure lue deux fois n'est pas
// lue deux fois : elle est lue une fois, et l'autre est du bruit.
//
// La phrase du bloc passe donc AU-DESSUS du cadre — elle dit ce qu'on va voir,
// et se lit avant, pas après — et la description alternative n'apparaît plus
// que derrière le bouton TEXTE. Elle reste dans le DOM en permanence, en
// `sr-only`, et le lecteur la désigne par `aria-describedby` : un lecteur
// d'écran l'entend sans avoir à trouver un bouton. La copie visible du panneau
// est donc `aria-hidden`, sans quoi elle serait annoncée deux fois.
//
// L'ÉTAT « PAS ENCORE RENDUE » est traité au même niveau que l'état normal.
// C'est l'état le plus fréquent pendant les premiers mois : les scènes sont
// écrites avant d'être rendues, et le rendu demande Python, LaTeX et ffmpeg
// sur la machine de quelqu'un. Le cadre affiche alors ce que l'animation
// montrera, et d'où elle sortira.
// ─────────────────────────────────────────────────────────────────────────────

const VITESSES = [0.5, 1, 1.5] as const;

// ── La pleine largeur ───────────────────────────────────────────────────────
//
// LA VIDÉO SORT DE LA COLONNE. Les scènes sont rendues en 1920 × 1080 et la
// colonne de lecture fait 44rem, soit 704 px moins ses marges : servie là, une
// animation est réduite presque trois fois. Un rond de sortie mesuré à 82 px au
// rendu n'en fait plus trente, et une cote de 20 points devient illisible.
//
// LA PROSE GARDE SA COLONNE, la figure prend la fenêtre. C'est ce que fait la
// source, et c'est la seule façon de rendre à l'animation la taille pour
// laquelle elle a été composée.
//
// COMMENT. `100cqw` est la largeur de la ZONE DE LECTURE, déclarée conteneur
// dans `CadreLecon.tsx` — et non celle de la fenêtre. La différence n'est pas
// théorique : la barre latérale du cours prend 224 px, et une figure calée sur
// `100vw` sortait de 88 px à droite à 1280, invisiblement, parce que la zone
// coupe ce qui déborde. `50 %` se lit sur la colonne, qui est centrée dans
// cette zone : reculer d'une demi-largeur de figure la recentre dessus.
//
// LES 2rem de gouttière laissent la figure respirer contre les bords de la
// zone. Le plafond de 1600 px évite qu'une animation occupe tout un très grand
// écran.
const LARGEUR_FIGURE = "min(calc(100cqw - 2rem), 1600px)";

const pleineLargeur = {
  width: LARGEUR_FIGURE,
  marginLeft: `calc(50% - ${LARGEUR_FIGURE} / 2)`,
} as const;

/**
 * La phrase qui dit ce qu'on va voir, posée AVANT le cadre.
 *
 * C'est un `figcaption`, et il a le droit d'être le premier enfant d'un
 * `figure` : la spécification HTML l'admet en première comme en dernière
 * position, et c'est la position qui lui convient ici, puisqu'elle annonce au
 * lieu de commenter.
 */
function Annonce({ texte }: { texte: string | undefined }) {
  if (!texte) return null;
  return (
    <figcaption className="t-corps mb-2 max-w-[62ch] text-[0.8125rem] leading-[1.45] text-gris-72">
      <Ligne texte={texte} />
    </figcaption>
  );
}

export function BAnimation({
  bloc,
  etat,
  seule = true,
}: {
  bloc: BlocAnimation;
  etat: EtatAnimation | null;
  /**
   * Vraie quand la leçon ne porte qu'une animation. Décide du préchargement :
   * les métadonnées d'un clip unique valent la requête, six requêtes au
   * chargement d'une page ne les valent pas. Le poster suffit, et la place est
   * déjà réservée par le rapport de forme.
   */
  seule?: boolean;
}) {
  if (!etat) return <Absente bloc={bloc} />;
  if (!etat.rendue) return <Prevue bloc={bloc} prevue={etat.prevue} />;
  return <Lecteur bloc={bloc} etat={etat} seule={seule} />;
}

// ── Le cas normal ───────────────────────────────────────────────────────────

function Lecteur({
  bloc,
  etat,
  seule,
}: {
  bloc: BlocAnimation;
  etat: Extract<EtatAnimation, { rendue: true }>;
  seule: boolean;
}) {
  const a = etat.animation;
  const video = useRef<HTMLVideoElement>(null);
  const cadre = useRef<HTMLDivElement>(null);

  const [joue, setJoue] = useState(false);
  const [t, setT] = useState(0);
  const [vitesse, setVitesse] = useState<number>(1);
  const [texte, setTexte] = useState(false);
  const [panne, setPanne] = useState(false);

  const pasImage = 1 / (a.cadence || 30);

  const basculer = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setPanne(true));
    else v.pause();
  }, []);

  const decaler = useCallback(
    (secondes: number) => {
      const v = video.current;
      if (!v) return;
      v.pause();
      v.currentTime = Math.min(
        Math.max(0, v.currentTime + secondes),
        a.duree || v.duration || 0,
      );
    },
    [a.duree],
  );

  // Démarrage à l'entrée dans l'écran, jamais si le visiteur a demandé moins
  // de mouvement, et une seule fois.
  useEffect(() => {
    if (!bloc.auto || !cadre.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          void video.current?.play().catch(() => {});
          observateur.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    observateur.observe(cadre.current);
    return () => observateur.disconnect();
  }, [bloc.auto]);

  // Les raccourcis ne valent que lorsque le cadre a le clavier : une page de
  // leçon qui volerait la barre d'espace au défilement serait insupportable.
  const touches = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      basculer();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      decaler(e.shiftKey ? -pasImage : -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      decaler(e.shiftKey ? pasImage : 1);
    }
  };

  const duree = a.duree || 1;
  const part = Math.min(1, t / duree);

  if (panne) return <Absente bloc={bloc} motif="Le rendu n'a pas pu être lu." />;

  const idAlt = `${bloc.id}-alt`;

  return (
    <figure className="mt-6" style={pleineLargeur}>
      <Annonce texte={bloc.legende} />

      {/* La description est TOUJOURS dans le DOM, et le lecteur la désigne.
          Le bouton TEXTE ne fait que la rendre visible. */}
      <p id={idAlt} className="sr-only">
        {a.alt}
      </p>

      <div
        ref={cadre}
        tabIndex={0}
        onKeyDown={touches}
        aria-label={`Animation : ${a.titre}`}
        aria-describedby={idAlt}
        className="group relative border border-filet-fort bg-sombre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brique"
      >
        <div
          className="relative"
          style={{ aspectRatio: `${a.largeur} / ${a.hauteur}` }}
        >
          <video
            ref={video}
            poster={a.poster}
            preload={seule ? "metadata" : "none"}
            playsInline
            muted={!a.soustitres}
            loop={bloc.boucle}
            className="absolute inset-0 h-full w-full"
            onPlay={() => setJoue(true)}
            onPause={() => setJoue(false)}
            onEnded={() => setJoue(false)}
            onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
            onError={() => setPanne(true)}
            onClick={basculer}
          >
            {a.rendus.map((r) => (
              /* Le type vient du manifeste tel quel : le reconstruire ici
                 ferait ignorer la source en silence à la moindre faute. */
              <source key={r.src} src={r.src} type={r.mime} />
            ))}
            {a.soustitres ? (
              <track
                kind="subtitles"
                srcLang="fr"
                label="Français"
                src={a.soustitres}
                default
              />
            ) : null}
          </video>

          {!joue && t === 0 ? (
            <button
              type="button"
              onClick={basculer}
              className="absolute inset-0 flex items-center justify-center bg-sombre/25 transition-colors hover:bg-sombre/10"
            >
              <span className="flex h-12 w-12 items-center justify-center border border-papier/70 bg-sombre/80 text-papier">
                <Icone nom="fleche-droite" className="h-5 w-5" epaisseur={1.6} />
              </span>
              <span className="sr-only">Lire l&apos;animation</span>
            </button>
          ) : null}
        </div>

        {/* La règle de progression : un filet, pas une barre. */}
        <div className="relative h-[3px] bg-nuit-28">
          <span
            aria-hidden
            className="absolute top-0 left-0 h-full w-full origin-left bg-brique-nuit transition-transform duration-100 ease-linear"
            style={{ transform: `scaleX(${part})` }}
          />
        </div>

        <div className="flex items-center gap-1 border-t border-nuit-28 px-2 py-1.5">
          <button
            type="button"
            onClick={basculer}
            className="flex h-7 items-center gap-1.5 px-1.5 text-nuit-86 transition-colors hover:text-papier"
          >
            <Icone
              nom={joue ? "moins" : "fleche-droite"}
              className="h-3.5 w-3.5"
            />
            <span className="t-etq">{joue ? "Pause" : "Lire"}</span>
          </button>

          <button
            type="button"
            onClick={() => decaler(-pasImage)}
            aria-label="Image précédente"
            className="flex h-7 w-7 items-center justify-center text-nuit-72 transition-colors hover:text-papier"
          >
            <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => decaler(pasImage)}
            aria-label="Image suivante"
            className="flex h-7 w-7 items-center justify-center text-nuit-72 transition-colors hover:text-papier"
          >
            <Icone nom="fleche-droite" className="h-3.5 w-3.5" />
          </button>

          <span className="t-cote ml-1 text-[0.6875rem] text-nuit-72 tabular-nums">
            {horloge(t)} / {horloge(duree)}
          </span>

          <span className="flex-1" />

          {VITESSES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setVitesse(v);
                if (video.current) video.current.playbackRate = v;
              }}
              aria-pressed={vitesse === v}
              className={cx(
                "t-cote h-6 px-1.5 text-[0.6875rem] transition-colors",
                vitesse === v
                  ? "bg-papier text-sombre"
                  : "text-nuit-72 hover:text-papier",
              )}
            >
              ×{String(v).replace(".", ",")}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setTexte((x) => !x)}
            aria-expanded={texte}
            className="t-etq ml-1 flex h-6 items-center px-1.5 text-nuit-72 transition-colors hover:text-papier"
          >
            Texte
          </button>
        </div>

        {texte ? (
          <div className="border-t border-nuit-28 px-3 py-3">
            <p className="t-etq text-nuit-72">Ce que l&apos;animation montre</p>
            {/* La même phrase est déjà lue par `aria-describedby` : celle-ci
                est la copie visible, et elle ne doit pas être annoncée deux
                fois. */}
            <p
              aria-hidden
              className="t-corps mt-1.5 text-[0.8125rem] leading-[1.55] text-nuit-86"
            >
              {a.alt}
            </p>
            {a.chapitres?.length ? (
              <ul className="mt-3 border-t border-nuit-28">
                {a.chapitres.map((c) => (
                  <li key={c.t} className="border-b border-nuit-28">
                    <button
                      type="button"
                      onClick={() => {
                        if (video.current) video.current.currentTime = c.t;
                      }}
                      className="flex w-full items-baseline gap-2.5 py-1.5 text-left"
                    >
                      <span className="t-cote w-9 shrink-0 text-[0.6875rem] text-brique-nuit">
                        {horloge(c.t)}
                      </span>
                      <span className="t-corps text-[0.8125rem] text-nuit-86">
                        {c.titre}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {/* Les raccourcis étaient une ligne de plus SOUS le cadre, lue à
                chaque figure d'une page qui en porte six. Ils vivent ici, avec
                le reste de ce qu'on ouvre quand on le cherche. */}
            <p className="t-etq mt-3 text-nuit-72">
              Espace pour lire · flèches pour avancer d&apos;une seconde ·
              Maj + flèches pour une image
            </p>
            <p className="t-etq mt-2 text-nuit-55">
              Manim {a.source.manim} · {a.source.scene} · {a.licence}
            </p>
          </div>
        ) : null}
      </div>
    </figure>
  );
}

// ── Les deux états dégradés ─────────────────────────────────────────────────

/**
 * La scène existe en Python mais n'a pas été rendue. On montre ce qu'elle
 * montrera et d'où elle sort : c'est utile à qui lit, et actionnable pour qui
 * contribue.
 */
function Prevue({
  bloc,
  prevue,
}: {
  bloc: BlocAnimation;
  prevue: Extract<EtatAnimation, { rendue: false }>["prevue"];
}) {
  return (
    <figure className="mt-6" style={pleineLargeur}>
      <Annonce texte={bloc.legende} />
      <div
        className="trame trame-bord border border-filet-fort px-4 py-6"
        style={{ ["--trame-op" as string]: "0.14" }}
      >
        <div className="flex items-baseline gap-2.5">
          <span className="t-etq text-brique">Animation à rendre</span>
          {prevue.duree ? (
            <span className="t-cote text-[0.75rem] text-gris-58">
              ≈ {horloge(prevue.duree)}
            </span>
          ) : null}
        </div>
        <p className="t-titre mt-2 text-[1rem] leading-[1.3]">{prevue.titre}</p>
        <p className="t-corps mt-2 max-w-[62ch] text-[0.875rem] leading-[1.55] text-gris-72">
          {prevue.alt}
        </p>
        <p className="t-tech mt-3 text-[0.6875rem] text-gris-40">
          {prevue.source.fichier} · classe {prevue.source.scene}
        </p>
      </div>
    </figure>
  );
}

/** Ni rendue ni déclarée : le manifeste ne connaît pas cet identifiant. */
function Absente({
  bloc,
  motif,
}: {
  bloc: BlocAnimation;
  motif?: string;
}) {
  return (
    <figure className="mt-6" style={pleineLargeur}>
      <Annonce texte={bloc.legende} />
      <div
        className="trame trame-bord border border-filet-fort px-4 py-6"
        style={{ ["--trame-op" as string]: "0.14" }}
      >
        <p className="t-etq text-gris-58">Animation indisponible</p>
        <p className="t-corps mt-2 max-w-[46ch] text-[0.875rem] leading-[1.55] text-gris-72">
          {motif ??
            "Cette figure n'est pas encore au manifeste des animations."}
        </p>
        <p className="t-tech mt-3 text-[0.6875rem] text-gris-40">
          identifiant · {bloc.animationId}
        </p>
      </div>
    </figure>
  );
}
