import {Container} from "react-bootstrap";
import {Channel, useFirebaseContext} from "../context/FirebaseContext";
import styles from "./ChannelList.module.css";
import {useModalsContext} from "../context/ModalsContext";
// import {useEffect, useState} from "react";

export default function ChannelList() {
    const {channels, currentChannel, changeChannel, currentUserProfile} = useFirebaseContext();
    const {openModal} = useModalsContext();
    // const [show, setShow] = useState(true);
    // const [width, setWidth] = useState(window.innerWidth);

    const handleAddChannel = () => {
        openModal("addnewchannel");
    };
    const handleChannelClicked = (channel: Channel) => {
        if (channel.id === currentChannel) return;
        changeChannel(channel.id);
    };

    // const handleShow = () => {
    //     setShow(prev => (prev = !prev));
    // };

    // useEffect(() => {
    //     setWidth(window.innerWidth);
    // }, [window.innerWidth]);

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
                    if (
                        channel.id === "moderator" &&
                        currentUserProfile?.roles.includes("moderator")
                    )
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
                {channels.map(channel => {
                    if (channel.id === "general")
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

                {channels.map(channel => {
                    if (channel.id === "general" || channel.id === "moderator") return;
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
// /            {width < 800 ? (
//     <Offcanvas show={show} onHide={() => setShow(false)}>
//         <Offcanvas.Header closeButton>
//             <Offcanvas.Title>
//                 <div className="d-flex flex-row justify-content-between text-white align-items-center">
//                     <h6>Text Channels</h6>
//                     <span
//                         className="fs-2 d-flex justify-content-center align-items-center"
//                         style={{cursor: "pointer"}}
//                         onClick={handleAddChannel}
//                     >
//                         +
//                     </span>
//                 </div>
//             </Offcanvas.Title>
//             <Offcanvas.Body>
//                 {channels.map(channel => {
//                     if (
//                         channel.id === "moderator" &&
//                         userProfile?.roles.includes("moderator")
//                     )
//                         return (
//                             <h5
//                                 key={channel.id}
//                                 className={`rounded ${
//                                     channel.id === currentChannel
//                                         ? styles.active
//                                         : styles.inactive
//                                 }`}
//                                 onClick={() => handleChannelClicked(channel)}
//                             >
//                                 #{channel.name}
//                             </h5>
//                         );
//                 })}
//                 {channels.map(channel => {
//                     if (channel.id === "general")
//                         return (
//                             <h5
//                                 key={channel.id}
//                                 className={`rounded ${
//                                     channel.id === currentChannel
//                                         ? styles.active
//                                         : styles.inactive
//                                 }`}
//                                 onClick={() => handleChannelClicked(channel)}
//                             >
//                                 #{channel.name}
//                             </h5>
//                         );
//                 })}

//                 {channels.map(channel => {
//                     if (channel.id === "general" || channel.id === "moderator") return;
//                     return (
//                         <h5
//                             key={channel.id}
//                             className={`rounded ${
//                                 channel.id === currentChannel
//                                     ? styles.active
//                                     : styles.inactive
//                             }`}
//                             onClick={() => handleChannelClicked(channel)}
//                         >
//                             #{channel.name}
//                         </h5>
//                     );
//                 })}
//             </Offcanvas.Body>
//         </Offcanvas.Header>
//     </Offcanvas>
