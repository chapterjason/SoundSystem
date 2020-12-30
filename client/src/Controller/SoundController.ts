import { CommandController } from "@soundsystem/network";
import { Configuration } from "../Configuration";
import { Stream } from "@soundsystem/common";
import { update } from "../Utils/Update";
import * as Sentry from "@sentry/node";
import { Transaction, TransactionContext } from "@sentry/types";
import { SoundService } from "../Service/SoundService";

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
            const transaction = Sentry.startTransaction({
                ...context,
                data: {
                    args,
                },
            });

            try {
                await callback(transaction, ...args);
            } catch (error) {
                Sentry.captureException(error);
            } finally {
                transaction.finish();
            }
        };
    }

    private async idle(transaction: Transaction) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.idle(configuration);
    }

    private async listen(transaction: Transaction, server: string) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.listen(configuration, server);
    }

    private async mute(transaction: Transaction) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.setMuted(configuration.muted, true);
    }

    private async single(transaction: Transaction, stream: Stream) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.single(configuration, stream);
    }

    private async stream(transaction: Transaction, stream: Stream) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.stream(configuration, stream);
    }

    private async unmute(transaction: Transaction) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.setMuted(configuration.muted, false);
    }

    private async volume(transaction: Transaction, volume: number) {
        const service = new SoundService(transaction);
        const configuration = await Configuration.load();

        await service.setVolume(configuration.volume, volume);
    }

    private async update() {
        console.log("Update...", (new Date()).toISOString());
        await update();
    }
}
