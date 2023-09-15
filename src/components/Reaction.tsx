import {Message, useFirebaseContext} from "../context/FirebaseContext";

const Reaction: React.FC<Message> = (message: Message) => {
    const {likeMessage, currentUser} = useFirebaseContext();

    const handleLikeMessage = (message: Message) => {
        if (!currentUser) return;
        if (message.likes.includes(currentUser.uid)) return;
        likeMessage(message);
    };

    return (
        <div onClick={() => handleLikeMessage(message)}>
            <div className="d-flex flex-row justify-content-center align-items-center h-100 gap-2">
                {currentUser && message.likes.includes(currentUser.uid) ? (
                    <i className="fa-solid fa-heart" style={{color: "#ff0000"}}></i>
                ) : (
                    <i className="fa-regular fa-heart" style={{color: "#ff0000"}}></i>
                )}
                <p className="m-0" style={{fontSize: "16px"}}>
                    {message.likes.length ? message.likes.length : ""}
                </p>
            </div>
        </div>
    );
};

export default Reaction;
