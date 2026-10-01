"""
Chapitre 2 · page 2 · La lumière traverse.

L'aperçu du chapitre : trois images de test passent dans le réseau, l'une après
l'autre, et le cadre tombe chaque fois sur la bonne sortie. Rien d'autre.

CE QUE CETTE SCÈNE NE FAIT PAS, ET C'EST SA RAISON D'ÊTRE. Elle n'explique pas,
elle ne nomme pas, elle ne trace aucune flèche vers ce qu'il faudrait regarder.
La page 2 ne sait pas encore pourquoi le réseau répond juste — les sept pages
suivantes s'en chargent — et une animation qui l'expliquerait ici mentirait sur
ce que le lecteur a déjà en main : c'est la règle 19 et le principe I. Ce qui
porte l'aperçu n'est pas un commentaire, c'est la RÉPÉTITION : une seule image
passerait pour un tour de passe-passe, trois font un fait.

UNE SEULE VALEUR EST ÉCRITE, sur la première image, et pas sur les deux autres.
Elle dit à quel point le réseau croit à sa réponse. La répéter trois fois
transformerait une constatation en démonstration, et inviterait à comparer trois
nombres que la page n'a aucun moyen de lire.
"""

from __future__ import annotations

from manim import (  # type: ignore[import-not-found]
    RIGHT,
    FadeIn,
    FadeOut,
)

from scenes.n7ia import appliquer_style
from scenes.reseau_mob import X_LIBRE, ReseauScene

ANIMATIONS = [
    {
        "id": "la-lumiere-traverse",
        "scene": "LaLumiereTraverse",
        "titre": (
            "Trois images de test traversent le réseau, et le cadre se referme "
            "chaque fois sur la sortie retenue"
        ),
        "alt": (
            "Des ronds reliés par un voile de traits très pâles occupent "
            "l'écran : trois colonnes de ronds vides alignées de "
            "gauche à droite, et contre la dernière les dix chiffres de zéro à "
            "neuf, un par rond. Un nombre est posé contre la première colonne, "
            "sept cent quatre-vingt-quatre, un autre sous la deuxième, cent "
            "vingt-huit : ni l'une ni l'autre ne montre tous ses ronds. À "
            "gauche, un carré quadrillé attend, vide. Un sept manuscrit s'y "
            "dessine, gris, case par case ; puis les cases encrées se détachent "
            "une à une et s'envolent vers la première colonne, chacune vers la "
            "hauteur qui lui revient, où elles s'effacent en arrivant. Une "
            "vague couleur brique parcourt alors les traits, de la gauche vers "
            "la droite, et la colonne du milieu s'assombrit inégalement : "
            "beaucoup de ronds y restent parfaitement vides. La vague repart et "
            "atteint la dernière colonne, où un seul rond devient franchement "
            "noir : celui du chiffre sept. Un cadre brique se referme sur lui, "
            "et un nombre s'inscrit dans la marge de droite, à sa hauteur — zéro "
            "virgule, sept neuf, puis un sept, presque exactement un. Tout "
            "s'éteint d'un coup. Un deux manuscrit remplace le sept, la "
            "traversée recommence, et le cadre se referme sur le chiffre deux. "
            "Tout s'éteint encore, un un manuscrit apparaît, la traversée "
            "recommence, et le cadre tombe sur le chiffre un. Pas un mot n'est "
            "écrit : on regarde la machine répondre, trois fois de suite."
        ),
        "duree": None,
        "notions": [
            "geste : la lumière traverse",
            "propagation avant",
            "activation",
            "couche de sortie",
        ],
        "source": "SOURCE.md · séquences 01:52 → 02:25 et 03:50 → 05:35",
        "page": 2,
        "apres_bloc": "b-r2-1f-lecture",
        "ce_qui_change": (
            "Les activations, de l'entrée vers la sortie : chaque rond se "
            "remplit à la valeur du neurone qu'il désigne, colonne après "
            "colonne. Sur les trois images, le rond qui finit le plus sombre "
            "change de place — le 7, puis le 2, puis le 1 — et c'est ce "
            "déplacement, et non l'allumage, qui montre que la réponse dépend "
            "de l'image."
        ),
        "texte_ecran": ["0,99999997"],
        "nombres": [
            {
                "valeur": "0.99999997",
                "quoi": "activation de sortie du 7 sur l'image 0, seule valeur écrite",
                "ligne": 426,
            },
            {
                "valeur": "0.99999999",
                "quoi": (
                    "activation de sortie du 2 sur l'image 1 ; non écrite, elle "
                    "justifie que le cadre tombe sur le rond 2"
                ),
                "ligne": 427,
            },
            {
                "valeur": "0.99997297",
                "quoi": (
                    "activation de sortie du 1 sur l'image 2 ; non écrite, elle "
                    "justifie que le cadre tombe sur le rond 1"
                ),
                "ligne": 428,
            },
        ],
        "legende": (
            "La machine répond, trois fois de suite, sur trois chiffres "
            "différents. C'est tout ce que cette page établit : que la réponse "
            "arrive, pas encore pourquoi elle est juste."
        ),
    },
]


class LaLumiereTraverse(ReseauScene):
    """
    Trois traversées, et rien entre elles qu'une extinction.

    Le réseau est celui de tout le chapitre — `ReseauScene` le pose dans
    `setup()`, donc dès la première trame — et les trois images sont les trois
    premières du jeu de test, dans leur ordre. Aucun tirage, aucun choix : les
    nombres de `mesures-chap2.txt` portent sur ces images-là.
    """

    titre = "La lumière traverse"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        # LE RÉSEAU ÉTEINT, D'ABORD. Cette seconde n'est pas une respiration de
        # confort : sans elle, la première image arrive sur un dessin que
        # personne n'a eu le temps de lire, et l'allumage ne se lit plus comme
        # un changement puisqu'on n'a pas vu l'état d'avant.
        self.wait(0.8)

        self.next_section("Le 7")
        self.propagation(0)
        cadre = self.cadre

        # LA VALEUR VA DANS LA BANDE LIBRE, à droite de X_LIBRE, la seule zone
        # du cadre où le réseau ne dessine jamais rien. `next_to` la pose à
        # droite du cadre brique ; le recalage qui suit garantit qu'elle n'entre
        # pas dans la bande du réseau même si le cadre s'élargissait — un
        # chiffre de sortie plus large, par exemple.
        valeur = self.cote("0,99999997", taille=26)
        valeur.next_to(cadre, RIGHT, buff=0.6)
        if valeur.get_left()[0] < X_LIBRE:
            valeur.shift(RIGHT * (X_LIBRE - valeur.get_left()[0]))
        self.play(FadeIn(valeur), run_time=0.4)
        self.wait(1.2)

        self.next_section("Le 2")
        # La valeur disparaît AVEC le cadre : elle qualifie cette réponse-là, et
        # la laisser vivre au-dessus de la traversée suivante lui ferait dire
        # quelque chose de l'image 1, qui n'a pas cette activation.
        self.play(FadeOut(cadre), FadeOut(valeur), run_time=0.35)
        self.eteindre()
        self.propagation(1)
        cadre = self.cadre
        self.wait(0.9)

        self.next_section("Le 1")
        self.play(FadeOut(cadre), run_time=0.35)
        self.eteindre()
        self.propagation(2)
        self.wait(1.3)
