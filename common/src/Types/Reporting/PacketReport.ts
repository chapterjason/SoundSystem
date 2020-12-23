import { PacketType } from "./PacketType";

export interface PacketReport {
    id: string;

    correlationId: string;

    nodeId: string;

    type: PacketType;

    timestamp: number; // Date

    data: string;
}
