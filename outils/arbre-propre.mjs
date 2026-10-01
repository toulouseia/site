// Lancé par npm avant `npm run deploy` (script `predeploy`).
//
// Ce qui part en ligne doit être un commit : on le retrouve, on le compare, on
// le remet. Un changement pas encore commité partirait en production sans trace,
// et le prochain `npm run deploy` depuis un autre poste l'effacerait sans que
// personne sache qu'il a existé.
//
// La vérification est bornée au dossier de l'application : la racine du dépôt
// porte en permanence des fichiers d'autres chantiers, qui ne partent pas en
// ligne. `npm run deploy:apercu` n'y passe pas, exprès : un aperçu sert à
// regarder avant de commiter.

import { execFileSync } from "node:child_process";

const sale = execFileSync("git", ["status", "--porcelain", "--", "."], {
  encoding: "utf8",
});

if (sale.trim()) {
  console.error("Mise en ligne refusée : des changements ne sont pas commités.\n");
  console.error(sale);
  console.error("Commiter ou mettre de côté, puis relancer `npm run deploy`.");
  process.exit(1);
}
