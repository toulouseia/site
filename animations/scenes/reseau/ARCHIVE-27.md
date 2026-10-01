# Les vingt-sept animations retirées du chapitre 2

Le chapitre 2 portait vingt-sept animations, une à trois par page, écrites
avant que le réseau soit dessiné. Huit les remplacent, toutes construites sur le
même réseau — `animations/scenes/reseau_mob.py` — et sur les mêmes poids que les
nombres du chapitre.

**Ce fichier n'est pas une liste de regrets.** Les textes alternatifs et les
nombres de ces vingt-sept scènes sont du travail vérifié : une description
alternative dit ce qu'une figure montre à qui ne la voit pas, et elle reste
juste même quand la figure change. Ils sont gardés ici pour être repris, en
figure fixe ou en animation, plutôt que réécrits de zéro.

Ce qui a disparu, ce sont les fichiers de scène — le code Manim de chaque
scène. Il est reconstructible depuis ces descriptions, et il ne servait plus :
aucune des vingt-sept ne partageait le réseau, chacune redessinait le sien.

## Ce qui remplace quoi

| ancienne | page | devient |
|---|---|---|
| `ce-que-ce-chapitre-ne-fait-pas` | 1 | — retirée |
| `le-plan-du-chapitre` | 1 | — retirée |
| `le-centre-de-masse-tient-la-grille` | 2 | — retirée |
| `le-jeu-se-compte` | 2 | — retirée |
| `la-grille-se-deplie-en-vecteur` | 3 | `le-7-devient-784-nombres` |
| `la-permutation-ne-change-rien` | 3 | — retirée |
| `la-somme-se-separe-par-signe` | 4 | — retirée |
| `le-poids-devient-une-image` | 4 | `le-gabarit-du-0` |
| `lencre-tombe-sur-le-rouge` | 4 | — retirée |
| `construire-un-detecteur-de-bord` | 5 | `un-neurone-lit-un-bord` |
| `la-tache-large-trompe-le-compteur` | 5 | — retirée |
| `le-pourtour-negatif-remet-lordre` | 5 | — retirée |
| `le-score-devient-une-loi` | 6 | — retirée |
| `les-dix-gabarits` | 6 | — retirée |
| `la-region-est-convexe` | 7 | — retirée |
| `un-seul-gabarit-par-classe` | 7 | — retirée |
| `cent-mille-parametres-pour-rien` | 8 | — retirée |
| `deux-matrices-nen-font-quune` | 8 | `empiler-ne-change-rien` |
| `la-relu-decoupe-lespace` | 9 | — retirée |
| `la-sigmoide-ecrase-la-droite-reelle` | 9 | — retirée |
| `le-biais-est-loppose-du-seuil` | 9 | — retirée |
| `le-reseau-est-une-fonction` | 10 | — retirée |
| `lecriture-matricielle-en-cinq-temps` | 10 | — retirée |
| `les-erreurs-regardees-une-a-une` | 11 | — retirée |
| `lespoir-des-bords-nest-pas-verifie` | 11 | — retirée |
| `la-question-du-chapitre-suivant` | 12 | — retirée |
| `les-objets-du-chapitre-se-rangent` | 12 | — retirée |

Quatre des huit nouvelles ne prennent la place d'aucune : elles arrivent
là où le chapitre n'avait rien.

| nouvelle | page | ce qu'elle y fait |
|---|---|---|
| `la-lumiere-traverse` | 2 | l'aperçu : trois images traversent le réseau, sans un mot |
| `le-reseau-melange` | 6 | la proposition 1, rendue visible sur la matrice qui vient d'être posée |
| `deux-4-et-leur-milieu` | 7 | la convexité, sur la paire que la page cite |
| `relu-coupe` | 9 | l'extinction, montrée sur la couche plutôt que sur une courbe |

Les quatre qui « deviennent » ne sont pas des renommages : la scène est
réécrite, sur le réseau partagé, avec les nombres de `mesures.py`. Le nouvel
identifiant est neuf, et la règle du dépôt tient — un identifiant n'est jamais
réattribué.

---

## `ce-que-ce-chapitre-ne-fait-pas`

**La boucle d'apprentissage, amputée de sa dernière case**  
page 1 · Page 1 · Ce que ce chapitre laisse au suivant, après le tableau des dettes · geste : effacement sélectif

Notions : geste : effacement sélectif, boucle d'apprentissage, propagation avant, dette de cours

Ce qui s'écrivait à l'écran : « une image » · « une prédiction » · « un écart mesuré » · « corriger les paramètres » · « chapitre 3 »

Nombres :

- `cases` = 4
- `cases_traitees` = 3

**Description alternative.** Quatre cases rectangulaires se dessinent aux quatre coins d'un carré imaginaire et se relient par des flèches, dans le sens des aiguilles d'une montre : une image, une prédiction, un écart mesuré, corriger les paramètres, et retour à une image. Un point de brique parcourt ce cycle une fois en entier, en marquant un temps dans chaque case. Au second passage, le point s'arrête net juste avant d'entrer dans la quatrième case. Cette quatrième case, celle qui porte la mention corriger les paramètres, pâlit alors progressivement jusqu'à disparaître, et la flèche qui y menait disparaît avec elle ; les trois premières cases et leurs flèches restent parfaitement nettes, à l'encre. À la place libérée vient se poser un cartouche au trait fin, d'abord vide, qui reçoit ensuite le libellé chapitre 3. La boucle reste ouverte : rien ne revient de la quatrième case vers la première.

## `le-plan-du-chapitre`

**Le plan du chapitre, et ses trois démonstrations**  
page 1 · Page 1 · Plan, posée après la liste des onze jalons · geste : apparition en cascade d'une liste

Notions : geste : apparition en cascade d'une liste, plan du chapitre, démonstration, structure d'un réseau

Ce qui s'écrivait à l'écran : « PLAN DU CHAPITRE » · « 1.  Compter ce que contient le jeu » · « 2.  Aplatir une grille en vecteur » · « 3.  Lire un vecteur de poids comme une image » · « 4.  Construire un détecteur de bord » · « 5.  Passer d'un neurone à dix » · « 6.  Démontrer la limite de cette famille » · « 7.  Empiler deux couches, et ne rien gagner » · « 8.  Casser la ligne droite » · « 9.  Écrire le réseau complet, et le compter » · « 10.  Regarder ce que la couche cachée a appris » · « 11.  Synthèse et formulaire » · « ce que la famille ne peut pas »

Nombres :

- `jalons` = 11
- `demonstrations` = 3

