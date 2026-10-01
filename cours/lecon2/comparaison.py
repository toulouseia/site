"""
Lecon 2, page 7 : ce que la couche cachee apporte, mesure.

Trois modeles, un seul protocole. C'est la table qui porte la these de la
lecon : ce ne sont pas les parametres qui achetent la performance, c'est la
non-linearite.

    A. lineaire        784 -> 10             7 850 parametres
    B. deux couches SANS activation  784 -> 128 -> 10   101 770 parametres
    C. deux couches AVEC ReLU        784 -> 128 -> 10   101 770 parametres

Le modele B est le point de comparaison qui manquait : il a exactement autant
de parametres que C, et il ne peut rien faire de plus que A, parce que la
composee de deux applications lineaires est lineaire. On le PROUVE en calculant
le rang de W2 @ W1.

Le modele B est juge sur son MEILLEUR pas d'apprentissage, pas sur celui de C :
le comparer a reglage handicapant ne prouverait rien.

DONNEES. Les fichiers idx originaux du depot, normalises par 255, exactement
ceux qu'utilise entrainement.py. Un autre jeu, ou une autre normalisation,
donnerait d'autres chiffres : c'est la raison pour laquelle ce fichier ne
depend que de cours/donnees.py.
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# BLAS EST BRIDE AVANT L'IMPORT DE NUMPY, pour la meme raison qu'en
# entrainement.py : les matrices d'un mini-lot sont minuscules, (64, 784) par
# (784, 128), et la synchronisation de douze fils coute plus cher que la
# multiplication. Mesure sur ce poste : 48,0 ms par mise a jour a 12 fils,
# 1,65 ms a 4 fils. Sans cette bride, ce fichier tourne trois heures au lieu
# d'une. Les variables doivent etre posees AVANT numpy : la bibliotheque BLAS
# les lit une seule fois, a son chargement.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402

GRAINE = 0
B_LOT = 64
K = 10


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


def softmax(Z: np.ndarray) -> np.ndarray:
    Z = Z - Z.max(axis=1, keepdims=True)
    E = np.exp(Z)
    return E / E.sum(axis=1, keepdims=True)


def onehot(c: np.ndarray) -> np.ndarray:
    Y = np.zeros((len(c), K))
    Y[np.arange(len(c)), c] = 1.0
    return Y


# ── Les trois modeles, une seule interface ──────────────────────────────────


def init(tailles: tuple[int, ...], graine: int, methode: str) -> dict:
    rng = np.random.default_rng(graine)
    theta = {}
    for couche in range(1, len(tailles)):
        d_in, d_out = tailles[couche - 1], tailles[couche]
        if methode == "zero":
            ecart = 0.0
        elif methode == "he":
            ecart = np.sqrt(2.0 / d_in)
        else:
            raise ValueError(methode)
        theta[f"W{couche}"] = rng.normal(0.0, ecart, size=(d_out, d_in))
        theta[f"b{couche}"] = np.zeros(d_out)
    return theta


def avant(theta: dict, X: np.ndarray, activation: str) -> dict:
    """activation : 'relu', ou 'identite' pour ne rien mettre entre les couches."""
    L = len(theta) // 2
    cache = {"A0": X}
    A = X
    for couche in range(1, L + 1):
        Z = A @ theta[f"W{couche}"].T + theta[f"b{couche}"]
        if couche == L:
            A = softmax(Z)
        elif activation == "relu":
            A = np.maximum(Z, 0.0)
        elif activation == "identite":
            A = Z                      # aucune non-linearite : c'est le sujet
        else:
            raise ValueError(activation)
        cache[f"Z{couche}"] = Z
        cache[f"A{couche}"] = A
    return cache


def arriere(theta: dict, cache: dict, Y: np.ndarray, activation: str) -> dict:
    L = len(theta) // 2
    B = len(Y)
    grads = {}
    D = (cache[f"A{L}"] - Y) / B                      # (B, K)
    for couche in range(L, 0, -1):
        A_prec = cache[f"A{couche - 1}"]
        grads[f"W{couche}"] = D.T @ A_prec
        grads[f"b{couche}"] = D.sum(axis=0)
        if couche > 1:
            D = D @ theta[f"W{couche}"]
            if activation == "relu":
                D = D * (cache[f"Z{couche - 1}"] > 0)
            # 'identite' : la derivee vaut 1, il n'y a rien a multiplier
    return grads


def perte(A: np.ndarray, Y: np.ndarray) -> float:
    return float(-np.sum(Y * np.log(np.clip(A, 1e-15, None))) / len(Y))


def evaluer(theta: dict, X: np.ndarray, c: np.ndarray, activation: str,
            morceau: int = 2000) -> tuple[float, float, np.ndarray]:
    pertes, justes, predits = 0.0, 0, []
    for d in range(0, len(X), morceau):
        Xb, cb = X[d:d + morceau], c[d:d + morceau]
        A = avant(theta, Xb, activation)[f"A{len(theta) // 2}"]
        pertes += perte(A, onehot(cb)) * len(cb)
        p = A.argmax(axis=1)
        predits.append(p)
        justes += int((p == cb).sum())
    return pertes / len(X), justes / len(X), np.concatenate(predits)


def entrainer(tailles: tuple[int, ...], activation: str, methode: str,
              eta: float, epoques: int, Xtr, ctr, Xte, cte,
              bavard: bool = False) -> dict:
    theta = init(tailles, GRAINE, methode)
    Ytr = onehot(ctr)
    rng = np.random.default_rng(GRAINE)
    N = len(Xtr)
    debut = time.time()
    for t in range(epoques):
        ordre = rng.permutation(N)
        for d in range(0, N, B_LOT):
            idx = ordre[d:d + B_LOT]
            cache = avant(theta, Xtr[idx], activation)
            grads = arriere(theta, cache, Ytr[idx], activation)
            for cle in theta:
                theta[cle] -= eta * grads[cle]
        if not np.isfinite(theta["W1"]).all():
            return {"theta": theta, "diverge": True, "acc": float("nan"),
                    "erreurs": -1, "secondes": time.time() - debut}
        if bavard and (t % 5 == 0 or t == epoques - 1):
            _, a, _ = evaluer(theta, Xte, cte, activation)
            print(f"      epoque {t:>2}   acc_test {a:.4f}")
    L, acc, predits = evaluer(theta, Xte, cte, activation)
    return {"theta": theta, "diverge": False, "L": L, "acc": acc,
            "erreurs": int((predits != cte).sum()), "predits": predits,
            "secondes": time.time() - debut}


def main() -> None:
    _console_utf8()
    print("  Lecon 2, page 7 : ce que la couche cachee apporte.")
    print("  Donnees : les idx du depot, normalises par 255.")

    Xtr, ctr, Xte, cte = D.charger()
    print(f"\n    X_train {Xtr.shape}   X_test {Xte.shape}")
    print(f"    valeurs dans [{Xtr.min():.1f}, {Xtr.max():.1f}]")
    print(f"    moyenne d'un pixel : {Xtr.mean():.6f}")

    # ── Le pas du modele sans activation, cherche et non suppose ────────────
    titre("A. Le modele SANS activation : quel pas lui donner ?")
    print("""
    Le comparer au pas de C serait malhonnete : chaque modele est juge sur
    son meilleur reglage. Balayage sur 15 epoques.
