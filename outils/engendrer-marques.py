#!/usr/bin/env python3
"""Refabrique src/composants/base/MarquesCanaux.tsx.

Les marques des services (Discord, WhatsApp, Telegram, Instagram, GitHub) ne se
dessinent pas : elles se recopient. Ce programme télécharge les fichiers que
Simple Icons publie dans le domaine public (CC0 1.0) — chacun repris de la page
de marque du service — et écrit le composant avec les tracés tels quels.

Aucune coordonnée n'est saisie à la main ici ni dans le fichier produit.

    python3 outils/engendrer-marques.py
"""

import json
import pathlib
import re
import urllib.request

VERSION = "simple-icons@13"
BASE = f"https://cdn.jsdelivr.net/npm/{VERSION}"

CIBLE = pathlib.Path(__file__).resolve().parents[1] / (
    "src/composants/base/MarquesCanaux.tsx"
)

# Le canal tel que l'application le nomme, le titre tel que Simple Icons le
# nomme, et la page de marque d'où le service publie son signe.
CANAUX = [
    ("discord", "Discord", "https://discord.com/branding"),
    (
        "whatsapp",
        "WhatsApp",
        "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand",
    ),
    ("telegram", "Telegram", "https://telegram.org/tour/screenshots"),
    ("instagram", "Instagram", "https://about.meta.com/brand/resources/instagram"),
    ("github", "GitHub", "https://github.com/logos"),
]


def lire(adresse: str) -> str:
    with urllib.request.urlopen(adresse, timeout=30) as reponse:
        return reponse.read().decode("utf-8")


def rassembler():
    donnees = json.loads(lire(f"{BASE}/_data/simple-icons.json"))
    icones = donnees["icons"] if isinstance(donnees, dict) else donnees
    couleurs = {i["title"]: i["hex"] for i in icones}

    lot = []
    for cle, titre, origine in CANAUX:
        fichier = lire(f"{BASE}/icons/{cle}.svg")
        tracés = re.findall(r'<path d="([^"]+)"', fichier)
        if len(tracés) != 1:
            raise SystemExit(f"{cle} : {len(tracés)} tracés, un seul attendu")
        boite = re.search(r'viewBox="([^"]+)"', fichier).group(1)
        if boite != "0 0 24 24":
            raise SystemExit(f"{cle} : cadre {boite}, 0 0 24 24 attendu")
        lot.append((cle, titre, origine, tracés[0], couleurs[titre]))
    return lot


ENTETE = '''// ─────────────────────────────────────────────────────────────────────────────
// Les marques des services où l'on peut joindre quelqu'un.
//
// Même règle que pour Moodle dans la boîte à outils : la marque d'autrui se
// montre telle qu'elle est, on ne la redessine pas et on ne la recolore pas.
// Les tracés ci-dessous sont recopiés par programme depuis les fichiers
// officiels rassemblés par Simple Icons (domaine public, CC0 1.0), chacun issu
// de la page de marque du service — l'adresse est notée au-dessus du tracé.
// Aucune coordonnée n'a été saisie à la main, et aucune n'a été retouchée : le
// fichier se refabrique avec outils/engendrer-marques.py.
//
// La couleur est celle que le service publie. On ne l'emploie qu'au repos, à
// petite taille, à côté du nom du service écrit en toutes lettres : la marque
// sert à reconnaître, pas à décorer.
//
// Le courriel n'a pas de marque — il n'appartient à personne. Il garde
// l'enveloppe du jeu d'icônes de la maison.
// ─────────────────────────────────────────────────────────────────────────────

import type { Canal } from "@/donnees/types";
import { Icone } from "./Icone";

/** La couleur publiée par chaque service, pour la marque au repos. */
export const COULEUR_CANAL: Record<Canal, string> = {
'''

CORPS = '''export function MarqueDuCanal({
  canal,
  className,
}: {
  canal: Canal;
  className?: string;
}) {
  if (canal === "mail") {
    return <Icone nom="enveloppe" className={className} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={COULEUR_CANAL[canal]}
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRACE[canal]} />
    </svg>
  );
}
'''


def main() -> None:
    lot = rassembler()

    texte = ENTETE
    for cle, _titre, _origine, _tracé, couleur in lot:
        texte += f'  {cle}: "#{couleur}",\n'
    texte += '  mail: "currentColor",\n};\n\n'

    texte += 'const TRACE: Record<Exclude<Canal, "mail">, string> = {\n'
    for cle, titre, origine, tracé, _couleur in lot:
        texte += f"  // {titre} — {origine}\n"
        texte += f'  {cle}:\n    "{tracé}",\n'
    texte += "};\n\n"

    texte += CORPS
    CIBLE.write_text(texte)
    print(f"écrit {CIBLE} ({CIBLE.stat().st_size} octets)")


if __name__ == "__main__":
    main()