**Description alternative.** Une ligne verticale d'encre se trace au tiers gauche de l'écran, du haut vers le bas. Onze libellés apparaissent alors l'un après l'autre, de haut en bas, chacun à droite de la verticale et précédé d'un petit carré vide posé sur elle. Ils énoncent ce qu'on apprend à chaque page : compter ce que contient le jeu, aplatir une grille en vecteur, lire un vecteur de poids comme une image, construire un détecteur de bord, passer d'un neurone à dix, démontrer la limite de cette famille, empiler deux couches et ne rien gagner, casser la ligne droite, écrire le réseau complet et le compter, regarder ce que la couche cachée a appris, et enfin synthèse et formulaire. Quand les onze sont posés, trois carrés se remplissent de brique l'un après l'autre, avec un temps d'arrêt entre chacun : ceux des sixième, septième et huitième jalons. Une accolade se referme ensuite à droite sur ces trois lignes seulement, et porte la mention « ce que la famille ne peut pas ». Les huit autres carrés restent vides, et rien ne disparaît de l'écran.

## `le-centre-de-masse-tient-la-grille`

**Le jeu est déjà centré, et on le mesure**  
page 2 · Page 2 · Les images sont centrées, après la sortie du centre de masse · geste : mesure par un compas

Notions : geste : mesure par un compas, prétraitement, centre de masse, invariance par translation

Ce qui s'écrivait à l'écran : « milieu géométrique (13,5 ; 13,5) » · « centre de masse moyen (13,996 ; 14,007) » · « 0,71 pixel » · « indice 14 » · « 0,008 pixel » · « écart-type 0,29 pixel »

Nombres :

- `centre_masse` = [13.9959, 14.0068]
- `milieu_grille` = [13.5, 13.5]
- `indice_central` = [14.0, 14.0]
- `distance_milieu` = 0.7091
- `distance_indice` = 0.008
- `ecart_type` = 0.29

**Description alternative.** Une grille de vingt-huit sur vingt-huit cases se dessine au trait gris très fin, occupant le centre de l'écran. Une petite croix d'encre se pose sur son milieu géométrique, aux positions treize et demie en ligne et en colonne : elle tombe sur une intersection de traits, entre quatre cases, et non au centre d'une case, parce que le côté de la grille est pair. Un compas vient poser sa pointe sur cette croix, s'ouvre lentement de la largeur d'une seule case, et trace un cercle fin de ce rayon. Des points gris apparaissent alors un par un à l'intérieur du cadre, de plus en plus vite : ce sont les centres de masse d'images successives du jeu. Ils s'accumulent en un petit nuage serré, nettement décalé vers le bas et vers la droite de la croix, et débordant du cercle de ce côté-là. Un point plus gros, de brique, se pose au milieu du nuage : c'est le centre de masse moyen des soixante mille images, à treize virgule quatre-vingt-seize en ligne et quatorze virgule zéro un en colonne. Le compas referme son ouverture sur l'écart entre la croix et ce point, et la cote zéro virgule soixante et onze pixel s'inscrit. La croix glisse enfin d'un demi-pixel en diagonale, jusqu'au centre de la case d'indice quatorze : elle s'arrête sur le point de brique, qu'elle recouvre presque exactement, et la cote tombe à zéro virgule zéro zéro huit pixel.

## `le-jeu-se-compte`

**Ce que le jeu contient, et le seuil qui en découle**  
page 2 · Page 2 · Ce que le jeu contient, après la sortie de répartition · geste : compteur qui se remplit

Notions : geste : compteur qui se remplit, jeu de données, classes déséquilibrées, seuil du hasard instruit

Ce qui s'écrivait à l'écran : « 0 » · « 1 » · « 2 » · « 3 » · « 4 » · « 5 » · « 6 » · « 7 » · « 8 » · « 9 » · « 5923 » · « 6742 » · « 5958 » · « 6131 » · « 5842 » · « 5421 » · « 5918 » · « 6265 » · « 5851 » · « 5949 » · « total 60 000 » · « 1135 sur 10 000 » · « 11,35 % »

Nombres :

- `train` = [5923, 6742, 5958, 6131, 5842, 5421, 5918, 6265, 5851, 5949]
- `test` = [980, 1135, 1032, 1010, 982, 892, 958, 1028, 974, 1009]
- `seuil_pourcent` = 11.35

**Description alternative.** Dix colonnes vides se dessinent côte à côte au bas de l'écran, étiquetées de zéro à neuf. Elles se remplissent alors toutes en même temps, de bas en haut, chacune à sa propre vitesse, pendant qu'un compteur numérique monte au-dessus de chacune. Les dix s'arrêtent ensemble, et les hauteurs obtenues sont nettement inégales : la colonne du chiffre un est la plus haute avec six mille sept cent quarante-deux, celle du chiffre cinq la plus basse avec cinq mille quatre cent vingt et un, et le total inscrit sous l'ensemble vaut soixante mille. Les compteurs basculent ensuite sur les valeurs du jeu de test, colonne par colonne de gauche à droite, et les colonnes se rétractent d'autant : la plus haute reste celle du chiffre un, avec mille cent trente-cinq sur dix mille. Une ligne horizontale de brique vient enfin se poser au sommet de cette colonne et traverse toute la largeur de l'écran, au-dessus des neuf autres qui restent en dessous d'elle. Elle porte l'inscription onze virgule trente-cinq pour cent, et la mention « répondre toujours 1 ».

## `la-grille-se-deplie-en-vecteur`

**La grille se déplie en une ligne de 784 cases**  
page 3 · Page 3 · L'aplatissement, après la formule (3.1) · geste : éventail qui se rassemble en ligne

Notions : geste : éventail qui se rassemble en ligne, aplatissement, vec, isomorphisme

Ce qui s'écrivait à l'écran : « 1 » · « 29 » · « 57 » · « 757 » · « 784 » · « k = 28(i − 1) + j »

Nombres :

- `lignes` = 28
- `colonnes` = 28
- `cases` = 784
- `premier_rang_ligne_28` = 757

**Description alternative.** Une grille de vingt-huit sur vingt-huit cases occupe le centre de l'écran, et un sept manuscrit y est dessiné en gris, case par case. La première ligne de la grille se détache alors du reste, pivote légèrement et glisse en éventail vers la gauche, où elle vient se poser horizontalement au début d'une bande qui commence à se former sous la grille. La deuxième ligne la suit et se pose juste à sa droite, bout à bout, sans laisser d'espace ; puis la troisième, puis les suivantes, de plus en plus vite, chacune prolongeant la bande vers la droite. À mesure que la grille se vide par le haut, la bande s'allonge et le nombre de rang de sa première case s'inscrit dessous : un pour la première ligne, vingt-neuf pour la deuxième, cinquante-sept pour la troisième, et sept cent cinquante-sept pour la dernière. Quand la grille est entièrement vide, la bande devenue très longue se compresse latéralement jusqu'à tenir dans la largeur de l'écran, en gardant l'ordre de ses cases. Sa longueur totale, sept cent quatre-vingt-quatre, s'inscrit sous elle, et la formule qui donne le rang d'un pixel à partir de sa ligne et de sa colonne apparaît au-dessus.

## `la-permutation-ne-change-rien`

**Une permutation fixe rend l'image illisible, et les scores ne bougent pas**  
page 3 · Page 3 · Ce que l'aplatissement coûte, après la démonstration · geste : découpe d'une bande par un peigne

