import { mustRun } from "../Utils/MustRun";

export class SystemService {

    private readonly serviceName: string;

    public constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    public getServiceName() {
        return this.serviceName;
    }

    public async start() {
        console.log(`[Service][${this.serviceName}][Start]: ${this.serviceName}`);

        return await mustRun(["sudo", "systemctl", "start", this.serviceName]);
    }

    public async stop() {
        console.log(`[Service][${this.serviceName}][Stop]: ${this.serviceName}`);

        return await Promise.race([
            mustRun(["sudo", "systemctl", "stop", this.serviceName]),
            new Promise((resolve) => {
                setTimeout(resolve, 5000);
            }),
        ]);
    }

}
