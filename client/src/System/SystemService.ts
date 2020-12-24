import { mustRun } from "../Utils/MustRun";
import { client } from "../meta";
import { ReportingPointType } from "common";

export class SystemService {

    private readonly service: string;

    public constructor(service: string) {
        this.service = service;
    }

    public async start() {
        client.report(ReportingPointType.SERVICE_START, this.service);
        console.log(`[Service][${this.service}][Start]: ${this.service}`);

        return mustRun(["sudo", "systemctl", "start", this.service])
            .then((process) => {
                client.report(ReportingPointType.SERVICE_STARTED, this.service);

                return process;
            });
    }

    public async stop() {
        client.report(ReportingPointType.SERVICE_STOP, this.service);
        console.log(`[Service][${this.service}][Stop]: ${this.service}`);

        return Promise.race([
            mustRun(["sudo", "systemctl", "stop", this.service]),
            new Promise((resolve) => {
                setTimeout(resolve, 5000);
            }),
        ]).then((process) => {
            client.report(ReportingPointType.SERVICE_STOPPED, this.service);

            return process;
        });
    }

}
