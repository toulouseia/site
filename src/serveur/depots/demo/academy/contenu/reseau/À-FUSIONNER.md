# Chapitre 2 — ce qui reste à faire hors de mes trois répertoires

Ce chapitre est complet dans `contenu/reseau/`, `cours/lecon2/` et
`animations/scenes/reseau/`. Rien de ce qui suit n'a été appliqué : les fichiers
concernés sont partagés avec les quatre autres agents.

**État des vérifications au moment de la livraison**

| Commande | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** sur tout le projet |
| `node outils/verifier-contenu.mjs` | **aucune référence non résolue dans `reseau/`**. Les échecs restants portent tous sur `contenu/descente/` — chapitre 3, scènes pas encore déclarées : ils sont attendus tant que cet agent travaille, et leur nombre bouge d'une exécution à l'autre (20 puis 24 pendant ma rédaction). Voir §7 |
| `python animations/manifeste.py --verifier` | aucune erreur ; 27 scènes de `reseau/` en « prévues » |
| `git status public/animations/manifeste.json` | régénéré localement pour la vérification, puis **restauré** — voir §7 |

Aucun build n'a été lancé. Aucun rendu n'a été lancé. `animations/scenes/n7ia.py`
n'a pas été ouvert en écriture.

---

## 1. `src/serveur/depots/demo/academy/sommaires.ts`

### 1.1 L'entrée `CHAPITRES`

Le tableau `CHAPITRES` contient aujourd'hui un `ch-ml-2` intitulé
« L'apprentissage supervisé, en profondeur », vers la ligne **30**. Ce n'est pas
ce chapitre-ci.

`contenu/panorama/cadre.ts` annonce déjà, dans son tableau des dettes, que le
chapitre 2 s'appelle « Qu'est-ce qu'un réseau de neurones » — l'entrée actuelle
de `sommaires.ts` est donc en désaccord avec le chapitre 1 déjà publié.
**Remplacer** l'entrée `ch-ml-2` par celle-ci :

```ts
  {
    id: "ch-ml-2",
    slug: "quest-ce-quun-reseau-de-neurones",
    titre: "Qu'est-ce qu'un réseau de neurones",
    resume:
      "La structure, construite et mesurée. Cinq propositions démontrées, et rien sur l'entraînement.",
    coursId: "c-intro-ml",
    rang: 2,
  },
```

### 1.2 Les entrées `LECONS`

Supprimer les dix entrées `l-sup-0` à `l-sup-9` (elles occupent le bloc
« Chapitre 2 » du tableau `LECONS`, vers les lignes **185 à 300**) et les
remplacer par les douze suivantes.

Les `minutes` sont des **estimations de lecture**, comme au chapitre 1, calculées
sur le volume de chaque page. Elles ne sortent d'aucune mesure et peuvent être
révisées.

```ts
  // ── Chapitre 2 · Qu'est-ce qu'un réseau de neurones ───────────────────────
  //
  // Douze pages. Le chapitre construit la structure d'un réseau et mesure ce
  // qu'elle vaut ; il ne dit pas comment on l'entraîne. Tous ses nombres
  // sortent de cours/lecon2/mesures.py, exécuté.
  {
    id: "l-res-1",
    slug: "le-cadre-du-reseau",
    titre: "Le cadre du cours",
    resume: "Sujet, prérequis, neuf objectifs, plan, et les cinq dettes contractées.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 1,
    genre: "lecture",
    minutes: 8,
    statut: "publie",
  },
  {
    id: "l-res-2",
    slug: "le-probleme-et-le-jeu",
    titre: "Le problème, et le jeu",
    resume: "Les objets de la tâche, le seuil de 11,35 %, et le prétraitement vérifié.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 2,
    genre: "demo",
    minutes: 14,
    statut: "publie",
  },
  {
    id: "l-res-3",
    slug: "de-la-grille-au-vecteur",
    titre: "De la grille au vecteur",
    resume: "vec ne perd rien, et rend pourtant la géométrie de la grille invisible.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 3,
    genre: "lecture",
    minutes: 16,
    statut: "publie",
  },
  {
    id: "l-res-4",
    slug: "un-neurone-et-ce-quil-regarde",
    titre: "Un neurone, et ce qu'il regarde",
    resume: "L'analogie et sa limite, la somme décomposée par signe, et le gabarit lu.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 4,
    genre: "lecture",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-res-5",
    slug: "construire-un-detecteur-de-bord",
    titre: "Construire un détecteur de bord",
    resume: "Trois temps, quatre entrées mesurées, et un classement qui s'inverse.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 5,
    genre: "demo",
    minutes: 16,
    statut: "publie",
  },
  {
    id: "l-res-6",
    slug: "dix-neurones",
    titre: "Dix neurones",
    resume: "Le simplexe, le softmax démontré, la perte, et 0,9193 sur 7 850 paramètres.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 6,
    genre: "demo",
    minutes: 24,
    statut: "publie",
  },
  {
    id: "l-res-7",
    slug: "le-plafond-et-dou-il-vient",
    titre: "Le plafond, et d'où il vient",
    resume: "Deux 4 et leur milieu, 0 sur 4 250, puis la convexité qui explique ce zéro.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 7,
    genre: "demo",
    minutes: 18,
    statut: "publie",
  },
  {
    id: "l-res-8",
    slug: "empiler-ne-suffit-pas",
    titre: "Empiler ne suffit pas",
    resume: "Deux couches sans activation font la même famille qu'une, et 93 920 paramètres achètent 0,63 point.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 8,
    genre: "demo",
    minutes: 20,
    statut: "publie",
  },
  {
    id: "l-res-9",
    slug: "casser-la-ligne-droite",
    titre: "Casser la ligne droite",
    resume: "ReLU, 2^128 morceaux, la sigmoïde et son quart, et le biais dérivé du seuil.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 9,
    genre: "lecture",
    minutes: 28,
    statut: "publie",
  },
  {
    id: "l-res-10",
    slug: "le-reseau-complet-et-son-compte",
    titre: "Le réseau complet, et son compte",
    resume: "L'écriture matricielle en cinq temps, la formule générale de p, et 28,3 heures.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 10,
    genre: "lecture",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-res-11",
    slug: "ce-que-la-couche-cachee-a-appris",
    titre: "Ce que la couche cachée a appris",
    resume: "L'espoir des bords, bâti puis tranché par la mesure. La réponse est non.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 11,
    genre: "demo",
    minutes: 22,
    statut: "publie",
  },
  {
    id: "l-res-12",
    slug: "synthese-du-reseau",
    titre: "Synthèse, formulaire et erreurs fréquentes",
    resume: "Le trajet en un paragraphe, le tableau exhaustif des objets, et quatorze erreurs fréquentes.",
    chapitreId: "ch-ml-2",
    coursId: "c-intro-ml",
    rang: 12,
    genre: "lecture",
    minutes: 16,
    statut: "publie",
  },
```

---

## 2. `src/serveur/depots/demo/academy/index.ts`

Deux lignes. L'import va dans le bloc d'imports de contenu, **ligne 33 environ**,
juste après `CONTENU_PANORAMA` :

```ts
import { CONTENU_RESEAU } from "./contenu/reseau";
```

L'étalement va dans la constante `CONTENU`, **ligne 41 environ** :

```ts
const CONTENU: Record<string, Bloc[]> = {
  ...CONTENU_PANORAMA,
  ...CONTENU_RESEAU,          // ← à ajouter
  ...CONTENU_OPTIMISATION,
  ...CONTENU_OPTIMISATION_SUITE,
};
```

`./contenu/reseau` résout vers `contenu/reseau/index.ts`. Si la résolution par
dossier pose problème à la construction, écrire `./contenu/reseau/index`.

---

## 3. Renvois depuis les autres chapitres

