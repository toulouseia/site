"""
Panorama du machine learning : la perte qui note thêta.

Rattachée au cours `introduction-au-machine-learning`.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier :
le manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.
C'est ce qui permet à l'application d'afficher « animation à rendre » sur une
machine où personne n'a Python.

La scène ne montre QUE ce que la leçon démontre, et avec les mêmes nombres.
Une animation qui montrerait d'autres chiffres que le texte serait pire
qu'absente.

CE QUI A ÉTÉ RETIRÉ le 31 août 2026. « descente-une-variable » rejouait la
table de la section 5 ; la descente de gradient occupe désormais douze pages
au chapitre 3.

CE QUI A ÉTÉ RETIRÉ le 17 septembre 2026. « le-renversement » n'était plus
servi par aucune page depuis le resserrement du 8 septembre, et la figure fixe
`l1-fig15-le-renversement` dit la même chose dans la page 1.

CE QUE LA PASSE DU 17 SEPTEMBRE A CHANGÉ ICI. Le tracé occupait 4,6 unités de
haut, mais il partageait le cadre avec une bande de deux libellés — « 50 m² ·
200 k€ » — qui répétait ce que des graduations disent mieux. Les graduations
sont désormais écrites, la bande est partie, et le tracé monte à 4,9 unités,
soit 78 % de la hauteur que le bandeau laisse. Il ne reste à l'écran que des
étiquettes : un symbole, une valeur.
"""

from manim import (  # type: ignore[import-not-found]
    LEFT,
    RIGHT,
    UP,
    DOWN,
    Axes,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    VGroup,
    ValueTracker,
    Write,
    always_redraw,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_75,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_COURBE,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "la-perte-note-theta",
        "scene": "LaPerteNoteTheta",
        "titre": "La perte note chaque jeu de paramètres",
        "duree": 22,
        "alt": (
            "Un plan porte la surface en mètres carrés en abscisse, graduée "
            "de vingt à soixante, et le prix en milliers d'euros en "
            "ordonnée, gradué de cent dix à cent quatre-vingt-dix. Deux "
            "ventes y sont posées : cinquante mètres carrés vendus deux "
            "cents, et trente mètres carrés vendus cent quinze. Une droite "
            "les traverse, et le biais b varie de cinq à quarante : la "
            "droite balaie tout le cadre, les deux écarts verticaux tracés "
            "en brique se referment puis se rouvrent, et un compteur donne "
            "la perte moyenne, trois cent soixante-deux virgule cinquante "
            "au départ, cinquante-six virgule vingt-cinq au plus bas, puis "
            "elle remonte. Les deux candidats sont ensuite cotés l'un après "
            "l'autre : thêta A, où b vaut vingt, passe sous le premier point "
            "et au-dessus du second, avec des écarts de dix et de cinq et "
            "une perte moyenne de soixante-deux virgule cinq ; thêta B, où b "
            "vaut vingt-deux virgule cinq, a deux écarts égaux de sept "
            "virgule cinq et une perte moyenne de cinquante-six virgule "
            "vingt-cinq. Les deux notes se lisent côte à côte, et la plus "
            "petite des deux est celle de thêta B."
        ),
        "notions": [
            "fonction de perte",
            "erreur quadratique",
            "paramètres",
        ],
        "ce qui change dans le temps": (
            "Le biais b, de 5 à 40, et avec lui la perte au compteur : 362,50 "
            "au départ, 56,25 au plus bas, puis elle REMONTE. C'est la remontée "
            "qui apprend quelque chose — elle montre qu'il existe un minimum, "
            "et qu'on vient de le dépasser."
        ),
    },
]


# ── Les données de la leçon, et rien d'autre ────────────────────────────────

APPARTS = [(50.0, 200.0), (30.0, 115.0)]
W1, W2 = 3.0, 10.0
PIECES = {50.0: 2.0, 30.0: 1.0}


def _prix(surface: float, b: float) -> float:
    return W1 * surface + W2 * PIECES[surface] + b


def _perte_de(b: float) -> float:
    """La perte moyenne pour un biais donne, sur les deux ventes du fil."""
    return sum((_prix(s, b) - y) ** 2 for s, y in APPARTS) / len(APPARTS)


# La table de la leçon, recalculée. Si elle tombe, c'est la leçon ou la scène
# qui a bougé, et il vaut mieux que le rendu échoue que de mentir en silence.
assert abs(_prix(50.0, 20.0) - 190.0) < 1e-9
assert abs(_prix(30.0, 20.0) - 120.0) < 1e-9
assert abs(_perte_de(20.0) - 62.5) < 1e-9
assert abs(_perte_de(22.5) - 56.25) < 1e-9
assert abs(_perte_de(5.0) - 362.5) < 1e-9


# ── La géométrie ────────────────────────────────────────────────────────────
#
# LE TRACÉ EST LE SUJET : 4,9 unités de haut sur les 6,3 que le bandeau laisse,
# soit 78 %. La colonne de droite, de 2,35 à 6,6, ne porte que des cotes — le
# biais, la perte, le nom du candidat — et la droite du modèle est coupée au
# cadre des axes : elle ne sort jamais du tracé, et n'entre jamais dans la
# colonne.

