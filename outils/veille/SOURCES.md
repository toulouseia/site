# Les sources de la veille : ce qu'on a le droit d'en faire

Ce fichier garde la lecture des conditions d'utilisation et des robots.txt de
chaque source. Tout a été lu en ligne le 23 septembre 2026. Les passages cités
sont recopiés mot pour mot, dans leur langue. Ce n'est pas un avis juridique.

Si une source change ses conditions, on met à jour sa section et la date.

## Ce qu'on fait avec une source

Chaque verdict porte sur cinq usages :

1. **Lecture automatique** : un programme lit la source une fois par semaine,
   une requête à la fois, sous le nom `toulouseia-veille/1` avec l'adresse du
   club.
2. **Nos lignes et un lien** : une personne écrit en français un titre, une
   valeur et une ligne « pourquoi », avec un lien vers l'article d'origine,
   sur le site et sur les affiches Instagram.
3. **Premier jet par Claude** : le résumé de la source part chez Claude pour
   un premier jet, relu ensuite ligne à ligne.
4. **Copie dans le dépôt** : un vrai numéro garde un exemple pour les essais.
5. **Le nom** : on cite la source ou l'entreprise, par exemple « via TLDR AI ».

## Le résumé

| source | lecture automatique | nos lignes et un lien | premier jet par Claude | copie dans le dépôt |
|---|---|---|---|---|
| TLDR, toutes les lettres | oui | oui | oui | dépôt privé seulement |
| AlphaSignal | **non** | à la main seulement | non | **non** |
| OpenAI | oui, par le fil RSS | oui | oui | exemple écrit à la main |
| Anthropic | non, à la main | oui | oui | non |
| Google DeepMind | oui | oui | oui | exemple écrit à la main |
| Meta AI | **non**, à la main | oui | oui, sur un texte copié à la main | non |
| Mistral AI | oui | oui | oui | exemple écrit à la main |
| NVIDIA | oui, par les fils | oui | oui | exemple écrit à la main |
| Hugging Face | oui | oui | oui | exemple écrit à la main |
| arXiv | pas utilisé directement | oui | oui | non |
| Hacker News | oui, par l'API seulement | oui | titres et liens, pas les commentaires | exemple écrit à la main |
| GitHub | oui, par l'API | oui, avec notre description | oui | exemple écrit à la main |
| CNIL | oui | oui, avec le crédit complet si on cite | oui | non |
| Commission européenne | oui | oui, avec le crédit | oui | non |
| Inria, ANITI | oui | nos mots seulement, pas de titre recopié | **titre seulement** | **non** |

Pour toutes : pas de logo, pas d'image, pas de capture sur les affiches, et
rien qui laisse croire à un partenariat.

## TLDR

**Conditions** : https://tldr.tech/terms, sans date. La politique de
confidentialité, https://tldr.tech/privacy, date du 19 février 2025.

Les conditions ne parlent ni de lecture automatique, ni d'usage commercial, ni
de reproduction, ni d'IA. Elles interdisent seulement :

> "send bulk, spam, or unsolicited communications to third parties / attack or disrupt the normal flow of work, dialogue, or communications of any system / engage in activities that violate the laws of both the United States and the United Kingdom / attack, defame, or intimidate other users"

Faute de licence, le texte des numéros reste protégé par le droit d'auteur :
on n'en recopie rien sur le site.

**robots.txt** : tout est permis sauf `/subscribed`, `/confirmed`, `/manage`,
`/info` et `/finish`. Le fil annonce `<ttl>60</ttl>`.

**Les lettres lues** : AI en entier ; Tech, Dev, DevOps, Data, Hardware,
InfoSec et IT pour leurs seuls sujets d'IA. Les mêmes conditions valent pour
toutes. Marketing, Crypto, Fintech, Design, Founders et Product sont écartées
parce qu'elles parlent trop peu d'IA.

**À retenir** : le seul vrai numéro gardé dans `essais/` est acceptable tant que
le dépôt est privé. Il faudra le remplacer par un exemple écrit à la main avant
de rendre le dépôt public.

## AlphaSignal

**Conditions** : https://alphasignal.ai/terms, en vigueur le 12 mai 2026. Elles
couvrent « the website located at alphasignal.ai, alphasignal.ai/newsletter,
and any related subdomains », donc aussi `api.alphasignal.ai`.

> "Use any robot, spider, scraper, crawler, or other automated means to access, copy, or extract content from the Services without our prior written permission"

> "Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services without our express written permission"

> "license to access and use the Services and view the Alpha Signal Content for your personal, non-commercial use. No other right or license is granted"

> "Use the Services or any content from the Services to train, fine-tune, or otherwise develop any machine learning or artificial intelligence model without our prior written permission."

