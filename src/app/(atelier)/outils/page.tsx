import {
  listerAnnales,
  listerOutils,
  listerReponsesAgent,
} from "@/donnees/api";
import { Outils } from "@/composants/outils/Outils";
import { EcranVide } from "@/composants/base/EcranVide";

export const metadata = {
  title: "Outils — Toulouse IA",
  description: "La boîte à outils de l'association.",
};

export default async function PageOutils() {
  const [outils, reponses, annales] = await Promise.all([
    listerOutils(),
    listerReponsesAgent(),
    listerAnnales(),
  ]);
  // La boîte ne montre que ce qui est fini et ouvert. Rien ne l'est encore.
  if (outils.length === 0) {
    return (
      <EcranVide
        titre="Outils"
        etiquette="Aucun outil en service pour l'instant."
        phrase="Un outil qu'on ne peut pas utiliser n'est pas un outil, c'est un projet — et les projets ont leur mur. Le premier outil paraîtra ici le jour où il marchera."
      />
    );
  }
  return <Outils outils={outils} reponses={reponses} annales={annales} />;
}
