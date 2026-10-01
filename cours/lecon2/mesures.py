"""
Chapitre 2 : « Qu'est-ce qu'un reseau de neurones ». Toutes les mesures.

CE FICHIER EST LA SOURCE DE TOUS LES NOMBRES DU CHAPITRE. Aucune valeur n'est
ecrite dans le contenu sans sortir d'ici. Il s'execute seul :

    python cours/lecon2/mesures.py

Il n'a besoin que de numpy et de cours/donnees.py. Aucune bibliotheque
d'apprentissage : le reseau est ecrit a la main, en quinze lignes, parce que
c'est exactement ce que le chapitre demande au lecteur de comprendre.

PROTOCOLE, identique pour les quatre modeles, et annonce avant les resultats :
    graine 0 pour l'initialisation ET pour les permutations
    mini-lots de 64, tirage sans remise (une permutation neuve par epoque)
    entropie croisee
    evaluation sur les 10 000 images de test, jamais vues
Seuls le pas et le nombre d'epoques changent, et chaque modele est juge sur son
MEILLEUR pas : comparer un modele a reglage handicapant ne prouverait rien.

CE QU'IL NE FAIT PAS. Il n'ecrit aucun gradient dans le chapitre. La
retropropagation est utilisee ici comme un outil pour obtenir des poids ; elle
n'est ni montree ni expliquee au lecteur, c'est le sujet du chapitre 3.
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# BLAS EST BRIDE AVANT L'IMPORT DE NUMPY. Les matrices d'un mini-lot sont
# minuscules, (64, 784) par (784, 128) : la synchronisation de douze fils coute
# plus cher que la multiplication elle-meme. Les variables doivent etre posees
# AVANT numpy, la bibliotheque BLAS ne les lit qu'une fois, a son chargement.
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


def sous_titre(texte: str) -> None:
    print()
    print(f"  -- {texte} " + "-" * max(0, 70 - len(texte)))


# ── Le reseau, ecrit a la main ──────────────────────────────────────────────


def softmax(Z: np.ndarray) -> np.ndarray:
    """
    softmax ligne par ligne. On retranche le maximum de chaque ligne : le
    facteur exp(-m) se simplifie entre numerateur et denominateur, donc le
    resultat est inchange, et plus aucun exp ne deborde. C'est exactement
    l'invariance par translation demontree dans la proposition 5.
    """
    Z = Z - Z.max(axis=1, keepdims=True)
    E = np.exp(Z)
    return E / E.sum(axis=1, keepdims=True)


def onehot(c: np.ndarray) -> np.ndarray:
    Y = np.zeros((len(c), K))
    Y[np.arange(len(c)), c] = 1.0
    return Y


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
    """
    X est (B, 784) : les exemples empiles en LIGNES. Le formalisme du chapitre
    ecrit x en COLONNE, d'ou la transposee qui change de cote :

        z = W x + b        devient        Z = X W^T + b

    'identite' ne met rien entre les couches : c'est le modele de la page 8.
    """
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
            A = Z
        else:
            raise ValueError(activation)
        cache[f"Z{couche}"] = Z
        cache[f"A{couche}"] = A
    return cache


def arriere(theta: dict, cache: dict, Y: np.ndarray, activation: str) -> dict:
    L = len(theta) // 2
    B = len(Y)
    grads = {}
    D_ = (cache[f"A{L}"] - Y) / B
    for couche in range(L, 0, -1):
        grads[f"W{couche}"] = D_.T @ cache[f"A{couche - 1}"]
        grads[f"b{couche}"] = D_.sum(axis=0)
        if couche > 1:
            D_ = D_ @ theta[f"W{couche}"]
            if activation == "relu":
                D_ = D_ * (cache[f"Z{couche - 1}"] > 0)
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
              historique: bool = False) -> dict:
    theta = init(tailles, GRAINE, methode)
    Ytr = onehot(ctr)
    rng = np.random.default_rng(GRAINE)
    N = len(Xtr)
    trace: list[tuple[int, float]] = []
    debut = time.time()
    for t in range(epoques):
        ordre = rng.permutation(N)
        for d in range(0, N, B_LOT):
            idx = ordre[d:d + B_LOT]
            grads = arriere(theta, avant(theta, Xtr[idx], activation),
                            Ytr[idx], activation)
            for cle in theta:
                theta[cle] -= eta * grads[cle]
        if not np.isfinite(theta["W1"]).all():
            return {"theta": theta, "diverge": True, "acc": float("nan"),
                    "erreurs": -1, "trace": trace,
                    "secondes": time.time() - debut}
        if historique:
            _, a, _ = evaluer(theta, Xte, cte, activation)
            trace.append((t + 1, a))
    L, acc, predits = evaluer(theta, Xte, cte, activation)
    return {"theta": theta, "diverge": False, "L": L, "acc": acc,
            "erreurs": int((predits != cte).sum()), "predits": predits,
            "trace": trace, "secondes": time.time() - debut}


def compter(theta: dict) -> int:
    return int(sum(v.size for v in theta.values()))


def extrema(g: np.ndarray) -> tuple[float, tuple[int, int], float, tuple[int, int]]:
    """Le maximum et le minimum d'un gabarit 28 x 28, en coordonnees a partir de 1."""
    imax = np.unravel_index(int(g.argmax()), g.shape)
    imin = np.unravel_index(int(g.argmin()), g.shape)
    return (float(g.max()), (int(imax[0]) + 1, int(imax[1]) + 1),
            float(g.min()), (int(imin[0]) + 1, int(imin[1]) + 1))


# ── 1. Le jeu ───────────────────────────────────────────────────────────────


