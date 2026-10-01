# Ce que la source anime, et ce que nous en faisons

Le chapitre 4 suit l'ordre de la troisième vidéo de la série de Grant Sanderson
sur les réseaux de neurones, publiée sous le nom 3Blue1Brown : *What is
backpropagation really doing ?*. Ce fichier note ce que sa **première moitié**
montre, pour que nos huit animations soient écrites en connaissance de cause
plutôt qu'à l'aveugle.

**Comment il a été établi, et ce que cela vaut.** Par la lecture du fichier
d'animations de la vidéo, `_2017/nn/part3.py` du dépôt `3b1b/videos`, sur sa
première moitié — jusqu'à la classe qui construit le gradient à partir de tous
les exemples d'entraînement. Le relevé du chapitre 2 avait été établi en
regardant la vidéo ; celui-ci l'a été en lisant le programme qui la produit.
C'est une source **plus précise sur la géométrie et sur l'ordre des gestes**, et
**muette sur la narration** : ce qu'on entend n'y est pas, sauf quand une chaîne
affichée le dit. Les mentions citées plus bas sont donc des textes **à l'écran**,
jamais des sous-titres.

**Ce fichier ne contient aucune ligne de code de la source.** Il décrit des
gestes et des décisions de composition. Le fichier de travail est resté hors du
dépôt.

**Nos animations ne sont pas des reproductions.** Elles empruntent des *gestes* —
la couche de sortie qui grossit, la flèche sous chaque neurone, les demandes qui
s'additionnent, l'onde qui repart vers la gauche — et refusent tout le reste :
nos nombres sortent de `cours/lecon4/mesures.py`, notre réseau est celui de
`animations/scenes/reseau_mob.py`, notre palette est celle de l'identité, et la
source ne montre nulle part quatre de nos huit objets.

---

## Le fil de la première moitié

| Chez la source | Ce qu'elle fait |
|---|---|
| `LayOutPlan` | Le plan de la vidéo. |
| `InterpretGradientComponents` | Le réseau au coin, un vecteur gradient de **13 002** décimales à côté, un coût qui descend, et la question « une direction dans 13 002 dimensions ?! ». Puis deux poids sont isolés et poussés à la main. |
| `GetLostInNotation` | Un aparté : on se perd dans les notations. |
| `ShowAveragingCost` | Le réseau entier, des images d'entraînement qui défilent à quinze par seconde, et **à droite une copie de la dernière couche** portant la sortie voulue. Une accolade relie les deux et porte « Cost of one example ». |
| `FocusOnOneExample` | Un aparté : concentrons-nous sur un seul exemple. |
| **`WalkThroughTwoExample`** | **La classe centrale.** Un 2 traverse le réseau, la dernière couche grossit, chaque neurone reçoit sa décimale puis sa flèche, on se concentre sur le neurone de la classe 2, on énumère les trois façons de faire monter son activation, on remonte aux neurones précédents, on répète pour les neuf autres sorties, et l'onde repart vers la gauche. |
| `WriteHebbian`, `NotANeuroScientist` | « Hebbian theory », puis la mise en garde : ce n'est pas de la neuroscience. |
| `ConstructGradientFromAllTrainingExamples` | Une grille d'exemples, chacun avec sa bulle de changements demandés, moyennés, puis repliés en un vecteur gradient. |

La graine aléatoire de `WalkThroughTwoExample` est fixée à zéro, et l'exemple
montré est **la première image de classe 2** du jeu d'entraînement. Nous prenons
le même critère — et chez nous il désigne l'image n° 5.

---

## Séquence · Un seul exemple traverse le réseau

**On voit.** Le réseau complet, un peu réduit et poussé vers le bas. L'image d'un
2 se pose au-dessus de la colonne d'entrée, les couches s'allument, et **à droite
apparaît une copie de la dernière couche** où seul le neurone 2 est plein : la
sortie qu'on voudrait. Une double flèche rouge relie les deux colonnes, et une
accolade les surmonte. Puis l'image de travail se déplace le long des trois
faisceaux, qui frémissent à son passage — le geste dit que cet exemple a son mot
à dire sur chaque poids.

