"use client";

import { useActionState, useMemo, useState } from "react";

import { nouvelleDemande } from "@/app/tycoon/actions";
import type { ChoixDemande, DemandeCreee } from "@/lib/gmao";

const CHAMP = "mt-1 w-full rounded-xl border border-trait bg-white px-3 py-2.5 text-[15px]";
const LIBELLE = "block text-sm font-medium";

export function FormulaireDemande({ sites, metiers }: ChoixDemande) {
  const [etat, action, envoi] = useActionState<DemandeCreee | null, FormData>(nouvelleDemande, null);
  const [recherche, setRecherche] = useState("");
  const [siteId, setSiteId] = useState("");
  const [copie, setCopie] = useState(false);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const liste = q
      ? sites.filter((s) => [s.nom, s.client, s.ville].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)))
      : sites;
    return liste.slice(0, 200);
  }, [sites, recherche]);
  const site = sites.find((s) => s.id === siteId);

  if (etat?.ok) {
    const whatsapp = etat.lien ? `https://wa.me/?text=${encodeURIComponent(`Bonjour, Tycoon a une intervention pour vous. Donnez votre prix ici : ${etat.lien}`)}` : null;
    return (
      <section className="space-y-3 rounded-2xl border border-trait bg-white p-4">
        <p className="text-xs font-medium text-brand-ink">Ticket {etat.numero ?? "—"}</p>
        <p className="font-semibold">{etat.message}</p>
        {etat.lien ? (
          <>
            <p className="break-all rounded-xl bg-slate-50 px-3 py-2 text-sm">{etat.lien}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(etat.lien!).then(() => setCopie(true)).catch(() => undefined)}
                className="rounded-xl bg-brand px-4 py-2.5 font-semibold text-ink"
              >
                {copie ? "Lien copié" : "Copier le lien"}
              </button>
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-xl border border-trait px-4 py-2.5 font-semibold">
                  Partager sur WhatsApp
                </a>
              ) : null}
            </div>
          </>
        ) : null}
        <p className="text-sm text-slate-600">Les réponses des artisans apparaîtront dans « Demandes en cours » et sur la fiche de la GMAO.</p>
      </section>
    );
  }

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-trait bg-white p-4">
      <div>
        <label className={LIBELLE}>
          Site du client
          <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un site, un client, une ville" className={CHAMP} />
        </label>
        <select name="siteId" required value={siteId} onChange={(e) => setSiteId(e.target.value)} size={6} className={`${CHAMP} text-sm`}>
          {filtres.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nom}{s.client ? ` · ${s.client}` : ""}{s.ville ? ` · ${s.ville}` : ""}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">Le site reste dans la GMAO : les artisans ne voient ni le client ni l&apos;adresse.</p>
      </div>
      <label className={LIBELLE}>
        Titre
        <input name="titre" required maxLength={200} placeholder="Fuite sous évier" className={CHAMP} />
      </label>
      <label className={LIBELLE}>
        Travail à réaliser, sans client ni adresse
        <textarea name="description" required rows={4} maxLength={2000} className={CHAMP} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={LIBELLE}>
          Métier
          <select name="metierId" className={CHAMP} defaultValue="">
            <option value="">—</option>
            {metiers.map((m) => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </label>
        <label className={LIBELLE}>
          Ville montrée aux artisans
          <input key={siteId} name="secteur" maxLength={120} defaultValue={site?.ville ?? ""} placeholder="Lyon 7e" className={CHAMP} />
        </label>
        <label className={LIBELLE}>
          Date souhaitée
          <input name="date" maxLength={120} placeholder="Demain matin" className={CHAMP} />
        </label>
      </div>
      {etat && !etat.ok ? <p role="alert" className="text-sm text-rose-700">{etat.message}</p> : null}
      <button type="submit" disabled={envoi} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-ink disabled:opacity-50 sm:w-auto">
        {envoi ? "Création…" : "Créer l'intervention et le lien"}
      </button>
    </form>
  );
}
