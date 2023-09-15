import {Container} from "react-bootstrap";
import {Message} from "../context/FirebaseContext";
import {timestampToDate} from "../utilities/utilities";

const Card: React.FC<Message> = (message: Message) => {
    return (
        <Container className="mt-2 d-flex pt flex-column text-white">
            <div className="d-flex jutify-content-center align-items-center gap-2">
                <h3>{message.username}</h3>
                <p className="text-secondary d-flex justify-content-center m-0">
                    {timestampToDate(message.timestamp)}
                </p>{" "}
            </div>

            <div style={{overflowWrap: "break-word"}}>{message.body}</div>
        </Container>
    );
};

export default Card;
