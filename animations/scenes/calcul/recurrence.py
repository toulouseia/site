"""
Chapitre 5 · La récurrence descend les barreaux, et le produit déroulé.

Une scène. Le signal d'erreur descend les trois couches du réseau minuscule,
δ³ puis δ² puis δ¹ ; le produit déroulé s'écrit alors d'un trait et donne le
même nombre, à zéro près.

Nombres : `cours/lecon5/mesures.py`, mesure 1, par `scenes/calcul/calcul_mob.py`.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    FadeIn,
    Line,
    VGroup,
)

from scenes.calcul.calcul_mob import (
    DELTA1,
    DELTA2,
    DELTA3,
    ECART_COROLLAIRE,
    PRODUIT_DEROULE,
    TAILLE_CORPS,
    nombre,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "la-recurrence-se-deroule",
        "scene": "LaRecurrenceSeDeroule",
        "titre": "Le signal descend les trois couches",
        "bandeau": "MESURE 1",
        "section": "Page 8 · La récurrence de la proposition 4, et son corollaire",
        "geste": "signal d'erreur qui descend les barreaux d'une couche à l'autre",
        "notions": [
            "geste : signal d'erreur qui descend les barreaux d'une couche à l'autre",
            "récurrence",
            "proposition 4",
            "produit déroulé",
        ],
        "legende": (
            "Trois barreaux, un par couche. Le signal d'erreur se pose sur le "
            "premier, descend sur le deuxième en passant par w³ et φ′(z²), "
            "puis sur le troisième. Le produit déroulé donne ensuite le même "
            "nombre d'un seul trait."
        ),
        "mouvement": [
            "1. Trois barreaux horizontaux sont posés l'un sous l'autre.",
            "2. δ³ s'inscrit sur le barreau du haut, avec sa valeur.",
            "3. Les deux facteurs de la descente s'inscrivent entre les "
            "barreaux, et δ² se pose sur le deuxième.",
            "4. La même descente mène à δ¹ sur le troisième barreau.",
            "5. Le produit déroulé s'écrit sous les barreaux et porte la même "
            "valeur que δ¹ ; l'écart s'inscrit à zéro.",
        ],
        "ecran": [
            "MESURE 1",
            "δ³", "δ²", "δ¹",
            "−0,154465", "−0,308931", "−0,463396",
            "× w³ × φ′(z²)", "× w² × φ′(z¹)",
            "(a³ − y) × w³ × φ′(z²) × w² × φ′(z¹) × x",
            "écart 0",
        ],
        "nombres": {
            "delta3": -0.154465, "delta2": -0.308931, "delta1": -0.463396,
            "deroule": -0.463396, "ecart": 0,
        },
        "alt": (
            "Trois segments horizontaux épais sont posés l'un au-dessus de "
            "l'autre, régulièrement espacés, occupant la hauteur de l'écran. "
            "Sur le segment du haut s'inscrit le symbole delta exposant trois "
            "à gauche et, à droite, sa valeur en brique : moins zéro virgule "
            "cent cinquante-quatre mille quatre cent soixante-cinq. Entre le "
            "premier et le deuxième segment apparaît alors un facteur, fois w "
            "exposant trois fois phi prime de z exposant deux, et un trait "
            "brique descend du premier barreau au second, où delta exposant "
            "deux s'inscrit avec sa valeur, moins zéro virgule trois cent huit "
            "mille neuf cent trente et un — le double de la précédente. Le "
            "même mouvement se répète vers le troisième barreau, portant "
            "delta exposant un et moins zéro virgule quatre cent soixante-trois "
            "mille trois cent quatre-vingt-seize. Les trois barreaux pâlissent "
            "alors, et une seule longue expression s'écrit sous eux, produit "
            "de six facteurs ; à son extrémité paraît la même valeur que celle "
            "du dernier barreau, et au-dessous la mention d'un écart nul."
        ),
    },
]

# Trois barreaux, et l'écart entre eux. La composition doit rester plus haute
# que large une fois la longue ligne du produit posée dessous : c'est elle qui
# fixe la largeur, et l'écart des barreaux qui rattrape la hauteur.
BARREAU = 4.8
ETAGE = 1.55
ORDONNEES = (1.75, 0.20, -1.35)


class LaRecurrenceSeDeroule(SceneN7):
    titre = "Mesure 1"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        symboles = ("δ³", "δ²", "δ¹")
        valeurs = (DELTA3, DELTA2, DELTA1)
        # LES DEUX FACTEURS DE LA DESCENTE, écrits comme la proposition 4 les
        # écrit. Ils ne portent aucun nombre : ce sont eux qui font passer
        # d'une valeur mesurée à la suivante, et les deux valeurs, elles, sont
        # imprimées par la mesure 1 (lignes 186, 190 et 194).
        facteurs = ("× w³ × φ′(z²)", "× w² × φ′(z¹)")

        barreaux, noms, cotes = VGroup(), VGroup(), VGroup()
        for rang, y in enumerate(ORDONNEES):
            barre = Line(
                LEFT * BARREAU / 2 + UP * y,
                RIGHT * BARREAU / 2 + UP * y,
                stroke_width=TRAIT_COTE,
                color=ENCRE_30,
            )
            barreaux.add(barre)

            nom = self.etiquette(symboles[rang], taille=TAILLE_CORPS,
                                 couleur=ENCRE)
            nom.next_to(barre, LEFT, buff=0.32)
            noms.add(nom)

            cote = self.cote(nombre(valeurs[rang], 6), taille=TAILLE_CORPS)
            cote.next_to(barre, UP, buff=0.18)
            cote.set_x(barre.get_right()[0] - cote.width / 2 - 0.15)
            cotes.add(cote)

        liens, libelles_facteurs = VGroup(), VGroup()
        for rang, texte in enumerate(facteurs):
            lien = Line(
                barreaux[rang].get_center() + DOWN * 0.06,
                barreaux[rang + 1].get_center() + UP * 0.06,
                stroke_width=TRAIT_FILET,
                color=ENCRE_30,
            )
            lien.set_x(barreaux[rang].get_left()[0] + 1.0)
            liens.add(lien)

            libelle = self.etiquette(texte, taille=TAILLE_CORPS,
                                     couleur=ENCRE)
            libelle.move_to(
                (barreaux[rang].get_center() + barreaux[rang + 1].get_center()) / 2
            )
            libelle.set_x(lien.get_center()[0] + libelle.width / 2 + 0.35)
            libelles_facteurs.add(libelle)

        # LE PRODUIT DÉROULÉ. Six facteurs, dans l'ordre exact où la mesure 1
        # les imprime (mesures.py:200). C'est cette ligne qui fixe la largeur
        # du sujet, et c'est voulu : elle est l'argument du corollaire.
        produit = self.etiquette(
            "(a³ − y) × w³ × φ′(z²) × w² × φ′(z¹) × x",
            taille=TAILLE_CORPS, couleur=ENCRE,
        )
        produit.move_to(UP * (ORDONNEES[2] - ETAGE + 0.22))

        resultat = self.cote(nombre(PRODUIT_DEROULE, 6), taille=TAILLE_CORPS)
        resultat.next_to(produit, DOWN, buff=0.34)

        ecart = self.etiquette(f"écart {ECART_COROLLAIRE}", taille=TAILLE_CORPS,
                               couleur=ENCRE_55)
        ecart.next_to(resultat, DOWN, buff=0.30)

        sujet = VGroup(barreaux, noms, cotes, liens, libelles_facteurs,
                       produit, resultat, ecart)
        self.poser_sujet(sujet)

        cotes.set_opacity(0.0)
        liens.set_opacity(0.0)
        libelles_facteurs.set_opacity(0.0)
        produit.set_opacity(0.0)
        resultat.set_opacity(0.0)
        ecart.set_opacity(0.0)
        noms[1].set_opacity(0.0)
        noms[2].set_opacity(0.0)

        self.play(Create(barreaux), run_time=1.0)

        self.next_section("δ³ se pose sur le premier barreau")
        self.play(
            noms[0].animate.set_color(BRIQUE),
            cotes[0].animate.set_opacity(1.0),
            barreaux[0].animate.set_stroke(ENCRE_55),
            run_time=0.85,
        )
        self.wait(0.7)

        for rang in range(2):
            self.next_section(f"La descente vers δ{'²¹'[rang]}")
            # Le barreau qui vient d'être lu retombe à l'encre pâlie : à
            # chaque trame, un seul δ est affirmé.
            self.play(
                noms[rang].animate.set_color(ENCRE_55),
                cotes[rang].animate.set_color(ENCRE_55),
                run_time=0.25,
            )
            self.play(
                libelles_facteurs[rang].animate.set_opacity(1.0),
                run_time=0.55,
            )
            self.play(
                liens[rang].animate.set_opacity(1.0).set_stroke(BRIQUE, opacity=0.9),
                run_time=0.45,
            )
            self.play(
                noms[rang + 1].animate.set_opacity(1.0).set_color(BRIQUE),
                cotes[rang + 1].animate.set_opacity(1.0),
                barreaux[rang + 1].animate.set_stroke(ENCRE_55),
                run_time=0.7,
            )
            self.play(
                liens[rang].animate.set_stroke(ENCRE_30, opacity=1.0),
                libelles_facteurs[rang].animate.set_color(ENCRE_55),
                run_time=0.3,
            )
            self.wait(0.6)

        self.next_section("Le produit déroulé donne le même nombre")
        self.play(
            noms[2].animate.set_color(ENCRE_55),
            cotes[2].animate.set_color(ENCRE_55),
            run_time=0.3,
        )
        self.play(produit.animate.set_opacity(1.0), run_time=0.9)
        self.play(resultat.animate.set_opacity(1.0), run_time=0.7)
        self.wait(0.5)

        # LES DEUX NOMBRES SONT REMIS EN REGARD. Le corollaire ne dit pas que
        # le produit est « juste » : il dit qu'il vaut la récurrence. Les deux
        # cotes reviennent donc en brique ensemble, et l'écart les sépare.
        self.play(
            cotes[2].animate.set_color(BRIQUE),
            resultat.animate.set_color(BRIQUE),
            run_time=0.5,
        )
        self.play(FadeIn(ecart), run_time=0.6)
        self.wait(1.8)
