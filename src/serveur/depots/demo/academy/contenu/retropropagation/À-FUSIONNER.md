# Chapitre 4 — ce qui reste à fusionner

Ce fichier liste **tout ce qui devait être écrit hors des trois répertoires
autorisés**, et qui ne l'a donc pas été. Chaque entrée donne le fichier, la
ligne approximative, et le texte exact à insérer.

Répertoires écrits par cet agent, et eux seuls :

```
src/serveur/depots/demo/academy/contenu/retropropagation/
cours/lecon4/mesures.py
animations/scenes/retropropagation/
```

Un seul fichier a été touché en dehors : `public/animations/manifeste.json`,
régénéré localement pour que `verifier-contenu.mjs` puisse résoudre les
identifiants d'animations. **Il n'a pas pu être rendu à son état d'arrivée, et
le §6 dit pourquoi et ce que la fusion doit en faire.**

---

## 1. `src/serveur/depots/demo/academy/sommaires.ts`

### 1.1 Le chapitre — dans `CHAPITRES`, après `ch-ml-3`

**Le rang dépend d'une décision de fusion.** Le chapitre 3 livré par l'agent
voisin signale déjà un conflit de numérotation entre l'ancien `ch-ml-3`
« L'optimisation de l'entraînement » et le nouveau « La descente de gradient ».
Le chapitre 4 se place **après le chapitre de la descente de gradient**, quel
que soit le numéro que la fusion lui donne. Sous cette réserve :

```ts
  {
    id: "ch-ml-4",
    slug: "ce-que-fait-la-retropropagation",
    titre: "Ce que fait la rétropropagation",
    resume:
      "Suivre un exemple, lire ce que sa sortie réclame, et le reporter en arrière — sans écrire encore la forme générale.",
    coursId: "c-intro-ml",
    rang: 4,
  },
```

### 1.2 Les douze leçons — dans `LECONS`, à la suite des entrées de `ch-ml-3`

```ts
  // ── Chapitre 4 · Ce que fait la rétropropagation ──────────────────────────
  //
  // Les douze pages du chapitre. Toutes publiées : le contenu existe, il est
  // vérifié, et chaque nombre qu'il cite sort de cours/lecon4/mesures.py.
  // Les durées sont une estimation de lecture.
  {
    id: "l-retro-1",
    slug: "le-cadre-de-la-retropropagation",
    titre: "Le cadre du cours",
    resume: "Une dette réglée, deux contractées, et le plan des onze pages.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 1,
    genre: "lecture",
    minutes: 8,
    statut: "publie",
    libre: true,
  },
  {
    id: "l-retro-2",
    slug: "ce-quon-cherche-et-ce-quon-ne-sait-pas-calculer",
    titre: "Ce qu'on cherche, et ce qu'on ne sait pas encore calculer",
    resume: "203 540 propagations avant pour un gradient, et il en faut une.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 2,
    genre: "lecture",
    minutes: 10,
    statut: "publie",
  },
  {
    id: "l-retro-3",
    slug: "ce-que-la-sortie-reclame",
    titre: "Un seul exemple, et ce que sa sortie réclame",
    resume: "Une seule composante négative, et elle pèse autant que les neuf autres.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 3,
    genre: "demo",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-retro-4",
    slug: "la-premiere-voie-le-biais",
    titre: "La première voie : le biais",
    resume: "La seule dérivée du chapitre qui ne dépende d'aucune activation.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 4,
    genre: "lecture",
    minutes: 14,
    statut: "publie",
  },
  {
    id: "l-retro-5",
    slug: "la-deuxieme-voie-les-poids",
    titre: "La deuxième voie : les poids",
    resume: "La proportionnalité à l'activation est une identité, pas une heuristique.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 5,
    genre: "demo",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-retro-6",
    slug: "ce-que-hebb-dit-et-ce-quil-ne-dit-pas",
    titre: "Ce que Hebb dit, et ce qu'il ne dit pas",
    resume: "Les dix liaisons qui se renforcent le plus, et les deux limites de l'analogie.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 6,
    genre: "lecture",
    minutes: 14,
    statut: "publie",
  },
  {
    id: "l-retro-7",
    slug: "la-troisieme-voie-les-activations",
    titre: "La troisième voie : les activations",
    resume: "Une correction qu'on ne peut pas appliquer, et d'où vient le mot propagation.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 7,
    genre: "lecture",
    minutes: 16,
    statut: "publie",
  },
  {
    id: "l-retro-8",
    slug: "dix-demandes-une-somme",
    titre: "Dix demandes, une somme",
    resume: "La transposée n'est pas une astuce d'écriture : c'est la redistribution.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 8,
    genre: "demo",
    minutes: 20,
    statut: "publie",
  },
  {
    id: "l-retro-9",
    slug: "remonter-dune-couche",
    titre: "Remonter d'une couche",
    resume: "La porte ReLU, et 89 636 coefficients nuls prédits avant d'être comptés.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 9,
    genre: "demo",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-retro-10",
    slug: "un-exemple-ne-suffit-pas",
    titre: "Un exemple ne suffit pas",
    resume: "10 000 images de test classées « 2 », et une précision égale à une fréquence.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 10,
    genre: "demo",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-retro-11",
    slug: "lalgorithme-et-sa-verification",
    titre: "L'algorithme, et sa vérification",
    resume: "Six lignes, 1 050 nombres gardés, et un écart de 7,0 · 10⁻⁹.",
    chapitreId: "ch-ml-4",
    coursId: "c-intro-ml",
    rang: 11,
    genre: "demo",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-retro-12",
    slug: "la-retropropagation-synthese",
    titre: "Synthèse, formulaire et erreurs fréquentes",
    resume: "Le trajet en un paragraphe, puis ce qu'il faut garder sous la main.",
    chapitreId: "ch-ml-4",
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
import { CONTENU_RETROPROPAGATION } from "./contenu/retropropagation";
```

**Ligne ~41**, dans la constante `CONTENU` :

```ts
const CONTENU: Record<string, Bloc[]> = {
  ...CONTENU_PANORAMA,
  ...CONTENU_OPTIMISATION,
  ...CONTENU_OPTIMISATION_SUITE,
  ...CONTENU_RETROPROPAGATION,   // <- la ligne à ajouter
};
```

