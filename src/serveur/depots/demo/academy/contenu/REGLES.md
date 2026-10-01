# Les vingt-huit règles de rédaction

Douze viennent de la relecture du chapitre 1 par Daniel, le 22 août 2026 : il a
mis entre parenthèses tout ce qui ne lui apprenait rien. Les seize suivantes se
sont ajoutées aux relectures d'après, jusqu'au 31 août 2026 — les dernières ne
sortent pas d'une relecture mais d'une casse au rendu. Elles valent pour **tous**
les chapitres.

Le lecteur est un étudiant ingénieur qui sort de cours. Il ne lit pas un texte
qui se commente lui-même. Chaque ligne doit lui apprendre quelque chose sur le
machine learning, sinon elle saute.

**Les numéros ne sont jamais réattribués.** Des fichiers de contenu et de scènes
citent des règles par leur numéro ; un numéro qui change ailleurs rend faux un
commentaire que personne ne relira. L'annexe donne la correspondance avec
l'ancienne numérotation `R1`–`R10`, aujourd'hui retirée.

**« Annotation N »** renvoie aux huit annotations portées par Daniel sur le
chapitre 1 le 31 août 2026 — la septième vaut pour deux reproches distincts,
notés 7 (a) et 7 (b), soit neuf reprises en tout. Une citation sans numéro vient
de la relecture du 22 août ou des suivantes, qui n'ont pas été numérotées. Une
règle garde la phrase qui l'a produite : sans elle, elle finit par s'appliquer
hors de son cas.

---

## Les trois principes

Vingt-huit règles s'appliquent une par une. Trois principes se comprennent. Les
règles en sont l'application ; chacune porte, sous son titre, celui dont elle
découle.

### I. On montre avant d'annoncer

Une page ouvre sur une question ou un fait, puis une figure, puis le cadre. Un
cours qui commence par dire ce qu'il va faire n'a encore rien appris à personne.
Treize règles en découlent : 1, 2, 3, 5, 7, 9, 10, 11, 20, 21, 22, 23, 26.

### II. On n'anime que ce qui change

Une apparition successive n'est pas un changement, c'est un découpage. Animer
est le plus cher à produire, le plus cher à re-rendre et le plus lent à lire :
ne rien mettre, mettre un schéma, animer — dans cet ordre de préférence
décroissante. Trois règles en découlent : 13, 15, 18.

### III. On ne dit rien deux fois

Ni entre deux paragraphes, ni entre un texte et la figure qu'il décrit, ni entre
deux pages, ni entre deux animations. Six règles en découlent : 4, 6, 8, 12, 17,
19.

**Six règles ne découlent d'aucun des trois** — 14, 16, 24, 25, 27, 28. Elles ne
portent pas sur ce qu'on écrit mais sur ce qui casse au rendu, et aucun principe
de rédaction ne les produit. Elles sont marquées **fabrication**.

---

## (1) Le cours ne parle jamais de lui-même.
*› principe I*

Ni de sa méthode, ni de l'ordre de ses sections, ni de sa place dans le
parcours. Coupé au chapitre 1 : « Rien n'y est décrété, chaque notion arrive
après qu'on a montré ce qui manque sans elle », le paragraphe justifiant
l'enchaînement des neuf sections, la section entière « Place dans le parcours ».
> *« je m'en fous de ça je veux apprendre le ML »*

## (2) Ne jamais écrire ce que le cours ne fait pas.
*› principe I*

Les prérequis listent ce qu'il faut savoir, et s'arrêtent là. On n'énumère ni
les notions non exigées, ni les algorithmes non traités.
> *« si ce n'est pas demandé ne le dis pas, ça apparaîtra dans les prérequis du
> prochain chapitre »*

## (3) Pas de littérature.
*› principe I*

Pas de titre-slogan, pas de chute, pas de répétition rhétorique. Coupé :
le titre « Une carte, et rien qu'une carte ».
> *« bruh tu es pas poète »*

## (4) Une phrase se lit à voix haute d'un seul souffle, et dit une chose.
*› principe III*

**Amendée le 13 septembre 2026.** Cette règle disait « la phrase s'arrête quand
l'information est donnée », et elle a été appliquée comme « une proposition par
phrase ».

> *« le texte n'est pas naturel, on doit pouvoir le lire à voix haute, ça coupe
> trop rapidement »*

**Avant.**

> Regarde le pixel de la ligne 9, colonne 7. Il porte l'octet 222. Regarde le
> trait qui en part. Il porte le poids w₂₃₁.

**Après.**

> Le pixel de la ligne 9, colonne 7, porte l'octet 222, et le trait qui en part
> porte le poids w₂₃₁.

