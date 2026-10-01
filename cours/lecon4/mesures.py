"""
Chapitre 4 : « Ce que fait la rétropropagation ». Toutes les mesures.

CE FICHIER EST LA SOURCE DE TOUS LES NOMBRES DU CHAPITRE. Aucune valeur n'est
écrite dans le contenu sans sortir d'ici.

    python cours/lecon4/mesures.py

PROTOCOLE, identique à celui des chapitres 2 et 3 pour que les nombres soient
comparables :

    réseau          784 -> 128 -> 10, ReLU sur la couche cachée, softmax en sortie
    perte           entropie croisée
    initialisation  He, N(0, 2/d_in) ; biais à zéro
    graine          0
    état            NON ENTRAÎNÉ, sauf la mesure 4 qui descend sur un seul exemple

CE QUI CHANGE PAR RAPPORT AU CHAPITRE 3. Là-bas les exemples étaient empilés en
LIGNES pour traiter un lot d'un coup. Ici on suit UN exemple, et le programme
est écrit en vecteurs COLONNES, exactement comme le formalisme du chapitre :

    z^{[1]} = W^{[1]} x + b^{[1]}          (128, 784)(784,) -> (128,)
    z^{[2]} = W^{[2]} a^{[1]} + b^{[2]}    (10, 128)(128,)  -> (10,)

Il n'y a donc aucune transposition mentale à faire entre le texte et le code.

L'EXEMPLE DE TRAVAIL est désigné par un critère, jamais tiré au sort : c'est la
PREMIÈRE image de classe 2 du jeu d'entraînement. Le programme le vérifie et
imprime son indice, pour que rien ne dépende d'un nombre écrit à la main.
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# BLAS EST BRIDÉ AVANT L'IMPORT DE NUMPY. Les produits d'un seul exemple sont
# minuscules, (128, 784) par (784,) : synchroniser douze fils coûte plus cher
# que la multiplication. La mesure 7 chronomètre, elle ne doit pas mesurer un
# ordonnanceur.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402

GRAINE = 0
K = 10
H = 128
D_IN = 784
EPS = 1e-5
CLASSE_TEMOIN = 2


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


# ── Le réseau, en vecteurs colonnes ─────────────────────────────────────────


def softmax(z: np.ndarray) -> np.ndarray:
    e = np.exp(z - z.max())
    return e / e.sum()


def onehot(c: int) -> np.ndarray:
    y = np.zeros(K)
    y[c] = 1.0
    return y


def init(graine: int = GRAINE) -> dict:
    """He : N(0, 2/d_in), biais à zéro. Le même tirage qu'au chapitre 3."""
    rng = np.random.default_rng(graine)
    return {
        "W1": rng.normal(0.0, np.sqrt(2.0 / D_IN), size=(H, D_IN)),
        "b1": np.zeros(H),
        "W2": rng.normal(0.0, np.sqrt(2.0 / H), size=(K, H)),
        "b2": np.zeros(K),
    }


def avant(theta: dict, x: np.ndarray) -> dict:
    z1 = theta["W1"] @ x + theta["b1"]          # (128,)
    a1 = np.maximum(z1, 0.0)                    # (128,)
    z2 = theta["W2"] @ a1 + theta["b2"]         # (10,)
    a2 = softmax(z2)                            # (10,)
    return {"x": x, "z1": z1, "a1": a1, "z2": z2, "a2": a2}


def perte(a2: np.ndarray, c: int) -> float:
    return float(-np.log(max(a2[c], 1e-300)))


def arriere(theta: dict, cache: dict, c: int) -> dict:
    """
    L'algorithme du chapitre, écrit exactement comme les pages 3 à 9 l'établissent.

        delta2 = a2 - y                                   (proposition 1)
        grad_b2 = delta2                                  (proposition 3)
        grad_W2 = delta2 (a1)^T                           (proposition 4)
        grad_a1 = (W2)^T delta2                           (proposition 6)
        delta1  = grad_a1 (x) ReLU'(z1)                   (page 9)
        grad_b1 = delta1 ; grad_W1 = delta1 x^T
    """
    d2 = cache["a2"] - onehot(c)                          # (10,)
    g_W2 = np.outer(d2, cache["a1"])                      # (10, 128)
    g_b2 = d2
    g_a1 = theta["W2"].T @ d2                             # (128,)
    d1 = g_a1 * (cache["z1"] > 0.0)                       # (128,)
    g_W1 = np.outer(d1, cache["x"])                       # (128, 784)
    g_b1 = d1
    return {"W1": g_W1, "b1": g_b1, "W2": g_W2, "b2": g_b2,
            "delta2": d2, "delta1": d1, "grad_a1": g_a1}


