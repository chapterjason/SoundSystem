import { kea } from "kea";
import { NodeOverviewLogicType } from "./NodeOverviewLogicType";
import Axios from "axios";
import { Node } from "../../Types";

export const NodeOverviewLogic = kea<NodeOverviewLogicType>({
    actions: {
        setAutoRefresh: (autoRefresh) => ({ autoRefresh }),
        setNodes: (nodes) => ({ nodes }),
        update: true,
    },
    reducers: {
        autoRefresh: [true, {
            setAutoRefresh: (_, { autoRefresh }) => autoRefresh,
        }],
        nodes: [{}, {
            setNodes: (_, { nodes }) => ({ ...nodes }),
        }],
    },
    listeners: ({ actions }) => ({
        update: async () => {
            const response = await Axios.get<{ nodes: Record<string, Node> }>("/node");
            actions.setNodes(response.data.nodes);
        },
    }),
    events: ({ actions, values }) => ({
        afterMount: [
            actions.update,
        ],
    }),
});
