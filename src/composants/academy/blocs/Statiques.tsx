import Link from "next/link";
import katex from "katex";
import type {
  BlocCarnet,
  BlocDefinition,
  BlocEncart,
  BlocFormule,
  BlocImage,
  BlocListe,
  BlocRessource,
  BlocTexte,
  BlocTitre,
} from "@/serveur/domaine/blocs";
import type { Ressource } from "@/serveur/domaine/club";
import { Icone, type NomIcone } from "@/composants/base/Icone";
import { NOM_FORMAT, NOM_NIVEAU, cx, duree } from "@/lib/format";
import { Legende, Ligne, Prose } from "./prose";

// ─────────────────────────────────────────────────────────────────────────────
// Les blocs qui n'ont besoin de rien : ni état, ni écoute, ni navigateur. Ils
// sont rendus sur le serveur et n'envoient pas une ligne de JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

export function BTitre({ bloc }: { bloc: BlocTitre }) {
  const Balise = bloc.niveau === 2 ? "h2" : "h3";
  return (
    <Balise
      id={bloc.ancre}
      className={cx(
        "scroll-mt-20",
        bloc.niveau === 2
          ? "t-titre-l mt-10 border-t border-filet pt-5 text-[1.375rem] leading-[1.2] first:mt-0 first:border-0 first:pt-0"
          : "t-titre mt-7 text-[1.0625rem] leading-[1.25]",
      )}
    >
      <Ligne texte={bloc.texte} />
    </Balise>
  );
}

export function BTexte({ bloc }: { bloc: BlocTexte }) {
  return (
    <div id={bloc.ancre} className="mt-4 first:mt-0">
      <Prose texte={bloc.texte} />
    </div>
  );
}

export function BListe({ bloc }: { bloc: BlocListe }) {
  const Balise = bloc.ordonnee ? "ol" : "ul";
  return (
    <Balise id={bloc.ancre} className="mt-4 border-t border-filet">
      {bloc.elements.map((element, i) => (
        <li
          key={i}
          className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-1 border-b border-filet py-2.5"
        >
          <span className="t-cote pt-[0.15rem] text-[0.75rem] text-brique">
            {bloc.ordonnee ? String(i + 1).padStart(2, "0") : "·"}
          </span>
          <div className="min-w-0">
            <Prose texte={element} />
          </div>
        </li>
      ))}
    </Balise>
  );
}

const ETIQUETTE_ENCART: Record<BlocEncart["ton"], string> = {
  note: "Note",
  attention: "Attention",
  astuce: "En pratique",
  rappel: "Rappel",
};

/**
 * L'encart ne prend pas de couleur de fond : il prend un filet épais à gauche.
 * Le ton « attention » est le seul qui touche à la brique, et seulement par son
 * étiquette et son filet, la brique ne remplit jamais rien.
 */
export function BEncart({ bloc }: { bloc: BlocEncart }) {
  const alerte = bloc.ton === "attention";
  return (
    <aside
      id={bloc.ancre}
      className={cx(
        "mt-6 border-l-2 bg-gris-04 py-3.5 pr-4 pl-4",
        alerte ? "border-l-brique" : "border-l-gris-40",
      )}
    >
      <p
        className={cx(
          "t-etq",
          alerte ? "text-brique" : "text-gris-58",
        )}
      >
        {bloc.titre ?? ETIQUETTE_ENCART[bloc.ton]}
      </p>
      <div className="mt-2">
        <Prose texte={bloc.texte} className="text-[0.9rem]" />
      </div>
    </aside>
  );
}

export function BDefinition({ bloc }: { bloc: BlocDefinition }) {
  return (
    <dl
      id={bloc.ancre}
      className="mt-6 border-t-2 border-t-encre border-b border-b-filet py-3"
    >
      <dt className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="t-titre text-[1rem]">{bloc.terme}</span>
        {bloc.anglais ? (
          <span className="t-tech text-[0.75rem] text-gris-58">
            {bloc.anglais}
          </span>
        ) : null}
      </dt>
      <dd className="mt-1.5">
        <Prose texte={bloc.texte} className="text-[0.9rem]" ton="attenue" />
      </dd>
    </dl>
  );
}

/**
 * Une formule en bloc. KaTeX produit du HTML pour l'œil et du MathML pour les
 * lecteurs d'écran ; on ajoute `aria-label` par-dessus, parce qu'un MathML
 * lu littéralement reste souvent moins clair qu'une phrase écrite exprès.
 */