Quatre phrases de six mots. Lues à voix haute, c'est une liste. La longueur
n'est pas le critère, le souffle l'est : une phrase de trente mots qui se dit
d'un trait est bonne, et quatre phrases de six mots qui se suivent sont une
faute.

La queue emphatique, elle, reste coupée — « et n'en introduit aucun cinquième »,
« et rien d'autre », « et absolument rien de plus », « et elle mérite son propre
symbole », « la notation change, l'objet non ». Ce qu'on lui reproche est de
redire ce que la phrase vient de dire, jamais d'allonger la phrase.

**Le test.** Lire chaque paragraphe à voix haute, comme on le dirait à un élève,
et répondre à trois questions : est-ce que je le dirais ainsi ? y a-t-il un
endroit où je reprendrais mon souffle au milieu d'une phrase ? y a-t-il une
suite de phrases courtes que je fondrais en une seule en parlant ? Oui à l'une
des deux dernières, on réécrit. Le garde-fou mécanique, qui ne remplace pas la
lecture : aucune suite de trois phrases de moins de huit mots dans le corps
d'une page, hors énumérations et formules.

## (5) On pose une convention, on ne la plaide pas.
*› principe I*

Coupé : « deux composantes, et deux seulement, parce que ce sont celles qu'une
agence a déjà dans ses dossiers », « x1 est la surface parce que nous venons de
le décider », « pour garder des nombres qui se lisent ».

## (6) Pas de commentaire sur la forme d'une liste.
*› principe III*

Coupé : « Sept, et chacun se formule avec un verbe qui s'exécute », « Trois, et
trois seulement ». Une liste de sept items se compte toute seule.

## (7) Aucun vocabulaire inventé par le cours.
*› principe I*

« Les quatre dettes » ne veut rien dire pour un étudiant. On écrit « Démontré
ailleurs » et on nomme le chapitre.
> *« c'est quoi ce titre mystérieux »*

## (8) Un paragraphe explicatif devient une phrase — une transition aussi.
*› principe III*

Une transition dit ce qu'on vient d'établir et ce qu'on cherche ensuite. Rien
d'autre. Un marqueur de progression qui prend quatre paragraphes coûte plus de
lecture qu'il n'en fait gagner.

**Annotation 7 (a).**

> *« inutile, tu peux expliquer ça avec une phrase, juste dire qu'il n'existe pas
> de règles, c'est logique »* — annotation 7 (a)

**Avant.** Page 2, quatre champs :

> Ce que nous cherchons : Ce que veut dire « apprendre », quand c'est une
> machine qui le fait.
> Pourquoi : Sans cette définition, les mots qui suivent se poseraient sur du
> vide.
> Où nous en sommes : Le renversement est acquis, les trois apports de l'humain
> sont nommés, et l'absence de règle écrite à la main est prouvée par la mesure
> sur 6 131 exemples.
> L'étape suivante : Un problème précis sur lequel les poser. Tout est encore
> dit en français, et rien ne se calcule.

**Après.**

> Le renversement est acquis et la mesure sur les 6 131 images du chiffre 3
> écarte toute règle portant sur un pixel isolé ; reste à poser un problème
> précis sur lequel travailler.

Appliqué aux dix blocs de transition du chapitre 1. Le type de bloc `repere`
n'y est plus employé.

## (9) Le plan dit ce qu'on apprend.
*› principe I*

Les titres de sections annoncent une compétence, pas une étiquette abstraite.
> *« ton plan est complexe on comprend pas vraiment ce qu'on apprend »*

## (10) Chaque section conceptuelle porte une figure.
*› principe I*

C'est le reproche le plus dur de la relecture.
> *« il y'a aucun schéma… aucun… refais ça en entier et sois attrayant à la
> lecture »*

Figure, et pas nécessairement animation : la règle 15 dit laquelle des trois
formes convient, et la règle 20 dit ce qui compte comme figure. Une section dont
l'idée se lit déjà entièrement dans un tableau voisin n'en réclame pas une de
plus.

## (11) Plus de maths et de formules, moins de prose.
*› principe I*

> *« trop long, pas assez mathématique, manque de schéma et manque de formules »*

## (12) Ne rien dire deux fois.
*› principe III*

Un paragraphe qui reformule ce qu'un tableau ou un paragraphe voisin donne déjà
est **supprimé**. Pas raccourci : supprimé.

**Annotation 4**, qui reprend le reproche du 22 août.

> *« trop long à lire, tu te répètes beaucoup »* — relecture du 22 août
>
> *« inutile, tu le dis plus haut »* — annotation 4

