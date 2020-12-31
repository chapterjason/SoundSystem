import { SystemService } from "./SystemService";
import { Span } from "@sentry/types";
import * as Sentry from "@sentry/node";

export class BluetoothService {

    private stream: SystemService;

    private single: SystemService;

    private tracing: Span;

    public constructor(tracing: Span) {
        this.tracing = tracing;

        this.stream = new SystemService("bluemusic-playback", tracing);

        this.single = new SystemService("bluetooth-playback", tracing);
    }

    public async start() {
        const child = this.tracing.startChild({ op: `services:start:bluetooth` });

        try {
            const services = this.getServices(child);

            child.setData("services", services.map(service => service.getServiceName()));

            for await (const service of services) {
                await service.start();
            }
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async stop() {
        const child = this.tracing.startChild({ op: `services:stop:bluetooth` });

        try {
            const services = this.getServices(child);

            child.setData("services", services.map(service => service.getServiceName()));

            for await (const service of services) {
                await service.stop();
            }
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async startStream() {
        await this.stream.start();
    }

    public async startSingle() {
        await this.single.start();
    }

    public async stopStream() {
        await this.stream.stop();
    }

    public async stopSingle() {
        await this.single.stop();
    }

    protected getServices(tracing: Span) {
        return [
            new SystemService("bthelper@hci0", tracing),
            new SystemService("bt-agent", tracing),
            new SystemService("bluetooth", tracing),
            new SystemService("bluealsa", tracing),
        ];
    }
}
