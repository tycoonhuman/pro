"use server";

import { redirect } from "next/navigation";

import { desinscrireAlertes } from "@/lib/gmao";

export async function confirmer(jeton: string) {
  const resultat = await desinscrireAlertes(jeton).catch(() => ({ ok: false }));
  redirect(`/alertes/stop/${encodeURIComponent(jeton)}?fait=${resultat.ok ? "1" : "0"}`);
}
