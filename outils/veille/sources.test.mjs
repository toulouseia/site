// Les découpages des sources, essayés sur les exemples de `essais/`. Si une
// source change de format, c'est ici que ça casse en premier : reproduire le
// nouveau format dans `essais/`, ajouter un essai, réparer `sources.mjs`.
//
// Les exemples sont tous écrits à la main sur le modèle des vrais : aucun
// texte d'une source n'est recopié dans le dépôt, qui est public. La page de
// TLDR AI reprend le gabarit exact de tldr.tech, balise pour balise, parce que
// son découpage en dépend.
//
//   npm run veille:essais

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FILS,
  cleDeLien,
  decouperFil,
  decouperFilTldr,
  decouperGitHub,
  decouperHN,
  decouperModelesHF,
  decouperPageTldr,
  decouperPapiersHF,
  nettoyerLien,
  parleIA,
  sujetsDuFil,
  surtoutIA,
} from "./sources.mjs";
import { cochesDe, devinerType, ligneSource } from "./composer.mjs";

const lire = (f) => readFileSync(new URL(`./essais/${f}`, import.meta.url), "utf8");
const json = (f) => JSON.parse(lire(f));

test("Fil RSS : CDATA, HTML échappé, catégories, liens sans marqueurs", () => {
  const [e] = decouperFil(lire("fil-rss.xml"));
  assert.equal(e.titre, "Un modèle de langage plus sobre");
  assert.equal(e.lien, "https://exemple.org/modele-sobre");
  assert.equal(e.parution, "2026-09-20");
  assert.deepEqual(e.categories, ["Recherche", "Produit"]);
  assert.match(e.resume, /Un résumé avec & une esperluette/);
  assert.doesNotMatch(e.resume, /<|&lt;/);
});

test("Fil RSS : la période et le tri des sources généralistes", () => {
  const cnil = FILS.find((f) => f.nom === "CNIL");
  const sujets = sujetsDuFil(cnil, lire("fil-rss.xml"), "2026-09-16", "2026-09-24");
  // La fête ne parle pas d'IA, le vieux billet est hors période.
  assert.deepEqual(
    sujets.map((s) => s.titre),
    ["Un modèle de langage plus sobre"],
  );
  assert.equal(sujets[0].source, "CNIL");
});

test("Fil Atom : lien alternate, date de publication, catégories en attribut", () => {
  const [e] = decouperFil(lire("fil-atom.xml"));
  assert.equal(e.titre, "Faire tourner un agent sur une seule carte");
  assert.equal(e.lien, "https://exemple.org/blog/agent-une-carte/");
  assert.equal(e.parution, "2026-09-22");
  assert.deepEqual(e.categories, ["Agentic AI / Generative AI"]);
  assert.equal(e.resume, "Un résumé en HTML dans du CDATA…");
});

test("Fil en minuscules à la façon d'ANITI, avec une entrée sans date", () => {
  const entrees = decouperFil(lire("fil-minuscules.xml"));
  assert.equal(entrees[0].lien, "https://exemple.org/2026/09/10/replay/");
  assert.equal(entrees[0].parution, "2026-09-10");
  assert.equal(entrees[1].parution, "");
  const aniti = FILS.find((f) => f.nom === "ANITI");
  const sujets = sujetsDuFil(aniti, lire("fil-minuscules.xml"), "2026-09-16", "2026-09-24");
  // La séance du 10 est hors période ; l'entrée sans date prend le jour de la récolte.
  assert.deepEqual(
    sujets.map((s) => [s.titre, s.parution]),
    [["Une entrée sans date", "2026-09-24"]],
  );
});

test("Hugging Face : les papiers les plus votés, avec le lien arXiv", () => {
  const sujets = decouperPapiersHF(json("hf-papiers.json"));
  assert.deepEqual(
    sujets.map((s) => s.lien),
    ["https://arxiv.org/abs/2609.00001", "https://arxiv.org/abs/2609.00002"],
  );
  assert.equal(sujets[0].indice, "201 votes HF");
  assert.equal(sujets[0].parution, "2026-09-22");
  assert.equal(sujets[0].origine, "https://huggingface.co/papers/2609.00001");
  assert.equal(decouperPapiersHF(json("hf-papiers.json"), { parJour: 1 }).length, 1);
});

