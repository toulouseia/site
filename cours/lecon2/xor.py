"""
Lecon 2, partie 4 : aucun modele lineaire ne separe XOR.

La preuve tient en quatre inegalites et une contradiction ; elle est faite
ici en symboles ET en machine. La machine ne prouve rien a elle seule : elle
constate un echec sur un reglage donne. C'est pourquoi les deux sont la, et
c'est la preuve qui conclut.

  A. La contradiction algebrique, ecrite terme a terme.
  B. Le balayage exhaustif : on essaie TOUS les signes possibles de w et b
     sur une grille, et l'on compte combien de reglages font 4/4.
  C. Une descente de gradient reelle sur la regression logistique, qui
     plafonne a 2 exemples sur 4, soit exactement le hasard.
  D. Le meme jeu avec UNE couche cachee de deux neurones : 4/4, poids
     ecrits a la main, aucune descente.

Rien n'est tire au hasard : tout est deterministe, il n'y a donc aucune
graine a fixer.
"""

from __future__ import annotations

import itertools
import sys

import numpy as np

# Les quatre points de XOR. x1, x2 dans {0, 1} ; y = x1 XOR x2.
POINTS = [
    ((0.0, 0.0), 0),
    ((0.0, 1.0), 1),
    ((1.0, 0.0), 1),
    ((1.0, 1.0), 0),
]


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


def sigma(z: np.ndarray | float) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.asarray(z, dtype=np.float64)))


# ── A. La contradiction, en symboles ────────────────────────────────────────


def contradiction() -> None:
    titre("A. La contradiction algebrique")
    print("""
  Un modele lineaire decide par le SIGNE de z = w1 x1 + w2 x2 + b :
  il repond 1 quand z > 0 et 0 quand z <= 0. Demandons-lui les quatre
  reponses de XOR et lisons ce que chacune impose.

    point (0,0), y = 0   ->   z = b                <= 0     (1)
    point (0,1), y = 1   ->   z = w2 + b            > 0     (2)
    point (1,0), y = 1   ->   z = w1 + b            > 0     (3)
    point (1,1), y = 0   ->   z = w1 + w2 + b      <= 0     (4)

  Additionnons (2) et (3), membre a membre :

    (w2 + b) + (w1 + b) > 0
    w1 + w2 + 2b > 0
    (w1 + w2 + b) + b > 0                                   (5)

  Or (4) dit w1 + w2 + b <= 0, et (1) dit b <= 0. La somme de deux
  quantites negatives ou nulles est negative ou nulle :

    (w1 + w2 + b) + b <= 0                                  (6)

  (5) et (6) se contredisent. Aucun triplet (w1, w2, b) ne satisfait
  les quatre conditions a la fois.

  CE QUE LA PREUVE DIT, ET CE QU'ELLE NE DIT PAS. Elle ne parle ni de
  descente de gradient, ni d'initialisation, ni du nombre d'iterations.
  Elle porte sur l'ENSEMBLE des modeles lineaires : il est vide de
  solution. Aucun reglage, aucune duree d'entrainement, aucune astuce
  d'optimisation n'y changera quoi que ce soit. C'est une impossibilite
  de la famille de fonctions choisie, pas une difficulte d'apprentissage.
""".rstrip())


# ── B. Le balayage exhaustif ────────────────────────────────────────────────


def balayage(pas: float = 0.25, borne: float = 3.0) -> None:
    titre("B. Balayage exhaustif d'une grille de reglages")
    valeurs = np.arange(-borne, borne + pas / 2, pas)
    n = len(valeurs)
    print(f"""
  On essaie TOUS les triplets (w1, w2, b) d'une grille reguliere,
  de {-borne:g} a {borne:g} par pas de {pas:g}, soit {n} valeurs par
  coefficient et {n ** 3} reglages au total. Pour chacun on compte les
  points de XOR correctement classes.
""".rstrip())

    compte = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    meilleur = []
    for w1, w2, b in itertools.product(valeurs, valeurs, valeurs):
        justes = 0
        for (x1, x2), y in POINTS:
            z = w1 * x1 + w2 * x2 + b
            justes += int((1 if z > 0 else 0) == y)
        compte[justes] += 1
        if justes == 4:
            meilleur.append((w1, w2, b))

    print()
    print("    points justes   nombre de reglages   part")
    total = sum(compte.values())
    for k in range(5):
        print(f"    {k} sur 4         {compte[k]:>18}   {100 * compte[k] / total:6.2f} %")
    print()
    print(f"    reglages a 4 sur 4 : {len(meilleur)}")
    print(f"    meilleur score atteint : {max(k for k in compte if compte[k])} sur 4")
    print("""
  Aucun reglage de la grille n'atteint 4. Ce n'est pas une preuve a soi
  seul, une grille reste finie ; c'est la partie A qui prouve. Le
  balayage montre seulement que l'echec n'est pas un accident de
  reglage : il est partout.""".rstrip())


