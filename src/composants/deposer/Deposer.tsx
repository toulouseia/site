"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Accueil, Contact, Etat, Membre, Pole } from "@/donnees/types";
import {
  ajouterMembre,
  chargerMesProjets,
  chargerProjet,
  deposerProjet,
  enregistrerMoi,
  modifierProjet,
  retirerImageProjet,
  retirerMembre,
  supprimerProjet,
  televerserImageProjet,
  type CorpsProjet,
  type Moi,
  type ProjetMien,
  type Refus,
} from "@/donnees/distant";
import { useMoi } from "@/composants/coque/moi";
import { Icone } from "@/composants/base/Icone";
import { Jauge } from "@/composants/base/Jauge";
import { DeuxZones } from "@/composants/base/DeuxZones";
import { Etq, Vide } from "@/composants/base/Atomes";
import { Bloc, ChoixCadre, Ligne, Refus as MessageRefus } from "@/composants/base/Formulaire";
import { EditeurContacts } from "@/composants/base/Contacts";
import { SqueletteLignes } from "@/composants/base/Squelette";
import { EnTeteSection } from "@/composants/coque/EnTeteMobile";
import { SigneGrand } from "@/composants/projets/SigneGrand";
import { ImageProjet } from "@/composants/projets/Vignette";
import { CRAN_ETAT, NOM_ACCUEIL, NOM_ETAT, adresseProjet, cx } from "@/lib/format";

const POLES: Pole[] = ["Agentic", "ModIA", "Embedded", "Hackathon"];
const ETATS: Etat[] = ["idee", "chantier", "essai", "service"];

type Brouillon = {
  nom: string;
  resume: string;
  presentation: string;
  categorie: "open" | "business";
  pole: Pole;
  etat: Etat;
  depot: string;
  modele: string;
  /** Vide tant que le porteur ne s'est pas prononcé — c'est permis. */
  accueil: Accueil | "";
  /**
   * Le bloc « vous ». `null` tant qu'on n'y a pas touché : c'est alors ce que
   * le profil connecté dit qui s'affiche, et qui part à l'envoi.
   */
  contacts: Contact[] | null;
  prenom: string | null;
  /** D'où l'on vient, en texte libre : une école et une année, un poste, rien. */
  origine: string | null;
};

const VIDE: Brouillon = {
  nom: "",
  resume: "",
  presentation: "",
  categorie: "open",
  pole: "Agentic",
  etat: "idee",
  depot: "",
  modele: "",
  accueil: "",
  contacts: null,
  prenom: null,
  origine: null,
};

const CONTACTS_VIDES: Contact[] = [{ canal: "discord", valeur: "" }];

/** Où le brouillon attend pendant qu'on va se connecter. L'onglet seulement. */
const CLE_BROUILLON = "toulouseia.brouillon-depot";

function lireBrouillonGarde(): string | null {
  try {
    return window.sessionStorage.getItem(CLE_BROUILLON);
  } catch {
    return null;
  }
}
function garderBrouillon(b: Brouillon) {
  try {
    window.sessionStorage.setItem(CLE_BROUILLON, JSON.stringify(b));
  } catch {
    // Sans stockage, on part quand même : on retapera.
  }
}
function oublierBrouillon() {
  try {
    window.sessionStorage.removeItem(CLE_BROUILLON);
  } catch {
    // Rien à effacer.
  }
}
const rienAEcouter = () => () => {};

// ─────────────────────────────────────────────────────────────────────────────
// Le dépôt, pour de vrai.
//
// Le formulaire à gauche, la case du mur telle qu'elle paraîtra à droite — pas
// une imitation : le signe de l'écran des projets, nourri par le brouillon.
//
// Deux temps à l'envoi, dans cet ordre : la personne (`PUT /api/moi` — le nom
// sous lequel on paraît, d'où l'on vient, où l'on est joignable), puis le
// projet (`POST /api/projets`, ou `PUT /api/projets/:id` quand on modifie le
// sien). Un refus du serveur nomme un champ, et le message s'affiche à côté de
// ce champ : jamais dans une boîte du navigateur.
//
// Sans être connecté, le formulaire s'écrit quand même ; le bouton propose de
// se connecter, le brouillon attend dans l'onglet, et il est repris au retour.
// ─────────────────────────────────────────────────────────────────────────────

/** `?projet=<id>` : le projet à modifier, lu sous `Suspense` pour que la page reste préfabriquée. */
function LecteurProjet({ onId }: { onId: (id: string | null) => void }) {
  const id = useSearchParams().get("projet");
  useEffect(() => onId(id), [id, onId]);
  return null;
}

