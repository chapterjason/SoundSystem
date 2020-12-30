import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { Command } from "./Command";

export interface CommandQueueItem {
    socket: BidirectionalSocket;

    command: Command;
}
