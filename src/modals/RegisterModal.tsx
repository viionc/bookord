import {Modal, Button, Form} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {FormEvent, useReducer} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";
import {RegisterFormAction, RegisterFormActionNames, RegisterFormReducer} from "../utilities/types";

export default function RegisterModal() {
    const SETTINGS_INITIAL_STATE: RegisterFormReducer = {
        username: "",
        avatar: null,
        password: "",
        confirmPassword: "",
        email: "",
        hasEnteredUsername: false,
        nameAlreadyExists: false,
        isEmailValid: false,
        hasEnteredPassword: false,
        emailAlreadyExists: false,
        isLoading: false,
    };
    function settingsReducer(state: RegisterFormReducer, action: RegisterFormAction) {
        const {type, payload, name} = action;
        switch (type) {
            case "INPUT":
                return {
                    ...state,
                    [name]: payload,
                };
            case "VALIDATE":
                return {
                    ...state,
                    [name]: payload,
                };
            case "RESET":
                state = SETTINGS_INITIAL_STATE;
                return state;
            default:
                return state;
        }
    }

    const [formState, dispatch] = useReducer(settingsReducer, SETTINGS_INITIAL_STATE);

    const {handleModalReducer, modalState} = useModalsContext();
    const {registerUser, userDatabase, loginAnonymously} = useFirebaseContext();

    const handleClose = () => {
        handleModalReducer({type: "REGISTER"});
    };

    const validate = (): boolean => {
        let email = formState.email === "" || !formState.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        let username = formState.username === "";
        let password = formState.password === "";
        let exist = userDatabase.filter(user => user.displayName === formState.username).length === 1;
        if (email) dispatch({type: "VALIDATE", payload: email, name: "isEmailValid"});
        if (username) dispatch({type: "VALIDATE", payload: email, name: "hasEnteredUsername"});
        if (password) dispatch({type: "VALIDATE", payload: email, name: "hasEnteredPassword"});
        if (exist) dispatch({type: "VALIDATE", payload: email, name: "nameAlreadyExists"});
        return email || username || password || exist;
    };

    const handleRegisterButton = async () => {
        if (validate()) return;
        dispatch({type: "VALIDATE", payload: true, name: "isLoading"});
        let error = await registerUser(formState.email, formState.password, formState.username, formState.avatar);
        if (error) {
            dispatch({type: "VALIDATE", payload: true, name: "emailAlreadyExists"});
            dispatch({type: "VALIDATE", payload: false, name: "isLoading"});
            return;
        }
        dispatch({type: "RESET", name: "reset", payload: null});
        handleClose();
    };

    const handleAnonLogin = () => {
        dispatch({type: "RESET", name: "reset", payload: null});
        loginAnonymously();
        handleClose();
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleRegisterButton();
    };

    return (
        <Modal show={modalState.isRegisterModalOpen} onHide={handleClose} className="text-white">
            <Modal.Header closeButton closeVariant="white" className="bg-dark">
                <Modal.Title>Register:</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="username"
                            name="username"
                            placeholder="Enter Username"
                            value={formState.username}
                            onChange={e =>
                                dispatch({
                                    type: "INPUT",
                                    payload: e.target.value,
                                    name: e.target.name as RegisterFormActionNames,
                                })
                            }
                            className="bg-secondary border-0"
                        ></Form.Control>
                        {formState.username.length > 15 && <Form.Text className="text-danger">Username can be maximum 15 characters long.</Form.Text>}
                        {formState.hasEnteredUsername && <Form.Text className="text-danger">Enter an username.</Form.Text>}
                        {formState.nameAlreadyExists && <Form.Text className="text-danger">Username taken.</Form.Text>}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Avatar: (optional)</Form.Label>
                        <Form.Control
                            type="file"
                            name="avatar"
                            onChange={e =>
                                dispatch({
                                    type: "INPUT",
                                    payload: (e.target as HTMLInputElement).files,
                                    name: e.target.name as RegisterFormActionNames,
                                })
                            }
                            accept="image/*"
                            placeholder="Select an image."
                            className="bg-secondary"
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formState.email}
                            onChange={e =>
                                dispatch({
                                    type: "INPUT",
                                    payload: e.target.value,
                                    name: e.target.name as RegisterFormActionNames,
                                })
                            }
                            className="bg-secondary border-0"
                        ></Form.Control>
                        {formState.isEmailValid && <Form.Text className="text-danger">Enter a valid email.</Form.Text>}
                        {formState.emailAlreadyExists && <Form.Text className="text-danger">Email already used.</Form.Text>}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formState.password}
                            onChange={e =>
                                dispatch({
                                    type: "INPUT",
                                    payload: e.target.value,
                                    name: e.target.name as RegisterFormActionNames,
                                })
                            }
                            className="bg-secondary border-0"
                        ></Form.Control>
                        {formState.hasEnteredPassword && <Form.Text className="text-danger">Enter a password.</Form.Text>}
                        {formState.password.length < 6 && <Form.Text className="text-danger">Password must have at least 6 characters.</Form.Text>}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formState.confirmPassword}
                            onChange={e =>
                                dispatch({
                                    type: "INPUT",
                                    payload: e.target.value,
                                    name: e.target.name as RegisterFormActionNames,
                                })
                            }
                            className="bg-secondary border-0"
                        ></Form.Control>
                        {formState.confirmPassword !== formState.password && <Form.Text className="text-danger">Passwords must match.</Form.Text>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button disabled={formState.isLoading} variant="success" onClick={handleRegisterButton}>
                    Register
                </Button>
                <Button disabled={formState.isLoading} variant="warning" onClick={handleAnonLogin}>
                    Login as Anon
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
