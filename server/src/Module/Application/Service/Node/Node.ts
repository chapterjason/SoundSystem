import { Socket } from "net";
import { Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { ReportingService } from "../Reporting/ReportingService";
import { Mode, NetworkCommand, NodeData, NodeResponseData, ReportingPoint, ReportingPointType, Stream } from "common";

export class Node {

    private readonly logger = new Logger("Node");

    private socket: Socket;

    private configuration: NodeData = {
        hostname: "none",
        mode: Mode.NONE,
        id: "none",
        volume: 32,
        server: "none",
        stream: Stream.NONE,
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

    public toJSON(): NodeResponseData {
        return {
            ...this.configuration,
            address: this.getAddress(),
        };
    }

    public async request(command: string, buffer: Buffer = Buffer.from("")) {
        const timestamp = Date.now();
        const networkCommand = NetworkCommand.create(command, buffer);
        const networkBuffer = networkCommand.toBuffer();
        const id = networkCommand.getId();

        this.reporting.report({
            correlationId: id,
            timestamp,
            type: ReportingPointType.REQUEST_SENT,
            data: networkBuffer.toString(),
            id: uuidv4(),
            nodeId: this.getId(),
        });

        return new Promise<string>((resolve, reject) => {
            const send = this.socket.write(networkBuffer);

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

    private onClose() {
        if (!this.disconnected) {
            this.disconnected = true;
            this.onDisconnect(this);
        }
    }

    private onData(buffer: Buffer) {
        const networkCommand = NetworkCommand.parse(buffer);
        const [id, command, data] = [networkCommand.getId(), networkCommand.getCommand(), networkCommand.getData()];

        try {
            if (command === "response") {
                if (!(id in this.responses)) {
                    throw new Error(`No response found for: ${JSON.stringify({ command, id, data: data.toString("ascii") })}`);
                }

                this.reporting.report({
                    correlationId: id,
                    timestamp: Date.now(),
                    type: ReportingPointType.RESPONSE_RECEIVED,
                    data: buffer.toString(),
                    id: uuidv4(),
                    nodeId: this.getId(),
                });

                const handler = this.responses[id];

                handler(networkCommand.getDataAsString());
            } else if (command === "report") {
                const report = networkCommand.getDataAsJson<ReportingPoint>();

                this.reporting.report(report);
            } else if (command === "configuration") {
                const configuration = networkCommand.getDataAsJson<NodeData>();

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