Rien à faire, mais deux points à connaître.

**Le chapitre 1 est déjà d'accord.** `contenu/panorama/cadre.ts` annonce le
chapitre 2 sous le nom « Qu'est-ce qu'un réseau de neurones » et lui doit les
fonctions d'activation. Ce chapitre les rembourse : page 9, cahier des charges,
ReLU, sigmoïde et ses quatre conditions vérifiées.

**Ce chapitre contracte cinq dettes**, toutes nommées dans son tableau
`b-r1-12` et rappelées à l'endroit où elles se produisent :

| Dette | Contractée | Créancier annoncé |
|---|---|---|
| D'où viennent les valeurs des poids | p4, `b-r4-24` | Chapitre 3 |
| Le choix de $h$ et du nombre de couches | p10, `b-r10-14` | Chapitre 3 |
| La perte cesse d'être convexe | p9, `b-r9-32` | Chapitre 3 |
| La forme de $\sigma$ | p9, `b-r9-24` | Fondements probabilistes |
| Rendre la géométrie de la grille visible | p3, `b-r3-18` | Réseaux convolutifs |

L'agent du chapitre 3 n'a rien à faire de son côté : les renvois sont de la
prose, aucun lien n'est à résoudre. Il lui suffit de savoir que **son chapitre
est nommé trois fois comme créancier**.

**Numéros de 🧪 consommés : 8 à 20.** Le chapitre 1 tient 1 à 7. Le chapitre 3
doit donc partir de **21**. Aucun outil ne le vérifie.

---

## 4. Relevé de couverture de la source

Chaque ligne de la table de contrôle de la consigne, et le bloc qui la traite.
Aucune ligne n'est sans destination.

| Notion de la source | Page | Bloc(s) |
|---|---|---|
| Prétraitement : centrage, mise à l'échelle — dit **et mesuré** | 2 | `b-r2-14` → `b-r2-18` |
| Reconnaître un chiffre est facile pour l'œil, impossible comme règle | 2 | `b-r2-3` |
| La programmation classique ne convient pas | 2 | `b-r2-3` |
| Des réseaux plus modernes font mieux ; celui-ci est compréhensible en entier | 1 | `b-r1-15` |
| L'inspiration cérébrale, et sa limite | 4 | `b-r4-2`, `b-r4-3`, `b-r4-4` |
| Variantes : convolutifs, récurrents, transformeurs | 1 | `b-r1-16` |
| Un neurone porte un nombre ; ce nombre est l'activation | 4 | `b-r4-6`, `b-r4-8` |
| … et l'écart avec ReLU relevé | 9 | `b-r9-18`, `b-r9-19` |
| La couche d'entrée : 784 neurones | 3 | `b-r3-7` |
| La couche de sortie : 10 neurones | 6 | `b-r6-4` |
| Que pense ce réseau, avec quelle certitude — 🧪 n°12 | 6 | `b-r6-26`, `b-r6-27` |
| Les couches cachées, et leur nombre arbitraire | 10 | `b-r10-14` |
| Chaque neurone influence chaque neurone suivant, forces inégales | 10 | `b-r10-4`, `b-r10-8`, `b-r10-19` |
| L'espoir : les chiffres se décomposent en boucles et en traits | 11 | `b-r11-3`, `b-r11-4` |
| L'avant-dernière couche détecterait les sous-composants | 11 | `b-r11-4` |
| Une boucle se décompose en bords ; un trait long est un bord long | 11 | `b-r11-5` |
| La hiérarchie pixels → bords → motifs → chiffres, en schéma | 11 | `b-r11-6` |
| « Est-ce que le réseau fait vraiment cela ? » — **tranché : non** | 11 | `b-r11-14`, `b-r11-15`, `b-r11-16` |
| La détection de bords sert à d'autres tâches d'image | 11 | `b-r11-7` |
| La parole se décompose aussi en couches d'abstraction | 11 | `b-r11-7` |
| On veut le même procédé mathématique à chaque étape | 10 | `b-r10-3`, `b-r10-4`, `b-r10-5` |
| Les poids, et ce que leur signe veut dire | 4 | `b-r4-12`, `b-r4-13` |
| La somme pondérée | 4 | `b-r4-7` |
| Les poids rangés en grille, positifs et négatifs | 4 | `b-r4-17` → `b-r4-21` |
| Construire un détecteur de bord, en trois temps | 5 | `b-r5-3` → `b-r5-17` |
| Classer quatre images par activation — 🧪 n°10 | 5 | `b-r5-18` |
| La somme pondérée n'est pas bornée ; il faut l'écraser | 9 | `b-r9-4`, `b-r9-21` |
| La sigmoïde | 9 | `b-r9-22`, `b-r9-23`, `b-r9-24` |
| Que vaut la sigmoïde en −1000 — 🧪 n°15 | 9 | `b-r9-26` |
| Le biais : le seuil que la somme doit franchir | 9 | `b-r9-27` → `b-r9-29` |
| Le compte des poids d'une couche | 10 | `b-r10-12` |
| Le compte total du réseau | 10 | `b-r10-13` |
| L'expérience de pensée : régler tous les poids à la main | 10 | `b-r10-17` |
| Pourquoi ne pas traiter le réseau comme une boîte noire | 10 · 11 | `b-r10-18`, `b-r11-16` |
| L'écriture matricielle, en cinq temps | 10 | `b-r10-7`, `b-r10-8`, `b-r10-9` |
| Le code est plus propre et plus rapide ; le matériel spécialisé | 10 | `b-r10-10` |
| Le réseau est une fonction | 10 | `b-r10-20` |
| La sigmoïde pose problème ; ReLU la remplace, hiérarchie inversée | 9 | `b-r9-5` → `b-r9-9`, puis `b-r9-21` → `b-r9-24` |
| La suite : l'apprentissage | 12 | `b-r12-17` → `b-r12-20` |

### Les cinq écarts délibérés, et où ils sont signalés

| # | Écart | Signalé dans |
|---|---|---|
| 1 | $h=128$ annoncé comme **non justifié** | `b-r10-14` |
| 2 | La sigmoïde posée par cahier des charges, sa construction en dette | `b-r9-21` → `b-r9-24` |
| 3 | L'espoir des bords bâti, puis tranché par la mesure | `b-r11-2` → `b-r11-16` |
| 4 | Quatre modèles mesurés là où la source ne mesure rien | `b-r11-18`, et tout `cours/lecon2/mesures.py` |
| 5 | Un neurone ne porte plus un nombre de $[0,1]$ | `b-r9-18`, `b-r9-19` |

Le récapitulatif des cinq est repris dans `b-r12-21`.

---

## 5. Écarts entre les nombres de la consigne et les nombres mesurés

`cours/lecon2/mesures.py` a été exécuté **trois fois**. Les deux exécutions
complètes donnent des sorties identiques à l'octet près, hors durées d'horloge :
le programme est reproductible sur ce poste.

**Le contenu cite les valeurs mesurées, pas celles de la consigne.** L'AC est
explicite : aucun nombre du chapitre n'apparaît sans que ce programme le
produise.

### Ce qui concorde exactement

Répartition des classes, seuil de 11,35 %, part des valeurs nulles 80,88 %,
67 pixels nuls sur 60 000, tous les octets de l'image de test n°0 et ses quatre
valeurs citées, le modèle 1 en entier (0,9193 · 807 erreurs · $p=7\,850$), les
comptes de paramètres 101 770 et 13 002, la part de 98,6 % dans $W^{[1]}$,
$\sigma(-1000)$, le majorant $1/4$, le majorant $2^{128}$.

La valeur moyenne d'un pixel vaut **0,130660**, ce que la correction de consigne
reçue en cours de travail confirme.

### Ce qui diffère

