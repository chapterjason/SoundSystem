import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { CommandHandler } from "./CommandHandler";
import { CommandControllerInterface } from "./CommandControllerInterface";
import { DataType } from "../Common/DataType";
import { Command } from "./Command";
export declare abstract class CommandController<UserDataType extends object = {}> implements CommandControllerInterface {
    protected handlers: Map<string, CommandHandler<UserDataType>>;
    getCommands(): string[];
    execute(socket: BidirectionalSocket<UserDataType>, command: Command): Promise<DataType>;
    protected set(command: string, handler: any): void;
}
//# sourceMappingURL=CommandController.d.ts.map