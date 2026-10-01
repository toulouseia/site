# L'application de l'association

C'est ici que le travail continue. Les dix propositions de `../atelier-ecrans/`
sont une archive ; celle-ci est le point de départ.

## Contribuer : c'est ce dépôt qu'on modifie

**Ce dépôt — `toulouseia/site` — est la maison de l'application.** On le clone,
on y travaille, on y pousse. Rien d'autre à installer, aucun autre dépôt à
récupérer.

Le gros dépôt privé de l'association (`toulouseia/toulouseia`) ne contient plus
les fichiers de l'application : il garde seulement un lien vers une version
précise de celui-ci. Ce lien, c'est l'affaire de l'association, pas la vôtre —
vous n'avez jamais à y toucher.

Donc, concrètement : **clonez `toulouseia/site`** (la commande ci-dessous),
faites vos modifications, enregistrez-les et poussez-les **ici**. C'est tout.
Si vous aviez déjà récupéré l'ancien gros dépôt pour travailler sur
l'application, laissez-le de côté et repartez du clone ci-dessous : votre
travail passé est déjà dans ce dépôt-ci.

## La faire tourner : trois commandes

Il faut **Node 22 ou plus récent**. Pour le vérifier : `node -v`.

```bash
git clone git@github.com:toulouseia/site.git
cd site
npm install     # une dizaine de secondes, une seule fois
npm run dev
```

Puis ouvrir <http://localhost:3000/projets>. C'est tout : ni base de données, ni
clé, ni fichier de configuration à remplir.

Si le port 3000 est déjà pris : `npm run dev -- --port 3001`.

**Un seul serveur de développement à la fois sur une machine ordinaire.** Six
en parallèle ont fait tomber une session graphique le 17 août 2026.

## Voir la version téléphone et la version ordinateur

**Ce sont deux dessins différents, pas le même rétréci.** Ils ne se ressemblent
pas : sur ordinateur, le mur des dix-sept signes ; sur téléphone, une carte
plein écran à la fois. Il faut donc voir les deux.

**La version ordinateur** est celle que vous avez déjà : il suffit que la
fenêtre du navigateur fasse **plus de 1024 pixels de large**.

**La version téléphone** se regarde sans téléphone, dans le même navigateur :

1. `F12` : les outils de développement s'ouvrent.
2. `Ctrl+Shift+M` : un menu de tailles d'appareil apparaît en haut de la page.
   *(Sur un Mac : `Cmd+Option+M`.)*
3. Choisir un appareil dans la liste, ou taper la taille à la main :
   **390 sur 844**, qui est celle d'un téléphone courant.
4. **Recharger la page** : certains écrans mesurent la fenêtre au chargement.

Pour revenir : `Ctrl+Shift+M` à nouveau.

**Le point de bascule est à 1024 pixels de large.** En dessous, le dessin
téléphone ; au-dessus, le dessin ordinateur. Rien entre les deux : il n'y a pas
de troisième version.

### Les écrans

| adresse | ce qu'on y voit |
|---|---|
| `/projets` | **l'écran principal** : le mur, ou le carrousel |
| `/projets/terra` | la fiche d'un projet |
| `/apprendre` | **AI Academy** : les parcours, et où l'on en est |
| `/apprendre/parcours/machine-learning` | un parcours et ses cours |
| `/apprendre/cours/introduction-au-machine-learning` | un cours : objectifs, prérequis, sommaire |
| `/apprendre/cours/introduction-au-machine-learning/pourquoi-cette-direction` | une leçon |
| `/apprendre/ressources` | le fonds : ressources recommandées et séances |
| `/veille` | la revue d'actualité |
| `/outils` | la boîte à outils |
| `/deposer` | déposer un projet |
| `/` | renvoie sur `/projets` |

Quelques adresses valent le détour parce qu'elles montrent un état qu'on oublie
en général de dessiner :

