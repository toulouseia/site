"""
Chapitre 5 · Le réseau minuscule, 1 → 1 → 1 → 1.

Une scène. Le réseau que le texte calcule à la main se remplit poste par poste,
de l'entrée à la perte, et chaque valeur qui s'inscrit est celle que la mesure 1
imprime.

Nombres : `cours/lecon5/mesures.py`, mesure 1, par `scenes/calcul/calcul_mob.py`.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    UP,
    Create,
    FadeIn,
    VGroup,
)

from scenes.calcul.calcul_mob import (
    A1,
    A2,
    A3,
    B1,
    B2,
    B3,
    PERTE,
    TAILLE_CORPS,
    W1,
    W2,
    W3,
    X,
    ReseauMinuscule,
    nombre,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "le-reseau-minuscule",
        "scene": "LeReseauMinuscule",
        "titre": "Le réseau que le texte calcule à la main",
        "bandeau": "MESURE 1",
        "section": "Page 4 · Le réseau minuscule et ses sept valeurs figées",
        "geste": "réseau à un neurone par couche qui se remplit poste par poste",
        "notions": [
            "geste : réseau à un neurone par couche qui se remplit poste par poste",
            "réseau 1-1-1-1",
            "propagation avant",
            "entropie croisée binaire",
        ],
        "legende": (
            "Quatre ronds en ligne, trois arêtes. Les poids et les biais sont "
            "posés, puis chaque rond se remplit à son activation, de gauche à "
            "droite, jusqu'à la perte."
        ),
        "mouvement": [
            "1. Quatre ronds et trois arêtes apparaissent, vides.",
            "2. Les trois poids s'inscrivent au-dessus des arêtes, les trois "
            "biais au-dessous.",
            "3. L'entrée remplit le premier rond.",
            "4. Chaque rond suivant se remplit à son tour, sa préactivation "
            "puis son activation s'inscrivant sous lui.",
            "5. La perte s'inscrit sous le dernier rond.",
        ],
        "ecran": [
            "MESURE 1",
            "w¹ = 0,8", "w² = 1,5", "w³ = 2,0",
            "b¹ = 0,2", "b² = −0,4", "b³ = −0,5",
            "x = 1", "a¹ = 1,000", "a² = 1,100", "a³ = 0,845535",
            "ℓ = 0,167786",
        ],
        # LES NOMBRES SONT ÉCRITS EN CLAIR, et c'est imposé : `manifeste.py`
        # lit cette liste par `ast.literal_eval` sans exécuter le module
        # (manifeste.py:231), une constante importée y serait un nom illisible.
        # Ils doublent donc ceux de `calcul_mob.py`, qui portent la citation.
        "nombres": {
            "w1": 0.8, "w2": 1.5, "w3": 2.0,
            "b1": 0.2, "b2": -0.4, "b3": -0.5,
            "x": 1.0, "a1": 1.0, "a2": 1.1, "a3": 0.845535,
            "perte": 0.167786,
        },
        "alt": (
            "Quatre ronds à contour gris sont alignés horizontalement au "
            "milieu de l'écran, reliés de proche en proche par trois traits "
            "droits. Au-dessus de chaque trait s'inscrit un poids, zéro "
            "virgule huit, un virgule cinq, puis deux, et au-dessous de chaque "
            "trait un biais, zéro virgule deux, moins zéro virgule quatre, "
            "moins zéro virgule cinq. Le rond de gauche se remplit d'encre et "
            "la valeur un s'écrit sous lui. Le deuxième rond se remplit à son "
            "tour et porte un virgule zéro zéro zéro, le troisième un virgule "
            "cent, le quatrième, plus pâle que les deux précédents, zéro "
            "virgule huit cent quarante-cinq mille cinq cent trente-cinq. À "
            "chaque étape, le poste qui vient de se remplir est le seul en "
            "encre pleine, les autres ayant pâli. Enfin, sous le dernier rond, "
            "la perte s'inscrit en brique : zéro virgule cent soixante-sept "
            "mille sept cent quatre-vingt-six."
        ),
    },
]


class LeReseauMinuscule(SceneN7):
    titre = "Mesure 1"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        reseau = ReseauMinuscule(rayon=0.40, ecart=2.2)

        # LE SUJET EST LA COMPOSITION ENTIÈRE, PAS LES SEULS RONDS. Quatre
        # ronds de 0,8 unité posés en ligne font une bande haute de 0,8 sur
        # 7,5 de long : mise à l'échelle du cadre, elle occuperait un sixième
        # de sa hauteur, et `poser_sujet` la refuserait — à juste titre, on ne
        # la lirait pas sur une vignette. Ce sont les deux lignes d'étiquettes
        # et la perte qui donnent au sujet sa hauteur, et elles en font partie.
        poids = VGroup()
        biais = VGroup()
        for rang, (w, b) in enumerate(((W1, B1), (W2, B2), (W3, B3))):
            arete = reseau.aretes[rang]
            libelle_w = self.etiquette(
                f"w{'¹²³'[rang]} = {nombre(w, 1)}",
                taille=TAILLE_CORPS, couleur=ENCRE_30,
            )
            # LA MARGE DÉGAGE LE ROND, ELLE N'EST PAS DÉCORATIVE. L'arête est
            # un segment posé à mi-hauteur des ronds : une étiquette à 0,22
            # au-dessus d'elle tombe encore dans la bande du rond, et le
            # premier rendu montrait « b² = −0,4 » collé au deuxième rond.
            # 0,58 la sort du disque, dont le rayon vaut 0,40.
            libelle_w.next_to(arete, UP, buff=0.58)
            libelle_b = self.etiquette(
                f"b{'¹²³'[rang]} = {nombre(b, 1)}",
                taille=TAILLE_CORPS, couleur=ENCRE_30,
            )
            libelle_b.next_to(arete, DOWN, buff=0.58)
            poids.add(libelle_w)
            biais.add(libelle_b)

        # Les valeurs des quatre postes, posées sur une même ligne sous le
        # réseau. Elles existent dès la construction pour que le sujet ait sa
        # taille définitive avant la mise à l'échelle ; elles sont rendues
        # transparentes, et la scène les allume une par une.
        valeurs = VGroup()
        for rang, texte in enumerate((
            f"x = {nombre(X, 0)}",
            f"a¹ = {nombre(A1, 3)}",
            f"a² = {nombre(A2, 3)}",
            f"a³ = {nombre(A3, 6)}",
        )):
            libelle = self.etiquette(texte, taille=TAILLE_CORPS, couleur=ENCRE)
            libelle.next_to(reseau.ronds[rang], DOWN, buff=1.35)
            valeurs.add(libelle)

        perte = self.cote(f"ℓ = {nombre(PERTE, 6)}", taille=TAILLE_CORPS)
        perte.next_to(valeurs[3], DOWN, buff=0.45)

        sujet = VGroup(reseau, poids, biais, valeurs, perte)
        self.poser_sujet(sujet)

        valeurs.set_opacity(0.0)
        perte.set_opacity(0.0)
        reseau.en_repos()

        self.play(Create(reseau.aretes), Create(reseau.ronds), run_time=1.1)

        self.next_section("Les poids et les biais se posent")
        self.play(FadeIn(poids), FadeIn(biais), run_time=0.9)

        self.next_section("L'entrée remplit le premier rond")
        self.play(
            valeurs[0].animate.set_opacity(1.0).set_color(BRIQUE),
            reseau.ronds[0].animate
            .set_fill(ENCRE, opacity=ReseauMinuscule.part_encre(X))
            .set_stroke(ENCRE_55),
            run_time=0.8,
        )
        self.wait(0.6)

        # LA PROPAGATION, POSTE PAR POSTE. À chaque pas, le poste qui vient de
        # se remplir passe en brique et le précédent revient à l'encre pâlie :
        # une seule valeur est affirmée à la fois, et la trame que le contrôle
        # visuel retiendra ne peut en montrer deux.
        for rang, activation in enumerate((A1, A2, A3), start=1):
            self.next_section(f"Le poste {rang} se remplit")
            self.play(
                valeurs[rang - 1].animate.set_color(ENCRE_55),
                poids[rang - 1].animate.set_color(ENCRE_55),
                run_time=0.35,
            )
            self.play(
                reseau.aretes[rang - 1].animate.set_stroke(BRIQUE, opacity=0.9),
                run_time=0.45,
            )
            # LE ROND SE REMPLIT À SON ACTIVATION, PAS À SA PRÉACTIVATION, et
            # en animation. Le premier rendu posait z d'un coup, hors
            # animation : le rond sautait au noir avant que sa valeur ne
            # s'inscrive, et il affichait z pendant que l'étiquette annonçait a.
            self.play(
                valeurs[rang].animate.set_opacity(1.0).set_color(BRIQUE),
                reseau.ronds[rang].animate
                .set_fill(ENCRE, opacity=ReseauMinuscule.part_encre(activation))
                .set_stroke(ENCRE_55),
                run_time=0.7,
            )
            self.play(
                reseau.aretes[rang - 1].animate.set_stroke(ENCRE_30, opacity=1.0),
                run_time=0.3,
            )
            self.wait(0.45)

        self.next_section("La perte s'inscrit")
        self.play(valeurs[3].animate.set_color(ENCRE_55), run_time=0.3)
        self.play(perte.animate.set_opacity(1.0), run_time=0.8)
        self.wait(1.6)
