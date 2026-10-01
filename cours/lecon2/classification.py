"""
Lecon 2, partie 3 : pourquoi la classification ne se traite pas comme une
regression.

    python -X utf8 cours/lecon2/classification.py

Quatre demonstrations, toutes chiffrees, et trois figures :

    A   la perte 0-1 n'a pas de gradient           section 3.1
    B   la MSE punit les points bien classes       section 3.2
    C   la table des gradients                     section 3.5
    D   la regression logistique repare            section 3.5

Nomenclature du parcours : x, y, y_hat, z, a, w, b, loss, L, eta, grad_w,
grad_b. Aucune bibliotheque d'apprentissage : numpy pour l'algebre, et
cours/reseau.py pour la sigmoide, qui est deja ecrite et deja protegee du
debordement de exp.

Determinisme : ce fichier ne tire AUCUN nombre au hasard. Il n'y a donc pas de
graine a fixer. La regression logistique part de w = 0, b = 0 et descend le
gradient exact du lot complet ; deux executions donnent le meme chiffre a la
derniere decimale.
"""

from __future__ import annotations

import struct
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402

RACINE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RACINE))

import reseau as R  # noqa: E402

FIGURES = RACINE / "figures"


def _console_utf8() -> None:
    """Windows ouvre la console en cp1252, et les accents la font tomber."""
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass


def titre(numero: str, texte: str) -> None:
    print("\n" + "=" * 78)
    print(f"  {numero}. {texte}")
    print("=" * 78)


# ── Le style de la maison, repris de cours/lecon3/figures.py ────────────────

ENCRE, BRIQUE, GRIS, FILET = "#14120F", "#A8442A", "#7E7972", "#E4E1DC"
plt.rcParams.update({
    "figure.dpi": 130,
    "font.size": 9,
    "axes.edgecolor": ENCRE,
    "axes.labelcolor": ENCRE,
    "axes.titlesize": 9.5,
    "text.color": ENCRE,
    "xtick.color": GRIS,
    "ytick.color": GRIS,
    "axes.grid": True,
    "grid.color": FILET,
    "grid.linewidth": 0.6,
    "legend.frameon": True,
    "legend.framealpha": 0.92,
    "legend.edgecolor": FILET,
    "legend.fontsize": 7.6,
})


def sauver(fig, nom: str) -> None:
    FIGURES.mkdir(parents=True, exist_ok=True)
    fig.savefig(FIGURES / nom, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"  ecrit  cours/figures/{nom}")