| adresse | l'état qu'elle montre |
|---|---|
| `/apprendre/parcours/focus-avance` | un parcours vide : l'axe est annoncé, rien n'est écrit |
| `/apprendre/cours/nexiste-pas` | une adresse inconnue, avec un vrai code 404 |

## Comment cet écran est assemblé, et pourquoi c'est le seul endroit particulier

Le 17 août 2026, deux propositions ont été retenues, **pas la même pour les
deux formats**. Aucune ne portait la paire à elle seule, il a donc fallu les
recoudre :

| format | vient de | ce que c'est |
|---|---|---|
| **ordinateur** | `atelier-ecrans/run3-A-xhigh/` | le mur des dix-sept signes, la fiche à droite |
| **téléphone** | `atelier-ecrans/run3-C-xhigh/` | le carrousel, une carte plein écran, la règle graduée |

Les cinq autres écrans (accueil, apprendre, veille, outils, déposer) sont
identiques dans les deux propositions et n'ont pas bougé.

**La couture est dans un seul fichier** : `src/composants/projets/EcranProjets.tsx`.
Il porte les deux formes côte à côte, l'une sous `lg:hidden`, l'autre sous
`hidden lg:block`. Le point de bascule est à 1024 pixels, comme partout ailleurs
dans l'application.

```
src/composants/projets/
  EcranProjets.tsx   la couture : les deux formes, et rien d'autre
  Mur.tsx            ORDINATEUR : les dix-sept cases
  Fiche.tsx          ORDINATEUR : la fiche du tiers droit
  Chercher.tsx       ORDINATEUR : la commande, dix-huitième case du mur
  SigneGrand.tsx     ORDINATEUR : le signe des cases
  Carrousel.tsx      TÉLÉPHONE  : la piste et la règle graduée
  Carte.tsx          TÉLÉPHONE  : une carte, quatre informations
  IndexProjets.tsx   TÉLÉPHONE  : les dix-sept en une page, avec les filtres
  FicheProjet.tsx    TÉLÉPHONE  : la fiche plein écran
  Composeur.tsx      les deux   : écrire à un porteur
  contexte.tsx       les deux   : les réglages de tri et de filtre
```

## Le reste du terrain

```
src/app/            les adresses, à la manière de Next.js
src/composants/
  base/             le signe, la jauge, les icônes, les petits blocs
  coque/            le rail de gauche et la barre du bas
  academy/          l'AI Academy, et le rendu des blocs de contenu
  projets/ veille/ outils/ deposer/ profil/   les autres écrans
src/donnees/        les données du club — réelles depuis le 14 septembre 2026
src/serveur/        le contenu d'AI Academy et son chemin jusqu'à l'écran : voir plus bas
src/lib/            les tracés du kit, le tri, le format
worker/             le programme Cloudflare : ce qui répond sous /api/*
animations/         les scènes Manim et leur pipeline de rendu
outils/capture.mjs  prend les images des deux formats sans navigateur ouvert
outils/verifier-contenu.mjs   vérifie que ce que le contenu nomme existe
outils/veille/      la veille : récolter les sources, composer un numéro (LISEZ-MOI.md)
```

## L'architecture : comment la donnée arrive à l'écran

Il n'y a qu'un chemin, et il ne se contourne pas :

```
  écran  →  service  →  port  →  dépôt  →  donnée
                         ↑
             la seule chose qui changera
```

```
src/serveur/
  domaine/       le vocabulaire. Pur : ni React, ni Next, ni base de données
    commun.ts      identifiants, statuts, Resultat, pagination
    academy.ts     Parcours › Cours › Chapitre › Leçon
    blocs.ts       les seize types de blocs d'une leçon
    animations.ts  le contrat avec le pipeline Manim
    progression.ts avancement, reprise, série : des fonctions pures
    visiteur.ts    rôles et droits : peut(visiteur, action, sujet)
    club.ts        projets, veille, outils, fonds de ressources
  ports.ts       les INTERFACES des dépôts. Rien d'autre
  depots/
    demo/          l'implémentation en mémoire : le contenu des cours
    prisma/        vide, et documenté : c'est là que la base se branchera
  services/      les cas d'usage. La seule surface qu'un écran appelle
  contexte.ts    la racine de composition : qui implémente quoi
  http.ts        le pont entre un Resultat et une réponse HTTP
```