**Avant.** Page 1, juste après la table « Démontré ailleurs », qui donne déjà
les cinq notions et le chapitre qui démontre chacune :

> « Les quatre chapitres qui suivent celui-ci forment un arc, et il tient en une
> phrase par chapitre. Le chapitre 2 construit l'objet : ce qu'est un réseau de
> neurones, sur des chiffres manuscrits. Le chapitre 3 le fait apprendre : la
> descente de gradient, et ce qu'elle règle. Le chapitre 4 dit ce que la
> rétropropagation fait, avant tout calcul. Le chapitre 5 le calcule. »

**Après.** Rien. La table est au-dessus.

## (13) Une page porte plusieurs figures ; combien sont animées dépend de ce qui bouge.
*› principe II*

Une page de leçon sans aucune figure ne passe pas — deux au minimum, trois ou
quatre en moyenne. C'est le volume attendu, pas un objectif lointain.

**Amendée le 31 août 2026.** Cette règle demandait deux *animations* par page.
Elle cède devant la règle 15 quand rien ne bouge : le compte porte désormais sur
les figures, et une page dont trois idées sur quatre sont statiques porte trois
schémas et une animation. Le quota ne justifie jamais d'animer ce qui ne change
pas.

## (14) Deux objets ne se recouvrent jamais.
*› **fabrication***

Sauf si l'un est délibérément **contenu** dans l'autre : un texte dans son cadre,
une cote dans sa bulle. Partout ailleurs, un recouvrement est une faute, et il
n'y a pas de recouvrement acceptable parce qu'il est petit. Les zones sont
franches, ou la scène est refaite.

En particulier :

- un **libellé de point** est décalé du point, jamais posé dessus, et jamais sur
  une courbe ;
- un **titre d'axe** et une **cote** ne partagent jamais la même bande
  horizontale ;
- les objets ajoutés **sous un graphe** — molettes, curseurs, légendes — ont
  leur propre bande, séparée du cadre du graphe par une marge visible.

**Le moyen, et il n'est pas d'écarter un peu.** Une scène trop dense ne se
répare pas en poussant ses objets de deux dixièmes : il faut **agrandir la
surface utile**, puis répartir. Un graphe qui doit céder une bande à trois
molettes rétrécit ou remonte ; il ne partage pas sa bande.

**Le cas qui a produit la règle.** La scène `les-trois-boutons`, à 0:21 sur
0:23. Cinq défauts sur une seule image, dont quatre sont des recouvrements : le
titre d'axe « surface (m²) » et la cote « 10 » de la molette centrale écrasés
l'un sur l'autre — on lit `surfaLOe(m²)`, et aucun des deux ne se lit ; les deux
libellés de points posés **sur** la droite du modèle ; les trois molettes
montées jusqu'à la hauteur du titre d'axe.

**Le contrôle est mécanique et se relance :**

```
python animations/collisions.py scenes/panorama          un chapitre
python animations/collisions.py scenes/panorama/boutons.py
python animations/collisions.py scenes/panorama --pas 0.25
```

Il ne rend aucune image : il construit la scène, interpole ses animations sur
une grille d'une demi-seconde et croise les boîtes. Entre deux textes il croise
les boîtes ; entre un texte et un tracé il regarde si le tracé passe dans la
boîte du texte, parce que la boîte d'une droite diagonale couvre un rectangle
où elle n'est presque jamais.

**Ce qu'il ne voit pas, et qui demande l'œil.** Deux textes très proches sans se
toucher restent illisibles, et un titre rendu sans espaces a une boîte
parfaitement normale — voir la règle 25. Une trame par scène, prise à l'instant
le plus chargé, reste obligatoire.

## (15) Rien, un schéma, ou une animation — dans cet ordre.
*› principe II*

Une animation n'est justifiée que si quelque chose change dans le temps **et que
ce changement porte l'idée**. Sinon : un **schéma fixe**. Si l'idée se lit déjà
dans le texte ou dans un tableau voisin : **rien du tout**.

**Annotations 1, 3, 5, 6 et 8**, et le reproche du 22 août dont elles sont la
reprise.

> *« tes droites bougent peu »* — relecture du 22 août
>
> *« pas besoin d'animation mais des images, reprends les animations et mets des
> schémas inspirés de ton animation »* — annotation 1
>
> *« phrases inutiles, de plus pas besoin de faire une animation mais un schéma »*
> — annotation 3
>
> *« animation inutile, supprime, même pas de schéma, c'est simple à comprendre »*
> — annotation 5
>
> *« inutile comme phrase, et pas d'animation, je veux un schéma »* — annotation 6
>
> *« des schémas suffisent, enlève l'animation »* — annotation 8

