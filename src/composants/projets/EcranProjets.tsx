"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProjetComplet } from "@/donnees/api";
import { chargerProjets, fusionner } from "@/donnees/distant";
import { filtrer } from "@/lib/tri-projets";
import { adresseProjet, estFicheDistante, projetOuvert } from "@/lib/format";
import { SqueletteVolet } from "@/composants/base/Squelette";
import { FournisseurReglages, useReglages } from "./contexte";
import { Chercher } from "./Chercher";
import { Carrousel } from "./Carrousel";
import { Fiche } from "./Fiche";
import { Introuvable } from "./Introuvable";
import { Mur } from "./Mur";

// ─────────────────────────────────────────────────────────────────────────────
// L'écran des projets, dans ses deux formes — et les deux ne viennent pas du
// même essai. C'est la décision du 17 août 2026 : l'ordinateur vient de la
// forme A, le téléphone de la forme C, et cet écran est l'endroit où elles se
// rejoignent.
//
// Téléphone : le carrousel, une carte par écran, la règle graduée en bas.
// Ordinateur : le mur au centre, la fiche à droite, la page ne défile jamais.
//
// Tant qu'aucun projet n'est ouvert, le survol suffit à parcourir le mur : la
// fiche suit la souris, avec soixante-dix millisecondes de retard pour qu'un
// quart de l'écran ne clignote pas quand on le traverse. Dès qu'on a cliqué
// un projet, la fiche est la sienne et le survol ne la change plus — décision
// d'Alexis du 15 septembre 2026 : ce qu'on lit à droite doit être ce qu'on a
// choisi, pas la dernière case où le curseur a traîné.
// ─────────────────────────────────────────────────────────────────────────────

const ATTENTE_SURVOL = 70;

/** Le serveur a huit secondes ; passé ce délai, le mur reste celui du code. */
const DELAI_SERVEUR = 8000;

// ─────────────────────────────────────────────────────────────────────────────
// Le mur et la base.
//
// La page arrive avec les projets écrits dans le code — c'est ce qui garantit
// qu'elle s'affiche quoi qu'il arrive au serveur. Une fois posée, elle demande
// `GET /api/projets` une fois, et fusionne : les projets de la base par-dessus
// ceux du code, la base gagnant sur un nom court commun, le tout rangé par
// date de mise à jour. Carrousel, mur, fiche du survol et mesures voient la
// liste fusionnée. Si le serveur ne répond pas, rien ne change et rien ne le
// dit : les cinq projets sont là, et c'est le contrat.
//
// La fiche commune (`/projets/fiche?p=`) peut aussi glisser un projet dans la
// liste : celui qu'elle vient de lire et que le mur public ne donne pas — le
// mien, retiré ou en attente. Sans cela, sur ordinateur, la fiche de droite
// resterait vide. Et quand le nom court ne donne rien, elle le dit, pour que
// la colonne de droite montre l'absence plutôt que du blanc.
// ─────────────────────────────────────────────────────────────────────────────

type FicheCommune = {
  /** La fiche commune a lu ce projet : il rejoint la liste. */
  integrer: (projet: ProjetComplet) => void;
  /** La fiche commune n'a rien trouvé sous ce nom court. */
  signalerAbsent: (slug: string) => void;
};
const ContexteFicheCommune = createContext<FicheCommune>({
  integrer: () => {},
  signalerAbsent: () => {},
});

/** Ce que la fiche commune dit à l'écran des projets. */
export function useFicheCommune(): FicheCommune {
  return useContext(ContexteFicheCommune);
}

export function EcranProjets({
  projets,
  children,
}: {
  projets: ProjetComplet[];
  children: ReactNode;
}) {
  return (
    <FournisseurReglages>
      <Interieur projets={projets}>{children}</Interieur>
    </FournisseurReglages>
  );
}

/**
 * Le nom court dans `?p=`, lu par un composant feuille sous `Suspense` : c'est
 * la règle de Next pour une page fabriquée d'avance — seul ce composant est
 * rendu côté client, le mur autour reste préfabriqué.
 */
function LecteurRequete({ onP }: { onP: (p: string | null) => void }) {
  const p = useSearchParams().get("p");
  useEffect(() => onP(p), [p, onP]);
  return null;
}

/**
 * Reporte sur une liste fraîche les membres déjà connus d'une précédente. Le mur
 * ne charge pas les membres ; une fiche, si. Quand la lecture du mur se termine
 * après une fiche, elle ne doit pas effacer les membres que la fiche a apportés.
 */
function reporterMembres(
  fraiche: ProjetComplet[],
  precedente: readonly ProjetComplet[],
): ProjetComplet[] {
  const connus = new Map(
    precedente.filter((p) => p.membres?.length).map((p) => [p.slug, p.membres]),
  );
  if (connus.size === 0) return fraiche;
  return fraiche.map((p) =>
    p.membres?.length || !connus.has(p.slug)
      ? p
      : { ...p, membres: connus.get(p.slug) },
  );
}

