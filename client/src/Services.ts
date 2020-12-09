import { mustRun } from "./Utils/MustRun";
import { run } from "./Utils/Run";

export class Services {

    public static async getStatus(service: string) {
        const process = await run(["sudo", "systemctl", "status", service]);
        return process.getOutput();
    }

    public static async isRunning(service: string) {
        const status = await this.getStatus(service);

        return status.indexOf("Active: active (running)") !== -1;
    }

    public static async startService(service: string) {
        const isRunning = await this.isRunning(service);

        console.log("[Service]", "[Start]", `(running: ${isRunning ? "true" : "false"}): ${service}`);

        if (!isRunning) {
            return await mustRun(["sudo", "systemctl", "start", service]);
        }
    }

    public static async stopService(service: string) {
        const isRunning = await this.isRunning(service);

        console.log("[Service]", "[Stop]", `(running: ${isRunning ? "true" : "false"}): ${service}`);

        if (isRunning) {
            return Promise.race([
                mustRun(["sudo", "systemctl", "stop", service]),
                new Promise((resolve) => {
                    setTimeout(resolve, 5000);
                }),
            ]);
        }
    }

}
