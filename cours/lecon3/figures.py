"""Chapitre 3 : les vingt-huit figures fixes, toutes en SVG.

    python cours/lecon3/figures.py
    python cours/lecon3/figures.py --refaire     en ignorant le cache

CE CHAPITRE N'A PLUS DE PNG. Il en portait quatre, produits par matplotlib
dans cours/figures/, et aucune page ne les servait. Ils sont remplaces par des
schemas SVG qui partagent le trait de cours/schema.py avec les figures des
autres chapitres : nets a toute taille, quelques kilo-octets, relisibles dans
un editeur, et soumis aux deux cribles du depot.

CE FICHIER N'ECRIT AUCUN NOMBRE A LA MAIN. Il importe cours/lecon3/mesures.py
et se sert de SES fonctions -- init, avant, arriere, cout, evaluer, entrainer,
gradient_complet -- avec SON protocole : graine 0, lots de 64, eta 0,5, trente
epoques. Chaque valeur affichee sort donc du programme de mesures du chapitre,
et non d'une sortie de console qui aurait pu vieillir.

TROIS EXCEPTIONS, et elles sont explicites. Les figures 6, 14, 15, 18 et 24
tracent des fonctions POSEES par le cours -- exp(-t), t carre, t puissance
quatre, le paysage a deux vallees -- et non des mesures. Elles sont marquees
« posee » dans la table SCHEMAS, et leur legende dans la page le redit.

LA REGLE 32 EST ARMEE ICI. `txt` refuse une taille sous TEXTE_MIN au lieu de
la composer, et refuse un texte de plus de QUARANTE caracteres : une figure ne
porte que des etiquettes, les phrases vont dans la legende du bloc. Le controle
mecanique est `node outils/verifier-figures.mjs lecon3`.

L'INTERLIGNE NE S'ECRIT PAS A LA MAIN. Toute pile de lignes avance de
`pas(taille)` -- cours/schema.py -- jamais d'une constante. Le controle est
`node outils/verifier-recouvrements.mjs lecon3`.

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
# synchronisation de douze fils coute plus cher que la multiplication.
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
    GRIS_14,
    GRIS_24,
    GRIS_40,
    GRIS_58,
    GRIS_72,
    MOINS,
    PAPIER,
    accolade,
    cercle,
    colonne,
    couper,
    document,
    ent,
    fleche,
    largeur_texte,
    ligne,
    nb,
    pas,
    rect,
    sci,
    suspension,
    txt,
    txt_indice,
)

SORTIE = RACINE.parent / "public" / "cours" / "lecon3"
CACHE = RACINE / ".donnees" / "l3-schemas.pickle"


# ── Le plancher de la regle 32 ──────────────────────────────────────────────
#
# LA MESURE, refaisable en deux `grep`. Le corps d'une lecon est compose a
# `text-[0.9375rem]`, soit 15 px : src/composants/academy/blocs/prose.tsx.
# L'article qui le porte est en `max-w-[44rem]` avec `lg:px-8`, donc une
# colonne de 44 x 16 - 2 x 32 = 640 px. Une figure y est servie en `w-full`
# (blocs/Statiques.tsx, BImage), et un SVG large de 1380 s'y affiche reduit de
# 1380 / 640 = 2,156.
#
#     TEXTE_MIN = 15 x 1380 / 640 = 32,3  ->  33
#
# CE N'EST PAS UN PLANCHER QU'ON PEUT FRANCHIR : `txt` leve au lieu de
# composer. Une figure illisible ne se voit pas dans un diff, et se voit tres
# bien chez l'etudiant.
CORPS_PX = 15
COLONNE_PX = 640
LARGEUR = 1380
TEXTE_MIN = -(-CORPS_PX * LARGEUR // COLONNE_PX)   # 33
CARACTERES_MAX = 40
LIGNE = pas(TEXTE_MIN)                              # 44,55

# `txt_indice` compose son indice a 0,68 fois la base : pour que l'indice
# atteigne le plancher, la base doit valoir 33 / 0,68, soit 49.
BASE_INDICE = -(-TEXTE_MIN * 100 // 68)             # 49

_txt_brut = txt
_indice_brut = txt_indice


def txt(x, y, contenu, taille=TEXTE_MIN, couleur=ENCRE, ancre="start",
        graisse=400, italique=False):  # noqa: F811
    if taille < TEXTE_MIN:
        raise ValueError(
            f"texte de figure a {taille}, sous le plancher {TEXTE_MIN} : "
            f"« {contenu[:40]} ». Voir la regle 32.")
    if len(contenu) > CARACTERES_MAX:
        raise ValueError(
            f"etiquette de {len(contenu)} caracteres, maximum "
            f"{CARACTERES_MAX} : « {contenu} ». La phrase va dans la legende.")
    return _txt_brut(x, y, contenu, taille, couleur, ancre, graisse, italique)


def txt_indice(x, y, base, indice, suite="", taille=BASE_INDICE,
               couleur=ENCRE, ancre="start", graisse=400):  # noqa: F811
    if taille * 0.68 < TEXTE_MIN:
        raise ValueError(
            f"indice compose a {taille * 0.68:.1f}, sous le plancher "
            f"{TEXTE_MIN} : « {base}{indice} ». Base minimale {BASE_INDICE}.")
    return _indice_brut(x, y, base, indice, suite, taille, couleur, ancre,
                        graisse)


def entete(x, y, texte, largeur=620) -> list[str]:
    """Le titre d'un panneau, au plancher, coupe a la largeur du panneau.

    `schema.entete` le compose a 17 et ne le coupe pas. A 33 un titre de
    trente-cinq caracteres demande 636 pixels : ecrit d'un trait il entrerait
    dans le titre du panneau voisin. Il se coupe donc, et le filet passe sous
    la derniere ligne.
    """
    lignes = couper(texte, largeur, TEXTE_MIN)
    dessous = y + (len(lignes) - 1) * LIGNE + 14
    return [txt(x, y + i * LIGNE, l, TEXTE_MIN, GRIS_58, graisse=600)
            for i, l in enumerate(lignes)] + [
        ligne(x, dessous, x + largeur, dessous, GRIS_24, 1.5, filet=True)]


# ── Les primitives de trace ─────────────────────────────────────────────────


def echelle(lo, hi, a, b):
    """Une application affine de [lo, hi] sur [a, b]."""
    etendue = (hi - lo) or 1.0

    def f(u):
        return a + (u - lo) / etendue * (b - a)
    return f


def polyligne(points, couleur=ENCRE, ep=3.2, tirets=None) -> str:
    d = f' stroke-dasharray="{tirets}"' if tirets else ""
    return ('<polyline points="'
            + " ".join(f"{a:.1f},{b:.1f}" for a, b in points)
            + f'" fill="none" stroke="{couleur}" stroke-width="{ep}"'
            + f' stroke-linejoin="round"{d}/>')


# LA GRADUATION, ET CE QU'ELLE IMPOSE DESSOUS.
#
# `outils/verifier-recouvrements.mjs` elargit la boite d'un texte de GARDE =
# 0,25 fois sa taille avant de la croiser avec les traits : un trait qui frole
# un texte est aussi illisible qu'un trait qui le traverse. Pour un texte au
# plancher, la boite monte de 0,8 x 33 = 26,4 au-dessus de sa ligne de base, et
# la garde y ajoute 8,25.
#
#     ligne de base > fin de la graduation + 26,4 + 8,25 = + 34,65
#
# `pas(TEXTE_MIN)` vaut 44,55, et poser l'etiquette a un interligne sous l'AXE
# ne laissait donc que 0,15 pixel au-dessus d'une graduation de dix : le crible
# l'a releve quarante et une fois. L'interligne se compte a partir de la FIN de
# la graduation, jamais de l'axe.
TIC = 10.0


def axe_h(x0, x1, y, positions, etiquettes, couleur=ENCRE, ep=2.4,
          teinte=GRIS_58) -> list[str]:
    """Un axe horizontal, ses graduations, et ses etiquettes DESSOUS."""
    o = [ligne(x0, y, x1, y, couleur, ep)]
    for x, e in zip(positions, etiquettes):
        o.append(ligne(x, y, x, y + TIC, teinte, 1.8))
        if e:
            o.append(txt(x, y + TIC + LIGNE, e, TEXTE_MIN, teinte, "middle"))
    return o


def sous_axe(y: float, rang: float = 0.0) -> float:
    """L'ordonnee d'une ligne de texte posee sous un axe horizontal.

    Rang 0 est la ligne des graduations, et les rangs suivants s'empilent a
    l'interligne. Aucune figure ne calcule cette ordonnee a la main.
    """
    return y + TIC + LIGNE * (1.0 + rang)


def axe_v(x, y0, y1, positions, etiquettes, couleur=ENCRE, ep=2.4,
          teinte=GRIS_58) -> list[str]:
    """Un axe vertical, graduations a gauche, etiquettes alignees a droite.

    Meme garde qu'en horizontal, portee sur la largeur : le bord droit du
    texte s'arrete a plus d'une garde de la graduation.
    """
    o = [ligne(x, y0, x, y1, couleur, ep)]
    for y, e in zip(positions, etiquettes):
        o.append(ligne(x - TIC, y, x, y, teinte, 1.8))
        if e:
            o.append(txt(x - TIC - 22, y + TEXTE_MIN * 0.36, e, TEXTE_MIN,
                         teinte, "end"))
    return o


def cote(x, y, texte, couleur=BRIQUE, ancre="start", graisse=700) -> str:
    """Un nombre mis en avant : la valeur qu'on veut que le lecteur emporte."""
    return txt(x, y, texte, TEXTE_MIN, couleur, ancre, graisse)


def panneau(x, y, lettre, titre, largeur=620) -> list[str]:
    """Le titre d'un panneau d'une planche : « (a) », puis son sujet."""
    return entete(x, y, f"({lettre}) {titre}", largeur)


def pile(x, y, lignes_texte, couleur=ENCRE, ancre="start", graisse=400
         ) -> list[str]:
    """Des etiquettes empilees a l'interligne calcule."""
    return [txt(x, y + i * LIGNE, t, TEXTE_MIN, couleur, ancre, graisse)
            for i, t in enumerate(lignes_texte)]


