import { Client, CommandQueue } from "@soundsystem/network";
import { SoundController } from "../Controller/SoundController";
import { Configuration } from "../Configuration";
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
        const transaction = Sentry.startTransaction({
            op: "init",
            name: "Do init",
        });

        console.log("---- Initialize ----");
        const service = new SoundService(transaction);
        const configurationData = await Configuration.load();
        const { mode, server, stream, volume, muted } = configurationData;

        transaction.setData("configuration", configurationData);

        if (mode === Mode.IDLE) {
            await service.idle(Configuration.empty);
        } else if (mode === Mode.SINGLE) {
            await service.single(Configuration.empty, stream);
        } else if (mode === Mode.STREAM) {
            await service.stream(Configuration.empty, stream);
        } else if (mode === Mode.LISTEN) {
            await service.listen(Configuration.empty, server);
        } else if (mode === Mode.NONE) {
            await service.idle(Configuration.empty);
        }

        await service.setMuted(Configuration.empty.muted, muted);
        await service.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized ----");
    }

}
