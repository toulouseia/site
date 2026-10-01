import type { ReactNode } from "react";
import { Coque } from "@/composants/coque/Coque";
import { compterTout } from "@/donnees/api";

export default async function LayoutAtelier({
  children,
}: {
  children: ReactNode;
}) {
  const compteurs = await compterTout();
  return <Coque compteurs={compteurs}>{children}</Coque>;
}
