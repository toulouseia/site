"""
Chapitre 4 · page 9 · La porte ReLU, sur les cent vingt-huit demandes.

Une scène. Le vecteur des demandes qui arrive sur la couche cachée a cent
vingt-huit composantes, toutes non nulles. La porte ReLU en laisse passer 57 —
celles des neurones allumés — et en annule 71. Les 57 qui passent gardent
exactement la longueur qu'elles avaient : la porte ne raccourcit rien, elle
coupe ou elle laisse.

Les nombres viennent de `cours/lecon4/mesures.py`, mesures 1 et 8.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    RIGHT,
    UP,
    FadeIn,
    Transform,
    Write,
)

from scenes.n7ia import appliquer_style
from scenes.retropropagation.retro_mob import (
    Barres,
    RetroScene,
    mesures_du_chapitre,
)

appliquer_style()


ANIMATIONS = [
    {
        "id": "la-porte-relu-ne-laisse-rien-passer",
        "scene": "LaPorteReluNeLaisseRienPasser",
        "titre": "Cinquante-sept passent, soixante et onze sont coupées",
        "notions": [
            "ReLU",
            "dérivée de la ReLU",
            "signal d'erreur",
            "couche cachée",
        ],
        "alt": (
            "Le réseau pâlit et rend ses cotes. Une ligne horizontale se trace "
            "au milieu du cadre, et cent vingt-huit barres très fines y "
            "poussent, une par neurone caché : un peigne serré, moitié "
            "au-dessus de la ligne, moitié en dessous, d'inégales longueurs, et "
            "pas une seule n'est nulle. Une cote de brique donne leur nombre : "
            "cent vingt-huit. Les barres des neurones allumés passent alors au "
            "brique, les autres restent à l'encre. Toutes les barres d'encre "
            "s'écrasent d'un coup sur la ligne et disparaissent, pendant que "
            "les barres de brique ne bougent pas : aucune ne se raccourcit, "
            "aucune ne change de sens. Le peigne est devenu clairsemé. Deux "
            "cotes s'inscrivent de part et d'autre de la ligne : cinquante-"
            "sept pour ce qui passe, soixante et onze pour ce qui est coupé."
        ),
    },
]


class LaPorteReluNeLaisseRienPasser(RetroScene):
    """
    Les 128 demandes avant et après la porte, sur la même échelle.

    L'ÉCHELLE EST LA MÊME AVANT ET APRÈS, et c'est tout l'argument. Si les
    barres qui passent étaient remises à l'échelle de ce qui reste, elles
    grandiraient, et la scène dirait le contraire de ce qu'elle doit dire. Les
    barres gardées ne bougent pas d'un pixel : `Barres.coupees` construit la
    cible en n'écrasant QUE les coupées, à partir des mêmes rectangles.

    ÉCRASER PLUTÔT QU'EFFACER. Une barre qui disparaît en fondu laisse croire
    qu'elle est allée ailleurs. Une barre qui s'écrase sur la ligne montre ce
    que la porte fait : elle la met à zéro, sur place.

    LA LARGEUR EST LE MINIMUM MESURÉ. Cent vingt-huit barres sur dix unités
    donnent un pas de 0,078 unité ; le jeu en retire un cinquième, et la barre
    fait 0,0625 unité, soit 8,4 pixels à 1080p. Sous cela, ce n'est plus un
    peigne, c'est un aplat — et c'est pourquoi cette scène a besoin de toute la
    largeur du cadre, donc de `degager()`.
    """

    titre = "La porte"
    montrer_grille = False

    Y_ZERO = -0.30
    HAUTEUR = 2.55

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()

        # mesure 3, la demande reçue par chaque neurone caché AVANT la porte :
        # c'est (W²)ᵀ δ², que `mesures.arriere` nomme `grad_a1`
        # (`mesures.py:133`). Et après la porte, `delta1` (`mesures.py:134`).
        avant_la_porte = np.asarray(m["grads"]["grad_a1"], dtype=float)
        apres_la_porte = np.asarray(m["grads"]["delta1"], dtype=float)
        allumes = np.asarray(m["cache"]["z1"], dtype=float) > 0.0

        self.cachee.ronds.become(self.cachee.allumer(m["cache"]["a1"]))
        self.wait(0.3)

        # Le réseau rend ses cotes AVANT que la ligne de zéro arrive : elle
        # passe à −0,30 et le « ⋮ » de la colonne cachée est à −0,20. Les jouer
        # ensemble laisse le « ⋮ » à demi visible sous la ligne.
        self.play(*self.degager(), run_time=1.2)
        self.wait(0.2)

        barres = Barres(avant_la_porte, largeur=10.0, hauteur=self.HAUTEUR)
        barres.shift(UP * self.Y_ZERO)
        plates = barres.a_zero()

        self.add(plates)
        self.play(
            FadeIn(barres.ligne),
            Transform(plates, barres.barres),
            run_time=1.6,
        )
        self.remove(plates)
        self.add(barres.barres)

        # mesure 1, « La couche cachée » : `mesures.py:176-178`.
        cote_toutes = self.cote(str(avant_la_porte.size))
        cote_toutes.next_to(barres.ligne, RIGHT, buff=0.22)
        self.play(Write(cote_toutes), run_time=0.6)
        self.wait(1.0)

        # Ce qui va passer se désigne AVANT que la porte agisse : sans cela, le
        # spectateur ne voit qu'une disparition, et ne sait pas ce qui l'a
        # décidée.
        passantes = [k for k in range(avant_la_porte.size) if allumes[k]]
        self.play(
            Transform(barres.barres, barres.teindre(passantes)),
            run_time=1.0,
        )
        self.wait(0.8)

        # La porte. Les coupées s'écrasent, les passantes ne bougent pas.
        self.play(
            Transform(barres.barres, barres.coupees(allumes)),
            run_time=1.4,
        )
        self.wait(0.5)

        # Les deux comptes, de part et d'autre de la ligne : ce qui passe
        # au-dessus, ce qui est coupé en dessous.
        cote_passent = self.cote(str(int(allumes.sum())))
        cote_passent.next_to(barres.ligne, RIGHT, buff=0.22)
        cote_passent.shift(UP * 0.34)
        cote_coupees = self.etiquette(str(int((~allumes).sum())))
        cote_coupees.next_to(barres.ligne, RIGHT, buff=0.22)
        cote_coupees.shift(DOWN * 0.34)

        self.play(
            Transform(cote_toutes, cote_passent),
            FadeIn(cote_coupees),
            run_time=0.9,
        )
        self.wait(2.2)

        # Les trois contrôles que la page 9 annonce.
        assert np.all(avant_la_porte != 0.0), (
            "une demande est nulle avant la porte : la page 9 dit que les 128 "
            "composantes de (W²)ᵀδ² sont toutes non nulles."
        )
        assert np.array_equal(apres_la_porte[allumes], avant_la_porte[allumes]), (
            "les demandes qui passent ont changé de valeur : la scène montre "
            "des barres qui ne bougent pas, et elles bougent."
        )
        assert np.all(apres_la_porte[~allumes] == 0.0), (
            "une demande coupée n'est pas exactement nulle."
        )
        assert int(allumes.sum()) == m["allumes"], (
            f"la scène compte {int(allumes.sum())} passantes et la mesure 1 en "
            f"annonce {m['allumes']}."
        )
