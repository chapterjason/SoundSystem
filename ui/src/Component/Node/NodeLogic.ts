import { kea } from "kea";
import { NodeLogicType } from "./NodeLogicType";
import Axios from "axios";
import { NodeOverviewLogic } from "../NodeOverview/NodeOverviewLogic";
import { Node } from "../../Types";

export const NodeLogic = kea<NodeLogicType>({
    key: props => props.node.id,
    actions: {
        setMode: (mode) => ({ mode }),
        setServer: (server) => ({ server }),
        setStream: (stream) => ({ stream }),
        setVolume: (volume) => ({ volume }),
        showSetStream: true,
        showSetServer: true,
        showSetMode: true,
        hideSetServer: true,
        hideSetStream: true,
        hideSetMode: true,
        afterSave: true,
        save: true,
    },
    reducers: ({ props }) => ({
        showSetMode: [false, {
            showSetMode: () => true,
            hideSetMode: () => false,
        }],
        showSetServer: [false, {
            showSetServer: () => true,
            hideSetServer: () => false,
        }],
        showSetStream: [false, {
            showSetStream: () => true,
            hideSetStream: () => false,
        }],
        volume: [props.node.volume, {
            setVolume: (_, { volume }) => volume,
        }],
        targetMode: [null, {
            setMode: (_, { mode }) => mode,
            afterSave: () => null,
        }],
        targetServer: [null, {
            setServer: (_, { server }) => server,
            afterSave: () => null,
        }],
        targetStream: [null, {
            setStream: (_, { stream }) => stream,
            afterSave: () => null,
        }],
    }),
    listeners: ({ actions, props, values }) => ({
        setMode: ({ mode }) => {
            actions.hideSetMode();

            if (mode === "stream") {
                actions.showSetStream();
            } else if (mode === "listen") {
                actions.showSetServer();
            } else if (mode === "idle") {
                actions.save();
            }
        },
        setVolume: async ({ volume }, breakpoint) => {
            await breakpoint(200);

            await Axios.post("/node/" + props.id + "/volume", { volume });
        },
        setStream: () => {
            actions.hideSetStream();
            actions.save();
        },
        setServer: () => {
            actions.hideSetServer();
            actions.save();
        },
        save: async () => {
            const { targetMode, targetStream, targetServer } = values;

            console.log("save", { targetMode, targetStream, targetServer });

            if (targetMode === "stream") {
                if (targetStream) {
                    await Axios.post("/node/" + props.id + "/stream", { "stream": targetStream });
                }
            } else if (targetMode === "single") {
                if (targetStream) {
                    await Axios.post("/node/" + props.id + "/single", { "stream": targetStream });
                }
            } else if (targetMode === "listen") {
                if (targetServer) {
                    await Axios.post("/node/" + props.id + "/listen", { "server": targetServer });
                }
            } else if (targetMode === "idle") {
                await Axios.post("/node/" + props.id + "/idle");
            }

            NodeOverviewLogic.actions.update();

            actions.afterSave();
        },
    }),
    selectors: ({ props }) => ({
        listenNode: [
            () => [() => NodeOverviewLogic.values.nodes, () => props.node],
            (nodes: Record<string, Node>, node: Node) => Object.keys(nodes).map(id => {
                return nodes[id];
            }).find((item) => item.address === node.server) ?? null,
        ],
    }),
});
