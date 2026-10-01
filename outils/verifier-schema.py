#!/usr/bin/env python3
"""Vérifie le schéma de la base sans toucher à Cloudflare.

D1 est du SQLite géré : le fichier de migration s'applique donc tel quel à une
base SQLite en mémoire, et tout ce qui compte se vérifie ici, gratuitement et
hors ligne — la syntaxe, les contraintes, les cascades, et la requête que la
vitrine fera à chaque visite.

Ce que ce programme ne vérifie pas, et qu'il ne faut pas lui faire dire : le
temps de calcul réel chez Cloudflare, qui ne se mesure que dans les journaux
d'une vraie mise en ligne.

    python3 outils/verifier-schema.py
"""

import pathlib
import sqlite3
import sys

# Tous les fichiers de `migrations/`, dans l'ordre de leur numéro : c'est ce que
# `wrangler d1 migrations apply` fait en ligne, et une vérification qui ne
# lirait que le socle ne verrait pas une colonne ajoutée par la suite.
MIGRATIONS = sorted(
    (pathlib.Path(__file__).resolve().parent.parent / "migrations").glob("[0-9]*.sql")
)

essais = []


def essai(nom):
    def decorateur(f):
        essais.append((nom, f))
        return f

    return decorateur


def base():
    b = sqlite3.connect(":memory:")
    b.execute("PRAGMA foreign_keys = ON")
    for migration in MIGRATIONS:
        b.executescript(migration.read_text())
    return b


def une_personne(b, id="p1", courriel="a@toulouseia.fr"):
    b.execute(
        "INSERT INTO personnes (id, nom, courriel, cree_le, vu_le)"
        " VALUES (?, ?, ?, '2026-09-15T08:00:00Z', '2026-09-15T08:00:00Z')",
        (id, "Quelqu'un", courriel),
    )


def un_projet(b, id="pr1", slug="sillage", categorie="open", depot="toulouseia/sillage"):
    b.execute(
        "INSERT INTO projets (id, slug, nom, resume, presentation, etat, categorie,"
        " pole, porteur_id, depot, debut, maj)"
        " VALUES (?, ?, 'Sillage', 'Une ligne', 'Deux phrases.', 'chantier', ?,"
        " 'Agentic', 'p1', ?, '2026-09-01', '2026-09-15')",
        (id, slug, categorie, depot),
    )


def doit_echouer(f, attendu):
    try:
        f()
    except sqlite3.IntegrityError as e:
        assert attendu in str(e), f"erreur inattendue : {e}"
        return
    raise AssertionError("l'écriture aurait dû être refusée")


@essai("le schéma s'applique et crée six tables")
def _():
    b = base()
    tables = {
        r[0]
        for r in b.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
    }
    assert tables == {
        "personnes",
        "sessions",
        "projets",
        "depots_suivis",
        "journal",
        "membres",
    }, tables


@essai("un projet ouvert sans dépôt public est refusé")
def _():
    b = base()
    une_personne(b)
    doit_echouer(lambda: un_projet(b, depot=None), "CHECK")


@essai("un projet à but lucratif n'a pas besoin de dépôt")
def _():
    b = base()
    une_personne(b)
    un_projet(b, categorie="business", depot=None)


@essai("un avancement qui n'existe pas est refusé")
def _():
    b = base()
    une_personne(b)
    doit_echouer(
        lambda: b.execute(
            "INSERT INTO projets (id, slug, nom, resume, presentation, etat,"
            " categorie, pole, porteur_id, depot, debut, maj)"
            " VALUES ('x', 'x', 'X', 'r', 'p', 'termine', 'open', 'Agentic',"
            " 'p1', 'a/b', '2026-09-01', '2026-09-15')"
        ),
        "CHECK",
    )


@essai("deux projets ne peuvent pas porter le même nom court")
def _():
    b = base()
    une_personne(b)
    un_projet(b)
    doit_echouer(lambda: un_projet(b, id="pr2"), "UNIQUE")


@essai("un projet sans porteur connu est refusé")
def _():
    b = base()
    doit_echouer(lambda: un_projet(b), "FOREIGN KEY")


@essai("un projet arrive en attente de relecture")
def _():
    b = base()
    une_personne(b)
    un_projet(b)
    (publication,) = b.execute("SELECT publication FROM projets").fetchone()
    assert publication == "attente", publication


@essai("supprimer une personne emporte ses sessions et ses projets")
def _():
    b = base()
    une_personne(b)
    un_projet(b)
    b.execute(
        "INSERT INTO sessions (jeton, personne_id, cree_le, expire_le)"
        " VALUES ('j1', 'p1', '2026-09-15T08:00:00Z', '2026-09-22T08:00:00Z')"
    )
    b.execute("DELETE FROM personnes WHERE id = 'p1'")
    assert b.execute("SELECT count(*) FROM sessions").fetchone()[0] == 0
    assert b.execute("SELECT count(*) FROM projets").fetchone()[0] == 0


@essai("supprimer le relecteur n'efface pas le projet qu'il a relu")
def _():
    b = base()
    une_personne(b)
    une_personne(b, id="p2", courriel="bureau@toulouseia.fr")
    un_projet(b)
    b.execute(
        "UPDATE projets SET publication='publie', relu_par='p2',"
        " relu_le='2026-09-16T10:00:00Z' WHERE id='pr1'"
    )
    b.execute("DELETE FROM personnes WHERE id = 'p2'")
    ligne = b.execute("SELECT publication, relu_par FROM projets").fetchone()
    assert ligne == ("publie", None), ligne


