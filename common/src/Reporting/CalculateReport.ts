import { ReportingPoint } from "./Types/ReportingPoint";
import { Report } from "./Types/Report";

export function calculateReport(points: ReportingPoint[]): Report {
    points.sort((a, b) => a.timestamp - b.timestamp);

    const first = points[0];
    const last = points[points.length - 1];

    const report: Report = {
        id: first.correlationId,
        time: last.timestamp - first.timestamp,
        timestamp: new Date(last.timestamp),
        points: [],
    };

    function getType(type: string) {
        let index = 0;
        for (const point of report.points) {
            if (point.type.startsWith(type)) {
                const keyIndex = parseInt(point.type.split(".")[1], 10);
                index = Math.max(keyIndex, index);
            }
        }

        return `${type}.${index + 1}`;
    }

    for (const point of points) {
        const type = getType(point.type);

        report.points.push({
            ...point,
            type,
        });
    }

    return report;
}
