"""Le trait commun aux figures du parcours.

La palette, les primitives SVG, et les grilles 28 x 28 des chiffres manuscrits.
Chaque chapitre a son cours/lecon{N}/figures.py, qui porte SES figures et SES
mesures ; ce qu'ils ont tous en commun est ici, et ne se recopie pas.

POURQUOI DU SVG. Ces figures sont des traits, des ronds et du texte : le SVG
reste net a toute taille, se relit dans un editeur, et n'exige aucune
bibliotheque de trace.

LA POLICE. Une image SVG servie dans une balise <img> est un document isole :
elle ne voit pas les polices de la page. On demande donc la pile systeme, la
seule qui soit garantie chez le lecteur.

LA PALETTE est celle de animations/scenes/n7ia.py. ARDOISE, le pole negatif de
l'echelle divergente, est celui de animations/scenes/reseau/neurone.py : la
palette de l'identite ne prevoit qu'un accent, un gabarit en demande deux.

Aucun arrondi, aucune ombre, aucun degrade en dehors des deux echelles.
"""

from __future__ import annotations

import math


# ── La palette ──────────────────────────────────────────────────────────────

ENCRE = "#14120F"
PAPIER = "#FFFFFF"
BRIQUE = "#A8442A"
ARDOISE = "#2A5A78"
GRIS_08 = "#F0EEEB"
GRIS_14 = "#E4E1DC"
GRIS_24 = "#D2CEC8"
GRIS_40 = "#ADA8A0"
GRIS_58 = "#7E7972"
GRIS_72 = "#565049"

POLICE = "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

# L'espace des milliers : 101 770. C'est une espace INSECABLE ordinaire, et
# non l'espace fine U+202F que la typographie francaise demanderait : une
# image SVG servie dans une balise <img> est un document isole, elle prend la
# pile systeme, et plusieurs de ces polices rendent U+202F a largeur nulle.
# « 101770 » se lit plus mal qu'un nombre un peu trop espace.
FINE = " "
MOINS = "−"     # le vrai signe moins, plus large que le trait d'union


# ── Les nombres, ecrits a la francaise ──────────────────────────────────────


def nb(x: float, n: int = 4, signe: bool = False) -> str:
    """Un reel a n decimales, virgule decimale, signe explicite au besoin.

    Le zero negatif des flottants est ramene a zero : « -0,000000 » ferait
    croire a une valeur negative tres petite, alors que la valeur est nulle.
    """
    if x == 0:
        x = 0.0
    s = f"{x:+.{n}f}" if signe else f"{x:.{n}f}"
    return s.replace("-", MOINS).replace(".", ",")


def ent(n: int) -> str:
    """Un entier, milliers separes."""
    return f"{n:,}".replace(",", FINE)


EXPOSANTS = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")


def sci(x: float, decimales: int = 4) -> str:
    """Une valeur trop petite pour la notation ordinaire : m × 10ⁿ.

    « 1,779e-08 » n'est pas du francais, et « 0,00000001779 » ne se compte
    pas a l'oeil.
    """
    if x == 0:
        return "0"
    exposant = math.floor(math.log10(abs(x)))
    mantisse = x / 10 ** exposant
    return (f"{nb(mantisse, decimales)} × 10"
            + str(exposant).translate(EXPOSANTS))


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ── L'interligne ────────────────────────────────────────────────────────────
#
# LE CAS QUI L'A PRODUIT. `l1-fig4-deux-carres.svg` posait « 56,25 + 56,25 =
# 112,5 » a y = 372 et « les aires s'ajoutent » a y = 396 : vingt-quatre pixels
# d'ecart pour des caracteres de trente-trois. Les ordonnees avaient ete
# ecrites a la main du temps ou le texte en faisait douze ou seize ; la passe
# qui a remonte les tailles au plancher de la regle 32 a grossi les caracteres
# SANS toucher aux ordonnees. « le gros probleme c'est les superpositions, il y
# en a partout, image comme video ».
#
# 1,35 est l'interligne ordinaire d'un texte compose : la hauteur des
# caracteres, plus la respiration entre deux lignes. Sous 1,2 les hampes d'une
# ligne touchent les jambages de celle du dessus.
#
# ON N'EMPILE PLUS AVEC UNE CONSTANTE. Toute fonction qui pose des lignes l'une
# sous l'autre avance de `pas(taille)`, jamais d'un nombre ecrit a la main : le
# jour ou la taille change, l'espacement suit tout seul.
#
# Le crible : node outils/verifier-recouvrements.mjs
INTERLIGNE = 1.35


