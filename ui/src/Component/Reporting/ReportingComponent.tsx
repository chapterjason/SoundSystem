import * as React from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useActions, useValues } from "kea";
import { ReportingLogic } from "./ReportingLogic";
import "./report.scss";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const colors: {
    [key: string]: string;
} = {};

let index: number = 60;

function getColor(key: string) {
    if (!(key in colors)) {
        colors[key] = `#B0B8${(index).toString(16)}`;
        index += 40;
    }

    return colors[key];
}

export function ReportingComponent() {
    const { reports, autoRefresh, updated, requestTime, timeout } = useValues(ReportingLogic);
    const { update } = useActions(ReportingLogic);

    useEffect(() => {
        if (updated && autoRefresh) {
            const actualTimeout = requestTime >= timeout ? 0 : (timeout - requestTime);

            let timeoutId = setTimeout(() => {
                update();
            }, actualTimeout);

            return () => clearInterval(timeoutId);
        }
    }, [updated, autoRefresh]);

    const orders = reports.map(report => report.order);

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
                        <Bar dataKey="request" stackId="a" fill="#B0B8B4"/>
                        {orders.map((items: string[]) => {
                            return items.map(item => {
                                return (
                                    <Bar dataKey={item} stackId="a" fill={getColor(item)}/>
                                );
                            });
                        })}
                        <Bar dataKey="response" stackId="a" fill="#184A45"/>
                    </BarChart>
                </Col>
            </Row>
            <pre><code>{JSON.stringify(reports, null, "  ")}</code></pre>
        </Container>
    );
}
