# La source : `3b1b/videos`, `_2017/nn/part2.py`

Ce que la deuxième vidéo de 3Blue1Brown sur les réseaux de neurones met à
l'écran, séquence par séquence, relevé sur le fichier public
`_2017/nn/part2.py` du dépôt `3b1b/videos` (3 791 lignes, 62 classes).

**Aucune ligne n'en est recopiée.** Ce relevé sert à décider *ce qu'il y a à
montrer* — pas comment le dessiner. La source travaille sur fond noir, en bleu
et rouge, avec des personnages qui commentent ; nos scènes travaillent sur fond
papier, à l'encre et à la brique, sans commentaire. Ce qui se reprend est
l'**objet mis en mouvement**, jamais la mise en scène.

Le relevé couvre les classes qui héritent de `NetworkScene` — directement ou
par `PreviewLearning`, `IntroduceCostFunction`, `TestPerformance` — et celles
dont le nom parle de réseau, de gradient, de coût, de surface ou de bille.

---

## §1 — `PreviewLearning` (l. 142), la classe mère

**À l'écran.** Le réseau 784 → 16 → 16 → 10 en entier, réduit à 70 % et posé en
bas du cadre. Chaque arête est colorée par le signe de son poids et son
épaisseur suit le cube de son poids relatif, bornée à 3 : les poids faibles
deviennent invisibles, les forts se détachent. En haut à gauche, une mention de
progression.

**Ce qui bouge.** `activate_network` : une copie de toutes les arêtes s'illumine
en cascade avec un décalage, pendant que les couches se transforment vers leur
état d'activation. `backprop_one_example` remonte ensuite les couches **à
l'envers**, de la sortie vers l'entrée, en superposant au réseau une seconde
série d'arêtes dont l'épaisseur code la correction et la couleur son signe. Le
réseau réel est modifié entre deux images : les poids descendent d'un pas.

**Ce que ça apprend.** Qu'apprendre, c'est modifier les arêtes, et que la
modification se propage de la fin vers le début. C'est la seule séquence de la
vidéo où l'on voit le réseau changer pendant qu'on le regarde.

**Ce qu'on en reprend.** Le geste d'activation en cascade, couche après couche.
Rien de la rétropropagation : elle est du chapitre 4.

## §2 — `IntroduceCostFunction` (l. 585), la sortie d'un réseau non entraîné

**À l'écran.** Un seul neurone caché d'abord, isolé, avec ses arêtes entrantes
et la formule de la somme pondérée à côté. Puis le réseau entier revient. Une
image de chiffre se pose dans un coin, ses pixels se changent en petits ronds
qui filent vers la colonne d'entrée, et le réseau s'active. La colonne de sortie
porte ses dix étiquettes.

**Ce qui bouge.** `reminder_of_weights_and_bias` fait osciller les arêtes du
neurone isolé et change leur couleur au hasard, sous la mention « Initialize
randomly » — l'initialisation est jouée comme un geste, pas énoncée.
`feed_in_example` (l. 780) transporte les pixels vers la couche d'entrée.
`make_fun_of_output` (l. 825) entoure la colonne de sortie et la qualifie.

**Ce que ça apprend.** Que les poids ne viennent de nulle part, et que la sortie
qui en résulte ne vaut rien. Les dix valeurs sont visiblement inégales alors
qu'aucune n'a de raison de l'être.

**Ce qu'on en reprend.** Deux choses : *l'initialisation jouée* (les arêtes qui
prennent leur valeur au hasard), et *la sortie quelconque lue sur la colonne*.
Pas le cadre de dérision : nos étiquettes ne commentent pas.

## §3 — `IntroduceCostFunction`, suite : d'où sort un coût (l. 842, 883)

**À l'écran.** La dernière couche seule, dédoublée : à gauche celle que le
réseau produit, à droite celle qu'on voudrait — un seul rond plein. Entre les
deux, une flèche double. Puis, à gauche, dix lignes de carrés d'écart empilées,
et une accolade qui les rassemble sous « Cost of » et la vignette de l'image.

**Ce qui bouge.** Les dix ronds de chaque colonne se changent en dix nombres
décimaux ; les nombres se rangent dans les parenthèses des dix termes ; les
termes se rassemblent sous une accolade.

**Ce que ça apprend.** Qu'un coût est une **mesure d'écart entre deux colonnes
de dix nombres**, et qu'il se moyenne ensuite sur tout le jeu.

**Ce qu'on en reprend.** Rien directement : notre coût est l'entropie croisée,
pas la somme des carrés, et le chapitre l'écrit plutôt qu'il ne le dessine.

## §4 — `SingleVariableCostFunction` (l. 1440), **la bille**

