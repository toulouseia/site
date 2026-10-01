"""
Chapitre 5 · La forme vectorielle : deux jacobiennes, deux tableaux.

Deux scènes. Un tableau de quatre cents coefficients se vide de tout ce qui
n'est pas sur sa diagonale ; le tableau du softmax, soumis au même contrôle,
ne se vide pas.

CE QUE LE REMPLISSAGE D'UNE CASE DIT, ET CE QU'IL NE DIT PAS. Il dit qu'un
coefficient est là, non qu'il vaut telle valeur : la mesure 6 ne relève pas les
quatre cents modules un par un, elle relève combien sont non nuls et quel est
le plus grand. Une case qui se vide est donc un coefficient nul, une case qui
reste est un coefficient non nul — et rien de plus n'est affirmé. Les seules
grandeurs écrites sont celles que la mesure imprime.

POURQUOI LA SIGMOÏDE ET NON LA RELU pour la première scène. Les deux
jacobiennes sont diagonales, la mesure 6 le montre pour l'une comme pour
l'autre. Mais le module minimal sur la diagonale vaut 0,000e+00 pour la ReLU
(mesures.py:598) : au moins un de ses vingt coefficients diagonaux est nul,
et on ne sait pas lequel. Un tableau qui garderait ses vingt cases diagonales
mentirait. Celui de la sigmoïde ne descend pas sous 1,465e−01 : ses vingt
cases se gardent toutes, et la cote le dit.

Nombres : `cours/lecon5/mesures.py`, mesures 6 et 7, par
`scenes/calcul/calcul_mob.py`.
"""

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Create,
    FadeIn,
    VGroup,
)

