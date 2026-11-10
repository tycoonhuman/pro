"use client";

import { useEffect, useRef, useState } from "react";

import { METIERS } from "@/lib/metiers";

/** Le métier, choisi parmi les douze de Tycoon. Une valeur ancienne hors liste reste proposée. */
export function ChampMetier({ className, defaultValue = "" }: { className: string; defaultValue?: string }) {
  const horsListe = defaultValue && !(METIERS as readonly string[]).includes(defaultValue);
  return (
    <select name="metier" defaultValue={defaultValue} className={className}>
      <option value="">Choisissez</option>
      {METIERS.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
      {horsListe ? <option value={defaultValue}>{defaultValue}</option> : null}
    </select>
  );
}

type Commune = { nom: string; codesPostaux?: string[]; codeDepartement?: string; centre?: { coordinates: [number, number] } };

/**
 * La ville, retrouvée dans la liste officielle des communes (geo.api.gouv.fr,
 * DOM compris) : on tape le nom ou le code postal, on choisit, et la position
 * part avec le formulaire (D-136).
 */
export function ChampVille({ className }: { className: string }) {
  const [saisie, setSaisie] = useState("");
  const [choix, setChoix] = useState<Commune | null>(null);
  const [liste, setListe] = useState<Commune[]>([]);
  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (minuterie.current) clearTimeout(minuterie.current);
    const q = saisie.trim();
    if (choix || q.length < 2) return;
    minuterie.current = setTimeout(() => {
      const parametre = /^\d{5}$/.test(q) ? `codePostal=${q}` : `nom=${encodeURIComponent(q)}&boost=population`;
      fetch(`https://geo.api.gouv.fr/communes?${parametre}&fields=nom,codesPostaux,codeDepartement,centre&limit=6`)
        .then((r) => (r.ok ? r.json() : []))
        .then((communes: Commune[]) => setListe(communes.filter((c) => c.centre)))
        .catch(() => setListe([]));
    }, 250);
  }, [saisie, choix]);

  const libelle = (c: Commune) => `${c.nom} (${c.codesPostaux?.[0] ?? c.codeDepartement ?? ""})`;

  return (
    <div className="relative">
      <input
        value={choix ? libelle(choix) : saisie}
        onChange={(e) => {
          setChoix(null);
          setSaisie(e.target.value);
        }}
        required
        autoComplete="off"
        maxLength={120}
        placeholder="Villeurbanne ou 69100"
        className={className}
      />
      <input type="hidden" name="ville" value={choix ? libelle(choix) : ""} />
      <input type="hidden" name="lat" value={choix?.centre?.coordinates[1] ?? ""} />
      <input type="hidden" name="lon" value={choix?.centre?.coordinates[0] ?? ""} />
      {!choix && liste.length ? (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-trait bg-white shadow-lg">
          {liste.map((c) => (
            <li key={`${c.nom}-${c.codesPostaux?.[0]}`}>
              <button
                type="button"
                onClick={() => {
                  setChoix(c);
                  setListe([]);
                }}
                className="block w-full px-3 py-2.5 text-left text-[15px] hover:bg-brand/10"
              >
                {libelle(c)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {!choix && saisie.trim().length >= 2 ? (
        <p className="mt-1 text-xs text-slate-500">Choisissez votre ville dans la liste.</p>
      ) : null}
    </div>
  );
}
