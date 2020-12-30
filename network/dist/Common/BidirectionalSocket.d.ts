/// <reference types="node" />
import { Socket } from "net";
import { ResponseHandler } from "./ResponseHandler";
import { EventEmitter } from "events";
import { Packet } from "./Packet";
export declare class BidirectionalSocket<UserDataType extends object = {}> extends EventEmitter {
    protected socket: Socket;
    protected handlers: Map<string, ResponseHandler>;
    protected packets: Packet[];
    private userData;
    private id;
    constructor(socket: Socket);
    disconnect(): void;
    getSocket(): Socket;
    getUserData(): UserDataType | null;
    setUserData(value: UserDataType): void;
    request(requestPacket: Packet): Promise<Packet>;
    response(responsePacket: Packet): void;
    protected handleData(buffer: Buffer): void;
    protected handleResponsePacket(packet: Packet): void;
    protected handleRequestPacket(packet: Packet): void;
    private requeue;
    private handleOutgoingPacket;
}
//# sourceMappingURL=BidirectionalSocket.d.ts.map