import { mustRun } from "../Utils/MustRun";
import { Transaction } from "@sentry/types";
import * as Sentry from "@sentry/node";

export class SystemService {

    private readonly serviceName: string;

    private transaction: Transaction;

    public constructor(serviceName: string, transaction: Transaction) {
        this.serviceName = serviceName;
        this.transaction = transaction;
    }

    public getServiceName() {
        return this.serviceName;
    }

    public async start() {
        const child = this.transaction.startChild({ op: "service:start" });
        child.setData("service", this.serviceName);

        try {
            console.log(`[Service][${this.serviceName}][Start]: ${this.serviceName}`);

            const process = await mustRun(["sudo", "systemctl", "start", this.serviceName]);

            console.log(`[Service][${this.serviceName}][Started]: ${this.serviceName}`);

            return process;
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async stop() {
        const child = this.transaction.startChild({ op: "service:stop" });
        child.setData("service", this.serviceName);

        try {
            console.log(`[Service][${this.serviceName}][Stop]: ${this.serviceName}`);

            const result = await Promise.race([
                mustRun(["sudo", "systemctl", "stop", this.serviceName]),
                new Promise((resolve) => {
                    setTimeout(resolve, 5000);
                }),
            ]);

            console.log(`[Service][${this.serviceName}][Stopped]: ${this.serviceName}`);

            return result;
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

}
