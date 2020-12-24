import { SystemService } from "../System/SystemService";

export class BluetoothService {

    private services: SystemService[] = [
        new SystemService("bthelper@hci0"),
        new SystemService("bt-agent"),
        new SystemService("bluetooth"),
        new SystemService("bluealsa"),
    ];

    private stream: SystemService = new SystemService("bluemusic-playback");

    private single: SystemService = new SystemService("bluetooth-playback");

    public async start() {
        for await (const service of this.services) {
            await service.start();
        }
    }

    public async stop() {
        for await (const service of this.services) {
            await service.stop();
        }
    }

    public async startStream() {
        await this.stream.start();
    }

    public async startSingle() {
        await this.single.start();
    }

    public async stopStream() {
        await this.stream.stop();
    }

    public async stopSingle() {
        await this.single.stop();
    }
}
