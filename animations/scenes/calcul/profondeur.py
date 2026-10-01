"""
Chapitre 5 · Le signal s'atténue en traversant les relais.

Une scène. Le relais est un tableau de coefficients — la transposée par
laquelle la remontée passe. Le signal d'erreur le traverse quatre fois, de la
couche de sortie à la première, et sa norme est relevée aux cinq couches. Le
même trajet est rejoué avec la sigmoïde, à LA MÊME ÉCHELLE.

POURQUOI LA MÊME ÉCHELLE. La mesure 3 fait tourner les deux activations sur
LES MÊMES POIDS (mesures.py:30-33) : d'un relevé à l'autre, la seule chose qui
change est φ. Deux échelles auraient rendu les deux courbes également plates et
auraient effacé le seul fait de la mesure — que l'une garde son signal et que
l'autre le perd.

Les barres de la sigmoïde sont alors invisibles aux trois premières couches, et
c'est exact : 0,006729 rapporté à 1,025 fait six millièmes de la hauteur. La
cote porte le nombre, la barre porte l'ordre de grandeur, et aucune des deux ne
ment pour rendre l'autre lisible.

Nombres : `cours/lecon5/mesures.py`, mesure 3, par `scenes/calcul/calcul_mob.py`.
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
    Rectangle,
    VGroup,
)

from scenes.calcul.calcul_mob import (
    BLOC_COTE,
    JACOBIENNE_COTE,
    NORMES_RELU,
    NORMES_SIGMOIDE,
    RAPPORT_RELU,
    RAPPORT_SIGMOIDE,
    TAILLE_CORPS,
    Tableau,
    a_la_taille_du_corps,
    transposee,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_55,
    TRAIT_AXE,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "le-signal-sattenue",
        "scene": "LeSignalSattenue",
        "titre": "Le signal traverse cinq couches, deux fois",
        "bandeau": "MESURE 3",
        "section": "Page 11 · La profondeur, et ce que l'activation lui fait",
        "geste": "signal atténué à chaque relais",
        "notions": [
            "geste : signal atténué à chaque relais",
            "transposée",
            "profondeur",
            "atténuation du gradient",
        ],
        "legende": (
            "Un tableau de coefficients tient lieu de relais : c'est par lui "
            "que la remontée passe. Le signal le traverse quatre fois et sa "
            "norme est relevée aux cinq couches, pour la ReLU puis pour la "
            "sigmoïde, à la même échelle."
        ),
        "mouvement": [
            "1. Le tableau du relais s'affiche, et cinq barres vides sont "
            "posées sous lui, une par couche.",
            "2. La barre de la couche de sortie monte à sa norme mesurée.",
            "3. Le tableau s'éclaire au passage du signal, et la barre de la "
            "couche suivante monte à son tour ; quatre traversées en tout.",
            "4. Les cinq barres de la ReLU restent de hauteur comparable, et "
            "le rapport s'inscrit.",
            "5. Les barres retombent et le trajet est rejoué avec la "
            "sigmoïde, à la même échelle : les trois premières barres ne se "
            "voient plus.",
        ],
        "ecran": [
            "MESURE 3",
            "ReLU", "sigmoïde",
            "0,8997", "0,924", "1,025", "0,8847", "0,734",
            "0,8975", "0,3029", "0,09483", "0,0236", "0,006729",
            "rapport   1,2", "rapport   133,4",
        ],
        "nombres": {
            "relu": [0.8997, 0.924, 1.025, 0.8847, 0.734],
            "sigmoide": [0.8975, 0.3029, 0.09483, 0.0236, 0.006729],
            "rapport_relu": 1.2, "rapport_sigmoide": 133.4,
            "couches": 5,
        },
        "alt": (
            "Un tableau carré de coefficients occupe le haut de l'écran, "
            "chacune de ses cases remplie d'une encre uniforme ; une cote "
            "indique qu'il s'agit de la transposée d'un bloc de soixante-"
            "quatre sur soixante-quatre. Sous lui, cinq emplacements de barres "
            "sont alignés sur une même ligne de base, désignés de la couche "
            "cinq à la couche un. La barre de droite du groupe, celle de la "
            "couche de sortie, monte d'abord jusqu'à une hauteur nette et sa "
            "valeur s'inscrit au-dessus. Le tableau s'éclaire alors en brique "
            "sur toute sa surface, comme traversé, et la barre voisine monte à "
            "son tour presque aussi haut. Le mouvement se répète quatre fois "
            "et laisse cinq barres de hauteurs voisines, sous l'étiquette "
            "ReLU, avec un rapport proche de un. Toutes les barres retombent "
            "ensuite, l'étiquette devient sigmoïde, et le même trajet "
            "recommence sans que l'échelle change : la première barre monte "
            "aussi haut que tout à l'heure, la deuxième au tiers, la troisième "
            "à un dixième, et les deux dernières ne se voient plus du tout — "
            "seules leurs cotes chiffrées disent qu'elles existent. Le rapport "
            "inscrit à la fin vaut cette fois plus de cent."
        ),
    },
]

# Le relais : un tableau de coefficients. Vingt lignes et vingt colonnes du
# bloc, pas les soixante-quatre — la cote dit la taille vraie, comme la
# mesure 6 le fait elle-même en ne sondant que vingt indices
# (mesures.py:585). Une case de 0,15 tient vingt et un pixels à 1080p une
# fois la composition mise à l'échelle.
CASE_RELAIS = 0.15

# Les barres. La hauteur est proportionnelle à la norme, et la plus grande des
# DIX normes fixe l'échelle — une seule pour les deux activations.
HAUTEUR_BARRE = 1.75
LARGEUR_BARRE = 0.62
PAS_BARRE = 1.60
ECHELLE = max(max(NORMES_RELU), max(NORMES_SIGMOIDE))


class LeSignalSattenue(SceneN7):
    titre = "Mesure 3"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        relais = Tableau(JACOBIENNE_COTE, JACOBIENNE_COTE, CASE_RELAIS)
        relais.remplir(lambda i, j: 0.45, opacite_max=1.0)
        relais.move_to(UP * 2.05)

        # LA MARQUE DE TRANSPOSITION EST COMPOSÉE À PART. Le T exposant
        # d'Unicode manque à la fonte et Pango y met sa boîte hexadécimale ;
        # voir `transposee` dans `calcul_mob.py`. La cote du format, elle,
        # reste une cote ordinaire — c'est elle qui porte un nombre.
        marque_relais = transposee("(W)", taille=TAILLE_CORPS, couleur=BRIQUE,
                                   graisse="SEMIBOLD")
        taille_relais = self.cote(f"{BLOC_COTE} × {BLOC_COTE}",
                                  taille=TAILLE_CORPS)
        nom_relais = VGroup(marque_relais, taille_relais)
        nom_relais.arrange(RIGHT, buff=0.42, aligned_edge=UP)
        nom_relais.next_to(relais, RIGHT, buff=0.55)

        # LA LIGNE DE BASE. Les cinq barres montent d'elle ; les couches sont
        # rangées de la sortie vers l'entrée, parce que c'est le sens dans
        # lequel la récurrence descend.
        base_y = -2.55
        gauche = -PAS_BARRE * 2
        ligne = Line(
            LEFT * (PAS_BARRE * 2 + 0.7) + UP * base_y,
            RIGHT * (PAS_BARRE * 2 + 0.7) + UP * base_y,
            stroke_width=TRAIT_AXE, color=ENCRE_55,
        )

        barres, etiquettes = VGroup(), VGroup()
        for rang in range(5):
            x = gauche + rang * PAS_BARRE
            barre = Rectangle(width=LARGEUR_BARRE, height=0.001,
                              stroke_width=0)
            barre.set_fill(BRIQUE, opacity=1.0)
            barre.move_to(RIGHT * x + UP * base_y, aligned_edge=DOWN)
            barres.add(barre)

            # « l = 5 » … « l = 1 » : la couche, pas son rang dans le dessin.
            libelle = self.etiquette(f"l = {5 - rang}", taille=TAILLE_CORPS,
                                     couleur=ENCRE_55)
            libelle.move_to(RIGHT * x + UP * (base_y - 0.42))
            etiquettes.add(libelle)

        # Les cotes sont posées sur une MÊME ligne, au-dessus de la plus haute
        # barre possible : une cote calée sur le sommet de sa barre descendrait
        # au ras de la ligne de base dès que la barre est courte, et viendrait
        # buter sur l'étiquette de couche.
        # LES DIX COTES SONT BÂTIES TOUT DE SUITE, les cinq de la ReLU et les
        # cinq de la sigmoïde, aux mêmes emplacements. Deux raisons : la
        # composition doit connaître sa largeur définitive avant la mise à
        # l'échelle — « 0,006729 » est plus large que « 0,734 » — et une cote
        # fabriquée en cours de route serait composée à une autre taille que
        # celle du sujet mis à l'échelle.
        y_cote = base_y + HAUTEUR_BARRE + 0.40
        cotes_relu, cotes_sigmoide = VGroup(), VGroup()
        for rang in range(5):
            couche = 5 - rang
            x = RIGHT * (gauche + rang * PAS_BARRE) + UP * y_cote
            for normes, groupe in ((NORMES_RELU, cotes_relu),
                                   (NORMES_SIGMOIDE, cotes_sigmoide)):
                cote = self.cote(
                    f"{normes[couche - 1]:.6g}".replace(".", ","),
                    taille=TAILLE_CORPS,
                )
                cote.move_to(x)
                groupe.add(cote)
        cotes = VGroup(cotes_relu, cotes_sigmoide)

        activation = self.etiquette("ReLU", taille=TAILLE_CORPS, couleur=ENCRE)
        activation.move_to(RIGHT * (gauche + 4 * PAS_BARRE + 1.45)
                           + UP * (base_y + 0.9))
        rapport = self.cote(f"rapport   {RAPPORT_RELU}", taille=TAILLE_CORPS)
        rapport.next_to(activation, DOWN, buff=0.40)

        sujet = VGroup(relais, nom_relais, ligne, barres, etiquettes, cotes,
                       activation, rapport)
        self.poser_sujet(sujet)
        # `marque_relais` est exclue à dessein : son T doit rester plus petit
        # que son corps, et « (W) » n'a pas d'espace — le seuil ne le vise pas.
        a_la_taille_du_corps(taille_relais, etiquettes, cotes, activation,
                             rapport)

        cotes.set_opacity(0.0)
        rapport.set_opacity(0.0)

        self.play(Create(relais), run_time=1.2)
        self.play(FadeIn(nom_relais), Create(ligne), FadeIn(etiquettes),
                  run_time=0.8)
        self.play(FadeIn(activation), run_time=0.4)
        self.wait(0.5)

        self.jouer_un_trajet(relais, barres, cotes_relu, NORMES_RELU)
        self.play(rapport.animate.set_opacity(1.0), run_time=0.7)
        self.wait(1.6)

        self.next_section("Le même trajet, avec la sigmoïde")
        nouvelle = self.etiquette("sigmoïde", taille=TAILLE_CORPS, couleur=ENCRE)
        nouvelle.move_to(activation.get_center())
        nouveau_rapport = self.cote(f"rapport   {RAPPORT_SIGMOIDE}",
                                    taille=TAILLE_CORPS)
        nouveau_rapport.move_to(rapport.get_center())

        self.play(
            *[b.animate.stretch_to_fit_height(0.001).move_to(
                b.get_bottom(), aligned_edge=DOWN) for b in barres],
            cotes_relu.animate.set_opacity(0.0),
            FadeOut(rapport),
            FadeOut(activation),
            run_time=0.8,
        )
        self.play(FadeIn(nouvelle), run_time=0.4)
        self.wait(0.4)

        self.jouer_un_trajet(relais, barres, cotes_sigmoide, NORMES_SIGMOIDE)
        self.play(FadeIn(nouveau_rapport), run_time=0.7)
        self.wait(2.0)

    def jouer_un_trajet(self, relais, barres, cotes, normes) -> None:
        """
        Le signal part de la couche de sortie et descend jusqu'à la première.

        `normes` est donné dans l'ordre des couches, l = 1 … l = 5
        (mesures.py:347-350). Le dessin les prend à l'envers : la barre de
        gauche est la couche 5, celle d'où le signal part.
        """
        echelle = barres[0].get_width() / LARGEUR_BARRE
        hauteur_max = HAUTEUR_BARRE * echelle

        for rang in range(5):
            couche = 5 - rang
            norme = normes[couche - 1]
            self.next_section(f"La couche {couche}")

            if rang > 0:
                # LE RELAIS S'ÉCLAIRE, PUIS S'ÉTEINT. C'est lui qui fait
                # passer d'une couche à la suivante, et il est la seule chose
                # en brique pendant qu'il le fait.
                self.play(relais.animate.set_fill(BRIQUE, opacity=0.55),
                          run_time=0.35)
                self.play(relais.animate.set_fill(ENCRE, opacity=0.45),
                          run_time=0.30)

            part = norme / ECHELLE
            bas = barres[rang].get_bottom()
            self.play(
                barres[rang].animate
                .stretch_to_fit_height(max(hauteur_max * part, 0.001))
                .move_to(bas, aligned_edge=DOWN),
                run_time=0.55,
            )
            self.play(cotes[rang].animate.set_opacity(1.0), run_time=0.35)
            self.wait(0.30)
