"""
Lecon 2, section 4.8 : la retropropagation faite a la main, refaite a la machine.

Un reseau 2 -> 2 -> 2, ReLU sur la couche cachee, softmax en sortie, entropie
croisee sur UN seul exemple. Tout est fige par la specification de la lecon :
il n'y a pas un tirage aleatoire dans ce fichier, et deux executions donnent
les memes chiffres jusqu'au dernier.

Le reseau est reecrit ici a la main, en numpy pur, et n'importe PAS
cours/reseau.py. C'est voulu, pour deux raisons :

  1. reseau.py tient la convention BATCH EN LIGNES (X est (B, d), Z = X W^T + b)
     parce qu'il traite 64 images d'un coup. La demonstration a la main, elle,
     manipule un vecteur colonne : z = W x + b. Melanger les deux conventions
     dans la meme page est le meilleur moyen de perdre le lecteur.
  2. Cette page doit se lire seule, exactement comme la demonstration qu'elle
     verifie. Aucun aller-retour vers un autre fichier.

Nomenclature du parcours :

    x        l'entree, deux reels                W1, b1   couche cachee
    z1, a1   preactivation et activation cachee  W2, b2   couche de sortie
    z2, a2   preactivation et probabilites       y        la verite terrain
    L        la perte                            eta      le pas
    delta1, delta2   les gradients par rapport aux preactivations

Ce que le programme prouve, et qu'aucune demonstration a la main ne peut
prouver seule : le gradient analytique coincide avec la pente reellement
observee, mesuree par differences finies centrees sur chacun des douze
coefficients.

    python -X utf8 cours/lecon2/retropropagation.py
"""

from __future__ import annotations

import sys

import numpy as np


def _console_utf8() -> None:
    """Windows ouvre la console en cp1252, et les accents la font tomber."""
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


# ── Les valeurs figees par la specification ─────────────────────────────────

GRAINE = 0          # aucun tirage aleatoire : la graine n'a rien a semer, elle
                    # est ecrite pour que le lecteur sache ou la chercher.
ETA = 0.1           # le pas de descente de la section 4.8
EPS = 1e-5          # le decalage des differences finies centrees

x = np.array([1.0, 2.0])
CLASSE_VRAIE = 1                    # la PREMIERE classe, en indexation humaine
y = np.array([1.0, 0.0])            # le vecteur one-hot correspondant


def parametres_figes() -> dict:
    """theta tel que la lecon le pose. Une copie neuve a chaque appel."""
    return {
        "W1": np.array([[0.1, -0.2],
                        [0.3, 0.4]]),
        "b1": np.array([0.1, -0.1]),
        "W2": np.array([[0.5, -0.5],
                        [-0.3, 0.8]]),
        "b2": np.array([0.0, 0.1]),
    }


# ── Le reseau, ecrit comme la demonstration l'ecrit ─────────────────────────

def relu(z: np.ndarray) -> np.ndarray:
    return np.maximum(z, 0.0)


def d_relu(z: np.ndarray) -> np.ndarray:
    """1 si z > 0, 0 sinon. En z = 0 on choisit 0 : la convention est libre."""
    return (z > 0.0).astype(float)


def softmax(z: np.ndarray) -> np.ndarray:
    """
    softmax sur un vecteur. On retranche le maximum : cela ne change rien au
    resultat (le facteur exp(-m) se simplifie en haut et en bas) et empeche
    tout debordement. La demonstration a la main, elle, n'a pas ce souci et
    ecrit les exponentielles brutes ; la section 2 montre que les deux
    coincident au dernier bit.
    """
    e = np.exp(z - z.max())
    return e / e.sum()


def avant(theta: dict, x: np.ndarray) -> dict:
    """Propagation avant. Rend tout ce que la retropropagation redemandera."""
    z1 = theta["W1"] @ x + theta["b1"]          # (2,2)(2,) + (2,) -> (2,)
    a1 = relu(z1)                               # (2,)
    z2 = theta["W2"] @ a1 + theta["b2"]         # (2,2)(2,) + (2,) -> (2,)
    a2 = softmax(z2)                            # (2,), de somme 1
    return {"x": x, "z1": z1, "a1": a1, "z2": z2, "a2": a2}


