import { ReportingPoint } from "./Types/ReportingPoint";
import { Report } from "./Types/Report";
import { calculateReport } from "./CalculateReport";

export function calculateReports(points: ReportingPoint[]): Report[] {
    const groupedPoints = points.reduce((previous, current) => {
        return {
            ...previous,
            [current.correlationId]: [
                ...previous[current.correlationId],
                current,
            ],
        };
    }, {} as { [id: string]: ReportingPoint[] });

    const ids = Object.keys(groupedPoints);
    const reports: Report[] = [];

    for (const id of ids) {
        const group = groupedPoints[id];
        const report = calculateReport(group);

        reports.push(report);
    }

    return reports;
}
