"""Chapitre 4 : les quinze figures fixes.

    python cours/lecon4/figures.py

CE FICHIER N'ECRIT AUCUN NOMBRE A LA MAIN. Il importe cours/lecon4/mesures.py
et se sert de SES fonctions -- init, avant, arriere, perte -- avec SON
protocole : graine 0, reseau 784 -> 128 -> 10 NON entraine, exemple temoin
choisi par un critere et non tire au sort.

LA MESURE 4 est refaite ici a l'identique, ses deux cents pas compris : elle
coute quelques secondes, et son resultat -- 100 % des images de test predites
« 2 » -- est ce que la figure 12 montre.

LE CACHE. La cle est l'empreinte de mesures.py et de donnees.py : modifier
l'un ou l'autre le perime, et les figures se refont sur les nouvelles valeurs.

LE TRAIT -- palette, primitives SVG, grilles 28 x 28 -- vient de
cours/schema.py, commun aux figures de tout le parcours.

LA PASSE DU 20 SEPTEMBRE 2026. Les douze figures de ce chapitre portaient des
textes de 10,2 a 17 pixels dans un SVG large de 1380, soit 4,7 a 7,9 pixels
chez l'etudiant : 385 fautes au crible de la regle 32. Elles sont refaites au
plancher, `txt` refuse desormais une taille plus petite, et l'empilement passe
par `pas(taille)` au lieu d'une constante ecrite a la main. Trois figures
s'ajoutent, une par page qui n'en portait aucune : le reseau entier page 1, le
cout compare page 11, le trajet complet page 12.

Table de correspondance : cours/figures/CORRESPONDANCE.md
"""

from __future__ import annotations

import hashlib
import os
import pickle
import sys
import time
from pathlib import Path

# BLAS EST BRIDE AVANT L'IMPORT DE NUMPY, comme en tete de mesures.py.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

import donnees as D  # noqa: E402
import mesures as M  # noqa: E402

from schema import (  # noqa: E402
    ARDOISE,
    BRIQUE,
    CHASSE,
    ENCRE,
    GRIS_14,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    GRIS_72,
    PAPIER,
    SOUSCRITS,
    accolade,
    cadre_grille,
    cercle,
    colonne,
    couper,
    document,
    ent,
    entete,
    EXPOSANTS,
    fleche,
    grille_encre,
    ligne,
    nb,
    pas,
    rect,
    suspension,
    txt,
    txt_indice,
)