def perte_de(theta: dict, x: np.ndarray, c: int) -> float:
    return perte(avant(theta, x)["a2"], c)


# ── Mesure 1 · l'exemple de travail ─────────────────────────────────────────


def mesure_1(theta: dict, X: np.ndarray, c: np.ndarray) -> dict:
    titre("MESURE 1 · L'EXEMPLE DE TRAVAIL")

    n = int(np.argmax(c == CLASSE_TEMOIN))
    print(f"  critère            première image de classe {CLASSE_TEMOIN} du jeu d'entraînement")
    print(f"  indice retenu      n = {n}")
    print(f"  étiquette          c = {int(c[n])}")

    x = X[n]
    cache = avant(theta, x)
    a2, z1 = cache["a2"], cache["z1"]
    grads = arriere(theta, cache, int(c[n]))
    d2 = grads["delta2"]

    sous_titre("La sortie du réseau non entraîné")
    print("      k    a_k         delta_k")
    for k in range(K):
        print(f"      {k}    {a2[k]:.4f}      {d2[k]:+.4f}")
    print()
    print(f"  perte de cet exemple            {perte(a2, int(c[n])):.6f}")
    print(f"  perte du hasard, ln 10          {np.log(10):.6f}")
    print(f"  classe prédite                  {int(a2.argmax())}")
    print(f"  la plus grande activation       {a2.max():.4f}   (classe {int(a2.argmax())})")

    sous_titre("Contrôle de la proposition 2 sur ces nombres")
    print(f"  somme des dix composantes       {d2.sum():+.3e}")
    print(f"  |delta_{CLASSE_TEMOIN}|                       {abs(d2[CLASSE_TEMOIN]):.6f}")
    print(f"  somme des neuf autres           {np.abs(np.delete(d2, CLASSE_TEMOIN)).sum():.6f}")
    print(f"  écart entre les deux            {abs(abs(d2[CLASSE_TEMOIN]) - np.abs(np.delete(d2, CLASSE_TEMOIN)).sum()):.3e}")

    sous_titre("La couche cachée")
    allumes = int((z1 > 0).sum())
    print(f"  neurones cachés allumés         {allumes} sur {H}")
    print(f"  neurones cachés éteints         {H - allumes} sur {H}")
    print(f"  pixels non nuls de l'image      {int((x > 0).sum())} sur {D_IN}")

    return {"n": n, "x": x, "c": int(c[n]), "cache": cache, "grads": grads,
            "allumes": allumes}


# ── Mesure 2 · différences finies centrées ──────────────────────────────────


