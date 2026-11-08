"use client";

import { useActionState, useState } from "react";

type Etat = { ok: boolean; message: string } | null;
type Action = (avant: Etat, formData: FormData) => Promise<Etat>;

const CHAMP = "mt-1 w-full rounded-xl border border-trait bg-white px-3 py-2.5 text-[15px]";
const LIBELLE = "block text-sm font-medium";

export function ReponseArtisan({
  action,
  aConfirmer,
  valeurs,
}: {
  action: Action;
  aConfirmer: boolean;
  valeurs: {
    type: "prix" | "visite" | null;
    prix: string;
    disponibilite: string;
    message: string;
    societe: string;
    contact: string;
    telephone: string;
    email: string;
    metier: string;
  };
}) {
  const [etat, envoyer, envoi] = useActionState(action, null);
  const [type, setType] = useState<"prix" | "visite">(valeurs.type ?? "prix");

  return (
    <form action={envoyer} className="space-y-4 rounded-2xl border border-trait bg-white p-4">
      <h2 className="text-base font-semibold">Votre réponse officielle</h2>
      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="sr-only">Type de réponse</legend>
        {(["prix", "visite"] as const).map((choix) => (
          <label
            key={choix}
            className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium ${
              type === choix ? "border-ink bg-ink text-white" : "border-trait"
            }`}
          >
            <input type="radio" name="type" value={choix} checked={type === choix} onChange={() => setType(choix)} className="sr-only" />
            {choix === "prix" ? "Je donne mon prix" : "Je dois d'abord voir"}
          </label>
        ))}
      </fieldset>
      <label className={LIBELLE}>
        {type === "prix" ? "Prix HT en euros" : "Prix estimatif HT, même approximatif"}
        <input name="prix" inputMode="decimal" defaultValue={valeurs.prix} required={type === "prix"} placeholder="180" className={CHAMP} />
      </label>
      <label className={LIBELLE}>
        {type === "prix" ? "Quand pouvez-vous intervenir ?" : "Quand pouvez-vous passer voir ?"}
        <input name="disponibilite" required maxLength={300} defaultValue={valeurs.disponibilite} placeholder="Demain matin, 9 h" className={CHAMP} />
      </label>
      <label className={LIBELLE}>
        Précisions (facultatif)
        <textarea name="message" rows={3} maxLength={1000} defaultValue={valeurs.message} className={CHAMP} />
      </label>
      {aConfirmer ? (
        <div className="space-y-3 rounded-xl bg-fond p-3">
          <p className="text-sm font-medium">Vos coordonnées</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={LIBELLE}>Entreprise ou nom<input name="societe" required defaultValue={valeurs.societe} className={CHAMP} /></label>
            <label className={LIBELLE}>Téléphone<input name="telephone" type="tel" required defaultValue={valeurs.telephone} className={CHAMP} /></label>
            <label className={LIBELLE}>Votre nom<input name="contact" defaultValue={valeurs.contact} className={CHAMP} /></label>
            <label className={LIBELLE}>Mail<input name="email" type="email" defaultValue={valeurs.email} className={CHAMP} /></label>
            <label className={LIBELLE}>Métier<input name="metier" defaultValue={valeurs.metier} className={CHAMP} /></label>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="accord" className="mt-1 h-4 w-4" />
            <span>J&apos;accepte que Tycoon garde mes coordonnées pour me proposer des missions. Je peux le refuser à tout moment.</span>
          </label>
        </div>
      ) : null}
      {etat ? <p role="status" className={`text-sm ${etat.ok ? "text-emerald-700" : "text-rose-700"}`}>{etat.message}</p> : null}
      <button type="submit" disabled={envoi} className="w-full rounded-xl bg-brand px-4 py-3 text-[15px] font-semibold text-ink hover:bg-brand-strong disabled:opacity-50">
        {envoi ? "Envoi…" : "Envoyer ma réponse"}
      </button>
    </form>
  );
}

export function RefusArtisan({ action }: { action: Action }) {
  const [etat, envoyer, envoi] = useActionState(action, null);
  return (
    <details className="rounded-2xl border border-trait bg-white p-4 text-sm">
      <summary className="cursor-pointer font-medium">Je ne suis pas disponible</summary>
      <form action={envoyer} className="mt-3 space-y-3">
        <label className="flex items-start gap-2">
          <input type="checkbox" name="opposition" className="mt-1 h-4 w-4" />
          <span>Ne plus me contacter pour d&apos;autres missions</span>
        </label>
        {etat ? <p role="status" className={etat.ok ? "text-emerald-700" : "text-rose-700"}>{etat.message}</p> : null}
        <button type="submit" disabled={envoi} className="rounded-xl border border-trait px-4 py-2 font-medium disabled:opacity-50">
          Envoyer
        </button>
      </form>
    </details>
  );
}
