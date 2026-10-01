import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// L'optimisation de l'entraînement, suite : le pas, l'initialisation, la forme
// des entrées, l'évanescence, et la clôture.
//
// Mesures produites par cours/lecon3/experiences2.py, figures par
// cours/lecon3/figures.py. Graine 0 partout.
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENU_OPTIMISATION_SUITE: Record<string, Bloc[]> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // Page 4 · le pas
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-3": [
    {
      id: "b-o3-1",
      type: "texte",
      texte:
        "La page 2 n'a prouvé qu'une chose **locale** : la direction. Il ne dit rien du pas fini $\\eta$. Prenons donc la fonction la plus simple qui ait un minimum, et calculons **tout**.",
    },
    {
      id: "b-o3-2",
      type: "derivation",
      ancre: "seuil-exact",
      titre: "Le seuil exact de convergence sur un quadratique",
      hypotheses: [
        "$f(\\theta)=\\tfrac12\\lambda\\theta^{2}$ avec $\\lambda>0$, de minimum $\\theta^{*}=0$",
        "Le pas est constant : $\\eta>0$ ne dépend pas de $t$",
      ],
      depart: {
        latex: "\\theta_{t+1}=\\theta_t-\\eta f'(\\theta_t), \\qquad f'(\\theta)=\\lambda\\theta",
        alt: "Thêta t plus un égale thêta t moins êta fois la dérivée de f en thêta t, et cette dérivée vaut lambda thêta.",
      },
      proprietes: [
        "La caractérisation de la convergence d'une **suite géométrique** : $q^t\\to0$ si et seulement si $|q|<1$",
      ],
      etapes: [
        {
          texte: "On substitue la dérivée et on factorise :",
          latex: "\\theta_{t+1}=\\theta_t-\\eta\\lambda\\theta_t=(1-\\eta\\lambda)\\,\\theta_t",
          alt: "Thêta t plus un égale un moins êta lambda, fois thêta t.",
          justification: "substitution puis factorisation",
        },
        {
          texte:
            "C'est une suite géométrique de raison $q=1-\\eta\\lambda$, dont le terme général s'écrit directement :",
          latex: "\\theta_t=(1-\\eta\\lambda)^{t}\\,\\theta_0",
          alt: "Thêta t égale un moins êta lambda, puissance t, fois thêta zéro.",
          justification: "récurrence immédiate",
        },
        {
          texte: "La convergence vers zéro équivaut donc à $|q|<1$, qu'on résout :",
          latex:
            "|1-\\eta\\lambda|<1 \\iff -1<1-\\eta\\lambda<1 \\iff 0<\\eta\\lambda<2",
          alt: "La valeur absolue de un moins êta lambda est inférieure à un, si et seulement si êta lambda est compris strictement entre zéro et deux.",
          justification: "définition de la valeur absolue, puis soustraction de 1 et changement de signe",
        },
      ],
      resultat: {
        latex: "0<\\eta<\\frac{2}{\\lambda}",
        alt: "Êta doit être strictement compris entre zéro et deux sur lambda.",
      },
      interpretation:
        "Le seuil ne dépend ni du point de départ, ni du nombre d'itérations : c'est une propriété de la **courbure** $\\lambda$ seule. Plus la fonction est courbée, plus le pas doit être court.",
    },
    {
      id: "b-o3-3",
      type: "sortie",
      titre: "Les quatre régimes, calculés",
      texte: `         eta  1 - eta lambda   |facteur|   theta_0=1 -> theta_1..theta_5
        0.25            0.75        0.75   +0.7500  +0.5625  +0.4219  +0.3164  +0.2373
        0.50            0.50        0.50   +0.5000  +0.2500  +0.1250  +0.0625  +0.0312
        1.00            0.00        0.00   +0.0000  +0.0000  +0.0000  +0.0000  +0.0000
        1.50           -0.50        0.50   -0.5000  +0.2500  -0.1250  +0.0625  -0.0312
        2.00           -1.00        1.00   -1.0000  +1.0000  -1.0000  +1.0000  -1.0000
        2.10           -1.10        1.10   -1.1000  +1.2100  -1.3310  +1.4641  -1.6105`,
      lecture: [
        "$q$ entre 0 et 1 : décroissance **monotone**.",
        "$q=0$, soit $\\eta=1/\\lambda$ : le minimum est atteint **en un seul pas**. C'est le pas optimal, calculable ici parce que $\\lambda$ est connu.",
        "$q$ entre $-1$ et 0 : le signe alterne, on **saute par-dessus** le minimum à chaque fois, mais on s'en rapproche.",
        "$|q|\\ge1$ : à $\\eta=2$ exactement, oscillation d'amplitude **constante**, jamais de convergence. Au-delà, l'écart est multiplié par $1{,}10$ à chaque pas.",
      ],
    },
    {
      id: "b-o3-4",
      type: "titre",
      niveau: 2,
      texte: "En dimension p : la courbure devient un spectre",
    },
    {
      id: "b-o3-5",
      type: "texte",
      texte:
        "Généralisons au quadratique multivarié $f(\\theta)=\\tfrac12\\theta^{\\top}H\\theta$, avec $H$ symétrique définie positive. Alors $\\operatorname{grad}f(\\theta)=H\\theta$ (vérification des dimensions : $(p\\times p)(p\\times1)=p\\times1$, et un gradient a bien la dimension de $\\theta$).",
    },
    {
      id: "b-o3-6",
      type: "texte",
      texte:
        "En diagonalisant $H=Q\\Lambda Q^{\\top}$ et en posant $\\tilde\\theta=Q^{\\top}\\theta$, chaque coordonnée évolue **indépendamment** selon $\\tilde\\theta_{i,t}=(1-\\eta\\lambda_i)^{t}\\tilde\\theta_{i,0}$. Le problème se décompose en $p$ problèmes à une variable, chacun avec sa courbure. La convergence exige la condition pour **toutes** les coordonnées, donc pour la plus grande.",
    },
    {
      id: "b-o3-7",
      type: "formule",
      latex: "0<\\eta<\\frac{2}{\\lambda_{\\max}}, \\qquad \\kappa=\\frac{\\lambda_{\\max}}{\\lambda_{\\min}}",
      alt: "Êta doit être strictement compris entre zéro et deux sur la plus grande valeur propre. Le conditionnement kappa est le rapport de la plus grande à la plus petite valeur propre.",
      numero: "3",
      legende:
        "C'est la direction la plus courbée qui plafonne le pas, et la moins courbée qui fixe la vitesse. Le rapport des deux s'appelle le conditionnement.",
    },
    {
      id: "b-o3-8",
      type: "encart",
      ton: "attention",
      titre: "Ce qui ne se transporte pas au réseau",
      texte:
        "Le réseau n'est pas quadratique et sa hessienne change à chaque pas. Tout ce qui précède est **exact pour un quadratique** et ne vaut ici que comme guide. Ce qui suit n'est donc pas une déduction : c'est une mesure.",
    },
    {
      id: "b-o3-9",
      type: "titre",
      niveau: 2,
      texte: "Sur le réseau : la mesure, et ce qu'elle corrige",
    },
    {
      id: "b-o3-10",
      type: "sortie",
      titre: "python cours/lecon3/experiences2.py E5 · 937 mises à jour, B = 64",
      texte: `           eta   perte finale   pire perte    ||theta||   precision test
         0.001         2.2312         2.56         11.8           0.3883   <- trop lent
      (depart)                                     11.8
         0.010         1.5757         2.47         12.2           0.7240   <- trop lent
         0.100         0.3919         2.39         16.6           0.8950
         0.500         0.2575         2.96         21.0           0.9208
         1.000         0.1958         4.74         25.3           0.9393
         3.000         0.1826         7.07         40.7           0.9410
        10.000         0.6677        17.44        105.2           0.7961   <- degrade
        30.000         5.2892        24.22        441.2           0.2051   <- pire que le hasard
       100.000        24.2415        27.20       2937.1           0.1032   <- pire que le hasard
       300.000        24.6940        27.63      15395.8           0.1010   <- pire que le hasard`,
      lecture: [
        "**Une correction que la mesure impose.** J'allais écrire « au-delà d'un seuil, la perte diverge ». C'est faux. À aucun $\\eta$ testé, jusqu'à 300, la perte ne devient infinie ni indéfinie.",
        "La raison est dans le code : la perte est calculée avec un plancher de $10^{-12}$ sur les probabilités, donc elle ne peut pas dépasser $-\\ln(10^{-12})=12\\ln10=27{,}63$. Et l'on mesure exactement $27{,}63$ à $\\eta=300$. **Le plafond observé est le plancher numérique, pas une propriété du réseau.**",
        "Le vrai témoin de la divergence est la **norme des paramètres** : $11{,}8 \\to 105{,}2 \\to 441{,}2 \\to 2937{,}1 \\to 15\\,395{,}8$, soit un facteur 1305. Les paramètres partent bien à l'infini ; c'est la perte qui ne peut pas les suivre.",
        "**Trop petit** ($\\eta\\le0{,}01$) : la norme bouge à peine, et la courbe de perte descend proprement. C'est l'échec difficile à voir, parce qu'il ressemble à un entraînement qui marche.",
        "**La plage utile couvre un facteur 30** ($0{,}1$ à $3$). C'est ce qui rend le réglage par tâtonnement praticable.",
      ],
    },
    {
      id: "b-o3-11",
      type: "image",
      ancre: "figure-pas",
      src: "/cours/lecon3/l3-fig3-pas.png",
      largeur: 1380,
      hauteur: 509,
      alt: "Deux panneaux. À gauche, en échelle logarithmique, l'écart au minimum pour quatre valeurs du pas sur le quadratique : trois droites descendantes pour les pas convergents, une droite montante pour le pas de 2,10. À droite, les courbes de perte du réseau pour quatre valeurs du pas, avec la norme finale des paramètres en légende, et une ligne horizontale marquant le plafond de calcul à 27,63.",
      legende:
        "(a) Le seuil exact est visible : au-delà de 2 sur lambda, l'écart au minimum grandit. (b) Sur le réseau, la perte ne renvoie jamais l'infini ; elle plafonne au plancher numérique, pendant que la norme des paramètres passe de 11,8 à 15 396.",
    },
    {
      id: "b-o3-12",
      type: "demo",
      demo: "pas-apprentissage",
      titre: "Régler le pas, et voir la trajectoire",
      alt: "Une démonstration interactive : un curseur règle le taux d'apprentissage ; la trajectoire de la descente sur une surface en cuvette allongée se redessine à chaque changement, et la courbe de coût correspondante s'affiche à côté.",
      legende:
        "La surface est $f(x,y)=\\tfrac12 x^{2}+3y^{2}$, de courbures $1$ et $6$ : le seuil exact vaut donc $2/6\\approx0{,}333$. Descendez à 0,005, la trajectoire s'arrête avant d'arriver ; montez à 0,35, elle sort du cadre. Entre les deux, tout marche.",
      parametres: { pas: 0.1, iterations: 25 },
    },
    {
      id: "b-o3-13",
      type: "encart",
      ton: "astuce",
      titre: "La méthode qui en découle",
      texte:
        "Commencer haut, diviser par trois tant que la précision se dégrade. Quatre ou cinq essais de quelques dizaines de secondes suffisent, et c'est plus rapide que de raisonner sur une valeur propre maximale qu'on ne connaît pas.",
    },
    {
      id: "b-o3-14",
      type: "verification",
      numero: 11,
      enonce:
        "À $\\eta=3$, la précision est $0{,}9410$, la meilleure de la table, et la pire perte rencontrée en cours de route est $7{,}07$, bien au-dessus de $\\ln 10=2{,}30$, la perte d'un réseau qui répondrait au hasard.",
      questions: [
        "Comment un entraînement peut-il passer par un état **pire que le hasard** et finir meilleur que tous les autres ? Donne l'explication en termes de trajectoire.",
        "Quelle quantité faudrait-il tracer, en plus de la perte, pour distinguer cette situation d'un vrai début de divergence ?",
      ],
    },
    {
      id: "b-o3-15",
      type: "repere",
      cherche: "Les conditions pour qu'une suite de pas amène quelque part.",
      pourquoi:
        "Direction, données et longueur du pas règlent la mise à jour, mais pas son point de départ.",
      ou: "Les trois degrés de liberté de la règle sont traités.",
      suite:
        "Le point de départ. Nous avons écrit une fonction d'initialisation sans jamais la justifier.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 5 · le point de départ
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-4": [
    {
      id: "b-o4-1",
      type: "texte",
      texte:
        "Le choix le plus naturel est de tout mettre à zéro : neutre, sans arbitraire, sans graine aléatoire. Prouvons qu'il est fatal.",
    },
    {
      id: "b-o4-2",
      type: "derivation",
      ancre: "symetrie",
      titre: "L'initialisation à zéro fige tous les neurones cachés dans le même état",
      hypotheses: [
        "$W^{[1]}=0$ et $b^{[1]}=0$",
        "Toutes les colonnes de $W^{[2]}$ sont initialisées à la même valeur",
        "Le pas $\\eta$ et la suite des mini-lots sont quelconques",
      ],
      depart: {
        latex: "\\text{Récurrence sur } t : \\ \\text{toutes les lignes de } W^{[1]}_t \\text{ sont égales}",
        alt: "On raisonne par récurrence sur t : à chaque étape, toutes les lignes de la matrice de poids de la première couche sont égales entre elles.",
      },
      chaine: "x  →  z^[1]  →  a^[1]  →  z^[2]  →  a^[2]  →  ℓ",
      proprietes: [
        "La **rétropropagation** du cours précédent : $\\delta^{[1]}=\\big((W^{[2]})^{\\top}\\delta^{[2]}\\big)\\odot\\sigma'(z^{[1]})$",
        "Le gradient d'une couche : $\\operatorname{grad}_{W^{[1]}}\\ell=\\delta^{[1]}x^{\\top}$",
      ],
      etapes: [
        {
          texte: "**Initialisation.** À $t=0$, toutes les lignes valent zéro : elles sont égales.",
          justification: "hypothèse",
        },
        {
          texte:
            "**Hérédité.** Supposons qu'à l'étape $t$ toutes les lignes valent un même vecteur $w$, et tous les biais un même $b$. Alors pour tout exemple et **tout** neurone caché $j$ :",
          latex:
            "z^{[1]}_j=w^{\\top}x+b \\ \\text{(indépendant de } j) \\quad\\Longrightarrow\\quad a^{[1]}_j=\\sigma(z^{[1]}_j)=a \\ \\text{(indépendant de } j)",
          alt: "La préactivation du neurone j ne dépend pas de j, donc son activation non plus.",
          justification: "la couche cachée produit 128 fois la même valeur",
        },
        {
          texte:
            "Remontons le gradient. Le second facteur ne dépend pas de $j$, on vient de le voir ; le premier non plus, puisque les colonnes de $W^{[2]}$ sont identiques.",
          latex:
            "\\delta^{[1]}_j=\\Big(\\sum_{k}W^{[2]}_{kj}\\,\\delta^{[2]}_k\\Big)\\,\\sigma'(z^{[1]}_j)=\\delta \\ \\text{(indépendant de } j)",
          alt: "Le signal d'erreur du neurone caché j est un produit de deux facteurs, dont aucun ne dépend de j.",
          justification: "rétropropagation, et hypothèse sur les colonnes de la seconde couche",
        },
        {
          texte:
            "Le gradient de la première couche a donc **toutes ses lignes égales**. Vérification des dimensions : $(128\\times1)(1\\times784)=128\\times784$.",
          latex: "\\operatorname{grad}_{W^{[1]}}\\ell=\\delta^{[1]}x^{\\top} = \\delta\\,\\mathbf{1}\\,x^{\\top}",
          alt: "Le gradient de la matrice de la première couche est le produit extérieur du signal d'erreur par le vecteur d'entrée transposé, et toutes ses lignes sont égales.",
          justification: "produit extérieur d'un vecteur à composantes égales",
        },
        {
          texte:
            "La mise à jour soustrait la même quantité à chaque ligne : les lignes restent égales à l'étape $t+1$.",
          justification: "conclusion de la récurrence",
        },
      ],
      resultat: {
        latex:
          "\\forall t,\\ \\forall (j,j'),\\qquad W^{[1]}_{t}[j,:] \\;=\\; W^{[1]}_{t}[j',:]",
        alt: "À toute étape et pour tout couple de neurones cachés, les deux lignes correspondantes de la matrice de poids sont égales.",
      },
      interpretation:
        "Le réseau a 128 neurones cachés mais **un seul degré de liberté caché** : il se comporte pour toujours comme un réseau à un neurone. Ce n'est pas une convergence lente, c'est une **impossibilité structurelle**, et aucun réglage du pas ne la lève.",
    },
    {
      id: "b-o4-3",
      type: "sortie",
      titre: "Vérification, après 200 mises à jour depuis l'initialisation nulle",
      texte: `      lignes distinctes de W1 : 1 sur 128
      ecart maximal entre deux lignes : 0.00e+00
      perte test 1.9896   precision test 0.2532   (hasard = 0.1000)`,
      lecture: [
        "L'écart maximal entre deux lignes est **exactement nul**, au bit près. Pas « petit » : nul. La preuve est confirmée sans approximation.",
        "**Une note honnête sur $0{,}2532$.** Le réseau fait mieux que le hasard, ce qui peut surprendre. C'est normal : la couche de sortie, elle, n'est pas symétrique. Ses dix neurones voient le même unique signal caché, mais leurs biais peuvent diverger et apprendre les fréquences des classes, plus ce seul signal. Le réseau n'est pas mort ; il est réduit à une seule caractéristique apprise.",
      ],
    },
    {
      id: "b-o4-4",
      type: "titre",
      niveau: 2,
      texte: "Second obstacle : tirer au hasard ne suffit pas",
    },
    {
      id: "b-o4-5",
      type: "texte",
      texte:
        "Puisqu'il faut casser la symétrie, tirons au hasard. Prenons la loi normale centrée réduite, le choix le plus évident. Mesurons les préactivations **avant tout apprentissage**.",
    },
    {
      id: "b-o4-6",
      type: "sortie",
      titre: "python cours/lecon3/experiences2.py E6",
      texte: `      methode        Var(Z1)    |Z1| > 4   moy sigma prime  lignes W1 distinctes
      zero            0.0000       0.00%          0.250000                     1
      grand          91.9551      66.81%          0.041835                   128
      xavier          0.1173       0.00%          0.243062                   128

      sigma prime maximal possible = 0.25 (atteint en z = 0).`,
      lecture: [
        "Avec la loi normale centrée réduite, la variance de la préactivation vaut $91{,}96$, soit un écart-type de $9{,}6$.",
        "**$66{,}81\\,\\%$ des préactivations dépassent $|z|>4$**, où $\\sigma'(4)=0{,}0177$. La dérivée moyenne tombe à $0{,}0418$, soit **six fois moins** que le maximum $0{,}25$.",
        "Les deux tiers des neurones sont en zone morte dès l'initialisation : leur gradient est presque nul, ils n'apprendront que très lentement.",
      ],
    },
    {
      id: "b-o4-7",
      type: "tableau",
      cleEnTete: true,
      titre: "Le cahier des charges de l'initialisation",
      entetes: ["", "Critère", "Pourquoi"],
      lignes: [
        ["(D1)", "Deux neurones d'une même couche doivent être **distinguables**", "sinon la couche a un seul degré de liberté"],
        ["(D2)", "Les préactivations doivent rester dans la zone **non saturée**", "la dérivée y est proche de son maximum"],
        ["(D3)", "Le critère précédent doit tenir **couche après couche**", "sinon il se dégrade avec la profondeur"],
        ["(D4)", "Il ne doit **pas** dépendre d'un réglage à la main", "sinon c'est un hyperparamètre de plus, par couche"],
      ],
      legende:
        "(D1) impose un tirage aléatoire continu : la probabilité que deux lignes soient égales est alors nulle. Restent (D2) à (D4).",
    },
    {
      id: "b-o4-8",
      type: "derivation",
      ancre: "xavier",
      titre: "La variance d'initialisation tombe du critère de conservation",
      hypotheses: [
        "Les poids $w_i$ sont indépendants, centrés, de variance $s^{2}$, et indépendants des entrées",
        "Les entrées $x_i$ sont indépendantes, centrées, de variance $v$",
        "Le biais est nul",
      ],
      depart: {
        latex: "z=\\sum_{i=1}^{d_{\\mathrm{in}}}w_i x_i",
        alt: "La préactivation z est la somme, pour i allant de un à la largeur d'entrée, des produits w i fois x i.",
      },
      proprietes: [
        "L'**indépendance** de $w_i$ et $x_i$ : $\\mathbb{E}[w_ix_i]=\\mathbb{E}[w_i]\\mathbb{E}[x_i]$",
        "L'**additivité de la variance** pour des variables indépendantes",
      ],
      etapes: [
        {
          texte: "Par indépendance et centrage, chaque terme est de moyenne nulle, donc $z$ aussi.",
          latex: "\\mathbb{E}[w_ix_i]=\\mathbb{E}[w_i]\\,\\mathbb{E}[x_i]=0 \\quad\\Longrightarrow\\quad \\mathbb{E}[z]=0",
          alt: "L'espérance du produit w i x i est nulle, donc l'espérance de z est nulle.",
          justification: "indépendance et centrage",
        },
        {
          texte: "Les termes étant indépendants, les variances s'ajoutent :",
          latex:
            "\\operatorname{Var}(z)=\\sum_{i=1}^{d_{\\mathrm{in}}}\\mathbb{E}[w_i^2]\\,\\mathbb{E}[x_i^2]=d_{\\mathrm{in}}\\,s^{2}\\,v",
          alt: "La variance de z est la somme des produits des moments d'ordre deux, ce qui vaut la largeur d'entrée fois s au carré fois v.",
          justification: "additivité de la variance, puis identité des lois",
        },
        {
          texte:
            "Le critère (D3) s'écrit « la variance ne change pas d'une couche à l'autre », donc $\\operatorname{Var}(z)=v$ :",
          latex: "d_{\\mathrm{in}}\\,s^{2}\\,v=v \\quad\\Longrightarrow\\quad s^{2}=\\frac{1}{d_{\\mathrm{in}}}",
          alt: "La largeur d'entrée fois s au carré fois v égale v, donc s au carré égale un sur la largeur d'entrée.",
          justification: "traduction du critère, puis division par v non nul",
        },
      ],
      resultat: {
        latex:
          "s^{2}=\\frac{1}{d_{\\mathrm{in}}} \\qquad\\text{c'est-à-dire}\\qquad w_{ji}\\sim\\mathcal{N}\\!\\left(0,\\ \\frac{1}{d_{\\mathrm{in}}}\\right)",
        alt: "La variance d'initialisation vaut un sur la largeur d'entrée : les poids suivent une loi normale centrée de cette variance.",
      },
      interpretation:
        "L'écart-type $1/\\sqrt{d_{\\mathrm{in}}}$ **tombe** du cahier des charges ; on ne l'a pas choisi. Il ne dépend d'aucun réglage, seulement de la largeur de la couche d'entrée : le critère (D4) est satisfait. C'est l'initialisation dite de Xavier, dans sa version « avant ». **Vérification** : pour $d_{\\mathrm{in}}=784$ et des entrées de moment d'ordre deux $0{,}1120$, la prédiction est $0{,}112$, et l'on mesure $0{,}1173$. L'écart de 5 % vient de ce que les pixels ne sont ni centrés ni indépendants : les hypothèses sont approchées, et le résultat tient quand même.",
      limites: [
        "Pour la **ReLU**, la moitié des valeurs sont annulées : si $z$ est symétrique, $\\mathbb{E}[a^2]=\\tfrac12\\mathbb{E}[z^2]$, la variance est divisée par deux à chaque couche. Il faut compenser par $s^2=2/d_{\\mathrm{in}}$, l'initialisation de He, celle de la page 7.",
      ],
    },
    {
      id: "b-o4-9",
      type: "image",
      ancre: "figure-init",
      src: "/cours/lecon3/l3-fig4-initialisation.png",
      largeur: 1770,
      hauteur: 496,
      alt: "Trois panneaux. À gauche, la dérivée de la sigmoïde, en cloche, avec son maximum de 0,25 en zéro et deux zones grisées au-delà de plus ou moins 4 où elle tombe sous 0,018. Au milieu, la distribution des préactivations pour deux initialisations : la loi normale centrée réduite déborde largement des zones mortes, Xavier tient dans le pic central. À droite, la norme du gradient par couche sur un réseau à cinq couches, en échelle logarithmique : la sigmoïde monte d'un facteur 190 de la couche 1 à la couche 5, la ReLU reste plate.",
      legende:
        "(a) La dérivée de la sigmoïde ne dépasse jamais un quart. (b) La loi normale centrée réduite envoie 66,8 % des neurones en zone morte. (c) Quatre couches sigmoïdes éteignent le gradient d'un facteur 190.",
    },
    {
      id: "b-o4-10",
      type: "tableau",
      titre: "Verdict",
      cleEnTete: true,
      entetes: ["Candidat", "(D1)", "(D2)", "(D3)", "(D4)", "Précision", "Verdict"],
      lignes: [
        ["Tout à zéro", "✗", "✓", "sans objet", "✓", "$0{,}3384$", "**rejeté**"],
        ["Loi normale centrée réduite", "✓", "✗", "✗", "✓", "$0{,}8811$", "**rejeté**"],
        ["**Xavier**", "✓", "✓", "✓", "✓", "$0{,}9208$", "**retenu**"],
      ],
      legende:
        "Note honnête : la loi normale centrée réduite atteint tout de même 0,8811. À deux couches, la saturation ralentit sans tuer. Le vrai argument contre elle est le critère (D3), pas ces trois points de précision, et son coût réel apparaît à la page 7.",
    },
    {
      id: "b-o4-11",
      type: "verification",
      numero: 12,
      enonce:
        "La couche cachée de notre réseau a une largeur d'entrée de 784, la couche de sortie de 128.",
      questions: [
        "Quels sont les deux écarts-types d'initialisation ? Donne les valeurs numériques.",
        "Pourquoi la couche de sortie a-t-elle droit à des poids **plus grands** que la couche cachée ? Réponds en une phrase, en te servant de la dérivation.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 6 · la forme des entrées
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-5": [
    {
      id: "b-o5-1",
      type: "texte",
      texte:
        "La page 4 a montré que la vitesse est gouvernée par le conditionnement. Sur quoi porte cette courbure ? Prouvons-le sur la régression linéaire, où tout est calculable.",
    },
    {
      id: "b-o5-2",
      type: "derivation",
      ancre: "hessienne",
      titre: "La courbure du problème est la matrice des moments des données",
      hypotheses: [
        "Modèle linéaire, perte quadratique : $\\mathcal{L}(\\theta)=\\frac{1}{2N}\\|X\\theta-y\\|^{2}$",
      ],
      depart: {
        latex: "\\mathcal{L}(\\theta)=\\frac{1}{2N}\\|X\\theta-y\\|^{2}",
        alt: "La perte est un demi sur N fois le carré de la norme de X thêta moins y.",
      },
      etapes: [
        {
          texte: "Une première dérivation donne le gradient. Dimensions : $(d\\times N)(N\\times1)=d\\times1$.",
          latex: "\\operatorname{grad}_{\\theta}\\mathcal{L}=\\frac{1}{N}X^{\\top}(X\\theta-y)",
          alt: "Le gradient de la perte est un sur N fois X transposée multipliée par X thêta moins y.",
          justification: "dérivation d'une forme quadratique",
        },
        {
          texte:
            "Une seconde dérivation donne la hessienne. Dimensions : $(d\\times N)(N\\times d)=d\\times d$.",
          latex: "H=\\operatorname{Hess}_{\\theta}\\mathcal{L}=\\frac{1}{N}X^{\\top}X",
          alt: "La hessienne de la perte est un sur N fois X transposée multipliée par X.",
          justification: "dérivation du gradient, qui est affine en thêta",
        },
      ],
      resultat: {
        latex: "H=\\frac{1}{N}X^{\\top}X",
        alt: "La hessienne vaut un sur N fois X transposée X.",
      },
      interpretation:
        "La courbure du problème d'optimisation **est** la matrice des moments d'ordre deux des données. Elle ne dépend pas de $\\theta$ : le problème est exactement quadratique, et tout le raisonnement de la page 4 s'y applique sans réserve. Si les variables ont des échelles très différentes, cette matrice est mal conditionnée, et l'optimisation l'est aussi. Centrer et réduire chaque variable ramène la diagonale à des uns, ce qui n'annule pas le conditionnement, puisque les corrélations restent, mais en supprime la part due aux unités.",
      limites: [
        "Pour le **réseau**, la hessienne n'est pas cette matrice et dépend de $\\theta$. Ce résultat est prouvé pour le modèle linéaire seulement. Pour le réseau, nous mesurons.",
      ],
    },
    {
      id: "b-o5-3",
      type: "sortie",
      titre: "python cours/lecon3/experiences2.py E7",
      texte: `  Pixels dont l'ecart-type est nul sur tout le jeu : 67 sur 784 (jamais allumes).

  jeu                  moyenne    ecart-type       min       max
  brut [0,1]            0.1307        0.3081      0.00      1.00
  standardise           0.0000        0.9563     -1.27    244.95

  Valeurs propres de la covariance (5000 exemples, 717 pixels vivants) :
  jeu                 lambda max    lambda min > 0       rapport
  brut                    5.1954          3.01e-08      1.73e+08
  standardise            40.6922          6.70e-04      6.08e+04

  Vitesse d'apprentissage, meme eta, meme graine, 300 mises a jour :
  jeu                perte apres 100    apres 300   precision test
  brut [0,1]                  0.5451       0.3696           0.8944
  standardise                 0.3452       0.2916           0.9163`,
      lecture: [
        "**67 pixels sur 784 ne s'allument jamais** : ce sont des bords. On ne peut pas les diviser par leur écart-type, qui est nul ; on les laisse tels quels.",
        "Le conditionnement passe de $1{,}73\\cdot10^{8}$ à $6{,}08\\cdot10^{4}$ : **une amélioration d'un facteur 2845**.",
        "La vitesse suit : à 100 mises à jour, $0{,}3452$ contre $0{,}5451$. **La version standardisée atteint en 100 pas ce que la version brute n'a pas atteint en 300** ($0{,}3696$).",
      ],
    },
    {
      id: "b-o5-4",
      type: "encart",
      ton: "attention",
      titre: "Ce que la mesure oblige à dire",
      texte:
        "Le gain en précision finale est **modeste** : $+0{,}0219$. MNIST est déjà dans l'intervalle unité, avec des pixels de nature homogène. Sur des données à unités hétérogènes, des mètres carrés à côté d'un nombre de pièces, l'écart serait bien plus grand. Et il y a une **verrue** : le maximum passe de $1{,}00$ à $244{,}95$. Un pixel de bord allumé trois fois sur 60 000 a un écart-type minuscule ; le diviser par cet écart-type fabrique une valeur énorme. La standardisation naïve par pixel crée des valeurs extrêmes là où il n'y avait presque pas d'information.",
    },
    {
      id: "b-o5-5",
      type: "encart",
      ton: "rappel",
      titre: "Une règle qui ne souffre pas d'exception",
      texte:
        "La moyenne et l'écart-type se calculent sur **l'entraînement seul**, puis s'appliquent au test. Les calculer sur l'ensemble du jeu avant de séparer est une fuite de données : le score obtenu sera meilleur qu'il ne devrait, et rien ne le signalera.",
    },
    {
      id: "b-o5-6",
      type: "repere",
      cherche: "Les conditions d'un entraînement qui aboutit.",
      pourquoi: "Quatre réglages restaient sans justification depuis le cours précédent.",
      ou: "Direction, données, pas, initialisation, mise à l'échelle : tous dérivés ou mesurés.",
      suite: "Ce qui reste, et qu'aucun de ces réglages ne répare : la profondeur.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 7 · ce que rien ne répare
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-6": [
    {
      id: "b-o6-1",
      type: "derivation",
      ancre: "borne-quart",
      titre: "La dérivée de la sigmoïde ne dépasse jamais un quart",
      hypotheses: ["$\\sigma$ est la sigmoïde logistique, et $z$ est réel"],
      depart: {
        latex: "\\sigma'(z)=\\sigma(z)\\big(1-\\sigma(z)\\big)",
        alt: "La dérivée de sigma en z égale sigma de z fois un moins sigma de z.",
      },
      etapes: [
        {
          texte:
            "Posons $a=\\sigma(z)$, qui parcourt l'intervalle ouvert de zéro à un, et étudions la fonction $\\varphi(a)=a(1-a)$.",
          latex: "\\varphi(a)=a-a^{2}, \\qquad \\varphi'(a)=1-2a",
          alt: "Phi de a égale a moins a au carré, et sa dérivée vaut un moins deux a.",
          justification: "changement de variable",
        },
        {
          texte:
            "La dérivée s'annule en $a=\\tfrac12$, est positive avant et négative après : c'est un maximum.",
          latex: "\\varphi\\!\\left(\\tfrac12\\right)=\\tfrac12\\cdot\\tfrac12=\\tfrac14",
          alt: "Phi de un demi vaut un demi fois un demi, égale un quart.",
          justification: "étude du signe de la dérivée",
        },
        {
          texte:
            "Comme $\\sigma$ est une bijection croissante de $\\mathbb{R}$ sur l'intervalle ouvert de zéro à un, avec $\\sigma(0)=\\tfrac12$, l'égalité a lieu exactement en $z=0$.",
          justification: "bijectivité de la sigmoïde",
        },
      ],
      resultat: {
        latex: "\\forall z\\in\\mathbb{R},\\quad \\sigma'(z)\\le\\frac14, \\quad \\text{avec égalité si et seulement si } z=0",
        alt: "Pour tout z réel, la dérivée de sigma en z est inférieure ou égale à un quart, avec égalité si et seulement si z vaut zéro.",
      },
      interpretation:
        "Le maximum lui-même est **inférieur à un**. C'est cela qui va tout gouverner : chaque couche traversée multiplie le gradient par un facteur au plus égal à un quart.",
    },
    {
      id: "b-o6-2",
      type: "tableau",
      titre: "La dérivée de la sigmoïde, en quelques points",
      entetes: ["$z$", "$\\sigma(z)$", "$\\sigma'(z)$"],
      lignes: [
        ["0,0", "0,500000", "0,250000"],
        ["1,0", "0,731059", "0,196612"],
        ["2,0", "0,880797", "0,104994"],
        ["4,0", "0,982014", "0,017663"],
        ["6,0", "0,997527", "0,002467"],
      ],
      legende:
        "La décroissance est brutale : à z = 4, la dérivée vaut déjà 70 fois moins qu'en zéro.",
    },
    {
      id: "b-o6-3",
      type: "titre",
      niveau: 2,
      texte: "La conséquence sur L couches",
    },
    {
      id: "b-o6-4",
      type: "texte",
      texte:
        "En prenant les normes dans la relation de rétropropagation, avec $\\|u\\odot v\\|\\le\\|u\\|_{\\infty}\\|v\\|$ et la norme d'opérateur, puis en itérant de la dernière couche jusqu'à la couche $l$ :",
    },
    {
      id: "b-o6-5",
      type: "formule",
      ancre: "evanescence",
      latex:
        "\\|\\delta^{[l]}\\|\\ \\le\\ \\left(\\frac{1}{4}\\right)^{L-l}\\ \\prod_{m=l+1}^{L}\\big\\|W^{[m]}\\big\\|_{2}\\ \\cdot\\ \\|\\delta^{[L]}\\|",
      alt: "La norme du signal d'erreur de la couche l est inférieure ou égale à un quart puissance L moins l, fois le produit des normes d'opérateur des matrices de poids suivantes, fois la norme du signal d'erreur de la dernière couche.",
      numero: "4",
      legende:
        "Si l'initialisation maintient les normes des matrices de l'ordre de un, ce que Xavier fait par construction, le facteur dominant est un quart puissance le nombre de couches traversées. Pour quatre couches d'écart, la borne vaut 256.",
    },
    {
      id: "b-o6-6",
      type: "sortie",
      titre: "python cours/lecon3/experiences2.py E8 · réseau 784-64-64-64-64-10",
      texte: `      activation       couche 1     couche 2     couche 3     couche 4     couche 5   rapport 5/1
      sigmoide        3.641e-03    7.416e-03    3.050e-02    1.502e-01    6.926e-01         190.2
      relu            9.120e-01    2.869e-01    2.691e-01    2.726e-01    3.040e-01           0.3`,
      lecture: [
        "Avec la **sigmoïde**, la norme du gradient est multipliée par environ 4 à chaque couche en remontant. Rapport total : **190,2**.",
        "La borne théorique prédisait au plus $4^{4}=256$. **Le mesuré (190) et la borne (256) sont du même ordre**, la borne n'étant pas atteinte parce que la dérivée vaut un quart seulement en zéro, et un peu moins ailleurs.",
        "Avec la **ReLU**, le rapport est $0{,}3$ : il n'y a **pas d'atténuation multiplicative**, parce que la dérivée vaut zéro ou un, jamais un facteur d'amortissement intermédiaire.",
        "Conséquence pratique : avec un pas identique pour toutes les couches, la couche 1 du réseau sigmoïde reçoit des mises à jour 190 fois plus petites que la couche 5. Elle apprend 190 fois plus lentement, alors que c'est **elle** qui voit les pixels.",
      ],
    },
    {
      id: "b-o6-7",
      type: "encart",
      ton: "attention",
      titre: "Ce que la ReLU coûte",
      texte:
        "Elle **n'est pas dérivable en zéro** : on choisit zéro par convention, et la preuve de la page 2 ne s'applique donc pas en ce point. Un neurone dont la préactivation est négative pour **tous** les exemples a un gradient exactement nul et ne se réveille jamais : c'est le **neurone mort**. Enfin elle demande l'initialisation de He, pas Xavier.",
    },
    {
      id: "b-o6-8",
      type: "verification",
      numero: 13,
      enonce:
        "On mesure un rapport de 190 entre la couche 5 et la couche 1 sur un réseau à cinq couches sigmoïdes.",
      questions: [
        "Quel rapport prédirait la borne pour un réseau à **dix** couches sigmoïdes, en supposant les normes des matrices proches de un ? Donne l'ordre de grandeur.",
        "Si la couche 10 reçoit un gradient de norme 1, quelle est la norme reçue par la couche 1 ? Compare à la précision d'un flottant 64 bits, environ $2\\cdot10^{-16}$, et conclus.",
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // Page 8 · clôture
  // ═══════════════════════════════════════════════════════════════════════════
  "l-optim-7": [
    {
      id: "b-o7-1",
      type: "titre",
      niveau: 2,
      texte: "Synthèse",
    },
    {
      id: "b-o7-2",
      type: "texte",
      texte:
        "Nous sommes partis d'une règle utilisée depuis deux cours sans preuve. La direction opposée au gradient n'est pas *une* bonne direction : c'est la meilleure, par Cauchy-Schwarz, et la borne qu'elle atteint est la norme du gradient, mesurée à $0{,}940183$ quand 2000 directions tirées au hasard plafonnent à $1{,}3\\,\\%$ de cette valeur. Le signe négatif est imposé par l'analyse des trois cas du signe de la pente.\n\nLe lot complet calcule ce gradient exactement, et échoue : après un passage sur 60 000 exemples il atteint $0{,}1258$, le niveau du hasard, parce qu'il n'a produit qu'**une** mise à jour. Figer un petit échantillon corrige le coût mais optimise la mauvaise fonction : $1{,}0000$ sur ses 64 exemples, $0{,}5990$ sur le test. Le mini-lot retiré à chaque pas satisfait les quatre critères : son gradient est un estimateur **exactement** sans biais, et son écart quadratique décroît en $s/\\sqrt{B}$, loi vérifiée sur trois ordres de grandeur avec $s\\approx5{,}8$.\n\nLe pas obéit à un seuil exact sur un quadratique, qui devient $2/\\lambda_{\\max}$ en dimension $p$ et fait apparaître le conditionnement. Sur le réseau, la mesure corrige la théorie sur un point : la perte ne diverge jamais, elle plafonne à $27{,}63$, qui est le plancher numérique et non l'infini. Le témoin honnête de la divergence est la norme des paramètres, qui passe de $11{,}8$ à $15\\,395{,}8$.\n\nLe point de départ est contraint par deux obstacles prouvés : la symétrie de l'initialisation nulle, démontrée par récurrence et confirmée par un écart entre lignes **exactement** nul ; et la saturation de la loi normale centrée réduite, qui envoie $66{,}81\\,\\%$ des neurones là où la dérivée est sous $0{,}018$. Le critère « conserver la variance » fait tomber $s^2=1/d_{\\mathrm{in}}$ : prédiction $0{,}112$, mesure $0{,}1173$.\n\nReste ce qu'aucun de ces réglages ne répare : la borne d'un quart impose une atténuation exponentielle en profondeur, soit 256 sur quatre couches, mesurée à 190. La profondeur avec sigmoïde est structurellement impossible, et la ReLU est la première réponse.",
    },
    {
      id: "b-o7-3",
      type: "titre",
      niveau: 2,
      texte: "Formulaire",
    },
    {
      id: "b-o7-4",
      type: "formule",
      latex:
        "D_{u}f(\\theta)=\\langle\\operatorname{grad}f(\\theta),u\\rangle, \\qquad \\min_{\\|u\\|=1}D_{u}f=-\\|\\operatorname{grad}f\\| \\ \\text{ en } \\ u=-\\frac{\\operatorname{grad}f}{\\|\\operatorname{grad}f\\|}",
      alt: "La dérivée directionnelle est le produit scalaire du gradient et de la direction ; son minimum sur la sphère unité vaut moins la norme du gradient, atteint pour la direction opposée au gradient normalisé.",
      legende: "Direction et signe.",
    },
    {
      id: "b-o7-5",
      type: "formule",
      latex:
        "\\mathbb{E}[g_{\\mathcal{B}}]=\\operatorname{grad}\\mathcal{L}_{\\mathcal{D}}, \\qquad \\mathbb{E}\\big\\|g_{\\mathcal{B}}-\\operatorname{grad}\\mathcal{L}_{\\mathcal{D}}\\big\\|^{2}=\\frac{s^{2}}{B}",
      alt: "L'espérance du gradient de mini-lot est le gradient complet, et son écart quadratique moyen vaut s au carré sur B.",
      legende: "Descente stochastique par mini-lots.",
    },
    {
      id: "b-o7-6",
      type: "formule",
      latex:
        "0<\\eta<\\frac{2}{\\lambda_{\\max}}, \\qquad \\kappa=\\frac{\\lambda_{\\max}}{\\lambda_{\\min}}, \\qquad s^{2}_{\\text{Xavier}}=\\frac{1}{d_{\\mathrm{in}}}, \\qquad s^{2}_{\\text{He}}=\\frac{2}{d_{\\mathrm{in}}}",
      alt: "La condition sur le pas, la définition du conditionnement, et les deux variances d'initialisation.",
      legende: "Pas, conditionnement, initialisation.",
    },
    {
      id: "b-o7-7",
      type: "tableau",
      titre: "Tableau des objets",
      cleEnTete: true,
      entetes: ["Symbole", "Signification", "Ensemble", "Dimension"],
      lignes: [
        ["$u$", "direction unitaire de recherche", "sphère unité de $\\mathbb{R}^p$", "$p\\times1$"],
        ["$D_{u}f$", "dérivée directionnelle selon $u$", "$\\mathbb{R}$", "scalaire"],
        ["$\\mathcal{B}_t$", "mini-lot d'indices à l'itération $t$", "partie de $\\{1,\\dots,N\\}$", "cardinal $B$"],
        ["$B$", "taille du mini-lot", "$\\mathbb{N}^{*}$", "scalaire, hyperparamètre"],
        ["$g_{\\mathcal{B}}$", "gradient estimé sur le mini-lot", "$\\mathbb{R}^{p}$", "$p\\times1$"],
        ["$s^{2}$", "variance des gradients individuels", "$\\mathbb{R}_{\\ge0}$", "scalaire"],
        ["$H$", "hessienne de la perte", "matrices symétriques", "$d\\times d$"],
        ["$\\lambda_i$", "valeur propre de $H$", "$\\mathbb{R}_{>0}$", "scalaire"],
        ["$\\kappa$", "conditionnement", "$[1,+\\infty[$", "scalaire"],
        ["$d_{\\mathrm{in}}$", "largeur de la couche d'entrée", "$\\mathbb{N}^{*}$", "scalaire"],
        ["$\\|W\\|_{2}$", "norme d'opérateur, plus grande valeur singulière", "$\\mathbb{R}_{\\ge0}$", "scalaire"],
      ],
    },
    {
      id: "b-o7-8",
      type: "code",
      langage: "python",
      titre: "L'algorithme complet, tel que ce cours le justifie",
      surlignees: [4, 5, 12, 13, 19, 20, 21],
      code: `# 0. Mise a l'echelle des entrees                        page 6
mu, sigma = X_train.mean(axis=0), X_train.std(axis=0)
vivants = sigma > seuil                  # 67 pixels sur 784 sont morts
X_train[:, vivants] = (X_train[:, vivants] - mu[vivants]) / sigma[vivants]
X_test[:, vivants]  = (X_test[:, vivants]  - mu[vivants]) / sigma[vivants]
#    mu et sigma viennent de L'ENTRAINEMENT SEUL : les calculer sur tout
#    le jeu serait une fuite de donnees.

# 1. Initialisation                                      page 5
for l in couches:
    # variance 1/d_in : elle tombe du critere de conservation, (D1)-(D4)
    W[l] = rng.normal(0.0, sqrt(1.0 / d_in[l]), size=(d_out[l], d_in[l]))
    b[l] = zeros(d_out[l])               # rien ne les symetrise entre eux

# 2. Boucle d'apprentissage                              pages 2, 3, 4
for t in range(T):
    idx   = rng.choice(N, size=B, replace=False)   # sans biais, critere (C2)
    cache = propagation_avant(theta, X[idx])
    grads = retropropagation(theta, cache, Y[idx]) # gradient EXACT
    for cle in theta:
        theta[cle] -= eta * grads[cle]             # direction prouvee, signe prouve`,
    },
    {
      id: "b-o7-9",
      type: "titre",
      niveau: 2,
      texte: "Erreurs fréquentes",
    },
    {
      id: "b-o7-10",
      type: "tableau",
      cleEnTete: true,
      entetes: ["Ce qu'on croit", "Ce qui est vrai"],
      lignes: [
        [
          "« Stochastique » veut dire approximatif",
          "Le gradient de mini-lot est un estimateur **exactement** sans biais. Ce qui est approximatif, c'est une réalisation ; la moyenne, elle, est juste.",
        ],
        [
          "Un grand pas fait apparaître des valeurs indéfinies",
          "Mesuré : jusqu'à $\\eta=300$, aucune valeur non finie. La perte plafonne à $27{,}63$, qui est le plancher numérique du code. Le témoin de la divergence est la norme des paramètres.",
        ],
        [
          "Un petit pas est le choix prudent",
          "À $\\eta=0{,}001$, la précision est $0{,}3883$ après un passage complet, et la courbe descend proprement : l'échec ressemble à un succès lent.",
        ],
        [
          "Le lot complet est plus coûteux par exemple",
          "Il est $7{,}0$ fois **moins** coûteux par exemple. Son défaut est le nombre de mises à jour, pas l'arithmétique.",
        ],
        [
          "L'initialisation nulle converge lentement",
          "Elle ne converge pas du tout vers un réseau à 128 neurones : elle en simule un à un seul, et l'écart entre lignes reste **exactement** nul.",
        ],
        [
          "Saturation et évanescence sont la même chose",
          "La saturation est un état d'un neurone, que l'initialisation contrôle. L'évanescence est un effet **multiplicatif de la profondeur** qu'aucune initialisation ne supprime.",
        ],
        [
          "On peut standardiser avant de séparer les jeux",
          "C'est une fuite de données : le score sera meilleur qu'il ne devrait, et rien ne le signalera.",
        ],
        [
          "La standardisation est toujours un gain net",
          "Sur ces données elle apporte $+0{,}0219$ de précision, et crée au passage des valeurs allant jusqu'à $244{,}95$ sur les pixels de bord.",
        ],
      ],
    },
    {
      id: "b-o7-11",
      type: "exercice",
      titre: "Question de vérification",
      minutes: 20,
      enonce:
        "**Un calcul.** On dispose d'un million d'exemples et l'on veut que l'écart quadratique moyen du gradient de mini-lot vaille au plus $5\\,\\%$ de la norme du gradient complet. On mesure $s=5{,}80$ et une norme de $0{,}863$. Quelle taille de lot faut-il ? Ce lot est-il praticable ? Que conclus-tu sur la stratégie « réduire le bruit en agrandissant le lot » ?\n\n**Une question conceptuelle.** La page 2 prouve que la direction opposée au gradient est la meilleure. La page 4 montre qu'un pas trop grand fait empirer la perte. Ces deux résultats sont-ils contradictoires ? Réponds en identifiant précisément l'hypothèse de la page 2 qui n'est plus vérifiée à la page 4.",
      attendu: "Un calcul chiffré, et une phrase qui nomme l'hypothèse.",
      indices: [
        "Pour la première : l'écart vaut $s/\\sqrt{B}$, et l'on veut qu'il soit sous $0{,}05\\times0{,}863$.",
        "Pour la seconde : relis les trois limites énoncées à la fin de la dérivation de Cauchy-Schwarz. L'une d'elles porte sur la taille du déplacement.",
      ],
      correction:
        "**Le calcul.** On veut $5{,}80/\\sqrt{B}\\le0{,}05\\times0{,}863=0{,}0432$, donc $\\sqrt{B}\\ge134{,}4$ et $B\\ge18\\,060$. Un tel lot coûte environ $18\\,060\\times100\\ \\mu s\\approx1{,}8$ s par mise à jour, contre 45 ms à $B=64$ : quarante fois plus cher pour **une seule** mise à jour. La stratégie « agrandir le lot pour réduire le bruit » est perdante, parce que le bruit décroît en $1/\\sqrt{B}$ pendant que le coût croît en $B$. Le bon arbitrage est l'inverse : accepter beaucoup de bruit, et faire beaucoup de pas.\n\n**La question conceptuelle.** Il n'y a pas de contradiction. La preuve de la page 2 est **locale** : elle porte sur la limite quand le déplacement tend vers zéro, et ne dit rien d'un pas fini. C'est la première des trois limites énoncées. La direction reste la meilleure ; c'est la **longueur** du déplacement le long de cette direction qui peut faire remonter la perte, parce que le développement limité d'ordre un cesse d'être une bonne approximation.",
    },
    {
      id: "b-o7-12",
      type: "encart",
      ton: "note",
      titre: "Les vérifications en attente",
      texte:
        "Restent sans réponse les vérifications n° 1 à n° 8 des deux cours précédents, leurs deux exercices de fin, et les n° 9, 10, 11, 12 et 13 de ce cours.",
    },
    {
      id: "b-o7-13",
      type: "titre",
      niveau: 2,
      texte: "Suite du parcours",
    },
    {
      id: "b-o7-14",
      type: "tableau",
      cleEnTete: true,
      titre: "Ce que le cours suivant remboursera",
      entetes: ["Dette", "D'où elle vient"],
      lignes: [
        ["Sur-apprentissage, écart entre précision d'entraînement et de test", "cours précédent, entraînement complet"],
        [
          "Le candidat figé atteint $1{,}0000$ sur ses 64 exemples et $0{,}5990$ sur le test",
          "page 3 de ce chapitre : le cas d'école du sur-apprentissage, fabriqué exprès",
        ],
        [
          "Pénalisation des grands poids : la norme passe de $11{,}8$ à $40{,}7$ pendant un entraînement sain",
          "page 4 : la norme croît toujours, et rien ne l'en empêche",
        ],
        ["Le correctif propre à la standardisation par pixel", "page 6, les valeurs à $244{,}95$"],
      ],
      legende:
        "Restent ouvertes, à leurs cours respectifs : la preuve de la règle de la chaîne ; la convergence de la descente stochastique ; le maximum de vraisemblance dans son cadre général ; la structure bidimensionnelle des images détruite par la vectorisation.",
    },
  ],
};
