# Ce que la source anime, et ce que nous en faisons

L'ordre des notions du chapitre 2 suit celui de la série de Grant Sanderson sur
les réseaux de neurones, publiée sous le nom 3Blue1Brown. Ce fichier note ce que
sa première vidéo **montre**, séquence par séquence, pour que nos huit animations
soient écrites en connaissance de cause plutôt qu'à l'aveugle.

Il a été établi en regardant la vidéo (18 min 29 s) : une planche d'orientation
d'une trame toutes les 30 s, puis six planches d'une trame toutes les 5 s sur les
fenêtres où la narration parle de neurones, de couches, de poids, de pixels,
d'activations, de bords, de sigmoïde, de biais ou de matrices. Les classes de son
fichier d'animations ont été lues pour dix d'entre elles seulement, celles qui
construisent le réseau ou les poids.

**Ce fichier ne contient aucune ligne de code de la source, aucune trame, aucun
sous-titre.** Il décrit, il ne recopie pas. Les fichiers de travail
(vidéo, sous-titres, planches, relevé complet des séquences) sont restés hors du
dépôt.

**Nos animations ne sont pas des reproductions.** Elles empruntent des *gestes* —
la grille qui se déplie, la ligne de poids qui se replie en image, la lumière qui
traverse — et refusent tout le reste : nos nombres sortent de
`cours/lecon2/mesures.py`, notre réseau est un 784 → 128 → 10 à ReLU entraîné par
nous, notre palette est celle de l'identité, et trois de nos huit scènes montrent
des choses que la source ne montre nulle part.

---

## Séquence 03:05 → 03:50 · La grille devient 784 nombres

**On voit.** La grille 28 × 28 d'un 9, cotée 28 à gauche et 28 en haut par deux
accolades. `28 × 28 = 784` s'inscrit à droite. Une case s'entoure, sa valeur part
dans un rond isolé — 0,28, puis 0,58, puis 0,20 — et le mot « Activation »
s'écrit à côté. Puis les 28 lignes de la grille se détachent, s'écartent en
escalier, et se rangent en une colonne unique cotée 784.

**On entend.** Que le réseau commence par un neurone pour chacun des 28 × 28
pixels, soit 784 en tout, et que chacun retient un nombre entre 0 et 1.

**Ce que ça apprend.** Le passage du pixel au nombre se fait *une case à la
fois*, jamais 784 d'un coup : c'est ce qui rend le nombre 784 crédible plutôt
qu'assené. Et l'aplatissement est un mouvement continu — aucune case n'apparaît,
aucune ne disparaît, elles changent de place.

**Notre scène 1** (`le-7-devient-784-nombres`, page 3) reprend le geste et change
l'objet : notre chiffre est l'image de test n° 0, un 7, celle dont la page 3
parle déjà ; nos quatre cases entourées sont celles dont le texte cite les
octets ; et nos rangs sont calculés, cotés, vérifiables. La source montre un
pixel quelconque ; nous montrons les quatre pixels dont le lecteur vient de lire
les numéros.

---

## Séquence 01:52 → 02:25 et 03:50 → 05:35 · La lumière traverse

**On voit.** Le réseau complet apparaît d'un coup, colonne d'entrée cotée 784,
couches cachées, dix ronds de sortie étiquetés 0 à 9. Puis cinq images de test
passent l'une après l'autre — un 9, un 7, un 2, un 1, un 6 — chacune dans son
cadre à gauche ; à chaque passage les couches s'allument de la gauche vers la
droite, les arêtes s'illuminent par vagues, et un cadre entoure le rond de sortie
retenu. Entre deux images, tout s'éteint.

**On entend.** Que les activations d'une couche déterminent celles de la
suivante, et que l'activation des dix derniers neurones dit à quel point le
système croit à chaque chiffre.

**Ce que ça apprend.** L'aperçu ne démontre rien et ne prétend rien : il montre
que la machine répond, plusieurs fois de suite, avant qu'on sache pourquoi. La
répétition sur trois ou cinq images fait tout le travail — une seule image
passerait pour un tour de passe-passe.

**Notre scène 2** (`la-lumiere-traverse`, page 2) fait exactement cela, sur trois
images de test et sans un mot d'explication. Une honnêteté que la source ne
s'impose pas : chez elle, une couche abrégée s'allume à une *moyenne* de ses
activations, un résumé qui n'est l'activation d'aucun neurone. Nos ronds portent
l'activation réelle du neurone qu'ils désignent, et l'abréviation, si elle est
nécessaire, est cotée.

---

## Séquence 09:20 → 09:50 · La ligne de poids se replie en image

