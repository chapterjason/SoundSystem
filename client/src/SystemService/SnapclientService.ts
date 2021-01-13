import { promises as fs } from "fs";
import * as ini from "ini";
import { Service, SystemService } from "@soundsystem/system";

@Service("system.snapclient", { tags: ["system"] })
export class SnapclientService extends SystemService {

    public constructor() {
        super("snapclient");
    }

    public async setServer(server: string) {
        const config = {
            START_SNAPCLIENT: true,
            SNAPCLIENT_OPTS: `-h ${server}`,
        };

        return await fs.writeFile("/etc/default/snapclient", ini.encode(config));
    }
}
