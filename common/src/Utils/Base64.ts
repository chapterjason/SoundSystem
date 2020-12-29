import { Buffer } from "buffer";

export class Base64 {

    public static encode(text: string): string {
        return Buffer.from(text).toString("base64");
    }

    public static decode(text: string): string {
        return Buffer.from(text, "base64").toString("utf8");
    }

}
