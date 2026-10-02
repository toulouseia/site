# La veille, des sources au site

La veille du site est écrite par le club. Les sources servent de matière
première : on y repère ce qui est sorti, on choisit, et on écrit nos propres
lignes. On ne recopie pas leurs textes.

Un numéro est un fichier du dépôt, `src/donnees/numeros/numero-NN.ts`. Il n'y a
ni base de données ni écran d'administration, comme décidé le 15 septembre 2026.
La décision est écrite dans `docs/DECISION-ARCHITECTURE-SERVEUR.md` de l'ancien
dépôt, `toulouseia/toulouseia`.

## Écrire un numéro, en quatre commandes

Toutes se lancent depuis la racine du dépôt.

**1. Récolter.** Le script lit les sources des sept derniers jours et écarte
les encarts payés.

```bash
npm run veille:recolter                  # les 7 derniers jours
npm run veille:recolter -- --jours 14
npm run veille:recolter -- --depuis 2026-09-15
```

Il écrit `recoltes/AAAA-MM-JJ.md`, une liste à cocher. Ce dossier reste hors du
dépôt. Les sujets repris par plusieurs sources sont en tête de liste. Viennent
ensuite les labos, la recherche, ce que la communauté fait monter, la France et
l'Europe, puis les lettres TLDR.

**2. Choisir.** Ouvrez la liste et remplacez `- [ ]` par `- [x]` devant chaque
sujet à garder. Le premier sujet coché fait la une. Cinq à huit sujets suffisent,
et l'affiche « Sommaire » n'en montre que cinq.

Un sujet lu dans une source qu'on ne récolte pas s'ajoute dans la dernière
section, avec l'adresse de l'article d'origine :

```
- [x] https://adresse-de-l-article
```

**3. Composer.**

```bash
npm run veille:composer -- recoltes/2026-09-24.md
npm run veille:composer -- recoltes/2026-09-24.md --rediger
```

Le script crée le numéro suivant en brouillon. Au-dessus de chaque entrée, un
commentaire rappelle le titre d'origine, les sources et le numéro du sujet dans
la récolte. Le résumé de la source reste dans la récolte : on ne recopie pas le
texte d'une source dans le dépôt.

Sans option, les champs à écrire contiennent `À ÉCRIRE`. Avec `--rediger`,
Claude propose un premier jet en français. Il faut que la commande `claude`,
celle de Claude Code, soit installée et connectée. Claude ne connaît que le
résumé : il laisse `À ÉCRIRE` quand le résumé ne suffit pas. Pour Inria et
ANITI, qui n'accordent aucune licence de réutilisation, seul le titre lui est
envoyé. Il faut relire chaque ligne, et surtout la ligne « pourquoi », qui dit
ce que le club en pense.

**4. Relire, puis publier.** Lancez `npm run dev` et ouvrez `/veille` : un
brouillon s'y affiche. Corrigez le fichier du numéro, rangez les entrées dans
l'ordre voulu et changez `uneId` si besoin. Quand tout est bon, retirez la ligne
`brouillon: true`, puis lancez :

```bash
npm run veille:verifier
```

La vérification refuse un numéro publié qui contient encore `À ÉCRIRE`. Elle
refuse aussi un identifiant en double, un type inconnu et un lien qui garde des
marqueurs de suivi. Elle prévient quand une ligne est trop longue pour
l'affiche. Ensuite, on committe et on met en ligne comme d'habitude.

## Les champs d'une entrée

| champ | ce qu'on y écrit |
|---|---|
| `type` | `modele`, `outil`, `papier`, `usage` ou `chiffre`. Le script le devine d'après l'adresse, à vérifier |
| `titre` | le nom de la chose, court |
| `valeur` | la valeur brute : un chiffre, une capacité, un nom |
| `pourquoi` | une ligne : pourquoi c'est dans le numéro |
| `source` | déjà rempli : l'éditeur, et le relais qui nous l'a montré, par exemple `x.ai · via TLDR AI` |
| `lien` | l'adresse de la source elle-même, sans les marqueurs de suivi |

