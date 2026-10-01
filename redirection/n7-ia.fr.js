// L'ancien nom renvoie vers le nouveau. Ce programme remplace les pages du
// site sur n7-ia.fr depuis le 14 septembre 2026 : toute adresse, avec son
// chemin, part vers la même adresse sur toulouseia.fr, en « déplacé
// définitivement » (301) pour que les moteurs de recherche transfèrent ce
// qu'ils savaient de l'ancien nom au nouveau.
export default {
  fetch(requete) {
    const u = new URL(requete.url);
    u.hostname = "toulouseia.fr";
    u.protocol = "https:";
    return Response.redirect(u.toString(), 301);
  },
};
