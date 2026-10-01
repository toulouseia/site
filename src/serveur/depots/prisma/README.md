# Le dépôt qui n'existe pas encore

Ce dossier est vide, et c'est le bon état. Il est la place réservée de
l'implémentation qui lira une vraie base de données, en face de
`depots/demo/`, qui lit des tableaux en mémoire.

Il est documenté maintenant plutôt que plus tard pour une raison précise : la
question « comment on branche la base ? » doit avoir une réponse écrite le jour
où quelqu'un la pose, pas une réponse à retrouver dans le code.

## Ce qu'il y aura ici

Un fichier par port de `serveur/ports.ts` :

```
depots/prisma/
  client.ts       le PrismaClient, avec la parade au rechargement à chaud
  catalogue.ts    implémente DepotCatalogue
  progression.ts  implémente DepotProgression
  comptes.ts      implémente DepotComptes
```

Les dépôts `projets`, `ressources`, `veille` et `outils` suivront quand leurs
écrans respectifs quitteront la maquette. Rien n'oblige à tout basculer en même
temps : `contexte.ts` compose dépôt par dépôt.

## La bascule, en une ligne

`serveur/contexte.ts` est le seul fichier à modifier :

```ts
depots ??= {
  catalogue: process.env.DATABASE_URL ? cataloguePrisma : catalogueDemo,
  progression: process.env.DATABASE_URL ? progressionPrisma : progressionDemo,
  // …
};
```

Aucun composant, aucune page, aucun service ne bouge. C'est la propriété pour
laquelle toute cette indirection existe ; si elle n'est pas vraie, c'est qu'un
raccourci a été pris quelque part et il faut le retrouver.

## Ce qu'il ne faut pas faire

**Ne pas exposer Prisma au-delà de ce dossier.** Un `import { prisma }` dans un
service ou dans une page annule tout. Les types de Prisma ne doivent pas non
plus remonter : un dépôt renvoie les types du **domaine**, il fait la
traduction lui-même. Sans quoi le domaine finit par ressembler au schéma de la
base, et c'est l'inverse qu'on veut.

**Ne pas y mettre de décision de droits.** Le dépôt rend tout ce qu'on lui
demande ; c'est le service qui filtre selon `peut(visiteur, …)`. Un dépôt qui
décide des droits ne se teste plus et ne se réutilise plus.

**Ne pas dénormaliser l'avancement.** L'avancement d'un cours se calcule depuis
ses leçons, à chaque fois (`domaine/progression.ts`). Un pourcentage stocké qui
dérive de sa source est la première dette d'une plateforme d'apprentissage, et
elle ne se rembourse jamais. Si le calcul devient trop lent (ce qui demande
des dizaines de milliers de lignes de progression, donc des centaines
d'étudiants), la réponse est un index sur `(visiteurId, leconId)`, puis une
vue matérialisée, dans cet ordre.

## Ce à quoi le schéma ressemblera

Une transcription directe de `domaine/academy.ts` et `domaine/progression.ts` :

```prisma
model Parcours { id String @id  slug String @unique  rang Int  statut Statut  cours Cours[] }
model Cours    { id String @id  slug String @unique  parcoursId String  rang Int  statut Statut
                 chapitres Chapitre[]  lecons Lecon[]  @@index([parcoursId, rang]) }
model Chapitre { id String @id  coursId String  rang Int  lecons Lecon[]  @@index([coursId, rang]) }
model Lecon    { id String @id  slug String  coursId String  chapitreId String  rang Int
                 statut Statut  minutes Int  blocs Json
                 @@unique([coursId, slug])  @@index([chapitreId, rang]) }

model MarqueLecon { visiteurId String  leconId String  etat EtatLecon  vue DateTime
                    @@id([visiteurId, leconId])  @@index([visiteurId, vue]) }
model Inscription { visiteurId String  coursId String  debut DateTime
                    dernierePositionId String?  fin DateTime?
                    @@id([visiteurId, coursId]) }
```

**Les blocs en `Json`, pas en tables.** Ils sont toujours lus ensemble, jamais
requêtés individuellement, et leur forme change à chaque nouveau type de bloc.
Une table par type de bloc imposerait une migration à chaque évolution du
contenu pour un bénéfice nul. La validation reste du côté TypeScript, à la
lecture : c'est déjà le patron du manifeste d'animations.

Une contrainte tient tout le reste : **`@@unique([coursId, slug])` sur les
leçons**. C'est ce qui rend l'adresse `/apprendre/cours/:cours/:lecon` stable et
non ambiguë.

## Le piège du client Prisma en développement

`next dev` recharge les modules à chaud ; sans garde, chaque rechargement ouvre
un nouveau pool de connexions et Postgres finit par les refuser. La parade est
connue et tient en cinq lignes, à mettre dans `client.ts` :

```ts
const global = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
```
