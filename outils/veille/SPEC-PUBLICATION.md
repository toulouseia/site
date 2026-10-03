# La veille se publie sans Claude Code : spécification

État : **proposition**. Rien de ce qui suit n'est une décision figée. Chaque automatisme est un réglage qu'on peut couper,
et aucun ne démarre en publication réelle.

## Ce qu'on veut

- Deux vagues par semaine choisies à la main par les curateurs de la veille.
- Des vagues automatiques entre les deux, qui paraissent seules.
- Publier sans ouvrir Claude Code ni un terminal : un navigateur suffit, y
  compris sur téléphone.
- Garder la règle du 15 septembre 2026, écrite dans l'ancien dépôt
  `toulouseia/toulouseia` : le contenu rédigé par le bureau est un fichier du
  dépôt, pas une ligne de base. Chaque vague est donc un commit.

## Ce qui existe déjà

- `outils/veille/` : la récolte, le composeur, la
  vérification, et `SOURCES.md` pour ce que chaque source permet.
- La mise en ligne se fait à la main, `npm run deploy`, depuis un poste
  connecté à Cloudflare, comme le décrit `DEPLOIEMENT.md`. Il n'y a ni
  intégration ni déploiement continus : un push ne change pas le site.
- Le numéro 01 est en ligne depuis le 29 septembre 2026.

## Les pièces

### 1. Un utilisateur `veille` sur un serveur du club

Un compte Linux à part, qui ne voit rien des autres comptes de la machine. Il a :

- son propre clone du dépôt ;
- un jeton GitHub à grain fin, limité au seul dépôt `toulouseia/site`,
  avec les droits sur les tickets, les demandes de fusion et le contenu ;
- sa propre connexion à `claude`, pour `claude -p` ;
- des minuteurs systemd, tous décrits dans le fichier de réglages.

Ce serveur est aujourd'hui celui d'un membre. Si ce membre part, le compte
`veille` se recrée ailleurs en suivant le LISEZ-MOI : rien n'y vit qui ne soit
dans le dépôt, à part les deux jetons et la connexion à `claude`.

### 2. Deux actions GitHub dans le dépôt

- **`veille-apercu.yml`** : pour chaque demande de fusion, construire le site et le téléverser comme version
  d'essai (`wrangler versions upload`). L'action commente l'adresse
  d'aperçu. Rien ne change pour les visiteurs.
- **`veille-deploy.yml`** : sur un push vers `main` qui touche
  `src/donnees/numeros/`, construire et mettre en ligne.
  L'action déploie tout `main`, comme `npm run deploy` le ferait : elle ne se
  déclenche que sur la veille pour ne pas changer le rythme des autres
  chantiers. Elle se lance aussi à la main, depuis l'onglet Actions.

Les deux actions lisent un jeton Cloudflare limité à l'édition des Workers du
compte du club, rangé dans les secrets du dépôt. Chacune se coupe en la
désactivant dans l'onglet Actions, sans toucher au code.

### 3. Sur le site

- `Numero` gagne un champ facultatif `auto: true` pour une vague automatique.
- L'écran de la veille affiche alors « Sélection automatique » à côté du
  numéro, et l'affiche le porte aussi. Un lecteur sait toujours si un humain a
  choisi.

### 4. Le fichier de réglages

`outils/veille/reglages.json`, versionné, lu par tous les
programmes du serveur :

```json
{
  "curateurs": ["login-github-1", "login-github-2"],
  "vagues_manuelles": { "jours": ["lundi", "jeudi"], "heure": "08:00", "sujets_dans_le_ticket": 60 },
  "vagues_auto": {
    "mode": "essai",
    "jours": ["mardi", "mercredi", "vendredi", "samedi", "dimanche"],
    "heure": "12:00",
    "entrees_max": 5,
    "entrees_min": 3
  },
  "sondage_minutes": 5
}
```

`mode` vaut `arret`, `essai` ou `reel`. Il vaut `essai` au départ. Un fichier
`outils/veille/PAUSE` présent dans `main` arrête toutes les
vagues automatiques, quel que soit le mode : n'importe qui ayant accès au dépôt
peut couper, sans toucher au serveur.

## Une vague manuelle

1. Les jours prévus, le serveur récolte et ouvre un ticket « Vague du
   AAAA-MM-JJ ». Le ticket liste les sujets les mieux classés avec des cases à
   cocher, au format de la récolte actuelle. La liste complète reste sur le
   serveur ; un commentaire `/tout` la fait poster en plusieurs commentaires.
2. Un curateur coche dans le ticket. Il peut ajouter des lignes
   `- [x] https://…` pour un sujet lu à la main, par exemple dans AlphaSignal.
3. Il commente `/publier`. Le serveur sonde les tickets toutes les
   `sondage_minutes` et n'obéit qu'aux logins de `curateurs`.
