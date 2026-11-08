"use server";

import { revalidatePath } from "next/cache";

import { ecrireArtisan, lireSalon, refuser, repondre, type Resultat, type Salon } from "@/lib/gmao";

/** Le jeton du lien est la seule clé de l'artisan : chaque action le renvoie à la GMAO, qui le relit. */

const echec = { ok: false, message: "Le service est indisponible. Réessayez dans un instant." };

export async function lireSalonArtisan(token: string): Promise<Salon | null> {
  try {
    return await lireSalon(token);
  } catch {
    return null;
  }
}

export async function envoyerArtisan(token: string, texte: string): Promise<Resultat<Salon>> {
  try {
    return await ecrireArtisan(token, texte);
  } catch {
    return echec;
  }
}

export type EtatFormulaire = { ok: boolean; message: string } | null;

export async function envoyerReponse(token: string, _avant: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const champ = (nom: string) => {
    const valeur = formData.get(nom);
    return typeof valeur === "string" ? valeur : "";
  };
  try {
    const retour = await repondre(token, {
      type: champ("type"),
      prix: champ("prix"),
      disponibilite: champ("disponibilite"),
      message: champ("message"),
      accord: formData.get("accord") === "on",
      societe: champ("societe"),
      contact: champ("contact"),
      telephone: champ("telephone"),
      email: champ("email"),
      metier: champ("metier"),
    });
    if (retour.ok) revalidatePath(`/offre/${token}`);
    return { ok: retour.ok, message: retour.message };
  } catch {
    return echec;
  }
}

export async function envoyerRefus(token: string, _avant: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  try {
    const retour = await refuser(token, formData.get("opposition") === "on");
    if (retour.ok) revalidatePath(`/offre/${token}`);
    return { ok: retour.ok, message: retour.message };
  } catch {
    return echec;
  }
}
