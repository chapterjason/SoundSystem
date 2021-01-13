import { CommandController } from "@soundsystem/network";
import { Stream } from "@soundsystem/common";
import { update } from "../Utils/Update";
import { SoundService } from "../Sound/SoundService";
import { Inject, Service } from "@soundsystem/system";

@Service("controller.sound", { tags: ["controller"] })
export class SoundController extends CommandController {

    private service: SoundService;

    public constructor(@Inject("@sound") service: SoundService) {
        super();
        this.service = service;

        this.set("idle", this.idle.bind(this));
        this.set("listen", this.listen.bind(this));
        this.set("single", this.single.bind(this));
        this.set("stream", this.stream.bind(this));
        this.set("mute", this.mute.bind(this));
        this.set("unmute", this.unmute.bind(this));
        this.set("volume", this.volume.bind(this));
        this.set("update", this.update.bind(this));
    }

    private async idle() {
        await this.service.idle();
    }

    private async listen(service: SoundService, server: string) {
        await this.service.listen(server);
    }

    private async mute() {
        await this.service.setMuted(true);
    }

    private async single(stream: Stream) {
        await this.service.single(stream);
    }

    private async stream(stream: Stream) {
        await this.service.stream(stream);
    }

    private async unmute() {
        await this.service.setMuted(false);
    }

    private async volume(volume: number) {
        await this.service.setVolume(volume);
    }

    private async update() {
        console.log("Update...", (new Date()).toISOString());
        await update();
    }
}