def pas(taille: float, lignes: float = 1.0) -> float:
    """De combien descendre pour poser la ligne suivante."""
    return INTERLIGNE * taille * lignes


# La chasse moyenne d'un caractere, en fraction de la taille. C'est LA MEME
# valeur que celle du crible, outils/verifier-recouvrements.mjs : le trace et
# le controle doivent mesurer pareil, sans quoi l'un pose ce que l'autre
# refuse. Elle surestime un mot tout en bas-de-casse et sous-estime un nombre ;
# c'est voulu, une largeur devinee doit se tromper du cote large.
CHASSE = 0.55


def largeur_texte(contenu: str, taille: float) -> float:
    return CHASSE * taille * len(contenu)


def couper(contenu: str, largeur: float, taille: float) -> list[str]:
    """Le texte coupe aux espaces pour tenir dans `largeur` a cette taille.

    Un mot plus long que la colonne n'est jamais coupe en deux : il deborde,
    et le crible le dira. Mieux vaut un debordement visible qu'un mot casse.
    """
    lignes, courante = [], ""
    for mot in contenu.split(" "):
        essai = f"{courante} {mot}".strip()
        if courante and largeur_texte(essai, taille) > largeur:
            lignes.append(courante)
            courante = mot
        else:
            courante = essai
    if courante:
        lignes.append(courante)
    return lignes or [""]


# ── Les primitives de trace ─────────────────────────────────────────────────


def txt(x, y, contenu, taille=15, couleur=ENCRE, ancre="start",
        graisse=400, italique=False) -> str:
    style = ' font-style="italic"' if italique else ""
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{POLICE}" '
        f'font-size="{taille}" font-weight="{graisse}" fill="{couleur}" '
        f'text-anchor="{ancre}"{style}>{esc(contenu)}</text>'
    )


def txt_indice(x, y, base, indice, suite="", taille=18, couleur=ENCRE,
               ancre="start", graisse=400) -> str:
    """Un texte portant un indice bas : « grad », puis W en petit et baisse.

    Les souscrits Unicode ne couvrent pas les lettres majuscules ni les
    exposants entre crochets : grad_W ne s'ecrit pas avec eux. Un tspan, lui,
    baisse et reduit n'importe quoi.
    """
    petit = taille * 0.68
    chute = taille * 0.24
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{POLICE}" '
        f'font-size="{taille}" font-weight="{graisse}" fill="{couleur}" '
        f'text-anchor="{ancre}">{esc(base)}'
        f'<tspan font-size="{petit:.1f}" dy="{chute:.1f}">{esc(indice)}</tspan>'
        f'<tspan font-size="{taille}" dy="{-chute:.1f}">{esc(suite)}</tspan>'
        f'</text>'
    )


def rect(x, y, w, h, trait="none", ep=2.0, fond="none") -> str:
    # Un rectangle sans trait n'ecrit pas son trait : une grille 28 x 28 en
    # compte 784, et l'attribut inutile double le poids du fichier.
    t = "" if trait == "none" else f' stroke="{trait}" stroke-width="{ep}"'
    return (
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
        f'fill="{fond}"{t}/>'
    )


def ligne(x1, y1, x2, y2, trait=ENCRE, ep=2.0, tirets=None, opacite=None,
          filet=False) -> str:
    """Un trait.

    `filet=True` marque un trait FAIT POUR TOUCHER LE TEXTE : la regle sous un
    titre, le trait qui separe deux sections, le soulignement d'une colonne. Il
    sort avec `data-role="filet"` et le crible des recouvrements l'ecarte de son
    genre texte/trait. Rien n'est devine a la teinte ni a l'epaisseur : un filet
    se declare, sans quoi un axe pale passerait pour un filet.
    """
    d = f' stroke-dasharray="{tirets}"' if tirets else ""
    o = f' stroke-opacity="{opacite}"' if opacite is not None else ""
    r = ' data-role="filet"' if filet else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{trait}" stroke-width="{ep}"{d}{o}{r}/>'
    )


def cercle(x, y, r, fond=ENCRE, trait="none", ep=1.0) -> str:
    t = "" if trait == "none" else f' stroke="{trait}" stroke-width="{ep}"'
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{fond}"{t}/>'


