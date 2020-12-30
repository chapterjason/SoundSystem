/// <reference types="node" />
import { DataType } from "./DataType";
export declare class Packet {
    protected id: string;
    protected timestamp: number;
    protected buffer: Buffer;
    constructor(id: string, timestamp: number, data?: DataType);
    static ensureBuffer(data?: DataType): Buffer;
    static fromBuffer(buffer: Buffer): Packet;
    static create(data?: DataType): Packet;
    getBuffer(): Buffer;
    getTimestamp(): number;
    getId(): string;
    getAs<T>(): T;
    toBuffer(): Buffer;
}
//# sourceMappingURL=Packet.d.ts.map