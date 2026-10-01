"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type {
  ChapitreComplet,
  Cours,
  LeconComplete,
} from "@/serveur/domaine/academy";
import { avancementCours } from "@/serveur/domaine/progression";
import { Icone } from "@/composants/base/Icone";
import { cx, duree } from "@/lib/format";
import { useProgression } from "./progression";

// ─────────────────────────────────────────────────────────────────────────────
// LE CADRE D'UNE LEÇON, on lit, et rien d'autre.
//
// Une leçon occupe toute la largeur. Pas de volet à droite, pas de rail
// déployé à gauche : le rail se replie tout seul en entrant ici (voir
// `coque/etat.ts`), et tout ce qui sert à sortir ou à se repérer monte dans une
// seule barre, en haut.
//
// LE SOMMAIRE DEVIENT UN DÉROULANT. Posé en permanence à droite, il prend un
// quart de l'écran pour une information qu'on consulte trois fois par leçon.
// Dans la barre, il tient en un bouton qui dit déjà l'essentiel, le chapitre,
// la leçon, le rang, et qui s'ouvre sur le plan entier quand on le demande.
//
// LA RÈGLE SOUS LA BARRE suit le défilement, pas l'avancement : elle répond à
// « combien il me reste à lire », qui est la question qu'on se pose en lisant.
// L'avancement du cours, lui, est écrit en chiffres dans le déroulant.
// ─────────────────────────────────────────────────────────────────────────────

