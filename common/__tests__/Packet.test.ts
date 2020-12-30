import { Packet } from "@soundsystem/network/dist/Common/Packet";
import { validate } from "uuid";
import { Buffer } from "buffer";

describe("Packet", () => {

    describe("create", () => {
        it("should return a valid instance of Packet", () => {
            // Arrange
            const data = Buffer.from("foo");

            // Act
            const actual = Packet.create(data);

            // Assert
            const now = Date.now();

            expect(actual).toBeInstanceOf(Packet);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getTimestamp()).toBe(now);
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getBuffer().toString()).toBe("foo");
        });
    });

    describe("fromBuffer", () => {
        it("should return and valid instance of Packet from buffer", () => {
            // Arrange
            const data = Buffer.from("foo");
            const packet = new Packet("c4ee3ca0-e87d-428c-95c9-5c51580bd291", 1609108512760, data);
            const buffer = packet.toBuffer();

            // Act
            const actual = Packet.fromBuffer(buffer);

            // Assert
            expect(actual).toBeInstanceOf(Packet);
            expect(validate(actual.getId())).toBeTruthy();
            expect(actual.getBuffer()).toBeInstanceOf(Buffer);
            expect(actual.getId()).toBe("c4ee3ca0-e87d-428c-95c9-5c51580bd291");
            expect(actual.getTimestamp()).toBe(1609108512760);
            expect(actual.getBuffer().toString()).toBe("foo");
        });
    });

    describe("toBuffer", () => {
        it("should create valid buffer instance from Packet", () => {
            // Arrange
            const data = Buffer.from("foo");
            const packet = new Packet("c4ee3ca0-e87d-428c-95c9-5c51580bd291", 1609108512760, data);

            // Act
            const actual = packet.toBuffer();

            // Assert
            expect(actual).toBeInstanceOf(Buffer);
            expect(actual.toString("base64")).toBe("ZXlKcFpDSTZJbU0wWldVelkyRXdMV1U0TjJRdE5ESTRZeTA1TldNNUxUVmpOVEUxT0RCaVpESTVNU0lzSW5ScGJXVnpkR0Z0Y0NJNk1UWXdPVEV3T0RVeE1qYzJNQ3dpWkdGMFlTSTZJbHB0T1hZaWZRPT0=");
        });
    });

});
