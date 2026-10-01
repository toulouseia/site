"""
Chapitre 4 · page 12 · L'onde revient de la sortie.

Une scène, et c'est la seule du chapitre qui ne montre aucun nombre. Le réseau
est allumé sur l'image de travail ; une lueur le traverse de gauche à droite,
puis revient de droite à gauche, couche après couche. C'est le chapitre entier
en un aller-retour, et le retour est le même geste que l'aller, joué dans
l'autre sens.

Aucune valeur n'est affichée : la page 12 récapitule, elle ne mesure pas. Ce
que la scène doit établir est une DIRECTION, et une direction n'a pas de cote.
"""

from manim import FadeIn  # type: ignore[import-not-found]

from scenes.n7ia import appliquer_style
from scenes.retropropagation.retro_mob import RetroScene, mesures_du_chapitre

appliquer_style()


ANIMATIONS = [
    {
        "id": "londe-revient-de-la-sortie",
        "scene": "LOndeRevientDeLaSortie",
        "titre": "L'aller, puis le retour, sur le même réseau",
        "notions": [
            "propagation avant",
            "rétropropagation",
            "récurrence",
            "sens du calcul",
        ],
        "alt": (
            "Le réseau est allumé : la grille de l'image de travail à gauche, "
            "les trois colonnes remplies chacune à ses valeurs, la colonne "
            "cachée très inégalement. Une lueur de brique parcourt le premier "
            "faisceau de la gauche vers la droite, en cascade, puis le second, "
            "toujours vers la droite : c'est l'aller, et il va vite. Le réseau "
            "reste un instant immobile. Puis une lueur repart, du second "
            "faisceau cette fois, et elle va de la droite vers la gauche, plus "
            "lentement : elle quitte les dix ronds de sortie et gagne la "
            "colonne cachée. Elle s'arrête. Une seconde lueur repart du premier "
            "faisceau, toujours vers la gauche, et gagne la colonne d'entrée. "
            "Le même geste recommence une fois, dans le même ordre : de la "
            "sortie vers la couche cachée, puis de la couche cachée vers "
            "l'entrée. Rien d'autre ne bouge, aucun nombre ne s'écrit, et les "
            "activations ne changent pas."
        ),
    },
]


class LOndeRevientDeLaSortie(RetroScene):
    """
    L'aller puis le retour, sur le réseau allumé.

    LE RÉSEAU EST LE SUJET, et il reste donc à pleine opacité : c'est la
    seconde des huit scènes dans ce cas, avec la traversée de la page 3. Rien
    ne s'efface, rien ne se pose par-dessus, aucune cote n'apparaît.

    LES ACTIVATIONS NE BOUGENT PAS PENDANT LE RETOUR, et c'est une décision.
    Il serait facile de faire pâlir les ronds à mesure que l'onde repart, et ce
    serait faux : la passe arrière ne change aucune activation, elle calcule
    des dérivées. La page 7 tient toute sa démonstration sur cette
    distinction ; une animation qui l'effacerait la contredirait.

    LE RETOUR EST JOUÉ DEUX FOIS. Une seule passe se lit comme un incident ;
    deux passes identiques se lisent comme une règle. C'est la récurrence, et
    c'est ce que la page 12 récapitule.
    """

    titre = "Le retour"

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()
        cache = m["cache"]

        # Le réseau, allumé sur l'image de travail. L'état est posé sans
        # animation : cette scène n'a pas à refaire la traversée de la page 3,
        # elle part de son résultat.
        image = self.poser_image_de_travail()
        self.entree.ronds.become(self.entree.allumer(image))
        self.cachee.ronds.become(self.cachee.allumer(cache["a1"]))
        self.sortie.ronds.become(self.sortie.allumer(cache["a2"]))

        self.play(FadeIn(self.grille), run_time=0.6)
        self.wait(0.8)

        # L'aller : vite, parce qu'il est déjà connu.
        self.next_section("L'aller")
        for faisceau in range(len(self.faisceaux)):
            self.play(self._vague(faisceau, duree=0.9), run_time=0.9)
        self.wait(1.2)

        # Le retour : plus lent, et de la droite vers la gauche.
        self.next_section("Le retour")
        for passage in range(2):
            for faisceau in reversed(range(len(self.faisceaux))):
                self.play(self.vague_arriere(faisceau, duree=1.6), run_time=1.6)
                self.wait(0.35)
            # La respiration entre les deux passages, et seulement entre eux :
            # `wait(0)` est une erreur chez Manim, pas un temps nul.
            if passage == 0:
                self.wait(0.7)
        self.wait(1.8)

        # Le contrôle : les activations sont celles de la mesure 1 et n'ont pas
        # bougé. Une scène qui les aurait modifiées en chemin échoue ici.
        assert self.sortie.ronds[int(cache["a2"].argmax())].get_fill_opacity() > 0.9, (
            "le rond le plus rempli de la colonne de sortie n'est plus celui de "
            "la plus grande activation : le retour a modifié un état qu'il ne "
            "doit pas toucher."
        )