**Ce que ça apprend.** La sortie obtenue et la sortie voulue sont **deux objets
côte à côte**, et l'écart entre eux est ce qu'on va chercher à réduire. Le
chapitre n'a rien à démontrer tant que ces deux colonnes n'ont pas été vues
ensemble.

**Notre scène 1** (`limage-cinq-traverse-le-reseau`, page 3) reprend la traversée
et refuse la double flèche : l'écart n'est pas un ornement rouge entre deux
colonnes, c'est le vecteur δ² de notre scène 2, et il a une échelle. Notre image
n'est pas « un 2 » choisi pour l'exemple : c'est l'image n° 5, celle dont toutes
les pages du chapitre citent les nombres, et la sortie qu'elle produit est celle
d'un réseau **non entraîné**, qui accorde 0,2445 à la bonne classe.

---

## Séquence · La dernière couche grossit, et chaque neurone reçoit sa flèche

**On voit.** La dernière couche, ses étiquettes et ses arêtes doublent de taille
et descendent au bas de l'écran ; la copie de droite les suit. Chaque neurone
reçoit **sa décimale**, écrite dans le rond, à une seule décimale. Une mention
s'écrit — « You can only adjust weights and biases » — pendant que toutes les
arêtes du réseau prennent au hasard une couleur et une épaisseur, puis
reviennent. Enfin, **sous chaque neurone, une flèche** : sa longueur vaut l'écart
entre l'activation obtenue et l'activation voulue, multiplié par la hauteur du
rond ; elle est rouge et pointe vers le bas pour les neuf neurones à éteindre,
bleue et retournée pour le neurone 2. Les dix activations glissent alors vers
1,0 et 0,01, puis reviennent d'où elles venaient.

**Ce que ça apprend.** Deux choses, et la seconde est un piège. La bonne : **un
vecteur se montre par ses composantes**, une flèche par neurone, à l'échelle de
l'écart. Le piège : les activations qui glissent vers la valeur voulue **puis
reviennent** montrent un mouvement qui n'existe pas — la scène vient d'écrire
qu'on ne peut agir que sur les poids et les biais.

**Notre scène 2** (`ce-que-la-sortie-reclame`, page 3) garde la barre par
composante et jette l'aller-retour. Nos dix barres portent δ_k **signé**, à
l'échelle mesurée : neuf vers le haut, une vers le bas, et celle-là est aussi
longue que les neuf autres réunies — ce que la source ne fait pas voir, parce que
ses longueurs sortent de la lecture du **dessin**, et non d'un calcul. Chez nous,
la longueur d'une barre est un nombre de `mesures.py`.

**Notre scène 6** (`la-porte-relu-ne-laisse-rien-passer`, page 9) reprend la même
forme — un vecteur, une barre par composante — sur les 128 demandes de la couche
cachée. La source ne montre jamais un vecteur de cette taille par ses
composantes ; elle n'en montre que dix.

---

## Séquence · Les trois façons de faire monter une activation

**On voit.** Tout s'efface sauf le neurone 2, son étiquette, sa décimale, sa
flèche et ses arêtes entrantes. La somme pondérée s'écrit à côté, sous une
sigmoïde. Trois lignes s'inscrivent à gauche : **augmenter b**, **augmenter wᵢ**,
**changer aᵢ**. Puis les quatre arêtes venant des neurones les plus allumés
s'illuminent, les neurones correspondants se décalent, et la mention « in
proportion to aᵢ » vient se poser sous la deuxième ligne. Les cinq neurones les
plus éteints se décalent à leur tour, sans que rien ne s'illumine.

**Ce que ça apprend.** L'énumération est le squelette du chapitre : trois prises
sur une même somme, et une seule des trois n'est pas un paramètre. Et le mot
« proportionnel » n'est pas asséné : il est **montré par contraste**, les arêtes
brillantes d'un côté, les neurones éteints de l'autre.

**Notre scène 3** (`le-biais-ne-passe-par-rien`, page 4) ne garde que la première
prise, et la mesure : la dérivée par rapport à b²₂ vaut −0,755461, et c'est
exactement δ₂. Le biais ne passe par rien, et le nombre le dit.