Notions : geste : découpe d'une bande par un peigne, matrice de permutation, invariance, géométrie de la grille

Ce qui s'écrivait à l'écran : « W′ = W Pᵀ » · « P ᵀ P = I₇₈₄ » · « W′(P x) + b′ = W x + b » · « scores inchangés »

Nombres :

- `cases` = 784
- `scores` = 10

**Description alternative.** Une bande horizontale de sept cent quatre-vingt-quatre cases traverse le milieu de l'écran. À sa gauche, la même information repliée en grille montre un sept parfaitement lisible ; à sa droite, dix barres horizontales de longueurs inégales sont alignées en colonne, une par chiffre : ce sont les dix scores. Un peigne aux dents inégales descend alors verticalement sur la bande et la découpe en une dizaine de morceaux de longueurs différentes. Les morceaux se mettent à glisser horizontalement sous les dents du peigne et échangent leurs places dans un ordre fixé, se croisant les uns les autres, jusqu'à ce que la bande soit entièrement réordonnée. L'image de gauche se reconstruit alors depuis cette bande permutée : ce n'est plus un sept, c'est un brouillage de fragments d'encre où aucune forme n'est reconnaissable. Sous la bande, une petite vignette rectangulaire représentant la matrice de poids subit exactement la même découpe et le même échange, colonne par colonne, au même rythme. Pendant tout ce temps, les dix barres de droite restent strictement immobiles : pas une ne s'allonge ni ne raccourcit d'un pixel. Un cadre fin se referme sur elles à la fin, et l'égalité qui l'explique s'inscrit en dessous.

## `la-somme-se-separe-par-signe`

**La somme pondérée se sépare en ce qu'on cherche et ce qu'on refuse**  
page 4 · Page 4 · Ce que la somme pondérée mesure, après la formule (4.2) · geste : empilement de blocs à surfaces proportionnelles

Notions : geste : empilement de blocs à surfaces proportionnelles, somme pondérée, poids positif et négatif, biais

Ce qui s'écrivait à l'écran : « z = Σ_{w>0} w x  +  Σ_{w<0} w x  +  b » · « ce que le neurone cherche » · « ce qu'il refuse » · « b » · « z »

Nombres :

- `produits` = 784

**Description alternative.** Un axe vertical gradué se dresse au centre de l'écran, et une ligne horizontale épaisse marque le zéro à sa base. Des blocs rectangulaires arrivent alors un à un depuis le haut, en désordre, chacun d'une hauteur proportionnelle à la valeur du produit d'un poids par son pixel. Chaque bloc choisit son côté selon son signe : les blocs de brique, ceux dont le poids est positif, s'empilent dans une colonne à droite de l'axe ; les blocs d'ardoise, ceux dont le poids est négatif, s'empilent dans une colonne à gauche. Les blocs de hauteur nulle, largement les plus nombreux, arrivent aplatis et se posent au sol sans rien ajouter. Les deux colonnes montent en parallèle, de plus en plus vite à mesure que les blocs affluent, et finissent par s'arrêter à des hauteurs différentes, celle de droite plus haute. Les deux sommes s'inscrivent, l'une intitulée ce que le neurone cherche, l'autre ce qu'il refuse. La colonne de gauche bascule alors et vient se retrancher du sommet de celle de droite, qui redescend d'autant. Ce qui reste au-dessus du zéro est la valeur cherchée. Un dernier bloc, plus étroit et d'une autre trame, vient s'y ajouter en haut : c'est le biais. La cote finale s'inscrit à côté de la pile, et porte la lettre z.

## `le-poids-devient-une-image`

**Un vecteur de poids se replie en gabarit**  
page 4 · Page 4 · Un vecteur de poids est une image, après la définition du gabarit · geste : pliage d'une ligne en grille

Notions : geste : pliage d'une ligne en grille, gabarit, vec inverse, signe d'un poids

Ce qui s'écrivait à l'écran : « 784 » · « G = vec⁻¹(w) » · « max +1,0395 en (13, 25) » · « min −1,4457 en (16, 15) »

Nombres :

- `cases` = 784
- `max` = 1.0395
- `max_position` = [13, 25]
- `min` = -1.4457
- `min_position` = [16, 15]

**Description alternative.** Un rond d'encre est seul au centre de l'écran. Sept cent quatre-vingt-quatre traits très fins et très pâles convergent vers lui depuis toute la gauche, en un large éventail. Les traits se rassemblent alors et se transforment en une ligne horizontale de sept cent quatre-vingt-quatre petites cases vides, dont la longueur est cotée dessous. Cette ligne se coupe ensuite tous les vingt-huit rangs, et les vingt-huit morceaux obtenus glissent l'un sous l'autre pour s'empiler en une grille carrée : c'est exactement le mouvement de la page trois, joué à l'envers. Une fois la grille formée, chaque case prend sa couleur en même temps que les autres : celles dont le poids est positif virent au rouge brique, d'autant plus soutenu que le poids est grand ; celles dont le poids est négatif virent au bleu ardoise, selon la même règle ; celles dont le poids est nul restent parfaitement blanches. L'échelle est symétrique autour du zéro, de sorte que le blanc marque exactement le changement de signe. La forme qui apparaît est une couronne rouge entourant un cœur bleu. Deux repères viennent enfin se poser, l'un sur la case la plus rouge, l'autre sur la plus bleue, chacun portant ses coordonnées et sa valeur.

## `lencre-tombe-sur-le-rouge`

**L'encre d'un zéro évite le cœur bleu, celle d'un huit non**  
page 4 · Page 4 · Le gabarit, après la sortie des extrema · geste : image posée en transparence

Notions : geste : image posée en transparence, gabarit, score d'un neurone, absence d'encre

Ce qui s'écrivait à l'écran : « gabarit du 0 » · « un 0 du jeu » · « un 8 du jeu » · « z »

Nombres :

- `min` = -1.4457
- `min_position` = [16, 15]

**Description alternative.** Le gabarit du chiffre zéro occupe le centre de l'écran : une grille de vingt-huit sur vingt-huit cases, où une large couronne de cases rouges entoure un cœur de cases bleues situé au milieu. Une image du jeu, un zéro manuscrit, descend depuis le haut et vient se poser par-dessus, en transparence, exactement alignée sur la grille. Son trait d'encre gris suit la couronne rouge presque partout, et laisse le cœur bleu entièrement vide. Les cases où l'encre rencontre du rouge s'entourent alors d'un liseré fin, l'une après l'autre le long du trait, et un compteur de score monte à droite jusqu'à une valeur nettement positive. L'image du zéro se retire ensuite par le haut, le liseré disparaît, et le gabarit reste seul. Une image de huit manuscrit descend alors à la même place, dans la même transparence. Son trait passe lui aussi sur la couronne rouge, mais il traverse en plus le cœur bleu de part en part, là où les deux boucles du huit se rejoignent. Les cases de ce croisement s'entourent d'un liseré d'une autre trame, et le compteur de score, qui était monté, redescend franchement pour finir bien plus bas que la première fois.