La séquence la plus longue du fichier, et la seule qui contienne la bille.

**À l'écran.** Le coût des treize mille poids se réduit au coût d'une seule
variable sous une accolade, puis un repère se dessine et une parabole s'y trace.
Un point jaune marque son minimum, avec un trait vertical pointillé jusqu'à
l'axe et la condition de dérivée nulle. La parabole se change alors en une
courbe à **deux vallées** inégales.

**Ce qui bouge, dans l'ordre.**

1. `find_exact_solution` : le minimum se marque, la dérivée nulle s'écrit.
2. `make_function_more_complicated` : la courbe simple devient la courbe à deux
   vallées ; la solution exacte est déclarée hors d'atteinte.
3. `take_steps` : deux flèches, une à gauche une à droite, avec un point
   d'interrogation chacune — on ne sait pas de quel côté aller.
4. `take_steps_based_on_slope` : une tangente se pose au point courant ; la
   flèche du mauvais côté s'efface ; le point se déplace du bon côté. Recommencé
   à un autre endroit, où c'est l'autre flèche qui survit. Puis trois pas
   rapprochés qui se resserrent autour du creux.
5. `ball_rolling_down_hill` : **le point devient un cercle creux**, lâché à
   gauche, et il roule le long de la courbe. Puis onze billes sont posées d'un
   coup sur toute la largeur et roulent en même temps ; chacune s'arrête dans le
   creux au-dessus duquel elle se trouvait, et elles ne finissent **pas toutes
   dans le même**.
6. `note_step_sizes` : la tangente reste visible pendant six pas qui se
   réduisent de moitié à chaque fois, en approchant du creux.

**Ce que ça apprend.** Deux choses, et la deuxième contredit la première : que
descendre revient à suivre la pente ; et que là où on arrive dépend d'où on
part.

**Un détail qui compte, et que la source assume.** Sa bille est **fausse comme
bille**. `update_point` déplace l'abscisse de moins la pente fois le pas de
temps : c'est la règle de descente, pas la mécanique. Une vraie bille a de
l'inertie, dépasse le premier creux et peut finir dans le second. Celle de la
source n'en a pas. La ressemblance avec une bille est donc une **image**, et
l'image ment sur deux points : elle promet une inertie qu'il n'y a pas, et un
mouvement continu là où il y a des pas de longueur proportionnelle à la pente.

**Ce qu'on en reprend.** Les deux vallées, le point qui suit la pente, les pas
qui se resserrent, et surtout le mensonge de la bille — que notre scène montre
au lieu de le taire, en faisant rouler une vraie bille à côté.

## §5 — `FunctionMinmization` (l. 541), dix départs sur une même courbe

**À l'écran.** Un repère, une courbe à deux creux, et dix points posés à dix
abscisses entières, teintés d'un dégradé.

**Ce qui bouge.** Les dix points descendent **en même temps**, chacun en
retranchant à son abscisse la pente sous lui, pendant dix secondes. Ils se
répartissent entre les deux creux selon leur point de départ.

**Ce que ça apprend.** Que la destination est fixée par le départ, et qu'un même
algorithme sur une même fonction donne des réponses différentes.

**Ce qu'on en reprend.** Le geste exact — plusieurs départs simultanés, plusieurs
arrivées — pour nos trois graines.

## §6 — `TwoVariableInputSpace` (l. 1819), le gradient comme direction

**À l'écran.** Un quadrillage occupant la moitié du cadre, nommé « Input
space ». Un point s'y pose, et huit flèches en partent aux huit directions de la
boussole.

**Ce qui bouge.** Les sept flèches qui ne sont pas la bonne s'effacent ; celle
qui reste se change en une flèche plus longue, nommée par le symbole du
gradient. Une copie pivote ensuite d'un demi-tour : la direction de descente.

**Ce que ça apprend.** Que le gradient se définit par comparaison avec toutes
les autres directions, et que descendre, c'est prendre son opposé.

**Ce qu'on en reprend.** L'éventail de directions autour d'un point, et la
flèche unique qui s'en détache. C'est la forme de notre scène du lot : l'éventail
y devient celui des gradients de lot, et la flèche unique le gradient complet.

## §7 — `ShowFullCostFunctionGradient` (l. 1974), les arêtes deviennent un vecteur

**À l'écran.** Le réseau entier, arêtes colorées. Puis plus que six nombres
décimaux entre deux crochets, avec des points de suspension au milieu, sous la
mention des 13 002 poids et biais.

