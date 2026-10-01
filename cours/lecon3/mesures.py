"""
Chapitre 3 : « La descente de gradient, comment un réseau apprend ». Toutes les
mesures.

CE FICHIER EST LA SOURCE DE TOUS LES NOMBRES DU CHAPITRE. Aucune valeur n'est
écrite dans le contenu sans sortir d'ici.

    python cours/lecon3/mesures.py

PROTOCOLE, identique à celui du chapitre 2 pour que les nombres soient
comparables :

    réseau        784 -> 128 -> 10, ReLU, softmax en sortie
    perte         entropie croisée
    initialisation  He, N(0, 2/d_in) ; biais à zéro
    lots          64, tirage sans remise, une permutation neuve par époque
    eta           0,5
    epoques       30
    graine        0 pour l'initialisation ET pour les permutations

CE QUE CE PROGRAMME UTILISE ET QUE LE CHAPITRE N'EXPLIQUE PAS. Le gradient est
obtenu ici par l'algorithme du chapitre 4. C'est un OUTIL : le chapitre 3 s'en
sert pour entraîner et pour mesurer, il ne l'écrit pas et ne le dérive pas. Les
mesures 8 et 9, elles, calculent des gradients par DIFFÉRENCES FINIES CENTRÉES,
qui ne demandent que des propagations avant — et la mesure 9 chiffre pourquoi ce
procédé, correct, est inutilisable pour entraîner.
"""

from __future__ import annotations

import math
import os
import sys
import time
from pathlib import Path

# BLAS EST BRIDÉ AVANT L'IMPORT DE NUMPY. Les matrices d'un mini-lot sont
# minuscules, (64, 784) par (784, 128) : la synchronisation de douze fils coûte
# plus cher que la multiplication elle-même.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402

GRAINE = 0
B_LOT = 64
ETA = 0.5
EPOQUES = 30
K = 10
H = 128


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


# ── Le réseau ───────────────────────────────────────────────────────────────


def softmax(Z: np.ndarray) -> np.ndarray:
    Z = Z - Z.max(axis=1, keepdims=True)
    E = np.exp(Z)
    return E / E.sum(axis=1, keepdims=True)


def onehot(c: np.ndarray) -> np.ndarray:
    Y = np.zeros((len(c), K))
    Y[np.arange(len(c)), c] = 1.0
    return Y


def init(tailles: tuple[int, ...], graine: int) -> dict:
    rng = np.random.default_rng(graine)
    theta = {}
    for couche in range(1, len(tailles)):
        d_in, d_out = tailles[couche - 1], tailles[couche]
        theta[f"W{couche}"] = rng.normal(0.0, np.sqrt(2.0 / d_in), size=(d_out, d_in))
        theta[f"b{couche}"] = np.zeros(d_out)
    return theta


def avant(theta: dict, X: np.ndarray) -> dict:
    L = len(theta) // 2
    cache = {"A0": X}
    A = X
    for couche in range(1, L + 1):
        Z = A @ theta[f"W{couche}"].T + theta[f"b{couche}"]
        A = softmax(Z) if couche == L else np.maximum(Z, 0.0)
        cache[f"Z{couche}"] = Z
        cache[f"A{couche}"] = A
    return cache


def arriere(theta: dict, cache: dict, Y: np.ndarray) -> dict:
    """
    L'algorithme du CHAPITRE 4, employé ici comme outil. Le chapitre 3 ne
    l'écrit pas et ne s'en sert jamais pour justifier quoi que ce soit : il
    s'en sert pour obtenir des poids et pour mesurer.
    """
    L = len(theta) // 2
    B = len(Y)
    grads = {}
    Dt = (cache[f"A{L}"] - Y) / B
    for couche in range(L, 0, -1):
        grads[f"W{couche}"] = Dt.T @ cache[f"A{couche - 1}"]
        grads[f"b{couche}"] = Dt.sum(axis=0)
        if couche > 1:
            Dt = (Dt @ theta[f"W{couche}"]) * (cache[f"Z{couche - 1}"] > 0)
    return grads


