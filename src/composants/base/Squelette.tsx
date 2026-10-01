import { cx } from "@/lib/format";

/**
 * Ce qui charge. Pas un rond qui tourne : la structure de l'écran, déjà en
 * place, en gris — on sait où les choses vont tomber avant qu'elles tombent.
 * Une seule barre balaie, en haut, pour dire que ça travaille.
 */
export function Barre({ className }: { className?: string }) {
  return <span className={cx("block bg-gris-08", className)} />;
}

export function Progression() {
  return (
    <div className="relative h-[2px] overflow-hidden bg-gris-08">
      <span className="an-balaie absolute top-0 left-0 h-full w-1/4 bg-gris-40" />
    </div>
  );
}

export function SqueletteLignes({ lignes = 8 }: { lignes?: number }) {
  return (
    <div>
      <Progression />
      <ul>
        {Array.from({ length: lignes }, (_, i) => (
          <li
            key={i}
            className="flex gap-3 border-b border-filet px-3 py-3 lg:px-4"
            style={{ opacity: 1 - i * 0.09 }}
          >
            <Barre className="mt-[2px] h-[14px] w-[11px] shrink-0" />
            <div className="min-w-0 flex-1">
              <Barre
                className="h-[13px]"
                // Des largeurs inégales : une liste dont tout est identique ne
                // ressemble à aucune liste réelle.
              />
              <Barre className="mt-2 h-[10px] w-[72%]" />
            </div>
            <Barre className="mt-[3px] h-[10px] w-[2.4rem] shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SqueletteVolet() {
  return (
    <div className="flex h-full flex-col">
      <div className="h-12 shrink-0 border-b border-filet" />
      <Progression />
      <div className="px-4 py-4">
        <Barre className="h-[14px] w-[7rem]" />
        <Barre className="mt-4 h-[26px] w-[60%]" />
        <Barre className="mt-3 h-[12px] w-[92%]" />
        <Barre className="mt-2 h-[12px] w-[70%]" />
        <div className="mt-6 border-t border-filet pt-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 border-b border-filet py-2.5">
              <Barre className="h-[11px] w-[5rem] shrink-0" />
              <Barre className="h-[11px] flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
