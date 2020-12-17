import { Services } from "./Services";
import { promises as fs } from "fs";

export class Snapserver {

    public static commonConfiguration: string = `[http]
enabled = false
[tcp]
enabled = false
[stream]
bind_to_address = 0.0.0.0
port = 1704
chunk_ms = 20
buffer = 1000`;

    public static async start() {
        await Services.startService("snapserver");
    }

    public static async stop() {
        await Services.stopService("snapserver");
    }

    public static async isRunning() {
        return await Services.isRunning("snapserver");
    }

    public static async setStream(stream: string) {
        const configuration = `${this.commonConfiguration}
stream = ${stream}`;
        await fs.writeFile("/etc/snapserver.conf", configuration);
    }
}