def mesure_2(theta: dict, x: np.ndarray, c: int, grads: dict) -> None:
    titre("MESURE 2 · VÉRIFICATION PAR DIFFÉRENCES FINIES CENTRÉES")
    print(f"  epsilon = {EPS:.0e}")
    print("  50 coefficients tirés dans chaque bloc PARMI CEUX DE DÉRIVÉE NON NULLE.")
    print("  Le tirage est restreint parce que la mesure 8 montre que la plupart des")
    print("  coefficients de W^[1] ont une dérivée exactement nulle : les tirer")
    print(f"  ferait passer le contrôle sans rien contrôler. b^[2] n'a que {K}")
    print("  coefficients, tous non nuls : ils sont TOUS pris, ce bloc est exhaustif.")

    def _difference_centree(plat: np.ndarray, i: int) -> float:
        garde = plat[i]
        plat[i] = garde + EPS
        plus = perte_de(theta, x, c)
        plat[i] = garde - EPS
        moins = perte_de(theta, x, c)
        plat[i] = garde
        return (plus - moins) / (2.0 * EPS)

    rng = np.random.default_rng(1)
    tous_rel, tous_abs, tous_der = [], [], []
    print()
    print("      bloc    non nuls / total    contrôlés   écart rel. médian"
          "   écart rel. max   écart abs. max")
    for nom in ("W1", "b1", "W2", "b2"):
        plat = theta[nom].reshape(-1)
        g_plat = grads[nom].reshape(-1)
        candidats = np.flatnonzero(g_plat != 0.0)
        indices = rng.choice(candidats, size=min(50, candidats.size), replace=False)
        rel, absolu, derivees = [], [], []
        for i in indices:
            numerique = _difference_centree(plat, int(i))
            analytique = float(g_plat[i])
            ecart = abs(numerique - analytique)
            absolu.append(ecart)
            derivees.append(abs(analytique))
            rel.append(ecart / max(abs(numerique), abs(analytique)))
        rel, absolu, derivees = np.array(rel), np.array(absolu), np.array(derivees)
        tous_rel.append(rel)
        tous_abs.append(absolu)
        tous_der.append(derivees)
        print(f"      {nom:<6}  {candidats.size:>8} / {g_plat.size:<8}  {rel.size:>10}"
              f"   {np.median(rel):>15.2e}   {rel.max():>14.2e}   {absolu.max():>14.2e}")

    rel = np.concatenate(tous_rel)
    absolu = np.concatenate(tous_abs)
    derivees = np.concatenate(tous_der)
    print()
    print(f"  coefficients contrôlés                       {rel.size}")
    print(f"  ÉCART RELATIF MAXIMAL SUR LES {rel.size}            {rel.max():.3e}")
    print(f"  écart relatif médian sur les {rel.size}             {np.median(rel):.3e}")
    print(f"  écart ABSOLU maximal sur les {rel.size}             {absolu.max():.3e}")

    sous_titre("Les dérivées nulles le sont aussi par différences finies")
    nulles_ok, nulles_vues = 0, 0
    for nom in ("W1", "b1", "W2"):
        plat = theta[nom].reshape(-1)
        g_plat = grads[nom].reshape(-1)
        candidats = np.flatnonzero(g_plat == 0.0)
        for i in rng.choice(candidats, size=min(50, candidats.size), replace=False):
            nulles_vues += 1
            if _difference_centree(plat, int(i)) == 0.0:
                nulles_ok += 1
    print(f"  coefficients de dérivée analytique nulle contrôlés   {nulles_vues}")
    print(f"  dont la différence finie vaut exactement zéro        {nulles_ok}")

    sous_titre("D'où vient le peu qui reste : l'écart absolu a un plancher commun")
    seuil = np.median(derivees)
    petites, grandes = derivees <= seuil, derivees > seuil
    print(f"  |dérivée| médiane des {rel.size} coefficients contrôlés   {seuil:.4f}")
    print(f"  |dérivée| du coefficient d'écart relatif maximal    "
          f"{derivees[int(rel.argmax())]:.2e}")
    print(f"  écart ABSOLU médian, dérivées sous la médiane       "
          f"{np.median(absolu[petites]):.2e}")
    print(f"  écart ABSOLU médian, dérivées au-dessus             "
          f"{np.median(absolu[grandes]):.2e}")
    print(f"  écart RELATIF médian, dérivées sous la médiane      "
          f"{np.median(rel[petites]):.2e}")
    print(f"  écart RELATIF médian, dérivées au-dessus            "
          f"{np.median(rel[grandes]):.2e}")
    plancher = np.finfo(float).eps * perte_de(theta, x, c) / (2.0 * EPS)
    print(f"  plancher d'annulation, eps_machine x l / (2 eps)    {plancher:.2e}")


# ── Mesure 3 · les trois voies ──────────────────────────────────────────────


