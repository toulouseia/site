"""
Lecon 3, suite : le pas, l'initialisation, la standardisation, l'evanescence.

    python cours/lecon3/experiences2.py            tout
    python cours/lecon3/experiences2.py E5 E8      seulement celles-la
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402
import reseau as R  # noqa: E402

FIGURES = RACINE / "figures"
GRAINE = 0
RESULTATS: dict = {}


def titre(numero: str, texte: str) -> None:
    print("\n" + "=" * 78)
    print(f"  {numero} — {texte}")
    print("=" * 78)


def entrainer(theta, Xtr, Ytr, eta, maj, B=64, activation="sigmoide",
              graine=1, jalons=None):
    """Une suite de mises a jour SGD. Rend l'historique de la perte du lot."""
    rng = np.random.default_rng(graine)
    N = Xtr.shape[0]
    historique = []
    for t in range(maj):
        idx = rng.choice(N, size=B, replace=False)
        cache = R.avant(theta, Xtr[idx], activation)
        L = R.perte(cache[f"A{len(theta) // 2}"], Ytr[idx])
        historique.append(L)
        grads = R.arriere(theta, cache, Ytr[idx], activation)
        R.pas(theta, grads, eta)
        if jalons is not None and t in jalons:
            jalons[t] = L
    return historique


# ─────────────────────────────────────────────────────────────────────────────
# E5. Le pas d'apprentissage
# ─────────────────────────────────────────────────────────────────────────────

def E5(data):
    titre("E5", "Le pas : le seuil exact en quadratique, puis la mesure reelle")

    print("  (a) Le cas ou tout se calcule : f(theta) = lambda theta^2 / 2, lambda = 1")
    print("      theta_{t+1} = theta_t - eta f'(theta_t) = (1 - eta lambda) theta_t")
    print(f"\n      {'eta':>6}{'1 - eta lambda':>16}{'|facteur|':>12}   theta_0=1 -> theta_1..theta_5")
    lam = 1.0
    for eta in (0.25, 0.5, 1.0, 1.5, 2.0, 2.1):
        facteur = 1 - eta * lam
        suite = [1.0]
        for _ in range(5):
            suite.append(suite[-1] * facteur)
        chaine = "  ".join(f"{v:+.4f}" for v in suite[1:])
        print(f"      {eta:>6.2f}{facteur:>16.2f}{abs(facteur):>12.2f}   {chaine}")
    print("\n      |1 - eta lambda| < 1  <=>  0 < eta < 2/lambda = 2.00")
    print("      eta = 2.00 : oscillation d'amplitude constante, jamais de convergence.")
    print("      eta = 2.10 : |facteur| = 1.10 > 1, l'ecart au minimum grandit.")

    print("\n  (b) Le meme seuil existe sur le reseau, mais on ne le calcule pas :")
    print("      on le mesure. 937 mises a jour, B = 64, initialisation Xavier.")
    Xtr, ctr, Xte, cte = data
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)

    courbes = {}
    print(f"\n      {'eta':>8}{'perte finale (lot)':>22}{'perte test':>13}{'precision test':>17}")
    for eta in (0.001, 0.01, 0.1, 0.5, 1.0, 3.0, 10.0, 30.0, 100.0, 300.0):
        theta = R.init_parametres(GRAINE, "xavier")
        n_depart = float(np.sqrt(sum(float(np.sum(v ** 2)) for v in theta.values())))
        hist = entrainer(theta, Xtr, Ytr, eta, 937)
        n_theta = float(np.sqrt(sum(float(np.sum(v ** 2)) for v in theta.values())))
        L, acc = R.evaluer(theta, Xte, Yte, cte)
        courbes[eta] = hist
        fin = float(np.mean(hist[-50:]))
        pire = float(np.nanmax(hist)) if np.isfinite(hist).any() else float("inf")
        if not np.isfinite(fin):
            marque = "   <- NaN : divergence numerique"
        elif fin > 2.31:
            marque = "   <- pire que le hasard"
        elif acc < 0.85:
            marque = "   <- trop lent" if eta < 0.1 else "   <- degrade"
        else:
            marque = ""
        print(f"      {eta:>8.3f}{fin:>15.4f}{pire:>13.2f}{n_theta:>13.1f}{acc:>17.4f}{marque}")
        if eta == 0.001:
            print(f"      {'(depart)':>8}{'':>15}{'':>13}{n_depart:>13.1f}")
    RESULTATS["E5"] = courbes
    return courbes


