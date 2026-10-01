import type { BlocGraphique } from "@/serveur/domaine/blocs";
import { Legende, Ligne } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// Le graphique, dessiné à la main.
//
// Pas de bibliothèque : trois formes, des échelles linéaires, une centaine de
// lignes d'arithmétique. Une bibliothèque de graphiques apporterait ses propres
// couleurs, ses propres arrondis et ses propres infobulles, c'est-à-dire trois
// choses que ce système interdit, et il faudrait passer plus de temps à la
// contredire qu'à écrire ceci.
//
// Les règles du dessin, tirées du film de construction :
//   - l'axe est un filet de 1 px, les graduations sont des serifs ;
//   - la première série est à l'encre, la deuxième en brique, jamais l'inverse ;
//   - une série de référence est en pointillé, pas dans une autre couleur ;
//   - rien n'est arrondi, rien n'a d'ombre, rien ne dégrade.
// ─────────────────────────────────────────────────────────────────────────────

const L = 640;
const H = 300;
const MARGE = { haut: 16, droite: 16, bas: 34, gauche: 46 };
const CADRE = {
  l: L - MARGE.gauche - MARGE.droite,
  h: H - MARGE.haut - MARGE.bas,
};

/** Des graduations rondes : 0, 2, 4… plutôt que 0, 2,37, 4,74… */
function graduations(min: number, max: number, cible = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return [min];
  }
  const brut = (max - min) / cible;
  const ordre = Math.pow(10, Math.floor(Math.log10(brut)));
  const pas = [1, 2, 2.5, 5, 10]
    .map((m) => m * ordre)
    .find((p) => p >= brut) as number;
  const debut = Math.ceil(min / pas) * pas;
  const valeurs: number[] = [];
  for (let v = debut; v <= max + pas * 0.001; v += pas) {
    valeurs.push(Math.round(v * 1e6) / 1e6);
  }
  return valeurs;
}

function nombre(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(v < 1 ? 2 : 1).replace(".", ",");
}

