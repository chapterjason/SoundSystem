import { Buffer } from "buffer";

export class Base64 {

    public static encode(encodedText: string): string {
        return Buffer.from(encodedText).toString("base64");
    }

    public static decode(decodedText: string): string {
        return Buffer.from(decodedText, "base64").toString("utf8");
    }

}
