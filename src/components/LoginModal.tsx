import {Button, Form} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useModalsContext} from "../context/ModalsContext";
import {FormEvent, useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function LoginModal() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {isLoginModalOpen, openModal, closeModal} = useModalsContext();
    const {loginUser} = useFirebaseContext();

    const handleRegisterButton = () => {
        closeModal("login");
        openModal("register");
    };

    const handleClose = () => {
        closeModal("login");
    };

    const handleLoginButton = () => {
        loginUser(email, password);
        closeModal("login");
    };

    const handleSubmit = (e: FormEvent) => {
        console.log("tst");
        e.preventDefault();
        handleLoginButton();
    };

    return (
        <Modal show={isLoginModalOpen} onHide={handleClose} className="text-white">
            <Modal.Header closeButton className="bg-dark">
                <Modal.Title>Login:</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-secondary"
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            className="bg-secondary"
                            onChange={e => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="success" onClick={handleLoginButton}>
                    Login
                </Button>
                <Button variant="danger" onClick={handleRegisterButton}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
