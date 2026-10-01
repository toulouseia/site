"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lockup } from "@/composants/base/Marque";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";
import { chargerProjets } from "@/donnees/distant";
import { DESTINATIONS, estActif } from "./navigation";
import { useMoi } from "./moi";
import { Portrait } from "./Portrait";

/**
 * Le rail. Il ne défile jamais et ne bouge jamais : sur ordinateur, on ne fait
 * pas défiler pour naviguer. Chaque destination porte son compte — un rail qui
 * ne dit que des noms perd une colonne d'information gratuite.
 *
 * En bas, à part des destinations : la personne, puis la commande. L'entrée
 * du profil dit « Se connecter » à qui ne l'est pas, et le nom à qui l'est ;
 * tant qu'on ne sait pas, elle existe sans rien affirmer.
 */
export function Rail({ compteurs }: { compteurs: Record<string, number> }) {
  const pathname = usePathname();

  // Le compteur « projets » se calcule à la compilation, sur les seuls projets
  // du code. Or la plupart des projets vivent désormais dans la base : le
  // compteur de build les ignore. On lit donc le mur au montage et on l'ajoute.
  // `slugLibre` (côté serveur) garantit qu'un projet de la base ne prend jamais
  // le nom court d'un projet du code : les deux ensembles sont disjoints, donc
  // le total du mur est bien la somme des deux tailles. La lecture est mise en
  // cache soixante secondes au bord du réseau ; si elle échoue, on garde le
  // compteur de build plutôt que d'afficher un nombre faux.
  const [projetsBase, setProjetsBase] = useState<number | null>(null);
  useEffect(() => {
    const controle = new AbortController();
    chargerProjets(controle.signal).then((r) => {
      if (controle.signal.aborted || !r.ok) return;
      setProjetsBase(r.valeur.projets.length);
    });
    return () => controle.abort();
  }, []);
  const compteursVus =
    projetsBase === null
      ? compteurs
      : { ...compteurs, projets: (compteurs.projets ?? 0) + projetsBase };

  return (
    <nav
      aria-label="Sections"
      className="hidden h-full w-(--rail) shrink-0 flex-col border-r border-filet bg-papier lg:flex"
    >
      <Link
        href="/projets"
        className="block px-4 pt-4 pb-3.5 transition-opacity hover:opacity-70"
      >
        <Lockup plein className="h-[1.25rem] text-encre" />
      </Link>

      <ul className="border-t border-filet">
        {DESTINATIONS.map((d) => {
          const actif = estActif(pathname, d.href);
          return (
            <li key={d.href}>
              <Link
                href={d.href}
                aria-current={actif ? "page" : undefined}
                className={cx(
                  "bande flex h-11 items-center gap-2.5 px-4",
                  actif
                    ? "bg-sombre text-papier"
                    : "text-gris-72 hover:bg-gris-04 hover:text-encre",
                )}
              >
                <Icone nom={d.icone} className="h-4 w-4 shrink-0" />
                <span className="t-corps-f text-[0.875rem]">{d.nom}</span>
                <span
                  className={cx(
                    "t-cote ml-auto text-[0.75rem]",
                    actif ? "text-brique-nuit" : "text-brique",
                  )}
                >
                  {String(compteursVus[d.cle] ?? 0).padStart(2, "0")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-filet">
        <EntreeProfil actif={estActif(pathname, "/profil")} />
        <div className="border-t border-filet p-3">
          <Link href="/deposer" className="cmd cmd-plein w-full">
            <Icone nom="plus" className="h-4 w-4" />
            Déposer un projet
          </Link>
        </div>
      </div>
    </nav>
  );
}

function EntreeProfil({ actif }: { actif: boolean }) {
  const { moi } = useMoi();
  const connecte = moi.etat === "connecte" ? moi.personne : null;
  return (
    <Link
      href="/profil"
      aria-current={actif ? "page" : undefined}
      data-moi={moi.etat}
      className={cx(
        "bande flex h-11 items-center gap-2.5 px-4",
        actif
          ? "bg-sombre text-papier"
          : moi.etat === "inconnu"
            ? "text-gris-40"
            : "text-gris-72 hover:bg-gris-04 hover:text-encre",
      )}
    >
      <Portrait photo={connecte?.photo} nom={connecte?.nom} className="h-4 w-4" />
      <span className="t-corps-f min-w-0 truncate text-[0.875rem]">
        {connecte ? connecte.nom : moi.etat === "personne" ? "Se connecter" : "Profil"}
      </span>
      {connecte ? (
        <span className={cx("t-etq ml-auto", actif ? "text-nuit-72" : "text-gris-40")}>
          Profil
        </span>
      ) : null}
    </Link>
  );
}
