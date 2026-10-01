#!/usr/bin/env python3
"""
Rend les scènes Manim et dépose leurs fichiers dans `public/animations/`.

CE SCRIPT A BESOIN DE LA PILE COMPLÈTE : Python, Manim, une distribution LaTeX
(nos scènes utilisent MathTex) et ffmpeg. Les métadonnées se lisent avec PyAV,
que Manim installe déjà. C'est la raison d'être de la
séparation avec `manifeste.py` : personne n'a besoin de tout cela pour
travailler sur les écrans.

    python animations/rendre.py                        ce qui a changé
    python animations/rendre.py descente-gradient-2d   une animation
    python animations/rendre.py --tout                 même l'inchangé
    python animations/rendre.py --profil rapide        pour itérer

L'EMPREINTE décide de ce qui est refait. C'est le hachage des ENTRÉES : le
fichier de scène, le fichier de style, les versions de Manim, PyAV et NumPy, le
profil de rendu, et la police embarquée. Jamais de la sortie, un mp4 n'est pas
reproductible à l'octet, le muxeur y réinjecte des étiquettes.

Elle apparaît dans le nom du fichier servi :

    public/animations/descente-gradient-2d/a1b2c3d4e5f6.mp4

Deux conséquences, et ce sont les deux raisons de faire ainsi :
  - un rendu inchangé n'est pas refait, ce qui compte quand une scène prend
    plusieurs minutes de processeur ;
  - le fichier peut être servi en cache immuable, puisqu'un contenu différent
    porte forcément un nom différent. Aucune purge de cache, jamais.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from manifeste import SCENES, SORTIE, declarations  # noqa: E402


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
STYLE = SCENES / "n7ia.py"

# UN DOSSIER PAR PROCESSUS. Manim range son cache LaTeX dans `<media_dir>/Tex`
# et y écrit des .tex, .dvi et .log sous des noms qui ne dépendent que du
# contenu de la formule. Deux rendus lancés en parallèle se disputaient donc
# les mêmes fichiers, et le second mourait sur un « fichier utilisé par un
# autre processus » : impossible de rendre une scène pendant qu'une autre
# tournait. Le numéro de processus suffit à les séparer, et le dossier est
# effacé à la sortie puisque tout ce qui compte est déjà copié dans public/.
TEMPORAIRE = RACINE / ".rendus" / f"p{os.getpid()}"

# La police de l'identité. Un seul fichier pour toute l'application : celui que
# `src/app/layout.tsx` charge déjà. Le dupliquer ici serait le laisser dériver.
POLICE = RACINE.parent / "src" / "fonts" / "Archivo.ttf"

# La racine des URL servies. Le jour où les fichiers passent sur un stockage
# objet, cette variable change, et rien d'autre : le composant lit « src » tel
# quel, il ne le reconstruit jamais.
BASE = os.environ.get("BASE_ANIMATIONS", "/animations")

# ── Les profils ─────────────────────────────────────────────────────────────
#
# On rend PLUS GRAND que ce qu'on sert, puis on réduit. Une animation Manim est
# faite de traits fins et de texte net : réduire un rendu 4K vers 1080p donne un
# lissage que le rendu direct en 1080p ne donne pas, et cela se voit sur les
# indices d'une formule.
#
# « encodage » est versionné : changer la recette change l'empreinte, et le
# champ « profil » du manifeste dit pourquoi.

PROFILS = {
    "qualite": {
        "rendu": "3840x2160",
        "encodage": "x264-crf18-tune-animation-v1",
        "resolution": "3840,2160",
        "sortie": "1920:1080",
        "crf": "18",
    },
    "rapide": {
        "rendu": "1920x1080",
        "encodage": "x264-crf20-tune-animation-rapide-v1",
        "resolution": "1920,1080",
        "sortie": "1920:1080",
        "crf": "20",
    },
}

CADENCE = 30

# Les trois profils H.264 que x264 produit en pratique, en identifiants RFC 6381.
PROFILS_H264 = {
    "High": "6400",
    "Main": "4d40",
    "Baseline": "42e0",
    "Constrained Baseline": "42e0",
}


def _sortie(commande: list[str]) -> str:
    return subprocess.run(
        commande, capture_output=True, text=True, check=True
    ).stdout


def versions() -> dict[str, str]:
    """Les versions qui entrent dans l'empreinte. Lues, jamais devinées."""
    trouvees = {}
    for paquet in ("manim", "av", "numpy"):
        trouvees[paquet] = _sortie(
            [
                sys.executable,
                "-c",
                "import importlib.metadata as m; "
                f"print(m.version({paquet!r}))",
            ]
        ).strip()
    return trouvees


