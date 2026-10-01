"""
Panorama du machine learning : le mot qui change tout, « nouveau ».

Rattachée à la section « Apprendre, c'est généraliser » du cours
`introduction-au-machine-learning`.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier :
le manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.

CE QUI A ÉTÉ RETIRÉ le 17 septembre 2026. « de-lenonce-aux-objets » n'était
plus servi par aucune page depuis le resserrement du 8 septembre : la figure
fixe `l1-fig9-des-mots-aux-objets` le dit dans la page 2.

CE QUE LA SCÈNE A ABSORBÉ. `la-table-qui-memorise`, déclarée dans `optim.py`,
montrait une table qu'on interroge : elle répond juste sur une ligne qu'elle
contient, et n'a rien à dire pour une entrée absente, où elle se contente
d'ouvrir une ligne vide. C'était le même geste que la seconde moitié de cette
scène-ci, sur d'autres nombres. Le fichier ouvre désormais lui aussi sa ligne
vide pour 86 m², avec sa case de prix cernée d'un pointillé et barrée : une
seule scène porte les deux moments, et il n'y a plus qu'un jeu de nombres à
tenir.

CE QUE LA PASSE DU 17 SEPTEMBRE A CHANGÉ ICI. Six phrases vivaient dans le
cadre — « le fichier des ventes », « et ainsi de suite », « erreur nulle sur
les mille ventes du fichier », « une vente nouvelle », « 86,0 m² : aucune
ligne », « le fichier connaît ce qu'il a vu ; le modèle propose une valeur pour
ce qu'il n'a jamais vu ». Elles sont parties : la dernière est la légende du
bloc, mot pour mot, et les autres nomment en français ce que la figure montre.
Restent des étiquettes — D, N = 1 000, un compte de lignes, une erreur nulle,
une surface, un prix — et le tracé, qui monte à 4,90 unités sur les 6,3 que le
bandeau laisse, soit 78 %.
"""

import random

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    PI,
    RIGHT,
    UP,
    AnimationGroup,
    Axes,
    Create,
    DashedLine,
    DashedVMobject,
    Dot,
    FadeIn,
    FadeOut,
    FadeToColor,
    Line,
    MathTex,
    Rectangle,
    Triangle,
    VGroup,
    linear,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    ENCRE_75,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_COURBE,
    TRAIT_FILET,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "le-mot-nouvel",
        "scene": "LeMotNouvel",
        "titre": "Le mot qui change tout : nouveau",
        "duree": 33,
        "alt": (
            "Un plan porte la surface en mètres carrés en abscisse et le "
            "prix en milliers d'euros en ordonnée, avec mille points répartis "
            "le long d'une bande montante : les mille ventes passées, cotées "
            "N égale mille. À droite, un cadre nommé D porte ses colonnes "
            "surface, pièces et prix, quatre lignes reprises de quatre points "
            "du nuage, puis des points de suspension verticaux et la mention "
            "mille lignes. Sur les ventes qu'il recopie, le fichier ne se "
            "trompe jamais : les points passent au vert à mesure qu'un trait "
            "vertical parcourt le nuage, cinq coches vertes marquent les plus "
            "isolés, et une cote donne erreur égale zéro. Une vente nouvelle "
            "arrive ensuite, en brique, posée sur l'axe des abscisses à "
            "quatre-vingt-six mètres carrés et cotée quatre-vingt-six mètres "
            "carrés. Un curseur descend alors les lignes du fichier sans "
            "s'arrêter et sort par le bas ; une ligne neuve s'ouvre, "
            "quatre-vingt-six mètres carrés s'y inscrit en brique, et la case "
            "du prix reste vide, cernée d'un pointillé et barrée d'une croix. "
            "Une droite apprise, nommée y chapeau de x, traverse enfin le "
            "nuage, un pointillé monte de l'axe jusqu'à elle et un second part "
            "vers l'axe des prix, où la valeur proposée, trois cent quinze "
            "milliers d'euros, est cotée en brique."
        ),
        "notions": [
            "généralisation",
            "jeu de données",
            "modèle",
            "prédiction",
        ],
        "ce qui change dans le temps": (
            "Deux parcours du même fichier. Le premier, un trait qui balaie le "
            "nuage et passe les mille points au vert : sur ce qu'il a vu, le "
            "fichier ne se trompe jamais. Le second, un curseur qui descend les "
            "lignes pour 86 m², n'y trouve rien et ouvre une ligne vide. C'est "
            "leur SUCCESSION qui définit la généralisation."
        ),
    },
]