export function BGraphique({ bloc }: { bloc: BlocGraphique }) {
  const points = bloc.series.flatMap((s) => s.points);
  if (points.length === 0) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  // L'axe des ordonnées part de zéro dès que les données sont positives :
  // un axe tronqué exagère les écarts, et c'est le mensonge le plus courant
  // des graphiques.
  const yMin = Math.min(0, ...ys);
  const yMax = Math.max(...ys);

  const px = (x: number) =>
    MARGE.gauche + (xMax === xMin ? 0.5 : (x - xMin) / (xMax - xMin)) * CADRE.l;
  const py = (y: number) =>
    MARGE.haut + CADRE.h - (yMax === yMin ? 0 : (y - yMin) / (yMax - yMin)) * CADRE.h;

  const gradY = graduations(yMin, yMax, 4);
  const gradX = graduations(xMin, xMax, 6);

  return (
    <figure className="mt-6">
      <div className="border border-filet bg-papier">
        {bloc.titre ? (
          <p className="t-etq border-b border-filet px-3 py-2 text-gris-58">
            <Ligne texte={bloc.titre} />
          </p>
        ) : null}

        <div className="overflow-x-auto px-2 py-2">
          <svg
            viewBox={`0 0 ${L} ${H}`}
            className="block h-auto w-full min-w-[26rem]"
            role="img"
            aria-label={bloc.alt}
          >
            {/* Les lignes de niveau : le repère, pas la donnée. */}
            {gradY.map((v) => (
              <g key={`y${v}`}>
                <line
                  x1={MARGE.gauche}
                  x2={L - MARGE.droite}
                  y1={py(v)}
                  y2={py(v)}
                  stroke="var(--color-gris-14)"
                  strokeWidth={1}
                />
                <text
                  x={MARGE.gauche - 7}
                  y={py(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="t-cote"
                  fontSize={10}
                  fill="var(--color-gris-58)"
                >
                  {nombre(v)}
                </text>
              </g>
            ))}

            {gradX.map((v) => (
              <g key={`x${v}`}>
                <line
                  x1={px(v)}
                  x2={px(v)}
                  y1={MARGE.haut + CADRE.h}
                  y2={MARGE.haut + CADRE.h + 4}
                  stroke="var(--color-gris-40)"
                  strokeWidth={1}
                />
                <text
                  x={px(v)}
                  y={MARGE.haut + CADRE.h + 16}
                  textAnchor="middle"
                  className="t-cote"
                  fontSize={10}
                  fill="var(--color-gris-58)"
                >
                  {nombre(v)}
                </text>
              </g>
            ))}

            {/* Les deux axes, à l'encre : ce sont eux qui tiennent le dessin. */}
            <line
              x1={MARGE.gauche}
              x2={MARGE.gauche}
              y1={MARGE.haut}
              y2={MARGE.haut + CADRE.h}
              stroke="var(--color-encre)"
              strokeWidth={1}
            />
            <line
              x1={MARGE.gauche}
              x2={L - MARGE.droite}
              y1={MARGE.haut + CADRE.h}
              y2={MARGE.haut + CADRE.h}
              stroke="var(--color-encre)"
              strokeWidth={1}
            />

            {bloc.series.map((serie, i) => {
              const couleur =
                i === 0 ? "var(--color-encre)" : "var(--color-brique)";

              if (bloc.forme === "barres") {
                const largeur = Math.max(
                  3,
                  (CADRE.l / Math.max(serie.points.length, 1)) * 0.6,
                );
                return (
                  <g key={serie.nom}>
                    {serie.points.map((p, j) => (
                      <rect
                        key={j}
                        x={px(p.x) - largeur / 2}
                        y={py(p.y)}
                        width={largeur}
                        height={Math.max(0, MARGE.haut + CADRE.h - py(p.y))}
                        fill={couleur}
                        opacity={i === 0 ? 0.86 : 1}
                      />
                    ))}
                  </g>
                );
              }

              if (bloc.forme === "nuage") {
                return (
                  <g key={serie.nom}>
                    {serie.points.length > 1 && serie.tirets ? (
                      <polyline
                        points={serie.points
                          .map((p) => `${px(p.x)},${py(p.y)}`)
                          .join(" ")}
                        fill="none"
                        stroke={couleur}
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                      />
                    ) : (
                      serie.points.map((p, j) => (
                        <rect
                          key={j}
                          x={px(p.x) - 3}
                          y={py(p.y) - 3}
                          width={6}
                          height={6}
                          fill={couleur}
                        />
                      ))
                    )}
                  </g>
                );
              }

              return (
                <polyline
                  key={serie.nom}
                  points={serie.points
                    .map((p) => `${px(p.x)},${py(p.y)}`)
                    .join(" ")}
                  fill="none"
                  stroke={couleur}
                  strokeWidth={1.75}
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                  {...(serie.tirets ? { strokeDasharray: "5 4" } : {})}
                />
              );
            })}
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-filet px-3 py-2">
          {bloc.series.map((serie, i) => (
            <span key={serie.nom} className="flex items-center gap-1.5">
              {/* Le meme trait que dans le dessin : plein ou en pointille,
                  jamais une pastille de couleur. */}
              <svg aria-hidden width="18" height="4" viewBox="0 0 18 4">
                <line
                  x1="0"
                  y1="2"
                  x2="18"
                  y2="2"
                  stroke={i === 0 ? "var(--color-encre)" : "var(--color-brique)"}
                  strokeWidth="2"
                  {...(serie.tirets ? { strokeDasharray: "5 4" } : {})}
                />
              </svg>
              <span className="t-tech text-[0.6875rem] text-gris-72">
                {serie.nom}
              </span>
            </span>
          ))}
          <span className="flex-1" />
          <span className="t-etq text-gris-40">
            {bloc.axes.x} · {bloc.axes.y}
          </span>
        </div>
      </div>

      <Legende texte={bloc.legende} />
    </figure>
  );
}
