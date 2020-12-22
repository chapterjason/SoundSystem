import { Socket } from "net";
import { NodeConfiguration } from "../../../../NodeConfiguration";
import { Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { ReportingService } from "../Reporting/ReportingService";
import { PacketReport, PacketType } from "../../../../Types";

export class Node {

    private readonly logger = new Logger("Node");

    private socket: Socket;

    private configuration: NodeConfiguration = {
        hostname: "unset",
        mode: "reset",
        id: "unset",
        volume: 32,
        server: "unset",
        stream: "reset",
        muted: false,
    };

    private onConnect: (node: Node) => void;

    private onDisconnect: (node: Node) => void;

    private disconnected: boolean = false;

    private responses: Record<string, (data: string) => void> = {};

    private reporting: ReportingService;

    public constructor(reporting: ReportingService, socket: Socket, onConnect: (node: Node) => void, onDisconnect: (node: Node) => void) {
        this.reporting = reporting;
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

    public async request(command: string, buffer: Buffer = Buffer.from("")) {
        const [dataBuffer, id] = this.create(command, buffer);

        this.reporting.report({
            correlationId: id,
            timestamp: Date.now(),
            type: PacketType.REQUEST_SENT,
            data: dataBuffer.toString(),
            id: uuidv4(),
            nodeId: this.getId(),
        });

        return new Promise<string>((resolve, reject) => {
            const send = this.socket.write(dataBuffer);

            if (!send) {
                reject("Message not send");
                return;
            }

            this.responses[id] = (data: string) => {
                resolve(data);
            };
        });
    }

    public getAddress(): string {
        return this.socket.remoteAddress as string;
    }

    private create(command: string, buffer: Buffer): [Buffer, string] {
        const id = uuidv4();

        return [Buffer.concat([
            Buffer.from(command),
            Buffer.from(":"),
            Buffer.from(id),
            Buffer.from(":"),
            Buffer.from(buffer.toString("base64")),
        ]), id];
    }

    private onClose() {
        if (!this.disconnected) {
            this.disconnected = true;
            this.onDisconnect(this);
        }
    }

    private onData(buffer: Buffer) {
        const [command, id, data] = buffer.toString().split(":");
        const encodedData = Buffer.from(data, "base64").toString("ascii");

        try {
            if (command === "response") {
                if (!(id in this.responses)) {
                    throw new Error(`No response found for: ${JSON.stringify({ command, id, data })}`);
                }

                this.reporting.report({
                    correlationId: id,
                    timestamp: Date.now(),
                    type: PacketType.RESPONSE_RECEIVED,
                    data: buffer.toString(),
                    id: uuidv4(),
                    nodeId: this.getId(),
                });

                const handler = this.responses[id];

                handler(encodedData);
            } else if (command === "report") {
                const report = JSON.parse(encodedData) as PacketReport;

                this.reporting.report(report);
            } else if (command === "configuration") {
                const configuration = JSON.parse(encodedData) as NodeConfiguration;

                const id = this.configuration.id;

                this.configuration = configuration;

                // The first configuration data on set id official makes it available
                if (id !== configuration.id) {
                    this.onConnect(this);
                }
            }
        } catch (exception) {
            this.logger.error(exception.message, exception.stack);
            this.logger.error(JSON.stringify({ command, id, data }));
        }
    }
}
