"""Lecon 2, section 2.5 : la regression lineaire, descendue a la main.

Six appartements, un prix, une droite. Le protocole est fige par la
specification et rien n'est tire au hasard :

    standardisation sur ces six lignes, w = 0, b = 0, eta = 0.1,
    1000 iterations de descente de gradient sur le LOT COMPLET.

Le gradient est celui derive en section 2.3, recopie ici a la main :

    grad_w = (2/N) somme (y_hat - y) x'      sur les x STANDARDISES
    grad_b = (2/N) somme (y_hat - y)

Aucune bibliotheque d'optimisation n'est appelee : numpy ne sert qu'a
multiplier et a additionner. La seule exception est np.linalg.lstsq, employe
tout a la fin comme temoin, pour montrer ou la descente serait arrivee si on
l'avait laissee tourner. Il ne participe pas a l'entrainement.

Noms de variables : x, y, y_hat, w, b, L, eta, grad_w, grad_b.

    python -X utf8 cours/lecon2/regression.py
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


# La charte veut une graine ecrite en clair. Ici elle ne sert a rien : il n'y a
# aucun tirage, l'initialisation est w = 0 et b = 0. Le resultat est donc
# reproductible par construction, pas par chance.
GRAINE = 0


# ── Les donnees, figees par la specification ────────────────────────────────
# Prix en milliers d'euros. Colonnes de x : surface en m2, nombre de pieces.

X_BRUT = np.array(
    [
        [30.0, 1.0],
        [45.0, 2.0],
        [50.0, 2.0],
        [60.0, 3.0],
        [75.0, 3.0],
        [90.0, 4.0],
    ]
)
y = np.array([110.0, 175.0, 200.0, 230.0, 280.0, 335.0])

ETA = 0.1
N_ITERATIONS = 1000
X_NEUF = np.array([65.0, 3.0])


# ── Ce que la specification annonce, et qu'il faut confronter a la mesure ───
# Pour chaque t : (L, (w1, w2), b), avec 3 decimales comme la spec les ecrit.

SPEC_TABLE = {
    0: (54375.000, (0.000, 0.000), 0.000),
    1: (33415.877, (14.438, 14.100), 44.333),
    10: (635.114, (37.602, 34.311), 197.865),
    100: (39.970, (49.041, 23.355), 221.667),
    1000: (24.598, (65.237, 7.159), 221.667),
}
SPEC_PREDICTIONS = [116.7, 173.8, 190.4, 230.9, 280.5, 337.6]
SPEC_NEUF = 247.5

LIGNES = sorted(SPEC_TABLE)


# ── Le modele, la perte, le gradient ────────────────────────────────────────


def standardiser(X_brut):
    """x' = (x - mu) / s, avec mu et s calcules SUR CES DONNEES.

    s est l'ecart-type de population (ddof = 0), celui que numpy donne par
    defaut. Le choix n'est pas cosmetique : avec ddof = 1 les memes six
    appartements donneraient w1 = 13.180 au lieu de 14.438 au premier pas.
    """
    mu = X_brut.mean(axis=0)
    s = X_brut.std(axis=0)
    return (X_brut - mu) / s, mu, s


def predire(X, w, b):
    """y_hat = X w + b. Convention de la maison : le lot est en LIGNES."""
    return X @ w + b


def perte(y_hat, y):
    """L = (1/N) somme (y_hat - y)^2. Pas de 1/2 : la spec n'en met pas."""
    return float(np.mean((y_hat - y) ** 2))


def gradients(X, y, w, b):
    """Le gradient de la section 2.3, ecrit terme a terme."""
    N = X.shape[0]
    ecart = predire(X, w, b) - y
    grad_w = (2.0 / N) * (X.T @ ecart)
    grad_b = (2.0 / N) * float(ecart.sum())
    return grad_w, grad_b


def descendre(X, y, eta, n_pas):
    """Renvoie la liste des etats. etats[t] est l'etat APRES t mises a jour."""
    w = np.zeros(X.shape[1])
    b = 0.0
    etats = [(w.copy(), b)]
    for _ in range(n_pas):
        grad_w, grad_b = gradients(X, y, w, b)
        w = w - eta * grad_w
        b = b - eta * grad_b
        etats.append((w.copy(), b))
    return etats


# ── L'affichage ─────────────────────────────────────────────────────────────


def titre(texte: str) -> None:
    print("\n" + "=" * 78)
    print(f"  {texte}")
    print("=" * 78)


def sous_titre(texte: str) -> None:
    print(f"\n  {texte}")
    print("  " + "-" * len(texte))


def diverge(mesure: float, attendu: float, decimales: int) -> bool:
    """Vrai si la mesure, arrondie comme la spec l'ecrit, ne retombe pas dessus."""
    return round(mesure, decimales) != round(attendu, decimales)


