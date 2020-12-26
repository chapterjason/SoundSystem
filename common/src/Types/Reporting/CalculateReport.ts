import { ReportingPoint } from "./ReportingPoint";
import { Report } from "./Report";
import { ReportingPointType } from "./ReportingPointType";
import { NetworkCommand } from "../../Network/NetworkCommand";
import { Buffer } from "buffer";

export function calculateReport(points: ReportingPoint[]) {
    points.sort((a, b) => a.timestamp - b.timestamp);

    const first = points[0];
    const last = points[points.length - 1];

    const networkCommand = NetworkCommand.parse(Buffer.from(first.data));

    const report: Report = {
        id: networkCommand.getCommand(),
        time: last.timestamp - first.timestamp,
        timestamp: new Date(last.timestamp),
        points: [],
    };

    function getName(name: string) {
        let index = 0;
        const keys = Object.keys(report.points);
        for (const key of keys) {
            if (key.startsWith(name)) {
                const keyIndex = parseInt(key.split(".")[1], 10);
                index = Math.max(keyIndex, index);
            }
        }

        return `${name}.${index + 1}`;
    }

    let latestPoint: ReportingPoint | null = null;
    for (const point of points) {
        if (point.type === ReportingPointType.REQUEST_RECEIVED) {
            if (latestPoint) {
                const name = getName("request");
                report.points.push({
                    name,
                    time: point.timestamp - latestPoint?.timestamp,
                });
            }
        }

        if (point.type === ReportingPointType.RESPONSE_RECEIVED) {
            if (latestPoint) {
                const name = getName("response");
                report.points.push({
                    name,
                    time: point.timestamp - latestPoint?.timestamp,
                });
            }
        }

        if (point.type === ReportingPointType.FAILED) {
            if (latestPoint) {
                const name = getName("error");
                report.points.push({
                    name,
                    time: point.timestamp - latestPoint?.timestamp,
                });
            }
        }

        if (point.type === ReportingPointType.SERVICE_STARTED) {
            if (latestPoint) {
                const name = getName(`${point.data}-start`);
                report.points.push({
                    name,
                    time: point.timestamp - latestPoint?.timestamp,
                });
            }
        }

        if (point.type === ReportingPointType.SERVICE_STOPPED) {
            if (latestPoint) {
                const name = getName(`${point.data}-stop`);
                report.points.push({
                    name,
                    time: point.timestamp - latestPoint?.timestamp,
                });
            }
        }

        latestPoint = point;
    }

    return report;
}
