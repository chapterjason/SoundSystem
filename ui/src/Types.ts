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
