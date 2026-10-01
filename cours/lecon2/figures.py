"""Chapitre 2 : les vingt et une figures fixes.

    python cours/lecon2/figures.py

CE FICHIER N'ECRIT AUCUN NOMBRE A LA MAIN. Il importe cours/lecon2/mesures.py
et se sert de SES fonctions -- entrainer, avant, extrema -- avec SON protocole :
graine 0, mini-lots de 64, entropie croisee. Chaque valeur affichee par une
figure est donc calculee par le programme de mesures du chapitre, et non
recopiee depuis une sortie de console qui aurait pu vieillir.

Deux exceptions, et elles sont explicites :

  - la geometrie du detecteur de bord (lignes 8 a 10, colonnes 9 a 21, marge
    de 3) est POSEE a la main dans mesures.py, section 3, comme construction
    du cours et non comme mesure. Elle est redeclaree ici, signalee, et tous
    les SCORES qui en decoulent sont recalcules ;
  - le seuil de la figure 9 est le score mesure de l'image de test n°0 au
    temps 1 du detecteur, pour que le seuil tombe sur un nombre du chapitre
    plutot que sur un nombre rond.

LE TRAIT -- palette, primitives SVG, grilles 28 x 28 -- vient de
cours/schema.py, commun aux figures de tout le parcours. Ce fichier ne porte
que les figures du chapitre et leurs mesures.

LA GRILLE D'ENTREE DESSINE SES 784 RONDS. La consigne « on ne dessine pas
784 ronds » vaut pour une COLONNE, ou ils ne tiennent pas ; en grille 28 x 28
ils tiennent et se lisent. La colonne, elle, est abregee et cotee.

L'INVERSION DU NIVEAU DE GRIS. Sur fond papier un pixel encre est SOMBRE. Un
octet de 254 donne donc un rond presque noir, et non presque blanc.

Table de correspondance : cours/figures/CORRESPONDANCE.md
"""

from __future__ import annotations

import hashlib
import inspect
import math
import os
import pickle
import sys
import time
from pathlib import Path

# BLAS EST BRIDE AVANT L'IMPORT DE NUMPY, pour la meme raison qu'en tete de
# mesures.py : les matrices d'un mini-lot sont minuscules, et la
# synchronisation de douze fils coute plus cher que la multiplication. La
# bibliotheque ne lit ces variables qu'a son chargement, et charger numpy avant
# de les poser multiplie par vingt la duree des deux entrainements.
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
    ENCRE,
    GRIS_08,
    GRIS_14,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    GRIS_72,
    MOINS,
    PAPIER,
    SOUSCRITS,
    accolade,
    bloc,
    boite,
    cadre_grille,
    cercle,
    colonne,
    couper,
    document,
    ent,
    entete,
    fleche,
    grille_encre,
    grille_poids,
    grille_ronds,
    gris,
    largeur_texte,
    ligne,
    nb,
    pas,
    poids,
    rect,
    reperes_grille,
    sci,
    suspension,
    txt,
    txt_indice,
    xk,
)

SORTIE = Path(__file__).resolve().parents[2] / "public" / "cours" / "lecon2"
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

# Le controle mecanique : node outils/verifier-figures.mjs


# `txt` vient de schema.py, commun a tout le parcours. On l'enveloppe ici
# plutot que de le modifier la-bas : le plancher est une regle du COURS, et
# schema.py sert aussi a des figures qui ne sont pas servies dans une colonne
# de 640.
_entete_brut = entete


def entete(x, y, texte, largeur=360):  # noqa: F811
    """Le titre d'un panneau, au plancher, COUPE A LA LARGEUR DU PANNEAU.

    `schema.entete` le compose a 17 et ne le coupe pas. A 33, « 3 · les lignes
    s'empilent » demande 436 pixels : ecrit d'un trait il entrait dans le titre
    du panneau voisin. Il se coupe donc, et le filet passe sous la derniere
    ligne.
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
    return _txt_brut(x, y, contenu, taille, couleur, ancre, graisse, italique)


# `txt_indice` compose son indice a 0,68 fois la base : pour que l'indice
# atteigne le plancher, la base doit valoir 33 / 0,68, soit 49. Un « x » compose
# a 49 avec son « 231 » a 33 : c'est la proportion normale d'un indice, et les
# deux se lisent.
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


def boite(x, y, w, h, nom, dims, couleur=ENCRE, fond="none", dy=0.0):  # noqa: F811
    """
    Une matrice et ses dimensions, au plancher. `schema.boite` compose le nom a
    16 et les dimensions a 12 ; les deux passent a 33, et les deux ecarts
    grandissent avec eux — sans quoi le nom viendrait toucher le trait du haut.
    """
    return [
        rect(x, y, w, h, couleur, 2.0, fond),
        txt(x + w / 2, y - 16, nom, TEXTE_MIN, couleur, "middle", 600),
        txt(x + w / 2, y + h + 46 + dy, dims, TEXTE_MIN, GRIS_58, "middle"),
    ]


def reperes_grille(x0, y0, cote, marques=(1, 28)):  # noqa: F811
    """
    Les reperes d'une grille, au plancher et REDUITS A DEUX.

    `schema.reperes_grille` en pose cinq — 1, 7, 14, 21, 28 — a la taille 12.
    A 33, cinq nombres par cote encombrent la grille qu'ils servent, et trois
    d'entre eux ne disent rien de plus : ce qu'un repere doit etablir, c'est que
    la grille compte 28 rangs et qu'ils se numerotent a partir de 1. Le premier
    et le dernier le disent.
    """
    o = []
    for k in marques:
        c = x0 + (k - 0.5) * cote
        o.append(txt(c, y0 - 16, str(k), TEXTE_MIN, GRIS_58, "middle"))
        o.append(txt(x0 - 18, y0 + (k - 0.5) * cote + 11, str(k), TEXTE_MIN,
                     GRIS_58, "end"))
    return o


# ═══════════════════════════════════════════════════════════════════════════
# LES MESURES
#
# Tout ce que les figures affichent est calcule ici, par les fonctions
# de mesures.py et avec son protocole. Rien n'est recopie.
# ═══════════════════════════════════════════════════════════════════════════

# La geometrie du detecteur de bord de la page 5. Elle est POSEE, pas mesuree :
# mesures.py, section 3, la pose de la meme facon. Les scores, eux, sont
# recalcules plus bas.
DET_L0, DET_L1, DET_C0, DET_C1, DET_MARGE = 8, 10, 9, 21, 3


def _detecteur() -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """La zone, le pourtour, et la tache large. Section 3 de mesures.py."""
    zone = np.zeros((28, 28))
    zone[DET_L0 - 1:DET_L1, DET_C0 - 1:DET_C1] = 1.0

    pourtour = np.zeros((28, 28))
    pourtour[max(0, DET_L0 - 1 - DET_MARGE):DET_L1 + DET_MARGE,
             max(0, DET_C0 - 1 - DET_MARGE):DET_C1 + DET_MARGE] = 1.0
    pourtour = np.clip(pourtour - zone, 0.0, 1.0)

    tache = np.zeros((28, 28))
    tache[DET_L0 - 1 - DET_MARGE:DET_L1 + DET_MARGE,
          DET_C0 - 1 - DET_MARGE:DET_C1 + DET_MARGE] = 1.0
    return zone, pourtour, tache


# LE CACHE. Les deux entrainements coutent quelques minutes, et rien ne change
# entre deux retouches de geometrie. La cle du cache est l'empreinte des DEUX
# fichiers dont les mesures dependent -- mesures.py et donnees.py -- ET du
# source de `calculer`, la seule fonction de ce fichier qui produise des
# valeurs. Modifier l'un des trois invalide le cache, et les figures se refont
# sur les nouvelles valeurs. Deux modes de defaillance comptent ici, et les
# deux sont fermes : une figure qui afficherait des nombres perimes, et une
# figure qui reclamerait une valeur AJOUTEE a `calculer` sans que le cache la
# porte -- elle echouait sur un KeyError, puisque retoucher ce fichier ne
# changeait pas la cle. Retoucher une geometrie, elle, ne coute toujours rien.
CACHE = RACINE / ".donnees" / "l2-figures.pickle"


def _empreinte() -> str:
    h = hashlib.sha256()
    for module in (M, D):
        h.update(Path(module.__file__).read_bytes())
    h.update(inspect.getsource(calculer).encode("utf-8"))
    return h.hexdigest()


def mesurer(refaire: bool = False) -> dict:
    signature = _empreinte()
    if not refaire and CACHE.exists():
        enveloppe = pickle.loads(CACHE.read_bytes())
        if enveloppe.get("signature") == signature:
            print("  mesures relues du cache "
                  f"({CACHE.relative_to(RACINE.parent)})")
            return enveloppe["valeurs"]
    V = calculer()
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_bytes(pickle.dumps({"signature": signature, "valeurs": V}))
    return V


def calculer() -> dict:
    """Les deux entrainements du chapitre, et tout ce qui s'en deduit."""
    V: dict = {}
    Xtr, ctr, Xte, cte = D.charger()
    V["Xte"], V["cte"] = Xte, cte

    # ── L'image de test n°0. mesures.py, section 2 ──────────────────────────
    x0 = Xte[0]
    V["image"] = x0.reshape(28, 28)
    V["octets"] = np.rint(V["image"] * 255).astype(int)
    V["classe0"] = int(cte[0])
    V["non_nuls"] = int((x0 > 0).sum())
    V["somme_octets"] = int(V["octets"].sum())
    encrees = np.nonzero(V["octets"].sum(axis=1) > 0)[0] + 1
    V["lignes_encrees"] = (int(encrees.min()), int(encrees.max()))
    V["cites"] = [(i, j, int(V["octets"][i - 1, j - 1]),
                   float(V["image"][i - 1, j - 1]), 28 * (i - 1) + j)
                  for (i, j) in ((9, 7), (9, 8), (13, 20))]

    # ── Le detecteur de bord. mesures.py, section 3 ─────────────────────────
    zone, pourtour, tache = _detecteur()
    V["zone"], V["pourtour"], V["tache"] = zone, pourtour, tache
    V["det_compte"] = (int(zone.sum()), int(pourtour.sum()),
                       784 - int(zone.sum()) - int(pourtour.sum()))
    w1 = zone.reshape(-1)
    w3 = (zone - pourtour).reshape(-1)
    choix = [(7, int(np.nonzero(cte == 7)[0][0])),
             (1, int(np.nonzero(cte == 1)[0][0])),
             (0, int(np.nonzero(cte == 0)[0][0]))]
    entrees = [(f"test n°{i}", f"un {k}", Xte[i]) for k, i in choix]
    entrees.append(("tache large", "construite", tache.reshape(-1)))
    V["det_entrees"] = [(n, s, float(w1 @ x), float(w3 @ x))
                        for n, s, x in entrees]
    V["det_images"] = [x.reshape(28, 28) for _, _, x in entrees]

    # ── Le modele lineaire. mesures.py, section 4 ───────────────────────────
    r1 = M.entrainer((784, 10), "identite", "zero", 0.5, 30,
                     Xtr, ctr, Xte, cte)
    W = r1["theta"]["W1"]
    V["gabarits"] = [W[k].reshape(28, 28) for k in range(10)]
    V["gabarit_extrema"] = [M.extrema(G) for G in V["gabarits"]]
    V["p_lineaire"] = M.compter(r1["theta"])
    cache_lin = M.avant(r1["theta"], Xte[0:1], "identite")
    V["z_lineaire"], V["a_lineaire"] = cache_lin["Z1"][0], cache_lin["A1"][0]

    # LE NEURONE DE LA PAGE 4. C'est celui qui note le 0 : la ligne 0 de W, son
    # biais, et la preactivation z = w^T x + b sur l'image de test n°0. La
    # page 4 ne dispose que de x, w, b et z -- ni couche, ni ReLU, ni
    # activation, ni indice de neurone cache. La figure 5 replie CE MEME w en
    # gabarit : les deux figures de la page parlent du meme neurone.
    V["neurone0"] = {
        "w": W[0],
        "b": float(r1["theta"]["b1"][0]),
        "z": float(cache_lin["Z1"][0, 0]),
    }

    # ── Le reseau du chapitre. mesures.py, section 7 ────────────────────────
    r3 = M.entrainer((784, 128, 10), "relu", "he", 0.5, 30,
                     Xtr, ctr, Xte, cte)
    theta = r3["theta"]
    V["p_reseau"] = M.compter(theta)
    V["blocs_p"] = [("W", 1, theta["W1"].size, "128 × 784"),
                    ("b", 1, theta["b1"].size, "128"),
                    ("W", 2, theta["W2"].size, "10 × 128"),
                    ("b", 2, theta["b2"].size, "10")]
    V["part_W1"] = 100.0 * theta["W1"].size / V["p_reseau"]
    V["acc_reseau"], V["err_reseau"] = r3["acc"], r3["erreurs"]

    cache = M.avant(theta, Xte[0:1], "relu")
    z1, a1 = cache["Z1"][0], cache["A1"][0]
    V["z2"], V["a2"] = cache["Z2"][0], cache["A2"][0]
    V["a1_non_nuls"] = int((a1 > 0).sum())
    j_haut = int(np.argmax(z1))
    V["neurone"] = (j_haut + 1, float(z1[j_haut]), float(a1[j_haut]))

    # ── La correlation qui refute l'espoir. mesures.py, section 7 ───────────
    Wl, Wc = r1["theta"]["W1"], theta["W1"]
    Zl = (Wl - Wl.mean(axis=1, keepdims=True)) / Wl.std(axis=1, keepdims=True)
    Zc = (Wc - Wc.mean(axis=1, keepdims=True)) / Wc.std(axis=1, keepdims=True)
    R = np.abs((Zc @ Zl.T) / 784.0)
    jm, km = np.unravel_index(int(R.argmax()), R.shape)
    V["rho"] = {"max": float(R.max()), "j": int(jm) + 1, "k": int(km),
                "moyenne": float(R.mean()), "couples": int(R.size),
                "au_dessus": int((R > 0.5).sum())}

    # ── La paire de 4 de la page 7. mesures.py, section 5 ──────────────────
    # Le protocole est celui de `_paire_page7` : les deux modeles doivent
    # classer 4 aux DEUX bouts, la recherche est exhaustive et prise dans
    # l'ordre des indices, et rien n'y est tire au sort. Elle est refaite ici
    # parce que cette fonction imprime son releve et ne rend rien ; les deux
    # propagations passent par M.avant, et la paire trouvee est donc la sienne.
    # On s'arrete au premier couple qui casse : le compte total des couples qui
    # cassent est le sujet de la section 5, pas celui de la figure.
    quatre = np.nonzero(cte == 4)[0]
    lin_q = M.avant(r1["theta"], Xte[quatre], "identite")["A1"].argmax(axis=1)
    relu_q = M.avant(theta, Xte[quatre], "relu")["A2"].argmax(axis=1)
    bons = quatre[(lin_q == 4) & (relu_q == 4)]
    paire = None
    for a in range(len(bons) - 1):
        autres = bons[a + 1:]
        milieux = (Xte[bons[a]][None, :] + Xte[autres]) / 2.0
        pm = M.avant(theta, milieux, "relu")["A2"].argmax(axis=1)
        casse = np.nonzero(pm != 4)[0]
        if len(casse):
            paire = (int(bons[a]), int(autres[int(casse[0])]))
            break
    if paire is None:
        raise RuntimeError(
            "aucune paire de 4 dont le modele a ReLU coupe le milieu : "
            "la figure 16 de la page 7 n'a plus d'objet.")
    i7, j7 = paire
    trois = np.stack([Xte[i7], Xte[j7], (Xte[i7] + Xte[j7]) / 2.0])
    V["paire7"] = {
        "i": i7, "j": j7,
        "images": [x.reshape(28, 28) for x in trois],
        "lineaire": [int(k) for k in M.avant(
            r1["theta"], trois, "identite")["A1"].argmax(axis=1)],
        "quatre": int(len(quatre)), "bons": int(len(bons)),
    }

    # ── Les quatre modeles, pour la figure de la page 11. Les modeles 2 et 4
    #    ne servent qu'a cette figure ; on les mesure par les fonctions de
    #    mesures.py -- memes appels que sa section 10 -- pour que les nombres
    #    soient exactement les siens et non une reimplementation. r1 et r3 sont
    #    deja entraines plus haut ; on les reutilise.
    #
    #    LE BALAYAGE DU PAS est refait ici par M.entrainer au lieu d'appeler
    #    M.section_modele2, qui le fait aussi mais ne rend que le modele
    #    retenu : la figure 17 a besoin des SIX points, dont celui qui diverge.
    #    Memes six pas, memes 15 epoques, meme initialisation, meme regle de
    #    depart -- le premier maximum strict gagne, comme dans sa section 6.
    balayage = []
    meilleur: tuple[float | None, float] = (None, -1.0)
    for eta in (0.50, 0.20, 0.10, 0.05, 0.02, 0.01):
        r = M.entrainer((784, 128, 10), "identite", "he", eta, 15,
                        Xtr, ctr, Xte, cte)
        balayage.append((eta, None if r["diverge"] else float(r["acc"])))
        if not r["diverge"] and r["acc"] > meilleur[1]:
            meilleur = (eta, float(r["acc"]))
    V["balayage"], V["eta_retenu"] = balayage, meilleur[0]
    r2 = M.entrainer((784, 128, 10), "identite", "he", meilleur[0], 15,
                     Xtr, ctr, Xte, cte)
    r4 = M.section_modele4(Xtr, ctr, Xte, cte)
    V["tableau"] = [
        (1, "784 → 10", "aucune", M.compter(r1["theta"]),
         r1["acc"], r1["erreurs"]),
        (2, "784 → 128 → 10", "aucune", M.compter(r2["theta"]),
         r2["acc"], r2["erreurs"]),
        (3, "784 → 128 → 10", "ReLU", V["p_reseau"],
         V["acc_reseau"], V["err_reseau"]),
        (4, "784 → 16 → 16 → 10", "ReLU", M.compter(r4["theta"]),
         r4["acc"], r4["erreurs"]),
    ]

    # ── La sigmoide. mesures.py, section 11 ────────────────────────────────
    V["sigma"] = [(z, sigma(z)) for z in (-10.0, -1.0, 0.0, 1.0, 10.0)]
    return V


