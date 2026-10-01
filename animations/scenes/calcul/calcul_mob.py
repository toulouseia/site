"""
Chapitre 5 · la base commune des animations du calcul de la rétropropagation.

CE FICHIER TIENT DEUX CHOSES, ET RIEN D'AUTRE.

1. LES NOMBRES. Toutes les valeurs que les scènes affichent sont ici, en
   constantes nommées, et chacune porte en commentaire la LIGNE de
   `cours/lecon5/mesures.py` qui l'imprime. Une scène n'écrit jamais un nombre
   à la main : elle lit une constante d'ici. C'est ce qui rend le chapitre
   vérifiable — relancer `python cours/lecon5/mesures.py` et comparer suffit.

2. LES OBJETS PARTAGÉS. Le réseau minuscule 1 → 1 → 1 → 1, et le tableau de
   coefficients. Deux objets, parce que les huit scènes ne montrent qu'eux et
   des droites graduées.

CE QU'IL NE FAIT PAS : il ne calcule rien. `mesures.py` charge MNIST, initialise
un réseau de 63 370 paramètres et passe dix minutes à vérifier son gradient par
différences finies ; une animation qui referait ce travail à chaque rendu
coûterait ces dix minutes par scène, pour retrouver les mêmes nombres. Les
nombres sont donc RECOPIÉS, et la citation de la ligne est ce qui tient lieu de
preuve.

LE RÉSEAU MINUSCULE EST DÉRIVÉ DE `scenes/reseau_mob.py`, QUI EST GELÉ. On n'en
hérite pas : `Colonne` est bâtie pour des couches de 784 ou 128 ronds qu'il faut
abréger, et `ReseauScene` pose une grille d'entrée 28 × 28 dont ce chapitre n'a
que faire. On en reprend les CONVENTIONS VISUELLES, une à une, pour que les deux
réseaux du cours se ressemblent :

    le rond            stroke_width 1,2, contour GRIS_58, rempli d'encre à
                       l'activation                        (reseau_mob.py:276)
    l'arête            `buff` valant le plus grand des deux rayons, sans quoi
                       le trait entre dans le cercle et y creuse une encoche
                                                           (reseau_mob.py:436)
    l'arête au repos   GRIS_40                             (reseau_mob.py:444)
    la cote            brique, SEMIBOLD                         (n7ia.py:262)

La différence tient en une ligne : ici une couche a UN neurone, donc rien à
abréger, donc ni « ⋮ » ni accolade — et c'est tout ce que `Colonne` sait faire
de plus.
"""

from __future__ import annotations

from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Circle,
    Line,
    Square,
    Text,
    VGroup,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    FONTE,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    TRAIT_AXE,
    TRAIT_FILET,
)

# ── La taille du corps ──────────────────────────────────────────────────────
#
# 24, et pas moins. C'est le seuil de `collisions.py` (TAILLE_LISIBLE) : sous
# lui la fonte système arrondit la chasse de l'espace vers le bas et les mots
# d'une étiquette se collent. Le chapitre 5 est refait d'un bloc, il s'y met
# entièrement — aucune étiquette de ces huit scènes n'est composée plus petit.
TAILLE_CORPS = 24

# La cote d'un tableau, quand elle doit tenir sous une grille large. Même
# taille : un nombre seul n'est pas concerné par le seuil, mais deux tailles
# d'étiquette dans un même chapitre se voient.
TAILLE_COTE = 24


# ── L'écriture des nombres ──────────────────────────────────────────────────


def nombre(valeur: float, decimales: int = 6) -> str:
    """
    Un nombre composé comme le cours l'écrit : virgule décimale, et le VRAI
    signe moins (U+2212), pas le trait d'union.

    `collisions.py` refuse le trait d'union devant un chiffre (ASCII_INTERDIT,
    collisions.py:166) et il a raison : sur fond papier, à la taille du corps,
    un trait d'union est deux fois plus court qu'un moins et se lit comme une
    césure.
    """
    texte = f"{valeur:.{decimales}f}".replace(".", ",")
    return texte.replace("-", "−")


