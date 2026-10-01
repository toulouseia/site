"""
Optimisation, la descente de gradient en deux dimensions.

Rattachée à la leçon `la-descente-de-gradient-en-deux-dimensions` du cours
`introduction-au-machine-learning`.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier :
le manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.
C'est ce qui permet à l'application d'afficher « animation à rendre » sur une
machine où personne n'a Python.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Arrow,
    Axes,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    ImplicitFunction,
    Line,
    MathTex,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    FILET_FORT,
    GRIS_40,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_COURBE,
    TRAIT_FILET,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "descente-gradient-2d",
        "scene": "DescenteGradient2D",
        "titre": "La descente de gradient, vue de dessus",
        "duree": 34,
        "alt": (
            "Une surface en cuvette est représentée par ses lignes de niveau, "
            "des ellipses concentriques allongées horizontalement. Un point part "
            "en haut à gauche. À chaque étape, une flèche de brique montre le "
            "gradient, toujours perpendiculaire à la ligne de niveau qu'il "
            "traverse, et le point avance dans la direction opposée. La "
            "trajectoire zigzague d'abord d'un flanc à l'autre de la vallée, "
            "parce que la pente est beaucoup plus raide en travers qu'en long, "
            "puis s'aligne sur le fond et ralentit : les flèches raccourcissent "
            "à mesure que la pente s'aplatit. Le point s'immobilise au centre, "
            "où le gradient est nul."
        ),
        "notions": [
            "descente de gradient",
            "lignes de niveau",
            "taux d'apprentissage",
            "optimisation",
        ],
    }
]

# La surface : f(x, y) = x²/2 + 3y². Allongée exprès : c'est l'allongement qui
# produit le zigzag, et le zigzag est ce que la leçon veut faire voir.
A, B = 0.5, 3.0
DEPART = (-3.4, 1.15)
# Le facteur d'alternance sur y vaut 1 - 2*B*PAS. A 0,13 il vaut +0,220 :
# la coordonnee decroit sans changer de signe, et le zigzag annonce par la
# legende ne se produit jamais. A 0,28 il vaut -0,680, la trajectoire alterne
# vraiment d'un flanc a l'autre, et x arrive a 0,005 du minimum en 20 pas.
PAS = 0.28
ITERATIONS = 20


def gradient(x: float, y: float) -> tuple[float, float]:
    return (2 * A * x, 2 * B * y)


def trajectoire() -> list[tuple[float, float]]:
    points = [DEPART]
    x, y = DEPART
    for _ in range(ITERATIONS):
        gx, gy = gradient(x, y)
        x, y = x - PAS * gx, y - PAS * gy
        points.append((x, y))
    return points


class DescenteGradient2D(SceneN7):
    titre = "Descente de gradient"

    def construct(self) -> None:
        self.poser_titre()

        # Les repères de chapitre. Ils ne changent rien au rendu ; ils marquent
        # les moments auxquels le lecteur pourra sauter le jour où le pipeline
        # extraira les sections de Manim. Trois lignes maintenant, une
        # réécriture complète de la scène six mois plus tard.
        self.next_section("Les lignes de niveau")

        axes = Axes(
            x_range=[-4.5, 4.5, 1],
            y_range=[-2.2, 2.2, 1],
            x_length=11,
            y_length=5.4,
            axis_config={
                "color": ENCRE,
                "stroke_width": TRAIT_AXE,
                "include_ticks": True,
                "tick_size": 0.06,
            },
            tips=False,
        ).shift(DOWN * 0.35)
        self.play(Create(axes), run_time=1.0)

        # Les lignes de niveau : f = k. On les dessine du plus large au plus
        # serré, comme une carte se lit.
        niveaux = [6.6, 4.2, 2.4, 1.1, 0.35]
        courbes = VGroup(
            *[
                ImplicitFunction(
                    lambda x, y, k=k: A * x**2 + B * y**2 - k,
                    x_range=[-4.4, 4.4],
                    y_range=[-2.1, 2.1],
                    color=FILET_FORT,
                    stroke_width=TRAIT_FILET,
                ).move_to(axes.c2p(0, 0))
                for k in niveaux
            ]
        )
        self.play(Create(courbes, lag_ratio=0.25), run_time=2.2)

        # Le minimum, coté comme dans le film : deux traits croisés en brique.
        centre = axes.c2p(0, 0)
        croix = VGroup(
            Line(centre + LEFT * 0.16, centre + RIGHT * 0.16,
                 color=BRIQUE, stroke_width=TRAIT_COTE),
            Line(centre + DOWN * 0.16, centre + UP * 0.16,
                 color=BRIQUE, stroke_width=TRAIT_COTE),
        )
        # Le libelle se pose en biais, loin de la croix et hors de l'axe : colle
        # dessous, il recouvrait le signe qu'il nomme.
        legende_min = self.cote("minimum").next_to(croix, UP + RIGHT, buff=0.42)
        self.play(Create(croix), FadeIn(legende_min), run_time=0.6)

        # La règle de mise à jour, posée une fois, en haut à droite.
        regle = MathTex(
            r"\theta_{t+1} = \theta_t - \eta\,\operatorname{grad} f(\theta_t)",
            color=ENCRE,
            font_size=34,
        ).to_corner(UP + RIGHT, buff=0.55)
        self.play(Write(regle), run_time=1.0)

        # La descente.
        self.next_section("Le zigzag")
        chemin = trajectoire()
        point = Dot(axes.c2p(*chemin[0]), color=ENCRE, radius=0.06)
        self.play(FadeIn(point), run_time=0.4)

        traces = VGroup()
        for i in range(len(chemin) - 1):
            x, y = chemin[i]
            gx, gy = gradient(x, y)

            # La flèche du gradient : elle montre la montée, on va à l'inverse.
            depart = axes.c2p(x, y)
            # La fleche montre une DIRECTION : on la borne a une longueur fixe,
            # sinon le premier gradient, de norme 7,7, sort du cadre par le haut
            # et traverse le bandeau de titre.
            n = (gx * gx + gy * gy) ** 0.5 or 1.0
            ech = min(0.28, 0.9 / n)
            arrivee = axes.c2p(x + ech * gx, y + ech * gy)
            fleche = Arrow(
                depart,
                arrivee,
                buff=0,
                color=BRIQUE,
                stroke_width=TRAIT_COTE,
                max_tip_length_to_length_ratio=0.28,
            )

            suivant = axes.c2p(*chemin[i + 1])
            segment = Line(
                depart, suivant, color=ENCRE, stroke_width=TRAIT_COURBE
            )

            vite = 0.55 if i < 4 else 0.32
            self.play(Create(fleche), run_time=vite * 0.5)
            self.play(
                Create(segment),
                point.animate.move_to(suivant),
                run_time=vite,
            )
            self.play(FadeOut(fleche), run_time=vite * 0.3)
            traces.add(segment)

        self.next_section("La convergence")
        # La cote descend SOUS le point, et sous TOUTE la famille d'ellipses :
        # posee a un demi-cran du point elle tombait en plein dans les lignes de
        # niveau, gris sur gris, et en traversait trois. La plus large descend a
        # y = -1,48 ; on se pose a -1,85, en dehors.
        arret = self.etiquette("le gradient s'annule", taille=20, couleur=GRIS_40)
        arret.move_to(axes.c2p(1.9, -1.85))
        # Le filet part du coin HAUT gauche : la cote est passee sous le point.
        pointeur = Line(
            arret.get_corner(UP + LEFT),
            point.get_center(),
            color=GRIS_40,
            stroke_width=TRAIT_FILET,
        )
        self.play(FadeIn(arret), Create(pointeur), run_time=0.7)
        self.wait(2.0)
