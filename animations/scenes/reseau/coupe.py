"""
Chapitre 2 · page 9 · La ReLU, vue sur le réseau et non sur des axes.

La source présente la ReLU COMME UNE COURBE, sur des axes, loin du réseau
(SOURCE.md, séquence 17:55 → 18:29). Le chapitre a déjà cette courbe en figure
fixe : la retracer serait la dire deux fois. Cette scène montre donc ce que la
courbe ne montre pas — la coupe appliquée à une couche entière, sur le réseau
lui-même. La propagation s'arrête à la couche cachée, les ronds portent leur
préactivation z^[1] plutôt que leur activation, et c'est le seul endroit du
chapitre où l'on voit l'état intermédiaire que `propagation` ne montre jamais.

CE QUE LA COLONNE MONTRE, ET CE QU'ELLE NE MONTRE PAS. La couche cachée en
compte 128 ; l'abrégé n'en dessine que 48, vingt-quatre en haut, vingt-quatre
en bas, et l'accolade porte le nombre vrai. Chaque rond dessiné porte la
préactivation de SON neurone — `Colonne.rangs` dit lequel —, jamais une
moyenne de bloc. Le compte affiché, 35 et 93, porte donc sur les 128, pendant
que 17 ronds seulement s'allument parmi les 48 dessinés : ce n'est pas une
contradiction, c'est l'abrégé, et l'accolade cotée 128 est là pour le dire.

LES INDICES SONT EN BASE 1 À L'ÉCRAN, EN BASE 0 DANS LE CODE. C'est la
convention de `mesures-chap2.txt` (« indices a partir de 1 ») et celle du
cours. Le neurone 66 de l'écran est donc `z1[65]` en numpy, et toute lecture
de `z1` passe par `rang1 - 1`.
"""

from __future__ import annotations

from manim import (  # type: ignore[import-not-found]
    FadeIn,
    FadeOut,
    MathTex,
    ShowPassingFlash,
    Transform,
    VGroup,
    Write,
    config,
)

from scenes.n7ia import BRIQUE, ENCRE, GRIS_58, appliquer_style
from scenes.reseau_mob import X_LIBRE, ReseauScene, avant

ANIMATIONS = [
    {
        "id": "relu-coupe",
        "scene": "ReluCoupe",
        "titre": "La ReLU éteint les neurones dont la préactivation est négative",
        "alt": (
            "Un réseau occupe toute la largeur de l'écran : à gauche une "
            "grille carrée où un sept manuscrit se forme case par case, puis "
            "trois colonnes de ronds reliées par une nappe de fils très "
            "pâles. Les cases encrées de la grille s'envolent une à une vers "
            "la première colonne, qui se remplit d'encre du haut vers le bas. "
            "Une vague parcourt alors la nappe et atteint la colonne du "
            "milieu : là, un rond sur trois environ se remplit d'encre, plus "
            "ou moins fort, et tous les autres restent des cercles vides, "
            "gris. Sur la droite, quatre valeurs s'inscrivent l'une après "
            "l'autre, chacune à la hauteur du rond qu'elle désigne : plus "
            "trois virgule six mille quatre cent cinquante-quatre pour le "
            "cinquième rond, plus quatre virgule quatre mille sept cent "
            "trente-huit pour le soixante-sixième, puis, en gris, moins six "
            "virgule sept mille huit cent quatre-vingt-quatorze pour le "
            "quatre-vingt-unième, et plus trois virgule quatre mille cinq "
            "cent quatre-vingt-trois pour le cent-quatorzième. Le compte "
            "s'inscrit en bas à droite : trente-cinq allumés, "
            "quatre-vingt-treize éteints. Tous les ronds restés gris "
            "s'effacent alors, la valeur grise disparaît avec eux, et les "
            "fils qui partaient d'eux s'en vont : la nappe se vide et il ne "
            "reste qu'un peigne clairsemé, celui des ronds encrés. Une "
            "dernière vague le parcourt jusqu'à la colonne de droite, où un "
            "seul rond s'allume."
        ),
        "duree": None,
        "notions": [
            "ReLU",
            "préactivation",
            "activation",
            "parcimonie de la couche cachée",
            "geste : l'extinction sur le réseau",
        ],
        "source": "SOURCE.md · séquence 17:55 → 18:29",
        "page": 9,
        "apres_bloc": "b-r9-8",
        "ce_qui_change": (
            "l'état de chaque neurone de la couche cachée : il porte d'abord "
            "sa préactivation, encrée si elle est positive et grise si elle "
            "ne l'est pas, puis les gris disparaissent avec leurs arêtes "
            "sortantes. Ce qui varie est le nombre de chemins qui restent "
            "ouverts jusqu'à la sortie — 35 sur 128 — et c'est cette chute "
            "qui montre ce que la ReLU fait à une couche entière."
        ),
        "texte_ecran": [
            "35 allumés · 93 éteints",
            "z₆₆ = +4,4738",
            "z₅ = +3,6454",
            "z₁₁₄ = +3,4583",
            "z₈₁ = −6,7894",
        ],
        "nombres": [
            {"valeur": "35", "quoi": "composantes de a^[1] non nulles sur 128, "
                                     "image de test n°0", "ligne": 228},
            {"valeur": "93", "quoi": "composantes de a^[1] nulles, "
                                     "image de test n°0", "ligne": 229},
            {"valeur": "+4.4738", "quoi": "z^[1]_66, la plus haute "
                                          "préactivation", "ligne": 231},
            {"valeur": "+3.6454", "quoi": "z^[1]_5, deuxième préactivation",
             "ligne": 232},
            {"valeur": "+3.4583", "quoi": "z^[1]_114, troisième "
                                          "préactivation", "ligne": 233},
            {"valeur": "-6.7894", "quoi": "z^[1]_81, la plus basse "
                                          "préactivation", "ligne": 234},
        ],
        "legende": (
            "Sur cette image, 35 des 128 neurones de la couche cachée ont une "
            "préactivation positive ; les 93 autres sortent à zéro et "
            "n'envoient plus rien. La ReLU ne courbe pas un signal, elle "
            "coupe une couche en deux."
        ),
    },
]

