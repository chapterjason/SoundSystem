import { ReportingPointType } from "./ReportingPointType";

export interface ReportingPoint {
    id: string;

    correlationId: string;

    nodeId: string;

    type: ReportingPointType;

    timestamp: number; // Date

    data: string;
}
