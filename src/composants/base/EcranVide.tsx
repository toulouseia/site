import Link from "next/link";
import { Etq } from "@/composants/base/Atomes";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";

/**
 * Une section qui n'a encore rien à montrer. Elle le dit en une phrase et
 * renvoie vers le mur, au lieu d'afficher une liste vide ou — pire — un
 * contenu inventé pour meubler. Les écrans riches (veille, outils) supposent
 * au moins un élément ; c'est la page qui choisit entre eux et celui-ci.
 */
export function EcranVide({
  titre,
  etiquette,
  phrase,
  suite,
}: {
  /** Le nom de la section, dans la barre. */
  titre: string;
  /** Ce qui est écrit en grand. */
  etiquette: string;
  /** Pourquoi il n'y a rien, en une phrase. */
  phrase: string;
  /** Ce qui viendra, sans promettre de date. */
  suite?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-papier lg:min-h-0 lg:h-full">
      <EnTeteSection titre={titre} />
      <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
        <Etq ton="encre">{titre}</Etq>
      </div>

      <div
        className="trame trame-haut flex flex-1 items-start px-4 pt-10 pb-16 lg:items-center lg:px-10"
        style={{ ["--trame-op" as string]: "0.09" }}
      >
        <div className="w-full max-w-[34rem]">
          <p className="t-etq text-brique">Rien encore</p>
          <h2 className="t-titre-xl mt-3 text-[clamp(1.6rem,5vw,2.6rem)] text-balance">
            {etiquette}
          </h2>
          <p className="t-corps mt-4 text-[0.9375rem] leading-[1.5] text-gris-72">
            {phrase}
          </p>
          {suite ? (
            <p className="t-tech mt-3 text-[0.8125rem] text-gris-58">{suite}</p>
          ) : null}
          <Link href="/projets" className="cmd cmd-trait cmd-s mt-8">
            Voir les projets
          </Link>
        </div>
      </div>
    </div>
  );
}
