import { CLIENT } from "./Singleton/Client";
import { ENVIRONMENT } from "./Singleton/Environment";
import { Configuration } from "./Configuration";
import { Command } from "@soundsystem/network";
import { HOSTNAME } from "./constants";
import { ID } from "./settings";

export async function runtime() {
    CLIENT.connect({
        family: 4,
        host: ENVIRONMENT.get("HOST"),
        port: parseInt(ENVIRONMENT.get("SERVICE_PORT"), 10),
    });

    CLIENT.on("connect", async () => {
        Configuration.afterSave = async (config) => {
            const command = Command.create("configuration", {
                ...config,
                hostname: HOSTNAME,
                id: ID(),
            });

            await CLIENT.request(command.toPacket());
        };

        await CLIENT.init();
    });

    CLIENT.on("error", (error) => {
        throw error;
    });

    CLIENT.on("close", () => {
        throw new Error("Connection closed.");
    });
}
