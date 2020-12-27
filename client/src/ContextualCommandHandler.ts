import { SnapclientService } from "./Service/SnapclientService";
import { SnapserverService } from "./Service/SnapserverService";
import { BluetoothService } from "./Service/BluetoothService";
import { AirplayService } from "./Service/AirplayService";
import { AlsaService } from "./Service/AlsaService";
import { Mode, Stream } from "common";
import { Configuration } from "./Configuration";
import { update } from "./Utils/Update";
import { ENVIRONMENT, HOSTNAME } from "./meta";
import { ConfigurationData } from "./ConfigurationData";
import { EventEmitter } from "events";

export class ContextualCommandHandler extends EventEmitter {

    protected snapclientService: SnapclientService;

    protected snapserverService: SnapserverService;

    protected bluetoothService: BluetoothService;

    protected airplayService: AirplayService;

    protected alsaService: AlsaService;

    public constructor() {
        super();

        this.snapclientService = new SnapclientService();
        this.snapserverService = new SnapserverService();
        this.bluetoothService = new BluetoothService();
        this.airplayService = new AirplayService();
        this.alsaService = new AlsaService();
    }

    public bindEvents(handlers: { [event: string]: (service: string) => void }) {
        const services = [
            this.snapclientService,
            this.snapserverService,
            this.bluetoothService,
            this.airplayService,
            this.alsaService,
        ];

        const events = Object.keys(handlers);

        for (const event of events) {
            const handler = handlers[event];

            for (const service of services) {
                service.on(event, handler);
            }
        }
    }

    public async execute(command: string, data: string) {
        this.emit("beforeExecute");

        const configuration = await Configuration.load();

        try {
            if (command === "idle") {
                await this.idle(configuration);
            } else if (command === "listen") {
                await this.listen(configuration, data);
            } else if (command === "mute") {
                await this.setMuted(configuration.muted, true);
            } else if (command === "unmute") {
                await this.setMuted(configuration.muted, false);
            } else if (command === "single") {
                await this.single(configuration, data as Stream);
            } else if (command === "update") {
                console.log("Update...", (new Date()).toISOString());
                await update();
            } else if (command === "volume") {
                await this.setVolume(configuration.volume, parseInt(data, 10));
            } else if (command === "stream") {
                await this.stream(configuration, data as Stream);
            }
        } catch (error) {
            this.emit("error", error);
        } finally {
            this.emit("afterExecute");
        }
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
        await this.snapserverService.setStream(`airplay:///shairport-sync?name=Airplay&devicename=${HOSTNAME}`);
    }

    protected async setAndListen(server: string): Promise<void> {
        await this.snapclientService.stop();
        await this.snapclientService.setServer(server);
        await this.snapclientService.start();
        await Configuration.setServer(server);
    }

    protected async setAndStart(stream: Stream): Promise<void> {
        // Set config for corresponding stream
        if (stream === Stream.AIRPLAY) {
            await this.startStreamAirplayAirplay();
        } else if (stream === Stream.BLUETOOTH) {
            await this.startStreamBluetooth();
        }
        await Configuration.setStream(stream);

        await this.snapserverService.start();
    }

    public async setMuted(previousMuted: boolean, muted: boolean): Promise<void> {
        console.log("--> [Muted]", muted);
        if (previousMuted !== muted) {
            const device = this.getDevice();

            if (muted) {
                await this.alsaService.mute(device);
            } else {
                await this.alsaService.unmute(device);
            }

            await Configuration.setMuted(muted);
        }
        console.log("<-- [Muted]", muted);
    }

    public async setVolume(previousVolume: number, volume: number): Promise<void> {
        console.log("<-- [Volume]", volume);
        if (previousVolume !== volume) {
            const device = this.getDevice();
            await this.alsaService.setVolume(volume, device);
            await Configuration.setVolume(volume);
        }
        console.log("--> [Single]", volume);
    }

    public async single(configuration: ConfigurationData, stream: Stream): Promise<void> {
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

    protected async stopSingleBluetooth(): Promise<void> {
        await this.bluetoothService.stopSingle();
        await this.bluetoothService.stop();
    }

    protected async setAndStartSingle(stream: Stream): Promise<void> {
        if (stream === Stream.AIRPLAY) {
            await this.airplayService.start();
        } else if (stream === Stream.BLUETOOTH) {
            await this.bluetoothService.start();
            await this.bluetoothService.startSingle();
        }

        await Configuration.setStream(stream);
    }

    private getDevice(): string {
        return ENVIRONMENT.has("DEVICE") ? ENVIRONMENT.get("DEVICE") : "Headphone";
    }

}