def dimensions_png(chemin: Path) -> tuple[int, int]:
    """
    Largeur et hauteur en pixels, lues dans le bloc IHDR du PNG.

    Aucune dependance : les octets 16 a 24 d'un PNG portent deux entiers de 32
    bits gros-boutistes, juste apres la signature et l'entete du bloc.
    """
    with open(chemin, "rb") as flux:
        entete = flux.read(24)
    if entete[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{chemin.name} n'est pas un PNG")
    largeur, hauteur = struct.unpack(">II", entete[16:24])
    return largeur, hauteur


# ─────────────────────────────────────────────────────────────────────────────
# Les jeux de donnees, figes par la specification
# ─────────────────────────────────────────────────────────────────────────────

# Demonstration A : trois points sur une droite, w = 1 fige, b libre.
X_A = np.array([0.0, 1.0, 2.0])
Y_A = np.array([0.0, 1.0, 1.0])

# Demonstration B : six points proches, puis quatre points lointains ajoutes.
X_PROCHES = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
Y_PROCHES = np.array([0.0, 0.0, 0.0, 1.0, 1.0, 1.0])
X_LOINTAINS = np.array([20.0, 21.0, 22.0, 23.0])
Y_LOINTAINS = np.array([1.0, 1.0, 1.0, 1.0])
X_DIX = np.concatenate([X_PROCHES, X_LOINTAINS])
Y_DIX = np.concatenate([Y_PROCHES, Y_LOINTAINS])


# ─────────────────────────────────────────────────────────────────────────────
# A. La perte 0-1 n'a pas de gradient
# ─────────────────────────────────────────────────────────────────────────────

def perte_01(x, y, w, b) -> float:
    """L_01 = (1/N) somme 1[c_chapeau != y], avec c_chapeau = 1 si w x + b > 0."""
    c_chapeau = (w * x + b > 0.0).astype(float)
    return float(np.mean(c_chapeau != y))


def demonstration_A() -> dict:
    titre("A", "La perte 0-1 est constante par morceaux : sa derivee est nulle")
    print("  Trois points, d = 1, w = 1 fige, b seul parametre libre.")
    print("  Regle de decision : c_chapeau = 1 si x + b > 0, sinon 0.\n")
    print(f"    {'x':>5}{'y':>5}")
    for x, y in zip(X_A, Y_A):
        print(f"    {x:>5.0f}{y:>5.0f}")

    # Les quatre intervalles, enumeres a la main comme dans la lecon, chacun
    # verifie sur un b temoin pris a l'interieur.
    intervalles = [
        ("b > 0", "1/3", 1.0 / 3.0, 0.5),
        ("-1 < b <= 0", "0", 0.0, -0.5),
        ("-2 < b <= -1", "1/3", 1.0 / 3.0, -1.5),
        ("b <= -2", "2/3", 2.0 / 3.0, -2.5),
    ]
    print("\n  Les quatre intervalles de b, avec un temoin dans chacun :")
    print(f"    {'intervalle de b':<16}{'L_01 attendue':>15}{'b temoin':>11}"
          f"{'L_01 mesuree':>15}")
    for nom, attendu, valeur, temoin in intervalles:
        mesure = perte_01(X_A, Y_A, 1.0, temoin)
        marque = "" if abs(mesure - valeur) < 1e-12 else "   ECART"
        print(f"    {nom:<16}{attendu:>15}{temoin:>11.1f}{mesure:>15.4f}{marque}")

    # Balayage fin : on ne suppose plus les intervalles, on les CONSTATE.
    # b est construit en arithmetique entiere pour que -1.000 et -2.000 tombent
    # exactement sur la grille : ce sont les bornes qui portent la preuve.
    ks = np.arange(-3000, 1001)
    bs = ks / 1000.0
    pertes = np.array([perte_01(X_A, Y_A, 1.0, b) for b in bs])

    paliers = []
    debut = 0
    for i in range(1, bs.size + 1):
        if i == bs.size or pertes[i] != pertes[debut]:
            paliers.append((bs[debut], bs[i - 1], pertes[debut], i - debut))
            debut = i

    print(f"\n  Balayage de b de {bs[0]:.3f} a {bs[-1]:.3f} par pas de 0.001 "
          f"({bs.size} valeurs).")
    print("  Paliers REELLEMENT observes, aucun suppose :\n")
    print(f"    {'palier observe':<22}{'L_01':>9}{'erreurs':>11}{'largeur':>10}"
          f"{'points':>9}")
    for gauche, droite, valeur, compte in paliers:
        crochet = f"[{gauche:>7.3f}, {droite:>7.3f}]"
        print(f"    {crochet:<22}{valeur:>9.4f}{round(valeur * 3):>7} / 3"
              f"{droite - gauche:>10.3f}{compte:>9}")

    d = np.diff(pertes)
    non_nuls = int(np.count_nonzero(d))
    print(f"\n  Derivee numerique (L_01(b + 0.001) - L_01(b)) / 0.001 sur "
          f"{d.size} intervalles :")
    print(f"    nulle sur                {d.size - non_nuls} intervalles "
          f"({(d.size - non_nuls) / d.size:.4%})")
    print(f"    non nulle sur            {non_nuls} intervalles, "
          "les sauts entre paliers :")
    for i in np.nonzero(d)[0]:
        print(f"      saut en b = {bs[i + 1]:>7.3f}   "
              f"{pertes[i]:.4f} -> {pertes[i + 1]:.4f}   "
              f"pente locale {d[i] / 0.001:+.0f}")
    print("\n  Conclusion mesuree : la derivee vaut 0 partout ou elle existe, et")
    print("  elle n'existe pas aux sauts. Une descente de gradient sur L_01 ne")
    print("  recevrait donc jamais la moindre direction.")
    return {"paliers": paliers, "non_nuls": non_nuls, "n_intervalles": d.size}


# ─────────────────────────────────────────────────────────────────────────────
# B. La MSE punit les points bien classes
# ─────────────────────────────────────────────────────────────────────────────

def moindres_carres(x, y) -> tuple[float, float]:
    """
    Ajuste y_hat = w x + b par moindres carres EXACTS.

    On annule les deux derivees de L = (1/N) somme (w x_n + b - y_n)^2. Cela
    donne le systeme normal, deux equations a deux inconnues :

        (somme x^2) w + (somme x) b = somme x y
        (somme x)   w +        N  b = somme y

    Le determinant det = N (somme x^2) - (somme x)^2 est non nul des que deux x
    different. La solution s'ecrit donc par Cramer, sans aucune inversion
    numerique et sans sklearn, qui est absent de cette machine :

        w = (N somme xy - somme x somme y) / det
        b = (somme x^2 somme y - somme x somme xy) / det
    """
    N = float(x.size)
    s_x = float(np.sum(x))
    s_xx = float(np.sum(x * x))
    s_y = float(np.sum(y))
    s_xy = float(np.sum(x * y))
    det = N * s_xx - s_x * s_x
    w = (N * s_xy - s_x * s_y) / det
    b = (s_xx * s_y - s_x * s_xy) / det
    return w, b


def frontiere(w: float, b: float) -> float:
    """x* tel que y_hat(x*) = 0.5, c'est-a-dire w x* + b = 0.5."""
    return (0.5 - b) / w


def erreurs_seuil(x, y, w, b) -> np.ndarray:
    """Indices des points ou le seuil y_hat >= 0.5 ne donne pas la bonne classe."""
    c_chapeau = (w * x + b >= 0.5).astype(float)
    return np.nonzero(c_chapeau != y)[0]


def rapport_ajustement(nom, x, y, w, b, attendu) -> None:
    N = float(x.size)
    s_x, s_xx = float(np.sum(x)), float(np.sum(x * x))
    s_y, s_xy = float(np.sum(y)), float(np.sum(x * y))
    signe = "+" if b >= 0 else "-"
    print(f"\n  {nom}")
    print(f"    N = {N:.0f}   somme x = {s_x:.0f}   somme x^2 = {s_xx:.0f}   "
          f"somme y = {s_y:.0f}   somme xy = {s_xy:.0f}")
    print(f"    det = N somme x^2 - (somme x)^2 = "
          f"{N:.0f} * {s_xx:.0f} - {s_x:.0f}^2 = {N * s_xx - s_x * s_x:.0f}")
    print(f"    y_hat = {w:.4f} x {signe} {abs(b):.4f}      (fige : {attendu})")
    x_etoile = frontiere(w, b)
    mauvais = erreurs_seuil(x, y, w, b)
    print(f"    x* tel que y_hat(x*) = 0.5   ->   x* = {x_etoile:.3f}")
    print(f"    erreurs au seuil 0.5         ->   {mauvais.size}")
    print(f"\n    {'x':>6}{'y':>5}{'y_hat':>10}{'classe predite':>16}{'verdict':>10}")
    for i in range(x.size):
        y_hat = w * x[i] + b
        c = 1 if y_hat >= 0.5 else 0
        verdict = "ok" if c == y[i] else "FAUX"
        print(f"    {x[i]:>6.0f}{y[i]:>5.0f}{y_hat:>10.4f}{c:>16}{verdict:>10}")


def demonstration_B() -> dict:
    titre("B", "La MSE punit les points deja bien classes")

    w6, b6 = moindres_carres(X_PROCHES, Y_PROCHES)
    rapport_ajustement("Six points : x = 1,2,3 en classe 0 ; x = 4,5,6 en classe 1.",
                       X_PROCHES, Y_PROCHES, w6, b6, "0.2571 x - 0.4")

    w10, b10 = moindres_carres(X_DIX, Y_DIX)
    rapport_ajustement("On AJOUTE quatre points de classe 1 en x = 20,21,22,23. "
                       "Reajustement.",
                       X_DIX, Y_DIX, w10, b10, "0.0326 x + 0.3510")

    y_hat_4 = w10 * 4.0 + b10
    print("\n  Le point qui casse : x = 4, de classe 1.")
    print(f"    y_hat(4) = {w10:.4f} * 4 + {b10:.4f} = {y_hat_4:.3f} < 0.5")
    print("    -> il est classe en 0. La droite l'a lache pour aller chercher")
    print("       les quatre lointains.")

    ancien_20 = w6 * 20.0 + b6
    cout = (ancien_20 - 1.0) ** 2
    print("\n  Pourquoi elle bascule : avec l'ANCIENNE droite, un point en x = 20")
    print("  de classe 1 est deja tres largement du bon cote, et pourtant il")
    print("  coute cher.")
    print(f"    y_hat(20) = {w6:.4f} * 20 - {abs(b6):.4f} = {ancien_20:.2f}")
    print(f"    loss = (y_hat - y)^2 = ({ancien_20:.2f} - 1)^2 = {cout:.1f}")
    print(f"    Un seul point tres bien classe pese {cout:.1f}, la ou un point")
    print("    juste a la frontiere pese 0.25. La MSE ne sait pas dire")
    print("    'assez bien classe' : elle veut y_hat = 1 exactement.")

    return {"w6": w6, "b6": b6, "x6": frontiere(w6, b6),
            "e6": erreurs_seuil(X_PROCHES, Y_PROCHES, w6, b6).size,
            "w10": w10, "b10": b10, "x10": frontiere(w10, b10),
            "e10": erreurs_seuil(X_DIX, Y_DIX, w10, b10).size,
            "y_hat_4": y_hat_4, "ancien_20": ancien_20, "cout": cout}


# ─────────────────────────────────────────────────────────────────────────────
# C. La table des gradients, pour y = 1
# ─────────────────────────────────────────────────────────────────────────────

def demonstration_C() -> dict:
    titre("C", "La taille du gradient : entropie croisee contre MSE composee")
    print("  Un seul neurone de sortie, a = sigma(z), verite y = 1.")
    print("    entropie croisee  loss = -ln(a)      -> dl/dz = a - 1,")
    print("                                            soit |dl/dz| = 1 - a")
    print("    MSE composee      loss = (a - 1)^2   -> dl/dz = 2(a - 1) a(1 - a),")
    print("                                            soit |dl/dz| = 2 a (1 - a)^2\n")

    zs = np.array([-4.0, -2.0, 0.0, 2.0])
    a = R.sigmoide(zs)
    g_ec = 1.0 - a
    g_mse = 2.0 * a * (1.0 - a) ** 2
    rapport = g_ec / g_mse

    print(f"    {'z':>4}{'a = sigma(z)':>16}{'|dl/dz| EC':>14}"
          f"{'|dl/dz| MSE':>14}{'rapport':>10}")
    for i in range(zs.size):
        etiquette = f"{zs[i]:+.0f}" if zs[i] != 0.0 else "0"
        print(f"    {etiquette:>4}{a[i]:>16.4f}{g_ec[i]:>14.4f}"
              f"{g_mse[i]:>14.4f}{rapport[i]:>10.1f}")

    print("\n  Lecture : en z = -4 le neurone se trompe presque completement")
    print(f"  (a = {a[0]:.4f} alors que y = 1), et c'est exactement la que la MSE")
    print(f"  composee cesse de reagir : son gradient vaut {g_mse[0]:.4f}, soit")
    print(f"  {rapport[0]:.1f} fois moins que celui de l'entropie croisee. Le facteur")
    print("  a(1 - a) de la sigmoide eteint le signal la ou il faudrait crier.")
    return {"z": zs, "a": a, "g_ec": g_ec, "g_mse": g_mse, "rapport": rapport}


# ─────────────────────────────────────────────────────────────────────────────
# D. La regression logistique repare
# ─────────────────────────────────────────────────────────────────────────────

def logistique(x, y, eta: float, iterations: int) -> tuple[float, float]:
    """
    Descente de gradient sur l'entropie croisee binaire, gradient ecrit a la
    main. Pour a = sigma(w x + b) et loss = -[y ln a + (1 - y) ln(1 - a)] :

        grad_w = (1/N) somme (a_n - y_n) x_n
        grad_b = (1/N) somme (a_n - y_n)

    Le facteur a(1 - a) de la sigmoide s'annule contre le 1/(a(1 - a)) venu de
    la derivee du logarithme. Il ne reste que l'erreur (a - y), et c'est tout
    l'interet de l'entropie croisee.

    Depart w = 0, b = 0 : rien d'aleatoire, donc rien a ensemencer.
    """
    w, b = 0.0, 0.0
    for _ in range(iterations):
        a = R.sigmoide(w * x + b)
        grad_w = float(np.mean((a - y) * x))
        grad_b = float(np.mean(a - y))
        w -= eta * grad_w
        b -= eta * grad_b
    return w, b


ETA_D = 0.05
ITERATIONS_D = 40_000


def demonstration_D() -> dict:
    titre("D", "La regression logistique repare : memes dix points, zero erreur")
    print("  Les DIX points de la demonstration B, les six proches et les quatre")
    print("  lointains. Modele : a = sigma(w x + b). Perte : entropie croisee.")
    print("  Depart w = 0, b = 0. Gradient (a - y) x, moyenne sur les N = 10.\n")

    print("  ATTENTION, et c'est la lecon du tableau ci-dessous : les dix points")
    print("  sont SEPARABLES par une droite. La perte decroit alors vers 0 sans")
    print("  jamais l'atteindre, et ||w|| croit sans borne, en gros comme le")
    print("  logarithme du nombre d'iterations. w et b n'ont pas de limite finie :")
    print("  ils DEPENDENT du reglage. Seul leur rapport, la frontiere -b/w, se")
    print("  stabilise.\n")
    reglages = [(0.05, 5_000), (0.05, 10_000), (0.05, 20_000),
                (ETA_D, ITERATIONS_D), (0.05, 80_000), (0.05, 160_000)]
    print(f"    {'eta':>7}{'iterations':>13}{'w':>10}{'b':>11}{'x* = -b/w':>12}"
          f"{'erreurs':>10}")
    for eta, T in reglages:
        w, b = logistique(X_DIX, Y_DIX, eta, T)
        a = R.sigmoide(w * X_DIX + b)
        err = int(np.sum((a >= 0.5).astype(float) != Y_DIX))
        retenu = "   <- retenu" if (eta, T) == (ETA_D, ITERATIONS_D) else ""
        print(f"    {eta:>7.2f}{T:>13}{w:>10.3f}{b:>11.3f}{-b / w:>12.3f}"
              f"{err:>10}{retenu}")

    w, b = logistique(X_DIX, Y_DIX, ETA_D, ITERATIONS_D)
    a = R.sigmoide(w * X_DIX + b)
    x_etoile = -b / w
    mauvais = int(np.sum((a >= 0.5).astype(float) != Y_DIX))

    print(f"\n  Reglage retenu : eta = {ETA_D}, {ITERATIONS_D} iterations.")
    print("  C'est celui qui reproduit au mieux les valeurs figees de la spec.")
    print(f"    w  = {w:.3f}         (fige : 4.431)")
    print(f"    b  = {b:.3f}       (fige : -15.358)")
    print(f"    x* = {x_etoile:.3f}         (fige : 3.466)")
    print(f"    erreurs = {mauvais}           (fige : 0)")

    print(f"\n    {'x':>6}{'y':>5}{'z = w x + b':>14}{'a = sigma(z)':>15}"
          f"{'classe':>9}{'verdict':>10}")
    for i in range(X_DIX.size):
        z = w * X_DIX[i] + b
        c = 1 if a[i] >= 0.5 else 0
        verdict = "ok" if c == Y_DIX[i] else "FAUX"
        print(f"    {X_DIX[i]:>6.0f}{Y_DIX[i]:>5.0f}{z:>14.3f}{a[i]:>15.3f}"
              f"{c:>9}{verdict:>10}")

    return {"w": w, "b": b, "x": x_etoile, "erreurs": mauvais, "a": a}


# ─────────────────────────────────────────────────────────────────────────────
# Figure 1 : la MSE et les quatre points lointains
# ─────────────────────────────────────────────────────────────────────────────

def nuage(ax, x, y, taille=42) -> None:
    """Classe 0 en cercles gris, classe 1 en carres brique : forme ET couleur."""
    zero, un = y == 0.0, y == 1.0
    ax.scatter(x[zero], y[zero], s=taille, marker="o", facecolor="white",
               edgecolor=GRIS, linewidth=1.4, zorder=5, label="classe 0")
    ax.scatter(x[un], y[un], s=taille, marker="s", facecolor=BRIQUE,
               edgecolor=BRIQUE, linewidth=1.4, zorder=5, label="classe 1")


def fig1(B: dict) -> None:
    w6, b6, w10, b10 = B["w6"], B["b6"], B["w10"], B["b10"]
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(13.5, 3.7),
                                        layout="constrained")

    # (a) les six points seuls : la droite tombe pile au milieu
    g = np.linspace(0, 7, 200)
    nuage(ax1, X_PROCHES, Y_PROCHES)
    ax1.plot(g, w6 * g + b6, color=ENCRE, lw=1.8,
             label=f"y_hat = {w6:.4f} x - {abs(b6):.4f}")
    ax1.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax1.axvline(B["x6"], color=ENCRE, lw=1.1, ls=(0, (1, 2)))
    ax1.set_xlim(0, 7)
    ax1.text(0.15, 0.545, "seuil 0,5", color=GRIS, fontsize=7.6)
    ax1.annotate(f"x* = {B['x6']:.2f}", xy=(B["x6"], 0.5), xytext=(4.8, 0.17),
                 fontsize=8.4, color=ENCRE,
                 arrowprops=dict(arrowstyle="->", color=ENCRE, lw=1.1))
    ax1.set_ylim(-0.35, 1.35)
    ax1.set_xlabel("x")
    ax1.set_ylabel("y  et  y_hat")
    ax1.set_title(f"(a) six points : x* = {B['x6']:.2f}, {B['e6']} erreur",
                  loc="left")
    ax1.legend(loc="upper left")

    # (b) les dix points : la droite s'ecrase pour aller chercher les lointains
    g = np.linspace(0, 24, 300)
    nuage(ax2, X_DIX, Y_DIX)
    ax2.plot(g, w10 * g + b10, color=BRIQUE, lw=1.8,
             label=f"y_hat = {w10:.4f} x + {b10:.4f}")
    ax2.plot(g, w6 * g + b6, color=GRIS, lw=1.2, ls=(0, (4, 3)),
             label="l'ancienne droite, pour comparer")
    ax2.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax2.axvline(B["x10"], color=ENCRE, lw=1.1, ls=(0, (1, 2)))
    ax2.set_xlim(0, 24)
    ax2.annotate(f"x* passe de {B['x6']:.2f} à {B['x10']:.2f}",
                 xy=(B["x10"], 0.5), xytext=(6.2, -0.62),
                 fontsize=8.4, color=BRIQUE,
                 arrowprops=dict(arrowstyle="->", color=BRIQUE, lw=1.2))
    ax2.annotate("l'ancienne droite montait à\n"
                 f"y_hat(20) = {B['ancien_20']:.2f} : ce point déjà\n"
                 f"bien classé coûtait {B['cout']:.1f}",
                 xy=(19.8, B["ancien_20"] - 0.22), xytext=(13.3, 2.95),
                 ha="left", va="top", fontsize=8, color=GRIS,
                 arrowprops=dict(arrowstyle="->", color=GRIS, lw=1.0))
    ax2.set_ylim(-1.1, 5.4)
    ax2.set_xlabel("x")
    ax2.set_ylabel("y  et  y_hat")
    ax2.set_title(f"(b) dix points : la droite s'écrase, x* = {B['x10']:.2f}",
                  loc="left")
    ax2.legend(loc="upper left")

    # (c) le zoom : le point x = 4 est passe du mauvais cote
    g = np.linspace(2.5, 6.5, 200)
    proche = (X_DIX >= 2.5) & (X_DIX <= 6.5)
    nuage(ax3, X_DIX[proche], Y_DIX[proche])
    ax3.plot(g, w10 * g + b10, color=BRIQUE, lw=1.8, label="nouvelle droite")
    ax3.plot(g, w6 * g + b6, color=GRIS, lw=1.2, ls=(0, (4, 3)),
             label="ancienne droite")
    ax3.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax3.axvline(B["x10"], color=ENCRE, lw=1.1, ls=(0, (1, 2)))
    ax3.scatter([4.0], [B["y_hat_4"]], s=58, marker="X", color=BRIQUE, zorder=6)
    ax3.annotate(f"x=4 : y_hat={B['y_hat_4']:.2f} < 0.5\n"
                 "-> classe 4 en 0 : FAUX",
                 xy=(4.0, B["y_hat_4"]), xytext=(4.30, 0.31),
                 ha="left", va="top", fontsize=8.6, color=BRIQUE,
                 arrowprops=dict(arrowstyle="->", color=BRIQUE, lw=1.4))
    ax3.set_xlim(2.5, 6.5)
    ax3.set_ylim(-0.12, 1.22)
    ax3.set_xlabel("x")
    ax3.set_ylabel("y  et  y_hat")
    ax3.set_title(f"(c) zoom : {B['e10']} erreur, et c'est un point de classe 1",
                  loc="left")
    ax3.legend(loc="upper left")

    fig.suptitle("Quatre points loin de la frontière, déjà bien classés, "
                 "suffisent à faire perdre un point à la MSE", fontsize=10.5)
    sauver(fig, "l2-fig1-mse.png")


