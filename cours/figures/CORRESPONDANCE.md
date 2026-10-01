# La table de correspondance des figures

Ce que la série de Grant Sanderson sur les réseaux de neurones montre, et la
figure du cours qui lui répond.

## Ce que cette table établit

**Aucune image de la source n'entre dans ce dépôt.** Ni téléchargée, ni
décalquée, ni reproduite. Aucun fichier venant de `storage.googleapis.com`
ni d'un autre domaine de la source n'existe ici, et aucun n'y entrera.

Un schéma de réseau — une grille de pixels, une colonne de neurones, un éventail
de connexions — est la représentation standard du domaine. Ce qui appartient à
un auteur est sa réalisation, pas la figure. Chaque ligne de cette table dit
donc : voici l'objet que la source montre à cet endroit, et voici la figure que
le cours produit à la place, avec **nos** données, **notre** architecture,
**notre** palette et **notre** code.

## Comment se lit une ligne

| Colonne | Ce qu'elle donne |
|---|---|
| **la source** | l'objet montré, décrit en une ligne. Description, jamais reproduction |
| **notre figure** | l'objet que le cours montre à la place, et ce qui y change |
| **identifiant** | le nom du fichier sans extension. Il sert de clé, comme l'identifiant d'une scène sert de clé dans le manifeste d'animations |
| **où** | le chapitre et la page où la figure est posée |

Le **programme producteur** est `cours/lecon{N}/figures.py`, fonction du même
numéro que la figure : `l2-fig05-gabarit-zero` sort de `fig05_gabarit`. Le
**texte alternatif** de chaque figure est le champ `alt` de son bloc `image`,
dans le fichier de contenu nommé à la colonne « où ».

## D'où viennent les nombres

Aucune figure ne porte un nombre inventé. `cours/lecon{N}/figures.py` importe
`cours/lecon{N}/mesures.py` et se sert de ses fonctions, avec son protocole :
graine 0, mini-lots de 64, entropie croisée. Un nombre affiché par une figure
est donc calculé par le programme de mesures du chapitre, jamais recopié depuis
une sortie de console.

Deux valeurs échappent à cette règle, et parce qu'elles ne sont pas des
mesures :

- la **géométrie du détecteur de bord** — lignes 8 à 10, colonnes 9 à 21,
  marge de 3 — est *posée* par le cours à la page 5, et `mesures.py` la pose de
  la même façon. `figures.py` la redéclare et recalcule tous les scores ;
- le **seuil** de `l2-fig09-biais-seuil` est le score mesuré de l'image de test
  n°0 au temps 1 du détecteur. Le poser sur un nombre du chapitre plutôt que
  sur un nombre rond évite d'introduire une valeur qui ne vient de nulle part.

## La transposition de palette

| source | cours |
|---|---|
| fond noir | fond papier, `#FFFFFF` |
| traits blancs | encre, `#14120F` |
| surlignage jaune | brique, `#A8442A` |
| connexions blanches | filets gris, faible opacité |
| poids positif / négatif | brique / ardoise `#2A5A78`, échelle symétrique autour de zéro |

**L'inversion du niveau de gris.** Sur fond noir un pixel encré est *clair* ;
sur fond papier il est *sombre*. Les grilles d'entrée du cours sont donc en
niveaux inversés par rapport à la source, et un octet de 254 donne un rond
presque noir.

Aucun arrondi, aucune ombre, aucun dégradé.

## Les 784 ronds

La consigne « on ne dessine pas 784 ronds » vaut pour une **colonne**, où ils
ne tiennent pas. En **grille** 28 × 28 ils tiennent et se lisent :
`l2-fig02-grille` dessine ses 784 ronds, un par pixel, chacun rempli selon son
niveau de gris. Les colonnes de neurones, elles, sont abrégées et **cotées** —
une colonne abrégée sans cote mentirait sur sa taille.

---

# Chapitre 1 de la source · notre chapitre 2

