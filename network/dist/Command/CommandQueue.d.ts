/// <reference types="node" />
import { CommandControllerInterface } from "./CommandControllerInterface";
import { EventEmitter } from "events";
import { CommandQueueItem } from "./CommandQueueItem";
export declare class CommandQueue {
    protected items: CommandQueueItem[];
    protected controllers: CommandControllerInterface[];
    protected id: NodeJS.Immediate | null;
    constructor(target: EventEmitter);
    register(controller: CommandControllerInterface): void;
    private handleRequest;
    private getController;
    private commandQueueLoop;
    private requeue;
}
//# sourceMappingURL=CommandQueue.d.ts.map