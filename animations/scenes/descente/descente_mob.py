"""
Ce que le chapitre 3 ajoute au réseau du chapitre 2.

`scenes/reseau_mob.py` et `scenes/n7ia.py` sont GELÉS : ils portent le réseau et
le style de tout le corpus, et huit chantiers travaillent dessus en même temps.
Tout ce dont les scènes de la descente ont besoin en plus vit ici, et ce fichier
les importe sans jamais les modifier.

TROIS CHOSES SEULEMENT.

**1. Le réseau AVANT l'apprentissage.** `ReseauScene` charge les poids
entraînés du chapitre 2. Le chapitre 3 commence une page plus tôt : au moment
où les poids viennent d'être tirés au hasard et où le réseau ne sait rien.
`ReseauAuHasard` refait le même réseau avec le tirage de la graine 0.

LE TIRAGE N'EST PAS INVENTÉ ICI. `init_aleatoire` est le protocole de
`cours/lecon3/mesures.py` ligne 94 : loi normale centrée d'écart-type racine de
deux sur la dimension d'entrée, biais à zéro, générateur de NumPy à graine
explicite. Vérifié, pas recopié : la sortie obtenue sur la première image de
test est celle que la mesure 1 imprime ligne 239, aux dix décimales affichées.

**2. Une coupe du coût.** Le coût est une fonction de 101 770 variables ; on ne
le dessine pas. On dessine sa restriction à UNE direction, et c'est ce que fait
la source elle-même : ses quatre classes de surface en relief sont vides, le
relief venait d'un autre logiciel (`SOURCE.md`, §11). Une coupe porte tout ce
que le chapitre démontre — qu'on suit la pente, et que là où on arrive dépend
d'où on part.

LA COUPE NE PORTE AUCUN NOMBRE, et c'est délibéré. Elle est un objet
mathématique choisi pour ses creux, pas une mesure : lui coter une altitude
reviendrait à écrire un nombre qui ne sort pas de `mesures.py`. Ses axes portent
leur nom, jamais une graduation.

**3. De quoi montrer que la bille ment.** Deux trajectoires sur la même coupe,
et elles ne finissent pas au même endroit :

    `roulement`  intègre la mécanique — une bille a de l'inertie, elle dépasse
                 un creux et peut finir dans le suivant ;
    `descente`   itère la règle du chapitre — pas d'inertie, des pas de longueur
                 proportionnelle à la pente, et l'arrêt dans le PREMIER creux.

C'est la seule façon de montrer ce que l'image de la bille promet en trop. La
source assume ce raccourci sans le dire ; le chapitre le dit, et ces deux
fonctions sont ce qui le lui permet.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    ORIGIN,
    UP,
    Axes,
    Line,
    Transform,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    ENCRE_75,
    TRAIT_AXE,
    TRAIT_COURBE,
    TRAIT_FILET,
    SceneN7,
)
from scenes.reseau_mob import (
    ReseauScene,
    avant,
    charger_test,
)

# ── 1. Le réseau au hasard ──────────────────────────────────────────────────

GRAINE = 0
TAILLES = (784, 128, 10)


def init_aleatoire(tailles: tuple[int, ...] = TAILLES,
                   graine: int = GRAINE) -> dict[str, np.ndarray]:
    """
    L'initialisation de He, protocole de `cours/lecon3/mesures.py` ligne 94.

    Le générateur est celui de NumPy, à graine explicite : deux machines qui
    lancent cette fonction obtiennent le MÊME réseau, et donc les mêmes dix
    valeurs de sortie que la mesure 1.
    """
    rng = np.random.default_rng(graine)
    theta: dict[str, np.ndarray] = {}
    for couche in range(1, len(tailles)):
        d_in, d_out = tailles[couche - 1], tailles[couche]
        theta[f"W{couche}"] = rng.normal(
            0.0, np.sqrt(2.0 / d_in), size=(d_out, d_in)
        )
        theta[f"b{couche}"] = np.zeros(d_out)
    return theta


class ReseauAuHasard(ReseauScene):
    """
    Le réseau de `reseau_mob.py`, poids tirés au hasard au lieu d'entraînés.

    `ReseauScene.setup` fait trois gestes : le style, les poids, le dessin. On
    refait les trois, le deuxième changé — on ne peut pas l'appeler par `super`,
    il irait chercher le npz des modèles entraînés du chapitre 2. C'est aussi ce
    qui rend ces scènes indépendantes de ce fichier : elles n'ont besoin que des
    images de test.
    """

    graine: int = GRAINE

    def setup(self) -> None:
        SceneN7.setup(self)
        self.theta = init_aleatoire(self.tailles, self.graine)
        self.Xte, self.cte = charger_test()
        self.construire_reseau()

    def sortie_au_hasard(self, indice: int = 0) -> np.ndarray:
        """Les dix valeurs que le réseau non entraîné donne à l'image `indice`."""
        return avant(self.theta, self.Xte[indice], self.activation)["A2"]

    def propager(self, indice: int = 0, duree: float = 7.0) -> dict:
        """
        Une image traverse le réseau.

        C'est `ReseauScene.propagation` sans son dernier geste : elle encadre le
        rond gagnant d'un rectangle, et le chapitre 3 ne pose pas de cadre. Le
        gagnant se marque en remontant SON trait à la brique — la couleur de ce
        qui bouge, sur l'objet lui-même plutôt qu'autour.
        """
        image = self.poser_image(indice)
        cache = avant(self.theta, image, self.activation)

        from manim import FadeIn

        self.play(FadeIn(self.grille), run_time=0.6)
        self.pixels_vers_couche(image, duree=2.2)
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image)),
            run_time=0.6,
        )

        couches = len(self.tailles) - 1
        par_couche = max(1.0, (duree - 3.4) / couches)
        for rang in range(1, couches + 1):
            colonne = self.colonnes[rang]
            self.play(
                self._vague(rang - 1, duree=par_couche),
                Transform(colonne.ronds, colonne.allumer(cache[f"A{rang}"])),
                run_time=par_couche,
            )
        return cache

    def marquer_sortie(self, rang: int) -> None:
        """Le rond de sortie `rang` passe à la brique. Aucun cadre."""
        rond = self.sortie.rond_du_rang(rang)
        if rond is not None:
            self.play(rond.animate.set_stroke(BRIQUE, width=3.0), run_time=0.5)


