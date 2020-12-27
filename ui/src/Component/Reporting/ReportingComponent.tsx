import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportingLogic } from "./ReportingLogic";
import "./report.scss";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Report } from "common";

const colors: {
    [key: string]: string;
} = {};

let index: number = 60;

function getColor(key: string) {
    if (!(key in colors)) {
        colors[key] = `#B0B8${(index).toString(16)}`;
        index += 60;
    }

    return colors[key];
}

export function ReportingComponent() {
    const { reports, autoRefresh, updated, requestTime, timeout, selectedReport, selectedReportIndex } = useValues(ReportingLogic);
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

    const points = reports.map(report => report.points);

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
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey={"time"} fill={getColor("time")}/>
                    </BarChart>
                </Col>
            </Row>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
        </Container>
    );
}
