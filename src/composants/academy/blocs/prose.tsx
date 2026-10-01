import katex from "katex";
import { Fragment, type ReactNode } from "react";
import { cx } from "@/lib/format";

// ─────────────────────────────────────────────────────────────────────────────
// LE MARKDOWN RESTREINT.
//
// Cinq marques, pas une de plus :
//
//     **gras**      *italique*     `code`
//     [texte](url)  $formule$
//
// Pas de titres, ce sont des blocs. Pas d'images, ce sont des blocs. Pas de
// listes, ce sont des blocs. Pas de HTML brut, jamais : ce fichier construit
// des éléments React, il n'injecte rien. La seule chaîne qui traverse
// `dangerouslySetInnerHTML` est la sortie de KaTeX, produite ici, à partir
// d'une source que nous écrivons.
//
// Cette pauvreté est le but. Un contenu qui n'accepte que ce qu'on sait rendre
// ne peut pas produire d'écran cassé, et se convertira sans perte le jour où
// il vivra dans une base.
// ─────────────────────────────────────────────────────────────────────────────

/** `\theta` en HTML+MathML. Une formule fausse s'affiche en rouge plutôt que de faire tomber la page. */
function formuleEnLigne(latex: string): string {
  return katex.renderToString(latex, {
    displayMode: false,
    throwOnError: false,
    output: "htmlAndMathml",
    strict: "ignore",
  });
}

const MARQUES =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\$[^$]+\$)/g;

// Écrites en échappement : une espace insécable posée telle quelle dans le
// source est invisible, et se fait « corriger » au premier reformatage.
const FINE = "\u202f"; // espace fine insécable, avant ? ! ; » et après «
const INSEC = "\u00a0"; // espace insécable, avant :

/**
 * La ponctuation double du français demande une espace AVANT, et cette espace
 * ne se coupe pas : sans elle on lit « cachée \n ? Réponds », le point
 * d'interrogation seul en début de ligne. On l'applique au texte nu seulement,
 * jamais dans un bloc de code ni dans une formule, où une espace insécable
 * changerait ce qui est écrit.
 */
function espacerLaPonctuation(texte: string): string {
  return texte
    .replace(/ +([?!;»%])/g, `${FINE}$1`)
    .replace(/« +/g, `«${FINE}`)
    .replace(/ +:/g, `${INSEC}:`);
}

function enLigne(texte: string, cle: string): ReactNode[] {
  const morceaux = texte.split(MARQUES);
  return morceaux.map((m, i) => {
    const k = `${cle}-${i}`;
    if (!m) return null;

    // Le gras et l'italique se relisent : « **$0{,}9208$** » est une phrase
    // banale d'un cours de maths, et l'écrire ne doit pas faire apparaître les
    // dollars à l'écran. La récursion s'arrête d'elle-même, la marque exigeant
    // un intérieur sans astérisque. Le code, lui, ne se relit pas : ce qu'on
    // écrit entre accents graves est littéral, c'est tout son intérêt.
    if (m.startsWith("**") && m.endsWith("**") && m.length > 4) {
      return (
        <strong key={k} className="t-corps-f">
          {enLigne(m.slice(2, -2), k)}
        </strong>
      );
    }
    if (m.startsWith("*") && m.endsWith("*") && m.length > 2) {
      return <em key={k}>{enLigne(m.slice(1, -1), k)}</em>;
    }
    if (m.startsWith("`") && m.endsWith("`") && m.length > 2) {
      return (
        <code
          key={k}
          className="t-tech border border-filet bg-gris-04 px-[0.28em] py-[0.08em] text-[0.92em]"
        >
          {m.slice(1, -1)}
        </code>
      );
    }
    if (m.startsWith("[")) {
      const coupe = m.indexOf("](");
      const libelle = m.slice(1, coupe);
      const href = m.slice(coupe + 2, -1);
      const dehors = /^https?:/.test(href);
      return (
        <a
          key={k}
          href={href}
          className="lien"
          {...(dehors ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {libelle}
        </a>
      );
    }
    if (m.startsWith("$") && m.endsWith("$") && m.length > 2) {
      return (
        <span
          key={k}
          className="katex-ligne"
          dangerouslySetInnerHTML={{ __html: formuleEnLigne(m.slice(1, -1)) }}
        />
      );
    }
    return <Fragment key={k}>{espacerLaPonctuation(m)}</Fragment>;
  });
}

/**
 * Un ou plusieurs paragraphes. Les lignes vides séparent ; une ligne simple ne
 * coupe pas, on écrit du texte, pas du code.
 */
export function Prose({
  texte,
  className,
  ton = "normal",
}: {
  texte: string;
  className?: string;
  ton?: "normal" | "attenue";
}) {
  const paragraphes = texte.split(/\n\s*\n/).filter((p) => p.trim());
  return (
    <>
      {paragraphes.map((p, i) => (
        <p
          key={i}
          className={cx(
            "t-corps text-[0.9375rem] leading-[1.62]",
            ton === "attenue" ? "text-gris-72" : "text-encre",
            i > 0 && "mt-[0.85em]",
            className,
          )}
        >
          {enLigne(p.trim(), `p${i}`)}
        </p>
      ))}
    </>
  );
}

/** La même grammaire, sur une seule ligne, sans balise de paragraphe. */
export function Ligne({ texte }: { texte: string }) {
  return <>{enLigne(texte, "l")}</>;
}

/**
 * La légende d'une figure, quelle que soit la figure : image, vidéo, graphique,
 * animation, démonstration, tableau, bloc de code. Elles avaient le même dessin
 * recopié en neuf endroits, et le même défaut aux neuf : le texte y arrivait
 * brut, si bien qu'une légende qui citait un chiffre affichait ses dollars.
 * Un seul composant, une seule grammaire.
 */
export function Legende({ texte }: { texte: string | undefined }) {
  if (!texte) return null;
  return (
    <figcaption className="t-corps mt-2 text-[0.8125rem] leading-[1.45] text-gris-72">
      <Ligne texte={texte} />
    </figcaption>
  );
}