def cout(theta: dict, X: np.ndarray, c: np.ndarray, morceau: int = 4000) -> float:
    """C_D(theta) : l'entropie croisée moyenne. Une fonction de theta SEUL."""
    total = 0.0
    L = len(theta) // 2
    for d in range(0, len(X), morceau):
        A = avant(theta, X[d:d + morceau])[f"A{L}"]
        Y = onehot(c[d:d + morceau])
        total += float(-np.sum(Y * np.log(np.clip(A, 1e-15, None))))
    return total / len(X)


def evaluer(theta: dict, X: np.ndarray, c: np.ndarray,
            morceau: int = 4000) -> tuple[float, float]:
    total, justes = 0.0, 0
    L = len(theta) // 2
    for d in range(0, len(X), morceau):
        A = avant(theta, X[d:d + morceau])[f"A{L}"]
        cb = c[d:d + morceau]
        total += float(-np.sum(onehot(cb) * np.log(np.clip(A, 1e-15, None))))
        justes += int((A.argmax(axis=1) == cb).sum())
    return total / len(X), justes / len(X)


def plat(theta: dict) -> np.ndarray:
    """vec appliqué à chaque bloc, mis bout à bout : theta vu dans R^p."""
    return np.concatenate([theta[cle].reshape(-1) for cle in sorted(theta)])


def deplat(theta: dict, v: np.ndarray) -> dict:
    """L'opération inverse, à structure donnée."""
    neuf, d = {}, 0
    for cle in sorted(theta):
        taille = theta[cle].size
        neuf[cle] = v[d:d + taille].reshape(theta[cle].shape).copy()
        d += taille
    return neuf


def entrainer(tailles, graine, eta, epoques, Xtr, ctr, Xte, cte,
              trace: bool = False, normes: bool = False) -> dict:
    theta = init(tailles, graine)
    Ytr = onehot(ctr)
    rng = np.random.default_rng(graine)
    N = len(Xtr)
    L = len(tailles) - 1
    journal = []
    debut = time.time()
    for t in range(epoques):
        ordre = rng.permutation(N)
        for d in range(0, N, B_LOT):
            idx = ordre[d:d + B_LOT]
            grads = arriere(theta, avant(theta, Xtr[idx]), Ytr[idx])
            for cle in theta:
                theta[cle] -= eta * grads[cle]
        if not np.isfinite(theta["W1"]).all():
            return {"theta": theta, "diverge": True, "acc": float("nan"),
                    "L": float("nan"), "erreurs": -1, "journal": journal,
                    "secondes": time.time() - debut}
        if trace and t in (0, 4, 9, 19, 29):
            Ltr, atr = evaluer(theta, Xtr, ctr)
            Lte, ate = evaluer(theta, Xte, cte)
            n_grad = float("nan")
            if normes:
                # La norme du gradient COMPLET, sur les 60 000 exemples.
                g = gradient_complet(theta, Xtr, Ytr)
                n_grad = float(np.linalg.norm(plat(g)))
            journal.append((t, Ltr, atr, Lte, ate, n_grad))
    Lte, ate = evaluer(theta, Xte, cte)
    A = avant(theta, Xte)[f"A{L}"]
    return {"theta": theta, "diverge": False, "L": Lte, "acc": ate,
            "erreurs": int((A.argmax(axis=1) != cte).sum()),
            "journal": journal, "secondes": time.time() - debut}


def gradient_complet(theta: dict, X: np.ndarray, Y: np.ndarray,
                     morceau: int = 4000) -> dict:
    """grad_theta C_D, accumulé par morceaux pour tenir en mémoire."""
    total = {cle: np.zeros_like(v) for cle, v in theta.items()}
    N = len(X)
    for d in range(0, N, morceau):
        Xb, Yb = X[d:d + morceau], Y[d:d + morceau]
        g = arriere(theta, avant(theta, Xb), Yb)
        for cle in total:
            total[cle] += g[cle] * (len(Xb) / N)
    return total


# ── 1. Le coût au départ ────────────────────────────────────────────────────


