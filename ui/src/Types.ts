export type Mode = "stream" | "listen" | "single" | "idle";
export type Stream = "airplay" | "bluetooth";

export interface Node {
    id: string;

    hostname: string;

    mode: Mode;

    stream: Stream;

    server: string;

    volume: number;

    address: string;

    muted: boolean;
}

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

export interface Report {
    id: string;

    request: number;

    work: number

    response: number;
}