def exposant(couche: int) -> str:
    """L'exposant de couche, en vrais caracteres : W⁽¹⁾, a⁽²⁾.

    Unicode ne porte pas de crochets en exposant. Le cours ecrit W^{[1]} dans
    son texte et W⁽¹⁾ dans ses figures, comme le chapitre 2 : c'est la
    convention du parcours, et la regle 24 interdit d'approximer, pas de
    changer de notation quand le caractere n'existe pas.
    """
    return "⁽" + "¹²³⁴⁵⁶⁷⁸⁹"[couche - 1] + "⁾"


def pourcent(x: float, decimales: int = 1) -> str:
    return nb(100.0 * x, decimales) + " %"


def degres(cosinus: float) -> str:
    return nb(math.degrees(math.acos(min(1.0, max(-1.0, cosinus)))), 1) + "°"


# ═══════════════════════════════════════════════════════════════════════════
# LES MESURES
#
# Tout ce que les figures affichent est calcule ici, par les fonctions de
# mesures.py et avec son protocole. Rien n'est recopie.
#
# LA CLE DU CACHE porte l'empreinte de mesures.py, de donnees.py ET du source
# de `calculer`. Sans ce troisieme terme, ajouter une valeur a `calculer`
# laisserait le cache repondre l'ancien dictionnaire, et la figure qui
# reclamerait la valeur neuve echouerait sur un KeyError sans qu'on comprenne
# pourquoi. C'est arrive au chapitre 2 ; la lecon est reprise ici.
# ═══════════════════════════════════════════════════════════════════════════


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
    debut = time.time()
    V = calculer()
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_bytes(pickle.dumps({"signature": signature, "valeurs": V}))
    print(f"  mesures calculees en {time.time() - debut:.1f} s, "
          f"et mises en cache")
    return V


def calculer() -> dict:
    Xtr, ctr, Xte, cte = D.charger()
    tailles = (784, M.H, M.K)
    V: dict = {"K": M.K, "H": M.H, "eta": M.ETA, "epoques": M.EPOQUES,
               "entrees": 784, "N": len(Xtr), "Ntest": len(Xte)}

    # ── Les quatre blocs de theta ──────────────────────────────────────────
    theta0 = M.init(tailles, M.GRAINE)
    V["blocs"] = [(cle, tuple(int(d) for d in theta0[cle].shape),
                   int(theta0[cle].size)) for cle in sorted(theta0)]
    V["p"] = int(M.plat(theta0).size)

    # ── Mesure 1 · le cout au depart ───────────────────────────────────────
    V["hasard"] = -math.log(1.0 / M.K)
    V["graines"] = []
    for graine in range(5):
        L, acc = M.evaluer(M.init(tailles, graine), Xte, cte)
        V["graines"].append((graine, float(L), float(acc)))
    a0 = M.avant(theta0, Xte[0:1])[f"A{len(tailles) - 1}"][0]
    V["sortie0"] = [float(v) for v in a0]
    V["classe0"] = int(cte[0])
    V["perte0"] = float(-math.log(a0[cte[0]]))

    # ── Mesure 2 · les deux couts, et leur sensibilite ─────────────────────
    # Les deux expressions sont POSEES par le cours -- ce sont des derivees,
    # pas des mesures. Les valeurs, elles, sont calculees ici.
    def deux_couts(ac: float) -> tuple[float, float]:
        a = np.full(M.K, (1.0 - ac) / (M.K - 1))
        a[0] = ac
        y = np.zeros(M.K)
        y[0] = 1.0
        return float(-math.log(ac)), float(np.sum((a - y) ** 2))

    V["quatre_sorties"] = [(ac, *deux_couts(ac))
                           for ac in (0.970, 0.310, 0.120, 0.004)]
    V["sensibilite"] = []
    for ac in (0.001, 0.010, 0.100, 0.500, 0.900):
        a = np.full(M.K, (1.0 - ac) / (M.K - 1))
        a[0] = ac
        y = np.zeros(M.K)
        y[0] = 1.0
        croisee = abs(a[0] - y[0])
        quad = 2.0 * float(np.sum((a - y) * a * (np.arange(M.K) == 0)
                                  - (a - y) * a * a[0]))
        V["sensibilite"].append((ac, croisee, abs(quad), croisee / abs(quad)))

    # ── Mesure 4 · les composantes du gradient ─────────────────────────────
    X, c = Xtr[:2048], ctr[:2048]
    Y = M.onehot(c)
    g0 = M.arriere(theta0, M.avant(theta0, X), Y)
    v = M.plat(g0)
    absv = np.abs(v)
    ordonnees = np.sort(absv)[::-1]
    cumul = np.cumsum(ordonnees) / ordonnees.sum()
    # La courbe cumulee, ramenee a 400 points : la garder entiere mettrait
    # cent mille couples dans le SVG pour un trace identique a l'oeil.
    indices = np.linspace(0, len(cumul) - 1, 400).astype(int)
    V["cumul"] = [(float((i + 1) / len(cumul)), float(cumul[i]))
                  for i in indices]
    # Le profil des valeurs absolues triees, en echelle logarithmique.
    V["profil"] = [(float((i + 1) / len(ordonnees)),
                    float(max(ordonnees[i], 1e-12)))
                   for i in indices]
    V["gradient"] = {
        "p": int(v.size), "max": float(absv.max()),
        "mediane": float(np.median(absv)),
        "rapport": float(absv.max() / np.median(absv)),
        "norme": float(np.linalg.norm(v)),
        "nuls": int((v == 0).sum()), "exemples": int(len(X)),
    }
    V["percentiles"] = [
        (part, float(ordonnees[:int(round(part * len(ordonnees)))].sum()
                     / ordonnees.sum()))
        for part in (0.01, 0.10, 0.50)]

    # ── Mesure 10 · d'ou viennent les zeros ────────────────────────────────
    # Meme decoupage que mesures.py : pixels muets, neurones eteints, et le
    # reste, qui est une rencontre entre les deux.
    A1 = np.maximum(X @ theta0["W1"].T + theta0["b1"], 0.0)
    pixels_muets = (X.max(axis=0) == 0.0)
    neurones_eteints = (A1.max(axis=0) == 0.0)
    zW1 = (g0["W1"] == 0.0)
    par_pixel = int(zW1[:, pixels_muets].sum())
    par_neurone = int(zW1[neurones_eteints, :].sum())
    croisement = int(zW1[np.ix_(neurones_eteints, pixels_muets)].sum())
    V["zeros"] = {
        "total": int(zW1.sum()),
        "muets": int(pixels_muets.sum()),
        "muets_complet": int((Xtr.max(axis=0) == 0.0).sum()),
        "eteints": int(neurones_eteints.sum()),
        "par_pixel": par_pixel, "par_neurone": par_neurone,
        "croisement": croisement,
        "reste": int(zW1.sum()) - (par_pixel + par_neurone - croisement),
        "grille": [bool(b) for b in pixels_muets],
        "grille_complet": [bool(b) for b in (Xtr.max(axis=0) == 0.0)],
    }

    # ── Mesure 8 · cent directions au hasard ───────────────────────────────
    base = M.plat(theta0)
    eps = 1e-5

    def derivee(u):
        return (M.cout(M.deplat(theta0, base + eps * u), X, c)
                - M.cout(M.deplat(theta0, base - eps * u), X, c)) / (2 * eps)

    V["directionnelle"] = float(derivee(v / np.linalg.norm(v)))
    rng = np.random.default_rng(M.GRAINE)
    tirees = []
    for _ in range(100):
        u = rng.normal(size=base.size)
        tirees.append(float(derivee(u / np.linalg.norm(u))))
    V["hasard_directions"] = {
        "max": max(tirees), "min": min(tirees),
        "moyenne": float(np.mean(tirees)),
        "depassent": int(sum(1 for t in tirees if t > V["directionnelle"])),
        "combien": len(tirees),
        "echantillon": sorted(tirees)[::-1][:20],
    }

    # ── L'escalier du taux d'erreur contre le cout lisse ───────────────────
    # On balaie UN parametre -- le biais de sortie de la classe 0 -- et on
    # releve les deux quantites. Le taux d'erreur ne prend qu'un nombre fini
    # de valeurs et saute ; le cout, lui, est lisse. C'est la proposition 1,
    # rendue visible sur le reseau reel.
    #
    # QUARANTE IMAGES, ET PAS DEUX MILLE. Sur 2 048 exemples le taux d'erreur
    # prend 2 049 valeurs, ses marches font un demi-millieme de haut, et la
    # courbe rendue est indiscernable d'une courbe lisse : la figure montrait
    # exactement le contraire de ce qu'elle devait montrer. Sur quarante
    # images les marches font un quarantieme et se comptent a l'oeil. Le
    # nombre de valeurs suit le nombre d'images, et la legende de la figure
    # dit lequel : l'argument de la proposition 1, lui, ne depend pas de N.
    # ON BALAIE UN POIDS, ET NON UN BIAIS. Un biais de sortie decale le score
    # de sa classe de la MEME quantite pour toutes les images : les quarante
    # basculent donc dans un mouchoir, et la courbe montre UN saut, pas un
    # escalier. Un poids W⁽²⁾ decale ce score de delta fois l'activation du
    # neurone, qui varie d'une image a l'autre : les bascules s'etalent, et
    # les marches se comptent. On prend le neurone dont l'activation est la
    # plus dispersee sur les quarante images, celui qui etale le plus.
    Xe, ce = Xtr[:40], ctr[:40]
    Ye = M.onehot(ce)
    cache_e = M.avant(theta0, Xe)
    A1fix, W2, b2 = cache_e["A1"], theta0["W2"], theta0["b2"]
    neurone = int(np.argmax(A1fix.std(axis=0)))
    V["balayage"] = []
    for delta in np.linspace(-1.6, 1.6, 481):
        W = W2.copy()
        W[0, neurone] += float(delta)
        A2 = M.softmax(A1fix @ W.T + b2)
        perte = float(-np.sum(Ye * np.log(np.clip(A2, 1e-15, None))) / len(Xe))
        erreur = float((A2.argmax(axis=1) != ce).mean())
        V["balayage"].append((float(delta), perte, erreur))
    V["balayage_images"] = int(len(Xe))
    V["balayage_neurone"] = neurone
    V["balayage_valeurs"] = int(len(Xe)) + 1
    V["balayage_paliers"] = len({round(e, 6) for _d, _p, e in V["balayage"]})

    # ── Mesure 5 · la taille du lot ────────────────────────────────────────
    # LE MEME PROTOCOLE QUE mesures.py, mesure 5, au tirage pres : meme
    # graine, meme ordre des tailles, meme nombre de tirages. Sans cela la
    # figure afficherait d'autres cosinus que la table de la page 9.
    gc = M.plat(M.gradient_complet(theta0, Xtr, M.onehot(ctr)))
    ngc = float(np.linalg.norm(gc))
    V["gradient_complet"] = {"norme": ngc, "exemples": int(len(Xtr))}
    rng = np.random.default_rng(M.GRAINE)
    V["lots"] = []
    for B in (1, 8, 64, 512, 4096):
        cosinus = []
        for _ in range(30):
            idx = rng.choice(len(Xtr), size=B, replace=False)
            gb = M.plat(M.arriere(theta0, M.avant(theta0, Xtr[idx]),
                                  M.onehot(ctr[idx])))
            cosinus.append(float(gb @ gc / (np.linalg.norm(gb) * ngc)))
        tableau = np.array(cosinus)
        moyenne = float(tableau.mean())
        V["lots"].append({
            "B": B, "cos": [float(t) for t in tableau], "moyenne": moyenne,
            "ecart": float(tableau.std()),
            "kappa": B * (1.0 / moyenne ** 2 - 1.0),
        })

    # ── Mesure 7 · le journal de l'entrainement ────────────────────────────
    r = M.entrainer(tailles, M.GRAINE, M.ETA, M.EPOQUES, Xtr, ctr, Xte, cte,
                    trace=True, normes=True)
    V["journal"] = [(int(t), float(Ltr), float(atr), float(Lte), float(ate),
                     float(ng)) for t, Ltr, atr, Lte, ate, ng in r["journal"]]

    # ── Mesure 6 · trois graines, et une permutation ───────────────────────
    thetas, V["trois"] = [], []
    for graine in range(3):
        rg = M.entrainer(tailles, graine, M.ETA, M.EPOQUES, Xtr, ctr, Xte,
                         cte)
        thetas.append(M.plat(rg["theta"]))
        V["trois"].append((graine, float(rg["acc"]), int(rg["erreurs"]),
                           float(np.linalg.norm(thetas[-1]))))
        if graine == 0:
            theta_fin = rg["theta"]
    V["couples"] = []
    for i, j in ((0, 1), (0, 2), (1, 2)):
        V["couples"].append((
            i, j,
            float(np.linalg.norm(thetas[i] - thetas[j])
                  / np.linalg.norm(thetas[i])),
            float(thetas[i] @ thetas[j]
                  / (np.linalg.norm(thetas[i]) * np.linalg.norm(thetas[j])))))
    V["racine2"] = math.sqrt(2.0)

    # ── La permutation des neurones caches, proposition 6 ──────────────────
    permutation = np.random.default_rng(M.GRAINE).permutation(M.H)
    theta_p = {
        "W1": theta_fin["W1"][permutation], "b1": theta_fin["b1"][permutation],
        "W2": theta_fin["W2"][:, permutation], "b2": theta_fin["b2"],
    }
    avant_p, apres_p = M.plat(theta_fin), M.plat(theta_p)
    V["permutation"] = {
        "cout": float(M.cout(theta_fin, Xte, cte)),
        "cout_permute": float(M.cout(theta_p, Xte, cte)),
        "distance": float(np.linalg.norm(apres_p - avant_p)
                          / np.linalg.norm(avant_p)),
        "factorielle": math.lgamma(M.H + 1) / math.log(10.0),
    }
    V["permutation"]["ecart"] = abs(V["permutation"]["cout"]
                                    - V["permutation"]["cout_permute"])
    return V


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 1 · le reseau, et les nombres que personne n'a choisis
# ═══════════════════════════════════════════════════════════════════════════