**On voit.** La somme pondérée `w₁a₁ + w₂a₂ + ⋯ + wₙaₙ` s'écrit en haut de
l'écran. Les 784 poids d'un neurone se rangent alors en une grille 28 × 28 : le
vert code le positif, le rouge le négatif, l'opacité la valeur absolue. La grille
est d'abord un bruit vert et rouge.

**On entend.** Qu'il est commode de penser ces poids comme organisés en une
petite grille à eux.

**Ce que ça apprend.** C'est le geste central de tout le chapitre, et c'est
l'aplatissement joué à l'envers : une ligne de 784 nombres se replie en une image
qu'on peut regarder. Une fois ce geste vu, « lire un gabarit » n'a plus besoin
d'être expliqué.

**Notre scène 3** (`le-gabarit-du-0`, page 4) replie une ligne *mesurée* — la
ligne 0 de la matrice du modèle linéaire — et non un bruit ; puis elle pose une
vraie image de test dessus pour montrer où l'encre tombe. La source ne fait
jamais cette superposition ; c'est elle qui transforme une jolie image en
argument. Palette : brique pour le positif, bleu pour le négatif, échelle
symétrique autour de zéro — le vert et le rouge de la source ne survivent pas
sur fond papier, et ne se distinguent pas l'un de l'autre pour un daltonien.

---

## Séquences 08:20 → 09:20 et 09:50 → 10:15 · Un neurone lit un bord

**On voit.** « What are these connections actually doing ? », puis le réseau se
réduit à un seul neurone caché et à ses 784 arêtes. Un rectangle bleu délimite
une petite région de la grille. Les poids s'affichent en liste — `p₁: 1,00` …
`p₈: 0,02`, puis `w₁: 2,07` … `w₈: 1,07`. Presque tous les poids passent ensuite
à zéro : il ne reste qu'une bande verte horizontale. L'image d'un 7 se glisse
sous la grille. Enfin un pourtour rouge s'ajoute autour de la bande.

**On entend.** Qu'on assigne un poids à chaque connexion, qu'on met des poids nuls
partout ailleurs, et des poids négatifs sur le pourtour pour que le neurone ne
réponde qu'à un bord isolé.

**Ce que ça apprend.** Le détecteur se **construit sous les yeux**, en trois
gestes séparés : la bande, l'image dessous, le pourtour négatif. Chaque geste est
une décision, pas une illustration.

**Notre scène 4** (`un-neurone-lit-un-bord`, page 5) garde les trois gestes et
leur ajoute ce que la source ne montre jamais : le **score** que le neurone
produit sur trois vraies images, recalculé après chaque geste, et l'ordre de ces
trois scores qui s'inverse quand le pourtour passe à −1. La source affirme que le
pourtour négatif corrige ; nous le mesurons.

---

## Séquence 13:40 → 15:10 · Une ligne de W est un neurone, une colonne est un pixel

**On voit.** Les poids se rangent en tableau : des lignes `w₀,₀ … w₀,ₙ`,
`w₁,₀ … w₁,ₙ` entre crochets, multipliées par le vecteur colonne des activations,
plus le vecteur des biais, le tout entouré par la sigmoïde. L'écriture se compacte
jusqu'à `σ(W a + b)`.

**On entend.** Qu'on range les poids en une matrice dont chaque **ligne**
correspond aux connexions arrivant à un neurone de la couche suivante.

**Ce que ça apprend.** Le vocabulaire visuel dont nous avons besoin : une ligne
de W est un neurone, une colonne de W est un pixel d'entrée. Sans cette lecture,
permuter des colonnes ne veut rien dire.

**Notre scène 7** (`le-reseau-melange`, page 6) emprunte ce tableau et lui fait
dire autre chose : les 784 cases de l'image se réordonnent, les 784 colonnes de W
se réordonnent de la même façon, et les dix scores ne bougent pas. La source ne
mélange jamais rien ; la démonstration est la nôtre, et c'est la proposition de
la page 3 rendue visible.

---

## Séquence 17:55 → 18:29 · La ReLU

**On voit.** `ReLU(a) = max(0, a)` et sa ligne brisée tracée sur des axes : plate
à gauche de zéro, de pente 1 à droite. La sigmoïde est rappelée à côté.

**On entend.** L'analogie biologique — au-delà d'un seuil le neurone laisse
passer, en deçà il ne s'active pas — et que les réseaux modernes n'emploient
presque plus la sigmoïde.

**Ce que ça apprend.** La ReLU est présentée **comme une courbe**, sur des axes,
loin du réseau.

**Notre scène 6** (`relu-coupe`, page 9) ne trace pas la courbe : le chapitre l'a
déjà tracée en figure fixe. Elle montre l'extinction *sur le réseau* — les
neurones à préactivation négative s'éteignent, leurs arêtes sortantes
disparaissent, et le compte des survivants s'inscrit. La source ne montre jamais
une ReLU appliquée à une couche entière.