Contenu : `src/serveur/depots/demo/academy/contenu/reseau/`
Programme : `cours/lecon2/figures.py` · Mesures : `cours/lecon2/mesures.py`

| la source | notre figure | identifiant | où |
|---|---|---|---|
| une planche de chiffres manuscrits variés | douze images réelles de notre jeu de test, prises par leur indice, chacune avec son étiquette lue dans le fichier | `l2-fig01-planche` | ch. 2, p. 2 — `p02-jeu.ts` |
| une grille 28 × 28 dont les cases portent leur niveau de gris | l'image de test n°0, un 7, ses **784 ronds**, niveaux inversés, et les trois valeurs citées par le chapitre : (9,7) octet 222, (9,8) octet 254, (13,20) octet 255 | `l2-fig02-grille` | ch. 2, p. 2 — `p02-jeu.ts` |
| la grille reliée par une flèche à une colonne de neurones cotée 784 | la même figure, notre 7, colonne **abrégée et cotée**, x₂₃₁ et x₂₃₂ marqués avec leurs valeurs | `l2-fig03-colonne` | ch. 2, p. 3 — `p03-vecteur.ts` |
| un neurone isolé portant un nombre | le neurone qui note le $0$ : ses $784$ entrées, ses $784$ poids dont deux cotés, son biais $-1{,}3064$ et le seul nombre qu'il rend sur l'image de test n°0, $z=-0{,}7038$ | `l2-fig04-neurone` | ch. 2, p. 4 — `p04-neurone.ts` |
| la couche de sortie, dix neurones étiquetés | dix neurones étiquetés 0 à 9, avec les dix $z$ et les dix $a$ du **modèle de la page 6** mesurés sur l'image de test n°0 | `l2-fig07-sortie` | ch. 2, p. 6 — `p06-couche.ts` |
| l'architecture complète, quatre couches | **notre** architecture, 784 → 128 → 10, couches abrégées et cotées, avec ses 101 770 paramètres et sa précision mesurée — c'est `l2-fig20-le-reseau-entier`, nommée, et elle vient sous $(10.2)$ | `l2-fig10-architecture` | ch. 2, p. 10 — `p10-complet.ts` |
| la décomposition espérée : chiffres → boucles et traits → bords | la même hiérarchie, **et la mesure qui la réfute** : corrélation maximale 0,4894, moyenne 0,0853, aucun couple sur 1 280 au-dessus de 0,50 | `l2-fig13-espoir` | ch. 2, p. 11 — `p11-cache.ts` |
| les poids d'un neurone rangés en grille, positifs et négatifs | **la figure centrale du chapitre** : le gabarit du 0, ses 784 coefficients, maximum +1,0395 en (13,25), minimum −1,4457 en (16,15), à une case et demie du centre géométrique | `l2-fig05-gabarit-zero` | ch. 2, p. 4 — `p04-neurone.ts` |
| la construction d'un détecteur de bord, en trois temps | la même construction, sur nos trois images de test et la tache construite, avec les quatre scores mesurés à chaque temps et le renversement de classement | `l2-fig06-detecteur` | ch. 2, p. 5 — `p05-detecteur.ts` |
| la courbe de la sigmoïde | la même courbe, la tangente de pente 1/4, et les cinq valeurs mesurées par `mesures.py` section 11 | `l2-fig08-sigmoide` | ch. 2, p. 9 — `p09-relu.ts` |
| le biais comme seuil | le même axe gradué deux fois, avec les quatre scores mesurés du détecteur ; le seuil ne bouge pas, la graduation glisse | `l2-fig09-biais-seuil` | ch. 2, p. 9 — `p09-relu.ts` |
| la notation matricielle construite en cinq temps | les mêmes cinq temps, **nos** dimensions : 128 × 784 et 10 × 128 | `l2-fig11-matricielle` | ch. 2, p. 10 — `p10-complet.ts` |
| le compte des paramètres | 101 770, décomposé 100 352 + 128 + 1 280 + 10, et les 98,6 % dans W⁽¹⁾, avec le reste agrandi seul | `l2-fig12-parametres` | ch. 2, p. 10 — `p10-complet.ts` |