# ─────────────────────────────────────────────────────────────────────────────
# Figure 2 : les trois pertes et la taille de leur gradient
# ─────────────────────────────────────────────────────────────────────────────

def fig2(C: dict) -> None:
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(13.5, 3.7),
                                        layout="constrained")
    z = np.linspace(-6, 6, 601)
    a = R.sigmoide(z)
    i_4 = int(np.argmin(np.abs(z + 4.0)))

    # (a) la sigmoide
    ax1.plot(z, a, color=ENCRE, lw=1.9)
    ax1.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax1.axvline(0.0, color=GRIS, lw=0.9, ls=(0, (1, 2)))
    ax1.axvspan(-6, -4, color=FILET, zorder=0)
    ax1.axvspan(4, 6, color=FILET, zorder=0)
    ax1.annotate("sigma(0) = 0,5 : le seuil de décision",
                 xy=(0, 0.5), xytext=(-5.8, 1.06),
                 ha="left", va="top", fontsize=8, color=ENCRE,
                 arrowprops=dict(arrowstyle="->", color=ENCRE, lw=1.0))
    ax1.annotate(f"|z| > 4 : la sigmoïde plafonne\n(sigma(-4) = {a[i_4]:.4f})",
                 xy=(-4.4, 0.016), xytext=(0.5, 0.33),
                 ha="left", va="top", fontsize=8, color=GRIS,
                 arrowprops=dict(arrowstyle="->", color=GRIS, lw=1.0))
    ax1.set_ylim(-0.06, 1.12)
    ax1.set_xlabel("z = w x + b")
    ax1.set_ylabel("a = sigma(z)")
    ax1.set_title("(a) la sigmoïde écrase toute la droite réelle dans ]0, 1[",
                  loc="left")

    # (b) les trois pertes, pour y = 1
    # -ln(sigma(z)) est ecrit sous forme stable : ln(1 + exp(-|z|)) + max(-z, 0).
    l_01 = (z < 0).astype(float)
    l_mse = (a - 1.0) ** 2
    l_ec = np.log1p(np.exp(-np.abs(z))) + np.maximum(-z, 0.0)
    ax2.plot(z, l_01, color=GRIS, lw=1.7, ls=(0, (1, 2)),
             label="perte 0-1 : 1 si z < 0, 0 sinon")
    ax2.plot(z, l_mse, color=BRIQUE, lw=1.8, ls=(0, (4, 3)),
             label="MSE composée (a - 1)^2")
    ax2.plot(z, l_ec, color=ENCRE, lw=1.9, label="entropie croisée -ln(a)")
    ax2.annotate("l'entropie croisée n'a pas de plancher :\n"
                 f"loss(-6) = {l_ec[0]:.2f}, et elle croît linéairement",
                 xy=(-5.2, l_ec[int(np.argmin(np.abs(z + 5.2)))]),
                 xytext=(0.35, 4.50), ha="left", va="top",
                 fontsize=8, color=ENCRE,
                 arrowprops=dict(arrowstyle="->", color=ENCRE, lw=1.1))
    ax2.annotate("la MSE plafonne à 1 et s'aplatit :\n"
                 f"loss(-6) = {l_mse[0]:.3f}, loss(-4) = {l_mse[i_4]:.3f},\n"
                 f"soit {l_mse[0] - l_mse[i_4]:.3f} d'écart sur deux unités de z",
                 xy=(-5.2, l_mse[int(np.argmin(np.abs(z + 5.2)))]),
                 xytext=(0.35, 3.25), ha="left", va="top",
                 fontsize=8, color=BRIQUE,
                 arrowprops=dict(arrowstyle="->", color=BRIQUE, lw=1.1))
    ax2.set_xlim(-6, 6)
    ax2.set_ylim(-0.25, 6.6)
    ax2.set_xlabel("z, pour un exemple de vérité y = 1")
    ax2.set_ylabel("loss")
    ax2.set_title("(b) une perte plate, une perte plafonnée, une perte convexe",
                  loc="left")
    ax2.legend(loc="upper right")

    # (c) la taille du gradient
    g_ec = 1.0 - a
    g_mse = 2.0 * a * (1.0 - a) ** 2
    ax3.plot(z, g_ec, color=ENCRE, lw=1.9,
             label="|dl/dz| entropie croisée = 1 - a")
    ax3.plot(z, g_mse, color=BRIQUE, lw=1.8, ls=(0, (4, 3)),
             label="|dl/dz| MSE composée = 2 a (1 - a)^2")
    ax3.plot(z, np.full_like(z, 1.05e-3), color=GRIS, lw=1.7, ls=(0, (1, 2)),
             label="|dl/dz| perte 0-1 = 0, hors du cadre log")
    ax3.scatter(C["z"], C["g_ec"], s=36, marker="o", facecolor="white",
                edgecolor=ENCRE, linewidth=1.3, zorder=6)
    ax3.scatter(C["z"], C["g_mse"], s=36, marker="s", facecolor=BRIQUE,
                edgecolor=BRIQUE, linewidth=1.3, zorder=6)
    ax3.annotate(f"en z = -4 : {C['g_ec'][0]:.4f} contre {C['g_mse'][0]:.4f},\n"
                 f"soit {C['rapport'][0]:.1f} fois moins de gradient\n"
                 "là où le modèle se trompe le plus",
                 xy=(-4.05, C["g_mse"][0] * 0.72), xytext=(-5.9, 3.8e-3),
                 ha="left", va="top", fontsize=8, color=BRIQUE,
                 arrowprops=dict(arrowstyle="->", color=BRIQUE, lw=1.2))
    ax3.set_yscale("log")
    ax3.set_xlim(-6, 6)
    ax3.set_ylim(1e-3, 6.0)
    ax3.set_xlabel("z, pour un exemple de vérité y = 1")
    ax3.set_ylabel("taille du gradient   (échelle log)")
    ax3.set_title("(c) rapport des deux gradients en z = -4 : "
                  f"{C['rapport'][0]:.1f}", loc="left")
    ax3.legend(loc="upper right")

    fig.suptitle("Pour y = 1 : la perte 0-1 ne dit rien, la MSE composée se tait "
                 "quand on se trompe, l'entropie croisée crie", fontsize=10.5)
    sauver(fig, "l2-fig2-pertes.png")


