"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icone } from "@/composants/base/Icone";
import { cx } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// L'affiche d'un projet, agrandie au clic. Sur la fiche, l'illustration tient
// une petite vignette ; on peut vouloir la lire en grand. Un clic l'ouvre au
// milieu de l'écran, entière cette fois (`contain`, jamais recadrée), sur un
// fond sombre. On la ferme d'un clic sur le fond, de la croix, ou d'Échap.
//
// Le mur, lui, ne s'agrandit pas : sa case est un lien vers le projet. Ce geste
// n'est offert que là où l'illustration n'est plus une porte — sur la fiche.
// ─────────────────────────────────────────────────────────────────────────────

export function AfficheAgrandissable({
  src,
  alt,
  nom,
  className,
  children,
}: {
  src: string;
  /** Le texte de rechange ; à défaut, le nom du projet. */
  alt?: string;
  nom: string;
  /** Les classes de la vignette-déclencheur (`fiche-image`, etc.). */
  className?: string;
  /** La vignette elle-même : l'image et le cartouche du signe. */
  children: React.ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);
  const fermeture = useRef<HTMLButtonElement>(null);
  const legende = alt ?? nom;

  useEffect(() => {
    if (!ouvert) return;
    fermeture.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ouvert]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label={`Agrandir l'affiche : ${legende}`}
        className={cx("affiche-loupe", className)}
      >
        {children}
        {/* La loupe, en bas à droite : elle dit que l'affiche s'ouvre. */}
        <span className="affiche-loupe-marque" aria-hidden>
          <Icone nom="recherche" className="h-3.5 w-3.5" />
        </span>
      </button>

      {ouvert && typeof document !== "undefined"
        ? createPortal(
            // Un portail vers `document.body` : sans lui, la fenêtre resterait
            // prisonnière de la colonne fiche, un contexte d'empilement qui
            // passe sous le mur et la barre latérale. Sortie de là, elle couvre
            // enfin tout l'écran.
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-6"
              role="dialog"
              aria-modal="true"
              aria-label={legende}
            >
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOuvert(false)}
                className="absolute inset-0 bg-encre/80"
              />
              <span className="an-monte affiche-plein-cadre">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={legende} className="affiche-plein" />
                <button
                  ref={fermeture}
                  type="button"
                  onClick={() => setOuvert(false)}
                  aria-label="Fermer l'agrandissement"
                  className="affiche-plein-fermer"
                >
                  <Icone nom="croix" className="h-4 w-4" />
                </button>
              </span>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
