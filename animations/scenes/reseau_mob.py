"""
Le réseau du chapitre 2, dessiné une fois pour les huit animations.

CE FICHIER EST LA DÉPENDANCE DE TOUT LE CHAPITRE. Les huit scènes l'importent,
aucune ne redessine un réseau. C'est ce qui fait que le lecteur voit le MÊME
objet de la page 2 à la page 9 : mêmes rangs, mêmes couleurs, même géométrie,
et les mêmes poids que ceux dont sortent tous les nombres du chapitre.

LES POIDS NE SONT PAS INVENTÉS ICI. `cours/lecon2/mesures.py` entraîne les
quatre modèles du chapitre et dépose leurs paramètres dans
`cours/.donnees/l2-modeles.npz`, qui n'est pas versionné. Une animation qui
n'aurait pas ce fichier échoue avec le message qui dit quoi lancer, plutôt que
de dessiner un réseau plausible et faux.

    python cours/lecon2/mesures.py        écrit .donnees/l2-modeles.npz

LES QUATRE MODÈLES, sous les noms qu'ils portent dans le npz :

    lineaire          784 -> 10             pages 6 et 7
    sans_activation   784 -> 128 -> 10      page 8, sans rien entre les couches
    relu              784 -> 128 -> 10      pages 9, 10, 11 -- le réseau du chapitre
    profond           784 -> 16 -> 16 -> 10 pages 10 et 11

LE RÉSEAU EST LA SCÈNE, PAS LE SUJET. Deux animations sur huit montrent la
propagation : celles-là gardent le réseau entier à pleine opacité, c'est leur
sujet. Les six autres montrent autre chose — un gabarit, une couche seule, un
tableau de poids, trois grilles — et alors le réseau passe au décor :
`effacer_le_reseau()` met ses traits à 0,05 et ses ronds à 0,3, sauf ce dont on
parle. UN SEUL OBJET EST À PLEINE OPACITÉ À LA FOIS. Le sujet, lui, se pose avec
`poser_sujet()` : au centre de l'espace dégagé, à 4,6 unités de haut, soit
58 % du cadre — la règle en demande 40 au moins. À toute trame, le spectateur doit pouvoir dire ce qu'il est
censé regarder.

AUCUN OBJET NE TOUCHE LE BORD. Une demi-unité de marge partout — la grille
d'entrée est passée de -5,4 à -5,0 pour cela.

L'ABRÉGÉ EST COTÉ, JAMAIS MOYENNÉ. Une colonne de 128 ronds ne tient pas à
l'écran : 128 ronds sur les 6 unités disponibles donnent 4,1 px de diamètre à
1080p, sous le seuil de 8 px où un rond cesse d'être un rond. On en montre donc
24, puis « ⋮ », puis 24, et une accolade porte le nombre vrai. Ce qu'on ne fait
PAS, et que la source fait : remplir un rond abrégé avec la moyenne d'un bloc
de neurones. Un rond porte l'activation du neurone qu'il désigne, ou n'est pas
là.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from manim import (  # type: ignore[import-not-found]
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Brace,
    Create,
    FadeIn,
    FadeOut,
    Line,
    Square,
    Text,
    Transform,
    VGroup,
    config,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    TRAIT_COTE,
    SceneN7,
)

# ── Où sont les poids et les images ─────────────────────────────────────────

_COURS = Path(__file__).resolve().parent.parent.parent / "cours"
POIDS = _COURS / ".donnees" / "l2-modeles.npz"


def _donnees():
    """Le module `cours/donnees.py`, importé sans installer quoi que ce soit."""
    if str(_COURS) not in sys.path:
        sys.path.insert(0, str(_COURS))
    import donnees  # type: ignore[import-not-found]

    return donnees


def charger_modele(nom: str = "relu") -> dict[str, np.ndarray]:
    """
    Les poids d'un des quatre modèles, sous la forme {W1, b1, W2, b2, ...}.

    Le npz est plat : ses clés valent « relu.W1 », « lineaire.b1 ». On ne rend
    que celles du modèle demandé, sans son préfixe.
    """
    if not POIDS.exists():
        raise FileNotFoundError(
            f"{POIDS} est absent. Lance d'abord :\n"
            f"    python cours/lecon2/mesures.py\n"
            f"Il entraîne les quatre modèles du chapitre et dépose leurs poids."
        )
    archive = np.load(POIDS)
    prefixe = f"{nom}."
    theta = {
        cle[len(prefixe):]: archive[cle]
        for cle in archive.files
        if cle.startswith(prefixe)
    }
    if not theta:
        noms = sorted({c.split(".")[0] for c in archive.files})
        raise KeyError(f"modèle « {nom} » absent du npz ; il contient {noms}")
    return theta


def charger_test(combien: int = 1200) -> tuple[np.ndarray, np.ndarray]:
    """Les `combien` premières images de test, et leurs étiquettes."""
    _, _, Xte, cte = _donnees().charger(n_train=1, n_test=combien)
    return Xte, cte


def avant(theta: dict[str, np.ndarray], x: np.ndarray,
          activation: str = "relu") -> dict[str, np.ndarray]:
    """
    La propagation avant, ligne pour ligne celle de `cours/lecon2/mesures.py`.

        Z = x W^T + b, ReLU entre les couches, softmax à la dernière.

    `x` est une image seule, de forme (784,) ; le cache rendu contient des
    vecteurs, pas des matrices : les scènes affichent un exemple, jamais un lot.
    """
    L = len(theta) // 2
    cache: dict[str, np.ndarray] = {"A0": x}
    a = x
    for couche in range(1, L + 1):
        z = theta[f"W{couche}"] @ a + theta[f"b{couche}"]
        if couche == L:
            e = np.exp(z - z.max())
            a = e / e.sum()
        elif activation == "relu":
            a = np.maximum(z, 0.0)
        elif activation == "identite":
            a = z
        else:
            raise ValueError(activation)
        cache[f"Z{couche}"] = z
        cache[f"A{couche}"] = a
    return cache


# ── La géométrie, en unités Manim ───────────────────────────────────────────
#
# Le cadre fait 14,22 x 8 unités. Les quatre colonnes sont posées à la main
# plutôt que réparties : la bande de droite doit rester libre pour les nombres
# que les scènes y écrivent.

X_GRILLE = -5.0
X_ENTREE = -3.0
X_CACHEE = -0.3
X_SORTIE = 2.4
X_LIBRE = 3.4          # tout ce qui est à droite de cette abscisse est aux scènes

COTE_GRILLE = 2.2      # la grille 28 x 28 en décor, côté total
Y_GRILLE = 0.3
HAUTEUR_COLONNE = 5.4
HAUTEUR_SORTIE = 6.5   # la colonne de sortie ne porte pas de cote : elle peut
                       # descendre plus bas, et ses ronds atteignent 0,3 de rayon
Y_COLONNE = -0.2
Y_COTE_DESSOUS = -3.20  # posé, pas relatif : sous le dernier rond, au-dessus
                        # de la marge, et la bande des poids passe encore dessous

# LA MARGE. Aucun objet ne touche le bord. Le cadre fait 14,22 × 8 ; tout vit
# donc dans [-6,61 ; 6,61] × [-3,5 ; 3,5]. La grille d'entrée débordait de cette
# règle avant d'être ramenée de -5,4 à -5,0.
MARGE = 0.5

# LE SUJET. Quand une scène montre autre chose que la propagation, ce qu'elle
# montre prend le centre, et le réseau s'efface. Le sujet couvre au moins
# 40 % de la hauteur du cadre.
PART_DU_SUJET = 0.40
COTE_SUJET = 4.6       # une grille 28 × 28 quand elle EST le sujet : 58 % de la
                       # hauteur du cadre. C'est tout l'espace libre entre la
                       # colonne d'entrée et les ronds de sortie, marge tenue.

OPACITE_VOILE = 0.08
OPACITE_EVIDENCE = 0.9
OPACITE_DECOR_TRAIT = 0.05   # le réseau effacé : ses traits
OPACITE_DECOR_ROND = 0.3     # le réseau effacé : ses ronds
SEUIL_ROND_PX = 8.0    # sous ce diamètre, un rond n'est plus un rond
RAYON_SORTIE_MINIMAL = 0.3   # un rond de sortie porte une étiquette : il se voit

# Manim rend `frame_height` unités sur la hauteur de l'image. À 1080p, 8
# unités valent 1080 px : une unité vaut 135 px. La mesure est refaite à
# l'exécution parce qu'un profil de rendu peut changer la hauteur du cadre.


def px_par_unite(hauteur_px: int = 1080) -> float:
    return hauteur_px / float(config.frame_height)


def facteur_ecart(n_ronds: int) -> float:
    """
    L'intervalle entre deux ronds, en part de leur diamètre.

    UNE COLONNE COURTE SE SERRE. Dix ronds espacés de six dixièmes de leur
    diamètre tiennent sur six unités avec un rayon de 0,21 : sous le seuil de
    0,3 qu'un rond étiqueté doit atteindre pour se lire. Les mêmes dix, serrés
    à huit centièmes, l'atteignent. Une colonne longue, elle, a besoin de son
    air : quarante-huit ronds collés font un trait.
    """
    return 0.6 if n_ronds > 12 else 0.08


def _diametre(n_ronds: int, hauteur: float = HAUTEUR_COLONNE,
              ecart: float | None = None) -> float:
    """
    Le diamètre qu'auraient `n_ronds` ronds empilés sur `hauteur`, avec un
    intervalle valant `ecart` fois leur diamètre.
    """
    if ecart is None:
        ecart = facteur_ecart(n_ronds)
    return hauteur / (n_ronds + ecart * (n_ronds - 1))


def abreger(taille: int, montres: int = 24) -> tuple[bool, float, float]:
    """
    Faut-il abréger une colonne de `taille` ronds, et de combien de pixels
    s'agit-il ? Rend (abrégée, diamètre entier en px, diamètre abrégé en px).

    C'EST UNE MESURE, PAS UN GOÛT. On compare le diamètre à 1080p au seuil de
    8 px. La scène d'essai imprime ces trois valeurs : c'est ce qui justifie
    l'abréviation dans le rapport de rendu.
    """
    entier = _diametre(taille) * px_par_unite()
    reduit = _diametre(2 * montres) * px_par_unite()
    return entier < SEUIL_ROND_PX, entier, reduit


class Colonne(VGroup):
    """
    Une couche : des ronds empilés, éventuellement abrégés par « ⋮ », et une
    accolade qui porte la taille vraie quand l'abréviation en cache une partie.

    `rangs` donne, pour chaque rond montré, l'indice du neurone qu'il désigne.
    C'est ce qui interdit de remplir un rond avec autre chose que l'activation
    de CE neurone.
    """

    def __init__(self, taille: int, x: float, montres: int = 24,
                 rayon_max: float = 0.32, cote_dessous: bool = False,
                 hauteur: float = HAUTEUR_COLONNE, **kwargs) -> None:
        super().__init__(**kwargs)
        from manim import Circle, MathTex  # import local : Manim est lourd

        self.taille = taille
        abregee = taille > 2 * montres and abreger(taille, montres)[0]
        n = 2 * montres if abregee else taille
        n = min(n, taille)
        self.abregee = bool(abregee)

        diametre = _diametre(n, hauteur)
        rayon = min(rayon_max, diametre / 2.0)
        ecart = diametre * facteur_ecart(n)

        if abregee:
            self.rangs = list(range(montres)) + list(range(taille - montres, taille))
        else:
            self.rangs = list(range(n))

        ronds = VGroup(
            *[
                Circle(radius=rayon, stroke_width=1.2, stroke_color=GRIS_58)
                .set_fill(ENCRE, opacity=0.0)
                for _ in range(n)
            ]
        )
        ronds.arrange(DOWN, buff=ecart)

        self.ronds = ronds
        self.add(ronds)

        if abregee:
            # `suspension` et non `points` : `Mobject.points` est le tableau
            # des points du tracé. L'écraser avec un mobject fait tomber toute
            # transformation géométrique du groupe, sans message utile.
            suspension = MathTex(r"\vdots", color=GRIS_58, font_size=30)
            haut = VGroup(*ronds[:montres])
            bas = VGroup(*ronds[montres:])
            suspension.move_to(ronds)
            haut.next_to(suspension, UP, buff=ecart * 2.5)
            bas.next_to(suspension, DOWN, buff=ecart * 2.5)
            self.suspension = suspension
            self.add(suspension)

            # ÉCARTER LES DEUX MOITIÉS ALLONGE LA COLONNE. Les 24 ronds étaient
            # rangés sur la hauteur demandée ; le « ⋮ » les repousse de deux
            # fois deux et demi l'intervalle, et la colonne sort du cadre par le
            # bas. On resserre les POSITIONS, jamais les rayons : un rond réduit
            # repasserait sous le seuil de 8 px que l'abréviation sert à tenir.
            debordement = ronds.height / hauteur
            if debordement > 1.0:
                milieu = ronds.get_center()[1]
                for rond in ronds:
                    ecart_y = rond.get_center()[1] - milieu
                    rond.shift(UP * (ecart_y / debordement - ecart_y))

        if taille > n:
            # L'ACCOLADE EST CE QUI EMPÊCHE L'ABRÉVIATION DE MENTIR : elle
            # porte le nombre vrai à côté d'une colonne qui n'en montre qu'une
            # part. Sa cote se pose SOUS la colonne dès qu'un faisceau passe à
            # sa gauche : un texte sur un tracé est signalé par le crible, et
            # il est de toute façon moins lisible.
            accolade = Brace(self, LEFT, color=GRIS_40)
            cote = Text(str(taille), font_size=20, color=BRIQUE, weight="SEMIBOLD")
            cote.next_to(accolade, LEFT, buff=0.12)
            self.accolade = VGroup(accolade, cote)
            self.cote_taille = cote
            self.add(self.accolade)

        self.move_to([x, Y_COLONNE, 0])
        # `move_to` place le groupe accolade et cote comprises ; on recale sur
        # les RONDS, sinon la colonne dérive d'une demi-accolade vers la droite
        # et d'une demi-cote vers le haut, et les colonnes ne s'alignent plus
        # entre elles.
        centre = ronds.get_center()
        self.shift(RIGHT * (x - centre[0]) + UP * (Y_COLONNE - centre[1]))

        # LA COTE SE POSE APRÈS LE RECALAGE, et à une ordonnée absolue : elle
        # est sur la dernière ligne utile du cadre, pas à une distance des
        # ronds. Une cote calée sur eux descend avec eux et sort du cadre.
        if cote_dessous and taille > n:
            self.cote_taille.move_to([x, Y_COTE_DESSOUS, 0])

    def rond_du_rang(self, rang: int):
        """Le rond qui désigne le neurone `rang`, ou None s'il est dans le ⋮."""
        if rang in self.rangs:
            return self.ronds[self.rangs.index(rang)]
        return None

    def y_du_rang(self, rang: int) -> float:
        """
        L'ordonnée où vit le rang `rang`, montré ou non.

        La colonne représente ses `taille` rangs de haut en bas, y compris ceux
        que le « ⋮ » remplace : le rang 400 d'une colonne de 784 est à
        mi-hauteur, et c'est là qu'un pixel du milieu de l'image doit arriver.
        """
        haut = self.ronds.get_top()[1]
        bas = self.ronds.get_bottom()[1]
        part = rang / max(1, self.taille - 1)
        return haut - part * (haut - bas)

    def allumer(self, activations: np.ndarray, couleur: str = ENCRE,
                maximum: float | None = None) -> VGroup:
        """
        L'état visé : chaque rond montré rempli à l'activation de SON neurone,
        normalisée par le maximum de la couche. Rend une copie, pour `Transform`.
        """
        cible = self.ronds.copy()
        haut = float(maximum if maximum is not None else np.max(np.abs(activations)))
        haut = haut if haut > 0 else 1.0
        for rond, rang in zip(cible, self.rangs):
            valeur = float(activations[rang]) / haut
            rond.set_fill(couleur, opacity=max(0.0, min(1.0, valeur)))
        return cible