L'agrégateur `contenu/retropropagation/index.ts` existe et exporte
`CONTENU_RETROPROPAGATION`, un `Record<string, Bloc[]>` de douze entrées,
`l-retro-1` à `l-retro-12`. Il est **propre au chapitre 4** ; seul l'import
ci-dessus est partagé.

---

## 3. Relevé de couverture de la source

Chaque ligne de la table de contrôle de la consigne, avec la page où elle est
traitée et l'identifiant du bloc qui la traite.

| Notion de la source | Page | Bloc(s) |
|---|---|---|
| rappel : l'architecture, le coût, la descente | 2 | `b-rp2-3` |
| rappel : le coût d'un exemple, et l'écart du cours sur la fonction de coût | 2 | `b-rp2-4` |
| la rétropropagation est l'algorithme qui calcule ce gradient | 2 | `b-rp2-16` |
| penser un vecteur de cette dimension comme une direction dépasse l'imagination | 2 | `b-rp2-11` — la source dit 13 002, le cours dit **101 770**, la taille de son propre réseau |
| la taille d'une composante dit la sensibilité du coût à ce poids | 2 | `b-rp2-12` — **renvoi** ch. 3, mesure 4 |
| l'exemple 3,2 contre 0,1, remplacé par la mesure réelle du parcours | 2 | `b-rp2-13` — rapport 404 |
| ce qui embrouille d'abord, c'est la notation et la chasse aux indices | 3 | `b-rp3-1` |
| commencer sans notation, par l'effet d'un exemple | 2, 3 | `b-rp2-17`, `b-rp3-1` |
| un seul exemple, une image | 3 | `b-rp3-3`, `b-rp3-4` |
| les activations d'un réseau non entraîné sont à peu près quelconques | 3 | `b-rp3-4`, lecture — **et la nuance : elle tombe juste par hasard** |
| on ne contrôle que les poids et les biais | 3, 7 | `b-rp3-24`, `b-rp7-8` |
| on note ce qu'on souhaite voir arriver en sortie | 3 | `b-rp3-7`, `b-rp3-9`, `b-rp3-17` |
| le neurone de la bonne classe doit monter, les neuf autres descendre | 3 | `b-rp3-16` — **proposition 1** |
| les corrections sont proportionnelles à l'écart | 3 | `b-rp3-20` — **proposition 2** |
| trois voies pour augmenter une activation | 4 | `b-rp4-3`, `b-rp4-4`, `b-rp4-5` |
| le biais est la voie la plus simple, son effet est constant | 4 | `b-rp4-8` — **proposition 3** |
| question : dans quel sens pousser le biais du neurone de la classe | 4 | `b-rp4-11` — 🧪 n°36 |
| les poids n'ont pas la même influence, ils multiplient des activations | 5 | `b-rp5-6` — **proposition 4** |
| les connexions aux neurones les plus actifs ont le plus d'effet | 5 | `b-rp5-9` — rapport **228,6** mesuré |
| le meilleur rendement, et non seulement le sens | 5 | `b-rp5-6`, limites — **renvoi** ch. 3, page 8 |
| ajuster les poids proportionnellement aux activations associées | 5 | `b-rp5-6` interprétation, `b-rp5-9` |
| la théorie de Hebb | 6 | `b-rp6-3` à `b-rp6-6` |
| l'analogie est imparfaite ; c'est l'étiquette qui encode la réponse | 6 | `b-rp6-13`, `b-rp6-14` |
| troisième voie : rendre plus vifs les neurones liés par un poids positif | 7 | `b-rp7-3` — **proposition 5** |
| changements proportionnels à la taille des poids | 7 | `b-rp7-3` interprétation, `b-rp7-4` |
| on ne peut pas influencer ces activations directement | 7 | `b-rp7-7`, `b-rp7-8`, `b-rp7-9` |
| les dix neurones de sortie ont chacun leur demande | 8 | `b-rp8-3`, `b-rp8-6` — **proposition 6** |
| on ne peut pas les satisfaire toutes ; on additionne | 8 | `b-rp8-9`, `b-rp8-10` |
| de là vient la propagation vers l'arrière | 7, 9 | `b-rp7-11` (le mot), `b-rp9-4`, `b-rp9-6` (la récursion) |
| on recommence récursivement en remontant | 9 | `b-rp9-20` — forme générale **en dette** vers le ch. 5 |
| si l'on n'écoutait que ce 2, le réseau classerait tout en 2 | 10 | `b-rp10-4` — **100,00 % mesuré** |
| on refait le même parcours pour chaque exemple, et on moyenne | 10 | `b-rp10-7`, `b-rp10-8` |
| la collection de ces moyennes est « en gros » le gradient négatif | 10 | `b-rp10-8`, `b-rp10-9` — **réserve levée**, proposition 7 |
| les mini-lots, et la descente stochastique | 10 | `b-rp10-14` — **renvoi** ch. 3, propositions 4 et 5 |
| l'ivrogne qui dévale la pente contre le calculateur méthodique | 10 | `b-rp10-15` — l'image **et ses limites** |
| chaque ligne du code correspond à quelque chose de vu | 11 | `b-rp11-7`, `b-rp11-8` |
| la suite : les mêmes idées en termes de calcul | 12 | `b-rp12-18` |

**Aucune ligne sans destination.**

### Les trois notions du chapitre 3 : citées, jamais réexposées

| Notion | Où elle est citée | Ce qui n'est PAS refait |
|---|---|---|
| Mini-lots et descente stochastique | `b-rp10-14`, trois lignes | Les propositions 4 et 5 du chapitre 3 (estimateur sans biais, qualité en racine de la taille) |
| Taille relative des composantes du gradient | `b-rp2-13`, rapport 404 | La mesure 4 du chapitre 3, page 10 |
| Coût des différences finies | `b-rp2-7`, point de départ de la page | Le chiffrage du chapitre 3, mesure 9 |

### Les quatre écarts délibérés

