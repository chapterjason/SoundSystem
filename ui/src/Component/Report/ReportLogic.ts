import { kea } from "kea";
import { ReportLogicType } from "./ReportLogicType";
import Axios from "axios";
import { PacketReport, Report } from "../../Types";

export const ReportLogic = kea<ReportLogicType>({
    actions: {
        setAutoRefresh: (autoRefresh) => ({ autoRefresh }),
        setPackets: (packets) => ({ packets }),
        setRequestTime: (requestTime: number) => ({ requestTime }),
        setTimeout: (timeout: number) => ({ timeout }),
        update: true,
        updateDone: true,
    },
    reducers: {
        autoRefresh: [false, {
            setAutoRefresh: (_, { autoRefresh }) => autoRefresh,
        }],
        packets: [[], {
            setPackets: (_, { packets }) => [...packets],
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
            const response = await Axios.get<{ reports: PacketReport[] }>("/report");
            const responseReceivedAt = new Date().getTime();
            actions.setRequestTime(responseReceivedAt - requestStartedAt);
            actions.setPackets(response.data.reports);
            actions.updateDone();
        },
    }),
    events: ({ actions, values }) => ({
        afterMount: [
            actions.update,
        ],
    }),
    selectors: {
        reports: [
            (selectors) => [selectors.packets],
            (packets: PacketReport[]) => {
                const reports: Report[] = [];

                const grouped = packets.reduce((previous, next) => {
                    return {
                        ...previous,
                        ...{
                            [next.correlationId]: [
                                ...(previous[next.correlationId] ?? []),
                                next,
                            ].sort((a, b) => a.timestamp - b.timestamp),
                        },
                    };
                }, {} as Record<string, PacketReport[]>);

                const keys = Object.keys(grouped);

                for (const key of keys) {
                    const [requestSent, requestReceived, responseSent, responseReceived] = grouped[key];

                    reports.push({
                        id: key,
                        request: requestReceived.timestamp - requestSent.timestamp,
                        work: responseSent.timestamp - requestReceived.timestamp,
                        response: responseReceived.timestamp - responseSent.timestamp,
                    });
                }

                return reports;
            },
        ],
    },
});
