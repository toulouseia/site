"use client";

import type { Entree, Numero } from "@/donnees/types";
import { Lockup, Signe } from "@/composants/base/Marque";
import { NOM_TYPE_ENTREE, cx, dateLongue } from "@/lib/format";

export type Mise = "une" | "chiffre" | "liste";

/**
 * L'affiche : une entrée de la veille mise au format 1080 × 1920, c'est-à-dire
 * au format des stories. Elle est dessinée dans son vrai système de
 * coordonnées puis réduite par une homothétie — les proportions et les
 * graisses sont donc exactes, pas approchées.
 *
 * Trois mises, deux fonds. Rien n'est généré : ce sont les tracés du kit, la
 * fonte du kit, et la trame du film.
 */
export function Affiche({
  numero,
  entree,
  mise,
  sombre,
  largeur,
}: {
  numero: Numero;
  entree: Entree;
  mise: Mise;
  sombre: boolean;
  /** Largeur d'affichage en pixels. La hauteur suit, 16/9. */
  largeur: number;
}) {
  const k = largeur / 1080;

  return (
    <div
      className={cx(
        "relative overflow-hidden border",
        sombre ? "border-nuit-28" : "border-filet-fort",
      )}
      style={{ width: largeur, height: Math.round((largeur * 1920) / 1080) }}
      aria-label={`Aperçu 1080 × 1920 — ${entree.titre}`}
    >
      <div
        className={cx(
          "absolute top-0 left-0 origin-top-left",
          sombre ? "bg-sombre text-papier" : "bg-papier text-encre",
        )}
        style={{ width: 1080, height: 1920, transform: `scale(${k})` }}
      >
        {mise === "liste" ? (
          <MiseListe numero={numero} sombre={sombre} />
        ) : mise === "chiffre" ? (
          <MiseChiffre numero={numero} entree={entree} sombre={sombre} />
        ) : (
          <MiseUne numero={numero} entree={entree} sombre={sombre} />
        )}
      </div>
    </div>
  );
}

