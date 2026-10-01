#!/usr/bin/env bash
# Vérifie la surface du 15 septembre : le profil, le dépôt, le mur fusionné.
#
# Deux parties. D'abord les fonctions pures, hors de tout serveur — le nom
# court, la validation d'un projet, la fusion code + base, l'adresse d'un
# projet, les dates de la base, les mesures. Ensuite le serveur local, sur une
# base jetable : le cache du mur qui se vide à chaque écriture, l'ordre des
# adresses, les limites de la liste blanche, ce que les pages construites
# contiennent et ne contiennent plus.
#
#   ./outils/verifier-surface.sh
#
# Suppose `npm run build` fait (le serveur sert `out/`). Port 8790, état dans
# un dossier temporaire : rien n'est écrit dans `.wrangler/state/` ni en ligne.
set -euo pipefail
export LC_ALL=C

cd "$(dirname "$0")/.."
PORT=8790
B="http://localhost:$PORT"
TRAVAIL="$(mktemp -d)"
REUSSIS=0
TOTAL=0
SERVEUR=""

essai() { # essai "ce qu'on vérifie" "attendu" "obtenu"
  TOTAL=$((TOTAL + 1))
  if [ "$2" = "$3" ]; then
    REUSSIS=$((REUSSIS + 1)); printf '  ✅ %s\n' "$1"
  else
    printf '  ❌ %s\n     attendu : %s\n     obtenu  : %s\n' "$1" "$2" "$3"
  fi
}
contient() { # contient "ce qu'on vérifie" "morceau" "texte"
  TOTAL=$((TOTAL + 1))
  case "$3" in
    *"$2"*) REUSSIS=$((REUSSIS + 1)); printf '  ✅ %s\n' "$1" ;;
    *) printf '  ❌ %s\n     ne contient pas : %s\n' "$1" "$2" ;;
  esac
}
absent() { # absent "ce qu'on vérifie" "morceau" "texte"
  TOTAL=$((TOTAL + 1))
  case "$3" in
    *"$2"*) printf '  ❌ %s\n     contient : %s\n' "$1" "$2" ;;
    *) REUSSIS=$((REUSSIS + 1)); printf '  ✅ %s\n' "$1" ;;
  esac
}
ranger() {
  if [ -n "$SERVEUR" ]; then kill -- -"$SERVEUR" 2>/dev/null || true; sleep 1; fi
  rm -rf "$TRAVAIL"
}
trap ranger EXIT

# ── 1. Les fonctions pures ───────────────────────────────────────────────────
echo "── Les fonctions pures"
cat >"$TRAVAIL/entree.ts" <<'TS'
export { slugDe, validerProjet } from "../worker/projets";
export { adresseProjet, dateLongue, moisAnnee, ecart, estFicheDistante } from "../src/lib/format";
export { fusionner } from "../src/donnees/distant";
export { mesurer } from "../src/donnees/api";
TS
# Le fichier d'entrée doit être dans le dépôt pour que les chemins relatifs et
# l'alias `@/` se résolvent ; il est retiré à la fin.
cp "$TRAVAIL/entree.ts" outils/.entree-surface.ts
trap 'ranger; rm -f outils/.entree-surface.ts' EXIT
npx esbuild outils/.entree-surface.ts --bundle --format=esm --platform=neutral \
  --outfile="$TRAVAIL/pur.mjs" --log-level=error
rm -f outils/.entree-surface.ts
trap ranger EXIT

