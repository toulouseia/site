import type { ReactNode } from "react";
import { Rail } from "./Rail";
import { BarreBasse } from "./BarreBasse";
import { FournisseurMoi } from "./moi";

/**
 * La coque. Sur ordinateur : un rail fixe à gauche, le reste en zones qui
 * défilent chacune chez elles — la page, elle, ne défile jamais. Sur
 * téléphone : la page défile, la barre du bas reste.
 *
 * C'est ici que l'écran apprend qui est connecté, une fois pour tous ses
 * composants (`moi.tsx`).
 */
export function Coque({
  compteurs,
  children,
}: {
  compteurs: Record<string, number>;
  children: ReactNode;
}) {
  return (
    <FournisseurMoi>
      <div className="lg:flex lg:h-dvh lg:overflow-hidden">
        <Rail compteurs={compteurs} />
        <div
          className="min-w-0 flex-1 lg:h-full lg:overflow-hidden"
          style={{ paddingBottom: "0" }}
        >
          {children}
        </div>
        <BarreBasse />
      </div>
    </FournisseurMoi>
  );
}

/** La marge que réserve la barre du bas, sur téléphone seulement. */
export const GARDE_BARRE = "pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0";