from scenes.calcul.calcul_mob import (
    DIAGONALE_MIN_SIGMOIDE,
    JACOBIENNE_COTE,
    JACOBIENNE_HORS,
    JACOBIENNE_NON_NULS,
    SOFTMAX_COTE,
    SOFTMAX_HORS,
    SOFTMAX_MAX,
    SOFTMAX_NON_NULS,
    SOFTMAX_SOMME,
    TAILLE_CORPS,
    Tableau,
    a_la_taille_du_corps,
    puissance,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_55,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "la-jacobienne-est-diagonale",
        "scene": "LaJacobienneEstDiagonale",
        "titre": "Le tableau se vide sauf sa diagonale",
        "bandeau": "MESURE 6",
        "section": "Page 10 · Le contrôle de la diagonalité",
        "geste": "matrice qui se vide sauf sa diagonale",
        "notions": [
            "geste : matrice qui se vide sauf sa diagonale",
            "jacobienne",
            "proposition 6",
            "produit de Hadamard",
        ],
        "legende": (
            "Vingt lignes sur vingt colonnes, quatre cents coefficients. Le "
            "contrôle les parcourt : les trois cent quatre-vingts qui ne sont "
            "pas sur la diagonale s'éteignent tous, et aucun ne reste."
        ),
        "mouvement": [
            "1. Un tableau de vingt sur vingt s'affiche, chaque case portant "
            "son coefficient.",
            "2. Les cases hors diagonale s'éteignent par vagues obliques.",
            "3. Les vingt cases de la diagonale restent, et leur contour "
            "passe en brique.",
            "4. Les deux cotes du relevé s'inscrivent à droite du tableau.",
            "5. Le module minimal de la diagonale s'inscrit à son tour.",
        ],
        "ecran": [
            "MESURE 6",
            "φ = σ",
            "hors diagonale   380",
            "non nuls   0",
            "module minimal sur la diagonale   1,465 × 10⁻¹",
        ],
        "nombres": {
            "cases": 400, "hors_diagonale": 380, "non_nuls": 0,
            "diagonale_min": 0.1465,
        },
        "alt": (
            "Un tableau carré de vingt rangées sur vingt colonnes occupe la "
            "hauteur de l'écran, chacune de ses quatre cents cases remplie "
            "d'une encre sombre uniforme et séparée de ses voisines par un "
            "filet très pâle. Une étiquette posée au-dessus indique que "
            "l'activation considérée est la sigmoïde. Les cases commencent "
            "alors à s'éteindre par vagues obliques qui traversent le tableau "
            "en diagonale, rangée après rangée, laissant derrière elles des "
            "cases entièrement vides ; seules celles qui se trouvent sur la "
            "diagonale allant du coin supérieur gauche au coin inférieur droit "
            "conservent leur encre. Quand la dernière vague est passée, il ne "
            "reste qu'une ligne oblique de vingt cases pleines sur un damier "
            "vide, et le contour de ces vingt cases passe en couleur brique. "
            "À droite du tableau s'inscrivent alors deux cotes, le nombre de "
            "coefficients hors diagonale et le nombre de ceux qui ne sont pas "
            "nuls, puis une troisième donnant le plus petit module relevé sur "
            "la diagonale."
        ),
    },
    {
        "id": "le-softmax-ne-se-vide-pas",
        "scene": "LeSoftmaxNeSeVidePas",
        "titre": "Le même contrôle, et le tableau qui ne se vide pas",
        "bandeau": "MESURE 7",
        "section": "Page 10 · Le contre-exemple du softmax",
        "geste": "matrice soumise au même contrôle qui ne se vide pas",
        "notions": [
            "geste : matrice soumise au même contrôle qui ne se vide pas",
            "softmax",
            "jacobienne non diagonale",
            "couplage des composantes",
        ],
        "legende": (
            "Dix lignes sur dix colonnes. La même vague passe sur le tableau "
            "du softmax et n'éteint rien : les quatre-vingt-dix coefficients "
            "hors diagonale sont tous non nuls. Chaque colonne, elle, somme "
            "à zéro."
        ),
        "mouvement": [
            "1. Un tableau de dix sur dix s'affiche sous l'étiquette softmax.",
            "2. La même vague oblique le traverse ; aucune case ne s'éteint.",
            "3. Les dix cases de la diagonale passent en brique, les autres "
            "restent pleines.",
            "4. Les deux cotes du relevé et le module maximal s'inscrivent.",
            "5. Une colonne après l'autre s'éclaire, et la somme de colonne "
            "s'inscrit sous le tableau.",
        ],
        "ecran": [
            "MESURE 7",
            "softmax",
            "hors diagonale   90",
            "non nuls   90",
            "module maximal   2,597 × 10⁻²",
            "somme de chaque colonne   4,857 × 10⁻¹¹",
        ],
        "nombres": {
            "cases": 100, "hors_diagonale": 90, "non_nuls": 90,
            "max": 0.02597, "somme_colonne": 4.857e-11,
        },
        "alt": (
            "Un tableau carré de dix rangées sur dix colonnes occupe le centre "
            "de l'écran, ses cent cases remplies d'une encre sombre uniforme, "
            "sous une étiquette portant le mot softmax. Une vague oblique le "
            "traverse exactement comme elle avait traversé le tableau "
            "précédent, mais cette fois aucune case ne s'éteint : les cases "
            "s'éclaircissent au passage de la vague puis retrouvent toutes "
            "leur encre. Les dix cases de la diagonale prennent ensuite un "
            "contour brique, tandis que les quatre-vingt-dix autres restent "
            "pleines. Trois cotes s'inscrivent à droite du tableau : le nombre "
            "de coefficients hors diagonale, le nombre de ceux qui ne sont pas "
            "nuls — le même — et le plus grand module relevé hors diagonale. "
            "Enfin, les colonnes du tableau s'éclairent l'une après l'autre de "
            "gauche à droite, et sous le tableau s'inscrit la somme de chaque "
            "colonne, un nombre de l'ordre de dix puissance moins onze."
        ),
    },
]

# La case, en unités de la figure avant mise à l'échelle. Vingt cases de 0,28
# font un tableau de 5,6 : `poser_sujet` l'agrandit ensuite jusqu'au cadre, et
# la case tient alors quarante pixels à 1080p — bien au-dessus du seuil de
# huit sous lequel `reseau_mob` cesse de dessiner un rond.
CASE_JACOBIENNE = 0.28
CASE_SOFTMAX = 0.50
VAGUES = 5


