export type Mode = "stream" | "listen" | "single" | "idle" | "reset";
export type Stream = "airplay" | "bluetooth" | "reset";

export enum PacketType {
    REQUEST_SENT,
    REQUEST_RECEIVED,
    RESPONSE_SEND,
    RESPONSE_RECEIVED,
    FAILED
}

export interface PacketReport {
    id: string;

    correlationId: string;

    nodeId: string;

    type: PacketType;

    timestamp: number; // Date

    data: string;
}
