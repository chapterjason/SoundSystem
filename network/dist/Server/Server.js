"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const net_1 = require("net");
const events_1 = require("events");
const BidirectionalSocket_1 = require("../Common/BidirectionalSocket");
class Server extends events_1.EventEmitter {
    constructor() {
        super();
        this.sockets = new Set();
        this.server = new net_1.Server({ pauseOnConnect: false, allowHalfOpen: false }, this.handleConnect.bind(this));
        this.server.on("error", error => this.emit("error", error));
    }
    listen(options) {
        this.server.listen(options, this.handleListen.bind(this));
        return this;
    }
    async stop() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }
        this.sockets.clear();
        return new Promise((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    handleConnect(socket) {
        const communicationSocket = new BidirectionalSocket_1.BidirectionalSocket(socket);
        this.sockets.add(communicationSocket);
        communicationSocket.on("close", () => {
            this.sockets.delete(communicationSocket);
        });
        communicationSocket.on("request", (socket, packet) => this.emit("request", socket, packet));
        communicationSocket.on("error", error => this.emit("clientError", communicationSocket, error));
        this.emit("connect", communicationSocket);
    }
    handleListen() {
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map