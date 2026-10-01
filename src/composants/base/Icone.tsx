// ─────────────────────────────────────────────────────────────────────────────
// Le jeu d'icônes. Il n'existait pas : celui-ci est proposé.
//
// Trois règles, tenues partout :
//   1. Grille de 16, trait de 1,5, bouts carrés, angles vifs. C'est le trait du
//      film de construction, pas celui d'une bibliothèque d'interface.
//   2. Aucun triangle pointe en bas. Cette forme appartient au signe, et à lui
//      seul : une icône qui lui ressemble affaiblirait la marque.
//   3. Aucune étincelle, aucune baguette magique, aucun cerveau.
// ─────────────────────────────────────────────────────────────────────────────

export type NomIcone =
  | "recherche"
  | "croix"
  | "plus"
  | "moins"
  | "coche"
  | "fleche-droite"
  | "fleche-gauche"
  | "fleche-bas"
  | "sortie"
  | "chevron-bas"
  | "chevron-droite"
  | "horloge"
  | "depot"
  | "cadenas"
  | "copie"
  | "personne"
  | "personnes"
  | "calendrier"
  | "enveloppe"
  | "filtre"
  | "notes"
  | "cours"
  | "video"
  | "atelier"
  | "papier"
  | "jeu"
  | "outil"
  | "veille"
  | "planche"
  | "clavier"
  | "compte"
  // Les deux marqueurs du parcours. Les spécifications de cours les notent
  // avec des emoji ; un emoji est une image de police, il change de dessin
  // d'un système à l'autre et ignore la couleur du texte. Ici ce sont deux
  // tracés du même jeu que les autres.
  | "jalon"
  | "eprouvette";

