"""
Les chiffres manuscrits : le fil conducteur du parcours depuis la lecon 2.

Une image brute X vit dans [0,1]^(28x28). Le reseau ne mange pas des matrices :
on l'aplatit en x dans [0,1]^784. C'est exactement la mise en forme de la
lecon 2, partie 4.

    X (28 x 28)  --aplatissement-->  x (784 x 1)

Le jeu est telecharge une fois et mis en cache dans cours/.donnees/, qui n'est
pas versionne. Aucune bibliotheque d'apprentissage n'est utilisee : seulement
numpy pour l'algebre et urllib pour le telechargement.
"""

from __future__ import annotations

import gzip
import struct
import urllib.request
from pathlib import Path

import numpy as np

CACHE = Path(__file__).resolve().parent / ".donnees"

# Deux miroirs : le premier repond, le second sert de secours.
MIROIRS = [
    "https://ossci-datasets.s3.amazonaws.com/mnist/",
    "https://storage.googleapis.com/cvdf-datasets/mnist/",
]

FICHIERS = {
    "x_train": "train-images-idx3-ubyte.gz",
    "y_train": "train-labels-idx1-ubyte.gz",
    "x_test": "t10k-images-idx3-ubyte.gz",
    "y_test": "t10k-labels-idx1-ubyte.gz",
}


def _telecharger(nom: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    cible = CACHE / nom
    if cible.exists():
        return cible
    dernier = None
    for base in MIROIRS:
        try:
            print(f"  telechargement de {nom}...")
            urllib.request.urlretrieve(base + nom, cible)
            return cible
        except Exception as erreur:  # noqa: BLE001
            dernier = erreur
    raise SystemExit(f"  echec du telechargement de {nom} : {dernier}")


def _lire_idx(chemin: Path) -> np.ndarray:
    """Le format IDX : un entete de magie, puis les dimensions, puis les octets."""
    with gzip.open(chemin, "rb") as flux:
        magie, = struct.unpack(">I", flux.read(4))
        nb_dims = magie & 0xFF
        dims = struct.unpack(">" + "I" * nb_dims, flux.read(4 * nb_dims))
        brut = np.frombuffer(flux.read(), dtype=np.uint8)
    return brut.reshape(dims)


def charger(n_train: int | None = None, n_test: int | None = None):
    """
    Rend (X_train, c_train, X_test, c_test).

      X : (N, 784) float64 dans [0,1]   -- les x^(n) empiles EN LIGNES
      c : (N,)     int     dans 0..9    -- l'etiquette de classe

    Convention de la lecon 2, partie 4 : les exemples sont empiles en LIGNES
    pour le calcul par lots, alors que le formalisme ecrit x comme un vecteur
    COLONNE. C'est la seule transposition mentale du parcours, et elle est
    signalee a chaque fois qu'elle sert.
    """
    donnees = {cle: _lire_idx(_telecharger(nom)) for cle, nom in FICHIERS.items()}

    x_train = donnees["x_train"].reshape(-1, 784).astype(np.float64) / 255.0
    x_test = donnees["x_test"].reshape(-1, 784).astype(np.float64) / 255.0
    c_train = donnees["y_train"].astype(np.int64)
    c_test = donnees["y_test"].astype(np.int64)

    if n_train is not None:
        x_train, c_train = x_train[:n_train], c_train[:n_train]
    if n_test is not None:
        x_test, c_test = x_test[:n_test], c_test[:n_test]

    return x_train, c_train, x_test, c_test


def onehot(c: np.ndarray, K: int = 10) -> np.ndarray:
    """c (N,) -> Y (N, K), la ligne n vaut onehot(c^(n))."""
    Y = np.zeros((c.size, K))
    Y[np.arange(c.size), c] = 1.0
    return Y


if __name__ == "__main__":
    Xtr, ctr, Xte, cte = charger()
    print(f"  train : X {Xtr.shape} c {ctr.shape}   test : X {Xte.shape}")
    print(f"  valeurs dans [{Xtr.min():.3f}, {Xtr.max():.3f}]")
    print(f"  moyenne globale d'un pixel : {Xtr.mean():.4f}")
    print(f"  ecart-type global          : {Xtr.std():.4f}")
    print(f"  classes                    : {np.bincount(ctr)}")