export function Deposer() {
  const [id, setId] = useState<string | null>(null);
  // Le brouillon laissé avant d'aller se connecter. Lu comme un état extérieur
  // à React : rien sur le serveur, la valeur de l'onglet une fois dans le
  // navigateur — et la clé remonte alors le formulaire avec ce brouillon.
  const garde = useSyncExternalStore(rienAEcouter, lireBrouillonGarde, () => null);
  const repris = !id && garde ? garde : null;
  return (
    <>
      <Suspense fallback={null}>
        <LecteurProjet onId={setId} />
      </Suspense>
      <Formulaire key={`${id ?? "nouveau"}:${repris ? "repris" : "vide"}`} id={id} repris={repris} />
    </>
  );
}

/** Ce que la fiche existante donne au brouillon, pour la modification. */
function depuisProjet(p: ProjetMien): Brouillon {
  return {
    ...VIDE,
    nom: p.nom,
    resume: p.resume,
    presentation: p.presentation,
    categorie: p.categorie,
    pole: p.pole,
    etat: p.etat,
    depot: p.depot ?? "",
    modele: p.modele ?? "",
    accueil: p.accueil ?? "",
  };
}

function relireBrouillon(json: string): Brouillon {
  try {
    return { ...VIDE, ...(JSON.parse(json) as Partial<Brouillon>) };
  } catch {
    // Un brouillon illisible ne vaut pas un écran cassé : on repart à vide.
    return VIDE;
  }
}

