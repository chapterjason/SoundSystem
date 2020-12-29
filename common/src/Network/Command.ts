import { Packet } from "./Packet";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import { DataType } from "./Types/DataType";

export class Command {

    protected id: string;

    protected timestamp: number;

    protected commandName: string;

    protected buffer: Buffer;

    public constructor(id: string, timestamp: number, command: string, data: DataType = "") {
        this.id = id;
        this.timestamp = timestamp;
        this.commandName = command;
        this.buffer = Packet.ensureBuffer(data);
    }

    public static create(command: string, data: DataType = ""): Command {
        const id = uuidv4();
        const timestamp = Date.now();

        return new Command(id, timestamp, command, Packet.ensureBuffer(data));
    }

    public static fromPacket(packet: Packet): Command {
        const buffer = packet.getBuffer();
        const { command, data } = JSON.parse(buffer.toString());

        // @todo command, data

        return new Command(packet.getId(), packet.getTimestamp(), command, Buffer.from(data, "base64"));
    }

    public createResponse(data: DataType = ""): Packet {
        const timestamp = Date.now();

        return new Packet(this.id, timestamp, Packet.ensureBuffer(data));
    }

    public toPacket(): Packet {
        const text = JSON.stringify({
            command: this.commandName,
            data: this.buffer.toString("base64"),
        });

        return new Packet(this.id, this.timestamp, Buffer.from(text));
    }

    public getId() {
        return this.id;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getCommandName() {
        return this.commandName;
    }

    public getBuffer(): Buffer {
        return this.buffer;
    }

    public getAs<T>(): T {
        const buffer = this.getBuffer();
        const text = buffer.toString();

        return JSON.parse(text);
    }

}