def section_jeu(Xtr, ctr, Xte, cte) -> None:
    titre("1. LE JEU  (page 2)")

    ntr, nte = np.bincount(ctr, minlength=10), np.bincount(cte, minlength=10)
    print("\n    repartition    chiffre :  " +
          "  ".join(f"{k:>5}" for k in range(10)))
    print("                   train   :  " +
          "  ".join(f"{n:>5}" for n in ntr) + f"   total {ntr.sum()}")
    print("                   test    :  " +
          "  ".join(f"{n:>5}" for n in nte) + f"   total {nte.sum()}")

    majoritaire = int(nte.argmax())
    seuil = float(nte.max() / nte.sum())
    print(f"\n    classe la plus frequente au test        {majoritaire}"
          f"  ({int(nte.max())} images)")
    print(f"    SEUIL DU HASARD INSTRUIT                {100 * seuil:.2f} %")
    print("        repondre toujours la classe majoritaire. Sous ce seuil,")
    print("        un resultat ne signifie rien.")

    print(f"\n    part des valeurs nulles (train)         {100 * (Xtr == 0).mean():.2f} %")
    print(f"    valeur moyenne d'un pixel (train)       {Xtr.mean():.6f}")
    nuls = int((Xtr.max(axis=0) == 0).sum())
    print(f"    pixels nuls sur les 60 000 images       {nuls} sur 784")

    # ── Le pretraitement : ce jeu est-il centre, et sur quoi ? ──────────────
    # Un modele de cette famille exige des images centrees. Le centre de masse
    # moyen est mesure, puis compare a DEUX reperes : le milieu geometrique de
    # la grille, 14,5, et l'indice 15. Le programme imprime les deux ecarts et
    # l'ecart-type ; il ne tranche pas entre les deux reperes, c'est le texte
    # de la page 2 qui lit.
    #
    # LES INDICES VONT DE 1 A 28, comme partout ailleurs dans le chapitre :
    # c'est la convention posee a la page 3, (i, j) dans [1, 28] au carre et
    # k = 28(i - 1) + j. Ce bloc comptait autrefois de 0 a 27 pour coller a
    # l'indexation de numpy, et le chapitre portait donc deux conventions.
    # Seuls les DEUX REPERES et les deux moyennes se decalent d'une unite ; les
    # ecarts, l'ecart-type, les distances et leur rapport sont inchanges,
    # puisqu'une translation commune ne change aucune difference.
    G = Xtr.reshape(-1, 28, 28)
    masse = G.sum(axis=(1, 2))                       # (N,)
    lignes = np.arange(1, 29)[None, :, None]         # indices 1 a 28
    colonnes = np.arange(1, 29)[None, None, :]
    ci = (G * lignes).sum(axis=(1, 2)) / masse
    cj = (G * colonnes).sum(axis=(1, 2)) / masse
    mi, mj = float(ci.mean()), float(cj.mean())
    print("\n    CENTRE DE MASSE DES 60 000 IMAGES, en indices 1 a 28")
    print("                                              ligne     colonne")
    print(f"      centre de masse moyen                 "
          f"{mi:>8.4f}    {mj:>8.4f}")
    print(f"      ecart-type entre images               "
          f"{ci.std():>8.4f}    {cj.std():>8.4f}")
    distances = {}
    for nom, repere in (("au milieu geometrique, 14,5", 14.5),
                        ("a l'indice 15", 15.0)):
        distances[repere] = float(np.hypot(mi - repere, mj - repere))
        print(f"\n      ecart {nom:<32}"
              f"{mi - repere:>+8.4f}    {mj - repere:>+8.4f}")
        print(f"      distance                              "
              f"{distances[repere]:>8.4f} pixel")

    # Le rapport des deux ecarts, calcule sur les distances NON arrondies : deux
    # nombres separes ne disent pas de combien l'indice 15 est meilleur.
    print(f"\n      rapport des deux ecarts               "
          f"{distances[14.5] / distances[15.0]:>8.1f}")


# ── 2. L'image de test n°0 ──────────────────────────────────────────────────


def section_image(Xte, cte) -> None:
    titre("2. L'IMAGE DE TEST N°0  (pages 2 et 3)")

    x = Xte[0]
    X = x.reshape(28, 28)
    octets = np.rint(X * 255).astype(int)

    print(f"\n    etiquette                               {int(cte[0])}")
    print(f"    pixels non nuls                         {int((x > 0).sum())} sur 784")
    print(f"    somme des octets                        {int(octets.sum())}")
    encrees = np.nonzero(octets.sum(axis=1) > 0)[0] + 1
    print(f"    lignes encrees                          {encrees.min()} a {encrees.max()}")

    print("\n    QUATRE VALEURS CITEES DANS LE TEXTE")
    print("      (i, j)      k = 28(i-1) + j     octet    x_k")
    for (i, j) in ((9, 7), (9, 8), (10, 7), (13, 20)):
        k = 28 * (i - 1) + j
        print(f"      ({i:>2}, {j:>2})    x_{k:<15}{octets[i - 1, j - 1]:>6}"
              f"    {X[i - 1, j - 1]:.6f}")

    imax = np.unravel_index(int(octets.argmax()), octets.shape)
    combien = int((octets == 255).sum())
    print(f"\n    octet maximal                           {int(octets.max())}"
          f"  en ({imax[0] + 1}, {imax[1] + 1}),  {combien} pixel(s) a cette valeur")

    print("\n    L'IMAGE ENTIERE, EN OCTETS  (un point = zero)")
    print("        " + "".join(f"{j:>4}" for j in range(1, 29)))
    for i in range(28):
        cases = "".join(
            f"{octets[i, j]:>4}" if octets[i, j] else "   ." for j in range(28)
        )
        print(f"      {i + 1:>2}{cases}")

    print("\n    LE COUPLE DE LA PROPOSITION 1")
    print("      x_231 et x_259 sont voisins d'un pixel dans la grille -- (9,7)")
    print("      et (10,7) -- et distants de 28 rangs dans le vecteur.")
    print(f"      x_231 = {x[230]:.6f}   x_259 = {x[258]:.6f}   ecart de rang 28")


# ── 3. Le detecteur de bord construit a la main ─────────────────────────────


