"""
Chapitre 5 : « Le calcul de la rétropropagation ». Toutes les mesures.

CE FICHIER EST LA SOURCE DE TOUS LES NOMBRES DU CHAPITRE. Aucune valeur n'est
écrite dans le contenu sans sortir d'ici.

    python cours/lecon5/mesures.py

DEUX RÉSEAUX, ET DEUX SEULEMENT.

    minuscule   1 -> 1 -> 1 -> 1, ReLU sur les deux couches cachées, sigmoïde
                en sortie, entropie croisée binaire. Sept valeurs figées, aucun
                tirage : c'est le réseau que le texte calcule à la main.

    profond     784 -> 64 -> 64 -> 64 -> 64 -> 10, ReLU ou sigmoïde sur les
                quatre couches cachées, softmax en sortie, entropie croisée.
                63 370 paramètres. Un troisième relevé le prolonge à huit
                couches cachées.

PROTOCOLE DU RÉSEAU PROFOND, repris des chapitres 2, 3 et 4 pour que les
nombres restent comparables :

    initialisation  He, N(0, 2/d_in) ; biais à zéro
    graine          0
    état            NON ENTRAÎNÉ
    exemple         la PREMIÈRE image de classe 2 du jeu d'entraînement,
                    désignée par un critère et jamais par un indice écrit à la
                    main ; le programme imprime l'indice qu'il trouve

LES DEUX ACTIVATIONS PARTAGENT LES MÊMES POIDS. Le relevé de la mesure 3 compare
ReLU et sigmoïde sur le même θ : la seule chose qui change d'un relevé à l'autre
est φ. Sans cela, l'écart mesuré mêlerait l'effet de l'activation et celui du
tirage.

VECTEURS COLONNES. Comme au chapitre 4, un seul exemple est suivi et le code est
écrit en colonnes :

    z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}    (d_l, d_{l-1})(d_{l-1},) -> (d_l,)

Il n'y a donc aucune transposition mentale à faire entre le texte et le code.
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# BLAS EST BRIDÉ AVANT L'IMPORT DE NUMPY. Les produits d'un seul exemple sont
# minuscules ; synchroniser douze fils coûte plus cher que la multiplication.
# La mesure 5 chronomètre l'algorithme, elle ne doit pas mesurer un
# ordonnanceur.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402

GRAINE = 0
CLASSE_TEMOIN = 2
LARGEURS = (784, 64, 64, 64, 64, 10)
LARGEURS_HUIT = (784,) + (64,) * 8 + (10,)
EPS = 1e-6
REPETITIONS = 300


def _console_utf8() -> None:
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, OSError):
            pass


def titre(texte: str) -> None:
    print()
    print("=" * 78)
    print(f"  {texte}")
    print("=" * 78)


def sous_titre(texte: str) -> None:
    print()
    print(f"  -- {texte} " + "-" * max(0, 70 - len(texte)))


# ── Le réseau minuscule : un neurone par couche ─────────────────────────────
#
# Trois poids, trois biais, une entrée, une cible. Tout est scalaire : la règle
# de la chaîne y est un produit de nombres, sans un seul indice.

MINUSCULE = {
    "x": 1.0,
    "w1": 0.8,
    "b1": 0.2,
    "w2": 1.5,
    "b2": -0.4,
    "w3": 2.0,
    "b3": -0.5,
    "y": 1.0,
}

CLES_MINUSCULE = ("w1", "b1", "w2", "b2", "w3", "b3")


def sigmoide(z: float) -> float:
    return 1.0 / (1.0 + np.exp(-z))


def relu_prime(z: float) -> float:
    """La convention du chapitre 2 : en zéro, la dérivée vaut zéro."""
    return 1.0 if z > 0.0 else 0.0


def avant_minuscule(p: dict) -> dict:
    z1 = p["w1"] * p["x"] + p["b1"]
    a1 = max(0.0, z1)
    z2 = p["w2"] * a1 + p["b2"]
    a2 = max(0.0, z2)
    z3 = p["w3"] * a2 + p["b3"]
    a3 = sigmoide(z3)
    perte = -(p["y"] * np.log(a3) + (1.0 - p["y"]) * np.log(1.0 - a3))
    return {"z1": z1, "a1": a1, "z2": z2, "a2": a2, "z3": z3, "a3": a3,
            "perte": float(perte)}


def arriere_minuscule(p: dict, c: dict) -> dict:
    """La récurrence, écrite exactement comme la proposition 4."""
    d3 = c["a3"] - p["y"]
    dw3, db3 = d3 * c["a2"], d3
    da2 = d3 * p["w3"]
    d2 = da2 * relu_prime(c["z2"])
    dw2, db2 = d2 * c["a1"], d2
    da1 = d2 * p["w2"]
    d1 = da1 * relu_prime(c["z1"])
    dw1, db1 = d1 * p["x"], d1
    return {"d3": d3, "d2": d2, "d1": d1, "da2": da2, "da1": da1,
            "w3": dw3, "b3": db3, "w2": dw2, "b2": db2, "w1": dw1, "b1": db1}


def produit_deroule(p: dict, c: dict) -> float:
    """Le corollaire de la proposition 4, écrit comme un produit, pas comme
    une récurrence : c'est le même calcul, organisé autrement."""
    return ((c["a3"] - p["y"])
            * p["w3"] * relu_prime(c["z2"])
            * p["w2"] * relu_prime(c["z1"])
            * p["x"])


