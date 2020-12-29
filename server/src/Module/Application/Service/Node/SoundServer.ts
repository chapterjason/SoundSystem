import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ENVIRONMENT } from "../../../../Meta";
import { BidirectionalSocket, CommandQueue, Server } from "@soundsystem/network";
import { SoundServerController } from "./Controller/SoundServerController";
import { Command, SoundNodeData, SoundNodeResponseData } from "@soundsystem/common";
import { ReportingController } from "./Controller/ReportingController";
import { ReportingService } from "../Reporting/ReportingService";

const DEFAULT_SERVICE_PORT = 3200;
const SERVICE_PORT = ENVIRONMENT.has("SERVICE_PORT") ? parseInt(ENVIRONMENT.get("SERVICE_PORT"), 10) : DEFAULT_SERVICE_PORT;
ENVIRONMENT.set("SERVICE_PORT", SERVICE_PORT.toString());

@Injectable()
export class SoundServer extends Server<SoundNodeData> {

    protected queue: CommandQueue = new CommandQueue(this);

    private readonly logger = new Logger("SoundServer");

    private reporting: ReportingService;

    public constructor(reporting: ReportingService) {
        super();

        this.reporting = reporting;

        this.queue.register(new SoundServerController());
        this.queue.register(new ReportingController(reporting));

        this.on("connect", this.handleClientConnect.bind(this));

        this.listen({ port: SERVICE_PORT });
    }

    public getSockets() {
        return Array.from(this.sockets.values());
    }

    public serializeSocket(socket: BidirectionalSocket<SoundNodeData>): SoundNodeResponseData {
        const data = socket.getUserData();

        if (!data) {
            throw new InternalServerErrorException(`Can not serialize unknown node.`);
        }

        return {
            ...data,
            address: socket.getSocket().remoteAddress?.toString() ?? "unknown-ip",
        };
    }

    public getSocket(id: string): BidirectionalSocket<SoundNodeData> {
        for (const socket of this.sockets) {
            const data = socket.getUserData();

            if (data) {
                if (data.id === id) {
                    return socket;
                }
            }
        }

        throw new NotFoundException(`Node ${id} not found.`);
    }

    private onListen(): void {
        this.logger.log("Service listen to: " + ENVIRONMENT.get("APP_IP") + ":" + SERVICE_PORT);
    }

    private handleClientConnect(socket: BidirectionalSocket<SoundNodeData>): void {
        this.logger.log(`Connected unknown`);

        socket.on("response", (socket, packet) => {
            // const command = Command.fromPacket(packet);

            console.log("response");
        });

        socket.on("close", this.handleClientDisconnect.bind(this));
    }

    private handleClientDisconnect(socket: BidirectionalSocket<SoundNodeData>): void {
        this.logger.log(`Disconnected ${socket.getUserData()?.hostname ?? "unknown"}`);
    }
}
