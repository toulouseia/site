"""
Le crible des scènes : recouvrements, débordements, symboles en ASCII, textes
trop petits. Il ne rend aucune image et n'écrit aucun fichier de média.

    python animations/collisions.py scenes/panorama
    python animations/collisions.py scenes/panorama/boutons.py --pas 0.25
    python animations/collisions.py scenes/panorama --json releve.json

COMMENT IL S'EXÉCUTE SANS RENDRE. `Scene.render()` appelle le renderer image
par image et ouvre un writer de fichiers. On ne l'appelle jamais : la scène est
construite à la main — `setup()` puis `construct()` — et `Scene.play` est
remplacé par une boucle qui interpole les animations sur une grille de temps et
lit les positions. Rien n'est rasterisé. Une scène de vingt secondes se sonde
en une seconde, contre plusieurs minutes de rendu.

LES BOÎTES. Le brief annonçait `get_bounding_box()`. Dans ManimCE 0.21 avec le
renderer cairo, cette méthode est un accesseur déprécié vers un attribut
`bounding_box` qui n'existe que sur les mobjects OpenGL : elle lève
AttributeError. La boîte se prend donc par `get_corner(DL)` et `get_corner(UR)`,
qui sont les coins que le renderer utilise lui-même.

DEUX MESURES, PAS UNE. Entre deux textes, on croise les boîtes : c'est le cas
« surfaLOe(m²) », deux mots qui s'écrasent. Entre un texte et une forme, croiser
les boîtes ne veut rien dire — la boîte d'une droite diagonale couvre tout son
rectangle, et une étiquette posée loin d'elle serait signalée. On teste alors
les POINTS de la forme contre la boîte du texte : une étiquette n'est en faute
que si le tracé lui passe réellement dessus. C'est ce qui attrape « 50 m² ·
2 p. · 200 » posé sur la droite du modèle.

CE QU'IL NE VOIT PAS, et que le contrôle visuel doit voir : deux textes très
proches sans se toucher restent illisibles, et un titre rendu sans espaces a une
boîte parfaitement normale. Le relevé des tailles est là pour ça — sous
TAILLE_LISIBLE, la fonte système compose les espaces à la largeur arrondie
inférieure et les mots se collent.
"""

from __future__ import annotations

import argparse
import importlib
import json
import re
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
if str(ICI) not in sys.path:
    sys.path.insert(0, str(ICI))

# ── Les seuils, tous mesurés ────────────────────────────────────────────────

PAS_PAR_DEFAUT = 0.5

# Deux boîtes qui se frôlent sur moins de deux centièmes d'unité ne se
# recouvrent pas : c'est l'épaisseur d'un trait.
JEU = 0.02

# Un objet dont l'opacité est tombée sous ce seuil est en train de disparaître.
# Le croisement qu'il produit pendant sa dernière demi-seconde n'existe pas
# pour un spectateur.
OPACITE_MINIMALE = 0.15

# En deçà, la fonte système arrondit la chasse de l'espace vers le bas et les
# mots se collent : « la note du jeu de paramètres » devient « la notedu jeu
# deparamètres ». Mesuré taille par taille, voir le rapport de la passe.
TAILLE_LISIBLE = 24

# ── Un trait sur une image ──────────────────────────────────────────────────
#
# « Deux formes ont le droit de se toucher » vaut pour deux TRACÉS : deux
# droites qui se croisent, une courbe qui coupe un axe. Elle ne vaut pas pour
# un trait posé sur une SURFACE. Une grille de poids traversée par sept cent
# quatre-vingt-quatre arêtes à pleine opacité n'est plus lisible, et aucune
# boîte ne le dit : les boîtes se contiennent proprement.
#
# Mesuré sur `le-gabarit-du-0` à 12 s, avant correction : la grille 28 × 28 au
# centre, les arêtes brique du faisceau par-dessus.

# Un trait plus pâle que cela passe derrière l'image sans la salir. Le voile du
# réseau, à 0,08, est en dessous ; une arête en évidence, à 0,9, est au-dessus.
OPACITE_TRAIT = 0.3

# Une case remplie sous cette opacité ne fait pas surface.
REMPLISSAGE_MINIMAL = 0.2

# À partir de combien de cases remplies un groupe EST une image. Une grille
# 28 × 28 en a 784, un damier de contrôle en a 64, un cadre plein en a une.
CASES_POUR_UNE_IMAGE = 16

# Une surface d'un seul tenant doit couvrir au moins cela pour compter : sous
# une demi-unité carrée, c'est une pastille, pas une image. Le seuil est calé
# sur ce que le chapitre 2 dessine : un rond de sortie allumé fait 0,36 unité
# carrée de boîte et n'est pas une image — c'est un neurone, et le faisceau qui
# l'atteint est ce qu'on vient regarder. Une grille 28 × 28 en fait vingt et
# une.
AIRE_MINIMALE = 0.5

# Le retrait appliqué à la boîte de l'image avant de tester. Un trait qui
# s'arrête sur le bord la longe, il ne la traverse pas.
RETRAIT_IMAGE = 0.10

