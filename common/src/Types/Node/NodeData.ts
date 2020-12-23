import { Mode } from "./Mode";
import { Stream } from "./Stream";

export interface NodeData {
    id: string;

    hostname: string;

    mode: Mode;

    stream: Stream;

    server: string;

    volume: number;

    muted: boolean;
}
