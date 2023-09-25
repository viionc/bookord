import {User} from "firebase/auth";
import {Message, useFirebaseContext} from "../context/FirebaseContext";

const Reaction = ({message}: {message: Message}) => {
    const {likeMessage, currentUser, removeLikeMessage} = useFirebaseContext();

    const handleLikeMessage = (message: Message) => {
        if (message.likes.includes((currentUser as User).uid)) {
            removeLikeMessage(message);
            return;
        }
        likeMessage(message);
    };

    return (
        <div onClick={() => handleLikeMessage(message)}>
            <div className="d-flex flex-row justify-content-center align-items-center h-100 gap-2">
                {message.likes.includes((currentUser as User).uid) ? (
                    <i
                        className="fa-solid fa-heart"
                        style={{color: "#ff0000", cursor: "pointer"}}
                    ></i>
                ) : (
                    <i
                        className="fa-regular fa-heart"
                        style={{color: "#ff0000", cursor: "pointer"}}
                    ></i>
                )}
                <p className="m-0" style={{fontSize: "16px"}}>
                    {message.likes.length ? message.likes.length : ""}
                </p>
            </div>
        </div>
    );
};

export default Reaction;
