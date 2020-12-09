import { EnvironmentLoader } from "@mscs/environment";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ApplicationModule } from "./Module/Application/ApplicationModule";
import { ENVIRONMENT, joinToPackageDirectory } from "./Meta";
import { Logger } from "@nestjs/common";

const DEFAULT_PORT = 80;

async function bootstrap() {
    const environmentLoader = new EnvironmentLoader(ENVIRONMENT);
    await environmentLoader.loadEnvironment(joinToPackageDirectory(".env"));

    const APP_PORT: number = ENVIRONMENT.has("APP_PORT") ? parseInt(ENVIRONMENT.get("APP_PORT"), 10) : DEFAULT_PORT;
    ENVIRONMENT.set("APP_PORT", APP_PORT.toString());

    return APP_PORT;
}

async function runtime(APP_PORT: number) {
    const application = await NestFactory.create<NestExpressApplication>(ApplicationModule);

    application.useStaticAssets(joinToPackageDirectory("public"));
    application.setBaseViewsDir(joinToPackageDirectory("templates"));
    application.setViewEngine("twig");

    (new Logger("Runtime")).log(`Application listen to: ${ENVIRONMENT.get("APP_IP")}:${APP_PORT}`);

    await application.listen(APP_PORT);
}

bootstrap()
    .then(runtime)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
