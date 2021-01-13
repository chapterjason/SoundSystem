import { SystemServiceDefinition } from "./SystemServiceDefinition";
import { Process } from "@mscs/process";
import { SystemService } from "./SystemService";
import { existsSync, promises as fs } from "fs";
import * as ini from "ini";

export class System {

    public async reload() {
        const startProcess = new Process([
            "sudo",
            "systemctl",
            "daemon-reload",
        ]);

        return await startProcess.mustRun();
    }

    public exists(serviceName: string) {
        return existsSync(serviceName);
    }

    public async save(serviceName: string, definition: SystemServiceDefinition) {
        if (this.exists(serviceName)) {
            const service = this.get(serviceName);
            await service.stop();
        }

        const serviceFile = this.getServiceFile(serviceName);
        const serviceText = ini.stringify(definition);

        await fs.writeFile(serviceFile, serviceText);

        await this.reload();
    }

    public async load(serviceName: string): Promise<SystemServiceDefinition> {
        if (!this.exists(serviceName)) {
            throw new Error(`Service ${serviceName} not found.`);
        }

        const serviceFile = this.getServiceFile(serviceName);
        const serviceBuffer = await fs.readFile(serviceFile);
        const serviceText = serviceBuffer.toString();
        const serviceDefinition = ini.parse(serviceText);

        return serviceDefinition as SystemServiceDefinition;
    }

    public get(serviceName: string) {
        return new SystemService(serviceName);
    }

    private getServiceFile(serviceName: string) {
        return `/etc/systemd/system/${serviceName}.service`;
    }

}
