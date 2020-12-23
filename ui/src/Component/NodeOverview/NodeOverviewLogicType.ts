import { MakeLogicType } from "kea";
import { NodeResponseData } from "common";

interface Values {
    nodes: Record<string, NodeResponseData>;

    autoRefresh: boolean;

    updated: boolean;

    requestTime: number;

    timeout: number;
}

interface Actions {
    setNodes: (nodes: Record<string, NodeResponseData>) => { nodes: Record<string, NodeResponseData> }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    setRequestTime: (requestTime: number) => { requestTime: number };

    setTimeout: (timeout: number) => { timeout: number };

    update: () => true;

    updateDone: () => true;
}

interface Props {

}

export type NodeOverviewLogicType = MakeLogicType<Values, Actions, Props>
