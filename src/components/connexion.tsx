"use client";

import { useActionState } from "react";

import { connexion } from "@/app/tycoon/actions";

export function Connexion() {
  const [erreur, envoyer, envoi] = useActionState(connexion, null);
  return (
    <form action={envoyer} className="space-y-3 rounded-2xl border border-trait bg-white p-4">
      <label className="block text-sm font-medium">
        Mot de passe
        <input name="motDePasse" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-trait px-3 py-2.5" />
      </label>
      {erreur ? <p role="alert" className="text-sm text-rose-700">{erreur}</p> : null}
      <button type="submit" disabled={envoi} className="w-full rounded-xl bg-brand px-4 py-3 font-semibold text-ink disabled:opacity-50">
        Entrer
      </button>
    </form>
  );
}
