import { notFound } from "next/navigation";
import { listerSlugsProjets, obtenirProjet } from "@/donnees/api";
import { FicheProjet } from "@/composants/projets/FicheProjet";

export async function generateStaticParams() {
  const slugs = await listerSlugsProjets();
  // `output: export` exige au moins une route fabriquée d'avance. Quand plus
  // aucun projet n'est écrit dans le code — ils vivent tous en base, servis par
  // `/projets/fiche?p=` — on fabrique une page sentinelle qui rend « introuvable »
  // (`obtenirProjet` renvoie null pour ce nom court). La contrainte est
  // satisfaite, et aucune vraie adresse n'y mène.
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projet = await obtenirProjet(slug);
  if (!projet) return { title: "Projet introuvable — Toulouse IA" };
  return { title: `${projet.nom} — Toulouse IA`, description: projet.resume };
}

export default async function PageProjet({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projet = await obtenirProjet(slug);
  if (!projet) notFound();

  // Sur ordinateur, la fiche est déjà à droite du mur, nourrie par le survol :
  // celle-ci est la fiche du téléphone, un écran entier, qui s'ouvre en
  // dépliant ses mesures.
  return <FicheProjet projet={projet} />;
}
