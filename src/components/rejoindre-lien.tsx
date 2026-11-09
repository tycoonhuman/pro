"use client";

import { useActionState } from "react";

const CHAMP = "mt-1 w-full rounded-xl border border-trait bg-white px-3 py-2.5 text-[15px]";
const LIBELLE = "block text-sm font-medium";

/** Le formulaire d'entrée du lien ouvert (D-127) : qui vous êtes, puis votre salon. */
export function RejoindreLien({ action }: { action: (avant: string | null, formData: FormData) => Promise<string | null> }) {
  const [erreur, envoyer, envoi] = useActionState(action, null);
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
        <label className={LIBELLE}>Mail (facultatif)<input name="email" type="email" maxLength={200} className={CHAMP} /></label>
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
