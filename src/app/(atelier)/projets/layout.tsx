import type { ReactNode } from "react";
import { listerProjets } from "@/donnees/api";
import { EcranProjets } from "@/composants/projets/EcranProjets";

// Le mur et le défilement vivent dans la disposition, pas dans la page : ils
// restent montés quand une fiche s'ouvre, et gardent leur position.
export default async function LayoutProjets({
  children,
}: {
  children: ReactNode;
}) {
  const projets = await listerProjets();
  return <EcranProjets projets={projets}>{children}</EcranProjets>;
}