Une animation où l'objet principal reste immobile pendant que du texte apparaît
n'est pas une animation, c'est une image légendée. Ce qui porte l'idée se
déplace, se déforme, ou se construit sous les yeux.

**Le cas où l'on passe au schéma.** Page 1, section « Plan » : une animation de
22 secondes où le chemin se trace et les onze jalons se posent l'un après
l'autre. Devenue `l1-fig2-carte.svg` : le même chemin, les mêmes onze jalons,
les mêmes libellés — fixes. Le chemin ne change pas dans le temps ; sa
construction progressive n'apprenait rien.

**Le cas où l'on ne met rien.** Page 2, les trois conditions du schéma classique
avaient une animation de 25 secondes. Le tableau à trois lignes qui suit — la
règle existe, elle est exacte, elle est transcriptible — dit la même chose et se
lit plus vite. L'animation est partie, et rien ne l'a remplacée.

**Le cas où l'on anime encore.** `le-renversement`, page 2 : les trois cadres
échangent leur place, et c'est l'échange qui EST l'idée. Elle reste.

## (16) Les formules ne doivent pas se dédoubler à la copie.
*› **fabrication***

> *« il y'a aussi des erreurs d'affichages de formules vérifie bien j'en veux
> aucune »*

KaTeX empile trois couches : le MathML pour les lecteurs d'écran, la source
LaTeX en annotation, et le rendu visuel. Une sélection les prend toutes les
trois et l'étudiant colle `θA\boldsymbol{\theta}_AθA`. Les couches non
visuelles portent `user-select: none`.

## (17) Jamais deux fois la même animation.
*› principe III*

> *« jamais deux fois la meme animation »*

Un identifiant d'animation appartient à une page et à une seule. Rappeler
une idée déjà illustrée demande une scène neuve, sous un autre angle : la
même vidéo servie deux fois dit à l'étudiant qu'on n'avait rien à ajouter.
Cela vaut aussi entre leçons d'un même chapitre.

## (18) Chaque scène animée déclare ce qui change dans le temps.
*› principe II*

Toute scène animée porte le champ « ce qui change dans le temps », qui dit
**quelle grandeur varie** et **ce que sa variation apprend**. Le champ ne peut
pas être rempli par « les objets apparaissent l'un après l'autre » : une
apparition n'est pas un changement, c'est un découpage. Si le champ ne peut pas
être rempli honnêtement, la scène n'est pas une animation mais un schéma, et
elle se réécrit comme tel — tout posé d'un coup.

C'est la règle 15 rendue vérifiable : au lieu de juger si « ça bouge assez », on
nomme la grandeur qui bouge. La 18 s'applique en écrivant une scène ; la 15
s'applique en relisant une page. Un exemple de chaque côté, tirés du chapitre 1 :

> le balayage du biais de $5$ à $40$, où le compteur descend de $362{,}50$ à
> $56{,}25$ puis remonte — **le compteur varie, et c'est sa remontée qui montre
> qu'il existe un minimum**. Animation.
>
> trois cadres qui s'allument l'un après l'autre — **rien ne varie**. Schéma.

## (19) Aucun texte ne décrit ce qu'une figure voisine montre.
*› principe III*

Un texte qui raconte ce qu'une image donne à voir est une redondance : l'image
le montre. La légende dit ce qu'il faut en **conclure**, pas ce qu'on y **voit**.

**Annotations 2, 3 et 6.**

> *« cette phrase est inutile, retiens ça, pas de redondances inutiles »*
> — annotation 2

**Avant.** Page 1, sous l'animation des prérequis :

> « Les trois objets supposés connus, construits l'un après l'autre. Quatre
> nombres traversent la boîte f et en ressortent transformés ; les quatre
> caractéristiques d'un logement s'envolent une à une pour se ranger en
> colonne ; et l'écart entre le prix vrai et une prévision descend, se déplie en
> carré, puis rétrécit jusqu'à disparaître quand la prévision tombe juste. »

**Après.** « Les trois objets supposés connus. »

Le reste de la phrase décrivait des mouvements qui n'existent plus, et qui,
même du temps où ils existaient, se voyaient à l'écran.

## (20) Le critère de figure.
*› principe I*

Une figure qui aide fait l'une de ces trois choses :

- elle **montre un objet dont le texte parle sans le donner à voir** ;
- elle rend une **distinction visible côte à côte** ;
- elle montre **un cas où la chose échoue**.

N'en est pas une :

- une **liste de termes disposée en cercle**, en pyramide ou en arbre ;
- un **tableau redessiné** avec des cadres ;
- **trois cases nommées par les trois choses** dont le paragraphe vient de
  parler.

