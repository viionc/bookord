import {Container} from "react-bootstrap";
import {Message, db, useFirebaseContext} from "../context/FirebaseContext";
import Card from "./Card";
import {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";
import NewMessageInput from "./NewMessageInput";

export default function Feed() {
    const {currentUser, currentChannel, clearChannel, updateCurrentChannel} = useFirebaseContext();

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!currentUser) {
            setMessages([]);
            return;
        }
        const subscribe = onSnapshot(doc(db, "channels", currentChannel.id), doc => {
            if (doc.exists()) {
                setMessages(doc.data().messages as Message[]);
                updateCurrentChannel(doc.data().messages as Message[]);
            }
        });

        return subscribe;
    }, [currentUser, currentChannel]);

    //setMessages(doc.data().messages as Message[])
    useEffect(() => {
        let objDiv = document.getElementById("message-container") as HTMLElement;
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [currentChannel]);
    return (
        <Container
            className="h-100 d-flex flex-column position-relative"
            style={{backgroundColor: "#313338"}}
        >
            <div
                className="position-absolute top-0 end-0 m-3 p-2 text-white bg-secondary rounded"
                onClick={clearChannel}
                style={{cursor: "pointer"}}
            >
                Clear
            </div>
            <Container
                className="pt-3 flex-column overflow-auto"
                style={{height: "85vh"}}
                id="message-container"
            >
                {messages.length ? (
                    messages.map(message => {
                        return <Card key={message.messageUid} {...message}></Card>;
                    })
                ) : (
                    <h4 className="text-white">Start your conversation here...</h4>
                )}
            </Container>
            <NewMessageInput></NewMessageInput>
        </Container>
    );
}
