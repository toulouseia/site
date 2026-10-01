"""Lecon 1, section 2.4 : la preuve que la regle n'existe pas.

Le chapitre 1 affirme qu'on ne peut pas ecrire a la main la regle qui reconnait
un chiffre manuscrit. Ce fichier ne l'affirme pas : il le mesure, sur le jeu
d'entrainement de MNIST, 60 000 images de 28 x 28 pixels.

Deux mesures portent la demonstration.

    1. Aucun pixel n'est encre sur les 6 131 images du chiffre 3. Une regle de
       la forme « si ce pixel est allume alors c'est un 3 » n'a donc pas un
       seul pixel a nommer, et l'enonce vaut pour TOUTE regle portant sur un
       pixel isole.

    2. Deux 3 differents ne partagent qu'une fraction de leurs pixels encres,
       et cette fraction n'est pas franchement plus grande qu'entre un 3 et un
       8. L'appartenance a une classe ne se lit pas dans la ressemblance pixel
       a pixel.

LE SEUIL D'ENCRE. Un pixel vaut un octet, de 0 a 255. On appelle ENCRE un pixel
dont l'octet DEPASSE 128. Ce seuil est ARBITRAIRE : rien dans les donnees ne le
designe, et trois lectures voisines de « la moitie de l'echelle » ne donnent pas
le meme compte. Le programme les mesure toutes les trois et les imprime, plutot
que de laisser croire que 242 serait une propriete du jeu.

C'est le seul reglage du fichier. Il est ecrit une fois, en constante nommee,
et rien d'autre ne le fixe.

LE TIRAGE. Les moyennes de chevauchement sont estimees sur 4 000 paires tirees
au hasard, avec le generateur de numpy initialise a la graine 0. Le meme
programme relance donne les memes nombres, sur n'importe quelle machine.

    python cours/lecon1/chiffres.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import donnees  # noqa: E402  -- le chemin doit etre pose avant l'import


def _console_utf8() -> None:
    """Windows ouvre la console en cp1252, et les accents la font tomber."""
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


# ── Le seul reglage ─────────────────────────────────────────────────────────

SEUIL = 128  # un pixel est encre si son octet DEPASSE cette valeur
GRAINE = 0
N_PAIRES = 4000

# Les trois facons d'ecrire « la moitie de l'echelle ». Elles ne sont pas
# equivalentes, et l'ecart se voit sur le compte des pixels jamais encres. La
# premiere est celle que le cours retient ; les deux autres sont ce qu'un
# lecteur ecrirait spontanement, et elles donnent un nombre different.
LECTURES_DU_SEUIL = [
    ("octet > 128", "le seuil retenu", lambda o: o > 128),
    ("octet >= 128", "soit x/255 > 0,5", lambda o: o >= 128),
    ("octet > 127", "soit x/255 >= 0,5", lambda o: o > 127),
]

# Les couples dont on mesure le chevauchement, dans l'ordre ou la lecon les
# lit : le meme chiffre d'abord, puis les confusions classiques, puis un
# chiffre dont la forme n'a rien a voir, puis le meme chiffre le plus regulier.
COUPLES = [
    (3, 3, "deux 3 differents"),
    (3, 8, "un 3 et un 8"),
    (3, 5, "un 3 et un 5"),
    (3, 1, "un 3 et un 1"),
    (1, 1, "deux 1 differents"),
]

# Le nombre de parametres, section 10.2. Ce ne sont pas des mesures, ce sont
# des comptes : ils sont ecrits comme des sommes, et non comme des resultats.
GABARITS = (784, 10)  # dix gabarits sur 784 pixels : 784 x 10 poids, 10 biais
RESEAU = (784, 128, 10)  # le reseau du chapitre 2


# ── Les mesures ─────────────────────────────────────────────────────────────


def encre(X: np.ndarray) -> np.ndarray:
    """La carte booleenne des pixels encres. X est en [0,1], l'octet est X*255."""
    return np.rint(X * 255.0).astype(np.int16) > SEUIL


def parametres(couches: tuple[int, ...]) -> int:
    """Un poids par connexion, un biais par neurone de sortie de chaque bloc."""
    total = 0
    for entree, sortie in zip(couches, couches[1:]):
        total += entree * sortie + sortie
    return total


