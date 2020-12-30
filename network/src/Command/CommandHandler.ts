import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { DataType } from "../Common/DataType";
import { Command } from "./Command";

export interface CommandHandler<UserDataType extends object = {}> {
    (data: DataType, command: Command, socket: BidirectionalSocket<UserDataType>): Promise<DataType>;
}
