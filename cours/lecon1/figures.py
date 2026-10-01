"""Lecon 1 : les schemas fixes qui remplacent quatre animations.

    python cours/lecon1/figures.py

CE FICHIER NE DESSINE RIEN DE NEUF. Chaque schema est derive d'une scene Manim
supprimee du chapitre, et il en reprend les valeurs sans en inventer une seule :

    l1-fig1-prerequis.svg     <- panorama/cadre.py     LesTroisPrerequis
    l1-fig2-carte.svg         <- panorama/cadre.py     LaCarteDuChapitre
    l1-fig3-apports.svg       <- panorama/intuition.py CeQueLhumainFournit
    l1-fig4-deux-carres.svg   <- panorama/perte.py     LeCarreEmpecheLaCompensation
    l1-fig5-quadrillage.svg   <- panorama/perte.py     LeCarreEmpecheLaCompensation

POURQUOI DU SVG, ET NON DU PNG COMME EN LECON 3. Ces schemas sont des traits et
du texte, pas des courbes echantillonnees : le SVG reste net a toute taille, pese
quelques kilo-octets, et se relit dans un editeur de texte. Il n'exige aucune
bibliotheque, la ou matplotlib serait une dependance de plus pour dessiner des
rectangles.

LA POLICE. Une image SVG servie dans une balise <img> est un document isole :
elle ne voit pas les polices de la page. On demande donc la pile systeme, la
seule qui soit garantie chez le lecteur.

LA PALETTE est celle de animations/scenes/n7ia.py, recopiee ici parce qu'un
fichier Python ne lit pas un autre module sans l'importer, et que ces cinq
valeurs se verifient a l'oeil.
"""

from __future__ import annotations

import sys
from pathlib import Path

# ── La palette, celle de l'identite ─────────────────────────────────────────

ENCRE = "#14120F"
PAPIER = "#FFFFFF"
BRIQUE = "#A8442A"
GRIS_14 = "#E4E1DC"
GRIS_24 = "#D2CEC8"
GRIS_40 = "#ADA8A0"
GRIS_58 = "#7E7972"

# L'encre a opacite reduite, les memes trois valeurs que animations/scenes/
# n7ia.py : le repos se rend en encre palie, jamais en gris clair. 0,30 est le
# plancher, rien de ce qui doit se lire ne descend dessous.
ENCRE_30 = "#B9B8B7"
ENCRE_55 = "#7E7D7B"
ENCRE_75 = "#4F4D4B"

POLICE = (
    "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
)

SORTIE = Path(__file__).resolve().parents[2] / "public" / "cours" / "lecon1"
# ── La taille minimale d'un texte de figure ─────────────────────────────────
#
# LA MESURE, refaisable en deux `grep`. Le corps d'une leçon est composé à
# `text-[0.9375rem]`, soit 15 px : src/composants/academy/blocs/prose.tsx.
# L'article qui le porte est en `max-w-[44rem]` avec `lg:px-8`, donc une
# colonne de 44 x 16 - 2 x 32 = 640 px — la meme largeur que celle sur laquelle
# outils/mesurer-pave.mjs compte les lignes rendues. Une figure y est servie en
# `w-full` (src/composants/academy/blocs/Statiques.tsx, BImage), et un SVG large
# de 1380 s'y affiche donc reduit de 1380 / 640 = 2,156.
#
#     TEXTE_MIN = 15 x 1380 / 640 = 32,3  ->  33
#
# Un texte de figure sous 33 s'affiche SOUS le corps de la page. Le lecteur
# passe d'un texte lisible a un texte qui ne l'est pas sans que rien ne le
# previenne : « les images ne sont pas si petites mais tu ecris beaucoup
# dedans ». C'est la regle 32 de REGLES.md.
#
# CE N'EST PAS UN PLANCHER QU'ON PEUT FRANCHIR. `txt` refuse une taille plus
# petite au lieu de la composer : une figure illisible ne se voit pas dans un
# diff, et se voit tres bien chez l'etudiant.
CORPS_PX = 15          # prose.tsx, text-[0.9375rem]
COLONNE_PX = 640       # max-w-[44rem] moins lg:px-8
LARGEUR_SVG = 1380     # toutes les figures du cours
TEXTE_MIN = -(-CORPS_PX * LARGEUR_SVG // COLONNE_PX)   # 33, arrondi au-dessus

# Un indice est compose a 0,68 fois sa base : pour qu'il atteigne le plancher,
# la base part de 33 / 0,68. C'est la taille minimale d'un texte qui porte un
# indice, et la proportion entre les deux reste celle d'un indice.
BASE_INDICE = -(-TEXTE_MIN * 100 // 68)   # 49

# ── L'interligne ────────────────────────────────────────────────────────────
#
# LE CAS QUI L'A PRODUIT est dans ce fichier meme, figure 4 : deux lignes
# posees a y = 372 et y = 396, vingt-quatre pixels d'ecart pour des caracteres
# de trente-trois. Les ordonnees avaient ete ecrites a la main du temps ou le
# texte en faisait seize ; la passe qui a remonte les tailles au plancher de la
# regle 32 a grossi les caracteres SANS toucher aux ordonnees, et les deux
# lignes se sont mangees d'un tiers de leur hauteur.
#
# 1,35 est l'interligne ordinaire d'un texte compose : la hauteur des
# caracteres, plus la respiration entre deux lignes. Sous 1,2 les hampes d'une
# ligne touchent les jambages de celle du dessus.
#
# ON N'EMPILE PLUS AVEC UNE CONSTANTE. Toute fonction qui pose des lignes l'une
# sous l'autre avance de `pas(taille)`, jamais d'un nombre ecrit a la main : le
# jour ou la taille change, l'espacement suit tout seul.
#
# Ce fichier n'importe rien : il est ne d'une suppression d'animations et se
# relit seul. La meme constante vit dans cours/schema.py pour les lecons 2, 4
# et 5, qui l'importent.
INTERLIGNE = 1.35


def pas(taille: float = TEXTE_MIN, lignes: float = 1.0) -> float:
    """De combien descendre pour poser la ligne suivante."""
    return INTERLIGNE * taille * lignes


# Le controle mecanique : node outils/verifier-figures.mjs, puis
# node outils/verifier-recouvrements.mjs



# ── Les valeurs, reprises des scenes ────────────────────────────────────────

# cadre.py · LesTroisPrerequis
REGLE = "f(x) = 2x + 1"
ENTREES = [(1, 3), (2, 5), (3, 7), (4, 9)]
TRAITS = [("surface", 50), ("pièces", 2), ("étage", 3), ("âge", 12)]
PRIX_VRAI, PREVISION = 200, 185
ECART, AIRE = -15, 225

# cadre.py · LaCarteDuChapitre
ETAPES = [
    ("le cadre", "du cours"),
    ("écrire la règle", "échoue"),
    ("un problème", "concret"),
    ("nommer", "les objets"),
    ("chiffrer", "l'erreur"),
    ("la faire", "baisser"),
    ("les trois", "familles"),
    ("régression ou", "classification"),
    ("tout", "calculer"),
    ("compter", "les réglages"),
    ("garder", "l'essentiel"),
]

# perte.py · LeCarreEmpecheLaCompensation
ECART_BAS, ECART_HAUT = -7.5, 7.5
AIRE_CARRE = 56.25
COTE_PETIT, COTE_GRAND = 10, 20
AIRE_PETIT, AIRE_GRAND = 100, 400


# ── Les primitives ──────────────────────────────────────────────────────────


def fr(x: float) -> str:
    """Un nombre a la francaise : la virgule, et pas de zero inutile."""
    s = f"{x:g}".replace(".", ",")
    return s


def ent(n: int) -> str:
    """Un entier, milliers separes par la fine insecable."""
    return f"{n:,}".replace(",", " ")


def txt(
    x: float,
    y: float,
    contenu: str,
    taille: int = TEXTE_MIN,
    couleur: str = ENCRE,
    ancre: str = "start",
    graisse: int = 400,
    italique: bool = False,
) -> str:
    if taille < TEXTE_MIN:
        raise ValueError(
            f"texte de figure a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {contenu[:40]} ». Voir la regle 32."
        )
    style = f" font-style=\"italic\"" if italique else ""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{POLICE}" '
        f'font-size="{taille}" font-weight="{graisse}" fill="{couleur}" '
        f'text-anchor="{ancre}"{style}>{contenu}</text>'
    )


def rect(x, y, w, h, trait=ENCRE, ep=2.0, fond="none") -> str:
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
        f'fill="{fond}" stroke="{trait}" stroke-width="{ep}"/>'
    )


def ligne(x1, y1, x2, y2, trait=ENCRE, ep=2.0, tirets=None, filet=False) -> str:
    """Un trait.

    `filet=True` marque un trait FAIT POUR TOUCHER LE TEXTE : la regle sous un
    titre, le trait qui separe deux sections, le soulignement d'une colonne. Il
    sort avec `data-role="filet"` et le crible des recouvrements l'ecarte de son
    genre texte/trait. Rien n'est devine a la teinte ni a l'epaisseur : un filet
    se declare, sans quoi un axe pale passerait pour un filet.
    """
    d = f' stroke-dasharray="{tirets}"' if tirets else ""
    r = ' data-role="filet"' if filet else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{trait}" stroke-width="{ep}"{d}{r}/>'
    )


def fleche(x1, y1, x2, y2, trait=GRIS_58, ep=2.0) -> str:
    """Une fleche droite, pointe pleine. Aucun arrondi : c'est la regle."""
    import math

    a = math.atan2(y2 - y1, x2 - x1)
    p = 9.0
    xa, ya = x2 - p * math.cos(a - 0.4), y2 - p * math.sin(a - 0.4)
    xb, yb = x2 - p * math.cos(a + 0.4), y2 - p * math.sin(a + 0.4)
    # UNE FLECHE EST UN FILET : elle porte le nom de l'operation qu'elle fait,
    # pose sur sa hampe. Voir cours/schema.py.
    return (
        ligne(x1, y1, x2 - p * 0.7 * math.cos(a), y2 - p * 0.7 * math.sin(a),
              trait, ep, filet=True)
        + f'<polygon points="{x2:.1f},{y2:.1f} {xa:.1f},{ya:.1f} {xb:.1f},{yb:.1f}" '
        f'fill="{trait}" data-role="filet"/>'
    )


def pt(x, y, r=4.5, couleur=ENCRE) -> str:
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{couleur}"/>'


# La chasse moyenne d'un caractere, en fraction de la taille. C'est LA MEME
# valeur que celle du crible, outils/verifier-recouvrements.mjs : le trace et
# le controle doivent mesurer pareil, sans quoi l'un pose ce que l'autre
# refuse.
CHASSE = 0.55


def largeur_texte(contenu: str, taille: float = TEXTE_MIN) -> float:
    return CHASSE * taille * len(contenu)


def couper(contenu: str, largeur: float, taille: float = TEXTE_MIN) -> list[str]:
    """Le texte coupe aux espaces pour tenir dans `largeur` a cette taille.

    Un mot plus long que la colonne n'est jamais coupe en deux : il deborde,
    et le crible le dira. Mieux vaut un debordement visible qu'un mot casse.
    """
    lignes, courante = [], ""
    for mot in contenu.split(" "):
        essai = f"{courante} {mot}".strip()
        if courante and largeur_texte(essai, taille) > largeur:
            lignes.append(courante)
            courante = mot
        else:
            courante = essai
    if courante:
        lignes.append(courante)
    return lignes or [""]


def colonne(x, y, contenus, taille=TEXTE_MIN, couleur=ENCRE, ancre="start",
            graisse=400) -> list[str]:
    """Des lignes empilees, l'interligne calcule sur LEUR taille."""
    o = []
    for i, c in enumerate(contenus):
        contenu, teinte = c if isinstance(c, tuple) else (c, couleur)
        o.append(txt(x, y + i * pas(taille), contenu, taille, teinte, ancre,
                     graisse))
    return o


def bloc(x, y, contenu, largeur, taille=TEXTE_MIN, couleur=ENCRE,
         ancre="start", graisse=400) -> list[str]:
    """Un texte coupe a la largeur d'une colonne, et empile a l'interligne."""
    return colonne(x, y, couper(contenu, largeur, taille), taille, couleur,
                   ancre, graisse)


def document(largeur: int, hauteur: int, corps: list[str]) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{largeur}" '
        f'height="{hauteur}" viewBox="0 0 {largeur} {hauteur}">\n'
        f'<rect width="{largeur}" height="{hauteur}" fill="{PAPIER}"/>\n'
        + "\n".join(corps)
        + "\n</svg>\n"
    )


