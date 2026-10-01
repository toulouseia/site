-- ─────────────────────────────────────────────────────────────────────────────
-- L'image d'illustration d'un projet.
--
-- Un projet peut porter une image : le porteur la choisit dans le formulaire de
-- dépôt. Le fichier lui-même vit dans le bucket R2 `IMAGES` ; ici, on ne garde
-- que sa clé — du texte court, jamais les octets. C'est la même règle que
-- `personnes.photo` (0001) : le schéma range une adresse, pas une image. Mettre
-- l'image en base la ferait relire à chaque lecture du mur, et c'est le nombre
-- de lignes lues qui sature en premier chez Cloudflare.
--
-- La colonne est nullable : la plupart des projets n'ont pas d'image, et le mur
-- retombe alors sur le signe. `0001`/`0002` ne se retouchent pas — ils sont
-- appliqués en ligne — d'où cette migration à part.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE projets ADD COLUMN image TEXT;
