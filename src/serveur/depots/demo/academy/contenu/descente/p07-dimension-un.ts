import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Chapitre 3 · page 7 · Descendre, en dimension un
//
// Deux propositions, et la seconde avoue ce qu'elle ne donne pas.
//
// PROPOSITION 1 démontre la note de bas de page de la source : le taux d'erreur
// a un gradient nul là où il existe, donc on ne peut pas le minimiser par
// descente -- et c'est POUR CELA que les activations d'un neurone varient
// continûment au lieu d'être binaires. La figure 13 la montre sur le réseau
// réel : un paramètre balayé, l'escalier d'un côté, la courbe lisse de l'autre.
//
// PROPOSITION 2 justifie le signe moins par l'analyse par cas du chapitre 1,
// puis par le développement au premier ordre. Elle dit « pour eta assez petit »
// et ne quantifie pas : la page 8 procède donc par mesure, et le seuil exact est
// une dette vers le chapitre d'optimisation.
//
// LE PASSAGE A DEUX VARIABLES A ÉTÉ DÉPLACÉ EN FIN DE PAGE. Il y était placé
// en deuxième bloc, avant que le lecteur ait vu la dimension un : il répondait
// à une question qu'on ne s'était pas encore posée. Il sert de pont vers la
// page 8, et c'est là qu'il est désormais.
//
// La dette « perte non convexe » du chapitre 2 est réglée ici.
// ─────────────────────────────────────────────────────────────────────────────

