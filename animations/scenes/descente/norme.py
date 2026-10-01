"""
Chapitre 3 · la norme du gradient pendant l'entraînement.

Une scène. Le vecteur gradient, dessiné cinq fois à sa longueur mesurée, à cinq
époques de l'entraînement. Il raccourcit — mais pas régulièrement, et la scène
montre les deux.

Reprend `SOURCE.md` §9. La source pose une colonne de huit décimales à côté du
réseau et les fait varier **au hasard** à chaque tour, pour donner l'air du
mouvement ; on n'y lit donc rien sur la taille du gradient. Ici les cinq
longueurs sont les normes mesurées, et leur irrégularité est le sujet autant que
leur décroissance.

LA NEUVIÈME ÉPOQUE REMONTE AU-DESSUS DE LA QUATRIÈME. 0,065720 contre 0,058533 :
le gradient n'a pas rétréci de façon monotone, et une scène qui rangerait les
cinq flèches par longueur décroissante mentirait sur la mesure. L'assertion est
dans `descente_mob.py`, sur la table elle-même.

Remplace `la-descente-en-un-geste`, dont la spirale était une image : chaque tour
y valait une norme, mais une spirale ne se mesure pas.

Les nombres sortent de `cours/lecon3/mesures.py`, mesure 7, lignes 513 à 518.
"""

from manim import (  # type: ignore[import-not-found]
    LEFT,
    UP,
    Arrow,
    Brace,
    FadeIn,
    GrowArrow,
    Line,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE_55,
    TRAIT_COTE,
    SceneN7,
    appliquer_style,
)
from scenes.descente.descente_mob import MESURES, entier, nombre, verifier_la_part

# La plus grande norme donne la plus longue flèche ; les quatre autres suivent à
# la MÊME échelle. C'est ce qui rend les deux dernières presque invisibles, et
# c'est le fait de la page : à la trentième époque, il ne reste presque rien à
# corriger.
LONGUEUR_MAXIMALE = 5.6
ORIGINE_X = -3.5
# Relevé, pas choisi. Le filet du bandeau court à l'ordonnée 3,08 ; la cote du
# rapport se pose au-dessus de l'accolade, elle-même au-dessus de la première
# flèche, et l'empilement remonte donc avec l'écart entre les rangs. À 1,05 la
# cote culminait à 3,11 et mordait le filet de trois centièmes d'unité — le
# crible l'a relevé, l'œil ne l'aurait pas vu. À 0,95 elle s'arrête à 2,91, et
# le faisceau occupe encore 76 % de la hauteur du cadre.
ECART_RANGS = 0.95

ANIMATIONS = [
    {
        "id": "la-norme-du-gradient-decroit",
        "scene": "LaNormeDuGradientDecroit",
        "titre": "Le gradient rétrécit, et pas régulièrement",
        "bandeau": "LA NORME DU GRADIENT",
        "section": "Page 12 · Le trajet du chapitre, après le tableau des époques",
        "geste": "cinq flèches à la longueur mesurée, de la plus longue à presque rien",
        "notions": [
            "geste : cinq flèches à la longueur mesurée, de la plus longue à "
            "presque rien",
            "norme du gradient",
            "convergence",
            "époque",
        ],
        "legende": (
            "Cinq flèches partent d'une même verticale, une par époque mesurée, "
            "et chacune a pour longueur la norme du gradient à cette époque, "
            "toutes à la même échelle. La première traverse l'écran ; la "
            "troisième est plus longue que la deuxième — le gradient a repris "
            "de l'ampleur ; les deux dernières ne sont plus que des traits. Une "
            "accolade sur la première porte le rapport, 105."
        ),
        "mouvement": [
            "1. Une verticale se pose : l'origine commune des cinq flèches.",
            "2. La flèche de l'époque 0 pousse vers la droite sur toute la "
            "largeur ; son époque et sa norme s'inscrivent de part et d'autre.",
            "3. La flèche de l'époque 4 pousse, plus courte.",
            "4. Celle de l'époque 9 pousse, et elle est PLUS LONGUE que la "
            "précédente.",
            "5. Celles des époques 19 et 29 poussent : il n'en reste qu'un "
            "trait, puis presque rien.",
            "6. Une accolade court le long de la première flèche et porte 105, "
            "le rapport de la première à la dernière.",
        ],
        "ecran": [
            "époque 0", "époque 4", "époque 9", "époque 19", "époque 29",
            "0,087878", "0,058533", "0,065720", "0,002535", "0,000833", "105",
        ],
        "nombres": {
            "epoques": [0, 4, 9, 19, 29],
            "normes": [0.087878, 0.058533, 0.065720, 0.002535, 0.000833],
            "facteur": 105,
        },
        "alt": (
            "Un trait vertical se pose à gauche de l'écran : c'est l'origine "
            "commune de cinq flèches horizontales, empilées les unes sous les "
            "autres. La première pousse vers la droite et traverse presque "
            "toute la largeur du cadre ; à sa gauche s'inscrit « époque zéro », "
            "à sa droite sa longueur mesurée, zéro virgule zéro huit sept huit "
            "sept huit — c'est la norme du gradient au début de "
            "l'entraînement. La deuxième flèche pousse en dessous et s'arrête "
            "nettement plus tôt, à zéro virgule zéro cinq huit cinq trois "
            "trois, pour l'époque quatre. La troisième, celle de l'époque neuf, "
            "pousse à son tour et dépasse la deuxième : elle vaut zéro virgule "
            "zéro six cinq sept deux zéro, donc le gradient a repris de "
            "l'ampleur au lieu de continuer à décroître. Les deux dernières "
            "sont d'un autre ordre : celle de l'époque dix-neuf n'est plus "
            "qu'un trait court, zéro virgule zéro zéro deux cinq trois cinq, et "
            "celle de l'époque vingt-neuf est à peine visible à côté de "
            "l'origine, zéro virgule zéro zéro zéro huit trois trois. Une "
            "accolade de brique court enfin le long de la première flèche et "
            "porte un seul nombre, cent cinq : c'est par là que la norme du "
            "gradient a été divisée entre la première et la dernière époque "
            "mesurée."
        ),
    },
]


