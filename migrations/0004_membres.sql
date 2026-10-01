-- ─────────────────────────────────────────────────────────────────────────────
-- Les membres participants d'un projet.
--
-- Un projet a déjà un porteur unique (`projets.porteur_id`). Il peut porter en
-- plus une liste de membres participants : des personnes qui apparaissent sur sa
-- fiche, sans aucun droit d'édition — l'écriture reste au porteur et au bureau
-- (`peutToucher`, inchangé). Un membre est une vraie fiche de `personnes`, pas
-- une étiquette : Samir et Sami reçoivent un « pré-compte » (une ligne avec leur
-- identité GitHub, sans connexion), que `trouverOuCreer` promeut à leur première
-- connexion en les reconnaissant par `github_id`.
--
-- Une table de liaison, et rien de plus. La clé primaire double interdit qu'une
-- personne soit deux fois membre du même projet : l'ajout est idempotent par
-- construction. Le porteur n'est PAS recopié ici — il reste `projets.porteur_id` ;
-- la fiche affiche « Porteur » puis « Membres ».
--
-- Les deux clés étrangères en ON DELETE CASCADE : supprimer un projet ou une
-- personne efface le lien, jamais un orphelin. Comme `depots_suivis` (0001), le
-- lien disparaît avec ce qu'il relie.
--
-- Les membres ne se lisent que sur la fiche d'un projet, jamais sur le mur
-- (`GET /api/projets`) : c'est le nombre de lignes lues qui sature en premier
-- chez Cloudflare, et le mur est la route la plus lue (même doctrine que les
-- outils/contacts en JSON de 0001, l'image de 0003). D'où l'index sur
-- `projet_id` : la lecture d'une fiche prend les membres d'un projet sans
-- parcourir toute la table.
--
-- `0001`/`0002`/`0003` ne se retouchent pas — ils sont appliqués en ligne —
-- d'où cette migration à part.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE membres (
  projet_id   TEXT NOT NULL REFERENCES projets(id)   ON DELETE CASCADE,
  personne_id TEXT NOT NULL REFERENCES personnes(id) ON DELETE CASCADE,
  -- Quand le lien a été créé, en texte ISO 8601 UTC : c'est l'ordre d'affichage
  -- des membres sur la fiche (les premiers rattachés d'abord).
  ajoute_le   TEXT NOT NULL,
  PRIMARY KEY (projet_id, personne_id)
);

CREATE INDEX membres_par_projet ON membres(projet_id);
