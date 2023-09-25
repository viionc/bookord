import {Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useModalsContext} from "../context/ModalsContext";
import {useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function AddNewChannelModal() {
    const [channelName, setChannelName] = useState("");
    const [isChannelPrivate, setIsChannelPrivate] = useState(false);
    const {handleModalReducer, modalState} = useModalsContext();
    const {addNewChannel} = useFirebaseContext();

    const handleAddNewChannel = () => {
        handleModalReducer({type: "ADD_NEW_CHANNEL"});
        addNewChannel(channelName, isChannelPrivate);
    };

    const handleChannelNameChange = (e: any) => {
        if (e.target.value.length === 11) {
            return;
        }
        setChannelName(e.target.value);
    };

    const handleClose = () => {
        handleModalReducer({type: "ADD_NEW_CHANNEL"});
    };

    const handlePrivateChannelSwitch = () => {
        setIsChannelPrivate(!isChannelPrivate);
    };

    return (
        <Modal
            show={modalState.isAddNewChannelModalOpen}
            onHide={handleClose}
            className="text-white"
        >
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
                            onChange={e => handleChannelNameChange(e)}
                            className="bg-secondary text-white border-0"
                        ></Form.Control>
                        {channelName.length === 10 && (
                            <Form.Text className="text-danger">
                                Channel names can be only 10 characters long.
                            </Form.Text>
                        )}
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