4. Le serveur compose le numéro, rédige un premier jet avec `claude -p`, fait
   passer le contrôle décrit plus bas, pousse une branche `veille/nNN` et ouvre
   une demande de fusion liée au ticket. L'action d'aperçu y commente
   l'adresse du site d'essai.
5. Le curateur corrige le français dans l'éditeur de GitHub, regarde l'aperçu,
   et fusionne. L'action de déploiement met en ligne. Le serveur ferme le
   ticket.

Commandes possibles dans le ticket : `/publier`, `/tout`, `/abandon` qui ferme
le ticket sans rien produire.

## Une vague automatique

1. Récolte.
2. Choix, par règles fixes et sans modèle :
   - un sujet repris par au moins deux maisons, les lettres TLDR comptant pour
     une seule, ou lu directement dans le fil d'un labo ;
   - rien de déjà paru dans un numéro précédent, reconnu par l'adresse ;
   - rien de marqué « avis ou spéculation » ni « vitrine commerciale » par la
     récolte ;
   - au plus `entrees_max` sujets, les plus repris d'abord.
3. Rédaction par `claude -p`, avec la consigne actuelle du composeur.
4. Contrôle par un second `claude -p`, qui ne voit que la ligne rédigée et le
   résumé de la source, et répond pour chaque champ si l'affirmation est dans
   le résumé. Une entrée dont un champ n'est pas soutenu est retirée, pas
   réécrite.
5. `veille:verifier`.
6. S'il reste au moins `entrees_min` entrées :
   - en mode `essai`, le serveur ouvre une demande de fusion marquée « vague
     automatique, essai », sans la fusionner ;
   - en mode `reel`, il commite sur `main` avec `auto: true`, ce qui met en
     ligne.
   Sinon la vague n'a pas lieu, et la raison est notée.
7. Dans tous les cas, un commentaire sur un ticket de suivi « Vagues
   automatiques » dit ce qui a été fait : sujets retenus, sujets retirés par le
   contrôle et pourquoi, lien vers le commit ou la demande de fusion.

Retirer une vague parue : `git revert` du commit sur `main`. L'action de
déploiement remet le site dans l'état précédent.

## Sécurité

- Le dépôt est public : aucun jeton, aucun nom de serveur, aucune adresse
  n'y entre. Les logins des curateurs, eux, y figurent, puisqu'ils sont déjà
  publics sur GitHub.
- Le jeton GitHub du serveur ne voit que ce dépôt. Le jeton Cloudflare ne vit
  que dans les secrets GitHub : le serveur n'en a pas besoin.
- Les commandes des tickets ne viennent que des logins listés. Le texte d'un
  ticket ou d'un commentaire n'est jamais passé à `claude -p` comme consigne :
  seuls les sujets de la récolte, choisis par numéro, et les adresses ajoutées
  à la main le sont, comme données.
- `claude -p` tourne sans outils, lit la consigne sur son entrée, et n'a accès
  à aucun fichier.
- Les règles de `SOURCES.md` s'appliquent aux vagues automatiques comme aux
  autres : Inria et ANITI n'envoient que leur titre, rien d'AlphaSignal n'est
  lu par un programme.

## Essais

- Les nouvelles fonctions pures ont leurs essais dans `outils/veille/` : le
  choix des sujets, la détection du déjà paru, la lecture des commandes d'un
  ticket, la lecture de la réponse du contrôle.
- Chaque programme du serveur a une option `--a-blanc` qui fait tout sauf
  écrire sur GitHub, et affiche ce qu'il aurait fait.
- Les actions GitHub s'essaient d'abord sur une demande de fusion d'essai,
  avant toute fusion dans `main`.

## Mise en route, par étapes

Chaque étape se valide avant la suivante, et chacune s'arrête sans défaire les
autres.

1. Les deux actions GitHub et le jeton Cloudflare. Critère : une demande de
   fusion reçoit son aperçu, et un changement de numéro fusionné se met en
   ligne seul.
2. Le compte `veille` et les vagues manuelles. Critère : une vague complète,
   du ticket à la mise en ligne, sans terminal.
3. Les vagues automatiques en mode `essai` pendant une semaine. Critère : les
   curateurs jugent les demandes de fusion ouvertes, et le contrôle n'a laissé
   passer aucune affirmation fausse.
4. Passage en mode `reel`, sur décision explicite des curateurs, en changeant
   une ligne de `reglages.json`.

## Ce qui reste à décider

- **Le déploiement automatique depuis `main`** touche tout le monde : il met en
  ligne tout `main` quand la veille change. Il faut l'accord des autres
  membres de l'équipe avant l'étape 1.
- Qui garde les deux jetons, et où c'est écrit.
- Les jours et heures : ceux de l'exemple sont des valeurs de départ, à
  changer dans `reglages.json`.
- Une entrée dans le registre des décisions, `docs/CTO_PROJET.md` de l'ancien
  dépôt, une fois l'étape 4 atteinte, pas avant.
