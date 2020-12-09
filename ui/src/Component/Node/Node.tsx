import { Node as SoundNode } from "../../Types";
import * as React from "react";
import { useActions, useValues } from "kea";
import { NodeLogic } from "./NodeLogic";
import { SetMode } from "../SetMode";
import { SetStream } from "../SetStream";
import { SetServer } from "../SetServer";
import { Badge, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { NodeOverviewLogic } from "../NodeOverview/NodeOverviewLogic";

export interface NodeProps {
    id: string;

    node: SoundNode;
}

export function Node(props: NodeProps) {
    const { id, node } = props;
    const logic = NodeLogic(props);
    const { nodes } = useValues(NodeOverviewLogic);
    const { showSetMode, showSetServer, showSetStream, setVolume } = useActions(logic);
    const { volume, listenNode, showSetMode: setModeVisible, showSetStream: setStreamVisible, showSetServer: setServerVisible } = useValues(logic);
    const { server, mode, stream } = node;

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentTarget = event.currentTarget;

        if (currentTarget) {
            setVolume(parseInt(currentTarget.value, 10));
        }
    }

    const classes = [];

    if (mode === "idle") {
        classes.push("table-warning");
    }

    return (
        <tr className={classes.join(" ")}>
            <td>{node.hostname} <Badge variant={"secondary"}>{mode}</Badge></td>
            <td>
                <InputGroup size={"sm"}>
                    <InputGroup.Prepend>
                        <Button variant={"primary"} size={"sm"} onClick={showSetMode}>set Mode</Button>
                        {setModeVisible && <SetMode id={id} node={node}/>}
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                        <InputGroup.Text>{mode}</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            </td>
            <td>
                {mode !== "idle" && (
                    <InputGroup size={"sm"}>
                        <InputGroup.Prepend>
                            {mode === "listen" && (
                                <Button variant={"primary"} size={"sm"} onClick={showSetServer}>set Server</Button>
                            )}
                            {mode === "stream" && (
                                <Button variant={"primary"} size={"sm"} onClick={showSetStream}>set Stream</Button>
                            )}
                        </InputGroup.Prepend>
                        <InputGroup.Append>
                            <InputGroup.Text>
                                {mode === "stream" && stream}
                                {mode === "listen" && (listenNode?.hostname ?? "<unknown node>")}
                            </InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                )}
                {setStreamVisible && <SetStream id={id} node={node}/>}
                {setServerVisible && <SetServer id={id} node={node}/>}
            </td>
            <td>
                <Container fluid>
                    <Row>
                        <Col xs={12} md={"auto"} className={"text-center"}>
                            <div style={{ width: "50px" }}>
                                {volume}%
                            </div>
                        </Col>
                        <Col xs={12} md={true}>
                            <div style={{ minWidth: "150px" }}>
                                <Form.Control type="range" min={0} max={100} onChange={handleVolumeChange} value={volume} custom/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </td>
        </tr>
    );
}
