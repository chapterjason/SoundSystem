import { Mode, Stream } from "@soundsystem/common";

export interface ConfigurationData {
    mode: Mode;

    stream: Stream;

    server: string;

    volume: number;

    muted: boolean;

}