PUR=$(node --input-type=module - "$TRAVAIL/pur.mjs" <<'JS'
import { pathToFileURL } from "node:url";
const m = await import(pathToFileURL(process.argv[2]).href);
const lignes = [];
const essai = (nom, attendu, obtenu) =>
  lignes.push(`${JSON.stringify(attendu) === JSON.stringify(obtenu) ? "OK" : "KO"}\t${nom}\t${JSON.stringify(attendu)}\t${JSON.stringify(obtenu)}`);

essai("slug : minuscules, sans accents, tirets", "mon-projet-d-essai", m.slugDe("Mon Projet d’Essai"));
essai("slug : ligatures et ponctuation", "cafe-oe-ok-2026", m.slugDe("  Café œ… ok!! 2026 "));
essai("slug : quarante caractères au plus, sans tiret final", 40, m.slugDe("a".repeat(37) + " bcdef ghij").length);
essai("slug : vide donne « projet »", "projet", m.slugDe("!!!"));

const base = { nom: "Sillage", resume: "Une ligne", presentation: "Deux phrases.", categorie: "open", pole: "Agentic", etat: "idee", depot: "toulouseia/sillage" };
const v = m.validerProjet(base);
essai("valide : accueil absent devient null, outils vide", [null, []], [v.accueil, v.outils]);
essai("nom de 61 : champ nom", "nom", m.validerProjet({ ...base, nom: "x".repeat(61) }).champ);
essai("résumé de 91 : champ resume", "resume", m.validerProjet({ ...base, resume: "x".repeat(91) }).champ);
essai("présentation de 401 : champ presentation", "presentation", m.validerProjet({ ...base, presentation: "x".repeat(401) }).champ);
essai("onze outils : champ outils", "outils", m.validerProjet({ ...base, outils: Array(11).fill("a") }).champ);
essai("un outil de 31 : champ outils", "outils", m.validerProjet({ ...base, outils: ["x".repeat(31)] }).champ);
essai("dix outils de 30 : accepté", 10, m.validerProjet({ ...base, outils: Array(10).fill("y".repeat(30)) }).outils.length);
essai("accueil inconnu : champ accueil", "accueil", m.validerProjet({ ...base, accueil: "fermé" }).champ);
essai("enPause non booléen : champ enPause", "enPause", m.validerProjet({ ...base, enPause: "oui" }).champ);
essai("business avec depot : depot ignoré", null, m.validerProjet({ ...base, categorie: "business", modele: "abonnement" }).depot);
essai("open avec modele : modele ignoré", null, m.validerProjet({ ...base, modele: "abonnement" }).modele);
essai("depot avec espace : refusé", "depot", m.validerProjet({ ...base, depot: "a b/c" }).champ);
essai("corps qui n'est pas un objet : champ corps", "corps", m.validerProjet([1]).champ);
essai("id, slug, porteur_id, publication ne traversent pas la liste blanche", undefined,
  m.validerProjet({ ...base, id: "x", slug: "y", porteur_id: "z", publication: "attente" }).id);
const modif = m.validerProjet({ categorie: "open" }, { ...v, categorie: "business", depot: null, modele: "abonnement" });
essai("modification : business → open sans depot, champ depot", "depot", modif.champ);
essai("modification : un champ à la fois, le reste tient", "Autre", m.validerProjet({ nom: "Autre" }, v).nom);

const code = [{ slug: "terra", nom: "Terra", maj: "2026-09-01" }, { slug: "site", nom: "Site", maj: "2026-09-10" }];
const distant = [{ slug: "terra", nom: "Terra de la base", maj: "2026-09-15T10:00:00.000Z" }, { slug: "neuf", nom: "Neuf", maj: "2026-09-12T08:00:00.000Z" }];
const fusion = m.fusionner(code, distant);
essai("fusion : la base gagne sur un slug commun", "Terra de la base", fusion.find((p) => p.slug === "terra").nom);
essai("fusion : rangée par maj décroissante", ["terra", "neuf", "site"], fusion.map((p) => p.slug));
essai("fusion : les projets de la base sont marqués distants", [true, true, undefined], fusion.map((p) => p.distant));
essai("fusion : sans base, le code tel quel", 2, m.fusionner(code, []).length);
essai("adresse : projet du code", "/projets/terra", m.adresseProjet({ slug: "terra" }));
essai("adresse : projet de la base", "/projets/fiche?p=neuf", m.adresseProjet({ slug: "neuf", distant: true }));
essai("adresse : slug encodé", "/projets/fiche?p=a%2Fb", m.adresseProjet({ slug: "a/b", distant: true }));
essai("fiche distante reconnue avec ou sans barre", [true, true, false], [m.estFicheDistante("/projets/fiche"), m.estFicheDistante("/projets/fiche/"), m.estFicheDistante("/projets/terra/")]);
essai("date ISO complète lue", "15 septembre 2026", m.dateLongue("2026-09-15T10:22:33.000Z"));
essai("mois et année d'une date ISO complète", "septembre 2026", m.moisAnnee("2026-09-15T10:22:33.000Z"));
essai("écart d'une date ISO complète n'est pas NaN", false, m.ecart("2026-09-15T10:22:33.000Z").includes("NaN"));
const mes = m.mesurer([
  { slug: "a", nom: "A", etat: "idee", pole: "Agentic", categorie: "open", accueil: "ouvert", debut: "2026-09-01", maj: "2026-09-02", outils: [] },
  { slug: "b", nom: "B", etat: "service", pole: "ModIA", categorie: "business", enPause: true, accueil: "ouvert", debut: "2026-08-01", maj: "2026-09-05", outils: [] },
]);
essai("mesures : total, ouverts (pas en pause), dernier dépôt", [2, 1, "2026-09-01"], [mes.total, mes.ouverts, mes.dernierDepot]);
essai("mesures : liste vide sans erreur", 0, m.mesurer([]).total);
console.log(lignes.join("\n"));
JS
)
while IFS=$'\t' read -r etat nom attendu obtenu; do
  essai "$nom" "$attendu" "$([ "$etat" = OK ] && echo "$attendu" || echo "$obtenu")"