# ── Les données, tirées une fois pour toutes ────────────────────────────────

# La seule couleur qui n'est pas dans la palette de l'identité. Elle ne sert
# qu'à une chose, et à une seule : dire « juste » sur un point du fichier.
# Sa saturation et sa clarté sont celles de la brique, pour qu'elle ne fasse
# pas tache à côté d'elle.
VERT = "#3F6B45"

SURFACE_MIN, SURFACE_MAX = 24.0, 116.0
PRIX_MIN, PRIX_MAX = 60.0, 460.0
PENTE, ORDONNEE = 3.2, 40.0
N_VENTES = 1000

# La vente nouvelle. Sa surface est absente du fichier, et le tirage l'écarte
# explicitement : « aucune ligne » doit être vrai, pas seulement plausible.
SURFACE_NOUVELLE = 86.0

assert abs(PENTE * SURFACE_NOUVELLE + ORDONNEE - 315.2) < 1e-9


def _pieces(surface: float) -> int:
    return max(1, min(5, round(surface / 26.0)))


def _ventes() -> list[tuple[float, float]]:
    """Mille ventes passées, tirées une fois pour toutes."""
    tirage = random.Random(7)
    ventes: list[tuple[float, float]] = []
    while len(ventes) < N_VENTES:
        surface = round(tirage.uniform(SURFACE_MIN, SURFACE_MAX), 1)
        if abs(surface - SURFACE_NOUVELLE) < 0.05:
            continue
        prix = PENTE * surface + ORDONNEE + tirage.gauss(0.0, 30.0)
        if not PRIX_MIN <= prix <= PRIX_MAX:
            continue
        ventes.append((surface, round(prix, 1)))
    return ventes


def _normalise(vente: tuple[float, float]) -> tuple[float, float]:
    surface, prix = vente
    return (
        (surface - SURFACE_MIN) / (SURFACE_MAX - SURFACE_MIN),
        (prix - PRIX_MIN) / (PRIX_MAX - PRIX_MIN),
    )


def _vedettes(ventes: list[tuple[float, float]]) -> list[int]:
    """Quatre ventes ordinaires, bien réparties : les lignes du fichier."""
    choisies = []
    for cible in (34.0, 57.0, 82.0, 104.0):
        meilleur, score_min = 0, None
        for i, (surface, prix) in enumerate(ventes):
            score = abs(surface - cible) * 3.0 + abs(
                prix - (PENTE * surface + ORDONNEE)
            ) * 0.12
            if score_min is None or score < score_min:
                meilleur, score_min = i, score
        choisies.append(meilleur)
    return choisies


def _isolees(ventes: list[tuple[float, float]], combien: int = 5) -> list[int]:
    """
    Les ventes les plus seules dans le nuage.

    Une coche posée au milieu de la masse recouvrirait dix points voisins :
    c'est exactement le défaut que la règle interdit. On la pose donc là où il
    n'y a rien autour, et on impose en plus un écart entre les coches
    elles-mêmes.
    """
    candidats = list(range(0, len(ventes), 5))
    voisin: list[tuple[float, int]] = []
    for i in candidats:
        ui, vi = _normalise(ventes[i])
        plus_proche = 9.0
        for j, autre in enumerate(ventes):
            if j == i:
                continue
            uj, vj = _normalise(autre)
            d = (ui - uj) ** 2 + (vi - vj) ** 2
            if d < plus_proche:
                plus_proche = d
        voisin.append((plus_proche, i))
    voisin.sort(reverse=True)

    gardees: list[int] = []
    for _, i in voisin:
        ui, vi = _normalise(ventes[i])
        if all(
            (ui - _normalise(ventes[j])[0]) ** 2
            + (vi - _normalise(ventes[j])[1]) ** 2
            > 0.02
            for j in gardees
        ):
            gardees.append(i)
        if len(gardees) == combien:
            break
    return gardees


def _coche(centre, couleur: str = VERT) -> VGroup:
    """Une coche tracée à la main, en deux segments. Aucun emoji, aucune fonte."""
    a = centre + LEFT * 0.115 + UP * 0.015
    b = centre + LEFT * 0.025 + DOWN * 0.09
    c = centre + RIGHT * 0.135 + UP * 0.135
    return VGroup(
        Line(a, b, color=couleur, stroke_width=TRAIT_COTE),
        Line(b, c, color=couleur, stroke_width=TRAIT_COTE),
    )