def mesure_1(Xte, cte) -> None:
    titre("MESURE 1 — LE COÛT AU DÉPART, cinq initialisations  (page 4)")

    uniforme = -math.log(1.0 / K)
    print(f"\n    répondre au hasard : -ln(1/10) = {uniforme:.6f}")
    print("\n      graine     coût        précision")
    for graine in range(5):
        theta = init((784, H, K), graine)
        L, acc = evaluer(theta, Xte, cte)
        print(f"      {graine:>6}     {L:.6f}    {acc:.4f}")

    sous_titre("Une sortie de réseau non entraîné, en entier (graine 0)")
    theta = init((784, H, K), 0)
    a = avant(theta, Xte[0:1])["A2"][0]
    print("      classe :  " + "  ".join(f"{k:>8}" for k in range(10)))
    print("      a_k    :  " + "  ".join(f"{v:>8.4f}" for v in a))
    print(f"      somme   {a.sum():.10f}")
    print(f"      écart max entre deux coordonnées   {a.max() - a.min():.6f}")
    print(f"      une loi uniforme donnerait          0.000000")
    print(f"      étiquette vraie {int(cte[0])}, coordonnée correspondante"
          f" {a[cte[0]]:.6f}")
    print(f"      perte sur cet exemple : -ln({a[cte[0]]:.6f})"
          f" = {-math.log(a[cte[0]]):.6f}")


# ── 2. Quadratique contre entropie croisée ──────────────────────────────────


def mesure_2() -> None:
    titre("MESURE 2 — LE COÛT QUADRATIQUE CONTRE L'ENTROPIE CROISÉE  (page 5)")

    print("""
    Sortie softmax a dans Delta_9, vraie classe c. On fait varier a_c, et on
    repartit uniformement la masse restante sur les neuf autres classes. On
    mesure |dC/dz_c|, la sensibilite du cout a la preactivation de la BONNE
    classe : c'est elle qui dit de combien le reseau corrigera.

      entropie croisee   l(a,c) = -ln a_c
      quadratique        l(a,c) = somme_k (a_k - y_k)^2
""".rstrip())
    print("\n         a_c      |dC/dz_c| entropie   |dC/dz_c| quadratique"
          "   rapport")
    for ac in (0.001, 0.010, 0.100, 0.500, 0.900):
        a = np.full(K, (1.0 - ac) / (K - 1))
        a[0] = ac
        y = np.zeros(K)
        y[0] = 1.0
        # Entropie croisee + softmax : dC/dz = a - y.
        ec = abs(a[0] - y[0])
        # Quadratique + softmax : dC/dz_c = 2 * somme_k (a_k - y_k) a_k (delta_kc - a_c)
        quad = 2.0 * float(np.sum((a - y) * a * (np.arange(K) == 0) - (a - y) * a * a[0]))
        print(f"      {ac:>8.3f}      {ec:>14.6f}      {abs(quad):>16.6f}"
              f"   x{ec / abs(quad):>8.1f}")

    print("""
    LECTURE. La ou le reseau se trompe le plus -- il accorde un millieme a la
    vraie classe -- le cout quadratique produit le gradient le PLUS FAIBLE. Il
    cesse de corriger exactement quand il faudrait corriger le plus.
""".rstrip())

    sous_titre("Quatre sorties, pour la vérification n°23 (vraie classe 4)")
    sorties = {
        "confiante et juste": 0.970,
        "hésitante et juste": 0.310,
        "hésitante et fausse": 0.120,
        "confiante et fausse": 0.004,
    }
    print("      sortie                    a_4      entropie croisée   quadratique")
    for nom, ac in sorties.items():
        a = np.full(K, (1.0 - ac) / (K - 1))
        a[4] = ac
        y = np.zeros(K)
        y[4] = 1.0
        print(f"      {nom:<24} {ac:>5.3f}    {-math.log(ac):>14.6f}"
              f"    {float(np.sum((a - y) ** 2)):>11.6f}")


# ── 3. Le taux d'apprentissage ──────────────────────────────────────────────


def mesure_3(Xtr, ctr, Xte, cte) -> None:
    titre("MESURE 3 — LE TAUX D'APPRENTISSAGE, 5 époques, graine 0  (page 8)")
    print("\n         eta      L_test    acc_test")
    for eta in (10.0, 3.0, 1.0, 0.5, 0.1, 0.01, 0.001):
        r = entrainer((784, H, K), GRAINE, eta, 5, Xtr, ctr, Xte, cte)
        if r["diverge"] or not np.isfinite(r["L"]):
            print(f"      {eta:>7.3f}       ---       ---     divergence")
        else:
            print(f"      {eta:>7.3f}    {r['L']:>8.4f}    {r['acc']:.4f}")


