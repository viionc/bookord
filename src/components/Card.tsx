import {Container} from "react-bootstrap";
import {Message, useFirebaseContext} from "../context/FirebaseContext";
import {getColorByUserRole, timestampToDate} from "../utilities/utilities";
import Reaction from "./Reaction";
import {useEffect, useState} from "react";
import {useModalsContext} from "../context/ModalsContext";
import Trash from "./Trash";

const Card: React.FC<Message> = (message: Message) => {
    const {currentUserProfile, userDatabase} = useFirebaseContext();
    const {openModal} = useModalsContext();
    const [usernameColor, setUserNameColor] = useState("white");

    useEffect(() => {
        let userRoles = userDatabase.filter(u => u.uid === message.userUid)[0].roles;
        setUserNameColor(getColorByUserRole(userRoles));
    }, [currentUserProfile]);

    return (
        <Container className="mt-2 d-flex pt flex-column text-white">
            <div className="d-flex jutify-content-center align-items-center gap-2">
                <h3
                    onClick={() => openModal({key: "userprofile", profileClicked: message.userUid})}
                    style={{color: usernameColor, cursor: "pointer"}}
                    className="hover"
                >
                    {message.username}
                </h3>
                <p className="text-secondary d-flex justify-content-center m-0">
                    {timestampToDate(message.timestamp)}
                </p>
                <Reaction message={message}></Reaction>
                <Trash message={message}></Trash>
            </div>

            <div style={{overflowWrap: "break-word"}}>{message.body}</div>
        </Container>
    );
};

export default Card;
