import {Col, Container} from "react-bootstrap";
import {Message, useFirebaseContext} from "../context/FirebaseContext";
import Card from "./Card";
import {useEffect, useState} from "react";
import NewMessageInput from "./NewMessageInput";

export default function Feed() {
    const {currentChannel, clearChannel, channels, currentUserProfile, userDatabase} =
        useFirebaseContext();

    const [messages, setMessages] = useState<Message[]>([]);

    // useEffect(()=>{

    // },[currentChannel])

    //setMessages(doc.data().messages as Message[])
    useEffect(() => {
        let objDiv = document.getElementById("message-container") as HTMLElement;
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const channelExists = channels.filter(ch => ch.id === currentChannel)[0];
        const messages = channelExists ? channelExists.messages : [];
        setMessages(messages);
    }, [channels, currentChannel, userDatabase]);

    return (
        <Col
            xs={"auto"}
            id="feed"
            className="d-flex flex-column position-relative"
            style={{backgroundColor: "#313338", flex: "1 1 auto"}}
        >
            {currentUserProfile && currentUserProfile.roles.includes("moderator") && (
                <div
                    className="position-absolute top-0 end-0 m-3 p-2 text-white bg-secondary rounded hover"
                    onClick={clearChannel}
                    style={{cursor: "pointer"}}
                >
                    Clear
                </div>
            )}

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
        </Col>
    );
}
