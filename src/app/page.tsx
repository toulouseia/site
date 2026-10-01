import { redirect } from "next/navigation";

// L'écran d'arrivée est le tableau des projets. Le club se présente par ce
// qu'il fabrique : il n'y a pas de page d'accueil à traverser avant.
export default function Page() {
  redirect("/projets");
}
