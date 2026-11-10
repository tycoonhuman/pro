import * as Sentry from "@sentry/nextjs";

import { sentryOptions } from "@/lib/sentry-options";

// Les erreurs du navigateur, mêmes réglages et même nettoyage que le serveur.
Sentry.init(sentryOptions(process.env.NEXT_PUBLIC_VERCEL_ENV));

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
