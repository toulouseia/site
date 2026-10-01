"""
Chapitre 2 · page 8 · Empiler sans activation ne change pas les scores.

Une scène, et un seul argument : le réseau 784 → 128 → 10 SANS rien entre ses
deux couches perd sa colonne du milieu, et les dix scores qu'il produit ne
bougent pas d'un chiffre. C'est la proposition 3 rendue visible — la composée
de deux applications affines est une application affine — sans qu'une seule
ligne de démonstration soit réécrite à l'écran.

LA CASE D'ACTIVATION VIDE EST LE POINT DE LA SCÈNE. Le réseau de la page 8 et
celui de la page 9 se dessinent exactement pareil : trois colonnes, deux
faisceaux. Ce qui les sépare est ce qu'on a mis entre les deux couches, et le
seul moyen de le montrer est de dessiner la place restée libre. Une case
carrée, vide, cerclée de pointillé, posée dans le faisceau.

LES DIX SCORES NE SONT PAS RECALCULÉS. Ils sont lus dans
`travail-source/mesures-chap2.txt`, lignes 439 et 440 — les deux lignes portent
les mêmes dix nombres. L'écart maximal entre elles, 3,553 · 10⁻¹⁵ (ligne 441),
ne s'écrit nulle part : c'est zéro à la précision de la machine, et l'afficher
ferait croire à une différence là où il n'y en a pas.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    RIGHT,
    DashedVMobject,
    FadeIn,
    FadeOut,
    LaggedStart,
    Line,
    ShowPassingFlash,
    Square,
    Transform,
    VGroup,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    GRIS_40,
    GRIS_58,
    PAPIER,
    TRAIT_FILET,
    appliquer_style,
)
from scenes.reseau_mob import OPACITE_VOILE, ReseauScene, avant

# Les dix scores de l'image de test n° 0, AVANT la softmax. Mesurés :
# mesures-chap2.txt, ligne 439 pour le réseau à deux couches, ligne 440 pour le
# réseau à une seule. LES DEUX LIGNES PORTENT LES MÊMES DIX NOMBRES, et c'est
# pour cela que la scène n'en écrit qu'une liste : la seconde colonne affiche
# celle-ci une deuxième fois, chiffre pour chiffre.
SCORES = (
    "1,0432",
    "−13,7648",
    "1,5864",
    "8,1577",
    "−2,7568",
    "1,7577",
    "−13,1348",
    "13,0672",
    "1,5962",
    "4,5236",
)

# La bande x > 3,4 est libre : c'est la seule où un texte ne rencontre ni un
# rond, ni une étiquette de sortie, ni un trait. Les deux colonnes de scores y
# sont calées par la DROITE, pour que les virgules décimales s'alignent et que
# l'œil compare deux colonnes plutôt que vingt nombres.
X_DROITE_DEUX_COUCHES = 4.70
X_DROITE_UNE_SEULE = 6.55

# Les deux libellés se posent au-dessus des colonnes, sous le filet du bandeau.
# L'en-tête se pose AU-DESSUS des dix scores, et les dix scores se posent à la
# hauteur de leur rond de sortie. Ces ronds ont grandi — 0,3 de rayon, pour
# qu'une étiquette s'y lise —, la colonne monte donc jusqu'à 3,05 et le premier
# score avec elle : l'en-tête à 2,82 lui passait dessus. Elle vit maintenant
# entre le sommet de la colonne et le filet du bandeau, qui court à 3,36.
# LE FILET DU BANDEAU COURT À 3,076, et il s'arrête à x = 5,79. Entre le
# premier score, dont le sommet monte à 2,88, et ce filet, il reste deux
# dixièmes d'unité : un mot de taille 24 en mesure vingt-six centièmes et n'y
# entre pas. Les deux en-têtes passent donc AU-DESSUS du filet, dans la bande
# du titre, qui est vide à droite de x = 3,4.
Y_ENTETE = 3.30

ANIMATIONS = [
    {
        "id": "empiler-ne-change-rien",
        "scene": "EmpilerNeChangeRien",
        "titre": (
            "La couche du milieu disparaît, et les dix scores ne changent pas "
            "d'un chiffre"
        ),
        "alt": (
            "À gauche de l'écran, un sept manuscrit est dessiné case par case "
            "dans un carré quadrillé. À sa droite, trois colonnes de petits "
            "ronds sont reliées par deux nappes de traits très fins ; entre la "
            "colonne du milieu et la dernière, une case carrée vide, bordée de "
            "pointillés, marque un emplacement laissé libre. Les cases encrées "
            "du sept s'envolent une à une vers la première colonne, qui se "
            "remplit ; les traits s'illuminent en une vague qui va de la gauche "
            "vers la droite, la colonne du milieu s'assombrit, puis la "
            "dernière, et un cadre se referme sur le huitième de ses dix ronds. "
            "Dix nombres s'inscrivent alors dans la bande libre de droite, un "
            "par ligne, chacun en face du rond auquel il répond : un virgule "
            "zéro quatre trois deux tout en haut, treize virgule zéro six sept "
            "deux en face du rond encadré, et huit autres entre eux, dont trois "
            "négatifs. Les mots « deux couches » les coiffent. La colonne du "
            "milieu disparaît alors en rétrécissant, la case vide avec elle, et "
            "les deux nappes de traits n'en font plus qu'une, qui va tout droit "
            "de la première colonne à la dernière. Les dix nombres, eux, ne "
            "bougent pas. Le sept repasse dans ce réseau raccourci : ses cases "
            "s'envolent de nouveau, la première colonne se remplit, la vague "
            "traverse, la dernière s'allume. Dix nombres s'écrivent à côté des "
            "premiers, coiffés des mots « une seule ». Chiffre pour chiffre, "
            "les deux colonnes sont identiques."
        ),
        "duree": None,
        "notions": [
            "couche sans activation",
            "composée d'applications affines",
            "paramétrage redondant",
            "invariance des scores",
        ],
        "source": (
            "aucune : la source ne pose jamais la question d'une couche sans "
            "activation."
        ),
        "page": 8,
        "apres_bloc": "b-r8-5",
        "ce_qui_change": (
            "La couche du milieu disparaît, les scores non : les dix mêmes "
            "nombres restent affichés, chiffre pour chiffre, pendant que le "
            "réseau passe de deux couches à une seule."
        ),
        "texte_ecran": [
            "1,0432",
            "−13,7648",
            "1,5864",
            "8,1577",
            "−2,7568",
            "1,7577",
            "−13,1348",
            "13,0672",
            "1,5962",
            "4,5236",
            "deux couches",
            "une seule",
        ],
        "nombres": [
            {"valeur": "1,0432", "quoi": "score du chiffre 0, image de test n° 0 ; affiché deux fois, colonne « deux couches » puis colonne « une seule »", "ligne": 439},
            {"valeur": "−13,7648", "quoi": "score du chiffre 1, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "1,5864", "quoi": "score du chiffre 2, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "8,1577", "quoi": "score du chiffre 3, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "−2,7568", "quoi": "score du chiffre 4, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "1,7577", "quoi": "score du chiffre 5, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "−13,1348", "quoi": "score du chiffre 6, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "13,0672", "quoi": "score du chiffre 7, image de test n° 0 — le plus grand, c'est lui qu'encadre le cadre de sortie ; affiché deux fois", "ligne": 439},
            {"valeur": "1,5962", "quoi": "score du chiffre 8, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "4,5236", "quoi": "score du chiffre 9, image de test n° 0 ; affiché deux fois", "ligne": 439},
            {"valeur": "les dix mêmes nombres", "quoi": "la colonne « une seule » : la ligne 440 porte exactement les dix nombres de la ligne 439", "ligne": 440},
            {"valeur": "3.553e-15", "quoi": "écart maximal entre les deux séries — NON AFFICHÉ : zéro à la précision de la machine, et l'écrire ferait croire à une différence", "ligne": 441},
            {"valeur": "10 x 784", "quoi": "taille du produit des deux matrices de poids — non affiché, il justifie que le réseau réduit soit dessiné avec un seul faisceau", "ligne": 442},
        ],
        "legende": (
            "Le réseau à deux couches sans activation et le réseau à une seule "
            "couche rendent les mêmes dix scores : l'écart maximal entre eux "
            "vaut $3{,}553\\cdot 10^{-15}$, zéro à la précision de la machine. "
            "La couche cachée n'achète rien qu'une matrice $10\\times 784$ ne "
            "fasse déjà."
        ),
    },
]


class EmpilerNeChangeRien(ReseauScene):
    titre = "Empiler sans activation"
    modele = "sans_activation"
    tailles = (784, 128, 10)
    activation = "identite"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        # La case est là DÈS LA PREMIÈRE TRAME, avec le réseau. La faire
        # apparaître serait une apparition, pas un changement (règle 18) : ce
        # qui change dans cette scène est la disparition de la colonne du
        # milieu, et rien d'autre ne doit lui voler la vedette.
        self.case_vide = self._case_dactivation_vide()
        self.add(self.case_vide)
        self.wait(0.6)

        cache = self.propagation(0)
        self.wait(0.4)

        deux_couches = self._colonne_de_scores(
            X_DROITE_DEUX_COUCHES, "deux couches"
        )
        self._ecrire(deux_couches)
        self.wait(1.0)

        # ── Les deux faisceaux n'en font plus qu'un ─────────────────────────
        direct = self._faisceau_direct()
        self.next_section("La colonne du milieu s'efface")
        self.play(
            FadeOut(self.faisceaux[0]),
            FadeOut(self.faisceaux[1]),
            FadeOut(self.cachee, scale=0.2),
            FadeOut(self.case_vide),
            FadeIn(direct),
            run_time=2.0,
        )
        self.wait(1.0)

        # ── La même image, dans le réseau réduit ────────────────────────────
        #
        # LE RÉSEAU RÉDUIT EST CALCULÉ, PAS REJOUÉ. Rejouer le cache des deux
        # couches ferait de la seconde propagation une mise en scène : c'est le
        # produit des deux matrices qui doit produire l'allumage, sinon la
        # scène ne montre pas ce qu'elle affirme. Les nombres écrits à l'écran,
        # eux, restent ceux de mesures-chap2.txt.
        image = self.Xte[0]
        reduit = {
            "W1": self.theta["W2"] @ self.theta["W1"],
            "b1": self.theta["W2"] @ self.theta["b1"] + self.theta["b2"],
        }
        cache_reduit = avant(reduit, image, "identite")
        assert int(np.argmax(cache["Z2"])) == int(np.argmax(cache_reduit["Z1"]))

        self.next_section("La même propagation, sur un seul bloc de traits")
        # `eteindre()` rallumerait la colonne du milieu, qui n'est plus là, et
        # les faisceaux d'origine, qui n'y sont plus non plus. Le cadre de
        # sortie, lui, reste : il désigne la même classe avant et après, et le
        # faire retomber une seconde fois dirait qu'il aurait pu tomber
        # ailleurs.
        self.play(
            self.entree.ronds.animate.set_fill(ENCRE, opacity=0.0),
            self.sortie.ronds.animate.set_fill(ENCRE, opacity=0.0),
            direct.animate.set_stroke(GRIS_40, opacity=OPACITE_VOILE, width=0.7),
            run_time=0.6,
        )
        self.pixels_vers_couche(image, duree=1.6)
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image)),
            run_time=0.7,
        )
        self.play(
            self._vague_directe(direct, duree=1.6),
            Transform(self.sortie.ronds, self.sortie.allumer(cache_reduit["A1"])),
            run_time=1.6,
        )
        self.wait(0.3)

        une_seule = self._colonne_de_scores(X_DROITE_UNE_SEULE, "une seule")
        self._ecrire(une_seule)
        self.wait(2.8)

    # ── Les pièces de la scène ──────────────────────────────────────────────

    def _case_dactivation_vide(self) -> VGroup:
        """
        La place où une activation viendrait, laissée vide et cerclée de
        pointillé, au milieu du second faisceau.

        SON FOND EST PAPIER ET PLEIN, délibérément : la case PERCE le faisceau
        au lieu de flotter dessus, et se lit alors comme un emplacement resté
        libre plutôt que comme une vignette posée par-dessus. Elle ne porte
        aucun texte — le seul mot qu'on pourrait y écrire serait le nom de ce
        qui n'y est pas.
        """
        x_gauche = self.cachee.ronds.get_center()[0]
        x_droite = self.sortie.ronds.get_center()[0]
        y = self.cachee.ronds.get_center()[1]
        cote = 0.66

        fond = Square(side_length=cote, stroke_width=0.0)
        fond.set_fill(PAPIER, opacity=1.0)
        contour = DashedVMobject(
            Square(side_length=cote, stroke_width=TRAIT_FILET, color=GRIS_58),
            num_dashes=24,
        )
        case = VGroup(fond, contour)
        case.move_to([(x_gauche + x_droite) / 2.0, y, 0])
        return case

    def _colonne_de_scores(self, x_droite: float, entete: str) -> VGroup:
        """
        Les dix scores mesurés, un par ligne, chacun à la hauteur du rond de
        sortie auquel il répond, et le libellé qui coiffe la colonne.

        Le calage par la droite n'est pas un goût : deux nombres à un chiffre
        avant la virgule et deux à deux chiffres, calés à gauche, décaleraient
        les virgules d'une colonne à l'autre, et l'œil ne pourrait plus lire
        les deux séries comme identiques.
        """
        nombres = VGroup()
        for k, valeur in enumerate(SCORES):
            texte = self.cote(valeur, taille=20)
            y = self.sortie.rond_du_rang(k).get_center()[1]
            texte.move_to([x_droite, y, 0], aligned_edge=RIGHT)
            nombres.add(texte)

        libelle = self.etiquette(entete, taille=24, couleur=GRIS_58)
        libelle.move_to([nombres.get_center()[0], Y_ENTETE, 0])
        return VGroup(libelle, nombres)

    def _ecrire(self, colonne: VGroup) -> None:
        """Le libellé, puis les dix nombres, chacun apparaissant à sa place."""
        libelle, nombres = colonne
        self.play(FadeIn(libelle), run_time=0.5)
        self.play(
            LaggedStart(
                *[FadeIn(nombre) for nombre in nombres],
                lag_ratio=0.25,
            ),
            run_time=1.8,
        )

    def _faisceau_direct(self) -> VGroup:
        """
        Le faisceau d'un seul bloc, de l'entrée à la sortie.

        Il est construit avec les mêmes retraits et le même voile que ceux de
        `reseau_mob`, sans quoi la fusion se lirait comme un changement de
        style plutôt que comme un changement de réseau.
        """
        direct = VGroup()
        for depart in self.entree.ronds:
            for arrivee in self.sortie.ronds:
                trait = Line(
                    depart.get_center(),
                    arrivee.get_center(),
                    buff=max(depart.width, arrivee.width) / 2,
                    stroke_width=0.7,
                    color=GRIS_40,
                )
                trait.set_stroke(opacity=OPACITE_VOILE)
                direct.add(trait)
        return direct

    def _vague_directe(self, direct: VGroup, duree: float = 1.6):
        """La cascade de `propagation`, sur un faisceau qui n'est pas le sien."""
        copie = direct.copy()
        copie.set_stroke(BRIQUE, opacity=0.55, width=1.1)
        return ShowPassingFlash(
            copie, run_time=duree, time_width=0.6, lag_ratio=0.004
        )
