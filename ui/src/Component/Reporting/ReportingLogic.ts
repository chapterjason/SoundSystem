import { kea } from "kea";
import { ReportingLogicType } from "./ReportingLogicType";
import Axios from "axios";
import { calculateReports, Report, ReportingPoint } from "@soundsystem/common";

export const ReportingLogic = kea<ReportingLogicType>({
    actions: {
        setAutoRefresh: (autoRefresh) => ({ autoRefresh }),
        setPoints: (points) => ({ points }),
        setRequestTime: (requestTime: number) => ({ requestTime }),
        setTimeout: (timeout: number) => ({ timeout }),
        selectReport: (index: number) => ({ index }),
        update: true,
        updateDone: true,
    },
    reducers: {
        autoRefresh: [false, {
            setAutoRefresh: (_, { autoRefresh }) => autoRefresh,
        }],
        points: [[], {
            setPoints: (_, { points }) => [...points],
        }],
        selectedReportIndex: [-1, {
            selectReport: (_, { index }) => index,
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
            const response = await Axios.get<{ points: ReportingPoint[] }>("/reporting");
            const responseReceivedAt = new Date().getTime();
            actions.setRequestTime(responseReceivedAt - requestStartedAt);
            actions.setPoints(response.data.points);
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
            (selectors) => [selectors.points],
            (points: ReportingPoint[]) => {
                return calculateReports(points);
            },
        ],
        selectedReport: [
            (selectors) => [selectors.reports, selectors.selectedReportIndex],
            (reports: Report[], index: number) => reports[index],
        ],
    },
});
