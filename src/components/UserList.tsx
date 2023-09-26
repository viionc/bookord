import {useEffect, useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";
import {Button, Col} from "react-bootstrap";
import UserListComponent from "./UserListComponent";
import {UserProfile} from "../utilities/types";

export default function UserList() {
    const {userDatabase, currentUserProfile} = useFirebaseContext();

    const [admins, setAdmins] = useState<UserProfile[]>([]);
    const [moderators, setModerators] = useState<UserProfile[]>([]);
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [friends, setFriends] = useState<UserProfile[]>([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const adminsArray = [] as UserProfile[];
        const moderatorsArray = [] as UserProfile[];
        const membersArray = [] as UserProfile[];
        const friendsArray = [] as UserProfile[];
        const users = [...userDatabase];
        users
            .sort((a, b) => {
                if (a.displayName < b.displayName) return -1;
                if (a.displayName > b.displayName) return 1;
                return 0;
            })
            .forEach(user => {
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
        <Col xs={4} id="user-list" style={{backgroundColor: "rgb(42 43 49)", flex: "0 0 300px"}}>
            <Button
                className="side-button position-absolute bg-dark text-white fs-5 d-none justify-content-center align-items-center"
                style={{top: 15, right: 5, height: 30, width: 30}}
                onClick={() => setOpen(!open)}
            >
                {open ? ">" : "<"}
            </Button>
            {open ? (
                <>
                    <div
                        id="channels"
                        className="px-4 mh-100 overflow-auto"
                        style={{height: "80vh"}}
                    >
                        <div>
                            <p className="text-secondary m-0 mt-1">Admins ({admins.length}):</p>
                            {admins.map(user => {
                                return (
                                    <UserListComponent key={user.uid} user={user} color={"green"} />
                                );
                            })}
                        </div>
                        <div>
                            <p className="text-secondary m-0">Moderators ({moderators.length}):</p>
                            {moderators.map(user => {
                                return (
                                    <UserListComponent
                                        key={user.uid}
                                        user={user}
                                        color={"yellow"}
                                    />
                                );
                            })}
                        </div>
                        <div>
                            <p className="text-secondary m-0">Friends ({friends.length}):</p>
                            {friends.map(user => {
                                return (
                                    <UserListComponent key={user.uid} user={user} color={"pink"} />
                                );
                            })}
                        </div>
                        <div>
                            <p className="text-secondary m-0">Members ({members.length}):</p>
                            {members.map(user => {
                                return (
                                    <UserListComponent key={user.uid} user={user} color={"white"} />
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </Col>
    );
}
