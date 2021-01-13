import { ConfigurationData } from "./ConfigurationData";
import { existsSync, promises as fs } from "fs";
import { Mode, Stream } from "@soundsystem/common";
import { Inject, Service } from "@soundsystem/system";

@Service("configuration")
export class Configuration {

    public static empty: ConfigurationData = {
        stream: Stream.NONE,
        mode: Mode.NONE,
        server: "",
        volume: 32,
        muted: false,
    };

    protected config: ConfigurationData | null = null;

    private readonly file: string;

    public constructor(@Inject("%configuration.file%") file: string) {
        this.file = file;
    }

    public static afterSave: (config: ConfigurationData) => Promise<void> = async () => {
    };

    public async get(): Promise<ConfigurationData> {
        if (!this.config) {
            this.config = await this.load();
        }

        return this.config;
    }

    public async reset(): Promise<void> {
        this.config = Configuration.empty;
    }

    public async load(): Promise<ConfigurationData> {
        if (!existsSync(this.file)) {
            await this.reset();
        }

        const buffer = await fs.readFile(this.file);
        const text = buffer.toString();

        return JSON.parse(text) as ConfigurationData;
    }

    public async save() {
        const config = await this.get();
        const text = JSON.stringify(config, null, "  ");

        await fs.writeFile(this.file, text);
        await Configuration.afterSave(config);
    }

    public async setMode(mode: Mode) {
        const config = await this.get();

        config.mode = mode;
    }

    public async setStream(stream: Stream) {
        const config = await this.get();

        config.stream = stream;
    }

    public async setVolume(volume: number) {
        const config = await this.get();

        config.volume = volume;
    }

    public async setServer(server: string) {
        const config = await this.get();

        config.server = server;
    }

    public async setMuted(muted: boolean): Promise<void> {
        const config = await this.get();

        config.muted = muted;
    }
}