# La part de sa boîte qu'un groupe doit remplir pour être une image. Une grille
# de cases jointives la remplit ; une colonne de ronds n'en couvre qu'un
# centième, et un réseau entier moins encore.
DENSITE_MINIMALE = 0.5

# Au-delà de ce rapport entre ses côtés, un groupe de cases est une bande ou une
# colonne, pas une image : les 784 poids étalés sur une ligne, les dix ronds de
# sortie empilés. On ne protège pas une bande — elle n'a rien à lire.
ELANCEMENT_MAXIMAL = 4.0

# Au-dessus, une surface est PLEINE : ce qui passe derrière elle ne se voit pas.
OPACITE_OPAQUE = 0.9

# ── La marge ────────────────────────────────────────────────────────────────
#
# AUCUN OBJET NE TOUCHE LE BORD. Un débordement se voit — l'objet est coupé —,
# mais un objet qui s'arrête à deux centièmes du bord ne se voit pas au relevé
# et se voit à l'écran : la figure paraît poussée hors du cadre. La demi-unité
# est celle du chapitre 2 ; les chapitres qui ne s'en réclament pas lisent cette
# ligne comme une information, elle ne les met pas en faute.
MARGE = 0.5

# Combien de points on prend le long d'un trait pour ce test-ci. Vingt-quatre
# suffisent : on cherche à savoir si le trait ENTRE dans une surface, pas où
# il la coupe, et un millier d'arêtes se sondent à chaque instant.
POINTS_DU_TRAIT = 24

TEXTES = ("Text", "MarkupText", "Tex", "MathTex", "SingleStringMathTex",
          "DecimalNumber", "Integer", "Variable")

# LE LATEX N'EST PAS DE L'ASCII DE SUBSTITUTION. Dans `MathTex`, `x_1` et `x^2`
# SONT la façon d'écrire un vrai indice et un vrai exposant : les règles de la
# R8 ne s'y appliquent pas, elles s'appliquent au texte composé par Pango.
LATEX = ("Tex", "MathTex", "SingleStringMathTex", "DecimalNumber", "Integer")

# Les formes FERMÉES peuvent légitimement contenir un texte : la règle 7
# l'autorise — « un texte dans son cadre, une cote dans sa bulle ». Un trait,
# une flèche, une courbe ne contiennent rien : un texte posé dessus est en
# faute, même si la boîte du tracé l'englobe.
# `SurroundingRectangle` en fait partie : c'est un `Rectangle`, mais son nom de
# classe est le sien, et un test par nom le manquait. Un cadre posé autour d'une
# case n'est ni un texte couché sur un tracé, ni un trait en travers d'une
# image — c'est l'annotation même que les scènes emploient pour désigner.
FERMEES = ("Square", "Rectangle", "RoundedRectangle", "Circle", "Ellipse",
           "Polygon", "RegularPolygon", "Annulus", "Triangle",
           "SurroundingRectangle", "Cutout", "Cross")

# UNE ACCOLADE N'EST PAS UNE IMAGE. Elle est pleine, et sa boîte est étroite :
# elle passe donc le test de densité, et les arêtes qui la croisent seraient
# comptées comme salissant une image. C'est un signe de ponctuation, pas une
# surface qu'on lit.
PAS_UNE_IMAGE = ("Brace", "BraceLabel", "BraceBetweenPoints", "Underline",
                 "Arrow", "Vector", "DoubleArrow")


# ── Les substituts typographiques que la règle 8 interdit ───────────────────

ASCII_INTERDIT = [
    (re.compile(r"[A-Za-zθ]_[A-Za-z0-9]"), "indice écrit avec un souligné"),
    (re.compile(r"\^"), "exposant écrit avec un accent circonflexe"),
    (re.compile(r"\bm2\b"), "m2 au lieu de m²"),
    (re.compile(r"\.\.\."), "trois points au lieu de …"),
    (re.compile(r"(?i)\b(theta|alpha|beta|gamma|sigma|delta|lambda|"
                r"epsilon|mu|eta|phi|nabla)\b"), "lettre grecque épelée"),
    (re.compile(r"(?<![\w²³⁻])-\d"), "trait d'union en guise de signe moins"),
    (re.compile(r"\b[a-zA-Z][0-9]\b"), "indice écrit en chiffre de plein pied"),
]


def substituts(texte: str) -> list[str]:
    """Les substituts typographiques d'une chaîne affichée."""
    return [motif for regle, motif in ASCII_INTERDIT if regle.search(texte)]


# ── Le relevé d'un instant ──────────────────────────────────────────────────


