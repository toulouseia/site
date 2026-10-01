import { listerRessources, listerSeances } from "@/serveur/services/club";
import { Ressources } from "@/composants/academy/Ressources";

export const metadata = {
  title: "Le fonds · AI Academy",
  description:
    "Les ressources extérieures que le club recommande, ses supports maison, et les séances à venir.",
};

/**
 * Le fonds n'est pas l'Academy : ce sont les ressources qu'on recommande, pas
 * celles qu'on écrit. Les deux cohabitent, une leçon peut renvoyer au fonds,
 * et le fonds ne prétend pas être un parcours.
 */
export default async function PageRessources() {
  const [ressources, seances] = await Promise.all([
    listerRessources(),
    listerSeances(),
  ]);
  return <Ressources ressources={ressources} seances={seances} />;
}