def entete(x: float, y: float, texte: str, largeur: float = 360) -> list[str]:
    """Le titre d'un panneau, et son filet."""
    return [
        txt(x, y, texte, TEXTE_MIN, GRIS_58, graisse=600),
        ligne(x, y + 10, x + largeur, y + 10, GRIS_24, 1.5, filet=True),
    ]


# ── Figure 1 · les trois prerequis ──────────────────────────────────────────


def fig1_prerequis() -> str:
    """Trois panneaux cote a cote, chacun dans sa colonne de 400.

    RECOMPOSEE A L'INTERLIGNE. Les etages etaient poses a la main — 274 puis
    +30, 110 puis +42, et les valeurs a 166 avec leurs noms a 184 — du temps ou
    le texte de figure faisait seize pixels. A trente-trois, dix-huit pixels
    d'ecart mettent « 200 » dans « prix vrai ». Tout descend maintenant de
    `pas()`, et les trois pieds de panneau se coupent a la largeur de leur
    colonne au lieu de traverser celle du voisin.
    """
    o = []
    L, H = 1380, 560
    COL = 400.0          # la largeur utile d'un panneau
    PIED = 492.0         # l'etage ou commence le pied de chaque panneau

    # (1) la fonction : une boite, deux fleches, la regle, et les quatre passages
    o += entete(40, 40, "1 · une fonction")
    bx, by, bw, bh = 150, 95, 130, 95
    o.append(rect(bx, by, bw, bh, ENCRE, 2.6))
    o.append(txt(bx + bw / 2, by + bh / 2 + 13, "f", 40, ENCRE, "middle", 500, True))
    o.append(fleche(50, by + bh / 2, bx - 6, by + bh / 2))
    o.append(fleche(bx + bw + 6, by + bh / 2, 400, by + bh / 2))
    o.append(txt(50, by - 18, "entrée", TEXTE_MIN, GRIS_58))
    o.append(txt(400, by - 18, "sortie", TEXTE_MIN, GRIS_58, "end"))
    o.append(txt(40, 248, REGLE, TEXTE_MIN, ENCRE, graisse=500))
    for i, (e, s) in enumerate(ENTREES):
        y = 310 + i * pas()
        o.append(txt(52, y, str(e), TEXTE_MIN, ENCRE, "middle"))
        o.append(fleche(74, y - 10, 124, y - 10, GRIS_40, 1.6))
        o.append(txt(146, y, str(s), TEXTE_MIN, ENCRE, "middle"))
    o += bloc(40, PIED, "la même règle pour toutes les entrées", COL,
              TEXTE_MIN, GRIS_58)

    # (2) le vecteur : quatre traits nommes, puis la colonne entre crochets
    dx = 480
    o += entete(dx, 40, "2 · un vecteur")
    for i, (nom, val) in enumerate(TRAITS):
        y = 120 + i * pas()
        o.append(txt(dx, y, nom, TEXTE_MIN, GRIS_58))
        o.append(txt(dx + 190, y, str(val), TEXTE_MIN, ENCRE, "end", 500))
        o.append(fleche(dx + 208, y - 10, dx + 258, y - 10, GRIS_40, 1.6))
    cx, cy, ch = dx + 284, 96, pas() * len(TRAITS) + 14
    for sx, sens in ((cx, 1), (cx + 86, -1)):
        o.append(ligne(sx, cy, sx, cy + ch, ENCRE, 2.4, filet=True))
        o.append(ligne(sx, cy, sx + 14 * sens, cy, ENCRE, 2.4, filet=True))
        o.append(ligne(sx, cy + ch, sx + 14 * sens, cy + ch, ENCRE, 2.4,
                       filet=True))
    for i, (_, val) in enumerate(TRAITS):
        o.append(txt(cx + 43, 120 + i * pas(), str(val), TEXTE_MIN, ENCRE,
                     "middle", 500))
    o.append(txt(dx, 340, "x  ∈  ℝ⁴", TEXTE_MIN, ENCRE, graisse=500))
    o += bloc(dx, PIED, "la place de chaque nombre porte un sens", COL,
              TEXTE_MIN, GRIS_58)

    # (3) le carre d'un ecart
    #
    # Les etages ne sont plus ecrits a la main : la barre d'ecart est posee, et
    # chaque ligne qui suit descend de pas(). Serres autrement, « prix vrai »
    # venait se poser sur « 200 », et la cote du carre sur « prevision ».
    ex = 930
    o += entete(ex, 40, "3 · le carré d'un écart")
    axe_y = 150

    # 185 et 200 places a l'echelle sur un axe qui va de 175 a 215
    def px(v: float) -> float:
        return ex + (v - 175) / 40 * 360

    o.append(ligne(px(PREVISION), 104, px(PRIX_VRAI), 104, BRIQUE, 2.6, filet=True))
    o.append(
        txt((px(PREVISION) + px(PRIX_VRAI)) / 2, 92,
            f"écart −{abs(ECART)}", TEXTE_MIN, BRIQUE, "middle", 600)
    )
    o.append(ligne(ex, axe_y, ex + 360, axe_y, ENCRE, 2.4))
    valeurs_y = axe_y + 42
    noms_y = valeurs_y + pas()
    o.append(pt(px(PRIX_VRAI), axe_y, 5.5, ENCRE))
    o.append(txt(px(PRIX_VRAI), valeurs_y, str(PRIX_VRAI), TEXTE_MIN, ENCRE,
                 "middle", 500))
    o.append(txt(px(PRIX_VRAI), noms_y + pas(), "prix vrai", TEXTE_MIN, GRIS_58,
                 "middle"))
    o.append(pt(px(PREVISION), axe_y, 5.5, BRIQUE))
    o.append(txt(px(PREVISION), valeurs_y, str(PREVISION), TEXTE_MIN, BRIQUE,
                 "middle", 500))
    o.append(txt(px(PREVISION), noms_y, "prévision", TEXTE_MIN, BRIQUE,
                 "middle"))

    cote = 110.0
    sq_x, sq_y = ex, noms_y + pas() + 48
    o.append(txt(sq_x + cote + 24, sq_y + 26, f"côté {abs(ECART)}", TEXTE_MIN,
                 BRIQUE, "start", 600))
    o.append(rect(sq_x, sq_y, cote, cote, BRIQUE, 2.6, GRIS_14))
    o.append(txt(sq_x + cote / 2, sq_y + cote / 2 + 12, str(AIRE), TEXTE_MIN,
                 BRIQUE, "middle", 600))
    o += bloc(ex, PIED, "le signe disparaît, la taille non", COL, TEXTE_MIN,
              GRIS_58)

    return document(L, H, o)


# ── Figure 2 · la carte du chapitre ─────────────────────────────────────────


def fig2_carte() -> str:
    """La carte du chapitre : onze etapes en dents de scie.

    RECOMPOSEE. Les deux mots d'une etape etaient poses a dix-sept pixels l'un
    de l'autre, pour des caracteres de trente-trois : ils se mangeaient de
    moitie. Et les libelles des deux bouts, centres sur leur point, sortaient
    du cadre par la gauche et par la droite.

    Servie par aucune page : sa hauteur est libre, et elle passe de 340 a 430
    pour que les deux lignes d'un libelle tiennent a l'interligne.
    """
    o = []
    L, H = 1380, 430
    x0, x1 = 50, 1330
    crete, creux = 150, 270
    n = len(ETAPES)
    xs = [x0 + (x1 - x0) * i / (n - 1) for i in range(n)]
    ys = [crete if i % 2 == 0 else creux for i in range(n)]

    def centre_dans_le_cadre(x: float, contenu: str) -> float:
        """L'abscisse d'un libelle centre, ramenee dans le cadre.

        Seuls les libelles des deux bouts bougent, et de ce qu'il faut."""
        demi = largeur_texte(contenu) / 2
        return min(max(x, demi + 10), L - demi - 10)

    # le chemin : une polyligne, pas une courbe — le trace ne s'anime plus
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in zip(xs, ys))
    o.append(
        f'<polyline points="{pts}" fill="none" stroke="{ENCRE}" stroke-width="2.6"/>'
    )
    for i, ((a, b), x, y) in enumerate(zip(ETAPES, xs, ys)):
        haut = i % 2 == 0
        o.append(pt(x, y, 6.0, ENCRE))
        # le numero du cote oppose au libelle, comme dans la scene
        o.append(
            # Quarante pixels sous le point, trente au-dessus : a vingt-deux
            # et quatorze, le chemin en dents de scie passait dans le numero.
            txt(x, y + (62 if haut else -48), str(i + 1), TEXTE_MIN, BRIQUE,
                "middle", 700)
        )
        base = y - 34 - pas() if haut else y + 44
        o.append(txt(centre_dans_le_cadre(x, a), base, a, TEXTE_MIN, ENCRE,
                     "middle", 500))
        o.append(txt(centre_dans_le_cadre(x, b), base + pas(), b, TEXTE_MIN,
                     ENCRE, "middle", 500))
    o.append(ligne(x0, 386, x1, 386, GRIS_24, 1.5, filet=True))
    o.append(txt(x0, 416, "onze étapes, un seul trajet", TEXTE_MIN, BRIQUE, graisse=600))
    return document(L, H, o)


# ── Figure 3 · les trois apports de l'humain ────────────────────────────────


def fig3_apports() -> str:
    o = []
    L, H = 1380, 430
    cadres = [
        ("une famille de fonctions", "le modèle"),
        ("des données", "les exemples déjà résolus"),
        ("une mesure d'erreur", "de combien on se trompe"),
    ]
    # Les cadres descendent de 60 a 110 : le titre et sa glose etaient a
    # dix-huit pixels l'un de l'autre, pour des caracteres de trente-trois.
    cw, ch, cy = 380, 200, 110
    xs = [60, 500, 940]

    for (titre, sous), x in zip(cadres, xs):
        o.append(rect(x, cy, cw, ch, GRIS_40, 1.8))
        o.append(txt(x + cw / 2, cy - 32 - pas(), titre, TEXTE_MIN, ENCRE, "middle", 600))
        o.append(txt(x + cw / 2, cy - 32, sous, TEXTE_MIN, GRIS_58, "middle"))

    # cadre 1 : cinq droites pales, et la droite noire qui les balaie
    x, cxm, cym = xs[0], xs[0] + cw / 2, cy + ch / 2
    for pente in (-0.55, -0.28, 0.0, 0.28, 0.55):
        o.append(ligne(x + 30, cym - pente * 150, x + cw - 30, cym + pente * 150, GRIS_24, 2.0))
    o.append(ligne(x + 30, cym + 0.42 * 150, x + cw - 30, cym - 0.42 * 150, ENCRE, 3.0))

    # cadre 2 : neuf points en nuage legerement montant
    x = xs[1]
    nuage = [(0.08, 0.74), (0.18, 0.62), (0.27, 0.68), (0.37, 0.55), (0.48, 0.48),
             (0.58, 0.52), (0.68, 0.36), (0.79, 0.31), (0.90, 0.22)]
    for u, v in nuage:
        o.append(pt(x + 30 + u * (cw - 60), cy + 20 + v * (ch - 40), 5.0, ENCRE))

    # cadre 3 : une droite, un point au-dessus, l'ecart en brique, la regle graduee
    x = xs[2]
    ax, ay, bx2, by2 = x + 40, cy + ch - 45, x + cw - 40, cy + 62
    o.append(ligne(ax, ay, bx2, by2, ENCRE, 3.0))
    px_, py_ = x + 150, cy + 44
    o.append(pt(px_, py_, 5.5, ENCRE))
    # le pied de l'ecart, sur la droite, a la meme abscisse
    t = (px_ - ax) / (bx2 - ax)
    fy = ay + t * (by2 - ay)
    o.append(ligne(px_, py_, px_, fy, BRIQUE, 3.0, filet=True))
    for i in range(5):
        yy = fy - i * (fy - py_) / 4
        o.append(ligne(px_ + 12, yy, px_ + 26, yy, GRIS_58, 1.6))
    o.append(ligne(px_ + 19, py_, px_ + 19, fy, GRIS_58, 1.6))
    o.append(txt(px_ - 20, (py_ + fy) / 2 + 5, "l'écart", TEXTE_MIN, BRIQUE,
                 "end", 600))

    # la machine, et les trois branchements
    mx, my, mw, mh = 440, 314, 500, 62
    o.append(rect(mx, my, mw, mh, ENCRE, 2.6))
    o.append(txt(mx + mw / 2, my + 44, "la machine", TEXTE_MIN, ENCRE, "middle", 600))
    for x in xs:
        o.append(fleche(x + cw / 2, cy + ch + 8, mx + mw / 2, my - 8, GRIS_58, 2.0))
    o.append(
        txt(mx + mw / 2, my + mh + 46, "elle règle, elle mesure, elle garde",
            TEXTE_MIN, GRIS_58, "middle")
    )
    return document(L, H, o)


