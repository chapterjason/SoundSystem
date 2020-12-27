import { mustRun } from "../Utils/MustRun";
import { EventEmitter } from "events";

export class SystemService extends EventEmitter {

    private readonly serviceName: string;

    public constructor(serviceName: string) {
        super();
        this.serviceName = serviceName;
    }

    public getServiceName() {
        return this.serviceName;
    }

    public async start() {
        this.emit("beforeStart", this.serviceName);

        console.log(`[Service][${this.serviceName}][Start]: ${this.serviceName}`);

        return mustRun(["sudo", "systemctl", "start", this.serviceName])
            .then((process) => {
                this.emit("afterStart", this.serviceName);

                return process;
            });
    }

    public async stop() {
        this.emit("beforeStop", this.serviceName);

        console.log(`[Service][${this.serviceName}][Stop]: ${this.serviceName}`);

        return Promise.race([
            mustRun(["sudo", "systemctl", "stop", this.serviceName]),
            new Promise((resolve) => {
                setTimeout(resolve, 5000);
            }),
        ]).then((process) => {
            this.emit("afterStop", this.serviceName);

            return process;
        });
    }

}