# ── 4 et 10. Les composantes du gradient ────────────────────────────────────


def mesure_4_10(Xtr, ctr, X_complet) -> dict:
    titre("MESURE 4 — LES COMPOSANTES DU GRADIENT  (page 10)")

    theta = init((784, H, K), GRAINE)
    X, c = Xtr[:2048], ctr[:2048]
    g = arriere(theta, avant(theta, X), onehot(c))
    v = plat(g)
    absv = np.abs(v)
    p = v.size

    print(f"\n    graine {GRAINE}, AVANT tout apprentissage, sur {len(X)} exemples")
    print(f"    p                                       {p} composantes")
    print(f"    plus grande valeur absolue              {absv.max():.4e}")
    print(f"    médiane des valeurs absolues            {np.median(absv):.4e}")
    print(f"    rapport de la plus grande à la médiane  "
          f"{absv.max() / np.median(absv):.0f}")
    print(f"    norme du gradient                       {np.linalg.norm(v):.6f}")

    tri = np.sort(absv)[::-1]
    somme = tri.sum()
    print()
    for part in (0.01, 0.10, 0.50):
        n = int(round(part * p))
        print(f"    les {100 * part:>5.0f} % plus grandes portent "
              f"{100 * tri[:n].sum() / somme:>6.2f} % de la somme des |g_i|")

    nuls = int((v == 0.0).sum())
    print(f"\n    composantes exactement nulles           {nuls}, "
          f"soit {100 * nuls / p:.1f} %")

    titre("MESURE 10 — D'OÙ VIENNENT LES ZÉROS  (page 10)")

    A1 = np.maximum(X @ theta["W1"].T + theta["b1"], 0.0)   # (2048, 128)
    pixels_muets = (X.max(axis=0) == 0.0)                    # (784,)
    neurones_eteints = (A1.max(axis=0) == 0.0)               # (128,)

    zW1 = (g["W1"] == 0.0)
    par_pixel = int(zW1[:, pixels_muets].sum())
    par_neurone = int(zW1[neurones_eteints, :].sum())
    croisement = int(zW1[np.ix_(neurones_eteints, pixels_muets)].sum())

    # DEUX COMPTES DE PIXELS MUETS, et ils ne disent pas la même chose.
    #
    #   sur l'ECHANTILLON de 2 048 : c'est lui qui explique les zéros du
    #   gradient effectivement calculé ci-dessus ;
    #   sur les 60 000 : c'est le terme INTRINSEQUE au jeu, celui qui
    #   subsisterait quel que soit l'échantillon, et il ne dépend d'aucune
    #   convention de seuil ni de division -- un pixel muet est un pixel dont
    #   l'octet vaut zéro sur toutes les images.
    muets_complet = int((X_complet.max(axis=0) == 0.0).sum())
    print(f"\n    pixels jamais encrés sur les {len(X)} exemples      "
          f"{int(pixels_muets.sum())} sur 784")
    print(f"    pixels jamais encrés sur les {len(X_complet)} images    "
          f"{muets_complet} sur 784")
    print(f"      terme intrinsèque au jeu dans W^[1]   "
          f"{muets_complet} x {H} = {muets_complet * H}")
    print(f"    neurones cachés éteints sur les {len(X)}       "
          f"{int(neurones_eteints.sum())} sur {H}")
    print()
    print(f"    zéros dans W^[1]                        {int(zW1.sum())}")
    print(f"      dont colonnes de pixels muets         {par_pixel}"
          f"   ({int(pixels_muets.sum())} x {H})")
    print(f"      dont lignes de neurones éteints       {par_neurone}"
          f"   ({int(neurones_eteints.sum())} x 784)")
    print(f"      comptés deux fois (intersection)      -{croisement}")
    print(f"      total expliqué                        "
          f"{par_pixel + par_neurone - croisement}")

    # LE RESTE. Un coefficient de W^[1] est nul quand, pour CHAQUE image, le
    # pixel est blanc OU le neurone est eteint. Les deux causes ci-dessus sont
    # les cas extremes -- pixel blanc partout, neurone eteint partout. Entre les
    # deux vivent les pixels RAREMENT encres : il suffit que les quelques images
    # qui les encrent aient toutes ce neurone-la eteint.
    reste = int(zW1.sum()) - (par_pixel + par_neurone - croisement)
    encrages = (X > 0).sum(axis=0)                   # (784,) images par pixel
    lignes_r, colonnes_r = np.nonzero(zW1)
    garder = ~pixels_muets[colonnes_r]
    encrages_restants = encrages[colonnes_r[garder]]
    print(f"      reste inexpliqué par les deux causes  {reste}")
    if reste > 0:
        print(f"        ces zeros portent sur des pixels encres par")
        print(f"        mediane {int(np.median(encrages_restants))} image(s)"
              f" sur {len(X)},"
              f"   maximum {int(encrages_restants.max())}")
        print(f"        pixels concernes                    "
              f"{len(set(colonnes_r[garder].tolist()))} sur 784")
        print("        Un pixel encre par une poignee d'images suffit : il")
        print("        suffit que ces images-la aient ce neurone eteint.")
    print(f"    zéros dans b^[1]                        "
          f"{int((g['b1'] == 0.0).sum())}   (les neurones éteints)")
    print(f"    zéros dans W^[2]                        "
          f"{int((g['W2'] == 0.0).sum())}")
    print(f"    zéros dans b^[2]                        "
          f"{int((g['b2'] == 0.0).sum())}")

    return {"theta": theta, "g": g, "X": X, "c": c}


