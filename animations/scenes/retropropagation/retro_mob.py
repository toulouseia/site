"""
Le chapitre 4, sur le réseau du chapitre 2 et sur les nombres du chapitre 4.

CE FICHIER EST LA DÉPENDANCE DES HUIT SCÈNES DE LA RÉTROPROPAGATION. Aucune
d'elles ne redessine un réseau, aucune n'écrit un nombre à la main.

DEUX FICHIERS SONT GELÉS, ET VOICI CE QU'ILS APPORTENT :

    scenes/reseau_mob.py   la GÉOMÉTRIE — quatre colonnes, les faisceaux, la
                           grille 28 × 28, l'abréviation cotée, l'effacement au
                           décor. Le chapitre 4 montre le même réseau que le
                           chapitre 2, aux mêmes abscisses, aux mêmes rayons.
    scenes/n7ia.py         le STYLE — fond papier, encre, brique, la marge d'une
                           demi-unité, la taille plancher.

Ni l'un ni l'autre n'est touché. Tout ce que le chapitre 4 ajoute est ici.

LES POIDS NE SONT PAS CEUX DU CHAPITRE 2, ET C'EST LA SEULE DIVERGENCE. Le
chapitre 2 montre quatre modèles ENTRAÎNÉS, lus dans `cours/.donnees/
l2-modeles.npz`. Le chapitre 4 travaille sur un réseau NON ENTRAÎNÉ : c'est son
sujet même — ce que la rétropropagation demande au tout premier pas, avant que
quoi que ce soit ait bougé. Ses poids sont ceux que `cours/lecon4/mesures.py`
tire à la graine 0, et `RetroScene.setup` remplace pour cela le chargement du
npz que fait `ReseauScene.setup`. Le DESSIN reste celui du chapitre 2 ; seules
les valeurs qui le remplissent changent.

AUCUN NOMBRE N'EST RECALCULÉ ICI. `mesures_du_chapitre()` appelle les fonctions
de `cours/lecon4/mesures.py` — `init`, `avant`, `arriere` — et rend ce qu'elles
rendent. Une scène qui a besoin d'une valeur la lit dans ce dictionnaire, et le
commentaire au-dessus cite la ligne de `mesures.py` qui l'imprime. Une valeur
recopiée dans une scène serait vraie le jour où on l'écrit et fausse le jour où
le protocole change, sans que rien ne le signale.

CE QUE LA RÈGLE DU CHAPITRE INTERDIT, et qui explique les absences :

    aucune boîte       `ReseauScene.propagation` termine par un
                       `SurroundingRectangle` autour du neurone gagnant. On ne
                       l'appelle donc pas : `traversee()` fait le même geste et
                       désigne le gagnant en remontant SON trait à la brique.
    aucun compteur     aucun `DecimalNumber` qui défile. Une valeur se pose,
                       elle ne s'égrène pas.
    aucune phrase      une étiquette porte un symbole, un nombre, deux mots. Ce
                       qui demande une phrase va dans la légende de la page.
    aucune métaphore   on montre l'objet — le réseau, le vecteur — jamais une
                       image de l'objet.

UN VECTEUR SE MONTRE PAR SES COMPOSANTES. `Barres` est l'objet qui le fait, et
quatre scènes sur huit l'emploient. Une flèche dans un plan dirait qu'un vecteur
de dix ou de cent vingt-huit nombres a une direction qu'on peut voir ; il n'en a
pas. Une barre par composante, à l'échelle, signée : c'est tout ce qu'on peut
montrer honnêtement, et c'est ce que le chapitre a besoin de montrer.
"""

from __future__ import annotations

import sys
from functools import lru_cache
from pathlib import Path

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    UP,
    Circle,
    Line,
    Rectangle,
    Text,
    Transform,
    VGroup,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_55,
    ENCRE_75,
    GRIS_40,
    GRIS_58,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
)
from scenes.reseau_mob import (
    OPACITE_DECOR_ROND,
    OPACITE_DECOR_TRAIT,
    OPACITE_EVIDENCE,
    ReseauScene,
)

# ── Les nombres, tels que `cours/lecon4/mesures.py` les produit ─────────────

