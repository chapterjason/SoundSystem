import { CommandController } from "../src";
import { Command } from "@soundsystem/common";

export class BarCommandController extends CommandController {

    public constructor() {
        super();
        this.set("name", this.getName);
    }

    public async getName(data: string, command: Command): Promise<string> {
        return "FooBar";
    }

}
