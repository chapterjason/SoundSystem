import { Node, Stream } from "../Types";
import { Button, Modal } from "react-bootstrap";
import * as React from "react";
import { useState } from "react";
import { NodeLogic } from "./Node/NodeLogic";
import { useActions } from "kea";

export interface SetStreamProps {
    id: string;

    node: Node;
}

export function SetStream(props: SetStreamProps) {
    const { node: { stream } } = props;
    const logic = NodeLogic(props);
    const { setStream, hideSetStream } = useActions(logic);
    const [currentStream, setCurrentStream] = useState(stream);

    function handleAbort() {
        hideSetStream();
    }

    function handleSave() {
        setStream(currentStream);
    }

    function handleStreamChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentTarget = event.currentTarget;

        if (currentTarget) {
            setCurrentStream(currentTarget.value as Stream);
        }
    }

    return (
        <Modal show={true} onHide={handleAbort}>
            <Modal.Header closeButton>
                <Modal.Title>Set Stream</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <h6>Stream:</h6>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"stream_airplay"} value="airplay" checked={"airplay" === currentStream} onChange={handleStreamChange}/>
                        <label className="form-check-label" htmlFor={"stream_airplay"}>
                            Airplay
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"stream_bluetooth"} value="bluetooth" checked={"bluetooth" === currentStream} onChange={handleStreamChange}/>
                        <label className="form-check-label" htmlFor={"stream_bluetooth"}>
                            Bluetooth
                        </label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleAbort}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
