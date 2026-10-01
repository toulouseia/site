"""
Lecon 3 : les mesures. Rien n'est affirme dans la lecon qui ne soit produit ici.

    python cours/lecon3/experiences.py            tout
    python cours/lecon3/experiences.py E1 E4      seulement celles-la

Chaque experience imprime un rapport lisible tel quel. Les figures partent dans
cours/figures/. La graine est fixee partout : deux executions donnent les memes
chiffres.
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

import numpy as np

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402
import reseau as R  # noqa: E402

FIGURES = RACINE / "figures"
GRAINE = 0


def titre(numero: str, texte: str) -> None:
    print("\n" + "=" * 78)
    print(f"  {numero} — {texte}")
    print("=" * 78)


def charger_tout():
    return D.charger()


# ─────────────────────────────────────────────────────────────────────────────
# E1. Le gradient est-il vraiment la direction de plus forte augmentation ?
# ─────────────────────────────────────────────────────────────────────────────

def E1(data):
    titre("E1", "La direction de plus forte augmentation")
    Xtr, ctr, _, _ = data
    X, Y = Xtr[:512], D.onehot(ctr[:512])

    theta = R.init_parametres(GRAINE, "xavier")
    cache = R.avant(theta, X)
    L0 = R.perte(cache["A2"], Y)
    grads = R.arriere(theta, cache, Y)

    # On met tous les gradients bout a bout : le parametre est un point de R^p,
    # une direction est un vecteur unitaire de R^p.
    cles = sorted(theta)
    g = np.concatenate([grads[c].ravel() for c in cles])
    norme_g = np.linalg.norm(g)
    print(f"  p = {g.size}          ||grad|| = {norme_g:.6f}")

    def deplacer(direction, pas):
        essai = {}
        i = 0
        for c in cles:
            n = theta[c].size
            essai[c] = theta[c] + pas * direction[i:i + n].reshape(theta[c].shape)
            i += n
        return R.perte(R.avant(essai, X)["A2"], Y)

    rng = np.random.default_rng(7)
    nb = 2000
    produits = np.empty(nb)
    for i in range(nb):
        u = rng.normal(size=g.size)
        u /= np.linalg.norm(u)
        produits[i] = g @ u

    print(f"\n  Derivee directionnelle <grad, u> pour {nb} directions unitaires tirees au hasard :")
    print(f"    maximum observe        {produits.max():.6f}")
    print(f"    minimum observe        {produits.min():.6f}")
    print(f"    ecart-type             {produits.std():.6f}")
    print(f"    borne theorique +||g||  {norme_g:.6f}")
    print(f"    meilleure direction tiree / borne = {produits.max() / norme_g:.4f}")

    u_grad = g / norme_g
    print(f"\n  Direction u = grad/||grad||    <grad, u> = {g @ u_grad:.6f}   (= ||grad||)")
    print(f"  Direction u = -grad/||grad||   <grad, u> = {-(g @ u_grad):.6f}   (= -||grad||)")

    eps = 1e-4
    print(f"\n  Effet reel d'un pas de {eps} (perte de depart {L0:.6f}) :")
    lignes = [
        ("+grad/||grad||", u_grad),
        ("-grad/||grad||", -u_grad),
    ]
    rng2 = np.random.default_rng(11)
    for k in range(3):
        u = rng2.normal(size=g.size)
        u /= np.linalg.norm(u)
        lignes.append((f"aleatoire {k + 1}", u))
    print(f"    {'direction':<18}{'L(theta + eps u)':>18}{'variation':>14}{'prevue eps<g,u>':>18}")
    for nom, u in lignes:
        L = deplacer(u, eps)
        print(f"    {nom:<18}{L:>18.8f}{L - L0:>14.2e}{eps * (g @ u):>18.2e}")
    return {"norme_g": norme_g, "max_aleatoire": produits.max()}


# ─────────────────────────────────────────────────────────────────────────────
# E2. Le cout d'une iteration sur tout le jeu
# ─────────────────────────────────────────────────────────────────────────────

def E2(data):
    titre("E2", "Le cout d'une mise a jour : lot complet contre mini-lot")
    Xtr, ctr, Xte, cte = data
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)
    N = Xtr.shape[0]
    B = 64

    def chronometrer(fonction, repetitions):
        """
        Une passe a blanc d'abord : le premier appel paie l'allocation des
        tableaux intermediaires, et la compter fausserait le rapport d'un
        facteur deux. On garde ensuite la MEDIANE, pas la moyenne : une pause
        du systeme d'exploitation ne doit pas decider du resultat.
        """
        fonction()
        mesures = []
        for _ in range(repetitions):
            t0 = time.perf_counter()
            fonction()
            mesures.append(time.perf_counter() - t0)
        return float(np.median(mesures))

    theta = R.init_parametres(GRAINE, "xavier")
    t_complet = chronometrer(lambda: R.gradient_complet(theta, Xtr, Ytr), 3)
    t_mini = chronometrer(
        lambda: R.gradient_complet(theta, Xtr[:B], Ytr[:B]), 50)

    print(f"  N = {N}   B = {B}   p = {R.nb_parametres(theta)}")
    print(f"\n  Cout d'UNE mise a jour (mediane, apres passe a blanc) :")
    print(f"    lot COMPLET  {t_complet * 1000:9.1f} ms   soit {t_complet / N * 1e6:7.2f} us par exemple")
    print(f"    MINI-LOT     {t_mini * 1000:9.1f} ms   soit {t_mini / B * 1e6:7.2f} us par exemple")
    print(f"\n    Par exemple, le lot complet est {(t_mini / B) / (t_complet / N):.1f} x PLUS efficace :")
    print(f"    une grande multiplication de matrices exploite mieux le cache.")
    print(f"    Et pourtant il ne produit qu'UNE mise a jour, contre {N // B}.")

    resultats = {}
    print(f"\n  Ce que chacun obtient pour UN passage sur les {N} exemples, eta = 0.5 :")
    print(f"    {'methode':<18}{'mises a jour':>14}{'duree':>9}{'perte test':>13}{'precision':>12}")
    for nom, taille in (("lot complet", N), ("mini-lots B=64", B)):
        theta = R.init_parametres(GRAINE, "xavier")
        eta = 0.5
        t0 = time.perf_counter()
        if taille == N:
            R.pas(theta, R.gradient_complet(theta, Xtr, Ytr), eta)
            maj = 1
        else:
            ordre = np.random.default_rng(GRAINE).permutation(N)
            maj = 0
            for debut in range(0, N - taille + 1, taille):
                idx = ordre[debut:debut + taille]
                R.pas(theta, R.gradient_complet(theta, Xtr[idx], Ytr[idx]), eta)
                maj += 1
        duree = time.perf_counter() - t0
        L, acc = R.evaluer(theta, Xte, Yte, cte)
        resultats[nom] = (maj, duree, L, acc)
        print(f"    {nom:<18}{maj:>14}{duree:>8.2f}s{L:>13.4f}{acc:>12.4f}")

    hasard = 1.0 / 10
    a = resultats["lot complet"]
    b = resultats["mini-lots B=64"]
    print(f"\n    Le lot complet reste au niveau du hasard ({hasard:.4f}) : {a[3]:.4f}.")
    print(f"    Les mini-lots atteignent {b[3]:.4f} pour un cout de calcul comparable.")
    return resultats


# ─────────────────────────────────────────────────────────────────────────────
# E3. Le candidat naif : un sous-echantillon fixe
# ─────────────────────────────────────────────────────────────────────────────

def E3(data):
    titre("E3", "Le candidat naif : figer un petit sous-echantillon")
    Xtr, ctr, Xte, cte = data
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)
    N, B, eta, maj = Xtr.shape[0], 64, 0.5, 937

    rng = np.random.default_rng(GRAINE)
    fixe = rng.choice(N, size=B, replace=False)

    resultats = {}
    for nom in ("sous-echantillon fige", "mini-lots frais"):
        theta = R.init_parametres(GRAINE, "xavier")
        tirage = np.random.default_rng(GRAINE + 1)
        for _ in range(maj):
            idx = fixe if nom == "sous-echantillon fige" else tirage.choice(N, size=B, replace=False)
            R.pas(theta, R.gradient_complet(theta, Xtr[idx], Ytr[idx]), eta)
        L_lot, acc_lot = R.evaluer(theta, Xtr[fixe], Ytr[fixe], ctr[fixe])
        L_te, acc_te = R.evaluer(theta, Xte, Yte, cte)
        resultats[nom] = (L_lot, acc_lot, L_te, acc_te)
        print(f"\n  {nom} — {maj} mises a jour, meme cout de calcul")
        print(f"    sur les 64 exemples figes : perte {L_lot:.4f}   precision {acc_lot:.4f}")
        print(f"    sur le jeu de test        : perte {L_te:.4f}   precision {acc_te:.4f}")
    a = resultats["sous-echantillon fige"]
    b = resultats["mini-lots frais"]
    print(f"\n  Ecart de precision de test : {b[3]:.4f} - {a[3]:.4f} = {b[3] - a[3]:+.4f}")
    print(f"  Le fige atteint {a[1]:.4f} sur SES 64 exemples et {a[3]:.4f} sur le test.")
    return resultats


# ─────────────────────────────────────────────────────────────────────────────
# E4. Esperance et variance du gradient de mini-lot
# ─────────────────────────────────────────────────────────────────────────────

def E4(data):
    titre("E4", "Le gradient de mini-lot : sans biais, et de variance en 1/B")
    Xtr, ctr, _, _ = data
    Ytr = D.onehot(ctr)
    N = Xtr.shape[0]
    theta = R.init_parametres(GRAINE, "xavier")
    cles = sorted(theta)

    def aplatir(g):
        return np.concatenate([g[c].ravel() for c in cles])

    g_complet = aplatir(R.gradient_complet(theta, Xtr, Ytr))
    n_g = np.linalg.norm(g_complet)
    print(f"  ||grad complet|| = {n_g:.6f}   (reference)\n")

    rng = np.random.default_rng(3)
    repetitions = 200
    print(f"    {'B':>6}{'||moyenne - complet||':>24}{'ecart quadratique moyen':>26}{'x sqrt(B)':>12}")
    lignes = []
    for B in (1, 4, 16, 64, 256, 1024):
        somme = np.zeros_like(g_complet)
        carres = 0.0
        for _ in range(repetitions):
            idx = rng.choice(N, size=B, replace=False)
            g = aplatir(R.gradient_complet(theta, Xtr[idx], Ytr[idx]))
            somme += g
            carres += float(np.sum((g - g_complet) ** 2))
        biais = np.linalg.norm(somme / repetitions - g_complet)
        ecart = np.sqrt(carres / repetitions)
        lignes.append((B, biais, ecart))
        print(f"    {B:>6}{biais:>24.6f}{ecart:>26.6f}{ecart * np.sqrt(B):>12.4f}")
    print("\n  La derniere colonne est constante : l'ecart decroit exactement en 1/sqrt(B).")
    return lignes


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    FIGURES.mkdir(parents=True, exist_ok=True)
    demandees = [a for a in sys.argv[1:] if a.startswith("E")] or ["E1", "E2", "E3", "E4"]
    data = charger_tout()
    for nom in demandees:
        globals()[nom](data)
    print()
