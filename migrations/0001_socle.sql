-- ─────────────────────────────────────────────────────────────────────────────
-- Le socle de la base : qui se connecte, ce qu'il dépose, ce qu'on en a fait.
--
-- Cinq tables, et pas une de plus pour l'instant. Le document de décision en
-- annonçait six ; la sixième — les candidatures à un projet — n'est pas ici, et
-- c'est délibéré : l'application ne transporte aucun message, elle affiche les
-- endroits où le porteur a dit qu'on pouvait le joindre. Créer la table
-- reviendrait à trancher cette question dans le schéma au lieu de la poser.
-- Elle se posera au moment de l'étape 9, pas avant.
--
-- Trois principes tenus partout :
--
--   · Les dates sont du texte au format ISO 8601 en temps universel. SQLite n'a
--     pas de type date : un nombre de secondes se compare mal à l'œil dans un
--     tableau de bord, une chaîne ISO se trie exactement comme une date.
--   · Les valeurs à choix fermé sont contraintes par CHECK. Une faute de frappe
--     dans le programme devient une erreur d'écriture, pas une fiche invisible.
--   · Ce que le bureau rédige — ressources, veille, outils — n'entre pas ici :
--     ce sont des fichiers du dépôt, avec leur historique. Seul ce que les
--     étudiants créent va en base.
--
-- Décision d'Alexis du 15 septembre 2026 : ces comptes servent à gérer ses
-- projets sur le site, et rien d'autre. L'adhésion à l'association, les
-- cotisations et la liste des membres ne passent pas par là.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Les personnes ───────────────────────────────────────────────────────────
--
-- Une ligne par personne connectée au moins une fois. L'identifiant est tiré au
-- hasard par nous : celui de Google ou de GitHub reste dans sa colonne, pour ne
-- pas faire dépendre toutes les autres tables d'un service extérieur.
--
-- Une même personne peut se connecter par Google et par GitHub ; les deux
-- colonnes d'identité extérieure coexistent donc sur la même ligne, et c'est
-- l'adresse électronique qui les rapproche. Beaucoup d'étudiants masquent leur
-- adresse sur GitHub : dans ce cas le rapprochement échoue, et c'est un écran
-- de l'application qui demande, pas une règle silencieuse du schéma.
CREATE TABLE personnes (
  id              TEXT PRIMARY KEY,
  nom             TEXT NOT NULL,
  courriel        TEXT UNIQUE,
  -- L'identité chez chaque service, si elle existe. UNIQUE et non NOT NULL :
  -- deux personnes ne peuvent pas partager un compte Google, mais une personne
  -- peut n'en avoir aucun.
  google_id       TEXT UNIQUE,
  github_id       TEXT UNIQUE,
  github_pseudo   TEXT,
  -- L'adresse de la photo telle que Google ou GitHub la renvoie. On ne stocke
  -- aucune image en version 1.
  photo           TEXT,
  -- Ce que la personne dit d'elle, en texte libre et facultatif : « N7 · SN »,
  -- « INSA », « en poste ». Aucun choix fermé : la communauté n'est plus celle
  -- d'une seule école.
  origine         TEXT,
  -- Le bureau. Sert à la modération, et à rien d'autre.
  bureau          INTEGER NOT NULL DEFAULT 0 CHECK (bureau IN (0, 1)),
  cree_le         TEXT NOT NULL,
  vu_le           TEXT NOT NULL
);

-- ── Les sessions ────────────────────────────────────────────────────────────
--
-- Un jeton opaque tiré au hasard, jamais un jeton signé qui porterait des
-- données lisibles. Conséquence voulue : une session se révoque en supprimant
-- une ligne, ce qu'aucun jeton signé ne permet.
CREATE TABLE sessions (
  jeton        TEXT PRIMARY KEY,
  personne_id  TEXT NOT NULL REFERENCES personnes(id) ON DELETE CASCADE,
  cree_le      TEXT NOT NULL,
  expire_le    TEXT NOT NULL,
  -- Ce que le navigateur a annoncé. Sert à reconnaître une session volée, et à
  -- rien d'autre : il n'est jamais affiché.
  agent        TEXT
);

CREATE INDEX sessions_par_personne ON sessions(personne_id);
-- Le ménage des sessions périmées se fait par cette colonne, chaque nuit.
CREATE INDEX sessions_par_expiration ON sessions(expire_le);