function Interieur({
  projets: duCode,
  children,
}: {
  projets: ProjetComplet[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { reglages } = useReglages();

  // La liste que tout l'écran regarde : celle du code, puis la fusion.
  const [projets, setProjets] = useState<ProjetComplet[]>(duCode);
  useEffect(() => {
    const controle = new AbortController();
    const delai = window.setTimeout(() => controle.abort(), DELAI_SERVEUR);
    chargerProjets(controle.signal).then((r) => {
      window.clearTimeout(delai);
      if (controle.signal.aborted || !r.ok) return;
      // Le mur ne porte pas les membres (coût de lecture). Si une fiche en a
      // déjà chargé, on les reporte sur la liste rafraîchie : sans cela, ce
      // rafraîchissement — qui peut finir après la fiche — les effacerait, et
      // la colonne de droite, sur ordinateur, perdrait les membres reçus.
      setProjets((prec) => reporterMembres(fusionner(duCode, r.valeur.projets), prec));
    });
    return () => {
      window.clearTimeout(delai);
      controle.abort();
    };
  }, [duCode]);

  const integrer = useCallback((projet: ProjetComplet) => {
    // La fiche lue porte ce que le mur n'a pas : les membres, chargés sur la
    // fiche seulement. On la fait toujours gagner sur l'entrée du mur (même
    // slug), au lieu de la laisser de côté quand le projet y figure déjà —
    // sinon, sur ordinateur, la colonne de droite lit la version du mur, sans
    // membres. `fusionner` dédoublonne par slug et garde l'ordre par mise à jour.
    setProjets((liste) => fusionner(liste, [projet]));
  }, []);
  const [absent, setAbsent] = useState<string | null>(null);
  const ficheCommune = useMemo<FicheCommune>(
    () => ({ integrer, signalerAbsent: setAbsent }),
    [integrer],
  );

  // Le projet ouvert : le nom court de l'adresse, ou, sur la fiche commune,
  // celui de `?p=` — inconnu le temps d'un rendu, et l'écran attend sans
  // remontrer le carrousel.
  const [p, setP] = useState<string | null>(null);
  const surFiche = estFicheDistante(pathname);
  const ouvert = surFiche ? (p ?? "\u2026") : projetOuvert(pathname);

  const [survol, setSurvol] = useState<string | null>(null);
  const [gele, setGele] = useState(false);
  const [chercher, setChercher] = useState(false);
  const minuteur = useRef<number>(0);

  const resultats = useMemo(
    () => filtrer(projets, reglages),
    [projets, reglages],
  );

  const survoler = useCallback((slug: string | null) => {
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(
      () => setSurvol(slug),
      ATTENTE_SURVOL,
    );
  }, []);

  useEffect(() => () => window.clearTimeout(minuteur.current), []);

  // « / » ouvre la commande. C'est le geste des applications qu'on utilise
  // vraiment, et il ne coûte rien à l'écran.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const cible = e.target as HTMLElement | null;
      const dansUnChamp =
        cible &&
        (cible.tagName === "INPUT" ||
          cible.tagName === "TEXTAREA" ||
          cible.isContentEditable);
      if (e.key === "/" && !dansUnChamp) {
        e.preventDefault();
        setChercher(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const parSlug = useMemo(
    () => new Map(projets.map((p) => [p.slug, p])),
    [projets],
  );

  const defaut = resultats[0]?.slug ?? projets[0]?.slug ?? null;
  const slugCourant = gele
    ? (ouvert ?? defaut)
    : (ouvert ?? survol ?? defaut);
  const courant = slugCourant ? parSlug.get(slugCourant) : undefined;

  // La commande de recherche est celle de l'ordinateur : elle ouvre la fiche
  // du projet choisi. Sur téléphone, chercher passe par l'index du carrousel,
  // qui amène la carte sous les yeux sans changer d'adresse.
  function choisir(slug: string) {
    setChercher(false);
    const p = parSlug.get(slug);
    router.push(p ? adresseProjet(p) : `/projets/${slug}`);
  }

  return (
    <ContexteFicheCommune.Provider value={ficheCommune}>
    <div className="lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_21rem] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_25rem]">
      {surFiche ? (
        <Suspense fallback={null}>
          <LecteurRequete onP={setP} />
        </Suspense>
      ) : null}
      {/* ── Le centre ─────────────────────────────────────────────────── */}
      <div className="min-w-0 lg:h-full lg:overflow-hidden">
        {/* Le téléphone. Le carrousel reste monté quand une fiche s'ouvre :
            il garde sa position, et revenir retrouve la carte qu'on avait
            ouverte plutôt que le début de la piste. */}
        <div className="lg:hidden">
          <div className={ouvert ? "hidden" : undefined}>
            <Carrousel projets={projets} ouvert={ouvert} />
          </div>
          {ouvert ? children : null}
        </div>

        <div className="hidden h-full lg:block">
          <Mur
            projets={resultats}
            courant={slugCourant}
            selection={ouvert}
            onSurvol={survoler}
            onChercher={() => setChercher(true)}
          />
        </div>
      </div>

      {/* ── La fiche, toujours à droite, jamais en dessous ────────────── */}
      <div className="hidden border-l border-filet lg:block lg:h-full lg:overflow-hidden">
        {/* La fiche change d'un coup, sans fondu : un quart de l'écran qui se
            dissout à chaque survol serait plus nerveux que le contraire. Le
            délai de soixante-dix millisecondes fait tout le travail. */}
        {courant ? (
          <div key={courant.slug} className="h-full">
            <Fiche projet={courant} onComposeur={setGele} />
          </div>
        ) : surFiche ? (
          // La fiche commune lit encore, ou n'a rien trouvé.
          ouvert === absent ? <Introuvable /> : <SqueletteVolet />
        ) : null}
      </div>

      {chercher ? (
        <Chercher
          projets={projets}
          resultats={resultats}
          onChoisir={choisir}
          onFermer={() => setChercher(false)}
        />
      ) : null}
    </div>
    </ContexteFicheCommune.Provider>
  );
}
