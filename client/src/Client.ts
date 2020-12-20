import { Socket, SocketConstructorOpts } from "net";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { Configuration } from "./Configuration";
import { ConfigurationData } from "./ConfigurationData";
import { Stream } from "./Types";
import { Snapclient } from "./Snapclient";
import { Snapserver } from "./Snapserver";
import { Services } from "./Services";
import { Alsa } from "./Alsa";
import { update } from "./Utils/Update";
import { ENVIRONMENT } from "./meta";

export class Client extends Socket {

    private hostname: string;

    private id: string;

    private sendConfigurationTimeoutId: NodeJS.Timeout | null = null;

    public constructor(options?: SocketConstructorOpts) {
        super(options);

        this.setKeepAlive(true);
        this.setEncoding("utf8");
        this.setNoDelay(true);

        this.hostname = os.hostname();
        this.id = uuidv4();

        this.on("data", this.onData.bind(this));
    }

    public async onData(buffer: Buffer) {
        const [command, id, data] = buffer.toString().split(":");
        const encodedData = Buffer.from(data, "base64").toString("ascii");

        console.log({ command, id, data, encodedData });

        try {
            const configuration = await Configuration.load();

            if (command === "idle") {
                await this.idle(true);
            } else if (command === "listen") {
                await this.listen(configuration, encodedData);
            } else if (command === "mute") {
                await this.setMuted(configuration.muted, true);
            } else if (command === "unmute") {
                await this.setMuted(configuration.muted, false);
            } else if (command === "single") {
                await this.single(configuration, encodedData as Stream);
            } else if (command === "update") {
                console.log("Update...", (new Date()).toISOString());
                await update();
            } else if (command === "volume") {
                const volume = parseInt(encodedData, 10);
                await this.setVolume(configuration.volume, volume);
            } else if (command === "stream") {
                await this.stream(configuration, encodedData as Stream);
            }

            console.log("response", { id });
            this.send("response", id);
        } catch (exception) {
            console.log("response", { id, exception });
            this.send("response", id, JSON.stringify(exception));
        }
    }

    public async sendConfiguration() {
        if (this.sendConfigurationTimeoutId !== null) {
            clearTimeout(this.sendConfigurationTimeoutId);
        }

        const configuration = await Configuration.load();

        this.send("configuration", "-1", JSON.stringify({
            ...configuration,
            hostname: this.hostname,
            id: this.id,
        }));

        this.sendConfigurationTimeoutId = setTimeout(async () => {
            await this.sendConfiguration();
        }, 1000);
    }

    public async listen(configuration: ConfigurationData, server: string) {
        console.log("<-- [Listen]", server);

        // Stop stream
        if (configuration.mode === "stream") {
            if (configuration.stream === "bluetooth") {
                await this.disableMultipleBluetooth();
            }

            await Snapserver.stop();

            await this.setAndListen(server);
        } else if (configuration.mode === "single") {
            if (configuration.stream === "bluetooth") {
                await this.disableSingleBluetooth();
            } else if (configuration.stream === "airplay") {
                await this.disableSingleAirplay();
            }

            await this.setAndListen(server);
        } else if (configuration.mode === "listen") {
            if (configuration.server !== server) {
                await this.setAndListen(server);
            }
        } else if (configuration.mode === "idle" || configuration.mode === "reset") {
            await this.setAndListen(server);
        }

        await Configuration.setMode("listen");

        console.log("--> [Listen]", server);
    }

