"""
Chapitre 2 · page 3 · Le 7 devient 784 nombres.

Une seule scène, et c'est la seule du chapitre qui commence SANS réseau : la
page 3 n'a pas encore de couches, elle n'a qu'une grille et la règle qui la
range. Le chiffre, lui, est là de la première à la dernière trame — la grille
ne se vide jamais, ce sont des copies de ses cases qui partent.

POURQUOI ELLE HÉRITE DE `SceneN7` ET NON DE `ReseauScene`. `ReseauScene.setup`
charge `l2-modeles.npz` et construit quatre colonnes, leurs faisceaux et les
étiquettes de sortie. Cette scène ne montre aucun poids, aucune propagation,
aucune couche de sortie : tout cela serait construit pour être retiré à la
première trame, et la scène échouerait faute d'un fichier de poids dont elle
n'a pas l'usage. `Colonne` et `charger_test()` donnent exactement les deux
objets dont elle a besoin — dont `Colonne.y_du_rang`, qui est le cœur de la
scène — sans rien du reste.

LES RANGS SONT EN BASE 1, LES INDICES NUMPY EN BASE 0. C'est la convention de
`mesures-chap2.txt` (« indices a partir de 1 ») et celle du cours : le pixel
(9, 7) porte le rang 231, et c'est 231 qui s'écrit à l'écran. Dans le code,
toute lecture d'un tableau passe par `rang - 1` : `image[230]`, `grille[230]`,
`colonne.y_du_rang(230)`. La conversion se fait aux deux boucles qui
parcourent les rangs, et nulle part ailleurs.

CE QUE LA COLONNE NE PEUT PAS ALLUMER. Ses 24 ronds dessinés désignent les
rangs 1 à 12 et 773 à 784, et l'image de test n°0 est vide sur ses sept
premières lignes comme sur la dernière : pas un de ces rangs ne porte d'encre.
Une colonne qui n'allumerait que ses ronds resterait donc blanche pendant que
116 pixels s'y déversent. Chaque case qui arrive laisse à la place une marque
à SA hauteur, celle que `y_du_rang` donne pour un rang montré ou non.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Brace,
    Create,
    FadeIn,
    GrowFromCenter,
    Line,
    MoveToTarget,
    Rectangle,
    Square,
    SurroundingRectangle,
    Transform,
    VGroup,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    GRIS_24,
    GRIS_40,
    TRAIT_COTE,
    SceneN7,
    appliquer_style,
)
from scenes.reseau_mob import (
    COTE_GRILLE,
    Colonne,
    X_ENTREE,
    X_GRILLE,
    Y_GRILLE,
    charger_test,
)

# ── Les quatre pixels que la page 3 cite ────────────────────────────────────
#
# (ligne, colonne, rang, octet), tous EN BASE 1, recopiés de
# `mesures-chap2.txt` lignes 48 à 51. L'octet est une chaîne : c'est celui du
# fichier de mesures qui s'écrit à l'écran, jamais un octet recalculé depuis
# l'image.
QUATRE = (
    (9, 7, 231, "222"),
    (9, 8, 232, "254"),
    (10, 7, 259, "67"),
    (13, 20, 356, "255"),
)

# La règle k = 28(i−1) + j, ligne 47 du fichier de mesures. L'assertion ne
# produit aucun nombre affiché : elle vérifie que les rangs recopiés sont bien
# ceux que la règle donne, et tombe si quelqu'un mélange les deux bases.
assert all(28 * (i - 1) + j == rang for i, j, rang, _ in QUATRE)

# ── La géométrie ────────────────────────────────────────────────────────────
#
# LA BANDE LIBRE N'EST PAS CELLE DES AUTRES SCÈNES. Le chapitre réserve
# x > 3,4 aux libellés parce que ses réseaux occupent tout le reste ; ici il
# n'y a qu'une grille et une colonne, et tout ce qui est à droite de −2,4 est
# vide. Les quatre phrases mesurent près de cinq unités de large : elles ne
# tiendraient nulle part ailleurs.

COTE_GRAND = 4.4               # la grille du premier temps, seule au centre
CENTRE_GRAND = (0.0, 0.1)

HAUTEUR_RONDS = 5.2            # la colonne abrégée passe sous le filet du titre

# Trois bandes verticales étroites, à droite des ronds, qui ne se touchent
# pas : l'encre qui arrive, puis la cote brique des quatre rangs cités, puis
# les phrases. Les marques ne peuvent pas se poser SUR l'axe de la colonne —
# le « ⋮ » y vit, et un tracé sous un texte est une faute de la règle 14.
X_MARQUE = -2.76               # les marques d'encre, contre la colonne
LARGEUR_MARQUE = 0.14
X_COTE = -2.58                 # les traits de cote des quatre rangs
LONGUEUR_COTE = 0.30
X_ARRIVEE = -2.55              # où une case atterrit avant de devenir sa marque

X_PHRASES = -1.8               # bord gauche des quatre phrases
X_OCTETS = 3.5                 # bord gauche des quatre octets
RANGEES = (1.75, 0.85, -0.05, -0.95)


def _grille(image: np.ndarray, cote_total: float, centre) -> VGroup:
    """
    La grille 28 × 28 de l'image, en niveaux de gris inversés.

    Même dessin que `ReseauScene._grille`, mais paramétré : cette scène ouvre
    sur une grille plus grande que celle du reste du chapitre, au centre, et
    la ramène ensuite à sa taille et à sa place ordinaires. La case de rang k
    est `cases[k - 1]`.
    """
    cote = cote_total / 28.0
    valeurs = np.asarray(image, dtype=float).reshape(28, 28)
    cases = VGroup()
    for i in range(28):
        for j in range(28):
            case = Square(side_length=cote, stroke_width=0.25, stroke_color=GRIS_24)
            case.set_fill(ENCRE, opacity=float(valeurs[i, j]))
            case.move_to(
                [
                    centre[0] - cote_total / 2 + (j + 0.5) * cote,
                    centre[1] + cote_total / 2 - (i + 0.5) * cote,
                    0,
                ]
            )
            cases.add(case)
    return cases


def _marque(valeur: float, hauteur: float) -> Rectangle:
    """La trace qu'une case laisse à son rang, contre la colonne."""
    marque = Rectangle(width=LARGEUR_MARQUE, height=0.03, stroke_width=0.0)
    marque.set_fill(ENCRE, opacity=valeur)
    marque.move_to([X_MARQUE, hauteur, 0])
    return marque