# ── Figure 4 · les deux carres, cote a cote ─────────────────────────────────


def fig4_deux_carres() -> str:
    o = []
    L, H = 1380, 430
    echelle = 16.0  # pixels par unite d'ecart : 7,5 -> 120 px

    # a gauche : les deux ecarts opposes, de part et d'autre du zero
    zy = 200
    o.append(ligne(60, zy, 620, zy, GRIS_40, 1.8, "8 6", filet=True))
    o.append(txt(60, zy - 10, "écart nul", TEXTE_MIN, GRIS_58))
    seg = abs(ECART_BAS) * echelle
    o.append(ligne(200, zy, 200, zy + seg, BRIQUE, 3.2, filet=True))
    o.append(txt(212, zy + seg / 2 + 5, f"−{fr(abs(ECART_BAS))}", TEXTE_MIN, BRIQUE, graisse=600))
    o.append(txt(200, zy + seg + 26, "la vente de 50 m²", TEXTE_MIN, GRIS_58, "middle"))
    o.append(ligne(470, zy, 470, zy - seg, BRIQUE, 3.2, filet=True))
    o.append(txt(482, zy - seg / 2 + 5, f"+{fr(ECART_HAUT)}", TEXTE_MIN, BRIQUE, graisse=600))
    o.append(txt(470, zy - seg - 18, "la vente de 30 m²", TEXTE_MIN, GRIS_58, "middle"))
    # Le pied du panneau de gauche descend d'un interligne sous le nom de la
    # vente : ecrit a la main, il valait 372 contre 346, vingt-six pixels pour
    # des caracteres de trente-trois.
    o.append(txt(60, zy + seg + 26 + pas(), "deux écarts opposés, somme nulle",
                 TEXTE_MIN, GRIS_58))

    o.append(fleche(660, 200, 740, 200, GRIS_58, 2.2))

    # a droite : les deux carres ranges cote a cote
    c = seg
    x0, y0 = 800, 200 - c / 2
    for i in range(2):
        x = x0 + i * (c + 10)
        o.append(rect(x, y0, c, c, BRIQUE, 2.6, GRIS_14))
        o.append(txt(x + c / 2, y0 + c / 2 + 7, fr(AIRE_CARRE), TEXTE_MIN, BRIQUE, "middle", 600))
    # LE CAS DE L'INTERLIGNE. Ces deux lignes etaient a 372 et 396 : vingt-quatre
    # pixels pour des caracteres de trente-trois, et « les aires s'ajoutent »
    # mangeait le tiers bas de « 56,25 + 56,25 = 112,5 ».
    equation_y = 340.0
    o += colonne(x0, equation_y, [
        (f"{fr(AIRE_CARRE)} + {fr(AIRE_CARRE)} = {fr(AIRE_CARRE * 2)}", ENCRE),
    ], TEXTE_MIN, graisse=600)
    o.append(txt(x0, equation_y + pas(), "les aires s'ajoutent", TEXTE_MIN,
                 GRIS_58))
    return document(L, H, o)


# ── Figure 5 · doubler le cote quadruple l'aire ─────────────────────────────


def fig5_quadrillage() -> str:
    o = []
    L, H = 1380, 470
    u = 13.0  # pixels par unite de cote : 20 -> 260 px
    grand = COTE_GRAND * u
    petit = COTE_PETIT * u
    x0, y0 = 420, 70

    o.append(rect(x0, y0, grand, grand, ENCRE, 2.6, GRIS_14))
    # la croix de quadrillage : quatre parts egales
    o.append(ligne(x0 + grand / 2, y0, x0 + grand / 2, y0 + grand, ENCRE, 1.8))
    o.append(ligne(x0, y0 + grand / 2, x0 + grand, y0 + grand / 2, ENCRE, 1.8))
    for i in range(2):
        for j in range(2):
            # La part du bas a gauche est celle du carre de depart : elle porte
            # deja son « 100 » en brique, pose plus bas. Ecrire le gris dessus
            # revenait a superposer deux fois le meme nombre au meme endroit.
            if (i, j) == (0, 1):
                continue
            o.append(
                txt(x0 + petit / 2 + i * petit, y0 + petit / 2 + j * petit + 7,
                    str(AIRE_PETIT), TEXTE_MIN, GRIS_58, "middle", 600)
            )
    # le carre de depart, reste en place dans le coin bas gauche
    o.append(rect(x0, y0 + grand - petit, petit, petit, BRIQUE, 3.0))
    o.append(
        txt(x0 + petit / 2, y0 + grand - petit / 2 + 7, str(AIRE_PETIT), TEXTE_MIN, BRIQUE, "middle", 700)
    )

    # les cotes, mesures sous la base
    o.append(ligne(x0, y0 + grand + 24, x0 + petit, y0 + grand + 24, BRIQUE,
                   2.4, filet=True))
    o.append(txt(x0 + petit / 2, y0 + grand + 44, str(COTE_PETIT), TEXTE_MIN, BRIQUE, "middle", 600))
    o.append(ligne(x0, y0 + grand + 58, x0 + grand, y0 + grand + 58, ENCRE,
                   2.4, filet=True))
    o.append(txt(x0 + grand / 2, y0 + grand + 78, str(COTE_GRAND), TEXTE_MIN, ENCRE, "middle", 600))

    o.append(txt(x0, y0 - 22, "le côté double, l'aire quadruple", TEXTE_MIN, GRIS_58, graisse=600))
    o.append(
        txt(x0 + grand + 60, y0 + grand / 2 - 8,
            f"{COTE_GRAND}² = {AIRE_GRAND}", TEXTE_MIN, ENCRE, graisse=600)
    )
    o.append(
        txt(x0 + grand + 60, y0 + grand / 2 + 26,
            f"= 4 × {COTE_PETIT}²", TEXTE_MIN, BRIQUE, graisse=600)
    )
    return document(L, H, o)


# ── Les valeurs des trois schemas ajoutes le 31 aout 2026 ───────────────────
#
# Meme discipline que ci-dessus : rien d'invente. Les deux appartements sont
# ceux de `cours/lecon1/prix.py`, les dix classes et les deux confusions
# choisies sont celles que `cours/lecon1/chiffres.py` a deja mesurees en
# section 2.4.

# familles.py · la scene « ce que contiennent les donnees », supprimee
LIGNES_SUPERVISE = (("50 m², 2 pièces", "200 k€"), ("30 m², 1 pièce", "115 k€"))
TRANSITIONS = (("s₁", "a₁", "r₂"), ("s₂", "a₂", "r₃"), ("s₃", "a₃", "r₄"))

# typer.py · la scene « le codage arbitraire », supprimee, refaite sur les
# chiffres manuscrits.
#
# CODAGE A : le chiffre vaut le nombre qu'il denote. C'est celui qu'on trouve
# dans le fichier, et c'est celui qui piege.
# CODAGE B : les noms des classes, ranges puis numerotes — ce que produit tout
# encodeur de categories a qui l'on donne une colonne de noms. L'ordre est
# CALCULE ici, jamais recopie : si un nom changeait, le schema suivrait.
NOMS_CHIFFRES = (
    "zéro", "un", "deux", "trois", "quatre",
    "cinq", "six", "sept", "huit", "neuf",
)
CODAGE_A = tuple(range(10))
CODAGE_B = tuple(sorted(range(10), key=lambda c: NOMS_CHIFFRES[c]))

# L'image presentee porte un 3 : c'est la classe de la section 2.4, celle dont
# les 6 131 exemples ont ete comptes. Les deux reponses fausses sont les deux
# que le chevauchement a mesurees contre elle, 8 a 0,253 et 5 a 0,225.
VRAIE_CLASSE = 3
REPONSES = (8, 5)


def _cout(codage: tuple[int, ...], vraie: int, repondue: int) -> tuple[int, int]:
    """L'ecart des deux codes, et son carre.

    Ni l'un ni l'autre n'est ecrit a la main : le schema les calcule, comme la
    perte quadratique les calculerait.
    """
    rang = {classe: code for code, classe in enumerate(codage)}
    ecart = abs(rang[vraie] - rang[repondue])
    return ecart, ecart * ecart


# ── Figure 6 · les trois jeux de donnees, cote a cote ───────────────────────


def fig6_trois_jeux() -> str:
    """Ce que les trois familles ont dans leur fichier, et non leurs trois noms.

    Trois panneaux qui ne different que par une colonne : elle est remplie,
    elle est vide, elle n'existe pas encore.

    RECOMPOSEE. A trente-trois pixels, « 50 m², 2 pièces » demande 272 pixels
    et sa case en faisait 190 ; le titre d'un panneau en demande 581 et la
    colonne en offrait 320 ; les deux entetes de colonne, cote a cote, en
    demandaient 599 pour 320. Les rangs passent donc a 420 de large, les titres
    et les entetes se coupent a cette largeur, et les deux lignes de pied
    descendent de pas(). La hauteur passe de 400 a 600 : le bloc image de la
    page 7 porte encore 400, et il reste a la remettre d'accord.
    """
    o = []
    L, H = 1380, 600
    RANG_L, CASE_G, CASE_D = 420.0, 280.0, 140.0
    HAUT, ECART = 38.0, 46.0
    RANGS = [210.0 + i * ECART for i in range(3)]
    PIED = 434.0

    def titre_panneau(x: float, texte: str) -> None:
        """Le titre, coupe a la rangee, et son filet sous la derniere ligne."""
        lignes = couper(texte, RANG_L)
        o.extend(colonne(x, 40, lignes, TEXTE_MIN, GRIS_58, graisse=600))
        filet = 40 + (len(lignes) - 1) * pas() + 10
        o.append(ligne(x, filet, x + RANG_L, filet, GRIS_24, 1.5, filet=True))

    def entetes(x: float, gauche: str, droite: str, teinte_d: str) -> None:
        """Les deux entetes de colonne, l'une sous l'autre : cote a cote elles
        demandent 599 pixels pour une rangee qui en fait 420."""
        o.append(txt(x, 130, gauche, TEXTE_MIN, GRIS_58))
        o.append(txt(x + RANG_L, 130 + pas(), droite, TEXTE_MIN, teinte_d, "end"))

    # (1) supervise : la reponse est sur la ligne
    x = 40.0
    titre_panneau(x, "1 · chaque ligne porte sa réponse")
    entetes(x, "ce qu'on observe", "ce qui a été payé", GRIS_58)
    for i, (gauche, droite) in enumerate(LIGNES_SUPERVISE):
        y = RANGS[i]
        o.append(rect(x, y, CASE_G, HAUT, ENCRE, 2.0))
        o.append(rect(x + CASE_G, y, CASE_D, HAUT, ENCRE, 2.0))
        o.append(txt(x + CASE_G / 2, y + 25, gauche, TEXTE_MIN, ENCRE, "middle"))
        o.append(txt(x + CASE_G + CASE_D / 2, y + 25, droite, TEXTE_MIN, BRIQUE, "middle", 600))
    y = RANGS[2]
    o.append(rect(x, y, CASE_G, HAUT, GRIS_24, 2.0))
    o.append(rect(x + CASE_G, y, CASE_D, HAUT, GRIS_24, 2.0))
    o.append(txt(x + CASE_G / 2, y + 27, "⋮", TEXTE_MIN, GRIS_40, "middle"))
    o.append(txt(x + CASE_G + CASE_D / 2, y + 27, "⋮", TEXTE_MIN, GRIS_40, "middle"))
    o += bloc(x, PIED, "un écart se mesure sur chaque ligne", RANG_L)

    # (2) non supervise : la meme ligne, amputee de sa reponse
    x = 500.0
    titre_panneau(x, "2 · la colonne de droite est vide")
    entetes(x, "ce qu'on observe", "rien", GRIS_40)
    for i, (gauche, _) in enumerate(LIGNES_SUPERVISE):
        y = RANGS[i]
        o.append(rect(x, y, CASE_G, HAUT, ENCRE, 2.0))
        o.append(rect(x + CASE_G, y, CASE_D, HAUT, GRIS_24, 2.0))
        o.append(txt(x + CASE_G / 2, y + 25, gauche, TEXTE_MIN, ENCRE, "middle"))
    y = RANGS[2]
    o.append(rect(x, y, CASE_G, HAUT, GRIS_24, 2.0))
    o.append(rect(x + CASE_G, y, CASE_D, HAUT, GRIS_24, 2.0))
    o.append(txt(x + CASE_G / 2, y + 27, "⋮", TEXTE_MIN, GRIS_40, "middle"))
    o += bloc(x, PIED, "il ne reste rien à soustraire", RANG_L)

    # (3) renforcement : la ligne suivante n'est pas encore ecrite
    x = 960.0
    titre_panneau(x, "3 · aucune ligne n'existe d'avance")
    o += bloc(x, 130, "ce que l'agent produit en agissant", RANG_L, TEXTE_MIN,
              GRIS_58)
    cell = RANG_L / 3
    for i, trio in enumerate(TRANSITIONS):
        y = RANGS[i]
        for j, contenu in enumerate(trio):
            o.append(rect(x + j * cell, y, cell, HAUT, ENCRE, 2.0))
            o.append(
                txt(x + (j + 0.5) * cell, y + 25, contenu, TEXTE_MIN, ENCRE, "middle", 500)
            )
    y = 358.0
    for j in range(3):
        o.append(rect(x + j * cell, y, cell, HAUT, GRIS_24, 2.0))
    o.append(txt(x + 0.5 * cell, y + 36, "?", TEXTE_MIN, GRIS_40, "middle", 600))
    # Le chemin qui va de l'action a la ligne qu'elle produira. Il sort par le
    # bas de la case de l'action, longe, et rentre par le haut de la case
    # d'etat : aucun trait ne traverse une case.
    xa = x + 1.5 * cell
    # Le chemin longe SOUS les cases, et non a huit pixels d'elles : « a₃ » et
    # « ? » se posaient dessus.
    o.append(ligne(xa, RANGS[2] + HAUT, xa, 344, BRIQUE, 2.4, filet=True))
    o.append(ligne(xa, 344, x + 0.5 * cell, 344, BRIQUE, 2.4, filet=True))
    o.append(fleche(x + 0.5 * cell, 344, x + 0.5 * cell, y - 4, BRIQUE, 2.4))
    o += bloc(x, PIED,
              "ce qu'on observera ensuite dépend de l'action qui vient d'être choisie",
              RANG_L, TEXTE_MIN, GRIS_58)

    return document(L, H, o)


