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

                for (const packet of packets) {
                    const report = reports.find(report => report.id === packet.correlationId);

                    if (!report) {
                        reports.push({
                            id: packet.correlationId,
                            packets: [packet],
                        });

                        continue;
                    }

                    report.packets.push(packet);
                    report.packets.sort((a, b) => a.timestamp - b.timestamp);
                }

                return reports;
            },
        ],
    },
});
