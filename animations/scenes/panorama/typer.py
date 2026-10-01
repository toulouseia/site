"""
Panorama du machine learning : ce qui change d'une tâche à l'autre.

Rattachée à la section « Régression ou classification » du cours
`introduction-au-machine-learning`.

ANIMATIONS est lu par `animations/manifeste.py` SANS importer ce fichier :
le manifeste se construit avec l'arbre syntaxique, donc sans Manim installé.

CE QUI A ÉTÉ RETIRÉ le 17 septembre 2026. « du-score-a-la-probabilite »
n'était plus servi par aucune page depuis le resserrement du 8 septembre.

CE QUE LA PASSE DU 17 SEPTEMBRE A CHANGÉ ICI. La scène portait cinq phrases
dans son cadre — « il glisse : toutes les valeurs existent », « il saute : deux
arrêts, et rien entre eux », « vendu en moins de 30 jours ? », « 0 · plus de 30
jours » — qui disaient en français ce que le curseur montre. Elles sont
parties. Il reste l'axe, ses graduations, l'ensemble des sorties écrit en
symboles, et le curseur qui les parcourt. La différence entre les trois tâches
EST la manière dont le curseur se déplace ; l'écrire à côté revenait à
légender un geste pendant qu'on le fait.
"""

from manim import (  # type: ignore[import-not-found]
    LEFT,
    RIGHT,
    UP,
    Create,
    Dot,
    FadeIn,
    FadeOut,
    Line,
    MathTex,
    Transform,
    VGroup,
    ValueTracker,
    always_redraw,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    TRAIT_AXE,
    TRAIT_COTE,
    SceneN7,
)

ANIMATIONS = [
    {
        "id": "la-nature-de-la-sortie",
        "scene": "LaNatureDeLaSortie",
        "titre": "Ce qui change, c'est l'ensemble des sorties",
        "duree": 32,
        "alt": (
            "Un axe vertical porte l'ensemble des sorties, et cet axe est "
            "relu trois fois. En régression, l'ensemble est écrit grand Y "
            "égale R, l'axe est gradué de cent à deux cent cinquante "
            "milliers d'euros, un curseur de brique le remonte et le "
            "redescend sans jamais s'arrêter, et le prix affiché à côté de "
            "lui défile de façon continue. En classification binaire, "
            "l'ensemble s'écrit grand Y égale l'ensemble zéro, un ; l'axe ne "
            "porte plus que ces deux graduations, et le curseur ne peut se "
            "poser qu'à ces deux endroits : il saute de l'un à l'autre d'un "
            "seul coup, sans rien traverser. En classification "
            "multi-classe, l'ensemble s'écrit grand Y égale l'ensemble A, B, "
            "et ainsi de suite jusqu'à G ; l'axe porte les sept étiquettes "
            "énergétiques, de G en bas à A en haut, et le curseur saute de "
            "barreau en barreau, sept arrêts, sans rien entre deux voisines."
        ),
        "notions": [
            "régression",
            "classification binaire",
            "classification multi-classe",
            "ensemble des sorties",
        ],
        "ce qui change dans le temps": (
            "Le MODE de parcours du curseur sur l'axe des sorties, relu trois "
            "fois : continu pour la régression, un saut d'un bout à l'autre "
            "pour la classification binaire, sept arrêts sans rien entre eux "
            "pour le multi-classe. Ce qui varie est la manière dont l'axe se "
            "parcourt, et c'est exactement ce qui sépare les trois tâches."
        ),
    },
]


class _TexteMemoise:
    """
    Mémoïse les libellés composés à chaque image.

    Pango met 0,17 s à composer une ligne de texte, et un `always_redraw` lui
    en demande une par image : une seule seconde de balayage coûtait alors cinq
    secondes de rendu. Copier un mobjet déjà composé coûte 0,01 s. On garde
    donc un modèle par chaîne distincte, et on n'en recompose jamais deux fois
    la même.
    """

    def memo_cote(self, texte: str, taille: int = 21):
        return self._memo(("cote", texte, taille), lambda: self.cote(texte, taille))

    def memo_etiquette(self, texte: str, taille: int, couleur: str):
        return self._memo(
            ("etq", texte, taille, couleur),
            lambda: self.etiquette(texte, taille, couleur),
        )

    def _memo(self, cle, fabrique):
        cache = self.__dict__.setdefault("_modeles_texte", {})
        modele = cache.get(cle)
        if modele is None:
            modele = fabrique()
            cache[cle] = modele
        return modele.copy()


# ── La scène : la nature de la sortie ───────────────────────────────────────

# Les sept étiquettes énergétiques, de bas en haut : G est la pire, A la
# meilleure, et c'est l'ordre dans lequel un diagnostic les imprime.
ENERGIE = ["G", "F", "E", "D", "C", "B", "A"]
POS_ENERGIE = [0.05 + k * 0.15 for k in range(7)]