**Notre scène 4** (`proportionnel-a-lactivation`, page 5) garde le contraste et
lui donne son chiffre : quatre traits vers le neurone de la classe 2, épaissis en
proportion de l'activation d'où ils partent — 1,5903 contre 0,0070, soit un
rapport de 228,6 — et le quotient correction sur activation identique pour les
quatre. La source écrit « in proportion to aᵢ » ; nous montrons le quotient.

---

## Séquence · Remonter aux neurones précédents, puis aux neuf autres sorties

**On voit.** Une flèche apparaît à **gauche** de chaque neurone de la couche
précédente, tournée selon le signe du poids qui la relie au neurone 2 et
dimensionnée sur l'épaisseur du trait. Les arêtes positives se détachent en une
pile dans un coin, puis reviennent ; les négatives de même. Un cadre entoure la
colonne, avec « No direct influence », qui devient « Just keeping track ». Puis
les autres neurones de sortie reviennent **un par un** : chacun apporte ses
propres flèches, et un **signe +** se glisse devant les précédentes. Après cinq,
un « ⋯ + » remplace l'énumération, les cinq derniers arrivent d'un coup, et
« Propagate backwards » s'écrit en haut. La dernière couche est alors masquée par
un rectangle opaque, et il ne reste que la somme des flèches, recollée contre la
colonne cachée. Enfin, le même geste recommence une couche plus à gauche.

**Ce que ça apprend.** C'est le cœur de la vidéo, et le geste est juste : les
demandes **s'additionnent**, elles ne s'arbitrent pas ; le signe + entre deux
flèches est l'argument tout entier. Et le retour est présenté comme une
**récurrence** : le même geste, une couche plus à gauche.

**Notre scène 5** (`dix-demandes-sur-un-meme-neurone`, page 8) resserre cela sur
**une** activation, celle du neurone caché 92, et lui donne des nombres : dix
produits δ_k W²_kj, six qui demandent de monter, quatre de descendre, et un total
de +0,006402 alors qu'aucune demande n'était nulle. La source montre des flèches
dont la force vient du trait ; nous montrons dix valeurs dont la somme est un
nombre que le programme imprime.

**Notre scène 7** (`londe-revient-de-la-sortie`, page 12) garde la récurrence et
refuse le rectangle opaque : chez nous, rien ne disparaît sous un aplat. L'onde
remonte de la sortie vers l'entrée, couche après couche, et le geste est joué
deux fois — une passe se lit comme un incident, deux passes identiques se lisent
comme une règle. C'est la seule de nos huit scènes qui ne porte aucun nombre :
ce qu'elle établit est une **direction**, et une direction n'a pas de cote. Elle
refuse aussi une facilité que la source s'autorise : chez elle les activations
glissent pendant le retour ; chez nous elles ne bougent pas, parce que la passe
arrière n'en change aucune.

---

## Ce que la source ne montre nulle part

| Notre scène | Pourquoi la source ne l'a pas |
|---|---|
| 6 · `la-porte-relu-ne-laisse-rien-passer` (page 9) | Son réseau est à sigmoïde : il n'a pas de porte qui coupe. Aucune de ses activations n'est exactement nulle, donc aucune demande n'est exactement annulée. Notre ReLU en éteint 71 sur 128, et c'est mesuré. |
| 8 · `necouter-quun-seul` (page 10) | Elle affirme qu'il faut moyenner sur tous les exemples, et le montre par une grille d'exemples. Elle ne montre **jamais** ce qui arrive si l'on n'écoute qu'un seul : nos 200 pas sur l'image n° 5 amènent le réseau à répondre 2 sur les dix mille images de test, et la précision tombe sur 0,1032, la fréquence de la classe. |
| 3 · `le-biais-ne-passe-par-rien` (page 4) | Elle range le biais dans une liste de trois prises, sans jamais mesurer que sa dérivée **est** δ, sans facteur. |
| 4 · `proportionnel-a-lactivation` (page 5) | Le mot « proportionnel » y est écrit ; le quotient n'y est jamais calculé. |

Il y a aussi ce que la source montre et que nous **refusons** de reprendre :

- **Les activations qui glissent vers la valeur voulue puis reviennent.** Une
  scène qui vient d'écrire qu'on ne peut pas toucher aux activations ne peut pas
  les faire bouger. La page 7 de notre chapitre est bâtie sur cette distinction.
