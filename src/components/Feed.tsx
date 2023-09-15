import {Container} from "react-bootstrap";
import NewPostInput from "./NewPostInput";
import {Message, db, useFirebaseContext} from "../context/FirebaseContext";
import Card from "./Card";
import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";

export default function Feed() {
    const {currentUser, currentChannel} = useFirebaseContext();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!currentUser) {
            setMessages([]);
            return;
        }
        const subscribe = onSnapshot(doc(db, "channels", currentChannel), doc => {
            doc.exists() && setMessages(doc.data().messages as Message[]);
        });
        return subscribe;
    }, [currentChannel, currentUser]);

    useEffect(() => {
        let objDiv = document.getElementById("message-container") as HTMLElement;
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [messages]);
    return (
        <Container className="h-100 d-flex flex-column" style={{backgroundColor: "#313338"}}>
            <Container
                className="pt-3 flex-column overflow-auto"
                style={{height: "85vh"}}
                id="message-container"
            >
                {messages.map(message => {
                    return <Card key={`${message.timestamp} ${message.uid}`} {...message}></Card>;
                })}
            </Container>
            <NewPostInput></NewPostInput>
        </Container>
    );
}
