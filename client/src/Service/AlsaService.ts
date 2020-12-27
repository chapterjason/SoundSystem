import { mustRun } from "../Utils/MustRun";
import { EventEmitter } from "events";

/**
 * @todo reporting
 */
export class AlsaService extends EventEmitter {

    public async setVolume(volume: number, device: string = "Headphone") {
        return await mustRun(["amixer", "-M", "set", `'${device}'`, `${volume}%`]);
    }

    public async mute(device: string = "Headphone") {
        return await mustRun(["amixer", "set", `'${device}'`, "mute"]);
    }

    public async unmute(device: string = "Headphone") {
        return await mustRun(["amixer", "set", `'${device}'`, "unmute"]);
    }
}
