import { Packet } from "./Packet";

export interface ResponseHandler {
    (packet: Packet): void;
}
