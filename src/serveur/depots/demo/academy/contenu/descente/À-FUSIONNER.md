# Chapitre 3 — ce qui reste à fusionner

Ce fichier liste **tout ce qui devait être écrit hors des trois répertoires
autorisés**, et qui ne l'a donc pas été. Chaque entrée donne le fichier, la
ligne approximative, et le texte exact à insérer.

Répertoires écrits par cet agent, et eux seuls :

```
src/serveur/depots/demo/academy/contenu/descente/
cours/lecon3/mesures.py
animations/scenes/descente/
```

---

## 1. `src/serveur/depots/demo/academy/sommaires.ts`

### 1.1 Le chapitre — dans `CHAPITRES`, après `ch-ml-2`

**ATTENTION, CONFLIT DE NUMÉROTATION À TRANCHER.** `sommaires.ts` porte
aujourd'hui un `ch-ml-3` intitulé « L'optimisation de l'entraînement », avec
huit leçons `l-optim-0` à `l-optim-7` et son contenu dans
`contenu/optimisation.ts` et `contenu/optimisation-suite.ts`. Le chapitre livré
ici est celui que `contenu/panorama/cadre.ts` annonce sous le nom « Chapitre 3 ·
La descente de gradient, comment un réseau apprend ». Les deux ne peuvent pas
occuper le rang 3. **La fusion doit décider** : soit l'ancien `ch-ml-3` est
retiré et remplacé, soit il est décalé. Cet agent n'a pas tranché, et n'a touché
à aucun de ces fichiers.

Sous réserve de cette décision, l'entrée à insérer :

```ts
  {
    id: "ch-ml-3",
    slug: "la-descente-de-gradient",
    titre: "La descente de gradient, comment un réseau apprend",
    resume:
      "Ce qu'on cherche, et par quel procédé on le cherche — sans dire encore comment on calcule le gradient.",
    coursId: "c-intro-ml",
    rang: 3,
  },
```

### 1.2 Les douze leçons — dans `LECONS`, à la suite des entrées de `ch-ml-2`

```ts
  // ── Chapitre 3 · La descente de gradient ──────────────────────────────────
  //
  // Les douze pages du chapitre. Toutes publiées : le contenu existe, il est
  // vérifié, et chaque nombre qu'il cite sort de cours/lecon3/mesures.py.
  // Les durées sont une estimation de lecture.
  {
    id: "l-desc-1",
    slug: "le-cadre-de-la-descente",
    titre: "Le cadre du cours",
    resume: "Six dettes réglées, quatre contractées, et le plan des onze pages.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 1,
    genre: "lecture",
    minutes: 8,
    statut: "publie",
    libre: true,
  },
  {
    id: "l-desc-2",
    slug: "ce-quon-a-construit-et-ce-qui-manque",
    titre: "Ce qu'on a construit, et ce qui manque",
    resume: "Le chapitre 2 en une page, et la question qu'il n'a jamais posée.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 2,
    genre: "lecture",
    minutes: 8,
    statut: "publie",
  },
  {
    id: "l-desc-3",
    slug: "ce-que-veut-dire-apprendre",
    titre: "Ce que veut dire apprendre",
    resume: "On n'écrit pas l'algorithme qui reconnaît, on écrit celui qui règle.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 3,
    genre: "lecture",
    minutes: 12,
    statut: "publie",
  },
  {
    id: "l-desc-4",
    slug: "au-depart-le-reseau-est-mauvais",
    titre: "Au départ, le réseau est mauvais",
    resume: "Cinq initialisations mesurées, et un coût qui dépasse celui du hasard.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 4,
    genre: "demo",
    minutes: 12,
    statut: "publie",
  },
  {
    id: "l-desc-5",
    slug: "dire-au-programme-quil-est-mauvais",
    titre: "Dire au programme qu'il est mauvais",
    resume: "Deux coûts candidats, et un rapport de 450 qui les départage.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 5,
    genre: "demo",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-desc-6",
    slug: "le-cout-sur-tout-le-jeu",
    titre: "Le coût sur tout le jeu",
    resume: "Une fonction de 101 770 nombres vers un seul, et le statut du jeu tranché.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 6,
    genre: "lecture",
    minutes: 14,
    statut: "publie",
  },
  {
    id: "l-desc-7",
    slug: "descendre-en-dimension-un",
    titre: "Descendre, en dimension un",
    resume: "Le taux d'erreur a un gradient nul, et le signe moins se démontre.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 7,
    genre: "lecture",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-desc-8",
    slug: "descendre-en-dimension-quelconque",
    titre: "Descendre, en dimension quelconque",
    resume: "Le gradient, le pas, et 203 540 propagations avant pour un seul calcul.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 8,
    genre: "demo",
    minutes: 26,
    statut: "publie",
  },
  {
    id: "l-desc-9",
    slug: "pourquoi-on-nutilise-pas-tout-le-jeu",
    titre: "Pourquoi on n'utilise pas tout le jeu",
    resume: "Un lot de 64 pointe à 41 degrés du bon gradient, et ça marche.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 9,
    genre: "demo",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-desc-10",
    slug: "ce-que-le-gradient-encode",
    titre: "Ce que le gradient encode",
    resume: "Un signe, une taille relative, et un rapport de 404 entre deux composantes.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 10,
    genre: "lecture",
    minutes: 16,
    statut: "publie",
  },
  {
    id: "l-desc-11",
    slug: "il-ny-a-pas-une-bonne-reponse",
    titre: "Il n'y a pas une bonne réponse",
    resume: "128! minimiseurs construits, et trois solutions quasiment orthogonales.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 11,
    genre: "demo",
    minutes: 20,
    statut: "publie",
  },
  {
    id: "l-desc-12",
    slug: "la-descente-synthese",
    titre: "Synthèse, formulaire et erreurs fréquentes",
    resume: "Le trajet en un paragraphe, puis ce qu'il faut garder sous la main.",
    chapitreId: "ch-ml-3",
    coursId: "c-intro-ml",
    rang: 12,
    genre: "lecture",
    minutes: 14,
    statut: "publie",
  },
```

---

## 2. `src/serveur/depots/demo/academy/index.ts`

**Ligne ~35**, dans le bloc d'imports, à la suite des autres `CONTENU_*` :

```ts
import { CONTENU_DESCENTE } from "./contenu/descente";
```

**Ligne ~41**, dans la constante `CONTENU` :

```ts
const CONTENU: Record<string, Bloc[]> = {
  ...CONTENU_PANORAMA,
  ...CONTENU_OPTIMISATION,
  ...CONTENU_OPTIMISATION_SUITE,
  ...CONTENU_DESCENTE,        // <- la ligne à ajouter
};
```

L'agrégateur `contenu/descente/index.ts` existe et exporte `CONTENU_DESCENTE`,
un `Record<string, Bloc[]>` de douze entrées, `l-desc-1` à `l-desc-12`. Il est
**propre au chapitre 3** ; seul l'import ci-dessus est partagé.

---

## 3. Renvois attendus depuis d'autres chapitres

Cet agent n'a modifié aucun fichier d'un autre chapitre. Les renvois suivants
sont **cités par le chapitre 3** et gagneraient à être réciproques :

