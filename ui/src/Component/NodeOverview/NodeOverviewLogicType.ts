import { MakeLogicType } from "kea";
import { SoundNodeResponseData } from "@soundsystem/common";

interface Values {
    nodes: Record<string, SoundNodeResponseData>;

    autoRefresh: boolean;

    updated: boolean;

    requestTime: number;

    timeout: number;
}

interface Actions {
    setNodes: (nodes: Record<string, SoundNodeResponseData>) => { nodes: Record<string, SoundNodeResponseData> }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    setRequestTime: (requestTime: number) => { requestTime: number };

    setTimeout: (timeout: number) => { timeout: number };

    update: () => true;

    updateDone: () => true;
}

interface Props {

}

export type NodeOverviewLogicType = MakeLogicType<Values, Actions, Props>
