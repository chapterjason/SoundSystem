import { Configuration } from "./Configuration";
import { Client } from "./Client";
import { EnvironmentLoader, ProcessEnvironment } from "@mscs/environment";
import path from "path";
import { ENVIRONMENT } from "./meta";

async function runtime() {
    const environmentLoader = new EnvironmentLoader(ENVIRONMENT);

    await environmentLoader.loadEnvironment(path.join(__dirname, ".env"));

    const client = new Client();

    client.connect({
        host: ENVIRONMENT.get("HOST"),
        port: parseInt(ENVIRONMENT.get("SERVICE_PORT"), 10),
    });

    client.on("connect", async () => {
        Configuration.afterSave = async () => {
            await client.sendConfiguration();
        };

        await client.init();
    });

    client.on("error", (error) => {
        console.error(error);
        process.exit(1);
    });

    client.on("close", () => {
        console.error("Remote connection closed.");
        process.exit(1);
    });
}

runtime()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
