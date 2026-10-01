"""
Chapitre 2 · page 5 · Un neurone lit un bord.

Une scène, trois gestes, et un score recalculé après chacun. La source construit
le détecteur — la bande, l'image dessous, le pourtour négatif — et s'arrête là ;
nous mesurons ce que chaque geste fait au score, et le classement des quatre
entrées s'inverse au troisième.

LES POIDS DE CETTE PAGE NE SORTENT PAS DU npz, et c'est la seule scène du
chapitre dans ce cas. Le détecteur n'est pas appris : il est POSÉ, coefficient
par coefficient, exactement comme `cours/lecon2/mesures.py` section 3 le pose.
La grille est donc reconstruite ici, et les compteurs de la mesure — 39, 132,
613 — la vérifient par assertion : si la géométrie dérivait d'une case, les huit
scores affichés ne seraient plus ceux du fichier de mesures, et l'assertion
tomberait avant le premier trait.

UN SEUL ROND S'ALLUME dans la colonne du milieu, et jamais les autres. Le
neurone de cette page est une hypothèse de travail, pas l'un des 128 neurones du
modèle entraîné : la page 11 mesure précisément que ceux-là ne sont pas des
détecteurs de bord. Allumer la couche entière ferait dire à la scène le
contraire de ce que le chapitre démontre.
"""

from __future__ import annotations

import numpy as np
from manim import (  # type: ignore[import-not-found]
    LEFT,
    AnimationGroup,
    Create,
    FadeOut,
    Line,
    ShowPassingFlash,
    Square,
    SurroundingRectangle,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    GRIS_24,
    TRAIT_COTE,
    appliquer_style,
)
from scenes.reseau_mob import ReseauScene

# Le bleu des poids négatifs de `reseau_mob._couleur_poids`. Un poids négatif
# est le seul objet du chapitre qui ne soit ni de l'encre, ni une cote : il lui
# faut sa couleur, et c'est celle que la page 4 emploie déjà.
ARDOISE = "#2E5E8C"

# ── Le détecteur, tel que mesures.py section 3 le pose ───────────────────────

ZONE_LIGNES = (8, 10)
ZONE_COLONNES = (9, 21)
MARGE = 3

CASES_ZONE = 39
CASES_POURTOUR = 132
CASES_NULLES = 613

assert CASES_ZONE + CASES_POURTOUR + CASES_NULLES == 784

IMAGES = (0, 2, 3)
LIBELLES = ("un 7 :", "un 1 :", "un 0 :", "la tache :")
TEMPS_1 = ("23,4000", "5,0039", "25,8549", "39,0000")
TEMPS_3 = ("10,6627", "−5,6431", "−9,8078", "−93,0000")

# ── La place de chaque chose, en unités Manim ───────────────────────────────
#
# LA GRILLE DES POIDS EST LE SUJET : elle prend le centre, à 4,6 unités de
# côté — 58 % de la hauteur du cadre, la règle en demande 40. C'est exactement
# l'espace libre entre le « ⋮ » de la colonne d'entrée et les ronds de sortie,
# et le réseau, passé au décor, se lit à travers elle sans la salir.
#
# L'entrée se dépose PAR-DESSUS les poids, comme la source glisse son 7 sous la
# grille : c'est la superposition qu'on regarde, pas la grille seule.

CENTRE_POIDS = (-0.4, 0.0)
COTE_POIDS = 4.6
OPACITE_ENCRE = 0.50

X_LIBELLE = 3.50
X_VALEUR = 4.82
Y_LIGNES = (1.65, 0.85, 0.05, -0.75)

# L'en-tête fait 4,60 unités de large à la taille 24 : la bande libre de droite
# n'en compte que 3,3. Elle passe donc AU-DESSUS du sujet, dans la bande haute
# laissée libre entre le sommet des colonnes, à 2,5, et le filet du bandeau de
# titre, à 3,36. La bande basse ne convient plus : les cotes des deux colonnes
# y vivent, et la colonne de sortie y descend jusqu'à −3,45.
X_ENTETE = -0.4
Y_ENTETE = 2.90

RANG_CACHE = 5