# ── 2. Les coupes du coût ───────────────────────────────────────────────────


class Coupe:
    """
    Le coût vu le long d'une direction : une fonction d'une variable.

    Deux instances seulement, plus bas, et elles ne servent pas à la même chose.
    Une coupe est décrite par sa fonction et par sa dérivée, toutes deux
    exactes : la pente que les scènes suivent est la vraie pente de la courbe
    qu'elles dessinent, jamais une approximation par différence.
    """

    def __init__(self, nom: str, bornes: tuple[float, float],
                 hauteurs: tuple[float, float], creux: tuple[float, ...]) -> None:
        self.nom = nom
        self.bornes = bornes
        self.hauteurs = hauteurs
        self.creux = creux

    def hauteur(self, w):  # pragma: no cover — redéfinie par chaque coupe
        raise NotImplementedError

    def pente(self, w):  # pragma: no cover — redéfinie par chaque coupe
        raise NotImplementedError

    # ── Le dessin ───────────────────────────────────────────────────────────

    def repere(self, largeur: float = 10.4, hauteur: float = 4.6) -> Axes:
        """
        Le repère de la coupe, SANS graduation, et POSÉ ICI.

        Une graduation serait une échelle, et une échelle sur un objet qui n'est
        pas mesuré invite à lire des valeurs qui n'existent pas. Les axes portent
        le nom de ce qu'ils portent, et rien d'autre.

        IL NE PASSE PAS PAR `poser_sujet`, ET C'EST VOULU. `poser_sujet` agrandit
        jusqu'à toucher un bord du cadre : l'axe des abscisses se retrouve alors
        exactement sur la marge, et son nom, posé dessous, tombe hors du cadre.
        Le crible le signale — « mord de 0,3 u ». La hauteur est donc posée :
        4,6 unités sur les 6,21 laissées sous le bandeau, soit 74 %, quand la
        règle en demande 60. `verifier_la_part` le contrôle à chaque scène.
        """
        axes = Axes(
            x_range=[self.bornes[0], self.bornes[1], 1.0],
            y_range=[self.hauteurs[0], self.hauteurs[1], 1.0],
            x_length=largeur,
            y_length=hauteur,
            axis_config={
                "color": ENCRE,
                "stroke_width": TRAIT_AXE,
                "include_ticks": False,
            },
            tips=False,
        )
        # Relevé d'un quart d'unité : c'est la place que prend le nom de l'axe
        # des abscisses, sous lui, à la taille du corps.
        axes.move_to(ORIGIN).shift(UP * 0.25)
        return axes

    def courbe(self, axes: Axes, couleur: str = ENCRE,
               epaisseur: float = TRAIT_COURBE):
        return axes.plot(
            self.hauteur,
            x_range=[self.bornes[0], self.bornes[1], 0.02],
            color=couleur,
            stroke_width=epaisseur,
        )

    def point(self, axes: Axes, w: float):
        return axes.c2p(w, self.hauteur(w))

    # ── Les deux trajectoires ───────────────────────────────────────────────

    def descente(self, w0: float, eta: float, pas: int) -> list[float]:
        """
        La règle du chapitre, itérée : w ← w − η × pente(w).

        Aucune inertie, aucun temps continu. La longueur du pas est celle de la
        pente : elle se réduit d'elle-même en approchant d'un creux, et c'est
        exactement ce que l'image de la bille ne montre pas.
        """
        w = float(w0)
        trajet = [w]
        for _ in range(pas):
            w = w - eta * float(self.pente(w))
            w = min(max(w, self.bornes[0]), self.bornes[1])
            trajet.append(w)
        return trajet

    def roulement(self, w0: float, secondes: float = 12.0, dt: float = 0.002,
                  g: float = 9.0, frottement: float = 0.38) -> list[float]:
        """
        Une VRAIE bille sur la courbe, intégrée pas à pas.

        Le modèle est celui d'un point pesant qui glisse sans quitter le tracé :
        l'accélération le long de l'horizontale vaut moins g fois la pente,
        divisée par un plus la pente au carré, moins le frottement. Il a donc
        une VITESSE, et c'est tout le propos : une bille lâchée assez haut
        traverse un creux au lieu de s'y arrêter.

        Rendu à la cadence des scènes, un point tous les cinquantièmes.
        """
        w, v = float(w0), 0.0
        trajet = [w]
        garde = max(1, int(round(0.02 / dt)))
        for etape in range(int(secondes / dt)):
            p = float(self.pente(w))
            a = -g * p / (1.0 + p * p) - frottement * v
            v += a * dt
            w += v * dt
            if w < self.bornes[0] or w > self.bornes[1]:
                w = min(max(w, self.bornes[0]), self.bornes[1])
                v = 0.0
            if (etape + 1) % garde == 0:
                trajet.append(w)
        return trajet


