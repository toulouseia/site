#!/usr/bin/env bash
# Mesure le temps de calcul d'un appel à /api/, le seul risque de facture du
# projet : l'offre gratuite de Cloudflare donne 10 millisecondes de calcul par
# appel, et personne n'avait jamais mesuré ce que coûte un appel de cette
# application (docs/DECISION-ARCHITECTURE-SERVEUR.md, §6, premier point).
#
# Deux mesures, et elles ne disent pas la même chose :
#
#   local     ce que met la machine de développement. Donne un ordre de
#             grandeur et repère une bêtise, mais ne vaut rien comme chiffre :
#             ce n'est pas le même processeur, et le temps compté est celui de
#             l'horloge, pas celui du processeur.
#   distant   le temps de processeur relevé par Cloudflare lui-même, sur le
#             site en ligne. C'est le seul chiffre qui compte face aux
#             10 millisecondes.
#
#   ./outils/mesurer-temps-api.sh local    [adresse]
#   ./outils/mesurer-temps-api.sh distant  [adresse]
set -euo pipefail
export LC_ALL=C

MODE="${1:-local}"
ADRESSE="${2:-}"
APPELS=100

cd "$(dirname "$0")/.."

case "$MODE" in
  local)
    BASE="${ADRESSE:-http://localhost:8789}"
    echo "── $APPELS appels sur $BASE, puis lecture des traces locales ──"
    for _ in $(seq 1 "$APPELS"); do curl -s -o /dev/null "$BASE/api/sante"; done
    curl -s -X POST "$BASE/cdn-cgi/local/explorer/api/local/observability/query" \
      -H 'Content-Type: application/json' \
      -d '{"sql":"SELECT count(*) appels, round(avg(duration_ms),2) moyenne, round(min(duration_ms),2) meilleur, round(max(duration_ms),2) pire FROM spans WHERE parent_id IS NULL"}'
    echo
    echo "Temps d'horloge sur cette machine, pas le temps de processeur chez"
    echo "Cloudflare. À ne pas comparer aux 10 millisecondes."
    ;;

  distant)
    BASE="${ADRESSE:-https://toulouseia.fr}"
    echo "── Écoute des journaux du site en ligne pendant $APPELS appels ──"
    echo "Le relevé s'écrit dans mesure-api.jsonl ; Ctrl+C pour arrêter l'écoute."
    ( sleep 5
      for _ in $(seq 1 "$APPELS"); do curl -s -o /dev/null "$BASE/api/sante"; done
    ) &
    npx wrangler tail --format json | tee mesure-api.jsonl | \
      python3 -c '
import json, sys
temps = []
for ligne in sys.stdin:
    try:
        e = json.loads(ligne)
    except ValueError:
        continue
    t = e.get("cpuTime")
    if t is None:
        continue
    temps.append(t)
    temps.sort()
    n = len(temps)
    print(f"{n:4d} appels — médiane {temps[n // 2]:.2f} ms — "
          f"pire {temps[-1]:.2f} ms — plafond gratuit 10 ms", flush=True)
'
    ;;

  *)
    echo "usage : $0 [local|distant] [adresse]" >&2
    exit 2
    ;;
esac
