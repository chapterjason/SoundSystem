import { Client, CommandQueue } from "@soundsystem/network";
import { SoundController } from "../Controller/SoundController";
import { Configuration } from "../Configuration/Configuration";
import { Mode } from "@soundsystem/common";
import * as Sentry from "@sentry/node";
import { SoundService } from "./SoundService";

export class SoundClient extends Client {

    protected queue: CommandQueue = new CommandQueue(this);

    public constructor() {
        super();

        this.queue.register(new SoundController());
    }

    public async init(): Promise<void> {
        const trace = Sentry.startTransaction({
            op: "init",
            name: "Do init",
        });

        const service = new SoundService(trace);
        const configuration = new Configuration(trace);
        const config = await configuration.get();

        const { mode, server, stream, volume, muted } = config;

        trace.setData("configuration", config);

        if (mode === Mode.IDLE) {
            await service.idle();
        } else if (mode === Mode.SINGLE) {
            await service.single(stream);
        } else if (mode === Mode.STREAM) {
            await service.stream(stream);
        } else if (mode === Mode.LISTEN) {
            await service.listen(server);
        } else if (mode === Mode.NONE) {
            await service.idle();
        }

        await service.setMuted(muted);
        await service.setVolume(volume);
    }

}