Droit du Delaware, arbitrage à Wilmington.

**robots.txt** : `api.alphasignal.ai` refuse tout sauf `/api/news/preview/` et
`/mcp/server-card`. `alphasignal.ai` refuse `/api/`.

**À retenir** : pas de lecture automatique tant qu'ils n'ont pas donné leur
accord par écrit. On la lit comme un abonné, et un sujet lu là s'ajoute à la
main avec le lien de l'article d'origine. Une demande d'accord est à envoyer à
legal@alphasignal.ai. Le 23 septembre 2026, leur API a été lue par erreur avant
la lecture des conditions ; tout ce qui avait été téléchargé a été effacé.

## OpenAI

**Conditions** : https://openai.com/policies/terms-of-use/, mises à jour le
16 janvier 2026. Elles couvrent les sites associés.

> "Automatically or programmatically extracting data or Output"

> "You may only use our name and logo in accordance with our Brand Guidelines"

**robots.txt** : tout est permis sauf `/microsoft-for-startups/`.

**À retenir** : on lit le fil `https://openai.com/news/rss.xml`, publié pour
être lu par des programmes. On ne lit jamais les pages HTML du site, qui
répondent d'ailleurs 403.

## Anthropic

**Conditions** : https://www.anthropic.com/legal/consumer-terms, en vigueur le
8 octobre 2025. Il n'y a pas de conditions propres au site.

> "To crawl, scrape, or otherwise harvest data or information from our Services other than as permitted under these Terms."

> "…to access the Services through automated or non-human means, whether through a bot, script, or otherwise."

> "You may not, without our prior written permission, use our name, logos, or other trademarks … in any other way that implies our affiliation, endorsement, or sponsorship."

**robots.txt** : tout est permis.

**À retenir** : pas de fil RSS. On lit `anthropic.com/news` à la main. Le
`sitemap.xml`, publié pour les robots, serait la voie la plus propre si on
voulait l'automatiser un jour ; ce n'est pas fait.

## Google DeepMind

**Conditions** : https://policies.google.com/terms, en vigueur le 30 juillet
2026.

> "using automated means to access content from any of our services in violation of the machine-readable instructions on our web pages (for example, robots.txt files that disallow crawling, training, or other activities)"

> "Don't remove, obscure, or alter any of our branding, logos, or legal notices."

**robots.txt** : tout est permis. L'interdiction de Google renvoie au
robots.txt, donc la lecture du fil est permise.

**À retenir** : fil `https://deepmind.google/blog/rss.xml`.

## Meta AI

**Conditions** : https://www.facebook.com/legal/terms, en vigueur le 1er janvier
2025.

> "You may not access or collect data from our Products using automated means (without our prior permission)"

> "You can only use our copyrights or trademarks … as expressly permitted by our Brand Usage Guidelines or with our prior written permission."

**robots.txt** : en tête, « Collection of data on Facebook through automated
means is prohibited unless you have express written permission from
Facebook ».

**À retenir** : pas de fil RSS, et pas de lecture automatique. On lit
`ai.meta.com/blog` à la main.

## Mistral AI

**Conditions** : pas de conditions propres au site. La mention légale est sur
https://mistral.ai/legal/. Les conditions grand public,
https://legal.mistral.ai/terms/eu-consumers-terms-of-service, en vigueur le
7 août 2026, couvrent aussi « the other websites » :

> "(f) Use any method to extract any content from the Mistral AI Products other than as permitted through the Mistral AI Products"

**robots.txt** : tout est permis.

**À retenir** : le fil `https://mistral.ai/news/rss` est annoncé par la page
elle-même, c'est donc un moyen prévu par le site. Il est servi en `text/plain`
mais se lit comme un RSS normal.

## NVIDIA

**Conditions** : https://www.nvidia.com/en-us/about-nvidia/terms-of-service/,
version du 15 juillet 2026.

> "use any robot, spider, scraper, crawler … to access, acquire, copy or monitor any portion of the Site … to obtain or attempt to obtain any materials … through any means not purposely made available through the Site"

> "You may not use NVIDIA's trademarks without NVIDIA's prior written permission"

**robots.txt** : tout est permis, et les deux fils y sont déclarés comme
`Sitemap:`. Ils sont donc « purposely made available ».

**À retenir** : fils `https://blogs.nvidia.com/feed/` et
`https://developer.nvidia.com/blog/feed/`. Le jeu vidéo et la vie de
l'entreprise sont écartés.

## Hugging Face

**Conditions** : https://huggingface.co/terms-of-service, en vigueur le
15 septembre 2022. Politique de contenu du 10 avril 2025, qui interdit
« excessive bulk activity ».

> "Any Content you download, access or use from us or another User, is at your own risk and subject to these Terms and/or the terms accompanying such Content."

