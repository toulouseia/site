import { notFound } from "next/navigation";
import Link from "next/link";
// La feuille de KaTeX n'est chargée que par cette adresse : c'est la seule qui
// affiche des formules, et elle emporte avec elle les fontes mathématiques.
import "katex/dist/katex.min.css";
import {
  animationsDeLaLecon,
  listerCheminsLecons,
  obtenirCours,
  obtenirLecon,
  ressourcesDeLaLecon,
} from "@/serveur/services/academy";
import { EcranLecon } from "@/composants/academy/EcranLecon";
import { Icone } from "@/composants/base/Icone";

/**
 * Le catalogue est entièrement connu à la construction : toutes les adresses
 * valides sont énumérées par `generateStaticParams`. On ferme donc la porte
 * aux autres.
 *
 * Ce n'est pas une optimisation, c'est une CORRECTION. Avec `dynamicParams`
 * laissé à sa valeur par défaut, une adresse inconnue est rendue à la demande,
 * `notFound()` affiche bien l'écran d'adresse inconnue, mais la réponse part
 * avec un code 200. Un moteur d'indexation, un moniteur ou un lien vérifié
 * automatiquement y lisent une page valide. Fermé, Next répond 404, ce qui est
 * la vérité.
 *
 * À rouvrir le jour où le catalogue viendra d'une base et ne sera plus
 * énumérable à la construction.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const chemins = await listerCheminsLecons();
  return chemins.map(({ coursSlug, leconSlug }) => ({
    cours: coursSlug,
    lecon: leconSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cours: string; lecon: string }>;
}) {
  const { cours, lecon } = await params;
  const resultat = await obtenirLecon(cours, lecon);
  if (!resultat.ok) {
    return {
      title:
        resultat.motif === "interdit"
          ? "Leçon à paraître · AI Academy"
          : "Leçon introuvable · N7-IA",
    };
  }
  return {
    title: `${resultat.valeur.titre} · ${resultat.valeur.cours.nom}`,
    description: resultat.valeur.resume,
  };
}

export default async function PageLecon({
  params,
}: {
  params: Promise<{ cours: string; lecon: string }>;
}) {
  const { cours: coursSlug, lecon: leconSlug } = await params;
  const resultat = await obtenirLecon(coursSlug, leconSlug);

  // Une leçon annoncée existe : elle figure au sommaire, elle n'est simplement
  // pas écrite. Lui répondre « adresse inconnue » serait faux.
  if (!resultat.ok) {
    if (resultat.motif === "interdit") {
      return <AParaitre coursSlug={coursSlug} message={resultat.message} />;
    }
    notFound();
  }

  const lecon = resultat.valeur;

  const [fiche, animations, ressources] = await Promise.all([
    obtenirCours(coursSlug),
    animationsDeLaLecon(lecon),
    ressourcesDeLaLecon(lecon),
  ]);
  if (!fiche.ok) notFound();

  return (
    <EcranLecon
      lecon={lecon}
      cours={{
        id: fiche.valeur.id,
        slug: fiche.valeur.slug,
        nom: fiche.valeur.nom,
        minutes: fiche.valeur.minutes,
      }}
      sommaire={fiche.valeur.sommaire}
      animations={animations}
      ressources={ressources}
    />
  );
}

function AParaitre({
  coursSlug,
  message,
}: {
  coursSlug: string;
  message: string;
}) {
  return (
    <div
      className="trame trame-bord flex min-h-[70dvh] items-center justify-center px-6 py-16 lg:h-full"
      style={{ ["--trame-op" as string]: "0.12" }}
    >
      <div className="max-w-[34rem] border border-filet-fort bg-papier px-6 py-6">
        <p className="t-etq text-brique">Leçon à paraître</p>
        <h1 className="t-titre-l mt-2.5 text-[1.5rem] leading-[1.15]">
          Cette leçon n&apos;est pas encore écrite
        </h1>
        <p className="t-corps mt-3 text-[0.9375rem] leading-[1.55] text-gris-72">
          {message} Elle figure au sommaire du cours parce que son plan est
          arrêté : le club écrit les leçons dans l&apos;ordre du programme.
        </p>
        <Link
          href={`/apprendre/cours/${coursSlug}`}
          className="cmd cmd-plein mt-5"
        >
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Revenir au sommaire
        </Link>
      </div>
    </div>
  );
}