def _croix(centre, couleur: str = BRIQUE, rayon: float = 0.16) -> VGroup:
    return VGroup(
        Line(
            centre + LEFT * rayon + UP * rayon,
            centre + RIGHT * rayon + DOWN * rayon,
            color=couleur,
            stroke_width=TRAIT_COTE,
        ),
        Line(
            centre + LEFT * rayon + DOWN * rayon,
            centre + RIGHT * rayon + UP * rayon,
            color=couleur,
            stroke_width=TRAIT_COTE,
        ),
    )


# ── La géométrie ────────────────────────────────────────────────────────────
#
# Le tracé prend la colonne de gauche et le fichier celle de droite : le tracé
# s'arrête à 1,15 et le cadre commence à 2,05. Le tracé fait 4,90 unités de
# haut sur les 6,3 que le bandeau laisse, soit 78 %.

X_AXES, Y_AXES = -2.45, -0.35
L_AXES, H_AXES = 6.40, 4.90
# LE CADRE TIENT DANS LA MARGE, ET LE CURSEUR TIENT DANS LE CADRE. A 4,60 de
# large centre sur 4,35, son bord droit tombait en 6,65 pour une marge a 6,61 :
# 0,04 unite de trop, que le crible voit et que l'oeil lit comme une figure
# poussee hors du cadre. A 4,50 centre sur 4,30, il va de 2,05 a 6,55, et le
# curseur qui descend les lignes en 2,22 reste a 0,09 du bord interieur.
X_CADRE, Y_CADRE = 4.30, -0.35
L_CADRE, H_CADRE = 4.50, 4.40

COLONNES = (2.55, 4.00, 5.30)
# OU LE POINT SE POSE AVANT DE DEVENIR DU TEXTE. A l'interieur du cadre,
# 0,26 unite apres son bord gauche, et 0,24 avant la premiere colonne : la
# ligne s'ecrit a partir de lui, elle ne le recouvre pas.
X_JETON = 2.31
RANGEES = (0.95, 0.55, 0.15, -0.25)
Y_ENTETE = 1.45
Y_FILET = 1.22
Y_SUITE = -0.80
Y_COMPTE = -1.25
Y_NEUVE = -1.95