ANIMATIONS = [
    {
        "id": "un-neurone-lit-un-bord",
        "scene": "UnNeuroneLitUnBord",
        "titre": "Un détecteur posé à la main, et son score après chaque geste",
        "alt": (
            "À gauche, une grille de vingt-huit sur vingt-huit cases, "
            "entièrement blanche. À droite, trois colonnes de ronds reliées par "
            "un voile de traits gris ; un rond de la colonne du milieu est "
            "cerclé de rouge brique, et les traits qui l'atteignent ressortent "
            "de la même couleur. Trente-neuf cases de la grille passent au "
            "rouge, trois rangées de treize, formant une bande horizontale au "
            "tiers supérieur ; tout le reste demeure blanc. Un sept manuscrit "
            "vient se poser en gris sur la grille : sa barre du haut traverse la "
            "bande de part en part, une lueur court le long des traits rouges "
            "depuis la colonne de gauche et s'arrête au bord de la grille ; "
            "le rond cerclé se remplit, et le score vingt-trois "
            "virgule quatre s'inscrit à droite. Un un le remplace : son trait "
            "n'effleure la bande que d'une case, le rond reste presque vide, et "
            "cinq virgule zéro s'inscrit dessous. Puis un zéro, dont l'arc "
            "traverse largement la bande : vingt-cinq virgule huit, davantage "
            "que le sept. Une tache rectangulaire pleine se construit alors case "
            "par case, recouvre la bande et déborde tout autour ; le rond se "
            "remplit au maximum et son score, trente-neuf, dépasse les trois "
            "autres, qu'un cadre rouge vient souligner. Enfin cent trente-deux "
            "cases entourant la bande, une marge de trois cases tout autour, "
            "passent au bleu ardoise. Les quatre entrées repassent une à une : "
            "seul le sept garde un score positif, dix virgule six, et le rond "
            "ne s'allume plus que pour lui ; le un tombe à moins cinq virgule "
            "six, le zéro à moins neuf virgule huit, la tache à moins "
            "quatre-vingt-treize. Le cadre rouge se referme cette fois sur le "
            "sept."
        ),
        "duree": None,
        "notions": [
            "détecteur de bord",
            "poids posés à la main",
            "poids négatif",
            "somme pondérée",
            "renversement d'un classement",
        ],
        "source": "SOURCE.md · séquences 08:20 → 09:20 et 09:50 → 10:15",
        "page": 5,
        "apres_bloc": "b-r5-5",
        "ce_qui_change": (
            "les poids d'un neurone, réglés sous les yeux : la bande passe à "
            "+1, puis le pourtour à −1, et les quatre scores se recalculent "
            "après chaque geste — c'est leur classement qui s'inverse au "
            "troisième, la tache passant de la première à la dernière place."
        ),
        "texte_ecran": [
            "temps 1 · z = somme de l'encre",
            "temps 3 · z = zone − pourtour",
            "un 7 : 23,4000",
            "un 1 : 5,0039",
            "un 0 : 25,8549",
            "la tache : 39,0000",
            "un 7 : 10,6627",
            "un 1 : −5,6431",
            "un 0 : −9,8078",
            "la tache : −93,0000",
        ],
        "nombres": [
            {"valeur": "39", "quoi": "pixels à +1 de la zone, lignes 8 à 10, "
             "colonnes 9 à 21", "ligne": 95},
            {"valeur": "132", "quoi": "pixels à −1 du pourtour, marge de 3",
             "ligne": 96},
            {"valeur": "23.4000", "quoi": "z du détecteur au temps 1 sur "
             "l'image de test n°0, un 7", "ligne": 101},
            {"valeur": "5.0039", "quoi": "z du détecteur au temps 1 sur "
             "l'image de test n°2, un 1", "ligne": 102},
            {"valeur": "25.8549", "quoi": "z du détecteur au temps 1 sur "
             "l'image de test n°3, un 0", "ligne": 103},
            {"valeur": "39.0000", "quoi": "z du détecteur au temps 1 sur la "
             "tache large construite", "ligne": 104},
            {"valeur": "10.6627", "quoi": "z du détecteur au temps 3 sur "
             "l'image de test n°0, un 7", "ligne": 111},
            {"valeur": "-5.6431", "quoi": "z du détecteur au temps 3 sur "
             "l'image de test n°2, un 1", "ligne": 112},
            {"valeur": "-9.8078", "quoi": "z du détecteur au temps 3 sur "
             "l'image de test n°3, un 0", "ligne": 113},
            {"valeur": "-93.0000", "quoi": "z du détecteur au temps 3 sur la "
             "tache large construite", "ligne": 114},
        ],
        "legende": (
            "Les poids d'un neurone sont posés à la main, puis corrigés une "
            "fois, et son score est relevé après chaque geste sur les mêmes "
            "quatre entrées. La bande seule compte l'encre et sacre la tache ; "
            "le pourtour négatif renverse le classement."
        ),
    },
]


