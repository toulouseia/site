# Ce que la source anime, et ce que nous en faisons

Le chapitre 5 traite du même sujet que la quatrième vidéo de la série de Grant
Sanderson sur les réseaux de neurones, publiée sous le nom 3Blue1Brown : le
calcul de la rétropropagation, mené sur un réseau réduit à un neurone par
couche. Ce fichier note ce que **son code d'animation** construit, méthode par
méthode, pour que nos huit scènes soient écrites en connaissance de cause
plutôt qu'à l'aveugle.

Il a été établi en lisant le fichier `_2017/nn/part3.py` du dépôt `3b1b/videos`,
seconde moitié. Quatorze classes y sont définies ; une seule porte le calcul, et
c'est la première : **`SimplestNetworkExample`**, vingt-neuf méthodes appelées à
la suite. Les treize autres sont des interludes — un professeur et ses élèves,
un cerveau en SVG, la théorie hebbienne, les mini-lots, deux écrans vides
réservés à un montage extérieur. Elles ne concernent pas ce chapitre.

**Ce fichier ne contient aucune ligne de code de la source, aucune trame,
aucun sous-titre.** Il décrit, il ne recopie pas.

**Nos animations ne sont pas des reproductions.** Elles empruntent des
*gestes* — le réseau qui se réduit à un neurone par couche, l'arbre des
dépendances, les droites graduées où une poussée se propage — et refusent tout
le reste. Trois écarts valent d'être posés d'emblée, parce qu'ils rendent une
partie de la source inutilisable telle quelle :

| | La source | Nous |
|---|---|---|
| Le réseau | quatre couches, une activation σ partout | 1 → 1 → 1 → 1, **ReLU** sur les deux couches cachées, σ en sortie |
| Le coût | l'écart au carré, `C₀ = (a⁽ᴸ⁾ − y)²` | l'**entropie croisée binaire** |
| Les nombres | choisis pour la démonstration | tous imprimés par `cours/lecon5/mesures.py` |

La conséquence est immédiate sur le premier facteur de la chaîne. Chez elle,
`∂C₀/∂a⁽ᴸ⁾ = 2(a⁽ᴸ⁾ − y)`, et il faut ensuite le multiplier par σ′(z). Chez
nous, l'entropie croisée et la sigmoïde se simplifient l'une l'autre et
`δ³ = a³ − y` **directement** : la mesure 1 imprime les deux chemins l'un sous
l'autre pour que la simplification se voie (mesures.py:175-183). C'est un
résultat que la source n'a pas à montrer, et que nous ne pouvons pas ne pas
montrer.

---

## `collapse_ordinary_network` et `show_weights_and_biases` · Le réseau se réduit

**Ce que le code construit.** Un réseau ordinaire, plusieurs neurones par
couche, dont les arêtes se contractent jusqu'à ne laisser qu'un neurone par
couche — quatre en tout. Les arêtes gardent en chemin leur couleur, bleue pour
un poids positif, rouge pour un négatif, et leur épaisseur proportionnelle au
module. Puis une expression `C(w₁, b₁, w₂, b₂, w₃, b₃)` s'écrit ; chaque arête
se transforme en son poids, chaque neurone en son biais, et les six variables
sont mélangées puis mises en évidence l'une après l'autre.

**Ce que ça apprend.** Le réseau minuscule n'est pas posé comme un exemple
choisi : il est **obtenu** en écrasant un vrai réseau. Le spectateur voit d'où
il vient, et le coût apparaît d'emblée comme une fonction de six nombres.

**Notre scène 1** (`le-reseau-minuscule`) garde les quatre ronds et le fait que
les six coefficients sont les variables, et change tout le reste. Elle ne part
pas d'un réseau ordinaire — le chapitre 4 a déjà montré le réseau profond, et
le refaire ici serait le montrer deux fois. Elle pose les sept valeurs figées
de `MINUSCULE` (mesures.py:98-107) et fait ce que la source ne fait jamais :
la **propagation avant, poste par poste**, jusqu'à la perte. Chez elle les
activations sont des décimales qui défilent pour suggérer une variation ; chez
nous chaque rond est rempli à son activation mesurée, et l'écran porte
`a³ = 0,845535` parce que c'est le nombre, pas un ordre de grandeur.

