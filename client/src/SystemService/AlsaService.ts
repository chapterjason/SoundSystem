import { mustRun } from "../Utils/MustRun";
import { EventEmitter } from "events";
import { Span, Transaction } from "@sentry/types";
import * as Sentry from "@sentry/node";

export class AlsaService extends EventEmitter {

    private tracing: Span;

    public constructor(tracing: Span) {
        super();
        this.tracing = tracing;
    }

    public async setVolume(volume: number, device: string = "Headphone") {
        const child = this.tracing.startChild({ op: "alsa:volume" });

        child.setData("volume", volume);
        child.setData("device", device);

        try {
            return await mustRun(["amixer", "-M", "set", `'${device}'`, `${volume}%`]);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async mute(device: string = "Headphone") {
        const child = this.tracing.startChild({ op: "alsa:mute" });
        child.setData("device", device);

        try {
            return await mustRun(["amixer", "set", `'${device}'`, "mute"]);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async unmute(device: string = "Headphone") {
        const child = this.tracing.startChild({ op: "alsa:unmute" });
        child.setData("device", device);

        try {
            return await mustRun(["amixer", "set", `'${device}'`, "unmute"]);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }
}