def _visible(mobject) -> bool:
    """
    Un objet en train de disparaître ne recouvre plus rien.

    L'opacité se lit sur toute la FAMILLE et non sur le mobject seul : un `Text`
    est un groupe de glyphes, son opacité propre vaut zéro, et la lire seule
    faisait disparaître du crible tous les textes de la scène.
    """
    for m in mobject.get_family():
        if not m.has_points():
            continue
        for lecteur in ("get_fill_opacity", "get_stroke_opacity"):
            fonction = getattr(m, lecteur, None)
            if fonction is None:
                continue
            try:
                if float(fonction()) >= OPACITE_MINIMALE:
                    return True
            except Exception:  # noqa: BLE001 — un mobject sans remplissage
                continue
    return False


def _texte_de(mobject) -> str | None:
    """Ce qu'un mobject de texte affiche, tel qu'il l'affiche."""
    # `original_text` d'abord : ManimCE recompose `text` sans ses espaces, et
    # c'est le texte demandé par la scène qu'on veut relire, pas le texte
    # compacté par Pango.
    for attribut in ("original_text", "tex_string", "text"):
        valeur = getattr(mobject, attribut, None)
        if isinstance(valeur, str) and valeur:
            return valeur
    if type(mobject).__name__ in ("DecimalNumber", "Integer"):
        try:
            return mobject.get_value.__self__._get_num_string(mobject.get_value())
        except Exception:  # noqa: BLE001
            return str(getattr(mobject, "number", ""))
    return None


def feuilles(mobjects) -> list:
    """
    Les objets à comparer : un texte est atomique — on ne descend pas dans ses
    lettres —, un groupe se traverse, tout le reste est une feuille.
    """
    trouvees = []
    pile = list(mobjects)
    while pile:
        m = pile.pop()
        if len(m.get_all_points()) == 0:
            continue
        if type(m).__name__ in TEXTES:
            trouvees.append(m)
            continue
        if m.submobjects:
            pile.extend(m.submobjects)
            if len(m.points) > 0:
                trouvees.append(m)
            continue
        trouvees.append(m)
    return trouvees


def boite(mobject) -> tuple[float, float, float, float] | None:
    """(gauche, bas, droite, haut). Voir l'en-tête pour get_bounding_box()."""
    from manim import DL, UR  # type: ignore[import-not-found]

    # `has_points()` ne regarde que les points PROPRES : un `Text` n'en a
    # aucun, ses glyphes en ont. Sans la famille, tous les textes de la scène
    # sortaient du crible.
    if len(mobject.get_all_points()) == 0:
        return None
    bas_gauche = mobject.get_corner(DL)
    haut_droit = mobject.get_corner(UR)
    return (float(bas_gauche[0]), float(bas_gauche[1]),
            float(haut_droit[0]), float(haut_droit[1]))


def _croisent(a, b) -> tuple[float, float] | None:
    """Le recouvrement de deux boîtes, en largeur et en hauteur."""
    largeur = min(a[2], b[2]) - max(a[0], b[0])
    hauteur = min(a[3], b[3]) - max(a[1], b[1])
    if largeur > JEU and hauteur > JEU:
        return (largeur, hauteur)
    return None


def _voisines(a, b, marge: float = 0.05) -> bool:
    """
    Deux boîtes se touchent-elles, à une marge près ?

    `_croisent` exige un recouvrement STRICT dans les deux dimensions, ce qu'une
    boîte plate ne peut jamais offrir : un trait horizontal a une hauteur nulle.
    Ce test-ci sert au tri de voisinage, et il doit les laisser passer.
    """
    return (min(a[2], b[2]) >= max(a[0], b[0]) - marge
            and min(a[3], b[3]) >= max(a[1], b[1]) - marge)


def _contenu(petit, grand) -> bool:
    """Le petit est-il dans le grand ? La règle 7 l'autorise explicitement."""
    return (petit[0] >= grand[0] - JEU and petit[1] >= grand[1] - JEU
            and petit[2] <= grand[2] + JEU and petit[3] <= grand[3] + JEU)


# Combien de points on prend LE LONG d'un tracé. Les points de contrôle ne
# suffisent pas : une droite n'en a que quatre, tous à ses extrémités, et une
# étiquette posée en plein milieu n'en contenait aucun. C'est ce qui faisait
# manquer au crible « 50 m² · 2 p. · 200 » couché sur la droite du modèle.
ECHANTILLONS = 96


def echantillonner(forme) -> list[tuple[float, float]]:
    """
    Le tracé, rendu en points, extrémités comprises.

    LE PAS EST CONSTANT, PAS LE NOMBRE DE POINTS. Quatre-vingt-seize points sur
    le côté d'une case de grille, il y en a quatre-vingt-dix de trop, et une
    scène qui en compte deux mille ne se sonde plus. On vise un point tous les
    quatre centièmes d'unité — plus fin que la hauteur de n'importe quel texte,
    donc sans angle mort — et on plafonne.
    """
    cadre = boite(forme)
    if cadre is None:
        return []
    etendue = (cadre[2] - cadre[0]) + (cadre[3] - cadre[1])
    combien = min(ECHANTILLONS, max(6, int(etendue / 0.04)))
    points = []
    try:
        for k in range(combien + 1):
            x, y, _ = forme.point_from_proportion(k / combien)
            points.append((float(x), float(y)))
    except Exception:  # noqa: BLE001 — un mobject sans longueur parcourable
        try:
            points = [(float(x), float(y)) for x, y, _ in forme.get_all_points()]
        except Exception:  # noqa: BLE001
            return []
    return points