---

## Ce que la source ne montre nulle part

Trois de nos huit scènes n'ont pas de séquence d'origine. Elles ne sont pas des
emprunts, et il ne faut pas y chercher un modèle :

| Notre scène | Pourquoi la source ne l'a pas |
|---|---|
| 5 · `empiler-ne-change-rien` (page 8) | La source ne pose jamais la question d'une couche sans activation. Elle empile parce que c'est l'usage ; notre chapitre démontre d'abord que sans ReLU l'empilement ne sert à rien. |
| 7 · `le-reseau-melange` (page 6) | Le tableau de W lui est emprunté, la permutation non. C'est notre proposition 1, et la source ne s'y intéresse pas. |
| 8 · `deux-4-et-leur-milieu` (page 7) | La source ne parle pas de convexité. C'est l'argument le plus original du chapitre, et il n'a aucun précédent visuel. |

Il y a aussi ce que la source montre et que nous **refusons** de reprendre : les
neurones cachés présentés comme détecteurs de boucles et de traits (06:05 →
07:00). La page 11 mesure cet espoir et le réfute. Une animation qui l'affirmerait
mentirait sur ce que notre propre réseau fait.

---

## Les méthodes partagées de la source, et ce que la nôtre fait à la place

`animations/scenes/reseau_mob.py` joue le rôle que tiennent chez elle
`NetworkScene` et `NetworkMobject`. Les correspondances, une à une :

| Chez la source | Ce qu'elle fait | Chez nous |
|---|---|---|
| `NetworkScene.setup` | Ajoute le réseau à la scène avant `construct`, de sorte qu'il est là dès la première trame. | `ReseauScene.setup` fait la même chose, et c'est la même raison : le réseau est présent de la première à la dernière trame. |
| `NetworkMobject.get_layer` | Une couche trop grande est abrégée à 16 ronds, avec `⋮` au milieu et une accolade portant la vraie taille. | `_colonne` abrège de la même façon, mais le seuil est **mesuré** : les 128 ronds ne sont abrégés que si un rond descend sous 8 px à 1080p. L'accolade cotée est reprise telle quelle : c'est elle qui empêche l'abréviation de mentir. |
| `NetworkMobject.activate_layer` | Remplit chaque rond avec une opacité égale à l'activation ; pour une couche abrégée, remplit avec une **moyenne** par bloc — un nombre qui n'est l'activation d'aucun neurone. | `propagation` n'affiche jamais de moyenne. L'opacité d'un rond est l'activation du neurone qu'il désigne, normalisée par le maximum de sa couche. Un rond abrégé est un rond absent, pas un rond menteur. |
| `NetworkScene.feed_forward` / `show_activation_of_layer` | Calcule les activations avec un réseau pré-entraîné embarqué, puis transforme chaque couche, de la gauche vers la droite. | `propagation(indice)` lit les poids de `cours/.donnees/l2-modeles.npz`, écrits par `cours/lecon2/mesures.py` — les mêmes poids que ceux dont sortent tous les nombres du chapitre. Aucun réseau n'est entraîné dans une animation. |
| `NetworkMobject.get_edge_propogation_animations` | Copie un groupe d'arêtes, le passe en jaune 1,5× plus épais, et joue une création-puis-destruction en cascade. | `_vague` fait la même cascade en brique sur le voile gris. Le jaune de la source est la couleur d'accent de Manim ; la nôtre est celle de l'identité. |
| `PixelsFromVect` | Transforme un vecteur de 784 nombres en une grille de carrés. | `_grille` fait de même, en niveaux de gris **inversés** : sur fond papier, l'encre est sombre. La source travaille sur fond noir, encre claire. |
| `PreviewMNistNetwork.get_image_to_layer_one_animation` | Les cases d'encre de l'image se transforment en les ronds de la colonne d'entrée, et disparaissent. | `pixels_vers_couche` reprend le geste, et son seuil : seules les cases dont l'octet est non nul s'envolent. |
| `PreviewMNistNetwork.reset_display` | Éteint toutes les couches entre deux images. | `eteindre()`. |
| `remove_random_edges` | Supprime 70 % des arêtes pour que le dessin reste lisible. | Nous les gardons toutes, à opacité 0,08 : le voile dit la densité vraie. `en_evidence(liste)` remonte à 0,9 les arêtes dont on parle. |

Deux choses de la source ne sont reprises nulle part : son réseau embarqué (nos
poids sont les nôtres, mesurés) et son fond noir (l'identité impose le papier).
