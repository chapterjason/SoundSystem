"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
const buffer_1 = require("buffer");
const uuid_1 = require("uuid");
const common_1 = require("@soundsystem/common");
class Packet {
    constructor(id, timestamp, data = "") {
        this.id = id;
        this.timestamp = timestamp;
        this.buffer = Packet.ensureBuffer(data);
    }
    static ensureBuffer(data = "") {
        return data instanceof buffer_1.Buffer ? buffer_1.Buffer.from(data) : buffer_1.Buffer.from(JSON.stringify(data));
    }
    static fromBuffer(buffer) {
        const uncompressed = common_1.Base64.decode(buffer.toString());
        const { id, timestamp, data } = JSON.parse(uncompressed);
        // @todo validate decoded
        return new Packet(id, timestamp, buffer_1.Buffer.from(data, "base64"));
    }
    static create(data = "") {
        const id = uuid_1.v4();
        const timestamp = Date.now();
        return new Packet(id, timestamp, Packet.ensureBuffer(data));
    }
    getBuffer() {
        return this.buffer;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getId() {
        return this.id;
    }
    getAs() {
        const buffer = this.getBuffer();
        const text = buffer.toString();
        return JSON.parse(text);
    }
    toBuffer() {
        const text = JSON.stringify({
            id: this.id,
            timestamp: this.timestamp,
            data: this.buffer.toString("base64"),
        });
        return buffer_1.Buffer.from(common_1.Base64.encode(text));
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map