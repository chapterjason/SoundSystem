import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { Command } from "@soundsystem/common";

export interface CommandQueueItem {
    socket: BidirectionalSocket;

    command: Command;
}