def chevauchement(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    """L'intersection sur l'union, ligne a ligne. Deux images vides seraient
    une division par zero ; il n'y en a pas dans MNIST, et on le verifie."""
    union = np.logical_or(A, B).sum(axis=1)
    if (union == 0).any():
        raise ValueError("deux images entierement vides : l'union est nulle")
    return np.logical_and(A, B).sum(axis=1) / union


def paires(indices_a, indices_b, tirage) -> tuple[np.ndarray, np.ndarray]:
    """N_PAIRES couples. Quand les deux classes sont la meme, on refuse qu'une
    image soit appariee avec elle-meme : le chevauchement vaudrait 1 et
    gonflerait la moyenne sans rien dire."""
    a = tirage.choice(indices_a, N_PAIRES)
    b = tirage.choice(indices_b, N_PAIRES)
    if indices_a is indices_b:
        while (memes := a == b).any():
            b[memes] = tirage.choice(indices_b, int(memes.sum()))
    return a, b


def main() -> None:
    _console_utf8()
    X, c, _, _ = donnees.charger()
    E = encre(X)
    N, d = X.shape
    par_classe = np.bincount(c, minlength=10)
    i3 = np.flatnonzero(c == 3)
    E3 = E[i3]

    print()
    print("  LE JEU D'ENTRAINEMENT")
    print(f"    images             {N}")
    print(f"    pixels par image   {d}   (28 x 28)")
    print("    repartition        " + " ".join(f"{n}" for n in par_classe))
    print(f"    somme              {int(par_classe.sum())}")
    print()

    # LA CONVENTION, AVANT LA PREMIERE MESURE. Le seuil est arbitraire, et un
    # nombre qui bouge quand on le deplace d'une unite doit etre presente
    # comme tel : les trois lectures sont mesurees, pas commentees.
    octets = np.rint(X * 255.0).astype(np.int16)
    o3 = octets[i3]
    print("  LE SEUIL D'ENCRE, ARBITRAIRE, ET CE QU'IL CHANGE")
    print(f"    un pixel est encre si son octet depasse {SEUIL}. Rien dans les")
    print("    donnees ne designe cette valeur : trois lectures voisines de la")
    print("    moitie de l'echelle donnent trois comptes, et les voici, sur les")
    print("    pixels encres sur AUCUNE des 6131 images du chiffre 3.")
    for libelle, glose, test in LECTURES_DU_SEUIL:
        jamais = int((~test(o3).any(axis=0)).sum())
        print(f"      {libelle:14s} {glose:18s} {jamais} / {d}")
    print()

    print("  1. AUCUNE REGLE NE PEUT PORTER SUR UN PIXEL ISOLE")
    print(f"    images du chiffre 3          {i3.size}")
    print(f"    pixels encres sur TOUTES     {int(E3.all(axis=0).sum())} / {d}")
    print(f"    pixels encres sur AUCUNE     {int((~E3.any(axis=0)).sum())} / {d}")
    # La descente de l'intersection, image par image : c'est ce que la scene
    # « aucun-pixel-commun » montre, et il faut donc les memes nombres.
    courante = E3[0].copy()
    descente = [int(courante.sum())]
    epuisement = None
    for k in range(1, i3.size):
        courante &= E3[k]
        descente.append(int(courante.sum()))
        if epuisement is None and not courante.any():
            epuisement = k + 1
    print("    intersection courante        " + " ".join(str(v) for v in descente[:10]) + " ...")
    print(f"    elle est vide des la {epuisement}e image")
    print()

    # Les DEUX PREMIERS du jeu, et non deux tires au sort : la scene
    # « aucun-pixel-commun » dessine ces deux images-la, et un lecteur qui
    # relance le programme doit retrouver les nombres qu'il voit a l'ecran.
    print("  2. DEUX 3, LES DEUX PREMIERS DU JEU")
    print(f"    pixels encres du premier     {int(E3[0].sum())}")
    print(f"    pixels encres du second      {int(E3[1].sum())}")
    print(f"    pixels communs               {int((E3[0] & E3[1]).sum())}")
    print()

    print(f"  3. CHEVAUCHEMENT MOYEN, {N_PAIRES} PAIRES, GRAINE {GRAINE}")
    print("     intersection / union des pixels encres")
    indices = {k: np.flatnonzero(c == k) for k in range(10)}
    for ka, kb, libelle in COUPLES:
        tirage = np.random.default_rng(GRAINE)
        a, b = paires(indices[ka], indices[ka] if ka == kb else indices[kb], tirage)
        print(f"    {libelle:24s}     {chevauchement(E[a], E[b]).mean():.3f}")
    print()

    print("  4. LE NOMBRE DE REGLAGES")
    print(f"    deux appartements, p = d + 1     {2 + 1}")
    print(
        f"    dix gabarits sur 784 pixels      "
        f"{GABARITS[0]} x {GABARITS[1]} + {GABARITS[1]} = {parametres(GABARITS)}"
    )
    print(
        f"    le reseau 784 -> 128 -> 10       "
        f"{RESEAU[0]} x {RESEAU[1]} + {RESEAU[1]} + {RESEAU[1]} x {RESEAU[2]}"
        f" + {RESEAU[2]} = {parametres(RESEAU)}"
    )
    # Les deux facteurs sont cites tels quels dans la section 9.2. Arrondis ici
    # et nulle part ailleurs : un facteur recalcule a la main dans le texte
    # finirait par diverger de celui-ci.
    trois = 2 + 1
    print(f"    facteur 3 -> 7850                {round(parametres(GABARITS) / trois)}")
    print(f"    facteur 3 -> 101770              {round(parametres(RESEAU) / trois)}")
    print()


if __name__ == "__main__":
    main()
