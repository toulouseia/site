# Mettre en ligne

**Prérequis** : Node 22 ou plus récent, `npm install`, puis `npx wrangler login`
sur le compte de l'association (contact@toulouseia.fr). La connexion expire en
quelques minutes : cliquer « Authorize » tout de suite.

```bash
npm run deploy:apercu   # une version d'essai, sans toucher à la production
npm run deploy          # la production, https://toulouseia.fr et www
```

`npm run deploy` refuse de partir si `app/application/` a des changements non
commités (`outils/arbre-propre.mjs`) : ce qui est en ligne est toujours un commit.

**En cas d'échec** : le message de `arbre-propre.mjs`, puis la sortie de
`next build` (une page qui ne se fabrique pas), puis celle de `wrangler`
(connexion, compte, fichiers). `Zone Allocation failed` pendant le build : la
machine manque de mémoire, pas le code. En ligne : `npx wrangler tail` pour les
erreurs de `worker/`, `npx wrangler rollback` pour revenir à la version
précédente. La procédure complète est dans `docs/PROCEDURE-J0.md`.
