import { Socket } from "net";
import { ResponseHandler } from "./ResponseHandler";
import { EventEmitter } from "events";
import { Packet } from "@soundsystem/common";

export class BidirectionalSocket<UserDataType extends object = {}> extends EventEmitter {
    protected socket: Socket;

    protected responseHandlers: Map<string, ResponseHandler> = new Map<string, ResponseHandler>();

    protected packetQueue: Packet[] = [];

    private userData: UserDataType | null = null;

    public constructor(socket: Socket) {
        super();
        this.socket = socket;

        this.socket.setNoDelay(true);

        this.socket.setEncoding("utf8");
        this.socket.setKeepAlive(true);

        this.socket.on("data", this.handleData.bind(this));
        this.socket.on("error", error => this.emit("error", error));
        this.socket.on("close", () => this.emit("close", this));
        this.socket.on("connect", () => this.emit("connect"));

        setImmediate(this.packetQueueLoop.bind(this));
    }

    public disconnect() {
        this.socket.destroy();
    }

    public getSocket() {
        return this.socket;
    }

    public getUserData(): UserDataType | null {
        return this.userData;
    }

    public setUserData(value: UserDataType) {
        this.userData = value;
    }

    public async request(requestPacket: Packet): Promise<Packet> {
        const id = requestPacket.getId();

        return new Promise((resolve, reject) => {
            setImmediate(() => {
                this.packetQueue.push(requestPacket);

                this.responseHandlers.set(id, (data: Error | Packet) => {
                    if (data instanceof Packet) {
                        resolve(data);
                        return;

                    }

                    reject(data);
                });
            });
        });
    }

    public response(responsePacket: Packet): void {
        setImmediate(() => this.packetQueue.push(responsePacket));
    }

    protected handleData(buffer: Buffer) {
        const packet = Packet.fromBuffer(buffer);
        const id = packet.getId();

        if (this.responseHandlers.has(id)) {
            this.handleResponsePacket(packet);
        } else {
            this.handleRequestPacket(packet);
        }
    }

    protected handleResponsePacket(packet: Packet): void {
        const id = packet.getId();
        const responseHandler = this.responseHandlers.get(id) as ResponseHandler;

        this.responseHandlers.delete(id);

        this.emit("response", this, packet);

        responseHandler(packet);
    }

    protected handleRequestPacket(packet: Packet): void {
        this.emit("request", this, packet);
    }

    private packetQueueLoop(): void {
        const packet = this.packetQueue.shift();

        if (packet) {
            const buffer = packet.toBuffer();
            this.socket.write(buffer, (error) => {
                if (error) {
                    this.emit("error", error);
                }

                setImmediate(this.packetQueueLoop.bind(this));
            });
        } else {
            setImmediate(this.packetQueueLoop.bind(this));
        }
    }
}
