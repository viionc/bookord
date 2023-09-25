import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {useEffect, useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";
import Select, {MultiValue} from "react-select";
import {Channel} from "../utilities/types";

export default function ChannelSettingsModal() {
    const {handleModalReducer, modalState} = useModalsContext();

    const {userDatabase, getUserByUid, currentUserProfile, saveChannelSettings} =
        useFirebaseContext();

    const [activeChannel, setActiveChannel] = useState(modalState.channelClicked);

    const handleClose = () => {
        handleModalReducer({type: "CHANNEL_SETTINGS", payload: activeChannel});
    };

    const handlePrivateChannelSwitch = () => {
        if (!activeChannel) return;
        //@ts-ignore
        setActiveChannel((prev: Channel) => {
            return {...prev, isPrivate: !prev.isPrivate};
        });
    };

    const handleChannelNameChange = (e: any) => {
        if (!activeChannel) return;
        if (e.target.value.length === 11) return;
        //@ts-ignore
        setActiveChannel((prev: Channel) => {
            return {...prev, name: e.target.value};
        });
    };

    const handleNewMembersChange = (selected: MultiValue<{label: string; value: string}>) => {
        if (!activeChannel) return;
        //@ts-ignore
        setActiveChannel((prev: Channel) => {
            return {...prev, members: [...selected.map(s => s.value)]};
        });
    };

    const handleSaveSettings = () => {
        if (!activeChannel || !modalState.channelClicked) return;

        const nameChanged =
            activeChannel.name !== modalState.channelClicked.name && activeChannel.name !== "";

        const membersChanged =
            JSON.stringify(activeChannel.members) !==
            JSON.stringify(modalState.channelClicked.members);

        const privacyChanged = activeChannel.isPrivate === modalState.channelClicked.isPrivate;

        if (!(nameChanged || membersChanged || privacyChanged)) return;

        const settingsToSave = {
            name: nameChanged ? activeChannel.name : modalState.channelClicked.name,
            members: membersChanged ? activeChannel.members : modalState.channelClicked.members,
            isPrivate: privacyChanged
                ? activeChannel.isPrivate
                : modalState.channelClicked.isPrivate,
            channel: activeChannel,
        };

        handleModalReducer({type: "CHANNEL_SETTINGS"});
        saveChannelSettings(settingsToSave);
    };

    const handleDeleteChannel = () => {
        handleClose();
    };

    useEffect(() => {
        setActiveChannel(modalState.channelClicked);
    }, [modalState.channelClicked]);

    return activeChannel ? (
        <Modal
            className="text-white"
            show={modalState.isChannelSettingsModalOpen}
            onHide={handleClose}
        >
            <Modal.Header className="bg-dark" closeButton closeVariant="white">
                <Modal.Title>#{activeChannel.name} settings:</Modal.Title>
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
                        activeChannel.members &&
                        activeChannel.members
                            .filter(u => u !== currentUserProfile?.uid)
                            .map(userUid => {
                                return {value: userUid, label: getUserByUid(userUid).displayName};
                            })
                    }
                    options={userDatabase
                        .filter(
                            user =>
                                activeChannel.members && !activeChannel.members.includes(user.uid)
                        )
                        .filter(
                            user =>
                                !(user.roles.includes("moderator") || user.roles.includes("admin"))
                        )
                        .map(user => {
                            if (!user) return {};
                            return {value: user.uid, label: user.displayName};
                        })}
                ></Select>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="success" onClick={handleSaveSettings}>
                    Save
                </Button>
                <Button variant="success" onClick={handleDeleteChannel}>
                    Delete Channel
                </Button>
            </Modal.Footer>
        </Modal>
    ) : (
        <></>
    );
}
