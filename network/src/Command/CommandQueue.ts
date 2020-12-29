import { Command, Packet } from "@soundsystem/common";
import { CommandControllerInterface } from "./CommandControllerInterface";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { EventEmitter } from "events";
import { CommandQueueItem } from "./CommandQueueItem";

export class CommandQueue {

    protected items: CommandQueueItem[] = [];

    protected controllers: CommandControllerInterface[] = [];

    public constructor(target: EventEmitter) {
        target.on("request", this.handleRequest.bind(this));

        setImmediate(this.commandQueueLoop.bind(this));
    }

    public register(controller: CommandControllerInterface) {
        this.controllers.push(controller);
    }

    private handleRequest(socket: BidirectionalSocket, packet: Packet): void {
        const command = Command.fromPacket(packet);

        this.items.push({
            socket,
            command,
        });
    }

    private getController(command: string) {
        for (const controller of this.controllers) {
            const commands = controller.getCommands();

            if (commands.includes(command)) {
                return controller;
            }
        }

        throw new Error(`No controller found for command "${command}"`);
    }

    private async commandQueueLoop(): Promise<void> {
        const item = this.items.shift();

        if (item) {
            const { command, socket } = item;
            const commandName = command.getCommandName();
            const controller = this.getController(commandName);

            const result = await controller.execute(socket, command);
            const response = command.createResponse(result);

            socket.response(response);

            setImmediate(this.commandQueueLoop.bind(this));
        } else {
            setImmediate(this.commandQueueLoop.bind(this));
        }
    }

}