Le test est celui de la règle 19, pris à l'envers : si la figure ne peut rien
montrer que le texte ne dise déjà, elle ne montre rien. Une mise en page n'est
pas une figure.

## (21) Le texte dit ce que la mesure établit, pas ce qu'on aimerait qu'elle établisse.
*› principe I*

Un exemple qui réfute un cas particulier ne démontre pas le cas général.

**Annotation 7 (b).** Des neuf reprises du 31 août, c'est la seule qui ne porte
pas sur la forme, mais sur ce que le texte affirme.

> *« en plus ta démo n'est pas une démo mais un exemple, supprime »*
> — annotation 7 (b)

**Ce que la mesure fait.** Aucun pixel n'est encré sur les 6 131 images du
chiffre 3. Cela réfute **toute règle portant sur un pixel isolé** : une telle
règle demande un pixel dont l'état est le même sur tous les exemples de la
classe, et le compte à zéro dit qu'aucun candidat n'existe.

**Ce que la mesure ne fait pas.** Elle ne prouve pas qu'aucune règle n'existe.
Une règle portant sur une **relation entre plusieurs pixels** n'est pas atteinte
par ce comptage.

**Les cinq endroits corrigés.**

| Où | Avant | Après |
|---|---|---|
| titre de la section 2.4 | « La règle n'existe pas : la preuve sur 6 131 exemples » | « Ce que la mesure écarte, sur 6 131 exemples » |
| introduction de 2.4 | « Il existe un problème où elle se démontre, et par le calcul. » | « Il existe un problème où l'on peut au moins **écarter des candidates**, et par le calcul. » |
| transition de la page 2 | « l'absence de règle écrite à la main est prouvée par la mesure » | « la mesure … écarte toute règle portant sur un pixel isolé » |
| encart de la page 10 | « il est déjà démontré : la section 2.4 a établi qu'aucune règle écrite à la main ne reconnaît un chiffre » | « La section 2.4 a écarté par la mesure toute règle portant sur un pixel isolé » |
| suite du parcours, page 11 | « le problème où l'absence de règle écrite à la main se démontre au lieu de s'affirmer » | « le problème où l'on peut écarter des règles par la mesure au lieu d'en supposer l'absence » |

Le résumé de la page 2 au sommaire suit la même correction. L'encart « Ce que la
mesure ne dit pas », qui portait déjà la limite exacte, n'a pas bougé, et la
vérification 🧪 n° 6 non plus.

## (22) Dix lignes de prose, pas plus, sans respiration.
*› principe I*

Aucun pavé de prose ne dépasse **dix lignes rendues** sans être interrompu.
Comptent comme respiration : une figure ou une animation, une formule en
display, un tableau, une liste, un encadré, un intertitre.

Ne comptent pas : une formule **en ligne** au fil du texte, un mot en gras, un
changement de paragraphe sans intertitre. Deux blocs de texte qui se suivent
forment **un seul** pavé, et leurs lignes s'additionnent.

**Le cas qui a produit la règle.** La synthèse du chapitre 1, un seul bloc de
prose de **vingt et une lignes rendues** à la largeur de la colonne — vingt-cinq
sur une fenêtre plus étroite. Six idées distinctes y étaient enchaînées : le
renversement, la perte, la dépendance en $\theta$ seul, la descente de gradient,
la généralisation, les trois familles.

**Après.** Six paragraphes, un par idée, chacun sous son intertitre. Le plus
long fait sept lignes. Pas un mot n'a été ajouté ; le texte est celui d'avant,
coupé aux six jointures qu'il portait déjà.

Le contrôle est mécanique et se relance :

```
node outils/mesurer-pave.mjs                 les cinq chapitres
node outils/mesurer-pave.mjs panorama        un seul
node outils/mesurer-pave.mjs --seuil 8       un autre seuil
```

Il mesure les lignes **rendues** dans un navigateur, à la largeur réelle de la
colonne (640 px) et avec la fonte réelle, et non les caractères du source :
« rétropropagation » et « et » n'occupent pas la même place, et c'est la place
qui fatigue le lecteur.

## (23) La respiration doit porter quelque chose.
*› principe I*

La règle 22 se contourne trivialement en glissant une formule décorative toutes
les dix lignes. **Une respiration insérée pour satisfaire la 22 est une faute
plus grave que le pavé qu'elle découpe** : le pavé fatigue, la formule
décorative ment.

Le vrai remède est presque toujours le même : un pavé trop long enchaîne
plusieurs idées, et le découper suffit.

**Les trois questions, dans cet ordre.**