def _points_dans(points, cadre) -> int:
    """Combien de points du tracé tombent dans la boîte du texte."""
    return sum(1 for x, y in points
               if cadre[0] < x < cadre[2] and cadre[1] < y < cadre[3])


def _nommer(mobject) -> str:
    nom = type(mobject).__name__
    texte = _texte_de(mobject)
    if texte:
        court = texte if len(texte) <= 42 else f"{texte[:39]}…"
        return f'{nom} « {court} »'
    return nom


# ── Un trait sur une image ──────────────────────────────────────────────────


def _lire(mobject, lecteur: str) -> float:
    fonction = getattr(mobject, lecteur, None)
    if fonction is None:
        return 0.0
    try:
        return float(fonction())
    except Exception:  # noqa: BLE001 — un mobject sans cette propriété
        return 0.0


def _rempli(mobject) -> bool:
    return (mobject.has_points()
            and _lire(mobject, "get_fill_opacity") >= REMPLISSAGE_MINIMAL)


def _est_une_image(mobject, cadre) -> bool:
    """
    Ce groupe est-il une image — une grille de cases — ou autre chose ?

    TROIS MESURES, ET IL FAUT LES TROIS.

    1. SES ENFANTS DIRECTS SONT DES CASES. Seize au moins, toutes des feuilles.
       Le réseau entier n'a que trois enfants — les faisceaux, les colonnes, les
       étiquettes — et descendre d'un cran donne des groupes, pas des cases.

    2. ELLES COUVRENT SA BOÎTE. On somme les boîtes des cases, remplies ou non :
       une grille de poids est SPARSE — la plupart de ses cases sont presque
       transparentes — et ne compter que les cases encrées la ferait passer pour
       une constellation. C'est ce qui a failli faire manquer le cas même qui a
       motivé ce test.

    3. ELLE N'EST PAS UNE BANDE. Une colonne de dix ronds jointifs couvre sa
       boîte et compte dix enfants ; une bande de 784 cases sur une ligne aussi.
       Ni l'une ni l'autre n'est une image qu'on lit : le rapport de leurs côtés
       les trahit.
    """
    cases = [f for f in mobject.submobjects if not f.submobjects and f.has_points()]
    if len(cases) < CASES_POUR_UNE_IMAGE:
        return False
    if sum(1 for f in cases if _rempli(f)) < CASES_POUR_UNE_IMAGE:
        return False
    largeur, hauteur = cadre[2] - cadre[0], cadre[3] - cadre[1]
    if min(largeur, hauteur) <= 0:
        return False
    if max(largeur, hauteur) / min(largeur, hauteur) > ELANCEMENT_MAXIMAL:
        return False
    couverte = 0.0
    for f in cases:
        c = boite(f)
        if c is not None:
            couverte += (c[2] - c[0]) * (c[3] - c[1])
    return couverte / (largeur * hauteur) >= DENSITE_MINIMALE


def _opaque(mobject) -> bool:
    """Une surface pleine cache ce qui passe derrière elle ; une pâle, non."""
    opacites = [_lire(f, "get_fill_opacity") for f in mobject.get_family()
                if _rempli(f)]
    if not opacites:
        return False
    return sum(opacites) / len(opacites) >= OPACITE_OPAQUE


def surfaces(mobjects) -> list:
    """
    Les objets qu'un trait ne doit pas traverser : les images.

    UN GROUPE DE CASES EST UNE IMAGE, PAS 784 CARRÉS. On descend l'arbre et on
    s'arrête au premier nœud dont la famille compte assez de cases remplies ET
    qui remplit vraiment sa boîte : c'est la grille, et c'est elle qu'on
    protège. Descendre plus bas donnerait sept cent quatre-vingt-quatre
    signalements pour une seule faute, et le relevé serait illisible — donc
    inutile.
    """
    trouvees = []
    pile = list(mobjects)
    while pile:
        m = pile.pop()
        if len(m.get_all_points()) == 0 and not m.submobjects:
            continue
        if type(m).__name__ in TEXTES or type(m).__name__ in PAS_UNE_IMAGE:
            continue
        cadre = boite(m)
        if cadre is not None and _est_une_image(m, cadre):
            trouvees.append((m, cadre))
            continue  # on ne descend pas dans une image
        if m.submobjects:
            pile.extend(m.submobjects)
            continue
        if _rempli(m) and cadre is not None:
            if (cadre[2] - cadre[0]) * (cadre[3] - cadre[1]) >= AIRE_MINIMALE:
                trouvees.append((m, cadre))
    return trouvees


