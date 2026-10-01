# Les identifiants du chapitre 4, et ce qu'ils sont devenus

Le chapitre 4 déclarait **28 animations** réparties sur douze fichiers. Aucune
n'était rendue, aucune n'était bâtie sur `animations/scenes/reseau_mob.py`, et
toutes héritaient directement de `SceneN7` : chacune redessinait son propre
objet. Une bonne moitié redessinait une **métaphore** — un engrenage, une urne,
un thermomètre, un plateau de balance, un tampon, un robinet, une corde, un
pochoir, un bras de levier ; les autres mettaient en scène des **comptes** que
rien ne fait bouger, ou des **phrases** posées en liste.

Ce fichier dit, pour les 28, ce qu'elles sont devenues. Il est la table de
correspondance qu'un lecteur des pages doit pouvoir consulter quand un
`animationId` ne répond plus.

**Le critère, et il n'en a pas d'autre :** une animation est gardée si elle
montre **un objet de ce chapitre en train de faire quelque chose** — le réseau,
le signal d'erreur, un vecteur par ses composantes. Elle est jetée si elle montre
une *image de* cet objet — un engrenage n'est pas une dérivée partielle, une urne
n'est pas une somme — ou si elle n'a rien à montrer bouger : un nombre comme
203 540 est un compte, il se lit sur la page.

**Les huit gardées sont refaites**, aucune n'est conservée en l'état : toutes
passent sur le réseau de `reseau_mob.py`, et tous leurs nombres sortent de
`cours/lecon4/mesures.py`.

---

## Les huit qui restent

| # | `animationId` | Classe | Fichier | Page | L'objet qu'elle montre |
|---|---|---|---|---|---|
| 1 | `limage-cinq-traverse-le-reseau` | `LImageCinqTraverseLeReseau` | `reclame.py` | 3 | L'image n° 5, de classe 2, traverse le réseau non entraîné ; les dix sorties s'allument à leur valeur mesurée. |
| 2 | `ce-que-la-sortie-reclame` | `CeQueLaSortieReclame` | `reclame.py` | 3 | δ² en dix barres signées, neuf vers le haut, une vers le bas, à l'échelle mesurée. |
| 3 | `le-biais-ne-passe-par-rien` | `LeBiaisNePasseParRien` | `biais.py` | 4 | Le biais du neurone de sortie 2 est poussé, et la sortie suit — de la même quantité, sans facteur. |
| 4 | `proportionnel-a-lactivation` | `ProportionnelALactivation` | `poids.py` | 5 | Les traits vers le neurone de sortie 2 s'épaississent en proportion de l'activation d'où ils partent. |
| 5 | `dix-demandes-sur-un-meme-neurone` | `DixDemandesSurUnMemeNeurone` | `somme.py` | 8 | La transposée : dix demandes convergent sur le neurone caché 92 et s'additionnent. |
| 6 | `la-porte-relu-ne-laisse-rien-passer` | `LaPorteReluNeLaisseRienPasser` | `remonter.py` | 9 | La porte ReLU sur les 128 composantes : elle laisse passer 57 barres et en coupe 71. |
| 7 | `londe-revient-de-la-sortie` | `LOndeRevientDeLaSortie` | `synthese.py` | 12 | La vague remonte de la sortie vers l'entrée, couche après couche. |
| 8 | `necouter-quun-seul` | `NecouterQuUnSeul` | `un_exemple.py` | 10 | Le réseau entraîné 200 pas sur la seule image n° 5 : il classe les dix mille images de test en 2. |

Les huit identifiants sont **inchangés** : ce sont ceux que les pages
référencent déjà. Aucun lien ne se casse pour ces huit-là.

---

## Les vingt qui sont jetées

**Les vingt sont référencées par une page.** Les 28 déclarations avaient toutes
leur bloc ; aucune n'était orpheline. La colonne « Page » dit lequel.

