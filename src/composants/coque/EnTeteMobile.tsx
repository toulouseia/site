import type { ReactNode } from "react";
import Link from "next/link";
import { Lockup } from "@/composants/base/Marque";
import { cx } from "@/lib/format";

/**
 * L'en-tête de téléphone. Le signe est toujours en haut à gauche, à la même
 * place, et il ramène toujours au tableau. Sur les écrans autres que le
 * tableau, il rétrécit et laisse la place au nom de la section.
 */
export function EnTeteMarque({ action }: { action?: ReactNode }) {
  return (
    <header className="border-b border-filet px-4 pt-3 pb-2.5 lg:hidden">
      <div className="flex items-start justify-between gap-3">
        <Link href="/projets" aria-label="Toulouse IA, tableau des projets">
          <Lockup plein className="h-[1.15rem] text-encre" />
        </Link>
        {action}
      </div>
      <p className="t-etq mt-2 whitespace-nowrap text-gris-58">
        communauté · Toulouse et Occitanie
      </p>
    </header>
  );
}

export function EnTeteSection({
  titre,
  cote,
  action,
  className,
}: {
  titre: string;
  cote?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cx(
        "sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-filet bg-papier/97 px-4 backdrop-blur-[2px] lg:hidden",
        className,
      )}
    >
      <Link href="/projets" aria-label="Tableau des projets" className="shrink-0">
        <Lockup plein className="h-[0.9rem] text-encre" />
      </Link>
      <span aria-hidden className="h-4 w-px bg-filet-fort" />
      <h1 className="t-titre truncate text-[0.9375rem]">{titre}</h1>
      {cote}
      <span className="flex-1" />
      {action}
    </header>
  );
}