| Quantité | Consigne | Mesuré | Où c'est écrit |
|---|---|---|---|
| Modèle 2, pas retenu | $\eta = 0{,}05$ | **$\eta = 0{,}1$** | `b-r8-9` |
| Modèle 2, précision · erreurs | 0,9252 · 748 | **0,9256 · 744** | `b-r8-9`, `b-r11-18` |
| Modèle 3, précision · erreurs | 0,9829 · 171 | **0,9814 · 186** | `b-r9-16`, `b-r11-18`, `b-r11-21` |
| Composantes de $\mathbf{a}^{[1]}$ non nulles, image n°0 | 39 | **35** | `b-r9-16` |
| Part moyenne de composantes non nulles | 34,68 % | **35,07 %** | `b-r9-16` |
| Neurones extrêmes sur l'image n°0 | 62 · 65 · 117 · 80 | **66 · 5 · 114 · 81** | `b-r11-10` |
| Corrélation maximale gabarit caché / classe | 0,3023 | **0,4894** | `b-r11-14` |
| Erreurs au-dessus de 0,99 | 34 | **30** | `b-r11-21` |
| Probabilité médiane des erreurs | 0,9209 | **0,8755** | `b-r11-21` |
| Six erreurs les plus confiantes | liste donnée | **liste différente** | `b-r11-21` |
| Six confusions les plus fréquentes | liste donnée | **liste différente** | `b-r11-21` |
| Extrema des gabarits de classe | 4ᵉ décimale | écarts de 1 à 2 unités sur la 4ᵉ décimale | `b-r4-21` |

Le modèle 1 concorde à l'identique et les autres non : les modèles à couche
cachée sont non convexes, et un écart d'arrondi de l'ordre de $10^{-16}$ dans un
produit matriciel se propage sur 28 140 mises à jour. **Un écart de cet ordre
n'est pas une erreur, c'est la propriété du problème**, et c'est d'ailleurs ce
qui justifie que le chapitre 3 existe. À vérifier néanmoins si un autre poste
reproduit ces valeurs-ci ou celles de la consigne.

### Un point du texte corrigé par la mesure

La consigne annonce que le minimum du gabarit du 0 « tombe au centre exact de la
grille ». Il tombe en **(16, 15)**, à une case et demie du centre géométrique
$(14{,}5\ ;\ 14{,}5)$. Le texte de `b-r4-21` écrit ce qui est mesuré.

### Les trois valeurs « à produire »

| Demandé | Produit |
|---|---|
| Centre de masse moyen, et son écart au centre géométrique | ligne 14,9959 · colonne 15,0068 ; écart 0,71 pixel ; écart-type 0,29 |
| Mesure du corollaire de la proposition 2 | **0 sur 4 250** (linéaire) · **69 sur 4 816** (ReLU) |
| Modèle 4, précision et erreurs | **0,9437 · 563 erreurs**, $p = 13\,002$ concordant avec le compte à la main |

### Une mesure ajoutée, qui n'était pas demandée

L'écart n°3 exige que la réponse soit **tranchée par la mesure**. Corréler les
gabarits cachés aux seuls gabarits de classe ne tranche que la moitié de la
question : elle ne dit rien des **bords**. Le programme construit donc 168
détecteurs de bord à la main, sur le modèle de la page 5, et mesure aussi la
corrélation des gabarits cachés avec cette famille — **plus une référence**,
la corrélation de deux vrais détecteurs entre eux, sans laquelle un $\rho$ de
0,43 ne voudrait rien dire.

    correlation maximale gabarit cache / detecteur   0.4275
    gabarits caches ayant un |rho| > 0,5             0 sur 128
    maximum entre deux detecteurs distincts          0.7864

Sans cette référence, la page 11 aurait affirmé son « non » au lieu de le
mesurer.

---

## 6. Deux arbitrages sur des points où la consigne se contredit

**La proposition 5.** La section 6 de la consigne la place page 9 ; la
section 8, page-par-page, la place page 6 — et la section 4.3 demande que la
convention « composante par composante » soit énoncée page 9, à sa première
occurrence. Retenu : **la proposition 5 est démontrée page 6**, là où `softmax`
est introduit, avec ses deux points et son interprétation ; **la page 9 énonce
la convention** et reprend en une ligne le contraste avec `softmax`, en
renvoyant à la démonstration. Les deux exigences sont satisfaites.

**Le 🧪 de la page 12.** La section 9 place le n°20 page 11, et la section 8
demande « une question de vérification » page 12. Comme l'AC fixe treize
vérifications numérotées 8 à 20 et un récapitulatif, la page 12 porte le
**récapitulatif des treize**, avec page, section et énoncé (`b-r12-16`), et le
n°20 reste page 11.

---

## 7. Ce que je n'ai pas touché, et qui est cassé sans moi

`node outils/verifier-contenu.mjs` sort en erreur sur des identifiants
d'animations cités par `contenu/descente/` — le chapitre 3 — et absents du
manifeste : **20 à ma première vérification, 24 à la dernière**, sur les pages
`p02-acquis` à `p09-mini-lots`. Le nombre monte parce que cet agent écrit
pendant que je vérifie. **Aucun ne vient de `reseau/`**, et je n'y ai pas
touché : ce sont ses fichiers.

L'agent du chapitre 3 déclarera ses scènes et la commande repassera au vert.
Tant qu'elle est rouge, **aucun agent ne peut distinguer sa propre casse de
celle-ci** sans filtrer par répertoire, ce qui est le risque signalé dans
`ECRIRE-EN-PARALLELE.md`. Le filtre qui donne la réponse en une ligne :

```bash
node outils/verifier-contenu.mjs 2>&1 | grep "✗" | grep -c "^  ✗ reseau/"
```

`animations/manifeste.py --verifier` signale par ailleurs les **30 rendus
périmés** du chapitre 1, dont la cause est un changement du style commun. Aucune
page n'en souffre : elles servent la vidéo qu'elles ont. **Ne pas rendre.**

### L'état de `public/animations/manifeste.json`

J'ai régénéré ce fichier deux fois, pour faire tourner
`outils/verifier-contenu.mjs`, et je l'ai **restauré par `git checkout --` après
chaque usage**, comme la consigne le demande. Rien n'a été perdu : c'est un
fichier entièrement dérivé de `animations/scenes/**`, qu'une commande
reconstruit.

À la fin de mon travail, `git status` le montre pourtant modifié : il porte un
horodatage de génération **postérieur à ma dernière restauration**, et il
contient mes 27 scènes plus 8 autres. Il a donc été régénéré par un autre
processus après moi — un autre agent faisant sa propre vérification, ce qui est
le comportement attendu.

**Je ne l'ai pas restauré une seconde fois**, et c'est délibéré : le restaurer
maintenant écraserait la régénération de quelqu'un d'autre, qui est en train de
s'en servir. C'est très exactement le fichier partagé décrit dans
`ECRIRE-EN-PARALLELE.md` §8, et la réponse reste la même : **l'agent de fusion le
régénère une fois, à la fin, et c'est cette version-là qui est commitée.** Aucun
agent de chapitre ne doit le faire entrer dans un commit.

---

## 8. Passe du 30 août 2026 : l'ordre de la page 7, la mesure portée, le centre de masse

Quatre décisions appliquées après la première livraison. Elles ne changent
aucune démonstration ; elles changent où les choses sont dites, et ce que la
page 2 conclut.

### 8.1 La page 7 montre l'échec avant de le démontrer

L'ordre était : convexité définie, proposition 2 démontrée, mesure citée. Un
élève recevait l'outil avant la question. Le nouvel ordre est :