| Écart | Page | Bloc |
|---|---|---|
| 1. Entropie croisée au lieu du coût quadratique de la source | 2 | `b-rp2-4` |
| 2. La réserve « en gros le gradient, ou du moins proportionnel » est levée | 10 | `b-rp10-8`, `b-rp10-9` |
| 3. La sensibilité chiffrée par la mesure du parcours, non par un exemple inventé | 2 | `b-rp2-13` |
| 4. Chaque identité est confrontée aux différences finies | 11 | `b-rp11-13`, `b-rp11-17` |

Les quatre sont **récapitulés** en page 12, `b-rp12-19`.

### La dette du chapitre 3

Réglée en **page 2** (`b-rp2-6`, `b-rp2-7` : le problème posé) et en **page 11**
(`b-rp11-19` : le compte des propagations et les durées mesurées). Annoncée en
page 1, `b-rp1-12`.

### Les deux dettes contractées

| Dette | Bloc qui la pose | Bloc qui l'inscrit au tableau |
|---|---|---|
| La preuve de la règle de la chaîne — outil manquant nommé : **l'approximation au premier ordre**, bloc de mathématiques | `b-rp3-14` | `b-rp1-15` |
| La forme générale à $L$ couches, la forme jacobienne, l'activation quelconque — **chapitre 5** | `b-rp9-20` | `b-rp1-15`, `b-rp12-18` |

---

## 4. Écarts entre les nombres de référence de la consigne et ceux mesurés

**Les nombres de `cours/lecon4/mesures.py` font foi**, comme la consigne le
demande. Voici où ils diffèrent de l'exécution de référence citée dans le brief,
et pourquoi.

| Quantité | Brief | Mesuré ici | Explication |
|---|---|---|---|
| Sortie $a^{[2]}$, classe 2 | 0,2438 | **0,2445** | Même graine, même init He, écart au dernier chiffre ; probablement une exécution de référence en précision réduite. Les $57$ neurones allumés et les $1\,032$ images de test coïncident exactement, donc $W^{[1]}$ est le même |
| Perte de l'exemple | 1,411308 | **1,408379** | Conséquence de la ligne précédente |
| $\delta_2$ | −0,7562 | **−0,7555** | Idem |
| Coût des différences finies | « 101 770 propagations avant » | **203 540** | Les différences finies **centrées** demandent **deux** propagations par coefficient. C'est le chiffre que le chapitre 3 publie lui-même dans son propre relevé de fusion. Le chapitre 4 emploie 203 540 et le dit |
| Mesure 2, coefficients contrôlés | 200 | **160** | $b^{[2]}$ ne compte que $10$ coefficients : ils sont tous pris, le bloc est exhaustif. $50\times 3+10=160$ |
| Mesure 2, bloc le moins précis | $W^{[1]}$, facteur 20 | **$W^{[2]}$**, $7{,}0\cdot 10^{-9}$ | **La lecture du brief est contredite par la mesure.** Le texte a donc été réécrit sur la cause réelle, qui est chiffrée : l'écart *absolu* est le même dans tous les blocs (plancher d'annulation $1{,}56\cdot 10^{-11}$), et c'est l'écart *relatif* qui grandit là où la dérivée est petite. 🧪 n°48 a été reformulée en conséquence |
| Mesure 2, tirage | 50 par bloc, au hasard | 50 par bloc **parmi les dérivées non nulles**, plus 150 dérivées nulles contrôlées à part | La mesure 8 montre que $89{,}32\,\%$ des coefficients de $W^{[1]}$ ont une dérivée exactement nulle. Les tirer ferait passer le contrôle sans rien contrôler |
| Mesure 3, quatrième neurone | $a_1=0{,}1198$, rapport 13,2 | $a_{62}=0{,}0070$, rapport **228,6** | Le programme désigne par un critère — les trois plus actifs, et **le moins actif parmi les allumés** — au lieu d'un indice écrit à la main |
| Mesure 4, perte finale | « 0,00 » | **0,000000**, $a_2=1{,}0000000000$ | Identique |
| Mesure 5, cosinus même classe | +0,3642 sur 23 paires | **+0,4110**, écart-type 0,1438, sur **2 000 paires** | La consigne demandait explicitement de porter l'échantillon à 2 000 paires et de donner les écarts-types. C'est fait |
| Mesure 5, classes différentes | −0,0239 | **−0,0263**, écart-type 0,0494, sur 2 000 paires | Idem |
| Mesure 7, durées | non pré-rempli | 226,4 µs / 2 384,1 µs, rapport ≈ 1,8 · 10⁴ | **Les durées ont varié d'un facteur 10 entre exécutions**, la machine étant partagée avec les autres agents. Le programme le dit lui-même et le chapitre s'appuie sur le compte de propagations, $203\,540$ contre $1$, qui ne dépend d'aucune machine |

### Les seuls nombres du chapitre qui ne sortent pas de `mesures.py`

Ils sont de deux sortes, et aucun n'est une valeur mesurée par ce chapitre.

| Nombre | Nature | Où il est employé | Source déclarée dans le texte |
|---|---|---|---|
| 784, 128, 10, 101 770, 100 480, 100 352, 1 280, 1 050 | Constantes d'architecture, ou sommes de constantes | partout | Chapitre 2 |
| 404 | Rapport plus grande composante / médiane | `b-rp2-13` | Chapitre 3, page 10, mesure 4 |
| 450 | Rapport entre les deux gradients de départ | `b-rp2-4` | Chapitre 3, page 5 |
| 41 degrés | Angle d'un lot de 64 au gradient complet | `b-rp10-15` | Chapitre 3, page 9 |
| 60 000, 64 | Taille du jeu, taille de lot | `b-rp10-14` | Chapitre 3, page 9 |
| $2{,}2\cdot 10^{-16}$ | $\varepsilon_{\text{machine}}$ en flottant 64 bits | `b-rp11-15` | Constante de la norme IEEE 754, et le programme l'imprime dans le plancher $1{,}56\cdot 10^{-11}$ |
| 1949 | Date de l'énoncé de Hebb | `b-rp6-3` | Référence historique |

