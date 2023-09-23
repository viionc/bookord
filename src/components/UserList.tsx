import {useEffect, useState} from "react";
import {useFirebaseContext, UserProfile} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";
import {Col} from "react-bootstrap";

export default function UserList() {
    const {userDatabase, currentUserProfile} = useFirebaseContext();
    const {openModal} = useModalsContext();

    const [admins, setAdmins] = useState<UserProfile[]>([]);
    const [moderators, setModerators] = useState<UserProfile[]>([]);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [friends, setFriends] = useState<UserProfile[]>([]);

    useEffect(() => {
        const adminsArray = [] as UserProfile[];
        const moderatorsArray = [] as UserProfile[];
        const membersArray = [] as UserProfile[];
        const friendsArray = [] as UserProfile[];
        userDatabase.forEach(user => {
            if (currentUserProfile?.friends.includes(user.uid)) {
                friendsArray.push(user);
            }
            if (user.roles.includes("admin")) {
                adminsArray.push(user);
                return;
            } else if (user.roles.includes("moderator")) {
                moderatorsArray.push(user);
                return;
            } else {
                membersArray.push(user);
            }
        });
        setAdmins(adminsArray);
        setModerators(moderatorsArray);
        setMembers(membersArray);
        setFriends(friendsArray);
    }, [userDatabase]);

    return (
        <Col
            xs={4}
            id="user-list"
            className="p-3"
            style={{backgroundColor: "rgb(42 43 49)", flex: "0 0 300px"}}
        >
            <div id="channels" className="px-4 mh-100 overflow-auto" style={{height: "80vh"}}>
                <div>
                    <p className="text-secondary m-0 mt-1">Admins ({admins.length}):</p>
                    {admins.map(user => {
                        return (
                            <h5
                                className="m-0 hover"
                                key={user.uid}
                                style={{color: "green"}}
                                onClick={() =>
                                    openModal({key: "userprofile", profileClicked: user.uid})
                                }
                            >
                                {user.displayName}
                            </h5>
                        );
                    })}
                </div>
                <div>
                    <p className="text-secondary m-0">Moderators ({moderators.length}):</p>
                    {moderators.map(user => {
                        return (
                            <h5
                                className="m-0 hover"
                                key={user.uid}
                                style={{color: "yellow"}}
                                onClick={() =>
                                    openModal({key: "userprofile", profileClicked: user.uid})
                                }
                            >
                                {user.displayName}
                            </h5>
                        );
                    })}
                </div>
                <div>
                    <p className="text-secondary m-0">Friends ({friends.length}):</p>
                    {friends.map(user => {
                        return (
                            <h5
                                className="m-0 hover"
                                key={user.uid}
                                style={{color: "white"}}
                                onClick={() =>
                                    openModal({key: "userprofile", profileClicked: user.uid})
                                }
                            >
                                {user.displayName}
                            </h5>
                        );
                    })}
                </div>
                <div>
                    <p className="text-secondary m-0">Members ({members.length}):</p>
                    {members.map(user => {
                        return (
                            <h5
                                className="m-0 hover"
                                key={user.uid}
                                style={{color: "white"}}
                                onClick={() =>
                                    openModal({key: "userprofile", profileClicked: user.uid})
                                }
                            >
                                {user.displayName}
                            </h5>
                        );
                    })}
                </div>
            </div>
        </Col>
    );
}
