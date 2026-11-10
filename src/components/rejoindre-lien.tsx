"use client";

import { useActionState, useState } from "react";

const CHAMP = "mt-1 w-full rounded-xl border border-trait bg-white px-3 py-2.5 text-[15px]";
const LIBELLE = "block text-sm font-medium";

/** Le formulaire d'entrée du lien ouvert (D-127) : qui vous êtes, puis votre salon. */
export function RejoindreLien({ action }: { action: (avant: string | null, formData: FormData) => Promise<string | null> }) {
  const [erreur, envoyer, envoi] = useActionState(action, null);
  const [alertes, setAlertes] = useState(false);
  return (
    <form action={envoyer} className="space-y-3 rounded-2xl border border-trait bg-white p-4">
      <h2 className="text-base font-semibold">Proposer votre prix</h2>
      <p className="text-sm text-slate-600">
        Présentez-vous en quelques secondes : vous accédez ensuite à votre espace pour poser vos questions à NORMAN, l&apos;assistant IA de
        Tycoon, et donner votre prix. Pas de compte à créer.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={LIBELLE}>Entreprise ou nom<input name="societe" required maxLength={200} className={CHAMP} /></label>
        <label className={LIBELLE}>Téléphone<input name="telephone" type="tel" required maxLength={40} className={CHAMP} /></label>
        <label className={LIBELLE}>Votre métier<input name="metier" maxLength={120} placeholder="Plombier" className={CHAMP} /></label>
        <label className={LIBELLE}>Mail{alertes ? "" : " (facultatif)"}<input name="email" type="email" required={alertes} maxLength={200} className={CHAMP} /></label>
      </div>
      <div className="rounded-xl bg-brand/10 p-3">
        <label className="flex items-start gap-2 text-sm font-medium text-ink">
          <input name="alertes" type="checkbox" checked={alertes} onChange={(e) => setAlertes(e.target.checked)} className="mt-1" />
          <span>Prévenez-moi par mail des interventions près de chez moi</span>
        </label>
        {alertes ? (
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className={LIBELLE}>Votre ville ou code postal<input name="ville" required maxLength={120} placeholder="Villeurbanne ou 69100" className={CHAMP} /></label>
            <label className={LIBELLE}>
              Jusqu&apos;à
              <select name="rayon" defaultValue="30" className={CHAMP}>
                {[10, 20, 30, 50, 80, 100].map((km) => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </label>
            <p className="text-xs text-slate-600 sm:col-span-2">
              Vous serez aussi prévenu pour les lieux où Tycoon vous a déjà confié une intervention. Un lien de désinscription figure dans chaque mail.
            </p>
          </div>
        ) : null}
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input name="accord" type="checkbox" required className="mt-1" />
        <span>J&apos;accepte que Tycoon me recontacte au sujet de cette demande et d&apos;autres missions. Je pourrai m&apos;y opposer à tout moment.</span>
      </label>
      {erreur ? <p role="alert" className="text-sm text-rose-700">{erreur}</p> : null}
      <button type="submit" disabled={envoi} className="w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white disabled:opacity-50 sm:w-auto">
        {envoi ? "Un instant…" : "Accéder à la demande"}
      </button>
      <p className="text-xs text-slate-500">
        Aucun acompte. Si Tycoon vous retient, vous créerez votre compte à la fin de l&apos;intervention pour être payé.
      </p>
    </form>
  );
}
