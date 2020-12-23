import { Socket, SocketConstructorOpts } from "net";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { Configuration } from "./Configuration";
import { ConfigurationData } from "./ConfigurationData";
import { Snapclient } from "./Snapclient";
import { Snapserver } from "./Snapserver";
import { Services } from "./Services";
import { Alsa } from "./Alsa";
import { update } from "./Utils/Update";
import { ENVIRONMENT } from "./meta";
import * as fs from "fs";
import { existsSync } from "fs";
import * as path from "path";
import { Mode, NetworkCommand, PacketReport, PacketType, Stream } from "common";

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

        const idFile = path.join(__dirname, ".id");

        if (!existsSync(idFile)) {
            fs.writeFileSync(idFile, uuidv4());
        }

        this.id = fs.readFileSync(idFile).toString();

        this.on("data", this.onData.bind(this));
    }

    public async onData(buffer: Buffer) {
        const networkCommand = NetworkCommand.parse(buffer);
        const [id, command, data] = [networkCommand.getId(), networkCommand.getCommand(), networkCommand.getData()];

        this.report(id, PacketType.REQUEST_RECEIVED, buffer.toString());

        try {
            const configuration = await Configuration.load();

            if (command === "idle") {
                await this.idle(true);
            } else if (command === "listen") {
                await this.listen(configuration, data.toString());
            } else if (command === "mute") {
                await this.setMuted(configuration.muted, true);
            } else if (command === "unmute") {
                await this.setMuted(configuration.muted, false);
            } else if (command === "single") {
                await this.single(configuration, data.toString() as Stream);
            } else if (command === "update") {
                console.log("Update...", (new Date()).toISOString());
                await update();
            } else if (command === "volume") {
                await this.setVolume(configuration.volume, data.readUInt32BE());
            } else if (command === "stream") {
                await this.stream(configuration, data.toString() as Stream);
            }

            this.response(id);
            this.report(id, PacketType.RESPONSE_SEND, buffer.toString());
        } catch (exception) {
            this.response(id, Buffer.from(JSON.stringify(exception)));
            this.report(id, PacketType.FAILED, JSON.stringify(exception));

        }
    }

    public async sendConfiguration() {
        if (this.sendConfigurationTimeoutId !== null) {
            clearTimeout(this.sendConfigurationTimeoutId);
        }

        const configuration = await Configuration.load();
        const networkCommand = NetworkCommand.create("configuration", Buffer.from(JSON.stringify({
            ...configuration,
            hostname: this.hostname,
            id: this.id,
        })));

        this.send(networkCommand);

        this.sendConfigurationTimeoutId = setTimeout(async () => {
            await this.sendConfiguration();
        }, 1000);
    }

    public async listen(configuration: ConfigurationData, server: string) {
        console.log("<-- [Listen]", server);

        // Stop stream
        if (configuration.mode === Mode.STREAM) {
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.disableMultipleBluetooth();
            }

            await Snapserver.stop();

            await this.setAndListen(server);
        } else if (configuration.mode === Mode.SINGLE) {
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.disableSingleBluetooth();
            } else if (configuration.stream === Stream.AIRPLAY) {
                await this.disableSingleAirplay();
            }

            await this.setAndListen(server);
        } else if (configuration.mode === Mode.LISTEN) {
            if (configuration.server !== server) {
                await this.setAndListen(server);
            }
        } else if (configuration.mode === Mode.IDLE || configuration.mode === Mode.NONE) {
            await this.setAndListen(server);
        }

        await Configuration.setMode(Mode.LISTEN);

        console.log("--> [Listen]", server);
    }

    public async stream(configuration: ConfigurationData, stream: Stream) {
        console.log("<-- [Stream]", stream);

        if (configuration.mode === Mode.LISTEN) { // Stop listen if listen
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (configuration.mode === Mode.SINGLE) { // If single
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.disableSingleBluetooth();
            } else if (configuration.stream === Stream.AIRPLAY) {
                await this.disableSingleAirplay();
            }

            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (configuration.mode === Mode.STREAM) { // If already streaming
            if (configuration.stream !== stream) { // If stream type is another
                // If current was bluetooth, stop bluetooth
                if (configuration.stream === Stream.BLUETOOTH) {
                    await this.disableMultipleBluetooth();
                }

                await Snapserver.stop();

                await this.setAndStart(stream);
            }
        } else if (configuration.mode === Mode.IDLE || configuration.mode === Mode.NONE) {
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        }

        await Configuration.setMode(Mode.STREAM);

        console.log("--> [Stream]", stream);
    }

    public async idle(preserveVolume: boolean = false) {
        console.log("<-- [Idle]");
        let volume = 32;

        if (preserveVolume) {
            volume = await Configuration.getVolume();
        }

        await this.reset();
        await Configuration.setMode(Mode.IDLE);

        if (preserveVolume) {
            await this.setVolume(Configuration.empty.volume, volume);
        }

        console.log("--> [Idle]");
    }

    public async reset() {
        await Configuration.reset();
        await Configuration.setServer("");
        await Configuration.setStream(Stream.NONE);

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

        if (mode === Mode.IDLE) {
            await this.idle(true);
        } else if (mode === Mode.SINGLE) {
            await this.single(Configuration.empty, stream);
        } else if (mode === Mode.STREAM) {
            await this.stream(Configuration.empty, stream);
        } else if (mode === Mode.LISTEN) {
            await this.listen(Configuration.empty, server);
        } else if (mode === Mode.NONE) {
            await this.idle();
        }

        await this.setMuted(Configuration.empty.muted, muted);
        await this.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized! ----");
    }

    public send(networkCommand: NetworkCommand): void {
        this.write(networkCommand.toBuffer());
    }

    private report(id: string, type: PacketType, data: string) {
        const reportId = uuidv4();

        const networkCommand = NetworkCommand.create("report", Buffer.from(JSON.stringify({
            id: reportId,
            correlationId: id,
            timestamp: Date.now(),
            data: data,
            type: type,
            nodeId: this.id,
        } as PacketReport)));

        this.send(networkCommand);
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
        if (stream === Stream.AIRPLAY) {
            await this.enableMultipleAirplay();
        } else if (stream === Stream.BLUETOOTH) {
            await this.enableMultipleBluetooth();
        }
        await Configuration.setStream(stream);

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

        if (configuration.mode === Mode.LISTEN) {
            await Snapclient.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === Mode.SINGLE) {
            if (configuration.stream !== stream) {
                if (configuration.stream === Stream.AIRPLAY) {
                    await this.disableSingleAirplay();
                } else if (configuration.stream === Stream.BLUETOOTH) {
                    await this.disableSingleBluetooth();
                }

                await this.setAndStartSingle(stream);
            }
        } else if (configuration.mode === Mode.STREAM) {
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.disableMultipleBluetooth();
            }

            await Snapclient.stop();
            await Snapserver.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === Mode.IDLE || configuration.mode === Mode.NONE) {
            await this.setAndStartSingle(stream);
        }

        await Configuration.setMode(Mode.SINGLE);

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
        if (stream === Stream.AIRPLAY) {
            await this.enableSingleAirplay();
        } else if (stream === Stream.BLUETOOTH) {
            await this.enableSingleBluetooth();
        }

        await Configuration.setStream(stream);
    }

    private async enableSingleBluetooth(): Promise<void> {
        await this.enableBluetooth();
        await Services.startService("bluetooth-playback");
    }

    private async enableSingleAirplay(): Promise<void> {
        await Services.startService("airplay-playback");
    }

    private response(id: string, data: Buffer = Buffer.from("")): void {
        const networkCommand = new NetworkCommand(id, "response", data);
        this.send(networkCommand);
    }
}


