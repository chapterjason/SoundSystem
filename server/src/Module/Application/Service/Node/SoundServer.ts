import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ENVIRONMENT } from "../../../../Meta";
import { BidirectionalSocket, CommandQueue, Server } from "@soundsystem/network";
import { SoundServerController } from "./Controller/SoundServerController";
import { SoundNodeData, SoundNodeResponseData } from "@soundsystem/common";

const DEFAULT_SERVICE_PORT = 3200;
const SERVICE_PORT = ENVIRONMENT.has("SERVICE_PORT") ? parseInt(ENVIRONMENT.get("SERVICE_PORT"), 10) : DEFAULT_SERVICE_PORT;
ENVIRONMENT.set("SERVICE_PORT", SERVICE_PORT.toString());

@Injectable()
export class SoundServer extends Server<SoundNodeData> {

    protected queue: CommandQueue = new CommandQueue(this);

    private readonly logger = new Logger("SoundServer");

    public constructor() {
        super();

        this.queue.register(new SoundServerController());

        this.on("connect", this.handleClientConnect.bind(this));

        this.listen({ port: SERVICE_PORT, host: "0.0.0.0" });
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

    protected handleListen(): void {
        this.logger.log("Service listen to: " + ENVIRONMENT.get("APP_IP") + ":" + SERVICE_PORT);
    }

    private handleClientConnect(socket: BidirectionalSocket<SoundNodeData>): void {
        this.logger.log(`Connected unknown`);

        socket.on("close", this.handleClientDisconnect.bind(this));
    }

    private handleClientDisconnect(socket: BidirectionalSocket<SoundNodeData>): void {
        this.logger.log(`Disconnected ${socket.getUserData()?.hostname ?? "unknown"}`);
    }
}
