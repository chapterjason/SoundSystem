import { ReportingPoint } from "./ReportingPoint";

export interface Report {
    id: string;

    time: number;

    timestamp: Date;

    points: ReportingPoint[];
}
