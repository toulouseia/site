"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { lireMoi, type Moi } from "@/donnees/distant";

// ─────────────────────────────────────────────────────────────────────────────
// Savoir qui est là. Un seul appel, partagé par tout l'écran.
//
// Le fournisseur vit au niveau de la coque : il demande `GET /api/moi` une
// fois au chargement, et tout composant qui a besoin de savoir — le rail, la
// barre du bas, la page de profil, le formulaire de dépôt — lit le même
// résultat par `useMoi()`. Aucune page ne refait l'appel pour son compte.
//
// Trois états, et le premier compte autant que les deux autres : tant que le
// serveur n'a pas répondu, on ne sait pas, et l'écran ne doit rien affirmer —
// ni « se connecter », ni un nom. Si le serveur ne répond pas du tout, on
// retombe sur « personne » : le site s'affiche entier sans lui.
// ─────────────────────────────────────────────────────────────────────────────

export type EtatMoi =
  | { etat: "inconnu" }
  | { etat: "personne" }
  | { etat: "connecte"; personne: Moi };

type Valeur = {
  moi: EtatMoi;
  /** Après un enregistrement ou une déconnexion : ce que le serveur vient de dire. */
  poser: (personne: Moi | null) => void;
};

const Contexte = createContext<Valeur | null>(null);

export function FournisseurMoi({ children }: { children: ReactNode }) {
  const [moi, setMoi] = useState<EtatMoi>({ etat: "inconnu" });
  // Un seul appel, même si React monte le composant deux fois en développement.
  const demande = useRef(false);

  useEffect(() => {
    if (demande.current) return;
    demande.current = true;
    const controle = new AbortController();
    lireMoi(controle.signal).then((r) => {
      if (controle.signal.aborted) return;
      setMoi(
        r.ok && r.valeur.connecte
          ? { etat: "connecte", personne: r.valeur.personne }
          : { etat: "personne" },
      );
    });
    return () => controle.abort();
  }, []);

  const poser = useCallback((personne: Moi | null) => {
    setMoi(personne ? { etat: "connecte", personne } : { etat: "personne" });
  }, []);

  return <Contexte.Provider value={{ moi, poser }}>{children}</Contexte.Provider>;
}

export function useMoi(): Valeur {
  const v = useContext(Contexte);
  if (!v) throw new Error("useMoi hors du fournisseur");
  return v;
}

/** Le prénom, pour les endroits étroits : le premier mot du nom. */
export function prenomDe(nom: string): string {
  return nom.trim().split(/\s+/)[0] || nom;
}
