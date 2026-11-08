"use client";

import { useState, useTransition } from "react";

import { deciderOffre, resumer } from "@/app/tycoon/actions";

export function Decision({ offreId }: { offreId: string }) {
  const [envoi, demarrer] = useTransition();
  const [retour, setRetour] = useState("");
  const decider = (accepter: boolean) => {
    if (accepter && !window.confirm("Retenir cet artisan ? L'intervention passe dans la GMAO et les autres salons se ferment.")) return;
    demarrer(async () => setRetour((await deciderOffre(offreId, accepter)).message));
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={envoi} onClick={() => decider(true)} className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        Retenir cet artisan
      </button>
      <button type="button" disabled={envoi} onClick={() => decider(false)} className="rounded-xl border border-trait bg-white px-4 py-2 text-sm font-medium disabled:opacity-50">
        Ne pas retenir
      </button>
      {retour ? <p role="status" className="w-full text-sm text-slate-700">{retour}</p> : null}
    </div>
  );
}

export function ResumeNorman({ interventionId }: { interventionId: string }) {
  const [envoi, demarrer] = useTransition();
  const [texte, setTexte] = useState("");
  return (
    <div className="rounded-xl bg-ink p-3 text-white">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Le point de NORMAN</p>
        <button
          type="button"
          disabled={envoi}
          onClick={() => demarrer(async () => {
            const retour = await resumer(interventionId);
            setTexte(retour.ok ? (retour.donnees?.texte ?? "") : retour.message);
          })}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-50"
        >
          {envoi ? "NORMAN réfléchit…" : texte ? "Refaire le point" : "Demander le point"}
        </button>
      </div>
      {texte ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{texte}</p> : null}
    </div>
  );
}

export function CopierLien({ url }: { url: string }) {
  const [copie, setCopie] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(url).then(() => setCopie(true)).catch(() => undefined)}
      className="text-xs font-medium text-brand-ink underline"
    >
      {copie ? "Lien copié" : "Copier le lien de l'artisan"}
    </button>
  );
}
