"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandController = void 0;
class CommandController {
    constructor() {
        this.handlers = new Map();
    }
    getCommands() {
        return Array.from(this.handlers.keys());
    }
    async execute(socket, command) {
        const commandName = command.getCommandName();
        const handler = this.handlers.get(commandName);
        const data = command.getAs();
        return await handler(data, command, socket);
    }
    set(command, handler) {
        this.handlers.set(command, handler);
    }
}
exports.CommandController = CommandController;
//# sourceMappingURL=CommandController.js.map