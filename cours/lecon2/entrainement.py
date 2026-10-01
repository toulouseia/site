"""
Lecon 2, section 4.9 : l'entrainement complet, et la table qu'il produit.

Ce fichier n'invente rien. Il assemble ce que les sections precedentes ont
construit piece par piece, et il le fait tourner :

    donnees.charger     les vraies images MNIST, deja en cache
    reseau.init_parametres, avant, perte, precision, arriere, pas

Architecture de la section 4.5, telle quelle, et la lecon 3 la reprendra sans
y toucher :

    784 -> 128 -> 10,  ReLU sur la couche cachee, softmax en sortie
    p = 100352 + 128 + 1280 + 10 = 101770

Protocole fige, ecrit ici en clair pour qu'aucun chiffre ne sorte de nulle
part :

    eta = 0.5        pas de descente
    B   = 64         taille du mini-lot
    T   = 30         epoques
    tirage sans remise : une permutation par epoque, chaque exemple vu une
                         fois et une seule
    graine = 0       pour l'initialisation ET pour les permutations

Nomenclature du parcours : X, Y, c, theta, eta, B, L, acc.

    python -X utf8 cours/lecon2/entrainement.py
"""

from __future__ import annotations

import os
import sys
import time
from pathlib import Path

# ── Une mesure faite sur cette machine, avant toute chose ────────────────────
# Les matrices d'un mini-lot sont MINUSCULES : (64, 784) x (784, 128). OpenBLAS
# ouvre par defaut un fil par coeur (12 ici), et la synchronisation de ces 12
# fils coute bien plus cher que la multiplication elle-meme. Mesure sur ce
# poste : 48.0 ms par mise a jour a 12 fils, 1.65 ms a 4 fils, soit 29 fois
# plus vite. A 12 fils, une epoque prend 59 s ; a 4 fils, moins de 2 s.
# Les variables doivent etre posees AVANT l'import de numpy : la bibliotheque
# BLAS les lit une seule fois, a son chargement.
_FILS = str(min(4, os.cpu_count() or 1))
for _var in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    os.environ.setdefault(_var, _FILS)

import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import donnees as D  # noqa: E402
import reseau as R  # noqa: E402


def _console_utf8() -> None:
    """Windows ouvre la console en cp1252, et les accents la font tomber."""
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


GRAINE = 0
TAILLES = (784, 128, 10)
ACTIVATION = "relu"
METHODE = "he"          # ReLU tue la moitie des unites : He compense le facteur 2
ETA = 0.5
B = 64
T = 30
EPOQUES_AFFICHEES = (0, 5, 10, 15, 20, 25, 29)


def titre(texte: str) -> None:
    print()
    print("=" * 78)
    print(f"  {texte}")
    print("=" * 78)


# ── 1. Le decompte des parametres ───────────────────────────────────────────

def verifier_parametres(theta: dict) -> int:
    """
    p se compte bloc par bloc. Une matrice W^[l] a d_out x d_in coefficients,
    un biais b^[l] en a d_out. Rien d'autre n'est appris.
    """
    titre("Le reseau : 784 -> 128 -> 10, ReLU puis softmax")
    total = 0
    print(f"    {'bloc':<8}{'forme':>14}{'nombre':>12}")
    for couche in range(1, len(TAILLES)):
        d_in, d_out = TAILLES[couche - 1], TAILLES[couche]
        W = theta[f"W{couche}"]
        b = theta[f"b{couche}"]
        print(f"    {'W' + str(couche):<8}{f'({d_out}, {d_in})':>14}{W.size:>12}")
        print(f"    {'b' + str(couche):<8}{f'({d_out},)':>14}{b.size:>12}")
        total += W.size + b.size
    print(f"    {'-' * 34:<34}")
    print(f"    {'somme':<8}{'':>14}{total:>12}")
    print()
    print("    p = 100352 + 128 + 1280 + 10 = "
          f"{100352 + 128 + 1280 + 10}")
    mesure = R.nb_parametres(theta)
    print(f"    nb_parametres(theta)        = {mesure}")
    accord = (mesure == 101770 == total)
    print(f"    accord avec la valeur figee 101770 : {'OUI' if accord else 'NON'}")
    return mesure