def _zone() -> np.ndarray:
    """La bande à +1, en grille 28 × 28. Coordonnées à partir de 1."""
    l0, l1 = ZONE_LIGNES
    c0, c1 = ZONE_COLONNES
    zone = np.zeros((28, 28))
    zone[l0 - 1:l1, c0 - 1:c1] = 1.0
    return zone


def _pourtour() -> np.ndarray:
    """La marge de 3 pixels autour de la bande, la bande exclue."""
    l0, l1 = ZONE_LIGNES
    c0, c1 = ZONE_COLONNES
    large = np.zeros((28, 28))
    large[l0 - 1 - MARGE:l1 + MARGE, c0 - 1 - MARGE:c1 + MARGE] = 1.0
    return np.clip(large - _zone(), 0.0, 1.0)


def _tache() -> np.ndarray:
    """
    Le contre-exemple : le rectangle plein qui RECOUVRE la bande.

    Ce n'est pas une image du jeu de test, et la scène ne la fait pas passer
    pour telle — elle se construit case par case sous les yeux, ce qu'aucune
    des trois autres entrées ne fait.
    """
    l0, l1 = ZONE_LIGNES
    c0, c1 = ZONE_COLONNES
    tache = np.zeros((28, 28))
    tache[l0 - 1 - MARGE:l1 + MARGE, c0 - 1 - MARGE:c1 + MARGE] = 1.0
    return tache.reshape(-1)


ZONE = _zone()
POURTOUR = _pourtour()

assert int(ZONE.sum()) == CASES_ZONE
assert int(POURTOUR.sum()) == CASES_POURTOUR
assert 784 - int(ZONE.sum()) - int(POURTOUR.sum()) == CASES_NULLES


