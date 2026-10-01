"""
Chapitre 2 · page 4 · Le gabarit du 0.

Les 784 poids qui arrivent au neurone de sortie 0 du modèle linéaire se
replient en une image de 28 × 28. C'est l'aplatissement de la page 3 joué à
l'envers, sur un autre objet : la page 3 a déplié une grille en ligne, celle-ci
replie une ligne en grille.

CE QUE LA SOURCE NE FAIT PAS, et qui est l'argument de la page : une vraie
image de test se pose ENSUITE sur le gabarit. Le gabarit seul est une jolie
image ; un 0 puis un 8 posés dessus en font une mesure — le score de la classe
0 passe de +14,0813 à +0,3568, et cette chute dit exactement ce que coûte
l'encre tombée dans le creux bleu du centre.

Le repliement lui-même n'est pas réécrit ici : c'est `ReseauScene.gabarit`,
partagé par tout le chapitre, qui le joue. Seuls les deux endroits OÙ il pose
ses objets sont recalés, parce qu'un réseau à deux colonnes n'a pas la même
place libre qu'un réseau à trois — voir le bandeau des constantes.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    Create,
    FadeIn,
    MarkupText,
    Square,
    Transform,
    VGroup,
)

from scenes.n7ia import BRIQUE, ENCRE, FONTE, TRAIT_COTE, appliquer_style
from scenes.reseau_mob import ReseauScene

ANIMATIONS = [
    {
        "id": "le-gabarit-du-0",
        "scene": "LeGabaritDuZero",
        "titre": (
            "La ligne de poids du neurone 0 se replie en image, et deux vraies "
            "images s'y posent"
        ),
        "alt": (
            "Un réseau occupe le centre de l'écran : à gauche une colonne de "
            "ronds cotée sept cent quatre-vingt-quatre, à droite dix ronds "
            "numérotés de zéro à neuf, et entre les deux un faisceau de traits "
            "très pâles. Les seuls traits qui aboutissent au premier des dix "
            "ronds passent en brique et deviennent nets. Ils se rassemblent en "
            "une bande étroite au bas de l'écran, faite de cases brique et "
            "bleues, puis la bande se replie sur elle-même jusqu'à former un "
            "carré de vingt-huit sur vingt-huit cases qui vient se poser au "
            "milieu du faisceau. Le carré n'est pas du bruit : un anneau "
            "brique en fait le tour, un creux bleu en occupe le centre. Deux "
            "petits cadres brique s'y posent, l'un en haut à droite sur la "
            "case la plus forte, plus un virgule zéro trois neuf cinq, "
            "treizième ligne et vingt-cinquième colonne, l'autre en plein "
            "milieu sur la case la plus négative, moins un virgule quatre "
            "quatre cinq sept, seizième ligne et quinzième colonne ; leurs "
            "valeurs s'inscrivent à droite. Un zéro manuscrit apparaît sur la "
            "plaque de gauche, et la même image se pose en gris sombre "
            "par-dessus le carré : son encre suit l'anneau brique et laisse le "
            "creux bleu à découvert. Le score inscrit à droite vaut plus "
            "quatorze virgule zéro huit un trois. Un huit la remplace enfin, "
            "sur la plaque comme sur le carré, et son encre traverse cette "
            "fois le creux bleu du milieu : le score tombe à plus zéro virgule "
            "trois cinq six huit."
        ),
        "duree": None,
        "notions": [
            "geste : une ligne de poids se replie en image",
            "gabarit d'une classe",
            "ligne de la matrice de poids",
            "poids positif et poids négatif",
            "score avant softmax",
        ],
        "source": "SOURCE.md · séquence 09:20 → 09:50",
        "page": 4,
        "apres_bloc": "b-r4-19",
        "ce_qui_change": (
            "784 traits deviennent une image ; puis le score z₀ varie de "
            "+14,0813 à +0,3568 selon l'image posée sur le gabarit, et c'est "
            "cette chute qui mesure ce que coûte l'encre tombée dans le creux "
            "bleu du centre."
        ),
        # Ce que la scène écrit, mot pour mot. À l'écran chacune de ces cotes
        # est composée sur deux ou trois lignes : la bande libre fait 3,7
        # unités de large, et « maximum +1,0395 en (13, 25) » en mesure 5,1 sur
        # une seule ligne. Les mots, et leur ordre, sont ceux-ci. L'indice de
        # z₀ est composé par Pango et non écrit en U+2080 ; voir `_cote_indice`.
        "texte_ecran": [
            "maximum +1,0395 en (13, 25)",
            "minimum −1,4457 au centre, en (16, 15)",
            "un vrai 0 : z₀ = +14,0813",
            "un vrai 8 : z₀ = +0,3568",
        ],
        "nombres": [
            {"valeur": "+1.0395", "quoi": "maximum du gabarit du 0, en (13, 25)",
             "ligne": 157},
            {"valeur": "−1.4457", "quoi": "minimum du gabarit du 0, en (16, 15)",
             "ligne": 157},
            {"valeur": "+14.0813", "quoi": "z₀ sur l'image de test n° 3, un vrai 0",
             "ligne": 432},
            {"valeur": "+0.3568", "quoi": "z₀ sur l'image de test n° 61, un vrai 8",
             "ligne": 433},
        ],
        "legende": (
            "Le gabarit récompense l'encre là où il est brique et la punit là "
            "où il est bleu. Le creux bleu du centre est ce qui sépare un 0 "
            "d'un 8 : le 0 le contourne, le 8 le traverse, et le score de la "
            "classe 0 tombe de +14,0813 à +0,3568."
        ),
    },
]


# ── Où la ligne se pose, et où elle se replie ───────────────────────────────
#
# LE DÉFAUT NE CONVIENT PAS À UN RÉSEAU À DEUX COLONNES, et ce sont les deux
# endroits ci-dessous qu'il faut recaler pour que rien ne se recouvre.
#
# `_grille_poids` replie par défaut sur l'abscisse 1,2 : entre une couche
# cachée et la sortie, c'est le milieu. Le modèle linéaire n'a pas de couche
# cachée, sa sortie est à 2,4, et une grille de trois unités centrée sur 1,2
# couvre ses dix ronds et touche leurs étiquettes. Elle se replie donc sur
# −0,3, au milieu du faisceau, seul endroit où trois unités de côté tiennent.
#
# `_bande` étale par défaut les 784 poids sur 10,4 unités, de −5,2 à +5,2. Son
# extrémité droite doit alors TRAVERSER la colonne de sortie pour rejoindre le
# gabarit, et le crible relève cinq recouvrements : les cases en vol passent
# sur les étiquettes 5 à 9. La bande s'arrête donc à 2,0, à gauche des ronds :
# chaque case a son départ et son arrivée du même côté, et aucun trajet ne
# peut plus rencontrer une étiquette.
#
# Elle ne commence pas plus à gauche que −2,6, pour la même raison à l'autre
# bout : la cote « 784 » vit sous la colonne d'entrée, à l'abscisse −3,0, et
# les cases qui partaient de plus loin lui passaient dessus en montant vers le
# gabarit. La bande occupe donc exactement la largeur du sujet.

# LE GABARIT EST LE SUJET, DONC IL EST GRAND ET SEUL. 4,6 unités de côté, soit
# 58 % de la hauteur du cadre — la règle en demande 40 au moins.
#
# POURQUOI PAS PLUS. L'espace vraiment libre va de −2,7, à droite du « ⋮ » et de
# la cote 784 de la colonne d'entrée, à 2,1, à gauche des dix ronds de sortie :
# 4,8 unités. Un gabarit de 5,4 mordait sur les deux, et le crible relevait la
# cote « 784 » et le « ⋮ » couchés sous les cases — effacés à 0,3, mais toujours
# illisibles. Le sujet occupe donc tout l'espace libre, et rien de plus.
CENTRE_GABARIT = [-0.4, 0.0, 0.0]
COTE_GABARIT = 4.6
COTE_CASE = COTE_GABARIT / 28.0

LARGEUR_BANDE = 4.6
X_BANDE_DROITE = 2.0
Y_BANDE = -3.44

# La bande libre commence à X_LIBRE = 3,4 ; les cotes s'y calent sur 3,5.
X_COTES = 3.28

# L'encre de l'image se pose à mi-opacité. À pleine opacité elle masquerait la
# couleur du poids qu'elle recouvre, et c'est justement leur superposition
# qu'on regarde : quelle case brique reçoit de l'encre, et quelle case bleue en
# reçoit aussi.
OPACITE_ENCRE = 0.5

# Les 24 arêtes qui désignent le neurone 0 sont brique jusqu'au repliement :
# elles disent de qui le gabarit est le gabarit. Passé ce moment, elles ne sont
# plus que 24 diagonales en travers de l'objet qu'on vient lire, et c'est
# `animations_effacement` qui les emmène au décor, à 0,05 — avec tout le reste
# du réseau, d'un seul geste. Les avoir laissées à 0,3 ne suffisait pas : le
# crible relevait encore le gabarit traversé de 5,2 s à 14,4 s.

IMAGE_DU_ZERO = 3
IMAGE_DU_HUIT = 61


def _position(ligne: int, colonne: int) -> list[float]:
    """Le centre d'une case du gabarit, en indices à partir de 1."""
    return [
        CENTRE_GABARIT[0] - COTE_GABARIT / 2 + (colonne - 0.5) * COTE_CASE,
        CENTRE_GABARIT[1] + COTE_GABARIT / 2 - (ligne - 0.5) * COTE_CASE,
        0.0,
    ]


