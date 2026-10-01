# Les retours de relecture

Ce que le relecteur a dit, page par page, et ce que chaque retour a produit.

**On lit ce fichier avant tout travail sur le cours, juste après `REGLES.md`.**
`REGLES.md` donne l'état d'arrivée — vingt-huit règles, sans leur histoire.
Celui-ci donne ce qui les a produites, et surtout ce qui n'a pas encore produit
de règle : une correction ponctuelle, une tâche ouverte, un défaut vu une seule
fois. Il existe parce que **les contrôles automatiques ne voient pas ce qu'un
lecteur voit**. `tsc` sort 0 sur une page où un symbole arrive six pages avant
sa définition ; `verifier-contenu.mjs` valide un chapitre dont aucune figure ne
se lit ; `collisions.py` ne dit pas qu'une animation est un PowerPoint.

## Comment se lit une entrée

| Champ | Ce qu'il porte |
|---|---|
| **date** | le jour du retour, ou à défaut celui où son effet est entré dans le dépôt |
| **où** | le chapitre et la page visés ; « tout le chapitre » quand le retour ne vise pas une page |
| **le retour** | les mots du relecteur, cités. Jamais reformulés |
| **ce qu'il a produit** | une règle numérotée de `REGLES.md`, une correction, ou une tâche |

**Les dates.** Deux seulement sont écrites ailleurs : la relecture du chapitre 1
du **22 août 2026** et les huit annotations du **31 août 2026**, toutes deux
datées en tête de `REGLES.md`. Les retours sur le chapitre 2 n'ont pas été datés
un par un ; ils portent donc la date à laquelle leur effet est entré dans le
dépôt — `REGLES.md` porté à vingt-huit règles le **2 septembre 2026**, le
chapitre 2 et ses figures le **6 septembre 2026**. Aucune autre date n'est
avancée, et aucune n'est reconstituée au jugé.

---

## La relecture du chapitre 1, le 22 août 2026

### 1. 22 août 2026 · ch. 2, tout le chapitre

> « on comprend très mal les réseaux de neurones »

Le chapitre 2 est restructuré : le premier neurone passe de la page 7 à la
**page 4**, et les trois pages qui le précèdent — le cadre, le jeu, le vecteur —
ne portent plus que ce dont il a besoin.

### 2. 22 août 2026 · ch. 1, tout le chapitre

> « les animations sont super inutiles là où une image peut servir »

**Principe II** de `REGLES.md` — *on n'anime que ce qui change* — et la
**règle 15**, qui range les trois réponses possibles dans l'ordre : rien, un
schéma, une animation.

### 3. 22 août 2026 · ch. 1, tout le chapitre

> « phrases inutiles, redondances, tu le dis plus haut »

**Principe III** — *on ne dit rien deux fois* — et la **règle 12**. La
**règle 19** en découle : aucun texte ne décrit ce qu'une figure voisine montre.

---

## Chapitre 1 — les huit annotations du 31 août 2026

### 4. 31 août 2026 · ch. 1, tout le chapitre — annotation 8

> « des schémas suffisent, enlève l'animation »

Quatre animations du chapitre 1 deviennent des figures fixes, produites par
`cours/lecon1/figures.py` à partir des valeurs des scènes supprimées. Le
chapitre passe de trente-deux animations à vingt-sept, et gagne cinq schémas.

### 5. 31 août 2026 · ch. 1, tout le chapitre — annotation 7 (b)

> « ta démo n'est pas une démo mais un exemple »

**Règle 21** : le texte dit ce que la mesure établit, pas ce qu'on aimerait
qu'elle établisse. Un exemple qui réfute un cas particulier ne démontre pas le
cas général, et ne s'annonce pas comme une démonstration.

### 6. 31 août 2026 · ch. 1, les scènes

> « des superpositions partout »

**Règle 14** : deux objets ne se recouvrent jamais. Elle est doublée d'un crible
mécanique, `python animations/collisions.py <chemin>`, qui construit la scène,
interpole ses animations sur une grille d'une demi-seconde et croise les boîtes.

### 7. 31 août 2026 · ch. 1, les scènes

