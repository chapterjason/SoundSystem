import { Injectable, Logger } from "@nestjs/common";
import { joinToPackageDirectory } from "../../../../Meta";
import { existsSync, promises as fs } from "fs";
import { PacketReport } from "common";

@Injectable()
export class ReportingService {
    private stack: PacketReport[] = [];

    private readonly logger = new Logger("NodeService");

    public constructor() {
        this.loop()
            .catch((error) => {
                this.logger.error(error.message, error.stack);
            });
    }

    private static getFile() {
        return joinToPackageDirectory("reporting.json");
    }

    public report(report: PacketReport) {
        this.stack.push(report);
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

    private async loop(): Promise<void> {
        const stack = [...this.stack];
        this.stack = [];

        if (stack.length > 0) {
            const reports = await this.load();

            reports.push(...stack);

            await this.save(reports);
        }

        setTimeout(() => {
            this.loop();
        }, 1000);
    }
}
