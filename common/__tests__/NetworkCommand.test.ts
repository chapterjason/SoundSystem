import { NetworkCommand } from "../src";
import { validate } from "uuid";
import { Buffer } from "buffer";

describe("NetworkCommand", () => {

    describe("fromString", () => {
        it("should recreate instance from string", () => {
            // Arrange
            const data = (new NetworkCommand("foo", "bar", "baz")).toString();

            // Act
            const actual = NetworkCommand.fromString(data);

            // Assert
            expect(actual).toBeInstanceOf(NetworkCommand);
            expect(actual.getId()).toBe("foo");
            expect(actual.getCommand()).toBe("bar");
            expect(actual.getData()).toBe("baz");
        });
    });

    describe("fromBuffer", () => {
        it("should recreate instance from buffer", () => {
            // Arrange
            const data = (new NetworkCommand("foo", "bar", "baz")).toBuffer();

            // Act
            const actual = NetworkCommand.fromBuffer(data);

            // Assert
            expect(actual).toBeInstanceOf(NetworkCommand);
            expect(actual.getId()).toBe("foo");
            expect(actual.getCommand()).toBe("bar");
            expect(actual.getData()).toBe("baz");
        });
    });

    describe("create", () => {
        it("should create instance with data", () => {
            // Arrange

            // Act
            const actual = NetworkCommand.create("foo", "bar");

            // Assert
            expect(actual).toBeInstanceOf(NetworkCommand);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getCommand()).toBe("foo");
            expect(actual.getData()).toBe("bar");
        });

        it("should create instance without data", () => {
            // Arrange

            // Act
            const actual = NetworkCommand.create("foo");

            // Assert
            expect(actual).toBeInstanceOf(NetworkCommand);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getCommand()).toBe("foo");
            expect(actual.getData()).toBe("");
        });
    });

    describe("toBuffer", () => {
        it("should return buffer", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", "baz"));

            // Act
            const actual = networkCommand.toBuffer();

            // Assert
            expect(actual).toBeInstanceOf(Buffer);
            expect(actual.toString()).toBe("Wm05dkBZbUZ5QFltRjY=");
        });
    });

    describe("toString", () => {
        it("should return string", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", "baz"));

            // Act
            const actual = networkCommand.toString();

            // Assert
            expect(actual).toBe("Wm05dkBZbUZ5QFltRjY=");
        });
    });
    describe("getData", () => {
        it("should return data set in constructor", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", "baz"));

            // Act
            const actual = networkCommand.getData();

            // Assert
            expect(actual).toBe("baz");
        });
    });
    describe("getDataAs", () => {
        it("should return data set in constructor as object", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", JSON.stringify({ foo: "bar" })));

            // Act
            const actual = networkCommand.getDataAs();

            // Assert
            expect(actual).toEqual({ foo: "bar" });
        });
    });
    describe("getCommand", () => {
        it("should return command set in constructor", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", "baz"));

            // Act
            const actual = networkCommand.getCommand();

            // Assert
            expect(actual).toBe("bar");
        });
    });
    describe("getId", () => {
        it("should return id set in constructor", () => {
            // Arrange
            const networkCommand = (new NetworkCommand("foo", "bar", "baz"));

            // Act
            const actual = networkCommand.getId();

            // Assert
            expect(actual).toBe("foo");
        });
    });

});
