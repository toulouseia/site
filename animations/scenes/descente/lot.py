"""
Chapitre 3 · le lot vise à côté du gradient complet.

Une scène. Deux vecteurs partant du même point : celui du gradient complet,
calculé sur les soixante mille images, et celui d'un lot de B images. L'angle
entre eux est mesuré, et il se referme quand le lot grossit — 84,9 degrés pour
un lot d'une image, 5,8 pour un lot de quatre mille quatre-vingt-seize.

Reprend `SOURCE.md` §6 : un éventail de directions autour d'un point, et une
flèche unique qui s'en détache. La source s'en sert pour DÉFINIR le gradient, en
le comparant aux huit directions de la boussole ; le chapitre s'en sert pour
mesurer de combien un lot s'en écarte. Même forme, autre question.

Remplace `soixante-mille-pour-un-pas`, `le-nuage-des-lots-se-contracte` et
`le-lot-vise-de-travers`.

CE QUI N'EST PAS MONTRÉ, ET POURQUOI. La mesure 5 donne aussi l'écart-type des
cosinus — 0,1992 à B = 1, 0,0012 à B = 4 096. Le porter à l'écran demanderait de
le convertir en un écart d'angle, c'est-à-dire de fabriquer deux nombres que
`mesures.py` n'imprime pas. La scène montre donc l'angle moyen, qui est imprimé
ligne 445, et la page garde l'écart-type.

Les nombres sortent de `cours/lecon3/mesures.py`, mesure 5, lignes 428 et 445.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    RIGHT,
    Arc,
    Arrow,
    Create,
    FadeIn,
    FadeOut,
    GrowArrow,
    Rotate,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_55,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
    appliquer_style,
)
from scenes.descente.descente_mob import MESURES, degres, entier, verifier_la_part

# Le sommet de l'angle, et la longueur commune des deux vecteurs. Elle est la
# même pour les deux : ce que la scène mesure est un ANGLE, et deux flèches de
# longueurs différentes inviteraient à comparer autre chose.
SOMMET = np.array([-1.2, -2.0, 0.0])
LONGUEUR = 4.25
RAYON_ARC = 1.15

# LE GRADIENT COMPLET MONTE, IL NE VA PAS VERS LA DROITE. Posé à l'horizontale,
# tout se referme dessus : au dernier palier les deux flèches sont à plat, et la
# figure ne fait plus que 22 % de la hauteur du cadre là où la règle en demande
# 60. `verifier_la_part` l'a refusée telle quelle. À 65 degrés, la référence
# porte à elle seule la hauteur de l'objet, et l'angle se referme sans que la
# figure s'aplatisse.
INCLINAISON = 65.0

# Où se posent les deux cotes. Elles ne bougent pas d'une étape à l'autre : un
# texte qui suit la flèche serait du texte mobile, et la règle l'interdit. Ce
# qui change, c'est ce qui est écrit dessus.
COTES = np.array([4.0, 0.2, 0.0])

ANIMATIONS = [
    {
        "id": "le-lot-vise-a-cote-du-gradient",
        "scene": "LeLotViseACoteDuGradient",
        "titre": "Un petit lot ne vise pas dans la bonne direction",
        "bandeau": "L'ANGLE D'UN LOT",
        "section": "Page 9 · Pourquoi on n'utilise pas tout le jeu, après le tableau des tailles de lot",
        "geste": "un vecteur pivote vers un autre à mesure que le lot grossit",
        "notions": [
            "geste : un vecteur pivote vers un autre à mesure que le lot "
            "grossit",
            "gradient complet",
            "mini-lot",
            "angle entre deux vecteurs",
        ],
        "legende": (
            "Deux vecteurs partent du même point. Le premier, en encre, monte "
            "en pente raide : c'est le gradient complet, calculé sur les "
            "soixante mille images, et il ne bouge plus. Le second, en brique, "
            "est celui d'un lot : à une image, il part presque "
            "perpendiculairement, vers la gauche. Le lot passe à 8, 64, 512, "
            "4 096, et le second vecteur se rabat sur le premier à chaque fois. "
            "L'angle mesuré s'inscrit à chaque étape."
        ),
        "mouvement": [
            "1. Le vecteur du gradient complet se trace, en encre, montant vers "
            "la droite, et reçoit son nom à sa pointe.",
            "2. Le vecteur du lot d'une image se trace en brique, à 84,9 "
            "degrés de lui ; un arc relie les deux, et l'angle s'inscrit.",
            "3. Le lot passe à 8 : le vecteur de brique pivote, l'arc se "
            "referme, 68,3 degrés s'inscrit à la place.",
            "4. Le lot passe à 64 : 40,6 degrés.",
            "5. Le lot passe à 512 : 16,7 degrés.",
            "6. Le lot passe à 4 096 : 5,8 degrés, et les deux vecteurs sont "
            "presque confondus.",
        ],
        "ecran": [
            "gradient complet",
            "lot de 1", "lot de 8", "lot de 64", "lot de 512", "lot de 4 096",
            "84,9°", "68,3°", "40,6°", "16,7°", "5,8°",
        ],
        "nombres": {
            "lots": [[1, 84.9], [8, 68.3], [64, 40.6], [512, 16.7],
                     [4096, 5.8]],
        },
        "alt": (
            "Un vecteur d'encre part du bas de l'écran et monte vers la droite "
            "en pente raide, occupant presque toute la hauteur du cadre ; son "
            "nom s'inscrit à sa pointe : gradient complet. C'est la direction "
            "calculée sur la totalité des images, et il ne bougera plus de "
            "toute la scène. Un second vecteur, de brique et de même longueur, "
            "part du même point, mais dans une direction tout autre : il file "
            "vers la gauche en montant à peine, à peu près perpendiculaire au "
            "premier. Un arc mince relie les deux flèches près de leur origine, "
            "et deux mentions s'inscrivent à droite : lot de un, et "
            "quatre-vingt-quatre virgule neuf degrés. La mention change alors "
            "pour lot de huit, et le vecteur de brique pivote vers celui "
            "d'encre, l'arc se referme : soixante-huit virgule trois degrés. Le "
            "mouvement se répète trois fois. Lot de soixante-quatre : quarante "
            "virgule six degrés, le vecteur de brique s'est redressé et monte "
            "maintenant du même côté que celui d'encre. Lot de cinq cent "
            "douze : seize virgule sept degrés, l'arc n'est plus qu'un "
            "fragment. Lot de quatre mille quatre-vingt-seize : cinq virgule "
            "huit degrés, et les deux vecteurs sont presque confondus, l'arc "
            "réduit à un trait. Le vecteur de brique n'a jamais rejoint "
            "exactement celui d'encre."
        ),
    },
]


class LeLotViseACoteDuGradient(SceneN7):
    titre = "L'angle d'un lot"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        base = np.deg2rad(INCLINAISON)

        self.next_section("Le gradient complet")
        complet = Arrow(
            SOMMET,
            SOMMET + LONGUEUR * np.array([np.cos(base), np.sin(base), 0.0]),
            buff=0.0,
            color=ENCRE,
            stroke_width=TRAIT_COTE,
            max_tip_length_to_length_ratio=0.12,
        )
        nom_complet = self.etiquette("gradient complet", taille=24, couleur=ENCRE_55)
        nom_complet.next_to(complet.get_end(), RIGHT, buff=0.24)
        self.play(GrowArrow(complet), run_time=0.9)
        self.play(FadeIn(nom_complet), run_time=0.5)

        lots = MESURES["lots"]
        angle_courant = np.deg2rad(float(lots[0][1]))

        du_lot = Arrow(
            SOMMET,
            SOMMET + LONGUEUR * np.array(
                [np.cos(base + angle_courant), np.sin(base + angle_courant), 0.0]
            ),
            buff=0.0,
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
            max_tip_length_to_length_ratio=0.12,
        )
        arc = self._arc(base, angle_courant)
        nom_lot, cote_angle = self._cotes(int(lots[0][0]), float(lots[0][1]))

        self.next_section("Un lot d'une image")
        self.play(GrowArrow(du_lot), run_time=0.9)
        self.play(Create(arc), FadeIn(nom_lot), Write(cote_angle), run_time=0.8)

        # LE CONTRÔLE SE FAIT ICI, à l'ouverture maximale : c'est le moment où
        # la figure est la plus PLATE, le vecteur du lot partant vers la gauche
        # au lieu de monter. Si elle passe ici, elle passe aux quatre paliers
        # suivants, où elle ne fait que se redresser.
        verifier_la_part(self, VGroup(complet, du_lot), part=0.60)
        self.wait(1.0)

        for taille, angle in lots[1:]:
            self.next_section(f"Un lot de {taille}")
            vise = np.deg2rad(float(angle))
            neuf_arc = self._arc(base, vise)
            neuf_nom, neuve_cote = self._cotes(int(taille), float(angle))
            self.play(
                Rotate(
                    du_lot,
                    angle=vise - angle_courant,
                    about_point=SOMMET,
                ),
                arc.animate.become(neuf_arc),
                FadeOut(nom_lot),
                FadeOut(cote_angle),
                run_time=0.9,
            )
            self.play(FadeIn(neuf_nom), Write(neuve_cote), run_time=0.5)
            angle_courant = vise
            nom_lot, cote_angle = neuf_nom, neuve_cote
            self.wait(0.6)

        self.wait(1.6)

    # ── Les pièces ──────────────────────────────────────────────────────────

    def _arc(self, base: float, ouverture: float) -> Arc:
        return Arc(
            radius=RAYON_ARC,
            start_angle=base,
            angle=ouverture,
            arc_center=SOMMET,
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
        )

    def _cotes(self, taille: int, angle: float) -> tuple:
        """Le nom du lot et son angle, TOUJOURS AU MÊME ENDROIT."""
        nom = self.etiquette(f"lot de {entier(taille)}", taille=24, couleur=ENCRE_55)
        nom.move_to(COTES)
        valeur = self.cote(degres(angle), taille=24)
        valeur.next_to(nom, DOWN, buff=0.26)
        return nom, valeur


# ── Les nombres déclarés sont ceux de la table ──────────────────────────────

_declares = ANIMATIONS[0]["nombres"]
assert tuple(tuple(x) for x in _declares["lots"]) == MESURES["lots"]

# L'angle se referme à chaque palier : c'est la proposition de la page, et une
# table qui ne la vérifierait pas ferait pivoter le vecteur dans le mauvais sens.
_angles = [a for _, a in MESURES["lots"]]
assert all(_angles[i] > _angles[i + 1] for i in range(len(_angles) - 1))

# LES DEUX FLÈCHES TIENNENT DANS LE CADRE À TOUS LES PALIERS. La référence monte
# le plus haut ; celle du lot part le plus à gauche, au premier palier, où elle
# dépasse la verticale. Les deux bornes sont vérifiées ici : un dépassement
# serait coupé par le bord, et le crible ne le verrait qu'après un rendu.
def _bout(degres_: float) -> tuple[float, float]:
    radians = np.deg2rad(INCLINAISON + degres_)
    return (
        float(SOMMET[0] + LONGUEUR * np.cos(radians)),
        float(SOMMET[1] + LONGUEUR * np.sin(radians)),
    )


_bouts = [_bout(0.0)] + [_bout(a) for a in _angles]
assert max(y for _, y in _bouts) < 3.5 - 0.05, "une flèche monte hors du cadre"
assert min(x for x, _ in _bouts) > -6.611 + 0.05, "une flèche sort par la gauche"
assert max(x for x, _ in _bouts) < 6.611 - 0.05, "une flèche sort par la droite"
