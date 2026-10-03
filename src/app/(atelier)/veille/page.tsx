import { listerNumeros } from "@/donnees/api";
import { Veille } from "@/composants/veille/Veille";
import { EcranVide } from "@/composants/base/EcranVide";

export const metadata = {
  title: "Veille — Toulouse IA",
  description: "Ce qui est sorti en IA, choisi et résumé par l'association, avec le lien vers chaque article.",
};

export default async function PageVeille() {
  const numeros = await listerNumeros();
  // L'écran de la veille suppose un numéro à ouvrir. Tant qu'il n'y en a
  // aucun, on le dit, plutôt que d'en inventer un.
  if (numeros.length === 0) {
    return (
      <EcranVide
        titre="Veille"
        etiquette="Le premier numéro est à écrire."
        phrase="La veille est une lettre courte : ce qui est sorti, ce que ça change, et pourquoi on y a prêté attention. Elle paraîtra quand il y aura quelque chose à dire."
      />
    );
  }
  return <Veille numeros={numeros} />;
}