    public async stream(configuration: ConfigurationData, stream: Stream) {
        console.log("<-- [Stream]", stream);

        if (configuration.mode === "listen") { // Stop listen if listen
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (configuration.mode === "single") { // If single
            if (configuration.stream === "bluetooth") {
                await this.disableSingleBluetooth();
            } else if (configuration.stream === "airplay") {
                await this.disableSingleAirplay();
            }

            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (configuration.mode === "stream") { // If already streaming
            if (configuration.stream !== stream) { // If stream type is another
                // If current was bluetooth, stop bluetooth
                if (configuration.stream === "bluetooth") {
                    await this.disableMultipleBluetooth();
                }

                await Snapserver.stop();

                await this.setAndStart(stream);
            }
        } else if (configuration.mode === "idle" || configuration.mode === "reset") {
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        }

        await Configuration.setMode("stream");

        console.log("--> [Stream]", stream);
    }

    public async idle(preserveVolume: boolean = false) {
        console.log("<-- [Idle]");
        let volume = 32;

        if (preserveVolume) {
            volume = await Configuration.getVolume();
        }

        await this.reset();
        await Configuration.setMode("idle");

        if (preserveVolume) {
            await this.setVolume(Configuration.empty.volume, volume);
        }

        console.log("--> [Idle]");
    }

    public async reset() {
        await Configuration.reset();
        await Configuration.setServer("");
        await Configuration.setStream("reset");

        await Snapserver.stop();
        await Snapclient.stop();
        await Services.stopService("bluetooth-playback");
        await Services.stopService("bluemusic-playback");
        await this.disableBluetooth();
        await this.disableSingleAirplay();
    }

    public async disableMultipleBluetooth() {
        await this.disableBluetooth();
        await Services.stopService("bluemusic-playback");
    }

    public async enableMultipleBluetooth() {
        await this.enableBluetooth();
        await Services.startService("bluemusic-playback");

        await Snapserver.setStream(`pipe:///tmp/snapfifo?name=default`);
    }

    public async enableMultipleAirplay() {
        await Snapserver.setStream(`airplay:///shairport-sync?name=Airplay&devicename=${this.hostname}`);
    }

    public async init(): Promise<void> {
        console.log("---- Initialize ----");
        const { mode, server, stream, volume, muted } = await Configuration.load();

        if (mode === "idle") {
            await this.idle(true);
        } else if (mode === "single") {
            await this.single(Configuration.empty, stream);
        } else if (mode === "stream") {
            await this.stream(Configuration.empty, stream);
        } else if (mode === "listen") {
            await this.listen(Configuration.empty, server);
        } else if (mode === "reset") {
            await this.idle();
        }

        await this.setMuted(Configuration.empty.muted, muted);
        await this.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized! ----");
    }

    public send(command: string, id: string = "-1", data: string = ""): void {
        const responseBuffer = Buffer.concat([
            Buffer.from(command),
            Buffer.from(":"),
            Buffer.from(id),
            Buffer.from(":"),
            Buffer.from(Buffer.from(data).toString("base64")),
        ]);

        this.write(responseBuffer);
    }

    private async setAndListen(server: string): Promise<void> {
        await Snapclient.stop();
        await Snapclient.setServer(server);
        await Snapclient.start();
        await Configuration.setServer(server);
    }

    private async disableBluetooth(): Promise<void> {
        await Services.stopService("bthelper@hci0");
        await Services.stopService("bt-agent");
        await Services.stopService("bluetooth");
        await Services.stopService("bluealsa");
    }

    private async enableBluetooth(): Promise<void> {
        await Services.startService("bthelper@hci0");
        await Services.startService("bt-agent");
        await Services.startService("bluetooth");
        await Services.startService("bluealsa");
    }

    private async setAndStart(stream: Stream): Promise<void> {
        // Set config for corresponding stream
        if (stream === "airplay") {
            await this.enableMultipleAirplay();
            await Configuration.setStream("airplay");
        } else if (stream === "bluetooth") {
            await this.enableMultipleBluetooth();
            await Configuration.setStream("bluetooth");
        }

        await Snapserver.start();
    }

    private async setMuted(previousMuted: boolean, muted: boolean): Promise<void> {
        console.log("--> [Muted]", muted);
        const device = ENVIRONMENT.has("DEVICE") ? ENVIRONMENT.get("DEVICE") : "Headphone";

        if (previousMuted !== muted) {
            if (muted) {
                await Alsa.mute(device);
            } else {
                await Alsa.unmute(device);
            }

            await Configuration.setMuted(muted);
        }
        console.log("<-- [Muted]", muted);
    }

    private async setVolume(previousVolume: number, volume: number): Promise<void> {
        console.log("<-- [Volume]", volume);
        if (previousVolume !== volume) {
            await Alsa.setVolume(volume, ENVIRONMENT.has("DEVICE") ? ENVIRONMENT.get("DEVICE") : "Headphone");
            await Configuration.setVolume(volume);
        }
        console.log("--> [Single]", volume);
    }

    private async single(configuration: ConfigurationData, stream: Stream): Promise<void> {
        console.log("<-- [Single]", stream);

        if (configuration.mode === "listen") {
            await Snapclient.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === "single") {
            if (configuration.stream !== stream) {
                if (configuration.stream === "airplay") {
                    await this.disableSingleAirplay();
                } else if (configuration.stream === "bluetooth") {
                    await this.disableSingleBluetooth();
                }

                await this.setAndStartSingle(stream);
            }
        } else if (configuration.mode === "stream") {
            if (configuration.stream === "bluetooth") {
                await this.disableMultipleBluetooth();
            }

            await Snapclient.stop();
            await Snapserver.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === "idle" || configuration.mode === "reset") {
            await this.setAndStartSingle(stream);
        }

        await Configuration.setMode("single");

        console.log("--> [Single]", stream);
    }

    private async disableSingleBluetooth(): Promise<void> {
        await Services.stopService("bluetooth-playback");
        await this.disableBluetooth();
    }

    private async disableSingleAirplay(): Promise<void> {
        await Services.stopService("airplay-playback");
    }

    private async setAndStartSingle(stream: Stream): Promise<void> {
        if (stream === "airplay") {
            await this.enableSingleAirplay();
            await Configuration.setStream("airplay");
        } else if (stream === "bluetooth") {
            await this.enableSingleBluetooth();
            await Configuration.setStream("bluetooth");
        }
    }

    private async enableSingleBluetooth(): Promise<void> {
        await this.enableBluetooth();
        await Services.startService("bluetooth-playback");
    }

    private async enableSingleAirplay(): Promise<void> {
        await Services.startService("airplay-playback");
    }
}


