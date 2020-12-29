import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportingLogic } from "./ReportingLogic";
import "./report.scss";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Report } from "@soundsystem/common";

const colors: {
    [key: string]: string;
} = {};

let index: number = 60;

function getColor(key: string) {
    if (!(key in colors)) {
        colors[key] = `#B0B8${(index).toString(16)}`;
        index += 80;
    }

    return colors[key];
}

export function ReportingComponent() {
    const { reports, points, autoRefresh, updated, requestTime, timeout, selectedReport, selectedReportIndex } = useValues(ReportingLogic);
    const { update, selectReport } = useActions(ReportingLogic);

    useEffect(() => {
        if (updated && autoRefresh) {
            const actualTimeout = requestTime >= timeout ? 0 : (timeout - requestTime);

            let timeoutId = setTimeout(() => {
                update();
            }, actualTimeout);

            return () => clearInterval(timeoutId);
        }
    }, [updated, autoRefresh]);

    function handleSelectReport(data: Report, index: number) {
        selectReport(index);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <BarChart
                        width={1200}
                        height={400}
                        data={reports}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="id"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="time" fill={getColor("time")} onClick={handleSelectReport}>
                            {
                                reports.map((report, index) => (
                                    <Cell cursor="pointer" fill={index === selectedReportIndex ? getColor("selected") : getColor("time")} key={`cell-${index}`}/>
                                ))
                            }
                        </Bar>
                    </BarChart>
                </Col>
            </Row>
            <Row>
                <Col>
                    <BarChart
                        width={1200}
                        height={400}
                        data={selectedReport ? selectedReport.points : []}
                        margin={{
                            top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="type"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey={"time"} fill={getColor("time")}/>
                    </BarChart>
                </Col>
            </Row>
            <h3>Reports:</h3>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
            <h3>Points:</h3>
            <pre><code>{JSON.stringify(points, null, "  ")}</code></pre>
        </Container>
    );
}
