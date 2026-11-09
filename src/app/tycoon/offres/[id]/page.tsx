import Link from "next/link";
import { redirect } from "next/navigation";

import { Salon } from "@/components/salon";
import { CopierLien, Decision } from "@/components/tycoon";
import { prix, quand, STATUTS } from "@/lib/format";
import { lireOffre } from "@/lib/gmao";
import { sessionTycoon } from "@/lib/session";

import { envoyerTycoon, lireSalonTycoon, rendreMain } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Salon" };

export default async function OffrePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await sessionTycoon())) redirect("/tycoon/connexion");
  const { id } = await params;
  const lu = await lireOffre(id).catch(() => null);
  if (!lu) return <p>Demande introuvable. <Link href="/tycoon" className="underline">Retour</Link></p>;
  const { offre, salon } = lu;

  return (
    <div className="space-y-4">
      <Link href="/tycoon" className="text-sm underline">← Demandes en cours</Link>
      <div>
        <p className="text-xs font-medium text-brand-ink">Ticket {offre.interventionNumero ?? "—"} · {offre.secteur}</p>
        <h1 className="text-2xl font-bold">{offre.technicien.societe}</h1>
        <p className="text-sm text-slate-600">
          {[offre.technicien.contact, offre.technicien.telephone, offre.technicien.email].filter(Boolean).join(" · ")}
        </p>
        <CopierLien url={offre.lienArtisan} />
      </div>

      <section className="grid gap-3 rounded-2xl border border-trait bg-white p-4 sm:grid-cols-3">
        <div><p className="text-xs text-slate-500">Prix HT</p><p className="text-lg font-semibold">{prix(offre.prixCentimes)}</p>
          {offre.typeReponse === "visite" ? <p className="text-xs text-slate-500">estimatif, visite demandée</p> : null}</div>
        <div><p className="text-xs text-slate-500">Disponibilité</p><p className="font-medium">{offre.disponibilite ?? "—"}</p></div>
        <div><p className="text-xs text-slate-500">Statut</p><p className="font-medium">{STATUTS[offre.statut]}</p>
          <p className="text-xs text-slate-500">Répondu : {quand(offre.reponduAt)}</p></div>
        {offre.message ? <p className="whitespace-pre-wrap text-sm text-slate-700 sm:col-span-3">{offre.message}</p> : null}
        {offre.historique && offre.historique.length ? (
          <div className="text-sm sm:col-span-3">
            <p className="text-xs text-slate-500">Négociation</p>
            <p className="font-medium">
              {offre.historique
                .map((p) => `${p.auteur === "technicien" ? "Artisan" : p.auteur === "norman" ? "NORMAN" : "Tycoon"} ${prix(p.prixCentimes)}`)
                .join(" → ")}
            </p>
            {offre.negocieCentimes ? <p className="text-xs text-emerald-700">Accord de principe à {prix(offre.negocieCentimes)} HT, à valider par vous.</p> : null}
            {offre.aDecider ? <p className="text-xs font-medium text-amber-800">Au-dessus du maximum : à décider ensemble.</p> : null}
          </div>
        ) : null}
      </section>

      {offre.statut === "repondue" ? <Decision offreId={offre.id} /> : null}

      <Salon
        cote="tycoon"
        initial={salon}
        lire={lireSalonTycoon.bind(null, offre.id)}
        envoyer={envoyerTycoon.bind(null, offre.id)}
        rendre={rendreMain.bind(null, offre.id)}
      />
    </div>
  );
}
