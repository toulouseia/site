import type {
  ChapitreComplet,
  Cours,
  GenreLecon,
  LeconComplete,
} from "@/serveur/domaine/academy";
import type { EtatAnimation } from "@/serveur/domaine/animations";
import type { Ressource } from "@/serveur/domaine/club";
import { duree } from "@/lib/format";
import { Blocs } from "./blocs/registre";
import { CadreLecon } from "./CadreLecon";
import { PiedLecon } from "./PiedLecon";

// ─────────────────────────────────────────────────────────────────────────────
// LA PAGE D'UNE LEÇON.
//
// Elle est rendue sur le SERVEUR : le texte, les formules et les figures
// arrivent en HTML. Quatre morceaux seulement deviennent du JavaScript, le
// lecteur d'animation, le quiz, l'exercice, la démonstration, plus la barre du
// haut et le pied de page, qui écrivent la progression.
//
// Une leçon occupe toute la largeur : ni volet à droite, ni rail déployé à
// gauche. Tout ce qui sert à sortir et à se repérer tient dans la barre du
// haut, et le sommaire y est un déroulant. La colonne de lecture, elle, reste
// bornée à une soixantaine de caractères : c'est la seule contrainte
// typographique qui compte vraiment : au-delà, l'œil perd la ligne suivante en
// revenant à gauche.
// ─────────────────────────────────────────────────────────────────────────────

const NOM_GENRE: Record<GenreLecon, string> = {
  lecture: "Lecture",
  demo: "Démonstration",
  exercice: "Exercice",
  quiz: "Quiz",
  carnet: "Carnet",
};

export function EcranLecon({
  lecon,
  cours,
  sommaire,
  animations,
  ressources,
}: {
  lecon: LeconComplete;
  cours: Pick<Cours, "id" | "slug" | "nom" | "minutes">;
  sommaire: ChapitreComplet[];
  animations: Record<string, EtatAnimation>;
  ressources: Record<string, Ressource>;
}) {
  return (
    <CadreLecon lecon={lecon} cours={cours} sommaire={sommaire}>
      <article className="mx-auto max-w-[44rem] px-5 pt-7 pb-12 lg:px-8 lg:pt-10">
        <header className="an-monte">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="t-etq text-brique">{NOM_GENRE[lecon.genre]}</span>
            <span className="t-tech text-[0.6875rem] text-gris-58">
              {duree(lecon.minutes)}
            </span>
            {lecon.libre ? (
              <span className="t-etq border border-filet-fort px-1.5 py-[3px] text-gris-58">
                Accès libre
              </span>
            ) : null}
          </div>
          <h1 className="t-titre-xl mt-2.5 text-[clamp(1.625rem,4.6vw,2.375rem)]">
            {lecon.titre}
          </h1>
          <p className="t-corps mt-3 text-[1rem] leading-[1.5] text-gris-72">
            {lecon.resume}
          </p>
          <div aria-hidden className="mt-6 h-px bg-filet" />
        </header>

        <div className="an-monte mt-6" style={{ animationDelay: "60ms" }}>
          <Blocs blocs={lecon.blocs} contexte={{ animations, ressources }} />
        </div>

        <PiedLecon lecon={lecon} />
      </article>
    </CadreLecon>
  );
}
