import { SnapclientService } from "../SystemService/SnapclientService";
import { SnapserverService } from "../SystemService/SnapserverService";
import { BluetoothService } from "../SystemService/BluetoothService";
import { AirplayService } from "../SystemService/AirplayService";
import { AlsaService } from "../SystemService/AlsaService";
import { Mode, Stream } from "@soundsystem/common";
import { Configuration } from "../Configuration/Configuration";
import { ConfigurationData } from "../Configuration/ConfigurationData";
import { HOSTNAME } from "../constants";
import { DEVICE } from "../settings";
import { Span } from "@sentry/types";

export class SoundService {

    protected snapclientService: SnapclientService;

    protected snapserverService: SnapserverService;

    protected bluetoothService: BluetoothService;

    protected airplayService: AirplayService;

    protected alsaService: AlsaService;

    private tracing: Span;

    private configuration: Configuration;

    public constructor(tracing: Span) {
        this.tracing = tracing;

        this.snapclientService = new SnapclientService(this.tracing);
        this.snapserverService = new SnapserverService(this.tracing);
        this.bluetoothService = new BluetoothService(this.tracing);
        this.airplayService = new AirplayService(this.tracing);
        this.alsaService = new AlsaService(this.tracing);
        this.configuration = new Configuration(this.tracing);
    }

    public async listen(server: string) {
        const config = await this.configuration.get();

        if (config.mode === Mode.STREAM) {
            if (config.stream === Stream.BLUETOOTH) {
                await this.disableMultipleBluetooth();
            }

            await this.snapserverService.stop();

            await this.setAndListen(server);
        } else if (config.mode === Mode.SINGLE) {
            if (config.stream === Stream.BLUETOOTH) {
                await this.stopSingleBluetooth();
            } else if (config.stream === Stream.AIRPLAY) {
                await this.airplayService.stop();
            }

            await this.setAndListen(server);
        } else if (config.mode === Mode.LISTEN) {
            if (config.server !== server) {
                await this.setAndListen(server);
            }
        } else if (config.mode === Mode.IDLE || config.mode === Mode.NONE) {
            await this.setAndListen(server);
        }

        await this.configuration.setMode(Mode.LISTEN);
        await this.configuration.save();
    }

    public async stream(stream: Stream) {
        const config = await this.configuration.get();

        if (config.mode === Mode.LISTEN) {
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (config.mode === Mode.SINGLE) {
            if (config.stream === Stream.BLUETOOTH) {
                await this.stopSingleBluetooth();
            } else if (config.stream === Stream.AIRPLAY) {
                await this.airplayService.stop();
            }

            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        } else if (config.mode === Mode.STREAM) {
            if (config.stream !== stream) {
                if (config.stream === Stream.BLUETOOTH) {
                    await this.disableMultipleBluetooth();
                }

                await this.snapserverService.stop();

                await this.setAndStart(stream);
            }
        } else if (config.mode === Mode.IDLE || config.mode === Mode.NONE) {
            await this.setAndStart(stream);
            await this.setAndListen("127.0.0.1");
        }

        await this.configuration.setMode(Mode.STREAM);
        await this.configuration.save();
    }

    public async idle() {
        const config = await this.configuration.get();

        if (config.mode !== Mode.IDLE) {
            if (config.mode === Mode.LISTEN) {
                await this.snapclientService.stop();
                await this.configuration.setServer("");
            } else if (config.mode === Mode.SINGLE) {
                if (config.stream === Stream.AIRPLAY) {
                    await this.airplayService.stop();
                } else if (config.stream === Stream.BLUETOOTH) {
                    await this.stopSingleBluetooth();
                }
            } else if (config.mode === Mode.STREAM) {
                await this.snapclientService.stop();
                await this.snapserverService.stop();

                if (config.stream === Stream.BLUETOOTH) {
                    await this.disableMultipleBluetooth();
                }

                await this.configuration.setServer("");
                await this.configuration.setStream(Stream.NONE);
            }
        }

        await this.configuration.setMode(Mode.IDLE);
        await this.configuration.save();
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

    public async setMuted(muted: boolean): Promise<void> {
        const config = await this.configuration.get();

        if (config.muted !== muted) {
            if (muted) {
                await this.alsaService.mute(DEVICE());
            } else {
                await this.alsaService.unmute(DEVICE());
            }

            await this.configuration.setMuted(muted);
        }

        await this.configuration.save();
    }

    public async setVolume(volume: number): Promise<void> {
        const config = await this.configuration.get();

        if (config.volume !== volume) {
            await this.alsaService.setVolume(volume, DEVICE());
            await this.configuration.setVolume(volume);
        }

        await this.configuration.save();
    }

    public async single(stream: Stream): Promise<void> {
        const config = await this.configuration.get();

        if (config.mode === Mode.LISTEN) {
            await this.snapclientService.stop();

            await this.setAndStartSingle(stream);
        } else if (config.mode === Mode.SINGLE) {
            if (config.stream !== stream) {
                if (config.stream === Stream.AIRPLAY) {
                    await this.airplayService.stop();
                } else if (config.stream === Stream.BLUETOOTH) {
                    await this.stopSingleBluetooth();
                }

                await this.setAndStartSingle(stream);
            }
        } else if (config.mode === Mode.STREAM) {
            if (config.stream === Stream.BLUETOOTH) {
                await this.disableMultipleBluetooth();
            }

            await this.snapclientService.stop();
            await this.snapserverService.stop();

            await this.setAndStartSingle(stream);
        } else if (config.mode === Mode.IDLE || config.mode === Mode.NONE) {
            await this.setAndStartSingle(stream);
        }

        await this.configuration.setMode(Mode.SINGLE);
        await this.configuration.save();
    }

    protected async setAndListen(server: string): Promise<void> {
        await this.snapclientService.stop();
        await this.snapclientService.setServer(server);
        await this.snapclientService.start();
        await this.configuration.setServer(server);
    }

    protected async setAndStart(stream: Stream): Promise<void> {
        // Set config for corresponding stream
        if (stream === Stream.AIRPLAY) {
            await this.startStreamAirplayAirplay();
        } else if (stream === Stream.BLUETOOTH) {
            await this.startStreamBluetooth();
        }

        await this.snapserverService.start();

        await this.configuration.setStream(stream);
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

        await this.configuration.setStream(stream);
    }

}