| Chapitre | Ce qu'il faudrait y ajouter |
|---|---|
| Chapitre 2, page 1, tableau des dettes | Les six dettes du chapitre 2 sont réglées ici aux pages 4, 7, 8, 9, 10 et 11 ; le tableau du chapitre 2 pourrait pointer la page exacte |
| Chapitre 4 | Le chapitre 3 lui renvoie le calcul du gradient, avec le chiffre `203 540 propagations avant contre 1` |
| Chapitre d'optimisation | Deux dettes : la preuve de la proposition 3 (approximation au premier ordre + Cauchy-Schwarz), et le seuil exact sur $\eta$ |
| Chapitre d'évaluation | Une dette : le coût de test qui remonte après l'époque 19, mesuré en page 8 |
| Fondements probabilistes | Une dette : le cadre de $\mathbb{E}$, $\mathrm{Var}$ et de l'indépendance, posés au strict nécessaire en page 9 |

---

## 4. Relevé de couverture de la source

Chaque ligne de la table de contrôle de la consigne, avec la page où elle est
traitée et l'identifiant du bloc qui la traite.

| Notion de la source | Page | Bloc(s) |
|---|---|---|
| rappel : 784 pixels, activations, somme pondérée plus biais, fonction non linéaire | 2 | `b-d2-2` |
| rappel : le plus actif des dix neurones de sortie est la réponse | 2 | `b-d2-2` |
| rappel : 13 002 poids et biais pour l'architecture 16-16 | 2 | `b-d2-3` |
| rappel : l'espoir bords → boucles → chiffres, **et son démenti** | 2 | `b-d2-5` |
| ce qui distingue l'apprentissage machine : on écrit l'algorithme qui règle | 3 | `b-d3-3`, `b-d3-4` |
| les données d'entraînement, et leur étiquetage | 3 | `b-d3-7` |
| la généralisation : on teste sur des données jamais vues | 3 | `b-d3-9` |
| MNIST : des dizaines de milliers d'images étiquetées, libres | 3 | `b-d3-8` |
| « apprendre » ressemble à un exercice de calcul : trouver un minimum | 3 | `b-d3-13`, `b-d3-14` |
| initialiser au hasard : le réseau est mauvais | 4 | `b-d4-5`, `b-d4-8` |
| la fonction de coût dit au programme qu'il fait un mauvais travail | 5 | `b-d5-2`, `b-d5-5` |
| la somme des carrés des écarts entre sortie obtenue et sortie voulue | 5 | `b-d5-4`, `b-d5-11` |
| le coût est faible quand le réseau est confiant et juste | 5 | `b-d5-7` |
| question : classer quatre sorties par coût | 5 | `b-d5-15` (🧪 23) |
| la moyenne sur des dizaines de milliers d'exemples | 6 | `b-d6-3`, `b-d6-5` |
| le réseau est une fonction : 784 entrées, 10 sorties, des paramètres | 6 | `b-d6-10` |
| le coût est une couche de complexité au-dessus | 6 | `b-d6-10`, `b-d6-3` |
| dire au programme qu'il est mauvais ne suffit pas | 6 | `b-d6-16` |
| simplifier : une fonction d'une variable | 7 | `b-d7-2` |
| résoudre pente nulle : parfois possible, infaisable ici | 7 | `b-d7-4`, `b-d7-5` |
| partir au hasard, regarder la pente, aller à gauche ou à droite | 7 | `b-d7-14`, `b-d7-15` |
| l'image de la bille qui roule | 7 | `b-d7-19`, `b-d7-20`, `b-d7-21` |
| deux variables : le plan, la surface au-dessus | 7 | `b-d7-22` |
| note : le coût doit être lisse, d'où les activations continues | 7 | `b-d7-10` (proposition 1) |
| plusieurs vallées : le minimum atteint dépend du point de départ | 11 | `b-d11-14`, `b-d11-15` |
| des pas proportionnels à la pente rétrécissent près du minimum | 8 | `b-d8-15`, `b-d8-16` |
| en dimension supérieure, « la pente » comme un nombre n'a plus de sens | 8 | `b-d8-1`, `b-d8-5`, `b-d8-6` |
| le gradient donne la direction de plus forte montée | 8 | `b-d8-9`, `b-d8-10` |
| son opposé donne la plus forte descente | 8 | `b-d8-10`, `b-d8-18` |
| la longueur du gradient dit la raideur de la pente | 8 | `b-d8-15`, `b-d8-16` |
| l'algorithme : calculer le gradient, faire un pas, recommencer | 8 | `b-d8-19` |
| le pas vaut −η fois le gradient ; η est le taux d'apprentissage | 8 | `b-d8-18`, `b-d8-24` |
| ranger les poids et biais en un seul vecteur colonne | 6 | `b-d6-8`, `b-d6-9` |
| le gradient est un vecteur de même taille | 8 | `b-d8-6`, `b-d8-21` (🧪 27) |
| chaque composante dit deux choses : son signe, et sa taille relative | 10 | `b-d10-3` |
| le gradient encode l'importance relative de chaque poids | 10 | `b-d10-5` |
| le coût une couche au-dessus, son gradient une couche encore au-dessus | 10 | `b-d10-13` |
| l'algorithme qui calcule ce vecteur efficacement — chapitre suivant | 12 | `b-d12-17`, `b-d12-18` |
| « apprendre » veut dire changer les poids pour minimiser un coût | 12 | `b-d12-2` |

**Aucune ligne sans destination.**

### Le contrôle croisé avec le chapitre 2, et la ligne de partage

La page 11 porte une section `11.4` consacrée au rapprochement avec le
chapitre 2, placée **après** la proposition 6 et après la mesure des trois
graines, dont elle est la conséquence.

Le chapitre 2 mesure `0,9814 · 186 erreurs` sur le réseau `784 → 128 → 10`, et
la graine 0 de la mesure 6 de ce chapitre donne **exactement** la même valeur.
Les deux partagent la graine et le protocole : c'est la **même trajectoire**
parcourue par deux programmes écrits séparément, dans deux répertoires
distincts. Ce n'est donc **pas** un quatrième point du nuage des trois graines,
et la page le dit explicitement (`b-d11-25`).

| Bloc | Contenu |
|---|---|
| `b-d11-23` à `b-d11-25` | Le rapprochement, et pourquoi ce n'est pas un tirage |
| `b-d11-26` | Ce que le contrôle croisé établit / n'établit pas — il ne dit **rien** de la variation entre graines |
| `b-d11-27` à `b-d11-29` | La ligne de partage : ce qui ne dépend pas de la trajectoire, ce qui en dépend |
| `b-d11-30`, `b-d11-31` | La règle : architecture et données d'un côté, trajectoire de l'autre, la proposition 6 disant pourquoi une trajectoire n'est pas déterminée par le problème |
| `b-d11-32` | Ce que la règle interdit d'écrire : un chapitre ne reprend jamais les nombres d'un autre pour lisser un écart |
| `b-d11-33` | 🧪 n°34 |

**Conséquence pour la fusion.** Un désaccord entre chapitres sur une quantité de
la colonne de gauche — rapport 404, 23 882 zéros, percentiles, cosinus par
taille de lot, colonne `B(1/cos²−1)` — est un **défaut** à instruire. Un
désaccord sur une quantité de la colonne de droite — coût initial, décroissance
de la norme du gradient, précisions et erreurs des graines — est **attendu** et
ne se corrige pas.

### Les cinq écarts délibérés, et où ils sont signalés

