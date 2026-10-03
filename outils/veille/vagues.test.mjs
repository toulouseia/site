import { test } from "node:test";
import assert from "node:assert/strict";
import {
  commandeDe,
  corpsDuTicket,
  dateDuTicket,
  masquer,
  moment,
  sectionsDe,
  suiteDuTicket,
  ticketDeLaFusion,
  titresDuNumero,
} from "./vagues.mjs";
import { cochesDe } from "./composer.mjs";

const RECOLTE = [
  "# Récolte de la veille · 2026-10-05",
  "",
  "```",
  "node outils/veille/composer.mjs recoltes/2026-10-05.md",
  "```",
  "",
  "## Repris par plusieurs sources",
  "",
  "- [ ] s001 · **Un modèle** · exemple.org",
  "  OpenAI 04/10, TLDR AI 05/10",
  "  https://exemple.org/modele",
  "  > Un résumé.",
  "",
  "- [ ] s002 · **Un outil** · github.com",
  "  GitHub 04/10",
  "  https://github.com/org/outil",
  "",
  "## Les labos, à la source",
  "",
  "- [ ] s003 · **Un billet** · exemple.org",
  "  Mistral AI 03/10",
  "  https://exemple.org/billet",
  "",
  "## À lire à la main",
  "",
  "```",
  "- [x] https://adresse-de-l-article",
  "```",
  "",
  "- AlphaSignal : https://alphasignal.ai/archive (à lire à la main)",
  "",
].join("\n");

test("Les sections de la récolte, avec leurs sujets et la liste à lire à la main", () => {
  const s = sectionsDe(RECOLTE);
  assert.deepEqual(s.map((x) => [x.titre, x.blocs.length, x.liste.length]), [
    ["Repris par plusieurs sources", 2, 0],
    ["Les labos, à la source", 1, 0],
    ["À lire à la main", 0, 1],
  ]);
  assert.match(s[0].blocs[0], /> Un résumé\.$/);
});

test("Le ticket garde les premiers sujets et renvoie le reste à /tout", () => {
  const { corps, restantes } = corpsDuTicket(RECOLTE, { date: "2026-10-05", max: 2 });
  assert.match(corps, /s001/);
  assert.match(corps, /s002/);
  assert.doesNotMatch(corps, /s003/);
  assert.match(corps, /AlphaSignal/);
  assert.match(corps, /1 autres sujets attendent/);
  assert.deepEqual(cochesDe(corps), []);
  const suites = suiteDuTicket(restantes);
  assert.equal(suites.length, 1);
  assert.match(suites[0], /## Les labos, à la source[\s\S]*s003/);
});

test("Les cases cochées dans le ticket et ses commentaires", () => {
  const { corps } = corpsDuTicket(RECOLTE, { date: "2026-10-05", max: 3 });
  const coche = corps.replace("- [ ] s002", "- [x] s002");
  const commentaire = "J'ajoute celui-ci :\n- [x] https://exemple.org/lu-dans-alphasignal";
  assert.deepEqual(cochesDe(`${coche}\n\n${commentaire}`), ["s002", "https://exemple.org/lu-dans-alphasignal"]);
});

test("Le ticket coupé en commentaires quand la suite est longue", () => {
  const blocs = Array.from({ length: 5 }, (_, i) => `- [ ] s00${i} · **Sujet ${i}**\n  ${"x".repeat(40)}`);
  const suites = suiteDuTicket([{ titre: "Section", blocs, liste: [] }], 120);
  assert.ok(suites.length > 1);
  assert.ok(suites.every((s) => s.includes("## Section")));
});

test("Les commandes : seules sur leur ligne", () => {
  assert.equal(commandeDe("C'est bon pour moi.\n/publier"), "/publier");
  assert.equal(commandeDe("/publier"), "/publier");
  assert.equal(commandeDe("  /TOUT \n merci"), "/tout");
  assert.equal(commandeDe("on peut /publier ?"), null);
  assert.equal(commandeDe("/publier maintenant"), null);
  assert.equal(commandeDe(null), null);
});

test("Le jour et l'heure de la vague, à l'heure de Paris", () => {
  const reglage = { jours: ["lundi", "jeudi"], heure: 8 };
  assert.deepEqual(moment(new Date("2026-10-05T06:30:00Z"), reglage), { jour: "2026-10-05", prevu: true });
  assert.equal(moment(new Date("2026-10-05T05:30:00Z"), reglage).prevu, false);
  assert.equal(moment(new Date("2026-10-06T07:00:00Z"), reglage).prevu, false);
});

test("Lire un titre de ticket, une demande de fusion, un numéro", () => {
  assert.equal(dateDuTicket("Vague du 2026-10-05"), "2026-10-05");
  assert.equal(dateDuTicket("Vague du 5 octobre"), null);
  assert.equal(ticketDeLaFusion("Vague #42, 6 entrées, nº 03."), 42);
  assert.equal(ticketDeLaFusion("rien"), null);
  const ts = '  entrees: [\n    {\n      id: "e-0301",\n      titre: "Gemini 4 \\"Argon\\"",\n    },\n  ],';
  assert.deepEqual(titresDuNumero(ts), ['Gemini 4 "Argon"']);
});

test("Les messages publics ne montrent pas les chemins du serveur", () => {
  const m = masquer(`ENOENT: ${new URL("../../recoltes/x.md", import.meta.url).pathname}`);
  assert.doesNotMatch(m, /\/home\//);
  assert.match(m, /recoltes\/x\.md/);
});
