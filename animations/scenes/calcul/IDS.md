# Les identifiants du chapitre 5, et ce qu'ils sont devenus

Le chapitre 5 déclarait **28 animations** réparties sur douze fichiers. Aucune
n'était rendue. Toutes héritaient directement de `SceneN7` : chacune
redessinait son propre objet, et **vingt-trois d'entre elles redessinaient une
métaphore** — une loupe, un sablier, une bande transporteuse, une pile
d'assiettes, un thermographe, de la robinetterie, des poulies, un métronome, un
escalier, des claveaux, un pendule.

Ce fichier dit, pour les 28, ce qu'elles sont devenues. Il est la table de
correspondance qu'un lecteur des pages doit pouvoir consulter quand un
`animationId` ne répond plus.

**Le critère, et il n'en a pas d'autre :** une animation est gardée si elle
montre **un objet de ce chapitre en train de faire quelque chose** — le réseau
minuscule, l'arbre des dépendances, une droite graduée, le signal d'erreur, une
matrice. Elle est jetée si elle montre une *image de* cet objet : une poulie
n'est pas une dérivée partielle, un sablier n'est pas une somme, un métronome
n'est pas une récurrence.

**Les cinq gardées sont refaites**, aucune n'est conservée en l'état : toutes
passent sur `scenes/calcul/calcul_mob.py`, et tous leurs nombres sortent de
`cours/lecon5/mesures.py`, chacun avec sa ligne citée.

**Trois nouvelles** sont déclarées, pour des objets que le chapitre expose et
qu'aucune des 28 ne montrait.

---

## Les cinq qui restent, et les trois qui arrivent

| # | `animationId` | Classe | Fichier | Page | L'objet qu'elle montre |
|---|---|---|---|---|---|
| 1 | `le-reseau-minuscule` **(nouveau)** | `LeReseauMinuscule` | `minuscule.py` | 4 | Le réseau 1 → 1 → 1 → 1 et ses sept valeurs figées ; il se remplit poste par poste jusqu'à ℓ = 0,167786. |
| 2 | `larbre-des-dependances` | `LarbreDesDependances` | `arbre.py` | 4 | L'arbre de ce dont la perte dépend, poussé depuis ℓ, une génération à la fois, jusqu'aux sept feuilles. |
| 3 | `trois-droites-graduees` | `TroisDroitesGraduees` | `arbre.py` | 4 | Une poussée sur w³ arrive sur z³ puis sur ℓ ; divisée par dix, elle laisse les deux rapports inchangés. |
| 4 | `la-recurrence-se-deroule` | `LaRecurrenceSeDeroule` | `recurrence.py` | 8 | δ³, δ², δ¹ descendent les trois couches, puis le produit déroulé donne le même nombre à écart nul. |
| 5 | `la-jacobienne-est-diagonale` | `LaJacobienneEstDiagonale` | `vectorielle.py` | 10 | Un tableau de 400 coefficients se vide de ses 380 cases hors diagonale, qui sont toutes nulles. |
| 6 | `le-softmax-ne-se-vide-pas` **(nouveau)** | `LeSoftmaxNeSeVidePas` | `vectorielle.py` | 10 | Le même contrôle sur le softmax : 90 coefficients hors diagonale, 90 non nuls, et des colonnes qui somment à zéro. |
| 7 | `le-signal-sattenue` | `LeSignalSattenue` | `profondeur.py` | 11 | La norme de δ relevée aux cinq couches, ReLU puis sigmoïde, à la même échelle : rapport 1,2 contre 133,4. |
| 8 | `le-gradient-est-un-produit-exterieur` **(nouveau)** | `LeGradientEstUnProduitExterieur` | `bloc.py` | 10 | Une colonne et une ligne se croisent, et leur croisement remplit le tableau du bloc. |

Les cinq identifiants gardés sont **inchangés** : ce sont ceux que les pages
référencent déjà. Aucun lien ne se casse pour ces cinq-là.

**Quatre de ces huit scènes dessinent une matrice comme un tableau de
coefficients** — les scènes 5, 6, 7 et 8. C'est la forme que le chapitre
demande : sa page 10 écrit le retour sans indices, et une matrice qu'on écrit
`W` au lieu de la dessiner n'a pas de composantes qu'on puisse regarder.

**Ce qu'une case remplie dit, et ce qu'elle ne dit pas.** Elle dit qu'un
coefficient est là ; elle ne dit pas ce qu'il vaut. Les mesures 4, 6 et 7
relèvent des comptes, des maxima et des écarts, jamais 4 096 valeurs une par
une : un dégradé par case serait une invention. Les seules grandeurs écrites à
l'écran sont celles que `mesures.py` imprime.

---

## Les vingt-trois qui sont jetées