# ── C. Une descente de gradient reelle ──────────────────────────────────────


def _une_descente(depart: tuple[float, float, float], eta: float,
                  iterations: int) -> tuple[float, np.ndarray, float, int]:
    X = np.array([p for p, _ in POINTS], dtype=np.float64)   # (4, 2)
    y = np.array([c for _, c in POINTS], dtype=np.float64)   # (4,)
    w = np.array(depart[:2], dtype=np.float64)
    b = float(depart[2])
    jalons = {0, 1, 10, 100, 1000, 10_000, iterations}
    for t in range(iterations + 1):
        a = sigma(X @ w + b)
        if t in jalons:
            ac = np.clip(a, 1e-15, 1 - 1e-15)
            L = float(-np.mean(y * np.log(ac) + (1 - y) * np.log(1 - ac)))
            justes = int(np.sum(((a > 0.5).astype(float) == y)))
            print(
                f"    {t:>10}   {L:>10.6f} {w[0]:>10.6f} {w[1]:>10.6f} "
                f"{b:>10.6f}   {justes} / 4"
            )
        if t == iterations:
            ac = np.clip(a, 1e-15, 1 - 1e-15)
            L = float(-np.mean(y * np.log(ac) + (1 - y) * np.log(1 - ac)))
            return L, w, b, justes
        err = a - y
        w -= eta * (X.T @ err) / len(y)
        b -= eta * float(np.mean(err))
    raise AssertionError("boucle inatteignable")


def descente(eta: float = 0.5, iterations: int = 100_000) -> None:
    titre("C. Regression logistique sur XOR : la descente plafonne")
    print(f"""
  Modele  a = sigma(w1 x1 + w2 x2 + b),  perte = entropie croisee.
  eta = {eta:g}.  {iterations} iterations, lot complet.
  Gradient : grad_w = moyenne (a - y) x,  grad_b = moyenne (a - y).

  DEUX DEPARTS, et c'est le point de cette section. Parti de zero, le
  gradient de XOR est nul par symetrie : on pourrait objecter que la
  descente n'a jamais commence. On refait donc le meme trajet depuis un
  point quelconque, ou rien n'est symetrique.
""".rstrip())

    for nom, depart in (
        ("depart symetrique   w = (0, 0), b = 0", (0.0, 0.0, 0.0)),
        ("depart quelconque   w = (1.3, -0.7), b = 0.4", (1.3, -0.7, 0.4)),
    ):
        print(f"\n  {nom}")
        print("     iteration            L         w1         w2          b   justes")
        L, w, b, justes = _une_descente(depart, eta, iterations)
        print(f"    arrivee : L = {L:.6f}, {justes} / 4 justes")

    print(f"""
  Les deux trajets finissent au meme endroit : w = 0, b = 0, perte
  ln 2 = {np.log(2):.6f}, la valeur du hasard pur sur deux classes. Le
  modele ne repond pas mal, il repond 0.5 partout, c'est-a-dire qu'il ne
  repond rien. Deux points sur quatre sont justes, ce que donnerait une
  piece de monnaie.

  Le second depart repond a l'objection : ce n'est pas un point de
  depart mal choisi, c'est le seul minimum que la famille possede.

  UNE COLONNE QUI SEMBLE INCOHERENTE, ET NE L'EST PAS. La colonne
  « justes » oscille entre 1 et 2 sur les dernieres lignes alors que w
  et b sont nuls a l'affichage. A w = b = 0 le modele repond a = 0.5
  sur les quatre points, exactement le seuil : la regle « a > 0.5 »
  tranche alors selon le dernier bit de w, qui vaut +1e-17 ou -1e-17
  selon l'iteration. Le compte de justes n'a plus de sens a cet endroit
  parce que le modele n'a plus de reponse ; c'est la perte, ln 2, qui
  porte l'information.""".rstrip())


