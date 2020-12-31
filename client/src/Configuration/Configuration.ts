import path from "path";
import { ConfigurationData } from "./ConfigurationData";
import { existsSync, promises as fs } from "fs";
import { Mode, Stream } from "@soundsystem/common";
import { Span } from "@sentry/types";
import * as Sentry from "@sentry/node";

export class Configuration {

    public static empty: ConfigurationData = {
        stream: Stream.NONE,
        mode: Mode.NONE,
        server: "",
        volume: 32,
        muted: false,
    };

    private static file: string = path.join(__dirname, "client.json");

    protected config: ConfigurationData | null = null;

    private tracing: Span;

    public constructor(tracing: Span) {
        this.tracing = tracing;
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
        const child = this.tracing.startChild({ op: "configuration:load" });

        try {
            if (!existsSync(Configuration.file)) {
                await this.reset();
            }

            const buffer = await fs.readFile(Configuration.file);
            const text = buffer.toString();

            return JSON.parse(text) as ConfigurationData;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        } finally {
            child.finish();
        }
    }

    public async save() {
        const child = this.tracing.startChild({ op: "configuration:save" });

        try {
            const text = JSON.stringify(this.config, null, "  ");

            await fs.writeFile(Configuration.file, text);
            await Configuration.afterSave(this.config as ConfigurationData);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setMode(mode: Mode) {
        const config = await this.get();

        config.mode = mode;
    }

    public async setStream(stream: Stream) {
        const config = await this.get();

        config.stream =  stream;
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
