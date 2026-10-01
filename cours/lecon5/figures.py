"""Chapitre 5 : les quinze figures fixes.

    python cours/lecon5/figures.py

CE FICHIER N'ECRIT AUCUN NOMBRE A LA MAIN. Il importe cours/lecon5/mesures.py
et se sert de SES fonctions -- MINUSCULE, avant_minuscule, arriere_minuscule,
produit_deroule, multiplications -- de sorte que chaque valeur affichee par une
figure sort du programme de mesures du chapitre.

Le chapitre 5 calcule a la main sur un reseau 1-1-1-1 dont les sept valeurs
sont FIGEES, pas tirees : aucun entrainement ne tourne ici, et les figures se
refont en une fraction de seconde. Le compte des multiplications du reseau
profond est arithmetique : M.multiplications ne lit aucune donnee.

LE TRAIT -- palette, primitives SVG -- vient de cours/schema.py, commun aux
figures de tout le parcours.

LE PLANCHER DE LA REGLE 32. Tout texte est compose a 33 au moins et porte
quarante caracteres au plus ; `txt`, `txt_indice` et `entete` sont enveloppes
plus bas et REFUSENT ce qui passe dessous, comme dans cours/lecon2/figures.py.
A 33, un texte prend deux fois la place qu'il prenait a 15 : la largeur, elle,
n'a pas bouge. Une figure porte donc MOINS d'etiquettes, et tout ce qui est une
phrase est descendu dans la legende du bloc `image`.

LES QUATRE MATRICES -- fig09, fig11, fig10, fig14 -- se montrent en TABLEAU DE
COEFFICIENTS : une grille de nombres ou de symboles, ses crochets, ses indices
de ligne et de colonne, et des zeros ECRITS la ou il y a des zeros. Une boite
portant « W » et « 4 × 5 » est une dimension, pas une matrice.

LES TAILLES DE GRILLE SONT UNE CONVENTION, PAS UNE MESURE. W fait 4 lignes sur
5 colonnes -- D_L et D_PREC, comme la scene lordre-des-indices-se-verifie -- et
les deux jacobiennes font 4 sur 4, carrees et de la taille de la couche, pour
que la diagonale et le contre-exemple du softmax se comparent case a case. Les
textes alternatifs des pages 9 et 10 decrivent ces tailles : on ne s'en ecarte
pas sans les reecrire.

L'INTERLIGNE ne s'ecrit jamais a la main : `pas(taille)` de schema.py.
"""

from __future__ import annotations

import math
import sys
import time
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import mesures as M  # noqa: E402

from schema import (  # noqa: E402
    BRIQUE,
    ENCRE,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    GRIS_72,
    MOINS,
    PAPIER,
    colonne,
    couper,
    document,
    ent,
    entete,
    fleche,
    largeur_texte,
    ligne,
    nb,
    pas,
    rect,
    suspension,
    txt,
    txt_indice,
)

SORTIE = Path(__file__).resolve().parents[2] / "public" / "cours" / "lecon5"