| | Ce que la page fait | Bloc |
|---|---|---|
| a | Deux images de 4 du jeu de test, leur milieu, et les trois classes que le modèle linéaire leur attribue | `b-r7-3` |
| b | La question, en une phrase | `b-r7-4` |
| c | La mesure : **0 sur 4 250** en linéaire | `b-r7-5` |
| d | La partie convexe, la proposition 2, le corollaire qui explique le zéro | `b-r7-7` à `b-r7-10` |
| e | Le même essai avec le réseau à ReLU : **69 sur 4 816**, et la même paire | `b-r7-12` |

**La preuve n'a pas changé d'une ligne.** Les identifiants de blocs de la page
sont renumérotés de `b-r7-1` à `b-r7-20`, et le bloc `sortie` unique de la
section 5 est cité en deux extraits, l'un en (c), l'autre en (e).

### 8.2 La paire de la page 7, produite par le programme

`mesures.py` porte une fonction `_paire_page7`. Elle cherche, **exhaustivement
et sans tirage**, une paire d'images de classe 4 que les deux modèles classent
4 aux deux bouts et dont le modèle à ReLU classe le milieu ailleurs. Sur les
982 images de classe 4 du jeu de test, 921 passent le premier filtre, ce qui
fait 423 660 paires à examiner ; 162 conviennent, et la première dans l'ordre
des indices est celle que la page cite :

    image de test n°115, classe 4
    image de test n°668, classe 4

                          image 115   image 668   milieu
    MODELE 1, lineaire           4          4         4
    MODELE 3, avec ReLU          4          4         9

Cette recherche est indépendante du protocole des 5 000 paires : elle ne touche
ni à la graine, ni aux comptes 4 250 / 0 / 69 / 4 816.

### 8.3 La mesure du corollaire, portée à trois endroits

`0 sur 4 250` et `69 sur 4 816` apparaissent désormais :

- **page 7**, en (c) et (e), comme aboutissement de la section ;
- **page 11**, dans `b-r11-19`, juste après le tableau des quatre modèles, où
  elle explique pourquoi on passe de 744 à 186 erreurs — le tableau ne fait que
  le constater ;
- **page 12**, dans le paragraphe « Le trajet ».

**Les nombres de la consigne étaient 748 et 171 ; les nombres mesurés sont 744
et 186.** C'est l'écart déjà relevé au §5 : le contenu cite ce que le programme
produit.

### 8.4 Le centre de masse, page 2

La mesure est reprise **en indices 0 à 27**, et comparée à deux repères au lieu
d'un. Le programme imprime les deux écarts et l'écart-type ; il ne conclut pas.

    centre de masse moyen                  13.9959     14.0068
    ecart-type entre images                 0.2892      0.2909
    ecart au milieu geometrique, 13,5      +0.4959     +0.5068   → 0.7091 pixel
    ecart a l'indice 14                    -0.0041     +0.0068   → 0.0080 pixel

Le texte lit : le jeu est centré, et il l'est sur **l'indice 14**, pas sur le
milieu géométrique. Sur une grille de côté pair il n'existe pas de pixel
central, il a fallu en choisir un. Et « centré » n'a pas de sens sans dire
« centré sur quoi ».

**Ces valeurs sont les mêmes qu'avant, à la convention près** : 13,9959 en
indices 0 à 27 est 14,9959 en coordonnées 1 à 28. L'écart d'un demi-pixel au
milieu géométrique et l'écart-type de 0,29 sont inchangés. La convention 1 à 28
reste celle du reste du chapitre, et la page 2 pose la sienne explicitement là
où elle s'en écarte.

### 8.5 Le modèle 4, page 11

Le tableau porte les deux comptes — 0,9437 et 563 erreurs pour 13 002
paramètres, 0,9814 et 186 pour 101 770 — et l'encart `b-r11-20` écrit la
réserve : l'architecture de la source a été choisie pour tenir à l'écran, et
une comparaison à nombre de paramètres inégal ne tranche rien.

### 8.6 Deux fichiers touchés hors des blocs de contenu

- `animations/scenes/reseau/jeu.py` : la scène
  `le-centre-de-masse-tient-la-grille` passe en indices 0 à 27 et gagne un
  second temps — la croix va chercher l'indice 14, et la cote tombe de 0,71 à
  0,008 pixel. Ses champs `legende`, `mouvement`, `ecran`, `nombres` et `alt`
  changent en conséquence, et la légende du bloc `b-r2-18` les suit.
  **`public/animations/manifeste.json` n'a pas été régénéré** : il porte encore
  l'ancien texte de cette scène. L'agent de fusion le régénère une fois, comme
  le dit le §7.
- `cours/lecon2/exporter-texte.mjs` : le programme qui produit
  `cours-lecon2-texte.txt`, à la racine du dépôt, sur le modèle de
  `cours-lecon1-texte.txt`. Il lit les blocs dans les douze fichiers de contenu,
  les scènes dans `animations/scenes/reseau/` par `ast`, les durées dans le
  manifeste et le sommaire dans le §1 de ce fichier. Rien n'y est recopié à la
  main, et il se relance après toute modification du chapitre :

```bash
cd app/application && node cours/lecon2/exporter-texte.mjs
```

  Quand `sommaires.ts` aura reçu le §1, il faudra faire lire le sommaire à
  `sommaires.ts` plutôt qu'à ce fichier : c'est la seule ligne à changer.

### 8.7 Vérifications de cette passe

| Commande | Résultat |
|---|---|
| `python cours/lecon2/mesures.py` | exécuté en entier, 117 s, tous les nombres cités en sortent |
| `npx tsc --noEmit` | **0 erreur** |
| `node outils/verifier-contenu.mjs` | **aucune référence non résolue dans `reseau/`** ; les échecs restants sont ceux de `contenu/descente/` décrits au §7 |
| `node cours/lecon2/exporter-texte.mjs` | 5 169 lignes, 12 pages, 27 scènes, 13 vérifications |

Aucun rendu n'a été lancé. `animations/scenes/n7ia.py` n'a pas été ouvert en
écriture. `sommaires.ts`, `index.ts` et `manifeste.json` n'ont pas été touchés.

### 8.8 Relevé : aucune intention prêtée à la source

Un cours qui exige une source pour chaque nombre ne peut pas s'en dispenser pour
une intention. **Règle appliquée : décrire ce que fait la source, jamais
pourquoi elle le fait.** Une phrase qui prête une intention, un motif ou un
choix délibéré à quiconque, et que le dépôt ne peut établir, ne tient pas.

**Ce qui a été cherché.** Sur les douze fichiers de `contenu/reseau/` et, par
précaution, sur les douze fichiers de `animations/scenes/reseau/` :

- les désignations de la source : `auteur`, `la source`, `l'exposé`,
  `Sanderson`, `3Blue1Brown`, `écart n°N` ;
- les verbes et tournures d'intention : `a voulu`, `voulait`, `cherche à`,
  `afin de`, `dans le but`, `par souci`, `délibéré`, `l'intention`, `a décidé`,
  `a préféré`, `a retenu`, `a jugé`, `estime que`, `considère que`,
  `pense que`, `choisi pour`, `pour qu'elle`, `pour qu'il`, `pour tenir`,
  `par commodité`, `par pédagogie`, `on a souhaité` ;
- les attributions à un tiers collectif : `les chercheurs`, `la communauté`,
  `historiquement`, `a été introduit par`, `popularisé`, `l'usage veut`.

La même recherche est passée sur `cours-lecon2-texte.txt` régénéré, qui contient
le texte servi ET les vingt-sept scènes : c'est le filet le plus large, puisque
rien du chapitre n'échappe à l'export.

**Ce qui a été trouvé, et corrigé.**