> « plus jamais de tirets du 8, on veut de vrais affichages »

**Règle 24** : le vrai caractère, toujours. `w₁` et non `W1`, le signe moins et
non le trait d'union, `x²` et non `x^2`, des indices réels et non un souligné.
Là où le caractère n'existe pas, on ne l'approxime pas : on le compose.

### 8. 31 août 2026 · ch. 1, tout le chapitre

> « plus jamais onze lignes sans schéma, animation ou formule »

**Règle 22**, la règle des dix lignes, et la **règle 23** qui ferme sa porte de
sortie : une respiration insérée pour satisfaire la 22 est une faute plus grave
que le pavé qu'elle découpe. Contrôle : `node outils/mesurer-pave.mjs`.

### 9. 31 août 2026 · ch. 1, l'ouverture des pages

> « chaque début commence par un schéma pour intriguer »

**Règle 26** : une page ouvre sur une question ou un fait, puis une figure, puis
le cadre. Le cadre ne vient jamais en premier.

### 10. 31 août 2026 · ch. 1, les scènes

> « 3B1B parle de peigne ? »

Le registre de gestes est retiré du cours. **Règle 7** : aucun vocabulaire
inventé par le cours — on montre l'objet et on le nomme par son nom, au lieu
d'inventer une image pour le désigner.

---

## Chapitre 2 — la relecture du 2 au 6 septembre 2026

### 11. 6 septembre 2026 · ch. 2, les animations

> « aucune animation n'est bien, PowerPoint, on doit voir le réseau »

Les vingt-sept scènes du chapitre sont jetées et archivées. **Huit** sont
refaites sur un réseau partagé, `animations/scenes/reseau/reseau_mob.py`, pour
que ce soit le réseau lui-même qu'on voie bouger, et non des cadres qui
apparaissent l'un après l'autre.

### 12. 2 septembre 2026 · ch. 2, le texte servi

> « il y a encore des tirets cadratins »

Règle, non encore numérotée dans `REGLES.md` : **aucun cadratin dans le texte
servi**. La règle 24 admet le tiret cadratin dans une scène ; le contenu servi,
lui, n'en porte pas.

### 13. 2 septembre 2026 · ch. 2, un texte alternatif

> « la phrase est incompréhensible »

Règle : **le texte alternatif dit ce qu'on voit**, sans jargon et sans
chorégraphie. Il décrit l'image pour qui ne la voit pas ; il ne raconte ni
l'ordre d'apparition des objets, ni l'intention de la figure.

### 14. 6 septembre 2026 · ch. 2, tout le chapitre

> « tu vas vite, tu expliques rien, tu complexifies »

La **passe de compréhension** : un sous-agent lit le chapitre en lecteur, page
par page, et signale ce qu'il ne comprend pas — sans jamais corriger lui-même.
Ses questions reviennent ici, traitées comme des retours.

### 15. 6 septembre 2026 · ch. 2, page 2

> « un poids ? », « une translation ? », « fait par qui ? », « il n'y a même
> plus d'images »

Les questions des élèves sur la page 2. Règle : **aucun terme avant sa
définition**. L'argument du 7 décalé, qui parlait de poids avant que $w$
existe, est déplacé en **page 4** avec ses deux grilles —
`l2-fig19-sept-decale`.

### 16. 6 septembre 2026 · ch. 2, la mise en page

> « des superpositions partout, images coupées, tout est trop petit, élargis la
> page »

Règle de composition : **un sujet par trame**, des marges franches, et la vidéo
servie pleine largeur. C'est la règle 14 portée du côté des figures fixes et de
la page rendue.

### 17. 6 septembre 2026 · ch. 2, les figures

> « ça dépasse et on voit rien »

La palette : **brique sur papier**, et pas de noircissement. Le contraste se
prend sur la teinte, jamais en assombrissant le fond.

### 18. 6 septembre 2026 · ch. 2, les figures

> « le gris clair sur blanc »

Le repos se rend en **encre à opacité réduite**, jamais en gris clair. Un gris
clair sur blanc ne se lit pas, et il ne se rattrape pas à l'impression.