_APPLICATION = Path(__file__).resolve().parents[3]
_COURS = _APPLICATION / "cours"

#: La taille de toute étiquette du chapitre. La règle 25 refuse un texte de
#: plusieurs mots sous 24 : à 20, la fonte système arrondit la chasse de
#: l'espace vers le bas et les mots se collent. On ne descend jamais dessous,
#: y compris pour une cote d'un seul nombre — le chapitre est composé d'une
#: seule taille, et c'est ce qui le rend lisible en vignette.
CORPS = 24

#: La même taille, pour du LaTeX. `MathTex` et `Text` ne comptent pas leur
#: `font_size` de la même façon : à 24, la hampe du « b » de `MathTex` mesure
#: 0,1756 unité contre 0,2605 pour celle de `Text` — 67 % seulement. Un nom de
#: paramètre composé à 24 en LaTeX est donc sous le plancher de la règle 25,
#: et il s'y voit : sur la première trame rendue de la page 4, « b₂^[2] »
#: faisait la moitié de la cote « +0,3000 » posée juste au-dessus.
#:
#: LE CRIBLE NE PEUT PAS LE VOIR : il ne compare à `TAILLE_LISIBLE` que les
#: textes qui contiennent une espace, et un nom de paramètre n'en a pas. C'est
#: un des cas que les règles annoncent comme relevant du contrôle visuel.
#:
#: 24 × 0,2605 / 0,1756 = 35,6, arrondi au-dessus. Mesuré à 36 : 0,2634 contre
#: 0,2605, soit un écart d'un centième de millimètre à l'écran.
CORPS_MATH = 36

#: Les rangs des quatre neurones cachés dont la mesure 3 imprime le tableau :
#: les trois plus activés, et le moins activé de ceux qui sont allumés. Le
#: critère est dans `mesures.mesure_3` ; les rangs, eux, sont RECALCULÉS par
#: `mesures_du_chapitre()`, jamais recopiés.
#: (mesure 3, `mesures.py:298-300`)

#: Le neurone de sortie dont le chapitre parle : celui de la vraie classe.
CLASSE = 2


def _mesures():
    """Le module `cours/lecon4/mesures.py`, importé sans rien installer.

    Il met lui-même `cours/` sur le chemin pour trouver `donnees`, on n'a donc
    qu'à lui ouvrir son propre répertoire.
    """
    lecon4 = _COURS / "lecon4"
    if str(lecon4) not in sys.path:
        sys.path.insert(0, str(lecon4))
    import mesures  # type: ignore[import-not-found]

    return mesures


