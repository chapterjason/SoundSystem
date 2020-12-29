import { MakeLogicType } from "kea";
import { Mode, SoundNodeResponseData, Stream } from "@soundsystem/common";

interface Values {
    showSetMode: boolean;

    showSetStream: boolean;

    showSetServer: boolean;

    loading: boolean;

    targetMode: Mode | null;

    targetStream: Stream | null;

    targetServer: string | null;

    volume: number;

    savedVolume: number;

    listenNode: SoundNodeResponseData | null;
}

interface Actions {
    setMode: (mode: Mode) => { mode: Mode };

    setStream: (stream: Stream) => { stream: Stream };

    setServer: (server: string) => { server: string };

    setVolume: (volume: number) => { volume: number };

    setSavedVolume: (volume: number) => { volume: number };

    setLoading: (loading: boolean) => { loading: boolean };

    party: () => void;

    mute: () => void;

    unmute: () => void;

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

    node: SoundNodeResponseData;
}

export type NodeComponentLogicType = MakeLogicType<Values, Actions, Props>