**Trois règles tiennent cette architecture, et elles se vérifient à la lecture.**

**1. Aucun composant n'importe une donnée.** Les tableaux de démonstration
vivent dans `depots/demo/` et nulle part ailleurs. Un écran appelle un service ;
un service parle à un port ; un port est implémenté par un dépôt. Remplacer
`catalogueDemo` par `cataloguePrisma` dans `contexte.ts` est un changement d'une
ligne, et aucun écran ne bouge.

**2. Personne ne demande « est-ce que l'utilisateur est connecté ».** On demande
`peut(visiteur, "voir:lecon", { statut })`. Côté cours, `services/session.ts`
renvoie un anonyme : les pages sont fabriquées au build, sans visiteur. La
connexion de l'association vit dans `worker/` et n'atteint pas encore le cours.

**3. Une leçon n'est pas du HTML.** C'est une suite de blocs typés, texte,
formule, animation, code, graphique, quiz, exercice, démonstration… Le rendu
passe par un `switch` exhaustif (`composants/academy/blocs/registre.tsx`) :
ajouter un type de bloc sans ajouter son composant ne compile pas.

### La progression, aujourd'hui

Sans compte, elle vit dans le navigateur
(`composants/academy/progression.tsx`). Elle implémente **la même forme** que le
port serveur et utilise **les mêmes calculs** que le domaine. Le jour de la
bascule, ce fichier change de corps, pas d'interface, et la progression anonyme
sera reprise plutôt que jetée.

### La surface HTTP

Le cours n'en a pas. Les routes `/api/academy/*` et `/api/progression` de la
branche `academy` ont été retirées à la fusion dans `main`, le 25 septembre
2026 : `output: "export"` refuse une route qui lit la requête ou reçoit un
`PUT`, et en ligne tout `/api/*` part d'abord vers `worker/index.ts`. Aucun écran
ne les appelait : ce sont des composants serveur, ils appellent les services
directement. Le jour où la progression monte au serveur, c'est une route de
`worker/`.

## Les animations Manim

Les figures animées des cours de maths sont faites avec **Manim**, rendues hors
ligne, et livrées à l'application par un manifeste JSON.

**Vous n'avez besoin de rien pour travailler sur les écrans.** Les rendus sont
versionnés dans `public/animations/`, avec leur manifeste. Une animation pas
encore rendue s'affiche comme un cadre qui annonce ce que la figure montrera et
d'où elle sortira : c'est un état normal, pas une panne.

Tout est expliqué dans [`animations/README.md`](animations/README.md) : le
contrat, l'empreinte, la recette d'encodage, et à quel seuil il faudra changer
d'hébergement.

```bash
npm run animations          # reconstruit le manifeste, n'a besoin de rien
npm run animations:rendre   # rend les scènes, demande Manim, LaTeX, ffmpeg
```

## Les commandes

```bash
npm run dev         le serveur de développement
npm run build       la construction complète
npm run lint        eslint, zéro avertissement toléré
npm run typecheck   tsc, sans rien émettre
npm run verifier    tout ce que le contenu nomme existe-t-il ?
npm run deploy      la mise en ligne : voir DEPLOIEMENT.md
```

`npm run verifier` est le garde-fou du modèle de blocs : le contenu **nomme**
une animation, une ressource, une démonstration, il ne les importe pas. C'est ce
qui permet au contenu d'être des données. Le prix est qu'une faute de frappe ne
se voit pas à la compilation, elle produit un cadre « indisponible » devant un
étudiant. Cette commande transforme la faute de frappe en échec.

## Trois choses à savoir avant de toucher au code

