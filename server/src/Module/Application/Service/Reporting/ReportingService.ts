import { Injectable, Logger } from "@nestjs/common";
import { joinToPackageDirectory } from "../../../../Meta";
import { existsSync, promises as fs } from "fs";
import { ReportingPoint, ReportingPointType } from "common";

@Injectable()
export class ReportingService {
    private points: ReportingPoint[] = [];

    private readonly logger = new Logger("NodeService");

    public constructor() {
        this.loop()
            .catch((error) => {
                this.logger.error(error.message, error.points);
            });
    }

    private static getFile() {
        return joinToPackageDirectory("reporting.json");
    }

    public report(report: ReportingPoint) {
        console.log("report", new Date(report.timestamp).toISOString(), ReportingPointType[report.type], report.correlationId);
        this.points.push(report);
    }

    public async load(): Promise<ReportingPoint[]> {
        const file = ReportingService.getFile();
        if (!existsSync(file)) {
            await fs.writeFile(file, JSON.stringify([]));
        }

        const buffer = await fs.readFile(file);

        return JSON.parse(buffer.toString());
    }

    public async save(points: ReportingPoint[]): Promise<void> {
        const file = ReportingService.getFile();
        await fs.writeFile(file, JSON.stringify(points));
    }

    private async loop(): Promise<void> {
        const stack = [...this.points];
        this.points = [];

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