Le bleu et le rouge de la source ne survivent pas : sur fond papier ils ne se
distinguent pas l'un de l'autre pour un daltonien, et l'identité n'a que
l'encre et la brique.

---

## `break_into_computational_graph` · L'arbre des dépendances

**Ce que le code construit.** Le réseau se transforme en un graphe orienté.
Trois nœuds d'entrée — `w`, `a`, `b` — en haut, reliés vers le bas à un nœud
`z` ; de `z` un trait vers `a` ; de `a` et de `y`, deux traits qui convergent
vers `C₀` en bas. Les traits s'allument en jaune à mesure qu'ils paraissent.
Une méthode suivante, `show_preceding_layer_in_computational_graph`, fait
apparaître un instant l'étage précédent au-dessus, puis le retire.

**Ce que ça apprend.** C'est le geste central de toute la vidéo : passer du
réseau, où l'on voit des neurones, au graphe, où l'on voit **de quoi chaque
chose dépend**. Sans lui, la règle de la chaîne n'a pas d'objet sur quoi se
poser.

**Notre scène 2** (`larbre-des-dependances`) reprend le graphe et inverse son
sens de construction. La source le bâtit de haut en bas, des entrées vers le
coût, et n'en montre qu'un étage — le suivant est un aperçu qui disparaît.
Nous partons de **ℓ** et nous faisons pousser l'arbre **vers le haut**, sur ses
trois étages entiers, jusqu'aux sept feuilles. La raison n'est pas graphique :
la dérivation se lit dans ce sens-là, et un arbre qui pousse depuis les entrées
raconterait la propagation avant, que la scène 1 vient de montrer.

Le jaune d'accent de la source est la couleur par défaut de sa bibliothèque ;
la nôtre est la brique de l'identité, et elle ne sert qu'à ce qui bouge.

---

## `show_number_lines`, `ask_about_w_sensitivity`, `show_chain_of_events` · La poussée

**Ce que le code construit.** À côté de chaque nœud du graphe — `w`, `z`, `a`,
`C₀` — une droite graduée sur l'intervalle unité, portant un point coloré à la
valeur courante, et une flèche qui va du nom du nœud à son point. Le point de
`w` est poussé vers la gauche ; les points de `z`, `a` et `C₀` se déplacent
alors sur leurs droites, entraînés par une mise à jour continue. Des notations
`∂w`, `∂z`, `∂a`, `∂C₀` s'inscrivent au-dessus et au-dessous des droites, et des
flèches montrent que chacune entraîne la suivante.

**Ce que ça apprend.** La dérivée partielle cesse d'être un symbole : c'est un
**rapport de deux déplacements** qu'on voit se produire. Et la chaîne est une
chaîne de causes, pas une identité algébrique.

**Notre scène 3** (`trois-droites-graduees`) garde les droites, les points et
la propagation de la poussée, et en retient **trois** au lieu de quatre — w, z
et ℓ — parce que les deux rapports que le chapitre nomme sont
`∂z³/∂w³ = 1,100` (mesures.py:179) et `∂ℓ/∂z³ = −0,154465` (mesures.py:183).
Elle ajoute ce que la source ne fait pas et qui est le cœur de l'affaire : la
poussée est ensuite **divisée par dix**, les graduations s'écartent d'autant, et
les deux rapports réapparaissent **identiques, chiffre pour chiffre**. Chez
elle, une poussée unique, de taille arbitraire, laisse ouverte la question de
savoir si le rapport en dépend ; le passage à la limite est dit, il n'est pas
montré.

Un détail que nous refusons : chez elle, la valeur affichée suit le point qui
se déplace. Chez nous la valeur reste à sa place. Elle dit où la variable était
quand on a commencé ; la faire suivre le point afficherait une valeur poussée
que rien n'a mesurée.