@lru_cache(maxsize=1)
def mesures_du_chapitre() -> dict:
    """
    Tout ce que les huit scènes lisent, calculé une fois par `mesures.py`.

    LE JEU CHARGÉ EST CELUI D'ENTRAÎNEMENT, et c'est celui de la mesure 1 :
    l'exemple de travail est la PREMIÈRE image de classe 2 du jeu
    d'entraînement. `ReseauScene.setup` charge, lui, des images de test — on ne
    s'en sert pas ici, sans quoi la grille montrerait une autre image que celle
    dont sortent les nombres.

    ON N'EN CHARGE QUE SOIXANTE-QUATRE. Le critère de la mesure 1 est un
    `argmax` sur les étiquettes ; il tombe sur le rang 5, et soixante-quatre
    lignes suffisent donc à le retrouver. Charger les soixante mille coûterait
    trois cent soixante-seize mégaoctets à chaque rendu, pour une image.
    L'assertion ci-dessous garantit que l'économie ne change pas le résultat :
    si aucune image de classe 2 n'apparaissait dans les soixante-quatre
    premières, elle échouerait au lieu de désigner l'image 0.
    """
    mesures = _mesures()
    donnees = sys.modules["donnees"]

    X, c, _, _ = donnees.charger(n_train=64, n_test=1)
    rangs_temoins = np.flatnonzero(c == mesures.CLASSE_TEMOIN)
    if rangs_temoins.size == 0:  # pragma: no cover — protège l'économie ci-dessus
        raise RuntimeError(
            "aucune image de classe 2 dans les 64 premières du jeu "
            "d'entraînement : le critère de la mesure 1 ne peut plus être "
            "retrouvé sur un extrait, il faut charger le jeu entier."
        )
    n = int(rangs_temoins[0])

    theta = mesures.init()
    x = X[n]
    classe = int(c[n])
    cache = mesures.avant(theta, x)
    grads = mesures.arriere(theta, cache, classe)

    a1, z1 = cache["a1"], cache["z1"]
    actifs = np.flatnonzero(a1 > 0)
    ordre = actifs[np.argsort(-a1[actifs])]

    return {
        "mesures": mesures,
        "n": n,
        "x": x,
        "classe": classe,
        "theta": theta,
        "cache": cache,
        "grads": grads,
        # mesure 1 : la sortie, le signal d'erreur, la perte
        "a2": cache["a2"],
        "delta2": grads["delta2"],
        "perte": mesures.perte(cache["a2"], classe),
        "hasard": float(np.log(10.0)),
        # mesure 1 : la couche cachée
        "allumes": int((z1 > 0).sum()),
        "eteints": int((z1 <= 0).sum()),
        "pixels_encres": int((x > 0).sum()),
        # mesure 3 : les quatre neurones cachés du tableau
        "quatre": [int(ordre[0]), int(ordre[1]), int(ordre[2]), int(ordre[-1])],
        "eteint": int(np.flatnonzero(z1 <= 0)[0]),
        # mesure 8 : les zéros de la première couche
        "grad_W1_nuls": int((grads["W1"] == 0.0).sum()),
        "grad_W1_marques": int((grads["W1"] != 0.0).sum()),
    }


@lru_cache(maxsize=1)
def un_seul_exemple(pas: int = 200, eta: float = 0.5, combien: int = 10000) -> dict:
    """
    La mesure 4, rejouée : `pas` descentes sur la seule image de travail.

    C'est la seule mesure du chapitre qui entraîne quoi que ce soit, et le seul
    endroit où le jeu de test est chargé. La boucle est celle de
    `mesures.mesure_4` (`mesures.py:365-374`) : mêmes pas, même pas
    d'apprentissage, même point de départ.
    """
    m = mesures_du_chapitre()
    mesures = m["mesures"]
    donnees = sys.modules["donnees"]

    _, _, Xte, cte = donnees.charger(n_train=1, n_test=combien)
    x, classe = m["x"], m["classe"]

    def predire(theta: dict) -> np.ndarray:
        Z1 = Xte @ theta["W1"].T + theta["b1"]
        Z2 = np.maximum(Z1, 0.0) @ theta["W2"].T + theta["b2"]
        return Z2.argmax(axis=1)

    theta = mesures.init()
    avant_les_pas = predire(theta)
    for _ in range(pas):
        gradients = mesures.arriere(theta, mesures.avant(theta, x), classe)
        for cle in ("W1", "b1", "W2", "b2"):
            theta[cle] -= eta * gradients[cle]
    apres_les_pas = predire(theta)

    return {
        "Xte": Xte,
        "cte": cte,
        "avant": avant_les_pas,
        "apres": apres_les_pas,
        "a2": mesures.avant(theta, x)["a2"],
        "exactitude_avant": float(np.mean(avant_les_pas == cte)),
        "exactitude_apres": float(np.mean(apres_les_pas == cte)),
        "frequence": float(np.mean(cte == m["classe"])),
        "tous_en_classe": int((apres_les_pas == m["classe"]).sum()),
        "combien": int(cte.size),
        "pas": pas,
    }


def nombre(valeur: float, decimales: int = 4) -> str:
    """
    Un nombre composé comme le cours l'écrit : virgule décimale, et le vrai
    signe moins.

    Le crible refuse `-0` : le trait d'union n'est pas un signe moins, et la
    différence se voit — il est plus court et posé plus bas. C'est la règle 24.
    """
    texte = f"{valeur:.{decimales}f}".replace(".", ",")
    return texte.replace("-", "−")


