import { promises as fs } from "fs";
import { SystemService } from "./SystemService";
import { Span } from "@sentry/types";
import * as Sentry from "@sentry/node";
import * as ini from "ini";

export class SnapserverService extends SystemService {

    public constructor(tracing: Span) {
        super("snapserver", tracing);
    }

    public async setStream(stream: string) {
        const child = this.tracing.startChild({ op: "snapserver:set:stream" });
        child.setData("stream", stream);

        try {
            const config = {
                http: {
                    enabled: true,
                },
                tcp: {
                    enabled: true,
                },
                stream: {
                    bind_to_address: "0.0.0.0",
                    port: 1704,
                    chunk_ms: 20,
                    buffer: 1000,
                    stream,
                },
            };

            child.setData("config", config);

            await fs.writeFile("/etc/snapserver.conf", ini.encode(config));
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }
}
