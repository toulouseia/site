import { Suspense } from "react";
import { SqueletteVolet } from "@/composants/base/Squelette";
import { FicheDistante } from "@/composants/projets/FicheDistante";

export const metadata = {
  title: "Projet — Toulouse IA",
  description: "La fiche d'un projet déposé sur le site.",
};

// La page commune des projets de la base. Les pages sont fabriquées une fois,
// à la mise en ligne : un projet déposé après n'a pas la sienne, et se lit
// ici, avec son nom court dans l'adresse (`?p=`). Elle vit sous la disposition
// de `/projets` : le mur reste autour, comme pour les projets du code.
export default function PageFiche() {
  return (
    <Suspense fallback={<SqueletteVolet />}>
      <FicheDistante />
    </Suspense>
  );
}
