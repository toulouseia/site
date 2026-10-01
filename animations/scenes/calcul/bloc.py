"""
Chapitre 5 · Le gradient d'un bloc est un produit extérieur.

Une scène. Une colonne et une ligne se croisent, et leur croisement remplit le
tableau du bloc : c'est la troisième ligne de la proposition 6,
∇_W ℓ = δ (a)ᵀ, dessinée comme ce qu'elle est.

CE QUE LE DESSIN AFFIRME. Que le coefficient d'une case est le croisement
d'une case de la colonne et d'une case de la ligne — la structure du produit
extérieur, et rien de plus. Les modules, eux, ne sont pas dessinés : la
mesure 4 relève le nombre de coefficients d'un bloc et l'écart de son gradient
aux différences finies, pas ses 4 096 valeurs une par une. Une case remplie
dit « il y a là un coefficient », comme aux scènes des jacobiennes.

VINGT LIGNES ET VINGT COLONNES, PAS SOIXANTE-QUATRE. Le bloc en a 64 × 64, la
cote le dit ; le tableau en montre les vingt premières, comme la mesure 6 ne
sonde elle-même que vingt indices (mesures.py:585). Dessiner les 4 096 cases
donnerait, une fois la composition mise à l'échelle, des cases de huit pixels
à 1080p — le seuil sous lequel `reseau_mob` cesse de dessiner un rond.

Nombres : `cours/lecon5/mesures.py`, mesures 4 et 5, par
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
    BLOC_COEFFICIENTS,
    BLOC_COTE,
    JACOBIENNE_COTE,
    MULT_EXTERIEURS,
    TAILLE_CORPS,
    Tableau,
    a_la_taille_du_corps,
    transposee,
)
from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    SceneN7,
    appliquer_style,
)

ANIMATIONS = [
    {
        "id": "le-gradient-est-un-produit-exterieur",
        "scene": "LeGradientEstUnProduitExterieur",
        "titre": "Une colonne, une ligne, et le bloc se remplit",
        "bandeau": "PROPOSITION 6",
        "section": "Page 10 · Le gradient d'un bloc, écrit comme un produit extérieur",
        "geste": "colonne et ligne dont le croisement remplit un tableau",
        "notions": [
            "geste : colonne et ligne dont le croisement remplit un tableau",
            "produit extérieur",
            "proposition 6",
            "gradient d'un bloc",
        ],
        "legende": (
            "Le signal d'erreur en colonne à gauche, les activations de la "
            "couche précédente en ligne au-dessus. Chaque case du tableau est "
            "le croisement d'une case de la colonne et d'une case de la "
            "ligne, et le bloc se remplit ainsi entièrement."
        ),
        "mouvement": [
            "1. Une colonne de cases s'affiche à gauche, une ligne de cases "
            "au-dessus, et le tableau du bloc est vide entre elles.",
            "2. Une case de la colonne et une case de la ligne s'éclairent ; "
            "la case du tableau à leur croisement se remplit.",
            "3. Le croisement se répète sur quelques cases, chaque fois à un "
            "autre endroit du tableau.",
            "4. La colonne balaie alors toutes ses cases et le tableau se "
            "remplit ligne après ligne.",
            "5. Les deux cotes du bloc s'inscrivent à droite.",
        ],
        "ecran": [
            "PROPOSITION 6",
            "δ", "aᵀ",
            "64 × 64 = 4096",
            "produits extérieurs   63 104",
        ],
        "nombres": {
            "cote": 64, "coefficients": 4096, "montrees": 20,
            "produits_exterieurs": 63104,
        },
        "alt": (
            "Une colonne étroite de cases est posée à gauche de l'écran et "
            "une ligne de cases au-dessus, à angle droit l'une de l'autre, "
            "désignées l'une par delta et l'autre par a transposé. Entre "
            "elles, un grand tableau carré est entièrement vide, ses cases "
            "seulement dessinées par un filet très pâle. Une case de la "
            "colonne s'éclaire en brique, une case de la ligne s'éclaire en "
            "brique, et à l'endroit précis où leur rangée et leur colonne se "
            "croisent, une case du tableau se remplit d'encre. Le couple "
            "s'éteint, un autre couple s'éclaire ailleurs, et une deuxième "
            "case se remplit à son croisement ; la chose se répète plusieurs "
            "fois en des points dispersés du tableau. Puis le balayage "
            "s'accélère : la case éclairée de la colonne descend rangée après "
            "rangée, et à chaque descente toute une rangée du tableau se "
            "remplit d'un coup, jusqu'à ce que le tableau soit plein. Deux "
            "cotes s'inscrivent enfin à droite, l'une donnant la taille vraie "
            "du bloc et son nombre de coefficients, l'autre le nombre de "
            "multiplications que tous les produits extérieurs du réseau "
            "coûtent."
        ),
    },
]

CASE = 0.26
# Les quelques croisements montrés un par un avant le balayage. Ils sont pris
# dispersés exprès : trois croisements alignés laisseraient croire que le
# remplissage suit un ordre.
CROISEMENTS = ((3, 14), (11, 5), (17, 9), (7, 18))


class LeGradientEstUnProduitExterieur(SceneN7):
    titre = "Proposition 6"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=TAILLE_CORPS)

        n = JACOBIENNE_COTE
        tableau = Tableau(n, n, CASE)

        # LA COLONNE ET LA LIGNE SONT DES TABLEAUX D'UNE SEULE RANGÉE. Les
        # bâtir avec le même objet que le bloc garantit que leurs cases ont
        # exactement la même taille : un vecteur dessiné avec ses propres
        # cases finirait décalé d'un demi-pixel par rangée, et le croisement
        # ne tomberait plus en face.
        colonne = Tableau(n, 1, CASE)
        colonne.remplir(lambda i, j: 0.45, opacite_max=1.0)
        colonne.next_to(tableau, LEFT, buff=0.42)
        colonne.align_to(tableau, UP)

        ligne = Tableau(1, n, CASE)
        ligne.remplir(lambda i, j: 0.45, opacite_max=1.0)
        ligne.next_to(tableau, UP, buff=0.42)
        ligne.align_to(tableau, LEFT)

        nom_colonne = self.etiquette("δ", taille=TAILLE_CORPS, couleur=ENCRE)
        nom_colonne.next_to(colonne, LEFT, buff=0.30)
        nom_ligne = transposee("a", taille=TAILLE_CORPS, couleur=ENCRE)
        nom_ligne.next_to(ligne, UP, buff=0.26)

        releve = VGroup(
            self.cote(f"{BLOC_COTE} × {BLOC_COTE} = {BLOC_COEFFICIENTS}",
                      taille=TAILLE_CORPS),
            self.cote(f"produits extérieurs   {MULT_EXTERIEURS}",
                      taille=TAILLE_CORPS),
        )
        releve.arrange(DOWN, buff=0.42, aligned_edge=LEFT)
        releve.next_to(tableau, RIGHT, buff=0.55)

        sujet = VGroup(tableau, colonne, ligne, nom_colonne, nom_ligne, releve)
        self.poser_sujet(sujet)
        # `nom_colonne` et `nom_ligne` sont des symboles d'un seul tenant :
        # le seuil de 24 ne vise que les textes à plusieurs mots, et le T de
        # la transposée DOIT rester plus petit que son corps.
        a_la_taille_du_corps(releve)

        releve.set_opacity(0.0)

        self.play(Create(tableau), run_time=1.1)
        self.play(Create(colonne), Create(ligne),
                  FadeIn(nom_colonne), FadeIn(nom_ligne), run_time=0.9)
        self.wait(0.6)

        self.next_section("Un croisement, puis un autre")
        for i, j in CROISEMENTS:
            case_colonne = colonne.case(i, 0)
            case_ligne = ligne.case(0, j)
            self.play(
                case_colonne.animate.set_fill(BRIQUE, opacity=1.0),
                case_ligne.animate.set_fill(BRIQUE, opacity=1.0),
                run_time=0.35,
            )
            self.play(
                tableau.case(i, j).animate.set_fill(ENCRE, opacity=0.75),
                run_time=0.35,
            )
            self.play(
                case_colonne.animate.set_fill(ENCRE, opacity=0.45),
                case_ligne.animate.set_fill(ENCRE, opacity=0.45),
                run_time=0.25,
            )

        self.wait(0.5)

        # LE BALAYAGE. Une rangée à la fois : c'est la ligne δᵢ (a)ᵀ, et c'est
        # le seul ordre dans lequel le produit extérieur se lit sans mentir —
        # remplir case par case suggérerait 400 multiplications indépendantes
        # là où il y en a une par croisement, ce qui est la même chose, mais
        # rangée par rangée on voit que la ligne du haut est recopiée.
        self.next_section("La colonne balaie, le bloc se remplit")
        for i in range(n):
            rangee = VGroup(*[tableau.case(i, j) for j in range(n)])
            self.play(
                colonne.case(i, 0).animate.set_fill(BRIQUE, opacity=1.0),
                rangee.animate.set_fill(ENCRE, opacity=0.75),
                run_time=0.13,
            )
            self.play(
                colonne.case(i, 0).animate.set_fill(ENCRE, opacity=0.45),
                run_time=0.07,
            )

        self.wait(0.6)
        self.play(releve.animate.set_opacity(1.0), run_time=0.9)
        self.wait(1.8)
