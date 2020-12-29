import { Command, DataType } from "@soundsystem/common";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";

export interface CommandControllerInterface {
    getCommands(): string[];

    execute(socket: BidirectionalSocket, command: Command): Promise<DataType>;
}
