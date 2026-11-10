import { confirmer } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alertes Tycoon", robots: { index: false } };

/**
 * La désinscription des alertes de zone (D-136). Un bouton plutôt qu'un
 * effet à l'ouverture : les messageries qui prévisualisent les liens ne
 * désinscrivent personne par accident.
 */
export default async function Desinscription({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string }>;
  searchParams: Promise<{ fait?: string }>;
}) {
  const { jeton } = await params;
  const { fait } = await searchParams;
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-trait bg-white p-5">
      <h1 className="text-xl font-bold">Alertes Tycoon</h1>
      {fait === "1" ? (
        <p>C&apos;est noté : vous ne recevrez plus d&apos;alertes d&apos;interventions de Tycoon.</p>
      ) : fait === "0" ? (
        <p className="text-rose-700">Ce lien n&apos;est pas valable. Écrivez-nous à contact@tycoonapp.fr et nous vous désinscrirons.</p>
      ) : (
        <form action={confirmer.bind(null, jeton)} className="space-y-3">
          <p>Vous ne voulez plus recevoir les mails d&apos;interventions près de chez vous ?</p>
          <button type="submit" className="rounded-xl bg-ink px-4 py-3 font-semibold text-white">Ne plus recevoir d&apos;alertes</button>
        </form>
      )}
    </div>
  );
}
