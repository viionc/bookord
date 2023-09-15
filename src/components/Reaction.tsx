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
            {message.likes.length ? (
                <div className="d-flex flex-row justify-content-center align-items-center h-100 gap-1">
                    <i className="fa-solid fa-heart" style={{color: "#ff0000"}}></i>
                    <p className="m-0" style={{fontSize: "16px"}}>
                        {message.likes.length}
                    </p>
                </div>
            ) : (
                <i className="fa-regular fa-heart" style={{color: "#ff0000"}}></i>
            )}
        </div>
    );
};

export default Reaction;
