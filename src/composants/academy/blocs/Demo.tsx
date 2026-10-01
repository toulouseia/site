"use client";

import { useMemo, useState, type ComponentType } from "react";
import type { BlocDemo } from "@/serveur/domaine/blocs";
import { cx } from "@/lib/format";
import { Legende, Ligne } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// LES DÉMONSTRATIONS INTERACTIVES.
//
// La frontière avec Manim est nette et vaut d'être écrite :
//
//   MANIM       : un raisonnement à dérouler. L'auteur choisit ce qu'on voit,
//                 dans quel ordre, à quel rythme. L'étudiant regarde.
//   DÉMO        : une relation entre un réglage et un résultat. L'étudiant
//                 tourne le bouton et voit. Personne ne peut « regarder »
//                 l'effet d'un taux d'apprentissage : il faut l'essayer.
//
// Le contenu ne connaît pas le code d'une démo : il la NOMME. Le registre
// ci-dessous fait la correspondance. Une démo inconnue affiche un cadre qui le
// dit, au lieu de faire tomber la leçon.
// ─────────────────────────────────────────────────────────────────────────────

type PropsDemo = { parametres: Record<string, number | string | boolean> };

const REGISTRE: Record<string, ComponentType<PropsDemo>> = {
  "pas-apprentissage": DemoPasApprentissage,
};

