/// <reference types="node" />
import { DataType } from "../Common/DataType";
import { Packet } from "../Common/Packet";
export declare class Command {
    protected id: string;
    protected timestamp: number;
    protected commandName: string;
    protected buffer: Buffer;
    constructor(id: string, timestamp: number, command: string, data?: DataType);
    static create(command: string, data?: DataType): Command;
    static fromPacket(packet: Packet): Command;
    createResponse(data?: DataType): Packet;
    toPacket(): Packet;
    getId(): string;
    getTimestamp(): number;
    getCommandName(): string;
    getBuffer(): Buffer;
    getAs<T>(): T;
}
//# sourceMappingURL=Command.d.ts.map