**13 lignes, 13 figures.** Aucune ligne de l'inventaire du chapitre 1 de la
source ne reste sans correspondance.

## Huit figures propres au cours, hors inventaire de la source

Elles ne répondent à aucune ligne de l'inventaire : ce sont des figures que le
cours ajoute pour son propre cadrage. Mêmes données, même palette, même code.

| notre figure | identifiant | où |
|---|---|---|
| l'ouverture : une image réelle, une flèche, la boîte $f_{\boldsymbol\theta}$, une flèche, le chiffre lu — argmax de $a^{[2]}$ mesuré sur l'image de test n°0 | `l2-fig00-lecture` | ch. 2, p. 1 — `p01-cadre.ts` |
| le réseau entier, sans un seul symbole : l'image qui entre, trois colonnes cotées $784$, $128$ et $10$, tous les traits entre elles, et la sortie allumée qui mène au chiffre lu — argmax de $a^{[2]}$ mesuré sur l'image de test n°0 | `l2-fig20-le-reseau-entier` | ch. 2, p. 1 — `p01-cadre.ts`, **et p. 10** — `p10-complet.ts` |
| le même $7$ décalé de cinq colonnes, ses deux grilles cotées, et le même trait tombant sur le pixel de rang $231$ à gauche et $236$ à droite — le décalage est posé, l'image est mesurée | `l2-fig19-sept-decale` | ch. 2, p. 4 — `p04-neurone.ts` |
| les dix gabarits sur une **seule** échelle, en deux rangées de cinq — le compagnon fixe de l'animation `les-dix-gabarits` | `l2-fig14-dix-gabarits` | ch. 2, p. 6 — `p06-couche.ts` |
| les quatre modèles en barres d'erreurs, la bande groupant les modèles 2 et 3 à paramètres identiques — le tableau de la section 10 rendu comme figure | `l2-fig15-quatre-modeles` | ch. 2, p. 11 — `p11-cache.ts` |
| deux $4$ du jeu de test, leur milieu pixel par pixel, et la réponse du modèle linéaire sous chacun des trois — le milieu est l'objet dont la page parle et que personne ne peut se représenter | `l2-fig16-milieu-de-deux-quatre` | ch. 2, p. 7 — `p07-plafond.ts` |
| les six pas balayés, les cinq qui convergent, celui qui diverge, et le trait du modèle à $7\,850$ paramètres qu'aucun ne franchit vraiment | `l2-fig17-le-pas-balaye` | ch. 2, p. 8 — `p08-empiler.ts` |
| le trajet complet : cinq quantités, six opérations, chacune portant ce qu'elle vaut sur l'image de test n°0 — la boîte de `l2-fig00-lecture`, ouverte | `l2-fig18-le-trajet-complet` | ch. 2, p. 12 — `p12-synthese.ts` |

Les nombres des quatre modèles (807, 744, 186, 563 erreurs) sont ceux de la
section 10 de `mesures.py`. `figures.py` appelle `section_modele4` pour le
quatrième ; pour le deuxième il refait le **balayage** de la section 6 par
`M.entrainer` — mêmes six pas, mêmes 15 époques, même règle de départ — parce
que `section_modele2` imprime son relevé et ne rend que le modèle retenu, et
que `l2-fig17-le-pas-balaye` a besoin des six points, dont celui qui diverge.
La paire de la page 7 est cherchée de la même façon : protocole de
`_paire_page7`, recherche exhaustive dans l'ordre des indices, arrêtée au
premier couple qui casse.

## Chaque page ouvre sur une figure

Les douze pages du chapitre ouvrent sur une accroche — une question ou un fait,
sans un seul symbole — puis sur une figure. C'est la règle 26. Une page qui
porte plusieurs figures ouvre sur celle qui répond à son accroche ; les autres
restent à leur section.

