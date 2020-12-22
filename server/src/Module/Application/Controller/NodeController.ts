import { Body, Controller, Get, NotFoundException, Param, Post, Scope } from "@nestjs/common";
import { Stream } from "../../../Types";
import { NodeService } from "../Service/Node/NodeService";

@Controller({ scope: Scope.REQUEST })
export class NodeController {

    private service: NodeService;

    public constructor(service: NodeService) {
        this.service = service;
    }

    @Post("/node/:id/idle")
    public async idle(@Param("id") id: string) {
        console.log("NodeController", "idle", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("idle");
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/mute")
    public async mute(@Param("id") id: string) {
        console.log("NodeController", "mute", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("mute");
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/unmute")
    public async unmute(@Param("id") id: string) {
        console.log("NodeController", "unmute", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("unmute");
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/stream")
    public async stream(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "stream", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("stream", Buffer.from(update.stream));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/single")
    public async single(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "single", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("single", Buffer.from(update.stream));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/listen")
    public async listen(@Param("id") id: string, @Body() update: { server: string }) {
        console.log("NodeController", "listen", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("listen", Buffer.from(update.server));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/volume")
    public async volume(@Param("id") id: string, @Body() update: { volume: number }) {
        console.log("NodeController", "volume", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("volume", Buffer.from(update.volume.toString()));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Get("/node/:id")
    public getNode(@Param("id") id: string) {
        const nodes = this.service.getNodes();

        if (!(id in nodes)) {
            throw new NotFoundException(`Not with id ${id} not found`);
        }

        return {
            node: nodes[id].toJSON(),
        };
    }

    @Get("/node")
    public getNodes() {
        const nodes = this.service.getNodes();
        const ids = Object.keys(nodes);
        const jsonNodes: Record<string, object> = {};

        for (const id of ids) {
            jsonNodes[id] = nodes[id].toJSON();
        }

        return {
            nodes: jsonNodes,
        };
    }

    @Post("/node/:id/party")
    public async party(@Param("id") id: string, @Body() data: { stream: Stream }) {
        const nodeRecords = this.service.getNodes();

        if (id in nodeRecords) {
            const streamer = nodeRecords[id];

            await streamer.request("stream", Buffer.from(data.stream));
            await streamer.request("unmute");

            const nodes = Object.values(nodeRecords).filter(node => node.getId() !== streamer.getId());

            for await (const node of nodes) {
                await node.request("listen", Buffer.from(streamer.getAddress()));
                await node.request("unmute");
            }

            return {
                "success": true,
                streamer: streamer.getId(),
                listeners: nodes.map(node => node.getId()),
            };
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }
    }

    @Get("/nodes/update")
    public async nodeUpdate() {
        console.log("NodeController", "nodeUpdate");
        const nodes = this.service.getNodes();
        const ids = Object.keys(nodes);

        for await (const id of ids) {
            const node = nodes[id];

            await node.request("update");
        }

        return { "success": true, nodes: ids };
    }

    @Get("/node/:id/update")
    public async update(@Param("id") id: string) {
        console.log("NodeController", "update", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            await node.request("update");
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

}