| Où | Phrase | Traitement |
|---|---|---|
| `b-r11-20`, page 11 | « son auteur écrit qu'il l'a choisie pour qu'elle tienne à l'écran » | **Remplacée.** Le cours dit qu'il ne dispose d'aucun élément sur le motif et n'en conjecture aucun. La réserve sur la comparaison à paramètres inégaux est inchangée, mot pour mot |
| `p11-cache.ts`, entête | « L'exposé […] bâtit l'espoir que les neurones cachés détectent des boucles […] » | **Reformulée** en « présente l'hypothèse […] et ne la tranche pas ». Un commentaire, pas du texte servi ; corrigé quand même, et la règle y est désormais écrite |

**Ce qui a été examiné et gardé, avec la raison.** Ces phrases décrivent ce que
la source contient ou ce que ce cours-ci décide. Aucune ne dit pourquoi la
source fait ce qu'elle fait.

| Où | Phrase | Pourquoi elle tient |
|---|---|---|
| `b-r9-18`, page 9 | « L'exposé dont ce chapitre suit l'ordre **décrit** un neurone comme portant un nombre entre 0 et 1 » | Contenu de la source, pas motif |
| `b-r12-21`, page 12 | « les quatre modèles comparés là où la source **ne mesure rien** » | Absence dans la source, pas motif |
| `b-r12-21`, page 12 | « la sigmoïde posée par cahier des charges **au lieu d'être présentée** » | Traitement dans la source, pas motif |
| `b-r1-17` et `b-r12-21` | « Cinq **écarts délibérés** y sont pris » | Décisions de CE cours, chacune signalée à sa page : le dépôt les établit |
| `b-r10-10`, page 10 | « Les bibliothèques de calcul et le matériel spécialisé **sont optimisés pour** une opération » | Propriété d'un outil, pas intention d'une personne |

**Ce qui n'a rien donné.** Les douze fichiers de `animations/scenes/reseau/` :
aucune occurrence. Les seules correspondances sont le mot « hauteur », qui
contient « auteur ».

**Ce qui reste vrai et n'est pas écrit.** Que l'architecture $784\rightarrow
16\rightarrow 16\rightarrow 10$ ait été retenue pour tenir à l'écran est exact,
et le dépôt n'en porte pas la trace. Le chapitre ne l'écrit donc pas. Si une
citation vérifiable entre un jour dans le dépôt — horodatage, page, mot pour mot
—, la phrase pourra revenir avec sa référence.

**Vérifications après le relevé du §8.8** — `npx tsc --noEmit` : 0 erreur.
`node outils/verifier-contenu.mjs` : 0 problème dans `reseau/`.
`cours-lecon2-texte.txt` régénéré, 5 169 lignes. `mesures.py` n'a pas été
modifié et n'a donc pas été réexécuté : aucun nombre du chapitre ne change.

### 8.9 Le rapport des deux écarts, et le verdict sur `b-r5-7`

**Le rapport est produit par le programme.** La section 1 de `mesures.py`
calcule le quotient des deux distances **non arrondies** et l'imprime à côté
d'elles :

    ecart au milieu geometrique, 13,5      +0.4959     +0.5068
    distance                                0.7091 pixel

    ecart a l'indice 14                    -0.0041     +0.0068
    distance                                0.0080 pixel

    rapport des deux ecarts                   89.1

`b-r2-17` cite `89.1` tel quel, et sa lecture écrit ce que les deux nombres
séparés ne disaient pas : l'indice 14 n'est pas un peu meilleur, il l'est de
deux ordres de grandeur.

Le quotient est calculé sur les distances telles que numpy les tient, pas sur
leurs quatre décimales affichées : $0{,}7091 / 0{,}0080$ à l'écran donnerait
$88{,}6$, et ce serait un arrondi d'arrondi.

**`mesures.py` a été réexécuté en entier.** Diff avec l'exécution précédente,
durées d'horloge exclues : **la ligne du rapport, et rien d'autre**. Tous les
autres nombres du chapitre sont identiques à l'octet près.

**`b-r5-7` : la phrase tombe.** « L'image du 7 marque 23,40 : sa barre
supérieure traverse la bande de part en part, c'est ce qu'on voulait. »
Le verdict de la revue précédente — « cahier des charges que cette page vient
d'écrire » — était faux : la phrase ne pose aucune décision de conception, elle
commente le résultat d'une mesure déjà expliqué par la proposition qui la
précède. `sa barre supérieure traverse la bande de part en part` dit pourquoi
le score vaut 23,40 ; `c'est ce qu'on voulait` n'apprend rien de plus, et fait
dire au cours qu'il a réussi. **Coupée.** La ligne de la revue précédente qui
la gardait est retirée du tableau du §8.8.

**Un cas voisin, hors de mon périmètre cette fois.** Le texte alternatif de la
scène `la-tache-large-trompe-le-compteur`
(`animations/scenes/reseau/detecteur.py`) finit par « …soulignant que la
première dépasse la seconde, ce qui est l'inverse de ce qu'on voulait ». Même
famille : la proposition qui précède donne déjà l'information. Non touché — la
consigne de cette passe s'arrête à `contenu/reseau/`, à `mesures.py` et à
l'export. À trancher au prochain passage sur les scènes.

### 8.10 Relevé : les vingt-sept textes alternatifs

**Règle appliquée.** Un texte alternatif décrit ce qu'un lecteur verrait. Il ne
dit pas si c'est important, ni si c'est le résultat attendu, ni ce qu'il faut en
penser. Une description peut dire qu'une barre dépasse une autre : c'est ce
qu'on voit. Elle ne peut pas dire que ce dépassement contredit une attente.

Les vingt-sept `alt` de `animations/scenes/reseau/` ont été relus un par un.
**Sept sont coupés, vingt restent.** Seul le champ `alt` est touché : un
contrôle champ par champ sur les douze modules confirme que `id`, `scene`,
`titre`, `bandeau`, `section`, `geste`, `notions`, `legende`, `mouvement`,
`ecran` et `nombres` sont identiques à l'octet près, dans les vingt-sept.

**Les sept coupes.**

| Scène | Ce qui est coupé | Ce qui reste |
|---|---|---|
| `lespoir-des-bords-nest-pas-verifie` | « et cela **se voit immédiatement** : » | « …sur exactement la même échelle de couleur, et ils sont beaucoup plus pâles » |
| `ce-que-ce-chapitre-ne-fait-pas` | « **pour montrer que** la boucle tourne vraiment » | « …en marquant un temps dans chaque case » |
| `la-tache-large-trompe-le-compteur` | « **ce qui est l'inverse de ce qu'on voulait** » | « …soulignant que la première dépasse la seconde » |
| `le-pourtour-negatif-remet-lordre` | « **de sorte que** le renversement **se lise** comme un seul geste et non comme une suite d'états » | « …trois allers-retours de plus en plus rapprochés » |
| `le-poids-devient-une-image` | « **et il doit se reconnaître comme tel** » | « c'est exactement le mouvement de la page trois, joué à l'envers » |
| `un-seul-gabarit-par-classe` | « Cette différence **n'est pas négligeable**, elle occupe… » | « Cette différence occupe une bonne part du haut du chiffre » |
| `un-seul-gabarit-par-classe` | « : **un seul motif ne peut pas être maximal sur les deux écritures à la fois** » | « …et aucune des deux aiguilles ne l'atteint. » |
| `la-question-du-chapitre-suivant` | « : **c'est le trajet que le chapitre entier vient de décrire** » | « …en marquant un temps d'arrêt à chacun » |

La conclusion coupée de `un-seul-gabarit-par-classe` n'est écrite nulle part à
l'écran — son champ `ecran` porte quatre étiquettes, et aucune ne la contient :
le texte alternatif la tirait de lui-même. Elle est dite par le texte de la
page 7, à sa place.

**Ce qui a été examiné et gardé, avec la raison.** Aucune de ces tournures ne
dit qu'une chose est importante, attendue, ou à retenir.