def mesure_3(theta: dict, cache: dict, grads: dict) -> None:
    titre("MESURE 3 · LES TROIS VOIES, SUR LE NEURONE DE SORTIE DE LA CLASSE 2")

    a1 = cache["a1"]
    d2 = grads["delta2"]
    c = CLASSE_TEMOIN

    actifs = np.flatnonzero(a1 > 0)
    ordre = actifs[np.argsort(-a1[actifs])]
    choisis = [int(ordre[0]), int(ordre[1]), int(ordre[2]), int(ordre[-1])]

    sous_titre("Le biais, et un poids")
    print(f"  dérivée par rapport au biais b^[2]_{c}          {grads['b2'][c]:+.6f}")
    j = choisis[0]
    print(f"  dérivée par rapport au poids W^[2]_({c},{j})       {grads['W2'][c, j]:+.6f}")
    print(f"  activation a^[1]_{j}                          {a1[j]:.4f}")
    print(f"  contrôle de l'identité delta_{c} x a_{j}         {d2[c] * a1[j]:+.6f}")
    print(f"  écart entre la dérivée et le produit          {abs(grads['W2'][c, j] - d2[c] * a1[j]):.3e}")

    sous_titre(f"Proportionnalité à l'activation, ligne k = {c} (delta_k < 0)")
    print("      j       a_j        d l / d W_kj      quotient")
    for j in choisis:
        q = grads["W2"][c, j] / a1[j]
        print(f"      {j:<6}  {a1[j]:.4f}     {grads['W2'][c, j]:+.6f}       {q:+.6f}")
    print()
    print(f"  delta_{c}                                      {d2[c]:+.6f}")
    print(f"  rapport de la plus grande à la plus petite    {a1[choisis[0]] / a1[choisis[-1]]:.1f}")

    k = int(np.argmax(d2))
    sous_titre(f"Le même tableau pour une ligne k = {k} (delta_k > 0)")
    print("      j       a_j        d l / d W_kj      quotient")
    for j in choisis:
        q = grads["W2"][k, j] / a1[j]
        print(f"      {j:<6}  {a1[j]:.4f}     {grads['W2'][k, j]:+.6f}       {q:+.6f}")
    print()
    print(f"  delta_{k}                                      {d2[k]:+.6f}")
    print("  LES SIGNES SONT INVERSÉS : chaque dérivée de cette ligne est positive,")
    print("  et le quotient vaut delta_k, positif, identique aux quatre lignes.")

    # ── La troisième voie : ce que les dix sorties demandent à UNE activation ──
    j = choisis[0]
    sous_titre(f"La troisième voie : les dix demandes sur l'activation a^[1]_{j}")
    print(f"  a^[1]_{j} = {a1[j]:.4f}, neurone ALLUMÉ (z^[1]_{j} = {cache['z1'][j]:+.4f})")
    print()
    print("      k     delta_k       W^[2]_kj      delta_k W_kj    sens demandé")
    total = 0.0
    for kk in range(K):
        contribution = d2[kk] * theta["W2"][kk, j]
        total += contribution
        sens = "monter" if contribution < 0 else "descendre"
        print(f"      {kk}     {d2[kk]:+.4f}       {theta['W2'][kk, j]:+.4f}"
              f"       {contribution:+.6f}      {sens}")
    print()
    print(f"  somme des dix contributions                   {total:+.6f}")
    print(f"  composante {j} de (W^[2])^T delta^[2]            {grads['grad_a1'][j]:+.6f}")
    print(f"  écart entre les deux                          "
          f"{abs(total - grads['grad_a1'][j]):.3e}")
    print(f"  composante {j} de delta^[1], après la porte ReLU  {grads['delta1'][j]:+.6f}")

    eteint = int(np.flatnonzero(cache["z1"] <= 0)[0])
    print()
    print(f"  pour comparaison, le neurone ÉTEINT j = {eteint} "
          f"(z^[1]_{eteint} = {cache['z1'][eteint]:+.4f})")
    print(f"      demande reçue,  (W^[2])^T delta^[2] en {eteint}    "
          f"{grads['grad_a1'][eteint]:+.6f}")
    print(f"      composante {eteint} de delta^[1]                  "
          f"{grads['delta1'][eteint]:+.6f}")

    sous_titre("Le signe se lit sur le poids, ligne k = 2 (delta_2 < 0)")
    W2 = theta["W2"]
    positifs = [int(v) for v in np.flatnonzero((W2[c] > 0) & (a1 > 0))[:2]]
    negatifs = [int(v) for v in np.flatnonzero((W2[c] < 0) & (a1 > 0))[:2]]
    print("      j       W^[2]_2j      delta_2 W_2j     l'activation doit")
    for j in positifs + negatifs:
        contribution = d2[c] * W2[c, j]
        print(f"      {j:<6}  {W2[c, j]:+.4f}       {contribution:+.6f}       "
              f"{'monter' if contribution < 0 else 'descendre'}")


# ── Mesure 4 · n'écouter qu'un seul exemple ─────────────────────────────────