def puissance(mantisse: str, exposant: str) -> str:
    """« 2,597e−02 » écrit comme le cours l'écrit : 2,597 × 10⁻² ."""
    return f"{mantisse} × 10{exposant}"


def transposee(base: str, taille: float = TAILLE_CORPS, couleur: str = ENCRE,
               graisse: str = "MEDIUM") -> VGroup:
    """
    « aᵀ », composé en deux morceaux — et il FAUT le composer en deux morceaux.

    LE T EXPOSANT D'UNICODE N'EXISTE PAS DANS LA FONTE. U+1D40, MODIFIER
    LETTER CAPITAL T, est absent de la fonte système, et U+1D57 aussi. Pango
    ne se rabat alors sur aucune autre fonte : il dessine sa boîte
    hexadécimale, un petit cadre portant « 1D 40 » en chiffres minuscules —
    exactement le piège que `scenes/n7ia.py` documente pour le bloc grec
    (n7ia.py:89-98). Le premier rendu de `le-gradient-est-un-produit-exterieur`
    affichait « a » suivi de ce cadre, et ni le crible ni le manifeste ne
    peuvent le voir : pour eux la chaîne est correcte, c'est le tracé qui ne
    l'est pas.

    CE QUI A ÉTÉ ESSAYÉ, ET MESURÉ, sur une planche de contrôle :

        aᵀ   boîte hexadécimale        absent
        aᵗ   boîte hexadécimale        absent
        a⊤   se dessine                mais c'est un taquet logique, posé
                                            sur la ligne de base, pas un
                                            exposant
        ′ ⁻¹ ∂ ℓ × − ⊙   se dessinent tous

    On pose donc un « T » ordinaire à 62 % du corps, aligné sur le haut de la
    lettre. Une seule fonte partout, ce que `n7ia.py` préfère explicitement à
    un mélange — et pas de MathTex pour un seul caractère.
    """
    corps = Text(base, font=FONTE, weight=graisse, font_size=taille,
                 color=couleur)
    marque = Text("T", font=FONTE, weight=graisse, font_size=taille * 0.62,
                  color=couleur)
    marque.next_to(corps, RIGHT, buff=0.05)
    marque.align_to(corps, UP)
    return VGroup(corps, marque)


def a_la_taille_du_corps(*mobjects, taille: float = TAILLE_CORPS) -> None:
    """
    Ramène chaque étiquette à la taille du corps APRÈS la mise à l'échelle.

    LE PROBLÈME, ET IL EST MESURÉ. `poser_sujet` agrandit ou réduit la
    composition entière pour la faire tenir dans le cadre. Quand elle est trop
    grande, il la réduit — et les étiquettes descendent avec elle. Composées à
    24, elles arrivaient à 22,0 sur la jacobienne et 22,4 sur la profondeur,
    et `collisions.py` les signalait toutes les deux fois : sous 24, la fonte
    système arrondit la chasse de l'espace vers le bas et les mots se collent.

    POURQUOI ON NE COMPOSE PAS SIMPLEMENT PLUS GRAND. La taille voulue divisée
    par l'échelle donnerait la bonne taille finale — mais l'échelle dépend de
    la largeur de la composition, qui dépend de la taille des étiquettes. On
    tournerait en rond. On pose donc la composition, puis on remonte les
    étiquettes une à une, chacune AUTOUR DE SON PROPRE CENTRE pour ne déplacer
    personne.

    Le rattrapage est petit — moins d'un dixième — et le crible vérifie
    derrière lui que les marges tiennent toujours.
    """

    def corriger(mobject) -> None:
        actuelle = getattr(mobject, "font_size", None)
        if actuelle is not None and float(actuelle) > 0.0:
            if float(actuelle) < taille:
                mobject.font_size = taille
            return
        for enfant in getattr(mobject, "submobjects", ()):
            corriger(enfant)

    for mobject in mobjects:
        corriger(mobject)


# ── Le réseau minuscule ─────────────────────────────────────────────────────
#
# mesures.py:98-107, le dictionnaire MINUSCULE. Sept valeurs figées, aucun
# tirage : c'est le réseau que le texte calcule à la main.

