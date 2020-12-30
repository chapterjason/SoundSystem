"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const buffer_1 = require("buffer");
const uuid_1 = require("uuid");
const Packet_1 = require("../Common/Packet");
class Command {
    constructor(id, timestamp, command, data = "") {
        this.id = id;
        this.timestamp = timestamp;
        this.commandName = command;
        this.buffer = Packet_1.Packet.ensureBuffer(data);
    }
    static create(command, data = "") {
        const id = uuid_1.v4();
        const timestamp = Date.now();
        return new Command(id, timestamp, command, Packet_1.Packet.ensureBuffer(data));
    }
    static fromPacket(packet) {
        const buffer = packet.getBuffer();
        const { command, data } = JSON.parse(buffer.toString());
        // @todo command, data
        return new Command(packet.getId(), packet.getTimestamp(), command, buffer_1.Buffer.from(data, "base64"));
    }
    createResponse(data = "") {
        const timestamp = Date.now();
        return new Packet_1.Packet(this.id, timestamp, Packet_1.Packet.ensureBuffer(data));
    }
    toPacket() {
        const text = JSON.stringify({
            command: this.commandName,
            data: this.buffer.toString("base64"),
        });
        return new Packet_1.Packet(this.id, this.timestamp, buffer_1.Buffer.from(text));
    }
    getId() {
        return this.id;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getCommandName() {
        return this.commandName;
    }
    getBuffer() {
        return this.buffer;
    }
    getAs() {
        const buffer = this.getBuffer();
        const text = buffer.toString();
        return JSON.parse(text);
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map