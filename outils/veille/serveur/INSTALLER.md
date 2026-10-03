# Installer le serveur des vagues

Le serveur est un compte Linux à part, `veille`, sur une machine qui tourne en
continu. Il a besoin de Node 22, de git et de quatre choses que le dépôt ne
contient pas : un jeton GitHub, un jeton Cloudflare, un jeton Claude et le
programme de mise en ligne `~/bin/deployer`.

## Les jetons

Chaque fichier est dans `~/.config/veille/`, en mode 600, au format
`NOM=valeur`.

- `github.env` : `GITHUB_TOKEN`, un jeton à grain fin limité au dépôt
  `toulouseia/site`, avec les droits en écriture sur Contents, Issues et Pull
  requests. Les commentaires du serveur paraissent au nom du compte qui l'a
  créé. Le mieux est un compte GitHub réservé au serveur, absent de
  `curateurs` : sinon, une réaction posée à la main par ce compte sous une
  commande la fait passer pour traitée.
- `cloudflare.env` : `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`, pour
  la mise en ligne et les aperçus.
- `claude.env` : `CLAUDE_CODE_OAUTH_TOKEN`, obtenu avec `claude setup-token`
  sur un poste où Claude Code est connecté.

## Le clone et les minuteurs

```bash
npm install -g --prefix ~/.local @anthropic-ai/claude-code
git clone https://github.com/toulouseia/site.git ~/vagues
git -C ~/vagues config user.name "Veille Toulouse IA"
git -C ~/vagues config user.email "<adresse noreply GitHub du compte du jeton>"
mkdir -p ~/.config/systemd/user ~/.cache
cp ~/vagues/outils/veille/serveur/vagues-* ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now vagues-ouvrir.timer vagues-sonder.timer
```

Le compte doit garder ses minuteurs après la déconnexion :
`sudo loginctl enable-linger veille`.

`~/vagues` est un clone jetable : le programme le remet sur `origin/main` à
chaque passage et efface ce qui n'est pas commité. On n'y travaille jamais à
la main.

## Essayer, couper

```bash
cd ~/vagues && set -a && . ~/.config/veille/github.env && set +a
VEILLE_CLONE_JETABLE=1 node outils/veille/vagues.mjs sonder --a-blanc
VEILLE_CLONE_JETABLE=1 node outils/veille/vagues.mjs ouvrir --maintenant --a-blanc
journalctl --user -u vagues-sonder -n 50
systemctl --user disable --now vagues-ouvrir.timer vagues-sonder.timer
```

`--a-blanc` fait tout sauf écrire sur GitHub et mettre en ligne. Pour couper
sans toucher au serveur, on change `reglages.json` sur `main`.
