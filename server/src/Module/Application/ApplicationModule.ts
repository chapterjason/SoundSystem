import { Module } from "@nestjs/common";
import { HomeController } from "./Controller/HomeController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeController } from "./Controller/NodeController";
import { SoundServer } from "./Service/Node/SoundServer";
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
        SoundServer,
    ],
    imports: [
        TypeOrmModule.forRoot(require(joinToPackageDirectory("ormconfig.js"))),
    ],
})
export class ApplicationModule {

}