def mesure_1() -> dict:
    titre("MESURE 1 · LA CHAÎNE À LA MAIN, RÉSEAU 1-1-1-1")

    p = dict(MINUSCULE)
    c = avant_minuscule(p)
    g = arriere_minuscule(p, c)

    sous_titre("les valeurs figées")
    print(f"  x  = {p['x']:.6f}   y  = {p['y']:.0f}")
    print(f"  w1 = {p['w1']:.6f}   b1 = {p['b1']:.6f}")
    print(f"  w2 = {p['w2']:.6f}   b2 = {p['b2']:.6f}")
    print(f"  w3 = {p['w3']:.6f}   b3 = {p['b3']:.6f}")

    sous_titre("la propagation avant")
    print(f"  z1 = {c['z1']:.6f}   a1 = {c['a1']:.6f}")
    print(f"  z2 = {c['z2']:.6f}   a2 = {c['a2']:.6f}")
    print(f"  z3 = {c['z3']:.6f}   a3 = {c['a3']:.6f}")
    print(f"  perte = {c['perte']:.6f}")

    sous_titre("les trois dérivées constitutives, dernière couche")
    dz_dw = c["a2"]
    da_dz = c["a3"] * (1.0 - c["a3"])
    dl_da = (c["a3"] - p["y"]) / da_dz
    print(f"  dz3/dw3 = a2                = {dz_dw:.6f}")
    print(f"  da3/dz3 = a3 (1 - a3)       = {da_dz:.6f}")
    print(f"  dl/da3  = (a3 - y)/a3(1-a3) = {dl_da:.6f}")
    print(f"  produit des trois           = {dl_da * da_dz * dz_dw:.6f}")
    print(f"  court-circuit : dl/dz3      = {c['a3'] - p['y']:.6f}")

    sous_titre("la passe arrière, couche par couche")
    print(f"  delta3 = a3 - y            = {g['d3']:.6f}")
    print(f"  dl/dw3 = delta3 . a2       = {g['w3']:.6f}")
    print(f"  dl/db3 = delta3            = {g['b3']:.6f}")
    print(f"  dl/da2 = delta3 . w3       = {g['da2']:.6f}")
    print(f"  delta2 = dl/da2 . phi'(z2) = {g['d2']:.6f}")
    print(f"  dl/dw2 = delta2 . a1       = {g['w2']:.6f}")
    print(f"  dl/db2 = delta2            = {g['b2']:.6f}")
    print(f"  dl/da1 = delta2 . w2       = {g['da1']:.6f}")
    print(f"  delta1 = dl/da1 . phi'(z1) = {g['d1']:.6f}")
    print(f"  dl/dw1 = delta1 . x        = {g['w1']:.6f}")
    print(f"  dl/db1 = delta1            = {g['b1']:.6f}")

    sous_titre("le corollaire : la récurrence contre le produit déroulé")
    deroule = produit_deroule(p, c)
    print("  (a3 - y) . w3 . phi'(z2) . w2 . phi'(z1) . x")
    print(f"  produit deroule   {deroule:.6f}")
    print(f"  recurrence        {g['w1']:.6f}")
    print(f"  ecart             {abs(deroule - g['w1']):.3e}")

    return {"p": p, "c": c, "g": g, "deroule": deroule}