# ── 5. La taille du lot ─────────────────────────────────────────────────────


def mesure_5(Xtr, ctr) -> None:
    titre("MESURE 5 — LA TAILLE DU LOT, 30 tirages par taille  (page 9)")

    theta = init((784, H, K), GRAINE)
    Ytr = onehot(ctr)
    g = plat(gradient_complet(theta, Xtr, Ytr))
    ng = float(np.linalg.norm(g))
    print(f"\n    gradient complet sur les {len(Xtr)} exemples,"
          f" norme {ng:.6f}")
    print("\n         B    cos moyen   écart-type   B(1/cos²-1)")

    rng = np.random.default_rng(GRAINE)
    for B in (1, 8, 64, 512, 4096):
        cosinus = []
        for _ in range(30):
            idx = rng.choice(len(Xtr), size=B, replace=False)
            gb = plat(arriere(theta, avant(theta, Xtr[idx]), Ytr[idx]))
            cosinus.append(float(gb @ g / (np.linalg.norm(gb) * ng)))
        cosinus = np.array(cosinus)
        m, s = float(cosinus.mean()), float(cosinus.std())
        print(f"      {B:>4}     {m:>7.4f}      {s:>7.4f}      "
              f"{B * (1.0 / m ** 2 - 1.0):>9.1f}")

    print(f"\n    un lot de 64 pointe a cos = ... du gradient complet ;"
          f" l'angle correspondant")
    print(f"    se lit ci-dessous pour chaque taille :")
    print("\n         B    angle (degrés)")
    rng = np.random.default_rng(GRAINE)
    for B in (1, 8, 64, 512, 4096):
        cosinus = []
        for _ in range(30):
            idx = rng.choice(len(Xtr), size=B, replace=False)
            gb = plat(arriere(theta, avant(theta, Xtr[idx]), Ytr[idx]))
            cosinus.append(float(gb @ g / (np.linalg.norm(gb) * ng)))
        m = float(np.mean(cosinus))
        print(f"      {B:>4}     {math.degrees(math.acos(min(1.0, m))):>6.1f}")


# ── 6. Trois graines ────────────────────────────────────────────────────────


