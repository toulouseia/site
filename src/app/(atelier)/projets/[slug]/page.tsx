import { notFound } from "next/navigation";
import { listerSlugsProjets, obtenirProjet } from "@/donnees/api";
import { FicheProjet } from "@/composants/projets/FicheProjet";

export async function generateStaticParams() {
  const slugs = await listerSlugsProjets();
  return slugs.map((slug) => ({ slug }));
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