class _DeuxVallees(Coupe):
    """
    Deux creux d'inégale profondeur, séparés par une barrière basse.

    LES TROIS POINTS CRITIQUES SONT POSÉS, PAS TROUVÉS : la dérivée est écrite
    comme un produit de ses racines. Le creux de gauche est à −1,6, la barrière
    à 0, le creux de droite à 2,6 — et le creux de droite est le plus profond.

    C'est la seule forme qui laisse voir les deux choses à la fois : une bille
    lâchée à gauche a de quoi franchir la barrière et finir à droite, tandis que
    la règle du chapitre, sans vitesse, s'arrête à gauche.

    LE DOMAINE EST DÉCALÉ POUR ÊTRE POSITIF, et ce n'est pas cosmétique : Manim
    place l'axe des ordonnées à l'abscisse zéro dès que le domaine la contient.
    Avec un domaine à cheval sur zéro, cet axe se dresse AU MILIEU de la coupe,
    où il se lit comme un second relief — le premier rendu d'essai le montrait
    sans appel. Décalé, le domaine le renvoie au bord gauche, là où on lit une
    courbe de coût. Le décalage ne change rien aux trajets : la mécanique comme
    la règle sont invariantes par translation.
    """

    K = 0.06
    RACINES = (-1.6, 0.0, 2.6)
    DECALAGE = 3.0

    def hauteur(self, t):
        # La primitive du produit développé, terme à terme.
        w = t - self.DECALAGE
        return 0.015 * w ** 4 - 0.02 * w ** 3 - 0.1248 * w ** 2 + 1.4

    def pente(self, t):
        w = t - self.DECALAGE
        a, b, c = self.RACINES
        return self.K * (w - a) * (w - b) * (w - c)


