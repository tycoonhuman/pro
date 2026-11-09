import type { Metadata } from "next";

import { DocumentsMission } from "@/components/documents-artisan";
import { RejoindreLien } from "@/components/rejoindre-lien";
import { lireLien } from "@/lib/gmao";

import { rejoindre } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Intervention à pourvoir" };

/** Le lien ouvert d'une intervention (D-127) : la mission, sans client ni adresse, puis l'entrée. */
export default async function Mission({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  const lien = await lireLien(jeton).catch(() => null);

  if (!lien) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Ce lien n&apos;est plus valable</h1>
        <p className="text-slate-600">Contactez Tycoon si vous pensez que c&apos;est une erreur.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-brand-ink">Intervention à pourvoir · Tycoon</p>
        <h1 className="text-2xl font-bold">{lien.secteur}</h1>
      </div>
      <section className="rounded-2xl border border-trait bg-white p-4">
        <h2 className="text-base font-semibold">Le travail</h2>
        <p className="mt-2 whitespace-pre-wrap text-[15px] text-slate-700">{lien.description}</p>
        {lien.dateSouhaitee ? (
          <p className="mt-2 text-[15px] text-slate-700">
            <span className="font-medium">Date souhaitée :</span> {lien.dateSouhaitee}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-slate-500">L&apos;adresse et le contact sur place sont donnés à l&apos;artisan retenu.</p>
      </section>

      <DocumentsMission documents={lien.documents} />
      {!lien.ouvert ? (
        <p className="rounded-2xl border border-trait bg-white p-4 text-slate-700">
          Cette demande est complète ou clôturée. Merci de votre intérêt : Tycoon vous proposera d&apos;autres missions. Si vous aviez déjà
          répondu, indiquez le même téléphone ci-dessous pour retrouver votre demande.
        </p>
      ) : null}
      <RejoindreLien action={rejoindre.bind(null, jeton)} />
    </div>
  );
}
