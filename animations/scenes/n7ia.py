"""
Le style N7-IA pour Manim.

Les animations de l'Academy ne ressemblent pas à des animations Manim : elles
ressemblent à l'application. Fond papier, traits à l'encre, cotes en brique,
aucun arrondi, aucune ombre, aucun dégradé. C'est la même règle que dans
`src/app/globals.css`, et les valeurs sont les mêmes, recopiées ici parce
qu'un fichier Python ne peut pas lire du CSS, et vérifiées à la main.

Une animation qui utiliserait la palette Manim par défaut, fond noir bleuté,
jaune, bleu clair, serait immédiatement reconnaissable comme un corps
étranger dans une leçon.
"""

from pathlib import Path

from manim import (  # type: ignore[import-not-found]
    BLACK,
    DOWN,
    LEFT,
    ORIGIN,
    RIGHT,
    UP,
    Scene,
    Text,
    VGroup,
    config,
)

# ── La palette, arrêtée par l'identité ──────────────────────────────────────

ENCRE = "#14120F"
PAPIER = "#FFFFFF"
SOMBRE = "#14161A"
BRIQUE = "#A8442A"

GRIS_14 = "#E4E1DC"
GRIS_24 = "#D2CEC8"
GRIS_40 = "#ADA8A0"
GRIS_58 = "#7E7972"
GRIS_72 = "#565049"

FILET = GRIS_14
FILET_FORT = GRIS_24

# ── L'encre a opacite reduite ───────────────────────────────────────────────
#
# LE REPOS SE REND EN ENCRE PALIE, JAMAIS EN GRIS CLAIR. Un gris clair sur
# blanc ne se lit pas, et il ne se rattrape pas a l'impression ; l'encre, elle,
# garde sa teinte en palissant. Les trois valeurs sont l'encre melangee au
# papier a 30, 55 et 75 pour cent -- 0,30 est le plancher, rien de ce qui doit
# se lire ne descend dessous.
ENCRE_30 = "#B9B8B7"   # les grilles, les filets de fond
ENCRE_55 = "#7E7D7B"   # les contours seconds, les bornes
ENCRE_75 = "#4F4D4B"   # les etiquettes, les cotes qui se lisent

# Les épaisseurs. Le filet de l'interface fait 1 px sur un écran ; à l'échelle
# de Manim, 1.6 donne le même poids visuel à 1080p.
TRAIT_FILET = 1.6
TRAIT_AXE = 2.4
TRAIT_COURBE = 3.2
TRAIT_COTE = 2.8

# ── Le cadre du sujet ───────────────────────────────────────────────────────
#
# UNE MARGE D'UNE DEMI-UNITE, PARTOUT. C'est celle du bandeau, `buff=0.5` :
# le sujet s'aligne dessus au lieu d'avoir la sienne.
#
# LE SUJET OCCUPE AU MOINS 60 % DE LA HAUTEUR du cadre laisse sous le bandeau.
# La regle vient d'une relecture des planches-contact du chapitre 1 : a deux
# trames par seconde, sur une vignette de 384 pixels, un objet qui occupe le
# tiers de la hauteur ne se lit plus. Ce n'est pas une preference de mise en
# page, c'est le seuil sous lequel la relecture devient impossible.

MARGE = 0.5
PART_SUJET = 0.60