@essai("la vitrine ne lit que les projets publiés, les plus récents d'abord")
def _():
    b = base()
    une_personne(b)
    un_projet(b, id="pr1", slug="a", depot="x/a")
    un_projet(b, id="pr2", slug="b", depot="x/b")
    b.execute("UPDATE projets SET publication='publie' WHERE id='pr1'")
    b.execute("UPDATE projets SET maj='2026-09-16' WHERE id='pr1'")
    lus = b.execute(
        "SELECT slug FROM projets WHERE publication='publie' ORDER BY maj DESC"
    ).fetchall()
    assert lus == [("a",)], lus


@essai("la vitrine se lit sans parcourir toute la table")
def _():
    b = base()
    plan = b.execute(
        "EXPLAIN QUERY PLAN SELECT slug FROM projets"
        " WHERE publication='publie' ORDER BY maj DESC"
    ).fetchall()
    texte = " ".join(str(l[-1]) for l in plan)
    assert "projets_publies" in texte, texte
    assert "SCAN" not in texte, texte


@essai("une personne a toujours une liste de contacts, vide par défaut")
def _():
    b = base()
    une_personne(b)
    (contacts,) = b.execute("SELECT contacts FROM personnes WHERE id='p1'").fetchone()
    assert contacts == "[]", contacts
    doit_echouer(
        lambda: b.execute("UPDATE personnes SET contacts = NULL WHERE id='p1'"),
        "NOT NULL",
    )


@essai("un projet garde la clé de son image, ou rien")
def _():
    b = base()
    une_personne(b)
    # Un projet s'insère sans image : la colonne est nullable, et le mur retombe
    # alors sur le signe.
    un_projet(b)
    (image,) = b.execute("SELECT image FROM projets WHERE id='pr1'").fetchone()
    assert image is None, image
    # La base ne garde que la clé de l'objet R2, jamais les octets.
    b.execute("UPDATE projets SET image='projets/pr1/9f3c2a.png' WHERE id='pr1'")
    (image,) = b.execute("SELECT image FROM projets WHERE id='pr1'").fetchone()
    assert image == "projets/pr1/9f3c2a.png", image


@essai("un membre est un lien projet ↔ personne, sans doublon possible")
def _():
    b = base()
    une_personne(b)  # p1, le porteur
    une_personne(b, id="p2", courriel="membre@toulouseia.fr")
    un_projet(b)
    lier = lambda: b.execute(
        "INSERT INTO membres (projet_id, personne_id, ajoute_le)"
        " VALUES ('pr1', 'p2', '2026-09-30T10:00:00Z')"
    )
    lier()
    # La clé primaire double (projet_id, personne_id) interdit le doublon :
    # l'ajout est idempotent par construction.
    doit_echouer(lier, "UNIQUE")


@essai("supprimer un projet ou une personne efface le lien de membre, jamais l'inverse")
def _():
    b = base()
    une_personne(b)  # p1, le porteur
    une_personne(b, id="p2", courriel="membre@toulouseia.fr")
    un_projet(b)
    b.execute(
        "INSERT INTO membres (projet_id, personne_id, ajoute_le)"
        " VALUES ('pr1', 'p2', '2026-09-30T10:00:00Z')"
    )
    # Supprimer le projet emporte le lien (ON DELETE CASCADE), pas la personne.
    b.execute("DELETE FROM projets WHERE id = 'pr1'")
    assert b.execute("SELECT count(*) FROM membres").fetchone()[0] == 0
    assert b.execute("SELECT count(*) FROM personnes WHERE id = 'p2'").fetchone()[0] == 1

    # Et supprimer la personne emporte le lien, pas le projet.
    un_projet(b, id="pr2", slug="autre", depot="x/autre")
    b.execute(
        "INSERT INTO membres (projet_id, personne_id, ajoute_le)"
        " VALUES ('pr2', 'p2', '2026-09-30T10:00:00Z')"
    )
    b.execute("DELETE FROM personnes WHERE id = 'p2'")
    assert b.execute("SELECT count(*) FROM membres").fetchone()[0] == 0
    assert b.execute("SELECT count(*) FROM projets WHERE id = 'pr2'").fetchone()[0] == 1


@essai("les membres d'un projet se lisent sans parcourir la table")
def _():
    b = base()
    # L'index attendu par la conception existe bien.
    index = {
        r[0]
        for r in b.execute(
            "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='membres'"
        )
    }
    assert "membres_par_projet" in index, index
    # La lecture réelle de la fiche — les membres d'UN projet, joints à leur
    # fiche de personne — ne parcourt jamais toute la table : SQLite passe par un
    # index (celui-ci ou l'index de la clé primaire, tous deux sur `projet_id`).
    plan = b.execute(
        "EXPLAIN QUERY PLAN"
        " SELECT pe.id, pe.nom, pe.origine, pe.github_pseudo"
        " FROM membres m JOIN personnes pe ON pe.id = m.personne_id"
        " WHERE m.projet_id = 'pr1' ORDER BY m.ajoute_le"
    ).fetchall()
    texte = " ".join(str(l[-1]) for l in plan)
    assert "SCAN membres" not in texte, texte


@essai("le journal accepte un geste qu'on n'avait pas prévu")
def _():
    b = base()
    b.execute(
        "INSERT INTO journal (quand, geste, cible)"
        " VALUES ('2026-09-15T08:00:00Z', 'geste-invente-en-2031', 'pr1')"
    )
    assert b.execute("SELECT count(*) FROM journal").fetchone()[0] == 1


def main() -> int:
    rates = 0
    for nom, f in essais:
        try:
            f()
            print(f"  ok   {nom}")
        except AssertionError as e:
            rates += 1
            print(f"  RATÉ {nom} — {e}")
    print(f"\n{len(essais) - rates}/{len(essais)} vérifications passées")
    return 1 if rates else 0


if __name__ == "__main__":
    sys.exit(main())
