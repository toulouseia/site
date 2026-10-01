#!/usr/bin/env python3
"""
Construit `public/animations/manifeste.json` : le contrat entre le pipeline
Manim et la webapp.

CE SCRIPT N'A BESOIN DE RIEN. Python 3.11 et la bibliothèque standard. Pas de
Manim, pas de LaTeX, pas de ffmpeg. C'est délibéré : n'importe qui travaillant
sur les écrans peut le lancer, et l'application affiche alors correctement
« animation à rendre » partout où il faut, au lieu d'un cadre vide ou d'une
balise vidéo cassée.

Il lit trois choses :

  1. LES DÉCLARATIONS. Chaque fichier de scène expose une liste `ANIMATIONS`
     au niveau du module. On la lit par l'arbre syntaxique (`ast`), sans
     importer le fichier, importer demanderait Manim.

  2. LES RENDUS. `rendre.py` dépose un `rendu.json` dans
     `public/animations/<id>/` après chaque rendu réussi. Sa présence est ce
     qui fait passer une animation de « prévue » à « rendue ».

  3. LA PÉREMPTION. Un `rendu.json` dit qu'un rendu a eu lieu, pas qu'il
     correspond encore à sa source. Voir le bloc « La péremption » plus bas :
     c'est la seule partie du script qui ait une mémoire.

LE PARCOURS VA JUSQU'AU BOUT. Cinq chapitres s'écrivent en parallèle, un agent
par chapitre. Un fichier fautif ne doit donc pas empêcher les quatre autres
d'être vérifiés : aucune déclaration invalide n'interrompt le parcours. Elles
sont toutes collectées, rapportées groupées par chapitre — le dossier de premier
niveau sous `scenes/` — et la sortie est non nulle.

Usage :
    python animations/manifeste.py            écrit le manifeste ; sort quand
                                              même en erreur si une déclaration
                                              est invalide
    python animations/manifeste.py --verifier n'écrit rien, sort en erreur si
                                              une déclaration est invalide,
                                              relève les rendus périmés
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import sys
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


def _console_utf8() -> None:
    """
    Windows ouvre encore la console en cp1252 : une coche ou une flèche y
    lèverait une exception au premier message. On force l'UTF-8 quand c'est
    possible, et on ne s'en occupe plus.
    """
    for flux in (sys.stdout, sys.stderr):
        try:
            flux.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, OSError):
            pass


RACINE = Path(__file__).resolve().parent
SCENES = RACINE / "scenes"
STYLE = SCENES / "n7ia.py"
SORTIE = RACINE.parent / "public" / "animations"

CHAMPS_OBLIGATOIRES = ("id", "scene", "titre", "alt")

# La description alternative n'est pas une étiquette : c'est ce que l'animation
# montre, dit en phrases. En dessous de ce seuil, c'en est une.
LONGUEUR_ALT_MINIMALE = 120


# ── La péremption ───────────────────────────────────────────────────────────
#
# LE PROBLÈME. Un `rendu.json` prouve qu'un rendu a eu lieu ; il ne dit rien de
# ce qui a été édité depuis. Le manifeste a longtemps déclaré « rendue » toute
# scène pourvue d'un témoin, y compris quand sa source avait changé après.
#
# L'EMPREINTE EST CALCULÉE PAR CLASSE, JAMAIS PAR FICHIER. Un fichier de scènes
# en porte deux ou trois, et cinq agents en écrivent un chacun : une empreinte
# de fichier périmerait les voisines de toute scène touchée, et déclarer une
# scène neuve périmerait les anciennes — des rendus refaits pour rien, et un
# signalement que plus personne ne lit.
#
# CE QUI ENTRE DANS L'EMPREINTE D'UNE SCÈNE :
#   · sa propre classe ;
#   · tout le reste du module autour d'elle — imports, constantes, fonctions
#     d'aide — dont son rendu dépend vraiment ;
#   · `scenes/n7ia.py`, le style commun, importé par toutes.
# CE QUI N'Y ENTRE PAS :
#   · les AUTRES classes de scène du même fichier ;
#   · la liste `ANIMATIONS`, qui est de la métadonnée : réécrire un titre ou un
#     `alt` ne change pas une image, et déclarer une scène de plus ne doit pas
#     périmer ses voisines.
#
# L'empreinte de `rendre.py` n'est PAS celle-ci, et n'a pas à l'être : elle
# hache le fichier entier, plus la fonte et les versions des paquets, parce
# qu'elle nomme un mp4 et doit se tromper du côté prudent. Celle-ci répond à
# une autre question — « la vidéo montre-t-elle encore ce que dit la source ? »
# — à laquelle un `alt` réécrit ne change rien.
#
# LA DATE VIENT D'AILLEURS. Une empreinte dit que quelque chose a changé, pas
# quand. Le manifeste précédent porte, pour chaque scène, son empreinte et la
# date à laquelle cette empreinte-là a été vue : empreinte identique, on
# reporte la date ; empreinte différente, la date de modification du fichier.
# C'est pourquoi ces deux champs sont écrits dans `manifeste.json` et
# versionnés — sans eux, un clone frais, où tous les fichiers datent du
# checkout, croirait tout périmé.


def _condense(*morceaux: bytes) -> str:
    condense = hashlib.sha256()
    for morceau in morceaux:
        condense.update(morceau)
    return condense.hexdigest()[:12]


def _date(horodatage: float) -> str:
    """Une mtime, en UTC : les `rendu.json` sont en UTC, on compare le même."""
    return datetime.fromtimestamp(horodatage, timezone.utc).isoformat(
        timespec="seconds"
    )


def _bornes(noeud: ast.stmt, lignes: list[str]) -> range:
    """
    Les lignes d'un nœud, bandeau de commentaires compris.

    Retirer la seule classe laisserait derrière elle son titre en commentaire
    et ses lignes vides : ajouter une scène décalerait alors la tranche de ses
    voisines, et les périmerait — exactement ce qu'on cherche à éviter.
    """
    decorations = getattr(noeud, "decorator_list", [])
    debut = min([noeud.lineno, *(d.lineno for d in decorations)])
    fin = noeud.end_lineno or debut

    while debut > 1 and lignes[debut - 2].lstrip()[:1] in ("", "#"):
        debut -= 1
    while fin < len(lignes) and not lignes[fin].strip():
        fin += 1
    return range(debut, fin + 1)


def tranche(source: str, arbre: ast.Module, classe: str, scenes: set[str]) -> str:
    """
    Le code de ce fichier dont le rendu de `classe` dépend : le module entier,
    moins les autres scènes, moins la liste `ANIMATIONS`.
    """
    lignes = source.splitlines(keepends=True)
    retirees: set[int] = set()

    for noeud in arbre.body:
        if isinstance(noeud, ast.ClassDef):
            if noeud.name not in scenes or noeud.name == classe:
                continue
        elif not (
            isinstance(noeud, ast.Assign)
            and any(
                isinstance(cible, ast.Name) and cible.id == "ANIMATIONS"
                for cible in noeud.targets
            )
        ):
            continue
        retirees.update(_bornes(noeud, lignes))

    return "".join(
        ligne for rang, ligne in enumerate(lignes, 1) if rang not in retirees
    )


def memoire() -> tuple[dict[str, dict], dict]:
    """
    Ce que le manifeste précédent sait des empreintes. Sans lui, aucun
    changement ne peut être daté. Un manifeste absent ou illisible n'est pas
    une erreur : on repart des dates de fichiers.
    """
    try:
        ancien = json.loads((SORTIE / "manifeste.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}, {}

    connues: dict[str, dict] = {}
    for entree in [*ancien.get("animations", []), *ancien.get("prevues", [])]:
        source = entree.get("source") or {}
        if entree.get("id") and source.get("empreinte"):
            connues[entree["id"]] = source
    return connues, ancien.get("style") or {}


def datee(empreinte: str, connu: dict, chemin: Path) -> str:
    """La date de la dernière fois que cette empreinte-là a changé."""
    if connu.get("empreinte") == empreinte and connu.get("modifiee"):
        return connu["modifiee"]
    return _date(chemin.stat().st_mtime)


def declarations(
    chemin: Path,
    arbre: ast.Module,
    signaler: Callable[[str], None] | None = None,
) -> list[dict]:
    """
    Extrait la liste ANIMATIONS d'un fichier, sans l'exécuter.

    `signaler` décide de ce qu'une liste illisible provoque. Sans lui, on lève :
    c'est le contrat qu'attend `rendre.py`, qui rend une scène nommée et n'a
    rien à faire d'un fichier qu'il ne comprend pas. Avec lui, le motif est
    remis à l'appelant et la liste revient vide — le parcours du manifeste doit
    atteindre les autres chapitres.
    """

    def refuser(motif: str) -> list[dict]:
        if signaler is None:
            raise SystemExit(f"{chemin}: {motif}")
        signaler(f"{chemin.name} : {motif}")
        return []

    for noeud in arbre.body:
        if not isinstance(noeud, ast.Assign):
            continue
        cibles = [c.id for c in noeud.targets if isinstance(c, ast.Name)]
        if "ANIMATIONS" not in cibles:
            continue
        try:
            valeur = ast.literal_eval(noeud.value)
        except (ValueError, TypeError, SyntaxError, MemoryError) as erreur:
            # « ... on line 9: <ast.Name object at 0x7f...> » : la moitié droite
            # est une adresse mémoire, elle change à chaque exécution et n'aide
            # personne. On garde la ligne, on jette le reste.
            motif = str(erreur).split(": <", 1)[0]
            return refuser(f"ANIMATIONS doit être une valeur littérale ({motif})")
        if not isinstance(valeur, list):
            return refuser("ANIMATIONS doit être une liste")
        return valeur
    return []


def verifier(declaration: dict, chemin: Path, classes: set[str]) -> list[str]:
    """
    Ce qui, dans une déclaration, la rend invalide. Ne lève jamais : le type de
    chaque champ est contrôlé avant d'en faire quoi que ce soit, parce qu'un
    `alt` écrit en nombre ferait tomber `len()` et emporterait tout le parcours.
    """
    ou = chemin.name
    if isinstance(declaration.get("id"), str) and declaration["id"]:
        ou = f"{ou} / {declaration['id']}"

    problemes = []
    for champ in CHAMPS_OBLIGATOIRES:
        valeur = declaration.get(champ)
        if not valeur:
            problemes.append(f"{ou} : champ « {champ} » manquant")
        elif not isinstance(valeur, str):
            problemes.append(
                f"{ou} : le champ « {champ} » doit être du texte, pas "
                f"{type(valeur).__name__}"
            )
    alt = declaration.get("alt")
    if isinstance(alt, str) and alt and len(alt) < LONGUEUR_ALT_MINIMALE:
        problemes.append(
            f"{ou} : la description alternative fait {len(alt)} caractères, il "
            f"en faut au moins {LONGUEUR_ALT_MINIMALE}. Elle doit dire ce que "
            f"l'animation montre, pas la nommer."
        )
    scene = declaration.get("scene")
    if isinstance(scene, str) and scene and scene not in classes:
        problemes.append(
            f"{ou} : la scène « {scene} » est déclarée, mais aucune classe de "
            f"ce nom n'existe dans le fichier."
        )
    return problemes


def perimee(identifiant: str, source: dict, style: dict) -> dict | None:
    """
    Le rendu est-il plus vieux que ce dont il dépend ? Deux causes, nommées
    séparément : la scène elle-même, ou le style commun — qui les périme toutes
    d'un coup et n'est le fait d'aucun chapitre.
    """
    rendu = source.get("rendu")
    if not rendu:
        return None
    date_rendu = datetime.fromisoformat(rendu)

    causes = [
        ("sa source", datetime.fromisoformat(source["modifiee"])),
        ("le style commun", datetime.fromisoformat(style["modifiee"])),
    ]
    retenues = [(nom, quand) for nom, quand in causes if quand > date_rendu]
    if not retenues:
        return None

    # Quand les deux ont bougé, on nomme la scène et on date la scène : c'est
    # la seule des deux sur laquelle quelqu'un puisse agir.
    nom, quand = retenues[0]
    return {
        "id": identifiant,
        "cause": nom,
        "source": quand.isoformat(timespec="seconds"),
        "rendu": date_rendu.isoformat(timespec="seconds"),
    }


def relatif(chemin: Path) -> str:
    return chemin.relative_to(SCENES).as_posix()


# ── Le parcours ───────────────────────────────────────────────────────
#
# CINQ AGENTS ÉCRIVENT UN CHAPITRE CHACUN, et chacun lance le vérificateur pour
# le sien. Le parcours doit donc atteindre tous les fichiers : une déclaration
# fautive dans un chapitre ne peut pas empêcher les quatre autres d'être
# vérifiés. C'est arrivé — un fichier du chapitre 5 a bloqué la vérification du
# chapitre 4, qui n'y était pour rien.
#
# RIEN NE LÈVE PENDANT LE PARCOURS. Les fautes sont rangées sous leur chapitre au
# fur et à mesure, imprimées une fois à la fin, groupées ; la sortie est non
# nulle dès qu'il y en a une.


def chapitre_de(fichier: Path) -> str:
    """
    Le dossier de premier niveau sous `scenes/` : c'est le chapitre, et c'est
    par là que le relevé est groupé. Un agent y lit sa section et laisse les
    autres à leurs auteurs.
    """
    parties = fichier.relative_to(SCENES).parts
    return parties[0] if len(parties) > 1 else "(hors chapitre)"


@dataclass
class Recolte:
    """Ce qu'un parcours des scènes ramène, fautes comprises."""

    rendues: list[dict] = field(default_factory=list)
    prevues: list[dict] = field(default_factory=list)
    perimees: list[dict] = field(default_factory=list)
    problemes: dict[str, list[str]] = field(default_factory=dict)
    vus: set[str] = field(default_factory=set)

    def signaler(self, chapitre: str, probleme: str) -> None:
        self.problemes.setdefault(chapitre, []).append(probleme)


