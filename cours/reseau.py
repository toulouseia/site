"""
Le reseau de la lecon 2, ecrit entierement a la main : 784 -> 128 -> 10.

Aucune bibliotheque d'apprentissage. numpy sert d'algebre lineaire, rien de
plus. Chaque nom de variable suit la nomenclature du parcours :

    x  <-> x          W1, b1 <-> W^[1], b^[1]      z, Z <-> z, Z
    y  <-> y          W2, b2 <-> W^[2], b^[2]      a, A <-> a, A
    Y  <-> onehot     theta  <-> theta             D1, D2 <-> delta^[1], delta^[2]

CONVENTION DE LOT, annoncee et tenue partout dans ce fichier :
le formalisme ecrit x comme un vecteur COLONNE (784 x 1). Pour traiter B
exemples d'un coup, on les empile en LIGNES : X est (B, 784). La consequence
est que z = W x + b devient

    Z = X W1^T + b1        (B, 784)(784, 128) + (128,) -> (B, 128)

La transposee change de cote, et rien d'autre. Chaque dimension est verifiee en
commentaire au moment ou elle est produite.
"""

from __future__ import annotations

import numpy as np

D_IN = 784
D_CACHE = 128
K = 10


# ── Activations ─────────────────────────────────────────────────────────────

def sigmoide(z: np.ndarray) -> np.ndarray:
    """
    sigma(z) = 1 / (1 + exp(-z)).

    Ecrite en deux branches pour ne jamais evaluer exp d'un grand positif :
    exp(710) deborde en flottant 64 bits, et un seul debordement empoisonne
    toute une couche.
    """
    positif = z >= 0
    sortie = np.empty_like(z)
    sortie[positif] = 1.0 / (1.0 + np.exp(-z[positif]))
    e = np.exp(z[~positif])
    sortie[~positif] = e / (1.0 + e)
    return sortie


def d_sigmoide(a: np.ndarray) -> np.ndarray:
    """sigma'(z) = sigma(z) (1 - sigma(z)) = a (1 - a). On derive depuis a."""
    return a * (1.0 - a)


def relu(z: np.ndarray) -> np.ndarray:
    return np.maximum(z, 0.0)


def d_relu(z: np.ndarray) -> np.ndarray:
    """1 si z > 0, 0 sinon. En z = 0 on choisit 0 : la convention est libre."""
    return (z > 0.0).astype(z.dtype)


def softmax(Z: np.ndarray) -> np.ndarray:
    """
    softmax ligne par ligne. On retranche le maximum de chaque ligne : cela ne
    change pas le resultat (le facteur exp(-m) se simplifie entre le numerateur
    et le denominateur) et empeche tout debordement.
    """
    Z = Z - Z.max(axis=1, keepdims=True)
    E = np.exp(Z)
    return E / E.sum(axis=1, keepdims=True)


# ── Parametres ──────────────────────────────────────────────────────────────

def init_parametres(graine: int = 0, methode: str = "xavier",
                    tailles: tuple[int, ...] = (D_IN, D_CACHE, K)) -> dict:
    """
    theta = {W1, b1, W2, b2, ...}. Les biais partent a zero : rien ne les rend
    symetriques entre eux une fois les poids tires au hasard.

    methode :
      "zero"   tout a zero            -- sert a PROUVER la symetrie (partie 4)
      "grand"  N(0, 1)                -- sert a PROUVER la saturation
      "xavier" N(0, 1 / d_in)         -- variance conservee pour sigmoide/tanh
      "he"     N(0, 2 / d_in)         -- variance conservee pour ReLU
    """
    rng = np.random.default_rng(graine)
    theta = {}
    for couche in range(1, len(tailles)):
        d_in, d_out = tailles[couche - 1], tailles[couche]
        if methode == "zero":
            ecart = 0.0
        elif methode == "grand":
            ecart = 1.0
        elif methode == "xavier":
            ecart = np.sqrt(1.0 / d_in)
        elif methode == "he":
            ecart = np.sqrt(2.0 / d_in)
        else:
            raise ValueError(f"methode inconnue : {methode}")
        theta[f"W{couche}"] = rng.normal(0.0, ecart, size=(d_out, d_in))
        theta[f"b{couche}"] = np.zeros(d_out)
    return theta