| page | figure d'ouverture |
|---|---|
| p. 1 — `p01-cadre.ts` | `l2-fig00-lecture`, puis `l2-fig20-le-reseau-entier` |
| p. 2 — `p02-jeu.ts` | `l2-fig01-planche` |
| p. 3 — `p03-vecteur.ts` | `l2-fig03-colonne` |
| p. 4 — `p04-neurone.ts` | `l2-fig04-neurone` |
| p. 5 — `p05-detecteur.ts` | `l2-fig06-detecteur` |
| p. 6 — `p06-couche.ts` | `l2-fig07-sortie` |
| p. 7 — `p07-plafond.ts` | `l2-fig16-milieu-de-deux-quatre` |
| p. 8 — `p08-empiler.ts` | `l2-fig17-le-pas-balaye` |
| p. 9 — `p09-relu.ts` | `l2-fig08-sigmoide` |
| p. 10 — `p10-complet.ts` | `l2-fig20-le-reseau-entier`, la même qu'à la page 1 |
| p. 11 — `p11-cache.ts` | `l2-fig13-espoir` |
| p. 12 — `p12-synthese.ts` | `l2-fig18-le-trajet-complet` |

## Le crible : aucun objet montré avant sa page de définition

Un lecteur l'a dit de la figure 4 : « ça parle de a(66) alors qu'on n'a pas vu
ce qu'est un neurone ». Le défaut n'est pas propre à une figure, et aucun
contrôle automatique ne le voit : `tsc` sort 0, `verifier-contenu.mjs` valide.
Les vingt-et-une figures du chapitre sont donc passées au même crible — pour
chacune, la liste des objets qu'elle montre, et pour chacun la page qui le
définit. **Un objet montré avant sa page de définition est une faute.**

Le crible se relance à la main, en lisant les libellés d'un fichier rendu :

```
grep -o '>[^<>]*</text>' public/cours/lecon2/l2-fig04-neurone.svg
```

### Ce que chaque page définit

| page | ce qu'elle pose, et qui peut dès lors être montré |
|---|---|
| p. 1 | le cadre. $f_{\boldsymbol\theta}$ vient du chapitre 1 |
| p. 2 | l'image $28\times 28$, le pixel, l'octet, l'étiquette, $\mathcal{X}=[0,1]^{28\times 28}$, et les trois notations d'indice — dont $x_{k}$, **composante et jamais exemple** |
| p. 3 | $\mathrm{vec}$, $\mathrm{vec}^{-1}$, le rang $k=28(i-1)+j$, $\mathbf{x}\in[0,1]^{784}$ |
| p. 4 | le neurone, $\mathbf{w}$, $w_{k}$, $b$, $z=\mathbf{w}^{\mathsf T}\mathbf{x}+b$, le gabarit $G=\mathrm{vec}^{-1}(\mathbf{w})$ |
| p. 5 | le détecteur posé à la main : zone, pourtour, les trois temps |
| p. 6 | $W\in\mathcal{M}_{10,784}$, $\mathbf{b}$, $\mathbf{z}$, $\mathbf{a}$, le softmax, le simplexe, la prédiction, $p=7\,850$ |
| p. 7 | la partie convexe, la région de décision, le milieu de deux images |
| p. 8 | l'empilement sans activation ; le **pas** $\eta$ et les époques, posés par la page et dus au chapitre 3 |
| p. 9 | ReLU, la sigmoïde, le biais comme seuil |
| p. 10 | $L$ couches, **l'exposant entre crochets**, $W^{[l]}$, $\mathbf{b}^{[l]}$, $\mathbf{z}^{[l]}$, $\mathbf{a}^{[l]}$, $p=101\,770$, l'architecture $784
ightarrow 128
ightarrow 10$ |
| p. 11 | la couche cachée, le neurone caché, la corrélation, les quatre modèles |
| p. 12 | le trajet complet |

### Les vingt-et-une figures

