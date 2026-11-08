export function prix(centimes: number | null): string {
  if (centimes === null) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(centimes / 100);
}

const date = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function quand(iso: string | null): string {
  return iso ? date.format(new Date(iso)) : "—";
}

export const STATUTS = {
  envoyee: "Sans réponse",
  repondue: "Réponse reçue",
  declinee: "Pas disponible",
  acceptee: "Retenu",
  refusee: "Non retenu",
} as const;
