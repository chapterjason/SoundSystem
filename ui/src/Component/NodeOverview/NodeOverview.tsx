import * as React from "react";
import { useEffect } from "react";
import { useActions, useValues } from "kea";
import { NodeOverviewLogic } from "./NodeOverviewLogic";
import { Node } from "../Node/Node";
import { Table } from "react-bootstrap";

export function NodeOverview() {
    const { nodes, autoRefresh } = useValues(NodeOverviewLogic);
    const { update } = useActions(NodeOverviewLogic);

    useEffect(() => {
        if (autoRefresh) {
            const intervalId = setInterval(() => {
                update();
            }, 500);
            return () => clearInterval(intervalId);
        }
    }, [autoRefresh]);

    return (
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
    );
}