## `construire-un-detecteur-de-bord`

**Trente-neuf poids à un, et le reste à zéro**  
page 5 · Page 5 · Premier temps, après la formule (5.1) · geste : remplissage progressif d'une grille

Notions : geste : remplissage progressif d'une grille, détecteur de bord, poids posés à la main, somme pondérée

Ce qui s'écrivait à l'écran : « lignes 8 à 10, colonnes 9 à 21 » · « 39 » · « 23.4000 » · « 5.0039 » · « 25.8549 »

Nombres :

- `zone_lignes` = [8, 10]
- `zone_colonnes` = [9, 21]
- `zone_cases` = 39
- `scores` = [23.4, 5.0039, 25.8549]

**Description alternative.** Une grille de vingt-huit sur vingt-huit cases, entièrement vide, occupe la gauche de l'écran, avec les numéros de ligne le long de son bord gauche et les numéros de colonne au-dessus. Un balayage commence alors : les cases de la huitième ligne, de la neuvième à la vingt et unième colonne, passent au rouge brique une par une, de gauche à droite ; puis celles de la neuvième ligne, puis celles de la dixième. Un compteur monte à chaque case et s'arrête à trente-neuf, formant une bande horizontale rouge de trois cases de haut au tiers supérieur de la grille. Toutes les autres cases restent parfaitement blanches. Une première image du jeu de test, un sept manuscrit, vient alors se poser en transparence derrière la grille : sa barre supérieure traverse la bande rouge de part en part, et le score vingt-trois virgule quatre s'inscrit à droite. Cette image se retire et un un manuscrit prend sa place : son trait vertical ne touche la bande que sur une case ou deux, et le score cinq virgule zéro zéro trente-neuf s'inscrit sous le précédent. Un zéro manuscrit arrive en dernier : son arc traverse largement la bande, et le score vingt-cinq virgule quatre-vingt-cinq quarante-neuf s'inscrit, plus grand que celui du sept. Les trois scores restent affichés côte à côte.

## `la-tache-large-trompe-le-compteur`

**Une tache large obtient le score maximal**  
page 5 · Page 5 · Deuxième temps, après le paragraphe sur le contre-exemple · geste : barres comparatives

Notions : geste : barres comparatives, contre-exemple, compteur d'encre, détecteur de bord

Ce qui s'écrivait à l'écran : « un 7 » · « un 1 » · « un 0 » · « tache large » · « 23.4000 » · « 5.0039 » · « 25.8549 » · « 39.0000 » · « maximum 39 »

Nombres :

- `scores` = [23.4, 5.0039, 25.8549, 39.0]
- `maximum` = 39

**Description alternative.** Quatre pistes horizontales sont empilées au centre de l'écran, étiquetées à gauche : un sept, un un, un zéro, une tache large. Une graduation commune court sous elles, de zéro à trente-neuf, avec sa borne droite marquée maximum trente-neuf. Les trois premières barres poussent depuis la gauche jusqu'à leur valeur : celle du sept s'arrête à vingt-trois virgule quatre, celle du un très tôt à cinq, celle du zéro à vingt-cinq virgule quatre-vingt-cinq, donc plus loin que celle du sept. Une petite vignette carrée se construit alors sur la quatrième piste, case par case, jusqu'à former un rectangle entièrement plein qui recouvre largement la zone de la bande : c'est la tache. Sa barre pousse à son tour, dépasse les trois autres sans ralentir, et vient buter contre la graduation trente-neuf, le maximum atteignable ; elle porte la valeur trente-neuf virgule zéro. Un trait pointillé vertical descend enfin de l'extrémité de la barre du zéro jusqu'à celle du sept, soulignant que la première dépasse la seconde.

## `le-pourtour-negatif-remet-lordre`

**Le pourtour bascule, et le classement s'inverse**  
page 5 · Page 5 · Troisième temps, après la sortie des scores · geste : basculement d'un état à un autre

Notions : geste : basculement d'un état à un autre, poids négatif, pourtour, renversement d'un classement

Ce qui s'écrivait à l'écran : « 132 cases à −1 » · « 10.6627 » · « -5.6431 » · « -9.8078 » · « -93.0000 » · « 613 poids nuls »

Nombres :

- `pourtour_cases` = 132
- `zone_cases` = 39
- `poids_nuls` = 613
- `scores` = [10.6627, -5.6431, -9.8078, -93.0]

**Description alternative.** L'écran reprend exactement l'état laissé par la scène précédente : la grille avec sa bande rouge de trente-neuf cases, et les quatre barres de score dont la plus longue est celle de la tache. Alors, d'un seul coup, cent trente-deux cases entourant la bande — une marge de trois cases tout autour — passent du blanc au bleu ardoise, et les quatre barres basculent au même instant. Trois d'entre elles traversent le zéro et repartent vers la gauche : celle du un s'arrête à moins cinq virgule six, celle du zéro à moins neuf virgule huit, et celle de la tache file très loin à gauche jusqu'à moins quatre-vingt-treize, hors de l'échelle des autres. Seule la barre du sept reste à droite du zéro, à dix virgule six six. Le basculement inverse est alors joué, et les cases redeviennent blanches pendant que les barres reviennent à leurs positions du deuxième temps ; puis le basculement direct, puis l'inverse encore, trois allers-retours de plus en plus rapprochés. L'écran s'arrête sur l'état bleu, et le classement final s'inscrit sous les barres, avec la mention six cent treize poids restés nuls.

## `le-score-devient-une-loi`

**Dix scores quelconques deviennent une loi de probabilité**  
page 6 · Page 6 · De dix scores à une loi, après la formule (6.3) · geste : vidage d'un contenant

Notions : geste : vidage d'un contenant, softmax, simplexe, normalisation

Ce qui s'écrivait à l'écran : « z » · « e^z » · « Σ e^z » · « 1 »

Nombres :

- `classes` = 10
- `somme` = 1

**Description alternative.** Dix éprouvettes étroites sont alignées côte à côte au centre de l'écran, posées sur une ligne horizontale marquée zéro. Leurs niveaux sont quelconques : certaines montent haut au-dessus de la ligne, d'autres descendent en dessous, et rien ne les relie. La lettre z est écrite à côté d'elles. Chaque niveau se déforme alors continûment jusqu'à devenir son exponentielle : tous les niveaux repassent au-dessus de la ligne du zéro, aucun ne reste en dessous, et les écarts entre eux se creusent nettement, les plus hauts prenant beaucoup d'avance sur les plus bas. Un large bac vide glisse ensuite sous la rangée, et les dix éprouvettes se vident dedans l'une après l'autre : le bac se remplit de la somme de tous les contenus, et son niveau est coté. Le mouvement s'inverse alors : le contenu du bac remonte dans les dix éprouvettes, mais chacune ne reçoit cette fois que sa part, proportionnelle à ce qu'elle avait versé. Les dix niveaux obtenus sont bien plus bas qu'avant, et une bande horizontale de hauteur un vient se poser autour de la rangée : les dix niveaux mis bout à bout tiennent exactement dans cette bande, sans dépasser ni laisser de vide, et le total un s'inscrit à côté.

