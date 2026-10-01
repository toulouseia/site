"""
Chapitre 3 · le réseau au départ, et la sortie qu'il donne.

Deux scènes, un seul objet vu de deux façons. La première montre le réseau
lui-même, poids tirés au hasard, en train de propager une image : il EST le
sujet, et il reste à pleine opacité d'un bout à l'autre. La seconde prend sa
colonne de sortie, la pose au centre en barres, et passe le réseau au décor :
le sujet a changé, l'opacité suit.

Reprend `SOURCE.md` §2 — l'initialisation jouée comme un geste, et la sortie
quelconque lue sur la colonne. Remplace `ce-que-le-chapitre-2-a-construit`,
`les-poids-nont-pas-dorigine`, `pire-que-le-hasard`, `une-sortie-non-entrainee`.

LES DIX VALEURS NE SONT PAS RECOPIÉES. La scène refait le tirage de la graine 0
et la propagation, et retombe sur les dix nombres de la mesure 1, ligne 239.
L'assertion en bas de ce fichier le vérifie à chaque construction : un rendu qui
afficherait autre chose que ce que la page annonce échouerait avant de
commencer.
"""

import numpy as np
from manim import (  # type: ignore[import-not-found]
    LEFT,
    Create,
    DashedLine,
    FadeIn,
    Rectangle,
    Transform,
    VGroup,
    Write,
)

from scenes.n7ia import (
    BRIQUE,
    ENCRE,
    ENCRE_30,
    ENCRE_55,
    TRAIT_COTE,
    TRAIT_FILET,
    appliquer_style,
)
from scenes.descente.descente_mob import (
    MESURES,
    ReseauAuHasard,
    nombre,
)