def mesure_6(Xtr, ctr, Xte, cte) -> list:
    titre("MESURE 6 — TROIS GRAINES, MÊME PROTOCOLE, 30 époques  (page 11)")

    resultats = []
    print()
    for graine in range(3):
        r = entrainer((784, H, K), graine, ETA, EPOQUES, Xtr, ctr, Xte, cte)
        resultats.append(r)
        print(f"    graine {graine} : précision test {r['acc']:.4f}"
              f"   {r['erreurs']} erreurs"
              f"   ({r['secondes']:.0f} s)")

    sous_titre("Distance relative entre les theta finaux")
    v = [plat(r["theta"]) for r in resultats]
    print(f"      norme de chaque theta : "
          + "   ".join(f"{np.linalg.norm(x):.4f}" for x in v))
    print("\n      couple      ||a - b|| / ||a||     cos(a, b)")
    for i, j in ((0, 1), (0, 2), (1, 2)):
        d = float(np.linalg.norm(v[i] - v[j]) / np.linalg.norm(v[i]))
        cos = float(v[i] @ v[j] / (np.linalg.norm(v[i]) * np.linalg.norm(v[j])))
        print(f"      {i} et {j}          {d:.4f}             {cos:+.4f}")
    print(f"\n      pour reference : deux vecteurs de meme norme et orthogonaux")
    print(f"      sont a distance relative racine de 2 = {math.sqrt(2):.4f}")

    sous_titre("La proposition 6, vérifiée numériquement")
    theta = resultats[0]["theta"]
    rng = np.random.default_rng(GRAINE)
    pi = rng.permutation(H)
    permute = {
        "W1": theta["W1"][pi, :].copy(),
        "b1": theta["b1"][pi].copy(),
        "W2": theta["W2"][:, pi].copy(),
        "b2": theta["b2"].copy(),
    }
    c0 = cout(theta, Xte, cte)
    c1 = cout(permute, Xte, cte)
    print(f"      coût de theta                          {c0:.12f}")
    print(f"      coût de theta permuté (une permutation) {c1:.12f}")
    print(f"      écart                                  {abs(c0 - c1):.3e}")
    print(f"      distance relative entre les deux theta  "
          f"{np.linalg.norm(plat(permute) - plat(theta)) / np.linalg.norm(plat(theta)):.4f}")
    print(f"      nombre de permutations de {H} elements  128! ~ 3,86e215")
    return resultats


# ── 7. La norme du gradient pendant l'entraînement ──────────────────────────


def mesure_7(Xtr, ctr, Xte, cte) -> None:
    titre("MESURE 7 — LA NORME DU GRADIENT PENDANT L'ENTRAÎNEMENT  (page 8)")
    r = entrainer((784, H, K), GRAINE, ETA, EPOQUES, Xtr, ctr, Xte, cte,
                  trace=True, normes=True)
    print("\n    époque   L_train   acc_train    L_test   acc_test    ||grad||")
    for t, Ltr, atr, Lte, ate, ng in r["journal"]:
        print(f"    {t:>6}   {Ltr:>7.4f}     {atr:>6.4f}   {Lte:>7.4f}"
              f"     {ate:>6.4f}   {ng:>9.6f}")
    premiere = r["journal"][0][5]
    derniere = r["journal"][-1][5]
    print(f"\n    la norme du gradient est divisée par {premiere / derniere:.0f}")
    print(f"    entre la première et la dernière époque mesurée.")


# ── 8 et 9. Différences finies ──────────────────────────────────────────────


