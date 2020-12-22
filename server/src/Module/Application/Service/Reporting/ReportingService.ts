import { Injectable } from "@nestjs/common";
import { PacketReport } from "../../../../Types";
import { joinToPackageDirectory } from "../../../../Meta";
import { existsSync, promises as fs } from "fs";

@Injectable()
export class ReportingService {

    private static getFile() {
        return joinToPackageDirectory("reporting.json");
    }

    public async report(report: PacketReport) {
        const reports = await this.load();
        reports.push(report);
        await this.save(reports);
    }

    public async load(): Promise<PacketReport[]> {
        const file = ReportingService.getFile();
        if (!existsSync(file)) {
            await fs.writeFile(file, JSON.stringify([]));
        }

        const buffer = await fs.readFile(file);

        return JSON.parse(buffer.toString());
    }

    public async save(reports: PacketReport[]): Promise<void> {
        const file = ReportingService.getFile();
        await fs.writeFile(file, JSON.stringify(reports));
    }
}