Tout le reste — sorties, signal d'erreur, dérivées, quotients, rapports,
cosinus, comptes de zéros, précisions, durées — sort de
`cours/lecon4/mesures.py`, et chaque bloc `sortie` nomme la mesure dont il vient.

### Ce qui coïncide exactement avec le brief

$57$ neurones allumés sur $128$ · $1\,032$ images de classe 2 dans le jeu de
test · précision $0{,}1032$ · $100{,}00\,\%$ des images de test prédites « 2 » ·
somme des dix composantes nulle à la précision machine · $|\delta_c|$ égale la
somme des neuf autres.

### Les quatre mesures « à produire », produites

| Mesure | Ce qui a été produit |
|---|---|
| 3, second tableau | La ligne $k=0$, où $\delta_k>0$, avec les signes inversés et le quotient constant $+0{,}136601$ |
| 5 | 2 000 paires de chaque sorte, avec écart-type |
| 6 | Les dix couples de plus forte augmentation : tous sur $k=2$, rangs d'activation 1 à 10 sans trou |
| 7 | Compte des propagations, temps unitaires en meilleur de trois séries, estimation et mesure réelle de la boucle complète, écart 8 % |
| 8 | Prédiction $57\times 188=10\,716$ non nuls faite **avant** le comptage ; mesure $89\,636$ nuls, écart 0 ; décomposition $596\times 128$ et $71\times 188$ |

---

## 5. Renvois attendus depuis d'autres chapitres

Cet agent n'a modifié aucun fichier d'un autre chapitre. Les renvois suivants
sont **cités par le chapitre 4** et gagneraient à être réciproques :

| Chapitre | Ce qu'il faudrait y ajouter |
|---|---|
| Chapitre 2, page 6 | Le résultat $\mathrm{grad}_{\mathbf{z}^{[2]}}\,\ell=\mathbf{a}^{[2]}-\mathbf{y}$ est le **point de départ** du chapitre 4 ; il gagnerait à le signaler |
| Chapitre 3, page 8 | La dette « 203 540 propagations avant contre une » est réglée au chapitre 4, pages 2 et 11 |
| Chapitre 3, page 9 | Les propositions 4 et 5 sur les mini-lots sont **citées** par le chapitre 4, page 10, non redémontrées |
| Chapitre 3, page 10 | La mesure 4 et son rapport 404 sont **cités** par le chapitre 4, page 2 |
| Chapitre 5 | Le chapitre 4 lui renvoie la forme générale à $L$ couches, la règle de la chaîne multivariée sous forme jacobienne, et le traitement d'une activation quelconque |
| Bloc de mathématiques | Le chapitre 4 lui renvoie la preuve de la règle de la chaîne, dans ses deux formes, par l'approximation au premier ordre |

### Une cohérence à contrôler à la fusion

Le chapitre 4 mesure la précision de test du réseau **non entraîné**, graine 0,
et trouve $0{,}1314$ (mesure 4). Le chapitre 3 publie la même valeur pour sa
graine 0 (sa mesure 1). Les deux programmes sont distincts, dans deux
répertoires distincts, et partagent la graine et le protocole : **c'est la même
initialisation vue deux fois**, pas deux tirages qui se ressemblent. Un
désaccord sur ce nombre serait un défaut à instruire.

---

## 6. État de la validation, au moment de la livraison

```
npx tsc --noEmit                      exit 0, aucune erreur
                                      13 fichiers du chapitre 4 dans --listFiles
node outils/verifier-contenu.mjs      exit 0
    117 références vérifiées dans 53 fichiers · 1148 blocs · 117 animations
    aucune référence non résolue, ni dans le chapitre 4 ni ailleurs
python animations/manifeste.py --verifier   34 rendues, 83 prévues, aucune erreur
    (dernier passage complet ; depuis, il s'arrête sur scenes/calcul/, voir
     plus bas — les 28 déclarations du chapitre 4 sont contrôlées à part)
python cours/lecon4/mesures.py        exit 0, huit mesures produites
```

Contrôles propres au chapitre, tous verts :

- **28 animations**, réparties `2 · 2 · 3 · 2 · 2 · 2 · 3 · 3 · 2 · 2 · 3 · 2`.
  Aucune page sous deux.
- Chaque `animationId` cité est déclaré dans un littéral `ANIMATIONS`, et
  **chaque identifiant déclaré est cité exactement une fois**. Les deux listes
  sont égales, vérifiées par `comm`.
- **Aucun geste réemployé** : les 28 gestes du chapitre 4 sont disjoints des
  54 gestes déjà employés dans le reste de `animations/scenes/`, vérifié par
  `comm` sur les deux listes.
- **Aucun identifiant d'animation en double** sur tout le dépôt.
- 🧪 **35 à 48**, continus, sans doublon ni trou. Le récapitulatif de la page 12
  (`b-rp12-15`) les liste toutes.
- Le symbole `∇` n'apparaît **nulle part** — ni dans le contenu, ni dans les
  scènes, ni dans le programme de mesures.
- Le mot « souhaite » n'apparaît pour la première fois qu'en `b-rp3-17`, le bloc
  qui le traduit.
