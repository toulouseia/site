# Les animations de l'AI Academy

Les figures animées des cours de maths sont faites avec **Manim**, la
bibliothèque issue du travail de 3Blue1Brown. Ce dossier contient les scènes,
le pipeline de rendu, et le contrat qui les relie à l'application.

**Pour travailler sur les écrans, vous n'avez besoin de rien de ce qui suit.**
L'application fonctionne sans qu'aucune animation ne soit rendue : elle affiche
alors un cadre qui dit ce que la figure montrera et d'où elle sortira. C'est
l'état normal, pas une panne.

---

## Le principe

Manim est du Python. Il ne peut pas tourner dans une requête web, et il n'a pas
à le faire. La frontière est un **fichier** :

```
  animations/scenes/**/*.py         les scènes, en Python
        │  chacune déclare ANIMATIONS = [{id, scene, titre, alt, duree, notions}]
        │
        ├──► animations/manifeste.py      lit les déclarations par l'arbre
        │        │                        syntaxique, SANS importer Manim
        │        │                        → public/animations/manifeste.json
        │        │
        └──► animations/rendre.py         rend, réduit, réencode, sonde
                 │                        → public/animations/<id>/<empreinte>.mp4
                 │                        → public/animations/<id>/rendu.json
                 └──► manifeste.py relit les rendu.json
                          → public/animations/manifeste.json
                             { version, genere, animations[], prevues[] }

  ──────────────────────────── la frontière ────────────────────────────

  src/serveur/domaine/animations.ts       LE CONTRAT, en TypeScript
  src/serveur/depots/demo/animations.ts   lit le fichier, le valide, le garde
  src/composants/academy/blocs/Animation.tsx   le lecteur
```

**L'application ne sait pas ce qu'est Manim.** Elle sait lire ce manifeste. Le
jour où une figure est refaite autrement (une démonstration interactive, une
vidéo filmée), seul le producteur du manifeste change.

---

## Les deux scripts

### `manifeste.py` : il n'a besoin de rien

Python 3.11 et la bibliothèque standard. Ni Manim, ni LaTeX, ni ffmpeg.

```bash
python animations/manifeste.py             écrit le manifeste
python animations/manifeste.py --verifier  n'écrit rien, échoue si une
                                           déclaration est invalide
```

Il lit les listes `ANIMATIONS` des fichiers de scènes **par l'arbre syntaxique**,
sans les importer : importer demanderait Manim. Une scène déclarée mais pas
rendue apparaît dans `prevues` ; une scène rendue apparaît dans `animations`.

Le mode `--verifier` tourne dans `npm run verifier`. Il refuse notamment une
description alternative de moins de 120 caractères : ce champ n'est pas une
étiquette, c'est ce que la figure montre, dit en phrases, pour qui n'a pas
l'image.

### `rendre.py` : il a besoin de tout

```bash
python animations/rendre.py                       ce qui a changé
python animations/rendre.py descente-gradient-2d  une seule
python animations/rendre.py --tout                même l'inchangé
python animations/rendre.py --profil rapide       pour itérer
```

---

## Installer la pile de rendu

```bash
python -m venv animations/.venv
animations/.venv/Scripts/activate      # Windows
source animations/.venv/bin/activate   # macOS, Linux
pip install -r animations/requirements.txt
```

Depuis **ManimCE 0.21.0**, `pip` suffit pour Manim lui-même : PyAV embarque ses
propres bibliothèques ffmpeg, `pycairo` et `manimpango` publient des roues
binaires. Il reste **trois choses hors pip** :

**1. Les exécutables `ffmpeg` et `ffprobe`.** `rendre.py` les appelle pour
réduire, réencoder et sonder. Les bibliothèques embarquées par PyAV ne
fournissent pas ces commandes.

```
winget install Gyan.FFmpeg          # Windows
brew install ffmpeg                 # macOS
sudo apt install ffmpeg             # Debian, Ubuntu
```

**2. Une distribution LaTeX.** Nos scènes utilisent `MathTex`, qui compile du
LaTeX. Sur Debian ou Ubuntu, le minimum utile :

```
sudo apt install texlive-latex-base texlive-latex-extra \
                 texlive-fonts-extra texlive-science \
                 texlive-fonts-recommended dvisvgm
```

Sur Windows, MiKTeX suffit et installe les paquets à la demande.

> **Pourquoi LaTeX et pas Typst**, alors que Manim 0.21 propose `MathTypst` et
> qu'il s'installe par pip. Parce que Typst n'accepte pas la syntaxe LaTeX :
> `\frac{a}{b}` s'y écrit `frac(a, b)`. Or l'application rend déjà les formules
> de ses leçons avec KaTeX, qui parle LaTeX. Adopter Typst obligerait chaque
> rédacteur à écrire `\sigma^2` dans un bloc `formule` et `sigma^2` dans la
> scène du même chapitre. Cette taxe serait permanente ; l'installation de TeX
> est ponctuelle. On rouvrira la question si l'installation de TeX devient le
> premier obstacle cité par un nouveau contributeur.