# ─────────────────────────────────────────────────────────────────────────────
# E6. L'initialisation
# ─────────────────────────────────────────────────────────────────────────────

def E6(data):
    titre("E6", "L'initialisation : la symetrie, la saturation, la variance")
    Xtr, ctr, Xte, cte = data
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)
    X = Xtr[:1000]

    print("  (a) Les preactivations de la couche cachee AVANT tout apprentissage")
    print(f"\n      {'methode':<10}{'Var(Z1)':>12}{'|Z1| > 4':>12}{'moy sigma prime':>18}{'lignes W1 distinctes':>22}")
    stats = {}
    for methode in ("zero", "grand", "xavier"):
        theta = R.init_parametres(GRAINE, methode)
        cache = R.avant(theta, X)
        Z1, A1 = cache["Z1"], cache["A1"]
        sature = float(np.mean(np.abs(Z1) > 4))
        dsig = float(np.mean(R.d_sigmoide(A1)))
        distinctes = len(np.unique(np.round(theta["W1"], 12), axis=0))
        stats[methode] = (float(Z1.var()), sature, dsig, distinctes)
        print(f"      {methode:<10}{Z1.var():>12.4f}{sature:>12.2%}{dsig:>18.6f}{distinctes:>22}")
    print("\n      sigma prime maximal possible = 0.25 (atteint en z = 0).")

    print("\n  (b) La symetrie de l'initialisation a zero, apres 200 mises a jour")
    theta = R.init_parametres(GRAINE, "zero")
    entrainer(theta, Xtr, Ytr, 0.5, 200)
    distinctes = len(np.unique(np.round(theta["W1"], 10), axis=0))
    ecart_max = float(np.abs(theta["W1"] - theta["W1"][0]).max())
    print(f"      lignes distinctes de W1 : {distinctes} sur {theta['W1'].shape[0]}")
    print(f"      ecart maximal entre deux lignes : {ecart_max:.2e}")
    L, acc = R.evaluer(theta, Xte, Yte, cte)
    print(f"      perte test {L:.4f}   precision test {acc:.4f}   (hasard = 0.1000)")

    print("\n  (c) Ce que chaque initialisation obtient apres 937 mises a jour")
    print(f"\n      {'methode':<10}{'perte test':>13}{'precision test':>17}")
    apprentissage = {}
    for methode in ("zero", "grand", "xavier"):
        theta = R.init_parametres(GRAINE, methode)
        hist = entrainer(theta, Xtr, Ytr, 0.5, 937)
        L, acc = R.evaluer(theta, Xte, Yte, cte)
        apprentissage[methode] = (hist, L, acc)
        print(f"      {methode:<10}{L:>13.4f}{acc:>17.4f}")
    RESULTATS["E6"] = {"stats": stats, "apprentissage": apprentissage}
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# E7. La standardisation des entrees
# ─────────────────────────────────────────────────────────────────────────────