def plancher(valeur_perte: float) -> float:
    """LE PLANCHER DES DIFFÉRENCES FINIES CENTRÉES.

    La perte est calculée à la précision de la machine près, soit une erreur
    absolue de l'ordre de eps_machine x |perte|. La différence finie divise
    l'écart de deux telles valeurs par 2h : l'erreur d'arrondi est donc
    amplifiée par 1/(2h), et le résultat porte une erreur ABSOLUE d'au moins

        eps_machine x |perte| / (2h)

    Ce plancher ne dépend NI du coefficient NI du bloc. L'erreur RELATIVE,
    elle, est ce plancher divisé par la dérivée : elle paraît grande là où la
    dérivée est petite, sans qu'aucun calcul ne soit faux.
    """
    return float(np.finfo(float).eps) * abs(valeur_perte) / (2.0 * EPS)


def mesure_2(m1: dict) -> None:
    titre("MESURE 2 · VÉRIFICATION DU RÉSEAU MINUSCULE, DIFFÉRENCES FINIES")

    p, g, c = m1["p"], m1["g"], m1["c"]
    sol = plancher(c["perte"])
    print(f"  differences finies centrees, h = {EPS:.0e}")
    print(f"  plancher d'erreur ABSOLUE  eps_machine x |perte| / 2h"
          f"  =  {sol:.2e}")
    print("  il ne depend ni du coefficient ni du bloc")
    print()
    print("  coefficient   analytique        finies            ecart absolu"
          "   ecart / plancher")
    for cle in CLES_MINUSCULE:
        haut, bas = dict(p), dict(p)
        haut[cle] = p[cle] + EPS
        bas[cle] = p[cle] - EPS
        finies = (avant_minuscule(haut)["perte"]
                  - avant_minuscule(bas)["perte"]) / (2.0 * EPS)
        analytique = g[cle]
        ecart = abs(finies - analytique)
        print(f"  {cle:<12}  {analytique:+.9f}      {finies:+.9f}"
              f"      {ecart:.2e}"
              f"        {ecart / sol:6.2f}")
    print()
    print("  les six coefficients du reseau, tous verifies")
    print("  aucun ecart ne depasse quelques fois le plancher")


# ── Le réseau profond : L couches, une activation quelconque ────────────────


def init(largeurs: tuple[int, ...], graine: int = GRAINE) -> list[dict]:
    """He, N(0, 2/d_in), biais nuls. Une couche = un dictionnaire {W, b}."""
    rng = np.random.default_rng(graine)
    couches = []
    for entree, sortie in zip(largeurs[:-1], largeurs[1:]):
        couches.append({
            "W": rng.normal(0.0, np.sqrt(2.0 / entree), size=(sortie, entree)),
            "b": np.zeros(sortie),
        })
    return couches


def phi(z: np.ndarray, nom: str) -> np.ndarray:
    if nom == "relu":
        return np.maximum(0.0, z)
    return 1.0 / (1.0 + np.exp(-z))


def phi_prime(z: np.ndarray, nom: str) -> np.ndarray:
    if nom == "relu":
        return (z > 0.0).astype(np.float64)
    s = 1.0 / (1.0 + np.exp(-z))
    return s * (1.0 - s)


def softmax(z: np.ndarray) -> np.ndarray:
    e = np.exp(z - z.max())
    return e / e.sum()


def avant(theta: list[dict], x: np.ndarray, nom: str) -> dict:
    a = x
    zs, as_ = [], [x]
    for indice, couche in enumerate(theta):
        z = couche["W"] @ a + couche["b"]
        a = softmax(z) if indice == len(theta) - 1 else phi(z, nom)
        zs.append(z)
        as_.append(a)
    return {"z": zs, "a": as_}