- Cinq scènes représentent un vecteur par ses composantes signées et non par une
  flèche : `le-gradient-ne-se-lit-pas-dun-coup` (101 770 lignes),
  `ce-que-la-sortie-reclame` (10 flèches à l'échelle),
  `la-transposee-redistribue` (10 traits puis la matrice),
  `la-porte-relu-ne-laisse-rien-passer` (128 barres),
  `lecart-aux-differences-finies` (160 fils). Aucune scène ne représente un
  vecteur de $\mathbb{R}^{128}$ par une flèche dans un plan.

### Le manifeste — À LIRE AVANT DE FUSIONNER

`public/animations/manifeste.json` a été régénéré localement, sans quoi
`verifier-contenu.mjs` ne peut pas résoudre les 28 identifiants neufs.

```
empreinte à l'arrivée de cet agent   b6beadae856ce7ad21cd1fa9e5fe8f14
empreinte après régénération         ca7fcee98e4a08e0dc73372eb86850bc
empreinte du blob HEAD               93428dcdea3c8058f277890aa71c4ee1
```

**L'état `b6beadae` n'a pas pu être rendu à l'octet près, et c'est à signaler.**
Ce n'était ni le blob de `HEAD`, ni le contenu de l'index : c'était une
modification de travail **antérieure à cette session**, déjà présente dans
`git status` au démarrage, et que git ne peut donc pas restaurer. Un
`git checkout --` sur ce fichier détruirait le travail d'un autre agent au lieu
de le rétablir : **il ne faut pas le lancer**. L'empreinte d'arrivée est notée
ci-dessus pour que la fusion sache ce qui a été écrasé.

La perte est **récupérable par construction** : `manifeste.json` est le seul
artefact dérivé versionné du dépôt, il se réécrit en entier par
`python animations/manifeste.py`, et `ECRIRE-EN-PARALLELE.md` §8 et §9 prévoient
précisément que la fusion le régénère une fois, après les cinq chapitres. L'état
actuel du fichier décrit correctement l'arbre des scènes, chapitre 4 compris :
117 animations, dont les 28 de ce chapitre.

Ce fichier **n'entre dans aucun commit de cette branche**.

### La régénération ne passe plus, et ce n'est pas le fait du chapitre 4

Depuis la fin de ce travail, `animations/scenes/calcul/arbre.py` — écrit par un
autre agent, et en cours — expose une liste `ANIMATIONS` qui n'est pas une
valeur littérale :

```
animations/scenes/calcul/arbre.py: ANIMATIONS doit être une valeur littérale
  (malformed node or string on line 89: <ast.Subscript object ...>)
```

`manifeste.py` sort sur cette erreur, **avant** d'avoir pu examiner le chapitre 4,
et ni la régénération ni `--verifier` ne vont plus au bout. C'est un échec qui
porte sur un autre chapitre, et la consigne prévoit ce cas. Les 28 déclarations
du chapitre 4 ont donc été contrôlées séparément, par le même chemin que
`manifeste.py` emploie — `ast.literal_eval` sur la liste `ANIMATIONS`, sans
importer les fichiers :

```
declarations chapitre 4 : 28
champs obligatoires (id, scene, titre, alt)  : tous présents
alt d'au moins 120 caractères                : les 28
classe déclarée existant dans le fichier     : les 28
problemes : aucun
```

Le dernier passage complet de `python animations/manifeste.py --verifier`, avant
l'apparition de `scenes/calcul/`, donnait `34 rendue(s), 83 prévue(s), aucune
erreur` avec le chapitre 4 déjà en place.

### Rendus périmés

`python animations/manifeste.py --verifier` relève **13 rendus périmés sur 34**.
Un seul a pour cause `sa source` (`le-carre-empeche-la-compensation`, chapitre 2)
et les douze autres `le style commun` — `animations/scenes/n7ia.py` a été modifié
par un autre agent avant cette session. **Aucun de ces rendus n'appartient au
chapitre 4**, qui n'en a aucun : ses 28 scènes sont toutes `prévues`.
Conformément à la consigne, **rien n'a été rendu**.

### Reproductibilité

Le programme a été exécuté quatre fois. Toutes les valeurs mesurées sont
identiques d'une exécution à l'autre — sortie, signal d'erreur, écarts aux
différences finies, cosinus, comptes de zéros, contrôle de Hebb. Seules les
**durées** de la mesure 7 varient, d'un facteur 10, la machine étant partagée.
Les durées citées en page 11 sont celles de la dernière exécution, et le texte
dit qu'elles ne valent pas comme mesure de performance.

---

## 7. Ce que la consigne demandait et qui n'a pas été fait

Rien n'a été omis. Deux points de la consigne ont été **exécutés autrement**
qu'écrit, et les deux sont documentés au §4 :

1. La mesure 2 contrôle **160** coefficients et non 200, parce que $b^{[2]}$
   n'en compte que 10. Le bloc est exhaustif, ce qui vaut mieux qu'un tirage.
2. La lecture de la mesure 2 annoncée par la consigne — « $W^{[1]}$ est le bloc
   le moins précis, d'un facteur vingt » — est **fausse sur ce réseau**. La
   mesure donne $W^{[2]}$, et la vraie cause a été mesurée puis écrite. 🧪 n°48
   porte sur cette cause.

---

# La passe du 20 septembre 2026

Cette passe n'a rien ajouté au fond : elle a repris le **fil**, l'**ouverture des
pages**, le **souffle** et les **figures**. Les sections 8 à 11 disent ce qu'elle
laisse à la fusion.

Périmètre écrit, et lui seul :

```
src/serveur/depots/demo/academy/contenu/retropropagation/
cours/lecon4/figures.py
public/cours/lecon4/
```

Un fichier a été régénéré hors de ce périmètre parce qu'il est une **vue** et
non une source : `cours-lecon4-texte.txt`, à la racine du dépôt, produit par
`node outils/exporter-chapitre.mjs`.

---

## 8. Le sort des vingt-huit blocs `animation`

**Les blocs n'ont pas été touchés.** Ils sont dans les pages, à leur place, avec
leur `animationId` d'origine. Ce qui suit dit ce que chacun doit devenir.

**La décision ne vient pas d'ici.** Le chantier des scènes l'a prise et l'a
écrite dans `animations/scenes/retropropagation/IDS.md` : **huit gardées,
refaites sur `reseau_mob.py`, et vingt jetées.** Le critère y est donné en une
phrase — une animation est gardée si elle montre un objet de ce chapitre en
train de faire quelque chose, jetée si elle en montre une *image* — et ce
tableau ne fait que le reporter, page par page, du côté des pages.

### 8.1 Les huit gardées — reprendre la légende, garder le bloc

Les huit identifiants sont inchangés, donc **aucun lien ne casse**. Les huit
légendes, en revanche, décrivent encore l'ancienne scène, métaphore comprise.

| Page | `animationId` | Ce que la légende dit encore | Ce qu'elle doit dire |
|---|---|---|---|
| 3 | `limage-cinq-traverse-le-reseau` | « un faisceau serré » qui « se disperse » | l'image n° 5 traverse le réseau, et les dix sorties s'allument à leur valeur mesurée |
| 3 | `ce-que-la-sortie-reclame` | des flèches sous dix neurones, et un compteur | δ⁽²⁾ en dix barres signées, à l'échelle mesurée |
| 4 | `le-biais-ne-passe-par-rien` | correcte, à un mot près | le biais du neurone 2 est poussé, la sortie suit de la même quantité |
| 5 | `proportionnel-a-lactivation` | correcte | les traits s'épaississent en proportion de l'activation d'où ils partent |
| 8 | `dix-demandes-sur-un-meme-neurone` | correcte | c'est elle, et non `la-transposee-redistribue`, qui portera le mot « transposée » |
| 9 | `la-porte-relu-ne-laisse-rien-passer` | « un robinet » devant chaque neurone | la porte sur les 128 composantes : 57 passent, 71 sont coupées |
| 10 | `necouter-quun-seul` | **corrigée dans cette passe**, voir §10 | les deux répartitions, à la même échelle |
| 12 | `londe-revient-de-la-sortie` | « une paroi » que l'onde rencontre | la vague remonte de la sortie vers l'entrée, couche après couche |

### 8.2 Les vingt jetées — retirer le bloc, et ce qui le remplace

`IDS.md` dit que ces vingt scènes ne seront pas écrites. Leurs blocs doivent
donc **partir des pages**. La colonne de droite dit ce qui tient déjà leur rôle,
et c'est presque toujours une figure fixe produite dans cette passe.

| Page | `animationId` | Ce qui le remplace |
|---|---|---|
| 1 | `le-relais-des-douze-pages` | rien : c'est la table des matières, et le plan est déjà une liste |
| 1 | `une-dette-reglee-deux-contractees` | rien : les deux tableaux de dettes la disent, et il y en a **trois** depuis cette passe |
| 2 | `cent-un-mille-propagations-contre-une` | `l4-fig14-cout`, page 11 |
| 2 | `le-gradient-ne-se-lit-pas-dun-coup` | `l4-fig02-importance`, même page |
| 3 | `une-composante-pese-autant-que-neuf` | `l4-fig05-delta`, même page, à l'échelle |
| 4 | `les-trois-voies-vers-une-somme-ponderee` | `l4-fig06-trois-voies`, même page |
| 5 | `le-produit-exterieur-imprime-la-matrice` | la formule (4.6), qui affiche la matrice |
| 6 | `les-liaisons-qui-se-renforcent` | `l4-fig08-hebb`, même page |
| 6 | `letiquette-est-un-pochoir` | rien : les deux encarts de limite le disent |
| 7 | `le-signe-se-lit-sur-le-poids` | `l4-fig09-signes`, même page |
| 7 | `une-activation-nest-pas-un-bouton` | le tableau « ce qui se touche », même page |
| 7 | `le-signal-remonte-le-courant` | la scène 7, page 12 |
| 8 | `la-transposee-redistribue` | la scène 5, même page |
| 8 | `on-somme-on-ne-choisit-pas` | le tableau « somme contre arbitrage », même page |
| 9 | `limage-imprime-ses-zeros` | la formule (4.11) et la mesure 8 |
| 10 | `les-exemples-ne-tirent-pas-au-meme-endroit` | **rien ne le remplace** : voir §9.3, un schéma reste à produire |
| 11 | `laller-puis-le-retour` | `l4-fig15-le-trajet`, page 12 |
| 11 | `lecart-aux-differences-finies` | la mesure 2, qui est un tableau |
| 11 | `un-seul-passage-au-lieu-de-cent-mille` | `l4-fig14-cout`, même page |
| 12 | `les-erreurs-frequentes-se-rayent` | **bloc retiré** ; le tableau des erreurs fréquentes, même page |

### 8.3 Un seul bloc a été retiré, et pourquoi celui-là

`public/animations/manifeste.json` est un artefact **généré et partagé** (voir
`ECRIRE-EN-PARALLELE.md`, §1, point 3), et le chantier des scènes l'a régénéré
pendant cette passe : il connaissait les 28 identifiants au début, il n'en
connaît plus que 27. Dix-neuf des vingt jetées survivent dans `prevues` ;
`les-erreurs-frequentes-se-rayent` en est déjà tombée, et
`verifier-contenu.mjs` refusait ce bloc (`verifier-contenu.mjs:98-104`).

**Ce bloc-là, et lui seul, a donc été retiré de `p12-synthese.ts`.** Les
dix-neuf autres restent en place tant que le manifeste les connaît : les
retirer maintenant ferait perdre le lien sans rien gagner.

**Ce que la fusion doit faire, dans cet ordre :** retirer les dix-neuf blocs qui
restent au §8.2, **puis** régénérer le manifeste. Fait dans l'autre ordre,
`npm run verifier` échoue sur dix-neuf blocs.

---

## 9. Les figures

### 9.1 Ce que la passe a corrigé

Les douze figures du chapitre portaient des textes de **10,2 à 17 px** dans un
SVG large de 1 380, soit 4,7 à 7,9 px chez l'étudiant : **385 fautes** au crible
de la règle 32. Elles sont refaites au plancher de 33, `txt` refuse désormais
une taille plus petite **et un texte de plus de quarante caractères**, et tout
empilement passe par `pas(taille)` au lieu d'une constante écrite à la main.

```
node outils/verifier-figures.mjs lecon4          385 fautes  ->  0
node outils/verifier-recouvrements.mjs lecon4      4 cas     ->  0
```

### 9.2 Les hauteurs, et les trois figures neuves

Toutes les figures ont grandi : un texte deux fois plus haut demande deux fois
plus de place. **Les champs `hauteur` des blocs `image` ont été mis à jour dans
les pages**, et ce tableau les redonne pour que la fusion puisse les contrôler
sans rouvrir les douze fichiers. La largeur ne bouge pas : 1 380 partout.

| Figure | Page | Avant | Après |
|---|---|---|---|
| `l4-fig01-cadre` | 2 | 520 | **720** |
| `l4-fig02-importance` | 2 | 480 | **620** |
| `l4-fig03-exemple` | 3 | 620 | **880** |
| `l4-fig04-sortie` | 3 | 520 | **800** |
| `l4-fig05-delta` | 3 | 580 | **800** |
| `l4-fig06-trois-voies` | 4 | 545 | **820** |
| `l4-fig07-proportion` | 5 | 600 | **820** |
| `l4-fig08-hebb` | 6 | 620 | **990** |
| `l4-fig09-signes` | 7 | 520 | **790** |
| `l4-fig10-demandes` | 8 | 640 | **1 070** |
| `l4-fig11-arriere` | 9 | 560 | **900** |
| `l4-fig12-un-exemple` | 10 | 560 | **820** |
| `l4-fig13-reseau-entier` | 1 | — | **900**, neuve |
| `l4-fig14-cout` | 11 | — | **780**, neuve |
| `l4-fig15-le-trajet` | 12 | — | **920**, neuve |

**Les trois neuves existent parce que trois pages n'ouvraient sur aucune figure**
— la règle 26 en demande une à chaque page, et les pages 1, 11 et 12 n'en avaient
pas.

- `l4-fig13-reseau-entier`, page 1 : le réseau entier, **sans un seul symbole**,
  et les deux sens. C'est la réponse au retour 20 de `RETOURS.md`, porté du
  chapitre 2 au chapitre 4.
- `l4-fig14-cout`, page 11 : le peigne des différences finies contre les deux
  flèches de la rétropropagation.
- `l4-fig15-le-trajet`, page 12 : le retour entier, dans l'ordre où il s'exécute,
  avec ce qu'on récolte au passage. Aucune page ne le montrait.

**`cours/figures/CORRESPONDANCE.md` est hors de ce périmètre** et doit gagner ces
trois lignes. La colonne « où » des douze anciennes reste juste : aucune figure
n'a changé de page ni de nom.

### 9.3 Les deux schémas qui manquent encore

Deux scènes jetées ne sont remplacées par rien, et leur idée n'est portée par
aucune figure :

| Idée sans figure | Page | Ce qu'un schéma devrait montrer |
|---|---|---|
| Le vecteur des demandes avant et après la porte | 9 | les 128 barres signées, côte à côte, 57 intactes et 71 à zéro |
| Le désaccord entre deux exemples | 10 | les deux cosinus mesurés, +0,4110 et −0,0263, sans les figurer par deux flèches dans un plan |

---

## 10. Les retours de cette passe, à porter dans `RETOURS.md`

`REGLES.md` et `RETOURS.md` sont en lecture seule pour ce chantier. Voici les
entrées qu'il produit, rédigées au format du fichier.

### A · ch. 4, page 1 et page 3 — un renvoi qui ne tient pas

> « Démontré au chapitre 2, page 6 »

Le chapitre 2 écrit en tête de son index : **« le symbole nabla non plus, et
aucun gradient n'y est dérivé »**. Sa page 6 pose le softmax et la perte
d'entropie croisée, et n'en dérive rien. Le point de départ de tout le
chapitre 4, $\mathrm{grad}_{\mathbf{z}^{[2]}}\,\ell=\mathbf{a}^{[2]}-\mathbf{y}$,
reposait donc sur une référence fausse.

**Traité dans cette passe :** l'identité rejoint la règle de la chaîne parmi les
énoncés **admis**, une troisième dette est ouverte page 1, et la mesure 2 la
vérifie sur les dix coefficients de $\mathbf{b}^{[2]}$, bloc exhaustif.
**Ce qui reste à décider à la fusion :** si le chapitre 2 gagne cette dérivation,
la dette se referme et les deux renvois redeviennent justes.

### B · ch. 4, page 3 — le titre d'une page échappe à la règle

La règle « aucun terme avant sa définition » a été tenue dans le corps : le mot
« souhaite » et ses trois cousins sont traduits page 3, et aucun n'apparaît
avant. **Le titre de la page 3 en porte pourtant un**, « ce que sa sortie
réclame », et il ne vient pas du contenu : il est dans `sommaires.ts`, hors de
ce périmètre, comme le résumé du chapitre.

Règle que cela produit : **un contrôle de vocabulaire qui ne lit que
`contenu/` ne voit ni les titres ni les résumés.** Voir §11 pour les deux
chaînes à changer.

### C · ch. 4, les figures — un filet est exempt du crible, et cela se paie

`verifier-recouvrements.mjs` écarte les traits déclarés `filet=True`, à raison :
un titre est fait pour toucher sa règle. Mais la dixième rangée de
`l4-fig08-hebb` était **écrite par-dessus le filet du pied**, et le crible n'a
rien dit. Seul l'œil l'a vue, à la largeur servie.

Règle : **une trame par figure, regardée à 640 px, reste obligatoire** — c'est la
règle 14 déjà, et elle vaut mot pour mot du côté des figures fixes. L'outil de
cette passe, qui rend chaque SVG à la largeur de la colonne, est à reprendre
dans `outils/` : les deux cribles ne remplacent pas le coup d'œil.

### D · ch. 4, toutes les pages — ce que l'affichage arrondit

Un lecteur qui repose les divisions du chapitre trouve 227,2 là où le texte
annonce 228,6, et −0,750714 là où il annonce −0,755461 : les sorties de
programme affichent des valeurs **arrondies**, et les quotients sont calculés
sur les valeurs exactes.

Règle : **quand un texte invite à refaire un calcul sur des nombres affichés, il
dit que l'affichage est arrondi.** Un encart le pose une fois pour tout le
chapitre, page 3.

### E · ch. 4, les figures — trois pièges de fabrication

1. `nb(0.0, signe=True)` compose **« +0,000000 »** pour un zéro exact, et un plus
   devant un zéro laisse croire à une valeur positive très petite. C'est
   exactement ce que la figure 11 niait.
2. `txt_indice` compose un **indice**, et il avait été employé pour l'exposant de
   $[0,1]^{784}$, qui descendait donc sous la ligne. Règle 24.
3. Le plancher de la règle 32 était **vérifié après coup** et non armé. Il l'est
   maintenant dans `txt`, avec la limite des quarante caractères : ce qui dépasse
   lève une exception au lieu de se composer.

### F · ch. 4, page 6 — un contre-exemple impossible

> « il suffit pour cela que $\delta_{k}$ soit nul »

La proposition 1 démontre que $\delta_{k}>0$ **strictement** pour les neuf
classes et $\delta_{c}<0$ strictement : $\delta_{k}$ ne s'annule jamais, et la
page 12 le redisait. Le contre-exemple à la règle de Hebb était donc
inconstructible, et la 🧪 n° 41 le demandait.

**Traité :** ce qui casse l'analogie est plus fort et se dit sans invention —
deux neurones peuvent s'activer ensemble et voir leur liaison **descendre**, ce
que Hebb n'autorise pas, et c'est le cas des neuf classes sur dix.

### G · ch. 4, page 9 — le blanc et le noir inversés

> « $x_{i}=0$ pour les pixels noirs de l'image »

Le chapitre 2 pose que l'octet vaut **0 pour le blanc du papier et 255 pour le
noir plein de l'encre**. Les 596 pixels nuls sont donc ceux du **fond**, et le
texte disait l'inverse, au milieu du seul compte du chapitre qui se prédise
avant de se mesurer. **Traité.**

### H · ch. 4, page 1 et page 11 — deux durées qui ne sont nulle part

La page 1 annonçait « 0,291 ms contre 7,4 s », la mesure 7 de la page 11 donne
2 384 µs et 42,9 s. Aucun des deux nombres de la page 1 n'existait dans les
mesures. **Traité :** la page 1 cite ce que la page 11 mesure.

### I · ch. 4, page 1 — une dette du chapitre 2 déjà réglée, redonnée pour ouverte

> « celle du milieu en porte 128, un nombre que personne n'a déduit de quoi que ce soit »

Le chapitre 3, page 11, porte un rappel sans ambiguïté : **« Dette du chapitre 2
réglée : h = 128. Le chapitre 2 annonçait h = 128 comme non justifié. Il l'est
maintenant »**, avec une mesure sur cinq largeurs. La lecture guidée de la
figure d'ouverture du chapitre 4 la rouvrait. **Traité :** la phrase renvoie
maintenant à la mesure du chapitre 3.

### J · l'export texte, et ce qu'il ne translittère pas

`cours-lecon4-texte.txt` annonce en tête que « le LaTeX des formules est
translittéré en Unicode », et il laisse passer `\odot`, `\varepsilon`, les
marqueurs d'alignement `&` et `&&` d'un `aligned`, et rend `^{9}` par `⁹}`,
avec une accolade en trop. Trois lecteurs sur douze s'y sont arrêtés.

**Cela ne touche pas l'application**, qui compose ces formules avec KaTeX : le
défaut est dans `outils/exporter-chapitre.mjs`, hors de ce périmètre, et il ne
se voit que dans la vue texte — celle-là même que la relecture emploie.

Le même export annonce « NaN minutes annoncées » et « undefined min » sur les
douze pages, parce que le champ `minutes` a été retiré de `LeconEcrite` le
13 septembre (RETOURS.md, entrée 24) et que l'exporteur le somme encore. Les
chapitres 2 et 3 portent le même défaut ; le chapitre 1, non.

---

## 11. Ce que la fusion doit reprendre hors de ce périmètre

| Fichier | Ce qu'il faut y faire | Pourquoi |
|---|---|---|
| `public/animations/manifeste.json` | régénérer **après** le retrait des vingt blocs | §8.3 ; sinon `npm run verifier` échoue |
| `sommaires.ts`, titre de `l-retro-3` | « Un seul exemple, et ce que sa sortie réclame » emploie un mot traduit dans le corps de la page | §10 B |
| `sommaires.ts`, résumé de `ch-ml-4` | « lire ce que sa sortie réclame », même raison | §10 B |
| `cours/figures/CORRESPONDANCE.md` | trois lignes pour `l4-fig13`, `l4-fig14`, `l4-fig15` | §9.2 |
| `RETOURS.md` | les huit entrées du §10 | fichier en lecture seule ici |
| `REGLES.md` | rien de neuf n'est réclamé : les entrées C, D et E du §10 précisent les règles 14, 21 et 32 sans les changer | — |
| chapitre 2 | la dérivation de $\mathbf{a}^{[2]}-\mathbf{y}$, si elle y entre | §10 A ferme alors la troisième dette |

**Ce qui n'a pas bougé et ne doit pas bouger :** aucun nombre du chapitre n'a
changé de valeur. Les seules valeurs retirées sont les deux durées du §10 H, qui
ne sortaient d'aucune mesure.

---

## 12. Comment cette passe a été vérifiée

| Contrôle | Résultat |
|---|---|
| `node outils/verifier-figures.mjs lecon4` | **0** faute sur 324 textes, contre 385 avant |
| `node outils/verifier-recouvrements.mjs lecon4` | **0** recouvrement sur 15 figures |
| chaque figure rendue à 640 px et regardée | 15 sur 15 ; deux fautes vues que les cribles ne voyaient pas |
| `node outils/mesurer-pave.mjs retropropagation` | **0** pavé au-dessus de dix lignes, sur 45 |
| garde-fou de la règle 4, trois brèves de suite | **0** sur 411 phrases de prose |
| cadratins dans le texte servi | **0** |
| blocs `repere` | **0**, comme au chapitre 2 |
| `npx tsc --noEmit` | **0** |
| `node outils/verifier-contenu.mjs` | **0**, après le retrait du bloc du §8.3 |
| les nombres servis, avant contre après | une seule valeur retirée, `0,291`, au §10 H |

**La passe de lecture.** Douze sous-agents, un par page, ne connaissant que les
chapitres 1 à 3 par leurs exports et les pages qui précèdent la leur. Premier
tour : 255 butées. Les défauts de fond en sont sortis — le renvoi faux du §10 A,
l'inversion du blanc et du noir du §10 G, le contre-exemple impossible du §10 F,
les deux durées inventées du §10 H. Second tour sur les six pages les plus
reprises : les quatre sont confirmés réparés, et ce qui reste est de l'ordre du
renvoi imprécis et du mot à peser.

---