def analyser(
    fichier: Path,
    recolte: Recolte,
    connues: dict[str, dict],
    style: dict,
    style_source: bytes,
) -> None:
    """
    Un fichier de scènes, de son texte aux entrées du manifeste.

    Une déclaration à qui il manque un champ obligatoire est signalée puis
    abandonnée — il n'y a pas d'entrée à en tirer — mais ses voisines du même
    fichier sont traitées, et les autres fichiers aussi.
    """
    chapitre = chapitre_de(fichier)

    try:
        texte = fichier.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as erreur:
        recolte.signaler(chapitre, f"{fichier.name} : illisible ({erreur})")
        return

    try:
        arbre = ast.parse(texte, filename=str(fichier))
    except SyntaxError as erreur:
        recolte.signaler(
            chapitre, f"{fichier.name}:{erreur.lineno} : {erreur.msg}"
        )
        return

    classes = {n.name for n in arbre.body if isinstance(n, ast.ClassDef)}
    declarees = declarations(
        fichier, arbre, signaler=lambda motif: recolte.signaler(chapitre, motif)
    )
    scenes = {
        d["scene"]
        for d in declarees
        if isinstance(d, dict) and isinstance(d.get("scene"), str)
    } & classes

    for declaration in declarees:
        if not isinstance(declaration, dict):
            recolte.signaler(
                chapitre,
                f"{fichier.name} : ANIMATIONS contient {declaration!r}, qui "
                f"n'est pas une déclaration.",
            )
            continue

        for probleme in verifier(declaration, fichier, classes):
            recolte.signaler(chapitre, probleme)

        identifiant = declaration.get("id")
        if not identifiant or not isinstance(identifiant, str):
            continue  # déjà signalé par verifier()
        if identifiant in recolte.vus:
            recolte.signaler(
                chapitre, f"{fichier.name} : identifiant en double — {identifiant}"
            )
            continue
        recolte.vus.add(identifiant)

        # Signalée, elle l'est déjà. Il lui manque de quoi faire une entrée :
        # on passe à la suivante plutôt que de tomber sur une clé absente au
        # milieu du parcours — c'était la panne.
        if not all(
            isinstance(declaration.get(champ), str) and declaration[champ]
            for champ in CHAMPS_OBLIGATOIRES
        ):
            continue

        empreinte = _condense(
            tranche(texte, arbre, declaration["scene"], scenes).encode(),
            style_source,
        )
        source = {
            "fichier": relatif(fichier),
            "scene": declaration["scene"],
            "empreinte": empreinte,
            "modifiee": datee(empreinte, connues.get(identifiant, {}), fichier),
        }

        sidecar = SORTIE / identifiant / "rendu.json"
        rendu: dict | None = None
        if sidecar.exists():
            try:
                charge = json.loads(sidecar.read_text(encoding="utf-8"))
            except (OSError, ValueError) as erreur:
                recolte.signaler(
                    chapitre, f"{identifiant} : rendu.json illisible ({erreur})"
                )
            else:
                if isinstance(charge, dict):
                    rendu = charge
                else:
                    recolte.signaler(
                        chapitre,
                        f"{identifiant} : rendu.json ne porte pas un objet",
                    )

        if rendu is None:
            recolte.prevues.append(
                {
                    "id": identifiant,
                    "titre": declaration["titre"],
                    "alt": declaration["alt"],
                    "duree": declaration.get("duree"),
                    "notions": declaration.get("notions"),
                    "source": source,
                }
            )
            continue

        fusionnee = {**source, **rendu.get("source", {})}
        recolte.rendues.append(
            {
                "id": identifiant,
                "titre": declaration["titre"],
                "alt": declaration["alt"],
                "notions": declaration.get("notions"),
                "chapitres": declaration.get("chapitres"),
                "licence": declaration.get("licence", "CC BY-SA 4.0, N7-IA"),
                **rendu,
                "source": fusionnee,
            }
        )
        try:
            constat = perimee(identifiant, fusionnee, style)
        except (KeyError, TypeError, ValueError) as erreur:
            recolte.signaler(
                chapitre, f"{identifiant} : dates illisibles ({erreur})"
            )
            constat = None
        if constat:
            recolte.perimees.append(constat)