# ── Figure 7 · deux numerotations des memes dix classes ─────────────────────


def fig7_deux_codages() -> str:
    """Le meme probleme sous deux codages, et l'ordre des erreurs qui s'inverse.

    Rien ne change d'un panneau a l'autre que la place des cases : la classe
    presentee est la meme, les deux reponses fausses sont les memes, et les dix
    classes sont les memes dix classes.
    """
    o = []
    # LA HAUTEUR REVIENT A 470. Le fichier sortait un cadre de 410 — H − 60 —
    # alors que le bloc image de la page 8 declare 470 depuis toujours : l'un
    # des deux avait bouge sans l'autre. Les noms en quinconce demandent la
    # place que ces soixante pixels rendent, et la page retrouve sa hauteur.
    L, H = 1380, 620
    CELL, PAS = 48.0, 56.0
    CODE_Y = 188.0
    NOM_Y = CODE_Y + pas()
    COTE_Y = (356.0, 478.0)
    VERDICT_Y = 574.0
    # Le rappel de chaque cote part SOUS le libelle de la precedente : d'un
    # seul tenant depuis les noms, il traversait ce libelle.
    RAPPEL_Y = (296.0, 424.0)

    def panneau(x0: float, titre: str, codage: tuple[int, ...], verdict: str) -> None:
        o.extend(entete(x0, 40, titre, 564))
        rang = {classe: code for code, classe in enumerate(codage)}

        def centre(classe: int) -> float:
            return x0 + rang[classe] * PAS + CELL / 2

        o.append(txt(centre(VRAIE_CLASSE), 76, "présentée", TEXTE_MIN, BRIQUE, "middle", 600))
        for code, classe in enumerate(codage):
            x = x0 + code * PAS
            vraie = classe == VRAIE_CLASSE
            couleur = BRIQUE if vraie else ENCRE
            o.append(rect(x, 96, CELL, CELL, couleur, 2.6 if vraie else 1.6))
            o.append(txt(x + CELL / 2, 130, str(classe), TEXTE_MIN, couleur, "middle", 500))
            o.append(txt(x + CELL / 2, CODE_Y, str(code), TEXTE_MIN, ENCRE, "middle", 600))
            # LES NOMS SONT EN QUINCONCE. « quatre » demande 109 pixels a 33 px
            # et la case en fait 56 : ecrits sur une seule ligne, un nom sur
            # deux mordait ses deux voisins, et le code au-dessus les touchait
            # tous — dix-neuf pixels les separaient. Une case sur deux descend
            # d'un interligne, ce qui porte l'entraxe a 112 : « quatre » y tient.
            o.append(
                txt(x + CELL / 2, NOM_Y + (code % 2) * pas(),
                    NOMS_CHIFFRES[classe], TEXTE_MIN, GRIS_58, "middle")
            )
        bord = x0 + 9 * PAS + CELL + 12
        o.append(txt(bord, CODE_Y, "code", TEXTE_MIN, GRIS_58))
        o.append(txt(bord, NOM_Y, "nom", TEXTE_MIN, GRIS_58))

        # Les deux mesures sont a deux etages : la seconde englobe la premiere
        # dans le panneau A comme dans le panneau B, et sur un seul etage les
        # deux cotes se poseraient l'une sur l'autre.
        for rang_cote, (repondue, y) in enumerate(zip(REPONSES, COTE_Y)):
            xa, xb = centre(VRAIE_CLASSE), centre(repondue)
            g, d = min(xa, xb), max(xa, xb)
            # LA COTE N'EST PAS UN FILET. Declaree comme telle, elle passait
            # au ras des capitales de son propre libelle et se lisait comme une
            # barre de rature : le crible l'a laissee faire, l'oeil non. Le
            # libelle descend donc de quarante-six pixels, et le crible le
            # verifie comme n'importe quel trait.
            for borne in (g, d):
                o.append(ligne(borne, RAPPEL_Y[rang_cote], borne, y - 20,
                               GRIS_24, 1.4, "3 4"))
                o.append(ligne(borne, y - 7, borne, y + 7, BRIQUE, 2.6))
            o.append(ligne(g, y, d, y, BRIQUE, 2.6))
            ecart, cout = _cout(codage, VRAIE_CLASSE, repondue)
            o.append(
                txt(
                    x0,
                    y + 46,
                    f"répondre {repondue} : écart {ecart}, coût {cout}",
                    TEXTE_MIN,
                    BRIQUE,
                    graisse=600,
                )
            )
        o.append(txt(x0, VERDICT_Y, verdict, TEXTE_MIN, GRIS_58))

    panneau(
        40.0,
        "A · le code est la valeur du chiffre",
        CODAGE_A,
        "l'erreur la plus chère est « 8 »",
    )
    panneau(
        720.0,
        "B · le rang du nom, dans l'ordre",
        CODAGE_B,
        "l'erreur la plus chère est « 5 »",
    )

    return document(L, H, o)


# ── Figure 8 · ou vit la verite, ou vit l'estimation ────────────────────────


def fig8_ecart_des_ensembles() -> str:
    """Les deux ensembles, superposes trois fois : ils coincident, puis non.

    Les seules valeurs portees sont celles du fil : 200 et 190 en section 4,
    0,83 en section 7.2. Les sept barres n'en portent aucune, et c'est exact :
    leur hauteur n'a pas ete mesuree, elle est dessinee.
    """
    o = []
    # RECOMPOSEE. « l'estimation est sept nombres de somme 1 » demande 726
    # pixels a 33 px ; le panneau en offre 420, et la note sortait du cadre par
    # la droite en traversant celle du panneau voisin. Les notes se coupent
    # maintenant a la largeur du panneau, et les trois etages descendent
    # d'autant. Servie par aucune page : sa hauteur est libre, 350 -> 560.
    L, H = 1380, 560
    PANNEAU = 420.0
    HAUT_V, HAUT_E = 200.0, 370.0

    def notes(x: float, haut: str, bas: str, conclusion: str) -> None:
        o.extend(bloc(x, 140, haut, PANNEAU, TEXTE_MIN, GRIS_58))
        o.extend(bloc(x, 286, bas, PANNEAU, TEXTE_MIN, GRIS_58))
        o.extend(bloc(x, 456, conclusion, PANNEAU, TEXTE_MIN, GRIS_58))

    def titre(x: float, texte: str) -> None:
        """Le titre coupe a la largeur du panneau : « 2 · classification
        binaire » en demande 472 pour une colonne qui en fait 420."""
        lignes = couper(texte, PANNEAU)
        o.extend(colonne(x, 40, lignes, TEXTE_MIN, GRIS_58, graisse=600))
        filet = 40 + (len(lignes) - 1) * pas() + 10
        o.append(ligne(x, filet, x + PANNEAU, filet, GRIS_24, 1.5, filet=True))

    # (1) regression : la meme droite deux fois
    x = 40.0
    titre(x, "1 · régression")
    notes(x, "la vérité est un nombre", "l'estimation aussi",
          "le même ensemble des deux côtés")

    def place(v: float) -> float:
        return x + (v - 180) / 30 * 300

    for y, valeur, couleur in ((HAUT_V, 200, ENCRE), (HAUT_E, 190, BRIQUE)):
        o.append(fleche(x, y, x + 320, y, couleur, 2.4))
        o.append(pt(place(valeur), y, 5.5, couleur))
        o.append(txt(place(valeur), y + 40, str(valeur), TEXTE_MIN, couleur, "middle", 600))

    # (2) binaire : deux points face a un segment entier
    x = 500.0
    titre(x, "2 · classification binaire")
    notes(x, "la vérité est l'une de deux valeurs",
          "un point quelconque entre elles",
          "deux points face à tout un segment")
    gauche, droite = x + 40, x + 260
    for valeur, xv in (("0", gauche), ("1", droite)):
        o.append(pt(xv, HAUT_V, 5.5, ENCRE))
        o.append(txt(xv, HAUT_V + 40, valeur, TEXTE_MIN, ENCRE, "middle", 600))
    o.append(ligne(gauche, HAUT_E, droite, HAUT_E, BRIQUE, 5.0))
    for xv in (gauche, droite):
        o.append(ligne(xv, HAUT_E - 8, xv, HAUT_E + 8, BRIQUE, 2.6, filet=True))
    xv = gauche + 0.83 * (droite - gauche)
    o.append(pt(xv, HAUT_E, 5.5, ENCRE))
    o.append(txt(xv, HAUT_E + 40, "0,83", TEXTE_MIN, ENCRE, "middle", 600))

    # (3) sept classes : sept points face a sept nombres
    x = 960.0
    titre(x, "3 · sept classes")
    notes(x, "la vérité est une lettre",
          "l'estimation est sept nombres de somme 1",
          "sept points face à sept nombres")
    for i, lettre in enumerate("ABCDEFG"):
        xv = x + 24 + i * 46
        o.append(pt(xv, HAUT_V, 5.5, ENCRE))
        o.append(txt(xv, HAUT_V + 40, lettre, TEXTE_MIN, ENCRE, "middle", 600))
    o.append(ligne(x, HAUT_E, x + 320, HAUT_E, GRIS_40, 2.0))
    for i, hauteur in enumerate((5, 10, 19, 30, 17, 8, 4)):
        xv = x + 24 + i * 46
        o.append(rect(xv - 13, HAUT_E - hauteur, 26, hauteur, BRIQUE, 1.6, BRIQUE))
    o.append(txt(x + 320, HAUT_E + 40, "somme = 1", TEXTE_MIN, BRIQUE, "end", 600))

    return document(L, H, o)