## `les-dix-gabarits`

**Les dix gabarits, sur une seule échelle**  
page 6 · Page 6 · Dix neurones au lieu d'un, après le tableau des types · geste : défilement d'un catalogue

Notions : geste : défilement d'un catalogue, matrice de poids, gabarit, échelle de couleur commune

Ce qui s'écrivait à l'écran : « 0 » · « 1 » · « 2 » · « 3 » · « 4 » · « 5 » · « 6 » · « 7 » · « 8 » · « 9 » · « −2,3692 » · « 0 » · « +2,3692 » · « une seule échelle pour les dix »

Nombres :

- `gabarits` = 10
- `echelle` = 2.3692

**Description alternative.** Une réglette verticale de couleur se dessine à droite de l'écran : bleu ardoise soutenu en bas, blanc au milieu, rouge brique soutenu en haut, graduée de moins deux virgule trente-sept à plus deux virgule trente-sept avec le zéro exactement au blanc du milieu. Un premier gabarit apparaît alors au centre, une grille de vingt-huit sur vingt-huit cases colorées selon cette réglette, avec l'étiquette zéro : on y voit une couronne rouge entourant un cœur bleu. Le gabarit du chiffre un le remplace en glissant, avec son étiquette, puis celui du deux, et ainsi de suite jusqu'au neuf, chacun poussant le précédent hors du cadre et restant environ une seconde. Les formes sont très différentes les unes des autres, et les contrastes aussi : celui du cinq est nettement plus saturé que celui du huit, parce que ses coefficients sont plus grands et que l'échelle est la même pour tous. Quand les dix ont défilé, ils reviennent tous ensemble à une taille réduite et se rangent en deux rangées de cinq, dans l'ordre. La réglette reste à droite, et la mention « une seule échelle pour les dix » s'inscrit sous elle.

## `la-region-est-convexe`

**Le segment reste dans la région, et pour le réseau il en sort**  
page 7 · Page 7 · La proposition, après la sortie de la mesure de convexité · geste : balayage d'un curseur le long d'un segment

Notions : geste : balayage d'un curseur le long d'un segment, convexité, région de décision, interpolation d'images

Ce qui s'écrivait à l'écran : « modèle linéaire » · « 0 sur 4250 » · « modèle à ReLU » · « 69 sur 4816 »

Nombres :

- `lineaire_paires` = 4250
- `lineaire_ruptures` = 0
- `relu_paires` = 4816
- `relu_ruptures` = 69

**Description alternative.** Un polygone aux côtés droits se dessine au centre de l'écran, d'un seul tenant et sans creux : c'est la région de décision d'une classe pour le modèle linéaire, et l'étiquette modèle linéaire s'inscrit au-dessus. Deux points s'y posent, l'un près d'un bord, l'autre vers l'autre extrémité, chacun accompagné d'une petite vignette montrant l'image correspondante, deux écritures différentes du même chiffre. Le segment qui joint les deux points se trace alors, et il reste entièrement à l'intérieur du polygone sur toute sa longueur. Un curseur circulaire parcourt ce segment lentement, d'un point à l'autre ; au-dessus de lui, une vignette montre l'image interpolée, qui se transforme continûment de la première écriture à la seconde en passant par des formes floues et superposées. Sous le curseur, la classe prédite est affichée en permanence, et elle ne change pas une seule fois de tout le parcours ; la mention zéro sur quatre mille deux cent cinquante s'inscrit. Le polygone se déforme ensuite lentement : ses côtés se plient, un creux se forme sur l'un de ses flancs, et il devient une figure non convexe. L'étiquette devient modèle à ReLU. Le même segment est rejoué avec le même curseur, mais cette fois il traverse le creux : le curseur sort de la région en son milieu, la classe affichée change pendant cette traversée, puis revient à la première en arrivant au bout.

## `un-seul-gabarit-par-classe`

**Un gabarit unique ne peut pas être maximal sur deux écritures**  
page 7 · Page 7 · Un seul gabarit par classe, après le paragraphe sur le 4 ouvert · geste : superposition d'images avec soustraction

Notions : geste : superposition d'images avec soustraction, gabarit, variabilité de l'écriture, limite de famille

Ce qui s'écrivait à l'écran : « un 4 fermé » · « un 4 ouvert » · « la différence » · « gabarit du 4 »

**Description alternative.** Deux images de chiffres manuscrits sont posées côte à côte au centre de l'écran : à gauche un quatre dont les deux traits obliques se rejoignent nettement en haut, à droite un quatre dont ils ne se rejoignent pas et laissent un espace ouvert. Chacune porte son étiquette. L'image de droite glisse lentement vers la gauche et vient se superposer exactement sur l'autre. Les cases où les deux images portent de l'encre au même endroit s'effacent alors, l'une après l'autre, et il ne reste à l'écran que leur différence : quelques traits en rouge brique là où seule la première portait de l'encre, quelques traits en bleu ardoise là où seule la seconde en portait. Cette différence occupe une bonne part du haut du chiffre. Le gabarit du quatre apparaît ensuite en bas de l'écran, avec ses zones rouges et bleues. Il remonte se poser en transparence sous la première image, et une aiguille de score se place à une hauteur ; il glisse ensuite sous la seconde, et l'aiguille se place plus bas. Un repère horizontal marque le maximum atteignable, et aucune des deux aiguilles ne l'atteint.

## `cent-mille-parametres-pour-rien`

**Deux courbes de précision, et l'écart qui ne se creuse jamais**  
page 8 · Page 8 · La mesure, après la sortie du balayage · geste : courbe qui se trace

Notions : geste : courbe qui se trace, précision de test, nombre de paramètres, non-linéarité

Ce qui s'écrivait à l'écran : « 0,9193 » · « 807 erreurs » · « 7 850 paramètres » · « 0,9256 » · « 744 erreurs » · « 101 770 paramètres » · « +0,63 point » · « 93 920 paramètres de plus »

Nombres :

- `acc_1` = 0.9193
- `acc_2` = 0.9256
- `erreurs_1` = 807
- `erreurs_2` = 744
- `p_1` = 7850
- `p_2` = 101770
- `ecart_point` = 0.63