def mesure_4(x: np.ndarray, c: int, X_test: np.ndarray, c_test: np.ndarray) -> None:
    titre("MESURE 4 · SI L'ON N'ÉCOUTE QU'UN SEUL EXEMPLE")
    eta, pas = 0.5, 200
    print(f"  {pas} pas de descente sur la seule image de travail, eta = {eta}")

    theta = init()
    depart = perte_de(theta, x, c)

    Z1 = X_test @ theta["W1"].T + theta["b1"]
    Z2 = np.maximum(Z1, 0.0) @ theta["W2"].T + theta["b2"]
    avant_pas = float(np.mean(Z2.argmax(axis=1) == c_test))

    for _ in range(pas):
        cache = avant(theta, x)
        g = arriere(theta, cache, c)
        for cle in ("W1", "b1", "W2", "b2"):
            theta[cle] -= eta * g[cle]
    fin = perte_de(theta, x, c)

    Z1 = X_test @ theta["W1"].T + theta["b1"]
    A1 = np.maximum(Z1, 0.0)
    Z2 = A1 @ theta["W2"].T + theta["b2"]
    predites = Z2.argmax(axis=1)

    part = float(np.mean(predites == CLASSE_TEMOIN))
    exactitude = float(np.mean(predites == c_test))
    frequence = float(np.mean(c_test == CLASSE_TEMOIN))

    a2_fin = avant(theta, x)["a2"]
    print()
    print(f"  précision de test AVANT les pas                {avant_pas:.4f}")
    print(f"  perte sur cette image avant les pas             {depart:.6f}")
    print(f"  perte sur cette image après {pas} pas             {abs(fin):.6f}"
          f"   (sous le seuil de représentation)")
    print(f"  probabilité accordée à la classe {CLASSE_TEMOIN} après       {a2_fin[CLASSE_TEMOIN]:.10f}")
    print(f"  images de test prédites « {CLASSE_TEMOIN} »                  "
          f"{int((predites == CLASSE_TEMOIN).sum())} sur {len(c_test)}")
    print(f"  part des images de test prédites « {CLASSE_TEMOIN} »         {100.0 * part:.2f} %")
    print(f"  précision de test                              {exactitude:.4f}")
    print(f"  fréquence de la classe {CLASSE_TEMOIN} dans le jeu de test    "
          f"{int((c_test == CLASSE_TEMOIN).sum())} / {len(c_test)} = {frequence:.4f}")
    print(f"  écart entre la précision et cette fréquence     {abs(exactitude - frequence):.3e}")

    comptes = np.bincount(c_test, minlength=K)
    meilleure = int(comptes.argmax())
    print()
    print(f"  la classe la plus fréquente du jeu de test     {meilleure}, "
          f"{int(comptes[meilleure])} / {len(c_test)} = {comptes[meilleure] / len(c_test):.4f}")
    print("  c'est le plafond de tout réseau qui répond toujours la même chose")


# ── Mesure 5 · deux exemples ne demandent pas la même chose ─────────────────


def _gradient_plat(theta: dict, x: np.ndarray, c: int) -> np.ndarray:
    g = arriere(theta, avant(theta, x), c)
    return np.concatenate([g["W1"].reshape(-1), g["b1"], g["W2"].reshape(-1), g["b2"]])


def mesure_5(theta: dict, X: np.ndarray, c: np.ndarray) -> None:
    titre("MESURE 5 · DEUX EXEMPLES NE DEMANDENT PAS LA MÊME CHOSE")
    n_paires = 2000
    print(f"  cosinus entre les gradients de deux exemples pris séparément")
    print(f"  réseau non entraîné, {n_paires} paires de chaque sorte")

    rng = np.random.default_rng(7)
    par_classe = [np.flatnonzero(c[:20000] == k) for k in range(K)]
    debut = time.perf_counter()

    memes, differentes = [], []
    for _ in range(n_paires):
        k = int(rng.integers(K))
        i, j = rng.choice(par_classe[k], size=2, replace=False)
        gi, gj = _gradient_plat(theta, X[i], k), _gradient_plat(theta, X[j], k)
        memes.append(float(gi @ gj / (np.linalg.norm(gi) * np.linalg.norm(gj))))

    for _ in range(n_paires):
        k1, k2 = rng.choice(K, size=2, replace=False)
        i = int(rng.choice(par_classe[k1]))
        j = int(rng.choice(par_classe[k2]))
        gi, gj = _gradient_plat(theta, X[i], int(k1)), _gradient_plat(theta, X[j], int(k2))
        differentes.append(float(gi @ gj / (np.linalg.norm(gi) * np.linalg.norm(gj))))

    memes, differentes = np.array(memes), np.array(differentes)
    print()
    print("      paires                cosinus moyen     écart-type     paires")
    print(f"      même classe            {memes.mean():+.4f}          {memes.std():.4f}        {memes.size}")
    print(f"      classes différentes    {differentes.mean():+.4f}          {differentes.std():.4f}        {differentes.size}")
    print()
    print(f"  durée de la mesure                             {time.perf_counter() - debut:.1f} s")


