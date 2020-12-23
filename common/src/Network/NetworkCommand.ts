import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

export class NetworkCommand {

    private static SEPARATOR = String.fromCharCode(248);

    private readonly command: string;

    private readonly data: Buffer;

    private readonly id: string;

    public constructor(id: string, command: string, data: Buffer = Buffer.from("")) {
        this.id = id;
        this.command = command;
        this.data = data;
    }

    public static parse(buffer: Buffer): NetworkCommand {
        const items = buffer.toString().split(NetworkCommand.SEPARATOR);
        const [id, command, data] = items;

        if ((!id && !command) || (items.length !== 3)) {
            throw new Error("Invalid NetworkCommand data");
        }

        return new NetworkCommand(
            Buffer.from(id, "base64").toString("ascii"),
            Buffer.from(command, "base64").toString("ascii"),
            Buffer.from(data, "base64"),
        );
    }

    public static create(command: string, data: Buffer = Buffer.from("")): NetworkCommand {
        return new NetworkCommand(uuidv4(), command, data);
    }

    public toBuffer() {
        return Buffer.from([
            Buffer.from(this.id).toString("base64"),
            NetworkCommand.SEPARATOR,
            Buffer.from(this.command).toString("base64"),
            NetworkCommand.SEPARATOR,
            this.data.toString("base64"),
        ].join(""));
    }

    public getData(): Buffer {
        return this.data;
    }

    public getDataAsString(): string {
        return this.data.toString("ascii");
    }

    public getDataAsJson<Type>(): Type {
        return JSON.parse(this.data.toString("ascii"));
    }

    public getCommand(): string {
        return this.command;
    }

    public getId() {
        return this.id;
    }

}