class _TroisCreux(Coupe):
    """
    Trois creux d'altitudes voisines, le relief que la mesure 6 décrit.

    Trois entraînements au même protocole, à trois graines, arrivent à trois
    solutions très éloignées les unes des autres et de précisions presque
    identiques — 0,9814, 0,9823, 0,9816. Un relief à trois creux de profondeurs
    voisines est la forme d'une variable qui dit cela ; un relief à un seul
    creux dirait le contraire.

    L'ondulation vient d'un cosinus, qui donne des creux exactement égaux, et le
    terme linéaire les départage d'un rien : c'est la façon la plus économique
    d'obtenir « presque la même altitude » sans choisir trois nombres.
    """

    PERIODE = 3.4
    AMPLITUDE = 0.9
    PENTE_DE_FOND = -0.012
    DECALAGE = 6.0            # même raison que pour la coupe à deux vallées

    def hauteur(self, t):
        w = t - self.DECALAGE
        k = 2.0 * np.pi / self.PERIODE
        return self.AMPLITUDE * (1.0 - np.cos(k * w)) + self.PENTE_DE_FOND * w + 1.0

    def pente(self, t):
        w = t - self.DECALAGE
        k = 2.0 * np.pi / self.PERIODE
        return self.AMPLITUDE * k * np.sin(k * w) + self.PENTE_DE_FOND


# LE DOMAINE DE LA COUPE À DEUX VALLÉES S'ARRÊTE AVANT SA PAROI GAUCHE. Pris
# jusqu'à −2,95 en coordonnées non décalées, il monte à 1,96 ; pris plus loin, la
# paroi grimpe à 3 et écrase les deux creux, qui vivent entre 0,89 et 1,40, dans
# le quart bas de la figure. Le premier rendu d'essai donnait une cuvette unique
# avec un pli. Les bornes ci-dessous sont celles qui laissent les creux occuper
# la moitié de la hauteur.
COUPE_BILLE = _DeuxVallees("deux vallées", (0.05, 7.0), (0.82, 2.05),
                           (1.4, 5.6))
COUPE_GRAINES = _TroisCreux("trois creux", (0.9, 11.1), (0.8, 3.0),
                            (2.6039, 6.0039, 9.4039))

# LES DEUX TRAJETS PARTENT DU MÊME POINT ET N'ARRIVENT PAS AU MÊME CREUX. C'est
# le fait que les deux scènes de la bille existent pour montrer, et il se vérifie
# ici plutôt qu'à l'œil sur un rendu : si une retouche de la coupe le faisait
# tomber, les deux scènes ne diraient plus rien et rien ne le signalerait.
DEPART_BILLE = 0.12

assert abs(COUPE_BILLE.descente(DEPART_BILLE, 0.45, 26)[-1] - 1.4) < 0.02
assert abs(COUPE_BILLE.roulement(DEPART_BILLE)[-1] - 5.6) < 0.06


