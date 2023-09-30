import {Button, Col} from "react-bootstrap";
import {useFirebaseContext} from "../context/FirebaseContext";
import {useModalsContext} from "../context/ModalsContext";
import ChannelComponent from "./ChannelComponent";
import {Channel} from "../utilities/types";
import {useState} from "react";

export default function ChannelList() {
    const {channels, currentUserProfile} = useFirebaseContext();
    const {handleModalReducer} = useModalsContext();
    const [open, setOpen] = useState(true);

    const checkIfUserCanSeeChannel = (channel: Channel) => {
        if (!currentUserProfile) return false;
        if (!channel.isPrivate) return true;
        if (
            currentUserProfile?.roles.includes("moderator") ||
            currentUserProfile?.roles.includes("admin")
        ) {
            return true;
        } else if (channel.members.includes(currentUserProfile.uid)) {
            return true;
        }
    };

    const generalChat = channels.filter(channel => channel.id === "general")[0];
    const moderatorChat = channels.filter(channel => channel.id === "moderator")[0];
    const otherChannels = channels
        .filter(
            channel =>
                channel.id !== "general" &&
                channel.id !== "moderator" &&
                currentUserProfile &&
                checkIfUserCanSeeChannel(channel)
        )
        .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

    const handleAddChannel = () => {
        handleModalReducer({type: "ADD_NEW_CHANNEL"});
    };

    return (
        <Col
            xs={4}
            id="channel-list"
            className={`text-secondary mh-100 `}
            style={{
                backgroundColor: "rgb(42 43 49)",
                flex: "0 0 300px",
                width: open ? "100%" : "50px",
            }}
        >
            <Button
                className="side-button position-absolute bg-dark text-white fs-5 d-none justify-content-center align-items-center"
                style={{top: 15, left: 5, height: 30, width: 30}}
                onClick={() => setOpen(!open)}
            >
                {open ? "<" : ">"}
            </Button>
            {open ? (
                <>
                    <div className="text-white d-flex justify-content-evenly align-items-center">
                        <div className="fs-5">Text Channels</div>
                        <div
                            className="fs-1 d-flex justify-content-center align-items-center hover rounded-circle"
                            style={{cursor: "pointer", height: 60, width: 60}}
                            onClick={handleAddChannel}
                        >
                            +
                        </div>
                    </div>
                    <div
                        id="channels"
                        className="px-4 mh-100 overflow-auto"
                        style={{height: "80vh"}}
                    >
                        {currentUserProfile?.roles.includes("moderator") ? (
                            <ChannelComponent
                                key={moderatorChat.id}
                                channel={moderatorChat}
                            ></ChannelComponent>
                        ) : (
                            <></>
                        )}

                        <ChannelComponent
                            key={generalChat.id}
                            channel={generalChat}
                        ></ChannelComponent>

                        {otherChannels.map(channel => {
                            return (
                                <ChannelComponent
                                    key={channel.id}
                                    channel={channel}
                                ></ChannelComponent>
                            );
                        })}
                    </div>
                </>
            ) : (
                <></>
            )}
        </Col>
    );
}