ANIMATIONS = [
    {
        "id": "le-7-devient-784-nombres",
        "scene": "LeSeptDevient784Nombres",
        "titre": "Les cases du 7 quittent la grille et prennent leur rang dans "
                 "la colonne de 784",
        "alt": (
            "Une grille de vingt-huit cases sur vingt-huit occupe le centre "
            "de l'écran ; un sept manuscrit y est dessiné, chaque case plus "
            "ou moins sombre selon l'encre qu'elle porte. Quatre cases "
            "s'entourent l'une après l'autre d'un cadre couleur brique, et la "
            "valeur de chacune s'inscrit à droite, l'une sous l'autre : deux "
            "cent vingt-deux, deux cent cinquante-quatre, soixante-sept, deux "
            "cent cinquante-cinq. La grille glisse alors vers la gauche en se "
            "réduisant, et une longue colonne de ronds vides se dresse à sa "
            "droite, du haut jusqu'au bas de l'image. Les quatre cases "
            "encadrées quittent la grille l'une après l'autre et filent vers "
            "leur hauteur dans cette colonne, où un trait brique marque leur "
            "arrivée ; chaque fois, une phrase s'écrit à côté : ligne neuf, "
            "colonne sept, rang deux cent trente et un ; ligne neuf, colonne "
            "huit, rang deux cent trente-deux ; ligne dix, colonne sept, rang "
            "deux cent cinquante-neuf ; ligne treize, colonne vingt, rang "
            "trois cent cinquante-six. Toutes les autres cases encrées "
            "s'envolent ensuite à leur tour, par paquets, du haut de la "
            "grille vers le bas, et chacune laisse une petite marque grise à "
            "sa hauteur le long de la colonne, qui se couvre peu à peu d'un "
            "pointillé serré. Le sept reste entier dans la grille : rien ne "
            "s'en efface. Une accolade se pose enfin "
            "le long de la colonne, et sous elle s'écrit sept cent "
            "quatre-vingt-quatre égale vingt-huit fois vingt-huit."
        ),
        "duree": None,
        "notions": [
            "aplatissement",
            "vec",
            "rang d'un pixel",
            "coordonnée d'un vecteur",
            "geste : la grille qui se vide dans une colonne",
        ],
        "source": "SOURCE.md · séquence 03:05 → 03:50",
        "page": 3,
        "apres_bloc": "b-r3-8",
        "ce_qui_change": (
            "les pixels quittent la grille et deviennent la colonne : ce qui "
            "varie est le rang atteint, qui va de 231 à 356 pour les quatre "
            "cases citées, puis parcourt toute la hauteur quand le reste de "
            "l'encre s'envole. La variation montre que l'ordre est ligne "
            "après ligne, et qu'un rang, une fois pris, ne l'est par aucun "
            "autre pixel."
        ),
        "texte_ecran": [
            "222",
            "254",
            "67",
            "255",
            "ligne 9, colonne 7 → rang 231",
            "ligne 9, colonne 8 → rang 232",
            "ligne 10, colonne 7 → rang 259",
            "ligne 13, colonne 20 → rang 356",
            "784 = 28 × 28",
        ],
        "nombres": [
            {"valeur": "222", "quoi": "octet du pixel (9, 7) de l'image de "
                                      "test n°0", "ligne": 48},
            {"valeur": "231", "quoi": "rang du pixel (9, 7)", "ligne": 48},
            {"valeur": "254", "quoi": "octet du pixel (9, 8)", "ligne": 49},
            {"valeur": "232", "quoi": "rang du pixel (9, 8)", "ligne": 49},
            {"valeur": "67", "quoi": "octet du pixel (10, 7)", "ligne": 50},
            {"valeur": "259", "quoi": "rang du pixel (10, 7)", "ligne": 50},
            {"valeur": "255", "quoi": "octet du pixel (13, 20)", "ligne": 51},
            {"valeur": "356", "quoi": "rang du pixel (13, 20)", "ligne": 51},
            {"valeur": "784 = 28 × 28", "quoi": "la règle k = 28(i−1) + j, "
                                                "en-tête des quatre valeurs",
             "ligne": 47},
        ],
        "legende": (
            "Le rang est une numérotation, pas une géométrie. Les pixels "
            "(9, 7) et (9, 8), voisins dans la grille, se suivent dans la "
            "colonne ; (9, 7) et (10, 7), voisins eux aussi, s'y retrouvent "
            "séparés d'une ligne entière."
        ),
    },
]


