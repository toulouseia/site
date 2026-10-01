"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as EvtPointeur,
} from "react";
import type { ProjetComplet } from "@/donnees/api";
import { Lockup } from "@/composants/base/Marque";
import { Icone } from "@/composants/base/Icone";
import { enCarte, ordreCarrousel } from "@/lib/carrousel";
import { CarteProjet } from "./Carte";
import { IndexProjets } from "./IndexProjets";

// ─────────────────────────────────────────────────────────────────────────────
// Le carrousel, et le problème qu'il pose.
//
// Un carrousel montre une carte, et il y a dix-sept projets : le dix-septième
// est à seize gestes. La réponse tient en un objet, le même sur les deux
// formats — une règle graduée, dix-sept traits, celui où l'on est en brique.
// Elle dit d'un coup d'œil combien il y en a et où l'on en est ; on y glisse le
// doigt pour sauter n'importe où ; sur ordinateur elle montre en plus la
// fenêtre des cartes visibles. C'est la barre de défilement du carrousel, pas
// une commande : la seule commande de l'écran est à côté, et elle ouvre
// l'index — la recherche, les filtres et les dix-sept en une page.
//
// Aucune carte n'est cachée, aucune n'est coupée par le bord sur ordinateur,
// rien ne bouge tout seul, et il n'y a pas de petite flèche à viser.
// ─────────────────────────────────────────────────────────────────────────────

const ID_PISTE = "piste-projets";

/**
 * Placement de la bande au moment de l'analyse du HTML. Voir plus bas.
 * On réessaie à l'image suivante puis au chargement complet : tant que la
 * feuille de style n'est pas posée, les cartes n'ont pas encore de largeur et
 * il n'y a rien à mesurer.
 */
const PLACEMENT = `(function(){function pose(){
var p=document.getElementById("${ID_PISTE}");
if(!p||!window.matchMedia("(min-width: 1024px)").matches)return true;
var c=p.querySelectorAll("[data-carte]");if(c.length<2)return false;
var pas=c[1].offsetLeft-c[0].offsetLeft;if(pas<=0)return false;
var i=+p.getAttribute("data-choisi")||0;
p.scrollLeft=Math.min(i*pas,p.scrollWidth-p.clientWidth);return true;}
if(!pose())requestAnimationFrame(function(){if(!pose())addEventListener("load",pose);});})();`;