-- ── Les projets ─────────────────────────────────────────────────────────────
--
-- Les colonnes reprennent une à une le vocabulaire de l'application
-- (`src/donnees/types.ts`) : ce sont les mêmes mots, donc il n'y a pas de
-- traduction à écrire entre la base et l'écran.
--
-- La modération est dans la table, pas dans le programme : un projet existe dès
-- qu'il est déposé, et il ne s'affiche que lorsqu'un membre du bureau l'a relu.
-- Un formulaire ouvert sur internet finit toujours par afficher quelque chose
-- que l'association ne veut pas afficher.
CREATE TABLE projets (
  id            TEXT PRIMARY KEY,
  -- Le nom court dans l'adresse : `/projets/terra`. Unique, et il ne change
  -- plus une fois publié — un lien partagé doit continuer de mener quelque part.
  slug          TEXT NOT NULL UNIQUE,
  nom           TEXT NOT NULL,
  resume        TEXT NOT NULL,
  presentation  TEXT NOT NULL,
  etat          TEXT NOT NULL CHECK (etat IN ('idee', 'chantier', 'essai', 'service')),
  en_pause      INTEGER NOT NULL DEFAULT 0 CHECK (en_pause IN (0, 1)),
  categorie     TEXT NOT NULL CHECK (categorie IN ('open', 'business')),
  pole          TEXT NOT NULL CHECK (pole IN ('Agentic', 'ModIA', 'Embedded', 'Hackathon')),
  porteur_id    TEXT NOT NULL REFERENCES personnes(id) ON DELETE CASCADE,
  accueil       TEXT CHECK (accueil IS NULL OR accueil IN ('ouvert', 'complet')),
  -- Open : le dépôt public, obligatoire. Business : d'où viendrait l'argent.
  -- La règle est tenue par une contrainte, pas par une consigne : un projet
  -- ouvert sans dépôt ne peut pas entrer dans la table.
  depot         TEXT,
  modele        TEXT,
  -- Les outils, en JSON. Une table de plus pour une liste de mots qu'on
  -- n'interroge jamais séparément coûterait une jointure à chaque lecture, et
  -- c'est le nombre de lignes lues qui sature en premier chez Cloudflare.
  outils        TEXT NOT NULL DEFAULT '[]',
  debut         TEXT NOT NULL,
  maj           TEXT NOT NULL,
  -- La modération. Un projet refusé garde sa ligne : sans elle, la personne
  -- redépose et le bureau relit deux fois.
  publication   TEXT NOT NULL DEFAULT 'attente'
                CHECK (publication IN ('attente', 'publie', 'refuse')),
  relu_par      TEXT REFERENCES personnes(id) ON DELETE SET NULL,
  relu_le       TEXT,
  -- Ce que le bureau a répondu au porteur en cas de refus. Jamais affiché
  -- publiquement.
  motif         TEXT,
  CHECK (categorie <> 'open' OR depot IS NOT NULL)
);

-- La vitrine lit exactement ceci : les projets publiés, les plus récents
-- d'abord. Un seul index, et c'est la seule lecture qui compte.
CREATE INDEX projets_publies ON projets(publication, maj DESC);
CREATE INDEX projets_par_porteur ON projets(porteur_id);

-- ── Les dépôts suivis ───────────────────────────────────────────────────────
--
-- Ce que GitHub dit d'un dépôt, recopié chez nous une fois par nuit. La
-- recopie n'est pas un cache d'optimisation : elle garantit que la vitrine
-- s'affiche entière même quand GitHub est en panne ou que le quota horaire est
-- épuisé.
CREATE TABLE depots_suivis (
  -- « toulouseia/toulouseia », tel qu'on l'écrit dans l'adresse.
  depot        TEXT PRIMARY KEY,
  projet_id    TEXT NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  description  TEXT,
  langage      TEXT,
  etoiles      INTEGER,
  -- Le dernier envoi de code, tel que GitHub le date.
  pousse_le    TEXT,
  -- Quand nous avons demandé, et ce que GitHub a répondu. Une erreur se lit
  -- ici : sans cette colonne, un dépôt devenu privé disparaît sans un mot.
  releve_le    TEXT,
  erreur       TEXT
);

CREATE INDEX depots_par_projet ON depots_suivis(projet_id);
-- La tâche de nuit prend les plus anciens relevés d'abord, par lots.
CREATE INDEX depots_par_releve ON depots_suivis(releve_le);

-- ── Le journal ──────────────────────────────────────────────────────────────
--
-- Ce qui a été fait, par qui, et quand. Il existe pour une raison précise : le
-- bureau change tous les ans, et la personne qui arrive doit pouvoir répondre à
-- « pourquoi ce projet a-t-il disparu ? » sans demander à celle qui est partie.
--
-- Il ne contient aucune donnée personnelle au-delà de l'identifiant de l'auteur
-- de l'action, et il se purge par la date.
CREATE TABLE journal (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  quand       TEXT NOT NULL,
  -- Le geste, en un mot : 'connexion', 'depot', 'publication', 'refus',
  -- 'modification', 'suppression'. Pas de CHECK ici : un journal qui refuse
  -- une ligne parce que le mot est nouveau perd l'information qu'il existe
  -- pour garder.
  geste       TEXT NOT NULL,
  personne_id TEXT REFERENCES personnes(id) ON DELETE SET NULL,
  -- Sur quoi : l'identifiant d'un projet, d'une personne, d'un dépôt.
  cible       TEXT,
  -- Le reste, en JSON, sans forme imposée.
  detail      TEXT
);

CREATE INDEX journal_par_date ON journal(quand DESC);
CREATE INDEX journal_par_cible ON journal(cible);
