import Link from "next/link";
import { Vide } from "@/composants/base/Atomes";
import { Icone } from "@/composants/base/Icone";

export default function Introuvable() {
  return (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-1 border-b border-filet px-2">
        <Link href="/projets" className="cmd cmd-nu cmd-s gap-1.5">
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Projets
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 items-center">
        <div className="w-full">
          <Vide titre="Ce projet n'existe pas" mesure="Adresse inconnue">
            <Link href="/projets" className="cmd cmd-plein cmd-s">
              Revenir au mur
            </Link>
            <Link href="/deposer" className="cmd cmd-trait cmd-s">
              Déposer un projet
            </Link>
          </Vide>
        </div>
      </div>
    </div>
  );
}