def construire() -> tuple[dict, list[dict], dict[str, list[str]]]:
    """
    Le manifeste, les rendus périmés, et les déclarations invalides par
    chapitre. Ce qui échapperait aux contrôles nommés est rattrapé ici et rangé
    sous son chapitre : un fichier fautif n'en bloque aucun autre, quelle que
    soit sa faute.
    """
    fichiers = sorted(p for p in SCENES.rglob("*.py") if p.name != STYLE.name)
    connues, style_connu = memoire()

    style_source = STYLE.read_bytes()
    empreinte_style = _condense(style_source)
    style = {
        "fichier": relatif(STYLE),
        "empreinte": empreinte_style,
        "modifiee": datee(empreinte_style, style_connu, STYLE),
    }

    recolte = Recolte()
    for fichier in fichiers:
        try:
            analyser(fichier, recolte, connues, style, style_source)
        except Exception as erreur:  # noqa: BLE001
            recolte.signaler(
                chapitre_de(fichier),
                f"{fichier.name} : {type(erreur).__name__} — {erreur}",
            )

    # Les scènes qu'on peut corriger d'abord, le style commun ensuite.
    recolte.perimees.sort(key=lambda p: (p["cause"] != "sa source", p["id"]))

    return (
        {
            "version": 1,
            "genere": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "style": style,
            "animations": recolte.rendues,
            "prevues": recolte.prevues,
        },
        recolte.perimees,
        recolte.problemes,
    )


