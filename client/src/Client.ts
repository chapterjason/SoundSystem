import { Socket, SocketConstructorOpts } from "net";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { Configuration } from "./Configuration";
import { ConfigurationData } from "./ConfigurationData";
import { SnapclientService } from "./Service/SnapclientService";
import { SnapserverService } from "./Service/SnapserverService";
import { Alsa } from "./Alsa";
import { update } from "./Utils/Update";
import { ENVIRONMENT } from "./meta";
import * as fs from "fs";
import { existsSync } from "fs";
import * as path from "path";
import { Mode, NetworkCommand, ReportingPoint, ReportingPointType, Stream } from "common";
import { BluetoothService } from "./Service/BluetoothService";
import { AirplayService } from "./Service/AirplayService";

export class Client extends Socket {

    private hostname: string;

    private id: string;

    private sendConfigurationTimeoutId: NodeJS.Timeout | null = null;

    private snapclientService = new SnapclientService();

    private snapserverService = new SnapserverService();

    private bluetoothService = new BluetoothService();

    private airplayService = new AirplayService();

    private correlationId: string = "";

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
        const timestamp = Date.now();
        const networkCommand = NetworkCommand.parse(buffer);
        const [id, command, data] = [networkCommand.getId(), networkCommand.getCommand(), networkCommand.getData()];

        this.correlationId = id;
        this.report(ReportingPointType.REQUEST_RECEIVED, buffer.toString("base64"), timestamp);

        try {
            const configuration = await Configuration.load();

            if (command === "idle") {
                await this.idle(configuration);
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

            this.report(ReportingPointType.RESPONSE_SENT, buffer.toString("base64"));
            this.response(id);
        } catch (exception) {
            this.report(ReportingPointType.FAILED, JSON.stringify({ message: exception.message, stack: exception.stack }));
            this.response(id, Buffer.from(JSON.stringify(exception)));

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

            await this.snapserverService.stop();

            await this.setAndListen(server);
        } else if (configuration.mode === Mode.SINGLE) {
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.stopSingleBluetooth();
            } else if (configuration.stream === Stream.AIRPLAY) {
                await this.airplayService.stop();
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
                await this.stopSingleBluetooth();
            } else if (configuration.stream === Stream.AIRPLAY) {
                await this.airplayService.stop();
            }

            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (configuration.mode === Mode.STREAM) { // If already streaming
            if (configuration.stream !== stream) { // If stream type is another
                // If current was bluetooth, stop bluetooth
                if (configuration.stream === Stream.BLUETOOTH) {
                    await this.disableMultipleBluetooth();
                }

                await this.snapserverService.stop();

                await this.setAndStart(stream);
            }
        } else if (configuration.mode === Mode.IDLE || configuration.mode === Mode.NONE) {
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        }

        await Configuration.setMode(Mode.STREAM);

        console.log("--> [Stream]", stream);
    }

    public async idle(configuration: ConfigurationData) {
        console.log("<-- [Idle]");

        if (configuration.mode !== Mode.IDLE) {
            if (configuration.mode === Mode.LISTEN) {
                await this.snapclientService.stop();
                await Configuration.setServer("");
            } else if (configuration.mode === Mode.SINGLE) {
                if (configuration.stream === Stream.AIRPLAY) {
                    await this.airplayService.stop();
                } else if (configuration.stream === Stream.BLUETOOTH) {
                    await this.stopSingleBluetooth();
                }
            } else if (configuration.mode === Mode.STREAM) {
                await this.snapclientService.stop();
                await this.snapserverService.stop();
                await Configuration.setServer("");
                await Configuration.setStream(Stream.NONE);

                if (configuration.stream === Stream.BLUETOOTH) {
                    await this.disableMultipleBluetooth();
                }
            }
        }

        await Configuration.setMode(Mode.IDLE);

        console.log("--> [Idle]");
    }

