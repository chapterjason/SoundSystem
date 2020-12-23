import { kea } from "kea";
import { NodeComponentLogicType } from "./NodeComponentLogicType";
import Axios from "axios";
import { NodeOverviewLogic } from "../NodeOverview/NodeOverviewLogic";
import { NodeData, NodeResponseData } from "common";

export const NodeComponentLogic = kea<NodeComponentLogicType>({
    key: props => props.node.id,
    actions: {
        setMode: (mode) => ({ mode }),
        setServer: (server) => ({ server }),
        setStream: (stream) => ({ stream }),
        setVolume: (volume) => ({ volume }),
        setSavedVolume: (volume) => ({ volume }),
        setLoading: (loading) => ({ loading }),
        showSetStream: true,
        showSetServer: true,
        showSetMode: true,
        hideSetServer: true,
        hideSetStream: true,
        hideSetMode: true,
        afterSave: true,
        save: true,
        mute: true,
        unmute: true,
        party: true,
    },
    reducers: ({ props }) => ({
        loading: [false, {
            setLoading: (_, { loading }) => loading,
        }],
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
            setSavedVolume: (_, { volume }) => volume,
        }],
        savedVolume: [props.node.volume, {
            setSavedVolume: (_, { volume }) => volume,
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

            if (mode === "stream" || mode === "single") {
                actions.showSetStream();
            } else if (mode === "listen") {
                actions.showSetServer();
            } else if (mode === "idle") {
                actions.save();
            }
        },
        party: async () => {
            actions.hideSetMode();
            actions.showSetStream();
        },
        mute: async () => {
            actions.setLoading(true);
            await Axios.post("/node/" + props.id + "/mute");
            actions.setLoading(false);
        },
        unmute: async () => {
            actions.setLoading(true);
            await Axios.post("/node/" + props.id + "/unmute");
            actions.setLoading(false);
        },
        setVolume: async ({ volume }, breakpoint) => {
            await breakpoint(300);

            actions.setLoading(true);
            await Axios.post("/node/" + props.id + "/volume", { volume });
            actions.setLoading(false);
        },
        setStream: async () => {
            actions.hideSetStream();

            if (values.targetMode) {
                actions.save();
            } else {
                actions.setLoading(true);
                await Axios.post("/node/" + props.id + "/party", { stream: values.targetStream });
                actions.afterSave();
                actions.setLoading(false);
            }
        },
        setServer: () => {
            actions.hideSetServer();
            actions.save();
        },
        save: async () => {
            actions.setLoading(true);

            const { targetStream, targetServer } = values;
            let { targetMode } = values;

            console.log("save", { targetMode, targetStream, targetServer });

            if (!targetMode) {
                targetMode = props.node.mode;
            }

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
            actions.setLoading(false);
        },
    }),
    selectors: ({ props }) => ({
        listenNode: [
            () => [() => NodeOverviewLogic.values.nodes, () => props.node],
            (nodes: Record<string, NodeResponseData>, node: NodeResponseData) => Object.keys(nodes).map(id => {
                return nodes[id];
            }).find((item) => item.address === node.server) ?? null,
        ],
    }),
});
