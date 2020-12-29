import { Packet } from "@soundsystem/common";

export interface ResponseHandler {
    (packet: Packet): void;
}
