import { BidirectionalSocket, Command, CommandController, DataType } from "@soundsystem/network";
import { Configuration } from "../Configuration";
import { Stream } from "@soundsystem/common";
import { update } from "../Utils/Update";
import * as Sentry from "@sentry/node";
import { Span, TransactionContext } from "@sentry/types";
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
        return async (data: DataType, command: Command, socket: BidirectionalSocket) => {
            const tracing = Sentry.startTransaction({
                ...context,
                data: {
                    command: {
                        id: command.getId(),
                        command: command.getCommandName(),
                        data: command.getAs(),
                    },
                },
            });

            try {
                await callback(tracing, data, command, socket);
            } catch (error) {
                Sentry.captureException(error);
            } finally {
                tracing.finish();
            }
        };
    }

    private async idle(tracing: Span) {
        const service = new SoundService(tracing);

        await service.idle();
    }

    private async listen(tracing: Span, server: string) {
        const service = new SoundService(tracing);

        await service.listen(server);
    }

    private async mute(tracing: Span) {
        const service = new SoundService(tracing);

        await service.setMuted(true);
    }

    private async single(tracing: Span, stream: Stream) {
        const service = new SoundService(tracing);

        await service.single(stream);
    }

    private async stream(tracing: Span, stream: Stream) {
        const service = new SoundService(tracing);

        await service.stream(stream);
    }

    private async unmute(tracing: Span) {
        const service = new SoundService(tracing);

        await service.setMuted(false);
    }

    private async volume(tracing: Span, volume: number) {
        const service = new SoundService(tracing);

        await service.setVolume(volume);
    }

    private async update() {
        console.log("Update...", (new Date()).toISOString());
        await update();
    }
}
