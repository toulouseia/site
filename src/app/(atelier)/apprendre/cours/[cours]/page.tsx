import { notFound } from "next/navigation";
import { listerSlugsCours, obtenirCours } from "@/serveur/services/academy";
import { EcranCours } from "@/composants/academy/EcranCours";

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
  const slugs = await listerSlugsCours();
  return slugs.map((cours) => ({ cours }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cours: string }>;
}) {
  const { cours: slug } = await params;
  const resultat = await obtenirCours(slug);
  if (!resultat.ok) return { title: "Cours introuvable · N7-IA" };
  return {
    title: `${resultat.valeur.nom} · AI Academy`,
    description: resultat.valeur.resume,
  };
}

export default async function PageCours({
  params,
}: {
  params: Promise<{ cours: string }>;
}) {
  const { cours: slug } = await params;
  const resultat = await obtenirCours(slug);
  if (!resultat.ok) notFound();

  return <EcranCours cours={resultat.valeur} />;
}