def main() -> None:
    _console_utf8()

    X, mu, s = standardiser(X_BRUT)
    N, d = X.shape
    etats = descendre(X, y, ETA, N_ITERATIONS + 1)  # un pas de plus, pour le piege

    ecarts = []  # (ce que la spec dit, ce que la machine dit, ou)

    titre("Lecon 2, section 2.5 : regression lineaire par descente de gradient")

    print(f"\n  N = {N}   d = {d}   p = d + 1 = {d + 1}")
    print(f"  eta = {ETA}   {N_ITERATIONS} iterations   lot COMPLET   w = 0, b = 0")
    print(f"  graine = {GRAINE} (aucun tirage : l'initialisation est deterministe)")

    sous_titre("La standardisation, calculee sur ces six appartements")
    print(f"    {'colonne':<12}{'mu':>12}{'s':>12}   (s = ecart-type de population)")
    for j, nom in enumerate(("surface", "pieces")):
        print(f"    {nom:<12}{mu[j]:>12.4f}{s[j]:>12.4f}")
    somme = X.sum(axis=0)
    print(f"\n    somme de chaque colonne standardisee : "
          f"{somme[0]:+.2e}   {somme[1]:+.2e}")
    print("    Elle est nulle a l'arrondi machine pres. C'est ce fait, et lui")
    print("    seul, qui va river b a la moyenne des y : la moyenne des y_hat")
    print("    vaut alors b, et rien d'autre.")

    # ── La table ────────────────────────────────────────────────────────────

    sous_titre("La table  (t = nombre de mises a jour DEJA effectuees)")
    print(f"    {'t':>6}{'L':>16}{'w1':>13}{'w2':>13}{'b':>13}")
    for t in LIGNES:
        w, b = etats[t]
        L = perte(predire(X, w, b), y)
        print(f"    {t:>6}{L:>16.3f}{w[0]:>13.3f}{w[1]:>13.3f}{b:>13.3f}")

    sous_titre("Confrontation ligne a ligne avec la specification")
    print(f"    {'t':>6}  {'grandeur':<10}{'spec':>14}{'mesure':>16}   verdict")
    for t in LIGNES:
        w, b = etats[t]
        L = perte(predire(X, w, b), y)
        L_spec, (w1_spec, w2_spec), b_spec = SPEC_TABLE[t]
        for nom, mesure, attendu in (
            ("L", L, L_spec),
            ("w1", float(w[0]), w1_spec),
            ("w2", float(w[1]), w2_spec),
            ("b", b, b_spec),
        ):
            mauvais = diverge(mesure, attendu, 3)
            verdict = "ECART" if mauvais else "conforme"
            if mauvais:
                ecarts.append((f"t={t}  {nom} = {attendu:.3f}",
                               f"{mesure:.6f}", f"table, ligne t={t}"))
            print(f"    {t:>6}  {nom:<10}{attendu:>14.3f}{mesure:>16.6f}   {verdict}")

    # ── Le piege des 1000 iterations ────────────────────────────────────────

    sous_titre("Le piege : t va-t-il de 0 a 999, ou de 1 a 1000 ?")
    print("    Les deux lectures de \"1000 iterations\" ne donnent pas la meme")
    print("    troisieme decimale. On affiche les trois etats voisins.")
    L_spec, (w1_spec, w2_spec), b_spec = SPEC_TABLE[1000]
    print(f"\n    {'etat':<26}{'L':>14}{'w1':>13}{'w2':>13}{'b':>13}")
    gagnants = []
    for n_pas in (999, 1000, 1001):
        w, b = etats[n_pas]
        L = perte(predire(X, w, b), y)
        colle = not (
            diverge(L, L_spec, 3)
            or diverge(w[0], w1_spec, 3)
            or diverge(w[1], w2_spec, 3)
            or diverge(b, b_spec, 3)
        )
        if colle:
            gagnants.append(n_pas)
        etiquette = f"apres {n_pas} mises a jour"
        print(f"    {etiquette:<26}{L:>14.6f}{w[0]:>13.6f}{w[1]:>13.6f}{b:>13.6f}")
    print(f"    {'ligne t=1000 de la spec':<26}{L_spec:>14.3f}"
          f"{w1_spec:>13.3f}{w2_spec:>13.3f}{b_spec:>13.3f}")
    print()
    if len(gagnants) == 1:
        print(f"    Une seule lecture la reproduit : {gagnants[0]} mises a jour.")
        print("    Donc t compte les pas DEJA faits. La boucle tourne "
              f"{N_ITERATIONS} fois et son")
        print("    etat final porte l'etiquette t = 1000. La lecture t de 0 a 999")
        print("    laisserait w1 a 65.236 : la troisieme decimale departage.")
    else:
        print(f"    Lectures compatibles : {gagnants}. La spec reste ambigue ici.")

    # ── Les predictions ─────────────────────────────────────────────────────

    w, b = etats[N_ITERATIONS]
    y_hat = predire(X, w, b)

    sous_titre("Les six appartements, apres 1000 mises a jour")
    print(f"    {'surface':>9}{'pieces':>8}{'y':>10}{'y_hat spec':>13}"
          f"{'y_hat mesure':>15}{'y_hat - y':>12}")
    for n in range(N):
        attendu = SPEC_PREDICTIONS[n]
        mesure = float(y_hat[n])
        if diverge(mesure, attendu, 1):
            ecarts.append((f"prediction {n + 1} = {attendu:.1f}",
                           f"{mesure:.4f}", "predictions finales"))
        print(f"    {X_BRUT[n, 0]:>9.0f}{X_BRUT[n, 1]:>8.0f}{y[n]:>10.1f}"
              f"{attendu:>13.1f}{mesure:>15.4f}{mesure - y[n]:>+12.4f}")
    L_finale = perte(y_hat, y)
    print(f"\n    L finale = {L_finale:.6f}   sa racine = {np.sqrt(L_finale):.4f}"
          f" k EUR, l'erreur typique")

    sous_titre("L'appartement neuf : 65 m2, 3 pieces")
    x_neuf = (X_NEUF - mu) / s
    y_hat_neuf = float(predire(x_neuf, w, b))
    print(f"    x brut          [{X_NEUF[0]:.0f}; {X_NEUF[1]:.0f}]")
    print(f"    x standardise   [{x_neuf[0]:+.6f}; {x_neuf[1]:+.6f}]"
          "   (mu et s viennent des six, pas de lui)")
    print(f"    y_hat mesure    {y_hat_neuf:.6f} k EUR")
    print(f"    spec            {SPEC_NEUF:.1f} k EUR")
    if diverge(y_hat_neuf, SPEC_NEUF, 1):
        ecarts.append((f"appartement neuf = {SPEC_NEUF:.1f}",
                       f"{y_hat_neuf:.6f}", "prediction (65, 3)"))
        print("    ECART : la mesure ne retombe pas sur la valeur figee.")
    else:
        print(f"    conforme : arrondi au dixieme, {y_hat_neuf:.4f} donne "
              f"{round(y_hat_neuf, 1):.1f}.")
        print("    L'arrondi est genereux : la mesure est plus pres de 247.46 que")
        print("    de 247.50, et la spec n'ecrit qu'une decimale.")

    # ── La coincidence du biais ─────────────────────────────────────────────

    sous_titre("b est-il EXACTEMENT la moyenne des y ?")
    moyenne_y = float(y.mean())
    print(f"    somme des y              {y.sum():.0f}")
    print(f"    moyenne des y            {moyenne_y:.12f}   (= 1330 / 6)")
    print(f"    b apres 1000 pas         {b:.12f}")
    print(f"    difference               {b - moyenne_y:+.3e}")
    print(f"    egalite bit a bit        {b == moyenne_y}")
    print(f"    ecart en ulp             "
          f"{abs(b - moyenne_y) / np.spacing(moyenne_y):.0f}")
    print()
    print("    En mathematiques, oui. Les colonnes standardisees sont de somme")
    print("    nulle, donc la moyenne des y_hat vaut b ; annuler grad_b force")
    print("    alors b = moyenne des y. La suite b_t = m (1 - 0.8^t) y va")
    print("    geometriquement, et 0.8^1000 est nul bien avant le millieme pas.")
    print("    En virgule flottante, non : il reste le residu ci-dessus.")
    print(f"    Aux trois decimales de la spec, les deux valent {moyenne_y:.3f}.")

    # ── Temoin : ou la descente allait-elle ? ───────────────────────────────

    sous_titre("Temoin : la descente a-t-elle fini de descendre ?")
    A = np.hstack([X, np.ones((N, 1))])
    solution, *_ = np.linalg.lstsq(A, y, rcond=None)
    w_opt, b_opt = solution[:2], float(solution[2])
    L_opt = perte(predire(X, w_opt, b_opt), y)
    print(f"    {'':<24}{'w1':>13}{'w2':>13}{'b':>13}{'L':>13}")
    print(f"    {'optimum exact':<24}{w_opt[0]:>13.6f}{w_opt[1]:>13.6f}"
          f"{b_opt:>13.6f}{L_opt:>13.6f}")
    print(f"    {'apres 1000 pas':<24}{w[0]:>13.6f}{w[1]:>13.6f}"
          f"{b:>13.6f}{L_finale:>13.6f}")
    print(f"\n    distance restante sur w : {np.linalg.norm(w - w_opt):.6f}")
    print("    b est arrive, w non. Surface et nombre de pieces sont presque")
    print("    proportionnels : la perte forme une vallee etroite, et la descente")
    print("    y glisse encore a la troisieme decimale au millieme pas. Voila")
    print("    pourquoi 999, 1000 et 1001 pas ne donnent pas le meme w1.")

    # ── Verdict global ──────────────────────────────────────────────────────

    titre("Verdict")
    if not ecarts:
        print("\n  Toutes les valeurs figees par la specification sont reproduites.")
        print("  Une seule nuance, signalee plus haut : b vaut la moyenne des y a")
        print("  un ulp pres, pas bit a bit. L'egalite est exacte en mathematiques,")
        print("  approchee en virgule flottante.")
    else:
        print(f"\n  {len(ecarts)} valeur(s) figee(s) NON reproduite(s) :")
        for attendu, mesure, ou in ecarts:
            print(f"    {ou:<24}spec {attendu:<26}mesure {mesure}")
        print("\n  La mesure gagne contre l'attente.")
    print()


if __name__ == "__main__":
    main()
