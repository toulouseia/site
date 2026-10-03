// Les sources que la veille lit, et comment les découper en sujets. Ce fichier
// ne choisit rien : le choix est celui de la personne qui écrit le numéro.
//
// Chaque source a été retenue après lecture de ses conditions et de son
// robots.txt, le 23 septembre 2026. Le détail est dans `LISEZ-MOI.md`. Une
// source qui interdit la lecture automatique n'est pas ici : elle se lit à la
// main, et la récolte le rappelle en fin de liste (`A_LIRE_A_LA_MAIN`).
//
// Zéro dépendance npm. Le découpage se fait par expressions régulières ; si un
// gabarit change, `npm run veille:essais` casse sur les exemples de `essais/`,
// et c'est là qu'on répare.
//
// Ce que chaque découpage rend, pour un sujet :
//   { source, parution, rubrique, titre, resume, lien, sponsor, indice, origine }
// `parution` est une date AAAA-MM-JJ. `indice` est ce que la source dit de
// l'importance du sujet : « 3 min de lecture », « 412 points HN », ou rien.
// `origine` est l'adresse où on l'a lu, quand elle diffère du lien.

// ── Le texte ───────────────────────────────────────────────────────────────

const ENTITES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–",
  hellip: "…", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç",
};

export function decoder(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITES[e.toLowerCase()] ?? m;
  });
}