| Écart | Page | Bloc |
|---|---|---|
| 1. Entropie croisée retenue, coût quadratique de la source mesuré et écarté | 5 | `b-d5-14` |
| 2. `grad_θ` écrit partout, le symbole ∇ absent | 8 et 12 | `b-d8-6`, `b-d12-21` |
| 3. Les différences finies données, employées, puis chiffrées comme inutilisables | 8 | `b-d8-30`, `b-d8-33`, `b-d8-34` |
| 4. Six propositions et onze mesures là où la source ne mesure rien | 12 | `b-d12-21` |
| 5. Une page entière sur les mini-lots, que la source ne traite pas | 9 | `b-d9-13` |

### Les six dettes du chapitre 2, et où elles sont réglées

| Dette | Page | Bloc du règlement |
|---|---|---|
| D'où viennent les poids | 4 | `b-d4-11` |
| `h = 128` non justifié | 11 | `b-d11-21`, `b-d11-22` |
| La perte n'est plus convexe en θ | 7 | `b-d7-6`, `b-d7-7` |
| σ′ ≤ 1/4 et sa conséquence | 10 | `b-d10-14` |
| Les mini-lots de 64 | 9 | `b-d9-13` |
| η = 0,05 contre η = 0,5 | 8 | `b-d8-26` |

---

## 5. État de la validation, au moment de la livraison

```
npx tsc --noEmit                      exit 0, aucune erreur
node outils/verifier-contenu.mjs      exit 0
    89 références vérifiées dans 40 fichiers · 942 blocs · 89 animations
    aucune référence non résolue, ni dans le chapitre 3 ni ailleurs
python animations/manifeste.py --verifier   30 rendues, 59 prévues, aucune erreur
python cours/lecon3/mesures.py        exit 0, 574 s, onze mesures produites
```

Le vérificateur ne passe qu'après régénération du manifeste, puisque les 28
scènes du chapitre 3 ne s'y trouvent pas encore. Le manifeste a été régénéré,
lu, **puis restauré à l'octet près** : son empreinte MD5 avant et après vaut
`b4e8384e0519ca94ecb6d769aad2884f`.

**`public/animations/manifeste.json` apparaît malgré tout comme modifié dans
`git status`.** Cette modification est **antérieure** au travail de cet agent :
elle était déjà présente au début de la session, et n'a pas été touchée. La
fusion la traitera comme le prévoit `ECRIRE-EN-PARALLELE.md`, §8 : régénérer une
fois, après les cinq chapitres, et ne commiter que ce manifeste-là.

### Reproductibilité des mesures

Le programme a été exécuté **deux fois**. Toutes les valeurs mesurées sont
identiques d'une exécution à l'autre — précisions, erreurs, cosinus, normes,
distances, comptes de zéros. Seules les **durées** diffèrent, la machine étant
chargée lors de la première exécution. Les durées de la mesure 11 citées en
page 11 sont celles de la seconde exécution, la seule où la machine était libre.

### Ce que la consigne demandait et qui n'a pas été fait

`animations/scenes/n7ia.py` a été modifié par un autre agent pendant la session :
`python animations/manifeste.py --verifier` signale en conséquence **30 rendus
périmés** sous la cause « le style commun ». Aucun de ces rendus n'appartient au
chapitre 3, qui n'en a aucun. Conformément à la consigne, **rien n'a été rendu**.

---
---

# PASSE DU 20 SEPTEMBRE 2026 — TEXTE, FIGURES, LECTURE

Cette seconde partie est écrite par la passe qui a repris le **texte** et les
**figures** du chapitre. Elle ne remplace rien de ce qui précède : elle s'y
ajoute, et elle signale au §10 les points de la première partie qui ont vieilli.

Périmètre écrit par cette passe, et lui seul :

```
src/serveur/depots/demo/academy/contenu/descente/
cours/lecon3/figures.py
public/cours/lecon3/
```

`cours/lecon3/mesures.py` n'a **pas** été touché : aucun nombre du chapitre n'a
changé. Les blocs `animation` des pages n'ont pas été touchés non plus, comme la
consigne le demandait ; leur sort est écrit au §6 et rien d'autre n'en dispose.

---

## 6. Le sort des vingt-huit blocs animation

Les vingt-huit scènes sont **restées en place**, telles qu'elles étaient. Ce
tableau dit ce que chacune doit devenir, et pourquoi. La colonne « remplacée
par » nomme la figure fixe qui porte désormais l'idée : les vingt-huit figures
SVG existent, elles sont servies par les pages, et elles passent les deux
cribles.

Trois verdicts seulement, dans l'ordre de préférence décroissante de la
règle 15 : **rien**, **un schéma**, **une animation**.

