"""
Statistiques, la variance comme une aire.

Écrite pour un cours de statistiques qui n'existe pas encore au catalogue.
Elle reste ici parce qu'elle prouve que le pipeline rend deux sujets et pas un ;
son identifiant `variance-comme-distance` n'est cité par aucune leçon.

L'idée pédagogique tient en une image : l'écart à la moyenne devient le côté
d'un carré, la variance est l'aire moyenne de ces carrés, et l'écart-type est
le côté du carré moyen. Une fois qu'on a vu ça, la formule ne s'apprend plus
par cœur, elle se relit.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    DashedLine,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    NumberLine,
    Square,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    FILET_FORT,
    GRIS_40,
    GRIS_58,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "variance-comme-distance",
        "scene": "VarianceCommeDistance",
        "titre": "La variance, vue comme une aire",
        "duree": 28,
        "alt": (
            "Huit observations sont posées sur un axe horizontal gradué. Un "
            "trait vertical marque leur moyenne. Pour chaque observation, un "
            "segment de brique relie le point à la moyenne : c'est son écart. "
            "Chaque segment se déplie ensuite en un carré dont il est le côté, "
            "de sorte qu'une observation deux fois plus loin produit un carré "
            "quatre fois plus grand. Les huit carrés se rassemblent et se "
            "fondent en un seul carré de même aire moyenne : c'est la variance. "
            "Le côté de ce carré final est mis en évidence : c'est l'écart-type, "
            "et il se mesure sur le même axe que les données de départ."
        ),
        "notions": ["variance", "écart-type", "dispersion", "statistiques"],
    }
]

DONNEES = [2, 4, 4, 4, 5, 5, 7, 9]


class VarianceCommeDistance(SceneN7):
    titre = "Variance et écart-type"

    def construct(self) -> None:
        self.poser_titre()
        # Les repères de chapitre : ils ne changent rien au rendu, ils
        # marquent les moments auxquels le lecteur pourra sauter.
        self.next_section("Les observations et leur moyenne")

        moyenne = sum(DONNEES) / len(DONNEES)
        variance = sum((x - moyenne) ** 2 for x in DONNEES) / len(DONNEES)
        ecart = variance**0.5

        axe = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            color=ENCRE,
            stroke_width=TRAIT_AXE,
            include_numbers=True,
            font_size=24,
        ).shift(UP * 1.9)
        self.play(Create(axe), run_time=1.0)

        # Les observations : des carrés pleins de 6 px, comme le nuage de
        # points des graphiques de l'application.
        points = VGroup(
            *[
                Square(side_length=0.13, color=ENCRE, fill_color=ENCRE,
                       fill_opacity=1, stroke_width=0).move_to(axe.n2p(x))
                for x in DONNEES
            ]
        )
        self.play(FadeIn(points, lag_ratio=0.12), run_time=1.2)

        # La moyenne : un trait, et sa cote.
        trait_moyenne = DashedLine(
            axe.n2p(moyenne) + UP * 0.42,
            axe.n2p(moyenne) + DOWN * 3.1,
            color=GRIS_40,
            stroke_width=TRAIT_FILET,
            dash_length=0.09,
        )
        cote_moyenne = self.cote(f"moyenne = {moyenne:.2f}".replace(".", ","))
        cote_moyenne.next_to(trait_moyenne, UP, buff=0.14)
        self.play(Create(trait_moyenne), Write(cote_moyenne), run_time=1.0)

        self.next_section("Les écarts")
        # Les écarts, un par un.
        echelle = (axe.n2p(1)[0] - axe.n2p(0)[0])
        ecarts = VGroup()
        for x in DONNEES:
            segment = Line(
                axe.n2p(x),
                axe.n2p(moyenne),
                color=BRIQUE,
                stroke_width=TRAIT_COTE,
            )
            ecarts.add(segment)
        self.play(Create(ecarts, lag_ratio=0.15), run_time=1.6)

        libelle_ecart = self.etiquette(
            "chaque écart à la moyenne", taille=22, couleur=GRIS_58
        ).next_to(axe, DOWN, buff=0.5)
        self.play(FadeIn(libelle_ecart), run_time=0.5)
        self.wait(0.8)
        self.play(FadeOut(libelle_ecart), run_time=0.4)

        self.next_section("Chaque écart devient un carré")
        # Chaque écart devient le côté d'un carré. C'est le cœur de la scène :
        # l'élévation au carré cesse d'être une opération et devient une aire.
        carres = VGroup()
        for i, x in enumerate(DONNEES):
            cote = abs(x - moyenne) * echelle
            carre = Square(
                side_length=max(cote, 0.02),
                color=BRIQUE,
                stroke_width=TRAIT_FILET,
                fill_color=BRIQUE,
                fill_opacity=0.16,
            )
            carre.move_to(
                axe.n2p(min(x, moyenne)) + DOWN * (max(cote, 0.02) / 2 + 0.55)
                + RIGHT * (cote / 2)
            )
            carres.add(carre)

        self.play(
            *[Transform(ecarts[i].copy(), carres[i]) for i in range(len(DONNEES))],
            FadeIn(carres, lag_ratio=0.1),
            run_time=2.0,
        )

        libelle_carre = self.etiquette(
            "un écart deux fois plus grand : un carré quatre fois plus grand",
            taille=20,
            couleur=GRIS_58,
        ).next_to(carres, DOWN, buff=0.4)
        self.play(FadeIn(libelle_carre), run_time=0.5)
        self.wait(1.4)
        self.play(FadeOut(libelle_carre), run_time=0.4)

        self.next_section("L'écart-type")
        # Les huit carrés se fondent en un seul, de même aire moyenne.
        cote_moyen = (variance**0.5) * echelle
        carre_moyen = Square(
            side_length=cote_moyen,
            color=ENCRE,
            stroke_width=TRAIT_COTE,
            fill_color=BRIQUE,
            fill_opacity=0.16,
        ).move_to(axe.n2p(moyenne) + DOWN * (cote_moyen / 2 + 0.9))

        self.play(
            Transform(carres, VGroup(*[carre_moyen.copy() for _ in DONNEES])),
            run_time=1.6,
        )
        self.play(FadeOut(carres), FadeIn(carre_moyen), run_time=0.5)

        # Les deux formules, et la cote du côté.
        cote_bas = Line(
            carre_moyen.get_corner(DOWN + LEFT) + DOWN * 0.16,
            carre_moyen.get_corner(DOWN + RIGHT) + DOWN * 0.16,
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
        )
        serif_g = Line(
            cote_bas.get_start() + UP * 0.08,
            cote_bas.get_start() + DOWN * 0.08,
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
        )
        serif_d = Line(
            cote_bas.get_end() + UP * 0.08,
            cote_bas.get_end() + DOWN * 0.08,
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
        )
        libelle_sigma = self.cote(f"σ = {ecart:.2f}".replace(".", ","))
        libelle_sigma.next_to(cote_bas, DOWN, buff=0.14)

        self.play(
            Create(VGroup(cote_bas, serif_g, serif_d)),
            Write(libelle_sigma),
            run_time=1.0,
        )

        formules = VGroup(
            MathTex(
                r"\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2",
                color=ENCRE,
                font_size=34,
            ),
            MathTex(r"\sigma = \sqrt{\sigma^2}", color=ENCRE, font_size=34),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        formules.to_edge(RIGHT, buff=0.8).shift(DOWN * 0.6)

        filet = Line(
            formules.get_corner(UP + LEFT) + UP * 0.25 + LEFT * 0.3,
            formules.get_corner(UP + RIGHT) + UP * 0.25,
            color=FILET_FORT,
            stroke_width=TRAIT_FILET,
        )
        self.play(Create(filet), Write(formules), run_time=1.8)
        self.wait(2.2)
