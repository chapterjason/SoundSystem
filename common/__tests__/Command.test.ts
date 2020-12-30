import { Command } from "@soundsystem/network/dist/Command/Command";
import { validate } from "uuid";
import { Buffer } from "buffer";
import { Packet } from "@soundsystem/network/dist/Common/Packet";

describe("Command", () => {

    describe("create", () => {
        it("should return a valid Command instance", () => {
            // Arrange
            const commandName = "foo";
            const data = Buffer.from("bar");

            // Act
            const actual = Command.create(commandName, data);

            // Assert
            const now = Date.now();

            expect(actual).toBeInstanceOf(Command);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getTimestamp()).toBe(now);
            expect(actual.getCommandName()).toBe("foo");
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getBuffer().toString()).toBe("bar");
        });
    });

    describe("fromPacket", () => {
        it("should recreate command from packet", () => {
            // Arrange
            const data = Buffer.from("bar");
            const buffer = Buffer.from(JSON.stringify({ command: "foo", data }));
            const packet = new Packet("c4ee3ca0-e87d-428c-95c9-5c51580bd291", 1609108512760, buffer);

            // Act
            const actual = Command.fromPacket(packet);

            // Assert
            expect(actual).toBeInstanceOf(Command);
            expect(actual.getId()).toBe("c4ee3ca0-e87d-428c-95c9-5c51580bd291");
            expect(actual.getTimestamp()).toBe(1609108512760);
            expect(actual.getCommandName()).toBe("foo");
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getBuffer().toString()).toBe("bar");
        });
    });

    describe("toPacket", () => {
        it("should return packet", () => {
            // Arrange
            const data = Buffer.from("bar");
            const command = new Command("c4ee3ca0-e87d-428c-95c9-5c51580bd291", 1609108512760, "foo", data);

            // Act
            const actual = command.toPacket();

            // Assert
            expect(actual).toBeInstanceOf(Packet);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getId()).toBe("c4ee3ca0-e87d-428c-95c9-5c51580bd291");
            expect(actual.getTimestamp()).toBe(1609108512760);
            expect(actual.getBuffer().toString()).toBe("{\"command\":\"foo\",\"data\":\"YmFy\"}");
        });
    });

    describe("createResponse", () => {
        it("should return response packet", () => {
            // Arrange
            const data = Buffer.from("bar");
            const command = new Command("c4ee3ca0-e87d-428c-95c9-5c51580bd291", 1609108512760, "foo", data);
            const responseData = Buffer.from("baz");

            // Act
            const actual = command.createResponse(responseData);

            // Assert
            const now = Date.now();

            expect(actual).toBeInstanceOf(Packet);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getId()).toBe("c4ee3ca0-e87d-428c-95c9-5c51580bd291");
            expect(actual.getTimestamp()).toBe(now);
            expect(actual.getBuffer().toString()).toBe("baz");
        });
    });

});
