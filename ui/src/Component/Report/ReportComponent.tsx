import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportLogic } from "./ReportLogic";
import "./report.scss";
import { HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import { PacketReport } from "../../Types";

export function ReportComponent() {
    const { reports, autoRefresh, updated, requestTime, timeout } = useValues(ReportLogic);
    const { update } = useActions(ReportLogic);

    useEffect(() => {
        if (updated && autoRefresh) {
            const actualTimeout = requestTime >= timeout ? 0 : (timeout - requestTime);

            let timeoutId = setTimeout(() => {
                update();
            }, actualTimeout);

            return () => clearInterval(timeoutId);
        }
    }, [updated, autoRefresh]);

    return (
        <Container>
            <Row>
                <Col>
                    <XYPlot
                        width={300}
                        height={300}
                        getX={(packet: PacketReport & { index: number }) => packet.index}
                        getY={(packet: PacketReport & { index: number }) => new Date(packet.timestamp)}>
                        <VerticalGridLines/>
                        <HorizontalGridLines/>
                        <XAxis/>
                        <YAxis/>
                        <VerticalBarSeries barWidth={20} data={reports.map((report, index) => report.packets.map(packet => ({ ...packet, index })))}/>
                    </XYPlot>
                </Col>
            </Row>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
        </Container>
    );
}