def _bref(horodatage: str) -> str:
    return horodatage.replace("+00:00", "Z")


def relever(perimees: list[dict], total: int) -> None:
    """
    Le relevé des rendus périmés. Ce n'est pas une erreur, et la sortie reste
    à zéro : un agent qui écrit du contenu ne doit pas être arrêté par un
    rendu qu'il n'a pas le droit de refaire.
    """
    if not perimees:
        print(f"  ✓ {total} rendu(s), aucun périmé")
        return

    largeur = max(len(p["id"]) for p in perimees)
    print(f"  ! {len(perimees)} rendu(s) périmé(s) sur {total} :")
    for p in perimees:
        print(
            f"      {p['id']:<{largeur}}  source {_bref(p['source'])}"
            f"  >  rendu {_bref(p['rendu'])}   ({p['cause']})"
        )
    print(
        "    Un rendu périmé ne casse aucune page : elle sert la vidéo qu'elle\n"
        "    a. NE RENDEZ PAS. Signalez-le ; la fusion rend une fois pour toutes."
    )


def rapporter(problemes: dict[str, list[str]]) -> None:
    """
    Les déclarations invalides, groupées par chapitre.

    Le relevé n'est pas une liste à plat : cinq chapitres s'écrivent en
    parallèle, et l'agent qui lance la vérification doit pouvoir lire les
    siennes sans démêler celles des autres. Un chapitre fautif ne dit rien de
    la validité des quatre autres, et le relevé le montre.
    """
    total = sum(len(p) for p in problemes.values())
    print(
        f"  ✗ {total} déclaration(s) invalide(s), "
        f"{len(problemes)} chapitre(s) concerné(s) :",
        file=sys.stderr,
    )
    for chapitre in sorted(problemes):
        print(f"      {chapitre}", file=sys.stderr)
        for probleme in problemes[chapitre]:
            print(f"        · {probleme}", file=sys.stderr)
    print(
        "    Les chapitres absents de cette liste ont été vérifiés et sont "
        "valides.",
        file=sys.stderr,
    )