def fleche(x1, y1, x2, y2, trait=GRIS_58, ep=2.0, pointe=9.0) -> str:
    """Une fleche droite, pointe pleine. Aucun arrondi : c'est la regle.

    C'EST UN FILET. Dans ce cours une fleche est toujours nommee — « vec »,
    « ReLU », « argmax », « softmax » se posent sur sa hampe ou juste dessous,
    parce que c'est l'operation qu'elle porte. Le crible l'ecarte donc de son
    genre texte/trait. Une fleche qui traverserait un texte etranger lui
    echappe : c'est le prix, et il est paye en connaissance de cause.
    """
    a = math.atan2(y2 - y1, x2 - x1)
    xa, ya = x2 - pointe * math.cos(a - 0.4), y2 - pointe * math.sin(a - 0.4)
    xb, yb = x2 - pointe * math.cos(a + 0.4), y2 - pointe * math.sin(a + 0.4)
    return (
        ligne(x1, y1, x2 - pointe * 0.7 * math.cos(a),
              y2 - pointe * 0.7 * math.sin(a), trait, ep, filet=True)
        + f'<polygon points="{x2:.1f},{y2:.1f} {xa:.1f},{ya:.1f} '
          f'{xb:.1f},{yb:.1f}" fill="{trait}" data-role="filet"/>'
    )


def accolade(x, y0, y1, sens=1, trait=ENCRE, ep=2.0, dent=12.0) -> str:
    """Une accolade droite, en quatre segments. Aucune courbe.

    C'est un FILET au sens du crible : une accolade est faite pour porter le
    nombre qu'on pose a son bec, et il s'y pose contre elle.
    """
    xi = x + dent * sens
    return "".join([
        ligne(x, y0, xi, y0, trait, ep, filet=True),
        ligne(xi, y0, xi, y1, trait, ep, filet=True),
        ligne(xi, y1, x, y1, trait, ep, filet=True),
        ligne(xi, (y0 + y1) / 2, xi + dent * sens, (y0 + y1) / 2, trait, ep,
              filet=True),
    ])


def suspension(x, y, couleur=GRIS_58, r=3.0, pas=13.0) -> str:
    """Le ⋮ d'une colonne abregee : trois ronds, jamais un caractere."""
    return "".join(cercle(x, y + (i - 1) * pas, r, couleur) for i in range(3))


def document(largeur: int, hauteur: int, corps: list[str]) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{largeur}" '
        f'height="{hauteur}" viewBox="0 0 {largeur} {hauteur}">\n'
        f'<rect width="{largeur}" height="{hauteur}" fill="{PAPIER}"/>\n'
        + "\n".join(corps)
        + "\n</svg>\n"
    )


def entete(x, y, texte, largeur=360) -> list[str]:
    return [
        txt(x, y, texte, 17, GRIS_58, graisse=600),
        ligne(x, y + 10, x + largeur, y + 10, GRIS_24, 1.5, filet=True),
    ]


def colonne(x, y, contenus, taille, couleur=ENCRE, ancre="start",
            graisse=400) -> list[str]:
    """Des lignes empilees, l'interligne calcule sur LEUR taille.

    Un element de `contenus` peut etre un couple (texte, couleur) : une ligne
    de rappel se pose en gris sous une ligne a l'encre sans qu'on ait a
    rouvrir la boucle.
    """
    o = []
    for i, c in enumerate(contenus):
        contenu, teinte = c if isinstance(c, tuple) else (c, couleur)
        o.append(txt(x, y + i * pas(taille), contenu, taille, teinte, ancre,
                     graisse))
    return o


def bloc(x, y, contenu, largeur, taille, couleur=ENCRE, ancre="start",
         graisse=400) -> list[str]:
    """Un texte coupe a la largeur d'une colonne, et empile a l'interligne."""
    return colonne(x, y, couper(contenu, largeur, taille), taille, couleur,
                   ancre, graisse)


# ── Les deux echelles de couleur ────────────────────────────────────────────


def _melange(a: str, b: str, t: float) -> str:
    """Interpolation lineaire de deux couleurs, t dans [0, 1]."""
    t = min(1.0, max(0.0, t))
    ca = [int(a[1 + 2 * i:3 + 2 * i], 16) for i in range(3)]
    cb = [int(b[1 + 2 * i:3 + 2 * i], 16) for i in range(3)]
    return "#" + "".join(f"{round(x + (y - x) * t):02X}" for x, y in zip(ca, cb))


def gris(x: float) -> str:
    """L'encre d'un pixel : x = 0 donne du papier, x = 1 de l'encre pleine.

    C'est l'inversion annoncee en tete de fichier. Sur fond noir un pixel
    encre serait clair ; sur fond papier il est sombre.
    """
    return _melange(PAPIER, ENCRE, x)