# ── 2. Une epoque ───────────────────────────────────────────────────────────

def une_epoque(theta: dict, Xtr: np.ndarray, Ytr: np.ndarray,
               rng: np.random.Generator) -> int:
    """
    Un passage sur tout le jeu, en mini-lots tires SANS REMISE : on permute les
    N indices, puis on les decoupe en tranches de B. Chaque exemple sert une
    fois et une seule. La derniere tranche est plus courte quand N n'est pas un
    multiple de B (ici 60000 = 937 x 64 + 32) ; on la garde, sinon 32 exemples
    ne seraient jamais vus.
    """
    N = Xtr.shape[0]
    ordre = rng.permutation(N)
    maj = 0
    for debut in range(0, N, B):
        idx = ordre[debut:debut + B]
        cache = R.avant(theta, Xtr[idx], ACTIVATION)
        grads = R.arriere(theta, cache, Ytr[idx], ACTIVATION)
        R.pas(theta, grads, ETA)
        maj += 1
    return maj


# ── 3. La table de la section 4.9 ───────────────────────────────────────────

def main() -> None:
    _console_utf8()

    print("  chargement de MNIST (60000 / 10000)...")
    Xtr, ctr, Xte, cte = D.charger(60000, 10000)
    Ytr, Yte = D.onehot(ctr), D.onehot(cte)
    N = Xtr.shape[0]
    print(f"    X_train {Xtr.shape}   X_test {Xte.shape}   valeurs dans "
          f"[{Xtr.min():.1f}, {Xtr.max():.1f}]")

    theta = R.init_parametres(GRAINE, METHODE, TAILLES)
    p = verifier_parametres(theta)

    titre("Protocole")
    print(f"    graine        {GRAINE}")
    print(f"    initialisation {METHODE!r} : N(0, 2/d_in), adaptee a ReLU")
    print(f"    eta           {ETA}")
    print(f"    B             {B}")
    print(f"    T             {T} epoques")
    print(f"    N             {N} exemples, soit {-(-N // B)} mises a jour par epoque")
    print(f"    p             {p} parametres")
    print("    tirage        sans remise (une permutation par epoque)")
    print(f"    BLAS          {_FILS} fils (les mini-lots sont trop petits pour "
          f"{os.cpu_count()})")

    rng = np.random.default_rng(GRAINE)

    L_tr, acc_tr = R.evaluer(theta, Xtr, Ytr, ctr, ACTIVATION)
    L_te, acc_te = R.evaluer(theta, Xte, Yte, cte, ACTIVATION)

    titre("La table de la section 4.9")
    entete = (f"    {'epoque':>7}{'L_train':>11}{'acc_train':>11}"
              f"{'L_test':>11}{'acc_test':>11}{'ecart_acc':>11}")
    print(entete)
    print("    " + "-" * (len(entete) - 4))
    print(f"    {'avant':>7}{L_tr:>11.4f}{acc_tr:>11.4f}"
          f"{L_te:>11.4f}{acc_te:>11.4f}{acc_tr - acc_te:>+11.4f}")

    historique = []
    duree_epoque = []
    t_depart = time.perf_counter()

    for t in range(T):
        t0 = time.perf_counter()
        maj = une_epoque(theta, Xtr, Ytr, rng)
        duree_epoque.append(time.perf_counter() - t0)

        L_tr, acc_tr = R.evaluer(theta, Xtr, Ytr, ctr, ACTIVATION)
        L_te, acc_te = R.evaluer(theta, Xte, Yte, cte, ACTIVATION)
        historique.append((t, L_tr, acc_tr, L_te, acc_te))

        if t in EPOQUES_AFFICHEES:
            print(f"    {t:>7}{L_tr:>11.4f}{acc_tr:>11.4f}"
                  f"{L_te:>11.4f}{acc_te:>11.4f}{acc_tr - acc_te:>+11.4f}")

    duree = time.perf_counter() - t_depart
    print()
    print(f"    {maj} mises a jour par epoque, {maj * T} au total")
    print(f"    duree d'une epoque : mediane {np.median(duree_epoque):.2f} s   "
          f"min {min(duree_epoque):.2f} s   max {max(duree_epoque):.2f} s")
    print(f"    duree totale (entrainement + evaluations) : {duree:.1f} s")

    # ── 4. Ce que la table dit ──────────────────────────────────────────────

    t_fin, L_tr, acc_tr, L_te, acc_te = historique[-1]
    accs_te = [h[4] for h in historique]
    meilleur = int(np.argmax(accs_te))

    titre("Ce que la table dit")
    print(f"    Fin d'entrainement (epoque {t_fin}) :")
    print(f"      perte     train {L_tr:.4f}   test {L_te:.4f}   "
          f"ecart {L_te - L_tr:+.4f}")
    print(f"      precision train {acc_tr:.4f}   test {acc_te:.4f}   "
          f"ecart {acc_tr - acc_te:+.4f}")
    print(f"    Meilleure precision de test : {accs_te[meilleur]:.4f} "
          f"a l'epoque {meilleur}.")
    # acc_train affiche 1.0000, mais 1.0000 peut cacher 0.99998. On compte les
    # exemples mal classes plutot que de croire un arrondi a quatre decimales.
    err_tr = int(round((1 - acc_tr) * ctr.size))
    print(f"    Erreurs d'entrainement restantes : {err_tr} sur {ctr.size}"
          f"   (acc_train = {acc_tr:.6f})")
    print(f"    Erreurs de test restantes        : "
          f"{int(round((1 - acc_te) * cte.size))} sur {cte.size}"
          f"   (acc_test  = {acc_te:.6f})")
    # Le creux de la perte de test est cherche sur les 30 epoques, pas
    # seulement sur les 7 affichees : c'est lui qui date le sur-apprentissage.
    L_tests = [h[3] for h in historique]
    creux = int(np.argmin(L_tests))
    print(f"    Perte de test la plus basse : {L_tests[creux]:.4f} "
          f"a l'epoque {creux}, puis elle REMONTE jusqu'a {L_tests[-1]:.4f}.")
    print("    Pendant ce temps la perte d'entrainement, elle, ne cesse de "
          "descendre :")
    print(f"      epoque {creux} : L_train {historique[creux][1]:.4f}   "
          f"epoque {t_fin} : L_train {L_tr:.4f}")
    print()
    print("    L'ecart train/test est le premier symptome du sur-apprentissage :")
    print("    le reseau lit mieux les images qu'il a vues que celles qu'il n'a")
    print("    pas vues. C'est le sujet de la lecon sur la generalisation.")
    print("    Ecart de precision par epoque affichee :")
    print(f"      {'epoque':>7}{'acc_train - acc_test':>24}")
    for t, _, a_tr, _, a_te in historique:
        if t in EPOQUES_AFFICHEES:
            print(f"      {t:>7}{a_tr - a_te:>+24.4f}")

    # ── 5. Dix predictions, cote a cote avec la verite ──────────────────────

    titre("Les dix premieres images de test")
    A = R.avant(theta, Xte[:10], ACTIVATION)[f"A{len(theta) // 2}"]
    y_hat = A.argmax(axis=1)
    print(f"    {'image':>7}{'prediction':>12}{'verite':>9}"
          f"{'proba de la classe predite':>29}")
    for n in range(10):
        marque = "" if y_hat[n] == cte[n] else "  <- erreur"
        print(f"    {n:>7}{y_hat[n]:>12}{cte[n]:>9}{A[n, y_hat[n]]:>29.4f}{marque}")
    exacts = int(np.sum(y_hat == cte[:10]))
    print()
    print(f"    predictions : {' '.join(str(v) for v in y_hat)}")
    print(f"    verites     : {' '.join(str(v) for v in cte[:10])}")
    print(f"    {exacts} sur 10 exactes.")
    print()


if __name__ == "__main__":
    main()