X = 1.0                 # mesures.py:99
W1, B1 = 0.8, 0.2       # mesures.py:100-101
W2, B2 = 1.5, -0.4      # mesures.py:102-103
W3, B3 = 2.0, -0.5      # mesures.py:104-105
Y = 1.0                 # mesures.py:106

# La propagation avant, imprimée par la mesure 1.
Z1, A1 = 1.000000, 1.000000      # mesures.py:170
Z2, A2 = 1.100000, 1.100000      # mesures.py:171
Z3, A3 = 1.700000, 0.845535      # mesures.py:172
PERTE = 0.167786                 # mesures.py:173

# Les trois dérivées constitutives de la dernière couche, et le court-circuit.
DZ3_DW3 = 1.100000               # mesures.py:179   dz3/dw3 = a2
DA3_DZ3 = 0.130606               # mesures.py:180   da3/dz3 = a3 (1 - a3)
DL_DA3 = -1.182684               # mesures.py:181   dl/da3
PRODUIT_DES_TROIS = -0.169912    # mesures.py:182
DL_DZ3 = -0.154465               # mesures.py:183   le court-circuit

# La passe arrière, couche par couche.
DELTA3 = -0.154465               # mesures.py:186
DL_DW3 = -0.169912               # mesures.py:187
DL_DB3 = -0.154465               # mesures.py:188
DL_DA2 = -0.308931               # mesures.py:189
DELTA2 = -0.308931               # mesures.py:190
DL_DW2 = -0.308931               # mesures.py:191
DL_DA1 = -0.463396               # mesures.py:193
DELTA1 = -0.463396               # mesures.py:194
DL_DW1 = -0.463396               # mesures.py:195

# Le corollaire : la récurrence contre le produit déroulé, et leur écart.
PRODUIT_DEROULE = -0.463396      # mesures.py:201
RECURRENCE = -0.463396           # mesures.py:202
ECART_COROLLAIRE = "0"           # mesures.py:203, l'écart imprimé vaut 0,000e+00

# ── Le réseau profond ───────────────────────────────────────────────────────

LARGEURS = (784, 64, 64, 64, 64, 10)   # mesures.py:67
PARAMETRES = 63370                     # mesures.py:403

# Mesure 3 · la norme du signal d'erreur par couche, quatre couches cachées.
# LES DEUX RELEVÉS PARTAGENT LES MÊMES POIDS : seule φ change d'une ligne à
# l'autre (mesures.py:30-33). C'est ce qui autorise à les poser à la MÊME
# ÉCHELLE — sans cela, l'écart mêlerait l'effet de l'activation et du tirage.
NORMES_RELU = (0.734, 0.8847, 1.025, 0.924, 0.8997)          # mesures.py:347-350
NORMES_SIGMOIDE = (0.006729, 0.0236, 0.09483, 0.3029, 0.8975)  # mesures.py:347-350
RAPPORT_RELU = "1,2"                   # mesures.py:353
RAPPORT_SIGMOIDE = "133,4"             # mesures.py:353
TRAVERSEE_RELU = "1,05"                # mesures.py:355
TRAVERSEE_SIGMOIDE = "3,40"            # mesures.py:355
PIRE_CAS = "4"                         # mesures.py:356, le pire cas annoncé par φ′ ≤ 1/4

# Mesure 4 · le bloc W^[2] du réseau profond : 64 × 64.
BLOC_COTE = 64                         # mesures.py:67, les couches cachées
BLOC_COEFFICIENTS = 4096               # mesures.py:452, la ligne « W^[2] 4096 »

# Mesure 5 · le compte des multiplications.
MULT_AVANT = "63 104"                  # mesures.py:512
MULT_REMONTEES = "12 928"              # mesures.py:513
MULT_EXTERIEURS = "63 104"             # mesures.py:514
MULT_TOTAL = "139 136"                 # mesures.py:516
RAPPORT_COUT = "2,20"                  # mesures.py:517
MAJORANT = "3,00"                      # mesures.py:518

