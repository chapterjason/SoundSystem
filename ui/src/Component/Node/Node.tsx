import { Node as SoundNode } from "../../Types";
import * as React from "react";
import { useActions, useValues } from "kea";
import { NodeLogic } from "./NodeLogic";
import { SetMode } from "../SetMode";
import { SetStream } from "../SetStream";
import { SetServer } from "../SetServer";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { NodeOverviewLogic } from "../NodeOverview/NodeOverviewLogic";
import classNames from "classnames";

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

    const tableRowClasses = classNames({
        "table-warning": mode === "idle",
    });

    const modeTextClasses = classNames({
        "text-success": mode === "stream",
        "text-info": mode === "listen",
    });

    return (
        <tr className={tableRowClasses}>
            <td>{node.hostname}</td>
            <td>
                <InputGroup size={"sm"}>
                    <InputGroup.Prepend>
                        <Button variant={"primary"} size={"sm"} onClick={showSetMode}>set Mode</Button>
                        {setModeVisible && <SetMode id={id} node={node}/>}
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                        <InputGroup.Text className={modeTextClasses}>{mode}</InputGroup.Text>
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
                            {(mode === "stream" || mode === "single") && (
                                <Button variant={"primary"} size={"sm"} onClick={showSetStream}>set Stream</Button>
                            )}
                        </InputGroup.Prepend>
                        <InputGroup.Append>
                            <InputGroup.Text>
                                {(mode === "stream" || mode === "single") && stream}
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
                            <div style={{ minWidth: "320px" }} className={"d-flex"}>
                                <span className={"fas fa-fw fa-volume-down"}/>
                                <Form.Control type="range" min={0} max={100} onChange={handleVolumeChange} value={volume} custom/>
                                <span className={"fas fa-fw fa-volume-up"}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </td>
        </tr>
    );
}
