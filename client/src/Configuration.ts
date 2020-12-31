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

    private tracing: Span;

    public constructor(tracing: Span) {
        this.tracing = tracing;
    }

    public static afterSave: (config: ConfigurationData) => Promise<void> = async () => {
    };

    public async reset(): Promise<void> {
        const child = this.tracing.startChild({ op: "configuration:reset" });

        try {
            return await this.save(Configuration.empty);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
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

    public async save(config: ConfigurationData) {
        const child = this.tracing.startChild({ op: "configuration:save" });

        try {
            const text = JSON.stringify(config, null, "  ");

            await fs.writeFile(Configuration.file, text);
            await Configuration.afterSave({ ...config });
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setMode(mode: Mode) {
        const child = this.tracing.startChild({ op: "configuration:set:mode" });

        child.setData("mode", mode);

        try {
            const config = await this.load();

            config.mode = mode;

            await this.save(config);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setStream(stream: Stream) {
        const child = this.tracing.startChild({ op: "configuration:set:stream" });

        child.setData("stream", stream);

        try {
            const config = await this.load();

            config.stream = stream;

            await this.save(config);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setVolume(volume: number) {
        const child = this.tracing.startChild({ op: "configuration:set:volume" });

        child.setData("volume", volume);

        try {
            const config = await this.load();

            config.volume = volume;

            await this.save(config);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setServer(server: string) {
        const child = this.tracing.startChild({ op: "configuration:set:server" });

        child.setData("server", server);

        try {
            const config = await this.load();

            config.server = server;

            await this.save(config);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }

    public async setMuted(muted: boolean): Promise<void> {
        const child = this.tracing.startChild({ op: "configuration:set:muted" });

        child.setData("muted", muted);

        try {
            const config = await this.load();

            config.muted = muted;

            await this.save(config);
        } catch (error) {
            Sentry.captureException(error);
        } finally {
            child.finish();
        }
    }
}