**Description alternative.** Deux axes se dessinent : en abscisse les époques d'entraînement, en ordonnée la précision de test, graduée de zéro virgule quatre-vingt-dix à zéro virgule quatre-vingt-dix-neuf. Une première courbe commence à se tracer de gauche à droite, point par point, une marque par époque : elle monte très vite dans les premières époques, atteint un palier autour de zéro virgule quatre-vingt-douze, puis oscille légèrement autour de ce palier sans plus jamais progresser jusqu'à la dernière époque. Son point final porte la valeur zéro virgule quatre-vingt-onze quatre-vingt-treize, et l'étiquette sept mille huit cent cinquante paramètres, huit cent sept erreurs, s'inscrit à sa droite. Une seconde courbe se trace ensuite sur les mêmes axes, dans la même montée initiale, et se stabilise à peine au-dessus de la première : les deux courbes restent tout du long presque collées l'une à l'autre. Son point final porte zéro virgule quatre-vingt-douze cinquante-six, avec l'étiquette cent un mille sept cent soixante-dix paramètres, sept cent quarante-quatre erreurs. Une accolade verticale se referme enfin sur l'espace qui sépare les deux points finaux : elle est minuscule à l'échelle des axes, et porte la valeur plus zéro virgule soixante-trois point. Sous elle s'inscrit le nombre de paramètres qu'a coûté cet écart : quatre-vingt-treize mille neuf cent vingt de plus.

## `deux-matrices-nen-font-quune`

**Les deux matrices fusionnent, et la construction inverse les sépare**  
page 8 · Page 8 · La proposition, après la double inclusion · geste : glissement puis fusion de deux blocs

Notions : geste : glissement puis fusion de deux blocs, composée d'applications affines, double inclusion, paramétrage redondant

Ce qui s'écrivait à l'écran : « 784 » · « 128 » · « 10 » · « W^[1] » · « W^[2] » · « W^[2] W^[1] » · « H₂ = H₁ » · « (I | 0) »

Nombres :

- `entree` = 784
- `cachee` = 128
- `sortie` = 10

**Description alternative.** Trois colonnes verticales de points sont alignées de gauche à droite, numérotées sept cent quatre-vingt-quatre, cent vingt-huit et dix. Entre la première et la deuxième, un rectangle allongé porte l'étiquette W exposant un ; entre la deuxième et la troisième, un rectangle plus petit porte W exposant deux. Sur la colonne du milieu, une case ronde tracée en pointillé reste vide : c'est la place où aucune fonction n'a été mise. Les deux rectangles se mettent alors à glisser l'un vers l'autre, lentement, jusqu'à se toucher, puis fusionnent en un seul bloc dans un mouvement continu. Pendant cette fusion, la colonne du milieu et son étiquette cent vingt-huit s'effacent, et le rectangle obtenu se redimensionne pour prendre les proportions dix par sept cent quatre-vingt-quatre. Un second rectangle apparaît alors à côté de lui, celui du modèle de la page six : les deux ont exactement la même forme, et un cadre commun se referme sur les deux. La scène repart ensuite dans l'autre sens : une grande matrice vide de cent vingt-huit lignes se dessine, la matrice W vient s'écrire dans ses dix premières lignes seulement pendant que les cent dix-huit suivantes restent blanches, et un bloc étroit portant la matrice identité suivie de zéros vient se poser devant. L'égalité des deux familles s'inscrit en bas.

## `la-relu-decoupe-lespace`

**Trois neurones découpent le plan, et la frontière se brise**  
page 9 · Page 9 · Ce que ReLU achète, après la démonstration · geste : découpage du plan par des hyperplans

Notions : geste : découpage du plan par des hyperplans, fonction affine par morceaux, régions d'activation, puissance d'expression

Ce qui s'écrivait à l'écran : « aucune droite ne sépare » · « z^[1]_j > 0 » · « W^[2] D_S W^[1] x + … » · « 128 hyperplans en dimension 784 » · « 2^128 ≈ 3,4 · 10^38 »

Nombres :

- `hyperplans_scene` = 3
- `hyperplans_reseau` = 128
- `majorant` = 2^128
- `majorant_ordre` = 3.4e+38

**Description alternative.** Un nuage de points occupe le centre de l'écran, mêlant deux familles : des ronds de brique et des carrés d'ardoise, disposés de telle sorte qu'aucune ligne droite ne peut les séparer. Plusieurs droites viennent successivement essayer, pivotent, se déplacent, et chacune laisse à chaque fois des points du mauvais côté ; elles disparaissent l'une après l'autre. Une première droite se pose alors et reste : tout le demi-plan situé d'un côté d'elle se grise légèrement, indiquant que le premier neurone y est éteint. Une deuxième droite arrive avec une autre orientation et grise son propre demi-plan, qui recouvre partiellement le premier ; puis une troisième. Le plan se trouve alors partagé en plusieurs régions polygonales, aux arêtes droites, de gris différents selon le nombre de neurones éteints qui s'y superposent. Les régions s'allument ensuite une par une, et dans chacune apparaît brièvement l'expression affine qui décrit la fonction à cet endroit : elle change d'une région à l'autre, seul le motif de l'écriture reste le même. La frontière de décision se trace enfin, d'un trait de brique appuyé : elle n'est pas droite, elle est brisée, changeant d'angle à chaque arête franchie, et elle sépare cette fois les deux familles complètement. Un cartouche s'inscrit en bas, rappelant que le vrai réseau a cent vingt-huit hyperplans en dimension sept cent quatre-vingt-quatre, et portant le majorant deux puissance cent vingt-huit, environ trois virgule quatre fois dix puissance trente-huit.

## `la-sigmoide-ecrase-la-droite-reelle`

**La droite monte sans borne, la sigmoïde tient dans une bande**  
page 9 · Page 9 · La sigmoïde, après la dérivation de σ′ · geste : zoom continu

Notions : geste : zoom continu, sigmoïde, ensemble d'arrivée borné, majorant de la dérivée

Ce qui s'écrivait à l'écran : « y = u » · « σ(u) = 1 / (1 + e^{−u}) » · « 1 » · « 0 » · « σ′(0) = 1/4 »

Nombres :

- `majorant_derivee` = 0.25
- `borne_basse` = 0
- `borne_haute` = 1

**Description alternative.** Deux axes se croisent au centre de l'écran, gradués de moins six à plus six horizontalement et verticalement. Une droite de pente un passant par l'origine les traverse en diagonale, et la courbe de la sigmoïde se trace par-dessus : près de l'origine les deux se ressemblent, elles montent ensemble avec des pentes voisines. Le cadre se met alors à s'éloigner continûment, sans coupure ni saut, et l'échelle grandit progressivement d'un facteur cent : les graduations défilent, dix, puis cent, puis mille. La droite continue de monter tout droit et sort rapidement du cadre par le coin supérieur droit, puis par le coin inférieur gauche, sans jamais fléchir. La courbe de la sigmoïde, elle, s'aplatit de plus en plus : à mesure que le cadre s'élargit, elle se tasse jusqu'à n'être plus qu'une marche presque verticale au centre, coincée entre deux niveaux horizontaux. Ces deux niveaux se tracent alors en pointillé, cotés zéro et un, et la courbe s'en approche de part et d'autre sans jamais les toucher ni les traverser. Le cadre revient enfin à son échelle de départ. Une tangente se trace au point d'abscisse zéro de la courbe, sur une longueur mesurée, et sa pente s'inscrit à côté d'elle : un quart, la plus forte que la sigmoïde atteigne.

