#!/usr/bin/env python3
"""Crée la zone toulouseia.fr sur Cloudflare et y recopie les enregistrements
d'OVH, sans passer par le tableau de bord (dont l'écran « ajouter un domaine »
se bloque sur les .fr, 14 septembre 2026).

Le jeton est lu dans ~/.config/cloudflare/toulouseia.token et n'est jamais
affiché. Le script est rejouable : ce qui existe déjà est laissé en place.
"""
import json, os, sys, urllib.request, urllib.error

ZONE = "toulouseia.fr"
# Le compte de l'association (contact@toulouseia.fr) — visible dans l'adresse du
# tableau de bord, pas un secret. Le jeton n'a pas le droit de lister les
# comptes, il faut donc le lui dire.
COMPTE = "fb289fb4b372e69601939ec9b7ca79e3"
JETON = os.path.expanduser("~/.config/cloudflare/toulouseia.token")
API = "https://api.cloudflare.com/client/v4"

# Relevé le 14 septembre 2026 par interrogation directe de ns111.ovh.net.
# Le A de la page d'attente d'OVH n'est pas repris (voir plus bas). « proxied » = passe par Cloudflare (orange) ; le courrier, non.
ENREGISTREMENTS = [
    # Pas de A pour l'apex ni www : c'est le programme du site qui les pose
    # (domaine personnalisé wrangler), et il refuse s'il en trouve déjà.
    {"type": "CNAME", "name": "ftp", "content": "toulouseia.fr", "proxied": False},
    {"type": "MX",  "name": "@", "content": "mx0.mail.ovh.net", "priority": 1},
    {"type": "MX",  "name": "@", "content": "mx1.mail.ovh.net", "priority": 5},
    {"type": "MX",  "name": "@", "content": "mx2.mail.ovh.net", "priority": 50},
    {"type": "MX",  "name": "@", "content": "mx3.mail.ovh.net", "priority": 100},
    {"type": "TXT", "name": "@", "content": "v=spf1 include:mx.ovh.com ~all"},
    {"type": "SRV", "name": "_autodiscover._tcp",
     "data": {"priority": 0, "weight": 0, "port": 443, "target": "zimbra1.mail.ovh.net"}},
]

def appel(methode, chemin, corps=None):
    with open(JETON) as f:
        jeton = f.read().strip()
    req = urllib.request.Request(API + chemin, method=methode,
        headers={"Authorization": "Bearer " + jeton, "Content-Type": "application/json"},
        data=json.dumps(corps).encode() if corps is not None else None)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.load(e)

def main():
    v = appel("GET", "/user/tokens/verify")
    print("jeton :", v["result"]["status"] if v.get("success") else v.get("errors"))
    if not v.get("success"):
        sys.exit(1)

    z = appel("GET", f"/zones?name={ZONE}")
    if z["result"]:
        zone = z["result"][0]
        print("zone déjà là :", zone["id"], zone["status"])
    else:
        r = appel("POST", "/zones", {"name": ZONE, "account": {"id": COMPTE}, "type": "full"})
        if not r.get("success"):
            print("création refusée :", r.get("errors")); sys.exit(1)
        zone = r["result"]
        print("zone créée :", zone["id"], zone["status"])
    zid = zone["id"]
    print("serveurs de noms à mettre chez OVH :", *zone["name_servers"])

    existants = appel("GET", f"/zones/{zid}/dns_records?per_page=200")["result"]
    cle = lambda e: (e["type"], e["name"], e.get("content", ""))
    deja = {cle(e) for e in existants}
    for e in ENREGISTREMENTS:
        nom = ZONE if e["name"] == "@" else e["name"] + "." + ZONE
        contenu = e.get("content", "")
        if e["type"] == "SRV":
            contenu = f'{e["data"]["priority"]} {e["data"]["weight"]} {e["data"]["port"]} {e["data"]["target"]}'
        if e["type"] == "TXT":
            contenu = '"' + e["content"] + '"'
        if (e["type"], nom, contenu) in deja or (e["type"], nom, e.get("content", "")) in deja:
            print("  déjà :", e["type"], nom); continue
        corps = dict(e); corps["name"] = nom; corps.setdefault("ttl", 1)
        r = appel("POST", f"/zones/{zid}/dns_records", corps)
        print("  posé :" if r.get("success") else "  REFUSÉ :", e["type"], nom, "" if r.get("success") else r.get("errors"))

    for reglage, valeur in [("always_use_https", "on"), ("ssl", "full")]:
        r = appel("PATCH", f"/zones/{zid}/settings/{reglage}", {"value": valeur})
        print("réglage", reglage, "=", r["result"]["value"] if r.get("success") else r.get("errors"))

if __name__ == "__main__":
    main()
