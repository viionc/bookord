import Modal from "react-bootstrap/Modal";
import {useModalsContext} from "../context/ModalsContext";
import {useFirebaseContext} from "../context/FirebaseContext";
import {Button} from "react-bootstrap";

export default function DeleteMessageModal() {
    const {handleModalReducer, modalState} = useModalsContext();
    const {deleteMessage} = useFirebaseContext();

    const handleClose = () => {
        handleModalReducer({type: "DELETE_MESSAGE", payload: modalState.messageUidClicked});
    };

    const handleDeleteMessage = () => {
        deleteMessage(modalState.messageUidClicked);
        handleClose();
    };

    return (
        <Modal
            show={modalState.isDeleteMessageModalOpen}
            onHide={handleClose}
            className="text-white"
        >
            <Modal.Header closeButton closeVariant="white" className="bg-dark border-0">
                <Modal.Title>Delete Message?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark d-flex w-100 gap-1">
                <Button variant="success" onClick={handleDeleteMessage} className="w-25">
                    Yes
                </Button>
                <Button variant="secondary" onClick={handleClose} className="w-25">
                    No
                </Button>
            </Modal.Body>
        </Modal>
    );
}
