"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { DESTINATIONS, estActif } from "./navigation";
import { prenomDe, useMoi } from "./moi";
import { Portrait } from "./Portrait";

/**
 * La barre du bas, sur téléphone. Convention pure, assumée : personne n'a
 * besoin d'apprendre à s'en servir. Le dépôt d'un projet y tient une place
 * fixe — c'est la commande principale, elle est toujours au même endroit, en
 * dernier. Juste avant elle, la personne : « Se connecter », ou son prénom.
 */
export function BarreBasse() {
  const pathname = usePathname();
  const deposer = estActif(pathname, "/deposer");
  const profil = estActif(pathname, "/profil");
  const { moi } = useMoi();
  const connecte = moi.etat === "connecte" ? moi.personne : null;

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-filet bg-papier/97 backdrop-blur-[2px] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {DESTINATIONS.map((d) => {
        const actif = estActif(pathname, d.href);
        return (
          <Link
            key={d.href}
            href={d.href}
            aria-current={actif ? "page" : undefined}
            className="relative flex h-14 flex-col items-center justify-center gap-1"
          >
            <span
              aria-hidden
              className={cx(
                "absolute inset-x-0 top-0 h-[2px] transition-colors duration-150",
                actif ? "bg-encre" : "bg-transparent",
              )}
            />
            <Icone
              nom={d.icone}
              className={cx("h-[18px] w-[18px]", actif ? "text-encre" : "text-gris-40")}
            />
            <span
              className={cx(
                "t-etq max-[359px]:tracking-[0.03em] max-[359px]:text-[9px]",
                actif ? "text-encre" : "text-gris-40",
              )}
            >
              {d.nom}
            </span>
          </Link>
        );
      })}

      <Link
        href="/profil"
        aria-current={profil ? "page" : undefined}
        data-moi={moi.etat}
        className="relative flex h-14 flex-col items-center justify-center gap-1"
      >
        <span
          aria-hidden
          className={cx(
            "absolute inset-x-0 top-0 h-[2px] transition-colors duration-150",
            profil ? "bg-encre" : "bg-transparent",
          )}
        />
        <Portrait
          photo={connecte?.photo}
          nom={connecte?.nom}
          className={cx(
            "h-[18px] w-[18px]",
            profil ? "text-encre" : moi.etat === "inconnu" ? "text-gris-24" : "text-gris-40",
          )}
        />
        {/* La sixième colonne est la plus étroite : « Se connecter » y tient
            sur deux lignes, un peu plus petit et moins espacé que les autres
            étiquettes ; un prénom trop long est coupé, jamais replié. */}
        <span
          className={cx(
            "t-etq max-w-full px-0.5 text-center text-[0.5625rem] leading-[1.2] tracking-[0.06em]",
            connecte && "truncate",
            profil ? "text-encre" : moi.etat === "inconnu" ? "text-gris-24" : "text-gris-40",
          )}
        >
          {connecte
            ? prenomDe(connecte.nom)
            : moi.etat === "personne"
              ? "Se connecter"
              : "Profil"}
        </span>
      </Link>

      <Link
        href="/deposer"
        aria-current={deposer ? "page" : undefined}
        className="flex h-14 flex-col items-center justify-center gap-1"
      >
        <span
          className={cx(
            "flex h-[18px] w-[18px] items-center justify-center border transition-colors duration-150",
            deposer
              ? "border-encre bg-encre text-papier"
              : "border-gris-58 text-gris-58",
          )}
        >
          <Icone nom="plus" className="h-3 w-3" epaisseur={1.8} />
        </span>
        <span className={cx("t-etq max-[359px]:tracking-[0.03em] max-[359px]:text-[9px]", deposer ? "text-encre" : "text-gris-40")}>
          Déposer
        </span>
      </Link>
    </nav>
  );
}
