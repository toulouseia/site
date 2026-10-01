#!/usr/bin/env bash
# Pose les secrets de connexion chez Cloudflare, sans qu'ils passent nulle part
# ailleurs.
#
#   npm run secrets
#
# Ce qu'il faut savoir avant de lancer :
#
#   · Un secret ne se relit jamais, ni ici, ni dans le tableau de bord de
#     Cloudflare. Si vous le perdez, vous en fabriquez un nouveau chez Google ou
#     chez GitHub et vous relancez ce programme. Rien n'est cassé pour autant.
#   · Ce que vous tapez ne s'affiche pas à l'écran, n'entre dans aucun fichier
#     du dépôt, et n'apparaît dans l'historique d'aucun terminal : le texte va
#     directement de votre clavier à Cloudflare.
#   · Chaque secret va avec un identifiant public, déjà écrit dans
#     `wrangler.jsonc`. Si vous changez d'application chez Google ou chez
#     GitHub, changez les deux.
#
# Où les trouver :
#
#   GOOGLE_SECRET  console.cloud.google.com → Google Auth Platform → Clients →
#                  Toulouse IA. Le secret s'affiche dans le panneau de droite.
#   GITHUB_SECRET  github.com/organizations/toulouseia/settings/applications →
#                  Toulouse IA → « Generate a new client secret ». GitHub ne le
#                  montre qu'une fois, sur cette page, juste après l'avoir créé.
set -euo pipefail
export LC_ALL=C

cd "$(dirname "$0")/.."

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -r "$HOME/.config/cloudflare/toulouseia.token" ]; then
  CLOUDFLARE_API_TOKEN="$(cat "$HOME/.config/cloudflare/toulouseia.token")"
  export CLOUDFLARE_API_TOKEN
fi

poser() {
  local nom="$1" ou="$2"
  echo
  echo "── $nom"
  echo "   $ou"
  printf '   Collez le secret puis Entrée (rien ne s'\''affiche), ou Entrée seule pour passer : '
  local valeur
  read -r -s valeur
  echo
  if [ -z "$valeur" ]; then
    echo "   passé."
    return
  fi
  printf '%s' "$valeur" | npx wrangler secret put "$nom"
  unset valeur
}

echo "Les secrets vont directement chez Cloudflare. Rien n'est écrit sur ce disque."
poser GOOGLE_SECRET "console.cloud.google.com → Google Auth Platform → Clients → Toulouse IA"
poser GITHUB_SECRET "github.com/organizations/toulouseia/settings/applications → Toulouse IA → Generate a new client secret"

echo
echo "── Ce que le site connaît maintenant ──"
npx wrangler secret list
echo
echo "Il reste à remettre le site en ligne pour que le programme les voie :"
echo "  npm run deploy"
