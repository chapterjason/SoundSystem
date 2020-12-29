import { CommandController } from "@soundsystem/network";
import { ReportingPoint, SoundNodeData } from "@soundsystem/common";
import { Logger } from "@nestjs/common";
import { ReportingService } from "../../Reporting/ReportingService";

export class ReportingController extends CommandController<SoundNodeData> {

    private readonly logger = new Logger("ReportingController");

    private reporting: ReportingService;

    public constructor(reporting: ReportingService) {
        super();

        this.reporting = reporting;

        this.set("report", this.report.bind(this));
    }

    public async report(data: ReportingPoint) {
        this.reporting.report(data);
    }

}