### 19. 6 septembre 2026 · ch. 2, page 4

> « ça parle de a(66) alors qu'on n'a pas vu ce qu'est un neurone »

`l2-fig04-neurone` montrait le neurone caché n° 66, une couche, ReLU, une
activation et « 35 des 128 » — cinq objets qu'aucune page n'avait encore posés.
La figure est refaite : elle ne montre plus que ce que la page 4 définit,
$\mathbf{x}$, $\mathbf{w}$, $b$ et $z$, et son $z$ est celui du neurone qui note
le $0$, mesuré. Le retour a produit en outre le **crible de tout le chapitre** :
pour chacune des vingt-et-une figures, la liste des objets montrés et la page où
chacun est défini. Il a relevé cinq autres fautes du même ordre — les figures 0, 2,
5, 7 et 16 — toutes corrigées. La table tient dans
`cours/figures/CORRESPONDANCE.md`.

### 20. 6 septembre 2026 · ch. 2, page 1

> « il manque une grosse image qui montre à quoi ressemble un réseau »

`l2-fig20-le-reseau-entier` : le réseau complet, $784 \rightarrow 128
\rightarrow 10$, sans un seul symbole, posé page 1 juste après l'ouverture et
repris **tel quel** page 10, où chacun de ses traits reçoit enfin son nom.

### 21. 10 septembre 2026 · ch. 1 et 2, toutes les figures

> « les images ne sont pas si petites mais tu écris beaucoup dedans : le plus
> petit des textes sur une image doit être comme le texte du corps hors image »

C'est la **règle 32**, et elle se mesure. Le corps d'une leçon fait 15 px ; une
figure est servie en `w-full` dans une colonne de 640 px ; les figures du cours
sont larges de 1380. Le plancher dans le SVG vaut donc 15 × 1380 / 640 = 32,3,
arrondi à **33** — et il est armé dans le code : `txt` refuse une taille plus
petite au lieu de la composer.

**Le cas.** `l2-fig04-neurone` portait un pied de deux lignes en gris sous la
taille 11, qui donnait la provenance des poids ; et des sous-cotes plus petites
encore. Pendant que la lecture guidée, sous la figure, disait déjà tout cela en
corps de texte.

Une figure ne porte donc que des **étiquettes** : un symbole, une valeur, un mot
ou deux, quarante caractères au plus. Les phrases sont passées dans les légendes,
la provenance des nombres aussi. Le contrôle mécanique est
`node outils/verifier-figures.mjs`.

---

## Chapitre 1 — la lecture à voix haute du 13 septembre 2026

### 22. 13 septembre 2026 · ch. 1, tout le chapitre

> « le texte n'est pas naturel, on doit pouvoir le lire à voix haute, ça coupe
> trop rapidement »

**La cause.** La **règle 4** disait « la phrase s'arrête quand l'information est
donnée », et elle a été appliquée comme *une proposition par phrase*. Le cas :
« Regarde le pixel de la ligne 9, colonne 7. Il porte l'octet 222. Regarde le
trait qui en part. Il porte le poids w₂₃₁. » Quatre phrases de six mots, qui se
disent en une seule.

La règle 4 est réécrite, sans changer de numéro : une phrase se lit à voix haute
d'un seul souffle, avec ses liaisons, et dit une chose. La longueur n'est pas le
critère, le souffle l'est. Le test entre dans « la relecture, en pratique » et
passe en premier, parce qu'il ne se fait pas en lisant des yeux.

Le chapitre 1 est repassé paragraphe par paragraphe, à voix haute, et les coupes
de phrase seules ont bougé : aucun nombre, aucune figure, aucune idée, aucune des
onze pages n'a changé de contenu.

### 23. 13 septembre 2026 · ch. 1, les textes alternatifs

> « le nombre ajouté à la fin » pour le biais $b$ ; « la barre se raccourcit »,
> « se rétractent », « un zéro s'affiche, et une croix le barre »

