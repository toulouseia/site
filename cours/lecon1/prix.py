"""Lecon 1, section 8 : la demonstration numerique, en entier.

Ce fichier ne depend de rien : ni numpy, ni le reseau des lecons suivantes.
C'est voulu. La lecon 1 ne suppose que l'arithmetique, et son code doit se lire
avec les memes connaissances que son texte.

Les noms de variables suivent le paragraphe 6.5 de la charte :

    x       l'entree, une liste de d reels
    y       la verite terrain, observee dans le monde
    z       la somme ponderee, dite preactivation
    y_hat   l'estimation produite par le modele
    w, b    les poids et le biais, qui forment ensemble theta
    loss    la perte sur UN exemple
    L       la perte moyenne sur le jeu de donnees

Les prix sont en milliers d'euros, pour garder des nombres qu'on lit.

    python cours/lecon1/prix.py
"""

import sys


def _console_utf8() -> None:
    """Windows ouvre la console en cp1252, et les accents la font tomber."""
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


# ── Le modele ───────────────────────────────────────────────────────────────


def preactivation(x, w, b):
    """z = w1 x1 + ... + wd xd + b, ecrit comme la somme qu'il est."""
    if len(x) != len(w):
        raise ValueError(f"x a {len(x)} composantes, w en a {len(w)}")
    z = b
    for i in range(len(x)):
        z += w[i] * x[i]
    return z


def predire(x, w, b):
    """En regression il n'y a pas d'activation : y_hat vaut z."""
    return preactivation(x, w, b)


def perte(y_hat, y):
    """La perte quadratique sur un exemple."""
    return (y_hat - y) ** 2


def perte_moyenne(D, w, b):
    """L = (1/N) somme des pertes. D est une liste de couples (x, y)."""
    N = len(D)
    total = 0.0
    for x, y in D:
        total += perte(predire(x, w, b), y)
    return total / N


# ── Le jeu de donnees, fige par la specification ────────────────────────────

D = [
    ([50, 2], 200),
    ([30, 1], 115),
]


def detailler(nom, w, b):
    """Affiche chaque etape pour chaque exemple, puis la moyenne."""
    print(f"  theta_{nom} :  w = (" + ", ".join(str(v) for v in w) + f")   b = {b}")
    pertes = []
    for n, (x, y) in enumerate(D, start=1):
        z = preactivation(x, w, b)
        y_hat = predire(x, w, b)
        loss = perte(y_hat, y)
        pertes.append(loss)
        termes = " + ".join(f"{w[i]}*{x[i]}" for i in range(len(x)))
        vecteur = "(" + ", ".join(str(v) for v in x) + ")"
        print(
            f"    exemple {n}   x = {vecteur:<9} y = {y:<5}"
            f"  z = {termes} + {b} = {z}"
        )
        print(
            f"                y_hat = {y_hat}"
            f"     loss = ({y_hat} - {y})^2 = {loss}"
        )
    N = len(D)
    somme = " + ".join(str(p) for p in pertes)
    L = perte_moyenne(D, w, b)
    print(f"    L_D = (1/{N})({somme}) = {L}")
    return L


def main() -> None:
    _console_utf8()
    print(f"  N = {len(D)}   d = {len(D[0][0])}   p = d + 1 = {len(D[0][0]) + 1}")
    print()
    L_A = detailler("A", w=[3, 10], b=20)
    print()
    L_B = detailler("B", w=[3, 10], b=22.5)
    print()
    print(f"  L_D(theta_A) = {L_A}      L_D(theta_B) = {L_B}")
    print(f"  theta_B est meilleur : {L_B} < {L_A}   (ecart {L_A - L_B})")


if __name__ == "__main__":
    main()