/** Le texte lisible d'un bout de HTML, sur une ligne. */
export function texte(html) {
  return decoder(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/li|\/div)\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

const couper = (s, n) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

/** Une date lisible par `Date` devenue AAAA-MM-JJ, ou "" si elle ne l'est pas. */
export function jour(brut) {
  const d = new Date(brut);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

// ── Les liens ──────────────────────────────────────────────────────────────

/**
 * L'adresse de la source, sans ce qu'on y a ajouté pour compter les visites :
 * `utm_*` et `lid`. Les sponsors de TLDR ont des `&amp;` échappés deux fois,
 * d'où le double décodage.
 */
export const estMarqueur = (cle, valeur = "") =>
  /^(source|ref|via)$/i.test(cle)
    ? /^(tldr[a-z-]*|newsletter|email|rss|hn|hackernews|alphasignal|substack|twitter|linkedin|reddit)$/i.test(valeur) ||
      /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(valeur)
    : /^(utm_.*|lid|ref_src|ref_url|referrer|mc_cid|mc_eid|fbclid|gclid|dclid|msclkid|igshid|_hsenc|_hsmi|mkt_tok|oly_enc_id|oly_anon_id|vero_id|ck_subscriber_id)$/i.test(cle);

export function nettoyerLien(brut) {
  const s = decoder(decoder(brut.trim()));
  let u;
  try {
    u = new URL(s);
  } catch {
    return s;
  }
  for (const cle of [...u.searchParams.keys()]) {
    if (estMarqueur(cle, u.searchParams.get(cle) ?? "")) u.searchParams.delete(cle);
  }
  u.hash = u.hash === "#" ? "" : u.hash;
  return u.toString();
}

/** La forme qui sert à reconnaître un même sujet repris par plusieurs sources. */
export function cleDeLien(lien) {
  try {
    const u = new URL(lien);
    const hote = u.hostname.replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
    // Un papier arXiv est le même en /abs/, /pdf/ et avec ou sans version.
    const arxiv = hote.endsWith("arxiv.org") && u.pathname.match(/^\/(?:abs|pdf|html)\/(\d{4}\.\d{4,5})/);
    if (arxiv) return `arxiv.org/abs/${arxiv[1]}`;
    return `${hote}${u.pathname.replace(/\/+$/, "")}${u.search}`.toLowerCase();
  } catch {
    return lien.toLowerCase();
  }
}

/** Le nom du site d'où vient un lien : `x.ai`, `arxiv.org`, `github.com/org`. */
export function editeur(lien) {
  try {
    const u = new URL(lien);
    const hote = u.hostname.replace(/^www\./, "");
    if (hote === "github.com" || hote === "huggingface.co") {
      const org = u.pathname.split("/").filter(Boolean)[0];
      return org && org !== "papers" ? `${hote}/${org}` : hote;
    }
    return hote;
  } catch {
    return "";
  }
}

/**
 * Parle-t-on d'IA ? Sert à trier les sources généralistes : Hacker News,
 * GitHub, la CNIL, Inria, la Commission. Les sigles se cherchent en capitales
 * pour ne pas prendre « ia » ou « ai » au milieu d'une phrase.
 */
const SIGLES_IA = /\b(AI|IA|LLMs?|GPT|RAG|VLMs?|MLOps|AGI)\b/;
const MOTS_IA =
  /\b(intelligence artificielle|artificial intelligence|machine[- ]learning|apprentissage (automatique|profond)|deep[- ]learning|neural|neurone|réseaux? de neurones|language models?|modèles? de langage|transformers?|diffusion model|fine-?tun|inférence|inference|agentic|agents? (IA|AI)|AI Act|règlement sur l'IA|chatbot|generative|générati(f|ve)|OpenAI|Anthropic|Claude|Gemini|DeepMind|Llama|Mistral|Qwen|DeepSeek|Hugging ?Face|PyTorch|CUDA|embeddings?|multimodal|reinforcement learning)/i;
export const parleIA = (s) => SIGLES_IA.test(s) || MOTS_IA.test(s);

// ── Les fils RSS et Atom ───────────────────────────────────────────────────
//
// Un seul découpage pour tous les fils. Il tolère ce qu'on rencontre : les
// <![CDATA[…]]>, le HTML échappé dans <description>, les balises en minuscules
// (le fil d'ANITI écrit <pubdate>), et le <link href="…"/> d'Atom.

function balise(bloc, ...noms) {
  for (const nom of noms) {
    const m = bloc.match(new RegExp(`<${nom}\\b[^>]*>([\\s\\S]*?)</${nom}>`, "i"));
    if (m) return m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
  }
  return "";
}

/** Les entrées d'un fil : [{ titre, lien, parution, resume, categories }]. */
const AVIS =
  /(\?\s*$)|\b(opinion|op-ed|essay|thoughts on|hot take|my take|manifesto|predictions?|future of|doom(er)?|apocalyp\w*|extinction|terrif\w*|scary|fear\w*|panic|bubble|hype|is dead|the end of|tribune|l'avenir de|la fin de|peur|menace)\b/i;
const CONCRET =
  /\b(show hn|introducing|launch(es|ed)?|release[sd]?|open[- ]sourc\w*|v\d+(\.\d+)+|how (we|to|i)|guide|tutorial|deep dive|under the hood|walkthrough|benchmark\w*|explained|technical report|tutoriel|lance|publie)\b/i;

const VITRINE =
  /\b(boosts?|saves?|grows?|completes?|frees up|cuts?|scales?)\b.*\bwith (chatgpt|codex|gpt|claude|gemini|copilot)|\b(reimagin\w*|customer stor\w*|case study|success story)\b/i;

export function tonDuSujet(titre, lien = "") {
  if (VITRINE.test(titre)) return "vitrine";
  if (AVIS.test(titre)) return "avis";
  if (CONCRET.test(titre) || /^https:\/\/(github\.com|huggingface\.co)\//.test(lien)) return "concret";
  return "";
}

export function decouperFil(xml) {
  const blocs = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);
  return blocs
    .map((b) => {
      let lien = balise(b, "link");
      if (!/^https?:/.test(lien)) {
        const atom =
          b.match(/<link\b[^>]*rel="alternate"[^>]*href="([^"]+)"/i) ?? b.match(/<link\b[^>]*href="([^"]+)"/i);
        lien = atom?.[1] ?? "";
      }
      const categories = [
        ...[...b.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)].map((m) =>
          m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1").trim(),
        ),
        ...[...b.matchAll(/<category\b[^>]*term="([^"]+)"/gi)].map((m) => m[1]),
      ].map(decoder);
      // Le HTML des résumés arrive tantôt tel quel, tantôt échappé une fois.
      const resume = texte(decoder(balise(b, "description", "summary")));
      return {
        titre: texte(decoder(balise(b, "title"))),
        lien: nettoyerLien(lien),
        parution: jour(balise(b, "pubDate", "published", "updated", "dc:date")),
        resume: couper(resume.replace(/\s*\[…\]\s*$/, "…"), 600),
        categories,
      };
    })
    .filter((e) => e.titre && /^https?:/.test(e.lien));
}

/**
 * Les fils lus tels quels. `garder` écarte ce qui n'est pas de l'IA, pour les
 * sites qui parlent de tout.
 */
export const FILS = [
  { nom: "OpenAI", famille: "labos", url: "https://openai.com/news/rss.xml" },
  { nom: "Google DeepMind", famille: "labos", url: "https://deepmind.google/blog/rss.xml" },
  { nom: "Mistral AI", famille: "labos", url: "https://mistral.ai/news/rss" },
  {
    nom: "NVIDIA",
    famille: "labos",
    url: "https://blogs.nvidia.com/feed/",
    // Le blog parle aussi de jeu vidéo et de la vie de l'entreprise.
    garder: (e) => !e.categories.some((c) => /GeForce|Gaming|NVIDIA Life|GFN/i.test(c)),
  },
  { nom: "NVIDIA Developer", famille: "labos", url: "https://developer.nvidia.com/blog/feed/" },
  { nom: "CNIL", famille: "ici", url: "https://www.cnil.fr/fr/rss.xml", garder: (e) => parleIA(`${e.titre} ${e.resume}`) },
  { nom: "Inria", famille: "ici", url: "https://www.inria.fr/fr/news_events/rss.xml", garder: (e) => parleIA(`${e.titre} ${e.resume}`) },
  {
    nom: "Commission européenne",
    famille: "ici",
    url: "https://digital-strategy.ec.europa.eu/en/rss.xml",
    garder: (e) => parleIA(`${e.titre} ${e.resume}`),
  },
  // Tout ANITI parle d'IA. Son fil n'a pas toujours de date : le sujet prend
  // alors celle de la récolte, et la personne qui choisit vérifie.
  { nom: "ANITI", famille: "ici", url: "https://aniti.univ-toulouse.fr/feed/", sansDate: true },
];

export function sujetsDuFil(fil, xml, depuis, aujourdhui) {
  return decouperFil(xml)
    .map((e) => ({ ...e, parution: e.parution || (fil.sansDate ? aujourdhui : "") }))
    .filter((e) => e.parution && e.parution >= depuis)
    .filter((e) => !fil.garder || fil.garder(e))
    .map((e) => ({
      source: fil.nom,
      parution: e.parution,
      rubrique: e.categories.slice(0, 2).join(", "),
      titre: e.titre,
      resume: e.resume,
      lien: e.lien,
      sponsor: false,
      indice: "",
      origine: "",
    }));
}

// ── Hugging Face ───────────────────────────────────────────────────────────
//
// Les papiers du jour : des articles arXiv proposés et votés par la communauté.
// L'API prend une date. On garde les plus votés de chaque jour, et le lien va
// vers la page arXiv du papier, que tout le monde cite.

export const hfPapiers = (date) => `https://huggingface.co/api/daily_papers?date=${date}&limit=100`;
export const HF_MODELES = "https://huggingface.co/api/models?sort=trendingScore&limit=50";

export function decouperPapiersHF(json, { parJour = 4, votesMin = 40 } = {}) {
  const papiers = (Array.isArray(json) ? json : [])
    .map((x) => ({ p: x.paper ?? {}, x }))
    .filter(({ p }) => p.id && (p.upvotes ?? 0) >= votesMin)
    .sort((a, b) => (b.p.upvotes ?? 0) - (a.p.upvotes ?? 0))
    .slice(0, parJour);
  return papiers.map(({ p, x }) => ({
    source: "Hugging Face Papers",
    parution: jour(x.publishedAt ?? p.submittedOnDailyAt ?? p.publishedAt),
    rubrique: "Papiers du jour",
    titre: texte(p.title ?? x.title ?? ""),
    resume: couper(texte(p.summary ?? x.summary ?? ""), 600),
    lien: `https://arxiv.org/abs/${p.id}`,
    sponsor: false,
    indice: `${p.upvotes} votes HF`,
    origine: `https://huggingface.co/papers/${p.id}`,
  }));
}

/** Les modèles qui montent, s'ils ont été publiés depuis `depuis`. */
export function decouperModelesHF(json, depuis, { max = 10 } = {}) {
  return (Array.isArray(json) ? json : [])
    .filter((m) => m.id && jour(m.createdAt) >= depuis)
    .slice(0, max)
    .map((m) => ({
      source: "Hugging Face",
      parution: jour(m.createdAt),
      rubrique: ["Modèles en tendance", m.pipeline_tag].filter(Boolean).join(", "),
      titre: m.id,
      resume: "",
      lien: `https://huggingface.co/${m.id}`,
      sponsor: false,
      indice: `${Number(m.likes ?? 0).toLocaleString("fr-FR")} likes HF`,
      origine: "",
    }));
}

// ── Hacker News ────────────────────────────────────────────────────────────
//
// L'API de recherche d'Algolia, que Hacker News désigne lui-même. Jamais les
// pages du site : ses conditions interdisent de les moissonner. On ne reprend
// que les titres et les liens, pas les commentaires, qui sont à leurs auteurs.

export const hnSemaine = (depuisSecondes, pointsMin = 150) =>
  `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i%3E${depuisSecondes},points%3E%3D${pointsMin}&hitsPerPage=300`;

export function decouperHN(json, { max = 20 } = {}) {
  return (json?.hits ?? [])
    .filter((h) => h.url && h.title && parleIA(h.title))
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .slice(0, max)
    .map((h) => ({
      source: "Hacker News",
      parution: jour(h.created_at),
      rubrique: "",
      titre: texte(h.title),
      resume: "",
      lien: nettoyerLien(h.url),
      sponsor: false,
      indice: `${h.points} points HN`,
      origine: `https://news.ycombinator.com/item?id=${h.objectID}`,
    }));
}

// ── GitHub ─────────────────────────────────────────────────────────────────
//
// L'API de recherche : les dépôts créés depuis `depuis` qui ont pris le plus
// d'étoiles. Sans jeton, dix appels par minute ; on en fait un. La description
// est celle du propriétaire du dépôt : elle aide à choisir, on ne la recopie
// pas sur le site.

export const githubNouveaux = (depuis, etoilesMin = 300) =>
  `https://api.github.com/search/repositories?q=created:%3E%3D${depuis}+stars:%3E%3D${etoilesMin}&sort=stars&order=desc&per_page=100`;

export function decouperGitHub(json, { max = 15 } = {}) {
  return (json?.items ?? [])
    .filter((r) => parleIA(`${r.full_name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")}`))
    .slice(0, max)
    .map((r) => ({
      source: "GitHub",
      parution: jour(r.created_at),
      rubrique: (r.topics ?? []).slice(0, 3).join(", "),
      titre: r.full_name,
      resume: couper(texte(r.description ?? ""), 300),
      lien: r.html_url,
      sponsor: false,
      indice: `${Number(r.stargazers_count).toLocaleString("fr-FR")} étoiles`,
      origine: "",
    }));
}

// ── Les lettres TLDR ───────────────────────────────────────────────────────
//
// TLDR publie une lettre par domaine. TLDR AI se lit en entier ; les autres
// parlent aussi beaucoup d'IA, mais pas seulement, et la veille ne garde que
// l'IA. Chaque lettre a un fil RSS qui donne les dates des numéros, et une
// page par jour qui donne les sujets : https://tldr.tech/<lettre>/AAAA-MM-JJ,
// rendue côté serveur, au même gabarit pour toutes. Chaque rubrique est une
// <section> dont le nom est dans <header><h3>, chaque sujet un
// <article class="mt-3"> : un lien gras autour d'un <h3>, puis un
// <div class="newsletter-html"> pour le résumé.
//
// Les lettres écartées : marketing, crypto, fintech, design, founders et
// product parlent trop peu d'IA pour des étudiants. Pour en ajouter une, il
// suffit d'une ligne ici ; les mêmes conditions de TLDR s'appliquent à toutes.

export const TLDR = [
  { cle: "ai", nom: "TLDR AI", toutIA: true },
  { cle: "tech", nom: "TLDR" },
  { cle: "dev", nom: "TLDR Dev" },
  { cle: "devops", nom: "TLDR DevOps" },
  { cle: "data", nom: "TLDR Data" },
  { cle: "hardware", nom: "TLDR Hardware" },
  { cle: "infosec", nom: "TLDR InfoSec" },
  { cle: "it", nom: "TLDR IT" },
];
export const tldrFil = (cle) => `https://tldr.tech/api/rss/${cle}`;
export const tldrPage = (cle, date) => `https://tldr.tech/${cle}/${date}`;

/**
 * Un sujet d'une lettre généraliste est gardé s'il parle d'IA dans son titre,
 * ou au moins deux fois dans son résumé. Une seule mention ne suffit pas :
 * « AMD vaut mille milliards » cite l'IA en passant, sans en parler.
 */
const TERMES_IA =
  /\b(AI|IA|LLMs?|GPT|RAG|VLMs?|MLOps|AGI)\b|\b(artificial intelligence|machine[- ]learning|deep[- ]learning|neural|language models?|transformers?|fine-?tun\w*|inference|agentic|agents?|chatbots?|generative|OpenAI|Anthropic|Claude|Gemini|DeepMind|Llama|Mistral|Qwen|DeepSeek|Hugging ?Face|PyTorch|CUDA|embeddings?|multimodal|models?)\b/g;
export function surtoutIA(titre, resume) {
  return parleIA(titre) || (resume.match(TERMES_IA) ?? []).length >= 2;
}

/** Les dates des numéros annoncés par le fil RSS, du plus récent au plus ancien. */
export function decouperFilTldr(xml, cle = "ai") {
  const motif = new RegExp(`<link>https://tldr\\.tech/${cle}/(\\d{4}-\\d{2}-\\d{2})</link>`, "g");
  const jours = [...xml.matchAll(motif)].map((m) => m[1]);
  return [...new Set(jours)].sort().reverse();
}

export function decouperPageTldr(html, parution, lettre = TLDR[0]) {
  const sujets = [];
  for (const section of html.split(/<section\b[^>]*>/).slice(1)) {
    const corps = section.split("</section>")[0];
    const titreRubrique = corps.match(/<header>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<\/header>/);
    const rubrique = titreRubrique ? texte(titreRubrique[1]) : "";
    for (const m of corps.matchAll(
      /<article class="mt-3">\s*<a[^>]*href="([^"]+)"[^>]*>\s*<h3>([\s\S]*?)<\/h3>\s*<\/a>\s*<div class="newsletter-html">([\s\S]*?)<\/div>\s*<\/article>/g,
    )) {
      const lien = nettoyerLien(m[1]);
      // Certains titres sont échappés deux fois : « &amp;lt;1% ».
      let titre = decoder(texte(m[2]));
      let indice = "";
      let sponsor = false;
      const suffixe = titre.match(/\s*\((\d+) minute read\)$|\s*\((GitHub Repo)\)$|\s*\((Sponsor)\)$/i);
      if (suffixe) {
        titre = titre.slice(0, suffixe.index).trim();
        if (suffixe[1]) indice = `${suffixe[1]} min de lecture`;
        if (suffixe[2]) indice = "dépôt GitHub";
        if (suffixe[3]) sponsor = true;
      }
      // TLDR passe aussi ses propres offres d'emploi, sans les marquer.
      if (/ashbyhq\.com\/tldr/i.test(lien) || /\bat TLDR\b/.test(titre)) sponsor = true;
      if (/utm_medium=paid/i.test(decoder(decoder(m[1])))) sponsor = true;
      const resume = texte(m[3]);
      if (!lettre.toutIA && !surtoutIA(titre, resume)) continue;
      sujets.push({
        source: lettre.nom,
        parution,
        rubrique,
        titre,
        resume,
        lien,
        sponsor,
        indice,
        origine: tldrPage(lettre.cle, parution),
      });
    }
  }
  return sujets;
}

// ── Ce qui se lit à la main ────────────────────────────────────────────────
//
// Leurs conditions interdisent la lecture par un programme sans accord écrit.
// La récolte les rappelle en fin de liste ; un sujet lu là s'ajoute à la main.

export const A_LIRE_A_LA_MAIN = [
  { nom: "AlphaSignal", url: "https://alphasignal.ai/archive", pourquoi: "conditions : aucun programme sans leur accord écrit" },
  { nom: "Meta AI", url: "https://ai.meta.com/blog/", pourquoi: "conditions : aucune collecte automatique sans permission" },
  { nom: "Anthropic", url: "https://www.anthropic.com/news", pourquoi: "pas de fil RSS, et les conditions interdisent les robots" },
];