Un chiffre annoncé par une entreprise reste une annonce. On écrit « annoncé »
tant que personne ne l'a mesuré.

## Les sources

Chaque source a été retenue après lecture de ses conditions d'utilisation et
de son robots.txt, le 23 septembre 2026. Ce n'est pas un avis juridique. Le
détail, avec les passages cités et le verdict pour chaque usage, est dans
`SOURCES.md`.

| source | comment on la lit | ce qu'il faut respecter |
|---|---|---|
| OpenAI | fil RSS `openai.com/news/rss.xml` | jamais les pages du site, seulement le fil |
| Google DeepMind | fil RSS | pas de logo |
| Mistral AI | fil RSS | |
| NVIDIA, NVIDIA Developer | fils RSS et Atom | le jeu vidéo est écarté |
| Hugging Face Papers | API des papiers du jour, les plus votés | le lien va vers la page arXiv du papier |
| Hugging Face | API des modèles en tendance | |
| Hacker News | API de recherche d'Algolia | jamais les pages du site ; titres et liens seulement, pas les commentaires |
| GitHub | API de recherche | la description d'un dépôt est à son auteur : on écrit la nôtre |
| CNIL | fil RSS, trié sur l'IA | textes en CC BY-ND : une citation porte « Source : CNIL », l'adresse, la date et la licence |
| Commission européenne | fil RSS, trié sur l'IA | CC BY 4.0 : créditer « Union européenne » avec l'adresse |
| Inria, ANITI | fils RSS | aucune licence : nos mots et un lien, pas de titre recopié mot pour mot |
| TLDR AI | fil RSS et page du jour | nos mots et un lien vers l'article d'origine |
| TLDR, Dev, DevOps, Data, Hardware, InfoSec, IT | fil RSS et page du jour | les sujets d'IA seulement : l'IA dans le titre, ou deux fois dans le résumé |

Trois sources se lisent à la main, et la récolte les rappelle en fin de liste :

- **AlphaSignal** interdit dans ses conditions tout programme sans accord écrit,
  et son robots.txt ferme son API. Tant qu'ils n'ont pas donné leur accord par
  écrit, on la lit comme un abonné.
- **Meta AI** interdit la collecte automatique sans permission.
- **Anthropic** n'a pas de fil RSS, et ses conditions interdisent les robots.

Pour toutes les sources, trois règles :

- On écrit avec nos mots et on met un lien vers l'article d'origine.
- On ne met ni logo, ni image, ni capture d'une source sur les affiches.
- On nomme les entreprises sans laisser croire à un partenariat.

## Si une source change de format

Les découpages sont dans `sources.mjs`, essayés sur les exemples de `essais/`.
Si la récolte affiche un échec ou « aucun sujet reconnu », suivez ces étapes :

1. Reproduisez le nouveau format dans un exemple de `essais/`.
2. Ajoutez un essai dans `sources.test.mjs`.
3. Réparez `sources.mjs` jusqu'à ce que `npm run veille:essais` passe.

Les exemples sont tous écrits à la main : aucun texte d'une source n'y est
recopié, et le dépôt est public. Celui de TLDR AI reprend le gabarit exact de
la page, balise pour balise, avec un contenu inventé. Un nouvel exemple se fait
de la même façon, jamais en enregistrant une vraie page.

## Publier sans terminal

Un projet pour publier depuis GitHub, sans Claude Code ni terminal, avec des
vagues automatiques, est décrit dans `SPEC-PUBLICATION.md`. C'est une
proposition : rien n'en est encore construit.

## Politesse

Le script envoie une requête à la fois, fait une courte pause entre deux, et se
présente avec un nom d'agent qui donne l'adresse du club. Les numéros de TLDR
déjà téléchargés restent dans `recoltes/cache/`. Une récolte par semaine suffit.
