import {Container} from "react-bootstrap";
import {Message, useFirebaseContext} from "../context/FirebaseContext";
import {timestampToDate} from "../utilities/utilities";
import Reaction from "./Reaction";
import {useEffect, useState} from "react";

const Card: React.FC<Message> = (message: Message) => {
    const {userProfile, userDatabase} = useFirebaseContext();
    const [usernameColor, setUserNameColor] = useState("white");

    useEffect(() => {
        // if (!userProfile) return;
        let userRoles = userDatabase.filter(u => u.uid === message.userUid)[0].roles;
        if (userRoles.includes("admin")) {
            setUserNameColor("green");
        } else if (userRoles.includes("moderator")) {
            setUserNameColor("yellow");
        } else {
            setUserNameColor("white");
        }
    }, [userProfile]);

    return (
        <Container className="mt-2 d-flex pt flex-column text-white">
            <div className="d-flex jutify-content-center align-items-center gap-2">
                <h3 style={{color: usernameColor}}>{message.username}</h3>
                <p className="text-secondary d-flex justify-content-center m-0">
                    {timestampToDate(message.timestamp)}
                </p>
                <Reaction {...message}></Reaction>
            </div>

            <div style={{overflowWrap: "break-word"}}>{message.body}</div>
        </Container>
    );
};

export default Card;
