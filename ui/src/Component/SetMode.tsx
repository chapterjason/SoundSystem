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
    const { setMode, hideSetMode } = useActions(logic);

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
                    <Row>
                        <Col>
                            <span className={"fas fa-fw fa-times"}/>
                            <Button variant={"secondary"} onClick={() => setMode("idle")}>Idle</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant={"primary"} onClick={() => setMode("stream")}>
                                <span className={"fas fa-fw fa-broadcast-tower"}/>
                                Stream
                            </Button>
                        </Col>
                        <Col>
                            <Button variant={"primary"} onClick={() => setMode("single")}>
                                <span className={"far fa-fw fa-dot-circle"}/>
                                Single
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span className={"fas fa-fw fa-satellite-dish"}/>
                            <Button variant={"warning"} onClick={() => setMode("listen")}>Listen</Button>
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