Toutes les pages du chapitre référencent une animation ; **les vingt-trois
identifiants ci-dessous perdent donc la leur**, et leur bloc affichera le cadre
d'attente, qui est son état normal, pas une panne. C'est la conséquence
directe du critère, et elle est assumée : vingt-trois cadres d'attente valent
mieux que vingt-trois métaphores qui se donnent pour des mesures.

| `animationId` | Fichier d'origine | Page | Pourquoi elle est jetée |
|---|---|---|---|
| `les-douze-postes-du-chapitre` | `cadre.py` | 1 | Une bande transporteuse à postes. Ce n'est pas un objet du chapitre, c'est sa table des matières. |
| `les-prerequis-se-depilent` | `cadre.py` | 1 | Une pile d'assiettes qu'on dépile. Métaphore, et la liste des prérequis est du texte. |
| `ce-qui-reste-a-etablir` | `manque.py` | 2 | Une boîte noire qu'on ouvre. Métaphore, et une boîte : la règle du chapitre n'en admet aucune. |
| `les-indices-disparaissent` | `manque.py` | 2 | Une trame qui se raréfie. La disparition des indices est une affaire d'écriture ; la page la montre mieux en figure fixe. |
| `la-chaine-sans-embranchement` | `chaine.py` | 3 | Une chaîne de maillons qu'on tend. Métaphore, et c'est l'arbre de la scène 2 qui porte la structure sans embranchement. |
| `le-cordon-a-plusieurs-brins` | `chaine.py` | 3 | Un cordon dont on suit un brin. Même métaphore que la précédente, au pluriel. |
| `la-poussee-nest-pas-un-quotient` | `arbre.py` | 4 | Une loupe qui grossit un intervalle. Le fait — le rapport ne dépend pas de la taille de la poussée — est **dans** la scène 3, qui divise la poussée par dix et montre les deux rapports inchangés. |
| `chaque-derivee-sort-de-son-equation` | `derivees.py` | 5 | Une substitution de facteurs. C'est une manipulation symbolique : elle se lit en figure fixe, elle ne s'anime pas. |
| `la-pente-de-lactivation` | `derivees.py` | 5 | Un faisceau de rayons réfractés. Métaphore optique ; la pente de φ est une courbe, que le chapitre 2 a déjà tracée. |
| `lecart-a-la-cible-se-lit` | `derivees.py` | 5 | Un thermographe. Le chapitre 4 avait déjà jeté quatre thermomètres pour la même raison. |
| `le-produit-des-trois` | `assemblage.py` | 6 | Un pavé bâti sur trois cotes. Un volume n'est pas un produit de dérivées, et les trois facteurs — 1,100, 0,130606, −1,182684 — sont portés par les scènes 1 et 3. |
| `deux-composantes-sur-six` | `assemblage.py` | 6 | Un sablier à plusieurs chambres. Métaphore, et un sablier dit le contraire de ce qu'il faut : rien ne s'écoule ici. |
| `leffet-passe-par-le-poids` | `precedente.py` | 7 | **Des poulies en cascade.** Métaphore mécanique de transmission — le geste de l'engrenage que le chapitre 4 s'était déjà interdit page 4. Voir plus bas. |
| `on-ne-pousse-que-les-parametres` | `precedente.py` | 7 | Une clé qui ne tourne que dans certaines serrures. Métaphore, et elle met en scène un interdit plutôt qu'un objet. |
| `ce-que-le-produit-annonce` | `recurrence.py` | 8 | **Un métronome qui ralentit.** Un corps qui bat la mesure. Voir plus bas. |
| `le-produit-replie-en-accordeon` | `recurrence.py` | 8 | Une règle graduée repliée en accordéon. Le produit déroulé est **dans** la scène 4, écrit d'un trait, avec sa valeur et son écart nul. |
| `le-poids-reste-en-serie` | `indices.py` | 9 | De la robinetterie en série. Métaphore hydraulique. |
| `la-somme-sur-les-chemins` | `indices.py` | 9 | Une rangée de tuyaux de sections différentes. Même métaphore, et la somme sur les chemins est l'objet de la scène 8 du chapitre 4, sur le réseau. |
| `lordre-des-indices-se-verifie` | `indices.py` | 9 | **Un calque qui se superpose à un autre.** Le geste du pochoir, que le chapitre 4 s'était déjà interdit. Voir plus bas. |
| `le-softmax-couple-les-composantes` | `vectorielle.py` | 10 | Un pendule couplé. Métaphore, et le couplage se mesure : la scène 6 montre les 90 coefficients hors diagonale qui ne s'éteignent pas. |
| `deux-propagations-contre-cent-vingt-six-mille` | `profondeur.py` | 11 | Un compteur kilométrique. Un compte n'est pas un mouvement, et la règle du chapitre n'admet aucun compteur. |
| `les-cinq-chapitres-en-escalier` | `synthese.py` | 12 | Un escalier dont les marches rétrécissent. Ce n'est pas un objet du chapitre, c'est le plan du cours. |
| `lalgorithme-en-une-frappe` | `synthese.py` | 12 | Des claveaux posés jusqu'à la clé de voûte. Métaphore d'architecture. |