# ── 3. Les cotes du chapitre ────────────────────────────────────────────────
#
# TOUT NOMBRE AFFICHÉ PAR UNE SCÈNE DU CHAPITRE EST ICI, avec la ligne de
# `cours/lecon3/mesures.py` dont il sort. Une scène qui écrirait un nombre sans
# le prendre dans cette table écrirait un nombre que personne n'a mesuré.
#
# La virgule décimale est celle du français : les scènes composent avec
# `nombre()` plus bas, jamais avec un point.

MESURES = {
    # mesure 1, ligne 239 — la sortie du réseau de la graine 0 sur la première
    # image de test. Les scènes ne la recopient pas : elles la recalculent par
    # `ReseauAuHasard.sortie_au_hasard()`, et l'assertion plus bas vérifie
    # qu'elles retombent sur ces dix valeurs.
    "sortie": (0.1221, 0.0885, 0.2106, 0.1094, 0.1149,
               0.1021, 0.0825, 0.0650, 0.0493, 0.0555),
    "classe_vraie": 7,                # mesure 1, ligne 243
    "perte_exemple": 2.733006,        # mesure 1, ligne 245
    # La hauteur d'une loi uniforme sur K classes, soit 1/K. K vaut 10 et il est
    # posé ligne 55 ; la mesure 1 s'en sert ligne 228 pour écrire −ln(1/10). Ce
    # n'est pas une valeur imprimée mais un paramètre du protocole, et c'est la
    # seule entrée de cette table qui soit dans ce cas.
    "uniforme": 0.1,
    # mesures 4 et 10, lignes 329 à 341 — le gradient au départ, graine 0.
    "p": 101770,                      # ligne 329
    "composante_max": 0.10084,        # ligne 330
    "composante_mediane": 0.00024935,  # ligne 331
    "rapport": 404,                   # ligne 332
    "parts": ((1, 14.55), (10, 60.39), (50, 98.90)),  # ligne 341
    # mesure 5, lignes 428 et 445 — le lot contre le gradient complet.
    "lots": ((1, 84.9), (8, 68.3), (64, 40.6), (512, 16.7), (4096, 5.8)),
    # mesure 6, lignes 468 à 482 — trois graines, même protocole.
    "precisions": (0.9814, 0.9823, 0.9816),           # ligne 468
    "distances": (1.4036, 1.4010, 1.3991),            # ligne 480
    "racine_deux": 1.4142,                            # ligne 482
    # mesure 7, lignes 513 à 518 — la norme du gradient par époque.
    "epoques": (0, 4, 9, 19, 29),
    "normes": (0.087878, 0.058533, 0.065720, 0.002535, 0.000833),
    "facteur": 105,                                   # ligne 518
}

# LA NORME NE DÉCROÎT PAS DE FAÇON MONOTONE, et la scène qui la montre doit le
# montrer : la neuvième époque remonte au-dessus de la quatrième. Une scène qui
# rangerait les cinq normes dans l'ordre décroissant mentirait sur la mesure.
assert MESURES["normes"][2] > MESURES["normes"][1]

# Le rapport 404 est celui des deux composantes citées, pas un nombre de plus.
assert round(MESURES["composante_max"] / MESURES["composante_mediane"]) == \
    MESURES["rapport"]

# Les trois distances encadrent racine de deux par en dessous : trois solutions
# un peu moins qu'orthogonales, et c'est le fait de la page.
assert all(d < MESURES["racine_deux"] for d in MESURES["distances"])


def nombre(valeur: float, decimales: int = 4) -> str:
    """
    Un nombre composé en français : virgule décimale, signe moins typographique.

    Le crible refuse le trait d'union en guise de signe moins — il refuse
    « −0,5 » écrit avec le tiret du clavier. On le compose donc une fois ici.
    """
    texte = f"{valeur:.{decimales}f}".replace(".", ",")
    return texte.replace("-", "−")


def entier(valeur: int) -> str:
    """Un entier avec l'espace insécable fine des milliers : 101 770."""
    return f"{valeur:,}".replace(",", " ")


def degres(valeur: float) -> str:
    """Un angle : « 84,9° »."""
    return f"{valeur:.1f}".replace(".", ",") + "°"