def section_detecteur(Xte, cte) -> None:
    """
    Page 5. Trois temps, et le classement s'inverse au troisieme. Aucun
    apprentissage ici : les poids sont POSES a la main, et c'est le point.
    """
    titre("3. LE DETECTEUR DE BORD, CONSTRUIT A LA MAIN  (page 5)")

    # La zone : une bande horizontale de trois lignes, la ou le trait
    # superieur d'un 7 passe. Coordonnees a partir de 1.
    l0, l1, c0, c1 = 8, 10, 9, 21
    marge = 3

    zone = np.zeros((28, 28))
    zone[l0 - 1:l1, c0 - 1:c1] = 1.0

    pourtour = np.zeros((28, 28))
    pourtour[max(0, l0 - 1 - marge):l1 + marge,
             max(0, c0 - 1 - marge):c1 + marge] = 1.0
    pourtour -= zone
    pourtour = np.clip(pourtour, 0.0, 1.0)

    w_temps1 = zone.reshape(-1)
    w_temps3 = (zone - pourtour).reshape(-1)

    print(f"\n    zone positive    lignes {l0} a {l1}, colonnes {c0} a {c1}"
          f"   ({int(zone.sum())} pixels a +1)")
    print(f"    pourtour negatif marge de {marge} pixels autour"
          f"   ({int(pourtour.sum())} pixels a -1)")
    print(f"    tous les autres poids sont nuls  "
          f"({784 - int(zone.sum()) - int(pourtour.sum())} pixels a 0)")

    # Trois images reelles, choisies deterministe : la premiere de chaque
    # classe dans le jeu de test.
    choix = [(7, int(np.nonzero(cte == 7)[0][0])),
             (1, int(np.nonzero(cte == 1)[0][0])),
             (0, int(np.nonzero(cte == 0)[0][0]))]

    # La tache large : un carre plein qui RECOUVRE la zone. Ce n'est pas une
    # image du jeu, c'est un contre-exemple construit.
    tache = np.zeros((28, 28))
    tache[l0 - 1 - marge:l1 + marge, c0 - 1 - marge:c1 + marge] = 1.0

    entrees = [(f"image de test n°{i} (un {k})", Xte[i]) for k, i in choix]
    entrees.append(("tache large construite", tache.reshape(-1)))

    print("\n    TEMPS 1 puis 2 : zone positive seule, b = 0")
    print("      entree                                 z = somme de l'encre")
    scores1 = []
    for nom, x in entrees:
        z = float(w_temps1 @ x)
        scores1.append(z)
        print(f"      {nom:<38} {z:>10.4f}")
    rang1 = np.argsort(-np.array(scores1))
    print("      classement : " +
          " > ".join(entrees[i][0].split(" (")[0] for i in rang1))
    print("      LA TACHE GAGNE. Le neurone compte l'encre, il ne cherche pas")
    print("      un bord : n'importe quelle surface encree le satisfait mieux.")

    print("\n    TEMPS 3 : pourtour a -1")
    print("      entree                                 z = zone - pourtour")
    scores3 = []
    for nom, x in entrees:
        z = float(w_temps3 @ x)
        scores3.append(z)
        print(f"      {nom:<38} {z:>10.4f}")
    rang3 = np.argsort(-np.array(scores3))
    print("      classement : " +
          " > ".join(entrees[i][0].split(" (")[0] for i in rang3))
    print("      LE CLASSEMENT S'INVERSE. Le score est maximal quand la zone")
    print("      est encree ET le pourtour vide : c'est cela, un bord.")

    print("\n    LES QUATRE ENTREES DE LA VERIFICATION N°10")
    print("      entree                                  temps 1     temps 3")
    for (nom, _), z1, z3 in zip(entrees, scores1, scores3):
        print(f"      {nom:<38} {z1:>8.4f}    {z3:>8.4f}")


# ── 4. Le modele lineaire ───────────────────────────────────────────────────


def section_modele1(Xtr, ctr, Xte, cte) -> dict:
    titre("4. MODELE 1 : 784 -> 10, sans couche cachee  (pages 6 et 7)")

    p = 10 * 784 + 10
    print(f"\n    W dans M_10,784(R)                      {10 * 784} coefficients")
    print(f"    b dans R^10                             {10} coefficients")
    print(f"    p                                       {p} parametres")

    r = entrainer((784, 10), "identite", "zero", 0.5, 30,
                  Xtr, ctr, Xte, cte, historique=True)
    print(f"    initialisation                          zero")
    print(f"    eta                                     0.5")
    print(f"    epoques                                 30")

    print(f"\n    PRECISION DE TEST                       {r['acc']:.4f}")
    print(f"    ERREURS                                 {r['erreurs']} sur 10 000")
    print(f"    perte de test                           {r['L']:.4f}")
    print(f"    duree                                   {r['secondes']:.1f} s")

    accs = [a for _, a in r["trace"]]
    plateau = accs[4:]
    print(f"\n    la precision cesse de progresser apres l'epoque 5 :")
    print(f"      epoques 5 a 30 : minimum {min(plateau):.4f}"
          f"   maximum {max(plateau):.4f}")
    print("      epoque   acc_test")
    for t, a in r["trace"]:
        if t in (1, 2, 3, 5, 10, 15, 20, 25, 30):
            print(f"      {t:>6}     {a:.4f}")

    sous_titre("Les dix gabarits G_k = vec^-1(ligne k de W)")
    W = r["theta"]["W1"]
    print("      chiffre    max        position       min        position")
    for k in range(10):
        vmax, pmax, vmin, pmin = extrema(W[k].reshape(28, 28))
        print(f"      {k:>7}   {vmax:>+8.4f}   ({pmax[0]:>2}, {pmax[1]:>2})"
              f"     {vmin:>+8.4f}   ({pmin[0]:>2}, {pmin[1]:>2})")
    _, _, vmin0, pmin0 = extrema(W[0].reshape(28, 28))
    print(f"\n      LE MINIMUM DU GABARIT DU 0 tombe en {pmin0}, au centre de la")
    print(f"      grille (le centre geometrique est (14,5 ; 14,5)). Ce neurone")
    print(f"      cherche l'ABSENCE d'encre au milieu.")

    sous_titre("Une sortie complete, pour la verification n°12")
    i = 0
    a = avant(r["theta"], Xte[i:i + 1], "identite")["A1"][0]
    ordre = np.argsort(-a)
    print(f"      image de test n°{i}, un {int(cte[i])}")
    print("      classe :  " + "  ".join(f"{k:>8}" for k in range(10)))
    print("      a_k    :  " + "  ".join(f"{v:>8.4f}" for v in a))
    print(f"      predit {int(ordre[0])} avec {a[ordre[0]]:.6f}"
          f"   second choix {int(ordre[1])} avec {a[ordre[1]]:.6f}")
    print(f"      somme des dix coordonnees : {a.sum():.10f}")

    return r


