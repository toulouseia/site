"""
Chapitre 3 · trois graines, trois creux.

Une scène, et la mesure la plus forte du chapitre. Trois entraînements au même
protocole — même réseau, même pas, mêmes trente époques — à trois graines
différentes, donnent trois solutions très éloignées les unes des autres et de
précisions presque identiques : 0,9814, 0,9823, 0,9816.

    Les trois trajets.   Trois points lâchés en même temps sur la même coupe,
                         à trois endroits. Ils descendent ensemble et arrivent
                         dans trois creux différents, à des altitudes voisines.

    Les trois distances. Les trois solutions, posées aux distances relatives
                         mesurées. Le triangle est presque équilatéral, et
                         chacun de ses côtés est juste en deçà de racine de
                         deux — la distance de deux directions orthogonales.

Reprend `SOURCE.md` §5 : dix points lâchés d'un coup sur une même courbe, qui se
répartissent entre les creux selon leur point de départ. Et §15, dont c'est le
seul énoncé retenu — « plusieurs minima locaux, de coût comparable » — que le
chapitre mesure au lieu de l'affirmer.

Remplace `trois-graines-trois-solutions` et `permuter-ne-change-rien`.

LA COUPE EST SCHÉMATIQUE, LES COTES SONT MESURÉES, et le fichier ne mélange pas
les deux : la courbe ne porte aucune graduation, et chaque nombre affiché vient
de `cours/lecon3/mesures.py`, mesure 6, lignes 468 à 482. Les trois creux sont
rangés par profondeur dans l'ordre des précisions mesurées — la meilleure au
plus bas — et l'écart entre eux est celui que la mesure dit : presque rien.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    Create,
    DashedLine,
    Dot,
    FadeIn,
    FadeOut,
    Line,
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
from scenes.descente.descente_mob import (
    COUPE_GRAINES,
    MESURES,
    nombre,
    point_ecran,
    verifier_la_part,
)

# Les trois départs, et le pas qui les sépare. Chacun tombe dans SON creux :
# l'assertion en bas du fichier le vérifie.
DEPARTS = (1.4, 5.0, 8.2)
ETA = 0.30
PAS = 30

# Quelle graine arrive dans quel creux. Le creux le plus profond revient à la
# graine la mieux notée — c'est le seul rangement que la mesure autorise, et il
# se lit de gauche à droite : graine 0, graine 2, graine 1.
GRAINES = (0, 2, 1)

# L'ordonnée commune des trois cotes et du nom de l'axe. L'axe des abscisses de
# la coupe court à −2,05 ; un bloc de deux lignes centré ici tient entre −2,80 et
# −2,20, donc sous l'axe et bien au-dessus de la marge.
ORDONNEE_DES_COTES = -2.50

# Et le nom de l'axe passe encore dessous, sur sa propre ligne.
ORDONNEE_DU_NOM = -3.15

ANIMATIONS = [
    {
        "id": "trois-graines-trois-creux",
        "scene": "TroisGrainesTroisCreux",
        "titre": "Trois fois le même protocole, trois réponses",
        "bandeau": "TROIS GRAINES, TROIS CREUX",
        "section": "Page 11 · Il n'y a pas une bonne réponse, après le tableau des trois graines",
        "geste": "trois points lâchés ensemble sur la même courbe",
        "notions": [
            "geste : trois points lâchés ensemble sur la même courbe",
            "minimum local",
            "initialisation",
            "distance relative",
        ],
        "legende": (
            "Une coupe du coût à trois creux d'altitudes voisines. Trois points "
            "se posent à trois endroits et descendent en même temps : chacun "
            "s'arrête dans le creux au-dessus duquel il se trouvait, et les "
            "trois précisions mesurées s'inscrivent sous eux. Les trois "
            "solutions se posent ensuite en triangle, aux distances relatives "
            "mesurées, contre un segment de référence à racine de deux."
        ),
        "mouvement": [
            "1. Le repère se dessine, ses deux axes nommés.",
            "2. La courbe se trace : trois creux, deux bosses.",
            "3. Trois points de brique se posent, à trois endroits distincts.",
            "4. Ils descendent EN MÊME TEMPS, chacun suivant sa pente.",
            "5. Chacun s'immobilise dans un creux différent ; sa graine et sa "
            "précision s'inscrivent.",
            "6. La coupe s'efface ; les trois solutions se posent en triangle "
            "aux trois distances mesurées, avec la référence à racine de deux.",
        ],
        "ecran": [
            "un paramètre", "le coût",
            "graine 0", "graine 2", "graine 1",
            "0,9814", "0,9816", "0,9823",
            "1,4036", "1,4010", "1,3991", "1,4142",
        ],
        "nombres": {
            "precisions": [0.9814, 0.9823, 0.9816],
            "distances": [1.4036, 1.4010, 1.3991],
            "racine_deux": 1.4142,
        },
        "alt": (
            "Un repère occupe l'écran, l'axe horizontal nommé « un paramètre », "
            "l'axe vertical « le coût ». Une courbe épaisse s'y trace, "
            "ondulante : trois creux séparés par deux bosses arrondies, et les "
            "trois creux sont sensiblement à la même hauteur, celui de droite "
            "à peine plus bas que celui du milieu, lui-même à peine plus bas "
            "que celui de gauche. Trois points pleins de brique se posent "
            "alors sur la courbe, à trois endroits éloignés les uns des "
            "autres. Ils se mettent à descendre tous les trois en même temps, "
            "chacun glissant vers le bas de la pente sous lui, d'abord vite "
            "puis de plus en plus lentement. Aucun ne rejoint les autres : "
            "chacun s'immobilise au fond du creux au-dessus duquel il se "
            "trouvait au départ. Sous chaque point s'inscrivent alors le nom "
            "de sa graine et la précision qu'elle a mesurée : graine zéro, "
            "zéro virgule neuf huit un quatre ; graine deux, zéro virgule neuf "
            "huit un six ; graine un, zéro virgule neuf huit deux trois. Les "
            "trois se ressemblent au quatrième chiffre. La courbe s'efface "
            "ensuite, et les trois solutions reparaissent comme trois points "
            "formant un triangle presque équilatéral, dont les trois côtés "
            "portent leur longueur mesurée : un virgule quatre zéro trois six, "
            "un virgule quatre zéro un zéro, un virgule trois neuf neuf un. "
            "Sous le triangle, un segment pointillé de même facture porte un "
            "virgule quatre un quatre deux, la valeur qu'aurait chaque côté si "
            "les trois solutions étaient exactement orthogonales : les trois "
            "côtés mesurés sont juste en dessous."
        ),
    },
]


class TroisGrainesTroisCreux(SceneN7):
    titre = "Trois graines, trois creux"

    coupe = COUPE_GRAINES

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        self._les_trois_trajets()
        self._les_trois_distances()

    # ── Les trois trajets ───────────────────────────────────────────────────

    def _les_trois_trajets(self) -> None:
        self.next_section("La coupe")
        axes = self.coupe.repere()
        courbe = self.coupe.courbe(axes)
        sujet = VGroup(axes, courbe)
        verifier_la_part(self, sujet, part=0.60)

        self.play(Create(axes), run_time=0.9)
        # LE NOM DE L'AXE PASSE SOUS LA RANGÉE DES COTES. Accroché au bout de
        # l'axe comme dans les scènes de la bille, il s'écrivait par-dessus
        # « graine 1 » ; poussé à droite sur la même ligne, il y retombait — à
        # la taille du corps il fait deux unités de large, et la troisième cote
        # est à trois et demie. Sous les cotes, il a toute la largeur, et il
        # reste à un quart d'unité de la marge.
        nom_x = self.etiquette("un paramètre", taille=24, couleur=ENCRE_55)
        nom_x.move_to([0.0, ORDONNEE_DU_NOM, 0])
        nom_y = self.etiquette("le coût", taille=24, couleur=ENCRE_55)
        nom_y.next_to(axes.y_axis.get_top(), RIGHT, buff=0.20)
        self.play(FadeIn(nom_x), FadeIn(nom_y), run_time=0.5)
        self.play(Create(courbe), run_time=2.0)

        self.next_section("Trois départs")
        trajets = [self.coupe.descente(w, ETA, PAS) for w in DEPARTS]
        points = [
            Dot(point_ecran(axes, self.coupe, w), radius=0.09, color=BRIQUE)
            for w in DEPARTS
        ]
        self.play(*[FadeIn(p) for p in points], run_time=0.6)

        # ILS DESCENDENT EN MÊME TEMPS, pas l'un après l'autre. Trois trajets
        # joués à la suite se liraient comme trois essais ; joués ensemble, ils
        # se lisent comme trois destins — et c'est ce que la mesure dit.
        self.next_section("Ils descendent ensemble")
        for rang in range(PAS):
            avance = [
                p.animate.move_to(point_ecran(axes, self.coupe, t[rang + 1]))
                for p, t in zip(points, trajets)
            ]
            self.play(*avance, run_time=0.26 if rang < 6 else 0.11)

        self.next_section("Trois creux, trois précisions")
        # LES TROIS COTES S'ALIGNENT SOUS L'AXE, À UNE ORDONNÉE POSÉE. Accrochées
        # à leur point, elles suivaient la profondeur du creux et venaient
        # s'écrire EN TRAVERS de l'axe des abscisses — trois textes couchés sur
        # un tracé, que le crible compte. Sous l'axe, elles se lisent, et elles
        # s'alignent entre elles.
        cotes = VGroup()
        for point, graine in zip(points, GRAINES):
            nom = self.etiquette(f"graine {graine}", taille=24, couleur=ENCRE_55)
            valeur = self.cote(nombre(MESURES["precisions"][graine]), taille=24)
            bloc = VGroup(nom, valeur).arrange(DOWN, buff=0.12)
            bloc.move_to([point.get_center()[0], ORDONNEE_DES_COTES, 0])
            cotes.add(bloc)
        self.play(FadeIn(cotes, lag_ratio=0.25), run_time=1.2)
        self.wait(1.6)

        self.a_effacer = VGroup(sujet, nom_x, nom_y, cotes, *points)

    # ── Les trois distances ─────────────────────────────────────────────────

    def _les_trois_distances(self) -> None:
        self.next_section("Les trois solutions, à leurs distances")
        self.play(FadeOut(self.a_effacer), run_time=0.8)

        d01, d02, d12 = (float(d) for d in MESURES["distances"])

        # Le triangle SE DÉDUIT des trois distances, il n'est pas dessiné à
        # l'estime : deux sommets posés, le troisième trouvé par intersection.
        # Ses côtés sont donc les longueurs mesurées, à un facteur près — et le
        # segment de référence subit le même facteur, sinon la comparaison ne
        # voudrait rien dire.
        a = np.array([0.0, 0.0, 0.0])
        b = np.array([d01, 0.0, 0.0])
        x = (d01 * d01 + d02 * d02 - d12 * d12) / (2.0 * d01)
        c = np.array([x, float(np.sqrt(max(d02 * d02 - x * x, 0.0))), 0.0])

        cotes_sommets = [a, b, c]
        aretes = VGroup(
            Line(a, b, stroke_width=TRAIT_COTE, color=ENCRE),
            Line(a, c, stroke_width=TRAIT_COTE, color=ENCRE),
            Line(b, c, stroke_width=TRAIT_COTE, color=ENCRE),
        )
        sommets = VGroup(*[Dot(p, radius=0.10, color=BRIQUE) for p in cotes_sommets])
        reference = DashedLine(
            a + DOWN * 0.85,
            a + DOWN * 0.85 + RIGHT * float(MESURES["racine_deux"]),
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
            dash_length=0.07,
        )

        # LA FIGURE EST DIMENSIONNÉE, PAS AGRANDIE JUSQU'AU BORD. La cote de la
        # référence se pose SOUS elle : agrandie jusqu'à toucher la marge, la
        # figure ne lui laisserait plus de place. 3,9 unités sur les 6,21 du
        # cadre font 63 %, et `verifier_la_part` le confirme.
        figure = VGroup(aretes, sommets, reference)
        figure.set(height=3.9)
        gauche, droite, bas, haut = self.cadre_sujet()
        figure.move_to([0.0, (haut + bas) / 2.0, 0.0])
        verifier_la_part(self, figure, part=0.60)

        self.play(Create(aretes), FadeIn(sommets), run_time=1.4)

        # Les cotes se posent APRÈS la mise à l'échelle : un texte agrandi avec
        # sa figure ne ferait plus la taille du corps.
        # Chaque cote se pose du côté EXTÉRIEUR de son arête : vers le bas pour
        # la base, vers la gauche et vers la droite pour les deux montantes.
        cotes = VGroup()
        for arete, longueur, dehors in zip(
            aretes, (d01, d02, d12), (DOWN, LEFT, RIGHT)
        ):
            texte = self.cote(nombre(longueur), taille=24)
            texte.move_to(arete.get_center() + dehors * 0.62)
            cotes.add(texte)
        self.play(FadeIn(cotes, lag_ratio=0.2), run_time=1.0)

        self.next_section("Ce que vaudrait l'orthogonalité")
        cote_reference = self.cote(
            nombre(float(MESURES["racine_deux"])), taille=24
        )
        cote_reference.next_to(reference, DOWN, buff=0.16)
        self.play(Create(reference), Write(cote_reference), run_time=1.0)
        self.wait(2.0)


# ── Chaque départ tombe dans SON creux ──────────────────────────────────────
#
# Trois points qui finiraient dans le même creux diraient le contraire de ce que
# la mesure 6 établit. C'est donc vérifié ici, pas à l'œil sur un rendu.

_ARRIVEES = [COUPE_GRAINES.descente(w, ETA, PAS)[-1] for w in DEPARTS]
assert len({round(w, 1) for w in _ARRIVEES}) == 3, (
    f"les trois départs ne mènent pas à trois creux distincts : {_ARRIVEES}"
)
for _w, _creux in zip(_ARRIVEES, COUPE_GRAINES.creux):
    assert abs(_w - _creux) < 0.05

# Les trois côtés du triangle sont bien en deçà de racine de deux, et le
# triangle existe : c'est l'inégalité triangulaire, vérifiée sur les mesures.
_d01, _d02, _d12 = MESURES["distances"]
assert _d01 + _d02 > _d12 and _d01 + _d12 > _d02 and _d02 + _d12 > _d01
assert max(MESURES["distances"]) < MESURES["racine_deux"]
