import {Modal, Button, Form} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";

export default function RegisterModal() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mismatchedPassword, setMismatchedPassword] = useState(false);
    const [enterEmail, setEnterEmail] = useState(false);
    const [enterUsername, setEnterUsername] = useState(false);
    const [enterPassword, setEnterPassword] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);

    const {isRegisterModalOpen, closeModal} = useModalsContext();
    const {registerUser} = useFirebaseContext();

    const handleConfirmPassword = (pass: string) => {
        setConfirmPassword(pass);
        if (pass != password) {
            setMismatchedPassword(true);
        } else {
            setMismatchedPassword(false);
        }
    };

    const handleClose = () => {
        closeModal("register");
    };

    const handleRegisterButton = () => {
        let failed = false;
        if (password !== confirmPassword) failed = true;
        if (username === "") {
            setEnterUsername(true);
            failed = true;
        } else {
            setEnterUsername(false);
        }
        if (email === "" || !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            setEnterEmail(true);
            failed = true;
        } else {
            setEnterEmail(false);
        }
        if (password === "") {
            setEnterPassword(true);
            failed = true;
        } else {
            setEnterPassword(false);
        }
        if (password.length < 6) {
            setPasswordTooShort(true);
            failed = true;
        } else {
            setPasswordTooShort(false);
        }
        if (failed) return;
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
        handleClose();
        registerUser(email, password, username);
    };

    return (
        <Modal show={isRegisterModalOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => e.preventDefault()}>
                    <Form.Group>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="username"
                            placeholder="Enter Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        ></Form.Control>
                        {enterUsername && (
                            <Form.Text className="text-danger">Enter an username.</Form.Text>
                        )}
                    </Form.Group>
                </Form>
                <Form>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        ></Form.Control>
                        {enterEmail && (
                            <Form.Text className="text-danger">Enter a valid email.</Form.Text>
                        )}
                    </Form.Group>
                </Form>
                <Form>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        ></Form.Control>
                        {enterPassword && (
                            <Form.Text className="text-danger">Enter a password.</Form.Text>
                        )}
                        {passwordTooShort && (
                            <Form.Text className="text-danger">
                                Password must have at least 6 characters.
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e => handleConfirmPassword(e.target.value)}
                        ></Form.Control>
                        {mismatchedPassword && (
                            <Form.Text className="text-danger">Passwords must match.</Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleRegisterButton}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
