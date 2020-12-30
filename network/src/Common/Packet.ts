import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import { DataType } from "./DataType";
import { Base64 } from "@soundsystem/common";

export class Packet {

    protected id: string;

    protected timestamp: number;

    protected buffer: Buffer;

    public constructor(id: string, timestamp: number, data: DataType = "") {
        this.id = id;
        this.timestamp = timestamp;
        this.buffer = Packet.ensureBuffer(data);
    }

    public static ensureBuffer(data: DataType = ""): Buffer {
        return data instanceof Buffer ? Buffer.from(data) : Buffer.from(JSON.stringify(data));
    }

    public static fromBuffer(buffer: Buffer): Packet {
        const uncompressed = Base64.decode(buffer.toString());
        const { id, timestamp, data } = JSON.parse(uncompressed);

        // @todo validate decoded

        return new Packet(id, timestamp, Buffer.from(data, "base64"));
    }

    public static create(data: DataType = ""): Packet {
        const id = uuidv4();
        const timestamp = Date.now();

        return new Packet(id, timestamp, Packet.ensureBuffer(data));
    }

    public getBuffer(): Buffer {
        return this.buffer;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getId(): string {
        return this.id;
    }

    public getAs<T>(): T {
        const buffer = this.getBuffer();
        const text = buffer.toString();

        return JSON.parse(text);
    }

    public toBuffer(): Buffer {
        const text = JSON.stringify({
            id: this.id,
            timestamp: this.timestamp,
            data: this.buffer.toString("base64"),
        });

        return Buffer.from(Base64.encode(text));
    }

}
