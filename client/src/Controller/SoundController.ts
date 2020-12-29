import { CommandController } from "@soundsystem/network";
import { SoundService } from "../Service/SoundService";
import { Configuration } from "../Configuration";
import { Stream } from "@soundsystem/common";
import { update } from "../Utils/Update";

export class SoundController extends CommandController {

    protected service: SoundService;

    public constructor() {
        super();

        this.service = new SoundService();

        this.set("idle", this.idle.bind(this));
        this.set("listen", this.mute.bind(this));
        this.set("single", this.single.bind(this));
        this.set("stream", this.stream.bind(this));
        this.set("mute", this.mute.bind(this));
        this.set("unmute", this.unmute.bind(this));
        this.set("volume", this.volume.bind(this));
        this.set("update", this.update.bind(this));
    }

    private async idle() {
        const configuration = await Configuration.load();

        await this.service.idle(configuration);
    }

    private async listen(server: string) {
        const configuration = await Configuration.load();

        await this.service.listen(configuration, server);
    }

    private async mute() {
        const configuration = await Configuration.load();

        await this.service.setMuted(configuration.muted, true);
    }

    private async single(stream: Stream) {
        const configuration = await Configuration.load();

        await this.service.single(configuration, stream);
    }

    private async stream(stream: Stream) {
        const configuration = await Configuration.load();

        await this.service.stream(configuration, stream);
    }

    private async unmute() {
        const configuration = await Configuration.load();

        await this.service.setMuted(configuration.muted, false);
    }

    private async volume(volume: number) {
        const configuration = await Configuration.load();

        await this.service.setVolume(configuration.volume, volume);
    }

    private async update() {
        console.log("Update...", (new Date()).toISOString());
        await update();
    }
}
