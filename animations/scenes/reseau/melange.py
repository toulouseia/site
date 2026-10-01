"""
Chapitre 2 · page 6 · Mélanger les 784 entrées ne change pas les dix scores.

La page vient de poser W : dix lignes, sept cent quatre-vingt-quatre colonnes,
une ligne par neurone et une colonne par pixel. La scène prend cette lecture au
mot. On brouille l'image — les 784 cases se réordonnent, le 7 devient une
bouillie — puis on réordonne les colonnes de W de la même façon, et on repropage.
Les dix scores sont les mêmes, chiffre pour chiffre. C'est la proposition 1,
jouée sur l'objet que la page vient d'introduire.

CE QUI FAIT L'ARGUMENT, C'EST L'IMMOBILITÉ DES NOMBRES. Les dix scores sont à
l'écran de la première à la dernière trame, à la hauteur du neurone qui les
produit, et ils ne se déplacent jamais. Ceux d'après s'écrivent à côté, dans
leur propre colonne, et non à la place des premiers : deux colonnes qu'on
compare valent mieux qu'une qui se réécrit et qu'il faudrait avoir mémorisée.

LA PERMUTATION EST CELLE DE mesures.py, ET C'EST LE SEUL TIRAGE DE LA SCÈNE :
numpy.random.default_rng(0).permutation(784). Graine 0, aucune autre, aucun
appel à random ailleurs — le rendu est reproductible à l'octet près. Les vingt
nombres affichés ne sont pas recalculés ici : ce sont les chaînes de
mesures-chap2.txt, lignes 448 et 449. Le calcul ne sert qu'à allumer les ronds.

POURQUOI LES POINTS DE SUSPENSION SONT AUX DEUX BOUTS, et pas seulement au
milieu comme dans un tableau ordinaire. Les premières et les dernières colonnes
de ce W valent exactement zéro — mesuré : ce sont les coins de l'image, où
aucune encre ne tombe jamais et où aucun gradient n'arrive. Les montrer donnerait
un tableau blanc, puis un tableau coloré après la permutation — on lirait « W a
changé » au lieu de « W s'est réordonnée ». La fenêtre est donc prise là où la
matrice porte quelque chose, et l'abréviation encadre les deux côtés.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    LEFT,
    RIGHT,
    Create,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    Rectangle,
    Transform,
    VGroup,
)

from scenes.n7ia import ENCRE, GRIS_40, GRIS_58, TRAIT_FILET, appliquer_style
from scenes.reseau_mob import OPACITE_VOILE, ReseauScene, avant

# ── La permutation, et rien qu'elle ─────────────────────────────────────────
#
# Le seul tirage autorisé de la scène, et il est déterministe : c'est
# littéralement la ligne de cours/lecon2/mesures.py dont sortent les nombres de
# la page. `PERMUTATION[j]` est le rang d'origine du pixel qui vient occuper le
# rang j ; `INVERSE[i]` est donc le rang où part le pixel i, et c'est cet
# indice-là qu'il faut pour animer une case qui se déplace.

GRAINE = 0
PERMUTATION = np.random.default_rng(GRAINE).permutation(784)
INVERSE = np.argsort(PERMUTATION)

# ── Les vingt nombres, tels qu'ils s'écrivent ───────────────────────────────
#
# mesures-chap2.txt, lignes 448 et 449 : les deux relevés sont identiques. La
# virgule décimale et le signe moins U+2212 sont ceux du reste du cours.

SCORES = (
    "−0,7038",
    "−15,7630",
    "0,6208",
    "8,6137",
    "−2,4858",
    "1,6668",
    "−12,4084",
    "14,4198",
    "1,6605",
    "4,3794",
)

# ── La bande libre, à droite de x = 3,4 ─────────────────────────────────────

X_AVANT = 4.85          # bord DROIT de la colonne « avant »
X_APRES = 6.30          # bord DROIT de la colonne « après »
# L'en-tête se pose au-dessus du premier score. Les ronds de sortie ont grandi
# — 0,3 de rayon — et la colonne monte donc plus haut : à 0,45 au-dessus du
# premier rond, le mot passait sous le filet du bandeau de titre, qui court à
# 3,076, et ce filet s'arrête à x = 5,79. L'en-tête passe donc AU-DESSUS de
# lui, dans la bande du titre, qui est vide à droite.
HAUTEUR_ENTETE = 0.55   # au-dessus du premier score, sous le filet du titre

# ── Le tableau de W, entre les deux colonnes de ronds ───────────────────────
#
# Les dix bandes sont posées à l'ordonnée des dix ronds de sortie : c'est la
# proposition de la page, « la ligne k de W est le neurone k », rendue par la
# géométrie plutôt que par une légende.

COLONNES_MONTREES = 5
PAS_COLONNE = 0.30
LARGEUR_CELLULE = 0.27
HAUTEUR_CELLULE = 0.38

X_SUSPENSION_G = -2.30
X_PREMIERE_G = -1.90
X_SUSPENSION_M = -0.30
X_PREMIERE_D = 0.10
X_SUSPENSION_D = 1.70

X_CROCHET_G = -2.66
X_CROCHET_D = 2.02
DENT_CROCHET = 0.14

# La fenêtre montrée. Deux tranches de cinq colonnes contiguës, choisies parce
# qu'elles portent quelque chose AVANT comme APRÈS la permutation : le
# déplacement doit se lire comme un réordonnancement, pas comme une apparition.
FENETRE_G = tuple(range(314, 319))
FENETRE_D = tuple(range(485, 490))
MONTREES = FENETRE_G + FENETRE_D

# De combien une colonne sortante s'éloigne avant de disparaître. 0,7 la mène
# sous les points de suspension sans la faire entrer dans le « ⋮ » de la
# colonne d'entrée, qui vit à x = −3,0.
FUITE = 0.7


ANIMATIONS = [
    {
        "id": "le-reseau-melange",
        "scene": "LeReseauMelange",
        "titre": "L'image se brouille, les colonnes de W se réordonnent, "
                 "et les dix scores ne bougent pas",
        "alt": (
            "À gauche, une petite grille carrée porte un sept manuscrit en "
            "gris. Au centre, deux colonnes de ronds vides sont reliées par "
            "un voile de traits très pâles ; celle de droite compte dix ronds "
            "étiquetés de zéro à neuf, et celui du sept est noirci et cerclé "
            "de rouge. Tout à droite, dix nombres sont écrits l'un sous "
            "l'autre, chacun à la hauteur du rond qui lui répond, sous le mot "
            "« avant ». Les cases de la grille se mettent alors à bouger "
            "ensemble, chacune vers une autre place ; quand elles "
            "s'immobilisent, le sept a disparu et il ne reste qu'un semis de "
            "taches grises où aucune forme ne se reconnaît. Le voile de traits "
            "s'efface, et dix bandes horizontales de petits carrés rouges et "
            "bleus s'installent à sa place, une par rond de la colonne de "
            "droite, entre deux crochets ; des points de suspension y "
            "remplacent la plupart des carrés. Les carrés montrés glissent "
            "au-dehors et s'effacent, et d'autres arrivent en sens "
            "inverse pour prendre leur place. Les bandes disparaissent, le "
            "voile de traits revient, et les taches de la grille brouillée "
            "s'envolent une à une vers la colonne de gauche, qui se remplit "
            "d'un motif tout autre qu'au début. La lumière traverse, la "
            "colonne de droite s'allume exactement comme la première fois, et "
            "le même cadre rouge se referme sur le rond du sept. Dix nombres "
            "s'écrivent enfin sous le mot « après », à côté des premiers : ce "
            "sont les mêmes, chiffre pour chiffre."
        ),
        "duree": None,
        "notions": [
            "geste : les colonnes sortent et rentrent par les points de suspension",
            "matrice de permutation",
            "invariance des scores",
            "une ligne de W est un neurone, une colonne est un pixel",
            "ce que l'aplatissement coûte",
        ],
        "source": "SOURCE.md · séquence 13:40 → 15:10",
        "page": 6,
        "apres_bloc": "b-r6-5",
        "ce_qui_change": "l'image devient illisible, les scores non.",
        "texte_ecran": [
            "PROPOSITION 1",
            "avant",
            "−0,7038", "−15,7630", "0,6208", "8,6137", "−2,4858",
            "1,6668", "−12,4084", "14,4198", "1,6605", "4,3794",
            "après",
            "−0,7038", "−15,7630", "0,6208", "8,6137", "−2,4858",
            "1,6668", "−12,4084", "14,4198", "1,6605", "4,3794",
        ],
        "nombres": [
            {"valeur": "−0,7038", "quoi": "z du 0, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "−15,7630", "quoi": "z du 1, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "0,6208", "quoi": "z du 2, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "8,6137", "quoi": "z du 3, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "−2,4858", "quoi": "z du 4, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "1,6668", "quoi": "z du 5, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "−12,4084", "quoi": "z du 6, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "14,4198", "quoi": "z du 7, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "1,6605", "quoi": "z du 8, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "4,3794", "quoi": "z du 9, image de test 0, modèle linéaire, avant permutation", "ligne": 448},
            {"valeur": "−0,7038", "quoi": "z du 0, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "−15,7630", "quoi": "z du 1, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "0,6208", "quoi": "z du 2, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "8,6137", "quoi": "z du 3, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "−2,4858", "quoi": "z du 4, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "1,6668", "quoi": "z du 5, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "−12,4084", "quoi": "z du 6, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "14,4198", "quoi": "z du 7, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "1,6605", "quoi": "z du 8, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "4,3794", "quoi": "z du 9, après permutation des 784 entrées et des colonnes de W", "ligne": 449},
            {"valeur": "784", "quoi": "la taille de l'entrée, cotée par l'accolade de la colonne d'entrée du réseau partagé", "ligne": 407},
            {"valeur": "319", "quoi": "permutation de graine 0 : le premier rang va au rang 319 — non affiché, il commande le déplacement des cases", "ligne": 446},
            {"valeur": "5.329e-15", "quoi": "écart maximal entre les dix scores d'avant et ceux d'après — non affiché : c'est zéro à la précision de la machine", "ligne": 450},
        ],
        "legende": (
            "Les 784 cases de l'image se réordonnent selon une permutation "
            "fixe, et les colonnes de W se réordonnent de la même façon. Les "
            "dix scores écrits à droite sont les mêmes avant et après, chiffre "
            "pour chiffre : l'écart maximal entre les deux relevés vaut cinq "
            "millionièmes de milliardième."
        ),
    },
]


def _poser_a_droite(mobject, x_droite: float, y: float):
    """
    Un texte dont le BORD DROIT est à `x_droite`. Les dix scores ont tous
    quatre décimales : les caler à droite aligne leurs virgules, et c'est ce
    qui rend la comparaison des deux colonnes immédiate. Les centrer ferait
    dépasser les deux nombres négatifs à deux chiffres et casserait la lecture.
    """
    mobject.move_to([x_droite - mobject.width / 2.0, y, 0])
    return mobject


def _crochet(x: float, sens: int, haut: float, bas: float) -> VGroup:
    """Un crochet de matrice : une hampe et ses deux dents, tournées vers `sens`."""
    dent = DENT_CROCHET * sens
    return VGroup(
        Line([x, bas, 0], [x, haut, 0], stroke_width=TRAIT_FILET, color=GRIS_58),
        Line([x, haut, 0], [x + dent, haut, 0], stroke_width=TRAIT_FILET, color=GRIS_58),
        Line([x, bas, 0], [x + dent, bas, 0], stroke_width=TRAIT_FILET, color=GRIS_58),
    )


class LeReseauMelange(ReseauScene):
    titre = "Proposition 1"
    modele = "lineaire"
    tailles = (784, 10)
    activation = "identite"

    # ── Le tableau de W ─────────────────────────────────────────────────────

    def _abscisses_montrees(self) -> list[float]:
        gauche = [X_PREMIERE_G + i * PAS_COLONNE for i in range(COLONNES_MONTREES)]
        droite = [X_PREMIERE_D + i * PAS_COLONNE for i in range(COLONNES_MONTREES)]
        return gauche + droite

    def _colonne_de_poids(self, rang_colonne: int, x: float, haut: float) -> VGroup:
        """
        Les dix cellules d'une colonne de W, une par ligne, à l'abscisse `x`.

        L'échelle est celle de la page 4 : brique pour le positif, bleu pour le
        négatif, opacité proportionnelle à |w| / haut. Elle est divergente et
        symétrique, donc un zéro est invisible et deux poids opposés ont la même
        force.
        """
        W = self.theta["W1"]
        cellules = VGroup()
        for ligne in range(10):
            couleur, opacite = self._couleur_poids(
                float(W[ligne, rang_colonne]), haut
            )
            cellule = Rectangle(
                width=LARGEUR_CELLULE, height=HAUTEUR_CELLULE, stroke_width=0.0
            )
            cellule.set_fill(couleur, opacity=opacite)
            cellule.move_to([x, self.sortie.ronds[ligne].get_y(), 0])
            cellules.add(cellule)
        return cellules

    def _echelle_des_poids(self) -> float:
        """
        Un seul maximum pour les deux états du tableau.

        Renormaliser après la permutation ferait varier les couleurs sans que
        W ait changé de valeur : la comparaison ne voudrait plus rien dire.
        """
        W = self.theta["W1"]
        deux_etats = np.concatenate(
            [W[:, list(MONTREES)], W[:, PERMUTATION[list(MONTREES)]]], axis=1
        )
        return float(np.abs(deux_etats).max())

    def _suspensions(self) -> VGroup:
        """Les trois points de suspension de chaque ligne, aux deux bouts et au milieu."""
        points = VGroup()
        for ligne in range(10):
            for x in (X_SUSPENSION_G, X_SUSPENSION_M, X_SUSPENSION_D):
                trois = MathTex(r"\cdots", color=GRIS_58, font_size=28)
                trois.move_to([x, self.sortie.ronds[ligne].get_y(), 0])
                points.add(trois)
        return points

    # ── La scène ────────────────────────────────────────────────────────────

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        image = self.poser_image(0)
        cache_avant = avant(self.theta, image, self.activation)

        # La permutation appliquée aux DEUX objets à la fois : c'est la seule
        # forme sous laquelle la proposition 1 dit quelque chose. Permuter
        # l'image seule changerait les scores, et ce serait une autre scène.
        image_melangee = image[PERMUTATION]
        theta_melange = {
            "W1": self.theta["W1"][:, PERMUTATION],
            "b1": self.theta["b1"],
        }
        cache_apres = avant(theta_melange, image_melangee, self.activation)

        # Le garde-fou du fichier : si l'égalité tombait, la scène montrerait
        # une chose et le cours en dirait une autre. mesures-chap2.txt mesure
        # l'écart à 5,329e−15 ; on se donne trois ordres de grandeur de marge.
        ecart = float(np.abs(cache_avant["Z1"] - cache_apres["Z1"]).max())
        assert ecart < 1e-12, f"les scores diffèrent de {ecart:.3e}"

        # ── L'état de départ : la propagation est déjà jouée ─────────────────
        #
        # Rien n'est animé ici. La fiche demande que le réseau, l'image, les
        # couches allumées et les dix scores soient là dès la première trame ;
        # rejouer la propagation coûterait huit secondes pour redire ce que la
        # page 2 a déjà montré.
        self.entree.ronds.become(self.entree.allumer(image))
        self.sortie.ronds.become(self.sortie.allumer(cache_avant["A1"]))
        gagnant = int(np.argmax(cache_avant["A1"]))
        self.cadre = self._cadre_sortie(gagnant)
        self.add(self.cadre)

        colonne_avant = self._colonne_de_scores(X_AVANT, "avant")
        self.add(colonne_avant)
        self.wait(2.5)

        # ── 1. Les 784 cases se réordonnent ─────────────────────────────────
        self.next_section("La permutation brouille l'image")
        places = [case.get_center() for case in self.grille]
        cible = VGroup()
        for rang, case in enumerate(self.grille):
            voyageuse = case.copy()
            voyageuse.move_to(places[INVERSE[rang]])
            cible.add(voyageuse)
        self.play(Transform(self.grille, cible), run_time=3.4)

        # Après le Transform, la case d'indice k n'est plus à la place k : la
        # grille est juste, ses indices ne le sont plus. On la refait à
        # l'identique depuis l'image mélangée, sans rien changer à l'écran,
        # pour que `pixels_vers_couche` envoie de nouveau chaque case à son rang.
        self.grille.become(self._grille(image_melangee))
        self.wait(1.3)

        # ── 2. W paraît, puis ses colonnes se réordonnent ───────────────────
        self.next_section("Les colonnes de W se réordonnent de la même façon")
        haut = self._echelle_des_poids()
        abscisses = self._abscisses_montrees()
        bas_bande = self.sortie.ronds[9].get_y() - 0.30
        haut_bande = self.sortie.ronds[0].get_y() + 0.30
        crochets = VGroup(
            _crochet(X_CROCHET_G, +1, haut_bande, bas_bande),
            _crochet(X_CROCHET_D, -1, haut_bande, bas_bande),
        )
        points = self._suspensions()
        colonnes_avant = [
            self._colonne_de_poids(rang, x, haut)
            for rang, x in zip(MONTREES, abscisses)
        ]

        # Le voile des arêtes s'efface pour laisser la place au tableau : les
        # deux disent la même chose — les 7 840 poids — et les superposer
        # poserait un texte sur un tracé.
        self.play(
            self.faisceaux.animate.set_stroke(opacity=0.0),
            FadeIn(crochets),
            FadeIn(points),
            *[FadeIn(colonne) for colonne in colonnes_avant],
            run_time=1.6,
        )
        self.wait(1.0)

        # Les points de suspension s'effacent le temps de l'échange : les
        # colonnes passent par là, et un carré qui glisserait sous eux se
        # poserait sur du texte.
        self.play(FadeOut(points), run_time=0.35)

        colonnes_apres = [
            self._colonne_de_poids(int(PERMUTATION[rang]), x, haut)
            for rang, x in zip(MONTREES, abscisses)
        ]
        # Chaque tranche sort par son bord et rentre par le même : les colonnes
        # qui arrivent viennent du reste de la matrice, pas d'ailleurs.
        #
        # EN DEUX TEMPS, ET C'EST MESURÉ SUR LA TRAME. Sorties et entrées jouées
        # ensemble se croisent au milieu du parcours, chacune à demi-opacité :
        # la trame la plus chargée donnait une bouillie où l'on ne distinguait
        # plus ce qui partait de ce qui arrivait. Les anciennes s'en vont, les
        # neuves prennent la place — et le décalage lit dans l'ordre.
        fuites = [LEFT * FUITE] * COLONNES_MONTREES + [RIGHT * FUITE] * COLONNES_MONTREES
        self.play(
            *[
                FadeOut(colonne, shift=fuite)
                for colonne, fuite in zip(colonnes_avant, fuites)
            ],
            lag_ratio=0.08,
            run_time=1.4,
        )
        self.play(
            *[
                FadeIn(colonne, shift=-fuite)
                for colonne, fuite in zip(colonnes_apres, fuites)
            ],
            lag_ratio=0.08,
            run_time=1.6,
        )
        self.play(FadeIn(points), run_time=0.5)
        self.wait(1.4)

        # ── 3. On repropage, sur l'image et la matrice mélangées ────────────
        self.next_section("La propagation, sur l'image et W mélangées")
        eteinte_entree = self.entree.ronds.copy().set_fill(ENCRE, opacity=0.0)
        eteinte_sortie = self.sortie.ronds.copy().set_fill(ENCRE, opacity=0.0)
        self.play(
            FadeOut(crochets),
            FadeOut(points),
            *[FadeOut(colonne) for colonne in colonnes_apres],
            FadeOut(self.cadre),
            Transform(self.entree.ronds, eteinte_entree),
            Transform(self.sortie.ronds, eteinte_sortie),
            self.faisceaux.animate.set_stroke(
                GRIS_40, opacity=OPACITE_VOILE, width=0.7
            ),
            run_time=1.4,
        )

        self.pixels_vers_couche(image_melangee, duree=2.4)
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image_melangee)),
            run_time=0.6,
        )
        self.play(
            self._vague(0, duree=1.8),
            Transform(self.sortie.ronds, self.sortie.allumer(cache_apres["A1"])),
            run_time=1.8,
        )
        self.cadre = self._cadre_sortie(int(np.argmax(cache_apres["A1"])))
        self.play(Create(self.cadre), run_time=0.7)
        self.wait(0.8)

        # ── Les mêmes dix nombres, à côté des premiers ──────────────────────
        self.next_section("Les dix scores, chiffre pour chiffre")
        colonne_apres = self._colonne_de_scores(X_APRES, "après")
        self.play(FadeIn(colonne_apres), run_time=1.2)
        self.wait(3.0)

    # ── Les deux colonnes de nombres ────────────────────────────────────────

    def _colonne_de_scores(self, x_droite: float, entete: str) -> VGroup:
        """
        Les dix scores, chacun à l'ordonnée du rond de sortie qui le produit.

        Aligner les nombres sur les neurones évite d'avoir à réécrire les
        chiffres 0 à 9 devant eux : ils sont déjà à côté des ronds, et la
        règle 19 interdit de dire deux fois la même chose.
        """
        groupe = VGroup()
        for k, texte in enumerate(SCORES):
            nombre = self.cote(texte, taille=20)
            _poser_a_droite(nombre, x_droite, self.sortie.ronds[k].get_y())
            groupe.add(nombre)
        libelle = self.etiquette(entete, taille=24, couleur=GRIS_58)
        _poser_a_droite(
            libelle, x_droite, self.sortie.ronds[0].get_y() + HAUTEUR_ENTETE
        )
        groupe.add(libelle)
        return groupe
