"""
Panorama du machine learning : les objets fondamentaux.

Rattachées à la leçon « Les objets fondamentaux » du cours
`introduction-au-machine-learning`.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier :
le manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.
C'est ce qui permet à l'application d'afficher « animation à rendre » sur une
machine où personne n'a Python.

Les deux scènes reprennent le même appartement que le reste du chapitre :
cinquante mètres carrés, deux pièces, et les poids 3 et 10 avec un biais de 20.
Un cours qui change de nombres d'une animation à l'autre demande à l'étudiant
de refaire le raccord tout seul, et il ne le fait pas.

Deux règles ont dicté la mise en page :
  - rien ne se superpose, jamais, pas même une seconde ;
  - ce qui porte l'idée se déplace. Les nombres quittent le dessin, la barre
    grandit. Une valeur qui dépend d'un paramètre est montrée en faisant
    BALAYER ce paramètre, pas en montrant deux états.

Les compteurs qui changent à chaque image sont écrits en `Text` (Pango) et non
en `MathTex` : un MathTex reconstruit trente fois par seconde relance LaTeX
trente fois par seconde. Les parties fixes des formules, elles, restent en
MathTex.

CE QUI A ÉTÉ RETIRÉ le 17 septembre 2026. « le-jeu-de-donnees-se-remplit » et
« la-verification-des-dimensions » n'étaient plus servis par aucune page depuis
le resserrement du 8 septembre ; la seconde a sa figure fixe,
`l1-fig11-verifier-les-dimensions`, dans la page 11.

CE QUE LA PASSE DU 17 SEPTEMBRE A CHANGÉ ICI.

`LappartementDevientUnVecteur` : les libellés « surface : », « pièces : », « la
surface, en m² », « le nombre de pièces » et la ligne « deux nombres, et plus
aucun dessin » sont partis. Restent le plan, deux valeurs en brique, et les
noms que la page 3 donne à ces deux nombres — x indice 1 et x indice 2. Le plan
fait 4,20 unités de haut sur les 6,3 que le bandeau laisse, soit 67 %, et le
vecteur qui lui succède en fait 4,0.

`LaSommePonderee` : il ne reste que la seconde moitié, celle où w1 tourne. La
barre était horizontale et haute de 0,44 unité — 5 % du cadre, illisible sur
une planche-contact. Elle est debout : elle monte de 1,03 unité pour z = 65 à
5,40 pour z = 340, et c'est sa hauteur qu'on regarde changer. La ligne de
calcul écrite et les deux gloses en français sont parties.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Brace,
    Create,
    FadeIn,
    FadeOut,
    GrowFromCenter,
    Line,
    MathTex,
    Rectangle,
    Square,
    Transform,
    VGroup,
    ValueTracker,
    Write,
    always_redraw,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    ENCRE_75,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "lappartement-devient-un-vecteur",
        "scene": "LappartementDevientUnVecteur",
        "titre": "Un appartement devient un vecteur",
        "duree": 17,
        "alt": (
            "À gauche, le plan d'un appartement : un rectangle qu'une "
            "cloison percée d'une porte partage en deux pièces, chacune "
            "numérotée en brique, un et deux. Sous le plan se lisent ses "
            "deux grandeurs, cinquante mètres carrés et deux pièces. À "
            "droite, l'entrée x est une colonne de deux nombres entre "
            "crochets, d'abord vide. Les deux valeurs quittent le plan et "
            "viennent s'y ranger, cinquante sur la première ligne et deux "
            "sur la seconde, chacune en regard de son nom, x indice un et x "
            "indice deux. Le dessin disparaît alors, le vecteur grandit "
            "jusqu'à occuper le cadre, une accolade compte ses lignes et "
            "donne d égale deux, et l'écriture x égale cinquante point-virgule "
            "deux, appartenant à R deux, se pose dessous. Ce sont les deux "
            "nombres du plan, et ce sont les seuls qui restent de lui."
        ),
        "notions": [
            "vecteur de caractéristiques",
            "représentation des données",
            "dimension",
        ],
        "ce qui change dans le temps": (
            "Le trajet des deux nombres, qui quittent le plan et vont se ranger "
            "entre les crochets. Ce qui varie est la LOCALISATION de "
            "l'information : elle était dans un dessin, elle finit dans une "
            "colonne, et rien ne s'est perdu en route."
        ),
    },
    {
        "id": "la-somme-ponderee",
        "scene": "LaSommePonderee",
        "titre": "La somme pondérée, quand w₁ tourne",
        "duree": 15,
        "alt": (
            "Une barre verticale est faite de trois segments empilés, un par "
            "terme de la somme pondérée : le biais b, qui vaut vingt, en "
            "encre pâle tout en bas ; le terme w indice deux fois x indice "
            "deux, qui vaut vingt aussi, en encre au-dessus ; et le terme w "
            "indice un fois x indice un, en brique, tout en haut. Une échelle "
            "graduée de zéro à trois cents la longe à gauche, et la valeur z "
            "se lit en brique à hauteur du sommet de la barre. Le poids w "
            "indice un, écrit en brique à droite, varie de zéro virgule cinq "
            "à six : le segment de brique s'allonge d'autant, le sommet de la "
            "barre monte, et z va de soixante-cinq à trois cent quarante. La "
            "ligne du bas rappelle qu'une unité de plus sur w indice un "
            "déplace z de cinquante."
        ),
        "notions": [
            "somme pondérée",
            "poids",
            "biais",
            "neurone formel",
        ],
        "ce qui change dans le temps": (
            "Le poids w1, balayé de 0,5 à 6, et avec lui la hauteur du segment "
            "de brique et la valeur de z, de 65 à 340. C'est la PENTE de cette "
            "variation qui est l'idée : une unité de plus sur w1 déplace z de "
            "50."
        ),
    },
]


def pos(x: float, y: float = 0.0):
    """Un point du cadre, en coordonnées de scène. Le cadre fait 14,2 sur 8."""
    return RIGHT * x + UP * y


def _case(largeur: float, hauteur: float) -> Rectangle:
    """Une case vide, à l'encre, sans arrondi : la règle de l'identité."""
    return Rectangle(
        width=largeur,
        height=hauteur,
        color=ENCRE,
        stroke_width=TRAIT_COTE,
        fill_opacity=0,
    )


# ── Scène 1 : l'appartement devient un vecteur ──────────────────────────────
#
# LE PLAN EST LE SUJET tant qu'il est là : 6,90 sur 4,20, soit 67 % de la
# hauteur que le bandeau laisse. Il s'arrête à 0,45 du centre ; la colonne du
# vecteur commence à 2,10, et les deux ne se rencontrent jamais.

PLAN_X, PLAN_Y = -3.00, -0.25
PLAN_L = 6.90
PLAN_H = PLAN_L * 2.8 / 4.6


class LappartementDevientUnVecteur(SceneN7):
    titre = "L'appartement devient un vecteur"

    def construct(self) -> None:
        self.poser_titre(taille=24)
        self.next_section("Le plan")

        gauche = PLAN_X - PLAN_L / 2
        droite = PLAN_X + PLAN_L / 2
        bas = PLAN_Y - PLAN_H / 2
        haut = PLAN_Y + PLAN_H / 2

        murs = _case(PLAN_L, PLAN_H).move_to(pos(PLAN_X, PLAN_Y))
        # La cloison, percée d'une porte : deux segments et un vide entre eux.
        cloison = VGroup(
            Line(pos(PLAN_X, bas), pos(PLAN_X, PLAN_Y - 0.60),
                 color=ENCRE, stroke_width=TRAIT_COTE),
            Line(pos(PLAN_X, PLAN_Y + 0.28), pos(PLAN_X, haut),
                 color=ENCRE, stroke_width=TRAIT_COTE),
        )
        centre_g = (gauche + PLAN_X) / 2
        centre_d = (PLAN_X + droite) / 2

        self.play(Create(murs), run_time=1.0)
        self.play(Create(cloison), run_time=0.7)

        # La colonne vide se dessine TÔT. Tracée à la fin, elle laissait la
        # moitié droite du cadre vide pendant le premier tiers de la scène, et
        # les deux nombres partaient vers nulle part.
        x_g, x_d, y_c, demi = 2.60, 4.10, 0.35, 1.15

        def crochet(x: float, sens: float) -> VGroup:
            return VGroup(
                Line(pos(x, y_c - demi), pos(x, y_c + demi),
                     color=ENCRE, stroke_width=TRAIT_COTE),
                Line(pos(x, y_c + demi), pos(x + sens * 0.26, y_c + demi),
                     color=ENCRE, stroke_width=TRAIT_COTE),
                Line(pos(x, y_c - demi), pos(x + sens * 0.26, y_c - demi),
                     color=ENCRE, stroke_width=TRAIT_COTE),
            )

        crochets = VGroup(crochet(x_g, 1.0), crochet(x_d, -1.0))
        etq_x = MathTex(r"x \;=", color=ENCRE, font_size=44)
        etq_x.move_to(pos(x_g - 0.34, y_c), aligned_edge=RIGHT)
        self.play(Create(crochets), Write(etq_x), run_time=0.9)

        # ── La première grandeur : la surface ───────────────────────────────
        self.next_section("La surface")
        remplissage = Rectangle(
            width=PLAN_L,
            height=PLAN_H,
            color=ENCRE_30,
            stroke_width=0,
            fill_opacity=1.0,
        ).move_to(pos(PLAN_X, PLAN_Y))
        self.play(FadeIn(remplissage), run_time=0.7)
        self.bring_to_back(remplissage)

        # LES DEUX GRANDEURS SONT DES VALEURS, PAS DES LIGNES DE FORMULAIRE.
        # « surface : 50 m² » et « pièces : 2 » posaient deux étiquettes de
        # texte courant sous le plan pour dire ce que la page dit déjà ; les
        # deux nombres suffisent, avec leur unité.
        nb_surface = self.cote("50 m²", taille=34)
        nb_surface.move_to(pos(centre_g, bas - 0.52))
        self.play(FadeIn(nb_surface), run_time=0.6)
        self.wait(0.4)

        # ── La seconde grandeur : le nombre de pièces ───────────────────────
        self.next_section("Les pièces")
        numeros = VGroup()
        for indice, centre in ((1, centre_g), (2, centre_d)):
            eclat = Rectangle(
                width=(PLAN_L / 2) - 0.14,
                height=PLAN_H - 0.14,
                color=BRIQUE,
                stroke_width=0,
                fill_opacity=0.22,
            ).move_to(pos(centre, PLAN_Y))
            chiffre = self.cote(str(indice), taille=40)
            chiffre.move_to(pos(centre, haut - 0.52))
            self.play(FadeIn(eclat), FadeIn(chiffre), run_time=0.4)
            self.play(FadeOut(eclat), run_time=0.3)
            numeros.add(chiffre)

        nb_pieces = self.cote("2 pièces", taille=34)
        nb_pieces.move_to(pos(centre_d, bas - 0.52))
        self.play(FadeIn(nb_pieces), run_time=0.6)
        self.wait(0.5)

        # ── Les nombres quittent le dessin ──────────────────────────────────
        self.next_section("Les nombres s'en vont")
        milieu_x = (x_g + x_d) / 2
        haut_slot, bas_slot = y_c + 0.50, y_c - 0.50

        self.play(
            Transform(
                nb_surface,
                self.cote("50", taille=40).move_to(pos(milieu_x, haut_slot)),
            ),
            run_time=1.2,
        )
        self.play(
            Transform(
                nb_pieces,
                self.cote("2", taille=40).move_to(pos(milieu_x, bas_slot)),
            ),
            run_time=1.0,
        )

        # LES DEUX LIGNES PORTENT LEUR NOM DU COURS, pas leur glose. La page 3
        # écrit « x indice 1 égale 50, x indice 2 égale 2 » : ce sont ces deux
        # symboles-là que le lecteur doit reconnaître ensuite.
        libelles = VGroup(
            MathTex(r"x_1", color=ENCRE_75, font_size=36)
            .move_to(pos(x_d + 0.55, haut_slot), aligned_edge=LEFT),
            MathTex(r"x_2", color=ENCRE_75, font_size=36)
            .move_to(pos(x_d + 0.55, bas_slot), aligned_edge=LEFT),
        )
        self.play(FadeIn(libelles), run_time=0.7)
        self.wait(1.2)

        # ── Le dessin disparaît ─────────────────────────────────────────────
        self.next_section("Il ne reste que le vecteur")
        dessin = VGroup(murs, cloison, remplissage, numeros)
        self.play(FadeOut(dessin), run_time=0.9)

        vecteur = VGroup(etq_x, crochets, nb_surface, nb_pieces, libelles)
        self.play(
            vecteur.animate.move_to(pos(-1.30, 0.55)).scale(1.7),
            run_time=1.2,
        )

        accolade = Brace(crochets, RIGHT, color=ENCRE_55)
        compte = MathTex(r"d = 2", color=BRIQUE, font_size=44)
        compte.next_to(accolade, RIGHT, buff=0.28)
        self.play(GrowFromCenter(accolade), FadeIn(compte), run_time=0.8)

        ecriture = MathTex(
            r"x = (50\,;\,2) \;\in\; \mathbb{R}^{2}", color=ENCRE, font_size=42
        ).move_to(pos(0, -2.85))
        self.play(Write(ecriture), run_time=1.1)
        self.wait(2.2)


# ── Scène 2 : la somme pondérée ─────────────────────────────────────────────
#
# LA BARRE EST DEBOUT. Couchée, elle faisait 0,44 unité de haut sur les 6,3 que
# le bandeau laisse : 7 %, et sur une planche-contact il ne restait qu'un trait.
# Debout, elle monte de 1,03 unité pour z = 65 à 5,40 pour z = 340, et c'est sa
# HAUTEUR que le balayage fait changer — la grandeur que l'œil lit le mieux.

X1, X2 = 50.0, 2.0
W1_DEPART, W2, BIAIS = 3.0, 10.0, 20.0

X_BARRE = -3.55  # l'axe de la barre
L_BARRE = 1.70
Y_SOL = -2.90  # la ligne de zéro
Z_MAX = 340.0  # la valeur atteinte à w1 = 6
H_MAX = 5.40  # ce qu'elle mesure alors, en unités de cadre
ECHELLE = H_MAX / Z_MAX
X_ECHELLE = -4.85  # l'axe gradué, à gauche de la barre
X_COLONNE = 0.70  # le bord gauche de la colonne de droite


def _z_de(w1: float) -> float:
    return w1 * X1 + W2 * X2 + BIAIS


# Les valeurs que la leçon cite, recalculées.
assert abs(_z_de(3.0) - 190.0) < 1e-9
assert abs(_z_de(0.5) - 65.0) < 1e-9
assert abs(_z_de(6.0) - 340.0) < 1e-9
assert abs(_z_de(4.0) - _z_de(3.0) - 50.0) < 1e-9


class LaSommePonderee(SceneN7):
    titre = "La somme pondérée"

    def construct(self) -> None:
        self.poser_titre(taille=24)
        # LA SCENE COMMENCE OU ELLE MONTRE QUELQUE CHOSE BOUGER.
        #
        # Elle ouvrait sur la somme construite terme par terme : trois
        # colonnes, un filet, une note, un cadre, puis « z = 190 » — une minute
        # et demie où rien ne répondait à rien, et que le paragraphe voisin dit
        # déjà. Tout cela est parti ; il reste ce qu'aucune phrase ne remplace :
        # w1 tourne, et la barre suit.
        self.next_section("On fait varier w1")

        w = ValueTracker(W1_DEPART)

        # TOUS les nombres affichés se déduisent du w1 ARRONDI, pas du w1 réel.
        # Sinon l'écran se contredit : à w = 5,86, l'étiquette du poids
        # affichait « 5,9 » et la cote au sommet annonçait 333 au lieu de 335.
        # Un étudiant qui met l'image en pause y voit une faute de calcul.
        def w_lu() -> float:
            return round(w.get_value(), 1)

        # ── L'échelle des valeurs, à gauche de la barre ─────────────────────
        axe = Line(
            pos(X_ECHELLE, Y_SOL),
            pos(X_ECHELLE, Y_SOL + H_MAX + 0.20),
            color=ENCRE_55,
            stroke_width=TRAIT_FILET,
        )
        echelle = VGroup(axe)
        for valeur in (0, 100, 200, 300):
            y = Y_SOL + valeur * ECHELLE
            echelle.add(
                Line(pos(X_ECHELLE - 0.14, y), pos(X_ECHELLE, y),
                     color=ENCRE_55, stroke_width=TRAIT_FILET)
            )
            echelle.add(
                self.etiquette(str(valeur), taille=26, couleur=ENCRE_75)
                .move_to(pos(X_ECHELLE - 0.20, y), aligned_edge=RIGHT)
            )
        sol = Line(
            pos(X_ECHELLE, Y_SOL), pos(X_BARRE + L_BARRE / 2 + 0.30, Y_SOL),
            color=ENCRE_55, stroke_width=TRAIT_FILET,
        )
        self.play(Create(echelle), Create(sol), run_time=1.0)

        # ── La barre : trois segments empilés, le mobile au sommet ──────────
        def barres() -> VGroup:
            groupe = VGroup()
            depart = Y_SOL
            for valeur, couleur in (
                (BIAIS, ENCRE_30),
                (W2 * X2, ENCRE_75),
                (w.get_value() * X1, BRIQUE),
            ):
                hauteur = max(valeur * ECHELLE, 0.012)
                segment = Rectangle(
                    width=L_BARRE, height=hauteur, color=couleur,
                    stroke_width=0, fill_opacity=1.0,
                )
                segment.move_to(pos(X_BARRE, depart + hauteur / 2))
                groupe.add(segment)
                depart += hauteur
            return groupe

        def sommet() -> VGroup:
            # Le trait suit le w1 réel, pour glisser sans à-coups ; la cote
            # affiche le z du w1 arrondi, pour concorder avec l'étiquette du
            # poids. L'écart entre les deux vaut au plus 0,05 × 50 × ECHELLE,
            # soit quatre centièmes d'unité : invisible.
            y = Y_SOL + _z_de(w.get_value()) * ECHELLE
            trait = Line(
                pos(X_BARRE - L_BARRE / 2, y),
                pos(X_BARRE + L_BARRE / 2 + 0.34, y),
                color=BRIQUE, stroke_width=TRAIT_COTE,
            )
            nom = MathTex(r"z \;=", color=BRIQUE, font_size=34)
            valeur = self.cote(f"{_z_de(w_lu()):.0f}", taille=34)
            lecture = VGroup(nom, valeur).arrange(RIGHT, buff=0.18)
            lecture.move_to(
                pos(X_BARRE + L_BARRE / 2 + 0.52, y), aligned_edge=LEFT
            )
            return VGroup(trait, lecture)

        barre = always_redraw(barres)
        bout = always_redraw(sommet)
        self.play(FadeIn(barre), run_time=0.8)
        self.add(bout)

        # ── La colonne de droite : le poids, et la lecture des trois parts ──
        nom_w = MathTex(r"w_1 \;=", color=BRIQUE, font_size=48)
        nom_w.move_to(pos(X_COLONNE, 2.05), aligned_edge=LEFT)
        val_w = always_redraw(
            lambda: self.cote(
                f"{w_lu():.1f}".replace(".", ","), taille=46
            ).next_to(nom_w, RIGHT, buff=0.26)
        )

        def _puce(couleur: str, formule_tex: str) -> VGroup:
            carre = Square(side_length=0.34, color=couleur,
                           stroke_width=0, fill_opacity=1.0)
            return VGroup(
                carre,
                MathTex(formule_tex, color=ENCRE_75, font_size=32),
            ).arrange(RIGHT, buff=0.22)

        legende = VGroup(
            _puce(BRIQUE, r"w_1x_1"),
            _puce(ENCRE_75, r"w_2x_2 = 20"),
            _puce(ENCRE_30, r"b = 20"),
        ).arrange(DOWN, buff=0.42, aligned_edge=LEFT)
        legende.move_to(pos(X_COLONNE, 0.05), aligned_edge=LEFT)

        self.play(FadeIn(nom_w), run_time=0.5)
        self.add(val_w)
        self.play(FadeIn(legende, lag_ratio=0.3), run_time=0.8)
        self.wait(0.6)

        self.play(w.animate.set_value(0.5), run_time=2.0)
        self.wait(0.5)
        self.play(w.animate.set_value(6.0), run_time=3.6)
        self.wait(0.5)
        self.play(w.animate.set_value(3.0), run_time=2.0)

        lecon = MathTex(
            r"w_1 + 1 \;\longrightarrow\; z + 50", color=BRIQUE, font_size=40
        )
        lecon.move_to(pos(X_COLONNE, -2.45), aligned_edge=LEFT)
        self.play(FadeIn(lecon), run_time=0.7)
        self.wait(2.0)