def rang_de_dessin(mobjects) -> dict:
    """
    L'ordre dans lequel Manim dessine. Le dernier passe devant.

    Il sert à une seule exception, mais elle est nette : une surface PLEINE
    posée par-dessus un trait le cache pour de bon. La case d'activation de la
    page 8 est de celles-là — un carré papier plein, posé dans le faisceau pour
    le percer. Les vingt-six arêtes qui passent derrière elle ne se voient pas.
    Une surface pâle, elle, ne cache rien : le gabarit du 0 laisse voir toutes
    les arêtes au travers, et c'est bien une faute.
    """
    rang: dict[int, int] = {}
    for m in mobjects:
        for f in m.get_family():
            rang.setdefault(id(f), len(rang))
    return rang


def _est_un_trait(mobject) -> bool:
    """
    Un tracé appuyé, sans remplissage, et qui n'entoure rien.

    Les formes fermées sont exclues : un cadre qui entoure un rond de sortie
    n'est pas un trait qui traverse une image, et la règle 7 l'autorise déjà.
    """
    nom = type(mobject).__name__
    if nom in TEXTES or nom in FERMEES:
        return False
    if not mobject.has_points():
        return False
    if _lire(mobject, "get_fill_opacity") >= REMPLISSAGE_MINIMAL:
        return False
    return (_lire(mobject, "get_stroke_opacity") > OPACITE_TRAIT
            and _lire(mobject, "get_stroke_width") > 0.0)


def _points_du_trait(mobject, combien: int = POINTS_DU_TRAIT) -> list:
    """
    Le trait en points, par interpolation de ses points de contrôle.

    `echantillonner` passe par `point_from_proportion`, exact mais coûteux :
    mille arêtes fois vingt-quatre points, à chaque instant sondé, ce n'est pas
    tenable. Les points de contrôle d'une droite sont alignés, l'interpolation
    linéaire y est exacte, et sur une courbe elle suffit à dire si le tracé
    entre dans une boîte.
    """
    try:
        bruts = [(float(p[0]), float(p[1])) for p in mobject.get_all_points()]
    except Exception:  # noqa: BLE001
        return []
    if len(bruts) < 2:
        return bruts
    points = []
    segments = len(bruts) - 1
    for k in range(combien + 1):
        position = k * segments / combien
        indice = min(int(position), segments - 1)
        t = position - indice
        (x1, y1), (x2, y2) = bruts[indice], bruts[indice + 1]
        points.append((x1 + t * (x2 - x1), y1 + t * (y2 - y1)))
    return points


def _traverse(points, cadre) -> bool:
    """Le trait entre-t-il dans l'image, retrait fait ?"""
    largeur, hauteur = cadre[2] - cadre[0], cadre[3] - cadre[1]
    dedans = (cadre[0] + largeur * RETRAIT_IMAGE, cadre[1] + hauteur * RETRAIT_IMAGE,
              cadre[2] - largeur * RETRAIT_IMAGE, cadre[3] - hauteur * RETRAIT_IMAGE)
    return _points_dans(points, dedans) >= 2


def releve(scene, instant: float, section: str, sortie: dict) -> None:
    """Un instant de la scène : recouvrements, débordements, tailles, textes."""
    from manim import config  # type: ignore[import-not-found]

    demi_l = config.frame_width / 2.0
    demi_h = config.frame_height / 2.0

    bruts = []
    for m in feuilles(scene.mobjects):
        if not _visible(m):
            continue
        cadre = boite(m)
        if cadre is None:
            continue
        bruts.append((m, cadre, type(m).__name__ in TEXTES))

    # ÉCHANTILLONNER COÛTE, ET NE SERT QUE PRÈS D'UN TEXTE. Un tracé dont la
    # boîte ne rencontre aucune boîte de texte ne peut passer sous aucun : on
    # ne parcourt pas son chemin. Sans ce tri, les cent hachures d'un pavé se
    # parcouraient à chaque demi-seconde pour rien.
    cadres_textes = [c for _, c, est_texte in bruts if est_texte]
    objets = []
    for m, cadre, est_texte in bruts:
        if est_texte:
            objets.append((m, cadre, True, []))
            continue
        proche = any(_voisines(cadre, ct) for ct in cadres_textes)
        objets.append((m, cadre, False, echantillonner(m) if proche else []))

    for m, cadre, est_texte, _ in objets:
        texte = _texte_de(m)
        if texte:
            fiche = sortie["textes"].setdefault(
                texte, {"tailles": set(), "latex": type(m).__name__ in LATEX})
            fiche["tailles"].add(float(getattr(m, "font_size", 0.0) or 0.0))
        approche = max(-demi_l + MARGE - cadre[0], cadre[2] - demi_l + MARGE,
                       -demi_h + MARGE - cadre[1], cadre[3] - demi_h + MARGE)
        if approche > JEU:
            deja = sortie["marges"].get(_nommer(m))
            if deja is None or approche > deja["mord"]:
                sortie["marges"][_nommer(m)] = {
                    "mord": approche, "boite": [round(v, 2) for v in cadre],
                    "depuis": instant, "section": section,
                }
        if (cadre[0] < -demi_l - JEU or cadre[2] > demi_l + JEU
                or cadre[1] < -demi_h - JEU or cadre[3] > demi_h + JEU):
            deja = sortie["debordements"].get(_nommer(m))
            depasse = max(-demi_l - cadre[0], cadre[2] - demi_l,
                          -demi_h - cadre[1], cadre[3] - demi_h)
            if deja is None or depasse > deja["depasse"]:
                sortie["debordements"][_nommer(m)] = {
                    "depasse": depasse, "boite": [round(v, 2) for v in cadre],
                    "depuis": instant, "section": section,
                    "combien": (deja or {}).get("combien", 0) + 1,
                }
            else:
                deja["combien"] += 1

    for i in range(len(objets)):
        mi, ci, ti, pi = objets[i]
        for j in range(i + 1, len(objets)):
            mj, cj, tj, pj = objets[j]
            if not ti and not tj:
                continue  # deux formes ont le droit de se toucher
            if mi in mj.get_family() or mj in mi.get_family():
                continue
            if ti and tj:
                chevauche = _croisent(ci, cj)
                if not chevauche:
                    continue
                if _contenu(ci, cj) or _contenu(cj, ci):
                    continue
                genre = "texte sur texte"
                mesure = f"{chevauche[0]:.2f} × {chevauche[1]:.2f}"
            else:
                forme, echantillons = (mj, pj) if ti else (mi, pi)
                cadre_texte, cadre_forme = (ci, cj) if ti else (cj, ci)
                if (type(forme).__name__ in FERMEES
                        and _contenu(cadre_texte, cadre_forme)):
                    continue  # un texte dans son cadre : règle 7, l'exception
                dedans = _points_dans(echantillons, cadre_texte)
                if dedans == 0:
                    continue
                genre = "tracé sous texte"
                mesure = f"{dedans} points du tracé"
            cle = (genre, _nommer(mi), _nommer(mj))
            sortie["recouvrements"].setdefault(cle, []).append(
                (instant, section, mesure)
            )

    _traits_sur_images(scene, instant, section, sortie)