def E7(data):
    titre("E7", "La standardisation : le conditionnement, puis la vitesse")
    Xtr, ctr, Xte, cte = data
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)

    mu = Xtr.mean(axis=0)
    sigma = Xtr.std(axis=0)
    vivants = sigma > 1e-6
    print(f"  Pixels dont l'ecart-type est nul sur tout le jeu : "
          f"{int((~vivants).sum())} sur 784 (jamais allumes).")
    print("  Ils sont laisses tels quels : diviser par zero n'a pas de sens, et")
    print("  une colonne constante n'apporte rien au modele.")

    Xtr_s = Xtr.copy()
    Xte_s = Xte.copy()
    Xtr_s[:, vivants] = (Xtr[:, vivants] - mu[vivants]) / sigma[vivants]
    Xte_s[:, vivants] = (Xte[:, vivants] - mu[vivants]) / sigma[vivants]

    print(f"\n  {'jeu':<16}{'moyenne':>12}{'ecart-type':>14}{'min':>10}{'max':>10}")
    for nom, A in (("brut [0,1]", Xtr), ("standardise", Xtr_s)):
        print(f"  {nom:<16}{A.mean():>12.4f}{A.std():>14.4f}{A.min():>10.2f}{A.max():>10.2f}")

    # Le conditionnement de la matrice de covariance, restreint aux pixels vivants.
    C = np.cov(Xtr[:5000][:, vivants], rowvar=False)
    Cs = np.cov(Xtr_s[:5000][:, vivants], rowvar=False)
    print(f"\n  Valeurs propres de la covariance (5000 exemples, {int(vivants.sum())} pixels vivants) :")
    print(f"  {'jeu':<16}{'lambda max':>14}{'lambda min > 0':>18}{'rapport':>14}")
    for nom, M in (("brut", C), ("standardise", Cs)):
        vp = np.linalg.eigvalsh(M)
        vp = vp[vp > 1e-10]
        print(f"  {nom:<16}{vp.max():>14.4f}{vp.min():>18.2e}{vp.max() / vp.min():>14.2e}")

    print("\n  Vitesse d'apprentissage, meme eta, meme graine, 300 mises a jour :")
    print(f"  {'jeu':<16}{'perte apres 100':>18}{'apres 300':>13}{'precision test':>17}")
    courbes = {}
    for nom, A, Ate in (("brut [0,1]", Xtr, Xte), ("standardise", Xtr_s, Xte_s)):
        theta = R.init_parametres(GRAINE, "xavier")
        hist = entrainer(theta, A, Ytr, 0.5, 300)
        L, acc = R.evaluer(theta, Ate, Yte, cte)
        courbes[nom] = hist
        print(f"  {nom:<16}{np.mean(hist[95:105]):>18.4f}{np.mean(hist[-10:]):>13.4f}{acc:>17.4f}")
    RESULTATS["E7"] = courbes
    return courbes


# ─────────────────────────────────────────────────────────────────────────────
# E8. Les gradients evanescents
# ─────────────────────────────────────────────────────────────────────────────

def E8(data):
    titre("E8", "Les gradients evanescents : le facteur 1/4 par couche")
    Xtr, ctr, _, _ = data
    X, Y = Xtr[:512], D.onehot(ctr[:512])

    print("  (a) La derivee de la sigmoide, en quelques points")
    print(f"      {'z':>8}{'sigma(z)':>12}{'sigma prime(z)':>18}")
    for z in (0.0, 1.0, 2.0, 4.0, 6.0):
        a = R.sigmoide(np.array([z])).item()
        print(f"      {z:>8.1f}{a:>12.6f}{a * (1 - a):>18.6f}")
    print("      Maximum : sigma prime(0) = 0.25. Jamais plus.")

    print("\n  (b) Norme du gradient par couche, reseau 784-64-64-64-64-10")
    tailles = (784, 64, 64, 64, 64, 10)
    print(f"\n      {'activation':<12}{'couche 1':>13}{'couche 2':>13}{'couche 3':>13}"
          f"{'couche 4':>13}{'couche 5':>13}{'rapport 5/1':>14}")
    normes = {}
    for activation, methode in (("sigmoide", "xavier"), ("relu", "he")):
        theta = R.init_parametres(GRAINE, methode, tailles)
        grads = R.gradient_complet(theta, X, Y, activation)
        n = [float(np.linalg.norm(grads[f"W{c}"])) for c in range(1, len(tailles))]
        normes[activation] = n
        chaine = "".join(f"{v:>13.3e}" for v in n)
        print(f"      {activation:<12}{chaine}{n[-1] / n[0]:>14.1f}")
    print("\n      Le gradient de la premiere couche est celui qui a traverse le plus")
    print("      de facteurs sigma prime. C'est lui qui s'eteint.")
    RESULTATS["E8"] = normes
    return normes


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    FIGURES.mkdir(parents=True, exist_ok=True)
    demandees = [a for a in sys.argv[1:] if a.startswith("E")] or ["E5", "E6", "E7", "E8"]
    data = D.charger()
    for nom in demandees:
        globals()[nom](data)
    print()
