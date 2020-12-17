import { Body, Controller, Get, NotFoundException, Param, Post, Scope } from "@nestjs/common";
import { Stream } from "../../../Types";
import { NodeService } from "../Service/NodeService";

@Controller({ scope: Scope.REQUEST })
export class NodeController {

    private service: NodeService;

    public constructor(service: NodeService) {
        this.service = service;
    }

    @Post("/node/:id/idle")
    public idle(@Param("id") id: string) {
        console.log("NodeController", "idle", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:idle:true"));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/stream")
    public stream(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "stream", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:stream:" + update.stream));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/single")
    public single(@Param("id") id: string, @Body() update: { stream: Stream }) {
        console.log("NodeController", "single", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:single:" + update.stream));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/listen")
    public listen(@Param("id") id: string, @Body() update: { server: string }) {
        console.log("NodeController", "listen", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:listen:" + update.server));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Post("/node/:id/volume")
    public volume(@Param("id") id: string, @Body() update: { volume: number }) {
        console.log("NodeController", "volume", id, update);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:volume:" + update.volume));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
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

    @Get("/node/:id/update")
    public update(@Param("id") id: string) {
        console.log("NodeController", "update", id);

        const nodes = this.service.getNodes();

        if (id in nodes) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:update:"));
        } else {
            throw new NotFoundException(`Node ${id} not found.`);
        }

        return { "success": true };
    }

    @Get("/nodeUpdate")
    public nodeUpdate() {
        console.log("NodeController", "nodeUpdate");
        const nodes = this.service.getNodes();
        const ids = Object.keys(nodes);

        for (const id of ids) {
            const node = nodes[id];

            node.getSocket().write(Buffer.from("command:update:"));
        }

        return {
            "status": "Update dispatched.",
        };
    }

}
