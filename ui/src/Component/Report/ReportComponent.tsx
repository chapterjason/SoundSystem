import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportLogic } from "./ReportLogic";
import "./report.scss";
import { HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";

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
                    <XYPlot width={300} height={300} stackBy="y" xType="time">
                        <VerticalGridLines/>
                        <HorizontalGridLines/>
                        <XAxis/>
                        <YAxis/>
                        {reports.map(report => {
                            const data = [...report.packets]
                                .map((packet, index) => {
                                    return {
                                        x: new Date(packet.timestamp),
                                        y: index,
                                    };
                                }) as any;

                            return (
                                <VerticalBarSeries barWidth={20} data={data}/>
                            );
                        })}
                    </XYPlot>
                </Col>
            </Row>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
        </Container>
    );
}
