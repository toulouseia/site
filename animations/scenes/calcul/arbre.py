"""
Chapitre 5 · L'arbre des dépendances, et les trois droites graduées.

Deux scènes. La première fait pousser, depuis ℓ, l'arbre de ce dont la perte
dépend. La seconde pousse le premier poids et regarde la poussée arriver sur
les deux autres droites, puis recommence dix fois plus petit.

Nombres : `cours/lecon5/mesures.py`, mesure 1, par `scenes/calcul/calcul_mob.py`.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    FadeIn,
    FadeOut,
    Line,
    VGroup,
)

from scenes.calcul.calcul_mob import (
    DL_DZ3,
    DZ3_DW3,
    PERTE,
    TAILLE_CORPS,
    W3,
    Z3,
    curseur,
    nombre,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    TRAIT_AXE,
    TRAIT_COTE,
    TRAIT_FILET,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "larbre-des-dependances",
        "scene": "LarbreDesDependances",
        "titre": "Ce dont la perte dépend, branche par branche",
        "bandeau": "L'ARBRE",
        "section": "Page 4 · L'arbre des dépendances du réseau minuscule",
        "geste": "arbre qui pousse branche par branche",
        "notions": [
            "geste : arbre qui pousse branche par branche",
            "dépendance",
            "variable intermédiaire",
            "règle de la chaîne",
        ],
        "legende": (
            "La perte est posée seule. L'arbre de ce dont elle dépend pousse "
            "au-dessus d'elle, une génération à la fois, jusqu'aux sept "
            "valeurs figées et à l'entrée."
        ),
        "mouvement": [
            "1. ℓ est seule, en bas de l'écran.",
            "2. a³ pousse au-dessus d'elle, reliée par un trait.",
            "3. z³ pousse au-dessus de a³.",
            "4. Trois branches sortent de z³ à la fois : w³, a², b³.",
            "5. Le même motif se répète deux fois vers le haut, et la dernière "
            "génération porte w¹, x et b¹.",
        ],
        "ecran": [
            "L'ARBRE",
            "ℓ", "a³", "z³", "w³", "a²", "b³",
            "z²", "w²", "a¹", "b²", "z¹", "w¹", "x", "b¹",
        ],
        "nombres": {"generations": 8, "feuilles": 7},
        "alt": (
            "La lettre ℓ apparaît seule au bas du centre de l'écran. Un trait "
            "vertical monte d'elle vers un nouveau symbole, a exposant trois, "
            "qui vient de naître au-dessus ; puis un second trait monte vers "
            "z exposant trois. De ce dernier partent alors trois traits à la "
            "fois, un vers la gauche, un droit au-dessus, un vers la droite, "
            "et trois symboles apparaissent à leur extrémité : w exposant "
            "trois, a exposant deux, b exposant trois. Le motif recommence "
            "depuis a exposant deux, qui fait monter z exposant deux, lequel "
            "ouvre à son tour trois branches vers w exposant deux, a exposant "
            "un et b exposant deux ; puis une troisième fois, jusqu'à une "
            "dernière génération portant w exposant un, la lettre x et b "
            "exposant un. À "
            "chaque poussée, la branche qui vient de sortir est seule en "
            "couleur brique, et tout ce qui a déjà poussé est retombé à "
            "l'encre pâlie. L'arbre achevé occupe toute la hauteur de l'écran."
        ),
    },
    {
        "id": "trois-droites-graduees",
        "scene": "TroisDroitesGraduees",
        "titre": "Une poussée sur w, et ce qu'elle devient",
        "bandeau": "MESURE 1",
        "section": "Page 4 · La poussée se propage, et les rapports ne bougent pas",
        "geste": "trois droites graduées reliées par des tirets",
        "notions": [
            "geste : trois droites graduées reliées par des tirets",
            "dérivée partielle",
            "règle de la chaîne",
            "passage à la limite",
        ],
        "legende": (
            "Trois droites graduées, une par variable. Le curseur de w est "
            "poussé ; celui de z suit, un peu plus loin, celui de ℓ recule. "
            "La poussée est ensuite divisée par dix et les deux rapports ne "
            "changent pas."
        ),
        "mouvement": [
            "1. Trois droites graduées apparaissent, chacune portant son "
            "curseur à la valeur mesurée.",
            "2. Le curseur de w est poussé vers la droite.",
            "3. Le curseur de z part à son tour, un peu plus loin que le "
            "premier ; celui de ℓ recule, beaucoup moins loin.",
            "4. Les deux rapports s'inscrivent à droite des droites.",
            "5. Les curseurs reviennent, les graduations s'écartent de dix "
            "crans, la même poussée est rejouée et les deux rapports sont "
            "inchangés.",
        ],
        "ecran": [
            "MESURE 1",
            "w³", "z³", "ℓ",
            "2,0", "1,700", "0,167786",
            "∂z³ / ∂w³ = 1,100",
            "∂ℓ / ∂z³ = −0,154465",
        ],
        "nombres": {
            "w3": 2.0, "z3": 1.7, "perte": 0.167786,
            "dz3_dw3": 1.1, "dl_dz3": -0.154465,
        },
        "alt": (
            "Trois droites horizontales graduées de traits réguliers occupent "
            "l'écran, l'une au-dessus de l'autre, désignées à leur gauche par "
            "w exposant trois, z exposant trois et la lettre ℓ. Chacune porte un "
            "point brique posé sur elle, et sous chaque point la valeur "
            "mesurée s'inscrit : deux virgule zéro, un virgule sept cents, "
            "zéro virgule cent soixante-sept mille sept cent quatre-vingt-six. "
            "Le point de la première droite glisse vers la droite d'une "
            "longueur nette, laissant derrière lui un segment brique qui "
            "mesure son déplacement, tandis que la valeur de départ reste "
            "inscrite à sa place. Le point de la deuxième droite part alors à "
            "son tour dans le même sens, un peu plus loin que le premier, et "
            "celui de la troisième recule vers la gauche d'une longueur bien "
            "plus courte. Deux rapports s'inscrivent à droite. Tout revient "
            "ensuite à sa place, les traits de graduation s'écartent largement "
            "les uns des autres, et la même scène se rejoue avec un "
            "déplacement dix fois plus petit : les deux rapports réapparaissent "
            "identiques, chiffre pour chiffre."
        ),
    },
]

# ── L'arbre ─────────────────────────────────────────────────────────────────
#
# Huit générations, de ℓ jusqu'aux feuilles. L'écart vertical est posé à 0,78 :
# huit rangs sur 5,5 unités, ce qui laisse `poser_sujet` agrandir la
# composition jusqu'à remplir la hauteur du cadre sans déborder en largeur.
ETAGE = 0.78
AILE = 2.3

# UNE GÉNÉRATION : le nœud DÉJÀ POSÉ, puis ceux dont il dépend, qui naissent
# au-dessus de lui. L'ordre de cette liste EST l'ordre de la poussée — on part
# de ℓ et jamais de l'entrée, parce que c'est le sens dans lequel la
# dérivation se lit, et le sens inverse de la propagation avant.
GENERATIONS = [
    ("ℓ", [("a³", 0.0)]),
    ("a³", [("z³", 0.0)]),
    ("z³", [("w³", -AILE), ("a²", 0.0), ("b³", AILE)]),
    ("a²", [("z²", 0.0)]),
    ("z²", [("w²", -AILE), ("a¹", 0.0), ("b²", AILE)]),
    ("a¹", [("z¹", 0.0)]),
    ("z¹", [("w¹", -AILE), ("x", 0.0), ("b¹", AILE)]),
]


class LarbreDesDependances(SceneN7):
    titre = "L'arbre"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        # L'ARBRE EST BÂTI EN ENTIER AVANT D'ÊTRE MONTRÉ. `poser_sujet` a
        # besoin de la composition finale pour trouver son échelle ; la faire
        # grandir au fur et à mesure changerait la taille des étiquettes à
        # chaque poussée, et aucune trame ne ressemblerait à la suivante.
        noeuds = {
            "ℓ": self.etiquette("ℓ", taille=TAILLE_CORPS, couleur=ENCRE)
        }
        etage = 0
        for _, nouveaux in GENERATIONS:
            etage += 1
            for nom, decalage in nouveaux:
                libelle = self.etiquette(nom, taille=TAILLE_CORPS, couleur=ENCRE)
                libelle.move_to(RIGHT * decalage + UP * (etage * ETAGE))
                noeuds[nom] = libelle

        branches = []
        for depuis, nouveaux in GENERATIONS:
            traits = [
                Line(
                    noeuds[depuis].get_top(),
                    noeuds[nom].get_bottom(),
                    buff=0.09,
                    stroke_width=TRAIT_FILET,
                    color=ENCRE_30,
                )
                for nom, _ in nouveaux
            ]
            branches.append((depuis, [nom for nom, _ in nouveaux], traits))

        sujet = VGroup(
            *[t for _, _, traits in branches for t in traits],
            *noeuds.values(),
        )
        self.poser_sujet(sujet)

        for nom, libelle in noeuds.items():
            if nom != "ℓ":
                libelle.set_opacity(0.0)
        for _, _, traits in branches:
            for trait in traits:
                trait.set_opacity(0.0)

        self.play(FadeIn(noeuds["ℓ"]), run_time=0.7)
        self.wait(0.5)

        precedents = [noeuds["ℓ"]]
        for depuis, noms, traits in branches:
            self.next_section(f"La génération de {depuis}")

            # Ce qui vient d'être affirmé retombe à l'encre pâlie AVANT que la
            # branche suivante ne sorte : une seule génération est en brique à
            # chaque trame, et c'est elle le sujet.
            self.play(
                *[m.animate.set_color(ENCRE_55) for m in precedents],
                run_time=0.25,
            )
            self.play(
                *[
                    trait.animate.set_opacity(1.0).set_stroke(BRIQUE, opacity=0.9)
                    for trait in traits
                ],
                run_time=0.45,
            )
            nouveaux = [noeuds[nom] for nom in noms]
            self.play(
                *[m.animate.set_opacity(1.0).set_color(BRIQUE) for m in nouveaux],
                run_time=0.55,
            )
            self.play(
                *[trait.animate.set_stroke(ENCRE_30, opacity=1.0)
                  for trait in traits],
                run_time=0.25,
            )
            precedents = nouveaux
            self.wait(0.35)

        self.play(
            *[m.animate.set_color(ENCRE_55) for m in precedents], run_time=0.4
        )
        self.wait(1.5)


# ── Les trois droites ───────────────────────────────────────────────────────

DEMI_AXE = 4.5
ORDONNEES = (1.95, 0.0, -1.95)
# Le curseur part au tiers gauche : la poussée a la place d'aller à droite, et
# le recul de ℓ celle d'aller à gauche sans sortir de l'axe.
DEPART = -1.6
PAS_GRADUATION = 0.5
# La poussée de départ, en unités de la figure AVANT mise à l'échelle. Ce n'est
# pas une mesure : c'est la longueur du geste. Les deux longueurs qui en
# découlent, elles, sont les rapports mesurés — et rien d'autre.
POUSSEE = 1.9


class TroisDroitesGraduees(SceneN7):
    titre = "Mesure 1"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        axes, graduations, curseurs, noms, cotes = (
            VGroup(), [], VGroup(), VGroup(), VGroup()
        )
        lignes = []
        libelles = ("w³", "z³", "ℓ")
        valeurs = (nombre(W3, 1), nombre(Z3, 3), nombre(PERTE, 6))

        for rang, y in enumerate(ORDONNEES):
            axe = Line(
                LEFT * DEMI_AXE + UP * y,
                RIGHT * DEMI_AXE + UP * y,
                stroke_width=TRAIT_AXE,
                color=ENCRE_55,
            )
            traits = VGroup()
            for k in range(-9, 10):
                trait = Line(UP * 0.11, DOWN * 0.11,
                             stroke_width=TRAIT_FILET, color=ENCRE_30)
                trait.move_to(RIGHT * (k * PAS_GRADUATION) + UP * y)
                traits.add(trait)
            graduations.append(traits)
            lignes.append(axe)
            axes.add(axe, traits)

            point = curseur()
            point.move_to(RIGHT * DEPART + UP * y)
            curseurs.add(point)

            nom = self.etiquette(libelles[rang], taille=TAILLE_CORPS,
                                 couleur=ENCRE)
            nom.next_to(axe, LEFT, buff=0.30)
            noms.add(nom)

            # LA VALEUR EST POSÉE SOUS LE CURSEUR ET N'EN BOUGERA PLUS. Elle
            # dit où la variable était quand on a commencé ; la faire suivre le
            # curseur reviendrait à afficher une valeur poussée que rien n'a
            # mesurée.
            cote = self.cote(valeurs[rang], taille=TAILLE_CORPS)
            cote.next_to(point, DOWN, buff=0.20)
            cotes.add(cote)

        sujet = VGroup(axes, curseurs, noms, cotes)
        self.poser_sujet(sujet)

        # L'ÉCHELLE EST RELUE SUR LA FIGURE POSÉE. `poser_sujet` a agrandi la
        # composition d'un facteur qu'on ne connaît pas d'avance ; mesurer la
        # poussée sur la figure évite de la calculer deux fois et de se
        # tromper une fois sur deux.
        echelle = axes[0].width / (2 * DEMI_AXE)
        poussee = POUSSEE * echelle

        self.play(Create(axes), run_time=1.0)
        self.play(FadeIn(noms), FadeIn(curseurs), FadeIn(cotes), run_time=0.8)
        self.wait(0.6)

        depart_curseurs = [p.get_center().copy() for p in curseurs]

        # LES DEUX RAPPORTS SE POSENT DANS LA BANDE LIBRE DE DROITE. Le
        # curseur part au tiers gauche et ne dépasse jamais le centre : tout
        # ce qui est à droite de x = 1,5 reste vide pendant les deux poussées,
        # et c'est là, entre deux droites, que le rapport se lit.
        milieux = [
            (lignes[0].get_center() + lignes[1].get_center()) / 2.0,
            (lignes[1].get_center() + lignes[2].get_center()) / 2.0,
        ]
        abscisse_rapport = lignes[0].get_center()[0] + 0.62 * echelle * DEMI_AXE

        self.jouer_une_poussee(curseurs, poussee, milieux, abscisse_rapport,
                               premiere=True)
        self.play(
            *[p.animate.move_to(d) for p, d in zip(curseurs, depart_curseurs)],
            run_time=0.7,
        )

        self.next_section("Les graduations s'écartent de dix crans")
        # LES CRANS QUI SORTIRAIENT DE L'AXE SONT RETIRÉS AVANT L'ÉCART, pas
        # après : pendant l'agrandissement ils traverseraient le cadre, et le
        # crible sonde aussi les trames intermédiaires.
        demi = axes[0].width / 2.0
        for rang, traits in enumerate(graduations):
            ancre = depart_curseurs[rang][0]
            survivants = VGroup()
            partants = VGroup()
            for trait in traits:
                arrivee = ancre + 10.0 * (trait.get_center()[0] - ancre)
                cible = survivants if abs(arrivee - axes[0].get_center()[0]) <= demi else partants
                cible.add(trait)
            if len(partants):
                self.play(FadeOut(partants), run_time=0.25 if rang == 0 else 0.01)
            graduations[rang] = survivants

        # LES SUBDIVISIONS QUE L'AGRANDISSEMENT DÉCOUVRE. Écarter les crans de
        # dix en laisse deux sur l'axe : ce n'est plus une droite graduée,
        # c'est une droite, et la scène perdait en chemin l'objet dont elle
        # parle. Un agrandissement de dix fait apparaître les subdivisions qui
        # étaient jusque-là trop fines pour être tracées ; on les pose, au pas
        # d'avant, et l'axe reste gradué. Les deux crans survivants, plus
        # hauts, sont ceux d'avant l'agrandissement.
        mineurs = VGroup()
        for axe in lignes:
            centre = axe.get_center()
            for k in range(-9, 10):
                trait = Line(UP * 0.07, DOWN * 0.07,
                             stroke_width=TRAIT_FILET, color=ENCRE_30)
                trait.move_to(
                    RIGHT * (centre[0] + k * PAS_GRADUATION * echelle)
                    + UP * centre[1]
                )
                trait.set_opacity(0.0)
                mineurs.add(trait)
        self.add(mineurs)

        self.play(
            *[
                traits.animate.stretch_about_point(
                    10.0, 0, depart_curseurs[rang]
                )
                for rang, traits in enumerate(graduations)
                if len(traits)
            ],
            mineurs.animate.set_opacity(1.0),
            run_time=1.0,
        )
        self.wait(0.5)

        self.jouer_une_poussee(curseurs, poussee / 10.0, milieux,
                               abscisse_rapport, premiere=False)

        # LA TENUE FINALE EST LONGUE, ET SA LONGUEUR SE CALCULE. `rendre.py`
        # prend l'affiche aux deux tiers de la durée (rendre.py:336-340). Pour
        # que ces deux tiers tombent APRÈS l'instant t où les rapports sont
        # inscrits, il faut une tenue d'au moins 0,52 t : 0,66 (t + tenue) ≥ t.
        # Ici t vaut 14,5 s, d'où 7,5 s au minimum — on en pose 8, la marge
        # valant mieux qu'un second rendu.
        #
        # Sans elle, l'affiche tombait à 13,75 s, deux centièmes avant que les
        # rapports ne commencent à paraître : elle montrait la seconde poussée
        # sans ce qu'elle démontre. Une tenue de cinq secondes ne suffisait pas.
        self.wait(8.0)

    def jouer_une_poussee(self, curseurs, poussee: float, milieux,
                          abscisse_rapport: float, premiere: bool) -> None:
        """
        Une poussée sur w, et ce qu'elle devient sur z puis sur ℓ.

        Les deux rapports viennent de la mesure 1 et ne sont pas retouchés :
        `DZ3_DW3` (mesures.py:179) et `DL_DZ3` (mesures.py:183). Le
        déplacement de ℓ vaut donc `poussée × 1,100 × (−0,154465)`,
        c'est-à-dire exactement dℓ/dw³ × poussée — le produit que la mesure 1
        imprime à la ligne 187.
        """
        self.next_section(
            "La poussée" if premiere else "La même poussée, dix fois plus petite"
        )

        longueurs = (poussee, poussee * DZ3_DW3, poussee * DZ3_DW3 * DL_DZ3)
        allonges = VGroup()
        for rang, longueur in enumerate(longueurs):
            depart = curseurs[rang].get_center().copy()
            allonge = Line(
                depart, depart + RIGHT * longueur,
                stroke_width=TRAIT_COTE, color=BRIQUE,
            )
            allonges.add(allonge)
            self.play(Create(allonge), run_time=0.30)
            self.play(curseurs[rang].animate.shift(RIGHT * longueur),
                      run_time=0.50)
            self.wait(0.25)

        rapports = VGroup(
            self.cote(f"∂z³ / ∂w³ = {nombre(DZ3_DW3, 3)}", taille=TAILLE_CORPS),
            self.cote(f"∂ℓ / ∂z³ = {nombre(DL_DZ3, 6)}", taille=TAILLE_CORPS),
        )
        for rapport, milieu in zip(rapports, milieux):
            rapport.move_to(milieu)
            rapport.set_x(abscisse_rapport)
        self.play(FadeIn(rapports), run_time=0.7)
        self.wait(1.4)

        # AU SECOND TOUR, RIEN NE S'EFFACE. La dernière trame doit montrer la
        # poussée dix fois plus petite ET les deux rapports inchangés : c'est
        # la seule chose que cette scène a à dire.
        if premiere:
            self.play(FadeOut(allonges), FadeOut(rapports), run_time=0.5)