class LeMotNouvel(SceneN7):
    titre = "Le mot qui change tout : nouveau"

    def construct(self) -> None:
        self.poser_titre(taille=24)
        self.next_section("Mille ventes passées")

        ventes = _ventes()

        axes = Axes(
            x_range=[20, 120, 20],
            y_range=[40, 480, 80],
            x_length=L_AXES,
            y_length=H_AXES,
            axis_config={
                "color": ENCRE,
                "stroke_width": TRAIT_AXE,
                "include_ticks": True,
                "tick_size": 0.07,
                "font_size": 28,
                "decimal_number_config": {"num_decimal_places": 0},
            },
            x_axis_config={"numbers_to_include": [40, 60, 80, 100, 120]},
            y_axis_config={"numbers_to_include": [120, 280, 440]},
            tips=False,
        ).move_to([X_AXES, Y_AXES, 0])

        # LES NOMS D'AXE SONT DES SYMBOLES. L'euro n'est pas dans le template
        # LaTeX de Manim — ni inputenc ni textcomp n'y sont chargés — donc le
        # symbole vient de LaTeX et l'unité de Pango.
        nom_x = VGroup(
            MathTex(r"x_1", color=ENCRE_75, font_size=32),
            self.etiquette("(m²)", taille=26, couleur=ENCRE_75),
        ).arrange(RIGHT, buff=0.14)
        nom_x.move_to([1.45, -3.15, 0], aligned_edge=LEFT)
        nom_y = VGroup(
            MathTex(r"y", color=ENCRE_75, font_size=32),
            self.etiquette("(k€)", taille=26, couleur=ENCRE_75),
        ).arrange(RIGHT, buff=0.14)
        nom_y.next_to(axes.c2p(20, 480), UP, buff=0.22).shift(RIGHT * 0.40)
        self.play(Create(axes), FadeIn(nom_x), FadeIn(nom_y), run_time=1.0)

        nuage = VGroup(
            *[
                Dot(axes.c2p(s, p), color=ENCRE_75, radius=0.024, stroke_width=0)
                for s, p in ventes
            ]
        )
        self.play(FadeIn(nuage, shift=UP * 0.12, lag_ratio=0.0018), run_time=2.6)

        # La cote d'état. Elle ne bouge plus de la scène : elle sera
        # transformée, jamais déplacée, sinon deux textes se rencontrent.
        # LA BANDE DU HAUT PORTE TROIS COTES, ET ELLES SE PARTAGENT LA
        # LARGEUR : le nom de l'axe des prix tient la gauche, jusqu'a -4,80 ;
        # N = 1 000 prend le milieu ; l'erreur nulle viendra a droite. Posee en
        # -5,90, la cote du compte tombait sur le nom de l'axe.
        #
        # ET LA BANDE EST A 2,62, PAS A 2,45. `move_to` centre la BOITE des
        # Axes, graduations comprises : le haut du trace ne tombe donc pas en
        # 2,10 comme la geometrie nominale le laisse croire, mais en 2,325. A
        # 2,45, la boite de cette cote descendait a 2,318 et le balai de la
        # section suivante la frolait de sept milliemes d'unite. A 2,62 elle
        # s'arrete a 2,49, et il reste 0,16 d'air au-dessus du trace.
        etat = MathTex(r"N = 1\,000", color=ENCRE, font_size=36)
        etat.move_to([-3.20, 2.62, 0], aligned_edge=LEFT)
        self.play(FadeIn(etat), run_time=0.6)
        self.wait(0.7)

        # ── Le fichier ──────────────────────────────────────────────────────
        self.next_section("Le fichier")

        cadre = Rectangle(
            width=L_CADRE,
            height=H_CADRE,
            color=ENCRE_55,
            stroke_width=TRAIT_COTE,
            fill_opacity=0,
        ).move_to([X_CADRE, Y_CADRE, 0])
        # LE FICHIER PORTE SON SYMBOLE, pas son nom français. La page 2 pose
        # « D » pour l'ensemble des ventes passées ; « le fichier des ventes »
        # était une glose de plus dans un cadre déjà plein.
        nom_cadre = MathTex(r"\mathcal{D}", color=ENCRE, font_size=40)
        nom_cadre.next_to(cadre.get_corner(UP + LEFT), UP, buff=0.18)
        nom_cadre.align_to(cadre, LEFT).shift(RIGHT * 0.08)

        entetes = VGroup(
            *[
                self.etiquette(t, taille=26, couleur=ENCRE_55).move_to(
                    [x, Y_ENTETE, 0], aligned_edge=LEFT
                )
                for t, x in zip(("surface", "pièces", "prix"), COLONNES)
            ]
        )
        filet_entete = Line(
            [X_CADRE - L_CADRE / 2 + 0.20, Y_FILET, 0],
            [X_CADRE + L_CADRE / 2 - 0.20, Y_FILET, 0],
            color=ENCRE_30,
            stroke_width=TRAIT_FILET,
        )
        self.play(Create(cadre), FadeIn(nom_cadre), run_time=0.8)
        self.play(FadeIn(entetes), Create(filet_entete), run_time=0.6)

        # Chaque ligne du fichier est la COPIE d'un point : le point se détache
        # du nuage, traverse l'écran et devient du texte. C'est ce que fait une
        # table de correspondance, dit une fois pour toutes.
        #
        # LE POINT VOYAGE EN POINT, ET LE TEXTE NAÎT LÀ OÙ IL SE POSE. Le
        # voyage était fait par `TransformFromCopy` du point vers la rangée
        # entière : dès la mi-course, l'objet interpolé avait déjà la boîte
        # d'une ligne de tableau, et cette boîte-là balayait les points du
        # nuage, le bord du cadre, puis la rangée précédente. Rien n'en
        # subsistait à l'arrivée, et le crible relevait quand même les quatre
        # instants — il avait raison, cela se voit au pas image par image.
        # Le point part donc seul, en brique parce qu'il est ce qui bouge, il
        # se pose dans le cadre, et la ligne s'écrit à partir de lui.
        vedettes = _vedettes(ventes)
        rangees = VGroup()
        for indice, hauteur in zip(vedettes, RANGEES):
            surface, prix = ventes[indice]
            cellules = [
                f"{surface:.1f} m²".replace(".", ","),
                f"{_pieces(surface)} p.",
                f"{prix:.0f} k€",
            ]
            rangee = VGroup(
                *[
                    self.etiquette(t, taille=26, couleur=ENCRE).move_to(
                        [x, hauteur, 0], aligned_edge=LEFT
                    )
                    for t, x in zip(cellules, COLONNES)
                ]
            )
            jeton = nuage[indice].copy().set_color(BRIQUE)
            self.add(jeton)
            self.play(
                # 4,0 et pas 2,6 : le point du nuage a 0,024 de rayon, et
                # 2,6 le portait a 0,062 — six pixels a mi-course, deux fois
                # un point du nuage, ce qui ne se lit pas sur une
                # planche-contact. A 4,0 il fait 0,096, soit le rayon du
                # point brique de la vente nouvelle : la scene n'a qu'une
                # taille pour « le point dont on parle ».
                jeton.animate.scale(4.0).move_to([X_JETON, hauteur, 0]),
                run_time=0.42,
            )
            self.play(FadeOut(jeton), FadeIn(rangee), run_time=0.28)
            rangees.add(rangee)

        # « et ainsi de suite » devient le signe qui le dit : trois points.
        suite = self.etiquette("⋮", taille=34, couleur=ENCRE_55)
        suite.move_to([COLONNES[0] + 0.30, Y_SUITE, 0])
        compte = self.cote("1 000 lignes", taille=28)
        compte.move_to([COLONNES[0], Y_COMPTE, 0], aligned_edge=LEFT)
        self.play(FadeIn(suite), FadeIn(compte), run_time=0.6)
        self.wait(0.6)

        # ── Le fichier a toujours raison, sur ce qu'il contient ─────────────
        self.next_section("Erreur nulle sur le fichier")

        balai = Line(
            axes.c2p(20, 40),
            axes.c2p(20, 480),
            color=BRIQUE,
            stroke_width=TRAIT_FILET,
        )
        self.add(balai)

        ordre = sorted(range(len(ventes)), key=lambda i: ventes[i][0])
        taille_tranche = len(ordre) // 40 + 1
        tranches = [
            VGroup(*[nuage[i] for i in ordre[k : k + taille_tranche]])
            for k in range(0, len(ordre), taille_tranche)
        ]
        # Le balai et la vague DOIVENT avancer du même pas. Ils ont d'abord
        # divergé : « smooth » pour le trait, « linear » pour le groupe
        # d'animations, et aux trois quarts le trait avait un tiers de tracé
        # d'avance sur la couleur. On impose le même rythme aux deux.
        self.play(
            balai.animate.shift(RIGHT * L_AXES),
            AnimationGroup(
                *[FadeToColor(t, VERT) for t in tranches], lag_ratio=0.95
            ),
            run_time=2.4,
            rate_func=linear,
        )
        self.play(FadeOut(balai), run_time=0.3)

        coches = VGroup(
            *[
                _coche(nuage[i].get_center() + UP * 0.17 + RIGHT * 0.17)
                for i in _isolees(ventes)
            ]
        )
        self.play(Create(coches, lag_ratio=0.4), run_time=1.1)

        # Le verdict est une égalité, plus une phrase : « erreur nulle sur les
        # mille ventes du fichier » disait dans le cadre ce que la légende du
        # bloc dit sous le lecteur.
        # SOUS LE TRACE, IL N'Y A PLUS DE PLACE : les graduations de l'axe des
        # surfaces y sont, et « 40 » commence en -4,37. La cote se range donc
        # dans la bande du haut, a droite du compte.
        juste = MathTex(r"\text{erreur} = 0", color=VERT, font_size=36)
        juste.move_to([-1.40, 2.62, 0], aligned_edge=LEFT)
        self.play(FadeIn(juste), run_time=0.6)
        self.wait(1.3)

        # ── La vente nouvelle ───────────────────────────────────────────────
        self.next_section("Une vente nouvelle")

        self.play(
            FadeToColor(nuage, ENCRE_55),
            FadeOut(coches),
            FadeOut(juste),
            run_time=0.7,
        )

        sol = axes.c2p(SURFACE_NOUVELLE, 40)
        # Le point arrive DE BIAIS, et pas à la verticale : tombant tout droit
        # sur 86 m², il traversait sa propre cote. Il naît sous le filet du
        # bandeau, à 2,60 de hauteur, et paraît là où il tombera.
        nouveau = Dot(
            sol + UP * 5.20 + LEFT * 2.6,
            color=BRIQUE,
            radius=0.095,
            stroke_width=0,
        )
        self.play(FadeIn(nouveau), run_time=0.4)
        self.play(nouveau.animate.move_to(sol), run_time=1.1)

        # LA COTE SE POSE AU-DESSUS DU POINT, et décalée à gauche : dessous
        # elle tombait sur les graduations de l'axe, et juste au-dessus sur le
        # pointillé vertical qui va monter de 86 m².
        marque = self.cote("86 m²", taille=28)
        marque.next_to(sol, UP, buff=0.28).shift(LEFT * 0.95)
        self.play(FadeIn(marque), run_time=0.5)
        self.wait(0.5)

        # ── Le fichier cherche, et ouvre une ligne pour rien ────────────────
        #
        # C'est ici que `la-table-qui-memorise` est absorbée : un curseur
        # descend les lignes, ne s'arrête sur aucune, sort par le bas, et la
        # table s'ouvre d'une ligne dont la case de prix reste vide.
        self.next_section("Le fichier n'a rien à dire")
        pointeur = (
            Triangle(color=BRIQUE, fill_opacity=1.0, stroke_width=0)
            .scale(0.085)
            .rotate(-PI / 2)
        )
        x_pointeur = COLONNES[0] - 0.33
        pointeur.move_to([x_pointeur, RANGEES[0], 0])
        self.play(FadeIn(pointeur), run_time=0.25)
        for hauteur in (*RANGEES[1:], Y_SUITE, Y_COMPTE):
            self.play(pointeur.animate.move_to([x_pointeur, hauteur, 0]),
                      run_time=0.22)
        self.play(pointeur.animate.move_to([x_pointeur, Y_NEUVE, 0]), run_time=0.3)

        neuve = self.cote("86 m²", taille=28)
        neuve.move_to([COLONNES[0], Y_NEUVE, 0], aligned_edge=LEFT)
        # La case du prix reste vide : un rectangle en pointillé, et la croix
        # dedans. Deux formes ont le droit de se toucher — ici, elles doivent.
        case_vide = DashedVMobject(
            Rectangle(
                width=1.20, height=0.52, color=BRIQUE,
                stroke_width=TRAIT_FILET, fill_opacity=0,
            ).move_to([COLONNES[2] + 0.45, Y_NEUVE, 0]),
            num_dashes=22,
        )
        croix = _croix([COLONNES[2] + 0.45, Y_NEUVE, 0])
        self.play(FadeIn(neuve), Create(case_vide), run_time=0.7)
        self.play(Create(croix), run_time=0.5)
        self.play(FadeOut(pointeur), run_time=0.25)
        self.wait(1.1)

        # ── Le modèle, lui, propose ─────────────────────────────────────────
        self.next_section("Le modèle propose")

        courbe = axes.plot(
            lambda s: PENTE * s + ORDONNEE,
            x_range=[22, 118],
            color=ENCRE,
            stroke_width=TRAIT_COURBE,
        )
        # Le nom se posait sur les points les plus hauts du nuage, au bout de
        # la droite. Le seul endroit vraiment vide du tracé est le coin bas
        # droit : personne n'a jamais vendu cent dix mètres carrés à cent mille
        # euros.
        nom_courbe = MathTex(r"\hat{y}(x)", color=ENCRE, font_size=36)
        nom_courbe.move_to([0.60, -1.95, 0])
        self.play(Create(courbe), run_time=1.4)
        self.play(FadeIn(nom_courbe), run_time=0.5)

        prix_predit = PENTE * SURFACE_NOUVELLE + ORDONNEE
        haut = axes.c2p(SURFACE_NOUVELLE, prix_predit)
        montee = DashedLine(
            sol, haut, color=BRIQUE, stroke_width=TRAIT_FILET, dash_length=0.09
        )
        self.play(Create(montee), run_time=0.7)
        # Le point remonte le long du pointillé : trois unités de haut, c'est
        # le geste de la prédiction.
        self.play(nouveau.animate.move_to(haut), run_time=0.9)

        gauche = axes.c2p(20, prix_predit)
        report = DashedLine(
            haut, gauche, color=BRIQUE, stroke_width=TRAIT_FILET, dash_length=0.09
        )
        valeur = self.cote("315 k€", taille=28)
        # A GAUCHE DE L'AXE, elle finissait en -6,71 pour une marge a -6,61, et
        # par-dessus les graduations des prix. Elle se pose donc a DROITE de
        # l'axe et un cran au-dessus du report : a 342 k€ pour une surface de
        # 24 m², le coin est vide, aucune vente n'y tombe.
        valeur.next_to(gauche, RIGHT, buff=0.18).shift(UP * 0.26)
        self.play(Create(report), run_time=0.7)
        self.play(FadeIn(valeur), run_time=0.5)
        self.wait(2.6)
