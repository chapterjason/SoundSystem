"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandQueue = void 0;
const Command_1 = require("./Command");
class CommandQueue {
    constructor(target) {
        this.items = [];
        this.controllers = [];
        this.id = null;
        target.on("request", this.handleRequest.bind(this));
    }
    register(controller) {
        this.controllers.push(controller);
    }
    handleRequest(socket, packet) {
        const command = Command_1.Command.fromPacket(packet);
        this.items.push({
            socket,
            command,
        });
        this.requeue();
    }
    getController(command) {
        for (const controller of this.controllers) {
            const commands = controller.getCommands();
            if (commands.includes(command)) {
                return controller;
            }
        }
        throw new Error(`No controller found for command "${command}"`);
    }
    async commandQueueLoop() {
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
    requeue() {
        if (this.items.length > 0) {
            if (this.id) {
                clearImmediate(this.id);
            }
            this.id = setImmediate(this.commandQueueLoop.bind(this));
        }
    }
}
exports.CommandQueue = CommandQueue;
//# sourceMappingURL=CommandQueue.js.map