Les textes alternatifs du chapitre 1 n'étaient jamais passés au crible que
l'entrée 13 a posé sur le chapitre 2. Deux défauts, tous les deux dans la même
phrase de `lecart-brut-se-compense` : l'objet y est nommé autrement que dans le
cours — « le nombre ajouté à la fin » alors que $b$ est défini page 4 et que la
scène est page 5 — et le reste raconte la chorégraphie de la scène, pas ce qu'on
voit.

**Avant.** « Le nombre ajouté à la fin balaie son intervalle : la barre de la
première vente se raccourcit pendant que celle de la seconde s'allonge, et la
barre de la moyenne traverse le zéro. À b = 22,5 les deux écarts valent −7,5 et
+7,5 ; posés dos à dos ils se rétractent jusqu'à disparaître. Un zéro s'affiche,
et une croix le barre. »

**Après.** « Le biais b varie de 20 à 25. Les deux écarts, moins dix et plus cinq
au départ, se rapprochent de zéro chacun de son côté, et leur moyenne passe par
zéro à b = 22,5, alors que chacun des deux vaut encore sept et demi. Un zéro
barré d'une croix marque ce moment. »

Règle, qui prolonge celle de l'entrée 13 : **un texte alternatif nomme les objets
par leur nom du cours, dit ce qu'on voit, et se lit à voix haute**. Aucun verbe
de chorégraphie — s'affiche, apparaît, se rétracte, s'envole — et aucun symbole
composé : on écrit « y chapeau », pas « ŷ », « la perte ell », pas « ℓ », parce
qu'un lecteur d'écran lit ce texte et ne lit pas un glyphe.

Les quarante-deux alternatives portées par les onze pages sont relues une par
une : huit sont réécrites, les autres passaient déjà. S'y ajoutent les
alternatives des six animations que le chapitre sert encore. **Les vingt-deux
autres scènes déclarées dans `animations/scenes/panorama/` ne sont plus servies
par aucune page** depuis le resserrement du 8 septembre ; leurs alternatives
n'ont pas été touchées, et le jour où l'une d'elles revient dans une page, elle
passe d'abord par cette règle.

---

## La page du cours, le 13 septembre 2026

### 24. 13 septembre 2026 · la page du cours, et le site

> « trop d'écritures dans les pages de cours et sur le site »

Ce retour ne vise aucune page de leçon : il vise ce qui se lit AVANT d'ouvrir
une leçon. La page du cours annonçait 2 h 51 pour un chapitre 1 que le
resserrement du 8 septembre avait ramené aux trois quarts d'heure ; ses
sous-titres décrivaient des sections supprimées ; sa présentation citait la
charte de fabrication ; et sept objectifs demandaient de *prouver*, *dériver* et
*démontrer* sous une étiquette « Débutant ».

**Les durées ne s'écrivent plus.** `domaine/duree.ts` les calcule depuis les
blocs de chaque page — les mots à deux cents par minute, la durée des animations
rendues, une minute par vérification — et le dépôt les dérive comme il dérivait
déjà le nombre de leçons. Le champ `minutes` a disparu de `sommaires.ts`, et le
type `LeconEcrite` fait échouer la compilation si quelqu'un l'y remet. Le
chapitre 1 affiche quarante-trois minutes, le cours six heures quarante-quatre
au lieu de dix-huit heures seize.

**Les soixante-sept sous-titres sont réécrits** d'après les pages telles
qu'elles sont, en une ligne et en français courant : ils disent ce que l'élève va
comprendre, non ce que la page démontre. « Le renversement, puis la mesure qui
écarte toute règle portant sur un pixel isolé » devient « Pourquoi on ne peut pas
écrire la règle à la main, et ce que l'humain fournit encore ».

**Le chapitre 6 sort du cours d'introduction.** Il réclame Cauchy-Schwarz, un
développement limité et une diagonalisation ; il devient le premier cours du
parcours de maths, avec les prérequis qui le suivent. Les cinq objectifs qui
restent ne nomment plus que des objets des chapitres 1 à 5.

Aucune page de leçon n'a été touchée : le contenu servi est identique au mot
près, seuls `sommaires.ts`, `cours.ts` et `parcours.ts` ont changé.