def verifier_police() -> None:
    """
    Manim retombe SILENCIEUSEMENT sur une police système quand la sienne
    manque : le rendu ne ressemble alors plus à l'application, et personne ne
    s'en aperçoit avant de comparer deux animations côte à côte.

    CE CONTRÔLE NE FAIT QUE VÉRIFIER LE FICHIER. L'enregistrement se fait dans
    `scenes/n7ia.py`, importé par le processus Manim, et c'est le seul endroit
    où il vaut. Cette fonction a longtemps appelé `register_font` ici même,
    puis constaté que Pango voyait la police — dans CE processus, alors que
    Manim tourne dans un autre. Elle se déclarait donc satisfaite pendant que
    les trente animations sortaient en police de repli. Un contrôle qui mesure
    la mauvaise chose est pire que pas de contrôle : il rassure.
    """
    if not POLICE.exists():
        raise SystemExit(
            f"  ✗ police introuvable : {POLICE}\n"
            f"    Sans elle, Manim rend avec une police système et le résultat "
            f"ne ressemble plus à l'application."
        )


def empreinte(fichier: Path, profil: dict, vers: dict[str, str]) -> str:
    condense = hashlib.sha256()
    condense.update(fichier.read_bytes())
    condense.update(STYLE.read_bytes())
    condense.update(POLICE.read_bytes())
    for paquet in sorted(vers):
        condense.update(f"{paquet}={vers[paquet]}".encode())
    condense.update(profil["rendu"].encode())
    condense.update(profil["encodage"].encode())
    return condense.hexdigest()[:12]


def mime_h264(flux: dict) -> str:
    """
    La chaîne « type » complète de la balise source.

    Un navigateur qui ne reconnaît pas une chaîne de codecs IGNORE LA SOURCE
    ENTIÈRE, sans erreur ni message. Dans le doute, on omet le paramètre : une
    source sans « codecs » est lue, une source avec un « codecs » faux ne l'est
    pas.
    """
    if flux.get("codec_name") != "h264":
        return "video/mp4"
    prefixe = PROFILS_H264.get(str(flux.get("profile")))
    niveau = flux.get("level")
    if not prefixe or not isinstance(niveau, int) or niveau <= 0:
        return "video/mp4"
    return f'video/mp4; codecs="avc1.{prefixe}{niveau:02x}"'


# Les profils H.264 tels que PyAV les nomme, vers ceux de la table ffprobe.
# PyAV expose le profil sous forme de chaîne courte ; on se ramène au libellé
# que `mime_h264` connaît déjà, pour ne pas dupliquer la table.
_PROFILS_PYAV = {
    "Constrained Baseline": "Constrained Baseline",
    "Baseline": "Baseline",
    "Main": "Main",
    "High": "High",
    "High 10": "High 10",
}


def sonder(fichier: Path) -> dict:
    """
    Durée, dimensions, cadence et chaîne de type MIME complète.

    Lu par PyAV, pas par le binaire ffprobe. PyAV est déjà une dépendance de
    Manim : s'en servir ici retire un exécutable de plus à installer, et c'est
    un de moins qui manque sur la machine de quelqu'un six mois plus tard.
    """
    import av  # import local : la bibliothèque est lourde à charger

    with av.open(str(fichier)) as contenant:
        flux = contenant.streams.video[0]
        cadence = flux.average_rate or flux.base_rate
        duree = None
        if contenant.duration is not None:
            duree = contenant.duration / av.time_base
        elif flux.duration is not None and flux.time_base is not None:
            duree = float(flux.duration * flux.time_base)
        if duree is None:
            raise SystemExit(f"  ✗ durée illisible pour {fichier.name}")

        # `level` vaut par exemple 40 pour le niveau 4.0 : c'est déjà la
        # convention entière qu'attend mime_h264.
        contexte = flux.codec_context
        decrit = {
            "codec_name": flux.codec_context.name,
            "profile": _PROFILS_PYAV.get(
                str(getattr(contexte, "profile", "")), str(getattr(contexte, "profile", ""))
            ),
            "level": int(getattr(contexte, "level", 0) or 0),
        }
        return {
            "largeur": int(flux.width),
            "hauteur": int(flux.height),
            "cadence": round(float(cadence)),
            "duree": round(float(duree), 2),
            "mime": mime_h264(decrit),
        }


