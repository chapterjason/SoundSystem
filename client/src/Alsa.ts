import { mustRun } from "./Utils/MustRun";

export class Alsa {
    public static async setVolume(volume: number, device: string = "Headphone") {
        return await mustRun(["amixer", "-M", "set", `'${device}'`, `${volume}%`]);
    }
}
