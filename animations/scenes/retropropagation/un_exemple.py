"""
Chapitre 4 · page 10 · N'écouter qu'un seul exemple.

Une scène. Deux cents pas de descente sur la SEULE image de travail, et le
réseau répond « 2 » aux dix mille images de test. Les dix barres qui comptent
les classes prédites se vident les unes après les autres dans celle de la
classe 2.

Les nombres viennent de `cours/lecon4/mesures.py`, mesure 4 : la boucle est
rejouée par `un_seul_exemple()`, avec les mêmes deux cents pas et le même pas
d'apprentissage.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    LEFT,
    RIGHT,
    FadeIn,
    Line,
    Rectangle,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import BRIQUE, ENCRE_55, ENCRE_75, TRAIT_FILET, appliquer_style
from scenes.retropropagation.retro_mob import (
    CLASSE,
    RetroScene,
    un_seul_exemple,
)

appliquer_style()

#: L'espace fine insécable du français. « 10 000 » avec une espace ordinaire se
#: coupe et se compose plus large ; la règle 24 demande le vrai caractère.
FINE = " "


ANIMATIONS = [
    {
        "id": "necouter-quun-seul",
        "scene": "NecouterQuUnSeul",
        "titre": "Deux cents pas sur une image, et tout devient 2",
        "notions": [
            "descente de gradient",
            "un seul exemple",
            "surapprentissage",
            "précision de test",
        ],
        "alt": (
            "La grille de l'image de travail apparaît à gauche, un deux "
            "manuscrit en gris sur vingt-huit cases sur vingt-huit, et le "
            "réseau derrière elle. La grille pâlit, et dix barres horizontales "
            "poussent depuis une ligne verticale tracée à droite des dix ronds "
            "de sortie, une par classe, chacune à la hauteur de son neurone et "
            "de son chiffre. Leurs longueurs sont très inégales : celle de la "
            "classe deux fait les sept dixièmes de l'espace libre, celles des "
            "classes zéro et cinq le huitième, les sept autres sont des "
            "moignons. Les neuf barres autres que celle de la classe deux se "
            "rétractent alors jusqu'à disparaître, pendant que celle de la "
            "classe deux s'allonge jusqu'au bout de l'espace libre et passe au "
            "brique. Sa valeur s'inscrit à son extrémité : dix mille. Les neuf "
            "autres barres ont entièrement disparu, et il ne reste qu'une "
            "seule barre en face des dix chiffres."
        ),
    },
]


class NecouterQuUnSeul(RetroScene):
    """
    Les classes prédites sur les dix mille images de test, avant et après.

    LES BARRES SONT COUCHÉES, ET ALIGNÉES SUR LES NEURONES. Une barre par
    classe, à la hauteur du rond de sortie qui porte cette classe : les dix
    chiffres du réseau sont alors les étiquettes des dix barres, et la scène
    n'a aucune étiquette à ajouter. C'est aussi ce qui permet de laisser au
    réseau ses cotes — le sujet ne passe jamais dessus, il vit à droite d'elles.

    L'ÉCHELLE EST CELLE DE L'ÉTAT FINAL, dix mille. Les barres de départ sont
    donc mesurées sur la même règle que celle d'arrivée, et l'on voit que
    sept mille quatre-vingt-dix-huit n'est pas dix mille. Une échelle
    renormalisée à chaque état aurait montré deux dessins incomparables.

    CE QUE LA SCÈNE CORRIGE. L'ancienne légende de cette page disait les images
    de test « classées d'abord au hasard ». Elles ne le sont pas : le réseau non
    entraîné en envoie déjà 7 098 sur 10 000 dans la classe 2. Ce que les deux
    cents pas produisent n'est pas le passage du hasard à l'uniforme, c'est le
    passage de 7 098 à 10 000 — et la disparition des neuf autres réponses.
    """

    titre = "Un seul exemple"

    #: La bande libre, à droite des dix chiffres de la sortie. Les chiffres
    #: s'arrêtent à 2,96 ; la barre part de 3,25. Sa longueur s'arrête à 2,00 et
    #: non à la marge : la cote de la barre pleine se pose à son extrémité, et
    #: il lui faut ses 0,94 unité. Une barre qui irait jusqu'à 6,45 pousserait
    #: sa cote au-delà du bord.
    X_DEPART = 3.25
    LONGUEUR = 2.00
    EPAISSEUR = 0.36

    def construct(self) -> None:
        self.bandeau(self.titre)
        u = un_seul_exemple()

        # mesure 4 : la boucle de `mesures.py:365-374`, et les prédictions de
        # `mesures.py:376-380`. Les deux répartitions sont comptées ici, jamais
        # recopiées.
        avant = np.bincount(u["avant"], minlength=10)
        apres = np.bincount(u["apres"], minlength=10)
        total = int(u["combien"])

        # L'image de travail, seule et à pleine opacité : c'est elle qu'on
        # écoute, et c'est tout ce qu'on écoute.
        self.poser_image_de_travail()
        self.play(FadeIn(self.grille), run_time=0.8)
        self.wait(1.4)

        # Le réseau et l'image passent au décor. Les dix chiffres de la sortie
        # restent : ils vont servir d'étiquettes aux dix barres.
        self.play(*self.animations_effacement(), run_time=1.0)

        axe = Line(
            [self.X_DEPART, self.sortie.ronds.get_top()[1], 0],
            [self.X_DEPART, self.sortie.ronds.get_bottom()[1], 0],
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
        )

        def poser(comptes, couleur) -> VGroup:
            groupe = VGroup()
            for k, rond in enumerate(self.sortie.ronds):
                longueur = self.LONGUEUR * float(comptes[k]) / float(total)
                barre = Rectangle(
                    width=max(longueur, 1e-4),
                    height=self.EPAISSEUR,
                    stroke_width=0.0,
                )
                barre.set_fill(couleur, opacity=1.0)
                barre.move_to(
                    [self.X_DEPART, float(rond.get_center()[1]), 0],
                    aligned_edge=LEFT,
                )
                groupe.add(barre)
            return groupe

        barres = poser(avant, ENCRE_75)
        plates = poser(np.zeros(10), ENCRE_75)

        self.add(axe, plates)
        self.play(FadeIn(axe), Transform(plates, barres), run_time=1.4)
        self.remove(plates)
        self.add(barres)
        self.wait(1.6)

        # Les deux cents pas. Neuf barres se rétractent, une se remplit : c'est
        # le même mouvement, et il se joue d'un seul tenant.
        self.next_section("Deux cents pas sur une seule image")
        arrivee = poser(apres, BRIQUE)
        for k in range(10):
            if k != CLASSE:
                arrivee[k].set_fill(ENCRE_75, opacity=1.0)
        self.play(Transform(barres, arrivee), run_time=3.0)
        self.wait(0.6)

        cote = self.cote(f"10{FINE}000")
        cote.next_to(arrivee[CLASSE], RIGHT, buff=0.18)
        self.play(Write(cote), run_time=0.7)
        self.wait(2.4)

        # Les contrôles de la mesure 4, sur les nombres.
        assert int(apres[CLASSE]) == total, (
            f"le réseau entraîné sur un seul exemple répond « {CLASSE} » à "
            f"{int(apres[CLASSE])} images sur {total}, et la scène cote "
            f"{total}."
        )
        assert int(apres.sum()) == total and int(avant.sum()) == total, (
            "les deux répartitions ne totalisent pas le même nombre d'images : "
            "les barres d'avant et d'après ne sont pas comparables."
        )
        assert abs(u["exactitude_apres"] - u["frequence"]) < 1e-9, (
            f"la précision après les pas vaut {u['exactitude_apres']:.4f} et la "
            f"fréquence de la classe {CLASSE} vaut {u['frequence']:.4f} : la "
            "page 10 dit qu'elles sont égales."
        )