| `animationId` | Fichier d'origine | Page | Pourquoi elle est jetée |
|---|---|---|---|
| `le-signe-se-lit-sur-le-poids` | `activations.py` | 7 | Quatre thermomètres. Le signe d'un poids n'est pas une colonne de mercure ; et la scène 4, sur le réseau, montre le même fait sur l'objet. |
| `une-activation-nest-pas-un-bouton` | `activations.py` | 7 | Un doigt sur une membrane. Métaphore, et elle montre précisément le mouvement que la source se fait reprocher : une activation qu'on pousse. |
| `le-signal-remonte-le-courant` | `activations.py` | 7 | Un courant qu'on remonte. La scène 7 le fait sur le réseau, et c'est le même fait. |
| `laller-puis-le-retour` | `algorithme.py` | 11 | Une chute puis un relèvement. Recouverte par la scène 7. |
| `lecart-aux-differences-finies` | `algorithme.py` | 11 | Un fil qui se tend. La mesure 2 est un tableau d'écarts relatifs : elle se lit, elle ne s'anime pas. |
| `un-seul-passage-au-lieu-de-cent-mille` | `algorithme.py` | 11 | Un bras de levier. 203 540 est un compte, pas un mouvement. |
| `les-trois-voies-vers-une-somme-ponderee` | `biais.py` | 4 | Trois engrenages attaquant une roue. Métaphore mécanique ; la scène 3 garde la voie du biais, mesurée, sur le réseau. |
| `le-relais-des-douze-pages` | `cadre.py` | 1 | Un plan de chapitre passé de main en main. Ce n'est pas un objet du chapitre, c'est sa table des matières. |
| `une-dette-reglee-deux-contractees` | `cadre.py` | 1 | Une dette : métaphore comptable. |
| `cent-un-mille-propagations-contre-une` | `cherche.py` | 2 | Un compte. Voir `un-seul-passage-au-lieu-de-cent-mille`. |
| `le-gradient-ne-se-lit-pas-dun-coup` | `cherche.py` | 2 | 101 770 composantes signées, que rien ne peut montrer à l'écran sans mentir sur leur nombre. |
| `les-liaisons-qui-se-renforcent` | `hebb.py` | 6 | La mesure 6 est un classement de dix couples. Un tableau, pas une animation. |
| `letiquette-est-un-pochoir` | `hebb.py` | 6 | Un pochoir. Métaphore. |
| `le-produit-exterieur-imprime-la-matrice` | `poids.py` | 5 | Un tampon qui descend sur une page. Métaphore d'imprimerie. |
| `une-composante-pese-autant-que-neuf` | `reclame.py` | 3 | Un plateau de balance. Le fait — \|δ₂\| égale la somme des neuf autres — est **dans** la scène 2, à l'échelle, sans balance. |
| `limage-imprime-ses-zeros` | `remonter.py` | 9 | Une empreinte sur une matrice de 100 352 cases. Les comptes 10 716 et 89 636 restent sur la page. |
| `la-transposee-redistribue` | `somme.py` | 8 | Le même objet que la scène 5, montré deux fois. Une seule suffit, et c'est la scène 5 qui porte le mot « transposée ». |
| `on-somme-on-ne-choisit-pas` | `somme.py` | 8 | Une urne qu'on dépouille, des bulletins qu'on barre. Métaphore électorale, et elle met en scène un arbitrage pour le nier. |
| `les-erreurs-frequentes-se-rayent` | `synthese.py` | 12 | Dix phrases posées en liste, qui se rayent. Ce sont des **phrases** : la règle du chapitre n'en admet aucune dans une animation. |
| `les-exemples-ne-tirent-pas-au-meme-endroit` | `un_exemple.py` | 10 | Des cordes qui tirent, et deux cosinus — +0,4110 et −0,0263 — de la mesure 5. Un cosinus entre deux vecteurs de 101 770 composantes ne se montre pas par deux flèches dans un plan. |

---

## Les fichiers

| Fichier | Ce qu'il devient |
|---|---|
| `retro_mob.py` | **Nouveau.** La base commune du chapitre : les poids et les mesures de `cours/lecon4/mesures.py`, et les gestes que les huit scènes partagent. |
| `reclame.py` | Deux scènes gardées sur trois. |
| `biais.py` | Une gardée sur deux. |
| `poids.py` | Une gardée sur deux. |
| `somme.py` | Une gardée sur trois. |
| `remonter.py` | Une gardée sur deux. |
| `synthese.py` | Une gardée sur deux. |
| `un_exemple.py` | Une gardée sur deux. |
| `activations.py` | **Supprimé** — ses trois scènes sont jetées. |
| `algorithme.py` | **Supprimé** — ses trois scènes sont jetées. |
| `cadre.py` | **Supprimé** — ses deux scènes sont jetées. |
| `cherche.py` | **Supprimé** — ses deux scènes sont jetées. |
| `hebb.py` | **Supprimé** — ses deux scènes sont jetées. |

---

## Ce qui reste à faire ailleurs, et qui n'est pas dans ce périmètre

**Vingt blocs `animation` perdent leur déclaration**, répartis sur les douze
pages. Ils ne tomberont pas en panne : l'application affiche alors le cadre qui
dit ce que la figure montrera, et c'est son état normal.

En revanche, `outils/verifier-contenu.mjs` refuse un `animationId` absent du
manifeste (`verifier-contenu.mjs:98-104`). **`npm run verifier` échouera donc
sur vingt blocs** le jour où le manifeste sera régénéré sans eux. C'est la
raison pour laquelle `public/animations/manifeste.json` est **restauré tel quel
avant le commit** de ce chantier : le manifeste commité connaît encore les 28,
et la vérification passe. Le manifeste se régénère à la fusion, quand les pages
et les scènes seront d'accord.

Ce qui reste à faire sur les pages, et qui appartient à qui les tient : retirer
ou remplacer les vingt blocs, et reprendre les huit légendes survivantes — elles
décrivent encore des engrenages, un tampon, une urne, un robinet, des cordes.

**Une légende dit en outre quelque chose de faux, et ce n'est pas une question
de style.** `p10-un-exemple.ts` décrit les images de test « classées d'abord au
hasard ». Elles ne le sont pas : le réseau non entraîné en envoie déjà **7 098
sur 10 000** dans la classe 2, et sa précision vaut 0,1314. Ce que les deux
cents pas produisent n'est donc pas le passage du hasard à l'uniforme, mais le
passage de 7 098 à 10 000 — et la disparition des neuf autres réponses. La
scène 8 montre les deux répartitions à la même échelle ; la légende, elle,
reste à reprendre.
