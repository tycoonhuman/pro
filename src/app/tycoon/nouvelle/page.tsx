import Link from "next/link";
import { redirect } from "next/navigation";

import { FormulaireDemande } from "@/components/nouvelle-demande";
import { lireChoixDemande } from "@/lib/gmao";
import { sessionTycoon } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nouvelle demande" };

/** Créer une intervention et la proposer aux artisans, sans passer par la GMAO (D-135). */
export default async function NouvelleDemande() {
  if (!(await sessionTycoon())) redirect("/tycoon/connexion");
  const choix = await lireChoixDemande().catch(() => null);
  return (
    <div className="space-y-4">
      <Link href="/tycoon" className="text-sm underline">← Demandes en cours</Link>
      <div>
        <h1 className="text-2xl font-bold">Nouvelle demande</h1>
        <p className="text-sm text-slate-600">
          L&apos;intervention est créée dans la GMAO avec son numéro, et un lien ouvert est prêt à partager aux artisans.
        </p>
      </div>
      {choix ? (
        <FormulaireDemande sites={choix.sites} metiers={choix.metiers} />
      ) : (
        <p className="text-rose-700">La GMAO ne répond pas. Réessayez dans un instant.</p>
      )}
    </div>
  );
}
