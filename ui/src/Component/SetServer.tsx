import { Button, Form, Modal } from "react-bootstrap";
import * as React from "react";
import { useEffect, useState } from "react";
import { Node } from "../Types";
import { NodeLogic } from "./Node/NodeLogic";
import { useActions, useValues } from "kea";
import { NodeOverviewLogic } from "./NodeOverview/NodeOverviewLogic";

export interface SetServerProps {
    id: string;

    node: Node;
}

export function SetServer(props: SetServerProps) {
    const { node: { server, id: nodeId } } = props;
    const logic = NodeLogic(props);
    const { setServer, hideSetServer } = useActions(logic);
    const [currentServer, setCurrentServer] = useState(server);
    const { nodes } = useValues(NodeOverviewLogic);

    function handleAbort() {
        hideSetServer();
    }

    function handleSave() {
        setServer(currentServer);
    }

    function handleServerChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentTarget = event.currentTarget;

        if (currentTarget) {
            setCurrentServer(currentTarget.value as string);
        }
    }

    const possibleNodes = Object.keys(nodes).filter(id => {
        const node = nodes[id];

        if (id === nodeId) {
            return false;
        }

        return node.mode === "stream";
    }).map(id => {
        return nodes[id];
    });

    useEffect(() => {
        if (!currentServer || currentServer.length <= 0) {
            setCurrentServer([...possibleNodes].shift()?.address ?? "");
        } else {
            console.log(possibleNodes.find(node => node.address === currentServer));
            if (!possibleNodes.find(node => node.address === currentServer)) {
                setCurrentServer([...possibleNodes].shift()?.address ?? "");
            }
        }
    }, [currentServer]);

    return (
        <Modal show={true} onHide={handleAbort}>
            <Modal.Header closeButton>
                <Modal.Title>Set Server</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <h6>Server ({currentServer}):</h6>
                    <div className="form-check">
                        <Form.Control as="select" onChange={handleServerChange} value={currentServer}>
                            {possibleNodes.map(node => {
                                return (
                                    <option value={node.address}>{node.hostname} ({node.address})</option>
                                );
                            })}
                        </Form.Control>
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