| Scène | Tournure | Pourquoi elle tient |
|---|---|---|
| `les-dix-gabarits` | « celui du cinq est nettement plus saturé…, **parce que** ses coefficients sont plus grands et que l'échelle est la même pour tous » | Cause, pas jugement ; et « une seule échelle pour les dix » est écrit à l'écran |
| `le-centre-de-masse-tient-la-grille` | « elle tombe sur une intersection…, **parce que** le côté de la grille est pair » | Même chose : la cause d'un fait visible |
| `la-sigmoide-ecrase-la-droite-reelle` | « un quart, **la plus forte que la sigmoïde atteigne** » | Propriété nommée, pas portée commentée ; `σ′(0) = 1/4` est à l'écran |
| `le-poids-devient-une-image` | « L'échelle est symétrique…, **de sorte que** le blanc marque exactement le changement de signe » | Conséquence visible à l'écran |
| `la-tache-large-trompe-le-compteur` | « dépasse les trois autres…, **le maximum atteignable** » | Ce qu'on voit ; la graduation porte « maximum 39 » |
| `les-erreurs-regardees-une-a-une` | « quelques cases hors diagonale **s'empilent visiblement plus** que les autres » | Décrit l'apparence, pas l'importance |
| `lespoir-des-bords-nest-pas-verifie` | « L'écart entre les deux repères **est franc** » | Décrit l'écartement vu, comme « plus haut » ou « plus long » |
| `la-question-du-chapitre-suivant` | « par petits pas successifs, **comme si elle cherchait le bas** » | Comparaison qui décrit un mouvement |
| `deux-matrices-nen-font-quune` | « une case ronde en pointillé reste vide : **c'est la place où aucune fonction n'a été mise** » | Nomme l'objet vu, comme « c'est la tache » |

**Trois occurrences laissées, hors du périmètre de cette passe.** Elles portent
la même tournure, dans des champs qui ne sont pas des textes alternatifs :

| Où | Champ | Phrase |
|---|---|---|
| `la-tache-large-trompe-le-compteur` | `mouvement`, temps 5 | « Un trait pointillé relie la barre du 0 à celle du 7 **pour montrer que** la première dépasse la seconde » |
| `le-pourtour-negatif-remet-lordre` | `legende` | « Le basculement est joué plusieurs fois, **pour qu'il se voie comme un seul geste** » |
| `p04-neurone.ts`, encart « D'où viennent ces poids ? » | contenu | « La page 5 construira un neurone entièrement à la main, **pour montrer que c'est possible** » |

**Les trois sont laissées telles quelles, et c'est tranché.** La règle validée
porte sur les **textes alternatifs**, et sur eux seuls.

- `mouvement` est une consigne de mise en scène adressée à qui rend la vidéo,
  et l'AC de cette passe le protège : « aucun geste, aucune structure de scène
  ne change ». Hors périmètre, et il le reste.
- `p04-neurone.ts` est du contenu, explicitement hors du `SCOPE`.
- `legende` est du contenu visible — elle est servie sous la vidéo — mais elle
  n'était pas dans cette passe. **Candidat pour une future passe éditoriale
  globale**, avec les autres champs servis au lecteur. Rien n'est fait
  maintenant.

**Vérifications.** `python animations/manifeste.py --verifier` : aucune erreur.
`public/animations/manifeste.json` n'a été ni régénéré ni écrit — empreinte
`97d5406` avant la passe, `97d5406` après. `npx tsc --noEmit` : 0 erreur.
`node outils/verifier-contenu.mjs` : 0 problème dans `reseau/`.
`cours-lecon2-texte.txt` régénéré, 5 167 lignes. `mesures.py` n'a pas été
touché ; aucune valeur numérique ne change dans les scènes.

---

## 9. Passe ANIMATIONS-TRI du chapitre 1 : trois animations qui vous reviennent

Le chapitre 1 ne sert plus que six animations. Le tri en envoie **trois** ici,
avec les blocs qui les portaient. **Rien n'est appliqué** : les trois blocs ont
été retirés de `contenu/panorama/`, et leur place dans ce chapitre-ci est votre
décision, pas la mienne.

Les trois vidéos sont rendues et au manifeste ; leurs identifiants ne changent
pas. `verifier-contenu.mjs` refuse une animation servie deux fois : elles ne
sont plus citées nulle part, la voie est donc libre.

| identifiant | ce qu'elle montre | d'où elle vient | où elle irait |
|---|---|---|---|
| `du-score-a-la-probabilite` | la courbe en S, le balayage du score, le seuil et la bascule | ch. 1, page 8 — `s7-regression.ts` | **page 9**, avec la sigmoïde et le biais comme seuil |
| `aucun-pixel-commun` | deux images de la même classe qui ne partagent aucun pixel encré | ch. 1, page 2 — `s1-intuition.ts` | **page 2**, avec le jeu et ses 784 pixels |
| `deux-trois-ne-se-ressemblent-pas` | deux 3 manuscrits, et ce qui les sépare pixel à pixel | ch. 1, page 2 — `s1-intuition.ts` | **page 2**, même endroit |

**Le cas des deux dernières est à trancher, pas à appliquer.** La page 2 de ce
chapitre porte déjà `l2-fig01-planche` — douze images du jeu de test — et
`l2-fig02-grille`, la grille aux 784 ronds. Les deux animations disent quelque
chose que ces figures ne disent pas : que deux exemples d'une même classe
peuvent n'avoir aucun pixel en commun. Mais la règle 15 met le schéma avant
l'animation, et la page 2 est déjà servie par deux figures.

Deux issues, et le rapport de la passe dit laquelle a été retenue :

1. **la page 2 les prend** — deux blocs `animation` de plus, après
   `l2-fig02-grille` ; c'est là que l'argument porte ;
2. **elles sont retirées** — leurs scènes restent dans
   `animations/scenes/panorama/chiffres.py`, rendues et au manifeste, mais plus
   aucune page ne les cite.

Le tri du chapitre 1 a retenu la **seconde** : la page 2 du chapitre 2 n'en a
pas l'usage aujourd'hui, et un chapitre qui sert une animation sans en avoir
besoin est exactement ce que la relecture reprochait au chapitre 1. Elles
attendent ici, nommées, si la page 2 change d'avis.

`du-score-a-la-probabilite`, elle, n'a pas d'équivalent en figure dans ce
chapitre : la page 9 pose la sigmoïde et le biais comme seuil, et
`l2-fig08-sigmoide` comme `l2-fig09-biais-seuil` sont des schémas fixes. La
courbe balayée par un score qui glisse est le seul endroit où quelque chose
bouge. **C'est celle qui vaut la peine d'être reprise.**

---

## 10. Passe LECTURE du 20 septembre 2026 : le fil, le lecteur, le souffle

Cette passe ne touche que `contenu/reseau/`. Elle ne change aucun nombre mesuré,
n'ouvre aucun fichier de scènes, ne relance aucun rendu, et ne modifie aucun
`src`, `animationId`, `alt`, `largeur` ni `hauteur`.

### 10.1 Ce qui a été fait, et par quel moyen

Trois exigences, et un outil pour chacune.

**Le fil.** Chaque bloc a été classé : sur le fil, à déplacer là où sa question se
pose, ou en encart. Le classement n'a pas été fait au jugé mais d'après ce que
douze lecteurs ont rapporté (§10.2). La table de couverture de la source (§4)
reste exacte : aucune notion n'a disparu, trois ont changé de page.

**Le lecteur.** Trois tours. Douze sous-agents au premier, quatre au deuxième,
trois au troisième, chacun ne connaissant que les pages qui précèdent la sienne.
Ils lisent l'export `cours-lecon2-texte.txt`, régénéré avant chaque tour.

**Le souffle.** Lecture à voix haute page par page, plus deux cribles mécaniques :
`node outils/mesurer-pave.mjs reseau` pour la règle 22, et un comptage des
cadratins.