def sigma(z: float) -> float:
    """L'ecriture en deux branches de mesures.py, section 11 : elle ne
    deborde ni d'un cote ni de l'autre."""
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    e = math.exp(z)
    return e / (1.0 + e)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 1 · une planche d'images du jeu, prises par leur indice
# ═══════════════════════════════════════════════════════════════════════════

L1, H1 = 1380, 540


def fig01_planche(V: dict) -> str:
    o = entete(40, 40, "douze images du jeu de test",
               1300)
    cote, pitch, colonnes = 4.6, 210.0, 6
    x0, y0 = 100.0, 92.0
    for n in range(12):
        gx = x0 + (n % colonnes) * pitch
        gy = y0 + (n // colonnes) * 200.0
        o += grille_encre(gx, gy, cote, V["Xte"][n].reshape(28, 28))
        o.append(cadre_grille(gx, gy, cote, GRIS_24, 1.4))
        # UN SEUL LIBELLE. Le numero cale a gauche et la classe cadree a
        # droite demandaient 146 pixels sous une vignette qui en fait 129 :
        # « n°10 » et « un 0 » se touchaient. Les deux tiennent en une ligne,
        # et elle reste dans l'entraxe de 210.
        o.append(txt(gx, gy + 28 * cote + 36, f"n°{n} · un {int(V['cte'][n])}",
                     TEXTE_MIN, ENCRE, graisse=600))
    o.append(txt(40, H1 - 20,
                 "0 sur le papier, 255 sur l'encre", TEXTE_MIN, GRIS_58))
    return document(L1, H1, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 2 · la grille 28 x 28 de l'image de test n°0, ses 784 ronds
# ═══════════════════════════════════════════════════════════════════════════

L2, H2 = 1380, 1024


def fig02_grille(V: dict) -> str:
    cote = 30.0
    gx, gy = 96.0, 96.0
    o = entete(40, 40, f"l'image de test n°0, un {V['classe0']}", 840)

    o += grille_ronds(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    o += reperes_grille(gx, gy, cote)

    # Les trois cellules citees : un cercle de brique autour, rien d'autre.
    # Leurs coordonnees sont donnees dessous, le lecteur les apparie.
    for (i, j, _, _, _) in V["cites"]:
        o.append(cercle(gx + (j - 0.5) * cote, gy + (i - 0.5) * cote,
                        cote * 0.48, "none", BRIQUE, 2.4))

    # ── Le panneau de droite ────────────────────────────────────────────────
    px = 1010.0
    o += entete(px, 40, "ce que la grille porte", 330)
    lignes = [
        ("étiquette", str(V["classe0"])),
        ("pixels non nuls", f"{V['non_nuls']} sur {ent(784)}"),
        ("somme des octets", ent(V["somme_octets"])),
        ("lignes encrées", f"{V['lignes_encrees'][0]} à {V['lignes_encrees'][1]}"),
    ]
    # LE NOM AU-DESSUS DE SA VALEUR, et non a cote. « pixels non nuls »
    # demande 272 pixels et « 116 sur 784 » 200 : cote a cote ils en
    # reclamaient 472 pour une colonne qui en fait 330.
    for k, (nom, val) in enumerate(lignes):
        y = 140 + k * 2 * pas(TEXTE_MIN)
        o.append(txt(px, y, nom, TEXTE_MIN, GRIS_58))
        o.append(txt(px + 330, y + pas(TEXTE_MIN), val, TEXTE_MIN, ENCRE,
                     "end", 600))

    # La rampe de gris, cotee de 0 a 255. C'est elle qui porte l'inversion :
    # 0 est du papier, 255 de l'encre.
    ry, rh, rl = 570.0, 30.0, 330.0
    o += bloc(px, 500, "l'octet, et le rond qu'il donne", rl, TEXTE_MIN, GRIS_58)
    for k in range(66):
        o.append(rect(px + k * rl / 66, ry, rl / 66 + 0.5, rh, "none", 0,
                      gris(k / 65)))
    o.append(rect(px, ry, rl, rh, GRIS_40, 1.2))
    o.append(txt(px, ry + rh + 46, "0", TEXTE_MIN, GRIS_58))
    o.append(txt(px + rl, ry + rh + 46, "255", TEXTE_MIN, GRIS_58, "end"))
    o.append(txt(px, ry + rh + 46 + pas(TEXTE_MIN), "papier", TEXTE_MIN, GRIS_40))
    o.append(txt(px + rl, ry + rh + 46 + pas(TEXTE_MIN), "encre", TEXTE_MIN,
                 GRIS_40, "end"))

    # ── Les trois valeurs citees, sous la grille ────────────────────────────
    #
    # AUCUN RANG ICI. Le rang d'un pixel dans la colonne -- x_231 pour (9, 7)
    # -- sort de k = 28 (i - 1) + j, qui est de la PAGE 3. Cette figure est de
    # la page 2, et la page 2 n'a pas encore aplati la grille : elle nomme ses
    # pixels par leur ligne et leur colonne. La figure 3 les reprend, un par
    # un, sous leur rang.
    # SUR DEUX LIGNES. Les trois textes d'un pixel demandent 708 pixels a
    # 33 px, et la colonne d'un pixel en fait 416 : ils se mangeaient l'un
    # l'autre. L'octet et sa valeur tiennent ensemble sur la seconde ligne.
    by = 972.0
    o.append(ligne(96, by - 30, 1340, by - 30, GRIS_24, 1.5, filet=True))
    for k, (i, j, octet, val, _) in enumerate(V["cites"]):
        x = 96 + k * 416
        o.append(cercle(x + 9, by - 6, 8, "none", BRIQUE, 2.2))
        o.append(txt(x + 34, by, f"ligne {i}, colonne {j}", TEXTE_MIN, ENCRE,
                     graisse=600))
        o.append(txt(x + 34, by + pas(TEXTE_MIN),
                     f"octet {octet} · {nb(val, 6)}", TEXTE_MIN, GRIS_72))
    return document(L2, H2, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 3 · la grille, une fleche, et la colonne cotee 784
# ═══════════════════════════════════════════════════════════════════════════

L3, H3 = 1380, 640


def fig03_colonne(V: dict) -> str:
    o = entete(40, 40, "de la grille 28 × 28 à la colonne de 784", 1300)

    cote = 14.0
    gx, gy = 76.0, 120.0
    o += grille_encre(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    o += reperes_grille(gx, gy, cote)
    o.append(txt(gx, gy + 28 * cote + 46, "X ∈ [0, 1]²⁸ˣ²⁸", TEXTE_MIN, ENCRE,
                 graisse=600))

    # La fleche, et la formule de rang qu'elle applique.
    ay = gy + 14 * cote
    o.append(fleche(gx + 28 * cote + 44, ay, 820, ay, GRIS_58, 2.4, 12))
    o.append(txt(670, ay - 22, "vec", TEXTE_MIN, ENCRE, "middle", 600, True))
    o.append(txt(670, ay + 48, "k = 28 (i − 1) + j", TEXTE_MIN, GRIS_58, "middle"))

    # La colonne. Elle est ABREGEE : 784 ronds ne tiennent entraxe en colonne,
    # et une colonne qu'on abrege doit etre cotee, sinon elle ment.
    cx, r, entraxe = 960.0, 14.0, 48.0
    rangs = [1, 2, 3, None, 231, 232, None, 783, 784]
    x = V["image"].reshape(-1)
    y = 116.0
    hauts, bas = [], []
    for rang in rangs:
        if rang is None:
            o.append(suspension(cx, y + 20, GRIS_58, 3.2, 15))
            y += entraxe + 8
            continue
        v = float(x[rang - 1])
        cite = rang in (231, 232)
        o.append(cercle(cx, y, r, gris(v), BRIQUE if cite else GRIS_40,
                        2.2 if cite else 1.4))
        o.append(txt(cx + 32, y + 8, xk(rang), TEXTE_MIN, ENCRE, graisse=600))
        o.append(txt(cx + 140, y + 8, nb(v, 6), TEXTE_MIN,
                     BRIQUE if cite else GRIS_58))
        hauts.append(y - r)
        bas.append(y + r)
        y += entraxe
    o.append(accolade(cx - 30, hauts[0] - 6, bas[-1] + 6, -1, ENCRE, 2.0, 12))
    o.append(txt(cx - 70, (hauts[0] + bas[-1]) / 2 + 6, ent(784), TEXTE_MIN, ENCRE,
                 "end", 600))
    o.append(txt(cx + 32, bas[-1] + 54, "x ∈ [0, 1]⁷⁸⁴", TEXTE_MIN, ENCRE,
                 graisse=600))
    return document(L3, H3, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 4 · un neurone, et le nombre qu'il rend
#
# ELLE NE MONTRE QUE CE QUE LA PAGE 4 A DEFINI. La page pose z = w^T x + b, et
# rien d'autre : ni couche, ni ReLU, ni activation, ni indice de neurone cache.
#
# REFAITE AU PLANCHER, regle 32. Elle portait un pied de deux lignes en gris a
# 15, des sous-cotes a 12, une cote « entrees » a 14 : tout cela s'affichait
# sous le corps de la page, pendant que la lecture guidee disait la meme chose
# lisiblement, deux centimetres plus bas. Ce qui est parti, et ou :
#
#   le pied « Les 784 poids et le biais... »   -> legende du bloc, page 4
#   « 784 poids, un par trait ; 784 produits,  -> legende du bloc
#    une somme »
#   « ligne 9, colonne 7 · octet 222 »         -> lecture guidee, page 4
#   « entrees », « le biais », « un seul       -> lecture guidee, page 4
#    nombre »
#   les reperes de ligne et de colonne         -> retires : a 33, vingt-huit
#                                                 cotes ne tiennent entraxe sur
#                                                 252 pixels, et ce n'est entraxe
#                                                 la grille qu'on regarde
#   le second pixel cite, x_232 et w_232       -> retires : la lecture guidee
#                                                 ne suit qu'un pixel
#
# IL RESTE SIX ETIQUETTES, et chacune nomme ce qu'on regarde.
# ═══════════════════════════════════════════════════════════════════════════

L4, H4 = 1380, 560


def fig04_neurone(V: dict) -> str:
    N = V["neurone0"]
    o = entete(40, 46, "un neurone, et le nombre qu'il rend", 1300)

    milieu = 288.0

    # ── La grille, et le seul pixel que la lecture guidee suit ─────────────
    cote = 9.0
    grille = 28 * cote  # 252
    gx, gy = 60.0, milieu - grille / 2
    o += grille_encre(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    o.append(txt(gx + grille / 2, gy + grille + 56, "l'image de test n°0",
                 TEXTE_MIN, GRIS_58, "middle"))

    i, j, _, _, rang = V["cites"][0]          # (9, 7), rang 231
    px = gx + (j - 0.5) * cote
    py = gy + (i - 0.5) * cote
    o.append(cercle(px, py, cote * 0.8, "none", BRIQUE, 2.6))
    o.append(ligne(px, py - cote * 0.8, 132, 128, BRIQUE, 1.6, "5 4", filet=True))
    o.append(txt(132, 118, xk(rang), TEXTE_MIN, BRIQUE, "middle", 600))

    o.append(fleche(gx + grille + 40, milieu, 404, milieu, GRIS_58, 2.6, 13))

    # ── La colonne des entrees, abregee et cotee ───────────────────────────
    cx, r, entraxe = 574.0, 15.0, 58.0
    x = V["image"].reshape(-1)
    y = milieu - 145.0
    traits = []
    hauts = []
    for rangee in (1, None, 231, None, 784):
        if rangee is None:
            o.append(suspension(cx, y + 20, GRIS_58, 3.4, 16))
            traits.append((None, y + 20))
            y += entraxe + 8
            continue
        v = float(x[rangee - 1])
        cite = rangee == 231
        o.append(cercle(cx, y, r, gris(v), BRIQUE if cite else GRIS_40,
                        2.6 if cite else 1.6))
        traits.append((rangee, y))
        hauts.append(y)
        y += entraxe
    o.append(accolade(cx - 34, hauts[0] - r - 8, hauts[-1] + r + 8, -1,
                      ENCRE, 2.2, 14))
    o.append(txt(cx - 82, milieu + 12, ent(784), TEXTE_MIN, ENCRE, "end", 600))

    # ── Les poids : un par trait, un seul cote ─────────────────────────────
    nx, nr = 1010.0, 64.0
    arrivee = nx - nr - 8
    for rangee, yr in traits:
        cite = rangee == 231
        o.append(ligne(cx + r + 5, yr, arrivee, milieu,
                       BRIQUE if cite else GRIS_58, 2.4 if cite else 1.5,
                       opacite=None if cite else 0.34))
    o.append(txt(520, milieu - 100, f"w{rang}".translate(SOUSCRITS),
                 TEXTE_MIN, BRIQUE, "start", 600))
    o.append(txt(806, 132, "w ᵀ x + b", 38, ENCRE, "middle", 600))

    # ── Le neurone, et le biais qui entre par en dessous ───────────────────
    o.append(cercle(nx, milieu, nr, PAPIER, ENCRE, 2.8))
    o.append(txt(nx, milieu + 18, "Σ", 52, ENCRE, "middle", 600))
    o.append(fleche(nx, milieu + nr + 92, nx, milieu + nr + 12, GRIS_58, 2.4,
                    12))
    o.append(txt(nx, milieu + nr + 126, f"b = {nb(N['b'], 4, True)}",
                 TEXTE_MIN, ENCRE, "middle", 600))

    # ── Le seul nombre qui sort ────────────────────────────────────────────
    o.append(fleche(nx + nr + 10, milieu, 1156, milieu, GRIS_58, 2.6, 13))
    o.append(txt(1340, milieu + 14, f"z = {nb(N['z'], 4, True)}", 40, BRIQUE,
                 "end", 700))
    return document(L4, H4, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 5 · le gabarit du chiffre 0
#
# C'est la figure centrale du chapitre : elle n'existe nulle part ailleurs,
# parce que ses 784 nombres sont ceux de NOTRE modele.
# ═══════════════════════════════════════════════════════════════════════════

L5, H5 = 1380, 1120


def fig05_gabarit(V: dict) -> str:
    G = V["gabarits"][0]
    vmax, pmax, vmin, pmin = V["gabarit_extrema"][0]
    m = max(abs(vmax), abs(vmin))

    cote = 28.0
    gx, gy = 96.0, 104.0
    # W, la matrice a dix lignes, est de la PAGE 6. La page 4 n'a que w, le
    # vecteur d'un neurone, et G = vec^-1(w). La figure ne nomme donc que ce
    # que la page a pose -- et c'est le w de la figure 4, celle du neurone qui
    # note le 0.
    o = entete(40, 40, "le gabarit du chiffre 0, G = vec⁻¹(w)", 800)

    o += grille_poids(gx, gy, cote, G, m)
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    o += reperes_grille(gx, gy, cote)

    # Le centre geometrique de la grille, en croix fine. C'est de lui que le
    # minimum est proche, et sans le repere la proximite ne se mesure pas.
    ccx, ccy = gx + 14.5 * cote, gy + 14.5 * cote
    o.append(ligne(ccx, gy, ccx, gy + 28 * cote, ENCRE, 1.0, "5 5", 0.45))
    o.append(ligne(gx, ccy, gx + 28 * cote, ccy, ENCRE, 1.0, "5 5", 0.45))

    # Les deux extrema, encadres. Aucun trait de rappel : leurs coordonnees
    # sont donnees a droite, et un rappel traverserait la grille.
    for (i, j) in (pmax, pmin):
        o.append(rect(gx + (j - 1) * cote - 1, gy + (i - 1) * cote - 1,
                      cote + 2, cote + 2, ENCRE, 2.4))

    # ── Le panneau de droite ────────────────────────────────────────────────
    px = 950.0
    o += entete(px, 40, "les deux extrêmes", 390)
    # LE PANNEAU FAIT 390 PIXELS, et il le tient. « en (13, 25) » cadre a
    # droite venait sur la valeur, et « centre géométrique de la grille » en
    # demandait 563 a lui seul : il sortait du cadre et se posait sur sa propre
    # cote. Chaque ligne descend donc sous la precedente.
    for k, (nom, val, pos) in enumerate(
            (("maximum", vmax, pmax), ("minimum", vmin, pmin))):
        y = 108 + k * 2 * pas(TEXTE_MIN)
        o.append(txt(px, y, nom, TEXTE_MIN, GRIS_58))
        o.append(txt(px + 390, y, nb(val, 4, True), TEXTE_MIN, ENCRE, "end", 700))
        o.append(txt(px, y + pas(TEXTE_MIN), f"en ({pos[0]}, {pos[1]})",
                     TEXTE_MIN, ENCRE, graisse=600))
    centre = couper("centre géométrique de la grille", 390.0, TEXTE_MIN)
    o += colonne(px, 290, centre, TEXTE_MIN, GRIS_58)
    o.append(txt(px + 390, 290 + len(centre) * pas(TEXTE_MIN), "(14,5 ; 14,5)",
                 TEXTE_MIN, ENCRE, "end", 600))

    # L'echelle divergente, cotee. Symetrique : le zero est au milieu, et il
    # est blanc.
    ry, rh, rl = 500.0, 34.0, 390.0
    o += bloc(px, 426, "échelle symétrique autour de zéro", rl, TEXTE_MIN, GRIS_58)
    for k in range(78):
        t = -m + 2 * m * k / 77
        o.append(rect(px + k * rl / 78, ry, rl / 78 + 0.5, rh, "none", 0,
                      poids(t, m)))
    o.append(rect(px, ry, rl, rh, GRIS_40, 1.2))
    o.append(ligne(px + rl / 2, ry, px + rl / 2, ry + rh, GRIS_40, 1.2, filet=True))
    o.append(txt(px + rl / 2, ry + rh + 46, "0", TEXTE_MIN, GRIS_58, "middle"))
    # Les bornes de l'echelle sont ±m ; les deux valeurs ATTEINTES sont
    # reperees dessus, faute de quoi la borne de droite ferait croire a un
    # maximum de +1,4457 qui n'existe pas.
    for val, ancre in ((vmin, "start"), (vmax, "end")):
        vx = px + rl / 2 * (1 + val / m)
        o.append(ligne(vx, ry - 8, vx, ry + rh + 4, ENCRE, 1.8))
        o.append(txt(px if ancre == "start" else px + rl, ry + rh + 46,
                     nb(val, 4, True), TEXTE_MIN, ENCRE, ancre, 600))

    # La lecture par signe. C'est une legende de couleur, pas un commentaire :
    # sans elle le sens des deux poles n'est ecrit nulle part.
    y = 640.0
    for couleur, texte in ((BRIQUE, "poids positif : de l'encre ici"),
                           (ARDOISE, "poids négatif : il n'en veut pas")):
        o.append(rect(px, y - 13, 16, 16, "none", 0, couleur))
        lignes_legende = couper(texte, 362.0, TEXTE_MIN)
        o += colonne(px + 28, y, lignes_legende, TEXTE_MIN, ENCRE)
        y += (len(lignes_legende) + 0.2) * pas(TEXTE_MIN)

    # Le chiffre reel, a cote du gabarit qui le note.
    i0 = int(np.nonzero(V["cte"] == 0)[0][0])
    o += bloc(px, 850, f"image de test n°{i0}, classe 0", 390, TEXTE_MIN, GRIS_58)
    o += grille_encre(px, 868, 8.0, V["Xte"][i0].reshape(28, 28))
    o.append(cadre_grille(px, 868, 8.0, GRIS_24, 1.4))

    o.append(txt(96, H5 - 24,
                 "w replié en grille par vec⁻¹", TEXTE_MIN, GRIS_58))
    return document(L5, H5, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 6 · le detecteur de bord, en trois temps
# ═══════════════════════════════════════════════════════════════════════════

L6, H6 = 1380, 1210


def _barres(x0, y0, largeur, entrees, valeurs, gagnant, plafond=None
            ) -> list[str]:
    """Un diagramme a barres horizontales, zero place selon les signes.

    `plafond` borne l'echelle. Une barre qui le depasse est coupee net et
    porte deux traits obliques : sans la coupure, une valeur de −93 ecrase
    trois valeurs de l'ordre de 10 et le renversement ne se voit plus.
    """
    o = []
    borne = plafond or max(abs(v) for v in valeurs)
    negatifs = any(v < 0 for v in valeurs)
    part = 0.55 if negatifs else 1.0
    zx = x0 + (largeur * (1 - part) if negatifs else 0.0)
    echelle = largeur * part / borne
    # Les noms se posent a gauche de la barre la plus longue vers la gauche,
    # pas a gauche du zero : avec des valeurs negatives, le zero n'est plus le
    # bord du dessin. Sans valeur negative, il l'est, et rien ne deborde.
    plus_a_gauche = min(borne, max(0.0, -min(valeurs))) * echelle
    xg = zx - plus_a_gauche - 16
    for k, ((nom, sous, _, _), v) in enumerate(zip(entrees, valeurs)):
        y = y0 + k * 96
        couleur = BRIQUE if k == gagnant else GRIS_58
        o.append(txt(xg, y + 5, nom, TEXTE_MIN, ENCRE, "end", 600))
        o.append(txt(xg, y + 5 + pas(TEXTE_MIN), sous, TEXTE_MIN, GRIS_58, "end"))
        coupe = abs(v) > borne
        larg = min(abs(v), borne) * echelle
        bout = zx + larg if v >= 0 else zx - larg
        # Une barre coupee est PLUS CLAIRE que les autres, en plus de porter
        # ses deux traits de coupure : sans cela, elle se lit comme une barre
        # a peine plus longue que sa voisine, alors qu'elle vaut neuf fois plus.
        o.append(rect(min(zx, bout), y - 10, larg, 22, "none", 0,
                      GRIS_24 if coupe else couleur))
        if coupe:
            sens = 1 if v >= 0 else -1
            for d in (0, 8):
                o.append(ligne(bout - sens * (5 + d), y + 15,
                               bout - sens * (13 + d), y - 15, GRIS_58, 2.2))
        # Les valeurs se rangent en colonne a droite du cadre. Collees a leur
        # barre, elles se poseraient sur le nom de la ligne d'en face.
        o.append(txt(x0 + largeur + 18, y + 6, nb(v, 4, True), TEXTE_MIN,
                     couleur if not coupe else GRIS_58, "start", 600))
    o.append(ligne(zx, y0 - 22, zx, y0 + 46 * len(valeurs) - 24, ENCRE, 1.6))
    return o


def fig06_detecteur(V: dict) -> str:
    zone, pourtour = V["zone"], V["pourtour"]
    positifs, negatifs, nuls = V["det_compte"]
    o = entete(40, 40, "un détecteur posé à la main",
               1300)

    cote = 11.0
    for col, (titre, W, sous) in enumerate((
        (f"temps 1 · +1 sur {positifs} pixels", zone,
         "compter l'encre d'une zone"),
        (f"temps 3 · pourtour à −1 sur {negatifs} pixels",
         zone - pourtour, "refuser ce qui déborde"),
    )):
        bx = 60.0 + col * 700.0
        # « temps 3 · pourtour à −1 sur 132 pixels » demande 708 pixels a
        # 33 px, et la colonne de droite n'en a que 620 avant le bord.
        lignes_titre = couper(titre, 620.0, TEXTE_MIN)
        o += colonne(bx, 96 - (len(lignes_titre) - 1) * pas(TEXTE_MIN),
                     lignes_titre, TEXTE_MIN, ENCRE, graisse=600)
        o.append(txt(bx, 142, sous, TEXTE_MIN, GRIS_58))
        gx, gy = bx, 196.0
        o += grille_poids(gx, gy, cote, W, 1.0, tous=False)
        o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
        o += reperes_grille(gx, gy, cote)

    # Les quatre entrees, en vignettes, entre les deux diagrammes.
    for k, X in enumerate(V["det_images"]):
        vx = 400.0 + (k % 2) * 150.0
        vy = 196.0 + (k // 2) * 230.0
        o += grille_encre(vx, vy, 4.4, X)
        o.append(cadre_grille(vx, vy, 4.4, GRIS_24, 1.4))
        # Au-dessus de la vignette : sous elle, « tache large » tombait sur le
        # repere « 28 » de la grille voisine.
        o += bloc(vx, vy + 28 * 4.4 + 44, V["det_entrees"][k][0], 28 * 4.4,
                  TEXTE_MIN, GRIS_58)

    # Les deux classements. Le meme ordre d'entrees des deux cotes : c'est le
    # renversement qu'on regarde, pas les barres.
    t1 = [e[2] for e in V["det_entrees"]]
    t3 = [e[3] for e in V["det_entrees"]]
    gagne1 = V["det_entrees"][int(np.argmax(t1))][0]
    gagne3 = V["det_entrees"][int(np.argmax(t3))][0]
    o.append(txt(60, 684, f"temps 2 · en tête, {gagne1}", TEXTE_MIN, ENCRE,
                 graisse=600))
    o.append(txt(60, 728, "z = somme de l'encre de la zone", TEXTE_MIN, GRIS_58))
    o.append(txt(760, 684, f"temps 3 · en tête, {gagne3}", TEXTE_MIN, ENCRE,
                 graisse=600))
    o.append(txt(760, 728, "z = zone − pourtour", TEXTE_MIN, GRIS_58))
    o += _barres(300, 792, 260, V["det_entrees"], t1, int(np.argmax(t1)))
    # Le plafond est le plus grand score obtenu par une VRAIE image ; seule la
    # tache construite le depasse, et sa barre est coupee.
    o += _barres(980, 792, 210, V["det_entrees"], t3, int(np.argmax(t3)),
                 plafond=max(abs(v) for v in t3[:3]))
    return document(L6, H6, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 7 · la couche de sortie, dix neurones etiquetes
# ═══════════════════════════════════════════════════════════════════════════

L7, H7 = 1380, 470


def fig07_sortie(V: dict) -> str:
    # LE MODELE DE LA PAGE 6, et non celui du chapitre. La figure montrait les
    # z^[2] et a^[2] du reseau a deux couches : l'exposant entre crochets est
    # pose page 10, ReLU page 9, et la page 6 n'a qu'une couche lineaire de
    # dix neurones, z = W x + b. Elle affichait donc quatre objets non definis
    # ET les nombres d'un autre modele que le sien -- le releve console de la
    # meme page, lui, donnait bien ceux du modele lineaire.
    z, a = V["z_lineaire"], V["a_lineaire"]
    predit = int(np.argmax(a))
    o = entete(40, 40, "la couche de sortie, image n°0", 1300)

    # LES DEUX RANGEES DE NOMBRES SONT EN QUINCONCE. « −12,4084 » demande 163
    # pixels a 33 px et l'entraxe des dix neurones en fait 128 : ecrits sur une
    # seule ligne, un nombre sur deux mordait ses deux voisins. Une colonne sur
    # deux descend d'un interligne, ce qui porte l'entraxe a 256.
    r, y = 42.0, 230.0
    Z_Y, A_Y = 100.0, 312.0
    for k in range(10):
        cx = 118.0 + k * 128.0
        etage = (k % 2) * pas(TEXTE_MIN)
        o.append(txt(cx, Z_Y + etage, nb(float(z[k]), 4, True), TEXTE_MIN,
                     GRIS_58, "middle"))
        o.append(cercle(cx, y, r, gris(float(a[k])),
                        BRIQUE if k == predit else GRIS_40,
                        3.0 if k == predit else 1.6))
        o.append(txt(cx, y + 9, str(k), TEXTE_MIN,
                     PAPIER if a[k] > 0.5 else ENCRE, "middle", 700))
        o.append(txt(cx, A_Y + etage, nb(float(a[k]), 6), TEXTE_MIN,
                     BRIQUE if k == predit else GRIS_58, "middle",
                     700 if k == predit else 400))
    o.append(txt(32, Z_Y, "z", TEXTE_MIN, GRIS_58, "end", 600))
    o.append(txt(32, A_Y, "a", TEXTE_MIN, GRIS_58, "end", 600))
    o.append(ligne(60, 380, 1340, 380, GRIS_24, 1.5, filet=True))
    second = int(np.argsort(-a)[1])
    # Les trois verdicts sur deux lignes : « somme des dix coordonnées » et
    # « second choix » en demandent 1289 a eux deux, pour 1280 de cadre.
    o.append(txt(60, 416, f"somme des dix coordonnées   "
                          f"{nb(float(a.sum()), 10)}", TEXTE_MIN, GRIS_58))
    o.append(txt(1340, 416, f"prédit {predit}", TEXTE_MIN, BRIQUE, "end", 700))
    o.append(txt(60, 416 + pas(TEXTE_MIN), f"second choix   {second}, avec "
                           f"{nb(float(a[second]), 6)}", TEXTE_MIN, GRIS_58))
    return document(L7, H7, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 8 · la courbe de la sigmoide
# ═══════════════════════════════════════════════════════════════════════════

L8, H8 = 1380, 560


def fig08_sigmoide(V: dict) -> str:
    o = entete(40, 40, "σ(u) = 1 / (1 + e⁻ᵘ)", 860)

    x0, x1, y0, y1 = 130.0, 900.0, 100.0, 440.0
    u0, u1 = -8.0, 8.0

    def px(u):
        return x0 + (u - u0) / (u1 - u0) * (x1 - x0)

    def py(s):
        return y1 - s * (y1 - y0)

    # Les deux asymptotes, et le milieu.
    for s, nom in ((0.0, "0"), (1.0, "1")):
        o.append(ligne(x0, py(s), x1, py(s), GRIS_40, 1.4, "6 6"))
        o.append(txt(x0 - 14, py(s) + 5, nom, TEXTE_MIN, GRIS_58, "end"))
    o.append(ligne(x0, py(0.5), x1, py(0.5), GRIS_24, 1.2, "3 5"))
    o.append(txt(x0 - 14, py(0.5) + 5, "0,5", TEXTE_MIN, GRIS_58, "end"))

    # Les axes.
    o.append(ligne(x0, y1, x1, y1, ENCRE, 2.0))
    o.append(ligne(px(0), y0 - 16, px(0), y1 + 14, ENCRE, 2.0))
    for u in (-8, -6, -4, -2, 2, 4, 6, 8):
        o.append(ligne(px(u), y1, px(u), y1 + 7, GRIS_58, 1.4, filet=True))
        o.append(txt(px(u), y1 + 40, str(u).replace("-", MOINS), TEXTE_MIN,
                     GRIS_58, "middle"))
    o.append(txt(x1 + 16, y1 + 6, "u", TEXTE_MIN, ENCRE, italique=True))
    o.append(txt(px(0) - 12, y0 - 22, "σ(u)", TEXTE_MIN, ENCRE, "end"))

    # La tangente en zero, de pente 1/4 : le majorant de la derivee. Elle
    # s'arrete avant de sortir du cadre : une droite qui traverse le titre
    # n'apprend rien de plus qu'une droite qui s'arrete.
    du = 1.8
    o.append(ligne(px(-du), py(0.5 - du / 4), px(du), py(0.5 + du / 4),
                   BRIQUE, 2.0, "7 5"))
    o.append(txt(px(du) + 46, py(0.5 + du / 4) + 62, "pente 1/4", TEXTE_MIN, BRIQUE,
                 graisse=600))

    # La courbe.
    pts = []
    for k in range(321):
        u = u0 + (u1 - u0) * k / 320
        pts.append(f"{px(u):.1f},{py(sigma(u)):.1f}")
    o.append(f'<polyline points="{" ".join(pts)}" fill="none" '
             f'stroke="{ENCRE}" stroke-width="2.8"/>')

    # Les valeurs mesurees, celles qui tiennent dans le cadre.
    for u, s in V["sigma"]:
        if abs(u) > 8:
            continue
        o.append(cercle(px(u), py(s), 5.5, BRIQUE))

    # ── Le panneau de droite : la table, y compris hors cadre ───────────────
    ppx = 980.0
    o += entete(ppx, 40, "σ, aux cinq points mesurés", 360)
    # Le titre du panneau prend deux lignes depuis que `entete` le coupe a sa
    # largeur : la table part donc plus bas.
    o.append(txt(ppx, 130, "u", TEXTE_MIN, GRIS_58, italique=True))
    o.append(txt(ppx + 360, 130, "σ(u)", TEXTE_MIN, GRIS_58, "end"))
    for k, (u, s) in enumerate(V["sigma"]):
        y = 172 + k * 40
        dedans = abs(u) <= 8
        o.append(txt(ppx, y, nb(u, 0), TEXTE_MIN, ENCRE, graisse=600))
        valeur = sci(s) if 0 < s < 1e-3 else f"{s:.11g}".replace(".", ",")
        o.append(txt(ppx + 360, y, valeur, TEXTE_MIN,
                     BRIQUE if dedans else GRIS_58, "end",
                     600 if dedans else 400))
    o.append(ligne(ppx, 352, ppx + 360, 352, GRIS_24, 1.5, filet=True))
    # 528 pixels de formule pour 400 de colonne : elle se coupe, et la glose
    # descend sous sa derniere ligne.
    formule = couper("σ′(u) = σ(u)(1 − σ(u)) ≤ 1/4", 400.0, TEXTE_MIN)
    o += colonne(ppx, 386, formule, TEXTE_MIN, ENCRE, graisse=600)
    o.append(txt(ppx, 386 + len(formule) * pas(TEXTE_MIN),
                 "avec égalité en u = 0", TEXTE_MIN, GRIS_58))
    o.append(txt(130, H8 - 24,
                 "±10 : hors du cadre, dans la table", TEXTE_MIN, GRIS_58))
    return document(L8, H8, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 9 · le biais est l'oppose du seuil
#
# LE SEUIL. s est le score mesure de l'image de test n°0 au temps 1 du
# detecteur (figure 6). Poser le seuil sur un nombre du chapitre plutot que
# sur un nombre rond evite d'introduire une valeur qui ne vient de nulle part.
# ═══════════════════════════════════════════════════════════════════════════

L9, H9 = 1380, 600


def fig09_biais(V: dict) -> str:
    scores = [(nom, sous, z1) for nom, sous, z1, _ in V["det_entrees"]]
    s = scores[0][2]
    b = -s

    o = entete(40, 40, "le même axe, gradué deux fois", 1300)

    x0, x1 = 210.0, 1250.0
    vmin, vmax = 0.0, max(z for _, _, z in scores) * 1.08

    def px(v):
        return x0 + (v - vmin) / (vmax - vmin) * (x1 - x0)

    # Les etiquettes s'etagent selon le RANG EN ABSCISSE, et non selon l'ordre
    # des entrees : deux points voisins sur l'axe doivent tomber a deux
    # hauteurs differentes, quelle que soit leur place dans la liste.
    rangs = {k: r for r, (k, _) in enumerate(
        sorted(enumerate(z for _, _, z in scores), key=lambda p: p[1]))}

    # Les deux axes descendent de soixante pixels : le nom de chacun se pose
    # au-dessus de ses noms d'image, et celui du premier venait sinon sur le
    # titre de la figure.
    for rang, (ay, decalage, nom, seuil) in enumerate((
            (250.0, 0.0, "z = w ᵀ x", f"s = {nb(s, 4)}"),
            (430.0, b, "z + b,  b = −s", "0"))):
        o.append(ligne(x0 - 40, ay, x1 + 40, ay, ENCRE, 2.2))
        # AU-DESSUS DE L'AXE, ET CALE A GAUCHE. Cadre a droite de x0 − 60, le
        # nom de l'axe sortait du cadre par la gauche : « z + b,  b = −s »
        # demande 254 pixels et il n'en restait que 70.
        o.append(txt(x0 - 40, ay - 100, nom, TEXTE_MIN, ENCRE, "start", 600))
        # La barre de seuil. Elle ne bouge pas d'un axe a l'autre : c'est la
        # graduation qui glisse sous elle. Son etiquette se pose a GAUCHE de la
        # barre : le seuil vaut le score de l'image de test n°0, les deux
        # tombent au meme endroit, et deux libelles centres se toucheraient.
        o.append(ligne(px(s), ay - 50, px(s), ay + 30, BRIQUE, 2.6, filet=True))
        o.append(txt(px(s) - 14, ay - 56, seuil, TEXTE_MIN, BRIQUE, "end", 700))
        for k, (enom, _, z) in enumerate(scores):
            x = px(z)
            passe = z >= s
            o.append(cercle(x, ay, 7.0, ENCRE if passe else GRIS_40))
            etage = (rangs[k] % 2) * pas(TEXTE_MIN)
            o.append(ligne(x, ay + 8, x, ay + 26 + etage, GRIS_58, 1.2, filet=True))
            o.append(txt(x, ay + 42 + etage, nb(z + decalage, 4, True), TEXTE_MIN,
                         ENCRE if passe else GRIS_58, "middle", 600))
            if rang == 0:
                o.append(ligne(x, ay - 8, x, ay - 20 - etage, GRIS_58, 1.2,
                               filet=True))
                # Le point qui tombe SUR le seuil ne peut pas porter son nom
                # au-dessus de lui : la barre de seuil y passe. Il le porte a
                # droite.
                colle = abs(x - px(s)) < 40
                o.append(txt(x + (14 if colle else 0), ay - 26 - etage, enom,
                             TEXTE_MIN, GRIS_58, "start" if colle else "middle"))

    # Le rappel vertical, coupe avant l'etiquette du second seuil. La cote de
    # la translation passe a DROITE : a gauche elle se posait sur le nom du
    # second axe, et sur la graduation du premier.
    o.append(ligne(px(s), 352, px(s), 396, GRIS_40, 1.4, "5 5"))
    o.append(txt(1320, 380, f"translation de b = {nb(b, 4, True)}", TEXTE_MIN,
                 ENCRE, "end", 600))
    o.append(ligne(60, 540, 1320, 540, GRIS_24, 1.5, filet=True))
    o.append(txt(60, H9 - 22, "w ᵀ x > s   ⟺   w ᵀ x + b > 0",
                 TEXTE_MIN, ENCRE, graisse=600))
    o.append(txt(1320, H9 - 22, "le seuil change de place et de signe", TEXTE_MIN,
                 GRIS_58, "end"))
    return document(L9, H9, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 10 · notre architecture, 784 -> 128 -> 10
# ═══════════════════════════════════════════════════════════════════════════

L10, H10 = 1380, 700


def fig10_architecture(V: dict) -> str:
    o = entete(40, 40, "784 → 128 → 10", 1300)

    milieu = 350.0
    r = 15.0

    def colonne(cx, n_visibles, pitch, abrege):
        ys = [milieu + (k - (n_visibles - 1) / 2) * pitch
              for k in range(n_visibles)]
        return ys, (ys[n_visibles // 2] if abrege else None)

    ys1, sus1 = colonne(250.0, 5, 54.0, True)
    ys2, sus2 = colonne(690.0, 5, 54.0, True)
    ys3, _ = colonne(1120.0, 10, 48.0, False)
    pleins1 = [y for y in ys1 if y != sus1]
    pleins2 = [y for y in ys2 if y != sus2]

    # Les liaisons : filets gris, faible opacite. Ce ne sont pas elles qu'on
    # regarde, mais elles disent que la couche est complete.
    for y1 in pleins1:
        for y2 in pleins2:
            o.append(ligne(250 + r, y1, 690 - r, y2, GRIS_58, 1.0,
                           opacite=0.28))
    for y2 in pleins2:
        for y3 in ys3:
            o.append(ligne(690 + r, y2, 1120 - r, y3, GRIS_58, 1.0,
                           opacite=0.24))

    for cx, ys, sus in ((250.0, ys1, sus1), (690.0, ys2, sus2)):
        for y in ys:
            if y == sus:
                o.append(suspension(cx, y, GRIS_58, 3.2, 15))
            else:
                o.append(cercle(cx, y, r, PAPIER, GRIS_40, 1.8))
    for k, y in enumerate(ys3):
        o.append(cercle(1120.0, y, r, PAPIER, GRIS_40, 1.8))
        o.append(txt(1120.0 + r + 14, y + 6, str(k), TEXTE_MIN, ENCRE, graisse=600))

    # Les trois cotes. Une colonne abregee qui ne serait pas cotee mentirait.
    for cx, ys, taille, nom, sens in (
            (250.0, ys1, 784, "x", -1), (690.0, ys2, 128, "a⁽¹⁾", -1),
            (1120.0, ys3, 10, "a⁽²⁾", 1)):
        haut, bas = ys[0] - r - 8, ys[-1] + r + 8
        ax = cx - 40 if sens < 0 else cx + 68
        o.append(accolade(ax, haut, bas, sens, ENCRE, 2.0, 12))
        # LE COMPTE PASSE SOUS LA COLONNE quand l'accolade est a gauche : entre
        # deux colonnes, le bec de l'accolade tombe au milieu du faisceau de
        # liaisons, et « 128 » s'y posait dessus.
        if sens < 0:
            o.append(txt(cx, bas + 46, nom, TEXTE_MIN, ENCRE, "middle", 600))
            o.append(txt(cx, bas + 46 + pas(TEXTE_MIN), ent(taille), TEXTE_MIN,
                         ENCRE, "middle", 600))
        else:
            o.append(txt(ax + sens * 76, (haut + bas) / 2 + 7, ent(taille),
                         TEXTE_MIN, ENCRE, "start", 600))
            o.append(txt(ax + sens * 76, (haut + bas) / 2 + 7 + pas(TEXTE_MIN),
                         nom, TEXTE_MIN, ENCRE, "start", 600))

    o.append(txt(470, 96, "W⁽¹⁾ ∈ M₁₂₈,₇₈₄(ℝ)", TEXTE_MIN, ENCRE, "middle", 600))
    o.append(txt(470, 96 + pas(TEXTE_MIN), "b⁽¹⁾ ∈ ℝ¹²⁸", TEXTE_MIN, GRIS_58, "middle"))
    o.append(txt(470, 96 + 2 * pas(TEXTE_MIN), "ReLU", TEXTE_MIN, BRIQUE, "middle", 600))
    o.append(txt(905, 62, "W⁽²⁾ ∈ M₁₀,₁₂₈(ℝ)", TEXTE_MIN, ENCRE, "middle", 600))
    o.append(txt(905, 62 + pas(TEXTE_MIN), "b⁽²⁾ ∈ ℝ¹⁰", TEXTE_MIN, GRIS_58, "middle"))
    o.append(txt(905, 62 + 2 * pas(TEXTE_MIN), "softmax", TEXTE_MIN, BRIQUE, "middle", 600))

    o.append(ligne(60, H10 - 76, 1320, H10 - 76, GRIS_24, 1.5, filet=True))
    o.append(txt(60, H10 - 40, f"{ent(V['p_reseau'])} paramètres", TEXTE_MIN, ENCRE,
                 graisse=700))
    o.append(txt(1320, H10 - 40,
                 f"{nb(V['acc_reseau'], 4)} · {V['err_reseau']} erreurs",
                 TEXTE_MIN, GRIS_58,
                 "end"))
    return document(L10, H10, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 11 · l'ecriture matricielle, en cinq temps
# ═══════════════════════════════════════════════════════════════════════════

L11, H11 = 1380, 880


def fig11_matricielle(V: dict) -> str:
    o = entete(40, 40, "d'un neurone à la couche, en cinq temps", 1300)
    # CINQ TEMPS SUR DEUX RANGEES. A 33 px, « 3 · les lignes s'empilent »
    # demande 436 pixels et « 128 × 784 » 163 : la colonne de 272 ne tenait ni
    # les titres, qui entraient dans celui du voisin, ni les cotes de
    # dimension, qui se mangeaient sous les cases. Trois temps en haut, deux en
    # bas, 440 de colonne chacun. La hauteur passe de 500 a 880 ; le bloc image
    # de la page 7 porte encore 500, et il reste a la remettre d'accord.
    temps = [
        "1 · un neurone",
        "2 · 128 neurones",
        "3 · les lignes s'empilent",
        "4 · la première couche",
        "5 · la seconde",
    ]
    COL, RANGEE_2 = 440.0, 400.0

    def coin(k: int) -> tuple[float, float]:
        """Le coin haut-gauche du temps k : trois en haut, deux en bas."""
        if k < 3:
            return 20.0 + k * COL, 0.0
        return 20.0 + (k - 3) * COL, RANGEE_2

    for k, nom in enumerate(temps):
        x, dy = coin(k)
        o.append(txt(x + 16, 100 + dy, nom, TEXTE_MIN, ENCRE, graisse=600))
        o.append(ligne(x + 16, 112 + dy, x + COL - 20, 112 + dy, GRIS_24, 1.5,
                       filet=True))
        if k not in (0, 3):
            o.append(fleche(x - 6, 250 + dy, x + 10, 250 + dy, GRIS_40, 2.0, 8))

    # 1 · un neurone : une ligne fois une colonne, plus un scalaire.
    x = 36.0
    # Les cotes de dimension s'alternent d'un cran quand deux cases voisines
    # sont plus etroites que leur cote : c'est a cela que sert `dy`.
    ETAGE = pas(TEXTE_MIN)
    o += boite(x, 210, 96, 26, "w ᵀ", "1 × 784")
    o += boite(x + 140, 190, 22, 66, "x", "784 × 1", dy=ETAGE)
    o.append(txt(x + 184, 232, "+", TEXTE_MIN, ENCRE))
    o += boite(x + 212, 214, 20, 20, "b", "1 × 1")
    o.append(txt(x + 252, 232, "=", TEXTE_MIN, ENCRE))
    o += boite(x + 284, 214, 20, 20, "z", "1 × 1", BRIQUE, dy=ETAGE)

    # 2 · 128 neurones : 128 lignes, chacune son biais.
    x = 476.0
    # Les trois lignes descendent de pas() : ecrites a vingt-huit d'ecart pour
    # des caracteres de trente-trois, elles se touchaient.
    premiere = 196.0
    for k in range(3):
        ligne_y = premiere + k * pas(TEXTE_MIN)
        o += boite(x, ligne_y, 96, 20, "", "")
        o.append(txt(x + 106, ligne_y + 15,
                     f"w{str(k + 1).translate(SOUSCRITS)} ᵀ x + "
                     f"b{str(k + 1).translate(SOUSCRITS)}", TEXTE_MIN, GRIS_58))
    derniere = premiere + 4 * pas(TEXTE_MIN)
    o.append(suspension(x + 48, premiere + 3.4 * pas(TEXTE_MIN), GRIS_58, 3.0, 13))
    o += boite(x, derniere, 96, 20, "", "")
    o.append(txt(x + 106, derniere + 15, "w₁₂₈ ᵀ x + b₁₂₈", TEXTE_MIN, GRIS_58))
    o.append(accolade(x - 12, premiere - 6, derniere + 26, -1, ENCRE, 2.0, 10))
    o.append(txt(x - 36, (premiere + derniere) / 2 + 16, "128", TEXTE_MIN, ENCRE,
                 "end", 600))

    # 3 · les lignes s'empilent en une matrice.
    x = 916.0
    o += boite(x + 20, 190, 150, 96, "W⁽¹⁾", "128 × 784")
    for y in (214.0, 238.0, 262.0):
        o.append(ligne(x + 20, y, x + 170, y, GRIS_24, 1.2))

    # 4 · la premiere couche, en un produit.
    x, dy = 60.0, RANGEE_2
    o += boite(x, 210 + dy, 20, 52, "z⁽¹⁾", "128 × 1", BRIQUE)
    o.append(txt(x + 40, 242 + dy, "=", TEXTE_MIN, ENCRE))
    o += boite(x + 76, 210 + dy, 76, 52, "W⁽¹⁾", "128 × 784", dy=ETAGE)
    o += boite(x + 196, 202 + dy, 18, 68, "x", "784 × 1")
    o.append(txt(x + 240, 242 + dy, "+", TEXTE_MIN, ENCRE))
    o += boite(x + 280, 210 + dy, 20, 52, "b⁽¹⁾", "128 × 1", dy=ETAGE)
    o.append(txt(x + 16, 390 + dy, "a⁽¹⁾ = ReLU(z⁽¹⁾)", TEXTE_MIN, ENCRE, graisse=600))

    # 5 · la seconde couche : les memes gestes, d'autres dimensions.
    x = 476.0
    o += boite(x, 218 + dy, 20, 36, "z⁽²⁾", "10 × 1", BRIQUE)
    o.append(txt(x + 40, 242 + dy, "=", TEXTE_MIN, ENCRE))
    o += boite(x + 76, 218 + dy, 68, 36, "W⁽²⁾", "10 × 128", dy=ETAGE)
    o += boite(x + 188, 210 + dy, 18, 52, "a⁽¹⁾", "128 × 1")
    o.append(txt(x + 232, 242 + dy, "+", TEXTE_MIN, ENCRE))
    o += boite(x + 272, 218 + dy, 20, 36, "b⁽²⁾", "10 × 1", dy=ETAGE)
    o.append(txt(x + 16, 390 + dy, "a⁽²⁾ = softmax(z⁽²⁾)", TEXTE_MIN, ENCRE, graisse=600))

    o.append(ligne(60, H11 - 66, 1320, H11 - 66, GRIS_24, 1.5, filet=True))
    o.append(txt(60, H11 - 30, "z = W x + b, à chaque couche", TEXTE_MIN, ENCRE,
                 graisse=600))
    return document(L11, H11, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 12 · le compte des parametres
# ═══════════════════════════════════════════════════════════════════════════

L12, H12 = 1380, 580


def fig12_parametres(V: dict) -> str:
    p = V["p_reseau"]
    blocs = V["blocs_p"]
    o = entete(40, 40, f"{ent(p)} paramètres, et où ils sont", 1300)

    bx, by, bl, bh = 70.0, 110.0, 1240.0, 70.0
    couleurs = [ENCRE, GRIS_40, BRIQUE, GRIS_58]
    x = bx
    for (nom, couche, taille, _), couleur in zip(blocs, couleurs):
        w = bl * taille / p
        o.append(rect(x, by, max(w, 1.0), bh, "none", 0, couleur))
        x += w
    o.append(rect(bx, by, bl, bh, GRIS_40, 1.4))
    o.append(txt(bx + 16, by + 44, f"{nb(V['part_W1'], 1)} %", TEXTE_MIN, PAPIER,
                 graisse=700))

    # LES TROIS AUTRES BLOCS, AGRANDIS. A l'echelle de la premiere barre ils
    # occupent 17 pixels sur 1 240 : la barre dit la domination de W⁽¹⁾ et ne
    # peut rien dire de plus. La seconde barre reprend ce reste seul.
    reste = p - blocs[0][2]
    rx, ry, rl2, rh2 = 70.0, 250.0, 1240.0, 40.0
    x = rx
    for (nom, couche, taille, _), couleur in list(zip(blocs, couleurs))[1:]:
        w = rl2 * taille / reste
        o.append(rect(x, ry, max(w, 1.0), rh2, "none", 0, couleur))
        x += w
    o.append(rect(rx, ry, rl2, rh2, GRIS_40, 1.4))
    debut = bx + bl * blocs[0][2] / p
    o.append(ligne(debut, by + bh, rx, ry, GRIS_40, 1.2, "4 4", filet=True))
    o.append(ligne(bx + bl, by + bh, rx + rl2, ry, GRIS_40, 1.2, "4 4", filet=True))
    o.append(txt(rx + rl2, ry - 26, f"les {ent(reste)} restants, seuls", TEXTE_MIN,
                 GRIS_58, "end"))

    # La table : chaque bloc, ses dimensions, son compte, sa part.
    ty = 350.0
    entetes = ("bloc", "dimensions", "coefficients", "part")
    xs = (70.0, 380.0, 1060.0, 1310.0)
    ancres = ("start", "start", "end", "end")
    for x, nom, ancre in zip(xs, entetes, ancres):
        o.append(txt(x, ty, nom, TEXTE_MIN, GRIS_58, ancre))
    o.append(ligne(70, ty + 12, 1310, ty + 12, GRIS_24, 1.5, filet=True))
    for k, ((nom, couche, taille, dims), couleur) in enumerate(
            zip(blocs, couleurs)):
        y = ty + 44 + k * 32
        o.append(rect(70, y - 12, 14, 14, "none", 0, couleur))
        o.append(txt(96, y, f"{nom}⁽{'¹' if couche == 1 else '²'}⁾", TEXTE_MIN, ENCRE,
                     graisse=600))
        o.append(txt(380, y, dims, TEXTE_MIN, GRIS_58))
        o.append(txt(1060, y, ent(taille), TEXTE_MIN, ENCRE, "end", 600))
        o.append(txt(1310, y, f"{nb(100 * taille / p, 1)} %", TEXTE_MIN, GRIS_58,
                     "end"))
    y = ty + 44 + len(blocs) * 32
    o.append(ligne(70, y - 22, 1310, y - 22, ENCRE, 1.6, filet=True))
    o.append(txt(96, y + 4, "p", TEXTE_MIN, ENCRE, graisse=700, italique=True))
    o.append(txt(380, y + 4,
                 " + ".join(ent(t) for _, _, t, _ in blocs), TEXTE_MIN, GRIS_58))
    o.append(txt(1060, y + 4, ent(p), TEXTE_MIN, BRIQUE, "end", 700))
    o.append(txt(1310, y + 4, "100 %", TEXTE_MIN, GRIS_58, "end"))
    return document(L12, H12, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 13 · la decomposition esperee, et ce que la mesure en fait
# ═══════════════════════════════════════════════════════════════════════════

L13, H13 = 1380, 740


def fig13_espoir(V: dict) -> str:
    rho = V["rho"]
    o = entete(40, 40, "ce qu'on espère de la couche cachée", 620)
    o += entete(760, 40, f"la corrélation la plus forte vaut "
                         f"{nb(rho['max'], 4)}", 580)

    # ── L'arbre espere ──────────────────────────────────────────────────────
    # « un trait droit » demande 254 pixels a 33 px et sa case en fait 190 :
    # les trois cases du milieu se touchaient. Elles passent a 260, et l'arbre
    # garde sa largeur parce que l'entraxe suit.
    # « un trait droit » demande 254 pixels a 33 px et la case en fait 190 :
    # les trois cases du milieu se mangeaient. Le libelle se coupe DANS sa
    # case, qui passe a deux lignes ; l'arbre garde sa largeur, et il le faut,
    # le panneau de droite commence a 760.
    etages = [
        (110.0, ["un chiffre"], 190.0),
        (250.0, ["une boucle", "un trait droit", "une jonction"], 190.0),
        (390.0, ["bord", "bord", "bord", "bord", "bord", "bord"], 96.0),
    ]
    CASE_H = 84.0
    centres = []
    for y, noms, larg in etages:
        n = len(noms)
        xs = [360.0 + (k - (n - 1) / 2) * (larg + 14) for k in range(n)]
        centres.append((y, xs))
        for x, nom in zip(xs, noms):
            o.append(rect(x - larg / 2, y, larg, CASE_H, ENCRE, 1.8))
            dedans = couper(nom, larg - 20, TEXTE_MIN)
            depart = y + CASE_H / 2 + 11 - (len(dedans) - 1) * pas(TEXTE_MIN) / 2
            o += colonne(x, depart, dedans, TEXTE_MIN, ENCRE, "middle", 600)
    for (yh, haut), (yb, bas) in zip(centres, centres[1:]):
        for xh in haut:
            for xb in bas:
                o.append(ligne(xh, yh + CASE_H + 10, xb, yb - 10, GRIS_58, 1.2,
                               opacite=0.45))
    o.append(txt(360, 540, "un neurone caché par morceau", TEXTE_MIN, GRIS_58,
                 "middle"))

    # ── L'echelle de correlation, et ce qui s'y pose ────────────────────────
    # L'axe descend : la cote la plus haute monte de 150 au-dessus de lui, et
    # son bloc de deux lignes venait sur le titre du panneau.
    ax0, ax1, ay = 800.0, 1320.0, 360.0

    def px(r):
        return ax0 + r * (ax1 - ax0)

    o.append(ligne(ax0, ay, ax1, ay, ENCRE, 2.2))
    for r in (0.0, 0.25, 0.5, 0.75, 1.0):
        o.append(ligne(px(r), ay, px(r), ay + 8, GRIS_58, 1.4, filet=True))
        o.append(txt(px(r), ay + 42, nb(r, 2), TEXTE_MIN, GRIS_58, "middle"))
    o.append(txt(ax0, ay + 42 + pas(TEXTE_MIN), "|ρ| caché / gabarit de classe",
                 TEXTE_MIN, GRIS_58))

    # Le trait des 0,50 s'arrete sous les etiquettes : la valeur maximale
    # tombe juste en dessous de lui, et leurs deux libelles se toucheraient.
    o.append(ligne(px(0.5), ay - 46, px(0.5), ay + 12, GRIS_40, 1.6, "6 6", filet=True))

    for r, nom, couleur, haut in (
            (rho["moyenne"], "moyenne des "
             f"{ent(rho['couples'])} couples", GRIS_58, 46.0),
            (rho["max"], f"maximum, caché {rho['j']} / classe {rho['k']}",
             BRIQUE, 150.0)):
        o.append(ligne(px(r), ay - haut, px(r), ay, couleur, 2.4, filet=True))
        o.append(cercle(px(r), ay, 7.0, couleur))
        # LE BLOC ENTIER PASSE AU-DESSUS DE LA TIGE. Coupe en deux lignes, le
        # nom voyait sa seconde ligne retomber SUR la tige qu'il nomme : un
        # filet porte son libelle, il ne le traverse pas.
        lignes_nom = couper(nom, 260.0, TEXTE_MIN)
        depart = ay - haut - 14 - (len(lignes_nom) - 1) * pas(TEXTE_MIN)
        o.append(txt(px(r), depart - pas(TEXTE_MIN), nb(r, 4), TEXTE_MIN,
                     couleur, "middle", 700))
        o.extend(colonne(px(r), depart, lignes_nom, TEXTE_MIN, couleur, "middle"))

    o.append(ligne(760, 490, 1340, 490, GRIS_24, 1.5, filet=True))
    lignes = [
        ("couples examinés", ent(rho["couples"])),
        ("couples au-dessus de 0,50", f"{rho['au_dessus']} sur "
                                      f"{ent(rho['couples'])}"),
        ("moyenne des |ρ|", nb(rho["moyenne"], 4)),
    ]
    # Le libelle se coupe a 360 : au-dela il venait sur sa propre valeur,
    # cadree a droite du panneau.
    y = 526.0
    for nom, val in lignes:
        coupe = couper(nom, 360.0, TEXTE_MIN)
        o += colonne(760, y, coupe, TEXTE_MIN, GRIS_58)
        o.append(txt(1340, y, val, TEXTE_MIN, ENCRE, "end", 600))
        y += len(coupe) * pas(TEXTE_MIN)
    o.append(txt(760, 704, "aucun ne ressemble à un chiffre",
                 TEXTE_MIN, BRIQUE, graisse=600))
    return document(L13, H13, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 0 · l'ouverture : une image entre, un chiffre sort
#
# Posee en tete de la page 1. Elle ne porte aucun symbole que le texte
# d'accroche doive supposer connu : une image reelle du jeu, la boite f_theta,
# le chiffre que le reseau lit. Le chiffre lu est ARGMAX de a^[2] mesure sur
# l'image de test n°0 -- il n'est pas ecrit a la main.
# ═══════════════════════════════════════════════════════════════════════════

L0, H0 = 1380, 470


def fig00_lecture(V: dict) -> str:
    img = V["image"]
    predit = int(np.argmax(V["a2"]))
    o = entete(40, 40, "une image entre, un chiffre sort",
               1300)

    cote = 9.0
    ix, iy = 120.0, 130.0
    grille = 28 * cote  # 252
    o += grille_encre(ix, iy, cote, img)
    o.append(cadre_grille(ix, iy, cote, GRIS_24, 1.6))
    o.append(txt(ix + grille / 2, iy + grille + 44,
                 "une image, 28 × 28 pixels", TEXTE_MIN, GRIS_58, "middle"))

    milieu = iy + grille / 2
    o.append(fleche(ix + grille + 34, milieu, ix + grille + 150, milieu,
                    GRIS_58, 2.4, 12))

    bx, bw, bh = ix + grille + 184, 262.0, 150.0
    by = milieu - bh / 2
    o.append(rect(bx, by, bw, bh, ENCRE, 2.4))
    o.append(txt_indice(bx + bw / 2, by + bh / 2 + 16, "f", "θ", "", 56, ENCRE,
                        "middle", 700))
    # LA BOITE NE PORTE QUE SON NOM. Elle portait « le reseau : 784 -> 128 ->
    # 10 » : l'architecture est de la PAGE 10, et la figure suivante la montre
    # sans la nommer. Une boite fermee qui annonce son contenu n'est plus une
    # boite fermee.

    o.append(fleche(bx + bw + 34, milieu, bx + bw + 150, milieu,
                    GRIS_58, 2.4, 12))

    dx = bx + bw + 300
    o.append(txt(dx, milieu + 58, str(predit), 172, BRIQUE, "middle", 700))
    o.append(txt(dx, iy + grille + 30, "le chiffre lu", TEXTE_MIN, GRIS_58, "middle"))
    return document(L0, H0, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 14 · les dix gabarits, sur une meme echelle
#
# Le compagnon fixe de l'animation « les-dix-gabarits » de la page 6. Les dix
# G_k d'un modele lineaire entraine, ranges en deux rangees de cinq, tous
# colores sur la MEME echelle -- le maximum absolu des dix -- pour que leurs
# amplitudes se comparent. Les valeurs sortent de V["gabarits"], calcule par
# mesures.py section 4.
# ═══════════════════════════════════════════════════════════════════════════

L14, H14 = 1380, 880


def fig14_dix_gabarits(V: dict) -> str:
    gab = V["gabarits"]
    ext = V["gabarit_extrema"]
    m = max(max(abs(vmax), abs(vmin)) for vmax, _, vmin, _ in ext)
    o = entete(40, 40,
               "dix gabarits, Gₖ = vec⁻¹(ligne k)", 1300)

    cote = 8.0
    grille = 28 * cote  # 224
    gap = (1240 - 5 * grille) / 4  # 30
    x0 = 70.0
    for k in range(10):
        gx = x0 + (k % 5) * (grille + gap)
        gy = 122.0 + (k // 5) * (grille + 74.0)
        o += grille_poids(gx, gy, cote, gab[k], m)
        o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.4))
        o.append(txt(gx + grille / 2, gy - 22, str(k), TEXTE_MIN, ENCRE, "middle", 700))

    # L'echelle divergente commune, cotee, centree sous les deux rangees.
    ry, rh, rl = 710.0, 30.0, 520.0
    rx = (L14 - rl) / 2
    # Le libelle portait « dix » deux fois, la chaine ayant ete coupee en deux
    # morceaux dont le second repetait la fin du premier.
    o.append(txt(L14 / 2, ry - 24, "une seule échelle pour les dix",
                 TEXTE_MIN, GRIS_58, "middle"))
    for i in range(104):
        t = -m + 2 * m * i / 103
        o.append(rect(rx + i * rl / 104, ry, rl / 104 + 0.6, rh, "none", 0,
                      poids(t, m)))
    o.append(rect(rx, ry, rl, rh, GRIS_40, 1.2))
    o.append(ligne(rx + rl / 2, ry, rx + rl / 2, ry + rh, GRIS_40, 1.2, filet=True))
    # Trente-quatre pixels sous la bande, et non vingt : a vingt, la hampe des
    # chiffres remontait dans l'echelle.
    o.append(txt(rx, ry + rh + 46, nb(-m, 4, True), TEXTE_MIN, ENCRE, "start", 600))
    o.append(txt(rx + rl / 2, ry + rh + 46, "0", TEXTE_MIN, GRIS_58, "middle"))
    o.append(txt(rx + rl, ry + rh + 46, nb(m, 4, True), TEXTE_MIN, ENCRE, "end", 600))

    # LA LEGENDE S'EMPILE. Ses deux entrees demandent 726 et 472 pixels a
    # 33 px : posees cote a cote a 320 d'entraxe, la premiere traversait la
    # seconde et son carre de couleur.
    for i, (couleur, texte) in enumerate((
            (BRIQUE, "positif : le neurone veut de l'encre ici"),
            (ARDOISE, "négatif : il n'en veut pas"))):
        ly = 822.0 + i * pas(TEXTE_MIN)
        lx = L14 / 2 - 380
        o.append(rect(lx, ly - 13, 15, 15, "none", 0, couleur))
        o.append(txt(lx + 22, ly, texte, TEXTE_MIN, ENCRE))
    return document(L14, H14, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 15 · les quatre modeles, en barres
#
# Le tableau de la page 11 rendu comme une figure : quatre barres d'erreurs de
# test, meme protocole. La bande grise groupe les modeles 2 et 3, qui ont le
# MEME nombre de parametres -- la difference de longueur est tout le propos.
# Les nombres viennent de V["tableau"], mesure par mesures.py section 10.
# ═══════════════════════════════════════════════════════════════════════════

L15, H15 = 1380, 680


def fig15_quatre_modeles(V: dict) -> str:
    T = V["tableau"]
    o = entete(40, 40,
               "quatre modèles, erreurs sur 10 000",
               1300)

    # CHAQUE MODELE PREND DEUX LIGNES, et sa barre va avec la seconde. Les
    # deux lignes etaient a vingt-quatre d'ecart pour des caracteres de
    # trente-trois, et la cote du groupe se posait sur la premiere ligne du
    # modele 2. L'entraxe passe de 92 a 118, et la hauteur de 560 a 680 ; le
    # bloc image de la page 11 porte encore 560.
    errmax = max(r[5] for r in T)
    x0, barmax = 620.0, 480.0
    ys = [150.0] + [190.0 + i * 118.0 for i in range(1, 4)]

    # La bande qui groupe les modeles 2 et 3 : meme nombre de parametres.
    # La bande couvre les DEUX LIGNES de chacun des deux modeles, et deborde a
    # gauche sous leur numero : coupee au ras du texte, elle passait au milieu
    # des mots et le fond changeait au milieu d'un chiffre.
    o.append(rect(40, ys[1] - 52, 1304, ys[2] + pas(TEXTE_MIN) + 26 - (ys[1] - 52),
                  "none", 0, GRIS_08))
    o.append(txt(1334, ys[1] - 64, "mêmes 101 770 paramètres", TEXTE_MIN,
                 GRIS_58, "end"))

    for (num, arch, act, p, acc, err), y in zip(T, ys):
        gagnant = num == 3
        o.append(txt(70, y, str(num), TEXTE_MIN, ENCRE, "end", 700))
        o.append(txt(108, y, arch, TEXTE_MIN, ENCRE, "start", 600))
        o.append(txt(108, y + pas(TEXTE_MIN), f"{act} · {ent(p)} paramètres",
                     TEXTE_MIN, GRIS_58))
        w = barmax * err / errmax
        o.append(rect(x0, y - 16, w, 38, "none", 0,
                      BRIQUE if gagnant else GRIS_40))
        o.append(txt(x0 + w + 14, y + 8, f"{err} erreurs", TEXTE_MIN,
                     BRIQUE if gagnant else ENCRE, "start",
                     700 if gagnant else 600))
        o.append(txt(1334, y + pas(TEXTE_MIN), nb(acc, 4), TEXTE_MIN, GRIS_58,
                     "end"))

    o.append(ligne(56, H15 - 74, 1324, H15 - 74, GRIS_24, 1.5, filet=True))
    return document(L15, H15, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 16 · deux 4, leur milieu, et ce que le modele lineaire en dit
#
# L'OUVERTURE DE LA PAGE 7. Le milieu de deux images est l'objet dont toute la
# page parle et que personne ne peut se representer : une moyenne pixel a pixel
# de deux 4 n'est ni l'un ni l'autre, et c'est une entree comme les autres. La
# figure le donne a voir avant que la convexite soit prononcee.
#
# Elle ne montre QUE la reponse du modele lineaire. Celle du reseau a ReLU est
# le sujet de la page 9 ; l'ecrire ici viderait la page 7 de sa question.
# ═══════════════════════════════════════════════════════════════════════════

L16, H16 = 1380, 620


def fig16_milieu(V: dict) -> str:
    P = V["paire7"]
    o = entete(40, 40, "deux 4, et leur milieu", 1300)

    cote = 11.0
    grille = 28 * cote  # 308
    y0 = 122.0
    xs = (80.0, 536.0, 992.0)
    # x_k DESIGNE UNE COMPOSANTE, jamais un exemple : c'est le tableau des
    # trois notations d'indice de la page 2, et l'exemple s'ecrit x^(n). Les
    # deux images se nomment donc par leur indice dans le jeu, et rien de plus.
    legendes = (f"image de test n°{P['i']}",
                f"image de test n°{P['j']}",
                "leur milieu, pixel par pixel")

    for x, img, libelle, lu in zip(xs, P["images"], legendes, P["lineaire"]):
        o += grille_encre(x, y0, cote, img)
        o.append(cadre_grille(x, y0, cote, GRIS_24, 1.6))
        lignes_legende = couper(libelle, grille + 120, TEXTE_MIN)
        o += colonne(x + grille / 2, y0 + grille + 44, lignes_legende,
                     TEXTE_MIN, ENCRE, "middle", 600)
        o.append(txt(x + grille / 2,
                     y0 + grille + 44 + len(lignes_legende) * pas(TEXTE_MIN),
                     f"le modèle linéaire lit {lu}", TEXTE_MIN, BRIQUE, "middle",
                     600))

    # Le « + » et le « ÷ 2 » : l'operation est ecrite entre les grilles, pas
    # racontee sous elles.
    milieu_y = y0 + grille / 2
    o.append(txt((xs[0] + grille + xs[1]) / 2, milieu_y + 14, "+", 44, GRIS_58,
                 "middle", 600))
    o.append(fleche(xs[1] + grille + 24, milieu_y, xs[2] - 24, milieu_y,
                    GRIS_58, 2.2, 11))
    o.append(txt((xs[1] + grille + xs[2]) / 2, milieu_y - 22, "÷ 2", TEXTE_MIN,
                 GRIS_58, "middle", 600))

    o.append(ligne(56, H16 - 74, 1324, H16 - 74, GRIS_24, 1.5, filet=True))
    return document(L16, H16, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 17 · le pas balaye, et ce que la couche de plus achete
#
# L'OUVERTURE DE LA PAGE 8. La page annonce qu'on juge le modele a son
# MEILLEUR reglage ; le releve console le donne en colonnes, et la forme de la
# courbe ne s'y voit pas. Ici elle se voit : cinq pas convergent, un diverge,
# et le meilleur des cinq depasse a peine le trait du modele precedent.
#
# Le trait de reference est la precision du modele a 7 850 parametres, mesuree
# par mesures.py section 4 et relue dans V["tableau"].
# ═══════════════════════════════════════════════════════════════════════════

L17, H17 = 1380, 560


def fig17_balayage(V: dict) -> str:
    B = V["balayage"]
    m1, m2 = V["tableau"][0], V["tableau"][1]
    acc1, acc2 = m1[4], m2[4]
    o = entete(40, 40, "six pas, quinze époques", 1300)

    gx0, gx1 = 190.0, 1240.0
    gy0, gy1 = 150.0, 400.0
    valeurs = [a for _, a in B if a is not None] + [acc1]
    bas, haut = min(valeurs) - 0.0015, max(valeurs) + 0.0015

    def y(a: float) -> float:
        return gy1 - (a - bas) / (haut - bas) * (gy1 - gy0)

    o.append(ligne(gx0 - 40, gy1, gx1 + 30, gy1, GRIS_40, 1.5))
    o.append(txt(gx0 - 40, gy1 + 42 + pas(TEXTE_MIN), "pas d'apprentissage η",
                 TEXTE_MIN, GRIS_58))

    # Le trait du modele precedent. C'est la barre a franchir, et c'est
    # pourquoi elle traverse toute la figure.
    o.append(ligne(gx0 - 40, y(acc1), gx1 + 30, y(acc1), GRIS_58, 1.6, "6 5", filet=True))
    o.append(txt(gx1 + 30, y(acc1) - 12,
                 f"{ent(m1[3])} paramètres · {nb(acc1, 4)}", TEXTE_MIN, GRIS_58,
                 "end"))

    entraxe = (gx1 - gx0) / (len(B) - 1)
    for k, (eta, a) in enumerate(B):
        x = gx0 + k * entraxe
        o.append(txt(x, gy1 + 42, nb(eta, 2), TEXTE_MIN, ENCRE, "middle", 600))
        if a is None:
            # La divergence n'a entraxe d'ordonnee : on ne la pose donc nulle part
            # sur l'axe, on la marque d'une croix au-dessus et on l'ecrit.
            o.append(ligne(x - 11, gy0 - 46, x + 11, gy0 - 24, BRIQUE, 2.4))
            o.append(ligne(x - 11, gy0 - 24, x + 11, gy0 - 46, BRIQUE, 2.4))
            o.append(txt(x, gy0 - 66, "divergence (NaN)", TEXTE_MIN, BRIQUE,
                         "middle", 600))
            continue
        gagnant = eta == V["eta_retenu"]
        o.append(cercle(x, y(a), 8.0 if gagnant else 5.5,
                        BRIQUE if gagnant else GRIS_58))
        o.append(txt(x, y(a) - 20, nb(a, 4), TEXTE_MIN,
                     BRIQUE if gagnant else ENCRE, "middle",
                     700 if gagnant else 400))
        if gagnant:
            o.append(txt(x, y(a) + 34, "retenu", TEXTE_MIN, BRIQUE, "middle", 600))

    o.append(ligne(56, H17 - 96, 1324, H17 - 96, GRIS_24, 1.5, filet=True))
    o.append(txt(56, H17 - 26,
                 f"{ent(m2[5])} erreurs contre {ent(m1[5])}", TEXTE_MIN, ENCRE,
                 graisse=600))
    return document(L17, H17, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 18 · le trajet complet, la boite de la page 1 ouverte
#
# L'OUVERTURE DE LA PAGE 12. La figure 0 montrait une boite fermee : une image
# entrait, un chiffre sortait. Celle-ci est la meme figure, ouverte -- chaque
# objet du formulaire pose a l'endroit de la chaine ou il agit, et chaque
# etape portant ce qu'elle vaut sur l'image de test n°0.
#
# Le formulaire de la page les donne en liste ; une liste ne dit pas OU un
# objet intervient, et c'est la seule chose que cette figure ajoute.
# ═══════════════════════════════════════════════════════════════════════════

L18, H18 = 1380, 720


def fig18_trajet(V: dict) -> str:
    a2 = V["a2"]
    predit = int(np.argmax(a2))
    o = entete(40, 40, "le trajet complet, image n°0",
               1300)

    cote = 6.5
    grille = 28 * cote  # 182
    ix, iy = 58.0, 196.0
    o += grille_encre(ix, iy, cote, V["image"])
    o.append(cadre_grille(ix, iy, cote, GRIS_24, 1.6))
    milieu = iy + grille / 2
    o.append(txt(ix + grille / 2, iy + grille + 40, "28 × 28", TEXTE_MIN, GRIS_58,
                 "middle"))

    bh = 132.0
    by = milieu - bh / 2
    etapes = (
        ("x", "784 × 1", "vec",
         f"{ent(V['non_nuls'])} pixels non nuls"),
        ("z⁽¹⁾", "128 × 1", "W⁽¹⁾· + b⁽¹⁾",
         f"le plus haut : {nb(V['neurone'][1], 4, True)}"),
        ("a⁽¹⁾", "128 × 1", "ReLU",
         f"{V['a1_non_nuls']} non nuls sur 128"),
        ("z⁽²⁾", "10 × 1", "W⁽²⁾· + b⁽²⁾",
         f"le plus haut : {nb(float(np.max(V['z2'])), 4, True)}"),
        # HUIT DECIMALES, et pas quatre comme les lignes precedentes. La plus
        # haute probabilite vaut 0,99999997 : arrondie a quatre, ou meme a
        # sept, elle s'ecrirait « 1,0000000 ». Or le chapitre etablit que
        # softmax tombe dans le simplexe OUVERT, ou aucune coordonnee ne vaut
        # 1 ; l'arrondi mentirait sur le point meme que la figure clot.
        ("a⁽²⁾", "10 × 1", "softmax",
         f"la plus haute : {nb(float(np.max(a2)), 8)}"),
    )

    # LA CHAINE SE RESSERRE, ET LES NOMS D'OPERATION S'ALTERNENT. A 33 px,
    # « W⁽¹⁾· + b⁽¹⁾ » demande 218 pixels ; six operations en demandent 1308, et
    # la grille d'entree en prend deja 240 sur les 1380. Elles se posent donc
    # SOUS la fleche, une ligne sur deux, ce qui porte leur entraxe a 328. Les
    # mesures, elles, se coupent a la colonne de leur etape : « la plus haute :
    # 0,99999997 » en demande 472 pour une case de 108, et les cinq se
    # mangeaient l'une l'autre. La hauteur passe de 620 a 720 ; le bloc image
    # de la page 12 porte encore 620, et il reste a la remettre d'accord.
    ESPACE, LARG = 64.0, 100.0
    COLONNE = ESPACE + LARG
    MESURE_Y = by + bh + 34 + pas(TEXTE_MIN)

    # LE NOM DE L'OBJET ENTRE DANS SA CASE, et le nom de l'operation se pose
    # juste au-dessus des cases, en quinconce. Entre deux cases, il demandait
    # 218 pixels pour un intervalle de 64 et mordait les deux cadres ; tres
    # au-dessus, il ne touchait plus rien mais ne disait plus de quelle fleche
    # il parlait.
    def operation_y(rang: int) -> float:
        return by - 30 - ((rang + 1) % 2) * pas(TEXTE_MIN)

    x = ix + grille
    for rang, (nom, dims, operation, mesure) in enumerate(etapes):
        o.append(fleche(x + 10, milieu, x + ESPACE - 10, milieu, GRIS_58, 2.2, 10))
        o.append(txt(x + ESPACE / 2, operation_y(rang), operation, TEXTE_MIN,
                     ENCRE, "middle", 600))
        x += ESPACE
        o += boite(x, by, LARG, bh, "", dims)
        o.append(txt(x + LARG / 2, by + 44, nom, TEXTE_MIN, ENCRE, "middle", 600))
        o += bloc(x + LARG / 2, MESURE_Y, mesure, COLONNE, TEXTE_MIN, GRIS_58,
                  "middle")
        x += LARG

    o.append(fleche(x + 10, milieu, x + ESPACE - 10, milieu, GRIS_58, 2.2, 10))
    o.append(txt(x + ESPACE / 2, operation_y(len(etapes)), "argmax", TEXTE_MIN,
                 ENCRE, "middle", 600))
    o.append(txt(x + ESPACE + 96, milieu + 34, str(predit), 96, BRIQUE, "middle", 700))
    o.append(txt(x + ESPACE + 96, MESURE_Y, "le chiffre lu", TEXTE_MIN, GRIS_58,
                 "middle"))

    o.append(ligne(56, H18 - 74, 1324, H18 - 74, GRIS_24, 1.5, filet=True))
    return document(L18, H18, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 19 · le meme 7, decale de cinq colonnes
#
# L'argument de la page 4 : deux poids voisins dans la grille ne sont relies
# par rien dans w. Un eleve a lu « un 7 de cinq colonnes » la ou le texte
# ecrivait « un 7 decale de cinq colonnes » -- la phrase ne peut pas tenir
# seule, il lui faut ses deux grilles.
#
# LE DECALAGE EST POSE, pas mesure : c'est une construction du cours, comme la
# geometrie du detecteur de la page 5. L'IMAGE, elle, est mesuree -- c'est
# l'image de test n°0. Rien ne sort du cadre : l'encre de cette image s'arrete
# a la colonne 22, et 22 + 5 = 27. Le programme le verifie plutot que de
# l'affirmer.
# ═══════════════════════════════════════════════════════════════════════════

L19, H19 = 1380, 760

DECALAGE = 5


def fig19_sept_decale(V: dict) -> str:
    img = V["image"]
    encrees = np.nonzero(img.sum(axis=0) > 0)[0] + 1
    if int(encrees.max()) + DECALAGE > 28:
        raise RuntimeError(
            f"le decalage de {DECALAGE} colonnes sortirait de la grille : "
            f"l'encre va jusqu'a la colonne {int(encrees.max())}.")
    decale = np.zeros_like(img)
    decale[:, DECALAGE:] = img[:, :-DECALAGE]

    o = entete(40, 40, f"le même 7, décalé de {DECALAGE} colonnes", 1300)

    cote = 11.0
    grille = 28 * cote  # 308
    y0 = 132.0
    # La ligne 9 porte les deux pixels cites par le texte. La colonne de
    # gauche est la premiere colonne encree de cette ligne.
    i = 9
    j_gauche = int(np.nonzero(img[i - 1] > 0)[0][0]) + 1
    j_droite = j_gauche + DECALAGE

    for x0, X, j, titre in ((120.0, img, j_gauche, "l'image de test n°0"),
                            (760.0, decale, j_droite,
                             f"la même image, décalée de {DECALAGE} colonnes")):
        o += grille_encre(x0, y0, cote, X)
        o.append(cadre_grille(x0, y0, cote, GRIS_24, 1.6))
        o += reperes_grille(x0, y0, cote)
        cx = x0 + (j - 0.5) * cote
        cy = y0 + (i - 0.5) * cote
        o.append(cercle(cx, cy, cote * 0.95, "none", BRIQUE, 2.6))
        k = 28 * (i - 1) + j
        o.append(ligne(cx, cy - cote * 0.95, cx, y0 - 46, BRIQUE, 1.4, "4 4", filet=True))
        o.append(txt(cx, y0 - 54, f"w{k}".translate(SOUSCRITS), TEXTE_MIN, BRIQUE,
                     "middle", 700))
        o.append(txt(x0 + grille / 2, y0 + grille + 44, titre, TEXTE_MIN, ENCRE,
                     "middle", 600))
        o.append(txt(x0 + grille / 2, y0 + grille + 44 + pas(TEXTE_MIN),
                     f"ligne {i} · colonne {j}", TEXTE_MIN,
                     GRIS_58, "middle"))

    o.append(ligne(56, H19 - 74, 1324, H19 - 74, GRIS_24, 1.5, filet=True))
    return document(L19, H19, o)


# ═══════════════════════════════════════════════════════════════════════════
# FIGURE 20 · le reseau entier, sans un seul symbole
#
# LA PHOTO DE CE QU'ON VA DEMONTER. Le lecteur l'a reclamee : « il manque une
# grosse image qui montre a quoi ressemble un reseau ». Elle se pose page 1,
# juste apres l'ouverture image -> f_theta -> 7, et elle revient TELLE QUELLE
# page 10, ou chacun de ses traits a enfin un nom.
#
# RIEN N'Y EST NOMME. Ni W, ni b, ni ReLU, ni softmax, ni le compte des
# parametres : page 1, aucun de ces objets n'existe. Il ne reste que ce qui se
# voit -- une image qui entre, trois colonnes, tous les traits entre elles, un
# chiffre qui sort -- et les trois cotes, sans lesquelles des colonnes
# abregees mentiraient sur leur taille.
#
# LA SORTIE ALLUMEE est celle que le reseau choisit sur l'image de test n°0 :
# c'est argmax de a^[2], mesure, le meme nombre que la figure 0 affiche.
# ═══════════════════════════════════════════════════════════════════════════

L20, H20 = 1380, 700


def fig20_reseau_entier(V: dict) -> str:
    predit = int(np.argmax(V["a2"]))
    o = entete(40, 40, "ce qu'il y a dans la boîte", 1300)

    milieu = 380.0
    r = 15.0

    # ── L'image qui entre ─────────────────────────────────────────────────
    cote = 7.0
    grille = 28 * cote  # 196
    gx, gy = 56.0, milieu - grille / 2
    o += grille_encre(gx, gy, cote, V["image"])
    o.append(cadre_grille(gx, gy, cote, GRIS_40, 1.6))
    # Cale a gauche du cadre : centree sous une grille posee a x = 56, la
    # legende sortait de 18 pixels par la gauche.
    o.append(txt(gx - 18, gy + grille + 44, "l'image de test n°0", TEXTE_MIN,
                 GRIS_58, "start"))
    o.append(fleche(gx + grille + 44, milieu, 368, milieu, GRIS_58, 2.4, 12))

    # ── Les trois colonnes. Les deux premieres sont abregees, et cotees. ───
    cx1, cx2, cx3 = 400.0, 750.0, 1100.0
    ys1 = [milieu + (k - 2) * 54.0 for k in range(5)]
    ys2 = [milieu + (k - 2) * 54.0 for k in range(5)]
    ys3 = [milieu + (k - 4.5) * 44.0 for k in range(10)]
    pleins1 = [y for k, y in enumerate(ys1) if k != 2]
    pleins2 = [y for k, y in enumerate(ys2) if k != 2]

    for y1 in pleins1:
        for y2 in pleins2:
            o.append(ligne(cx1 + r, y1, cx2 - r, y2, GRIS_58, 1.0,
                           opacite=0.28))
    for y2 in pleins2:
        for y3 in ys3:
            o.append(ligne(cx2 + r, y2, cx3 - r, y3, GRIS_58, 1.0,
                           opacite=0.24))

    for cxc, ysc in ((cx1, ys1), (cx2, ys2)):
        for k, y in enumerate(ysc):
            if k == 2:
                o.append(suspension(cxc, y, GRIS_58, 3.2, 15))
            else:
                o.append(cercle(cxc, y, r, PAPIER, GRIS_40, 1.8))
    for k, y in enumerate(ys3):
        gagne = k == predit
        o.append(cercle(cx3, y, r, BRIQUE if gagne else PAPIER,
                        BRIQUE if gagne else GRIS_40, 2.6 if gagne else 1.8))

    o.append(txt(cx1, 556, ent(784), TEXTE_MIN, ENCRE, "middle", 600))
    o.append(txt(cx1, 556 + pas(TEXTE_MIN), "une par pixel", TEXTE_MIN, GRIS_58,
                 "middle"))
    o.append(txt(cx2, 556, ent(128), TEXTE_MIN, ENCRE, "middle", 600))
    o.append(txt(cx3, 626, ent(10), TEXTE_MIN, ENCRE, "middle", 600))
    o.append(txt(cx3, 626 + pas(TEXTE_MIN), "une par chiffre", TEXTE_MIN,
                 GRIS_58, "middle"))

    # ── Le chiffre qui sort ───────────────────────────────────────────────
    o.append(fleche(cx3 + r + 6, ys3[predit], 1216, 424, GRIS_58, 2.4, 12))
    o.append(txt(1262, 452, str(predit), 120, BRIQUE, "middle", 700))
    o.append(txt(1262, 506, "le chiffre lu", TEXTE_MIN, GRIS_58, "middle"))
    return document(L20, H20, o)


# ═══════════════════════════════════════════════════════════════════════════
# CE QU'ON ECRIT
#
# L'identifiant d'une figure est le nom de son fichier sans l'extension. Il
# sert de cle dans cours/figures/CORRESPONDANCE.md, comme l'identifiant d'une
# scene sert de cle dans le manifeste d'animations.
# ═══════════════════════════════════════════════════════════════════════════

FIGURES = {
    "l2-fig00-lecture.svg": (fig00_lecture, L0, H0),
    "l2-fig01-planche.svg": (fig01_planche, L1, H1),
    "l2-fig02-grille.svg": (fig02_grille, L2, H2),
    "l2-fig03-colonne.svg": (fig03_colonne, L3, H3),
    "l2-fig04-neurone.svg": (fig04_neurone, L4, H4),
    "l2-fig05-gabarit-zero.svg": (fig05_gabarit, L5, H5),
    "l2-fig06-detecteur.svg": (fig06_detecteur, L6, H6),
    "l2-fig07-sortie.svg": (fig07_sortie, L7, H7),
    "l2-fig08-sigmoide.svg": (fig08_sigmoide, L8, H8),
    "l2-fig09-biais-seuil.svg": (fig09_biais, L9, H9),
    "l2-fig10-architecture.svg": (fig10_architecture, L10, H10),
    "l2-fig11-matricielle.svg": (fig11_matricielle, L11, H11),
    "l2-fig12-parametres.svg": (fig12_parametres, L12, H12),
    "l2-fig13-espoir.svg": (fig13_espoir, L13, H13),
    "l2-fig14-dix-gabarits.svg": (fig14_dix_gabarits, L14, H14),
    "l2-fig15-quatre-modeles.svg": (fig15_quatre_modeles, L15, H15),
    "l2-fig16-milieu-de-deux-quatre.svg": (fig16_milieu, L16, H16),
    "l2-fig17-le-pas-balaye.svg": (fig17_balayage, L17, H17),
    "l2-fig18-le-trajet-complet.svg": (fig18_trajet, L18, H18),
    "l2-fig19-sept-decale.svg": (fig19_sept_decale, L19, H19),
    "l2-fig20-le-reseau-entier.svg": (fig20_reseau_entier, L20, H20),
}


def main() -> None:
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, ValueError, OSError):
            pass
    debut = time.time()
    print("  Chapitre 2 : les figures.")
    print("  Les deux entrainements de mesures.py tournent d'abord ;")
    print("  aucune figure n'affiche un nombre qui n'en sorte pas.")
    V = mesurer()
    print(f"  mesures faites en {time.time() - debut:.1f} s\n")

    SORTIE.mkdir(parents=True, exist_ok=True)
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
