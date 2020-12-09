import { MakeLogicType } from "kea";
import { Mode, Node, Stream } from "../../Types";

interface Values {
    showSetMode: boolean;

    showSetStream: boolean;

    showSetServer: boolean;

    targetMode: Mode | null;

    targetStream: Stream | null;

    targetServer: string | null;

    volume: number;

    listenNode: Node | null;
}

interface Actions {
    setMode: (mode: Mode) => { mode: Mode };

    setStream: (stream: Stream) => { stream: Stream };

    setServer: (server: string) => { server: string };

    setVolume: (volume: number) => { volume: number };

    showSetMode: () => void;

    hideSetMode: () => void;

    showSetStream: () => void;

    hideSetStream: () => void;

    showSetServer: () => void;

    hideSetServer: () => void;

    afterSave: () => void;

    save: () => void;
}

interface Props {
    id: string;

    node: Node;
}

export type NodeLogicType = MakeLogicType<Values, Actions, Props>
