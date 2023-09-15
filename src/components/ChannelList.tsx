import {Container} from "react-bootstrap";
import {Channel, useFirebaseContext} from "../context/FirebaseContext";
import styles from "./ChannelList.module.css";
import {useModalsContext} from "../context/ModalsContext";
// import {useEffect} from "react";
// import {onSnapshot, doc} from "firebase/firestore";

export default function ChannelList() {
    const {channels, currentChannel, changeChannel} = useFirebaseContext();
    const {openModal} = useModalsContext();

    const handleAddChannel = () => {
        console.log("test");
        openModal("addnewchannel");
    };
    const handleChannelClicked = (channel: Channel) => {
        if (channel.id === currentChannel) return;
        changeChannel(channel.id);
    };

    return (
        <div
            className="d-flex p-5 text-secondary"
            style={{width: "20vw", backgroundColor: "rgb(42 43 49)"}}
        >
            <Container className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between text-white align-items-center">
                    <h6>Text Channels</h6>
                    <span
                        className="fs-2 d-flex justify-content-center align-items-center"
                        style={{cursor: "pointer"}}
                        onClick={handleAddChannel}
                    >
                        +
                    </span>
                </div>
                {channels.map(channel => {
                    return (
                        <h5
                            key={channel.id}
                            className={`rounded ${
                                channel.id === currentChannel ? styles.active : styles.inactive
                            }`}
                            onClick={() => handleChannelClicked(channel)}
                        >
                            #{channel.name}
                        </h5>
                    );
                })}
            </Container>
        </div>
    );
}