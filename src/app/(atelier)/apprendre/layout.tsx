import type { ReactNode } from "react";
import { FournisseurProgression } from "@/composants/academy/progression";

/**
 * La progression est portée par la disposition, pas par chaque page : elle
 * survit ainsi à la navigation d'un cours à une leçon sans être relue depuis
 * la mémoire du navigateur à chaque écran.
 *
 * Le fournisseur est un composant client, mais cette disposition ne l'est pas :
 * les pages qu'il enveloppe restent rendues sur le serveur.
 */
export default function LayoutAcademy({ children }: { children: ReactNode }) {
  return <FournisseurProgression>{children}</FournisseurProgression>;
}