---

## Les trois gestes trop proches des chapitres 2 à 4

Trois des vingt-trois sont jetées **deux fois** : parce qu'elles sont des
métaphores, et parce que leur geste est déjà celui d'un chapitre antérieur.
Répéter un geste d'un chapitre à l'autre lui fait dire deux choses
différentes, et le lecteur qui a retenu la première ne lit plus la seconde.

| Notre identifiant | Son geste | Le geste antérieur qu'il reprend |
|---|---|---|
| `leffet-passe-par-le-poids` | poulies en cascade | les **engrenages** de `les-trois-voies-vers-une-somme-ponderee`, chapitre 4 page 4 (`retropropagation/biais.py`), jetée là-bas pour ce motif exact |
| `lordre-des-indices-se-verifie` | calque superposé | le **pochoir** de `letiquette-est-un-pochoir`, chapitre 4 (`retropropagation/hebb.py`), jetée là-bas pour ce motif exact |
| `ce-que-le-produit-annonce` | métronome qui ralentit | le **diapason** — voir la réserve ci-dessous |

**Une réserve, et je ne la comble pas.** Les engrenages et le pochoir sont
vérifiables : ils sont dans `scenes/retropropagation/`, et l'`IDS.md` de ce
chapitre les nomme. **Le diapason, non.** Aucune scène des chapitres 2 à 4 ne
porte ce geste ; la seule occurrence du mot dans le dépôt est une légende de
page, `p12-synthese.ts`, bloc `b-cr12-11`, signalée comme périmée dans
`contenu/calcul/À-FUSIONNER.md:450`. Le corps qui bat la mesure a donc été
cherché parmi les 28, et deux répondent : le **métronome** de
`ce-que-le-produit-annonce` et le **pendule couplé** de
`le-softmax-couple-les-composantes`. Les deux sont jetées de toute façon. J'ai
retenu le métronome comme le troisième geste, parce qu'un diapason et un
métronome battent tous deux une cadence régulière là où un pendule couplé sert
à montrer un transfert. Si l'intention était l'autre, rien ne change au
résultat : les deux partent.

---

## Les fichiers

| Fichier | Ce qu'il devient |
|---|---|
| `calcul_mob.py` | **Nouveau.** La base commune : toutes les valeurs de `cours/lecon5/mesures.py` en constantes, chacune avec sa ligne citée ; le réseau minuscule dérivé de `reseau_mob.py` ; le tableau de coefficients ; la droite graduée. |
| `SOURCE.md` | **Nouveau.** Ce que `_2017/nn/part3.py` anime, et ce que nous en faisons. |
| `minuscule.py` | **Nouveau.** Une scène, le réseau 1 → 1 → 1 → 1. |
| `bloc.py` | **Nouveau.** Une scène, le produit extérieur. |
| `arbre.py` | Deux gardées sur trois. |
| `recurrence.py` | Une gardée sur trois. |
| `vectorielle.py` | Une gardée sur deux, plus une nouvelle. |
| `profondeur.py` | Une gardée sur deux. |
| `assemblage.py` | **Supprimé** — ses deux scènes sont jetées. |
| `cadre.py` | **Supprimé** — ses deux scènes sont jetées. |
| `chaine.py` | **Supprimé** — ses deux scènes sont jetées. |
| `derivees.py` | **Supprimé** — ses trois scènes sont jetées. |
| `indices.py` | **Supprimé** — ses trois scènes sont jetées. |
| `manque.py` | **Supprimé** — ses deux scènes sont jetées. |
| `precedente.py` | **Supprimé** — ses deux scènes sont jetées. |
| `synthese.py` | **Supprimé** — ses deux scènes sont jetées. |

---

## Ce qui reste à faire ailleurs, et qui n'est pas dans ce périmètre

**Les pages ne sont pas dans ce périmètre.** Trois choses les concernent, et
elles reviennent à qui les tient :

1. **Vingt-trois blocs perdent leur animation.** Les pages 1, 2, 3, 5, 6, 7, 9
   et 12 n'en gardent aucune ; les pages 4, 8, 10 et 11 en gardent une ou deux.
2. **Trois identifiants nouveaux n'ont pas de bloc.** `le-reseau-minuscule`
   (page 4, à côté de la section « Mesure 1 · la propagation avant »),
   `le-softmax-ne-se-vide-pas` (page 10, à la place du pendule couplé) et
   `le-gradient-est-un-produit-exterieur` (page 10).
3. **Les légendes des cinq gardées décrivent l'ancienne scène.** Elles ont
   toutes été refaites : le geste a changé même là où l'identifiant n'a pas
   bougé. `À-FUSIONNER.md` signalait déjà plusieurs de ces légendes comme
   périmées.