function Formulaire({ id, repris }: { id: string | null; repris: string | null }) {
  const router = useRouter();
  const { moi, poser } = useMoi();
  const [b, setB] = useState<Brouillon>(() => (repris ? relireBrouillon(repris) : VIDE));
  const [ouvert, setOuvert] = useState(false);
  const [refus, setRefus] = useState<Refus | null>(null);
  const [envoi, setEnvoi] = useState(false);
  // Modification : le projet existant, ou ce qui l'empêche.
  const [existant, setExistant] = useState<
    { etat: "attente" } | { etat: "absent" } | { etat: "lu"; projet: ProjetMien }
  >({ etat: id ? "attente" : "absent" });
  const [confirmer, setConfirmer] = useState(false);
  // L'image d'illustration vit dans un état local, jamais dans le brouillon
  // `sessionStorage` : un fichier ne se sérialise pas, et on ne le garde pas
  // pendant qu'on part se connecter. `retirImage` marque le retrait d'une image
  // déjà en ligne — effectué à l'envoi, pas avant.
  const [fichierImage, setFichierImage] = useState<File | null>(null);
  const [apercuImage, setApercuImage] = useState<string | null>(null);
  const [retirImage, setRetirImage] = useState(false);
  // Un dépôt neuf déjà créé, mais dont l'image a échoué : le garder évite de
  // recréer un doublon au réessai. On le modifie alors, au lieu de re-déposer.
  const [depose, setDepose] = useState<ProjetMien | null>(null);
  const modification = id !== null;

  const maj = (p: Partial<Brouillon>) => setB((v) => ({ ...v, ...p }));

  // Le bloc « vous » : ce qu'on a tapé, sinon ce que le profil connecté dit.
  const personne: Moi | null = moi.etat === "connecte" ? moi.personne : null;
  const prenom = b.prenom ?? personne?.nom ?? "";
  const origine = b.origine ?? personne?.origine ?? "";
  const contacts =
    b.contacts ?? (personne?.contacts.length ? personne.contacts : CONTACTS_VIDES);

  // Modification : le projet vient de « les miens » — s'il n'y est pas, il
  // n'est pas à nous, et la page le dit.
  const connecte = moi.etat === "connecte";
  useEffect(() => {
    if (!id || !connecte) return;
    const controle = new AbortController();
    chargerMesProjets(controle.signal).then((r) => {
      if (controle.signal.aborted) return;
      const projet = r.ok ? r.valeur.projets.find((p) => p.id === id) : undefined;
      if (!projet) {
        setExistant({ etat: "absent" });
        return;
      }
      setExistant({ etat: "lu", projet });
      setB(depuisProjet(projet));
    });
    return () => controle.abort();
  }, [id, connecte]);

  // L'aperçu local est un `blob:` : on le libère dès qu'il change ou au démontage,
  // pour ne pas fuir de mémoire à chaque fichier choisi.
  useEffect(() => {
    if (!apercuImage) return;
    return () => URL.revokeObjectURL(apercuImage);
  }, [apercuImage]);

  // L'image déjà en ligne, s'il y en a une (à la modification). On l'affiche tant
  // qu'un nouveau fichier n'est pas choisi et que le retrait n'est pas demandé.
  const imageExistante =
    existant.etat === "lu" ? existant.projet.image : undefined;
  const apercu = apercuImage ?? (retirImage ? null : imageExistante ?? null);

  function choisirImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFichierImage(f);
    setRetirImage(false);
    setApercuImage(f ? URL.createObjectURL(f) : null);
  }

  function retirerImage() {
    setFichierImage(null);
    setApercuImage(null);
    // Une image déjà en ligne : on note le retrait, effectué à l'envoi.
    if (imageExistante) setRetirImage(true);
  }

  const contactsRemplis = contacts.filter((c) => c.valeur.trim().length > 0);
  const exigences = [
    { cle: "nom", nom: "Un nom", ok: b.nom.trim().length >= 2 },
    {
      cle: "resume",
      nom: "Une ligne de résumé",
      ok: b.resume.trim().length >= 12,
    },
    {
      cle: "depot",
      nom: b.categorie === "open" ? "Un dépôt public" : "Un modèle de revenus",
      ok:
        b.categorie === "open"
          ? b.depot.trim().length >= 3
          : b.modele.trim().length >= 8,
    },
    { cle: "qui", nom: "Votre prénom", ok: prenom.trim().length >= 2 },
    {
      cle: "contact",
      nom: "Un moyen de vous joindre",
      ok: contactsRemplis.length > 0,
    },
  ];
  const complet = exigences.every((e) => e.ok);
  const erreur = (champ: string) => (refus?.champ === champ ? refus.erreur : null);

  /** Où revenir après la connexion : ici, avec le même projet s'il y en a un. */
  const suite = modification ? `/deposer?projet=${id}` : "/deposer";
  const entree = (service: "google" | "github") =>
    `/api/auth/${service}/entree?suite=${encodeURIComponent(suite)}`;
  /** Au clic sur la connexion, avant que le navigateur parte : le brouillon attend dans l'onglet. */
  const garder = () => garderBrouillon(b);

  const corpsProjet = (): CorpsProjet => ({
    nom: b.nom.trim(),
    resume: b.resume.trim(),
    presentation: b.presentation.trim(),
    categorie: b.categorie,
    pole: b.pole,
    etat: b.etat,
    accueil: b.accueil || null,
    ...(b.categorie === "open" ? { depot: b.depot.trim() } : { modele: b.modele.trim() }),
  });

  async function envoyer() {
    if (moi.etat !== "connecte") return;
    setEnvoi(true);
    setRefus(null);

    // 1. La personne, d'abord : le projet porte son nom.
    const rMoi = await enregistrerMoi({
      nom: prenom.trim(),
      origine: origine.trim() || null,
      contacts: contactsRemplis,
    });
    if (!rMoi.ok) {
      if (rMoi.statut === 401) poser(null);
      // Le serveur parle de « nom » ; ici ce champ s'appelle le porteur.
      setRefus(
        rMoi.refus.champ === "nom" ? { ...rMoi.refus, champ: "porteur" } : rMoi.refus,
      );
      setEnvoi(false);
      return;
    }
    poser(rMoi.valeur.personne);

    // 2. Le projet. Un dépôt neuf déjà créé (image échouée au coup précédent) se
    //    modifie plutôt que de se recréer : réessayer ne doit pas faire de doublon.
    const dejaCree = !modification ? depose : null;
    const r = modification
      ? await modifierProjet(id as string, corpsProjet())
      : dejaCree
        ? await modifierProjet(dejaCree.id, corpsProjet())
        : await deposerProjet(corpsProjet());
    if (!r.ok) {
      if (r.statut === 401) poser(null);
      setRefus(r.refus);
      setEnvoi(false);
      return;
    }
    if (!modification && !dejaCree) setDepose(r.valeur.projet);
    // 3. L'image, une fois l'id du projet connu : un appel binaire dédié, jamais
    //    le corps JSON du projet. Un refus s'affiche comme les autres, à côté du
    //    champ image.
    const projet = r.valeur.projet;
    if (fichierImage) {
      const ri = await televerserImageProjet(projet.id, fichierImage);
      if (!ri.ok) {
        setRefus(ri.refus);
        setEnvoi(false);
        return;
      }
    } else if (retirImage && imageExistante) {
      const rr = await retirerImageProjet(projet.id);
      if (!rr.ok) {
        setRefus(rr.refus);
        setEnvoi(false);
        return;
      }
    }

    oublierBrouillon();
    router.push(adresseProjet({ slug: r.valeur.projet.slug, distant: true }));
  }

  async function mettreEnPause(enPause: boolean) {
    if (existant.etat !== "lu") return;
    setEnvoi(true);
    setRefus(null);
    const r = await modifierProjet(existant.projet.id, { enPause });
    if (r.ok) setExistant({ etat: "lu", projet: r.valeur.projet });
    else setRefus(r.refus);
    setEnvoi(false);
  }

  async function supprimer() {
    if (existant.etat !== "lu") return;
    setEnvoi(true);
    setRefus(null);
    const r = await supprimerProjet(existant.projet.id);
    if (!r.ok) {
      setRefus(r.refus);
      setEnvoi(false);
      setConfirmer(false);
      return;
    }
    router.push("/profil");
  }

  const titre = modification ? "Modifier" : "Déposer";

  // ── Modification : pas encore lu, ou pas à nous ────────────────────────────
  if (modification && existant.etat !== "lu") {
    return (
      <div className="flex flex-col bg-papier lg:h-full">
        <EnTeteSection titre={titre} />
        <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">Modifier un projet</Etq>
        </div>
        {moi.etat === "inconnu" || (connecte && existant.etat === "attente") ? (
          <div className="px-4 py-4">
            <SqueletteLignes lignes={6} />
          </div>
        ) : (
          <Vide
            titre="Ce projet n'est pas le vôtre"
            mesure={
              moi.etat === "connecte"
                ? "Seul son porteur peut le modifier"
                : "Il faut être connecté pour modifier un projet"
            }
          >
            {moi.etat === "connecte" ? (
              <Link href="/profil" className="cmd cmd-plein cmd-s">
                Mes projets
              </Link>
            ) : (
              <a href={entree("google")} className="cmd cmd-plein cmd-s">
                Se connecter
              </a>
            )}
            <Link href="/projets" className="cmd cmd-trait cmd-s">
              Revenir au mur
            </Link>
          </Vide>
        )}
      </div>
    );
  }

  const enPause = existant.etat === "lu" && !!existant.projet.enPause;

  const planche = (
    <div className="flex flex-col lg:h-full">
      <div className="sticky top-0 z-30 bg-papier/97 backdrop-blur-[2px] lg:static lg:shrink-0 lg:backdrop-blur-none">
        <EnTeteSection titre={titre} />
        <div className="hidden h-12 items-center gap-3 border-b border-filet px-4 lg:flex">
          <Etq ton="encre">{modification ? "Modifier un projet" : "Déposer un projet"}</Etq>
          <span className="t-cote text-[0.75rem] text-brique">
            {exigences.filter((e) => e.ok).length} / {exigences.length}
          </span>
          <span className="t-tech text-[0.6875rem] text-gris-58">
            champs requis
          </span>
          {enPause ? (
            <span className="t-etq ml-auto text-brique">en pause</span>
          ) : null}
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <Bloc titre="Le projet" cote="1">
          <Ligne etiquette="Nom" erreur={erreur("nom")}>
            <input
              value={b.nom}
              maxLength={60}
              onChange={(e) => maj({ nom: e.target.value })}
              placeholder="Sillage"
              aria-invalid={erreur("nom") ? "true" : undefined}
              className="champ"
            />
          </Ligne>
          <Ligne
            etiquette="Résumé"
            note={`${b.resume.length}/90`}
            aide="une ligne, sans verbe conjugué"
            erreur={erreur("resume")}
          >
            <input
              value={b.resume}
              maxLength={90}
              onChange={(e) => maj({ resume: e.target.value })}
              placeholder="Perte de liaison vidéo d'un drone, détectée avant la coupure."
              aria-invalid={erreur("resume") ? "true" : undefined}
              className="champ"
            />
          </Ligne>
          <Ligne
            etiquette="Présentation"
            note={`${b.presentation.length}/400`}
            aide="deux phrases au plus"
            erreur={erreur("presentation")}
          >
            <textarea
              value={b.presentation}
              maxLength={400}
              rows={3}
              onChange={(e) => maj({ presentation: e.target.value })}
              placeholder="Ce que ça fait, et où c'en est."
              aria-invalid={erreur("presentation") ? "true" : undefined}
              className="champ resize-none leading-[1.5]"
            />
          </Ligne>
        </Bloc>

        {/* L'illustration, facultative : un fichier image qui remplace le signe
            sur le mur, la carte et la fiche. Elle reste en état local — jamais
            dans le brouillon — et part par sa route dédiée à l'envoi. */}
        <Bloc titre="L'image" cote="2">
          <Ligne
            etiquette="Illustration"
            aide="png, jpeg ou webp — 5 Mio au plus"
            erreur={erreur("image")}
          >
            {apercu ? (
              <div className="flex items-start gap-3">
                <span className="block h-20 w-28 shrink-0 overflow-hidden border border-filet-fort">
                  <ImageProjet src={apercu} nom={b.nom || "Illustration du projet"} />
                </span>
                <button
                  type="button"
                  onClick={retirerImage}
                  className="cmd cmd-nu cmd-s"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={choisirImage}
                aria-invalid={erreur("image") ? "true" : undefined}
                className="champ"
              />
            )}
          </Ligne>
        </Bloc>

        <Bloc titre="Le cadre" cote="3">
          <Ligne etiquette="Catégorie" erreur={erreur("categorie")}>
            <div className="grid grid-cols-2 gap-2">
              <ChoixCadre
                actif={b.categorie === "open"}
                onClick={() => maj({ categorie: "open" })}
                titre="Open"
                detail="Dépôt public obligatoire"
              />
              <ChoixCadre
                actif={b.categorie === "business"}
                onClick={() => maj({ categorie: "business" })}
                titre="Business"
                detail="Des revenus visés"
              />
            </div>
          </Ligne>

          {b.categorie === "open" ? (
            <Ligne etiquette="Dépôt public" aide="proprietaire/nom" erreur={erreur("depot")}>
              <input
                value={b.depot}
                onChange={(e) => maj({ depot: e.target.value })}
                placeholder="toulouseia/sillage"
                aria-invalid={erreur("depot") ? "true" : undefined}
                className="champ t-tech"
              />
            </Ligne>
          ) : (
            <Ligne etiquette="Revenus" erreur={erreur("modele")}>
              <input
                value={b.modele}
                maxLength={400}
                onChange={(e) => maj({ modele: e.target.value })}
                placeholder="Abonnement par entreprise, essai gratuit."
                aria-invalid={erreur("modele") ? "true" : undefined}
                className="champ"
              />
            </Ligne>
          )}

          <Ligne etiquette="Pôle" erreur={erreur("pole")}>
            <div className="flex flex-wrap gap-1.5">
              {POLES.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={b.pole === p}
                  onClick={() => maj({ pole: p })}
                  className="puce"
                >
                  {p}
                </button>
              ))}
            </div>
          </Ligne>

          <Ligne etiquette="Avancement" erreur={erreur("etat")}>
            <div className="flex flex-wrap gap-1.5">
              {ETATS.map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-pressed={b.etat === e}
                  onClick={() => maj({ etat: e })}
                  className="puce"
                >
                  <Jauge cran={CRAN_ETAT[e]} className="h-3" />
                  {NOM_ETAT[e]}
                </button>
              ))}
            </div>
          </Ligne>
        </Bloc>

        {/* Deux cadres, pas un nombre de postes : le porteur dit s'il a envie
            d'en parler, et les gens décident d'eux-mêmes s'ils passent. Ne
            rien choisir reste possible — c'est même le premier état. */}
        <Bloc titre="L'accueil" cote="4">
          <div className="grid gap-2 sm:grid-cols-2">
            <ChoixCadre
              actif={b.accueil === "ouvert"}
              onClick={() =>
                maj({ accueil: b.accueil === "ouvert" ? "" : "ouvert" })
              }
              titre={NOM_ACCUEIL.ouvert}
              detail="prêt à discuter du projet, sans rien promettre"
            />
            <ChoixCadre
              actif={b.accueil === "complet"}
              onClick={() =>
                maj({ accueil: b.accueil === "complet" ? "" : "complet" })
              }
              titre={NOM_ACCUEIL.complet}
              detail="vous ne cherchez personne en ce moment"
            />
          </div>
          {erreur("accueil") ? <MessageRefus>{erreur("accueil")}</MessageRefus> : null}

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <Etq>Où vous joindre</Etq>
              <span className="t-tech text-[0.625rem] text-gris-40">
                l&apos;échange se fera là-bas, pas dans l&apos;application
              </span>
            </div>
            <div className="mt-2">
              <EditeurContacts
                contacts={contacts}
                onChange={(contacts) => maj({ contacts })}
              />
            </div>
            {erreur("contacts") ? <MessageRefus>{erreur("contacts")}</MessageRefus> : null}
          </div>
        </Bloc>

        {/* Le bloc « vous » vient du profil : ce qu'on écrit ici y est
            enregistré avant le projet, et vaut pour tous ses projets. */}
        <Bloc titre="Vous" cote="5" dernier>
          <Ligne
            etiquette="Porteur"
            aide={moi.etat === "connecte" ? "enregistré sur votre profil" : undefined}
            erreur={erreur("porteur") ?? erreur("origine")}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
              <input
                value={prenom}
                maxLength={60}
                onChange={(e) => maj({ prenom: e.target.value })}
                placeholder="Prénom et initiale"
                aria-label="Prénom"
                aria-invalid={erreur("porteur") ? "true" : undefined}
                className="champ"
              />
              <input
                value={origine}
                maxLength={60}
                onChange={(e) => maj({ origine: e.target.value })}
                placeholder="N7, 2A · INSA · en poste"
                aria-label="D'où vous venez"
                aria-invalid={erreur("origine") ? "true" : undefined}
                className="champ"
              />
            </div>
          </Ligne>
        </Bloc>

        {modification && existant.etat === "lu" ? (
          <>
            <SectionMembres
              projetId={existant.projet.id}
              slug={existant.projet.slug}
            />
            <Commandes
              enPause={enPause}
              envoi={envoi}
              confirmer={confirmer}
              onPause={() => void mettreEnPause(!enPause)}
              onDemanderSuppression={() => setConfirmer(true)}
              onAnnuler={() => setConfirmer(false)}
              onSupprimer={() => void supprimer()}
            />
          </>
        ) : null}

        <div className="h-24 lg:h-6" />
      </div>

      {/* Téléphone : l'aperçu de la ligne colle en bas, avec la commande. */}
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 border-t border-filet bg-papier px-3 py-2 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOuvert(true)}
            className="cmd cmd-trait cmd-s shrink-0"
          >
            Aperçu
          </button>
          <span className="t-cote text-[0.75rem] text-brique">
            {exigences.filter((e) => e.ok).length}/{exigences.length}
          </span>
          <span className="flex-1" />
          <Commande
            moi={moi}
            complet={complet}
            envoi={envoi}
            modification={modification}
            petit
            onEnvoyer={() => void envoyer()}
            entree={entree}
            onGarder={garder}
          />
        </div>
      </div>
    </div>
  );

  const volet = (
    <div className="flex h-full flex-col bg-papier">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-filet px-2 lg:px-4">
        <button
          type="button"
          onClick={() => setOuvert(false)}
          className="cmd cmd-nu cmd-s gap-1.5 lg:hidden"
        >
          <Icone nom="fleche-gauche" className="h-4 w-4" />
          Formulaire
        </button>
        <Etq ton="encre" className="hidden lg:block">
          Aperçu
        </Etq>
        <span className="t-tech hidden text-[0.6875rem] text-gris-58 lg:block">
          la case telle qu&apos;elle paraîtra
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-filet px-4 py-4">
          <Etq>Sur le mur</Etq>
          <div className="mt-2 grid grid-cols-2 border border-filet-fort">
            {[false, true].map((choisi) => (
              <div
                key={String(choisi)}
                className={cx(
                  "flex flex-col items-center justify-center gap-3 px-2 py-4",
                  choisi
                    ? "bg-sombre text-papier"
                    : "border-r border-filet bg-papier text-encre",
                )}
              >
                <SigneGrand cran={CRAN_ETAT[b.etat]} className="h-16 w-auto" />
                <span
                  className={cx(
                    "t-tech line-clamp-2 max-w-full text-center text-[0.75rem] leading-[1.25]",
                    !b.nom && (choisi ? "text-nuit-72" : "text-gris-40"),
                  )}
                >
                  {b.nom || "Nom du projet"}
                </span>
              </div>
            ))}
          </div>
          <p className="t-etq mt-2 text-gris-40">Au repos, puis survolé</p>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-baseline gap-2">
            <Etq ton="encre">
              {complet ? "Rien ne manque" : "Ce qui manque"}
            </Etq>
            {complet ? null : (
              <span className="t-cote text-[0.75rem] text-brique">
                {exigences.filter((e) => !e.ok).length}
              </span>
            )}
          </div>
          <ul className="mt-2 border-t border-filet">
            {exigences.map((e) => (
              <li
                key={e.cle}
                className="flex items-center gap-2 border-b border-filet py-2"
              >
                <span
                  className={cx(
                    "flex h-[15px] w-[15px] shrink-0 items-center justify-center border",
                    e.ok
                      ? "border-encre bg-encre text-papier"
                      : "border-brique/60",
                  )}
                >
                  {e.ok ? (
                    <Icone nom="coche" className="h-2.5 w-2.5" epaisseur={2.4} />
                  ) : null}
                </span>
                <span
                  className={cx(
                    "t-corps text-[0.8125rem]",
                    e.ok ? "text-gris-58 line-through decoration-1" : "text-encre",
                  )}
                >
                  {e.nom}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shrink-0 border-t border-filet px-3 py-2.5">
        {refus && !refus.champ ? <MessageRefus>{refus.erreur}</MessageRefus> : null}
        {refus?.champ === "corps" ? <MessageRefus>{refus.erreur}</MessageRefus> : null}
        <Commande
          moi={moi}
          complet={complet}
          envoi={envoi}
          modification={modification}
          onEnvoyer={() => void envoyer()}
          entree={entree}
          onGarder={garder}
        />
        <p className="t-etq mt-2 text-gris-40">
          {moi.etat === "connecte"
            ? "Public dès l'enregistrement"
            : "Se connecter : gérer ses projets sur le site, et rien d'autre"}
        </p>
      </div>
    </div>
  );

  return <DeuxZones planche={planche} volet={volet} ouvertMobile={ouvert} />;
}

/**
 * La commande principale, la même en bas du volet et dans la barre du
 * téléphone : déposer ou enregistrer quand on est connecté, se connecter
 * sinon — et rien tant qu'on ne sait pas.
 */
function Commande({
  moi,
  complet,
  envoi,
  modification,
  petit,
  onEnvoyer,
  entree,
  onGarder,
}: {
  moi: ReturnType<typeof useMoi>["moi"];
  complet: boolean;
  envoi: boolean;
  modification: boolean;
  petit?: boolean;
  onEnvoyer: () => void;
  /** L'adresse de départ vers un service de connexion. */
  entree: (service: "google" | "github") => string;
  /** Appelé au clic, avant que le navigateur parte : le brouillon est gardé. */
  onGarder: () => void;
}) {
  const taille = petit ? "cmd cmd-s" : "cmd w-full";
  if (moi.etat === "inconnu") {
    return (
      <button type="button" disabled className={cx(taille, "cmd-trait")}>
        {modification ? "Enregistrer" : "Déposer"}
      </button>
    );
  }
  if (moi.etat === "personne") {
    return (
      <div className={cx("flex items-center gap-2", !petit && "flex-col")}>
        {/* Des liens ordinaires vers le serveur, qui renvoie chez Google ou
            GitHub et ramène ici, brouillon repris. */}
        <a href={entree("google")} onClick={onGarder} className={cx(taille, "cmd-plein")}>
          Se connecter pour déposer
        </a>
        <a
          href={entree("github")}
          onClick={onGarder}
          className={cx(petit ? "cmd cmd-nu cmd-s" : "cmd cmd-nu cmd-s w-full")}
        >
          ou avec GitHub
        </a>
      </div>
    );
  }
  return (
    <button
      type="button"
      disabled={!complet || envoi}
      onClick={onEnvoyer}
      className={cx(taille, "cmd-plein")}
    >
      {envoi
        ? "Envoi…"
        : modification
          ? "Enregistrer les modifications"
          : petit
            ? "Déposer"
            : "Déposer le projet"}
    </button>
  );
}

/**
 * Les membres participants d'un projet, en modification seulement (on a un `id`).
 * Réservée au porteur — l'écran de modification l'est déjà (`peutToucher` côté
 * serveur, chargement par « les miens »). On liste, on retire, on ajoute par
 * pseudo GitHub (repli : un nom). Les membres apparaissent, ils n'obtiennent
 * aucun droit : c'est le porteur qui gère la liste.
 *
 * La liste vient de la fiche (`chargerProjet` — c'est là que le serveur charge
 * les membres, jamais « les miens »), et se rafraîchit après chaque opération :
 * l'ajout renvoie la nouvelle liste, le retrait enlève la ligne.
 */
function SectionMembres({ projetId, slug }: { projetId: string; slug: string }) {
  const [membres, setMembres] = useState<Membre[] | null>(null);
  const [github, setGithub] = useState("");
  const [nom, setNom] = useState("");
  const [refus, setRefus] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    const controle = new AbortController();
    chargerProjet(slug, controle.signal).then((r) => {
      if (controle.signal.aborted) return;
      setMembres(r.ok ? (r.valeur.projet.membres ?? []) : []);
    });
    return () => controle.abort();
  }, [slug]);

  const g = github.trim();
  const n = nom.trim();
  const peutAjouter = (g.length > 0 || n.length > 0) && !occupe;

  async function ajouter() {
    if (!peutAjouter) return;
    setOccupe(true);
    setRefus(null);
    // Le pseudo GitHub prime : c'est lui qui rend le pré-compte récupérable.
    const r = await ajouterMembre(projetId, g ? { github: g } : { nom: n });
    if (r.ok) {
      setMembres(r.valeur.membres);
      setGithub("");
      setNom("");
    } else {
      setRefus(r.refus.erreur);
    }
    setOccupe(false);
  }

  async function retirer(personneId: string) {
    setOccupe(true);
    setRefus(null);
    const r = await retirerMembre(projetId, personneId);
    if (r.ok) setMembres((m) => (m ?? []).filter((x) => x.id !== personneId));
    else setRefus(r.refus.erreur);
    setOccupe(false);
  }

  return (
    <section className="border-t border-filet px-3 py-3.5 lg:px-4">
      <div className="flex items-baseline gap-2">
        <Etq ton="encre">Les membres</Etq>
        <span className="t-tech text-[0.6875rem] text-gris-58">
          ils apparaissent sur la fiche, sans droit de modification
        </span>
      </div>

      {membres === null ? (
        <p className="t-tech mt-2 text-[0.6875rem] text-gris-40">Chargement…</p>
      ) : membres.length ? (
        <ul className="mt-2 border-t border-filet">
          {membres.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-2 border-b border-filet py-2"
            >
              <span className="t-corps text-[0.8125rem] text-encre">{m.nom}</span>
              {m.github ? (
                <span className="t-tech text-[0.6875rem] text-gris-40">
                  @{m.github}
                </span>
              ) : null}
              <span className="flex-1" />
              <button
                type="button"
                disabled={occupe}
                onClick={() => void retirer(m.id)}
                className="cmd cmd-nu cmd-s"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="t-tech mt-2 text-[0.6875rem] text-gris-40">
          Aucun membre pour l&apos;instant.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="flex min-w-[9rem] flex-1 flex-col gap-1">
          <span className="t-etq text-gris-58">Pseudo GitHub</span>
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void ajouter();
              }
            }}
            placeholder="samirkema"
            aria-label="Pseudo GitHub du membre"
            className="champ t-tech"
          />
        </label>
        <label className="flex min-w-[9rem] flex-1 flex-col gap-1">
          <span className="t-etq text-gris-58">ou un nom</span>
          <input
            value={nom}
            maxLength={60}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void ajouter();
              }
            }}
            placeholder="Prénom et initiale"
            aria-label="Nom du membre"
            className="champ"
          />
        </label>
        <button
          type="button"
          disabled={!peutAjouter}
          onClick={() => void ajouter()}
          className="cmd cmd-trait cmd-s shrink-0"
        >
          {occupe ? "…" : "Ajouter"}
        </button>
      </div>
      {refus ? <MessageRefus>{refus}</MessageRefus> : null}
    </section>
  );
}