| Page | Bloc | Identifiant | Verdict | Remplacée par | Pourquoi |
|---|---|---|---|---|---|
| 1 | `b-d1-10` | `le-plan-de-la-descente` | **Supprimer** | rien | Une liste de onze jalons posée sur une roue est une mise en page, pas une figure (règle 20), et le plan se lit trois lignes plus haut (règle 15, cas « rien »). |
| 1 | `b-d1-14` | `les-six-dettes-se-soldent` | **Supprimer** | rien | Le tableau `dettes-reglees` dit la même chose et se lit plus vite. Sa légende annonce en outre « trois crans » quand le tableau en porte quatre réglées par une mesure : elle est **fausse**. |
| 2 | `b-d2-5` | `ce-que-le-chapitre-2-a-construit` | **Remplacer** | `l3-fig03-deux-architectures` | Trois plaques qui se superposent l'une après l'autre sont un découpage, pas un changement (règle 18). |
| 2 | `b-d2-10` | `les-poids-nont-pas-dorigine` | **Supprimer** | `l3-fig01` (page 1) | Le sablier est une image inventée pour désigner l'objet (règle 7), et la figure 1 montre déjà les quatre blocs marqués d'un point d'interrogation. |
| 3 | `b-d3-5` | `deux-algorithmes-a-ecrire` | **Remplacer** | `l3-fig05-deux-algorithmes` | Le miroir est un procédé de mise en scène ; ce qui porte l'idée est ce qui entre et ce qui sort, et cela ne bouge pas. |
| 3 | `b-d3-15` | `le-probleme-en-une-ligne` | **Supprimer** | `l3-fig06-argmin-trois-cas` | Le fil qui se relâche est une métaphore. La figure 6 montre les trois cas d'`argmin`, ce que le texte ne donne pas à voir. |
| 4 | `b-d4-6` | `pire-que-le-hasard` | **Remplacer** | `l3-fig07-cinq-graines` | Cinq aiguilles qui se posent l'une après l'autre sont un découpage (règle 18). Le cadran gradué de $0$ à $3$ écrase en outre l'écart que la page veut montrer, qui tient dans un quinzième de cette plage. |
| 4 | `b-d4-9` | `une-sortie-non-entrainee` | **Remplacer** | `l3-fig08-sortie-non-entrainee` | Même motif. **Sa légende compte faux** : elle annonce « trois barres la dépassent, sept restent en dessous », et la sortie mesurée en donne cinq et cinq. |
| 5 | `b-d5-8` | `deux-couts-sur-la-meme-sortie` | **Remplacer** | `l3-fig09-deux-couts` | Une balance dont les deux plateaux montent ensemble puis descendent ensemble n'est pas une balance : la métaphore travaille contre ce qu'elle montre. |
| 5 | `b-d5-12` | `le-cout-punit-la-confiance-fausse` | **Remplacer** | `l3-fig10-pente-des-deux-couts` | Deux courbes qui se tracent ne changent pas dans le temps ; leur tracé progressif n'apprend rien. |
| 5 | `b-d5-13` | `le-gradient-quadratique-sepuise` | **Supprimer** | rien | Les tuyaux disent une troisième fois ce que la table de sensibilité et la figure 10 disent déjà (règle 12). |
| 6 | `b-d6-6` | `du-reseau-au-cout` | **Remplacer** | `l3-fig11` et `l3-fig12` | Une surface en relief demande de choisir deux paramètres sur $101\,770$ et laisse croire qu'on peut voir l'espace. Les deux boîtes jumelles disent l'essentiel, qui est le renversement des entrées. |
| 6 | `b-d6-14` | `les-donnees-sont-un-parametre` | **Supprimer** | rien | La carte en fausses couleurs illustre une phrase que le texte dit en une ligne. **Contient un cadratin** dans sa légende. |
| 7 | `b-d7-11` | `la-perte-0-1-est-un-escalier` | **Remplacer** | `l3-fig14-escalier-et-courbe` | La figure a l'avantage décisif d'être **mesurée** sur le réseau, un paramètre réellement balayé, là où la scène dessine l'idée. |
| 7 | `b-d7-16` | `le-pas-trop-grand-rebondit` | **Supprimer** | `l3-fig18-trois-taux` (page 8) | L'idée du pas trop grand appartient à la page 8, où elle est mesurée. La servir deux fois est la règle 12. |
| 7 | `b-d7-21` | `la-bille-et-ses-limites` | **Remplacer** | `l3-fig15-la-bille-et-la-descente` | Deux trajectoires se comparent mieux côte à côte qu'en alternance. |
| 8 | `b-d8-14` | `toutes-les-directions` | **Remplacer** | `l3-fig16-cent-directions` | Cent flèches qui apparaissent puis se rangent en liste sont un découpage. |
| 8 | `b-d8-25` | `trois-taux-trois-destins` | **Remplacer** | `l3-fig18-trois-taux` | Trois trajets se lisent mieux côte à côte que rejoués l'un après l'autre. La scène emploie en outre un troisième jeu de valeurs de $\eta$, différent de celui de la figure et de celui de la table. |
| 8 | `b-d8-32` | `la-difference-finie-tatonne` | **Garder, sous condition** | — | C'est la **seule** scène du chapitre dont le champ « ce qui change dans le temps » se remplisse honnêtement : **l'écartement $2\varepsilon$ se réduit, et la pente mesurée converge vers la tangente**. Le compteur qui monte vers $101\,770$, lui, est redit par la figure 19 et doit sortir de la scène. |
| 9 | `b-d9-3` | `soixante-mille-pour-un-pas` | **Supprimer** | rien | Les seaux sont une métaphore ; le compte $60\,000$ contre $64$ est dans le texte. |
| 9 | `b-d9-15` | `le-nuage-des-lots-se-contracte` | **Remplacer** | `l3-fig20-le-nuage-des-lots` | La figure montre les cinq paliers **en même temps** ; c'est la comparaison qui porte l'idée, pas le défilé. |
| 9 | `b-d9-16` | `le-lot-vise-de-travers` | **Remplacer** | `l3-fig21-langle-par-taille` | Même motif. |
| 10 | `b-d10-6` | `les-composantes-se-rangent` | **Remplacer** | `l3-fig22-composantes-rangees` | Un tri n'est pas une grandeur qui varie. |
| 10 | `b-d10-7` | `la-boussole-des-cent-mille` | **Supprimer** | rien | Cent mille boussoles ne se regardent pas, et le tableau `deux-informations` dit le signe et la taille. **Contient un cadratin** dans sa légende. |
| 11 | `b-d11-11` | `permuter-ne-change-rien` | **Remplacer** | `l3-fig25-permuter` | La figure porte les deux coûts mesurés côte à côte, ce que la scène ne fait pas. |
| 11 | `b-d11-16` | `trois-graines-trois-solutions` | **Remplacer** | `l3-fig26-trois-graines` | Une bascule de vue est un mouvement de caméra, pas une grandeur qui varie. |
| 12 | `b-d12-26` | `la-descente-en-un-geste` | **Supprimer** | `l3-fig27-le-trajet` | La spirale qui se resserre est exactement l'image que la page 7 a démontée, section « L'image de la bille, et où elle trompe ». La servir en synthèse contredit la page 7. |
| 12 | `b-d12-35` | `ce-que-le-chapitre-4-calcule` | **Remplacer** | `l3-fig28-deux-cent-mille-contre-un` | Deux pendules sont une métaphore d'un compte ; deux barres le donnent. |

**Compte.** Vingt-huit scènes : **neuf à supprimer**, **dix-huit à remplacer par
une figure fixe déjà produite**, **une à garder** sous condition de la réduire à
ce qui change vraiment. Le chapitre passerait donc de vingt-huit animations à
une, et de zéro figure fixe à vingt-huit.

**Ce que cela coûte en rendu.** Zéro. Aucune des vingt-huit scènes n'a jamais
été rendue — l'en-tête de l'export dit « Scènes rendues 0 sur 28 » — et les
vingt-huit figures fixes sont produites en un dixième de seconde depuis le
cache des mesures.

---

## 7. Les hauteurs des blocs image

Vingt-huit blocs `image`, tous larges de $1380$, tous servis en `w-full` dans
la colonne de $640$ px. La hauteur déclarée dans le bloc est celle du `viewBox`
du SVG : **les deux sont vérifiées égales**, et le contrôle se refait en une
commande, donnée au §10.

| Page | Bloc | Fichier | Hauteur |
|---|---|---|---|
| 1 | `b-d1-fig01` | `l3-fig01-le-reseau-sans-ses-nombres.svg` | 700 |
| 1 | `b-d1-fig02` | `l3-fig02-la-fleche-qui-manque.svg` | 560 |
| 2 | `b-d2-fig03` | `l3-fig03-deux-architectures.svg` | 560 |
| 2 | `b-d2-fig04` | `l3-fig04-deux-matrices.svg` | 620 |
| 3 | `b-d3-fig05` | `l3-fig05-deux-algorithmes.svg` | 620 |
| 3 | `b-d3-fig06` | `l3-fig06-argmin-trois-cas.svg` | 620 |
| 4 | `b-d4-fig07` | `l3-fig07-cinq-graines.svg` | 620 |
| 4 | `b-d4-fig08` | `l3-fig08-sortie-non-entrainee.svg` | 620 |
| 5 | `b-d5-fig09` | `l3-fig09-deux-couts.svg` | 660 |
| 5 | `b-d5-fig10` | `l3-fig10-pente-des-deux-couts.svg` | 660 |
| 6 | `b-d6-fig11` | `l3-fig11-le-reseau-est-une-fonction.svg` | 560 |
| 6 | `b-d6-fig12` | `l3-fig12-le-cout-est-une-fonction.svg` | 560 |
| 7 | `b-d7-fig13` | `l3-fig13-la-pente-sous-les-pieds.svg` | 680 |
| 7 | `b-d7-fig14` | `l3-fig14-escalier-et-courbe.svg` | 640 |
| 7 | `b-d7-fig15` | `l3-fig15-la-bille-et-la-descente.svg` | 680 |
| 8 | `b-d8-fig16` | `l3-fig16-cent-directions.svg` | 560 |
| 8 | `b-d8-fig17` | `l3-fig17-la-norme-du-gradient.svg` | 640 |
| 8 | `b-d8-fig18` | `l3-fig18-trois-taux.svg` | 680 |
| 8 | `b-d8-fig19` | `l3-fig19-la-difference-finie.svg` | 660 |
| 9 | `b-d9-fig20` | `l3-fig20-le-nuage-des-lots.svg` | 680 |
| 9 | `b-d9-fig21` | `l3-fig21-langle-par-taille.svg` | 620 |
| 10 | `b-d10-fig22` | `l3-fig22-composantes-rangees.svg` | 660 |
| 10 | `b-d10-fig23` | `l3-fig23-dou-viennent-les-zeros.svg` | 780 |
| 11 | `b-d11-fig24` | `l3-fig24-quatre-points.svg` | 620 |
| 11 | `b-d11-fig25` | `l3-fig25-permuter.svg` | 660 |
| 11 | `b-d11-fig26` | `l3-fig26-trois-graines.svg` | 660 |
| 12 | `b-d12-fig27` | `l3-fig27-le-trajet.svg` | 640 |
| 12 | `b-d12-fig28` | `l3-fig28-deux-cent-mille-contre-un.svg` | 560 |

