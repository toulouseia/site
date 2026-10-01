"""
Chapitre 2 · page 7 · Deux 4, et leur milieu.

La page vient de poser sa question — un modèle linéaire peut-il lire 4 sur deux
images de 4 et autre chose sur leur milieu ? — et la scène la joue sur le cas
concret que `cours/lecon2/mesures.py` a retenu : les images de test n°115 et
n°668. Elle la joue DEUX FOIS, une fois par modèle. C'est la comparaison qui
porte l'argument ; un seul glissement ne démontrerait rien.

ELLE NE MONTRE PAS LE RÉSEAU ENTIER AU DÉPART, et c'est, avec la scène de la
page 3, la seule du chapitre dans ce cas. Ce qu'elle donne à voir est une
opération sur des IMAGES — deux entrées, leur moyenne — et le réseau n'y est que
le lecteur : il se tient réduit, à droite. Deux grilles occupent la scène, et
une grille au moins est à l'écran de la première à la dernière trame.

LE CHIFFRE LU N'EST AFFICHÉ QU'AUX TROIS POINTS MESURÉS : l'image 115, l'image
668, et leur milieu. Entre eux, le cadre de sortie s'efface et les colonnes
s'éteignent. La classe est calculable partout le long du segment — pour le
modèle à ReLU elle bascule dès le premier centième du parcours — mais
`mesures.py` ne relève que ces trois points-là. Une scène qui suivrait l'argmax
en continu afficherait, deux cents fois par traversée, des réponses que le
chapitre n'a jamais mesurées et que sa page ne peut pas relire.

CE QUI EST INTERPOLÉ EST EXACT, ET C'EST POURQUOI LE GLISSEMENT EST UN SEUL
`Transform`. L'image moyenne dépend linéairement de la position du point, et
`Transform` interpole linéairement l'opacité d'une case entre son état de départ
et son état d'arrivée : à chaque trame, la grille du milieu porte donc la vraie
combinaison, pas une approximation de transition. La colonne d'entrée, dont les
ronds portent des valeurs de pixels, suit pour la même raison. Les colonnes qui
suivent, elles, ne sont pas linéaires en la position — elles restent éteintes
pendant le glissement plutôt que de mentir sur un intermédiaire.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    ORIGIN,
    RIGHT,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    Transform,
    VGroup,
    linear,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    GRIS_40,
    GRIS_58,
    TRAIT_AXE,
    TRAIT_FILET,
    appliquer_style,
)
from scenes.reseau_mob import (
    COTE_GRILLE,
    OPACITE_VOILE,
    X_CACHEE,
    Colonne,
    ReseauScene,
    avant,
    charger_modele,
)

ANIMATIONS = [
    {
        "id": "deux-4-et-leur-milieu",
        "scene": "DeuxQuatreEtLeurMilieu",
        "titre": (
            "Deux images de 4, leur milieu, et les deux réponses que les deux "
            "modèles y lisent"
        ),
        "alt": (
            "Deux carrés quadrillés occupent le haut de l'écran, côte à côte, "
            "chacun portant un quatre manuscrit tracé en gris ; ce sont deux "
            "écritures très différentes du même chiffre, et le numéro de "
            "l'image est écrit au-dessus de chacune. À droite, plus petit, un "
            "réseau attend, éteint : une colonne de ronds vides pour les points "
            "de l'image, cotée sept cent quatre-vingt-quatre, une colonne de "
            "dix ronds pour les dix chiffres, et un voile de traits très pâles "
            "entre les deux. Un trait droit relie le bas des deux carrés. Un "
            "point brique posé à son extrémité gauche se met à glisser vers la "
            "droite, lentement. Sous le trait, un troisième carré quadrillé "
            "apparaît et se transforme à mesure : les traits du premier quatre "
            "s'effacent pendant que ceux du second se forment, et à mi-chemin "
            "les deux écritures se superposent en gris pâle, sans qu'aucune ne "
            "soit franche. Le point s'arrête trois fois — au départ, au milieu, "
            "à l'arrivée — et chaque fois la colonne de droite s'allume et un "
            "cadre se referme sur un rond : trois fois sur le quatre, et une "
            "ligne écrite en bas le redit. Une colonne de petits ronds s'insère "
            "alors au milieu du réseau, cotée cent vingt-huit, le point revient "
            "à son départ, et le même glissement recommence. Cette fois, au "
            "deuxième arrêt, le cadre ne se referme plus sur le quatre mais sur "
            "le neuf ; à l'arrivée il revient au quatre."
        ),
        "duree": None,
        "notions": [
            "geste : un point glisse le long d'un segment",
            "convexité",
            "région de décision",
            "interpolation de deux images",
        ],
        "source": (
            "aucune : la source ne parle pas de convexité. C'est l'argument le "
            "plus original du chapitre, et il n'a aucun précédent visuel. "
            "(SOURCE.md · « Ce que la source ne montre nulle part »)"
        ),
        "page": 7,
        "apres_bloc": "b-r7-4",
        "ce_qui_change": (
            "La position du point sur le segment, de l'image 115 à l'image 668, "
            "et avec elle l'image du milieu, qui passe continûment de la "
            "première écriture à la seconde. Le chiffre lu à l'arrivée du point "
            "est relevé aux trois points mesurés : il ne bouge pas d'un bout à "
            "l'autre pour le modèle linéaire, et il bascule sur 9 au milieu "
            "pour le réseau à ReLU. C'est cette bascule, et non le glissement, "
            "qui sépare les deux modèles."
        ),
        "texte_ecran": [
            "image de test n°115",
            "image de test n°668",
            "leur milieu",
            "linéaire : 4 · 4 · 4",
            "ReLU : 4 · 4 · 9",
        ],
        "nombres": [
            {
                "valeur": "115",
                "quoi": "image de test n°115, classe 4",
                "ligne": 331,
            },
            {
                "valeur": "668",
                "quoi": "image de test n°668, classe 4",
                "ligne": 332,
            },
            {
                "valeur": "4 · 4 · 4",
                "quoi": (
                    "modèle linéaire, sur l'image 115, l'image 668 et leur "
                    "milieu ; c'est aussi ce que le cadre de sortie désigne aux "
                    "trois arrêts de la première traversée"
                ),
                "ligne": 336,
            },
            {
                "valeur": "4 · 4 · 9",
                "quoi": (
                    "modèle à ReLU, sur l'image 115, l'image 668 et leur "
                    "milieu ; le cadre tombe sur le 9 au deuxième arrêt de la "
                    "seconde traversée"
                ),
                "ligne": 337,
            },
            {
                "valeur": "784",
                "quoi": "l'entrée du modèle linéaire, cotée par l'accolade",
                "ligne": 127,
            },
            {
                "valeur": "128",
                "quoi": (
                    "la couche cachée du modèle à ReLU, cotée sous la colonne "
                    "quand elle s'insère"
                ),
                "ligne": 213,
            },
        ],
        "legende": (
            "Le milieu de deux images n'est pas un cas limite : c'est une "
            "entrée comme les autres. Le modèle linéaire y lit 4, comme aux "
            "deux extrémités ; le réseau à ReLU y lit 9. Même segment, deux "
            "réponses."
        ),
    },
]


# ── La géométrie de la scène ────────────────────────────────────────────────
#
# Les trois grilles et le segment tiennent la moitié gauche ; le réseau réduit
# tient la droite. Les abscisses sont posées à la main, comme dans
# `reseau_mob.py`, et pour la même raison : une répartition automatique
# rapprocherait les libellés jusqu'au recouvrement dès qu'un texte s'allonge.

COTE = 2.0                      # côté d'une grille 28 × 28, en unités
X_A = -5.15                     # centre de la grille de l'image 115
X_B = -1.65                     # centre de la grille de l'image 668
X_M = (X_A + X_B) / 2.0         # centre de la grille du milieu, et du segment
Y_GRILLES = 1.35                # centre des deux grilles du haut
Y_ETIQUETTES = 2.70             # les deux libellés, au-dessus des grilles
Y_SEGMENT = 0.0
Y_MILIEU = -1.30                # centre de la grille du milieu
Y_LIBELLE_MILIEU = -2.55
Y_LIGNE_LINEAIRE = -2.98
Y_LIGNE_RELU = -3.34

FACTEUR = 0.82                  # le réseau, réduit pour céder la place aux grilles
X_RESEAU = 3.72                 # où son centre se pose

INDICE_A = 115
INDICE_B = 668

# Les trois positions du point où le chapitre a mesuré une réponse. Il n'y en a
# pas d'autres, et la scène n'en affiche pas d'autres.
ARRETS = (0.0, 0.5, 1.0)


def _faisceau(gauche: Colonne, droite: Colonne) -> VGroup:
    """
    Le voile de traits entre deux colonnes.

    C'est le geste de `ReseauScene.construire_reseau`, refait ici parce que la
    colonne cachée n'existe pas quand elle construit ses faisceaux : cette scène
    pose un réseau linéaire, puis lui INSÈRE une couche en cours de route. Le
    retrait vaut le plus grand des deux rayons, pour la raison donnée dans
    `reseau_mob.py` — pris sur le petit rond, le trait entre dans le grand et y
    dessine une encoche claire au travers du cercle.
    """
    faisceau = VGroup()
    for depart in gauche.ronds:
        for arrivee in droite.ronds:
            trait = Line(
                depart.get_center(),
                arrivee.get_center(),
                buff=max(depart.width, arrivee.width) / 2,
                stroke_width=0.7,
                color=GRIS_40,
            )
            trait.set_stroke(opacity=OPACITE_VOILE)
            faisceau.add(trait)
    return faisceau


class DeuxQuatreEtLeurMilieu(ReseauScene):
    """
    Un point glisse de l'image 115 à l'image 668, deux fois, deux modèles.

    Le réseau dessiné est celui de `ReseauScene` avec `tailles = (784, 10)` :
    c'est le modèle linéaire, celui de la première traversée. Le modèle à ReLU
    est chargé à la main dans `construct` ; sa couche cachée s'insère dans le
    dessin au moment où la seconde traversée commence, faute de quoi la scène
    afficherait les réponses d'un réseau qu'elle ne montre pas.
    """

    titre = "Deux 4, et leur milieu"
    modele = "lineaire"
    tailles = (784, 10)
    activation = "identite"
    montrer_grille = False      # la scène pose ses trois grilles elle-même

    # ── Les pièces ──────────────────────────────────────────────────────────

    def _grille_a(self, image: np.ndarray, centre) -> VGroup:
        """Une grille 28 × 28 au format de la scène, posée où on le demande."""
        grille = self._grille(image)
        grille.scale(COTE / COTE_GRILLE)
        grille.move_to(centre)
        return grille

    def _melange(self, t: float) -> np.ndarray:
        """L'entrée au point `t` du segment : (1 − t)·x₁₁₅ + t·x₆₆₈."""
        return (1.0 - t) * self.x_a + t * self.x_b

    def _allumage(self, theta, activation: str, x: np.ndarray, cachee):
        """
        Les transformations qui allument le réseau sur l'entrée `x`, et le rang
        de sortie retenu. Le calcul est celui de `mesures.py`, mot pour mot.

        Le maximum de la colonne d'entrée est fixé à 1 et non lu sur l'image :
        un pixel vaut déjà de zéro à un, et normaliser par le maximum de CHAQUE
        entrée ferait varier la teinte d'un rond sans que la valeur qu'il porte
        ait changé.
        """
        cache = avant(theta, x, activation)
        couches = len(theta) // 2
        gestes = [
            Transform(self.entree.ronds, self.entree.allumer(x, maximum=1.0)),
            Transform(
                self.sortie.ronds, self.sortie.allumer(cache[f"A{couches}"])
            ),
        ]
        if cachee is not None:
            gestes.insert(
                1, Transform(cachee.ronds, cachee.allumer(cache["A1"]))
            )
        return gestes, int(np.argmax(cache[f"A{couches}"]))

    def _extinction(self, cachee) -> list:
        """Le retour à zéro, joué plutôt que posé : un saut se lit comme un défaut."""
        colonnes = [self.entree, self.sortie] + ([cachee] if cachee else [])
        return [
            Transform(
                colonne.ronds,
                colonne.allumer(np.zeros(colonne.taille), maximum=1.0),
            )
            for colonne in colonnes
        ]

    # ── La traversée, jouée deux fois ───────────────────────────────────────

    def _traversee(self, theta, activation: str, cachee, ligne) -> None:
        """
        Un aller de 115 vers 668, avec ses trois arrêts et rien entre eux.

        `ligne` est la cote qui s'inscrit à l'arrivée : c'est le triplet mesuré,
        et il n'apparaît qu'une fois les trois arrêts vus.
        """
        cadre = None
        for rang, t in enumerate(ARRETS):
            if rang > 0:
                # LE GLISSEMENT EST UN SEUL MOUVEMENT LINÉAIRE. `linear` n'est
                # pas un choix d'allure : c'est ce qui fait que la grille du
                # milieu porte, à chaque trame, la combinaison qui correspond
                # vraiment à la position du point.
                self.play(
                    self.point.animate.move_to(self._sur_segment(t)),
                    Transform(
                        self.grille_m,
                        self._grille_a(self._melange(t), [X_M, Y_MILIEU, 0]),
                    ),
                    Transform(
                        self.entree.ronds,
                        self.entree.allumer(self._melange(t), maximum=1.0),
                    ),
                    run_time=1.8,
                    rate_func=linear,
                )

            gestes, gagnant = self._allumage(
                theta, activation, self._melange(t), cachee
            )
            self.play(*gestes, run_time=0.55)
            cadre = self._cadre_sortie(gagnant)

            # « LEUR MILIEU » NE VIT QUE PENDANT L'ARRÊT DU MILIEU. La grille du
            # bas montre le point où le glissement en est ; elle ne porte la
            # moyenne des deux images qu'à cet arrêt-là, et laisser le libellé
            # au-dessus d'elle jusqu'au bout ferait dire « leur milieu » à
            # l'image 668. Il apparaît en place et disparaît en place : rien ne
            # se déplace, et rien ne ment entre deux arrêts.
            au_milieu = [FadeIn(self.libelle_milieu)] if rang == 1 else []
            self.play(Create(cadre), *au_milieu, run_time=0.35)
            self.wait(1.0 if rang == 1 else 0.5)

            if rang < len(ARRETS) - 1:
                self.play(
                    FadeOut(cadre),
                    *([FadeOut(self.libelle_milieu)] if rang == 1 else []),
                    *self._extinction(cachee),
                    run_time=0.35,
                )
                cadre = None

        self.play(FadeIn(ligne), run_time=0.5)
        self.wait(0.5)
        self.cadre_courant = cadre

    def _sur_segment(self, t: float):
        return [X_A + t * (X_B - X_A), Y_SEGMENT, 0]

    # ── La scène ────────────────────────────────────────────────────────────

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        theta_relu = charger_modele("relu")
        self.x_a = self.Xte[INDICE_A]
        self.x_b = self.Xte[INDICE_B]

        # LA COUCHE CACHÉE EST CONSTRUITE MAINTENANT, avec ses deux faisceaux,
        # pour subir la même réduction et le même déplacement que le reste du
        # réseau. Construite après coup, elle se poserait dans le repère
        # d'origine, à l'échelle 1, au milieu des grilles.
        cachee = Colonne(128, X_CACHEE, montres=24, cote_dessous=True)
        faisceau_entree = _faisceau(self.entree, cachee)
        faisceau_sortie = _faisceau(cachee, self.sortie)
        couche_relu = VGroup(faisceau_entree, faisceau_sortie, cachee)

        ensemble = VGroup(self.reseau, couche_relu)
        ensemble.scale(FACTEUR, about_point=ORIGIN)
        ensemble.shift(RIGHT * (X_RESEAU - ensemble.get_center()[0]))

        grille_a = self._grille_a(self.x_a, [X_A, Y_GRILLES, 0])
        grille_b = self._grille_a(self.x_b, [X_B, Y_GRILLES, 0])
        etiquette_a = self.etiquette("image de test n°115", taille=24)
        etiquette_a.move_to([X_A, Y_ETIQUETTES, 0])
        etiquette_b = self.etiquette("image de test n°668", taille=24)
        etiquette_b.move_to([X_B, Y_ETIQUETTES, 0])

        segment = Line(
            self._sur_segment(0.0),
            self._sur_segment(1.0),
            stroke_width=TRAIT_AXE,
            color=ENCRE,
        )
        pieds = VGroup(
            *[
                Line(
                    [x, Y_GRILLES - COTE / 2, 0],
                    [x, Y_SEGMENT, 0],
                    stroke_width=TRAIT_FILET,
                    color=GRIS_58,
                )
                for x in (X_A, X_B)
            ]
        )
        self.point = Dot(self._sur_segment(0.0), radius=0.11, color=BRIQUE)

        self.add(grille_a, grille_b, etiquette_a, etiquette_b, segment, pieds)
        self.add(self.point)

        # La grille du milieu et son fil : ils naissent avec le glissement, et
        # la première traversée les fait apparaître.
        self.grille_m = self._grille_a(self.x_a, [X_M, Y_MILIEU, 0])
        fil = Line(
            [X_M, Y_SEGMENT, 0],
            [X_M, Y_MILIEU + COTE / 2, 0],
            stroke_width=TRAIT_FILET,
            color=GRIS_58,
        )
        self.libelle_milieu = self.etiquette("leur milieu", taille=24)
        self.libelle_milieu.move_to([X_M, Y_LIBELLE_MILIEU, 0])

        ligne_lineaire = self.cote("linéaire : 4 · 4 · 4", taille=26)
        ligne_lineaire.move_to([X_M, Y_LIGNE_LINEAIRE, 0])
        ligne_relu = self.cote("ReLU : 4 · 4 · 9", taille=26)
        ligne_relu.move_to([X_M, Y_LIGNE_RELU, 0])

        # LE RÉSEAU ÉTEINT, D'ABORD. Sans cette seconde, le premier allumage
        # arrive sur un dessin que personne n'a eu le temps de lire, et il ne se
        # lit plus comme un changement puisqu'on n'a pas vu l'état d'avant.
        self.wait(0.9)

        self.next_section("Le segment, et la grille du milieu")
        self.play(FadeIn(self.grille_m), FadeIn(fil), run_time=0.5)

        self.next_section("La traversée, modèle linéaire")
        self._traversee(self.theta, self.activation, None, ligne_lineaire)

        self.next_section("La couche cachée s'insère")
        self.play(
            FadeOut(self.cadre_courant),
            FadeOut(self.grille_m),
            FadeOut(fil),
            self.point.animate.move_to(self._sur_segment(0.0)),
            *self._extinction(None),
            run_time=0.9,
        )
        self.play(
            FadeOut(self.faisceaux[0]),
            FadeIn(couche_relu),
            run_time=1.1,
        )

        self.next_section("La traversée, réseau à ReLU")
        self.grille_m = self._grille_a(self.x_a, [X_M, Y_MILIEU, 0])
        self.play(FadeIn(self.grille_m), FadeIn(fil), run_time=0.5)
        self._traversee(theta_relu, "relu", cachee, ligne_relu)
        self.wait(0.6)
