import { kea } from "kea";
import { NodeOverviewLogicType } from "./NodeOverviewLogicType";
import Axios from "axios";
import { SoundNodeResponseData } from "@soundsystem/common";

export const NodeOverviewLogic = kea<NodeOverviewLogicType>({
    actions: {
        setAutoRefresh: (autoRefresh) => ({ autoRefresh }),
        setNodes: (nodes) => ({ nodes }),
        setRequestTime: (requestTime: number) => ({ requestTime }),
        setTimeout: (timeout: number) => ({ timeout }),
        update: true,
        updateDone: true,
    },
    reducers: {
        autoRefresh: [true, {
            setAutoRefresh: (_, { autoRefresh }) => autoRefresh,
        }],
        nodes: [{}, {
            setNodes: (_, { nodes }) => ({ ...nodes }),
        }],
        updated: [false, {
            update: () => false,
            updateDone: () => true,
        }],
        requestTime: [0, {
            setRequestTime: (_, { requestTime }) => requestTime,
        }],
        timeout: [1000, {
            setTimeout: (_, { timeout }) => timeout,
        }],
    },
    listeners: ({ actions }) => ({
        update: async () => {
            const requestStartedAt = new Date().getTime();
            const response = await Axios.get<{ nodes: Record<string, SoundNodeResponseData> }>("/node");
            const responseReceivedAt = new Date().getTime();
            actions.setRequestTime(responseReceivedAt - requestStartedAt);
            actions.setNodes(response.data.nodes);
            actions.updateDone();
        },
    }),
    events: ({ actions, values }) => ({
        afterMount: [
            actions.update,
        ],
    }),
});