export function BDemo({ bloc }: { bloc: BlocDemo }) {
  const Composant = REGISTRE[bloc.demo];

  return (
    <figure id={bloc.ancre} className="mt-6">
      <div className="border border-filet-fort">
        <header className="flex h-10 items-center gap-2.5 border-b border-filet bg-gris-04 px-3">
          <span className="t-etq text-brique">Démonstration</span>
          <span className="t-corps-f min-w-0 flex-1 truncate text-[0.875rem]">
            <Ligne texte={bloc.titre} />
          </span>
        </header>

        {Composant ? (
          <Composant parametres={bloc.parametres ?? {}} />
        ) : (
          <div
            className="trame trame-bord px-4 py-6"
            style={{ ["--trame-op" as string]: "0.14" }}
          >
            <p className="t-corps max-w-[46ch] text-[0.875rem] leading-[1.55] text-gris-72">
              <Ligne texte={bloc.alt} />
            </p>
            <p className="t-tech mt-3 text-[0.6875rem] text-gris-40">
              démonstration · {bloc.demo} · non enregistrée
            </p>
          </div>
        )}
      </div>

      <Legende texte={bloc.legende} />
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// La descente de gradient, et son pas.
//
// Surface : f(x, y) = x² / 2 + 3 y², une cuvette allongée. Le gradient est
// exact, la descente est la vraie boucle du cours. Rien n'est simulé : les
// nombres affichés sont ceux qu'on obtiendrait en Python.
// ─────────────────────────────────────────────────────────────────────────────

const A = 0.5;
const B = 3;
const DEPART = { x: -3.4, y: 1.15 };

function cout(x: number, y: number) {
  return A * x * x + B * y * y;
}

function descendre(pas: number, iterations: number) {
  const trace = [{ ...DEPART, c: cout(DEPART.x, DEPART.y) }];
  let { x, y } = DEPART;
  for (let i = 0; i < iterations; i += 1) {
    const gx = 2 * A * x;
    const gy = 2 * B * y;
    x -= pas * gx;
    y -= pas * gy;
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 1e6) {
      trace.push({ x: NaN, y: NaN, c: NaN });
      break;
    }
    trace.push({ x, y, c: cout(x, y) });
  }
  return trace;
}

const L = 340;
const H = 240;
const VUE = { x: 4.2, y: 1.9 };

function DemoPasApprentissage({ parametres }: PropsDemo) {
  const initial =
    typeof parametres.pas === "number" ? parametres.pas : 0.1;
  const iterations =
    typeof parametres.iterations === "number" ? parametres.iterations : 25;

  const [pas, setPas] = useState(initial);
  const trace = useMemo(() => descendre(pas, iterations), [pas, iterations]);

  const px = (x: number) => L / 2 + (x / VUE.x) * (L / 2 - 14);
  const py = (y: number) => H / 2 - (y / VUE.y) * (H / 2 - 14);

  const dedans = trace.filter(
    (p) => Number.isFinite(p.x) && Math.abs(p.x) <= VUE.x && Math.abs(p.y) <= VUE.y,
  );
  const diverge = trace.some((p) => !Number.isFinite(p.c));
  const dernier = trace.filter((p) => Number.isFinite(p.c)).at(-1);
  const arrive = !!dernier && dernier.c < 0.01;
  const traine = !diverge && !arrive;

  // Les lignes de niveau : f = k, soit une ellipse de demi-axes √(k/A), √(k/B).
  const niveaux = [0.35, 1.1, 2.4, 4.2, 6.6];

  const coutMax = Math.max(...trace.map((p) => (Number.isFinite(p.c) ? p.c : 0)), 1);
  const finis = trace.filter((p) => Number.isFinite(p.c));

  return (
    <div>
      <div className="grid gap-px bg-filet sm:grid-cols-2">
        {/* Le plan : lignes de niveau et trajectoire */}
        <div className="bg-papier px-2 py-2">
          <p className="t-etq px-1 pb-1.5 text-gris-58">Vue de dessus</p>
          <svg
            viewBox={`0 0 ${L} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`Trajectoire de la descente pour un pas de ${pas.toFixed(3)}. ${
              diverge
                ? "Elle diverge et sort du cadre."
                : arrive
                  ? "Elle atteint le minimum."
                  : "Elle n'atteint pas encore le minimum."
            }`}
          >
            {niveaux.map((k) => (
              <ellipse
                key={k}
                cx={px(0)}
                cy={py(0)}
                rx={(Math.sqrt(k / A) / VUE.x) * (L / 2 - 14)}
                ry={(Math.sqrt(k / B) / VUE.y) * (H / 2 - 14)}
                fill="none"
                stroke="var(--color-gris-14)"
                strokeWidth={1}
              />
            ))}

            <line
              x1={0}
              x2={L}
              y1={py(0)}
              y2={py(0)}
              stroke="var(--color-gris-24)"
              strokeWidth={1}
            />
            <line
              x1={px(0)}
              x2={px(0)}
              y1={0}
              y2={H}
              stroke="var(--color-gris-24)"
              strokeWidth={1}
            />

            {dedans.length > 1 ? (
              <polyline
                points={dedans.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
                fill="none"
                stroke="var(--color-encre)"
                strokeWidth={1.5}
                strokeLinejoin="miter"
              />
            ) : null}

            {dedans.map((p, i) => (
              <rect
                key={i}
                x={px(p.x) - 2.5}
                y={py(p.y) - 2.5}
                width={5}
                height={5}
                fill={i === 0 ? "var(--color-brique)" : "var(--color-encre)"}
                opacity={i === 0 ? 1 : 0.55 + (0.45 * i) / dedans.length}
              />
            ))}

            {/* Le minimum, coté comme dans le film. */}
            <g>
              <line
                x1={px(0) - 6}
                x2={px(0) + 6}
                y1={py(0)}
                y2={py(0)}
                stroke="var(--color-brique)"
                strokeWidth={1.5}
              />
              <line
                x1={px(0)}
                x2={px(0)}
                y1={py(0) - 6}
                y2={py(0) + 6}
                stroke="var(--color-brique)"
                strokeWidth={1.5}
              />
            </g>

            {diverge ? (
              <text
                x={L - 10}
                y={16}
                textAnchor="end"
                className="t-etq"
                fontSize={10}
                fill="var(--color-brique)"
              >
                SORT DU CADRE
              </text>
            ) : null}
          </svg>
        </div>

        {/* Le coût, itération par itération */}
        <div className="bg-papier px-2 py-2">
          <p className="t-etq px-1 pb-1.5 text-gris-58">Coût par itération</p>
          <svg
            viewBox={`0 0 ${L} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`Courbe du coût sur ${iterations} itérations, de ${finis[0]?.c.toFixed(2)} à ${dernier?.c.toFixed(3) ?? "l'infini"}.`}
          >
            <line
              x1={22}
              x2={22}
              y1={12}
              y2={H - 20}
              stroke="var(--color-encre)"
              strokeWidth={1}
            />
            <line
              x1={22}
              x2={L - 10}
              y1={H - 20}
              y2={H - 20}
              stroke="var(--color-encre)"
              strokeWidth={1}
            />
            <polyline
              points={finis
                .map(
                  (p, i) =>
                    `${22 + (i / Math.max(1, iterations)) * (L - 32)},${
                      H - 20 - (p.c / coutMax) * (H - 32)
                    }`,
                )
                .join(" ")}
              fill="none"
              stroke="var(--color-encre)"
              strokeWidth={1.75}
              strokeLinejoin="miter"
            />
            {diverge ? (
              <text
                x={L - 10}
                y={16}
                textAnchor="end"
                className="t-etq"
                fontSize={10}
                fill="var(--color-brique)"
              >
                DIVERGE
              </text>
            ) : null}
            <text
              x={26}
              y={H - 6}
              className="t-cote"
              fontSize={10}
              fill="var(--color-gris-58)"
            >
              0
            </text>
            <text
              x={L - 10}
              y={H - 6}
              textAnchor="end"
              className="t-cote"
              fontSize={10}
              fill="var(--color-gris-58)"
            >
              {iterations}
            </text>
          </svg>
        </div>
      </div>

      <div className="border-t border-filet px-3 py-3">
        <div className="flex items-baseline gap-3">
          <label htmlFor="pas-app" className="t-etq text-gris-58">
            Pas d&apos;apprentissage
          </label>
          <span className="t-chiffre text-[1rem] text-encre tabular-nums">
            {pas.toFixed(3).replace(".", ",")}
          </span>
          <span className="flex-1" />
          <span
            className={cx(
              "t-etq",
              diverge ? "text-brique" : arrive ? "text-encre" : "text-gris-58",
            )}
          >
            {diverge
              ? "Divergence"
              : arrive
                ? `Arrivé en ${iterations} itérations`
                : "Trop lent"}
          </span>
        </div>

        <input
          id="pas-app"
          type="range"
          min={0.005}
          max={0.4}
          step={0.005}
          value={pas}
          onChange={(e) => setPas(Number(e.target.value))}
          className="mt-2.5 h-4 w-full accent-[var(--color-encre)]"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {[0.01, 0.05, 0.1, 0.3, 0.35].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setPas(v)}
              aria-pressed={Math.abs(pas - v) < 1e-9}
              className="puce"
            >
              {String(v).replace(".", ",")}
            </button>
          ))}
        </div>

        <p className="t-corps mt-2.5 text-[0.8125rem] leading-[1.45] text-gris-72">
          {diverge
            ? "Le pas dépasse le seuil de stabilité : chaque itération éloigne du minimum au lieu d'en approcher. Sur cette surface le seuil vaut 1/B, soit environ 0,333."
            : arrive
              ? "La trajectoire descend le flanc raide en premier, puis suit le fond de la vallée : c'est le zigzag caractéristique d'une cuvette allongée."
              : traine
                ? "Le coût baisse, mais la trajectoire s'arrête avant d'arriver. Rien n'indique l'erreur : c'est l'échec difficile à voir."
                : null}
        </p>
      </div>
    </div>
  );
}
