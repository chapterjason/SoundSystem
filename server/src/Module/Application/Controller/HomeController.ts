import { Controller, Get, Render, Scope } from "@nestjs/common";

@Controller({ scope: Scope.REQUEST })
export class HomeController {

    @Get("/")
    @Render("application/node/index.html.twig")
    public index() {
        return {};
    }

}