---

## `show_chain_rule`, `name_chain_rule`, `compute_derivatives` · Le produit

**Ce que le code construit.** Le produit `∂C₀/∂w = (∂z/∂w)(∂a/∂z)(∂C₀/∂a)`
s'écrit, les trois fractions alignées à droite d'un signe égal, chacune bâtie
par transformation des symboles de poussée déjà à l'écran. Un rectangle entoure
l'équation entière et une étiquette « Chain rule » s'y accroche. Puis chaque
facteur est calculé en recopiant le membre droit de la formule correspondante.

**Ce que ça apprend.** Chaque facteur **sort d'une équation déjà écrite** ; le
produit n'est pas une formule à retenir mais un assemblage de trois
substitutions.

**Ce que nous n'en gardons pas.** Le rectangle et son étiquette : la règle du
chapitre n'admet aucune boîte, et nommer une formule dans une animation est du
texte, pas un objet. Les trois fractions substituées non plus — c'est une
manipulation symbolique, elle se lit mieux en figure fixe qu'en mouvement, et
la page la porte déjà.

Ce que nous en gardons est le **résultat** : le produit des trois facteurs vaut
`−0,169912` et le court-circuit donne `−0,154465` (mesures.py:182-183). Ces
deux nombres sont dans la scène 1 et la scène 3, à leur place.

---

## `animate_long_path` · Le chemin qui remonte les couches

**Ce que le code construit.** Un long chemin, du nœud du coût vers l'arrière à
travers les nœuds intermédiaires de plusieurs couches, tracé et mis en évidence
d'un bout à l'autre pour faire voir la structure récursive.

**Ce que ça apprend.** Que le même motif se répète d'une couche à l'autre, et
que la récurrence est cela : un motif, pas une formule par couche.

**Notre scène 4** (`la-recurrence-se-deroule`) fait descendre le signal d'erreur
sur trois barreaux, δ³ puis δ² puis δ¹, chacun portant sa valeur mesurée —
`−0,154465`, `−0,308931`, `−0,463396` (mesures.py:186, 190, 194). Puis elle
fait ce que la source ne fait nulle part : elle écrit le **produit déroulé** en
un seul trait, les six facteurs dans l'ordre où la mesure 1 les imprime
(mesures.py:200), et montre qu'il donne **le même nombre**, à un écart nul
(mesures.py:201-203). La source affirme que la récurrence et le produit sont la
même chose ; nous le vérifions à l'écran, sur des nombres.

---

## Ce que la source ne montre nulle part

Quatre de nos huit scènes n'ont pas de séquence d'origine, et il ne faut pas y
chercher un modèle. Ce sont, sans exception, les quatre scènes où **une matrice
est dessinée comme un tableau de coefficients** — et ce n'est pas une
coïncidence : la seconde moitié de `part3.py` ne dessine aucune matrice. Elle
en écrit une, une seule fois, en `show_gradient` : un vecteur colonne entre
crochets, des symboles empilés. La forme vectorielle de la rétropropagation
n'est pas son sujet ; elle est celui de notre page 10.

| Notre scène | Pourquoi la source ne l'a pas |
|---|---|
| 5 · `la-jacobienne-est-diagonale` | La source ne pose jamais la question de savoir si la jacobienne d'une activation est diagonale. Elle travaille sur des scalaires, où la question ne se pose pas. C'est notre proposition 6, et la mesure 6 la contrôle sur 400 coefficients. |
| 6 · `le-softmax-ne-se-vide-pas` | Le contre-exemple. La source n'emploie pas de softmax dans cette vidéo, et n'a donc aucune raison de montrer une jacobienne qui ne soit pas diagonale. |
| 7 · `le-signal-sattenue` | L'atténuation en profondeur n'est pas traitée. La source s'arrête à quatre couches et ne mesure pas ce que la traversée coûte au signal. La mesure 3 le fait sur cinq couches et sur deux activations, aux mêmes poids. |
| 8 · `le-gradient-est-un-produit-exterieur` | Le produit extérieur ne paraît pas : sur un réseau à un neurone par couche, `δ (a)ᵀ` est un nombre fois un nombre. Il faut la forme vectorielle pour qu'il y ait un tableau à remplir. |