# ═══════════════════════════════════════════════════════════════════════════
# LES DIX SCHEMAS DE LA PASSE ANIMATIONS-TRI
#
# Dix animations de plus quittent le chapitre. Six seulement restent animees,
# celles ou un parametre bouge et un objet repond ; les dix autres ne
# montraient qu'un etat final qu'un schema donne d'un coup, sans faire
# attendre. Chacune laisse ici sa DERNIERE TRAME, et ses valeurs :
#
#   l1-fig9-des-mots-aux-objets        <- fil.py      DeLenonceAuxObjets
#   l1-fig10-du-formalisme-au-code     <- demo.py     DuFormalismeAuCode
#   l1-fig11-verifier-les-dimensions   <- objets.py   LaVerificationDesDimensions
#   l1-fig12-trois-reglages-cent-mille <- boutons.py  DeTroisBoutonsACentMille
#   l1-fig13-le-calcul-a-la-main       <- demo.py     LeCalculALaMain
#   l1-fig14-le-chemin-du-chapitre     <- cloture.py  LeCheminDuChapitre
#   l1-fig15-le-renversement           <- bases.py    LeRenversement
#   l1-fig16-y-et-y-chapeau            <- cloture.py  YEtYChapeau
#   l1-fig17-les-trois-boutons         <- boutons.py  LesTroisBoutons
#   l1-fig18-le-partitionnement        <- familles.py LePartitionnement
#
# AUCUN NOMBRE N'EST INVENTE. Chaque valeur est celle d'une constante de la
# scene d'origine, recopiee ci-dessous sous le nom du fichier qui la porte,
# ou calculee a partir d'elles. Le nuage des k moyennes est REPRODUIT, graine
# comprise, par le meme tirage que `familles.py`.
#
# LE COMPTE DES JALONS EST CORRIGE. La scene disait « sept jalons » sous huit
# bornes : `JALONS` en porte huit depuis que la section 9 est entree dans le
# chapitre, et la ligne de cloture n'avait pas suivi. Le schema dit huit.
# ═══════════════════════════════════════════════════════════════════════════

import random as _random

MONO = "'Cascadia Mono',Consolas,'SF Mono',ui-monospace,monospace"


def txt_riche(x, y, morceaux, taille=BASE_INDICE, couleur=ENCRE, ancre="start",
              graisse=400) -> str:
    """Un texte dont certains morceaux sont en indice bas ou en brique.

    `morceaux` est une suite de couples (contenu, style), style valant
    "" (courant), "bas" (indice), "brique", ou "bas-brique". Un seul element
    <text> : les morceaux s'enchainent sans qu'aucune position soit calculee
    a la main, et rien ne peut donc se recouvrir.
    """
    # LE PLANCHER, ET SES DEUX SEUILS. Un texte riche sans indice suit le
    # plancher ordinaire ; un texte riche QUI PORTE UN INDICE doit partir de
    # plus haut, parce que son indice est compose a 0,68 fois sa base : pour
    # que l'indice atteigne 33, la base part de 49. Regle 32.
    if taille < TEXTE_MIN:
        raise ValueError(
            f"texte riche a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {''.join(c for c, _ in morceaux)[:40]} ». Voir la regle 32."
        )
    if any("bas" in style for _, style in morceaux) and taille * 0.68 < TEXTE_MIN:
        raise ValueError(
            f"indice compose a {taille * 0.68:.1f}, sous le plancher "
            f"{TEXTE_MIN} : « {''.join(c for c, _ in morceaux)[:40]} ». "
            f"Base minimale {BASE_INDICE}."
        )
    petit = taille * 0.68
    chute = taille * 0.24
    dedans, courant = [], 0.0
    for contenu, style in morceaux:
        bas = "bas" in style
        vise = chute if bas else 0.0
        dy = vise - courant
        courant = vise
        t = f' font-size="{petit:.1f}"' if bas else f' font-size="{taille}"'
        f = f' fill="{BRIQUE}"' if "brique" in style else ""
        dedans.append(f'<tspan dy="{dy:.2f}"{t}{f}>{contenu}</tspan>')
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{POLICE}" '
        f'font-size="{taille}" font-weight="{graisse}" fill="{couleur}" '
        f'text-anchor="{ancre}">' + "".join(dedans) + "</text>"
    )


def code(x, y, contenu, taille=TEXTE_MIN, couleur=ENCRE) -> str:
    """Une ligne de programme, au plancher. Chasse fixe : les colonnes s'alignent."""
    if taille < TEXTE_MIN:
        raise ValueError(
            f"ligne de code a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {contenu[:40]} ». Voir la regle 32."
        )
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{MONO}" '
        f'font-size="{taille}" fill="{couleur}" xml:space="preserve">'
        f'{contenu}</text>'
    )


# ── Les valeurs, reprises des scenes ────────────────────────────────────────

# fil.py · DeLenonceAuxObjets : les trois morceaux de la phrase de l'agence,
# dans l'ordre ou la scene les fait descendre, et la ligne de cloture.
MOTS_OBJETS = [
    ("la surface et le nombre de pièces",
     [("x = (x", ""), ("1", "bas"), (", x", ""), ("2", "bas"), (") ∈ ℝ²", "")],
     "deux nombres par logement"),
    ("le prix de vente", [("y ∈ ℝ", "")], "un seul nombre à prédire"),
    ("N ventes passées",
     [("𝒟 = { (x⁽ⁱ⁾, y⁽ⁱ⁾) },  i = 1 … N", "")],
     "les N exemples du fichier"),
]

# demo.py · DuFormalismeAuCode : les quatre correspondances, formule et code.
FORMALISME_CODE = [
    ([("z = ∑ w", ""), ("i", "bas"), (" x", ""), ("i", "bas"), (" + b", "")],
     ["z = b", "for i in range(d):", "    z += w[i] * x[i]"]),
    ([("ŷ = z", "")], ["y_hat = z"]),
    ([("ℓ = (ŷ − y)²", "")], ["loss = (y_hat - y) ** 2"]),
    ([("ℒ = (1 ⁄ N) ∑ ℓ", "")],
     ["total = 0.0", "for x, y in D:", "    total += perte(x, y)",
      "total / N"]),
]

# objets.py · LaVerificationDesDimensions : le produit qui existe, et celui
# qui n'existe pas. Le vecteur de la scene a quatre cases.
DIM_OK = (1, "d", "d", 1)
DIM_KO = (1, 4, 3, 1)

# boutons.py · DeTroisBoutonsACentMille : COMPTES, et le facteur de reduction
# du troisieme pave, qui ne tient pas dans le cadre a l'echelle des deux
# premiers.
COMPTES = [
    ("appartements", 3),
    ("dix gabarits sur 784 pixels", 7850),
    ("le réseau du chapitre 2", 101770),
]
REDUCTION = 3.6
VERDICT_COMPTES = "aucun n'est écrit à la main"

# demo.py · LeCalculALaMain, et bases.py qui porte les memes ventes : le jeu
# theta_A, w1 = 3, w2 = 10, b = 20, et les deux ventes du fil conducteur.
CALCUL_W1, CALCUL_W2, CALCUL_B = 3.0, 10.0, 20.0
CALCUL = [(50.0, 2.0, 200.0), (30.0, 1.0, 115.0)]
REGLE_MAX = 200.0


# ── Figure 9 · de la phrase aux objets ──────────────────────────────────────


def fig9_des_mots_aux_objets() -> str:
    # DE TROIS COLONNES A DEUX. Le troisieme symbole, « 𝒟 = { (x⁽ⁱ⁾, y⁽ⁱ⁾) },
    # i = 1 … N », demande 836 pixels a la taille d'un symbole indice : il
    # traversait la colonne des gloses et sortait du cadre. La glose descend
    # donc SOUS son symbole, et le morceau de phrase se coupe a sa colonne.
    # La hauteur passe de 420 a 480, celle que le bloc image de la page 3
    # declare deja.
    o = entete(40, 40, "la phrase, objet par objet", 1300)
    x_mot, MOT_L = 60.0, 400.0
    x_sym, SYM_L = 500.0, 880.0
    for x, quoi in ((x_mot, "dans la phrase"), (x_sym, "l'objet, et ce qu'il porte")):
        o.append(txt(x, 96, quoi, TEXTE_MIN, GRIS_58))
    o.append(ligne(60, 110, 1320, 110, GRIS_24, 1.5, filet=True))

    for k, (mot, symbole, glose) in enumerate(MOTS_OBJETS):
        y = 150 + k * 116
        o += bloc(x_mot, y, mot, MOT_L, TEXTE_MIN, BRIQUE, graisse=600)
        o.append(fleche(x_sym - 62, y - 7, x_sym - 20, y - 7, GRIS_40, 1.8))
        o.append(txt_riche(x_sym, y, symbole, BASE_INDICE, ENCRE, graisse=600))
        o += bloc(x_sym, y + pas(BASE_INDICE), glose, SYM_L, TEXTE_MIN, GRIS_58)
        if k < len(MOTS_OBJETS) - 1:
            o.append(ligne(60, y + 84, 1320, y + 84, GRIS_14, 1.2, filet=True))

    return document(1380, 480, o)


# ── Figure 10 · le formalisme et le code, cote a cote ───────────────────────


def fig10_du_formalisme_au_code() -> str:
    o = entete(40, 40, "chaque symbole a son nom dans le code", 1300)
    x_f, x_c = 60.0, 700.0
    o.append(txt(x_f, 96, "le formalisme", TEXTE_MIN, GRIS_58, graisse=600))
    o.append(txt(x_c, 96, "le code", TEXTE_MIN, GRIS_58, graisse=600))
    o.append(ligne(60, 110, 1320, 110, GRIS_24, 1.5, filet=True))
    o.append(ligne(660, 118, 660, 780, GRIS_24, 1.5))

    y = 158.0
    for k, (formule, lignes) in enumerate(FORMALISME_CODE):
        haut = y
        o.append(txt_riche(x_f, y + 4, formule, BASE_INDICE, ENCRE, graisse=600))
        for n, ligne_code in enumerate(lignes):
            o.append(code(x_c, y + n * 44, ligne_code.replace(" ", "&#160;"),
                          TEXTE_MIN, ENCRE))
        y = max(y + 44 * len(lignes), haut + 74) + 38
        if k < len(FORMALISME_CODE) - 1:
            o.append(ligne(60, y - 22, 1320, y - 22, GRIS_14, 1.2, filet=True))
    return document(1380, 830, o)


# ── Figure 11 · verifier les dimensions ─────────────────────────────────────


def fig11_verifier_les_dimensions() -> str:
    """Le produit qui existe, et celui qui n'existe pas.

    LES DEUX FACTEURS SONT DES CADRES, et non des morceaux d'une meme ligne de
    texte : le trait qui relie les deux dimensions interieures doit tomber
    exactement sous elles, et la chasse d'une police systeme ne se calcule pas
    d'avance. Avec des cadres, les deux abscisses sont posees.
    """
    o = entete(40, 40, "vérifier les dimensions", 1300)

    def rangee(y: float, a, b, c, d, va: bool) -> None:
        xa, xb, xc, larg, haut = 90.0, 380.0, 690.0, 210.0, 58.0
        for x, (g, dr) in ((xa, (a, b)), (xb, (c, d))):
            o.append(rect(x, y, larg, haut, ENCRE, 2.2, PAPIER))
            o.append(txt(x + larg / 2, y + haut / 2 + 10,
                         f"{g} × {dr}", TEXTE_MIN, ENCRE, "middle", 600))
        o.append(txt(xa + larg + 34, y + haut / 2 + 10, "·", TEXTE_MIN, GRIS_58,
                     "middle"))
        o.append(txt(xb + larg + 34, y + haut / 2 + 10, "=", TEXTE_MIN, GRIS_58,
                     "middle"))

        # Le trait qui relie les deux dimensions interieures passe SOUS les
        # cadres. Il se referme quand elles se valent, il reste ouvert sinon.
        g1, g2 = xa + larg - 46, xb + 46
        bas = y + haut + 22
        o.append(ligne(g1, y + haut, g1, bas, BRIQUE, 2.2, filet=True))
        o.append(ligne(g2, y + haut, g2, bas, BRIQUE, 2.2, filet=True))
        if va:
            o.append(ligne(g1, bas, g2, bas, BRIQUE, 2.2, filet=True))
            o.append(rect(xc, y, larg, haut, ENCRE, 2.2, PAPIER))
            o.append(txt(xc + larg / 2, y + haut / 2 + 10, "1 × 1", TEXTE_MIN, ENCRE,
                         "middle", 600))
        else:
            o.append(ligne(g1, bas, g1 + 34, bas, BRIQUE, 2.2, "5 5", filet=True))
            o.append(ligne(g2 - 34, bas, g2, bas, BRIQUE, 2.2, "5 5", filet=True))
            o.append(txt(xc, y + haut / 2 + 10, "n'existe pas", TEXTE_MIN, BRIQUE,
                         graisse=700))
        o.append(txt((g1 + g2) / 2, bas + 26,
                     "dimensions intérieures égales" if va
                     else f"{c} ≠ {b}", TEXTE_MIN, BRIQUE, "middle",
                     400 if va else 700))

    # LA COLONNE DE DROITE EST ETROITE, et elle l'a toujours ete : les rangees
    # tiennent jusqu'a x = 908, le cadre s'arrete a 1380, il reste 390 pixels.
    # Ecrits d'un seul tenant, ces deux commentaires en demandaient 545 et
    # sortaient du cadre par la droite. Ils se coupent maintenant a la largeur
    # de leur colonne, et descendent de pas().
    GLOSE_X, GLOSE_L = 950.0, 390.0

    o.append(txt(90, 116, "wᵀ x : le produit qui existe", TEXTE_MIN, GRIS_58,
                 graisse=600))
    rangee(140, *DIM_OK, True)
    o += bloc(GLOSE_X, 160, "un seul nombre en sort, quelle que soit la taille de d",
              GLOSE_L, TEXTE_MIN, GRIS_58)

    o.append(ligne(60, 292, 1320, 292, GRIS_24, 1.5, filet=True))
    o.append(txt(90, 336, "le produit qui n'existe pas", TEXTE_MIN, GRIS_58,
                 graisse=600))
    rangee(360, *DIM_KO, False)
    o += bloc(GLOSE_X, 372, "aucun réglage n'y change rien : le produit n'est pas défini",
              GLOSE_L, TEXTE_MIN, GRIS_58)
    return document(1380, 520, o)