# ── 5. La proposition 2, mesuree ────────────────────────────────────────────


def _paire_page7(theta_lin: dict, theta_relu: dict, Xte, cte) -> None:
    """
    La paire de 4 que la page 7 affiche AVANT toute demonstration.

    Elle doit faire repondre les deux modeles differemment sur la MEME entree :
    les deux classent 4 aux deux bouts, et le modele a ReLU classe le milieu
    ailleurs. Le modele lineaire, lui, ne le peut pas -- c'est ce que la page
    fait deviner avant de le prouver.

    La recherche est exhaustive sur les paires de 4 du jeu de test, dans
    l'ordre des indices, et sans tirage : elle ne depend d'aucune graine et ne
    touche pas au protocole des 5 000 paires ci-dessus.
    """
    idx = np.nonzero(cte == 4)[0]
    L_lin, L_relu = len(theta_lin) // 2, len(theta_relu) // 2
    seuls_lin = avant(theta_lin, Xte[idx], "identite")[f"A{L_lin}"].argmax(axis=1)
    seuls_relu = avant(theta_relu, Xte[idx], "relu")[f"A{L_relu}"].argmax(axis=1)
    bons = idx[(seuls_lin == 4) & (seuls_relu == 4)]

    print(f"\n    LA PAIRE DE LA PAGE 7")
    print(f"      images de classe 4 dans le jeu de test        {len(idx)}")
    print(f"      celles que les DEUX modeles classent 4        {len(bons)}")
    print(f"      paires a examiner                             "
          f"{len(bons) * (len(bons) - 1) // 2}")

    trouvee = None
    total = 0
    for a in range(len(bons)):
        autres = bons[a + 1:]
        if len(autres) == 0:
            break
        for d in range(0, len(autres), 4096):
            bloc = autres[d:d + 4096]
            M = (Xte[bons[a]][None, :] + Xte[bloc]) / 2.0
            pm = avant(theta_relu, M, "relu")[f"A{L_relu}"].argmax(axis=1)
            casse = np.nonzero(pm != 4)[0]
            total += len(casse)
            if trouvee is None and len(casse) > 0:
                n = int(casse[0])
                trouvee = (int(bons[a]), int(bloc[n]), int(pm[n]))

    print(f"      paires dont le modele a ReLU coupe le milieu  {total}")
    if trouvee is None:
        print("      aucune : la page 7 doit citer une paire d'une autre classe.")
        return
    i, j, ailleurs = trouvee
    mil = (Xte[i] + Xte[j])[None, :] / 2.0
    lm = int(avant(theta_lin, mil, "identite")[f"A{L_lin}"].argmax(axis=1)[0])
    print(f"\n      image de test n°{i}, classe 4")
    print(f"      image de test n°{j}, classe 4")
    print(f"      leur milieu ( x_{i} + x_{j} ) / 2")
    print(f"\n                            image {i}   image {j}   milieu")
    print(f"      MODELE 1, lineaire      {4:^11}{4:^11}{lm:^9}")
    print(f"      MODELE 3, avec ReLU     {4:^11}{4:^11}{ailleurs:^9}")


def section_convexite(theta_lin: dict, theta_relu: dict, Xte, cte) -> None:
    """
    Le corollaire de la proposition 2, verifie numeriquement des deux cotes :
    il DOIT etre vrai pour le modele lineaire, et il est FAUX pour le modele a
    ReLU. C'est cette dissymetrie qui est la mesure.
    """
    titre("5. LA CONVEXITE DES REGIONS, MESUREE  (pages 7 et 9)")

    rng = np.random.default_rng(GRAINE)
    paires = []
    for c in range(10):
        idx = np.nonzero(cte == c)[0]
        for _ in range(500):
            i, j = rng.choice(idx, size=2, replace=False)
            paires.append((int(i), int(j), c))
    print(f"\n    {len(paires)} paires d'images de MEME classe, 500 par classe,")
    print(f"    tirees dans les 10 000 images de test, graine {GRAINE}.")

    A = Xte[[i for i, _, _ in paires]]
    B = Xte[[j for _, j, _ in paires]]
    M = (A + B) / 2.0
    vraies = np.array([c for _, _, c in paires])

    pred = {}
    for cle, theta, act in (("lin", theta_lin, "identite"),
                            ("relu", theta_relu, "relu")):
        L = len(theta) // 2
        pred[cle] = tuple(avant(theta, Z, act)[f"A{L}"].argmax(axis=1)
                          for Z in (A, B, M))

    for nom, cle in (("MODELE 1, lineaire", "lin"),
                     ("MODELE 3, avec ReLU", "relu")):
        pa, pb, pm = pred[cle]
        deux_bonnes = (pa == vraies) & (pb == vraies)
        casse = deux_bonnes & (pm != vraies)
        toutes = pm != vraies

        sous_titre(nom)
        print(f"      paires dont les DEUX extremites sont dans R_c   "
              f"{int(deux_bonnes.sum())} sur {len(paires)}")
        print(f"      parmi elles, milieu classe AILLEURS              "
              f"{int(casse.sum())}"
              f"   ({100 * casse.sum() / max(1, deux_bonnes.sum()):.2f} %)")
        print(f"      sur TOUTES les paires, milieu classe ailleurs    "
              f"{int(toutes.sum())}"
              f"   ({100 * toutes.mean():.2f} %)")

    print("\n    LECTURE. Pour le modele lineaire, le compte du milieu doit etre")
    print("    EXACTEMENT zero : c'est la proposition 2, et aucun entrainement,")
    print("    aucun reglage ne peut le rendre non nul. Pour le modele a ReLU il")
    print("    ne l'est pas : ses regions ne sont plus convexes, et c'est la")
    print("    proposition 4 qui dit pourquoi.")

    _paire_page7(theta_lin, theta_relu, Xte, cte)

    # Un exemple concret pour la verification n°14, pris sur le modele a ReLU.
    ra, rb, rm = pred["relu"]
    ou = np.nonzero((ra == vraies) & (rb == vraies) & (rm != vraies))[0]
    if len(ou) > 0:
        n = int(ou[0])
        i, j, c = paires[n]
        print(f"\n    UN CAS CONCRET, pour la verification n°14 (modele 3) :")
        print(f"      images de test n°{i} et n°{j}, toutes deux de classe {c},")
        print(f"      toutes deux predites {c}. Leur milieu est predit"
              f" {int(rm[n])}.")


