import os from "os";
import { ParsedLine } from "./ParsedLine";

export class PackageInfoParser {

    public parse(info: string) {
        const lines = info.split(/\r?\n/g);
        const items: Record<string, string> = {};

        let item: string | null = null;
        for (const line of lines) {
            const { key, text } = this.parseLine(line);

            if (key) {
                item = key;
                items[item] = text;
            } else if (item) {
                items[item] += os.EOL + text;
            } else {
                throw new Error("Invalid info.");
            }
        }

        return items;
    }

    private parseLine(line: string): ParsedLine {
        if (line.charAt(0) !== " ") {
            const [key, ...rest] = line.split(":");

            return {
                key,
                text: rest.join(":").trim(),
            };
        } else {
            return {
                key: null,
                text: line.trim(),
            };
        }

    }
}
