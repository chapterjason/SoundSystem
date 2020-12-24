import { Module } from "@nestjs/common";
import { HomeController } from "./Controller/HomeController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeController } from "./Controller/NodeController";
import { NodeService } from "./Service/Node/NodeService";
import { joinToPackageDirectory } from "../../Meta";
import { HealthController } from "./Controller/HealthController";
import { ReportingService } from "./Service/Reporting/ReportingService";
import { ReportingController } from "./Controller/ReportingController";

@Module({
    controllers: [
        HomeController,
        HealthController,
        NodeController,
        ReportingController,
    ],
    providers: [
        ReportingService,
        NodeService,
    ],
    imports: [
        TypeOrmModule.forRoot(require(joinToPackageDirectory("ormconfig.js"))),
    ],
})
export class ApplicationModule {

}
