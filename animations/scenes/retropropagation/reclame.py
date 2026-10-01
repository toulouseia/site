"""
Chapitre 4 · page 3 · Un seul exemple, et ce que sa sortie réclame.

Deux scènes, toutes deux sur le réseau de `scenes/reseau_mob.py`.

La première fait traverser ce réseau à l'image de travail et pose les dix
activations qu'il produit. La seconde montre le signal d'erreur pour ce qu'il
est : un vecteur de dix composantes, une barre chacune, à l'échelle mesurée — et
elle établit la proposition 2 en empilant les neuf barres positives jusqu'à la
longueur exacte de la dixième.

Tous les nombres viennent de `cours/lecon4/mesures.py`, mesure 1. Aucun n'est
écrit ici : ils sont lus dans `mesures_du_chapitre()`, qui appelle ses fonctions.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    RIGHT,
    UP,
    FadeIn,
    Line,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import BRIQUE, ENCRE_75, TRAIT_COTE, appliquer_style
from scenes.retropropagation.retro_mob import (
    CORPS,
    Barres,
    RetroScene,
    mesures_du_chapitre,
    nombre,
)

appliquer_style()


ANIMATIONS = [
    {
        "id": "limage-cinq-traverse-le-reseau",
        "scene": "LImageCinqTraverseLeReseau",
        "titre": "L'image de travail traverse le réseau non entraîné",
        "notions": [
            "propagation avant",
            "activation",
            "ReLU",
            "réseau non entraîné",
        ],
        "alt": (
            "Sur la gauche, une grille de vingt-huit cases sur vingt-huit "
            "porte en gris l'image d'un deux manuscrit. Les cases encrées se "
            "détachent une à une et rejoignent, en glissant vers la droite, "
            "les rangs qui leur correspondent dans la première colonne du "
            "réseau ; les cases blanches ne bougent pas. La colonne s'assombrit "
            "alors, chaque rond à la valeur de son pixel. Une lueur de brique "
            "traverse le premier faisceau de la gauche vers la droite, et la "
            "colonne cachée s'allume à son tour, très inégalement : quelques "
            "ronds sont presque noirs, la plupart restent vides. Une seconde "
            "lueur traverse le second faisceau, et les dix ronds de la colonne "
            "de sortie se remplissent. À droite de chacun s'inscrit alors son "
            "activation mesurée, de zéro virgule zéro quatre six deux à zéro "
            "virgule deux quatre quatre cinq. Le rond de la classe deux, le "
            "plus sombre des dix, passe au trait de brique avec son étiquette, "
            "et sa valeur reste seule en brique sous les neuf autres."
        ),
    },
    {
        "id": "ce-que-la-sortie-reclame",
        "scene": "CeQueLaSortieReclame",
        "titre": "Le signal d'erreur, en dix barres signées",
        "notions": [
            "signal d'erreur",
            "delta",
            "proposition 2",
            "vecteur par ses composantes",
        ],
        "alt": (
            "Le réseau pâlit et passe au second plan. Une ligne horizontale se "
            "trace au travers de l'écran, et dix barres verticales poussent "
            "depuis cette ligne, une par neurone de sortie. Neuf montent, très "
            "courtes, d'inégales longueurs ; la troisième descend, et elle "
            "descend jusqu'au bas du cadre, incomparablement plus longue que "
            "les neuf autres. Sa valeur s'inscrit à son extrémité : moins zéro "
            "virgule sept cinq cinq cinq. Les neuf barres courtes passent "
            "ensuite au brique et se déplacent l'une après l'autre au-dessus de "
            "la troisième, où elles s'empilent bout à bout en une seule colonne "
            "qui monte à mesure. Quand la neuvième se pose, un trait de brique "
            "marque le sommet de la pile, un second marque le bas de la barre "
            "descendante, et les deux sont à la même distance de la ligne. La "
            "valeur de la pile s'inscrit : plus zéro virgule sept cinq cinq "
            "cinq."
        ),
    },
]


# ── Scène 1 · l'image de travail traverse le réseau ────────────────────────


class LImageCinqTraverseLeReseau(RetroScene):
    """
    L'image n° 5 traverse le réseau, et les dix sorties prennent leur valeur.

    LE RÉSEAU EST LE SUJET ICI, et il reste donc à pleine opacité du début à la
    fin — c'est la seule des huit scènes, avec l'onde de la page 12, dont
    l'objet est le réseau entier. Rien ne s'efface, rien ne se pose par-dessus.

    LE GAGNANT SE DÉSIGNE SANS BOÎTE. `ReseauScene.propagation` entoure le rond
    retenu d'un `SurroundingRectangle` ; la règle du chapitre n'admet aucune
    boîte, et `traversee()` laisse donc à la scène le soin de désigner — ici en
    passant le rond, son étiquette et sa cote à la brique.

    CE QUE LA SCÈNE NE DIT PAS, ET QUE LA PAGE DIT : que ce réseau n'est pas
    entraîné, et que la classe 2 sort en tête par accident. Une animation ne
    porte pas de phrase ; celle-là est dans la légende du bloc.
    """

    titre = "Un seul exemple"

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()

        cache = self.traversee(duree=7.0)
        self.wait(0.4)

        # mesure 1, le tableau « k / a_k / delta_k » : `mesures.py:160-162`.
        a2 = cache["a2"]
        cotes = VGroup()
        for k, rond in enumerate(self.sortie.ronds):
            cote = self.cote(nombre(float(a2[k])), taille=CORPS)
            cote.set_color(ENCRE_75)
            cote.next_to(self.etiquettes_sortie[k], RIGHT, buff=0.26)
            cotes.add(cote)
        self.add(cotes)
        self.play(Write(cotes, run_time=1.8, lag_ratio=0.25))
        self.wait(0.5)

        # La plus grande des dix est celle de la vraie classe. On la désigne,
        # elle et son rond : c'est le seul objet qui change de couleur.
        gagnant = int(a2.argmax())
        self.play(
            *self.designer_sortie(gagnant),
            cotes[gagnant].animate.set_color(BRIQUE),
            run_time=0.9,
        )
        self.wait(1.6)

        # Le contrôle qui justifie la scène : le rond désigné est bien celui de
        # la classe de l'image. Il n'apparaît pas à l'écran — il échoue au
        # rendu si la mesure change, ce qui vaut mieux qu'une vidéo fausse.
        assert gagnant == m["classe"], (
            f"le réseau non entraîné retient la classe {gagnant}, et l'image "
            f"de travail est de classe {m['classe']} : la scène désigne un "
            f"rond que la page ne commente pas."
        )


# ── Scène 2 · le signal d'erreur, en dix barres ────────────────────────────


class CeQueLaSortieReclame(RetroScene):
    """
    δ² par ses dix composantes, et la proposition 2 montrée à l'échelle.

    PAS DE FLÈCHE, PAS DE PLATEAU. Une flèche dans un plan donnerait une
    direction à un vecteur de dix nombres qui n'en a pas ; une balance dirait
    « autant que » sans jamais montrer combien. Neuf barres qu'on empile jusqu'à
    la longueur de la dixième le disent, et c'est vérifiable à l'œil sur la
    trame finale.

    L'ÉCHELLE EST CELLE DES VALEURS. La plus longue barre vaut |δ₂| et occupe
    2,95 unités ; les neuf autres en occupent ce qu'elles valent, entre 0,18 et
    0,53. Leur petitesse n'est pas un défaut de composition, c'est la mesure.
    """

    titre = "Le signal d'erreur"
    montrer_grille = False

    #: L'ordonnée de la ligne de zéro, et la longueur de la plus grande barre.
    #: La barre négative descend de 2,95 sous la ligne, la pile des neuf
    #: positives monte d'autant : l'objet couvre 5,90 unités, soit 93 % de la
    #: hauteur du cadre laissé sous le bandeau. La ligne est posée à −0,30 pour
    #: que les deux bouts tiennent la demi-unité de marge : −3,25 en bas, +2,65
    #: en haut, sous le filet du bandeau.
    Y_ZERO = -0.30
    HAUTEUR = 2.95

    def construct(self) -> None:
        self.bandeau(self.titre)
        m = mesures_du_chapitre()

        # mesure 1, colonne « delta_k » : `mesures.py:162`.
        delta = m["delta2"]

        # Le réseau porte d'abord ses activations — c'est d'elles que δ sort —
        # puis passe au décor et rend ses cotes : le sujet traverse le cadre.
        self.sortie.ronds.become(self.sortie.allumer(m["a2"]))
        self.wait(0.3)

        # LE RÉSEAU REND SES COTES AVANT QUE LA LIGNE ARRIVE, et non pendant.
        # La ligne de zéro passe à −0,30, le « ⋮ » de la colonne cachée est à
        # −0,20 : tant qu'il n'a pas fini de disparaître, il est encore au-dessus
        # du seuil de visibilité et la ligne lui passe dessous. Relevé par le
        # crible sur les trois premières secondes.
        self.play(*self.degager(), run_time=1.2)
        self.wait(0.2)

        barres = Barres(delta, largeur=10.0, hauteur=self.HAUTEUR)
        barres.shift(UP * self.Y_ZERO)
        depart = barres.a_zero()

        self.add(depart)
        self.play(
            FadeIn(barres.ligne),
            Transform(depart, barres.barres),
            run_time=1.4,
        )
        self.remove(depart)
        self.add(barres.barres)
        self.wait(0.4)

        # La seule composante négative porte sa valeur. Les neuf autres ne sont
        # pas cotées : neuf nombres alignés seraient un tableau, et un tableau
        # se lit sur la page, pas dans une vidéo.
        #
        # LA COTE SE POSE À CÔTÉ DU BOUT, JAMAIS DESSOUS. Sous le bout de la
        # barre, elle descend à −3,55 et mord la marge — relevé par le crible.
        negatif = int(delta.argmin())
        cote_bas = self.cote(nombre(float(delta[negatif])))
        cote_bas.next_to(barres.barres[negatif], RIGHT, buff=0.30)
        cote_bas.set_y(barres.barres[negatif].get_bottom()[1] + 0.10)
        self.play(Write(cote_bas), run_time=0.7)
        self.wait(0.8)

        # Les neuf positives passent au brique, puis s'empilent bout à bout
        # au-dessus de la ligne, à l'abscisse de la négative.
        positifs = [k for k in range(len(delta)) if k != negatif]
        self.play(
            Transform(barres.barres, barres.teindre(positifs)),
            run_time=0.6,
        )
        self.wait(0.3)

        x_pile = barres.barres[negatif].get_center()[0]
        empilees = VGroup()
        hauteur_cumulee = 0.0
        for k in positifs:
            morceau = barres.barres[k].copy()
            morceau.move_to(
                [x_pile, self.Y_ZERO + hauteur_cumulee, 0],
                aligned_edge=DOWN,
            )
            hauteur_cumulee += morceau.height
            empilees.add(morceau)

        self.play(
            Transform(
                VGroup(*[barres.barres[k] for k in positifs]),
                empilees,
            ),
            run_time=2.4,
            lag_ratio=0.12,
        )
        self.wait(0.5)

        # Les deux repères : le sommet de la pile et le bout de la barre
        # descendante. Ce sont des traits, pas un cadre — on mesure, on
        # n'encadre pas.
        sommet = self.Y_ZERO + hauteur_cumulee
        pied = barres.barres[negatif].get_bottom()[1]
        # Les repères s'arrêtent à une demi-unité de part et d'autre : la cote
        # du bas est posée à 0,30 du bord de la barre, et un repère plus long
        # passerait dessous — le crible le relève sous « tracé sous texte ».
        reperes = VGroup(
            Line([x_pile - 0.5, sommet, 0], [x_pile + 0.5, sommet, 0],
                 stroke_width=TRAIT_COTE, color=BRIQUE),
            Line([x_pile - 0.5, pied, 0], [x_pile + 0.5, pied, 0],
                 stroke_width=TRAIT_COTE, color=BRIQUE),
        )
        cote_haut = self.cote("+" + nombre(abs(float(delta[negatif]))))
        cote_haut.next_to(reperes[0], RIGHT, buff=0.16)

        self.play(FadeIn(reperes), Write(cote_haut), run_time=0.9)
        self.wait(2.0)

        # Le contrôle de la proposition 2, sur les nombres et non sur le
        # dessin : la somme des neuf positives vaut le module de la négative.
        ecart = abs(abs(float(delta[negatif]))
                    - sum(abs(float(delta[k])) for k in positifs))
        assert ecart < 1e-9, (
            f"la proposition 2 ne tient pas sur ces nombres : écart {ecart:.3e}. "
            "La scène empile neuf barres jusqu'à la dixième ; si l'égalité est "
            "fausse, le dessin ment."
        )
