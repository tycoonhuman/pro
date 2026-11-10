"use server";

import { redirect } from "next/navigation";

import { rejoindreLien } from "@/lib/gmao";

/** Rejoindre le lien ouvert : l'artisan reçoit sa propre demande, puis on l'y emmène (D-127). */
export async function rejoindre(jeton: string, _avant: string | null, formData: FormData): Promise<string | null> {
  const lire = (nom: string) => String(formData.get(nom) ?? "").trim();
  let resultat;
  try {
    resultat = await rejoindreLien(jeton, {
      societe: lire("societe"),
      contact: lire("contact"),
      telephone: lire("telephone"),
      email: lire("email"),
      metier: lire("metier"),
      accord: formData.get("accord") === "on",
      alertes: formData.get("alertes") === "on",
      ville: String(formData.get("ville") ?? ""),
      rayon: Number(formData.get("rayon") ?? 30),
    });
  } catch {
    return "Le service est indisponible. Réessayez dans un instant.";
  }
  if (!resultat.ok) return resultat.message;
  redirect(`/offre/${encodeURIComponent(resultat.token)}`);
}
