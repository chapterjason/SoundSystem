import { mustRun } from "../Utils/MustRun";
import { Span } from "@sentry/types";
import * as Sentry from "@sentry/node";

export class SystemService {

    protected tracing: Span;

    private readonly serviceName: string;

    public constructor(serviceName: string, tracing: Span) {
        this.serviceName = serviceName;
        this.tracing = tracing;
    }

    public getServiceName() {
        return this.serviceName;
    }

    public async start() {
        const child = this.tracing.startChild({ op: `service:start:${this.serviceName}` });
        child.setData("service", this.serviceName);

        try {
            return await mustRun(["sudo", "systemctl", "start", this.serviceName]);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async stop() {
        const child = this.tracing.startChild({ op: `service:stop:${this.serviceName}` });
        child.setData("service", this.serviceName);

        try {
            return await Promise.race([
                mustRun(["sudo", "systemctl", "stop", this.serviceName]),
                new Promise((resolve) => {
                    setTimeout(resolve, 5000);
                }),
            ]);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

}
