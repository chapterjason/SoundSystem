import path from "path";
import { ConfigurationData } from "./ConfigurationData";
import { existsSync, promises as fs } from "fs";
import { Mode, Stream } from "./Types";

export class Configuration {

    public static empty: ConfigurationData = {
        stream: "reset",
        mode: "reset",
        server: "",
        volume: 32,
        muted: false,
    };

    private static file: string = path.join(__dirname, "client.json");

    public static afterSave: () => Promise<void> = async () => {
    };

    public static async reset(): Promise<void> {
        await this.save(this.empty);
    }

    public static async load(): Promise<ConfigurationData> {
        if (!existsSync(this.file)) {
            await this.reset();
        }

        const buffer = await fs.readFile(this.file);
        return JSON.parse(buffer.toString());
    }

    public static async save(config: ConfigurationData) {
        await fs.writeFile(this.file, JSON.stringify(config, null, "  "));
        await this.afterSave();
    }

    public static async getMode(): Promise<Mode> {
        const config = await this.load();

        return config.mode;
    }

    public static async setMode(mode: Mode) {
        const config = await this.load();
        config.mode = mode;
        await this.save(config);
    }

    public static async getStream(): Promise<Stream> {
        const config = await this.load();

        return config.stream;
    }

    public static async setStream(stream: Stream) {
        const config = await this.load();
        config.stream = stream;
        await this.save(config);
    }

    public static async getVolume(): Promise<number> {
        const config = await this.load();

        return config.volume;
    }

    public static async setVolume(volume: number) {
        const config = await this.load();
        config.volume = volume;
        await this.save(config);
    }

    public static async getServer(): Promise<string> {
        const config = await this.load();

        return config.server;
    }

    public static async setServer(server: string) {
        const config = await this.load();
        config.server = server;
        await this.save(config);
    }

    public static async setMuted(muted: boolean): Promise<void> {
        const config = await this.load();
        config.muted = muted;
        await this.save(config);
    }
}