# ── Mesure 6 · le contrôle de Hebb ──────────────────────────────────────────


def mesure_6(cache: dict, grads: dict) -> None:
    titre("MESURE 6 · LE CONTRÔLE DE HEBB")
    print("  les dix couples (neurone caché j, neurone de sortie k) dont le poids")
    print("  W^[2]_kj reçoit la plus forte AUGMENTATION, c'est-à-dire dont")
    print("  -d l / d W_kj est le plus grand")

    a1 = cache["a1"]
    hausse = -grads["W2"]                                  # (10, 128)
    plats = np.argsort(-hausse.reshape(-1))[:10]
    rangs_a = {int(j): r + 1 for r, j in enumerate(np.argsort(-a1))}

    print()
    print("      rang    k     j       a_j        -d l / d W_kj    rang de a_j")
    for rang, plat in enumerate(plats, start=1):
        k, j = int(plat // H), int(plat % H)
        print(f"      {rang:<6}  {k:<4}  {j:<6}  {a1[j]:.4f}     {hausse[k, j]:+.6f}"
              f"        {rangs_a[j]}")

    ks = {int(p // H) for p in plats}
    js = [int(p % H) for p in plats]
    print()
    print(f"  neurones de sortie concernés                   {sorted(ks)}")
    print(f"  la vraie classe est                            {CLASSE_TEMOIN}")
    print(f"  rangs d'activation des dix neurones cachés     "
          f"{sorted(rangs_a[j] for j in js)}")
    print(f"  activation la plus faible des dix              {min(a1[j] for j in js):.4f}")
    print(f"  activation la plus forte des 128               {a1.max():.4f}")


# ── Mesure 7 · le coût comparé ──────────────────────────────────────────────


def mesure_7(theta: dict, x: np.ndarray, c: int) -> None:
    titre("MESURE 7 · LE COÛT COMPARÉ")
    p = sum(v.size for v in theta.values())

    sous_titre("Le compte des propagations, qui ne dépend d'aucune machine")
    print(f"  coefficients du réseau                              {p}")
    print(f"  différences finies centrées, propagations avant     {2 * p}")
    print("  rétropropagation, propagations avant                1")
    print("  rétropropagation, propagations arrière              1")
    print(f"  rapport des propagations avant                      {2 * p}")

    def _meilleur(action, appels: int, essais: int = 3) -> float:
        """
        Le MINIMUM de trois séries, pas la moyenne. Un chronomètre ne mesure
        jamais moins que le coût réel ; tout ce qui dépasse est de la charge
        machine. Le minimum est donc l'estimation la moins polluée, et la
        seule qui se reproduise d'une exécution à l'autre.
        """
        meilleurs = []
        for _ in range(essais):
            debut = time.perf_counter()
            for _ in range(appels):
                action()
            meilleurs.append((time.perf_counter() - debut) / appels)
        return min(meilleurs)

    t_avant = _meilleur(lambda: avant(theta, x), 2000)
    t_retro = _meilleur(lambda: arriere(theta, avant(theta, x), c), 2000)

    sous_titre("Le temps unitaire, meilleur de trois séries de 2 000 appels")
    print(f"  une propagation avant seule                    {t_avant * 1e6:.1f} us")
    print(f"  un gradient complet par rétropropagation       {t_retro * 1e6:.1f} us")
    print(f"  surcoût de la passe arrière                    "
          f"{(t_retro - t_avant) / t_avant * 100:.0f} %")

    sous_titre("Le même gradient par différences finies")
    estime = 2 * p * t_avant
    print(f"  estimation, {2 * p} x le temps d'une propagation   {estime:.1f} s")

    debut = time.perf_counter()
    for nom in ("W1", "b1", "W2", "b2"):
        plat = theta[nom].reshape(-1)
        for i in range(plat.size):
            garde = plat[i]
            plat[i] = garde + EPS
            perte_de(theta, x, c)
            plat[i] = garde - EPS
            perte_de(theta, x, c)
            plat[i] = garde
    mesure = time.perf_counter() - debut
    print(f"  mesure réelle de la boucle complète            {mesure:.1f} s")
    print(f"  écart entre l'estimation et la mesure          "
          f"{abs(mesure - estime) / mesure * 100:.0f} %")

    sous_titre("Le rapport")
    print(f"  différences finies / rétropropagation, estimé  {estime / t_retro:.0f}")
    print(f"  différences finies / rétropropagation, mesuré  {mesure / t_retro:.0f}")
    print("  LES DURÉES DÉPENDENT DE LA MACHINE ET DE SA CHARGE.")
    print(f"  Le nombre qui n'en dépend pas est {2 * p} propagations contre 1.")


# ── Mesure 8 · les zéros de la première couche ──────────────────────────────


def mesure_8(cache: dict, grads: dict, allumes: int) -> None:
    titre("MESURE 8 · LES ZÉROS DE grad_W1 SUR L'IMAGE DE TRAVAIL")

    x = cache["x"]
    pixels_non_nuls = int((x > 0).sum())
    pixels_nuls = D_IN - pixels_non_nuls

    sous_titre("La prédiction, faite AVANT de compter")
    print(f"  grad_W1 = delta^[1] x^T, de taille              {H} x {D_IN} = {H * D_IN}")
    print(f"  son coefficient (j, i) vaut delta^[1]_j x_i, nul dès que l'un des deux l'est")
    print(f"  neurones cachés allumés                        {allumes}")
    print(f"  pixels non nuls                                {pixels_non_nuls}")
    print(f"  coefficients NON nuls prédits                  {allumes} x {pixels_non_nuls}"
          f" = {allumes * pixels_non_nuls}")
    print(f"  coefficients nuls prédits                      {H * D_IN}"
          f" - {allumes * pixels_non_nuls} = {H * D_IN - allumes * pixels_non_nuls}")

    sous_titre("La mesure")
    g = grads["W1"]
    nuls = int((g == 0.0).sum())
    d1 = grads["delta1"]
    lignes_nulles = int((np.abs(d1) == 0.0).sum())
    par_pixel = int(pixels_nuls * H)
    par_neurone = int(lignes_nulles * pixels_non_nuls)
    print(f"  coefficients exactement nuls                   {nuls}")
    print(f"  écart à la prédiction                          "
          f"{nuls - (H * D_IN - allumes * pixels_non_nuls)}")
    print()
    print(f"  nuls parce que le pixel d'entrée est nul       {pixels_nuls} x {H} = {par_pixel}")
    print(f"  nuls parce que le neurone caché est éteint     "
          f"{lignes_nulles} x {pixels_non_nuls} = {par_neurone}")
    print(f"  somme des deux causes                          {par_pixel + par_neurone}")
    print(f"  lignes de grad_W1 entièrement nulles           {lignes_nulles} sur {H}")
    print(f"  colonnes de grad_W1 entièrement nulles         {pixels_nuls} sur {D_IN}")
    print(f"  part de coefficients nuls                      "
          f"{100.0 * nuls / (H * D_IN):.2f} %")


# ── Le programme ────────────────────────────────────────────────────────────


def main() -> None:
    _console_utf8()
    depart = time.perf_counter()

    print("Chapitre 4 · Ce que fait la rétropropagation · toutes les mesures")
    print(f"  protocole   784 -> {H} -> {K}, ReLU, softmax, entropie croisée")
    print(f"  init        He, N(0, 2/d_in), biais nuls, graine {GRAINE}")
    print("  état        NON ENTRAÎNÉ, sauf la mesure 4")

    X, c, X_test, c_test = D.charger()
    theta = init()
    print(f"  paramètres  {sum(v.size for v in theta.values())}")

    m1 = mesure_1(theta, X, c)
    mesure_2(theta, m1["x"], m1["c"], m1["grads"])
    mesure_3(theta, m1["cache"], m1["grads"])
    mesure_4(m1["x"], m1["c"], X_test, c_test)
    mesure_5(theta, X, c)
    mesure_6(m1["cache"], m1["grads"])
    mesure_7(theta, m1["x"], m1["c"])
    mesure_8(m1["cache"], m1["grads"], m1["allumes"])

    titre("FIN")
    print(f"  durée totale  {time.perf_counter() - depart:.1f} s")


if __name__ == "__main__":
    main()