1. **Ce bloc porte-t-il plusieurs idées ?** Alors le découper suffit : un
   paragraphe par idée, un intertitre par paragraphe. Rien n'est ajouté.
2. **L'idée a-t-elle un objet qu'on pourrait montrer ?** Alors une figure — et
   elle obéit aux règles 15, 19 et 20 : pas d'animation si rien ne bouge, pas de
   texte qui décrive ce qu'elle montre, et une mise en page n'est pas une figure.
3. **Ni l'un ni l'autre ?** Alors le bloc est long parce qu'il dit trop de
   choses inutiles, et il se raccourcit.

Les trois pavés du chapitre 1 relevaient tous du cas 1. Aucune figure n'a été
créée pour cette passe, et aucune formule n'a été insérée.

## (24) Le vrai caractère, toujours.
*› **fabrication***

Aucun substitut typographique là où le caractère existe.

| interdit | exigé |
|---|---|
| `W1`, `W2` | `w₁`, `w₂` |
| `theta_A`, `θ_A` | θ_A en indice réel — `MathTex(r"\theta_A")` |
| `B` pour le biais | `b` |
| `x2`, `x^2` | `x²`, ou `x₂` selon ce qui est désigné |
| `-` pour un signe moins | `−` (U+2212) ; `–` ou `—` pour un tiret |
| `m2` | `m²` |
| `...` | `…` |

**Là où le caractère n'existe pas, on ne l'approxime pas non plus.** Unicode ne
porte pas de capitale en indice : `θ_A` ne s'écrit pas avec un souligné, il
s'écrit en `MathTex`, qui compose un vrai indice.

**Le précédent.** Le chapitre 1 a déjà rencontré ce défaut sous une autre forme.
Archivo, la fonte de l'identité, ne porte aucun caractère du bloc grec ; Pango ne
se rabat pas sur une autre fonte, il dessine sa boîte hexadécimale, et
`DescenteUneVariable` affichait « chaque pas divise [03B8] par deux ». Le repli
en fonte système l'a réparé. La règle en est la généralisation : **on ne remplace
jamais un caractère par son approximation, on rend le caractère disponible.**

**Le bandeau met en capitales, et les capitales changent le symbole.** Le titre
de scène passe par `_capitales()`. `θ = (w₁, w₂, b)` y devient `θ = (W₁, W₂, B)` :
`W` n'est pas `w` et `B` n'est pas `b`. Un bandeau ne porte donc pas de nom de
paramètre — il porte ce que la scène montre, en français.

## (25) La taille plancher : rien de rédigé sous 24.
*› **fabrication***

**Aucun texte de plusieurs mots sous la taille 24.** Une cote d'un seul mot ou
d'un seul nombre n'est pas concernée.

Un espace est un caractère, et il tombe sous le seuil. Mesuré sur la fonte
système, la chasse de l'espace est arrondie au vingtième d'unité, et l'arrondi
se voit :

| taille | espace mesuré | espace attendu | ce que ça donne |
|---|---|---|---|
| 16 | 0,050 | 0,056 | mots serrés |
| 18 | 0,050 | 0,063 | « la notedu jeu deparamètres » |
| 20 | 0,050 | 0,070 | « du jeude » |
| 22 | 0,100 | 0,077 | irrégulier |
| **24** | **0,100** | **0,084** | **correct** |
| 26 | 0,100 | 0,091 | correct |

**En dessous de 24, un texte de plusieurs mots n'est pas composé, il est
tassé.** C'est la cause de « lanotedujeudeparamètres », et ce n'était pas un
défaut de fonte : à 18, l'espace vaut 0,050 pour 0,063 attendus, et il disparaît
au rendu.

Le contrôle de collisions de la règle 14 ne voit pas ce défaut : un titre rendu
sans espaces a une boîte parfaitement normale. Seul le seuil le prévient.

## (26) Une page ouvre sur ce qu'elle montre.
*› principe I*

L'ordre d'ouverture d'une page est : **une question ou un fait**, puis **une
figure**, puis **le cadre**. Le cadre — ce dont le chapitre va parler, ce qu'il
suppose connu, où il mène — vient après que quelque chose a été montré, jamais
avant.

Une page qui ouvre sur son propre programme demande au lecteur de retenir une
liste de sujets dont il ne sait pas encore pourquoi ils comptent. Une page qui
ouvre sur un fait lui donne la raison d'abord.

**Le cas.** Le chapitre 1 ouvre encore par le cadre : `panorama/cadre.ts`, bloc
`b-p0-1`, un paragraphe qui annonce que le chapitre dresse la carte du domaine
avant qu'aucune figure n'ait été vue. La règle est écrite ; la correction du
chapitre 1 reste à faire.