def _traits_sur_images(scene, instant: float, section: str, sortie: dict) -> None:
    """
    Les traits appuyés qui traversent une image.

    On garde, par image, le PIRE instant : celui où le plus de traits la
    barrent. Une image traversée par huit cents arêtes pendant une demi-seconde
    et par deux pendant dix secondes a un seul défaut, et c'est le premier.
    """
    images = surfaces(scene.mobjects)
    if not images:
        return
    traits = [m for m in feuilles(scene.mobjects)
              if _est_un_trait(m) and _visible(m)]
    if not traits:
        return

    rang = rang_de_dessin(scene.mobjects)
    for image, cadre_image in images:
        famille = set(id(f) for f in image.get_family())
        devant = _opaque(image)
        rang_image = rang.get(id(image), 0)
        combien = 0
        for trait in traits:
            if id(trait) in famille:
                continue
            if devant and rang.get(id(trait), 0) < rang_image:
                continue  # une surface pleine posée par-dessus le cache
            cadre = boite(trait)
            if cadre is None or not _croisent(cadre, cadre_image):
                continue
            if _traverse(_points_du_trait(trait), cadre_image):
                combien += 1
        if combien == 0:
            continue
        nom = _nommer(image)
        pire = sortie["traits_sur_image"].get(nom)
        if pire is None:
            sortie["traits_sur_image"][nom] = {
                "traits": combien, "instant": instant, "section": section,
                "boite": [round(v, 2) for v in cadre_image],
                "debut": instant, "fin": instant, "releves": 1,
            }
            continue
        pire["releves"] += 1
        pire["debut"] = min(pire["debut"], instant)
        pire["fin"] = max(pire["fin"], instant)
        if combien > pire["traits"]:
            pire.update(traits=combien, instant=instant, section=section,
                        boite=[round(v, 2) for v in cadre_image])


# ── La sonde : jouer une scène sans la rendre ───────────────────────────────


def sonder(classe, pas: float) -> dict:
    """Construit la scène en interpolant ses animations, et relève."""
    from manim import Scene, config  # type: ignore[import-not-found]

    sortie = {"recouvrements": {}, "debordements": {}, "textes": {},
              "traits_sur_image": {}, "marges": {}, "sections": [],
              "duree": 0.0}
    horloge = [0.0]
    section = ["(avant la première section)"]

    def _next_section(self, name=None, *a, **k):  # noqa: ANN001
        section[0] = name or "(sans nom)"
        sortie["sections"].append((round(horloge[0], 2), section[0]))

    def _play(self, *args, **kwargs):  # noqa: ANN001
        for jetable in ("subcaption", "subcaption_duration", "subcaption_offset"):
            kwargs.pop(jetable, None)
        self.compile_animation_data(*args, **kwargs)
        animations = getattr(self, "animations", None)
        if not animations:
            return
        duree = float(self.get_run_time(animations))
        self.begin_animations()
        self.last_t = 0.0
        instant = 0.0
        while instant < duree - 1e-9:
            self.update_to_time(instant)
            releve(self, horloge[0] + instant, section[0], sortie)
            instant += pas
        self.update_to_time(duree)
        releve(self, horloge[0] + duree, section[0], sortie)
        for animation in animations:
            animation.finish()
            animation.clean_up_from_scene(self)
        self.update_mobjects(0)
        horloge[0] += duree

    anciens = (Scene.play, Scene.next_section)
    Scene.play, Scene.next_section = _play, _next_section
    try:
        config.dry_run = True
        scene = classe()
        scene.setup()
        scene.construct()
    finally:
        Scene.play, Scene.next_section = anciens
    sortie["duree"] = round(horloge[0], 2)
    return sortie