| figure | page | l'objet le plus tardif qu'elle montre, et sa page | verdict |
|---|---|---|---|
| `l2-fig00-lecture` | 1 | $f_{\boldsymbol\theta}$ — ch. 1 | **corrigée** : la boîte portait « le réseau : 784 → 128 → 10 », qui est de la p. 10. Elle ne porte plus que son nom |
| `l2-fig01-planche` | 2 | l'étiquette, l'indice d'image — p. 2 | conforme |
| `l2-fig02-grille` | 2 | l'octet, la valeur dans $[0,1]$ — p. 2 | **corrigée** : elle cotait ses trois pixels $x_{231}$, $x_{232}$, $x_{356}$, et le rang est de la p. 3. Ils sont cotés par ligne et colonne |
| `l2-fig03-colonne` | 3 | le rang $k=28(i-1)+j$ — p. 3 | conforme |
| `l2-fig04-neurone` | 4 | $z=\mathbf{w}^{\mathsf T}\mathbf{x}+b$ — p. 4 | **refaite** : elle montrait le neurone caché n° 66, une couche, ReLU, $a^{[1]}_{66}$ et « 35 des 128 », soit cinq objets des p. 9, 10 et 11 |
| `l2-fig19-sept-decale` | 4 | $w_{k}$ — p. 4 | conforme |
| `l2-fig05-gabarit-zero` | 4 | $G=\mathrm{vec}^{-1}(\mathbf{w})$ — p. 4 | **corrigée** : son titre disait $G_{0}=\mathrm{vec}^{-1}(\text{ligne }0\text{ de }W)$, et $W$ est de la p. 6 |
| `l2-fig06-detecteur` | 5 | les trois temps — p. 5 | conforme |
| `l2-fig07-sortie` | 6 | le softmax, $\mathbf{a}$ — p. 6 | **refaite** : elle portait $\mathbf{z}^{[2]}$ et $\mathbf{a}^{[2]}$ — l'exposant de couche est de la p. 10 — **et les nombres du réseau à ReLU**, alors que le relevé console de la même page donnait ceux du modèle linéaire. Elle porte maintenant $\mathbf{z}$, $\mathbf{a}$, et les nombres de ce modèle-là |
| `l2-fig14-dix-gabarits` | 6 | la ligne $k$ de $W$ — p. 6 | conforme |
| `l2-fig16-milieu-de-deux-quatre` | 7 | le milieu de deux images — p. 7 | **corrigée** : elle nommait ses images $x_{115}$ et $x_{668}$, alors que $x_{k}$ est une composante (p. 2), et citait « le réseau du chapitre », qui est de la p. 10. Les images portent leur indice, et le renvoi nomme sa page |
| `l2-fig17-le-pas-balaye` | 8 | le pas $\eta$, les époques — p. 8 | conforme : la page les pose elle-même, et les doit au chapitre 3 |
| `l2-fig08-sigmoide` | 9 | $\sigma$ et sa dérivée — p. 9 | conforme |
| `l2-fig09-biais-seuil` | 9 | le seuil $s$ — p. 9 | conforme |
| `l2-fig20-le-reseau-entier` | 1 **et** 10 | aucun symbole : trois cotes, une image, un chiffre | conforme — c'est sa raison d'être |
| `l2-fig10-architecture` | 10 | $W^{[l]}$, $\mathbf{b}^{[l]}$, $p$ — p. 10 | conforme ; elle a reculé sous $(10.2)$, où ces symboles viennent d'être posés |
| `l2-fig11-matricielle` | 10 | $W^{[2]}$, $\mathbf{a}^{[1]}$ — p. 10 | conforme |
| `l2-fig12-parametres` | 10 | $p=101\,770$ — p. 10 | conforme |
| `l2-fig13-espoir` | 11 | le gabarit caché, $
ho$ — p. 11 | conforme |
| `l2-fig15-quatre-modeles` | 11 | les quatre architectures — p. 11 | conforme |
| `l2-fig18-le-trajet-complet` | 12 | $\mathrm{argmax}$, $\mathbf{a}^{[2]}$ — p. 12 | conforme |

**Six fautes, six corrections.** Aucune figure du chapitre ne montre plus un
objet avant la page qui le définit.