def perte(cache: dict, classe: int) -> float:
    return float(-np.log(cache["a"][-1][classe] + 1e-300))


def arriere(theta: list[dict], cache: dict, classe: int, nom: str) -> dict:
    """La proposition 6, telle quelle : Hadamard, transposée, produit
    extérieur."""
    L = len(theta)
    y = np.zeros(theta[-1]["b"].size)
    y[classe] = 1.0

    deltas: list[np.ndarray | None] = [None] * L
    deltas[L - 1] = cache["a"][-1] - y
    for l in range(L - 2, -1, -1):
        remonte = theta[l + 1]["W"].T @ deltas[l + 1]
        deltas[l] = remonte * phi_prime(cache["z"][l], nom)

    grads = []
    for l in range(L):
        grads.append({
            "W": np.outer(deltas[l], cache["a"][l]),
            "b": deltas[l],
        })
    return {"deltas": deltas, "grads": grads}


def nb_parametres(theta: list[dict]) -> int:
    return sum(c["W"].size + c["b"].size for c in theta)


def temoin(X: np.ndarray, c: np.ndarray) -> tuple[int, np.ndarray, int]:
    indice = int(np.flatnonzero(c == CLASSE_TEMOIN)[0])
    return indice, X[indice], int(c[indice])


def mesure_3(x: np.ndarray, classe: int) -> dict:
    titre("MESURE 3 · LA PROFONDEUR, NORME DU SIGNAL D'ERREUR PAR COUCHE")

    resultats: dict[str, dict] = {}
    for largeurs, etiquette in ((LARGEURS, "quatre couches cachees"),
                                (LARGEURS_HUIT, "huit couches cachees")):
        theta = init(largeurs)
        L = len(theta)
        sous_titre(f"{etiquette} · {' -> '.join(str(d) for d in largeurs)}")
        for nom in ("relu", "sigmoide"):
            cache = avant(theta, x, nom)
            dos = arriere(theta, cache, classe, nom)
            normes = [float(np.linalg.norm(d)) for d in dos["deltas"]]
            rapport = normes[-1] / normes[0]
            print(f"    {nom:<9} perte {perte(cache, classe):.4f}")
            ligne = "      " + "  ".join(
                f"l={l + 1} : {n:.4g}" for l, n in enumerate(normes)
            )
            print(ligne)
            traversees = L - 1
            par_traversee = rapport ** (1.0 / traversees)
            print(f"      rapport sortie / premiere couche : {rapport:.1f}"
                  f"   sur {traversees} traversees")
            print(f"      attenuation moyenne par traversee : {par_traversee:.2f}"
                  f"   (pire cas annonce par phi' <= 1/4 : 4)")
            resultats[f"{etiquette}|{nom}"] = {
                "normes": normes, "rapport": rapport, "L": L,
                "par_traversee": par_traversee,
                "perte": perte(cache, classe),
            }
    return resultats


def gradient_finies(theta: list[dict], x: np.ndarray, classe: int,
                    nom: str) -> tuple[list[dict], float]:
    """Le gradient entier par différences finies centrées. Deux propagations
    avant par coefficient, et rien d'autre : c'est le procédé du chapitre 3."""
    depart = time.perf_counter()
    sortie = []
    for couche in theta:
        bloc = {}
        for cle in ("W", "b"):
            table = couche[cle]
            approx = np.empty_like(table)
            plat = table.reshape(-1)
            plat_approx = approx.reshape(-1)
            for k in range(plat.size):
                garde = plat[k]
                plat[k] = garde + EPS
                haut = perte(avant(theta, x, nom), classe)
                plat[k] = garde - EPS
                bas = perte(avant(theta, x, nom), classe)
                plat[k] = garde
                plat_approx[k] = (haut - bas) / (2.0 * EPS)
            bloc[cle] = approx
        sortie.append(bloc)
    return sortie, time.perf_counter() - depart