# ── Les valeurs des cinq dernieres scenes ───────────────────────────────────

# cloture.py · LeCheminDuChapitre : les huit jalons, symbole et glose. La
# huitieme borne est entree avec la section 9 ; la ligne de cloture de la
# scene, elle, disait encore « sept ». Le compte se LIT ici sur la liste.
JALONS = [
    ("x", "", "l'entrée"),
    ("y", "", "la vérité terrain"),
    ("𝒟", "", "le jeu de données"),
    ("f", "θ", "le modèle"),
    ("ℓ", "", "la perte sur un exemple"),
    ("ℒ", "𝒟", "la perte moyenne"),
    ("θ", "⋆", "les paramètres cherchés"),
    ("p", "", "le nombre de réglages"),
]

# bases.py · LeRenversement : les deux schemas, avant et apres.
RENVERSEMENT = (
    (("RÈGLES", "DONNÉES"), "RÉPONSES"),
    (("DONNÉES", "RÉPONSES"), "RÈGLES APPRISES"),
)

# cloture.py · YEtYChapeau : le point releve, le dernier jeu de parametres que
# la scene affiche, et les bornes de son plan.
Y_X0, Y_Y0 = 50.0, 200.0
Y_THETA = (3.4, 14.0)
Y_XMIN, Y_XMAX = 12.0, 68.0
Y_YMIN, Y_YMAX = 84.0, 236.0

# boutons.py · LesTroisBoutons : le plan, les deux ventes, theta_A, et
# l'excursion de chaque molette autour de sa valeur posee.
B_VENTES = [(50.0, 2.0, 200.0), (30.0, 1.0, 115.0)]
B_THETA = (3.0, 10.0, 20.0)
B_ECARTS = [("w₁", -1.2, 1.2), ("w₂", -8.0, 8.0), ("b", -28.0, 28.0)]
B_XMIN, B_XMAX = 20.0, 100.0
B_YMIN, B_YMAX = 60.0, 360.0

# familles.py · LePartitionnement : le tirage, a la graine pres.
K_GRAINE = 11
K_AMAS = ((2.6, 7.3), (7.6, 7.0), (5.0, 2.5))
K_ECART = 0.85
K_PAR_AMAS = 18
K_DEPARTS = ((1.4, 1.6), (3.2, 4.6), (8.6, 2.2))
K_TOURS = 4


def _nuage() -> list[tuple[float, float]]:
    """Le meme tirage que `familles.py`, a la ligne pres : meme graine, meme
    ordre, meme ecart. Changer l'un des trois change le nuage."""
    alea = _random.Random(K_GRAINE)
    points = []
    for cx, cy in K_AMAS:
        for _ in range(K_PAR_AMAS):
            points.append((cx + alea.gauss(0, K_ECART),
                           cy + alea.gauss(0, K_ECART)))
    return points


def _k_moyennes() -> tuple[list[tuple[float, float]], list[int],
                           list[tuple[float, float]]]:
    """Les points, leur groupe apres `K_TOURS` tours, et les trois centres.
    Meme alternance que la scene : on affecte, puis on recentre."""
    points = _nuage()
    centres = [list(d) for d in K_DEPARTS]
    groupes = [0] * len(points)
    for _ in range(K_TOURS):
        groupes = [
            min(range(3),
                key=lambda k, p=p: (p[0] - centres[k][0]) ** 2
                + (p[1] - centres[k][1]) ** 2)
            for p in points
        ]
        for k in range(3):
            miens = [p for p, g in zip(points, groupes) if g == k]
            if miens:
                centres[k] = [sum(v) / len(miens) for v in zip(*miens)]
    return points, groupes, [(c[0], c[1]) for c in centres]


# ── Figure 12 · de trois reglages a cent un mille sept cent soixante-dix ────
#
# LES SURFACES SONT PROPORTIONNELLES, et c'est tout le propos : 3 contre
# 7 850, c'est un facteur 2 617, et il se voit sans qu'on ait a l'ecrire. Le
# troisieme pave ne tient pas dans le cadre a cette echelle-la ; il est donc
# REDUIT DE 3,6, comme dans la scene, et sa vraie etendue reste tracee en
# pointille jusqu'a sortir du cadre.


def fig12_trois_reglages_cent_mille() -> str:
    o = entete(40, 40, "trois réglages, puis 7 850, puis 101 770", 1300)

    # Le cote d'une case, en pixels. Il est FIXE par le deuxieme pave, le plus
    # grand qui tienne : les deux autres s'en deduisent.
    l2, h2 = 300.0, 190.0
    case = (l2 * h2 / COMPTES[1][1]) ** 0.5
    # La ligne de sol remonte de 430 a 396 : les trois pieds de pave se coupent
    # maintenant a la largeur de LEUR colonne, et il en faut deux lignes pour
    # deux d'entre eux. Ecrits d'un seul tenant a 33 px, « dix gabarits sur 784
    # pixels · 7 850 » en demandait 617 et entrait dans la colonne voisine ; le
    # troisieme sortait du cadre.
    bas = 396.0
    COLONNES = ((90.0, 300.0), (400.0, 420.0), (830.0, 510.0))

    def pave(x: float, combien: int, echelle: float) -> tuple[float, float]:
        """Un pave dont l'AIRE vaut `combien` cases, la case etant reduite par
        `echelle`. Les proportions du deuxieme pave valent pour tous."""
        c = case / echelle
        if combien == 3:
            larg, haut = c * 3, c
        else:
            aire = combien * c * c
            larg = (aire * l2 / h2) ** 0.5
            haut = aire / larg
        o.append(rect(x, bas - haut, larg, haut, ENCRE, 1.6, GRIS_14))
        pas = max(c, 8.0)
        v = x + pas
        while v < x + larg - 1:
            o.append(ligne(v, bas - haut, v, bas, PAPIER, 0.7))
            v += pas
        u = bas - pas
        while u > bas - haut + 1:
            o.append(ligne(x, u, x + larg, u, PAPIER, 0.7))
            u -= pas
        return larg, haut

    pied = bas + 46
    for k, ((quoi, combien), (x, col), echelle) in enumerate(zip(
            COMPTES, COLONNES, (1.0, 1.0, REDUCTION))):
        larg, haut = pave(x, combien, echelle)
        compte = couper(f"{quoi} · {ent(combien)}", col)
        o += colonne(x, pied, compte, TEXTE_MIN, ENCRE, graisse=600)
        # Le sous-titre descend sous SON compte, pas sous le plus long des
        # trois : la colonne etroite en porte deux lignes, la large une seule.
        sous = pied + len(compte) * pas()
        if echelle != 1.0:
            o += bloc(x, sous, f"pavé réduit {fr(echelle)} fois", col,
                      TEXTE_MIN, BRIQUE)
        else:
            o += bloc(x, sous,
                      "à l'échelle" if k else "trois cases, à l'échelle",
                      col, TEXTE_MIN, GRIS_58)

    # La vraie etendue du troisieme, en pointille, jusqu'a la coupe.
    o.append(ligne(830, bas, 1340, bas, BRIQUE, 1.4, "6 6", filet=True))
    o.append(ligne(1340, bas, 1340, 96, BRIQUE, 1.4, "6 6", filet=True))
    o.append(ligne(830, bas, 830, 96, BRIQUE, 1.4, "6 6", filet=True))
    o.append(txt(1330, 118, "et cela continue, hors du cadre", TEXTE_MIN, BRIQUE,
                 "end"))

    o.append(ligne(60, 540, 1320, 540, BRIQUE, 2.0, filet=True))
    o += bloc(60, 576, VERDICT_COMPTES, 1260, TEXTE_MIN, BRIQUE, graisse=600)
    return document(1380, 600, o)


# ── Figure 13 · le calcul a la main, terme a terme ──────────────────────────


def fig13_le_calcul_a_la_main() -> str:
    o = entete(40, 40, "le calcul, terme à terme", 1300)

    x0, larg = 120.0, 1060.0
    ech = larg / REGLE_MAX

    def regle(y: float) -> None:
        """La regle graduee. Elle est FAITE pour porter ses nombres : la ligne
        et ses reperes sont des filets, et la graduation se pose dessous."""
        o.append(ligne(x0, y, x0 + larg, y, GRIS_40, 1.6, filet=True))
        for v in (0, 50, 100, 150, 200):
            x = x0 + v * ech
            o.append(ligne(x, y - 5, x, y + 5, GRIS_40, 1.6, filet=True))
            o.append(txt(x, y + 24, str(v), TEXTE_MIN, GRIS_58, "middle"))

    # LES TERMES ONT QUITTE LA BARRE. Ils y etaient poses au milieu de leur
    # segment, du temps ou le texte faisait seize pixels. A trente-trois,
    # « 10 × 1 » en demande cent neuf pour un segment qui en fait quarante-huit :
    # il mordait ses deux voisins, et « b = 20 » sortait du bout de la barre.
    # Aucune largeur de barre ne repare cela — le plus petit terme vaut un
    # vingt-deuxieme du total, il faudrait deux mille quatre cents pixels.
    # Les trois termes se lisent donc en toutes lettres sous le titre de la
    # rangee, et les segments gardent leur separation, tracee maintenant en
    # gris au lieu d'etre invisible.
    #
    # Les deux rangees sont posees sur des etages calcules : titre et prix
    # observe sur la meme ligne, termes et ecart sur la suivante, puis la
    # barre, puis la regle. Rien n'est plus ecrit a la main.
    carres = []
    for rangee_n, (surface, pieces, observe) in enumerate(CALCUL):
        Y = 84.0 + rangee_n * 180.0
        parts = [(CALCUL_W1 * surface, f"{fr(CALCUL_W1)} × {fr(surface)}"),
                 (CALCUL_W2 * pieces, f"{fr(CALCUL_W2)} × {fr(pieces)}"),
                 (CALCUL_B, f"b = {fr(CALCUL_B)}")]
        total = sum(v for v, _ in parts)
        ecart = abs(observe - total)
        carres.append(ecart * ecart)
        y = Y + 80.55          # la ligne mediane de la barre

        o.append(txt(60, Y, f"{fr(surface)} m² · {fr(pieces)} p.", TEXTE_MIN,
                     ENCRE, graisse=600))
        o.append(txt(60, Y + pas(), " + ".join(l for _, l in parts), TEXTE_MIN,
                     GRIS_58))

        depart = x0
        for valeur, libelle in parts:
            l = valeur * ech
            o.append(rect(depart, y - 18, l, 36, GRIS_40, 1.2, GRIS_14))
            depart += l
        regle(y + 42)

        # Le prix observe, et l'ecart qui reste entre la barre et lui.
        xo = x0 + observe * ech
        o.append(ligne(xo, y - 34, xo, y + 48, BRIQUE, 2.0, "5 5", filet=True))
        o.append(txt(xo, Y, f"prix observé {fr(observe)}", TEXTE_MIN, BRIQUE,
                     "middle", 600))
        xt = x0 + total * ech
        o.append(ligne(min(xt, xo), y, max(xt, xo), y, BRIQUE, 3.0, filet=True))
        o.append(txt((xt + xo) / 2, Y + pas(),
                     f"écart {fr(ecart)}", TEXTE_MIN, BRIQUE, "middle", 700))
        o.append(txt(x0 + larg + 14, y + 10, f"= {fr(total)}", TEXTE_MIN, ENCRE,
                     graisse=700))

    # Les deux carres, et leur moyenne : la note du jeu de parametres. Les
    # cotes sont dans le rapport des racines, donc les AIRES dans celui des
    # nombres ecrits dedans.
    o.append(ligne(60, 424, 1320, 424, GRIS_24, 1.5, filet=True))
    moyenne = sum(carres) / len(carres)
    cote_max, sol = 150.0, 612.0
    x = 150.0
    for aire in carres:
        c = cote_max * (aire / max(carres)) ** 0.5
        o.append(rect(x, sol - c, c, c, BRIQUE, 2.0, PAPIER))
        o.append(txt(x + c / 2, sol - c / 2 + 8, fr(aire), TEXTE_MIN, BRIQUE,
                     "middle", 700))
        x += 260
    o.append(txt(60, 456, "l'écart, au carré", TEXTE_MIN, GRIS_58))
    o.append(txt(700, 520, "la note : la moyenne des deux aires", TEXTE_MIN, ENCRE))
    o.append(txt(700, 566, f"({fr(carres[0])} + {fr(carres[1])}) ⁄ 2 = "
                           f"{fr(moyenne)}", TEXTE_MIN, BRIQUE, graisse=700))
    return document(1380, 640, o)