**3. La police Archivo.** Elle doit être installée sur la machine qui rend.
Le fichier est déjà dans le dépôt : `src/fonts/Archivo.ttf`. Sans elle, Manim
retombe **silencieusement** sur une police système et le rendu ne ressemble
plus à l'application. `rendre.py` le vérifie et refuse de rendre.

---

## L'empreinte, et ce qu'elle garantit

Chaque rendu porte une empreinte de douze caractères, calculée sur ses
**entrées** :

```
empreinte = sha256(
    le fichier de la scène
  + scenes/n7ia.py            (le style, partagé)
  + src/fonts/Archivo.ttf     (la police)
  + versions de manim, av, numpy
  + le profil de rendu et la recette d'encodage
)[:12]
```

Elle sert deux fois :

- **comme clé de cache** : un rendu dont l'empreinte n'a pas bougé n'est pas
  refait, ce qui compte quand une scène prend plusieurs minutes ;
- **comme segment d'URL** : `/animations/<id>/<empreinte>.mp4`. Un contenu
  différent a donc forcément une URL différente, ce qui permet de servir les
  fichiers en cache immuable. `next.config.ts` le fait. **Aucune purge de cache,
  jamais.**

Jamais sur la sortie : un mp4 n'est pas reproductible à l'octet, le muxeur y
réinjecte des étiquettes. Le checksum du fichier sert à l'intégrité, pas à la
décision.

### Le déterminisme, et ce qui le casse

`rendre.py` fixe `PYTHONHASHSEED=0`, `SOURCE_DATE_EPOCH=0` et
`FORCE_SOURCE_DATE=1` : sans quoi LaTeX écrit l'heure dans le PDF
intermédiaire. Il passe aussi `--disable_caching` systématiquement : le cache
interne de Manim excluait `pixel_array` de sa clé jusqu'en 0.20.1 incluse et
pouvait servir un rendu périmé. Il ne nous sert à rien, notre empreinte fait le
travail.

**Si deux contributeurs obtiennent des empreintes différentes sur une scène que
personne n'a touchée**, la cause la plus probable est la police manquante, la
seconde une version de Manim non épinglée.

---

## Le contrat de données

Il vit dans `src/serveur/domaine/animations.ts`, en TypeScript, et il est la
référence. Ce qui suit en est la moitié côté pipeline : le fichier
`public/animations/<id>/rendu.json` que `rendre.py` dépose.

```json
{
  "empreinte": "9f2c41ab7d03",
  "duree": 34.0,
  "largeur": 1920,
  "hauteur": 1080,
  "cadence": 30,
  "poster": "/animations/descente-gradient-2d/9f2c41ab7d03.webp",
  "rendus": [
    {
      "format": "mp4",
      "src": "/animations/descente-gradient-2d/9f2c41ab7d03.mp4",
      "octets": 2418655,
      "mime": "video/mp4; codecs=\"avc1.640028\""
    }
  ],
  "profil": {
    "rendu": "3840x2160",
    "encodage": "x264-crf18-tune-animation-v1"
  },
  "source": { "manim": "0.21.0", "rendu": "2026-08-22T09:14:03+00:00" }
}
```

`titre`, `alt`, `notions` et `licence` viennent de la **déclaration Python**,
jamais du sidecar : la prose se relit en revue, elle n'est pas un sous-produit
d'un rendu.

**Deux champs méritent leur explication.**

`mime` est l'attribut `type` **complet** de la balise source, pas le nom du
codec. Un navigateur qui ne reconnaît pas une chaîne de codecs *ignore la
source entière, sans erreur ni message*. Écrire `h264` au lieu de
`avc1.640028` casse la lecture pour tout le monde en silence. `rendre.py` la
calcule depuis `ffprobe` et, en cas de doute, écrit `video/mp4` sans paramètre :
une source sans `codecs` est lue, une source avec un `codecs` faux ne l'est
pas.

`src` est un chemin **lu**, jamais reconstruit par convention dans un
composant. C'est ce qui rendra indolore le passage vers un stockage objet :
`rendre.py` compose ce chemin depuis la variable d'environnement
`BASE_ANIMATIONS` (par défaut `/animations`), et seul le pipeline changera.

---

## La recette d'encodage

Manim encode par défaut en `libx264`, CRF 23, `yuv420p`. **Ce fichier n'est pas
un master** : c'est déjà un compressé, avec des réglages qui ne sont pas les
nôtres. Le pipeline rend donc plus grand, puis réduit et réencode.

```
manim render --disable_caching --resolution 3840,2160 --fps 30 --format mp4
ffmpeg -i <brut> -vf scale=1920:1080:flags=lanczos \
       -c:v libx264 -preset slow -crf 18 -tune animation -g 30 \
       -pix_fmt yuv420p -movflags +faststart -map_metadata -1 -an <sortie>
```

- **rendre en 4K puis réduire** donne un lissage que le rendu direct en 1080p
  ne donne pas ; cela se voit sur les indices d'une formule ;
