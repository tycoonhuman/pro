import type { ErrorEvent } from "@sentry/nextjs";

/**
 * Les réglages Sentry, les mêmes pour le serveur et le navigateur, sur le
 * modèle de la GMAO (D-75). Sans `NEXT_PUBLIC_SENTRY_DSN`, rien ne démarre.
 * Une erreur dit où ça casse, jamais chez qui : ni utilisateur, ni IP, ni
 * cookies, ni en-têtes, ni corps, et les jetons d'accès sont masqués dans les
 * adresses. Pas de suivi de performance ni de replay : seules les erreurs.
 */

export function nettoyerUrl(url: string): string {
  return url.replace(/\/(offre|mission|alertes\/stop)\/[^/?#]+/g, "/$1/[jeton]").replace(/[?#].*$/, "");
}

export function nettoyerEvenement(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.data;
    delete event.request.query_string;
    if (event.request.url) event.request.url = nettoyerUrl(event.request.url);
  }
  if (event.transaction) event.transaction = nettoyerUrl(event.transaction);
  delete event.user;
  for (const crumb of event.breadcrumbs ?? []) {
    for (const cle of ["url", "from", "to"] as const) {
      if (typeof crumb.data?.[cle] === "string") crumb.data[cle] = nettoyerUrl(crumb.data[cle]);
    }
  }
  return event;
}

export function sentryOptions(environment: string | undefined) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;
  return {
    dsn,
    enabled: Boolean(dsn),
    environment: environment ?? "development",
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend: nettoyerEvenement,
  };
}
