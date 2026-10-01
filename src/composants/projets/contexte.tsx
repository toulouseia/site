"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { REGLAGES_VIDES, type Reglages } from "@/lib/tri-projets";

type Valeur = {
  reglages: Reglages;
  regler: (f: (v: Reglages) => Reglages) => void;
  remettre: () => void;
};

const Contexte = createContext<Valeur | null>(null);

/**
 * Les réglages de la planche vivent au-dessus des deux zones : le volet peut
 * donc filtrer la liste. C'est ce qui fait qu'une surface divisée en zones est
 * une application et pas deux pages côte à côte.
 */
export function FournisseurReglages({ children }: { children: ReactNode }) {
  const [reglages, setReglages] = useState<Reglages>(REGLAGES_VIDES);
  return (
    <Contexte.Provider
      value={{
        reglages,
        regler: (f) => setReglages((v) => f(v)),
        remettre: () => setReglages(REGLAGES_VIDES),
      }}
    >
      {children}
    </Contexte.Provider>
  );
}

export function useReglages() {
  const v = useContext(Contexte);
  if (!v) throw new Error("useReglages hors du fournisseur");
  return v;
}
