import { MakeLogicType } from "kea";
import { Report, ReportingPoint } from "common";

interface Values {
    points: ReportingPoint[];

    reports: Report[];

    selectedReportIndex: number;

    selectedReport: Report;

    autoRefresh: boolean;

    updated: boolean;

    requestTime: number;

    timeout: number;
}

interface Actions {
    setPoints: (points: ReportingPoint[]) => { points: ReportingPoint[] }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    setRequestTime: (requestTime: number) => { requestTime: number };

    setTimeout: (timeout: number) => { timeout: number };

    selectReport: (index: number) => { index: number };

    update: () => true;

    updateDone: () => true;
}

interface Props {

}

export type ReportingLogicType = MakeLogicType<Values, Actions, Props>
