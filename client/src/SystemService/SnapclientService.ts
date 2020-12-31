import { promises as fs } from "fs";
import { SystemService } from "./SystemService";
import { Span } from "@sentry/types";
import * as Sentry from "@sentry/node";
import * as ini from "ini";

export class SnapclientService extends SystemService {

    public constructor(tracing: Span) {
        super("snapclient", tracing);
    }

    public async setServer(server: string) {
        const child = this.tracing.startChild({ op: "snapclient:set:server" });
        child.setData("server", server);

        try {
            const config = {
                START_SNAPCLIENT: true,
                SNAPCLIENT_OPTS: `-h ${server}`,
            };

            child.setData("config", config);

            return await fs.writeFile("/etc/default/snapclient", ini.encode(config));
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }
}