# ── La fonte ────────────────────────────────────────────────────────────────
#
# LE COURS EST ÉCRIT EN GREC AUTANT QU'EN LATIN. θ, η, σ, δ, ℓ : ce sont les
# noms de ses objets, et ils apparaissent dans presque chaque libellé. Une
# fonte qui ne les porte pas ne peut pas composer ce cours.
#
# `src/fonts/Archivo.ttf` est la fonte de l'identité, celle que
# `src/app/layout.tsx` charge pour l'application. C'est un SOUS-ENSEMBLE
# LATIN, produit pour le web : 653 glyphes, et pas un caractère du bloc grec.
# Ni θ (U+03B8), ni η, ni σ, ni δ.
#
# CE QUI ARRIVE SI ON L'ENREGISTRE QUAND MÊME, et c'est mesuré : Pango ne se
# rabat PAS sur une autre fonte pour le glyphe manquant. Il dessine sa boîte
# hexadécimale, un petit cadre portant « 03 B8 » en chiffres minuscules. Sur
# la scène DescenteUneVariable, « chaque pas divise θ par deux » devenait
# « chaque pas divise [03B8] par deux », et la table des itérations affichait
# [03B8] = 3 à chaque ligne.
#
# ON NE L'ENREGISTRE DONC PAS. Manim compose avec la fonte système, qui porte
# le grec, et l'ensemble reste homogène — une seule fonte partout, ce qui vaut
# mieux qu'un mélange de deux au milieu d'une phrase.
#
# POUR ACTIVER L'IDENTITÉ, il faut un fichier Archivo qui couvre le bloc grec.
# Le jour où il est déposé dans src/fonts/, la vérification ci-dessous le
# constate et l'enregistrement se fait tout seul. Rien d'autre à changer.
# La chaîne vide, et non None : c'est ainsi que Manim demande la fonte par
# défaut du système. `Text(font=None)` lèverait une exception dans Pango.
FONTE: str = ""

_FICHIER_FONTE = (
    Path(__file__).resolve().parent.parent.parent / "src" / "fonts" / "Archivo.ttf"
)

# Les caractères non latins que le cours emploie réellement. La liste est
# courte exprès : elle doit rester vérifiable à l'œil.
_EXIGES = "θηστδλμΘ"


def _couvre_le_grec(chemin: Path) -> bool:
    """Vrai si la fonte porte TOUS les caractères de `_EXIGES`."""
    try:
        from fontTools.ttLib import TTFont  # type: ignore[import-not-found]
    except ImportError:
        return False
    try:
        fonte = TTFont(str(chemin))
        connus: set[int] = set()
        for table in fonte["cmap"].tables:
            connus |= set(table.cmap.keys())
    except Exception:  # noqa: BLE001 — une fonte illisible n'est pas utilisable
        return False
    return all(ord(c) in connus for c in _EXIGES)


def _enregistrer_la_fonte() -> None:
    """
    N'enregistre la fonte de l'identité que si elle peut composer le cours.
    Un enregistrement partiel est pire que pas d'enregistrement : il remplace
    des lettres par des cadres, sans rien signaler.
    """
    global FONTE
    if not _FICHIER_FONTE.exists() or not _couvre_le_grec(_FICHIER_FONTE):
        return
    try:
        import manimpango  # type: ignore[import-not-found]
    except ImportError:  # pragma: no cover — sans Manim, rien à dessiner
        return
    if "Archivo" not in set(manimpango.list_fonts()):
        manimpango.register_font(str(_FICHIER_FONTE))
    if "Archivo" in set(manimpango.list_fonts()):
        FONTE = "Archivo"


_enregistrer_la_fonte()


def _capitales(texte: str) -> str:
    """
    Les capitales du bandeau de titre, SANS toucher aux lettres grecques.

    `str.upper()` transforme θ en Θ, et Θ est un autre symbole : un titre qui
    annonce « f(Θ) » ment sur ce que la scène montre. On ne met donc en
    capitales que ce qui n'appartient pas au bloc grec d'Unicode.
    """
    return "".join(c if "Ͱ" <= c <= "Ͽ" else c.upper() for c in texte)


def appliquer_style() -> None:
    """
    À appeler une fois, avant toute scène.

    Elle ne fixe QUE la couleur de fond. La résolution et la cadence viennent
    du profil de rendu (`rendre.py`), qui rend en 4K pour réduire ensuite : les
    figer ici empêcherait ce profil de fonctionner, silencieusement.
    """
    config.background_color = PAPIER


