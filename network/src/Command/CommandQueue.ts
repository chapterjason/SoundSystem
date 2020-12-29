import { Command, Packet } from "@soundsystem/common";
import { CommandControllerInterface } from "./CommandControllerInterface";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";
import { EventEmitter } from "events";
import { CommandQueueItem } from "./CommandQueueItem";

export class CommandQueue {

    protected items: CommandQueueItem[] = [];

    protected controllers: CommandControllerInterface[] = [];

    protected id: NodeJS.Timeout | null = null;

    public constructor(target: EventEmitter) {
        target.on("request", this.handleRequest.bind(this));
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

        this.requeue();
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
        }

        this.requeue();
    }

    private requeue(){
        if(this.items.length > 0) {
            if(this.id){
                clearTimeout(this.id);
            }

            this.id = setTimeout(this.commandQueueLoop.bind(this), 1);
        }
    }

}
