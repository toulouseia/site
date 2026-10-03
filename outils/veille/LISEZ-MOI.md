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

## Ce qu'on garde, ce qu'on écarte

On garde les faits. Un nouvel outil, un dépôt GitHub qui sert vraiment, un
modèle sorti, un billet qui explique en détail comment une chose marche, un
papier dont l'apport peut se dire à quelqu'un qui n'est pas spécialiste.

On écarte les annonces vides, les textes qui font peur, les avis qui ne mènent
nulle part et la spéculation sur l'avenir.

La récolte aide à trier. Dans chaque section, les sujets concrets passent en
tête : un lancement, une version, un guide, un dépôt GitHub, un modèle sur
Hugging Face. Elle range en fin de section et marque d'un « avis ou
spéculation ? » les titres en forme de question ou qui parlent d'avenir, de
peur ou de bulle. Elle marque d'un « vitrine commerciale ? » les témoignages
de clients d'un éditeur. Ce ne sont que des indices tirés du titre : c'est la
personne qui coche qui décide. Le premier jet de Claude suit la même règle.

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

## Publier depuis GitHub

Les vagues manuelles se font sans terminal, dans un navigateur.

1. Les jours prévus dans `reglages.json`, un serveur récolte les sources et
   ouvre un ticket « Vague du AAAA-MM-JJ », avec l'étiquette `vague-veille`.
   Le ticket liste les sujets les mieux classés, avec des cases à cocher.
2. Un curateur coche les sujets à garder, directement dans le ticket. Le
   premier coché fait la une. Un sujet lu ailleurs s'ajoute dans un
   commentaire, sur une ligne `- [x] https://adresse-de-l-article`.
3. Il écrit `/publier` en commentaire, seul sur sa ligne. Le serveur passe
   toutes les cinq minutes. Il répond par une fusée sous le commentaire quand
   la commande est faite.
4. Le serveur rédige un premier jet avec Claude et ouvre une demande de
   fusion. Elle donne la liste des entrées, le résultat de la vérification et,
   quand c'est possible, l'adresse d'un aperçu que les visiteurs ne voient pas.
5. Le curateur relit et corrige chaque ligne dans l'onglet « Files changed »,
   puis fusionne. Le serveur met le site en ligne, le dit dans la demande et
   ferme le ticket.

Les autres commandes : `/tout` ajoute en commentaire les sujets qui ne tiennent
pas dans le ticket, `/abandon` ferme le ticket sans rien produire. Le serveur
n'écoute que les comptes listés dans `curateurs`.

Sous une commande, des yeux veulent dire que le serveur s'en occupe, une fusée
qu'il a fini, une mine perplexe qu'il a échoué et pourquoi. Si les yeux restent
plus d'une demi-heure, le serveur s'est arrêté en route : écrivez la commande
dans un nouveau commentaire. Une seule vague attend sa fusion à la fois : tant
qu'une demande de fusion de vague est ouverte, `/publier` refuse les autres et
dit laquelle fusionner ou fermer.

Tout se règle dans `reglages.json`, sur `main` :

| réglage | effet |
|---|---|
| `curateurs` | les comptes GitHub dont le serveur suit les commandes |
| `vagues_manuelles.actif` | `false` arrête l'ouverture des tickets |
| `vagues_manuelles.jours`, `heure` | quand le ticket s'ouvre, à l'heure de Paris, pas avant 2 h |
| `vagues_manuelles.sujets_dans_le_ticket` | combien de sujets le ticket montre d'emblée |
| `apercu` | `false` : pas d'aperçu dans la demande de fusion |
| `deployer_apres_fusion` | `false` : après une fusion, la mise en ligne se fait à la main |

La mise en ligne après fusion passe par la même garde que la mise en ligne à
la main : si d'autres pages que la veille changent, rien ne part, et le
serveur le dit dans la demande. Installer le serveur est décrit dans
`serveur/INSTALLER.md`. Les vagues automatiques sont décrites dans
`SPEC-PUBLICATION.md` et ne sont pas construites.

## Politesse

Le script envoie une requête à la fois, fait une courte pause entre deux, et se
présente avec un nom d'agent qui donne l'adresse du club. Les numéros de TLDR
déjà téléchargés restent dans `recoltes/cache/`. Une récolte par semaine suffit.