# ── Les ornements communs ───────────────────────────────────────────────────


def verifier_la_part(scene, mobject, part: float = 0.60) -> None:
    """
    Le sujet occupe-t-il sa part de la hauteur du cadre ?

    C'est la vérification de `SceneN7.poser_sujet`, SANS la mise à l'échelle qui
    l'accompagne. Une scène qui pose son sujet elle-même — parce qu'elle doit
    garder de la place sous lui pour un nom d'axe ou une cote de référence —
    perdrait ce contrôle en même temps que l'agrandissement. Elle le retrouve
    ici, et la règle reste la même : sous 60 %, c'est la composition qu'il faut
    reprendre, pas la marge.
    """
    _, _, bas, haut = scene.cadre_sujet()
    obtenue = float(mobject.height) / float(haut - bas)
    if obtenue < part:
        raise RuntimeError(
            f"{type(scene).__name__} : le sujet n'occupe que {obtenue:.0%} de "
            f"la hauteur du cadre, il en faut {part:.0%}."
        )


def point_ecran(axes: Axes, coupe: Coupe, w: float) -> np.ndarray:
    """Le point de la courbe d'abscisse `w`, en coordonnées de l'écran."""
    return axes.c2p(w, float(coupe.hauteur(w)))


def normale_ecran(axes: Axes, coupe: Coupe, w: float,
                  eps: float = 1e-3) -> np.ndarray:
    """
    La normale unitaire à la courbe, DANS LE PLAN DE L'ÉCRAN.

    Elle ne se calcule pas depuis la dérivée : le repère n'a pas la même échelle
    en abscisse et en ordonnée, et la normale mathématique, transportée telle
    quelle, n'est plus perpendiculaire au tracé qu'on voit. Une bille posée
    dessus flotterait d'un côté et mordrait la courbe de l'autre. On prend donc
    la tangente entre deux points VOISINS DÉJÀ PROJETÉS, ce qui tient quelle que
    soit l'échelle du repère.
    """
    avant_ = axes.c2p(w - eps, float(coupe.hauteur(w - eps)))
    apres = axes.c2p(w + eps, float(coupe.hauteur(w + eps)))
    tangente = np.asarray(apres) - np.asarray(avant_)
    normale = np.array([-tangente[1], tangente[0], 0.0])
    longueur = float(np.linalg.norm(normale))
    if longueur < 1e-9:  # pragma: no cover — la courbe n'a pas de point double
        return np.array([0.0, 1.0, 0.0])
    normale = normale / longueur
    return normale if normale[1] > 0 else -normale


def poser_sur_la_courbe(mobile, axes: Axes, coupe: Coupe, w: float,
                        rayon: float):
    """Pose `mobile` TANGENT à la courbe en `w`, du bon côté."""
    mobile.move_to(point_ecran(axes, coupe, w) + rayon * normale_ecran(axes, coupe, w))
    return mobile


def filet_de_base(axes: Axes, hauteur: float = 0.0) -> Line:
    """
    Un filet horizontal au niveau `hauteur`, à l'encre pâlie.

    L'encre à 0,30 est le plancher du style : un gris clair ne se lit pas sur
    papier et ne se rattrape pas à l'impression.
    """
    gauche = axes.c2p(axes.x_range[0], hauteur)
    droite = axes.c2p(axes.x_range[1], hauteur)
    return Line(gauche, droite, stroke_width=TRAIT_FILET, color=ENCRE_30)


__all__ = [
    "BRIQUE",
    "COUPE_BILLE",
    "COUPE_GRAINES",
    "Coupe",
    "DEPART_BILLE",
    "ENCRE",
    "ENCRE_30",
    "ENCRE_55",
    "ENCRE_75",
    "GRAINE",
    "MESURES",
    "ReseauAuHasard",
    "TAILLES",
    "degres",
    "entier",
    "filet_de_base",
    "init_aleatoire",
    "nombre",
    "normale_ecran",
    "point_ecran",
    "poser_sur_la_courbe",
    "verifier_la_part",
]