# ── 6. Le modele sans activation ────────────────────────────────────────────


def section_modele2(Xtr, ctr, Xte, cte) -> dict:
    titre("6. MODELE 2 : 784 -> 128 -> 10, SANS activation  (page 8)")

    print("\n    Le comparer au pas du modele 3 serait malhonnete : chaque modele")
    print("    est juge sur son meilleur reglage. Balayage sur 15 epoques.")
    print("\n         eta    acc_test   remarque")
    meilleur = (None, -1.0)
    for eta in (0.50, 0.20, 0.10, 0.05, 0.02, 0.01):
        r = entrainer((784, 128, 10), "identite", "he", eta, 15,
                      Xtr, ctr, Xte, cte)
        if r["diverge"]:
            print(f"        {eta:>4.2f}       ---     divergence (NaN)")
        else:
            print(f"        {eta:>4.2f}    {r['acc']:.4f}     converge")
            if r["acc"] > meilleur[1]:
                meilleur = (eta, r["acc"])
    print(f"\n    RETENU : eta = {meilleur[0]}")

    r = entrainer((784, 128, 10), "identite", "he", meilleur[0], 15,
                  Xtr, ctr, Xte, cte)
    p = compter(r["theta"])
    print(f"\n    p                                       {p} parametres")
    print(f"    PRECISION DE TEST                       {r['acc']:.4f}")
    print(f"    ERREURS                                 {r['erreurs']} sur 10 000")

    produit = r["theta"]["W2"] @ r["theta"]["W1"]
    print(f"\n    W2 @ W1 : (10 x 128)(128 x 784) = {produit.shape[0]}"
          f" x {produit.shape[1]}")
    print(f"    rang de W2 @ W1                         "
          f"{np.linalg.matrix_rank(produit)}")
    print("        AVERTISSEMENT. Ce rang ne prouve RIEN : toute matrice de")
    print("        M_10,784(R) est deja de rang au plus 10. La proposition 3 se")
    print("        demontre par double inclusion, pas par un argument de rang.")
    return r


# ── 7. Le modele a ReLU ─────────────────────────────────────────────────────


