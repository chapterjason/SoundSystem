import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class HealthController {

    @Get("/health")
    public async index() {
        return { status: "OK" };
    }

}