def perte(a2: np.ndarray, y: np.ndarray) -> float:
    """L = -somme_k y_k ln(a2_k). Sur un one-hot : -ln(a2 de la bonne classe)."""
    return float(-np.sum(y * np.log(a2)))


def arriere(theta: dict, cache: dict, y: np.ndarray) -> dict:
    """
    Le gradient EXACT, par la regle de la chaine, dans l'ordre de la lecon.

    delta2 = a2 - y est le resultat telescopique de softmax + entropie croisee :
    tout le detail des derivees croisees du softmax s'annule, et il ne reste que
    la difference entre ce qu'on predit et ce qui est vrai.
    """
    delta2 = cache["a2"] - y                            # (2,)
    grad_W2 = np.outer(delta2, cache["a1"])             # (2,)x(2,) -> (2,2)
    grad_b2 = delta2                                    # (2,)

    # Le detail terme a terme du transport vers la couche cachee :
    # termes[i, j] = W2[i, j] * delta2[i], et grad_a1[j] est la somme sur i.
    termes = theta["W2"] * delta2[:, None]              # (2,2)
    grad_a1 = termes.sum(axis=0)                        # = W2^T delta2

    delta1 = grad_a1 * d_relu(cache["z1"])              # la porte ReLU
    grad_W1 = np.outer(delta1, cache["x"])              # (2,2)
    grad_b1 = delta1                                    # (2,)

    return {"delta2": delta2, "W2": grad_W2, "b2": grad_b2,
            "termes": termes, "grad_a1": grad_a1,
            "delta1": delta1, "W1": grad_W1, "b1": grad_b1}


def perte_en(theta: dict, x: np.ndarray, y: np.ndarray) -> float:
    return perte(avant(theta, x)["a2"], y)


def differences_finies(theta: dict, x: np.ndarray, y: np.ndarray,
                       eps: float = EPS) -> dict:
    """
    La pente reellement observee, coefficient par coefficient :

        dL/dt  ~  (L(theta + eps e) - L(theta - eps e)) / (2 eps)

    Centree, donc l'erreur est en eps^2 et non en eps. C'est la seule maniere
    de prouver que la retropropagation ne s'est pas trompee de signe quelque
    part : elle ne redemande jamais la formule, seulement la perte.
    """
    numerique = {}
    for cle in ("W1", "b1", "W2", "b2"):
        g = np.zeros_like(theta[cle])
        for indice in np.ndindex(theta[cle].shape):
            garde = theta[cle][indice]
            theta[cle][indice] = garde + eps
            L_plus = perte_en(theta, x, y)
            theta[cle][indice] = garde - eps
            L_moins = perte_en(theta, x, y)
            theta[cle][indice] = garde
            g[indice] = (L_plus - L_moins) / (2.0 * eps)
        numerique[cle] = g
    return numerique


def pas(theta: dict, grads: dict, eta: float) -> dict:
    """theta <- theta - eta grad. Rend un theta neuf : l'ancien reste lisible."""
    return {cle: theta[cle] - eta * grads[cle] for cle in theta}


# ── Mise en page ────────────────────────────────────────────────────────────

LARGEUR = 78


def titre(numero: str, texte: str, saut: bool = True) -> None:
    """Une barre de section. Pas de ligne vide avant la toute premiere."""
    if saut:
        print()
    print("=" * LARGEUR)
    print(f"  {numero}. {texte}")
    print("=" * LARGEUR)


def nombre(t: float, n: int = 6, large: int = 0) -> str:
    """
    Un flottant, avec le zero negatif ramene au zero tout court.

    IEEE 754 distingue 0.0 de -0.0, et -0.802184 * 0.0 vaut -0.0. Les deux
    sont EGAUX (-0.0 == 0.0 est vrai) : c'est un signe d'affichage, pas une
    quantite. L'addition de 0.0 ramene -0.0 a 0.0 et ne touche a rien d'autre.
    """
    t = float(t) + 0.0
    return f"{t:>{large or n + 4}.{n}f}"


def vec(v: np.ndarray, n: int = 6) -> str:
    """Un vecteur sur une ligne, colonnes alignees, signe compris."""
    return "[" + ", ".join(nombre(t, n) for t in np.atleast_1d(v)) + "]"


def mat(M: np.ndarray, marge: str, n: int = 6) -> str:
    """Une matrice, une ligne par ligne, indentee sous la premiere."""
    return ("\n" + marge).join(vec(ligne, n) for ligne in np.atleast_2d(M))