**Limite** : 500 appels par tranche de 5 minutes sans compte. On en fait une
dizaine par récolte.

**robots.txt** : tout est permis.

**À retenir** : les papiers du jour, `api/daily_papers`, et les modèles en
tendance, `api/models?sort=trendingScore`. Les résumés des papiers viennent
d'arXiv et sont libres, voir plus bas. Le lien d'un papier va vers sa page
arXiv.

## arXiv

On ne lit pas l'API d'arXiv directement : les papiers arrivent par Hugging
Face. Si un jour on la lit, voici les règles.

**Conditions** : https://info.arxiv.org/help/api/tou.html, sans date.

> "You are free to use descriptive metadata about arXiv e-prints under the terms of the Creative Commons Universal (CC0 1.0)"

Les métadonnées comprennent le titre, le résumé et les auteurs. Les autres
règles : une requête toutes les trois secondes au plus, un lien vers la page du
résumé, pas de PDF servi par nous, pas de logo, rien qui laisse croire à un
soutien d'arXiv, et cette phrase sur le site :

> "Thank you to arXiv for use of its open access interoperability."

## Hacker News

**Conditions** : https://www.ycombinator.com/legal, mises à jour en septembre
2026.

> "you will not engage in or use any data mining, robots, scraping or similar data gathering or extraction methods"

L'API officielle est publiée par Hacker News lui-même, sans limite annoncée.
L'API de recherche d'Algolia, désignée par Hacker News, limite à 10 000
requêtes par heure. Le robots.txt du site demande `Crawl-delay: 30`.

**À retenir** : on passe par l'API d'Algolia, jamais par les pages du site. On
garde les titres, les liens et les points, pas les commentaires, qui sont à
leurs auteurs.

## GitHub

**Conditions** : https://docs.github.com/en/site-policy/github-terms/github-terms-of-service,
en vigueur le 27 avril 2026, section H sur l'API. Politique d'usage acceptable :

> "Scraping does not refer to the collection of information through our API."

> "Abuse or excessively frequent requests to GitHub via the API may result in the temporary or permanent suspension"

**Limite** : 10 recherches par minute sans jeton. On en fait une par récolte.

**À retenir** : le nom d'un dépôt et ses étoiles sont des faits. Sa
description est le texte de son auteur : elle aide à choisir, on écrit la
nôtre sur le site.

## CNIL

**Mentions légales** : https://www.cnil.fr/fr/mentions-legales. Les textes sont
sous licence **CC BY-ND 4.0**, pas sous Licence Ouverte. Les images sont sous
CC BY-NC-ND.

> "vous devez créditer les contenus, intégrer un lien vers la licence et préciser la date à laquelle le contenu a été extrait du site"

**À retenir** : fil `https://www.cnil.fr/fr/rss.xml`, trié sur l'IA. Si on cite
un titre ou une phrase, on écrit « Source : CNIL – https://www.cnil.fr », la
date et la licence, et on ne modifie pas la citation. Nos propres mots n'ont
pas besoin de ce crédit.

## Commission européenne

**Mention légale** : https://digital-strategy.ec.europa.eu/en/pages/legal-notice,
mise à jour le 19 janvier 2026. Contenus sous CC BY 4.0, selon la décision
2011/833/UE.

> "reuse is allowed, provided appropriate credit is given and changes are indicated"

Les logos et les noms sont exclus de la licence.

**À retenir** : fil `https://digital-strategy.ec.europa.eu/en/rss.xml`, trié sur
l'IA. Crédit : le titre, « Union européenne » et l'adresse de la page.

## Inria

**Mentions légales** : https://www.inria.fr/fr/mentions-legales. Aucune licence
de réutilisation.

> "vous vous engagez à ne pas copier, traduire, reproduire, vendre, publier, exploiter et diffuser des contenus du site ... sans autorisation préalable et écrite d'Inria."

**À retenir** : fil `https://www.inria.fr/fr/news_events/rss.xml`, trié sur
l'IA. L'ancien fil `/fr/rss.xml` ne bouge plus depuis 2024. Nos mots et un lien
seulement. Seul le titre part chez Claude, parce que l'interdiction vise aussi
la traduction. Aucun exemple de leur fil dans le dépôt.

## ANITI

**Mentions légales** : https://aniti.univ-toulouse.fr/en/mentions-legales/.
Aucune licence de réutilisation.

> "Sauf autorisation, toute utilisation des œuvres autres que la reproduction et la consultation individuelles et privées sont interdites."

**À retenir** : fil `https://aniti.univ-toulouse.fr/feed/`. Ses balises sont en
minuscules et certaines entrées n'ont pas de date : elles prennent alors la
date de la récolte. Mêmes règles qu'Inria.
