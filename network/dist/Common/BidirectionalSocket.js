"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidirectionalSocket = void 0;
const events_1 = require("events");
const Packet_1 = require("./Packet");
class BidirectionalSocket extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this.handlers = new Map();
        this.packets = [];
        this.userData = null;
        this.id = null;
        this.socket = socket;
        this.socket.setNoDelay(true);
        this.socket.setEncoding("utf8");
        this.socket.setKeepAlive(true);
        this.socket.on("data", this.handleData.bind(this));
        this.socket.on("error", error => this.emit("error", error));
        this.socket.on("close", () => this.emit("close", this));
        this.socket.on("connect", () => this.emit("connect"));
        setImmediate(this.handleOutgoingPacket.bind(this));
    }
    disconnect() {
        this.socket.destroy();
    }
    getSocket() {
        return this.socket;
    }
    getUserData() {
        return this.userData;
    }
    setUserData(value) {
        this.userData = value;
    }
    async request(requestPacket) {
        const id = requestPacket.getId();
        return new Promise((resolve, reject) => {
            this.packets.push(requestPacket);
            this.handlers.set(id, (data) => {
                if (data instanceof Packet_1.Packet) {
                    resolve(data);
                    return;
                }
                reject(data);
            });
            this.requeue();
        });
    }
    response(responsePacket) {
        this.packets.push(responsePacket);
        this.requeue();
    }
    handleData(buffer) {
        const packet = Packet_1.Packet.fromBuffer(buffer);
        const id = packet.getId();
        if (this.handlers.has(id)) {
            this.handleResponsePacket(packet);
        }
        else {
            this.handleRequestPacket(packet);
        }
    }
    handleResponsePacket(packet) {
        const id = packet.getId();
        const responseHandler = this.handlers.get(id);
        this.handlers.delete(id);
        this.emit("response", this, packet);
        responseHandler(packet);
    }
    handleRequestPacket(packet) {
        this.emit("request", this, packet);
    }
    requeue() {
        if (this.id) {
            clearImmediate(this.id);
        }
        this.id = setImmediate(this.handleOutgoingPacket.bind(this));
    }
    handleOutgoingPacket() {
        const packet = this.packets.shift();
        if (packet) {
            const buffer = packet.toBuffer();
            this.socket.write(buffer, (error) => {
                if (error) {
                    this.emit("error", error);
                }
                this.requeue();
            });
        }
    }
}
exports.BidirectionalSocket = BidirectionalSocket;
//# sourceMappingURL=BidirectionalSocket.js.map