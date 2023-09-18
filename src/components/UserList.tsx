import {useEffect, useState} from "react";
import {useFirebaseContext, UserProfile} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";

export default function UserList() {
    const {userDatabase} = useFirebaseContext();
    const {openModal} = useModalsContext();

    const [admins, setAdmins] = useState<UserProfile[]>([]);
    const [moderators, setModerators] = useState<UserProfile[]>([]);
    const [members, setMembers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const adminsArray = [] as UserProfile[];
        const moderatorsArray = [] as UserProfile[];
        const membersArray = [] as UserProfile[];
        userDatabase.forEach(user => {
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
    }, [userDatabase]);

    return (
        <div className="h-100 p-5" style={{width: "20vw", backgroundColor: "rgb(42 43 49)"}}>
            <div>
                <p className="text-secondary m-0 mt-1">Admins ({admins.length}):</p>
                {admins.map(user => {
                    return (
                        <h5
                            className="m-0"
                            key={user.uid}
                            style={{color: "green"}}
                            onClick={() => openModal("userprofile", user.uid)}
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
                            className="m-0"
                            key={user.uid}
                            style={{color: "yellow"}}
                            onClick={() => openModal("userprofile", user.uid)}
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
                            className="m-0"
                            key={user.uid}
                            style={{color: "white"}}
                            onClick={() => openModal("userprofile", user.uid)}
                        >
                            {user.displayName}
                        </h5>
                    );
                })}
            </div>
        </div>
    );
}