def poids(v: float, m: float) -> str:
    """L'echelle divergente des poids, symetrique autour de zero.

    Brique pour le positif, ardoise pour le negatif, papier pour le nul. m est
    le maximum des VALEURS ABSOLUES : une echelle decalee donnerait une couleur
    au zero et deplacerait le point d'equilibre du gabarit.
    """
    if m <= 0:
        return PAPIER
    return _melange(PAPIER, BRIQUE if v >= 0 else ARDOISE, abs(v) / m)


# ── Les grilles 28 x 28, les deux facons de les dessiner ────────────────────


def grille_ronds(x0, y0, cote, X, r=None) -> list[str]:
    """Les 784 ronds d'une image, chacun rempli selon son niveau de gris.

    TOUS sont dessines, y compris les blancs : c'est la figure d'entree, et le
    quadrillage ne se lit que si les cases vides sont la. Le liseré tres pâle
    tient lieu de quadrillage.
    """
    r = r or cote * 0.42
    o = []
    for i in range(28):
        for j in range(28):
            v = float(X[i, j])
            o.append(cercle(x0 + (j + 0.5) * cote, y0 + (i + 0.5) * cote, r,
                            gris(v), GRIS_14 if v < 0.06 else "none", 1.0))
    return o


def grille_encre(x0, y0, cote, X) -> list[str]:
    """Une image en cases pleines. Les cases nulles ne sont pas emises.

    Une case blanche sur fond blanc ne se voit pas ; l'emettre quand meme
    couterait 668 rectangles par vignette, et une planche de douze vignettes
    peserait un demi-megaoctet pour rien.
    """
    o = []
    for i in range(28):
        for j in range(28):
            v = float(X[i, j])
            if v > 0:
                o.append(rect(x0 + j * cote, y0 + i * cote, cote + 0.4,
                              cote + 0.4, "none", 0, gris(v)))
    return o


def grille_poids(x0, y0, cote, G, m, tous=True) -> list[str]:
    """Un gabarit en cases pleines, sur l'echelle divergente.

    `tous` decide du sort des poids nuls. Sur un gabarit appris aucun poids
    n'est nul et toutes les cases sont emises. Sur un detecteur pose a la main,
    613 des 784 poids valent exactement zero : leur case est blanche, elle ne
    se voit pas sur le papier, et l'emettre quand meme triple le poids du
    fichier pour rien.
    """
    o = []
    for i in range(28):
        for j in range(28):
            v = float(G[i, j])
            if not tous and v == 0.0:
                continue
            o.append(rect(x0 + j * cote, y0 + i * cote, cote + 0.4, cote + 0.4,
                          "none", 0, poids(v, m)))
    return o


def cadre_grille(x0, y0, cote, trait=GRIS_40, ep=1.6) -> str:
    return rect(x0, y0, 28 * cote, 28 * cote, trait, ep)


def reperes_grille(x0, y0, cote, marques=(1, 7, 14, 21, 28), taille=12
                   ) -> list[str]:
    """Les indices de ligne et de colonne. 1 et 28 y sont toujours : une grille
    dont le dernier rang n'est pas cote laisse croire qu'elle en compte 27."""
    o = []
    for k in marques:
        c = x0 + (k - 0.5) * cote
        o.append(txt(c, y0 - 10, str(k), taille, GRIS_58, "middle"))
        o.append(txt(x0 - 12, y0 + (k - 0.5) * cote + 4, str(k), taille,
                     GRIS_58, "end"))
    return o


# Les souscrits Unicode disponibles : les dix chiffres, et les cinq lettres
# d'indice du parcours. Les autres lettres n'en ont pas, et se ferment par
# txt_indice.
SOUSCRITS = str.maketrans(
    "0123456789ijkln",
    "₀₁₂₃₄₅₆₇₈₉ᵢⱼₖₗₙ",
)


def xk(k: int) -> str:
    """La coordonnee de rang k, ecrite x avec son indice en souscrit."""
    return "x" + str(k).translate(SOUSCRITS)


def boite(x, y, w, h, nom, dims, couleur=ENCRE, fond="none", dy=0.0
          ) -> list[str]:
    """Une matrice ou un vecteur, avec son nom au-dessus et ses dimensions
    dessous. `dy` decale la cote quand deux boites voisines sont si serrees
    que leurs dimensions se toucheraient."""
    return [
        rect(x, y, w, h, couleur, 2.0, fond),
        txt(x + w / 2, y - 12, nom, 16, couleur, "middle", 600),
        txt(x + w / 2, y + h + 20 + dy, dims, 12, GRIS_58, "middle"),
    ]
