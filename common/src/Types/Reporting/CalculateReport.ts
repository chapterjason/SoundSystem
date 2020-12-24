import { ReportingPoint } from "./ReportingPoint";
import { Report } from "./Report";
import { ReportingPointType } from "./ReportingPointType";

export function calculateReport(points: ReportingPoint[]) {
    points.sort((a, b) => a.timestamp - b.timestamp);

    const requestSent = points.find(point => point.type === ReportingPointType.REQUEST_SENT);
    const requestReceived = points.find(point => point.type === ReportingPointType.REQUEST_RECEIVED);
    const responseSent = points.find(point => point.type === ReportingPointType.RESPONSE_SENT);
    const responseReceived = points.find(point => point.type === ReportingPointType.RESPONSE_RECEIVED);

    if (!requestSent || !requestReceived || !responseSent || !responseReceived) {
        throw new Error("Invalid reporting data.");
    }

    const report: Report = {
        id: requestSent.correlationId,
        request: requestReceived.timestamp - requestSent.timestamp,
        response: responseReceived.timestamp - responseSent.timestamp,
        order: [],
    };

    function getName(name: string) {
        let index = 0;
        for (const key of report.order) {
            if (key.startsWith(name)) {
                const keyIndex = parseInt(key.split(".")[1], 10);
                index = Math.max(keyIndex, index);
            }
        }

        return `${name}.${index + 1}`;
    }

    let latestPoint: ReportingPoint | null = null;
    for (const point of points) {
        if (point.type === ReportingPointType.FAILED) {
            if (latestPoint) {
                const name = getName("error");

                report[name] = point.timestamp - latestPoint?.timestamp;
                report.order.push(name);
            }
        }

        if (point.type === ReportingPointType.SERVICE_STARTED) {
            if (latestPoint) {
                const name = getName(`${point.data}-start`);

                report[name] = point.timestamp - latestPoint?.timestamp;
                report.order.push(name);
            }
        }

        if (point.type === ReportingPointType.SERVICE_STOPPED) {
            if (latestPoint) {
                const name = getName(`${point.data}-stop`);

                report[name] = point.timestamp - latestPoint?.timestamp;
                report.order.push(name);
            }
        }

        latestPoint = point;
    }

    return report;
}
