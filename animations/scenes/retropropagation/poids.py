"""
Chapitre 4 · page 5 · La correction d'un poids suit l'activation d'où il part.

Une scène. Quatre neurones cachés sont tirés de la couche — les trois plus
activés et le moins activé de ceux qui sont allumés — et reliés au neurone de
sortie de la classe 2. Chaque trait s'épaissit de la correction que son poids
reçoit, et le rapport des épaisseurs extrêmes est celui des activations : 228,6.

Les nombres viennent de `cours/lecon4/mesures.py`, mesure 3.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    LEFT,
    RIGHT,
    Circle,
    FadeIn,
    Line,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import ENCRE, GRIS_58, appliquer_style
from scenes.retropropagation.retro_mob import (
    CLASSE,
    RetroScene,
    mesures_du_chapitre,
    nombre,
)

appliquer_style()


ANIMATIONS = [
    {
        "id": "proportionnel-a-lactivation",
        "scene": "ProportionnelALactivation",
        "titre": "L'épaisseur suit l'activation, exactement",
        "notions": [
            "gradient des poids",
            "proportionnalité",
            "activation",
            "proposition 4",
        ],
        "alt": (
            "Le réseau pâlit. Quatre ronds apparaissent en colonne au centre "
            "droit du cadre, régulièrement espacés : ce sont quatre neurones "
            "cachés, tirés de la couche de cent vingt-huit. Les trois premiers "
            "sont remplis d'encre, de plus en plus pâle ; le quatrième est vide, "
            "son contour seul. À gauche de chacun s'inscrit son activation "
            "mesurée : un virgule cinq neuf zéro trois, un virgule quatre neuf "
            "huit un, un virgule trois neuf cinq zéro, et zéro virgule zéro "
            "zéro sept zéro. Le troisième rond de la colonne de sortie passe au "
            "trait de brique avec son étiquette. Quatre traits gris relient "
            "alors les quatre ronds à ce neurone, tous de la même finesse. Ils "
            "s'épaississent ensemble, chacun de la correction que son poids "
            "reçoit : le premier devient un ruban large, le deuxième et le "
            "troisième à peine moins, et le quatrième reste un cheveu qu'on "
            "distingue à peine du papier. Une valeur s'inscrit enfin à droite "
            "du neurone de sortie : moins zéro virgule sept cinq cinq quatre "
            "six un."
        ),
    },
]


class ProportionnelALactivation(RetroScene):
    """
    Quatre traits vers un neurone de sortie, épaissis en proportion des
    activations d'où ils partent.

    POURQUOI UN EXTRAIT, ET NON QUATRE RONDS DANS LA COLONNE. Les quatre rangs
    que la mesure 3 retient sont 92, 13, 61 et 62. Les deux derniers sont
    VOISINS : dans une colonne de 128 rangs étalée sur 5,4 unités, ils sont
    distants de quatre centièmes d'unité, et deux ronds posés là se
    recouvriraient entièrement. Les poser à leur ordonnée vraie était la
    première idée — c'est ce que fait `neurone_cache` ailleurs — et la
    géométrie l'interdit ici.

    L'EXTRAIT EST DONC ORDONNÉ PAR ACTIVATION, ET COTÉ. Chaque rond porte la
    valeur du neurone qu'il désigne, et son remplissage EST cette valeur : le
    quatrième est vide parce que son activation vaut sept millièmes. Ce qu'on
    ne fait pas, et que le module gelé interdit : remplir un rond d'une moyenne.

    LE RAPPORT DE 228,6 N'EST PAS ADOUCI. Le trait le plus fin vaut six
    centièmes d'épaisseur : il ne se voit pas, et c'est l'information. Un
    plancher d'épaisseur le rendrait visible et rendrait le rapport faux.
    """

    titre = "Les poids"
    montrer_grille = False

    #: L'extrait : quatre ronds, à une abscisse libre entre la colonne cachée
    #: et celle de sortie. L'écart de 1,2 unité laisse la place à une cote sous
    #: chaque rond sans qu'elle touche le rond du dessous.
    #:
    #: OÙ SE POSE LA COTE, ET POURQUOI IL A FALLU TROIS ESSAIS.
    #:
    #: AU-DESSUS du rond : elle tombe dans le trajet des quatre traits.
    #: DESSOUS : elle tombe dans le trajet du trait qui monte du rond SUIVANT.
    #: C'était l'erreur de la deuxième version — le raisonnement ne regardait
    #: que le trait du rond coté, et la bande sous un rond appartient à son
    #: voisin du dessous.
    #: À GAUCHE : libre, à condition que l'extrait soit assez à droite.
    #:
    #: L'ABSCISSE EST ALORS BORNÉE DES DEUX CÔTÉS, et les deux bornes sont
    #: mesurées. La cote la plus large, « 0,0070 », fait 1,25 unité — et non
    #: 0,94 comme une estimation au caractère le donnait. Son bord gauche tombe
    #: à `X_EXTRAIT − 1,65` et doit rester à droite de la colonne cachée, qui
    #: s'arrête à −0,265 : d'où `X_EXTRAIT > 1,385`. Son bord droit tombe à
    #: `X_EXTRAIT − 0,40` et doit rester à gauche du départ des traits, à
    #: `X_EXTRAIT + 0,098` : toujours vrai. À 1,60, il reste 0,21 unité de jeu
    #: à gauche et 0,50 à droite.
    X_EXTRAIT = 1.60
    ECART = 1.20
    RAYON = 0.24

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()

        # mesure 3, « Proportionnalité à l'activation » : `mesures.py:298-310`.
        # Les quatre rangs sont ceux que la mesure retient, recalculés par
        # `mesures_du_chapitre`, et rangés par activation décroissante.
        quatre = m["quatre"]
        a1 = m["cache"]["a1"]
        corrections = np.array([m["grads"]["W2"][CLASSE, j] for j in quatre])
        activations = np.array([a1[j] for j in quatre])

        # Le réseau porte ses activations, puis passe au décor.
        self.cachee.ronds.become(self.cachee.allumer(a1))
        self.sortie.ronds.become(self.sortie.allumer(m["a2"]))
        self.wait(0.3)
        self.play(*self.animations_effacement(), run_time=1.0)

        # L'extrait. Le remplissage d'un rond EST l'activation de son neurone,
        # normalisée par la plus forte des 128 — la même normalisation que la
        # colonne dont ils sortent.
        maximum = float(np.max(a1))
        haut = (len(quatre) - 1) * self.ECART / 2.0
        ronds = VGroup()
        cotes = VGroup()
        for rang, (j, valeur) in enumerate(zip(quatre, activations)):
            rond = Circle(radius=self.RAYON, stroke_width=1.4,
                          stroke_color=GRIS_58)
            rond.set_fill(ENCRE, opacity=min(1.0, float(valeur) / maximum))
            rond.move_to([self.X_EXTRAIT, haut - rang * self.ECART, 0])
            ronds.add(rond)

            # La cote se pose à GAUCHE : c'est le seul côté qu'aucun trait
            # ne traverse. Voir `X_EXTRAIT` pour les deux bornes mesurées.
            cote = self.cote(nombre(float(valeur)))
            cote.next_to(rond, LEFT, buff=0.16)
            cotes.add(cote)

        self.play(FadeIn(ronds), Write(cotes, lag_ratio=0.2), run_time=1.4)
        self.wait(0.4)

        # Le neurone qui reçoit. Aucune boîte : c'est son trait qui change.
        rond_sortie = self.sortie.rond_du_rang(CLASSE)
        self.play(*self.designer_sortie(CLASSE), run_time=0.7)
        self.wait(0.3)

        # Les quatre traits, d'abord tous de la même finesse : à cet instant
        # rien ne distingue les quatre poids, et c'est le point de départ.
        traits = VGroup()
        for rond in ronds:
            traits.add(
                Line(
                    rond.get_center(),
                    rond_sortie.get_center(),
                    buff=max(rond.width, rond_sortie.width) / 2,
                    stroke_width=1.0,
                    color=GRIS_58,
                )
            )
        self.play(FadeIn(traits), run_time=0.8)
        self.wait(0.5)

        # Puis chacun prend l'épaisseur de la correction que SON poids reçoit.
        self.play(
            Transform(traits, self.epaissir(traits, corrections)),
            run_time=1.8,
        )
        self.wait(0.8)

        # Le quotient, commun aux quatre : c'est δ₂, et c'est la proposition 4.
        quotient = float(corrections[0] / activations[0])
        cote_quotient = self.cote(nombre(quotient, decimales=6))
        cote_quotient.next_to(self.etiquettes_sortie[CLASSE], RIGHT, buff=0.26)
        self.play(Write(cote_quotient), run_time=0.8)
        self.wait(2.0)

        # Les deux contrôles que la page annonce, sur les nombres : le quotient
        # est le même pour les quatre, et le rapport des extrêmes vaut 228,6.
        quotients = corrections / activations
        assert np.allclose(quotients, quotients[0], rtol=0, atol=1e-12), (
            "le quotient correction sur activation n'est plus constant : "
            f"{quotients}. La scène montre quatre épaisseurs proportionnelles, "
            "et la proportionnalité est fausse."
        )
        rapport = float(activations[0] / activations[-1])
        assert abs(rapport - 228.6) < 0.1, (
            f"le rapport des activations extrêmes vaut {rapport:.1f} et la "
            "page 5 en annonce 228,6."
        )
