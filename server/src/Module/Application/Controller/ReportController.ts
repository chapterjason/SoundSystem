import { Controller, Get, Scope } from "@nestjs/common";
import { ReportingService } from "../Service/Reporting/ReportingService";

@Controller({ scope: Scope.REQUEST })
export class ReportController {

    private service: ReportingService;

    public constructor(service: ReportingService) {
        this.service = service;
    }

    @Get("/report")
    public async getReports() {
        const reports = await this.service.load();

        return {
            reports,
        };
    }

}
