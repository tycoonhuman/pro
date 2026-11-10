/** Les règles du travail pour Tycoon, affichées avant toute réponse (D-130). */
export function ReglesTycoon() {
  return (
    <section className="rounded-2xl border border-brand-line bg-brand-soft p-4">
      <h2 className="text-base font-semibold">Les règles pour travailler avec Tycoon</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] text-slate-800">
        <li>Vous intervenez <strong>au nom de Tycoon</strong>, auprès d&apos;un client de Tycoon.</li>
        <li>
          <strong>Vous ne démarchez pas le client en direct</strong>, ni pendant ni après l&apos;intervention : pas de carte de visite, pas de
          numéro laissé, pas de proposition de travaux en dehors de Tycoon.
        </li>
        <li>Vous ne parlez pas de prix avec le client : tout passe par Tycoon.</li>
        <li>
          Vos devis et vos factures sont adressés à <strong>Tycoon Human</strong>, 99 avenue Achille Peretti, 92200 Neuilly-sur-Seine,
          SIRET 921 389 763 00019.
        </li>
        <li>
          Aucun acompte : vous êtes payé <strong>de l&apos;instantané à 30 jours</strong> après les photos, le rapport, la validation de
          l&apos;intervention et le contrôle de Tycoon.
        </li>
      </ul>
      <p className="mt-2 text-xs text-slate-600">
        Une question sur l&apos;intervention ? Posez-la à NORMAN, l&apos;assistant IA de Tycoon, dans la discussion de cette page.
      </p>
    </section>
  );
}
