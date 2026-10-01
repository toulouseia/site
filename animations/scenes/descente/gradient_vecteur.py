"""
Chapitre 3 · le gradient, vu par ses composantes.

Une scène, un seul geste : la plus grande composante du gradient et la
composante médiane, dressées côte à côte À LA MÊME ÉCHELLE. Le rapport vaut
404. Dessiner la seconde à côté de la première, c'est ne pas la voir — et c'est
précisément ce qu'aucune phrase ne fait sentir.

Reprend `SOURCE.md` §7 et §8. La source montre six décimales entre crochets et
qualifie leurs amplitudes — « a little », « somewhat », « a lot ». Le chapitre
les mesure : là où elle écrit un adjectif, nous dressons 404.

Remplace `les-composantes-se-rangent` et `la-boussole-des-cent-mille`. La
boussole disait qu'une composante porte un signe et une amplitude ; le signe
s'écrit en une ligne, l'amplitude ne s'écrit pas — elle se voit.

CE QUI A ÉTÉ RETIRÉ, ET POURQUOI. Une seconde section montrait la part de la
norme portée par le 1 %, le 10 % puis la moitié des plus grandes composantes :
une colonne qui se remplissait en trois temps. Le rendu d'essai l'a tranché.
D'abord c'était une jauge, et la règle du chapitre écarte le compteur. Ensuite,
et surtout, ces trois parts S'ÉCRIVENT : « 1 % des composantes portent 14,55 %
de la norme » est une phrase complète, et la page la porte mieux qu'une vidéo de
trente secondes. Une animation est là pour ce qu'on ne peut pas écrire. Les
nombres restent dans `mesures.py`, ligne 341.

Les nombres affichés sortent de `cours/lecon3/mesures.py`, mesures 4 et 10,
lignes 329 à 332.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    UP,
    Brace,
    Create,
    FadeIn,
    Line,
    Rectangle,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    TRAIT_AXE,
    TRAIT_FILET,
    SceneN7,
    appliquer_style,
)
from scenes.descente.descente_mob import (
    MESURES,
    entier,
    nombre,
    verifier_la_part,
)

ANIMATIONS = [
    {
        "id": "le-gradient-par-ses-composantes",
        "scene": "LeGradientParSesComposantes",
        "titre": "Une composante sur deux ne pèse rien",
        "bandeau": "LES COMPOSANTES DU GRADIENT",
        "section": "Page 10 · Ce que le gradient encode, après la mesure des composantes",
        "geste": "deux barres à la même échelle, dont l'une est invisible",
        "notions": [
            "geste : deux barres à la même échelle, dont l'une est invisible",
            "gradient",
            "norme",
            "inégalité des composantes",
        ],
        "legende": (
            "La plus grande composante du gradient et la composante médiane se "
            "dressent côte à côte, à la même échelle : la première occupe toute "
            "la hauteur du cadre, la seconde n'est qu'un trait sur le socle. "
            "Les deux valeurs s'inscrivent, et une accolade porte leur rapport, "
            "404. Une cote sous le socle rappelle combien le vecteur a de "
            "composantes : 101 770."
        ),
        "mouvement": [
            "1. Un socle se dessine, coté par le nombre de composantes du "
            "vecteur.",
            "2. La barre de la plus grande composante monte jusqu'en haut du "
            "cadre ; sa valeur s'inscrit au-dessus.",
            "3. La barre de la composante médiane monte à côté, à la même "
            "échelle : elle n'atteint pas l'épaisseur d'un trait.",
            "4. Sa valeur s'inscrit, haut au-dessus d'elle, reliée par un "
            "mince trait d'appel — sinon elle serait posée sur le socle.",
            "5. Une accolade de brique court le long de la grande barre.",
            "6. Elle porte le rapport des deux : 404.",
        ],
        "ecran": ["0,10084", "0,00024935", "404", "101 770 composantes"],
        "nombres": {
            "p": 101770,
            "composante_max": 0.10084,
            "composante_mediane": 0.00024935,
            "rapport": 404,
        },
        "alt": (
            "Un socle horizontal se dessine au milieu de l'écran, et une cote "
            "s'inscrit dessous : cent un mille sept cent soixante-dix "
            "composantes. C'est la taille du vecteur gradient. Une barre large "
            "monte alors depuis ce socle et ne s'arrête qu'en haut du cadre ; "
            "sa valeur s'inscrit au-dessus, zéro virgule un zéro zéro huit "
            "quatre : c'est la plus grande des cent un mille composantes. Une "
            "seconde barre monte juste à côté, à la même échelle, et elle "
            "s'arrête si bas qu'on la prendrait pour un épaississement du "
            "socle : c'est la composante médiane, la valeur qui partage le "
            "vecteur en deux moitiés égales. Sa valeur ne peut pas s'inscrire "
            "au-dessus d'elle, il n'y a pas la place : elle s'inscrit haut "
            "au-dessus, zéro virgule zéro zéro zéro deux quatre neuf trois "
            "cinq, reliée à sa barre par un mince trait d'appel qui descend "
            "jusqu'au socle. Une accolade de brique court enfin le long de la "
            "grande barre, du socle jusqu'à son sommet, et porte un seul "
            "nombre : quatre cent quatre. C'est par là qu'il faut multiplier "
            "la seconde barre pour obtenir la première, et la moitié des "
            "composantes du gradient sont plus petites encore que la seconde."
        ),
    },
]


class LeGradientParSesComposantes(SceneN7):
    titre = "Les composantes du gradient"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        grande = float(MESURES["composante_max"])
        mediane = float(MESURES["composante_mediane"])

        # LA HAUTEUR DE LA PETITE N'EST PAS CHOISIE : elle est celle de la
        # grande, divisée par le rapport mesuré. C'est ce qui interdit à la
        # scène de « rendre la médiane visible » par confort — elle ne l'est
        # pas, et c'est le fait de la page.
        hauteur_grande = 4.7
        hauteur_petite = hauteur_grande * mediane / grande
        largeur, ecart = 1.5, 1.5
        bas = -2.55
        x_grande = -(ecart + largeur) / 2.0
        x_petite = (ecart + largeur) / 2.0

        self.next_section("Le socle, et la taille du vecteur")
        socle = Line(
            [x_grande - largeur / 2 - 0.6, bas, 0],
            [x_petite + largeur / 2 + 0.6, bas, 0],
            stroke_width=TRAIT_AXE,
            color=ENCRE,
        )
        combien = self.etiquette(
            f"{entier(int(MESURES['p']))} composantes", taille=24, couleur=ENCRE_55
        )
        combien.next_to(socle, DOWN, buff=0.26)
        self.play(Create(socle), FadeIn(combien), run_time=0.8)

        self.next_section("La plus grande composante")
        barre_grande = Rectangle(
            width=largeur, height=hauteur_grande,
            stroke_width=TRAIT_FILET, color=ENCRE_55,
        ).set_fill(ENCRE_30, opacity=1.0)
        barre_grande.move_to([x_grande, bas, 0], aligned_edge=DOWN)
        cote_grande = self.cote(nombre(grande, 5), taille=24)
        cote_grande.next_to(barre_grande, UP, buff=0.18)
        self.play(Create(barre_grande), run_time=1.2)
        self.play(Write(cote_grande), run_time=0.6)

        self.next_section("La composante médiane, à la même échelle")
        barre_petite = Rectangle(
            width=largeur, height=max(hauteur_petite, 0.014),
            stroke_width=TRAIT_FILET, color=ENCRE_55,
        ).set_fill(ENCRE_30, opacity=1.0)
        barre_petite.move_to([x_petite, bas, 0], aligned_edge=DOWN)
        self.play(Create(barre_petite), run_time=1.0)

        # SA COTE NE PEUT PAS SE POSER SUR ELLE : la barre fait onze millièmes
        # d'unité, et un texte posé dessus serait un texte posé sur le socle. On
        # la monte, et un trait d'appel dit de quoi elle parle. C'est le seul
        # ornement de la scène, et il est là parce que la mesure l'impose.
        cote_petite = self.cote(nombre(mediane, 8), taille=24)
        cote_petite.move_to([x_petite, bas + 1.25, 0])
        appel = Line(
            [x_petite, bas + 1.05, 0],
            [x_petite, bas + 0.10, 0],
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
        )
        self.play(Write(cote_petite), Create(appel), run_time=0.9)

        self.next_section("Le rapport des deux")
        accolade = Brace(barre_grande, LEFT, color=BRIQUE)
        rapport = self.cote(entier(int(MESURES["rapport"])), taille=24)
        rapport.next_to(accolade, LEFT, buff=0.18)
        self.play(FadeIn(accolade), run_time=0.7)
        self.play(Write(rapport), run_time=0.7)

        verifier_la_part(self, VGroup(socle, barre_grande), part=0.60)
        self.wait(2.2)


# ── Les nombres déclarés sont ceux de la table ──────────────────────────────

_declares = ANIMATIONS[0]["nombres"]
assert _declares["p"] == MESURES["p"]
assert _declares["composante_max"] == MESURES["composante_max"]
assert _declares["composante_mediane"] == MESURES["composante_mediane"]
assert _declares["rapport"] == MESURES["rapport"]

# La médiane n'est pas « une petite valeur » : c'est celle qui partage le vecteur
# en deux moitiés. La scène ne le dit pas, l'alt le dit, et l'ordre est vérifié.
assert MESURES["composante_mediane"] < MESURES["composante_max"]