export const D07_DIMENSION_UN: Bloc[] = [
  {
    id: "b-d7-0",
    type: "texte",
    texte:
      "Un marcheur dans le brouillard ne voit que la pente sous ses pieds. Cela suffit-il pour descendre ?",
  },
  {
    id: "b-d7-fig13",
    type: "image",
    ancre: "la-pente-sous-les-pieds",
    src: "/cours/lecon3/l3-fig13-la-pente-sous-les-pieds.svg",
    largeur: 1380,
    hauteur: 680,
    alt: "Une parabole en forme de cuvette, dont le fond touche un axe horizontal marqué zéro. Deux ronds brique sont posés sur la courbe, l'un à gauche du fond et l'autre à droite. Sur chacun, un court segment brique donne la pente en ce point. Sous le rond de gauche, une flèche pointe vers la droite, et la mention pente négative, on va à droite. Sous le rond de droite, une flèche pointe vers la gauche, et la mention pente positive, on va à gauche.",
    legende:
      "La pente en un point suffit à choisir un sens. Elle ne dit pas encore de combien avancer.",
  },
  {
    id: "b-d7-1",
    type: "texte",
    texte:
      "Il faut donc une règle qui dise, à partir de $C_{\\mathcal{D}}$ seule, lequel des $101\\,770$ nombres changer, dans quel sens et de combien.",
  },
  {
    id: "b-d7-2",
    type: "texte",
    texte:
      "Personne ne se représente $\\mathbb{R}^{101\\,770}$. Tout ce qui suit se voit en dimension $1$, où $C$ est une courbe et $\\theta$ un point sur un axe, et **rien de ce qui sera dit en dimension $1$ ne devra être révisé** : la page 8 remplacera un nombre par un vecteur, et c'est tout.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.1 · Résoudre directement ?
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d7-3",
    type: "titre",
    niveau: 2,
    texte: "Pourquoi ne pas résoudre $C'(\\theta)=0$ ?",
  },
  {
    id: "b-d7-4",
    type: "texte",
    texte:
      "C'est la méthode qu'on apprend d'abord, et elle marche quand elle marche : sur $C(\\theta)=\\theta^{2}-4\\theta+7$ on écrit $C'(\\theta)=2\\theta-4$, on résout $2\\theta-4=0$, on trouve $\\theta=2$, et comme $C''=2>0$ c'est bien un minimum, le tout en deux lignes et sans approximation.",
  },
  {
    id: "b-d7-5",
    type: "texte",
    texte:
      "Ici, la même méthode demanderait de résoudre un système de **$101\\,770$ équations à $101\\,770$ inconnues**, non linéaires puisque $\\mathrm{ReLU}$ et $\\mathrm{softmax}$ y sont, et couplées, chaque équation portant sur tous les paramètres à la fois. Aucune méthode générale ne résout un tel système, et il ne s'agit pas d'un problème de puissance de calcul : on ne sait pas l'écrire sous une forme qui se résolve.",
  },
  {
    id: "b-d7-6",
    type: "definition",
    terme: "Fonction convexe",
    anglais: "convex function",
    texte:
      "Une fonction $C:U\\rightarrow\\mathbb{R}$, définie sur une partie convexe $U$, telle que pour tous $\\boldsymbol{\\theta}_{1},\\boldsymbol{\\theta}_{2}\\in U$ et tout $t\\in[0,1]$, $C\\big((1-t)\\boldsymbol{\\theta}_{1}+t\\boldsymbol{\\theta}_{2}\\big)\\leq (1-t)C(\\boldsymbol{\\theta}_{1})+tC(\\boldsymbol{\\theta}_{2})$. Autrement dit, la corde reste au-dessus de la courbe.",
  },
  {
    id: "b-d7-7",
    type: "encart",
    ton: "rappel",
    titre:
      "Dette du chapitre 2 réglée : la perte n'est pas convexe en $\\boldsymbol{\\theta}$",
    texte:
      "Le chapitre 2 a signalé, sans le traiter, que $\\mathrm{ReLU}$ fait perdre à la perte sa convexité en $\\boldsymbol{\\theta}$. Voici ce que cela coûte. Pour une fonction convexe, un creux local, c'est-à-dire un point plus bas que tout son voisinage, est forcément le point le plus bas de toute la courbe, et l'ensemble des minimiseurs est convexe, donc un point ou un segment. Sans convexité, aucune de ces deux garanties ne tient : la descente peut s'arrêter dans un creux qui n'est pas le plus profond, et les minimiseurs peuvent être éparpillés. **La page 11 le montre en construisant $128!$ jeux de paramètres de même coût**, et elle en tire la conséquence pratique sur trois entraînements.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.2 · Proposition 1
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d7-8",
    type: "titre",
    niveau: 2,
    texte: "Pourquoi on ne minimise pas ce qu'on veut vraiment",
  },
  {
    id: "b-d7-9",
    type: "texte",
    texte:
      "Ce qu'on veut, c'est que le réseau se trompe rarement, autrement dit minimiser le **taux d'erreur**. Ce n'est pas ce qu'on minimise, et la raison n'est pas un renoncement pratique : c'est une impossibilité, et elle se démontre.",
  },
  {
    id: "b-d7-fig14",
    type: "image",
    ancre: "escalier-et-courbe",
    src: "/cours/lecon3/l3-fig14-escalier-et-courbe.svg",
    largeur: 1380,
    hauteur: 640,
    alt: "Deux graphes côte à côte, obtenus en faisant varier le même paramètre du réseau. Celui de gauche, intitulé le taux d'erreur, est un escalier : la courbe reste plate sur des intervalles puis saute d'un cran, et les crans sont bien visibles. Sous lui se lit un paramètre balayé, puis quarante et une valeurs. Celui de droite, intitulé le coût, est une courbe lisse et continûment penchée. Sous lui se lit le même paramètre, puis une infinité de valeurs.",
    legende:
      "Un seul paramètre balayé, les deux quantités relevées sur les **quarante** premières images du jeu. Quarante, et non les $60\\,000$, pour que les marches se voient : sur le jeu entier elles font un soixante-millième de haut, et l'escalier se confond à l'œil avec une courbe lisse. La démonstration qui suit ne dépend pas de ce nombre.",
  },
  {
    id: "b-d7-10",
    type: "derivation",
    ancre: "proposition-1",
    titre: "Proposition 1 · Le taux d'erreur ne peut pas servir de coût",
    hypotheses: [
      "$E(\\theta)=\\frac{1}{N}\\sum_{n=1}^{N}\\mathbb{1}\\big\\{\\widehat{c}\\big(f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(n)})\\big)\\neq c^{(n)}\\big\\}$ est le **taux d'erreur** sur $\\mathcal{D}$ : la proportion des $N$ images que le réseau classe mal. $\\widehat{c}$ est la règle de décision du chapitre 2, qui rend l'indice de la plus grande coordonnée.",
      "$N=60\\,000$ est fixé, et **un seul paramètre varie**, noté $\\theta$. Les $101\\,769$ autres sont gelés, si bien que $E$ est une fonction d'une variable réelle.",
    ],
    proprietes: [
      "Une somme de $N$ indicatrices est un entier de $[\\![0,N]\\!]$",
      "Définition de la continuité en un point",
      "Une fonction dérivable en un point y est continue",
    ],
    etapes: [
      {
        texte:
          "**$E$ ne prend qu'un nombre fini de valeurs.** La somme des indicatrices est un entier $k\\in[\\![0,N]\\!]$, donc $E(\\theta)\\in\\{k/N\\ :\\ k\\in[\\![0,N]\\!]\\}$, un ensemble à $N+1=60\\,001$ éléments. Deux valeurs distinctes y diffèrent d'au moins $1/N$.",
      },
      {
        texte:
          "**Soit $\\theta$ un point où $E$ est continue**, c'est-à-dire un point pris sur un palier de l'escalier. Prenons $\\varepsilon=1/(2N)$, deux fois plus petit que l'écart minimal entre deux valeurs possibles. Par continuité, il existe un intervalle $V$ autour de $\\theta$ sur lequel $|E(\\theta')-E(\\theta)|<\\varepsilon$, et comme un écart non nul vaudrait au moins $1/N>\\varepsilon$, cet écart est nul : $E$ est **constante** sur $V$.",
        justification:
          "Définition de la continuité, appliquée à un $\\varepsilon$ choisi plus petit que le pas de la grille des valeurs. C'est le seul endroit où la finitude sert.",
      },
      {
        latex:
          "E'(\\theta)=\\lim_{s\\to 0}\\frac{E(\\theta+s)-E(\\theta)}{s}=\\lim_{s\\to 0}\\frac{0}{s}=0",
        alt: "La dérivée de E en thêta vaut la limite, quand s tend vers zéro, du quotient de la différence entre E en thêta plus s et E en thêta, par s. Ce numérateur est nul dès que thêta plus s reste dans V, donc la limite vaut zéro.",
        justification:
          "Pour $s$ assez petit, $\\theta+s$ reste dans $V$, où $E$ est constante : le numérateur est nul, donc le quotient aussi.",
      },
      {
        texte:
          "Restent les sauts de l'escalier, c'est-à-dire les points où une image au moins bascule d'une classe à l'autre. **En ces points, $E$ n'est pas définie du tout** : la bascule est le moment où deux coordonnées de la sortie sont ex æquo, et le chapitre 2 a laissé $\\widehat{c}$ indéfinie sur les ex æquo. De part et d'autre, $E$ prend deux valeurs distinctes, donc elle n'y est ni continue ni dérivable. Il n'y a donc **aucun** point où $E'$ soit à la fois définie et non nulle.",
        justification:
          "$\\widehat{c}$ n'est pas définie sur les ex æquo, chapitre 2. Ailleurs, la contraposée du fait que la dérivabilité entraîne la continuité suffit.",
      },
    ],
    resultat: {
      latex:
        "E'(\\theta)=0\\quad\\text{partout où }E'\\text{ est définie}",
      alt: "La dérivée de E en thêta est nulle partout où elle est définie.",
    },
    interpretation:
      "La mise à jour $\\theta_{t+1}=\\theta_{t}-\\eta\\cdot 0=\\theta_{t}$ ne bouge jamais. **Aucune descente ne peut minimiser un taux d'erreur**, et l'argument ne doit rien à la dimension un : il vaudra coordonnée par coordonnée quand $\\boldsymbol{\\theta}$ en aura $101\\,770$, ce que la page 8 redira une fois l'objet qui les rassemble défini. On minimise donc $C_{\\mathcal{D}}$, qui n'est pas ce qu'on veut, en espérant que la faire baisser fasse baisser $E$, et la mesure de la page 8 montre que c'est bien ce qui se passe, sans que rien ne le garantisse.",
    limites: [
      "**C'est ici que se justifie une décision du chapitre 2.** Un neurone dont l'activation serait binaire produirait une sortie à valeurs dans un ensemble fini, donc un coût à valeurs dans un ensemble fini, et la démonstration ci-dessus s'appliquerait à lui aussi : le procédé entier s'effondrerait. Les activations varient continûment **pour que le coût soit lisse**, et pour aucune autre raison.",
      "La proposition ne dit pas que $E$ est inutile : $E$ reste la quantité qu'on **rapporte**. Elle dit qu'on ne peut pas la minimiser directement.",
    ],
  },
  {
    id: "b-d7-12",
    type: "verification",
    numero: 25,
    enonce: "Le comptage précède la dérivation.",
    questions: [
      "Montrer que le taux d'erreur d'un réseau sur $60\\,000$ images ne peut prendre que $60\\,001$ valeurs.",
      "En déduire que sa dérivée est nulle là où elle existe.",
      "Cette conclusion dépend-elle de $N$ ? Que se passerait-il pour $N=10^{9}$ ?",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.3 · Proposition 2
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d7-13",
    type: "titre",
    niveau: 2,
    texte: "La règle, et son signe moins",
  },
  {
    id: "b-d7-14",
    type: "texte",
    texte:
      "La figure du début donne le sens du déplacement, et il reste à écrire la règle qui s'en sert. Le chapitre 1 en avait nommé les deux ingrédients sans les assembler : le pas $\\eta$, qu'il appelait la longueur d'un déplacement, et le compteur $t$, qu'il appelait le numéro d'itération de la descente.",
  },
  {
    id: "b-d7-14b",
    type: "formule",
    ancre: "regle-dimension-un",
    latex: "\\theta_{t+1}=\\theta_{t}-\\eta\\,C'(\\theta_{t}),\\qquad \\eta>0",
    alt: "Thêta à l'itération t plus un vaut thêta à l'itération t, moins êta fois la dérivée de C évaluée en thêta à l'itération t, avec êta strictement positif.",
    numero: "7.1",
    legende:
      "On part d'un $\\theta_{0}$ quelconque et on applique cette ligne autant de fois qu'on veut. Deux choses y restent à justifier : le signe moins, qu'établit la proposition qui suit, et la valeur de $\\eta$, que la page 8 cherche par mesure.",
  },
  {
    id: "b-d7-15",
    type: "derivation",
    ancre: "proposition-2",
    titre:
      "Proposition 2 · Le signe moins fait décroître le coût, sous une condition sur $\\eta$",
    hypotheses: [
      "$C:\\mathbb{R}\\rightarrow\\mathbb{R}$ est dérivable, et sa dérivée est continue ; on dit qu'elle est **de classe $\\mathcal{C}^{1}$**.",
      "$\\eta>0$, et $\\theta_{t+1}=\\theta_{t}-\\eta\\,C'(\\theta_{t})$, la règle $(7.1)$.",
      "$C'(\\theta_{t})\\neq 0$ : au point de départ, la pente n'est pas nulle.",
    ],
    proprietes: [
      "Développement au premier ordre : $C(\\theta+s)=C(\\theta)+sC'(\\theta)+o(s)$",
      "Définition du sens de variation par le signe de la dérivée",
    ],
    etapes: [
      {
        texte:
          "**L'analyse par cas d'abord, qui donne le sens du déplacement.** Si $C'(\\theta_{t})>0$, alors $-\\eta\\,C'(\\theta_{t})<0$ donc $\\theta_{t+1}<\\theta_{t}$ : on va vers la gauche, du côté où $C$ décroît. Si $C'(\\theta_{t})<0$, alors $\\theta_{t+1}>\\theta_{t}$ : on va vers la droite, du côté où $C$ décroît. Le cas $C'(\\theta_{t})=0$ est écarté par hypothèse, et la suite y serait de toute façon stationnaire.",
      },
      {
        texte:
          "Le calcul donne ensuite l'ampleur. On pose $s=-\\eta\\,C'(\\theta_{t})$ et on développe :",
      },
      {
        latex:
          "C(\\theta_{t+1})-C(\\theta_{t})=s\\,C'(\\theta_{t})+o(s)=-\\eta\\,C'(\\theta_{t})^{2}+o(\\eta)",
        alt: "La différence entre le coût en thêta t plus un et le coût en thêta t vaut s fois la dérivée en thêta t, plus un petit o de s, c'est-à-dire moins êta fois le carré de la dérivée en thêta t, plus un petit o de êta.",
        justification:
          "Développement au premier ordre, puis substitution de $s$. Le passage de $o(s)$ à $o(\\eta)$ tient à ce que $s$ et $\\eta$ sont **proportionnels** : $s=-\\eta\\,C'(\\theta_{t})$ avec $C'(\\theta_{t})$ fixé et non nul, donc une quantité négligeable devant $s$ l'est aussi devant $\\eta$. Le terme dominant porte le carré de la dérivée, donc il est **négatif quel que soit le signe** de $C'(\\theta_{t})$.",
      },
      {
        texte:
          "**Le seuil se construit alors.** Notons $r(\\eta)$ le terme négligeable, de sorte que la différence vaut $-\\eta\\,C'(\\theta_{t})^{2}+r(\\eta)$. Dire que $r(\\eta)=o(\\eta)$, c'est dire que $r(\\eta)/\\eta$ tend vers $0$, donc qu'il existe $\\eta_{0}>0$ tel que $|r(\\eta)|<\\eta\\,C'(\\theta_{t})^{2}/2$ pour tout $\\eta$ de $]0,\\eta_{0}[$. La différence est alors majorée par $-\\eta\\,C'(\\theta_{t})^{2}/2$, strictement négative.",
        justification:
          "Définition de $o(\\eta)$, appliquée au seuil $C'(\\theta_{t})^{2}/2$, qui est un nombre strictement positif puisque $C'(\\theta_{t})\\neq 0$.",
      },
    ],
    resultat: {
      latex:
        "C'(\\theta_{t})\\neq 0\\ \\Longrightarrow\\ \\exists\\,\\eta_{0}>0,\\ \\forall\\eta\\in\\,]0,\\eta_{0}[,\\quad C(\\theta_{t+1})<C(\\theta_{t})",
      alt: "Si la dérivée en thêta t n'est pas nulle, alors il existe un êta zéro strictement positif tel que, pour tout êta strictement compris entre zéro et êta zéro, le coût en thêta t plus un est strictement inférieur au coût en thêta t.",
    },
    interpretation:
      "Le signe moins n'est ni une convention ni une image : c'est le seul signe qui rende le terme dominant négatif **dans les deux cas de figure**, parce qu'il fait apparaître un carré. Un signe plus donnerait $+\\eta\\,C'(\\theta_{t})^{2}$, positif, et ferait monter le coût aussi sûrement.",
    limites: [
      "**Elle ne donne aucun seuil utilisable.** L'énoncé affirme qu'un $\\eta_{0}$ existe, et la démonstration le construit à partir du reste $r(\\eta)$, qu'on ne sait majorer qu'en connaissant $C$ au point $\\theta_{t}$. Ce seuil change donc à chaque pas.",
      "Elle ne dit rien non plus de ce qui arrive pour $\\eta>\\eta_{0}$ : le coût peut monter, ou osciller, ou diverger.",
      "Le seuil exact relève du chapitre d'optimisation. **C'est pourquoi la page 8 procède par mesure et non par théorème.**",
    ],
  },
  {
    id: "b-d7-17",
    type: "verification",
    numero: 26,
    enonce:
      "La règle $(7.1)$ se met à l'épreuve sur la plus simple des cuvettes, $f(\\theta)=\\theta^{2}$, en partant de $\\theta_{0}=3$.",
    questions: [
      "Écrire la mise à jour $\\theta_{t+1}=\\theta_{t}-\\eta\\,f'(\\theta_{t})$ sous la forme $\\theta_{t+1}=\\lambda\\,\\theta_{t}$, et donner $\\lambda$ en fonction de $\\eta$.",
      "Pour $\\eta=0{,}25$ puis $\\eta=1{,}1$, calculer les quatre premiers termes et dire laquelle des deux suites converge.",
      "Pour quelles valeurs de $\\eta$ la suite converge-t-elle ? Comparer ce seuil à ce que la proposition 2 permettait d'affirmer.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.4 · La bille
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d7-18",
    type: "titre",
    niveau: 2,
    texte: "L'image de la bille, et où elle trompe",
  },
  {
    id: "b-d7-19",
    type: "texte",
    texte:
      "On se représente volontiers la descente comme une bille lâchée sur une surface : elle roule vers le bas, elle finit au fond d'un creux. L'image est utile, parce qu'elle donne le bon geste et fait comprendre qu'il puisse y avoir plusieurs creux, et elle est fausse sur trois points qu'il vaut mieux savoir.",
  },
  {
    id: "b-d7-fig15",
    type: "image",
    ancre: "la-bille-et-la-descente",
    src: "/cours/lecon3/l3-fig15-la-bille-et-la-descente.svg",
    largeur: 1380,
    hauteur: 680,
    alt: "Deux graphes côte à côte montrent la même courbe à deux creux, celui de droite plus profond que celui de gauche. Sur les deux, un rond gris marque le point de lâcher, en haut à gauche. Sur le graphe de gauche, intitulé une bille a de l'inertie, un rond brique marque l'arrivée au fond du creux de droite, et dessous se lit elle franchit le premier creux. Sur le graphe de droite, intitulé la descente n'en a pas, le rond brique marque l'arrivée au fond du creux de gauche, et dessous se lit elle s'arrête au premier.",
    legende:
      "Le paysage est posé par le cours, et non mesuré. Les deux trajets partent du même point et n'arrivent pas au même endroit.",
  },
  {
    id: "b-d7-20",
    type: "tableau",
    ancre: "bille-limites",
    cleEnTete: true,
    entetes: ["Une bille", "La descente"],
    lignes: [
      [
        "A une **inertie** : elle dépasse le fond, remonte de l'autre côté, oscille avant de s'arrêter",
        "N'en a aucune : chaque pas ne dépend que du point courant, et jamais du pas précédent. Elle peut dépasser, mais seulement si $\\eta$ est trop grand, jamais par élan",
      ],
      [
        "Peut franchir une bosse et sortir d'un creux peu profond",
        "Ne le peut pas : arrivée en un point où $C'=0$, elle est immobile pour toujours. C'est exactement ce que la perte non convexe coûte, annoncé plus haut",
      ],
      [
        "Roule dans un paysage qu'on voit, avec un haut et un bas",
        "Se déplace dans $\\mathbb{R}^{101\\,770}$, où il n'y a rien à voir : la section suivante dit à partir de quand",
      ],
    ],
    legende:
      "Les méthodes qui ajoutent une inertie existent, elles s'appellent des méthodes à moment, et elles ne sont pas dans ce chapitre. L'image de la bille les décrit mieux qu'elle ne décrit la descente simple.",
  },
  {
    id: "b-d7-21",
    type: "animation",
    ancre: "la-bille-passe-le-premier-creux",
    animationId: "la-bille-passe-le-premier-creux",
    legende:
      "Une coupe du coût à deux vallées, et une bille qui roule dessus : lancée du même point, elle franchit le premier creux et s'arrête dans le second.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7.5 · Le pont vers la dimension quelconque
  //
  // CE BLOC ÉTAIT EN TÊTE DE PAGE. Il y répondait à une question que le
  // lecteur ne s'était pas encore posée : il parlait de surface et de plan
  // avant qu'on ait descendu une seule courbe. Il est ici, où il sert.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "b-d7-22",
    type: "titre",
    niveau: 2,
    texte: "Ce qui change quand il y a deux variables",
  },
  {
    id: "b-d7-23",
    type: "texte",
    texte:
      "Le passage à deux variables se voit encore, et c'est le dernier qui se voie. Avec $\\boldsymbol{\\theta}=(\\theta_{1},\\theta_{2})$ le domaine n'est plus un axe mais un **plan**, et $C$ n'est plus une courbe au-dessus d'un axe mais une **surface** au-dessus de ce plan : à chaque point du plan correspond une altitude. Descendre veut alors dire choisir une direction dans le plan, et il y en a une infinité au lieu de deux.",
  },
  {
    id: "b-d7-24",
    type: "texte",
    texte:
      "À trois variables la représentation cesse, puisqu'il faudrait une quatrième dimension pour porter l'altitude. C'est pourquoi la page 8 remplace le dessin par un calcul, et non parce que le calcul serait plus rigoureux.",
  },
];