**Les données sont réelles depuis le 14 septembre 2026, et écrites dans le
code.** Cinq projets, deux porteurs, dans `src/donnees/`. Chacun paraît sous le
nom qu'il a accepté ; les contacts sont ceux que chacun a donnés, ou l'adresse
de l'association qui transmet. On n'invente aucun fait sur l'association : ni
effectif, ni partenaire, ni projet attribué à quelqu'un sans son accord. Les
sections sans contenu (veille, outils, séances) affichent « Rien encore »
plutôt qu'un remplissage.

**Un projet ne recrute pas, il accueille.** Il n'y a ni nombre de places, ni
poste à pourvoir, ni compétence exigée : le porteur dit seulement s'il est
« ouvert aux échanges » ou « au complet pour le moment », et peut ne rien dire
du tout. Une place annoncée puis refusée à celui qui se présente est
exactement la situation que ce choix évite.

**L'application ne transporte aucun message.** Chaque porteur donne les canaux
qui l'arrangent — Discord, WhatsApp, Telegram, Instagram, courriel — et
l'échange se fait là-bas. Pas de messagerie interne : une boîte de plus que
personne ne relève enterre les demandes.

**Le programme d'AI Academy est réel, et son état aussi.** Cinq parcours, deux
cours publiés, signés par leur auteur (`src/serveur/depots/demo/academy/auteurs.ts`).
Un parcours sans cours le dit à l'écran au lieu de se remplir.

**Les tracés du logo ne se retouchent pas.** Ils sont dans `src/lib/traces.ts`,
recopiés du kit sans une virgule de changement. Aucune inclinaison, aucun
étirement, aucune rotation. Seule la couleur change, et seulement vers l'encre,
le blanc ou la brique. Le kit complet est dans `../../identite/kit/`.

**Un seul dessin ne vient pas de nous : la marque de Moodle**, dans
`src/composants/base/MarquesOutils.tsx`. Elle est reprise telle quelle du
fichier `Moodle-logo.svg` de Wikimedia Commons (auteur Moodle.org, licence GNU
GPL), cadrée sur le seul « m » coiffé. On ne la redessine pas et on ne la
recolore pas : un service extérieur se reconnaît à son signe, et retoucher
celui d'autrui est une faute. Le dessin de la banque d'annales, lui, est de la
maison, à la règle du jeu d'icônes.

**`AGENTS.md` est écrit par Next.js lui-même** et prévient que cette version
comporte des changements de rupture par rapport à ce que les modèles ont appris.
Ne pas le supprimer.

## Ce qui reste à faire

**Sur l'écran des projets**

1. **Le remplissage du signe doit monter depuis la pointe**, pas rétrécir par
   l'intérieur.
2. **Les filtres sont encore deux mécanismes séparés** : sur ordinateur la
   commande de recherche, sur téléphone l'index du carrousel. Ils font la même
   chose sans partager leur état — filtrer sur un format ne filtre pas l'autre.
3. **L'outil de capture ne photographie que le rendu du serveur** : dans son
   navigateur sans fenêtre, l'application ne s'anime pas — aucun bouton ne
   réagit, aucun panneau ne s'ouvre. Pour vérifier ce qui se passe après un
   clic, passer par un vrai navigateur.

**Sur l'Academy**

4. **Retirer les données de la maquette** restées dans
   `src/serveur/depots/demo/club/` : dix-sept projets et dix-sept porteurs, tous
   fictifs, dont « Ilyas B. », trop proche du prénom d'un fondateur réel. Aucun
   écran ne les affiche plus ; seuls les fichiers restent.
5. **Brancher la progression sur les comptes de l'association.** Elle vit dans
   le navigateur ; elle devra être poussée au serveur à la première connexion,
   pas jetée.
6. **La recherche de l'Academy** existe en service (`chercher()`) mais aucun
   écran ne l'appelle ; sa route HTTP a été retirée avec les autres.

## Prendre les images

```bash
node outils/capture.mjs /projets /projets/sillage
```

Quatre images par adresse dans `captures/`, en format téléphone et en format
ordinateur. L'outil démarre son propre serveur sur un port libre, prend les
images et arrête tout, il n'ouvre aucune fenêtre.