class UnNeuroneLitUnBord(ReseauScene):
    titre = "Un neurone lit un bord"
    modele = "relu"
    tailles = (784, 128, 10)
    activation = "relu"
    # La grille de `ReseauScene` ne sert pas : c'est la grille des POIDS qui
    # occupe sa place, et l'entrée se dépose dessus. Deux grilles côte à côte
    # diraient deux fois la même chose et se disputeraient la même bande.
    montrer_grille = False

    # ── Les objets propres à la scène ───────────────────────────────────────

    def _case(self, rang: int) -> Square:
        i, j = divmod(rang, 28)
        cote = COTE_POIDS / 28.0
        case = Square(side_length=cote, stroke_width=0.25, stroke_color=GRIS_24)
        case.move_to(
            [
                CENTRE_POIDS[0] - COTE_POIDS / 2 + (j + 0.5) * cote,
                CENTRE_POIDS[1] + COTE_POIDS / 2 - (i + 0.5) * cote,
                0,
            ]
        )
        return case

    def _grille_poids(self, poids: np.ndarray) -> VGroup:
        """Les 784 poids : brique au-dessus de zéro, ardoise en dessous."""
        cases = VGroup()
        for rang, valeur in enumerate(np.asarray(poids).reshape(-1)):
            case = self._case(rang)
            if valeur > 0:
                case.set_fill(BRIQUE, opacity=0.90)
            elif valeur < 0:
                case.set_fill(ARDOISE, opacity=0.85)
            else:
                case.set_fill(ENCRE, opacity=0.0)
            cases.add(case)
        return cases

    def _encre(self, entree: np.ndarray) -> VGroup:
        """
        L'entrée courante, posée sur les poids. Sans contour : c'est la grille
        des poids qui porte le quadrillage, et deux quadrillages superposés
        moirent.
        """
        cases = VGroup()
        for rang, valeur in enumerate(np.asarray(entree).reshape(-1)):
            case = self._case(rang)
            case.set_stroke(width=0.0)
            case.set_fill(ENCRE, opacity=float(valeur) * OPACITE_ENCRE)
            cases.add(case)
        return cases

    def _traits_du_neurone(self) -> list:
        """
        Les arêtes qui arrivent au neurone mis en évidence.

        `traits_vers` ne sait viser que la dernière couche : elle prend le
        faisceau et les deux colonnes par le même indice, ce qui n'a de sens
        que pour le dernier intervalle. Le faisceau 0 se lit donc à la main.
        """
        largeur = len(self.cachee.ronds)
        position = self.cachee.rangs.index(RANG_CACHE)
        return [
            self.faisceaux[0][depart * largeur + position]
            for depart in range(len(self.entree.ronds))
        ]

    def _impulsion(self, duree: float) -> ShowPassingFlash:
        """
        La lueur de la source, restreinte aux arêtes du seul neurone montré, ET
        ARRÊTÉE AU BORD DU SUJET.

        La grille des poids occupe désormais le centre, c'est-à-dire l'espace
        que ces arêtes traversent. Une lueur à pleine opacité qui la barre de
        part en part la rend illisible pendant qu'on la lit — le crible la
        relève, et il a raison. La lueur part donc de la colonne d'entrée et
        s'arrête au bord gauche de la grille : elle dit d'où vient ce qui
        arrive, et laisse voir sur quoi cela arrive. Le rond qui se remplit,
        lui, dit que c'est bien arrivé.
        """
        bord = CENTRE_POIDS[0] - COTE_POIDS / 2.0 - 0.06
        copie = VGroup()
        for trait in self._traits_du_neurone():
            debut = trait.get_start()
            if debut[0] >= bord:
                continue
            fin = trait.get_end()
            part = (bord - debut[0]) / (fin[0] - debut[0])
            copie.add(Line(debut, debut + part * (fin - debut)))
        copie.set_stroke(BRIQUE, opacity=0.95, width=2.6)
        return ShowPassingFlash(copie, run_time=duree, time_width=0.6)

    def _traverser(self, entree: np.ndarray, score: float,
                   court: bool = False) -> None:
        """
        Une entrée traverse : la colonne d'entrée se remplit, la lueur monte
        jusqu'au neurone, et le neurone se remplit à la hauteur de son score.

        L'ÉCHELLE DU REMPLISSAGE EST LE MAXIMUM ATTEIGNABLE, 39, et non le
        maximum des quatre scores : un rond qui se remplirait toujours à ras
        bord dirait que toutes les entrées se valent. Un score négatif laisse
        le rond vide, ce qui est exactement ce que le temps 3 doit donner à
        voir — le neurone ne répond plus qu'au 7.
        """
        rond = self.cachee.rond_du_rang(RANG_CACHE)
        remplissage = max(0.0, min(1.0, float(score) / float(CASES_ZONE)))
        self.play(
            Transform(self.entree.ronds, self.entree.allumer(entree)),
            run_time=0.30 if court else 0.35,
        )
        self.play(
            self._impulsion(0.60 if court else 0.70),
            rond.animate.set_fill(BRIQUE, opacity=remplissage),
            run_time=0.60 if court else 0.70,
        )

    def _ligne(self, rang: int):
        libelle = self.etiquette(LIBELLES[rang], taille=24)
        libelle.move_to([X_LIBELLE, Y_LIGNES[rang], 0], aligned_edge=LEFT)
        return libelle

    def _valeur(self, rang: int, texte: str):
        valeur = self.cote(texte, taille=24)
        valeur.move_to([X_VALEUR, Y_LIGNES[rang], 0], aligned_edge=LEFT)
        return valeur

    def _cadre(self, rang: int) -> SurroundingRectangle:
        return SurroundingRectangle(
            VGroup(self.libelles[rang], self.valeurs[rang]),
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
            buff=0.14,
            corner_radius=0.0,
        )

    def _empiler(self, grille: VGroup, encre: VGroup) -> None:
        """
        Remet la grille des poids puis l'encre au premier plan, dans cet ordre.

        ANIMER UN SOUS-MOBJECT PLUTÔT QU'UN GROUPE DÉMONTE LE GROUPE. Manim
        ajoute à la scène le groupe interne de l'animation, et `Scene.add`
        commence par retirer de la scène tout ce qui appartient à sa famille :
        le VGroup d'origine est alors éclaté en 784 cases posées à plat, et sa
        place dans la pile est perdue. Au rendu de contrôle, l'encre de la
        tache s'est effacée pendant que le pourtour passait au bleu. Réempiler
        les deux groupes après chaque balayage rétablit l'ordre et ne coûte
        aucune image.
        """
        self.add(grille, encre)

    # ── Le déroulé ──────────────────────────────────────────────────────────

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        poids_1 = ZONE.reshape(-1)
        poids_3 = (ZONE - POURTOUR).reshape(-1)
        entrees = [self.Xte[indice] for indice in IMAGES] + [_tache()]

        # LA GÉOMÉTRIE DESSINÉE EST CELLE QUI PRODUIT LES NOMBRES AFFICHÉS.
        # L'assertion ne recalcule rien pour l'écran : elle refuse de rendre
        # une scène dont la grille ne donnerait plus les scores du fichier de
        # mesures. Une case déplacée casse ici, pas à la relecture.
        for rang, entree in enumerate(entrees):
            for poids, attendus in ((poids_1, TEMPS_1), (poids_3, TEMPS_3)):
                mesure = f"{float(poids @ entree):.4f}".replace(".", ",")
                assert mesure.replace("-", "−") == attendus[rang], (
                    f"{LIBELLES[rang]} donne {mesure} et non {attendus[rang]} : "
                    "la grille dessinée n'est plus celle de mesures.py section 3"
                )

        # Le neurone dont on parle : son cercle passe à la brique, et les 24
        # arêtes qui l'atteignent sortent du voile.
        rond = self.cachee.rond_du_rang(RANG_CACHE)
        traits = self._traits_du_neurone()
        # Le « ⋮ » de la couche cachée part MAINTENANT, avant que la grille
        # n'arrive : il vit au centre de sa colonne, donc sous le sujet, et un
        # texte sous une image ne se lit pas. Le faire disparaître pendant que
        # la grille se crée laisserait une demi-seconde où les deux se croisent,
        # et le crible la relève. La cote « 128 » reste : elle est sous la
        # colonne, hors du sujet, et c'est elle qui porte le nombre vrai.
        self.play(
            rond.animate.set_stroke(BRIQUE, width=2.4, opacity=1.0),
            FadeOut(self.cachee.suspension),
            *[
                trait.animate.set_stroke(BRIQUE, opacity=0.9, width=1.2)
                for trait in traits
            ],
            run_time=0.8,
        )

        # LA GRILLE DE POIDS EST LE SUJET, DONC LE RÉSEAU S'EFFACE. Les arêtes
        # ont désigné le neurone ; passé là, elles ne sont plus que des
        # diagonales en travers de l'objet qu'on vient lire, et la grille du
        # sujet occupe la place où elles passent. Seul le rond du neurone reste
        # à pleine opacité : c'est de LUI que ces poids sont les poids.
        grille = self._grille_poids(np.zeros(784))
        self.play(
            Create(grille, lag_ratio=0.0006),
            # Le « ⋮ » est déjà parti : on le met hors de l'effacement, qui
            # sinon le ramènerait à 0,3 — il fait partie des accessoires que
            # `animations_effacement` passe au décor.
            *self.animations_effacement(sauf=[rond, self.cachee.suspension]),
            run_time=1.2,
        )
        encre = self._encre(np.zeros(784))
        self.add(encre)

        self.next_section("Temps 1 · la bande passe à +1")

        l0, l1 = ZONE_LIGNES
        c0, c1 = ZONE_COLONNES
        for i in range(l0, l1 + 1):
            self.play(
                AnimationGroup(
                    *[
                        grille[(i - 1) * 28 + (j - 1)].animate.set_fill(
                            BRIQUE, opacity=0.90
                        )
                        for j in range(c0, c1 + 1)
                    ],
                    lag_ratio=0.06,
                ),
                run_time=0.5,
            )
            self._empiler(grille, encre)

        entete = self.etiquette("temps 1 · z = somme de l'encre", taille=24)
        entete.move_to([X_ENTETE, Y_ENTETE, 0])
        self.play(Write(entete), run_time=0.8)

        self.next_section("Trois images de test traversent")

        self.libelles = [self._ligne(rang) for rang in range(4)]
        self.valeurs = [None, None, None, None]
        for rang in range(3):
            # `Transform` et non `encre.animate.become(…)` : sur un groupe de
            # 784 carrés, la seconde forme a laissé l'image précédente à
            # l'écran une fois sur trois au rendu de contrôle. `Transform` est
            # ce que `propagation` emploie déjà pour les ronds, et il tient.
            self.play(Transform(encre, self._encre(entrees[rang])), run_time=0.45)
            self._traverser(entrees[rang], float(poids_1 @ entrees[rang]))
            self.valeurs[rang] = self._valeur(rang, TEMPS_1[rang])
            self.play(
                Write(self.libelles[rang]),
                Write(self.valeurs[rang]),
                run_time=0.45,
            )
            self.wait(0.15)

        self.next_section("La tache large se construit case par case")

        self.play(Transform(encre, self._encre(np.zeros(784))), run_time=0.4)
        tache = _tache()
        self.play(
            AnimationGroup(
                *[
                    encre[rang].animate.set_fill(ENCRE, opacity=OPACITE_ENCRE)
                    for rang in np.nonzero(tache)[0]
                ],
                lag_ratio=0.006,
            ),
            run_time=1.8,
        )
        self._empiler(grille, encre)
        self._traverser(tache, float(poids_1 @ tache))
        self.valeurs[3] = self._valeur(3, TEMPS_1[3])
        self.play(Write(self.libelles[3]), Write(self.valeurs[3]), run_time=0.45)

        cadre = self._cadre(3)
        self.play(Create(cadre), run_time=0.7)
        self.wait(1.0)

        self.next_section("Temps 3 · le pourtour passe à −1")

        self.play(
            AnimationGroup(
                *[
                    grille[rang].animate.set_fill(ARDOISE, opacity=0.85)
                    for rang in np.nonzero(POURTOUR.reshape(-1))[0]
                ],
                lag_ratio=0.004,
            ),
            run_time=1.5,
        )
        self._empiler(grille, encre)
        self.play(FadeOut(cadre), run_time=0.4)

        # LES DEUX EN-TÊTES OCCUPENT LA MÊME PLACE, et les huit scores ne
        # tiennent pas ensemble à l'écran : ceux du temps 1 s'effacent là où
        # ils sont avant que ceux du temps 3 s'y inscrivent. Rien ne glisse, et
        # les deux séries ne se croisent jamais.
        self.play(FadeOut(entete), run_time=0.4)
        entete_3 = self.etiquette("temps 3 · z = zone − pourtour", taille=24)
        entete_3.move_to([X_ENTETE, Y_ENTETE, 0])
        self.play(Write(entete_3), run_time=0.8)

        self.play(*[FadeOut(valeur) for valeur in self.valeurs], run_time=0.5)

        self.next_section("Les quatre scores se recalculent, et l'ordre s'inverse")

        for rang, entree in enumerate(entrees):
            self.play(Transform(encre, self._encre(entree)), run_time=0.40)
            self._traverser(entree, float(poids_3 @ entree), court=True)
            self.valeurs[rang] = self._valeur(rang, TEMPS_3[rang])
            self.play(Write(self.valeurs[rang]), run_time=0.45)

        # LA DERNIÈRE IMAGE EST CELLE DU 7, et non celle de la tache qui vient
        # de passer : c'est le 7 que le détecteur retient désormais, et une
        # scène qui s'arrêterait sur le contre-exemple laisserait le pourtour
        # bleu enseveli sous l'encre pleine de la tache.
        self.play(
            Transform(encre, self._encre(entrees[0])),
            Transform(self.entree.ronds, self.entree.allumer(entrees[0])),
            rond.animate.set_fill(
                BRIQUE,
                opacity=max(0.0, min(1.0, float(poids_3 @ entrees[0]) / CASES_ZONE)),
            ),
            run_time=0.8,
        )
        self.play(Create(self._cadre(0)), run_time=0.8)
        self.wait(1.8)