## Deux écarts, signalés

L'inventaire de départ annonçait pour le gabarit du 0 un maximum de **+1,0398**
et un minimum de **−1,4472**, « au centre exact ». `cours/lecon2/mesures.py`
donne **+1,0395** en (13,25) et **−1,4457** en (16,15), soit à une case et demie
du centre géométrique (14,5 ; 14,5). Ce sont les valeurs de la mesure, et ce
sont celles que porte la figure ; ce sont aussi celles que le contenu de la
page 4 portait déjà.

L'inventaire annonçait le renversement de classement du détecteur « au temps
2 ». `mesures.py` nomme *temps 1 puis 2* la zone seule et *temps 3* le pourtour
négatif : le renversement a lieu au **temps 3**, et la figure le nomme ainsi.

---

# Chapitre 2 de la source · notre chapitre 3

Contenu : `src/serveur/depots/demo/academy/contenu/descente/`
Programme : `cours/lecon3/figures.py` · Mesures : `cours/lecon3/mesures.py`

*À produire. Le chapitre 2 est livré d'abord ; l'ordre de travail est
chapitre 2, puis 5, puis 4, puis 3.*

| la source | notre figure | identifiant | où |
|---|---|---|---|
| un réseau initialisé au hasard, sortie quelconque | nos cinq coûts initiaux mesurés, et le repère du hasard à 2,302585 | — | — |
| le coût d'un exemple, somme des carrés | notre perte, avec l'écart signalé et la mesure du rapport ×500,5 | — | — |
| le réseau comme fonction : 784 entrées, 10 sorties, p paramètres | la même figure, p = 101 770 | — | — |
| le coût comme fonction : p entrées, une sortie | la même figure, et le statut des données comme paramètre de la définition | — | — |
| une fonction d'une variable et son minimum | la même figure | — | — |
| la bille qui roule le long d'une courbe | la même figure, et celle qui montre sa limite : la bille dépasse par inertie, la descente non | — | — |
| plusieurs vallées | nos trois graines, leurs trois précisions 0,9814 / 0,9823 / 0,9816 | — | — |
| des pas qui rétrécissent près du minimum | notre norme de gradient, de 0,098360 à 0,001886 | — | — |
| une surface au-dessus d'un plan, et la direction de descente | la même figure | — | — |
| le vecteur gradient, ses composantes, leurs signes et leurs tailles | nos 101 770 composantes : rapport 404, 23 882 exactement nulles, percentiles 14,55 / 60,39 / 98,90 % | — | — |

---

# Chapitre 4 de la source · notre chapitre 4

Contenu : `src/serveur/depots/demo/academy/contenu/retropropagation/`
Programme : `cours/lecon4/figures.py` · Mesures : `cours/lecon4/mesures.py`

