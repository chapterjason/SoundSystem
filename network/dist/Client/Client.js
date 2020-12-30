"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const net_1 = require("net");
const BidirectionalSocket_1 = require("../Common/BidirectionalSocket");
class Client extends BidirectionalSocket_1.BidirectionalSocket {
    constructor() {
        super(new net_1.Socket({ allowHalfOpen: false }));
    }
    connect(options) {
        this.socket.connect(options, this.handleConnect.bind(this));
    }
    handleConnect() {
        this.socket.on("error", this.handleError.bind(this));
    }
    handleError(error) {
        this.emit("error", error);
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map