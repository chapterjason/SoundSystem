import { Injectable } from "@nestjs/common";
import { PacketReport } from "./Types";

@Injectable()
export class Reporting {

    public report(report: PacketReport) {
        console.log(report);
    }

}