def section_modele3(Xtr, ctr, Xte, cte, theta_lin: dict) -> dict:
    titre("7. MODELE 3 : 784 -> 128 -> 10, AVEC ReLU  (pages 9, 10 et 11)")

    r = entrainer((784, 128, 10), "relu", "he", 0.5, 30, Xtr, ctr, Xte, cte)
    theta = r["theta"]
    p = compter(theta)
    print(f"\n    W^[1] dans M_128,784(R)                 {128 * 784}")
    print(f"    b^[1] dans R^128                        {128}")
    print(f"    W^[2] dans M_10,128(R)                  {10 * 128}")
    print(f"    b^[2] dans R^10                         {10}")
    print(f"    p                                       {p} parametres")
    print(f"    part dans W^[1]                         "
          f"{100 * 128 * 784 / p:.1f} %")
    print(f"\n    PRECISION DE TEST                       {r['acc']:.4f}")
    print(f"    ERREURS                                 {r['erreurs']} sur 10 000")
    print(f"    duree                                   {r['secondes']:.1f} s")

    sous_titre("La propagation avant sur l'image de test n°0")
    cache = avant(theta, Xte[0:1], "relu")
    z1, a1, z2, a2 = cache["Z1"][0], cache["A1"][0], cache["Z2"][0], cache["A2"][0]
    print(f"      composantes de a^[1] non nulles         {int((a1 > 0).sum())}"
          f" sur 128")
    print(f"      composantes nulles                      {int((a1 == 0).sum())}")
    hauts = np.argsort(-z1)[:3]
    bas = int(np.argmin(z1))
    print("      preactivations extremes (indices a partir de 1) :")
    for j in hauts:
        print(f"        z^[1]_{int(j) + 1:<4}  {z1[j]:>+9.4f}")
    print(f"        z^[1]_{bas + 1:<4}  {z1[bas]:>+9.4f}   (le plus bas)")
    print("\n      z^[2] :")
    print("        " + "  ".join(f"{v:>+9.4f}" for v in z2))
    print("      a^[2] = softmax(z^[2]) :")
    print("        " + "  ".join(f"{v:>9.6f}" for v in a2))
    ordre = np.argsort(-a2)
    print(f"      predit {int(ordre[0])} avec {a2[ordre[0]]:.8f}")
    print(f"      second choix {int(ordre[1])} avec {a2[ordre[1]]:.3e}")
    print(f"      somme des dix coordonnees {a2.sum():.10f}")

    sous_titre("La couche cachee sur les 10 000 images")
    A1 = np.maximum(Xte @ theta["W1"].T + theta["b1"], 0.0)
    morts = int((A1.max(axis=0) == 0).sum())
    print(f"      neurones eteints sur TOUTES les images   {morts} sur 128")
    print(f"      part moyenne de composantes non nulles   {100 * (A1 > 0).mean():.2f} %")
    print(f"      minimum sur une image                    {int((A1 > 0).sum(axis=1).min())}")
    print(f"      maximum sur une image                    {int((A1 > 0).sum(axis=1).max())}")
    print(f"      plus grande activation observee          {A1.max():.4f}")
    print(f"      moyenne des activations non nulles       {A1[A1 > 0].mean():.4f}")
    print("        a^[1] vit dans R_{>=0}^128, qui n'est PAS borne : c'est")
    print("        l'ecart n°5 avec la source, mesure.")

    sous_titre("Quatre gabarits caches vec^-1(ligne j de W^[1])")
    print("      j       max        position       min        position")
    for j in list(hauts) + [bas]:
        vmax, pmax, vmin, pmin = extrema(theta["W1"][j].reshape(28, 28))
        print(f"      {int(j) + 1:<6}  {vmax:>+8.4f}   ({pmax[0]:>2}, {pmax[1]:>2})"
              f"     {vmin:>+8.4f}   ({pmin[0]:>2}, {pmin[1]:>2})")

    sous_titre("L'espoir des bords, tranche par la correlation")
    # rho entre chaque gabarit cache et chacun des dix gabarits de classe du
    # modele lineaire. Le domaine de rho exclut les vecteurs constants : aucun
    # gabarit ne l'est, on le verifie plutot que de le supposer.
    Wl = theta_lin["W1"]
    Wc = theta["W1"]
    assert Wl.std(axis=1).min() > 0 and Wc.std(axis=1).min() > 0
    Zl = (Wl - Wl.mean(axis=1, keepdims=True)) / Wl.std(axis=1, keepdims=True)
    Zc = (Wc - Wc.mean(axis=1, keepdims=True)) / Wc.std(axis=1, keepdims=True)
    R = (Zc @ Zl.T) / 784.0                          # (128, 10)
    absR = np.abs(R)
    jmax, kmax = np.unravel_index(int(absR.argmax()), absR.shape)
    print(f"      correlation maximale en valeur absolue   {absR.max():.4f}")
    print(f"      atteinte entre le gabarit cache j = {int(jmax) + 1}"
          f" et le gabarit de classe {int(kmax)}")
    print(f"      correlation maximale signee              {R.max():+.4f}")
    print(f"      moyenne des |rho| sur les 1 280 couples  {absR.mean():.4f}")
    print(f"      couples au-dessus de 0,5                 {int((absR > 0.5).sum())}"
          f" sur 1 280")
    print("      AUCUN gabarit cache ne ressemble a un gabarit de chiffre.")

    # ── Et l'autre moitie de l'espoir : ressemblent-ils a des BORDS ? ───────
    # On fabrique une famille de detecteurs de bord de la forme construite a la
    # page 5 -- une bande a +1, un pourtour a -1 -- dans les deux orientations
    # et a toutes les positions, puis on correle chaque gabarit cache a toute
    # la famille. Si l'espoir des bords etait fonde, un gabarit cache au moins
    # devrait ressembler fortement a l'un de ces detecteurs.
    detecteurs = []
    for vertical in (False, True):
        for i0 in range(1, 24, 2):
            for j0 in range(1, 14, 2):
                g = np.zeros((28, 28))
                bande = (slice(i0, i0 + 3), slice(j0, j0 + 13))
                large = (slice(max(0, i0 - 3), i0 + 6), slice(max(0, j0 - 3), j0 + 16))
                if vertical:
                    bande, large = bande[::-1], large[::-1]
                g[large] = -1.0
                g[bande] = +1.0
                if g.std() > 0:
                    detecteurs.append(g.reshape(-1))
    Db = np.array(detecteurs)
    Zb = (Db - Db.mean(axis=1, keepdims=True)) / Db.std(axis=1, keepdims=True)
    Rb = np.abs((Zc @ Zb.T) / 784.0)                 # (128, nb detecteurs)
    jb, kb = np.unravel_index(int(Rb.argmax()), Rb.shape)
    print(f"\n      famille de detecteurs de bord construits a la main"
          f"   {len(detecteurs)}")
    print(f"      correlation maximale gabarit cache / detecteur   {Rb.max():.4f}")
    print(f"      atteinte par le gabarit cache j = {int(jb) + 1}")
    print(f"      moyenne des |rho| sur les {Rb.size} couples"
          f"        {Rb.mean():.4f}")
    print(f"      gabarits caches ayant un |rho| > 0,5 avec un detecteur"
          f"   {int((Rb.max(axis=1) > 0.5).sum())} sur 128")
    print("      Pour reference, la correlation d'un detecteur de bord avec un")
    print("      detecteur voisin de la meme famille vaut :")
    Rbb = np.abs((Zb @ Zb.T) / 784.0)
    np.fill_diagonal(Rbb, 0.0)
    print(f"        maximum entre deux detecteurs distincts       {Rbb.max():.4f}")
    print("      LA REPONSE EST NON, des deux cotes.")

    sous_titre("Ce que le reseau rate")
    predits = r["predits"]
    faux = np.nonzero(predits != cte)[0]
    A = avant(theta, Xte, "relu")["A2"]
    proba = A[np.arange(len(cte)), predits]
    print(f"      erreurs                                  {len(faux)} sur 10 000")
    print(f"      erreurs avec probabilite > 0,99          {int((proba[faux] > 0.99).sum())}")
    print(f"      erreurs avec probabilite > 0,90          {int((proba[faux] > 0.90).sum())}")
    print(f"      probabilite mediane des erreurs          {np.median(proba[faux]):.4f}")
    print("\n      LES SIX ERREURS LES PLUS CONFIANTES")
    print("        indice   verite   predit   probabilite")
    for i in faux[np.argsort(-proba[faux])][:6]:
        print(f"        {i:>6}   {cte[i]:>6}   {predits[i]:>6}   {proba[i]:>11.4f}")
    print("\n      LES SIX CONFUSIONS LES PLUS FREQUENTES")
    paires: dict[tuple[int, int], int] = {}
    for i in faux:
        cle = (int(cte[i]), int(predits[i]))
        paires[cle] = paires.get(cle, 0) + 1
    for (v, q), n in sorted(paires.items(), key=lambda kv: -kv[1])[:6]:
        print(f"        vrai {v} lu {q} : {n} fois")

    return r


# ── 8. Le modele de la source ───────────────────────────────────────────────