# ── La taille minimale d'un texte de figure ─────────────────────────────────
#
# LA MESURE, refaisable en deux `grep`. Le corps d'une leçon est composé à
# `text-[0.9375rem]`, soit 15 px : src/composants/academy/blocs/prose.tsx.
# L'article qui le porte est en `max-w-[44rem]` avec `lg:px-8`, donc une
# colonne de 44 x 16 - 2 x 32 = 640 px. Une figure y est servie en `w-full`
# (blocs/Statiques.tsx, BImage), et un SVG large de 1380 s'y affiche donc
# reduit de 1380 / 640 = 2,156.
#
#     TEXTE_MIN = 15 x 1380 / 640 = 32,3  ->  33
#
# CE N'EST PAS UN PLANCHER QU'ON PEUT FRANCHIR. `txt` refuse une taille plus
# petite au lieu de la composer, et refuse aussi un texte de plus de quarante
# caracteres : une figure illisible ne se voit pas dans un diff, et se voit
# tres bien chez l'etudiant. C'est la regle 32.
CORPS_PX = 15          # prose.tsx, text-[0.9375rem]
COLONNE_PX = 640       # max-w-[44rem] moins lg:px-8
LARGEUR_SVG = 1380     # toutes les figures du cours
TEXTE_MIN = -(-CORPS_PX * LARGEUR_SVG // COLONNE_PX)   # 33, arrondi au-dessus
CARACTERES_MAX = 40

# Le controle mecanique : node outils/verifier-figures.mjs


# `txt` vient de schema.py, commun a tout le parcours. On l'enveloppe ici
# plutot que de le modifier la-bas : le plancher est une regle du COURS, et
# schema.py sert aussi a des figures qui ne sont pas servies dans une colonne
# de 640.
_entete_brut = entete


def entete(x, y, texte, largeur=360):  # noqa: F811
    """Le titre d'un panneau, au plancher, COUPE A LA LARGEUR DU PANNEAU.

    `schema.entete` le compose a 17 et ne le coupe pas. A 33 il se coupe, et le
    filet passe sous la derniere ligne.
    """
    lignes = couper(texte, largeur, TEXTE_MIN)
    dessous = y + (len(lignes) - 1) * pas(TEXTE_MIN) + 14
    return colonne(x, y, lignes, TEXTE_MIN, GRIS_58, graisse=600) + [
        ligne(x, dessous, x + largeur, dessous, GRIS_24, 1.5, filet=True),
    ]


_txt_brut = txt


def txt(x, y, contenu, taille=TEXTE_MIN, couleur=ENCRE, ancre="start",
        graisse=400, italique=False):  # noqa: F811
    if taille < TEXTE_MIN:
        raise ValueError(
            f"texte de figure a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {contenu[:40]} ». Voir la regle 32."
        )
    if len(contenu) > CARACTERES_MAX:
        raise ValueError(
            f"texte de {len(contenu)} caracteres, plus de {CARACTERES_MAX} : "
            f"« {contenu} ». Il va dans la legende du bloc, pas dans l'image."
        )
    return _txt_brut(x, y, contenu, taille, couleur, ancre, graisse, italique)


# `txt_indice` compose son indice a 0,68 fois la base : pour que l'indice
# atteigne le plancher, la base doit valoir 33 / 0,68, soit 49.
BASE_INDICE = -(-TEXTE_MIN * 100 // 68)   # 49

_indice_brut = txt_indice


def txt_indice(x, y, base, indice, suite="", taille=BASE_INDICE, couleur=ENCRE,
               ancre="start", graisse=400):  # noqa: F811
    if taille * 0.68 < TEXTE_MIN:
        raise ValueError(
            f"indice compose a {taille * 0.68:.1f}, sous le plancher "
            f"{TEXTE_MIN} : « {base}{indice} ». Base minimale {BASE_INDICE}."
        )
    if len(base) + len(indice) + len(suite) > CARACTERES_MAX:
        raise ValueError(
            f"texte de plus de {CARACTERES_MAX} caracteres : "
            f"« {base}{indice}{suite} »."
        )
    return _indice_brut(x, y, base, indice, suite, taille, couleur, ancre,
                        graisse)


T = TEXTE_MIN
PAS = pas(T)          # 44,55 : l'interligne du chapitre, jamais une constante


# ═══════════════════════════════════════════════════════════════════════════
# LES MESURES
# ═══════════════════════════════════════════════════════════════════════════


def mesurer() -> dict:
    """La mesure 1 du chapitre, et le compte de la mesure 5."""
    p = dict(M.MINUSCULE)
    c = M.avant_minuscule(p)
    g = M.arriere_minuscule(p, c)

    # Les trois derivees constitutives de la derniere couche, ecrites comme
    # mesures.py les ecrit, section « les trois derivees constitutives ».
    dz_dw = c["a2"]
    da_dz = c["a3"] * (1.0 - c["a3"])
    dl_da = (c["a3"] - p["y"]) / da_dz

    return {
        "p": p, "c": c, "g": g,
        "trois": (dz_dw, da_dz, dl_da),
        "produit": dl_da * da_dz * dz_dw,
        "court": c["a3"] - p["y"],
        "deroule": M.produit_deroule(p, c),
        # M.multiplications est arithmetique : elle ne lit aucune donnee et ne
        # construit aucun reseau. C'est le compte de la mesure 5.
        "cout": M.multiplications(M.LARGEURS),
        "largeurs": M.LARGEURS,
    }


# ── Les briques propres a ce chapitre ───────────────────────────────────────

# Trois natures, trois teintes. Un parametre s'ajuste, une donnee est fournie,
# une quantite calculee ne se touche pas.
NATURES = {
    "parametre": BRIQUE,
    "donnee": GRIS_58,
    "calcule": ENCRE,
}

E1, E2, E3 = "⁽¹⁾", "⁽²⁾", "⁽³⁾"
EL, ELM, ELP, EGL = "⁽ˡ⁾", "⁽ˡ⁻¹⁾", "⁽ˡ⁺¹⁾", "⁽ᴸ⁾"
IND = "₁₂₃₄₅"


def case(x, y, w, h, lignes, couleur=ENCRE, fond=PAPIER, ep=2.4) -> list[str]:
    """Une case : son cadre, son fond, et une ou deux lignes CENTREES DEDANS.

    Les lignes s'empilent de `pas(T)`, et la pile est centree sur la hauteur de
    la case : a 33, deux lignes demandent 104 pixels de haut pour que l'encre
    ne morde pas le cadre.
    """
    o = [rect(x, y, w, h, couleur, ep, fond)]
    depart = y + h / 2 + 11 - (len(lignes) - 1) * PAS / 2
    for k, l in enumerate(lignes):
        contenu, teinte = l if isinstance(l, tuple) else (l, couleur)
        o.append(txt(x + w / 2, depart + k * PAS, contenu, T, teinte, "middle",
                     600))
    return o


def rond(x, y, r, nom, couleur=ENCRE, ep=2.6, fond=PAPIER,
         graisse=600) -> list[str]:
    """Un neurone : son rond, et son nom pose sur la ligne mediane."""
    return [
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{fond}" '
        f'stroke="{couleur}" stroke-width="{ep}"/>',
        txt(x, y + 11, nom, T, couleur, "middle", graisse),
    ]


def arc(x1, y1, r1, x2, y2, r2, couleur=ENCRE, ep=2.4, marge=12) -> str:
    """Une fleche d'un rond a l'autre, rognee aux deux bords.

    C'est un FILET au sens du crible, comme toute fleche de schema.py : elle
    porte l'operation qu'elle nomme. La marge la tient a l'ecart des ronds.
    """
    a = math.atan2(y2 - y1, x2 - x1)
    return fleche(x1 + (r1 + marge) * math.cos(a),
                  y1 + (r1 + marge) * math.sin(a),
                  x2 - (r2 + marge) * math.cos(a),
                  y2 - (r2 + marge) * math.sin(a), couleur, ep, 13)


def legende(x, y, items, ecart=52) -> list[str]:
    """Les natures, chacune sous sa teinte. Les pastilles sont calees sur la
    largeur MESUREE du texte qui precede, jamais sur un pas constant."""
    o, cx = [], x
    for couleur, texte in items:
        o.append(rect(cx, y - 24, 24, 24, "none", 0, couleur))
        o.append(txt(cx + 38, y, texte, T, GRIS_72))
        cx += 38 + largeur_texte(texte, T) + ecart
    return o


def crochets(x0, y0, x1, y1, dent=22.0, trait=ENCRE, ep=2.4) -> list[str]:
    """Les deux crochets d'une matrice.

    CE SONT DES FILETS, au meme titre que l'accolade de schema.py : un crochet
    est fait pour serrer les coefficients qu'il porte. La geometrie, elle,
    garde tout de meme ses distances -- voir `matrice`, qui les pose a plus
    d'une demi-etiquette des coefficients de bord.
    """
    o = []
    for x, sens in ((x0, 1), (x1, -1)):
        o += [
            ligne(x, y0, x, y1, trait, ep, filet=True),
            ligne(x, y0, x + dent * sens, y0, trait, ep, filet=True),
            ligne(x, y1, x + dent * sens, y1, trait, ep, filet=True),
        ]
    return o


def matrice(x0, y0, coeffs, cw, ch, teintes=None, ecart_crochet=20.0
            ) -> list[str]:
    """UNE MATRICE COMME UN TABLEAU DE COEFFICIENTS.

    Une grille de textes, ses crochets, ses indices de ligne et de colonne. Les
    zeros sont ECRITS : c'est eux qu'on regarde sur une jacobienne diagonale, et
    leur absence qu'on regarde sur celle du softmax.

    Aucune case n'est dessinee. Un quadrillage ferait un tableau redessine --
    regle 20 -- et rapprocherait des traits des etiquettes pour rien.
    """
    n, m = len(coeffs), len(coeffs[0])
    o = []
    for i, rangee in enumerate(coeffs):
        base = y0 + ch / 2 + 11 + i * ch
        for j, coefficient in enumerate(rangee):
            teinte = teintes[i][j] if teintes else ENCRE
            o.append(txt(x0 + (j + 0.5) * cw, base, coefficient, T, teinte,
                         "middle", 600 if teinte in (ENCRE, BRIQUE) else 400))
    gauche, droite = x0 - ecart_crochet, x0 + m * cw + ecart_crochet
    o += crochets(gauche, y0, droite, y0 + n * ch)
    for j in range(m):
        o.append(txt(x0 + (j + 0.5) * cw, y0 - 25, str(j + 1), T, GRIS_58,
                     "middle"))
    for i in range(n):
        o.append(txt(gauche - 30, y0 + ch / 2 + 11 + i * ch, str(i + 1), T,
                     GRIS_58, "end"))
    return o


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 1 · page 1 · le reseau du calcul a la main
# ═══════════════════════════════════════════════════════════════════════════

L1, H1 = 1380, 720


def fig01_reseau(V: dict) -> str:
    p = V["p"]
    o = entete(60, 70, "le réseau du calcul à la main", 1300)

    milieu = 300.0
    haut = milieu - 52
    r = 58.0
    xs = [450.0, 760.0, 1070.0]

    o += case(60, haut, 170, 104, ["x", (nb(p["x"], 1), GRIS_72)], GRIS_58)
    for k, cx in enumerate(xs, start=1):
        o += rond(cx, milieu, r, f"a{(E1, E2, E3)[k - 1]}")
        o.append(txt(cx, milieu + r + 56, "ReLU" if k < 3 else "σ", T, GRIS_58,
                     "middle"))
    o += case(1240, haut, 120, 104, ["ℓ"])
    o += case(1240, haut + 190, 120, 104, ["y", (nb(p["y"], 0), GRIS_72)],
              GRIS_58)
    o.append(fleche(1300, haut + 186, 1300, haut + 112, GRIS_58, 2.2, 12))

    # Les six parametres, poses au-dessus et au-dessous de la fleche qui les
    # porte, hors de la bande des cases : un texte a cheval sur le bord d'un
    # aplat ne se lit pas.
    bords = [(230.0, 392.0), (508.0, 702.0), (818.0, 1012.0)]
    for k, (g, d) in enumerate(bords, start=1):
        o.append(fleche(g + 12, milieu, d - 12, milieu, ENCRE, 2.4, 13))
        cx = (g + d) / 2
        e = (E1, E2, E3)[k - 1]
        v = p[f"w{k}"]
        o.append(txt(cx, 222, f"w{e} = {nb(v, 1)}", T, BRIQUE, "middle", 600))
        b = p[f"b{k}"]
        signe = "" if b >= 0 else MOINS
        o.append(txt(cx, 386, f"b{e} = {signe}{nb(abs(b), 1)}", T, BRIQUE,
                     "middle", 600))
    o.append(fleche(1128, milieu, 1240 - 12, milieu, ENCRE, 2.4, 13))

    o.append(ligne(60, 600, 1320, 600, GRIS_24, 1.5, filet=True))
    o += legende(60, 660, [(BRIQUE, "ajustable"), (GRIS_58, "fourni"),
                           (ENCRE, "calculé")])
    return document(L1, H1, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 2 · page 2 · deux couches et ReLU, L couches et phi
# ═══════════════════════════════════════════════════════════════════════════

L2, H2 = 1380, 700


def fig02_du_cas_au_general(V: dict) -> str:
    p, c = V["p"], V["c"]
    o = entete(60, 70, "deux couches, et ReLU", 600)
    o += entete(760, 70, "L couches, et φ", 560)

    for panneau, contenus in (
        (340.0, [["x", (nb(p["x"], 1), GRIS_72)],
                 [f"a{E1}", (nb(c["a1"], 6), GRIS_72)],
                 [f"a{E2}", (nb(c["a2"], 6), GRIS_72)]]),
        (1040.0, [[f"a{ELM}"], [f"a{EL}"], [f"a{EGL}"]]),
    ):
        gauche = panneau - 150
        for k, lignes in enumerate(contenus):
            y = 170.0 + k * 174
            o += case(gauche, y, 300, 104, lignes)
            if k:
                o.append(fleche(panneau, y - 66, panneau, y - 14, GRIS_58,
                                2.4, 13))
                nom = ("ReLU", "ReLU") if panneau < 700 else ("φ", "φ")
                o.append(txt(panneau + 26, y - 30, nom[k - 1], T, GRIS_58))
        if panneau > 700:
            # Les couches sautees : trois ronds, jamais des points de suite.
            # Ils se posent DANS LA BANDE VIDE entre les deux dernieres cases,
            # a gauche de la fleche : c'est la que des couches manquent.
            o.append(suspension(panneau - 70, 170.0 + 2 * 174 - 35, GRIS_40,
                                5.0, 18.0))
    return document(L2, H2, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 3 · page 3 · une chaine sans embranchement, une a plusieurs chemins
# ═══════════════════════════════════════════════════════════════════════════

L3, H3 = 1380, 760


def fig03_deux_chaines(V: dict) -> str:
    o = entete(60, 70, "un seul chemin", 600)
    o += entete(760, 70, "plusieurs chemins", 560)

    # ── A gauche : la chaine w -> z -> a -> l ───────────────────────────────
    r = 52.0
    ay = 390.0
    xs = [140.0, 300.0, 460.0, 620.0]
    noms = [f"w{E3}", f"z{E3}", f"a{E3}", "ℓ"]
    for k, (x, nom) in enumerate(zip(xs, noms)):
        o += rond(x, ay, r, nom)
        if k:
            o.append(arc(xs[k - 1], ay, r, x, ay, r, ENCRE, 2.4, 6))
    o.append(txt(60, 690, "∂ℓ/∂w = ∂ℓ/∂a · ∂a/∂z · ∂z/∂w", T, ENCRE,
                 graisse=600))

    # ── A droite : l'embranchement ──────────────────────────────────────────
    #
    # QUATRE CHEMINS, parce que la couche l en compte quatre partout ailleurs
    # dans le chapitre -- fig09 et fig11, D_L. Une figure qui en montrerait
    # trois ferait croire a une autre couche.
    hub = (800.0, 390.0)
    cibles = [(1040.0, 210.0 + k * 120.0) for k in range(4)]
    fin = (1260.0, 390.0)
    for k, (x, y) in enumerate(cibles):
        o.append(arc(hub[0], hub[1], r, x, y, 46.0, BRIQUE, 2.4, 6))
        o.append(arc(x, y, 46.0, fin[0], fin[1], r, GRIS_58, 2.2, 6))
    o += rond(hub[0], hub[1], r, "aⱼ", BRIQUE, 3.0)
    for k, (x, y) in enumerate(cibles):
        o += rond(x, y, 46.0, f"z{IND[k]}")
    o += rond(fin[0], fin[1], r, "ℓ")
    o.append(txt(760, 690, "∂ℓ/∂aⱼ = Σᵢ ∂ℓ/∂zᵢ · ∂zᵢ/∂aⱼ", T, ENCRE,
                 graisse=600))
    return document(L3, H3, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 4 · page 4 · l'arbre des dependances
#
# C'est la figure centrale du chapitre : tout le calcul se lit dessus.
# ═══════════════════════════════════════════════════════════════════════════

L4, H4 = 1380, 1240

W_NOEUD, H_NOEUD = 210.0, 104.0
AXE, ECART = 690.0, 330.0
Y0_ARBRE, ENTRAXE = 120.0, 132.0


def _etage(k: int) -> float:
    return Y0_ARBRE + k * ENTRAXE


def fig04_arbre(V: dict) -> str:
    p, c = V["p"], V["c"]
    o = entete(60, 70, "l'arbre des dépendances", 1300)

    N = {
        "l": (AXE, _etage(0), "ℓ", nb(c["perte"], 6), "calcule"),
        "y": (AXE + ECART, _etage(0), "y", nb(p["y"], 0), "donnee"),
        "a3": (AXE, _etage(1), f"a{E3}", nb(c["a3"], 6), "calcule"),
        "z3": (AXE, _etage(2), f"z{E3}", nb(c["z3"], 6), "calcule"),
        "w3": (AXE - ECART, _etage(3), f"w{E3}", nb(p["w3"], 1), "parametre"),
        "a2": (AXE, _etage(3), f"a{E2}", nb(c["a2"], 6), "calcule"),
        "b3": (AXE + ECART, _etage(3), f"b{E3}", nb(p["b3"], 1), "parametre"),
        "z2": (AXE, _etage(4), f"z{E2}", nb(c["z2"], 6), "calcule"),
        "w2": (AXE - ECART, _etage(5), f"w{E2}", nb(p["w2"], 1), "parametre"),
        "a1": (AXE, _etage(5), f"a{E1}", nb(c["a1"], 6), "calcule"),
        "b2": (AXE + ECART, _etage(5), f"b{E2}", nb(p["b2"], 1), "parametre"),
        "z1": (AXE, _etage(6), f"z{E1}", nb(c["z1"], 6), "calcule"),
        "w1": (AXE - ECART, _etage(7), f"w{E1}", nb(p["w1"], 1), "parametre"),
        "x": (AXE, _etage(7), "x", nb(p["x"], 1), "donnee"),
        "b1": (AXE + ECART, _etage(7), f"b{E1}", nb(p["b1"], 1), "parametre"),
    }
    # Le seul chemin de w⁽³⁾ a la perte : ce sont TROIS ARETES DE L'ARBRE,
    # reprises en brique, et non des traits ajoutes par-dessus.
    chemin = {("z3", "w3"), ("a3", "z3"), ("l", "a3")}
    aretes = [
        ("l", "y"), ("l", "a3"), ("a3", "z3"),
        ("z3", "w3"), ("z3", "a2"), ("z3", "b3"), ("a2", "z2"),
        ("z2", "w2"), ("z2", "a1"), ("z2", "b2"), ("a1", "z1"),
        ("z1", "w1"), ("z1", "x"), ("z1", "b1"),
    ]

    # Les aretes d'abord, les nœuds par-dessus : une arete tracee apres un nœud
    # lui passerait sur sa valeur.
    for haut, bas in aretes:
        xh, yh = N[haut][:2]
        xb, yb = N[bas][:2]
        vif = (haut, bas) in chemin
        trait, ep = (BRIQUE, 3.4) if vif else (GRIS_58, 1.8)
        if abs(yh - yb) < 1:
            g, d = (xh, xb) if xh < xb else (xb, xh)
            o.append(ligne(g + W_NOEUD / 2, yh + H_NOEUD / 2,
                           d - W_NOEUD / 2, yh + H_NOEUD / 2, trait, ep))
        else:
            o.append(ligne(xh, yh + H_NOEUD, xb, yb, trait, ep))
    for (x, y, nom, valeur, nature) in N.values():
        o += case(x - W_NOEUD / 2, y, W_NOEUD, H_NOEUD,
                  [nom, (valeur, GRIS_72)], NATURES[nature])

    # Le chemin se nomme A COTE DE LUI, avec un echantillon de son trait : une
    # pastille de plus dans la legende du bas aurait la teinte des parametres
    # et se lirait comme eux.
    o.append(ligne(915, 410, 975, 410, BRIQUE, 3.4))
    o.append(txt(995, 421, "un seul chemin", T, BRIQUE, graisse=600))

    o.append(ligne(60, 1170, 1320, 1170, GRIS_24, 1.5, filet=True))
    o += legende(60, 1212, [(BRIQUE, "ajustable"), (GRIS_58, "fourni"),
                            (ENCRE, "calculé")])
    return document(L4, H4, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 6 · page 4 · trois droites graduees, une meme poussee
# ═══════════════════════════════════════════════════════════════════════════

L6, H6 = 1380, 820


def fig06_droites(V: dict) -> str:
    p, c, g = V["p"], V["c"], V["g"]
    dz_dw = V["trois"][0]
    o = entete(60, 70, "une poussée, et ce qu'elle déplace", 1300)

    x_axe0, x_axe1 = 300.0, 900.0
    depart = 400.0
    portee = 190.0           # la poussee h, la meme sur les trois droites
    rangs = [
        (260.0, f"w{E3}", nb(p["w3"], 1), 1.0, "h", ENCRE),
        (480.0, f"z{E3}", nb(c["z3"], 6), dz_dw,
         f"{nb(dz_dw, 6)} × h", ENCRE),
        (700.0, "ℓ", nb(c["perte"], 6), g["w3"],
         f"{nb(g['w3'], 6)} × h", BRIQUE),
    ]
    for (ay, nom, valeur, facteur, etiquette, couleur) in rangs:
        o.append(ligne(x_axe0, ay, x_axe1, ay, ENCRE, 2.4))
        o.append(txt(280, ay + 11, nom, T, ENCRE, "end", 600))
        o.append(f'<circle cx="{depart:.1f}" cy="{ay:.1f}" r="8.00" '
                 f'fill="{ENCRE}"/>')
        o.append(txt(depart, ay + 58, valeur, T, GRIS_72, "middle"))
        # Le deplacement, a l'echelle du facteur mesure. Un facteur negatif
        # pousse a gauche : c'est le signe de la derivee, et il se voit.
        bout = depart + facteur * portee
        o.append(fleche(depart, ay - 52, bout, ay - 52, couleur, 3.0, 13))
        o.append(f'<circle cx="{bout:.1f}" cy="{ay:.1f}" r="8.00" '
                 f'fill="{couleur}"/>')
        o.append(txt(950, ay - 41, etiquette, T, couleur, "start", 600))
    return document(L6, H6, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 8 · page 5 · chaque derivee sous l'equation dont elle sort
# ═══════════════════════════════════════════════════════════════════════════

L8, H8 = 1380, 900


def fig08_derivees(V: dict) -> str:
    dz_dw, da_dz, dl_da = V["trois"]
    o = entete(60, 70, "chaque dérivée sort d'une équation", 1300)

    rangs = [
        (f"z{E3} = w{E3} a{E2} + b{E3}", "la somme pondérée",
         f"∂z{E3}/∂w{E3} = a{E2}", dz_dw),
        (f"a{E3} = σ(z{E3})", "l'activation",
         f"∂a{E3}/∂z{E3} = a{E3}(1 − a{E3})", da_dz),
        (f"ℓ = − ln a{E3}", "la perte",
         f"∂ℓ/∂a{E3} = − 1/a{E3}", dl_da),
    ]
    for k, (equation, source, derivee, valeur) in enumerate(rangs):
        y = 150.0 + k * 230
        o.append(txt(60, y + 70, equation, T, ENCRE, graisse=600))
        o.append(txt(60, y + 70 + PAS, source, T, GRIS_58))
        o.append(fleche(660, y + 60, 730, y + 60, GRIS_40, 2.4, 13))
        o.append(txt(780, y + 70, derivee, T, ENCRE, graisse=600))
        o.append(txt(780, y + 70 + PAS, nb(valeur, 6), T, BRIQUE, graisse=700))
        if k < 2:
            o.append(ligne(60, y + 200, 1320, y + 200, GRIS_24, 1.5,
                           filet=True))

    o.append(ligne(60, 780, 1320, 780, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 840, f"∂ℓ/∂w{E3} = {nb(V['produit'], 6)}", T, ENCRE,
                 graisse=700))
    return document(L8, H8, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 7 · page 6 · le produit des trois rapports, sur les valeurs mesurees
# ═══════════════════════════════════════════════════════════════════════════

L7, H7 = 1380, 780


def fig07_trois_rapports(V: dict) -> str:
    dz_dw, da_dz, dl_da = V["trois"]
    o = entete(60, 70, "trois rapports, un produit", 1300)

    xs = [180.0, 560.0, 940.0, 1290.0]
    ay = 300.0
    r = 58.0
    for x, nom in zip(xs, [f"w{E3}", f"z{E3}", f"a{E3}", "ℓ"]):
        o += rond(x, ay, r, nom)
    rapports = [
        (f"∂z{E3}/∂w{E3}", dz_dw),
        (f"∂a{E3}/∂z{E3}", da_dz),
        (f"∂ℓ/∂a{E3}", dl_da),
    ]
    for k, (nom, valeur) in enumerate(rapports):
        o.append(arc(xs[k], ay, r, xs[k + 1], ay, r, ENCRE, 2.6, 8))
        cx = (xs[k] + xs[k + 1]) / 2
        o.append(txt(cx, ay - 92, nom, T, ENCRE, "middle", 700))
        o.append(txt(cx, ay + 114, nb(valeur, 6), T, BRIQUE, "middle", 700))

    o.append(ligne(60, 560, 1320, 560, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 630, f"∂ℓ/∂w{E3} = {nb(dl_da, 6)} × {nb(da_dz, 6)}", T,
                 ENCRE, graisse=700))
    o.append(txt(60, 630 + PAS, f"× {nb(dz_dw, 6)} = {nb(V['produit'], 6)}", T,
                 ENCRE, graisse=700))
    o.append(txt(800, 630, f"∂ℓ/∂z{E3} = a{E3} − y", T, GRIS_72, graisse=600))
    o.append(txt(800, 630 + PAS, f"= {nb(V['court'], 6)}", T, GRIS_72,
                 graisse=600))
    return document(L7, H7, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 5 · page 7 · le meme motif, une couche plus bas
# ═══════════════════════════════════════════════════════════════════════════

L5, H5 = 1380, 860


def fig05_prolonge(V: dict) -> str:
    p, c, g = V["p"], V["c"], V["g"]
    o = entete(60, 70, "le même motif, une couche plus bas", 1300)

    # LES TROIS CASES DU BAS SE TIENNENT A QUARANTE PIXELS L'UNE DE L'AUTRE :
    # a vingt, le blanc entre deux cadres se lit comme un trait double.
    w, h, ecart = 170.0, 104.0, 210.0
    for l, axe in ((3, 350.0), (2, 1030.0)):
        e = (E1, E2, E3)[l - 1]
        precedent = f"a{(E1, E2, E3)[l - 2]}"
        o.append(txt(axe, 160, f"couche {l}", T, GRIS_58, "middle", 600))
        N = [
            (axe, 200.0, f"a{e}", nb(c[f"a{l}"], 6), "calcule"),
            (axe, 340.0, f"z{e}", nb(c[f"z{l}"], 6), "calcule"),
            (axe - ecart, 480.0, f"w{e}", nb(p[f"w{l}"], 1), "parametre"),
            (axe, 480.0, precedent, nb(c[f"a{l - 1}"], 6), "calcule"),
            (axe + ecart, 480.0, f"b{e}", nb(p[f"b{l}"], 1), "parametre"),
        ]
        o.append(ligne(axe, 304, axe, 340, GRIS_58, 1.8))
        for cible in (axe - ecart, axe, axe + ecart):
            o.append(ligne(axe, 444, cible, 480, GRIS_58, 1.8))
        for (x, y, nom, valeur, nature) in N:
            o += case(x - w / 2, y, w, h, [nom, (valeur, GRIS_72)],
                      NATURES[nature])

        o.append(txt(axe, 660, f"δ{e} = {nb(g[f'd{l}'], 6)}", T, BRIQUE,
                     "middle", 700))
        o.append(txt(axe, 660 + PAS, f"∂ℓ/∂w{e} = {nb(g[f'w{l}'], 6)}", T,
                     GRIS_72, "middle"))
        o.append(txt(axe, 660 + 2 * PAS, f"∂ℓ/∂b{e} = {nb(g[f'b{l}'], 6)}", T,
                     GRIS_72, "middle"))

    o.append(fleche(660, 340, 730, 340, GRIS_40, 2.6, 13))
    return document(L5, H5, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 13 · page 8 · la recurrence deroulee en produit
# ═══════════════════════════════════════════════════════════════════════════

L13, H13 = 1380, 820


def fig13_recurrence(V: dict) -> str:
    g = V["g"]
    o = entete(60, 70, "la récurrence, déroulée en produit", 1300)

    w, h = 280.0, 104.0
    centres = [260.0, 690.0, 1120.0]
    for k, cx in enumerate(centres):
        l = 3 - k
        e = (E1, E2, E3)[l - 1]
        o += case(cx - w / 2, 260, w, h,
                  [f"δ{e}", (nb(g[f"d{l}"], 6), GRIS_72)], BRIQUE)
    for k in range(2):
        g0, d0 = centres[k] + w / 2, centres[k + 1] - w / 2
        o.append(fleche(g0 + 14, 312, d0 - 14, 312, BRIQUE, 2.6, 13))
        e = (E3, E2)[k]
        suivant = (E2, E1)[k]
        o.append(txt((g0 + d0) / 2, 225, f"w{e} · φ′(z{suivant})", T, BRIQUE,
                     "middle", 600))

    o.append(ligne(60, 480, 1320, 480, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 560, f"∂ℓ/∂w{E1} = δ{E1} · x", T, ENCRE, graisse=700))
    o.append(txt(60, 560 + PAS, f"= (a{E3} − y) · w{E3} · φ′(z{E2})", T,
                 GRIS_72))
    o.append(txt(60, 560 + 2 * PAS, f"· w{E2} · φ′(z{E1}) · x", T, GRIS_72))
    o.append(txt(60, 560 + 3 * PAS, f"= {nb(V['deroule'], 6)}", T, BRIQUE,
                 graisse=700))
    return document(L13, H13, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 9 · page 9 · le reseau, et la matrice des poids en coefficients
#
# LES DEUX LARGEURS SONT POSEES, pas mesurees : quatre neurones dans la couche
# l, cinq dans la couche l-1. C'est la convention de la scene
# lordre-des-indices-se-verifie, et celle que les textes alternatifs des pages
# 9 et 10 decrivent -- quatre lignes sur cinq colonnes. Aucun nombre mesure ne
# les accompagne, et on ne s'en ecarte pas : le lecteur d'ecran lirait une
# figure qui n'existe pas.
# ═══════════════════════════════════════════════════════════════════════════

L9, H9 = 1380, 940

D_L, D_PREC = 4, 5


def fig09_indices(V: dict) -> str:
    o = entete(60, 70, "la ligne arrive, la colonne part", 1300)

    # ── Le petit reseau, a gauche ───────────────────────────────────────────
    xg, xd = 230.0, 560.0
    r = 20.0
    i, j = 2, 3
    ys_prec = [300.0 + k * 100 for k in range(D_PREC)]
    ys_l = [350.0 + k * 100 for k in range(D_L)]
    for b, y1 in enumerate(ys_prec):
        for a, y2 in enumerate(ys_l):
            vif = a == i - 1 and b == j - 1
            o.append(ligne(xg + r + 6, y1, xd - r - 6, y2,
                           BRIQUE if vif else GRIS_40, 3.2 if vif else 1.2,
                           opacite=None if vif else 0.55))
    for k, y in enumerate(ys_prec):
        teinte = BRIQUE if k == j - 1 else GRIS_58
        o.append(f'<circle cx="{xg:.1f}" cy="{y:.1f}" r="{r:.2f}" '
                 f'fill="{PAPIER}" stroke="{teinte}" stroke-width="2.6"/>')
        o.append(txt(xg - 50, y + 11, str(k + 1), T, teinte, "end", 600))
    for k, y in enumerate(ys_l):
        teinte = BRIQUE if k == i - 1 else GRIS_58
        o.append(f'<circle cx="{xd:.1f}" cy="{y:.1f}" r="{r:.2f}" '
                 f'fill="{PAPIER}" stroke="{teinte}" stroke-width="2.6"/>')
        o.append(txt(xd + 50, y + 11, str(k + 1), T, teinte, "start", 600))
    o.append(txt(xg, 250, "couche l − 1", T, GRIS_58, "middle"))
    o.append(txt(xd, 250, "couche l", T, GRIS_58, "middle"))
    o.append(txt(xg, 790, f"j = {j}", T, BRIQUE, "middle", 700))
    o.append(txt(xd, 790, f"i = {i}", T, BRIQUE, "middle", 700))

    # ── La matrice, a droite, coefficient par coefficient ───────────────────
    coeffs = [[f"W{IND[a]}{IND[b]}" for b in range(D_PREC)]
              for a in range(D_L)]
    teintes = [[BRIQUE if (a == i - 1 and b == j - 1) else ENCRE
                for b in range(D_PREC)] for a in range(D_L)]
    o += matrice(740.0, 300.0, coeffs, 115.0, 90.0, teintes)

    o.append(txt(720, 740, "i : la ligne, l'arrivée", T, GRIS_58))
    o.append(txt(720, 740 + PAS, "j : la colonne, le départ", T, GRIS_58))
    o.append(ligne(60, 840, 1320, 840, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 900, f"({D_L} × {D_PREC})({D_PREC} × 1) → {D_L} × 1", T,
                 ENCRE, graisse=700))
    return document(L9, H9, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 11 · page 9 · la matrice et sa transposee, les deux en tableaux
# ═══════════════════════════════════════════════════════════════════════════

L11, H11 = 1380, 880


def fig11_somme(V: dict) -> str:
    o = entete(60, 70, "la colonne de W, la ligne de Wᵀ", 1300)

    j = 3
    cw, ch = 110.0, 90.0

    # W : d_l lignes, d_{l-1} colonnes. La colonne j, en brique.
    coeffs = [[f"W{IND[a]}{IND[b]}" for b in range(D_PREC)]
              for a in range(D_L)]
    teintes = [[BRIQUE if b == j - 1 else ENCRE for b in range(D_PREC)]
               for a in range(D_L)]
    o.append(txt(90 + D_PREC * cw / 2, 210, "W", T, ENCRE, "middle", 700))
    o += matrice(90.0, 280.0, coeffs, cw, ch, teintes)
    o.append(txt(90 + (j - 0.5) * cw, 700, f"colonne {j}", T, BRIQUE,
                 "middle", 600))

    # Wᵀ : le meme coefficient, ligne et colonne echangees.
    coeffs_t = [[f"W{IND[a]}{IND[b]}" for a in range(D_L)]
                for b in range(D_PREC)]
    teintes_t = [[BRIQUE if b == j - 1 else ENCRE for a in range(D_L)]
                 for b in range(D_PREC)]
    o.append(txt(810 + D_L * cw / 2, 210, "Wᵀ", T, ENCRE, "middle", 700))
    o += matrice(810.0, 280.0, coeffs_t, cw, ch, teintes_t)
    o.append(txt(810 + D_L * cw / 2, 775, f"ligne {j}", T, BRIQUE, "middle",
                 600))

    o.append(ligne(60, 800, 1320, 800, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 845, "(Wᵀδ)ⱼ = δ₁W₁ⱼ + δ₂W₂ⱼ + δ₃W₃ⱼ + δ₄W₄ⱼ", T, ENCRE,
                 graisse=700))
    return document(L11, H11, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 10 · page 10 · la jacobienne d'une couche cachee, diagonale
# ═══════════════════════════════════════════════════════════════════════════

L10, H10 = 1380, 820


def fig10_jacobienne(V: dict) -> str:
    o = entete(60, 70, "la jacobienne d'une couche cachée", 1300)

    o.append(txt(60, 340, f"a{EL}ᵢ = φ(z{EL}ᵢ)", T, ENCRE, graisse=600))
    o.append(txt(60, 340 + PAS, f"∂a{EL}ᵢ / ∂z{EL}ⱼ", T, GRIS_72))
    o.append(txt(60, 340 + 2 * PAS, "= 0 dès que i ≠ j", T, GRIS_72))

    # CARREE, ET DE LA TAILLE DE LA COUCHE : d_l lignes sur d_l colonnes. Les
    # quatre cases de la diagonale se comparent une a une a celles du softmax.
    coeffs = [[f"φ′(z{IND[a]})" if a == b else "0" for b in range(D_L)]
              for a in range(D_L)]
    # Les zeros sont en gris moyen, pas en gris pale : reduits de 2,156 dans la
    # colonne de lecture, ils doivent rester lisibles, c'est eux qu'on compte.
    teintes = [[BRIQUE if a == b else GRIS_58 for b in range(D_L)]
               for a in range(D_L)]
    o += matrice(480.0, 250.0, coeffs, 200.0, 100.0, teintes)

    o.append(ligne(60, 680, 1320, 680, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 740, f"J{EL} = diag(φ′(z{EL}))", T, ENCRE, graisse=700))
    return document(L10, H10, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 14 · page 10 · la meme jacobienne pour softmax, pleine
# ═══════════════════════════════════════════════════════════════════════════

L14, H14 = 1380, 820


def fig14_softmax(V: dict) -> str:
    o = entete(60, 70, "la jacobienne du softmax", 1300)

    o.append(txt(60, 340, "sᵢ = softmax(z)ᵢ", T, ENCRE, graisse=600))
    o.append(txt(60, 340 + PAS, "∂sᵢ / ∂zⱼ", T, GRIS_72))
    o.append(txt(60, 340 + 2 * PAS, "= sᵢ(δᵢⱼ − sⱼ)", T, GRIS_72))

    # LA MEME GRILLE QUE LA JACOBIENNE DIAGONALE, case pour case : c'est le
    # contraste entre les deux qui porte l'idee, et il ne se voit que si elles
    # ont la meme taille.
    coeffs = [[f"s{IND[a]}(1 − s{IND[a]})" if a == b
               else f"− s{IND[a]}s{IND[b]}" for b in range(D_L)]
              for a in range(D_L)]
    teintes = [[BRIQUE if a == b else ENCRE for b in range(D_L)]
               for a in range(D_L)]
    o += matrice(440.0, 250.0, coeffs, 215.0, 100.0, teintes, 24.0)

    # La forme matricielle, en regard de celle de fig10 : c'est le terme de
    # droite qui remplit la matrice. Dire ici « aucun zero hors de la
    # diagonale » serait raconter ce que la grille montre -- regle 19 -- et
    # cela se dit dans la legende du bloc.
    o.append(ligne(60, 680, 1320, 680, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 740, "J = diag(s) − s sᵀ", T, ENCRE, graisse=700))
    return document(L14, H14, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 15 · page 11 · ce que coutent une passe avant et une passe retour
# ═══════════════════════════════════════════════════════════════════════════

L15, H15 = 1380, 780


def fig15_cout(V: dict) -> str:
    compte = V["cout"]
    o = entete(60, 70, "le coût, compté en multiplications", 1300)

    o.append(txt(60, 190, " → ".join(str(d) for d in V["largeurs"]), T,
                 GRIS_58))

    x0, plein = 420.0, 760.0
    total = compte["total"]
    barres = [
        (260.0, "passe avant", compte["avant"], GRIS_40),
        (400.0, "passe arrière", compte["arriere"], BRIQUE),
        (540.0, "les deux", total, ENCRE),
    ]
    for (ay, nom, valeur, couleur) in barres:
        o.append(txt(60, ay + 11, nom, T, GRIS_72))
        largeur = plein * valeur / total
        o.append(rect(x0, ay - 30, largeur, 60, "none", 0, couleur))
        o.append(txt(x0 + largeur + 26, ay + 11, ent(valeur), T, ENCRE,
                     graisse=700))

    o.append(ligne(60, 640, 1320, 640, GRIS_24, 1.5, filet=True))
    # LE RAPPORT EST CELUI QUE MESURES.PY IMPRIME, pas une soustraction faite
    # ici : « rapport a la passe avant seule », mesure 5.
    o.append(txt(60, 700, f"avant + arrière = {nb(compte['rapport'], 2)} "
                          f"× avant", T, ENCRE, graisse=700))
    return document(L15, H15, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 12 · page 12 · l'aller et le retour sur une couche
# ═══════════════════════════════════════════════════════════════════════════

L12, H12 = 1380, 960


def fig12_synthese(V: dict) -> str:
    o = entete(60, 70, "l'aller et le retour, sur une couche", 1300)

    # QUATRE CASES ET TROIS INTERVALLES EGAUX, la derniere a quarante-cinq
    # pixels du bord : une case collee au bord se lit comme une case coupee.
    w, h = 240.0, 104.0
    centres = [180.0, 525.0, 870.0, 1215.0]

    aller = [f"a{ELM}", f"z{EL}", f"a{EL}", "ℓ"]
    for k, (cx, nom) in enumerate(zip(centres, aller)):
        o += case(cx - w / 2, 200, w, h, [nom])
        if k:
            o.append(fleche(centres[k - 1] + w / 2 + 14, 252,
                            cx - w / 2 - 14, 252, ENCRE, 2.6, 13))
    for k, nom in enumerate((f"W{EL}, b{EL}", "φ", "perte")):
        cx = (centres[k] + centres[k + 1]) / 2
        o.append(txt(cx, 160, nom, T, GRIS_58, "middle"))

    retour = [f"∂ℓ/∂a{ELM}", f"δ{EL}", f"∂ℓ/∂a{EL}", "ℓ"]
    for k, (cx, nom) in enumerate(zip(centres, retour)):
        o += case(cx - w / 2, 480, w, h, [nom], BRIQUE)
        if k:
            o.append(fleche(cx - w / 2 - 14, 532,
                            centres[k - 1] + w / 2 + 14, 532, BRIQUE, 2.6, 13))
    # Le dernier intervalle du retour ne porte rien : la fleche qui part de la
    # perte ne fait que la deriver, et « 1 » posee la ne nommait rien.
    for k, nom in enumerate(((f"(W{EL})ᵀ"), f"⊙ φ′(z{EL})")):
        cx = (centres[k] + centres[k + 1]) / 2
        o.append(txt(cx, 650, nom, T, BRIQUE, "middle"))

    o.append(ligne(centres[3], 304, centres[3], 480, GRIS_40, 1.8, "8 8"))

    o.append(ligne(60, 720, 1320, 720, GRIS_24, 1.5, filet=True))
    formules = [
        f"∂ℓ/∂W{EL} = δ{EL} (a{ELM})ᵀ",
        f"∂ℓ/∂b{EL} = δ{EL}",
        f"δ{EL} = [(W{ELP})ᵀ δ{ELP}] ⊙ φ′(z{EL})",
    ]
    for k, formule in enumerate(formules):
        o.append(txt(60, 790 + k * PAS, formule, T, ENCRE, graisse=700))
    return document(L12, H12, o)


# ═══════════════════════════════════════════════════════════════════════════
# CE QU'ON ECRIT
#
# L'ordre est celui du tableau des figures : la page qui l'ouvre, puis son
# sujet. `l5-fig10-chemins.svg` a disparu -- son sujet, un neurone qui atteint
# la perte par plusieurs chemins, est celui de fig03 et de fig11 -- et son nom
# est repris par la jacobienne.
# ═══════════════════════════════════════════════════════════════════════════

FIGURES = {
    "l5-fig01-reseau.svg": (fig01_reseau, L1, H1),
    "l5-fig02-du-cas-au-general.svg": (fig02_du_cas_au_general, L2, H2),
    "l5-fig03-deux-chaines.svg": (fig03_deux_chaines, L3, H3),
    "l5-fig04-arbre.svg": (fig04_arbre, L4, H4),
    "l5-fig06-droites.svg": (fig06_droites, L6, H6),
    "l5-fig08-derivees.svg": (fig08_derivees, L8, H8),
    "l5-fig07-trois-rapports.svg": (fig07_trois_rapports, L7, H7),
    "l5-fig05-prolonge.svg": (fig05_prolonge, L5, H5),
    "l5-fig13-recurrence.svg": (fig13_recurrence, L13, H13),
    "l5-fig09-indices.svg": (fig09_indices, L9, H9),
    "l5-fig11-somme.svg": (fig11_somme, L11, H11),
    "l5-fig10-jacobienne.svg": (fig10_jacobienne, L10, H10),
    "l5-fig14-softmax.svg": (fig14_softmax, L14, H14),
    "l5-fig15-cout.svg": (fig15_cout, L15, H15),
    "l5-fig12-synthese.svg": (fig12_synthese, L12, H12),
}

# Le fichier que la refonte retire. Il est supprime a l'ecriture : le laisser
# la ferait passer les cribles sur une figure que plus aucune page ne sert.
RETIREES = ("l5-fig10-chemins.svg",)


def main() -> None:
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, ValueError, OSError):
            pass
    debut = time.time()
    print("  Chapitre 5 : les figures.")
    print("  Toutes les valeurs sortent de mesures.py.")
    V = mesurer()

    SORTIE.mkdir(parents=True, exist_ok=True)
    for nom in RETIREES:
        cible = SORTIE / nom
        if cible.exists():
            cible.unlink()
            print(f"  · {nom} retirée")
    for nom, (fabrique, largeur, hauteur) in FIGURES.items():
        cible = SORTIE / nom
        contenu = fabrique(V)
        cible.write_text(contenu, encoding="utf-8")
        print(f"  ✓ {nom:<30} {largeur} × {hauteur}"
              f"   {len(contenu.encode('utf-8')) / 1024:>6.0f} Ko")
    print(f"\n  {len(FIGURES)} figures dans "
          f"{SORTIE.relative_to(SORTIE.parents[2])}")
    print(f"  duree totale : {time.time() - debut:.1f} s")


if __name__ == "__main__":
    main()
