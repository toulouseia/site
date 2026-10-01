import type { Bloc } from "@/serveur/domaine/blocs";
import type { EtatAnimation } from "@/serveur/domaine/animations";
import type { Ressource } from "@/serveur/domaine/club";
import { BAnimation } from "./Animation";
import {
  BDerivation,
  BRepere,
  BSortie,
  BTableau,
  BVerification,
} from "./Charte";
import { BCode, BVideo } from "./Code";
import { BDemo } from "./Demo";
import { BExercice, BQuiz } from "./Exercices";
import { BGraphique } from "./Graphique";
import {
  BCarnet,
  BDefinition,
  BEncart,
  BFormule,
  BImage,
  BListe,
  BRessource,
  BTexte,
  BTitre,
} from "./Statiques";

// ─────────────────────────────────────────────────────────────────────────────
// LE REGISTRE.
//
// Un `switch` exhaustif sur le type du bloc. Pourquoi un switch plutôt qu'une
// table `Record<TypeBloc, Composant>` : la table oblige à un type de props
// commun, donc à un `any` quelque part. Le switch garde chaque composant typé
// avec SON bloc, et TypeScript vérifie l'exhaustivité, ajouter un membre à
// l'union sans l'ajouter ici ne compile pas.
//
// Les données extérieures au bloc, animations, ressources, sont RÉSOLUES PAR
// LA PAGE et passées ici. Un bloc ne va jamais chercher sa donnée lui-même :
// une leçon à six animations ferait six lectures en cascade, et le rendu
// serveur attendrait six fois.
// ─────────────────────────────────────────────────────────────────────────────

export type ContexteBlocs = {
  animations: Record<string, EtatAnimation>;
  ressources: Record<string, Ressource>;
  /** Nombre de blocs animation dans la leçon. Décide du préchargement. */
  nbAnimations?: number;
};

export function RendreBloc({
  bloc,
  contexte,
}: {
  bloc: Bloc;
  contexte: ContexteBlocs;
}) {
  switch (bloc.type) {
    case "titre":
      return <BTitre bloc={bloc} />;
    case "texte":
      return <BTexte bloc={bloc} />;
    case "liste":
      return <BListe bloc={bloc} />;
    case "encart":
      return <BEncart bloc={bloc} />;
    case "definition":
      return <BDefinition bloc={bloc} />;
    case "formule":
      return <BFormule bloc={bloc} />;
    case "image":
      return <BImage bloc={bloc} />;
    case "video":
      return <BVideo bloc={bloc} />;
    case "animation":
      return (
        <BAnimation
          bloc={bloc}
          etat={contexte.animations[bloc.animationId] ?? null}
          seule={(contexte.nbAnimations ?? 1) <= 1}
        />
      );
    case "code":
      return <BCode bloc={bloc} />;
    case "carnet":
      return <BCarnet bloc={bloc} />;
    case "graphique":
      return <BGraphique bloc={bloc} />;
    case "quiz":
      return <BQuiz bloc={bloc} />;
    case "exercice":
      return <BExercice bloc={bloc} />;
    case "demo":
      return <BDemo bloc={bloc} />;
    case "ressource":
      return (
        <BRessource
          bloc={bloc}
          ressource={contexte.ressources[bloc.ressourceId] ?? null}
        />
      );
    case "tableau":
      return <BTableau bloc={bloc} />;
    case "derivation":
      return <BDerivation bloc={bloc} />;
    case "repere":
      return <BRepere bloc={bloc} />;
    case "verification":
      return <BVerification bloc={bloc} />;
    case "sortie":
      return <BSortie bloc={bloc} />;
    default: {
      // L'exhaustivite, rendue CONTRAIGNANTE. Sans cette ligne, un membre
      // ajoute a l'union sans son composant compile sans bruit et rend du
      // vide devant un etudiant. Ici, il ne compile pas.
      const manquant: never = bloc;
      throw new Error(
        `Type de bloc sans composant : ${JSON.stringify(manquant)}`,
      );
    }
  }
}

/** La suite des blocs d'une leçon. */
export function Blocs({
  blocs,
  contexte,
}: {
  blocs: Bloc[];
  contexte: ContexteBlocs;
}) {
  const complet = {
    ...contexte,
    nbAnimations:
      contexte.nbAnimations ??
      blocs.filter((b) => b.type === "animation").length,
  };
  return (
    <>
      {blocs.map((bloc) => (
        <RendreBloc key={bloc.id} bloc={bloc} contexte={complet} />
      ))}
    </>
  );
}