done <<<"$PUR"

# ── 2. Les pages construites ─────────────────────────────────────────────────
echo
echo "── Les pages construites"
[ -d out ] || { echo "out/ absent — npm run build d'abord"; exit 1; }
essai "chaque page est un dossier avec index.html" "4" \
  "$(ls out/profil/index.html out/projets/fiche/index.html out/deposer/index.html out/projets/index.html 2>/dev/null | wc -l | tr -d ' ')"
absent "le dépôt n'ouvre plus de courriel" "mailto:" "$(cat out/deposer/index.html)"
absent "aucune adresse électronique dans la page du dépôt" "contact@toulouseia.fr" "$(cat out/deposer/index.html)"
absent "aucun mot de passe nulle part" 'type="password"' "$(cat out/*/index.html out/index.html)"
contient "le mur préfabriqué porte les cinq projets du code" 'href="/projets/moodle-qui-parle/"' "$(cat out/projets/index.html)"
contient "la fiche commune est sous la disposition des projets (le mur y est)" 'href="/projets/terra/"' "$(cat out/projets/fiche/index.html)"
contient "le rail a une entrée profil" 'href="/profil/"' "$(cat out/projets/index.html)"
essai "les cinq projets du code sont toujours là" "5" "$(grep -c '^    slug:' src/donnees/projets.ts)"
# Un seul appel de `GET /api/moi` au chargement, celui du fournisseur : personne
# d'autre n'appelle `lireMoi` (la porte de `distant.ts`), et personne n'écrit
# `fetch(` vers `/api/moi` pour son compte.
essai "un seul composant demande GET /api/moi : le fournisseur" "src/composants/coque/moi.tsx" \
  "$(grep -rl 'lireMoi(' src/composants src/app | tr '\n' ' ' | sed 's/ $//')"
essai "aucun fetch propre vers /api/moi hors de distant.ts" "0" \
  "$(grep -rn 'fetch(' src --include=*.ts --include=*.tsx | grep -v 'src/donnees/distant.ts' | grep -c 'api/moi' || true)"

# ── 3. Le serveur ────────────────────────────────────────────────────────────
echo
echo "── Le serveur local"
ETAT="$TRAVAIL/etat"; mkdir -p "$ETAT"
printf 'y\n' | npx wrangler d1 migrations apply BASE --local --persist-to "$ETAT" >"$TRAVAIL/migrations.log" 2>&1
emp() { python3 -c 'import base64,hashlib,sys;print(base64.urlsafe_b64encode(hashlib.sha256(sys.argv[1].encode()).digest()).decode().rstrip("="))' "$1"; }
ISO=$(python3 -c 'import datetime;print(datetime.datetime.now(datetime.timezone.utc).isoformat())')
PLUS=$(python3 -c 'import datetime;print((datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(days=30)).isoformat())')
cat >"$TRAVAIL/fixtures.sql" <<SQL
INSERT INTO personnes (id, nom, courriel, google_id, cree_le, vu_le) VALUES ('ana', 'Ana Essai', 'ana@example.org', 'g-ana', '$ISO', '$ISO');
INSERT INTO personnes (id, nom, courriel, github_id, github_pseudo, cree_le, vu_le) VALUES ('bob', 'bob-essai', NULL, 'gh-bob', 'bob-essai', '$ISO', '$ISO');
INSERT INTO sessions (jeton, personne_id, cree_le, expire_le) VALUES ('$(emp jeton-ana)', 'ana', '$ISO', '$PLUS');
INSERT INTO sessions (jeton, personne_id, cree_le, expire_le) VALUES ('$(emp jeton-bob)', 'bob', '$ISO', '$PLUS');
SQL
npx wrangler d1 execute BASE --local --persist-to "$ETAT" --file "$TRAVAIL/fixtures.sql" >"$TRAVAIL/fixtures.log" 2>&1
setsid npx wrangler dev --local --port "$PORT" --persist-to "$ETAT" \
  --var OU:local --var SITE:"$B" \
  --var GOOGLE_ID:essai-google --var GITHUB_ID:essai-github \
  --var GOOGLE_SECRET:essai --var GITHUB_SECRET:essai \
  >"$TRAVAIL/serveur.log" 2>&1 &
