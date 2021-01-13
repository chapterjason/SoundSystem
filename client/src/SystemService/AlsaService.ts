import { Process } from "@mscs/process";
import { Inject, Service } from "@soundsystem/system";
import { DeviceService } from "../Service/DeviceService";

@Service("system.alsa", { tags: ["system"] })
export class AlsaService {

    private device: DeviceService;

    public constructor(
        @Inject("@device") device: DeviceService,
    ) {
        this.device = device;
    }

    public async setVolume(volume: number) {
        const device = this.device.get();
        const volumeProcess = new Process(["amixer", "-M", "set", `'${device}'`, `${volume}%`]);

        return await volumeProcess.mustRun();
    }

    public async mute() {
        const device = this.device.get();
        const muteProcess = new Process(["amixer", "set", `'${device}'`, "mute"]);

        return await muteProcess.mustRun();
    }

    public async unmute() {
        const device = this.device.get();
        const unmuteProcess = new Process(["amixer", "set", `'${device}'`, "unmute"]);

        return await unmuteProcess.mustRun();
    }
}
