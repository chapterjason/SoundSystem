import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { CommandHandler } from "./CommandHandler";
import { CommandControllerInterface } from "./CommandControllerInterface";
import { DataType } from "../Common/DataType";
import { Command } from "./Command";

export abstract class CommandController<UserDataType extends object = {}> implements CommandControllerInterface {

    protected handlers: Map<string, CommandHandler<UserDataType>> = new Map<string, CommandHandler<UserDataType>>();

    public getCommands(): string[] {
        return Array.from(this.handlers.keys());
    }

    public async execute(socket: BidirectionalSocket<UserDataType>, command: Command): Promise<DataType> {
        const commandName = command.getCommandName();
        const handler = this.handlers.get(commandName) as CommandHandler<UserDataType>;
        const data = command.getAs<DataType>();

        return await handler(data, command, socket);
    }

    protected set(command: string, handler: any): void;
    protected set(command: string, handler: CommandHandler<UserDataType>): void {
        this.handlers.set(command, handler as CommandHandler<UserDataType>);
    }

}
