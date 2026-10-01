import { catalogueComplet } from "@/serveur/services/academy";
import { listerSeances } from "@/serveur/services/club";
import { Accueil } from "@/composants/academy/Accueil";

export const metadata = {
  title: "AI Academy · N7-IA",
  description:
    "Les parcours du club : machine learning, les maths qui vont avec, séries temporelles, hackathon.",
};

export default async function PageAcademy() {
  const [parcours, seances] = await Promise.all([
    catalogueComplet(),
    listerSeances(),
  ]);
  return <Accueil parcours={parcours} seances={seances} />;
}
