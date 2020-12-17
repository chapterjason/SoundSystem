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
        const data = buffer.toString();

        if (data.startsWith("command:")) {
            const rest = data.slice(8);

            if (rest.startsWith("idle:")) {
                await this.idle();
            } else if (rest.startsWith("listen:")) {
                const configuration = await Configuration.load();
                const server = rest.slice(7);
                await this.listen(configuration, server);
            } else if (rest.startsWith("single:")) {
                const configuration = await Configuration.load();
                const stream = rest.slice(7) as Stream;
                await this.single(configuration, stream);
            } else if (rest.startsWith("update:")) {
                console.log("Update...", (new Date()).toISOString());
                await update();
            } else if (rest.startsWith("volume:")) {
                const configuration = await Configuration.load();
                const volume = parseInt(rest.slice(7));
                await this.setVolume(configuration, volume);
            } else if (rest.startsWith("stream:")) {
                const configuration = await Configuration.load();
                const stream = rest.slice(7) as Stream;
                await this.stream(configuration, stream);
            }
        }
    }

    public async sendConfiguration() {
        if (this.sendConfigurationTimeoutId !== null) {
            clearTimeout(this.sendConfigurationTimeoutId);
        }

        this.sendConfigurationTimeoutId = setTimeout(async () => {
            const configuration = await Configuration.load();
            const buffer = Buffer.from(`configuration:${JSON.stringify({
                ...configuration,
                hostname: this.hostname,
                id: this.id,
            })}`);

            this.write(buffer);
        }, 1000);
    }

    public async listen(configuration: ConfigurationData, server: string) {
        console.log("<-- [Listen]", server);

        // Stop stream
        if (configuration.mode === "stream") {
            if (configuration.stream === "bluetooth") {
                await this.disableBluetooth();
            }

            await Snapclient.stop();
            await Snapclient.setServer(server);
            await Snapclient.start();
            await Configuration.setServer(server);
        } else if (configuration.mode === "listen") {
            if (configuration.server !== server) {
                await Snapclient.stop();
                await Snapclient.setServer(server);
                await Snapclient.start();
                await Configuration.setServer(server);
            }
        } else if (configuration.mode === "idle" || configuration.mode === "reset") {
            await Snapclient.setServer(server);
            await Snapclient.start();
            await Configuration.setServer(server);
        }

        await Configuration.setMode("listen");

        console.log("--> [Listen]", server);
    }

    public async stream(configuration: ConfigurationData, stream: Stream) {
        console.log("<-- [Stream]", stream);

        if (configuration.mode === "listen") { // Stop listen if listen
            await Snapclient.stop();

            await this.setAndStart(stream);

            await Snapclient.setServer("127.0.0.1");
            await Snapclient.start();
        } else if (configuration.mode === "stream") { // If already streaming
            if (configuration.stream !== stream) { // If stream type is another
                // If current was bluetooth, stop bluetooth
                if (configuration.stream === "bluetooth") {
                    await this.disableBluetooth();
                }

                await Snapserver.stop();

                await this.setAndStart(stream);
            }
        } else if (configuration.mode === "idle" || configuration.mode === "reset") {
            await this.setAndStart(stream);

            await Snapclient.setServer("127.0.0.1");
            await Snapclient.start();

        }

        await Configuration.setServer("127.0.0.1");
        await Configuration.setMode("stream");

        console.log("--> [Stream]", stream);
    }

    public async idle() {
        console.log("<-- [Idle]");
        await this.reset();
        await Configuration.setMode("idle");
        console.log("--> [Idle]");
    }

    public async reset() {
        await Configuration.reset();
        await Configuration.setServer("");
        await Configuration.setStream("reset");

        await Snapserver.stop();
        await Snapclient.stop();
        await this.disableBluetooth();
    }

    public async disableBluetooth() {
        await Services.stopService("bthelper@hci0");
        await Services.stopService("bt-agent");
        await Services.stopService("bluetooth");
        await Services.stopService("bluealsa");
        await Services.stopService("bluemusic-playback");
    }

    public async enableBluetooth() {
        await Services.startService("bthelper@hci0");
        await Services.startService("bt-agent");
        await Services.startService("bluetooth");
        await Services.startService("bluealsa");
        await Services.startService("bluemusic-playback");

        await Snapserver.setStream(`pipe:///tmp/snapfifo?name=default`);
    }

    public async enableAirplay() {
        await Snapserver.setStream(`airplay:///shairport-sync?name=Airplay&devicename=${this.hostname}`);
    }

    public async init(): Promise<void> {
        console.log("---- Initialize ----");
        const { mode, server, stream, volume } = await Configuration.load();

        if (mode === "idle") {
            await this.idle();
        } else if (mode === "single") {
            await this.single(Configuration.empty, stream);
        } else if (mode === "stream") {
            await this.stream(Configuration.empty, stream);
        } else if (mode === "listen") {
            await this.listen(Configuration.empty, server);
        } else if (mode === "reset") {
            await this.idle();
        }

        await this.setVolume(Configuration.empty, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized! ----");
    }

    private async setAndStart(stream: Stream): Promise<void> {
        // Set config for corresponding stream
        if (stream === "airplay") {
            await this.enableAirplay();
            await Configuration.setStream("airplay");
        } else if (stream === "bluetooth") {
            await this.enableBluetooth();
            await Configuration.setStream("bluetooth");
        }

        await Snapserver.start();
    }

    private async setVolume(configuration: ConfigurationData, volume: number): Promise<void> {
        if (configuration.volume !== volume) {
            await Alsa.setVolume(volume, ENVIRONMENT.has('DEVICE') ? ENVIRONMENT.get('DEVICE') : "Headphone");
            await Configuration.setVolume(volume);
        }
    }

    private async single(configuration: ConfigurationData, stream: Stream): Promise<void> {

    }
}