# Mesure 6 · la jacobienne d'une couche cachée, indices 1 à 20.
JACOBIENNE_COTE = 20                   # mesures.py:585, indices = np.arange(20)
JACOBIENNE_CASES = 400                 # 20 × 20
JACOBIENNE_HORS = 380                  # mesures.py:595
JACOBIENNE_NON_NULS = 0                # mesures.py:596
JACOBIENNE_MAX = "0"                   # mesures.py:597, module maximal 0,000e+00
DIAGONALE_MIN_RELU = "0"               # mesures.py:598, relu : 0,000e+00
DIAGONALE_MIN_SIGMOIDE = ("1,465", "⁻¹")  # mesures.py:598, 1,465e−01

# Mesure 7 · la jacobienne du softmax, les dix indices.
SOFTMAX_COTE = 10                      # mesures.py:609, indices = np.arange(10)
SOFTMAX_HORS = 90                      # mesures.py:613
SOFTMAX_NON_NULS = 90                  # mesures.py:614
SOFTMAX_MAX = ("2,597", "⁻²")      # mesures.py:615, 2,597e−02
SOFTMAX_SOMME = ("4,857", "⁻¹¹")  # mesures.py:616, 4,857e−11


# ── Les objets ──────────────────────────────────────────────────────────────


class ReseauMinuscule(VGroup):
    """
    1 → 1 → 1 → 1 : quatre ronds en ligne, trois arêtes.

    POURQUOI QUATRE RONDS POUR TROIS COUCHES. L'entrée x est un rond comme les
    autres, et elle doit l'être : le corollaire de la proposition 4 la fait
    figurer dans le produit déroulé, au même titre que w₂ ou φ′(z₁). Un schéma
    qui la dessinerait autrement ferait croire qu'elle y joue un autre rôle.

    `rayon` est posé et non calculé. `reseau_mob._diametre` répartit n ronds sur
    une hauteur ; avec n = 1 il rendrait toute la hauteur de la colonne, soit un
    rond de 2,7 unités. La règle utile ici est l'autre : un rond qui porte une
    étiquette ne descend pas sous 0,3 (reseau_mob.py:193).
    """

    def __init__(self, rayon: float = 0.44, ecart: float = 2.9, **kwargs) -> None:
        super().__init__(**kwargs)

        self.ronds = VGroup(
            *[
                Circle(radius=rayon, stroke_width=1.2, stroke_color=GRIS_58)
                .set_fill(ENCRE, opacity=0.0)
                .shift(RIGHT * (rang * ecart))
                for rang in range(4)
            ]
        )

        # LES ARÊTES SONT DES TRAITS PLEINS, PAS LE VOILE DE `reseau_mob`.
        # Là-bas, 784 × 128 arêtes à pleine opacité feraient un aplat gris :
        # elles sont posées à 0,08. Ici il y en a TROIS, et chacune porte un
        # poids que la scène va citer — les voiler n'économiserait rien et les
        # rendrait illisibles.
        self.aretes = VGroup(
            *[
                Line(
                    self.ronds[rang].get_center(),
                    self.ronds[rang + 1].get_center(),
                    buff=rayon,
                    stroke_width=TRAIT_FILET,
                    color=GRIS_40,
                )
                for rang in range(3)
            ]
        )

        self.add(self.aretes, self.ronds)
        self.rayon = rayon

    @staticmethod
    def part_encre(valeur: float, maximum: float = A2,
                   plafond: float = 0.72) -> float:
        """
        L'opacité qu'un rond doit porter pour une activation donnée.

        `maximum` EST a², la plus grande des quatre valeurs que ce réseau
        porte (mesures.py:171) : les quatre ronds se lisent sur une seule
        échelle, et un rond plus sombre l'est parce que son activation est
        plus grande, jamais parce qu'on a changé de règle en route.

        LE PLAFOND EXISTE POUR QUE LE ROND RESTE UN ROND. À opacité pleine, un
        disque d'encre sur fond papier avale son propre contour : il ne se lit
        plus comme un neurone rempli, mais comme un trou. Le premier rendu en
        donnait un, entièrement noir, au bout de la chaîne. À 0,72 le contour
        se voit encore, et les quatre postes restent distincts les uns des
        autres.
        """
        return max(0.0, min(1.0, abs(valeur) / maximum)) * plafond

    def allumer(self, rang: int, valeur: float, maximum: float = A2) -> None:
        """Pose le remplissage d'un rond, sans animation."""
        self.ronds[rang].set_fill(ENCRE, opacity=self.part_encre(valeur, maximum))

    def en_repos(self) -> None:
        """Tout le réseau à l'encre pâlie : il est là, il n'est pas le sujet."""
        self.ronds.set_stroke(ENCRE_30)
        self.aretes.set_stroke(ENCRE_30)


