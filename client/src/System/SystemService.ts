import { run } from "../Utils/Run";
import { mustRun } from "../Utils/MustRun";

export class SystemService {

    private readonly service: string;

    public constructor(service: string) {
        this.service = service;
    }

    public async start() {
        console.log(`[Service][${this.service}][Start]: ${this.service}`);

        return await mustRun(["sudo", "systemctl", "start", this.service]);
    }

    public async stop() {

        console.log(`[Service][${this.service}][Stop]: ${this.service}`);

        return Promise.race([
            mustRun(["sudo", "systemctl", "stop", this.service]),
            new Promise((resolve) => {
                setTimeout(resolve, 5000);
            }),
        ]);
    }

}