def ecart_relatif(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Le contrôle usuel : l'écart rapporté au plus grand des deux modules.
    Deux coefficients nuls donnent zéro, pas une division par zéro."""
    denom = np.maximum(np.maximum(np.abs(a), np.abs(b)), 1e-12)
    return np.abs(a - b) / denom


def mesure_4(x: np.ndarray, classe: int) -> dict:
    titre("MESURE 4 · VÉRIFICATION DU RÉSEAU PROFOND, BLOC PAR BLOC")

    theta = init(LARGEURS)
    print(f"  reseau {' -> '.join(str(d) for d in LARGEURS)}"
          f", {nb_parametres(theta)} parametres")
    print(f"  differences finies centrees, h = {EPS:.0e}")
    print("  TOUS les coefficients de chaque bloc sont controles, pas un"
          " echantillon")
    print()
    print("  DEUX COLONNES D'ECART, ET LA SECONDE EST RESTREINTE.")
    print("  L'ecart ABSOLU se lit sur tous les coefficients : il est"
          " plancherie")
    print("  par eps_machine x |perte| / 2h, valeur imprimee ci-dessous.")
    print("  L'ecart RELATIF n'est lu que sur les coefficients dont la"
          " derivee")
    print("  analytique depasse 100 fois ce plancher. Ailleurs il divise par"
          " un")
    print("  nombre plus petit que l'erreur d'arrondi, et ne mesure plus"
          " rien.")

    duree: dict[str, float] = {}
    releve: dict[str, dict] = {}
    for nom in ("relu", "sigmoide"):
        cache = avant(theta, x, nom)
        dos = arriere(theta, cache, classe, nom)
        sol = plancher(perte(cache, classe))
        seuil = 100.0 * sol
        approx, secondes = gradient_finies(theta, x, classe, nom)
        duree[nom] = secondes

        sous_titre(f"{nom} · gradient entier par differences finies"
                   f" en {secondes:.2f} s")
        print(f"    perte {perte(cache, classe):.4f}"
              f"   plancher absolu {sol:.2e}"
              f"   seuil de lecture {seuil:.2e}")
        print("    bloc      coeff.   ecart absolu med.  max."
              "      retenus  ecart relatif med.  max.")
        pire_absolu, pire_relatif = 0.0, 0.0
        for l, (bloc_a, bloc_f) in enumerate(zip(dos["grads"], approx), start=1):
            for cle in ("W", "b"):
                analytique = bloc_a[cle]
                absolu = np.abs(analytique - bloc_f[cle])
                garde = np.abs(analytique) > seuil
                if garde.any():
                    relatif = ecart_relatif(analytique[garde], bloc_f[cle][garde])
                    med_r = f"{float(np.median(relatif)):.2e}"
                    max_r = f"{float(relatif.max()):.2e}"
                    pire_relatif = max(pire_relatif, float(relatif.max()))
                else:
                    med_r, max_r = "     —  ", "     —  "
                pire_absolu = max(pire_absolu, float(absolu.max()))
                print(f"    {cle}^[{l}]{'':<4}{analytique.size:>7}"
                      f"      {float(np.median(absolu)):.2e}"
                      f"  {float(absolu.max()):.2e}"
                      f"   {int(garde.sum()):>7}"
                      f"        {med_r}  {max_r}")
        print(f"    sur les {nb_parametres(theta)} coefficients :"
              f" ecart absolu maximal {pire_absolu:.2e}"
              f"  ({pire_absolu / sol:.1f} fois le plancher)")
        print(f"    ecart relatif maximal sur les coefficients retenus :"
              f" {pire_relatif:.2e}")
        releve[nom] = {"plancher": sol, "seuil": seuil,
                       "absolu_max": pire_absolu, "relatif_max": pire_relatif}

    return {"duree": duree, "theta": theta, "releve": releve}


def multiplications(largeurs: tuple[int, ...]) -> dict:
    """Le compte exact des multiplications, celui que majore la proposition 7.

    avant     un produit matrice-vecteur par couche
    arriere   un produit (W^[l+1])^T delta^[l+1] par couche interne, plus un
              produit exterieur delta^[l] (a^[l-1])^T par couche
    """
    par_couche = [entree * sortie
                  for entree, sortie in zip(largeurs[:-1], largeurs[1:])]
    av = sum(par_couche)
    remontees = sum(par_couche[1:])
    exterieurs = sum(par_couche)
    return {"avant": av, "remontees": remontees, "exterieurs": exterieurs,
            "arriere": remontees + exterieurs,
            "total": av + remontees + exterieurs,
            "rapport": (av + remontees + exterieurs) / av}


def _chronometre(action, repetitions: int, lots: int = 5) -> float:
    """Le minimum de plusieurs lots. Une moyenne mesure aussi ce que la machine
    faisait d'autre ; le minimum mesure l'algorithme."""
    for _ in range(20):
        action()
    meilleur = float("inf")
    for _ in range(lots):
        depart = time.perf_counter()
        for _ in range(repetitions):
            action()
        meilleur = min(meilleur, (time.perf_counter() - depart) / repetitions)
    return meilleur


def mesure_5(theta: list[dict], x: np.ndarray, classe: int,
             duree_finies: float) -> dict:
    titre("MESURE 5 · LE COÛT DE L'ALGORITHME")

    p = nb_parametres(theta)
    compte = multiplications(LARGEURS)
    print(f"  reseau {' -> '.join(str(d) for d in LARGEURS)}, {p} parametres")
    print()
    print("  LE COUT EST COMPTE EN MULTIPLICATIONS, PAS EN SECONDES. Une duree")
    print("  d'horloge varie d'un facteur dix selon la charge de la machine ;")
    print("  un compte d'operations ne depend d'aucune machine, et c'est lui")
    print("  que la proposition 7 majore.")

    sous_titre("le compte des multiplications")
    print(f"    passe avant                        {compte['avant']:9d}")
    print(f"    remontees (W^T delta)              {compte['remontees']:9d}")
    print(f"    produits exterieurs                {compte['exterieurs']:9d}")
    print(f"    passe arriere                      {compte['arriere']:9d}")
    print(f"    total avant + arriere              {compte['total']:9d}")
    print(f"    rapport a la passe avant seule        {compte['rapport']:6.2f}")
    print(f"    majorant de la proposition 7            3,00")

    sous_titre("les differences finies, comptees de la meme facon")
    couteux = 2 * p * compte["avant"]
    print(f"    {p} coefficients a deux propagations avant chacun")
    print(f"    soit                               {2 * p:9d} propagations avant")
    print(f"    multiplications                {couteux:13d}")
    print(f"    rapport a la retropropagation      {couteux / compte['total']:9.0f}")

    params_2 = 784 * 128 + 128 + 128 * 10 + 10
    compte_2 = multiplications((784, 128, 10))
    couteux_2 = 2 * params_2 * compte_2["avant"]
    print()
    print(f"    le meme rapport sur le reseau du chapitre 2,"
          f" {params_2} parametres :")
    print(f"    rapport                            {couteux_2 / compte_2['total']:9.0f}")
    print("    il croit proportionnellement au nombre de parametres")

    def _avant() -> None:
        avant(theta, x, "relu")

    def _aller_retour() -> None:
        cache = avant(theta, x, "relu")
        arriere(theta, cache, classe, "relu")

    t_avant = _chronometre(_avant, REPETITIONS)
    t_total = _chronometre(_aller_retour, REPETITIONS)

    sous_titre(f"les durees, minimum de 5 lots de {REPETITIONS} — ELLES VARIENT")
    print(f"    une propagation avant              {t_avant * 1e6:9.1f} microsecondes")
    print(f"    avant plus arriere                 {t_total * 1e6:9.1f} microsecondes")
    print(f"    rapport                            {t_total / t_avant:9.2f}")
    print(f"    gradient entier par differences finies"
          f"  {duree_finies * 1e3:.0f} millisecondes")
    print("    ces quatre lignes changent d'une execution a l'autre ; les")
    print("    comptes de multiplications, non")

    return {"t_avant": t_avant, "t_total": t_total,
            "rapport": t_total / t_avant,
            "finies": duree_finies, "compte": compte,
            "rapport_compte": couteux / compte["total"],
            "rapport_compte_2": couteux_2 / compte_2["total"],
            "p": p}


def jacobienne_finies(fonction, z: np.ndarray, indices: np.ndarray) -> np.ndarray:
    """La matrice des d f_i / d z_j, calculée coefficient par coefficient."""
    n = indices.size
    J = np.empty((n, n))
    for colonne, j in enumerate(indices):
        haut, bas = z.copy(), z.copy()
        haut[j] += EPS
        bas[j] -= EPS
        derivee = (fonction(haut) - fonction(bas)) / (2.0 * EPS)
        J[:, colonne] = derivee[indices]
    return J


def hors_diagonale(J: np.ndarray) -> tuple[int, float]:
    masque = ~np.eye(J.shape[0], dtype=bool)
    dehors = J[masque]
    return int(np.count_nonzero(dehors)), float(np.abs(dehors).max())


def mesure_6(theta: list[dict], x: np.ndarray) -> dict:
    titre("MESURE 6 · LA JACOBIENNE D'UNE COUCHE CACHÉE EST-ELLE DIAGONALE ?")

    indices = np.arange(20)
    resultats = {}
    for nom in ("relu", "sigmoide"):
        cache = avant(theta, x, nom)
        z = cache["z"][2]
        J = jacobienne_finies(lambda u: phi(u, nom), z, indices)
        compte, maximum = hors_diagonale(J)
        diagonale = np.diag(J)
        resultats[nom] = {"compte": compte, "max": maximum}
        sous_titre(f"{nom} · couche cachee 3, indices 1 a 20")
        print(f"    coefficients hors diagonale       {J.size - 20}")
        print(f"    hors diagonale non nuls           {compte}")
        print(f"    module maximal hors diagonale     {maximum:.3e}")
        print(f"    module minimal sur la diagonale   {np.abs(diagonale).min():.3e}")
    print()
    print("  la proposition 6 annonce zero et zero")
    return resultats


def mesure_7(theta: list[dict], x: np.ndarray) -> dict:
    titre("MESURE 7 · LA JACOBIENNE DU SOFTMAX N'EST PAS DIAGONALE")

    indices = np.arange(10)
    cache = avant(theta, x, "relu")
    z = cache["z"][-1]
    J = jacobienne_finies(softmax, z, indices)
    compte, maximum = hors_diagonale(J)
    print("    couche de sortie, les 10 indices")
    print(f"    coefficients hors diagonale       {J.size - 10}")
    print(f"    hors diagonale non nuls           {compte}")
    print(f"    module maximal hors diagonale     {maximum:.3e}")
    print(f"    somme de chaque colonne           {float(np.abs(J.sum(axis=0)).max()):.3e}")
    print()
    print("  c'est le contre-exemple : le softmax melange les composantes")
    return {"compte": compte, "max": maximum, "hors": J.size - 10}


def main() -> None:
    _console_utf8()
    depart = time.perf_counter()

    print("Chapitre 5 · Le calcul de la retropropagation · toutes les mesures")
    print("  minuscule   1 -> 1 -> 1 -> 1, ReLU puis sigmoide, entropie"
          " croisee binaire")
    print(f"  profond     {' -> '.join(str(d) for d in LARGEURS)}, softmax,"
          " entropie croisee")
    print(f"  init        He, N(0, 2/d_in), biais nuls, graine {GRAINE}")
    print("  etat        NON ENTRAINE")

    m1 = mesure_1()
    mesure_2(m1)

    X, c, _, _ = D.charger()
    indice, x, classe = temoin(X, c)
    print()
    print(f"  exemple temoin  premiere image de classe {CLASSE_TEMOIN},"
          f" indice {indice}")

    mesure_3(x, classe)
    m4 = mesure_4(x, classe)
    mesure_5(m4["theta"], x, classe, m4["duree"]["relu"])
    mesure_6(m4["theta"], x)
    mesure_7(m4["theta"], x)

    titre("FIN")
    print(f"  duree totale  {time.perf_counter() - depart:.1f} s")


if __name__ == "__main__":
    main()
