import { promises as fs } from "fs";
import * as ini from "ini";
import { Service, SystemService } from "@soundsystem/system";

@Service("system.snapserver", { tags: ["system"] })
export class SnapserverService extends SystemService {

    public constructor() {
        super("snapserver");
    }

    public async setStream(stream: string) {
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

        await fs.writeFile("/etc/snapserver.conf", ini.encode(config));
    }
}
