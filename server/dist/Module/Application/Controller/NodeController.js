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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const common_1 = require("@nestjs/common");
const SoundServer_1 = require("../Service/Node/SoundServer");
const network_1 = require("@soundsystem/network");
let NodeController = class NodeController {
    constructor(service) {
        this.service = service;
    }
    async idle(id) {
        console.log("NodeController", "idle", id);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("idle");
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async mute(id) {
        console.log("NodeController", "mute", id);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("mute");
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async unmute(id) {
        console.log("NodeController", "unmute", id);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("unmute");
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async stream(id, update) {
        console.log("NodeController", "stream", id, update);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("stream", update.stream);
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async single(id, update) {
        console.log("NodeController", "single", id, update);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("single", update.stream);
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async listen(id, update) {
        console.log("NodeController", "listen", id, update);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("listen", update.server);
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    async volume(id, update) {
        console.log("NodeController", "volume", id, update);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("volume", update.volume);
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
    getNode(id) {
        const socket = this.service.getSocket(id);
        return {
            node: this.service.serializeSocket(socket),
        };
    }
    getNodes() {
        const sockets = this.service.getSockets();
        const nodes = {};
        for (const socket of sockets) {
            const data = this.service.serializeSocket(socket);
            nodes[data.id] = data;
        }
        return {
            nodes,
        };
    }
    async party(id, data) {
        const sockets = this.service.getSockets();
        const streamer = this.service.getSocket(id);
        const unmuteCommand = network_1.Command.create("unmute");
        const unmutePacket = unmuteCommand.toPacket();
        const streamCommand = network_1.Command.create("stream", data.stream);
        const streamPacket = streamCommand.toPacket();
        const listenCommand = network_1.Command.create("listen", streamer.getSocket().remoteAddress);
        const listenPacket = listenCommand.toPacket();
        await streamer.request(streamPacket);
        await streamer.request(unmutePacket);
        for await (const socket of sockets) {
            if (socket === streamer) {
                continue;
            }
            await socket.request(listenPacket);
            await socket.request(unmutePacket);
        }
        return {
            "success": true,
        };
    }
    async nodeUpdate() {
        console.log("NodeController", "nodeUpdate");
        const sockets = this.service.getSockets();
        const command = network_1.Command.create("update");
        const packet = command.toPacket();
        for await (const socket of sockets) {
            await socket.request(packet);
        }
        return { "success": true };
    }
    async update(id) {
        console.log("NodeController", "update", id);
        const socket = this.service.getSocket(id);
        const command = network_1.Command.create("update");
        const packet = command.toPacket();
        await socket.request(packet);
        return { "success": true };
    }
};
__decorate([
    common_1.Post("/node/:id/idle"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "idle", null);
__decorate([
    common_1.Post("/node/:id/mute"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "mute", null);
__decorate([
    common_1.Post("/node/:id/unmute"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "unmute", null);
__decorate([
    common_1.Post("/node/:id/stream"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "stream", null);
__decorate([
    common_1.Post("/node/:id/single"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "single", null);
__decorate([
    common_1.Post("/node/:id/listen"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "listen", null);
__decorate([
    common_1.Post("/node/:id/volume"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "volume", null);
__decorate([
    common_1.Get("/node/:id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NodeController.prototype, "getNode", null);
__decorate([
    common_1.Get("/node"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NodeController.prototype, "getNodes", null);
__decorate([
    common_1.Post("/node/:id/party"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "party", null);
__decorate([
    common_1.Get("/nodes/update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "nodeUpdate", null);
__decorate([
    common_1.Get("/node/:id/update"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NodeController.prototype, "update", null);
NodeController = __decorate([
    common_1.Controller({ scope: common_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [SoundServer_1.SoundServer])
], NodeController);
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map