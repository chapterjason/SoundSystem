"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("@mscs/environment");
const core_1 = require("@nestjs/core");
const ApplicationModule_1 = require("./Module/Application/ApplicationModule");
const Meta_1 = require("./Meta");
const common_1 = require("@nestjs/common");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const DEFAULT_PORT = 80;
async function bootstrap() {
    const environmentLoader = new environment_1.EnvironmentLoader(Meta_1.ENVIRONMENT);
    await environmentLoader.loadEnvironment(Meta_1.joinToPackageDirectory(".env"));
    const APP_PORT = Meta_1.ENVIRONMENT.has("APP_PORT") ? parseInt(Meta_1.ENVIRONMENT.get("APP_PORT"), 10) : DEFAULT_PORT;
    Meta_1.ENVIRONMENT.set("APP_PORT", APP_PORT.toString());
    return APP_PORT;
}
async function runtime(APP_PORT) {
    const fastify = new platform_fastify_1.FastifyAdapter();
    const application = await core_1.NestFactory.create(ApplicationModule_1.ApplicationModule, fastify, {
        logger: ["log", "error", "warn", "debug", "verbose"],
    });
    application.useStaticAssets({
        root: Meta_1.joinToPackageDirectory("public"),
        prefix: "/",
    });
    application.setViewEngine({
        engine: {
            twig: require("twig"),
        },
        templates: Meta_1.joinToPackageDirectory("templates"),
    });
    await application.listen(APP_PORT, '0.0.0.0', (error, address) => {
        if (error) {
            throw error;
        }
        (new common_1.Logger("Runtime")).log(`Application listen to: ${address}/${Meta_1.ENVIRONMENT.get("APP_IP")}:${APP_PORT}`);
    });
}
bootstrap()
    .then(runtime)
    .catch(error => {
    console.log(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map