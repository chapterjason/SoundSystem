import { Button, Col, Modal, Row } from "react-bootstrap";
import * as React from "react";
import { NodeComponentLogic } from "../Node/NodeComponentLogic";
import { useActions } from "kea";
import { SetModeProps } from "./SetModeProps";
import { Mode } from "@soundsystem/common";

export function SetMode(props: SetModeProps) {
    const logic = NodeComponentLogic(props);
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
                            <Button variant={"secondary"} block onClick={() => setMode(Mode.IDLE)}>
                                <span className={"fas fa-fw fa-times"}/>
                                {" "}
                                Idle
                            </Button>
                        </Col>
                    </Row>
                    <Row className={"mb-3"}>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setMode(Mode.STREAM)}>
                                <span className={"fas fa-fw fa-broadcast-tower"}/>
                                {" "}
                                Stream
                            </Button>
                        </Col>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setMode(Mode.SINGLE)}>
                                <span className={"far fa-fw fa-dot-circle"}/>
                                {" "}
                                Single
                            </Button>
                        </Col>
                    </Row>
                    <Row className={"mb-3"}>
                        <Col>
                            <Button variant={"warning"} block onClick={() => setMode(Mode.LISTEN)}>
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