# ── Figure 14 · le chemin du chapitre, ses huit jalons ──────────────────────
#
# HUIT, ET NON SEPT. La scene disait « sept jalons » sous huit bornes.


def fig14_le_chemin_du_chapitre() -> str:
    o = entete(40, 40, "le chemin du chapitre, jalon par jalon", 1300)

    # `ecart` et non `pas` : `pas()` est la fonction d'interligne du fichier, et
    # une variable du meme nom la masquerait dans toute la fonction.
    x0, x1, y = 110.0, 1270.0, 176.0
    ecart = (x1 - x0) / (len(JALONS) - 1)
    import math as _m

    points = [(x0 + k * ecart, y + 26 * _m.sin(k * 1.1)) for k in range(len(JALONS))]
    for k in range(len(points) - 1):
        o.append(ligne(*points[k], *points[k + 1], ENCRE, 2.4))
    for k, ((base, exposant, _), (px, py)) in enumerate(zip(JALONS, points)):
        o.append(pt(px, py, 7.0, ENCRE))
        morceaux = [(base, "")] + ([(exposant, "bas")] if exposant else [])
        o.append(txt_riche(px, py - 34, morceaux, BASE_INDICE, ENCRE, "middle", 600))

    # LE RAPPEL GARDE SES QUATRE COLONNES, mais la glose s'y coupe. « la perte
    # sur un exemple » demande 417 pixels a 33 px ; la colonne en offre 224 une
    # fois le numero et le symbole poses, et la glose entrait dans la colonne
    # voisine — la huitieme sortait du cadre. Les deux rangees sont espacees de
    # 94, la hauteur d'un symbole a 49 plus une glose de deux lignes.
    GLOSE_L = 224.0
    o.append(ligne(60, 240, 1320, 240, GRIS_24, 1.5, filet=True))
    for k, (base, exposant, glose) in enumerate(JALONS):
        cx = 90.0 + (k % 4) * 320.0
        cy = 290.0 + (k // 4) * 94.0
        o.append(txt(cx, cy, f"{k + 1}", TEXTE_MIN, GRIS_40, graisse=600))
        morceaux = [(base, "")] + ([(exposant, "bas")] if exposant else [])
        o.append(txt_riche(cx + 32, cy, morceaux, BASE_INDICE, ENCRE, graisse=600))
        o += bloc(cx + 96, cy, glose, GLOSE_L, TEXTE_MIN, GRIS_58)

    o.append(ligne(60, 448, 1320, 448, BRIQUE, 2.0, filet=True))
    o.append(txt(60, 484, f"{len(JALONS)} jalons, un seul chemin", TEXTE_MIN,
                 BRIQUE, graisse=600))
    return document(1380, 500, o)


# ── Figure 15 · programmer, ou apprendre ────────────────────────────────────


def fig15_le_renversement() -> str:
    o = entete(40, 40, "programmer des règles, ou les apprendre", 1300)

    def schema(y: float, entrees, sortie, quoi: str, teinte: str) -> None:
        o.append(txt(60, y - 74, quoi, TEXTE_MIN, GRIS_58, graisse=600))
        for k, nom in enumerate(entrees):
            o.append(rect(150, y - 52 + k * 74, 260, 56, ENCRE, 2.4, PAPIER))
            o.append(txt(280, y - 16 + k * 74, nom, TEXTE_MIN, ENCRE, "middle", 600))
        o.append(fleche(430, y - 4, 700, y - 4, GRIS_58, 2.4))
        o.append(rect(720, y - 32, 340, 56, teinte, 2.6, PAPIER))
        o.append(txt(890, y + 4, sortie, TEXTE_MIN, teinte, "middle", 600))

    schema(160, *RENVERSEMENT[0], "on programme", ENCRE)
    o.append(ligne(60, 268, 1320, 268, GRIS_24, 1.5, filet=True))
    schema(376, *RENVERSEMENT[1], "on apprend", BRIQUE)
    return document(1380, 500, o)


# ── Figure 16 · y observe, y chapeau predit ─────────────────────────────────


def fig16_y_et_y_chapeau() -> str:
    o = entete(40, 40, "y relevé, ŷ prédit, et ce qui les sépare", 1300)

    # Le plan se resserre de 780 a 620 pour laisser au panneau de droite la
    # largeur qu'il lui faut : « y, relevé chez le notaire » demande 454 pixels
    # a 33 px, et le panneau en offrait 340, valeur comprise. Le libelle en
    # sortait par la droite du cadre et se posait sur sa propre valeur.
    gx, gy, gl, gh = 110.0, 110.0, 620.0, 330.0

    def point(s: float, p: float) -> tuple[float, float]:
        u = (s - Y_XMIN) / (Y_XMAX - Y_XMIN)
        v = (p - Y_YMIN) / (Y_YMAX - Y_YMIN)
        return gx + u * gl, gy + gh - v * gh

    o.append(ligne(gx, gy + gh, gx + gl, gy + gh, ENCRE, 2.4))
    o.append(ligne(gx, gy, gx, gy + gh, ENCRE, 2.4))
    o.append(txt(gx + gl, gy + gh + 44, "surface (m²)", TEXTE_MIN, GRIS_58, "end"))
    o.append(txt(gx + 18, gy - 26, "prix (k€)", TEXTE_MIN, GRIS_58))

    w, b = Y_THETA
    a1, a2 = point(Y_XMIN, w * Y_XMIN + b), point(Y_XMAX, w * Y_XMAX + b)
    o.append(ligne(*a1, *a2, ENCRE, 3.2))

    predit = w * Y_X0 + b
    px, py = point(Y_X0, Y_Y0)
    _, qy = point(Y_X0, predit)
    o.append(ligne(gx, py, px, py, GRIS_40, 1.6, "5 5"))
    o.append(ligne(px, gy + gh, px, py, GRIS_40, 1.6, "5 5"))
    o.append(ligne(px, py, px, qy, BRIQUE, 4.0, filet=True))
    o.append(pt(px, py, 8.0, ENCRE))
    o.append(pt(px, qy, 7.0, BRIQUE))
    o.append(txt(px - 16, py - 26,
                 f"y − ŷ = {fr(Y_Y0 - predit)}", TEXTE_MIN, BRIQUE, "end", 700))

    # Le panneau : un libelle coupe a sa colonne, sa valeur cadree a droite sur
    # la PREMIERE ligne du libelle. La rangee suivante descend d'autant de
    # pas() que le libelle a pris de lignes.
    cx, panneau = 790.0, 550.0
    libelle_l = 276.0
    o += entete(cx, 110, "sur cet appartement", panneau)
    lignes = [
        ("le modèle", f"ŷ = {fr(w)} x + {fr(b)}"),
        ("surface", f"{fr(Y_X0)} m²"),
        ("y, relevé chez le notaire", f"{fr(Y_Y0)} k€"),
        ("ŷ, ce que le modèle dit", f"{fr(predit)} k€"),
    ]
    y = 160.0
    for quoi, valeur in lignes:
        coupe = couper(quoi, libelle_l)
        o += colonne(cx, y, coupe, TEXTE_MIN, GRIS_58)
        o.append(txt(cx + panneau, y, valeur, TEXTE_MIN, ENCRE, "end", 600))
        y += len(coupe) * pas()
    o.append(ligne(cx, 400, cx + panneau, 400, GRIS_24, 1.5, filet=True))
    o.append(txt(cx, 434, "l'écart", TEXTE_MIN, GRIS_58))
    o.append(txt(cx + panneau, 434, fr(Y_Y0 - predit), TEXTE_MIN, BRIQUE, "end", 700))
    o.append(txt(cx, 478, "y est un fait, ŷ un avis", TEXTE_MIN, ENCRE, graisse=600))
    return document(1380, 500, o)


# ── Figure 17 · trois boutons, et ce que chacun fait ────────────────────────


def fig17_les_trois_boutons() -> str:
    o = entete(40, 40, "trois boutons, lisibles tous les trois",
               1300)
    w1, w2, b = B_THETA
    pieces = sum(p for _, p, _ in B_VENTES) / len(B_VENTES)

    def panneau(x0: float, nom: str, bas: float, haut: float) -> None:
        pl, ph, py = 360.0, 250.0, 130.0
        o.append(rect(x0, py, pl, ph, GRIS_24, 1.6, PAPIER))

        def pos(s: float, p: float) -> tuple[float, float]:
            u = (s - B_XMIN) / (B_XMAX - B_XMIN)
            v = (p - B_YMIN) / (B_YMAX - B_YMIN)
            return x0 + u * pl, py + ph - v * ph

        def droite(t1: float, t2: float, t3: float, trait: str, ep: float,
                   tirets=None) -> None:
            # La droite est CLIPEE au panneau : hors du cadre, elle mentirait
            # sur ce que le plan montre.
            pts = []
            for s in (B_XMIN, B_XMAX):
                p = t1 * s + t2 * pieces + t3
                pts.append((s, min(max(p, B_YMIN), B_YMAX)))
            o.append(ligne(*pos(*pts[0]), *pos(*pts[1]), trait, ep, tirets))

        for reglage, valeur in ((nom, bas), (nom, haut)):
            t = {"w₁": (valeur, w2, b), "w₂": (w1, valeur, b),
                 "b": (w1, w2, valeur)}[reglage]
            droite(*t, BRIQUE, 2.0, "6 5")
        droite(w1, w2, b, ENCRE, 3.0)
        for surface, _, prix in B_VENTES:
            o.append(pt(*pos(surface, prix), 6.0, ENCRE))

        # Le nom tenait en 34 pixels et la course s'y posait ; la ligne du
        # dessous suivait a 28. Les deux se calculent maintenant : la chasse
        # du nom pour l'un, pas() pour l'autre.
        pied = py + ph + 34
        o.append(txt(x0, pied, nom, TEXTE_MIN, BRIQUE, graisse=700))
        o.append(txt(x0 + largeur_texte(nom) + 18, pied,
                     f"de {fr(bas)} à {fr(haut)}", TEXTE_MIN, ENCRE))
        o.append(txt(x0, pied + pas(),
                     f"posé à {fr({'w₁': w1, 'w₂': w2, 'b': b}[nom])}", TEXTE_MIN,
                     GRIS_58))

    for k, (nom, moins, plus) in enumerate(B_ECARTS):
        base = {"w₁": w1, "w₂": w2, "b": b}[nom]
        panneau(70.0 + k * 430.0, nom, base + moins, base + plus)

    return document(1380, 500, o)


# ── Figure 18 · le partitionnement, avant et apres ──────────────────────────


def fig18_le_partitionnement() -> str:
    points, groupes, centres = _k_moyennes()
    o = entete(40, 40, "les k moyennes, avant et après", 1300)

    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    bx0, bx1 = min(xs) - 0.6, max(xs) + 0.6
    by0, by1 = min(ys) - 0.6, max(ys) + 0.6

    def panneau(x0: float, colore: bool) -> None:
        pl, ph, py = 540.0, 330.0, 120.0
        o.append(rect(x0, py, pl, ph, GRIS_40, 1.6, PAPIER))

        def pos(p) -> tuple[float, float]:
            u = (p[0] - bx0) / (bx1 - bx0)
            v = (p[1] - by0) / (by1 - by0)
            return x0 + u * pl, py + ph - v * ph

        for p, g in zip(points, groupes):
            x, y = pos(p)
            if not colore:
                o.append(pt(x, y, 5.0, GRIS_40))
            elif g == 0:
                o.append(pt(x, y, 5.5, ENCRE))
            elif g == 1:
                o.append(pt(x, y, 5.5, BRIQUE))
            else:
                o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5.0" '
                         f'fill="{PAPIER}" stroke="{ENCRE}" '
                         f'stroke-width="2.0"/>')
        for k, c in enumerate(K_DEPARTS if not colore else centres):
            x, y = pos(c)
            teinte = (ENCRE, BRIQUE, ENCRE)[k]
            fond = PAPIER if k == 2 else teinte
            o.append(rect(x - 8, y - 8, 16, 16, teinte, 2.4, fond))

    panneau(70.0, False)
    panneau(770.0, True)
    o.append(txt(70, 100, "54 points, trois centres au hasard",
                 TEXTE_MIN, ENCRE, graisse=600))
    o.append(txt(770, 100, "après quatre tours",
                 TEXTE_MIN, ENCRE, graisse=600))
    o.append(txt(70, 486, "aucune étiquette, des positions", TEXTE_MIN,
                 GRIS_58))
    tailles = [sum(1 for g in groupes if g == k) for k in range(3)]
    o.append(txt(770, 486, "trois groupes de "
                 + " · ".join(str(t) for t in tailles), TEXTE_MIN, GRIS_58))
    return document(1380, 540, o)