F01 = (LARGEUR, 700)


def _colonne_ronds(x, y, hauteur, combien, r=13.0, montres=4) -> list[str]:
    """Une colonne de neurones, abregee par un ⋮ quand elle est trop haute."""
    o = []
    if combien <= montres + 1:
        ecart = hauteur / max(1, combien - 1)
        for k in range(combien):
            o.append(cercle(x, y + k * ecart, r, PAPIER, ENCRE, 2.2))
        return o
    haut = [y + k * 34 for k in range(montres // 2)]
    bas = [y + hauteur - k * 34 for k in range(montres // 2)][::-1]
    for cy in haut + bas:
        o.append(cercle(x, cy, r, PAPIER, ENCRE, 2.2))
    o.append(suspension(x, (haut[-1] + bas[0]) / 2, GRIS_40, 4.0, 18.0))
    return o


def f01_reseau_sans_nombres(V: dict) -> str:
    o = entete(60, 60, "les quatre blocs, et leurs comptes", 700)

    # Les trois colonnes du reseau, a gauche.
    xs = [220.0, 420.0, 620.0]
    hauteurs = [300.0, 300.0, 240.0]
    combien = [V["entrees"], V["H"], V["K"]]
    hautX = 210.0
    for x, h, n in zip(xs, hauteurs, combien):
        for y0 in (hautX,):
            o += _colonne_ronds(x, y0 + (300.0 - h) / 2, h, min(n, 5))
    # Les faisceaux entre colonnes : un filet pale, pas 784 traits.
    for a, b in ((xs[0], xs[1]), (xs[1], xs[2])):
        for u in range(5):
            for w in range(5):
                o.append(ligne(a + 14, hautX + u * 70, b - 14,
                               hautX + w * 70 if b != xs[2] else hautX + 30 + w * 60,
                               GRIS_14, 1.0))
    for x, n, sous in zip(xs, combien, ("un par pixel", "", "un par chiffre")):
        o.append(txt(x, 175, ent(n), TEXTE_MIN, ENCRE, "middle", 700))
        if sous:
            o.append(txt(x, 560, sous, TEXTE_MIN, GRIS_58, "middle"))

    # Les quatre blocs de parametres, a droite, chacun marque d'un point
    # d'interrogation : c'est le sujet du chapitre.
    o += entete(820, 60, "et personne ne les a choisis", 500)
    y = 200.0
    for cle, forme, taille in V["blocs"]:
        nom = ("W" if cle[0] == "W" else "b") + exposant(int(cle[1]))
        o.append(txt(820, y, nom, TEXTE_MIN, ENCRE, graisse=700))
        o.append(txt(1160, y, ent(taille), TEXTE_MIN, GRIS_72, "end"))
        o.append(txt(1210, y, "?", TEXTE_MIN, BRIQUE, graisse=700))
        y += LIGNE
    o.append(ligne(820, y - LIGNE + 18, 1240, y - LIGNE + 18, GRIS_24, 1.5,
                   filet=True))
    o.append(cote(820, y + 24, ent(V["p"])))
    o.append(txt(1160, y + 24, "en tout", TEXTE_MIN, GRIS_58, "end"))
    return document(*F01, o)


F02 = (LARGEUR, 560)


def f02_la_fleche_qui_manque(V: dict) -> str:
    o = entete(60, 60, "ce que le chapitre 2 a construit", 560)
    o += entete(740, 60, "ce qu'aucun chapitre n'a dit", 560)

    # A gauche : la boite f, et theta qui entre par le bas.
    o.append(rect(200, 220, 300, 170, ENCRE, 2.6))
    o.append(txt_indice(350, 320, "f", "θ", "", BASE_INDICE, ENCRE,
                        "middle", 700))
    # LES ETIQUETTES PASSENT AU-DESSUS DES BOITES. Ecrites a hauteur de fleche
    # elles mordaient le bord du cadre voisin, et le crible le releve : un
    # texte a cheval sur un trait ne se lit pas.
    o.append(fleche(80, 305, 190, 305, GRIS_58, 2.4))
    o.append(txt(80, 190, "une image", TEXTE_MIN, GRIS_58))
    o.append(fleche(510, 305, 620, 305, GRIS_58, 2.4))
    o.append(txt(620, 190, "un chiffre", TEXTE_MIN, GRIS_58, "end"))
    o.append(fleche(350, 470, 350, 400, ENCRE, 2.6))
    o.append(txt(350, 515, "θ", TEXTE_MIN, ENCRE, "middle", 700))

    # A droite : la boite vide qui devrait fabriquer theta.
    o.append(rect(880, 220, 300, 170, BRIQUE, 2.6, "none"))
    o.append(txt(1030, 320, "?", TEXTE_MIN, BRIQUE, "middle", 700))
    o.append(fleche(760, 305, 870, 305, GRIS_58, 2.4))
    o.append(txt(760, 190, "le jeu", TEXTE_MIN, GRIS_58))
    o.append(fleche(1030, 400, 1030, 470, BRIQUE, 2.6))
    o.append(txt(1030, 515, "θ", TEXTE_MIN, BRIQUE, "middle", 700))
    return document(*F02, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 2 · les deux architectures, et ou vivent les cent mille
# ═══════════════════════════════════════════════════════════════════════════

F03 = (LARGEUR, 560)


def _rangee_couches(x0, y, largeurs, noms) -> list[str]:
    o, x = [], x0
    for l, n in zip(largeurs, noms):
        o.append(rect(x, y, l, 96, ENCRE, 2.4))
        o.append(txt(x + l / 2, y + 62, n, TEXTE_MIN, ENCRE, "middle", 600))
        x += l + 40
    return o


def f03_deux_architectures(V: dict) -> str:
    o = entete(60, 60, "deux réseaux, deux comptes", 700)
    petit = (784, 16, 16, 10)
    grand = (784, V["H"], V["K"])

    def compte(t):
        return sum(t[i] * t[i - 1] + t[i] for i in range(1, len(t)))

    for k, tailles in enumerate((petit, grand)):
        y = 220.0 + k * 200
        largeurs = [max(120.0, 120.0 + 0.16 * t) for t in tailles]
        o += _rangee_couches(80, y, largeurs, [ent(t) for t in tailles])
        o.append(cote(1120, y + 62, ent(compte(tailles)), ENCRE, "end"))
        o.append(txt(1160, y + 62, "nombres", TEXTE_MIN, GRIS_58))
    o.append(txt(80, 180, "784 → 16 → 16 → 10", TEXTE_MIN, GRIS_58))
    o.append(txt(80, 380, f"784 → {V['H']} → {V['K']}", TEXTE_MIN, GRIS_58))
    return document(*F03, o)


F04 = (LARGEUR, 620)


def f04_deux_matrices(V: dict) -> str:
    """Les deux matrices dessinees A L'ECHELLE : le rapport des aires EST
    l'idee, et aucun tableau ne le montre."""
    o = entete(60, 60, "les deux matrices, à l'échelle", 700)
    blocs = dict((cle, (forme, taille)) for cle, forme, taille in V["blocs"])
    (h1, e1), t1 = blocs["W1"]
    (h2, e2), t2 = blocs["W2"]

    # Une unite = un coefficient. W1 fait 784 de large et 128 de haut.
    o.append(rect(90, 200, e1, h1, ENCRE, 2.2, GRIS_14))
    o.append(txt(90, 175, "W" + exposant(1), TEXTE_MIN, ENCRE, graisse=700))
    o.append(txt(90 + e1, 175, f"{ent(h1)} × {ent(e1)}", TEXTE_MIN, GRIS_58,
                 "end"))
    o.append(cote(90, 200 + h1 + LIGNE, ent(t1)))
    o.append(txt(90 + e1, 200 + h1 + LIGNE, pourcent(t1 / V["p"]),
                 TEXTE_MIN, BRIQUE, "end", 700))

    o.append(rect(990, 200, e2, h2, ENCRE, 2.2, GRIS_14))
    o.append(txt(990, 175, "W" + exposant(2), TEXTE_MIN, ENCRE, graisse=700))
    o.append(txt(990 + e2 + 10, 175, f"{ent(h2)} × {ent(e2)}", TEXTE_MIN,
                 GRIS_58))
    o.append(cote(990, 200 + h1 + LIGNE, ent(t2)))
    o.append(txt(990, 200 + h1 + LIGNE * 2, pourcent(t2 / V["p"]), TEXTE_MIN,
                 GRIS_58))
    return document(*F04, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 3 · les deux algorithmes, et les trois cas d'argmin
# ═══════════════════════════════════════════════════════════════════════════

F05 = (LARGEUR, 620)


def _tuyau(x, y, titre_g, entree, sortie, couleur=ENCRE) -> list[str]:
    o = [rect(x + 130, y, 300, 150, couleur, 2.6)]
    o.append(txt(x + 280, y + 92, titre_g, TEXTE_MIN, couleur, "middle", 700))
    o.append(fleche(x, y + 75, x + 120, y + 75, GRIS_58, 2.4))
    o.append(fleche(x + 440, y + 75, x + 560, y + 75, GRIS_58, 2.4))
    o.append(txt(x, y - 22, entree, TEXTE_MIN, GRIS_58))
    o.append(txt(x + 560, y - 22, sortie, TEXTE_MIN, GRIS_58, "end"))
    return o


def f05_deux_algorithmes(V: dict) -> str:
    o = entete(60, 60, "celui qui reconnaît", 560)
    o += entete(740, 60, "celui qu'on écrit", 560)
    o += _tuyau(80, 240, "dix lignes", "une image", "dix nombres")
    o += _tuyau(760, 240, "cinq lignes", "un θ, le jeu", "un autre θ", BRIQUE)
    o.append(txt(80, 500, "écrit au chapitre 2", TEXTE_MIN, GRIS_58))
    o.append(txt(760, 500, "écrit ici", TEXTE_MIN, BRIQUE, graisse=600))
    o.append(txt(80, 500 + LIGNE, "son comportement vient de θ", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(760, 500 + LIGNE, "il fabrique θ", TEXTE_MIN, GRIS_58))
    return document(*F05, o)


F06 = (LARGEUR, 620)


def f06_argmin_trois_cas(V: dict) -> str:
    """POSEE, pas mesuree : trois fonctions d'une variable choisies par le
    cours pour que l'ensemble des minimiseurs soit vide, ponctuel, infini."""
    o = []
    largeur, marge = 380.0, 60.0
    # LES TROIS FONCTIONS SONT CHOISIES POUR TENIR DANS LA BANDE sans etre
    # ecretees : une exponentielle qui sort du cadre y dessine un plateau, et
    # un plateau est justement ce que montre le troisieme panneau. La variable
    # est notee θ et non t : dans ce chapitre, t est reserve aux iterations.
    formes = (
        ("a", "vide", "exp(−θ)", lambda t: 2.4 * math.exp(-0.8 * (t + 2.6)),
         None),
        ("b", "un point", "θ²", lambda t: 0.30 * t * t, [0.0]),
        ("c", "une infinité", "un plateau",
         lambda t: 0.30 * max(0.0, abs(t) - 1.4) ** 2, [-1.4, 0.0, 1.4]),
    )
    for k, (lettre, sujet, nom, f, minima) in enumerate(formes):
        x0 = marge + k * (largeur + 60)
        o += panneau(x0, 60, lettre, sujet, largeur)
        gx = echelle(-2.6, 2.6, x0 + 30, x0 + largeur - 30)
        gy = echelle(0.0, 2.6, 470.0, 230.0)
        o.append(ligne(x0 + 20, 470, x0 + largeur - 10, 470, ENCRE, 2.2))
        # L'AXE VERTICAL S'ARRETE AU-DESSUS DE L'AXE HORIZONTAL, et non
        # dessous : prolonge jusqu'a 480 il venait frôler l'etiquette posee
        # sous le panneau, a un dixieme de pixel de la garde du crible.
        o.append(ligne(x0 + 30, 220, x0 + 30, 472, ENCRE, 2.2))
        points = [(gx(t), gy(min(2.6, f(t))))
                  for t in [(-2.6 + 5.2 * i / 120) for i in range(121)]]
        o.append(polyligne(points, ENCRE, 3.2))
        for t in (minima or []):
            o.append(cercle(gx(t), gy(f(t)), 9.0, BRIQUE))
        o.append(txt(x0 + 30, sous_axe(470), nom, TEXTE_MIN, GRIS_58))
    return document(*F06, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 4 · cinq graines, et une sortie non entrainee
# ═══════════════════════════════════════════════════════════════════════════

F07 = (LARGEUR, 620)


def f07_cinq_graines(V: dict) -> str:
    o = entete(60, 60, "cinq réseaux, avant tout apprentissage", 700)
    couts = [L for _g, L, _a in V["graines"]]
    lo = min(min(couts), V["hasard"]) - 0.03
    hi = max(couts) + 0.03
    gx = echelle(lo, hi, 300.0, 1180.0)
    ay = 520.0

    graduations = [2.30, 2.35, 2.40, 2.45]
    o += axe_h(260, 1230, ay, [gx(u) for u in graduations],
               [nb(u, 2) for u in graduations])

    # Le repere : repondre au hasard, sans regarder l'image. Le trait part
    # sous la valeur qu'il porte, garde du crible comprise.
    o.append(ligne(gx(V["hasard"]), 186, gx(V["hasard"]), ay + 12, BRIQUE,
                   3.0))
    o.append(cote(gx(V["hasard"]), 150, nb(V["hasard"], 6), BRIQUE, "middle"))
    o.append(txt(gx(V["hasard"]), 150 - LIGNE, "répondre au hasard",
                 TEXTE_MIN, BRIQUE, "middle"))

    y = 230.0
    for graine, L, acc in V["graines"]:
        o.append(txt(60, y + 11, f"graine {graine}", TEXTE_MIN, ENCRE,
                     graisse=600))
        o.append(ligne(gx(L), y, gx(L), ay - 10, GRIS_24, 1.6))
        o.append(cercle(gx(L), y, 10.0, ENCRE))
        o.append(txt(1300, y + 11, nb(L, 4), TEXTE_MIN, GRIS_72, "end"))
        y += LIGNE
    return document(*F07, o)


F08 = (LARGEUR, 620)


def f08_sortie_non_entrainee(V: dict) -> str:
    o = entete(60, 60, "les dix sorties de la graine 0", 700)
    sortie = V["sortie0"]
    base, pitch = 470.0, 118.0
    gy = echelle(0.0, max(sortie) * 1.08, base, 190.0)
    for k, val in enumerate(sortie):
        cx = 150.0 + k * pitch
        vraie = k == V["classe0"]
        o.append(rect(cx - 38, gy(val), 76, base - gy(val), "none", 0,
                      BRIQUE if vraie else GRIS_40))
        o.append(txt(cx, base + LIGNE, str(k), TEXTE_MIN,
                     BRIQUE if vraie else GRIS_58, "middle", 700))
    o.append(ligne(100, base, 1300, base, ENCRE, 2.4))
    # Le repere de la loi uniforme : c'est lui qui rend les barres lisibles.
    uniforme = 1.0 / V["K"]
    o.append(ligne(100, gy(uniforme), 1300, gy(uniforme), ARDOISE, 2.6,
                   "10 7"))
    o.append(txt(1300, gy(uniforme) - 16, "1 / 10", TEXTE_MIN, ARDOISE, "end",
                 600))
    o.append(txt(150, base + LIGNE * 2, "la vraie classe", TEXTE_MIN, BRIQUE,
                 graisse=600))
    o.append(cote(1300, base + LIGNE * 2, nb(sortie[V["classe0"]], 4), BRIQUE,
                  "end"))
    return document(*F08, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 5 · les deux couts, et leur pente
# ═══════════════════════════════════════════════════════════════════════════

F09 = (LARGEUR, 660)


def f09_deux_couts(V: dict) -> str:
    o = entete(60, 60, "les deux coûts sur quatre sorties", 700)
    lignes_v = V["quatre_sorties"]
    hautmax = max(max(c, q) for _a, c, q in lignes_v)
    base = 520.0
    gy = echelle(0.0, hautmax * 1.06, base, 200.0)
    for k, (ac, croisee, quad) in enumerate(lignes_v):
        cx = 220.0 + k * 300.0
        o.append(rect(cx - 96, gy(croisee), 86, base - gy(croisee), "none", 0,
                      ENCRE))
        o.append(rect(cx + 10, gy(quad), 86, base - gy(quad), "none", 0,
                      ARDOISE))
        o.append(txt(cx, base + LIGNE, nb(ac, 3), TEXTE_MIN, GRIS_58,
                     "middle"))
    o.append(ligne(80, base, 1320, base, ENCRE, 2.4))
    o.append(txt(80, base + LIGNE * 2, "entropie croisée", TEXTE_MIN, ENCRE,
                 graisse=600))
    o.append(txt(560, base + LIGNE * 2, "quadratique", TEXTE_MIN, ARDOISE,
                 graisse=600))
    o.append(txt(1320, 175, "la vraie classe reçoit", TEXTE_MIN, GRIS_58,
                 "end"))
    return document(*F09, o)


F10 = (LARGEUR, 660)


def f10_pente_des_deux_couts(V: dict) -> str:
    o = entete(60, 60, "la pente, là où le réseau se trompe", 700)
    points = V["sensibilite"]
    ac = [p[0] for p in points]
    gx = echelle(math.log10(ac[0]), math.log10(ac[-1]), 220.0, 1180.0)
    base = 520.0
    gy = echelle(0.0, 1.05, base, 190.0)

    # QUATRE GRADUATIONS, PAS CINQ. A la taille du corps « 0,500 » et « 0,900 »
    # se recouvrent sur l'axe logarithmique, leurs deux paliers etant proches.
    # On garde les trois decades et la derniere valeur ; les cinq points, eux,
    # restent traces.
    marques = [ac[0], ac[1], ac[2], ac[4]]
    o += axe_h(180, 1240, base, [gx(math.log10(u)) for u in marques],
               [nb(u, 3) for u in marques])
    # Le zero de l'axe vertical tombe SUR l'axe horizontal, et son etiquette
    # avec lui : on ne gradue qu'a partir de la moitie.
    o += axe_v(220, 170, base + 12, [gy(u) for u in (0.5, 1.0)],
               [nb(u, 1) for u in (0.5, 1.0)])

    for rang, (couleur, nom, tirets) in enumerate(
            ((ENCRE, "entropie croisée", None),
             (ARDOISE, "quadratique", "10 7"))):
        trace = [(gx(math.log10(p[0])), gy(p[1 + rang])) for p in points]
        o.append(polyligne(trace, couleur, 3.4, tirets))
        for a, b in trace:
            o.append(cercle(a, b, 8.0, couleur))
        o.append(txt(1240, 200 + rang * LIGNE, nom, TEXTE_MIN, couleur, "end",
                     600))
    pire = points[0]
    o.append(accolade(gx(math.log10(pire[0])) + 26, gy(pire[2]), gy(pire[1]),
                      1, BRIQUE, 2.4, 14))
    o.append(cote(gx(math.log10(pire[0])) + 72,
                  (gy(pire[1]) + gy(pire[2])) / 2 + 12,
                  "× " + nb(pire[3], 1), BRIQUE))
    return document(*F10, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 6 · le reseau est une fonction, le cout en est une autre
# ═══════════════════════════════════════════════════════════════════════════


def _fonction(titre_haut, entree, sortie, fixe, couleur, V) -> list[str]:
    o = entete(60, 60, titre_haut, 760)
    o.append(rect(480, 220, 420, 190, couleur, 2.8))
    o.append(fleche(180, 315, 470, 315, GRIS_58, 2.6))
    o.append(fleche(910, 315, 1200, 315, GRIS_58, 2.6))
    o.append(txt(180, 270, entree, TEXTE_MIN, ENCRE, graisse=700))
    o.append(txt(1200, 270, sortie, TEXTE_MIN, ENCRE, "end", 700))
    # SOUS LE CADRE, ET ASSEZ BAS. Le bas de la boite est a 410 ; la boite
    # d'un texte au plancher monte de 26,4 au-dessus de sa ligne de base, et
    # le crible y ajoute une garde de 8,25.
    o.append(txt(690, 455, "fixé", TEXTE_MIN, GRIS_58, "middle", 600))
    o.append(txt(690, 455 + LIGNE, fixe, TEXTE_MIN, GRIS_58, "middle"))
    return o


F11 = (LARGEUR, 560)


def f11_reseau_fonction(V: dict) -> str:
    o = _fonction("le réseau, vu comme une fonction",
                  f"{ent(V['entrees'])} nombres", f"{ent(V['K'])} nombres",
                  "θ", ENCRE, V)
    o.append(txt_indice(690, 335, "f", "θ", "", BASE_INDICE, ENCRE,
                        "middle", 700))
    return document(*F11, o)


F12 = (LARGEUR, 560)


def f12_cout_fonction(V: dict) -> str:
    o = _fonction("le coût, vu comme une fonction",
                  f"{ent(V['p'])} nombres", "1 nombre", "le jeu", BRIQUE, V)
    o.append(txt_indice(690, 335, "C", "D", "", BASE_INDICE, BRIQUE,
                        "middle", 700))
    return document(*F12, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 7 · l'escalier, la pente, la bille
# ═══════════════════════════════════════════════════════════════════════════

F13 = (LARGEUR, 640)


def f13_escalier_et_courbe(V: dict) -> str:
    o = panneau(60, 60, "a", "le taux d'erreur", 560)
    o += panneau(740, 60, "b", "le coût", 560)
    balayage = V["balayage"]
    ts = [t for t, _p, _e in balayage]
    gx_g = echelle(min(ts), max(ts), 120.0, 620.0)
    gx_d = echelle(min(ts), max(ts), 800.0, 1300.0)
    erreurs = [e for _t, _p, e in balayage]
    pertes = [p for _t, p, _e in balayage]
    gy_g = echelle(min(erreurs), max(erreurs), 500.0, 220.0)
    gy_d = echelle(min(pertes), max(pertes), 500.0, 220.0)

    o.append(polyligne([(gx_g(t), gy_g(e)) for t, _p, e in balayage], ENCRE,
                       3.2))
    o.append(polyligne([(gx_d(t), gy_d(p)) for t, p, _e in balayage], ENCRE,
                       3.2))
    for x0, x1 in ((100, 640), (780, 1320)):
        o.append(ligne(x0, 520, x1, 520, ENCRE, 2.4))
    o.append(txt(120, sous_axe(520), "un paramètre balayé", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(800, sous_axe(520), "le même paramètre", TEXTE_MIN, GRIS_58))
    o.append(cote(620, sous_axe(520, 1),
                  ent(V["balayage_valeurs"]) + " valeurs", BRIQUE, "end"))
    o.append(txt(1320, sous_axe(520, 1), "une infinité de valeurs", TEXTE_MIN,
                 GRIS_58, "end"))
    return document(*F13, o)


F14 = (LARGEUR, 680)


def f14_pente_sous_les_pieds(V: dict) -> str:
    """POSEE : une parabole, et la pente lue en un point."""
    o = entete(60, 60, "la pente dit de quel côté descendre", 700)
    gx = echelle(-3.0, 3.0, 180.0, 1200.0)
    gy = echelle(0.0, 9.5, 500.0, 180.0)
    o.append(polyligne([(gx(t), gy(t * t))
                        for t in [(-3.0 + 6.0 * i / 160) for i in range(161)]],
                       ENCRE, 3.4))
    o += axe_h(140, 1240, 520, [gx(0.0)], ["0"])
    for t, sens in ((-2.2, +1), (2.2, -1)):
        x, y = gx(t), gy(t * t)
        o.append(cercle(x, y, 11.0, BRIQUE))
        # La tangente, tracee sur une courte longueur de part et d'autre.
        dx = 0.8
        o.append(ligne(gx(t - dx), gy(t * t - 2 * t * dx), gx(t + dx),
                       gy(t * t + 2 * t * dx), BRIQUE, 2.8))
        o.append(fleche(x + sens * -60, y + 70, x + sens * 60, y + 70, BRIQUE,
                        2.8))
    # LES DEUX MENTIONS SOUS L'AXE, UN RANG PLUS BAS QUE LA GRADUATION. A
    # hauteur de courbe elles la traversaient, et ecrites en entier elles se
    # rejoignaient au milieu : la figure porte le geste, le texte le nomme.
    o.append(txt(150, sous_axe(520, 1), "on va à droite", TEXTE_MIN, GRIS_58))
    o.append(txt(1230, sous_axe(520, 1), "on va à gauche", TEXTE_MIN, GRIS_58,
                 "end"))
    return document(*F14, o)


F15 = (LARGEUR, 680)


def _paysage(t: float) -> float:
    """Le paysage a deux vallees, POSE par le cours. La vallee de gauche est
    moins profonde que celle de droite : c'est ce qui rend l'inertie d'une
    bille visible, et son absence dans la descente."""
    return 0.22 * (t ** 4) - 1.3 * (t ** 2) + 0.35 * t + 2.6


def f15_bille_et_descente(V: dict) -> str:
    o = panneau(60, 60, "a", "une bille a de l'inertie", 560)
    o += panneau(740, 60, "b", "la descente n'en a pas", 560)
    ts = [(-2.6 + 5.2 * i / 200) for i in range(201)]
    for x0, x1, arret in ((100.0, 640.0, +1.75), (780.0, 1320.0, -1.60)):
        gx = echelle(-2.6, 2.6, x0 + 30, x1 - 30)
        gy = echelle(0.0, 3.4, 540.0, 220.0)
        o.append(polyligne([(gx(t), gy(_paysage(t))) for t in ts], ENCRE, 3.4))
        o.append(cercle(gx(-2.35), gy(_paysage(-2.35)), 12.0, GRIS_40))
        o.append(cercle(gx(arret), gy(_paysage(arret)), 12.0, BRIQUE))
    o.append(txt(100, 600, "elle franchit le premier creux", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(780, 600, "elle s'arrête au premier", TEXTE_MIN, GRIS_58))
    return document(*F15, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 8 · cent directions, trois taux, la norme, la difference finie
# ═══════════════════════════════════════════════════════════════════════════

F16 = (LARGEUR, 560)


def f16_cent_directions(V: dict) -> str:
    o = entete(60, 60, "le gradient, et cent tirées au hasard", 760)
    h = V["hasard_directions"]
    echantillon = h["echantillon"]
    haut = max(V["directionnelle"], max(echantillon))
    # LA BARRE S'ARRETE AVANT LA COLONNE DES VALEURS. Portee jusqu'au bord,
    # elle passait sous le nombre qu'elle porte, et le crible signale un texte
    # a cheval sur un aplat.
    gx = echelle(0.0, haut * 1.05, 520.0, 1130.0)
    y = 200.0
    o.append(rect(520, y - 26, gx(V["directionnelle"]) - 520, 34, "none", 0,
                  BRIQUE))
    o.append(txt(60, y, "le gradient", TEXTE_MIN, BRIQUE, graisse=700))
    o.append(cote(1300, y, nb(V["directionnelle"], 4), BRIQUE, "end"))
    # DEUX BARRES, ET NON VINGT. Une direction tiree au hasard vaut deux
    # centiemes du gradient : vingt barres de cette longueur, empilees, ne
    # font pas vingt mesures, elles font une colonne pointillee que l'oeil
    # prend pour un defaut de trace. La comparaison qui porte l'idee tient en
    # deux barres -- le gradient, et la MEILLEURE des cent -- et les trois
    # nombres disent le reste.
    y += LIGNE * 1.6
    o.append(rect(520, y - 26, max(4.0, gx(h["max"]) - 520), 34, "none", 0,
                  GRIS_40))
    o.append(txt(60, y, "la meilleure des cent", TEXTE_MIN, GRIS_72,
                 graisse=700))
    o.append(cote(1300, y, nb(h["max"], 4), GRIS_72, "end"))
    y += LIGNE * 1.8
    o.append(txt(60, y, "ce qu'elle en atteint", TEXTE_MIN, GRIS_58))
    o.append(cote(1300, y, pourcent(h["max"] / V["directionnelle"], 1),
                  BRIQUE, "end"))
    y += LIGNE
    o.append(txt(60, y, "moyenne des cent", TEXTE_MIN, GRIS_58))
    o.append(cote(1300, y, nb(h["moyenne"], 4), GRIS_72, "end"))
    y += LIGNE
    o.append(txt(60, y, "combien dépassent", TEXTE_MIN, GRIS_58))
    o.append(cote(1300, y, f"{h['depassent']} sur {h['combien']}", ENCRE,
                  "end"))
    return document(*F16, o)


F17 = (LARGEUR, 680)


def f17_trois_taux(V: dict) -> str:
    """POSEE : la descente sur C(t) = t², ou le seuil se calcule a la main.
    Les trois taux sont ceux que la page mesure sur le reseau."""
    # LE POINT DE DEPART EST A 1,15 ET NON A 3. Sur C(t)=t², la suite vaut
    # (1−2η)ᵗ fois le depart : a η = 1,08 elle est multipliee par −1,16 a
    # chaque pas, et partie de 3 elle sortait du cadre des le PREMIER pas. Le
    # panneau « il remonte » ne montrait alors qu'un seul point, c'est-a-dire
    # rien. De 1,15, sept pas tiennent dans la bande et l'ecartement se voit.
    o = []
    largeur, depart, pas_max = 380.0, 1.15, 2.8
    for k, (lettre, eta, sujet) in enumerate(
            (("a", 1.08, "il remonte"), ("b", 0.35, "il descend"),
             ("c", 0.02, "il n'a pas fini"))):
        x0 = 60.0 + k * (largeur + 60)
        o += panneau(x0, 60, lettre, sujet, largeur)
        gx = echelle(-pas_max, pas_max, x0 + 20, x0 + largeur - 20)
        gy = echelle(0.0, pas_max * pas_max, 520.0, 210.0)
        o.append(polyligne(
            [(gx(t), gy(t * t))
             for t in [(-pas_max + 2 * pas_max * i / 140) for i in range(141)]],
            GRIS_40, 2.8))
        t, points = depart, [depart]
        for _ in range(7):
            t = t - eta * 2.0 * t
            points.append(t)
        trace = [(gx(u), gy(u * u)) for u in points if abs(u) <= pas_max]
        o.append(polyligne(trace, BRIQUE, 3.0))
        for a, b in trace:
            o.append(cercle(a, b, 7.0, BRIQUE))
        o.append(txt(x0 + 20, 560, "η = " + nb(eta, 2), TEXTE_MIN, ENCRE,
                     graisse=700))
    return document(*F17, o)


F18 = (LARGEUR, 640)


def f18_norme_du_gradient(V: dict) -> str:
    o = entete(60, 60, "le pas rétrécit tout seul", 700)
    journal = V["journal"]
    epoques = [t for t, *_ in journal]
    normes = [n for *_r, n in journal]
    gx = echelle(min(epoques), max(epoques), 220.0, 1240.0)
    gy = echelle(math.log10(max(min(normes), 1e-9)),
                 math.log10(max(normes)), 480.0, 200.0)
    o.append(polyligne([(gx(t), gy(math.log10(max(n, 1e-9))))
                        for t, *_r, n in journal], ENCRE, 3.4))
    marques = [min(epoques), max(epoques)]
    o += axe_h(180, 1290, 500, [gx(u) for u in marques],
               [str(int(u)) for u in marques])
    o.append(txt(180, sous_axe(500, 1), "époque", TEXTE_MIN, GRIS_58))
    o.append(cote(220, gy(math.log10(normes[0])) - 24, sci(normes[0], 2),
                  ENCRE))
    # LA VALEUR D'ARRIVEE SE POSE BIEN AU-DESSUS DE LA COURBE. Sous elle sa
    # boite traversait l'axe ; a vingt-quatre pixels, elle etait encore posee
    # sur la derniere descente.
    o.append(cote(1240, gy(math.log10(normes[-1])) - LIGNE * 2,
                  sci(normes[-1], 2), ENCRE, "end"))
    o.append(cote(1290, 200, "÷ " + ent(int(round(normes[0] / normes[-1]))),
                  BRIQUE, "end"))
    return document(*F18, o)


F19 = (LARGEUR, 660)


def f19_difference_finie(V: dict) -> str:
    """POSEE pour la courbe, MESUREE pour le compte : 2p propagations."""
    o = entete(60, 60, "deux évaluations pour une seule pente", 760)
    gx = echelle(-1.6, 1.6, 180.0, 900.0)
    gy = echelle(0.0, 3.0, 440.0, 180.0)

    def f(t):
        return 0.9 * t * t + 0.6

    o.append(polyligne([(gx(t), gy(f(t)))
                        for t in [(-1.6 + 3.2 * i / 120) for i in range(121)]],
                       ENCRE, 3.4))
    t0, eps = 0.75, 0.55
    for t in (t0 - eps, t0 + eps):
        o.append(cercle(gx(t), gy(f(t)), 10.0, BRIQUE))
        o.append(ligne(gx(t), gy(f(t)), gx(t), 440, GRIS_24, 1.6))
    o.append(ligne(gx(t0 - eps), gy(f(t0 - eps)), gx(t0 + eps),
                   gy(f(t0 + eps)), BRIQUE, 3.0))
    o += axe_h(150, 940, 460, [gx(t0 - eps), gx(t0 + eps)],
               ["θ − ε", "θ + ε"])
    o.append(txt(980, 220, "par composante", TEXTE_MIN, GRIS_58))
    o.append(cote(980, 220 + LIGNE, "2 × " + ent(V["p"])))
    o.append(cote(980, 220 + LIGNE * 2, ent(2 * V["p"]) + " propagations"))
    o.append(txt(980, 220 + LIGNE * 3.6, "au chapitre 4", TEXTE_MIN, GRIS_58))
    o.append(cote(980, 220 + LIGNE * 4.6, "1 propagation", ENCRE))
    return document(*F19, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 9 · le nuage des lots, et l'angle par taille
# ═══════════════════════════════════════════════════════════════════════════

F20 = (LARGEUR, 680)


def f20_nuage_des_lots(V: dict) -> str:
    """Chaque tirage est place par son ANGLE au gradient complet. Le rayon
    n'a pas de sens ici : c'est la direction qui decide du pas."""
    o = entete(60, 60, "trente tirages, cinq tailles de lot", 760)
    largeur = 248.0
    # LE RAYON TIENT DANS SON PANNEAU, AIGUILLE COMPRISE. A 108 plus 26 de
    # depassement, l'aiguille moyenne entrait dans l'eventail voisin, et les
    # trente ronds de six pixels se fondaient en un pate. Un rayon plus court,
    # des ronds plus petits, et un arc de guidage : on lit cinq eventails.
    for k, lot in enumerate(V["lots"]):
        x0 = 40.0 + k * largeur
        cx, cy, r = x0 + largeur / 2, 350.0, 86.0
        o.append(ligne(cx, cy, cx, cy - r - 16, GRIS_24, 2.0))
        arc = [(cx + (r + 8) * math.sin(a * math.pi / 180.0),
                cy - (r + 8) * math.cos(a * math.pi / 180.0))
               for a in range(0, 121, 4)]
        o.append(polyligne(arc, GRIS_14, 1.6))
        for cosinus in lot["cos"]:
            angle = math.acos(min(1.0, max(-1.0, cosinus)))
            o.append(cercle(cx + r * math.sin(angle), cy - r * math.cos(angle),
                            4.5, GRIS_58))
        moyen = math.acos(min(1.0, lot["moyenne"]))
        o.append(ligne(cx, cy, cx + (r + 16) * math.sin(moyen),
                       cy - (r + 16) * math.cos(moyen), BRIQUE, 3.2))
        o.append(cercle(cx, cy, 5.0, ENCRE))
        o.append(txt(cx, 520, "B = " + ent(lot["B"]), TEXTE_MIN, ENCRE,
                     "middle", 700))
        o.append(txt(cx, 520 + LIGNE, degres(lot["moyenne"]), TEXTE_MIN,
                     BRIQUE, "middle", 700))
    return document(*F20, o)


F21 = (LARGEUR, 620)


def f21_angle_par_taille(V: dict) -> str:
    o = entete(60, 60, "l'angle tombe, et le calcul monte", 760)
    lots = V["lots"]
    gx = echelle(0.0, math.log2(lots[-1]["B"]), 260.0, 1180.0)
    angles = [math.degrees(math.acos(min(1.0, l["moyenne"]))) for l in lots]
    base = 500.0
    gy = echelle(0.0, max(angles) * 1.06, base, 200.0)
    trace = [(gx(math.log2(l["B"])), gy(a)) for l, a in zip(lots, angles)]
    o.append(polyligne(trace, ENCRE, 3.4))
    # L'ANGLE SE POSE UN INTERLIGNE AU-DESSUS DE SON POINT. A vingt-quatre
    # pixels la courbe entrait dans sa boite : elle passe par le point, et sa
    # pente la ramene aussitôt dans la bande du texte.
    for (a, b), lot, angle in zip(trace, lots, angles):
        o.append(cercle(a, b, 9.0, ENCRE))
        o.append(txt(a, b - LIGNE, nb(angle, 1) + "°", TEXTE_MIN, BRIQUE,
                     "middle", 700))
    o += axe_h(220, 1240, base, [x for x, _y in trace],
               [ent(l["B"]) for l in lots])
    o.append(txt(220, base + LIGNE * 2, "images par pas", TEXTE_MIN, GRIS_58))
    return document(*F21, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 10 · les composantes rangees, et les zeros
# ═══════════════════════════════════════════════════════════════════════════

F22 = (LARGEUR, 660)


def f22_composantes_rangees(V: dict) -> str:
    o = entete(60, 60, "les composantes, rangées par taille", 760)
    cumul = V["cumul"]
    gx = echelle(0.0, 1.0, 220.0, 1200.0)
    base = 500.0
    gy = echelle(0.0, 1.0, base, 190.0)
    o.append(polyligne([(gx(f), gy(c)) for f, c in cumul], ENCRE, 3.4))
    for part, valeur in V["percentiles"]:
        o.append(ligne(gx(part), base, gx(part), gy(valeur), GRIS_24, 1.8))
        o.append(cercle(gx(part), gy(valeur), 9.0, BRIQUE))
    o += axe_h(180, 1250, base, [gx(p) for p, _v in V["percentiles"]],
               [pourcent(p, 0) for p, _v in V["percentiles"]])
    # LA COLONNE DES VALEURS DESCEND SOUS LA COURBE. La courbe cumulee atteint
    # un au bord droit, donc le coin haut droit lui appartient : une colonne
    # posee la se lisait par-dessus le trace.
    y = 330.0
    for part, valeur in V["percentiles"]:
        o.append(txt(1300, y, pourcent(valeur, 2), TEXTE_MIN, BRIQUE, "end",
                     700))
        y += LIGNE
    o.append(txt(180, sous_axe(base, 1), "des composantes", TEXTE_MIN,
                 GRIS_58))
    o.append(txt(1300, y, "de la somme", TEXTE_MIN, GRIS_58, "end"))
    return document(*F22, o)


F23 = (LARGEUR, 780)


def f23_dou_viennent_les_zeros(V: dict) -> str:
    """Les pixels muets, dessines a leur place dans la grille 28 x 28. Le
    texte dit combien ; la figure dit OU, et c'est elle qui montre que ce
    sont les bords."""
    z = V["zeros"]
    o = panneau(60, 60, "a", "sur l'échantillon", 520)
    o += panneau(740, 60, "b", "sur le jeu entier", 520)
    cote_case = 13.0
    for x0, grille, combien in ((120.0, z["grille"], z["muets"]),
                                (800.0, z["grille_complet"],
                                 z["muets_complet"])):
        y0 = 200.0
        o.append(rect(x0, y0, 28 * cote_case, 28 * cote_case, GRIS_40, 1.8))
        for rang, muet in enumerate(grille):
            if not muet:
                continue
            i, j = divmod(rang, 28)
            o.append(rect(x0 + j * cote_case, y0 + i * cote_case,
                          cote_case + 0.4, cote_case + 0.4, "none", 0, BRIQUE))
        o.append(cote(x0, y0 + 28 * cote_case + LIGNE,
                      f"{combien} sur {V['entrees']}"))
        o.append(txt(x0, y0 + 28 * cote_case + LIGNE * 2, "pixels muets",
                     TEXTE_MIN, GRIS_58))
    o.append(txt(800, 200 + 28 * cote_case + LIGNE * 3,
                 "× " + ent(V["H"]) + " neurones", TEXTE_MIN, GRIS_58))
    o.append(cote(1300, 200 + 28 * cote_case + LIGNE * 3,
                  ent(z["muets_complet"] * V["H"]), ENCRE, "end"))
    return document(*F23, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 11 · quatre points, la permutation, trois graines
# ═══════════════════════════════════════════════════════════════════════════

F24 = (LARGEUR, 620)


def f24_quatre_points(V: dict) -> str:
    """POSEE : quatre fonctions choisies pour que chacune porte un point
    critique d'une espece differente."""
    o = []
    largeur = 290.0
    formes = (
        ("a", "minimum global", lambda t: 0.45 * t * t, 0.0),
        ("b", "minimum local", lambda t: 0.09 * t ** 4 - 0.55 * t ** 2
         + 0.28 * t + 1.6, -1.85),
        ("c", "ni l'un ni l'autre", lambda t: 0.06 * t ** 3 + 1.5, 0.0),
        ("d", "point selle", None, 0.0),
    )
    for k, (lettre, sujet, f, t_marque) in enumerate(formes):
        x0 = 40.0 + k * (largeur + 45)
        o += panneau(x0, 60, lettre, sujet, largeur)
        gx = echelle(-2.8, 2.8, x0 + 20, x0 + largeur - 20)
        gy = echelle(0.0, 3.4, 460.0, 220.0)
        if f is None:
            # La selle : deux courbes croisees, l'une qui monte, l'autre qui
            # descend. C'est la coupe d'un col dans deux directions.
            #
            # LES DEUX BRAS S'ARRETENT A 2,2 ET NON A 2,8. Poussee jusqu'au
            # bord, la branche descendante sortait de la bande du graphe et
            # venait se poser sur l'etiquette du panneau.
            bras = [(-2.2 + 4.4 * i / 80) for i in range(81)]
            o.append(polyligne(
                [(gx(t), gy(1.7 + 0.30 * t * t)) for t in bras], ENCRE, 3.2))
            o.append(polyligne(
                [(gx(t), gy(1.7 - 0.30 * t * t)) for t in bras], ARDOISE, 3.2,
                "10 7"))
            o.append(cercle(gx(0.0), gy(1.7), 10.0, BRIQUE))
        else:
            o.append(polyligne(
                [(gx(t), gy(max(0.05, min(3.4, f(t))))) for t in
                 [(-2.8 + 5.6 * i / 120) for i in range(121)]], ENCRE, 3.2))
            o.append(cercle(gx(t_marque), gy(max(0.05, min(3.4, f(t_marque)))),
                            10.0, BRIQUE))
        o.append(txt(x0 + 20, 520, "pente nulle", TEXTE_MIN, GRIS_58))
    return document(*F24, o)


F25 = (LARGEUR, 660)


def f25_permuter(V: dict) -> str:
    o = panneau(60, 60, "a", "l'ordre des neurones cachés", 520)
    o += panneau(740, 60, "b", "le même, permuté", 520)
    ordre = (0, 1, 2, 3)
    permute = (2, 0, 3, 1)
    for x0, rangs, couleur in ((120.0, ordre, ENCRE),
                               (800.0, permute, BRIQUE)):
        for place, neurone in enumerate(rangs):
            y = 220.0 + place * 70
            o.append(cercle(x0 + 160, y, 20.0, PAPIER, couleur, 2.6))
            o.append(txt(x0 + 160, y + 12, str(neurone + 1), TEXTE_MIN,
                         couleur, "middle", 700))
            o.append(ligne(x0 + 40, 290, x0 + 138, y, GRIS_14, 1.4))
            o.append(ligne(x0 + 182, y, x0 + 280, 290, GRIS_14, 1.4))
        o.append(cercle(x0 + 30, 290, 16.0, PAPIER, GRIS_58, 2.2))
        o.append(cercle(x0 + 290, 290, 16.0, PAPIER, GRIS_58, 2.2))
    perm = V["permutation"]
    o.append(txt(120, 560, "coût", TEXTE_MIN, GRIS_58))
    o.append(cote(120, 560 + LIGNE, nb(perm["cout"], 8), ENCRE))
    o.append(txt(800, 560, "coût", TEXTE_MIN, GRIS_58))
    o.append(cote(800, 560 + LIGNE, nb(perm["cout_permute"], 8), BRIQUE))
    o.append(txt(1320, 560, "distance des deux θ", TEXTE_MIN, GRIS_58, "end"))
    o.append(cote(1320, 560 + LIGNE, nb(perm["distance"], 4), BRIQUE, "end"))
    return document(*F25, o)


F26 = (LARGEUR, 660)


def f26_trois_graines(V: dict) -> str:
    """Trois vecteurs traces a leurs angles MESURES les uns des autres. Le
    triangle n'est pas une illustration : ses trois angles sont ceux de la
    table."""
    o = entete(60, 60, "trois départs, trois arrivées", 620)
    # TROIS COUPLES, TROIS PANNEAUX, ET PAS UN SEUL DESSIN. Trois vecteurs
    # mutuellement a 88,8 degres n'existent pas dans un plan : les tracer d'un
    # seul tenant donnait un « T », ou deux des trois solutions paraissaient
    # OPPOSEES alors qu'elles sont perpendiculaires. Chaque couple est donc
    # dessine seul, a son angle mesure, et la figure ne ment plus.
    for k, (i, j, distance, cosinus) in enumerate(V["couples"]):
        cx, cy, r = 170.0 + k * 230.0, 400.0, 95.0
        angle = math.acos(min(1.0, max(-1.0, cosinus)))
        o.append(cercle(cx, cy, 6.0, GRIS_58))
        for signe in (-0.5, 0.5):
            a = signe * angle
            o.append(ligne(cx, cy, cx + r * math.sin(a), cy - r * math.cos(a),
                           ENCRE, 3.0))
            o.append(cercle(cx + r * math.sin(a), cy - r * math.cos(a), 10.0,
                            BRIQUE))
        o.append(txt(cx, cy + 62, f"{i} et {j}", TEXTE_MIN, ENCRE, "middle",
                     700))
        o.append(txt(cx, cy + 62 + LIGNE, degres(cosinus), TEXTE_MIN, BRIQUE,
                     "middle", 700))
    y = 200.0
    o.append(txt(820, y, "graine", TEXTE_MIN, GRIS_58))
    o.append(txt(1120, y, "précision", TEXTE_MIN, GRIS_58, "end"))
    o.append(txt(1320, y, "erreurs", TEXTE_MIN, GRIS_58, "end"))
    o.append(ligne(820, y + 16, 1320, y + 16, GRIS_24, 1.5, filet=True))
    y += LIGNE
    for graine, acc, erreurs, norme in V["trois"]:
        o.append(txt(820, y, str(graine), TEXTE_MIN, ENCRE, graisse=700))
        o.append(txt(1120, y, nb(acc, 4), TEXTE_MIN, GRIS_72, "end"))
        o.append(txt(1320, y, str(erreurs), TEXTE_MIN, GRIS_72, "end"))
        y += LIGNE
    # Les trois angles sont sous les trois panneaux : les redonner ici les
    # dirait deux fois sur la meme figure.
    y += LIGNE * 0.4
    o.append(txt(820, y, "normes des trois θ", TEXTE_MIN, GRIS_58))
    y += LIGNE
    for graine, acc, erreurs, norme in V["trois"]:
        o.append(txt(820, y, str(graine), TEXTE_MIN, ENCRE))
        o.append(txt(1320, y, nb(norme, 4), TEXTE_MIN, GRIS_72, "end"))
        y += LIGNE
    return document(*F26, o)


# ═══════════════════════════════════════════════════════════════════════════
# PAGE 12 · le compte, et le trajet
# ═══════════════════════════════════════════════════════════════════════════

F27 = (LARGEUR, 560)


def f27_deux_cent_mille_contre_un(V: dict) -> str:
    o = entete(60, 60, "propagations avant, pour un gradient", 760)
    cout_fini = 2 * V["p"]
    # LA BARRE TIENT DANS SA PROPRE BANDE. Portee de 340 a 1260 elle passait
    # sous les deux etiquettes qui l'encadrent, et un texte a cheval sur le
    # bord d'un aplat ne se lit pas : le fond change au milieu du mot.
    gx = echelle(0.0, cout_fini, 420.0, 1130.0)
    o.append(rect(420, 220, gx(cout_fini) - 420, 56, "none", 0, BRIQUE))
    o.append(txt(60, 258, "différences finies", TEXTE_MIN, BRIQUE,
                 graisse=700))
    o.append(cote(1300, 258, ent(cout_fini), BRIQUE, "end"))
    o.append(rect(420, 360, 4, 56, "none", 0, ENCRE))
    o.append(txt(60, 398, "au chapitre 4", TEXTE_MIN, ENCRE, graisse=700))
    o.append(cote(1300, 398, "1", ENCRE, "end"))
    # CE QUE LE RAPPORT COUTE, et c'est la seule chose que la page 8 dit en
    # prose sans la montrer : un entrainement entier, des deux cotes.
    o.append(txt(60, 398 + LIGNE * 1.8, "un entraînement entier", TEXTE_MIN,
                 GRIS_58))
    o.append(cote(1300, 398 + LIGNE * 1.8, "cinq années", BRIQUE, "end"))
    o.append(cote(1300, 398 + LIGNE * 2.8, "une minute", ENCRE, "end"))
    return document(*F27, o)


F28 = (LARGEUR, 640)


def f28_le_trajet(V: dict) -> str:
    o = entete(60, 60, "le coût, du hasard à la fin", 760)
    journal = V["journal"]
    depart = V["graines"][0][1]
    suite = [(float(t), Ltr) for t, Ltr, *_r in journal]
    gx = echelle(-1.0, suite[-1][0], 240.0, 1220.0)
    hi = math.log10(depart)
    lo = math.log10(max(suite[-1][1], 1e-9))
    gy = echelle(lo, hi, 470.0, 200.0)
    trace = [(gx(-1.0), gy(hi))] + [(gx(t), gy(math.log10(max(L, 1e-9))))
                                    for t, L in suite]
    o.append(polyligne(trace, ENCRE, 3.4))
    o.append(cercle(gx(-1.0), gy(hi), 11.0, BRIQUE))
    o.append(cercle(*trace[-1], 11.0, BRIQUE))
    o += axe_h(200, 1270, 490, [gx(-1.0), gx(suite[-1][0])],
               ["départ", "époque " + str(int(suite[-1][0]))])
    o.append(cote(240, gy(hi) - 24, nb(depart, 4), BRIQUE))
    o.append(cote(1220, gy(math.log10(max(suite[-1][1], 1e-9))) - 24,
                  nb(suite[-1][1], 4), BRIQUE, "end"))
    o.append(txt(200, 490 + LIGNE * 2, "échelle logarithmique", TEXTE_MIN,
                 GRIS_58))
    return document(*F28, o)


# ═══════════════════════════════════════════════════════════════════════════
# LA TABLE DES FIGURES
#
# Une ligne par figure : le nom du fichier, la fonction, ses dimensions, et la
# page qui la sert. La colonne « page » n'est pas decorative -- c'est elle qui
# permet de verifier qu'aucune page n'en porte moins de deux, ce que la regle
# 13 demande.
# ═══════════════════════════════════════════════════════════════════════════

SCHEMAS = {
    "l3-fig01-le-reseau-sans-ses-nombres.svg": (f01_reseau_sans_nombres, F01, 1),
    "l3-fig02-la-fleche-qui-manque.svg": (f02_la_fleche_qui_manque, F02, 1),
    "l3-fig03-deux-architectures.svg": (f03_deux_architectures, F03, 2),
    "l3-fig04-deux-matrices.svg": (f04_deux_matrices, F04, 2),
    "l3-fig05-deux-algorithmes.svg": (f05_deux_algorithmes, F05, 3),
    "l3-fig06-argmin-trois-cas.svg": (f06_argmin_trois_cas, F06, 3),
    "l3-fig07-cinq-graines.svg": (f07_cinq_graines, F07, 4),
    "l3-fig08-sortie-non-entrainee.svg": (f08_sortie_non_entrainee, F08, 4),
    "l3-fig09-deux-couts.svg": (f09_deux_couts, F09, 5),
    "l3-fig10-pente-des-deux-couts.svg": (f10_pente_des_deux_couts, F10, 5),
    "l3-fig11-le-reseau-est-une-fonction.svg": (f11_reseau_fonction, F11, 6),
    "l3-fig12-le-cout-est-une-fonction.svg": (f12_cout_fonction, F12, 6),
    # LA PAGE 7 OUVRE SUR LA PENTE, puis montre l'escalier avec la
    # proposition 1. Les noms suivent cet ordre.
    "l3-fig13-la-pente-sous-les-pieds.svg": (f14_pente_sous_les_pieds, F14, 7),
    "l3-fig14-escalier-et-courbe.svg": (f13_escalier_et_courbe, F13, 7),
    "l3-fig15-la-bille-et-la-descente.svg": (f15_bille_et_descente, F15, 7),
    # LA PAGE 8 SERT SES QUATRE FIGURES DANS CET ORDRE : les cent directions,
    # la norme qui retrecit, les trois taux, la difference finie. Les noms
    # suivent l'ordre de service, sans quoi l'export affiche un schema n°17
    # portant le fichier 18 et reciproquement.
    "l3-fig16-cent-directions.svg": (f16_cent_directions, F16, 8),
    "l3-fig17-la-norme-du-gradient.svg": (f18_norme_du_gradient, F18, 8),
    "l3-fig18-trois-taux.svg": (f17_trois_taux, F17, 8),
    "l3-fig19-la-difference-finie.svg": (f19_difference_finie, F19, 8),
    "l3-fig20-le-nuage-des-lots.svg": (f20_nuage_des_lots, F20, 9),
    "l3-fig21-langle-par-taille.svg": (f21_angle_par_taille, F21, 9),
    "l3-fig22-composantes-rangees.svg": (f22_composantes_rangees, F22, 10),
    "l3-fig23-dou-viennent-les-zeros.svg": (f23_dou_viennent_les_zeros, F23, 10),
    "l3-fig24-quatre-points.svg": (f24_quatre_points, F24, 11),
    "l3-fig25-permuter.svg": (f25_permuter, F25, 11),
    "l3-fig26-trois-graines.svg": (f26_trois_graines, F26, 11),
    # LES DEUX FIGURES DE LA PAGE 12 SONT NUMEROTEES DANS L'ORDRE OU LA PAGE
    # LES SERT : le trajet ouvre, le compte des propagations ferme. Nommees
    # dans l'autre sens, elles donnaient un export ou le schema n°27 portait le
    # fichier 28 et reciproquement.
    "l3-fig27-le-trajet.svg": (f28_le_trajet, F28, 12),
    "l3-fig28-deux-cent-mille-contre-un.svg": (f27_deux_cent_mille_contre_un,
                                               F27, 12),
}


# LE CONTROLE QUI MANQUAIT, ET CE QU'IL A ATTRAPE.
#
# `txt_indice` rend une CHAINE, la ou `entete`, `pile` et `axe_h` rendent une
# LISTE. Ecrit « o += txt_indice(...) », le sucre de Python etend la liste
# caractere par caractere, et le SVG sort avec un « < », un « t », un « e »
# sur trois lignes : le fichier est produit, il pese le bon poids, les deux
# cribles le lisent a la regex sans rien voir -- et le navigateur affiche une
# image cassee. Trois figures sur vingt-huit etaient dans cet etat.
#
# Un analyseur XML le dit en une ligne. Il tourne a chaque ecriture.
def _bien_forme(nom: str, contenu: str) -> None:
    import xml.etree.ElementTree as ET
    try:
        ET.fromstring(contenu)
    except ET.ParseError as e:
        raise ValueError(
            f"{nom} n'est pas un XML valide : {e}. La cause habituelle est "
            f"« o += » applique a une fonction qui rend une chaine ; il faut "
            f"« o.append(...) ».") from e


def ecrire(refaire: bool = False) -> None:
    debut = time.time()
    print("\n  Chapitre 3 : les vingt-huit figures fixes, en SVG.")
    V = mesurer(refaire)
    SORTIE.mkdir(parents=True, exist_ok=True)
    pages: dict[int, int] = {}
    for nom, (fabrique, (largeur, hauteur), page) in SCHEMAS.items():
        contenu = fabrique(V)
        _bien_forme(nom, contenu)
        (SORTIE / nom).write_text(contenu, encoding="utf-8")
        pages[page] = pages.get(page, 0) + 1
        print(f"  ✓ p{page:>2}  {nom:<44} {largeur} × {hauteur}"
              f"  {len(contenu.encode('utf-8')) / 1024:>5.0f} Ko")
    maigres = [p for p in range(1, 13) if pages.get(p, 0) < 2]
    print(f"\n  {len(SCHEMAS)} figures dans public/cours/lecon3, "
          f"sur {len(pages)} pages")
    if maigres:
        print(f"  ATTENTION regle 13 : moins de deux figures aux pages "
              f"{maigres}")
    print(f"  duree totale : {time.time() - debut:.1f} s")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ecrire("--refaire" in sys.argv)


if __name__ == "__main__":
    main()