| la source | notre figure | identifiant | où |
|---|---|---|---|
| le rappel de l'architecture et du coût | la nôtre : les quatre acquis des chapitres 2 et 3, et le gradient de 101 770 nombres qui manque | `l4-fig01-cadre` | ch. 4, p. 2 — `p02-cherche.ts` |
| l'importance relative de deux poids, 3,2 contre 0,1 | **nos deux poids mesurés** : W⁽²⁾₂,₉₂ à −1,201409 contre W⁽²⁾₂,₆₂ à −0,005255, soit 228,6 fois d'écart. Voir la note ci-dessous | `l4-fig02-importance` | ch. 4, p. 2 — `p02-cherche.ts` |
| un exemple unique, une image de 2 | notre image d'entraînement n°5, classe 2, dessinée, avec ses 188 pixels non nuls et ses 57 neurones allumés | `l4-fig03-exemple` | ch. 4, p. 3 — `p03-reclame.ts` |
| la sortie « à jeter » d'un réseau non entraîné | nos dix valeurs mesurées, le repère du hasard à 0,1, et la nuance : la plus grande est la bonne, par accident | `l4-fig04-sortie` | ch. 4, p. 3 — `p03-reclame.ts` |
| le neurone de la classe qu'on veut faire monter, les autres descendre | nos dix composantes de δ⁽²⁾ à l'échelle, une négative à −0,7555 et neuf positives | `l4-fig05-delta` | ch. 4, p. 3 — `p03-reclame.ts` |
| les trois voies : biais, poids, activations précédentes | la même figure, nos trois dérivées mesurées, et la troisième marquée comme non réglable | `l4-fig06-trois-voies` | ch. 4, p. 4 — `p04-biais.ts` |
| les poids ajustés proportionnellement aux activations | notre identité exacte, nos quatre activations avec leurs quatre dérivées, et le quotient constant à −0,755461 | `l4-fig07-proportion` | ch. 4, p. 5 — `p05-poids.ts` |
| Hebb, les connexions qui se renforcent | la mesure du contrôle : les dix poids qui montent le plus, tous vers la classe vraie, et leurs rangs d'activation 1 à 10 | `l4-fig08-hebb` | ch. 4, p. 6 — `p06-hebb.ts` |
| les activations ajustées proportionnellement aux poids | la même figure : deux poids positifs, deux négatifs, et le sens demandé qui s'inverse avec le signe | `l4-fig09-signes` | ch. 4, p. 7 — `p07-activations.ts` |
| les demandes concurrentes des dix neurones de sortie | la même figure, nos dix produits δₖ W_kj, six qui montent, quatre qui descendent, et leur somme | `l4-fig10-demandes` | ch. 4, p. 8 — `p08-somme.ts` |
| la propagation vers l'arrière | la même figure, notre récurrence en quatre temps, et la porte ReLU qui annule 71 des 128 composantes | `l4-fig11-arriere` | ch. 4, p. 9 — `p09-remonter.ts` |
| la moyenne sur tous les exemples | notre mesure : 100,00 % des images de test prédites « 2 » si l'on n'écoute qu'un exemple, et la précision 0,1032 égale à la fréquence de la classe | `l4-fig12-un-exemple` | ch. 4, p. 10 — `p10-un-exemple.ts` |
| les mini-lots | **pas de figure** : renvoi au chapitre 3, où elle est déjà posée. Servir deux fois la même idée dirait qu'on n'avait rien à ajouter | — | ch. 3 |

**13 lignes, 12 figures et un renvoi.** Aucune ligne de l'inventaire du
chapitre 4 de la source ne reste sans correspondance.

## Un écart, signalé

L'inventaire demandait pour « l'importance relative de deux poids » le rapport
**404**, mesuré au chapitre 3 sur l'ensemble du gradient — la plus grande
composante contre la médiane. La figure porte à la place **228,6**, mesuré par
`cours/lecon4/mesures.py`, mesure 3, entre **deux poids d'une même ligne**.

Deux raisons. La première : 228,6 est le rapport de **deux poids**, ce que la
figure de la source montre ; 404 est un rapport entre une composante et une
médiane, qui n'est pas la même chose. La seconde : 404 sort de
`cours/lecon3/mesures.py`, et une figure du chapitre 4 qui l'afficherait
dépendrait d'un entraînement d'un autre chapitre. Le 404 reste cité à sa place,
dans l'encart de la page 2 qui renvoie explicitement au chapitre 3.

---

# Chapitre 5 de la source · notre chapitre 5

Contenu : `src/serveur/depots/demo/academy/contenu/calcul/`
Programme : `cours/lecon5/figures.py` · Mesures : `cours/lecon5/mesures.py`

