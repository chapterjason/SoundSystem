import { Node } from "../Types";
import { Button, Col, Modal, Row } from "react-bootstrap";
import * as React from "react";
import { NodeLogic } from "./Node/NodeLogic";
import { useActions } from "kea";

export interface SetModeProps {
    id: string;

    node: Node;
}

export function SetMode(props: SetModeProps) {
    const logic = NodeLogic(props);
    const { setMode, hideSetMode, party } = useActions(logic);

    function handleAbort() {
        hideSetMode();
    }

    return (
        <Modal show={true} onHide={handleAbort}>
            <Modal.Header closeButton>
                <Modal.Title>Set Mode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <h6>Modus:</h6>
                    <Row className={"mb-3"}>
                        <Col>
                            <Button variant={"secondary"} block onClick={() => setMode("idle")}>
                                <span className={"fas fa-fw fa-times"}/>
                                {" "}
                                Idle
                            </Button>
                        </Col>
                    </Row>
                    <Row className={"mb-3"}>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setMode("stream")}>
                                <span className={"fas fa-fw fa-broadcast-tower"}/>
                                {" "}
                                Stream
                            </Button>
                        </Col>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setMode("single")}>
                                <span className={"far fa-fw fa-dot-circle"}/>
                                {" "}
                                Single
                            </Button>
                        </Col>
                    </Row>
                    <Row className={"mb-3"}>
                        <Col>
                            <Button variant={"warning"} block onClick={() => setMode("listen")}>
                                <span className={"fas fa-fw fa-satellite-dish"}/>
                                {" "}
                                Listen
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant={"danger"} block onClick={party}>
                                <span className={"fas fa-fw fa-glass-cheers"}/>
                                {" "}
                                Party
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleAbort}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