**La seule hauteur qui sorte du lot est $780$**, pour la figure 23 : elle porte
deux grilles de $28\times 28$ cases à treize pixels, et les trois lignes
d'étiquettes qui les cotent. Réduire la case rendrait les pixels muets
illisibles ; c'est la hauteur qui cède.

**Aucune figure n'est plus haute que large** : à la largeur servie de 640 px, la
plus haute occupe $640\times 780/1380 = 362$ px de hauteur rendue.

---

## 8. Les retours de la passe de lecture

Onze pages sur douze ont été lues par un lecteur qui ne connaissait que ce qui
précède — les chapitres 1 et 2 par leurs exports, et le chapitre 3 jusqu'à sa
page. **La page 10 n'a pas été lue** : son lecteur s'est interrompu, et c'est le
seul trou de la passe.

Ce qui suit ne liste pas les corrections de style. Il liste les **fautes de
fait** que la lecture a trouvées, parce que chacune était invisible à `tsc`, au
vérificateur de contenu et aux deux cribles de figures.

### 8.1 Trois renvois au chapitre 1 qui n'y menaient nulle part

Les prérequis annonçaient, au chapitre 1, « la dérivée d'une fonction d'une
variable » et « la règle de mise à jour $\theta_{t+1}=\theta_{t}-\eta f'(\theta_{t})$
et l'analyse par cas qui justifie son signe ». Vérification faite : le chapitre 1
ne contient **aucune** occurrence du mot « dérivée », aucune de la règle, aucune
de « analyse par cas ». Il ne pose que $\eta$ et $t$, dans son tableau des
symboles, et il renvoie explicitement la descente au chapitre 3.

La page 7 disait en conséquence « on reprend cet argument » d'un argument jamais
lu, et la vérification 26 envoyait le lecteur chercher « la table du chapitre 1 »,
qui n'existe pas. **Corrigé** : les prérequis disent ce que le chapitre 1 donne
vraiment, la page 7 pose la règle $(7.1)$ comme une première, et la vérification
26 ne renvoie plus à rien.

### 8.2 Le gradient était employé une page avant sa définition

La proposition 1, page 7, s'écrivait avec $\partial E/\partial\theta_{i}$, avec
$\mathbf{e}_{i}$ et avec $\mathrm{grad}_{\boldsymbol{\theta}}E$ — trois objets
que la page 8 définit. La page 7 promettait pourtant, dans son deuxième
paragraphe, que « tout ce qui suit se voit en dimension $1$ ».

**Corrigé, et c'est la reprise la plus lourde de la passe** : la proposition 1
est réécrite **en dimension un**, sur un seul paramètre, avec $E'(\theta)$ et
rien d'autre. Son interprétation dit que l'argument ne doit rien à la dimension,
et la page 8 le transporte une fois le gradient défini. Aucun nombre n'a bougé :
$60\,001$ valeurs, $N=60\,000$.

### 8.3 La proposition 2 était invoquée hors de son domaine

Énoncée et démontrée en dimension un page 7, elle était appliquée page 8 à
$\boldsymbol{\theta}\in\mathbb{R}^{101\,770}$ sans un mot. **Corrigé** : la
page 8 dit ce que l'extension demande, et que le développement au premier ordre
en plusieurs variables est l'un des deux outils que la proposition 3 emprunte
déjà au cours d'optimisation.

### 8.4 La proposition 3 concluait sur la décroissance en ne majorant que la croissance

L'inégalité écrite majore $D_{\mathbf{u}}C$ par $\|\mathrm{grad}\|$ ; la légende
en tirait la direction de plus forte **décroissance**, ce qui demande un second
pas, appliquer l'inégalité à $-\mathbf{u}$. Ce pas justifie le signe moins de
tout l'algorithme et il n'était pas écrit. **Corrigé**, avec en outre la
condition $\mathrm{grad}\neq\mathbf{0}$, sans laquelle l'unicité de la direction
tombe.

### 8.5 La colonne mesurée n'était pas la quantité que la proposition 5 prédit

Page 9, le texte disait « la dernière colonne est celle que la proposition 5
prédit constante ». La proposition porte sur $\mathbb{E}[\cos^{2}]$ ; le
programme calcule $B(1/\overline{\cos}^{2}-1)$, à partir du cosinus **moyen**.
Les deux ne coïncident que si la dispersion est petite.

Recalculé sur les colonnes déjà imprimées, $\mathbb{E}[\cos^{2}]=\overline{\cos}^{2}+s^{2}$
donne $19{,}9$ · $42{,}8$ · $46{,}5$ · $45{,}9$ · $42{,}1$ au lieu de
$123{,}1$ · $50{,}5$ · $47{,}2$ · $45{,}9$ · $42{,}0$. **L'anomalie de $B=1$
n'est donc pas une rupture de la loi : c'est la rupture de la substitution.**
Le texte le dit maintenant, et c'est une meilleure explication que celle qu'il
donnait. Aucun nombre mesuré n'a changé ; les deux valeurs recalculées sont de
l'arithmétique sur des nombres déjà publiés.

### 8.6 Deux nombres dérivés étaient faux, et un troisième arrondi trop loin

- Page 2, l'écart entre les deux architectures était annoncé « quatre-vingt-sept
  mille nombres » et « trois points et demi ». $101\,770-13\,002=88\,768$ et
  $0{,}9814-0{,}9437=0{,}0377$. **Corrigé** en $88\,768$ et $3{,}77$ points.
- Page 12, les trois graines étaient dites « toutes trois à $98{,}2\,\%$ ».
  $0{,}9814$ s'arrondit à $98{,}1\,\%$, et l'arrondi effaçait l'écart de neuf
  erreurs que la page 11 met en avant. **Corrigé** : les trois valeurs exactes.
- Page 12, $\kappa$ était donné « Mesuré : $\approx 45$ », nombre qui n'apparaît
  nulle part dans le chapitre, et la vérification 30 demande de l'interpoler
  « d'après la valeur de $\kappa$ lue dans la table ». **Corrigé** : « entre
  $42{,}0$ et $50{,}5$ », ce que la page 9 mesure.

