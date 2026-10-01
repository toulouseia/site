import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** L'étiquette : le mot qui nomme une valeur. Jamais une phrase. */
export function Etq({
  children,
  className,
  ton = "gris",
}: {
  children: ReactNode;
  className?: string;
  ton?: "gris" | "encre" | "brique" | "clair";
}) {
  return (
    <span
      className={cx(
        "t-etq block",
        ton === "gris" && "text-gris-58",
        ton === "encre" && "text-encre",
        ton === "brique" && "text-brique",
        ton === "clair" && "text-nuit-72",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Ligne étiquette / valeur. La brique de base de toutes les fiches. */
export function LigneFiche({
  etiquette,
  children,
  filet = true,
  className,
}: {
  etiquette: string;
  children: ReactNode;
  filet?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-3 py-2",
        filet && "border-t border-filet",
        className,
      )}
    >
      <span className="t-etq pt-[3px] text-gris-58">{etiquette}</span>
      <span className="t-corps text-[0.8125rem] leading-[1.45] text-encre">
        {children}
      </span>
    </div>
  );
}

/**
 * Open ou Business, lisible dans une liste sans ouvrir la fiche : l'un est au
 * trait, l'autre en masse pleine. La distinction se voit même en vision
 * périphérique, et elle survit à l'inversion de la ligne — le fond du badge
 * plein prend la couleur du fond de la ligne, quelle qu'elle soit.
 */
export function Categorie({
  categorie,
  className,
}: {
  categorie: "open" | "business";
  className?: string;
}) {
  if (categorie === "business") {
    return (
      <span
        className={cx(
          "t-etq inline-block bg-current px-[5px] py-[3px] leading-none",
          className,
        )}
        style={{ color: "inherit" }}
      >
        <span style={{ color: "var(--fond, #fff)" }}>Business</span>
      </span>
    );
  }
  return (
    <span
      className={cx(
        "t-etq inline-block border border-current px-[5px] py-[2px] leading-none",
        className,
      )}
    >
      Open
    </span>
  );
}

/** Une touche du clavier, dessinée. Sert à annoncer les raccourcis. */
export function Touche({ children }: { children: ReactNode }) {
  return (
    <kbd className="t-tech inline-flex h-[17px] min-w-[17px] items-center justify-center border border-filet-fort px-[4px] text-[10px] text-gris-72">
      {children}
    </kbd>
  );
}

/**
 * L'écran vide. Il n'est jamais blanc : la trame du film l'occupe, et une
 * commande y attend. Un vide sans commande est une impasse.
 */
export function Vide({
  titre,
  mesure,
  children,
  compact,
}: {
  titre: string;
  mesure?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cx(
        "trame trame-bord flex flex-col items-center justify-center px-6 text-center",
        compact ? "min-h-[16rem] py-10" : "min-h-[22rem] py-16 lg:h-full",
      )}
      style={{ ["--trame-op" as string]: "0.16" }}
    >
      <div className="border border-filet-fort bg-papier px-6 py-5">
        <p className="t-etq-l text-encre">{titre}</p>
        {mesure ? (
          <p className="t-tech mt-2 text-[0.75rem] text-gris-58">{mesure}</p>
        ) : null}
        {children ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
