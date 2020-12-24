import { promises as fs } from "fs";
import { SystemService } from "../System/SystemService";

export class SnapserverService extends SystemService {

    public static commonConfiguration: string = `[http]
enabled = false
[tcp]
enabled = false
[stream]
bind_to_address = 0.0.0.0
port = 1704
chunk_ms = 20
buffer = 1000`;

    public constructor() {
        super("snapserver");
    }

    public async setStream(stream: string) {
        const configuration = `${SnapserverService.commonConfiguration}
stream = ${stream}`;
        await fs.writeFile("/etc/snapserver.conf", configuration);
    }
}
