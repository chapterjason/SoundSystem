import { Mode, Node } from "../Types";
import { Button, Modal } from "react-bootstrap";
import * as React from "react";
import { useState } from "react";
import { NodeLogic } from "./Node/NodeLogic";
import { useActions } from "kea";

export interface SetModeProps {
    id: string;

    node: Node;
}

export function SetMode(props: SetModeProps) {
    const { node: { mode } } = props;
    const logic = NodeLogic(props);
    const { setMode, hideSetMode } = useActions(logic);
    const [currentMode, setCurrentMode] = useState(mode);

    function handleAbort() {
        hideSetMode();
    }

    function handleSave() {
        setMode(currentMode);
    }

    function handleModeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentTarget = event.currentTarget;

        if (currentTarget) {
            setCurrentMode(currentTarget.value as Mode);
        }
    }

    return (
        <Modal show={true} onHide={handleAbort}>
            <Modal.Header closeButton>
                <Modal.Title>Set Mode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <h6>Modus:</h6>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"mode_idle"} value="idle" checked={"idle" === currentMode} onChange={handleModeChange}/>
                        <label className="form-check-label" htmlFor={"mode_idle"}>
                            Idle
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"mode_stream"} value="stream" checked={"stream" === currentMode} onChange={handleModeChange}/>
                        <label className="form-check-label" htmlFor={"mode_stream"}>
                            Stream
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"mode_single"} value="single" checked={"single" === currentMode} onChange={handleModeChange}/>
                        <label className="form-check-label" htmlFor={"mode_single"}>
                            Single
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="mode" id={"mode_listen"} value="listen" checked={"listen" === currentMode} onChange={handleModeChange}/>
                        <label className="form-check-label" htmlFor={"mode_listen"}>
                            Listen
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