**Tâche ouverte.** Le retour dit « et sur le site ». Seule la page d'un cours a
été reprise. Les autres écrans de l'Academy — l'accueil, la page d'un parcours,
le rail — n'ont pas été relus avec le même œil.

---

## Les chapitres 2 à 5, la passe du 20 septembre 2026

Quatre chapitres ont été relus en parallèle, chacun par un lecteur qui ne
connaissait que ce qui précède. Les rapports sont dans les huit
`À-FUSIONNER.md` des chantiers ; ce qui suit en retient les retours, et rien
des corrections de style.

### 25. 20 septembre 2026 · ch. 2, tout le chapitre

> « un terme sur deux arrivait avant sa définition »

Les objectifs de la page 1 lâchaient sept mots inconnus d'un coup, la page 3
démontrait une proposition sur un modèle jamais écrit, et la page 2 mélangeait
octets et réels sans jamais dire qu'on divise par $255$. Objectifs, plan et
table des dettes réécrits avec les seuls mots que le lecteur possède ; le
modèle $W\mathbf{x}+\mathbf{b}$ posé page 3 **avant** la proposition 1 ; la
division par $255$ écrite page 2, là où le lecteur la réclame.

### 26. 20 septembre 2026 · ch. 2, les nombres

Trois tours de lecture. Le troisième a coûté le plus cher, et il dit pourquoi
les deux premiers ne suffisent pas : **un lecteur qui ne bute plus sur le
vocabulaire se met à recouper les nombres.** Il a trouvé six contradictions et
deux nombres faux — dont trois de la main du chantier — que personne n'avait
vus : les deux $1$ de la planche de la page 2 en troisième et sixième position
et non en cinquième, les $121$ paires de la page 7 qui ne sont pas celles que
la première ligne écarte, un prix attribué page 9 à $\mathrm{ReLU}$ que le
rappel de la même page lui retire, et $\mathrm{ReLU}$ posé sur la couche de
sortie dans le formulaire de la page 12. Corrigés.

### 27. 20 septembre 2026 · ch. 2, les numéros de vérification

**Trois lecteurs sur trois s'y sont arrêtés** : les numéros ne suivent pas
l'ordre des pages — 9, puis 11 en page 4, puis 10 en page 5 ; 17, puis 15, puis
18 sur la page 9. Les numéros de 🧪 ne se réattribuent jamais. Le texte dit
donc maintenant qu'ils ne suivent pas l'ordre de lecture.

### 28. 20 septembre 2026 · ch. 2, page 2 — tâche ouverte

> « les auteurs du jeu ont recadré les 70 000 images »

Quel jeu, quels auteurs. Le chantier n'a pas inventé de nom, et c'est le bon
choix : c'est un fait à écrire, pas à deviner. **Reste à faire.**

### 29. 20 septembre 2026 · ch. 3, les prérequis et la page 7

Les prérequis annonçaient au chapitre 1 « la dérivée d'une fonction d'une
variable » et la règle de mise à jour
$\theta_{t+1}=\theta_{t}-\eta f'(\theta_{t})$. Vérification faite, le
chapitre 1 ne contient **aucune** occurrence du mot « dérivée », aucune de la
règle, aucune de « analyse par cas » : la page 7 disait « on reprend cet
argument » d'un argument jamais lu, et la vérification 26 envoyait le lecteur
chercher une table qui n'existe pas. Corrigé : les prérequis disent ce que le
chapitre 1 donne vraiment.

### 30. 20 septembre 2026 · ch. 3, page 7

La proposition 1 s'écrivait avec $\partial E/\partial\theta_{i}$,
$\mathbf{e}_{i}$ et $\mathrm{grad}_{\boldsymbol{\theta}}E$ — trois objets que
la page **8** définit — sur une page qui promettait que « tout ce qui suit se
voit en dimension $1$ ». C'est la reprise la plus lourde de la passe : la
proposition 1 est réécrite en dimension un, sur un seul paramètre, et la page 8
la transporte une fois le gradient défini. Aucun nombre n'a bougé.

### 31. 20 septembre 2026 · ch. 3, pages 7 et 8

