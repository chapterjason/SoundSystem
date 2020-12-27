import { promises as fs } from "fs";
import { SystemService } from "../System/SystemService";
import { ContextualCommandHandler } from "../ContextualCommandHandler";

export class SnapclientService extends SystemService {

    public constructor() {
        super("snapclient");
    }

    public async setServer(server: string) {
        await fs.writeFile("/etc/default/snapclient", `START_SNAPCLIENT=true
SNAPCLIENT_OPTS="-h ${server}"`);
    }
}