### 10.2 Ce que les lecteurs ont rapporté

Les rapports complets sont dans les transcriptions de session. Ce qui en est
sorti, par ordre de gravité.

| Tour | Ce qui bloquait | Ce qui a été fait |
|---|---|---|
| 1 | **Un terme sur deux arrivait avant sa définition.** Les objectifs de la page 1 lâchaient sept mots inconnus d'un coup ; la page 3 démontrait une proposition sur un modèle jamais écrit ; la page 2 mélangeait octets et réels sans jamais dire qu'on divise par 255 | Objectifs, plan et table des dettes réécrits avec les seuls mots que le lecteur possède ; le modèle $W\mathbf{x}+\mathbf{b}$ posé page 3 avant la proposition 1 ; la division par $255$ écrite page 2, là où le lecteur la réclame |
| 1 | Des blocs répondaient à des questions que personne ne se pose encore | « Ce réseau, et les autres » part page 1 → page 12 ; le lot d'images part page 3 → page 10 et devient un encart ; le tableau des ordres est retiré |
| 2 | **Trois affirmations contredisaient leur propre mesure** | Corrigées, §10.4 |
| 2 | Mes propres corrections avaient introduit des blocages neufs | Corrigés au tour 3 |
| 3 | **Six contradictions et deux nombres faux** que les deux premiers tours n'avaient pas vus, dont trois de ma main | Corrigés, §10.4 |

Le troisième tour est celui qui a payé le plus cher. Un lecteur qui ne bute plus
sur le vocabulaire se met à recouper les nombres, et il trouve alors ce que
personne n'avait vu : que les deux 1 de la planche de la page 2 sont en
troisième et sixième position et non en cinquième, que les $121$ paires de la
page 7 ne sont pas celles que la première ligne écarte, que la page 9 attribue à
$\mathrm{ReLU}$ un prix que le rappel de la même page lui retire, et que le
formulaire de la page 12 met $\mathrm{ReLU}$ sur la couche de sortie.

### 10.3 Le crible des termes

Pour chaque terme et chaque symbole, la page où il est **posé** et la page de sa
**première apparition** dans le texte servi, blocs `alt` exclus. Le script est
dans le bac à sable de la session ; il se refait en une passe sur les douze
fichiers.

Au premier tour : **14 termes employés avant leur définition**. Après la passe :
**6**, et les six sont des faux positifs ou des renvois assumés.

| Terme | Posé | 1re apparition | Pourquoi c'est accepté |
|---|---|---|---|
| seuil | 2 | 1 | Le plan de la page 1 annonce ce que la page 2 établira. Un plan qui ne nomme rien n'est pas un plan |
| rang | 3 | 1 | Collision de mots : le **rang** d'une matrice est un prérequis de la page 1, le **rang** $k$ d'un pixel est posé page 3 |
| neurone | 4 | 1 | Le mot n'apparaît page 1 que dans le titre de la série de Grant Sanderson |
| score | 4 | 1 | Seule occurrence : le titre d'un autre cours, « Fondements probabilistes · Le score et la cote » |
| ReLU | 9 | 7 | **Renvoi assumé.** La sortie de programme de la page 7 imprime `MODELE 3, avec ReLU` et ne se réécrit pas. Une puce ajoutée avant le tableau situe ce modèle et renvoie à la page 9 |
| sigmoïde | 9 | 6 | **Renvoi assumé.** La proposition 5 porte sur le cas $K=2$. Le titre ne nomme plus la sigmoïde, et l'hypothèse dit que la page 9 l'étudie pour elle-même |

### 10.4 Les corrections de fond

Cinq endroits où le texte disait autre chose que ce que la mesure dit. **Aucun
nombre mesuré n'a bougé** : c'est la prose qui a été mise d'accord avec la
sortie de programme.

| Où | Ce qui était écrit | Ce que la sortie dit |
|---|---|---|
| `b-r6-25` | « elle oscille entre $0{,}9061$ et $0{,}9251$ » | Le tableau des époques ne contient pas $0{,}9061$ ; son minimum entre les époques 5 et 30 est $0{,}9176$ |
| `b-r5-15` | « le pourtour est blanc autour d'elle » | Le $7$ passe de $23{,}40$ à $10{,}66$ : son pourtour porte de l'encre |
| `b-r5-15` | « il n'a presque rien dans la bande, et un peu dans le pourtour » | Le $1$ dépose plus dans le pourtour que dans la bande, ce qui est précisément ce qui le fait passer sous zéro |
| `b-r11-10` | « cinq fois plus faibles » | Le rapport des extrêmes affichés vaut à peu près trois |
| `b-r12-8` | $R_{k}$ et $R_{S}$ rangés ensemble sous « Polyèdres convexes » | Les $R_{k}$ cessent d'être convexes avec ReLU, ce que les pages 7, 9 et 11 disent et mesurent. Les deux lignes sont séparées |
| `b-r2-1f-lecture` | « les deux 1, en **cinquième** et sixième position » | La planche donne 7, 2, 1, 0, 4, 1 : ils sont en **troisième** et sixième |
| `b-r7-5` | « Les $121$ cas restants sont les paires que la première ligne écarte » | La première ligne en écarte $750$. Les $121$ sont comptés sur les $5\,000$ paires de départ, comme la sortie l'écrit |
| `b-r12-4` | Ligne « Propagation avant » du formulaire, avec $\mathrm{ReLU}$ sans domaine | Lue seule, elle mettait $\mathrm{ReLU}$ sur la couche de sortie, contre $(10.2)$ et contre le pseudo-code de la même page. La restriction $l<L$ et la ligne $\mathrm{softmax}$ sont rétablies |
| `b-r12-6` | $\mathbb{X}$, « Lot de $B$ images, ordre 3 » | Le lot s'empile dans $A^{[l-1]}$ depuis que la page 10 l'écrit ainsi, et $X$ reste une image. La ligne est refaite |
| `b-r9-14`, `b-r9-32` | La page 9 faisait payer la non-convexité à $\mathrm{ReLU}$, puis l'en dispensait quinze lignes plus bas | L'empilement seul suffit à la faire tomber. Les deux blocs disent maintenant la même chose, et le titre 9.3 ne promet plus un prix qu'il n'impute pas |
| `b-r10-13` | « Plus les couches cachées sont nombreuses et **étroites** » | Les trois architectures citées ont des largeurs 128, 16 puis 32 : la troisième est plus large que la deuxième. La cause annoncée est remplacée par celle qui tient |
| `b-r8-4` | « L'égalité vaut pour **toute** taille de couche intermédiaire … seulement de $128\geq 10$ » | La phrase se démentait elle-même. Elle porte maintenant la condition $h\geq 10$, que l'exercice (c) explore |

Deux endroits où un énoncé dépassait ce qu'il pouvait soutenir :

- `b-r9-32` affirmait que « sans activation, la perte est convexe en
  $\boldsymbol{\theta}$ ». C'est vrai du modèle à une seule couche, pas de la
  famille $\mathcal{H}_{2}$, dont le paramétrage contient un produit de deux
  matrices. L'énoncé est restreint au cas où il tient.
- `b-r3-4` affirmait que « diviser par $256$ au lieu de $255$ change la troisième
  décimale de toutes les précisions du chapitre », sans mesure à l'appui.
  Retiré.

Un majorant qui n'apportait rien : la proposition 4 invoquait le comptage des
régions découpées par $m$ hyperplans pour arriver à $2^{128}$, alors que les
$2^{128}$ parties de $[\![1,128]\!]$ donnent le même majorant en une ligne. Le
théorème admis est retiré, le majorant est inchangé.

### 10.5 Ce que je n'ai pas pu corriger, et qui vous revient

