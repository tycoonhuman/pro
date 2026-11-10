"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { creerDemande, type DemandeCreee, decider, ecrireTycoon, lireOffre, rendreLaMain, resumeNorman, type Resultat, type Salon } from "@/lib/gmao";
import { fermerSession, configurationManquante, motDePasseValide, ouvrirSession, sessionTycoon } from "@/lib/session";

/** Chaque action de l'espace Tycoon relit la session : une action est appelable de partout. */
async function garde() {
  if (!(await sessionTycoon())) throw new Error("Session expirée");
}

const echec = { ok: false, message: "Le service est indisponible, ou votre session a expiré." };

export async function connexion(_avant: string | null, formData: FormData): Promise<string | null> {
  const saisi = formData.get("motDePasse");
  const manque = configurationManquante();
  if (manque) return `L'espace Tycoon n'est pas configuré : ${manque}`;
  if (typeof saisi !== "string" || !motDePasseValide(saisi)) {
    await new Promise((fin) => setTimeout(fin, 800));
    return "Mot de passe incorrect.";
  }
  await ouvrirSession();
  redirect("/tycoon");
}

export async function deconnexion() {
  await fermerSession();
  redirect("/tycoon/connexion");
}

export async function lireSalonTycoon(offreId: string): Promise<Salon | null> {
  try {
    await garde();
    return (await lireOffre(offreId))?.salon ?? null;
  } catch {
    return null;
  }
}

export async function envoyerTycoon(offreId: string, texte: string): Promise<Resultat<Salon>> {
  try {
    await garde();
    return await ecrireTycoon(offreId, texte);
  } catch {
    return echec;
  }
}

export async function rendreMain(offreId: string): Promise<Resultat<Salon>> {
  try {
    await garde();
    return await rendreLaMain(offreId);
  } catch {
    return echec;
  }
}

export async function deciderOffre(offreId: string, accepter: boolean): Promise<Resultat> {
  try {
    await garde();
    const retour = await decider(offreId, accepter);
    revalidatePath("/tycoon");
    revalidatePath(`/tycoon/offres/${offreId}`);
    return retour;
  } catch {
    return echec;
  }
}

export async function resumer(interventionId: string): Promise<Resultat<{ texte: string }>> {
  try {
    await garde();
    return await resumeNorman(interventionId);
  } catch {
    return echec;
  }
}

/** Créer l'intervention et son lien ouvert dans la GMAO (D-135). */
export async function nouvelleDemande(_avant: DemandeCreee | null, formData: FormData): Promise<DemandeCreee> {
  try {
    await garde();
    const champ = (nom: string) => String(formData.get(nom) ?? "").trim();
    const resultat = await creerDemande({
      siteId: champ("siteId"),
      titre: champ("titre"),
      description: champ("description"),
      metierId: champ("metierId"),
      secteur: champ("secteur"),
      date: champ("date"),
      priorite: champ("priorite"),
    });
    if (resultat.ok) revalidatePath("/tycoon");
    return resultat;
  } catch {
    return echec;
  }
}
