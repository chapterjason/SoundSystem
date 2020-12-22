import { MakeLogicType } from "kea";
import { Node } from "../../Types";

interface Values {
    nodes: Record<string, Node>;

    autoRefresh: boolean;

    updated: boolean;

    requestTime: number;
}

interface Actions {
    setNodes: (nodes: Record<string, Node>) => { nodes: Record<string, Node> }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    setRequestTime: (requestTime: number) => { requestTime: number };

    update: () => true;

    updateDone: () => true;
}

interface Props {

}

export type NodeOverviewLogicType = MakeLogicType<Values, Actions, Props>
