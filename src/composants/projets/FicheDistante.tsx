"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProjetComplet } from "@/donnees/api";
import { chargerProjet } from "@/donnees/distant";
import { SqueletteVolet } from "@/composants/base/Squelette";
import { useFicheCommune } from "./EcranProjets";
import { FicheProjet } from "./FicheProjet";
import { Introuvable } from "./Introuvable";

// ─────────────────────────────────────────────────────────────────────────────
// La fiche d'un projet de la base. Le nom court est dans `?p=` ; la fiche
// demande `GET /api/projets/:slug` — publié pour tout le monde, ou le mien
// même retiré — et rend la même fiche que les projets du code. Un nom court
// inconnu donne l'écran d'absence, le même que `/projets/[slug]/not-found`.
//
// Sur ordinateur ce composant est monté mais caché : c'est l'écran des projets
// qui tient la colonne de droite, et il ne sait que ce qu'on lui dit — le
// projet lu, ou le nom court qui n'a rien donné.
// ─────────────────────────────────────────────────────────────────────────────

type Etat =
  | { etat: "attente" }
  | { etat: "absent" }
  | { etat: "lu"; projet: ProjetComplet };

export function FicheDistante() {
  const slug = useSearchParams().get("p");
  if (!slug) return <Introuvable />;
  // La clé remet la lecture à zéro quand on passe d'un projet à un autre.
  return <Lecture key={slug} slug={slug} />;
}

function Lecture({ slug }: { slug: string }) {
  const { integrer, signalerAbsent } = useFicheCommune();
  const [e, setE] = useState<Etat>({ etat: "attente" });

  useEffect(() => {
    const controle = new AbortController();
    chargerProjet(slug, controle.signal).then((r) => {
      if (controle.signal.aborted) return;
      if (!r.ok) {
        signalerAbsent(slug);
        setE({ etat: "absent" });
        return;
      }
      const projet = { ...r.valeur.projet, distant: true };
      integrer(projet);
      setE({ etat: "lu", projet });
    });
    return () => controle.abort();
  }, [slug, integrer, signalerAbsent]);

  if (e.etat === "attente") return <SqueletteVolet />;
  if (e.etat === "lu") return <FicheProjet projet={e.projet} />;
  return <Introuvable />;
}