class LaNatureDeLaSortie(_TexteMemoise, SceneN7):
    titre = "Régression ou classification"

    # L'AXE DES SORTIES, SEUL. Il partageait le cadre avec un nuage de
    # logements qui ne bougeait jamais et que la page dit déjà ; l'axe en
    # occupait le tiers, et sur une planche-contact il ne se lisait plus.
    # Sans le nuage il monte du bas du cadre jusque sous le bandeau, et occupe
    # 5,30 unités sur les 6,3 laissées, soit 84 %. Le curseur sort à GAUCHE de
    # l'axe et les graduations à DROITE : ils ne se rencontrent jamais.
    X0 = 1.60
    BAS = -2.70
    HAUT = 2.60

    def _y(self, u: float) -> float:
        return self.BAS + u * (self.HAUT - self.BAS)

    def _point(self, u: float):
        return RIGHT * self.X0 + UP * self._y(u)

    def _graduation(self, u: float, texte: str, taille: int = 28) -> VGroup:
        p = self._point(u)
        return VGroup(
            Line(p, p + RIGHT * 0.20, color=ENCRE, stroke_width=TRAIT_AXE),
            self.etiquette(texte, taille, ENCRE).next_to(
                p + RIGHT * 0.20, RIGHT, buff=0.18
            ),
        )

    def _entete(self, formule: str) -> MathTex:
        """L'ensemble des sorties, écrit en symboles. Rien d'autre.

        La scène portait ici un sous-titre en français — « le prix de vente »,
        « vendu en moins de 30 jours ? » — qui redisait la page. L'écriture
        mathématique EST le nom de l'objet dont la section parle.
        """
        groupe = MathTex(formule, color=ENCRE, font_size=44)
        # L'en-tête prend la colonne que le nuage occupait. Elle est LOIN de
        # l'axe : le curseur sort à sa gauche et sa valeur se lit encore plus à
        # gauche, et rien ne doit venir à sa rencontre.
        groupe.move_to(LEFT * 6.10 + UP * 1.95, aligned_edge=LEFT)
        return groupe

    def construct(self) -> None:
        self.poser_titre(taille=24)
        self.next_section("L'axe des sorties")

        axe = Line(
            RIGHT * self.X0 + UP * self.BAS,
            RIGHT * self.X0 + UP * self.HAUT,
            color=ENCRE,
            stroke_width=TRAIT_AXE,
        )
        entete = self._entete(r"\mathcal{Y} = \mathbb{R}")
        self.play(Create(axe), run_time=0.8)
        self.play(FadeIn(entete), run_time=0.8)

        graduations = VGroup(
            *[
                self._graduation(k / 3, f"{100 + 50 * k} k€")
                for k in range(4)
            ]
        )
        self.play(FadeIn(graduations, lag_ratio=0.2), run_time=0.9)

        # ── Le curseur. Un seul objet redessiné à chaque image : la barre, le
        # point, et la valeur lue. Ce qui change d'une lecture à l'autre n'est
        # pas le curseur, c'est la fonction qui décide OÙ il a le droit d'être.
        t = ValueTracker(0.5)
        # Le curseur s'efface pendant qu'on relit l'axe. Sans ce voile il reste
        # planté sur « 1 » devant un axe déjà effacé et pas encore réétiqueté :
        # pendant une demi-seconde il désigne une graduation qui n'existe pas.
        voile = ValueTracker(1.0)
        etat = {
            "lire": lambda x: (x, f"{round(100 + 150 * x)} k€"),
        }

        def marqueur() -> VGroup:
            u, texte = etat["lire"](t.get_value())
            p = self._point(u)
            groupe = VGroup(
                Line(p + LEFT * 0.36, p, color=BRIQUE, stroke_width=TRAIT_COTE),
                Dot(p, color=BRIQUE, radius=0.095),
            )
            groupe.add(
                self.memo_cote(texte, 30).next_to(p + LEFT * 0.36, LEFT, buff=0.16)
            )
            groupe.set_opacity(voile.get_value())
            return groupe

        curseur = always_redraw(marqueur)
        self.add(curseur)
        self.wait(0.5)

        self.play(t.animate.set_value(0.97), run_time=1.7)
        self.play(t.animate.set_value(0.03), run_time=3.0)
        self.play(t.animate.set_value(0.60), run_time=1.8)
        self.wait(0.5)

        # ── Deuxième lecture : deux étiquettes.
        self.next_section("Deuxième lecture : deux étiquettes")
        entete2 = self._entete(r"\mathcal{Y} = \{0,\ 1\}")
        grad2 = VGroup(
            self._graduation(0.22, "0", 34),
            self._graduation(0.78, "1", 34),
        )

        self.play(
            FadeOut(graduations),
            Transform(entete, entete2),
            voile.animate.set_value(0.0),
            run_time=0.9,
        )
        # Le curseur ne change de règle qu'une fois l'ancienne lecture partie,
        # et il est invisible pendant l'échange : il ne désigne jamais le vide.
        etat["lire"] = lambda x: (0.22, "0") if x < 0.5 else (0.78, "1")
        self.play(
            FadeIn(grad2, lag_ratio=0.2),
            voile.animate.set_value(1.0),
            run_time=0.8,
        )
        self.wait(0.4)

        self.play(t.animate.set_value(0.03), run_time=2.0)
        self.play(t.animate.set_value(0.97), run_time=3.4)
        self.play(t.animate.set_value(0.35), run_time=2.0)
        self.wait(0.5)

        # ── Troisième lecture : sept étiquettes.
        self.next_section("Troisième lecture : sept étiquettes")
        entete3 = self._entete(r"\mathcal{Y} = \{A,\ B,\ \dots,\ G\}")
        grad3 = VGroup(
            *[
                self._graduation(POS_ENERGIE[k], ENERGIE[k], 30)
                for k in range(7)
            ]
        )

        def lire3(x: float):
            k = min(range(7), key=lambda i: abs(POS_ENERGIE[i] - x))
            return POS_ENERGIE[k], ENERGIE[k]

        self.play(
            FadeOut(grad2),
            Transform(entete, entete3),
            voile.animate.set_value(0.0),
            run_time=0.9,
        )
        etat["lire"] = lire3
        self.play(
            FadeIn(grad3, lag_ratio=0.12),
            voile.animate.set_value(1.0),
            run_time=0.9,
        )
        self.wait(0.4)

        self.play(t.animate.set_value(0.02), run_time=1.7)
        self.play(t.animate.set_value(0.98), run_time=4.2)
        self.play(t.animate.set_value(0.45), run_time=2.2)
        self.wait(2.2)
