import {Container} from "react-bootstrap";
import {useFirebaseContext} from "../context/FirebaseContext";
import {getColorByUserRole, timestampToDate} from "../utilities/utilities";
import Reaction from "./Reaction";
import {useEffect, useState} from "react";
import {useModalsContext} from "../context/ModalsContext";
import Trash from "./Trash";
import {Message, UserProfile} from "../utilities/types";
import userImage from "../assets/user.png";

const Card = ({message}: {message: Message}) => {
    const {currentUserProfile, userDatabase} = useFirebaseContext();
    const {handleModalReducer} = useModalsContext();
    const [usernameColor, setUserNameColor] = useState("white");
    let messageUser = {} as UserProfile;

    useEffect(() => {
        messageUser = userDatabase.filter(u => u.uid === message.userUid)[0];
        setUserNameColor(getColorByUserRole(messageUser.roles));
    }, [currentUserProfile]);

    return (
        <div className="d-flex flex-row align-items-start">
            <img
                src={messageUser.avatar ? messageUser.avatar : userImage}
                alt={`${messageUser.displayName} avatar`}
                width={48}
                height={48}
            ></img>
            <Container className="mt-2 d-flex pt flex-column text-white">
                <div className="d-flex jutify-content-center align-items-center gap-2">
                    <h3
                        onClick={() =>
                            handleModalReducer({type: "USER_PROFILE", payload: message.userUid})
                        }
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
        </div>
    );
};

export default Card;