- `-tune animation` est fait pour les aplats et les traits nets ;
- `-g 30`, soit une image-clé par seconde, rend honnête le pas image par image
  du lecteur, sans lui, la flèche « image suivante » saute entre images-clés ;
- `yuv420p` est la seule combinaison que Safari accepte sans discuter ;
- `+faststart` permet de commencer à lire avant la fin du téléchargement.

Le profil `--profil rapide` rend directement en 1080p : il sert à itérer sur
une scène, pas à publier.

**Les clips sont muets, et c'est une décision d'architecture, pas une
préférence.** Un clip sans piste audio relève de WCAG 1.2.1 : une description
textuelle suffit, et nous l'avons : c'est le champ `alt`, obligatoire, vérifié.
Ajouter une voix off ferait basculer tout le corpus sous 1.2.2, 1.2.3 et 1.2.5,
c'est-à-dire sous-titres **et** audiodescription réelle, pour chaque animation,
pour toujours.

---

## Écrire une scène

1. Créer le fichier sous `animations/scenes/<domaine>/<sujet>.py`.
2. Importer le style : `from scenes.n7ia import SceneN7, ENCRE, BRIQUE, …`.
   Fond papier, traits à l'encre, cotes en brique. Une animation qui garderait
   la palette Manim par défaut se verrait immédiatement comme un corps étranger
   dans une leçon.
3. Déclarer `ANIMATIONS = [{...}]` **au niveau du module**, en valeurs
   littérales : `manifeste.py` la lit sans exécuter le fichier.
4. Écrire un `alt` qui décrit ce qu'on voit, en phrases. C'est le champ le plus
   important du fichier : il est lu par les lecteurs d'écran, affiché quand le
   rendu manque, et servira de base au sous-titrage.
5. Poser des `next_section("…")` aux moments qui comptent, le lecteur les
   affiche comme chapitres cliquables. Trois lignes maintenant, une réécriture
   complète dans six mois.
6. `python animations/manifeste.py` : la scène apparaît en « prévue » et
   l'application l'affiche déjà.
7. `python animations/rendre.py <id>` quand la pile est installée.

---

## Où tournent les rendus, et jusqu'à quand

**Aujourd'hui : sur la machine d'un contributeur.** Les fichiers sont commités
dans `public/animations/`. C'est la solution la plus simple qui marche, et elle
marche jusqu'à un seuil qu'il faut écrire pour ne pas le dépasser sans s'en
apercevoir :

| Passer à… | Quand |
|---|---|
| GitHub Actions pour le rendu | un rebuild complet dépasse 15 min, ou plus de deux personnes rendent la même semaine |
| un stockage objet (Cloudflare R2) | `public/animations/` dépasse **150 Mo**, ou le temps de build Coolify double |

Pas de Git LFS : la bande passante y est facturée au propriétaire du dépôt à
chaque clone, y compris depuis un fork et depuis un runner de CI, et le mode de
panne est le refus des `push` : une panne de vélocité d'équipe déclenchée par
une cause étrangère au code.

**Jamais de rendu à la demande.** Exécuter du Python fourni par un utilisateur
est une exécution de code arbitraire par conception, `\write18` fait de LaTeX un
exécuteur de commandes, le pic mémoire d'un rendu 4K se compte en gigaoctets, et
la VM du club héberge déjà autre chose. Si un jour une figure doit être
paramétrable par l'étudiant, la réponse est une **grille pré-calculée** : rendre
N valeurs discrètes hors ligne et faire glisser un curseur côté client. Latence
nulle, zéro serveur, zéro surface d'attaque.

---

## Manim ou pas Manim

| Le concept… | La forme |
|---|---|
| se déroule dans le temps, l'auteur choisit l'ordre | **animation Manim** : gradient qui descend, transformation linéaire, convergence |
| est une relation entre un réglage et un résultat | **démonstration interactive** : le pas d'apprentissage, la taille d'échantillon, un seuil |
| est une forme dans des données | **bloc graphique** : courbe de perte, distribution, série temporelle |
| est une égalité | **bloc formule** : KaTeX, rendu sur le serveur, zéro JavaScript |

La règle en une phrase : **on ne peut pas « regarder » l'effet d'un
paramètre, il faut l'essayer ; et on ne peut pas « essayer » un raisonnement,
il faut le suivre.**

---

## Mesures

Rien n'a encore été rendu sur une machine du club. Quand ce sera fait, écrire
ici les chiffres : machine, version de Manim, profil, durée de la scène, temps
de rendu, pic mémoire, taille du fichier.

| Scène | Machine | Profil | Durée | Rendu | Fichier |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

Protocole : version épinglée, `--disable_caching`, trois passes, garder la
médiane, mesurer le pic mémoire du processus. Ne pas extrapoler d'une machine à
une autre : jusqu'en 0.20.1 le rendu est essentiellement sériel, et 0.21.0 a
introduit `--max-inflight-encoders`, qui change le profil de charge.
