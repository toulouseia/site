import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import { Etq } from "./Atomes";

// ─────────────────────────────────────────────────────────────────────────────
// La grammaire des formulaires : un bloc numéroté, des lignes étiquette /
// champ sur la même grille que les fiches, et un refus qui s'affiche à côté du
// champ qu'il nomme — jamais dans une alerte du navigateur.
// ─────────────────────────────────────────────────────────────────────────────

/** Étiquette à gauche, champ à droite : la même grille que les fiches. */
export function Ligne({
  etiquette,
  note,
  aide,
  erreur,
  children,
}: {
  etiquette: string;
  note?: string;
  aide?: string;
  /** Ce que le serveur a refusé, pour ce champ. */
  erreur?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block border-t border-filet py-2.5 first:border-t-0 first:pt-0 lg:grid lg:grid-cols-[7rem_minmax(0,1fr)] lg:items-start lg:gap-4">
      <span className="flex items-baseline justify-between gap-2 lg:block lg:pt-2.5">
        <Etq>{etiquette}</Etq>
        {aide ? (
          <span className="t-tech text-[0.625rem] text-gris-40 lg:mt-1 lg:block">
            {aide}
          </span>
        ) : null}
        {note ? (
          <span className="t-tech text-[0.6875rem] text-gris-40 lg:mt-1 lg:block">
            {note}
          </span>
        ) : null}
      </span>
      <span className="mt-1.5 block max-w-[30rem] lg:mt-0">
        {children}
        {erreur ? <Refus>{erreur}</Refus> : null}
      </span>
    </label>
  );
}

/** Le message d'un refus, sous le champ. En brique, en petit, sans icône. */
export function Refus({ children }: { children: ReactNode }) {
  return (
    <span role="alert" className="t-tech mt-1.5 block text-[0.6875rem] text-brique">
      {children}
    </span>
  );
}

export function Bloc({
  titre,
  cote,
  children,
  dernier,
}: {
  titre: string;
  cote: string;
  children: ReactNode;
  dernier?: boolean;
}) {
  return (
    <section
      className={cx("px-3 py-3.5 lg:px-4", !dernier && "border-b border-filet")}
    >
      <div className="flex items-baseline gap-2">
        <Etq ton="encre">{titre}</Etq>
        <span className="t-cote text-[0.75rem] text-brique">{cote}</span>
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export function ChoixCadre({
  actif,
  onClick,
  titre,
  detail,
}: {
  actif: boolean;
  onClick: () => void;
  titre: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={cx(
        "border px-3 py-2.5 text-left transition-colors",
        actif
          ? "border-sombre bg-sombre text-papier"
          : "border-filet-fort hover:border-gris-58",
      )}
    >
      <span className="t-corps-f block text-[0.875rem]">{titre}</span>
      <span
        className={cx(
          "t-tech mt-1 block text-[0.6875rem]",
          actif ? "text-nuit-72" : "text-gris-58",
        )}
      >
        {detail}
      </span>
    </button>
  );
}
