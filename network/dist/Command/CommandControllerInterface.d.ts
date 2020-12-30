import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { Command } from "./Command";
import { DataType } from "../Common/DataType";
export interface CommandControllerInterface {
    getCommands(): string[];
    execute(socket: BidirectionalSocket, command: Command): Promise<DataType>;
}
//# sourceMappingURL=CommandControllerInterface.d.ts.map