ANIMATIONS = [
    {
        "id": "le-reseau-au-hasard",
        "scene": "LeReseauAuHasard",
        "titre": "Le réseau avant d'avoir rien appris",
        "bandeau": "LE RÉSEAU AU HASARD",
        "section": "Page 4 · Au départ, après le paragraphe sur l'initialisation",
        "geste": "une image traverse le réseau, couche après couche",
        "notions": [
            "geste : une image traverse le réseau, couche après couche",
            "initialisation au hasard",
            "propagation avant",
            "softmax",
        ],
        "legende": (
            "Le réseau du chapitre 2, mêmes rangs et même géométrie, mais avec "
            "les poids du tirage de la graine 0 : rien n'a encore été appris. "
            "Une image de test entre, ses pixels encrés filent vers la colonne "
            "d'entrée, chaque faisceau s'illumine avant la couche qu'il "
            "alimente, et les dix ronds de sortie se remplissent. Le rond le "
            "plus rempli passe à la brique — et ce n'est pas le bon."
        ),
        "mouvement": [
            "1. Le réseau est là dès la première trame, à pleine opacité : "
            "c'est lui le sujet.",
            "2. La grille 28 × 28 de l'image paraît à gauche.",
            "3. Les cases encrées s'envolent vers leur rond de la colonne "
            "d'entrée, qui se remplit.",
            "4. Le premier faisceau s'illumine de gauche à droite en brique, "
            "et la couche cachée se remplit derrière lui.",
            "5. Le second faisceau fait de même, et la colonne de sortie se "
            "remplit.",
            "6. Le rond de sortie le plus rempli passe à la brique.",
        ],
        "ecran": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "784", "128"],
        "nombres": {},
        "alt": (
            "Le réseau occupe tout l'écran : à gauche une grille carrée de "
            "vingt-huit cases sur vingt-huit, puis trois colonnes de ronds "
            "vides reliées par deux nappes de traits très pâles, et à droite "
            "une colonne de dix ronds portant chacun son chiffre, de zéro à "
            "neuf. Les deux premières colonnes sont abrégées par des points de "
            "suspension, avec une accolade qui porte leur taille vraie, sept "
            "cent quatre-vingt-quatre et cent vingt-huit. La grille se remplit "
            "du dessin d'un chiffre manuscrit en niveaux de gris. Ses cases "
            "encrées se détachent alors une à une et filent vers la colonne "
            "d'entrée, dont les ronds se remplissent d'encre à mesure. Une "
            "vague de brique traverse ensuite la première nappe de traits, de "
            "gauche à droite, et la colonne du milieu se remplit derrière "
            "elle, très inégalement : certains ronds deviennent presque noirs, "
            "beaucoup restent vides. La même vague traverse la seconde nappe, "
            "et les dix ronds de sortie se remplissent à leur tour. Aucun ne "
            "s'impose : le plus foncé l'est quatre fois plus que le plus pâle, "
            "là où un réseau entraîné en noircirait un seul et laisserait les "
            "neuf autres presque vides. Le plus rempli d'entre eux voit enfin son "
            "contour passer à la brique, et ce n'est pas celui du chiffre "
            "dessiné dans la grille."
        ),
    },
    {
        "id": "dix-valeurs-inegales",
        "scene": "DixValeursInegales",
        "titre": "Dix valeurs, et elles ne sont pas égales",
        "bandeau": "LA SORTIE AU DÉPART",
        "section": "Page 4 · Comment fait-on pire que le hasard, après la sortie complète",
        "geste": "les dix sorties se déplient en barres depuis leurs ronds",
        "notions": [
            "geste : les dix sorties se déplient en barres depuis leurs ronds",
            "loi de probabilité",
            "simplexe",
            "entropie croisée",
        ],
        "legende": (
            "Le réseau passe au décor et chacun des dix ronds de sa colonne de "
            "sortie pousse vers la droite une barre à sa valeur mesurée. Les "
            "dix valeurs s'inscrivent en regard. Une ligne pointillée marque "
            "la longueur qu'aurait chaque barre pour une loi uniforme : cinq "
            "la dépassent, cinq restent en deçà. La barre de la vraie classe "
            "passe à la brique, et elle est parmi les plus courtes."
        ),
        "mouvement": [
            "1. La colonne de sortie du réseau se remplit aux dix valeurs "
            "mesurées ; le reste du réseau s'efface à 0,3.",
            "2. Chaque rond pousse sa barre vers la droite, du haut vers le "
            "bas, à son ordonnée.",
            "3. Les dix valeurs s'inscrivent en regard, alignées à droite.",
            "4. Une ligne pointillée verticale se pose à la longueur d'une loi "
            "uniforme, cotée en dessous.",
            "5. Les cinq barres qui la dépassent épaississent leur contour.",
            "6. La barre de la classe 7, la vraie, passe à la brique avec sa "
            "valeur.",
        ],
        "ecran": [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "0,1221", "0,0885", "0,2106", "0,1094", "0,1149",
            "0,1021", "0,0825", "0,0650", "0,0493", "0,0555", "0,1",
        ],
        # LES VALEURS SONT LITTÉRALES, et elles doivent l'être : `manifeste.py`
        # lit cette liste par l'arbre syntaxique, sans importer le fichier —
        # importer demanderait Manim. L'assertion en bas du fichier vérifie
        # qu'elles sont bien celles de `descente_mob.MESURES`.
        "nombres": {
            "sortie": [0.1221, 0.0885, 0.2106, 0.1094, 0.1149,
                       0.1021, 0.0825, 0.0650, 0.0493, 0.0555],
            "uniforme": 0.1,
            "classe_vraie": 7,
        },
        "alt": (
            "Le réseau s'efface et devient un décor très pâle ; seule sa "
            "colonne de sortie, à droite, garde ses dix ronds remplis, chacun "
            "portant son chiffre de zéro à neuf. De chaque rond part alors "
            "vers la droite une barre horizontale, du haut vers le bas, l'une "
            "après l'autre, et chacune s'arrête à sa propre longueur. Les "
            "longueurs sont visiblement inégales : la barre de la classe deux "
            "est plus de quatre fois plus longue que celle de la classe huit, "
            "alors qu'aucune n'a de raison de l'être. Les dix valeurs "
            "s'inscrivent ensuite en brique tout à droite, alignées les unes "
            "sous les autres : zéro virgule douze vingt et un, zéro virgule "
            "zéro huit quatre-vingt-cinq, zéro virgule vingt et un zéro six, "
            "zéro virgule dix quatre-vingt-quatorze, zéro virgule onze "
            "quarante-neuf, zéro virgule dix vingt et un, zéro virgule zéro "
            "huit vingt-cinq, zéro virgule zéro six cinquante, zéro virgule "
            "zéro quatre quatre-vingt-treize, zéro virgule zéro cinq "
            "cinquante-cinq. Une ligne verticale pointillée se pose alors en "
            "travers des barres, à la longueur zéro virgule un, celle "
            "qu'aurait chacune si le réseau répondait au hasard, et sa valeur "
            "s'inscrit sous elle. Cinq barres la dépassent, et leur contour "
            "s'épaissit pour qu'on les repère ; les cinq autres restent en "
            "deçà — le réseau ne penche donc pas dans un sens, il hésite. La "
            "barre de la classe sept, enfin, celle qui est "
            "la vraie réponse, passe à la brique avec sa valeur : elle est "
            "parmi les plus courtes."
        ),
    },
]


