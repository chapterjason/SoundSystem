import { Socket } from "net";
import { NodeConfiguration } from "./NodeConfiguration";
import { Logger } from "@nestjs/common";

export class Node {

    private readonly logger = new Logger("Node");

    private socket: Socket;

    private configuration: NodeConfiguration = {
        hostname: "unset",
        mode: "reset",
        id: "unset",
        volume: 60,
        server: "unset",
        stream: "reset",
    };

    private onConnect: (node: Node) => void;

    private onDisconnect: (node: Node) => void;

    private disconnected: boolean = false;

    public constructor(socket: Socket, onConnect: (node: Node) => void, onDisconnect: (node: Node) => void) {
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.socket = socket;

        this.socket.on("drain", () => {
            // write buffer is empty now .. u can resume the writable stream
            this.socket.resume();
        });

        this.socket.on("data", this.onData.bind(this));
        this.socket.on("close", this.onClose.bind(this));

        this.socket.on("end", () => {
            this.logger.error(`node end ${this.configuration.hostname}`);
            this.socket.destroy();
            this.onClose();
        });

        this.socket.on("error", (error) => {
            console.error(error);
            this.logger.error(`node error ${this.configuration.hostname}`);
            this.socket.destroy();
            this.onClose();
        });
    }

    public getSocket(): Socket {
        return this.socket;
    }

    public getHostname() {
        return this.configuration.hostname;
    }

    public getId() {
        return this.configuration.id;
    }

    public getVolume() {
        return this.configuration.volume;
    }

    public getMode() {
        return this.configuration.mode;
    }

    public getStream() {
        return this.configuration.stream;
    }

    public getServer() {
        return this.configuration.server;
    }

    public toJSON() {
        return {
            ...this.configuration,
            address: this.getAddress(),
        };
    }

    private onClose() {
        if (!this.disconnected) {
            this.disconnected = true;
            this.onDisconnect(this);
        }
    }

    private onData(buffer: Buffer) {
        const data = buffer.toString();

        if (data.startsWith("configuration:")) {
            const configurationData = data.slice(14);
            const configuration = JSON.parse(configurationData) as NodeConfiguration;

            const id = this.configuration.id;

            this.configuration = configuration;

            // The first configuration data on set id official makes it available
            if (id !== configuration.id) {
                this.onConnect(this);
            }
        }
    }

    private getAddress(): string {
        return this.socket.remoteAddress as string;
    }
}
