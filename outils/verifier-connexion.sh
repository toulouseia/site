#!/usr/bin/env bash
# Vérifie la connexion par Google et par GitHub sans avoir à se connecter.
#
# Ce qui se vérifie ici, c'est tout ce qui ne dépend pas des secrets : la moitié
# « départ » des deux chemins, les protections, et la lecture d'une session
# posée à la main dans la base locale. Ce qui ne peut pas se vérifier ici, c'est
# l'échange du code contre une identité, qui demande les vrais secrets et un vrai
# consentement — cette moitié-là se vérifie une fois, à la main, en ligne.
#
#   ./outils/verifier-connexion.sh
#
# Le programme démarre son propre serveur local, applique les migrations à une
# base locale, fait ses essais, et arrête tout. Il n'écrit rien en ligne.
set -uo pipefail
export LC_ALL=C

cd "$(dirname "$0")/.."
PORT=8789
B="http://localhost:$PORT"
TRAVAIL="$(mktemp -d)"
REUSSIS=0
TOTAL=0

essai() { # essai "ce qu'on vérifie" "attendu" "obtenu"
  TOTAL=$((TOTAL + 1))
  if [ "$2" = "$3" ]; then
    REUSSIS=$((REUSSIS + 1))
    printf '  ✅ %s\n' "$1"
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

echo "── Préparation ──"
printf 'y\n' | npx wrangler d1 migrations apply BASE --local >/dev/null 2>&1
# `setsid` met le serveur dans son propre groupe de processus : sans cela, le
# rangement de fin ne tue que l'enveloppe et le vrai serveur reste en vie sur le
# port, ce qui fait échouer l'essai suivant sans dire pourquoi.
setsid npx wrangler dev --local --port "$PORT" \
  --var OU:local --var SITE:"$B" \
  --var GOOGLE_ID:essai-google --var GITHUB_ID:essai-github \
  --var GOOGLE_SECRET:essai --var GITHUB_SECRET:essai \
  >"$TRAVAIL/serveur.log" 2>&1 &
SERVEUR=$!
trap 'kill -- -"$SERVEUR" 2>/dev/null; rm -rf "$TRAVAIL"' EXIT

for _ in $(seq 1 40); do
  curl -s --max-time 2 "$B/api/sante" >/dev/null 2>&1 && break
  sleep 1
done
if ! curl -s --max-time 2 "$B/api/sante" >/dev/null 2>&1; then
  echo "Le serveur local n'a pas démarré. Journal :"
  tail -20 "$TRAVAIL/serveur.log"
  exit 1
fi

# Une personne et deux sessions posées directement dans la base : une valable,
# une périmée. Le jeton n'est pas écrit tel quel — c'est son empreinte qui va en
# base — donc le fichier ci-dessous la calcule comme le programme la calcule.
python3 - >"$TRAVAIL/essai.sql" <<'PY'
import base64, datetime, hashlib

def emp(j):
    return base64.urlsafe_b64encode(hashlib.sha256(j.encode()).digest()).decode().rstrip("=")

maintenant = datetime.datetime.now(datetime.timezone.utc)
iso = maintenant.isoformat()
plus = (maintenant + datetime.timedelta(days=30)).isoformat()
moins = (maintenant - datetime.timedelta(days=1)).isoformat()
print(f"""
-- La suppression de la personne emporte ses sessions : c'est la cascade du
-- schéma, et l'essai la vérifie au passage en repartant d'une base propre.
DELETE FROM personnes WHERE id = 'essai-1';
INSERT INTO personnes (id, nom, courriel, google_id, cree_le, vu_le)
  VALUES ('essai-1', 'Essai Essai', 'essai-1@example.org', 'g-essai-1', '{iso}', '{iso}');
INSERT INTO sessions (jeton, personne_id, cree_le, expire_le)
  VALUES ('{emp("jeton-valable")}', 'essai-1', '{iso}', '{plus}');
INSERT INTO sessions (jeton, personne_id, cree_le, expire_le)
  VALUES ('{emp("jeton-perime")}', 'essai-1', '{moins}', '{moins}');
""")
PY
npx wrangler d1 execute BASE --local --file "$TRAVAIL/essai.sql" >"$TRAVAIL/sql.log" 2>&1 \
  || { echo "L'écriture d'essai en base a échoué :"; tail -20 "$TRAVAIL/sql.log"; exit 1; }

echo
echo "── Le départ chez Google ──"
DEPART=$(curl -s -i --max-time 5 "$B/api/auth/google/entree?suite=%2Fdeposer")
contient "part bien chez Google"            "accounts.google.com/o/oauth2/v2/auth" "$DEPART"
contient "ne demande que nom, adresse, photo" "scope=openid+email+profile"         "$DEPART"
contient "porte un état"                    "state="                               "$DEPART"
contient "porte une empreinte de vérificateur" "code_challenge_method=S256"        "$DEPART"
contient "laisse choisir le compte"         "prompt=select_account"                "$DEPART"
contient "revient chez nous"                "%2Fapi%2Fauth%2Fgoogle%2Fretour"      "$DEPART"
contient "le témoin d'état est inaccessible au code de la page" "HttpOnly"         "$DEPART"
contient "le témoin d'état passe au retour d'un autre site"     "SameSite=Lax"     "$DEPART"

echo
echo "── Le départ chez GitHub ──"
GH=$(curl -s -i --max-time 5 "$B/api/auth/github/entree")
contient "part bien chez GitHub"     "github.com/login/oauth/authorize" "$GH"
contient "ne demande aucune permission" "scope=" "$GH"
contient "porte un état"             "state=" "$GH"

echo
echo "── Les protections ──"
essai "un retour sans état est refusé" \
  "$B/?connexion=echec&motif=etat" \
  "$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 5 "$B/api/auth/google/retour?code=x&state=faux")"
essai "un refus de consentement est raconté" \
  "$B/?connexion=echec&motif=refus" \
  "$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 5 "$B/api/auth/github/retour?error=access_denied&state=x")"
for MECHANT in "//mechant.example" "https://mechant.example"; do
  CODE=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$MECHANT")
  essai "une suite vers l'extérieur ($MECHANT) retombe sur l'accueil" \
    "suite=%2F" \
    "$(curl -s -i --max-time 5 "$B/api/auth/google/entree?suite=$CODE" | grep -io 'suite=[^;]*' | head -1)"
done
essai "une suite interne est gardée" "suite=%2Fdeposer" \
  "$(curl -s -i --max-time 5 "$B/api/auth/google/entree?suite=%2Fdeposer" | grep -io 'suite=[^;]*' | head -1)"

echo
echo "── Les sessions ──"
essai "sans témoin, personne" '{"connecte":false}' \
  "$(curl -s --max-time 5 "$B/api/moi")"
essai "un jeton inventé ne connecte pas" '{"connecte":false}' \
  "$(curl -s --max-time 5 -H 'Cookie: session=nimporte-quoi' "$B/api/moi")"
essai "un jeton périmé ne connecte plus" '{"connecte":false}' \
  "$(curl -s --max-time 5 -H 'Cookie: session=jeton-perime' "$B/api/moi")"
contient "un jeton valable donne la bonne personne" '"nom":"Essai Essai"' \
  "$(curl -s --max-time 5 -H 'Cookie: session=jeton-valable' "$B/api/moi")"
curl -s -o /dev/null -X POST --max-time 5 -H 'Cookie: session=jeton-valable' "$B/api/deconnexion"
essai "après déconnexion, le même jeton ne vaut plus rien" '{"connecte":false}' \
  "$(curl -s --max-time 5 -H 'Cookie: session=jeton-valable' "$B/api/moi")"

echo
echo "── Le reste de /api/ ──"
essai "une adresse inconnue répond en JSON" "404 application/json" \
  "$(curl -s -o /dev/null -w '%{http_code} %{content_type}' --max-time 5 "$B/api/auth/inconnu")"

echo
echo "$REUSSIS vérifications sur $TOTAL"
[ "$REUSSIS" = "$TOTAL" ]