export function BFormule({ bloc }: { bloc: BlocFormule }) {
  const html = katex.renderToString(bloc.latex, {
    displayMode: true,
    throwOnError: false,
    output: "htmlAndMathml",
    strict: "ignore",
  });

  return (
    <figure id={bloc.ancre} className="mt-6 scroll-mt-20">
      <div className="relative border-y border-filet bg-gris-04 px-4 py-5">
        <div
          className="katex-bloc overflow-x-auto"
          role="math"
          aria-label={bloc.alt}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {bloc.numero ? (
          <span className="t-cote absolute top-2 right-3 text-[0.75rem] text-brique">
            ({bloc.numero})
          </span>
        ) : null}
      </div>
      <Legende texte={bloc.legende} />
    </figure>
  );
}

export function BImage({ bloc }: { bloc: BlocImage }) {
  return (
    <figure id={bloc.ancre} className="mt-6">
      {/* Une balise img simple : les images des leçons sont déjà dimensionnées
          par le pipeline de contenu, et l'optimiseur de Next demanderait un
          serveur là où un fichier suffit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bloc.src}
        alt={bloc.alt}
        width={bloc.largeur}
        height={bloc.hauteur}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full border border-filet"
      />
      <Legende texte={bloc.legende} />
    </figure>
  );
}

export function BCarnet({ bloc }: { bloc: BlocCarnet }) {
  return (
    <a
      id={bloc.ancre}
      href={bloc.lien}
      target="_blank"
      rel="noreferrer noopener"
      className="group mt-6 flex items-start gap-3 border border-filet-fort px-4 py-3.5 transition-colors hover:border-encre hover:bg-gris-04"
    >
      <Icone
        nom="jeu"
        className="mt-[3px] h-4 w-4 shrink-0 text-gris-58 group-hover:text-encre"
      />
      <div className="min-w-0 flex-1">
        <p className="t-etq text-gris-58">Carnet · {bloc.hebergeur}</p>
        <p className="t-titre mt-1 text-[0.9375rem] leading-[1.3]">
          {bloc.titre}
          <Icone
            nom="sortie"
            className="ml-1.5 inline h-3 w-3 -translate-y-[1px] text-gris-40 group-hover:text-encre"
          />
        </p>
        {bloc.resume ? (
          <p className="t-corps mt-1 text-[0.8125rem] leading-[1.4] text-gris-72">
            {bloc.resume}
          </p>
        ) : null}
      </div>
    </a>
  );
}

const ICONE_FORMAT: Record<Ressource["format"], NomIcone> = {
  cours: "cours",
  notes: "notes",
  video: "video",
  atelier: "atelier",
  papier: "papier",
  jeu: "jeu",
};

/**
 * Un renvoi vers le fonds. La ressource est résolue par la page, pas par le
 * bloc : un bloc qui va chercher sa donnée lui-même fabrique une cascade.
 */
export function BRessource({
  bloc,
  ressource,
}: {
  bloc: BlocRessource;
  ressource: Ressource | null;
}) {
  if (!ressource) return null;

  const meta = `${NOM_FORMAT[ressource.format]} · ${NOM_NIVEAU[ressource.niveau]} · ${duree(ressource.minutes)}`;
  const contenu = (
    <>
      <Icone
        nom={ICONE_FORMAT[ressource.format]}
        className="mt-[3px] h-4 w-4 shrink-0 text-gris-58 group-hover:text-encre"
      />
      <div className="min-w-0 flex-1">
        <p className="t-etq text-gris-58">Dans le fonds du club</p>
        <p className="t-titre mt-1 text-[0.9375rem] leading-[1.3]">
          {ressource.titre}
          {ressource.lien ? (
            <Icone
              nom="sortie"
              className="ml-1.5 inline h-3 w-3 -translate-y-[1px] text-gris-40 group-hover:text-encre"
            />
          ) : null}
        </p>
        {bloc.pourquoi ? (
          <p className="t-corps mt-1 text-[0.8125rem] leading-[1.4] text-gris-72">
            {bloc.pourquoi}
          </p>
        ) : null}
        <p className="t-tech mt-1.5 text-[0.6875rem] text-gris-40">
          {meta} · {ressource.source}
        </p>
      </div>
    </>
  );

  const classe =
    "group mt-6 flex items-start gap-3 border border-filet-fort px-4 py-3.5 transition-colors hover:border-encre hover:bg-gris-04";

  return ressource.lien ? (
    <a
      id={bloc.ancre}
      href={ressource.lien}
      target="_blank"
      rel="noreferrer noopener"
      className={classe}
    >
      {contenu}
    </a>
  ) : (
    <Link id={bloc.ancre} href="/apprendre/ressources" className={classe}>
      {contenu}
    </Link>
  );
}