# ── D. Une couche cachee suffit ─────────────────────────────────────────────


def couche_cachee() -> None:
    titre("D. Une couche cachee de deux neurones : 4 sur 4")
    # Les poids sont ECRITS, pas appris : la lecon montre qu'une solution
    # EXISTE dans cette famille, ce qui suffit a la distinguer de la
    # precedente. Trouver ces poids par descente est le sujet de la suite.
    W1 = np.array([[1.0, 1.0], [1.0, 1.0]])
    b1 = np.array([0.0, -1.0])
    W2 = np.array([1.0, -2.0])
    # b2 = -0.5 et non 0 : avec 0, le point (1,1) tombe sur z = 0 EXACTEMENT,
    # c'est-a-dire sur la frontiere elle-meme. La regle « 1 si z > 0 » le
    # classe bien, mais montrer un point pose sur le fil du rasoir affaiblit
    # la demonstration. A -0.5 les quatre z valent -0.5, +0.5, +0.5, -0.5 :
    # symetriques, et chacun a distance franche de la frontiere.
    b2 = -0.5
    print("""
  Meme jeu, meme decision par le signe, mais une couche cachee de deux
  neurones avec ReLU entre les deux. Les poids ci-dessous sont ECRITS,
  pas appris : il s'agit de montrer qu'une solution EXISTE dans cette
  famille-la, ce qui suffit a la separer de la precedente.

    h = ReLU(W1 x + b1)        z = W2 . h + b2

    W1 = [1  1]     b1 = [ 0]      W2 = [1  -2]     b2 = -0.5
         [1  1]          [-1]

  Le premier neurone cache s'allume des qu'au moins une entree vaut 1 ;
  le second seulement quand les deux valent 1. La sortie retranche deux
  fois le second au premier, puis retire un demi.
""".rstrip())
    print()
    print("     x1   x2     z1[1]  z1[2]    h1   h2       z    reponse    y   verdict")
    justes = 0
    for (x1, x2), y in POINTS:
        x = np.array([x1, x2])
        z1 = W1 @ x + b1
        h = np.maximum(z1, 0.0)
        z = float(W2 @ h + b2)
        rep = 1 if z > 0 else 0
        ok = rep == y
        justes += int(ok)
        print(
            f"    {x1:>4.0f} {x2:>4.0f}   {z1[0]:>7.1f} {z1[1]:>6.1f}  {h[0]:>4.1f} {h[1]:>4.1f}"
            f"  {z:>6.1f}       {rep}      {y}   {'ok' if ok else 'FAUX'}"
        )
    print(f"\n    justes : {justes} / 4")
    print("""
  Ce que la couche cachee a change : elle a fabrique DEUX nouvelles
  coordonnees, h1 et h2, et dans le plan (h1, h2) les quatre points ne
  sont plus disposes comme dans le plan (x1, x2). Les deux points de
  classe 1 s'y confondent en (1, 0), et une droite les separe des deux
  autres. La couche cachee n'a pas rendu le probleme lineaire : elle a
  change de coordonnees, et c'est dans les nouvelles qu'il l'est.""".rstrip())


def main() -> None:
    _console_utf8()
    print("  Lecon 2, partie 4 : XOR, ou pourquoi une couche ne suffit pas.")
    contradiction()
    balayage()
    descente()
    couche_cachee()
    titre("Verdict")
    print("""
  A  prouve   : aucun modele lineaire ne classe les quatre points.
  B  constate : sur 15 625 reglages, le meilleur en classe 3 sur 4.
  C  mesure   : la descente converge vers w = 0, b = 0, perte ln 2,
                2 justes sur 4, c'est-a-dire le hasard.
  D  exhibe   : une couche cachee de deux neurones y arrive, 4 sur 4.

  L'obstacle est donc prouve avant que le remede ne soit introduit, et
  le remede est montre en acte. Comment TROUVER ces poids sans les
  ecrire est l'objet de la retropropagation.
""".rstrip())


if __name__ == "__main__":
    main()
