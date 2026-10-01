import type { Numero } from "../types";

// Veille nº 01, composé le 2026-09-24 à partir de la récolte 2026-09-24.md.
// Le premier jet de Claude a été réécrit et relu le 29 septembre 2026. Le
// chiffre de SWE-Bench Pro donné par le résumé de TLDR AI a été écarté : il
// citait des modèles plus anciens que le test et venait sans doute de la
// version précédente. Sujets parus du 16 au 24 septembre, numéro daté du jour
// de sa mise en ligne. Après la relecture critique : « Ce que coûte une tâche
// sur Opus 5.5 » (s130) est fondu dans l'entrée d'Opus 5.5, remplacé par
// Mistral et Mozilla (s002) pour ne pas donner trois entrées sur sept à un
// même éditeur.
// Les résumés des sources restent dans la récolte, hors du dépôt : on ne
// recopie pas leur texte ici. Chaque entrée rappelle son numéro de sujet.
// Les commentaires au-dessus de chaque entrée peuvent rester : ils ne
// s'affichent nulle part et gardent la trace de la source.
export const NUMERO_01: Numero = {
  id: "n-01",
  numero: 1,
  date: "2026-09-29",
  uneId: "e-0101",
  entrees: [
    // s001 · OpenAI, Hacker News, TLDR AI · https://news.ycombinator.com/item?id=49805509 · https://tldr.tech/ai/2026-09-23
    // « Introducing GPT-6 Sol and Luna »
    {
      id: "e-0101",
      type: "modele",
      titre: "GPT-6 Sol et Luna",
      valeur: "Deux modèles plus rapides et moins chers qu'Astra, selon OpenAI",
      pourquoi: "Pour un projet étudiant, c'est le coût qui décide. Ces deux modèles promettent les progrès d'Astra, en moins cher.",
      source: "openai.com",
      lien: "https://openai.com/index/introducing-gpt-6-sol-and-luna",
    },
    // s004 · Hacker News, TLDR AI · https://news.ycombinator.com/item?id=49803892 · https://tldr.tech/ai/2026-09-23
    // « Claude Opus 5.5 »
    {
      id: "e-0102",
      type: "modele",
      titre: "Claude Opus 5.5",
      valeur: "Annoncé 40 % moins cher à faire tourner qu'Opus 5",
      pourquoi: "Anthropic le place au niveau de Fable 5.1 sur la plupart des tâches. Sur un agent, le cache et le nombre d'échanges pèsent aussi.",
      source: "anthropic.com · via Hacker News et TLDR AI",
      lien: "https://www.anthropic.com/claude-opus-5-5",
    },
    // s002 · Mistral AI, Hacker News, TLDR AI · https://news.ycombinator.com/item?id=49723408 · https://tldr.tech/ai/2026-09-17
    // « Mistral and Mozilla are bringing open, private and multilingual AI to
    // your web browser »
    {
      id: "e-0108",
      type: "outil",
      titre: "Mistral s'allie à Mozilla",
      valeur: "Mistral fait tourner l'assistant de Firefox, déjà ouvert en France",
      pourquoi: "Un labo français dans un navigateur grand public. Mistral promet de ne rien garder des échanges, ce qu'on ne peut pas vérifier.",
      source: "mistral.ai",
      lien: "https://mistral.ai/news/mistral-x-mozilla/",
    },
    // s127 · TLDR AI · https://tldr.tech/ai/2026-09-23
    // « SWE-Bench Pro V2 »
    {
      id: "e-0103",
      type: "outil",
      titre: "SWE-Bench Pro V2",
      valeur: "642 tâches tirées de 11 dépôts de code",
      pourquoi: "Un score d'agent de code ne vaut que par le test derrière. Cette version retire 89 tâches fausses et en corrige 69.",
      source: "Scale AI · via TLDR AI",
      lien: "https://labs.scale.com/leaderboard/swe_bench_pro_public_v2",
    },
    // s142 · TLDR AI · https://tldr.tech/ai/2026-09-22
    // « Introducing Grok 4.7 »
    {
      id: "e-0105",
      type: "modele",
      titre: "Grok 4.7",
      valeur: "2 $ le million de jetons en entrée, 6 $ en sortie",
      pourquoi: "Un concurrent de plus sur le code. Avec les prix au million de jetons, on peut estimer le coût réel d'un projet.",
      source: "x.ai · via TLDR AI",
      lien: "https://x.ai/news/grok-4-7",
    },
    // s211 · TLDR AI · https://tldr.tech/ai/2026-09-16
    // « Introducing Odyssey-3: A General-Purpose Physical Intelligence »
    {
      id: "e-0107",
      type: "modele",
      titre: "Odyssey-3, un modèle du monde",
      valeur: "Un seul modèle pour robots, véhicules, drones et jeux, annoncé",
      pourquoi: "Les modèles du monde sont une des pistes pour la robotique. Odyssey montre surtout des démos, avec un seul chiffre sur la conduite.",
      source: "odyssey.systems · via TLDR AI",
      lien: "https://odyssey.systems/introducing-odyssey-3",
    },
    // s189 · TLDR AI · https://tldr.tech/ai/2026-09-17
    // « Claude Cowork and chat are now one Claude »
    {
      id: "e-0106",
      type: "outil",
      titre: "Claude : Cowork et le chat fusionnent",
      valeur: "Documents et présentations modifiables, export PowerPoint ou PDF",
      pourquoi: "Les documents et présentations se font maintenant dans la conversation. Pro et Max d'abord, l'offre gratuite ensuite.",
      source: "claude.com · via TLDR AI",
      lien: "https://claude.com/blog/cowork-is-now-claude",
    },
  ],
};