class LeSeptDevient784Nombres(SceneN7):
    titre = "Du pixel au rang"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        # Une seule image suffit : la scène ne montre que l'image de test n°0.
        image = charger_test(1)[0][0]

        # ── t0 : la grille seule, au centre, sans réseau ────────────────────
        #
        # POSÉE, PAS FONDUE. Le chapitre demande que le réseau ou le chiffre
        # soit à l'écran de la première à la dernière trame ; cette scène n'a
        # pas de réseau, donc un fondu d'entrée laisserait ses premières
        # trames vides. La grille est là avant que rien ne bouge.
        grille = _grille(image, COTE_GRAND, CENTRE_GRAND)
        self.add(grille)
        self.wait(1.6)

        # ── 1. Quatre cases s'entourent, quatre octets s'inscrivent ─────────
        self.next_section("Quatre cases, quatre octets")
        cadres = []
        for rangee, (_, _, rang, octet) in zip(RANGEES, QUATRE):
            cadre = SurroundingRectangle(
                grille[rang - 1],                     # base 1 → base 0
                color=BRIQUE,
                stroke_width=TRAIT_COTE,
                # Une case fait 21 px de côté à 1080p : un cadre posé au ras
                # d'un pixel noir se confond avec lui. Le jeu le décolle assez
                # pour qu'il se voie, sans mordre sur la case voisine.
                buff=0.02,
                corner_radius=0.0,
            )
            valeur = self.cote(octet, taille=24)
            valeur.move_to([X_OCTETS + valeur.width / 2, rangee, 0])
            cadres.append(cadre)
            self.play(Create(cadre), FadeIn(valeur), run_time=0.65)
        self.wait(0.6)

        # ── 2. La grille prend sa place, la colonne se dresse ───────────────
        #
        # La grille rejoint la géométrie du chapitre — même abscisse, même
        # côté que dans toutes les autres scènes — pour que le lecteur qui
        # tourne la page retrouve le même objet au même endroit.
        self.next_section("La grille recule, la colonne se dresse")
        ancre = [CENTRE_GRAND[0], CENTRE_GRAND[1], 0]
        self.play(
            VGroup(grille, *cadres)
            .animate.scale(COTE_GRILLE / COTE_GRAND, about_point=ancre)
            .shift(
                RIGHT * (X_GRILLE - CENTRE_GRAND[0])
                + UP * (Y_GRILLE - CENTRE_GRAND[1])
            ),
            run_time=1.3,
        )

        colonne = Colonne(784, X_ENTREE, montres=12)
        # L'accolade se pose au dernier temps, pas avec la colonne : elle
        # porte le compte, et le compte est la conclusion de la scène.
        colonne.remove(colonne.accolade)
        # Abrégée, la colonne mesure 6,45 unités de haut et son premier rond
        # monterait dans le filet du bandeau. On la ramène sous lui autour du
        # centre de ses ronds, pour qu'elle garde l'abscisse du chapitre.
        colonne.scale(
            HAUTEUR_RONDS / colonne.ronds.height,
            about_point=colonne.ronds.get_center(),
        )
        self.play(FadeIn(colonne), run_time=1.0)

        for numero, (rangee, quatrieme) in enumerate(zip(RANGEES, QUATRE)):
            ligne, colonne_pixel, rang, _ = quatrieme
            indice = rang - 1                         # base 1 → base 0
            hauteur = colonne.y_du_rang(indice)

            paquet = VGroup(cadres[numero], grille[indice].copy())
            self.remove(cadres[numero])
            self.add(paquet)
            self.play(
                paquet.animate.move_to([X_ARRIVEE, hauteur, 0]).scale(0.5),
                run_time=0.6,
            )

            trait = Line(
                [X_COTE, hauteur, 0],
                [X_COTE + LONGUEUR_COTE, hauteur, 0],
                stroke_width=TRAIT_COTE,
                color=BRIQUE,
            )
            phrase = self.etiquette(
                f"ligne {ligne}, colonne {colonne_pixel} → rang {rang}",
                taille=24,
            )
            phrase.move_to([X_PHRASES + phrase.width / 2, rangee, 0])
            # DEUX TEMPS, ET C'EST UNE QUESTION DE COMPOSITION. La case atterrit
            # d'abord, seule ; le trait de cote se crée ENSUITE, à sa place.
            # Transformer la case en « marque + trait » d'un seul geste faisait
            # voyager le trait depuis l'intérieur de la grille : pendant une
            # demi-seconde, un trait brique traversait le chiffre, et le crible
            # le relevait — à raison, c'est le sujet qu'il barrait.
            self.play(
                Transform(paquet, _marque(float(image[indice]), hauteur)),
                FadeIn(phrase),
                run_time=0.5,
            )
            self.play(Create(trait), run_time=0.25)
        self.wait(0.5)

        # ── 3. Le reste de l'encre part à son tour ──────────────────────────
        #
        # Par paquets, et non case par case : cent douze vols séparés feraient
        # durer ce seul temps plus d'une minute, et l'ordre des rangs — le
        # haut de l'image en haut de la colonne — se lit aussi bien sur un
        # paquet que sur une case.
        self.next_section("Le reste de l'encre prend son rang")
        deja = {rang - 1 for _, _, rang, _ in QUATRE}   # base 1 → base 0
        encrees = [k for k in range(784) if image[k] > 0.0 and k not in deja]
        par_paquet = max(1, len(encrees) // 12)
        for depart in range(0, len(encrees), par_paquet):
            vols = VGroup()
            marques = VGroup()
            for indice in encrees[depart:depart + par_paquet]:
                hauteur = colonne.y_du_rang(indice)
                copie = grille[indice].copy()
                copie.generate_target()
                copie.target.move_to([X_ARRIVEE, hauteur, 0])
                copie.target.scale(0.2)
                copie.target.set_opacity(0.0)
                vols.add(copie)
                marques.add(_marque(float(image[indice]), hauteur))
            self.add(vols)
            self.play(
                *[MoveToTarget(vol) for vol in vols], run_time=0.3, lag_ratio=0.0
            )
            self.remove(vols)
            self.add(marques)
        self.wait(0.5)

        # ── 4. L'accolade se pose et porte le compte ────────────────────────
        #
        # Le compte va SOUS la colonne et non au bout de l'accolade : à
        # gauche, il tomberait sur la grille. `Colonne` fait le même choix
        # pour la même raison, sous le nom `cote_dessous`.
        self.next_section("L'accolade, et le compte")
        accolade = Brace(colonne.ronds, LEFT, color=GRIS_40)
        compte = self.cote("784 = 28 × 28", taille=26)
        compte.next_to(colonne.ronds, DOWN, buff=0.35)
        self.play(GrowFromCenter(accolade), FadeIn(compte), run_time=1.2)
        self.wait(2.2)
