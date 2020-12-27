import { Socket, SocketConstructorOpts } from "net";
import { Configuration } from "./Configuration";
import { Mode, NetworkCommand } from "common";
import { HOSTNAME, ID } from "./meta";
import { ContextualCommandHandler } from "./ContextualCommandHandler";
import { NetworkCommandHandler } from "./NetworkCommandHandler";

export class Client extends Socket {

    private sendConfigurationTimeoutId: NodeJS.Timeout | null = null;

    private commands: NetworkCommand[] = [];

    public constructor(options?: SocketConstructorOpts) {
        super(options);

        this.setEncoding("utf8");

        this.on("data", this.onData.bind(this));
    }

    public async onData(buffer: Buffer) {
        const networkCommand = NetworkCommand.fromBuffer(buffer);

        this.commands.push(networkCommand);
    }

    public async sendConfiguration() {
        if (this.sendConfigurationTimeoutId !== null) {
            clearTimeout(this.sendConfigurationTimeoutId);
        }

        const configuration = await Configuration.load();
        const networkCommand = NetworkCommand.create("configuration", JSON.stringify({
            ...configuration,
            hostname: HOSTNAME,
            id: ID,
        }));

        await this.send(networkCommand);

        this.sendConfigurationTimeoutId = setTimeout(async () => {
            await this.sendConfiguration();
        }, 1000);
    }

    public async init(): Promise<void> {
        console.log("---- Initialize ----");
        const handler = new ContextualCommandHandler();
        const { mode, server, stream, volume, muted } = await Configuration.load();

        if (mode === Mode.IDLE) {
            await handler.idle(Configuration.empty);
        } else if (mode === Mode.SINGLE) {
            await handler.single(Configuration.empty, stream);
        } else if (mode === Mode.STREAM) {
            await handler.stream(Configuration.empty, stream);
        } else if (mode === Mode.LISTEN) {
            await handler.listen(Configuration.empty, server);
        } else if (mode === Mode.NONE) {
            await handler.idle(Configuration.empty);
        }

        await handler.setMuted(Configuration.empty.muted, muted);
        await handler.setVolume(Configuration.empty.volume, volume);

        console.log(await Configuration.load());

        console.log("---- Initialized! ----");

        setImmediate(this.loop.bind(this));
    }

    public async send(networkCommand: NetworkCommand): Promise<void> {
        return new Promise((resolve, reject) => {
            this.write(networkCommand.toBuffer(), (error) => {
                if (error) {
                    console.log("send error", error);
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    public async response(id: string, data: string = ""): Promise<void> {
        const networkCommand = new NetworkCommand(id, "response", data);
        await this.send(networkCommand);
    }

    private async loop() {
        const command = this.commands.shift();

        if (command) {
            const context = new NetworkCommandHandler(command);

            await context.execute();
        }

        setImmediate(this.loop.bind(this));
    }
}