class SceneN7(Scene):
    """
    La scène de base. Elle pose le fond papier et fournit les deux ornements
    que toutes les animations de l'Academy partagent : l'étiquette de titre en
    haut à gauche, et le filet qui la sépare du dessin.
    """

    titre: str = ""

    def setup(self) -> None:
        super().setup()
        self.camera.background_color = PAPIER

    #: Le bandeau, une fois pose. `cadre_sujet` s'en sert pour savoir ou
    #: commence la place laissee au sujet.
    _bandeau: VGroup | None = None

    def cadre_sujet(self) -> tuple[float, float, float, float]:
        """Le cadre laisse au sujet : (gauche, droite, bas, haut).

        Il commence sous le bandeau et s'arrete a une demi-unite des bords.
        Sans bandeau, il part du haut du cadre, moins la meme marge.
        """
        haut = config.frame_height / 2 - MARGE
        if self._bandeau is not None:
            haut = self._bandeau.get_bottom()[1] - 0.30
        bas = -config.frame_height / 2 + MARGE
        demi = config.frame_width / 2 - MARGE
        return -demi, demi, bas, haut

    def poser_sujet(self, sujet, part: float = PART_SUJET, verifier=True):
        """Agrandit `sujet` jusqu'au cadre, puis le centre dedans.

        Il grandit jusqu'a toucher un bord, jamais au-dela ; `verifier` leve
        si la hauteur obtenue reste sous `part`, ce qui n'arrive que si le
        sujet est trop large pour monter — et c'est alors le sujet qu'il faut
        refaire, pas la marge.
        """
        gauche, droite, bas, haut = self.cadre_sujet()
        largeur_cadre, hauteur_cadre = droite - gauche, haut - bas
        k = min(largeur_cadre / max(sujet.width, 1e-6),
                hauteur_cadre / max(sujet.height, 1e-6))
        sujet.scale(k)
        sujet.move_to(ORIGIN)
        sujet.shift(UP * ((haut + bas) / 2))
        part_obtenue = sujet.height / hauteur_cadre
        if verifier and part_obtenue < part:
            raise RuntimeError(
                f"{type(self).__name__} : le sujet n'occupe que "
                f"{part_obtenue:.0%} de la hauteur du cadre, il en faut "
                f"{part:.0%}. Il est trop large pour monter : c'est sa "
                f"composition qu'il faut reprendre, pas la marge."
            )
        return sujet

    def poser_titre(self, texte: str | None = None, taille: int = 20) -> VGroup:
        # `taille` : la regle 25 demande 24 au moins pour un texte de plusieurs
        # mots. Le defaut reste 20 pour ne pas faire deriver les chapitres deja
        # rendus ; un chapitre qui se met a la regle passe taille=24.
        from manim import Line  # import local : Manim est lourd à charger

        libelle = Text(
            _capitales(texte or self.titre),
            font=FONTE,
            weight="BOLD",
            font_size=taille,
            color=GRIS_58,
        )
        libelle.to_corner(UP + LEFT, buff=0.5)

        filet = Line(
            libelle.get_corner(DOWN + LEFT) + DOWN * 0.18,
            libelle.get_corner(DOWN + LEFT) + DOWN * 0.18 + RIGHT * 12.4,
            stroke_width=TRAIT_FILET,
            color=FILET_FORT,
        )
        groupe = VGroup(libelle, filet)
        self.add(groupe)
        self._bandeau = groupe
        return groupe

    def etiquette(self, texte: str, taille: int = 22, couleur: str = ENCRE) -> Text:
        return Text(texte, font=FONTE, weight="MEDIUM", font_size=taille, color=couleur)

    def cote(self, texte: str, taille: int = 20) -> Text:
        """Une cote : brique, étroite, tabulaire. Elle mesure, elle ne remplit pas."""
        return Text(texte, font=FONTE, weight="SEMIBOLD", font_size=taille, color=BRIQUE)


__all__ = [
    "BLACK",
    "MARGE",
    "PART_SUJET",
    "BRIQUE",
    "ENCRE",
    "ENCRE_30",
    "ENCRE_55",
    "ENCRE_75",
    "FILET",
    "FILET_FORT",
    "FONTE",
    "GRIS_24",
    "GRIS_40",
    "GRIS_58",
    "GRIS_72",
    "PAPIER",
    "SOMBRE",
    "SceneN7",
    "TRAIT_AXE",
    "TRAIT_COTE",
    "TRAIT_COURBE",
    "TRAIT_FILET",
    "appliquer_style",
]