def _repere(ligne: int, colonne: int, cases: int = 3) -> Square:
    """
    Le cadre brique qui désigne une case du gabarit.

    Il fait trois cases de côté et non une : une case mesure 0,107 unité, et un
    contour de 2,8 posé dessus la couvrirait entièrement — on marquerait la
    case en la faisant disparaître.
    """
    marque = Square(
        side_length=cases * COTE_CASE, stroke_width=TRAIT_COTE, color=BRIQUE
    )
    marque.set_fill(BRIQUE, opacity=0.0)
    marque.move_to(_position(ligne, colonne))
    return marque


def _encre(image: np.ndarray) -> VGroup:
    """L'image de test, à la géométrie exacte du gabarit, à mi-opacité."""
    valeurs = np.asarray(image, dtype=float)
    cases = VGroup()
    for rang, valeur in enumerate(valeurs):
        i, j = divmod(rang, 28)
        case = Square(side_length=COTE_CASE, stroke_width=0.0)
        case.set_fill(ENCRE, opacity=OPACITE_ENCRE * float(valeur))
        case.move_to(_position(i + 1, j + 1))
        cases.add(case)
    return cases


def _cote_indice(texte: str, taille: int = 24) -> MarkupText:
    """
    Une cote dont l'indice est un vrai indice.

    MESURÉ, ET C'EST LA RAISON D'ÊTRE DE CETTE FONCTION. `self.cote` compose du
    texte simple, et la fonte système dessine U+2080 DE PLEIN PIED : « z₀ » et
    « z0 » sortent du rendu strictement identiques, chiffre sur la ligne de
    base, à la taille d'un chiffre. C'est exactement la forme que la règle 24
    interdit, obtenue en écrivant pourtant le bon caractère.

    Pango, lui, compose un vrai indice à partir de <sub>, dans la même fonte et
    à la même graisse que le reste de l'écran. `MathTex` le ferait aussi, mais
    au prix d'une seconde fonte au milieu d'une phrase.
    """
    return MarkupText(
        texte, font=FONTE, weight="SEMIBOLD", font_size=taille, color=BRIQUE
    )


