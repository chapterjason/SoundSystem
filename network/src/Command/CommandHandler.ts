import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { Command, DataType } from "@soundsystem/common";

export interface CommandHandler<UserDataType extends object = {}> {
    (data: DataType, command: Command, socket: BidirectionalSocket<UserDataType>): Promise<DataType>;
}
