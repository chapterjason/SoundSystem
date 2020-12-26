import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";
import { Base64 } from "../Utils/Base64";

export class NetworkCommand {

    private static SEPARATOR = String.fromCharCode(64);

    private readonly command: string;

    private readonly data: string;

    private readonly id: string;

    public constructor(id: string, command: string, data: string = "") {
        this.id = id;
        this.command = command;
        this.data = data;
    }

    public static fromBuffer(buffer: Buffer): NetworkCommand {
        return this.fromString(buffer.toString());
    }

    public static fromString(text: string): NetworkCommand {
        const items = Buffer.from(text, "base64").toString("ascii").split(NetworkCommand.SEPARATOR);
        const [id, command, data] = items;

        if ((!id && !command) || (items.length !== 3)) {
            throw new Error(`Invalid NetworkCommand data: "${text}"`);
        }

        return new NetworkCommand(
            Base64.decode(id),
            Base64.decode(command),
            Base64.decode(data),
        );
    }

    public static create(command: string, data: unknown = ""): NetworkCommand {
        const text: string = typeof data !== "string" ? JSON.stringify(data) : data;

        return new NetworkCommand(uuidv4(), command, text);
    }

    public toBuffer() {
        return Buffer.from(this.toString());
    }

    public toString(): string {
        return Base64.encode([
            Base64.encode(this.id),
            Base64.encode(this.command),
            Base64.encode(this.data),
        ].join(NetworkCommand.SEPARATOR));
    }

    public getData(): string {
        return this.data;
    }

    public getDataAs<Type>(): Type {
        return JSON.parse(this.data);
    }

    public getCommand(): string {
        return this.command;
    }

    public getId() {
        return this.id;
    }

}
