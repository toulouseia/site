"""
Chapitre 4 · page 8 · Dix demandes sur une même activation.

Une scène, en deux temps. Les dix neurones de sortie envoient chacun leur
demande sur la même activation cachée — c'est la transposée, une colonne de W²
lue au lieu d'une ligne. Puis les dix demandes se posent bout à bout : elles ne
s'arbitrent pas, elles s'additionnent, et le total revient presque à son point
de départ.

Les nombres viennent de `cours/lecon4/mesures.py`, mesure 3.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    FadeIn,
    FadeOut,
    Line,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import BRIQUE, TRAIT_COTE, appliquer_style
from scenes.retropropagation.retro_mob import (
    Barres,
    RetroScene,
    mesures_du_chapitre,
    signe,
)

appliquer_style()


ANIMATIONS = [
    {
        "id": "dix-demandes-sur-un-meme-neurone",
        "scene": "DixDemandesSurUnMemeNeurone",
        "titre": "Dix demandes se posent bout à bout",
        "notions": [
            "transposée",
            "somme des demandes",
            "règle de la chaîne",
            "proposition 6",
        ],
        "alt": (
            "Le réseau pâlit et rend ses cotes. Un rond isolé, plus grand que "
            "ceux du réseau et rempli d'encre presque noire, se pose à gauche "
            "du centre : c'est un neurone de la couche cachée, et son rang "
            "s'inscrit à côté de lui. Dix traits partent alors des dix ronds de "
            "la colonne de sortie et convergent tous vers lui. Ils sont "
            "d'abord de la même finesse, puis chacun prend l'épaisseur de la "
            "demande qu'il porte : deux sont nettement plus larges que les "
            "autres, aucun n'est nul. Les traits s'effacent, et dix barres "
            "signées poussent depuis une ligne horizontale, une par neurone de "
            "sortie : quatre montent, six descendent. Les dix barres se "
            "soulèvent alors l'une après l'autre, sans quitter leur place : "
            "chacune va se poser au bout de la précédente, et l'ensemble "
            "dessine un escalier. Il monte deux fois, jusqu'à une hauteur bien "
            "supérieure à la plus grande des dix barres, puis redescend marche "
            "après marche et s'arrête juste au-dessus de la ligne de départ. Un "
            "trait de brique marque le bout de la dernière marche, et sa valeur "
            "s'inscrit dessous : plus zéro virgule zéro zéro six quatre zéro "
            "deux."
        ),
    },
]


class DixDemandesSurUnMemeNeurone(RetroScene):
    """
    Les dix produits δ_k W²_kj sur le neurone caché 92, et leur somme.

    POURQUOI PAS UNE URNE. L'ancienne scène de cette page dépouillait une urne,
    faisait gagner la demande la plus forte, puis barrait le bulletin. Elle
    mettait en scène un arbitrage pour le nier — et un spectateur qui n'écoute
    pas la voix retient l'arbitrage. Dix segments posés bout à bout ne
    ressemblent à aucun vote : ils ne peuvent que s'additionner.

    LE RÉSULTAT EST PRESQUE NUL, ET AUCUNE DEMANDE NE L'EST. La plus grande
    vaut 0,022372 et la somme 0,006402, soit moins du tiers de la plus grande.
    C'est le fait que la page 8 établit, et il ne se voit que si les dix barres
    et leur somme sont à la MÊME échelle — c'est pourquoi la pile se construit
    avec les barres elles-mêmes, et non avec une barre neuve.
    """

    titre = "La transposée"
    montrer_grille = False

    #: L'extrait : le neurone caché dont on parle, posé où il se voit. Il n'est
    #: pas dans la colonne — voir `extraire_neurone` pour la raison, qui est
    #: une propriété mesurée du module gelé.
    #:
    #: IL EST POSÉ HAUT À CAUSE DE L'ESCALIER. La plus haute marche monte à
    #: +1,643, et le rang coté à gauche du rond descendait à 1,65 : sept
    #: millièmes d'unité de jeu, c'est-à-dire rien. À 2,10 il en reste trois
    #: dixièmes, et le rond tient encore la marge en haut.
    POSITION_NEURONE = [-1.60, 2.10, 0.0]

    #: La ligne de zéro des dix barres, et la longueur de la plus grande.
    #:
    #: L'ÉCHELLE EST CALÉE SUR LA PILE, PAS SUR LA PLUS GRANDE BARRE. La somme
    #: partielle culmine à 0,030687 après la deuxième demande, soit 1,37 fois
    #: la plus grande barre ; et la plus basse descend à 0,553 fois sous la
    #: ligne. L'objet couvre donc 1,924 fois la hauteur unitaire, et il en faut
    #: 3,77 pour occuper les 60 % du cadre que la règle demande : d'où 2,00.
    Y_ZERO = -1.10
    HAUTEUR = 2.00

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()

        # mesure 3, « La troisième voie : les dix demandes sur l'activation
        # a^[1]_j » : `mesures.py:323-333`. Le rang est celui que la mesure
        # retient — le plus activé — et les dix produits sont recalculés
        # exactement comme elle les imprime.
        j = m["quatre"][0]
        W2 = m["theta"]["W2"]
        delta = m["delta2"]
        produits = np.array([float(delta[k] * W2[k, j]) for k in range(10)])
        total = float(m["grads"]["grad_a1"][j])

        # Le réseau porte ses activations, puis passe au décor et rend ses
        # cotes : les dix traits traversent le cadre et passeraient sur le
        # « ⋮ » de la colonne cachée.
        self.cachee.ronds.become(self.cachee.allumer(m["cache"]["a1"]))
        self.sortie.ronds.become(self.sortie.allumer(m["a2"]))
        self.wait(0.3)

        neurone = self.extraire_neurone(j, self.POSITION_NEURONE, rayon=0.30)
        # Le rang se pose à GAUCHE : les dix traits arrivent tous par la
        # droite, et une cote posée dessous ou dessus tomberait dans leur
        # faisceau à un centième d'unité près.
        rang = self.cote(str(j))
        rang.next_to(neurone, LEFT, buff=0.16)

        self.play(
            *self.degager(),
            FadeIn(neurone),
            Write(rang),
            run_time=1.3,
        )
        self.wait(0.4)

        # Dix traits, d'abord identiques : à cet instant, rien ne dit que les
        # dix sorties ne demandent pas la même chose.
        traits = self.traits_vers_le_rond(self.sortie.ronds, neurone)
        self.play(FadeIn(traits), run_time=0.9)
        self.wait(0.4)

        self.play(
            Transform(
                traits,
                self.epaissir(traits, produits, epaisseur_max=8.0,
                              epaisseur_min=0.5),
            ),
            run_time=1.5,
        )
        self.wait(1.0)

        # Les dix demandes, signées. Les traits ne portent que leur force ; le
        # sens ne se voit que sur une barre.
        # LES TRAITS PARTENT AVANT QUE LES BARRES ARRIVENT. Les faire se croiser
        # dans un même `play` laisse, à mi-fondu, dix traits à opacité 0,5 en
        # travers de dix barres pleines : le crible relève la trame, et il a
        # raison — à cet instant, deux objets se disputent le sujet.
        self.play(FadeOut(traits), run_time=0.6)

        barres = Barres(produits, largeur=9.6, hauteur=self.HAUTEUR)
        barres.shift(UP * self.Y_ZERO)
        plates = barres.a_zero()

        self.add(barres.ligne, plates)
        self.play(Transform(plates, barres.barres), run_time=1.4)
        self.remove(plates)
        self.add(barres.barres)
        self.wait(0.8)

        # Bout à bout, EN ESCALIER : chaque barre garde son abscisse et ne
        # bouge qu'en hauteur, pour repartir du bout de la précédente. Le bout
        # de la dernière EST la somme, et rien n'a été ajouté au dessin.
        #
        # POURQUOI PAS TOUTES À LA MÊME ABSCISSE. C'était la première version,
        # et le rendu l'a réfutée : la somme partielle monte à 0,030687 puis
        # redescend à 0,006402, si bien que les dix segments se recouvrent. À
        # une seule abscisse ils fusionnent en UNE colonne noire pleine, haute
        # de 1,37 fois la plus grande barre, et c'est son SOMMET que l'œil lit
        # comme le résultat — l'inverse de ce que la scène démontre. Le crible
        # ne pouvait pas le voir : une forme sur une forme est permise.
        #
        # En escalier, le chemin se lit : ça monte deux fois, ça redescend
        # quatre fois, et ça s'arrête juste au-dessus de la ligne de départ.
        empilees = VGroup()
        courant = 0.0
        for rang_barre, valeur in enumerate(produits):
            morceau = barres.barres[rang_barre].copy()
            bord = DOWN if valeur >= 0 else UP
            morceau.move_to(
                [float(morceau.get_center()[0]),
                 self.Y_ZERO + courant * barres.unite, 0],
                aligned_edge=bord,
            )
            courant += float(valeur)
            empilees.add(morceau)

        self.play(
            Transform(barres.barres, empilees),
            run_time=3.0,
            lag_ratio=0.18,
        )
        self.wait(0.5)

        # Le bout, coté. C'est la seule valeur que la scène écrit.
        # LE REPÈRE MARQUE LE BOUT DE LA DERNIÈRE BARRE, là où l'escalier
        # s'arrête. La cote se pose DESSOUS : « +0,006402 » composé à 24 en
        # demi-gras mesure 1,92 unité — la plus longue du chapitre — et ni la
        # gauche ni la droite ne lui laissent la place, les deux dernières
        # marches occupant la bande. Sous le repère, il n'y a plus rien
        # jusqu'à la ligne de zéro.
        bout = self.Y_ZERO + total * barres.unite
        x_bout = float(empilees[-1].get_center()[0])
        repere = Line([x_bout - 0.7, bout, 0], [x_bout + 0.7, bout, 0],
                      stroke_width=TRAIT_COTE, color=BRIQUE)
        cote = self.cote(signe(total, decimales=6))
        cote.next_to(repere, DOWN, buff=0.16)

        self.play(FadeIn(repere), Write(cote), run_time=0.9)
        self.wait(2.2)

        # Le contrôle de la proposition 6 : la somme des dix produits est bien
        # la composante j de (W²)ᵀ δ², celle que la scène cote.
        assert abs(produits.sum() - total) < 1e-12, (
            f"la somme des dix demandes vaut {produits.sum():+.9f} et la "
            f"composante de (W²)ᵀδ² vaut {total:+.9f} : la pile de la scène "
            "n'aboutit pas à la valeur qu'elle cote."
        )
        assert np.all(produits != 0.0), (
            "une des dix demandes est nulle : la scène montre dix barres, et "
            "la page 8 dit qu'aucune ne l'est."
        )
