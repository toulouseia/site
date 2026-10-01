"""
Chapitre 3 · l'image de la bille, et ce qu'elle promet en trop.

Deux scènes sur LA MÊME COUPE, au MÊME point de départ, et elles n'arrivent pas
au même creux. C'est tout le propos : l'image de la bille est commode, et elle
ment sur deux points.

    `LaBillePasseLePremierCreux`   une bille a de l'inertie. Lâchée à gauche,
                                   elle traverse le premier creux, remonte la
                                   pente d'en face, revient, et s'immobilise
                                   dans le second — le plus profond.

    `LePasSArreteAuPremierCreux`   la règle du chapitre n'a pas de vitesse.
                                   Partie du même point, elle descend, ralentit
                                   à mesure que la pente faiblit, et s'arrête
                                   dans le PREMIER creux. Elle ne verra jamais
                                   le second.

Reprend `SOURCE.md` §4. La source fait rouler ce qu'elle appelle une bille, mais
sa bille n'a pas d'inertie : elle intègre la règle de descente, pas la
mécanique. Le raccourci est commode et il n'est pas signalé. Ici les deux
trajets sont calculés séparément — l'un par la mécanique, l'autre par la règle —
et c'est leur écart qui est le sujet.

AUCUN NOMBRE N'EST AFFICHÉ. La coupe est un objet mathématique choisi pour ses
creux, pas une mesure : lui coter une altitude ou un taux écrirait un nombre que
`cours/lecon3/mesures.py` n'a pas produit. Les axes portent leur nom, et rien
d'autre.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    Circle,
    Create,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    ValueTracker,
    VGroup,
    linear,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE_30,
    ENCRE_55,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
    appliquer_style,
)
from scenes.descente.descente_mob import (
    COUPE_BILLE,
    DEPART_BILLE,
    point_ecran,
    poser_sur_la_courbe,
    verifier_la_part,
)

# Le pas de la descente. Il est choisi pour que le trajet se lise — une dizaine
# de pas visibles — et l'assertion de `descente_mob` vérifie qu'il arrive bien
# dans le premier creux.
ETA_JUSTE = 0.45
PAS_JUSTES = 26

# Le pas trop grand, montré dans le creux de DROITE. Sa courbure y vaut 0,655 :
# au-delà de deux fois son inverse, soit 3,05, la règle ne converge plus. Celui-
# ci est au-dessus, et le point traverse le fond au lieu de l'atteindre.
#
# POURQUOI PAS LE CREUX DE GAUCHE, où la descente juste vient de s'arrêter : sa
# courbure est plus faible, le pas qui l'y ferait diverger est si grand que le
# premier bond sort du cadre. Le montrer là demanderait d'élargir la coupe
# jusqu'à ne plus rien voir de ses creux.
DEPART_TROP_GRAND = 5.0
ETA_TROP_GRAND = 4.4
PAS_TROP_GRANDS = 5

# Relevé sur le rendu d'essai : à 0,15 la bille se lisait comme un point, et
# c'est un cercle qu'il faut voir — un point, c'est la règle de descente.
RAYON_BILLE = 0.20

# OÙ SE POSE LE NOM DU PAS. Accroché au coin du repère, il venait s'écrire par-
# dessus l'axe des ordonnées, et sous le nom de cet axe : le rendu d'essai le
# montrait. Le point est donc posé, dans la zone que la courbe laisse libre
# au-dessus de la bosse — la courbe y passe à l'ordonnée −0,3, deux unités et
# demie plus bas. Les deux noms s'y succèdent, au même endroit : un nom qui se
# déplacerait serait du texte mobile.
PLACE_DU_NOM = [-2.6, 2.30, 0.0]

ANIMATIONS = [
    {
        "id": "la-bille-passe-le-premier-creux",
        "scene": "LaBillePasseLePremierCreux",
        "titre": "Une bille ne s'arrête pas au premier creux",
        "bandeau": "L'IMAGE DE LA BILLE",
        "section": "Page 6 · L'image de la bille, après le paragraphe qui l'introduit",
        "geste": "une bille roule le long d'une courbe et dépasse un creux",
        "notions": [
            "geste : une bille roule le long d'une courbe et dépasse un creux",
            "coupe du coût",
            "minimum local",
            "inertie",
        ],
        "legende": (
            "Une coupe du coût le long d'un paramètre se trace : deux creux "
            "d'inégale profondeur, séparés par une bosse basse. Une bille se "
            "pose sur la pente de gauche et roule. Elle traverse le premier "
            "creux sans s'y arrêter, remonte loin sur la pente d'en face, "
            "revient, oscille, et s'immobilise au fond du second — le plus "
            "profond des deux."
        ),
        "mouvement": [
            "1. Le repère se dessine, ses deux axes nommés.",
            "2. La courbe se trace de gauche à droite : deux creux, une bosse "
            "entre eux.",
            "3. Une bille se pose sur la pente de gauche, tangente au tracé.",
            "4. Elle roule, prend de la vitesse, traverse le premier creux et "
            "remonte la pente d'en face.",
            "5. Elle revient, oscille de moins en moins, et s'arrête au fond "
            "du creux de droite.",
            "6. Un trait pointillé descend de la bille jusqu'à l'axe.",
        ],
        "ecran": ["un paramètre", "le coût"],
        "nombres": {},
        "alt": (
            "Un repère se dessine, occupant presque tout l'écran ; l'axe "
            "horizontal porte le nom « un paramètre » à son extrémité droite, "
            "l'axe vertical le nom « le coût » en haut. Une courbe épaisse se "
            "trace alors de gauche à droite : elle descend depuis le haut de "
            "l'écran, creuse un premier vallon peu profond au tiers gauche, "
            "remonte en une bosse arrondie au milieu, creuse un second vallon "
            "nettement plus profond aux deux tiers, puis remonte vers la "
            "droite. Un cercle vide au trait de brique, de la taille d'une "
            "petite bille, vient se poser sur la pente de gauche, exactement "
            "tangent au tracé. Il se met à rouler : il descend, accélère, et "
            "au lieu de s'arrêter dans le premier vallon il le traverse en "
            "pleine vitesse, franchit la bosse du milieu et remonte haut sur "
            "la pente qui suit le second vallon. Il redescend, repasse le fond, "
            "remonte un peu de l'autre côté, et ses allers et retours se font "
            "de plus en plus courts jusqu'à ce qu'il s'immobilise au fond du "
            "second vallon, le plus profond. Un trait pointillé descend alors "
            "de la bille jusqu'à l'axe horizontal, pour marquer où elle s'est "
            "arrêtée : pas là où elle est passée la première fois."
        ),
    },
    {
        "id": "le-pas-sarrete-au-premier-creux",
        "scene": "LePasSArreteAuPremierCreux",
        "titre": "La règle, elle, s'arrête au premier creux",
        "bandeau": "LES LIMITES DE LA BILLE",
        "section": "Page 6 · Les limites de l'image, après l'énoncé de la règle",
        "geste": "un point descend par pas discrets, de plus en plus courts",
        "notions": [
            "geste : un point descend par pas discrets, de plus en plus courts",
            "descente de gradient",
            "minimum local",
            "taux d'apprentissage",
        ],
        "legende": (
            "La même coupe, le même point de départ. Un point suit cette fois "
            "la règle de mise à jour : à chaque étape, la tangente se pose, et "
            "le point se déplace d'une longueur proportionnelle à la pente. Il "
            "n'a pas de vitesse : il ralentit à mesure que la pente faiblit et "
            "s'arrête au fond du PREMIER creux. Reporté ensuite sur le creux "
            "de droite avec un pas trop grand, il traverse le fond à chaque "
            "étape, se retrouve sur la paroi d'en face, et n'atteint jamais le "
            "creux qu'il enjambe."
        ),
        "mouvement": [
            "1. La courbe est là, identique à la scène précédente.",
            "2. Un point se pose au même endroit que la bille.",
            "3. À chaque étape, la tangente se pose puis s'efface, et le point "
            "avance d'une longueur proportionnelle à la pente.",
            "4. Les étapes se raccourcissent visiblement ; le point s'arrête "
            "au fond du premier creux.",
            "5. Un trait pointillé le relie à l'axe : il n'a pas atteint le "
            "second creux.",
            "6. Le point se reporte sur la paroi du creux de droite, avec un "
            "pas beaucoup plus grand, et enjambe le fond à chaque étape sans "
            "jamais l'atteindre.",
        ],
        "ecran": ["un paramètre", "le coût", "pas juste", "pas trop grand"],
        "nombres": {},
        "alt": (
            "La même courbe à deux vallons occupe l'écran, avec ses deux axes "
            "nommés. Un point plein de brique se pose sur la pente de gauche, "
            "exactement là où la bille avait été lâchée. Un segment de droite "
            "vient s'appuyer contre la courbe sous le point, dans le sens de "
            "la pente, puis s'efface, et le point saute vers la droite d'une "
            "longueur nette. La même chose recommence : une tangente, un saut. "
            "Les sauts sont d'abord longs, là où la courbe est raide, puis de "
            "plus en plus courts à mesure que la pente s'aplatit, et le point "
            "finit par ne plus bouger du tout. Il s'est arrêté au fond du "
            "PREMIER vallon, celui que la bille avait traversé sans s'y "
            "arrêter, et un trait pointillé descend de lui jusqu'à l'axe pour "
            "le marquer. Le second vallon, plus profond, est resté là-bas, "
            "intact. Le point se reporte alors sur la paroi de ce second "
            "vallon et recommence avec des sauts beaucoup plus longs : cette "
            "fois il enjambe le fond au lieu de l'atteindre, se retrouve sur "
            "la pente d'en face, repart dans l'autre sens et l'enjambe encore. "
            "Cinq sauts durant, il passe d'une paroi à l'autre sans jamais "
            "toucher le creux qu'il traverse, et il finit plus haut qu'il "
            "n'était parti."
        ),
    },
]


class _SurLaCoupe(SceneN7):
    """
    Ce que les deux scènes partagent : le repère, la courbe, et leurs noms.

    LE SUJET EST LA COURBE, et elle occupe le cadre. `poser_sujet` l'agrandit
    jusqu'à toucher un bord et refuse en dessous de 60 % de la hauteur laissée
    sous le bandeau — le contrôle est dans `n7ia.py`, il n'est pas refait ici.
    """

    coupe = COUPE_BILLE

    def poser_la_coupe(self) -> None:
        self.axes = self.coupe.repere()
        self.courbe = self.coupe.courbe(self.axes)

        # Le repère se pose lui-même — voir `Coupe.repere`. Ce qui reste à faire
        # est de CONTRÔLER qu'il occupe bien sa part du cadre, puisque
        # `poser_sujet` ne le fait plus.
        verifier_la_part(self, VGroup(self.axes, self.courbe), part=0.60)

        self.play(Create(self.axes), run_time=0.9)

        # Les noms des axes se posent APRÈS la mise à l'échelle : un texte mis à
        # l'échelle avec son repère ne ferait plus la taille du corps.
        self.nom_x = self.etiquette("un paramètre", taille=24, couleur=ENCRE_55)
        self.nom_x.next_to(self.axes.x_axis.get_right(), DOWN + LEFT, buff=0.18)
        self.nom_y = self.etiquette("le coût", taille=24, couleur=ENCRE_55)
        self.nom_y.next_to(self.axes.y_axis.get_top(), RIGHT, buff=0.40)
        self.play(FadeIn(self.nom_x), FadeIn(self.nom_y), run_time=0.5)

        self.next_section("La courbe")
        self.play(Create(self.courbe), run_time=2.0)

    def poser_le_repere_d_arrivee(self, w: float) -> DashedLine:
        """Un trait pointillé de la courbe jusqu'à l'axe : où l'on s'est arrêté."""
        haut = point_ecran(self.axes, self.coupe, w)
        bas = self.axes.c2p(w, self.coupe.hauteurs[0])
        return DashedLine(
            haut, bas, stroke_width=TRAIT_FILET, color=ENCRE_55, dash_length=0.10
        )


class LaBillePasseLePremierCreux(_SurLaCoupe):
    titre = "L'image de la bille"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)
        self.poser_la_coupe()

        self.next_section("La bille est lâchée")
        trajet = self.coupe.roulement(DEPART_BILLE)
        bille = Circle(radius=RAYON_BILLE, stroke_width=TRAIT_COTE, color=BRIQUE)
        bille.set_fill(opacity=0.0)
        poser_sur_la_courbe(bille, self.axes, self.coupe, DEPART_BILLE, RAYON_BILLE)
        self.play(FadeIn(bille), run_time=0.5)

        # LE TRAJET EST JOUÉ EN TEMPS, PAS EN LONGUEUR. Un déplacement le long
        # d'un chemin répartirait les images sur la DISTANCE parcourue : la
        # bille irait à vitesse constante, et il n'y aurait plus d'inertie à
        # voir. Le curseur avance donc dans la liste des instants, qui sont
        # régulièrement espacés dans le temps — un cinquantième de seconde.
        self.next_section("Elle traverse le premier creux")
        curseur = ValueTracker(0.0)

        def suivre(mob) -> None:
            rang = int(round(curseur.get_value()))
            rang = min(max(rang, 0), len(trajet) - 1)
            poser_sur_la_courbe(
                mob, self.axes, self.coupe, trajet[rang], RAYON_BILLE
            )

        bille.add_updater(suivre)
        self.play(
            curseur.animate.set_value(len(trajet) - 1),
            run_time=len(trajet) * 0.02,
            rate_func=linear,
        )
        bille.remove_updater(suivre)

        self.next_section("Elle s'arrête dans le second")
        arrivee = self.poser_le_repere_d_arrivee(trajet[-1])
        self.play(Create(arrivee), run_time=0.6)
        self.wait(1.8)


class LePasSArreteAuPremierCreux(_SurLaCoupe):
    titre = "Les limites de la bille"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)
        self.poser_la_coupe()

        self.next_section("Le point part du même endroit")
        trajet = self.coupe.descente(DEPART_BILLE, ETA_JUSTE, PAS_JUSTES)
        point = Dot(
            point_ecran(self.axes, self.coupe, DEPART_BILLE),
            radius=0.09,
            color=BRIQUE,
        )
        nom = self.etiquette("pas juste", taille=24, couleur=ENCRE_55)
        nom.move_to(PLACE_DU_NOM)
        self.play(FadeIn(point), FadeIn(nom), run_time=0.5)

        self.next_section("Chaque pas suit la tangente")
        # Les premiers pas se jouent un à un, avec leur tangente : c'est là que
        # la longueur du pas se lit. Les suivants s'enchaînent — ils sont trop
        # courts pour mériter chacun sa seconde, et c'est justement ce qu'on
        # veut donner à voir.
        for rang in range(len(trajet) - 1):
            depart, arrivee = trajet[rang], trajet[rang + 1]
            if abs(arrivee - depart) < 0.004:
                break
            lent = rang < 5
            if lent:
                tangente = self._tangente(depart)
                self.play(Create(tangente), run_time=0.35)
            self.play(
                point.animate.move_to(
                    point_ecran(self.axes, self.coupe, arrivee)
                ),
                run_time=0.45 if lent else 0.16,
            )
            if lent:
                self.play(FadeOut(tangente), run_time=0.15)

        self.next_section("Il s'arrête dans le premier creux")
        arret = self.poser_le_repere_d_arrivee(trajet[-1])
        self.play(Create(arret), run_time=0.6)
        self.wait(1.2)

        self.next_section("Un pas trop grand traverse le fond")
        self.play(FadeOut(arret), FadeOut(nom), run_time=0.4)
        trop = self.coupe.descente(
            DEPART_TROP_GRAND, ETA_TROP_GRAND, PAS_TROP_GRANDS
        )
        nom_trop = self.etiquette("pas trop grand", taille=24, couleur=ENCRE_55)
        nom_trop.move_to(nom)
        self.play(
            point.animate.move_to(
                point_ecran(self.axes, self.coupe, DEPART_TROP_GRAND)
            ),
            FadeIn(nom_trop),
            run_time=0.9,
        )
        for rang in range(len(trop) - 1):
            self.play(
                point.animate.move_to(
                    point_ecran(self.axes, self.coupe, trop[rang + 1])
                ),
                run_time=0.42,
            )
        self.wait(1.8)

    def _tangente(self, w: float) -> Line:
        """
        La tangente en `w`, de LONGUEUR FIXE À L'ÉCRAN.

        Prise dans les coordonnées de la coupe, elle mesurerait deux unités de
        pente : au départ la pente vaut 1,8, et le segment sortirait du repère
        par le haut. Sa direction se lit donc entre deux points déjà projetés —
        comme la normale de la bille — et sa longueur est posée en unités
        d'écran, la même à chaque pas.
        """
        import numpy as np

        eps = 1e-3
        avant_ = self.axes.c2p(w - eps, float(self.coupe.hauteur(w - eps)))
        apres = self.axes.c2p(w + eps, float(self.coupe.hauteur(w + eps)))
        direction = np.asarray(apres) - np.asarray(avant_)
        direction = direction / max(float(np.linalg.norm(direction)), 1e-9)
        centre = point_ecran(self.axes, self.coupe, w)
        # 0,85 la faisait monter au-dessus du repère au premier pas, où la pente
        # est presque verticale, et frôler le nom de l'axe des ordonnées.
        demi = 0.55
        # À l'encre pâlie de 0,30, elle ne se voyait pas sur le rendu d'essai :
        # 0,30 est le plancher de ce qui doit se lire, pas de ce qui doit se
        # remarquer. La tangente est le geste de l'étape ; elle se lit à 0,55.
        return Line(
            centre - demi * direction,
            centre + demi * direction,
            stroke_width=TRAIT_COTE,
            color=ENCRE_55,
        )


# ── Ce que les deux trajets doivent faire, vérifié à l'import ───────────────
#
# Les deux scènes ne valent que par leur écart : même coupe, même départ, deux
# creux différents. Et le pas trop grand ne vaut que s'il reste dans le cadre.

_JUSTE = COUPE_BILLE.descente(DEPART_BILLE, ETA_JUSTE, PAS_JUSTES)
_TROP = COUPE_BILLE.descente(DEPART_TROP_GRAND, ETA_TROP_GRAND, PAS_TROP_GRANDS)
_ROULE = COUPE_BILLE.roulement(DEPART_BILLE)

assert abs(_JUSTE[-1] - COUPE_BILLE.creux[0]) < 0.02, \
    "la descente n'atteint pas le creux gauche"
assert abs(_ROULE[-1] - COUPE_BILLE.creux[1]) < 0.06, \
    "la bille ne s'arrête pas dans le creux droit"
assert all(
    COUPE_BILLE.bornes[0] < w < COUPE_BILLE.bornes[1] for w in _TROP
), "le pas trop grand sort du repère : il serait coupé par le bord"
# Il ne descend jamais jusqu'au fond : c'est ce que la scène donne à voir.
assert min(float(COUPE_BILLE.hauteur(w)) for w in _TROP[1:]) > \
    float(COUPE_BILLE.hauteur(COUPE_BILLE.creux[1])) + 0.04