**Ce qui bouge.** Les couches disparaissent ; les arêtes s'écartent puis se
**transforment en les décimales du vecteur**, les trois premières vers les trois
premières, toutes les autres vers les points de suspension. Une deuxième colonne
apparaît à droite : l'opposé du gradient. Puis, composante par composante,
chaque valeur de la deuxième colonne vole vers la première et **s'y ajoute** :
la décimale de gauche change de valeur sous les yeux.

**Ce que ça apprend.** Que les paramètres forment **un seul vecteur**, que le
gradient en est un autre de même forme, et qu'un pas est l'addition des deux,
coordonnée par coordonnée.

**Ce qu'on en reprend.** Le passage du réseau à la colonne de nombres. Pas les
13 002 : notre réseau en a 101 770.

## §8 — `NonSpatialGradientIntuition` (l. 2157), ce qu'une composante dit

**À l'écran.** À gauche la colonne des poids, en dessous la colonne de l'opposé
du gradient : six décimales signées, colorées par leur signe.

**Ce qui bouge.** `show_sign_interpretation` : chaque poids se déplace à côté de
sa composante et reçoit « should increase » ou « should decrease » selon le
signe. `show_magnitude_interpretation` : un rectangle se dessine autour des
chiffres de chaque décimale puis se **change en un qualificatif** — « a little »,
« somewhat », « a lot » — selon que la valeur absolue passe 0,2 puis 0,5.

**Ce que ça apprend.** Qu'une composante porte **deux informations distinctes** :
un signe, qui est une direction, et une amplitude, qui est une importance
relative. Et que les amplitudes sont très inégales.

**Ce qu'on en reprend.** L'inégalité des amplitudes — mais mesurée, pas
qualifiée : là où la source écrit « a lot », nous écrivons le rapport de la plus
grande à la médiane.

## §9 — `GradientNudging` (l. 2576), le pas répété

**À l'écran.** Le réseau réduit dans le coin bas-droit ; en haut à gauche,
l'opposé du gradient et une colonne de huit décimales.

**Ce qui bouge.** Les décimales se changent en une copie des arêtes qui vient se
poser sur le réseau. Puis, **dix fois de suite** : toutes les arêtes changent
d'épaisseur et de couleur d'un mouvement décalé ; les huit décimales changent de
valeur ; la mention « Recompute gradient » paraît et s'efface.

**Ce que ça apprend.** Que l'entraînement est ce cycle-là, répété : calculer le
gradient, faire le pas, recalculer. Et que le gradient **n'est pas le même** à
chaque tour.

**Ce qu'on en reprend.** Que le gradient se recalcule et change de taille. La
source le fait varier au hasard ; nous prenons les normes mesurées, qui
décroissent.

## §10 — `TwoGradientInterpretationsIn2D` (l. 2431), l'importance relative

**À l'écran.** Un quadrillage plein cadre, une forme quadratique en deux
variables en haut à gauche, son gradient en un point en haut à droite : deux
composantes, trois et un.

**Ce qui bouge.** La flèche se trace depuis le point : direction de plus forte
montée. Puis les deux composantes se séparent et deviennent une comparaison :
la première variable a trois fois l'effet de la seconde. `wiggle_in_neighborhood`
fait enfin osciller le point selon chaque axe, plus fort selon la première.

**Ce que ça apprend.** Que le rapport de deux composantes est un rapport
d'influence, lisible sans quitter le plan.

**Ce qu'on en reprend.** L'idée que le rapport entre composantes est la chose à
montrer. Notre rapport est mesuré sur les 101 770 composantes vraies.

## §11 — Les surfaces : `CostSurface` (l. 1926), `CostSurfaceSteps` (l. 2139), `ParaboloidGraph` (l. 2568), `KAGradientPreview` (l. 1943)

**Ces quatre classes sont vides.** Elles héritent de `ExternallyAnimatedScene` :
un marqueur qui réserve la place d'une image produite par un autre logiciel —
Grapher — et incrustée au montage. La surface de coût en relief, la plus connue
de la vidéo, **n'est pas dans ce fichier**.

**Ce que ça apprend, sur la méthode.** Que la surface 3D n'a pas été jugée
nécessaire en Manim. C'est un argument : une coupe en une variable porte tout ce
que le chapitre démontre, et le relief n'ajoute qu'une profondeur qu'on ne
mesure pas.

**Ce qu'on en reprend.** La décision. Nos scènes de surface sont des **coupes**.

## §12 — `EmphasizeComplexityOfCostFunction` (l. 1214), le coût est une fonction

**À l'écran.** Le réseau encadré en haut, une flèche vers le bas, et sous elle
« Cost: 5.4 ». À côté, trois lignes : entrée, sortie, paramètres.