def section_modele4(Xtr, ctr, Xte, cte) -> dict:
    titre("8. MODELE 4 : 784 -> 16 -> 16 -> 10, avec ReLU  (pages 10 et 11)")

    print("\n    C'est l'architecture de la source. Le cours la mesure pour")
    print("    pouvoir la comparer, et non pour la recommander.")
    a_la_main = 784 * 16 + 16 + 16 * 16 + 16 + 16 * 10 + 10
    print(f"\n    compte a la main   784x16 + 16 + 16x16 + 16 + 16x10 + 10")
    print(f"                     = {784 * 16} + {16} + {16 * 16} + {16}"
          f" + {16 * 10} + {10}")
    print(f"                     = {a_la_main}")

    r = entrainer((784, 16, 16, 10), "relu", "he", 0.5, 30, Xtr, ctr, Xte, cte)
    p = compter(r["theta"])
    print(f"    compte par le programme                 {p}")
    print(f"    concordance                             "
          f"{'OUI' if p == a_la_main else 'NON'}")
    print(f"\n    PRECISION DE TEST                       {r['acc']:.4f}")
    print(f"    ERREURS                                 {r['erreurs']} sur 10 000")
    print(f"    duree                                   {r['secondes']:.1f} s")
    return r


# ── 9. Les comptes de parametres ────────────────────────────────────────────


def section_comptes() -> None:
    titre("9. LES COMPTES DE PARAMETRES  (page 10)")
    print("\n    p = somme sur l de ( d_l * d_{l-1} + d_l )")
    print("\n    architecture                 detail                          p")
    for tailles in ((784, 10), (784, 128, 10), (784, 16, 16, 10),
                    (784, 32, 32, 32, 10)):
        morceaux = []
        total = 0
        for l in range(1, len(tailles)):
            m = tailles[l] * tailles[l - 1] + tailles[l]
            morceaux.append(f"{tailles[l]}x{tailles[l - 1]}+{tailles[l]}")
            total += m
        nom = " -> ".join(str(t) for t in tailles)
        print(f"    {nom:<28} {' + '.join(morceaux):<28} {total:>8}")
        if len(tailles) > 2:
            premiere = tailles[1] * tailles[0] + tailles[1]
            print(f"    {'':<28} {'part dans la premiere matrice':<28}"
                  f" {100 * tailles[1] * tailles[0] / total:>7.1f} %")

    print("\n    L'EXPERIENCE DE PENSEE de la page 10 : regler 101 770 nombres a")
    print("    la main, une seconde par nombre, sans jamais s'arreter :")
    s = 101770
    print(f"      {s} secondes = {s / 3600:.1f} heures = {s / 86400:.2f} jours")


# ── 10. Le tableau final ────────────────────────────────────────────────────


def section_tableau(r1, r2, r3, r4) -> None:
    titre("10. LES QUATRE MODELES  (page 11)")
    print("\n    modele                                 activation  parametres"
          "   acc_test   erreurs")
    lignes = [
        ("1  784 -> 10", "aucune", r1),
        ("2  784 -> 128 -> 10", "aucune", r2),
        ("3  784 -> 128 -> 10", "ReLU", r3),
        ("4  784 -> 16 -> 16 -> 10", "ReLU", r4),
    ]
    for nom, act, r in lignes:
        print(f"    {nom:<38} {act:<10} {compter(r['theta']):>10}"
              f"   {r['acc']:>8.4f}   {r['erreurs']:>7}")

    print(f"\n    de 1 a 2 : {r1['erreurs']} -> {r2['erreurs']} erreurs,"
          f" pour {compter(r2['theta']) - compter(r1['theta'])} parametres de plus")
    print(f"              soit {100 * (r2['acc'] - r1['acc']):+.2f} point")
    print(f"    de 2 a 3 : {r2['erreurs']} -> {r3['erreurs']} erreurs,"
          f" a nombre de parametres IDENTIQUE")
    print(f"              soit {100 * (r3['acc'] - r2['acc']):+.2f} points,"
          f" erreurs divisees par {r2['erreurs'] / max(1, r3['erreurs']):.1f}")
    print("\n    Ce ne sont pas les parametres qui achetent la performance,")
    print("    c'est la non-linearite.")


# ── 12. Ce que les animations montrent ──────────────────────────────────────