## `le-biais-est-loppose-du-seuil`

**Le seuil traverse l'inégalité et devient le biais**  
page 9 · Page 9 · Le biais est l'opposé d'un seuil, après la dérivation · geste : substitution d'une expression par une autre

Notions : geste : substitution d'une expression par une autre, biais, seuil d'activation, inégalité

Ce qui s'écrivait à l'écran : « wᵀx > s » · « wᵀx − s > 0 » · « wᵀx + b > 0 » · « b = −s »

**Description alternative.** Une inégalité est écrite en grand au centre de l'écran : w transposée x, strictement supérieur à s. Le terme s, seul à droite du signe, prend alors la couleur brique, se détache de la ligne et s'élève au-dessus d'elle. Il glisse lentement vers la gauche en passant par-dessus le signe d'inégalité, et pendant cette traversée un signe moins vient se coller devant lui. Il redescend et se repose juste après le premier membre, qui devient w transposée x moins s ; à la place qu'il occupait à droite, un zéro apparaît. La ligne se réécrit une dernière fois : le moins s se transforme en plus b, et l'expression finale est w transposée x plus b, strictement supérieur à zéro. Un cartouche encadré s'inscrit dessous, portant b égale moins s. Un axe horizontal gradué apparaît alors en bas de l'écran, portant la lettre z, avec une barre verticale posée au seuil et une zone hachurée à droite d'elle marquée le neurone parle. Un curseur fait varier b : quand il augmente, la barre glisse vers la gauche et la zone hachurée s'élargit ; quand il diminue, la barre repart vers la droite et la zone se resserre.

## `le-reseau-est-une-fonction`

**Des jetons traversent le réseau, qui se referme sur une fonction**  
page 10 · Page 10 · Régler ces nombres à la main, après le paragraphe sur la boîte noire · geste : jetons qui traversent un graphe

Notions : geste : jetons qui traversent un graphe, propagation avant, neurone éteint, fonction paramétrée

Ce qui s'écrivait à l'écran : « 784 » · « 128 » · « 10 » · « f_θ » · « R^784 » · « Δ°_9 » · « θ ∈ R^101770 »

Nombres :

- `entree` = 784
- `cachee` = 128
- `sortie` = 10
- `parametres` = 101770
- `part_w1_pourcent` = 98.6

**Description alternative.** Trois colonnes verticales de nœuds occupent l'écran, étiquetées sept cent quatre-vingt-quatre à gauche, cent vingt-huit au milieu, dix à droite. Un faisceau dense de liaisons très pâles relie chaque nœud d'une colonne à tous ceux de la suivante, formant deux nappes. Des jetons de brique apparaissent alors sur les nœuds de gauche et se mettent à remonter les liaisons vers la colonne du milieu, plusieurs à la fois, en suivant les traits. Chaque nœud du milieu qui reçoit des jetons s'allume brièvement ; mais environ deux tiers d'entre eux s'assombrissent et se figent : les jetons y entrent et n'en ressortent pas, ils sont éteints. Depuis les nœuds restés allumés, les jetons repartent vers la colonne de droite et s'y accumulent, faisant monter dix petits niveaux inégaux, un par nœud de sortie. Une fois le passage terminé, l'ensemble du dispositif — les trois colonnes, les deux nappes de liaisons, les jetons — se contracte lentement vers le centre et se referme en une seule boîte rectangulaire vide. La boîte reçoit son étiquette au centre, f indicé thêta ; l'ensemble de départ s'écrit à sa gauche avec une flèche entrante, l'ensemble d'arrivée à sa droite avec une flèche sortante, et le nombre de paramètres s'inscrit dessous.

## `lecriture-matricielle-en-cinq-temps`

**Cent vingt-huit sommes deviennent un produit de matrices**  
page 10 · Page 10 · D'où vient l'écriture matricielle, après le tableau des cinq temps · geste : table qui se remplit ligne à ligne

Notions : geste : table qui se remplit ligne à ligne, produit matriciel, vérification des dimensions, calcul par lots

Ce qui s'écrivait à l'écran : « z_1 = w_11 x_1 + w_12 x_2 + … + w_1,784 x_784 + b_1 » · « z_2 = … » · « W^[l] » · « (128 × 784)(784 × 1) + (128 × 1) = 128 × 1 »

Nombres :

- `lignes` = 128
- `colonnes` = 784

**Description alternative.** Une première ligne d'écriture apparaît en haut à gauche : la somme pondérée du premier neurone, écrite terme à terme, avec le premier poids multiplié par le premier pixel, plus le deuxième poids par le deuxième pixel, une ellipse, le sept cent quatre-vingt-quatrième terme, et le biais. Une deuxième ligne s'écrit en dessous, rigoureusement identique à la première à ses indices près, puis une troisième. Les lignes suivantes arrivent de plus en plus vite et de plus en plus serrées les unes contre les autres : les caractères rétrécissent, les mots se tassent, et au bout d'une vingtaine de lignes l'écriture n'est plus lisible, elle n'est plus qu'une texture grise rayée horizontalement. Le bloc entier se resserre alors d'un seul mouvement et devient un rectangle plein, aux proportions nettement plus larges que hautes, qui reçoit l'étiquette de la matrice de la couche. Un rectangle haut et étroit, le vecteur d'entrée, vient se poser contre son flanc droit ; un second, plus court, le vecteur de biais, se pose après un signe plus. Sous l'ensemble, la vérification des dimensions s'inscrit terme à terme : cent vingt-huit par sept cent quatre-vingt-quatre, multiplié par sept cent quatre-vingt-quatre par un, plus cent vingt-huit par un, égale cent vingt-huit par un. Les dimensions intérieures qui se simplifient sont soulignées.

## `les-erreurs-regardees-une-a-une`

**Les 186 erreurs quittent la grille et se rangent en table**  
page 11 · Page 11 · Les 186 erreurs, après la sortie des confusions · geste : déplacement d'un objet d'un plan à un autre

Notions : geste : déplacement d'un objet d'un plan à un autre, matrice de confusion, erreur confiante, calibration

Ce qui s'écrivait à l'écran : « 10 000 » · « 186 » · « vérité » · « prédiction » · « 5 lu 3 : 8 » · « 7 lu 2 : 8 » · « 4 lu 9 : 8 » · « 30 erreurs au-dessus de 0,99 »

Nombres :

- `images` = 10000
- `erreurs` = 186
- `erreurs_tres_confiantes` = 30
- `mediane` = 0.8755