def main() -> None:
    _console_utf8()
    theta = parametres_figes()

    # ---------------------------------------------------------------- 1 -----
    titre("1", "Le reseau et les valeurs figees", saut=False)
    print("  architecture   2 -> 2 -> 2      ReLU sur la cachee, softmax en sortie")
    print("  perte          entropie croisee sur UN exemple")
    print(f"  graine         {GRAINE}   (aucun tirage : tout est fige par la lecon)")
    print()
    print(f"  x  = {vec(x, 4)}")
    print(f"  c  = {CLASSE_VRAIE}   (la premiere classe, en indexation humaine)")
    print(f"  y  = {vec(y, 4)}")
    print()
    print(f"  W1 = {mat(theta['W1'], '       ', 4)}      b1 = {vec(theta['b1'], 4)}")
    print(f"  W2 = {mat(theta['W2'], '       ', 4)}      b2 = {vec(theta['b2'], 4)}")

    # ---------------------------------------------------------------- 2 -----
    titre("2", "Propagation avant")
    cache = avant(theta, x)
    z1, a1, z2, a2 = cache["z1"], cache["a1"], cache["z2"], cache["a2"]
    W1, b1, W2, b2 = theta["W1"], theta["b1"], theta["W2"], theta["b2"]

    print("  z1 = W1 x + b1")
    for i in range(2):
        print(f"    z1[{i + 1}] = {W1[i, 0]:>5} * {x[0]:<4.1f} + {W1[i, 1]:>5}"
              f" * {x[1]:<4.1f} + {b1[i]:>5}  =  {z1[i]:>9.6f}")
    print(f"  z1 = {vec(z1)}")
    print()
    print("  a1 = ReLU(z1)")
    print(f"  a1 = {vec(a1)}")
    print(f"       le neurone 1 est ETEINT : z1[1] = {z1[0]:.6f} < 0, donc a1[1] = 0")
    print()
    print("  z2 = W2 a1 + b2")
    for i in range(2):
        print(f"    z2[{i + 1}] = {W2[i, 0]:>5} * {a1[0]:<8.6f} + {W2[i, 1]:>5}"
              f" * {a1[1]:<8.6f} + {b2[i]:>5}  =  {z2[i]:>9.6f}")
    print(f"  z2 = {vec(z2)}")
    print()
    print("  a2 = softmax(z2), a la main, avec les exponentielles brutes")
    brutes = np.exp(z2)
    S = float(brutes.sum())
    for i in range(2):
        print(f"    exp(z2[{i + 1}]) = exp({z2[i]:>9.6f}) = {brutes[i]:.6f}")
    print(f"    S = {brutes[0]:.6f} + {brutes[1]:.6f} = {S:.6f}")
    for i in range(2):
        print(f"    a2[{i + 1}] = {brutes[i]:.6f} / {S:.6f} = {brutes[i] / S:.6f}")
    print(f"  a2 = {vec(a2)}      somme = {a2.sum():.6f}")
    ecart_softmax = float(np.max(np.abs(a2 - brutes / S)))
    print(f"  softmax decale contre exponentielles brutes : ecart max {ecart_softmax:.3e}")

    # ---------------------------------------------------------------- 3 -----
    titre("3", "La perte")
    L = perte(a2, y)
    print(f"  L = -ln(a2[{CLASSE_VRAIE}]) = -ln({a2[0]:.6f}) = {L:.6f}")
    print(f"  hasard pur, sur deux classes : -ln(0.5) = {-np.log(0.5):.6f}")
    print("  le reseau est donc PIRE que le hasard sur cet exemple, ce qui est")
    print("  normal : ses poids n'ont encore rien appris.")

    # ---------------------------------------------------------------- 4 -----
    titre("4", "Retropropagation, dans l'ordre de la demonstration")
    grads = arriere(theta, cache, y)
    delta2 = grads["delta2"]
    termes = grads["termes"]
    grad_a1 = grads["grad_a1"]
    delta1 = grads["delta1"]

    print("  delta2 = a2 - y        (softmax + entropie croisee : tout telescope)")
    print(f"  delta2 = {vec(delta2)}")
    print()
    print("  grad_W2 = delta2 (x) a1        grad_b2 = delta2")
    print(f"  grad_W2 = {mat(grads['W2'], '            ')}")
    print(f"  grad_b2 = {vec(grads['b2'])}")
    print("            la premiere colonne de grad_W2 est nulle parce que a1[1] = 0 :")
    print("            un poids qui multiplie un zero ne peut rien avoir fait.")
    print()
    print("  grad_a1 = W2^T delta2, terme a terme")
    for j in range(2):
        details = nombre(termes[0, j], 6, 10)
        for i in range(1, 2):
            signe = "-" if termes[i, j] < 0 else "+"
            details += f" {signe} {abs(termes[i, j]):.6f}"
        print(f"    grad_a1[{j + 1}] = {details} = {nombre(grad_a1[j], 6, 10)}")
    print(f"  grad_a1 = {vec(grad_a1)}")
    print()
    print("  delta1 = grad_a1 * ReLU'(z1)")
    print(f"    ReLU'(z1) = {vec(d_relu(z1), 4)}")
    print(f"  delta1 = {vec(delta1)}")
    print("           la porte ReLU annule le gradient du neurone eteint : le")
    print("           gradient ne traverse pas un neurone qui n'a pas parle.")
    print()
    print("  grad_W1 = delta1 (x) x        grad_b1 = delta1")
    print(f"  grad_W1 = {mat(grads['W1'], '            ')}")
    print(f"  grad_b1 = {vec(grads['b1'])}")
    print()
    print("  Detail d'affichage, pour qui relit la sortie brute : la machine")
    print("  produit -0.0 la ou la lecon ecrit 0, parce que -0.802184 * 0.0 vaut")
    print("  -0.0 en IEEE 754. Ce zero negatif est EGAL a zero ; on l'affiche 0.")

    # ---------------------------------------------------------------- 5 -----
    titre("5", "Verification par differences finies centrees")
    print(f"  eps = {EPS:.0e}      dL/dt ~ (L(theta + eps) - L(theta - eps)) / (2 eps)")
    print("  ecart relatif = |analytique - numerique| / (|analytique| + |numerique|)")
    print()
    numerique = differences_finies(parametres_figes(), x, y)
    print(f"    {'coefficient':<14}{'analytique':>16}{'differences finies':>22}"
          f"{'ecart relatif':>17}")
    pire = 0.0
    pire_nom = ""
    for cle in ("W1", "b1", "W2", "b2"):
        for indice in np.ndindex(theta[cle].shape):
            humain = ",".join(str(k + 1) for k in indice)
            nom = f"{cle}[{humain}]"
            a = float(grads[cle][indice])
            n = float(numerique[cle][indice])
            ecart = abs(a - n) / max(abs(a) + abs(n), 1e-12)
            if ecart > pire:
                pire, pire_nom = ecart, nom
            print(f"    {nom:<14}{nombre(a, 9, 16)}{nombre(n, 9, 22)}{ecart:>17.3e}")
    print()
    print(f"  ECART RELATIF MAXIMAL : {pire:.3e}   (sur {pire_nom})")
    print("  Sous 1e-06 la retropropagation est consideree juste : la pente que")
    print("  la formule annonce est bien la pente que la perte a vraiment.")
    print()
    print("  Les coefficients a gradient nul, W1[1,1], W1[1,2] et b1[1], donnent")
    print(f"  EXACTEMENT zero des deux cotes. Un decalage de {EPS:.0e} ne reveille")
    print(f"  pas un neurone a z1[1] = {z1[0]:.4f} : la perte ne bouge pas d'un bit,")
    print("  et la mesure confirme que ces poids ne recoivent rien du tout.")

    # ---------------------------------------------------------------- 6 -----
    titre("6", f"Un pas de descente, eta = {ETA}")
    theta2 = pas(theta, {cle: grads[cle] for cle in theta}, ETA)
    for cle in ("W1", "b1", "W2", "b2"):
        marge = " " * (len(cle) + 9)
        print(f"  {cle} avant {mat(theta[cle], marge)}")
        print(f"  {cle} apres {mat(theta2[cle], marge)}")
    print()
    cache2 = avant(theta2, x)
    L2 = perte(cache2["a2"], y)
    print(f"  z1 = {vec(cache2['z1'])}      a1 = {vec(cache2['a1'])}")
    print(f"  z2 = {vec(cache2['z2'])}      a2 = {vec(cache2['a2'])}")
    print()
    print(f"  perte avant le pas   {L:.6f}")
    print(f"  perte apres le pas   {L2:.6f}")
    print(f"  la perte a baisse de {L - L2:.6f}, soit {100 * (L - L2) / L:.2f} pour cent")
    print(f"  la bonne classe passe de {a2[0]:.6f} a {cache2['a2'][0]:.6f}")

    # ---------------------------------------------------------------- 7 -----
    titre("7", "Confrontation avec la demonstration a la main")
    print("  La lecon donne quatre decimales. Une ligne est conforme si la mesure,")
    print("  ARRONDIE a quatre decimales, tombe sur la valeur de la lecon.")
    print()
    controles = [
        ("z1[1]", -0.2, z1[0]),
        ("z1[2]", 1.0, z1[1]),
        ("a1[1]", 0.0, a1[0]),
        ("a1[2]", 1.0, a1[1]),
        ("z2[1]", -0.5, z2[0]),
        ("z2[2]", 0.9, z2[1]),
        ("exp(z2[1])", 0.6065, brutes[0]),
        ("exp(z2[2])", 2.4596, brutes[1]),
        ("S", 3.0661, S),
        ("a2[1]", 0.1978, a2[0]),
        ("a2[2]", 0.8022, a2[1]),
        ("perte", 1.6204, L),
        ("delta2[1]", -0.8022, delta2[0]),
        ("delta2[2]", 0.8022, delta2[1]),
        ("grad_W2[1,1]", 0.0, grads["W2"][0, 0]),
        ("grad_W2[1,2]", -0.8022, grads["W2"][0, 1]),
        ("grad_W2[2,1]", 0.0, grads["W2"][1, 0]),
        ("grad_W2[2,2]", 0.8022, grads["W2"][1, 1]),
        ("detail W2[1,1]d2", -0.4011, termes[0, 0]),
        ("detail W2[2,1]d2", -0.2407, termes[1, 0]),
        ("detail W2[1,2]d2", 0.4011, termes[0, 1]),
        ("detail W2[2,2]d2", 0.6417, termes[1, 1]),
        ("grad_a1[1]", -0.6417, grad_a1[0]),
        ("grad_a1[2]", 1.0428, grad_a1[1]),
        ("delta1[1]", 0.0, delta1[0]),
        ("delta1[2]", 1.0428, delta1[1]),
        ("grad_W1[1,1]", 0.0, grads["W1"][0, 0]),
        ("grad_W1[1,2]", 0.0, grads["W1"][0, 1]),
        ("grad_W1[2,1]", 1.0428, grads["W1"][1, 0]),
        ("grad_W1[2,2]", 2.0857, grads["W1"][1, 1]),
        ("grad_b1[1]", 0.0, grads["b1"][0]),
        ("grad_b1[2]", 1.0428, grads["b1"][1]),
        ("apres pas a2[1]", 0.4095, cache2["a2"][0]),
        ("apres pas a2[2]", 0.5905, cache2["a2"][1]),
        ("apres pas perte", 0.8929, L2),
    ]
    print(f"    {'quantite':<18}{'la lecon':>11}{'la machine':>16}"
          f"{'arrondie':>12}{'verdict':>10}")
    ecarts = []
    for nom, attendu, mesure in controles:
        mesure = float(mesure)
        arrondie = round(mesure, 4)
        conforme = abs(arrondie - attendu) < 1e-9
        if not conforme:
            ecarts.append((nom, attendu, mesure, arrondie))
        print(f"    {nom:<18}{attendu:>11.4f}{nombre(mesure, 9, 16)}"
              f"{nombre(arrondie, 4, 12)}{'ok' if conforme else 'ECART':>10}")
    print()
    print(f"  {len(controles) - len(ecarts)} lignes conformes sur {len(controles)}.")
    if not ecarts:
        print("  Aucun ecart : la main et la machine disent la meme chose.")
    else:
        print("  ECARTS RELEVES. La mesure gagne toujours contre l'attente : c'est")
        print("  la valeur de la machine qui doit figurer dans la lecon.")
        for nom, attendu, mesure, arrondie in ecarts:
            print(f"    {nom:<18} la lecon dit {attendu:.4f},"
                  f" la machine mesure {mesure:.9f} -> {arrondie:.4f}")

    print()
    print("=" * LARGEUR)


if __name__ == "__main__":
    main()
