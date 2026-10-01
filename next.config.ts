import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `export` : la construction ne produit pas un serveur, mais un dossier de
  // pages toutes fabriquées d'avance, dans `out/`. C'est ce qui permet de
  // poser l'application sur Cloudflare sans machine qui tourne derrière, donc
  // sans frais et sans panne possible côté serveur.
  //
  // Ce que cela interdit, tant que ce réglage est là : aucune page ne peut
  // être calculée à la demande, aucune adresse ne peut recevoir de formulaire,
  // aucun secret ne peut rester côté serveur. Le jour où un vrai service
  // existe, il sera appelé depuis le navigateur, ou ce réglage sautera.
  output: "export",
  // Chaque page est un dossier avec son `index.html` (`out/profil/index.html`)
  // plutôt qu'un fichier nu (`out/profil.html`), et les adresses se terminent
  // par une barre. C'est la forme que Cloudflare sert sans redirection quand on
  // demande `/profil/`, et celle que les contrôles de livraison attendent.
  trailingSlash: true,
};

export default nextConfig;