Il y a aussi ce que la source montre et que nous **refusons** de reprendre.
`get_lost_in_formulas` fait tourner quatre formules en rond pour mettre en scène
la confusion du spectateur ; `fire_together_wire_together` illumine deux
neurones sous la citation « Neurons that fire together wire together », que la
classe `WriteHebbian` prolonge. Ce sont des effets de narration, et le second
est une affirmation sur le cerveau que notre chapitre ne fait pas. Le chapitre 4
avait déjà jeté sa propre scène de pochoir hebbien pour la même raison ; il n'y
a pas lieu de la réintroduire ici.

---

## Les méthodes partagées de la source, et ce que la nôtre fait à la place

`animations/scenes/calcul/calcul_mob.py` joue, pour ce chapitre, le rôle que
tiennent chez elle les méthodes de construction de `SimplestNetworkExample`.
Les correspondances, une à une :

| Chez la source | Ce qu'elle fait | Chez nous |
|---|---|---|
| `collapse_ordinary_network` | Fabrique le réseau à un neurone par couche en contractant un réseau ordinaire. | `ReseauMinuscule` le pose directement, et reprend de `reseau_mob.py` — **gelé** — les conventions du rond, de l'arête et du retrait, pour que les deux réseaux du cours se ressemblent. Les correspondances sont citées ligne à ligne dans son en-tête. |
| `label_neurons` | Pose `a⁽ᴸ⁾` et `a⁽ᴸ⁻¹⁾` avec des flèches vers leurs neurones, et une note précisant que ce ne sont pas des exposants. | Nos étiquettes sont posées sans flèche, sous le rond qu'elles désignent. L'indice de couche est en exposant partout, sur `a`, `z`, `w`, `b` et `δ` : une seule convention, et aucune note pour la rattraper. |
| `show_number_lines` | Une droite graduée par nœud, chacune à son échelle, avec une flèche du nom vers le point. | `droite_graduee` dessine l'axe et ses crans, et rien d'écrit : les nombres sont posés par la scène, à la taille du corps. Huit graduations chiffrées sur 4,4 unités se recouvriraient. |
| `ask_about_w_sensitivity` | Déplace les points par mise à jour continue pendant que le premier est poussé. | Les trois déplacements sont **calculés depuis les deux rapports mesurés** et joués l'un après l'autre. Une mise à jour continue aurait laissé le rapport réel invisible ; ici la longueur du second segment EST le rapport. |
| `show_chain_of_events` | Fait apparaître `∂z` et `∂a` entre `∂w` et `∂C₀`, avec des flèches de l'un à l'autre. | La scène 3 ne pose que deux rapports, en cote brique, dans la bande libre de droite. Aucune flèche : le crible signale un trait posé sur une surface, et une flèche entre deux droites graduées en est un. |
| `name_chain_rule` | Entoure l'équation d'un rectangle et l'étiquette. | Rien. Aucune boîte dans ce chapitre. |
| `indicate_everything_on_screen` | Fait clignoter et frémir tous les objets de l'écran l'un après l'autre. | Rien. Un seul sujet est à pleine opacité par trame, ce qui est exactement le contraire. |
| `show_gradient` | Empile les dérivées moyennées en un vecteur colonne entre crochets. | `Tableau` dessine une matrice case par case, et une case remplie dit qu'un coefficient est là — pas ce qu'il vaut. Ce que la mesure relève, c'est un compte et un module maximal, jamais 4 096 valeurs. |
| les treize autres classes | Professeur et élèves, cerveau SVG, bulles de dialogue, mini-lots, écrans réservés. | Rien n'en est repris. |

Deux choses de la source ne sont reprises nulle part : ses personnages, et son
fond noir. L'identité impose le papier, et un chapitre de calcul n'a pas besoin
qu'on lui dise qu'il est difficile.