class Tableau(VGroup):
    """
    Une matrice dessinée comme ce qu'elle est : un tableau de coefficients.

    CHAQUE CASE EST UN COEFFICIENT, et son remplissage en est le module. Pas un
    point posé dans une case — une case pleine. La différence se voit quand le
    tableau se vide : un point qui disparaît laisse une case vide identique à
    une case nulle, et c'est justement ce qu'il fallait pouvoir distinguer.

    LE TRAIT DE LA GRILLE EST À 0,3 D'ENCRE, pas plus. Au-delà, `collisions.py`
    compte le tableau comme une image traversée par des traits (OPACITE_TRAIT,
    collisions.py:81) — et il aurait raison : vingt lignes et vingt colonnes à
    pleine encre pèsent plus que les coefficients qu'elles séparent.
    """

    def __init__(self, lignes: int, colonnes: int, cote: float = 0.22,
                 **kwargs) -> None:
        super().__init__(**kwargs)

        self.lignes, self.colonnes = lignes, colonnes
        self.cases: list[list[Square]] = []

        for i in range(lignes):
            rang = []
            for j in range(colonnes):
                case = Square(side_length=cote, stroke_width=0.5)
                case.set_stroke(GRIS_24, opacity=0.3)
                case.set_fill(ENCRE, opacity=0.0)
                case.shift(RIGHT * (j * cote) + DOWN * (i * cote))
                rang.append(case)
                self.add(case)
            self.cases.append(rang)

        self.center()

    def case(self, i: int, j: int) -> Square:
        return self.cases[i][j]

    def diagonale(self) -> VGroup:
        return VGroup(*[self.cases[i][i]
                        for i in range(min(self.lignes, self.colonnes))])

    def hors_diagonale(self) -> VGroup:
        return VGroup(*[self.cases[i][j]
                        for i in range(self.lignes)
                        for j in range(self.colonnes) if i != j])

    def remplir(self, module, opacite_max: float = 0.85) -> None:
        """
        Pose le module de chaque coefficient. `module(i, j)` rend une valeur
        entre 0 et 1 ; le remplissage lui est proportionnel.
        """
        for i in range(self.lignes):
            for j in range(self.colonnes):
                part = max(0.0, min(1.0, float(module(i, j))))
                self.cases[i][j].set_fill(ENCRE, opacity=part * opacite_max)


def droite_graduee(longueur: float = 4.4, graduations: int = 8) -> VGroup:
    """
    Une droite graduée : un axe, des traits de graduation, rien d'écrit.

    Les nombres se posent par la scène, à la taille du corps — une graduation
    chiffrée à cette longueur donnerait huit étiquettes de 24 sur 4,4 unités,
    qui se recouvrent.
    """
    axe = Line(LEFT * longueur / 2, RIGHT * longueur / 2,
               stroke_width=TRAIT_AXE, color=ENCRE_55)
    traits = VGroup(
        *[
            Line(UP * 0.09, DOWN * 0.09, stroke_width=TRAIT_FILET,
                 color=ENCRE_30)
            .move_to(LEFT * longueur / 2 + RIGHT * (k * longueur / graduations))
            for k in range(graduations + 1)
        ]
    )
    return VGroup(axe, traits)


def curseur(rayon: float = 0.085) -> Circle:
    """Le point qui marque une valeur sur une droite graduée. Brique : il bouge."""
    return Circle(radius=rayon, stroke_width=0).set_fill(BRIQUE, opacity=1.0)


__all__ = [
    "TAILLE_CORPS",
    "TAILLE_COTE",
    "ReseauMinuscule",
    "Tableau",
    "a_la_taille_du_corps",
    "curseur",
    "droite_graduee",
    "nombre",
    "transposee",
    "puissance",
]