Deux démonstrations concluaient au-delà de ce qu'elles établissaient : la
proposition 2, énoncée et démontrée en dimension un, était appliquée page 8 à
$\boldsymbol{\theta}\in\mathbb{R}^{101\,770}$ sans un mot ; et la proposition 3
tirait la direction de plus forte **décroissance** d'une inégalité qui ne
majorait que la croissance. Ce second pas justifie le signe moins de tout
l'algorithme, et il n'était pas écrit. Les deux sont corrigées, la seconde avec
la condition $\mathrm{grad}\neq\mathbf{0}$ sans laquelle l'unicité tombe.

### 32. 20 septembre 2026 · ch. 3, page 8 — ce que la lecture a validé

> « je ne me sens pas floué, et je tiens à le dire nettement »

Sur une proposition **admise**, et c'est le point : l'encart nomme les deux
outils manquants, dit à quel cours ils appartiennent, et la vérification
numérique sur cent directions arrive immédiatement après. Un résultat admis ne
coûte rien au lecteur quand la page dit ce qu'elle emprunte, et à qui.

### 33. 20 septembre 2026 · ch. 3, page 10

La page n'avait pas été lue au premier tour — son lecteur s'était interrompu,
et c'était le seul trou de la passe. Lue au second, elle portait une
contradiction interne : le texte disait en tête que $\boldsymbol{\theta}$ et
son gradient « vivent dans le même espace », et la légende du dernier tableau,
quarante lignes plus bas, qu'« aucun des trois ne vit dans l'espace des deux
autres ». Corrigé : les deux derniers étages partent du même espace, et c'est
leur **arrivée** qui les sépare.

### 34. 20 septembre 2026 · ch. 3, page 1 — tâche ouverte

Le tableau des dettes annonce que $\sigma'\leq 1/4$ se règle page 10 « par la
lecture des composantes du gradient **couche par couche** ». La page 10 ne lit
jamais les composantes par couche : la mesure 4 est globale sur les
$101\,770$, et la mesure 10 ne donne par bloc que des comptes de zéros. Deux
issues, et le chantier a eu raison de signaler plutôt que de combler : ajouter
à `cours/lecon3/mesures.py` une mesure de la norme du gradient par bloc — trois
lignes, et la page en serait bien plus forte — ou corriger la colonne
« Comment » du tableau. **Reste à faire.**

### 35. 20 septembre 2026 · ch. 4, pages 1 et 3

> « Démontré au chapitre 2, page 6 »

Le chapitre 2 écrit en tête de son index : « le symbole nabla non plus, et
aucun gradient n'y est dérivé ». Le point de départ de tout le chapitre 4,
$\mathrm{grad}_{\mathbf{z}^{[2]}}\,\ell=\mathbf{a}^{[2]}-\mathbf{y}$, reposait
donc sur une référence fausse. L'identité rejoint les énoncés **admis**, une
troisième dette est ouverte page 1, et la mesure 2 la vérifie sur les dix
coefficients de $\mathbf{b}^{[2]}$. **Reste à décider :** si le chapitre 2
gagne cette dérivation, la dette se referme et les deux renvois redeviennent
justes.

### 36. 20 septembre 2026 · ch. 4, page 3

La règle « aucun terme avant sa définition » a été tenue dans le corps — le mot
« souhaite » et ses trois cousins sont traduits page 3 — mais **le titre de la
page en porte un**, et il ne vient pas du contenu : il est dans `sommaires.ts`.

Ce que cela produit : **un contrôle de vocabulaire qui ne lit que `contenu/` ne
voit ni les titres ni les résumés.** Aucun crible du dépôt ne les lit.

### 37. 20 septembre 2026 · ch. 4, les figures

`verifier-recouvrements.mjs` écarte les traits déclarés `filet=True`, à raison :
un titre est fait pour toucher sa règle. Mais la dixième rangée de
`l4-fig08-hebb` était **écrite par-dessus le filet du pied**, et le crible n'a
rien dit. Seul l'œil l'a vue, à la largeur servie. La **règle 14** vaut mot pour
mot du côté des figures fixes : une trame par figure, regardée à 640 px. Les
deux cribles ne remplacent pas le coup d'œil.

