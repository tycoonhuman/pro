import "server-only";

/**
 * Le seul chemin du site pro vers les données : la porte `/api/pro/v1` de la
 * GMAO (D-117), de serveur à serveur. La clé ne quitte jamais le serveur.
 */

export type Statut = "envoyee" | "repondue" | "declinee" | "acceptee" | "refusee";
export type Auteur = "technicien" | "norman" | "tycoon";
export type Message = { id: string; auteur: Auteur; contenu: string; at: string };
/** `normanEcrit` : NORMAN prépare sa réponse (absent d'une GMAO plus ancienne). */
export type Salon = { messages: Message[]; ouvert: boolean; reprise: boolean; normanEcrit?: boolean };
export type Resultat<T = undefined> = { ok: boolean; message: string; donnees?: T };

export type Mission = {
  statut: Statut;
  secteur: string;
  description: string;
  dateSouhaitee: string | null;
  prixCentimes: number | null;
  disponibilite: string | null;
  typeReponse: "prix" | "visite" | null;
  message: string | null;
  technicien: {
    societe: string;
    contact: string | null;
    telephone: string | null;
    email: string | null;
    metier: string | null;
    aConfirmer: boolean;
  };
  bonUrl: string | null;
  /** Ce que Tycoon a choisi de montrer (D-129). Absent d'une GMAO plus ancienne. */
  documents?: DocumentsArtisan;
};

export type DocumentsArtisan = {
  photos: { id: string; nom: string; url: string }[];
  textes: { id: string; titre: string; texte: string }[];
};

export type OffreTycoon = {
  id: string;
  statut: Statut;
  interventionId: string;
  interventionNumero: string | null;
  secteur: string;
  description: string;
  dateSouhaitee: string | null;
  technicien: { societe: string; contact: string | null; telephone: string | null; email: string | null };
  typeReponse: "prix" | "visite" | null;
  prixCentimes: number | null;
  disponibilite: string | null;
  message: string | null;
  reponduAt: string | null;
  createdAt: string;
  reprise: boolean;
  salonFerme: boolean;
  nbMessages: number;
  dernierMessageAt: string | null;
  lienArtisan: string;
};

export class GmaoIndisponible extends Error {}

function config() {
  const url = process.env.GMAO_URL?.replace(/\/$/, "");
  const cle = process.env.PRO_GMAO_KEY;
  if (!url || !cle) throw new GmaoIndisponible("GMAO_URL ou PRO_GMAO_KEY manquante");
  return { url, cle };
}

async function appel<T>(chemin: string, corps?: unknown): Promise<T | null> {
  const { url, cle } = config();
  const reponse = await fetch(`${url}/api/pro/v1/${chemin}`, {
    method: corps === undefined ? "GET" : "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: corps === undefined ? undefined : JSON.stringify(corps),
    cache: "no-store",
  });
  if (reponse.status === 404) return null;
  if (!reponse.ok && reponse.status !== 500) {
    throw new GmaoIndisponible(`GMAO ${reponse.status} sur ${chemin.split("/")[0]}`);
  }
  return (await reponse.json()) as T;
}

const jeton = (token: string) => encodeURIComponent(token);
const echec: { ok: false; message: string } = { ok: false, message: "Le service est indisponible. Réessayez dans un instant." };

export const lireMission = (token: string) => appel<Mission>(`mission/${jeton(token)}`);
export const lireSalon = (token: string) => appel<Salon>(`mission/${jeton(token)}/salon`);
export const ecrireArtisan = async (token: string, texte: string) =>
  (await appel<Resultat<Salon>>(`mission/${jeton(token)}/salon`, { texte })) ?? echec;
export const repondre = async (token: string, saisie: Record<string, unknown>) =>
  (await appel<Resultat>(`mission/${jeton(token)}/reponse`, saisie)) ?? echec;
export const refuser = async (token: string, opposition: boolean) =>
  (await appel<Resultat>(`mission/${jeton(token)}/refus`, { opposition })) ?? echec;

export const lireOffres = async () => (await appel<OffreTycoon[]>("offres")) ?? [];
export const lireOffre = (id: string) =>
  appel<{ offre: OffreTycoon; salon: Salon }>(`offres/${encodeURIComponent(id)}`);
export const ecrireTycoon = async (id: string, texte: string) =>
  (await appel<Resultat<Salon>>(`offres/${encodeURIComponent(id)}/messages`, { texte })) ?? echec;
export const rendreLaMain = async (id: string) =>
  (await appel<Resultat<Salon>>(`offres/${encodeURIComponent(id)}/rendre-main`, {})) ?? echec;
export const decider = async (id: string, accepter: boolean) =>
  (await appel<Resultat>(`offres/${encodeURIComponent(id)}/decision`, { accepter })) ?? echec;

export const resumeNorman = async (interventionId: string) =>
  (await appel<Resultat<{ texte: string }>>(`interventions/${encodeURIComponent(interventionId)}/resume`, {})) ?? echec;

/** Le lien ouvert d'une intervention (D-127). */
export type LienPublic = {
  secteur: string;
  description: string;
  dateSouhaitee: string | null;
  ouvert: boolean;
  placesRestantes: number;
  documents?: DocumentsArtisan;
};
export const lireLien = (token: string) => appel<LienPublic>(`lien/${jeton(token)}`);
export const rejoindreLien = async (token: string, saisie: Record<string, unknown>) =>
  (await appel<{ ok: true; token: string } | { ok: false; message: string }>(`lien/${jeton(token)}/rejoindre`, saisie)) ?? echec;
