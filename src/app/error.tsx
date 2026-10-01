"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Lockup } from "@/composants/base/Marque";
import { Icone } from "@/composants/base/Icone";

/**
 * L'écran de panne. Même traitement que l'adresse inconnue : on ne s'excuse
 * pas, on redonne une commande. « Réessayer » d'abord, parce que c'est ce qui
 * marche le plus souvent.
 */
export default function Panne({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col bg-papier">
      <div className="flex items-center gap-3 border-b border-filet px-4 py-3.5 lg:px-6">
        <Link href="/projets">
          <Lockup plein className="h-[1.2rem] text-encre" />
        </Link>
        <span className="t-etq text-gris-58">association</span>
      </div>

      <div
        className="trame trame-haut flex flex-1 items-start px-4 pt-10 pb-16 lg:items-center lg:px-10"
        style={{ ["--trame-op" as string]: "0.09" }}
      >
        <div className="w-full max-w-[34rem]">
          <p className="t-etq text-brique">Panne</p>
          <h1 className="t-titre-xl mt-3 text-[clamp(1.75rem,6vw,3rem)]">
            L&apos;écran n&apos;a pas pu se dessiner
          </h1>
          <p className="t-tech mt-3 text-[0.8125rem] text-gris-58">
            {error.digest ? `Trace ${error.digest}` : "Sans trace"} · rien
            n&apos;est perdu
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <button type="button" onClick={reset} className="cmd cmd-plein">
              <Icone nom="fleche-droite" className="h-4 w-4" />
              Réessayer
            </button>
            <Link href="/projets" className="cmd cmd-trait">
              Revenir au tableau
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