def signe(valeur: float, decimales: int = 4) -> str:
    """Le même nombre, avec son signe toujours écrit. Un + qui manque se lit
    comme une valeur absolue."""
    texte = nombre(abs(valeur), decimales)
    return ("−" if valeur < 0 else "+") + texte


# ── Un vecteur, montré par ses composantes ─────────────────────────────────


class Barres(VGroup):
    """
    Un vecteur : une barre par composante, signée, sur une ligne de zéro.

    POURQUOI PAS UNE FLÈCHE. Une flèche dans un plan donne une direction qu'on
    peut voir, et un vecteur de dix — ou de cent vingt-huit — composantes n'en a
    pas. Elle donne aussi une longueur unique là où le chapitre a besoin de
    comparer une composante aux neuf autres. Les barres, elles, se comparent :
    c'est tout l'argument de la proposition 2.

    L'ÉCHELLE EST COMMUNE ET MESURÉE. `echelle` est la valeur qui atteint la
    demi-hauteur ; par défaut le plus grand module du vecteur. Deux groupes de
    barres qui doivent se comparer — avant et après la porte ReLU — reçoivent la
    MÊME échelle, sans quoi la comparaison ne veut rien dire : c'est la seule
    façon de montrer que les barres qui passent ne sont pas raccourcies.

    UNE BARRE N'EST JAMAIS PLUS ÉTROITE QUE SON JEU. Cent vingt-huit barres sur
    dix unités donnent 0,078 unité de pas ; on en laisse un cinquième de vide
    entre deux, et la barre fait 0,0625 unité, soit 8,4 px à 1080p. Sous ce
    seuil on ne verrait plus une barre mais un peigne.
    """

    def __init__(self, valeurs, largeur: float = 10.0, hauteur: float = 2.6,
                 echelle: float | None = None, couleur: str = ENCRE,
                 jeu: float = 0.2, **kwargs) -> None:
        super().__init__(**kwargs)
        valeurs = np.asarray(valeurs, dtype=float)
        haut = float(echelle if echelle is not None else np.abs(valeurs).max())
        self.echelle = haut if haut > 0 else 1.0
        self.valeurs = valeurs

        pas = largeur / max(1, valeurs.size)
        epaisseur = pas * (1.0 - jeu)
        self.unite = hauteur / self.echelle

        ligne = Line(
            [-largeur / 2, 0, 0],
            [largeur / 2, 0, 0],
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
        )

        barres = VGroup()
        for rang, valeur in enumerate(valeurs):
            longueur = abs(float(valeur)) * self.unite
            barre = Rectangle(
                width=epaisseur,
                height=max(longueur, 1e-4),
                stroke_width=0.0,
            )
            barre.set_fill(couleur, opacity=1.0)
            x = -largeur / 2 + (rang + 0.5) * pas
            # Le rectangle est posé PAR SON BORD, jamais par son centre : une
            # composante nulle doit avoir une hauteur nulle et rester sur la
            # ligne, et un `move_to` la centrerait dessus, ce qui la ferait
            # dépasser des deux côtés de la moitié de son épaisseur minimale.
            bord = UP if valeur >= 0 else DOWN
            barre.move_to([x, 0, 0], aligned_edge=-bord)
            barres.add(barre)

        self.ligne = ligne
        self.barres = barres
        self.add(ligne, barres)

    def a_zero(self) -> VGroup:
        """Les mêmes barres, écrasées sur la ligne. Pour `Transform` : les
        barres poussent depuis zéro au lieu d'apparaître à leur taille."""
        copie = self.barres.copy()
        for barre, valeur in zip(copie, self.valeurs):
            bord = UP if valeur >= 0 else DOWN
            ancre = barre.get_edge_center(-bord)
            barre.stretch_to_fit_height(1e-4)
            barre.move_to(ancre, aligned_edge=-bord)
        return copie

    def coupees(self, garde) -> VGroup:
        """
        Les mêmes barres, celles que `garde` ne retient pas écrasées à zéro.

        C'est la porte ReLU, et c'est un `Transform` plutôt qu'un `FadeOut` :
        une barre qui disparaît laisse croire qu'elle est partie ailleurs, une
        barre qui s'écrase montre qu'elle a été annulée sur place. Les barres
        gardées ne bougent pas D'UN PIXEL — c'est ce que la scène doit établir.
        """
        masque = np.asarray(garde, dtype=bool)
        copie = self.barres.copy()
        for barre, valeur, passe in zip(copie, self.valeurs, masque):
            if passe:
                continue
            bord = UP if valeur >= 0 else DOWN
            ancre = barre.get_edge_center(-bord)
            barre.stretch_to_fit_height(1e-4)
            barre.move_to(ancre, aligned_edge=-bord)
        return copie

    def teindre(self, rangs, couleur: str = BRIQUE) -> VGroup:
        """Les mêmes barres, celles de `rangs` passées à la brique."""
        copie = self.barres.copy()
        for rang in rangs:
            copie[int(rang)].set_fill(couleur, opacity=1.0)
        return copie

    def sommet(self, rang: int):
        """Le bout libre de la barre `rang` : là où se pose sa cote."""
        barre = self.barres[int(rang)]
        return barre.get_top() if self.valeurs[rang] >= 0 else barre.get_bottom()

    def sens(self, rang: int):
        """Le sens dans lequel pointe la barre `rang`, pour poser sa cote au
        bout et non par-dessus."""
        return UP if self.valeurs[rang] >= 0 else DOWN


