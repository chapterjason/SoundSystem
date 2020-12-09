import { Module } from "@nestjs/common";
import { HomeController } from "./Controller/HomeController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeController } from "./Controller/NodeController";
import { NodeService } from "./Service/NodeService";
import { joinToPackageDirectory } from "../../Meta";
import { HealthController } from "./Controller/HealthController";

@Module({
    controllers: [
        HomeController,
        HealthController,
        NodeController,
    ],
    providers: [
        NodeService,
    ],
    imports: [
        TypeOrmModule.forRoot(require(joinToPackageDirectory("ormconfig.js"))),
    ],
})
export class ApplicationModule {

}
