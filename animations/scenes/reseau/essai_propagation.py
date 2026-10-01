"""
L'essai du réseau partagé. Ce n'est pas une animation du cours.

Il ne déclare aucune `ANIMATIONS` : ni le manifeste ni la webapp ne le voient.
Il existe pour une seule raison — vérifier, en image et à la taille réelle, que
`scenes/reseau_mob.py` tient à 1080p avant que huit scènes soient écrites
dessus. La trame à 4 s est celle qu'on regarde : les ronds de la couche cachée
doivent être des ronds, le 7 doit rester un 7, et rien ne doit se recouvrir.

    python animations/scenes/reseau/essai_propagation.py     la mesure, seule
    manim render animations/scenes/reseau/essai_propagation.py EssaiPropagation
"""

from __future__ import annotations

from scenes.n7ia import appliquer_style
from scenes.reseau_mob import ReseauScene, abreger, px_par_unite


class EssaiPropagation(ReseauScene):
    titre = "Essai · la propagation"

    def construct(self) -> None:
        appliquer_style()
        self.poser_titre(taille=24)
        self.propagation(0)
        self.wait(1.0)


if __name__ == "__main__":
    entier_abrege, entier, reduit = abreger(128)
    print(f"  une unité Manim vaut {px_par_unite():.1f} px à 1080p")
    print(f"  128 ronds entiers   : {entier:.1f} px de diamètre")
    print(f"  24 + points + 24    : {reduit:.1f} px de diametre")
    print(f"  abréviation requise : {entier_abrege}")