**Trois légendes de figure ont été retouchées, et je le signale plutôt que de le
taire.** La consigne disait de ne pas toucher aux blocs `animation` ni `image` ;
l'acceptation disait « aucun cadratin ». Les trois derniers cadratins du chapitre
étaient dans des champs `legende`. J'ai tranché en modifiant **le seul champ
`legende`**, qui est de la prose servie et ne périme aucun rendu, et en laissant
`src`, `animationId`, `alt` et les dimensions intacts. Si l'arbitrage ne convient
pas, les trois blocs sont `b-r4-20`, `b-r9-8-coupe` et `b-r11-fig15`.

Le reste est hors de mon périmètre :

1. **L'exportateur était cassé, et il ne l'est plus.** Au début de cette passe,
   `outils/exporter-chapitre.mjs` échouait sur `SyntaxError: Unexpected token
   'export'` : il ne retirait pas les alias `export type` avant d'importer
   `sommaires.ts`, et `export type LeconEcrite = Omit<Lecon, "minutes">` le
   faisait tomber. J'ai travaillé sur une copie corrigée, depuis supprimée. Une
   autre passe a corrigé le fichier lui-même entre-temps, et l'export tourne
   aujourd'hui sur l'outil du dépôt. **Rien à faire ici**, sinon savoir que le
   correctif est dans l'arbre de travail et pas encore commité.
2. **L'export affiche encore `undefined min` et `NaN minutes`.** Depuis que le
   champ `minutes` a quitté `sommaires.ts`, l'exportateur lit une durée qui
   n'existe plus au lieu de la calculer par `domaine/duree.ts` : 24 occurrences
   dans `cours-lecon2-texte.txt`. Le lecteur du tour 1 l'a relevé comme le
   premier signal reçu en ouvrant la page 1, et il l'a lu comme « ce texte n'est
   pas fini ».
3. **L'export rend mal trois choses**, et les lecteurs ont buté sur les trois :
   les `\underbrace` deviennent des indices (`d_{l}d_{l-1}_{W^{[l]}}`), les
   environnements `aligned` laissent tomber leurs `&` et leurs `[2mm]` dans le
   texte, et `\sigma` sort parfois en `Σ`. KaTeX rend tout cela correctement dans
   l'application ; c'est l'export qui ment.
4. **La figure `l2-fig06-detecteur` et le texte de la page 5 ne numérotent pas
   les mêmes temps.** La figure appelle « temps deux » le diagramme des scores
   que la sortie appelle « temps 1 », et l'animation `un-neurone-lit-un-bord`
   parle de « trois gestes » quand la page n'en pose que deux. Le texte dit
   maintenant que les colonnes nomment les jeux de poids ; la figure reste à
   arbitrer.
5. **Les numéros de vérification ne suivent pas l'ordre des pages** : 9, puis 11
   (page 4), puis 10 (page 5) ; 17, puis 15, puis 18 sur la page 9. Trois
   lecteurs sur trois s'y sont arrêtés. Les numéros ne se réattribuent pas, donc
   le texte dit maintenant qu'ils ne suivent pas l'ordre de lecture.
6. **Le jeu de données n'est jamais nommé.** « Les auteurs du jeu ont recadré les
   70 000 images » : quel jeu, quels auteurs. Je n'invente pas un nom ; c'est un
   fait à écrire, pas à deviner.
7. **Le compte de 168 détecteurs de la page 11 ne se refait pas** depuis le
   texte. J'avais écrit une construction qui donnait 400 ; elle était de moi et
   fausse, je l'ai retirée. Ce que fait `mesures.py` section 7 doit être lu dans
   le programme et écrit ici.
8. **Le modèle 4 n'affiche pas son protocole**, là où les modèles 1, 2 et 3
   donnent leur pas, leur initialisation et leurs époques.
9. **Les $0{,}63$ point de la page 8 comparent deux modèles retenus par des
   règles différentes.** Celui de la page 6 est pris à sa dernière époque, parce
   que « choisir le meilleur reviendrait à régler le modèle sur le jeu de
   test » ; celui de la page 8 est le meilleur de six pas. Le texte dit
   maintenant que l'écart est un majorant de ce que la couche achète, et la
   conclusion ne bouge pas, mais **les deux protocoles gagneraient à être les
   mêmes**. C'est une question pour `mesures.py`, pas pour le contenu.
10. **Le seuil de `l2-fig09-biais-seuil` est posé à $23{,}4$**, exactement le
    score du $7$, alors que la dérivation demande $\mathbf{w}^{\mathsf{T}}
    \mathbf{x}>s$ : le point tombe sur la barre et reste éteint. Le texte le dit
    désormais ; la figure ne dit pas si son point est plein.

### 10.6 Les blocs déplacés, retirés ou ajoutés

| Bloc | Sort | Pourquoi |
|---|---|---|
| `b-r1-14`, `b-r1-15`, `b-r1-16` | page 1 → page 12 (`b-r12-16b` à `b-r12-16d`) | « Est-ce le bon réseau ? » n'est pas une question qu'on peut avoir avant d'en connaître un |
| `b-r3-11`, `b-r3-12`, `b-r3-13` | page 3 → page 10, fondus en un encart `b-r10-9b` | Rien avant la page 10 ne laisse entendre qu'on traite plusieurs images à la fois. Le tableau des ordres est retiré : il ne répondait à rien, ni page 3 ni page 10 |
| `b-r2-2`, `b-r2-3` | retirés | Le chapitre 1 a établi qu'on ne sait pas écrire la règle à la main. La seule clause neuve est passée dans l'ouverture |
| `b-r2-10b` | ajouté | Le seuil du hasard instruit était nommé par la sortie avant d'être expliqué |
| `b-r3-15b` | ajouté | La proposition 1 portait sur un modèle que rien n'avait écrit |
| `b-r4-22` | ajouté | La page 2 écarte la comparaison à un chiffre modèle, la page 4 montre un gabarit : la tension se lève ici |
| `b-r6-15b` | ajouté | $\mathbf{a}=\mathrm{softmax}(W\mathbf{x}+\mathbf{b})$ n'était écrit nulle part |
| `b-r6-24b`, `b-r6-24c` | ajoutés | Les 670 poids morts promis page 2, et le sens de « époque », « pas », « initialisation » |
| `b-r7-2b` | ajouté | $R_{c}$ apparaissait dans une sortie trois blocs avant sa définition |
| `b-r10-4b` | ajouté | $0{,}9814$ n'existait que dans le pied d'une figure |
| `b-r1-1c`, `b-r2-16b`, `b-r4-7c`, `b-r7-16b` | ajoutés | Quatre intertitres, pour découper les quatre pavés de plus de dix lignes (règles 22 et 23, cas 1 : on découpe, on n'insère rien) |
| `b-r2-16d` | ajouté | La formule du centre de masse était au fil du texte, seule formule du chapitre sans ligne de lecture |

### 10.7 Vérifications

| Commande | Résultat |
|---|---|
| `npx tsc --noEmit` | **0 erreur** |
| `npm run lint` | **0** |
| `node outils/verifier-contenu.mjs` | **aucun échec dans `reseau/`**. Les 43 échecs restants portent tous sur `contenu/retropropagation/`, dont les scènes ne sont pas encore déclarées : ils sont attendus tant que cette passe-là travaille |
| `node outils/mesurer-pave.mjs reseau` | **0 pavé au-dessus de dix lignes**, sur 79 mesurés (4 avant la passe) |
| cadratins dans le texte servi | **0** (63 avant la passe) |
| sections ouvrant par « Proposition N » | **0** (5 avant la passe) |
| crible des termes | **6 renvois**, tous documentés au §10.3 (14 avant la passe) |
| export | régénéré, `cours-lecon2-texte.txt`, 4 637 lignes |

Aucun rendu n'a été relancé, et aucun ne le demande : les huit scènes et les
vingt-deux figures sont inchangées.
