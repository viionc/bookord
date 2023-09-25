import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {useEffect, useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";
import Select, {MultiValue} from "react-select";

export default function ChannelSettingsModal() {
    const {handleModalReducer, modalState} = useModalsContext();

    const {userDatabase, getUserByUid, currentUserProfile, saveChannelSettings} =
        useFirebaseContext();

    const [activeChannel, setActiveChannel] = useState(modalState.channelClicked);

    const handleClose = () => {
        handleModalReducer({type: "CHANNEL_SETTINGS", payload: activeChannel});
    };

    const handlePrivateChannelSwitch = () => {
        setActiveChannel(prev => {
            return {...prev, isPrivate: !prev.isPrivate};
        });
    };

    const handleChannelNameChange = (e: any) => {
        if (e.target.value.length === 11) return;
        setActiveChannel(prev => {
            return {...prev, name: e.target.value};
        });
    };

    const handleNewMembersChange = (selected: MultiValue<{label: string; value: string}>) => {
        setActiveChannel(prev => {
            return {...prev, members: [...selected.map(s => s.label)]};
        });
    };

    useEffect(() => {
        setActiveChannel(modalState.channelClicked);
    }, [modalState.channelClicked]);
    const handleSaveSettings = () => {
        const nameChanged = activeChannel.name === modalState.channelClicked.name;
        const membersChanged =
            JSON.stringify(activeChannel.members) !==
            JSON.stringify(modalState.channelClicked.members);
        const privacyChanged = activeChannel.isPrivate === modalState.channelClicked.isPrivate;
        if (nameChanged || membersChanged || privacyChanged) {
            handleModalReducer({type: "CHANNEL_SETTINGS"});
            saveChannelSettings(
                activeChannel.name,
                activeChannel.members,
                activeChannel.isPrivate,
                modalState.channelClicked
            );
        }
    };

    return (
        <Modal
            className="text-white"
            show={modalState.isChannelSettingsModalOpen}
            onHide={handleClose}
        >
            <Modal.Header className="bg-dark" closeButton closeVariant="white">
                <Modal.Title>#{modalState.channelClicked.name} settings:</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark">
                <Form>
                    <Form.Group>
                        <Form.Label>Channel name:</Form.Label>
                        <InputGroup>
                            <InputGroup.Text
                                className="text-white border-0"
                                id="inputGroup-sizing-default"
                                style={{backgroundColor: "#464d53"}}
                            >
                                #
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="default"
                                aria-describedby="inputGroup-sizing-default"
                                type="name"
                                placeholder="Enter channel name"
                                value={activeChannel.name}
                                onChange={e => handleChannelNameChange(e)}
                                className="bg-secondary text-white border-0"
                            ></Form.Control>
                        </InputGroup>
                        {activeChannel.name.length === 10 && (
                            <Form.Text className="text-danger">
                                Channel names can be only 10 characters long.
                            </Form.Text>
                        )}
                        <Form.Check
                            className="mt-3 mb-3"
                            type="switch"
                            id="private-channel"
                            label="Private"
                            onChange={handlePrivateChannelSwitch}
                        />
                    </Form.Group>
                </Form>
                <Select
                    isMulti
                    onChange={(name: any) => handleNewMembersChange(name)}
                    styles={{
                        control: styles => {
                            return {
                                ...styles,
                                backgroundColor: "#6C757D",
                                border: "none",
                            };
                        },
                        multiValue: styles => {
                            return {
                                ...styles,
                                backgroundColor: "#49555f",
                            };
                        },
                        multiValueLabel: styles => {
                            return {
                                ...styles,
                                color: "white",
                            };
                        },
                        menu: styles => {
                            return {
                                ...styles,
                                backgroundColor: "#6C757D",
                            };
                        },
                        option: styles => {
                            return {
                                ...styles,
                                backgroundColor: "#6C757D",
                                color: "white",
                                ":hover": {opacity: 0.8, backgroundColor: "#49555f"},
                            };
                        },
                        indicatorsContainer: styles => {
                            return {
                                ...styles,
                                color: "white",
                                ":hover": {opacity: 0.8},
                            };
                        },
                    }}
                    defaultValue={
                        modalState.channelClicked.members &&
                        modalState.channelClicked.members
                            .filter(u => u !== currentUserProfile?.uid)

                            .map(user => {
                                if (!user) return {};
                                return {value: user, label: getUserByUid(user).displayName};
                            })
                    }
                    options={userDatabase
                        .filter(
                            user =>
                                modalState.channelClicked.members &&
                                !modalState.channelClicked.members.includes(user.uid)
                        )
                        .filter(
                            user =>
                                !(user.roles.includes("moderator") || user.roles.includes("admin"))
                        )
                        .map(user => {
                            if (!user) return {};
                            return {value: user.displayName, label: user.displayName};
                        })}
                ></Select>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="success" onClick={handleSaveSettings}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