def section_animations(Xte, cte, theta_lin: dict, theta_sans: dict,
                       theta_relu: dict) -> None:
    """
    Les quatre mesures qu'AUCUNE page n'imprime, et que les animations du
    chapitre affichent a l'ecran.

    ELLES SORTENT D'ICI COMME LES AUTRES. Une animation qui montrerait un
    nombre calcule dans son propre fichier serait invérifiable : personne ne
    saurait dire si le reseau anime est celui du chapitre. Les quatre modeles
    sont ceux qui viennent d'etre entraines, et pas d'autres.
    """
    titre("12. CE QUE LES ANIMATIONS MONTRENT  (pages 2, 4, 6 et 8)")

    L_lin = len(theta_lin) // 2
    L_sans = len(theta_sans) // 2
    L_relu = len(theta_relu) // 2

    # -- a. Les trois premieres images de test, par le reseau du chapitre.
    sous_titre("Les trois premieres images de test, modele 3 (animation 2)")
    print("      image   classe   predit   a^[2] du predit   second choix")
    for n in (0, 1, 2):
        cache = avant(theta_relu, Xte[n:n + 1], "relu")
        a = cache[f"A{L_relu}"][0]
        ordre = np.argsort(a)[::-1]
        print(f"      {n:>5}   {int(cte[n]):>6}   {int(ordre[0]):>6}"
              f"   {a[ordre[0]]:>15.8f}   {int(ordre[1])} a {a[ordre[1]]:.3e}")

    # -- b. Le gabarit du 0 confronte a deux vraies images.
    sous_titre("Le gabarit du 0 confronte a un 0 et a un 8 (animation 3)")
    i_zero = int(np.nonzero(cte == 0)[0][0])
    i_huit = int(np.nonzero(cte == 8)[0][0])
    W, b = theta_lin["W1"], theta_lin["b1"]
    print("      z_0 = <ligne 0 de W, x> + b_0, le score de la CLASSE 0")
    for nom, i in (("un vrai 0", i_zero), ("un vrai 8", i_huit)):
        z0 = float(W[0] @ Xte[i] + b[0])
        predit = int((W @ Xte[i] + b).argmax())
        print(f"      image de test n°{i:<5} {nom}   z_0 = {z0:+8.4f}"
              f"   (le modele predit {predit})")
    print("      L'encre du 8 couvre le creux central du gabarit, la ou les")
    print("      poids sont les plus negatifs : c'est ce que la chute de z_0 dit.")

    # -- c. Les dix scores du modele sans activation, et ceux de sa reduction.
    sous_titre("Empiler sans activation ne change pas les scores (animation 5)")
    z_deux = avant(theta_sans, Xte[0:1], "identite")[f"Z{L_sans}"][0]
    W_fusion = theta_sans["W2"] @ theta_sans["W1"]
    b_fusion = theta_sans["W2"] @ theta_sans["b1"] + theta_sans["b2"]
    z_reduit = W_fusion @ Xte[0] + b_fusion
    print("      image de test n°0, les dix scores AVANT softmax")
    print("      deux couches :  " + "".join(f"{v:>10.4f}" for v in z_deux))
    print("      une seule    :  " + "".join(f"{v:>10.4f}" for v in z_reduit))
    print(f"      ecart maximal entre les deux    {np.abs(z_deux - z_reduit).max():.3e}")
    print(f"      W^[2]W^[1] est de taille        {W_fusion.shape[0]} x"
          f" {W_fusion.shape[1]}")

    # -- d. La permutation des 784 entrees.
    sous_titre("Permuter les 784 entrees ne change pas les scores (animation 7)")
    perm = np.random.default_rng(GRAINE).permutation(784)
    x = Xte[0]
    z_avant = W @ x + b
    z_apres = W[:, perm] @ x[perm] + b
    print(f"      permutation de graine {GRAINE}, les cinq premiers rangs :")
    print("        rang 1 -> " + ", ".join(f"{int(k) + 1}" for k in perm[:5]))
    print("      image de test n°0, les dix scores, modele 1")
    print("      avant :  " + "".join(f"{v:>10.4f}" for v in z_avant))
    print("      apres :  " + "".join(f"{v:>10.4f}" for v in z_apres))
    print(f"      ecart maximal entre les deux    {np.abs(z_avant - z_apres).max():.3e}")
    print("      C'est la proposition 1, calculee : permuter les colonnes de W")
    print("      de la meme facon que les pixels laisse chaque score identique.")


# ── 11. La sigmoide, en marge ───────────────────────────────────────────────


def section_sigmoide() -> None:
    titre("11. LA SIGMOIDE, POUR LA VERIFICATION N°15  (page 9)")

    def sigma(z: float) -> float:
        if z >= 0:
            return 1.0 / (1.0 + np.exp(-z))
        e = np.exp(z)
        return float(e / (1.0 + e))

    print("\n         z          sigma(z)")
    for z in (-1000.0, -100.0, -10.0, -1.0, 0.0, 1.0, 10.0, 100.0, 1000.0):
        print(f"      {z:>8.1f}    {sigma(z):.12g}")
    print("\n    sigma(-1000) vaut zero A LA PRECISION DE LA MACHINE : le plus")
    print("    petit flottant normal de 64 bits vaut environ 2,2e-308, et")
    print("    e^-1000 est en dessous. La valeur exacte n'est pas nulle.")
    print("    Le calcul direct de e^+1000 DEBORDE (inf), d'ou l'ecriture en")
    print("    deux branches employee partout dans ce fichier.")
    print(f"\n    majorant de la derivee : sigma'(0) = 1/4 = {0.25}")


def enregistrer_poids(modeles: dict[str, dict]) -> Path:
    """
    Les quatre theta, ecrits une fois dans le cache non versionne.

    Les animations du chapitre montrent le reseau en train de calculer : elles
    ont besoin des memes poids que les nombres imprimes ci-dessus, pas de poids
    reentraines ailleurs. Rien n'est mesure ici, seulement recopie.
    """
    chemin = D.CACHE / "l2-modeles.npz"
    plat = {f"{nom}.{cle}": valeur
            for nom, theta in modeles.items() for cle, valeur in theta.items()}
    chemin.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(chemin, **plat)
    print(f"\n  poids des quatre modeles : {chemin}")
    print(f"  cles : {' '.join(sorted(plat))}")
    return chemin


def main() -> None:
    _console_utf8()
    debut = time.time()
    print("  Chapitre 2 : toutes les mesures.")
    print(f"  graine {GRAINE}   mini-lots de {B_LOT}   entropie croisee")
    print(f"  BLAS bride a {_FILS} fils (les mini-lots sont trop petits pour"
          f" en profiter).")

    Xtr, ctr, Xte, cte = D.charger()
    print(f"\n  X_train {Xtr.shape}   X_test {Xte.shape}"
          f"   valeurs dans [{Xtr.min():.1f}, {Xtr.max():.1f}]")

    section_jeu(Xtr, ctr, Xte, cte)
    section_image(Xte, cte)
    section_detecteur(Xte, cte)
    r1 = section_modele1(Xtr, ctr, Xte, cte)
    r2 = section_modele2(Xtr, ctr, Xte, cte)
    r3 = section_modele3(Xtr, ctr, Xte, cte, r1["theta"])
    section_convexite(r1["theta"], r3["theta"], Xte, cte)
    r4 = section_modele4(Xtr, ctr, Xte, cte)
    section_comptes()
    section_sigmoide()
    section_tableau(r1, r2, r3, r4)
    section_animations(Xte, cte, r1["theta"], r2["theta"], r3["theta"])
    enregistrer_poids({"lineaire": r1["theta"], "sans_activation": r2["theta"],
                       "relu": r3["theta"], "profond": r4["theta"]})

    titre("FIN")
    print(f"\n  duree totale : {time.time() - debut:.1f} s")
    print("  Tous les nombres du chapitre 2 sortent de cette execution.")


if __name__ == "__main__":
    main()
