import { Client, CommandQueue } from "@soundsystem/network";
import { SoundController } from "../Controller/SoundController";
import { SoundService } from "./SoundService";
import { Configuration } from "../Configuration";
import { Mode } from "@soundsystem/common";
import { SOUNDSERVICE } from "../Singleton/SoundService";

export class SoundClient extends Client {

    protected queue: CommandQueue = new CommandQueue(this);

    public constructor() {
        super();

        this.queue.register(new SoundController());
    }

    public async init(): Promise<void> {
        console.log("---- Initialize ----");
        const { mode, server, stream, volume, muted } = await Configuration.load();

        if (mode === Mode.IDLE) {
            await SOUNDSERVICE.idle(Configuration.empty);
        } else if (mode === Mode.SINGLE) {
            await SOUNDSERVICE.single(Configuration.empty, stream);
        } else if (mode === Mode.STREAM) {
            await SOUNDSERVICE.stream(Configuration.empty, stream);
        } else if (mode === Mode.LISTEN) {
            await SOUNDSERVICE.listen(Configuration.empty, server);
        } else if (mode === Mode.NONE) {
            await SOUNDSERVICE.idle(Configuration.empty);
        }

        await SOUNDSERVICE.setMuted(Configuration.empty.muted, muted);
        await SOUNDSERVICE.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized ----");
    }

}
