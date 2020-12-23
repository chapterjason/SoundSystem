import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

export class NetworkCommand {

    private static commandExpression = /^\000(.+?)\017(.+?)\017(.*?)\004$/m;

    private readonly command: string;

    private readonly data: Buffer;

    private readonly id: string;

    public constructor(id: string, command: string, data: Buffer = Buffer.from("")) {
        this.id = id;
        this.command = command;
        this.data = data;
    }

    public static parse(buffer: Buffer): NetworkCommand {
        const match = this.commandExpression.exec(buffer.toString());

        if (!match) {
            throw new Error("Invalid data format.");
        }

        const [id, command, data] = [...match];

        return new NetworkCommand(
            Buffer.from(id, "base64").toString("ascii"),
            Buffer.from(command, "base64").toString("ascii"),
            Buffer.from(data, "base64")
        );
    }

    public static create(command: string, data: Buffer = Buffer.from("")): NetworkCommand {
        return new NetworkCommand(uuidv4(), command, data);
    }

    public toBuffer() {
        return Buffer.from([
            String.fromCharCode(0),
            Buffer.from(this.id).toString("base64"),
            String.fromCharCode(23),
            Buffer.from(this.command).toString("base64"),
            String.fromCharCode(23),
            this.data.toString("base64"),
            String.fromCharCode(4),
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
