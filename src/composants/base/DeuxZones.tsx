import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * La grammaire de tous les écrans : une planche au centre, un volet à droite.
 * Sur ordinateur les deux sont visibles en même temps et défilent chacun chez
 * eux ; sur téléphone le volet devient un second écran, ou disparaît quand la
 * planche le porte déjà.
 */
export function DeuxZones({
  planche,
  volet,
  ouvertMobile = false,
}: {
  planche: ReactNode;
  volet: ReactNode;
  ouvertMobile?: boolean;
}) {
  return (
    <div className="lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_var(--volet)] lg:overflow-hidden">
      <div
        className={cx(
          "min-w-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:h-full lg:overflow-hidden lg:pb-0",
          ouvertMobile && "hidden lg:block",
        )}
      >
        {planche}
      </div>
      <div
        className={cx(
          "min-w-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:h-full lg:overflow-hidden lg:border-l lg:border-filet lg:pb-0",
          !ouvertMobile && "hidden lg:block",
        )}
      >
        {volet}
      </div>
    </div>
  );
}

/** Une case à cocher dessinée : carrée, sans arrondi, sans couleur d'accent. */
export function Case({
  cochee,
  onChange,
  label,
  className,
}: {
  cochee: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={cochee}
      aria-label={label}
      onClick={onChange}
      className={cx(
        "mt-[2px] flex h-[15px] w-[15px] shrink-0 items-center justify-center border transition-colors duration-100",
        cochee
          ? "border-encre bg-encre text-papier"
          : "border-gris-40 bg-papier hover:border-encre",
        className,
      )}
    >
      {cochee ? (
        <svg viewBox="0 0 16 16" className="h-[11px] w-[11px]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="square">
          <path d="M3 8.4 6.4 12 13 4.6" />
        </svg>
      ) : null}
    </button>
  );
}
