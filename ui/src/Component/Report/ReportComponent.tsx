import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportLogic } from "./ReportLogic";
import "./report.scss";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

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
                    <BarChart
                        width={1200}
                        height={400}
                        data={reports}
                        margin={{
                            top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="id"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="request" stackId="a" fill="#8884d8"/>
                        <Bar dataKey="work" stackId="a" fill="#82ca9d"/>
                        <Bar dataKey="respone" stackId="a" fill="#82ca9d"/>
                    </BarChart>
                </Col>
            </Row>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
        </Container>
    );
}
