import {Button, Modal} from "react-bootstrap";
import {useModalsContext} from "../context/ModalsContext";
import {UserProfile, useFirebaseContext} from "../context/FirebaseContext";
import {useEffect, useState} from "react";
import {getColorByUserRole, timestampToDate} from "../utilities/utilities";

export default function UserProfileModal() {
    const {isUserProfileModalOpen, closeModal, profileUidClicked} = useModalsContext();
    const {userDatabase, currentUserProfile, addUserToFriends, removeUserFromFriends} =
        useFirebaseContext();
    const [clickedUserProfile, setClickedUserProfile] = useState<UserProfile>({} as UserProfile);
    const [usernameColor, setUsernameColor] = useState("white");

    const handleClose = () => {
        closeModal("userprofile");
    };

    const handleAddToFriends = () => {
        addUserToFriends(clickedUserProfile.uid);
    };
    const handleRemoveFromFriends = () => {
        removeUserFromFriends(clickedUserProfile.uid);
    };
    useEffect(() => {
        const user = userDatabase.filter(user => user.uid === profileUidClicked)[0];
        if (!user) return;
        setClickedUserProfile(user);
        setUsernameColor(getColorByUserRole(user.roles));
    }, [profileUidClicked]);

    return currentUserProfile ? (
        <Modal show={isUserProfileModalOpen} onHide={handleClose}>
            <Modal.Header closeButton className="bg-dark" closeVariant="white">
                <Modal.Title style={{color: usernameColor}} className="d-flex flex-column">
                    <p className="m-0">{clickedUserProfile.displayName}</p>
                    <p className="m-0 text-secondary fs-6">
                        Joined: {timestampToDate(clickedUserProfile.createdAt)}
                    </p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-white">
                <p className="">
                    Roles:
                    {clickedUserProfile.roles &&
                        clickedUserProfile.roles.map(role => {
                            return (
                                <span
                                    key={role}
                                    style={{
                                        color: getColorByUserRole([role]),
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {" "}
                                    {role}
                                </span>
                            );
                        })}
                </p>
                <p>Total messages sent: {clickedUserProfile.totalMessagesSent}</p>
                {currentUserProfile?.uid !== clickedUserProfile.uid ? (
                    !currentUserProfile.friends.includes(clickedUserProfile.uid) ? (
                        <Button className="bg-success border-0" onClick={handleAddToFriends}>
                            Add to friends
                        </Button>
                    ) : (
                        <Button className="bg-danger border-0" onClick={handleRemoveFromFriends}>
                            Remove from friends
                        </Button>
                    )
                ) : (
                    <></>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-dark border-0"></Modal.Footer>
        </Modal>
    ) : (
        <></>
    );
}