test("Hugging Face : seulement les modèles publiés dans la période", () => {
  const sujets = decouperModelesHF(json("hf-modeles.json"), "2026-09-16");
  assert.deepEqual(
    sujets.map((s) => s.titre),
    ["org/nouveau-modele"],
  );
  assert.equal(sujets[0].lien, "https://huggingface.co/org/nouveau-modele");
});

test("Hacker News : les histoires d'IA avec un lien, par points", () => {
  const sujets = decouperHN(json("hn.json"));
  assert.deepEqual(
    sujets.map((s) => s.lien),
    ["https://exemple.org/nouveau-modele", "https://exemple.org/llm-portable"],
  );
  assert.equal(sujets[1].indice, "412 points HN");
  assert.equal(sujets[1].origine, "https://news.ycombinator.com/item?id=1");
});

test("GitHub : les dépôts d'IA, sans les autres", () => {
  const sujets = decouperGitHub(json("github.json"));
  assert.deepEqual(
    sujets.map((s) => s.titre),
    ["org/agent", "org/nano"],
  );
  assert.equal(sujets[0].lien, "https://github.com/org/agent");
});

test("TLDR AI : les sujets d'un numéro, sans les encarts payés", () => {
  const sujets = decouperPageTldr(lire("tldr-ai-exemple.html"), "2026-09-22");
  assert.equal(sujets.length, 10);
  const payes = sujets.filter((s) => s.sponsor);
  // Deux « (Sponsor) », dont un aux liens échappés deux fois, et une offre
  // d'emploi de TLDR elle-même, qui n'est pas marquée.
  assert.equal(payes.length, 3);
  assert.ok(payes.some((s) => s.titre.includes("at TLDR")));
  const modele = sujets.find((s) => s.titre === "Un modèle de langage ouvert de 7 milliards de paramètres");
  assert.equal(modele.lien, "https://exemple.org/modele-ouvert/");
  assert.equal(modele.rubrique, "Headlines & Launches");
  assert.equal(modele.indice, "3 min de lecture");
  assert.equal(modele.origine, "https://tldr.tech/ai/2026-09-22");
  assert.match(modele.resume, /^Un laboratoire publie un modèle de langage ouvert\. Le modèle tient/);
  assert.equal(sujets.find((s) => s.lien.includes("outil-agent")).indice, "dépôt GitHub");
  // Un titre échappé deux fois se lit quand même.
  assert.ok(sujets.some((s) => s.titre === "Un routage de modèles à <1% de surcoût"));
  assert.ok(sujets.every((s) => !/utm_/.test(s.lien)));
  assert.ok(sujets.every((s) => !/\(\d+ minute read\)|\(Sponsor\)|\(GitHub Repo\)/.test(s.titre)));
});

test("Les autres lettres TLDR : seulement ce qui parle vraiment d'IA", () => {
  assert.ok(surtoutIA("Better prompt caching for GPT-6", ""));
  assert.ok(surtoutIA("Model Optimizer", "A library to quantize models and speed up inference on GPUs."));
  // Une seule mention en passant ne suffit pas.
  assert.ok(!surtoutIA("AMD Becomes the Fourth US Chipmaker to Reach a $1 Trillion Valuation", "Demand for AI chips pushed the stock up."));
  const tout = decouperPageTldr(lire("tldr-ai-exemple.html"), "2026-09-22");
  const dev = decouperPageTldr(lire("tldr-ai-exemple.html"), "2026-09-22", { cle: "dev", nom: "TLDR Dev" });
  assert.ok(dev.length > 0 && dev.length < tout.length);
  assert.ok(!dev.some((s) => s.titre.startsWith("Le prix de l'électricité")));
  assert.ok(!dev.some((s) => s.titre.startsWith("Une base de données")));
  assert.ok(dev.every((s) => s.source === "TLDR Dev" && s.origine === "https://tldr.tech/dev/2026-09-22"));
});

