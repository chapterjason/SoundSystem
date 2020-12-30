"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundServer = void 0;
const common_1 = require("@nestjs/common");
const Meta_1 = require("../../../../Meta");
const network_1 = require("@soundsystem/network");
const SoundServerController_1 = require("./Controller/SoundServerController");
const DEFAULT_SERVICE_PORT = 3200;
const SERVICE_PORT = Meta_1.ENVIRONMENT.has("SERVICE_PORT") ? parseInt(Meta_1.ENVIRONMENT.get("SERVICE_PORT"), 10) : DEFAULT_SERVICE_PORT;
Meta_1.ENVIRONMENT.set("SERVICE_PORT", SERVICE_PORT.toString());
let SoundServer = class SoundServer extends network_1.Server {
    constructor() {
        super();
        this.queue = new network_1.CommandQueue(this);
        this.logger = new common_1.Logger("SoundServer");
        this.queue.register(new SoundServerController_1.SoundServerController());
        this.on("connect", this.handleClientConnect.bind(this));
        this.listen({ port: SERVICE_PORT, host: "0.0.0.0" });
    }
    getSockets() {
        return Array.from(this.sockets.values());
    }
    serializeSocket(socket) {
        const data = socket.getUserData();
        if (!data) {
            throw new common_1.InternalServerErrorException(`Can not serialize unknown node.`);
        }
        return {
            ...data,
            address: socket.getSocket().remoteAddress?.toString() ?? "unknown-ip",
        };
    }
    getSocket(id) {
        for (const socket of this.sockets) {
            const data = socket.getUserData();
            if (data) {
                if (data.id === id) {
                    return socket;
                }
            }
        }
        throw new common_1.NotFoundException(`Node ${id} not found.`);
    }
    handleListen() {
        this.logger.log("Service listen to: " + Meta_1.ENVIRONMENT.get("APP_IP") + ":" + SERVICE_PORT);
    }
    handleClientConnect(socket) {
        this.logger.log(`Connected unknown`);
        socket.on("close", this.handleClientDisconnect.bind(this));
    }
    handleClientDisconnect(socket) {
        this.logger.log(`Disconnected ${socket.getUserData()?.hostname ?? "unknown"}`);
    }
};
SoundServer = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], SoundServer);
exports.SoundServer = SoundServer;
//# sourceMappingURL=SoundServer.js.map