class LaJacobienneEstDiagonale(SceneN7):
    titre = "Mesure 6"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        tableau = Tableau(JACOBIENNE_COTE, JACOBIENNE_COTE, CASE_JACOBIENNE)
        tableau.remplir(lambda i, j: 0.55, opacite_max=1.0)

        activation = self.etiquette("φ = σ", taille=TAILLE_CORPS, couleur=ENCRE)
        activation.next_to(tableau, UP, buff=0.30)

        releve = VGroup(
            self.cote(f"hors diagonale   {JACOBIENNE_HORS}",
                      taille=TAILLE_CORPS),
            self.cote(f"non nuls   {JACOBIENNE_NON_NULS}", taille=TAILLE_CORPS),
        )
        releve.arrange(DOWN, buff=0.42, aligned_edge=LEFT)
        releve.next_to(tableau, RIGHT, buff=0.62)

        minimum = self.etiquette(
            "module minimal sur la diagonale   "
            + puissance(*DIAGONALE_MIN_SIGMOIDE),
            taille=TAILLE_CORPS, couleur=ENCRE_55,
        )
        minimum.next_to(tableau, DOWN, buff=0.38)

        sujet = VGroup(tableau, activation, releve, minimum)
        self.poser_sujet(sujet)
        a_la_taille_du_corps(activation, releve, minimum)

        releve.set_opacity(0.0)
        minimum.set_opacity(0.0)

        self.play(Create(tableau), run_time=1.4)
        self.play(FadeIn(activation), run_time=0.5)
        self.wait(0.6)

        self.next_section("Les cases hors diagonale s'éteignent")
        for vague in range(VAGUES):
            cases = [
                tableau.case(i, j)
                for i in range(JACOBIENNE_COTE)
                for j in range(JACOBIENNE_COTE)
                if i != j and (i + j) % VAGUES == vague
            ]
            self.play(
                *[c.animate.set_fill(ENCRE, opacity=0.0) for c in cases],
                run_time=0.55,
            )

        self.next_section("Les vingt cases de la diagonale restent")
        self.play(
            tableau.diagonale().animate.set_stroke(BRIQUE, opacity=1.0,
                                                   width=1.4),
            run_time=0.7,
        )
        self.wait(0.5)

        self.play(releve.animate.set_opacity(1.0), run_time=0.8)
        self.wait(0.6)
        self.play(minimum.animate.set_opacity(1.0), run_time=0.7)
        self.wait(1.8)


class LeSoftmaxNeSeVidePas(SceneN7):
    titre = "Mesure 7"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        tableau = Tableau(SOFTMAX_COTE, SOFTMAX_COTE, CASE_SOFTMAX)
        tableau.remplir(lambda i, j: 0.55, opacite_max=1.0)

        nom = self.etiquette("softmax", taille=TAILLE_CORPS, couleur=ENCRE)
        nom.next_to(tableau, UP, buff=0.30)

        releve = VGroup(
            self.cote(f"hors diagonale   {SOFTMAX_HORS}", taille=TAILLE_CORPS),
            self.cote(f"non nuls   {SOFTMAX_NON_NULS}", taille=TAILLE_CORPS),
            self.cote("module maximal   " + puissance(*SOFTMAX_MAX),
                      taille=TAILLE_CORPS),
        )
        releve.arrange(DOWN, buff=0.42, aligned_edge=LEFT)
        releve.next_to(tableau, RIGHT, buff=0.55)

        somme = self.etiquette(
            "somme de chaque colonne   " + puissance(*SOFTMAX_SOMME),
            taille=TAILLE_CORPS, couleur=ENCRE_55,
        )
        somme.next_to(tableau, DOWN, buff=0.38)

        sujet = VGroup(tableau, nom, releve, somme)
        self.poser_sujet(sujet)
        a_la_taille_du_corps(nom, releve, somme)

        releve.set_opacity(0.0)
        somme.set_opacity(0.0)

        self.play(Create(tableau), run_time=1.0)
        self.play(FadeIn(nom), run_time=0.5)
        self.wait(0.6)

        # LA MÊME VAGUE, ET ELLE N'ÉTEINT RIEN. Les cases s'éclaircissent sur
        # son passage puis reprennent leur encre : c'est le contrôle de la
        # scène précédente rejoué à l'identique, et son résultat contraire.
        self.next_section("La même vague passe et n'éteint rien")
        for vague in range(VAGUES):
            cases = [
                tableau.case(i, j)
                for i in range(SOFTMAX_COTE)
                for j in range(SOFTMAX_COTE)
                if i != j and (i + j) % VAGUES == vague
            ]
            self.play(
                *[c.animate.set_fill(ENCRE, opacity=0.18) for c in cases],
                run_time=0.35,
            )
            self.play(
                *[c.animate.set_fill(ENCRE, opacity=0.55) for c in cases],
                run_time=0.35,
            )

        self.next_section("La diagonale se marque, les autres restent")
        self.play(
            tableau.diagonale().animate.set_stroke(BRIQUE, opacity=1.0,
                                                   width=1.6),
            run_time=0.7,
        )
        self.wait(0.5)

        self.play(releve.animate.set_opacity(1.0), run_time=0.9)
        self.wait(0.8)

        self.next_section("Chaque colonne somme à zéro")
        for j in range(SOFTMAX_COTE):
            colonne = VGroup(*[tableau.case(i, j) for i in range(SOFTMAX_COTE)])
            self.play(
                colonne.animate.set_fill(ENCRE, opacity=0.85),
                run_time=0.12,
            )
            self.play(
                colonne.animate.set_fill(ENCRE, opacity=0.55),
                run_time=0.10,
            )
        self.play(somme.animate.set_opacity(1.0), run_time=0.8)
        self.wait(1.8)