class LeReseauAuHasard(ReseauAuHasard):
    """
    Le réseau EST le sujet : il reste à pleine opacité d'un bout à l'autre, et
    rien d'autre n'apparaît. C'est la seule des huit scènes du chapitre où le
    réseau ne passe pas au décor.
    """

    titre = "Le réseau au hasard"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        self.next_section("L'image entre")
        cache = self.propager(0, duree=7.0)

        self.next_section("Le rond le plus rempli")
        self.marquer_sortie(int(np.argmax(cache["A2"])))
        self.wait(1.8)


class DixValeursInegales(ReseauAuHasard):
    """
    Le sujet a changé : ce sont les dix valeurs, pas le réseau. Le réseau passe
    donc au décor, et les barres prennent le centre.

    LA GRILLE D'ENTRÉE N'EST PAS DESSINÉE. Elle n'a rien à dire ici, et elle
    occuperait le quart gauche de la bande où le sujet se pose.
    """

    titre = "La sortie au départ"
    montrer_grille = False

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)

        sortie = self.sortie_au_hasard(0)
        vraie = MESURES["classe_vraie"]

        self.next_section("La colonne de sortie se remplit")
        self.play(
            Transform(self.sortie.ronds, self.sortie.allumer(sortie)),
            run_time=1.0,
        )

        self.next_section("Le réseau passe au décor")
        self.play(*self.animations_effacement(), run_time=1.2)

        # ── Le sujet : les dix valeurs, dépliées depuis leurs propres ronds ───
        #
        # LES BARRES POUSSENT DANS LA BANDE QUE `reseau_mob` RÉSERVE AUX SCÈNES,
        # à droite de l'abscisse 3,4. C'est la seule place où un sujet ne se pose
        # sur rien : le réseau occupe tout le reste, et un pavé posé dessus
        # aurait beau être à pleine opacité, il recouvrirait ce qu'il commente —
        # le crible le signalait, huit fois.
        #
        # CHAQUE BARRE PART DU ROND QU'ELLE MESURE, à son ordonnée exacte, LUE
        # sur la colonne et non recalculée : le sujet n'est pas un histogramme
        # posé à côté du réseau, c'est la sortie du réseau dépliée. Il occupe
        # toute la hauteur de la colonne, soit 97 % du cadre — la règle en
        # demande 60.
        depart = 3.15
        echelle = 10.0                 # 0,2106 × 10 = 2,11 unités, la plus longue
        epaisseur_barre = 0.34
        droite_cotes = 6.45

        self.next_section("Les dix valeurs se déplient")
        barres = []
        for k, valeur in enumerate(sortie):
            y = self.sortie.ronds[k].get_center()[1]
            barre = Rectangle(
                width=float(valeur) * echelle,
                height=epaisseur_barre,
                stroke_width=TRAIT_FILET,
                color=ENCRE_55,
            )
            barre.set_fill(ENCRE_30, opacity=1.0)
            barre.move_to([depart, y, 0], aligned_edge=LEFT)
            barres.append(barre)
            self.play(Create(barre), run_time=0.22)

        self.next_section("Les dix valeurs, cotées")
        cotes = VGroup()
        for k, valeur in enumerate(sortie):
            y = self.sortie.ronds[k].get_center()[1]
            cote = self.cote(nombre(float(valeur)), taille=24)
            cote.move_to([droite_cotes - cote.width / 2.0, y, 0])
            cotes.add(cote)
        self.play(FadeIn(cotes, lag_ratio=0.12), run_time=1.4)

        self.next_section("Ce que donnerait le hasard")
        # LA COTE DU REPÈRE SE POSE EN HAUT, PAS EN BAS. La colonne de sortie
        # descend jusqu'à −3,45 : sous la dernière barre, il ne reste que
        # quinze centièmes avant la marge, et le crible le disait — « mord de
        # 0,36 u ». Au-dessus, la place existe, entre le filet du bandeau à
        # 3,01 et le haut du cadre.
        x_u = depart + MESURES["uniforme"] * echelle
        uniforme = DashedLine(
            [x_u, barres[-1].get_bottom()[1] - 0.10, 0],
            [x_u, barres[0].get_top()[1] + 0.10, 0],
            stroke_width=TRAIT_FILET,
            color=ENCRE_55,
            dash_length=0.12,
        )
        cote_u = self.cote(nombre(MESURES["uniforme"], 1), taille=24)
        cote_u.move_to([x_u, 3.22, 0])
        self.play(Create(uniforme), Write(cote_u), run_time=1.0)

        # Les CINQ qui dépassent se marquent par LEUR PROPRE contour. Un signe
        # posé à côté désignerait son voisin autant qu'elles. Cinq, et non trois
        # comme l'annonçait l'ancienne déclaration : la trame l'a montré, et
        # l'assertion en bas du fichier l'a figé.
        for k, valeur in enumerate(sortie):
            if float(valeur) > MESURES["uniforme"]:
                self.play(
                    barres[k].animate.set_stroke(ENCRE, width=TRAIT_COTE),
                    run_time=0.22,
                )

        self.next_section("La vraie classe")
        self.play(
            barres[vraie].animate.set_fill(BRIQUE, opacity=1.0)
            .set_stroke(BRIQUE, width=TRAIT_COTE),
            cotes[vraie].animate.set_color(BRIQUE),
            run_time=0.8,
        )
        self.wait(2.0)


