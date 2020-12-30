import { CommandController } from "@soundsystem/network";
import { Configuration } from "../Configuration";
import { Stream } from "@soundsystem/common";
import { update } from "../Utils/Update";
import { SOUNDSERVICE } from "../Singleton/SoundService";
import * as Sentry from "@sentry/node";
import { TransactionContext } from "@sentry/types";

export class SoundController extends CommandController {

    public constructor() {
        super();

        this.set("idle", this.wrap({ op: "idle", name: "Set idle" }, this.idle).bind(this));
        this.set("listen", this.listen.bind(this));
        this.set("single", this.single.bind(this));
        this.set("stream", this.stream.bind(this));
        this.set("mute", this.mute.bind(this));
        this.set("unmute", this.unmute.bind(this));
        this.set("volume", this.volume.bind(this));
        this.set("update", this.update.bind(this));
    }

    private wrap(context: TransactionContext, callback: (...args: any[]) => Promise<void>, ...args: any[]) {
        return async () => {
            const transaction = Sentry.startTransaction(context);

            try {
                await callback(...args);
            } catch (e) {
                Sentry.captureException(e);
            } finally {
                transaction.finish();
            }
        };
    }

    private async idle() {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.idle(configuration);
    }

    private async listen(server: string) {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.listen(configuration, server);
    }

    private async mute() {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.setMuted(configuration.muted, true);
    }

    private async single(stream: Stream) {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.single(configuration, stream);
    }

    private async stream(stream: Stream) {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.stream(configuration, stream);
    }

    private async unmute() {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.setMuted(configuration.muted, false);
    }

    private async volume(volume: number) {
        const configuration = await Configuration.load();

        await SOUNDSERVICE.setVolume(configuration.volume, volume);
    }

    private async update() {
        console.log("Update...", (new Date()).toISOString());
        await update();
    }
}
