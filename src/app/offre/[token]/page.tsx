import type { Metadata } from "next";

import { DocumentsMission } from "@/components/documents-artisan";
import { ReglesTycoon } from "@/components/regles-tycoon";
import { ReponseArtisan, RefusArtisan } from "@/components/formulaires-artisan";
import { Salon } from "@/components/salon";
import { lireMission, lireSalon } from "@/lib/gmao";

import { envoyerArtisan, envoyerRefus, envoyerReponse, lireSalonArtisan } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Demande d'intervention" };

function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-trait bg-white p-4">
      <h2 className="text-base font-semibold">{titre}</h2>
      <div className="mt-2 text-[15px] text-slate-700">{children}</div>
    </section>
  );
}

export default async function Offre({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const mission = await lireMission(token).catch(() => null);

  if (!mission) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Ce lien n&apos;est plus valable</h1>
        <p className="text-slate-600">Contactez Tycoon si vous pensez que c&apos;est une erreur.</p>
      </div>
    );
  }

  const ouverte = mission.statut === "envoyee" || mission.statut === "repondue";
  const salon = await lireSalon(token).catch(() => null);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-brand-ink">Demande d&apos;intervention Tycoon</p>
        <h1 className="text-2xl font-bold">{mission.secteur}</h1>
      </div>

      {mission.statut === "acceptee" ? (
        <div className="rounded-2xl bg-ink p-4 text-white">
          <p className="text-lg font-semibold">Tycoon vous confie cette intervention.</p>
          <p className="mt-1 text-sm text-slate-300">
            Votre bon d&apos;intervention contient l&apos;adresse, le contact sur place et le dépôt des photos, du rapport et de la facture.
          </p>
          {mission.bonUrl ? (
            <a href={mission.bonUrl} className="mt-3 inline-block rounded-xl bg-brand px-4 py-2.5 font-semibold text-ink">
              Ouvrir mon bon d&apos;intervention
            </a>
          ) : null}
        </div>
      ) : null}
      {!ouverte && mission.statut !== "acceptee" ? (
        <p className="rounded-2xl border border-trait bg-white p-4 text-slate-700">
          Cette demande est clôturée. Merci de votre réponse : Tycoon reviendra vers vous pour d&apos;autres missions.
        </p>
      ) : null}

      <Carte titre="Le travail">
        <p className="whitespace-pre-wrap">{mission.description}</p>
        {mission.dateSouhaitee ? <p className="mt-2"><span className="font-medium">Date souhaitée :</span> {mission.dateSouhaitee}</p> : null}
        <p className="mt-2 text-sm text-slate-500">L&apos;adresse et le contact sur place sont donnés à l&apos;artisan retenu.</p>
      </Carte>

      <DocumentsMission documents={mission.documents} />

      <ReglesTycoon />

      {salon ? (
        <Salon
          cote="artisan"
          initial={salon}
          lire={lireSalonArtisan.bind(null, token)}
          envoyer={envoyerArtisan.bind(null, token)}
        />
      ) : (
        <p className="text-sm text-slate-500">La discussion est momentanément indisponible.</p>
      )}

      {ouverte ? (
        <>
          <ReponseArtisan
            key={`${mission.typeReponse}-${mission.prixCentimes}`}
            action={envoyerReponse.bind(null, token)}
            aConfirmer={mission.technicien.aConfirmer}
            valeurs={{
              type: mission.typeReponse,
              prix: mission.prixCentimes !== null ? String(mission.prixCentimes / 100) : "",
              disponibilite: mission.disponibilite ?? "",
              message: mission.message ?? "",
              societe: mission.technicien.societe,
              contact: mission.technicien.contact ?? "",
              telephone: mission.technicien.telephone ?? "",
              email: mission.technicien.email ?? "",
              metier: mission.technicien.metier ?? "",
            }}
          />
          <Carte titre="Paiement">
            Aucun acompte. Vous êtes payé de l&apos;instantané à 30 jours, après les photos, le rapport, la validation de
            l&apos;intervention et le contrôle de Tycoon. Devis et factures à Tycoon Human, 99 avenue Achille Peretti,
            92200 Neuilly-sur-Seine, SIRET 921 389 763 00019.
          </Carte>
          <RefusArtisan action={envoyerRefus.bind(null, token)} />
        </>
      ) : null}
    </div>
  );
}