### 38. 20 septembre 2026 · ch. 4, toutes les pages

Un lecteur qui repose les divisions du chapitre trouve $227{,}2$ là où le texte
annonce $228{,}6$, et $-0{,}750714$ là où il annonce $-0{,}755461$ : les sorties
de programme **affichent des valeurs arrondies**, et les quotients sont calculés
sur les valeurs exactes.

Règle : **quand un texte invite à refaire un calcul sur des nombres affichés, il
dit que l'affichage est arrondi.** Un encart le pose une fois pour tout le
chapitre, page 3.

### 39. 20 septembre 2026 · ch. 4, les figures — trois pièges de fabrication

`nb(0.0, signe=True)` composait « +0,000000 » pour un zéro exact, et un plus
devant un zéro laisse croire à une valeur positive très petite — exactement ce
que la figure 11 niait. `txt_indice` compose un **indice**, et il avait été
employé pour l'exposant de $[0,1]^{784}$, qui descendait donc sous la ligne
(règle 24). Le plancher de la règle 32 était **vérifié après coup et non
armé** : il l'est maintenant dans `txt`, avec la limite des quarante
caractères, et ce qui dépasse lève une exception au lieu de se composer.

### 40. 20 septembre 2026 · ch. 4, page 6

> « il suffit pour cela que $\delta_{k}$ soit nul »

La proposition 1 démontre $\delta_{k}>0$ **strictement** pour les neuf classes
et $\delta_{c}<0$ strictement : $\delta_{k}$ ne s'annule jamais, et le
contre-exemple à la règle de Hebb était inconstructible. Ce qui casse
l'analogie est plus fort et se dit sans rien inventer : deux neurones peuvent
s'activer ensemble et voir leur liaison **descendre**, ce que Hebb n'autorise
pas, et c'est le cas des neuf classes sur dix.

### 41. 20 septembre 2026 · ch. 4, page 9

> « $x_{i}=0$ pour les pixels noirs de l'image »

Le chapitre 2 pose que l'octet vaut **0 pour le blanc du papier et 255 pour le
noir plein de l'encre**. Les 596 pixels nuls sont donc ceux du **fond**, et le
texte disait l'inverse — au milieu du seul compte du chapitre qui se prédise
avant de se mesurer. Corrigé.

### 42. 20 septembre 2026 · ch. 4, pages 1 et 11

La page 1 annonçait « 0,291 ms contre 7,4 s » ; la mesure 7 de la page 11 donne
2 384 µs et 42,9 s. **Aucun des deux nombres de la page 1 n'existait dans les
mesures.** La page 1 cite maintenant ce que la page 11 mesure.

### 43. 20 septembre 2026 · ch. 4, page 1

> « celle du milieu en porte 128, un nombre que personne n'a déduit de quoi que ce soit »

Le chapitre 3, page 11, règle cette dette du chapitre 2 par une mesure sur cinq
largeurs. La lecture guidée de la figure d'ouverture du chapitre 4 la rouvrait.
Corrigé : la phrase renvoie à la mesure du chapitre 3. **Une dette réglée
ailleurs ne se redonne pas pour ouverte** — c'est un contrôle que seule une
lecture croisée des chapitres attrape.

### 44. 20 septembre 2026 · ch. 5, tout le chapitre

Cinq fautes traversaient les douze pages : **le cours parlait de lui-même**
(règle 1) — la page 1 y était presque entière, « Plan », « Ce que ce chapitre
règle », « Place dans le parcours » — douze blocs `repere` (règle 8), le
cadratin dans le texte servi, la suite de brèves, et « Proposition N » en tête
de sept dérivations. Les douze `repere` ne sont pas remplacés par douze
phrases : sept disparaissent, cinq deviennent une phrase de `texte` parce
qu'elles apprenaient quelque chose que la page ne disait pas ailleurs.

### 45. 20 septembre 2026 · ch. 5, pages 1 et 2