def _poser(cote, ordonnee: float) -> None:
    """Cale une cote sur le bord gauche de la bande libre, à cette ordonnée."""
    cote.move_to([X_COTES + cote.width / 2.0, ordonnee, 0.0])


class LeGabaritDuZero(ReseauScene):
    titre = "Le gabarit du 0"
    modele = "lineaire"
    tailles = (784, 10)
    activation = "identite"
    montrer_grille = True

    # ── Les deux réglages du repliement partagé ─────────────────────────────
    #
    # On ne réécrit pas `gabarit()` : c'est lui qui joue le geste, et il doit
    # rester le même pour tout le chapitre. On ne change que les deux endroits
    # où il pose ses objets, pour les raisons dites en tête de fichier.

    def _bande(self, ligne: np.ndarray) -> VGroup:
        cote = LARGEUR_BANDE / 784.0
        haut = float(np.abs(ligne).max())
        bande = VGroup()
        for rang, valeur in enumerate(ligne):
            couleur, opacite = self._couleur_poids(float(valeur), haut)
            case = Square(side_length=cote, stroke_width=0.0)
            case.set_fill(couleur, opacity=opacite)
            case.move_to(
                [X_BANDE_DROITE - LARGEUR_BANDE + (rang + 0.5) * cote, Y_BANDE, 0]
            )
            bande.add(case)
        return bande

    def _grille_poids(self, ligne: np.ndarray, centre=None,
                      cote_total: float = COTE_GABARIT) -> VGroup:
        return super()._grille_poids(
            ligne,
            centre=CENTRE_GABARIT if centre is None else centre,
            cote_total=cote_total,
        )

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        # Les 24 arêtes qui aboutissent au rond 0 passent seules en brique.
        # Elles désignent le neurone dont on va lire les poids avant qu'aucun
        # mot ne soit écrit : le gabarit n'est pas une image de plus, c'est
        # CES arêtes-là, rangées autrement.
        traits = self.traits_vers(0)
        self.en_evidence(traits)
        self.wait(1.6)

        # `gabarit()` efface le réseau lui-même, au moment où la bande des 784
        # poids apparaît : passé là, le gabarit est seul à pleine opacité, et le
        # rond de sortie 0 avec son étiquette sont les seuls points du réseau
        # que la suite de la scène concerne.
        self.gabarit(0, duree=7.0)
        self.wait(0.7)

        repere_maximum = _repere(13, 25)
        repere_minimum = _repere(16, 15)

        cote_maximum = self.cote("maximum +1,0395\nen (13, 25)", taille=24)
        cote_minimum = self.cote(
            "minimum −1,4457\nau centre,\nen (16, 15)", taille=24
        )
        cote_zero = _cote_indice("un vrai 0 :\nz<sub>0</sub> = +14,0813")
        cote_huit = _cote_indice("un vrai 8 :\nz<sub>0</sub> = +0,3568")
        _poser(cote_maximum, 2.28)
        _poser(cote_minimum, 1.12)
        _poser(cote_zero, -0.72)
        _poser(cote_huit, -2.22)

        self.next_section("Les deux extrêmes du gabarit")
        self.play(Create(repere_maximum), FadeIn(cote_maximum), run_time=1.0)
        self.wait(0.6)
        self.play(Create(repere_minimum), FadeIn(cote_minimum), run_time=1.0)
        self.wait(1.2)

        self.next_section("Un vrai 0 se pose sur le gabarit")
        image_zero = self.Xte[IMAGE_DU_ZERO]
        superposition = _encre(image_zero)
        self.play(
            # La grille d'entrée change d'image en RESTANT au décor : elle dit
            # quelle image se pose, elle n'est pas ce qu'on regarde.
            Transform(self.grille, self.en_decor(self._grille(image_zero))),
            FadeIn(superposition),
            run_time=1.4,
        )
        # L'encre est translucide, mais elle passe quand même par-dessus les
        # deux cadres : ce sont eux qu'on vient regarder, ils repassent devant.
        self.bring_to_front(repere_maximum, repere_minimum)
        self.play(FadeIn(cote_zero), run_time=0.8)
        self.wait(2.2)

        self.next_section("Un vrai 8, et le score s'effondre")
        image_huit = self.Xte[IMAGE_DU_HUIT]
        self.play(
            Transform(self.grille, self.en_decor(self._grille(image_huit))),
            Transform(superposition, _encre(image_huit)),
            run_time=1.6,
        )
        self.play(FadeIn(cote_huit), run_time=0.8)
        self.wait(2.6)
