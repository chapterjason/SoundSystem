import { BidirectionalSocket, CommandController } from "../src";
import { Command } from "@soundsystem/common";

export class FooCommandController extends CommandController {

    public constructor() {
        super();

        this.set("calculate", this.calculate);
    }

    public async calculate(data: [number, number], command: Command, socket: BidirectionalSocket): Promise<number> {
        const [a, b] = data;

        return a + b;
    }
}
