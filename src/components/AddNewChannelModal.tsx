import {Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useModalsContext} from "../context/ModalsContext";
import {useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function AddNewChannelModal() {
    const [channelName, setChannelName] = useState("");
    const [isChannelPrivate, setIsChannelPrivate] = useState(false);
    const {isAddNewChannelModalOpen, closeModal} = useModalsContext();
    const {addNewChannel} = useFirebaseContext();

    const handleAddNewChannel = () => {
        closeModal("addnewchannel");
        addNewChannel(channelName, isChannelPrivate);
    };

    const handleClose = () => {
        closeModal("addnewchannel");
    };

    const handlePrivateChannelSwitch = () => {
        setIsChannelPrivate(!isChannelPrivate);
    };

    return (
        <Modal show={isAddNewChannelModalOpen} onHide={handleClose} className="text-white">
            <Modal.Header closeButton closeVariant="white" className="bg-dark border-0">
                <Modal.Title>Add New Channel:</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
                <Form>
                    <Form.Group>
                        <Form.Label>Channel name:</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={e => setChannelName(e.target.value)}
                            className="bg-secondary text-white border-0"
                        ></Form.Control>
                        <Form.Check
                            className="mt-3"
                            type="switch"
                            id="private-channel"
                            label="Private"
                            onChange={handlePrivateChannelSwitch}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-0">
                <Button variant="success" onClick={handleAddNewChannel}>
                    Add channel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
