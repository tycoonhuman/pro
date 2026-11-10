import * as Sentry from "@sentry/nextjs";

import { sentryOptions } from "@/lib/sentry-options";

/** Démarre Sentry au lancement du serveur ; rien ne part sans DSN. */
export async function register() {
  Sentry.init(sentryOptions(process.env.VERCEL_ENV));
}

/** Toute erreur qui s'échappe d'une page, d'une route ou d'une action part chez Sentry. */
export const onRequestError = Sentry.captureRequestError;
