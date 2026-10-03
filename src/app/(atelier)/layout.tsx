import type { ReactNode } from "react";
import { Coque } from "@/composants/coque/Coque";
import { compterTout, datesVeille } from "@/donnees/api";

export default async function LayoutAtelier({
  children,
}: {
  children: ReactNode;
}) {
  const compteurs = await compterTout();
  const dates = await datesVeille();
  return (
    <Coque compteurs={compteurs} datesVeille={dates}>
      {children}
    </Coque>
  );
}