def main() -> None:
    _console_utf8()
    analyseur = argparse.ArgumentParser(description=__doc__)
    analyseur.add_argument(
        "--verifier",
        action="store_true",
        help="ne rien écrire ; sortir en erreur si une déclaration est invalide",
    )
    arguments = analyseur.parse_args()

    manifeste, perimees, problemes = construire()

    if arguments.verifier:
        if problemes:
            # Le compte des valides d'abord : l'agent dont le chapitre est
            # propre doit voir que le sien a bien été parcouru, même quand un
            # autre est fautif.
            print(
                f"  ✗ {len(manifeste['animations'])} rendue(s) et "
                f"{len(manifeste['prevues'])} prévue(s) valides, mais :",
                flush=True,
            )
            rapporter(problemes)
        else:
            print(
                f"  ✓ {len(manifeste['animations'])} rendue(s), "
                f"{len(manifeste['prevues'])} prévue(s), aucune erreur"
            )
        relever(perimees, len(manifeste["animations"]))
        raise SystemExit(1 if problemes else 0)

    if problemes:
        rapporter(problemes)

    SORTIE.mkdir(parents=True, exist_ok=True)
    cible = SORTIE / "manifeste.json"
    cible.write_text(
        json.dumps(manifeste, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"  ✓ {cible.relative_to(RACINE.parent)}, "
        f"{len(manifeste['animations'])} rendue(s), "
        f"{len(manifeste['prevues'])} prévue(s)"
    )
    if perimees:
        print(
            f"  ! {len(perimees)} rendu(s) périmé(s), "
            f"voir « python animations/manifeste.py --verifier »"
        )

    # Le manifeste est écrit — les déclarations valides, elles, n'ont rien fait
    # de mal — mais la sortie reste non nulle : une déclaration invalide ne
    # devient jamais un simple avertissement.
    if problemes:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