# ── Le rapport ──────────────────────────────────────────────────────────────


def declarations(chemin: Path) -> list[dict]:
    """Les déclarations d'un fichier de scènes, lues sans importer Manim."""
    import ast

    arbre = ast.parse(chemin.read_text(encoding="utf-8"))
    for noeud in arbre.body:
        if not isinstance(noeud, ast.Assign):
            continue
        if not any(getattr(c, "id", "") == "ANIMATIONS" for c in noeud.targets):
            continue
        return [d for d in ast.literal_eval(noeud.value) if isinstance(d, dict)]
    return []


def examiner(chemin: Path, pas: float) -> list[dict]:
    """Toutes les scènes d'un fichier."""
    module = importlib.import_module(f"scenes.{chemin.parent.name}.{chemin.stem}")
    resultats = []
    for declaration in declarations(chemin):
        nom = declaration.get("scene")
        classe = getattr(module, nom, None)
        if classe is None:
            resultats.append({"id": declaration.get("id"), "scene": nom,
                              "fichier": chemin.name, "erreur": "classe absente"})
            continue
        try:
            releves = sonder(classe, pas)
        except Exception as erreur:  # noqa: BLE001 — une scène qui casse est un fait
            resultats.append({"id": declaration.get("id"), "scene": nom,
                              "fichier": chemin.name,
                              "erreur": f"{type(erreur).__name__}: {erreur}"})
            continue
        releves.update({"id": declaration.get("id"), "scene": nom,
                        "fichier": chemin.name})
        resultats.append(releves)
    return resultats