# L'IMAGE, ET C'EST LA MÊME PARTOUT. Tous les nombres de la section 7 de
# `mesures-chap2.txt` sont pris sur l'image de test n°0, le 7 de la page 3.
IMAGE = 0

# Les quatre préactivations extrêmes, EN BASE 1 comme `mesures-chap2.txt`.
# L'ordre est celui de l'écran, de haut en bas, et non celui du fichier de
# mesures : les quatre valeurs se posent à la hauteur du rang qu'elles
# désignent, et les faire apparaître dans le désordre ferait sauter l'œil.
# Le quatrième champ dit si le neurone survit à la coupe.
EXTREMES = (
    (5, r"z_{5} = +3{,}6454", True),
    (66, r"z_{66} = +4{,}4738", True),
    (81, r"z_{81} = -6{,}7894", False),
    (114, r"z_{114} = +3{,}4583", True),
)

# LE PLANCHER D'OPACITÉ, ET POURQUOI IL N'EST PAS ZÉRO. `Colonne.allumer`
# remplit un rond proportionnellement à sa valeur : le neurone 1, à +0,196
# contre un maximum de +4,474, recevrait 4 % d'opacité et serait indiscernable
# d'un rond éteint. La scène affiche « 35 allumés » ; un rond allumé qui a
# l'air éteint contredirait le nombre qu'elle écrit. La rampe part donc de 0,30
# pour toute préactivation strictement positive. La proposition de la page est
# binaire — au-dessus de zéro on passe, en dessous on ne passe pas — et c'est
# cette frontière que l'opacité doit rendre lisible, pas l'échelle des z.
PLANCHER = 0.30


