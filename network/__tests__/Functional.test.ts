import { Server } from "../src/Server/Server";
import { Client } from "../src/Client/Client";
import { CommandController } from "../src/Command/CommandController";
import { BidirectionalSocket } from "../src/Common/BidirectionalSocket";
import { Command, Packet } from "common";
import { CommandQueue } from "../src/Command/CommandQueue";

export class FooCommandController extends CommandController {

    constructor() {
        super();

        this.set("calculate", this.calculate);
    }

    public async calculate(data: [number, number], command: Command, socket: BidirectionalSocket): Promise<number> {
        const [a, b] = data;

        return a + b;
    }

}

export class BarCommandController extends CommandController {

    public constructor() {
        super();
        this.set("name", this.getName);
    }

    public async getName(data: string, command: Command): Promise<string> {
        return "FooBar";
    }

}

describe("Functional", () => {

    test("client request to server", done => {
        // Arrange
        const server = new Server();
        const client = new Client();
        const serverCommandQueue = new CommandQueue(server);
        const clientCommandQueue = new CommandQueue(client);

        serverCommandQueue.register(new FooCommandController());
        clientCommandQueue.register(new BarCommandController());

        server.listen({ port: 3200 });

        client.on("connect", async () => {
            // Act
            const command = Command.create("calculate", [1, 4]);
            const actual = await client.request(command.toPacket());

            // Assert
            expect(actual).toBeInstanceOf(Packet);
            expect(actual.getAs<number>()).toBe(5);

            client.disconnect();
            await server.stop();

            done();
        });

        client.connect({
            port: 3200,
        });
    });

    test("server request to client", (done) => {
        // Arrange
        const server = new Server();
        const client = new Client();
        const serverCommandQueue = new CommandQueue(server);
        const clientCommandQueue = new CommandQueue(client);

        serverCommandQueue.register(new FooCommandController());
        clientCommandQueue.register(new BarCommandController());

        server.listen({ port: 3200 });

        server.on("connect", async (socket: BidirectionalSocket) => {
            // Act
            const command = Command.create("name");
            const actual = await socket.request(command.toPacket());

            // Assert
            expect(actual).toBeInstanceOf(Packet);
            expect(actual.getAs<string>()).toBe("FooBar");

            client.disconnect();
            await server.stop();

            done();
        });

        client.connect({
            port: 3200,
        });
    });

});