test("TLDR AI : le fil donne les dates des numéros", () => {
  const jours = decouperFilTldr(lire("tldr-ai-fil-exemple.xml"));
  assert.deepEqual(jours, ["2026-09-22", "2026-09-21", "2026-09-18"]);
});

test("Les liens perdent leurs marqueurs et se reconnaissent d'une source à l'autre", () => {
  assert.equal(nettoyerLien("https://x.ai/news/grok-4-7?utm_source=a&amp;utm_campaign=b&amp;lid=c"), "https://x.ai/news/grok-4-7");
  assert.equal(nettoyerLien("https://www.youtube.com/watch?v=abc&amp;utm_source=x"), "https://www.youtube.com/watch?v=abc");
  assert.equal(cleDeLien("https://www.github.com/google/ax/"), cleDeLien("https://github.com/google/ax"));
  assert.equal(cleDeLien("https://twitter.com/a/status/1"), cleDeLien("https://x.com/a/status/1"));
  assert.equal(cleDeLien("https://arxiv.org/pdf/2609.21032v2"), cleDeLien("https://arxiv.org/abs/2609.21032"));
});

test("Reconnaître un sujet d'IA", () => {
  assert.ok(parleIA("Show HN: An open LLM that runs on a laptop"));
  assert.ok(parleIA("Lignes directrices sur l'intelligence artificielle"));
  assert.ok(parleIA("org/nano deep-learning"));
  assert.ok(!parleIA("Italian parliament votes for return to nuclear energy"));
  // « ia » au milieu d'un mot ou d'une phrase ne compte pas.
  assert.ok(!parleIA("Via Italia, la fête de la musique"));
});

test("Le type d'entrée se devine de l'adresse", () => {
  assert.equal(devinerType({ lien: "https://arxiv.org/abs/2609.21032", rubrique: "Papiers du jour" }), "papier");
  assert.equal(devinerType({ lien: "https://github.com/google/ax", rubrique: "" }), "outil");
  assert.equal(devinerType({ lien: "https://huggingface.co/Qwen/x", rubrique: "" }), "modele");
  assert.equal(devinerType({ lien: "https://x.ai/news/grok-4-7", rubrique: "Headlines & Launches" }), "usage");
});

test("Les cases cochées : numéros de la récolte et adresses ajoutées à la main", () => {
  const md = [
    "- [x] s004 · **Un sujet** · exemple.org",
    "- [ ] s005 · **Pas coché**",
    "- [X] https://exemple.org/lu-a-la-main",
    "- AlphaSignal : https://alphasignal.ai/archive (à lire à la main)",
    "```",
    "- [x] https://adresse-de-l-article",
    "```",
  ].join("\n");
  assert.deepEqual(cochesDe(md), ["s004", "https://exemple.org/lu-a-la-main"]);
});

test("La ligne source : « via » seulement quand on ne l'a pas lu à la source", () => {
  const lien = "https://openai.com/index/un-modele";
  assert.equal(ligneSource({ lien, reprises: [{ source: "OpenAI" }, { source: "TLDR AI" }] }), "openai.com");
  assert.equal(ligneSource({ lien, reprises: [{ source: "TLDR AI" }] }), "openai.com · via TLDR AI");
  assert.equal(
    ligneSource({ lien, reprises: [{ source: "TLDR AI" }, { source: "Hacker News" }] }),
    "openai.com · via TLDR AI et Hacker News",
  );
  assert.equal(ligneSource({ lien, reprises: [{ source: "à la main" }] }), "openai.com");
  assert.equal(ligneSource({ lien, reprises: [{ source: "TLDR DevOps" }] }), "openai.com · via TLDR DevOps");
});
