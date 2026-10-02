import type { Numero } from "../types";

// Veille nº 02, composé le 2026-10-02 à partir de la récolte 2026-10-02.md.
// Le premier jet de Claude a été réécrit à partir des résumés des sources, puis
// relu par une relecture critique. Un sujet sur OpenAI et Hugging Face a été
// écarté : une seule source.
// Les résumés des sources restent dans la récolte, hors du dépôt : on ne
// recopie pas leur texte ici. Chaque entrée rappelle son numéro de sujet.
// Les commentaires au-dessus de chaque entrée peuvent rester : ils ne
// s'affichent nulle part et gardent la trace de la source.
export const NUMERO_02: Numero = {
  id: "n-02",
  numero: 2,
  date: "2026-10-02",
  uneId: "e-0204",
  entrees: [
    // s005 · Hacker News, TLDR AI, TLDR Dev, TLDR InfoSec · https://news.ycombinator.com/item?id=49913571 · https://tldr.tech/ai/2026-10-01 · https://tldr.tech/dev/2026-10-01 · https://tldr.tech/infosec/2026-10-02
    // « Gemini 4 Argon »
    {
      id: "e-0204",
      type: "modele",
      titre: "Gemini 4 Argon",
      valeur: "Jusqu'à 1 million de jetons en sortie, annoncé par Google",
      pourquoi: "Pas encore ouvert aux étudiants : Google le réserve d'abord à des experts en cyberdéfense. Les scores cités sont ceux de Google.",
      source: "blog.google · via Hacker News et TLDR",
      lien: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
    },
    // s001 · OpenAI, Hacker News, TLDR AI, TLDR Dev · https://news.ycombinator.com/item?id=49896586 · https://tldr.tech/ai/2026-09-30 · https://tldr.tech/dev/2026-09-30
    // « Introducing GPT-6.1 Sol »
    {
      id: "e-0201",
      type: "modele",
      titre: "GPT-6.1 Sol",
      valeur: "Près du niveau d'Astra pour un cinquième du prix, selon OpenAI",
      pourquoi: "Un prix divisé par cinq change le budget d'un projet. Le niveau annoncé reste à vérifier sur vos propres tâches.",
      source: "openai.com",
      lien: "https://openai.com/index/introducing-gpt-6-1-sol",
    },
    // s002 · Hacker News, TLDR, TLDR Dev · https://news.ycombinator.com/item?id=49923692 · https://tldr.tech/tech/2026-10-02 · https://tldr.tech/dev/2026-10-02
    // « Clef: Open-weight decision models, and new RL fine-tuning platform »
    {
      id: "e-0202",
      type: "modele",
      titre: "Clef, les modèles ouverts de Cloudflare",
      valeur: "Des décisions typées avec leur probabilité, pour router et classer",
      pourquoi: "Sous licence Apache 2.0, on peut les faire tourner chez soi. Une probabilité se branche plus simplement dans du code qu'un texte libre.",
      source: "blog.cloudflare.com · via Hacker News et TLDR",
      lien: "https://blog.cloudflare.com/clef-decision-models/",
    },
    // s009 · NVIDIA Developer, TLDR Hardware · https://tldr.tech/hardware/2026-09-30
    // « NVIDIA Open Agent Safety Platform: A Reference for Continuous In-Silicon
    // Agent Monitoring »
    {
      id: "e-0205",
      type: "outil",
      titre: "La sécurité des agents selon NVIDIA",
      valeur: "Un agent surveillé depuis une puce à part, sur matériel NVIDIA",
      pourquoi: "Une idée à garder pour vos agents : ce qui surveille ne doit pas tourner là où l'agent peut l'atteindre.",
      source: "developer.nvidia.com",
      lien: "https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/",
    },
    // s043 · Hugging Face Papers · https://huggingface.co/papers/2609.39102
    // « False Frontiers: Diagnosing and Mitigating Co-Cheating in Self-Evolving
    // Search Agents »
    {
      id: "e-0206",
      type: "papier",
      titre: "False Frontiers",
      valeur: "La récompense interne monte, la justesse réelle stagne",
      pourquoi: "Un agent qui fabrique ses propres exercices peut apprendre à tricher avec lui-même. À lire avant d'en construire un.",
      source: "arxiv.org · via Hugging Face Papers",
      lien: "https://arxiv.org/abs/2609.39102",
    },
    // s102 · Inria
    // « France 2030 | Lancement du programme Évaluation de l’IA : une feuille de
    // route scientifique pour l’évaluation et la sécurité de l’intelligence
    // artificielle »
    {
      id: "e-0207",
      type: "chiffre",
      titre: "La France finance l'évaluation de l'IA",
      valeur: "13,5 millions d'euros pour un programme de recherche porté par Inria",
      pourquoi: "L'État finance la recherche sur l'évaluation et la sécurité des modèles. C'est une piste pour un stage ou une thèse.",
      source: "inria.fr",
      lien: "https://www.inria.fr/fr/france-2030-lancement-programme-evaluation-de-ia",
    },
    // s004 · Google DeepMind, TLDR AI · https://tldr.tech/ai/2026-10-01
    // « Introducing SynthID Bio »
    {
      id: "e-0203",
      type: "outil",
      titre: "SynthID Bio",
      valeur: "Un filigrane dans les protéines conçues par IA, fonction intacte selon DeepMind",
      pourquoi: "Seules les protéines marquées dès leur conception se repèrent. Le code et les poids sont ouverts aux chercheurs.",
      source: "deepmind.google",
      lien: "https://deepmind.google/blog/introducing-synthid-bio/",
    },
  ],
};