def nb_parametres(theta: dict) -> int:
    return sum(v.size for v in theta.values())


# ── Propagation avant ───────────────────────────────────────────────────────

def avant(theta: dict, X: np.ndarray, activation: str = "sigmoide") -> dict:
    """
    Rend le cache de tout ce que la retropropagation redemandera.

    Pour un reseau a L couches, la couche l < L porte l'activation choisie, la
    couche L porte softmax. Le cache garde Z et A de chaque couche.
    """
    L = len(theta) // 2
    cache = {"A0": X}                       # (B, 784)
    A = X
    for couche in range(1, L + 1):
        W = theta[f"W{couche}"]             # (d_out, d_in)
        b = theta[f"b{couche}"]             # (d_out,)
        Z = A @ W.T + b                     # (B, d_in)(d_in, d_out) -> (B, d_out)
        if couche == L:
            A = softmax(Z)                  # (B, K)
        elif activation == "sigmoide":
            A = sigmoide(Z)
        else:
            A = relu(Z)
        cache[f"Z{couche}"] = Z
        cache[f"A{couche}"] = A
    return cache


# ── Perte ───────────────────────────────────────────────────────────────────

def perte(A_final: np.ndarray, Y: np.ndarray) -> float:
    """
    Entropie croisee moyenne : L = -(1/B) sum_n sum_k Y_nk ln(A_nk).

    Le plancher a 1e-12 evite ln(0) quand une probabilite tombe sous la
    precision machine. Il n'est jamais atteint sur un reseau qui apprend.
    """
    B = Y.shape[0]
    return float(-np.sum(Y * np.log(np.clip(A_final, 1e-12, 1.0))) / B)


def precision(A_final: np.ndarray, c: np.ndarray) -> float:
    return float(np.mean(A_final.argmax(axis=1) == c))


# ── Retropropagation ────────────────────────────────────────────────────────

def arriere(theta: dict, cache: dict, Y: np.ndarray,
            activation: str = "sigmoide") -> dict:
    """
    Le gradient EXACT de L par rapport a chaque parametre. Ce n'est pas une
    approximation : c'est la regle de la chaine, organisee pour ne calculer
    chaque quantite qu'une fois.

    Le point de depart est le resultat telescopique de la lecon 2 :

        grad_{Z_L} l = A_L - Y          (softmax + entropie croisee)

    Divise par B parce que L est une MOYENNE sur le lot.
    """
    L = len(theta) // 2
    B = Y.shape[0]
    grads = {}

    D = (cache[f"A{L}"] - Y) / B                       # (B, K)
    for couche in range(L, 0, -1):
        A_prec = cache[f"A{couche - 1}"]               # (B, d_in)
        grads[f"W{couche}"] = D.T @ A_prec             # (d_out, B)(B, d_in)
        grads[f"b{couche}"] = D.sum(axis=0)            # (d_out,)
        if couche > 1:
            D = D @ theta[f"W{couche}"]                # (B, d_out)(d_out, d_in)
            if activation == "sigmoide":
                D = D * d_sigmoide(cache[f"A{couche - 1}"])
            else:
                D = D * d_relu(cache[f"Z{couche - 1}"])
    return grads


# ── Un pas de descente ──────────────────────────────────────────────────────

def pas(theta: dict, grads: dict, eta: float) -> None:
    """theta_{t+1} = theta_t - eta * grad_theta L(theta_t). En place."""
    for cle in theta:
        theta[cle] -= eta * grads[cle]


def gradient_complet(theta: dict, X: np.ndarray, Y: np.ndarray,
                     activation: str = "sigmoide") -> dict:
    return arriere(theta, avant(theta, X, activation), Y, activation)


def evaluer(theta: dict, X: np.ndarray, Y: np.ndarray, c: np.ndarray,
            activation: str = "sigmoide") -> tuple[float, float]:
    A = avant(theta, X, activation)[f"A{len(theta) // 2}"]
    return perte(A, Y), precision(A, c)
