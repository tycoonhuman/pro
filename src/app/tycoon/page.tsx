import Link from "next/link";
import { redirect } from "next/navigation";

import { CopierLien, ResumeNorman } from "@/components/tycoon";
import { lireOffres, type OffreTycoon } from "@/lib/gmao";
import { prix, quand, STATUTS } from "@/lib/format";
import { sessionTycoon } from "@/lib/session";

import { deconnexion } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demandes en cours" };

const OUVERTES = new Set(["envoyee", "repondue"]);

/** Le meilleur d'abord : une réponse avec prix, la moins chère, puis la plus récente. */
function trier(a: OffreTycoon, b: OffreTycoon): number {
  const pa = a.prixCentimes ?? Number.MAX_SAFE_INTEGER;
  const pb = b.prixCentimes ?? Number.MAX_SAFE_INTEGER;
  if (pa !== pb) return pa - pb;
  return b.createdAt.localeCompare(a.createdAt);
}

export default async function Demandes() {
  if (!(await sessionTycoon())) redirect("/tycoon/connexion");
  const offres = await lireOffres().catch(() => null);

  const parIntervention = new Map<string, OffreTycoon[]>();
  for (const offre of offres ?? []) {
    const liste = parIntervention.get(offre.interventionId) ?? [];
    liste.push(offre);
    parIntervention.set(offre.interventionId, liste);
  }
  const groupes = [...parIntervention.values()].sort((a, b) => {
    const enCours = (liste: OffreTycoon[]) => liste.some((o) => OUVERTES.has(o.statut));
    if (enCours(a) !== enCours(b)) return enCours(a) ? -1 : 1;
    return b[0].createdAt.localeCompare(a[0].createdAt);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Demandes en cours</h1>
        <Link href="/tycoon/nouvelle" className="ml-auto rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-ink">
          + Nouvelle demande
        </Link>
        <form action={deconnexion}>
          <button type="submit" className="text-sm underline">Se déconnecter</button>
        </form>
      </div>
      {offres === null ? <p className="text-rose-700">La GMAO ne répond pas. Réessayez dans un instant.</p> : null}
      {offres?.length === 0 ? (
        <p className="text-slate-600">Aucune demande. Créez-en une avec « Nouvelle demande », ou depuis la fiche d&apos;une intervention dans la GMAO.</p>
      ) : null}

      {groupes.map((liste) => {
        const premiere = liste[0];
        const triees = [...liste].sort(trier);
        const reponses = liste.filter((o) => o.statut === "repondue").length;
        return (
          <section key={premiere.interventionId} className="space-y-3 rounded-2xl border border-trait bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-brand-ink">Ticket {premiere.interventionNumero ?? "—"}</p>
                <h2 className="text-lg font-semibold">{premiere.secteur}</h2>
              </div>
              <p className="text-sm text-slate-600">
                {liste.length} artisan{liste.length > 1 ? "s" : ""} · {reponses} réponse{reponses > 1 ? "s" : ""}
              </p>
            </div>
            <p className="line-clamp-2 text-sm text-slate-600">{premiere.description}</p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-1.5 pr-3 font-medium">Artisan</th>
                    <th className="py-1.5 pr-3 font-medium">Prix HT</th>
                    <th className="py-1.5 pr-3 font-medium">Disponibilité</th>
                    <th className="py-1.5 pr-3 font-medium">Statut</th>
                    <th className="py-1.5 font-medium">Salon</th>
                  </tr>
                </thead>
                <tbody>
                  {triees.map((offre) => (
                    <tr key={offre.id} className="border-t border-trait align-top">
                      <td className="py-2 pr-3">
                        <Link href={`/tycoon/offres/${offre.id}`} className="font-medium underline-offset-2 hover:underline">
                          {offre.technicien.societe}
                        </Link>
                        <div><CopierLien url={offre.lienArtisan} /></div>
                      </td>
                      <td className="py-2 pr-3 font-semibold">
                        {prix(offre.prixCentimes)}
                        {offre.typeReponse === "visite" ? <span className="block text-xs font-normal text-slate-500">estimatif, visite demandée</span> : null}
                        {offre.aDecider ? <span className="mt-1 block w-fit rounded bg-amber-100 px-1.5 text-xs font-medium text-amber-900">À décider</span> : null}
                        {offre.negocieCentimes ? <span className="block text-xs font-normal text-emerald-700">accord NORMAN : {prix(offre.negocieCentimes)}</span> : null}
                      </td>
                      <td className="py-2 pr-3">{offre.disponibilite ?? "—"}</td>
                      <td className="py-2 pr-3">{STATUTS[offre.statut]}</td>
                      <td className="py-2">
                        <Link href={`/tycoon/offres/${offre.id}`} className="text-brand-ink underline">
                          {offre.nbMessages} message{offre.nbMessages > 1 ? "s" : ""}
                        </Link>
                        <span className="block text-xs text-slate-500">{quand(offre.dernierMessageAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {liste.some((o) => OUVERTES.has(o.statut)) ? <ResumeNorman interventionId={premiere.interventionId} /> : null}
          </section>
        );
      })}
    </div>
  );
}