class ReseauScene(SceneN7):
    """
    La scène de base du chapitre 2 : le réseau est là dès la première trame.

    Une scène qui hérite d'elle n'a rien à construire. Elle change au plus
    deux attributs de classe :

        modele   la clé du npz -- « relu » par défaut
        tailles  la forme du réseau montré -- (784, 128, 10) par défaut
    """

    modele: str = "relu"
    tailles: tuple[int, ...] = (784, 128, 10)
    activation: str = "relu"
    montrer_grille: bool = True

    def setup(self) -> None:
        super().setup()
        self.theta = charger_modele(self.modele)
        self.Xte, self.cte = charger_test()
        self.construire_reseau()

    # ── La construction ─────────────────────────────────────────────────────

    def construire_reseau(self) -> None:
        abscisses = self._abscisses()
        # La colonne d'entrée montre 12 ronds, « ⋮ », 12 ronds : douze rangs
        # suffisent à dire que la colonne est ordonnée, et une entrée de 784
        # n'en montrera jamais assez pour valoir un dessin de l'image — c'est
        # la grille, à gauche, qui joue ce rôle.
        derniere = len(self.tailles) - 1
        self.colonnes = VGroup(
            *[
                Colonne(
                    taille,
                    x,
                    montres=12 if rang == 0 else 24,
                    # TOUTES LES COTES SONT SOUS LEUR COLONNE. Celle de
                    # l'entrée tenait à gauche de son accolade tant que la
                    # grille d'entrée était plus loin ; ramenée dans le cadre,
                    # la grille passe dessous et la cote devient illisible.
                    cote_dessous=rang < derniere,
                    # La colonne de sortie ne porte ni ⋮ ni cote : elle occupe
                    # toute la hauteur utile, ce qui donne à ses dix ronds le
                    # rayon de 0,3 sous lequel une étiquette ne se lit plus.
                    hauteur=HAUTEUR_SORTIE if rang == derniere else HAUTEUR_COLONNE,
                )
                for rang, (taille, x) in enumerate(zip(self.tailles, abscisses))
            ]
        )
        self.entree = self.colonnes[0]
        self.sortie = self.colonnes[-1]
        self.cachee = self.colonnes[1] if len(self.colonnes) > 2 else None

        self.etiquettes_sortie = VGroup()
        for k, rond in enumerate(self.sortie.ronds):
            libelle = Text(str(k), font_size=18, color=GRIS_58)
            libelle.next_to(rond, RIGHT, buff=0.14)
            self.etiquettes_sortie.add(libelle)

        self.faisceaux = VGroup()
        for gauche, droite in zip(self.colonnes[:-1], self.colonnes[1:]):
            faisceau = VGroup()
            for depart in gauche.ronds:
                for arrivee in droite.ronds:
                    # Le retrait vaut le PLUS GRAND des deux rayons : Manim
                    # l'applique aux deux bouts à la fois, et un retrait pris
                    # sur le petit rond laisse le faisceau entrer dans le grand,
                    # où il dessine une encoche claire au travers du cercle.
                    trait = Line(
                        depart.get_center(),
                        arrivee.get_center(),
                        buff=max(depart.width, arrivee.width) / 2,
                        stroke_width=0.7,
                        color=GRIS_40,
                    )
                    trait.set_stroke(opacity=OPACITE_VOILE)
                    faisceau.add(trait)
            self.faisceaux.add(faisceau)

        self.grille = self._grille(np.zeros(784))
        self.reseau = VGroup(self.faisceaux, self.colonnes, self.etiquettes_sortie)
        self.add(self.reseau)
        if self.montrer_grille:
            self.add(self.grille)

    def _abscisses(self) -> list[float]:
        if len(self.tailles) == 2:
            return [X_ENTREE, X_SORTIE]
        if len(self.tailles) == 3:
            return [X_ENTREE, X_CACHEE, X_SORTIE]
        pas = (X_SORTIE - X_ENTREE) / (len(self.tailles) - 1)
        return [X_ENTREE + pas * i for i in range(len(self.tailles))]

    def _grille(self, image: np.ndarray) -> VGroup:
        """
        La grille 28 x 28 de l'image courante, en niveaux de gris INVERSÉS :
        sur fond papier, un pixel encré est sombre. La source travaille sur
        fond noir, encre claire ; recopier son sens rendrait nos chiffres
        illisibles.
        """
        cote = COTE_GRILLE / 28.0
        cases = VGroup()
        valeurs = np.asarray(image, dtype=float).reshape(28, 28)
        for i in range(28):
            for j in range(28):
                case = Square(side_length=cote, stroke_width=0.25, stroke_color=GRIS_24)
                case.set_fill(ENCRE, opacity=float(valeurs[i, j]))
                case.move_to(
                    [
                        X_GRILLE - COTE_GRILLE / 2 + (j + 0.5) * cote,
                        Y_GRILLE + COTE_GRILLE / 2 - (i + 0.5) * cote,
                        0,
                    ]
                )
                cases.add(case)
        return cases

    # ── Les gestes partagés ─────────────────────────────────────────────────

    def poser_image(self, indice: int) -> np.ndarray:
        """Remplace la grille par l'image de test `indice`. Rend le vecteur."""
        image = self.Xte[indice]
        neuve = self._grille(image)
        self.grille.become(neuve)
        return image

    def en_evidence(self, traits: list, faisceau: int = 0) -> None:
        """
        Remonte certaines arêtes du voile à la brique. `traits` est une liste
        d'indices dans le faisceau, ou une liste de mobjects.
        """
        groupe = self.faisceaux[faisceau]
        for element in traits:
            trait = groupe[element] if isinstance(element, int) else element
            trait.set_stroke(BRIQUE, opacity=OPACITE_EVIDENCE, width=1.2)

    def traits_vers(self, rang_sortie: int, faisceau: int = -1) -> list:
        """Les arêtes qui arrivent au rond `rang_sortie` de la couche suivante."""
        groupe = self.faisceaux[faisceau]
        droite = self.colonnes[faisceau if faisceau >= 0 else len(self.colonnes) - 1]
        gauche = self.colonnes[
            (faisceau if faisceau >= 0 else len(self.colonnes) - 1) - 1
        ]
        largeur = len(droite.ronds)
        position = droite.rangs.index(rang_sortie)
        return [groupe[i * largeur + position] for i in range(len(gauche.ronds))]

    def eteindre(self) -> None:
        """Tout revient à zéro : les ronds vides, les arêtes au voile."""
        for colonne in self.colonnes:
            colonne.ronds.set_fill(ENCRE, opacity=0.0)
        for faisceau in self.faisceaux:
            faisceau.set_stroke(GRIS_40, opacity=OPACITE_VOILE, width=0.7)

    # ── La composition ──────────────────────────────────────────────────────
    #
    # LE RÉSEAU EST LA SCÈNE, PAS LE SUJET. Quand une animation montre autre
    # chose que la propagation — un gabarit, une couche seule, un tableau de
    # poids —, ce qu'elle montre prend le centre et le réseau passe au décor.
    # Un seul objet est à pleine opacité à la fois, et le spectateur doit
    # pouvoir dire, à n'importe quelle trame, ce qu'il est censé regarder.

    def effacer_le_reseau(self, sauf=None) -> None:
        """
        Le réseau passe au décor : traits à 0,05, ronds à 0,3.

        `sauf` liste les mobjects qui gardent leur opacité — le neurone dont on
        parle, les arêtes qu'on suit. Tout le reste s'efface, étiquettes de
        sortie et cotes comprises : une cote à pleine opacité à côté d'un sujet
        pâle désigne la cote.
        """
        epargnes = set()
        for mob in sauf or []:
            epargnes.update(id(f) for f in mob.get_family())

        for faisceau in self.faisceaux:
            for trait in faisceau:
                if id(trait) not in epargnes:
                    trait.set_stroke(opacity=OPACITE_DECOR_TRAIT)
        for colonne in self.colonnes:
            for rond in colonne.ronds:
                if id(rond) in epargnes:
                    continue
                rond.set_stroke(opacity=OPACITE_DECOR_ROND)
                rond.set_fill(opacity=rond.get_fill_opacity() * OPACITE_DECOR_ROND)
            for accessoire in (getattr(colonne, "accolade", None),
                               getattr(colonne, "suspension", None)):
                if accessoire is not None and id(accessoire) not in epargnes:
                    accessoire.set_opacity(OPACITE_DECOR_ROND)
        for libelle in self.etiquettes_sortie:
            if id(libelle) not in epargnes:
                libelle.set_opacity(OPACITE_DECOR_ROND)
        if self.montrer_grille:
            for case in self.grille:
                case.set_fill(opacity=case.get_fill_opacity() * OPACITE_DECOR_ROND)
                case.set_stroke(
                    opacity=case.get_stroke_opacity() * OPACITE_DECOR_ROND
                )

    def en_decor(self, grille: VGroup) -> VGroup:
        """
        Une COPIE de la grille, passée au décor.

        `set_opacity` uniforme ne convient pas : il donnerait la même force à
        une case encrée et à une case vide, et la grille deviendrait un pavé
        gris. Chaque case garde son gris, réduit de sept dixièmes.
        """
        copie = grille.copy()
        for case in copie:
            case.set_fill(opacity=case.get_fill_opacity() * OPACITE_DECOR_ROND)
            case.set_stroke(opacity=case.get_stroke_opacity() * OPACITE_DECOR_ROND)
        return copie

    def animations_effacement(self, sauf=None) -> list:
        """
        Les mêmes changements, joués. À passer à `play` avec l'arrivée du sujet
        — c'est le même geste : ce qui s'efface et ce qui prend sa place.

        Les faisceaux s'animent en groupe, les ronds par `Transform` : un rond
        épargné garde son remplissage, et un rond effacé garde le SIEN, réduit
        de sept dixièmes. Une opacité uniforme effacerait des activations que la
        scène vient d'établir.
        """
        from manim import Transform

        epargnes = set()
        for mob in sauf or []:
            epargnes.update(id(f) for f in mob.get_family())

        animations = []
        for faisceau in self.faisceaux:
            restants = VGroup(*[t for t in faisceau if id(t) not in epargnes])
            if len(restants):
                animations.append(
                    restants.animate.set_stroke(opacity=OPACITE_DECOR_TRAIT)
                )
        for colonne in self.colonnes:
            cibles = colonne.ronds.copy()
            change = False
            for rond, cible in zip(colonne.ronds, cibles):
                if id(rond) in epargnes:
                    continue
                cible.set_stroke(opacity=OPACITE_DECOR_ROND)
                cible.set_fill(opacity=rond.get_fill_opacity() * OPACITE_DECOR_ROND)
                change = True
            if change:
                animations.append(Transform(colonne.ronds, cibles))
            for accessoire in (getattr(colonne, "accolade", None),
                               getattr(colonne, "suspension", None)):
                if accessoire is not None and id(accessoire) not in epargnes:
                    animations.append(
                        accessoire.animate.set_opacity(OPACITE_DECOR_ROND)
                    )
        animations.append(
            self.etiquettes_sortie.animate.set_opacity(OPACITE_DECOR_ROND)
        )
        if self.montrer_grille:
            animations.append(Transform(self.grille, self.en_decor(self.grille)))
        return animations

    def poser_sujet(self, mobject, cote: float = COTE_SUJET, centre=None):
        """
        Le sujet, mis à sa taille et posé au centre de l'espace dégagé.

        `cote` est sa hauteur en unités : 5,4 par défaut, soit 68 % de la
        hauteur du cadre, bien au-dessus des 40 % que la règle demande. Le
        centre par défaut laisse libre la bande des nombres, à droite de
        `X_LIBRE`, et tient la demi-unité de marge de tous les côtés.
        """
        mobject.set(height=cote)
        mobject.move_to([(X_GRILLE + X_LIBRE) / 2.0 - 0.2, 0.0, 0.0]
                        if centre is None else centre)
        return mobject

    def _vague(self, faisceau: int, duree: float = 1.0):
        """
        La cascade de la source, en brique : une copie du faisceau se crée puis
        s'efface, de gauche à droite.
        """
        from manim import ShowPassingFlash

        copie = self.faisceaux[faisceau].copy()
        copie.set_stroke(BRIQUE, opacity=0.55, width=1.1)
        return ShowPassingFlash(copie, run_time=duree, time_width=0.6, lag_ratio=0.002)

    def pixels_vers_couche(self, image: np.ndarray, duree: float = 3.0) -> None:
        """
        Les cases encrées s'envolent vers leur rond de la colonne d'entrée ; les
        cases vides restent. C'est le geste de la source, avec son seuil : une
        case dont l'octet est nul ne porte rien et ne bouge pas.

        Les 784 cases ne peuvent pas voler séparément sans faire durer la scène
        une minute : elles partent par paquets, dans l'ordre des rangs, ce qui
        garde lisible le fait que le rang 1 arrive en haut et le rang 784 en bas.

        CHAQUE CASE VA À SON RANG, pas au rond montré le plus proche. La colonne
        représente ses 784 rangs de haut en bas ; ceux que le « ⋮ » remplace ont
        une place, et l'encre du milieu de l'image y atterrit. La faire dévier
        vers un rond montré ferait croire que ce rond la reçoit.
        """
        valeurs = np.asarray(image, dtype=float)
        encrees = [k for k in range(784) if valeurs[k] > 0.0]
        if not encrees:
            return
        paquets = 12
        taille = max(1, len(encrees) // paquets)
        temps = duree / paquets
        for depart in range(0, len(encrees), taille):
            groupe = VGroup()
            for k in encrees[depart:depart + taille]:
                copie = self.grille[k].copy()
                copie.generate_target()
                copie.target.move_to([X_ENTREE, self.entree.y_du_rang(k), 0])
                copie.target.set_opacity(0.0)
                copie.target.scale(0.2)
                groupe.add(copie)
            self.add(groupe)
            from manim import MoveToTarget

            self.play(
                *[MoveToTarget(c) for c in groupe],
                run_time=temps,
                lag_ratio=0.0,
            )
            self.remove(groupe)

    def propagation(self, indice: int, duree_totale: float = 8.0) -> dict:
        """
        Une image traverse le réseau. Rend le cache des activations, pour que la
        scène puisse en afficher les nombres — jamais recalculés ailleurs.

        L'ordre est celui de la source, et il n'est pas décoratif : l'image
        arrive, la couche d'entrée se remplit, chaque faisceau s'illumine avant
        la couche qu'il alimente, et le cadre ne tombe qu'à la fin.
        """
        image = self.poser_image(indice)
        cache = avant(self.theta, image, self.activation)

        self.play(FadeIn(self.grille), run_time=0.6)
        self.pixels_vers_couche(image, duree=2.4)

        self.play(
            Transform(self.entree.ronds, self.entree.allumer(image)),
            run_time=0.6,
        )

        couches = len(self.tailles) - 1
        reste = max(1.2, duree_totale - 4.6)
        par_couche = reste / couches
        for indice_couche in range(1, couches + 1):
            activations = cache[f"A{indice_couche}"]
            colonne = self.colonnes[indice_couche]
            self.play(
                self._vague(indice_couche - 1, duree=par_couche),
                Transform(colonne.ronds, colonne.allumer(activations)),
                run_time=par_couche,
            )

        gagnant = int(np.argmax(cache[f"A{couches}"]))
        self.cadre = self._cadre_sortie(gagnant)
        self.play(Create(self.cadre), run_time=0.7)
        return cache

    def _cadre_sortie(self, k: int):
        from manim import SurroundingRectangle

        rond = self.sortie.rond_du_rang(k)
        return SurroundingRectangle(
            VGroup(rond, self.etiquettes_sortie[k]),
            color=BRIQUE,
            stroke_width=TRAIT_COTE,
            buff=0.06,
            corner_radius=0.0,
        )

    def gabarit(self, k: int, duree: float = 6.0) -> np.ndarray:
        """
        Les poids qui arrivent au neurone de sortie `k` se détachent, se
        rassemblent en une ligne, puis se replient en grille 28 x 28.

        C'EST L'APLATISSEMENT JOUÉ À L'ENVERS, et c'est voulu : la page 3 a
        déplié une grille en ligne, la page 4 replie une ligne en grille. Le
        même mouvement, sur un autre objet.

        L'échelle est divergente et symétrique autour de zéro : brique pour le
        positif, bleu pour le négatif, opacité proportionnelle à |w| / max|W_k|.
        Un zéro est donc invisible, et deux poids opposés ont la même force.
        """
        W = self.theta["W1"] if len(self.tailles) == 2 else self.theta[
            f"W{len(self.tailles) - 1}"
        ]
        ligne = np.asarray(W[k], dtype=float)
        if ligne.size != 784:
            raise ValueError(
                "gabarit() replie une ligne de 784 poids ; celle-ci en a "
                f"{ligne.size}. Une scène qui veut le gabarit d'un neurone de "
                "sortie doit poser tailles = (784, 10)."
            )

        traits = self.traits_vers(k)
        self.en_evidence(traits, faisceau=-1)
        self.wait(0.3)

        # LES ARÊTES PASSENT LEURS POIDS À LA BANDE, PUIS S'EFFACENT. C'est le
        # même geste, et il tient la règle de composition : dès que la ligne des
        # 784 poids existe, elle est le sujet, et le réseau n'a plus à être lu.
        # Le laisser à pleine opacité donnait 24 diagonales en travers du
        # gabarit — ce que le crible relève sous « traits sur image ».
        bande = self._bande(ligne)
        epargnes = [self.sortie.rond_du_rang(k)]
        if k < len(self.etiquettes_sortie):
            epargnes.append(self.etiquettes_sortie[k])
        self.play(
            FadeIn(bande),
            *self.animations_effacement(sauf=[m for m in epargnes if m is not None]),
            run_time=duree * 0.25,
        )

        grille_poids = self._grille_poids(ligne)
        self.play(Transform(bande, grille_poids), run_time=duree * 0.55)
        self.gabarit_mob = bande
        self.wait(duree * 0.2)
        return ligne

    def _couleur_poids(self, valeur: float, haut: float) -> tuple[str, float]:
        couleur = BRIQUE if valeur >= 0 else "#2E5E8C"
        return couleur, min(1.0, abs(valeur) / haut if haut > 0 else 0.0)

    def _bande(self, ligne: np.ndarray) -> VGroup:
        """Les 784 poids en une bande d'une case de haut, sous le réseau."""
        largeur = 10.4
        cote = largeur / 784.0
        haut = float(np.abs(ligne).max())
        bande = VGroup()
        for k, valeur in enumerate(ligne):
            couleur, opacite = self._couleur_poids(float(valeur), haut)
            case = Square(side_length=cote, stroke_width=0.0)
            case.set_fill(couleur, opacity=opacite)
            case.move_to([-largeur / 2 + (k + 0.5) * cote, -3.3, 0])
            bande.add(case)
        return bande

    def _grille_poids(self, ligne: np.ndarray, centre=None,
                      cote_total: float = 3.0) -> VGroup:
        """La même ligne, repliée en 28 x 28."""
        centre = [1.2, 0.3, 0] if centre is None else centre
        cote = cote_total / 28.0
        haut = float(np.abs(ligne).max())
        grille = VGroup()
        for k, valeur in enumerate(ligne):
            i, j = divmod(k, 28)
            couleur, opacite = self._couleur_poids(float(valeur), haut)
            case = Square(side_length=cote, stroke_width=0.0)
            case.set_fill(couleur, opacity=opacite)
            case.move_to(
                [
                    centre[0] - cote_total / 2 + (j + 0.5) * cote,
                    centre[1] + cote_total / 2 - (i + 0.5) * cote,
                    0,
                ]
            )
            grille.add(case)
        return grille


__all__ = [
    "COTE_GRILLE",
    "COTE_SUJET",
    "HAUTEUR_SORTIE",
    "MARGE",
    "OPACITE_DECOR_ROND",
    "OPACITE_DECOR_TRAIT",
    "PART_DU_SUJET",
    "RAYON_SORTIE_MINIMAL",
    "Y_COTE_DESSOUS",
    "facteur_ecart",
    "Colonne",
    "OPACITE_EVIDENCE",
    "OPACITE_VOILE",
    "POIDS",
    "ReseauScene",
    "SEUIL_ROND_PX",
    "X_CACHEE",
    "X_ENTREE",
    "X_GRILLE",
    "X_LIBRE",
    "X_SORTIE",
    "abreger",
    "avant",
    "charger_modele",
    "charger_test",
    "px_par_unite",
]