/** Mettre en pause, reprendre, supprimer : les commandes du projet existant. */
function Commandes({
  enPause,
  envoi,
  confirmer,
  onPause,
  onDemanderSuppression,
  onAnnuler,
  onSupprimer,
}: {
  enPause: boolean;
  envoi: boolean;
  confirmer: boolean;
  onPause: () => void;
  onDemanderSuppression: () => void;
  onAnnuler: () => void;
  onSupprimer: () => void;
}) {
  return (
    <section className="border-t border-filet px-3 py-3.5 lg:px-4">
      <div className="flex items-baseline gap-2">
        <Etq ton="encre">Le projet lui-même</Etq>
      </div>
      <p className="t-tech mt-1 text-[0.6875rem] text-gris-58">
        {enPause
          ? "En pause : il reste sur le mur, hachuré, et n'appelle personne."
          : "Un projet en pause reste sur le mur, hachuré, et n'appelle personne."}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={envoi}
          onClick={onPause}
          className="cmd cmd-trait cmd-s"
        >
          {enPause ? "Reprendre" : "Mettre en pause"}
        </button>
        <span className="flex-1" />
        {confirmer ? (
          <>
            <span className="t-tech text-[0.6875rem] text-brique">
              Définitif — la fiche disparaît du mur.
            </span>
            <button
              type="button"
              disabled={envoi}
              onClick={onAnnuler}
              className="cmd cmd-nu cmd-s"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={onSupprimer}
              className="cmd cmd-trait cmd-s border-brique text-brique"
            >
              Confirmer la suppression
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={envoi}
            onClick={onDemanderSuppression}
            className="cmd cmd-nu cmd-s"
          >
            Supprimer
          </button>
        )}
      </div>
    </section>
  );
}
