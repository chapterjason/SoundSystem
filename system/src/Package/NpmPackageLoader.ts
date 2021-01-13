import { promises as fs } from "fs";
import { NpmPackageData } from "@soundsystem/common";

export class NpmPackageLoader {

    private readonly file: string;

    public constructor(file: string) {
        this.file = file;
    }

    public async load(): Promise<NpmPackageData> {
        const packageBuffer = await fs.readFile(this.file);

        return JSON.parse(packageBuffer.toString()) as NpmPackageData;
    }
}