## (27) Le renommage obligatoire.
*› **fabrication***

**Quand une scène change de sujet, son identifiant change.** Sinon la page
continue de servir l'ancienne vidéo, devenue fausse, au lieu d'afficher
« à rendre ».

C'est le seul mécanisme qui signale un rendu manquant. Une scène réécrite sous
le même identifiant garde un fichier vidéo valide en apparence : rien n'échoue,
rien n'avertit, et l'étudiant regarde une animation qui ne correspond plus au
texte.

**Corollaire.** `manifeste.py` périme un rendu dès que le module autour de la
classe change, docstring comprise — **toucher un fichier de scènes périme ses
voisines**. Une passe qui édite un fichier de scènes doit s'attendre à re-rendre
tout ce qu'il contient, pas seulement la classe touchée.

## (28) On ne supprime jamais une classe par une coupe de « class » à « class ».
*› **fabrication***

Cet intervalle contient tout ce qui vit entre les deux, **y compris ce qui
appartient à la suivante** : fonctions au niveau du module, constantes, helpers.

**La méthode.** Supprimer le corps de la classe nommée, puis retirer les
constantes mortes **une par une**, en vérifiant à chaque fois qu'aucune autre ne
les emploie.

**Le cas.** La suppression de `CeQueContiennentLesDonnees` a emporté `_nuage()`,
`DEPARTS` et huit constantes qu'employait `LePartitionnement`, sans qu'aucun
contrôle ne le voie : le fichier parse, le manifeste valide, `tsc` sort 0, et la
casse n'apparaîtrait qu'au rendu. Le code perdu n'était pas récupérable.

**Aucun contrôle automatique ne couvre ce cas.** La vérification est humaine, et
elle se fait avant la coupe, pas après.

## (32) Le plus petit texte d'une figure se lit comme le corps de la page.
*› **fabrication***

**Dans une figure, le plus petit texte a la taille du corps de texte de la page,
mesurée à l'affichage.** Une figure ne porte donc que des **étiquettes** : un
symbole, une valeur, un mot ou deux. Tout ce qui est une phrase va dans la
légende du bloc ou dans la lecture guidée qui la suit. La provenance d'un nombre
— le programme, la section — va dans la légende, **jamais dans l'image**.

**La mesure, et elle est refaisable en deux `grep`.** Le corps d'une leçon est
composé à `text-[0.9375rem]`, soit 15 px : `blocs/prose.tsx`. L'article qui le
porte est en `max-w-[44rem]` avec `lg:px-8`, donc une colonne de
44 × 16 − 2 × 32 = 640 px. Une figure y est servie en `w-full`
(`blocs/Statiques.tsx`, `BImage`), et un SVG large de 1380 s'y affiche réduit de
1380 / 640 = 2,156.

| ce qu'on mesure | valeur | où |
|---|---|---|
| corps de la page | 15 px | `prose.tsx`, `text-[0.9375rem]` |
| colonne de lecture | 640 px | `max-w-[44rem]` moins `lg:px-8` |
| largeur d'une figure | 1380 | toutes les figures du cours |
| **plancher dans le SVG** | **33** | 15 × 1380 / 640 = 32,3, arrondi au-dessus |

**Quarante caractères.** Au-delà, ce n'est plus une étiquette. Le texte a sa
place dans la légende, où il est composé au corps de la page, et où un lecteur
d'écran le trouve — dans l'image, il n'est qu'un dessin.

**Le cas.** `l2-fig04-neurone` portait un pied de deux lignes en gris, sous la
taille 11 : « Les 784 poids et le biais sont ceux du neurone qui note le 0 dans
un modèle mesuré, cours/lecon2/mesures.py, section 4. Le gabarit, plus bas,
replie ces mêmes 784 poids en grille. » Et des sous-cotes plus petites encore :
« ligne 9, colonne 7 · octet 222 ». Pendant que la lecture guidée, sous la
figure, disait déjà tout cela en corps de texte. Le lecteur passait d'un texte
lisible à un texte qui ne l'est pas sans que rien ne l'en prévienne.

**Ce n'est pas un plancher qu'on peut franchir.** `txt`, dans les `figures.py`
de chaque chapitre, refuse une taille plus petite au lieu de la composer : une
figure illisible ne se voit pas dans un diff, et se voit très bien chez
l'étudiant. Le contrôle mécanique est `node outils/verifier-figures.mjs`, qui
relève par figure la plus petite taille et le texte le plus long, et sort non
nul.

**Si la figure ne tient plus** avec ses étiquettes à la bonne taille, c'est
qu'elle en portait trop. On garde celles qui nomment ce qu'on regarde, on retire
les autres.