# ── Figure 19 · le paysage des scores ───────────────────────────────────────
#
# ELLE N'A JAMAIS ETE UNE ANIMATION. `optim.py` declare LePaysageDesScores en
# disant lui-meme « Rien ne bouge : tout est pose ensemble » et « au sens de la
# regle 18 cette scene est un schema ». Elle est restee « a rendre » sur la
# page 6 pendant tout ce temps ; elle est ici, et la page ne montre plus un
# cadre vide.
#
# LA COURBE SE CALCULE, elle n'est pas dessinee a vue : c'est la perte
# moyenne des deux ventes du fil conducteur quand b seul varie, w1 et w2
# restant a 3 et 10. Les trois altitudes que la declaration annonce -- 362,50
# au depart, 62,50 pour theta_A, 56,25 au fond -- en sortent exactement, et le
# fond tombe bien en b = 22,5, qui est theta_B.

PAYSAGE_B0, PAYSAGE_B1 = 5.0, 40.0
PAYSAGE_A, PAYSAGE_B = 20.0, 22.5


def _perte(b: float) -> float:
    """La perte moyenne des deux ventes, w1 et w2 fixes, b seul variant."""
    return sum((prix - (CALCUL_W1 * s + CALCUL_W2 * n + b)) ** 2
               for s, n, prix in CALCUL) / len(CALCUL)


def fig19_le_paysage_des_scores() -> str:
    o = entete(40, 40, "le paysage des scores",
               1300)

    # Le plan se resserre de 800 a 620 : le panneau de droite en avait 300
    # pour un titre qui en demande 490 et des libelles qui en demandent 566 a
    # la taille d'un symbole indice. Tout en sortait par la droite du cadre.
    gx, gy, gl, gh = 150.0, 110.0, 620.0, 380.0
    hauts = [_perte(PAYSAGE_B0), _perte(PAYSAGE_B1)]
    pmax, pmin = max(hauts), _perte(PAYSAGE_B)

    # LE PLANCHER DE L'ECHELLE. Sans lui, le fond de la cuvette tombe
    # EXACTEMENT sur l'axe des abscisses — v vaut zero au minimum — et tout ce
    # qui nomme ce fond se pose sur l'axe : c'est ce que le relecteur a vu,
    # « θ B » sur l'axe et « le plus bas de cette coupe » sur le pointille.
    # Trente pour cent de l'etendue sous le minimum degagent une bande de
    # quatre-vingt-huit pixels entre le fond et l'axe. Il en faut au moins
    # soixante-quatorze : une etiquette a indice se compose a 49, et le crible
    # lui demande un quart de son corps de blanc de chaque cote. Aucune valeur
    # ne change — c'est l'echelle qui respire, pas la courbe.
    plancher = pmin - 0.30 * (pmax - pmin)

    def pos(b: float, perte: float) -> tuple[float, float]:
        u = (b - PAYSAGE_B0) / (PAYSAGE_B1 - PAYSAGE_B0)
        v = (perte - plancher) / (pmax - plancher)
        return gx + u * gl, gy + gh - v * gh

    o.append(ligne(gx, gy + gh, gx + gl, gy + gh, ENCRE, 2.4))
    o.append(ligne(gx, gy, gx, gy + gh, ENCRE, 2.4))
    o.append(txt(gx + gl, gy + gh - 28, "le biais b", TEXTE_MIN, ENCRE_75, "end"))
    o.append(txt(gx, gy - 16, "la note du réglage", TEXTE_MIN, ENCRE_75))

    # La cuvette, echantillonnee assez fin pour qu'aucun angle ne se voie.
    echantillon = (PAYSAGE_B1 - PAYSAGE_B0) / 120
    precedent = pos(PAYSAGE_B0, _perte(PAYSAGE_B0))
    for k in range(1, 121):
        b = PAYSAGE_B0 + k * echantillon
        courant = pos(b, _perte(b))
        o.append(ligne(*precedent, *courant, ENCRE, 3.2))
        precedent = courant

    # Le fond, et les deux candidats.
    xf, yf = pos(PAYSAGE_B, pmin)
    # Le pointille EST ce que la cote nomme : c'est son filet.
    o.append(ligne(gx, yf, gx + gl, yf, ENCRE_30, 1.8, "6 6", filet=True))
    # La cote du fond passe SOUS l'axe : la bande degagee entre le fond de la
    # cuvette et l'axe sert aux deux etiquettes, qui doivent rester pres de
    # leurs points.
    o.append(txt(gx + 12, gy + gh + 36, "le plus bas de cette coupe", TEXTE_MIN,
                 ENCRE_55, "start"))

    xa, ya = pos(PAYSAGE_A, _perte(PAYSAGE_A))
    o.append(pt(xa, ya, 8.0, ENCRE))
    # UN SEUL ELEMENT, ET UN VRAI INDICE. Ces deux etiquettes s'ecrivaient en
    # DEUX <text> voisins, « θ » cadre a droite et « A » cale a gauche dix-huit
    # pixels plus loin : un indice compose a la main, que le panneau de droite
    # de cette figure meme compose correctement. `txt_riche` le fait en un
    # element, l'indice a 0,68 de la base.
    o.append(txt_riche(gx + 180, gy + gh - 28, [("θ", ""), ("A", "bas")],
                       BASE_INDICE, ENCRE, "start", 700))
    o.append(pt(xf, yf, 8.0, BRIQUE))
    o.append(txt_riche(gx + 370, gy + gh - 28, [("θ", ""), ("B", "bas")],
                       BASE_INDICE, BRIQUE, "start", 700))

    x0, y0 = pos(PAYSAGE_B0, _perte(PAYSAGE_B0))
    o.append(ligne(x0, y0, x0 + 26, y0, BRIQUE, 2.4))

    # Les trois altitudes, cotees a droite. Elles sortent de `_perte`, comme
    # la courbe : aucune n'est recopiee.
    cx, lc = 820.0, 520.0
    o += entete(cx, 150, "trois réglages, trois notes", lc)
    reglages = [
        ([("au départ du balayage", "")], PAYSAGE_B0),
        ([("θ", ""), ("A", "bas")], PAYSAGE_A),
        ([("θ", ""), ("B", "bas")], PAYSAGE_B),
    ]
    # Le reglage sur une ligne avec sa note, le biais sur la suivante : cote a
    # cote ils demandaient plus que la colonne.
    for k, (libelle, b) in enumerate(reglages):
        y = 220 + k * 106
        # Un libelle SANS indice se compose au plancher : « au départ du
        # balayage » a la taille d'un symbole indice demande 566 pixels, et la
        # colonne en offre 520, la note comprise.
        if any(style for _, style in libelle):
            o.append(txt_riche(cx, y, libelle, BASE_INDICE, ENCRE, graisse=600))
        else:
            o.append(txt(cx, y, "".join(c for c, _ in libelle), TEXTE_MIN,
                         ENCRE, graisse=600))
        o.append(txt(cx, y + 52, f"b = {fr(b)}", TEXTE_MIN, ENCRE_55))
        o.append(txt(cx + lc, y, fr(round(_perte(b), 2)), TEXTE_MIN, BRIQUE,
                     "end", 700))

    # LES DEUX LIGNES DE PIED SONT PARTIES. « apprendre, c'est chercher le fond
    # de cette cuvette » et « comment on descend : chapitre 3 » sont, mot pour
    # mot, le paragraphe que la page 6 pose juste sous cette figure — b-p5-13.
    # C'est la regle 19 : aucun texte ne dit ce qu'une figure voisine montre, et
    # ici c'etait la figure qui redisait le texte.
    return document(1380, 540, o)


# ── Ce qu'on ecrit, et ce qu'on annonce ─────────────────────────────────────

FIGURES = {
    # 470 -> 560 : recomposee a l'interligne, et servie par aucune page — sa
    # hauteur est donc libre. Toutes les autres sont figees par le bloc image
    # de leur page, qui porte `hauteur`.
    "l1-fig1-prerequis.svg": (fig1_prerequis, 1380, 560),
    # 340 -> 430 : recomposee a l'interligne, et servie par aucune page.
    "l1-fig2-carte.svg": (fig2_carte, 1380, 430),
    "l1-fig3-apports.svg": (fig3_apports, 1380, 430),
    "l1-fig4-deux-carres.svg": (fig4_deux_carres, 1380, 430),
    "l1-fig5-quadrillage.svg": (fig5_quadrillage, 1380, 470),
    # 400 -> 600 : voir la docstring. Le bloc image de la page 7
    # porte encore 400, et il reste a la remettre d'accord.
    "l1-fig6-trois-jeux.svg": (fig6_trois_jeux, 1380, 600),
    # 470 -> 620 : la cote descend sous son libelle. Le bloc image de la
    # page 8 porte 470, et il reste a le remettre d'accord.
    "l1-fig7-deux-codages.svg": (fig7_deux_codages, 1380, 620),
    # 350 -> 560 : recomposee a l'interligne, servie par aucune page.
    "l1-fig8-ecart-des-ensembles.svg": (fig8_ecart_des_ensembles, 1380, 560),
    "l1-fig9-des-mots-aux-objets.svg": (fig9_des_mots_aux_objets, 1380, 480),
    "l1-fig10-du-formalisme-au-code.svg":
        (fig10_du_formalisme_au_code, 1380, 560),
    "l1-fig11-verifier-les-dimensions.svg":
        (fig11_verifier_les_dimensions, 1380, 520),
    "l1-fig12-trois-reglages-cent-mille.svg":
        (fig12_trois_reglages_cent_mille, 1380, 600),
    "l1-fig13-le-calcul-a-la-main.svg": (fig13_le_calcul_a_la_main, 1380, 640),
    "l1-fig14-le-chemin-du-chapitre.svg":
        (fig14_le_chemin_du_chapitre, 1380, 500),
    "l1-fig15-le-renversement.svg": (fig15_le_renversement, 1380, 500),
    "l1-fig16-y-et-y-chapeau.svg": (fig16_y_et_y_chapeau, 1380, 500),
    "l1-fig17-les-trois-boutons.svg": (fig17_les_trois_boutons, 1380, 560),
    "l1-fig18-le-partitionnement.svg": (fig18_le_partitionnement, 1380, 540),
    "l1-fig19-le-paysage-des-scores.svg":
        (fig19_le_paysage_des_scores, 1380, 540),
}


def main() -> None:
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    SORTIE.mkdir(parents=True, exist_ok=True)
    for nom, (fabrique, largeur, hauteur) in FIGURES.items():
        cible = SORTIE / nom
        cible.write_text(fabrique(), encoding="utf-8")
        print(f"  ✓ {cible.relative_to(SORTIE.parents[2])}  {largeur} × {hauteur}")


if __name__ == "__main__":
    main()
