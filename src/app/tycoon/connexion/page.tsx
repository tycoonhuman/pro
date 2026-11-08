import { Connexion } from "@/components/connexion";

export const metadata = { title: "Espace Tycoon" };

export default function PageConnexion() {
  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Espace Tycoon</h1>
      <p className="text-sm text-slate-600">Les demandes, les salons de NORMAN et le choix de l&apos;artisan.</p>
      <Connexion />
    </div>
  );
}