### 8.7 Les vérifications 1 à 7 n'existent pas

La page 12 annonçait « les numéros $1$ à $7$ sont au chapitre 1 ». L'en-tête de
l'export du chapitre 1 dit « Vérifications 🧪 aucune », et son récapitulatif
porte un tableau vide. **Corrigé** : la phrase ne parle plus que des numéros
$8$ à $20$, qui sont bien au chapitre 2.

### 8.8 Le chapitre 2 laisse trois dettes, et non six

Le tableau de la page 1 annonçait « six questions ouvertes ». Le chapitre 2 en
nomme **cinq**, dont deux vont ailleurs — la forme de la sigmoïde aux fondements
probabilistes, la géométrie de la grille aux réseaux convolutifs. Les trois
autres lignes du tableau ($\sigma'\leq 1/4$, les lots de $64$, $\eta$) ne sont
pas des dettes nommées : ce sont des **réglages employés sans justification**.
**Corrigé** : le tableau distingue les deux, et le texte dit où vont les deux
dettes qui ne sont pas d'ici.

### 8.9 La page 2 contredisait le chapitre 2 sur la confiance

Elle écrivait « le plus actif des dix est la réponse du réseau, et sa valeur est
la confiance qu'il y accorde ». Le chapitre 2 écrit exactement l'inverse, deux
fois : « La sortie $\mathbf{a}\in\Delta^{\circ}_{9}$ ressemble à une confiance et
n'en est pas une », et dans son formulaire « ce n'est pas une confiance, voir
page 11 ». **Corrigé**, et la page renvoie à la page 11 du chapitre 2.

### 8.10 Quatre termes arrivaient avant leur définition

Tous **corrigés**, en posant le terme là où il sert :

| Terme | Où il arrivait | Ce qui a été fait |
|---|---|---|
| « perte non convexe » | page 2, définie page 7 | La page 2 dit ce que $\mathrm{ReLU}$ fait perdre, sans le mot |
| $z$, « préactivation », « sensibilité » | page 5, jamais définis | Trois phrases les posent avant la table, et disent pourquoi on juge un coût sur $\partial C/\partial z$ et non sur un poids |
| « sans biais » | page 9, titre de la proposition 4 | Une phrase le définit, et dit qu'il n'a rien à voir avec les biais $\mathbf{b}^{[l]}$ |
| « distance relative » | page 11, employée avant la colonne qui la définit | Posée en tête de page, avec la condition de même norme qui la rend lisible |

S'y ajoutent $\mathbb{P}$, le dénombrement, « centré » et la variance d'une
moyenne, tous employés page 9 hors de la boîte à outils que la page annonçait :
la boîte en compte désormais quatre au lieu de trois, et nomme l'emprunt que la
proposition 5 fait au chapitre de probabilités.

### 8.11 Deux trous dans les démonstrations

- Proposition 2, le passage de $o(s)$ à $o(\eta)$ était présenté comme une
  substitution. C'en est une seulement parce que $s$ et $\eta$ sont
  proportionnels à $C'(\theta_{t})$ fixé et non nul. **Écrit.** Et $\eta_{0}$,
  proclamé existant, est maintenant **construit** : la définition de $o(\eta)$
  appliquée au seuil $C'(\theta_{t})^{2}/2$.
- Proposition 5, l'étape qui menait de $\mathbb{E}\|\mathbf{g}_{\mathcal{B}}-\mathbf{g}\|^{2}=\sigma^{2}/B$
  au carré du cosinus tenait en un « donc » sans formule. **Les deux identités
  en espérance sont écrites**, et l'approximation est nommée à l'endroit exact
  où elle est faite.
- Proposition 6, le choix de $P_{\pi}$ à gauche et $P_{\pi}^{\mathsf{T}}$ à
  droite était justifié par un contrôle de dimensions que l'écriture fausse
  passe aussi bien. **La vraie raison est écrite**, ainsi que la convention
  $(P_{\pi}\mathbf{u})_{i}=u_{\pi(i)}$ sans laquelle la commutation avec
  $\mathrm{ReLU}$ ne s'écrit pas. Et le compte $128!$ est désormais présenté
  comme un **majorant** : la proposition ne démontre pas que les $128!$ points
  sont distincts.

### 8.12 Ce que la lecture a validé

Il faut le dire aussi. Le lecteur de la page 8 écrit, sur la proposition 3
admise : « je ne me sens pas floué, et je tiens à le dire nettement », parce que
l'encart nomme les deux outils manquants, dit à quel cours ils appartiennent, et
que la vérification numérique sur cent directions arrive immédiatement après.
Le lecteur de la page 9 valide les deux annonces de section, celui de la page 7
la phrase « les activations varient continûment pour que le coût soit lisse, et
pour aucune autre raison », celui de la page 4 le contrôle que la mesure 1
constitue.

### 8.13 Le second tour, et la page 10 enfin lue

Après les corrections du §8, deux lectures de plus ont été faites : la page 10,
que le premier tour n'avait pas pu lire, et un **second tour sur la page 7**,
celle qui avait le plus changé.

**Le second tour de la page 7 valide les quatre reprises lourdes.** Le lecteur a
passé les trois cent quarante lignes au filtre : zéro occurrence de « gradient »,
de dérivée partielle, de vecteur de base ; le renvoi au chapitre 1 est cité mot
pour mot et vérifié ; le passage de $o(s)$ à $o(\eta)$ et la construction de
$\eta_{0}$ se refont seuls. Il restait huit reprises, toutes faites :

| Ce qu'il a trouvé | Ce qui a été fait |
|---|---|
| $E(\theta)$ défini par une formule où $\theta$ n'apparaît pas : $f$ au lieu de $f_{\boldsymbol{\theta}}$ | Corrigé |
| $\widehat{c}$ jamais rappelée, et **non définie sur les ex æquo** au chapitre 2 — or les sauts de l'escalier SONT les ex æquo | L'étape 4 dit maintenant qu'en ces points $E$ n'est pas définie du tout, et pourquoi. C'était le dernier trou de la démonstration |
| « Les $101\,770$ autres sont gelés » : il en reste $101\,769$ | Corrigé |
| « fausse sur deux points précis », suivi de trois lignes de tableau | Corrigé |
| Quinze mots repris à l'identique de part et d'autre de la coupure page 6 / page 7 | Ouverture de la page 7 réécrite |
| L'encadré « Ce que le résultat ne dit pas » s'ouvrait sur « Ce que la proposition ne dit pas » | Corrigé |
| « pour tout $\eta<\eta_{0}$ » sans $\eta>0$ | Corrigé |
| Le cas $C'(\theta_{t})=0$ traité dans une démonstration qui l'exclut par hypothèse | Corrigé |

Deux de ses remarques n'ont **pas** été suivies, et il faut dire pourquoi :

- Il propose de placer la section 7.5, sur le passage à deux variables,
  **avant** la 7.4 sur l'image de la bille, parce que le tableau de 7.4 parlait
  déjà de « surface » et de $\mathbb{R}^{101\,770}$. Le tableau a été réécrit
  pour ne plus employer ces mots plutôt que de déplacer la section : 7.5 est le
  pont vers la page 8, et c'est sa place.
- Il relève `\varepsilon` non rendu quatre fois dans l'export. C'est la table de
  translittération de l'exporteur, §9.7, et non le contenu.

**La page 10 a été lue, et elle portait une contradiction interne.** Le texte
disait, en tête, que $\boldsymbol{\theta}$ et son gradient « vivent dans le même
espace », et la légende du dernier tableau, quarante lignes plus bas, qu'« aucun
des trois ne vit dans l'espace des deux autres ». Le tableau lui-même donnait
raison au premier. La légende est corrigée : les deux derniers étages partent du
même espace, et c'est leur **arrivée** qui les sépare.

| Ce qu'il a trouvé | Ce qui a été fait |
|---|---|
| « deux choses à lire dans une composante », suivi d'un tableau à trois lignes | Corrigé en trois |
| La section 10.2 s'ouvrait sur un axiome sans justification : « un coefficient a un gradient nul quand, pour chaque image, ou bien le pixel est blanc, ou bien le neurone est éteint » | Le **produit de deux facteurs** est écrit, et la dette de son calcul renvoyée au chapitre 4 à l'endroit où elle se contracte |
| « plusieurs ordres de grandeur » pour un rapport de $404$ | « deux ordres de grandeur et demi » |
| $23{,}5\,\%$ sur $101\,770$ et $23\,882$ zéros dans $W^{[1]}$ qui en compte $100\,352$ : deux dénominateurs, aucun signalé | Les deux sont donnés, avec leur base |
| Le titre « Trois couches de complexité » voisinait un encart parlant de « traverser quatre couches » du réseau | Le titre ne dit plus « couche » |
| « quatre couches » sortait de nulle part, sur un réseau qui n'en a qu'une cachée, et le lecteur a cru que le rapport $404$ s'en expliquait | L'encart dit que le réseau du chapitre n'en souffre guère, que l'effet est un **empilement**, et qu'il n'a rien à voir avec le $404$, qui vaut à l'intérieur d'une couche |
| « que tous les paramètres bougent d'autant » : d'autant que quoi ? | « autant les uns que les autres », et la question demande en plus ce qu'on perdrait |

**Une promesse du chapitre reste non tenue, et elle est signalée ici plutôt que
corrigée.** Le tableau des dettes de la page 1 annonce que $\sigma'\leq 1/4$ se
règle page 10 « par la lecture des composantes du gradient **couche par
couche** ». La page 10 ne lit jamais les composantes par couche : la mesure 4
est globale sur les $101\,770$, et la mesure 10 ne donne par bloc que des
**comptes de zéros**, pas des amplitudes. Y remédier demanderait une mesure que
`cours/lecon3/mesures.py` ne produit pas, et ce fichier est hors du périmètre de
cette passe. **Deux issues pour la fusion** : ajouter à `mesures.py` une mesure
de la norme du gradient par bloc — c'est trois lignes, et elle rendrait la page
bien plus forte — ou corriger la colonne « Comment » du tableau de la page 1
pour qu'elle décrive ce que la page fait vraiment.

---


---

## 9. Ce qui reste à faire hors du périmètre de cette passe

### 9.1 `sommaires.ts` — c'est fait, à trois résumés près

**Le §1 de ce document a été appliqué entre-temps**, par une autre main que
celle de cette passe. `sommaires.ts` porte aujourd'hui le chapitre `ch-ml-3` et
les douze leçons `l-desc-1` à `l-desc-12`, **sans** champ `minutes` — ce que le
retour n°24 de `RETOURS.md` demandait, et que le §1.2 de ce document
prescrivait pourtant : les douze `minutes: N` qu'il donne feraient échouer la
compilation. Les résumés retenus ne sont pas non plus ceux du §1.2 ; **ce sont
ceux de `sommaires.ts` qui font foi**, et le §1.2 est donc à lire comme une
proposition dépassée.

**Trois de ces résumés donnent la réponse avant la question.** L'export les
imprime juste au-dessus de la question d'ouverture de la page, et le lecteur les
reçoit donc en premier : la question qui suit ne lui fait plus rien. Les trois
lecteurs concernés l'ont relevé chacun de leur côté.

| Leçon | Résumé actuel | Ce qu'il devrait dire |
|---|---|---|
| `l-desc-3` | « On n'écrit pas l'algorithme qui reconnaît un chiffre, on écrit celui qui le règle. » | « Ce qu'on demande à la machine, écrit en objets déjà définis. » — l'actuel est la réponse à la question d'ouverture, mot pour mot |
| `l-desc-4` | « Ce que vaut le réseau avant la première mise à jour, mesuré plutôt que supposé. » | « Ce que vaut le réseau avant la première mise à jour. » — « mesuré plutôt que supposé » parle de la méthode du cours, pas du réseau |
| `l-desc-11` | « Trois entraînements, trois solutions sans rapport : il n'y a pas un seul bon jeu de réglages. » | « Ce que la descente atteint, et ce que vaut la largeur de la couche cachée. » — l'actuel sert la conclusion de la section 11.3 avant la page, et il confond les **paramètres** θ avec les **réglages** η, B et h, dont la page montre justement que h a un effet monotone |

### 9.1 bis Le `undefined min` de chaque en-tête de page

L'export imprime « undefined min » alors que les douze entrées existent bien.
La durée vient de `domaine/duree.ts`, qui compte les mots, les vérifications et
**la durée des animations rendues**. Aucune des vingt-huit scènes n'étant au
manifeste (§9.6), aucune durée d'animation n'est résoluble, et le calcul rend
`undefined`. Régénérer le manifeste fait tomber celui-là aussi.

### 9.2 `cours/figures/CORRESPONDANCE.md` — les dix lignes du chapitre 3

Le tableau « Chapitre 2 de la source · notre chapitre 3 » porte dix lignes dont
la colonne « identifiant » vaut `—` et la colonne « où » aussi. Les voici :

| la source | notre figure | identifiant | où |
|---|---|---|---|
| un réseau initialisé au hasard, sortie quelconque | nos cinq coûts initiaux mesurés, et le repère du hasard | `l3-fig07-cinq-graines` | ch. 3, p. 4 |
| le coût d'un exemple, somme des carrés | nos deux coûts sur quatre sorties, et le rapport ×450,5 des deux pentes | `l3-fig09-deux-couts`, `l3-fig10-pente-des-deux-couts` | ch. 3, p. 5 |
| le réseau comme fonction : 784 entrées, 10 sorties, p paramètres | la même figure | `l3-fig11-le-reseau-est-une-fonction` | ch. 3, p. 6 |
| le coût comme fonction : p entrées, une sortie | la même figure, jumelle de la précédente | `l3-fig12-le-cout-est-une-fonction` | ch. 3, p. 6 |
| une fonction d'une variable et son minimum | la pente lue en deux points, et le sens qu'elle donne | `l3-fig13-la-pente-sous-les-pieds` | ch. 3, p. 7 |
| la bille qui roule le long d'une courbe | la même figure, et sa limite : la bille franchit le premier creux, la descente non | `l3-fig15-la-bille-et-la-descente` | ch. 3, p. 7 |
| plusieurs vallées | nos trois graines, leurs trois précisions, et les angles mesurés deux à deux | `l3-fig26-trois-graines` | ch. 3, p. 11 |
| des pas qui rétrécissent près du minimum | notre norme de gradient sur trente époques, divisée par 105 | `l3-fig17-la-norme-du-gradient` | ch. 3, p. 8 |
| une surface au-dessus d'un plan, et la direction de descente | nos cent directions tirées au hasard, et celle du gradient | `l3-fig16-cent-directions` | ch. 3, p. 8 |
| le vecteur gradient, ses composantes, leurs signes et leurs tailles | nos 101 770 composantes cumulées, et l'origine des 23 882 zéros | `l3-fig22-composantes-rangees`, `l3-fig23-dou-viennent-les-zeros` | ch. 3, p. 10 |

Dix lignes, treize figures. Les quinze autres figures du chapitre ne répondent à
aucune ligne de l'inventaire de la source : elles servent les cinq écarts
délibérés et les pages que la source ne traite pas.

### 9.3 `outils/verifier-figures.mjs` — la liste des chapitres

Ligne 47 : `const CHAPITRES = ['lecon1', 'lecon2'];`. Le chapitre 3 a désormais
vingt-huit SVG et il passe le crible, mais seulement si on le nomme :
`node outils/verifier-figures.mjs lecon3`. Ajouter `'lecon3'` à la liste pour
qu'il entre dans le contrôle par défaut.

### 9.4 `outils/verifier-recouvrements.mjs` — un commentaire devenu faux

Son en-tête dit : « LECON 3 N'A PAS DE SVG : ses quatre figures sont des courbes
échantillonnées, rendues en PNG par matplotlib dans cours/figures/. Un crible
qui lit du XML n'a rien à y voir ». Ce n'est plus vrai. `lecon3` est déjà dans
sa constante `CHAPITRES` et le chapitre passe le crible ; seul le commentaire
est à reprendre.

### 9.5 `public/cours/lecon3/` — quatre PNG qu'il ne faut PAS supprimer

`cours/lecon3/figures.py` ne produit plus les quatre PNG, et aucune page du
chapitre 3 ne les sert. **Ils sont pourtant encore servis**, par l'autre
chapitre 3 :

```
contenu/optimisation.ts:284        /cours/lecon3/l3-fig1-direction.png
contenu/optimisation.ts:447        /cours/lecon3/l3-fig2-lots.png
contenu/optimisation-suite.ts:154  /cours/lecon3/l3-fig3-pas.png
contenu/optimisation-suite.ts:383  /cours/lecon3/l3-fig4-initialisation.png
```

C'est le conflit de numérotation du §1.1, vu par le côté des fichiers : les
supprimer casserait quatre blocs image de `ch-ml-3` « L'optimisation de
l'entraînement ». Ils sont donc **laissés en place**, et leur sort se décide en
même temps que celui du chapitre qui les sert. Les quatre mêmes images vivent
aussi dans `cours/figures/`, et ne sont plus produites non plus.

### 9.6 `public/animations/manifeste.json` — la seule cause des fautes du vérificateur

`node outils/verifier-contenu.mjs` relève **71 fautes**, toutes de la même forme
et réparties sur trois chapitres : `calcul` 23, `descente` 28, `retropropagation`
20, toutes « animation absente du manifeste ». Aucune ne vise une référence de
figure, une ancre ou un bloc : le chapitre 3 n'en a **aucune** d'un autre genre.

Le manifeste est un fichier **partagé**, et trois chapitres sont écrits en
parallèle en ce moment. Il n'a donc pas été régénéré ici. Une seule exécution de
`python animations/manifeste.py`, après les cinq chapitres, les efface toutes.

### 9.7 `outils/exporter-chapitre.mjs` — deux symboles non translittérés

L'export imprime `\kappa` et `B\ll N` en clair, dans le corps du texte : la
table de translittération LaTeX vers Unicode du moteur d'export ne porte ni
`\kappa` ni `\ll`. `\eta`, `\sigma` et `\theta` y sont. Deux lignes à ajouter.

L'export imprime aussi `undefined min` dans l'en-tête de chaque page, faute des
entrées `l-desc-*` dans `sommaires.ts` : le §9.1 le règle.

---

## 10. État de la validation, au 20 septembre 2026

```
npx tsc --noEmit                              exit 0
node outils/verifier-figures.mjs lecon3       exit 0
    28 figures, 288 textes · taille minimale 33, 40 caracteres au plus
node outils/verifier-recouvrements.mjs lecon3 exit 0
    28 figures, 288 textes · aucun recouvrement
python cours/lecon3/figures.py                28 figures, 12 pages
node outils/exporter-chapitre.mjs …           3 696 lignes, 28 animations,
                                              14 verifications
node outils/verifier-contenu.mjs              71 fautes, toutes « absente du
                                              manifeste », sur trois chapitres
                                              — voir §9.6
```

Quatre contrôles propres à cette passe, tous à zéro, et refaisables en une
vingtaine de lignes de Python chacun :

- **aucun cadratin dans le texte servi**, hors les deux légendes d'animation
  citées au §6 ;
- **aucune suite de trois phrases de moins de huit mots**, le garde-fou
  mécanique de la règle 4 ;
- **aucune séquence d'échappement simple** dans un littéral TypeScript : un
  `$\eta$` écrit avec un seul antislash rend `$eta$`, et ni `tsc` ni le
  vérificateur de contenu ne le voient ;
- **hauteur déclarée égale à la hauteur du `viewBox`**, pour les vingt-huit
  blocs image. Le tableau du §7 est écrit par ce contrôle, pas à la main.

Un cinquième contrôle est **entré dans le programme** plutôt que de rester à
côté : `cours/lecon3/figures.py` analyse désormais chaque SVG avant de
l'écrire. Il a attrapé trois figures qui sortaient cassées — `o += ` appliqué à
une fonction qui rend une chaîne éclate la liste caractère par caractère — sans
que le poids du fichier, les deux cribles ni `tsc` ne signalent quoi que ce
soit. Seul le navigateur montrait une image cassée.

**Ce qui n'a pas été fait, et qui reste ouvert :**

- Les **deux cadratins** des légendes de `les-donnees-sont-un-parametre` et de
  `la-boussole-des-cent-mille` restent, la consigne interdisant de toucher aux
  blocs animation. Les deux scènes sont à supprimer de toute façon (§6).
- La promesse « par la lecture des composantes du gradient **couche par
  couche** » du tableau des dettes n'est pas tenue par la page 10, et la tenir
  demande une mesure que `mesures.py` ne produit pas. Voir §8.13.
- Un **troisième tour** de lecture n'a pas été fait. Le second n'a porté que
  sur la page 7 ; les pages 1 à 6 et 8 à 12 n'ont été relues qu'une fois,
  après corrections.

### Ce qui a vieilli dans la première partie de ce document

- §1 : **appliqué entre-temps**, et les `minutes: N` qu'il prescrit auraient
  fait échouer la compilation. Voir §9.1.
- §5, « État de la validation, au moment de la livraison » : remplacé par ce
  §10.
- §4, « Relevé de couverture de la source » : les identifiants de blocs y sont
  ceux d'avant cette passe. Les pages ont gagné vingt-huit blocs image, la
  page 7 a vu son dernier bloc déplacé, et plusieurs pages ont gagné un bloc
  de définition. Le relevé reste juste sur les **pages**, plus toujours sur les
  **identifiants**.
- §4, section « Le contrôle croisé avec le chapitre 2 » : les dix blocs
  `b-d11-23` à `b-d11-33` sont devenus un tableau, un encart et la
  vérification 34, et le bloc « Ce que cette règle interdit d'écrire » a été
  retiré comme auto-référence. L'idée est conservée, son développement non.
