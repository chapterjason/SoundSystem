import { Node } from "../Types";
import { Button, Col, Modal, Row } from "react-bootstrap";
import * as React from "react";
import { NodeLogic } from "./Node/NodeLogic";
import { useActions } from "kea";

export interface SetStreamProps {
    id: string;

    node: Node;
}

export function SetStream(props: SetStreamProps) {
    const logic = NodeLogic(props);
    const { setStream, hideSetStream } = useActions(logic);

    function handleAbort() {
        hideSetStream();
    }

    return (
        <Modal show={true} onHide={handleAbort}>
            <Modal.Header closeButton>
                <Modal.Title>Set Stream</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <h6>Stream:</h6>
                    <Row>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setStream("airplay")}>
                                <span className={"fas fa-fw fa-rss"}/>
                                {" "}
                                Airplay
                            </Button>
                        </Col>
                        <Col>
                            <Button variant={"primary"} block onClick={() => setStream("bluetooth")}>
                                <span className={"fab fa-fw fa-bluetooth"}/>
                                {" "}
                                Bluetooth
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