    public async disableMultipleBluetooth() {
        await this.bluetoothService.stop();
        await this.bluetoothService.stopStream();
    }

    public async startStreamBluetooth() {
        await this.bluetoothService.start();
        await this.bluetoothService.startStream();

        await this.snapserverService.setStream(`pipe:///tmp/snapfifo?name=default`);
    }

    public async startStreamAirplayAirplay() {
        await this.snapserverService.setStream(`airplay:///shairport-sync?name=Airplay&devicename=${this.hostname}`);
    }

    public async init(): Promise<void> {
        console.log("---- Initialize ----");
        const { mode, server, stream, volume, muted } = await Configuration.load();

        if (mode === Mode.IDLE) {
            await this.idle(Configuration.empty);
        } else if (mode === Mode.SINGLE) {
            await this.single(Configuration.empty, stream);
        } else if (mode === Mode.STREAM) {
            await this.stream(Configuration.empty, stream);
        } else if (mode === Mode.LISTEN) {
            await this.listen(Configuration.empty, server);
        } else if (mode === Mode.NONE) {
            await this.idle(Configuration.empty);
        }

        await this.setMuted(Configuration.empty.muted, muted);
        await this.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized! ----");
    }

    public send(networkCommand: NetworkCommand): void {
        this.write(networkCommand.toBuffer());
    }

    public report(type: ReportingPointType, data: string, timestamp: number = Date.now()) {
        if (!this.correlationId.length) {
            return;
        }

        const reportId = uuidv4();

        const networkCommand = NetworkCommand.create("report", Buffer.from(JSON.stringify({
            id: reportId,
            correlationId: this.correlationId,
            timestamp,
            data: data,
            type: type,
            nodeId: this.id,
        } as ReportingPoint)));

        this.send(networkCommand);
    }

    private async setAndListen(server: string): Promise<void> {
        await this.snapclientService.stop();
        await this.snapclientService.setServer(server);
        await this.snapclientService.start();
        await Configuration.setServer(server);
    }

    private async setAndStart(stream: Stream): Promise<void> {
        // Set config for corresponding stream
        if (stream === Stream.AIRPLAY) {
            await this.startStreamAirplayAirplay();
        } else if (stream === Stream.BLUETOOTH) {
            await this.startStreamBluetooth();
        }
        await Configuration.setStream(stream);

        await this.snapserverService.start();
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
            await this.snapclientService.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === Mode.SINGLE) {
            if (configuration.stream !== stream) {
                if (configuration.stream === Stream.AIRPLAY) {
                    await this.airplayService.stop();
                } else if (configuration.stream === Stream.BLUETOOTH) {
                    await this.stopSingleBluetooth();
                }

                await this.setAndStartSingle(stream);
            }
        } else if (configuration.mode === Mode.STREAM) {
            if (configuration.stream === Stream.BLUETOOTH) {
                await this.disableMultipleBluetooth();
            }

            await this.snapclientService.stop();
            await this.snapserverService.stop();

            await this.setAndStartSingle(stream);
        } else if (configuration.mode === Mode.IDLE || configuration.mode === Mode.NONE) {
            await this.setAndStartSingle(stream);
        }

        await Configuration.setMode(Mode.SINGLE);

        console.log("--> [Single]", stream);
    }

    private async stopSingleBluetooth(): Promise<void> {
        await this.bluetoothService.stopSingle();
        await this.bluetoothService.stop();
    }

    private async setAndStartSingle(stream: Stream): Promise<void> {
        if (stream === Stream.AIRPLAY) {
            await this.airplayService.start();
        } else if (stream === Stream.BLUETOOTH) {
            await this.bluetoothService.start();
            await this.bluetoothService.startSingle();
        }

        await Configuration.setStream(stream);
    }

    private response(id: string, data: Buffer = Buffer.from("")): void {
        const networkCommand = new NetworkCommand(id, "response", data);
        this.send(networkCommand);
    }
}


