import { Body, Controller, Get, Param, Post, Scope } from "@nestjs/common";
import { Command, SoundNodeResponseData, Stream } from "@soundsystem/common";
import { SoundServer } from "../Service/Node/SoundServer";

@Controller({ scope: Scope.REQUEST })
export class NodeController {

    private service: SoundServer;

    public constructor(service: SoundServer) {
        this.service = service;
    }

    @Post("/node/:id/idle")
    public async idle(@Param("id") id: string) {
        console.log("NodeController", "idle", id);

        const socket = this.service.getSocket(id);
        const command = Command.create("idle");
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/mute")
    public async mute(@Param("id") id: string) {
        console.log("NodeController", "mute", id);

        const socket = this.service.getSocket(id);
        const command = Command.create("mute");
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/unmute")
    public async unmute(@Param("id") id: string) {
        console.log("NodeController", "unmute", id);

        const socket = this.service.getSocket(id);
        const command = Command.create("unmute");
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/stream")
    public async stream(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "stream", id, update);

        const socket = this.service.getSocket(id);
        const command = Command.create("stream", update.stream);
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/single")
    public async single(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "single", id, update);

        const socket = this.service.getSocket(id);
        const command = Command.create("single", update.stream);
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/listen")
    public async listen(@Param("id") id: string, @Body() update: { server: string }) {
        console.log("NodeController", "listen", id, update);

        const socket = this.service.getSocket(id);
        const command = Command.create("listen", update.server);
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Post("/node/:id/volume")
    public async volume(@Param("id") id: string, @Body() update: { volume: number }) {
        console.log("NodeController", "volume", id, update);

        const socket = this.service.getSocket(id);
        const command = Command.create("volume", update.volume);
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

    @Get("/node/:id")
    public getNode(@Param("id") id: string) {
        const socket = this.service.getSocket(id);

        return {
            node: this.service.serializeSocket(socket),
        };
    }

    @Get("/node")
    public getNodes() {
        const sockets = this.service.getSockets();
        const nodes: Record<string, SoundNodeResponseData> = {};

        for (const socket of sockets) {
            const data = this.service.serializeSocket(socket);

            nodes[data.id] = data;
        }

        return {
            nodes,
        };
    }

    @Post("/node/:id/party")
    public async party(@Param("id") id: string, @Body() data: { stream: Stream }) {
        const sockets = this.service.getSockets();

        const streamer = this.service.getSocket(id);

        const unmuteCommand = Command.create("unmute");
        const unmutePacket = unmuteCommand.toPacket();

        const streamCommand = Command.create("stream", data.stream);
        const streamPacket = streamCommand.toPacket();

        const listenCommand = Command.create("listen", streamer.getSocket().remoteAddress);
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

    @Get("/nodes/update")
    public async nodeUpdate() {
        console.log("NodeController", "nodeUpdate");
        const sockets = this.service.getSockets();

        const command = Command.create("update");
        const packet = command.toPacket();

        for await (const socket of sockets) {
            await socket.request(packet);
        }

        return { "success": true };
    }

    @Get("/node/:id/update")
    public async update(@Param("id") id: string) {
        console.log("NodeController", "update", id);

        const socket = this.service.getSocket(id);
        const command = Command.create("update");
        const packet = command.toPacket();

        await socket.request(packet);

        return { "success": true };
    }

}