function Etiquette({
  children,
  sombre,
  fort,
}: {
  children: React.ReactNode;
  sombre: boolean;
  fort?: boolean;
}) {
  return (
    <span
      style={{
        fontVariationSettings: "'wght' 660, 'wdth' 86",
        fontSize: 28,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
      className={
        fort
          ? sombre
            ? "text-papier"
            : "text-encre"
          : sombre
            ? "text-nuit-72"
            : "text-gris-58"
      }
    >
      {children}
    </span>
  );
}

function MiseUne({
  numero,
  entree,
  sombre,
}: {
  numero: Numero;
  entree: Entree;
  sombre: boolean;
}) {
  return (
    <div className="flex h-full flex-col px-[88px] pt-[96px] pb-[88px]">
      <div className="flex items-start justify-between">
        <Lockup style={{ height: 56 }} className="w-auto" />
        <span
          className={cx(
            "border px-[16px] py-[10px]",
            sombre ? "border-nuit-28" : "border-filet-fort",
          )}
        >
          <Etiquette sombre={sombre} fort>
            {NOM_TYPE_ENTREE[entree.type]}
          </Etiquette>
        </span>
      </div>

      <div className="mt-[26px]">
        <Etiquette sombre={sombre}>
          Veille nº {String(numero.numero).padStart(2, "0")} ·{" "}
          {dateLongue(numero.date)}
        </Etiquette>
      </div>

      <div
        className={cx("mt-[44px] h-[6px]", sombre ? "bg-papier" : "bg-encre")}
      />

      {/* Le vide n'est pas vide : la trame du film l'occupe. */}
      <div
        className={cx("trame trame-bord flex-1", sombre && "trame-claire")}
        style={{ ["--trame-op" as string]: sombre ? "0.16" : "0.13" }}
      />

      <h2
        className="mt-[56px]"
        style={{
          fontVariationSettings: "'wght' 780, 'wdth' 94",
          fontSize: 116,
          lineHeight: 0.95,
          letterSpacing: "-0.032em",
        }}
      >
        {entree.titre}
      </h2>

      <p
        className={cx("mt-[44px]", sombre ? "text-papier" : "text-encre")}
        style={{
          fontVariationSettings: "'wght' 560, 'wdth' 100",
          fontSize: 58,
          lineHeight: 1.24,
        }}
      >
        {entree.valeur}
      </p>

      <div className="mt-[64px]" />

      <div
        className={cx(
          "border-t pt-[36px]",
          sombre ? "border-nuit-28" : "border-filet-fort",
        )}
      >
        <p
          className={sombre ? "text-nuit-72" : "text-gris-72"}
          style={{
            fontVariationSettings: "'wght' 400, 'wdth' 100",
            fontSize: 36,
            lineHeight: 1.35,
          }}
        >
          {entree.pourquoi}
        </p>
        <div className="mt-[28px]">
          <Etiquette sombre={sombre}>{entree.source}</Etiquette>
        </div>
      </div>
    </div>
  );
}

function MiseChiffre({
  numero,
  entree,
  sombre,
}: {
  numero: Numero;
  entree: Entree;
  sombre: boolean;
}) {
  return (
    <div className="relative flex h-full flex-col px-[88px] pt-[96px] pb-[88px]">
      {/* Le signe sort du cadre : il tient le coin, il ne décore pas. */}
      <Signe
        plein
        className={cx(
          "pointer-events-none absolute",
          sombre ? "text-papier" : "text-encre",
        )}
        style={{
          width: 900,
          right: -300,
          bottom: -210,
          opacity: sombre ? 0.11 : 0.07,
        }}
      />

      <div className="relative flex items-start justify-between">
        <Lockup style={{ height: 56 }} className="w-auto" />
        <Etiquette sombre={sombre}>
          nº {String(numero.numero).padStart(2, "0")}
        </Etiquette>
      </div>

      <div className="relative mt-[120px]">
        <Etiquette sombre={sombre} fort>
          {NOM_TYPE_ENTREE[entree.type]}
        </Etiquette>
        <h2
          className={cx("mt-[22px]", sombre ? "text-nuit-72" : "text-gris-58")}
          style={{
            fontVariationSettings: "'wght' 600, 'wdth' 92",
            fontSize: 48,
            lineHeight: 1.15,
          }}
        >
          {entree.titre}
        </h2>
      </div>

      <p
        className="relative mt-[64px]"
        style={{
          fontVariationSettings: "'wght' 760, 'wdth' 72",
          fontSize: 130,
          lineHeight: 0.98,
          letterSpacing: "-0.03em",
        }}
      >
        {entree.valeur}
      </p>

      <div className="flex-1" />

      <div className="relative">
        <div
          className={cx("h-[6px] w-[200px]", sombre ? "bg-papier" : "bg-encre")}
        />
        <p
          className={cx("mt-[32px]", sombre ? "text-nuit-72" : "text-gris-72")}
          style={{
            fontVariationSettings: "'wght' 400, 'wdth' 100",
            fontSize: 38,
            lineHeight: 1.35,
          }}
        >
          {entree.pourquoi}
        </p>
        <div className="mt-[28px]">
          <Etiquette sombre={sombre}>{entree.source}</Etiquette>
        </div>
      </div>
    </div>
  );
}

function MiseListe({ numero, sombre }: { numero: Numero; sombre: boolean }) {
  // Tout le numéro : un sommaire qui en tait une partie se ferait passer pour
  // complet une fois partagé.
  const entrees = numero.entrees;
  return (
    <div className="flex h-full flex-col px-[88px] pt-[96px] pb-[88px]">
      <Lockup style={{ height: 56 }} className="w-auto self-start" />

      <div className="mt-[46px] flex items-end gap-[24px]">
        <span
          style={{
            fontVariationSettings: "'wght' 780, 'wdth' 72",
            fontSize: 150,
            lineHeight: 0.8,
            letterSpacing: "-0.03em",
          }}
        >
          {String(numero.numero).padStart(2, "0")}
        </span>
        <span className="pb-[14px]">
          <Etiquette sombre={sombre}>
            le numéro · {dateLongue(numero.date)}
          </Etiquette>
        </span>
      </div>

      <ol className="mt-[56px] flex-1">
        {entrees.map((e, i) => (
          <li
            key={e.id}
            className={cx(
              "flex gap-[28px] border-t py-[30px]",
              sombre ? "border-nuit-28" : "border-filet-fort",
            )}
          >
            <span
              className={sombre ? "text-nuit-72" : "text-gris-40"}
              style={{
                fontVariationSettings: "'wght' 640, 'wdth' 74",
                fontSize: 34,
                width: 52,
                flexShrink: 0,
                paddingTop: 8,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block"
                style={{
                  fontVariationSettings: "'wght' 700, 'wdth' 98",
                  fontSize: 46,
                  lineHeight: 1.12,
                  letterSpacing: "-0.015em",
                }}
              >
                {e.titre}
              </span>
              <span
                className={cx(
                  "mt-[10px] block",
                  sombre ? "text-nuit-72" : "text-gris-72",
                )}
                style={{
                  fontVariationSettings: "'wght' 420, 'wdth' 100",
                  fontSize: 32,
                  lineHeight: 1.3,
                }}
              >
                {e.valeur}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div
        className={cx(
          "trame h-[120px] border-t",
          sombre ? "trame-claire border-nuit-28" : "border-filet-fort",
        )}
        style={{ ["--trame-op" as string]: sombre ? "0.2" : "0.14" }}
      />
    </div>
  );
}
