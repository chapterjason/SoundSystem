import { Server } from "../src/Server/Server";
import { Client } from "../src/Client/Client";
import { BidirectionalSocket } from "../src/Common/BidirectionalSocket";
import { Command, Packet } from "@soundsystem/common";
import { CommandQueue } from "../src/Command/CommandQueue";
import { FooCommandController } from "./FooCommandController";
import { BarCommandController } from "./BarCommandController";

describe("Functional", () => {
    test("client request to server", done => {
        expect.assertions(10000);

        // Arrange
        const server = new Server();
        const client = new Client();
        const serverCommandQueue = new CommandQueue(server);
        const clientCommandQueue = new CommandQueue(client);

        serverCommandQueue.register(new FooCommandController());
        clientCommandQueue.register(new BarCommandController());

        server.listen({ port: 3200 });

        const command = Command.create("calculate", [1, 4]);

        client.on("connect", async () => {

            for (let i = 0; i < 10000; i++) {
                // Act
                const actual = await client.request(command.toPacket());

                // Assert
                expect(actual.getAs<number>()).toBe(5);
            }

            client.disconnect();
            await server.stop();

            done();
        });

        client.connect({
            port: 3200,
        });
    });

    test("server request to client", (done) => {
        expect.assertions(10000);

        // Arrange
        const server = new Server();
        const client = new Client();
        const serverCommandQueue = new CommandQueue(server);
        const clientCommandQueue = new CommandQueue(client);

        serverCommandQueue.register(new FooCommandController());
        clientCommandQueue.register(new BarCommandController());

        server.listen({ port: 3200 });

        const command = Command.create("name");

        server.on("connect", async (socket: BidirectionalSocket) => {
            for (let i = 0; i < 10000; i++) {
                // Act
                const actual = await socket.request(command.toPacket());

                // Assert
                expect(actual.getAs<string>()).toBe("FooBar");
            }

            client.disconnect();
            await server.stop();

            done();
        });

        client.connect({
            port: 3200,
        });
    });

});