# ── La taille minimale d'un texte de figure ─────────────────────────────────
#
# LA MESURE, refaisable en deux `grep`. Le corps d'une lecon est compose a
# `text-[0.9375rem]`, soit 15 px : src/composants/academy/blocs/prose.tsx.
# L'article qui le porte est en `max-w-[44rem]` avec `lg:px-8`, donc une
# colonne de 44 x 16 - 2 x 32 = 640 px. Une figure y est servie en `w-full`
# (blocs/Statiques.tsx, BImage), et un SVG large de 1380 s'y affiche donc
# reduit de 1380 / 640 = 2,156.
#
#     TEXTE_MIN = 15 x 1380 / 640 = 32,3  ->  33
#
# Un texte de figure sous 33 s'affiche SOUS le corps de la page, et le lecteur
# passe d'un texte lisible a un texte qui ne l'est pas sans que rien ne le
# previenne. C'est la regle 32 de REGLES.md.
#
# CE N'EST PAS UN PLANCHER QU'ON PEUT FRANCHIR. `txt` refuse une taille plus
# petite au lieu de la composer : une figure illisible ne se voit pas dans un
# diff, et se voit tres bien chez l'etudiant.
CORPS_PX = 15          # prose.tsx, text-[0.9375rem]
COLONNE_PX = 640       # max-w-[44rem] moins lg:px-8
LARGEUR_SVG = 1380     # toutes les figures du cours
TEXTE_MIN = -(-CORPS_PX * LARGEUR_SVG // COLONNE_PX)   # 33, arrondi au-dessus

# QUARANTE CARACTERES. Au-dela, ce n'est plus une etiquette mais une phrase, et
# une phrase va dans la legende du bloc ou dans la lecture guidee -- la ou elle
# est composee au corps de la page, et ou un lecteur d'ecran la trouve. Dans
# l'image, elle n'est qu'un dessin. `txt` refuse donc aussi le texte trop long :
# ce qui doit tenir sur plusieurs lignes passe par `etiquette`, qui coupe.
ETIQUETTE_MAX = 40
LARGEUR_ETIQUETTE = ETIQUETTE_MAX * CHASSE * TEXTE_MIN   # 726 px

# Le controle mecanique : node outils/verifier-figures.mjs lecon4

# `txt` vient de schema.py, commun a tout le parcours. On l'enveloppe ici
# plutot que de le modifier la-bas : le plancher est une regle du COURS, et
# schema.py sert aussi a des figures qui ne sont pas servies dans une colonne
# de 640.
_txt_brut = txt


def txt(x, y, contenu, taille=TEXTE_MIN, couleur=ENCRE, ancre="start",
        graisse=400, italique=False):  # noqa: F811
    if taille < TEXTE_MIN:
        raise ValueError(
            f"texte de figure a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {contenu[:40]} ». Voir la regle 32."
        )
    if len(contenu) > ETIQUETTE_MAX:
        raise ValueError(
            f"etiquette de {len(contenu)} caracteres, maximum "
            f"{ETIQUETTE_MAX} : « {contenu[:50]} ». Elle a sa place dans la "
            f"legende du bloc, pas dans l'image. Voir la regle 32."
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
    return _indice_brut(x, y, base, indice, suite, taille, couleur, ancre,
                        graisse)


_colonne_brute = colonne


def colonne(x, y, contenus, taille=TEXTE_MIN, couleur=ENCRE, ancre="start",
            graisse=400):  # noqa: F811
    """Des lignes empilees, l'interligne CALCULE sur leur taille.

    On n'empile plus avec une constante : le jour ou la taille change,
    l'espacement suit tout seul. C'est `pas(taille)` de schema.py, et c'est ce
    que le crible des recouvrements verifie.
    """
    o = []
    for i, c in enumerate(contenus):
        contenu, teinte = c if isinstance(c, tuple) else (c, couleur)
        o.append(txt(x, y + i * pas(taille), contenu, taille, teinte, ancre,
                     graisse))
    return o


def etiquette(x, y, contenu, largeur=LARGEUR_ETIQUETTE, taille=TEXTE_MIN,
              couleur=ENCRE, ancre="start", graisse=400) -> list[str]:
    """Un texte coupe a la largeur donnee, jamais au-dela de l'etiquette.

    C'est la seule facon d'ecrire plus de quarante caracteres dans une figure,
    et elle en coupe le texte en etiquettes. Au-dela de deux lignes, la phrase
    n'a rien a faire ici.
    """
    return colonne(x, y, couper(contenu, min(largeur, LARGEUR_ETIQUETTE),
                                taille), taille, couleur, ancre, graisse)


_entete_brut = entete


def entete(x, y, texte, largeur=1300):  # noqa: F811
    """Le titre d'un panneau, au plancher, COUPE A LA LARGEUR DU PANNEAU.

    `schema.entete` le compose a 17 et ne le coupe pas. A 33, un titre de
    quarante-sept caracteres deborde du cadre ou entre dans le titre voisin :
    il se coupe donc, et le filet passe sous la derniere ligne.
    """
    lignes = couper(texte, min(largeur, LARGEUR_ETIQUETTE), TEXTE_MIN)
    dessous = y + (len(lignes) - 1) * pas(TEXTE_MIN) + 16
    return colonne(x, y, lignes, TEXTE_MIN, GRIS_58, graisse=600) + [
        ligne(x, dessous, x + largeur, dessous, GRIS_24, 1.5, filet=True),
    ]


def reperes_grille(x0, y0, cote, marques=(1, 28)):  # noqa: F811
    """Les reperes d'une grille, au plancher et REDUITS A DEUX.

    A 33, cinq nombres par cote encombrent la grille qu'ils servent. Ce qu'un
    repere doit etablir, c'est que la grille compte 28 rangs numerotes a partir
    de 1 ; le premier et le dernier le disent.
    """
    o = []
    for k in marques:
        c = x0 + (k - 0.5) * cote
        o.append(txt(c, y0 - 18, str(k), TEXTE_MIN, GRIS_58, "middle"))
        o.append(txt(x0 - 20, y0 + (k - 0.5) * cote + 11, str(k), TEXTE_MIN,
                     GRIS_58, "end"))
    return o
SORTIE = Path(__file__).resolve().parents[2] / "public" / "cours" / "lecon4"
CACHE = RACINE / ".donnees" / "l4-figures.pickle"


def indice(n) -> str:
    return str(n).translate(SOUSCRITS)


def exposant(l: int) -> str:
    return "⁽" + "¹²³⁴⁵⁶⁷⁸⁹"[l - 1] + "⁾"


# ═══════════════════════════════════════════════════════════════════════════
# LES MESURES
# ═══════════════════════════════════════════════════════════════════════════


def _empreinte() -> str:
    h = hashlib.sha256()
    for module in (M, D):
        h.update(Path(module.__file__).read_bytes())
    return h.hexdigest()


def mesurer(refaire: bool = False) -> dict:
    signature = _empreinte()
    if not refaire and CACHE.exists():
        enveloppe = pickle.loads(CACHE.read_bytes())
        if enveloppe.get("signature") == signature:
            print(f"  mesures relues du cache "
                  f"({CACHE.relative_to(RACINE.parent)})")
            return enveloppe["valeurs"]
    V = calculer()
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_bytes(pickle.dumps({"signature": signature, "valeurs": V}))
    return V


def calculer() -> dict:
    Xtr, ctr, Xte, cte = D.charger()
    theta = M.init()
    V: dict = {"K": M.K, "H": M.H, "classe": M.CLASSE_TEMOIN}

    # ── Mesure 1 · l'exemple de travail ────────────────────────────────────
    n = int(np.argmax(ctr == M.CLASSE_TEMOIN))
    x = Xtr[n]
    cache = M.avant(theta, x)
    grads = M.arriere(theta, cache, int(ctr[n]))
    a1, z1, a2 = cache["a1"], cache["z1"], cache["a2"]
    d2 = grads["delta2"]

    V["n"] = n
    V["image"] = x.reshape(28, 28)
    V["pixels_non_nuls"] = int((x > 0).sum())
    V["a2"] = a2
    V["d2"] = d2
    V["perte"] = M.perte(a2, int(ctr[n]))
    V["perte_hasard"] = float(np.log(10))
    V["predit"] = int(a2.argmax())
    V["allumes"] = int((z1 > 0).sum())
    V["p"] = sum(v.size for v in theta.values())

    # ── Mesure 3 · les trois voies ─────────────────────────────────────────
    c = M.CLASSE_TEMOIN
    actifs = np.flatnonzero(a1 > 0)
    ordre = actifs[np.argsort(-a1[actifs])]
    choisis = [int(ordre[0]), int(ordre[1]), int(ordre[2]), int(ordre[-1])]
    V["choisis"] = choisis
    V["db2"] = float(grads["b2"][c])
    V["proportion"] = [(j, float(a1[j]), float(grads["W2"][c, j]),
                        float(grads["W2"][c, j] / a1[j])) for j in choisis]
    k_positif = int(np.argmax(d2))
    V["k_positif"] = k_positif
    V["proportion_positive"] = [
        (j, float(a1[j]), float(grads["W2"][k_positif, j]),
         float(grads["W2"][k_positif, j] / a1[j])) for j in choisis]
    V["rapport_activations"] = float(a1[choisis[0]] / a1[choisis[-1]])

    j = choisis[0]
    V["j"] = j
    V["a1_j"] = float(a1[j])
    V["z1_j"] = float(z1[j])
    V["demandes"] = [(k, float(d2[k]), float(theta["W2"][k, j]),
                      float(d2[k] * theta["W2"][k, j])) for k in range(M.K)]
    V["demande_totale"] = float(grads["grad_a1"][j])
    V["delta1_j"] = float(grads["delta1"][j])
    eteint = int(np.flatnonzero(z1 <= 0)[0])
    V["eteint"] = (eteint, float(z1[eteint]), float(grads["grad_a1"][eteint]),
                   float(grads["delta1"][eteint]))

    W2 = theta["W2"]
    signes = [int(v) for v in np.flatnonzero((W2[c] > 0) & (a1 > 0))[:2]]
    signes += [int(v) for v in np.flatnonzero((W2[c] < 0) & (a1 > 0))[:2]]
    V["signes"] = [(jj, float(W2[c, jj]), float(d2[c] * W2[c, jj]))
                   for jj in signes]

    # ── Mesure 6 · le controle de Hebb ─────────────────────────────────────
    montee = -grads["W2"]
    plats = np.dstack(np.unravel_index(np.argsort(-montee, axis=None),
                                       montee.shape))[0][:10]
    rang_a = {int(v): r + 1 for r, v in enumerate(np.argsort(-a1))}
    V["hebb"] = [(int(kk), int(jj), float(a1[jj]), float(montee[kk, jj]),
                  rang_a[int(jj)]) for kk, jj in plats]

    # ── Mesure 8 · les zeros de grad_W1 ────────────────────────────────────
    V["zeros_W1"] = (int((grads["W1"] == 0).sum()), int(grads["W1"].size))

    # ── Mesure 4 · n'ecouter qu'un seul exemple ────────────────────────────
    # Refaite a l'identique : deux cents pas de descente sur la seule image de
    # travail, eta = 0,5, puis evaluation sur les dix mille images de test.
    theta4 = M.init()
    Z1 = Xte @ theta4["W1"].T + theta4["b1"]
    Z2 = np.maximum(Z1, 0.0) @ theta4["W2"].T + theta4["b2"]
    V["avant_pas"] = float(np.mean(Z2.argmax(axis=1) == cte))
    for _ in range(200):
        g = M.arriere(theta4, M.avant(theta4, x), int(ctr[n]))
        for cle in ("W1", "b1", "W2", "b2"):
            theta4[cle] -= 0.5 * g[cle]
    Z1 = Xte @ theta4["W1"].T + theta4["b1"]
    Z2 = np.maximum(Z1, 0.0) @ theta4["W2"].T + theta4["b2"]
    predites = Z2.argmax(axis=1)
    V["apres"] = {
        "perte": abs(M.perte_de(theta4, x, int(ctr[n]))),
        "probabilite": float(M.avant(theta4, x)["a2"][M.CLASSE_TEMOIN]),
        "predites_temoin": int((predites == M.CLASSE_TEMOIN).sum()),
        "total": int(len(cte)),
        "exactitude": float(np.mean(predites == cte)),
        "frequence": float(np.mean(cte == M.CLASSE_TEMOIN)),
        "compte_temoin": int((cte == M.CLASSE_TEMOIN).sum()),
    }
    comptes = np.bincount(cte, minlength=M.K)
    V["plus_frequente"] = (int(comptes.argmax()), int(comptes.max()))
    return V




# ── Trois briques communes aux figures de ce chapitre ───────────────────────


def barres_signees(x0, y0, largeur, hauteur, valeurs, etiquettes,
                   taille=TEXTE_MIN) -> list[str]:
    """Des barres verticales de part et d'autre d'un zero commun.

    Les signes portent l'idee de tout le chapitre -- descendre la classe
    vraie, monter les neuf autres -- et une barre qui ne franchit pas l'axe ne
    les montre pas.

    AUCUNE VALEUR N'EST ECRITE SUR LES BARRES. A 33 px, « +0,1366 » demande
    127 pixels pour un pas de colonne qui en fait 114 : deux etiquettes
    voisines se toucheraient. Les dix valeurs sont dans la sortie de programme
    qui precede la figure, ou elles se lisent mieux ; ici on garde le rang de
    la classe, qui tient en un caractere.
    """
    o = []
    pitch = largeur / len(valeurs)
    m = max(abs(v) for v in valeurs) or 1.0
    zero = y0 + hauteur / 2
    o.append(ligne(x0 - 24, zero, x0 + largeur + 24, zero, ENCRE, 1.8))
    for k, (v, etiquette_k) in enumerate(zip(valeurs, etiquettes)):
        cx = x0 + (k + 0.5) * pitch
        h = abs(v) / m * (hauteur / 2 - 14)
        couleur = ARDOISE if v < 0 else BRIQUE
        o.append(rect(cx - pitch * 0.3, zero - h if v >= 0 else zero,
                      pitch * 0.6, h, "none", 0, couleur))
        # La rangee des classes tient SOUS le cadre, et non au pied de chaque
        # barre : posee la, elle sauterait d'une ligne a l'autre selon le
        # signe de la composante.
        o.append(txt(cx, y0 + hauteur + pas(taille), etiquette_k, taille,
                     GRIS_72, "middle", 600))
    return o


def rangee_colonnes(y, cellules, taille=TEXTE_MIN) -> list[str]:
    """Une rangee de tableau : (x, contenu, ancre, couleur, graisse)."""
    return [txt(x, y, contenu, taille, couleur, ancre, graisse)
            for x, contenu, ancre, couleur, graisse in cellules]


def titres_colonnes(y, colonnes, bornes=(60.0, 1340.0)) -> list[str]:
    """Les titres d'un tableau, et le filet qui les souligne."""
    o = [txt(x, y, nom, TEXTE_MIN, GRIS_58, ancre)
         for x, nom, ancre in colonnes]
    o.append(ligne(bornes[0], y + 18, bornes[1], y + 18, GRIS_24, 1.5,
                   filet=True))
    return o


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 1 · ce qui est pose, et le seul objet qui manque
# ═══════════════════════════════════════════════════════════════════════════

L1, H1 = 1380, 720


def fig01_cadre(V: dict) -> str:
    o = entete(40, 52, "ce que les chapitres 2 et 3 ont posé")

    # Quatre objets acquis, leur symbole a gauche et leur role a droite. Le
    # chapitre qui pose chacun n'est PAS repris ici : la page le donne deja,
    # ligne par ligne, dans sa liste « ce qui est deja pose ».
    # « 784 » EST UN EXPOSANT. Ecrit avec txt_indice il descendait sous la
    # ligne, et x ∈ [0, 1] indice 784 ne veut rien dire. La regle 24 : le vrai
    # caractere, toujours -- ici les chiffres superieurs d'Unicode.
    o.append(txt(60, 160, "x ∈ [0, 1]" + "784".translate(EXPOSANTS),
                 BASE_INDICE, ENCRE, graisse=600))
    o.append(txt(1340, 160, "l'image, aplatie", TEXTE_MIN, GRIS_58, "end"))

    o.append(txt_indice(60, 240, "f", "θ", "(x) = a⁽²⁾", BASE_INDICE))
    o.append(txt(1340, 240, "le réseau, 784 → 128 → 10", TEXTE_MIN, GRIS_58,
                 "end"))

    o.append(txt_indice(60, 320, "ℓ(θ) = − ln a⁽²⁾", "c", "", BASE_INDICE))
    o.append(txt(1340, 320, "la perte d'un exemple", TEXTE_MIN, GRIS_58,
                 "end"))

    o.append(txt(60, 400, "θ ← θ − η grad ℓ", BASE_INDICE, ENCRE, graisse=600))
    o.append(txt(1340, 400, "la descente de gradient", TEXTE_MIN, GRIS_58,
                 "end"))

    o.append(ligne(40, 460, 1340, 460, GRIS_24, 1.5, filet=True))

    # Ce qui manque, et c'est le sujet du chapitre. La fleche remonte vers la
    # ligne de la descente : c'est elle, et elle seule, qui le reclame.
    o.append(rect(40, 510, 660, 160, BRIQUE, 2.6, PAPIER))
    o.append(txt(370, 582, "grad ℓ", 60, BRIQUE, "middle", 700))
    o.append(txt(370, 636, f"{ent(V['p'])} nombres", TEXTE_MIN, BRIQUE,
                 "middle"))
    o.append(fleche(370, 502, 370, 434, BRIQUE, 2.4, 12))
    o.append(txt(760, 582, "manque", TEXTE_MIN, BRIQUE, graisse=600))
    return document(L1, H1, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 2 · deux poids d'une meme ligne, et l'ecart de leurs corrections
# ═══════════════════════════════════════════════════════════════════════════

L2, H2 = 1380, 620


def fig02_importance(V: dict) -> str:
    fort = V["proportion"][0]
    faible = V["proportion"][-1]
    rapport = V["rapport_activations"]
    o = entete(40, 52, "deux poids de la même ligne")

    # Les barres portent l'AMPLEUR de la correction : les deux derivees sont
    # negatives, et deux barres qui partiraient vers la gauche compareraient
    # moins bien deux longueurs.
    x0, largeur = 400.0, 380.0
    m = max(abs(fort[2]), abs(faible[2]))
    for k, (j, a, d, _q) in enumerate((fort, faible)):
        y = 190 + k * 190
        o.append(txt(60, y, f"W⁽²⁾{indice(V['classe'])},{indice(j)}",
                     BASE_INDICE, ENCRE, graisse=600))
        o.append(txt(60, y + pas(TEXTE_MIN),
                     f"a⁽¹⁾{indice(j)} = {nb(a, 4)}", TEXTE_MIN, GRIS_58))
        larg = abs(d) / m * largeur
        o.append(rect(x0, y - 24, max(larg, 2.0), 48, "none", 0, ARDOISE))
        o.append(txt(x0 + larg + 20, y + 12, nb(d, 6, True), BASE_INDICE,
                     ARDOISE, graisse=700))
    o.append(ligne(x0, 140, x0, 440, ENCRE, 1.8))

    # La cote du rapport, au bec d'une accolade posee a droite des barres.
    # ELLE EST CALEE SUR LA MARGE DROITE, pas posee a une abscisse choisie :
    # « 228,6 × » compose a 60 demande 231 pixels, et pose a 1178 il en
    # sortait 29 hors du cadre.
    o.append(accolade(1080, 166, 404, 1, BRIQUE, 2.2, 14))
    o.append(txt(1340, 272, f"{nb(rapport, 1)} ×", 60, BRIQUE, "end", 700))
    o.append(txt(1340, 330, "d'écart", TEXTE_MIN, BRIQUE, "end"))

    o.append(ligne(40, 490, 1340, 490, GRIS_24, 1.5, filet=True))
    # « 228,6 × » est deja au bec de l'accolade : le repeter en pied serait
    # le dire deux fois, et la regle 12 l'interdit.
    o.append(txt(60, 546, "le rapport des deux activations", BASE_INDICE,
                 ENCRE, graisse=600))
    o.append(txt(60, 596, "activations affichées arrondies", TEXTE_MIN,
                 GRIS_58))
    return document(L2, H2, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 3 · l'exemple de travail
# ═══════════════════════════════════════════════════════════════════════════

L3, H3 = 1380, 880


def fig03_exemple(V: dict) -> str:
    o = entete(40, 52, f"l'image n°{V['n']}, première de classe {V['classe']}")

    cote = 16.0
    gx, gy = 120.0, 160.0
    o += grille_encre(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    o += reperes_grille(gx, gy, cote, (1, 28))

    px, pl = 660.0, 680.0
    o += entete(px, 52, "ce que le réseau non entraîné en fait", pl)
    lignes = [
        ("indice de l'exemple", f"n = {V['n']}"),
        ("étiquette", f"c = {V['classe']}"),
        ("pixels non nuls", f"{V['pixels_non_nuls']} sur {ent(784)}"),
        ("neurones allumés", f"{V['allumes']} sur {V['H']}"),
        ("neurones éteints", f"{V['H'] - V['allumes']} sur {V['H']}"),
    ]
    for k, (nom, valeur) in enumerate(lignes):
        y = 160 + k * pas(TEXTE_MIN, 1.7)
        o.append(txt(px, y, nom, TEXTE_MIN, GRIS_58))
        o.append(txt(px + pl, y, valeur, BASE_INDICE, ENCRE, "end", 600))

    # Le compte des zeros tient sur TROIS lignes, et non sur une rangee de
    # tableau : « coefficients nuls de grad W⁽¹⁾ » demande 545 pixels a 33 et
    # sa valeur 327, pour un panneau qui en offre 680. Cote a cote, les deux
    # se touchaient.
    o.append(ligne(px, 520, px + pl, 520, GRIS_24, 1.5, filet=True))
    nuls, total = V["zeros_W1"]
    o.append(txt(px, 576, "coefficients nuls de grad W⁽¹⁾", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(px, 646, f"{ent(nuls)} sur {ent(total)}", 60, BRIQUE,
                 graisse=700))
    o.append(txt(px, 700, f"soit {nb(100 * nuls / total, 2)} %", TEXTE_MIN,
                 BRIQUE))

    o.append(ligne(40, 780, 1340, 780, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 836, "réseau non entraîné, graine 0", TEXTE_MIN, GRIS_58))
    return document(L3, H3, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 4 · la sortie d'un reseau qui ne sait rien
# ═══════════════════════════════════════════════════════════════════════════

L4, H4 = 1380, 800


def fig04_sortie(V: dict) -> str:
    a2 = V["a2"]
    o = entete(40, 52, "la sortie d'un réseau non entraîné")

    x0, largeur, base = 140.0, 1140.0, 480.0
    pitch = largeur / 10
    m = float(max(a2))
    for k in range(10):
        cx = x0 + (k + 0.5) * pitch
        h = float(a2[k]) / m * 220
        gagnant = k == V["predit"]
        o.append(rect(cx - pitch * 0.28, base - h, pitch * 0.56, h, "none", 0,
                      BRIQUE if gagnant else GRIS_40))
        o.append(txt(cx, base + 62, str(k), BASE_INDICE,
                     BRIQUE if gagnant else ENCRE, "middle", 700))
    o.append(ligne(x0 - 24, base, x0 + largeur + 24, base, ENCRE, 2.0))

    # LA VALEUR N'EST ECRITE QUE SUR LA BARRE DONT LA FIGURE PARLE. A 33 px,
    # dix nombres de six caracteres reclament 1 270 pixels pour une rangee qui
    # en fait 1 140 ; et les dix se lisent, mieux, dans la sortie de programme
    # qui precede.
    cx = x0 + (V["predit"] + 0.5) * pitch
    o.append(txt(cx, base - float(a2[V["predit"]]) / m * 220 - 24,
                 nb(float(a2[V["predit"]]), 4), BASE_INDICE, BRIQUE, "middle",
                 700))

    # Le repere du hasard : dix classes equiprobables.
    y_hasard = base - 0.1 / m * 220
    o.append(ligne(x0 - 24, y_hasard, x0 + largeur + 24, y_hasard, GRIS_58,
                   1.6, "6 6"))
    o.append(txt(x0 - 36, y_hasard + 11, "0,1", TEXTE_MIN, GRIS_58, "end"))
    o.append(txt(x0 - 36, base + 11, "0", TEXTE_MIN, GRIS_58, "end"))

    o.append(ligne(40, 600, 1340, 600, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 656, "perte de cet exemple", TEXTE_MIN, GRIS_58))
    o.append(txt(700, 656, nb(V["perte"], 6), BASE_INDICE, ENCRE, "end", 600))
    o.append(txt(60, 722, "perte du hasard, ln 10", TEXTE_MIN, GRIS_58))
    o.append(txt(700, 722, nb(V["perte_hasard"], 6), BASE_INDICE, GRIS_72,
                 "end"))
    o.append(txt(1340, 656, f"la plus haute est la classe {V['predit']}",
                 TEXTE_MIN, BRIQUE, "end"))
    o.append(txt(1340, 722, "et c'est la bonne, par accident", TEXTE_MIN,
                 BRIQUE, "end"))
    return document(L4, H4, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 5 · une seule composante est negative
# ═══════════════════════════════════════════════════════════════════════════

L5, H5 = 1380, 800


def fig05_delta(V: dict) -> str:
    d2 = V["d2"]
    negative = int(np.argmin(d2))
    o = entete(40, 52, "δ⁽²⁾ = a⁽²⁾ − y, classe par classe")

    o += barres_signees(140, 150, 1140, 340, [float(v) for v in d2],
                        [str(k) for k in range(10)])
    o.append(txt(106, 331, "0", TEXTE_MIN, GRIS_58, "end", 600))
    o.append(txt(60, 592, "classe", TEXTE_MIN, GRIS_58))

    o.append(txt(1340, 196, "δₖ > 0 : l'activation descend", TEXTE_MIN,
                 BRIQUE, "end", 600))
    o.append(txt(1340, 468, "δₖ < 0 : l'activation monte", TEXTE_MIN,
                 ARDOISE, "end", 600))

    o.append(ligne(40, 646, 1340, 646, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 710,
                 f"δ{indice(negative)} = {nb(float(d2[negative]), 6, True)}",
                 60, ARDOISE, graisse=700))
    o.append(txt(1340, 710, "sa valeur absolue égale", TEXTE_MIN, GRIS_58,
                 "end"))
    o.append(txt(1340, 764, "la somme des neuf autres", TEXTE_MIN, GRIS_58,
                 "end"))
    return document(L5, H5, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 6 · les trois voies vers une somme ponderee
# ═══════════════════════════════════════════════════════════════════════════

L6, H6 = 1380, 820


def fig06_trois_voies(V: dict) -> str:
    c, j = V["classe"], V["j"]
    fort = V["proportion"][0]
    o = entete(40, 52, "trois voies vers une même somme")

    # LE ROND DE z EST POSE A DROITE et les trois cadres a gauche : les
    # formules tiennent DANS les cadres, et les fleches traversent une bande
    # ou il n'y a rien. Les faire passer sur le texte etait la faute de la
    # version precedente.
    cx, cy, r = 1150.0, 430.0, 130.0
    o.append(cercle(cx, cy, r, PAPIER, ENCRE, 2.6))
    o.append(txt(cx, cy + 18, f"z⁽²⁾{indice(c)}", 60, ENCRE, "middle", 600))

    voies = [
        (f"b⁽²⁾{indice(c)}, le biais", "∂ℓ/∂b vaut",
         nb(V["db2"], 6, True), BRIQUE),
        (f"W⁽²⁾{indice(c)},{indice(j)}, le poids", "∂ℓ/∂W vaut",
         nb(fort[2], 6, True), BRIQUE),
        (f"a⁽¹⁾{indice(j)}, l'activation", "∂ℓ/∂a vaut",
         nb(V["demande_totale"], 6, True), GRIS_58),
    ]
    for k, (nom, formule, valeur, couleur) in enumerate(voies):
        y = 170.0 + k * 180.0
        o.append(rect(40, y, 640, 150, couleur, 2.2, PAPIER))
        o.append(txt(64, y + 60, nom, BASE_INDICE, couleur, graisse=600))
        o.append(txt(64, y + 116, formule, TEXTE_MIN, ENCRE))
        o.append(txt(656, y + 116, valeur, TEXTE_MIN, couleur, "end", 700))
        o.append(fleche(700, y + 75, cx - r - 14, cy + (y - 350) * 0.30,
                        couleur, 2.2, 12))

    o.append(ligne(40, 720, 1340, 720, GRIS_24, 1.5, filet=True))
    o.append(txt(60, 776, "les deux premières se règlent", TEXTE_MIN, BRIQUE,
                 graisse=600))
    o.append(txt(1340, 776, "la troisième ne se règle pas", TEXTE_MIN,
                 GRIS_58, "end"))
    return document(L6, H6, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 7 · le quotient qui ne bouge pas
# ═══════════════════════════════════════════════════════════════════════════

L7, H7 = 1380, 820


def fig07_proportion(V: dict) -> str:
    c = V["classe"]
    o = entete(40, 52, f"quatre poids de la ligne {c}")

    o += titres_colonnes(150, [
        (60.0, "j", "start"),
        (300.0, "a⁽¹⁾ⱼ", "end"),
        (640.0, f"∂ℓ/∂W⁽²⁾{indice(c)},ⱼ", "end"),
        (1340.0, "le quotient", "end"),
    ])

    m = max(abs(d) for _j, _a, d, _q in V["proportion"])
    haut = V["proportion"][0][1]
    for k, (j, a, d, q) in enumerate(V["proportion"]):
        y = 236 + k * pas(TEXTE_MIN, 2.2)
        o += rangee_colonnes(y, [
            (60.0, str(j), "start", ENCRE, 600),
            (300.0, nb(a, 4), "end", ENCRE, 600),
            (640.0, nb(d, 6, True), "end", ARDOISE, 600),
            (1340.0, nb(q, 6, True), "end", BRIQUE, 700),
        ])
        # Les deux barres rendent visible ce que les colonnes disent : la
        # correction est proportionnelle a l'activation, donc les deux profils
        # sont le meme profil.
        o.append(rect(700, y - 28, abs(d) / m * 280, 22, "none", 0, ARDOISE))
        o.append(rect(700, y - 2, a / haut * 280, 10, "none", 0, GRIS_24))

    o.append(ligne(60, 580, 1340, 580, ENCRE, 1.6, filet=True))
    o.append(txt(60, 648, f"δ{indice(c)} = {nb(V['db2'], 6, True)}", 60,
                 BRIQUE, graisse=700))
    o.append(txt(1340, 648, "le même sur les quatre lignes", TEXTE_MIN,
                 GRIS_58, "end"))
    o.append(txt(60, 740,
                 f"∂ℓ/∂W⁽²⁾{indice(c)},ⱼ = δ{indice(c)} · a⁽¹⁾ⱼ",
                 BASE_INDICE, ENCRE, graisse=700))
    return document(L7, H7, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 8 · les dix poids qui montent le plus
# ═══════════════════════════════════════════════════════════════════════════

L8, H8 = 1380, 990


def fig08_hebb(V: dict) -> str:
    o = entete(40, 52, "les dix poids qui montent le plus")

    # SIX COLONNES NE TIENNENT PAS A 33. « rang » et « k » sortent : le rang
    # est celui de la ligne, et k vaut 2 sur les dix lignes, ce que le pied de
    # la figure dit une fois.
    o += titres_colonnes(150, [
        (60.0, "j", "start"),
        (380.0, "a⁽¹⁾ⱼ", "end"),
        (740.0, "la hausse du poids", "end"),
        (1000.0, "rang de a⁽¹⁾ⱼ", "end"),
    ])

    m = max(montee for _k, _j, _a, montee, _r in V["hebb"])
    for r, (k, j, a, montee, rang_a) in enumerate(V["hebb"]):
        y = 232 + r * pas(TEXTE_MIN, 1.55)
        o += rangee_colonnes(y, [
            (60.0, str(j), "start", ENCRE, 600),
            (380.0, nb(a, 4), "end", ENCRE, 400),
            (740.0, nb(montee, 6, True), "end", BRIQUE, 600),
            (1000.0, str(rang_a), "end",
             ENCRE if rang_a == r + 1 else GRIS_58, 600),
        ])
        o.append(rect(1060, y - 28, montee / m * 280, 22, "none", 0, BRIQUE))

    o.append(ligne(60, 894, 1340, 894, ENCRE, 1.6, filet=True))
    sorties = sorted({k for k, *_ in V["hebb"]})
    o.append(txt(60, 950, f"les dix vont au neurone de sortie {sorties[0]}",
                 TEXTE_MIN, ENCRE, graisse=600))
    o.append(txt(1340, 950, "et ce sont les dix plus actifs", TEXTE_MIN,
                 GRIS_58, "end"))
    return document(L8, H8, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 9 · le sens demande se lit sur le signe du poids
# ═══════════════════════════════════════════════════════════════════════════

L9, H9 = 1380, 790


def fig09_signes(V: dict) -> str:
    c = V["classe"]
    o = entete(40, 52, "le signe du poids décide du sens")

    o += titres_colonnes(150, [
        (60.0, "j", "start"),
        (420.0, f"W⁽²⁾{indice(c)},ⱼ", "end"),
        (820.0, f"δ{indice(c)} · W⁽²⁾{indice(c)},ⱼ", "end"),
        (1340.0, "l'activation doit", "end"),
    ])

    for k, (j, w, contribution) in enumerate(V["signes"]):
        y = 240 + k * pas(TEXTE_MIN, 2.2)
        monte = contribution < 0
        couleur = ARDOISE if monte else BRIQUE
        o += rangee_colonnes(y, [
            (60.0, str(j), "start", ENCRE, 600),
            (420.0, nb(w, 4, True), "end", BRIQUE if w > 0 else ARDOISE, 600),
            (820.0, nb(contribution, 6, True), "end", couleur, 600),
            (1340.0, "monter" if monte else "descendre", "end", couleur, 700),
        ])
        o.append(fleche(900, y - 10, 900, y - 48 if monte else y + 28,
                        couleur, 2.4, 12))

    o.append(ligne(60, 604, 1340, 604, ENCRE, 1.6, filet=True))
    o.append(txt(60, 674, f"δ{indice(c)} = {nb(V['db2'], 6, True)}", 60,
                 ARDOISE, graisse=700))
    o.append(txt(1340, 674, "le même sur les quatre lignes", TEXTE_MIN,
                 GRIS_58, "end"))
    o.append(txt(1340, 734, "seul le poids change", TEXTE_MIN, GRIS_58, "end"))
    return document(L9, H9, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 10 · dix demandes sur une meme activation
# ═══════════════════════════════════════════════════════════════════════════

L10, H10 = 1380, 1070


def fig10_demandes(V: dict) -> str:
    j = V["j"]
    o = entete(40, 52, f"les dix demandes reçues par a⁽¹⁾{indice(j)}")

    o += titres_colonnes(150, [
        (60.0, "k", "start"),
        (300.0, "δₖ", "end"),
        (580.0, f"W⁽²⁾ₖ,{indice(j)}", "end"),
        (860.0, "le produit", "end"),
        (1340.0, "sens demandé", "end"),
    ])

    m = max(abs(contribution) for _k, _d, _w, contribution in V["demandes"])
    zero = 1040.0
    for k, d, w, contribution in V["demandes"]:
        y = 232 + k * pas(TEXTE_MIN, 1.55)
        monte = contribution < 0
        couleur = ARDOISE if monte else BRIQUE
        o += rangee_colonnes(y, [
            (60.0, str(k), "start", ENCRE, 600),
            (300.0, nb(d, 4, True), "end", GRIS_72, 400),
            (580.0, nb(w, 4, True), "end", GRIS_72, 400),
            (860.0, nb(contribution, 6, True), "end", couleur, 600),
        ])
        larg = abs(contribution) / m * 120
        o.append(rect(zero - larg if monte else zero, y - 28, larg, 22,
                      "none", 0, couleur))
        o.append(txt(1340, y, "monter" if monte else "descendre", TEXTE_MIN,
                     couleur, "end", 600))
    o.append(ligne(zero, 190, zero, 872, ENCRE, 1.6))

    o.append(ligne(60, 916, 1340, 916, ENCRE, 1.6, filet=True))
    total = V["demande_totale"]
    # LA SOMME A SA LIGNE. Composee a 49, « somme des dix   +0,006402 »
    # demande 674 pixels, et la mention de la composante 617 : cote a cote
    # elles se recouvraient de onze.
    o.append(txt(60, 978, f"somme des dix   {nb(total, 6, True)}",
                 BASE_INDICE, ENCRE, graisse=700))
    o.append(txt(60, 1032, "plus petite que la plus forte", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(1340, 1032, f"= la composante {j} de (W⁽²⁾)ᵀ δ⁽²⁾",
                 TEXTE_MIN, GRIS_58, "end"))
    return document(L10, H10, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 11 · la demande descend d'une couche et passe une porte
# ═══════════════════════════════════════════════════════════════════════════

L11, H11 = 1380, 900


def fig11_arriere(V: dict) -> str:
    j = V["j"]
    o = entete(40, 52, "la demande descend, et passe une porte")

    # LE NOM D'UNE ETAPE EST UNE LISTE DE LIGNES, pas une chaine. Compose a
    # 49, « (W⁽²⁾)ᵀ δ⁽²⁾ » demande 323 pixels pour un cadre qui en fait 290 :
    # il en sortait des deux cotes, et le crible le voyait a cheval sur son
    # propre aplat. Ce qui ne tient pas sur une ligne en prend deux.
    etapes = [
        (["δ⁽²⁾"], "signal de sortie", f"{V['K']} composantes", ENCRE),
        (["(W⁽²⁾)ᵀ", "δ⁽²⁾"], "la demande reçue", f"{V['H']} composantes",
         ENCRE),
        (["⊙ φ′(z⁽¹⁾)"], "la porte ReLU",
         f"{V['H'] - V['allumes']} annulées", BRIQUE),
        (["δ⁽¹⁾"], "signal caché", f"{V['allumes']} non nulles", ENCRE),
    ]
    for k, (noms, quoi, combien, couleur) in enumerate(etapes):
        x = 40.0 + k * 335.0
        o.append(rect(x, 150, 290, 130, couleur, 2.2, PAPIER))
        haut = 215 - (len(noms) - 1) * pas(BASE_INDICE) / 2 + 16
        o += colonne(x + 145, haut, noms, BASE_INDICE, couleur, "middle", 600)
        o.append(txt(x + 145, 330, quoi, TEXTE_MIN, GRIS_58, "middle"))
        o.append(txt(x + 145, 376, combien, TEXTE_MIN, GRIS_72, "middle"))
        if k < 3:
            o.append(fleche(x + 296, 215, x + 329, 215, GRIS_58, 2.2, 12))

    # Les deux memes nombres, sur le neurone allume et sur un neurone eteint.
    eteint, z_eteint, demande_eteint, delta_eteint = V["eteint"]
    o.append(ligne(40, 430, 1340, 430, GRIS_24, 1.5, filet=True))
    o += titres_colonnes(490, [
        (60.0, "neurone", "start"),
        (620.0, "z⁽¹⁾ⱼ", "end"),
        (960.0, "demande reçue", "end"),
        (1340.0, "δ⁽¹⁾ⱼ", "end"),
    ])
    for k, (nom, z, demande, delta, couleur) in enumerate((
            (f"j = {j}, allumé", V["z1_j"], V["demande_totale"],
             V["delta1_j"], ENCRE),
            (f"j = {eteint}, éteint", z_eteint, demande_eteint, delta_eteint,
             GRIS_58))):
        y = 576 + k * pas(TEXTE_MIN, 2.0)
        o += rangee_colonnes(y, [
            (60.0, nom, "start", couleur, 600),
            (620.0, nb(z, 4, True), "end", couleur, 400),
            (960.0, nb(demande, 6, True), "end", couleur, 400),
            (1340.0, "0" if delta == 0 else nb(delta, 6, True), "end",
             BRIQUE if k else couleur, 700),
        ])

    o.append(ligne(40, 740, 1340, 740, ENCRE, 1.6, filet=True))
    o.append(txt(60, 796, "un neurone éteint ne transmet rien", TEXTE_MIN,
                 ENCRE, graisse=600))
    o.append(txt(60, 850, "la porte se ferme dans les deux sens", TEXTE_MIN,
                 GRIS_58))
    return document(L11, H11, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 12 · ce qui arrive si l'on n'ecoute qu'un seul exemple
# ═══════════════════════════════════════════════════════════════════════════

L12, H12 = 1380, 820


def fig12_un_exemple(V: dict) -> str:
    a = V["apres"]
    o = entete(40, 52, f"200 pas sur la seule image n°{V['n']}")

    # Les dix mille images de test, et ce qu'elles obtiennent.
    x0, largeur, y = 40.0, 1300.0, 150.0
    o.append(rect(x0, y, largeur, 120, "none", 0, BRIQUE))
    o.append(txt(x0 + 32, y + 78,
                 f"{nb(100 * a['predites_temoin'] / a['total'], 2)} %", 60,
                 PAPIER, graisse=700))
    o.append(txt(x0 + largeur - 32, y + 78,
                 f"{ent(a['predites_temoin'])} sur {ent(a['total'])} "
                 f"prédites « {V['classe']} »", TEXTE_MIN, PAPIER, "end",
                 600))

    o.append(ligne(40, 344, 1340, 344, GRIS_24, 1.5, filet=True))
    lignes = [
        ("précision de test avant", nb(V["avant_pas"], 4), GRIS_72),
        ("perte sur cette image après", nb(a["perte"], 6), GRIS_72),
        (f"probabilité de la classe {V['classe']}", nb(a["probabilite"], 10),
         GRIS_72),
        ("précision de test après", nb(a["exactitude"], 4), BRIQUE),
        (f"fréquence de la classe {V['classe']} au test",
         f"{ent(a['compte_temoin'])} / {ent(a['total'])} = "
         f"{nb(a['frequence'], 4)}", BRIQUE),
    ]
    for k, (nom, valeur, couleur) in enumerate(lignes):
        yl = 404 + k * pas(TEXTE_MIN, 1.55)
        o.append(txt(60, yl, nom, TEXTE_MIN, GRIS_58))
        o.append(txt(1340, yl, valeur, BASE_INDICE, couleur, "end", 600))

    o.append(ligne(40, 724, 1340, 724, ENCRE, 1.6, filet=True))
    o.append(txt(60, 780, "les deux derniers nombres sont égaux", TEXTE_MIN,
                 ENCRE, graisse=600))
    return document(L12, H12, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 13 · le reseau entier, et le sens que ce chapitre remonte
#
# NEUVE. La page 1 ne portait aucune figure fixe, et c'est la page ou il en
# faut le plus : le lecteur arrive du chapitre 3, ou il n'a vu que des
# surfaces et des pas. « il manque une grosse image qui montre a quoi
# ressemble un reseau » -- RETOURS.md, entree 20, pour le chapitre 2.
#
# ELLE NE PORTE AUCUN SYMBOLE. Trois colonnes de ronds, leurs trois nombres,
# et deux fleches : l'aller en gris, le retour en brique. Rien d'autre ne peut
# y etre lu avant d'avoir ete pose.
# ═══════════════════════════════════════════════════════════════════════════

L13, H13 = 1380, 900


def _colonne_neurones(cx, y0, hauteur, combien, r=20.0) -> tuple:
    """Une colonne de ronds, abregee par un ⋮ quand elle est trop longue.

    LA SORTIE MONTRE SES DIX RONDS. Dix tiennent dans la hauteur, et abreger
    ce qui tient se lit comme un aveu qu'on n'a pas compte : le chapitre 2
    prend le meme parti pour la meme colonne.

    Rend les objets et la liste des ordonnees VISIBLES, pour que les liaisons
    se tracent entre ce qu'on voit et non entre ce qu'on imagine.
    """
    o, ys = [], []
    if combien <= 10:
        ecart = hauteur / (combien - 1)
        for i in range(combien):
            y = y0 + i * ecart
            o.append(cercle(cx, y, r, PAPIER, ENCRE, 2.4))
            ys.append(y)
        return o, ys
    ecart = hauteur / 4.2
    for i in range(3):
        y = y0 + i * ecart
        o.append(cercle(cx, y, r, PAPIER, ENCRE, 2.4))
        ys.append(y)
    o.append(suspension(cx, y0 + 3.1 * ecart, GRIS_58, 4.0, 18.0))
    dernier = y0 + hauteur
    o.append(cercle(cx, dernier, r, PAPIER, ENCRE, 2.4))
    ys.append(dernier)
    return o, ys


def fig13_reseau_entier(V: dict) -> str:
    o = entete(40, 52, "le réseau, et les deux sens")

    # L'image d'entree, en petit et sans cote : elle dit d'ou partent les
    # sept cent quatre-vingt-quatre ronds, et rien de plus.
    cote = 6.5
    gx, gy = 60.0, 320.0
    o += grille_encre(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.4))

    colonnes = []
    for cx, combien in ((440.0, 784), (760.0, V["H"]), (1080.0, V["K"])):
        objets, ys = _colonne_neurones(cx, 260.0, 340.0, combien,
                                       20.0 if combien > 10 else 15.0)
        colonnes.append((cx, ys, objets))

    # Les liaisons passent SOUS les ronds : elles sont tracees d'abord.
    for (cx0, ys0, _), (cx1, ys1, _) in zip(colonnes, colonnes[1:]):
        for y0 in ys0:
            for y1 in ys1:
                o.append(ligne(cx0 + 22, y0, cx1 - 22, y1, GRIS_14, 1.0))
    for _cx, _ys, objets in colonnes:
        o += objets
    o.append(fleche(gx + 28 * cote + 16, 400, 400, 400, GRIS_58, 2.2, 12))

    for cx, combien, quoi in ((440.0, "784", "un par pixel"),
                              (760.0, f"{V['H']}", "un choix"),
                              (1080.0, f"{V['K']}", "un par chiffre")):
        o.append(txt(cx, 700, combien, 60, ENCRE, "middle", 700))
        o.append(txt(cx, 752, quoi, TEXTE_MIN, GRIS_58, "middle"))

    # L'aller, et le retour. Les deux fleches ne se croisent pas : l'une passe
    # au-dessus des colonnes, l'autre en dessous.
    o.append(fleche(360, 180, 1160, 180, GRIS_58, 2.6, 14))
    o.append(txt(360, 152, "l'aller, chapitre 2", TEXTE_MIN, GRIS_58))
    o.append(fleche(1160, 830, 360, 830, BRIQUE, 2.6, 14))
    o.append(txt(1160, 802, "le retour, ce chapitre", TEXTE_MIN, BRIQUE,
                 "end", 600))
    return document(L13, H13, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 14 · un seul passage, au lieu de deux cent trois mille
#
# NEUVE. La page 11 ne portait aucune figure fixe non plus. Le compte des
# propagations est le seul nombre du chapitre qui ne depende ni de la machine
# ni du langage : il merite d'etre vu, et pas seulement lu.
#
# LE PEIGNE N'EST PAS UNE DECORATION. Quatre-vingts traits pour 203 540
# propagations, c'est un echantillon et la figure le dit ; ce qu'on voit,
# c'est qu'on ne les compte pas.
# ═══════════════════════════════════════════════════════════════════════════

L14, H14 = 1380, 780


def fig14_cout(V: dict) -> str:
    propagations = 2 * V["p"]
    o = entete(40, 52, "ce qu'une dérivée coûte")

    # Les differences finies : un peigne, et son compte.
    o.append(txt(60, 150, "par différences finies centrées", TEXTE_MIN,
                 GRIS_58))
    for i in range(80):
        x = 60.0 + i * 15.0
        o.append(ligne(x, 180, x, 260, GRIS_40, 2.0))
    o.append(suspension(1290, 220, GRIS_58, 4.0, 18.0))
    # LE COMPTE SE POSE SOUS LE PEIGNE, pas dedans. Le crible garde un quart
    # de la taille du texte autour de sa boite : a 60, cela fait quinze
    # pixels, et le compte pose a 320 les mordait.
    o.append(txt(60, 352, f"{ent(propagations)} propagations avant", 60,
                 ENCRE, graisse=700))
    o.append(txt(1340, 352, "pour un seul exemple", TEXTE_MIN, GRIS_58,
                 "end"))

    o.append(ligne(40, 430, 1340, 430, GRIS_24, 1.5, filet=True))

    # La retropropagation : deux fleches, et c'est tout. Les deux cotes
    # tiennent a gauche, le rapport a droite : compose a 60 il venait sur
    # elles.
    o.append(txt(60, 490, "par rétropropagation", TEXTE_MIN, BRIQUE))
    o.append(fleche(60, 556, 500, 556, GRIS_58, 3.0, 16))
    o.append(txt(524, 568, "1 aller", BASE_INDICE, GRIS_58))
    o.append(fleche(500, 626, 60, 626, BRIQUE, 3.0, 16))
    o.append(txt(524, 638, "1 retour", BASE_INDICE, BRIQUE, graisse=600))
    o.append(txt(1340, 606, f"1 au lieu de {ent(propagations)}", BASE_INDICE,
                 BRIQUE, "end", 700))

    o.append(ligne(40, 700, 1340, 700, ENCRE, 1.6, filet=True))
    o.append(txt(60, 756, "le rapport ne dépend d'aucune machine", TEXTE_MIN,
                 ENCRE, graisse=600))
    return document(L14, H14, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 15 · le trajet du retour, d'un bout a l'autre
#
# NEUVE. La page 12 rassemblait huit lignes de formulaire sans jamais montrer
# l'ordre dans lequel elles s'executent. Ce n'est pas un tableau redessine :
# aucune page ne montre le trajet ENTIER, et c'est le seul endroit ou les six
# egalites se lisent comme une suite d'operations.
# ═══════════════════════════════════════════════════════════════════════════

L15, H15 = 1380, 920


def fig15_le_trajet(V: dict) -> str:
    o = entete(40, 52, "le retour, dans l'ordre où il s'exécute")

    # La colonne du milieu porte ce qui se transmet ; les deux ailes portent
    # ce qui se recolte au passage et ne repart pas.
    etapes = [
        (170.0, "a⁽²⁾ − y", "δ⁽²⁾", ["grad b⁽²⁾", "grad W⁽²⁾"]),
        (400.0, "(W⁽²⁾)ᵀ δ⁽²⁾", "la demande sur a⁽¹⁾", []),
        (630.0, "⊙ φ′(z⁽¹⁾)", "δ⁽¹⁾", ["grad b⁽¹⁾", "grad W⁽¹⁾"]),
    ]
    # LA COLONNE DU MILIEU EST POUSSEE A DROITE. A 33, « la matrice, lue en
    # colonnes » demande 490 pixels : posee a 60 elle entrait de 130 dans les
    # cadres, qui commencaient a 420. Trois bandes franches, et rien qui se
    # chevauche : les notes, les cadres, les recoltes.
    for y, operation, produit, recoltes in etapes:
        o.append(rect(600, y, 400, 120, ENCRE, 2.2, PAPIER))
        o.append(txt(800, y + 52, operation, BASE_INDICE, ENCRE, "middle",
                     600))
        o.append(txt(800, y + 98, produit, TEXTE_MIN, GRIS_58, "middle"))
        for k, recolte in enumerate(recoltes):
            yr = y + 52 + k * pas(TEXTE_MIN, 1.4)
            o.append(txt(1340, yr, recolte, TEXTE_MIN, BRIQUE, "end", 600))
            o.append(fleche(1014, yr - 10, 1062, yr - 10, BRIQUE, 2.2, 12))
    for y in (170.0, 400.0):
        o.append(fleche(800, y + 128, 800, y + 222, ENCRE, 2.4, 14))

    o.append(txt(60, 222, "l'étiquette entre ici", TEXTE_MIN, GRIS_58))
    o.append(fleche(470, 250, 592, 250, GRIS_58, 2.2, 12))
    o.append(txt(60, 452, "la matrice, lue en colonnes", TEXTE_MIN, GRIS_58))
    o.append(txt(60, 682, "la porte, décidée à l'aller", TEXTE_MIN, GRIS_58))

    o.append(ligne(40, 806, 1340, 806, ENCRE, 1.6, filet=True))
    o.append(txt(60, 866, "sur tout le jeu, on en fait la moyenne", TEXTE_MIN,
                 ENCRE, graisse=600))
    return document(L15, H15, o)


# ═══════════════════════════════════════════════════════════════════════════
# CE QU'ON ECRIT
# ═══════════════════════════════════════════════════════════════════════════

FIGURES = {
    "l4-fig01-cadre.svg": (fig01_cadre, L1, H1),
    "l4-fig02-importance.svg": (fig02_importance, L2, H2),
    "l4-fig03-exemple.svg": (fig03_exemple, L3, H3),
    "l4-fig04-sortie.svg": (fig04_sortie, L4, H4),
    "l4-fig05-delta.svg": (fig05_delta, L5, H5),
    "l4-fig06-trois-voies.svg": (fig06_trois_voies, L6, H6),
    "l4-fig07-proportion.svg": (fig07_proportion, L7, H7),
    "l4-fig08-hebb.svg": (fig08_hebb, L8, H8),
    "l4-fig09-signes.svg": (fig09_signes, L9, H9),
    "l4-fig10-demandes.svg": (fig10_demandes, L10, H10),
    "l4-fig11-arriere.svg": (fig11_arriere, L11, H11),
    "l4-fig12-un-exemple.svg": (fig12_un_exemple, L12, H12),
    "l4-fig13-reseau-entier.svg": (fig13_reseau_entier, L13, H13),
    "l4-fig14-cout.svg": (fig14_cout, L14, H14),
    "l4-fig15-le-trajet.svg": (fig15_le_trajet, L15, H15),
}


def main() -> None:
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, ValueError, OSError):
            pass
    debut = time.time()
    refaire = "--refaire" in sys.argv
    print("  Chapitre 4 : les figures.")
    print("  Toutes les valeurs sortent de mesures.py, mesures 1, 3, 4, 6 et 8.")
    print(f"  Plancher de texte : {TEXTE_MIN} px, regle 32.")
    V = mesurer(refaire)
    print(f"  mesures prêtes en {time.time() - debut:.1f} s\n")

    SORTIE.mkdir(parents=True, exist_ok=True)
    for nom, (fabrique, largeur, hauteur) in FIGURES.items():
        cible = SORTIE / nom
        contenu = fabrique(V)
        cible.write_text(contenu, encoding="utf-8")
        print(f"  ✓ {nom:<32} {largeur} × {hauteur}"
              f"   {len(contenu.encode('utf-8')) / 1024:>6.0f} Ko")
    print(f"\n  {len(FIGURES)} figures dans "
          f"{SORTIE.relative_to(SORTIE.parents[2])}")
    print(f"  duree totale : {time.time() - debut:.1f} s")


if __name__ == "__main__":
    main()
