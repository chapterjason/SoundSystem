import { Injectable } from "@nestjs/common";
import { PacketReport } from "../../../../Types";

@Injectable()
export class ReportingService {

    public report(report: PacketReport) {
        console.log(report);
    }

}
