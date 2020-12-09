import { Services } from "./Services";
import { promises as fs } from "fs";

export class Snapclient {
    public static async start() {
        await Services.startService("snapclient");
    }

    public static async stop() {
        await Services.stopService("snapclient");
    }

    public static async setServer(server: string) {
        await fs.writeFile("/etc/default/snapclient", `START_SNAPCLIENT=true
SNAPCLIENT_OPTS="-h ${server}"`);
    }
}
