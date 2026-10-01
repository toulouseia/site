import { notFound } from "next/navigation";
import {
  catalogueComplet,
  listerSlugsParcours,
} from "@/serveur/services/academy";
import { EcranParcours } from "@/composants/academy/EcranParcours";

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
  const slugs = await listerSlugsParcours();
  return slugs.map((parcours) => ({ parcours }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ parcours: string }>;
}) {
  const { parcours: slug } = await params;
  const tous = await catalogueComplet();
  const parcours = tous.find((p) => p.slug === slug);
  if (!parcours) return { title: "Parcours introuvable · N7-IA" };
  return {
    title: `${parcours.nom} · AI Academy`,
    description: parcours.resume,
  };
}

export default async function PageParcours({
  params,
}: {
  params: Promise<{ parcours: string }>;
}) {
  const { parcours: slug } = await params;

  // Le catalogue complet plutôt qu'une lecture ciblée : il porte déjà les
  // leçons de chaque cours, dont le navigateur a besoin pour calculer
  // l'avancement. Une lecture ciblée demanderait une seconde requête.
  const tous = await catalogueComplet();
  const parcours = tous.find((p) => p.slug === slug);
  if (!parcours) notFound();

  return <EcranParcours parcours={parcours} />;
}