class LaNormeDuGradientDecroit(SceneN7):
    titre = "La norme du gradient"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        epoques = MESURES["epoques"]
        normes = MESURES["normes"]
        echelle = LONGUEUR_MAXIMALE / max(normes)

        haut = (len(epoques) - 1) * ECART_RANGS / 2.0
        ordonnees = [haut - rang * ECART_RANGS for rang in range(len(epoques))]

        self.next_section("L'origine commune")
        origine = Line(
            [ORIGINE_X, ordonnees[-1] - 0.45, 0],
            [ORIGINE_X, ordonnees[0] + 0.45, 0],
            stroke_width=TRAIT_COTE,
            color=ENCRE_55,
        )
        self.play(FadeIn(origine), run_time=0.6)

        fleches = []
        for rang, (epoque, norme) in enumerate(zip(epoques, normes)):
            self.next_section(f"Époque {epoque}")
            y = ordonnees[rang]
            longueur = float(norme) * echelle
            fleche = Arrow(
                [ORIGINE_X, y, 0],
                [ORIGINE_X + longueur, y, 0],
                buff=0.0,
                color=BRIQUE,
                stroke_width=TRAIT_COTE,
                max_tip_length_to_length_ratio=0.22,
            )
            fleches.append(fleche)

            nom = self.etiquette(f"époque {epoque}", taille=24, couleur=ENCRE_55)
            nom.next_to([ORIGINE_X, y, 0], LEFT, buff=0.24)
            valeur = self.cote(nombre(float(norme), 6), taille=24)
            valeur.move_to([6.45 - valeur.width / 2.0, y, 0])

            self.play(GrowArrow(fleche), run_time=0.7)
            self.play(FadeIn(nom), Write(valeur), run_time=0.5)

        self.next_section("Le rapport de la première à la dernière")
        accolade = Brace(fleches[0], UP, color=BRIQUE)
        facteur = self.cote(entier(int(MESURES["facteur"])), taille=24)
        facteur.next_to(accolade, UP, buff=0.12)
        self.play(FadeIn(accolade), Write(facteur), run_time=0.9)

        # Le sujet est le faisceau des cinq flèches, origine comprise. Il occupe
        # 4,6 unités sur les 6,21 du cadre, soit 74 %.
        verifier_la_part(self, VGroup(origine, *fleches), part=0.60)
        self.wait(2.0)


# ── Les nombres déclarés sont ceux de la table ──────────────────────────────

_declares = ANIMATIONS[0]["nombres"]
assert tuple(_declares["epoques"]) == MESURES["epoques"]
assert tuple(_declares["normes"]) == MESURES["normes"]
assert _declares["facteur"] == MESURES["facteur"]
assert round(MESURES["normes"][0] / MESURES["normes"][-1]) == MESURES["facteur"]