# ── La scène de base du chapitre ───────────────────────────────────────────


class RetroScene(ReseauScene):
    """
    Le réseau du chapitre 2, rempli par les nombres du chapitre 4.

    Une scène qui hérite d'elle a déjà : le réseau posé, `self.m` — le
    dictionnaire des mesures —, et les gestes ci-dessous. Elle n'a ni réseau ni
    nombre à construire.
    """

    tailles: tuple[int, ...] = (784, 128, 10)
    activation: str = "relu"
    montrer_grille: bool = True

    #: Le bandeau, composé à la taille du corps. Le défaut de `n7ia` est 20
    #: pour ne pas périmer les chapitres déjà rendus ; le chapitre 4 est neuf,
    #: il se met à la règle 25.
    taille_bandeau: int = CORPS

    def setup(self) -> None:
        # On saute `ReseauScene.setup` : il charge les poids ENTRAÎNÉS du
        # chapitre 2 dans `cours/.donnees/l2-modeles.npz`, et les images de
        # TEST. Le chapitre 4 travaille sur le réseau non entraîné de la
        # graine 0 et sur une image d'entraînement. La construction du dessin,
        # elle, est reprise telle quelle.
        SceneN7.setup(self)
        self.m = mesures_du_chapitre()
        self.theta = self.m["theta"]
        self.Xte = self.m["x"].reshape(1, -1)
        self.cte = np.array([self.m["classe"]])
        self.construire_reseau()

    # ── Les étiquettes ──────────────────────────────────────────────────────

    def bandeau(self, texte: str) -> VGroup:
        """Le bandeau de titre, à la taille du corps."""
        return self.poser_titre(texte, taille=self.taille_bandeau)

    def etiquette(self, texte: str, taille: int = CORPS,
                  couleur: str = ENCRE_75) -> Text:
        """Une étiquette : ce qu'on regarde, nommé. Jamais une phrase."""
        return super().etiquette(texte, taille=taille, couleur=couleur)

    def cote(self, texte: str, taille: int = CORPS) -> Text:
        """Une cote : une valeur mesurée, en brique."""
        return super().cote(texte, taille=taille)

    # ── L'image de travail ──────────────────────────────────────────────────

    def poser_image_de_travail(self) -> np.ndarray:
        """
        La grille prend l'image n° 5 du jeu d'entraînement, celle de la mesure 1.

        On ne passe pas par `poser_image(indice)` : il lit `self.Xte`, qui est
        le jeu de TEST chez `ReseauScene`. L'image de travail est une image
        d'entraînement, et c'est elle qui produit tous les nombres du chapitre.
        """
        image = self.m["x"]
        self.grille.become(self._grille(image))
        return image

    # ── Un neurone caché que l'abréviation cache ───────────────────────────

    def extraire_neurone(self, rang: int, position, rayon: float = 0.28) -> Circle:
        """
        Un neurone caché, tiré de sa colonne et posé où on peut le voir.

        POURQUOI ON NE LE POSE PAS À SON ORDONNÉE. `Colonne.y_du_rang` rend
        l'ordonnée qu'occuperait le rang dans une colonne de 128 étalée
        régulièrement, et le module gelé s'en sert pour faire atterrir les
        pixels de l'image. Ce n'est PAS l'ordonnée des ronds montrés : les 48
        ronds de l'abrégé sont resserrés autour du « ⋮ », si bien que le rond
        physiquement posé à `y_du_rang(92)`, soit −1,413, est celui du rang 117.
        Mesuré : l'écart vaut un centième d'unité, et le rond montré fait
        0,035 d'unité de rayon. Poser le neurone 92 là-bas reviendrait donc à
        le dessiner par-dessus le neurone 117.

        La divergence est sans conséquence chez le module gelé — un pixel qui
        arrive à `y_du_rang(k)` s'y efface, il ne reste rien — et elle en a une
        ici, où le rond reste à l'écran. On extrait donc, et on cote : le rond
        porte son rang, et son remplissage est l'activation de CE neurone.

        DEUX RANGS VOISINS NE SE POSENT PAS NON PLUS DANS LA COLONNE. Les rangs
        61 et 62 de la mesure 3 y seraient distants de quatre centièmes
        d'unité. L'extrait est la seule composition qui les montre tous les
        deux.
        """
        m = mesures_du_chapitre()
        a1 = m["cache"]["a1"]
        rond = Circle(radius=rayon, stroke_width=1.4, stroke_color=GRIS_58)
        rond.set_fill(
            ENCRE,
            opacity=min(1.0, float(a1[rang]) / float(np.max(a1))),
        )
        rond.move_to(position)
        return rond

    def allumer_rond(self, rond: Circle, valeur: float, maximum: float) -> Circle:
        """Le même rond, rempli à son activation normalisée. Rend une copie,
        pour `Transform`."""
        cible = rond.copy()
        part = abs(float(valeur)) / (maximum if maximum > 0 else 1.0)
        cible.set_fill(ENCRE, opacity=max(0.0, min(1.0, part)))
        return cible

    # ── Les gestes ─────────────────────────────────────────────────────────

    def traversee(self, duree: float = 7.0) -> dict:
        """
        L'image de travail traverse le réseau, et le gagnant se désigne.

        C'est `ReseauScene.propagation`, moins sa boîte. La version gelée
        termine par un `SurroundingRectangle` autour du rond retenu ; la règle
        du chapitre 4 n'admet aucune boîte, et le gagnant se désigne donc en
        remontant son rond et son étiquette à la brique — ce qui a l'avantage
        de ne rien ajouter au dessin.
        """
        from manim import FadeIn

        image = self.poser_image_de_travail()
        cache = self.m["cache"]

        self.play(FadeIn(self.grille), run_time=0.6)
        self.pixels_vers_couche(image, duree=2.0)
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image)),
            run_time=0.5,
        )

        reste = max(1.2, duree - 3.1)
        par_couche = reste / 2.0
        for rang, cle in enumerate(("a1", "a2"), start=1):
            colonne = self.colonnes[rang]
            self.play(
                self._vague(rang - 1, duree=par_couche),
                Transform(colonne.ronds, colonne.allumer(cache[cle])),
                run_time=par_couche,
            )
        return cache

    def designer_sortie(self, k: int) -> list:
        """
        Le rond de sortie `k` et son étiquette passent à la brique. Rend les
        animations, à passer à `play`.

        AUCUNE BOÎTE : c'est l'objet lui-même qui change, pas un cadre qu'on
        pose autour.

        ET AUCUN `Transform` SUR UN GROUPE IMPROVISÉ. La première version
        emballait le rond et son étiquette dans un `VGroup` neuf pour les
        transformer d'un coup. `Transform` ajoute son mobject à la scène, et
        `Scene.add` commence par retirer ce mobject de partout où il se trouve
        déjà : le rond aurait quitté `sortie.ronds`, et le prochain `allumer()`
        de cette colonne ne l'aurait plus trouvé. `.animate` ne touche pas à
        l'appartenance des mobjects.
        """
        rond = self.sortie.rond_du_rang(k)
        etiquette = self.etiquettes_sortie[k]
        return [
            rond.animate.set_stroke(BRIQUE, width=TRAIT_COTE, opacity=1.0),
            etiquette.animate.set_color(BRIQUE).set_opacity(1.0),
        ]

    def traits_vers_le_rond(self, ronds, arrivee, epaisseur: float = 1.0) -> VGroup:
        """Un trait de chaque rond de `ronds` vers le rond `arrivee`, tous de
        la même finesse. C'est l'état de départ : à cet instant, rien ne
        distingue les liaisons les unes des autres."""
        traits = VGroup()
        for depart in ronds:
            traits.add(
                Line(
                    depart.get_center(),
                    arrivee.get_center(),
                    buff=max(depart.width, arrivee.width) / 2,
                    stroke_width=epaisseur,
                    color=GRIS_40,
                )
            )
        return traits

    def epaissir(self, traits: VGroup, valeurs, maximum: float | None = None,
                 epaisseur_max: float = 14.0,
                 epaisseur_min: float = 0.0) -> VGroup:
        """
        Les mêmes traits, épaissis en proportion de `valeurs`.

        L'ÉPAISSEUR SORT DU NOMBRE, JAMAIS L'INVERSE. La source lit la force
        d'une demande sur l'épaisseur du trait qu'elle a elle-même dessiné ;
        ici le nombre vient de `mesures.py` et l'épaisseur en découle, ce qui
        fait du dessin une conséquence de la mesure et non sa source.

        IL N'Y A PAS DE PLANCHER, et c'est voulu. Le rapport des activations
        extrêmes vaut 228,6 : avec une épaisseur maximale de 14, la plus fine
        vaut six centièmes, c'est-à-dire rien du tout au rendu. Relever ce
        plancher à une valeur « visible » ramènerait le rapport visuel à une
        vingtaine et rendrait le dessin faux — or c'est précisément ce rapport
        que la page annonce. Un trait qu'on ne voit pas est ici l'information :
        ce poids-là ne bougera pas. `epaisseur_min` existe pour les scènes qui
        comparent des valeurs de même ordre, et vaut zéro par défaut.
        """
        valeurs = np.abs(np.asarray(valeurs, dtype=float))
        haut = float(maximum if maximum is not None else valeurs.max())
        haut = haut if haut > 0 else 1.0
        cible = traits.copy()
        for trait, valeur in zip(cible, valeurs):
            trait.set_stroke(
                BRIQUE,
                width=max(epaisseur_min, epaisseur_max * float(valeur) / haut),
                opacity=OPACITE_EVIDENCE,
            )
        return cible

    def annotations_du_reseau(self) -> VGroup:
        """Les textes que le réseau porte sur lui-même : les accolades cotées,
        les « ⋮ » des colonnes abrégées, les dix chiffres de la sortie."""
        groupe = VGroup()
        for colonne in self.colonnes:
            for nom in ("accolade", "suspension"):
                accessoire = getattr(colonne, nom, None)
                if accessoire is not None:
                    groupe.add(accessoire)
        groupe.add(self.etiquettes_sortie)
        return groupe

    def degager(self, sauf=None) -> list:
        """
        Le réseau passe au décor ET rend ses annotations. Pour les scènes dont
        le sujet traverse le cadre.

        POURQUOI LES ANNOTATIONS PARTENT AU LIEU DE PÂLIR. Un vecteur de cent
        vingt-huit composantes demande dix unités de large : à moins, une barre
        fait trois pixels et le peigne ne se lit plus. Un sujet de cette largeur
        passe forcément au travers du « ⋮ » d'une colonne abrégée et des dix
        chiffres de la sortie. `effacer_le_reseau` les met à 0,3, où ils restent
        parfaitement lisibles — et le crible les relève, à juste titre : un
        chiffre sous une barre pleine se lit comme la cote de cette barre.

        LE RÉSEAU, LUI, RESTE. Ses ronds et ses arêtes gardent le décor à 0,3 :
        le lecteur voit toujours où vit le vecteur qu'on lui montre. Ce qui s'en
        va, ce sont les cotes — c'est-à-dire la LECTURE du réseau, dont personne
        n'a besoin pendant qu'on lui montre autre chose. Le module gelé le dit
        dans l'autre sens : « une cote à pleine opacité à côté d'un sujet pâle
        désigne la cote ». Sous le sujet, c'est pire.

        LES SCÈNES QUI LISENT LE RÉSEAU N'APPELLENT PAS CECI. Celles dont le
        sujet EST le réseau, ou un neurone dedans, gardent `animations_
        effacement` : leurs cotes servent, et rien ne passe dessus.
        """
        from manim import FadeOut

        epargnes = set()
        for mob in sauf or []:
            epargnes.update(id(f) for f in mob.get_family())

        animations = []
        for faisceau in self.faisceaux:
            restants = VGroup(*[t for t in faisceau if id(t) not in epargnes])
            if len(restants):
                animations.append(
                    restants.animate.set_stroke(opacity=OPACITE_DECOR_TRAIT)
                )
        for colonne in self.colonnes:
            cibles = colonne.ronds.copy()
            change = False
            for rond, cible in zip(colonne.ronds, cibles):
                if id(rond) in epargnes:
                    continue
                cible.set_stroke(opacity=OPACITE_DECOR_ROND)
                cible.set_fill(opacity=rond.get_fill_opacity() * OPACITE_DECOR_ROND)
                change = True
            if change:
                animations.append(Transform(colonne.ronds, cibles))

        partantes = VGroup(
            *[a for a in self.annotations_du_reseau() if id(a) not in epargnes]
        )
        if len(partantes):
            animations.append(FadeOut(partantes))
        if self.montrer_grille:
            animations.append(Transform(self.grille, self.en_decor(self.grille)))
        return animations

    def vague_arriere(self, faisceau: int, duree: float = 1.0):
        """
        La cascade de `reseau_mob._vague`, jouée dans l'autre sens.

        `ShowPassingFlash` court le long de chaque trait de son premier point
        vers son dernier ; les arêtes du réseau partent toutes de la gauche. On
        retourne donc les points d'une COPIE : la lueur remonte alors de la
        sortie vers l'entrée, ce qui est exactement ce que le chapitre appelle
        la rétropropagation. Retourner les originaux casserait les scènes
        suivantes, qui les retrouveraient à l'envers.
        """
        from manim import ShowPassingFlash

        copie = self.faisceaux[faisceau].copy()
        for trait in copie:
            trait.reverse_points()
        copie.set_stroke(BRIQUE, opacity=0.55, width=1.1)
        return ShowPassingFlash(
            copie, run_time=duree, time_width=0.6, lag_ratio=0.002
        )

    # ── La composition ─────────────────────────────────────────────────────

    def poser_barres(self, barres: Barres, y: float = -1.6) -> Barres:
        """
        Un groupe de barres, posé sous le réseau, dans la bande libre.

        Il n'est pas mis à l'échelle par `poser_sujet` : la hauteur d'une barre
        EST une valeur, et l'agrandir jusqu'au cadre lui ferait dire autre
        chose. C'est `Barres(hauteur=…)` qui fixe l'échelle, une fois, et la
        scène qui choisit cette hauteur en connaissance de cause.
        """
        barres.move_to([0.0, y, 0.0])
        return barres

    def part_du_cadre(self, mobject) -> float:
        """La part de la hauteur du cadre qu'occupe `mobject`.

        Sert aux scènes à contrôler la règle des 60 % sur un sujet qu'elles
        composent elles-mêmes, sans passer par `poser_sujet`."""
        _, _, bas, haut = self.cadre_sujet()
        return float(mobject.height) / max(1e-6, haut - bas)


__all__ = [
    "Barres",
    "CLASSE",
    "CORPS",
    "CORPS_MATH",
    "RetroScene",
    "mesures_du_chapitre",
    "nombre",
    "signe",
    "un_seul_exemple",
]