SERVEUR=$!
for _ in $(seq 1 60); do
  curl -s --max-time 2 "$B/api/sante" >/dev/null 2>&1 && break
  sleep 1
done
curl -s --max-time 2 "$B/api/sante" >/dev/null || { echo "le serveur n'a pas démarré"; tail -20 "$TRAVAIL/serveur.log"; exit 1; }

sql() { npx wrangler d1 execute BASE --local --persist-to "$ETAT" --json --command "$1" 2>/dev/null \
  | python3 -c 'import sys,json;d=json.load(sys.stdin);print(json.dumps(d[0]["results"],ensure_ascii=False))'; }
code()  { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$@"; }
corps() { curl -s --max-time 10 "$@"; }
entete() { curl -s -D - -o /dev/null --max-time 10 "$@" | tr -d '\r' | grep -i "^$1:" | head -1 | cut -d' ' -f2- ; }
ANA=(-H 'Cookie: session=jeton-ana'); BOB=(-H 'Cookie: session=jeton-bob'); JSON=(-H 'Content-Type: application/json')
OPEN='"resume":"r","presentation":"p","categorie":"open","pole":"Agentic","etat":"idee","depot":"ana/x"'

echo "· le cache du mur"
essai "premier appel : lu en base" "base" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
essai "deuxième appel : servi par le cache" "cache" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
contient "l'en-tête de cache dit soixante secondes" "max-age=60" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r')"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"Cache Un\",$OPEN}" "$B/api/projets")
ID1=$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["id"])')
essai "après un dépôt : le cache est vidé, lu en base" "base" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
contient "…et le dépôt y est" '"nom":"Cache Un"' "$(corps "$B/api/projets")"
curl -s -o /dev/null -X PUT "${ANA[@]}" "${JSON[@]}" -d '{"resume":"changé"}' "$B/api/projets/$ID1"
essai "après une modification : vidé" "base" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
essai "…puis de nouveau en cache" "cache" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
curl -s -o /dev/null -X DELETE "${ANA[@]}" "$B/api/projets/$ID1"
essai "après une suppression : vidé" "base" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
essai "…et le mur est vide" '{"projets":[]}' "$(corps "$B/api/projets")"
curl -s -o /dev/null "$B/api/projets"
essai "…puis de nouveau en cache" "cache" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
curl -s -o /dev/null -X PUT "${ANA[@]}" "${JSON[@]}" -d '{"nom":"Ana Renommée"}' "$B/api/moi"
essai "après un changement de profil (le mur porte le nom du porteur) : vidé" "base" "$(curl -s -D - -o /dev/null "$B/api/projets" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-source"{print $2}')"
curl -s -o /dev/null -X PUT "${ANA[@]}" "${JSON[@]}" -d '{"nom":"Ana Essai"}' "$B/api/moi"

echo "· l'ordre des adresses"
essai "« miens » n'est pas pris pour un nom court (401, pas 404)" 401 "$(code "$B/api/projets/miens")"
essai "un nom court « miens » n'existe pas : la liste répond, avec session" 200 "$(code "${ANA[@]}" "$B/api/projets/miens")"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"Miens\",$OPEN}" "$B/api/projets")
essai "un projet nommé « Miens » reçoit miens-2 : l'adresse du serveur est réservée" "miens-2" "$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["slug"])')"
essai "…et sa fiche se lit" 200 "$(code "$B/api/projets/miens-2")"
curl -s -o /dev/null -X DELETE "${ANA[@]}" "$B/api/projets/$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["id"])')"

echo "· la liste blanche, par le serveur"
essai "nom de 61 : 400" 400 "$(code -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"$(printf 'x%.0s' $(seq 1 61))\",$OPEN}" "$B/api/projets")"
essai "onze outils : 400" 400 "$(code -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"Outils\",$OPEN,\"outils\":[\"a\",\"b\",\"c\",\"d\",\"e\",\"f\",\"g\",\"h\",\"i\",\"j\",\"k\"]}" "$B/api/projets")"
essai "corps illisible : 400" 400 "$(code -X POST "${ANA[@]}" "${JSON[@]}" -d 'nom=x' "$B/api/projets")"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d '{"nom":"Affaire","resume":"r","presentation":"p","categorie":"business","pole":"ModIA","etat":"essai","modele":"abonnement","depot":"ignore/moi","accueil":"complet","outils":["python"]}' "$B/api/projets")
IDB=$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["id"])')
essai "business : le depot du corps n'est pas écrit" '[{"depot": null, "modele": "abonnement", "accueil": "complet", "outils": "[\"python\"]"}]' \
  "$(sql "SELECT depot, modele, accueil, outils FROM projets WHERE id='$IDB'")"
