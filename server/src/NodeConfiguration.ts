import { Mode, Stream } from "./Types";

export interface NodeConfiguration {
    id: string;

    hostname: string;

    mode: Mode;

    volume: number;

    stream: Stream;

    server: string;
}