X_AXES, Y_AXES = -2.10, -0.35
L_AXES, H_AXES = 7.0, 4.90
X_COTES = 2.35

PRIX_BAS, PRIX_HAUT = 90.0, 230.0
SURF_GAUCHE, SURF_DROITE = 11.0, 59.0


class LaPerteNoteTheta(SceneN7):
    titre = "La perte note θ"

    def construct(self) -> None:
        self.poser_titre(taille=24)
        self.next_section("Les deux ventes")

        axes = Axes(
            x_range=[10, 60, 10],
            y_range=[90, 230, 20],
            x_length=L_AXES,
            y_length=H_AXES,
            axis_config={
                "color": ENCRE,
                "stroke_width": TRAIT_AXE,
                "include_ticks": True,
                "tick_size": 0.07,
                "font_size": 30,
                "decimal_number_config": {"num_decimal_places": 0},
            },
            x_axis_config={"numbers_to_include": [20, 30, 40, 50, 60]},
            y_axis_config={"numbers_to_include": [110, 150, 190]},
            tips=False,
        ).move_to([X_AXES, Y_AXES, 0])

        # LES NOMS D'AXE SONT DES SYMBOLES, plus des phrases. « surface (m²) »
        # et « prix (k€) » occupaient deux lignes de texte courant au bord du
        # tracé ; x indice 1 et y sont les noms que la page 3 leur donne, et
        # l'unité tient en trois signes.
        # L'EURO N'EST PAS DANS LE TEMPLATE LATEX de Manim : ni inputenc ni
        # textcomp n'y sont chargés, et « € » dans un MathTex fait échouer la
        # compilation. Le symbole vient donc de LaTeX, l'unité de Pango.
        nom_x = VGroup(
            MathTex(r"x_1", color=ENCRE_75, font_size=34),
            self.etiquette("(m²)", taille=28, couleur=ENCRE_75),
        ).arrange(RIGHT, buff=0.16)
        # LE NOM D'AXE SE POSE HORS DU TRACE. `x_axis.get_end()` designe la
        # BOITE de l'axe, graduations comprises, et non le trait : pose a sa
        # droite, le nom tombait sur le trait lui-meme. Il se range donc apres
        # la derniere graduation, a la hauteur des chiffres.
        nom_x.move_to([2.05, -3.12, 0], aligned_edge=LEFT)
        nom_y = VGroup(
            MathTex(r"y", color=ENCRE_75, font_size=34),
            self.etiquette("(k€)", taille=28, couleur=ENCRE_75),
        ).arrange(RIGHT, buff=0.16)
        nom_y.next_to(axes.c2p(10, 230), UP, buff=0.24).shift(RIGHT * 0.40)
        self.play(Create(axes), FadeIn(nom_x), FadeIn(nom_y), run_time=1.0)

        points = VGroup(
            *[Dot(axes.c2p(s, p), color=ENCRE, radius=0.085) for s, p in APPARTS]
        )
        self.play(FadeIn(points), run_time=0.5)

        formule = MathTex(
            r"\hat{y} = 3\,x_1 + 10\,x_2 + b", color=ENCRE, font_size=32
        )
        formule.move_to([X_COTES, 2.25, 0], aligned_edge=LEFT)
        self.play(Write(formule), run_time=0.9)

        # ── Le balayage ─────────────────────────────────────────────────────
        #
        # Deux droites séparées de 2,5 sur un axe qui va de 90 à 230, cela fait
        # 2 % de la hauteur : à l'écran, rien ne bouge. On fait donc PARCOURIR à
        # b tout l'intervalle utile, de 5 à 40. La droite traverse alors un quart
        # du cadre, les deux écarts se referment puis se rouvrent, et le
        # compteur de perte descend de 362,50 à 56,25 avant de remonter.
        self.next_section("Le balayage")

        b = ValueTracker(5.0)

        def droite_de(b_val: float) -> Line:
            """La part de la droite qui tombe DANS le cadre des axes.

            Sans cette coupe, au début du balayage son extrémité gauche
            descend à 48 k€, loin sous le plancher de l'axe, et la droite sort
            par le bas de l'image pendant deux secondes et demie.
            """
            bout_g = W1 * SURF_GAUCHE + W2 * 1 + b_val
            bout_d = W1 * SURF_DROITE + W2 * 2 + b_val
            pente = (bout_d - bout_g) / (SURF_DROITE - SURF_GAUCHE)

            def surface_au_prix(prix: float) -> float:
                brute = SURF_GAUCHE + (prix - bout_g) / pente
                return max(SURF_GAUCHE, min(SURF_DROITE, brute))

            s0 = surface_au_prix(PRIX_BAS)
            s1 = surface_au_prix(PRIX_HAUT)
            return Line(
                axes.c2p(s0, bout_g + pente * (s0 - SURF_GAUCHE)),
                axes.c2p(s1, bout_g + pente * (s1 - SURF_GAUCHE)),
                color=ENCRE,
                stroke_width=TRAIT_COURBE,
            )

        def ecarts_de(b_val: float) -> VGroup:
            g = VGroup()
            for s, y in APPARTS:
                yh = _prix(s, b_val)
                g.add(
                    Line(
                        axes.c2p(s, y), axes.c2p(s, yh),
                        color=BRIQUE, stroke_width=TRAIT_COTE,
                    )
                )
            return g

        ligne = always_redraw(lambda: droite_de(b.get_value()))
        traits = always_redraw(lambda: ecarts_de(b.get_value()))

        # LES DEUX COMPTEURS SONT EN PANGO, PAS EN LATEX. Reconstruits à chaque
        # image par always_redraw, un MathTex fait tourner une compilation LaTeX
        # par image et par compteur : le balayage prenait cinq secondes de calcul
        # PAR IMAGE. Le symbole ℒ, lui, est écrit une fois en MathTex et ne bouge
        # plus ; seul le nombre se refait.
        nom_b = MathTex(r"b \;=", color=ENCRE, font_size=36)
        nom_b.move_to([X_COTES, 1.15, 0], aligned_edge=LEFT)
        etq_b = always_redraw(
            lambda: self.cote(
                f"{b.get_value():.1f}".replace(".", ","), taille=34
            ).next_to(nom_b, RIGHT, buff=0.24)
        )
        nom_perte = MathTex(r"\mathcal{L} \;=", color=BRIQUE, font_size=36)
        nom_perte.move_to([X_COTES, 0.10, 0], aligned_edge=LEFT)
        etq_perte = always_redraw(
            lambda: self.cote(
                f"{_perte_de(b.get_value()):.2f}".replace(".", ","), taille=34
            ).next_to(nom_perte, RIGHT, buff=0.24)
        )

        self.play(Create(ligne), run_time=0.8)
        self.add(traits, nom_b, etq_b, nom_perte, etq_perte)
        self.wait(0.5)
        self.play(b.animate.set_value(40.0), run_time=4.2)
        self.wait(0.4)
        self.play(b.animate.set_value(22.5), run_time=2.0)
        self.wait(0.6)

        # ── Les deux candidats, cotés ───────────────────────────────────────
        self.next_section("Les deux candidats")
        self.remove(traits, nom_b, etq_b, nom_perte, etq_perte, ligne)

        def cotes_de(b_val: float) -> VGroup:
            g = VGroup()
            for s, y in APPARTS:
                yh = _prix(s, b_val)
                g.add(
                    Line(
                        axes.c2p(s, y), axes.c2p(s, yh),
                        color=BRIQUE, stroke_width=TRAIT_COTE,
                    )
                )
                # LA COTE SE POSE DE L'AUTRE COTE DU POINT OBSERVE, jamais au
                # milieu du segment : au milieu, elle rejoint la droite dès que
                # l'écart se referme, et la droite lui passe dessus. Le point
                # observé est fixe, la droite est toujours du côté de y chapeau.
                cote_ecart = self.cote(
                    f"{abs(yh - y):.4g}".replace(".", ","), taille=28
                )
                g.add(cote_ecart.next_to(
                    axes.c2p(s, y), UP if yh < y else DOWN, buff=0.34
                ))
            return g

        garde = []
        for nom, b_val, note_tex in (
            ("A", 20.0, r"\mathcal{L} = 62{,}5"),
            ("B", 22.5, r"\mathcal{L} = 56{,}25"),
        ):
            fixe = droite_de(b_val)
            g = cotes_de(b_val)
            eti = MathTex(
                rf"\boldsymbol{{\theta}}_{nom} \;:\; b = {b_val:.1f}".replace(".", "{,}"),
                color=ENCRE, font_size=36,
            ).move_to([X_COTES, 1.15, 0], aligned_edge=LEFT)
            note = MathTex(note_tex, color=BRIQUE, font_size=36)
            note.move_to([X_COTES, 0.10, 0], aligned_edge=LEFT)
            self.play(FadeIn(fixe), FadeIn(eti), run_time=0.6)
            self.play(Create(g), Write(note), run_time=1.1)
            self.wait(1.6)
            if nom == "A":
                self.play(FadeOut(fixe), FadeOut(g), FadeOut(eti), FadeOut(note),
                          run_time=0.5)
            else:
                garde = [fixe, g, eti, note]

        # Le verdict : deux nombres, un signe, et le nom du gagnant.
        self.next_section("Le verdict")
        verdict = MathTex(r"56{,}25 \;<\; 62{,}5", color=BRIQUE, font_size=40)
        verdict.move_to([X_COTES, -1.40, 0], aligned_edge=LEFT)
        filet = Line(
            [X_COTES, -1.95, 0], [X_COTES + 3.6, -1.95, 0],
            color=ENCRE_30, stroke_width=TRAIT_COTE,
        )
        gagnant = MathTex(r"\boldsymbol{\theta}_B", color=BRIQUE, font_size=52)
        gagnant.move_to([X_COTES, -2.55, 0], aligned_edge=LEFT)
        self.play(FadeIn(verdict), run_time=0.7)
        self.play(Create(filet), FadeIn(gagnant), run_time=0.7)
        self.wait(2.2)
        assert garde, "la seconde droite doit rester à l'écran"
