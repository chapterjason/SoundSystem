import { Process } from "@mscs/process";

export class SystemService {

    private readonly serviceName: string;

    public constructor(serviceName: string) {
        this.serviceName = serviceName;
    }

    public getServiceName() {
        return this.serviceName;
    }

    private async wrap(command: string) {
        const startProcess = new Process([
            "sudo",
            "systemctl",
            command,
            this.serviceName,
        ]);

        return await startProcess.mustRun();
    }

    public async enable() {
        return await this.wrap("enable");
    }

    public async disable() {
        return await this.wrap("disable");
    }

    public async start() {
        return await this.wrap("start");
    }

    public async stop() {
        return await this.wrap("stop");
    }

}
