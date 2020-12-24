import { run } from "../Utils/Run";
import { mustRun } from "../Utils/MustRun";

export class SystemService {

    private readonly service: string;

    public constructor(service: string) {
        this.service = service;
    }

    public async getStatus() {
        const process = await run(["sudo", "systemctl", "status", this.service]);
        return process.getOutput();
    }

    public async isRunning() {
        const status = await this.getStatus();

        return status.indexOf("Active: active (running)") !== -1;
    }

    public async start() {
        const isRunning = await this.isRunning();

        console.log("[Service]", `[${this.service}]`, "[Start]", `(running: ${isRunning ? "true" : "false"}): ${this.service}`);

        if (!isRunning) {
            return await mustRun(["sudo", "systemctl", "start", this.service]);
        }
    }

    public async stop() {
        const isRunning = await this.isRunning();

        console.log("[Service]", `[${this.service}]`, "[Stop]", `(running: ${isRunning ? "true" : "false"}): ${this.service}`);

        if (isRunning) {
            return Promise.race([
                mustRun(["sudo", "systemctl", "stop", this.service]),
                new Promise((resolve) => {
                    setTimeout(resolve, 5000);
                }),
            ]);
        }
    }

}
