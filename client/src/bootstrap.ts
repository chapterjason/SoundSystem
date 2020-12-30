import { EnvironmentLoader } from "@mscs/environment";
import { ENVIRONMENT } from "./Singleton/Environment";
import path from "path";
import * as Sentry from "@sentry/node";
import * as Integrations from "@sentry/integrations";
import { HOSTNAME } from "./constants";

export async function bootstrap() {
    const environmentLoader = new EnvironmentLoader(ENVIRONMENT);

    await environmentLoader.loadEnvironment(path.join(__dirname, ".env"));

    if (ENVIRONMENT.has("SENTRY_DSN")) {
        const SENTRY_DSN = ENVIRONMENT.get("SENTRY_DSN");

        Sentry.init({
            dsn: SENTRY_DSN,
            serverName: HOSTNAME,

            // We recommend adjusting this value in production, or using tracesSampler
            // for finer control
            tracesSampleRate: 1.0,
            integrations: [
                new Integrations.RewriteFrames(),
                new Sentry.Integrations.OnUncaughtException(),
                new Sentry.Integrations.OnUnhandledRejection(),
            ],
        });

    }
}
