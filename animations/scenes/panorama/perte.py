"""
Panorama du machine learning : mesurer l'erreur.

Rattachée à la section « Mesurer l'erreur : la fonction de perte » du cours
`introduction-au-machine-learning`. Elle montre l'étape que
`la-perte-note-theta`, déclarée dans `bases.py`, saute : pourquoi l'écart brut
ne peut pas servir de critère.

Les nombres sont ceux de la leçon, et ils viennent du même endroit qu'elle :

    ventes    50 m², 2 pièces, payé 200    ·    30 m², 1 pièce, payé 115
    modèle    y chapeau = 3 x1 + 10 x2 + b
    theta_A   b = 20     écarts -10 et +5      moyenne -2,5
    theta_B   b = 22,5   écarts -7,5 et +7,5   moyenne 0, alors que le modèle
                         se trompe de 7 500 euros sur chacune des deux ventes

Les six assertions du bas de ce préambule de constantes recalculent ces écarts
au lieu de les recopier : une animation qui montrerait d'autres chiffres que le
texte serait pire qu'absente.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier : le
manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.

CE QUI A ÉTÉ RETIRÉ le 17 septembre 2026. « le-carre-empeche-la-compensation »
n'était plus servi par aucune page depuis le resserrement du 8 septembre : la
figure fixe `l1-fig4-deux-carres` et le quadrillage `l1-fig5-quadrillage` en
tiennent lieu dans la page 5.

CE QUE LA PASSE DU 17 SEPTEMBRE A CHANGÉ ICI. Les trois pistes étaient nommées
par des phrases — « moyenne des deux écarts bruts », « payé 200 k€ » — et la
scène se terminait sur deux lignes de prose que la légende du bloc dit déjà.
Il ne reste que des étiquettes : la surface de chaque vente, le mot moyenne, et
les valeurs. Les pistes se sont écartées, l'échelle est passée de 0,36 à 0,42
unité par millier d'euros, et le sujet occupe 5,1 unités sur les 6,3 que le
bandeau laisse, soit 81 %.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    DashedLine,
    Ellipse,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    VGroup,
    ValueTracker,
    always_redraw,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    ENCRE_75,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "lecart-brut-se-compense",
        "scene": "LEcartBrutSeCompense",
        "titre": "L'écart brut se compense, et ne mesure donc rien",
        "duree": 23,
        "alt": (
            "Un axe horizontal gradué de moins dix à plus dix porte l'écart "
            "brut, nommé y chapeau moins y au bout de l'axe, et une "
            "verticale pointillée y marque le zéro. Trois pistes se lisent "
            "au-dessus de cet axe, étiquetées cinquante mètres carrés, "
            "trente mètres carrés, et moyenne. Pour le candidat thêta A, "
            "dont le biais b vaut vingt, la première piste porte une barre "
            "de brique qui va du zéro à moins dix, la deuxième une barre "
            "jusqu'à plus cinq, et la piste de la moyenne une barre jusqu'à "
            "moins deux virgule cinq. Le biais b varie ensuite de vingt à "
            "vingt-cinq, et les trois barres suivent : la première se "
            "raccourcit pendant que la seconde s'allonge, et la moyenne "
            "passe par zéro à b égale vingt-deux virgule cinq, la valeur de "
            "thêta B, alors que les deux écarts valent encore moins sept "
            "virgule cinq et plus sept virgule cinq. La piste de la moyenne "
            "est alors vide, un grand zéro s'y dessine, et une barre de "
            "brique le traverse pendant que les deux écarts du haut, épaissis, "
            "gardent leurs valeurs."
        ),
        "notions": [
            "fonction de perte",
            "écart brut",
            "compensation des erreurs",
            "critère de comparaison",
        ],
        "ce qui change dans le temps": (
            "Le biais b, balayé jusqu'à 22,5, et les trois barres qui glissent "
            "avec lui : la première se raccourcit, la seconde s'allonge, et "
            "celle de la moyenne TRAVERSE le zéro puis disparaît. C'est cette "
            "annulation, obtenue alors que les deux erreurs valent 7 500 euros "
            "chacune, qui condamne l'écart brut."
        ),
    },
]


# ── Les données de la leçon, et rien d'autre ────────────────────────────────

# (surface en m², nombre de pièces, prix payé en milliers d'euros)
VENTES = ((50.0, 2.0, 200.0), (30.0, 1.0, 115.0))
W1, W2 = 3.0, 10.0

B_A = 20.0
B_B = 22.5
# Le haut du balayage. Il n'est pas libre : la cote du second écart se pose À
# DROITE de son bout, et à b = 26 cet écart vaut +11, ce qui projetait le texte
# au-delà de l'extrémité de l'axe, seul dans le blanc. À b = 25 l'écart vaut
# exactement +10, le bout tombe sur la graduation « 10 », et la cote reste sous
# l'axe.
B_HAUT = 25.0


def _ecart(vente: tuple[float, float, float], b: float) -> float:
    """L'écart brut y chapeau moins y, en milliers d'euros."""
    surface, pieces, paye = vente
    return W1 * surface + W2 * pieces + b - paye


def _moyenne(b: float) -> float:
    return sum(_ecart(v, b) for v in VENTES) / len(VENTES)


# Le tableau de la leçon, recalculé. S'il tombe, c'est la leçon ou la scène qui
# a bougé, et il vaut mieux que le rendu échoue que de mentir en silence.
assert abs(_ecart(VENTES[0], B_A) - (-10.0)) < 1e-9
assert abs(_ecart(VENTES[1], B_A) - (+5.0)) < 1e-9
assert abs(_ecart(VENTES[0], B_B) - (-7.5)) < 1e-9
assert abs(_ecart(VENTES[1], B_B) - (+7.5)) < 1e-9
assert abs(_moyenne(B_A) - (-2.5)) < 1e-9
assert abs(_moyenne(B_B)) < 1e-9


def _virgule(valeur: float, decimales: int = 1) -> str:
    # Le signe moins est U+2212, pas le trait d'union du clavier : règle 8.
    return (f"{valeur:+.{decimales}f}"
            .replace(".", ",").replace("-", "−"))


# ── La géométrie ────────────────────────────────────────────────────────────
#
# Le cadre fait 14,22 sur 8, et le bandeau en laisse 6,3 de haut. Les trois
# pistes s'étalent de 1,85 à −0,95, l'axe est à −2,60 et ses graduations
# descendent à −2,95 : le sujet fait 5,1 unités, soit 81 % de la hauteur utile.

E = 0.42  # unités de cadre par millier d'euros d'écart
# L'ABSCISSE DU ZERO N'EST PAS LIBRE. La cote d'un écart positif se pose à
# DROITE de son bout, et le balayage monte jusqu'à +10 : à 1,15 elle finissait
# en 6,78 pour une marge à 6,61. À 0,55, le pire bout tombe en 5,96.
ZERO_X = 0.55  # l'abscisse de l'écart nul
Y1, Y2, Y3 = 1.85, 0.65, -0.95  # les trois pistes
Y_AXE = -2.60
Y_BANDEAU = 2.62
# La colonne des noms de piste. Au-delà de −4,10, elle rencontrerait la cote de
# l'écart −10, qui se pose à gauche de son bout, en −3,05.
X_MARGE = -6.45


class LEcartBrutSeCompense(SceneN7):
    titre = "L'écart brut se compense"

    def construct(self) -> None:
        self.poser_titre(taille=24)
        self.next_section("Les deux écarts de thêta A")

        # ── Le décor : l'axe, le zéro, les trois pistes ─────────────────────
        axe = Line(
            [ZERO_X - 11.0 * E, Y_AXE, 0],
            [ZERO_X + 12.0 * E, Y_AXE, 0],
            color=ENCRE,
            stroke_width=TRAIT_AXE,
        )
        graduations = VGroup()
        for valeur in (-10, -5, 0, 5, 10):
            x = ZERO_X + valeur * E
            graduations.add(
                Line([x, Y_AXE - 0.08, 0], [x, Y_AXE + 0.08, 0],
                     color=ENCRE, stroke_width=TRAIT_AXE)
            )
            graduations.add(
                self.etiquette(str(valeur).replace("-", "−"),
                               taille=26, couleur=ENCRE_75)
                .move_to([x, Y_AXE - 0.34, 0])
            )
        # LE NOM DE L'AXE EST LE SYMBOLE DE CE QU'IL PORTE. « écart brut, en
        # milliers d'euros » était une phrase posée dans le cadre ; y chapeau
        # moins y est l'écriture que la page 5 emploie, et elle tient au bout
        # de l'axe, hors de portée des barres.
        nom_axe = MathTex(r"\hat{y}-y", color=ENCRE_75, font_size=34)
        # AU-DESSUS du bout de l'axe, pas après lui : après, il sortait du
        # cadre de 0,12 unité. Sous la troisième piste, à −2,15, il n'y a rien.
        nom_axe.move_to([ZERO_X + 11.1 * E, Y_AXE + 0.46, 0])

        # LE POINTILLE DU ZERO S'ARRETE AU SEPARATEUR. Descendu jusqu'à l'axe,
        # il traversait de part en part la cote « 0 » de la piste de la moyenne
        # — l'image même sur laquelle la scène s'arrête — puis le grand zéro
        # qui vient s'y écrire. Les deux pistes du haut le gardent, la
        # troisième a son propre zéro : le bout de sa barre.
        zero = DashedLine(
            [ZERO_X, Y1 + 0.55, 0],
            [ZERO_X, -0.15, 0],
            color=ENCRE_55,
            stroke_width=TRAIT_FILET,
            dash_length=0.09,
        )
        separateur = Line(
            [X_MARGE, -0.15, 0], [ZERO_X + 12.0 * E, -0.15, 0],
            color=ENCRE_30, stroke_width=TRAIT_FILET,
        )
        self.play(Create(axe), FadeIn(graduations), FadeIn(nom_axe), run_time=1.0)
        self.play(Create(zero), Create(separateur), run_time=0.6)

        # Les trois pistes portent une étiquette, jamais une phrase : la
        # surface de la vente, et le mot qui nomme la troisième.
        noms = VGroup()
        for (surface, _, _), y in zip(VENTES, (Y1, Y2)):
            bloc = MathTex(
                rf"{int(surface)}\,\mathrm{{m}}^2", color=ENCRE, font_size=36
            )
            bloc.move_to([X_MARGE + bloc.width / 2, y, 0])
            noms.add(bloc)
        nom_moyenne = self.etiquette("moyenne", taille=30, couleur=BRIQUE)
        nom_moyenne.move_to([X_MARGE + nom_moyenne.width / 2, Y3, 0])
        self.play(FadeIn(noms), FadeIn(nom_moyenne), run_time=0.7)

        # ── Les barres, d'abord figées sur thêta A ──────────────────────────
        def barre(valeur: float, y: float) -> VGroup:
            """Une cote horizontale partant du zéro, avec un empattement au bout."""
            x1 = ZERO_X + valeur * E
            # Une longueur strictement nulle rendrait le vecteur unitaire de la
            # ligne indéfini ; on garde un cheveu, qui marque l'origine.
            if abs(x1 - ZERO_X) < 0.004:
                x1 = ZERO_X + 0.004
            return VGroup(
                Line([ZERO_X, y, 0], [x1, y, 0],
                     color=BRIQUE, stroke_width=TRAIT_COTE),
                Line([x1, y - 0.13, 0], [x1, y + 0.13, 0],
                     color=BRIQUE, stroke_width=TRAIT_COTE),
            )

        def cote_bout(valeur: float, y: float) -> VGroup:
            """La valeur, posée du côté extérieur du bout : jamais sur la barre."""
            x1 = ZERO_X + valeur * E
            # Zéro n'a pas de signe. « +0,0 » s'affichait sur la piste de la
            # moyenne à l'instant précis où la scène démontre que cette moyenne
            # s'annule, et c'est l'image sur laquelle on s'arrête : elle doit
            # dire zéro, pas « plus zéro virgule zéro ».
            nul = abs(valeur) < 0.05
            texte = self.cote("0" if nul else _virgule(valeur), taille=28)
            # UNE BARRE DE LONGUEUR NULLE N'A PAS DE COTE DE COTE. À zéro,
            # l'empattement du bout — épaissi au verdict — venait sous le
            # chiffre. La valeur nulle se pose donc AU-DESSUS.
            if nul:
                texte.move_to([x1, y + 0.40, 0])
                return VGroup(texte)
            decalage = -1.0 if valeur <= 0 else 1.0
            texte.move_to([x1 + decalage * (0.36 + texte.width / 2), y, 0])
            return VGroup(texte)

        b = ValueTracker(B_A)
        nom_b = MathTex(r"b \;=", color=ENCRE, font_size=34)
        nom_b.move_to([3.15, Y_BANDEAU, 0], aligned_edge=LEFT)
        etq_b = always_redraw(
            lambda: self.cote(
                f"{b.get_value():.1f}".replace(".", ",").replace("-", "−"),
                taille=32,
            ).next_to(nom_b, RIGHT, buff=0.22)
        )

        figees = VGroup(
            barre(_ecart(VENTES[0], B_A), Y1), cote_bout(_ecart(VENTES[0], B_A), Y1),
            barre(_ecart(VENTES[1], B_A), Y2), cote_bout(_ecart(VENTES[1], B_A), Y2),
        )
        nom_theta = MathTex(r"\boldsymbol{\theta}_A", color=BRIQUE, font_size=40)
        nom_theta.move_to([1.60, Y_BANDEAU, 0], aligned_edge=LEFT)
        self.add(nom_b, etq_b)
        self.play(FadeIn(nom_theta), Create(figees), run_time=1.1)
        self.wait(0.5)

        moyenne_figee = VGroup(
            barre(_moyenne(B_A), Y3), cote_bout(_moyenne(B_A), Y3)
        )
        self.play(Create(moyenne_figee), run_time=0.8)
        self.wait(0.6)

        # ── Le balayage ─────────────────────────────────────────────────────
        #
        # Entre thêta A et thêta B, b ne bouge que de 2,5, soit un centimètre à
        # l'écran : personne ne verrait rien. On fait donc PARCOURIR à b tout
        # l'intervalle utile. Les deux écarts glissent ensemble vers la droite,
        # leur différence restant de 15 quoi qu'il arrive, et la barre de la
        # moyenne traverse le zéro sous les yeux.
        self.next_section("Le balayage de b")

        vivant = always_redraw(
            lambda: VGroup(
                barre(_ecart(VENTES[0], b.get_value()), Y1),
                cote_bout(_ecart(VENTES[0], b.get_value()), Y1),
                barre(_ecart(VENTES[1], b.get_value()), Y2),
                cote_bout(_ecart(VENTES[1], b.get_value()), Y2),
                barre(_moyenne(b.get_value()), Y3),
                cote_bout(_moyenne(b.get_value()), Y3),
            )
        )
        self.remove(figees, moyenne_figee)
        self.add(vivant)
        self.play(FadeOut(nom_theta), run_time=0.3)
        self.play(b.animate.set_value(B_HAUT), run_time=3.4)
        self.wait(0.5)
        self.play(b.animate.set_value(B_B), run_time=2.4)
        self.wait(0.6)

        # ── Thêta B : la moyenne est nulle, les écarts ne le sont pas ───────
        self.next_section("Thêta B, la moyenne tombe à zéro")
        self.remove(vivant)
        barre_1 = barre(_ecart(VENTES[0], B_B), Y1)
        barre_2 = barre(_ecart(VENTES[1], B_B), Y2)
        cote_1 = cote_bout(_ecart(VENTES[0], B_B), Y1)
        cote_2 = cote_bout(_ecart(VENTES[1], B_B), Y2)
        self.add(barre_1, barre_2, cote_1, cote_2)

        nom_theta_b = MathTex(r"\boldsymbol{\theta}_B", color=BRIQUE, font_size=40)
        nom_theta_b.move_to([1.60, Y_BANDEAU, 0], aligned_edge=LEFT)
        self.play(FadeIn(nom_theta_b), run_time=0.5)
        self.wait(1.0)

        # ── L'annulation ────────────────────────────────────────────────────
        origine = RIGHT * ZERO_X + UP * Y3
        # Les copies descendent SANS leur cote. Avec elle, la copie recouvrait
        # l'original pendant le premier tiers de la descente et les deux « −7,5 »
        # se chevauchaient, illisibles ; les valeurs restent lisibles sur les
        # deux pistes du haut, qui ne bougent pas.
        copie_1 = VGroup(barre_1.copy())
        copie_2 = VGroup(barre_2.copy())
        self.add(copie_1, copie_2)
        self.play(
            copie_1.animate.shift(UP * (Y3 - Y1)),
            copie_2.animate.shift(UP * (Y3 - Y2)),
            run_time=1.2,
        )
        self.wait(0.5)
        # Les deux cotes se rétractent l'une vers l'autre jusqu'au point zéro :
        # chaque bout parcourt trois unités de cadre, soit un cinquième de la
        # largeur, et il ne reste rien.
        self.play(
            copie_1.animate.scale(0.02, about_point=origine),
            copie_2.animate.scale(0.02, about_point=origine),
            run_time=1.1,
        )
        self.remove(copie_1, copie_2)

        # LE ZERO BARRE EST UN DESSIN, PAS UN TEXTE. Un `Cross` posé sur un
        # `Text` se décompose en deux `Line` par-dessus une boîte de texte :
        # c'est, au crible, un tracé sous un texte, et c'en est un à l'œil
        # aussi — la barre traverse le glyphe. Une ellipse et une barre sont
        # deux formes, elles ont le droit de se toucher, et le signe qu'elles
        # composent est celui que tout le monde lit comme « rien ».
        grand_zero = Ellipse(
            width=0.86, height=1.24, color=ENCRE, stroke_width=TRAIT_COTE * 1.8,
            fill_opacity=0.0,
        ).move_to(origine)
        self.play(FadeIn(grand_zero, scale=0.7), run_time=0.7)
        self.wait(0.7)

        barre_zero = Line(
            origine + LEFT * 0.62 + DOWN * 0.86,
            origine + RIGHT * 0.62 + UP * 0.86,
            color=BRIQUE,
            stroke_width=TRAIT_COTE + 1.4,
        )
        self.play(Create(barre_zero), run_time=0.7)

        # ── Le verdict : les deux écarts, épaissis. Rien d'écrit ────────────
        #
        # La scène disait « et pourtant : 7 500 € d'erreur sur chacune des deux
        # ventes », puis « un critère qui récompense la compensation ne mesure
        # pas l'erreur ». Deux phrases, dans le cadre, que la légende du bloc
        # porte mot pour mot. Ce qu'il reste à voir, ce sont les deux barres
        # qui n'ont pas bougé pendant que la moyenne s'annulait.
        self.next_section("Le verdict")
        self.play(
            VGroup(barre_1, barre_2).animate.set_stroke(width=TRAIT_COTE * 2.4),
            run_time=0.5,
        )
        self.play(
            VGroup(barre_1, barre_2).animate.set_stroke(width=TRAIT_COTE),
            run_time=0.5,
        )
        self.play(
            VGroup(barre_1, barre_2).animate.set_stroke(width=TRAIT_COTE * 2.4),
            run_time=0.5,
        )
        self.wait(2.4)