**Description alternative.** Une grille extrêmement dense de très petits carrés gris remplit l'écran : dix mille cases, une par image du jeu de test, et le compte est inscrit dans un coin. Cent quatre-vingt-six de ces cases passent alors au rouge brique, dispersées un peu partout dans la grille sans former de motif, et leur compte s'inscrit à son tour. Une seconde grille apparaît ensuite en arrière-plan, nettement décalée en profondeur et plus petite : une table de dix lignes sur dix colonnes, vide, dont les lignes sont marquées vérité et les colonnes prédiction, avec les chiffres de zéro à neuf sur les deux bords. Les cases rouges se mettent alors à quitter le premier plan une par une : chacune se détache, traverse l'espace qui sépare les deux grilles en rapetissant, et vient se poser dans la case de la table qui correspond à son couple vérité-prédiction. Le flux s'accélère, et les cases de la table se chargent très inégalement : la diagonale reste entièrement vide, tandis que quelques cases hors diagonale s'empilent visiblement plus que les autres. Quand tout est passé, les six cases les plus chargées s'entourent d'un liseré et portent leur compte, cinq lu trois huit fois, sept lu deux huit fois, quatre lu neuf huit fois. Une dernière mention s'inscrit en bas : trente de ces erreurs ont été commises avec une probabilité supérieure à zéro virgule quatre-vingt-dix-neuf.

## `lespoir-des-bords-nest-pas-verifie`

**Aucun gabarit caché ne ressemble à ce qu'on espérait**  
page 11 · Page 11 · Ce que la mesure dit, après la sortie des corrélations · geste : traits de liaison portant une valeur

Notions : geste : traits de liaison portant une valeur, corrélation, gabarit caché, détecteur de bord

Ce qui s'écrivait à l'écran : « gabarits de classe » · « gabarits cachés » · « 0,4894 » · « 0,4275 » · « 0,7864 entre deux vrais détecteurs » · « moyenne 0,0853 »

Nombres :

- `rho_max_classe` = 0.4894
- `rho_moyen_classe` = 0.0853
- `rho_max_bord` = 0.4275
- `rho_entre_detecteurs` = 0.7864
- `couples_classe` = 1280
- `couples_bord` = 21504

**Description alternative.** Dix gabarits carrés s'alignent sur une rangée en haut de l'écran, colorés en rouge et bleu sur l'échelle déjà employée, avec leurs étiquettes de zéro à neuf : ce sont les gabarits de classe, aux contrastes nets. Douze autres gabarits s'alignent alors sur une seconde rangée en bas, avec leurs numéros de neurone caché. Ils sont montrés sur exactement la même échelle de couleur, et ils sont beaucoup plus pâles, presque délavés, sans forme reconnaissable, ni chiffre ni bord franc. Chaque gabarit du bas lance ensuite un trait fin vers celui du haut dont il est le plus corrélé ; les traits se croisent, et leur épaisseur dit la force de la corrélation. Onze des douze traits sont des filets à peine visibles ; un seul est appuyé, et c'est le seul dont la valeur est écrite : zéro virgule quarante-huit quatre-vingt-quatorze. Une réglette verticale graduée de zéro à un apparaît à droite, portant deux repères marqués : l'un haut, à zéro virgule soixante-dix-huit, indiquant ce que valent deux vrais détecteurs de bord comparés entre eux ; l'autre bien plus bas, à zéro virgule quarante-trois, indiquant le meilleur des gabarits cachés comparé à un détecteur. L'écart entre les deux repères est franc. Tous les traits s'effacent enfin, sauf un seul, le plus fort, qui reste seul à l'écran avec sa valeur, zéro virgule quarante-huit quatre-vingt-quatorze.

## `la-question-du-chapitre-suivant`

**L'axe du chapitre bascule et devient celui de la perte**  
page 12 · Page 12 · La suite du parcours, après le repère de fin · geste : rotation d'un axe

Notions : geste : rotation d'un axe, perte, descente, chapitre suivant

Ce qui s'écrivait à l'écran : « l'image » · « le vecteur » · « la couche cachée » · « la sortie » · « la classe » · « la perte » · « d'où viennent ces 101 770 nombres ? »

Nombres :

- `jalons` = 5
- `parametres` = 101770

**Description alternative.** Un axe horizontal traverse le milieu de l'écran, portant cinq jalons régulièrement espacés et étiquetés : l'image, le vecteur, la couche cachée, la sortie, la classe prédite. Un point de brique part du premier jalon et parcourt l'axe jusqu'au dernier, en marquant un temps d'arrêt à chacun. L'axe se met alors à pivoter lentement autour de son extrémité droite, d'un quart de tour, jusqu'à devenir vertical ; les cinq étiquettes pivotent avec lui, se redressent maladroitement, puis s'effacent une à une pendant la rotation, de sorte que l'axe arrive nu à la verticale. Il reçoit alors une graduation entièrement nouvelle, qui n'a rien à voir avec la précédente : une échelle de valeurs, forte vers le haut, faible vers le bas, étiquetée la perte. Une flèche apparaît en haut de cet axe et descend lentement le long de lui, par petits pas successifs de longueur décroissante, comme si elle cherchait le bas. Elle s'arrête avant d'atteindre l'extrémité, et la question s'inscrit à côté de son point d'arrêt : d'où viennent ces cent un mille sept cent soixante-dix nombres ?

## `les-objets-du-chapitre-se-rangent`

**Tout le chapitre pivote autour de thêta**  
page 12 · Page 12 · La propagation avant, après le pseudo-code · geste : pivot autour d'un point

Notions : geste : pivot autour d'un point, synthèse, typage des objets, paramètres appris

Ce qui s'écrivait à l'écran : « θ » · « x » · « c » · « y » · « D » · « W^[1] » · « b^[1] » · « W^[2] » · « b^[2] » · « z^[1] » · « a^[1] » · « z^[2] » · « a^[2] » · « comment θ est choisi »

Nombres :

- `donnees` = 4
- `parametres` = 4
- `calcules` = 4

**Description alternative.** Un point d'encre est seul au centre de l'écran, portant la lettre thêta. Quatre étiquettes arrivent depuis la gauche, l'une après l'autre, et viennent se placer à intervalles réguliers sur un premier cercle autour du point : ce sont les objets de données, l'entrée, l'étiquette, son encodage et le jeu. Une fois posées, elles ne bougent plus du tout. Quatre autres étiquettes arrivent ensuite, celles des matrices et des vecteurs de biais, et se mettent à pivoter autour du centre en décrivant une spirale qui se resserre : à chaque tour elles se rapprochent, jusqu'à disparaître une à une à l'intérieur du point central, qui grossit d'autant à chaque absorption. Quatre dernières étiquettes, celles des préactivations et des activations, apparaissent sur un cercle plus large et font un tour complet autour de l'ensemble, en passant derrière puis devant, avant de revenir exactement à leur point de départ et de s'y arrêter. Reste alors une étiquette isolée, en dehors de tous les cercles, à l'écart : elle tente de s'approcher, ralentit, et s'immobilise sans pouvoir entrer. Elle porte la question de savoir comment thêta est choisi, et le nom du chapitre trois s'inscrit sous elle.