- **Les arêtes qui prennent au hasard une couleur et une épaisseur** pendant
  qu'une mention s'écrit. C'est de la décoration, et elle ment : des épaisseurs
  tirées au sort ressemblent à des poids.
- **Les flèches dont la valeur est lue sur le trait.** La source récupère le
  signe d'une demande en comparant la **couleur** d'une arête à une couleur de
  référence, et sa force en lisant l'**épaisseur du trait**. Le dessin est donc
  la source de vérité du dessin. Chez nous, c'est l'inverse : le nombre vient de
  `mesures.py`, et l'épaisseur en découle.
- **Le rectangle noir opaque** posé sur la dernière couche pour la faire
  disparaître. Notre règle de composition met au décor, elle ne masque pas.

---

## Les méthodes partagées de la source, et ce que la nôtre fait à la place

`animations/scenes/reseau_mob.py` et
`animations/scenes/retropropagation/retro_mob.py` tiennent ensemble le rôle de
`NetworkScene`, `NetworkMobject` et `WalkThroughTwoExample` chez elle.

| Chez la source | Ce qu'elle fait | Chez nous |
|---|---|---|
| `ShowAveragingCost.setup_network` | Réduit le réseau, le pousse vers le bas et colore ses arêtes selon le signe des poids. | `ReseauScene.construire_reseau` pose la même géométrie une fois pour tout le chapitre, et laisse les arêtes au voile gris : chez nous la couleur est réservée à **ce qui bouge**, jamais à un état permanent. |
| `ShowAveragingCost.setup_diff_words` | Une copie de la dernière couche, à droite, avec une double flèche et une accolade « Cost of one example ». | Rien. L'écart entre obtenu et voulu est δ², il a dix composantes et une échelle : il se montre en barres, pas en double flèche. |
| `show_desired_activation_nudges` | Une flèche par neurone de sortie, longueur proportionnelle à l'écart entre activation obtenue et voulue, vers le bas ou vers le haut selon le cas. | `barres_delta` de `retro_mob.py` : une barre par composante, longueur proportionnelle à δ_k lu dans `mesures.py`, brique pour ce qui bouge. L'échelle est **cotée** : la barre la plus longue porte sa valeur. |
| `get_neuron_nudge_arrow`, `get_edge_value` | La longueur et le signe d'une flèche sont lus sur l'épaisseur et la couleur du trait dessiné. | Aucun nombre n'est lu sur un mobject. `retro_mob.py` ne connaît que les tableaux rendus par `mesures.arriere`. |
| `show_decimals` | Écrit l'activation **dans** le rond, à une décimale. | Nos ronds de sortie ont 0,3 d'unité de rayon : un nombre n'y tient pas lisiblement. Les valeurs se posent à côté, à la taille du corps. |
| `focus_on_one_neuron` | Retire de la scène tout sauf le neurone étudié, en le faisant disparaître. | `effacer_le_reseau(sauf=[…])` : le reste passe à 0,3 et reste là. Le lecteur doit pouvoir situer le neurone dans son réseau. |
| `show_other_output_neurons` | Ramène les sorties une par une, chacune ajoutant ses flèches derrière un signe `+`. | Scène 5 : les dix produits arrivent l'un après l'autre sur la même activation et s'empilent en une somme cotée. Le `+` de la source est un signe ; chez nous c'est un total qu'on peut vérifier. |
| `show_recursion` | Rejoue le geste une couche plus à gauche, avec des copies d'arêtes retournées. | Scène 7 : `vague_arriere` de `retro_mob.py` fait remonter la cascade de `reseau_mob._vague` **dans l'autre sens**, couche après couche. |
| `ConstructGradientFromAllTrainingExamples` | Une grille d'exemples, chacun avec sa bulle de changements demandés, moyennés en un gradient. | Rien : c'est le chapitre 5. Le nôtre s'arrête à ce qu'un exemple demande, et la scène 8 montre ce qu'il en coûte de s'y tenir. |

Deux choses de la source ne sont reprises nulle part : son réseau embarqué, à
sigmoïde et pré-entraîné — le nôtre est le 784 → 128 → 10 à ReLU **non entraîné**
de `mesures.init()`, graine 0 — et son fond noir.