export function CadreLecon({
  lecon,
  cours,
  sommaire,
  children,
}: {
  lecon: LeconComplete;
  cours: Pick<Cours, "id" | "slug" | "nom" | "minutes">;
  sommaire: ChapitreComplet[];
  children: ReactNode;
}) {
  const zone = useRef<HTMLDivElement>(null);
  const [part, setPart] = useState(0);

  // La zone défile chez elle sur ordinateur, la page défile sur téléphone. On
  // lit celle des deux qui a quelque chose à faire défiler.
  const mesurer = useCallback(() => {
    const el = zone.current;
    const interne = el && el.scrollHeight - el.clientHeight > 8;
    const [haut, course] = interne
      ? [el.scrollTop, el.scrollHeight - el.clientHeight]
      : [
          window.scrollY,
          document.documentElement.scrollHeight - window.innerHeight,
        ];
    setPart(course > 0 ? Math.min(1, Math.max(0, haut / course)) : 0);
  }, []);

  useEffect(() => {
    const el = zone.current;
    mesurer();
    el?.addEventListener("scroll", mesurer, { passive: true });
    window.addEventListener("scroll", mesurer, { passive: true });
    window.addEventListener("resize", mesurer);
    return () => {
      el?.removeEventListener("scroll", mesurer);
      window.removeEventListener("scroll", mesurer);
      window.removeEventListener("resize", mesurer);
    };
  }, [mesurer]);

  // Changer de leçon remet la lecture en haut : sans ça, on arrive au milieu de
  // la suivante parce que la zone a gardé sa position.
  useEffect(() => {
    zone.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [lecon.id]);

  return (
    <div className="flex flex-col lg:h-full lg:overflow-hidden">
      {/* La cle remonte la barre quand on change de lecon : le deroulant se
          referme tout seul, sans effet qui coure apres l'etat. */}
      <BarreLecon
        key={lecon.id}
        lecon={lecon}
        cours={cours}
        sommaire={sommaire}
        part={part}
      />
      {/* `container-type: inline-size` fait de cette zone la référence de
          largeur pour ce qu'elle contient. Une figure qui veut sortir de la
          colonne de lecture a besoin de connaître la largeur DISPONIBLE, et
          non celle de la fenêtre : la barre latérale en prend deux cent
          vingt-quatre pixels, et une figure calée sur `100vw` déborderait
          d'autant. Voir `blocs/Animation.tsx`. */}
      <div
        ref={zone}
        className="[container-type:inline-size] pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pb-0"
      >
        {children}
      </div>
    </div>
  );
}

// ── La barre ────────────────────────────────────────────────────────────────

function BarreLecon({
  lecon,
  cours,
  sommaire,
  part,
}: {
  lecon: LeconComplete;
  cours: Pick<Cours, "id" | "slug" | "nom" | "minutes">;
  sommaire: ChapitreComplet[];
  part: number;
}) {
  const { progression, pret } = useProgression();
  const [ouvert, setOuvert] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);

  const lecons = sommaire.flatMap((c) => c.lecons);
  const avancement = avancementCours(cours, lecons, progression);

  // Fermer au clic dehors et à Échap. Un déroulant qui reste ouvert quand on
  // clique ailleurs est un déroulant qu'on ferme en rechargeant la page.
  useEffect(() => {
    if (!ouvert) return;
    const dehors = (e: MouseEvent) => {
      if (!cadre.current?.contains(e.target as Node)) setOuvert(false);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("mousedown", dehors);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("mousedown", dehors);
      document.removeEventListener("keydown", echap);
    };
  }, [ouvert]);

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-papier/97 backdrop-blur-[2px] lg:static lg:backdrop-blur-none">
      <div className="flex h-12 items-center gap-2 border-b border-filet px-2 lg:px-3">
        <Link
          href={`/apprendre/cours/${cours.slug}`}
          className="cmd cmd-nu cmd-s shrink-0"
        >
          <Icone nom="fleche-gauche" className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Le cours</span>
        </Link>

        <span aria-hidden className="h-4 w-px shrink-0 bg-filet-fort" />

        {/* Le déroulant : où je suis, et le plan entier au clic. */}
        <div ref={cadre} className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setOuvert((x) => !x)}
            aria-expanded={ouvert}
            aria-haspopup="true"
            className={cx(
              "flex h-9 w-full items-center gap-2 border px-2 text-left transition-colors",
              ouvert
                ? "border-encre bg-gris-04"
                : "border-transparent hover:border-filet-fort hover:bg-gris-04",
            )}
          >
            <span className="t-cote shrink-0 text-[0.75rem] text-brique tabular-nums">
              {String(lecon.chapitre.rang).padStart(2, "0")}
            </span>
            <span className="t-etq hidden shrink-0 truncate text-gris-58 sm:block sm:max-w-[14rem]">
              {lecon.chapitre.titre}
            </span>
            <span aria-hidden className="hidden h-3 w-px shrink-0 bg-filet-fort sm:block" />
            <span className="t-corps-f min-w-0 flex-1 truncate text-[0.875rem]">
              {lecon.titre}
            </span>
            <Icone
              nom="chevron-bas"
              className={cx(
                "h-3.5 w-3.5 shrink-0 text-gris-40 transition-transform duration-150 motion-reduce:transition-none",
                ouvert && "rotate-180",
              )}
            />
          </button>

          {ouvert ? (
            <Deroulant
              cours={cours}
              sommaire={sommaire}
              leconCouranteId={lecon.id}
              faites={avancement.faites}
              total={avancement.total}
              restantes={avancement.minutesRestantes}
              pret={pret}
              estTerminee={(id) =>
                pret && progression.lecons[id]?.etat === "terminee"
              }
            />
          ) : null}
        </div>

        <span className="t-cote shrink-0 pr-1 text-[0.75rem] text-gris-58 tabular-nums">
          {lecon.position.rang}/{lecon.position.total}
        </span>
      </div>

      {/* Ce qu'il reste à lire de CETTE leçon. Un filet, pas une barre. */}
      <div className="relative h-[2px] bg-gris-08">
        <span
          aria-hidden
          className="absolute top-0 left-0 h-full w-full origin-left bg-encre transition-transform duration-100 ease-linear motion-reduce:transition-none"
          style={{ transform: `scaleX(${part})` }}
        />
      </div>
    </header>
  );
}

// ── Le plan, déplié ─────────────────────────────────────────────────────────