Les deux pages sont sorties de la passe avec **76 barres obliques inverses
seules** là où le LaTeX en demande de doublées. En source TypeScript,
`"$\delta$"` ne vaut pas `$\delta$` : `\d` retombe sur la lettre, et `\b` est un
caractère de recul. Le compilateur accepte les deux formes, le vérificateur ne
lit pas les formules, et le défaut n'apparaît qu'au rendu.

**Il n'existe aucun crible pour cela dans le dépôt**, et il en faudrait un :
dans un fichier de contenu, une barre seule suivie d'une lettre est toujours
une faute.

### 46. 20 septembre 2026 · ch. 2, 3 et 4, la vue texte — tâche ouverte

Trois chantiers sur quatre ont buté sur le même outil, et les lecteurs avec eux.
`outils/exporter-chapitre.mjs` annonce en tête que « le LaTeX des formules est
translittéré en Unicode », et il laisse passer `\odot`, `\varepsilon`, les `&`
d'un `aligned` et les `\underbrace`, rend `^{9}` avec une accolade en trop, et
sort parfois `\sigma` en capitale. **Trois lecteurs sur douze s'y sont
arrêtés** au chapitre 4.

Le même export affiche « undefined min » et « NaN minutes » sur toutes les
pages des chapitres 2, 3 et 4, parce que le champ `minutes` a quitté
`sommaires.ts` le 13 septembre (entrée 24) et que l'exporteur le somme encore
au lieu de le calculer par `domaine/duree.ts`. Le lecteur du tour 1 du
chapitre 2 l'a relevé comme **le premier signal reçu** en ouvrant la page 1, et
l'a lu comme « ce texte n'est pas fini ».

Cela ne touche pas l'application, qui compose ces formules avec KaTeX : le
défaut est dans la vue texte — celle-là même que la relecture emploie.
**Reste à faire.**

### 47. 21 septembre 2026 · ch. 3, 4 et 5, les animations

Le verdict porté sur le chapitre 1 le 22 août — *« les animations sont super
inutiles là où une image peut servir »*, entrée 2 — puis sur le chapitre 2 —
*« aucune animation n'est bien, PowerPoint, on doit voir le réseau »*,
entrée 11 — n'avait jamais été appliqué aux chapitres 3, 4 et 5. Il l'est.

**Des quatre-vingt-quatre scènes déclarées, il en reste vingt-quatre**, huit par
chapitre, et aucune des gardées n'est conservée en l'état : toutes passent sur
le réseau partagé du chapitre, et tous leurs nombres sortent du programme de
mesures. Le critère est le même pour les trois, et il n'en a pas d'autre : une
animation est gardée si elle montre **un objet du chapitre en train de faire
quelque chose**, jetée si elle en montre une *image* — un engrenage n'est pas
une dérivée partielle, un sablier n'est pas une somme, un métronome n'est pas
une récurrence.

Les tables de correspondance sont dans `animations/scenes/<chapitre>/IDS.md`,
ancien identifiant par ancien identifiant. **Aucune des quatre-vingt-quatre
n'avait jamais été rendue** : la coupe n'a rien coûté en rendu, et il n'y avait
aucun répertoire à retirer de `public/animations/`.

### 48. 21 septembre 2026 · ch. 3, ce que la fusion a dû trancher

Les deux chantiers du chapitre 3 se contredisaient sur le sort des vingt-huit
scènes. Celui des pages les remplaçait par vingt-huit figures fixes et en
gardait **une**, `la-difference-finie-tatonne`, « sous condition » ; celui des
scènes, plus tardif, en a écrit **huit neuves** et déclare cette même scène
supprimée. `IDS.md` se donne pour « le contrat entre ce chantier et celui des
pages », et c'est l'état du dépôt : les huit scènes existent et sont rendues.
La fusion a donc suivi `IDS.md`, et gardé les vingt-huit figures fixes, qui ne
se disputent rien avec elles.

Un arbitrage de plus, plus petit : `le-pas-sarrete-au-premier-creux` est servi
page **8** et non page 7. Les deux chantiers voulaient le bloc de la page 7
retiré, et la page 8 est celle où les trois taux d'apprentissage sont mesurés.
