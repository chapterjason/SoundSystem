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
        this.set("listen", this.wrap({ op: "listen", name: "Set listen" }, this.listen).bind(this));
        this.set("single", this.wrap({ op: "single", name: "Set single" }, this.single).bind(this));
        this.set("stream", this.wrap({ op: "stream", name: "Set stream" }, this.stream).bind(this));
        this.set("mute", this.wrap({ op: "mute", name: "Mute" }, this.mute).bind(this));
        this.set("unmute", this.wrap({ op: "unmute", name: "Unmute" }, this.unmute).bind(this));
        this.set("volume", this.wrap({ op: "volume", name: "Set volume" }, this.volume).bind(this));
        this.set("update", this.wrap({ op: "update", name: "Do update" }, this.update).bind(this));
    }

    private wrap(context: TransactionContext, callback: (...args: any[]) => Promise<void>) {
        return async (...args: any[]) => {
            const transaction = Sentry.startTransaction(context, {
                args: args,
            });

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