---

## La relecture, en pratique

### Sur le texte

Avant de livrer une section, la relire **à voix haute** une fois, comme on la
dirait à un élève — c'est le test de la règle 4, et il se fait en premier parce
qu'il ne se fait pas en lisant des yeux. Puis la relire en ne cherchant que
ceci, et supprimer à chaque occurrence :

- une suite de phrases courtes qu'on fondrait en une seule en parlant — règle 4
- une phrase qui parle du cours plutôt que du sujet — règle 1
- une annonce de ce qui n'est pas traité — règle 2
- une justification d'un choix que l'étudiant n'a pas contesté — règle 5
- une queue de phrase emphatique — règle 4
- un commentaire sur la forme d'une liste ou d'un tableau — règle 6
- une idée déjà écrite plus haut — règle 12
- une phrase qui raconte ce que la figure d'à côté montre — règle 19
- une transition de plus d'une phrase — règle 8
- le mot « prouvé », « démontré », « établi » — vérifier que la mesure citée
  porte bien sur le cas général, et non sur un cas particulier — règle 21

### Sur les figures

- une animation dont l'objet principal ne bouge pas → un schéma — règle 15
- un schéma dont l'idée se lit déjà dans un tableau voisin → rien — règle 15
- une figure qui n'est qu'une mise en page de mots → rien — règle 20
- la page porte-t-elle au moins deux figures ? — règle 13
- chaque scène animée remplit-elle « ce qui change dans le temps » sans dire
  « les objets apparaissent l'un après l'autre » ? — règle 18
- un identifiant d'animation apparaît-il ailleurs dans le cours ? — règle 17
- chaque texte alternatif nomme-t-il les objets par leur nom du cours, et
  dit-il ce qu'on voit plutôt que la chorégraphie de la scène ? Il se lit lui
  aussi à voix haute — `RETOURS.md`, entrées 13 et 23

### Ce qui ne se voit qu'à l'œil ou à la mesure

- la section porte au moins une figure, et il y a plus de formules que de
  paragraphes — règles 10 et 11
- `python animations/collisions.py <chemin>` — règle 14, puis une trame par
  scène à l'instant le plus chargé, que l'outil ne remplace pas
- `node outils/mesurer-pave.mjs` — règle 22, puis vérifier que chaque
  respiration ajoutée porte quelque chose — règle 23
- aucun texte de plusieurs mots sous la taille 24 — règle 25
- une scène qui a changé de sujet a-t-elle changé d'identifiant ? — règle 27

---

## Ce que ces règles ont coûté, mesuré

L'application des huit annotations du 31 août retire **cinq animations** du
chapitre 1 — il en portait 32, il en porte 27 — et ajoute **cinq schémas
fixes**, produits par `cours/lecon1/figures.py` à partir des valeurs des scènes
supprimées. Aucun nombre n'a changé.

---

## Annexe — l'ancienne numérotation

Un second fichier, `REGLES-DE-REDACTION.md`, a porté à partir du 31 août 2026
une série `R1`–`R10` parallèle à celle-ci, avec `R6` délibérément laissé libre.
Les deux séries se recouvraient. Elles sont fondues ici, et la série `R` est
retirée.

| ancien | devient | ce qui s'est passé |
|---|---|---|
| `R1` animation justifiée | **15** | fusionnée avec l'ancienne 15 « ça doit bouger » |
| `R2` pas de texte descriptif | **19** | reprise telle quelle |
| `R3` rien deux fois | **12** | fusionnée avec l'ancienne 12 « ne pas se répéter » |
| `R4` transition en une phrase | **8** | fusionnée avec l'ancienne 8 « un paragraphe devient une phrase » |
| `R5` ce que la mesure établit | **21** | reprise telle quelle |
| `R6` | — | jamais attribué |
| `R7` recouvrements | **14** | fusionnée avec l'ancienne 14 « aucune superposition » |
| `R8` le vrai caractère | **24** et **25** | scindée : le caractère d'un côté, la taille plancher de l'autre |
| `R9` dix lignes | **22** | reprise telle quelle |
| `R10` la respiration porte | **23** | reprise telle quelle |

Les numéros 1 à 18 n'ont pas bougé. Les règles **20**, **25**, **26**, **27** et
**28** sont neuves.

Deux fichiers de scènes citent l'ancien fichier par son chemin —
`animations/scenes/panorama/fil.py` et `perte.py` — sans citer de numéro.
`contenu/panorama/s5-optimiser.ts` cite « `REGLES.md`, règle 17 », qui reste la
règle 17.