**Ce qui bouge.** Le réseau se réduit et monte ; le titre « Neural network
function » devient « Cost function » ; « Input » et « Output » échangent leurs
contenus — ce qui était l'entrée du réseau (une image) devient le paramètre, et
ce qui était le paramètre (les poids) devient l'entrée. La sortie devient
« 1 number ».

**Ce que ça apprend.** Le renversement qui fonde le chapitre : **le coût est une
fonction des poids, à valeurs dans un seul nombre, et les données y sont fixes.**

**Ce qu'on en reprend.** Le renversement lui-même. Il est porté par nos scènes
de surface, dont l'axe est un paramètre et non une donnée.

## §13 — `SomeConnectionsMatterMoreThanOthers` (l. 2318)

**À l'écran.** Le réseau dont toutes les arêtes s'effacent, sauf une.

**Ce qui bouge.** Une arête se trace en jaune vers la couche de sortie, avec une
mention ; puis elle s'efface et une autre se trace, avec une mention opposée.

**Ce que ça apprend.** Que les poids n'ont pas la même importance — la version
qualitative de ce que le §8 chiffre.

**Ce qu'on en reprend.** Le geste d'effacement qui isole : c'est exactement notre
règle du décor à 0,3, déjà en vigueur dans `reseau_mob.py`.

## §14 — Les classes de performance : `TestPerformance` (l. 2772), `InterpretFirstWeightMatrixRows` (l. 2998), `InputRandomData` (l. 3090), `CannotDraw` (l. 3228), `ContinuouslyRangingNeuron` (l. 2727), `TrainOnImages` (l. 3547), `WrongExamples` (l. 2963)

**À l'écran.** Le réseau entraîné qui traite des images de test l'une après
l'autre, avec une fraction « nombre correct sur nombre vu » qui monte ; les
lignes de la première matrice de poids affichées comme images 28 × 28 ; du bruit
présenté au réseau, qui répond quand même avec assurance.

**Ce qui bouge.** Des images qui défilent, un compteur qui s'incrémente, des
gabarits qui se dévoilent.

**Ce que ça apprend.** Ce que le réseau a appris, et ce qu'il n'a pas appris.

**Ce qu'on en reprend : rien.** C'est le chapitre 2, déjà rendu. Le compteur est
en outre exclu par la règle.

## §15 — Les classes parlées : `YellAtNetwork` (l. 1123), `NetworkGrowthMindset` (l. 1412), `LocalVsGlobal` (l. 1810), `ConfusedAboutHighDimension` (l. 2142), `ManyMinimaWords` (l. 3689), `NotAtAll` (l. 2973), `AskNetworkAboutMemorizing` (l. 3598), `SomethingToImproveUpon` (l. 3272), `GradientDescentAlgorithm` (l. 1946), `GradientDescentName` (l. 1964), `IntroduceDeepNetwork` (l. 3594), `ConvolutionalNetworkPreview` (l. 3448), `CompareLearningCurves` (l. 3616)

**À l'écran.** Des personnages qui parlent, ou du texte seul qui s'écrit :
l'algorithme en trois lignes, le nom « Gradient descent », « Many local minima,
similar cost », « 13 002-dimensional nudge? ».

**Ce que ça apprend.** Ce sont les liants du film : ils annoncent, résument,
signalent une difficulté.

**Ce qu'on en reprend : rien.** Une animation de l'Academy ne porte pas de
phrase — la page en porte, et elle est mieux placée pour cela. La seule
information retenue de ce bloc est l'énoncé de `ManyMinimaWords` : plusieurs
minima locaux de coût comparable. Nos trois graines le mesurent au lieu de
l'affirmer.

---

## Ce que le relevé décide, en une page

| Ce que la source fait | Ce qu'on en fait |
|---|---|
| §1, §2 — l'initialisation jouée, la sortie quelconque lue sur la colonne | repris tel quel, sur notre réseau et nos poids |
| §4 — la bille qui roule, et qui ment | repris **et retourné** : on montre le mensonge |
| §5 — plusieurs départs, plusieurs arrivées | repris pour les trois graines |
| §6, §10 — l'éventail de directions, la flèche qui s'en détache | repris pour le lot contre le gradient complet |
| §7, §8 — le réseau devient un vecteur, les composantes sont inégales | repris, avec l'inégalité **mesurée** |
| §9 — le gradient se recalcule et change | repris, avec les normes mesurées |
| §11 — la surface 3D est hors Manim | décision reprise : nos surfaces sont des coupes |
| §3, §13, §14, §15 | non repris |

**Ce que la source fait et que nous ne ferons pas**, en plus des personnages :
remplir un rond abrégé avec la moyenne d'un bloc de neurones ; faire varier un
gradient au hasard pour donner l'air du mouvement ; écrire une phrase à l'écran.
