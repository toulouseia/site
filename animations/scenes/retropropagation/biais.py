"""
Chapitre 4 · page 4 · Le biais ne passe par rien.

Une scène. On pousse le biais du neurone de sortie de la classe 2, et la somme
pondérée de ce neurone monte de la même quantité — pas d'un multiple, pas d'une
fraction : de la même. C'est ce que veut dire « son effet ne passe par rien », et
c'est pourquoi sa dérivée est δ₂ sans facteur.

Les nombres viennent de `cours/lecon4/mesures.py`, mesure 3. Le déplacement lui
aussi : la somme après la poussée est recalculée par `mesures.avant`, jamais
additionnée à la main.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    RIGHT,
    UP,
    FadeIn,
    Line,
    MathTex,
    Rectangle,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import BRIQUE, ENCRE_75, TRAIT_COTE, appliquer_style
from scenes.retropropagation.retro_mob import (
    CLASSE,
    CORPS_MATH,
    Barres,
    RetroScene,
    mesures_du_chapitre,
    nombre,
)

appliquer_style()

#: De combien on pousse le biais. La valeur est arbitraire — c'est un geste,
#: pas une mesure — et elle est donc choisie pour se voir : trois dixièmes
#: font huit dixièmes d'unité à l'écran, assez pour comparer deux segments à
#: l'œil. Ce qui est mesuré, c'est ce que la somme fait ENSUITE.
POUSSEE = 0.30


ANIMATIONS = [
    {
        "id": "le-biais-ne-passe-par-rien",
        "scene": "LeBiaisNePasseParRien",
        "titre": "On pousse le biais, la somme suit d'autant",
        "notions": [
            "biais",
            "dérivée partielle",
            "somme pondérée",
            "proposition 3",
        ],
        "alt": (
            "Le réseau pâlit, puis le troisième rond de la colonne de sortie "
            "et son étiquette passent au trait de brique. Dans la bande libre, "
            "à droite de ce neurone, deux barres verticales se dressent sur une "
            "même ligne de base : la première, celle du biais, est plate — elle "
            "vaut zéro ; la seconde, celle de la somme pondérée, monte aux trois "
            "quarts de la hauteur disponible. Sous chacune, son nom est "
            "composé. Un segment de brique pousse alors depuis la ligne sur la "
            "première barre, et au même instant un second segment de brique, "
            "exactement aussi long, pousse au sommet de la seconde. Les deux "
            "s'arrêtent ensemble ; un trait de brique marque le bout de chacun, "
            "et au-dessus de chaque trait s'inscrit la même valeur, plus zéro "
            "virgule trois mille. Pendant que les segments montent, le rond de "
            "sortie en brique s'assombrit."
        ),
    },
]


class LeBiaisNePasseParRien(RetroScene):
    """
    Pousser b²₂ de trois dixièmes fait monter z²₂ de trois dixièmes.

    POURQUOI DEUX BARRES ET NON UN ENGRENAGE. L'ancienne scène de cette page
    montrait trois engrenages attaquant une même roue, celui du biais ayant le
    même nombre de dents. Un engrenage n'est pas une dérivée partielle : il
    ajoute une mécanique à comprendre avant de comprendre le fait, et il ne
    porte aucun nombre. Deux segments de même longueur portent le fait entier.

    L'ÉCHELLE EST COMMUNE AUX DEUX BARRES, et c'est tout l'argument : si le
    segment du biais et celui de la somme n'étaient pas mesurés sur la même
    échelle, leur égalité ne voudrait rien dire. `Barres(echelle=…)` la fixe
    une fois, sur la somme APRÈS la poussée, pour que rien ne sorte du cadre.

    LA SOMME APRÈS LA POUSSÉE EST RECALCULÉE, jamais additionnée. Écrire
    `z + 0,30` supposerait ce que la scène prétend montrer. `mesures.avant`
    refait la propagation sur le θ poussé, et l'assertion finale vérifie que
    l'écart obtenu est bien la poussée.
    """

    titre = "Le biais"
    montrer_grille = False

    #: La ligne de base, et la hauteur que la somme poussée occupera.
    #:
    #: LA LIGNE EST REMONTÉE À −2,75 POUR LES NOMS. Composés à `CORPS_MATH`,
    #: « b₂^[2] » et « z₂^[2] » font 0,49 unité de haut, indices et exposants
    #: compris ; posés à 0,20 sous une ligne à −2,90, ils descendaient à −3,59
    #: et mordaient la demi-unité de marge. À −2,75 ils s'arrêtent à −3,44.
    #:
    #: L'objet couvre alors 4,49 unités, du bas des noms au haut de la cote,
    #: soit 71 % de la hauteur du cadre.
    Y_ZERO = -2.75
    HAUTEUR = 3.40

    #: L'abscisse du milieu des deux barres : la bande libre à DROITE des dix
    #: chiffres de la sortie, qui s'arrêtent à 2,96.
    #:
    #: POSÉES AU MILIEU DU CADRE, ELLES ÉTAIENT SUR LE RÉSEAU. Première version :
    #: à −1,5, donc à −2,1 et −0,9. Le crible a relevé trois recouvrements, tous
    #: dus à la même cause — la cote « +0,3000 » du segment de gauche tombait sur
    #: un rond de la colonne cachée, sur son accolade, et sur la seconde barre.
    #: Aucun réglage de la cote ne s'en sortait : la bande entre les colonnes
    #: fait 2,3 unité de large et la cote en demande 1,1.
    #:
    #: À droite, le sujet vit à côté du neurone dont il parle — ce qui vaut
    #: mieux que de vivre par-dessus le réseau.
    #:
    #: L'ÉCARTEMENT EST CELUI DE LA COTE, MESURÉ. « +0,3000 » composé à 24 en
    #: demi-gras fait 1,49 unité de large, et non 1,10 comme une estimation au
    #: caractère le donnait : à 2,4 de largeur totale, la cote de la barre de
    #: gauche atteignait 4,745 et mordait la barre de droite, qui commence à
    #: 4,72. Avec une largeur de 3,0, les deux barres sont à 1,5 l'une de
    #: l'autre et la cote s'arrête à 0,155 de la voisine.
    #:
    #: L'abscisse est alors bornée des deux côtés : la cote de gauche doit
    #: rester à droite des chiffres de la sortie, qui s'arrêtent à 2,96, et
    #: celle de droite doit tenir la marge à 6,61. Soit X_CENTRE entre 4,46 et
    #: 5,12 ; on prend le milieu.
    X_CENTRE = 4.75

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()
        mesures = m["mesures"]

        # mesure 3, « Le biais, et un poids » : `mesures.py:287-292`.
        # La somme pondérée du neurone de sortie de la classe 2, avant.
        z_avant = float(m["cache"]["z2"][CLASSE])
        b_avant = float(m["theta"]["b2"][CLASSE])

        # La même, après la poussée — repropagée, pas additionnée.
        theta_pousse = {cle: valeur.copy() for cle, valeur in m["theta"].items()}
        theta_pousse["b2"][CLASSE] += POUSSEE
        cache_pousse = mesures.avant(theta_pousse, m["x"])
        z_apres = float(cache_pousse["z2"][CLASSE])
        b_apres = float(theta_pousse["b2"][CLASSE])

        # Le réseau passe au décor, sauf le neurone dont on parle.
        rond = self.sortie.rond_du_rang(CLASSE)
        etiquette = self.etiquettes_sortie[CLASSE]
        self.sortie.ronds.become(
            self.sortie.allumer(m["a2"], maximum=float(cache_pousse["a2"].max()))
        )
        self.play(
            *self.animations_effacement(sauf=[rond, etiquette]),
            run_time=1.0,
        )
        # `animations_effacement` pâlit les dix chiffres de la sortie sans
        # regarder `sauf` — c'est le module gelé, et il a ses raisons. On
        # redésigne donc le neurone après coup : son rond et son chiffre
        # passent à la brique, sans boîte.
        self.play(*self.designer_sortie(CLASSE), run_time=0.6)
        self.wait(0.3)

        # Les deux barres, sur une seule ligne et une seule échelle.
        socle = Barres(
            [b_avant, z_avant],
            largeur=3.0,
            hauteur=self.HAUTEUR,
            echelle=z_apres,
            couleur=ENCRE_75,
            jeu=0.2,
        )
        socle.shift(UP * self.Y_ZERO + RIGHT * self.X_CENTRE)

        noms = VGroup(
            MathTex(r"b^{[2]}_2", font_size=CORPS_MATH, color=ENCRE_75),
            MathTex(r"z^{[2]}_2", font_size=CORPS_MATH, color=ENCRE_75),
        )
        for nom, barre in zip(noms, socle.barres):
            nom.next_to(socle.ligne, DOWN, buff=0.20)
            nom.set_x(barre.get_center()[0])

        self.play(FadeIn(socle), Write(noms), run_time=1.2)
        self.wait(0.6)

        # Les deux segments de brique : la poussée, et ce qu'elle produit. Ils
        # partent de zéro et montent ensemble ; c'est leur égalité de longueur
        # qui est le sujet, et elle se lit sans lire les cotes.
        montee = POUSSEE * socle.unite
        segments = VGroup()
        for barre, base in zip(socle.barres, (b_avant, z_avant)):
            segment = Rectangle(
                width=barre.width,
                height=montee,
                stroke_width=0.0,
            )
            segment.set_fill(BRIQUE, opacity=1.0)
            segment.move_to(
                [barre.get_center()[0], self.Y_ZERO + base * socle.unite, 0],
                aligned_edge=DOWN,
            )
            segments.add(segment)

        plats = segments.copy()
        for plat in plats:
            ancre = plat.get_bottom()
            plat.stretch_to_fit_height(1e-4)
            plat.move_to(ancre, aligned_edge=DOWN)

        self.add(plats)
        self.play(
            Transform(plats, segments),
            Transform(
                self.sortie.ronds,
                self.sortie.allumer(
                    cache_pousse["a2"], maximum=float(cache_pousse["a2"].max())
                ),
            ),
            run_time=2.0,
        )
        self.remove(plats)
        self.add(segments)
        self.wait(0.4)

        # Les deux extrémités, cotées de la même valeur. Deux fois le même
        # nombre : c'est la seule chose que la scène affirme.
        # LA COTE SE POSE AU-DESSUS DE SA MARQUE, jamais à côté. À droite, celle
        # du segment de gauche traverse la seconde barre ; à gauche, celle du
        # segment de droite revient sur la première. Au-dessus, chacune tient
        # dans la largeur de sa propre barre plus une demi-unité, et les deux
        # marques sont à 2,6 unités l'une de l'autre en hauteur.
        marques = VGroup()
        cotes = VGroup()
        for segment in segments:
            demi = segment.width / 2 + 0.16
            haut = segment.get_top()[1]
            x = segment.get_center()[0]
            marques.add(
                Line([x - demi, haut, 0], [x + demi, haut, 0],
                     stroke_width=TRAIT_COTE, color=BRIQUE)
            )
            cote = self.cote("+" + nombre(POUSSEE))
            cote.next_to(marques[-1], UP, buff=0.14)
            cotes.add(cote)

        self.play(FadeIn(marques), Write(cotes), run_time=0.9)
        self.wait(2.2)

        # Le contrôle : la somme a bougé de la poussée, exactement. Si un jour
        # ce n'est plus vrai, le rendu échoue au lieu de montrer deux segments
        # de longueurs différentes présentés comme égaux.
        ecart = abs((z_apres - z_avant) - POUSSEE)
        assert ecart < 1e-12, (
            f"la somme pondérée a bougé de {z_apres - z_avant:+.9f} pour une "
            f"poussée de {POUSSEE} : les deux segments de la scène ne sont pas "
            f"de la même longueur, écart {ecart:.3e}."
        )
        assert np.isclose(m["grads"]["b2"][CLASSE], m["delta2"][CLASSE]), (
            "la dérivée par rapport au biais n'est plus δ₂ : la page 4 et "
            "cette scène ne disent plus la même chose."
        )