# ── Ce que la scène affiche est ce que la mesure 1 imprime ───────────────────
#
# Le tirage et la propagation sont refaits, jamais recopiés. Cette vérification
# se fait à l'import, donc au crible comme au rendu : si `reseau_mob.avant` ou
# `init_aleatoire` dérivaient, aucune trame ne sortirait avec de faux nombres.


def _verifier_la_sortie() -> None:
    from scenes.descente.descente_mob import init_aleatoire
    from scenes.reseau_mob import avant, charger_test

    # La déclaration porte les nombres en littéraux ; la table les porte avec
    # leur ligne dans `mesures.py`. Les deux doivent dire la même chose.
    declaree = ANIMATIONS[1]["nombres"]
    assert tuple(declaree["sortie"]) == MESURES["sortie"]
    assert declaree["uniforme"] == MESURES["uniforme"]
    assert declaree["classe_vraie"] == MESURES["classe_vraie"]

    # COMBIEN DE BARRES DÉPASSENT LE REPÈRE DU HASARD. L'ancienne déclaration en
    # annonçait trois ; il y en a cinq, et la trame du rendu d'essai l'a montré
    # sans appel. C'est le genre d'écart qu'aucune relecture de prose ne trouve,
    # parce que la prose est cohérente avec elle-même. Il est figé ici.
    au_dessus = [v for v in MESURES["sortie"] if v > MESURES["uniforme"]]
    assert len(au_dessus) == 5, (
        f"{len(au_dessus)} valeurs dépassent la loi uniforme, et la légende "
        f"comme la description alternative en annoncent cinq."
    )

    Xte, _ = charger_test(1)
    a = avant(init_aleatoire(), Xte[0], "relu")["A2"]
    attendue = np.array(MESURES["sortie"])
    assert np.allclose(np.round(a, 4), attendue, atol=1e-4), (
        "la sortie recalculée ne retombe pas sur la mesure 1, ligne 239 : "
        f"{np.round(a, 4)} au lieu de {attendue}"
    )


_verifier_la_sortie()
