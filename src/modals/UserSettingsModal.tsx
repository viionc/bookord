import {Button, Container, Form, InputGroup, Modal} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {useFirebaseContext} from "../context/FirebaseContext";
import {useReducer, useState} from "react";
import {getColorByUserRole, timestampToDate} from "../utilities/utilities";
import {SettingsAction, SettingsActionTypes, SettingsReducerState} from "../utilities/types";
import userImage from "../assets/user.png";

export default function UserSettingsModal() {
    const {handleModalReducer, modalState} = useModalsContext();
    const {currentUserProfile} = useFirebaseContext();

    const handleClose = () => {
        handleModalReducer({type: "USER_SETTINGS"});
        dispatch({type: "RESET"});
    };

    const SETTINGS_INITIAL_STATE: SettingsReducerState = {
        username: "",
        avatar: null,
        password: "",
        confirmPassword: "",
        email: "",
        emailActive: false,
        passwordActive: false,
        avatarActive: false,
        usernameActive: false,
    };
    function settingsReducer(state: SettingsReducerState, action: SettingsAction) {
        const {type, payload} = action;
        switch (type) {
            case "USERNAME":
                return {
                    ...state,
                    username: payload as string,
                };
            case "AVATAR":
                return {
                    ...state,
                    avatar: payload as FileList | null,
                };
            case "EMAIL":
                return {
                    ...state,
                    email: payload as string,
                };
            case "CONFIRM_PASSWORD":
                return {
                    ...state,
                    confirmPassword: payload as string,
                };
            case "PASSWORD":
                return {
                    ...state,
                    password: payload as string,
                };
            case "OPEN_AVATAR_FORM":
                return {
                    ...state,
                    avatarActive: !state.avatarActive,
                };
            case "OPEN_PASSWORD_FORM":
                return {
                    ...state,
                    passwordActive: !state.passwordActive,
                };
            case "OPEN_EMAIL_FORM":
                return {
                    ...state,
                    emailActive: !state.emailActive,
                };
            case "OPEN_USERNAME_FORM":
                return {
                    ...state,
                    usernameActive: !state.usernameActive,
                };
            case "RESET":
                state = SETTINGS_INITIAL_STATE;
                return state;
            default:
                return state;
        }
    }

    const [settingsState, dispatch] = useReducer(settingsReducer, SETTINGS_INITIAL_STATE);

    const handleMSettingsReducer = (action: SettingsAction) => {
        dispatch({type: action.type, payload: action.payload});
    };

    let formBusy =
        settingsState.avatarActive ||
        settingsState.emailActive ||
        settingsState.passwordActive ||
        settingsState.usernameActive;

    return currentUserProfile ? (
        <Modal show={modalState.isUserSettingsModalOpen} onHide={handleClose}>
            <Modal.Header closeButton className="bg-dark border-0" closeVariant="white">
                <Modal.Title className="d-flex flex-column ">
                    <div className="d-flex h-100 align-items-center gap-2">
                        <img
                            src={currentUserProfile.avatar ? currentUserProfile.avatar : userImage}
                            height={32}
                            width={32}
                            className="rounded-circle"
                        ></img>
                        <p
                            className="m-0"
                            style={{color: getColorByUserRole(currentUserProfile.roles)}}
                        >
                            {currentUserProfile.displayName}
                        </p>
                    </div>
                    <p className="m-0 text-secondary fs-6">
                        Joined: {timestampToDate(currentUserProfile.createdAt)}
                    </p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-white">
                {!formBusy ? (
                    <Container className="d-flex flex-column gap-3 px-5 settings-buttons">
                        <Button
                            className="hover"
                            onClick={() => {
                                handleMSettingsReducer({type: "OPEN_USERNAME_FORM"});
                            }}
                        >
                            Change Username
                        </Button>
                        <Button
                            className="hover"
                            onClick={() => {
                                handleMSettingsReducer({type: "OPEN_PASSWORD_FORM"});
                            }}
                        >
                            Change Password
                        </Button>
                        <Button
                            className="hover"
                            onClick={() => {
                                handleMSettingsReducer({type: "OPEN_EMAIL_FORM"});
                            }}
                        >
                            Change Email
                        </Button>
                        <Button
                            className="hover"
                            onClick={() => {
                                handleMSettingsReducer({type: "OPEN_AVATAR_FORM"});
                            }}
                        >
                            Change Avatar
                        </Button>
                    </Container>
                ) : (
                    <Container>
                        {settingsState.usernameActive && (
                            <Form.Control
                                type="username"
                                placeholder="Enter Username"
                                value={settingsState.username}
                                onChange={e =>
                                    handleMSettingsReducer({
                                        type: "USERNAME",
                                        payload: e.target.value,
                                    })
                                }
                                className="bg-secondary border-0"
                            ></Form.Control>
                        )}
                        {settingsState.avatarActive && (
                            <Form.Control
                                type="file"
                                onChange={e =>
                                    handleMSettingsReducer({
                                        type: "AVATAR",
                                        payload: (e.target as HTMLInputElement).files,
                                    })
                                }
                                accept="image/*"
                                placeholder="Select an image."
                                className="bg-secondary"
                            ></Form.Control>
                        )}
                        {settingsState.emailActive && (
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={settingsState.email}
                                onChange={e =>
                                    handleMSettingsReducer({type: "EMAIL", payload: e.target.value})
                                }
                                className="bg-secondary border-0"
                            ></Form.Control>
                        )}
                        {settingsState.passwordActive && (
                            <div className="d-flex flex-column gap-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={settingsState.password}
                                    onChange={e =>
                                        handleMSettingsReducer({
                                            type: "PASSWORD",
                                            payload: e.target.value,
                                        })
                                    }
                                    className="bg-secondary border-0"
                                ></Form.Control>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={settingsState.confirmPassword}
                                    onChange={e =>
                                        handleMSettingsReducer({
                                            type: "CONFIRM_PASSWORD",
                                            payload: e.target.value,
                                        })
                                    }
                                    className="bg-secondary border-0"
                                ></Form.Control>
                            </div>
                        )}
                    </Container>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-dark border-0">
                <Button variant="success">Save</Button>
            </Modal.Footer>
        </Modal>
    ) : (
        <></>
    );
}

{
    /* <Form onSubmit={() => {}}>
    <InputGroup>
        <Button onClick={() => setUsernameActive(!usernameActive)}>Username:</Button>
        {usernameActive && (
            <Form.Control
                type="username"
                placeholder="Enter Username"
                value={settingsState.username}
                onChange={e =>
                    handleMSettingsReducer({
                        type: "USERNAME",
                        payload: e.target.value,
                    })
                }
                className="bg-secondary border-0"
            ></Form.Control>
        )}
    </InputGroup>
    {usernameActive && settingsState.username.length > 14 && (
        <Form.Text className="text-danger">Username too long.</Form.Text>
    )}
    {usernameActive && settingsState.username === "" && (
        <Form.Text className="text-danger">Enter an username.</Form.Text>
    )}
    <InputGroup>
        <Button onClick={() => setAvatarActive(!avatarActive)}>Avatar:</Button>
        {avatarActive && (
            <Form.Control
                type="file"
                onChange={e =>
                    handleMSettingsReducer({
                        type: "AVATAR",
                        payload: (e.target as HTMLInputElement).files,
                    })
                }
                accept="image/*"
                placeholder="Select an image."
                className="bg-secondary"
            ></Form.Control>
        )}
    </InputGroup>
    <InputGroup>
        <Button onClick={() => setEmailActive(!emailActive)}>Email:</Button>
        {emailActive && (
            <Form.Control
                type="email"
                placeholder="Enter Email"
                value={settingsState.email}
                onChange={e => handleMSettingsReducer({type: "EMAIL", payload: e.target.value})}
                className="bg-secondary border-0"
            ></Form.Control>
        )}
    </InputGroup>
    {emailActive && settingsState.email === "" && (
        <Form.Text className="text-danger">Enter a valid email.</Form.Text>
    )}
    <InputGroup>
        <Button onClick={() => setPasswordActive(!passwordActive)}>Password:</Button>
        {passwordActive && (
            <Form.Control
                type="password"
                placeholder="Enter password"
                value={settingsState.password}
                onChange={e =>
                    handleMSettingsReducer({
                        type: "PASSWORD",
                        payload: e.target.value,
                    })
                }
                className="bg-secondary border-0"
            ></Form.Control>
        )}
    </InputGroup>
    {passwordActive && settingsState.password === "" && (
        <Form.Text className="text-danger">Enter a password.</Form.Text>
    )}
    {passwordActive && settingsState.password.length < 6 && (
        <Form.Text className="text-danger">Password must have at least 6 characters.</Form.Text>
    )}
    {passwordActive && (
        <InputGroup>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
                type="password"
                placeholder="Confirm password"
                value={settingsState.confirmPassword}
                onChange={e =>
                    handleMSettingsReducer({
                        type: "CONFIRM_PASSWORD",
                        payload: e.target.value,
                    })
                }
                className="bg-secondary border-0"
            ></Form.Control>
            {settingsState.password !== settingsState.confirmPassword && (
                <Form.Text className="text-danger">Passwords must match.</Form.Text>
            )}
        </InputGroup>
    )}
</Form>; */
}
