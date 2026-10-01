#!/usr/bin/env bash
# Photographie la surface du 15 septembre, sur le site construit.
#
#   ./outils/capturer-surface.sh [dossier-de-sortie]
#
# Démarre un `wrangler dev` sur le port 8792 qui sert `out/` avec une base
# jetable (migrations appliquées, une personne et sa session posées à la main),
# et un serveur de fichiers nu sur 8793 — `out/` sans `/api/` — pour le repli.
# Puis `capturer-surface.mjs` pilote Chrome, et tout s'arrête. Rien n'est écrit
# dans `.wrangler/state/` ni en ligne.
set -euo pipefail
export LC_ALL=C

cd "$(dirname "$0")/.."
SORTIE="${1:-captures/surface}"
PORT=8792
PORT_NU=8793
B="http://localhost:$PORT"
TRAVAIL="$(mktemp -d)"
SERVEUR=""; NU=""
ranger() {
  [ -n "$SERVEUR" ] && { kill -- -"$SERVEUR" 2>/dev/null || true; }
  [ -n "$NU" ] && { kill -- -"$NU" 2>/dev/null || true; }
  sleep 1
  rm -rf "$TRAVAIL"
}
trap ranger EXIT

[ -d out ] || { echo "out/ absent — npm run build d'abord"; exit 1; }
ETAT="$TRAVAIL/etat"; mkdir -p "$ETAT"
printf 'y\n' | npx wrangler d1 migrations apply BASE --local --persist-to "$ETAT" >"$TRAVAIL/migrations.log" 2>&1
emp() { python3 -c 'import base64,hashlib,sys;print(base64.urlsafe_b64encode(hashlib.sha256(sys.argv[1].encode()).digest()).decode().rstrip("="))' "$1"; }
ISO=$(python3 -c 'import datetime;print(datetime.datetime.now(datetime.timezone.utc).isoformat())')
PLUS=$(python3 -c 'import datetime;print((datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(days=30)).isoformat())')
# La photo : celle que Google aurait donnée. Un carré, deux initiales, en
# données : rien à aller chercher sur le réseau pendant la capture.
PHOTO='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23a8442a"/><text x="32" y="41" font-family="sans-serif" font-size="26" font-weight="700" fill="%23f7f6f4" text-anchor="middle">AE</text></svg>'
cat >"$TRAVAIL/fixtures.sql" <<SQL
INSERT INTO personnes (id, nom, courriel, google_id, photo, origine, cree_le, vu_le)
  VALUES ('ana', 'Ana Essai', 'ana@example.org', 'g-ana', '$PHOTO', 'INSA · 4A', '$ISO', '$ISO');
INSERT INTO sessions (jeton, personne_id, cree_le, expire_le) VALUES ('$(emp jeton-capture)', 'ana', '$ISO', '$PLUS');
SQL
npx wrangler d1 execute BASE --local --persist-to "$ETAT" --file "$TRAVAIL/fixtures.sql" >"$TRAVAIL/fixtures.log" 2>&1

setsid npx wrangler dev --local --port "$PORT" --persist-to "$ETAT" \
  --var OU:local --var SITE:"$B" \
  --var GOOGLE_ID:essai-google --var GITHUB_ID:essai-github \
  --var GOOGLE_SECRET:essai --var GITHUB_SECRET:essai \
  >"$TRAVAIL/serveur.log" 2>&1 &
SERVEUR=$!
# Le serveur nu : `out/` tel quel, aucune adresse `/api/`. C'est ce que voit un
# visiteur quand les pages sont là et que le programme serveur ne répond pas.
setsid python3 -m http.server "$PORT_NU" --bind 127.0.0.1 --directory out >"$TRAVAIL/nu.log" 2>&1 &
NU=$!
for _ in $(seq 1 60); do
  curl -s --max-time 2 "$B/api/sante" >/dev/null 2>&1 && break
  sleep 1
done
curl -s --max-time 2 "$B/api/sante" >/dev/null || { echo "le serveur n'a pas démarré"; tail -20 "$TRAVAIL/serveur.log"; exit 1; }
curl -s --max-time 2 "http://localhost:$PORT_NU/projets/" >/dev/null || { echo "le serveur nu n'a pas démarré"; exit 1; }

node outils/capturer-surface.mjs "$B" "http://localhost:$PORT_NU" "$SORTIE"