absent "un projet servi n'a pas de clé depot quand il n'en a pas" '"depot"' "$(corps "$B/api/projets/affaire")"
contient "le porteur servi a ses contacts, pas son adresse de compte" '"porteur":{"id":"ana","nom":"Ana Essai","contacts":[]}' "$(corps "$B/api/projets/affaire")"
absent "aucune adresse électronique ne sort du mur" 'example.org' "$(corps "$B/api/projets")"

echo "· le nom court"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"Élégie du Château — n°3 !\",$OPEN}" "$B/api/projets")
essai "accents, tirets longs, symboles" "elegie-du-chateau-n-3" "$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["slug"])')"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"$(printf 'Longnom%.0s' $(seq 1 8))\",$OPEN}" "$B/api/projets")
essai "quarante caractères au plus (nom de 56)" 40 "$(printf '%s' "$R" | python3 -c 'import sys,json;print(len(json.load(sys.stdin)["projet"]["slug"]))')"
R=$(corps -X POST "${ANA[@]}" "${JSON[@]}" -d "{\"nom\":\"$(printf 'Longnom%.0s' $(seq 1 8))\",$OPEN}" "$B/api/projets")
S2=$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["slug"])')
essai "même nom long : suffixe -2 dans la limite" "40 -2" "${#S2} ${S2: -2}"
R=$(corps -X POST "${BOB[@]}" "${JSON[@]}" -d '{"nom":"Site","resume":"r","presentation":"p","categorie":"open","pole":"Agentic","etat":"idee","depot":"bob/site"}' "$B/api/projets")
essai "« Site » est pris par le code : -2" "site-2" "$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["slug"])')"
IDS=$(printf '%s' "$R" | python3 -c 'import sys,json;print(json.load(sys.stdin)["projet"]["id"])')
curl -s -o /dev/null -X PUT "${BOB[@]}" "${JSON[@]}" -d '{"nom":"Site renommé entièrement"}' "$B/api/projets/$IDS"
essai "renommer ne change pas le nom court" '[{"slug": "site-2", "nom": "Site renommé entièrement"}]' "$(sql "SELECT slug, nom FROM projets WHERE id='$IDS'")"
R=$(corps -X PUT "${BOB[@]}" "${JSON[@]}" -d '{"accueil":null}' "$B/api/projets/$IDS")
absent "l'accueil se retire en envoyant null" '"accueil"' "$R"
essai "le journal a le dépôt et les deux modifications de bob" '[{"n": 3}]' "$(sql "SELECT count(*) AS n FROM journal WHERE personne_id='bob' AND cible='$IDS'")"

echo "· le profil, ce qui n'est pas dans le contrôle"
R=$(corps -X PUT "${ANA[@]}" "${JSON[@]}" -d '{"origine":null}' "$B/api/moi")
contient "l'origine s'efface avec null" '"origine":null' "$R"
essai "un canal en double est accepté (deux comptes Discord, pourquoi pas)" 200 \
  "$(code -X PUT "${ANA[@]}" "${JSON[@]}" -d '{"contacts":[{"canal":"discord","valeur":"a"},{"canal":"discord","valeur":"b"}]}' "$B/api/moi")"
essai "un contact de 121 caractères : 400" 400 \
  "$(code -X PUT "${ANA[@]}" "${JSON[@]}" -d "{\"contacts\":[{\"canal\":\"mail\",\"valeur\":\"$(printf 'x%.0s' $(seq 1 121))\"}]}" "$B/api/moi")"

echo "· les pages servies"
essai "/profil sans barre est redirigé vers /profil/" "/profil/" "$(entete location "$B/profil")"
essai "/profil/ est servi" 200 "$(code "$B/profil/")"
essai "/projets/fiche/?p=x est servi (la page commune)" 200 "$(code "$B/projets/fiche/?p=x")"
essai "/deposer/?projet=x est servi" 200 "$(code "$B/deposer/?projet=x")"

echo
echo "$REUSSIS vérifications sur $TOTAL"
[ "$REUSSIS" = "$TOTAL" ]
