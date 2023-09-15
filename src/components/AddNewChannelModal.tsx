import {Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useModalsContext} from "../context/ModalsContext";
import {useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function AddNewChannelModal() {
    const [channelName, setChannelName] = useState("");
    const {isAddNewChannelModalOpen, closeModal} = useModalsContext();
    const {addNewChannel} = useFirebaseContext();

    const handleAddNewChannel = () => {
        closeModal("addnewchannel");
        addNewChannel(channelName);
    };

    const handleClose = () => {
        closeModal("addnewchannel");
    };

    return (
        <Modal show={isAddNewChannelModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Channel:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Channel name:</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={e => setChannelName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleAddNewChannel}>
                    Add channel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
