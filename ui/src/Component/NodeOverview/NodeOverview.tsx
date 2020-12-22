import * as React from "react";
import { useEffect } from "react";
import { useActions, useValues } from "kea";
import { NodeOverviewLogic } from "./NodeOverviewLogic";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Node } from "../Node/Node";

export function NodeOverview() {
    const { nodes, autoRefresh, updated, requestTime, timeout } = useValues(NodeOverviewLogic);
    const { update } = useActions(NodeOverviewLogic);

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
                    <Table className={"border"} striped responsive>
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th>Mode</th>
                                <th>Stream/Server</th>
                                <th>Muted</th>
                                <th>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(nodes).map(id => {
                                return (
                                    <Node id={id} node={nodes[id]} key={id}/>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <strong>Debug infos:</strong>:
                    <Table>
                        <tbody>
                            <tr>
                                <td>Auto refresh</td>
                                <td>{autoRefresh}</td>
                            </tr>
                            <tr>
                                <td>Timeout</td>
                                <td>{timeout}</td>
                            </tr>
                            <tr>
                                <td>Request Time</td>
                                <td>{requestTime}</td>
                            </tr>
                            <tr>
                                <td>Timeout time</td>
                                <td>{requestTime >= timeout ? 0 : (timeout - requestTime)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <pre>
                        <code>{JSON.stringify(nodes, null, "  ")}</code>
                    </pre>
                </Col>
            </Row>
        </Container>
    );
}