def mesure_8_9(contexte: dict) -> None:
    titre("MESURE 8 — CENT DIRECTIONS AU HASARD  (page 8)")

    theta, X, c = contexte["theta"], contexte["X"], contexte["c"]
    base = plat(theta)
    p = base.size
    eps = 1e-5

    def C_de(v: np.ndarray) -> float:
        return cout(deplat(theta, v), X, c)

    def derivee_directionnelle(u: np.ndarray) -> float:
        return (C_de(base + eps * u) - C_de(base - eps * u)) / (2.0 * eps)

    g = plat(contexte["g"])
    u_grad = g / np.linalg.norm(g)
    d_grad = derivee_directionnelle(u_grad)

    print(f"\n    C est le coût sur les {len(X)} exemples de la mesure 4.")
    print(f"    différence finie CENTRÉE, epsilon = {eps:g}")
    print(f"\n    direction du gradient normalisé   D_u C = {d_grad:+.8f}")

    rng = np.random.default_rng(GRAINE)
    valeurs = []
    for _ in range(100):
        u = rng.normal(size=p)
        u /= np.linalg.norm(u)
        valeurs.append(derivee_directionnelle(u))
    valeurs = np.array(valeurs)
    print(f"    cent directions unitaires tirées au hasard :")
    print(f"      maximum                         {valeurs.max():+.8f}")
    print(f"      minimum                         {valeurs.min():+.8f}")
    print(f"      moyenne                         {valeurs.mean():+.8f}")
    print(f"      combien dépassent le gradient   "
          f"{int((valeurs > d_grad).sum())} sur 100")
    print(f"      rapport max/gradient            "
          f"{valeurs.max() / d_grad:.4f}")
    print("\n    AUCUNE direction tirée au hasard ne dépasse celle du gradient :")
    print("    c'est la vérification numérique de la proposition 3.")

    titre("MESURE 9 — CE QUE COÛTE UN GRADIENT PAR DIFFÉRENCES FINIES  (page 8)")

    t0 = time.perf_counter()
    for _ in range(5):
        cout(theta, X, c)
    t_avant = (time.perf_counter() - t0) / 5.0

    e = np.zeros(p)
    t0 = time.perf_counter()
    for i in range(5):
        e[i] = 1.0
        (C_de(base + eps * e) - C_de(base - eps * e)) / (2.0 * eps)
        e[i] = 0.0
    t_composante = (time.perf_counter() - t0) / 5.0

    print(f"\n    une propagation avant sur {len(X)} exemples     "
          f"{t_avant * 1000:.1f} ms")
    print(f"    UNE composante par différence centrée      "
          f"{t_composante * 1000:.1f} ms   (2 propagations)")
    print(f"    p                                          {p} composantes")
    print(f"    propagations avant pour UN gradient        {2 * p}")
    print(f"    temps estimé pour UN gradient             "
          f"{t_composante * p:.0f} s, soit {t_composante * p / 3600:.2f} h")
    print(f"    l'algorithme du chapitre 4 en demande      1 propagation avant")
    print(f"    rapport                                    "
          f"{2 * p:,}".replace(",", " "))
    print(f"\n    Un entraînement de 30 époques compte 28 140 mises à jour.")
    print(f"    Par différences finies, il demanderait     "
          f"{t_composante * p * 28140 / 3600 / 24 / 365:.0f} années de calcul.")
    print("    Le procédé est CORRECT et INUTILISABLE. C'est ce qui motive le")
    print("    chapitre 4.")


# ── 11. La largeur de la couche cachée ──────────────────────────────────────


def mesure_11(Xtr, ctr, Xte, cte) -> None:
    titre("MESURE 11 — LA LARGEUR DE LA COUCHE CACHÉE  (page 11)")
    print("\n    même protocole pour les cinq : graine 0, eta 0,5, 30 époques")
    print("\n         h          p    acc_test   erreurs    secondes")
    for h in (32, 64, 128, 256, 512):
        r = entrainer((784, h, K), GRAINE, ETA, EPOQUES, Xtr, ctr, Xte, cte)
        p = 784 * h + h + h * K + K
        print(f"      {h:>4}   {p:>8}     {r['acc']:.4f}    {r['erreurs']:>6}"
              f"    {r['secondes']:>8.0f}")


def main() -> None:
    _console_utf8()
    debut = time.time()
    print("  Chapitre 3 : toutes les mesures.")
    print(f"  réseau 784 -> {H} -> {K}, ReLU, entropie croisée")
    print(f"  graine {GRAINE}   lots de {B_LOT}   eta {ETA}   {EPOQUES} époques")
    print(f"  BLAS bridé à {_FILS} fils.")

    Xtr, ctr, Xte, cte = D.charger()
    print(f"\n  X_train {Xtr.shape}   X_test {Xte.shape}")

    mesure_1(Xte, cte)
    mesure_2()
    contexte = mesure_4_10(Xtr, ctr, Xtr)
    mesure_8_9(contexte)
    mesure_3(Xtr, ctr, Xte, cte)
    mesure_5(Xtr, ctr)
    mesure_7(Xtr, ctr, Xte, cte)
    mesure_6(Xtr, ctr, Xte, cte)
    mesure_11(Xtr, ctr, Xte, cte)

    titre("FIN")
    print(f"\n  durée totale : {time.time() - debut:.0f} s")
    print("  Tous les nombres du chapitre 3 sortent de cette exécution.")


if __name__ == "__main__":
    main()