const D: Record<NomIcone, React.ReactNode> = {
  recherche: (
    <>
      <circle cx="7" cy="7" r="4.4" />
      <path d="M10.4 10.4 14 14" />
    </>
  ),
  croix: <path d="M3.6 3.6 12.4 12.4M12.4 3.6 3.6 12.4" />,
  plus: <path d="M8 3v10M3 8h10" />,
  moins: <path d="M3 8h10" />,
  coche: <path d="M2.8 8.4 6.4 12 13.2 4.4" />,
  "fleche-droite": <path d="M2.5 8h11M9.5 4l4 4-4 4" />,
  "fleche-gauche": <path d="M13.5 8h-11M6.5 4l-4 4 4 4" />,
  "fleche-bas": <path d="M8 2.5v11M4 9.5l4 4 4-4" />,
  sortie: <path d="M6 3h7v7M13 3 4.5 11.5M11.5 13H3V4.5" />,
  "chevron-bas": <path d="M3.8 6 8 10.2 12.2 6" />,
  "chevron-droite": <path d="M6 3.8 10.2 8 6 12.2" />,
  horloge: (
    <>
      <circle cx="8" cy="8" r="5.6" />
      <path d="M8 4.3V8l2.6 1.6" />
    </>
  ),
  depot: (
    <>
      <rect x="2.4" y="3" width="11.2" height="10.4" />
      <path d="M2.4 6.4h11.2M5.6 9.2h4.8M5.6 11.2h3.2" />
    </>
  ),
  cadenas: (
    <>
      <rect x="3" y="7" width="10" height="6.6" />
      <path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" />
    </>
  ),
  copie: (
    <>
      <rect x="2.4" y="5.6" width="8" height="8" />
      <path d="M5.6 5.6V2.4h8v8h-3.2" />
    </>
  ),
  personne: (
    <>
      <circle cx="8" cy="5.2" r="2.7" />
      <path d="M2.9 14v-1.3c0-1.9 2.3-2.9 5.1-2.9s5.1 1 5.1 2.9V14" />
    </>
  ),
  personnes: (
    <>
      <circle cx="6" cy="5.4" r="2.5" />
      <path d="M1.4 14v-1.2c0-1.8 2-2.7 4.6-2.7s4.6.9 4.6 2.7V14" />
      <path d="M11 3.4a2.5 2.5 0 0 1 0 4.8M12 10.4c1.6.3 2.6 1.1 2.6 2.4V14" />
    </>
  ),
  calendrier: (
    <>
      <rect x="2.4" y="3.4" width="11.2" height="10.2" />
      <path d="M2.4 6.8h11.2M5.6 1.8v3.2M10.4 1.8v3.2" />
    </>
  ),
  enveloppe: (
    <>
      <rect x="1.8" y="3.8" width="12.4" height="8.4" />
      <path d="m1.8 3.8 6.2 5.2 6.2-5.2" />
    </>
  ),
  filtre: <path d="M2.4 4.2h11.2M4.4 8h7.2M6.4 11.8h3.2" />,
  notes: <path d="M2.6 3.4h10.8M2.6 6.6h10.8M2.6 9.8h8M2.6 13h5" />,
  cours: (
    <path d="M8 4.4c-1.5-1.5-3.4-1.6-5.6-1.4v9.6c2.2-.2 4.1-.1 5.6 1.4 1.5-1.5 3.4-1.6 5.6-1.4V3c-2.2-.2-4.1-.1-5.6 1.4ZM8 4.4V14" />
  ),
  video: (
    <>
      <rect x="1.8" y="3.6" width="8.8" height="8.8" />
      <path d="m10.6 7 3.6-2.4v6.8L10.6 9" />
    </>
  ),
  atelier: (
    <>
      <path d="M2.6 13.4 8.8 7.2M7.6 6 5 3.4l-2 .6.5 2.2 2.6 2.4" />
      <path d="m9.4 8.8 3.2 3.2-1.4 1.4-3.2-3.2M10.2 6.6l2-2M8.6 5l2-2" />
    </>
  ),
  papier: (
    <>
      <path d="M3.4 2h6l3.2 3.2V14H3.4Z" />
      <path d="M9.4 2v3.4h3.2M5.8 8.4h4.4M5.8 11h3" />
    </>
  ),
  jeu: (
    <>
      <ellipse cx="8" cy="4.2" rx="5.4" ry="1.9" />
      <path d="M2.6 4.2v7.6c0 1 2.4 1.9 5.4 1.9s5.4-.9 5.4-1.9V4.2M2.6 8c0 1 2.4 1.9 5.4 1.9s5.4-.9 5.4-1.9" />
    </>
  ),
  outil: (
    <>
      <rect x="2.4" y="2.4" width="4.8" height="4.8" />
      <rect x="8.8" y="2.4" width="4.8" height="4.8" />
      <rect x="2.4" y="8.8" width="4.8" height="4.8" />
      <path d="M8.8 11.2h4.8M11.2 8.8v4.8" />
    </>
  ),
  veille: (
    <>
      <rect x="1.8" y="3" width="12.4" height="10" />
      <path d="M4.4 5.8h4.2v3.4H4.4zM10.4 5.8h1.4M10.4 8.2h1.4M4.4 11.4h7.4" />
    </>
  ),
  planche: (
    <>
      <rect x="1.8" y="2.6" width="12.4" height="10.8" />
      <path d="M1.8 6h12.4M6 6v7.4" />
    </>
  ),
  clavier: (
    <>
      <rect x="1.4" y="4" width="13.2" height="8" />
      <path d="M4 6.6h.01M6.4 6.6h.01M8.8 6.6h.01M11.2 6.6h.01M5 9.4h6" />
    </>
  ),
  // Le compte : une carte, avec la personne à gauche et deux lignes à droite.
  // Une carte et non un buste seul, pour que l'entrée du rail ait la même
  // masse que « Planche » et « Veille », qui sont des cadres eux aussi.
  compte: (
    <>
      <rect x="1.8" y="3" width="12.4" height="10" />
      <circle cx="5.8" cy="7" r="1.6" />
      <path d="M3.6 11.2c.3-1.3 1.1-2 2.2-2s1.9.7 2.2 2M10 6.4h2.4M10 8.8h2.4" />
    </>
  ),
  // Un jalon : le mât planté, et le fanion. Pas une punaise de carte, dont la
  // tête ronde et la pointe basse jureraient avec le reste du jeu.
  jalon: <path d="M4.2 2v12M4.2 2.8h7.6v4.6H4.2" />,
  // Une éprouvette, à parois droites. Une fiole conique ferait un triangle
  // pointe en bas, et cette forme appartient au signe.
  eprouvette: <path d="M4.9 2h6.2M6.5 2v11h3v-11M6.5 8.6h3" />,
};

export function Icone({
  nom,
  className = "h-4 w-4",
  epaisseur = 1.5,
}: {
  nom: NomIcone;
  className?: string;
  epaisseur?: number;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={epaisseur}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {D[nom]}
    </svg>
  );
}