def rendre_une(
    fichier: Path,
    declaration: dict,
    profil: dict,
    vers: dict[str, str],
    force: bool,
) -> bool:
    identifiant = declaration["id"]
    marque = empreinte(fichier, profil, vers)
    dossier = SORTIE / identifiant
    sidecar = dossier / "rendu.json"

    if not force and sidecar.exists():
        connu = json.loads(sidecar.read_text(encoding="utf-8"))
        if connu.get("empreinte") == marque and (dossier / f"{marque}.mp4").exists():
            print(f"  = {identifiant}, inchangée")
            return False

    print(
        f"  → {identifiant}, rendu de {declaration['scene']} "
        f"en {profil['rendu']}…"
    )
    TEMPORAIRE.mkdir(parents=True, exist_ok=True)

    # Le déterminisme, en trois variables. PYTHONHASHSEED fixe l'ordre des
    # ensembles ; les deux SOURCE_DATE empêchent LaTeX d'écrire l'heure dans le
    # PDF intermédiaire, ce qui suffirait à faire diverger deux rendus.
    # PYTHONPATH porte `animations/`, sans quoi le « from scenes.n7ia import »
    # de chaque scène échoue : Manim charge le fichier par son chemin, et ni le
    # dossier de la scène ni le répertoire courant n'entrent dans sys.path.
    env = {
        **os.environ,
        "PYTHONHASHSEED": "0",
        "SOURCE_DATE_EPOCH": "0",
        "FORCE_SOURCE_DATE": "1",
        "PYTHONPATH": os.pathsep.join(
            [str(RACINE), *(v for v in (os.environ.get("PYTHONPATH"),) if v)]
        ),
    }

    subprocess.run(
        [
            "manim", "render",
            # Le cache interne de Manim a renvoyé des rendus périmés jusqu'en
            # 0.20.1 inclus (pixel_array exclu de sa clé). Notre empreinte est
            # la seule source de vérité ; ce cache-là ne sert à rien ici.
            "--disable_caching",
            "--resolution", profil["resolution"],
            "--fps", str(CADENCE),
            "--format", "mp4",
            "--media_dir", str(TEMPORAIRE),
            str(fichier), declaration["scene"],
        ],
        check=True,
        cwd=RACINE,
        env=env,
    )

    produits = sorted(TEMPORAIRE.rglob(f"{declaration['scene']}.mp4"))
    if not produits:
        raise SystemExit(f"  ✗ {identifiant} : aucun mp4 produit par Manim")
    brut = produits[-1]

    dossier.mkdir(parents=True, exist_ok=True)
    video = dossier / f"{marque}.mp4"

    # La recette. « -tune animation » est fait pour les aplats et les traits
    # nets ; « -g CADENCE » pose une image-clé par seconde, ce qui rend honnête
    # le pas image par image du lecteur ; « +faststart » permet de commencer à
    # lire avant la fin du téléchargement ; « yuv420p » est la seule
    # combinaison que Safari accepte sans discuter.
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(brut),
            "-vf", f"scale={profil['sortie']}:flags=lanczos",
            "-c:v", "libx264",
            "-preset", "slow",
            "-crf", profil["crf"],
            "-tune", "animation",
            "-g", str(CADENCE),
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-map_metadata", "-1",
            "-an",
            str(video),
        ],
        check=True, capture_output=True,
    )

    mesures = sonder(video)

    # Le poster. Pas l'image zéro, chez Manim elle est presque toujours vide,
    # ni la dernière, qui est parfois un fondu. Aux deux tiers, la scène est
    # construite et l'étudiant voit de quoi il s'agit.
    poster = dossier / f"{marque}.webp"
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-ss", f"{max(0.5, mesures['duree'] * 0.66):.2f}",
            "-i", str(video),
            "-frames:v", "1", "-q:v", "80",
            str(poster),
        ],
        check=True, capture_output=True,
    )

    sidecar.write_text(
        json.dumps(
            {
                "empreinte": marque,
                "duree": mesures["duree"],
                "largeur": mesures["largeur"],
                "hauteur": mesures["hauteur"],
                "cadence": mesures["cadence"],
                "poster": f"{BASE}/{identifiant}/{marque}.webp",
                "rendus": [
                    {
                        "format": "mp4",
                        "src": f"{BASE}/{identifiant}/{marque}.mp4",
                        "octets": video.stat().st_size,
                        "mime": mesures["mime"],
                    }
                ],
                "profil": {
                    "rendu": profil["rendu"],
                    "encodage": profil["encodage"],
                },
                "source": {
                    "manim": vers["manim"],
                    "rendu": datetime.now(timezone.utc).isoformat(
                        timespec="seconds"
                    ),
                },
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    # Les anciens rendus de CETTE animation : leur empreinte a changé, plus rien
    # ne les référence.
    for vieux in dossier.iterdir():
        if vieux.name.startswith(marque) or vieux.name == "rendu.json":
            continue
        vieux.unlink()

    taille = video.stat().st_size / 1_048_576
    print(
        f"  ✓ {identifiant}, {mesures['duree']} s, {taille:.1f} Mo, "
        f"{mesures['mime']}"
    )
    return True


def main() -> None:
    _console_utf8()
    analyseur = argparse.ArgumentParser(description=__doc__)
    analyseur.add_argument(
        "identifiants", nargs="*", help="ne rendre que celles-ci"
    )
    analyseur.add_argument(
        "--tout", action="store_true", help="ignorer les empreintes"
    )
    analyseur.add_argument(
        "--profil",
        choices=sorted(PROFILS),
        default="qualite",
        help="qualite : rendu 4K réduit en 1080p. rapide : 1080p direct.",
    )
    arguments = analyseur.parse_args()
    profil = PROFILS[arguments.profil]

    for outil in ("manim", "ffmpeg"):
        if shutil.which(outil) is None:
            raise SystemExit(
                f"  ✗ {outil} introuvable. Voir animations/README.md.\n"
                f"    Pour travailler sur les écrans, « python "
                f"animations/manifeste.py » suffit et n'a besoin de rien."
            )

    verifier_police()
    vers = versions()
    print(
        f"  Manim {vers['manim']} · PyAV {vers['av']} · "
        f"profil {arguments.profil}"
    )

    faits = 0
    try:
        for fichier in sorted(
            p for p in SCENES.rglob("*.py") if p.name != "n7ia.py"
        ):
            # `declarations` prend l'arbre depuis que `manifeste.py` le
            # construit une seule fois par fichier : la signature a changé là
            # sans changer ici, et plus aucun rendu ne partait.
            arbre = ast.parse(
                fichier.read_text(encoding="utf-8"), filename=str(fichier)
            )
            for declaration in declarations(fichier, arbre):
                if (
                    arguments.identifiants
                    and declaration["id"] not in arguments.identifiants
                ):
                    continue
                if rendre_une(fichier, declaration, profil, vers, arguments.tout):
                    faits += 1
    finally:
        # Un rendu qui échoue laissait son dossier de processus derrière lui,
        # et ils se seraient accumulés au fil des essais.
        if TEMPORAIRE.exists():
            shutil.rmtree(TEMPORAIRE, ignore_errors=True)

    print(f"\n  {faits} animation(s) rendue(s). Mise à jour du manifeste…")
    subprocess.run([sys.executable, str(RACINE / "manifeste.py")], check=True)


if __name__ == "__main__":
    main()