class ReluCoupe(ReseauScene):
    titre = "La ReLU coupe la couche"

    modele = "relu"
    tailles = (784, 128, 10)
    activation = "relu"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        # LA PROPAGATION EST JOUÉE À LA MAIN PLUTÔT QU'APPELÉE. `propagation`
        # allume la couche cachée avec a^[1], déjà passée par la ReLU, et file
        # jusqu'au cadre de sortie sans qu'on puisse l'arrêter. Or c'est
        # exactement l'état d'AVANT la ReLU que cette scène doit montrer, et
        # elle doit s'arrêter là. On reprend donc ses gestes un à un — ce sont
        # les mêmes appels, dans le même ordre — et `avant` fournit le cache
        # sans rien dessiner.
        image = self.poser_image(IMAGE)
        cache = avant(self.theta, image, self.activation)
        z1 = cache["Z1"]

        self.next_section("L'image entre")
        self.play(FadeIn(self.grille), run_time=0.6)
        self.pixels_vers_couche(image, duree=2.6)
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image)),
            run_time=0.7,
        )
        self.wait(0.3)

        self.next_section("La couche cachée porte ses préactivations")
        self.play(
            self._vague(0, duree=2.4),
            Transform(self.cachee.ronds, self._preactivations(z1)),
            run_time=2.4,
        )
        self.wait(0.9)

        self.next_section("Les quatre préactivations extrêmes")
        etiquettes = self._poser_extremes()

        self.next_section("Le compte")
        # La bande libre commence à X_LIBRE ; le compte se centre dans ce qui
        # reste jusqu'au bord, et se pose sous les quatre valeurs plutôt qu'au
        # dessus : la plus haute d'entre elles monte à la hauteur du cinquième
        # rang, et le filet du bandeau passe juste au-dessus.
        # SUR DEUX LIGNES, et les mots dans leur ordre. Le compte fait 3,37
        # unités de large à la taille 24 ; la bande libre, de 3,4 au bord moins
        # sa marge, n'en offre que 3,21. Le couper après le point médian garde
        # la phrase entière et la fait entrer.
        compte = self.etiquette("35 allumés ·\n93 éteints", taille=24,
                                couleur=BRIQUE)
        # LE COMPTEUR TIENT LA MARGE. À −3,5 il touchait le bord du cadre, et
        # calé sur le milieu de la bande il mordait de trois dixièmes à droite.
        # Il se pose sur la ligne des cotes, dans la bande libre, aligné à
        # gauche : sa longueur ne le pousse plus contre le bord.
        compte.move_to([X_LIBRE + compte.width / 2.0, -3.20, 0])
        self.play(Write(compte), run_time=0.9)
        self.wait(1.2)

        self.next_section("Les neurones à préactivation négative s'éteignent")
        eteints, sortants, survivants = self._trier(z1)
        # La valeur du neurone 81 s'en va avec lui : elle mesure une
        # préactivation qui vient d'être mise à zéro, et la laisser à l'écran
        # ferait croire qu'elle sort encore de la couche.
        self.play(FadeOut(eteints), FadeOut(etiquettes[81]), run_time=1.4)
        self.wait(0.4)
        self.play(FadeOut(sortants), run_time=1.4)
        self.wait(1.0)

        self.next_section("Les survivants portent jusqu'à la sortie")
        # `_vague` copierait TOUT le faisceau, y compris les arêtes qu'on
        # vient d'effacer, et les rallumerait en brique le temps du passage.
        # La vague se construit donc sur les seules arêtes survivantes.
        onde = survivants.copy()
        onde.set_stroke(BRIQUE, opacity=0.55, width=1.1)
        self.play(
            ShowPassingFlash(onde, time_width=0.6, lag_ratio=0.002),
            Transform(self.sortie.ronds, self.sortie.allumer(cache["A2"])),
            run_time=2.2,
        )
        self.wait(2.4)

    # ── Les pièces de la scène ──────────────────────────────────────────────

    def _milieu_bande(self) -> float:
        """Le milieu de la bande libre, mesuré et non écrit à la main."""
        return (X_LIBRE + config.frame_width / 2.0) / 2.0

    def _preactivations(self, z1) -> VGroup:
        """
        L'état visé de la couche cachée : chaque rond montré rempli à la
        préactivation de SON neurone si elle est positive, laissé vide sinon.

        On ne passe pas par `Colonne.allumer` pour deux raisons. Elle
        normalise par le maximum en valeur absolue, soit ici |−6,7894|, ce qui
        écraserait toutes les préactivations positives à deux tiers de leur
        force ; et elle n'a pas de plancher — voir PLANCHER plus haut.
        """
        cible = self.cachee.ronds.copy()
        haut = float(z1.max())
        for rond, rang in zip(cible, self.cachee.rangs):
            valeur = float(z1[rang])
            if valeur > 0.0:
                rond.set_fill(
                    ENCRE, opacity=PLANCHER + (1.0 - PLANCHER) * valeur / haut
                )
            else:
                rond.set_fill(ENCRE, opacity=0.0)
        return cible

    def _poser_extremes(self) -> dict:
        """
        Les quatre valeurs, chacune à la hauteur du rang qu'elle désigne.

        AUCUNE N'EST RELIÉE À SON ROND PAR UN TRAIT, et c'est délibéré : un
        renvoi partant de la colonne du milieu traverserait la colonne de
        sortie et ses dix étiquettes. La hauteur seule porte la
        correspondance, et `y_du_rang` la donne même pour un rang que le « ⋮ »
        remplace — les neurones 66 et 81 sont dans ce cas.

        Le gris du neurone 81 n'est pas une nuance de mise en page : c'est
        l'état qu'il aura dans quelques secondes, annoncé à l'avance.
        """
        gauche = X_LIBRE + 0.65
        etiquettes: dict[int, MathTex] = {}
        for rang1, formule, allume in EXTREMES:
            valeur = MathTex(
                formule, font_size=34, color=ENCRE if allume else GRIS_58
            )
            valeur.move_to(
                [
                    gauche + valeur.width / 2.0,
                    self.cachee.y_du_rang(rang1 - 1),  # base 1 → base 0
                    0,
                ]
            )
            etiquettes[rang1] = valeur
            self.play(Write(valeur), run_time=0.55)
            self.wait(0.15)
        self.wait(0.75)
        return etiquettes

    def _trier(self, z1) -> tuple[VGroup, VGroup, VGroup]:
        """
        Les ronds éteints, leurs arêtes sortantes, et les arêtes survivantes.

        Le faisceau n° 1 va de la couche cachée à la sortie ; il est rangé
        départ par départ, dix arêtes par rond de départ, dans l'ordre où
        `construire_reseau` les a créées.
        """
        largeur = len(self.sortie.ronds)
        faisceau = self.faisceaux[1]
        eteints, sortants, survivants = VGroup(), VGroup(), VGroup()
        for position, rang in enumerate(self.cachee.rangs):
            arretes = [faisceau[position * largeur + k] for k in range(largeur)]
            if float(z1[rang]) > 0.0:
                survivants.add(*arretes)
            else:
                eteints.add(self.cachee.ronds[position])
                sortants.add(*arretes)
        return eteints, sortants, survivants