export function Carrousel({
  projets,
  ouvert,
}: {
  projets: ProjetComplet[];
  /** Le nom court du projet ouvert, décidé par l'écran — l'adresse n'est lue qu'une fois. */
  ouvert: string | null;
}) {
  const ordre = useMemo(() => ordreCarrousel(projets), [projets]);
  const cartes = useMemo(() => ordre.map(enCarte), [ordre]);
  const total = cartes.length;

  const slug = ouvert;
  // Sans projet ouvert, c'est le premier qui est choisi : sur ordinateur sa
  // fiche est déjà dépliée en dessous, l'écran n'arrive jamais à moitié vide.
  const choisi = Math.max(
    0,
    cartes.findIndex((c) => c.slug === slug),
  );

  const piste = useRef<HTMLDivElement>(null);
  // La règle part de la carte choisie, pas de zéro : sur le serveur c'est la
  // seule position connue, et c'est la bonne — la bande s'y place aussi. Sans
  // projet ouvert, choisi vaut zéro et le premier rendu est le même partout.
  const [centre, setCentre] = useState(choisi);
  const [fenetre, setFenetre] = useState({ premier: choisi, nb: 1 });
  const [grand, setGrand] = useState(false);
  const [index, setIndex] = useState(false);
  const retour = useRef<number | null>(null);
  // Rien ne s'anime avant que la piste soit posée : au chargement, la carte
  // choisie doit être déjà noire et déjà en place, pas en train de le devenir.
  const [pret, setPret] = useState(false);
  const prete = useRef(false);

  /** Où en est la piste : la carte au centre, et la fenêtre visible. */
  const mesurer = useCallback(() => {
    const el = piste.current;
    if (!el) return;
    const doms = el.querySelectorAll<HTMLElement>("[data-carte]");
    if (doms.length < 2) return;
    const pas = doms[1].offsetLeft - doms[0].offsetLeft;
    if (pas <= 0) return;
    const debut = doms[0].offsetLeft;
    const large = doms[0].offsetWidth;
    const x = el.scrollLeft;
    const borne = (i: number) => Math.min(total - 1, Math.max(0, i));
    setCentre(borne(Math.round((x + el.clientWidth / 2 - debut - large / 2) / pas)));
    const nb = Math.max(1, Math.round(el.clientWidth / pas));
    setFenetre({
      premier: Math.max(0, Math.min(total - nb, Math.round(x / pas))),
      nb,
    });
  }, [total]);

  const image = useRef(0);
  const onDefile = useCallback(() => {
    if (image.current) return;
    image.current = requestAnimationFrame(() => {
      image.current = 0;
      mesurer();
    });
  }, [mesurer]);

  useEffect(() => {
    mesurer();
    const el = piste.current;
    if (!el) return;
    const oeil = new ResizeObserver(mesurer);
    oeil.observe(el);
    return () => oeil.disconnect();
  }, [mesurer]);

  // Le format décide de ce qu'est « la carte construite » : au centre sur
  // téléphone, choisie sur ordinateur. Mesuré après le montage, jamais rendu
  // par le serveur — les deux écrans partent de la même image.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const lire = () => setGrand(mq.matches);
    lire();
    mq.addEventListener("change", lire);
    const t = window.setTimeout(() => {
      prete.current = true;
      setPret(true);
    }, 180);
    return () => {
      mq.removeEventListener("change", lire);
      window.clearTimeout(t);
    };
  }, []);

  const aller = useCallback(
    (i: number, doux = true) => {
      const el = piste.current;
      if (!el) return;
      const doms = el.querySelectorAll<HTMLElement>("[data-carte]");
      const cible = doms[Math.min(total - 1, Math.max(0, i))];
      if (!cible) return;
      const versDebut = window.matchMedia("(min-width: 1024px)").matches;
      const gauche = versDebut
        ? cible.offsetLeft - doms[0].offsetLeft
        : cible.offsetLeft + cible.offsetWidth / 2 - el.clientWidth / 2;
      el.scrollTo({ left: gauche, behavior: doux ? "smooth" : "auto" });
    },
    [total],
  );

  // Ordinateur : la carte choisie ne sort jamais de la bande. Le format se lit
  // ici plutôt que dans l'état : la bande doit se placer au premier passage,
  // sans attendre le rendu suivant.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const el = piste.current;
    if (!el) return;
    const dom = el.querySelectorAll<HTMLElement>("[data-carte]")[choisi];
    if (!dom) return;
    const gauche = dom.offsetLeft - el.scrollLeft;
    if (gauche < -1 || gauche + dom.offsetWidth > el.clientWidth + 1) {
      aller(choisi, prete.current);
    }
  }, [choisi, aller]);

  // Téléphone : en revenant d'une fiche, on retrouve la carte qu'on avait
  // ouverte, pas le début de la piste.
  useEffect(() => {
    if (grand) return;
    if (slug) {
      retour.current = choisi;
      return;
    }
    if (retour.current !== null) {
      aller(retour.current, false);
      retour.current = null;
    }
  }, [grand, slug, choisi, aller]);

  function onTouche(e: React.KeyboardEvent) {
    const sauts: Record<string, number> = {
      ArrowRight: centre + 1,
      ArrowLeft: centre - 1,
      Home: 0,
      End: total - 1,
    };
    const cible = sauts[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    aller(cible);
  }

  /** Téléphone : toucher une carte qui dépasse du bord l'amène au centre. */
  function devant(i: number) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      if (grand || i === centre) return;
      e.preventDefault();
      aller(i);
    };
  }

  return (
    <div className="ecran-carrousel">
      <div className="marque-projets">
        <Lockup plein className="h-[1.05rem] text-encre" />
      </div>

      {/* `piste-cadre` et non `bande` : `bande` est déjà, dans toute
          l'application, la ligne qui s'inverse quand on la choisit — les cases
          du mur en sont. Deux dessins différents sous un même nom se
          seraient écrasés. */}
      <div className="piste-cadre">
        <div
          id={ID_PISTE}
          ref={piste}
          className="piste no-scrollbar"
          data-pret={pret ? "true" : undefined}
          data-choisi={choisi}
          tabIndex={0}
          role="group"
          aria-label="Les projets, carrousel"
          onScroll={onDefile}
          onKeyDown={onTouche}
        >
          {cartes.map((c, i) => (
            <CarteProjet
              key={c.slug}
              carte={c}
              actif={i === choisi}
              centre={i === centre}
              position={i + 1}
              total={total}
              onDevant={devant(i)}
            />
          ))}
        </div>
      </div>

      {/* La bande se place pendant l'analyse du HTML, pas après l'hydratation :
          ouvrir l'adresse d'un projet lointain doit le montrer dans la bande dès
          le premier affichage, même si le JavaScript de l'application met une
          seconde à arriver. Six lignes, exécutées une fois, jamais rejouées. */}
      <script dangerouslySetInnerHTML={{ __html: PLACEMENT }} />

      <Regle
        total={total}
        premier={fenetre.premier}
        nb={fenetre.nb}
        marque={grand ? choisi : centre}
        onAller={aller}
        onIndex={() => setIndex(true)}
      />

      {index ? (
        <IndexProjets
          projets={ordre}
          onFermer={() => setIndex(false)}
          onChoisir={(i) => {
            aller(i, false);
            setIndex(false);
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * La règle graduée : un trait par projet, tous les cinq un trait long, celui
 * où l'on est en brique et, sur ordinateur, la fenêtre des cartes visibles.
 * On y glisse le doigt comme sur une réglette. C'est la seule chose de cet
 * écran qui compte quelque chose — et elle le dessine au lieu de l'écrire.
 */
function Regle({
  total,
  premier,
  nb,
  marque,
  onAller,
  onIndex,
}: {
  total: number;
  premier: number;
  nb: number;
  marque: number;
  onAller: (i: number, doux?: boolean) => void;
  onIndex: () => void;
}) {
  const traits = useRef<HTMLDivElement>(null);

  function viser(x: number, doux: boolean) {
    const el = traits.current;
    if (!el) return;
    const boite = el.getBoundingClientRect();
    const part = (x - boite.left) / boite.width;
    onAller(Math.round(part * (total - 1)), doux);
  }

  return (
    <div className="regle">
      <div
        ref={traits}
        className="regle-traits"
        aria-hidden="true"
        onPointerDown={(e: EvtPointeur<HTMLDivElement>) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          viser(e.clientX, true);
        }}
        onPointerMove={(e: EvtPointeur<HTMLDivElement>) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          viser(e.clientX, false);
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="regle-trait"
            data-cinq={(i + 1) % 5 === 0 ? "true" : undefined}
            data-etat={
              i === marque
                ? "marque"
                : i >= premier && i < premier + nb
                  ? "vue"
                  : "loin"
            }
          />
        ))}
      </div>

      <button type="button" onClick={onIndex} className="regle-cmd">
        <Icone nom="notes" className="h-[15px] w-[15px]" />
        Tous les projets
      </button>
    </div>
  );
}