function Deroulant({
  cours,
  sommaire,
  leconCouranteId,
  faites,
  total,
  restantes,
  pret,
  estTerminee,
}: {
  cours: Pick<Cours, "slug" | "nom">;
  sommaire: ChapitreComplet[];
  leconCouranteId: string;
  faites: number;
  total: number;
  restantes: number;
  pret: boolean;
  estTerminee: (id: string) => boolean;
}) {
  return (
    <div
      // Sur telephone le panneau s'accroche a la fenetre, pas au bouton : le
      // bouton est deja en retrait, et 30 rem ancres a lui sortiraient du cadre.
      className="an-monte fixed inset-x-2 top-[3.3rem] z-50 max-h-[70dvh] overflow-y-auto border border-encre bg-papier sm:absolute sm:inset-x-auto sm:top-[calc(100%+0.35rem)] sm:left-0 sm:w-[30rem]"
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-filet bg-gris-04 px-3 py-2">
        <span className="t-etq truncate text-encre">{cours.nom}</span>
        <span className="flex-1" />
        <span className="t-cote shrink-0 text-[0.75rem] text-brique tabular-nums">
          {pret ? `${faites}/${total}` : `${total}`}
        </span>
      </div>

      {sommaire.map((chapitre, i) => (
        <section key={chapitre.id} className="border-b border-filet last:border-b-0">
          <header className="flex items-baseline gap-2 px-3 py-2">
            <span className="t-cote text-[0.6875rem] text-brique tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="t-corps-f min-w-0 flex-1 text-[0.8125rem] leading-[1.3]">
              {chapitre.titre}
            </h2>
            <span className="t-tech shrink-0 text-[0.6875rem] text-gris-40">
              {chapitre.minutes > 0 ? duree(chapitre.minutes) : "à écrire"}
            </span>
          </header>

          <ul className="border-t border-filet">
            {chapitre.lecons.map((l) => {
              const courante = l.id === leconCouranteId;
              const annonce = l.statut !== "publie";
              const terminee = estTerminee(l.id);

              const contenu = (
                <>
                  <span
                    aria-hidden
                    className={cx(
                      "mt-[3px] flex h-[13px] w-[13px] shrink-0 items-center justify-center border",
                      courante
                        ? "border-papier"
                        : terminee
                          ? "border-encre bg-encre text-papier"
                          : annonce
                            ? "border-gris-24"
                            : "border-gris-40",
                    )}
                  >
                    {terminee && !courante ? (
                      <Icone nom="coche" className="h-[9px] w-[9px]" />
                    ) : null}
                  </span>
                  <span
                    className={cx(
                      "t-corps min-w-0 flex-1 text-[0.8125rem] leading-[1.35]",
                      annonce && !courante && "text-gris-40",
                      terminee && !courante && "text-gris-58",
                    )}
                  >
                    {l.titre}
                  </span>
                  <span
                    className={cx(
                      "t-tech shrink-0 pt-[2px] text-[0.6875rem]",
                      courante ? "text-brique-nuit" : "text-gris-40",
                    )}
                  >
                    {duree(l.minutes)}
                  </span>
                </>
              );

              if (annonce) {
                return (
                  <li
                    key={l.id}
                    className="flex items-start gap-2.5 border-b border-filet px-3 py-2 last:border-b-0"
                  >
                    {contenu}
                  </li>
                );
              }

              return (
                <li key={l.id} className="border-b border-filet last:border-b-0">
                  <Link
                    href={`/apprendre/cours/${cours.slug}/${l.slug}`}
                    aria-current={courante ? "page" : undefined}
                    className={cx(
                      "bande flex items-start gap-2.5 px-3 py-2",
                      courante ? "bg-sombre text-papier" : "hover:bg-gris-04",
                    )}
                  >
                    {contenu}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {pret && total > 0 && faites < total ? (
        <p className="t-tech border-t border-filet bg-gris-04 px-3 py-2 text-[0.6875rem] text-gris-58">
          {duree(restantes)} restantes dans ce cours
        </p>
      ) : null}
    </div>
  );
}
