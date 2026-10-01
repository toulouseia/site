import type { Bloc } from "@/serveur/domaine/blocs";

// ─────────────────────────────────────────────────────────────────────────────
// Panorama du machine learning · page 4, « Les objets fondamentaux ».
//
// RESSERRÉE le 8 septembre 2026 : 2 863 mots pour quatre objets. Chaque objet
// tient maintenant en trois lignes, l'appartement du fil conducteur sous les
// yeux, et la page se ferme sur le calcul qu'on refera page 9.
//
// PARTIS AU FORMULAIRE DE LA PAGE 11, sans perte :
//
//   la transposée et le rappel sur les vecteurs colonnes
//   la vérification des dimensions, et sa figure l1-fig11
//   la définition de préactivation
//   la distinction 𝒴 / 𝒴̂
//   les trois notations d'indice, x^(n) contre x_i contre W^[l]
//   la définition de représentation
//
// Un élève qui en a besoin les y trouve. Aucun n'est nécessaire pour lire les
// quatre objets, et chacun coûtait ici un encadré.
// ─────────────────────────────────────────────────────────────────────────────

export const S3_OBJETS: Bloc[] = [
  {
    id: "b-p3-1",
    type: "texte",
    texte:
      "L'appartement du fil conducteur fait 50 mètres carrés, compte 2 pièces, et s'est vendu deux cent mille euros. Une machine ne manipule ni appartements ni euros : elle manipule des nombres, et voici les quatre objets qui suffisent à écrire ce problème.",
  },
  {
    id: "b-p3-2",
    type: "titre",
    niveau: 2,
    texte: "L'entrée $\\mathbf{x}$ : ce que le modèle reçoit",
  },
  {
    id: "b-p3-3",
    type: "texte",
    texte:
      "L'appartement devient une liste de nombres rangés dans un ordre convenu d'avance, la surface d'abord et le nombre de pièces ensuite. Rien dans cette liste ne dit que le premier nombre est une surface : cela vit dans la tête de qui a fabriqué le fichier.",
  },
  {
    id: "b-p3-11",
    type: "formule",
    ancre: "entree-fil",
    latex:
      "\\mathbf{x} \\;=\\; \\begin{pmatrix} 50 \\\\ 2 \\end{pmatrix} \\;\\in\\; \\mathbb{R}^{2}, \\qquad x_1 = 50, \\qquad x_2 = 2",
    alt: "Le vecteur x est la colonne de cinquante et de deux, dans l'espace à deux dimensions. Sa première composante x indice un vaut cinquante, sa seconde x indice deux vaut deux.",
  },
  {
    id: "b-p3-9",
    type: "animation",
    ancre: "appartement-vecteur",
    animationId: "lappartement-devient-un-vecteur",
    legende:
      "Les deux grandeurs quittent le plan et vont se ranger entre les crochets : il ne reste du logement que deux nombres et leur rang dans la colonne.",
  },
  {
    id: "b-p3-13",
    type: "titre",
    niveau: 2,
    texte: "La vérité terrain $y$ : ce que le monde a répondu",
  },
  {
    id: "b-p3-15",
    type: "definition",
    terme: "Vérité terrain",
    anglais: "ground truth",
    texte:
      "Le nombre $y$ réellement associé à l'entrée $\\mathbf{x}$, relevé par quelqu'un. Pour notre appartement, $y = 200$ : le prix inscrit sur l'acte de vente, en milliers d'euros comme tous les prix de ce chapitre.",
  },
  {
    id: "b-p3-17",
    type: "titre",
    niveau: 2,
    texte: "Le jeu de données $\\mathcal{D}$ : les mille ventes",
  },
  {
    id: "b-p3-18",
    type: "texte",
    texte:
      "Une entrée et sa vérité terrain forment un **exemple**. L'agence en a mille : on note $N$ ce nombre, et on rassemble les $N$ exemples sous un seul nom.\n\nÀ la page 9, on refera tous les calculs sur $N = 2$ ventes seulement, pour pouvoir les vérifier à la main.",
  },
  {
    id: "b-p3-19",
    type: "formule",
    ancre: "jeu-de-donnees",
    latex:
      "\\mathcal{D} \\;=\\; \\left\\{ \\left(\\mathbf{x}^{(n)},\\, y^{(n)}\\right) \\right\\}_{n=1}^{N}",
    alt: "Le jeu de données D est l'ensemble des couples x exposant n entre parenthèses, y exposant n entre parenthèses, pour n allant de un à N.",
    legende:
      "L'exposant entre parenthèses numérote l'**exemple** : $x^{(3)}$ est la troisième vente, jamais $x$ au cube.",
  },
  {
    id: "b-p3-26",
    type: "titre",
    niveau: 2,
    texte: "Le modèle $f_{\\boldsymbol{\\theta}}$ : la fonction qu'on cherche",
  },
  {
    id: "b-p3-27",
    type: "texte",
    texte:
      "Les trois premiers objets décrivent une situation ; aucun ne calcule. Le quatrième prend une entrée et rend une estimation, et il porte des réglages, notés $\\boldsymbol{\\theta}$, qui sont justement ce qu'on cherche.",
  },
  {
    id: "b-p3-28",
    type: "formule",
    ancre: "modele",
    latex:
      "f_{\\boldsymbol{\\theta}} : \\mathbb{R}^{2} \\longrightarrow \\mathbb{R}, \\qquad \\widehat{y} \\;=\\; f_{\\boldsymbol{\\theta}}(\\mathbf{x})",
    alt: "La fonction f indicée par thêta va de l'espace à deux dimensions vers les réels. L'estimation y chapeau vaut f indicée thêta appliquée à x.",
    legende:
      "Le thêta est en **indice**, pas en argument : changer $\\boldsymbol{\\theta}$, ce n'est pas changer l'entrée, c'est changer de fonction.",
  },
  {
    id: "b-p3-30",
    type: "titre",
    niveau: 2,
    texte: "Le plus simple de ces modèles",
  },
  {
    id: "b-p3-31",
    type: "texte",
    texte:
      "On donne un poids à chaque caractéristique, on multiplie, on additionne, et on ajoute un nombre de plus. Les poids se notent $w_1$ et $w_2$, le nombre de plus se note $b$, et les trois ensemble font $\\boldsymbol{\\theta}$.",
  },
  {
    id: "b-p3-32",
    type: "formule",
    ancre: "modele-lineaire",
    latex:
      "\\widehat{y} \\;=\\; w_1 x_1 + w_2 x_2 + b",
    alt: "L'estimation y chapeau vaut w indice un fois x indice un, plus w indice deux fois x indice deux, plus b.",
    numero: "4.1",
  },
  {
    id: "b-p3-35",
    type: "animation",
    ancre: "somme-ponderee",
    animationId: "la-somme-ponderee",
    legende:
      "Le poids $w_1$ tourne de $0{,}5$ à $6$ et la barre monte avec lui : une unité de plus sur $w_1$ déplace $z$ de $50$.",
  },
  {
    id: "b-p3-46",
    type: "texte",
    texte:
      "Essayons $w_1 = 3$, $w_2 = 10$, $b = 20$ sur notre appartement.",
  },
  {
    id: "b-p3-47",
    type: "formule",
    ancre: "premier-calcul",
    latex:
      "\\widehat{y} \\;=\\; 3 \\times 50 + 10 \\times 2 + 20 \\;=\\; 190",
    alt: "L'estimation vaut trois fois cinquante, plus dix fois deux, plus vingt, ce qui fait cent quatre-vingt-dix.",
  },
  {
    id: "b-p3-48",
    type: "texte",
    texte:
      "Le prix payé était 200 : ces réglages-là se trompent de 10.",
  },
];