| la source | notre figure | identifiant | où |
|---|---|---|---|
| un réseau à un neurone par couche | le nôtre, avec ses sept valeurs figées : w⁽¹⁾ = 0,8, w⁽²⁾ = 1,5, w⁽³⁾ = 2,0, et les trois biais | `l5-fig01-reseau` | ch. 5, p. 3 — `p03-chaine.ts` |
| les activations étiquetées par couche | nos notations, exposant entre crochets, et les six quantités calculées de la mesure 1 | `l5-fig02-propagation` | ch. 5, p. 4 — `p04-arbre.ts` |
| le coût d'un exemple | notre perte, ℓ = 0,167786, lue sur la courbe de −ln a⁽³⁾ | `l5-fig03-perte` | ch. 5, p. 4 — `p04-arbre.ts` |
| l'arbre des dépendances | **la figure centrale du chapitre 5** : les quinze nœuds, chacun avec sa valeur mesurée et sa nature, et le seul chemin de w⁽³⁾ à ℓ souligné | `l5-fig04-arbre` | ch. 5, p. 4 — `p04-arbre.ts` |
| l'arbre prolongé vers le haut | le même motif à deux couches, côte à côte, avec δ⁽³⁾ = −0,154465 et δ⁽²⁾ = −0,308931 | `l5-fig05-prolonge` | ch. 5, p. 7 — `p07-precedente.ts` |
| chaque variable sur sa droite graduée | trois axes, une même poussée h, et les deux rapports mesurés | `l5-fig06-droites` | ch. 5, p. 4 — `p04-arbre.ts` |
| la décomposition de la règle de la chaîne en trois rapports | la même chaîne, nos trois valeurs, et le court-circuit ∂ℓ/∂z⁽³⁾ = −0,154465 | `l5-fig07-trois-rapports` | ch. 5, p. 4 — `p04-arbre.ts` |
| les dérivées constitutives | nos trois, chacune rattachée à l'équation dont elle sort, **avec l'écart n° 1 signalé** : la source emploie le coût quadratique, le cours l'entropie croisée | `l5-fig08-derivees` | ch. 5, p. 5 — `p05-derivees.ts` |
| plusieurs neurones par couche, les indices j et k | nos indices i et j, le réseau et la matrice côte à côte, et la vérification de l'ordre matriciel | `l5-fig09-indices` | ch. 5, p. 9 — `p09-indices.ts` |
| un neurone influençant le coût par plusieurs chemins | la même figure, et c'est elle qui écarte la forme simple de la règle de la chaîne | `l5-fig10-chemins` | ch. 5, p. 9 — `p09-indices.ts` |
| la somme sur les chemins | la même somme, à colonne fixée, et la transposée qui en sort | `l5-fig11-somme` | ch. 5, p. 9 — `p09-indices.ts` |
| la figure de synthèse rassemblant les expressions | la nôtre : l'aller et le retour sur une couche, et les trois formules du formulaire | `l5-fig12-synthese` | ch. 5, p. 12 — `p12-synthese.ts` |

**12 lignes, 12 figures.** Aucune ligne de l'inventaire du chapitre 5 de la
source ne reste sans correspondance.

Les deux largeurs des figures 9, 10 et 11 — quatre neurones dans la couche `l`,
cinq dans la couche `l−1` — sont **posées**, comme celles de la scène
`lordre-des-indices-se-verifie`. Ce ne sont pas des mesures, et aucun nombre
mesuré ne les accompagne. La figure 6 porte une poussée notée `h`, sans valeur :
seuls les **rapports** sont mesurés, et eux seuls sont écrits.

---

# Le chapitre 1 du cours

Le chapitre 1 n'a **pas** de correspondant dans la source : il pose le cadre du
parcours, et la source n'en a pas. Ses cinq schémas fixes sont produits par
`cours/lecon1/figures.py` et dérivés de scènes Manim supprimées du chapitre,
non d'une figure extérieure. Ils ne figurent donc pas dans cette table.

| identifiant | d'où il vient |
|---|---|
| `l1-fig1-prerequis` | `panorama/cadre.py` · `LesTroisPrerequis` |
| `l1-fig2-carte` | `panorama/cadre.py` · `LaCarteDuChapitre` |
| `l1-fig3-apports` | `panorama/intuition.py` · `CeQueLhumainFournit` |
| `l1-fig4-deux-carres` | `panorama/perte.py` · `LeCarreEmpecheLaCompensation` |
| `l1-fig5-quadrillage` | `panorama/perte.py` · `LeCarreEmpecheLaCompensation` |