# ─────────────────────────────────────────────────────────────────────────────
# Figure 3 : la regression logistique sur les dix points
# ─────────────────────────────────────────────────────────────────────────────

def fig3(B: dict, Dd: dict) -> None:
    w, b, x_etoile = Dd["w"], Dd["b"], Dd["x"]
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.5, 3.8), layout="constrained")

    # (a) vue complete : la sigmoide ne traverse le seuil qu'une fois
    g = np.linspace(0, 24, 1200)
    nuage(ax1, X_DIX, Y_DIX)
    ax1.plot(g, R.sigmoide(w * g + b), color=ENCRE, lw=1.9,
             label=f"a = sigma({w:.3f} x - {abs(b):.3f})")
    ax1.plot(g, B["w10"] * g + B["b10"], color=GRIS, lw=1.2, ls=(0, (4, 3)),
             label="la droite des moindres carrés")
    ax1.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax1.axvline(x_etoile, color=BRIQUE, lw=1.2, ls=(0, (1, 2)))
    ax1.annotate(f"x* = {x_etoile:.3f}", xy=(x_etoile, 0.5), xytext=(6.0, 0.24),
                 fontsize=8.6, color=BRIQUE,
                 arrowprops=dict(arrowstyle="->", color=BRIQUE, lw=1.3))
    ax1.annotate("les quatre lointains sont à a = 1,000 :\n"
                 "ils ne coûtent presque plus rien, donc ils ne tirent plus rien",
                 xy=(21.5, 0.94), xytext=(3.4, 1.47),
                 ha="left", va="top", fontsize=8, color=ENCRE,
                 arrowprops=dict(arrowstyle="->", color=ENCRE, lw=1.0))
    ax1.set_xlim(0, 24)
    ax1.set_ylim(-0.12, 1.50)
    ax1.set_xlabel("x")
    ax1.set_ylabel("y  et  a = sigma(w x + b)")
    ax1.set_title(f"(a) dix points, {Dd['erreurs']} erreur, x* = {x_etoile:.3f}",
                  loc="left")
    ax1.legend(loc="center right")

    # (b) le zoom, exactement la ou la MSE se trompait
    g = np.linspace(2.5, 6.5, 400)
    proche = (X_DIX >= 2.5) & (X_DIX <= 6.5)
    nuage(ax2, X_DIX[proche], Y_DIX[proche])
    ax2.plot(g, R.sigmoide(w * g + b), color=ENCRE, lw=1.9,
             label="régression logistique")
    ax2.plot(g, B["w10"] * g + B["b10"], color=GRIS, lw=1.2, ls=(0, (4, 3)),
             label="moindres carrés sur les dix points")
    ax2.axhline(0.5, color=GRIS, lw=0.9, ls=(0, (4, 3)))
    ax2.axvline(x_etoile, color=BRIQUE, lw=1.2, ls=(0, (1, 2)))
    a4 = float(R.sigmoide(np.array([w * 4.0 + b]))[0])
    ax2.scatter([4.0], [a4], s=58, marker="X", color=ENCRE, zorder=6)
    ax2.scatter([4.0], [B["y_hat_4"]], s=58, marker="X", color=GRIS, zorder=6)
    ax2.annotate(f"x=4 : a = {a4:.3f} > 0.5, classe 1 : ok\n"
                 f"la MSE donnait {B['y_hat_4']:.3f} : FAUX",
                 xy=(4.02, a4 - 0.03), xytext=(3.92, 0.30),
                 ha="left", va="top", fontsize=8.4, color=ENCRE,
                 arrowprops=dict(arrowstyle="->", color=ENCRE, lw=1.3))
    ax2.set_xlim(2.5, 6.5)
    ax2.set_ylim(-0.12, 1.26)
    ax2.set_xlabel("x")
    ax2.set_ylabel("y  et  a")
    ax2.set_title(f"(b) zoom : la frontière recule de {B['x10']:.2f} à "
                  f"{x_etoile:.2f}", loc="left")
    ax2.legend(loc="center right")

    fig.suptitle("Mêmes dix points, même frontière linéaire : la logistique les "
                 f"classe tous ({Dd['erreurs']} erreur), la MSE en ratait un",
                 fontsize=10.5)
    sauver(fig, "l2-fig3-logistique.png")


# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    _console_utf8()
    print("  Lecon 2, partie 3 : classification, pertes et gradients.")
    print("  Rien n'est tire au hasard dans ce fichier : tout est deterministe,")
    print("  il n'y a donc aucune graine a fixer.")

    A = demonstration_A()
    B = demonstration_B()
    C = demonstration_C()
    Dd = demonstration_D()

    titre("E", "Les trois figures")
    fig1(B)
    fig2(C)
    fig3(B, Dd)

    print("\n  Verification des fichiers ecrits :")
    print(f"    {'fichier':<26}{'existe':>8}{'octets':>10}{'pixels':>16}")
    for nom in ("l2-fig1-mse.png", "l2-fig2-pertes.png", "l2-fig3-logistique.png"):
        chemin = FIGURES / nom
        if chemin.exists():
            largeur, hauteur = dimensions_png(chemin)
            print(f"    {nom:<26}{'oui':>8}{chemin.stat().st_size:>10}"
                  f"{f'{largeur} x {hauteur}':>16}")
        else:
            print(f"    {nom:<26}{'NON':>8}")

    titre("F", "Recapitulatif, confronte aux valeurs figees de la specification")
    lignes = [
        ("A", "paliers de L_01 observes", f"{len(A['paliers'])}", "4"),
        ("A", "intervalles a derivee nulle",
         f"{A['n_intervalles'] - A['non_nuls']}", f"{A['n_intervalles'] - 3}"),
        ("B", "six points : w", f"{B['w6']:.4f}", "0.2571"),
        ("B", "six points : b", f"{B['b6']:.4f}", "-0.4000"),
        ("B", "six points : x*", f"{B['x6']:.3f}", "3.500"),
        ("B", "six points : erreurs", f"{B['e6']}", "0"),
        ("B", "dix points : w", f"{B['w10']:.4f}", "0.0326"),
        ("B", "dix points : b", f"{B['b10']:.4f}", "0.3510"),
        ("B", "dix points : x*", f"{B['x10']:.3f}", "4.569"),
        ("B", "dix points : erreurs", f"{B['e10']}", "1"),
        ("B", "y_hat(4), nouvelle droite", f"{B['y_hat_4']:.3f}", "0.481"),
        ("B", "y_hat(20), ancienne droite", f"{B['ancien_20']:.2f}", "4.74"),
        ("B", "cout de ce point lointain", f"{B['cout']:.1f}", "14.0"),
        ("C", "z = -4 : a", f"{C['a'][0]:.4f}", "0.0180"),
        ("C", "z = -4 : |dl/dz| EC", f"{C['g_ec'][0]:.4f}", "0.9820"),
        ("C", "z = -4 : |dl/dz| MSE", f"{C['g_mse'][0]:.4f}", "0.0347"),
        ("C", "z = -4 : rapport", f"{C['rapport'][0]:.1f}", "28.3"),
        ("C", "z = -2 : a", f"{C['a'][1]:.4f}", "0.1192"),
        ("C", "z = -2 : |dl/dz| EC", f"{C['g_ec'][1]:.4f}", "0.8808"),
        ("C", "z = -2 : |dl/dz| MSE", f"{C['g_mse'][1]:.4f}", "0.1850"),
        ("C", "z = -2 : rapport", f"{C['rapport'][1]:.1f}", "4.8"),
        ("C", "z =  0 : a", f"{C['a'][2]:.4f}", "0.5000"),
        ("C", "z =  0 : |dl/dz| EC", f"{C['g_ec'][2]:.4f}", "0.5000"),
        ("C", "z =  0 : |dl/dz| MSE", f"{C['g_mse'][2]:.4f}", "0.2500"),
        ("C", "z =  0 : rapport", f"{C['rapport'][2]:.1f}", "2.0"),
        ("C", "z = +2 : a", f"{C['a'][3]:.4f}", "0.8808"),
        ("C", "z = +2 : |dl/dz| EC", f"{C['g_ec'][3]:.4f}", "0.1192"),
        ("C", "z = +2 : |dl/dz| MSE", f"{C['g_mse'][3]:.4f}", "0.0250"),
        ("C", "z = +2 : rapport", f"{C['rapport'][3]:.1f}", "4.8"),
        ("D", "logistique : w", f"{Dd['w']:.3f}", "4.431"),
        ("D", "logistique : b", f"{Dd['b']:.3f}", "-15.358"),
        ("D", "logistique : x*", f"{Dd['x']:.3f}", "3.466"),
        ("D", "logistique : erreurs", f"{Dd['erreurs']}", "0"),
        ("D", "logistique : a(x = 1)", f"{Dd['a'][0]:.3f}", "0.000"),
        ("D", "logistique : a(x = 2)", f"{Dd['a'][1]:.3f}", "0.002"),
        ("D", "logistique : a(x = 3)", f"{Dd['a'][2]:.3f}", "0.113"),
        ("D", "logistique : a(x = 4)", f"{Dd['a'][3]:.3f}", "0.914"),
        ("D", "logistique : a(x = 5)", f"{Dd['a'][4]:.3f}", "0.999"),
        ("D", "logistique : a(x = 6)", f"{Dd['a'][5]:.3f}", "1.000"),
    ]
    print(f"    {'':>3}{'grandeur':<30}{'mesure':>12}{'spec':>12}")
    ecarts = 0
    for demo, nom, mesure, attendu in lignes:
        accord = mesure == attendu
        if not accord:
            ecarts += 1
        marque = "" if accord else "   ECART"
        print(f"    {demo:>3} {nom:<29}{mesure:>12}{attendu:>12}{marque}")
    print(f"\n  {len(lignes) - ecarts} lignes sur {len(lignes)} reproduisent la "
          f"valeur figee. Ecarts : {ecarts}.")


if __name__ == "__main__":
    main()
