import { MakeLogicType } from "kea";
import { Node } from "../../Types";

interface Values {
    nodes: Record<string, Node>;

    autoRefresh: boolean;
}

interface Actions {
    setNodes: (nodes: Record<string, Node>) => { nodes: Record<string, Node> }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    update: () => true;
}

interface Props {

}

export type NodeOverviewLogicType = MakeLogicType<Values, Actions, Props>
