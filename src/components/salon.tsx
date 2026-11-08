"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

export type Message = { id: string; auteur: "technicien" | "norman" | "tycoon"; contenu: string; at: string };
export type EtatSalon = { messages: Message[]; ouvert: boolean; reprise: boolean };
type Retour = { ok: boolean; message: string; donnees?: EtatSalon };

const RAFRAICHIR_MS = 8000;
const heure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const NOMS = { norman: "NORMAN · assistant IA", tycoon: "Tycoon", technicien: "Artisan" } as const;

type Props = {
  cote: "artisan" | "tycoon";
  initial: EtatSalon;
  lire: () => Promise<EtatSalon | null>;
  envoyer: (texte: string) => Promise<Retour>;
  rendre?: () => Promise<Retour>;
};

/** Le salon d'une demande (D-116) : un artisan, NORMAN, et Tycoon s'il reprend la main. */
export function Salon({ cote, initial, lire, envoyer, rendre }: Props) {
  const [etat, setEtat] = useState(initial);
  const [brouillon, setBrouillon] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, demarrer] = useTransition();
  const liste = useRef<HTMLUListElement>(null);

  const appliquer = useCallback((retour: Retour) => {
    if (retour.donnees) setEtat(retour.donnees);
    setErreur(retour.ok ? "" : retour.message);
  }, []);

  useEffect(() => {
    let actif = true;
    const minuterie = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      lire()
        .then((suivant) => actif && suivant && setEtat(suivant))
        .catch(() => undefined);
    }, RAFRAICHIR_MS);
    return () => {
      actif = false;
      clearInterval(minuterie);
    };
  }, [lire]);

  useEffect(() => {
    const el = liste.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [etat.messages.length, envoi]);

  const soumettre = () => {
    const texte = brouillon.trim();
    if (!texte || envoi) return;
    demarrer(async () => {
      const retour = await envoyer(texte);
      if (retour.ok) setBrouillon("");
      appliquer(retour);
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-trait bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-trait px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-brand">N</span>
          <div>
            <p className="text-sm font-semibold">{cote === "artisan" ? "Discuter avec Tycoon" : "Salon avec l'artisan"}</p>
            <p className="text-xs text-slate-500">
              {!etat.ouvert
                ? "Discussion close"
                : etat.reprise
                  ? "Tycoon a pris la main"
                  : "NORMAN, l'assistant IA de Tycoon, répond"}
            </p>
          </div>
        </div>
        {cote === "tycoon" && etat.ouvert && etat.reprise && rendre ? (
          <button
            type="button"
            disabled={envoi}
            onClick={() => demarrer(async () => appliquer(await rendre()))}
            className="rounded-lg border border-trait px-3 py-1.5 text-xs font-medium hover:bg-fond"
          >
            Rendre la main à NORMAN
          </button>
        ) : null}
      </div>

      <ul ref={liste} className="max-h-[55dvh] min-h-40 space-y-3 overflow-y-auto bg-fond/60 px-4 py-4" aria-live="polite">
        {etat.messages.map((message) => {
          const mien = cote === "artisan" ? message.auteur === "technicien" : message.auteur !== "technicien";
          const couleur =
            message.auteur === "technicien"
              ? "bg-white border border-trait"
              : message.auteur === "tycoon"
                ? "bg-brand-soft border border-brand-line"
                : "bg-ink text-white";
          return (
            <li key={message.id} className={`flex flex-col ${mien ? "items-end" : "items-start"}`}>
              <span className="mb-1 text-[11px] text-slate-500">
                {NOMS[message.auteur]} · {heure.format(new Date(message.at))}
              </span>
              <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug ${couleur}`}>
                {message.contenu}
              </p>
            </li>
          );
        })}
        {envoi && cote === "artisan" ? <li className="text-xs text-slate-500">NORMAN écrit…</li> : null}
      </ul>

      {etat.ouvert ? (
        <form
          className="flex items-end gap-2 border-t border-trait p-3"
          onSubmit={(evenement) => {
            evenement.preventDefault();
            soumettre();
          }}
        >
          <label htmlFor={`salon-${cote}`} className="sr-only">
            Votre message
          </label>
          <textarea
            id={`salon-${cote}`}
            value={brouillon}
            onChange={(evenement) => setBrouillon(evenement.target.value)}
            onKeyDown={(evenement) => {
              if (evenement.key === "Enter" && !evenement.shiftKey) {
                evenement.preventDefault();
                soumettre();
              }
            }}
            rows={2}
            maxLength={1500}
            placeholder={cote === "artisan" ? "Votre question, votre prix, vos disponibilités…" : "Votre message : NORMAN se taira"}
            className="min-h-11 flex-1 resize-y rounded-xl border border-trait px-3 py-2 text-[15px]"
          />
          <button
            type="submit"
            disabled={envoi || !brouillon.trim()}
            className="h-11 rounded-xl bg-brand px-4 text-sm font-semibold text-ink hover:bg-brand-strong disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      ) : null}
      {erreur ? <p className="px-4 pb-3 text-sm text-rose-700">{erreur}</p> : null}
    </section>
  );
}
