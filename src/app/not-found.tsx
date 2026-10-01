import Link from "next/link";
import { Lockup, Signe } from "@/composants/base/Marque";
import { Icone } from "@/composants/base/Icone";

export const metadata = { title: "Adresse inconnue — Toulouse IA" };

/**
 * L'écran d'adresse inconnue. Il ne s'excuse pas : il redonne les quatre
 * portes de l'application, et le signe y sort du cadre plutôt que d'être
 * posé au milieu comme une décoration.
 */
export default function Introuvable() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-papier">
      {/* Le signe sort du cadre par le coin — et seulement là où il reste un
          coin à tenir. Sur téléphone il n'aurait rien à faire d'autre que
          décorer, alors il n'y est pas. */}
      <Signe
        plein
        className="pointer-events-none absolute -right-[10vw] -bottom-[18vh] hidden h-[70vh] text-encre opacity-[0.05] lg:block"
      />

      <div className="relative flex items-center gap-3 border-b border-filet px-4 py-3.5 lg:px-6">
        <Link href="/projets">
          <Lockup plein className="h-[1.2rem] text-encre" />
        </Link>
        <span className="t-etq text-gris-58">association</span>
      </div>

      <div
        className="trame trame-haut relative flex flex-1 items-start px-4 pt-10 pb-16 lg:items-center lg:px-10 lg:pt-16"
        style={{ ["--trame-op" as string]: "0.09" }}
      >
        <div className="w-full max-w-[38rem]">
          <p className="t-etq text-brique">Erreur 404</p>
          <h1 className="t-titre-xl mt-3 text-[clamp(2rem,7vw,3.5rem)]">
            Adresse inconnue
          </h1>
          <p className="t-tech mt-3 text-[0.8125rem] text-gris-58">
            Rien à cette adresse · 4 portes ouvertes
          </p>

          <ul className="mt-8 border-t border-filet">
            {[
              { href: "/projets", nom: "Projets", detail: "ce qui se fabrique" },
              {
                href: "/apprendre",
                nom: "AI Academy",
                detail: "ressources et séances",
              },
              { href: "/veille", nom: "Veille", detail: "les numéros" },
              {
                href: "/outils",
                nom: "Outils",
                detail: "la boîte à outils",
              },
            ].map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="bande flex items-center gap-3 border-b border-filet px-2 py-3 hover:bg-sombre hover:text-papier"
                >
                  <span className="t-titre min-w-0 flex-1 text-[1rem]">
                    {d.nom}
                  </span>
                  <span className="t-tech text-[0.6875rem] opacity-60">
                    {d.detail}
                  </span>
                  <Icone nom="fleche-droite" className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
