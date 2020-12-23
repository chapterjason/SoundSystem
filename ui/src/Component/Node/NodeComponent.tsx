import * as React from "react";
import { useEffect } from "react";
import { useActions, useValues } from "kea";
import { NodeComponentLogic } from "./NodeComponentLogic";
import { SetMode } from "../Dialog/SetMode";
import { SetStream } from "../Dialog/SetStream";
import { SetServer } from "../Dialog/SetServer";
import { Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import classNames from "classnames";
import { NodeComponentProps } from "./NodeComponentProps";

export function NodeComponent(props: NodeComponentProps) {
    const { id, node } = props;
    const logic = NodeComponentLogic(props);
    const { showSetMode, setSavedVolume, unmute, mute, showSetServer, showSetStream, setVolume } = useActions(logic);
    const { loading, savedVolume, volume, listenNode, showSetMode: setModeVisible, showSetStream: setStreamVisible, showSetServer: setServerVisible } = useValues(logic);
    const { mode, stream, muted, volume: nodeVolume } = node;

    useEffect(() => {
        if (savedVolume !== nodeVolume) {
            setSavedVolume(nodeVolume);
        }
    }, [nodeVolume]);

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentTarget = event.currentTarget;

        if (currentTarget) {
            setVolume(parseInt(currentTarget.value, 10));
        }
    }

    const tableRowClasses = classNames({
        "table-secondary": mode === "idle",
        "table-primary": mode === "stream" || mode === "single",
        "table-warning": mode === "listen",
    });

    return (
        <tr className={tableRowClasses}>
            <td>
                <Row noGutters>
                    <Col>
                        {node.hostname}
                    </Col>
                    <div style={{ width: "30px" }}>
                        {loading && " "}
                        {loading && (
                            <Spinner animation={"border"} size={"sm"} variant={"primary"}/>
                        )}
                    </div>
                </Row>
            </td>
            <td>
                <InputGroup size={"sm"}>
                    <InputGroup.Prepend>
                        <Button variant={"primary"} disabled={loading} size={"sm"} onClick={showSetMode}>set Mode</Button>
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
                                <Button variant={"primary"} disabled={loading} size={"sm"} onClick={showSetServer}>set Server</Button>
                            )}
                            {(mode === "stream" || mode === "single") && (
                                <Button variant={"primary"} disabled={loading} size={"sm"} onClick={showSetStream}>set Stream</Button>
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
                <div>
                    {muted ? (
                        <Button variant={"primary"} disabled={loading} size={"sm"} onClick={unmute}>
                            <span className={"fas fa-fw fa-volume-mute"}/>
                        </Button>
                    ) : (
                        <Button variant={"primary"} disabled={loading} size={"sm"} onClick={mute}>
                            <span className={"fas fa-fw fa-volume-up"}/>
                        </Button>
                    )}
                </div>
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
                            <div style={{ minWidth: "280px" }} className={"d-flex justify-content-center align-items-center"}>
                                <span className={"fas fa-fw fa-volume-down"}/>
                                <Form.Control disabled={loading} className={"ml-2 mr-2"} type="range" min={0} max={100} onChange={handleVolumeChange} value={volume} custom/>
                                <span className={"fas fa-fw fa-volume-up"}/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </td>
        </tr>
    );
}
