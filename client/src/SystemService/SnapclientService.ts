import { promises as fs } from "fs";
import { SystemService } from "./SystemService";
import { Transaction } from "@sentry/types";

export class SnapclientService extends SystemService {

    public constructor(transaction: Transaction) {
        super("snapclient", transaction);
    }

    public async setServer(server: string) {
        await fs.writeFile("/etc/default/snapclient", `START_SNAPCLIENT=true
SNAPCLIENT_OPTS="-h ${server}"`);
    }
}