def rapporter(resultats: list[dict]) -> list[str]:
    lignes: list[str] = []
    total_r = total_d = total_a = total_p = total_t = total_m = 0
    for r in resultats:
        lignes.append("")
        lignes.append("-" * 78)
        lignes.append(f"{r['id']}   ·   {r['fichier']} / {r.get('scene')}"
                      f"   ·   {r.get('duree', 0):.1f} s")
        lignes.append("-" * 78)
        if "erreur" in r:
            lignes.append(f"  NON SONDÉE — {r['erreur']}")
            continue

        recouvrements = r["recouvrements"]
        total_r += len(recouvrements)
        if not recouvrements:
            lignes.append("  recouvrements     aucun")
        else:
            lignes.append(f"  recouvrements     {len(recouvrements)}")
            for (genre, a, b), moments in sorted(
                recouvrements.items(), key=lambda kv: -len(kv[1])
            ):
                instants = [m[0] for m in moments]
                lignes.append(
                    f"    {genre:<18} {min(instants):5.1f} s → {max(instants):5.1f} s"
                    f"   ({len(moments)} relevés, {moments[0][2]})"
                )
                lignes.append(f"      {a}")
                lignes.append(f"      {b}")

        traversees = r.get("traits_sur_image", {})
        total_t += len(traversees)
        if not traversees:
            lignes.append("  traits sur image  aucun")
        else:
            lignes.append(f"  traits sur image  {len(traversees)}")
            for nom, fait in sorted(traversees.items(),
                                    key=lambda kv: -kv[1]["traits"]):
                g, bas, d, h = fait["boite"]
                lignes.append(
                    f"    {nom:<28} {fait['debut']:5.1f} s → {fait['fin']:5.1f} s"
                    f"   ({fait['releves']} relevés, jusqu'à {fait['traits']}"
                    f" traits à {fait['instant']:.1f} s)"
                )
                lignes.append(f"      boîte ({g}, {bas}) → ({d}, {h})"
                              f"   ·   section « {fait['section']} »")

        marges = r.get("marges", {})
        total_m += len(marges)
        if not marges:
            lignes.append(f"  marge de {MARGE}         tenue")
        else:
            lignes.append(f"  marge de {MARGE}         {len(marges)} objets trop près")
            for nom, fait in sorted(marges.items(), key=lambda kv: -kv[1]["mord"])[:6]:
                g, bas, d, h = fait["boite"]
                lignes.append(
                    f"    {nom:<28} mord de {fait['mord']:.2f} u"
                    f"   dès {fait['depuis']:.1f} s"
                )
                lignes.append(f"      boîte ({g}, {bas}) → ({d}, {h})")

        debordements = r["debordements"]
        total_d += len(debordements)
        if not debordements:
            lignes.append("  débordements      aucun")
        else:
            lignes.append(f"  débordements      {len(debordements)} objets")
            pires = sorted(debordements.items(),
                           key=lambda kv: -kv[1]["depasse"])[:6]
            for nom, fait in pires:
                g, bas, d, h = fait["boite"]
                lignes.append(
                    f"    {nom:<28} sort de {fait['depasse']:.2f} u"
                    f"   dès {fait['depuis']:.1f} s"
                )
                lignes.append(f"      boîte ({g}, {bas}) → ({d}, {h})"
                              f"   ·   section « {fait['section']} »")
            if len(debordements) > len(pires):
                lignes.append(f"    … et {len(debordements) - len(pires)} autres")

        fautes = {}
        petits = []
        for texte, fiche in r["textes"].items():
            if fiche["latex"]:
                continue
            trouves = substituts(texte)
            if trouves:
                fautes[texte] = trouves
            # Le MAXIMUM relevé, et non le minimum : pendant un `Write` le
            # texte n'est dessiné qu'en partie, sa hauteur est plus petite et
            # `font_size` la reflète. La taille voulue est celle du texte posé.
            taille = max(fiche["tailles"]) if fiche["tailles"] else 0.0
            # Seuls les textes de PLUSIEURS MOTS sont concernés : le seuil vaut
            # pour la chasse de l'espace, et une cote d'un seul nombre n'en a
            # pas.
            if " " in texte.strip() and 0.0 < taille < TAILLE_LISIBLE - 0.05:
                petits.append((taille, texte))
        total_a += len(fautes)
        total_p += len(petits)
        if not fautes:
            lignes.append("  symboles ASCII    aucun")
        else:
            lignes.append(f"  symboles ASCII    {len(fautes)}")
            for texte, motifs in fautes.items():
                court = texte if len(texte) <= 46 else f"{texte[:43]}…"
                lignes.append(f"    « {court} »   —   {', '.join(motifs)}")
        if petits:
            lignes.append(f"  textes sous {TAILLE_LISIBLE}     {len(petits)}")
            for taille, texte in sorted(petits):
                court = texte if len(texte) <= 46 else f"{texte[:43]}…"
                lignes.append(f"    {taille:5.1f}   « {court} »")
        else:
            lignes.append(f"  textes sous {TAILLE_LISIBLE}     aucun")

    lignes.insert(0, f"{len(resultats)} scènes sondées   ·   "
                     f"{total_r} recouvrements   ·   {total_t} traits sur image"
                     f"   ·   {total_m} marges mordues"
                     f"   ·   {total_d} débordements   ·   "
                     f"{total_a} textes en ASCII   ·   "
                     f"{total_p} textes sous {TAILLE_LISIBLE}")
    return lignes


def main() -> None:
    analyseur = argparse.ArgumentParser(
        description="Recouvrements et composition, sans rendre d'image.")
    analyseur.add_argument("cible", help="un fichier de scènes, ou un répertoire")
    analyseur.add_argument("--pas", type=float, default=PAS_PAR_DEFAUT,
                           help="l'échantillonnage, en secondes")
    analyseur.add_argument("--json", type=Path, default=None,
                           help="où écrire le relevé brut")
    arguments = analyseur.parse_args()

    import logging

    from manim import logger  # type: ignore[import-not-found]

    logger.setLevel(logging.ERROR)

    cible = Path(arguments.cible)
    if not cible.is_absolute():
        cible = (ICI / cible).resolve()
    fichiers = ([cible] if cible.is_file()
                else sorted(f for f in cible.glob("*.py")
                            if f.name != "__init__.py"))
    if not fichiers:
        sys.exit(f"aucun fichier de scènes dans {cible}")

    resultats = []
    for fichier in fichiers:
        print(f"… {fichier.name}", file=sys.stderr)
        resultats.extend(examiner(fichier, arguments.pas))

    sys.stdout.reconfigure(encoding="utf-8")
    print("\n".join(rapporter(resultats)))

    if arguments.json:
        brut = []
        for r in resultats:
            brut.append({
                "id": r.get("id"), "scene": r.get("scene"),
                "fichier": r.get("fichier"), "duree": r.get("duree"),
                "erreur": r.get("erreur"),
                "recouvrements": [
                    {"genre": k[0], "a": k[1], "b": k[2],
                     "instants": [m[0] for m in v], "mesure": v[0][2]}
                    for k, v in r.get("recouvrements", {}).items()],
                "debordements": [
                    {"objet": k, **v} for k, v in r.get("debordements", {}).items()],
                "textes": [
                    {"texte": t, "tailles": sorted(f["tailles"]),
                     "latex": f["latex"],
                     "ascii": [] if f["latex"] else substituts(t)}
                    for t, f in r.get("textes", {}).items()],
            })
        arguments.json.write_text(
            json.dumps(brut, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\nrelevé brut : {arguments.json}", file=sys.stderr)


if __name__ == "__main__":
    main()
