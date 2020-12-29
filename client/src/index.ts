import { Configuration } from "./Configuration";
import { EnvironmentLoader } from "@mscs/environment";
import path from "path";
import { ENVIRONMENT, HOSTNAME, ID } from "./meta";
import { Command } from "@soundsystem/common";
import { CLIENT } from "./Singleton/Client";

async function runtime() {
    const environmentLoader = new EnvironmentLoader(ENVIRONMENT);

    await environmentLoader.loadEnvironment(path.join(__dirname, ".env"));

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
                id: ID,
            });

            await CLIENT.request(command.toPacket());
        };

        await CLIENT.init();
    });

    CLIENT.on("error", (error) => {
        console.error(error);
        process.exit(1);
    });

    CLIENT.on("close", () => {
        console.error("Connection closed.");
        process.exit(1);
    });
}

runtime()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