""".rstrip())
    print("\n         eta    acc_test   remarque")
    meilleur = (None, -1.0)
    for eta in (0.50, 0.20, 0.10, 0.05, 0.02, 0.01):
        r = entrainer((784, 128, 10), "identite", "he", eta, 15,
                      Xtr, ctr, Xte, cte)
        if r["diverge"]:
            print(f"        {eta:>4.2f}       ---     divergence")
        else:
            print(f"        {eta:>4.2f}    {r['acc']:.4f}     converge")
            if r["acc"] > meilleur[1]:
                meilleur = (eta, r["acc"])
    print(f"\n    retenu : eta = {meilleur[0]}")

    # ── Les trois modeles ───────────────────────────────────────────────────
    titre("B. Les trois modeles, meme protocole")
    print(f"    graine {GRAINE}   lots de {B_LOT}   permutation nouvelle par epoque")
    print("    entropie croisee   evaluation sur 10 000 images jamais vues\n")

    essais = [
        ("lineaire      784 -> 10", (784, 10), "identite", "zero", 0.5, 30),
        ("SANS ReLU 784 -> 128 -> 10", (784, 128, 10), "identite", "he",
         meilleur[0], 15),
        ("AVEC ReLU 784 -> 128 -> 10", (784, 128, 10), "relu", "he", 0.5, 30),
    ]
    print("    (le detail epoque par epoque du modele lineaire suit en G)")
    resultats = []
    print("    modele                        parametres    eta   epoques"
          "   acc_test   erreurs")
    for nom, tailles, act, meth, eta, epoques in essais:
        r = entrainer(tailles, act, meth, eta, epoques, Xtr, ctr, Xte, cte)
        p = sum(v.size for v in r["theta"].values())
        resultats.append((nom, p, eta, epoques, r))
        print(f"    {nom:<28} {p:>10}  {eta:>5}   {epoques:>7}"
              f"   {r['acc']:>8.4f}   {r['erreurs']:>7}")

    # ── La preuve du rang ───────────────────────────────────────────────────
    titre("C. Pourquoi le modele SANS activation ne peut pas faire mieux")
    theta_b = resultats[1][4]["theta"]
    produit = theta_b["W2"] @ theta_b["W1"]
    print(f"""
    Sans activation, le reseau calcule  softmax( W2 (W1 x + b1) + b2 ),
    c'est-a-dire  softmax( (W2 W1) x + (W2 b1 + b2) ).
    Le produit W2 @ W1 est donc la SEULE matrice qui compte.

      W2 @ W1 : ({theta_b['W2'].shape[0]} x {theta_b['W2'].shape[1]})"""
          f"({theta_b['W1'].shape[0]} x {theta_b['W1'].shape[1]})"
          f" = {produit.shape[0]} x {produit.shape[1]}")
    print(f"      rang de W2 @ W1 : {np.linalg.matrix_rank(produit)}")
    print(f"""
    C'est exactement la forme du modele lineaire de la premiere ligne.
    Ses {sum(v.size for v in theta_b.values())} parametres n'engendrent que"""
          f" {produit.size} coefficients utiles,\n    et son rang ne depasse"
          f" jamais {min(produit.shape)}.")

    # ── Le verdict ──────────────────────────────────────────────────────────
    titre("D. Le verdict")
    a_lin = resultats[0][4]["acc"]
    a_sans = resultats[1][4]["acc"]
    a_avec = resultats[2][4]["acc"]
    e_sans = resultats[1][4]["erreurs"]
    e_avec = resultats[2][4]["erreurs"]
    print(f"""
    de lineaire a SANS ReLU :  {100*a_lin:.2f} % -> {100*a_sans:.2f} %"""
          f"   soit {100*(a_sans-a_lin):+.2f} point")
    print(f"       en multipliant les parametres par"
          f" {resultats[1][1] / resultats[0][1]:.1f}")
    print(f"\n    de SANS ReLU a AVEC ReLU : {100*a_sans:.2f} % ->"
          f" {100*a_avec:.2f} %   soit {100*(a_avec-a_sans):+.2f} points")
    print(f"       a nombre de parametres IDENTIQUE")
    print(f"       erreurs divisees par {e_sans / e_avec:.1f}")
    print("""
    Ce ne sont pas les parametres qui achetent la performance,
    c'est la non-linearite.""")

    # ── Ce que le reseau rate ───────────────────────────────────────────────
    titre("E. Les erreurs du reseau a ReLU")
    r = resultats[2][4]
    theta_c = r["theta"]
    predits = r["predits"]
    faux = np.nonzero(predits != cte)[0]
    A = avant(theta_c, Xte, "relu")["A2"]
    proba = A[np.arange(len(cte)), predits]
    print(f"    erreurs                              {len(faux)} sur 10 000")
    print(f"    erreurs avec probabilite > 0,99      {int((proba[faux] > 0.99).sum())}")
    print(f"    erreurs avec probabilite > 0,90      {int((proba[faux] > 0.90).sum())}")
    print(f"    probabilite mediane des erreurs      {np.median(proba[faux]):.4f}")

    print("\n    LES SIX ERREURS LES PLUS CONFIANTES")
    print("      indice   verite   predit   probabilite")
    for i in faux[np.argsort(-proba[faux])][:6]:
        print(f"      {i:>6}   {cte[i]:>6}   {predits[i]:>6}   {proba[i]:>11.4f}")

    print("\n    LES SIX CONFUSIONS LES PLUS FREQUENTES")
    paires: dict[tuple[int, int], int] = {}
    for i in faux:
        paires[(int(cte[i]), int(predits[i]))] = \
            paires.get((int(cte[i]), int(predits[i])), 0) + 1
    for (v, p), n in sorted(paires.items(), key=lambda kv: -kv[1])[:6]:
        print(f"      vrai {v} lu {p} : {n} fois")

    print("\n    LA COUCHE CACHEE")
    A1 = np.maximum(Xte @ theta_c["W1"].T + theta_c["b1"], 0.0)
    morts = int((A1.max(axis=0) == 0).sum())
    print(f"      neurones eteints sur TOUTES les images   {morts} sur 128")
    print(f"      part moyenne de neurones actifs          {100*(A1 > 0).mean():.2f} %")
    allumes0 = int((A1[0] > 0).sum())
    print(f"      sur la premiere image de test (un 7)     {allumes0} allumes,"
          f" {128 - allumes0} eteints")
    print(f"      minimum sur une image                    {int((A1 > 0).sum(axis=1).min())}")
    print(f"      maximum sur une image                    {int((A1 > 0).sum(axis=1).max())}")

    # ── Les gabarits du modele lineaire ─────────────────────────────────────
    titre("F. Les dix gabarits du modele lineaire")
    W = resultats[0][4]["theta"]["W1"]
    print("      chiffre   poids max   position        poids min   position")
    for c in range(10):
        g = W[c].reshape(28, 28)
        imax = np.unravel_index(int(g.argmax()), g.shape)
        imin = np.unravel_index(int(g.argmin()), g.shape)
        print(f"      {c:>7}    {g.max():>+8.4f}   l{imax[0]+1:>2} c{imax[1]+1:>2}"
              f"        {g.min():>+8.4f}   l{imin[0]+1:>2} c{imin[1]+1:>2}")

    # ── Le detail epoque par epoque du modele lineaire ──────────────────────
    titre("G. Le modele lineaire, epoque par epoque")
    theta_g = init((784, 10), GRAINE, "zero")
    Ytr = onehot(ctr)
    rng = np.random.default_rng(GRAINE)
    print("     epoque    L_train  acc_train     L_test   acc_test")
    print("    " + "-" * 51)
    for t in range(30):
        ordre = rng.permutation(len(Xtr))
        for d in range(0, len(Xtr), B_LOT):
            idx = ordre[d:d + B_LOT]
            cache = avant(theta_g, Xtr[idx], "identite")
            grads = arriere(theta_g, cache, Ytr[idx], "identite")
            for cle in theta_g:
                theta_g[cle] -= 0.5 * grads[cle]
        if t in (0, 5, 10, 15, 20, 25, 29):
            Ltr, atr, _ = evaluer(theta_g, Xtr, ctr, "identite")
            Lte, ate, pte = evaluer(theta_g, Xte, cte, "identite")
            print(f"    {t:>7}  {Ltr:>9.4f}  {atr:>9.4f}  {Lte:>9.4f}  {ate:>9.4f}")
    print(f"\n    p = {sum(v.size for v in theta_g.values())} parametres")
    print(f"    ERREURS DE TEST : {int((pte != cte).sum())} / 10000")

    titre("Verdict")
    print(f"""
    Tous les chiffres ci-dessus sortent des fichiers idx du depot,
    normalises par 255. Un jeu normalise par 256 donne d'autres valeurs :
    l'ecart est petit sur chaque pixel et se voit sur la troisieme decimale
    de la precision. Le cours ne peut en citer qu'une serie, et c'est
    celle-ci, parce que c'est celle que produit cours/lecon2/entrainement.py.
""".rstrip())


if __name__ == "__main__":
    main()
