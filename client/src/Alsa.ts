import { mustRun } from "./Utils/MustRun";

export class Alsa {
    public static async setVolume(volume: number, device: string = "Headphone") {
        return await mustRun(["amixer", "-M", "set", `'${device}'`, `${volume}%`]);
    }

    public static async mute(device: string = "Headphone") {
        return await mustRun(["amixer", "set", `'${device}'`, "mute"]);
    }

    public static async unmute(device: string = "Headphone") {
        return await mustRun(["amixer", "set", `'${device}'`, "unmute"]);
    }
}
